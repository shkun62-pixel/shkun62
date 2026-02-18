// import React, { useEffect, useState } from "react";
// import { Modal, Button, Table } from "react-bootstrap";
// import axios from "axios";
// import useCompanySetup from "../../Shared/useCompanySetup";

// const LedgerSummaryResult = ({ show, onHide, filters }) => {
//   const { companyName, companyAdd, companyCity } = useCompanySetup();
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const isQty = filters?.reportBy === "Quantity";
//   const isBags = filters?.reportBy === "Bags";

//   useEffect(() => {
//     if (!show || !filters) return;

//     const fetchLedgerData = async () => {
//       try {
//         setLoading(true);

//         // 1️⃣ Fetch transactions
//         const txRes = await axios.get(
//           "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile"
//         );

//         // 2️⃣ Fetch account details
//         const accountRes = await axios.get(
//           "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount"
//         );

//         let transactions =
//           txRes.data?.data?.flatMap((v) => v.transactions) || [];
//         const accounts = accountRes.data?.data?.map((a) => a.formData) || [];

//         // 3️⃣ Voucher filter
//         if (filters.voucher && filters.voucher !== "All") {
//           const voucherMap = {
//             "Cash Voucher": "C",
//             "Journal Voucher": "J",
//             "Sale Voucher": "S",
//             "Purchase Voucher": "P",
//           };

//           const selectedVType = voucherMap[filters.voucher];
//           if (selectedVType) {
//             transactions = transactions.filter(
//               (tx) => tx.vtype === selectedVType
//             );
//           }
//         }

//         // 4️⃣ Account filters
//         const filteredAccounts = accounts.filter((a) => {
//           return (
//             (!filters.annexure ||
//               filters.annexure === "All" ||
//               a.Bsgroup === filters.annexure) &&
//             (!filters.stateName || a.state === filters.stateName) &&
//             (!filters.city || a.city === filters.city) &&
//             (!filters.area || a.area === filters.area) &&
//             (!filters.groupAgent || a.agent === filters.groupAgent)
//           );
//         });

//         // 5️⃣ Filter transactions by accounts
//         transactions = transactions.filter((tx) =>
//           filteredAccounts.some((a) => a.ahead === tx.account)
//         );

//         // 6️⃣ Date filter
//         if (filters.fromDate && filters.uptoDate) {
//           const from = new Date(filters.fromDate.split("/").reverse().join("-"));
//           const upto = new Date(filters.uptoDate.split("/").reverse().join("-"));

//           transactions = transactions.filter((tx) => {
//             const txDate = new Date(tx.date);
//             return txDate >= from && txDate <= upto;
//           });
//         }

//         // 7️⃣ Grouping
//         const grouped = {};

//         transactions.forEach((tx) => {
//           if (!grouped[tx.account]) {
//             const account = filteredAccounts.find(
//               (a) => a.ahead === tx.account
//             );

//             grouped[tx.account] = {
//               account: tx.account,
//               city: account?.city || "",

//               openingValue:
//                 (parseFloat(account?.opening_dr) || 0) -
//                 (parseFloat(account?.opening_cr) || 0),
//               debitValue: 0,
//               creditValue: 0,

//               openingQty: parseFloat(account?.opening_qty) || 0,
//               debitQty: 0,
//               creditQty: 0,

//               openingBags: parseFloat(account?.opening_bags) || 0,
//               debitBags: 0,
//               creditBags: 0,
//             };
//           }

//           if (tx.type === "debit") {
//             grouped[tx.account].debitValue += tx.amount || 0;
//             grouped[tx.account].debitQty += tx.weight || 0;
//             grouped[tx.account].debitBags += tx.bags || 0;
//           }

//           if (tx.type === "credit") {
//             grouped[tx.account].creditValue += tx.amount || 0;
//             grouped[tx.account].creditQty += tx.weight || 0;
//             grouped[tx.account].creditBags += tx.bags || 0;
//           }
//         });

