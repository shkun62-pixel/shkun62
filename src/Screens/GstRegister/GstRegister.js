// import React, { useState, useEffect } from "react";
// import { Modal } from "react-bootstrap";
// import axios from "axios";
// import "./GstRegister.css";
// import GstRegisterPrint from "./GstRegisterPrint";
// import { Button } from "@mui/material";

// export default function GstRegister({ show, onClose }) {
//   const [fromDate, setFromDate] = useState("2025-04-01");
//   const [toDate, setToDate] = useState("2026-03-30");
//   const [sale, setSale] = useState([]);
//   const [purchase, setPurchase] = useState([]);
//   const [rows, setRows] = useState([]);
//   const [summary, setSummary] = useState({
//     opening: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
//     purchase: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
//     sale: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
//     closing: { cgst: 0, sgst: 0, igst: 0, cess: 0 },
//   });
//   const [printOpen, setPrintOpen] = useState(false);

//   // ---- Helpers ----
//   // Parse date strings: supports ISO and DD/MM/YYYY
//   const parseDate = (d) => {
//     if (!d) return null;
//     // If ISO-like
//     if (/\d{4}-\d{2}-\d{2}T/.test(d) || /\d{4}-\d{2}-\d{2}/.test(d)) {
//       const dt = new Date(d);
//       if (!isNaN(dt)) return dt;
//     }
//     // If DD/MM/YYYY
//     if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
//       const [dd, mm, yyyy] = d.split("/");
//       return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
//     }
//     // Fallback attempt
//     const dt2 = new Date(d);
//     return isNaN(dt2) ? null : dt2;
//   };

//   const fmt = (v) => {
//     if (v === null || v === undefined || v === "") return "";
//     const n = Number(v);
//     if (isNaN(n)) return "";
//     // two decimals, show negative sign if needed
//     return n.toFixed(2);
//   };

//   // ---- Fetch APIs ----
//   useEffect(() => {
//     if (show) {
//       fetchSale();
//       fetchPurchase();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [show]);

//   const fetchSale = async () => {
//     try {
//       const res = await axios.get(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale"
//       );
//       setSale(res.data || []);
//     } catch (err) {
//       console.error("fetchSale:", err);
//       setSale([]);
//     }
//   };

//   const fetchPurchase = async () => {
//     try {
//       const res = await axios.get(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase"
//       );
//       setPurchase(res.data || []);
//     } catch (err) {
//       console.error("fetchPurchase:", err);
//       setPurchase([]);
//     }
//   };

//   // Rebuild whenever data or date filters change
//   useEffect(() => {
//     if (sale.length || purchase.length) buildRegister();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [sale, purchase, fromDate, toDate]);

//   const buildRegister = () => {
//     // --- Constants ---
//     // FY = 2025-2026 => previous FY ends 2025-03-31 (opening calc uses dates <= 2025-03-31)
//     const prevFYEnd = new Date("2025-03-31T23:59:59.999Z");

//     // current period bounds based on fromDate/toDate (inclusive)
//     const periodStart = new Date(fromDate + "T00:00:00");
//     const periodEnd = new Date(toDate + "T23:59:59");

//     // --- Calculate Opening from previous FY (all entries with date <= prevFYEnd) ---
//     const sumGSTFromArr = (arr, isPurchase) =>
//       arr.reduce(
//         (acc, x) => {
//           // For purchase entries GST is in formData.cgst/sgst/igst/pcess (string numbers)
//           // For sale entries it may be in items[0].ctax/stax/itax and formData.pcess
//           const cgst = isPurchase
//             ? Number(x.formData?.cgst || 0)
//             : Number(x.items?.[0]?.ctax || 0);
//           const sgst = isPurchase
//             ? Number(x.formData?.sgst || 0)
//             : Number(x.items?.[0]?.stax || 0);
//           const igst = isPurchase
//             ? Number(x.formData?.igst || 0)
//             : Number(x.items?.[0]?.itax || 0);
//           const cess = Number(x.formData?.pcess || 0);
//           return {
//             cgst: acc.cgst + cgst,
//             sgst: acc.sgst + sgst,
//             igst: acc.igst + igst,
//             cess: acc.cess + cess,
//           };
//         },
//         { cgst: 0, sgst: 0, igst: 0, cess: 0 }
//       );

