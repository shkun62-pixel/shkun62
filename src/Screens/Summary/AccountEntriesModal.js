// import React from "react";
// import Modal from "react-bootstrap/Modal";
// import Table from "react-bootstrap/Table";

// const AccountEntriesModal = ({
//   show,
//   onClose,
//   accountName,
//   entries,
//   formatDate,
//   report
// }) => {
//   if (!show) return null;

//   const isGSTOnly = entries.every((e) => !e.qty);

//   return (
//     <Modal show={show} onHide={onClose} size="xl" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>{accountName}</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Table bordered size="sm">
//           <thead>
//             <tr>
//               <th>Date</th>
//               <th>Bill No</th>
//               <th>Customer</th>
//               {!isGSTOnly && <th>Item Name</th>}
//               {!isGSTOnly && <th>Qty</th>}
//               <th>Value</th>

//               {!isGSTOnly && (
//                 <>
//                   <th>CGST</th>
//                   <th>SGST</th>
//                   <th>IGST</th>
//                 </>
//               )}

//               <th>Total</th>
//             </tr>
//           </thead>

//           <tbody>
//             {entries.map((e, i) => (
//               <tr key={i}>
//                 <td>
//                   {report === "Purchase" ? e.date : formatDate(e.date)}
//                 </td>
//                 <td>{e.vno}</td>
//                 <td>{e.customer}</td>
//                 {!isGSTOnly && (
//                   <td>{e.sdisc || ""}</td>
//                 )}
//                 {!isGSTOnly && (
//                   <td className="text-end">{e.qty || ""}</td>
//                 )}

//                 <td className="text-end">{e.value || ""}</td>

//                 {!isGSTOnly && (
//                   <>
//                     <td className="text-end">{e.cgst || ""}</td>
//                     <td className="text-end">{e.sgst || ""}</td>
//                     <td className="text-end">{e.igst || ""}</td>
//                   </>
//                 )}

//                 <td className="text-end">
//                   {e.total ?? e.value}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AccountEntriesModal;


// import React from "react";
// import Modal from "react-bootstrap/Modal";
// import Table from "react-bootstrap/Table";

// const AccountEntriesModal = ({
//   show,
//   onClose,
//   accountName,
//   entries,
//   formatDate,
//   report
// }) => {
//   if (!show) return null;

//   const isGSTOnly = entries.every((e) => !e.qty);

//   // 🔥 GROUP BY Date + Bill No + Customer
//   const grouped = {};
//   entries.forEach((e) => {
//     const key = `${e.date}_${e.vno}_${e.customer}`;
//     if (!grouped[key]) grouped[key] = [];
//     grouped[key].push(e);
//   });

