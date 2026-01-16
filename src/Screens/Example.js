// import React, { useEffect, useState, useRef, useMemo } from "react";
// import axios from "axios";
// import { Table, Modal, Button, Card, Form } from "react-bootstrap";  // ✅ Form imported
// import styles from "./AccountStatement/LedgerList.module.css"
// import { useNavigate } from "react-router-dom";  // ✅ Add this
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import OptionModal from "./TrailBalance/OptionModal";
// import "./TrailBalance/TrailBalance.css"
// import InputMask from "react-input-mask";
// import financialYear from "./Shared/financialYear";
// import AnnexureWiseModal from "./TrailBalance/AnnexureWiseModal";

// const Example = () => {

//     // Annexure wise Modal
//     const [showAnnexureModal, setShowAnnexureModal] = useState(false);
//     const [annexureGroupedData, setAnnexureGroupedData] = useState({});


//   const [allLedgers, setAllLedgers] = useState([]); // keep full list
//   // const [allLedgers, setAllLedgers] = useState([]);
//   const [faDataState, setFaDataState] = useState([]); // ✅ store faData here
//   const [filteredLedgers, setFilteredLedgers] = useState([]); // ✅ for search
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedLedger, setSelectedLedger] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const rowRefs = useRef([]);
//   const tableRef = useRef(null);

//   const tableContainerRef = useRef(null);
//   const txnContainerRef = useRef(null);

//   const searchRef = useRef(null);   // ✅ search input ref
//   const groupRowRefs = useRef([]);
//   const navigate = useNavigate();
//   const [activeRowIndex, setActiveRowIndex] = useState(0);  // ✅ Track highlighted txn row
//   const [checkedRows, setCheckedRows] = useState({});


//   // Filter Ledger Accounts 
//   const [showGroupModal, setShowGroupModal] = useState(false);
//   const [groupedLedgersToPick, setGroupedLedgersToPick] = useState([]);
//   const [activeGroupIndex, setActiveGroupIndex] = useState(0);
//   const [currentGroupName, setCurrentGroupName] = useState("");
//   const [selectedGroupRows, setSelectedGroupRows] = useState(new Set());

//   const [ledgerFromDate, setLedgerFromDate] = useState(null);
//   const [ledgerToDate, setLedgerToDate] = useState(null);
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [isOptionOpen, setIsOptionOpen] = useState(false);
//   const [optionValues, setOptionValues] = useState({
//     Balance: "Active Balance",
//     OrderBy: "",
//     Annexure: "All",
//     T1: "", // ✅ include T1 (Selected Accounts)
//     T3: false, // ✅ Print Current Date
//     T10: false, // ✅ group by BsGroup toggle
//   });
  
//   const [printDateValue, setPrintDateValue] = useState(null); // ✅ actual stored date
  
//   const openOptionModal = () => {
//     setIsOptionOpen(true);
//   };
//   const closeOptionModal = () => {
//     setIsOptionOpen(false);
//   };

//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setLedgerFromDate(formatDate(fy.start)); // converted
//     setLedgerToDate(formatDate(fy.end));     // converted
//     setFromDate(fy.start); // converted
//     setToDate(fy.end);     // converted
//   }, []);

//   // Filters Transactions Account Statement 
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

//   const handleVtypeChange = (e) => {
//     const { name, checked } = e.target;
//     setVtypeFilters((prev) => ({
//       ...prev,
//       [name]: checked,
//     }));
//   };
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

//   // Auto focus search field on mount
//   useEffect(() => {
//     if (searchRef.current) {
//       searchRef.current.focus();
//     }
//   }, []);

//   const parseDDMMYYYY = (str) => {
//     if (!str) return null;
//     const [dd, mm, yyyy] = str.split("/").map(Number);
//     return new Date(yyyy, mm - 1, dd);
//   };

//   // fetch ledger + fa
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

//          setFaDataState(faData); // ✅ store faData in state

//         const ledgerTotals = {};
//         faData.forEach((entry) => {
          
//         const from = parseDDMMYYYY(ledgerFromDate);
//         const to = parseDDMMYYYY(ledgerToDate);

