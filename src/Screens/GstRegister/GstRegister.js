// import React, { useState, useEffect } from "react";
// import { Modal } from "react-bootstrap";
// import axios from "axios";

// export default function GstRegister({ show, onClose }) {
//   const [fromDate, setFromDate] = useState("2025-04-01");
//   const [toDate, setToDate] = useState("2026-03-30");
//   const [sale, setSale] = useState([]);
//   const [purchase, setPurchase] = useState([]);
//   const [rows, setRows] = useState([]);
//   const [summary, setSummary] = useState({ purchase: {}, sale: {}, closing: {} });

//   useEffect(() => {
//     if (show) {
//       fetchSale();
//       fetchPurchase();
//     }
//   }, [show]);

//   const fetchSale = async () => {
//     try {
//       const res = await axios.get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale");
//       setSale(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchPurchase = async () => {
//     try {
//       const res = await axios.get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase");
//       setPurchase(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (sale.length || purchase.length) buildRegister();
//   }, [sale, purchase]);

//   const buildRegister = () => {
//     let sr = 1;
//     let table = [];

//     // --- PURCHASE ROWS ---
//     purchase.forEach((p) => {
//       const item = p.items?.[0] || {};

//       table.push({
//         sr: sr++,
//         date: p.formData?.date || "",
//         bill: p.formData?.vno || "",
//         purchase: {
//           cgst: Number(p.formData?.cgst || 0),
//           sgst: Number(p.formData?.sgst || 0),
//           igst: Number(p.formData?.igst || 0),
//           cess: Number(p.formData?.pcess || 0),
//         },
//         sale: {},
//       });
//     });

//     // --- SALE ROWS ---
//     sale.forEach((s) => {
//       const item = s.items?.[0] || {};

//       table.push({
//         sr: sr++,
//         date: s.formData?.date || "",
//         bill: s.formData?.vno || "",
//         purchase: {},
//         sale: {
//           cgst: Number(item.ctax || 0),
//           sgst: Number(item.stax || 0),
//           igst: Number(item.itax || 0),
//           cess: Number(s.formData?.pcess || 0),
//         },
//       });
//     });

//     // --- SUMMARY TOTALS ---

//     const purchaseSum = {
//       cgst: purchase.reduce((t, p) => t + Number(p.formData?.cgst || 0), 0),
//       sgst: purchase.reduce((t, p) => t + Number(p.formData?.sgst || 0), 0),
//       igst: purchase.reduce((t, p) => t + Number(p.formData?.igst || 0), 0),
//       cess: purchase.reduce((t, p) => t + Number(p.formData?.pcess || 0), 0),
//     };

//     const saleSum = {
//       cgst: sale.reduce((t, s) => t + Number(s.items?.[0]?.ctax || 0), 0),
//       sgst: sale.reduce((t, s) => t + Number(s.items?.[0]?.stax || 0), 0),
//       igst: sale.reduce((t, s) => t + Number(s.items?.[0]?.itax || 0), 0),
//       cess: sale.reduce((t, s) => t + Number(s.formData?.pcess || 0), 0),
//     };

//     const closing = {
//       cgst: purchaseSum.cgst - saleSum.cgst,
//       sgst: purchaseSum.sgst - saleSum.sgst,
//       igst: purchaseSum.igst - saleSum.igst,
//       cess: purchaseSum.cess - saleSum.cess,
//     };

//     setRows(table);
//     setSummary({ purchase: purchaseSum, sale: saleSum, closing });
//   };


//   return (
//     <Modal show={show} onHide={onClose} size="xl" backdrop="static">
//       <div className="p-3 bg-light" style={{ minHeight: "90vh" }}>
//         <h4 className="text-center fw-bold">GST REGISTER</h4>

//         {/* Filters */}
//         <div className="d-flex gap-3 my-3">
//           <div>
//             <label>From:</label>
//             <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//           </div>
//           <div>
//             <label>To:</label>
//             <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//           </div>
//         </div>