//   return (
//     <Modal show={show} onHide={onClose} size="xl" centered>
//       <Modal.Header closeButton>
//         <Modal.Title>{accountName}</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Table bordered size="sm">
//           <thead style={{textAlign:'center'}}>
//             <tr>
//               <th>Date</th>
//               <th>Bill No</th>
//               <th>Customer</th>
//               {!isGSTOnly && <th>Item Name</th>}
//               {!isGSTOnly && <th>Qty</th>}
//               {!isGSTOnly && <th>Rate</th>}
//               <th>Value</th>
//               {!isGSTOnly && (
//                 <>
//                   <th>CGST</th>
//                   <th>SGST</th>
//                   <th>IGST</th>
//                 </>
//               )}
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.values(grouped).map((group, gi) =>
//               group.map((e, i) => (
//                 <tr key={`${gi}-${i}`}>
//                   {/* Show date, vno, customer only on first row */}
//                   <td>{i === 0 ? (report === "Purchase" ? e.date : formatDate(e.date)) : ""}</td>
//                   {/* <td>{i === 0 ? formatDate(e.date) : ""}</td> */}
//                   <td>{i === 0 ? e.vno : ""}</td>
//                   <td>{i === 0 ? e.customer : ""}</td>

//                   {!isGSTOnly && <td>{e.sdisc || ""}</td>}
//                   {!isGSTOnly && <td className="text-end">{e.qty || ""}</td>}
//                   {!isGSTOnly && <td className="text-end">{e.rate || ""}</td>}

//                   {/* Always show value, CGST, SGST, IGST, total */}
//                   <td className="text-end">{e.value || ""}</td>

//                   {!isGSTOnly && (
//                     <>
//                       <td className="text-end">{e.cgst || ""}</td>
//                       <td className="text-end">{e.sgst || ""}</td>
//                       <td className="text-end">{e.igst || ""}</td>
//                     </>
//                   )}

//                   <td className="text-end">{e.total || ""}</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </Table>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AccountEntriesModal;


// import React, { useState, useEffect } from "react";
// import Modal from "react-bootstrap/Modal";
// import Table from "react-bootstrap/Table";

// export const formatDateUniversal = (input) => {
//   if (!input) return "";

//   let date;

//   // ✅ If already a Date object
//   if (input instanceof Date) {
//     date = input;
//   }

//   // ✅ Timestamp (number or numeric string)
//   else if (!isNaN(input)) {
//     date = new Date(Number(input));
//   }

//   // ✅ ISO date (2025-04-01 or 2025-04-01T10:30:00)
//   else if (typeof input === "string" && input.includes("-")) {
//     date = new Date(input);
//   }

//   // ✅ dd/mm/yyyy or dd-mm-yyyy
//   else if (typeof input === "string") {
//     const parts = input.split(/[\/-]/);
//     if (parts.length === 3) {
//       const [dd, mm, yyyy] = parts;
//       date = new Date(yyyy, mm - 1, dd);
//     }
//   }

//   // ❌ Invalid date protection
//   if (!date || isNaN(date.getTime())) return "";

//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();

//   return `${day}-${month}-${year}`;
// };

// const AccountEntriesModal = ({
//   show,
//   onClose,
//   accountName,
//   entries,
//   fromDate,
//   uptoDate
// }) => {
//   const [activeRow, setActiveRow] = useState(0);

//   const isGSTOnly = entries.every((e) => !e.qty);

//   // 🔥 GROUP BY Date + Bill No + Customer
//   const grouped = {};
//   entries.forEach((e) => {
//     const key = `${e.date}_${e.vno}_${e.customer}`;
//     if (!grouped[key]) grouped[key] = [];
//     grouped[key].push(e);
//   });

//   // Flatten grouped entries for keyboard navigation
//   const flatEntries = Object.values(grouped).flat();

//   // Keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!show) return;

//       if (e.key === "ArrowDown") {
//         e.preventDefault();
//         setActiveRow((prev) =>
//           prev < flatEntries.length - 1 ? prev + 1 : prev
//         );
//       }

//       if (e.key === "ArrowUp") {
//         e.preventDefault();
//         setActiveRow((prev) => (prev > 0 ? prev - 1 : prev));
//       }

//       // if (e.key === "Enter") {
//       //   e.preventDefault();
//       //   const row = flatEntries[activeRow];
//       //   if (row && row._id) {
//       //     alert(row._id);
//       //   } else {
//       //     alert("No _id available for this row");
//       //   }
//       // }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [activeRow, flatEntries, show]);
  
//   if (!show) return null;
  
//   return (
//     <Modal show={show} onHide={onClose} className="custom-modal" style={{marginTop:"10px"}}>
//       <Modal.Header closeButton>
//         <Modal.Title>{accountName} From {fromDate} To {uptoDate}</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Table bordered size="sm" className="custom-table">
//           <thead style={{ textAlign: "center",backgroundColor:"skyblue" }}>
//             <tr>
//               <th>Date</th>
//               <th>Bill No</th>
//               <th>Customer</th>
//               {!isGSTOnly && <th>Item Name</th>}
//               {!isGSTOnly && <th>PCS</th>}
//               {!isGSTOnly && <th>Qty</th>}
//               {!isGSTOnly && <th>Rate</th>}
//               <th>Value</th>
//               {!isGSTOnly && (
//                 <>
//                   <th>CGST</th>
//                   <th>SGST</th>
//                   <th>IGST</th>
//                 </>
//               )}
//               <th>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Object.values(grouped).map((group, gi) =>
//               group.map((e, i) => {
//                 // Calculate flat index for keyboard navigation
//                 const flatIndex = flatEntries.indexOf(e);

//                 return (
//                   <tr
//                     key={`${gi}-${i}`}
//                     style={{
//                       backgroundColor:
//                         activeRow === flatIndex ? "#ffeeba" : "transparent"
//                     }}
//                   >
//                     {/* Show date, vno, customer only on first row */}
//                     <td>{formatDateUniversal(e.date)}</td>
//                     <td>{i === 0 ? e.vno : ""}</td>
//                     <td>{i === 0 ? e.customer : ""}</td>

//                     {!isGSTOnly && <td>{e.sdisc || ""}</td>}
//                      {!isGSTOnly && (
//                       <td className="text-end">{e.pcs || ""}</td>
//                     )}
//                     {!isGSTOnly && (
//                       <td className="text-end">{e.qty || ""}</td>
//                     )}
//                     {!isGSTOnly && (
//                       <td className="text-end">{e.rate || ""}</td>
//                     )}

//                     {/* Always show value, CGST, SGST, IGST, total */}
//                     <td className="text-end">{e.value || ""}</td>

//                     {!isGSTOnly && (
//                       <>
//                         <td className="text-end">{e.cgst || ""}</td>
//                         <td className="text-end">{e.sgst || ""}</td>
//                         <td className="text-end">{e.igst || ""}</td>
//                       </>
//                     )}

//                     <td className="text-end">{e.total || ""}</td>
//                   </tr>
//                 );
//               })
//             )}
//           </tbody>
//         </Table>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AccountEntriesModal;



// import React, { useState, useEffect } from "react";
// import Modal from "react-bootstrap/Modal";
// import Table from "react-bootstrap/Table";

// export const formatDateUniversal = (input) => {
//   if (!input) return "";

//   let date;

//   if (input instanceof Date) {
//     date = input;
//   } else if (!isNaN(input)) {
//     date = new Date(Number(input));
//   } else if (typeof input === "string" && input.includes("-")) {
//     date = new Date(input);
//   } else if (typeof input === "string") {
//     const parts = input.split(/[\/-]/);
//     if (parts.length === 3) {
//       const [dd, mm, yyyy] = parts;
//       date = new Date(yyyy, mm - 1, dd);
//     }
//   }

//   if (!date || isNaN(date.getTime())) return "";

//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();

//   return `${day}-${month}-${year}`;
// };

// const AccountEntriesModal = ({
//   show,
//   onClose,
//   accountName,
//   entries,
//   fromDate,
//   uptoDate
// }) => {
//   const [activeRow, setActiveRow] = useState(0);

//   const isGSTOnly = entries.every((e) => !e.qty);

//   // 🔥 GROUP BY Date + Bill No + Customer
//   const grouped = {};
//   entries.forEach((e) => {
//     const key = `${e.date}_${e.vno}_${e.customer}`;
//     if (!grouped[key]) grouped[key] = [];
//     grouped[key].push(e);
//   });

//   const groupedArray = Object.values(grouped);

//   // 🔹 Keyboard navigation (row-wise)
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!show) return;

