// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { Table, Modal, Button, Card } from "react-bootstrap";
// import { useNavigate } from "react-router-dom";
// import InputMask from "react-input-mask";
// import financialYear from "./Shared/financialYear";
// import OptionModal from "./TrailBalance/OptionModal";
// import AnnexureWiseModal from "./TrailBalance/AnnexureWiseModal";
// import "./TrailBalance/TrailBalance.css";

// const Example = () => {
//   const navigate = useNavigate();

//   /* ===================== STATE ===================== */
//   const [allLedgers, setAllLedgers] = useState([]);
//   const [filteredLedgers, setFilteredLedgers] = useState([]);
//   const [ledgerTotals, setLedgerTotals] = useState({});
//   const [checkedRows, setCheckedRows] = useState({});
//   const [transactions, setTransactions] = useState([]);
//   const [selectedLedger, setSelectedLedger] = useState(null);
//   const [showModal, setShowModal] = useState(false);

//   const [ledgerFromDate, setLedgerFromDate] = useState("");
//   const [ledgerToDate, setLedgerToDate] = useState("");

//   const [isOptionOpen, setIsOptionOpen] = useState(false);
//   const [showAnnexureModal, setShowAnnexureModal] = useState(false);
//   const [annexureGroupedData, setAnnexureGroupedData] = useState({});

//   const [optionValues, setOptionValues] = useState({
//     Balance: "Active Balance",
//     OrderBy: "",
//     Annexure: "All",
//     T1: false,
//     T3: false,
//     T10: false,
//   });

//   /* ===================== HELPERS ===================== */
//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     return `${String(d.getDate()).padStart(2, "0")}/${String(
//       d.getMonth() + 1
//     ).padStart(2, "0")}/${d.getFullYear()}`;
//   };

//   const parseDDMMYYYY = (str) => {
//     if (!str) return null;
//     const [dd, mm, yyyy] = str.split("/").map(Number);
//     return new Date(yyyy, mm - 1, dd);
//   };

//   /* ===================== INIT FY ===================== */
//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setLedgerFromDate(formatDate(fy.start));
//     setLedgerToDate(formatDate(fy.end));
//   }, []);

//   /* ===================== FETCH LEDGERS + TOTALS ===================== */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [ledgerRes, faRes] = await Promise.all([
//           axios.get(
//             "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount"
//           ),
//           axios.get(
//             "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile"
//           ),
//         ]);

//         const ledgersData = ledgerRes.data.data || [];
//         const faData = faRes.data.data || [];

//         /* ---------- TOTALS (ACODE BASED) ---------- */
//         const totalsMap = {};

//         faData.forEach((entry) => {
//           const from = parseDDMMYYYY(ledgerFromDate);
//           const to = parseDDMMYYYY(ledgerToDate);

//           entry.transactions.forEach((txn) => {
//             const txnDate = new Date(txn.date);
//             if (from && txnDate < from) return;
//             if (to && txnDate > to) return;

//             const acode = txn.ACODE;
//             if (!acode) return;

//             if (!totalsMap[acode]) {
//               totalsMap[acode] = {
//                 debit: 0,
//                 credit: 0,
//                 netWeight: 0,
//                 netPcs: 0,
//               };
//             }

//             if (txn.type.toLowerCase() === "debit") {
//               totalsMap[acode].debit += txn.amount;
//             } else {
//               totalsMap[acode].credit += txn.amount;
//             }

//             if (txn.vtype === "P") {
//               totalsMap[acode].netWeight += txn.weight || 0;
//               totalsMap[acode].netPcs += txn.pkgs || 0;
//             } else if (txn.vtype === "S") {
//               totalsMap[acode].netWeight -= txn.weight || 0;
//               totalsMap[acode].netPcs -= txn.pkgs || 0;
//             }
//           });
//         });

//         setLedgerTotals(totalsMap);

//         /* ---------- ENRICH LEDGERS ---------- */
//         const enriched = ledgersData.map((ledger) => {
//           const acode = ledger.formData.acode;
//           const t = totalsMap[acode] || {
//             debit: 0,
//             credit: 0,
//             netWeight: 0,
//             netPcs: 0,
//           };
//           const balance = t.debit - t.credit;
//           const drcr = balance > 0 ? "DR" : balance < 0 ? "CR" : "NIL";

//           return {
//             ...ledger,
//             totals: { balance, drcr },
//             hasTxn: !!totalsMap[acode],
//           };
//         });

//         setAllLedgers(enriched);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchData();
//   }, [ledgerFromDate, ledgerToDate]);

//   /* ===================== FILTER / SORT ===================== */
//   useEffect(() => {
//     let result = [...allLedgers];

//     switch (optionValues.Balance) {
//       case "Active Balance":
//         result = result.filter((l) => l.totals.balance !== 0);
//         break;
//       case "Nil Balance":
//         result = result.filter((l) => l.totals.balance === 0);
//         break;
//       case "Debit Balance":
//         result = result.filter((l) => l.totals.balance > 0);
//         break;
//       case "Credit Balance":
//         result = result.filter((l) => l.totals.balance < 0);
//         break;
//       default:
//         break;
//     }

//     if (optionValues.Annexure !== "All") {
//       result = result.filter(
//         (l) => l.formData.Bsgroup === optionValues.Annexure
//       );
//     }

//     if (optionValues.T1) {
//       result = result.filter((l) => checkedRows[l._id]);
//     }

//     setFilteredLedgers(result);
//   }, [allLedgers, optionValues, checkedRows]);

//   /* ===================== LOAD LEDGER TXNS ===================== */
//   const openLedgerDetails = async (ledger) => {
//     try {
//       const res = await axios.get(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile"
//       );

//       const allTxns = res.data.data || [];

//       const ledgerTxns = allTxns.flatMap((entry) =>
//         entry.transactions
//           .filter((txn) => txn.ACODE === ledger.formData.acode)
//           .map((txn) => ({
//             ...txn,
//             saleId: entry.saleId || null,
//             purId: entry.purchaseId || null,
//             bankId: entry.bankId || null,
//             cashId: entry.cashId || null,
//             journalId: entry.journalId || null,
//           }))
//       );

//       setSelectedLedger(ledger);
//       setTransactions(ledgerTxns);
//       setShowModal(true);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   /* ===================== ANNEXURE ===================== */
//   const buildAnnexureData = () => {
//     const grouped = {};

