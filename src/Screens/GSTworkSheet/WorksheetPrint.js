import React, { useRef } from "react";
import { Modal, Box, Button, Table } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import useCompanySetup from "../Shared/useCompanySetup";
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';

function parseAnyDate(input) {
  if (!input) return null;

  // Already a Date object
  if (input instanceof Date && !isNaN(input)) return input;

  if (typeof input !== "string") return null;

  input = input.trim();

  // ISO formats (2026-01-16 or 2026-01-16T00:00:00.000Z)
  if (/^\d{4}-\d{2}-\d{2}/.test(input)) {
    const d = new Date(input);
    return isNaN(d) ? null : d;
  }

  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
    const [dd, mm, yyyy] = input.split("/");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  // DD-MM-YYYY  ✅ YOUR MISSING CASE
  if (/^\d{2}-\d{2}-\d{4}$/.test(input)) {
    const [dd, mm, yyyy] = input.split("-");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  return null;
}
function formatDateDisplay(dateInput) {
  const d = parseAnyDate(dateInput);
  if (!d) return "";
  return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
}

const WorksheetPrint = ({ isOpen, handleClose, entries = [], fromDate, uptoDate }) => {
  const { companyName, companyAdd, companyCity } = useCompanySetup();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Format date → dd/mm/yyyy
  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-GB");
  };

  // If date given as dd/mm/yyyy → convert
  const parseDMY = (str) => {
    const [d, m, y] = str.split("/");
    return new Date(`${y}-${m}-${d}`);
  };

  // ---------- PAGINATION: 20 ROWS PER PAGE ----------
  const rowsPerPage = 20;
  const pages = [];
  for (let i = 0; i < entries.length; i += rowsPerPage) {
    pages.push(entries.slice(i, i + rowsPerPage));
  }

  // ---------- TOTALS (OVER ALL ENTRIES) ----------
  const totalQty = entries.reduce((s, e) => s + Number(e.qty || 0), 0);
  const totalValue = entries.reduce((s, e) => s + Number(e.value || 0), 0);
  const totalCtax = entries.reduce((s, e) => s + Number(e.ctax || 0), 0);
  const totalStax = entries.reduce((s, e) => s + Number(e.stax || 0), 0);
  const totalItax = entries.reduce((s, e) => s + Number(e.itax || 0), 0);
  const totalVamt = entries.reduce((s, e) => s + Number(e.vamt || 0), 0);

  // ---------------------- EXPORT EXCEL ----------------------
  const handleExportExcel = () => {
    let exportData = [];

    (entries || []).forEach((en) => {
      exportData.push({
        "Date" : formatDateDisplay(en.date),
        "Bill No": en.vbillno || en.vno || "",
        "A/C Name": en.item?.sdisc || "",
        "Gst": (en.item?.gst || 0) + "%",
        "Qty": Number(en.qty || 0),
        "Taxable Value": Number(en.value || 0),
        "C.Tax": Number(en.ctax || 0),
        "S.Tax": Number(en.stax || 0),
        "I.Tax": Number(en.itax || 0),
        "V.Amt": Number(en.vamt || 0),
      });
    });

    if (exportData.length === 0) return;

    const header = Object.keys(exportData[0]);

    // Period
    const periodFrom = fromDate ? formatDateDisplay(fromDate) : "--";
    const periodTo = uptoDate ? formatDateDisplay(uptoDate) : "--";

    // BUILD SHEET
    const sheetData = [
      [companyName || "Company Name"],
      [companyAdd || "Company Address"],
      [`Summary Detail Report - Period From: ${periodFrom}  To: ${periodTo}`],
      [],
      header,
      ...exportData.map((row) => header.map((h) => row[h])),
    ];

    // TOTALS
    const numericFields = ["Qty", "Taxable Value", "C.Tax", "S.Tax", "I.Tax", "V.Amt"];
    const totals = {};
    header.forEach((h, index) => {
      if (index === 0) {
        totals[h] = "Total";
      } else if (numericFields.includes(h)) {
        const colLetter = XLSX.utils.encode_col(index);
        const firstRow = 5; 
        const lastRow = 4 + exportData.length;
        totals[h] = { f: `SUBTOTAL(9,${colLetter}${firstRow + 1}:${colLetter}${lastRow + 1})` };
      } else {
        totals[h] = "";
      }
    });

    sheetData.push(header.map((h) => totals[h]));

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Column Widths
    worksheet["!cols"] = [
      { wch: 12 },
      { wch: 10 },
      { wch: 40 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
    ];
    
    // Force 2 decimal places
    numericFields.forEach((field) => {
      const colIdx = header.indexOf(field);
      if (colIdx !== -1) {
        for (let r = 5; r < exportData.length + 6; r++) {
          const addr = XLSX.utils.encode_cell({ r, c: colIdx });
          if (worksheet[addr]) {
            worksheet[addr].t = "n";       // numeric type
            worksheet[addr].z = "0.00";    // 2 decimal places
          }
        }
      }
    });

    // HEADER STYLE
    header.forEach((_, colIdx) => {
      const addr = XLSX.utils.encode_cell({ r: 4, c: colIdx });
      if (worksheet[addr]) {
        worksheet[addr].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    });

    // COMPANY STYLE
    ["A1", "A2", "A3"].forEach((cell, idx) => {
      if (worksheet[cell]) {
        worksheet[cell].s = {
          font: { bold: true, sz: idx === 0 ? 16 : 12, color: { rgb: "000000" } },
          alignment: { horizontal: "center" },
        };
      }
    });

    // RIGHT ALIGN numeric fields
    numericFields.forEach((field) => {
      const colIdx = header.indexOf(field);
      if (colIdx !== -1) {
        for (let r = 5; r < exportData.length + 6; r++) {
          const addr = XLSX.utils.encode_cell({ r, c: colIdx });
          if (worksheet[addr]) {
            worksheet[addr].s = { alignment: { horizontal: "right" } };
          }
        }
      }
    });

    // TOTAL ROW STYLE
    const totalRowIndex = exportData.length + 5;
    header.forEach((_, colIdx) => {
      const addr = XLSX.utils.encode_cell({ r: totalRowIndex, c: colIdx });
      if (worksheet[addr]) {
        worksheet[addr].s = {
          font: { bold: true, color: { rgb: "000000" } },
          fill: { patternType: "solid", fgColor: { rgb: "D9D9D9" } },
          alignment: { horizontal: colIdx === 0 ? "left" : "right" },
        };
      }
    });

    // MERGE TOP ROWS
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Summary Detail");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "SummaryDetail.xlsx");
  };


  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
          width: "100%",
          height: "100%",
          margin: "auto",
          overflowY: "auto",
        }}
      >
        {/* ACTION BUTTONS */}
        <Button className="Button" variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>
        <Button className="Button" variant="contained" color="primary" onClick={handleExportExcel}  style={{ marginLeft: 10 }}>
          Export
        </Button>

        <Button
          className="Button"
          variant="contained"
          color="secondary"
          onClick={handleClose}
          style={{ marginLeft: 10 }}
        >
          Close
        </Button>

        {/* PRINT AREA */}
        <div
          ref={componentRef}
          style={{
            width: "390mm",
            minHeight: "390mm",
            margin: "auto",
            padding: "30px",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
        >
          {/* Header (printed once at top) */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              className="headers2"
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bolder",
              }}
            >
              {companyName}
            </span>
            <span className="headers" style={{ textAlign: "center", fontSize: 35 }}>
              {companyAdd}
            </span>
            <span className="headers" style={{ textAlign: "center", fontSize: 35 }}>
              {companyCity}
            </span>
          </div>

          {/* PERIOD */}
          <div style={{ display: "flex", marginTop: 10 }}>
            <span style={{ fontSize: 25, fontWeight: "bolder", marginLeft: 15 }}>
              Summary Detail Report
            </span>

            <span style={{ fontSize: 25, fontWeight: "bold", marginLeft: "auto" }}>
              From : {formatDateDisplay(fromDate)}
            </span>

            <span
              style={{
                fontSize: 25,
                fontWeight: "bold",
                marginLeft: 10,
                marginRight: 20,
              }}
            >
              Upto : {formatDateDisplay(uptoDate)}
            </span>
          </div>

          {/* TABLE PAGES */}
          <div style={{ padding: "15px" }}>
            {pages.map((pageEntries, pageIndex) => {
              const isLastPage = pageIndex === pages.length - 1;

              return (
                <div
                  key={pageIndex}
                  style={{
                    pageBreakAfter: isLastPage ? "auto" : "always",
                    marginBottom: 20,
                  }}
                >
                  <Table size="small">
                    <thead>
                      <tr style={{ backgroundColor: "lightgrey" }}>
                        <th style={styles.tableHeader}>Date</th>
                        <th style={styles.tableHeader}>Bill No</th>
                        <th style={styles.tableHeader}>A/c Name</th>
                        <th style={styles.tableHeader}>Gst</th>
                        <th style={styles.tableHeader}>Qty</th>
                        <th style={styles.tableHeader}>Taxable Value</th>
                        <th style={styles.tableHeader}>C.Tax</th>
                        <th style={styles.tableHeader}>S.Tax</th>
                        <th style={styles.tableHeader}>I.Tax</th>
                        <th style={styles.tableHeader}>V.Amt</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pageEntries.map((en, idx) => (
                        <tr key={idx}>
                          <td style={styles.tableCell}>
                            {formatDateDisplay(en.date)}
                          </td>

                          <td style={styles.tableCell}>{en.vbillno || en.vno}</td>

                          <td style={styles.tableCell}>{en.item?.sdisc}</td>

                          <td style={styles.tableCell}>{en.item?.gst}%</td>

                          <td style={styles.tableCellRight}>{en.qty}</td>

                          <td style={styles.tableCellRight}>
                            {Number(en.value || 0).toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {Number(en.ctax || 0).toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {Number(en.stax || 0).toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {Number(en.itax || 0).toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {Number(en.vamt || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    {/* TOTALS ONLY ON LAST PAGE */}
                    {isLastPage && (
                      <tfoot>
                        <tr style={{ backgroundColor: "#d9d9d9", fontWeight: "bold" }}>
                          <td colSpan={4} style={styles.totalLabel}>
                            Totals:
                          </td>

                          <td style={styles.tableCellRight}>{totalQty}</td>

                          <td style={styles.tableCellRight}>
                            {totalValue.toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {totalCtax.toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {totalStax.toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {totalItax.toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {totalVamt.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </Table>
                </div>
              );
            })}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

// styles
const styles = {
  tableHeader: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "20px",
  },
  tableCell: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "left",
    fontSize: "18px",
  },
  tableCellRight: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "right",
    fontSize: "18px",
  },
  totalLabel: {
    textAlign: "right",
    border: "1px solid black",
    padding: "8px",
    fontSize: "18px",
  },
};

export default WorksheetPrint;