//     const prevPurchEntries = purchase.filter((p) => {
//       const dt = parseDate(p.formData?.date);
//       return dt && dt <= prevFYEnd;
//     });
//     const prevSaleEntries = sale.filter((s) => {
//       const dt = parseDate(s.formData?.date);
//       return dt && dt <= prevFYEnd;
//     });

//     const prevPurchaseGST = sumGSTFromArr(prevPurchEntries, true);
//     const prevSaleGST = sumGSTFromArr(prevSaleEntries, false);

//     const openingBalance = {
//       cgst: prevPurchaseGST.cgst - prevSaleGST.cgst,
//       sgst: prevPurchaseGST.sgst - prevSaleGST.sgst,
//       igst: prevPurchaseGST.igst - prevSaleGST.igst,
//       cess: prevPurchaseGST.cess - prevSaleGST.cess,
//     };

//     // --- Build entries for the current period (periodStart <= date <= periodEnd) ---
//     const purchCurrent = purchase
//       .map((p) => {
//         const dt = parseDate(p.formData?.date);
//         return {
//           type: "purchase",
//           date: dt,
//           rawDate: p.formData?.date || "",
//           bill: p.formData?.vno || "",
//           cgst: Number(p.formData?.cgst || 0),
//           sgst: Number(p.formData?.sgst || 0),
//           igst: Number(p.formData?.igst || 0),
//           cess: Number(p.formData?.pcess || 0),
//         };
//       })
//       .filter((x) => x.date && x.date >= periodStart && x.date <= periodEnd);

//     const saleCurrent = sale
//       .map((s) => {
//         const dt = parseDate(s.formData?.date);
//         const item = s.items?.[0] || {};
//         return {
//           type: "sale",
//           date: dt,
//           rawDate: s.formData?.date || "",
//           bill: s.formData?.vno || "",
//           cgst: Number(item.ctax || 0),
//           sgst: Number(item.stax || 0),
//           igst: Number(item.itax || 0),
//           cess: Number(s.formData?.pcess || 0),
//         };
//       })
//       .filter((x) => x.date && x.date >= periodStart && x.date <= periodEnd);

//     // Combine and sort by date (and keep stable order)
//     const combined = [...purchCurrent, ...saleCurrent].sort((a, b) => {
//       if (a.date < b.date) return -1;
//       if (a.date > b.date) return 1;
//       // tie-breaker: purchases before sales (arbitrary but consistent)
//       if (a.type === b.type) return 0;
//       return a.type === "purchase" ? -1 : 1;
//     });

//     // --- Build rows with running opening & closing balance ---
//     const builtRows = [];
//     let running = { ...openingBalance }; // opening before first entry
//     let sr = 1;

//     combined.forEach((entry) => {
//       const openingForRow = { ...running };

//       if (entry.type === "purchase") {
//         running = {
//           cgst: running.cgst + entry.cgst,
//           sgst: running.sgst + entry.sgst,
//           igst: running.igst + entry.igst,
//           cess: running.cess + entry.cess,
//         };
//       } else {
//         running = {
//           cgst: running.cgst - entry.cgst,
//           sgst: running.sgst - entry.sgst,
//           igst: running.igst - entry.igst,
//           cess: running.cess - entry.cess,
//         };
//       }

//       builtRows.push({
//         sr: sr++,
//         date: entry.rawDate
//           ? (parseDate(entry.rawDate)
//               ? parseDate(entry.rawDate).toLocaleDateString()
//               : entry.rawDate)
//           : "",
//         bill: entry.bill,
//         opening: openingForRow,
//         purchase:
//           entry.type === "purchase"
//             ? { cgst: entry.cgst, sgst: entry.sgst, igst: entry.igst, cess: entry.cess }
//             : { cgst: 0, sgst: 0, igst: 0, cess: 0 },
//         sale:
//           entry.type === "sale"
//             ? { cgst: entry.cgst, sgst: entry.sgst, igst: entry.igst, cess: entry.cess }
//             : { cgst: 0, sgst: 0, igst: 0, cess: 0 },
//         closing: { ...running },
//       });
//     });

