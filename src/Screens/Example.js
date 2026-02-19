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

// SALE TABLE
// import React, { useState, useEffect } from "react";
// import Table from "react-bootstrap/Table";
// import ProductModal from "./Modals/ProductModal";
// import Button from "react-bootstrap/Button";
// import axios from "axios";

// const Example = () => {
//   const tenant = "shkun_05062025_05062026";
//   const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
//   const LOCAL_STORAGE_KEY = "tabledataVisibility";
//   const [T11, setT11] = useState(false);
//   const [T12, setT12] = useState(false);
//   const [T21, setT21] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(null);
//   const [isModalOpenExp, setIsModalOpenExp] = useState(false);
  
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
//   const capitalizeWords = (str) => {
//     return str.replace(/\b\w/g, (char) => char.toUpperCase());
//   };
//     React.useEffect(() => {
//       // Fetch products from the API when the component mounts
//       fetchProducts();
//     }, []);
  
//     const fetchProducts = async (search = "") => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/stockmaster?search=${encodeURIComponent(search)}`,
//         );
//         if (!response.ok) throw new Error("Failed to fetch products");
//         const data = await response.json();
//         const flattenedData = data.data.map((item) => ({
//           ...item.formData,
//           _id: item._id,
//         }));
//         setProducts(flattenedData);
//       } catch (error) {
//         setError(error.message);
//       }
//       setLoading(false);
//     };
  
//     // Modal For Items
//     const [showModal, setShowModal] = useState(false);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [selectedItemIndex, setSelectedItemIndex] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
  
//     const handleItemChange = (index, key, value, field) => {
//       // If key is "pkgs" or "weight", allow only numbers and a single decimal point
//       if (
//         (key === "pkgs" ||
//           key === "weight" ||
//           key === "tariff" ||
//           key === "rate" ||
//           key === "disc" ||
//           key === "discount" || key === "amount") &&
//         !/^-?\d*\.?\d*$/.test(value)
//       ) {
//         return; // reject invalid input
//       }

//       // Always force disc/discount to be negative
//       if (key === "disc" || key === "discount") {
//         const numeric = parseFloat(value);
//         if (!isNaN(numeric)) {
//           value = -Math.abs(numeric); // Force negative
//         }
//       }

//       const updatedItems = [...items];
//       if (["sdisc"].includes(key)) {
//         updatedItems[index][key] = capitalizeWords(value);
//       } else {
//         updatedItems[index][key] = value;
//       }

//       // If the key is 'name', find the corresponding product and set the price
//       if (key === "name") {
//         const selectedProduct = products.find(
//           (product) => product.Aheads === value,
//         );

//         if (selectedProduct) {
//           // ✅ Always update these
//           updatedItems[index]["vcode"] = selectedProduct.Acodes;
//           updatedItems[index]["sdisc"] = selectedProduct.Aheads;

//           // ⬇️ Normal mode (unchanged)
//           updatedItems[index]["Units"] = selectedProduct.TradeName;
//           updatedItems[index]["rate"] = selectedProduct.Mrps;
//           updatedItems[index]["gst"] = selectedProduct.itax_rate;
//           updatedItems[index]["tariff"] = selectedProduct.Hsn;
//           updatedItems[index]["Scodes01"] = selectedProduct.Scodes01;
//           updatedItems[index]["Scodess"] = selectedProduct.Scodess;
//           updatedItems[index]["Pcodes01"] = selectedProduct.Pcodes01;
//           updatedItems[index]["Pcodess"] = selectedProduct.Pcodess;
//           updatedItems[index]["RateCal"] = selectedProduct.Rateins;
//           updatedItems[index]["Qtyperpc"] = selectedProduct.Qpps || 0;
//           updatedItems[index]["curMrp"] = selectedProduct.Mrps || 0;
//         }
//       }

//       let pkgs = parseFloat(updatedItems[index].pkgs);
//       pkgs = isNaN(pkgs) ? 0 : pkgs;

//       let Qtyperpkgs = parseFloat(updatedItems[index].Qtyperpc);
//       Qtyperpkgs = isNaN(Qtyperpkgs) ? 0 : Qtyperpkgs;


//       let AL = pkgs * Qtyperpkgs || 0;
//       let gst = parseFloat(updatedItems[index].gst) || 0;
//       if (pkgs > 0 && Qtyperpkgs > 0 && key !== "weight") {
//         updatedItems[index]["weight"] = AL.toFixed(2);
//       }
  
//       let weight = parseFloat(updatedItems[index].weight);
//       weight = isNaN(weight) ? 0 : weight;

//       const pkgsVal = parseFloat(updatedItems[index].pkgs) || 0;
//       const rate = parseFloat(updatedItems[index].rate) || 0;

//       const totalAccordingWeight = weight * rate;
//       const totalAccordingPkgs = pkgsVal * rate;

//       let RateCal = updatedItems[index].RateCal;
//       let TotalAcc = totalAccordingWeight; // Set a default value

//       // Calcuate the Amount According to RateCalculation field
//       if (
//         RateCal === "Default" ||
//         RateCal === "" ||
//         RateCal === null ||
//         RateCal === undefined
//       ) {
//         TotalAcc = totalAccordingWeight;
//       } else if (RateCal === "Wt/Qty") {
//         TotalAcc = totalAccordingWeight;
//         // console.log("totalAccordingWeight");
//       } else if (RateCal === "Pc/Pkgs") {
//         TotalAcc = totalAccordingPkgs;
//         // console.log("totalAccordingPkgs");
//       }
//       // 🔥 If user manually edits amount → recalculate rate
//       if (
//         key === "amount" &&
//         value !== "" &&
//         !isNaN(parseFloat(value)) &&
//         !value.endsWith(".")
//       ) {
//         let enteredAmount = parseFloat(value);
//         let qty = 0;

//         if (RateCal === "Pc/Pkgs") {
//           qty = parseFloat(updatedItems[index].pkgs) || 0;
//         } else {
//           qty = parseFloat(updatedItems[index].weight) || 0;
//         }

