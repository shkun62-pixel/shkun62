// GstSummary.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';
import useCompanySetup from "../Shared/useCompanySetup";
import WorksheetPrint from "./WorksheetPrint";
import "react-datepicker/dist/react-datepicker.css";
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";
import financialYear from "../Shared/financialYear";


// --------- CONFIG ----------
const tenant = "03AAYFG4472A1ZG_01042025_31032026";
const SALE_API = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/sale`;
const PURCHASE_API = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/purchase`;
// ---------------------------

function formatDateISO(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt.getTime())) return "";
  // YYYY-MM-DD for input date value match
  return dt.toISOString().slice(0, 10);
}

function parseISODate(dateString) {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  return d;
}

function parseDMY(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  return new Date(`${year}-${month}-${day}`);
}

// Helper function to format date to dd/mm/yyyy
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB"); // 'en-GB' formats to dd/mm/yyyy
};

function sumSafe(arr, key) {
  return arr.reduce((s, x) => s + (Number(x?.[key] ?? 0) || 0), 0);
}

function parseAnyDate(input) {
  if (!input) return null;

  // Already a Date object
  if (input instanceof Date && !isNaN(input)) return input;

  if (typeof input !== "string") return null;

  input = input.trim();

  // ISO formats (2026-01-16 or 2026-01-16T00:00:00.000Z)
  if (/^\d{4}-\d{2}-\d{2}/.test(input)) {
    const d = new Date(input);
    return isNaN(d) ? null : d;
  }

  // DD/MM/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) {
    const [dd, mm, yyyy] = input.split("/");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  // DD-MM-YYYY  ✅ YOUR MISSING CASE
  if (/^\d{2}-\d{2}-\d{4}$/.test(input)) {
    const [dd, mm, yyyy] = input.split("-");
    return new Date(`${yyyy}-${mm}-${dd}`);
  }

  return null;
}
function formatDateDisplay(dateInput) {
  const d = parseAnyDate(dateInput);
  if (!d) return "";
  return d.toLocaleDateString("en-GB"); // dd/mm/yyyy
}