//     filteredLedgers.forEach((ledger) => {
//       const annexure = ledger.formData.Bsgroup || "Others";
//       if (!grouped[annexure]) grouped[annexure] = [];

//       grouped[annexure].push({
//         ...ledger,
//         netPcs: ledgerTotals[ledger.formData.acode]?.netPcs || 0,
//         netQty: ledgerTotals[ledger.formData.acode]?.netWeight || 0,
//       });
//     });

//     setAnnexureGroupedData(grouped);
//     setShowAnnexureModal(true);
//   };

//   /* ===================== RENDER ===================== */
//   return (
//     <div style={{ padding: "10px" }}>
//       <Card className="contMain">
//         <h3 className="headerTrail">TRIAL BALANCE</h3>

//         <Table size="sm" hover className="custom-table">
//           <thead>
//             <tr>
//               <th></th>
//               <th>NAME</th>
//               <th>CITY</th>
//               <th>PCS</th>
//               <th>QTY</th>
//               <th>DEBIT</th>
//               <th>CREDIT</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredLedgers.map((ledger) => {
//               const { balance, drcr } = ledger.totals;
//               const acode = ledger.formData.acode;

//               return (
//                 <tr
//                   key={ledger._id}
//                   onClick={() => openLedgerDetails(ledger)}
//                 >
//                   <td onClick={(e) => e.stopPropagation()}>
//                     <input
//                       type="checkbox"
//                       checked={!!checkedRows[ledger._id]}
//                       onChange={() =>
//                         setCheckedRows((p) => ({
//                           ...p,
//                           [ledger._id]: !p[ledger._id],
//                         }))
//                       }
//                     />
//                   </td>
//                   <td title={`ACODE: ${acode}`}>
//                     {ledger.formData.ahead}
//                   </td>
//                   <td>{ledger.formData.city}</td>
//                   <td align="right">
//                     {(ledgerTotals[acode]?.netPcs || 0).toFixed(3)}
//                   </td>
//                   <td align="right">
//                     {(ledgerTotals[acode]?.netWeight || 0).toFixed(3)}
//                   </td>
//                   <td align="right" style={{ color: "darkblue" }}>
//                     {drcr === "DR" && Math.abs(balance).toFixed(2)}
//                   </td>
//                   <td align="right" style={{ color: "red" }}>
//                     {drcr === "CR" && Math.abs(balance).toFixed(2)}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </Table>

//         <Button onClick={() => setIsOptionOpen(true)}>Options</Button>

//         <OptionModal
//           isOpen={isOptionOpen}
//           onClose={() => setIsOptionOpen(false)}
//           onApply={(values) => {
//             setOptionValues(values);
//             if (values.OrderBy === "Annexure Wise") {
//               buildAnnexureData();
//             }
//           }}
//         />

//         <AnnexureWiseModal
//           show={showAnnexureModal}
//           onClose={() => setShowAnnexureModal(false)}
//           data={annexureGroupedData}
//         />
//       </Card>
//     </div>
//   );
// };

// export default Example;

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { Table, Card, Form } from "react-bootstrap";  // ✅ Form imported
// import styles from "./AccountStatement/LedgerList.module.css"
// import { useNavigate, useLocation } from "react-router-dom";  // ✅ Add this
// import "react-datepicker/dist/react-datepicker.css";
// import financialYear from "./Shared/financialYear";

// const SEARCH_COL_STORAGE_KEY = "ledger_search_columns";

// const Example = () => {

//   // Filter Ledgers
//   const [ledgers, setLedgers] = useState([]);
//   const [filteredLedgers, setFilteredLedgers] = useState([]); // ✅ for search
//   const [searchTerm, setSearchTerm] = useState("");           // ✅ search state
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedLedger, setSelectedLedger] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const rowRefs = useRef([]);
//   const tableRef = useRef(null);

//   const tableContainerRef = useRef(null);
//   const txnContainerRef = useRef(null);

//   const searchRef = useRef(null);   // ✅ search input ref
//   const navigate = useNavigate();
//   const [activeRowIndex, setActiveRowIndex] = useState(0);  // ✅ Track highlighted txn row
//   const location = useLocation();
//   const [checkedRows, setCheckedRows] = useState({});
//   const [ledgerFromDate, setLedgerFromDate] = useState(null);
//   const [ledgerToDate, setLedgerToDate] = useState(() => new Date());

//   // Filters Transactions
//   const [vtypeFilters, setVtypeFilters] = useState({
//     cash: true,
//     journal: true,
//     bank: true,
//     sale: true,
//     purchase: true,
//     tds: true,
//   });
//   const [isPrintOpen, setIsPrintOpen] = useState(false);
//   const [showOptions, setShowOptions] = useState(false);   // ✅ For Options modal
//   const [filterType, setFilterType] = useState("All");     // ✅ Debit / Credit / All
//   const [filteredTransactions, setFilteredTransactions] = useState([]); // ✅ For filtered txns
//   const [narrationFilter, setNarrationFilter] = useState(""); // ✅ for narration
//   const [selectedRows, setSelectedRows] = useState({});
//   const [selectionFilter, setSelectionFilter] = useState("All");
//   const [ledgerTotals, setLedgerTotals] = useState({}); // { ledgerId: { netPcs, netWeight } }
//   const [progressiveDebit, setProgressiveDebit] = useState(0);
//   const [progressiveCredit, setProgressiveCredit] = useState(0);

//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setFromDate(fy.start); // converted
//     setToDate(fy.end);     // converted
//     setLedgerFromDate(fy.start); // converted
//     setLedgerToDate(fy.end);     // converted
//   }, []);

//   // ✅ Update filtered transactions whenever filters or transactions change
//   useEffect(() => {
//     let data = transactions;

//     // ✅ Filter by Debit/Credit
//     if (filterType !== "All") {
//       data = data.filter(
//         (txn) => txn.type.toLowerCase() === filterType.toLowerCase()
//       );
//     }

//     // ✅ Filter by narration
//     if (narrationFilter.trim() !== "") {
//       data = data.filter((txn) =>
//         txn.narration?.toLowerCase().includes(narrationFilter.toLowerCase())
//       );
//     }

