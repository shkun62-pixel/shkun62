// // GstSummary.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import {Box,Button,CircularProgress,FormControl,FormControlLabel,Grid,Paper,Radio,RadioGroup,Table,TableBody,TableCell,TableContainer,TableHead,TableRow, Typography} from "@mui/material";
// import useCompanySetup from "./Shared/useCompanySetup";
// import "react-datepicker/dist/react-datepicker.css";
// import InputMask from "react-input-mask";
// import * as XLSX from "xlsx";

// // --------- CONFIG ----------
// const SALE_API = "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale";
// const PURCHASE_API = "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase";
// // ---------------------------

// function formatDateISO(d) {
//   if (!d) return "";
//   const dt = new Date(d);
//   if (isNaN(dt.getTime())) return "";
//   // YYYY-MM-DD for input date value match
//   return dt.toISOString().slice(0, 10);
// }

// function parseISODate(dateString) {
//   if (!dateString) return null;
//   const d = new Date(dateString);
//   if (isNaN(d.getTime())) return null;
//   return d;
// }

// function parseDMY(dateStr) {
//   if (!dateStr) return null;
//   const parts = dateStr.split("/");
//   if (parts.length !== 3) return null;
//   const [day, month, year] = parts;
//   return new Date(`${year}-${month}-${day}`);
// }

// export default function Example() {

//   const {dateFrom, companyName,companyAdd, companyCity, CompanyState} = useCompanySetup();
//   const [fromDate, setFromDate] = useState("");
//   useEffect(() => {
//     if (!fromDate && dateFrom) {
//       setFromDate(new Date(dateFrom));
//     }
//   }, [dateFrom, fromDate]);

//   const [rawValue, setRawValue] = useState("");
//   useEffect(() => {
//     if (!rawValue && dateFrom) {
//       const d = new Date(dateFrom);

//       const day = String(d.getDate()).padStart(2, "0");
//       const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
//       const year = d.getFullYear();

//       setRawValue(`${day}/${month}/${year}`);
//       console.log(dateFrom, "dateFrom formatted");
//     }
//   }, [dateFrom, rawValue]);

//   const [toDate, setToDate] = useState(() => formatDateISO(new Date()));
//   const [toRaw, setToRaw] = useState("");

//   // Initialize to today's date
//   useEffect(() => {
//     if (!toRaw) {
//       const today = new Date();
//       const day = String(today.getDate()).padStart(2, "0");
//       const month = String(today.getMonth() + 1).padStart(2, "0"); // Months 0-indexed
//       const year = today.getFullYear();
//       setToRaw(`${day}/${month}/${year}`);
//       setToDate(today);
//     }
//   }, [toRaw]);

//   const [stateCondition, setStateCondition] = useState("All"); // All | Within | Out
//   const [regdFilter, setRegdFilter] = useState("All"); // All | Registered | Un-Registered

//   const [saleData, setSaleData] = useState([]);
//   const [purchaseData, setPurchaseData] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const [detailDialog, setDetailDialog] = useState({
//     open: false,
//     side: "sale",
//     gstRate: null,
//     entries: [],
//   });

//   // Fetch function called when clicking View
//   const handleView = async () => {
//     setError("");
//     setLoading(true);
//     try {
//       const [saleRes, purchaseRes] = await Promise.all([
//         fetch(SALE_API),
//         fetch(PURCHASE_API),
//       ]);

//       if (!saleRes.ok) throw new Error("Sale API fetch failed");
//       if (!purchaseRes.ok) throw new Error("Purchase API fetch failed");

//       const saleJson = await saleRes.json();
//       const purchaseJson = await purchaseRes.json();

//       setSaleData(saleJson || []);
//       setPurchaseData(purchaseJson || []);
//     } catch (e) {
//       console.error(e);
//       setError(e.message || "Failed to fetch APIs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Utility: returns whether a record (sale/purchase) passes filters:
//   const recordPassesFilters = (record, isSale = true) => {
//     // Date filter
//     let rawDate = record?.formData?.date || record?.formData?.duedate;

//     let recDate = null;