//         const currentMrp = parseFloat(updatedItems[index].curMrp);

//         // // ✅ STOP if MRP exists and is valid (> 0)
//         if (!isNaN(currentMrp) && currentMrp > 0) {
//           return; // ❌ Do not recalculate rate
//         }

//         // Otherwise recalc rate
//         if (qty > 0 && enteredAmount > 0) {
//           let newRate = enteredAmount / qty;

//           updatedItems[index]["rate"] = T21
//             ? Math.round(newRate).toFixed(2)
//             : newRate.toFixed(2);

//           TotalAcc = enteredAmount;
//         }
//       }

//       // Ensure TotalAcc is a valid number before calling toFixed()
//       TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;

//       let others = parseFloat(updatedItems[index].exp_before) || 0;
//       let disc = parseFloat(updatedItems[index].disc) || 0;
//       let manualDiscount = parseFloat(updatedItems[index].discount) || 0;
//       let per;
//       if (key === "discount") {
//         per = manualDiscount;
//       } else {
//         per = (disc / 100) * TotalAcc;
//         updatedItems[index]["discount"] = T21
//           ? Math.round(per).toFixed(2)
//           : per.toFixed(2);
//       }

//       // ✅ Convert to float for reliable calculation
//       per = parseFloat(per);
//       let Amounts = TotalAcc + per + others;

//       // Ensure TotalAcc is a valid number before calling toFixed()
//       // TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;
//       // Check if GST number starts with "0" to "3"
//       let cgst, sgst, igst;
//       let CompanyState = "Punjab"; 
//       if (CompanyState === "Punjab") {
//         cgst = (Amounts * (gst / 2)) / 100 || 0;
//         sgst = (Amounts * (gst / 2)) / 100 || 0;
//         igst = 0;
//       } else {
//         cgst = sgst = 0;
//         igst = (Amounts * gst) / 100 || 0;
//       }

//       // Calculate the total with GST and Others
//       let totalWithGST = Amounts + cgst + sgst + igst;
//       // Update CGST, SGST, Others, and total fields in the item
//       if (T21) {
//         if (key !== "discount") {
//           updatedItems[index]["discount"] = Math.round(per).toFixed(2);
//         }

//         if (key !== "amount") {
//           updatedItems[index]["amount"] = Math.round(TotalAcc).toFixed(2);
//         }

//         updatedItems[index]["vamt"] = Math.round(totalWithGST).toFixed(2);
//       } else {
//         if (key !== "discount") {
//           updatedItems[index]["discount"] = parseFloat(per).toFixed(2);
//         }

//         if (key !== "amount") {
//           updatedItems[index]["amount"] = TotalAcc.toFixed(2);
//         }

//         updatedItems[index]["vamt"] = totalWithGST.toFixed(2);
//       }
//       if (T12) {
//         updatedItems[index]["ctax"] = Math.round(cgst).toFixed(2);
//         updatedItems[index]["stax"] = Math.round(sgst).toFixed(2);
//         updatedItems[index]["itax"] = Math.round(igst).toFixed(2);
//       } else {
//         updatedItems[index]["ctax"] = cgst.toFixed(2);
//         updatedItems[index]["stax"] = sgst.toFixed(2);
//         updatedItems[index]["itax"] = igst.toFixed(2);
//       }
//       // Calculate the percentage of the value based on the GST percentage
//       const percentage = TotalAcc > 0 ? ((totalWithGST - Amounts) / TotalAcc) * 100 : 0;
//       updatedItems[index]["percentage"] = percentage.toFixed(2);
//       setItems(updatedItems);
//       // calculateTotalGst();
//     };
  
//     const handleProductSelect = (product) => {
//       if (selectedItemIndex !== null) {
//         handleItemChange(selectedItemIndex, "name", product.Aheads);
//         setShowModal(false);
//       }
//     };
  
//     const handleModalDone = (product) => {
//       if (product) {
//         // console.log(product);
//         handleProductSelect(product);
//       }
//       setShowModal(false);
//       // fetchProducts();
//     };
  
//     const openModalForItem = (index) => {
//         setSelectedItemIndex(index);
//         setShowModal(true);
//     };
  
//     const allFields = products.length
//       ? Object.keys(products[0])
//       : ["Aheads", "Pcodes01", "UOM", "GST"]; // fallback/default fields

//     const handleInputChange = (index, field, value) => {
//       const numericValue =
//         typeof value === "string"
//           ? value.replace(/[^0-9.-]/g, "")
//           : value;

//       const updatedItems = [...items];
//       updatedItems[index][field] = numericValue;

//       setItems(updatedItems);
//     };

//     const handleExpenseBlur = (index, field) => {
//       const updatedItems = [...items];
//       const item = updatedItems[index];

//       const vamt = parseFloat(item.amount) || 0;

//       const expMap = [
//         { rate: "Exp_rate1", val: "Exp1" },
//         { rate: "Exp_rate2", val: "Exp2" },
//         { rate: "Exp_rate3", val: "Exp3" },
//         { rate: "Exp_rate4", val: "Exp4" },
//         { rate: "Exp_rate5", val: "Exp5" },
//       ];

//       expMap.forEach(({ rate, val }) => {
//         if (field === rate && vamt > 0) {
//           const r = parseFloat(item[rate]) || 0;
//           item[val] = ((vamt * r) / 100).toFixed(2);
//         }

//         if (field === val && vamt > 0) {
//           const v = parseFloat(item[val]) || 0;
//           item[rate] = ((v / vamt) * 100).toFixed(2);
//         }
//       });

//       setItems(updatedItems);
//     };


//     useEffect(() => {
//       if (currentIndex !== null && items[currentIndex]) {
//         const updatedItems = [...items];
//         const item = { ...updatedItems[currentIndex] };
  
