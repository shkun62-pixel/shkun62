import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import axios from "axios";
import Table from "react-bootstrap/Table";
import useCompanySetup from "../../Shared/useCompanySetup";
import * as XLSX from "sheetjs-style";
import { saveAs } from "file-saver";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "85%",
  bgcolor: "white",
  p: 4,
  borderRadius: 2,
  maxHeight: "90vh",
  overflow: "auto",
};

export default function GSTPrintModal({
  open,
  handleClose,
  type,
  startDate,
  endDate,
  city,
  state,
  agent,
  accountname,
  condition,
  taxType,
}) {

  const {companyName, companyAdd, companyCity} = useCompanySetup();
  const [data, setData] = useState([]);

  // UNIVERSAL DATE PARSER
  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    // ISO format
    if (dateStr.includes("T")) {
      return new Date(dateStr);
    }

    // replace / with -
    const cleaned = dateStr.replace(/\//g, "-");

    const parts = cleaned.split("-");

    if (parts.length === 3) {
      const [d, m, y] = parts;

      if (y.length === 4) {
        return new Date(`${y}-${m}-${d}`);
      }
    }

    return new Date(dateStr);
  };

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open, type, startDate, endDate, city, state, agent]);

  const fetchData = async () => {
    let url = "";

    if (type === "Sale") {
      url =
        "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale";
    } else {
      url =
        "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/purchase";
    }

    const res = await axios.get(url);

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    // FILTER DATA
    const filtered = res.data.filter((row) => {
      let partyname = "";
      let partyCity = "";
      let partyState = "";
      let partyAgent = "";

      if (type === "Sale") {
        partyname = row.customerDetails?.[0]?.vacode || "";
        partyCity = row.customerDetails?.[0]?.city || "";
        partyState = row.customerDetails?.[0]?.state || "";
        partyAgent = row.formData?.broker || "";
      } else {
        partyname = row.customerDetails?.[0]?.vacode || "";
        partyCity = row.supplierdetails?.[0]?.city || "";
        partyState = row.supplierdetails?.[0]?.state || "";
        partyAgent = row.formData?.broker || "";
      }
      const Taxtype = row.formData?.stype

      const billDate = parseDate(row.formData?.date);

      if (start && billDate < start) return false;
      if (end && billDate > end) return false;

      if (city && partyCity.toLowerCase() !== city.toLowerCase()) return false;

      if (state && partyState.toLowerCase() !== state.toLowerCase())
        return false;

      if (agent && partyAgent.toLowerCase() !== agent.toLowerCase()) return false;

      if (taxType && taxType !== "All" && Taxtype?.toLowerCase() !== taxType.toLowerCase()) 
        return false;

      if (accountname && accountname !== "All" && partyname?.toLowerCase() !== accountname.toLowerCase()) 
        return false;

      return true;
    });

    // GROUP DATA
    const grouped = {};

    filtered.forEach((row) => {
      let party = "";
      let partyName = "";
      let partyCity = "";
      let gst = "";

      if (type === "Sale") {
        party = row.customerDetails?.[0]?.Vcode || "";
        partyName = row.customerDetails?.[0]?.vacode || "";
        partyCity = row.customerDetails?.[0]?.city || "";
        gst = row.customerDetails?.[0]?.gstno || "";
      } else {
        party = row.supplierdetails?.[0]?.Vcode || "";
        partyName = row.supplierdetails?.[0]?.vacode || "";
        partyCity = row.supplierdetails?.[0]?.city || "";
        gst = row.supplierdetails?.[0]?.gstno || "";
      }

      if (!grouped[party]) {
        grouped[party] = {
          party,
          partyName,
          city: partyCity,
          gst,
          bills: [],
          totalValue: 0,
          totalGst: 0,
          totalBill: 0,
        };
      }

      const value = parseFloat(row.formData?.sub_total || 0);
      const gstValue = parseFloat(row.formData?.tax || 0);
      const bill = parseFloat(row.formData?.grandtotal || 0);

      const displayDate = parseDate(row.formData?.date)?.toLocaleDateString(
        "en-GB",
      );

      grouped[party].bills.push({
        billNo: row.formData?.vbillno || row.formData?.vno,
        date: displayDate,
        value,
        gst: gstValue,
        bill,
      });

      grouped[party].totalValue += value;
      grouped[party].totalGst += gstValue;
      grouped[party].totalBill += bill;
    });

    setData(Object.values(grouped));
  };

  const grandTotalValue = data.reduce((sum, p) => sum + p.totalValue, 0);
  const grandTotalGst = data.reduce((sum, p) => sum + p.totalGst, 0);
  const grandTotalBill = data.reduce((sum, p) => sum + p.totalBill, 0);

  const exportToExcel = () => {
    const sheetData = [];

    sheetData.push([companyName]);
    sheetData.push([companyAdd]);
    sheetData.push([companyCity]);
    sheetData.push([]);
    sheetData.push([`C.FORM STATEMENT FROM ${startDate} TO ${endDate}`]);
    sheetData.push([]);

    sheetData.push([
      "Account Name",
      "City",
      "GSTIN",
      "Bill No",
      "Bill Date",
      "Value",
      "GST",
      "Bill Value",
    ]);

    data.forEach((party) => {
      party.bills.forEach((bill) => {
        sheetData.push([
          party.partyName,
          party.city,
          party.gst,
          bill.billNo,
          bill.date,
          bill.value,
          bill.gst,
          bill.bill,
        ]);
      });

      sheetData.push([
        "",
        "",
        "Totals",
        "",
        "",
        party.totalValue,
        party.totalGst,
        party.totalBill,
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    /* COLUMN WIDTH */
    ws["!cols"] = [
      { wch: 30 },
      { wch: 20 },
      { wch: 22 },
      { wch: 14 },
      { wch: 14 },
      { wch: 16 },
      { wch: 16 },
      { wch: 18 },
    ];

    /* MERGE COMPANY DETAILS */
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 7 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: 7 } },
    ];

    /* CENTER COMPANY DETAILS */
    for (let i = 0; i <= 4; i++) {
      const cell = ws[XLSX.utils.encode_cell({ r: i, c: 0 })];
      if (cell) {
        cell.s = {
          alignment: { horizontal: "center", vertical: "center" },
          font: { bold: true, sz: i === 0 ? 16 : 12 },
        };
      }
    }

    /* HEADER STYLE */
    const headerRow = 6;

    for (let col = 0; col < 8; col++) {
      const cell = ws[XLSX.utils.encode_cell({ r: headerRow, c: col })];

      if (cell) {
        cell.s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "305496" } },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }
    }

    /* CREATE WORKBOOK */
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "cForm");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(file, "cForm.xlsx");
  };

  return (
      <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick") return;
          handleClose();
        }}
        backdrop="static"
      >
      <Box sx={style}>
        <Typography align="center" fontWeight="bold" fontSize={22}>
          {companyName}
        </Typography>

        <Typography align="center">{companyAdd}</Typography>

        <Typography align="center">{companyCity}</Typography>

        <Typography mt={2}>
          C.FORM STATEMENT FROM DT. {startDate} To {endDate}
        </Typography>

        <Table bordered size="sm" style={{ marginTop: 10 }}>
          <thead>
            <tr>
              <th style={th}>Account Name</th>
              <th style={th}>GSTIN</th>
              <th style={th}>Bill No.</th>
              <th style={th}>B.Date</th>
              <th style={th}>Value</th>
              <th style={th}>G.S.T</th>
              <th style={th}>Bill Value</th>
            </tr>
          </thead>

          <tbody>
            {data.map((party, i) => (
              <React.Fragment key={i}>
                {party.bills.map((bill, index) => (
                  <tr key={index}>
                    {index === 0 && (
                      <td style={td} rowSpan={party.bills.length + 1}>
                        {party.partyName}
                        <br />
                        {party.city}
                      </td>
                    )}

                    {index === 0 && (
                      <td style={td} rowSpan={party.bills.length + 1}>
                        {party.gst}
                      </td>
                    )}

                    <td style={td}>{bill.billNo}</td>

                    <td style={td}>{bill.date}</td>

                    <td style={tdRight}>{bill.value.toFixed(2)}</td>

                    <td style={tdRight}>{bill.gst.toFixed(2)}</td>

                    <td style={tdRight}>{bill.bill.toFixed(2)}</td>
                  </tr>
                ))}

                <tr>
                  <td style={td} colSpan={2}>
                    <b>Totals :</b>
                  </td>

                  <td style={tdRight}>{party.totalValue.toFixed(2)}</td>

                  <td style={tdRight}>{party.totalGst.toFixed(2)}</td>

                  <td style={tdRight}>{party.totalBill.toFixed(2)}</td>
                </tr>
              </React.Fragment>
            ))}
              {/* GRAND TOTAL */}
            <tr>
              <td style={td} colSpan={4}>
                <b>Grand Total</b>
              </td>

              <td style={tdRight}>
                <b>{grandTotalValue.toFixed(2)}</b>
              </td>

              <td style={tdRight}>
                <b>{grandTotalGst.toFixed(2)}</b>
              </td>

              <td style={tdRight}>
                <b>{grandTotalBill.toFixed(2)}</b>
              </td>
            </tr>
          </tbody>
        </Table>

        <Box mt={3} display="flex" gap={2}>
          <Button variant="contained" onClick={() => window.print()}>
            PRINT
          </Button>
          <Button variant="contained" onClick={exportToExcel} >EXPORT </Button>
          <Button variant="contained" style={{backgroundColor:'red'}} onClick={handleClose}>
            CLOSE
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

const th = {
  border: "1px solid #000",
  padding: "6px",
  textAlign: "center",
  fontWeight: "bold"
};

const td = {
  border: "1px solid #000",
  padding: "6px"
};

const tdRight = {
  border: "1px solid #000",
  padding: "6px",
  textAlign: "right"
};