//     // If date contains "/" → DD/MM/YYYY
//     if (rawDate && rawDate.includes("/")) {
//       recDate = parseDMY(rawDate);
//     } else {
//       // Normal ISO
//       recDate = parseISODate(rawDate);
//     }
//     const from = parseISODate(fromDate);
//     const to = parseISODate(toDate);
//     if (!recDate) return false;
//     if (from && recDate < from) return false;
//     if (to && recDate > new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59)) return false;

//     // State filter
//     if (stateCondition !== "All") {
//       const partyState =
//         (isSale
//           ? record?.customerDetails?.[0]?.state
//           : record?.supplierdetails?.[0]?.state) || "";
//       const within = (partyState || "").trim().toLowerCase() === (CompanyState || "").trim().toLowerCase();
//       if (stateCondition === "Within" && !within) return false;
//       if (stateCondition === "Out" && within) return false;
//     }

//     // Regd / Un-Registered
//     if (regdFilter !== "All") {
//       const gstno =
//         (isSale
//           ? record?.customerDetails?.[0]?.gstno
//           : record?.supplierdetails?.[0]?.gstno) || "";
//       const isRegd = String(gstno || "").trim() !== "";
//       if (regdFilter === "Registered" && !isRegd) return false;
//       if (regdFilter === "Un-Registered" && isRegd) return false;
//     }

//     return true;
//   };

//   // Group and compute totals for a dataset (sale or purchase)
//   const computeGrouped = (dataset, isSale = true) => {
//     const groups = {}; // gstRate -> { value, ctax, stax, itax, cess, entries: [] }

//     dataset.forEach((rec) => {
//       if (!recordPassesFilters(rec, isSale)) return;

//       const date = rec?.formData?.date;
//       const partyName = isSale ? rec?.customerDetails?.[0]?.vacode : rec?.supplierdetails?.[0]?.vacode;
//       const gstFromForm = rec?.formData?.cgst ? null : null; // not used; we use items[].gst
//       const pcess = Number(rec?.formData?.pcess ?? 0) || 0;

//       // each rec may contain multiple items; aggregate each item's values under its gst rate
//       (rec.items || []).forEach((it) => {
//         const gst = it?.gst ?? 0;
//         const rateKey = String(gst);
//         const qty = Number(it?.weight ?? 0) || 0;
//         const value = Number(it?.amount ?? 0) || 0; // amount is the taxable value in samples
//         const ctax = Number(it?.ctax ?? 0) || 0;
//         const stax = Number(it?.stax ?? 0) || 0;
//         const itax = Number(it?.itax ?? 0) || 0;
//         const cess = 0; // sample data has no per-item cess; you can change to use rec.formData.pcess if needed
//         const vamt = Number(it?.vamt ?? 0) || 0; // value + taxes, not used in grouping columns but may be useful

//         if (!groups[rateKey]) {
//           groups[rateKey] = {
//             gst: gst,
//             value: 0,
//             ctax: 0,
//             stax: 0,
//             itax: 0,
//             cess: 0,
//             entries: [],
//           };
//         }
//         groups[rateKey].value += value;
//         groups[rateKey].ctax += ctax;
//         groups[rateKey].stax += stax;
//         groups[rateKey].itax += itax;
//         groups[rateKey].cess += cess;

//         groups[rateKey].entries.push({
//           id: rec._id,
//           date,
//           vbillno: rec?.formData?.vbillno || "",
//           vno: rec?.formData?.vno || "",
//           qty: qty,
//           party: partyName,
//           item: it,
//           ctax,
//           stax,
//           itax,
//           cess: pcess,
//           value,
//           vamt,
//         });
//       });
//     });

//     // produce sorted array by gst ascending
//     const arr = Object.values(groups).sort((a, b) => a.gst - b.gst);
//     return arr;
//   };

//   const saleGrouped = useMemo(() => computeGrouped(saleData, true), [saleData, fromDate, toDate, stateCondition, regdFilter]);
//   const purchaseGrouped = useMemo(() => computeGrouped(purchaseData, false), [purchaseData, fromDate, toDate, stateCondition, regdFilter]);

