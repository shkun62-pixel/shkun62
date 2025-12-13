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

const AccountWisePrint = forwardRef(({ rows, fromDate, toDate }, ref) => {
  return (
    <div ref={ref}>
      <h3 style={{ textAlign: "center" }}>Account Wise Detail Purchase</h3>
      <h5 style={{ textAlign: "center" }}>
        {fromDate} To {toDate}
      </h5>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thtd}>Account Name</th>
            <th style={thtd}>City Name</th>
            <th style={thtd}>Bags</th>
            <th style={thtd}>Qty</th>
            <th style={thtd}>Value</th>
            <th style={thtd}>Average</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={thtd}>{r.account}</td>
              <td style={thtd}>{r.city}</td>
              <td style={thtd}>{r.bags.toFixed(3)}</td>
              <td style={thtd}>{r.qty.toFixed(3)}</td>
              <td style={thtd}>{r.value.toFixed(2)}</td>
              <td style={thtd}>{r.avg.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default AccountWisePrint;
