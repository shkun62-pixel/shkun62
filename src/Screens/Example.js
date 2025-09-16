// import React, { useEffect, useState, useRef, useMemo } from "react";
// import axios from "axios";
// import { Table, Card } from "react-bootstrap";
// import "react-datepicker/dist/react-datepicker.css";
// import useCompanySetup from "./Shared/useCompanySetup";

// const Example = () => {
//   const { dateFrom } = useCompanySetup();
//   const tableRef = useRef(null);
//   const [filteredLedgers, setFilteredLedgers] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [checkedRows, setCheckedRows] = useState({});

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
//         <Table
//   size="sm"
//   className="custom-table shadow-sm"
//   hover
//   bordered
//   ref={tableRef}
//   style={{
//     borderRadius: "10px",
//     overflow: "hidden",
//     backgroundColor: "white",
//   }}
// >
//   <thead
//     style={{
//       position: "sticky",
//       top: 0,
//       background: "linear-gradient(to right, #4facfe, #00f2fe)",
//       color: "white",
//       fontSize: 16,
//       textAlign: "center",
//       zIndex: 2,
//     }}
//   >
//     <tr>
//       <th style={{ width: "60px" }}></th>
//       <th>NAME</th>
//       <th>CITY</th>
//       <th>DEBIT</th>
//       <th>CREDIT</th>
//     </tr>
//   </thead>

//   <tbody>
//     {filteredLedgers.map((ledger, index) => {
//       const { balance, drcr } = ledger.totals || {};
//       return (
//         <tr
//           key={ledger._id}
//           style={{
//             cursor: "pointer",
//             fontSize: 15,
//             backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white", // striped
//             transition: "all 0.2s ease-in-out",
//           }}
//           onMouseEnter={(e) =>
//             (e.currentTarget.style.backgroundColor = "#e6f7ff")
//           }
//           onMouseLeave={(e) =>
//             (e.currentTarget.style.backgroundColor =
//               index % 2 === 0 ? "#f9f9f9" : "white")
//           }
//           onClick={() => setSelectedIndex(index)}
//         >
//           <td
//             style={{ textAlign: "center" }}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <input
//               type="checkbox"
//               checked={!!checkedRows[ledger._id]}
//               onChange={() => handleCheckboxChange(ledger._id)}
//             />
//           </td>
//           <td style={{ fontWeight: "500" }}>{ledger.formData.ahead}</td>
//           <td>{ledger.formData.city}</td>
//           <td
//             style={{
//               textAlign: "right",
//               color: "darkblue",
//               fontWeight: "600",
//             }}
//           >
//             {drcr === "DR"
//               ? Math.abs(balance).toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })
//               : ""}
//           </td>
//           <td
//             style={{
//               textAlign: "right",
//               color: "red",
//               fontWeight: "600",
//             }}
//           >
//             {drcr === "CR"
//               ? Math.abs(balance).toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })
//               : ""}
//           </td>
//         </tr>
//       );
//     })}
//   </tbody>

//   {/* ✅ Footer for totals */}
//   <tfoot
//     style={{
//       background: "linear-gradient(to right, #4facfe, #00f2fe)",
//       color: "white",
//       position: "sticky",
//       bottom: -1,
//       fontSize: 16,
//     }}
//   >
//     <tr style={{ fontWeight: "bold" }}>
//       <td colSpan={3} style={{ textAlign: "right" }}>
//         TOTAL:
//       </td>
//       <td style={{ textAlign: "right" }}>
//         {filteredLedgers
//           .reduce(
//             (sum, ledger) =>
//               sum +
//               (ledger.totals?.drcr === "DR"
//                 ? Math.abs(ledger.totals.balance)
//                 : 0),
//             0
//           )
//           .toLocaleString(undefined, {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           })}
//       </td>
//       <td style={{ textAlign: "right" }}>
//         {filteredLedgers
//           .reduce(
//             (sum, ledger) =>
//               sum +
//               (ledger.totals?.drcr === "CR"
//                 ? Math.abs(ledger.totals.balance)
//                 : 0),
//             0
//           )
//           .toLocaleString(undefined, {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2,
//           })}
//       </td>
//     </tr>
//   </tfoot>
// </Table>

//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Example;