//         entry.transactions.forEach((txn) => {
//           const txnDate = new Date(txn.date);

//           if (from && txnDate < from) return;
//           if (to && txnDate > to) return;

//           const acc = txn.account.trim();

//           if (!ledgerTotals[acc]) {
//             ledgerTotals[acc] = { debit: 0, credit: 0 };
//           }

//           if (txn.type.toLowerCase() === "debit") {
//             ledgerTotals[acc].debit += txn.amount;
//           } else if (txn.type.toLowerCase() === "credit") {
//             ledgerTotals[acc].credit += txn.amount;
//           }
//         });

//         });

//         const enrichedLedgers = ledgersData.map((ledger) => {
//           const acc = ledger.formData.ahead.trim();
//           const totals = ledgerTotals[acc] || { debit: 0, credit: 0 };
//           const balance = totals.debit - totals.credit;
//           const drcr = balance > 0 ? "DR" : balance < 0 ? "CR" : "NIL";
//           return {
//             ...ledger,
//             totals: { balance, drcr },
//             hasTxn: !!ledgerTotals[acc],
//           };
//         });

//         setAllLedgers(enrichedLedgers);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchData();
//   }, [ledgerFromDate, ledgerToDate]);

//   // apply filters + sorting
//   useEffect(() => {
//   let result = [...allLedgers];

//   // Balance filter
//   switch (optionValues.Balance) {
//     case "Active Balance":
//     result = result.filter((l) => l.totals.balance !== 0);
//     break;
//     case "Nil Balance":
//     result = result.filter((l) => l.totals.balance === 0);
//     break;
//     case "Debit Balance":
//     result = result.filter((l) => l.totals.balance > 0);
//     break;
//     case "Credit Balance":
//     result = result.filter((l) => l.totals.balance < 0);
//     break;
//     case "Transacted Account":
//     result = result.filter((l) => l.hasTxn);
//     break;
//     case "Non Transacted Account":
//     result = result.filter((l) => !l.hasTxn);
//     break;
//     case "All Accounts":
//     default:
//     break;
//   }

//   // Annexure filter
//   if (optionValues.Annexure && optionValues.Annexure !== "All") {
//       result = result.filter(
//       (l) => l.formData.Bsgroup === optionValues.Annexure
//       );
//   }

//   // Sorting
//   switch (optionValues.OrderBy) {
//     case "Annexure Wise":
//     result.sort((a, b) =>
//         (a.formData.Bsgroup || "").localeCompare(b.formData.Bsgroup || "")
//     );
//     break;
//     case "Account Name Wise":
//     result.sort((a, b) =>
//         (a.formData.ahead || "").localeCompare(b.formData.ahead || "")
//     );
//     break;
//     case "City Wise + Name Wise":
//     result.sort((a, b) => {
//       const cityComp = (a.formData.city || "").localeCompare(
//       b.formData.city || ""
//       );
//       if (cityComp !== 0) return cityComp;
//       return (a.formData.ahead || "").localeCompare(b.formData.ahead || "");
//     });
//     break;
//     case "Sorting Order No.Wise":
//     result.sort(
//         (a, b) =>
//         (a.formData.sortingOrderNo || 0) - (b.formData.sortingOrderNo || 0)
//     );
//     break;
//     case "Prefix Annexure Wise":
//     result.sort((a, b) =>
//         (a.formData.Bsgroup || "")
//         .toString()
//         .charAt(0)
//         .localeCompare((b.formData.Bsgroup || "").toString().charAt(0))
//     );
//     break;
//     default:
//     break;
//   }

//   // Selected Accounts filter
//   if (optionValues.T1) {
//     result = result.filter((l) => !!checkedRows[l._id]);
//   }

//   if (optionValues.T10) {
//   const grouped = {};
//   result.forEach((ledger) => {
//     const group = ledger.formData.Bsgroup || "Others";
//     if (!grouped[group]) {
//       grouped[group] = {
//         balance: 0,
//         qty: 0,
//         pcs: 0,
//         debit: 0,
//         credit: 0,
//         ledgers: [],
//       };
//     }
//     const { balance, drcr, qty = 0, pcs = 0 } = ledger.totals || {};
//     grouped[group].balance += balance;
//     grouped[group].qty += qty;
//     grouped[group].pcs += pcs;
//     if (drcr === "DR") {
//       grouped[group].debit += Math.abs(balance);
//     } else {
//       grouped[group].credit += Math.abs(balance);
//     }
//     grouped[group].ledgers.push(ledger);
//   });

