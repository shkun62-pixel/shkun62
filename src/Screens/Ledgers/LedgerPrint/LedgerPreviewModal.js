import React, { useEffect, useState, useRef } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import axios from "axios";
import useCompanySetup from "../../Shared/useCompanySetup";
// import * as XLSX from 'sheetjs-style';
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';

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
      d.getMonth() + 1,
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
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount",
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

  const applyAccountFilter = (ledgerMap) => {
    if (!printPayload?.filter || printPayload.filter === "All Accounts")
      return ledgerMap;

    const filtered = {};

    Object.entries(ledgerMap).forEach(([account, rows]) => {
      let balance = 0;

      rows.forEach((tx) => {
        tx.type === "debit" ? (balance += tx.amount) : (balance -= tx.amount);
      });

      const group = accountGroupMap[account] || "";

      switch (printPayload.filter) {
        case "General Accounts":
          if (
            !group.toLowerCase().includes("debtor") &&
            !group.toLowerCase().includes("creditor")
          )
            filtered[account] = rows;
          break;
        case "Debtor/Creditor":
          if (
            group.toLowerCase().includes("debtor") ||
            group.toLowerCase().includes("creditor")
          )
            filtered[account] = rows;
          break;
        case "Active Dr Balance":
          if (balance > 0) filtered[account] = rows;
          break;
        case "Active Cr Balance":
          if (balance < 0) filtered[account] = rows;
          break;
        case "Active Nill":
          if (balance === 0) filtered[account] = rows;
          break;
        case "Active Balance":
          if (balance !== 0) filtered[account] = rows;
          break;
        default:
          filtered[account] = rows;
      }
    });

    return filtered;
  };

  /* ---------------- FETCH LEDGER TRANSACTIONS ---------------- */
  useEffect(() => {
    if (!show || !printPayload || !Object.keys(accountGroupMap).length) return;

    const fetchLedger = async () => {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile",
      );

      const ledgerMap = {};
      const fromDate = parseDDMMYYYY(printPayload.periodFrom);
      const toDate = parseDDMMYYYY(printPayload.upto);

      res.data?.data?.forEach((voucher) => {
        voucher.transactions.forEach((tx) => {
          const txDate = new Date(tx.date);
          const txGroup = accountGroupMap[tx.account];

          if (fromDate && txDate < fromDate) return;
          if (toDate && txDate > toDate) return;
          if (printPayload.annexure && txGroup !== printPayload.annexure)
            return;
          if (
            printPayload.accountFrom &&
            tx.account !== printPayload.accountFrom
          )
            return;
          if (
            printPayload.selection &&
            printPayload.selectedAccounts?.length &&
            !printPayload.selectedAccounts.includes(tx.account)
          )
            return;

          if (!ledgerMap[tx.account]) ledgerMap[tx.account] = [];

          ledgerMap[tx.account].push({
            ...tx,
            voucherNo: voucher.voucherNo,
          });
        });
      });

      Object.keys(ledgerMap).forEach((acc) =>
        ledgerMap[acc].sort((a, b) => new Date(a.date) - new Date(b.date)),
      );

      setGroupedLedger(applyAccountFilter(ledgerMap));
    };

    fetchLedger();
  }, [show, printPayload, accountGroupMap]);

  /* ---------------- PRINT ---------------- */
  const handlePrint = () => {
    const WinPrint = window.open("", "", "width=900,height=650");
    WinPrint.document.write("<html><head><title>Ledger</title>");
    WinPrint.document.write(`
      <style>
        body { font-family: serif; font-size: 14px; }
        .ledger-page { margin-bottom: 30px; }
        .page-break { page-break-before: always; }
        .ledger-page:first-child { page-break-before: auto; }

        .ledger-header {
          text-align: center;   
          margin-bottom: 20px;  
        }
        .ledger-header h5 { margin: 0; font-size: 18px; }
        .ledger-header div { margin: 0; font-size: 14px; }

        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 5px; }
        th { background: #f0f0f0; }
        tr.month-header td { background: #e0e0e0; font-weight: bold; }
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
    const wb = XLSX.utils.book_new();
    const wsData = [];

    /* ================= COMPANY HEADER ================= */
    wsData.push([companyName?.toUpperCase() || ""]);
    wsData.push([companyAdd || ""]);
    wsData.push([companyCity || ""]);
    wsData.push([
      `Period : ${printPayload.periodFrom} To ${printPayload.upto}`,
    ]);
    wsData.push([]);

    const headerEndRow = wsData.length;

    /* ================= LEDGER DATA ================= */
    Object.entries(groupedLedger).forEach(([account, rows]) => {
      let balance = 0;
      let totalDr = 0;
      let totalCr = 0;
      let totalWeight = 0;

      wsData.push([`A/c : ${account}`]);
      wsData.push([`PAN : ${accountPanMap[account] || "-"}`]);

      const tableHeader = [
        "Date",
        "Type",
        "Narration",
        ...(printPayload.printType === "qty" ? ["Qty"] : []),
        "Debit",
        "Credit",
        "Balance",
        "Dr/Cr",
      ];

      wsData.push(tableHeader);

      rows.forEach((tx) => {
        if (tx.type === "debit") {
          balance += tx.amount;
          totalDr += tx.amount;
        } else {
          balance -= tx.amount;
          totalCr += tx.amount;
        }

        if (printPayload.printType === "qty") {
          totalWeight += tx.weight || 0;
        }

        wsData.push([
          formatDate(tx.date),
          tx.vtype,
          `${tx.type === "debit" ? "To" : "By"} ${
            tx.vtype === "P" ? `Bill No. ${tx.voucherNo}` : tx.account
          }`,
          ...(printPayload.printType === "qty"
            ? [(tx.weight || 0).toFixed(3)]
            : []),
          tx.type === "debit" ? tx.amount.toFixed(2) : "",
          tx.type === "credit" ? tx.amount.toFixed(2) : "",
          Math.abs(balance).toFixed(2),
          balance >= 0 ? "Dr" : "Cr",
        ]);
      });

      wsData.push([
        "Total",
        "",
        "",
        ...(printPayload.printType === "qty"
          ? [totalWeight.toFixed(3)]
          : []),
        totalDr.toFixed(2),
        totalCr.toFixed(2),
        Math.abs(balance).toFixed(2),
        balance >= 0 ? "Dr" : "Cr",
      ]);

      wsData.push([]);
    });

    /* ================= CREATE SHEET ================= */
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    /* ================= MERGE COMPANY HEADER ================= */
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 7 } },
    ];

    /* ================= STYLES ================= */
    const centerBold = {
      font: { bold: true },
      alignment: { horizontal: "center" },
    };

    ["A1", "A2", "A3", "A4"].forEach((cell) => {
      if (ws[cell]) ws[cell].s = centerBold;
    });

    /* ---- Table Header Style ---- */
    wsData.forEach((row, rIdx) => {
      if (row[0] === "Date") {
        row.forEach((_, cIdx) => {
          const cellRef = XLSX.utils.encode_cell({ r: rIdx, c: cIdx });
          if (ws[cellRef]) {
            ws[cellRef].s = {
              font: { bold: true },
              fill: {
                fgColor: { rgb: "D9E1F2" },
              },
              alignment: { horizontal: "center" },
              border: {
                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
              },
            };
          }
        });
      }
    });

    /* ================= COLUMN WIDTHS ================= */
    ws["!cols"] = [
      { wch: 12 }, // Date
      { wch: 8 },  // Type
      { wch: 40 }, // Narration
      ...(printPayload.printType === "qty" ? [{ wch: 10 }] : []),
      { wch: 14 }, // Debit
      { wch: 14 }, // Credit
      { wch: 14 }, // Balance
      { wch: 8 },  // Dr/Cr
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Ledger");
    XLSX.writeFile(wb, "Ledger.xlsx");
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      className="custom-modal"
      backdrop="static"
      keyboard={true}
      style={{ marginTop: 10 }}
    >
      <Modal.Body
        ref={contentRef}
        style={{ fontFamily: "serif", fontSize: 14, overflowY: "auto" }}
      >
        {/* HEADER ONLY ONCE FOR noBreak */}
        {printPayload.pageBreak === "noBreak" && (
          <div
            className="ledger-header"
            style={{ textAlign: "center", marginBottom: 20 }}
          >
            <h5>
              <b>{companyName?.toUpperCase()}</b>
            </h5>
            <div>{companyAdd}</div>
            <div>{companyCity}</div>
            <div>
              <b>Period :</b> {printPayload.periodFrom} To {printPayload.upto}
            </div>
          </div>
        )}

        {Object.entries(groupedLedger).map(([account, rows], idx) => {
          let balance = 0;
          let totalDr = 0;
          let totalCr = 0;
          let totalWeight = 0;

          const monthMap = {};
          rows.forEach((tx) => {
            const key = getMonthKey(tx.date);
            if (!monthMap[key]) monthMap[key] = [];
            monthMap[key].push(tx);
          });

          return (
            <div
              key={idx}
              className={
                printPayload.pageBreak === "newPage"
                  ? "ledger-page page-break"
                  : "ledger-page"
              }
            >
              {/* HEADER PER ACCOUNT ONLY FOR newPage */}
              {printPayload.pageBreak === "newPage" && (
                <div
                  className="ledger-header"
                  style={{ textAlign: "center", marginBottom: 20 }}
                >
                  <h5>
                    <b>{companyName?.toUpperCase()}</b>
                  </h5>
                  <div>{companyAdd}</div>
                  <div>{companyCity}</div>
                  <div>
                    <b>Period :</b> {printPayload.periodFrom} To{" "}
                    {printPayload.upto}
                  </div>
                </div>
              )}

              <div>
                <b>A/c :</b> {account}
              </div>
              <div>
                <b>PAN :</b> {accountPanMap[account] || "-"}
              </div>

              {/* 🔥 ORIGINAL TABLE LOGIC REMAINS UNCHANGED */}
              <Table bordered size="sm" className="mt-2">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th></th>
                    <th>Narration</th>
                    {printPayload.printType === "qty" && (
                      <th className="text-end">Qty</th>
                    )}
                    <th className="text-end">Debit</th>
                    <th className="text-end">Credit</th>
                    <th className="text-end">Balance</th>
                    <th>D/C</th>
                  </tr>
                </thead>
                <tbody>
                  {printPayload.monthWiseTotal
                    ? Object.entries(monthMap).map(([month, mRows], mIdx) => {
                        let monthDr = 0;
                        let monthCr = 0;
                        let monthWeight = 0;

                        return (
                          <React.Fragment key={mIdx}>
                            <tr className="month-header">
                              <td
                                colSpan={
                                  printPayload.printType === "qty" ? 8 : 7
                                }
                              >
                                {month}
                              </td>
                            </tr>

                            {mRows.map((tx, i) => {
                              if (tx.type === "debit") {
                                balance += tx.amount;
                                totalDr += tx.amount;
                                monthDr += tx.amount;
                              } else {
                                balance -= tx.amount;
                                totalCr += tx.amount;
                                monthCr += tx.amount;
                              }

                              if (printPayload.printType === "qty") {
                                totalWeight += tx.weight || 0;
                                monthWeight += tx.weight || 0;
                              }

                              return (
                                <tr key={i}>
                                  <td>{formatDate(tx.date)}</td>
                                  <td>{tx.vtype}</td>
                                  <td>
                                    {tx.type === "debit" ? "To " : "By "}
                                    {tx.vtype === "P"
                                      ? `Bill No. ${tx.voucherNo}`
                                      : tx.account}
                                  </td>
                                  {printPayload.printType === "qty" && (
                                    <td className="text-end">
                                      {(tx.weight || 0).toFixed(3)}
                                    </td>
                                  )}
                                  <td className="text-end">
                                    {tx.type === "debit"
                                      ? tx.amount.toFixed(2)
                                      : ""}
                                  </td>
                                  <td className="text-end">
                                    {tx.type === "credit"
                                      ? tx.amount.toFixed(2)
                                      : ""}
                                  </td>
                                  <td className="text-end">
                                    {Math.abs(balance).toFixed(2)}
                                  </td>
                                  <td>{balance >= 0 ? "Dr" : "Cr"}</td>
                                </tr>
                              );
                            })}

                            <tr>
                              <td colSpan={3}>
                                <b>{month} Total</b>
                              </td>
                              {printPayload.printType === "qty" && (
                                <td className="text-end">
                                  <b>{monthWeight.toFixed(3)}</b>
                                </td>
                              )}
                              <td className="text-end">
                                <b>{monthDr.toFixed(2)}</b>
                              </td>
                              <td className="text-end">
                                <b>{monthCr.toFixed(2)}</b>
                              </td>
                              <td></td>
                              <td></td>
                            </tr>
                          </React.Fragment>
                        );
                      })
                    : rows.map((tx, i) => {
                        if (tx.type === "debit") {
                          balance += tx.amount;
                          totalDr += tx.amount;
                        } else {
                          balance -= tx.amount;
                          totalCr += tx.amount;
                        }
                        if (printPayload.printType === "qty")
                          totalWeight += tx.weight || 0;

                        return (
                          <tr key={i}>
                            <td>{formatDate(tx.date)}</td>
                            <td>{tx.vtype}</td>
                            <td>
                              {tx.type === "debit" ? "To " : "By "}
                              {tx.vtype === "P"
                                ? `Bill No. ${tx.voucherNo}`
                                : tx.account}
                            </td>
                            {printPayload.printType === "qty" && (
                              <td className="text-end">
                                {(tx.weight || 0).toFixed(3)}
                              </td>
                            )}
                            <td className="text-end">
                              {tx.type === "debit" ? tx.amount.toFixed(2) : ""}
                            </td>
                            <td className="text-end">
                              {tx.type === "credit" ? tx.amount.toFixed(2) : ""}
                            </td>
                            <td className="text-end">
                              {Math.abs(balance).toFixed(2)}
                            </td>
                            <td>{balance >= 0 ? "Dr" : "Cr"}</td>
                          </tr>
                        );
                      })}

                  {/* GRAND TOTAL */}
                  <tr>
                    <td colSpan={printPayload.printType === "qty" ? 3 : 3}>
                      <b>Total</b>
                    </td>
                    {printPayload.printType === "qty" && (
                      <td className="text-end">
                        <b>{totalWeight.toFixed(3)}</b>
                      </td>
                    )}
                    <td className="text-end">
                      <b>{totalDr.toFixed(2)}</b>
                    </td>
                    <td className="text-end">
                      <b>{totalCr.toFixed(2)}</b>
                    </td>
                    <td className="text-end">
                      <b>{Math.abs(balance).toFixed(2)}</b>
                    </td>
                    <td>
                      <b>{balance >= 0 ? "Dr" : "Cr"}</b>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          );
        })}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handlePrint}>
          Print
        </Button>
        <Button variant="success" onClick={handleExportExcel}>
          Export
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LedgerPreviewModal;