import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
} from "@mui/material";
import useCompanySetup from "./Shared/useCompanySetup";
import OptionModal from "./TrailBalance/OptionModal"
import { Button } from "react-bootstrap";

const Example = () => {
  const { dateFrom } = useCompanySetup();
  const [filteredLedgers, setFilteredLedgers] = useState([]);
  const [checkedRows, setCheckedRows] = useState({});
  const [ledgerFromDate, setLedgerFromDate] = useState(null);
  const [ledgerToDate, setLedgerToDate] = useState(() => new Date());
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const openOptionModal = () => {
    setIsOptionOpen(true);
  };
  const closeOptionModal = () => {
    setIsOptionOpen(false);
  };

  useEffect(() => {
    if (!ledgerFromDate && dateFrom) {
      setLedgerFromDate(new Date(dateFrom));
    }
  }, [dateFrom, ledgerFromDate]);

  // Fetch data
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

        const filtered = ledgersData
          .filter((ledger) => ledgerTotals[ledger.formData.ahead.trim()])
          .map((ledger) => {
            const acc = ledger.formData.ahead.trim();
            const debit = ledgerTotals[acc].debit;
            const credit = ledgerTotals[acc].credit;
            const balance = debit - credit;
            const drcr = balance >= 0 ? "DR" : "CR";
            return {
              ...ledger,
              totals: { balance, drcr },
            };
          });

        setFilteredLedgers(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [ledgerFromDate, ledgerToDate]);

  const handleCheckboxChange = (id) => {
    setCheckedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Calculate selected debit/credit
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
    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 3 }}>
      {/* Header */}
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Grid item>
          <Typography variant="h5" fontWeight="bold" color="primary">
            Trail Balance
          </Typography>
        </Grid>

        <Grid item>
          <Grid container spacing={2}>
            <Grid item>
              <TextField
                label="Selected Debit"
                value={selectedDebit.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Selected Credit"
                value={selectedCredit.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{ maxHeight: 450, borderRadius: 2 }}
      >
        <Table
          stickyHeader
          size="small"
          sx={{
            "& .MuiTableCell-root": {
              border: "1px solid #ccc", // 👈 all cells get border
            },
            "& .MuiTableHead-root .MuiTableCell-root": {
              background: "skyblue",
              color: "white",
              fontWeight: "bold",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>City</TableCell>
              <TableCell align="right">Debit</TableCell>
              <TableCell align="right">Credit</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredLedgers.map((ledger, index) => {
              const { balance, drcr } = ledger.totals || {};
              return (
                <TableRow
                  key={ledger._id}
                  hover
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#fafafa" : "white",
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={!!checkedRows[ledger._id]}
                      onChange={() => handleCheckboxChange(ledger._id)}
                    />
                  </TableCell>
                  <TableCell>{ledger.formData.ahead}</TableCell>
                  <TableCell>{ledger.formData.city}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "darkblue", fontWeight: "bold" }}
                  >
                    {drcr === "DR"
                      ? Math.abs(balance).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : ""}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: "red", fontWeight: "bold" }}
                  >
                    {drcr === "CR"
                      ? Math.abs(balance).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : ""}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>

          {/* Sticky Total Row */}
          <tfoot>
            <TableRow
              sx={{
                position: "sticky",
                bottom: 0,
                background: "linear-gradient(to right, #4facfe, #00f2fe)",
                color: "white",
              }}
            >
              <TableCell colSpan={3} align="right" sx={{ fontWeight: "bold" }}>
                TOTAL:
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {filteredLedgers
                  .reduce(
                    (sum, ledger) =>
                      sum +
                      (ledger.totals?.drcr === "DR"
                        ? Math.abs(ledger.totals.balance)
                        : 0),
                    0
                  )
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {filteredLedgers
                  .reduce(
                    (sum, ledger) =>
                      sum +
                      (ledger.totals?.drcr === "CR"
                        ? Math.abs(ledger.totals.balance)
                        : 0),
                    0
                  )
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </TableCell>
            </TableRow>
          </tfoot>
        </Table>
      </TableContainer>
      <Button variant="primary" sx={{ mt: 2 }} onClick={openOptionModal}> Options</Button>
      <OptionModal isOpen={isOptionOpen} onClose={closeOptionModal}/> 
    </Card>
  );
};

export default Example;
