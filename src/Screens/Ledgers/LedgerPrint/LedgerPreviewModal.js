// import React, { useEffect, useState, useRef } from "react";
// import { Modal, Button, Table } from "react-bootstrap";
// import axios from "axios";
// import useCompanySetup from "../../Shared/useCompanySetup";

// const LedgerPreviewModal = ({ show, onHide, printPayload }) => {
//   const { companyName, companyAdd, companyCity } = useCompanySetup();
//   const contentRef = useRef(); // For printing

//   const [groupedLedger, setGroupedLedger] = useState({});
//   const [accountGroupMap, setAccountGroupMap] = useState({});
//   const [accountPanMap, setAccountPanMap] = useState({});

//   /* ---------------- HELPERS ---------------- */
//   const parseDDMMYYYY = (dateStr) => {
//     if (!dateStr) return null;
//     const [dd, mm, yyyy] = dateStr.split("-");
//     return new Date(`${yyyy}-${mm}-${dd}`);
//   };

//   const formatDate = (dateStr) => {
//     const d = new Date(dateStr);
//     const dd = String(d.getDate()).padStart(2, "0");
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const yyyy = d.getFullYear();
//     return `${dd}-${mm}-${yyyy}`;
//   };

//   const getMonthKey = (dateStr) => {
//     const d = new Date(dateStr);
//     return d.toLocaleString("default", { month: "long", year: "numeric" });
//   };

//   /* ---------------- FETCH LEDGER MASTER ---------------- */
//   useEffect(() => {
//     const fetchLedgerMaster = async () => {
//       const res = await axios.get(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount"
//       );

//       const groupMap = {};
//       const panMap = {};

//       res.data?.data?.forEach((item) => {
//         const acc = item.formData.ahead;
//         groupMap[acc] = item.formData.Bsgroup;
//         panMap[acc] = item.formData.pan || "-";
//       });

//       setAccountGroupMap(groupMap);
//       setAccountPanMap(panMap);
//     };

//     fetchLedgerMaster();
//   }, []);

//   /* ---------------- FETCH LEDGER TRANSACTIONS ---------------- */
//   useEffect(() => {
//     if (!show || !printPayload || !Object.keys(accountGroupMap).length) return;

//     const fetchLedger = async () => {
//       const res = await axios.get(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile"
//       );

//       const data = res.data?.data || [];
//       const ledgerMap = {};

//       const fromDate = parseDDMMYYYY(printPayload.periodFrom);
//       const toDate = parseDDMMYYYY(printPayload.upto);

//       data.forEach((voucher) => {
//         voucher.transactions.forEach((tx) => {
//           const txGroup = accountGroupMap[tx.account];
//           const txDate = new Date(tx.date);

//           // Date filter
//           if (fromDate && txDate < fromDate) return;
//           if (toDate && txDate > toDate) return;

//           // Annexure filter
//           if (printPayload.annexure && txGroup !== printPayload.annexure)
//             return;

//           // Account filter
//           if (printPayload.accountFrom && tx.account !== printPayload.accountFrom)
//             return;

//           if (!ledgerMap[tx.account]) ledgerMap[tx.account] = [];

//           ledgerMap[tx.account].push({
//             ...tx,
//             voucherNo: voucher.voucherNo,
//           });
//         });
//       });

//       // Sort transactions by date per account
//       Object.keys(ledgerMap).forEach((acc) => {
//         ledgerMap[acc].sort((a, b) => new Date(a.date) - new Date(b.date));
//       });

//       setGroupedLedger(ledgerMap);
//     };

//     fetchLedger();
//   }, [show, printPayload, accountGroupMap]);

//   /* ---------------- PRINT FUNCTION ---------------- */
//   const handlePrint = () => {
//     const printContent = contentRef.current;
//     const WinPrint = window.open("", "", "width=900,height=650");
//     WinPrint.document.write("<html><head><title>Ledger Print</title>");
//     WinPrint.document.write(`
//       <style>
//         body { font-family: serif; font-size: 14px; text-align: center; }
//         table { border-collapse: collapse; width: 100%; margin: auto; }
//         th, td { border: 1px solid black; padding: 5px; }
//         th { background: #f0f0f0; }
//         tr.month-header td { background: #e0e0e0; font-weight: bold; }
//       </style>
//     `);
//     WinPrint.document.write("</head><body>");
//     WinPrint.document.write(printContent.innerHTML);
//     WinPrint.document.write("</body></html>");
//     WinPrint.document.close();
//     WinPrint.focus();
//     WinPrint.print();
//     WinPrint.close();
//   };

