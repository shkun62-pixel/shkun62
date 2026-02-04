import React, { useRef } from "react";
import { Modal, Box, Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import useCompanySetup from "../Shared/useCompanySetup";
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';

const PrintSummary = ({
  isOpen,
  handleClose,
  rows = [],
  totalSale,
  fromDate,
  toDate,
  header,
  Total,
  printDate = new Date(),
}) => {
  const { companyName, companyAdd, companyCity } = useCompanySetup();

  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const style = {
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
    maxHeight: "100vh",
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // 🔢 totals
  const totalQty = rows.reduce((s, r) => s + (r.qty || 0), 0);
  const totalPcs = rows.reduce((s, r) => s + (r.pcs || 0), 0);
  const totalValue = rows.reduce((s, r) => s + (r.value || 0), 0);
  const totalCgst = rows.reduce((s, r) => s + (r.cgst || 0), 0);
  const totalSgst = rows.reduce((s, r) => s + (r.sgst || 0), 0);
  const totalIgst = rows.reduce((s, r) => s + (r.igst || 0), 0);

  const handleExportExcel = () => {
    /* ================= HEADER DATA ================= */
    const sheetData = [
      [companyName?.toUpperCase()],
      [companyAdd],
      [companyCity],
      [],
      [header],
      [`Period ${formatDate(fromDate)} To ${toDate}`],
      [],
      [
        "A/c Name",
        "Pcs",
        "Weight",
        "Value",
        "C.Tax",
        "S.Tax",
        "I.Tax",
        "Cess",
      ],
    ];

    /* ================= DATA ROWS ================= */
    const DATA_START_ROW = sheetData.length; // 0-based

    rows.forEach((r) => {
      sheetData.push([
        r.account || "",
        r.pcs ?? "",
        r.qty ?? "",
        r.value ?? "",
        r.cgst ?? "",
        r.sgst ?? "",
        r.igst ?? "",
        "",
      ]);
    });

    const DATA_END_ROW = sheetData.length; // exclusive

    /* ================= TOTAL ROW (SUBTOTAL) ================= */
    sheetData.push([
      "Total",
      { f: `SUBTOTAL(9,B${DATA_START_ROW + 1}:B${DATA_END_ROW})` },
      { f: `SUBTOTAL(9,C${DATA_START_ROW + 1}:C${DATA_END_ROW})` },
      { f: `SUBTOTAL(9,D${DATA_START_ROW + 1}:D${DATA_END_ROW})` },
      { f: `SUBTOTAL(9,E${DATA_START_ROW + 1}:E${DATA_END_ROW})` },
      { f: `SUBTOTAL(9,F${DATA_START_ROW + 1}:F${DATA_END_ROW})` },
      { f: `SUBTOTAL(9,G${DATA_START_ROW + 1}:G${DATA_END_ROW})` },
      "",
    ]);

    /* ================= WORKSHEET ================= */
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    /* ================= COLUMN WIDTH ================= */
    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 10 },
    ];

    /* ================= MERGE COMPANY HEADER ================= */
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 7 } },
      { s: { r: 5, c: 0 }, e: { r: 5, c: 7 } },
    ];

    /* ================= CENTER STYLES ================= */
    const centerStyle = (bold = false, size = 12) => ({
      alignment: { horizontal: "center", vertical: "center" },
      font: { bold, sz: size },
    });

    worksheet["A1"].s = centerStyle(true, 16);
    worksheet["A2"].s = centerStyle(false, 12);
    worksheet["A3"].s = centerStyle(false, 12);
    worksheet["A5"].s = centerStyle(true, 13);
    worksheet["A6"].s = centerStyle(false, 12);

    /* ================= TABLE HEADER STYLE ================= */
    const headerRow = 7;
    for (let c = 0; c <= 7; c++) {
      const ref = XLSX.utils.encode_cell({ r: headerRow, c });
      worksheet[ref].s = {
        font: { bold: true },
        alignment: { horizontal: "center" },
        fill: { fgColor: { rgb: "D9D9D9" } },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    }

    /* ================= TOTAL ROW STYLE ================= */
    const totalRowIndex = DATA_END_ROW;
    for (let c = 0; c <= 7; c++) {
      const ref = XLSX.utils.encode_cell({ r: totalRowIndex, c });
      if (worksheet[ref]) {
        worksheet[ref].s = {
          font: { bold: true },
          border: {
            top: { style: "thin" },
            bottom: { style: "double" },
          },
        };
      }
    }

    /* ================= NUMBER FORMATS ================= */
    const THREE_DECIMAL = "0.000";
    const TWO_DECIMAL = "0.00";

    // Data rows
    for (let r = DATA_START_ROW; r < DATA_END_ROW; r++) {
      ["B", "C"].forEach((col) => {
        const cell = worksheet[`${col}${r + 1}`];
        if (cell) cell.z = THREE_DECIMAL;
      });

      ["D", "E", "F", "G"].forEach((col) => {
        const cell = worksheet[`${col}${r + 1}`];
        if (cell) cell.z = TWO_DECIMAL;
      });
    }

    // Total row (SUBTOTAL)
    ["B", "C"].forEach((col) => {
      worksheet[`${col}${DATA_END_ROW + 1}`].z = THREE_DECIMAL;
    });

    ["D", "E", "F", "G"].forEach((col) => {
      worksheet[`${col}${DATA_END_ROW + 1}`].z = TWO_DECIMAL;
    });

    /* ================= WORKBOOK EXPORT ================= */
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Summary");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, `${header}_Summary.xlsx`);
  };

  return (
    <Modal open={isOpen} onClose={handleClose} style={{ zIndex: 100000 }}>
      <Box sx={style}>

        {/* ACTION BUTTONS */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            onClick={handlePrint}
            style={{ background: "lightcoral", color: "black", marginRight: 10 }}
          >
            Print
          </Button>
          <Button
            variant="contained"
            onClick={handleExportExcel}
            style={{ background: "seagreen", color: "white", marginRight: 10 }}
          >
            Export
          </Button>
          <Button
            onClick={handleClose}
            style={{ background: "darkred", color: "white" }}
          >
            Close
          </Button>
        </Box>

        {/* PRINT AREA */}
        <div
          ref={componentRef}
          style={{
            width: "290mm",
            minHeight: "390mm",
            margin: "auto",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          {/* COMPANY HEADER */}
          <h1
            style={{
              textAlign: "center",
              fontSize: "36px",
              color: "darkblue",
              fontFamily: "Courier New",
              fontWeight:'bold',
              margin: 0,
            }}
          >
            {companyName?.toUpperCase()}
          </h1>
          <p style={{ textAlign: "center", margin: 0, fontSize: 18, color: "darkblue" }}>
            {companyAdd}
          </p>
          <p style={{ textAlign: "center", margin: 0, fontSize: 18, color: "darkblue" }}>
            {companyCity}
          </p>

          {/* HEADER LINE */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <div style={{ fontWeight: "bold", fontSize: 18 }}>
              {header} <br />
              Period {formatDate(fromDate)} To {toDate}
            </div>

            <div style={{ fontWeight: "bold", fontSize: 18, color: "red" }}>
              {Total} {totalSale.toFixed(2)}
            </div>
          </div>

          {/* TABLE */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: 15,
            }}
          >
            <thead>
              <tr style={{ background: "#ddd", fontSize: 18 }}>
                <th style={th}>A/c Name</th>
                <th style={th}>Pcs</th>
                <th style={th}>Weight</th>
                <th style={th}>Value</th>
                <th style={th}>C.Tax</th>
                <th style={th}>S.Tax</th>
                <th style={th}>I.Tax</th>
                <th style={th}>Cess</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ fontSize: 17 }}>
                  <td style={td}>{r.accountName}</td>
                  <td style={tdR}>{r.pcs ? r.pcs.toFixed(3) : ""}</td>
                  <td style={tdR}>{r.qty ? r.qty.toFixed(3) : ""}</td>
                  <td style={tdR}>{r.value ? r.value.toFixed(2) : ""}</td>
                  <td style={tdR}>{r.cgst ? r.cgst.toFixed(2) : ""}</td>
                  <td style={tdR}>{r.sgst ? r.sgst.toFixed(2) : ""}</td>
                  <td style={tdR}>{r.igst ? r.igst.toFixed(2) : ""}</td>
                  <td style={tdR}></td>
                </tr>
              ))}
            </tbody>

            {/* TOTAL */}
            <tfoot>
              <tr style={{ fontWeight: "bold", fontSize: 18, background: "#f2f2f2" }}>
                <td style={td}>Total</td>
                <td style={tdR}>{totalPcs.toFixed(3)}</td>
                <td style={tdR}>{totalQty.toFixed(3)}</td>
                <td style={tdR}>{totalValue.toFixed(2)}</td>
                <td style={tdR}>{totalCgst.toFixed(2)}</td>
                <td style={tdR}>{totalSgst.toFixed(2)}</td>
                <td style={tdR}>{totalIgst.toFixed(2)}</td>
                <td style={tdR}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Box>
    </Modal>
  );
};

const th = { border: "1px solid black", padding: 6, textAlign: "center" };
const td = { border: "1px solid black", padding: 6 };
const tdR = { border: "1px solid black", padding: 6, textAlign: "right" };

export default PrintSummary;