//     // ✅ Filter by Date range
//     if (fromDate) {
//       data = data.filter((txn) => new Date(txn.date) >= fromDate);
//     }
//     if (toDate) {
//       data = data.filter((txn) => new Date(txn.date) <= toDate);
//     }

//     // ✅ Filter by VType checkboxes
//     const selectedVtypes = [];
//     if (vtypeFilters.cash) selectedVtypes.push("C");
//     if (vtypeFilters.journal) selectedVtypes.push("J");
//     if (vtypeFilters.bank) selectedVtypes.push("B");
//     if (vtypeFilters.sale) selectedVtypes.push("S");
//     if (vtypeFilters.purchase) selectedVtypes.push("P");
//     if (vtypeFilters.tds) selectedVtypes.push("TDS");

//     if (selectedVtypes.length > 0) {
//       data = data.filter((txn) => selectedVtypes.includes(txn.vtype));
//     }

//     // ✅ Filter by selection (Selected / Unselected / All)
//     if (selectionFilter === "Selected") {
//       data = data.filter((txn) => selectedRows[txn._id]);
//     } else if (selectionFilter === "Unselected") {
//       data = data.filter((txn) => !selectedRows[txn._id]);
//     }

//     setFilteredTransactions(data);
//   }, [
//     filterType,
//     narrationFilter,
//     fromDate,
//     toDate,
//     vtypeFilters,
//     selectionFilter,   // 👈 added dependency
//     selectedRows,      // 👈 added dependency
//     transactions,
//   ]);

//   useEffect(() => {
//     if (!transactions.length || activeRowIndex < 0) {
//       setProgressiveDebit(0);
//       setProgressiveCredit(0);
//       return;
//     }

//     let debit = 0;
//     let credit = 0;

//     filteredTransactions.slice(0, activeRowIndex + 1).forEach((txn) => {
//       if (txn.type.toLowerCase() === "debit") {
//         debit += txn.amount;
//       } else if (txn.type.toLowerCase() === "credit") {
//         credit += txn.amount;
//       }
//     });

//     setProgressiveDebit(debit);
//     setProgressiveCredit(credit);
//   }, [activeRowIndex, filteredTransactions]);

//   const [flaggedRows, setFlaggedRows] = useState(() => {
//     const saved = localStorage.getItem("flaggedRows");
//     return saved ? new Set(JSON.parse(saved)) : new Set();
//   });

//   useEffect(() => {
//     localStorage.setItem("flaggedRows", JSON.stringify([...flaggedRows]));
//   }, [flaggedRows]);

//   // Fetch ledger list
//   useEffect(() => {
//     axios
//       .get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount")
//       .then((res) => {
//         const data = res.data.data || [];
//         setLedgers(data);
//         setFilteredLedgers(data); // ✅ keep backup
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   const handleCheckboxChange = (id) => {
//     setCheckedRows((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   // ✅ Define all possible columns for Modify functionality
//   const ALL_COLUMNS = [
//     { key: "ahead", label: "NAME"},
//     { key: "Bsgroup", label: "GROUP", width: "200px" },
//     { key: "acode", label: "A/C CODE", width: "90px" },
//     { key: "gstNo", label: "GST NO" },
//     { key: "city", label: "CITY" },
//     { key: "distt", label: "DISTRICT" },
//     { key: "state", label: "STATE" },
//     { key: "pinCode", label: "PINCODE" },
//     { key: "area", label: "AREA" },
//     { key: "distance", label: "DISTANCE" },
//     { key: "pan", label: "PAN" },
//     { key: "phone", label: "PHONE" },
//     { key: "email", label: "EMAIL" },
//     { key: "agent", label: "AGENT" },
//     { key: "add1", label: "ADDRESS" },
//     { key: "opening_dr", label: "OPENING DR" },
//     { key: "opening_cr", label: "OPENING CR" },
//     { key: "msmed", label: "MSMED" },
//     { key: "group", label: "GROUP NAME" },
//     { key: "tcs206", label: "TCS 206" },
//     { key: "tds194q", label: "TDS 194Q" },
//     { key: "tdsno", label: "TDS NO" },
//     { key: "tds_rate", label: "TDS RATE" },
//     { key: "tcs_rate", label: "TCS RATE" },
//     { key: "sur_rate", label: "SURCHARGE RATE" },
//     { key: "wahead", label: "WAREHOUSE NAME" },
//     { key: "wadd1", label: "WAREHOUSE ADD 1" },
//     { key: "wadd2", label: "WAREHOUSE ADD 2" },
//     { key: "Rc", label: "RC" },
//     { key: "Ecc", label: "ECC" },
//     { key: "erange", label: "E RANGE" },
//     { key: "collc", label: "COLLECTION" },
//     { key: "srvno", label: "SERVICE NO" },
//     { key: "cperson", label: "CONTACT PERSON" },
//     { key: "irate", label: "INTEREST RATE" },
//     { key: "weight", label: "WEIGHT" },
//     { key: "bank_ac", label: "BANK A/C" },
//     { key: "narration", label: "NARRATION" },
//     { key: "subname", label: "SUB NAME" },
//     { key: "subaddress", label: "SUB ADDRESS" },
//     { key: "subcity", label: "SUB CITY" },
//     { key: "subgstNo", label: "SUB GST NO" },
//     { key: "payLimit", label: "PAY LIMIT" },
//     { key: "payDuedays", label: "PAY DUE DAYS" },
//     { key: "graceDays", label: "GRACE DAYS" },
//     { key: "sortingindex", label: "SORTING INDEX" },
//     { key: "qtyBsheet", label: "QTY B/SHEET" },
//     { key: "discount", label: "DISCOUNT" },
//     { key: "Terms", label: "TERMS" },
//     { key: "tradingAc", label: "TRADING A/C" },
//     { key: "prefixPurInvoice", label: "PREFIX PUR INV" },
//     { key: "status", label: "STATUS" },
//   ];

//   const [showColumnModal, setShowColumnModal] = useState(false);
//   const STORAGE_KEY = "ledger_visible_columns";

//   const [visibleColumns, setVisibleColumns] = useState(() => {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) {
//       return JSON.parse(saved);
//     }

//     // default columns (first time only)
//     return ALL_COLUMNS.reduce((acc, col) => {
//       acc[col.key] = ["ahead", "Bsgroup", "city", "gstNo", "phone"].includes(col.key);
//       return acc;
//     }, {});
//   });
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns));
//   }, [visibleColumns]);
//   const [searchColumns, setSearchColumns] = useState(() => {
//     const saved = localStorage.getItem(SEARCH_COL_STORAGE_KEY);