//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       size="xl"
//       className="custom-modal"
//       backdrop="static"
//       keyboard={true}
//       style={{ marginTop: 10 }}
//     >
//       <Modal.Body
//         style={{ fontFamily: "serif", fontSize: 14, overflowY: "auto" }}
//         ref={contentRef}
//       >
//         {/* COMPANY HEADER */}
//         <div className="text-center">
//           <h5><b>{companyName?.toUpperCase()}</b></h5>
//           <div>{companyAdd}</div>
//           <div>{companyCity}</div>
//           <div><b>Period :</b> {printPayload.periodFrom} To {printPayload.upto}</div>
//         </div>

//         {/* LEDGER ACCOUNTS */}
//         {Object.entries(groupedLedger).map(([account, rows], idx) => {
//           let balance = 0;
//           let totalDr = 0;
//           let totalCr = 0;
//           let totalWeight = 0;

//           // Month-wise grouping
//           const monthMap = {};
//           rows.forEach((tx) => {
//             const key = getMonthKey(tx.date);
//             if (!monthMap[key]) monthMap[key] = [];
//             monthMap[key].push(tx);
//           });

//           return (
//             <div key={idx} className="mt-4">
//               <div><b>A/c :</b> {account}</div>
//               <div><b>PAN :</b> {accountPanMap[account] || "-"}</div>

//               <Table bordered size="sm" className="mt-2">
//                 <thead>
//                   <tr>
//                     <th>Date</th>
//                     <th></th>
//                     <th>Narration</th>
//                     {printPayload.printType === "qty" && <th className="text-end">Qty</th>}
//                     <th className="text-end">Debit</th>
//                     <th className="text-end">Credit</th>
//                     <th className="text-end">Balance</th>
//                     <th>D/C</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {printPayload.monthWiseTotal
//                     ? Object.entries(monthMap).map(([month, mRows], mIdx) => {
//                         let monthDr = 0;
//                         let monthCr = 0;
//                         let monthWeight = 0;

//                         return (
//                           <React.Fragment key={mIdx}>
//                             <tr className="month-header">
//                               <td colSpan={printPayload.printType === "qty" ? 8 : 7}>{month}</td>
//                             </tr>

//                             {mRows.map((tx, i) => {
//                               if (tx.type === "debit") {
//                                 balance += tx.amount;
//                                 totalDr += tx.amount;
//                                 monthDr += tx.amount;
//                               } else {
//                                 balance -= tx.amount;
//                                 totalCr += tx.amount;
//                                 monthCr += tx.amount;
//                               }

//                               if (printPayload.printType === "qty") {
//                                 totalWeight += tx.weight || 0;
//                                 monthWeight += tx.weight || 0;
//                               }

//                               return (
//                                 <tr key={i}>
//                                   <td>{formatDate(tx.date)}</td>
//                                   <td>{tx.vtype}</td>
//                                   <td>{tx.type === "debit" ? "To " : "By "}{tx.vtype === "P" ? `Bill No. ${tx.voucherNo}` : tx.account}</td>
//                                   {printPayload.printType === "qty" && <td className="text-end">{(tx.weight || 0).toFixed(3)}</td>}
//                                   <td className="text-end">{tx.type === "debit" ? tx.amount.toFixed(2) : ""}</td>
//                                   <td className="text-end">{tx.type === "credit" ? tx.amount.toFixed(2) : ""}</td>
//                                   <td className="text-end">{Math.abs(balance).toFixed(2)}</td>
//                                   <td>{balance >= 0 ? "Dr" : "Cr"}</td>
//                                 </tr>
//                               );
//                             })}

//                             <tr>
//                               <td colSpan={3}><b>{month} Total</b></td>
//                               {printPayload.printType === "qty" && <td className="text-end"><b>{monthWeight.toFixed(3)}</b></td>}
//                               <td className="text-end"><b>{monthDr.toFixed(2)}</b></td>
//                               <td className="text-end"><b>{monthCr.toFixed(2)}</b></td>
//                               <td></td>
//                               <td></td>
//                             </tr>
//                           </React.Fragment>
//                         );
//                       })
//                     : rows.map((tx, i) => {
//                         if (tx.type === "debit") {
//                           balance += tx.amount;
//                           totalDr += tx.amount;
//                         } else {
//                           balance -= tx.amount;
//                           totalCr += tx.amount;
//                         }
//                         if (printPayload.printType === "qty") totalWeight += tx.weight || 0;

