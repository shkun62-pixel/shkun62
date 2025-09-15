import React, { useRef } from "react";
import { Modal, Box, Button, Table, TableContainer, Paper } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import useCompanySetup from "../../Shared/useCompanySetup";
import * as XLSX from 'sheetjs-style';
import { saveAs } from "file-saver"; 

const PrintJBook = ({ isOpen, handleClose, filteredData, splitByDate  }) => {
  const {companyName,companyAdd} = useCompanySetup();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

 // Helper function to format date to dd/mm/yyyy
    const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB"); // 'en-GB' formats to dd/mm/yyyy
  };

  const handleExportExcel = () => {
    const exportData = [];

    Object.entries(filteredData).forEach(([date, { receipts, payments }]) => {
      receipts.forEach(entry => {
        exportData.push({
          "Date": formatDate(date),
          "Account Name": entry.accountname || "",
          "Narration": entry.narration || "",
          "Debit": entry.debit || "",
          "Credit": "",
        });
      });

      payments.forEach(entry => {
        exportData.push({
          "Date": formatDate(date),
          "Account Name": entry.accountname || "",
          "Narration": entry.narration || "",
          "Debit": "",
          "Credit": entry.credit || "",
        });
      });
    });

    const header = Object.keys(exportData[0]);

    const sheetData = [
      [companyName || "Company Name"],
      [companyAdd || "Company Address"],
      ["JOURNAL BOOK"],
      [],
      header,
      ...exportData.map(row => header.map(h => row[h]))
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet["!cols"] = [
      { wch: 12 }, // Date
      { wch: 40 }, // Account Name
      { wch: 40 }, // Narration
      { wch: 15 }, // Debit
      { wch: 15 }, // Credit
    ];

    // Style header row
    header.forEach((_, colIdx) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 4, c: colIdx });
      const cell = worksheet[cellAddress];
      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: {
            patternType: "solid",
            fgColor: { rgb: "4F81BD" }
          },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
    });

    // Style top rows
    ["A1", "A2", "A3"].forEach((addr, idx) => {
      const cell = worksheet[addr];
      if (cell) {
        cell.s = {
          font: { bold: true, sz: idx === 0 ? 16 : 12, color: { rgb: "000000" } },
          alignment: { horizontal: "center" }
        };
      }
    });

    // Right-align Debit and Credit
    const rightAlignCols = ["Debit", "Credit"];
    exportData.forEach((_, rowIdx) => {
      rightAlignCols.forEach(colName => {
        const colIndex = header.indexOf(colName);
        if (colIndex !== -1) {
          const cellAddress = XLSX.utils.encode_cell({ r: 5 + rowIdx, c: colIndex });
          const cell = worksheet[cellAddress];
          if (cell) {
            cell.s = { alignment: { horizontal: "right" } };
          }
        }
      });
    });

    // Merge top 3 rows
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Journal Book");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "JournalBook.xlsx");
  };

  // const handleExportExcel = () => {
  //   const exportRows = [];

  //   Object.keys(filteredData).forEach((date) => {
  //     const { receipts, payments } = filteredData[date];

  //     // Add receipts (debit)
  //     receipts.forEach((item) => {
  //       exportRows.push({
  //         Date: formatDate(date),
  //         "Account Name": item.accountname,
  //         Narration: item.narration,
  //         Debit: item.debit || "",
  //         Credit: "",
  //       });
  //     });

  //     // Add payments (credit)
  //     payments.forEach((item) => {
  //       exportRows.push({
  //         Date: formatDate(date),
  //         "Account Name": item.accountname,
  //         Narration: item.narration,
  //         Debit: "",
  //         Credit: item.credit || "",
  //       });
  //     });
  //   });

  //   const worksheet = XLSX.utils.json_to_sheet(exportRows);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Journal Book");

  //   XLSX.writeFile(workbook, "JournalBook.xlsx");
  // };


  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
          width: "100%",
          height:"100%",
          margin: "auto",
          overflowY: "auto",
        }}
      >
        <Button variant="contained" color="primary" onClick={handlePrint} >
          Print
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleExportExcel}
          style={{ marginLeft: 10 }}
        >
          Export to Excel
        </Button>
        <Button variant="contained" color="secondary" onClick={handleClose} style={{ marginLeft: 10 }}>
          Close
        </Button>
        {/* Printable Area */}
        <div ref={componentRef} style={{ padding: 10 }}>
           {/* Print-Specific Styles */}
          <style>
            {`
            @media print {
              * {
                -webkit-print-color-adjust: exact;
              }

              body {
                margin: 0;
                padding: 0;
              }

              div.page-break {
                page-break-before: always;
                padding-top: 20px; /* This adds space after page break */
              }

              div.page-break:first-of-type {
                page-break-before: auto;
              }

              /* Add safe margin to avoid cutting at top */
              .print-page-inner {
                margin-top: 20px;
              }

              table {
                page-break-inside: auto;
              }

              tr {
                page-break-inside: avoid;
                page-break-after: auto;
              }
            }
            `}
          </style>
            {/* Print Header Once If Not Splitting Pages */}
          {!splitByDate && (
            <>
            <h4 style={{ textAlign: "center",fontSize:35 }}>{companyName}</h4>
            <h4 style={{ textAlign: "center",fontSize:35 }}>{companyAdd}</h4>
            <h4 style={{fontSize:18,textAlign: "center"}}>JOURNAL BOOK</h4>
            </>
          )}
          {Object.keys(filteredData).map((date, idx) => {
            const { receipts, payments } = filteredData[date];
            const receiptTotal = receipts.reduce((sum, item) => sum + parseFloat(item.debit || 0), 0);
            const paymentTotal = payments.reduce((sum, item) => sum + parseFloat(item.credit || 0), 0);

            const showReceipts = receipts.length > 0 && receiptTotal > 0;
            const showPayments = payments.length > 0 && paymentTotal > 0;

            return (
              <div key={idx} style={{ marginBottom: 30, padding: 15,marginTop:20 }} className={splitByDate ? "page-break" : "no-break"}>
                {splitByDate && (
                <>
                <h4 style={{ textAlign: "center",fontSize:35 }}>{companyName}</h4>
                <h4 style={{ textAlign: "center",fontSize:35 }}>{companyAdd}</h4>
                <h4 style={{fontSize:18,textAlign: "center" }}>JOURNAL BOOK</h4>
                </>
                )}
                <h4 style={{ fontSize:20 }}>Date: {formatDate(date)}</h4>

                <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
                  {/* Receipts Table */}
                  {showReceipts && (
                    <TableContainer component={Paper} style={{ width: showPayments ? "50%" : "100%" }}>
                      {/* <h4 style={{ textAlign: "center" }}>Receipts</h4> */}
                      <Table>
                        <thead>
                          <tr style={{ backgroundColor: "lightgrey" }}>
                            <th style={styles.tableHeader}>Account Name</th>
                            <th style={styles.tableHeader}>Narration</th>
                            <th style={styles.tableHeader}>Debit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {receipts.map((item, idx) => (
                            <tr key={idx}>
                              <td style={styles.tableCell}>{item.accountname}</td>
                              <td style={styles.tableCell}>{item.narration}</td>
                              <td style={{ ...styles.tableCell, textAlign: "right" }}>{item.debit}</td>
                            </tr>
                          ))}
                          <tr style={{ fontWeight: "bold" }}>
                            <td style={styles.subTotalCell}>Sub Total</td>
                            <td style={styles.subTotalCell}></td>
                            <td style={{ ...styles.subTotalCell, textAlign: "right" }}>{receiptTotal.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </TableContainer>
                  )}

                  {/* Payments Table */}
                  {showPayments && (
                    <TableContainer component={Paper} style={{ width: showReceipts ? "50%" : "100%" }}>
                      {/* <h4 style={{ textAlign: "center" }}>Payments</h4> */}
                      <Table>
                        <thead>
                          <tr style={{ backgroundColor: "lightgrey" }}>
                            <th style={styles.tableHeader}>Account Name</th>
                            <th style={styles.tableHeader}>Narration</th>
                            <th style={styles.tableHeader}>Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((item, idx) => (
                            <tr key={idx}>
                              <td style={styles.tableCell}>{item.accountname}</td>
                              <td style={styles.tableCell}>{item.narration}</td>
                              <td style={{ ...styles.tableCell, textAlign: "right" }}>{item.credit}</td>
                            </tr>
                          ))}
                          <tr style={{ fontWeight: "bold" }}>
                            <td style={styles.subTotalCell}>Sub Total</td>
                            <td style={styles.subTotalCell}></td>
                            <td style={{ ...styles.subTotalCell, textAlign: "right" }}>{paymentTotal.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </TableContainer>
                  )}
                </div>

                {/* Cash in Hand Display */}
                {/* <div style={{ textAlign: "right", fontWeight: "bold", marginTop: 10 }}>
                  Cash in Hand: {(receiptTotal - paymentTotal).toFixed(2)}
                </div> */}
              </div>
            );
          })}
        </div>
      </Box>
    </Modal>
  );
};

// Styles for table elements
const styles = {
  tableHeader: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
    fontWeight: "bold",
  },
  tableCell: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "left",
  },
  subTotalCell: {
    border: "1px solid black",
    padding: "8px",
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
};

export default PrintJBook;
