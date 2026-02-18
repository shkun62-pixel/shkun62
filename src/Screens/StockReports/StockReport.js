// import React, { useState, useEffect, useRef } from "react";
// import styles from "./StockReport.module.css";
// import { Button, Card } from "react-bootstrap";
// import Table from "react-bootstrap/Table";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import StockRpPrint from "./StockRpPrint";
// import { useNavigate } from "react-router-dom";
// import financialYear from "../Shared/financialYear";
// import InputMask from "react-input-mask";
// import { useLocation } from "react-router-dom";

// const StockReport = () => {
//   const location = useLocation();

//   const tenant = "shkun_05062025_05062026";
//   const [fromDate, setFromDate] = useState("");
//   const [uptoDate, setUptoDate] = useState("");

//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setFromDate(formatDate(fy.start)); // converted
//     setUptoDate(formatDate(fy.end)); // converted
//   }, []);

//   const [items, setItems] = useState([
//     {
//       id: 1,
//       date: "",
//       sdisc: "",
//       opening: "",
//       purRec: "",
//       production: "",
//       issue: "",
//       sale: "",
//       closing: "",
//     },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [aheads, setAheads] = useState([]);
//   const [selectedAhead, setSelectedAhead] = useState("");
//   const [reportType, setReportType] = useState("");
//   const [purchaseItems, setPurchaseItems] = useState([]);
//   const [saleItems, setSaleItems] = useState([]);
//   const [openingWeight, setOpeningWeight] = useState(0);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   // Active Row
//   const tableContainerRef = useRef(null);
//   const [activeRow, setActiveRow] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (selectedAhead) {
//       localStorage.setItem("stock_selectedAhead", selectedAhead);
//     }
//   }, [selectedAhead]);

//   useEffect(() => {
//     if (location.state?.selectedAhead) {
//       setSelectedAhead(location.state.selectedAhead);
//     }
//   }, [location.state]);

//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape" && location.state?.selectedAhead) {
//         navigate(-1); // go back
//       }
//     };

//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, []);

//   // Fetch unique Aheads list
//   useEffect(() => {
//     const fetchAheads = async () => {
//       try {
//         const res = await axios.get(
//           "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/stockmaster",
//         );
//         const list = res.data.data
//           .map((item) => item.formData?.Aheads?.trim())
//           .filter((v, i, arr) => v && arr.indexOf(v) === i);
//         setAheads(list);

//         const savedAhead = localStorage.getItem("stock_selectedAhead");

//         if (savedAhead && list.includes(savedAhead)) {
//           setSelectedAhead(savedAhead);
//         } else if (list.length > 0) {
//           setSelectedAhead(list[0]);
//         }
//       } catch (e) {
//         console.error("Error loading Aheads", e);
//       }
//     };
//     fetchAheads();
//   }, []);

//   const parseDate = (value) => {
//     if (!value) return null;

//     // Already a Date object
//     if (value instanceof Date) return value;

//     const str = String(value).trim();

//     // ISO or yyyy-mm-dd
//     if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
//       const d = new Date(str);
//       return isNaN(d) ? null : d;
//     }

//     // dd-mm-yyyy or dd/mm/yyyy
//     const match = str.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);
//     if (match) {
//       let [, dd, mm, yyyy] = match;

//       dd = parseInt(dd, 10);
//       mm = parseInt(mm, 10) - 1;
//       yyyy = parseInt(yyyy, 10);

//       if (yyyy < 100) yyyy += 2000;

//       const d = new Date(yyyy, mm, dd);
//       return isNaN(d) ? null : d;
//     }

//     // Last fallback
//     const fallback = new Date(str);
//     return isNaN(fallback) ? null : fallback;
//   };

//   const applyReportType = (items, reportType) => {
//     if (!reportType) return items;

//     switch (reportType) {
//       // ----------------------------
//       // RECORD WISE (ACTIVE)
//       // ----------------------------
//       case "record_active":
//         return items.filter(
//           (item) => Number(item.purRec) !== 0 || Number(item.sale) !== 0,
//         );

//       // ----------------------------
//       // RECORD WISE (ALL)
//       // ----------------------------
//       case "record_all":
//         return items;

