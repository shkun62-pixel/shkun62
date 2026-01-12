// import React, { useRef } from "react";
// import { Modal, Table, Button } from "react-bootstrap";
// import useCompanySetup from "../Shared/useCompanySetup";
// import * as XLSX from "sheetjs-style";
// import { saveAs } from "file-saver";

// const AnnexureWiseModal = ({ show, onClose, data, fromDate, toDate }) => {
//   const { companyName, companyAdd, companyCity } = useCompanySetup();
//   const printRef = useRef();

//   const handlePrint = () => {
//     const printContents = printRef.current.innerHTML;
//     const printWindow = window.open("", "", "height=900,width=1200");

//     printWindow.document.write(`
//       <html>
//         <head>
//           <title></title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               padding: 0px;
//             }

//             .company-header {
//               text-align: center;
//             }

//             .company-header h2 {
//               margin: 0;
//               font-size: 22px;
//               font-weight: bold;
//               letter-spacing: 1px;
//               margin-top: -10px;
//             }

//             .company-header p {
//               margin: 0;
//               font-size: 14px;
//             }

//             .report-header {
//               display: flex;
//               justify-content: space-between;
//               align-items: center;
//               font-weight: bold;
//             }

//             .report-title {
//               font-size: 12px;
//             }

//             .report-period {
//               font-size: 12px;
//             }

//             h5 {
//               border-bottom: 2px solid #000;
//               margin-top: 10px;
//               margin-bottom: 10px;
//             }

//             table {
//               width: 100%;
//               border-collapse: collapse;
//               font-size: 12px;
//               margin-top: 5;
//             }

//             th, td {
//               border: 1px solid #000;
//               padding: 6px;
//             }

//             th {
//               background: #e6f0ff;
//               text-align: center;
//             }

//             td {
//               vertical-align: middle;
//             }

//             .right {
//               text-align: right !important;
//             }

//             .total-row {
//               font-weight: bold;
//               background: #f2f2f2;
//             }

//             .page-break {
//               page-break-after: always;
//             }
//           </style>
//         </head>
//         <body>

//           <!-- ✅ COMPANY HEADER (PRINT ONLY) -->
//           <div class="company-header">
//             <h2>${companyName?.toUpperCase() || ""}</h2>
//             <p>${companyAdd || ""}</p>
//             <p>${companyCity || ""}</p>
//           </div>
//           <div class="report-header">
//             <div class="report-title">TRIAL BALANCE</div>
//             <div class="report-period">
//               From ${fromDate} Upto ${toDate}
//             </div>
//           </div>

//           ${printContents}

//         </body>
//       </html>
//     `);

//     printWindow.document.close();
//     printWindow.focus();
//     printWindow.print();
//     printWindow.close();
//   };
//   const handleExportExcel = () => {
//     const wb = XLSX.utils.book_new();
//     const wsData = [];

//     const grandDebitCells = [];
//     const grandCreditCells = [];

//     /* ================= HEADER ================= */
//     wsData.push([companyName?.toUpperCase() || ""]);
//     wsData.push([companyAdd || ""]);
//     wsData.push([companyCity || ""]);
//     wsData.push([]);
//     wsData.push([`TRIAL BALANCE From ${fromDate} Upto ${toDate}`]);
//     wsData.push([]);

//     /* ================= DATA ================= */
//     Object.entries(data).forEach(([annexure, ledgers]) => {
//       wsData.push([annexure]);

//       wsData.push([
//         "Account Name",
//         "City",
//         "Pkgs",
//         "Qty",
//         "Dr. Balance",
//         "Cr. Balance",
//       ]);

//       const startRow = wsData.length + 1;

//       ledgers.forEach((l) => {
//         const bal = l.totals.balance;
//         const isDr = l.totals.drcr === "DR";

//         wsData.push([
//           l.formData.ahead,
//           l.formData.city,
//           Number(l.netPcs || 0),
//           Number(l.netQty || 0),
//           isDr ? Math.abs(bal) : "",
//           !isDr ? Math.abs(bal) : "",
//         ]);
//       });

//       const endRow = wsData.length;

