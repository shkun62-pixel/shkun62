import React, { useRef } from "react";
import { Modal, Box, Button, Table } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import useCompanySetup from "../Shared/useCompanySetup";

const GstRegisterPrint = ({ isOpen, handleClose, rows, summary, fromDate, toDate }) => {
  const { companyName, companyAdd, companyCity } = useCompanySetup();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-GB");
  };

  const parseDMY = (str) => {
    const [d, m, y] = str.split("/");
    return new Date(`${y}-${m}-${d}`);
  };

  const fmt = (v) => {
    if (v === null || v === undefined || v === "") return "";
    const n = Number(v);
    if (isNaN(n)) return "";
    return n.toFixed(2);
  };

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      disablePortal      // 🔥 FIX 1
      disableEnforceFocus // 🔥 FIX 2
      disableAutoFocus    // 🔥 FIX 3
    >
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
          width: "100%",
          height: "100%",
          margin: "auto",
          overflowY: "auto",
        }}
      >
        {/* ACTION BUTTONS */}
        <Button className="Button" variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>
        <Button
          className="Button"
          variant="contained"
          color="secondary"
          onClick={handleClose}
          style={{ marginLeft: 10 }}
        >
          Close
        </Button>

        {/* PRINT AREA */}
        <div
          ref={componentRef}
          style={{
            width: "390mm",
            minHeight: "390mm",
            margin: "auto",
            padding: "30px",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              className="headers2"
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bolder",
              }}
            >
              {companyName}
            </span>
            <span className="headers" style={{ textAlign: "center", fontSize: 35 }}>
              {companyAdd}
            </span>
            <span className="headers" style={{ textAlign: "center", fontSize: 35 }}>
              {companyCity}
            </span>
          </div>

          {/* PERIOD */}
          <div style={{ display: "flex", marginTop: 10 }}>
            <span style={{ fontSize: 25, fontWeight: "bolder", marginLeft: 15 }}>
              Summary Detail Report
            </span>

            <span style={{ fontSize: 25, fontWeight: "bold", marginLeft: "auto" }}>
              From : {formatDate(fromDate)}
            </span>

            <span
              style={{
                fontSize: 25,
                fontWeight: "bold",
                marginLeft: 10,
                marginRight: 20,
              }}
            >
              Upto : {formatDate(toDate)}
            </span>
          </div>

          {/* TABLE */}
          <table className="custom-table table table-bordered text-center small">
            <thead style={{ backgroundColor: "#4F81BD", color: "white", fontSize: "16px" }}>
              <tr>
                <th rowSpan="2">Sr</th>
                <th rowSpan="2">Date</th>
                <th rowSpan="2">B.No</th>

                <th colSpan="4">Opening Balance</th>
                <th colSpan="4">Gst Purchase</th>
                <th colSpan="4">Gst Sale</th>
                <th colSpan="4">Closing Balance</th>
              </tr>
              <tr>
                <th>C.Gst</th>
                <th>S.Gst</th>
                <th>I.Gst</th>
                <th>Cess</th>

                <th>C.Gst</th>
                <th>S.Gst</th>
                <th>I.Gst</th>
                <th>Cess</th>

                <th>C.Gst</th>
                <th>S.Gst</th>
                <th>I.Gst</th>
                <th>Cess</th>

                <th>C.Gst</th>
                <th>S.Gst</th>
                <th>I.Gst</th>
                <th>Cess</th>
              </tr>
            </thead>

            <tbody style={{ fontSize: "14px" }}>
              {rows.map((r) => (
                <tr key={r.sr}>
                  <td>{r.sr}</td>
                  <td>{r.date}</td>
                  <td>{r.bill}</td>

                  <td>{fmt(r.opening?.cgst)}</td>
                  <td>{fmt(r.opening?.sgst)}</td>
                  <td>{fmt(r.opening?.igst)}</td>
                  <td>{fmt(r.opening?.cess)}</td>

                  <td>{fmt(r.purchase?.cgst)}</td>
                  <td>{fmt(r.purchase?.sgst)}</td>
                  <td>{fmt(r.purchase?.igst)}</td>
                  <td>{fmt(r.purchase?.cess)}</td>

                  <td>{fmt(r.sale?.cgst)}</td>
                  <td>{fmt(r.sale?.sgst)}</td>
                  <td>{fmt(r.sale?.igst)}</td>
                  <td>{fmt(r.sale?.cess)}</td>

                  <td>{fmt(r.closing?.cgst)}</td>
                  <td>{fmt(r.closing?.sgst)}</td>
                  <td>{fmt(r.closing?.igst)}</td>
                  <td>{fmt(r.closing?.cess)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* SUMMARY */}
          <div className="mt-2">
            <table className="custom-table table table-bordered text-center small">
              <thead style={{ backgroundColor: "#4F81BD", color: "white", fontSize: "16px" }}>
                <tr>
                  <th></th>
                  <th>CGST</th>
                  <th>SGST</th>
                  <th>IGST</th>
                  <th>Cess</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody style={{ fontSize: "14px" }}>
                <tr>
                  <td>Opening Balance</td>
                  <td>{fmt(summary.opening.cgst)}</td>
                  <td>{fmt(summary.opening.sgst)}</td>
                  <td>{fmt(summary.opening.igst)}</td>
                  <td>{fmt(summary.opening.cess)}</td>
                  <td>
                    {fmt(
                      (summary.opening.cgst || 0) +
                        (summary.opening.sgst || 0) +
                        (summary.opening.igst || 0) +
                        (summary.opening.cess || 0)
                    )}
                  </td>
                </tr>

                <tr>
                  <td>Gst Purchase</td>
                  <td>{fmt(summary.purchase.cgst)}</td>
                  <td>{fmt(summary.purchase.sgst)}</td>
                  <td>{fmt(summary.purchase.igst)}</td>
                  <td>{fmt(summary.purchase.cess)}</td>
                  <td>
                    {fmt(
                      (summary.purchase.cgst || 0) +
                        (summary.purchase.sgst || 0) +
                        (summary.purchase.igst || 0) +
                        (summary.purchase.cess || 0)
                    )}
                  </td>
                </tr>

                <tr>
                  <td>Gst Sale</td>
                  <td>{fmt(summary.sale.cgst)}</td>
                  <td>{fmt(summary.sale.sgst)}</td>
                  <td>{fmt(summary.sale.igst)}</td>
                  <td>{fmt(summary.sale.cess)}</td>
                  <td>
                    {fmt(
                      (summary.sale.cgst || 0) +
                        (summary.sale.sgst || 0) +
                        (summary.sale.igst || 0) +
                        (summary.sale.cess || 0)
                    )}
                  </td>
                </tr>

                <tr>
                  <td>Closing Balance</td>
                  <td>{fmt(summary.closing.cgst)}</td>
                  <td>{fmt(summary.closing.sgst)}</td>
                  <td>{fmt(summary.closing.igst)}</td>
                  <td>{fmt(summary.closing.cess)}</td>
                  <td>
                    {fmt(
                      (summary.closing.cgst || 0) +
                        (summary.closing.sgst || 0) +
                        (summary.closing.igst || 0) +
                        (summary.closing.cess || 0)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default GstRegisterPrint;
