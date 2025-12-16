import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import InputMask from "react-input-mask";
import { useReactToPrint } from "react-to-print";
import useCompanySetup from "../../Shared/useCompanySetup";
import * as XLSX from 'sheetjs-style';
import AccountWisePrint from "./AccountWisePrint";

const API_URL =
  "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase";

export default function ProductWisePur({ show, onClose }) {
    
  const { companyName, companyAdd, companyCity } = useCompanySetup();
  // filters
  const [fromDate, setFromDate] = useState("01-04-2025");
  const [toDate, setToDate] = useState("31-03-2026");
  const [city, setCity] = useState("");
  const [summaryType, setSummaryType] = useState("account");
  const [reportType, setReportType] = useState("With GST");
  const [stateName, setStateName] = useState("");
  const [minQty, setMinQty] = useState("");
  const [maxQty, setMaxQty] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [agent, setAgent] = useState("");
  const [taxType, setTaxType] = useState("All");
  const [lessDrCr, setLessDrCr] = useState(true);


  // print modal
  const [printOpen, setPrintOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [groupedData, setGroupedData] = useState([]);

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  });

  function parseAnyDate(dateStr) {
    if (!dateStr) return null;

    // 1️⃣ dd/mm/yyyy
    if (dateStr.includes("/")) {
      const [d, m, y] = dateStr.split("/");
      return new Date(`${y}-${m}-${d}`);
    }

    // 2️⃣ dd-mm-yyyy
    if (dateStr.includes("-")) {
      const [a, b, c] = dateStr.split("-");

      // Check if first part is day or year
      // dd-mm-yyyy → a.length == 2
      // yyyy-mm-dd → a.length == 4
      if (a.length === 2) {
        const [d, m, y] = [a, b, c];
        return new Date(`${y}-${m}-${d}`);
      } else if (a.length === 4) {
        // yyyy-mm-dd
        return new Date(`${a}-${b}-${c}`);
      }
    }

    // 3️⃣ ISO (auto handled by JS)
    const auto = new Date(dateStr);
    if (!isNaN(auto)) return auto;

    return null; // invalid format
  }

  // group into single row per account
  function summarizeByAccount(purchases) {
    const result = {};

    purchases.forEach((p) => {
      p.items.forEach((item) => {
        const acc = item.sdisc;

        if (!result[acc]) {
          result[acc] = {
            account: acc,
            city: p.formData.city || "",
            bags: 0,
            qty: 0,
            value: 0,
          };
        }

        result[acc].bags += Number(item.pkgs || 0);
        result[acc].qty += Number(item.weight || 0);
        if(reportType === "Without GST"){
          result[acc].value += Number(item.amount || 0);
        } else{
          result[acc].value += Number(item.vamt || 0);
        }
        
      });
    });

    return Object.values(result).map((r) => ({
      ...r,
      avg: r.qty > 0 ? r.value / r.qty : 0,
    }));
  }

  function formatMonth(dateStr) {
    const d = parseAnyDate(dateStr);
    if (!d) return "";
    return d.toLocaleString("en-IN", {
      month: "short",
      year: "numeric",
    }); // Apr 2025
  }

  function formatDateKey(dateStr) {
    const d = parseAnyDate(dateStr);
    if (!d) return "";
    return d.toLocaleDateString("en-IN"); // 01/04/2025
  }

  function summarizeByMonth(purchases) {
    const result = {};

    purchases.forEach(p => {
      const month = formatMonth(p.formData?.date);

      p.items.forEach(item => {
        const account = item.sdisc;
        const key = `${month}__${account}`;

        if (!result[key]) {
          result[key] = {
            month,
            account,
            city: p.formData.city || "",
            bags: 0,
            qty: 0,
            value: 0,
          };
        }

        result[key].bags += Number(item.pkgs || 0);
        result[key].qty += Number(item.weight || 0);

        if (reportType === "Without GST") {
          result[key].value += Number(item.amount || 0);
        } else {
          result[key].value += Number(item.vamt || 0);
        }
      });
    });

    return Object.values(result).map(r => ({
      ...r,
      avg: r.qty > 0 ? r.value / r.qty : 0,
    }));
  }

  function summarizeByDate(purchases) {
    const result = {};

    purchases.forEach(p => {
      const date = formatDateKey(p.formData?.date);

      p.items.forEach(item => {
        const account = item.sdisc;
        const key = `${date}__${account}`;

        if (!result[key]) {
          result[key] = {
            date,
            account,
            city: p.formData.city || "",
            bags: 0,
            qty: 0,
            value: 0,
          };
        }

        result[key].bags += Number(item.pkgs || 0);
        result[key].qty += Number(item.weight || 0);

        if (reportType === "Without GST") {
          result[key].value += Number(item.amount || 0);
        } else {
          result[key].value += Number(item.vamt || 0);
        }
      });
    });

    return Object.values(result).map(r => ({
      ...r,
      avg: r.qty > 0 ? r.value / r.qty : 0,
    }));
  }

  // OPEN PRINT MODAL
  const onOpenPrint = () => {

    // ❗ Stop if dates are empty or incomplete
    if (!fromDate || fromDate.includes("_") || !toDate || toDate.includes("_")) {
      alert("Please select both From and To dates.");
      return;
    }

    setFetching(true);

    axios.get(API_URL)
      .then(res => {

        let data = res.data;

      // DATE FILTER
      let from = parseAnyDate(fromDate);
      let to   = parseAnyDate(toDate);

      const isValid = (d) => d instanceof Date && !isNaN(d);

      if (isValid(from) && isValid(to)) {
        data = data.filter(p => {
          const apiDate = parseAnyDate(p.formData?.date);
          if (!isValid(apiDate)) return false;
          return apiDate >= from && apiDate <= to;
        });
      }

      // CITY FILTER
      if (city.trim() !== "") {
        data = data.filter(p => {
          const apiCity =
            p.customerDetails?.[0]?.city ||
            p.formData?.city ||
            "";
          return apiCity.toLowerCase().includes(city.toLowerCase());
        });
      }
      // STATE FILTER
      if (stateName.trim() !== "") {
        data = data.filter(p => {
          const apiState =
            p.customerDetails?.[0]?.state ||
            p.formData?.state ||
            "";
          return apiState.toLowerCase().includes(stateName.toLowerCase());
        });
      }
      // Agent FILTER
      if (agent.trim() !== "") {
        data = data.filter(p =>
          p.formData?.broker?.toLowerCase().includes(agent.toLowerCase())
        );
      }
      // Tax Type FILTER
      if (taxType !== "All") {
        data = data.filter(p =>
          p.formData?.stype === taxType
        );
      }

      // GROUP SUMMARY
      let summary = [];

      if (summaryType === "account") {
        summary = summarizeByAccount(data);
      }
      else if (summaryType === "month") {
        summary = summarizeByMonth(data);
      }
      else if (summaryType === "date") {
        summary = summarizeByDate(data);
      }

      // APPLY QTY / VALUE RANGE (same for all)
      if (minQty !== "") summary = summary.filter(r => r.qty >= Number(minQty));
      if (maxQty !== "") summary = summary.filter(r => r.qty <= Number(maxQty));
      if (minValue !== "") summary = summary.filter(r => r.value >= Number(minValue));
      if (maxValue !== "") summary = summary.filter(r => r.value <= Number(maxValue));

      setGroupedData(summary);
    })

    .catch(() => alert("Failed to load data"))

    .finally(() => {
      setFetching(false);
      setPrintOpen(true);
    });
  };

  const exportToExcel = () => {
    if (!groupedData || groupedData.length === 0) {
      alert("No data to export");
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws = {};

    const title = `Purchase Summary - From: ${fromDate} To: ${toDate}`;

    // ----------------------------
    // Header map
    // ----------------------------
    const headerMap = {
      month: "Month",
      date: "Date",
      account: "Account",
      supplier: "Account",
      city: "City",
      pan: "PAN No",
      bags: "Bags",
      qty: "Quantity",
      value: "Total Value",
      avg: "Avg"
    };

    // ----------------------------
    // Dynamic headers
    // ----------------------------
    let headers = Object.keys(groupedData[0]).map(k => headerMap[k] || k);
    if (summaryType === "date") {
      headers = [
        "Date",
        "Account",
        ...headers.filter(h => !["Date", "Account"].includes(h))
      ];
    }

    const numericColumns = ["Bags", "Quantity", "Total Value", "Avg"];
    let rowIndex = 0;

    // ----------------------------
    // Company Name
    // ----------------------------
    XLSX.utils.sheet_add_aoa(ws, [[companyName]], { origin: rowIndex });
    ws["A1"] = ws["A1"] || { t: "s", v: companyName };
    ws["A1"].s = { font: { bold: true, sz: 16 }, alignment: { horizontal: "center" } };
    ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }];
    rowIndex++;

    // ----------------------------
    // Company Address
    // ----------------------------
    XLSX.utils.sheet_add_aoa(ws, [[companyAdd]], { origin: rowIndex });
    ws["A2"] = ws["A2"] || { t: "s", v: companyAdd };
    ws["A2"].s = { font: { bold: true }, alignment: { horizontal: "center" } };
    ws["!merges"].push({ s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } });
    rowIndex++;

    // ----------------------------
    // Title
    // ----------------------------
    XLSX.utils.sheet_add_aoa(ws, [[title]], { origin: rowIndex });
    ws["A3"] = ws["A3"] || { t: "s", v: title };
    ws["A3"].s = { font: { bold: true }, alignment: { horizontal: "center" } };
    ws["!merges"].push({ s: { r: 2, c: 0 }, e: { r: 2, c: headers.length - 1 } });
    rowIndex += 2;

    // ----------------------------
    // Header Row
    // ----------------------------
    XLSX.utils.sheet_add_aoa(ws, [headers], { origin: rowIndex });
    headers.forEach((h, i) => {
      const ref = XLSX.utils.encode_cell({ r: rowIndex, c: i });
      if (!ws[ref]) ws[ref] = { t: "s", v: h };
      ws[ref].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } },
        alignment: { horizontal: "center" },
        border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
      };
    });

    rowIndex++;
    const dataStartRow = rowIndex + 1;

    // ----------------------------
    // Data Rows
    // ----------------------------
    groupedData.forEach(r => {
      const row = headers.map((h, i) => {
        const key = Object.keys(headerMap).find(k => headerMap[k] === h);
        let val = r[key] ?? "";

        // Force numeric columns as numbers and apply decimal format
        if (numericColumns.includes(h)) {
          val = Number(val) || 0;
          let format = "0.00"; // default 2 decimals
          if (h === "Bags" || h === "Quantity") format = "0.000";
          const cellRef = XLSX.utils.encode_cell({ r: rowIndex, c: i });
          ws[cellRef] = { t: "n", v: val, z: format };
          return val;
        }

        return val;
      });

      XLSX.utils.sheet_add_aoa(ws, [row], { origin: rowIndex });
      rowIndex++;
    });

    const totalRowExcel = rowIndex + 1;

    // ----------------------------
    // Total / Subtotal row
    // ----------------------------
    XLSX.utils.sheet_add_aoa(ws, [["Total"]], { origin: rowIndex });
    headers.forEach((h, i) => {
      const col = XLSX.utils.encode_col(i);
      const ref = `${col}${totalRowExcel}`;
      if (numericColumns.includes(h)) {
        let format = "0.00";
        if (h === "Bags" || h === "Quantity") format = "0.000";
        ws[ref] = {
          t: "n",
          f: `SUBTOTAL(9,${col}${dataStartRow}:${col}${totalRowExcel - 1})`,
          z: format
        };
      } else {
        ws[ref] = ws[ref] || { t: "s", v: "" };
      }

      ws[ref].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "D9E1F2" } },
        alignment: { horizontal: i === 0 ? "left" : "right" },
      };
    });

    // ----------------------------
    // Column widths
    // ----------------------------
    ws["!cols"] = headers.map(() => ({ wch: 18 }));

    // ----------------------------
    // Autofilter
    // ----------------------------
    ws["!autofilter"] = {
      ref: `A${dataStartRow - 1}:${XLSX.utils.encode_col(headers.length - 1)}${totalRowExcel - 1}`
    };

    // ----------------------------
    // Append Sheet & Save
    // ----------------------------
    XLSX.utils.book_append_sheet(wb, ws, "Purchase Summary");
    XLSX.writeFile(wb, "Purchase_Summary.xlsx");
  };

  return (
    <>
    {/* MAIN FILTER MODAL */}
    <Modal show={show} onHide={onClose} size="xl" centered backdrop="static" keyboard={true}>
      <Modal.Body style={{ background: "#f8f9fa" }}>
        <Form
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          }}
        >
        <h4
          className="header"
          style={{marginTop:0,marginLeft:"32%",fontSize:"22px"}}
        >
          PRODUCT WISE PURCHASE SUMMARY
        </h4>

          {/* MAIN 2-COLUMN CONTAINER */}
          <div style={{ display: "flex", gap: "25px", marginTop:"5px" }}>

            {/* LEFT CONTAINER */}
            <div
              style={{
                flex: 1,
                background: "#f5f6f7",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              {/* FROM DATE ROW */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
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

              {/* TO DATE ROW */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
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

              {/* CITY ROW */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <label className="form-label" style={{ width: "120px" }}>City</label>
                <Form.Control
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <label className="form-label" style={{ width: "120px" }}>State</label>
                <Form.Control
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                />
              </div>
              
              {/* AGENT */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <label className="form-label" style={{ width: "120px" }}>Agent</label>
                <Form.Control
                  value={agent}
                  onChange={(e) => setAgent(e.target.value)}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px"  }}>
              <label className="form-label">Report Type</label>
              <Form.Select
                className="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option>With GST</option>
                <option>Without GST</option>
              </Form.Select>
              </div>

              {/* TAX TYPE */}
               <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
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
              {/* LESS DR/CR */}
              <div className="form-check mt-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={lessDrCr}
                  onChange={(e) => setLessDrCr(e.target.checked)}
                />
                <label className="form-check-label">Less Dr/Cr Note</label>
              </div>
            </div>

            {/* RIGHT CONTAINER */}
            <div
              style={{
                flex: 1,
                background: "#f5f6f7",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <h5 style={{ marginBottom: "15px", fontWeight: 600 }}>Summary Type</h5>

              <div className="form-check mb-1">
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

              <div className="form-check mb-1">
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

              <div className="form-check mb-4">
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
              <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "25px",
              }}
          >
            <Button variant="primary" onClick={onOpenPrint}>
              Print
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Exit
            </Button>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
        </Form>
      </Modal.Body>
    </Modal>

    {/* PRINT PREVIEW MODAL */}
    <Modal
      show={printOpen}
      onHide={() => setPrintOpen(false)}
      fullscreen
      className="custom-modal"
      style={{ marginTop: 20 }}
      backdrop="static" keyboard={true}
    >
      <Modal.Body>
        {fetching ? (
          <div className="text-center">Loading...</div>
        ) : (
          <AccountWisePrint
            ref={printRef}
            rows={groupedData}
            fromDate={fromDate}
            toDate={toDate}
            companyName={companyName}
            companyAdd={companyAdd}
            companyCity={companyCity}
            tittle = {"PRODUCT WISE PURCHASE SUMMARY"}
          />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handlePrint}>PRINT</Button>
        <Button variant="success" onClick={exportToExcel}> EXPORT </Button>
        <Button variant="secondary" onClick={() => setPrintOpen(false)}>CLOSE</Button>
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