//       if (e.key === "ArrowDown") {
//         e.preventDefault();
//         setActiveRow((prev) =>
//           prev < groupedArray.length - 1 ? prev + 1 : prev
//         );
//       }

//       if (e.key === "ArrowUp") {
//         e.preventDefault();
//         setActiveRow((prev) => (prev > 0 ? prev - 1 : prev));
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [show, groupedArray.length]);

//   if (!show) return null;

//   return (
//     <Modal
//       show={show}
//       onHide={onClose}
//       className="custom-modal"
//       style={{ marginTop: "10px" }}
//     >
//       <Modal.Header closeButton>
//         <Modal.Title>
//             {accountName} 
//         </Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Table bordered size="sm" className="custom-table">
//           <thead style={{ textAlign: "center", backgroundColor: "skyblue" }}>
//             <tr>
//               <th>Date</th>
//               <th>Bill No</th>
//               <th>Customer</th>
//               {!isGSTOnly && <th>Item Name</th>}
//               {!isGSTOnly && <th>PCS</th>}
//               {!isGSTOnly && <th>Qty</th>}
//               {!isGSTOnly && <th>Rate</th>}
//               <th>Value</th>
//               {!isGSTOnly && (
//                 <>
//                   <th>CGST</th>
//                   <th>SGST</th>
//                   <th>IGST</th>
//                 </>
//               )}
//               <th>Total</th>
//             </tr>
//           </thead>

//           <tbody>
//             {groupedArray.map((group, gi) => {
//               const base = group[0];

//               return (
//                 <tr
//                   key={gi}
//                   style={{
//                     backgroundColor:
//                       activeRow === gi ? "#ffeeba" : "transparent",
//                     verticalAlign: "top"
//                   }}
//                 >
//                   <td>{formatDateUniversal(base.date)}</td>
//                   <td>{base.vno}</td>
//                   <td>{base.customer}</td>

//                   {/* ITEM NAME */}
//                   {!isGSTOnly && (
//                     <td>
//                       {group.map((i, idx) => (
//                         <div key={idx}>{i.sdisc}</div>
//                       ))}
//                     </td>
//                   )}

