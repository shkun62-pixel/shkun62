import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import styles from "../summary.module.css";
import InputMask from "react-input-mask";
import financialYear from "../../Shared/financialYear";
import { useRef } from "react";
import AccountEntriesModal from "../AccountEntriesModal";

const API_URL =
  "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale";

const SaleSumm = () => {

  const [activeRow, setActiveRow] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [allVouchers, setAllVouchers] = useState([]);

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
    setToDate(formatDate(fy.end));     // converted
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
    const res = await axios.get(API_URL);
    const data = res.data;

    setAllVouchers(data); // ✅ store full response

    const saleMap = {};
    let totalSaleValue = 0;

    const gstAccounts = {
      cgst: { name: "", value: 0 },
      sgst: { name: "", value: 0 },
      igst: { name: "", value: 0 },
    };

    data.forEach((voucher) => {
      const { formData, items } = voucher;

      // 🔥 DATE FILTER APPLIED HERE
      if (!isDateInRange(formData.date, fromDate, toDate)) return;

      // 🔥 TAX TYPE FILTER
      if (taxType !== "All" && formData.stype !== taxType) return;

      // Capture GST account names
      if (!gstAccounts.cgst.name && formData.cgst_ac)
        gstAccounts.cgst.name = formData.cgst_ac;

      if (!gstAccounts.sgst.name && formData.sgst_ac)
        gstAccounts.sgst.name = formData.sgst_ac;

      if (!gstAccounts.igst.name && formData.igst_ac)
        gstAccounts.igst.name = formData.igst_ac;

      gstAccounts.cgst.value += Number(formData.cgst || 0);
      gstAccounts.sgst.value += Number(formData.sgst || 0);
      gstAccounts.igst.value += Number(formData.igst || 0);

      items.forEach((item) => {
        const key = `${item.gst}_${item.Scodess}`;

        if (!saleMap[key]) {
          saleMap[key] = {
            account: item.Scodess,
            pcs: 0,
            qty: 0,
            value: 0,
            cgst: 0,
            sgst: 0,
            igst: 0,
          };
        }

        saleMap[key].qty += Number(item.weight || 0);
        saleMap[key].pcs += Number(item.pkgs || 0);
        saleMap[key].value += Number(item.amount || 0);
        saleMap[key].cgst += Number(item.ctax || 0);
        saleMap[key].sgst += Number(item.stax || 0);
        saleMap[key].igst += Number(item.itax || 0);

        totalSaleValue += Number(item.amount || 0);
      });
    });

    const finalRows = [
      ...Object.values(saleMap),
      { account: gstAccounts.cgst.name, value: gstAccounts.cgst.value },
      { account: gstAccounts.sgst.name, value: gstAccounts.sgst.value },
      { account: gstAccounts.igst.name, value: gstAccounts.igst.value },
    ];

    setRows(finalRows);
    setTotalSale(totalSaleValue);
  };

  const getAccountEntries = () => {
    if (!selectedAccount) return [];

    const entries = [];

    allVouchers.forEach((voucher) => {
      const { formData, items, customerDetails } = voucher;

      // SALE ACCOUNT ENTRIES
      items.forEach((item) => {
        if (item.Scodess === selectedAccount) {
          entries.push({
            type: "SALE",
            date: formData.date,
            vno: formData.vbillno,
            customer: customerDetails?.[0]?.vacode || "",
            qty: item.weight,
            value: item.amount,
            cgst: item.ctax,
            sgst: item.stax,
            igst: item.itax,
            total: item.vamt,
          });
        }
      });

      // GST ACCOUNT ENTRIES
      if (formData.cgst_ac === selectedAccount) {
        entries.push({
          type: "CGST",
          date: formData.date,
          vno: formData.vbillno,
          customer: customerDetails?.[0]?.vacode || "",
          value: formData.cgst,
        });
      }

      if (formData.sgst_ac === selectedAccount) {
        entries.push({
          type: "SGST",
          date: formData.date,
          vno: formData.vbillno,
          customer: customerDetails?.[0]?.vacode || "",
          value: formData.sgst,
        });
      }

      if (formData.igst_ac === selectedAccount) {
        entries.push({
          type: "IGST",
          date: formData.date,
          vno: formData.vbillno,
          customer: customerDetails?.[0]?.vacode || "",
          value: formData.igst,
        });
      }
    });

    return entries;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showModal) return;
      if (!rows.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveRow((prev) =>
          prev < rows.length - 1 ? prev + 1 : prev
        );
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

  return (
    <div className={styles.cardContainer}>
    <Card className={styles.cardSumm}>
      <h1 className={styles.headerSummary}>
        SALE SUMMARY
      </h1>
      <div className={styles.filters}>
        <div style={{display:'flex',flexDirection:"column"}}>
          <div style={{ display: "flex", alignItems: "center",marginBottom:"5px" }}>
        <label className="form-label" style={{ width: "120px" }}>From Date</label>
        <InputMask
          mask="99-99-9999"
          placeholder="dd-mm-yyyy"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        >
          {(inputProps) => <input {...inputProps} className="form-control" />}
        </InputMask>
          </div>
          <div style={{ display: "flex", alignItems: "center",marginBottom:"10px" }}>
            <label className="form-label" style={{ width: "120px"}}>To Date</label>
            <InputMask
              mask="99-99-9999"
              placeholder="dd-mm-yyyy"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            >
              {(inputProps) => <input {...inputProps} className="form-control" />}
            </InputMask>
          </div>
        </div>
        <div style={{display:'flex',flexDirection:"column"}}>
          <div style={{ marginBottom: "5px" }}>
            <label className="form-label" style={{ width: "70px" }}>
              Tax Type
            </label>
            <Form.Select
              className={styles.Taxtype}
              value={taxType}
              onChange={(e) => setTaxType(e.target.value)}
            >
              <option value="All">All</option>
              <option value="GST Sale (RD)">GST Sale (RD)</option>
              <option value="IGST Sale (RD)">IGST Sale (RD)</option>
              <option value="GST (URD)">GST (URD)</option>
              <option value="IGST (URD)">IGST (URD)</option>
              <option value="Tax Free Within State">Tax Free Within State</option>
              <option value="Tax Free Interstate">Tax Free Interstate</option>
              <option value="Export Sale">Export Sale</option>
              <option value="Export Sale(IGST)">Export Sale(IGST)</option>
              <option value="Including GST">Including GST</option>
              <option value="Including IGST">Including IGST</option>
              <option value="Not Applicable">Not Applicable</option>
              <option value="Exempted Sale">Exempted Sale</option>
            </Form.Select>
          </div>
          <div>
            <label className="form-label" style={{ width: "70px" }}>
              Series
            </label>
            <Form.Select
              className={styles.Taxtype}
              disabled
            >
              <option value="All">All</option>
              <option value="GST Sale (RD)">GST Sale (RD)</option>
              <option value="IGST Sale (RD)">IGST Sale (RD)</option>
              <option value="GST (URD)">GST (URD)</option>
            </Form.Select>
          </div>
        </div>
      </div>

      <div className={styles.tables} style={{ padding: 0 }}>
        <Table className="custom-table" size="sm">
          <thead style={{ backgroundColor: "#83bcf5ff" }}>
            <tr>
              <th className="text-center">Account Name</th>
              <th className="text-center">Case/Pc</th>
              <th className="text-center">Qty</th>
              <th className="text-center">Value</th>
              <th className="text-center">C.GST</th>
              <th className="text-center">S.GST</th>
              <th className="text-center">I.GST</th>
              <th className="text-center">Cess</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
               <tr
                key={i}
                className={i === activeRow ? styles.activeRow : ""}
              >
                <td>{r.account}</td>
                <td className="text-end">
                  {r.pcs ? r.pcs.toFixed(3) : ""}
                </td>
                <td className="text-end">
                  {r.qty ? r.qty.toFixed(3) : ""}
                </td>
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

      <Card.Footer className="fw-bold" style={{ fontSize: '20px' }}>
        Total Sale Rs. {totalSale.toFixed(2)}
      </Card.Footer>
    </Card>
    <AccountEntriesModal
      show={showModal}
      onClose={() => setShowModal(false)}
      accountName={selectedAccount}
      entries={getAccountEntries()}
      formatDate={formatDate}
    />
    </div>
  );
};

export default SaleSumm;