//   result = Object.entries(grouped).map(([group, data]) => {
//     const drcr = data.balance >= 0 ? "DR" : "CR";
//     return {
//       _id: group,
//       formData: { ahead: group, city: "" },
//       totals: {
//         balance: data.balance,
//         drcr,
//         qty: data.qty,
//         pcs: data.pcs,
//         debit: data.debit,
//         credit: data.credit,
//       },
//       groupedLedgers: data.ledgers,
//     };
//   });
// }

//   setFilteredLedgers(result);
//   }, [allLedgers, optionValues, checkedRows]);

//   // Reset selectedIndex ONLY when filters/search change, not checkbox
//   useEffect(() => {
//   setSelectedIndex(0);
//   }, [allLedgers, optionValues]);

//   // Open modal and fetch transactions
//   const openLedgerDetails = (ledger) => {
//     if (ledger.groupedLedgers) {
//       setGroupedLedgersToPick(ledger.groupedLedgers);
//       setCurrentGroupName(ledger.formData.ahead); // 🔹 store group name
//       setShowGroupModal(true);
//     } else {
//       fetchLedgerTransactions(ledger);
//     }
//   };

//     const loadLedgerData = (selectedLedger = null) => {
//     axios
//         .get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile")
//         .then((res) => {
//         const allTxns = res.data.data || [];

//         // -----------------------------------------
//         // 1️⃣ Compute Totals for All Ledgers
//         // -----------------------------------------
//         const totals = {};
//         allLedgers.forEach((ledger) => {
//             const ledgerTxns = allTxns.flatMap((entry) =>
//             entry.transactions.filter(
//                 (txn) => txn.account.trim() === ledger.formData.ahead.trim()
//             )
//             );
//             let netWeight = 0;
//             let netPcs = 0;
//             ledgerTxns.forEach((txn) => {
//             if (txn.vtype === "P") {
//                 netWeight += txn.weight || 0;
//                 netPcs += txn.pkgs || 0;
//             } else if (txn.vtype === "S") {
//                 netWeight -= txn.weight || 0;
//                 netPcs -= txn.pkgs || 0;
//             }
//             });
//             totals[ledger._id] = { netWeight, netPcs };
//         });
//         setLedgerTotals(totals);
//         if (selectedLedger) {
//             const ledgerTxns = allTxns.flatMap((entry) =>
//             entry.transactions
//                 .filter(
//                 (txn) =>
//                     txn.account.trim() === selectedLedger.formData.ahead.trim()
//                 )
//                 .map((txn) => ({
//                 ...txn,
//                 saleId: entry.saleId || null,
//                 purId: entry.purchaseId || null,
//                 bankId: entry.bankId || null,
//                 cashId: entry.cashId || null,
//                 journalId: entry.journalId || null,
//                 }))
//             );

//             setSelectedLedger(selectedLedger);
//             setTransactions(ledgerTxns);
//             setShowModal(true);
//         }
//         })
//         .catch((err) => console.error(err));
//     };
//     useEffect(() => {
//     loadLedgerData();
//     }, [allLedgers]);

//     const fetchLedgerTransactions = (ledger) => {
//     loadLedgerData(ledger);
//     };
//     const handleCheckboxChange = (id) => {
//     setCheckedRows((prev) => ({
//         ...prev,
//         [id]: !prev[id],
//     }));
//     };

//     const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
//     };

//     // Annexure Wise
//     const buildAnnexureData = () => {
//     const grouped = {};

//     filteredLedgers.forEach((ledger) => {
//         const annexure = ledger.formData.Bsgroup || "Others";

//         if (!grouped[annexure]) grouped[annexure] = [];