//         {/* Table */}
//         <table className="table table-bordered text-center small">
//           <thead>
//             <tr>
//               <th rowSpan="2">Sr</th>
//               <th rowSpan="2">Date</th>
//               <th rowSpan="2">B.No</th>
//               <th colSpan="4">GST Purchase</th>
//               <th colSpan="4">GST Sale</th>
//             </tr>
//             <tr>
//               <th>CGST</th><th>SGST</th><th>IGST</th><th>Cess</th>
//               <th>CGST</th><th>SGST</th><th>IGST</th><th>Cess</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((r) => (
//               <tr key={r.sr}>
//                 <td>{r.sr}</td>
//                 <td>{r.date}</td>
//                 <td>{r.bill}</td>
//                 {/* Purchase */}
//                 <td>{r.purchase.cgst || ""}</td>
//                 <td>{r.purchase.sgst || ""}</td>
//                 <td>{r.purchase.igst || ""}</td>
//                 <td>{r.purchase.cess || ""}</td>
//                 {/* Sale */}
//                 <td>{r.sale.cgst || ""}</td>
//                 <td>{r.sale.sgst || ""}</td>
//                 <td>{r.sale.igst || ""}</td>
//                 <td>{r.sale.cess || ""}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Summary */}
//         <div className="mt-4">
//           <h5>Summary</h5>
//           <table className="table table-bordered text-center small">
//             <thead>
//               <tr>
//                 <th></th><th>CGST</th><th>SGST</th><th>IGST</th><th>Cess</th><th>Total</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr>
//                 <td>GST Purchase</td>
//                 <td>{summary.purchase.cgst}</td>
//                 <td>{summary.purchase.sgst}</td>
//                 <td>{summary.purchase.igst}</td>
//                 <td>{summary.purchase.cess}</td>
//                 <td>{summary.purchase.cgst + summary.purchase.sgst + summary.purchase.igst + summary.purchase.cess}</td>
//               </tr>
//               <tr>
//                 <td>GST Sale</td>
//                 <td>{summary.sale.cgst}</td>
//                 <td>{summary.sale.sgst}</td>
//                 <td>{summary.sale.igst}</td>
//                 <td>{summary.sale.cess}</td>
//                 <td>{summary.sale.cgst + summary.sale.sgst + summary.sale.igst + summary.sale.cess}</td>
//               </tr>
//               <tr>
//                 <td>Closing Balance</td>
//                 <td>{summary.closing.cgst}</td>
//                 <td>{summary.closing.sgst}</td>
//                 <td>{summary.closing.igst}</td>
//                 <td>{summary.closing.cess}</td>
//                 <td>{summary.closing.cgst + summary.closing.sgst + summary.closing.igst + summary.closing.cess}</td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         <div className="d-flex justify-content-end mt-3">
//           <button className="btn btn-secondary" onClick={onClose}>Close</button>
//         </div>
//       </div>
//     </Modal>
//   );
// }


import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import axios from "axios";
import "./GstRegister.css";