//       // ----------------------------
//       // DATE WISE (ACTIVE)
//       // ----------------------------
//       case "date_active": {
//         const map = {};
//         items.forEach((i) => {
//           if (!map[i.date]) {
//             map[i.date] = { ...i };
//           } else {
//             map[i.date].purRec = (
//               Number(map[i.date].purRec) + Number(i.purRec)
//             ).toFixed(2);
//             map[i.date].sale = (
//               Number(map[i.date].sale) + Number(i.sale)
//             ).toFixed(2);
//             map[i.date].closing = i.closing;
//           }
//         });
//         return Object.values(map).filter(
//           (i) => Number(i.purRec) !== 0 || Number(i.sale) !== 0,
//         );
//       }

//       // ----------------------------
//       // DATE WISE (ALL)
//       // ----------------------------
//       case "date_all": {
//         const map = {};
//         items.forEach((i) => {
//           if (!map[i.date]) {
//             map[i.date] = { ...i };
//           } else {
//             map[i.date].purRec = (
//               Number(map[i.date].purRec) + Number(i.purRec)
//             ).toFixed(2);
//             map[i.date].sale = (
//               Number(map[i.date].sale) + Number(i.sale)
//             ).toFixed(2);
//             map[i.date].closing = i.closing;
//           }
//         });
//         return Object.values(map);
//       }

//       // ----------------------------
//       // MONTH WISE
//       // ----------------------------
//       case "Month Wise Display": {
//         const map = {};
//         items.forEach((i) => {
//           const [dd, mm, yyyy] = i.date.split("/");
//           const key = `${mm}/${yyyy}`;

//           if (!map[key]) {
//             map[key] = {
//               ...i,
//               date: key,
//             };
//           } else {
//             map[key].purRec = (
//               Number(map[key].purRec) + Number(i.purRec)
//             ).toFixed(2);
//             map[key].sale = (Number(map[key].sale) + Number(i.sale)).toFixed(2);
//             map[key].closing = i.closing;
//           }
//         });
//         return Object.values(map);
//       }

//       default:
//         return items;
//     }
//   };

//   useEffect(() => {
//     if (!selectedAhead) return;
//     setLoading(true);

//     setPurchaseItems([]);
//     setSaleItems([]);
//     setItems([]);
//     setOpeningWeight(0);

//     const fetchData = async () => {
//       try {
//         const [saleRes, purchaseRes, stockMasterRes] = await Promise.all([
//           axios.get(
//             "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale",
//           ),
//           axios.get(
//             "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase",
//           ),
//           axios.get(
//             "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/stockmaster",
//           ),
//         ]);

//         const matchingStock = stockMasterRes.data.data.find(
//           (item) => item.formData?.Aheads?.trim() === selectedAhead,
//         );
//         const opening = parseFloat(matchingStock?.formData?.openwts || 0);
//         setOpeningWeight(opening);

//         const normalizedAhead = selectedAhead.trim().toLowerCase();
//         const isWithinDateRange = (date) => {
//           const d = parseDate(date);
//           const f = parseDate(fromDate);
//           const u = parseDate(uptoDate);

//           if (!d || !f || !u) return false;

//           d.setHours(0, 0, 0, 0);
//           f.setHours(0, 0, 0, 0);
//           u.setHours(23, 59, 59, 999);

//           return d >= f && d <= u;
//         };

//         const purchases = purchaseRes.data.flatMap((purchase) =>
//           purchase.items
//             .filter(
//               (item) =>
//                 item.sdisc?.trim().toLowerCase() === normalizedAhead &&
//                 isWithinDateRange(purchase.formData.date),
//             )
//             .map((item) => ({
//               id: item.id, // item number
//               docId: purchase._id, // Mongo document ID
//               type: "purchase",
//               date: parseDate(purchase.formData.date),
//               // date: new Date(purchase.formData.date),
//               sdisc: purchase.supplierdetails?.[0]?.vacode || "",
//               purRec: parseFloat(item.weight),
//               sale: 0,
//             })),
//         );

