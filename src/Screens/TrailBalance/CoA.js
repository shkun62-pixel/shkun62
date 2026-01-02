import React, { useRef, useState } from "react";
import { Modal, Box, Button, CircularProgress } from "@mui/material";
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

const CoA = ({
  filteredTransactions = [],
  isOpen,
  handleClose,
  ledgerFrom,
  ledgerTo,
  currentDate,
  selectedLedger,
  handleExport
}) => {
  const { companyName, companyAdd, companyCity, companyPAN } = useCompanySetup();

  const componentRef = useRef();
  const [loadingPrint, setLoadingPrint] = useState(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setLoadingPrint(true); // Show loader before generating print
    },
    onAfterPrint: () => {
      setLoadingPrint(false); // Hide loader after print
    },
    onPrintError: () => {
      setLoadingPrint(false); // Hide loader if print fails
    },
  });

  // ✅ Chunk transactions for page breaks
  const chunks = chunkItems(filteredTransactions, 25, 35);

  // ✅ Calculate totals
  let totalDebit = 0,
    totalCredit = 0,
    finalBalance = 0;
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
    <Modal style={{ zIndex: 100000 }} open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          bgcolor: "white",
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
          maxHeight: "100vh",
          position: "relative",
        }}
      >
        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            onClick={handlePrint}
            disabled={loadingPrint}
            style={{
              background: "lightcoral",
              color: "black",
              marginRight: "10px",
            }}
          >
            {loadingPrint ? "Preparing..." : "Print"}
          </Button>
              <Button
          variant="contained"
            style={{
              background: "lightcoral",
              color: "black",
              marginRight: "10px",
            }}
             onClick={handleExport}>Export</Button>
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

        {/* ✅ Loader Overlay */}
        {loadingPrint && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 200000,
            }}
          >
            <CircularProgress color="primary" />
            <span
              style={{
                marginLeft: "10px",
                fontSize: "18px",
                color: "darkblue",
              }}
            >
              Preparing to Print...
            </span>
          </div>
        )}

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
            // border: "1px solid #ccc",
            marginTop: "15px",
          }}
        >
          {/* Header */}
          <h1
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "35px",
              color: "darkblue",
              fontFamily: "Courier New",
            }}
          >
            {companyName?.toUpperCase()}
          </h1>
          <p
            style={{
              textAlign: "center",
              margin: "0",
              fontSize: "22px",
              color: "darkblue",
              fontFamily: "Courier New",
            }}
          >
            {companyAdd}
          </p>
          <p
            style={{
              textAlign: "center",
              margin: "0",
              fontSize: "22px",
              color: "darkblue",
              fontFamily: "Courier New",
            }}
          >
            {companyCity}
          </p>
          <p
            style={{
              textAlign: "center",
              margin: "0",
              fontSize: "20px",
              fontWeight:'bold',
              fontFamily: "Courier New",
            }}
          >
            Sub : Statement of Accounts For F.Y.{" "}
            {new Date(ledgerFrom).getFullYear()} -{" "}
            {new Date(ledgerTo).getFullYear()}
          </p>
          {currentDate && (
            <h2
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                marginLeft: "72.3%",
                fontFamily: "Courier New",
              }}
            >
              Print Date: {formatDate(currentDate)}
            </h2>
          )}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              fontFamily: "Courier New",
              marginTop:"20px"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", }}>
              <span style={{ fontSize: 20 }}>
                A/C: <b>{selectedLedger.formData.ahead}</b> <br />
              </span>
              <span style={{ fontSize: 20 }}>
                <b>{selectedLedger.formData.add1}</b> <br />
              </span>
              <span style={{ fontSize: 20 }}>
                <b>{selectedLedger.formData.city}</b> <br />
              </span>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <span style={{ fontSize: 20 }}>
                  GST No: <b>{selectedLedger.formData.gstNo}</b> <br />
                </span>
                <span style={{ fontSize: 20, marginLeft: "10px" }}>
                  PAN: <b>{selectedLedger.formData.pan}</b> <br />
                </span>
              </div>
            </div>
            <div style={{ marginTop: "50px" }}>
              <h2 style={{ fontSize: 20,fontWeight:"bold",fontFamily: "Courier New", }}>COPY OF ACCOUNT</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h2
                style={{
                  fontWeight: "bold",
                  marginTop: "10px",
                  fontSize: "20px",
                  fontFamily: "Courier New",
                }}
              >
                From: {formatDate(ledgerFrom)}
              </h2>
              <h2
                style={{
                  fontWeight: "bold",
                  marginTop: "10px",
                  fontSize: "20px",
                }}
              >
                UpTo: {formatDate(ledgerTo)}
              </h2>
            </div>
          </div>
          <div style={{ marginTop: "10px", fontSize: 20,fontFamily: "Courier New", }}>
            <p>
              <b>Dear Sir/Madam,</b>
              <br />
              Given below are the details of your Accounts as Standing in
              my/our Books of Accounts for the period as above. Kindly return
              this form to us, duly signed by you in confirmation of the same.
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
                  <tr style={{ background: "#ddd", fontSize: 20,textAlign:'center',fontFamily: "Courier New" }}>
                    <th style={{ border: "1px solid black", padding: "6px" }}>
                      Date
                    </th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>
                      Type
                    </th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>
                      Narration
                    </th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>
                      Debit
                    </th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>
                      Credit
                    </th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>
                      Balance
                    </th>
                    <th style={{ border: "1px solid black", padding: "6px" }}>
                      DR/CR
                    </th>
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
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "6px",
                          }}
                        >
                          {new Date(txn.date).toLocaleDateString("en-GB")}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "6px",
                            textAlign: "center",
                          }}
                        >
                          {txn.vtype}
                        </td>
                        <td
                          style={{ border: "1px solid black", padding: "6px" }}
                        >
                          {txn.narration}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "6px",
                            textAlign: "right",
                            color: "darkblue",
                          }}
                        >
                          {txn.type.toLowerCase() === "debit"
                            ? txn.amount.toFixed(2)
                            : ""}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "6px",
                            textAlign: "right",
                            color: "red",
                          }}
                        >
                          {txn.type.toLowerCase() === "credit"
                            ? txn.amount.toFixed(2)
                            : ""}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "6px",
                            textAlign: "right",
                            color,
                          }}
                        >
                          {Math.abs(runningBalance).toFixed(2)}
                        </td>
                        <td
                          style={{
                            border: "1px solid black",
                            padding: "6px",
                            textAlign: "center",
                            color,
                          }}
                        >
                          {drcr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

                {/* Totals row only on last chunk */}
                {idx === chunks.length - 1 && (
                  <tfoot>
                    <tr
                      style={{
                        fontWeight: "bold",
                        background: "#f2f2f2",
                        fontSize: 20,
                      }}
                    >
                      <td
                        colSpan={3}
                        style={{
                          border: "1px solid black",
                          padding: "6px",
                          textAlign: "center",
                        }}
                      >
                        TOTAL
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "6px",
                          textAlign: "right",
                          color: "darkblue",
                        }}
                      >
                        {totalDebit.toFixed(2)}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "6px",
                          textAlign: "right",
                          color: "red",
                        }}
                      >
                        {totalCredit.toFixed(2)}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "6px",
                          textAlign: "right",
                          color: colorFinal,
                        }}
                      >
                        {Math.abs(finalBalance).toFixed(2)}
                      </td>
                      <td
                        style={{
                          border: "1px solid black",
                          padding: "6px",
                          textAlign: "center",
                          color: colorFinal,
                        }}
                      >
                        {drcrFinal}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            );
          })}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: "50px",
              fontSize: 20,
              justifyContent: "space-between",
              fontFamily: "Courier New",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>I/we Confirm that the above particulars are true and Correct.</p>
              <p style={{fontWeight:'bold'}}>PAN :- {selectedLedger.formData.pan}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>Your Faithfully</p>
              <p style={{fontWeight:'bold'}}>For {companyName?.toUpperCase()}</p>
              <p style={{ marginTop: "40px" }}>P.A.No.{companyPAN}</p>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default CoA;
