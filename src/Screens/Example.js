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

// import React, { useEffect, useState,useRef } from "react";
// import { Select, MenuItem, FormControl, TextField, InputLabel } from "@mui/material";
// import { Button } from "react-bootstrap";

// const Example = () => {
//   const [formData, setFormData] = useState({
//     tdson: "",
//   });
//   const inputRefs = useRef([]); // Array to hold references for input fields
//   const handleKeyDown = (e, index) => {
//     if (e.key === "Enter") {
//       e.preventDefault(); // Prevent default behavior
//       let nextIndex = index + 1;

//       // Find the next input that is not disabled
//       while (
//         inputRefs.current[nextIndex] &&
//         inputRefs.current[nextIndex].disabled
//       ) {
//         nextIndex += 1;
//       }

//       const nextInput = inputRefs.current[nextIndex];
//       if (nextInput) {
//         nextInput.focus(); // Focus the next enabled input field
//       }
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault(); // Prevent default behavior
//       let prevIndex = index - 1;

//       // Find the previous input that is not disabled
//       while (
//         inputRefs.current[prevIndex] &&
//         inputRefs.current[prevIndex].disabled
//       ) {
//         prevIndex -= 1;
//       }

//       const prevInput = inputRefs.current[prevIndex];
//       if (prevInput) {
//         prevInput.focus(); // Focus the previous enabled input field
//       }
//     }
//   };
//   const [selectOpen, setSelectOpen] = useState(false);
//   const handleTdsOn = (event) => {
//     const { value } = event.target; // Get the selected value from the event
//     setFormData((prevState) => ({
//       ...prevState,
//       tdson: value, // Update the ratecalculate field in FormData
//     }));
//   };
//   return (
//     <div>
//       <FormControl
//         className="custom-bordered-input"
//         sx={{
//           width: '450px',
//           '& .MuiFilledInput-root': {
//             height: 48, // adjust as needed (default ~56px for filled)
//           },
//         }}
//         size="small"
//         variant="filled"
//       >
//         <InputLabel id="tdson">TDS ON</InputLabel>
//         <Select
//           labelId="tdson"
//           id="tdson"
//           value={formData.tdson}
//           onChange={handleTdsOn} // 🔹 selection only
//           open={selectOpen}
//           onOpen={() => setSelectOpen(true)}
//           onClose={() => setSelectOpen(false)}
//           inputRef={(el) => (inputRefs.current[0] = el)}
//           onKeyDownCapture={(e) => {
//             if (e.key === "Enter") {
//               if (selectOpen) {
//                 // 🔹 Menu open → let MUI select option
//                 return;
//               }

//               // 🔹 Menu closed → move to next field
//               e.preventDefault();
//               e.stopPropagation();
//               inputRefs.current[1]?.focus();
//             }

//             // Optional: ArrowDown opens menu
//             if (e.key === "ArrowDown" && !selectOpen) {
//               e.preventDefault();
//               setSelectOpen(true);
//             }
//           }}
//           label="TDS ON"
//           displayEmpty
//           MenuProps={{ disablePortal: true }}
//         >

//           <MenuItem value=""><em></em></MenuItem>
//           <MenuItem value="Interest">Interest</MenuItem>
//           <MenuItem value="Freight">Freight</MenuItem>
//           <MenuItem value="Brokerage">Brokerage</MenuItem>
//           <MenuItem value="Commission">Commission</MenuItem>
//           <MenuItem value="Advertisement">Advertisement</MenuItem>
//           <MenuItem value="Labour">Labour</MenuItem>
//           <MenuItem value="Contract">Contract</MenuItem>
//           <MenuItem value="Job Work">Job Work</MenuItem>
//           <MenuItem value="Salary">Salary</MenuItem>
//           <MenuItem value="Rent">Rent</MenuItem>
//           <MenuItem value="Professional">Professional</MenuItem>
//           <MenuItem value="Purchase">Purchase</MenuItem>
//         </Select>
//       </FormControl>
//       <TextField
//       id="amount"
//       value={formData.amount}
//       label="AMOUNT"
//       onFocus={(e) => e.target.select()}  // Select text on focus
//       inputRef={(el) => (inputRefs.current[1] = el)}
//       onKeyDown={(e) => handleKeyDown(e, 1)}
//       inputProps={{
//         maxLength: 48,
//         style: {
//           height: 18,
//           fontWeight: "bold",
//         },
//       }}
//       size="small"
//       variant="filled"
//       className="custom-bordered-input"
//       sx={{ width: 450 }}
//       />
//       <Button
//       inputRef={(el) => (inputRefs.current[2] = el)}
//       >SAVE</Button>
//     </div>
//   );
// };

// export default Example;