//         grouped[annexure].push({
//         ...ledger,
//         netPcs: ledgerTotals[ledger._id]?.netPcs || 0,
//         netQty: ledgerTotals[ledger._id]?.netWeight || 0,
//         });
//     });

//     setAnnexureGroupedData(grouped);
//     };


//   return (
//     <div style={{ padding: "10px" }}>
//       <Card className="contMain">
//         <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "10px" }}>
//           {/* Date Filters */}
//           <div style={{ display: "flex", flexDirection:"column", alignItems: "center",gap:"10px" }}>
//             <div style={{display:'flex',flexDirection:'row'}}>
//             <span className="textform"><b>From:</b></span>
//             <InputMask
//               mask="99/99/9999"
//               placeholder="dd/mm/yyyy"
//               value={ledgerFromDate}
//               onChange={(e) => setLedgerFromDate(e.target.value)}
//               className="fDate"
//             />
//             </div>
//             <div style={{display:'flex',flexDirection:'row'}}>
//             <span className="textform"><b>To:</b></span>
//             <InputMask
//               mask="99/99/9999"
//               placeholder="dd/mm/yyyy"
//               value={ledgerToDate}
//               onChange={(e) => setLedgerToDate(e.target.value)}
//               className="toDate"
//             />
//             </div>
//           </div>
//            <h3 className="headerTrail">TRAIL BALANCE</h3>
//         </div>
//         <div className="TableT" ref={tableContainerRef}>
//           <Table size="sm" className="custom-table" hover ref={tableRef}>
//             <thead style={{ position: "sticky", top: 1, background: "skyblue", fontSize: 17, textAlign: "center" }}>
//               <tr>
//                 <th></th>
//                 <th>NAME</th>
//                 <th>CITY</th>
//                 <th>PCS</th>
//                 <th>QTY</th>
//                 <th>DEBIT</th>
//                 <th>CREDIT</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredLedgers.map((ledger, index) => {
//                 const { balance, drcr } = ledger.totals || {};
//                 return (
//                   <tr
//                     key={ledger._id}
//                     onClick={() => {
//                       setSelectedIndex(index);
//                       openLedgerDetails(ledger);
//                     }}
//                   >
//                     <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
//                       <input
//                         style={{ width: "18px", height: "18px", cursor: "pointer" }}
//                         type="checkbox"
//                         checked={!!checkedRows[ledger._id]}
//                         onChange={() => handleCheckboxChange(ledger._id)}
//                       />
//                     </td>
//                     <td>{ledger.formData.ahead}</td>
//                     <td>{ledger.formData.city}</td>
//                     <td style={{ textAlign: "right" }}>
//                       {ledgerTotals[ledger._id]?.netPcs?.toFixed(3) || "0.000"}
//                     </td>
//                     <td style={{ textAlign: "right" }}>
//                       {ledgerTotals[ledger._id]?.netWeight?.toFixed(3) || "0.000"}
//                     </td>
//                     <td style={{ textAlign: "right", color: "darkblue", fontWeight:"bold" }}>
//                       {drcr === "DR" ? Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}

//                     </td>
//                     <td style={{ textAlign: "right", color: "red", fontWeight:"bold" }}>
//                       {drcr === "CR" ? Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}

//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </div>

//         {/* ✅ Search Input */}
//           <div style={{marginTop:"5px",marginLeft:'auto'}}>
//           <Button className="Buttonz" style={{backgroundColor:"#3d85c6"}} onClick={openOptionModal} >Options</Button>
//           <OptionModal
//             isOpen={isOptionOpen}
//             onClose={closeOptionModal}
//             onApply={(values) => {
//               setOptionValues(values);
//                 if (values.OrderBy === "Annexure Wise") {
//                     buildAnnexureData();
//                     setShowAnnexureModal(true);
//                 }
//               if (values.T3) {
//                 setPrintDateValue(new Date());
//               } else {
//                 setPrintDateValue(null);
//               }
//             }}
//           />
//           </div>
//         <AnnexureWiseModal
//             show={showAnnexureModal}
//             onClose={() => setShowAnnexureModal(false)}
//             data={annexureGroupedData}
//         />
//       </Card>
//     </div>
//   );
// };