export default function GstRegister({ show, onClose }) {
  const [fromDate, setFromDate] = useState("2025-04-01");
  const [toDate, setToDate] = useState("2026-03-30");
  const [sale, setSale] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState({
    opening: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
    purchase: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
    sale: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
    closing: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
  });

  // ---- Helpers ----
  // Parse date strings: supports ISO and DD/MM/YYYY
  const parseDate = (d) => {
    if (!d) return null;
    // If ISO-like
    if (/\d{4}-\d{2}-\d{2}T/.test(d) || /\d{4}-\d{2}-\d{2}/.test(d)) {
      const dt = new Date(d);
      if (!isNaN(dt)) return dt;
    }
    // If DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
      const [dd, mm, yyyy] = d.split("/");
      return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    }
    // Fallback attempt
    const dt2 = new Date(d);
    return isNaN(dt2) ? null : dt2;
  };

  const fmt = (v) => {
    if (v === null || v === undefined || v === "") return "";
    const n = Number(v);
    if (isNaN(n)) return "";
    // two decimals, show negative sign if needed
    return n.toFixed(2);
  };

  // ---- Fetch APIs ----
  useEffect(() => {
    if (show) {
      fetchSale();
      fetchPurchase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  const fetchSale = async () => {
    try {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale"
      );
      setSale(res.data || []);
    } catch (err) {
      console.error("fetchSale:", err);
      setSale([]);
    }
  };

  const fetchPurchase = async () => {
    try {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase"
      );
      setPurchase(res.data || []);
    } catch (err) {
      console.error("fetchPurchase:", err);
      setPurchase([]);
    }
  };

  // Rebuild whenever data or date filters change
  useEffect(() => {
    if (sale.length || purchase.length) buildRegister();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sale, purchase, fromDate, toDate]);

  const buildRegister = () => {
    // --- Constants ---
    // FY = 2025-2026 => previous FY ends 2025-03-31 (opening calc uses dates <= 2025-03-31)
    const prevFYEnd = new Date("2025-03-31T23:59:59.999Z");

    // current period bounds based on fromDate/toDate (inclusive)
    const periodStart = new Date(fromDate + "T00:00:00");
    const periodEnd = new Date(toDate + "T23:59:59");

    // --- Calculate Opening from previous FY (all entries with date <= prevFYEnd) ---
    const sumGSTFromArr = (arr, isPurchase) =>
      arr.reduce(
        (acc, x) => {
          // For purchase entries GST is in formData.cgst/sgst/igst/pcess (string numbers)
          // For sale entries it may be in items[0].ctax/stax/itax and formData.pcess
          const cgst = isPurchase
            ? Number(x.formData?.cgst || 0)
            : Number(x.items?.[0]?.ctax || 0);
          const sgst = isPurchase
            ? Number(x.formData?.sgst || 0)
            : Number(x.items?.[0]?.stax || 0);
          const igst = isPurchase
            ? Number(x.formData?.igst || 0)
            : Number(x.items?.[0]?.itax || 0);
          const cess = Number(x.formData?.pcess || 0);
          return {
            cgst: acc.cgst + cgst,
            sgst: acc.sgst + sgst,
            igst: acc.igst + igst,
            cess: acc.cess + cess,
          };
        },
        { cgst: 0, sgst: 0, igst: 0, cess: 0 }
      );

    const prevPurchEntries = purchase.filter((p) => {
      const dt = parseDate(p.formData?.date);
      return dt && dt <= prevFYEnd;
    });
    const prevSaleEntries = sale.filter((s) => {
      const dt = parseDate(s.formData?.date);
      return dt && dt <= prevFYEnd;
    });

    const prevPurchaseGST = sumGSTFromArr(prevPurchEntries, true);
    const prevSaleGST = sumGSTFromArr(prevSaleEntries, false);

    const openingBalance = {
      cgst: prevPurchaseGST.cgst - prevSaleGST.cgst,
      sgst: prevPurchaseGST.sgst - prevSaleGST.sgst,
      igst: prevPurchaseGST.igst - prevSaleGST.igst,
      cess: prevPurchaseGST.cess - prevSaleGST.cess,
    };

    // --- Build entries for the current period (periodStart <= date <= periodEnd) ---
    const purchCurrent = purchase
      .map((p) => {
        const dt = parseDate(p.formData?.date);
        return {
          type: "purchase",
          date: dt,
          rawDate: p.formData?.date || "",
          bill: p.formData?.vno || "",
          cgst: Number(p.formData?.cgst || 0),
          sgst: Number(p.formData?.sgst || 0),
          igst: Number(p.formData?.igst || 0),
          cess: Number(p.formData?.pcess || 0),
        };
      })
      .filter((x) => x.date && x.date >= periodStart && x.date <= periodEnd);

    const saleCurrent = sale
      .map((s) => {
        const dt = parseDate(s.formData?.date);
        const item = s.items?.[0] || {};
        return {
          type: "sale",
          date: dt,
          rawDate: s.formData?.date || "",
          bill: s.formData?.vno || "",
          cgst: Number(item.ctax || 0),
          sgst: Number(item.stax || 0),
          igst: Number(item.itax || 0),
          cess: Number(s.formData?.pcess || 0),
        };
      })
      .filter((x) => x.date && x.date >= periodStart && x.date <= periodEnd);

    // Combine and sort by date (and keep stable order)
    const combined = [...purchCurrent, ...saleCurrent].sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      // tie-breaker: purchases before sales (arbitrary but consistent)
      if (a.type === b.type) return 0;
      return a.type === "purchase" ? -1 : 1;
    });

    // --- Build rows with running opening & closing balance ---
    const builtRows = [];
    let running = { ...openingBalance }; // opening before first entry
    let sr = 1;

    combined.forEach((entry) => {
      const openingForRow = { ...running };

      if (entry.type === "purchase") {
        running = {
          cgst: running.cgst + entry.cgst,
          sgst: running.sgst + entry.sgst,
          igst: running.igst + entry.igst,
          cess: running.cess + entry.cess,
        };
      } else {
        running = {
          cgst: running.cgst - entry.cgst,
          sgst: running.sgst - entry.sgst,
          igst: running.igst - entry.igst,
          cess: running.cess - entry.cess,
        };
      }

      builtRows.push({
        sr: sr++,
        date: entry.rawDate
          ? (parseDate(entry.rawDate)
              ? parseDate(entry.rawDate).toLocaleDateString()
              : entry.rawDate)
          : "",
        bill: entry.bill,
        opening: openingForRow,
        purchase:
          entry.type === "purchase"
            ? { cgst: entry.cgst, sgst: entry.sgst, igst: entry.igst, cess: entry.cess }
            : { cgst: 0, sgst: 0, igst: 0, cess: 0 },
        sale:
          entry.type === "sale"
            ? { cgst: entry.cgst, sgst: entry.sgst, igst: entry.igst, cess: entry.cess }
            : { cgst: 0, sgst: 0, igst: 0, cess: 0 },
        closing: { ...running },
      });
    });

