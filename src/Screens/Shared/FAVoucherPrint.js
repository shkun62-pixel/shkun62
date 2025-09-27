import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Modal, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useCompanySetup from "../Shared/useCompanySetup";

const fmtINR = (n) =>
  (Number(n) || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtDate = (d) => {
  try {
    const dt = new Date(d);
    return isNaN(dt) ? "" : dt.toLocaleDateString("en-IN");
  } catch {
    return "";
  }
};

const FAVoucherPrint = React.forwardRef(
  ({ open, onClose, fa, vtype, cfg, totals }, ref) => {
    const { companyName, companyAdd, companyCity, cPin } = useCompanySetup();
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

    return (
      <Modal
        open={open}
        onClose={onClose}
        style={{ overflow: "auto" }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            bgcolor: "white",
            boxShadow: 24,
            maxWidth: "900px",
            mx: "auto",
            my: "2%",
            borderRadius: 2,
            overflowY: "auto",
          }}
        >
          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2,padding:2 }}>
            <Button
              startIcon={<CloseIcon />}
              variant="outlined"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="contained"
              sx={{ bgcolor: "lightcoral", "&:hover": { bgcolor: "red" } }}
              onClick={handlePrint}
            >
              Print
            </Button>
          </Box>

          {/* Printable content */}
          <div
            ref={componentRef}
            style={{
              width: "210mm",
              minHeight: "297mm",
              margin: "auto",
              paddingTop: "20px",
              background: "#fff",
              boxSizing: "border-box",
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 20,fontSize:25,fontFamily: "Courier New" }}>
              <h1 style={{ margin: 0, fontSize:35 }}>{companyName?.toUpperCase()}</h1>
              <p style={{ margin: 0 }}>{companyAdd}</p>
              <p style={{ margin: 0 }}>
                {companyCity}-{cPin}
              </p>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between",fontFamily: "Courier New",fontSize:18 }}>
              <span>Voucher No: {fa?.voucherNo}</span>
              <span>Date: {fmtDate(fa?.date)}</span>
              <span>{cfg.header}</span>
            </div>

            {/* Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: 20,
              }}
            >
              <thead>
                <tr style={{ background: "#eee",fontFamily: "Courier New", textAlign:'center' }}>
                  <th style={{ border: "1px solid black", padding: 8 }}>
                    Account / Narration
                  </th>
                  <th style={{ border: "1px solid black", padding: 8 }}>
                    Debit
                  </th>
                  <th style={{ border: "1px solid black", padding: 8 }}>
                    Credit
                  </th>
                </tr>
              </thead>
              <tbody>
                {(fa?.transactions || []).map((t, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: 8,
                        textAlign: "left",
                      }}
                    >
                      <div style={{ fontWeight: "bold" }}>{t.account}</div>
                      <div style={{ fontSize: 12, color: "#666" }}>
                        {t.narration}
                      </div>
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: 8,
                        textAlign: "right",
                      }}
                    >
                      {t.type === "debit" ? fmtINR(t.amount) : ""}
                    </td>
                    <td
                      style={{
                        border: "1px solid black",
                        padding: 8,
                        textAlign: "right",
                      }}
                    >
                      {t.type === "credit" ? fmtINR(t.amount) : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: 8,
                      fontWeight: "bold",
                    }}
                  >
                    TOTAL
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: 8,
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    {fmtINR(totals.debit)}
                  </td>
                  <td
                    style={{
                      border: "1px solid black",
                      padding: 8,
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    {fmtINR(totals.credit)}
                  </td>
                </tr>
              </tfoot>
            </table>

            {/* Totals */}
            <div style={{ marginTop: 30, fontSize: 18, fontFamily: "Courier New" }}>
              {/* <p>
                <strong>Debit Total:</strong> {fmtINR(totals.debit)}
              </p>
              <p>
                <strong>Credit Total:</strong> {fmtINR(totals.credit)}
              </p> */}
              <p>
                <strong>Difference:</strong> {fmtINR(totals.diff)}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {totals.balanced ? "BALANCED" : "NOT BALANCED"}
              </p>
            </div>

            {/* Signatures */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 50,
                fontFamily: "Courier New"
                ,fontSize:18 
              }}
            >
              <span>Prepared By</span>
              <span>Accountant</span>
              <span>Authorised Signatory</span>
            </div>
          </div>
        </Box>
      </Modal>
    );
  }
);

export default FAVoucherPrint;