//   const totals = useMemo(() => {
//     const s = {
//       sale: { value: 0, ctax: 0, stax: 0, itax: 0, cess: 0 },
//       purchase: { value: 0, ctax: 0, stax: 0, itax: 0, cess: 0 },
//     };
//     saleGrouped.forEach((g) => {
//       s.sale.value += g.value;
//       s.sale.ctax += g.ctax;
//       s.sale.stax += g.stax;
//       s.sale.itax += g.itax;
//       s.sale.cess += g.cess;
//     });
//     purchaseGrouped.forEach((g) => {
//       s.purchase.value += g.value;
//       s.purchase.ctax += g.ctax;
//       s.purchase.stax += g.stax;
//       s.purchase.itax += g.itax;
//       s.purchase.cess += g.cess;
//     });
//     return s;
//   }, [saleGrouped, purchaseGrouped]);

//   const openDetail = (side, gstRate) => {
//     const groups = side === "sale" ? saleGrouped : purchaseGrouped;
//     const group = groups.find((g) => Number(g.gst) === Number(gstRate));
//     setDetailDialog({
//       open: true,
//       side,
//       gstRate,
//       entries: group?.entries ?? [],
//     });
//   };

//   const handleChange = (e) => {
//     setRawValue(e.target.value);

//     const [d, m, y] = e.target.value.split("/");
//     if (d.length === 2 && m.length === 2 && y.length === 4) {
//       const dateObj = new Date(`${y}-${m}-${d}`);
//       if (!isNaN(dateObj.getTime())) setFromDate(dateObj);
//     }
//   };

//   const handleToChange = (e) => {
//     const val = e.target.value;
//     setToRaw(val);

//     const [d, m, y] = val.split("/");
//     if (d.length === 2 && m.length === 2 && y.length === 4) {
//       const dateObj = new Date(`${y}-${m}-${d}`);
//       if (!isNaN(dateObj.getTime())) setToDate(dateObj);
//     }
//   };

//   // const handleExportDetailed = () => {
//   //   // CATEGORY LABELS ALWAYS (Option A)
//   //   const categories = [
//   //     { key: "reg_within", label: "Registered Within State" },
//   //     { key: "unreg_within", label: "Un-Registered Within State" },
//   //     { key: "reg_outside", label: "Registered Outside State" },
//   //     { key: "unreg_outside", label: "Un-Registered Outside State" },
//   //     { key: "outside_india", label: "Outside India" },
//   //   ];

//   //   // helper: classify a record
//   //   const classifyRecord = (rec, isSale = true) => {
//   //     const gstno = isSale
//   //       ? rec?.customerDetails?.[0]?.gstno
//   //       : rec?.supplierdetails?.[0]?.gstno;

//   //     const partyState = isSale
//   //       ? rec?.customerDetails?.[0]?.state?.trim()
//   //       : rec?.supplierdetails?.[0]?.state?.trim();

//   //     const reg = gstno ? "Registered" : "Un-Registered";

//   //     if (!partyState || partyState === "" || partyState.toLowerCase() !== CompanyState.toLowerCase() && partyState.toLowerCase() === "india") {
//   //       return reg === "Registered" ? "reg_outside" : "unreg_outside";
//   //     }

//   //     if (!partyState || partyState.toLowerCase() === "india") {
//   //       return "outside_india";
//   //     }

//   //     const within = partyState.toLowerCase() === CompanyState.toLowerCase();

//   //     if (within && reg === "Registered") return "reg_within";
//   //     if (within && reg === "Un-Registered") return "unreg_within";
//   //     if (!within && reg === "Registered") return "reg_outside";
//   //     if (!within && reg === "Un-Registered") return "unreg_outside";

//   //     return "outside_india";
//   //   };

//   //   // build sheet data
//   //   const buildSheet = (groupedData, isSale = true) => {
//   //     const rows = [];

//   //     rows.push([
//   //       isSale
//   //         ? `PERIOD FROM ${rawValue} TO ${toRaw}`
//   //         : `BREAK-UP OF PURCHASE SUMMARY`,
//   //     ]);
//   //     rows.push([]); // blank row

//   //     rows.push([
//   //       isSale ? "Sale Type" : "Purchase Type",
//   //       isSale ? "Sale Value" : "Pur. Value",
//   //       "Gst @",
//   //       "C.Tax",
//   //       "S.Tax",
//   //       "I.Tax",
//   //       "Cess",
//   //     ]);

//   //     // map category → GST rows
//   //     categories.forEach((cat) => {
//   //       groupedData.forEach((g) => {
//   //         rows.push([
//   //           cat.label,
//   //           g.value.toFixed(2),
//   //           g.gst,
//   //           g.ctax.toFixed(2),
//   //           g.stax.toFixed(2),
//   //           g.itax.toFixed(2),
//   //           g.cess.toFixed(2),
//   //         ]);
//   //       });
//   //     });