// // setRows(builtRows);


//     // --- Totals for summary (only for current period) ---
//     const totalPurchase = combined
//       .filter((e) => e.type === "purchase")
//       .reduce(
//         (acc, x) => ({
//           cgst: acc.cgst + x.cgst,
//           sgst: acc.sgst + x.sgst,
//           igst: acc.igst + x.igst,
//           cess: acc.cess + x.cess,
//         }),
//         { cgst: 0, sgst: 0, igst: 0, cess: 0 }
//       );

//     const totalSale = combined
//       .filter((e) => e.type === "sale")
//       .reduce(
//         (acc, x) => ({
//           cgst: acc.cgst + x.cgst,
//           sgst: acc.sgst + x.sgst,
//           igst: acc.igst + x.igst,
//           cess: acc.cess + x.cess,
//         }),
//         { cgst: 0, sgst: 0, igst: 0, cess: 0 }
//       );

//     const closingTotals = {
//       cgst: openingBalance.cgst + totalPurchase.cgst - totalSale.cgst,
//       sgst: openingBalance.sgst + totalPurchase.sgst - totalSale.sgst,
//       igst: openingBalance.igst + totalPurchase.igst - totalSale.igst,
//       cess: openingBalance.cess + totalPurchase.cess - totalSale.cess,
//     };

//     // --- Update state ---
//     setRows(builtRows);
//     setSummary({
//       opening: openingBalance,
//       purchase: totalPurchase,
//       sale: totalSale,
//       closing: closingTotals,
//     });
//   };

//   // ---- Render ----
//   return (
//     <Modal show={show} onHide={onClose} className="custom-modal" backdrop="static" style={{marginTop:"10px"}}>
//       <div className="p-3 bg-light">
//         <h4 className="text-center fw-bold">GST REGISTER</h4>

//         {/* Filters */}
//         <div className="d-flex gap-3 my-3">
//           <div>
//             <label>From:</label>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//             />
//           </div>
//           <div>
//             <label>To:</label>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//             />
//           </div>
//           <Button className="Buttonz" variant="contained" onClick={() => { setPrintOpen(true) }} >Print</Button>
//           <GstRegisterPrint
//             isOpen={printOpen}
//             handleClose={() => setPrintOpen(false)}
//             rows={rows}
//             summary={summary}
//             fromDate={fromDate}
//             toDate={toDate}
//           />
//         </div>

//         {/* Table */}
//         <table className="custom-table table table-bordered text-center small">
//           <thead style={{backgroundColor:"#4F81BD", color:'white', fontSize:"16px"}}>
//             <tr>
//               <th rowSpan="2">Sr</th>
//               <th rowSpan="2">Date</th>
//               <th rowSpan="2">B.No</th>

//               <th colSpan="4">Opening Balance</th>
//               <th colSpan="4">Gst Purchase</th>
//               <th colSpan="4">Gst Sale</th>
//               <th colSpan="4">Closing Balance</th>
//             </tr>
//             <tr>
//               <th>C.Gst</th>
//               <th>S.Gst</th>
//               <th>I.Gst</th>
//               <th>Cess</th>

//               <th>C.Gst</th>
//               <th>S.Gst</th>
//               <th>I.Gst</th>
//               <th>Cess</th>

//               <th>C.Gst</th>
//               <th>S.Gst</th>
//               <th>I.Gst</th>
//               <th>Cess</th>

//               <th>C.Gst</th>
//               <th>S.Gst</th>
//               <th>I.Gst</th>
//               <th>Cess</th>
//             </tr>
//           </thead>
//           <tbody style={{fontSize:"14px"}}>
//             {rows.map((r) => (
//               <tr key={r.sr}>
//                 <td>{r.sr}</td>
//                 <td>{r.date}</td>
//                 <td>{r.bill}</td>