//         const sales = saleRes.data.flatMap((sale) =>
//           sale.items
//             .filter(
//               (item) =>
//                 item.sdisc?.trim().toLowerCase() === normalizedAhead &&
//                 isWithinDateRange(sale.formData.date),
//             )
//             .map((item) => ({
//               id: item.id, // item number
//               docId: sale._id, // Mongo document ID
//               type: "sale",
//               date: new Date(sale.formData.date),
//               sdisc: sale.customerDetails?.[0]?.vacode || "",
//               purRec: 0,
//               sale: parseFloat(item.weight),
//             })),
//         );

//         setPurchaseItems(purchases);
//         setSaleItems(sales);

//         const merged = [...purchases, ...sales].sort(
//           (a, b) => new Date(a.date) - new Date(b.date),
//         );

//         let prevClosing = opening;
//         const finalItems = merged.map((item) => {
//           const opening = prevClosing;
//           const closing = opening + item.purRec - item.sale;
//           prevClosing = closing;
//           return {
//             ...item,
//             date: new Date(item.date).toLocaleDateString("en-GB"),
//             opening: opening.toFixed(2),
//             closing: closing.toFixed(2),
//             purRec: item.purRec.toFixed(2),
//             sale: item.sale.toFixed(2),
//           };
//         });

//         const filteredItems = applyReportType(finalItems, reportType);
//         setItems(filteredItems);
//         // setItems(finalItems);
//       } catch (err) {
//         console.error("Error loading data", err);
//       } finally {
//         setTimeout(() => {
//           setLoading(false);
//         }, 1000);
//       }
//     };

//     fetchData();
//   }, [selectedAhead, fromDate, uptoDate, reportType]); // 👈 Add these dependencies

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (items.length === 0) return;

//       if (e.key === "ArrowDown") {
//         setActiveRow((prev) => Math.min(prev + 1, items.length - 1));
//       } else if (e.key === "ArrowUp") {
//         setActiveRow((prev) => Math.max(prev - 1, 0));
//       } else if (e.key === "Enter") {
//         const row = items[activeRow];
//         if (!row || reportType === "Month Wise Display") return;

//         // ✅ SAVE ACTIVE ROW INDEX
//         sessionStorage.setItem("stock_activeRow", activeRow);

//         // 🔥 Navigation Logic
//         if (row.type === "sale") {
//           navigate("/sale", {
//             state: {
//               saleId: row.docId,
//             },
//           });
//         } else if (row.type === "purchase") {
//           navigate("/purchase", {
//             state: {
//               purId: row.docId,
//             },
//           });
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [items, activeRow]);

//   useEffect(() => {
//     const savedRow = sessionStorage.getItem("stock_activeRow");

//     if (savedRow !== null) {
//       const index = parseInt(savedRow, 10);
//       if (!isNaN(index)) {
//         setActiveRow(index);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const savedRow = sessionStorage.getItem("stock_activeRow");

//     if (savedRow !== null && items.length > 0) {
//       const index = Math.min(parseInt(savedRow, 10), items.length - 1);
//       setActiveRow(index);
//     }
//   }, [items]);

//   // Auto -scroll effect
//   useEffect(() => {
//     const container = tableContainerRef.current;
//     if (!container) return;

//     const rows = container.querySelectorAll("tbody tr");
//     if (!rows.length) return;

//     const idx = Math.max(0, Math.min(activeRow, rows.length - 1));
//     const selectedRow = rows[idx];
//     if (!selectedRow) return;

//     // Adjust for header height (if your thead is sticky)
//     const headerOffset = 40; // Adjust if your header height is different
//     const buffer = 25; // Extra space above/below row

//     const rowTop = selectedRow.offsetTop;
//     const rowBottom = rowTop + selectedRow.offsetHeight;

//     const containerHeight = container.clientHeight;
//     const visibleTop = container.scrollTop + buffer + headerOffset;
//     const visibleBottom = container.scrollTop + containerHeight - buffer;

//     // If row is below visible area → scroll down
//     if (rowBottom > visibleBottom) {
//       const newScroll = rowBottom - containerHeight + buffer * 2;

//       container.scrollTo({
//         top: newScroll,
//         behavior: "smooth",
//       });
//     }

//     // If row is above visible area → scroll up
//     else if (rowTop < visibleTop) {
//       const newScroll = rowTop - headerOffset - buffer;

//       container.scrollTo({
//         top: newScroll,
//         behavior: "smooth",
//       });
//     }
//   }, [activeRow, items]);