// import React,{useState, useEffect} from 'react'
// import axios from 'axios';
// import Modal from 'react-bootstrap/Modal';
// import { Table, Button, Form } from 'react-bootstrap';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// const Example = () => {
//   const [formData, setFormData] = useState({
//     date: "",
//     vtype: "S",
//     vbillno: 0,
//     vno: 0,
//     gr: "",
//     exfor: "",
//     trpt: "",
//     stype: "",
//     btype: "",
//     conv: "",
//   });
//   // Search Modal states
//   const [showSearch, setShowSearch] = useState(false);
//   const [allBills, setAllBills] = useState([]);
//   const [searchBillNo, setSearchBillNo] = useState("");
//   const [filteredBills, setFilteredBills] = useState([]);
//   const [searchDate, setSearchDate] = useState(null);
  
//   const formatDateToDDMMYYYY = (dateStr) => {
//     if (!dateStr) return "";

//     const date = new Date(dateStr);
//     if (isNaN(date.getTime())) return "";

//     const dd = String(date.getDate()).padStart(2, "0");
//     const mm = String(date.getMonth() + 1).padStart(2, "0");
//     const yyyy = date.getFullYear();

//     return `${dd}-${mm}-${yyyy}`;
//   };
//   // Fetch all bills for search
//   const fetchAllBills = async () => {
//     try {
//       const res = await axios.get(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale"
//       );
//       if (Array.isArray(res.data)) {
//         setAllBills(res.data);
//         setFilteredBills(res.data);
//       }
//     } catch (error) {
//       console.error("Error fetching bills", error);
//     }
//   };

//   // Update filtering logic
//   useEffect(() => {
//     let filtered = allBills;

//     // Filter by Bill No if entered
//     if (searchBillNo.trim() !== "") {
//       filtered = filtered.filter((bill) =>
//         bill.formData.vbillno
//           .toString()
//           .toLowerCase()
//           .includes(searchBillNo.toLowerCase())
//       );
//     }

//     const formatLocalDate = (date) => {
//       const d = new Date(date);
//       if (isNaN(d)) return null; // invalid date
//       const year = d.getFullYear();
//       const month = String(d.getMonth() + 1).padStart(2, "0");
//       const day = String(d.getDate()).padStart(2, "0");
//       return `${year}-${month}-${day}`;
//     };

//     // Filter by Date if selected
//     if (searchDate) {
//         const selected = formatLocalDate(searchDate);

//       if (selected) {
//         filtered = filtered.filter((bill) => {
//           const billDate = formatLocalDate(bill.formData.date);
//           return billDate === selected;
//         });
//       }
//     }

//     setFilteredBills(filtered);
//   }, [searchBillNo, searchDate, allBills]);

//   const handleSelectBill = (bill) => {
//     setFormData({
//       ...bill.formData,
//       date: formatDateToDDMMYYYY(bill.formData.date),
//     });
//   };
  
//   return (
//     <div>
//       <h1>{formData.date}</h1>
//        <Button
//         className="Buttonz"
//         onClick={() => {
//           fetchAllBills();
//           setShowSearch(true);
//         }}
//       >
//         Search
//       </Button>
//       {/* Search Modal */}
//       <Modal show={showSearch} onHide={() => setShowSearch(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Search</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//         <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//           <Form.Control
//             type="text"
//             placeholder="Enter Bill No..."
//             value={searchBillNo}
//             onChange={(e) => setSearchBillNo(e.target.value)}
//           />
//           <DatePicker
//             selected={searchDate}
//             onChange={(date) => setSearchDate(date)}
//             placeholderText="Select Date"
//             dateFormat="dd-MM-yyyy"
//             className="form-control"
//           />
//           <Button
//             variant="secondary"
//             onClick={() => {
//               setSearchBillNo("");
//               setSearchDate(null);
//             }}
//           >
//             Clear
//           </Button>
//         </div>
//         <div style={{ maxHeight: "300px", overflowY: "auto" }}>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>BillNo</th>
//                 <th>Date</th>
//                 <th>Customer</th>
//                 <th>City</th>
//                 <th>GrandTotal</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredBills.map((bill) => (
//                 <tr key={bill._id}>
//                   <td>{bill.formData.vbillno}</td>
//                   <td>
//                     {new Date(bill.formData.date).toLocaleDateString("en-GB")}
//                   </td>
//                   <td>{bill.customerDetails?.[0]?.vacode}</td>
//                   <td>{bill.customerDetails?.[0]?.city}</td>
//                   <td>{bill.formData.grandtotal}</td>
//                   <td>
//                     <Button
//                       size="sm"
//                       onClick={() => {
//                         handleSelectBill(bill);
//                         setShowSearch(false);
//                       }}
//                     >
//                       Select
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//               {filteredBills.length === 0 && (
//                 <tr>
//                   <td colSpan="6" style={{ textAlign: "center" }}>
//                     No matching records
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   )
// }

