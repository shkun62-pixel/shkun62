import { color } from "framer-motion";
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
  color:"darkblue"
};

const subHeader = {
  textAlign: "center",
  marginBottom: "5px",
  fontSize: "22px",
  fontFamily: "Courier New",
  color:"darkblue"
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

    const isMonthWise = sample.month !== undefined && sample.supplierName;
    const isDateWise = sample.date !== undefined;
    const isSupplierWise =
      sample.supplierName !== undefined &&
      !isMonthWise &&
      !isDateWise;

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
        <div
          style={{
            display:'flex',
            textAlign: "center",
            marginBottom: "5px",
            fontSize: "18px",
            fontFamily: "Courier New",
            justifyContent:'space-between'
          }}
        >
          <strong>
            Customer Wise Details
          </strong>
          <strong>
            Sale Summary (From: {periodFrom} To: {periodTo})
          </strong>
        </div>

        {/* TABLE */}
        <table style={tableStyle}>
          <thead>
            {/* Month + Supplier Wise */}
            {isMonthWise && (
              <tr>
                <th style={thtd}>Month</th>
                <th style={thtd}>Supplier</th>
                <th style={thtd}>City</th>
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

            {/* Supplier Only */}
            {isSupplierWise && (
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
            {/* MONTH + SUPPLIER */}
            {isMonthWise &&
              groupedData.map((m, i) => (
                <tr key={i}>
                  <td style={thtd}>{m.month}</td>
                  <td style={thtd}>{m.supplierName}</td>
                  <td style={thtd}>{m.city}</td>
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

            {/* SUPPLIER WISE */}
            {isSupplierWise &&
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

          {/* FOOTER TOTALS */}
          <tfoot>
            <tr>
              <td
                style={{
                  ...thtd,
                  fontWeight: "bold",
                  textAlign: "right",
                }}
                colSpan={
                  isMonthWise
                    ? 3
                    : isSupplierWise
                    ? 3
                    : isDateWise
                    ? 2
                    : 1
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
