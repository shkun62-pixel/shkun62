import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./GstRegister.css";
import GstRegisterPrint from "./GstRegisterPrint";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { TextField, MenuItem } from "@mui/material";
import {
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import useCompanySetup from "../Shared/useCompanySetup";

export default function GstRegister() {

  const {companyName, companyAdd, companyCity} = useCompanySetup();
  const printRef = useRef();
  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  const [fromDate, setFromDate] = useState("01-04-2025");
  const [toDate, setToDate] = useState("31-03-2026");
  const [sale, setSale] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    opening: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
    purchase: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
    sale: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
    closing: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
  });
  const [printOpen, setPrintOpen] = useState(false);
  const [viewMode, setViewMode] = useState("Record Wise"); // default
  const [selectedRowId, setSelectedRowId] = useState(null);
  const navigate = useNavigate();

  // ---- Helpers ----
  const parseDate = (input) => {
    if (!input) return null;

    // Already Date
    if (input instanceof Date) {
      return isNaN(input) ? null : input;
    }

    if (typeof input !== "string") return null;

    const value = input.trim();

    // 1️⃣ Try native (ISO / yyyy-mm-dd)
    const native = new Date(value);
    if (!isNaN(native)) return native;

    // 2️⃣ dd-mm-yyyy OR dd/mm/yyyy
    const dmy = value.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
    if (dmy) {
      const [, day, month, year] = dmy;
      return new Date(year, month - 1, day);
    }

    // 3️⃣ yyyy-mm-dd OR yyyy/mm/dd
    const ymd = value.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
    if (ymd) {
      const [, year, month, day] = ymd;
      return new Date(year, month - 1, day);
    }

    return null;
  };

  const fmt = (v) => {
    if (v === null || v === undefined || v === "") return "";
    const n = Number(v);
    if (isNaN(n)) return "";
    return n.toFixed(2);
  };

  // Fetch data
  useEffect(() => {
    fetchSale();
    fetchPurchase();
  }, []);

  const fetchSale = async () => {
    try {
      const res = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/sale`,
      );
      setSale(res.data || []);
    } catch (err) {
      console.error(err);
      setSale([]);
    }
  };

  const fetchPurchase = async () => {
    try {
      const res = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/purchase`,
      );
      setPurchase(res.data || []);
    } catch (err) {
      console.error(err);
      setPurchase([]);
    }
  };

  useEffect(() => {
    if (sale.length || purchase.length) buildRegister();
  }, [sale, purchase, fromDate, toDate, viewMode]);

  const buildRegister = () => {
    const prevFYEnd = new Date("2025-03-31T23:59:59.999Z");
    const periodStart = parseDate(fromDate);
    const periodEnd = parseDate(toDate);

    if (periodStart) periodStart.setHours(0, 0, 0, 0);
    if (periodEnd) periodEnd.setHours(23, 59, 59, 999);

    const sumGSTFromArr = (arr, isPurchase) =>
      arr.reduce(
        (acc, x) => {
          const cgst = isPurchase
            ? Number(x.formData?.cgst || 0)
            : Number(x.items?.[0]?.ctax || 0);
          const sgst = isPurchase
            ? Number(x.formData?.sgst || 0)
            : Number(x.items?.[0]?.stax || 0);
          const igst = isPurchase
            ? Number(x.formData?.igst || 0)
            : Number(x.items?.[0]?.itax || 0);
          const cess = Number(x.formData?.pcess || 0);

          return {
            cgst: acc.cgst + cgst,
            sgst: acc.sgst + sgst,
            igst: acc.igst + igst,
            cess: acc.cess + cess,
          };
        },
        { cgst: 0, sgst: 0, igst: 0, cess: 0 },
      );

    const prevPurchEntries = purchase.filter((p) => {
      const dt = parseDate(p.formData?.date);
      return dt && dt <= prevFYEnd;
    });
    const prevSaleEntries = sale.filter((s) => {
      const dt = parseDate(s.formData?.date);
      return dt && dt <= prevFYEnd;
    });

    const prevPurchaseGST = sumGSTFromArr(prevPurchEntries, true);
    const prevSaleGST = sumGSTFromArr(prevSaleEntries, false);

    const openingBalance = {
      cgst: prevPurchaseGST.cgst - prevSaleGST.cgst,
      sgst: prevPurchaseGST.sgst - prevSaleGST.sgst,
      igst: prevPurchaseGST.igst - prevSaleGST.igst,
      cess: prevPurchaseGST.cess - prevSaleGST.cess,
    };

    // Prepare current entries
    const purchCurrent = purchase
      .map((p) => ({
        _id: p._id, // ✅ ADD
        type: "purchase",
        date: parseDate(p.formData?.date),
        rawDate: p.formData?.date,
        bill: p.formData?.vno,
        cgst: Number(p.formData?.cgst || 0),
        sgst: Number(p.formData?.sgst || 0),
        igst: Number(p.formData?.igst || 0),
        cess: Number(p.formData?.pcess || 0),
      }))
      .filter((x) => x.date >= periodStart && x.date <= periodEnd);

    const saleCurrent = sale
      .map((s) => {
        const item = s.items?.[0] || {};
        return {
          _id: s._id, // ✅ ADD
          type: "sale",
          date: parseDate(s.formData?.date),
          rawDate: s.formData?.date,
          bill: s.formData?.vno,
          cgst: Number(item.ctax || 0),
          sgst: Number(item.stax || 0),
          igst: Number(item.itax || 0),
          cess: Number(s.formData?.pcess || 0),
        };
      })
      .filter((x) => x.date >= periodStart && x.date <= periodEnd);

    // Combine
    const combinedRaw = [...purchCurrent, ...saleCurrent].sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return a.type === "purchase" ? -1 : 1;
    });

    // --- Grouping ---
    const groupEntries = (entries) => {
      if (viewMode === "Record Wise") return entries;

      const grouped = {};
      entries.forEach((entry) => {
        const dt = parseDate(entry.rawDate);
        if (!dt) return;

        let key = "";
        if (viewMode === "Date Wise") {
          key = dt.toISOString().split("T")[0]; // YYYY-MM-DD
        } else if (viewMode === "Month Wise") {
          key = `${dt.getFullYear()}-${("0" + (dt.getMonth() + 1)).slice(-2)}`; // YYYY-MM
        }

        if (!grouped[key]) {
          grouped[key] = {
            type: "group",
            date: dt,
            rawDate: key,
            cgst: 0,
            sgst: 0,
            igst: 0,
            cess: 0,
            bill: "",
            original: [],
          };
        }

        grouped[key].cgst += entry.cgst;
        grouped[key].sgst += entry.sgst;
        grouped[key].igst += entry.igst;
        grouped[key].cess += entry.cess;
        grouped[key].original.push(entry);
      });

      return Object.values(grouped).sort((a, b) => a.date - b.date);
    };

    const combined = groupEntries(combinedRaw);

    // --- Build Rows ---
    const builtRows = [];
    let running = { ...openingBalance };

    combined.forEach((entry, idx) => {
      const openingForRow = { ...running };

      if (entry.type === "purchase") {
        running = {
          cgst: running.cgst + entry.cgst,
          sgst: running.sgst + entry.sgst,
          igst: running.igst + entry.igst,
          cess: running.cess + entry.cess,
        };
      } else if (entry.type === "sale") {
        running = {
          cgst: running.cgst - entry.cgst,
          sgst: running.sgst - entry.sgst,
          igst: running.igst - entry.igst,
          cess: running.cess - entry.cess,
        };
      } else if (entry.type === "group") {
        // sum grouped entries
        const totalPurchase = entry.original
          .filter((e) => e.type === "purchase")
          .reduce(
            (acc, x) => ({
              cgst: acc.cgst + x.cgst,
              sgst: acc.sgst + x.sgst,
              igst: acc.igst + x.igst,
              cess: acc.cess + x.cess,
            }),
            { cgst: 0, sgst: 0, igst: 0, cess: 0 },
          );

        const totalSale = entry.original
          .filter((e) => e.type === "sale")
          .reduce(
            (acc, x) => ({
              cgst: acc.cgst + x.cgst,
              sgst: acc.sgst + x.sgst,
              igst: acc.igst + x.igst,
              cess: acc.cess + x.cess,
            }),
            { cgst: 0, sgst: 0, igst: 0, cess: 0 },
          );

        running = {
          cgst: openingForRow.cgst + totalPurchase.cgst - totalSale.cgst,
          sgst: openingForRow.sgst + totalPurchase.sgst - totalSale.sgst,
          igst: openingForRow.igst + totalPurchase.igst - totalSale.igst,
          cess: openingForRow.cess + totalPurchase.cess - totalSale.cess,
        };

        builtRows.push({
          sr: idx + 1,
          _id: entry._id, // ✅ STORE ID
          date: entry.rawDate,
          bill: "",
          opening: openingForRow,
          purchase: totalPurchase,
          sale: totalSale,
          closing: { ...running },
        });

        return;
      }

      builtRows.push({
        sr: idx + 1,
        _id: entry._id,
        entryType: entry.type, // ✅ sale / purchase
        date:
          entry.rawDate && entry.type !== "group"
            ? parseDate(entry.rawDate).toLocaleDateString()
            : entry.rawDate,
        bill: entry.bill,
        opening: openingForRow,
        purchase:
          entry.type === "purchase"
            ? entry
            : { cgst: 0, sgst: 0, igst: 0, cess: 0 },
        sale:
          entry.type === "sale"
            ? entry
            : { cgst: 0, sgst: 0, igst: 0, cess: 0 },
        closing: { ...running },
      });
    });

    // --- Summary ---
    const totalPurchase = purchCurrent.reduce(
      (acc, x) => ({
        cgst: acc.cgst + x.cgst,
        sgst: acc.sgst + x.sgst,
        igst: acc.igst + x.igst,
        cess: acc.cess + x.cess,
      }),
      { cgst: 0, sgst: 0, igst: 0, cess: 0 },
    );

    const totalSale = saleCurrent.reduce(
      (acc, x) => ({
        cgst: acc.cgst + x.cgst,
        sgst: acc.sgst + x.sgst,
        igst: acc.igst + x.igst,
        cess: acc.cess + x.cess,
      }),
      { cgst: 0, sgst: 0, igst: 0, cess: 0 },
    );

    const closingTotals = {
      cgst: openingBalance.cgst + totalPurchase.cgst - totalSale.cgst,
      sgst: openingBalance.sgst + totalPurchase.sgst - totalSale.sgst,
      igst: openingBalance.igst + totalPurchase.igst - totalSale.igst,
      cess: openingBalance.cess + totalPurchase.cess - totalSale.cess,
    };

    setRows(builtRows);
    setSummary({
      opening: openingBalance,
      purchase: totalPurchase,
      sale: totalSale,
      closing: closingTotals,
    });
  };

  const handleRowDoubleClick = (row) => {
    if (viewMode !== "Record Wise") return;
    if (!row._id || !row.entryType) return;

    setSelectedRowId(row._id); // keep highlight

    if (row.entryType === "sale") {
      navigate("/Sale", {
        state: { saleId: row._id },
      });
    }

    if (row.entryType === "purchase") {
      navigate("/Purchase", {
        state: { purId: row._id },
      });
    }
  };
  
  const handlePrint = () => {
    const WinPrint = window.open("", "", "width=1200,height=800");

    WinPrint.document.write(`
      <html>
      <head>
      <style>
        @page { size: A4 landscape; margin: 10mm; }

        body { font-family: serif; font-size: 12px; margin:0; padding:0; }

        .print-header { text-align: center; margin-bottom: 14px; }
        .company-name { font-size: 16px; font-weight: bold; text-transform: uppercase; }
        .company-address, .company-city { font-size: 12px; }
        .report-title { margin-top: 6px; font-size: 13px; font-weight: bold; }

        table { border-collapse: collapse; width: 100% !important; }
        th, td { border: 1px solid black; padding: 4px; font-size: 11px; }
        th { background: #f0f0f0; text-align: center; }
        .text-end { text-align: right; }

        /* IMPORTANT FIX FOR PRINT */
        .MuiCard-root{
          height:auto !important;
          max-height:none !important;
          box-shadow:none !important;
        }

        .MuiTableContainer-root{
          height:auto !important;
          max-height:none !important;
          overflow:visible !important;
        }

        /* --- Summary Row --- */
        .summary-grid {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 12px;
        }

        .summary-card {
          flex: 1;
          border: 1px solid #ccc;
          border-radius: 4px;
          padding: 8px;
          font-size: 11px;
          text-align: center;
          background: #f7f9fc;
        }

        @media print {
          body { font-size: 11px; }
          .summary-grid { flex-direction: row !important; }
        }

      </style>
      </head>
      <body>

        <div class="print-header">
          <div class="company-name">${companyName}</div>
          <div class="company-address">${companyAdd}</div>
          <div class="company-city">${companyCity}</div>
          <div class="report-title">
            GST REGISTER FROM ${fromDate} TO ${toDate}
          </div>
        </div>
    `);

    // TABLE
    WinPrint.document.write(printRef.current.innerHTML);

    // SUMMARY
    WinPrint.document.write(`
      <div class="summary-grid">

        <div class="summary-card">
          <b>OPENING</b><br>
          CGST: ${fmt(summary.opening.cgst)}<br>
          SGST: ${fmt(summary.opening.sgst)}<br>
          IGST: ${fmt(summary.opening.igst)}<br>
          CESS: ${fmt(summary.opening.cess)}<br>
          <b>Total: ${fmt(
            summary.opening.cgst +
            summary.opening.sgst +
            summary.opening.igst +
            summary.opening.cess
          )}</b>
        </div>

        <div class="summary-card">
          <b>PURCHASE</b><br>
          CGST: ${fmt(summary.purchase.cgst)}<br>
          SGST: ${fmt(summary.purchase.sgst)}<br>
          IGST: ${fmt(summary.purchase.igst)}<br>
          CESS: ${fmt(summary.purchase.cess)}<br>
          <b>Total: ${fmt(
            summary.purchase.cgst +
            summary.purchase.sgst +
            summary.purchase.igst +
            summary.purchase.cess
          )}</b>
        </div>

        <div class="summary-card">
          <b>SALE</b><br>
          CGST: ${fmt(summary.sale.cgst)}<br>
          SGST: ${fmt(summary.sale.sgst)}<br>
          IGST: ${fmt(summary.sale.igst)}<br>
          CESS: ${fmt(summary.sale.cess)}<br>
          <b>Total: ${fmt(
            summary.sale.cgst +
            summary.sale.sgst +
            summary.sale.igst +
            summary.sale.cess
          )}</b>
        </div>

        <div class="summary-card">
          <b>CLOSING</b><br>
          CGST: ${fmt(summary.closing.cgst)}<br>
          SGST: ${fmt(summary.closing.sgst)}<br>
          IGST: ${fmt(summary.closing.igst)}<br>
          CESS: ${fmt(summary.closing.cess)}<br>
          <b>Total: ${fmt(
            summary.closing.cgst +
            summary.closing.sgst +
            summary.closing.igst +
            summary.closing.cess
          )}</b>
        </div>

      </div>
    `);

    WinPrint.document.write("</body></html>");
    WinPrint.document.close();
    WinPrint.print();
    WinPrint.close();
  };

  return (
    <div className="p-2">
      <h4 style={{ marginTop: -40 }} className="headerSale">
        GST REGISTER
      </h4>

      {/* Filters & View Mode */}
      <div className="d-flex gap-3 my-3 align-items-center">
        <div>
          <InputMask
            mask="99-99-9999"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                fullWidth
                label="FROM"
                variant="filled"
                className="custom-bordered-input"
                size="small"
                name="fromDate"
              />
            )}
          </InputMask>
        </div>
        <div>
          <InputMask
            mask="99-99-9999"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          >
            {(inputProps) => (
              <TextField
                {...inputProps}
                fullWidth
                label="UPTO"
                variant="filled"
                className="custom-bordered-input"
                size="small"
                name="to"
              />
            )}
          </InputMask>
        </div>

        <div>
          <TextField
            label="VIEW MODE"
            select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            size="small"
            variant="filled"
            sx={{ width: 180 }}
            className="custom-bordered-input"
          >
            <MenuItem value="Record Wise">Record Wise</MenuItem>
            <MenuItem value="Date Wise">Date Wise</MenuItem>
            <MenuItem value="Month Wise">Month Wise</MenuItem>
          </TextField>
        </div>

        <Button
          className="Buttonz"
          variant="contained"
          onClick={handlePrint}
        >
          Print
        </Button>

        <GstRegisterPrint
          isOpen={printOpen}
          handleClose={() => setPrintOpen(false)}
          rows={rows}
          summary={summary}
          fromDate={fromDate}
          toDate={toDate}
        />
      </div>

      {/* Table */}
      <div ref={printRef}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          overflow: "hidden",
          height: 370,
          maxHeight: 370,
        }}
      >
        <CardContent sx={{ padding: 0 }}>
          <TableContainer
            component={Paper}
            sx={{
              width: "100%",
              height: 370,
              maxHeight: 370,
              overflowY: "auto",
              overflowX: "auto",
              scrollbarWidth: "thin",
              "&::-webkit-scrollbar": {
                width: 8,
                height: 8,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#bdbdbd",
                borderRadius: 10,
              },
            }}
          >
            <Table size="small">
              {/* HEADER */}
              <TableHead>
                {/* FIRST HEADER ROW */}
                <TableRow
                  sx={{
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    "& th": {
                      background: "linear-gradient(90deg,#4F81BD,#3A6AA3)",
                      color: "white",
                      fontWeight: 600,
                      textAlign: "center",
                      fontSize: 14,
                      height: 40,
                    },
                  }}
                >
                  <TableCell rowSpan={2}>SR</TableCell>
                  <TableCell rowSpan={2}>DATE</TableCell>
                  <TableCell rowSpan={2}>B.NO</TableCell>

                  <TableCell colSpan={4}>OPENING BALANCE</TableCell>
                  <TableCell colSpan={4}>GST PURCHASE</TableCell>
                  <TableCell colSpan={4}>GST SALE</TableCell>
                  <TableCell colSpan={4}>CLOSING BALANCE</TableCell>
                </TableRow>

                {/* SECOND HEADER ROW */}
                <TableRow
                  sx={{
                    position: "sticky",
                    top: 40,
                    zIndex: 2,
                    "& th": {
                      background: "#5A8DC9",
                      color: "white",
                      fontWeight: 600,
                      textAlign: "center",
                      fontSize: 13,
                      height: 40,
                    },
                  }}
                >
                  {/* Opening */}
                  <TableCell>CGST</TableCell>
                  <TableCell>SGST</TableCell>
                  <TableCell>IGST</TableCell>
                  <TableCell>CESS</TableCell>

                  {/* Purchase */}
                  <TableCell>CGST</TableCell>
                  <TableCell>SGST</TableCell>
                  <TableCell>IGST</TableCell>
                  <TableCell>CESS</TableCell>

                  {/* Sale */}
                  <TableCell>CGST</TableCell>
                  <TableCell>SGST</TableCell>
                  <TableCell>IGST</TableCell>
                  <TableCell>CESS</TableCell>

                  {/* Closing */}
                  <TableCell>CGST</TableCell>
                  <TableCell>SGST</TableCell>
                  <TableCell>IGST</TableCell>
                  <TableCell>CESS</TableCell>
                </TableRow>
              </TableHead>

              {/* BODY */}
              <TableBody>
                {rows.map((r) => (
                  <TableRow
                    key={r.sr}
                    hover
                    onDoubleClick={() => handleRowDoubleClick(r)}
                    sx={{
                      "& td": {
                        fontSize: "13px",
                      },
                      "&:nth-of-type(even)": {
                        backgroundColor: "#fafafa",
                      },
                      "&:hover": {
                        backgroundColor: "#E3F2FD",
                      },
                      backgroundColor:
                        r._id === selectedRowId ? "#BBDEFB" : "inherit",
                      cursor:
                        viewMode === "Record Wise" ? "pointer" : "default",
                    }}
                  >
                    <TableCell align="center">{r.sr}</TableCell>
                    <TableCell align="center">{r.date}</TableCell>
                    <TableCell align="center">{r.bill}</TableCell>

                    {/* Opening */}
                    <TableCell align="right">{fmt(r.opening?.cgst)}</TableCell>
                    <TableCell align="right">{fmt(r.opening?.sgst)}</TableCell>
                    <TableCell align="right">{fmt(r.opening?.igst)}</TableCell>
                    <TableCell align="right">{fmt(r.opening?.cess)}</TableCell>

                    {/* Purchase */}
                    <TableCell align="right">{fmt(r.purchase?.cgst)}</TableCell>
                    <TableCell align="right">{fmt(r.purchase?.sgst)}</TableCell>
                    <TableCell align="right">{fmt(r.purchase?.igst)}</TableCell>
                    <TableCell align="right">{fmt(r.purchase?.cess)}</TableCell>

                    {/* Sale */}
                    <TableCell align="right">{fmt(r.sale?.cgst)}</TableCell>
                    <TableCell align="right">{fmt(r.sale?.sgst)}</TableCell>
                    <TableCell align="right">{fmt(r.sale?.igst)}</TableCell>
                    <TableCell align="right">{fmt(r.sale?.cess)}</TableCell>

                    {/* Closing */}
                    <TableCell align="right">{fmt(r.closing?.cgst)}</TableCell>
                    <TableCell align="right">{fmt(r.closing?.sgst)}</TableCell>
                    <TableCell align="right">{fmt(r.closing?.igst)}</TableCell>
                    <TableCell align="right">{fmt(r.closing?.cess)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      </div>

      {/* Summary */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {[
          { label: "OPENING", data: summary.opening },
          { label: "PURCHASE", data: summary.purchase },
          { label: "SALE", data: summary.sale },
          { label: "CLOSING", data: summary.closing },
        ].map((item, i) => (
          <Grid item xs={12} md={3} key={i}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                background: "linear-gradient(135deg,#ffffff,#f5f7fb)",
              }}
            >
              <CardContent>
                <h6 style={{ fontWeight: 600 }}>{item.label}</h6>

                <div>CGST : {fmt(item.data.cgst)}</div>
                <div>SGST : {fmt(item.data.sgst)}</div>
                <div>IGST : {fmt(item.data.igst)}</div>
                <div>CESS : {fmt(item.data.cess)}</div>

                <hr />

                <b>
                  Total :{" "}
                  {fmt(
                    item.data.cgst +
                      item.data.sgst +
                      item.data.igst +
                      item.data.cess,
                  )}
                </b>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