//                 {/* Opening */}
//                 <td>{fmt(r.opening?.cgst)}</td>
//                 <td>{fmt(r.opening?.sgst)}</td>
//                 <td>{fmt(r.opening?.igst)}</td>
//                 <td>{fmt(r.opening?.cess)}</td>

//                 {/* Purchase */}
//                 <td>{fmt(r.purchase?.cgst)}</td>
//                 <td>{fmt(r.purchase?.sgst)}</td>
//                 <td>{fmt(r.purchase?.igst)}</td>
//                 <td>{fmt(r.purchase?.cess)}</td>

//                 {/* Sale */}
//                 <td>{fmt(r.sale?.cgst)}</td>
//                 <td>{fmt(r.sale?.sgst)}</td>
//                 <td>{fmt(r.sale?.igst)}</td>
//                 <td>{fmt(r.sale?.cess)}</td>

//                 {/* Closing */}
//                 <td>{fmt(r.closing?.cgst)}</td>
//                 <td>{fmt(r.closing?.sgst)}</td>
//                 <td>{fmt(r.closing?.igst)}</td>
//                 <td>{fmt(r.closing?.cess)}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Summary */}
//         <div className="mt-2">
//           <table className="custom-table table table-bordered text-center small">
//             <thead style={{backgroundColor:"#4F81BD", color:'white', fontSize:"16px"}}>
//               <tr>
//                 <th></th>
//                 <th>CGST</th>
//                 <th>SGST</th>
//                 <th>IGST</th>
//                 <th>Cess</th>
//                 <th>Total</th>
//               </tr>
//             </thead>
//             <tbody style={{fontSize:"14px"}}>
//               <tr>
//                 <td>Opening Balance</td>
//                 <td>{fmt(summary.opening.cgst)}</td>
//                 <td>{fmt(summary.opening.sgst)}</td>
//                 <td>{fmt(summary.opening.igst)}</td>
//                 <td>{fmt(summary.opening.cess)}</td>
//                 <td>
//                   {fmt(
//                     (summary.opening.cgst || 0) +
//                       (summary.opening.sgst || 0) +
//                       (summary.opening.igst || 0) +
//                       (summary.opening.cess || 0)
//                   )}
//                 </td>
//               </tr>

//               <tr>
//                 <td>Gst Purchase</td>
//                 <td>{fmt(summary.purchase.cgst)}</td>
//                 <td>{fmt(summary.purchase.sgst)}</td>
//                 <td>{fmt(summary.purchase.igst)}</td>
//                 <td>{fmt(summary.purchase.cess)}</td>
//                 <td>
//                   {fmt(
//                     (summary.purchase.cgst || 0) +
//                       (summary.purchase.sgst || 0) +
//                       (summary.purchase.igst || 0) +
//                       (summary.purchase.cess || 0)
//                   )}
//                 </td>
//               </tr>

//               <tr>
//                 <td>Gst Sale</td>
//                 <td>{fmt(summary.sale.cgst)}</td>
//                 <td>{fmt(summary.sale.sgst)}</td>
//                 <td>{fmt(summary.sale.igst)}</td>
//                 <td>{fmt(summary.sale.cess)}</td>
//                 <td>
//                   {fmt(
//                     (summary.sale.cgst || 0) +
//                       (summary.sale.sgst || 0) +
//                       (summary.sale.igst || 0) +
//                       (summary.sale.cess || 0)
//                   )}
//                 </td>
//               </tr>

//               <tr>
//                 <td>Closing Balance</td>
//                 <td>{fmt(summary.closing.cgst)}</td>
//                 <td>{fmt(summary.closing.sgst)}</td>
//                 <td>{fmt(summary.closing.igst)}</td>
//                 <td>{fmt(summary.closing.cess)}</td>
//                 <td>
//                   {fmt(
//                     (summary.closing.cgst || 0) +
//                       (summary.closing.sgst || 0) +
//                       (summary.closing.igst || 0) +
//                       (summary.closing.cess || 0)
//                   )}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>

//         {/* <div className="d-flex justify-content-end mt-3">
//           <button className="btn btn-secondary" onClick={onClose}>
//             Close
//           </button>
//         </div> */}
//       </div>
//     </Modal>
//   );
// }