//                         return (
//                           <tr key={i}>
//                             <td>{formatDate(tx.date)}</td>
//                             <td>{tx.vtype}</td>
//                             <td>{tx.type === "debit" ? "To " : "By "}{tx.vtype === "P" ? `Bill No. ${tx.voucherNo}` : tx.account}</td>
//                             {printPayload.printType === "qty" && <td className="text-end">{(tx.weight || 0).toFixed(3)}</td>}
//                             <td className="text-end">{tx.type === "debit" ? tx.amount.toFixed(2) : ""}</td>
//                             <td className="text-end">{tx.type === "credit" ? tx.amount.toFixed(2) : ""}</td>
//                             <td className="text-end">{Math.abs(balance).toFixed(2)}</td>
//                             <td>{balance >= 0 ? "Dr" : "Cr"}</td>
//                           </tr>
//                         );
//                       })}

//                   {/* GRAND TOTAL */}
//                   <tr>
//                     <td colSpan={printPayload.printType === "qty" ? 3 : 3}><b>Total</b></td>
//                     {printPayload.printType === "qty" && <td className="text-end"><b>{totalWeight.toFixed(3)}</b></td>}
//                     <td className="text-end"><b>{totalDr.toFixed(2)}</b></td>
//                     <td className="text-end"><b>{totalCr.toFixed(2)}</b></td>
//                     <td className="text-end"><b>{Math.abs(balance).toFixed(2)}</b></td>
//                     <td><b>{balance >= 0 ? "Dr" : "Cr"}</b></td>
//                   </tr>
//                 </tbody>
//               </Table>
//             </div>
//           );
//         })}
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant="secondary" onClick={onHide}>Close</Button>
//         <Button variant="primary" onClick={handlePrint}>Print</Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default LedgerPreviewModal;

import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import axios from "axios";
import useCompanySetup from "../../Shared/useCompanySetup";