//   //     return rows;
//   //   };

//   //   const saleRows = buildSheet(saleGrouped, true);
//   //   const purchaseRows = buildSheet(purchaseGrouped, false);

//   //   const wb = XLSX.utils.book_new();

//   //   const saleSheet = XLSX.utils.aoa_to_sheet(saleRows);
//   //   const purchaseSheet = XLSX.utils.aoa_to_sheet(purchaseRows);

//   //   XLSX.utils.book_append_sheet(wb, saleSheet, "Sale Summary");
//   //   XLSX.utils.book_append_sheet(wb, purchaseSheet, "Purchase Summary");

//   //   XLSX.writeFile(wb, "GST_Detailed_Summary.xlsx");
//   // };

// const handleExportDetailed = () => {
//   // CATEGORY LABELS ALWAYS (Option A)
//   const categories = [
//     { key: "reg_within", label: "Registered Within State" },
//     { key: "unreg_within", label: "Un-Registered Within State" },
//     { key: "reg_outside", label: "Registered Outside State" },
//     { key: "unreg_outside", label: "Un-Registered Outside State" },
//     { key: "outside_india", label: "Outside India" },
//   ];

//   // ---------- CLASSIFY RECORD ----------
//   // Uses your confirmed rules:
//   // - partyState === CompanyState => Within State
//   // - partyState !== CompanyState && partyState not empty => Outside State
//   // - empty/blank partyState => Outside India
//   const classifyRecord = (rec, isSale = true) => {
//     const gstno = isSale
//       ? rec?.customerDetails?.[0]?.gstno
//       : rec?.supplierdetails?.[0]?.gstno;

//     const partyStateRaw = isSale
//       ? rec?.customerDetails?.[0]?.state
//       : rec?.supplierdetails?.[0]?.state;

//     const partyState = (partyStateRaw || "").toString().trim();

//     // if no state -> treat as Outside India
//     if (!partyState) return "outside_india";

//     // compare normalized
//     const normalizedParty = partyState.toLowerCase();
//     const normalizedCompany = (CompanyState || "").toString().toLowerCase();

//     const isWithin = normalizedParty === normalizedCompany;
//     const isRegistered = String(gstno || "").trim() !== "";

//     if (isWithin && isRegistered) return "reg_within";
//     if (isWithin && !isRegistered) return "unreg_within";
//     if (!isWithin && isRegistered) return "reg_outside";
//     if (!isWithin && !isRegistered) return "unreg_outside";

//     // fallback
//     return "outside_india";
//   };

//   // ---------- AGGREGATE helper ----------
//   // Build map: map[categoryKey][gstRate] = { gst, value, ctax, stax, itax, cess }
//   const aggregateByCategory = (records, isSale = true) => {
//     const map = {};

//     (records || []).forEach((rec) => {
//       // each record may have multiple items; we classify by record party (customer/supplier)
//       const cat = classifyRecord(rec, isSale);

//       // ensure category exists
//       if (!map[cat]) map[cat] = {};

//       // pick cess from record-level if present (pcess), otherwise per-item cess if provided
//       const recCess = Number(rec?.formData?.pcess ?? 0) || 0;

//       (rec.items || []).forEach((it) => {
//         const gstKey = String(it?.gst ?? 0);
//         if (!map[cat][gstKey]) {
//           map[cat][gstKey] = {
//             gst: gstKey,
//             value: 0,
//             ctax: 0,
//             stax: 0,
//             itax: 0,
//             cess: 0,
//           };
//         }

//         const bucket = map[cat][gstKey];

//         // numeric safe conversions
//         const val = Number(it?.amount ?? it?.value ?? 0) || 0;
//         const ctax = Number(it?.ctax ?? 0) || 0;
//         const stax = Number(it?.stax ?? 0) || 0;
//         const itax = Number(it?.itax ?? 0) || 0;
//         // prefer per-item cess if provided, else record pcess
//         const cess = Number(it?.cess ?? it?.pcess ?? recCess ?? 0) || 0;

