// import React, { useEffect, useState, useRef, useMemo } from "react";
// import axios from "axios";
// import { Table, Card, Button } from "react-bootstrap";
// import "react-datepicker/dist/react-datepicker.css";
// import useCompanySetup from "./Shared/useCompanySetup";
// import OptionModal from "./TrailBalance/OptionModal";

// const Example = () => {
//   const { dateFrom } = useCompanySetup();
//   const tableRef = useRef(null);
//   const [filteredLedgers, setFilteredLedgers] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [checkedRows, setCheckedRows] = useState({});

//   const [isOptionOpen, setIsOptionOpen] = useState(false);
//   const openOptionModal = () => {
//     setIsOptionOpen(true);
//   };
//   const closeOptionModal = () => {
//     setIsOptionOpen(false);
//   };

//   // Filter Ledger Accounts
//   const [ledgerFromDate, setLedgerFromDate] = useState(null);
//   const [ledgerToDate, setLedgerToDate] = useState(() => new Date());

//   useEffect(() => {
//     if (!ledgerFromDate && dateFrom) {
//       setLedgerFromDate(new Date(dateFrom));
//     }
//   }, [dateFrom, ledgerFromDate]);

//   // Fetch ledger list
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

//         const ledgerTotals = {};

//         faData.forEach((entry) => {
//           entry.transactions.forEach((txn) => {
//             const txnDate = new Date(txn.date);

//             if (ledgerFromDate && txnDate < ledgerFromDate) return;
//             if (ledgerToDate && txnDate > ledgerToDate) return;

//             const acc = txn.account.trim();
//             if (!ledgerTotals[acc]) {
//               ledgerTotals[acc] = { debit: 0, credit: 0 };
//             }
//             if (txn.type.toLowerCase() === "debit") {
//               ledgerTotals[acc].debit += txn.amount;
//             } else if (txn.type.toLowerCase() === "credit") {
//               ledgerTotals[acc].credit += txn.amount;
//             }
//           });
//         });

//         const filtered = ledgersData
//           .filter((ledger) => ledgerTotals[ledger.formData.ahead.trim()])
//           .map((ledger) => {
//             const acc = ledger.formData.ahead.trim();
//             const debit = ledgerTotals[acc].debit;
//             const credit = ledgerTotals[acc].credit;
//             const balance = debit - credit;
//             const drcr = balance >= 0 ? "DR" : "CR";
//             return {
//               ...ledger,
//               totals: {
//                 balance,
//                 drcr,
//               },
//             };
//           });

//         setFilteredLedgers(filtered);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchData();
//   }, [ledgerFromDate, ledgerToDate]);

//   const handleCheckboxChange = (id) => {
//     setCheckedRows((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   // ✅ Compute selected debit/credit sums
//   const { selectedDebit, selectedCredit } = useMemo(() => {
//     let debitSum = 0;
//     let creditSum = 0;

//     filteredLedgers.forEach((ledger) => {
//       if (checkedRows[ledger._id]) {
//         const { balance, drcr } = ledger.totals || {};
//         if (drcr === "DR") debitSum += Math.abs(balance);
//         if (drcr === "CR") creditSum += Math.abs(balance);
//       }
//     });

//     return {
//       selectedDebit: debitSum,
//       selectedCredit: creditSum,
//     };
//   }, [checkedRows, filteredLedgers]);

//   return (
//     <div>
//       <Card className="contMain">
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             marginBottom: "10px",
//           }}
//         >
//           <h3 className="headerTrail">TRAIL BALANCE</h3>
//           <div style={{ display: "flex", flexDirection: "column" }}>
//             <div style={{ display: "flex", flexDirection: "row" }}>
//               <span style={{ fontSize: 20 }} className="textform">
//                 Selected Debit:
//               </span>
//               <input
//                 style={{ marginLeft: 15 }}
//                 className="value"
//                 value={selectedDebit.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//                 readOnly
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
//             >
//               <span style={{ fontSize: 20 }} className="textform">
//                 Selected Credit:
//               </span>
//               <input
//                 style={{ marginLeft: 7 }}
//                 className="value"
//                 value={selectedCredit.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//                 readOnly
//               />
//             </div>
//           </div>
//         </div>

//         <div className="tableT">
//           <Table size="sm" className="custom-table" hover ref={tableRef}>
//             <thead style={{ position: "sticky", top: 1, background: "skyblue", fontSize: 17, textAlign: "center" }}>
//               <tr>
//                 <th></th>
//                 <th>NAME</th>
//                 <th>CITY</th>
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
//                     style={{
//                       cursor: "pointer",
//                       fontSize: 16,
//                     }}
//                     onMouseEnter={() => setSelectedIndex(index)}
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

