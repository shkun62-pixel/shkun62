// // PurchaseSummaryPrintModal.jsx
// import React, { forwardRef } from "react";

// const PurSummPrint = forwardRef(
//   ({ groupedData = [], periodFrom, periodTo, companyName, companyAdd, companyCity = {} }, ref) => {
//     const formatBags = (n) => Number(n).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
//     const formatQty = (n) => Number(n).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
//     const formatValue = (n) => Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

//     const totals = groupedData.reduce(
//       (acc, cur) => {
//         acc.bags += Number(cur.bags || 0);
//         acc.qty += Number(cur.qty || 0);
//         acc.value += Number(cur.value || 0);
//         return acc;
//       },
//       { bags: 0, qty: 0, value: 0 }
//     );

//     return (
//       <div ref={ref} style={{ padding: 10, fontFamily: "Arial, Helvetica, sans-serif" }}>
//         <div style={{ textAlign: "center", marginBottom: 30 }}>
//           <div style={{ fontWeight: "bold", fontSize: 30 }}>{companyName || ""}</div>
//           <div style={{ fontWeight: "bold", fontSize: 18 }}>{companyAdd || ""}</div>
//           <div style={{ fontWeight: "bold", fontSize: 18 }}>{companyCity || ""}</div>
//         </div>

//         <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", fontSize: 16 }}>
//           <strong>Customer Wise Detail</strong>
//           <strong>Purchase</strong>
//           <span >
//             Period&nbsp;:&nbsp;{periodFrom} &nbsp;To&nbsp; {periodTo}
//           </span>
//         </div>

//         <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
//           <thead>
//             <tr>
//               <th style={thStyle}>Account Name</th>
//               <th style={thStyle}>City</th>
//               <th style={thStyle}>P.A.N</th>
//               <th style={thStyle}>Bags</th>
//               <th style={thStyle}>Qty.</th>
//               <th style={thStyle}>Value</th>
//             </tr>
//           </thead>
//           <tbody>
//             {groupedData.map((g, idx) => (
//               <tr key={idx}>
//                 <td style={tdStyle}>{g.supplierName}</td>
//                 <td style={tdStyle}>{g.city}</td>
//                 <td style={tdStyle}>{g.pan}</td>
//                 <td style={{ ...tdStyle, textAlign: "right" }}>{formatBags(g.bags)}</td>
//                 <td style={{ ...tdStyle, textAlign: "right" }}>{formatQty(g.qty)}</td>
//                 <td style={{ ...tdStyle, textAlign: "right" }}>{formatValue(g.value)}</td>
//               </tr>
//             ))}

//             {/* Group Total row */}
//             <tr>
//               <td style={{ ...tdStyle, fontWeight: "bold" }}>Group Total</td>
//               <td style={tdStyle}></td>
//               <td style={tdStyle}></td>
//               <td style={{ ...tdStyle, textAlign: "right", fontWeight: "bold" }}>{formatBags(totals.bags)}</td>
//               <td style={{ ...tdStyle, textAlign: "right", fontWeight: "bold" }}>{formatQty(totals.qty)}</td>
//               <td style={{ ...tdStyle, textAlign: "right", fontWeight: "bold" }}>{formatValue(totals.value)}</td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     );
//   }
// );

// const thStyle = {
//   border: "1px solid #000",
//   padding: "6px 8px",
//   textAlign: "left",
//   background: "#f0f0f0",
//   fontSize: 16,
// };

// const tdStyle = {
//   border: "1px solid #000",
//   padding: "6px 8px",
//   fontSize: 16,
// };

// export default PurSummPrint;



// PurSummPrint.jsx
// import React, { forwardRef } from "react";

// const tableStyle = {
//   width: "100%",
//   borderCollapse: "collapse",
//   fontSize: "13px",
// };

// const thtd = {
//   border: "1px solid black",
//   padding: "4px 6px",
// };

// const headerStyle = {
//   textAlign: "center",
//   marginBottom: "8px",
//   fontWeight: "bold",
//   fontSize: "16px",
// };

// const subHeader = {
//   textAlign: "center",
//   marginBottom: "15px",
//   fontSize: "13px",
// };

// const PurSummPrint = forwardRef(
//   ({ groupedData, periodFrom, periodTo, companyName, companyAdd, companyCity }, ref) => {
//     if (!groupedData || groupedData.length === 0) {
//       return (
//         <div ref={ref}>
//           <h5>No Records Found</h5>
//         </div>
//       );
//     }

//     // Detect summary type based on keys
//     const sample = groupedData[0];

//     const isMonthWise = sample.month !== undefined;
//     const isDateWise = sample.date !== undefined;
//     const isSupplierWise = sample.supplierName !== undefined; // Total or Account Wise

