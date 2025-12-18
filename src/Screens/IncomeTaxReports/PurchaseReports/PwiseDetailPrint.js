import React, { forwardRef } from "react";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "18px",
  overflow: "auto",
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

const PWiseDetailPrint = forwardRef(
  ({ rows, fromDate, toDate, companyName, companyAdd, companyCity, tittle }, ref) => {
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
          <strong>{tittle}</strong>
          <strong>
            (From: {fromDate} To: {toDate})
          </strong>
        </div>

        <table style={tableStyle}>
        <thead>
  <tr>
    <th style={thtd}>Account Name</th>
    <th style={thtd}>City</th>
    <th style={thtd}>Product Name</th>
    <th style={{ ...thtd, textAlign: "right" }}>Bags</th>
    <th style={{ ...thtd, textAlign: "right" }}>Qty.</th>
    <th style={{ ...thtd, textAlign: "right" }}>Value</th>
  </tr>
</thead>


        <tbody>
  {rows.map((acc, accIndex) => (
    <React.Fragment key={accIndex}>

      {/* PRODUCT ROWS */}
      {Object.values(acc.products).map((p, pIndex) => (
        <tr key={pIndex}>
          {/* Account & City ONLY on first product row */}
          <td style={thtd}>
            {pIndex === 0 ? acc.account : ""}
          </td>
          <td style={thtd}>
            {pIndex === 0 ? acc.city : ""}
          </td>

          <td style={thtd}>{p.product}</td>

          <td style={{ ...thtd, textAlign: "right" }}>
            {p.bags.toFixed(3)}
          </td>
          <td style={{ ...thtd, textAlign: "right" }}>
            {p.qty.toFixed(3)}
          </td>
          <td style={{ ...thtd, textAlign: "right" }}>
            {p.value.toFixed(2)}
          </td>
        </tr>
      ))}

      {/* SUB TOTAL (text under Product Name column) */}
      <tr>
        <td style={thtd}></td>
        <td style={thtd}></td>
        <td style={{ ...thtd, textAlign: "right" }}>
          <strong>Sub Totals</strong>
        </td>
        <td style={{ ...thtd, textAlign: "right" }}>
          <strong>{acc.totalBags.toFixed(3)}</strong>
        </td>
        <td style={{ ...thtd, textAlign: "right" }}>
          <strong>{acc.totalQty.toFixed(3)}</strong>
        </td>
        <td style={{ ...thtd, textAlign: "right" }}>
          <strong>{acc.totalValue.toFixed(2)}</strong>
        </td>
      </tr>

      {/* GROUP TOTAL AFTER EACH ACCOUNT (as in image) */}
      <tr>
        <td colSpan={3} style={{ ...thtd, textAlign: "right" }}>
          <strong>Group Total</strong>
        </td>
        <td style={{ ...thtd, textAlign: "right" }}>
          <strong>
            {rows
              .slice(0, accIndex + 1)
              .reduce((s, r) => s + r.totalBags, 0)
              .toFixed(3)}
          </strong>
        </td>
        <td style={{ ...thtd, textAlign: "right" }}>
          <strong>
            {rows
              .slice(0, accIndex + 1)
              .reduce((s, r) => s + r.totalQty, 0)
              .toFixed(3)}
          </strong>
        </td>
        <td style={{ ...thtd, textAlign: "right" }}>
          <strong>
            {rows
              .slice(0, accIndex + 1)
              .reduce((s, r) => s + r.totalValue, 0)
              .toFixed(2)}
          </strong>
        </td>
      </tr>

    </React.Fragment>
  ))}
</tbody>
        </table>
      </div>
    );
  }
);

export default PWiseDetailPrint;