//         // 8️⃣ Final rows + closing
//         let finalRows = Object.values(grouped).map((r) => ({
//           ...r,
//           closingValue: r.openingValue + r.debitValue - r.creditValue,
//           closingQty: r.openingQty + r.debitQty - r.creditQty,
//           closingBags: r.openingBags + r.debitBags - r.creditBags,
//         }));

//         // 9️⃣ Balance filter
//         switch (filters.balance) {
//           case "Active Balance":
//             finalRows = finalRows.filter((r) => r.closingValue !== 0);
//             break;
//           case "Non-Active Accounts":
//             finalRows = finalRows.filter((r) => r.closingValue === 0);
//             break;
//           case "Payments/Debit Only":
//             finalRows = finalRows.filter((r) => r.debitValue > 0);
//             break;
//           case "Receipts/Credit Only":
//             finalRows = finalRows.filter((r) => r.creditValue > 0);
//             break;
//           case "Credit/Debit Only":
//             finalRows = finalRows.filter(
//               (r) => r.debitValue > 0 || r.creditValue > 0
//             );
//             break;
//           default:
//             break;
//         }

//         setRows(finalRows);
//       } catch (err) {
//         console.error("Ledger Summary Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLedgerData();
//   }, [show, filters]);

//   const num = (v) => Number(v || 0).toFixed(2);

//   return (
//     <Modal
//       show={show}
//       onHide={onHide}
//       size="xl"
//       centered
//       backdrop="static"
//       className="custom-modal"
//       keyboard={true}
//       style={{ marginTop: 10 }}
//     >
//       <Modal.Header closeButton>
//         <Modal.Title className="fw-bold">Ledger Summary</Modal.Title>
//       </Modal.Header>

//       <Modal.Body style={{ overflowY: "auto" }}>
//         <div className="text-center mb-3" style={{ fontFamily: "monospace", fontSize: 20 }}>
//           <h5 className="fw-bold">{companyName}</h5>
//           <div>{companyAdd}</div>
//           <div>{companyCity}</div>
//         </div>
//         <div
//           style={{ fontSize: 16, fontFamily: "monospace" }}
//           className="d-flex justify-content-between mb-2"
//         >
//           <div>
//             <b>Balance Detail From Dated :</b> {filters?.fromDate} To{" "}
//             {filters?.uptoDate}
//           </div>
//         </div>

