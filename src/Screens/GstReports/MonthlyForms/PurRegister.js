import React, { useEffect, useState, useRef, useMemo } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import axios from "axios";
import useCompanySetup from "../../Shared/useCompanySetup";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const PurRegister = ({ open, onClose, formData }) => {
  const printRef = useRef();
  const { companyName, companyAdd, companyCity, companyGST, companyPAN } =
    useCompanySetup();
  const [purchases, setpurchases] = useState([]);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    // ISO format
    if (dateStr.includes("T")) {
      return new Date(dateStr);
    }

    // dd-mm-yyyy
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("-");
      return new Date(year, month - 1, day);
    }

    // dd/mm/yyyy
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [day, month, year] = dateStr.split("/");
      return new Date(year, month - 1, day);
    }

    // yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      return new Date(dateStr);
    }

    return new Date(dateStr);
  };

  useEffect(() => {
    if (!open) return;

    const fetchpurchases = async () => {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/purchase",
      );

      const from = parseDate(formData.fromDate);
      const to = parseDate(formData.toDate);

      const filtered = res.data.filter((purchase) => {
        const purchaseDate = parseDate(purchase.formData?.date);

        if (!from || !to) return true;

        const s = new Date(purchaseDate.setHours(0, 0, 0, 0));
        const f = new Date(from.setHours(0, 0, 0, 0));
        const t = new Date(to.setHours(23, 59, 59, 999));

        return s >= f && s <= t;
      });

      setpurchases(filtered);
    };

    fetchpurchases();
  }, [open, formData]);

  // const { rows, totals } = useMemo(() => {
  //   const totals = {
  //     totalValue: 0,
  //     interValue: 0,
  //     interIGST: 0,
  //     b2bValue: 0,
  //     b2bCGST: 0,
  //     b2bSGST: 0,
  //     b2bCESS: 0,
  //     b2cValue: 0,
  //     b2cCGST: 0,
  //     b2cSGST: 0,
  //   };

  //   const rows = purchases.map((purchase) => {
  //     const f = purchase.formData || {};
  //     const cust = purchase.supplierdetails?.[0] || {};

  //     const igst = Number(f.igst || 0);
  //     const cgst = Number(f.cgst || 0);
  //     const sgst = Number(f.sgst || 0);
  //     const cess = Number(f.cess || 0);

  //     const taxable = Number(f.sub_total || 0);
  //     const grand = Number(f.grandtotal || 0);

  //     totals.totalValue += grand;

  //     const row = {
  //       date: f.date,
  //       bill: f.vno,
  //       name: cust.vacode,
  //       gst: cust.gstno,
  //       total: grand,

  //       interValue: "",
  //       interIGST: "",
  //       b2bValue: "",
  //       b2bCGST: "",
  //       b2bSGST: "",
  //       b2bCESS: "",
  //       b2cValue: "",
  //       b2cCGST: "",
  //       b2cSGST: "",
  //     };

  //     if (igst > 0) {
  //       row.interValue = taxable;
  //       row.interIGST = igst;

  //       totals.interValue += taxable;
  //       totals.interIGST += igst;
  //     } else if (cust.gstno) {
  //       row.b2bValue = taxable;
  //       row.b2bCGST = cgst;
  //       row.b2bSGST = sgst;
  //       row.b2bCESS = cess;

  //       totals.b2bValue += taxable;
  //       totals.b2bCGST += cgst;
  //       totals.b2bSGST += sgst;
  //       totals.b2bCESS += cess;
  //     } else {
  //       row.b2cValue = taxable;
  //       row.b2cCGST = cgst;
  //       row.b2cSGST = sgst;

  //       totals.b2cValue += taxable;
  //       totals.b2cCGST += cgst;
  //       totals.b2cSGST += sgst;
  //     }

  //     return row;
  //   });

  //   return { rows, totals };
  // }, [purchases]);

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
    unRegOutValue: 0,
    unRegOutIGST: 0,
  };

  const rows = purchases.map((purchase) => {
    const f = purchase.formData || {};
    const cust = purchase.supplierdetails?.[0] || {};

    const igst = Number(f.igst || 0);
    const cgst = Number(f.cgst || 0);
    const sgst = Number(f.sgst || 0);
    const cess = Number(f.cess || 0);

    const taxable = Number(f.sub_total || 0);
    const grand = Number(f.grandtotal || 0);
    const taxType = f.stype || "";

    const isRegistered = cust.gstno && cust.gstno.trim() !== "";

    totals.totalValue += grand;

    const row = {
      date: f.date,
      bill: f.vno,
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

      unRegOutValue: "",
      unRegOutIGST: "",

      Taxtype : taxType
    };

    if (isRegistered && igst > 0) {
      // INTER STATE PURCHASE
      row.interValue = taxable;
      row.interIGST = igst;

      totals.interValue += taxable;
      totals.interIGST += igst;
    } 
    else if (isRegistered) {
      // TAXABLE PERSON (Registered within state)
      row.b2bValue = taxable;
      row.b2bCGST = cgst;
      row.b2bSGST = sgst;
      row.b2bCESS = cess;

      totals.b2bValue += taxable;
      totals.b2bCGST += cgst;
      totals.b2bSGST += sgst;
      totals.b2bCESS += cess;
    } 
    else if (!isRegistered && igst > 0) {
      // UNREGISTERED OUT OF STATE
      row.unRegOutValue = taxable;
      row.unRegOutIGST = igst;

      totals.unRegOutValue += taxable;
      totals.unRegOutIGST += igst;
    } 
    else {
      // RETAIL PURCHASE WITHIN STATE
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
}, [purchases]);

  const format2 = (val) => {
    const num = Number(val);
    return isNaN(num) || num === 0 ? "" : num.toFixed(2);
  };

  const handlePrint = () => {
    const WinPrint = window.open("", "", "width=1200,height=800");

    WinPrint.document.write(`
  <html>
  <head>

  <title>purchase Register</title>

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

  const handleExportExcel = async () => {
    const workbook = new ExcelJS.Workbook();

    const response = await fetch("excel/vat31.xlsx");
    const buffer = await response.arrayBuffer();

    await workbook.xlsx.load(buffer);

    const worksheet = workbook.getWorksheet("VAT31");

    worksheet.getCell("A1").value = companyName;
    worksheet.getCell("A2").value = companyCity;
    worksheet.getCell("A3").value = "GSTIN : " + companyGST;
    worksheet.getCell("A4").value = "PAN : " + companyPAN; 

    worksheet.getCell("E5").value = formData.fromDate;
    worksheet.getCell("E6").value = formData.toDate;

    let startRow = 8; // your data row in template

    rows.forEach((r, index) => {
      const row = worksheet.getRow(startRow + index);

      row.getCell(1).value = r.bill;
      row.getCell(2).value = parseDate(r.date)?.toLocaleDateString("en-GB");
      row.getCell(3).value = r.name;
      row.getCell(4).value = r.gst;

      row.getCell(5).value = r.total;

      row.getCell(6).value = r.interValue;
      row.getCell(7).value = r.interIGST;
      row.getCell(8).value = r.interIGST;

      row.getCell(9).value = r.b2bValue;
      row.getCell(10).value = r.b2bCGST;
      row.getCell(11).value = r.b2bSGST;
      row.getCell(12).value = r.b2bCESS;

      row.getCell(13).value = r.b2cValue;
      row.getCell(14).value = r.b2cCGST;
      row.getCell(15).value = r.b2cSGST;

      row.getCell(16).value = r.unRegOutValue;
      row.getCell(17).value = r.unRegOutIGST;
      row.getCell(19).value = r.Taxtype;

      row.commit();
    });

    const fileBuffer = await workbook.xlsx.writeBuffer();

    saveAs(new Blob([fileBuffer]), "VAT32.xlsx");
  };

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
                  <th colSpan="4">FROM TAXABLE PERSON</th>
                  <th colSpan="3">UN-REG WITHIN STATE</th>
                  <th colSpan="2">UN-REG OUT</th>

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

                  <th>VALUE</th>
                  <th>I.TAX</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r, i) => (
                  <tr key={i}>
                    <td>{parseDate(r.date)?.toLocaleDateString("en-GB")}</td>
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

                    <td className="text-end">{format2(r.unRegOutValue)}</td>
                    <td className="text-end">{format2(r.unRegOutIGST)}</td>

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

                  <td className="text-end">
                    {totals.unRegOutValue.toFixed(2)}
                  </td>
                  <td className="text-end">{totals.unRegOutIGST.toFixed(2)}</td>

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
          <Button  variant="contained" sx={{ mr: 2 }} onClick={handleExportExcel}>Export</Button>
          <Button variant="contained" color="warning" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PurRegister;
