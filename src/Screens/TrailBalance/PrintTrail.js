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

const PrintTrail = React.forwardRef(({ items = [], isOpen, handleClose,ledgerFrom, ledgerTo, currentDate, currentGroupName, handleExport }, ref) => {

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

  // const formatDate = (date) => {
  // if (!date) return "";
  // const d = new Date(date);
  // const day = String(d.getDate()).padStart(2, "0");
  // const month = String(d.getMonth() + 1).padStart(2, "0");
  // const year = d.getFullYear();
  // return `${day}/${month}/${year}`;
  // };

  const formatDate = (input) => {
    if (!input) return "";

    // If already in dd/mm/yyyy format
    if (typeof input === "string" && /^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
      return input;
    }

    let date;

    // If input is dd-mm-yyyy or dd.mm.yyyy → normalize
    if (typeof input === "string") {
      const normalized = input.replace(/[-.]/g, "/");
      const parts = normalized.split("/");

      // Handle dd/mm/yyyy
      if (parts.length === 3 && parts[0].length === 2) {
        const [dd, mm, yyyy] = parts;
        return `${dd}/${mm}/${yyyy}`;
      }

      date = new Date(input);
    } else {
      date = new Date(input);
    }

    // Invalid date check
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

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
                onClick={handleExport}
                style={{
                border: "none",
                background: "darkred",
                cursor: "pointer",
                color: "white",
                 marginRight: "10px"
                }}
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
                TRIAL BALANCE
            </h2>
            {currentGroupName && (
              <h2 style={{ fontWeight: "bold", fontSize:"18px", marginTop: "10px" }}>{currentGroupName}</h2>
            )}
            <h2 style={{ fontWeight: "bold", marginTop: "10px",fontSize:"18px",marginRight:"10px" }}>
                Period: {ledgerFrom} To {ledgerTo}
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
                PCS
                </th>
                <th style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                QTY
                </th>
                <th style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                DR.BALANCE
                </th>
                <th style={{ border: "1px solid black", padding: "6px", textAlign: "center" }}>
                CR.BALANCE
                </th>
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
                <td style={{ border: "1px solid black", padding: "6px", textAlign: "right" }}>{l.netPcs}</td>
                <td style={{ border: "1px solid black", padding: "6px", textAlign: "right" }}>{l.netWeight}</td>
                <td style={{ border: "1px solid black", padding: "6px", textAlign: "right" }}>
                {l.debit > 0
                    ? l.debit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : ""}
                </td>
                <td style={{ border: "1px solid black", padding: "6px", textAlign: "right" }}>
                {l.credit > 0
                    ? l.credit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    : ""}
                </td>
                </tr>
              ))}
             </tbody>


            {/* ✅ Totals row only on last chunk */}
            {idx === chunks.length - 1 && (
            <tfoot>
                <tr style={{ fontWeight: "bold", background: "#f2f2f2", fontSize: 20 }}>
                <td style={{ border: "1px solid black", padding: "6px" }} colSpan={5}>
                    TOTAL
                </td>
                <td style={{ border: "1px solid black", padding: "6px", textAlign: "right" }}>
                    {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style={{ border: "1px solid black", padding: "6px", textAlign: "right" }}>
                    {totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
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

export default PrintTrail;