//         bucket.value += val;
//         bucket.ctax += ctax;
//         bucket.stax += stax;
//         bucket.itax += itax;
//         bucket.cess += cess;
//       });
//     });

//     return map;
//   };

//   // ---------- BUILD AOA (array of arrays) for a given grouped map ----------
//   const buildSheetRows = (groupedMap, isSale = true) => {
//     const rows = [];

//     // title row
//     rows.push([
//       isSale
//         ? `PERIOD FROM ${rawValue || ""} TO ${toRaw || ""}`
//         : `BREAK-UP OF PURCHASE SUMMARY`,
//     ]);
//     rows.push([]); // blank row for spacing

//     // header row
//     rows.push([
//       isSale ? "Sale Type" : "Purchase Type",
//       isSale ? "Sale Value" : "Pur. Value",
//       "Gst @",
//       "C.Tax",
//       "S.Tax",
//       "I.Tax",
//       "Cess",
//     ]);

//     // For each category (in the fixed order), output GST rows present for that category.
//     categories.forEach((cat) => {
//       const catData = groupedMap[cat.key];

//       // If category exists and has GST entries
//       if (catData && Object.keys(catData).length) {
//         // iterate GST groups sorted numerically ascending
//         Object.values(catData)
//           .sort((a, b) => Number(a.gst) - Number(b.gst))
//           .forEach((g) => {
//             rows.push([
//               cat.label,
//               Number(g.value || 0).toFixed(2),
//               g.gst,
//               Number(g.ctax || 0).toFixed(2),
//               Number(g.stax || 0).toFixed(2),
//               Number(g.itax || 0).toFixed(2),
//               Number(g.cess || 0).toFixed(2),
//             ]);
//           });
//       } else {
//         // If you prefer to still show the category with zero row, uncomment below:
//         // rows.push([cat.label, "0.00", "", "0.00", "0.00", "0.00", "0.00"]);
//       }
//     });

//     return rows;
//   };

//   // ---------- AGGREGATE data using saleData/purchaseData (your existing arrays) ----------
//   const saleGroupedByCat = aggregateByCategory(saleData || [], true);
//   const purchaseGroupedByCat = aggregateByCategory(purchaseData || [], false);

//   // ---------- BUILD SHEET ROWS ----------
//   const saleAoA = buildSheetRows(saleGroupedByCat, true);
//   const purchaseAoA = buildSheetRows(purchaseGroupedByCat, false);

//   // ---------- CREATE WORKBOOK & SHEETS ----------
//   const wb = XLSX.utils.book_new();
//   const saleSheet = XLSX.utils.aoa_to_sheet(saleAoA);
//   const purchaseSheet = XLSX.utils.aoa_to_sheet(purchaseAoA);

//   XLSX.utils.book_append_sheet(wb, saleSheet, "Sale Summary");
//   XLSX.utils.book_append_sheet(wb, purchaseSheet, "Purchase Summary");

//   // ---------- WRITE FILE ----------
//   XLSX.writeFile(wb, "GST_Detailed_Summary.xlsx");
// };


//   return (
//     <Box p={2}>
//       <Paper style={{marginTop:-20}} elevation={2} sx={{ p: 1, mb: 1,}}>
//         <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
//           <div style={{display:'flex',flexDirection:"column"}}> 
//             <div style={{ marginLeft: "10px", marginTop: "10px",display:'flex',flexDirection:'row',alignItems:'center' }}>
//               <label style={{ fontSize: "16px", color: "#555", marginRight:"10px" }}>From</label>
//               <InputMask
//                 mask="99/99/9999"
//                 placeholder="dd/mm/yyyy"
//                 value={rawValue}
//                 onChange={handleChange}
//               >
//                 {(inputProps) => (
//                   <input {...inputProps} className="form-control" />
//                 )}
//               </InputMask>
//             </div>