//                   {/* PCS */}
//                   {!isGSTOnly && (
//                     <td className="text-end">
//                       {group.map((i, idx) => (
//                         <div key={idx}>{i.pcs || ""}</div>
//                       ))}
//                     </td>
//                   )}

//                   {/* QTY */}
//                   {!isGSTOnly && (
//                     <td className="text-end">
//                       {group.map((i, idx) => (
//                         <div key={idx}>{i.qty || ""}</div>
//                       ))}
//                     </td>
//                   )}

//                   {/* RATE */}
//                   {!isGSTOnly && (
//                     <td className="text-end">
//                       {group.map((i, idx) => (
//                         <div key={idx}>{i.rate || ""}</div>
//                       ))}
//                     </td>
//                   )}

//                   {/* VALUE */}
//                   <td className="text-end">
//                     {group.map((i, idx) => (
//                       <div key={idx}>{i.value || i.vamt || ""}</div>
//                     ))}
//                   </td>

//                   {/* GST */}
//                   {!isGSTOnly && (
//                     <>
//                       <td className="text-end">
//                         {group.map((i, idx) => (
//                           <div key={idx}>{i.cgst || i.ctax || ""}</div>
//                         ))}
//                       </td>
//                       <td className="text-end">
//                         {group.map((i, idx) => (
//                           <div key={idx}>{i.sgst || i.stax || ""}</div>
//                         ))}
//                       </td>
//                       <td className="text-end">
//                         {group.map((i, idx) => (
//                           <div key={idx}>{i.igst || i.itax || ""}</div>
//                         ))}
//                       </td>
//                     </>
//                   )}

//                   {/* TOTAL */}
//                   <td className="text-end">
//                     {group.map((i, idx) => (
//                       <div key={idx}>{i.total || i.vamt || ""}</div>
//                     ))}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </Table>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AccountEntriesModal;

import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import useCompanySetup from "../Shared/useCompanySetup";
import * as XLSX from "sheetjs-style";
import { saveAs } from "file-saver";