//     if (saved) {
//       return JSON.parse(saved);
//     }

//     // default (first load only)
//     return ALL_COLUMNS.reduce((acc, col) => {
//       acc[col.key] = false;
//       return acc;
//     }, {});
//   });
//   useEffect(() => {
//     localStorage.setItem(
//       SEARCH_COL_STORAGE_KEY,
//       JSON.stringify(searchColumns)
//     );
//   }, [searchColumns]);

//   // ✅ Handle search filtering
// useEffect(() => {
//   if (!searchTerm.trim()) {
//     setFilteredLedgers(ledgers);
//     setSelectedIndex(0);
//     return;
//   }

//   const lower = searchTerm.toLowerCase();

//   const activeCols = Object.keys(searchColumns).filter(
//     (key) => searchColumns[key]
//   );

//   const colsToSearch =
//     activeCols.length > 0 ? activeCols : ["ahead"];

//   const isMultiColumn = colsToSearch.length > 1;

//   const filtered = ledgers.filter((ledger) =>
//     colsToSearch.some((key) => {
//       const v = ledger.formData?.[key];
//       if (!v) return false;

//       const text = v.toString().toLowerCase();

//       return isMultiColumn
//         ? text.includes(lower)
//         : text.startsWith(lower);
//     })
//   );

//   setFilteredLedgers(filtered);
//   setSelectedIndex(0);
// }, [searchTerm, ledgers, searchColumns]);

// const isValidPrefix = (value) => {
//   const lower = value.toLowerCase();

//   const activeCols = Object.keys(searchColumns).filter(
//     (key) => searchColumns[key]
//   );

//   const colsToCheck =
//     activeCols.length > 0 ? activeCols : ["ahead"];

//   const isMultiColumn = colsToCheck.length > 1;

//   return ledgers.some((ledger) =>
//     colsToCheck.some((key) => {
//       const v = ledger.formData?.[key];
//       if (!v) return false;

//       const text = v.toString().toLowerCase();

//       // 🔥 RULE SWITCH
//       return isMultiColumn
//         ? text.includes(lower)      // 2+ columns
//         : text.startsWith(lower);   // 0 or 1 column
//     })
//   );
// };

//   return (
//     <div style={{ padding: "20px" }}>
//       <Card className={styles.cardL}>
//         <h3 className={styles.headerlist}>LEDGER ACCOUNTS</h3>
//         <div className={styles.tablecont} ref={tableContainerRef}>
//           <Table size="sm" className="custom-table" hover ref={tableRef}>
//             <thead style={{ position: "sticky", top: 0, background: "skyblue", fontSize: 17, textAlign: "center" }}>
//               <tr>
//               <th></th>
//               {ALL_COLUMNS.filter(col => visibleColumns[col.key]).map(col => (
//                 <th
//                   key={col.key}
//                   style={{
//                     width: col.width,
//                     minWidth: col.width,
//                     maxWidth: col.width,
//                     textAlign: "center",
//                     verticalAlign: "middle",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",   // 👈 center the group horizontally
//                       alignItems: "center",       // 👈 center vertically
//                       gap: "6px",                 // spacing between text & checkbox
//                     }}
//                   >
//                     {/* Column Label */}
//                     <span style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
//                       {col.label}
//                     </span>

//                     {/* Header Checkbox */}
//                     <input
//                       type="checkbox"
//                       checked={!!searchColumns[col.key]}
//                       onChange={(e) => {
//                         e.stopPropagation();
//                         setSearchColumns(prev => ({
//                           ...prev,
//                           [col.key]: !prev[col.key],
//                         }));
//                       }}
//                     />
//                   </div>
//                 </th>
//               ))}
//             </tr>
//             </thead>
//             <tbody>
//               {filteredLedgers.map((ledger, index) => (
//                 <tr
//                   key={ledger._id}
//                   style={{
//                     backgroundColor: flaggedRows.has(index)
//                       ? "red"
//                       : index === selectedIndex
//                       ? "rgb(187, 186, 186)"
//                       : "transparent",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => {
//                     setSelectedIndex(index);
//                   }}
//                 >
//                   {/* Row checkbox */}
//                   <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
//                     <input
//                       type="checkbox"
//                       checked={!!checkedRows[ledger._id]}
//                       onChange={() => handleCheckboxChange(ledger._id)}
//                     />
//                   </td>

//                   {/* Dynamic columns */}
//                  {ALL_COLUMNS.filter(col => visibleColumns[col.key]).map(col => (
//                     <td
//                       key={col.key}
//                       style={{
//                         width: col.width,
//                         minWidth: col.width,
//                         maxWidth: col.width,
//                         whiteSpace: "nowrap",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                       }}
//                     >
//                       {ledger.formData[col.key] || ""}
//                     </td>
//                  ))}
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>

//         {/* ✅ Search Input */}
//         <div style={{display:'flex',flexDirection:"row"}}>
//           <Form.Control
//             ref={searchRef}
//             className={styles.Search}
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
// onChange={(e) => {
//   const val = e.target.value;

//   if (!val) {
//     setSearchTerm("");
//     return;
//   }

//   // ✅ Restrict typing based on selected columns
//   if (isValidPrefix(val)) {
//     setSearchTerm(val);
//   }
//   // ❌ else: typing stops (as you want)
// }}

//           />
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Example;

// import React, { useState } from "react";
// import Table from "react-bootstrap/Table";

// const Example = () => {
//   const [T11, setT11] = useState(false);
//   const [T12, setT12] = useState(false);
//   const [T21, setT21] = useState(false);
//   const [products, setProducts] = useState([]);
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       vcode: "",
//       sdisc: "",
//       Units: "",
//       pkgs: "0.00",
//       weight: "0.00",
//       rate: "0.00",
//       amount: "0.00",
//       disc: 0,
//       discount: "",
//       gst: 18,
//       Pcodes01: "",
//       Pcodess: "",
//       Scodes01: "",
//       Scodess: "",
//       Exp_rate1: 0,
//       Exp_rate2: 0,
//       Exp_rate3: 0,
//       Exp_rate4: 0,
//       Exp_rate5: 0,
//       Exp1: 0,
//       Exp2: 0,
//       Exp3: 0,
//       Exp4: 0,
//       Exp5: 0,
//       exp_before: 0,
//       RateCal: "",
//       Qtyperpc: 0,
//       ctax: "0.00",
//       stax: "0.00",
//       itax: "0.00",
//       tariff: "",
//       vamt: "0.00",
//     },
//   ]);