//         const vamt = parseFloat(item.amount) || 0;
//         const pkgs = parseFloat(item.pkgs) || 0;
//         const weight = parseFloat(item.weight) || 0;
//         // Expense Calculations (Separate Logic for Each Expense)
//         let Exp1 = 0, Exp2 = 0,Exp3 = 0, Exp4 = 0, Exp5 = 0;
//         let CalExp1 ="V", CalExp2 = "V", CalExp3 = "V", CalExp4 = "V", CalExp5 = "V";
//         if (item.Exp_rate1) {
//           if (CalExp1 === "W" || CalExp1 === "w") {
//             Exp1 = (weight * parseFloat(item.Exp_rate1)) / 100;
//           } else if (CalExp1 === "P" || CalExp1 === "p") {
//             Exp1 = (pkgs * parseFloat(item.Exp_rate1)) / 100;
//           } else if (CalExp1 === "V" || CalExp1 === "v" || CalExp1 === "") {
//             Exp1 = (vamt * parseFloat(item.Exp_rate1)) / 100;
//           }
//           item.Exp1 = Exp1.toFixed(2);
//         } else {
//           item.Exp1 = "0.00";
//         }
  
//         if (item.Exp_rate2) {
//           if (CalExp2 === "W" || CalExp2 === "w") {
//             Exp2 = (weight * parseFloat(item.Exp_rate2)) / 100;
//           } else if (CalExp2 === "P" || CalExp2 === "p") {
//             Exp2 = (pkgs * parseFloat(item.Exp_rate2)) / 100;
//           } else if (CalExp2 === "V" || CalExp2 === "v" || CalExp2 === "") {
//             Exp2 = (vamt * parseFloat(item.Exp_rate2)) / 100;
//           }
//           item.Exp2 = Exp2.toFixed(2);
//         } else {
//           item.Exp2 = "0.00";
//         }
  
//         if (item.Exp_rate3) {
//           if (CalExp3 === "W" || CalExp3 === "w") {
//             Exp3 = (weight * parseFloat(item.Exp_rate3)) / 100;
//           } else if (CalExp3 === "P" || CalExp3 === "p") {
//             Exp3 = (pkgs * parseFloat(item.Exp_rate3)) / 100;
//           } else if (CalExp3 === "V" || CalExp3 === "v" || CalExp3 === "") {
//             Exp3 = (vamt * parseFloat(item.Exp_rate3)) / 100;
//           }
//           item.Exp3 = Exp3.toFixed(2);
//         } else {
//           item.Exp3 = "0.00";
//         }
  
//         if (item.Exp_rate4) {
//           if (CalExp4 === "W" || CalExp4 === "w") {
//             Exp4 = (weight * parseFloat(item.Exp_rate4)) / 100;
//           } else if (CalExp4 === "P" || CalExp4 === "p") {
//             Exp4 = (pkgs * parseFloat(item.Exp_rate4)) / 100;
//           } else if (CalExp4 === "V" || CalExp4 === "v" || CalExp4 === "") {
//             Exp4 = (vamt * parseFloat(item.Exp_rate4)) / 100;
//           }
//           item.Exp4 = Exp4.toFixed(2);
//         } else {
//           item.Exp4 = "0.00";
//         }
  
//         if (item.Exp_rate5) {
//           if (CalExp5 === "W" || CalExp5 === "w") {
//             Exp5 = (weight * parseFloat(item.Exp_rate5)) / 100;
//           } else if (CalExp5 === "P" || CalExp5 === "p") {
//             Exp5 = (pkgs * parseFloat(item.Exp_rate5)) / 100;
//           } else if (CalExp5 === "V" || CalExp5 === "v" || CalExp5 === "") {
//             Exp5 = (vamt * parseFloat(item.Exp_rate5)) / 100;
//           }
//           item.Exp5 = Exp5.toFixed(2);
//         } else {
//           item.Exp5 = "0.00";
//         }
  
//         // Total Expense Before GST
//         const totalExpenses = Exp1 + Exp2 + Exp3 + Exp4 + Exp5;
//         item.exp_before = totalExpenses.toFixed(2);
  
//         // GST & Total Calculations
//         const gst = parseFloat(item.gst) || 0;
//         const totalAccordingWeight =
//           (parseFloat(item.weight) || 0) * (parseFloat(item.rate) || 0);
//         const totalAccordingPkgs =
//           (parseFloat(item.pkgs) || 0) * (parseFloat(item.rate) || 0);
//         let RateCal = item.RateCal;
//         let TotalAcc =
//           RateCal === "Pc/Pkgs" ? totalAccordingPkgs : totalAccordingWeight;
  
//         let disc = parseFloat(item.disc) || 0;
//         let per = ((disc / 100) * TotalAcc).toFixed(2);
//         let PerCenTage = parseFloat(per);
//         let Amounts = TotalAcc + totalExpenses + parseFloat(per);
  
//         TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;
  
//         // GST Logic Based on State
//         let cgst = 0, sgst = 0, igst = 0;
//         let CompanyState = "Punjab"; // Replace with actual state logic
  
//         if (CompanyState === 'Punjab') {
//           cgst = (Amounts * (gst / 2)) / 100;
//           sgst = (Amounts * (gst / 2)) / 100;
//         } else {
//           igst = (Amounts * gst) / 100;
//         }
  
//         // Final Total Calculation
//         const totalWithGST = Amounts + cgst + sgst + igst;
//         if (T12) {
//           item.ctax = Math.round(cgst).toFixed(2);
//           item.stax = Math.round(sgst).toFixed(2);
//           item.itax = Math.round(igst).toFixed(2);
//           item.discount = Math.round(PerCenTage).toFixed(2);
//           item.vamt = Math.round(totalWithGST).toFixed(2);
//         } else {
//           item.ctax = cgst.toFixed(2);
//           item.stax = sgst.toFixed(2);
//           item.itax = igst.toFixed(2);
//           item.discount = PerCenTage.toFixed(2);
//           item.vamt = totalWithGST.toFixed(2);
//         }
//         updatedItems[currentIndex] = item;
//         setItems(updatedItems);
//       }
//     }, [
//       currentIndex,
//       items[currentIndex]?.amount,
//       items[currentIndex]?.Exp_rate1,
//       items[currentIndex]?.Exp_rate2,
//       items[currentIndex]?.Exp_rate3,
//       items[currentIndex]?.Exp_rate4,
//       items[currentIndex]?.Exp_rate5,
//       items[currentIndex]?.gst,
//       items[currentIndex]?.weight,
//       items[currentIndex]?.rate,
//       items[currentIndex]?.pkgs,
//       items[currentIndex]?.RateCal,
//     ]);