//             <div style={{ marginLeft: "10px", marginTop: "10px",display:'flex',flexDirection:'row',alignItems:'center' }}>
//               <label style={{ fontSize: "16px", color: "#555", marginRight:"12px" }}>Upto</label>
//               <InputMask
//                 mask="99/99/9999"
//                 placeholder="dd/mm/yyyy"
//                 value={toRaw}
//                 onChange={handleToChange}
//               >
//                 {(inputProps) => <input {...inputProps} className="form-control" />}
//               </InputMask>
//             </div>
//           </div>
//           <div style={{display:'flex',flexDirection:"column",marginLeft:"30px"}}>
//           {/* state condition */}
//           <div >
//             <FormControl component="fieldset">
//               <Typography style={{fontWeight:'bold',fontSize:16}} variant="caption">State Condition</Typography>
//               <RadioGroup
//                 row
//                 value={stateCondition}
//                 onChange={(e) => setStateCondition(e.target.value)}
//                 aria-label="stateCondition"
//                 name="stateCondition"
//               >
//                 <FormControlLabel value="All" control={<Radio />} label="All" />
//                 <FormControlLabel value="Within" control={<Radio />} label="Within State" />
//                 <FormControlLabel value="Out" control={<Radio />} label="Out of State" />
//               </RadioGroup>
//             </FormControl>
//           </div>
//           {/* Regd / unredg */}
//           <div >
//             <FormControl component="fieldset">
//               <Typography style={{fontWeight:'bold',fontSize:16}} variant="caption">Regd / Unregd</Typography>
//               <RadioGroup
//                 row
//                 value={regdFilter}
//                 onChange={(e) => setRegdFilter(e.target.value)}
//                 aria-label="regdFilter"
//                 name="regdFilter"
//               >
//                 <FormControlLabel value="All" control={<Radio />} label="All" />
//                 <FormControlLabel value="Registered" control={<Radio />} label="Registered" />
//                 <FormControlLabel value="Un-Registered" control={<Radio />} label="Un-Registered" />
//               </RadioGroup>
//             </FormControl>
//           </div>
//           </div>

//           <div style={{display:'flex',flexDirection:'row'}}>
//             <div style={{display:'flex',flexDirection:'column'}}>
//               <Button className="Buttonz" variant="contained" color="primary" onClick={handleView} disabled={loading}>
//                 View
//               </Button>
//                 <Button style={{marginTop:"10px"}} className="Buttonz" variant="outlined" onClick={() => { setSaleData([]); setPurchaseData([]); }}>
//                 Exit
//               </Button>
//             </div>
//              <div style={{display:'flex',flexDirection:'column',marginLeft:"10px"}}>
//               <Button className="Buttonz" variant="outlined" disabled={loading || (!saleGrouped.length && !purchaseGrouped.length)}>
//                 Export
//               </Button>
//                 <Button onClick={handleExportDetailed} style={{marginTop:"10px"}} className="Buttonz" variant="contained" color="secondary">
//                 Detail
//               </Button>
//             </div>
             
//           </div>
//         </div>
//       </Paper>

//       {error && (
//         <Box mb={2}>
//           <Typography color="error">{error}</Typography>
//         </Box>
//       )}