const LedgerPreviewModal = ({ show, onHide, printPayload }) => {
  const { companyName, companyAdd, companyCity } = useCompanySetup();
  const contentRef = useRef();

  const [groupedLedger, setGroupedLedger] = useState({});
  const [accountGroupMap, setAccountGroupMap] = useState({});
  const [accountPanMap, setAccountPanMap] = useState({});

  /* ---------------- HELPERS ---------------- */
  const parseDDMMYYYY = (dateStr) => {
    if (!dateStr) return null;
    const [dd, mm, yyyy] = dateStr.split("-");
    return new Date(`${yyyy}-${mm}-${dd}`);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const getMonthKey = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("default", { month: "long", year: "numeric" });
  };

  /* ---------------- FETCH LEDGER MASTER ---------------- */
  useEffect(() => {
    const fetchLedgerMaster = async () => {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount"
      );

      const groupMap = {};
      const panMap = {};

      res.data?.data?.forEach((item) => {
        const acc = item.formData.ahead;
        groupMap[acc] = item.formData.Bsgroup;
        panMap[acc] = item.formData.pan || "-";
      });

      setAccountGroupMap(groupMap);
      setAccountPanMap(panMap);
    };

    fetchLedgerMaster();
  }, []);

  /* ---------------- FETCH LEDGER TRANSACTIONS ---------------- */
  useEffect(() => {
    if (!show || !printPayload || !Object.keys(accountGroupMap).length) return;

    const fetchLedger = async () => {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile"
      );

      const data = res.data?.data || [];
      const ledgerMap = {};

      const fromDate = parseDDMMYYYY(printPayload.periodFrom);
      const toDate = parseDDMMYYYY(printPayload.upto);

      data.forEach((voucher) => {
        voucher.transactions.forEach((tx) => {
          const txGroup = accountGroupMap[tx.account];
          const txDate = new Date(tx.date);

          if (fromDate && txDate < fromDate) return;
          if (toDate && txDate > toDate) return;
          if (printPayload.annexure && txGroup !== printPayload.annexure) return;
          if (printPayload.accountFrom && tx.account !== printPayload.accountFrom) return;

          if (!ledgerMap[tx.account]) ledgerMap[tx.account] = [];
          ledgerMap[tx.account].push({ ...tx, voucherNo: voucher.voucherNo });
        });
      });

      Object.keys(ledgerMap).forEach((acc) =>
        ledgerMap[acc].sort((a, b) => new Date(a.date) - new Date(b.date))
      );

      setGroupedLedger(ledgerMap);
    };

    fetchLedger();
  }, [show, printPayload, accountGroupMap]);

  /* ---------------- PRINT (PRINT-ONLY PAGE BREAK) ---------------- */
  const handlePrint = () => {
    const WinPrint = window.open("", "", "width=900,height=650");

    WinPrint.document.write(`
      <html>
      <head>
        <title>Ledger Print</title>
        <style>
          body { font-family: serif; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 5px; }
          th { background: #f0f0f0; }

          ${
            printPayload.pageBreak === "newPage"
              ? `.ledger-account { page-break-before: always; }
                 .ledger-account:first-child { page-break-before: auto; }`
              : ""
          }
        </style>
      </head>
      <body>
        ${contentRef.current.innerHTML}
      </body>
      </html>
    `);

    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" backdrop="static">
      <Modal.Body ref={contentRef} style={{ fontFamily: "serif", fontSize: 14 }}>
        <div className="text-center">
          <h5><b>{companyName?.toUpperCase()}</b></h5>
          <div>{companyAdd}</div>
          <div>{companyCity}</div>
          <div>
            <b>Period :</b> {printPayload?.periodFrom} To {printPayload?.upto}
          </div>
        </div>

        {Object.entries(groupedLedger).map(([account, rows], idx) => {
          let balance = 0, totalDr = 0, totalCr = 0, totalWeight = 0;

          const monthMap = {};
          rows.forEach((tx) => {
            const key = getMonthKey(tx.date);
            if (!monthMap[key]) monthMap[key] = [];
            monthMap[key].push(tx);
          });

          return (
            <div key={idx} className="ledger-account mt-4">
              <div><b>A/c :</b> {account} | <b>PAN :</b> {accountPanMap[account]}</div>

              <Table bordered size="sm">
                <thead>
                  <tr>
                    <th>Date</th><th></th><th>Narration</th>
                    {printPayload.printType === "qty" && <th>Qty</th>}
                    <th>Debit</th><th>Credit</th><th>Balance</th><th>D/C</th>
                  </tr>
                </thead>

                <tbody>
                  {(printPayload.monthWiseTotal ? Object.entries(monthMap).flatMap(([_, r]) => r) : rows)
                    .map((tx, i) => {
                      if (tx.type === "debit") {
                        balance += tx.amount; totalDr += tx.amount;
                      } else {
                        balance -= tx.amount; totalCr += tx.amount;
                      }
                      if (printPayload.printType === "qty") totalWeight += tx.weight || 0;

                      return (
                        <tr key={i}>
                          <td>{formatDate(tx.date)}</td>
                          <td>{tx.vtype}</td>
                          <td>{tx.type === "debit" ? "To " : "By "}{tx.account}</td>
                          {printPayload.printType === "qty" && <td>{(tx.weight || 0).toFixed(3)}</td>}
                          <td>{tx.type === "debit" ? tx.amount.toFixed(2) : ""}</td>
                          <td>{tx.type === "credit" ? tx.amount.toFixed(2) : ""}</td>
                          <td>{Math.abs(balance).toFixed(2)}</td>
                          <td>{balance >= 0 ? "Dr" : "Cr"}</td>
                        </tr>
                      );
                    })}

                  <tr>
                    <td colSpan={3}><b>Total</b></td>
                    {printPayload.printType === "qty" && <td><b>{totalWeight.toFixed(3)}</b></td>}
                    <td><b>{totalDr.toFixed(2)}</b></td>
                    <td><b>{totalCr.toFixed(2)}</b></td>
                    <td><b>{Math.abs(balance).toFixed(2)}</b></td>
                    <td><b>{balance >= 0 ? "Dr" : "Cr"}</b></td>
                  </tr>
                </tbody>
              </Table>
            </div>
          );
        })}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={handlePrint}>Print</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LedgerPreviewModal;

