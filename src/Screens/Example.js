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

import React,{useState} from "react";
import InputMask from "react-input-mask";

const Example = () => {
  const [formData, setFormData] = useState({
    date: "",
    vtype: "P",
    vno: 0,
    vbillno: 0,
    vbdate: "",
  });
  return (
    <div>
      <InputMask
        mask="99-99-9999"
        placeholder="dd-mm-yyyy"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
      >
        {(inputProps) => (
          <input
            {...inputProps}
            className="DatePICKER"
          />
        )}
      </InputMask>
      <InputMask
        mask="99-99-9999"
        value={formData.vbdate}
        onChange={(e) =>
          setFormData({ ...formData, vbdate: e.target.value })
        }
      >
        {(inputProps) => (
          <input
            {...inputProps}
            style={{marginTop:5}}
            className="erp-field3 custom-style3"
          />
        )}
      </InputMask>
    </div>
  );
};

export default Example;