export default function GstWorksheet() {

  const navigate = useNavigate();
  const {dateFrom, companyName,companyAdd, companyCity, CompanyState} = useCompanySetup();
  const [selectedGst, setSelectedGst] = useState(null);
  const [selectedGst2, setSelectedGst2] = useState(null);

  const [printOpen, setPrintOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [rawValue, setRawValue] = useState("");
  const [toDate, setToDate] = useState(() => formatDateISO(new Date()));
  const [toRaw, setToRaw] = useState("");

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(formatDate(fy.start)); // converted
    setToDate(formatDate(fy.end));     // converted
    setRawValue(formatDate(fy.start)); // converted
    setToRaw(formatDate(fy.end));     // converted
  }, []);

  const [stateCondition, setStateCondition] = useState("All"); // All | Within | Out
  const [regdFilter, setRegdFilter] = useState("All"); // All | Registered | Un-Registered

  const [saleData, setSaleData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [detailDialog, setDetailDialog] = useState({
    open: false,
    side: "sale",
    gstRate: null,
    entries: [],
  });

   useEffect(() => {
    const fetchEntries = async () => {
      setError("");
      setLoading(true);
      try {
        const [saleRes, purchaseRes] = await Promise.all([
          fetch(SALE_API),
          fetch(PURCHASE_API),
        ]);

        if (!saleRes.ok) throw new Error("Sale API fetch failed");
        if (!purchaseRes.ok) throw new Error("Purchase API fetch failed");

        const saleJson = await saleRes.json();
        const purchaseJson = await purchaseRes.json();

        setSaleData(saleJson || []);
        setPurchaseData(purchaseJson || []);
      } catch (e) {
        console.error(e);
        setError(e.message || "Failed to fetch APIs");
      } finally {
        setLoading(false);
      }
    };

    // Call it immediately when component mounts
    fetchEntries();
  }, []); // Empty dependency array => runs once on mount


  // Utility: returns whether a record (sale/purchase) passes filters:
  const recordPassesFilters = (record, isSale = true) => {
    // Date filter
    const rawDate = record?.formData?.date || record?.formData?.duedate;
    const recDate = parseAnyDate(rawDate);

    const from = parseAnyDate(fromDate);
    const to = parseAnyDate(toDate);

    if (!recDate) return false;
    if (from && recDate < from) return false;
    if (to && recDate > new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59)) return false;

    // State filter
    if (stateCondition !== "All") {
      const partyState =
        (isSale
          ? record?.customerDetails?.[0]?.state
          : record?.supplierdetails?.[0]?.state) || "";
      const within = (partyState || "").trim().toLowerCase() === (CompanyState || "").trim().toLowerCase();
      if (stateCondition === "Within" && !within) return false;
      if (stateCondition === "Out" && within) return false;
    }

    // Regd / Un-Registered
    if (regdFilter !== "All") {
      const gstno =
        (isSale
          ? record?.customerDetails?.[0]?.gstno
          : record?.supplierdetails?.[0]?.gstno) || "";
      const isRegd = String(gstno || "").trim() !== "";
      if (regdFilter === "Registered" && !isRegd) return false;
      if (regdFilter === "Un-Registered" && isRegd) return false;
    }

    return true;
  };

  // Group and compute totals for a dataset (sale or purchase)
  const computeGrouped = (dataset, isSale = true) => {
    const groups = {}; // gstRate -> { value, ctax, stax, itax, cess, entries: [] }

    dataset.forEach((rec) => {
      if (!recordPassesFilters(rec, isSale)) return;

      const date = rec?.formData?.date;
      const partyName = isSale ? rec?.customerDetails?.[0]?.vacode : rec?.supplierdetails?.[0]?.vacode;
      const gstFromForm = rec?.formData?.cgst ? null : null; // not used; we use items[].gst
      const pcess = Number(rec?.formData?.pcess ?? 0) || 0;

      // each rec may contain multiple items; aggregate each item's values under its gst rate
      (rec.items || []).forEach((it) => {
        const gst = it?.gst ?? 0;
        const rateKey = String(gst);
        const qty = Number(it?.weight ?? 0) || 0;
        const value = Number(it?.amount ?? 0) || 0; // amount is the taxable value in samples
        const ctax = Number(it?.ctax ?? 0) || 0;
        const stax = Number(it?.stax ?? 0) || 0;
        const itax = Number(it?.itax ?? 0) || 0;
        const cess = 0; // sample data has no per-item cess; you can change to use rec.formData.pcess if needed
        const vamt = Number(it?.vamt ?? 0) || 0; // value + taxes, not used in grouping columns but may be useful

        if (!groups[rateKey]) {
          groups[rateKey] = {
            gst: gst,
            value: 0,
            ctax: 0,
            stax: 0,
            itax: 0,
            cess: 0,
            entries: [],
          };
        }
        groups[rateKey].value += value;
        groups[rateKey].ctax += ctax;
        groups[rateKey].stax += stax;
        groups[rateKey].itax += itax;
        groups[rateKey].cess += cess;

        groups[rateKey].entries.push({
          id: rec._id,
          date,
          vbillno: rec?.formData?.vbillno || "",
          vno: rec?.formData?.vno || "",
          qty: qty,
          party: partyName,
          item: it,
          ctax,
          stax,
          itax,
          cess: pcess,
          value,
          vamt,
        });
      });
    });

    // produce sorted array by gst ascending
    const arr = Object.values(groups).sort((a, b) => a.gst - b.gst);
    return arr;
  };

  const saleGrouped = useMemo(() => computeGrouped(saleData, true), [saleData, fromDate, toDate, stateCondition, regdFilter]);
  const purchaseGrouped = useMemo(() => computeGrouped(purchaseData, false), [purchaseData, fromDate, toDate, stateCondition, regdFilter]);

  const totals = useMemo(() => {
    const s = {
      sale: { value: 0, ctax: 0, stax: 0, itax: 0, cess: 0 },
      purchase: { value: 0, ctax: 0, stax: 0, itax: 0, cess: 0 },
    };
    saleGrouped.forEach((g) => {
      s.sale.value += g.value;
      s.sale.ctax += g.ctax;
      s.sale.stax += g.stax;
      s.sale.itax += g.itax;
      s.sale.cess += g.cess;
    });
    purchaseGrouped.forEach((g) => {
      s.purchase.value += g.value;
      s.purchase.ctax += g.ctax;
      s.purchase.stax += g.stax;
      s.purchase.itax += g.itax;
      s.purchase.cess += g.cess;
    });
    return s;
  }, [saleGrouped, purchaseGrouped]);

  const openDetail = (side, gstRate) => {
    const groups = side === "sale" ? saleGrouped : purchaseGrouped;
    const group = groups.find((g) => Number(g.gst) === Number(gstRate));
    setDetailDialog({
      open: true,
      side,
      gstRate,
      entries: group?.entries ?? [],
    });
  };

  const handleExport = () => {
    // ---------- BUILD allRates ----------
    const allRates = Array.from(
      new Set([
        ...saleGrouped.map(g => g.gst),
        ...purchaseGrouped.map(g => g.gst)
      ])
    ).sort((a, b) => a - b);

    // ---------- TABLE HEADER ----------
    const header = [
      "Sale Value", "Gst @", "C.Tax", "S.Tax", "I.Tax", "Cess",
      "Pur. Value", "Gst @", "C.Tax", "S.Tax", "I.Tax", "Cess"
    ];

    // ---------- BUILD SHEET DATA ----------
    const sheetData = [
      [companyName || "COMPANY NAME"],
      [companyAdd || ""],
      [companyCity || ""],
      [],
      [`PERIOD FROM ${formatDate(fromDate)} To ${formatDate(toDate)}`],
      [],
      header,

      ...allRates.map(r => {
        const s = saleGrouped.find(g => g.gst === r) || { value: 0, ctax: 0, stax: 0, itax: 0, cess: 0 };
        const p = purchaseGrouped.find(g => g.gst === r) || { value: 0, ctax: 0, stax: 0, itax: 0, cess: 0 };

        return [
          s.value, r, s.ctax, s.stax, s.itax, s.cess,
          p.value, r, p.ctax, p.stax, p.itax, p.cess
        ];
      })
    ];

    // ---------- TOTAL ROW ----------
    const totalStart = 7; 
    const totalEnd = totalStart + allRates.length - 1;

    const totalsRow = header.map((col, colIndex) => {
      // GST @ columns (1 & 7) should stay blank
      if (colIndex === 1 || colIndex === 7) return "";

      // First column label
      // if (colIndex === 0) return "";

      // Add SUBTOTAL formula
      const colLetter = XLSX.utils.encode_col(colIndex);
      return {
        f: `SUBTOTAL(9,${colLetter}${totalStart + 1}:${colLetter}${totalEnd + 1})`
      };
    });

    sheetData.push(totalsRow);

    // ---------- WORKSHEET ----------
    const ws = XLSX.utils.aoa_to_sheet(sheetData);

    // ---------- COLUMN WIDTHS ----------
    ws['!cols'] = [
      { wch: 15 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
      { wch: 15 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 10 }
    ];

    // ---------- MERGE CELLS ----------
    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: header.length - 1 } }
    ];

    // ---------- STYLING ----------
    ["A1", "A2", "A3"].forEach((addr, i) => {
      if (ws[addr]) {
        ws[addr].s = {
          font: { bold: true, sz: i === 0 ? 16 : 12 },
          alignment: { horizontal: "center" }
        };
      }
    });

    if (ws["A5"]) {
      ws["A5"].s = {
        font: { bold: true, sz: 12 },
        alignment: { horizontal: "center" }
      };
    }

    // Header row styling
    header.forEach((_, colIndex) => {
      const cell = XLSX.utils.encode_cell({ r: 6, c: colIndex });
      if (ws[cell]) {
        ws[cell].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center" }
        };
      }
    });

    // Data rows right-align & force 2 decimals
    allRates.forEach((_, rowIndex) => {
      for (let c = 0; c < header.length; c++) {
        const addr = XLSX.utils.encode_cell({ r: 7 + rowIndex, c });
        if (ws[addr]) {
          ws[addr].s = {
            alignment: { horizontal: "right" },
            numFmt: "0.00"
          };
        }
      }
    });

    // Totals row styling
    const totalRowIdx = 7 + allRates.length;
    header.forEach((_, c) => {
      const addr = XLSX.utils.encode_cell({ r: totalRowIdx, c });
      if (ws[addr]) {
        ws[addr].s = {
          font: { bold: true },
          fill: { patternType: "solid", fgColor: { rgb: "D9D9D9" } },
          alignment: { horizontal: "right" },
          // alignment: { horizontal: c === 0 ? "left" : "right" },
          numFmt: "0.00"
        };
      }
    });

    // ---------- DARK VERTICAL LINE AFTER SALE CESS ----------
    const splitCol = 5;
    const startRow = 6;
    const endRow = totalRowIdx;

    for (let r = startRow; r <= endRow; r++) {
      const addr = XLSX.utils.encode_cell({ r, c: splitCol });

      if (!ws[addr]) ws[addr] = { t: "s", v: "" };

      const oldStyle = ws[addr].s || {};

      ws[addr].s = {
        ...oldStyle,
        border: {
          ...oldStyle.border,
          right: { style: "medium", color: { rgb: "000000" } }
        }
      };
    }

    // ---------- EXPORT ----------
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "GST Summary");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true
    });

    saveAs(
      new Blob([buffer], { type: "application/octet-stream" }),
      `GST-Summary-${formatDateISO(new Date())}.xlsx`
    );
  };

  const handleExportDetailed = () => {
    // CATEGORY LABELS ALWAYS (Option A)
    const categories = [
      { key: "reg_within", label: "Registered Within State" },
      { key: "unreg_within", label: "Un-Registered Within State" },
      { key: "reg_outside", label: "Registered Outside State" },
      { key: "unreg_outside", label: "Un-Registered Outside State" },
      { key: "outside_india", label: "Outside India" },
    ];

    // ---------- CLASSIFY RECORD ----------
    // Uses your confirmed rules:
    // - partyState === CompanyState => Within State
    // - partyState !== CompanyState && partyState not empty => Outside State
    // - empty/blank partyState => Outside India
    const classifyRecord = (rec, isSale = true) => {
      const gstno = isSale
        ? rec?.customerDetails?.[0]?.gstno
        : rec?.supplierdetails?.[0]?.gstno;

      const partyStateRaw = isSale
        ? rec?.customerDetails?.[0]?.state
        : rec?.supplierdetails?.[0]?.state;

      const partyState = (partyStateRaw || "").toString().trim();

      // if no state -> treat as Outside India
      if (!partyState) return "outside_india";

      // compare normalized
      const normalizedParty = partyState.toLowerCase();
      const normalizedCompany = (CompanyState || "").toString().toLowerCase();

      const isWithin = normalizedParty === normalizedCompany;
      const isRegistered = String(gstno || "").trim() !== "";

      if (isWithin && isRegistered) return "reg_within";
      if (isWithin && !isRegistered) return "unreg_within";
      if (!isWithin && isRegistered) return "reg_outside";
      if (!isWithin && !isRegistered) return "unreg_outside";

      // fallback
      return "outside_india";
    };

    // ---------- AGGREGATE helper ----------
    // Build map: map[categoryKey][gstRate] = { gst, value, ctax, stax, itax, cess }
    const aggregateByCategory = (records, isSale = true) => {
      const map = {};

      (records || []).forEach((rec) => {
        // each record may have multiple items; we classify by record party (customer/supplier)
        const cat = classifyRecord(rec, isSale);

        // ensure category exists
        if (!map[cat]) map[cat] = {};

        // pick cess from record-level if present (pcess), otherwise per-item cess if provided
        const recCess = Number(rec?.formData?.pcess ?? 0) || 0;

        (rec.items || []).forEach((it) => {
          const gstKey = String(it?.gst ?? 0);
          if (!map[cat][gstKey]) {
            map[cat][gstKey] = {
              gst: gstKey,
              value: 0,
              ctax: 0,
              stax: 0,
              itax: 0,
              cess: 0,
            };
          }

          const bucket = map[cat][gstKey];

          // numeric safe conversions
          const val = Number(it?.amount ?? it?.value ?? 0) || 0;
          const ctax = Number(it?.ctax ?? 0) || 0;
          const stax = Number(it?.stax ?? 0) || 0;
          const itax = Number(it?.itax ?? 0) || 0;
          // prefer per-item cess if provided, else record pcess
          const cess = Number(it?.cess ?? it?.pcess ?? recCess ?? 0) || 0;

          bucket.value += val;
          bucket.ctax += ctax;
          bucket.stax += stax;
          bucket.itax += itax;
          bucket.cess += cess;
        });
      });

      return map;
    };

    // ---------- BUILD AOA (array of arrays) for a given grouped map ----------
    const buildSheetRows = (groupedMap, isSale = true) => {
      const rows = [];

      // title row
      rows.push([
        isSale
          ? `PERIOD FROM ${rawValue || ""} TO ${toRaw || ""}`
          : `BREAK-UP OF PURCHASE SUMMARY`,
      ]);
      rows.push([]); // blank row for spacing

      // header row
      rows.push([
        isSale ? "Sale Type" : "Purchase Type",
        isSale ? "Sale Value" : "Pur. Value",
        "Gst @",
        "C.Tax",
        "S.Tax",
        "I.Tax",
        "Cess",
      ]);

      // For each category (in the fixed order), output GST rows present for that category.
      categories.forEach((cat) => {
        const catData = groupedMap[cat.key];

        // If category exists and has GST entries
        if (catData && Object.keys(catData).length) {
          // iterate GST groups sorted numerically ascending
          Object.values(catData)
            .sort((a, b) => Number(a.gst) - Number(b.gst))
            .forEach((g) => {
              rows.push([
                cat.label,
                Number(g.value || 0).toFixed(2),
                g.gst,
                Number(g.ctax || 0).toFixed(2),
                Number(g.stax || 0).toFixed(2),
                Number(g.itax || 0).toFixed(2),
                Number(g.cess || 0).toFixed(2),
              ]);
            });
        } else {
          // If you prefer to still show the category with zero row, uncomment below:
          // rows.push([cat.label, "0.00", "", "0.00", "0.00", "0.00", "0.00"]);
        }
      });

      return rows;
    };

    // ---------- AGGREGATE data using saleData/purchaseData (your existing arrays) ----------
    const saleGroupedByCat = aggregateByCategory(saleData || [], true);
    const purchaseGroupedByCat = aggregateByCategory(purchaseData || [], false);

    // ---------- BUILD SHEET ROWS ----------
    const saleAoA = buildSheetRows(saleGroupedByCat, true);
    const purchaseAoA = buildSheetRows(purchaseGroupedByCat, false);

    // ---------- CREATE WORKBOOK & SHEETS ----------
    const wb = XLSX.utils.book_new();
    const saleSheet = XLSX.utils.aoa_to_sheet(saleAoA);
    const purchaseSheet = XLSX.utils.aoa_to_sheet(purchaseAoA);

    XLSX.utils.book_append_sheet(wb, saleSheet, "Sale Summary");
    XLSX.utils.book_append_sheet(wb, purchaseSheet, "Purchase Summary");

    // ---------- WRITE FILE ----------
    XLSX.writeFile(wb, "GST_Detailed_Summary.xlsx");
  };


  const handleChange = (e) => {
    setRawValue(e.target.value);

    const [d, m, y] = e.target.value.split("/");
    if (d.length === 2 && m.length === 2 && y.length === 4) {
      const dateObj = new Date(`${y}-${m}-${d}`);
      if (!isNaN(dateObj.getTime())) setFromDate(dateObj);
    }
  };

  const handleToChange = (e) => {
    const val = e.target.value;
    setToRaw(val);

    const [d, m, y] = val.split("/");
    if (d.length === 2 && m.length === 2 && y.length === 4) {
      const dateObj = new Date(`${y}-${m}-${d}`);
      if (!isNaN(dateObj.getTime())) setToDate(dateObj);
    }
  };

  // Define your navigation function
  const handleRowDoubleClick = (entryId) => {

    if (detailDialog.side === "sale") {
      // Navigate to Sale entry
      navigate("/Sale", {
        state: {
          saleId: entryId
        },
      });
    } else if (detailDialog.side === "purchase") {
      // Navigate to Purchase entry
      navigate("/Purchase", {
        state: {
          purId: entryId
        },
      });
    }
  };

  return (
    <Box p={2}>
      <Paper style={{marginTop:-20}} elevation={2} sx={{ p: 1, mb: 1,}}>
        <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
          <div style={{display:'flex',flexDirection:"column"}}> 
            <div style={{ marginLeft: "10px", marginTop: "10px",display:'flex',flexDirection:'row',alignItems:'center' }}>
              <label style={{ fontSize: "16px", color: "#555", marginRight:"10px" }}>From</label>
              <InputMask
                mask="99/99/9999"
                placeholder="dd/mm/yyyy"
                value={rawValue}
                onChange={handleChange}
              >
                {(inputProps) => (
                  <input {...inputProps} className="form-control" />
                )}
              </InputMask>
            </div>

            <div style={{ marginLeft: "10px", marginTop: "10px",display:'flex',flexDirection:'row',alignItems:'center' }}>
              <label style={{ fontSize: "16px", color: "#555", marginRight:"12px" }}>Upto</label>
              <InputMask
                mask="99/99/9999"
                placeholder="dd/mm/yyyy"
                value={toRaw}
                onChange={handleToChange}
              >
                {(inputProps) => <input {...inputProps} className="form-control" />}
              </InputMask>
            </div>

          {/* <div style={{marginLeft:"10px",marginTop:"10px"}}>
            <TextField
              label="From"
              type="date"
              fullWidth
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div style={{marginLeft:"10px",marginTop:"10px"}}>
            <TextField
              label="Upto"
              type="date"
              fullWidth
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </div> */}
          </div>
          <div style={{display:'flex',flexDirection:"column",marginLeft:"30px"}}>
          {/* state condition */}
          <div >
            <FormControl component="fieldset">
              <Typography style={{fontWeight:'bold',fontSize:16}} variant="caption">State Condition</Typography>
              <RadioGroup
                row
                value={stateCondition}
                onChange={(e) => setStateCondition(e.target.value)}
                aria-label="stateCondition"
                name="stateCondition"
              >
                <FormControlLabel value="All" control={<Radio />} label="All" />
                <FormControlLabel value="Within" control={<Radio />} label="Within State" />
                <FormControlLabel value="Out" control={<Radio />} label="Out of State" />
              </RadioGroup>
            </FormControl>
          </div>
          {/* Regd / unredg */}
          <div >
            <FormControl component="fieldset">
              <Typography style={{fontWeight:'bold',fontSize:16}} variant="caption">Regd / Unregd</Typography>
              <RadioGroup
                row
                value={regdFilter}
                onChange={(e) => setRegdFilter(e.target.value)}
                aria-label="regdFilter"
                name="regdFilter"
              >
                <FormControlLabel value="All" control={<Radio />} label="All" />
                <FormControlLabel value="Registered" control={<Radio />} label="Registered" />
                <FormControlLabel value="Un-Registered" control={<Radio />} label="Un-Registered" />
              </RadioGroup>
            </FormControl>
          </div>
          </div>
          <div style={{display:'flex',flexDirection:"column"}}>
                {/* <Button className="Buttonz" variant="contained" color="primary" onClick={handleView} disabled={loading}>
                  View
                </Button> */}
              <Button className="Buttonz" variant="outlined" onClick={handleExport} disabled={loading || (!saleGrouped.length && !purchaseGrouped.length)}>
                Export
              </Button>
               {/* <Button style={{marginTop:"5px",backgroundColor:"grey"}} className="Buttonz" variant="contained" onClick={() => { setSaleData([]); setPurchaseData([]); }}>
                Exit
              </Button> */}
          </div>

        
        </div>
      </Paper>

      {error && (
        <Box mb={2}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 1 }}>
              <Typography variant="h6" align="center">SALE <span style={{ color: "red", fontSize: 12 }}>DoubleClick Detail</span></Typography>
              <TableContainer sx={{ maxHeight: 420 }}>
                <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        backgroundColor: "#4F81BD !important",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Gst %
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#4F81BD !important",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Value
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#4F81BD !important",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      C.Tax
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#4F81BD !important",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      S.Tax
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold" }}
                    >
                      I.Tax
                    </TableCell>

                    <TableCell
                      align="right"
                      sx={{
                        backgroundColor: "#4F81BD !important",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      Cess
                    </TableCell>
                  </TableRow>
                </TableHead>

                  <TableBody>
                    {saleGrouped.map((g) => (
                      <TableRow
                        key={`sale-${g.gst}`}
                        onDoubleClick={() => {
                          openDetail("sale", g.gst);
                          setSelectedGst(g.gst);
                        }}
                        // onDoubleClick={() => openDetail("sale", g.gst)}
                        sx={{
                          cursor: "pointer",
                          userSelect: "none", 
                          backgroundColor: selectedGst === g.gst ? "#b6b9bdff" : "transparent",
                          fontWeight:"bold",
                          transition: "0.2s",
                        }}
                      >
                        <TableCell sx={{fontWeight: selectedGst === g.gst ? "bold" : "normal"}}>{g.gst}%</TableCell>
                        <TableCell align="right" sx={{fontWeight: selectedGst === g.gst ? "bold" : "normal"}}>{g.value.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{fontWeight: selectedGst === g.gst ? "bold" : "normal"}}>{g.ctax.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{fontWeight: selectedGst === g.gst ? "bold" : "normal"}}>{g.stax.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{fontWeight: selectedGst === g.gst ? "bold" : "normal"}}>{g.itax.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{fontWeight: selectedGst === g.gst ? "bold" : "normal"}}>{g.cess.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    {/* totals */}
                    <TableRow>
                      <TableCell><strong>TOTAL</strong></TableCell>
                      <TableCell align="right"><strong>{totals.sale.value.toFixed(2)}</strong></TableCell>
                      <TableCell align="right"><strong>{totals.sale.ctax.toFixed(2)}</strong></TableCell>
                      <TableCell align="right"><strong>{totals.sale.stax.toFixed(2)}</strong></TableCell>
                      <TableCell align="right"><strong>{totals.sale.itax.toFixed(2)}</strong></TableCell>
                      <TableCell align="right"><strong>{totals.sale.cess.toFixed(2)}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 1 }}>
              <Typography variant="h6" align="center">PURCHASE <span style={{ color: "red", fontSize: 12 }}>DoubleClick Detail</span></Typography>
              <TableContainer sx={{ maxHeight: 420 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          backgroundColor: "#4F81BD !important",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Gst %
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          backgroundColor: "#4F81BD !important",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Value
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          backgroundColor: "#4F81BD !important",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        C.Tax
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          backgroundColor: "#4F81BD !important",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        S.Tax
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          backgroundColor: "#4F81BD !important",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        I.Tax
                      </TableCell>

                      <TableCell
                        align="right"
                        sx={{
                          backgroundColor: "#4F81BD !important",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        Cess
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseGrouped.map((g) => (
                      <TableRow
                        key={`purchase-${g.gst}`}
                         onDoubleClick={() => {
                          openDetail("purchase", g.gst);
                          setSelectedGst2(g.gst);
                        }}
                        // onDoubleClick={() => openDetail("purchase", g.gst)}
                        sx={{
                          cursor: "pointer",
                          userSelect: "none", 
                          backgroundColor: selectedGst2 === g.gst ? "#b6b9bdff" : "transparent",
                          transition: "0.2s",
                        }}
                      >
                        <TableCell sx={{fontWeight: selectedGst2 === g.gst ? "bold" : "normal"}}>{g.gst}%</TableCell>
                        <TableCell align="right" sx={{fontWeight: selectedGst2 === g.gst ? "bold" : "normal"}}>{g.value.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{fontWeight: selectedGst2 === g.gst ? "bold" : "normal"}}>{g.ctax.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{fontWeight: selectedGst2 === g.gst ? "bold" : "normal"}}>{g.stax.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{fontWeight: selectedGst2 === g.gst ? "bold" : "normal"}}>{g.itax.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{fontWeight: selectedGst2 === g.gst ? "bold" : "normal"}}>{g.cess.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell><strong>TOTAL</strong></TableCell>
                      <TableCell align="right"><strong>{totals.purchase.value.toFixed(2)}</strong></TableCell>
                      <TableCell align="right"><strong>{totals.purchase.ctax.toFixed(2)}</strong></TableCell>
                      <TableCell align="right"><strong>{totals.purchase.stax.toFixed(2)}</strong></TableCell>
                      <TableCell align="right"><strong>{totals.purchase.itax.toFixed(2)}</strong></TableCell>
                      <TableCell align="right"><strong>{totals.purchase.cess.toFixed(2)}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* GRAND TOTAL SUMMARY */}
      <Box mt={1}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" align="center" gutterBottom>
            TOTAL SUMMARY
          </Typography>

          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold" }}><strong>Type</strong></TableCell>
                <TableCell align="right" sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold" }}><strong>Total Value</strong></TableCell>
                <TableCell align="right" sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold" }}><strong>CGST</strong></TableCell>
                <TableCell align="right" sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold" }}><strong>SGST</strong></TableCell>
                <TableCell align="right" sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold" }}><strong>IGST</strong></TableCell>
                <TableCell align="right" sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold" }}><strong>Cess</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {/* SALE ROW */}
              <TableRow>
                <TableCell><strong>Sale</strong></TableCell>
                <TableCell align="right">{totals.sale.value.toFixed(2)}</TableCell>
                <TableCell align="right">{totals.sale.ctax.toFixed(2)}</TableCell>
                <TableCell align="right">{totals.sale.stax.toFixed(2)}</TableCell>
                <TableCell align="right">{totals.sale.itax.toFixed(2)}</TableCell>
                <TableCell align="right">{totals.sale.cess.toFixed(2)}</TableCell>
              </TableRow>

              {/* PURCHASE ROW */}
              <TableRow>
                <TableCell><strong>Purchase</strong></TableCell>
                <TableCell align="right">{totals.purchase.value.toFixed(2)}</TableCell>
                <TableCell align="right">{totals.purchase.ctax.toFixed(2)}</TableCell>
                <TableCell align="right">{totals.purchase.stax.toFixed(2)}</TableCell>
                <TableCell align="right">{totals.purchase.itax.toFixed(2)}</TableCell>
                <TableCell align="right">{totals.purchase.cess.toFixed(2)}</TableCell>
              </TableRow>

              {/* DIFFERENCE ROW */}
              <TableRow sx={{ bgcolor: "#e8fbe8" }}>
                <TableCell><strong>Difference</strong></TableCell>
                <TableCell align="right">
                  {(totals.sale.value - totals.purchase.value).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {(totals.sale.ctax - totals.purchase.ctax).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {(totals.sale.stax - totals.purchase.stax).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {(totals.sale.itax - totals.purchase.itax).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  {(totals.sale.cess - totals.purchase.cess).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </Box>

      {/* Detail Dialog */}
      <Dialog open={detailDialog.open} maxWidth={false}  fullWidth onClose={() => setDetailDialog({ open: false, entries: [] })}
          PaperProps={{
            sx: { width: "90vw", maxWidth: "90vw" }   // custom width
          }}
        >
        <DialogTitle>
          {detailDialog.side === "sale" ? "Sale" : "Purchase"} — GST {detailDialog.gstRate}% Details
        </DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold"}}>
                  Date
                </TableCell>
                <TableCell sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold"}}>
                  Bill No
                </TableCell>
                <TableCell sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold"}} >
                  A/c Name
                </TableCell>
                <TableCell sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold"}}>
                  Gst
                </TableCell>
                <TableCell sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold"}} align="right">
                  Qty
                </TableCell>
                <TableCell align="right" sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold"}}>
                  Taxable Value
                </TableCell>
                <TableCell align="right" sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold"}}>
                  C.Tax
                </TableCell>
                <TableCell align="right" sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold"}}>
                  S.Tax
                </TableCell>
                <TableCell align="right" sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold"}}>
                  I.Tax
                </TableCell>
                <TableCell align="right" sx={{backgroundColor: "#4F81BD !important", color: "white", fontWeight: "bold"}}>
                V.Amt
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detailDialog.entries.map((en, idx) => (
                <TableRow key={idx} onDoubleClick={() => handleRowDoubleClick(en.id)}
                 >
                  <TableCell>
                    {formatDateDisplay(en.date)}
                  </TableCell>
                  <TableCell>{en.vbillno || en.vno}</TableCell>
                  <TableCell>{en.item?.sdisc}</TableCell>
                  <TableCell>{en.item?.gst}%</TableCell>
                  <TableCell align="right">{en.qty}</TableCell>
                  <TableCell align="right">{Number(en.value).toFixed(2)}</TableCell>
                  <TableCell align="right">{Number(en.ctax).toFixed(2)}</TableCell>
                  <TableCell align="right">{Number(en.stax).toFixed(2)}</TableCell>
                  <TableCell align="right">{Number(en.itax).toFixed(2)}</TableCell>
                  <TableCell align="right">{Number(en.vamt).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button className="Buttonz" variant="contained" onClick={() => { setPrintOpen(true) }} >Print</Button>
          <Button style={{backgroundColor:'grey'}} className="Buttonz" variant="contained" onClick={() => setDetailDialog({ open: false, entries: [] })}>Close</Button>
          <WorksheetPrint
            isOpen={printOpen}
            handleClose={() => setPrintOpen(false)}
            entries={detailDialog.entries}
            fromDate={fromDate}
            uptoDate={toDate}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
}
