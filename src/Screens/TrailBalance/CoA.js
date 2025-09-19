// import React, { useRef } from "react";
// import { Modal, Box, Button } from "@mui/material";
// import { useReactToPrint } from "react-to-print";
// import useCompanySetup from "../Shared/useCompanySetup";

// const CoA = ({ isOpen, handleClose, filteredTransactions = [], ledgerFrom, ledgerTo, currentDate }) => {
//   const { companyName, companyAdd, companyCity } = useCompanySetup();
//   const componentRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
//   };

//   // ✅ Calculate totals
//   let totalDebit = 0, totalCredit = 0, balance = 0;
//   filteredTransactions.forEach((txn) => {
//     if (txn.type.toLowerCase() === "debit") {
//       balance += txn.amount;
//       totalDebit += txn.amount;
//     } else if (txn.type.toLowerCase() === "credit") {
//       balance -= txn.amount;
//       totalCredit += txn.amount;
//     }
//   });
//   const drcrFinal = balance >= 0 ? "DR" : "CR";
//   const colorFinal = drcrFinal === "DR" ? "darkblue" : "red";

//   return (
//     <Modal style={{zIndex:100000}} open={isOpen} onClose={handleClose}>
//       <Box sx={{ bgcolor: "white", p: 3, maxHeight: "100vh", overflowY: "auto" }}>
//         {/* Buttons */}
//         <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
//           <Button variant="contained" onClick={handlePrint} style={{ background: "lightcoral", marginRight: 10 }}>
//             Print
//           </Button>
//           <Button onClick={handleClose} style={{ background: "darkred", color: "white" }}>Close</Button>
//         </Box>

//         {/* Printable area */}
//         <div ref={componentRef} style={{ width: "290mm", padding: "20px" }}>
//           {/* Header */}
//           <h1 style={{ textAlign: "center", fontWeight: "bold", fontSize: "35px", color: "darkblue" }}>
//             {companyName?.toUpperCase()}
//           </h1>
//           <p style={{ textAlign: "center", margin: 0 }}>{companyAdd}</p>
//           <p style={{ textAlign: "center", margin: 0 }}>{companyCity}</p>
//           {currentDate && (
//             <h3 style={{ textAlign: "right", fontSize: "16px" }}>
//               Print Date: {formatDate(currentDate)}
//             </h3>
//           )}
//           <h2 style={{ textAlign: "center", margin: "10px 0" }}>
//             Ledger Statement ({formatDate(ledgerFrom)} - {formatDate(ledgerTo)})
//           </h2>

//           {/* Table */}
//           <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
//             <thead>
//               <tr style={{ background: "#ddd", fontSize: 16 }}>
//                 <th style={{ border: "1px solid black", padding: "6px" }}>Date</th>
//                 <th style={{ border: "1px solid black", padding: "6px" }}>Type</th>
//                 <th style={{ border: "1px solid black", padding: "6px" }}>Narration</th>
//                 <th style={{ border: "1px solid black", padding: "6px" }}>Debit</th>
//                 <th style={{ border: "1px solid black", padding: "6px" }}>Credit</th>
//                 <th style={{ border: "1px solid black", padding: "6px" }}>Balance</th>
//                 <th style={{ border: "1px solid black", padding: "6px" }}>DR/CR</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredTransactions.map((txn, i) => {
//                 if (txn.type.toLowerCase() === "debit") {
//                   balance += txn.amount;
//                 } else if (txn.type.toLowerCase() === "credit") {
//                   balance -= txn.amount;
//                 }
//                 const drcr = balance >= 0 ? "DR" : "CR";
//                 const color = drcr === "DR" ? "darkblue" : "red";