//       {loading ? (
//         <Box display="flex" justifyContent="center" alignItems="center" height={200}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Grid container spacing={2}>
//           <Grid item xs={12} md={6}>
//             <Paper sx={{ p: 1 }}>
//               <Typography variant="h6" align="center">Sale <span style={{ color: "red", fontSize: 12 }}>DoubleClick Detail</span></Typography>
//               <TableContainer sx={{ maxHeight: 420 }}>
//                 <Table size="small" stickyHeader>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Gst %</TableCell>
//                       <TableCell align="right">Value</TableCell>
//                       <TableCell align="right">C.Tax</TableCell>
//                       <TableCell align="right">S.Tax</TableCell>
//                       <TableCell align="right">I.Tax</TableCell>
//                       <TableCell align="right">Cess</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {saleGrouped.map((g) => (
//                       <TableRow
//                         key={`sale-${g.gst}`}
//                         hover
//                         onDoubleClick={() => openDetail("sale", g.gst)}
//                         sx={{ cursor: "pointer" }}
//                       >
//                         <TableCell>{g.gst}%</TableCell>
//                         <TableCell align="right">{g.value.toFixed(2)}</TableCell>
//                         <TableCell align="right">{g.ctax.toFixed(2)}</TableCell>
//                         <TableCell align="right">{g.stax.toFixed(2)}</TableCell>
//                         <TableCell align="right">{g.itax.toFixed(2)}</TableCell>
//                         <TableCell align="right">{g.cess.toFixed(2)}</TableCell>
//                       </TableRow>
//                     ))}
//                     {/* totals */}
//                     <TableRow>
//                       <TableCell><strong>TOTAL</strong></TableCell>
//                       <TableCell align="right"><strong>{totals.sale.value.toFixed(2)}</strong></TableCell>
//                       <TableCell align="right"><strong>{totals.sale.ctax.toFixed(2)}</strong></TableCell>
//                       <TableCell align="right"><strong>{totals.sale.stax.toFixed(2)}</strong></TableCell>
//                       <TableCell align="right"><strong>{totals.sale.itax.toFixed(2)}</strong></TableCell>
//                       <TableCell align="right"><strong>{totals.sale.cess.toFixed(2)}</strong></TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Paper sx={{ p: 1 }}>
//               <Typography variant="h6" align="center">Purchase <span style={{ color: "red", fontSize: 12 }}>DoubleClick Detail</span></Typography>
//               <TableContainer sx={{ maxHeight: 420 }}>
//                 <Table size="small" stickyHeader>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Gst %</TableCell>
//                       <TableCell align="right">Value</TableCell>
//                       <TableCell align="right">C.Tax</TableCell>
//                       <TableCell align="right">S.Tax</TableCell>
//                       <TableCell align="right">I.Tax</TableCell>
//                       <TableCell align="right">Cess</TableCell>
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     {purchaseGrouped.map((g) => (
//                       <TableRow
//                         key={`purchase-${g.gst}`}
//                         hover
//                         onDoubleClick={() => openDetail("purchase", g.gst)}
//                         sx={{ cursor: "pointer" }}
//                       >
//                         <TableCell>{g.gst}%</TableCell>
//                         <TableCell align="right">{g.value.toFixed(2)}</TableCell>
//                         <TableCell align="right">{g.ctax.toFixed(2)}</TableCell>
//                         <TableCell align="right">{g.stax.toFixed(2)}</TableCell>
//                         <TableCell align="right">{g.itax.toFixed(2)}</TableCell>
//                         <TableCell align="right">{g.cess.toFixed(2)}</TableCell>
//                       </TableRow>
//                     ))}
//                     <TableRow>
//                       <TableCell><strong>TOTAL</strong></TableCell>
//                       <TableCell align="right"><strong>{totals.purchase.value.toFixed(2)}</strong></TableCell>
//                       <TableCell align="right"><strong>{totals.purchase.ctax.toFixed(2)}</strong></TableCell>
//                       <TableCell align="right"><strong>{totals.purchase.stax.toFixed(2)}</strong></TableCell>
//                       <TableCell align="right"><strong>{totals.purchase.itax.toFixed(2)}</strong></TableCell>
//                       <TableCell align="right"><strong>{totals.purchase.cess.toFixed(2)}</strong></TableCell>
//                     </TableRow>
//                   </TableBody>
//                 </Table>
//               </TableContainer>
//             </Paper>
//           </Grid>
//         </Grid>
//       )}
//     </Box>
//   );
// }


// import React,{useState} from 'react'
// import PurchaseSummaryModal from './IncomeTaxReports/PurchaseSummaryModal';
// import { Button } from 'react-bootstrap';

// const Example = () => {
//   const [openPurRep, setopenPurRep] = useState(false);

//   return (
//     <div>
//       <Button onClick={() => setopenPurRep(true)}>Open Pur Report</Button>
//       <PurchaseSummaryModal 
//         show={openPurRep} 
//         onClose={() => setopenPurRep(false)} 
//       />
//     </div>
//   )
// }

// export default Example



import React,{useState} from 'react'
import ProductModalCustomer from './Modals/ProductModalCustomer';
import TextField from "@mui/material/TextField";

const Example = () => {

  const [formData, setFormData] = useState({
    broker: "",
  });
  const [customerDetails, setcustomerDetails] = useState([
    {
      Vcode: "",
      vacode: "",
      gstno: "",
      pan: "",
      Add1: "",
      city: "",
      state: "",
      Tcs206c1H: "",
      TDS194Q: "",
    },
  ]);
  const tenant = "shkun_05062025_05062026";

  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key  
  const handleKeyDown = (event, index, field) => {
    // --------------- ENTER / TAB: move to NEXT FIELD -----------------
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      return;
    }
  
    // --------------- OPEN MODAL ON LETTER (ACCOUNT NAME) ---------------
    else if (/^[a-zA-Z]$/.test(event.key) && field === "accountname") {
      setPressedKey(event.key);
      openModalForItemCus(index);
      event.preventDefault();
    }
  };

  // Modal For CustomerDetails
  const [productsCus, setProductsCus] = useState([]);
  const [showModalCus, setShowModalCus] = useState(false);
  const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
  const [loadingCus, setLoadingCus] = useState(true);
  const [errorCus, setErrorCus] = useState(null);

  const handleItemChangeCus = (index, key, value) => {
    const updatedItems = [...customerDetails];
    updatedItems[index][key] = value;

if (key === "name") {
  const selectedProduct = productsCus.find(
    (product) => product.ahead === value
  );
  if (selectedProduct) {
    updatedItems[index] = {
      ...updatedItems[index],
      Vcode: selectedProduct.acode,
      vacode: selectedProduct.ahead,
      gstno: selectedProduct.gstNo,
      pan: selectedProduct.pan,
      Add1: selectedProduct.add1,
      city: selectedProduct.city,
      state: selectedProduct.state,
      Tcs206c1H: selectedProduct.tcs206,
      TDS194Q: selectedProduct.tds194q,
    };
  }
}
    setcustomerDetails(updatedItems);
  };

  const handleProductSelectCus = (product) => {
    if (!product) {
      alert("No product received!");
      setShowModalCus(false);
      return;
    }
  
    // clone the array
    const newCustomers = [...customerDetails];
  
    // overwrite the one at the selected index
    newCustomers[selectedItemIndexCus] = {
      ...newCustomers[selectedItemIndexCus],
      Vcode: product.acode || '',
      vacode: product.ahead || '',
      city:   product.city  || '',
      gstno:  product.gstNo  || '',
      pan:    product.pan    || '',
      Add1: product.add1 || '',
      state: product.state    || '',
      Tcs206c1H: product.tcs206    || '',
      TDS194Q: product.tds194q    || '',  
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexCus !== null) {
      // 👉 NEW: set broker in formData
      setFormData((prev) => ({
        ...prev,
        broker: product.agent || ""   // <-- change key name based on your API
      }));
      if (selectedItemIndexCus === "v_tpt") {
        // setFormData((prevData) => ({
        //   ...prevData,
        //   v_tpt: nameValue,
        // }));
      } else {
        handleItemChangeCus(selectedItemIndexCus, "name", nameValue);
      }
    }
    setcustomerDetails(newCustomers);
    setShowModalCus(false);
  };

  const handleCloseModalCus = () => {
    setShowModalCus(false);
    setPressedKey(""); // resets for next modal open
  };

  const openModalForItemCus = (index) => {
      setSelectedItemIndexCus(index);
      setShowModalCus(true);
  };

  const allFieldsCus = productsCus.reduce((fields, product) => {
  Object.keys(product).forEach((key) => {
    if (!fields.includes(key)) {
      fields.push(key);
    }
  });

  return fields;
    }, []);

  return (
    <div>
      {customerDetails.map((item, index) => (
        <div key={item.vacode}>
          <div className="CUS">
            <div className="customerdiv">
              <TextField
                label="CUSTOMER NAME"
                variant="filled"
                size="small"
                value={item.vacode}
                className="customerNAME custom-bordered-input"
                onKeyDown={(e) => {
                  handleKeyDown(e, index, "accountname");
                }}
                onFocus={(e) => e.target.select()}
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: "20px",
                  },
                }}
              />
            </div>
            <div className="citydivZ">
              <TextField
                className="cityName custom-bordered-input"
                value={item.city}
                variant="filled"
                label="CITY"
                size="small"
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: "20px",
                  },
                }}
                onChange={(e) =>
                  handleItemChangeCus(index, "city", e.target.value)
                }
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
        </div>
      ))}
      {showModalCus && (
      <ProductModalCustomer
        allFields={allFieldsCus}
        onSelect={handleProductSelectCus}
        onClose={handleCloseModalCus}
        initialKey={pressedKey}
        tenant={tenant}
      />
      )}
      <TextField
        className="Remz custom-bordered-input"
        id="broker"
        value={formData.broker}
        label='BROKER'
        inputProps={{
        maxLength: 48,
        style: {
          height: 20,
        },}}
        size="small"
        variant="filled"
      />
    </div>
  )
}

export default Example
