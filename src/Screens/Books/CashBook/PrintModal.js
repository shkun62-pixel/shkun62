import React, { useRef } from "react";
import { Modal, Box, Button, Table, TableContainer, Paper } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import useCompanySetup from "../../Shared/useCompanySetup";
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';


const PrintModal = ({ isOpen, handleClose, filteredData, splitByDate, fromDate, uptoDate  }) => {

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
  const sheetData = [];

  // Header rows
  sheetData.push([companyName || "Company Name"]);
  sheetData.push([companyAdd || "Company Address"]);
  sheetData.push([`SaleBook From ${formatDate(fromDate)} To ${formatDate(uptoDate)}`]); // Main header
  sheetData.push([]);
  sheetData.push(["Date", "Narration", "Book", "Debit", "Credit"]);

  let grandDebit = 0;
  let grandCredit = 0;
  let previousClosingCash = 0;
  const totalStyledRows = [];

  const sortedDates = Object.keys(filteredData).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  let currentRow = sheetData.length;

  sortedDates.forEach((date) => {
    const { receipts, payments } = filteredData[date];

    let dateDebit = 0;
    let dateCredit = 0;

    // Opening Cash
    sheetData.push([
      formatDate(date),
      "** Opening Cash **",
      "",
      "",
      previousClosingCash.toFixed(2),
    ]);
    dateCredit += previousClosingCash;
    currentRow++;

    // Receipts
    receipts.forEach((r) => {
      const credit = parseFloat(r.receipt_credit || 0);
      sheetData.push([
        formatDate(date),
        r.accountname,
        r.book || "",
        "",
        credit.toFixed(2),
      ]);
      dateCredit += credit;
      currentRow++;
    });

    // Payments
    payments.forEach((p) => {
      const debit = parseFloat(p.payment_debit || 0);
      sheetData.push([
        formatDate(date),
        p.accountname,
        p.book || "",
        debit.toFixed(2),
        "",
      ]);
      dateDebit += debit;
      currentRow++;
    });

    // Closing Cash
    const closingCash = dateCredit - dateDebit;
    previousClosingCash = closingCash;

    sheetData.push([
      formatDate(date),
      "** Closing Cash **",
      "",
      closingCash.toFixed(2),
      "",
    ]);
    currentRow++;

    // Total row
    const totalRowIndex = currentRow;
    sheetData.push([
      "",
      "TOTAL :-",
      "",
      (dateDebit + closingCash).toFixed(2),
      dateCredit.toFixed(2),
    ]);
    totalStyledRows.push(totalRowIndex);
    currentRow++;

    sheetData.push([]);
    currentRow++;

    grandDebit += dateDebit + closingCash;
    grandCredit += dateCredit;
  });

  // Create worksheet and style it
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet["!cols"] = [
    { wch: 14 },
    { wch: 45 },
    { wch: 10 },
    { wch: 15 },
    { wch: 15 },
  ];

  // Style company name and address
  ["A1", "A2", "A3"].forEach((cell) => {
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { bold: true, sz: 14 },
        alignment: { horizontal: "center" },
      };
    }
  });

  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, 
  ];

  // Style header row