//     return (
//       <div ref={ref} style={{ padding: "20px" }}>
//         {/* HEADER */}
//         <div style={headerStyle}>{companyName}</div>
//         <div style={subHeader}>
//           {companyAdd}, {companyCity}
//         </div>
//         <div style={{ textAlign: "center", marginBottom: "12px" }}>
//           <strong>
//             Purchase Summary (From: {periodFrom} To: {periodTo})
//           </strong>
//         </div>

//         {/* TABLE */}
//         <table style={tableStyle}>
//           <thead>
//             {/* Month Wise */}
//             {isMonthWise && (
//               <tr>
//                 <th style={thtd}>Month</th>
//                 <th style={thtd}>Bags</th>
//                 <th style={thtd}>Qty</th>
//                 <th style={thtd}>Value</th>
//               </tr>
//             )}

//             {/* Date Wise */}
//             {isDateWise && (
//               <tr>
//                 <th style={thtd}>Date</th>
//                 <th style={thtd}>Supplier</th>
//                 <th style={thtd}>Bags</th>
//                 <th style={thtd}>Qty</th>
//                 <th style={thtd}>Value</th>
//               </tr>
//             )}

//             {/* Total / Account Wise (Supplier Based) */}
//             {isSupplierWise && !isMonthWise && !isDateWise && (
//               <tr>
//                 <th style={thtd}>Supplier</th>
//                 <th style={thtd}>City</th>
//                 <th style={thtd}>PAN</th>
//                 <th style={thtd}>Bags</th>
//                 <th style={thtd}>Qty</th>
//                 <th style={thtd}>Value</th>
//               </tr>
//             )}
//           </thead>

//           <tbody>
//             {/* MONTH WISE */}
//             {isMonthWise &&
//               groupedData.map((m, i) => (
//                 <tr key={i}>
//                   <td style={thtd}>{m.month}</td>
//                   <td style={thtd}>{m.bags.toFixed(2)}</td>
//                   <td style={thtd}>{m.qty.toFixed(2)}</td>
//                   <td style={thtd}>{m.value.toFixed(2)}</td>
//                 </tr>
//               ))}

//             {/* DATE WISE */}
//             {isDateWise &&
//               groupedData.map((d, i) => (
//                 <tr key={i}>
//                   <td style={thtd}>{d.date}</td>
//                   <td style={thtd}>{d.supplier}</td>
//                   <td style={thtd}>{d.bags.toFixed(2)}</td>
//                   <td style={thtd}>{d.qty.toFixed(2)}</td>
//                   <td style={thtd}>{d.value.toFixed(2)}</td>
//                 </tr>
//               ))}

//             {/* SUPPLIER WISE (Total Summary or Account Wise) */}
//             {isSupplierWise &&
//               !isMonthWise &&
//               !isDateWise &&
//               groupedData.map((s, i) => (
//                 <tr key={i}>
//                   <td style={thtd}>{s.supplierName}</td>
//                   <td style={thtd}>{s.city}</td>
//                   <td style={thtd}>{s.pan}</td>
//                   <td style={thtd}>{s.bags.toFixed(2)}</td>
//                   <td style={thtd}>{s.qty.toFixed(2)}</td>
//                   <td style={thtd}>{s.value.toFixed(2)}</td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>

//         {/* FOOTER TOTAL */}

//         {!isDateWise && !isMonthWise && (
//           <>
//             <br />
//             <table style={tableStyle}>
//               <tbody>
//                 <tr>
//                   <td style={thtd}><strong>Total Bags</strong></td>
//                   <td style={thtd}>
//                     {groupedData.reduce((a, b) => a + (b.bags || 0), 0).toFixed(2)}
//                   </td>
//                 </tr>

//                 <tr>
//                   <td style={thtd}><strong>Total Qty</strong></td>
//                   <td style={thtd}>
//                     {groupedData.reduce((a, b) => a + (b.qty || 0), 0).toFixed(2)}
//                   </td>
//                 </tr>

//                 <tr>
//                   <td style={thtd}><strong>Total Value</strong></td>
//                   <td style={thtd}>
//                     {groupedData.reduce((a, b) => a + (b.value || 0), 0).toFixed(2)}
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </>
//         )}
//       </div>
//     );
//   }
// );

// export default PurSummPrint;



// PurSummPrint.jsx
import React, { forwardRef } from "react";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "13px",
};

const thtd = {
  border: "1px solid black",
  padding: "4px 6px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "8px",
  fontWeight: "bold",
  fontSize: "16px",
};

const subHeader = {
  textAlign: "center",
  marginBottom: "15px",
  fontSize: "13px",
};

