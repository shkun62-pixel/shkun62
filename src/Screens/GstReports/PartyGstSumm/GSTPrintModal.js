import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import axios from "axios";

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
}) {
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
      let partyCity = "";
      let partyState = "";
      let partyAgent = "";

      if (type === "Sale") {
        partyCity = row.customerDetails?.[0]?.city || "";
        partyState = row.customerDetails?.[0]?.state || "";
        partyAgent = row.formData?.broker || "";
      } else {
        partyCity = row.supplierdetails?.[0]?.city || "";
        partyState = row.supplierdetails?.[0]?.state || "";
        partyAgent = row.formData?.broker || "";
      }

      const billDate = parseDate(row.formData?.date);

      if (start && billDate < start) return false;
      if (end && billDate > end) return false;

      if (city && partyCity.toLowerCase() !== city.toLowerCase()) return false;

      if (state && partyState.toLowerCase() !== state.toLowerCase())
        return false;

      if (agent && partyAgent !== agent) return false;

      return true;
    });

    // GROUP DATA
    const grouped = {};

    filtered.forEach((row) => {
      let party = "";
      let partyCity = "";
      let gst = "";

      if (type === "Sale") {
        party = row.customerDetails?.[0]?.vacode || "";
        partyCity = row.customerDetails?.[0]?.city || "";
        gst = row.customerDetails?.[0]?.gstno || "";
      } else {
        party = row.supplierdetails?.[0]?.vacode || "";
        partyCity = row.supplierdetails?.[0]?.city || "";
        gst = row.supplierdetails?.[0]?.gstno || "";
      }

      if (!grouped[party]) {
        grouped[party] = {
          party,
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

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography align="center" fontWeight="bold" fontSize={22}>
          COUSINS INDUSTRIES PVT LTD
        </Typography>

        <Typography align="center">KUMBH ROAD, NEAR POWER GRID</Typography>

        <Typography align="center">MANDI GOBINDGARH</Typography>

        <Typography mt={2}>
          C.FORM STATEMENT FROM DT. {startDate} To {endDate}
        </Typography>

        <table
          width="100%"
          border="1"
          style={{ borderCollapse: "collapse", marginTop: 10 }}
        >
          <thead>
            <tr>
              <th>Account Name</th>
              <th>GSTIN</th>
              <th>Bill No.</th>
              <th>B.Date</th>
              <th>Value</th>
              <th>G.S.T</th>
              <th>Bill Value</th>
            </tr>
          </thead>

          <tbody>
            {data.map((party, i) => (
              <React.Fragment key={i}>
                {party.bills.map((bill, index) => (
                  <tr key={index}>
                    {index === 0 && (
                      <td rowSpan={party.bills.length + 1}>
                        {party.party}
                        <br />
                        {party.city}
                      </td>
                    )}

                    {index === 0 && (
                      <td rowSpan={party.bills.length + 1}>{party.gst}</td>
                    )}

                    <td>{bill.billNo}</td>
                    <td>{bill.date}</td>

                    <td align="right">{bill.value.toFixed(2)}</td>
                    <td align="right">{bill.gst.toFixed(2)}</td>
                    <td align="right">{bill.bill.toFixed(2)}</td>
                  </tr>
                ))}

                <tr>
                  <td colSpan={2}>
                    <b>Totals :</b>
                  </td>

                  <td align="right">{party.totalValue.toFixed(2)}</td>
                  <td align="right">{party.totalGst.toFixed(2)}</td>
                  <td align="right">{party.totalBill.toFixed(2)}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>

        <Box mt={3} display="flex" gap={2}>
          <Button variant="contained" onClick={() => window.print()}>
            Print
          </Button>

          <Button variant="outlined" onClick={handleClose}>
            Close
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