//       const totalRowIndex = wsData.length + 1;

//       wsData.push([
//         "",
//         "",
//         "",
//         "Totals :",
//         { f: `SUBTOTAL(9,E${startRow}:E${endRow})` },
//         { f: `SUBTOTAL(9,F${startRow}:F${endRow})` },
//       ]);

//       // Store total cell refs for grand total
//       grandDebitCells.push(`E${totalRowIndex}`);
//       grandCreditCells.push(`F${totalRowIndex}`);

//       wsData.push([]);
//     });

//     /* ================= GRAND TOTAL ================= */
//     const grandTotalRow = wsData.length + 1;

//     wsData.push([
//       "",
//       "",
//       "",
//       "Grand Total :",
//       { f: grandDebitCells.join("+") },
//       { f: grandCreditCells.join("+") },
//     ]);

//     const ws = XLSX.utils.aoa_to_sheet(wsData);

//     /* ================= MERGES ================= */
//     ws["!merges"] = [
//       { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
//       { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
//       { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
//       { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } },
//     ];

//     /* ================= COLUMN WIDTH ================= */
//     ws["!cols"] = [
//       { wch: 30 },
//       { wch: 25 },
//       { wch: 12 },
//       { wch: 12 },
//       { wch: 15 },
//       { wch: 15 },
//     ];

//     /* ================= COMPANY HEADER STYLE ================= */
//     ["A1", "A2", "A3"].forEach((cell) => {
//       if (ws[cell]) {
//         ws[cell].s = {
//           font: { bold: true, sz: 14 },
//           alignment: { horizontal: "center", vertical: "center" },
//         };
//       }
//     });

//     /* ================= TRIAL BALANCE STYLE ================= */
//     if (ws["A5"]) {
//       ws["A5"].s = {
//         font: { bold: true, sz: 13 },
//         alignment: { horizontal: "center", vertical: "center" },
//       };
//     }

//     /* ================= TABLE HEADER STYLE ================= */
//     Object.keys(ws).forEach((cell) => {
//       if (ws[cell]?.v === "Account Name") {
//         const row = XLSX.utils.decode_cell(cell).r + 1;

//         ["A", "B", "C", "D", "E", "F"].forEach((col) => {
//           const c = `${col}${row}`;
//           if (ws[c]) {
//             ws[c].s = {
//               font: { bold: true },
//               fill: { fgColor: { rgb: "C1EEF7" } },
//               alignment: { horizontal: "center" },
//             };
//           }
//         });
//       }
//     });

//     /* ================= TOTAL + GRAND TOTAL STYLE ================= */
//     Object.keys(ws).forEach((cell) => {
//       if (ws[cell]?.v === "Totals :" || ws[cell]?.v === "Grand Total :") {
//         const row = XLSX.utils.decode_cell(cell).r + 1;

//         ["A", "B", "C", "D", "E", "F"].forEach((col) => {
//           const c = `${col}${row}`;
//           if (ws[c]) {
//             ws[c].s = {
//               font: { bold: true },
//               fill: {
//                 fgColor: {
//                   rgb: ws[cell]?.v === "Grand Total :" ? "B7DEE8" : "CFCECB",
//                 },
//               },
//               alignment: { horizontal: "right" },
//             };
//           }
//         });
//       }
//     });

//     /* ================= NUMERIC FORMAT + RIGHT ALIGN ================= */
//     Object.keys(ws).forEach((cell) => {
//       if (cell.startsWith("!")) return;

//       const col = cell.replace(/[0-9]/g, "");

//       // PKGS & QTY → 3 DECIMALS
//       if (["C", "D"].includes(col)) {
//         ws[cell].s = {
//           ...ws[cell].s,
//           alignment: { horizontal: "right" },
//           numFmt: "0.000", // 🔥 FORCE 3 DECIMALS
//         };
//       }

//       // DR / CR → 2 DECIMALS
//       if (["E", "F"].includes(col)) {
//         ws[cell].s = {
//           ...ws[cell].s,
//           alignment: { horizontal: "right" },
//           numFmt: "0.00", // 🔥 FORCE 2 DECIMALS
//         };
//       }
//     });