// export default Example


import React, { useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { Table, Button, Form } from "react-bootstrap";
import InputMask from "react-input-mask";

const Example = () => {
  const [formData, setFormData] = useState({
    date: "",
    vtype: "S",
    vbillno: 0,
    vno: 0,
    gr: "",
    exfor: "",
    trpt: "",
    stype: "",
    btype: "",
    conv: "",
  });

  // Modal & Search states
  const [showSearch, setShowSearch] = useState(false);
  const [allBills, setAllBills] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);

  const [searchBillNo, setSearchBillNo] = useState("");
  const [searchDate, setSearchDate] = useState(""); // DD-MM-YYYY

  // 🔹 Convert ISO date → DD-MM-YYYY
  const isoToDDMMYYYY = (isoDate) => {
    if (!isoDate) return "";

    const d = new Date(isoDate);
    if (isNaN(d)) return "";

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
  };

  // 🔹 Fetch all bills
  const fetchAllBills = async () => {
    try {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale"
      );
      if (Array.isArray(res.data)) {
        setAllBills(res.data);
        setFilteredBills([]); // empty until Proceed
      }
    } catch (error) {
      console.error("Error fetching bills", error);
    }
  };

  // 🔹 Proceed button logic
  const handleProceed = () => {
    // ✅ Require at least one filter
    if (searchBillNo.trim() === "" && searchDate.trim() === "") {
      alert("Please enter Bill No or Date to proceed.");
      return; // stop execution
    }

    let filtered = allBills;

    // Filter by Bill No
    if (searchBillNo.trim() !== "") {
      filtered = filtered.filter((bill) =>
        bill.formData.vbillno.toString().includes(searchBillNo.trim())
      );
    }

    // Filter by Date (DD-MM-YYYY)
    if (/^\d{2}-\d{2}-\d{4}$/.test(searchDate)) {
      filtered = filtered.filter((bill) => {
        const billDate = isoToDDMMYYYY(bill.formData.date);
        return billDate === searchDate;
      });
    }

    setFilteredBills(filtered);
  };

  // const handleProceed = () => {
  //   let filtered = allBills;

  //   // Filter by Bill No
  //   if (searchBillNo.trim() !== "") {
  //     filtered = filtered.filter((bill) =>
  //       bill.formData.vbillno
  //         .toString()
  //         .includes(searchBillNo.trim())
  //     );
  //   }

  //   // Filter by Date (DD-MM-YYYY)
  //   if (/^\d{2}-\d{2}-\d{4}$/.test(searchDate)) {
  //     filtered = filtered.filter((bill) => {
  //       const billDate = isoToDDMMYYYY(bill.formData.date);
  //       return billDate === searchDate;
  //     });
  //   }

  //   setFilteredBills(filtered);
  // };

  // 🔹 Select bill
  const handleSelectBill = (bill) => {
    setFormData({
      ...bill.formData,
      date: isoToDDMMYYYY(bill.formData.date),
    });
    setShowSearch(false);
  };

  return (
    <div>
      <h3>Selected Date: {formData.date}</h3>

      <Button
        className="Buttonz"
        onClick={() => {
          fetchAllBills();
          setShowSearch(true);
        }}
      >
        Search
      </Button>

      {/* 🔍 Search Modal */}
      <Modal show={showSearch} onHide={() => setShowSearch(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Search</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Filters */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <Form.Control
              type="text"
              placeholder="Enter Bill No..."
              value={searchBillNo}
              onChange={(e) => setSearchBillNo(e.target.value)}
            />

            <InputMask
              mask="99-99-9999"
              placeholder="DD-MM-YYYY"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="form-control"
            />

            <Button variant="primary" onClick={handleProceed}>
              Proceed
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setSearchBillNo("");
                setSearchDate("");
                setFilteredBills([]);
              }}
            >
              Clear
            </Button>
          </div>

          {/* Results */}
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Bill No</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>City</th>
                  <th>Grand Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBills.map((bill) => (
                  <tr key={bill._id}>
                    <td>{bill.formData.vbillno}</td>
                    <td>{isoToDDMMYYYY(bill.formData.date)}</td>
                    <td>{bill.customerDetails?.[0]?.vacode}</td>
                    <td>{bill.customerDetails?.[0]?.city}</td>
                    <td>{bill.formData.grandtotal}</td>
                    <td>
                      <Button
                        size="sm"
                        onClick={() => handleSelectBill(bill)}
                      >
                        Select
                      </Button>
                    </td>
                  </tr>
                ))}

                {filteredBills.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No matching records
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Example;