//   const handleItemChange = (index, key, value, field) => {
//     // If key is "pkgs" or "weight", allow only numbers and a single decimal point
//     if (
//       (key === "pkgs" ||
//         key === "weight" ||
//         key === "tariff" ||
//         key === "rate" ||
//         key === "disc" ||
//         key === "discount" ||
//         key === "amount") &&
//       !/^-?\d*\.?\d*$/.test(value)
//     ) {
//       return; // reject invalid input
//     }

//     // Always force disc/discount to be negative
//     if (key === "disc" || key === "discount") {
//       const numeric = parseFloat(value);
//       if (!isNaN(numeric)) {
//         value = -Math.abs(numeric); // Force negative
//       }
//     }

//     const updatedItems = [...items];
//     updatedItems[index][key] = value;
//     // 🚫 If amount is empty, clear calculation fields and stop
// if (key === "amount" && value === "") {
//   updatedItems[index]["rate"] = "";
//   updatedItems[index]["ctax"] = "";
//   updatedItems[index]["stax"] = "";
//   updatedItems[index]["itax"] = "";
//   updatedItems[index]["vamt"] = "";
//   updatedItems[index]["amount"] = "";
//   setItems(updatedItems);
//   return;
// }

//    // ✅ Reverse Rate Calculation (Amount → Rate)
// if (key === "amount") {

//   // ❗ If amount is empty, clear rate and stop
//   if (value === "") {
//     updatedItems[index]["rate"] = "";
//     setItems(updatedItems);
//     return;
//   }

//   const amount = parseFloat(value);
//   const weight = parseFloat(updatedItems[index].weight) || 0;
//   const pkgs = parseFloat(updatedItems[index].pkgs) || 0;

//   let newRate = 0;

//   if (weight > 0) {
//     newRate = amount / weight;
//   } else if (pkgs > 0) {
//     newRate = amount / pkgs;
//   }

//   if (!isNaN(newRate) && isFinite(newRate)) {
//     updatedItems[index]["rate"] = T21
//       ? Math.round(newRate).toFixed(2)
//       : newRate.toFixed(2);
//   }
// }

//     // If the key is 'name', find the corresponding product and set the price
//     if (key === "name") {
//       const selectedProduct = products.find(
//         (product) => product.Aheads === value,
//       );
//       if (selectedProduct) {
//         updatedItems[index]["vcode"] = selectedProduct.Acodes;
//         updatedItems[index]["sdisc"] = selectedProduct.Aheads;
//         updatedItems[index]["Units"] = selectedProduct.TradeName;
//         updatedItems[index]["rate"] = selectedProduct.Mrps;
//         updatedItems[index]["gst"] = selectedProduct.itax_rate;
//         updatedItems[index]["tariff"] = selectedProduct.Hsn;
//         updatedItems[index]["Scodes01"] = selectedProduct.AcCode;
//         updatedItems[index]["Scodess"] = selectedProduct.Scodess;
//         updatedItems[index]["Pcodes01"] = selectedProduct.acCode;
//         updatedItems[index]["Pcodess"] = selectedProduct.Pcodess;
//         updatedItems[index]["RateCal"] = selectedProduct.Rateins;
//         updatedItems[index]["Qtyperpc"] = selectedProduct.Qpps || 0;
//       } else {
//         updatedItems[index]["rate"] = ""; // Reset price if product not found
//         updatedItems[index]["gst"] = ""; // Reset gst if product not found
//       }
//     }
//     let pkgs = parseFloat(updatedItems[index].pkgs);
//     let Qtyperpkgs = updatedItems[index].Qtyperpc;
//     let AL = pkgs * Qtyperpkgs;
//     let gst;
//     if (pkgs > 0 && Qtyperpkgs > 0 && key !== "weight") {
//       updatedItems[index]["weight"] = AL.toFixed(2);
//     }
//     // Calculate CGST and SGST based on the GST value
//     gst = parseFloat(updatedItems[index].gst);
//     const totalAccordingWeight =
//       parseFloat(updatedItems[index].weight) *
//       parseFloat(updatedItems[index].rate);
//     const totalAccordingPkgs =
//       parseFloat(updatedItems[index].pkgs) *
//       parseFloat(updatedItems[index].rate);
//     let RateCal = updatedItems[index].RateCal;
//     let TotalAcc = totalAccordingWeight; // Set a default value

//     // Calcuate the Amount According to RateCalculation field
//     if (
//       RateCal === "Default" ||
//       RateCal === "" ||
//       RateCal === null ||
//       RateCal === undefined
//     ) {
//       TotalAcc = totalAccordingWeight;
//     } else if (RateCal === "Wt/Qty") {
//       TotalAcc = totalAccordingWeight;
//       console.log("totalAccordingWeight");
//     } else if (RateCal === "Pc/Pkgs") {
//       TotalAcc = totalAccordingPkgs;
//       console.log("totalAccordingPkgs");
//     }
//     let others = parseFloat(updatedItems[index].exp_before) || 0;
//     let disc = parseFloat(updatedItems[index].disc) || 0;
//     let manualDiscount = parseFloat(updatedItems[index].discount) || 0;
//     let per;
//     if (key === "discount") {
//       per = manualDiscount;
//     } else {
//       per = (disc / 100) * TotalAcc;
//       updatedItems[index]["discount"] = T21
//         ? Math.round(per).toFixed(2)
//         : per.toFixed(2);
//     }

//     // ✅ Convert to float for reliable calculation
//     per = parseFloat(per);
//     let Amounts = TotalAcc + per + others;