//     const defaultTableFields = {
//       itemcode: true,
//       sdisc: true,
//       hsncode: true,
//       pcs: true,
//       qty: true,
//       rate: true,
//       amount: true,
//       discount: false,
//       others: true,
//       gst: false,
//       cgst: true,
//       sgst: true,
//       igst: true,
//     };
  
//     const [tableData, settableData] = useState(() => {
//       const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//       const parsed = saved ? JSON.parse(saved) : {};
  
//       // Only keep keys that exist in defaultFormData
//       const sanitized = Object.fromEntries(
//         Object.entries({ ...defaultTableFields, ...parsed }).filter(([key]) =>
//           Object.hasOwn(defaultTableFields, key),
//         ),
//       );
  
//       return sanitized;
//     });

//   const handleOpenModal = (event, index, field) => {
//     if (/^[a-zA-Z]$/.test(event.key) && field === "vcode") {
//       setPressedKey(event.key); // Set the pressed key
//       openModalForItem(index);
//       event.preventDefault(); // Prevent any default action
//     }
//   };

//     const handleDoubleClick = (event, fieldName, index) => {
//       if (fieldName === "exp_before") {
//         setCurrentIndex(index); // Set the current index
//         setIsModalOpenExp(true); // Open the modal
//         event.preventDefault();
//       }
//       if ( fieldName === "vcode") {
//       setSelectedItemIndex(index);
//       setShowModal(true);
//       event.preventDefault();
//     }
//     };
//   return (
//     <div>
//       <div style={{ marginTop: 5 }} className="tablediv">
//          <Table className="custom-table">
//             <thead
//               style={{
//                 textAlign: "center",
//                 position: "sticky",
//                 top: 0,
//               }}
//             >
//               <tr style={{ color: "#575a5a" }}>
//                 {tableData.itemcode && <th>ITEMCODE</th>}
//                 {tableData.sdisc && <th>DESCRIPTION</th>}
//                 {tableData.hsncode && <th>HSNCODE</th>}
//                 {tableData.pcs && <th>PCS</th>}
//                 {tableData.qty && <th>QTY</th>}
//                 {tableData.rate && <th>RATE</th>}
//                 {tableData.amount && <th>AMOUNT</th>}
//                 {tableData.discount && <th>DIS@</th>}
//                 {tableData.discount && <th>DISCOUNT</th>}
//                 {tableData.others && <th>OTHERS</th>}
//                 {tableData.cgst && <th>CGST</th>}
//                 {tableData.sgst && <th>SGST</th>}
//                 {tableData.igst && <th>IGST</th>}
//                 <th>VAmt</th>
//               </tr>
//             </thead>
//             <tbody style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}>
//               {items.map((item, index) => (
//                 <tr key={item.id}>
//                   {tableData.itemcode && (
//                     <td style={{ padding: 0, width: 30 }}>
//                       <input
//                         className="ItemCode"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                         }}
//                         type="text"
//                         value={item.vcode}
//                         onKeyDown={(e) => {
//                         handleOpenModal(e, index, "vcode");
//                       }}
//                         onDoubleClick={(e) => {
//                           handleDoubleClick(e, "vcode", index);
//                         }}
//                       />
//                     </td>
//                   )}
//                   {tableData.sdisc && (
//                     <td style={{ padding: 0, width: 300 }}>
//                       <input
//                         className="desc"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                         }}
//                         maxLength={48}
//                         value={item.sdisc}
//                         onChange={(e) =>
//                           handleItemChange(index, "sdisc", e.target.value)
//                         }
//                       />
//                     </td>
//                   )}
//                   {tableData.hsncode && (
//                     <td style={{ padding: 0 }}>
//                       <input
//                         className="Hsn"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                           textAlign: "right",
//                         }}
//                         maxLength={8}
//                         value={item.tariff}
//                         onChange={(e) =>
//                           handleItemChange(index, "tariff", e.target.value)
//                         }
//                       />
//                     </td>
//                   )}
//                   {tableData.pcs && (
//                     <td style={{ padding: 0 }}>
//                       <input
//                         className="PCS"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                           textAlign: "right",
//                         }}
//                         maxLength={48}
//                         value={Number(item.pkgs) === 0 ? "" : item.pkgs}
//                         onChange={(e) =>
//                           handleItemChange(index, "pkgs", e.target.value)
//                         }
//                       />
//                     </td>
//                   )}
//                   {tableData.qty && (
//                     <td style={{ padding: 0 }}>
//                       <input
//                         className="QTY"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                           textAlign: "right",
//                         }}
//                         maxLength={48}
//                         value={Number(item.weight) === 0 ? "" : item.weight}
//                         onChange={(e) =>
//                           handleItemChange(index, "weight", e.target.value)
//                         }
//                       />
//                     </td>
//                   )}
//                   {tableData.rate && (
//                     <td style={{ padding: 0 }}>
//                       <input
//                         className="Price"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                           textAlign: "right",
//                         }}
//                         maxLength={48}
//                         value={Number(item.rate) === 0 ? "" : item.rate}
//                         onChange={(e) =>
//                           handleItemChange(index, "rate", e.target.value)
//                         }
//                       />
//                     </td>
//                   )}
//                   {tableData.amount && (
//                     <td style={{ padding: 0 }}>
//                       <input
//                         className="Amount"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                           textAlign: "right",
//                         }}
//                         maxLength={48}
//                         value={Number(item.amount) === 0 ? "" : item.amount}
//                         onChange={(e) =>
//                           handleItemChange(index, "amount", e.target.value)
//                         }
//                       />
//                     </td>
//                   )}
//                   {tableData.discount && (
//                     <td style={{ padding: 0 }}>
//                       <input
//                         className="Disc"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                           textAlign: "right",
//                         }}
//                         value={Number(item.disc) === 0 ? "" : item.disc}
//                         onChange={(e) =>
//                           handleItemChange(index, "disc", e.target.value)
//                         }
//                       />
//                     </td>
//                   )}
//                   {tableData.discount && (
//                     <td style={{ padding: 0 }}>
//                       <input
//                         id="discount"
//                         className="discount"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                           textAlign: "right",
//                         }}
//                         value={Number(item.discount) === 0 ? "" : item.discount}
//                         onChange={(e) =>
//                           handleItemChange(index, "discount", e.target.value)
//                         }
//                       />
//                     </td>
//                   )}
//                   {tableData.others && (
//                     <td style={{ padding: 0 }}>
//                       <input
//                         className="Others"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                           textAlign: "right",
//                         }}
//                         maxLength={48}
//                         type="text"
//                         value={
//                           Number(item.exp_before) === 0 ? "" : item.exp_before
//                         }
//                         onDoubleClick={(e) =>
//                           handleDoubleClick(e, "exp_before", index)
//                         }
//                       />
//                     </td>
//                   )}
//                   {isModalOpenExp && currentIndex !== null && (
//                     <div className="Modalz">
//                       <div className="Modal-content">
//                         <h1 className="headingE">ADD/LESS BEFORE GST</h1>
//                         <div className="form-group">
//                           <input
//                             type="checkbox"
//                             id="gross"
//                             checked={items[currentIndex]?.gross || false}
//                             onChange={(e) =>
//                               handleInputChange(
//                                 currentIndex,
//                                 "gross",
//                                 e.target.checked,
//                               )
//                             }
//                           />
//                           <label
//                             style={{ marginLeft: 5 }}
//                             className="label"
//                             htmlFor="Gross"
//                           >
//                             GROSS
//                           </label>
//                         </div>
//                         {[
//                           { label: "Labour", rate: "Exp_rate1", value: "Exp1" },
//                           { label: "Freight", rate: "Exp_rate2", value: "Exp2" },
//                           { label: "Discount", rate: "Exp_rate3", value: "Exp3" },
//                           { label: "Commm", rate: "Exp_rate4", value: "Exp4" },
//                           { label: "Dalla", rate: "Exp_rate5", value: "Exp5" },
//                         ].map((field, idx) => (
//                           <div
//                             key={idx}
//                             style={{
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "space-between",
//                               gap: "10px", // Spacing between items
//                               marginBottom: "10px", // Space between rows
//                             }}
//                           >
//                             <label style={{ width: "100px", fontWeight: "bold" }}>
//                               {field.label}
//                             </label>

