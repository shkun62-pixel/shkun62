import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import "../IncomeTax.css"
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import PartyWisePrint from "./PartyWisePrint";
import useCompanySetup from "../../Shared/useCompanySetup";
import InputMask from "react-input-mask";
import financialYear from "../../Shared/financialYear";
import * as XLSX from 'sheetjs-style';

const tenant = "03AAYFG4472A1ZG_01042025_31032026";
const API_URL = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/sale`;

export default function PartyWiseSumSale({ show, onClose }) {
  const {dateFrom, companyName, companyAdd, companyCity } = useCompanySetup();
  // form state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [rawValue, setRawValue] = useState("");
  const [toRaw, setToRaw] = useState("");

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Auto-set financial year when component loads
  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(formatDate(fy.start));
    setToDate(formatDate(fy.end));
    setRawValue(formatDate(fy.start));
    setToRaw(formatDate(fy.end));
  }, []);

  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [agent, setAgent] = useState("");
  const [isB2B, setIsB2B] = useState(false);
  const [reportType, setReportType] = useState("With GST");
  const [taxType, setTaxType] = useState("All");
  const [orderBy, setOrderBy] = useState("");
  const [minQty, setMinQty] = useState("");
  const [maxQty, setMaxQty] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [lessDrCrNote, setLessDrCrNote] = useState(false);
  const [summaryType, setSummaryType] = useState("total"); 

  // Ledger selection modal state
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [ledgers, setLedgers] = useState([]);                 // All ledger names from API
  const [selectedLedgers, setSelectedLedgers] = useState([]); // Only checked
  const [ledgerSearch, setLedgerSearch] = useState("");       // Search input
  const [selectAll, setSelectAll] = useState(false);          // Select All toggle

  // Print preview modal state
  const [printOpen, setPrintOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [groupedData, setGroupedData] = useState([]);
  const [error, setError] = useState("");

  // ref for react-to-print
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Sale Summary",
  });
  
  // Date change handles 
  const handleChange = (e) => {
    setRawValue(e.target.value);

    const [d, m, y] = e.target.value.split("/");
    if (d.length === 2 && m.length === 2 && y.length === 4) {
      const dateObj = new Date(`${y}-${m}-${d}`);
      if (!isNaN(dateObj.getTime())) setFromDate(dateObj);
    }
  };

  const handleToChange = (e) => {
    const val = e.target.value;
    setToRaw(val);

    const [d, m, y] = val.split("/");
    if (d.length === 2 && m.length === 2 && y.length === 4) {
      const dateObj = new Date(`${y}-${m}-${d}`);
      if (!isNaN(dateObj.getTime())) setToDate(dateObj);
    }
  };

  // Called when user clicks Print on main modal
  async function onOpenPrint() {
    setError("");
    setFetching(true);
    setPrintOpen(true); // open modal immediately (spinner shows)

    try {
      const res = await axios.get(API_URL);
      let arr = Array.isArray(res.data) ? res.data : [];

      // ⭐ FILTER BY CITY & STATE (case-insensitive)
      const filterCity = city.trim().toLowerCase();
      const filterState = stateName.trim().toLowerCase();

      arr = arr.filter((rec) => {
        const supplier = rec.customerDetails?.[0] || {};
        const apiCity = (supplier.city || "").trim().toLowerCase();
        const apiState = (supplier.state || "").trim().toLowerCase();

        let cityMatch = true;
        if (filterCity !== "") cityMatch = apiCity === filterCity;

        let stateMatch = true;
        if (filterState !== "") stateMatch = apiState === filterState;

        return cityMatch && stateMatch;
      });

      // FILTER BY LEDGERS IF SELECTED
      if (selectedLedgers.length > 0) {
        arr = arr.filter(rec =>
          selectedLedgers.includes(rec.customerDetails?.[0]?.vacode)
        );
      }

      // Agent Filter
      if (agent.trim() !== "") {
        const ag = agent.trim().toLowerCase();
        arr = arr.filter(
          (rec) =>
            (rec.formData?.broker || "").toLowerCase().includes(ag)
        );
      }
      
    /* ⭐⭐⭐ TAX TYPE FILTER BASED ON DROPDOWN ⭐⭐⭐ */
    if (taxType !== "All") {
      const t = taxType.trim().toLowerCase();

      arr = arr.filter((rec) => {
        const apiTaxType =
          (rec.formData?.stype || "").trim().toLowerCase();
        return apiTaxType === t;
      });
    }

      // GROUP AFTER FILTERING
    let grouped = [];

    if (summaryType === "total") {
      grouped = groupBySupplier(arr, { minQty, maxQty, minValue, maxValue }, reportType);
    }
    else if (summaryType === "month") {
      grouped = groupByMonth(arr, reportType);
    }
    else if (summaryType === "date") {
      grouped = groupByDate(arr, reportType);
    }
    else if (summaryType === "account") {
      grouped = groupBySupplier(arr, { minQty, maxQty, minValue, maxValue }, reportType)
        .sort((a, b) => a.supplierName.localeCompare(b.supplierName));
    }
      setGroupedData(grouped);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch Sale data. Check console.");
    } finally {
      setFetching(false);
    }
  }

  // Grouping function
  function groupBySupplier(apiArray = [], filters = {}, reportType) {
    const map = new Map();

    apiArray.forEach((rec) => {
      const supplier = rec.customerDetails?.[0] || {};
      const name = (supplier.vacode || "Unknown Supplier").trim();
      const city = supplier.city || "";
      const pan = supplier.pan || "";

      const items = Array.isArray(rec.items) ? rec.items : [];

      let sums = { bags: 0, qty: 0, value: 0 };

      if (reportType === "Without GST") {
        sums = items.reduce(
          (acc, it) => {
            acc.bags += parseFloat(it.pkgs) || 0;
            acc.qty += parseFloat(it.weight) || 0;
            acc.value += parseFloat(it.amount) || 0;
            return acc;
          },
          { bags: 0, qty: 0, value: 0 }
        );
      } else if (reportType === "With GST") {
        const bags = items.reduce((a, it) => a + (parseFloat(it.pkgs) || 0), 0);
        const qty = items.reduce(
          (a, it) => a + (parseFloat(it.weight) || 0),
          0
        );

        sums.bags = bags;
        sums.qty = qty;

        // Use grandtotal from formData
        const grand = parseFloat(rec.formData?.grandtotal);
        sums.value = isNaN(grand) ? 0 : grand;
      }

      const { minQty, maxQty, minValue, maxValue } = filters;
      if (minQty && sums.qty < parseFloat(minQty)) return;
      if (maxQty && sums.qty > parseFloat(maxQty)) return;
      if (minValue && sums.value < parseFloat(minValue)) return;
      if (maxValue && sums.value > parseFloat(maxValue)) return;

      if (!map.has(name)) {
        map.set(name, {
          supplierName: name,
          city,
          pan,
          bags: sums.bags,
          qty: sums.qty,
          value: sums.value,
        });
      } else {
        const ex = map.get(name);
        ex.bags += sums.bags;
        ex.qty += sums.qty;
        ex.value += sums.value;
      }
    });

    return Array.from(map.values());
  }

  function groupByDate(apiArray = [], reportType) {
    return apiArray.map(rec => {
      const items = rec.items ?? [];

      const bags = items.reduce((a, it) => a + (parseFloat(it.pkgs) || 0), 0);
      const qty = items.reduce((a, it) => a + (parseFloat(it.weight) || 0), 0);

      let value = 0;
      if (reportType === "With GST") {
        value = parseFloat(rec.formData?.grandtotal) || 0;
      } else {
        value = items.reduce((a, it) => a + (parseFloat(it.amount) || 0), 0);
      }

      return {
        date: rec.formData?.date?.substring(0, 10),
        bags,
        qty,
        value,
        supplier: rec.customerDetails?.[0]?.vacode || "",
      };
    });
  }

  // helper: parse DD/MM/YYYY or ISO -> Date object (returns null if invalid)
  function parseAnyDate(dateStr) {
    if (!dateStr) return null;
    // If already a Date object
    if (dateStr instanceof Date) {
      return isNaN(dateStr.getTime()) ? null : dateStr;
    }

    // Trim
    const s = String(dateStr).trim();

    // Case 1: DD/MM/YYYY  (e.g. 28/11/2025)
    const ddmmyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const m1 = s.match(ddmmyyyy);
    if (m1) {
      const d = parseInt(m1[1], 10);
      const m = parseInt(m1[2], 10) - 1;
      const y = parseInt(m1[3], 10);
      const dt = new Date(y, m, d);
      return isNaN(dt.getTime()) ? null : dt;
    }

    // Case 2: ISO-ish (YYYY-MM-DD or full ISO)
    const iso = Date.parse(s);
    if (!isNaN(iso)) return new Date(iso);

    // fallback: try Date constructor once more
    const dt2 = new Date(s);
    return isNaN(dt2.getTime()) ? null : dt2;
  }

  // GROUP BY MONTH + Supplier Name + City
  function groupByMonth(apiArray = [], reportType) {
    const map = new Map();

    apiArray.forEach((rec) => {
      const dateStr = rec.formData?.date || rec.date || "";
      const d = parseAnyDate(dateStr);
      if (!d) return;

      const monthKey = d.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const supplier = rec.customerDetails?.[0] || {};
      const supplierName = (supplier.vacode || "Unknown Supplier").trim();
      const city = supplier.city || "";

      // Unique key = Month + Supplier
      const key = `${monthKey}__${supplierName}`;

      const items = Array.isArray(rec.items) ? rec.items : [];

      const bags = items.reduce((a, it) => a + (parseFloat(it.pkgs) || 0), 0);
      const qty = items.reduce((a, it) => a + (parseFloat(it.weight) || 0), 0);

      let value = 0;
      if (reportType === "With GST") {
        value = parseFloat(rec.formData?.grandtotal) || 0;
      } else {
        value = items.reduce((a, it) => a + (parseFloat(it.amount) || 0), 0);
      }

      if (!map.has(key)) {
        map.set(key, {
          month: monthKey,
          supplierName,
          city,
          bags,
          qty,
          value,
        });
      } else {
        const ex = map.get(key);
        ex.bags += bags;
        ex.qty += qty;
        ex.value += value;
      }
    });

    return Array.from(map.values());
  }

  const format = (d) => {
    if (!d) return "";
    if (d instanceof Date) {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = d.getFullYear();
      return `${dd}/${mm}/${yy}`;
    }
    return d;
  };

  useEffect(() => {
    axios.get(API_URL).then((res) => {
      if (Array.isArray(res.data)) {

        const list = res.data
          .map(r => ({
            vacode: r.customerDetails?.[0]?.vacode || "",
            city: r.customerDetails?.[0]?.city || ""
          }))
          .filter(x => x.vacode !== "");

        // remove duplicates by vacode
        const unique = [];
        const map = new Map();
        for (const item of list) {
          if (!map.has(item.vacode)) {
            map.set(item.vacode, true);
            unique.push(item);
          }
        }

        setLedgers(unique);

        // select all default
        setSelectedLedgers(unique.map(x => x.vacode));
        setSelectAll(true);
      }
    });
  }, []);

  // Toggle single ledger
  function toggleLedger(name) {
    setSelectedLedgers((prev) =>
      prev.includes(name)
        ? prev.filter((x) => x !== name)
        : [...prev, name]
    );
  }

  // helper: currently visible (filtered) ledgers based on search
  function getVisibleLedgers() {
    const q = (ledgerSearch || "").toLowerCase();
    return ledgers.filter(
      (x) =>
        x.vacode.toLowerCase().includes(q) ||
        (x.city || "").toLowerCase().includes(q)
    );
  }

  // Select all
  function toggleSelectAll() {
    const visible = getVisibleLedgers();
    const visibleVacodes = visible.map(x => x.vacode);

    // If every visible vacode is already selected => unselect visible ones
    const allVisibleSelected = visibleVacodes.length > 0 &&
      visibleVacodes.every(v => selectedLedgers.includes(v));

    if (allVisibleSelected) {
      // remove visible vacodes from selectedLedgers
      setSelectedLedgers(prev => prev.filter(v => !visibleVacodes.includes(v)));
      setSelectAll(false);
    } else {
      // add visible vacodes to selectedLedgers (avoid duplicates)
      setSelectedLedgers(prev => {
        const set = new Set(prev);
        visibleVacodes.forEach(v => set.add(v));
        return Array.from(set);
      });
      setSelectAll(true);
    }
  }

  useEffect(() => {
    const visible = getVisibleLedgers();
    if (visible.length === 0) {
      setSelectAll(false);
      return;
    }
    const visibleVacodes = visible.map(x => x.vacode);
    const allVisibleSelected = visibleVacodes.every(v => selectedLedgers.includes(v));
    setSelectAll(allVisibleSelected);
  }, [ledgerSearch, ledgers, selectedLedgers]);

  function exportToExcel(filename, jsonData) {
    if (!jsonData || jsonData.length === 0) {
      alert("No data to export");
      return;
    }

    // ⭐ 1️⃣ CUSTOM HEADER NAMES
    const customHeaders = {
      supplierName: "Customer Name",
      city: "City",
      pan: "PAN No",
      bags: "Bags",
      qty: "Quantity",
      value: "Total Value",
      month: "Month",
      date: "Date",
      supplier: "Customer"
    };

    // Convert keys → readable headers
    const finalData = jsonData.map((row) => {
      const newRow = {};
      Object.keys(row).forEach((k) => {
        newRow[customHeaders[k] || k] = row[k];
      });
      return newRow;
    });

    let header = Object.keys(finalData[0]);

    if (summaryType === "date") {
      // Reorder columns: put Supplier right after Date
      const newOrder = ["Date", "Supplier"];

      // Keep all other columns in original order
      const remaining = header.filter(h => !newOrder.includes(h));

      header = [...newOrder, ...remaining]; // ✅ Now allowed
    }

    // 2️⃣ COMPANY & PERIOD TOP ROWS
    const sheetData = [
      [companyName || "Company Name"],
      [companyAdd || "Company Address"],
      [`SALE SUMMARY - Period From: ${fromDate}  To: ${toDate}`],
      [],
      header,
      ...finalData.map(row => header.map(h => row[h]))
    ];

    // 3️⃣ SUBTOTAL TOTAL ROW (BOTTOM)
    const numericColumns = ["Bags", "Quantity", "Total Value"];
    const totals = {};

    header.forEach((h, index) => {
      if (index === 0) {
        totals[h] = "Total";
      } else if (numericColumns.includes(h)) {
        const colLetter = XLSX.utils.encode_col(index);
        const firstRow = 5;
        const lastDataRow = 4 + finalData.length;
        totals[h] = { f: `SUBTOTAL(9,${colLetter}${firstRow + 1}:${colLetter}${lastDataRow + 1})` };
      } else {
        totals[h] = "";
      }
    });

    sheetData.push(header.map(h => totals[h]));

    // Build worksheet
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // ⭐ APPLY STYLING TO TOP ROWS

    const totalColumns = header.length - 1;

    // A1 → Company Name (Font 16, Bold, Center)
    if (ws["A1"]) {
      ws["A1"].s = {
        font: { bold: true, sz: 16 },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    // A2 → Company Address (Font 12, Bold, Center)
    if (ws["A2"]) {
      ws["A2"].s = {
        font: { bold: true, sz: 12 },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    // A3 → Period Row (Font 12, Bold, Center)
    if (ws["A3"]) {
      ws["A3"].s = {
        font: { bold: true, sz: 12 },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    // Merge Top 3 Rows
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: totalColumns } }, // Company Name
      { s: { r: 1, c: 0 }, e: { r: 1, c: totalColumns } }, // Address
      { s: { r: 2, c: 0 }, e: { r: 2, c: totalColumns } }, // Period
    ];

    // 4️⃣ COLUMN WIDTHS (AUTO-FIT)

    ws["!cols"] = header.map((h) => {
      const maxLen = Math.max(
        h.length,
        ...finalData.map((row) => (row[h] ? row[h].toString().length : 0))
      );
      return { wch: maxLen + 3 };
    });

    const HEADER_BG = "4F81BD";

    // 5️⃣ HEADER STYLE
    header.forEach((_, colIdx) => {
      const addr = XLSX.utils.encode_cell({ r: 4, c: colIdx });
      if (ws[addr]) {
        ws[addr].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { patternType: "solid", fgColor: { rgb: HEADER_BG } },
          alignment: { horizontal: "center" },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }
          }
        };
      }
    });

    // 6️⃣ NUMERIC ALIGNMENT & BORDERS
    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let R = 5; R <= range.e.r; R++) {
      for (let C = 0; C < header.length; C++) {
        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
        if (!cell) continue;

        const isNumeric = numericColumns.includes(header[C]);

        cell.s = {
          alignment: {
            horizontal: isNumeric ? "right" : "left",
            vertical: "center"
          },
        };

        if (isNumeric && !isNaN(cell.v)) {
          cell.t = "n";
          cell.z = "0.00";
        }
      }
    }

    // 7️⃣ TOTAL ROW STYLE
    const totalRowIndex = finalData.length + 5;

    header.forEach((_, colIdx) => {
      const addr = XLSX.utils.encode_cell({ r: totalRowIndex, c: colIdx });
      if (ws[addr]) {
        ws[addr].s = {
          font: { bold: true },
          fill: { patternType: "solid", fgColor: { rgb: "D9D9D9" } },
          alignment: { horizontal: colIdx === 0 ? "left" : "right" }
        };
      }
    });

    // 8️⃣ MERGE COMPANY NAME / ADD / PERIOD ROWS
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } }
    ];

    // 9️⃣ CREATE FILE
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sale Summary");

    XLSX.writeFile(wb, filename + ".xlsx");
  }
  
  function handleExport() {
    if (summaryType === "total") {
      exportToExcel("Sale_Total_Summary", groupedData);
    } 
    else if (summaryType === "month") {
      exportToExcel("Sale_Month_Wise", groupedData);
    } 
    else if (summaryType === "date") {
      exportToExcel("Sale_Date_Wise", groupedData);
    } 
    else if (summaryType === "account") {
      exportToExcel("Sale_Account_Wise", groupedData);
    }
  }

  return (
    <>
      {/* MAIN FILTER MODAL */}
      <Modal show={show} onHide={onClose} size="xl" centered backdrop="static" keyboard={true} >
      
        <Modal.Body style={{ background: "#f7f9fc" }}>
          <h2 className="header" style={{marginTop:0,marginLeft:"35%",fontSize:"22px"}}>SALE SUMMARY PARTY WISE</h2>
          <Form>
            <div
              style={{
                display: "flex",
                gap: "25px",
                padding: "10px 5px",
              }}
            >
              {/* LEFT SIDE */}
              <div
                style={{
                  flex: 1,
                  background: "white",
                  padding: "18px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                }}
              >
                {/* DATE FIELDS */}
                <div style={rowStyle}>
                  <label style={labelStyle}>From</label>
                    <InputMask
                      mask="99-99-9999"
                      placeholder="dd-mm-yyyy"
                      value={rawValue}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <input {...inputProps} className="form-control" />
                      )}
                    </InputMask>
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>Upto</label>
                  <InputMask
                    mask="99-99-9999"
                    placeholder="dd-mm-yyyy"
                    value={toRaw}
                    onChange={handleToChange}
                  >
                    {(inputProps) => <input {...inputProps} className="form-control" />}
                  </InputMask>
                </div>

                {/* CITY & STATE */}
                <div style={rowStyle}>
                  <label style={labelStyle}>City</label>
                  <Form.Control
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>State</label>
                  <Form.Control
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                  />
                </div>

                {/* B2B Checkbox */}
                <div style={rowStyle}>
                  <label>Agent</label>
                  <div>
                  <input
                    style={{ transform: "scale(1.2)", marginRight: "5px",marginLeft:"5px" }}
                    type="checkbox"
                    checked={isB2B}
                    onChange={(e) => setIsB2B(e.target.checked)}
                  />
                  <label style={{marginRight:"10px"}}>B2B</label>
                  </div>
                  <div>
                  <Form.Control
                    value={agent}
                    onChange={(e) => setAgent(e.target.value)}
                  />
                  </div>
                </div>

                {/* Report Type */}
                <div style={rowStyle}>
                  <label style={{}}>Report Type</label>
                  <Form.Select
                    className="reportType"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option>With GST</option>
                    <option>Without GST</option>
                  </Form.Select>
                </div>
                {/* Tax Type */}
                <div style={rowStyle}>
                  <label style={{}}>Tax Type</label>
                  <Form.Select
                    className="taxType"
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                  >
                    <option>All</option>
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
              </div>

              {/* RIGHT SIDE */}
              <div
                style={{
                  flex: 1,
                  background: "white",
                  padding: "18px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                }}
              >
                {/* SUMMARY TYPE RADIO BUTTONS */}
                <div style={{ padding: "10px"}}>
                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="summaryType"
                      value="total"
                      checked={summaryType === "total"}
                      onChange={(e) => setSummaryType(e.target.value)}
                    />
                    <label className="form-check-label">Total Summary</label>
                  </div>

                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="summaryType"
                      value="month"
                      checked={summaryType === "month"}
                      onChange={(e) => setSummaryType(e.target.value)}
                    />
                    <label className="form-check-label">Month Wise</label>
                  </div>

                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="summaryType"
                      value="date"
                      checked={summaryType === "date"}
                      onChange={(e) => setSummaryType(e.target.value)}
                    />
                    <label className="form-check-label">Date Wise</label>
                  </div>

                  <div className="form-check">
                    <input
                      type="radio"
                      className="form-check-input"
                      name="summaryType"
                      value="account"
                      checked={summaryType === "account"}
                      onChange={(e) => setSummaryType(e.target.value)}
                    />
                    <label className="form-check-label">Account Wise</label>
                  </div>
                </div>

                {/* Min Max Qty */}
                <div style={rowStyle}>
                  <label style={labelStyle}>Min Qty</label>
                  <Form.Control
                    value={minQty}
                    onChange={(e) => setMinQty(e.target.value)}
                  />
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>Max Qty</label>
                  <Form.Control
                    value={maxQty}
                    onChange={(e) => setMaxQty(e.target.value)}
                  />
                </div>

                {/* Min Max Value */}
                <div style={rowStyle}>
                  <label style={labelStyle}>Min Value</label>
                  <Form.Control
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                  />
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>Max Value</label>
                  <Form.Control
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                  />
                </div>

                {/* Checkbox */}
                <div style={rowStyle}>
                  <label style={labelStyle}>Less Dr/Cr Note</label>
                  <Form.Check
                    checked={lessDrCrNote}
                    onChange={(e) => setLessDrCrNote(e.target.checked)}
                  />
                </div>

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                <Button variant="outline-secondary" onClick={() => setLedgerModalOpen(true)}>
                  Select Ledger Accounts
                </Button>

                  {/* <Button variant="warning" onClick={handleExport}> Export </Button> */}
                  <Button variant="primary" onClick={onOpenPrint}>
                    Print
                  </Button>

                  <Button variant="secondary" onClick={onClose}>
                    Exit
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* PRINT PREVIEW MODAL */}
      <Modal
        show={printOpen}
        onHide={() => setPrintOpen(false)}
        className="custom-modal"
        style={{ marginTop: 20 }}
        backdrop="static" keyboard={true}
      >
        <Modal.Body style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
          {fetching ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <div>
                <PartyWisePrint
                  ref={printRef}
                  groupedData={groupedData}
                  periodFrom={format(fromDate)}
                  periodTo={format(toDate)}
                  companyName={companyName}
                  companyAdd={companyAdd}
                  companyCity={companyCity}
                  handleExport={handleExport}
                />
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="warning" onClick={handleExport}>EXPORT</Button>
          <Button
            variant="primary"
            onClick={handlePrint}
            disabled={fetching || groupedData.length === 0}
          >
            PRINT
          </Button>
          <Button variant="secondary" onClick={() => setPrintOpen(false)}>
            CLOSE
          </Button>
        </Modal.Footer>
      </Modal>

      {/* LEDGER SELECTION MODAL */}
    <Modal show={ledgerModalOpen} onHide={() => setLedgerModalOpen(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Select Ledger Accounts</Modal.Title>
      </Modal.Header>

      <Modal.Body>

        {/* LEDGER TABLE */}
        <div
          style={{
            maxHeight: "350px",
            overflowY: "auto",
            padding: "10px",
          }}
        >
          <Table className="custom-table" size="sm">
            <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th style={{ width: "50px", textAlign: "center" }}>Select</th>
                <th>Account Name</th>
                <th>City</th>
              </tr>
            </thead>

            <tbody>
              {ledgers
                .filter(
                  (x) =>
                    x.vacode.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
                    x.city.toLowerCase().includes(ledgerSearch.toLowerCase())
                )
                .map((x, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        checked={selectedLedgers.includes(x.vacode)}
                        onChange={() => toggleLedger(x.vacode)}
                      />
                    </td>
                    <td>{x.vacode}</td>
                    <td>{x.city}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>

      </Modal.Body>

      <Modal.Footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        {/* SEARCH BAR ON LEFT */}
        <input
          type="text"
          className="form-control"
          placeholder="Search ledger..."
          style={{ width: "300px" }}
          value={ledgerSearch}
          onChange={(e) => setLedgerSearch(e.target.value)}
        />

        {/* BUTTONS ON RIGHT */}
        <div>
          <Button
            variant={selectAll ? "warning" : "success"}
            onClick={toggleSelectAll}
          >
            {selectAll ? "Unselect All" : "Select All"}
          </Button>{" "}
          <Button variant="secondary" onClick={() => setLedgerModalOpen(false)}>
            Close
          </Button>{" "}
          <Button variant="primary" onClick={() => setLedgerModalOpen(false)}>
            Apply
          </Button>
        </div>
      </Modal.Footer>

    </Modal>
    </>
  );
}


const rowStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
};

const labelStyle = {
  width: "120px",
  fontWeight: "600",
};