// setRows(builtRows);


    // --- Totals for summary (only for current period) ---
    const totalPurchase = combined
      .filter((e) => e.type === "purchase")
      .reduce(
        (acc, x) => ({
          cgst: acc.cgst + x.cgst,
          sgst: acc.sgst + x.sgst,
          igst: acc.igst + x.igst,
          cess: acc.cess + x.cess,
        }),
        { cgst: 0, sgst: 0, igst: 0, cess: 0 }
      );

    const totalSale = combined
      .filter((e) => e.type === "sale")
      .reduce(
        (acc, x) => ({
          cgst: acc.cgst + x.cgst,
          sgst: acc.sgst + x.sgst,
          igst: acc.igst + x.igst,
          cess: acc.cess + x.cess,
        }),
        { cgst: 0, sgst: 0, igst: 0, cess: 0 }
      );

    const closingTotals = {
      cgst: openingBalance.cgst + totalPurchase.cgst - totalSale.cgst,
      sgst: openingBalance.sgst + totalPurchase.sgst - totalSale.sgst,
      igst: openingBalance.igst + totalPurchase.igst - totalSale.igst,
      cess: openingBalance.cess + totalPurchase.cess - totalSale.cess,
    };

    // --- Update state ---
    setRows(builtRows);
    setSummary({
      opening: openingBalance,
      purchase: totalPurchase,
      sale: totalSale,
      closing: closingTotals,
    });
  };

  // ---- Render ----
  return (
    <Modal show={show} onHide={onClose} className="custom-modal" backdrop="static" style={{marginTop:"10px"}}>
      <div className="p-3 bg-light" style={{ minHeight: "90vh" }}>
        <h4 className="text-center fw-bold">GST REGISTER</h4>

        {/* Filters */}
        <div className="d-flex gap-3 my-3">
          <div>
            <label>From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <label>To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <table className="custom-table table table-bordered text-center small">
          <thead style={{backgroundColor:"#4F81BD", color:'white', fontSize:"16px"}}>
            <tr>
              <th rowSpan="2">Sr</th>
              <th rowSpan="2">Date</th>
              <th rowSpan="2">B.No</th>

              <th colSpan="4">Opening Balance</th>
              <th colSpan="4">Gst Purchase</th>
              <th colSpan="4">Gst Sale</th>
              <th colSpan="4">Closing Balance</th>
            </tr>
            <tr>
              <th>C.Gst</th>
              <th>S.Gst</th>
              <th>I.Gst</th>
              <th>Cess</th>

              <th>C.Gst</th>
              <th>S.Gst</th>
              <th>I.Gst</th>
              <th>Cess</th>

              <th>C.Gst</th>
              <th>S.Gst</th>
              <th>I.Gst</th>
              <th>Cess</th>

              <th>C.Gst</th>
              <th>S.Gst</th>
              <th>I.Gst</th>
              <th>Cess</th>
            </tr>
          </thead>
          <tbody style={{fontSize:"14px"}}>
            {rows.map((r) => (
              <tr key={r.sr}>
                <td>{r.sr}</td>
                <td>{r.date}</td>
                <td>{r.bill}</td>

                {/* Opening */}
                <td>{fmt(r.opening?.cgst)}</td>
                <td>{fmt(r.opening?.sgst)}</td>
                <td>{fmt(r.opening?.igst)}</td>
                <td>{fmt(r.opening?.cess)}</td>

                {/* Purchase */}
                <td>{fmt(r.purchase?.cgst)}</td>
                <td>{fmt(r.purchase?.sgst)}</td>
                <td>{fmt(r.purchase?.igst)}</td>
                <td>{fmt(r.purchase?.cess)}</td>

                {/* Sale */}
                <td>{fmt(r.sale?.cgst)}</td>
                <td>{fmt(r.sale?.sgst)}</td>
                <td>{fmt(r.sale?.igst)}</td>
                <td>{fmt(r.sale?.cess)}</td>

                {/* Closing */}
                <td>{fmt(r.closing?.cgst)}</td>
                <td>{fmt(r.closing?.sgst)}</td>
                <td>{fmt(r.closing?.igst)}</td>
                <td>{fmt(r.closing?.cess)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="mt-2">
          <table className="custom-table table table-bordered text-center small">
            <thead style={{backgroundColor:"#4F81BD", color:'white', fontSize:"16px"}}>
              <tr>
                <th></th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
                <th>Cess</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody style={{fontSize:"14px"}}>
              <tr>
                <td>Opening Balance</td>
                <td>{fmt(summary.opening.cgst)}</td>
                <td>{fmt(summary.opening.sgst)}</td>
                <td>{fmt(summary.opening.igst)}</td>
                <td>{fmt(summary.opening.cess)}</td>
                <td>
                  {fmt(
                    (summary.opening.cgst || 0) +
                      (summary.opening.sgst || 0) +
                      (summary.opening.igst || 0) +
                      (summary.opening.cess || 0)
                  )}
                </td>
              </tr>

              <tr>
                <td>Gst Purchase</td>
                <td>{fmt(summary.purchase.cgst)}</td>
                <td>{fmt(summary.purchase.sgst)}</td>
                <td>{fmt(summary.purchase.igst)}</td>
                <td>{fmt(summary.purchase.cess)}</td>
                <td>
                  {fmt(
                    (summary.purchase.cgst || 0) +
                      (summary.purchase.sgst || 0) +
                      (summary.purchase.igst || 0) +
                      (summary.purchase.cess || 0)
                  )}
                </td>
              </tr>

              <tr>
                <td>Gst Sale</td>
                <td>{fmt(summary.sale.cgst)}</td>
                <td>{fmt(summary.sale.sgst)}</td>
                <td>{fmt(summary.sale.igst)}</td>
                <td>{fmt(summary.sale.cess)}</td>
                <td>
                  {fmt(
                    (summary.sale.cgst || 0) +
                      (summary.sale.sgst || 0) +
                      (summary.sale.igst || 0) +
                      (summary.sale.cess || 0)
                  )}
                </td>
              </tr>

              <tr>
                <td>Closing Balance</td>
                <td>{fmt(summary.closing.cgst)}</td>
                <td>{fmt(summary.closing.sgst)}</td>
                <td>{fmt(summary.closing.igst)}</td>
                <td>{fmt(summary.closing.cess)}</td>
                <td>
                  {fmt(
                    (summary.closing.cgst || 0) +
                      (summary.closing.sgst || 0) +
                      (summary.closing.igst || 0) +
                      (summary.closing.cess || 0)
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* <div className="d-flex justify-content-end mt-3">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div> */}
      </div>
    </Modal>
  );
}
