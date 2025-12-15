// import React, { forwardRef } from "react";

// const tableStyle = {
//   width: "100%",
//   borderCollapse: "collapse",
//   fontSize: "18px",
// };

// const thtd = {
//   border: "1px solid black",
//   padding: "4px 6px",
// };

// const headerStyle = {
//   textAlign: "center",
//   marginBottom: "2px",
//   fontWeight: "bold",
//   fontSize: "35px",
//   fontFamily: "Courier New",
//   color:"darkblue"
// };

// const subHeader = {
//   textAlign: "center",
//   marginBottom: "5px",
//   fontSize: "22px",
//   fontFamily: "Courier New",
//   color:"darkblue"
// };

// const center = { textAlign: "center" };

// const AccountWisePrint = forwardRef(({ rows, fromDate, toDate, companyName, companyAdd, companyCity  }, ref) => {
//   if (!rows || rows.length === 0) {
//     return (
//       <div ref={ref}>
//         <h4 style={{ textAlign: "center" }}>No Data</h4>
//       </div>
//     );
//   }

//   // 🔍 Detect summary type
//   const isMonthWise = rows[0].month !== undefined;
//   const isDateWise  = rows[0].date !== undefined;

//   // 🏷 Title
//   let title = "Account Wise Purchase Summary";
//   if (isMonthWise) title = "Month Wise Purchase Summary";
//   if (isDateWise)  title = "Date Wise Purchase Summary";

//   return (
//     <div ref={ref}>
//           <div style={headerStyle}>{companyName}</div>
//         <div style={subHeader}>
//           {companyAdd}
//         </div>
//         <div style={subHeader}>
//           {companyCity}
//         </div>
//         <div
//           style={{
//             display:'flex',
//             textAlign: "center",
//             marginBottom: "5px",
//             fontSize: "18px",
//             fontFamily: "Courier New",
//             justifyContent:'space-between'
//           }}
//         >
//           <strong>
//             Account Wise Details
//           </strong>
//           <strong>
//             Purchase Summary (From: {fromDate} To: {toDate})
//           </strong>
//         </div>
//       {/* <h3 style={{ textAlign: "center", marginBottom: "5px" }}>{title}</h3>
//       <h5 style={{ textAlign: "center", marginBottom: "15px" }}>
//         {fromDate} To {toDate}
//       </h5> */}

//       <table style={tableStyle}>
//         <thead>
//           <tr>
//             {/* Month / Date first */}
//             {isMonthWise && <th style={thtd}>Month</th>}
//             {isDateWise && <th style={thtd}>Date</th>}

//             {/* Account always */}
//             <th style={thtd}>Account Name</th>
//             <th style={thtd}>City</th>

//             {/* Common */}
//             <th style={{...thtd, textAlign:'right'}}>Bags</th>
//             <th style={{...thtd, textAlign:'right'}}>Qty</th>
//             <th style={{...thtd, textAlign:'right'}}>Value</th>
//             <th style={{...thtd, textAlign:'right'}}>Average</th>
//           </tr>
//         </thead>

//         <tbody>
//           {rows.map((r, i) => (
//             <tr key={i}>
//               {isMonthWise && <td style={thtd}>{r.month}</td>}
//               {isDateWise && <td style={thtd}>{r.date}</td>}

//               <td style={thtd}>{r.account}</td>
//               <td style={thtd}>{r.city}</td>

//               <td style={{ ...thtd, textAlign:"right" }}>{r.bags.toFixed(3)}</td>
//               <td style={{ ...thtd, textAlign:"right" }}>{r.qty.toFixed(3)}</td>
//               <td style={{ ...thtd, textAlign:"right" }}>{r.value.toFixed(2)}</td>
//               <td style={{ ...thtd, textAlign:"right" }}>{r.avg.toFixed(2)}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// });

// export default AccountWisePrint;


import React, { forwardRef } from "react";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "18px",
};

const thtd = {
  border: "1px solid black",
  padding: "4px 6px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "2px",
  fontWeight: "bold",
  fontSize: "35px",
  fontFamily: "Courier New",
  color: "darkblue",
};

const subHeader = {
  textAlign: "center",
  marginBottom: "5px",
  fontSize: "22px",
  fontFamily: "Courier New",
  color: "darkblue",
};

const center = { textAlign: "center" };

const AccountWisePrint = forwardRef(
  ({ rows, fromDate, toDate, companyName, companyAdd, companyCity }, ref) => {
    if (!rows || rows.length === 0) {
      return (
        <div ref={ref}>
          <h4 style={{ textAlign: "center" }}>No Data</h4>
        </div>
      );
    }

    const isMonthWise = rows[0].month !== undefined;
    const isDateWise = rows[0].date !== undefined;

    // Totals
    const totalBags = rows.reduce((sum, r) => sum + r.bags, 0);
    const totalQty = rows.reduce((sum, r) => sum + r.qty, 0);
    const totalValue = rows.reduce((sum, r) => sum + r.value, 0);
    const totalAvg =
      rows.reduce((sum, r) => sum + r.avg, 0) / rows.length;

    return (
      <div ref={ref}>
        <div style={headerStyle}>{companyName}</div>
        <div style={subHeader}>{companyAdd}</div>
        <div style={subHeader}>{companyCity}</div>
        <div
          style={{
            display: "flex",
            textAlign: "center",
            marginBottom: "5px",
            fontSize: "18px",
            fontFamily: "Courier New",
            justifyContent: "space-between",
          }}
        >
          <strong>Account Wise Details</strong>
          <strong>
            Purchase Summary (From: {fromDate} To: {toDate})
          </strong>
        </div>

        <table style={tableStyle}>
          <thead>
            <tr>
              {isMonthWise && <th style={thtd}>Month</th>}
              {isDateWise && <th style={thtd}>Date</th>}
              <th style={thtd}>Account Name</th>
              <th style={thtd}>City</th>
              <th style={{ ...thtd, textAlign: "right" }}>Bags</th>
              <th style={{ ...thtd, textAlign: "right" }}>Qty</th>
              <th style={{ ...thtd, textAlign: "right" }}>Value</th>
              <th style={{ ...thtd, textAlign: "right" }}>Average</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {isMonthWise && <td style={thtd}>{r.month}</td>}
                {isDateWise && <td style={thtd}>{r.date}</td>}
                <td style={thtd}>{r.account}</td>
                <td style={thtd}>{r.city}</td>
                <td style={{ ...thtd, textAlign: "right" }}>{r.bags.toFixed(3)}</td>
                <td style={{ ...thtd, textAlign: "right" }}>{r.qty.toFixed(3)}</td>
                <td style={{ ...thtd, textAlign: "right" }}>{r.value.toFixed(2)}</td>
                <td style={{ ...thtd, textAlign: "right" }}>{r.avg.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>

          {/* Footer with totals */}
          <tfoot>
            <tr>
              <td style={thtd} colSpan={isMonthWise || isDateWise ? 4 : 2}>
                <strong>Total</strong>
              </td>
              <td style={{ ...thtd, textAlign: "right" }}>
                <strong>{totalBags.toFixed(3)}</strong>
              </td>
              <td style={{ ...thtd, textAlign: "right" }}>
                <strong>{totalQty.toFixed(3)}</strong>
              </td>
              <td style={{ ...thtd, textAlign: "right" }}>
                <strong>{totalValue.toFixed(2)}</strong>
              </td>
              <td style={{ ...thtd, textAlign: "right" }}>
                <strong>{totalAvg.toFixed(2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    );
  }
);

export default AccountWisePrint;
