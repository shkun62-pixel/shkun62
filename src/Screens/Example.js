// // import React, { useEffect, useState, useRef, useMemo } from "react";
// // import axios from "axios";
// // import { Table, Modal, Button, Card, Form } from "react-bootstrap";  // ✅ Form imported
// // import styles from "./AccountStatement/LedgerList.module.css";
// // import TextField from "@mui/material/TextField";
// // import DatePicker from "react-datepicker";
// // import "react-datepicker/dist/react-datepicker.css";
// // import useCompanySetup from "./Shared/useCompanySetup";
// // import "./TrailBalance/TrailBalance.css"
// // import { useNavigate, useLocation } from "react-router-dom";  // ✅ Add this

// // const Example = () => {
// //   const { dateFrom } = useCompanySetup();
// // const navigate = useNavigate();
// //   const [allLedgers, setAllLedgers] = useState([]); // keep full list
// //   const [filteredLedgers, setFilteredLedgers] = useState([]); // ✅ for search
// //   const [searchTerm, setSearchTerm] = useState("");           // ✅ search state
// //   const [selectedIndex, setSelectedIndex] = useState(0);
// //   const [showModal, setShowModal] = useState(false);
// //   const [selectedLedger, setSelectedLedger] = useState(null);
// //   const [transactions, setTransactions] = useState([]);
// //   const rowRefs = useRef([]);
// //   const tableRef = useRef(null);

// //   const [activeRowIndex, setActiveRowIndex] = useState(0);  // ✅ Track highlighted txn row
// //   const [checkedRows, setCheckedRows] = useState({});

// //   // Filter Ledger Accounts 
// //   const [showGroupModal, setShowGroupModal] = useState(false);
// //   const [groupedLedgersToPick, setGroupedLedgersToPick] = useState([]);
// //   const [activeGroupIndex, setActiveGroupIndex] = useState(0);
// //   const [currentGroupName, setCurrentGroupName] = useState("");
// //   const [ledgerFromDate, setLedgerFromDate] = useState(null);
// //   const [ledgerToDate, setLedgerToDate] = useState(() => new Date());
// //   const [optionValues, setOptionValues] = useState({
// //     Balance: "Active Balance",
// //     OrderBy: "",
// //     Annexure: "All",
// //     T1: "", // ✅ include T1 (Selected Accounts)
// //     T3: false, // ✅ Print Current Date
// //     T10: false, // ✅ group by BsGroup toggle
// //   });
  
// // useEffect(() => {
// //   const handleGroupModalKeyDown = (e) => {
// //     if (!showGroupModal || !groupedLedgersToPick.length) return;

// //     e.preventDefault(); // 🔹 prevent background scrolling or default browser behavior

// //     if (e.key === "ArrowDown") {
// //       setActiveGroupIndex((prev) => (prev + 1) % groupedLedgersToPick.length);
// //     } else if (e.key === "ArrowUp") {
// //       setActiveGroupIndex((prev) =>
// //         prev === 0 ? groupedLedgersToPick.length - 1 : prev - 1
// //       );
// //     } else if (e.key === "Enter") {
// //       const selectedLedger = groupedLedgersToPick[activeGroupIndex];
// //       setShowGroupModal(false);
// //       fetchLedgerTransactions(selectedLedger);
// //     } else if (e.key === "Escape") {
// //       setShowGroupModal(false);
// //     }
// //   };

// //   window.addEventListener("keydown", handleGroupModalKeyDown);
// //   return () => window.removeEventListener("keydown", handleGroupModalKeyDown);
// // }, [showGroupModal, groupedLedgersToPick, activeGroupIndex]);

// //   useEffect(() => {
// //     if (!ledgerFromDate && dateFrom) {
// //       setLedgerFromDate(new Date(dateFrom));
// //     }
// //   }, [dateFrom, ledgerFromDate]);

// //   // Filters Transactions Account Statement 
// //   const [showOptions, setShowOptions] = useState(false);   // ✅ For Options modal
// //   const [filteredTransactions, setFilteredTransactions] = useState([]); // ✅ For filtered txns
// //   const [selectedRows, setSelectedRows] = useState({});
// //   const [ledgerTotals, setLedgerTotals] = useState({}); // { ledgerId: { netPcs, netWeight } }
// //   const [progressiveDebit, setProgressiveDebit] = useState(0);
// //   const [progressiveCredit, setProgressiveCredit] = useState(0);

// //   const [fromDate, setFromDate] = useState("");
// //   const [toDate, setToDate] = useState(() => new Date());

// //   useEffect(() => {
// //     if (!fromDate && dateFrom) {
// //       setFromDate(new Date(dateFrom));
// //     }
// //   }, [dateFrom, fromDate]);

// //   const handleRowCheckboxChange = (txnId) => {
// //     setSelectedRows((prev) => ({
// //       ...prev,
// //       [txnId]: !prev[txnId], // toggle selection
// //     }));
// //   };