import React, { useState, useEffect } from "react";
import axios from "axios";
import "./GstRegister.css";
import GstRegisterPrint from "./GstRegisterPrint";
import { Button } from "@mui/material";

export default function GstRegister() {
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
  const [printOpen, setPrintOpen] = useState(false);
  const [viewMode, setViewMode] = useState("Record Wise"); // default

  // ---- Helpers ----
  const parseDate = (d) => {
    if (!d) return null;
    if (/\d{4}-\d{2}-\d{2}T/.test(d) || /\d{4}-\d{2}-\d{2}/.test(d)) {
      const dt = new Date(d);
      if (!isNaN(dt)) return dt;
    }
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
      const [dd, mm, yyyy] = d.split("/");
      return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    }
    const dt2 = new Date(d);
    return isNaN(dt2) ? null : dt2;
  };

  const fmt = (v) => {
    if (v === null || v === undefined || v === "") return "";
    const n = Number(v);
    if (isNaN(n)) return "";
    return n.toFixed(2);
  };

  // Fetch data
  useEffect(() => {
    fetchSale();
    fetchPurchase();
  }, []);

  const fetchSale = async () => {
    try {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale"
      );
      setSale(res.data || []);
    } catch (err) {
      console.error(err);
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
      console.error(err);
      setPurchase([]);
    }
  };

  useEffect(() => {
    if (sale.length || purchase.length) buildRegister();
  }, [sale, purchase, fromDate, toDate, viewMode]);

  const buildRegister = () => {
    const prevFYEnd = new Date("2025-03-31T23:59:59.999Z");
    const periodStart = new Date(fromDate + "T00:00:00");
    const periodEnd = new Date(toDate + "T23:59:59");

    const sumGSTFromArr = (arr, isPurchase) =>
      arr.reduce(
        (acc, x) => {
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

    // Prepare current entries
    const purchCurrent = purchase
      .map((p) => ({
        type: "purchase",
        date: parseDate(p.formData?.date),
        rawDate: p.formData?.date,
        bill: p.formData?.vno,
        cgst: Number(p.formData?.cgst || 0),
        sgst: Number(p.formData?.sgst || 0),
        igst: Number(p.formData?.igst || 0),
        cess: Number(p.formData?.pcess || 0),
      }))
      .filter((x) => x.date >= periodStart && x.date <= periodEnd);

    const saleCurrent = sale
      .map((s) => {
        const item = s.items?.[0] || {};
        return {
          type: "sale",
          date: parseDate(s.formData?.date),
          rawDate: s.formData?.date,
          bill: s.formData?.vno,
          cgst: Number(item.ctax || 0),
          sgst: Number(item.stax || 0),
          igst: Number(item.itax || 0),
          cess: Number(s.formData?.pcess || 0),
        };
      })
      .filter((x) => x.date >= periodStart && x.date <= periodEnd);

    // Combine
    const combinedRaw = [...purchCurrent, ...saleCurrent].sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      return a.type === "purchase" ? -1 : 1;
    });

    // --- Grouping ---
    const groupEntries = (entries) => {
      if (viewMode === "Record Wise") return entries;

      const grouped = {};
      entries.forEach((entry) => {
        const dt = parseDate(entry.rawDate);
        if (!dt) return;

        let key = "";
        if (viewMode === "Date Wise") {
          key = dt.toISOString().split("T")[0]; // YYYY-MM-DD
        } else if (viewMode === "Month Wise") {
          key = `${dt.getFullYear()}-${("0" + (dt.getMonth() + 1)).slice(-2)}`; // YYYY-MM
        }

        if (!grouped[key]) {
          grouped[key] = {
            type: "group",
            date: dt,
            rawDate: key,
            cgst: 0,
            sgst: 0,
            igst: 0,
            cess: 0,
            bill: "",
            original: [],
          };
        }

        grouped[key].cgst += entry.cgst;
        grouped[key].sgst += entry.sgst;
        grouped[key].igst += entry.igst;
        grouped[key].cess += entry.cess;
        grouped[key].original.push(entry);
      });

      return Object.values(grouped).sort((a, b) => a.date - b.date);
    };

    const combined = groupEntries(combinedRaw);

    // --- Build Rows ---
    const builtRows = [];
    let running = { ...openingBalance };

    combined.forEach((entry, idx) => {
      const openingForRow = { ...running };

      if (entry.type === "purchase") {
        running = {
          cgst: running.cgst + entry.cgst,
          sgst: running.sgst + entry.sgst,
          igst: running.igst + entry.igst,
          cess: running.cess + entry.cess,
        };
      } else if (entry.type === "sale") {
        running = {
          cgst: running.cgst - entry.cgst,
          sgst: running.sgst - entry.sgst,
          igst: running.igst - entry.igst,
          cess: running.cess - entry.cess,
        };
      } else if (entry.type === "group") {
        // sum grouped entries
        const totalPurchase = entry.original
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

        const totalSale = entry.original
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

        running = {
          cgst: openingForRow.cgst + totalPurchase.cgst - totalSale.cgst,
          sgst: openingForRow.sgst + totalPurchase.sgst - totalSale.sgst,
          igst: openingForRow.igst + totalPurchase.igst - totalSale.igst,
          cess: openingForRow.cess + totalPurchase.cess - totalSale.cess,
        };

        builtRows.push({
          sr: idx + 1,
          date: entry.rawDate,
          bill: "",
          opening: openingForRow,
          purchase: totalPurchase,
          sale: totalSale,
          closing: { ...running },
        });

        return;
      }

      builtRows.push({
        sr: idx + 1,
        date:
          entry.rawDate && entry.type !== "group"
            ? parseDate(entry.rawDate).toLocaleDateString()
            : entry.rawDate,
        bill: entry.bill,
        opening: openingForRow,
        purchase:
          entry.type === "purchase"
            ? entry
            : { cgst: 0, sgst: 0, igst: 0, cess: 0 },
        sale:
          entry.type === "sale"
            ? entry
            : { cgst: 0, sgst: 0, igst: 0, cess: 0 },
        closing: { ...running },
      });
    });

    // --- Summary ---
    const totalPurchase = purchCurrent.reduce(
      (acc, x) => ({
        cgst: acc.cgst + x.cgst,
        sgst: acc.sgst + x.sgst,
        igst: acc.igst + x.igst,
        cess: acc.cess + x.cess,
      }),
      { cgst: 0, sgst: 0, igst: 0, cess: 0 }
    );

    const totalSale = saleCurrent.reduce(
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

    setRows(builtRows);
    setSummary({
      opening: openingBalance,
      purchase: totalPurchase,
      sale: totalSale,
      closing: closingTotals,
    });
  };

  return (
    <div className="p-3">
      <h4 style={{ marginTop: -40 }} className="headerSale">
        GST REGISTER
      </h4>

      {/* Filters & View Mode */}
      <div className="d-flex gap-3 my-3 align-items-center">
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

        <div>
          <label>View Mode:</label>
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="form-select"
            style={{ width: "150px" }}
          >
            <option value="Record Wise">Record Wise</option>
            <option value="Date Wise">Date Wise</option>
            <option value="Month Wise">Month Wise</option>
          </select>
        </div>

        <Button
          className="Buttonz"
          variant="contained"
          onClick={() => setPrintOpen(true)}
        >
          Print
        </Button>

        <GstRegisterPrint
          isOpen={printOpen}
          handleClose={() => setPrintOpen(false)}
          rows={rows}
          summary={summary}
          fromDate={fromDate}
          toDate={toDate}
        />
      </div>

      {/* Table */}
      <table className="custom-table table table-bordered text-center small">
        <thead style={{ backgroundColor: "#4F81BD", color: "white", fontSize: "16px" }}>
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
        <tbody style={{ fontSize: "14px" }}>
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
          <thead style={{ backgroundColor: "#4F81BD", color: "white", fontSize: "16px" }}>
            <tr>
              <th></th>
              <th>CGST</th>
              <th>SGST</th>
              <th>IGST</th>
              <th>Cess</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: "14px" }}>
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
    </div>
  );
}