["A5", "B5", "C5", "D5", "E5"].forEach((cell) => {
  if (worksheet[cell]) {
    worksheet[cell].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
      alignment: { horizontal: "center" },
    };
  }
});


  // Style TOTAL rows
  totalStyledRows.forEach((rowIdx) => {
    ["A", "B", "C", "D", "E"].forEach((col) => {
      const cell = worksheet[`${col}${rowIdx + 1}`];
      if (cell) {
        cell.s = {
          font: { bold: true },
          fill: { patternType: "solid", fgColor: { rgb: "B8CCE4" } }, // Light blue
          alignment: { horizontal: "right" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
          },
        };
      }
    });
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "CashBook");

  const buffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true,
  });

  const blob = new Blob([buffer], { type: "application/octet-stream" });
  saveAs(blob, "CashBook.xlsx");
};


  // const handleExportExcel = () => {
  //   const sheetData = [];

  //   // Header rows
  //   sheetData.push([companyName || "Company Name"]);
  //   sheetData.push([companyAdd || "Company Address"]);
  //   sheetData.push([]);
  //   sheetData.push(["Date", "Narration", "Book", "Debit", "Credit"]);

  //   let grandDebit = 0;
  //   let grandCredit = 0;
  //   let previousClosingCash = 0;

  //   const sortedDates = Object.keys(filteredData).sort(
  //     (a, b) => new Date(a) - new Date(b)
  //   );

  //   sortedDates.forEach((date) => {
  //     const { receipts, payments } = filteredData[date];

  //     let dateDebit = 0;
  //     let dateCredit = 0;

  //     // Opening Cash = previous closing
  //     sheetData.push([
  //       formatDate(date),
  //       "** Opening Cash **",
  //       "",
  //       "",
  //       previousClosingCash.toFixed(2),
  //     ]);
  //     dateCredit += previousClosingCash;

  //     // Receipts
  //     receipts.forEach((r) => {
  //       const credit = parseFloat(r.receipt_credit || 0);
  //       sheetData.push([
  //         formatDate(date),
  //         r.accountname,
  //         r.book || "",
  //         "",
  //         credit.toFixed(2),
  //       ]);
  //       dateCredit += credit;
  //     });

  //     // Payments
  //     payments.forEach((p) => {
  //       const debit = parseFloat(p.payment_debit || 0);
  //       sheetData.push([
  //         formatDate(date),
  //         p.accountname,
  //         p.book || "",
  //         debit.toFixed(2),
  //         "",
  //       ]);
  //       dateDebit += debit;
  //     });

  //     // Closing Cash = Credit - Debit
  //     const closingCash = dateCredit - dateDebit;
  //     previousClosingCash = closingCash;

  //     // Add Closing Cash row
  //     sheetData.push([
  //       formatDate(date),
  //       "** Closing Cash **",
  //       "",
  //       closingCash.toFixed(2),
  //       "",
  //     ]);

  //     // Add Totals row
  //     sheetData.push([
  //       "",
  //       "TOTAL :-",
  //       "",
  //       (dateDebit + closingCash).toFixed(2),
  //       dateCredit.toFixed(2),
  //     ]);

  //     sheetData.push([]);

  //     grandDebit += dateDebit + closingCash;
  //     grandCredit += dateCredit;
  //   });

  //   // Create sheet
  //   const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  //   worksheet["!cols"] = [
  //     { wch: 14 },
  //     { wch: 45 },
  //     { wch: 10 },
  //     { wch: 15 },
  //     { wch: 15 },
  //   ];

  //   // Company name & address styling
  //   ["A1", "A2"].forEach((cell) => {
  //     if (worksheet[cell]) {
  //       worksheet[cell].s = {
  //         font: { bold: true, sz: 14 },
  //         alignment: { horizontal: "center" },
  //       };
  //     }
  //   });

  //   worksheet["!merges"] = [
  //     { s: { r: 0, c: 0 }, e: { r: 0, c: 4 } },
  //     { s: { r: 1, c: 0 }, e: { r: 1, c: 4 } },
  //   ];

  //   // Header styling
  //   ["A4", "B4", "C4", "D4", "E4"].forEach((cell) => {
  //     if (worksheet[cell]) {
  //       worksheet[cell].s = {
  //         font: { bold: true, color: { rgb: "FFFFFF" } },
  //         fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
  //         alignment: { horizontal: "center" },
  //       };
  //     }
  //   });

  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "CashBook");

  //   const buffer = XLSX.write(workbook, {
  //     bookType: "xlsx",
  //     type: "array",
  //     cellStyles: true,
  //   });

  //   const blob = new Blob([buffer], { type: "application/octet-stream" });
  //   saveAs(blob, "CashBook.xlsx");
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
        <Button variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>
        
        <Button
        variant="contained"
        style={{ backgroundColor: "lightgreen", marginLeft: 10 }}
        onClick={handleExportExcel}
      >
        Export to Excel
      </Button>

      <Button variant="contained" color="secondary" onClick={handleClose} style={{ marginLeft: 10 }}>
        Close
      </Button>

        {/* Printable Area */}
        <div ref={componentRef} style={{padding:"20px"}}>
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
              <h4 style={{ textAlign: "center",fontSize:20,color:'darkblue' }}>{companyName}</h4>
              <h4 style={{ textAlign: "center",fontSize:20,color:'darkblue' }}>{companyAdd}</h4>
              <h4 style={{ textAlign: "center",fontSize:20,color:'darkblue' }}>Cash Book</h4>
            </>
          )}

          {Object.keys(filteredData).map((date, idx) => {
            const { receipts, payments } = filteredData[date];
            const receiptTotal = receipts.reduce((sum, item) => sum + parseFloat(item.receipt_credit || 0), 0);
            const paymentTotal = payments.reduce((sum, item) => sum + parseFloat(item.payment_debit || 0), 0);

            const showReceipts = receipts.length > 0 && receiptTotal > 0;
            const showPayments = payments.length > 0 && paymentTotal > 0;

            return (
            <div key={idx} style={{ marginBottom: 30,marginTop:20 }}  className={splitByDate ? "page-break" : "no-break"}>
             {/* Conditionally include header per page if split is on */}
            {splitByDate && (
              <>
              <h4 style={{ textAlign: "center",fontSize:20,color:'darkblue' }}>{companyName}</h4>
              <h4 style={{ textAlign: "center",fontSize:20,color:'darkblue' }}>{companyAdd}</h4>
              <h4 style={{ textAlign: "center",fontSize:20,color:'darkblue' }}>Cash Book</h4>
              </>
            )}
             <h4 style={{}}>Date: {formatDate(date)}</h4>
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
                        <th style={styles.tableHeader}>Receipts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receipts.map((item, idx) => (
                        <tr key={idx}>
                          <td style={styles.tableCell}>{item.accountname}</td>
                          <td style={styles.tableCell}>{item.narration}</td>
                          <td style={{ ...styles.tableCell, textAlign: "right" }}>{item.receipt_credit}</td>
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
                        <th style={styles.tableHeader}>Payments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((item, idx) => (
                        <tr key={idx}>
                          <td style={styles.tableCell}>{item.accountname}</td>
                          <td style={styles.tableCell}>{item.narration}</td>
                          <td style={{ ...styles.tableCell, textAlign: "right" }}>{item.payment_debit}</td>
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

export default PrintModal;
