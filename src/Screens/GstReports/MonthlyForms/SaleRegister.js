import React, { useEffect, useState, useRef, useMemo } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import axios from "axios";
import useCompanySetup from "../../Shared/useCompanySetup";

const SaleRegister = ({ open, onClose, formData }) => {
  const printRef = useRef();
  const { companyName, companyAdd, companyCity, companyGST } =
    useCompanySetup();
  const [sales, setSales] = useState([]);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  useEffect(() => {
    if (!open) return;

    const fetchSales = async () => {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale",
      );

      const from = parseDate(formData.fromDate);
      const to = parseDate(formData.toDate);

      const filtered = res.data.filter((sale) => {
        const saleDate = new Date(sale.formData?.date);

        if (!from || !to) return true;

        const s = new Date(saleDate.setHours(0, 0, 0, 0));
        const f = new Date(from.setHours(0, 0, 0, 0));
        const t = new Date(to.setHours(23, 59, 59, 999));

        return s >= f && s <= t;
      });

      setSales(filtered);
    };

    fetchSales();
  }, [open, formData]);

  const { rows, totals } = useMemo(() => {
    const totals = {
      totalValue: 0,
      interValue: 0,
      interIGST: 0,
      b2bValue: 0,
      b2bCGST: 0,
      b2bSGST: 0,
      b2bCESS: 0,
      b2cValue: 0,
      b2cCGST: 0,
      b2cSGST: 0,
    };

    const rows = sales.map((sale) => {
      const f = sale.formData || {};
      const cust = sale.customerDetails?.[0] || {};

      const igst = Number(f.igst || 0);
      const cgst = Number(f.cgst || 0);
      const sgst = Number(f.sgst || 0);
      const cess = Number(f.cess || 0);

      const taxable = Number(f.sub_total || 0);
      const grand = Number(f.grandtotal || 0);

      totals.totalValue += grand;

      const row = {
        date: f.date,
        bill: f.vbillno,
        name: cust.vacode,
        gst: cust.gstno,
        total: grand,

        interValue: "",
        interIGST: "",
        b2bValue: "",
        b2bCGST: "",
        b2bSGST: "",
        b2bCESS: "",
        b2cValue: "",
        b2cCGST: "",
        b2cSGST: "",
      };

      if (igst > 0) {
        row.interValue = taxable;
        row.interIGST = igst;

        totals.interValue += taxable;
        totals.interIGST += igst;
      } else if (cust.gstno) {
        row.b2bValue = taxable;
        row.b2bCGST = cgst;
        row.b2bSGST = sgst;
        row.b2bCESS = cess;

        totals.b2bValue += taxable;
        totals.b2bCGST += cgst;
        totals.b2bSGST += sgst;
        totals.b2bCESS += cess;
      } else {
        row.b2cValue = taxable;
        row.b2cCGST = cgst;
        row.b2cSGST = sgst;

        totals.b2cValue += taxable;
        totals.b2cCGST += cgst;
        totals.b2cSGST += sgst;
      }

      return row;
    });

    return { rows, totals };
  }, [sales]);

  const format2 = (val) => {
    const num = Number(val);
    return isNaN(num) || num === 0 ? "" : num.toFixed(2);
  };

  const handlePrint = () => {
    const WinPrint = window.open("", "", "width=1200,height=800");

    WinPrint.document.write(`
  <html>
  <head>

  <title>Sale Register</title>

  <!-- Bootstrap CSS -->
  <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
  />

  <style>

  @page{
      size:A4 landscape;
      margin:10mm;
  }

  body{
      font-family:serif;
      font-size:12px;
      margin:0;
      padding:0;
  }

  .print-header{
      text-align:center;
      margin-bottom:12px;
  }

  .company-name{
      font-size:16px;
      font-weight:bold;
      text-transform:uppercase;
  }

  .company-address,
  .company-city{
      font-size:12px;
  }

  table{
      width:100%;
      border-collapse:collapse;
  }

  thead{
      display:table-header-group;
  }

  th,td{
      border:1px solid black !important;
      padding:4px 6px;
      font-size:11px;
  }

  th{
      text-align:center;
      vertical-align:middle;
      background:#e9ecef !important;
      font-weight:bold;
  }

  td{
      vertical-align:middle;
  }

  .text-end{
      text-align:right !important;
  }

  tfoot td{
      font-weight:bold;
      background:#f8f9fa;
  }

  </style>

  </head>

  <body>

  <div class="print-header">
      <div class="company-name">${companyName}</div>
      <div class="company-address">${companyAdd}</div>
      <div class="company-city">${companyCity}</div>
  </div>

  `);

    WinPrint.document.write(printRef.current.innerHTML);

    WinPrint.document.write(`

  </body>
  </html>

  `);

    WinPrint.document.close();
    WinPrint.focus();

    setTimeout(() => {
      WinPrint.print();
      WinPrint.close();
    }, 500);
  };

  //   const handlePrint = () => {
  //     const WinPrint = window.open("", "", "width=1200,height=800");

  //     WinPrint.document.write(`
  //         <html>
  //         <head>
  //         <style>
  //         @page { size: A4 landscape; margin: 10mm; }

  //         body{
  //             font-family: serif;
  //             font-size: 12px;
  //         }

  //         .print-header{
  //             text-align:center;
  //             margin-bottom:14px;
  //         }

  //         .company-name{
  //             font-size:16px;
  //             font-weight:bold;
  //             text-transform:uppercase;
  //         }

  //         .company-address,
  //         .company-city{
  //             font-size:12px;
  //         }

  //         /* TABLE */

  //         table{
  //             border-collapse:collapse;
  //             width:100%;
  //         }

  //         thead{
  //             display:table-header-group; /* repeat header on each page */
  //         }

  //         th,td{
  //             border:1px solid black;
  //             padding:4px 6px;
  //             font-size:11px;
  //         }

  //         th{
  //             background:#f0f0f0;
  //             text-align:center;
  //             vertical-align:middle;
  //             font-weight:bold;
  //         }

  //         /* ensure header rows align properly */

  //         thead tr:first-child th{
  //             border-bottom:1px solid black;
  //         }

  //         thead tr:nth-child(2) th{
  //             border-top:1px solid black;
  //         }

  //         .text-end{
  //             text-align:right;
  //         }

  //         tfoot td{
  //             font-weight:bold;
  //         }

  //         .page-break{
  //             page-break-after:always;
  //         }
  //         </style>
  //         </head>

  //         <body>

  //         <div class="print-header">
  //             <div class="company-name">${companyName}</div>
  //             <div class="company-address">${companyAdd}</div>
  //             <div class="company-city">${companyCity}</div>
  //         </div>
  //     `);

  //     WinPrint.document.write(printRef.current.innerHTML);

  //     WinPrint.document.write("</body></html>");

  //     WinPrint.document.close();
  //     WinPrint.focus();
  //     WinPrint.print();
  //     WinPrint.close();
  //   };

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") onClose();
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "95%",
          height: "90vh",
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: 24,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            p: 2,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            textAlign: "center",
          }}
        >
          <Typography variant="h5">{companyName}</Typography>
          <Typography variant="h6">{companyCity}</Typography>
          <Typography variant="h6">GSTIN : {companyGST}</Typography>
          <Typography>
            <b style={{ marginRight: 10 }}>{formData.reportName}</b> Period :{" "}
            {formData.fromDate} To {formData.toDate}
          </Typography>
        </Box>

        {/* BODY */}

        <Box
          sx={{
            flex: 1,
            p: 2,
            overflow: "hidden",
          }}
        >
          <div
            ref={printRef}
            style={{
              height: "100%",
              overflowY: "auto",
              border: "1px solid #dee2e6",
              borderRadius: "6px",
            }}
          >
            <table className="table table-bordered table-sm mb-0">
              <thead
                className="table-primary"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  textAlign: "center",
                }}
              >
                <tr>
                  <th rowSpan="2">DATE</th>
                  <th rowSpan="2">BILL</th>
                  <th rowSpan="2">ACCOUNT NAME</th>
                  <th rowSpan="2">GSTIN</th>
                  <th rowSpan="2">TOTAL</th>

                  <th colSpan="2">INTER STATE</th>
                  <th colSpan="4">TAXABLE PERSON</th>
                  <th colSpan="3">RETAIL SALE WITHIN STATE</th>

                  <th rowSpan="2">EXPORT</th>
                </tr>

                <tr>
                  <th>VALUE</th>
                  <th>IGST</th>

                  <th>VALUE</th>
                  <th>CGST</th>
                  <th>SGST</th>
                  <th>CESS</th>

                  <th>VALUE</th>
                  <th>CGST</th>
                  <th>SGST</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.bill}</td>
                    <td style={{ textAlign: "left" }}>{r.name}</td>
                    <td>{r.gst}</td>

                    <td className="text-end">{format2(r.total)}</td>

                    <td className="text-end">{format2(r.interValue)}</td>
                    <td className="text-end">{format2(r.interIGST)}</td>

                    <td className="text-end">{format2(r.b2bValue)}</td>
                    <td className="text-end">{format2(r.b2bCGST)}</td>
                    <td className="text-end">{format2(r.b2bSGST)}</td>
                    <td className="text-end">{format2(r.b2bCESS)}</td>

                    <td className="text-end">{format2(r.b2cValue)}</td>
                    <td className="text-end">{format2(r.b2cCGST)}</td>
                    <td className="text-end">{format2(r.b2cSGST)}</td>

                    <td></td>
                  </tr>
                ))}
              </tbody>
              <tfoot
                className="table-secondary fw-bold"
                style={{
                  position: "sticky",
                  bottom: 0,
                  zIndex: 2,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                <tr>
                  <td colSpan="4">TOTAL</td>

                  <td className="text-end">{totals.totalValue.toFixed(2)}</td>

                  <td className="text-end">{totals.interValue.toFixed(2)}</td>
                  <td className="text-end">{totals.interIGST.toFixed(2)}</td>

                  <td className="text-end">{totals.b2bValue.toFixed(2)}</td>
                  <td className="text-end">{totals.b2bCGST.toFixed(2)}</td>
                  <td className="text-end">{totals.b2bSGST.toFixed(2)}</td>
                  <td className="text-end">{totals.b2bCESS.toFixed(2)}</td>

                  <td className="text-end">{totals.b2cValue.toFixed(2)}</td>
                  <td className="text-end">{totals.b2cCGST.toFixed(2)}</td>
                  <td className="text-end">{totals.b2cSGST.toFixed(2)}</td>

                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Box>

        {/* FOOTER */}

        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #dee2e6",
            textAlign: "right",
            background: "#f8f9fa",
          }}
        >
          <Button
            variant="contained"
            color="success"
            sx={{ mr: 2 }}
            onClick={handlePrint}
          >
            Print
          </Button>
          <Button variant="contained" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SaleRegister;