//     /* ================= EXPORT ================= */
//     XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");

//     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
//     saveAs(
//       new Blob([excelBuffer], { type: "application/octet-stream" }),
//       "Annexure_Wise_Trial_Balance.xlsx"
//     );
//   };

//   return (
//     <Modal show={show} onHide={onClose} size="xl" className="custom-modal">
//       <Modal.Header closeButton>
//         <Modal.Title>Annexure Wise Trial Balance</Modal.Title>
//       </Modal.Header>

//       <Modal.Body style={{ overflowY: "auto" }}>
//         {/* PRINT AREA */}
//         <div ref={printRef}>

//           {Object.entries(data).map(([annexure, ledgers], index) => {
//             let totalDebit = 0;
//             let totalCredit = 0;

//             return (
//               <div key={annexure} className="page-break">
//                 {/* ANNEXURE HEADER */}
//                 <h5 style={{fontSize:18,fontWeight:'bold', borderBottom:"3px solid black", letterSpacing:2}}>{annexure}</h5>

//                 <Table className="custom-table" size="sm" style={{marginTop:5}}>
//                   <thead style={{backgroundColor:"#c1eef7"}}>
//                     <tr>
//                       <th>Account Name</th>
//                       <th>City</th>
//                       <th className="text-end">Pkgs</th>
//                       <th className="text-end">Qty</th>
//                       <th className="text-end">Dr.Balance</th>
//                       <th className="text-end">Cr.Balance</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {ledgers.map((l) => {
//                       const bal = l.totals.balance;
//                       const isDr = l.totals.drcr === "DR";

//                       if (isDr) totalDebit += Math.abs(bal);
//                       else totalCredit += Math.abs(bal);

//                       return (
//                         <tr key={l._id}>
//                           <td>{l.formData.ahead}</td>
//                           <td>{l.formData.city}</td>
//                           <td className="text-end">
//                             {l.netPcs?.toFixed(3) || "0.000"}
//                           </td>
//                           <td className="text-end">
//                             {l.netQty?.toFixed(3) || "0.000"}
//                           </td>
//                           <td className="text-end">
//                             {isDr ? Math.abs(bal).toFixed(2) : ""}
//                           </td>
//                           <td className="text-end">
//                             {!isDr ? Math.abs(bal).toFixed(2) : ""}
//                           </td>
//                         </tr>
//                       );
//                     })}

//                     {/* TOTAL ROW */}
//                     <tr style={{backgroundColor:"#cfcecb", fontWeight:'bold'}} className="total-row">
//                       <td colSpan={4} className="text-end">Totals :</td>
//                       <td className="text-end">{totalDebit.toFixed(2)}</td>
//                       <td className="text-end">{totalCredit.toFixed(2)}</td>
//                     </tr>
//                   </tbody>
//                 </Table>
//               </div>
//             );
//           })}
//         </div>
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant="primary" onClick={handlePrint}>
//           Print
//         </Button>
//         <Button variant="success" onClick={handleExportExcel}>
//           Export Excel
//         </Button>
//         <Button variant="secondary" onClick={onClose}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default AnnexureWiseModal;

import React, { useRef } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import useCompanySetup from "../Shared/useCompanySetup";
import * as XLSX from "sheetjs-style";
import { saveAs } from "file-saver";

/* =====================================================
   🔥 SINGLE SOURCE OF TRUTH FOR COLUMNS
   Change header / order / decimals HERE only
===================================================== */
const TABLE_COLUMNS = [
  {
    key: "ahead",
    header: "Account Name",
    align: "left",
    getValue: (l) => l.formData.ahead,
  },
  {
    key: "city",
    header: "City",
    align: "left",
    getValue: (l) => l.formData.city,
  },
  {
    key: "netPcs",
    header: "Pcs", // 🔁 change name here → reflects everywhere
    align: "right",
    decimals: 3,
    getValue: (l) => l.netPcs || 0,
  },
  {
    key: "netQty",
    header: "Qty",
    align: "right",
    decimals: 3,
    getValue: (l) => l.netQty || 0,
  },
  {
    key: "dr",
    header: "Dr. Balance",
    align: "right",
    decimals: 2,
    getValue: (l) =>
      l.totals.drcr === "DR" ? Math.abs(l.totals.balance) : "",
  },
  {
    key: "cr",
    header: "Cr. Balance",
    align: "right",
    decimals: 2,
    getValue: (l) =>
      l.totals.drcr === "CR" ? Math.abs(l.totals.balance) : "",
  },
];

