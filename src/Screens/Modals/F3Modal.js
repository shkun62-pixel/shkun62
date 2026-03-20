import React, { useEffect, useState, useMemo } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField,
  Switch,
} from "@mui/material";
import Table from "react-bootstrap/Table";
import InputMask from "react-input-mask";
import financialYear from "../Shared/financialYear";

const FIELD_STORAGE_KEY = "f3modal_fields";

const defaultFields = {
  date: true,
  billno: true,
  account: true,
  qty: true,
  pkgs: true,
  rate: true,
  desc: true,
  gst: true,
  tariff: true,
};

const F3Modal = ({ show, onClose, tenant, onSelect  }) => {
  const [purchaseData, setPurchaseData] = useState([]);

  const [itemFilter, setItemFilter] = useState("");
  const [accountFilter, setAccountFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateUpto, setDateUpto] = useState("");
  const [activeRow, setActiveRow] = useState(0);
  const tableRef = React.useRef(null);

  const [fieldSelectorOpen, setFieldSelectorOpen] = useState(false);

  const [visibleFields, setVisibleFields] = useState(() => {
    const saved = localStorage.getItem(FIELD_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultFields;
  });

  const handleFieldChange = (field) => {
    const updated = {
      ...visibleFields,
      [field]: !visibleFields[field],
    };
    setVisibleFields(updated);
    localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(updated));
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1,
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  useEffect(() => {
    const fy = financialYear.getFYDates();
    setDateFrom(formatDate(fy.start));
    setDateUpto(formatDate(fy.end));
  }, []);

  useEffect(() => {
    if (show) fetchPurchaseData();
  }, [show]);

  const fetchPurchaseData = async () => {
    try {
      const res = await fetch(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/purchase`,
      );
      const data = await res.json();

      const formatted = data.flatMap((entry) => {
        const supplier = entry.supplierdetails[0] || {};
        return entry.items.map((item) => ({
          date: entry.formData.date,
          billno: entry.formData.vno,
          account: supplier.vacode,
          qty: item.weight || 0,
          pkgs: item.pkgs || 0,
          rate: item.rate || 0,
          desc: item.sdisc || "",
            vcode: item.vcode || 0,
            gst: item.gst || 0,
            tariff: item.tariff || 0,
            Pcodes01: item.Pcodes01 || 0,
            Pcodess: item.Pcodess || 0,
            Scodes01: item.Scodes01 || 0,
            Scodess: item.Scodess || 0,
            RateCal: item.RateCal || 0,
            Qtyperpc: item.Qtyperpc || 0,
            Units: item.Units || "",
        }));
      });

      
      setPurchaseData(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const parseDate = (str) => {
    if (!str) return null;
    const [dd, mm, yyyy] = str.split("-");
    return new Date(`${yyyy}-${mm}-${dd}`);
  };

  const filteredData = useMemo(() => {
    return purchaseData.filter((row) => {
      const itemMatch = row.desc
        ?.toLowerCase()
        .includes(itemFilter.toLowerCase());

      const accountMatch = row.account
        ?.toLowerCase()
        .includes(accountFilter.toLowerCase());

      const rowDate = parseDate(row.date);
      const fromDateObj = parseDate(dateFrom);
      const uptoDateObj = parseDate(dateUpto);

      return (
        itemMatch &&
        accountMatch &&
        (!fromDateObj || rowDate >= fromDateObj) &&
        (!uptoDateObj || rowDate <= uptoDateObj)
      );
    });
  }, [purchaseData, itemFilter, accountFilter, dateFrom, dateUpto]);

    useEffect(() => {
    const handleKeyDown = (e) => {
        if (!show) return;

        if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveRow((prev) =>
            prev < filteredData.length - 1 ? prev + 1 : prev
        );
        }

        if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveRow((prev) => (prev > 0 ? prev - 1 : prev));
        }

        // 🔥 ENTER KEY
        if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredData[activeRow];

        if (selected && onSelect) {
            onSelect(selected); // send data to parent
        }

        onClose(); // close modal
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    }, [filteredData, activeRow, show]);

useEffect(() => {
  const row = document.getElementById(`row-${activeRow}`);
  if (row) {
    row.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}, [activeRow]);

  return (
    <Modal open={show} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(6px)",
          background: "rgba(0,0,0,0.25)",
        }}
      >
        <Box
          sx={{
            width: "92%",
            height: "88vh",
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(16px)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* 🔥 HEADER */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "linear-gradient(90deg, #595CFF, #C6F8FF)",
              color: "#fff",
            }}
          >
            <Typography fontSize={18} fontWeight={600}>
              Purchase Information for Trading Sale
            </Typography>
          </Box>

          {/* 🔥 FILTER SECTION */}
          <Box
            sx={{
              p: 2,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 2,
              borderBottom: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.6)",
            }}
          >
            <TextField
              label="Filter Item"
              size="small"
              value={itemFilter}
              onChange={(e) => setItemFilter(e.target.value)}
            />

            <TextField
              label="Filter A/c"
              size="small"
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
            />

            <InputMask
              mask="99-99-9999"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            >
              {(inputProps) => (
                <TextField {...inputProps} label="Date From" size="small" />
              )}
            </InputMask>

            <InputMask
              mask="99-99-9999"
              value={dateUpto}
              onChange={(e) => setDateUpto(e.target.value)}
            >
              {(inputProps) => (
                <TextField {...inputProps} label="Date Upto" size="small" />
              )}
            </InputMask>
          </Box>

          {/* 🔥 TABLE */}
          <Box
          ref={tableRef}
            sx={{
              flex: 1,
              overflow: "auto",
              p: 2,
            }}
          >
            <Table
            bordered
            hover
            size="sm"
            style={{
                borderCollapse: "separate",
                borderSpacing: 0,
                borderRadius: "12px",
                overflow: "hidden",
                border: "1px solid #e5e7eb",
            }}
            >
            <thead
                style={{
                position: "sticky",
                top: 0,
                background: "#595CFF",
                color: "#fff",
                textAlign: "center",
                }}
            >
                <tr>
                {visibleFields.date && <th style={thStyle}>Date</th>}
                {visibleFields.billno && <th style={thStyle}>Bill No</th>}
                {visibleFields.account && <th style={thStyle}>Account</th>}
                {visibleFields.qty && <th style={thStyle}>Qty</th>}
                {visibleFields.pkgs && <th style={thStyle}>Pkgs</th>}
                {visibleFields.rate && <th style={thStyle}>Rate</th>}
                {visibleFields.desc && <th style={thStyle}>Description</th>}
                {visibleFields.tariff && <th style={thStyle}>Hsn Code</th>}
                {visibleFields.gst && <th style={thStyle}>GST</th>}
                </tr>
            </thead>

            <tbody>
                {filteredData.map((row, i) => (
                <tr
                id={`row-${i}`}
                key={i}
                style={{
                    background:
                    i === activeRow
                        ? "linear-gradient(90deg, #dbeafe, #afd2fd)" // active
                        : i % 2 === 0
                        ? "#fafafa"
                        : "#fff",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                }}
                onClick={() => setActiveRow(i)}
                >
                    {visibleFields.date && <td style={tdStyle}>{row.date}</td>}
                    {visibleFields.billno && <td style={tdStyle}>{row.billno}</td>}
                    {visibleFields.account && <td style={tdStyle}>{row.account}</td>}
                    {visibleFields.qty && (
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                        {Number(row.qty) === 0 ? "" : row.qty}
                    </td>
                    )}
                    {visibleFields.pkgs && (
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                        {Number(row.pkgs) === 0 ? "" : row.pkgs}
                    </td>
                    )}
                    {visibleFields.rate && (
                    <td style={{ ...tdStyle, textAlign: "right" }}>
                        {row.rate}
                    </td>
                    )}
                    {visibleFields.desc && <td style={tdStyle}>{row.desc}</td>}
                    {visibleFields.tariff && <td style={tdStyle}>{row.tariff}</td>}
                    {visibleFields.gst && <td style={{ ...tdStyle, textAlign: "right" }}>{row.gst}</td>}
                </tr>
                ))}
            </tbody>
            </Table>
          </Box>

          {/* 🔥 FOOTER */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              borderTop: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(255,255,255,0.6)",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setFieldSelectorOpen(true)}
            >
              Select Fields
            </Button>

            <Button variant="contained" onClick={onClose}>
              Close
            </Button>
          </Box>

          {/* INNER MODAL (UNCHANGED) */}
        <Modal
          open={fieldSelectorOpen}
          onClose={() => setFieldSelectorOpen(false)}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 340,
              borderRadius: 3,
              overflow: "hidden",
              backdropFilter: "blur(12px)",
              background: "rgba(255,255,255,0.85)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            {/* 🔥 HEADER */}
            <Box
              sx={{
                background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                color: "#fff",
                px: 2,
                py: 1.5,
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: 0.5,
              }}
            >
              🎯 Customize Columns
            </Box>

            {/* 🔥 BODY */}
            <Box
              sx={{
                maxHeight: 400,
                overflowY: "auto",
                p: 2,
              }}
            >
              {Object.keys(defaultFields).map((field) => (
                <Box
                  key={field}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 1.2,
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.7)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 14px rgba(0,0,0,0.12)",
                    },
                  }}
                  onClick={() => handleFieldChange(field)}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#333",
                    }}
                  >
                    {field.toUpperCase()}
                  </Typography>

                  <Switch
                    checked={visibleFields[field]}
                    onChange={() => handleFieldChange(field)}
                    size="small"
                    color="primary"
                  />
                </Box>
              ))}
            </Box>

            {/* 🔥 FOOTER */}
            <Box
              sx={{
                borderTop: "1px solid rgba(0,0,0,0.08)",
                px: 2,
                py: 1.5,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                size="small"
                onClick={() => {
                  setVisibleFields(defaultFields);
                  localStorage.setItem(
                    FIELD_STORAGE_KEY,
                    JSON.stringify(defaultFields),
                  );
                }}
              >
                Reset
              </Button>

              <Button
                variant="contained"
                size="small"
                onClick={() => setFieldSelectorOpen(false)}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  px: 2,
                }}
              >
                Done
              </Button>
            </Box>
          </Box>
        </Modal>
        </Box>
      </Box>
    </Modal>
  );
};

export default F3Modal;

const thStyle = {
  padding: "5px",
  borderBottom: "1px solid rgba(255,255,255,0.2)",
  fontWeight: 600,
};

const tdStyle = {
  padding: "5px",
  borderBottom: "1px solid #e5e7eb",
  borderRight: "1px solid #f1f5f9",
};