const PurSummPrint = forwardRef(
  (
    {
      groupedData,
      periodFrom,
      periodTo,
      companyName,
      companyAdd,
      companyCity,
    },
    ref
  ) => {
    if (!groupedData || groupedData.length === 0) {
      return (
        <div ref={ref}>
          <h5>No Records Found</h5>
        </div>
      );
    }

    // Detect summary type
    const sample = groupedData[0];

    const isMonthWise = sample.month !== undefined;
    const isDateWise = sample.date !== undefined;
    const isSupplierWise = sample.supplierName !== undefined;

    // Totals
    const totalBags = groupedData
      .reduce((a, b) => a + (b.bags || 0), 0)
      .toFixed(2);

    const totalQty = groupedData
      .reduce((a, b) => a + (b.qty || 0), 0)
      .toFixed(2);

    const totalValue = groupedData
      .reduce((a, b) => a + (b.value || 0), 0)
      .toFixed(2);

    return (
      <div ref={ref} style={{ padding: "20px" }}>
        {/* HEADER */}
        <div style={headerStyle}>{companyName}</div>
        <div style={subHeader}>
          {companyAdd}, {companyCity}
        </div>
        <div style={{ textAlign: "center", marginBottom: "12px" }}>
          <strong>
            Purchase Summary (From: {periodFrom} To: {periodTo})
          </strong>
        </div>

        {/* TABLE */}
        <table style={tableStyle}>
          <thead>
            {/* Month Wise */}
            {isMonthWise && (
              <tr>
                <th style={thtd}>Month</th>
                <th style={thtd}>Bags</th>
                <th style={thtd}>Qty</th>
                <th style={thtd}>Value</th>
              </tr>
            )}

            {/* Date Wise */}
            {isDateWise && (
              <tr>
                <th style={thtd}>Date</th>
                <th style={thtd}>Supplier</th>
                <th style={thtd}>Bags</th>
                <th style={thtd}>Qty</th>
                <th style={thtd}>Value</th>
              </tr>
            )}

            {/* Supplier / Total Summary */}
            {isSupplierWise && !isMonthWise && !isDateWise && (
              <tr>
                <th style={thtd}>Supplier</th>
                <th style={thtd}>City</th>
                <th style={thtd}>PAN</th>
                <th style={thtd}>Bags</th>
                <th style={thtd}>Qty</th>
                <th style={thtd}>Value</th>
              </tr>
            )}
          </thead>

          <tbody>
            {/* MONTH WISE */}
            {isMonthWise &&
              groupedData.map((m, i) => (
                <tr key={i}>
                  <td style={thtd}>{m.month}</td>
                  <td style={thtd}>{m.bags.toFixed(2)}</td>
                  <td style={thtd}>{m.qty.toFixed(2)}</td>
                  <td style={thtd}>{m.value.toFixed(2)}</td>
                </tr>
              ))}

            {/* DATE WISE */}
            {isDateWise &&
              groupedData.map((d, i) => (
                <tr key={i}>
                  <td style={thtd}>{d.date}</td>
                  <td style={thtd}>{d.supplier}</td>
                  <td style={thtd}>{d.bags.toFixed(2)}</td>
                  <td style={thtd}>{d.qty.toFixed(2)}</td>
                  <td style={thtd}>{d.value.toFixed(2)}</td>
                </tr>
              ))}

            {/* SUPPLIER / TOTAL SUMMARY */}
            {isSupplierWise &&
              !isMonthWise &&
              !isDateWise &&
              groupedData.map((s, i) => (
                <tr key={i}>
                  <td style={thtd}>{s.supplierName}</td>
                  <td style={thtd}>{s.city}</td>
                  <td style={thtd}>{s.pan}</td>
                  <td style={thtd}>{s.bags.toFixed(2)}</td>
                  <td style={thtd}>{s.qty.toFixed(2)}</td>
                  <td style={thtd}>{s.value.toFixed(2)}</td>
                </tr>
              ))}
          </tbody>

          {/* FOOTER TOTALS → IN SAME TABLE */}
          <tfoot>
            <tr>
              <td
                style={{
                  ...thtd,
                  fontWeight: "bold",
                  textAlign: "right",
                }}
                colSpan={
                  isSupplierWise ? 3 : isDateWise ? 2 : 1 // dynamic colspan
                }
              >
                TOTAL
              </td>

              <td style={thtd}>
                <strong>{totalBags}</strong>
              </td>

              <td style={thtd}>
                <strong>{totalQty}</strong>
              </td>

              <td style={thtd}>
                <strong>{totalValue}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
);

export default PurSummPrint;