//                 return (
//                   <tr key={i} style={{ fontSize: 15 }}>
//                     <td style={{ border: "1px solid black", padding: "6px" }}>{new Date(txn.date).toLocaleDateString("en-GB")}</td>
//                     <td style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>{txn.vtype}</td>
//                     <td style={{ border: "1px solid black", padding: "6px" }}>{txn.narration}</td>
//                     <td style={{ border: "1px solid black", padding: "6px", textAlign: "right", color: "darkblue" }}>
//                       {txn.type.toLowerCase() === "debit" ? txn.amount.toFixed(2) : ""}
//                     </td>
//                     <td style={{ border: "1px solid black", padding: "6px", textAlign: "right", color: "red" }}>
//                       {txn.type.toLowerCase() === "credit" ? txn.amount.toFixed(2) : ""}
//                     </td>
//                     <td style={{ border: "1px solid black", padding: "6px", textAlign: "right", color }}>
//                       {Math.abs(balance).toFixed(2)}
//                     </td>
//                     <td style={{ border: "1px solid black", padding: "6px", textAlign: "center", color }}>
//                       {drcr}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//             <tfoot>
//               <tr style={{ fontWeight: "bold", background: "#f2f2f2", fontSize: 16 }}>
//                 <td colSpan={3} style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
//                   Totals
//                 </td>
//                 <td style={{ border: "1px solid black", padding: "6px", textAlign: "right", color: "darkblue" }}>
//                   {totalDebit.toFixed(2)}
//                 </td>
//                 <td style={{ border: "1px solid black", padding: "6px", textAlign: "right", color: "red" }}>
//                   {totalCredit.toFixed(2)}
//                 </td>
//                 <td style={{ border: "1px solid black", padding: "6px", textAlign: "right", color: colorFinal }}>
//                   {Math.abs(balance).toFixed(2)}
//                 </td>
//                 <td style={{ border: "1px solid black", padding: "6px", textAlign: "center", color: colorFinal }}>
//                   {drcrFinal}
//                 </td>
//               </tr>
//             </tfoot>
//           </table>
//         </div>
//       </Box>
//     </Modal>
//   );
// };

// export default CoA;


import React, { useRef } from "react";
import { Modal, Box, Button } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import useCompanySetup from "../Shared/useCompanySetup";

const chunkItems = (items = [], firstChunkSize, otherChunkSize) => {
  if (!Array.isArray(items)) return [];
  const chunks = [];
  let i = 0;

  if (items.length > 0) {
    chunks.push(items.slice(i, i + firstChunkSize));
    i += firstChunkSize;
  }
  while (i < items.length) {
    chunks.push(items.slice(i, i + otherChunkSize));
    i += otherChunkSize;
  }
  return chunks;
};