//             {/* ✅ Footer for totals */}
//             <tfoot style={{backgroundColor: "skyblue", position: "sticky", bottom: -8,}}>
//               <tr style={{ fontWeight: "bold",fontSize:20 }}>
//                 <td colSpan={3} style={{ textAlign: "right" }}>TOTAL:</td>
//                 <td style={{ textAlign: "right", color: "darkblue" }}>
//                 {filteredLedgers
//                   .reduce((sum, ledger) => sum + (ledger.totals?.drcr === "DR" ? Math.abs(ledger.totals.balance) : 0), 0)
//                   .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//                 <td style={{ textAlign: "right", color: "red" }}>
//                 {filteredLedgers
//                   .reduce((sum, ledger) => sum + (ledger.totals?.drcr === "CR" ? Math.abs(ledger.totals.balance) : 0), 0)
//                   .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                 </td>
//               </tr>
//             </tfoot>
//           </Table>
//         </div>
//       </Card>
//       <Button variant="primary" sx={{ mt: 2 }} onClick={openOptionModal}> Options</Button>
//       <OptionModal isOpen={isOptionOpen} onClose={closeOptionModal}/> 
//     </div>
//   );
// };

// export default Example;

// NEW CODE AFTER REFACTORING
// import React, { useEffect, useState, useRef, useMemo } from "react";
// import axios from "axios";
// import { Table, Card, Button } from "react-bootstrap";
// import "react-datepicker/dist/react-datepicker.css";
// import useCompanySetup from "./Shared/useCompanySetup";
// import OptionModal from "./TrailBalance/OptionModal";

// const Example = () => {
//   const { dateFrom } = useCompanySetup();
//   const tableRef = useRef(null);

//   const [allLedgers, setAllLedgers] = useState([]); // keep full list
//   const [filteredLedgers, setFilteredLedgers] = useState([]);
//   const [checkedRows, setCheckedRows] = useState({});
//   const [selectedIndex, setSelectedIndex] = useState(0);

//   const [ledgerFromDate, setLedgerFromDate] = useState(null);
//   const [ledgerToDate, setLedgerToDate] = useState(() => new Date());

//   const [isOptionOpen, setIsOptionOpen] = useState(false);
//   const [optionValues, setOptionValues] = useState({
//     Balance: "Active Balance", // default
//   });

//   const openOptionModal = () => setIsOptionOpen(true);
//   const closeOptionModal = () => setIsOptionOpen(false);

//   // fetch ledger + fa data
//   useEffect(() => {
//     if (!ledgerFromDate && dateFrom) {
//       setLedgerFromDate(new Date(dateFrom));
//     }
//   }, [dateFrom, ledgerFromDate]);

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

//         const ledgerTotals = {};
//         faData.forEach((entry) => {
//           entry.transactions.forEach((txn) => {
//             const txnDate = new Date(txn.date);
//             if (ledgerFromDate && txnDate < ledgerFromDate) return;
//             if (ledgerToDate && txnDate > ledgerToDate) return;

//             const acc = txn.account.trim();
//             if (!ledgerTotals[acc]) {
//               ledgerTotals[acc] = { debit: 0, credit: 0 };
//             }
//             if (txn.type.toLowerCase() === "debit") {
//               ledgerTotals[acc].debit += txn.amount;
//             } else if (txn.type.toLowerCase() === "credit") {
//               ledgerTotals[acc].credit += txn.amount;
//             }
//           });
//         });

//         const enrichedLedgers = ledgersData.map((ledger) => {
//           const acc = ledger.formData.ahead.trim();
//           const totals = ledgerTotals[acc] || { debit: 0, credit: 0 };
//           const balance = totals.debit - totals.credit;
//           const drcr = balance > 0 ? "DR" : balance < 0 ? "CR" : "NIL";
//           return {
//             ...ledger,
//             totals: { balance, drcr },
//             hasTxn: !!ledgerTotals[acc], // flag for transacted accounts
//           };
//         });

//         setAllLedgers(enrichedLedgers);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchData();
//   }, [ledgerFromDate, ledgerToDate]);

//   // apply OptionModal filter
//     // apply filters + sorting
//   useEffect(() => {
//     let result = [...allLedgers];

//     // 🔹 Balance filter
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
//       case "Transacted Account":
//         result = result.filter((l) => l.hasTxn);
//         break;
//       case "Non Transacted Account":
//         result = result.filter((l) => !l.hasTxn);
//         break;
//       case "All Accounts":
//         break;
//       default:
//         break;
//     }