//                             <input
//                               value={items[currentIndex][field.rate]}
//                               style={{
//                                 border: "1px solid black",
//                                 padding: "5px",
//                                 width: "120px",
//                                 textAlign: "right",
//                                 borderRadius: "4px",
//                               }}
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   currentIndex,
//                                   field.rate,
//                                   e.target.value,
//                                 )
//                               }
//                             />
//                             <input
//                               value={items[currentIndex][field.value]}
//                               style={{
//                                 border: "1px solid black",
//                                 padding: "5px",
//                                 width: "120px",
//                                 textAlign: "right",
//                                 borderRadius: "4px",
//                               }}
//                               onBlur={() =>
//                                 handleExpenseBlur(currentIndex, field.value)
//                               }
//                               onChange={(e) =>
//                                 handleInputChange(
//                                   currentIndex,
//                                   field.value,
//                                   e.target.value,
//                                 )
//                               }
//                             />
//                           </div>
//                         ))}
//                         <Button
//                           onClick={() => {
//                             const idx = currentIndex; // store before reset
//                             setIsModalOpenExp(false);
//                             setCurrentIndex(null);
//                           }}
//                           style={{
//                             borderColor: "transparent",
//                             backgroundColor: "red",
//                             marginTop: 10,
//                           }}
//                         >
//                           CLOSE
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                   {tableData.cgst && (
//                     <td style={{ padding: 0 }}>
//                       <input
//                         className="CTax"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                           textAlign: "right",
//                           color: "black",
//                         }}
//                         maxLength={48}
//                         disabled
//                         value={Number(item.ctax) === 0 ? "" : item.ctax}
//                         onChange={(e) =>
//                           handleItemChange(index, "ctax", e.target.value)
//                         }
//                       />
//                     </td>
//                   )}
//                   {tableData.sgst && (
//                     <td style={{ padding: 0 }}>
//                       <input
//                         className="STax"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                           textAlign: "right",
//                           color: "black",
//                         }}
//                         maxLength={48}
//                         disabled
//                         value={Number(item.stax) === 0 ? "" : item.stax}
//                         onChange={(e) =>handleItemChange(index, "stax", e.target.value)  }
//                       />
//                     </td>
//                   )}
//                   {tableData.igst && (
//                     <td style={{ padding: 0 }}>
//                       <input
//                         className="ITax"
//                         style={{
//                           height: 40,
//                           width: "100%",
//                           boxSizing: "border-box",
//                           border: "none",
//                           padding: 5,
//                           textAlign: "right",
//                           color: "black",
//                         }}
//                         maxLength={48}
//                         disabled
//                         value={Number(item.itax) === 0 ? "" : item.itax}
//                         onChange={(e) =>
//                           handleItemChange(index, "itax", e.target.value)
//                         }
//                       />
//                     </td>
//                   )}
//                   <td>{item.vamt}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//           {showModal && (
//             <ProductModal
//               products={products}
//               allFields={allFields}
//               onSelect={handleProductSelect}
//               onClose={handleModalDone}
//               tenant={tenant}
//               initialKey={pressedKey}
//               fetchParentProducts={fetchProducts}
//             />
//           )}
//       </div>
//     </div>
//   );
// };

// export default Example;

// import React, {useRef, useState} from 'react'
// import { TextField, Autocomplete } from '@mui/material';
// import useLedgerAccounts from './Shared/useLedgerAccounts';
// import { toast } from 'react-toastify';
// import AnexureModal from './Modals/AnexureModal ';
// import { Button } from 'react-bootstrap';
// import { useEditMode } from '../EditModeContext';

// const Example = () => {
//   const { isEditMode, setIsEditMode } = useEditMode(); // Access the context
//   const [showModal, setShowModal] = useState(false);
//   const { getUniqueValues, existingGstList, existingpanList, existingTdsList, existingAdharList, existingAccList, existingAcCodeList, ledgerData, fetchLedgerAccounts } = useLedgerAccounts(); // only using hook
//   const inputRefs = useRef([]); // Array to hold references for input fields
//   const [formData, setFormData] = useState({
//     Bsgroup: "",
//     Bscode:"",
//     group:"",
//     acode: "",
//     gstNo: "",
//     ahead: "",
//     add1: "",
//     add2: "",
//     irate: "",
//     tds_rate: "",
//     tcs_rate: "",
//     sur_rate: "",
//     weight: "",
//   });
//   const [toastOpen, setToastOpen] = useState(false); // Track if toast is open
//   const [initialLoadDone, setInitialLoadDone] = useState(false);
//   const capitalizeWords = (str) => {
//     return str.replace(/\b\w/g, (char) => char.toUpperCase());
//   };
//   // GST Validation
//   const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
//   const [isGstValid, setIsGstValid] = useState(true);

//   const stateCodes = {
//     "01": "Jammu & Kashmir",
//     "02": "Himachal Pradesh",
//     "03": "Punjab",
//     "04": "Chandigarh",
//     "05": "Uttarakhand",
//     "06": "Haryana",
//     "07": "Delhi",
//     "08": "Rajasthan",
//     "09": "Uttar Pradesh",
//     "10": "Bihar",
//     "11": "Sikkim",
//     "12": "Arunachal Pradesh",
//     "13": "Nagaland",
//     "14": "Manipur",
//     "15": "Mizoram",
//     "16": "Tripura",
//     "17": "Meghalaya",
//     "18": "Assam",
//     "19": "West Bengal",
//     "20": "Jharkhand",
//     "21": "Odisha",
//     "22": "Chhattisgarh",
//     "23": "Madhya Pradesh",
//     "24": "Gujarat",
//     "25": "Daman and Diu",
//     "26": "Dadra and Nagar Haveli",
//     "27": "Maharashtra",
//     "28": "Andhra Pradesh",
//     "29": "Karnataka",
//     "30": "Goa",
//     "31": "Lakshadweep",
//     "32": "Kerala",
//     "33": "Tamil Nadu",
//     "34": "Puducherry",
//     "35": "Andaman & Nicobar Islands",
//     "36": "Telangana",
//     "37": "Andhra Pradesh (New)",
//     "38": "Ladakh",
//     " " : "Export"
//   };

//   // Restrict invalid key presses
//   const handleKeyPress = (e) => {
//     const { value } = e.target;
//     const char = e.key.toUpperCase();
//     const pos = value.length;

//     const validPattern = [
//       /^[0-9]$/,            // 1st & 2nd: Digits
//       /^[0-9]$/,
//       /^[A-Z]$/,            // 3rd to 7th: Alphabets
//       /^[A-Z]$/,
//       /^[A-Z]$/,
//       /^[A-Z]$/,
//       /^[A-Z]$/,
//       /^[0-9]$/,            // 8th to 11th: Digits
//       /^[0-9]$/,
//       /^[0-9]$/,
//       /^[0-9]$/,
//       /^[A-Z]$/,            // 12th: Alphabet
//       /^[1-9A-Z]$/,         // 13th: Alphanumeric (1-9, A-Z)
//       /^Z$/,                // 14th: Always 'Z'
//       /^[0-9A-Z]$/          // 15th: Alphanumeric (0-9, A-Z)
//     ];

//     if (pos < 15 && !validPattern[pos].test(char)) {
//       e.preventDefault(); // Block invalid characters
//     }
//   };

//   const handleChangeGst = (e) => {
//     let value = e.target.value.toUpperCase(); // Force uppercase
//     if (value.length > 15) return; // Restrict length

//     const isValid = GST_REGEX.test(value);  
//     const isDuplicate = existingGstList.includes(value);
//     setIsGstValid(isValid);

//     let updatedState = "";
//     let extractedPan = "";

//     if (value.length >= 2) {
//       const stateCode = value.slice(0, 2);
//       updatedState = stateCodes[stateCode] || "";
//     }

//     // Extract PAN when GST is valid
//     if (value.length === 15 && isValid) {
//       extractedPan = value.substring(2, 12); // PAN is from 3rd to 12th character
//     }

//     setFormData((prev) => ({
//       ...prev,
//       gstNo: value,
//       state: updatedState,
//       pan: extractedPan,
//     }));

//     // Show toast only if value is fully entered (15 chars)
//     if (value.length === 15) {
//       if (isDuplicate) {
//         toast.error("GST No Already Exists !!", {
//           position: "top-center", // or "bottom-center"
//         });
//       }
//     }

//   };

//   const HandleValueChange = (event) => {
//     const { id, value } = event.target;
//     const isDuplicate = existingpanList.includes(value);
//     if (isDuplicate) {
//       toast.error("PAN No Already Exists !!", {
//         position: "top-center", // or "bottom-center"
//       });
//     }
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]:  capitalizeWords(value),
//     }));
//   };
//   const handleValueChange = (field) => (event, newValue, reason) => {
//     // Skip during initial API set
//     if (!initialLoadDone) {
//       return setFormData((prev) => ({ ...prev, [field]: capitalizeWords(newValue) || "" }));
//     }

//     // Only check duplicates for ahead field & when user actually sets a value
//     if (field === "ahead" && newValue && reason !== "clear" && reason !== "reset") {
//       const existingAheadList = ledgerData
//         .map((item) => item.ahead?.toLowerCase())
//         .filter(Boolean);

//       if (existingAheadList.includes(newValue.toLowerCase())) {
//         toast.error(`"${newValue}" already exists!`, {
//           position: "top-center",
//           autoClose: 2000,
//         });
//       }
//     }

//     setFormData((prev) => ({ ...prev, [field]: capitalizeWords(newValue) || "" }));
//   };
//   // Handle Enter key to move focus to the next enabled input
//  const handleKeyDown = (e, index) => {
//   if (toastOpen && (e.key === "Tab" || e.key === "Enter")) {
//     e.preventDefault();
//     return;
//   }

//   if (e.key === "Enter" || e.key === "Tab") {
//     e.preventDefault();

//     // 🔥 Special case:
//     // If group is Balance sheet AND current field is A/C NAME (index 1)
//     if (formData.group !== "Balance Sheet" && index === 1) {
//       inputRefs.current[29]?.focus(); // Jump directly to irate
//       return;
//     }

//     let nextIndex = index + 1;

//     while (
//       inputRefs.current[nextIndex] &&
//       inputRefs.current[nextIndex].disabled
//     ) {
//       nextIndex += 1;
//     }

//     inputRefs.current[nextIndex]?.focus();
//   }

//   if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
//     e.preventDefault();

//     let prevIndex = index - 1;

//     while (
//       inputRefs.current[prevIndex] &&
//       inputRefs.current[prevIndex].disabled
//     ) {
//       prevIndex -= 1;
//     }

//     inputRefs.current[prevIndex]?.focus();
//   }
// };

//   const handleAdd = async () => {
//     setShowModal(true);
//   };
//   const handleSelectBsgroup = (selectedItem) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       Bsgroup: selectedItem.name,
//       Bscode: selectedItem.code,
//       group: selectedItem.group,
//     }));

//     setTimeout(() => {
//       if (selectedItem.group !=="Balance Sheet") {
//         // Focus A/C NAME
//         inputRefs.current[1]?.focus();
//       } else {
//         // Focus GST NO
//         inputRefs.current[0]?.focus();
//       }
//     }, 200);
//   };

//   return (
//     <div>
//       <h1>{formData.Bsgroup}</h1>
//       <h1>{formData.Bscode}</h1>
//       <h1>{formData.group}</h1>
//       <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
//         <TextField
//         className="custom-bordered-input"
//         label="GST No"
//         variant="filled"
//         size="small"
//         value={formData.gstNo}
//         onChange={handleChangeGst}
//         error={!isGstValid}
//         helperText={!isGstValid ? "Invalid GST No" : ""}
//         inputRef={(el) => (inputRefs.current[0] = el)}
//         onKeyDown={(e) => handleKeyDown(e, 0)}
//         onKeyPress={handleKeyPress}
//         inputProps={{
//           style: {
//             height: "15px",
//             fontSize: 16,
//           },
//         }}
//         sx={{ width: 370 }}
//       />
//       </div>
//       <div style={{marginTop:2}}>
//       <Autocomplete
//       freeSolo
//       disableClearable
//       options={ getUniqueValues("ahead")}
//       value={formData.ahead}
//       onInputChange={handleValueChange("ahead")}
//       renderInput={(params) => (
//         <TextField
//           {...params}
//           className="custom-bordered-input"
//           id="ahead"
//           variant="filled"
//           size="small"
//           label="A/C NAME"
//           inputRef={(el) => (inputRefs.current[1] = el)}
//           onKeyDown={(e) => handleKeyDown(e, 1)}
//           inputProps={{
//             ...params.inputProps,
//             maxLength: 48,
//             style: {
//               height: "15px",
//               fontSize: 16,
//             },
//           }}
//           sx={{ width: 580 }}
//         />
//       )}
//       />
//       </div>
//       <div  style={{marginTop:2}}>
//         <TextField
//         className="custom-bordered-input"
//         id="add1"
//         value={formData.add1}
//         variant="filled"
//         size="small"
//         label="ADDRESS"
//         onChange={HandleValueChange}
//         inputRef={(el) => (inputRefs.current[2] = el)}
//         onKeyDown={(e) => handleKeyDown(e, 2)} // Handle Enter key
//         inputProps={{
//           maxLength: 48,
//           style: {
//             height: "15px",
//             fontSize: 16,
//           },
//         }}
//         sx={{ width: 580 }}
//       />
//       </div>
//       <div style={{marginTop:2}}>
//                   <TextField
//                   className="custom-bordered-input"
//                   id="irate"
//                   value={formData.irate}
//                   variant="filled"
//                   size="small"
//                   label="INTT/DEPC.RATE"
//                   inputRef={(el) => (inputRefs.current[29] = el)}
//                   onKeyDown={(e) => handleKeyDown(e, 29)} // Handle Enter key
//                   inputProps={{
//                     maxLength: 6,
//                     style: {
//                       height: "15px",
//                       fontSize: 16,
//                     },
//                   }}
//                   sx={{ width: 500 }}
//                   />
//       </div>
//       <div style={{marginTop:2}}>
//       <TextField
//       className="custom-bordered-input"
//       id="tds_rate"
//       value={formData.tds_rate}
//       variant="filled"
//       size="small"
//       label="TDS RATE"
//       inputRef={(el) => (inputRefs.current[30] = el)}
//       onKeyDown={(e) => handleKeyDown(e, 30)} // Handle Enter key
//       inputProps={{
//         maxLength: 6,
//         style: {
//           height: "15px",
//           fontSize: 16,
//           // padding: "0 8px"
//         },
//       }}
//       sx={{ width: 500 }}
//       />
//       </div>
//       <div style={{marginTop:2}}>
//       <TextField
//       className="custom-bordered-input"
//       id="tcs_rate"
//       value={formData.tcs_rate}
//       variant="filled"
//       size="small"
//       label="TCS RATE"
//       inputRef={(el) => (inputRefs.current[31] = el)}
//       onKeyDown={(e) => handleKeyDown(e, 31)} // Handle Enter key
//       inputProps={{
//         maxLength: 6,
//         style: {
//           height: "15px",
//           fontSize: 16,
//           // padding: "0 8px"
//         },
//       }}
//       sx={{ width: 500 }}
//       />
//       </div>
//       <Button onClick={handleAdd}>Add</Button>
//       <AnexureModal
//         show={showModal}
//         handleClose={() => setShowModal(false)}
//         onSelect={handleSelectBsgroup} // Pass callback function
//       />
//     </div>
//   )
// }

// export default Example


// import React, { useState } from "react";
// import axios from "axios";
// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";
// import { Button, Spinner } from "react-bootstrap";

// const Example = () => {
//   const [loading, setLoading] = useState(false);

//   const exportGSTR1 = async () => {
//     try {
//       setLoading(true);

//       // 1️⃣ Fetch API
//       const response = await axios.get(
//         "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale"
//       );

//       const salesData = response.data;

//       // 2️⃣ Load Template
//       const templateResponse = await fetch("/GSTR-1.xlsx");

//       if (!templateResponse.ok) {
//         throw new Error("Template not found");
//       }

//       const buffer = await templateResponse.arrayBuffer();

//       const workbook = new ExcelJS.Workbook();

//       await workbook.xlsx.load(buffer, {
//         ignoreNodes: [
//           "dataValidations",
//           "sheetProtection",
//           "conditionalFormatting"
//         ]
//       });

//       // 🔥 Remove named ranges
//       workbook.definedNames.model = [];

//       const sheet = workbook.getWorksheet("b2b,sez,de");

//       let startRow = 5;

//       salesData.forEach((sale, index) => {
//         const row = sheet.getRow(startRow + index);

//         const customer = sale.customerDetails?.[0] || {};
//         const item = sale.items?.[0] || {};
//         const form = sale.formData || {};

//         row.getCell(1).value = customer.gstno || "";
//         row.getCell(2).value = customer.vacode || "";
//         row.getCell(3).value = form.vbillno || "";
//         row.getCell(4).value = form.date ? new Date(form.date) : "";
//         row.getCell(5).value = Number(form.grandtotal || 0);
//         row.getCell(6).value = `03-${customer.state || ""}`;
//         row.getCell(7).value = "N";
//         row.getCell(8).value = item.gst || 0;
//         row.getCell(9).value = "Regular B2B";
//         row.getCell(10).value = "";
//         row.getCell(11).value = item.gst || 0;
//         row.getCell(12).value = Number(form.sub_total || 0);
//         row.getCell(13).value = Number(form.pcess || 0);

//         row.commit();
//       });

//       const fileBuffer = await workbook.xlsx.writeBuffer();

//       saveAs(
//         new Blob([fileBuffer], {
//           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//         }),
//         "GSTR1_Final.xlsx"
//       );

//     } catch (error) {
//       alert("Export Failed");
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <Button
//         onClick={exportGSTR1}
//         disabled={loading}
//         style={{ margin: 20 }}
//       >
//         {loading ? (
//           <>
//             <Spinner
//               animation="border"
//               size="sm"
//               style={{ marginRight: 8 }}
//             />
//             Exporting...
//           </>
//         ) : (
//           "Export GSTR-1"
//         )}
//       </Button>
//     </div>
//   );
// };

// export default Example;

import React, { useState } from "react";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Button, Spinner, Form, Row, Col } from "react-bootstrap";
import InputMask from "react-input-mask";

