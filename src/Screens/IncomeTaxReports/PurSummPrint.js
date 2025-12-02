// PurchaseSummaryPrintModal.jsx
import React, { forwardRef } from "react";

const PurSummPrint = forwardRef(
  ({ groupedData = [], periodFrom, periodTo, companyName, companyAdd, companyCity = {} }, ref) => {
    const formatBags = (n) => Number(n).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    const formatQty = (n) => Number(n).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
    const formatValue = (n) => Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const totals = groupedData.reduce(
      (acc, cur) => {
        acc.bags += Number(cur.bags || 0);
        acc.qty += Number(cur.qty || 0);
        acc.value += Number(cur.value || 0);
        return acc;
      },
      { bags: 0, qty: 0, value: 0 }
    );

    return (
      <div ref={ref} style={{ padding: 10, fontFamily: "Arial, Helvetica, sans-serif" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ fontWeight: "bold", fontSize: 30 }}>{companyName || ""}</div>
          <div style={{ fontWeight: "bold", fontSize: 18 }}>{companyAdd || ""}</div>
          <div style={{ fontWeight: "bold", fontSize: 18 }}>{companyCity || ""}</div>
        </div>

        <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", fontSize: 16 }}>
          <strong>Customer Wise Detail</strong>
          <strong>Purchase</strong>
          <span >
            Period&nbsp;:&nbsp;{periodFrom} &nbsp;To&nbsp; {periodTo}
          </span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
          <thead>
            <tr>
              <th style={thStyle}>Account Name</th>
              <th style={thStyle}>City</th>
              <th style={thStyle}>P.A.N</th>
              <th style={thStyle}>Bags</th>
              <th style={thStyle}>Qty.</th>
              <th style={thStyle}>Value</th>
            </tr>
          </thead>
          <tbody>
            {groupedData.map((g, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{g.supplierName}</td>
                <td style={tdStyle}>{g.city}</td>
                <td style={tdStyle}>{g.pan}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{formatBags(g.bags)}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{formatQty(g.qty)}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{formatValue(g.value)}</td>
              </tr>
            ))}

            {/* Group Total row */}
            <tr>
              <td style={{ ...tdStyle, fontWeight: "bold" }}>Group Total</td>
              <td style={tdStyle}></td>
              <td style={tdStyle}></td>
              <td style={{ ...tdStyle, textAlign: "right", fontWeight: "bold" }}>{formatBags(totals.bags)}</td>
              <td style={{ ...tdStyle, textAlign: "right", fontWeight: "bold" }}>{formatQty(totals.qty)}</td>
              <td style={{ ...tdStyle, textAlign: "right", fontWeight: "bold" }}>{formatValue(totals.value)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
);

const thStyle = {
  border: "1px solid #000",
  padding: "6px 8px",
  textAlign: "left",
  background: "#f0f0f0",
  fontSize: 16,
};

const tdStyle = {
  border: "1px solid #000",
  padding: "6px 8px",
  fontSize: 16,
};

export default PurSummPrint;
