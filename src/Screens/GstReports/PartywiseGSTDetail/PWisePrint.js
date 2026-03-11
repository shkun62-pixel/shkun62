import React, { useEffect, useState, useRef } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import Table from "react-bootstrap/Table";
import axios from "axios";
import useCompanySetup from "../../Shared/useCompanySetup";
import * as XLSX from "sheetjs-style";
import { saveAs } from "file-saver";

const PWisePrint = ({  open, onClose,  saleType, dates, broker, lessNote, gstType, selectedAccounts, selectedAccountCode}) => {

  const {companyName, companyAdd, companyCity} = useCompanySetup();
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    if (open) {
      fetchReport();
    }
  }, [open]);

  const fetchReport = async () => {
    try {
      setLoading(true);

      const url =
        saleType === "sale"
          ? "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale"
          : "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/purchase";

      const res = await axios.get(url);

      let data = res.data;

      // DATE FILTER
      data = data.filter((bill) => {
        const billDate = formatDateToDDMMYYYY(bill.formData?.date);
        return billDate >= dates.from && billDate <= dates.upto;
      });

      // BROKER FILTER
      if (broker) {
        data = data.filter((bill) => {
          const partyBroker =
            saleType === "sale"
              ? bill.formData?.broker
              : bill.formData?.broker;

          return partyBroker?.toLowerCase().includes(broker.toLowerCase());
        });
      }
      
      // ACCOUNT FILTER
      if (selectedAccounts && selectedAccounts.length > 0) {
        data = data.filter((bill) => {

          const partyCode =
            saleType === "sale"
              ? bill.customerDetails?.[0]?.Vcode
              : bill.supplierdetails?.[0]?.Vcode;

          return selectedAccounts.includes(partyCode);
        });
      }

      // SINGLE ACCOUNT FILTER (A/C Name field)
      else if (selectedAccountCode) {
        data = data.filter((bill) => {

          const partyCode =
            saleType === "sale"
              ? bill.customerDetails?.[0]?.Vcode
              : bill.supplierdetails?.[0]?.Vcode;

          return partyCode === selectedAccountCode;
        });
      }

      setReportData(data);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const groupedData = reportData.reduce((acc, bill) => {
    const isSale = saleType === "sale";

    const partyCode = isSale
    ? bill.customerDetails?.[0]?.Vcode
    : bill.supplierdetails?.[0]?.Vcode;

    const partyName = isSale
    ? bill.customerDetails?.[0]?.vacode
    : bill.supplierdetails?.[0]?.vacode;

    const city = isSale
    ? bill.customerDetails?.[0]?.city
    : bill.supplierdetails?.[0]?.city;

    if (!acc[partyCode]) {
    acc[partyCode] = {
        partyName,
        city,
        rows: [],
    };
    }

    bill.items.forEach((item) => {
      const gst =
        parseFloat(item.ctax || 0) +
        parseFloat(item.stax || 0) +
        parseFloat(item.itax || 0);

      acc[partyCode].rows.push({
        date: bill.formData.date,
        billNo: bill.formData.vbillno || bill.formData.vno,
        description: item.sdisc,
        qty: parseFloat(item.weight),
        pkgs: parseFloat(item.pkgs),
        value: parseFloat(item.amount),
        gst,
        tcs1: parseFloat(item.tcs1),
      });
    });

    return acc;
  }, {});

    const handlePrint = () => {
    const WinPrint = window.open("", "", "width=1200,height=800");

    WinPrint.document.write(`
        <html>
        <head>
        <style>
        @page { size: A4; margin: 10mm; }

        body {
            font-family: serif;
            font-size: 12px;
        }

        .print-header {
            text-align: center;
            margin-bottom: 14px;
        }

        .company-name {
            font-size: 16px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .company-address,
        .company-city {
            font-size: 12px;
        }

        table {
            border-collapse: collapse;
            width: 100%;
        }

        th, td {
            border: 1px solid black;
            padding: 4px;
            font-size: 11px;
        }

        th {
            background: #f0f0f0;
            text-align: center;
        }

        .text-end {
            text-align: right;
        }

        .page-break {
            page-break-after: always;
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

    WinPrint.document.write("</body></html>");

    WinPrint.document.close();
    WinPrint.focus();
    WinPrint.print();
    WinPrint.close();
    };

    const handleExportExcel = () => {

      const wb = XLSX.utils.book_new();
      let excelData = [];

      excelData.push([companyName]);
      excelData.push([companyAdd]);
      excelData.push([companyCity]);
      excelData.push([]);

      Object.keys(groupedData).forEach((party) => {

        const partyData = groupedData[party];
        const rows = partyData.rows;

        excelData.push([`GST Detail of M/S : ${partyData.partyName}`]);
        excelData.push([partyData.city]);
        excelData.push([`From ${dates.from} To ${dates.upto}`]);
        excelData.push([]);

        excelData.push([
          "Date",
          "Bill No",
          "Description",
          "Pcs",
          "Quantity",
          "Value",
          "GST",
          "TCS",
        ]);

        const dataStart = excelData.length + 1;

        rows.forEach((r) => {
          excelData.push([
            formatDateToDDMMYYYY(r.date),
            r.billNo,
            r.description,
            Number(r.pkgs),
            Number(r.qty),
            Number(r.value),
            Number(r.gst),
            Number(r.tcs1 || 0),
          ]);
        });

        const dataEnd = excelData.length;

        excelData.push([
          "",
          "",
          "Total",
          { f: `SUBTOTAL(9,D${dataStart}:D${dataEnd})` },
          { f: `SUBTOTAL(9,E${dataStart}:E${dataEnd})` },
          { f: `SUBTOTAL(9,F${dataStart}:F${dataEnd})` },
          { f: `SUBTOTAL(9,G${dataStart}:G${dataEnd})` },
          { f: `SUBTOTAL(9,H${dataStart}:H${dataEnd})` },
        ]);

        excelData.push([]);
        excelData.push([]);

      });

      const ws = XLSX.utils.aoa_to_sheet(excelData);

      /* COLUMN WIDTH */
      ws["!cols"] = [
        { wch: 12 },
        { wch: 12 },
        { wch: 32 },
        { wch: 10 },
        { wch: 12 },
        { wch: 14 },
        { wch: 12 },
        { wch: 12 },
      ];

      /* MERGE COMPANY HEADER */
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
      ];

      const range = XLSX.utils.decode_range(ws["!ref"]);

      for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {

          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          const cell = ws[cellAddress];

          if (!cell) continue;

          if (!cell.s) cell.s = {};

          /* COMPANY HEADER STYLE */
          if (R === 0 || R === 1 || R === 2) {
            cell.s = {
              font: { bold: true, sz: 14 },
              alignment: { horizontal: "center", vertical: "center" }
            };
          }

          /* TABLE HEADER STYLE */
          if (cell.v === "Date") {

            for (let i = 0; i < 8; i++) {

              const headerCell = ws[XLSX.utils.encode_cell({ r: R, c: i })];

              if (headerCell) {

                headerCell.s = {
                  font: { bold: true },
                  alignment: { horizontal: "center" },
                  fill: { fgColor: { rgb: "D9E1F2" } },
                  border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                  }
                };

              }
            }
          }

          /* NUMBER ALIGNMENT */
          if (C >= 3) {
            cell.s.alignment = { horizontal: "right" };
          }

        }
      }

      XLSX.utils.book_append_sheet(wb, ws, "GST Report");

      const excelBuffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(blob, "GST_Detail.xlsx");

    };

    const formatDateToDDMMYYYY = (dateStr) => {
        if (!dateStr) return "";

        // ✅ Already dd-mm-yyyy
        const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/;
        const match = dateStr.match(ddmmyyyy);
        if (match) {
        const [, dd, mm, yyyy] = match;
        const test = new Date(`${yyyy}-${mm}-${dd}`);
        if (
            test.getDate() === Number(dd) &&
            test.getMonth() + 1 === Number(mm) &&
            test.getFullYear() === Number(yyyy)
        ) {
            return dateStr;
        }
        }

        let date;

        // ✅ ISO with time (Z or offset)
        if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
        const [y, m, d] = dateStr.substring(0, 10).split("-");
        date = new Date(y, m - 1, d); // avoid timezone issues
        }
        // ✅ ISO date only (yyyy-mm-dd)
        else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        const [y, m, d] = dateStr.split("-");
        date = new Date(y, m - 1, d);
        }
        // ✅ dd/mm/yyyy
        else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [d, m, y] = dateStr.split("/");
        date = new Date(y, m - 1, d);
        }
        // ✅ yyyy/mm/dd
        else if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) {
        const [y, m, d] = dateStr.split("/");
        date = new Date(y, m - 1, d);
        }
        // 🔁 fallback (Date.parse)
        else {
        date = new Date(dateStr);
        }

        if (!date || isNaN(date.getTime())) return "";

        const dd = String(date.getDate()).padStart(2, "0");
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const yyyy = date.getFullYear();

        return `${dd}-${mm}-${yyyy}`;
    };
    
  return (
    <Modal open={open} onClose={onClose}  className="custom-modal">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "90%",
          maxWidth: "1100px",
          height: "95vh",
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          borderRadius: "6px",
        }}
      >

        {/* HEADER */}
        <Box sx={{ p: 2, borderBottom: "1px solid #ccc" }}>
          <Typography align="center" fontWeight="bold">
            {companyName}
          </Typography>

          <Typography align="center">
            {companyAdd}
          </Typography>

          <Typography align="center">
            {companyCity}
          </Typography>
        </Box>

        {/* BODY SCROLLABLE */}
        <Box
        ref={printRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
          }}
        >
          {Object.keys(groupedData).map((party, index) => {
            const partyData = groupedData[party];
            const rows = partyData.rows;

            const totalQty = rows.reduce((a, b) => a + b.qty, 0);
            const totalpkgs = rows.reduce((a, b) => a + b.pkgs, 0);
            const totalValue = rows.reduce((a, b) => a + b.value, 0);
            const totalVat = rows.reduce((a, b) => a + b.gst, 0);
            const totalTcs = rows.reduce((a, b) => a + b.tcs1, 0);

            return (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography fontWeight="bold">
                  GST Detail of M/S : {partyData.partyName}
                </Typography>

                <Typography>{partyData.city}</Typography>

                <Typography sx={{ mb: 1 }}>
                  From {dates.from} To {dates.upto}
                </Typography>

                <Table bordered size="sm">
                  <thead>
                    <tr style={{ background: "#f3f3f3" }}>
                      <th>Date</th>
                      <th>Bill No</th>
                      <th>Description</th>
                      <th style={{ textAlign: "right" }}>Pcs</th>
                      <th style={{ textAlign: "right" }}>Quantity</th>
                      <th style={{ textAlign: "right" }}>Value</th>
                      <th style={{ textAlign: "right" }}>GST</th>
                      <th style={{ textAlign: "right" }}>Tcs</th>
                    </tr>
                  </thead>

                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={i}>
                        <td>{formatDateToDDMMYYYY(r.date)}</td>
                        <td>{r.billNo}</td>
                        <td>{r.description}</td>
                        <td style={{ textAlign: "right" }}>{r.pkgs.toFixed(3)}</td>
                        <td style={{ textAlign: "right" }}>{r.qty.toFixed(3)}</td>
                        <td style={{ textAlign: "right" }}>{r.value.toFixed(2)}</td>
                        <td style={{ textAlign: "right" }}>{r.gst.toFixed(2)}</td>
                        <td style={{ textAlign: "right" }}>{Number(r.tcs1 || 0).toFixed(2)}</td>
                      </tr>
                    ))}

                    <tr style={{ textAlign: "right" }}>
                      <td colSpan={3} style={{ textAlign: "right" }}>
                        Total
                      </td>
                      <td>{totalpkgs.toFixed(3)}</td>
                      <td>{totalQty.toFixed(3)}</td>
                      <td>{totalValue.toFixed(2)}</td>
                      <td>{totalVat.toFixed(2)}</td>
                      <td>{Number(totalTcs || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Box>
            );
          })}
        </Box>

        {/* FOOTER */}
        <Box
          sx={{
            p: 2,
            borderTop: "1px solid #ccc",
            display: "flex",
            justifyContent: "flex-end",
            gap:2
          }}
        >
          <Button variant="contained" color="primary" onClick={handlePrint}>
              Print
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleExportExcel}
          >
            Export
          </Button>

          <Button variant="contained" color="error" onClick={onClose}>
            Close
          </Button>
        </Box>

      </Box>
    </Modal>
  );
};

export default PWisePrint;