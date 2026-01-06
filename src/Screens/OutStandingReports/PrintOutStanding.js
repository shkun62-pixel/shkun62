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

const PrintOutStanding = React.forwardRef(({ items = [], isOpen, handleClose,ledgerFrom, ledgerTo, currentDate, currentGroupName, choice, handleExport }, ref) => {

  const { companyName, companyAdd, companyCity } = useCompanySetup();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const chunks = chunkItems(items, 35, 40);

  // ✅ Calculate totals
  const totalDebit = items.reduce((acc, l) => acc + (l.debit || 0), 0);
  const totalCredit = items.reduce((acc, l) => acc + (l.credit || 0), 0);

  const style = {
    bgcolor: "white",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
    maxHeight: "100vh",
  };

    const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
    };


  return (
    <Modal open={isOpen} onClose={handleClose} style={{ zIndex: 100000}}>
      <Box sx={style}>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
            {/* Print button */}
            <Button
                variant="contained"
                onClick={handlePrint}
                style={{ background: "lightcoral", color: "black", marginRight: "10px" }}
            >
                Print
            </Button>
              <Button
                variant="contained"
                onClick={handleExport}
                style={{ background: "lightcoral", color: "black", marginRight: "10px" }}
            >
                Export
            </Button>

            {/* Close button */}
            <Button
                onClick={handleClose}
                style={{
                border: "none",
                background: "darkred",
                cursor: "pointer",
                color: "white",
                }}
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
          <h1
          className=""
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "40px",
              color: "darkblue",
              fontFamily: "Courier New"
            }}
          >
            {companyName?.toUpperCase()}
          </h1>
          <p style={{ textAlign: "center", margin: "0",fontSize:"20px",color:"darkblue",fontFamily: "Courier New" }}>{companyAdd}</p>
          <p style={{ textAlign: "center", margin: "0",fontSize:"20px",color:"darkblue",fontFamily: "Courier New" }}>{companyCity}</p>
            {currentDate && (
              <h2 style={{ fontWeight: "bold", fontSize:"18px",marginLeft:"72.3%" }}>Print Date: {formatDate(currentDate)}</h2>
            )}
          <div style={{display:'flex',flexDirection:"row",justifyContent:'space-between'}}>
            <h2 style={{ fontWeight: "bold", marginTop: "10px",fontSize:"18px" }}>
                {choice}
            </h2>
            {currentGroupName && (
              <h2 style={{ fontWeight: "bold", fontSize:"18px", marginTop: "10px" }}>{currentGroupName}</h2>
            )}
            <h2 style={{ fontWeight: "bold", marginTop: "10px",fontSize:"18px",marginRight:"10px" }}>
                Period: {formatDate(ledgerFrom)} To {ledgerTo}
            </h2>
          </div>
        
          {chunks.map((chunk, idx) => (
            <table
              key={idx}
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
             <thead>
              <tr style={{ background: "#ddd",fontSize:20 }}>
                <th style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                S.No
                </th>
                <th style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                ACCOUNT NAME
                </th>
                <th style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                CITY
                </th>
                <th style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                PHONE
                </th>
                <th style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                PCS
                </th>
                <th style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                QTY
                </th>
                {/* ✅ Show debit OR credit column conditionally */}
                {items.some((l) => l.debit > 0) ? (
                  <th style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>DR.BALANCE</th>
                ) : (
                  <th style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>CR.BALANCE</th>
                )}
              </tr>
             </thead>
             <tbody>
              {chunk.map((l, i) => (
                <tr key={i} style={{fontSize:17}}>
                {/* ✅ Serial number (continuous across chunks) */}
                <td style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                    {idx * (idx === 0 ? 25 : 40) + i + 1}
                </td>
                <td style={{ border: "1px solid black", padding: "6px" }}>{l.name}</td>
                <td style={{ border: "1px solid black", padding: "6px" }}>{l.city}</td>
                <td style={{ border: "1px solid black", padding: "6px" }}>{l.phone}</td>
                <td style={{ border: "1px solid black", padding: "6px", textAlign: "right" }}>{l.netPcs}</td>
                <td style={{ border: "1px solid black", padding: "6px", textAlign: "right" }}>{l.netWeight}</td>
                {/* ✅ Only show relevant balance column */}
                {items.some((l) => l.debit > 0) ? (
                  <td style={{ border: "1px solid black", padding: "6px", textAlign: "right" }}>
                    {l.debit > 0
                      ? l.debit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : ""}
                  </td>
                ) : (
                  <td style={{ border: "1px solid black", padding: "6px", textAlign: "right" }}>
                    {l.credit > 0
                      ? l.credit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : ""}
                  </td>
                )}
                </tr>
              ))}
             </tbody>


            {/* ✅ Totals row only on last chunk */}
            {idx === chunks.length - 1 && (
            <tfoot>
                <tr style={{ fontWeight: "bold", background: "#f2f2f2", fontSize: 20 }}>
                <td style={{ border: "1px solid black", padding: "6px" }} colSpan={6}>
                    TOTAL
                </td>
                {/* ✅ Show total for whichever column is visible */}
                {items.some((l) => l.debit > 0) ? (
                  <td style={{ border: "1px solid black", padding: "6px", textAlign: "right" }}>
                    {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                ) : (
                  <td style={{ border: "1px solid black", padding: "6px", textAlign: "right" }}>
                    {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                )}
                </tr>
            </tfoot>
            )}

            </table>
          ))}
        </div>
      </Box>
    </Modal>
  );
});

export default PrintOutStanding;