const AnnexureWiseModal = ({ show, onClose, data, fromDate, toDate }) => {
  const { companyName, companyAdd, companyCity } = useCompanySetup();
  const printRef = useRef();

  /* ================= PRINT ================= */
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "height=900,width=1200");

    printWindow.document.write(`
      <html>
        <head>
          <title></title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 0px;
            }

            .company-header {
              text-align: center;
            }

            .company-header h2 {
              margin: 0;
              font-size: 22px;
              font-weight: bold;
              letter-spacing: 1px;
              margin-top: -10px;
            }

            .company-header p {
              margin: 0;
              font-size: 14px;
            }

            .report-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-weight: bold;
            }

            .report-title {
              font-size: 12px;
            }

            .report-period {
              font-size: 12px;
            }

            h5 {
              border-bottom: 2px solid #000;
              margin-top: 10px;
              margin-bottom: 10px;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 12px;
              margin-top: 5;
            }

            th, td {
              border: 1px solid #000;
              padding: 6px;
            }

            th {
              background: #e6f0ff;
              text-align: center;
            }

            td {
              vertical-align: middle;
            }

            .right {
              text-align: right !important;
            }

            .total-row {
              font-weight: bold;
              background: #f2f2f2;
            }

            .page-break {
              page-break-after: always;
            }
          </style>
        </head>
        <body>

          <!-- ✅ COMPANY HEADER (PRINT ONLY) -->
          <div class="company-header">
            <h2>${companyName?.toUpperCase() || ""}</h2>
            <p>${companyAdd || ""}</p>
            <p>${companyCity || ""}</p>
          </div>
          <div class="report-header">
            <div class="report-title">TRIAL BALANCE</div>
            <div class="report-period">
              From ${fromDate} Upto ${toDate}
            </div>
          </div>

          ${printContents}

        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  /* ================= EXCEL EXPORT ================= */
  const handleExportExcel = () => {
  const wb = XLSX.utils.book_new();
  const wsData = [];

  const grandDebitCells = [];
  const grandCreditCells = [];

  /* ================= HEADER ================= */
  wsData.push([companyName?.toUpperCase() || ""]);
  wsData.push([companyAdd || ""]);
  wsData.push([companyCity || ""]);
  wsData.push([]);
  wsData.push([`TRIAL BALANCE From ${fromDate} Upto ${toDate}`]);
  wsData.push([]);

  /* ================= DATA ================= */
  Object.entries(data).forEach(([annexure, ledgers]) => {
    wsData.push([annexure]);

    /* AUTO HEADERS */
    wsData.push(TABLE_COLUMNS.map((c) => c.header));

    const startRow = wsData.length + 1;

    ledgers.forEach((l) => {
      wsData.push(TABLE_COLUMNS.map((c) => c.getValue(l)));
    });

    const endRow = wsData.length;
    const totalRowIndex = wsData.length + 1;

    wsData.push([
      "",
      "",
      "",
      "Totals :",
      { f: `SUBTOTAL(9,E${startRow}:E${endRow})` },
      { f: `SUBTOTAL(9,F${startRow}:F${endRow})` },
    ]);

    grandDebitCells.push(`E${totalRowIndex}`);
    grandCreditCells.push(`F${totalRowIndex}`);

    wsData.push([]);
  });

  /* ================= GRAND TOTAL ================= */
  wsData.push([
    "",
    "",
    "",
    "Grand Total :",
    { f: grandDebitCells.join("+") },
    { f: grandCreditCells.join("+") },
  ]);

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  /* ================= MERGES ================= */
  ws["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
    { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
    { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } },
  ];

  /* ================= COLUMN WIDTH ================= */
  ws["!cols"] = [
    { wch: 40 },
    { wch: 25 },
    { wch: 12 },
    { wch: 12 },
    { wch: 15 },
    { wch: 15 },
  ];

  /* ================= COMPANY HEADER STYLE ================= */
  ["A1", "A2", "A3"].forEach((cell) => {
    if (ws[cell]) {
      ws[cell].s = {
        font: { bold: true, sz: 14 },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  });

  /* ================= TRIAL BALANCE STYLE ================= */
  if (ws["A5"]) {
    ws["A5"].s = {
      font: { bold: true, sz: 13 },
      alignment: { horizontal: "center" },
    };
  }

  /* ================= TABLE HEADER STYLE ================= */
  Object.keys(ws).forEach((cell) => {
    if (TABLE_COLUMNS.some((c) => c.header === ws[cell]?.v)) {
      const row = XLSX.utils.decode_cell(cell).r + 1;

      TABLE_COLUMNS.forEach((_, idx) => {
        const col = XLSX.utils.encode_col(idx);
        const c = `${col}${row}`;
        if (ws[c]) {
          ws[c].s = {
            font: { bold: true },
            fill: { fgColor: { rgb: "C1EEF7" } },
            alignment: { horizontal: "center" },
          };
        }
      });
    }
  });

  /* ================= TOTAL & GRAND TOTAL STYLE ================= */
  Object.keys(ws).forEach((cell) => {
    if (ws[cell]?.v === "Totals :" || ws[cell]?.v === "Grand Total :") {
      const row = XLSX.utils.decode_cell(cell).r + 1;

      TABLE_COLUMNS.forEach((_, idx) => {
        const col = XLSX.utils.encode_col(idx);
        const c = `${col}${row}`;
        if (ws[c]) {
          ws[c].s = {
            font: { bold: true },
            fill: {
              fgColor: {
                rgb: ws[cell]?.v === "Grand Total :" ? "B7DEE8" : "CFCECB",
              },
            },
            alignment: { horizontal: "right" },
          };
        }
      });
    }
  });

  /* ================= NUMBER FORMAT AUTO (SAFE) ================= */
  Object.keys(ws).forEach((cell) => {
    if (cell.startsWith("!")) return;

    const colIdx = XLSX.utils.decode_cell(cell).c;
    const col = TABLE_COLUMNS[colIdx];
    if (!col) return;

    const isNumber = typeof ws[cell].v === "number" || ws[cell].f;

    if (!isNumber) return;

    ws[cell].s = {
      ...ws[cell].s,
      alignment: {
        horizontal: col.align === "right" ? "right" : "left",
      },
      numFmt: col.decimals
        ? `0.${"0".repeat(col.decimals)}`
        : undefined,
    };
  });

  /* ================= EXPORT ================= */
  XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");

  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  saveAs(
    new Blob([excelBuffer], { type: "application/octet-stream" }),
    "Annexure_Wise_Trial_Balance.xlsx"
  );
};

  // const handleExportExcel = () => {
  //   const wb = XLSX.utils.book_new();
  //   const wsData = [];

  //   const grandDebitCells = [];
  //   const grandCreditCells = [];

  //   /* HEADER */
  //   wsData.push([companyName?.toUpperCase() || ""]);
  //   wsData.push([companyAdd || ""]);
  //   wsData.push([companyCity || ""]);
  //   wsData.push([]);
  //   wsData.push([`TRIAL BALANCE From ${fromDate} Upto ${toDate}`]);
  //   wsData.push([]);

  //   Object.entries(data).forEach(([annexure, ledgers]) => {
  //     wsData.push([annexure]);

  //     /* 🔥 AUTO HEADERS */
  //     wsData.push(TABLE_COLUMNS.map((c) => c.header));

  //     const startRow = wsData.length + 1;

  //     ledgers.forEach((l) => {
  //       wsData.push(TABLE_COLUMNS.map((c) => c.getValue(l)));
  //     });

  //     const endRow = wsData.length;
  //     const totalRowIndex = wsData.length + 1;

  //     wsData.push([
  //       "",
  //       "",
  //       "",
  //       "Totals :",
  //       { f: `SUBTOTAL(9,E${startRow}:E${endRow})` },
  //       { f: `SUBTOTAL(9,F${startRow}:F${endRow})` },
  //     ]);

  //     grandDebitCells.push(`E${totalRowIndex}`);
  //     grandCreditCells.push(`F${totalRowIndex}`);

  //     wsData.push([]);
  //   });

  //   /* GRAND TOTAL */
  //   wsData.push([
  //     "",
  //     "",
  //     "",
  //     "Grand Total :",
  //     { f: grandDebitCells.join("+") },
  //     { f: grandCreditCells.join("+") },
  //   ]);

  //   const ws = XLSX.utils.aoa_to_sheet(wsData);

  //   ws["!merges"] = [
  //     { s: { r: 0, c: 0 }, e: { r: 0, c: 5 } },
  //     { s: { r: 1, c: 0 }, e: { r: 1, c: 5 } },
  //     { s: { r: 2, c: 0 }, e: { r: 2, c: 5 } },
  //     { s: { r: 4, c: 0 }, e: { r: 4, c: 5 } },
  //   ];

  //   ws["!cols"] = [
  //     { wch: 30 },
  //     { wch: 25 },
  //     { wch: 12 },
  //     { wch: 12 },
  //     { wch: 15 },
  //     { wch: 15 },
  //   ];

  //   /* NUMBER FORMAT AUTO */
  //   Object.keys(ws).forEach((cell) => {
  //     if (cell.startsWith("!")) return;
  //     const colIdx = XLSX.utils.decode_cell(cell).c;
  //     const col = TABLE_COLUMNS[colIdx];
  //     if (!col) return;

  //     ws[cell].s = {
  //       ...ws[cell].s,
  //       alignment: { horizontal: col.align === "right" ? "right" : "left" },
  //       numFmt: col.decimals
  //         ? `0.${"0".repeat(col.decimals)}`
  //         : undefined,
  //     };
  //   });

  //   XLSX.utils.book_append_sheet(wb, ws, "Trial Balance");

  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   saveAs(
  //     new Blob([excelBuffer], { type: "application/octet-stream" }),
  //     "Annexure_Wise_Trial_Balance.xlsx"
  //   );
  // };

  /* ================= MODAL UI ================= */
  return (
    <Modal show={show} onHide={onClose} size="xl" className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>Annexure Wise Trial Balance</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ overflowY: "auto" }}>
        <div ref={printRef}>
          {Object.entries(data).map(([annexure, ledgers]) => {
            let totalDebit = 0;
            let totalCredit = 0;

            return (
              <div key={annexure} className="page-break">
              <h5 style={{fontSize:18,fontWeight:'bold', borderBottom:"3px solid black", letterSpacing:2}}>{annexure}</h5>
                <Table className="custom-table" size="sm" style={{marginTop:5}}>
                  <thead style={{ backgroundColor: "#c1eef7" }}>
                    <tr>
                      {TABLE_COLUMNS.map((c) => (
                        <th
                          key={c.key}
                          className={c.align === "right" ? "text-end" : ""}
                        >
                          {c.header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {ledgers.map((l) => {
                      const bal = l.totals.balance;
                      l.totals.drcr === "DR"
                        ? (totalDebit += Math.abs(bal))
                        : (totalCredit += Math.abs(bal));

                      return (
                        <tr key={l._id}>
                          {TABLE_COLUMNS.map((c) => {
                            const val = c.getValue(l);
                            return (
                              <td
                                key={c.key}
                                className={c.align === "right" ? "text-end" : ""}
                              >
                                {c.decimals != null && val !== ""
                                  ? Number(val).toFixed(c.decimals)
                                  : val}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}

                    <tr style={{ background: "#cfcecb", fontWeight: "bold" }}>
                      <td colSpan={4} className="text-end">Totals :</td>
                      <td className="text-end">{totalDebit.toFixed(2)}</td>
                      <td className="text-end">{totalCredit.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            );
          })}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handlePrint}>Print</Button>
        <Button onClick={handleExportExcel}>Export Excel</Button>
        <Button onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AnnexureWiseModal;