// //   // ✅ Update filtered transactions whenever filters or transactions change
// //   useEffect(() => {
// //     let data = transactions;

// //     // ✅ Filter by Date range
// //     if (fromDate) {
// //       data = data.filter((txn) => new Date(txn.date) >= fromDate);
// //     }
// //     if (toDate) {
// //       data = data.filter((txn) => new Date(txn.date) <= toDate);
// //     }

// //     setFilteredTransactions(data);
// //   }, [
// //     fromDate,
// //     toDate,
// //     transactions,
// //   ]);

// //   const [flaggedRows, setFlaggedRows] = useState(() => {
// //     const saved = localStorage.getItem("flaggedRowsTrail");
// //     return saved ? new Set(JSON.parse(saved)) : new Set();
// //   });

// //   useEffect(() => {
// //     localStorage.setItem("flaggedRowsTrail", JSON.stringify([...flaggedRows]));
// //   }, [flaggedRows]);

// //   // fetch ledger + fa
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const [ledgerRes, faRes] = await Promise.all([
// //           axios.get(
// //             "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount"
// //           ),
// //           axios.get(
// //             "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile"
// //           ),
// //         ]);

// //         const ledgersData = ledgerRes.data.data || [];
// //         const faData = faRes.data.data || [];

// //         const ledgerTotals = {};
// //         faData.forEach((entry) => {
// //           entry.transactions.forEach((txn) => {
// //             const txnDate = new Date(txn.date);
// //             if (ledgerFromDate && txnDate < ledgerFromDate) return;
// //             if (ledgerToDate && txnDate > ledgerToDate) return;

// //             const acc = txn.account.trim();
// //             if (!ledgerTotals[acc]) {
// //               ledgerTotals[acc] = { debit: 0, credit: 0 };
// //             }
// //             if (txn.type.toLowerCase() === "debit") {
// //               ledgerTotals[acc].debit += txn.amount;
// //             } else if (txn.type.toLowerCase() === "credit") {
// //               ledgerTotals[acc].credit += txn.amount;
// //             }
// //           });
// //         });

// //         const enrichedLedgers = ledgersData.map((ledger) => {
// //           const acc = ledger.formData.ahead.trim();
// //           const totals = ledgerTotals[acc] || { debit: 0, credit: 0 };
// //           const balance = totals.debit - totals.credit;
// //           const drcr = balance > 0 ? "DR" : balance < 0 ? "CR" : "NIL";
// //           return {
// //             ...ledger,
// //             totals: { balance, drcr },
// //             hasTxn: !!ledgerTotals[acc],
// //           };
// //         });

// //         setAllLedgers(enrichedLedgers);
// //       } catch (err) {
// //         console.error(err);
// //       }
// //     };

// //     fetchData();
// //   }, [ledgerFromDate, ledgerToDate]);

// //   // apply filters + sorting
// //   useEffect(() => {
// //   let result = [...allLedgers];

// //   // Balance filter
// //   switch (optionValues.Balance) {
// //     case "Active Balance":
// //     result = result.filter((l) => l.totals.balance !== 0);
// //     break;
// //     case "Nil Balance":
// //     result = result.filter((l) => l.totals.balance === 0);
// //     break;
// //     case "Debit Balance":
// //     result = result.filter((l) => l.totals.balance > 0);
// //     break;
// //     case "Credit Balance":
// //     result = result.filter((l) => l.totals.balance < 0);
// //     break;
// //     case "Transacted Account":
// //     result = result.filter((l) => l.hasTxn);
// //     break;
// //     case "Non Transacted Account":
// //     result = result.filter((l) => !l.hasTxn);
// //     break;
// //     case "All Accounts":
// //     default:
// //     break;
// //   }

// //   // Annexure filter
// //   if (optionValues.Annexure && optionValues.Annexure !== "All") {
// //       result = result.filter(
// //       (l) => l.formData.Bsgroup === optionValues.Annexure
// //       );
// //   }

// //   // Sorting
// //   switch (optionValues.OrderBy) {
// //     case "Annexure Wise":
// //     result.sort((a, b) =>
// //         (a.formData.Bsgroup || "").localeCompare(b.formData.Bsgroup || "")
// //     );
// //     break;
// //     case "Account Name Wise":
// //     result.sort((a, b) =>
// //         (a.formData.ahead || "").localeCompare(b.formData.ahead || "")
// //     );
// //     break;
// //     case "City Wise + Name Wise":
// //     result.sort((a, b) => {
// //       const cityComp = (a.formData.city || "").localeCompare(
// //       b.formData.city || ""
// //       );
// //       if (cityComp !== 0) return cityComp;
// //       return (a.formData.ahead || "").localeCompare(b.formData.ahead || "");
// //     });
// //     break;
// //     case "Sorting Order No.Wise":
// //     result.sort(
// //         (a, b) =>
// //         (a.formData.sortingOrderNo || 0) - (b.formData.sortingOrderNo || 0)
// //     );
// //     break;
// //     case "Prefix Annexure Wise":
// //     result.sort((a, b) =>
// //         (a.formData.Bsgroup || "")
// //         .toString()
// //         .charAt(0)
// //         .localeCompare((b.formData.Bsgroup || "").toString().charAt(0))
// //     );
// //     break;
// //     default:
// //     break;
// //   }

// //   setFilteredLedgers(result);
// //   }, [allLedgers, optionValues, checkedRows, searchTerm]);

// //   // Reset selectedIndex ONLY when filters/search change, not checkbox
// //   useEffect(() => {
// //   setSelectedIndex(0);
// //   }, [allLedgers, optionValues, searchTerm]);

  
// //   useEffect(() => {
// //     const reopenModal = (e) => {
// //       const { rowIndex, selectedLedger } = e.detail;
// //       setActiveRowIndex(rowIndex || 0);
// //       if (selectedLedger) openLedgerDetails(selectedLedger);
// //     };

// //     window.addEventListener("reopenTrailModal", reopenModal);
// //     return () => window.removeEventListener("reopenTrailModal", reopenModal);
// //   }, []);

// //   // 🔹 Keyboard navigation inside transactions for Account Statement
// //   useEffect(() => {
// //     const handleKeyDown = (e) => {
// //       if (!transactions.length || !showModal) return; // ✅ Only when modal is open

// //       if (e.key === "ArrowUp") {
// //         setActiveRowIndex((prev) => (prev > 0 ? prev - 1 : prev));
// //       } else if (e.key === "ArrowDown") {
// //         setActiveRowIndex((prev) =>
// //           prev < transactions.length - 1 ? prev + 1 : prev
// //         );
// //       }
// //        else if (e.key === "Escape") {
// //         setShowModal(false); // ✅ Close modal
// //       }
// //     };

// //     window.addEventListener("keydown", handleKeyDown);
// //     return () => window.removeEventListener("keydown", handleKeyDown);
// //   }, [transactions, activeRowIndex, showModal]);

// //   // Handle keyboard navigation for LedgerList
// // useEffect(() => {
// //   const handleKeyDown = (e) => {
// //     // 🔹 Mini modal navigation
// //     if (showGroupModal && groupedLedgersToPick.length) {
// //       e.preventDefault(); // Prevent default scrolling & background nav

// //       if (e.key === "ArrowDown") {
// //         setActiveGroupIndex((prev) => (prev + 1) % groupedLedgersToPick.length);
// //       } else if (e.key === "ArrowUp") {
// //         setActiveGroupIndex((prev) =>
// //           prev === 0 ? groupedLedgersToPick.length - 1 : prev - 1
// //         );
// //       } else if (e.key === "Enter") {
// //         const selectedLedger = groupedLedgersToPick[activeGroupIndex];
// //         setShowGroupModal(false);
// //         fetchLedgerTransactions(selectedLedger);
// //       } else if (e.key === "Escape") {
// //         setShowGroupModal(false);
// //       }

// //       return; // 🔹 stop further handling
// //     }

// //     // 🔹 Account Statement modal navigation
// //     if (showModal && transactions.length) {
// //       e.preventDefault();
// //       if (e.key === "ArrowUp") {
// //         setActiveRowIndex((prev) => (prev > 0 ? prev - 1 : prev));
// //       } else if (e.key === "ArrowDown") {
// //         setActiveRowIndex((prev) =>
// //           prev < transactions.length - 1 ? prev + 1 : prev
// //         );
// //       } else if (e.key === "Escape") {
// //         setShowModal(false);
// //       }

// //       return;
// //     }

// //     // 🔹 Main ledger table navigation
// //     if (!showModal && filteredLedgers.length) {
// //       if (e.key === "ArrowDown") {
// //         e.preventDefault();
// //         setSelectedIndex((prev) => (prev + 1) % filteredLedgers.length);
// //       } else if (e.key === "ArrowUp") {
// //         e.preventDefault();
// //         setSelectedIndex((prev) =>
// //           prev === 0 ? filteredLedgers.length - 1 : prev - 1
// //         );
// //       } else if (e.key === "Enter") {
// //         const ledger = filteredLedgers[selectedIndex];
// //         openLedgerDetails(ledger);
// //       } else if (e.key === "F3") {
// //         e.preventDefault();
// //         setFlaggedRows((prev) => {
// //           const newSet = new Set(prev);
// //           if (newSet.has(selectedIndex)) {
// //             newSet.delete(selectedIndex);
// //           } else {
// //             newSet.add(selectedIndex);
// //           }
// //           return newSet;
// //         });
// //       }
// //     }
// //   };

// //   window.addEventListener("keydown", handleKeyDown);
// //   return () => window.removeEventListener("keydown", handleKeyDown);
// // }, [
// //   showModal,
// //   showGroupModal,
// //   filteredLedgers,
// //   selectedIndex,
// //   transactions,
// //   activeRowIndex,
// //   groupedLedgersToPick,
// //   activeGroupIndex,
// // ]);

// //   // Open modal and fetch transactions
// // const openLedgerDetails = (ledger) => {
// //   if (ledger.groupedLedgers) {
// //     setGroupedLedgersToPick(ledger.groupedLedgers);
// //     setCurrentGroupName(ledger.formData.ahead); // 🔹 store group name
// //     setShowGroupModal(true);
// //   } else {
// //     fetchLedgerTransactions(ledger);
// //   }
// // };
// // const fetchLedgerTransactions = (ledger) => {
// //   setSelectedLedger(ledger);
// //   axios
// //     .get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile")
// //     .then((res) => {
// //       const allTxns = res.data.data || [];

// //       // Flatten transactions and attach saleId from parent voucher
// //       const ledgerTxns = allTxns.flatMap((entry) =>
// //         entry.transactions
// //           .filter((txn) => txn.account.trim() === ledger.formData.ahead.trim())
// //           .map((txn) => ({
// //             ...txn,
// //             saleId: entry.saleId || null,   // attach saleId for Sales
// //             purId: entry.purchaseId || null,   // attach saleId for Sales
// //           }))
// //       );

// //       setTransactions(ledgerTxns);
// //       setShowModal(true);
// //     })
// //     .catch((err) => console.error(err));
// // };


// // // const fetchLedgerTransactions = (ledger) => {
// // //   setSelectedLedger(ledger);
// // //   axios
// // //     .get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile")
// // //     .then((res) => {
// // //       const allTxns = res.data.data || [];
// // //       const ledgerTxns = allTxns.flatMap((entry) =>
// // //         entry.transactions.filter(
// // //           (txn) => txn.account.trim() === ledger.formData.ahead.trim()
// // //         )
// // //       );
// // //       setTransactions(ledgerTxns);
// // //       setShowModal(true);
// // //     })
// // //     .catch((err) => console.error(err));
// // // };
// //   // For calculating net pcs and weight
// //   useEffect(() => {
// //     // Fetch all transactions once
// //     axios.get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile")
// //       .then((res) => {
// //         const allTxns = res.data.data || [];
        
// //         // Compute totals for each ledger
// //         const totals = {};
// //         allLedgers.forEach((ledger) => {
// //           const ledgerTxns = allTxns.flatMap((entry) =>
// //             entry.transactions.filter(
// //               (txn) => txn.account.trim() === ledger.formData.ahead.trim()
// //             )
// //           );

// //           let netWeight = 0;
// //           let netPcs = 0;

// //           ledgerTxns.forEach((txn) => {
// //             if (txn.vtype === "P") {
// //               netWeight += txn.weight || 0;
// //               netPcs += txn.pkgs || 0;
// //             } else if (txn.vtype === "S") {
// //               netWeight -= txn.weight || 0;
// //               netPcs -= txn.pkgs || 0;
// //             }
// //           });

// //           totals[ledger._id] = { netWeight, netPcs };
// //         });

// //         setLedgerTotals(totals);
// //       })
// //       .catch((err) => console.error(err));
// //   }, [allLedgers]);

// //   const handleCheckboxChange = (id) => {
// //     setCheckedRows((prev) => ({
// //       ...prev,
// //       [id]: !prev[id],
// //     }));
// //   };

// //   const formatDate = (date) => {
// //     if (!date) return "";
// //     const d = new Date(date);
// //     const day = String(d.getDate()).padStart(2, "0");
// //     const month = String(d.getMonth() + 1).padStart(2, "0");
// //     const year = d.getFullYear();
// //     return `${day}/${month}/${year}`;
// //   };
// //   const handleTransactionSelect = (txn) => {
// //     if (!txn) return;
// //     const modalState = {
// //       rowIndex: activeRowIndex,
// //       selectedLedger,
// //       keepModalOpen: true,
// //     };

// //     sessionStorage.setItem("trailModalState", JSON.stringify(modalState));

// //     switch (txn.vtype) {   // ✅ use vtype from your transaction object
// //       case "S": // Sale
// //         navigate("/Sale", {
// //           state: {
// //             saleId: txn.saleId
// //           }
// //         // state: {
// //         //    saleId: txn.saleId, // ✅ changed here
// //         // },
// //       });
// //       alert(txn.saleId)
// //         break;
// //       case "P": // Purchase
// //         navigate("/purchase", {
// //         state: {
// //           purId: txn.purId,
// //         },
// //       });
// //       alert(txn.purId)
// //         break;
// //       case "B": // Bank
// //        navigate("/bankvoucher", {
// //         state: {
// //           bankId: txn._id,
// //         },
// //       });
// //         break;
// //       case "C": // Cash
// //         navigate("/cashvoucher", {
// //         state: {
// //           cashId: txn._id,
// //         },
// //       });
// //         break;
// //       case "J": // Journal
// //        navigate("/journalvoucher", {
// //         state: {
// //           journalId: txn._id,
// //         },
// //       });
// //         break;
// //       default:
// //         console.log("Unknown vtype:", txn.vtype);
// //     }
// //   };

// //   return (
// //     <div style={{ padding: "10px" }}>
// //       <Card className="contMain">
// //         <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "10px" }}>
// //           {/* Date Filters */}
// //           <div style={{ display: "flex", flexDirection:"column", alignItems: "center",gap:"10px" }}>
// //             <div style={{display:'flex',flexDirection:'row'}}>
// //             <span className="textform"><b>From:</b></span>
// //             <DatePicker
// //               className="fDate"
// //               selected={ledgerFromDate}
// //               onChange={(date) => setLedgerFromDate(date)}
// //               onChangeRaw={(e) => {
// //                 let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
// //                 if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
// //                 if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9);

// //                 e.target.value = val; // Show formatted input
// //               }}
// //               dateFormat="dd/MM/yyyy"
// //             />
// //             </div>
// //             <div style={{display:'flex',flexDirection:'row'}}>
// //             <span className="textform"><b>To:</b></span>
// //             <DatePicker
// //               className="toDate"
// //               selected={ledgerToDate}
// //               onChange={(date) => setLedgerToDate(date)}
// //               onChangeRaw={(e) => {
// //                 let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
// //                 if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
// //                 if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9);

// //                 e.target.value = val; // Show formatted input
// //               }}
// //               dateFormat="dd/MM/yyyy"
// //             />
// //             </div>
// //           </div>
// //            <h3 className="headerTrail">TRAIL BALANCE</h3>
// //         </div>

// //         <div className="tableT">
// //           <Table size="sm" className="custom-table" hover ref={tableRef}>
// //             <thead style={{ position: "sticky", top: 1, background: "skyblue", fontSize: 17, textAlign: "center" }}>
// //               <tr>
// //                 <th></th>
// //                 <th>NAME</th>
// //                 <th>CITY</th>
// //                 <th>PCS</th>
// //                 <th>QTY</th>
// //                 <th>DEBIT</th>
// //                 <th>CREDIT</th>
// //               </tr>
// //             </thead>

// //             <tbody>
// //               {filteredLedgers.map((ledger, index) => {
// //                 const { balance, drcr } = ledger.totals || {};
// //                 return (
// //                   <tr
// //                     key={ledger._id}
// //                     style={{
// //                       backgroundColor: flaggedRows.has(index)
// //                         ? "red"
// //                         : index === selectedIndex
// //                         ? "rgb(187, 186, 186)"
// //                         : "transparent",
// //                       cursor: "pointer",
// //                       fontSize: 16,
// //                     }}
// //                     onClick={() => openLedgerDetails(ledger)}
// //                     onMouseEnter={() => setSelectedIndex(index)}
// //                   >
// //                     <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
// //                       <input
// //                         style={{ width: "18px", height: "18px", cursor: "pointer" }}
// //                         type="checkbox"
// //                         checked={!!checkedRows[ledger._id]}
// //                         onChange={() => handleCheckboxChange(ledger._id)}
// //                       />
// //                     </td>
// //                     <td>{ledger.formData.ahead}</td>
// //                     <td>{ledger.formData.city}</td>
// //                     <td style={{ textAlign: "right" }}>
// //                       {ledgerTotals[ledger._id]?.netPcs?.toFixed(3) || "0.000"}
// //                     </td>
// //                     <td style={{ textAlign: "right" }}>
// //                       {ledgerTotals[ledger._id]?.netWeight?.toFixed(3) || "0.000"}
// //                     </td>
// //                     <td style={{ textAlign: "right", color: "darkblue", fontWeight:"bold" }}>
// //                       {drcr === "DR" ? Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}

// //                     </td>
// //                     <td style={{ textAlign: "right", color: "red", fontWeight:"bold" }}>
// //                       {drcr === "CR" ? Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}

// //                     </td>
// //                   </tr>
// //                 );
// //               })}
// //             </tbody>

        
// //             <tfoot style={{backgroundColor: "skyblue", position: "sticky", bottom: -8,}}>
// //               <tr style={{ fontWeight: "bold",fontSize:20 }}>
// //                 <td colSpan={3} style={{ textAlign: "right" }}>TOTAL:</td>
// //                 <td></td>
// //                 <td></td>
// //                 <td style={{ textAlign: "right", color: "darkblue" }}>
// //                 {filteredLedgers
// //                   .reduce((sum, ledger) => sum + (ledger.totals?.drcr === "DR" ? Math.abs(ledger.totals.balance) : 0), 0)
// //                   .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
// //                 </td>
// //                 <td style={{ textAlign: "right", color: "red" }}>
// //                 {filteredLedgers
// //                   .reduce((sum, ledger) => sum + (ledger.totals?.drcr === "CR" ? Math.abs(ledger.totals.balance) : 0), 0)
// //                   .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
// //                 </td>
// //               </tr>
// //             </tfoot>
// //           </Table>
// //         </div>
// //       </Card>
// //       {/* ... Modal Account Statement ... */}
// //       <Modal
// //         show={showModal}
// //         onHide={() => {
// //           setShowModal(false);
// //           setActiveRowIndex(0); // ✅ reset highlight when closing modal manually
// //         }}
// //        className="custom-modal"
// //        style={{marginTop:20}}
// //         centered
// //       >
// //         <Modal.Header closeButton>
// //           <Modal.Title>
// //             ACCOUNT STATEMENT
// //             {/* Ledger Details - {selectedLedger?.formData?.ahead} */}
// //           </Modal.Title>
// //         </Modal.Header>
// //         <Modal.Body>
// //           {selectedLedger && (
// //             <div>
// //               <div style={{display:'flex',flexDirection:"row",justifyContent:'space-between'}}>             
// //                 <div style={{display:'flex',flexDirection:'column',textAlign:'center'}}>
// //                   <b style={{fontSize:20}}>{selectedLedger.formData.ahead}{" "}</b> 
// //                   <b style={{fontSize:20}}>{selectedLedger.formData.add1}{" "}</b> 
// //                   <b style={{fontSize:20}}>{selectedLedger.formData.city}{" "}</b> 
// //                   {/* ✅ Closing Balance Display */}
// //                   {transactions.length > 0 && (
// //                     <div style={{ fontSize: "20px" }}>
// //                       {(() => {
// //                         let balance = 0;
// //                         transactions.forEach((txn) => {
// //                           if (txn.type.toLowerCase() === "debit") {
// //                             balance += txn.amount;
// //                           } else if (txn.type.toLowerCase() === "credit") {
// //                             balance -= txn.amount;
// //                           }
// //                         });
// //                         const drcr = balance >= 0 ? "DR" : "CR";
// //                         const color = drcr === "DR" ? "darkblue" : "red";
// //                         return (
// //                           <b style={{ color }}>
// //                             Balance Rs: {Math.abs(balance).toFixed(2)} {drcr}
// //                           </b>
// //                         );
// //                       })()}
// //                     </div>
// //                   )}
// //               </div>
// //               <div style={{display:'flex',flexDirection:'column',textAlign:'center'}}>
// //                 <div style={{display:'flex',flexDirection:"row",alignItems:'center', marginTop:5}}>
// //                   <b style={{fontSize:16,marginRight:"77px"}}>Period</b>
// //                    <TextField
// //                       className="custom-bordered-input"
// //                       size="small"
// //                       value={formatDate(fromDate)}   // 👈 formatted here
// //                       inputProps={{
// //                         maxLength: 48,
// //                         style: {
// //                           height: "10px",
// //                           width:"90px"
// //                         },
// //                       }}
// //                     />
// //                      <TextField
// //                       className="custom-bordered-input"
// //                       size="small"
// //                       value={formatDate(toDate)}   // 👈 formatted here
// //                       inputProps={{
// //                         maxLength: 48,
// //                         style: {
// //                           height: "10px",
// //                           width:"90px"
// //                         },
// //                       }}
// //                     />
// //                 </div>
// //               </div>
// //               </div>

// //               <div className={styles.tableHeight}>
// //                 <Table size="sm" className="custom-table">
// //                   <thead
// //                     style={{
// //                       position: "sticky",
// //                       top: 0,
// //                       background: "skyblue",
// //                       fontSize: 17,
// //                       textAlign: "center",
// //                       zIndex: 2,
// //                     }}
// //                   >
// //                     <tr>
// //                       <th>
// //                         <input
// //                           type="checkbox"
// //                           onChange={(e) => {
// //                             const checked = e.target.checked;
// //                             const newSelections = {};
// //                             filteredTransactions.forEach((txn) => {
// //                               newSelections[txn._id] = checked;
// //                             });
// //                             setSelectedRows(newSelections);
// //                           }}
// //                           checked={
// //                             filteredTransactions.length > 0 &&
// //                             filteredTransactions.every((txn) => selectedRows[txn._id])
// //                           }
// //                         />
// //                       </th>
// //                       <th>Date</th>
// //                       <th>Type</th>
// //                       <th>Narration</th>
// //                       <th>Pcs</th>
// //                       <th>Qty</th>
// //                       <th>Debit</th>
// //                       <th>Credit</th>
// //                       <th>Balance</th>
// //                       <th>DR/CR</th>
// //                     </tr>
// //                   </thead>

// //                   <tbody>
// //                     {transactions.length > 0 ? (
// //                       (() => {
// //                         let balance = 0;
// //                         let totalDebit = 0;
// //                         let totalCredit = 0;

// //                         return filteredTransactions.map((txn,index) => {
// //                           if (txn.type.toLowerCase() === "debit") {
// //                             balance += txn.amount;
// //                             totalDebit += txn.amount;
// //                           } else if (txn.type.toLowerCase() === "credit") {
// //                             balance -= txn.amount;
// //                             totalCredit += txn.amount;
// //                           }

// //                           const drcr = balance >= 0 ? "DR" : "CR";
// //                           const color = drcr === "DR" ? "darkblue" : "red";

// //                           return (
// //                            <tr
// //                             key={txn._id}
// //                             ref={(el) => (rowRefs.current[index] = el)}
// //                             style={{
// //                               fontWeight: "bold",
// //                               fontSize: 16,
// //                               backgroundColor:
// //                                 index === activeRowIndex ? "rgb(187, 186, 186)" : "transparent",
// //                               cursor: "pointer",
// //                             }}
// //                                 onClick={() => {
// //                                     setActiveRowIndex(index);
// //                                     handleTransactionSelect(txn);
// //                                   }}
// //                           >
// //                             <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
// //                                 <input
// //                                 type="checkbox"
// //                                 checked={!!selectedRows[txn._id]}
// //                                 onChange={() => handleRowCheckboxChange(txn._id)}
// //                                 style={{ transform: "scale(1.3)", cursor: "pointer" }}
// //                               />
// //                             </td>
// //                             <td>{new Date(txn.date).toLocaleDateString("en-GB")}</td>
// //                             <td style={{ textAlign: "center" }}>{txn.vtype}</td>
// //                             <td>{txn.narration}</td>
// //                             <td style={{ textAlign: "right" }}>{txn.pkgs}</td>
// //                             <td style={{ textAlign: "right" }}>{txn.weight}</td>                
// //                             <td style={{ textAlign: "right", color: "darkblue" }}>
// //                               {txn.type.toLowerCase() === "debit" ? txn.amount.toFixed(2) : ""}
// //                             </td>
// //                             <td style={{ textAlign: "right", color: "red" }}>
// //                               {txn.type.toLowerCase() === "credit" ? txn.amount.toFixed(2) : ""}
// //                             </td>
// //                             <td style={{ textAlign: "right", color }}>
// //                               {Math.abs(balance).toFixed(2)}
// //                             </td>
// //                             <td style={{ textAlign: "center", fontWeight: "bold", color }}>
// //                               {drcr}
// //                             </td>
// //                            </tr>

// //                           );
// //                         });
// //                       })()
// //                     ) : (
// //                       <tr>
// //                         <td colSpan={10} className="text-center">
// //                           No transactions found
// //                         </td>
// //                       </tr>
// //                     )}
// //                   </tbody>

// //                   {/* ✅ Proper footer row */}
// //                   {transactions.length > 0 && (() => {
// //                     let totalDebit = 0;
// //                     let totalCredit = 0;
// //                     let balance = 0;
// //                     let netWeight = 0;
// //                     let netPcs = 0;

// //                     filteredTransactions.forEach((txn) => {
// //                       if (txn.type.toLowerCase() === "debit") {
// //                         balance += txn.amount;
// //                         totalDebit += txn.amount;
// //                       } else if (txn.type.toLowerCase() === "credit") {
// //                         balance -= txn.amount;
// //                         totalCredit += txn.amount;
// //                       }

// //                       // ✅ Weight handling
// //                       if (txn.vtype === "P") {
// //                         netWeight += txn.weight || 0;   // Purchase positive
// //                       } else if (txn.vtype === "S") {
// //                         netWeight -= txn.weight || 0;   // Sale negative
// //                       }
// //                        // ✅ Pcs handling
// //                       if (txn.vtype === "P") {
// //                         netPcs += txn.pkgs || 0;   // Purchase positive
// //                       } else if (txn.vtype === "S") {
// //                         netPcs -= txn.pkgs || 0;   // Sale negative
// //                       }
// //                     });

// //                     const drcrFinal = balance >= 0 ? "DR" : "CR";
// //                     const colorFinal = drcrFinal === "DR" ? "darkblue" : "red";

// //                     return (
// //                       <tfoot>
// //                         <tr
// //                           style={{
// //                             position: "sticky",
// //                             bottom: -1,
// //                             background: "skyblue",
// //                             fontWeight: "bold",
// //                             fontSize: 16,
// //                           }}
// //                         >
// //                           <td colSpan={4} style={{ textAlign: "center" }}>
// //                             Totals
// //                           </td>
// //                           <td style={{ textAlign: "right"}}>
// //                             {netPcs.toFixed(3)}
// //                           </td>
// //                           {/* ✅ Net weight (sale in minus, purchase in plus) */}
// //                           <td style={{ textAlign: "right" }}>
// //                             {netWeight.toFixed(3)}
// //                           </td>
// //                           <td style={{ textAlign: "right", color: "darkblue" }}>
// //                             {totalDebit.toFixed(2)}
// //                           </td>
// //                           <td style={{ textAlign: "right", color: "red" }}>
// //                             {totalCredit.toFixed(2)}
// //                           </td>
// //                           <td style={{ textAlign: "right", color: colorFinal }}>
// //                             {Math.abs(balance).toFixed(2)}
// //                           </td>
// //                           <td style={{ textAlign: "center", color: colorFinal }}>
// //                             {drcrFinal}
// //                           </td>
// //                         </tr>
// //                       </tfoot>
// //                     );
// //                   })()}
// //                 </Table>
// //               </div>
// //               <div className="d-flex justify-content-between mt-2">
// //               <div>
// //                 <Button  variant="secondary" onClick={() => setShowOptions(true)}>Options</Button>{" "}
// //               </div>
// //             </div>
// //             </div>
// //           )}
// //         </Modal.Body>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default Example;


// // import React, { useState, useEffect, useRef, forwardRef } from "react";
// // import DatePicker from "react-datepicker";
// // import InputMask from "react-input-mask";
// // import "react-datepicker/dist/react-datepicker.css";
// // import "react-toastify/dist/ReactToastify.css";
// // import { ToastContainer, toast } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // // ✅ Forward ref so DatePicker can focus the input
// // const MaskedInput = forwardRef(({ value, onChange, onBlur }, ref) => (
// //   <InputMask
// //     mask="99-99-9999"
// //     maskChar=" "
// //     value={value}
// //     onChange={onChange}
// //     onBlur={onBlur}
// //   >
// //     {(inputProps) => <input {...inputProps} ref={ref} className="DatePICKER" />}
// //   </InputMask>
// // ));

// // const Example = () => {
// //   const datePickerRef = useRef(null);
// //   const customerNameRef = useRef(null);
// //   const [selectedDate, setSelectedDate] = useState(new Date());
// //   const [formData, setFormData] = useState({
// //     date: "",
// //   });

// //   const handleDateChange = (date) => {
// //     if (date instanceof Date && !isNaN(date)) {
// //       setSelectedDate(date);
// //       const formattedDate = date.toISOString().split("T")[0];
// //       setFormData((prev) => ({
// //         ...prev,
// //         date: date,
// //         duedate: date,
// //       }));
// //     }
// //   };

// //   // ✅ Separate function to validate future or past date
// //   const validateDate = (date) => {
// //     if (!date) return;

// //     const today = new Date();
// //     today.setHours(0, 0, 0, 0); // normalize today

// //     const checkDate = new Date(date);
// //     checkDate.setHours(0, 0, 0, 0); // normalize selected date

// //     if (checkDate > today) {
// //       toast.info("You Have Selected a Future Date.", {
// //         position: "top-center",
// //       });
// //     } else if (checkDate < today) {
// //       toast.info("You Have Selected a Past Date.", {
// //         position: "top-center",
// //       });
// //     }
// //   };

// //   const handleCalendarClose = () => {
// //     // If no date is selected when the calendar closes, default to today's date
// //     if (!selectedDate) {
// //       const today = new Date();
// //       setSelectedDate(today);
// //     }
// //   };
// //   return (
// //     <div>
// //       <DatePicker
// //         ref={datePickerRef}
// //         selected={selectedDate || null}
// //         openToDate={new Date()}
// //         onCalendarClose={handleCalendarClose}
// //         dateFormat="dd-MM-yyyy"
// //         onChange={handleDateChange}
// //         onBlur={() => validateDate(selectedDate)}
// //         customInput={<MaskedInput />}
// //       />
// //       <input
// //       ref={customerNameRef}
// //       />
// //     </div>
// //   )
// // }

// // export default Example


// // import React,{useState} from 'react'
// // import DatePicker from "react-datepicker";

// // const Example = () => {
// //   const [ledgerFromDate, setLedgerFromDate] = useState(() => new Date());
// //   return (
// //     <div>
// //       <DatePicker
// //         className="fDate"
// //         selected={ledgerFromDate}
// //         onChange={(date) => setLedgerFromDate(date)}
// //         onChangeRaw={(e) => {
// //           if (!e?.target?.value) return; // ✅ Prevent crash when value is undefined

// //           let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
// //           if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
// //           if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9);

// //           e.target.value = val; // Show formatted input
// //         }}
// //         dateFormat="dd/MM/yyyy"
// //       />
// //     </div>
// //   )
// // }

// // export default Example



// import React, { useState, useEffect } from "react";
// import InputMask from "react-input-mask";

// const Example = () => {
//   const [ledgerFromDate, setLedgerFromDate] = useState("");

//   // ✅ Simulate fetching date from API
//   useEffect(() => {
//     const apiDate = "2025-06-05T10:31:13.346Z"; // example API date
//     const formatted = formatApiDate(apiDate);
//     setLedgerFromDate(formatted);
//   }, []);

//   // ✅ Convert API format → dd/mm/yyyy
//   const formatApiDate = (isoString) => {
//     if (!isoString) return "";
//     const date = new Date(isoString);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <div>
//       <InputMask
//         mask="99/99/9999"
//         placeholder="dd/mm/yyyy"
//         value={ledgerFromDate}
//         onChange={(e) => setLedgerFromDate(e.target.value)}
//         className="fDate"
//       />
//     </div>
//   );
// };

// export default Example;


import React from 'react'
import useCompanySetup from './Shared/useCompanySetup'

const Example = () => {
  const { CompanyState, unitType } = useCompanySetup();
  return (
    <div>
      <h1>{CompanyState}</h1>
    </div>
  )
}

export default Example