//     // 🔹 Annexure filter
//     if (optionValues.Annexure && optionValues.Annexure !== "All") {
//       result = result.filter(
//         (l) => l.formData.Bsgroup === optionValues.Annexure
//       );
//     }

//     // 🔹 Sorting (Order By)
//     switch (optionValues.OrderBy) {
//       case "Annexure Wise":
//         result.sort((a, b) =>
//           (a.formData.Bsgroup || "").localeCompare(b.formData.anexure || "")
//         );
//         break;
//       case "Account Name Wise":
//         result.sort((a, b) =>
//           (a.formData.ahead || "").localeCompare(b.formData.ahead || "")
//         );
//         break;
//       case "City Wise + Name Wise":
//         result.sort((a, b) => {
//           const cityComp = (a.formData.city || "").localeCompare(
//             b.formData.city || ""
//           );
//           if (cityComp !== 0) return cityComp;
//           return (a.formData.ahead || "").localeCompare(b.formData.ahead || "");
//         });
//         break;
//       case "Sorting Order No.Wise":
//         result.sort(
//           (a, b) =>
//             (a.formData.sortingOrderNo || 0) -
//             (b.formData.sortingOrderNo || 0)
//         );
//         break;
//       case "Prefix Annexure Wise":
//         result.sort((a, b) =>
//           (a.formData.anexure || "")
//             .toString()
//             .charAt(0)
//             .localeCompare((b.formData.Bsgroup || "").toString().charAt(0))
//         );
//         break;
//       default:
//         break;
//     }

//     setFilteredLedgers(result);
//   }, [allLedgers, optionValues]);

//   const handleCheckboxChange = (id) => {
//     setCheckedRows((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   const { selectedDebit, selectedCredit } = useMemo(() => {
//     let debitSum = 0;
//     let creditSum = 0;
//     filteredLedgers.forEach((ledger) => {
//       if (checkedRows[ledger._id]) {
//         const { balance, drcr } = ledger.totals || {};
//         if (drcr === "DR") debitSum += Math.abs(balance);
//         if (drcr === "CR") creditSum += Math.abs(balance);
//       }
//     });
//     return { selectedDebit: debitSum, selectedCredit: creditSum };
//   }, [checkedRows, filteredLedgers]);

//   return (
//     <div>
//       <Card className="contMain">
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             marginBottom: "10px",
//           }}
//         >
//           <h3 className="headerTrail">TRAIL BALANCE</h3>
//           <div style={{ display: "flex", flexDirection: "column" }}>
//             <div style={{ display: "flex", flexDirection: "row" }}>
//               <span style={{ fontSize: 20 }} className="textform">
//                 Selected Debit:
//               </span>
//               <input
//                 style={{ marginLeft: 15 }}
//                 className="value"
//                 value={selectedDebit.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//                 readOnly
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
//             >
//               <span style={{ fontSize: 20 }} className="textform">
//                 Selected Credit:
//               </span>
//               <input
//                 style={{ marginLeft: 7 }}
//                 className="value"
//                 value={selectedCredit.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//                 readOnly
//               />
//             </div>
//           </div>
//         </div>

//         <div className="tableT">
//           <Table
//             size="sm"
//             className="custom-table"
//             hover
//             ref={tableRef}
//           >
//             <thead
//               style={{
//                 position: "sticky",
//                 top: 1,
//                 background: "skyblue",
//                 fontSize: 17,
//                 textAlign: "center",
//               }}
//             >
//               <tr>
//                 <th></th>
//                 <th>NAME</th>
//                 <th>CITY</th>
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
//                     style={{ cursor: "pointer", fontSize: 16 }}
//                     onMouseEnter={() => setSelectedIndex(index)}
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
//                     <td style={{ textAlign: "right", color: "darkblue", fontWeight: "bold" }}>
//                       {drcr === "DR"
//                         ? Math.abs(balance).toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })
//                         : ""}
//                     </td>
//                     <td style={{ textAlign: "right", color: "red", fontWeight: "bold" }}>
//                       {drcr === "CR"
//                         ? Math.abs(balance).toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })
//                         : ""}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>