export const formatDateUniversal = (input) => {
  if (!input) return "";

  let date;

  // 1️⃣ Already Date object
  if (input instanceof Date) {
    date = input;
  }

  // 2️⃣ ISO date string (2026-01-17T00:00:00.000Z)
  else if (
    typeof input === "string" &&
    input.includes("T") &&
    !isNaN(Date.parse(input))
  ) {
    date = new Date(input);
  }

  // 3️⃣ DD-MM-YYYY or DD/MM/YYYY
  else if (typeof input === "string") {
    const parts = input.split(/[\/-]/);

    if (parts.length === 3) {
      const [dd, mm, yyyy] = parts;

      // must be numeric
      if (!isNaN(dd) && !isNaN(mm) && !isNaN(yyyy)) {
        date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
      }
    }
  }

  // 4️⃣ Timestamp
  else if (!isNaN(input)) {
    date = new Date(Number(input));
  }

  if (!date || isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const TABLE_COLUMNS = [
  {
    header: "Date",
    key: "date",
    render: (row) => formatDateUniversal(row.date)
  },
  {
    header: "Bill No",
    key: "vno"
  },
  {
    header: "Customer",
    key: "customer"
  },
  {
    header: "Item Name",
    key: "sdisc",
    hideWhenGSTOnly: true
  },
  {
    header: "PCS",
    key: "pcs",
    align: "right",
    hideWhenGSTOnly: true
  },
  {
    header: "Qty",
    key: "qty",
    align: "right",
    hideWhenGSTOnly: true
  },
  {
    header: "Rate",
    key: "rate",
    align: "right",
    hideWhenGSTOnly: true
  },
  {
    header: "Value",
    key: "value",
    align: "right",
    fallback: "vamt"
  },
  {
    header: "CGST",
    key: "cgst",
    fallback: "ctax",
    align: "right",
    hideWhenGSTOnly: true
  },
  {
    header: "SGST",
    key: "sgst",
    fallback: "stax",
    align: "right",
    hideWhenGSTOnly: true
  },
  {
    header: "IGST",
    key: "igst",
    fallback: "itax",
    align: "right",
    hideWhenGSTOnly: true
  },
  {
    header: "Total",
    key: "total",
    fallback: "vamt",
    align: "right"
  }
];


const AccountEntriesModal = ({
  show,
  onClose,
  accountName,
  entries,
  fromDate,
  uptoDate
}) => {
  const { companyName, companyAdd, companyCity } = useCompanySetup();
  const [activeRow, setActiveRow] = useState(0);
  const printRef = useRef();

  const isGSTOnly = entries.every((e) => !e.qty);

  // 🔥 GROUP BY Date + Bill No + Customer
  const grouped = {};
  entries.forEach((e) => {
    const key = `${e.date}_${e.vno}_${e.customer}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(e);
  });

  const groupedArray = Object.values(grouped);

  // 🔹 Keyboard navigation (row-wise)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!show) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveRow((prev) =>
          prev < groupedArray.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveRow((prev) => (prev > 0 ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show, groupedArray.length]);

  if (!show) return null;

  // ================= PRINT FUNCTION =================
  const handlePrint = () => {
    const printContents = printRef.current.innerHTML;
    const printWindow = window.open("", "", "height=900,width=1200");

    printWindow.document.write(`
      <html>
        <head>
          <title>Summary</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 10px;
            }

            .company-header {
              text-align: center;
              margin-bottom: 10px;
            }

            .company-header h2 {
              margin: 0;
              font-size: 20px;
              font-weight: bold;
            }

            .company-header p {
              margin: 0;
              font-size: 13px;
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

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
            }

            th, td {
              border: 1px solid #000;
              padding: 4px;
            }

            th {
              background: #e6f0ff;
              text-align: center;
            }

            td {
              vertical-align: top;
            }

            .text-end {
              text-align: right;
            }

            tr {
              page-break-inside: avoid;
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
          <div class="report-title">Summary : ${accountName}</div>
          <div class="report-period">
            From ${fromDate} Upto ${uptoDate}
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

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [];

    /* ================= HEADER ================= */
    wsData.push([companyName?.toUpperCase() || ""]);
    wsData.push([companyAdd || ""]);
    wsData.push([companyCity || ""]);
    wsData.push([]);
    wsData.push([`${accountName} LEDGER`]);
    wsData.push([]);

    /* ================= TABLE HEADER ================= */
    const visibleColumns = TABLE_COLUMNS.filter(
      (col) => !(isGSTOnly && col.hideWhenGSTOnly)
    );

    wsData.push(visibleColumns.map((c) => c.header));

    const startRow = wsData.length + 1;

    /* ================= DATA ================= */
    groupedArray.forEach((group) => {
      group.forEach((row) => {
        wsData.push(
          visibleColumns.map((c) => {
            let val = c.render
              ? c.render(row)
              : row[c.key] ?? row[c.fallback] ?? "";

            // ensure float remains number
            if (typeof val === "string" && val !== "" && !isNaN(val)) {
              val = Number(val);
            }

            return val;
          })
        );
      });
    });

    const endRow = wsData.length;
    const totalRow = wsData.length + 1;

    /* ================= TOTAL ROW (AUTO SUBTOTAL) ================= */
    const totalRowData = visibleColumns.map((_, idx) => {
      const colLetter = XLSX.utils.encode_col(idx);

      // detect numeric column
      const isNumeric = wsData
        .slice(startRow - 1, endRow)
        .some((r) => typeof r[idx] === "number");

      if (idx === 0) return "TOTAL";

      return isNumeric
        ? { f: `SUBTOTAL(9,${colLetter}${startRow}:${colLetter}${endRow})` }
        : "";
    });

    wsData.push(totalRowData);

    /* ================= CREATE SHEET ================= */
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    /* ================= MERGES ================= */
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: visibleColumns.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: visibleColumns.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: visibleColumns.length - 1 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: visibleColumns.length - 1 } },
    ];

    /* ================= COLUMN WIDTH ================= */
      ws["!cols"] = [
        { wch: 12 },
        { wch: 10 },
        { wch: 40 },
        { wch: 20 },
        { wch: 10 },
        { wch: 10 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15},
        { wch: 15 },
      ];
    // ws["!cols"] = visibleColumns.map(() => ({ wch: 18 }));

    /* ================= HEADER STYLE ================= */
    ["A1", "A2", "A3", "A5"].forEach((cell) => {
      if (ws[cell]) {
        ws[cell].s = {
          font: { bold: true, sz: 14 },
          alignment: { horizontal: "center" },
        };
      }
    });

    /* ================= TABLE HEADER STYLE ================= */
    visibleColumns.forEach((_, idx) => {
      const cell = XLSX.utils.encode_cell({ r: 6, c: idx });
      if (ws[cell]) {
        ws[cell].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "C1EEF7" } },
          alignment: { horizontal: "center" },
        };
      }
    });

    /* ================= NUMBER FORMAT (FLOAT SAFE) ================= */
    Object.keys(ws).forEach((cell) => {
      if (cell.startsWith("!")) return;

      if (typeof ws[cell].v === "number" || ws[cell].f) {
        ws[cell].s = {
          ...ws[cell].s,
          numFmt: "#,##0.00",
          alignment: { horizontal: "right" },
        };
      }
    });

    /* ================= EXPORT ================= */
    XLSX.utils.book_append_sheet(wb, ws, "Ledger");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      `${accountName}_Ledger.xlsx`
    );
  };

  // ================= MODAL UI =================
  return (
    <Modal
      show={show}
      onHide={onClose}
      className="custom-modal"
      style={{ marginTop: "10px" }}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>{accountName}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div ref={printRef}>
          <Table bordered size="sm" className="custom-table">
            {/* <thead style={{ textAlign: "center", backgroundColor: "skyblue" }}>
              <tr>
                <th>Date</th>
                <th>Bill No</th>
                <th>Customer</th>
                {!isGSTOnly && <th>Item Name</th>}
                {!isGSTOnly && <th>PCS</th>}
                {!isGSTOnly && <th>Qty</th>}
                {!isGSTOnly && <th>Rate</th>}
                <th>Value</th>
                {!isGSTOnly && (
                  <>
                    <th>CGST</th>
                    <th>SGST</th>
                    <th>IGST</th>
                  </>
                )}
                <th>Total</th>
              </tr>
            </thead> */}
            <thead style={{ textAlign: "center", backgroundColor: "skyblue" }}>
              <tr>
                {TABLE_COLUMNS.map((col, i) =>
                  isGSTOnly && col.hideWhenGSTOnly ? null : (
                    <th key={i}>{col.header}</th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {groupedArray.map((group, gi) => (
                <tr
                  key={gi}
                  style={{
                    backgroundColor: activeRow === gi ? "#ffeeba" : "transparent"
                  }}
                >
                  {TABLE_COLUMNS.map((col, ci) => {
                    if (isGSTOnly && col.hideWhenGSTOnly) return null;

                    return (
                      <td
                        key={ci}
                        className={col.align === "right" ? "text-end" : ""}
                      >
                        {group.map((row, ri) => {
                          let value = "";

                          if (col.render) {
                            value = col.render(row);
                          } else {
                            value = row[col.key] ?? row[col.fallback] ?? "";
                          }

                          return <div key={ri}>{value}</div>;
                        })}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

            {/* <tbody>
              {groupedArray.map((group, gi) => {
                const base = group[0];

                return (
                  <tr
                    key={gi}
                    style={{
                      backgroundColor:
                        activeRow === gi ? "#ffeeba" : "transparent",
                      verticalAlign: "top"
                    }}
                  >
                    <td>{formatDateUniversal(base.date)}</td>
                    <td>{base.vno}</td>
                    <td>{base.customer}</td>

                    {!isGSTOnly && (
                      <td>{group.map((i, idx) => <div key={idx}>{i.sdisc}</div>)}</td>
                    )}
                    {!isGSTOnly && (
                      <td className="text-end">{group.map((i, idx) => <div key={idx}>{i.pcs || ""}</div>)}</td>
                    )}
                    {!isGSTOnly && (
                      <td className="text-end">{group.map((i, idx) => <div key={idx}>{i.qty || ""}</div>)}</td>
                    )}
                    {!isGSTOnly && (
                      <td className="text-end">{group.map((i, idx) => <div key={idx}>{i.rate || ""}</div>)}</td>
                    )}

                    <td className="text-end">{group.map((i, idx) => <div key={idx}>{i.value || i.vamt || ""}</div>)}</td>

                    {!isGSTOnly && (
                      <>
                        <td className="text-end">{group.map((i, idx) => <div key={idx}>{i.cgst || i.ctax || ""}</div>)}</td>
                        <td className="text-end">{group.map((i, idx) => <div key={idx}>{i.sgst || i.stax || ""}</div>)}</td>
                        <td className="text-end">{group.map((i, idx) => <div key={idx}>{i.igst || i.itax || ""}</div>)}</td>
                      </>
                    )}

                    <td className="text-end">{group.map((i, idx) => <div key={idx}>{i.total || i.vamt || ""}</div>)}</td>
                  </tr>
                );
              })}
            </tbody> */}
          </Table>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-primary" onClick={handlePrint}>
          Print
        </button>
        <button className="btn btn-success" onClick={handleExportExcel}>
          Export
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AccountEntriesModal;