//     // Ensure TotalAcc is a valid number before calling toFixed()
//     TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;
//     // Check if GST number starts with "0" to "3"
//     let CompanyState = "punjab";
//     let CompanyState2 = "punjab";
//     let cgst, sgst, igst;
//     if (CompanyState == CompanyState2) {
//       cgst = (Amounts * (gst / 2)) / 100 || 0;
//       sgst = (Amounts * (gst / 2)) / 100 || 0;
//       igst = 0;
//     } else {
//       cgst = sgst = 0;
//       igst = (Amounts * gst) / 100 || 0;
//     }
//     // Set CGST and SGST to 0 if IGST is applied, and vice versa

//     // Calculate the total with GST and Others
//     let totalWithGST = Amounts + cgst + sgst + igst;
//     // Update CGST, SGST, Others, and total fields in the item
//     if (T21) {
//       if (key !== "discount") {
//         updatedItems[index]["discount"] = Math.round(per).toFixed(2);
//       }

//       // ❗ Only auto-calc amount if user is NOT typing in amount
//       if (key !== "amount") {
//         updatedItems[index]["amount"] = Math.round(TotalAcc).toFixed(2);
//       }

//       updatedItems[index]["vamt"] = Math.round(totalWithGST).toFixed(2);
//     } else {
//       if (key !== "discount") {
//         updatedItems[index]["discount"] = parseFloat(per).toFixed(2);
//       }

//       // ❗ Only auto-calc amount if user is NOT typing in amount
//       if (key !== "amount") {
//         updatedItems[index]["amount"] = TotalAcc.toFixed(2);
//       }

//       updatedItems[index]["vamt"] = totalWithGST.toFixed(2);
//     }

//     if (T12) {
//       updatedItems[index]["ctax"] = Math.round(cgst).toFixed(2);
//       updatedItems[index]["stax"] = Math.round(sgst).toFixed(2);
//       updatedItems[index]["itax"] = Math.round(igst).toFixed(2);
//     } else {
//       updatedItems[index]["ctax"] = cgst.toFixed(2);
//       updatedItems[index]["stax"] = sgst.toFixed(2);
//       updatedItems[index]["itax"] = igst.toFixed(2);
//     }
//     // Calculate the percentage of the value based on the GST percentage
//     const percentage = ((totalWithGST - Amounts) / TotalAcc) * 100;
//     updatedItems[index]["percentage"] = percentage.toFixed(2);
//     setItems(updatedItems);
//   };
//   return (
//     <div>
//       <div style={{ marginTop: 5 }} className="tablediv">
//         <Table className="custom-table">
//           <thead
//             style={{
//               background: "skyblue",
//               textAlign: "center",
//               position: "sticky",
//               top: 0,
//             }}
//           >
//             <tr style={{ color: "#575a5a" }}>
//               <th>ITEMCODE</th>
//               <th>DESCRIPTION</th>
//               <th>HSNCODE</th>
//               <th>PCS</th>
//               <th>QTY</th>
//               <th>RATE</th>
//               <th>AMOUNT</th>
//               <th>DIS@</th>
//               <th>DISCOUNT</th>
//               <th>CGST</th>
//               <th>SGST</th>
//               <th>IGST</th>
//               <th>TOTAL</th>
//             </tr>
//           </thead>
//           <tbody style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}>
//             {items.map((item, index) => (
//               <tr key={item.id}>
//                 <td style={{ padding: 0, width: 30 }}>
//                   <input
//                     className="ItemCode"
//                     style={{
//                       height: 40,

//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                     }}
//                     type="text"
//                     value={item.vcode}
//                     readOnly
//                   />
//                 </td>
//                 <td style={{ padding: 0, width: 300 }}>
//                   <input
//                     className="desc"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                     }}
//                     maxLength={48}
//                     value={item.sdisc}
//                     onChange={(e) =>
//                       handleItemChange(index, "sdisc", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Hsn"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     maxLength={8}
//                     value={item.tariff}
//                     onChange={(e) =>
//                       handleItemChange(index, "tariff", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="PCS"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     maxLength={48}
//                     value={item.pkgs} // Show raw value during input
//                     onChange={(e) =>
//                       handleItemChange(index, "pkgs", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="QTY"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     maxLength={48}
//                     value={item.weight} // Show raw value during input
//                     onChange={(e) =>
//                       handleItemChange(index, "weight", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Price"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     maxLength={48}
//                     value={item.rate} // Show raw value during input
//                     onChange={(e) =>
//                       handleItemChange(index, "rate", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Amount"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     maxLength={48}
//                     value={item.amount}
//                     onChange={(e) =>
//                       handleItemChange(index, "amount", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Disc"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     value={item.disc}
//                     onChange={(e) =>
//                       handleItemChange(index, "disc", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="discount"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     value={item.discount}
//                     onChange={(e) =>
//                       handleItemChange(index, "discount", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="CTax"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                       color: "black",
//                     }}
//                     maxLength={48}
//                     disabled
//                     value={item.ctax}
//                     onChange={(e) =>
//                       handleItemChange(index, "ctax", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="STax"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                       color: "black",
//                     }}
//                     maxLength={48}
//                     disabled
//                     value={item.stax}
//                     onChange={(e) =>
//                       handleItemChange(index, "stax", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="ITax"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                       color: "black",
//                     }}
//                     maxLength={48}
//                     disabled
//                     value={item.itax}
//                     onChange={(e) =>
//                       handleItemChange(index, "itax", e.target.value)
//                     }
//                   />
//                 </td>
//                 <td>{item.vamt}</td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
//     </div>
//   );
// };

// export default Example;

// import React, { useState } from "react";
// import Table from "react-bootstrap/Table";
// import ProductModalCustomer from "./Modals/ProductModalCustomer";

// const Example = () => {
//   const tenant = "shkun_05062025_05062026";
//   const [items, setItems] = useState([
//     {
//       id: "",
//       accountname: "",
//       narration: "",
//       debit: "",
//       credit: "",
//       disableDebit: false,
//       disableCredit: false,
//     },
//   ]);

//   const capitalizeWords = (str) => {
//     return str.replace(/\b\w/g, (char) => char.toUpperCase());
//   };

//   // Modal For Customer
//   const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
//   const [productsCus, setProductsCus] = useState([]);
//   const [showModalCus, setShowModalCus] = useState(false);
//   const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
//   const [loadingCus, setLoadingCus] = useState(true);
//   const [errorCus, setErrorCus] = useState(null);
//   const [suggestionRow, setSuggestionRow] = useState(null);
//   const [suggestionText, setSuggestionText] = useState("");