//   return (
//     <div style={{ padding: "10px" }}>
//       <Card className={styles.cardL}>
//         <h1 className={styles.header}>STOCK REPORT</h1>
//         <div className={styles.TopPart}>
//           <div className={styles.Column}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//               }}
//             >
//               <label htmlFor="aheadSelect">A/c Name:</label>
//               <select
//                 className={styles.AcName}
//                 id="aheadSelect"
//                 value={selectedAhead}
//                 onChange={(e) => setSelectedAhead(e.target.value)}
//               >
//                 <option value="">-- Select Ahead --</option>
//                 {aheads.map((ahead, index) => (
//                   <option key={index} value={ahead}>
//                     {ahead}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 marginTop: 5,
//               }}
//             >
//               <text style={{ marginRight: "8px" }}>Options:</text>
//               <select
//                 className={styles.options}
//                 id="reportTypeSelect"
//                 value={reportType}
//                 onChange={(e) => setReportType(e.target.value)}
//               >
//                 <option value="record_active">Record Wise Active</option>
//                 <option value="record_all">Record Wise All</option>
//                 <option value="date_active">Date Wise Active</option>
//                 <option value="date_all">Date Wise All</option>
//                 <option value="Month Wise Display">Month Wise Display</option>
//                 <option value="Record Wise with Product Details">
//                   Record Wise with Product Details
//                 </option>
//               </select>
//             </div>
//           </div>
//           <div className={styles.Column}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//               }}
//             >
//               <text style={{ marginRight: "8px" }}>From:</text>
//               <InputMask
//                 mask="99/99/9999"
//                 placeholder="dd/mm/yyyy"
//                 value={fromDate}
//                 onChange={(e) => setFromDate(e.target.value)}
//                 className={styles.From}
//               />
//               {/* <DatePicker
//               selected={fromDate}
//               onChange={(date) => setFromDate(date)}
//               className={styles.From}
//               dateFormat="dd/MM/yyyy"
//             /> */}
//             </div>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 marginTop: 5,
//               }}
//             >
//               <text style={{ marginRight: "8px" }}>Upto:</text>
//               <InputMask
//                 mask="99/99/9999"
//                 placeholder="dd/mm/yyyy"
//                 value={uptoDate}
//                 onChange={(e) => setUptoDate(e.target.value)}
//                 className={styles.Upto}
//               />
//               {/* <DatePicker
//               selected={uptoDate}
//               onChange={(date) => setUptoDate(date)}
//               className={styles.Upto}
//               dateFormat="dd/MM/yyyy"
//             /> */}
//             </div>
//           </div>
//           <div style={{ marginLeft: "20px", marginTop: "auto" }}>
//             <Button className="Buttonz" onClick={handleOpen}>
//               Print
//             </Button>
//           </div>
//           <div style={{ visibility: "hidden", width: 0, height: 0 }}>
//             <StockRpPrint
//               items={items}
//               isOpen={open}
//               handleClose={handleClose}
//               selectedAhead={selectedAhead}
//               fromDate={fromDate}
//               uptoDate={uptoDate}
//             />
//           </div>
//         </div>
//         <div ref={tableContainerRef} className={styles.TableDIV}>
//           <Table className="custom-table">
//             <thead
//               style={{
//                 background: "skyblue",
//                 textAlign: "center",
//                 position: "sticky",
//                 top: 0,
//               }}
//             >
//               <tr style={{ color: "#575a5a" }}>
//                 <th>
//                   {reportType === "Month Wise Display" ? "MONTH" : "DATE"}
//                 </th>
//                 <th>DESCRIPTION</th>
//                 <th>OPENING</th>
//                 <th>PUR/REC.</th>
//                 <th>PRODUCTION</th>
//                 <th>ISSUE</th>
//                 <th>SALE</th>
//                 <th>CLOSING</th>
//               </tr>
//             </thead>
//             <tbody
//               style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}
//             >
//               {items.map((item, index) => (
//                 <tr
//                   key={item.id}
//                   style={{
//                     backgroundColor: activeRow === index ? "#ffe08a" : "white",
//                     fontWeight: activeRow === index ? "bold" : "normal",
//                     cursor: "pointer",
//                     transition: "0.2s",
//                   }}
//                   onClick={() => setActiveRow(index)}
//                 >
//                   <td className={styles.font} style={{ padding: "8px" }}>
//                     {item.date}
//                   </td>
//                   <td className={styles.font} style={{ padding: "8px" }}>
//                     {reportType === "Month Wise Display" ? "" : item.sdisc}
//                   </td>
//                   <td
//                     className={styles.font}
//                     style={{ padding: "8px", textAlign: "right" }}
//                   >
//                     {item.opening}
//                   </td>
//                   <td
//                     className={styles.font}
//                     style={{ padding: "8px", textAlign: "right" }}
//                   >
//                     {item.purRec}
//                   </td>
//                   <td
//                     className={styles.font}
//                     style={{ padding: "8px", textAlign: "right" }}
//                   >
//                     {item.production}
//                   </td>
//                   <td
//                     className={styles.font}
//                     style={{ padding: "8px", textAlign: "right" }}
//                   >
//                     {item.issue}
//                   </td>
//                   <td
//                     className={styles.font}
//                     style={{ padding: "8px", textAlign: "right" }}
//                   >
//                     {item.sale}
//                   </td>
//                   <td
//                     className={styles.font}
//                     style={{ padding: "8px", textAlign: "right" }}
//                   >
//                     {item.closing}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default StockReport;



