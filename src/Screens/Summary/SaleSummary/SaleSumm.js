import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import styles from "../summary.module.css";
import InputMask from "react-input-mask";
import financialYear from "../../Shared/financialYear";
import AccountEntriesModal from "../AccountEntriesModal";
import PrintSummary from "../PrintSummary";
import { TextField } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const API_URL =
  "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale";

const SaleSumm = () => {
  const [activeRow, setActiveRow] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [allVouchers, setAllVouchers] = useState([]);
  const [showPrint, setShowPrint] = useState(false);

  // filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [taxType, setTaxType] = useState("All");

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(formatDate(fy.start)); // converted
    setToDate(formatDate(fy.end)); // converted
  }, []);

  const [rows, setRows] = useState([]);
  const [totalSale, setTotalSale] = useState(0);

  // handles dd-mm-yyyy / dd/mm/yyyy / yyyy-mm-dd
  const parseAnyDate = (dateStr) => {
    if (!dateStr) return null;

    // ✅ ISO date with time (API format)
    if (dateStr.includes("T")) {
      const d = new Date(dateStr);
      return isNaN(d) ? null : d;
    }

    // yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const d = new Date(dateStr);
      return isNaN(d) ? null : d;
    }

    // dd-mm-yyyy or dd/mm/yyyy
    const parts = dateStr.includes("-")
      ? dateStr.split("-")
      : dateStr.split("/");

    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;
      const d = new Date(yyyy, mm - 1, dd);
      return isNaN(d) ? null : d;
    }

    return null;
  };

  const isDateInRange = (voucherDate, fromDate, toDate) => {
    const vDate = parseAnyDate(voucherDate);
    const fDate = parseAnyDate(fromDate);
    const tDate = parseAnyDate(toDate);

    if (!vDate || !fDate || !tDate) return false;

    // 🔥 Normalize times
    vDate.setHours(0, 0, 0, 0);
    fDate.setHours(0, 0, 0, 0);
    tDate.setHours(23, 59, 59, 999);

    return vDate >= fDate && vDate <= tDate;
  };

  useEffect(() => {
    fetchSaleSummary();
  }, [fromDate, toDate, taxType]);

  const fetchSaleSummary = async () => {
    try {
      const res = await axios.get(API_URL);
      const data = res.data;

      setAllVouchers(data);

      const saleMap = {};
      let totalSaleValue = 0;

      const gstAccounts = {
        cgst: { code: "", name: "", value: 0 },
        sgst: { code: "", name: "", value: 0 },
        igst: { code: "", name: "", value: 0 },
      };

      data.forEach((voucher) => {
        const { formData, items } = voucher;

        // 🔹 FILTERS
        if (!isDateInRange(formData.date, fromDate, toDate)) return;
        if (taxType !== "All" && formData.stype !== taxType) return;

        // 🔹 GST CAPTURE (CODE + NAME)
        if (!gstAccounts.cgst.code && formData.cgst_code) {
          gstAccounts.cgst.code = formData.cgst_code;
          gstAccounts.cgst.name = formData.cgst_ac;
        }
        if (!gstAccounts.sgst.code && formData.sgst_code) {
          gstAccounts.sgst.code = formData.sgst_code;
          gstAccounts.sgst.name = formData.sgst_ac;
        }
        if (!gstAccounts.igst.code && formData.igst_code) {
          gstAccounts.igst.code = formData.igst_code;
          gstAccounts.igst.name = formData.igst_ac;
        }

        gstAccounts.cgst.value += Number(formData.cgst || 0);
        gstAccounts.sgst.value += Number(formData.sgst || 0);
        gstAccounts.igst.value += Number(formData.igst || 0);

        // 🔹 SALES ITEMS
        items.forEach((item) => {
          const key = `SALE_${item.Scodes01}`;

          if (!saleMap[key]) {
            saleMap[key] = {
              account: item.Scodes01, // 🔥 CODE
              accountName: item.Scodess, // 🔥 NAME
              pcs: 0,
              qty: 0,
              value: 0,
              cgst: 0,
              sgst: 0,
              igst: 0,
            };
          }

          saleMap[key].pcs += Number(item.pkgs || 0);
          saleMap[key].qty += Number(item.weight || 0);
          saleMap[key].value += Number(item.amount || 0);
          saleMap[key].cgst += Number(item.ctax || 0);
          saleMap[key].sgst += Number(item.stax || 0);
          saleMap[key].igst += Number(item.itax || 0);

          totalSaleValue += Number(item.amount || 0);

          // 🔹 ITEM EXPENSES (Exp1 → Exp5)
          for (let i = 1; i <= 5; i++) {
            const expValue = Number(item[`Exp${i}`] || 0);
            const expCode = formData[`expense${i}_code`];
            const expName = formData[`expense${i}_ac`];

            if (expValue > 0 && expCode) {
              const expKey = `EXP_${expCode}`;

              if (!saleMap[expKey]) {
                saleMap[expKey] = {
                  account: expCode,
                  accountName: expName,
                  pcs: 0,
                  qty: 0,
                  value: 0,
                  cgst: 0,
                  sgst: 0,
                  igst: 0,
                };
              }

              saleMap[expKey].value += expValue;
              totalSaleValue += expValue;
            }
          }
        });

        // 🔹 VOUCHER EXPENSES (Exp6 → Exp10)
        for (let i = 6; i <= 10; i++) {
          const expValue = Number(formData[`Exp${i}`] || 0);
          const expCode = formData[`expense${i}_code`];
          const expName = formData[`expense${i}_ac`];

          if (expValue > 0 && expCode) {
            const expKey = `EXP_${expCode}`;

            if (!saleMap[expKey]) {
              saleMap[expKey] = {
                account: expCode,
                accountName: expName,
                pcs: 0,
                qty: 0,
                value: 0,
                cgst: 0,
                sgst: 0,
                igst: 0,
              };
            }

            saleMap[expKey].value += expValue;
            totalSaleValue += expValue;
          }
        }
      });

      const finalRows = [
        ...Object.values(saleMap),

        gstAccounts.cgst.value > 0 && {
          account: gstAccounts.cgst.code,
          accountName: gstAccounts.cgst.name,
          value: gstAccounts.cgst.value,
        },

        gstAccounts.sgst.value > 0 && {
          account: gstAccounts.sgst.code,
          accountName: gstAccounts.sgst.name,
          value: gstAccounts.sgst.value,
        },

        gstAccounts.igst.value > 0 && {
          account: gstAccounts.igst.code,
          accountName: gstAccounts.igst.name,
          value: gstAccounts.igst.value,
        },
      ].filter(Boolean);

      setRows(finalRows);
      setTotalSale(totalSaleValue);
    } catch (error) {
      console.error("Error fetching sale summary:", error);
    }
  };
  const getAccountEntries = () => {
    if (!selectedAccount) return [];

    const entries = [];

    allVouchers.forEach((voucher) => {
      const { formData, items, customerDetails } = voucher;
      const customer = customerDetails?.[0]?.vacode || "";

      // 🔹 SALES
      items.forEach((item) => {
        if (item.Scodes01 === selectedAccount) {
          entries.push({
            _id: voucher._id,
            type: "SALE",
            date: formData.date,
            vno: formData.vbillno,
            customer,
            sdisc: item.sdisc,
            pcs: item.pkgs,
            qty: item.weight,
            rate: item.rate,
            value: item.amount,
            cgst: item.ctax,
            sgst: item.stax,
            igst: item.itax,
            total: item.vamt,
          });
        }

        // 🔹 ITEM EXP (Exp1 → Exp5)
        for (let i = 1; i <= 5; i++) {
          const expCode = formData[`expense${i}_code`];
          const expValue = Number(item[`Exp${i}`] || 0);

          if (expCode === selectedAccount && expValue > 0) {
            entries.push({
              _id: voucher._id,
              type: `EXP${i}`,
              date: formData.date,
              vno: formData.vbillno,
              customer,
              value: expValue,
              total: expValue,
            });
          }
        }
      });

      // 🔹 VOUCHER EXP (Exp6 → Exp10)
      for (let i = 6; i <= 10; i++) {
        const expCode = formData[`expense${i}_code`];
        const expValue = Number(formData[`Exp${i}`] || 0);

        if (expCode === selectedAccount && expValue > 0) {
          entries.push({
            _id: voucher._id,
            type: `EXP${i}`,
            date: formData.date,
            vno: formData.vbillno,
            customer,
            value: expValue,
            total: expValue,
          });
        }
      }

      // 🔹 CGST
      if (formData.cgst_code === selectedAccount && Number(formData.cgst) > 0) {
        entries.push({
          _id: voucher._id,
          type: "CGST",
          date: formData.date,
          vno: formData.vbillno,
          customer,
          value: Number(formData.cgst),
          total: Number(formData.cgst),
        });
      }

      // 🔹 SGST
      if (formData.sgst_code === selectedAccount && Number(formData.sgst) > 0) {
        entries.push({
          _id: voucher._id,
          type: "SGST",
          date: formData.date,
          vno: formData.vbillno,
          customer,
          value: Number(formData.sgst),
          total: Number(formData.sgst),
        });
      }

      // 🔹 IGST
      if (formData.igst_code === selectedAccount && Number(formData.igst) > 0) {
        entries.push({
          _id: voucher._id,
          type: "IGST",
          date: formData.date,
          vno: formData.vbillno,
          customer,
          value: Number(formData.igst),
          total: Number(formData.igst),
        });
      }
    });

    entries.sort((a, b) => {
      const d1 = parseAnyDate(a.date);
      const d2 = parseAnyDate(b.date);
      if (d1 < d2) return -1;
      if (d1 > d2) return 1;
      return a.vno.toString().localeCompare(b.vno.toString());
    });

    return entries;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showModal) return;
      if (!rows.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveRow((prev) => (prev < rows.length - 1 ? prev + 1 : prev));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveRow((prev) => (prev > 0 ? prev - 1 : prev));
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const row = rows[activeRow];
        if (row?.account) {
          setSelectedAccount(row.account);
          setShowModal(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rows, activeRow, showModal]);

  useEffect(() => {
    if (!showModal) return;

    const esc = (e) => e.key === "Escape" && setShowModal(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [showModal]);

  const MIN_ROWS = 8;
  const displayRows = (() => {
    if (rows.length >= MIN_ROWS) return rows;

    const emptyRows = Array.from({ length: MIN_ROWS - rows.length }, () => ({
      accountName: "",
      pcs: "",
      qty: "",
      value: "",
      cgst: "",
      sgst: "",
      igst: "",
    }));

    return [...rows, ...emptyRows];
  })();

  return (
    <div className={styles.cardContainer}>
      <Card className={styles.cardSumm}>
        <h1 className={styles.headerSummary}>SALE SUMMARY</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            marginBottom: 10,
            marginTop: 10,
          }}
        >
          <InputMask
            mask="99-99-9999"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          >
            {(props) => (
              <TextField
                className="custom-bordered-input"
                {...props}
                label="FROM"
                size="small"
                variant="filled"
                fullWidth
                style={{ width: 200 }}
              />
            )}
          </InputMask>
          <InputMask
            mask="99-99-9999"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          >
            {(props) => (
              <TextField
                className="custom-bordered-input"
                {...props}
                label="UPTO"
                size="small"
                variant="filled"
                fullWidth
                style={{ marginLeft: 20, width: 200 }}
              />
            )}
          </InputMask>

          <div style={{ width: 300, marginLeft: 20 }}>
            <FormControl
              className="custom-bordered-input"
              variant="filled"
              fullWidth
              size="small"
            >
              <InputLabel>Tax Type</InputLabel>
              <Select
                className="custom-bordered-input"
                value={taxType}
                label="Tax Type"
                onChange={(e) => setTaxType(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="GST Sale (RD)">GST Sale (RD)</MenuItem>
                <MenuItem value="IGST Sale (RD)">IGST Sale (RD)</MenuItem>
                <MenuItem value="GST (URD)">GST (URD)</MenuItem>
                <MenuItem value="IGST (URD)">IGST (URD)</MenuItem>
                <MenuItem value="Tax Free Within State">
                  Tax Free Within State
                </MenuItem>
                <MenuItem value="Tax Free Interstate">
                  Tax Free Interstate
                </MenuItem>
                <MenuItem value="Export Sale">Export Sale</MenuItem>
                <MenuItem value="Export Sale(IGST)">Export Sale(IGST)</MenuItem>
                <MenuItem value="Including GST">Including GST</MenuItem>
                <MenuItem value="Including IGST">Including IGST</MenuItem>
                <MenuItem value="Not Applicable">Not Applicable</MenuItem>
                <MenuItem value="Exempted Sale">Exempted Sale</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className={styles.tables} style={{ padding: 0 }}>
          <Table className="custom-table" size="sm">
            <thead style={{ backgroundColor: "#83bcf5ff" }}>
              <tr>
                <th className="text-center">Account Name</th>
                <th className="text-center">Case/Pcs</th>
                <th className="text-center">Qty</th>
                <th className="text-center">Value</th>
                <th className="text-center">C.GST</th>
                <th className="text-center">S.GST</th>
                <th className="text-center">I.GST</th>
                <th className="text-center">Cess</th>
              </tr>
            </thead>

            <tbody>
              {displayRows.map((r, i) => (
                <tr
                  key={i}
                  className={i === activeRow ? styles.activeRow : ""}
                  style={{ height: 32 }}
                >
                  <td>{r.accountName}</td>
                  <td className="text-end">{r.pcs ? r.pcs.toFixed(3) : ""}</td>
                  <td className="text-end">{r.qty ? r.qty.toFixed(3) : ""}</td>
                  <td className="text-end">
                    {r.value ? r.value.toFixed(2) : ""}
                  </td>
                  <td className="text-end">
                    {r.cgst ? r.cgst.toFixed(2) : ""}
                  </td>
                  <td className="text-end">
                    {r.sgst ? r.sgst.toFixed(2) : ""}
                  </td>
                  <td className="text-end">
                    {r.igst ? r.igst.toFixed(2) : ""}
                  </td>
                  <td></td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        <Card.Footer className="fw-bold" style={{ fontSize: "20px",display:'flex', flexDirection:'row', justifyContent:'space-between' }}>
          Total Sale Rs. {totalSale.toFixed(2)}
          <Button
            style={{ letterSpacing: 2, marginLeft: 20 }}
            onClick={() => setShowPrint(true)}
          >
            PRINT
          </Button>
        </Card.Footer>
      </Card>
      <PrintSummary
        isOpen={showPrint}
        handleClose={() => setShowPrint(false)}
        rows={rows}
        totalSale={totalSale}
        fromDate={formatDate(fromDate)}
        toDate={toDate}
        header={"Sale Summary Report"}
        Total={"Total Sale Rs"}
      />
      <AccountEntriesModal
        show={showModal}
        onClose={() => setShowModal(false)}
        accountCode={selectedAccount}
        accountName={
          rows.find((r) => r.account === selectedAccount)?.accountName ||
          selectedAccount
        }
        entries={getAccountEntries()}
        fromDate={fromDate}
        uptoDate={toDate}
      />
    </div>
  );
};

export default SaleSumm;
