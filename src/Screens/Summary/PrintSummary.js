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
  const totalValue = rows.reduce((s, r) => s + (r.value || 0), 0);
  const totalCgst = rows.reduce((s, r) => s + (r.cgst || 0), 0);
  const totalSgst = rows.reduce((s, r) => s + (r.sgst || 0), 0);
  const totalIgst = rows.reduce((s, r) => s + (r.igst || 0), 0);

    const exportToExcel = () => {
    const data = [
        [companyName?.toUpperCase()],
        [companyAdd],
        [companyCity],
        [],
        [`SALE SUMMARY DATED :: ${formatDate(fromDate)} TO ${toDate}`],
        [],
        [
        "Account Name",
        "Qty",
        "Value of Goods",
        "C.TAX",
        "S.TAX",
        "I.TAX",
        "Cess",
        "Pcs/Bags",
        ],
    ];

    // 🔹 SALE ROWS
    rows.forEach((r) => {
        data.push([
        r.account || "",
        r.qty || 0,
        r.value || 0,
        r.cgst || 0,
        r.sgst || 0,
        r.igst || 0,
        0,
        0,
        ]);
    });

    // 🔹 TOTAL ROW
    data.push([
        "TOTAL :-",
        totalQty,
        totalValue,
        totalCgst,
        totalSgst,
        totalIgst,
        0,
        0,
    ]);

    const ws = XLSX.utils.aoa_to_sheet(data);

    // 🔹 MERGE COMPANY HEADER
    ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 7 } },
    ];

    // 🔹 COLUMN WIDTH
    ws["!cols"] = [
        { wch: 30 },
        { wch: 10 },
        { wch: 18 },
        { wch: 12 },
        { wch: 12 },
        { wch: 12 },
        { wch: 10 },
        { wch: 10 },
    ];

    // 🔹 STYLES
    const centerBold = {
        alignment: { horizontal: "center" },
        font: { bold: true },
    };

    ws["A1"].s = { ...centerBold, font: { bold: true, sz: 16 } };
    ws["A2"].s = centerBold;
    ws["A3"].s = centerBold;
    ws["A5"].s = centerBold;

    // 🔹 HEADER COLOR
    const headerRow = 6;
    const headerStyle = {
        fill: { fgColor: { rgb: "D9D9D9" } },
        font: { bold: true },
        alignment: { horizontal: "center" },
        border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
        },
    };

    ["A", "B", "C", "D", "E", "F", "G", "H"].forEach((col) => {
        ws[`${col}${headerRow + 1}`].s = headerStyle;
    });

    // 🔹 RIGHT ALIGN NUMBERS
    for (let r = headerRow + 1; r <= data.length; r++) {
        ["B", "C", "D", "E", "F", "G", "H"].forEach((col) => {
        if (ws[`${col}${r}`]) {
            ws[`${col}${r}`].s = {
            alignment: { horizontal: "right" },
            };
        }
        });
    }

    // 🔹 WORKBOOK
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sale Summary");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
        new Blob([buf], { type: "application/octet-stream" }),
        `Sale_Summary_${formatDate(fromDate)}.xlsx`
    );
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
            onClick={exportToExcel}
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
              Sale Summary Report <br />
              Period {formatDate(fromDate)} To {toDate}
            </div>

            <div style={{ fontWeight: "bold", fontSize: 18, color: "red" }}>
              Total Sale Rs. {totalSale.toFixed(2)}
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
                  <td style={td}>{r.account}</td>
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