//   React.useEffect(() => {
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const response = await fetch(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount`,
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch products");
//       }
//       const data = await response.json();
//       // Ensure to extract the formData for easier access in the rest of your app
//       const formattedData = data.map((item) => ({
//         ...item.formData,
//         _id: item._id,
//       }));
//       setProductsCus(formattedData);
//       setLoadingCus(false);
//     } catch (error) {
//       setErrorCus(error.message);
//       setLoadingCus(false);
//     }
//   };

//   const handleItemChangeCus = (index, key, value) => {
//     const updatedItems = [...items];
//     updatedItems[index][key] = capitalizeWords(value); // Capitalize words here
//     // If the key is 'name', find the corresponding product and set the price
//     if (key === "name") {
//       const selectedProduct = productsCus.find(
//         (product) => product.ahead === value,
//       );
//       if (selectedProduct) {
//         updatedItems[index]["accountname"] = selectedProduct.ahead;
//         updatedItems[index]["acode"] = selectedProduct.acode;
//       }
//     }
//     // Disable credit field if debit field is filled
//     if (key === "debit") {
//       updatedItems[index]["disableCredit"] = !!value; // Convert value to boolean
//     }

//     // Disable debit field if credit field is filled
//     if (key === "credit") {
//       updatedItems[index]["disableDebit"] = !!value; // Convert value to boolean
//     }
//     if (key === "narration") {
//       const accountName = items[index].accountname || "";

//       if (
//         accountName &&
//         accountName.toLowerCase().startsWith(value.toLowerCase()) &&
//         value !== ""
//       ) {
//         setSuggestionRow(index);
//         setSuggestionText(accountName);
//       } else {
//         setSuggestionRow(null);
//         setSuggestionText("");
//       }
//     }

//     setItems(updatedItems);
//   };

//   const handleProductSelectCus = (product) => {
//     if (!product) {
//       alert("No product received!");
//       setShowModalCus(false);
//       return;
//     }

//     // clone the array
//     const newCustomers = [...items];

//     // overwrite the one at the selected index
//     newCustomers[selectedItemIndexCus] = {
//       ...newCustomers[selectedItemIndexCus],
//       accountname: product.ahead || "",
//       acode: product.acode,
//     };
//     const nameValue = product.ahead || product.name || "";
//     if (selectedItemIndexCus !== null) {
//       handleItemChangeCus(selectedItemIndexCus, "name", nameValue);
//       setShowModalCus(false);
//     }
//     setItems(newCustomers);
//     setShowModalCus(false);
//   };

//   const handleCloseModalCus = () => {
//     setShowModalCus(false);
//     setPressedKey(""); // resets for next modal open
//   };

//   const openModalForItemCus = (index) => {
//     setSelectedItemIndexCus(index);
//     setShowModalCus(true);
//   };

//   const allFieldsCus = productsCus.reduce((fields, product) => {
//     Object.keys(product).forEach((key) => {
//       if (!fields.includes(key)) {
//         fields.push(key);
//       }
//     });

//     return fields;
//   }, []);

//   const handleNumberChange = (event, index, field) => {
//     const value = event.target.value;

//     // Validate that the input is numeric
//     if (!/^\d*\.?\d*$/.test(value)) {
//       return;
//     }

//     const updatedItems = [...items];
//     updatedItems[index][field] = value;

//     // If the field is 'debit' and its value is greater than zero, disable 'credit'
//     if (field === "debit") {
//       updatedItems[index].disableCredit = parseFloat(value) > 0;
//       updatedItems[index].disableDebit = false; // Ensure 'debit' is not disabled
//     }
//     // If the field is 'credit' and its value is greater than zero, disable 'debit'
//     else if (field === "credit") {
//       updatedItems[index].disableDebit = parseFloat(value) > 0;
//       updatedItems[index].disableCredit = false; // Ensure 'credit' is not disabled
//     }
//     setItems(updatedItems);
//   };

//   const handleKeyDown = (event, index, field) => {
//     // Open Modal on Letter Input in Account Name
//     if (/^[a-zA-Z]$/.test(event.key) && field === "accountname") {
//       setPressedKey(event.key);
//       openModalForItemCus(index);
//       event.preventDefault();
//     }
//   };
//   return (
//     <div>
//       <div className="Tablesection">
//         <Table className="custom-table">
//           <thead>
//             <tr style={{ color: "white" }}>
//               <th>ACCOUNT NAME</th>
//               <th>NARRATION</th>
//               <th>DEBIT</th>
//               <th>CREDIT</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((item, index) => (
//               <tr key={`${item.accountname}-${index}`}>
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Account"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                     }}
//                     type="text"
//                     value={item.accountname}
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "accountname");
//                     }}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                   />
//                 </td>
//                 <td style={{ padding: 0, position: "relative" }}>
//                   <input
//                     className="Narration"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: "5px 8px",
//                       fontSize: "14px",
//                       position: "relative",
//                       background: "transparent",
//                     }}
//                     value={item.narration}
//                     onChange={(e) =>
//                       handleItemChangeCus(index, "narration", e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       if (
//                         e.key === "Tab" &&
//                         suggestionRow === index &&
//                         suggestionText
//                       ) {
//                         e.preventDefault();

//                         const updatedItems = [...items];
//                         updatedItems[index].narration = suggestionText;
//                         setItems(updatedItems);

//                         setSuggestionRow(null);
//                         setSuggestionText("");
//                       }
//                     }}
//                   />

//                   {/* 👇 Show only remaining text */}
//                   {suggestionRow === index && suggestionText && (
//                     <div
//                       style={{
//                         position: "absolute",
//                         top: 0,
//                         left: 8,
//                         height: "100%",
//                         display: "flex",
//                         alignItems: "center",
//                         color: "#bbb",
//                         fontSize: "14px",
//                         pointerEvents: "none",
//                       }}
//                     >
//                       <span style={{ visibility: "hidden" }}>
//                         {item.narration}
//                       </span>
//                       <span>{suggestionText.slice(item.narration.length)}</span>
//                     </div>
//                   )}
//                 </td>

//                 <td style={{ padding: 0, width: 250 }}>
//                   <input
//                     className="Debit"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       paddingRight: 10,
//                     }}
//                     value={Number(item.debit) === 0 ? "" : item.debit}
//                     onChange={(e) => handleNumberChange(e, index, "debit")}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                   />
//                 </td>
//                 <td style={{ padding: 0, width: 250 }}>
//                   <input
//                     className="Credits"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       paddingRight: 10,
//                     }}
//                     value={Number(item.credit) === 0 ? "" : item.credit}
//                     onChange={(e) => handleNumberChange(e, index, "credit")}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//         {showModalCus && (
//           <ProductModalCustomer
//             allFields={allFieldsCus}
//             onSelect={handleProductSelectCus}
//             onClose={handleCloseModalCus}
//             initialKey={pressedKey}
//             tenant={tenant}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Example;


import React, {useState, useRef} from 'react'
import { TextField, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { toast } from 'react-toastify';
import { useEditMode } from '../EditModeContext';

const Example = () => {

  const { isEditMode, setIsEditMode } = useEditMode(); // Access the context
  const [isDisabled, setIsDisabled] = useState(true); // State to track field disablement
  const inputRefs = useRef([]); // Array to hold references for input fields
  const [formData, setFormData] = useState({
    distt: "",
    state:"",
  });
  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  const HandleValueChange = (event) => {
    const { id, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [id]:  capitalizeWords(value),
    }));
  };

  const handlechangeState = (event) => {
    const selectedState = event.target.value;
    const gstStateCode = formData.gstNo?.slice(0, 2); // Extract state code from GST
    
    // Allow "Export" to be selected manually
    if (selectedState === "Export") {
      setFormData((prevState) => ({
        ...prevState,
        state: selectedState,
      }));
      return;
    }
  
    // If GST code is empty or invalid, allow any state selection
    if (!gstStateCode || !stateCodes[gstStateCode]) {
      setFormData((prevState) => ({
        ...prevState,
        state: selectedState,
      }));
      return;
    }
  
    // Prevent wrong state selection if GST code is present and valid
    if (stateCodes[gstStateCode] !== selectedState) {
      toast.error("State does not match GST Number!", { autoClose: 2000 });
      return;
    }
  
    setFormData((prevState) => ({
      ...prevState,
      state: selectedState,
    }));
  };

  const handleKeyDown = (e, index) => {
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        let nextIndex = index + 1;

        while (inputRefs.current[nextIndex] && inputRefs.current[nextIndex].disabled) {
          nextIndex += 1;
        }

        const nextInput = inputRefs.current[nextIndex];
        if (nextInput) {
          nextInput.focus();
        }
      }

      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        let prevIndex = index - 1;

        while (inputRefs.current[prevIndex] && inputRefs.current[prevIndex].disabled) {
          prevIndex -= 1;
        }

        const prevInput = inputRefs.current[prevIndex];
        if (prevInput) {
          prevInput.focus();
        }
      }
  };
    const stateCodes = {
    "01": "Jammu & Kashmir",
    "02": "Himachal Pradesh",
    "03": "Punjab",
    "04": "Chandigarh",
    "05": "Uttarakhand",
    "06": "Haryana",
    "07": "Delhi",
    "08": "Rajasthan",
    "09": "Uttar Pradesh",
    "10": "Bihar",
    "11": "Sikkim",
    "12": "Arunachal Pradesh",
    "13": "Nagaland",
    "14": "Manipur",
    "15": "Mizoram",
    "16": "Tripura",
    "17": "Meghalaya",
    "18": "Assam",
    "19": "West Bengal",
    "20": "Jharkhand",
    "21": "Odisha",
    "22": "Chhattisgarh",
    "23": "Madhya Pradesh",
    "24": "Gujarat",
    "25": "Daman and Diu",
    "26": "Dadra and Nagar Haveli",
    "27": "Maharashtra",
    "28": "Andhra Pradesh",
    "29": "Karnataka",
    "30": "Goa",
    "31": "Lakshadweep",
    "32": "Kerala",
    "33": "Tamil Nadu",
    "34": "Puducherry",
    "35": "Andaman & Nicobar Islands",
    "36": "Telangana",
    "37": "Andhra Pradesh (New)",
    "38": "Ladakh",
    " " : "Export"
  };
  return (
    <div>
      <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
      <div>
        <TextField
        className="custom-bordered-input"
        id="distt"
        value={formData.distt}
        variant="filled"
        size="small"
        label="DISTT"
        onChange={HandleValueChange}
        inputRef={(el) => (inputRefs.current[6] = el)}
        onKeyDown={(e) => handleKeyDown(e, 6)} // Handle Enter key
        inputProps={{
          maxLength: 48,
          style: {
            height: "15px",
            fontSize: 16,
            // padding: "0 8px"
          },
          readOnly: !isEditMode || isDisabled
        }}
        sx={{ width: 300 }}
      />
      </div>
      <div>
      <FormControl
        className="custom-bordered-input"
        fullWidth
        size="small"
        variant="filled"
        sx={{ minWidth: 280 }}
      >
        <InputLabel
          id="state-label"
          sx={{
            color: formData.state ? "black" : "gray",
          }}
        >
          State
        </InputLabel>

        <Select
          className="custom-bordered-input"
          labelId="state-label"
          id="state"
          name="state"
          value={formData.state}
          onChange={(e) => {
            if (!isEditMode || isDisabled) return;
            handlechangeState(e);
          }}
          onOpen={(e) => {
            if (!isEditMode || isDisabled) {
              e.preventDefault();
            }
          }}
          inputRef={(el) => (inputRefs.current[7] = el)}
          onKeyDown={(e) => handleKeyDown(e, 7)} // Handle Enter key
          label="State"
          sx={{
            backgroundColor: (!isEditMode || isDisabled) ? "#f0f0f0" : "white",
            pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto",
            fontSize: 16,
            color: formData.state ? "black" : "gray",
            height: "42px",
          }}
          MenuProps={{
            sx: {
              zIndex: 200000,   // <<< FIX: dropdown above modal
            },
            PaperProps: {
              sx: {
                zIndex: 200000, // <<< also set for the menu paper
              },
            },
          }}
        >
          <MenuItem value="">
            <em>Select State</em>
          </MenuItem>

          {Object.values(stateCodes).map((state, index) => (
            <MenuItem key={index} value={state}>
              {state}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      </div>
      </div>
    </div>
  )
}

export default Example
