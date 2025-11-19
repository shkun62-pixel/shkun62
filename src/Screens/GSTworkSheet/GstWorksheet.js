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

// --------- CONFIG ----------
const SALE_API = "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale";
const PURCHASE_API = "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase";
// Set your company's / tenant's state for within/out check (adjust if needed)
const COMPANY_STATE = "Punjab";
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

function sumSafe(arr, key) {
  return arr.reduce((s, x) => s + (Number(x?.[key] ?? 0) || 0), 0);
}

export default function GstWorksheet() {
  const [fromDate, setFromDate] = useState(() => {
    const now = new Date();
    // default one year back
    const y = new Date(now);
    y.setFullYear(now.getFullYear() - 1);
    return formatDateISO(y);
  });
  const [toDate, setToDate] = useState(() => formatDateISO(new Date()));

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

  // Fetch function called when clicking View
  const handleView = async () => {
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

  // Utility: returns whether a record (sale/purchase) passes filters:
  const recordPassesFilters = (record, isSale = true) => {
    // Date filter
    let rawDate = record?.formData?.date || record?.formData?.duedate;

    let recDate = null;

    // If date contains "/" → DD/MM/YYYY
    if (rawDate && rawDate.includes("/")) {
      recDate = parseDMY(rawDate);
    } else {
      // Normal ISO
      recDate = parseISODate(rawDate);
    }
    const from = parseISODate(fromDate);
    const to = parseISODate(toDate);
    if (!recDate) return false;
    if (from && recDate < from) return false;
    if (to && recDate > new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59)) return false;

    // State filter
    if (stateCondition !== "All") {
      const partyState =
        (isSale
          ? record?.customerDetails?.[0]?.state
          : record?.supplierdetails?.[0]?.state) || "";
      const within = (partyState || "").trim().toLowerCase() === (COMPANY_STATE || "").trim().toLowerCase();
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
          party: partyName,
          item: it,
          ctax,
          stax,
          itax,
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

  // Export CSV of totals (Sale & Purchase rows per GST)
  const handleExport = () => {
    // Build rows by unique GST rates (union)
    const allRates = Array.from(new Set([...saleGrouped.map((g) => g.gst), ...purchaseGrouped.map((g) => g.gst)])).sort((a,b)=>a-b);
    const rows = [];
    rows.push(["GST%", "Sale Value", "Sale C.Tax", "Sale S.Tax", "Sale I.Tax", "Sale Cess", "Purchase Value", "Purchase C.Tax", "Purchase S.Tax", "Purchase I.Tax", "Purchase Cess"]);
    allRates.forEach((r) => {
      const s = saleGrouped.find((g) => g.gst === r) || { value:0, ctax:0, stax:0, itax:0, cess:0 };
      const p = purchaseGrouped.find((g) => g.gst === r) || { value:0, ctax:0, stax:0, itax:0, cess:0 };
      rows.push([
        String(r),
        s.value.toFixed(2),
        s.ctax.toFixed(2),
        s.stax.toFixed(2),
        s.itax.toFixed(2),
        s.cess.toFixed(2),
        p.value.toFixed(2),
        p.ctax.toFixed(2),
        p.stax.toFixed(2),
        p.itax.toFixed(2),
        p.cess.toFixed(2),
      ]);
    });
    // Add totals row
    rows.push([
      "TOTAL",
      totals.sale.value.toFixed(2),
      totals.sale.ctax.toFixed(2),
      totals.sale.stax.toFixed(2),
      totals.sale.itax.toFixed(2),
      totals.sale.cess.toFixed(2),
      totals.purchase.value.toFixed(2),
      totals.purchase.ctax.toFixed(2),
      totals.purchase.stax.toFixed(2),
      totals.purchase.itax.toFixed(2),
      totals.purchase.cess.toFixed(2),
    ]);

    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gst-summary-${formatDateISO(new Date())}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <Box p={2}>
      <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="From"
              type="date"
              fullWidth
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="Upto"
              type="date"
              fullWidth
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl component="fieldset">
              <Typography variant="caption">State Condition</Typography>
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
          </Grid>

          <Grid item xs={12} sm={3}>
            <FormControl component="fieldset">
              <Typography variant="caption">Regd / Unregd</Typography>
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
          </Grid>

          <Grid item xs={12} sm={12} container spacing={1} justifyContent="flex-end">
            <Grid item>
              <Button variant="contained" color="primary" onClick={handleView} disabled={loading}>
                View
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={() => { setSaleData([]); setPurchaseData([]); }}>
                Exit
              </Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={handleExport} disabled={loading || (!saleGrouped.length && !purchaseGrouped.length)}>
                Export
              </Button>
            </Grid>
            <Grid item>
              <Button variant="contained" color="secondary" onClick={() => alert("Detail pressed (you can wire this)")}>
                Detail
              </Button>
            </Grid>
          </Grid>
        </Grid>
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
              <Typography variant="h6" align="center">Sale <span style={{ color: "red", fontSize: 12 }}>DoubleClick Detail</span></Typography>
              <TableContainer sx={{ maxHeight: 420 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Gst %</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell align="right">C.Tax</TableCell>
                      <TableCell align="right">S.Tax</TableCell>
                      <TableCell align="right">I.Tax</TableCell>
                      <TableCell align="right">Cess</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {saleGrouped.map((g) => (
                      <TableRow
                        key={`sale-${g.gst}`}
                        hover
                        onDoubleClick={() => openDetail("sale", g.gst)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{g.gst}%</TableCell>
                        <TableCell align="right">{g.value.toFixed(2)}</TableCell>
                        <TableCell align="right">{g.ctax.toFixed(2)}</TableCell>
                        <TableCell align="right">{g.stax.toFixed(2)}</TableCell>
                        <TableCell align="right">{g.itax.toFixed(2)}</TableCell>
                        <TableCell align="right">{g.cess.toFixed(2)}</TableCell>
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
              <Typography variant="h6" align="center">Purchase <span style={{ color: "red", fontSize: 12 }}>DoubleClick Detail</span></Typography>
              <TableContainer sx={{ maxHeight: 420 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell>Gst %</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell align="right">C.Tax</TableCell>
                      <TableCell align="right">S.Tax</TableCell>
                      <TableCell align="right">I.Tax</TableCell>
                      <TableCell align="right">Cess</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {purchaseGrouped.map((g) => (
                      <TableRow
                        key={`purchase-${g.gst}`}
                        hover
                        onDoubleClick={() => openDetail("purchase", g.gst)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell>{g.gst}%</TableCell>
                        <TableCell align="right">{g.value.toFixed(2)}</TableCell>
                        <TableCell align="right">{g.ctax.toFixed(2)}</TableCell>
                        <TableCell align="right">{g.stax.toFixed(2)}</TableCell>
                        <TableCell align="right">{g.itax.toFixed(2)}</TableCell>
                        <TableCell align="right">{g.cess.toFixed(2)}</TableCell>
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
<Box mt={3}>
  <Paper sx={{ p: 2 }}>
    <Typography variant="h6" align="center" gutterBottom>
      TOTAL SUMMARY
    </Typography>

    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
          <Typography variant="subtitle1"><strong>Sale Totals</strong></Typography>
          <Typography>Total Value: {totals.sale.value.toFixed(2)}</Typography>
          <Typography>CGST: {totals.sale.ctax.toFixed(2)}</Typography>
          <Typography>SGST: {totals.sale.stax.toFixed(2)}</Typography>
          <Typography>IGST: {totals.sale.itax.toFixed(2)}</Typography>
          <Typography>Cess: {totals.sale.cess.toFixed(2)}</Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
          <Typography variant="subtitle1"><strong>Purchase Totals</strong></Typography>
          <Typography>Total Value: {totals.purchase.value.toFixed(2)}</Typography>
          <Typography>CGST: {totals.purchase.ctax.toFixed(2)}</Typography>
          <Typography>SGST: {totals.purchase.stax.toFixed(2)}</Typography>
          <Typography>IGST: {totals.purchase.itax.toFixed(2)}</Typography>
          <Typography>Cess: {totals.purchase.cess.toFixed(2)}</Typography>
        </Paper>
      </Grid>

      {/* DIFFERENCE */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, bgcolor: "#e3f7e3" }}>
          <Typography variant="subtitle1"><strong>DIFFERENCE (Sale – Purchase)</strong></Typography>
          <Typography>
            Value Diff: {(totals.sale.value - totals.purchase.value).toFixed(2)}
          </Typography>
          <Typography>
            CGST Diff: {(totals.sale.ctax - totals.purchase.ctax).toFixed(2)}
          </Typography>
          <Typography>
            SGST Diff: {(totals.sale.stax - totals.purchase.stax).toFixed(2)}
          </Typography>
          <Typography>
            IGST Diff: {(totals.sale.itax - totals.purchase.itax).toFixed(2)}
          </Typography>
          <Typography>
            Cess Diff: {(totals.sale.cess - totals.purchase.cess).toFixed(2)}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  </Paper>
</Box>


      {/* Detail Dialog */}
      <Dialog open={detailDialog.open} maxWidth="md" fullWidth onClose={() => setDetailDialog({ open: false, entries: [] })}>
        <DialogTitle>
          {detailDialog.side === "sale" ? "Sale" : "Purchase"} — GST {detailDialog.gstRate}% Details
        </DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Bill No</TableCell>
                <TableCell>Party</TableCell>
                <TableCell align="right">Taxable Value</TableCell>
                <TableCell align="right">C.Tax</TableCell>
                <TableCell align="right">S.Tax</TableCell>
                <TableCell align="right">I.Tax</TableCell>
                <TableCell align="right">V.Amt</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {detailDialog.entries.map((en, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {en.date?.includes("/") 
                      ? parseDMY(en.date).toLocaleDateString("en-GB") 
                      : formatDateISO(en.date)
                    }
                  </TableCell>
                  <TableCell>{en.vbillno || en.vno}</TableCell>
                  <TableCell>{en.party}</TableCell>
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
          <Button onClick={() => setDetailDialog({ open: false, entries: [] })}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