// export default Example;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Table, Modal, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import financialYear from "./Shared/financialYear";
import OptionModal from "./TrailBalance/OptionModal";
import AnnexureWiseModal from "./TrailBalance/AnnexureWiseModal";
import "./TrailBalance/TrailBalance.css";

const Example = () => {
  const navigate = useNavigate();

  /* ===================== STATE ===================== */
  const [allLedgers, setAllLedgers] = useState([]);
  const [filteredLedgers, setFilteredLedgers] = useState([]);
  const [ledgerTotals, setLedgerTotals] = useState({});
  const [checkedRows, setCheckedRows] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [ledgerFromDate, setLedgerFromDate] = useState("");
  const [ledgerToDate, setLedgerToDate] = useState("");

  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [showAnnexureModal, setShowAnnexureModal] = useState(false);
  const [annexureGroupedData, setAnnexureGroupedData] = useState({});

  const [optionValues, setOptionValues] = useState({
    Balance: "Active Balance",
    OrderBy: "",
    Annexure: "All",
    T1: false,
    T3: false,
    T10: false,
  });

  /* ===================== HELPERS ===================== */
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}/${String(
      d.getMonth() + 1
    ).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const parseDDMMYYYY = (str) => {
    if (!str) return null;
    const [dd, mm, yyyy] = str.split("/").map(Number);
    return new Date(yyyy, mm - 1, dd);
  };

  /* ===================== INIT FY ===================== */
  useEffect(() => {
    const fy = financialYear.getFYDates();
    setLedgerFromDate(formatDate(fy.start));
    setLedgerToDate(formatDate(fy.end));
  }, []);

  /* ===================== FETCH LEDGERS + TOTALS ===================== */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ledgerRes, faRes] = await Promise.all([
          axios.get(
            "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount"
          ),
          axios.get(
            "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile"
          ),
        ]);

        const ledgersData = ledgerRes.data.data || [];
        const faData = faRes.data.data || [];

        /* ---------- TOTALS (ACODE BASED) ---------- */
        const totalsMap = {};

        faData.forEach((entry) => {
          const from = parseDDMMYYYY(ledgerFromDate);
          const to = parseDDMMYYYY(ledgerToDate);

          entry.transactions.forEach((txn) => {
            const txnDate = new Date(txn.date);
            if (from && txnDate < from) return;
            if (to && txnDate > to) return;

            const acode = txn.ACODE;
            if (!acode) return;

            if (!totalsMap[acode]) {
              totalsMap[acode] = {
                debit: 0,
                credit: 0,
                netWeight: 0,
                netPcs: 0,
              };
            }

            if (txn.type.toLowerCase() === "debit") {
              totalsMap[acode].debit += txn.amount;
            } else {
              totalsMap[acode].credit += txn.amount;
            }

            if (txn.vtype === "P") {
              totalsMap[acode].netWeight += txn.weight || 0;
              totalsMap[acode].netPcs += txn.pkgs || 0;
            } else if (txn.vtype === "S") {
              totalsMap[acode].netWeight -= txn.weight || 0;
              totalsMap[acode].netPcs -= txn.pkgs || 0;
            }
          });
        });

        setLedgerTotals(totalsMap);

        /* ---------- ENRICH LEDGERS ---------- */
        const enriched = ledgersData.map((ledger) => {
          const acode = ledger.formData.acode;
          const t = totalsMap[acode] || {
            debit: 0,
            credit: 0,
            netWeight: 0,
            netPcs: 0,
          };
          const balance = t.debit - t.credit;
          const drcr = balance > 0 ? "DR" : balance < 0 ? "CR" : "NIL";

          return {
            ...ledger,
            totals: { balance, drcr },
            hasTxn: !!totalsMap[acode],
          };
        });

        setAllLedgers(enriched);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [ledgerFromDate, ledgerToDate]);

  /* ===================== FILTER / SORT ===================== */
  useEffect(() => {
    let result = [...allLedgers];

    switch (optionValues.Balance) {
      case "Active Balance":
        result = result.filter((l) => l.totals.balance !== 0);
        break;
      case "Nil Balance":
        result = result.filter((l) => l.totals.balance === 0);
        break;
      case "Debit Balance":
        result = result.filter((l) => l.totals.balance > 0);
        break;
      case "Credit Balance":
        result = result.filter((l) => l.totals.balance < 0);
        break;
      default:
        break;
    }

    if (optionValues.Annexure !== "All") {
      result = result.filter(
        (l) => l.formData.Bsgroup === optionValues.Annexure
      );
    }

    if (optionValues.T1) {
      result = result.filter((l) => checkedRows[l._id]);
    }

    setFilteredLedgers(result);
  }, [allLedgers, optionValues, checkedRows]);

  /* ===================== LOAD LEDGER TXNS ===================== */
  const openLedgerDetails = async (ledger) => {
    try {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile"
      );

      const allTxns = res.data.data || [];

      const ledgerTxns = allTxns.flatMap((entry) =>
        entry.transactions
          .filter((txn) => txn.ACODE === ledger.formData.acode)
          .map((txn) => ({
            ...txn,
            saleId: entry.saleId || null,
            purId: entry.purchaseId || null,
            bankId: entry.bankId || null,
            cashId: entry.cashId || null,
            journalId: entry.journalId || null,
          }))
      );

      setSelectedLedger(ledger);
      setTransactions(ledgerTxns);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  /* ===================== ANNEXURE ===================== */
  const buildAnnexureData = () => {
    const grouped = {};

    filteredLedgers.forEach((ledger) => {
      const annexure = ledger.formData.Bsgroup || "Others";
      if (!grouped[annexure]) grouped[annexure] = [];

      grouped[annexure].push({
        ...ledger,
        netPcs: ledgerTotals[ledger.formData.acode]?.netPcs || 0,
        netQty: ledgerTotals[ledger.formData.acode]?.netWeight || 0,
      });
    });

    setAnnexureGroupedData(grouped);
    setShowAnnexureModal(true);
  };

  /* ===================== RENDER ===================== */
  return (
    <div style={{ padding: "10px" }}>
      <Card className="contMain">
        <h3 className="headerTrail">TRIAL BALANCE</h3>

        <Table size="sm" hover className="custom-table">
          <thead>
            <tr>
              <th></th>
              <th>NAME</th>
              <th>CITY</th>
              <th>PCS</th>
              <th>QTY</th>
              <th>DEBIT</th>
              <th>CREDIT</th>
            </tr>
          </thead>
          <tbody>
            {filteredLedgers.map((ledger) => {
              const { balance, drcr } = ledger.totals;
              const acode = ledger.formData.acode;

              return (
                <tr
                  key={ledger._id}
                  onClick={() => openLedgerDetails(ledger)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={!!checkedRows[ledger._id]}
                      onChange={() =>
                        setCheckedRows((p) => ({
                          ...p,
                          [ledger._id]: !p[ledger._id],
                        }))
                      }
                    />
                  </td>
                  <td title={`ACODE: ${acode}`}>
                    {ledger.formData.ahead}
                  </td>
                  <td>{ledger.formData.city}</td>
                  <td align="right">
                    {(ledgerTotals[acode]?.netPcs || 0).toFixed(3)}
                  </td>
                  <td align="right">
                    {(ledgerTotals[acode]?.netWeight || 0).toFixed(3)}
                  </td>
                  <td align="right" style={{ color: "darkblue" }}>
                    {drcr === "DR" && Math.abs(balance).toFixed(2)}
                  </td>
                  <td align="right" style={{ color: "red" }}>
                    {drcr === "CR" && Math.abs(balance).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>

        <Button onClick={() => setIsOptionOpen(true)}>Options</Button>

        <OptionModal
          isOpen={isOptionOpen}
          onClose={() => setIsOptionOpen(false)}
          onApply={(values) => {
            setOptionValues(values);
            if (values.OrderBy === "Annexure Wise") {
              buildAnnexureData();
            }
          }}
        />

        <AnnexureWiseModal
          show={showAnnexureModal}
          onClose={() => setShowAnnexureModal(false)}
          data={annexureGroupedData}
        />
      </Card>
    </div>
  );
};

export default Example;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Table, Card } from "react-bootstrap";
// import InputMask from "react-input-mask";
// import financialYear from "./Shared/financialYear";

// const Example = () => {
//   const [trailData, setTrailData] = useState([]);
//   const [ledgerFromDate, setLedgerFromDate] = useState("");
//   const [ledgerToDate, setLedgerToDate] = useState("");

//   /* ===================== DATE HELPERS ===================== */
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

//   /* ===================== BUILD TRIAL BALANCE ===================== */
//   useEffect(() => {
//     const fetchFaFile = async () => {
//       try {
//         const res = await axios.get(
//           "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile"
//         );

//         const faData = res.data.data || [];
//         const from = parseDDMMYYYY(ledgerFromDate);
//         const to = parseDDMMYYYY(ledgerToDate);

//         const tbMap = {}; // 🔑 ACODE based

//         faData.forEach((entry) => {
//           entry.transactions.forEach((txn) => {
//             const txnDate = new Date(txn.date);
//             if (from && txnDate < from) return;
//             if (to && txnDate > to) return;

//             const acode = txn.ACODE;
//             if (!acode) return;

//             if (!tbMap[acode]) {
//               tbMap[acode] = {
//                 acode,
//                 name: txn.account,
//                 debit: 0,
//                 credit: 0,
//                 netPcs: 0,
//                 netQty: 0,
//               };
//             }

//             if (txn.type.toLowerCase() === "debit") {
//               tbMap[acode].debit += txn.amount;
//             } else {
//               tbMap[acode].credit += txn.amount;
//             }

//             // PCS / QTY logic
//             if (txn.vtype === "P") {
//               tbMap[acode].netQty += txn.weight || 0;
//               tbMap[acode].netPcs += txn.pkgs || 0;
//             } else if (txn.vtype === "S") {
//               tbMap[acode].netQty -= txn.weight || 0;
//               tbMap[acode].netPcs -= txn.pkgs || 0;
//             }
//           });
//         });

//         const finalTB = Object.values(tbMap).map((l) => {
//           const balance = l.debit - l.credit;
//           return {
//             ...l,
//             balance,
//             drcr: balance > 0 ? "DR" : balance < 0 ? "CR" : "NIL",
//           };
//         });

//         setTrailData(finalTB);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchFaFile();
//   }, [ledgerFromDate, ledgerToDate]);

//   /* ===================== RENDER ===================== */
//   return (
//     <div style={{ padding: "10px" }}>
//       <Card className="contMain">
//         <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
//           <div>
//             <b>From:</b>{" "}
//             <InputMask
//               mask="99/99/9999"
//               value={ledgerFromDate}
//               onChange={(e) => setLedgerFromDate(e.target.value)}
//             />
//           </div>
//           <div>
//             <b>To:</b>{" "}
//             <InputMask
//               mask="99/99/9999"
//               value={ledgerToDate}
//               onChange={(e) => setLedgerToDate(e.target.value)}
//             />
//           </div>
//         </div>

//         <h3 className="headerTrail">TRIAL BALANCE</h3>

//         <Table size="sm" hover bordered>
//           <thead>
//             <tr>
//               <th>ACODE</th>
//               <th>ACCOUNT NAME</th>
//               <th>PCS</th>
//               <th>QTY</th>
//               <th>DEBIT</th>
//               <th>CREDIT</th>
//             </tr>
//           </thead>
//           <tbody>
//             {trailData.map((l) => (
//               <tr key={l.acode}>
//                 <td>{l.acode}</td>
//                 <td>{l.name}</td>
//                 <td align="right">{l.netPcs.toFixed(3)}</td>
//                 <td align="right">{l.netQty.toFixed(3)}</td>
//                 <td align="right" style={{ color: "darkblue" }}>
//                   {l.drcr === "DR" && Math.abs(l.balance).toFixed(2)}
//                 </td>
//                 <td align="right" style={{ color: "red" }}>
//                   {l.drcr === "CR" && Math.abs(l.balance).toFixed(2)}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </Card>
//     </div>
//   );
// };

// export default Example;