const CoA = ({ filteredTransactions = [], isOpen, handleClose, ledgerFrom, ledgerTo, currentDate, selectedLedger }) => {
  const { companyName, companyAdd, companyCity, companyPAN } = useCompanySetup();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // ✅ Chunk transactions for page breaks
  const chunks = chunkItems(filteredTransactions, 35, 40);

  // ✅ Calculate totals
  let totalDebit = 0, totalCredit = 0, finalBalance = 0;
  filteredTransactions.forEach((txn) => {
    if (txn.type.toLowerCase() === "debit") {
      finalBalance += txn.amount;
      totalDebit += txn.amount;
    } else if (txn.type.toLowerCase() === "credit") {
      finalBalance -= txn.amount;
      totalCredit += txn.amount;
    }
  });
  const drcrFinal = finalBalance >= 0 ? "DR" : "CR";
  const colorFinal = drcrFinal === "DR" ? "darkblue" : "red";

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Modal style={{zIndex:100000}} open={isOpen} onClose={handleClose}>
      <Box sx={{ bgcolor: "white", boxShadow: 24, p: 4, overflowY: "auto", maxHeight: "100vh" }}>
        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" onClick={handlePrint} style={{ background: "lightcoral", color: "black", marginRight: "10px" }}>
            Print
          </Button>
          <Button
            onClick={handleClose}
            style={{ border: "none", background: "darkred", cursor: "pointer", color: "white" }}
          >
            Close
          </Button>
        </Box>

        {/* Printable area */}
        <div
          ref={componentRef}
          style={{
            width: "290mm",
            minHeight: "390mm",
            margin: "auto",
            padding: "20px",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <h1 style={{ textAlign: "center", fontWeight: "bold", fontSize: "30px", color: "darkblue" }}>
            {companyName?.toUpperCase()}
          </h1>
          <p style={{ textAlign: "center", margin: "0", fontSize: "18px", color: "darkblue" }}>{companyAdd}</p>
          <p style={{ textAlign: "center", margin: "0", fontSize: "18px", color: "darkblue" }}>{companyCity}</p>
          <p style={{ textAlign: "center", margin: "0", fontSize: "16px" }}>Sub : Statement of Accounts For F.Y. {new Date(ledgerFrom).getFullYear()} - {new Date(ledgerTo).getFullYear()}</p>
          {currentDate && (
            <h2 style={{ fontWeight: "bold", fontSize: "18px", marginLeft: "72.3%" }}>
              Print Date: {formatDate(currentDate)}
            </h2>
          )}
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column"}}>
                <span style={{fontSize:17}}>A/C: <b>{selectedLedger.formData.ahead}</b> <br /></span>
                <span style={{fontSize:17}}><b>{selectedLedger.formData.add1}</b> <br /></span>
                <span style={{fontSize:17}}><b>{selectedLedger.formData.city}</b> <br /></span>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <span style={{fontSize:17}}>GST No: <b>{selectedLedger.formData.gstNo}</b> <br /></span>
                <span style={{fontSize:17,marginLeft:"10px"}}>PAN: <b>{selectedLedger.formData.pan}</b> <br /></span>
              </div>
            </div>
            <div style={{marginTop:"50px"}}>
                <h2 style={{fontSize:17}}>COPY OF ACCOUNT</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", }}>
                <h2 style={{ fontWeight: "bold", marginTop: "10px", fontSize: "18px",}}>
                From: {formatDate(ledgerFrom)}
                </h2>
                <h2 style={{ fontWeight: "bold", marginTop: "10px", fontSize: "18px",}}>
                UpTo: {formatDate(ledgerTo)}
                </h2>
            </div>
          </div>
          <div style={{marginTop:"10px",fontSize:17}}>
            <p>
            <b>Dear Sir/Madam,</b><br />
            Given below are the details of your Accounts as Standing in my/our Books of Accounts 
            for the period as above. Kindly return this form to us, duly signed by you in confirmation of the same.
            </p>
          </div>

          {/* Table chunks */}
          {chunks.map((chunk, idx) => {
            let runningBalance = 0;
            return (
              <table
                key={idx}
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  marginTop: "10px",
                }}
              >
                <thead>
                  <tr style={{ background: "#ddd", fontSize: 20 }}>
                    <th style={{ border: "1px solid black", padding: "6px" }}>Date</th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>Type</th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>Narration</th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>Debit</th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>Credit</th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>Balance</th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>DR/CR</th>
                  </tr>
                </thead>
                <tbody>
                  {chunk.map((txn, i) => {
                    if (txn.type.toLowerCase() === "debit") {
                      runningBalance += txn.amount;
                    } else if (txn.type.toLowerCase() === "credit") {
                      runningBalance -= txn.amount;
                    }
                    const drcr = runningBalance >= 0 ? "DR" : "CR";
                    const color = drcr === "DR" ? "darkblue" : "red";

                    return (
                      <tr key={i} style={{ fontSize: 17 }}>
                        <td style={{ border: "1px solid black", padding: "6px" }}>
                          {new Date(txn.date).toLocaleDateString("en-GB")}
                        </td>
                        <td style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>{txn.vtype}</td>
                        <td style={{ border: "1px solid black", padding: "6px" }}>{txn.narration}</td>
                        <td style={{ border: "1px solid black", padding: "6px", textAlign: "right", color: "darkblue" }}>
                          {txn.type.toLowerCase() === "debit" ? txn.amount.toFixed(2) : ""}
                        </td>
                        <td style={{ border: "1px solid black", padding: "6px", textAlign: "right", color: "red" }}>
                          {txn.type.toLowerCase() === "credit" ? txn.amount.toFixed(2) : ""}
                        </td>
                        <td style={{ border: "1px solid black", padding: "6px", textAlign: "right", color }}>
                          {Math.abs(runningBalance).toFixed(2)}
                        </td>
                        <td style={{ border: "1px solid black", padding: "6px", textAlign: "center", color }}>
                          {drcr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Totals row only on last chunk */}
                {idx === chunks.length - 1 && (
                  <tfoot>
                    <tr style={{ fontWeight: "bold", background: "#f2f2f2", fontSize: 20 }}>
                      <td colSpan={3} style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                        TOTAL
                      </td>
                      <td style={{ border: "1px solid black", padding: "6px", textAlign: "right", color: "darkblue" }}>
                        {totalDebit.toFixed(2)}
                      </td>
                      <td style={{ border: "1px solid black", padding: "6px", textAlign: "right", color: "red" }}>
                        {totalCredit.toFixed(2)}
                      </td>
                      <td style={{ border: "1px solid black", padding: "6px", textAlign: "right", color: colorFinal }}>
                        {Math.abs(finalBalance).toFixed(2)}
                      </td>
                      <td style={{ border: "1px solid black", padding: "6px", textAlign: "center", color: colorFinal }}>
                        {drcrFinal}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            );
          })}
          <div style={{ display: "flex", flexDirection: "row", marginTop: "20px", fontSize:17, justifyContent: "space-between" }}>
            <div style={{ display: "flex",flexDirection:"column"}}>
                <p>
                    I/we Confirm that the above particulars are true and Correct.
                </p>
                <p>PAN :- {selectedLedger.formData.pan}</p>
            </div>
         
            <div style={{ display: "flex",flexDirection:"column"}}>
                <p>Your Faithfully</p>
                <p>For {companyName?.toUpperCase()}</p>
                <p style={{ marginTop: "40px" }}>P.A.No.{companyPAN}</p>
            </div>

          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default CoA;
