import React, { useEffect, useState, useRef } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import Table from "react-bootstrap/Table";
import axios from "axios";
import useCompanySetup from "../../Shared/useCompanySetup";

const PWisePrint = ({ open, onClose, saleType, dates }) => {

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

      setReportData(res.data);
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
                      <th style={{ textAlign: "right" }}>Ex.Duty</th>
                      <th style={{ textAlign: "right" }}>Duty PMT</th>
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
                        <td></td>
                        <td></td>
                        <td></td>
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
                      <td></td>
                      <td></td>
                      <td></td>
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
          }}
        >
            <Button variant="contained" color="primary" onClick={handlePrint}>
                Print
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