//             <tfoot style={{ backgroundColor: "skyblue", position: "sticky", bottom: -8 }}>
//               <tr style={{ fontWeight: "bold", fontSize: 20 }}>
//                 <td colSpan={3} style={{ textAlign: "right" }}>
//                   TOTAL:
//                 </td>
//                 <td style={{ textAlign: "right", color: "darkblue" }}>
//                   {filteredLedgers
//                     .reduce(
//                       (sum, l) =>
//                         sum + (l.totals?.drcr === "DR" ? Math.abs(l.totals.balance) : 0),
//                       0
//                     )
//                     .toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                 </td>
//                 <td style={{ textAlign: "right", color: "red" }}>
//                   {filteredLedgers
//                     .reduce(
//                       (sum, l) =>
//                         sum + (l.totals?.drcr === "CR" ? Math.abs(l.totals.balance) : 0),
//                       0
//                     )
//                     .toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                 </td>
//               </tr>
//             </tfoot>
//           </Table>
//         </div>
//       </Card>

//       <Button variant="primary" sx={{ mt: 2 }} onClick={openOptionModal}>
//         Options
//       </Button>

//       <OptionModal
//         isOpen={isOptionOpen}
//         onClose={closeOptionModal}
//         onApply={(values) => setOptionValues(values)} // ✅ capture OptionModal values
//       />
//     </div>
//   );
// };

// export default Example;



import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { Table, Card, Button } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import useCompanySetup from "./Shared/useCompanySetup";
import OptionModal from "./TrailBalance/OptionModal";