const Example = () => {
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const exportGSTR1 = async () => {
    try {
      if (!fromDate || !toDate) {
        alert("Please select From and To date");
        return;
      }

      const from = parseDate(fromDate);
      const to = parseDate(toDate);

      setLoading(true);

      // 1️⃣ Fetch API
      const response = await axios.get(
        "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale"
      );

      const salesData = response.data;

      // 2️⃣ Filter Data Between Dates
      const filteredData = salesData.filter((sale) => {
        const saleDate = new Date(sale.formData?.date);
        return saleDate >= from && saleDate <= to;
      });

      // 3️⃣ Load Template
      const templateResponse = await fetch("/GSTR-1.xlsx");
      const buffer = await templateResponse.arrayBuffer();

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer, {
        ignoreNodes: [
          "dataValidations",
          "sheetProtection",
          "conditionalFormatting"
        ]
      });

      workbook.definedNames.model = [];

      const sheet = workbook.getWorksheet("b2b,sez,de");

      let startRow = 5;

      filteredData.forEach((sale, index) => {
        const row = sheet.getRow(startRow + index);

        const customer = sale.customerDetails?.[0] || {};
        const item = sale.items?.[0] || {};
        const form = sale.formData || {};

        row.getCell(1).value = customer.gstno || "";
        row.getCell(2).value = customer.vacode || "";
        row.getCell(3).value = form.vbillno || "";
        row.getCell(4).value = form.date ? new Date(form.date) : "";
        row.getCell(5).value = Number(form.grandtotal || 0);
        row.getCell(6).value = `03-${customer.state || ""}`;
        row.getCell(7).value = "N";
        row.getCell(8).value = item.gst || 0;
        row.getCell(9).value = "Regular B2B";
        row.getCell(10).value = "";
        row.getCell(11).value = item.gst || 0;
        row.getCell(12).value = Number(form.sub_total || 0);
        row.getCell(13).value = Number(form.pcess || 0);

        row.commit();
      });

      const fileBuffer = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([fileBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }),
        "GSTR1_Filtered.xlsx"
      );

    } catch (error) {
      alert("Export Failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Row className="mb-3">
        <Col md={3}>
          <Form.Label>From Date</Form.Label>
          <InputMask
            mask="99/99/9999"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          >
            {(inputProps) => (
              <Form.Control {...inputProps} placeholder="DD/MM/YYYY" />
            )}
          </InputMask>
        </Col>

        <Col md={3}>
          <Form.Label>To Date</Form.Label>
          <InputMask
            mask="99/99/9999"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          >
            {(inputProps) => (
              <Form.Control {...inputProps} placeholder="DD/MM/YYYY" />
            )}
          </InputMask>
        </Col>

        <Col md={3} className="d-flex align-items-end">
          <Button onClick={exportGSTR1} disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  style={{ marginRight: 8 }}
                />
                Exporting...
              </>
            ) : (
              "Export GSTR-1"
            )}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Example;