//         {loading ? (
//           <div className="text-center">Loading...</div>
//         ) : (
//           <Table bordered size="sm">
//             <thead style={{ background: "#dedcd7", fontFamily: "monospace" }}>
//               <tr>
//                 <th>ACCOUNT NAME</th>
//                 <th>CITY</th>
//                 <th className="text-end">
//                   {isQty ? "OPENING QTY" : isBags ? "OPENING BAGS" : "OPENING"}
//                 </th>
//                 <th className="text-end">
//                   {isQty ? "DEBIT QTY" : isBags ? "DEBIT BAGS" : "DEBIT"}
//                 </th>
//                 <th className="text-end">
//                   {isQty ? "CREDIT QTY" : isBags ? "CREDIT BAGS" : "CREDIT"}
//                 </th>
//                 <th className="text-end">
//                   {isQty ? "CLOSING QTY" : isBags ? "CLOSING BAGS" : "CLOSING"}
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {rows.map((r, i) => (
//                 <tr key={i}>
//                   <td>{r.account}</td>
//                   <td>{r.city}</td>
//                   <td className="text-end">
//                     {num(isQty ? r.openingQty : isBags ? r.openingBags : r.openingValue)}
//                   </td>
//                   <td className="text-end">
//                     {num(isQty ? r.debitQty : isBags ? r.debitBags : r.debitValue)}
//                   </td>
//                   <td className="text-end">
//                     {num(isQty ? r.creditQty : isBags ? r.creditBags : r.creditValue)}
//                   </td>
//                   <td className="text-end">
//                     {num(isQty ? r.closingQty : isBags ? r.closingBags : r.closingValue)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         )}
//       </Modal.Body>

//       <Modal.Footer>
//         <Button onClick={() => window.print()}>Print</Button>
//         <Button variant="secondary" onClick={onHide}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default LedgerSummaryResult;

import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import axios from "axios";
import useCompanySetup from "../../Shared/useCompanySetup";
import * as XLSX from "sheetjs-style";

const LedgerSummaryResult = ({ show, onHide, filters }) => {

  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  const { companyName, companyAdd, companyCity } = useCompanySetup();
  const contentRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const isQty = filters?.reportBy === "Quantity";
  const isBags = filters?.reportBy === "Bags";
  const isSaleWithPayment = filters?.reportBy === "Sale With Payment";
  const isPurWithPayment = filters?.reportBy === "Pur With Payment";

  useEffect(() => {
    if (!show || !filters) return;

    const fetchLedgerData = async () => {
      try {
        setLoading(true);

        // 1️⃣ Fetch transactions
        const txRes = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/aa/fafile`,
        );

        // 2️⃣ Fetch account details
        const accountRes = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount`,
        );

        let transactions =
          txRes.data?.data?.flatMap((v) => v.transactions) || [];
        const accounts = accountRes.data?.data?.map((a) => a.formData) || [];

        // 3️⃣ Voucher filter
        if (filters.voucher && filters.voucher !== "All") {
          const voucherMap = {
            "Cash Voucher": "C",
            "Journal Voucher": "J",
            "Sale Voucher": "S",
            "Purchase Voucher": "P",
          };

          const selectedVType = voucherMap[filters.voucher];
          if (selectedVType) {
            transactions = transactions.filter(
              (tx) => tx.vtype === selectedVType,
            );
          }
        }

        // 4️⃣ Account filters
        const filteredAccounts = accounts.filter((a) => {
          return (
            (!filters.annexure ||
              filters.annexure === "All" ||
              a.Bsgroup === filters.annexure) &&
            (!filters.stateName || a.state === filters.stateName) &&
            (!filters.city || a.city === filters.city) &&
            (!filters.area || a.area === filters.area) &&
            (!filters.groupAgent || a.agent === filters.groupAgent)
          );
        });

        // 5️⃣ Filter transactions by accounts
        transactions = transactions.filter((tx) =>
          filteredAccounts.some((a) => a.ahead === tx.account),
        );

        // 6️⃣ Date filter
        if (filters.fromDate && filters.uptoDate) {
          const from = new Date(
            filters.fromDate.split("/").reverse().join("-"),
          );
          const upto = new Date(
            filters.uptoDate.split("/").reverse().join("-"),
          );

          transactions = transactions.filter((tx) => {
            const txDate = new Date(tx.date);
            return txDate >= from && txDate <= upto;
          });
        }

        // 7️⃣ Grouping (OLD + NEW fields)
        const grouped = {};

        transactions.forEach((tx) => {
          if (!grouped[tx.account]) {
            const account = filteredAccounts.find(
              (a) => a.ahead === tx.account,
            );

            grouped[tx.account] = {
              account: tx.account,
              city: account?.city || "",

              openingValue:
                (parseFloat(account?.opening_dr) || 0) -
                (parseFloat(account?.opening_cr) || 0),
              debitValue: 0,
              creditValue: 0,

              openingQty: parseFloat(account?.opening_qty) || 0,
              debitQty: 0,
              creditQty: 0,

              openingBags: parseFloat(account?.opening_bags) || 0,
              debitBags: 0,
              creditBags: 0,

              // 🆕 Sale With Payment fields
              bill: 0,
              otherCredit: 0,
              bagsSale: 0,

              // 🆕 Purchase With Payment
              purBill: 0,
              purOtherDebit: 0,
              purBags: 0,
            };
          }

          // existing logic
          if (tx.type === "debit") {
            grouped[tx.account].debitValue += tx.amount || 0;
            grouped[tx.account].debitQty += tx.weight || 0;
            grouped[tx.account].debitBags += tx.pkgs || 0;
          }

          if (tx.type === "credit") {
            grouped[tx.account].creditValue += tx.amount || 0;
            grouped[tx.account].creditQty += tx.weight || 0;
            grouped[tx.account].creditBags += tx.pkgs || 0;
          }

          // 🆕 Sale With Payment logic
          if (isSaleWithPayment) {
            if (tx.vtype === "S") {
              grouped[tx.account].bill += tx.amount || 0;
              grouped[tx.account].bagsSale += tx.pkgs || 0;
            }
            if (tx.vtype === "P") {
              grouped[tx.account].otherCredit += tx.amount || 0;
            }
          }
          // 🆕 PURCHASE WITH PAYMENT
          if (isPurWithPayment) {
            if (tx.vtype === "P") {
              grouped[tx.account].purBill += tx.amount || 0;
              grouped[tx.account].purBags += tx.pkgs || 0;
            }
            if (tx.vtype === "S") {
              grouped[tx.account].purOtherDebit += tx.amount || 0;
            }
          }
        });

        // 8️⃣ Final rows + closing
        let finalRows = Object.values(grouped).map((r) => ({
          ...r,
          closingValue: r.openingValue + r.debitValue - r.creditValue,
          closingQty: r.openingQty + r.debitQty - r.creditQty,
          closingBags: r.openingBags + r.debitBags - r.creditBags,

          // 🆕 Sale With Payment closing
          closingSaleWithPayment: r.openingValue + r.bill - r.otherCredit,

          purClosing: r.openingValue + r.purBill - r.purOtherDebit,
        }));

        // 9️⃣ Balance filter (SKIP for Sale With Payment)
        if (!isSaleWithPayment && !isPurWithPayment) {
          switch (filters.balance) {
            case "Active Balance":
              finalRows = finalRows.filter((r) => r.closingValue !== 0);
              break;
            case "Non-Active Accounts":
              finalRows = finalRows.filter((r) => r.closingValue === 0);
              break;
            case "Payments/Debit Only":
              finalRows = finalRows.filter((r) => r.debitValue > 0);
              break;
            case "Receipts/Credit Only":
              finalRows = finalRows.filter((r) => r.creditValue > 0);
              break;
            case "Credit/Debit Only":
              finalRows = finalRows.filter(
                (r) => r.debitValue > 0 || r.creditValue > 0,
              );
              break;
            default:
              break;
          }
        }

        setRows(finalRows);
      } catch (err) {
        console.error("Ledger Summary Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLedgerData();
  }, [show, filters, isSaleWithPayment]);

  const num = (v) => Number(v || 0).toFixed(2);
  const num3 = (v) => Number(v || 0).toFixed(3);

  const handlePrint = () => {
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write("<html><head><title>Ledger Summary</title>");
    WinPrint.document.write(`
      <style>
        body { font-family: serif; font-size: 14px; }
        .ledger-page { margin-bottom: 30px; }
        .page-break { page-break-before: always; }

        .ledger-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .ledger-header h5 { margin: 0; font-size: 18px; }
        .ledger-header div { margin: 0; font-size: 14px; }

        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 5px; }
        th { background: #f0f0f0; }
      </style>
    `);
    WinPrint.document.write("</head><body>");
    WinPrint.document.write(contentRef.current.innerHTML);
    WinPrint.document.write("</body></html>");
    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
  };

  const handleExportExcel = () => {
    if (!contentRef.current) return;

    const table = contentRef.current.querySelector("table");
    if (!table) return alert("No table found");

    /* ================================
     1️⃣ READ TABLE
  ================================= */
    const tableRows = [];
    table.querySelectorAll("tr").forEach((tr) => {
      const row = [];
      tr.querySelectorAll("th, td").forEach((cell) => {
        row.push(cell.innerText.trim());
      });
      tableRows.push(row);
    });

    const columnCount = tableRows[0].length;

    /* ================================
     2️⃣ EXCEL DATA LAYOUT
  ================================= */
    const excelData = [
      [companyName],
      [companyAdd],
      [companyCity],
      [],
      [
        `Balance Detail From Dated : ${filters?.fromDate} To ${filters?.uptoDate}`,
      ],
      [],
      ...tableRows,
    ];

    const ws = XLSX.utils.aoa_to_sheet(excelData);

    /* ================================
     3️⃣ MERGES
  ================================= */
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: columnCount - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: columnCount - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: columnCount - 1 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: columnCount - 1 } },
    ];

    /* ================================
     4️⃣ COLUMN WIDTHS
  ================================= */
    ws["!cols"] = [
      { wch: 40 },
      { wch: 22 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 18 },
    ];

    /* ================================
     5️⃣ HEADER STYLES
  ================================= */
    [0, 1, 2, 4].forEach((r) => {
      const cell = XLSX.utils.encode_cell({ r, c: 0 });
      ws[cell].s = {
        font: { bold: r !== 4 },
        alignment: { horizontal: "center" },
      };
    });

    /* ================================
     6️⃣ TABLE HEADER STYLE
  ================================= */
    const headerRowIndex = 6;
    for (let c = 0; c < columnCount; c++) {
      const cell = XLSX.utils.encode_cell({ r: headerRowIndex, c });
      if (!ws[cell]) continue;

      ws[cell].s = {
        font: { bold: true },
        alignment: { horizontal: "center" },
        fill: {
          patternType: "solid",
          fgColor: { rgb: "E7E6E6" },
        },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    }

    /* ================================
     7️⃣ NUMBER FORMAT
  ================================= */
    Object.keys(ws).forEach((k) => {
      if (k[0] === "!") return;
      if (!isNaN(ws[k].v)) {
        ws[k].t = "n";
        ws[k].z = (isQty || isBags) ? "0.000" : "0.00";
        ws[k].s = {
          ...ws[k].s,
          alignment: { horizontal: "right" },
        };
      }
    });

    /* ================================
     8️⃣ SUBTOTAL ROW (FIXED)
  ================================= */

    // Excel is 1-based
    const dataStartRow = headerRowIndex + 2; // first data row
    const dataEndRow = dataStartRow + tableRows.length - 2;
    const totalRowIndex = dataEndRow + 1;

    // TOTAL label
    const totalLabelCell = XLSX.utils.encode_cell({
      r: totalRowIndex - 1,
      c: 0,
    });

    ws[totalLabelCell] = {
      t: "s",
      v: "TOTAL",
      s: {
        font: { bold: true },
        alignment: { horizontal: "right" },
      },
    };

    // SUBTOTAL formulas
    for (let c = 2; c < columnCount; c++) {
      const colLetter = XLSX.utils.encode_col(c);
      const cellRef = XLSX.utils.encode_cell({
        r: totalRowIndex - 1,
        c,
      });

      ws[cellRef] = {
        t: "n",
        f: `SUBTOTAL(9,${colLetter}${dataStartRow}:${colLetter}${dataEndRow})`,
        s: {
          font: { bold: true },
          alignment: { horizontal: "right" },
          border: { top: { style: "double" } },
        },
      };
    }

    /* 🔥 EXPAND SHEET RANGE (THIS FIXES VISIBILITY) */
    ws["!ref"] = XLSX.utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: totalRowIndex - 1, c: columnCount - 1 },
    });

    /* ================================
     9️⃣ EXPORT
  ================================= */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ledger Summary");

    XLSX.writeFile(
      wb,
      `Ledger_Summary_${filters?.fromDate}_to_${filters?.uptoDate}.xlsx`,
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
      className="custom-modal"
      keyboard={true}
      style={{ marginTop: 10 }}
    >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Ledger Summary</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ overflowY: "auto" }}>
        <div ref={contentRef}>
          <div
            className="ledger-header text-center mb-3"
            style={{ fontFamily: "monospace", fontSize: 20 }}
          >
            <h5 className="fw-bold">{companyName}</h5>
            <div>{companyAdd}</div>
            <div>{companyCity}</div>
          </div>
          <div
            style={{ fontSize: 16, fontFamily: "monospace" }}
            className="d-flex justify-content-between mb-2"
          >
            <div>
              <b>Balance Detail From Dated :</b> {filters?.fromDate} To{" "}
              {filters?.uptoDate}
            </div>
          </div>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <>
              {/* 🆕 SALE WITH PAYMENT TABLE */}
              {isSaleWithPayment && !isPurWithPayment && (
                <Table bordered size="sm">
                  <thead style={{ background: "#dedcd7" }}>
                    <tr>
                      <th>ACCOUNT NAME</th>
                      <th className="text-end">OPENING</th>
                      <th className="text-end">BILL</th>
                      <th className="text-end">OTHER CREDIT</th>
                      <th className="text-end">CLOSING</th>
                      <th className="text-end">BAGS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i}>
                        <td>{r.account}</td>
                        <td className="text-end">{num(r.openingValue)}</td>
                        <td className="text-end">{num(r.bill)}</td>
                        <td className="text-end">{num(r.otherCredit)}</td>
                        <td className="text-end">
                          {num(r.closingSaleWithPayment)}
                        </td>
                        <td className="text-end">{num3(r.bagsSale)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              {/* 🆕 PURCHASE WITH PAYMENT */}
              {isPurWithPayment && !isSaleWithPayment && (
                <Table bordered size="sm">
                  <thead>
                    <tr>
                      <th>ACCOUNT</th>
                      <th className="text-end">OPENING</th>
                      <th className="text-end">BILL</th>
                      <th className="text-end">OTHER DEBIT</th>
                      <th className="text-end">CLOSING</th>
                      <th className="text-end">BAGS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i}>
                        <td>{r.account}</td>
                        <td className="text-end">{num(r.openingValue)}</td>
                        <td className="text-end">{num(r.purBill)}</td>
                        <td className="text-end">{num(r.purOtherDebit)}</td>
                        <td className="text-end">{num(r.purClosing)}</td>
                        <td className="text-end">{num3(r.purBags)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
              {/* 🔴 ORIGINAL TABLE (UNCHANGED) */}
              {!isSaleWithPayment && !isPurWithPayment && (
                <Table bordered size="sm">
                  <thead style={{ background: "#dedcd7" }}>
                    <tr>
                      <th>ACCOUNT NAME</th>
                      <th>CITY</th>
                      <th className="text-end">OPENING</th>
                      <th className="text-end">
                        {isQty ? "DEBIT QTY" : isBags ? "DEBIT BAGS" : "DEBIT"}
                      </th>
                      <th className="text-end">
                        {isQty
                          ? "CREDIT QTY"
                          : isBags
                            ? "CREDIT BAGS"
                            : "CREDIT"}
                      </th>
                      <th className="text-end">
                        {isQty
                          ? "CLOSING QTY"
                          : isBags
                            ? "CLOSING BAGS"
                            : "CLOSING"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i}>
                        <td>{r.account}</td>
                        <td>{r.city}</td>
                        <td className="text-end">
                          {isQty
                            ? num3(r.openingQty)
                            : isBags
                              ? num3(r.openingBags)
                              : num(r.openingValue)}
                        </td>

                        <td className="text-end">
                          {isQty
                            ? num3(r.debitQty)
                            : isBags
                              ? num3(r.debitBags)
                              : num(r.debitValue)}
                        </td>

                        <td className="text-end">
                          {isQty
                            ? num3(r.creditQty)
                            : isBags
                              ? num3(r.creditBags)
                              : num(r.creditValue)}
                        </td>

                        <td className="text-end">
                          {isQty
                            ? num3(r.closingQty)
                            : isBags
                              ? num3(r.closingBags)
                              : num(r.closingValue)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handlePrint}>PRINT</Button>
        <Button variant="success" onClick={handleExportExcel}>
          EXPORT
        </Button>
        <Button variant="secondary" onClick={onHide}>
          CLOSE
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LedgerSummaryResult;