const Example = () => {
  const { dateFrom } = useCompanySetup();
  const tableRef = useRef(null);

  const [allLedgers, setAllLedgers] = useState([]); 
  const [filteredLedgers, setFilteredLedgers] = useState([]);
  const [checkedRows, setCheckedRows] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [ledgerFromDate, setLedgerFromDate] = useState(null);
  const [ledgerToDate, setLedgerToDate] = useState(() => new Date());

  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [optionValues, setOptionValues] = useState({
    Balance: "Active Balance",
    OrderBy: "",
    Annexure: "All",
    T1: "", // ✅ include T1 (Selected Accounts)
  });

  const openOptionModal = () => setIsOptionOpen(true);
  const closeOptionModal = () => setIsOptionOpen(false);

  // init date range
  useEffect(() => {
    if (!ledgerFromDate && dateFrom) {
      setLedgerFromDate(new Date(dateFrom));
    }
  }, [dateFrom, ledgerFromDate]);

  // fetch ledger + fa
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

        const ledgerTotals = {};
        faData.forEach((entry) => {
          entry.transactions.forEach((txn) => {
            const txnDate = new Date(txn.date);
            if (ledgerFromDate && txnDate < ledgerFromDate) return;
            if (ledgerToDate && txnDate > ledgerToDate) return;

            const acc = txn.account.trim();
            if (!ledgerTotals[acc]) {
              ledgerTotals[acc] = { debit: 0, credit: 0 };
            }
            if (txn.type.toLowerCase() === "debit") {
              ledgerTotals[acc].debit += txn.amount;
            } else if (txn.type.toLowerCase() === "credit") {
              ledgerTotals[acc].credit += txn.amount;
            }
          });
        });

        const enrichedLedgers = ledgersData.map((ledger) => {
          const acc = ledger.formData.ahead.trim();
          const totals = ledgerTotals[acc] || { debit: 0, credit: 0 };
          const balance = totals.debit - totals.credit;
          const drcr = balance > 0 ? "DR" : balance < 0 ? "CR" : "NIL";
          return {
            ...ledger,
            totals: { balance, drcr },
            hasTxn: !!ledgerTotals[acc],
          };
        });

        setAllLedgers(enrichedLedgers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [ledgerFromDate, ledgerToDate]);

  // apply filters + sorting
  useEffect(() => {
    let result = [...allLedgers];

    // 🔹 Balance filter
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
      case "Transacted Account":
        result = result.filter((l) => l.hasTxn);
        break;
      case "Non Transacted Account":
        result = result.filter((l) => !l.hasTxn);
        break;
      case "All Accounts":
      default:
        break;
    }

    // 🔹 Annexure filter
    if (optionValues.Annexure && optionValues.Annexure !== "All") {
      result = result.filter(
        (l) => l.formData.Bsgroup === optionValues.Annexure
      );
    }

    // 🔹 Sorting (Order By)
    switch (optionValues.OrderBy) {
      case "Annexure Wise":
        result.sort((a, b) =>
          (a.formData.Bsgroup || "").localeCompare(b.formData.Bsgroup || "")
        );
        break;
      case "Account Name Wise":
        result.sort((a, b) =>
          (a.formData.ahead || "").localeCompare(b.formData.ahead || "")
        );
        break;
      case "City Wise + Name Wise":
        result.sort((a, b) => {
          const cityComp = (a.formData.city || "").localeCompare(
            b.formData.city || ""
          );
          if (cityComp !== 0) return cityComp;
          return (a.formData.ahead || "").localeCompare(b.formData.ahead || "");
        });
        break;
      case "Sorting Order No.Wise":
        result.sort(
          (a, b) =>
            (a.formData.sortingOrderNo || 0) - (b.formData.sortingOrderNo || 0)
        );
        break;
      case "Prefix Annexure Wise":
        result.sort((a, b) =>
          (a.formData.Bsgroup || "")
            .toString()
            .charAt(0)
            .localeCompare((b.formData.Bsgroup || "").toString().charAt(0))
        );
        break;
      default:
        break;
    }

      // 🔹 T1 = Selected Accounts filter
    if (optionValues.T1) {
      result = result.filter((l) => !!checkedRows[l._id]);
    }


    setFilteredLedgers(result);
  }, [allLedgers, optionValues, checkedRows]); // ✅ add checkedRows here


  const handleCheckboxChange = (id) => {
    setCheckedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const { selectedDebit, selectedCredit } = useMemo(() => {
    let debitSum = 0;
    let creditSum = 0;
    filteredLedgers.forEach((ledger) => {
      if (checkedRows[ledger._id]) {
        const { balance, drcr } = ledger.totals || {};
        if (drcr === "DR") debitSum += Math.abs(balance);
        if (drcr === "CR") creditSum += Math.abs(balance);
      }
    });
    return { selectedDebit: debitSum, selectedCredit: creditSum };
  }, [checkedRows, filteredLedgers]);

  return (
    <div>
      <Card className="contMain">
        {/* HEADER */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          <h3 className="headerTrail">TRAIL BALANCE</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <span style={{ fontSize: 20 }} className="textform">
                Selected Debit:
              </span>
              <input
                style={{ marginLeft: 15 }}
                className="value"
                value={selectedDebit.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                readOnly
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
            >
              <span style={{ fontSize: 20 }} className="textform">
                Selected Credit:
              </span>
              <input
                style={{ marginLeft: 7 }}
                className="value"
                value={selectedCredit.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="tableT">
          <Table size="sm" className="custom-table" hover ref={tableRef}>
            <thead
              style={{
                position: "sticky",
                top: 1,
                background: "skyblue",
                fontSize: 17,
                textAlign: "center",
              }}
            >
              <tr>
                <th></th>
                <th>NAME</th>
                <th>CITY</th>
                <th>DEBIT</th>
                <th>CREDIT</th>
              </tr>
            </thead>

            <tbody>
              {filteredLedgers.map((ledger, index) => {
                const { balance, drcr } = ledger.totals || {};
                return (
                  <tr
                    key={ledger._id}
                    style={{ cursor: "pointer", fontSize: 16 }}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <td
                      style={{ textAlign: "center" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                        type="checkbox"
                        checked={!!checkedRows[ledger._id]}
                        onChange={() => handleCheckboxChange(ledger._id)}
                      />
                    </td>
                    <td>{ledger.formData.ahead}</td>
                    <td>{ledger.formData.city}</td>
                    <td
                      style={{
                        textAlign: "right",
                        color: "darkblue",
                        fontWeight: "bold",
                      }}
                    >
                      {drcr === "DR"
                        ? Math.abs(balance).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : ""}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      {drcr === "CR"
                        ? Math.abs(balance).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : ""}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            <tfoot
              style={{
                backgroundColor: "skyblue",
                position: "sticky",
                bottom: -8,
              }}
            >
              <tr style={{ fontWeight: "bold", fontSize: 20 }}>
                <td colSpan={3} style={{ textAlign: "right" }}>
                  TOTAL:
                </td>
                <td style={{ textAlign: "right", color: "darkblue" }}>
                  {filteredLedgers
                    .reduce(
                      (sum, l) =>
                        sum +
                        (l.totals?.drcr === "DR"
                          ? Math.abs(l.totals.balance)
                          : 0),
                      0
                    )
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </td>
                <td style={{ textAlign: "right", color: "red" }}>
                  {filteredLedgers
                    .reduce(
                      (sum, l) =>
                        sum +
                        (l.totals?.drcr === "CR"
                          ? Math.abs(l.totals.balance)
                          : 0),
                      0
                    )
                    .toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </Card>

      <Button variant="primary" sx={{ mt: 2 }} onClick={openOptionModal}>
        Options
      </Button>

      <OptionModal
        isOpen={isOptionOpen}
        onClose={closeOptionModal}
        onApply={(values) => setOptionValues(values)} // ✅ capture all values (Balance, OrderBy, Annexure, T1...)
      />
    </div>
  );
};

export default Example;