import React, { useEffect, useMemo, useRef, useState, useContext } from "react";
import styles from "./StockReport.module.css";
import { Button, Card, Spinner, Badge } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import StockRpPrint from "./StockRpPrint";
import { useNavigate, useLocation } from "react-router-dom";
import financialYear from "../Shared/financialYear";
import InputMask from "react-input-mask";
import { CompanyContext } from "../Context/CompanyContext";

const StockReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { company } = useContext(CompanyContext);
  // const tenant = company?.databaseName;
  const tenant = "03AAYFG4472A1ZG_01042025_31032026";

  // -----------------------------
  // Dates (dd/mm/yyyy)
  // -----------------------------
  const [fromDate, setFromDate] = useState("");
  const [uptoDate, setUptoDate] = useState("");

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(formatDate(fy.start));
    setUptoDate(formatDate(fy.end));
  }, []);

  // -----------------------------
  // UI State
  // -----------------------------
  const [loading, setLoading] = useState(false);
  const [aheads, setAheads] = useState([]);
  const [selectedAhead, setSelectedAhead] = useState("");
  const [reportType, setReportType] = useState("record_active");

  const [items, setItems] = useState([]);
  const [openingWeight, setOpeningWeight] = useState(0);

  // Print
  const [openPrint, setOpenPrint] = useState(false);
  const handleOpen = () => setOpenPrint(true);
  const handleClose = () => setOpenPrint(false);

  // Active Row + Scroll
  const tableContainerRef = useRef(null);
  const [activeRow, setActiveRow] = useState(0);

  // Abort / latest-only fetch guard
  const abortRef = useRef(null);
  const reqIdRef = useRef(0);

  // -----------------------------
  // Persist selectedAhead
  // -----------------------------
  useEffect(() => {
    if (selectedAhead) localStorage.setItem("stock_selectedAhead", selectedAhead);
  }, [selectedAhead]);

  // If coming from another page (like stocksummary click)
  useEffect(() => {
    if (location.state?.selectedAhead) setSelectedAhead(location.state.selectedAhead);
  }, [location.state]);

  // ESC back only when came with selectedAhead
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && location.state?.selectedAhead) navigate(-1);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -----------------------------
  // Fetch Aheads (from stockmaster)
  // -----------------------------
  useEffect(() => {
    if (!tenant) return;

    const fetchAheads = async () => {
      try {
        const res = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/stockmaster`
        );

        const list = (res.data?.data || [])
          .map((item) => item.formData?.Aheads?.trim())
          .filter((v, i, arr) => v && arr.indexOf(v) === i);

        setAheads(list);

        const saved = localStorage.getItem("stock_selectedAhead");
        if (location.state?.selectedAhead && list.includes(location.state.selectedAhead)) {
          setSelectedAhead(location.state.selectedAhead);
        } else if (saved && list.includes(saved)) {
          setSelectedAhead(saved);
        } else if (list.length > 0) {
          setSelectedAhead(list[0]);
        }
      } catch (e) {
        console.error("Error loading Aheads", e);
      }
    };

    fetchAheads();
  }, [tenant, location.state]);

  // -----------------------------
  // ONE API: /api/stockreport
  // -----------------------------
  const fetchStockReport = async () => {
    if (!tenant) return;
    if (!selectedAhead) return;
    if (!fromDate || !uptoDate) return;

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const myReqId = ++reqIdRef.current;
    setLoading(true);

    try {
      const res = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/stockreport`,
        {
          signal: controller.signal,
          params: {
            ahead: selectedAhead,
            from: fromDate,
            upto: uptoDate,
            reportType,
          },
        }
      );

      // latest-only
      if (myReqId !== reqIdRef.current) return;

      setOpeningWeight(res.data?.openingWeight || 0);
      setItems(res.data?.items || []);
      setActiveRow(0);
    } catch (err) {
      if (err?.name !== "CanceledError" && err?.name !== "AbortError") {
        console.error("Error loading stock report", err);
      }
      setItems([]);
      setOpeningWeight(0);
    } finally {
      if (myReqId === reqIdRef.current) setLoading(false);
    }
  };

  // Auto fetch when inputs change
  useEffect(() => {
    fetchStockReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAhead, fromDate, uptoDate, reportType, tenant]);

  // -----------------------------
  // Keyboard navigation
  // -----------------------------
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveRow((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveRow((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const row = items[activeRow];
        if (!row || reportType === "Month Wise Display") return;

        sessionStorage.setItem("stock_activeRow", String(activeRow));

        if (row.type === "sale") {
          navigate("/sale", { state: { saleId: row.docId } });
        } else if (row.type === "purchase") {
          navigate("/purchase", { state: { purId: row.docId } });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, activeRow, reportType, navigate]);

  // Restore active row after coming back
  useEffect(() => {
    const savedRow = sessionStorage.getItem("stock_activeRow");
    if (savedRow !== null) {
      const idx = parseInt(savedRow, 10);
      if (!isNaN(idx)) setActiveRow(idx);
    }
  }, []);

  useEffect(() => {
    const savedRow = sessionStorage.getItem("stock_activeRow");
    if (savedRow !== null && items.length > 0) {
      const idx = Math.min(parseInt(savedRow, 10), items.length - 1);
      if (!isNaN(idx)) setActiveRow(idx);
    }
  }, [items]);

  // Auto-scroll active row
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const rows = container.querySelectorAll("tbody tr");
    if (!rows.length) return;

    const idx = Math.max(0, Math.min(activeRow, rows.length - 1));
    const selectedRow = rows[idx];
    if (!selectedRow) return;

    const headerOffset = 44;
    const buffer = 24;

    const rowTop = selectedRow.offsetTop;
    const rowBottom = rowTop + selectedRow.offsetHeight;

    const containerHeight = container.clientHeight;
    const visibleTop = container.scrollTop + buffer + headerOffset;
    const visibleBottom = container.scrollTop + containerHeight - buffer;

    if (rowBottom > visibleBottom) {
      container.scrollTo({
        top: rowBottom - containerHeight + buffer * 2,
        behavior: "smooth",
      });
    } else if (rowTop < visibleTop) {
      container.scrollTo({
        top: Math.max(0, rowTop - headerOffset - buffer),
        behavior: "smooth",
      });
    }
  }, [activeRow, items]);

  // -----------------------------
  // Small UI helpers
  // -----------------------------
  const summary = useMemo(() => {
    const totalPur = items.reduce((a, i) => a + Number(i.purRec || 0), 0);
    const totalSale = items.reduce((a, i) => a + Number(i.sale || 0), 0);
    const lastClosing = items.length ? Number(items[items.length - 1]?.closing || 0) : openingWeight;
    return {
      totalPur: totalPur.toFixed(2),
      totalSale: totalSale.toFixed(2),
      closing: Number(lastClosing || 0).toFixed(2),
    };
  }, [items, openingWeight]);

  // -----------------------------
  // Inline “premium” styles (no css required)
  // -----------------------------
  const pill = {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.10)",
    background: "rgba(255,255,255,0.75)",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontSize: 12,
    color: "#3a3a3a",
  };

  const softInput = {
    height: 34,
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.14)",
    background: "rgba(255,255,255,0.8)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
    padding: "0 10px",
    outline: "none",
  };

  const softSelect = {
    ...softInput,
    cursor: "pointer",
  };

  return (
    <div style={{ padding: 10 }}>
      <Card
        className={styles.cardL}
        style={{
          borderRadius: 18,
          overflow: "hidden",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 18px 45px rgba(0,0,0,0.10)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            borderBottom: "1px solid rgba(0,0,0,0.07)",
            background:
              "linear-gradient(135deg, rgba(135,206,235,0.25), rgba(255,255,255,0.75))",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1 className={styles.header} style={{ margin: 0, letterSpacing: 0.4 }}>
              STOCK REPORT
            </h1>
            <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
              <div style={pill}>
                <span style={{ opacity: 0.75 }}>Opening:</span>
                <b>{Number(openingWeight || 0).toFixed(2)}</b>
              </div>
              <div style={pill}>
                <span style={{ opacity: 0.75 }}>Pur/Rec:</span>
                <b>{summary.totalPur}</b>
              </div>
              <div style={pill}>
                <span style={{ opacity: 0.75 }}>Sale:</span>
                <b>{summary.totalSale}</b>
              </div>
              <div style={pill}>
                <span style={{ opacity: 0.75 }}>Closing:</span>
                <b>{summary.closing}</b>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Button
              className="Buttonz"
              onClick={handleOpen}
              style={{
                borderRadius: 12,
                padding: "8px 14px",
                fontWeight: 600,
                boxShadow: "0 10px 22px rgba(0,0,0,0.10)",
              }}
              disabled={!items.length}
            >
              Print
            </Button>
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#333" }}>
                <Spinner size="sm" />
                <span>Loading…</span>
              </div>
            )}
          </div>

          {/* Hidden print */}
          <div style={{ visibility: "hidden", width: 0, height: 0 }}>
            <StockRpPrint
              items={items}
              isOpen={openPrint}
              handleClose={handleClose}
              selectedAhead={selectedAhead}
              fromDate={fromDate}
              uptoDate={uptoDate}
            />
          </div>
        </div>

        {/* Filters */}
        <div
          className={styles.TopPart}
          style={{
            padding: "12px 14px",
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            alignItems: "flex-end",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            background: "rgba(255,255,255,0.72)",
          }}
        >
          {/* Ahead */}
          <div style={{ minWidth: 280, display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="aheadSelect" style={{ fontSize: 12, color: "#455", fontWeight: 700 }}>
              A/c Name
            </label>
            <select
              id="aheadSelect"
              value={selectedAhead}
              onChange={(e) => setSelectedAhead(e.target.value)}
              style={{ ...softSelect, minWidth: 280 }}
            >
              <option value="">-- Select Ahead --</option>
              {aheads.map((ahead, index) => (
                <option key={index} value={ahead}>
                  {ahead}
                </option>
              ))}
            </select>
          </div>

          {/* Report Type */}
          <div style={{ minWidth: 260, display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="reportTypeSelect" style={{ fontSize: 12, color: "#455", fontWeight: 700 }}>
              Options
            </label>
            <select
              id="reportTypeSelect"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ ...softSelect, minWidth: 260 }}
            >
              <option value="record_active">Record Wise Active</option>
              <option value="record_all">Record Wise All</option>
              <option value="date_active">Date Wise Active</option>
              <option value="date_all">Date Wise All</option>
              <option value="Month Wise Display">Month Wise Display</option>
              <option value="Record Wise with Product Details">
                Record Wise with Product Details
              </option>
            </select>
          </div>

          {/* From */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#455", fontWeight: 700 }}>From</label>
            <InputMask
              mask="99/99/9999"
              placeholder="dd/mm/yyyy"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ ...softInput, width: 140 }}
            />
          </div>

          {/* Upto */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ fontSize: 12, color: "#455", fontWeight: 700 }}>Upto</label>
            <InputMask
              mask="99/99/9999"
              placeholder="dd/mm/yyyy"
              value={uptoDate}
              onChange={(e) => setUptoDate(e.target.value)}
              style={{ ...softInput, width: 140 }}
            />
          </div>

          {/* Refresh */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            <Button
              variant="outline-primary"
              style={{ borderRadius: 12, padding: "8px 14px", fontWeight: 700 }}
              onClick={fetchStockReport}
              disabled={loading || !selectedAhead}
            >
              Refresh
            </Button>

            <Badge
              bg="light"
              text="dark"
              style={{
                borderRadius: 999,
                padding: "8px 10px",
                border: "1px solid rgba(0,0,0,0.10)",
                boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
              }}
            >
              Rows: <b>{items.length}</b>
            </Badge>
          </div>
        </div>

        {/* Table */}
        <div
          ref={tableContainerRef}
          className={styles.TableDIV}
          style={{
            padding: 10,
            background: "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(245,247,250,0.75))",
          }}
        >
          <div
            style={{
              // borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
              background: "white",
            }}
          >
            <Table className="custom-table" style={{ margin: 0 }}>
              <thead
                style={{
                  background: "linear-gradient(180deg, rgba(135,206,235,0.65), rgba(135,206,235,0.35))",
                  textAlign: "center",
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                <tr style={{ color: "#334", fontWeight: 800 }}>
                  <th style={{ padding: 10, whiteSpace: "nowrap" }}>
                    {reportType === "Month Wise Display" ? "MONTH" : "DATE"}
                  </th>
                  <th style={{ padding: 10 }}>DESCRIPTION</th>
                  <th style={{ padding: 10, textAlign: "right" }}>OPENING</th>
                  <th style={{ padding: 10, textAlign: "right" }}>PUR/REC.</th>
                  <th style={{ padding: 10, textAlign: "right" }}>PRODUCTION</th>
                  <th style={{ padding: 10, textAlign: "right" }}>ISSUE</th>
                  <th style={{ padding: 10, textAlign: "right" }}>SALE</th>
                  <th style={{ padding: 10, textAlign: "right" }}>CLOSING</th>
                </tr>
              </thead>

              <tbody>
                {!loading && items.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ padding: 18, textAlign: "center", color: "#555" }}>
                      No records found for selected filters.
                    </td>
                  </tr>
                )}

                {items.map((item, index) => (
                  <tr
                    key={`${item.docId || "x"}_${item.id || index}_${index}`}
                    style={{
                      background:
                        activeRow === index
                          ? "linear-gradient(90deg, rgba(255,224,138,0.95), rgba(255,240,200,0.80))"
                          : index % 2 === 0
                          ? "rgba(250,252,255,0.95)"
                          : "white",
                      fontWeight: activeRow === index ? 800 : 500,
                      cursor: "pointer",
                      transition: "0.15s",
                    }}
                    onClick={() => setActiveRow(index)}
                    onDoubleClick={() => {
                      // quick open entry
                      if (reportType === "Month Wise Display") return;
                      if (item.type === "sale") navigate("/sale", { state: { saleId: item.docId } });
                      if (item.type === "purchase") navigate("/purchase", { state: { purId: item.docId } });
                    }}
                  >
                    <td className={styles.font} style={{ padding: 10, whiteSpace: "nowrap" }}>
                      {item.date}
                    </td>
                    <td className={styles.font} style={{ padding: 10 }}>
                      {reportType === "Month Wise Display" ? "" : item.sdisc}
                    </td>
                    <td className={styles.font} style={{ padding: 10, textAlign: "right" }}>
                      {item.opening}
                    </td>
                    <td className={styles.font} style={{ padding: 10, textAlign: "right" }}>
                      {item.purRec}
                    </td>
                    <td className={styles.font} style={{ padding: 10, textAlign: "right" }}>
                      {item.production}
                    </td>
                    <td className={styles.font} style={{ padding: 10, textAlign: "right" }}>
                      {item.issue}
                    </td>
                    <td className={styles.font} style={{ padding: 10, textAlign: "right" }}>
                      {item.sale}
                    </td>
                    <td className={styles.font} style={{ padding: 10, textAlign: "right" }}>
                      {item.closing}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Hint */}
          <div style={{ marginTop: 10, fontSize: 12, color: "#566", textAlign: "center" }}>
            Tip: Use <b>↑ / ↓</b> to move, <b>Enter</b> to open record, <b>Double click</b> row to open quickly.
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StockReport;
