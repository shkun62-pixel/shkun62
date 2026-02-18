
import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import styles from "./StockReport.module.css";
import { Button, Card, Form } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StockSummPrint from "./StockSummPrint";
import { useNavigate } from "react-router-dom";
import financialYear from "../Shared/financialYear";
import useCompanySetup from "../Shared/useCompanySetup";
import { CompanyContext } from "../Context/CompanyContext";

const StockSummary = () => {
  const { decimals } = useCompanySetup();
  const { company } = useContext(CompanyContext);
  // const tenant = company?.databaseName;
  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  const navigate = useNavigate();

  // -------------------- dates --------------------
  const [fromDate, setFromDate] = useState(null);
  const [uptoDate, setUptoDate] = useState(null);

  const parseToDate = (dateStrOrDate) => {
    if (!dateStrOrDate) return null;
    if (dateStrOrDate instanceof Date) return dateStrOrDate;

    const s = String(dateStrOrDate).trim();
    const iso = new Date(s);
    if (!isNaN(iso.getTime())) return iso;

    const parts = s.includes("/") ? s.split("/") : s.split("-");
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  };

  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(parseToDate(fy.start));
    setUptoDate(parseToDate(fy.end));
  }, []);

  // -------------------- data --------------------
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // -------------------- print modal --------------------
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // -------------------- active row / keyboard --------------------
  const tableContainerRef = useRef(null);
  const [activeRow, setActiveRow] = useState(0);

  // -------------------- search --------------------
  const [q, setQ] = useState("");

  // ✅ keep last clicked row when coming back
  const saveActiveRow = (idx) => {
    sessionStorage.setItem("stock_activeRow1", String(idx));
    sessionStorage.setItem("stock_summary_restore_scroll", "1");
  };

  const goToReport = (sdisc, idx) => {
    saveActiveRow(idx);
    navigate("/StockReport", { state: { selectedAhead: sdisc } });
  };

  // ✅ FIX: handleRowKeyDown is defined (no more "handlekeydown is not defined")
  const handleRowKeyDown = (e, sdisc, idx) => {
    if (e.key === "Enter") goToReport(sdisc, idx);
  };

  // restore active row
  useEffect(() => {
    const savedRow = sessionStorage.getItem("stock_activeRow1");
    if (savedRow !== null) {
      const index = parseInt(savedRow, 10);
      if (!isNaN(index)) setActiveRow(index);
    }
  }, []);

  // clamp active row after items load
  useEffect(() => {
    const savedRow = sessionStorage.getItem("stock_activeRow1");
    if (savedRow !== null && items.length > 0) {
      const index = Math.min(parseInt(savedRow, 10), items.length - 1);
      if (!isNaN(index)) setActiveRow(index);
    }
  }, [items]);

  // global arrow up/down + enter (only when focus is not inside an input)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      if (!items.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveRow((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveRow((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedItem = filteredItems[activeRow];
        if (selectedItem) {
          saveActiveRow(activeRow);
          navigate("/StockReport", { state: { selectedAhead: selectedItem.sdisc } });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, activeRow]); // eslint-disable-line react-hooks/exhaustive-deps

  // auto-scroll active row into view (also on coming back)
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const rows = container.querySelectorAll("tbody tr");
    if (!rows.length) return;

    const idx = Math.max(0, Math.min(activeRow, rows.length - 1));
    const selectedRow = rows[idx];
    if (!selectedRow) return;

    const headerOffset = 44;
    const buffer = 20;

    const rowTop = selectedRow.offsetTop;
    const rowBottom = rowTop + selectedRow.offsetHeight;

    const containerHeight = container.clientHeight;
    const visibleTop = container.scrollTop + buffer + headerOffset;
    const visibleBottom = container.scrollTop + containerHeight - buffer;

    const shouldRestore = sessionStorage.getItem("stock_summary_restore_scroll") === "1";

    if (shouldRestore) {
      const newScroll = Math.max(0, rowTop - headerOffset - 60);
      container.scrollTo({ top: newScroll, behavior: "auto" });
      sessionStorage.removeItem("stock_summary_restore_scroll");
      return;
    }

    if (rowBottom > visibleBottom) {
      const newScroll = rowBottom - containerHeight + buffer * 2;
      container.scrollTo({ top: newScroll, behavior: "smooth" });
    } else if (rowTop < visibleTop) {
      const newScroll = rowTop - headerOffset - buffer;
      container.scrollTo({ top: newScroll, behavior: "smooth" });
    }
  }, [activeRow, items]);

  // -------------------- SINGLE API FETCH --------------------
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        if (!tenant || !fromDate || !uptoDate) return;

        setLoading(true);
        setItems([]);

        const from = new Date(fromDate).toISOString().slice(0, 10);
        const upto = new Date(uptoDate).toISOString().slice(0, 10);

        const res = await axios.get(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/summary`, {
          params: { from, upto, decimals },
        });

        const rows = Array.isArray(res.data?.items) ? res.data.items : [];

        // ✅ ASC order by account name (sdisc)
        rows.sort((a, b) =>
          String(a?.sdisc ?? "").localeCompare(String(b?.sdisc ?? ""), undefined, {
            sensitivity: "base",
          })
        );

        setItems(rows);
      } catch (err) {
        console.error("Error loading stock summary", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [tenant, fromDate, uptoDate, decimals]);

  // ✅ Search filter (by account name)
  const filteredItems = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((x) => String(x?.sdisc ?? "").toLowerCase().includes(term));
  }, [items, q]);

  // keep activeRow valid for filtered list
  useEffect(() => {
    if (!filteredItems.length) {
      setActiveRow(0);
      return;
    }
    setActiveRow((prev) => Math.min(prev, filteredItems.length - 1));
  }, [filteredItems.length]);

  // -------------------- UI Helpers --------------------
  const fmt = (v) => (v === null || v === undefined || v === "" ? "" : v);

  return (
    <div style={{ padding: "10px" }}>
      <Card
        className={styles.cardL}
        style={{
          borderRadius: 18,
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
          overflow: "hidden",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(245,248,255,0.96))",
        }}
      >
        <div
          style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            background:
              "linear-gradient(135deg, rgba(125,165,255,0.18), rgba(255,255,255,0.75))",
            backdropFilter: "blur(8px)",
          }}
        >
          <h1
            className={styles.header}
            style={{
              margin: 0,
              fontSize: 22,
              letterSpacing: 0.5,
              fontWeight: 800,
              color: "#1f2a44",
            }}
          >
            STOCK SUMMARY
          </h1>

          <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(0,0,0,0.08)",
                padding: "6px 10px",
                borderRadius: 12,
              }}
            >
              <span style={{ fontSize: 12, color: "#556" }}>Search</span>
              <Form.Control
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Type account name..."
                style={{
                  height: 30,
                  borderRadius: 10,
                  fontSize: 13,
                  border: "1px solid rgba(0,0,0,0.12)",
                  minWidth: 240,
                }}
              />
              {q && (
                <Button
                  size="sm"
                  variant="light"
                  onClick={() => setQ("")}
                  style={{
                    borderRadius: 10,
                    height: 30,
                    padding: "0 10px",
                    border: "1px solid rgba(0,0,0,0.08)",
                  }}
                >
                  Clear
                </Button>
              )}
            </div>

            <Button className="Buttonz" onClick={handleOpen} disabled={loading}>
              {loading ? "Loading..." : "Print"}
            </Button>
          </div>
        </div>

        <div style={{ padding: "10px 14px", display: "flex", gap: 14, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#334" }}>From</span>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              className={styles.From}
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#334" }}>Upto</span>
            <DatePicker
              selected={uptoDate}
              onChange={(date) => setUptoDate(date)}
              className={styles.Upto}
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div style={{ marginLeft: "auto", fontSize: 12, color: "#667" }}>
            Rows: <b>{filteredItems.length}</b>
          </div>

          {/* hidden print */}
          <div style={{ visibility: "hidden", width: 0, height: 0 }}>
            <StockSummPrint
              items={filteredItems}
              isOpen={open}
              handleClose={handleClose}
              fromDate={fromDate}
              uptoDate={uptoDate}
            />
          </div>
        </div>

        <div
          ref={tableContainerRef}
          className={styles.TableDIV}
          style={{
            margin: "0 12px 12px",
            // borderRadius: 16,
            overflow: "auto",
            border: "1px solid rgba(0,0,0,0.08)",
            boxShadow: "0 10px 24px rgba(0,0,0,0.06)",
            background: "white",
          }}
        >
          <Table className="custom-table" style={{ marginBottom: 0 }}>
            <thead
              style={{
                textAlign: "center",
                position: "sticky",
                top: 0,
                zIndex: 2,
                background: "linear-gradient(180deg, #e9f2ff, #d8e8ff)",
                borderBottom: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <tr style={{ color: "#334" }}>
                <th style={{ minWidth: 420 }}>ACCOUNT NAME</th>
                <th>Op.</th>
                <th>OPENING</th>
                <th>Rec.</th>
                <th>PUR/REC.</th>
                <th>ISSUE</th>
                <th>ISSUE QTY</th>
                <th>Cls.</th>
                <th>CLOSING</th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item, index) => (
                <tr
                  key={item.id || index}
                  tabIndex={0}
                  onKeyDown={(e) => handleRowKeyDown(e, item.sdisc, index)}
                  onClick={() => {
                    setActiveRow(index);
                    saveActiveRow(index);
                  }}
                  onDoubleClick={() => goToReport(item.sdisc, index)}
                  style={{
                    background:
                      activeRow === index
                        ? "linear-gradient(90deg, rgba(255,224,138,0.85), rgba(255,255,255,1))"
                        : "white",
                    fontWeight: activeRow === index ? 800 : 500,
                    cursor: "pointer",
                    transition: "0.15s",
                  }}
                >
                  <td style={{ padding: 8, minWidth: 420 }} className={styles.font}>
                    {fmt(item.sdisc)}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }} className={styles.font}>
                    {fmt(item.pcsOp)}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }} className={styles.font}>
                    {fmt(item.opening)}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }} className={styles.font}>
                    {fmt(item.pcsPur)}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }} className={styles.font}>
                    {fmt(item.purRec)}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }} className={styles.font}>
                    {fmt(item.pcsSale)}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }} className={styles.font}>
                    {fmt(item.sale)}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }} className={styles.font}>
                    {fmt(item.pcsClosing)}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }} className={styles.font}>
                    {fmt(item.closing)}
                  </td>
                </tr>
              ))}

              {!loading && filteredItems.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 18, color: "#667" }}>
                    No data found
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 18, color: "#667" }}>
                    Loading...
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        <div style={{ padding: "0 14px 14px", fontSize: 12, color: "#667" }}>
          Tips: Use <b>↑</b>/<b>↓</b> to move, <b>Enter</b> to open Stock Report, <b>Double click</b> also opens.
        </div>
      </Card>
    </div>
  );
};

export default StockSummary;

// import React, { useState, useEffect, useRef } from "react";
// import styles from "./StockReport.module.css";
// import { Button, Card } from "react-bootstrap";
// import Table from "react-bootstrap/Table";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import StockSummPrint from "./StockSummPrint";
// import { useNavigate } from "react-router-dom";
// import financialYear from "../Shared/financialYear";
// import useCompanySetup from "../Shared/useCompanySetup";

// const StockSummary = () => {

//   const {decimals} = useCompanySetup();
//   const navigate = useNavigate();
//   const handleRowKeyDown = (e, sdisc) => {
//     if (e.key === "Enter") {
//       navigate("/StockReport", {
//         state: { selectedAhead: sdisc }
//       });
//     }
//   };

//   const [fromDate, setFromDate] = useState("");
//   const [uptoDate, setUptoDate] = useState("");
//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setFromDate(fy.start); // converted
//     setUptoDate(fy.end);     // converted
//   }, []);

//   const [items, setItems] = useState([
//     {
//       id: 1,
//       date: "",
//       sdisc: "",
//       pcsOp: "",
//       opening: "",
//       pcsPur: "",
//       purRec: "",
//       pcsSale: "",
//       sale: "",
//       pcsClosing: "",
//       closing: "",
//     },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [aheads, setAheads] = useState([]);
//   const [selectedAhead, setSelectedAhead] = useState("");
//   const [openingWeight, setOpeningWeight] = useState(0);
//   const [refreshTrigger, setRefreshTrigger] = useState(0);
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   // Active Row
//   const tableContainerRef = useRef(null);
//   const [activeRow, setActiveRow] = useState(0);

//   // Fetch unique Aheads list
//   useEffect(() => {
//     const fetchAheads = async () => {
//       try {
//         const res = await axios.get(
//           "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/stockmaster"
//         );
//         const list = res.data.data
//           .map((item) => item.formData?.Aheads?.trim())
//           .filter((v, i, arr) => v && arr.indexOf(v) === i);
//         setAheads(list);
//         if (list.length > 0) setSelectedAhead(list[0]);
//       } catch (e) {
//         console.error("Error loading Aheads", e);
//       }
//     };
//     fetchAheads();
//   }, []);

//   const parseDate = (dateStr) => {
//     if (!dateStr) return null;

//     // If ISO format → let JS handle it
//     if (!isNaN(Date.parse(dateStr))) {
//       return new Date(dateStr);
//     }

//     // dd/mm/yyyy OR dd-mm-yyyy
//     const parts = dateStr.includes("/")
//       ? dateStr.split("/")
//       : dateStr.split("-");

//     if (parts.length === 3) {
//       const day = parseInt(parts[0], 10);
//       const month = parseInt(parts[1], 10) - 1;
//       let year = parseInt(parts[2], 10);

//       // handle 2-digit year
//       if (year < 100) year += 2000;

//       return new Date(year, month, day);
//     }

//     return null;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         setItems([]);
//         setOpeningWeight(0);

//         const [saleRes, purchaseRes, stockMasterRes] = await Promise.all([
//           axios.get(
//             "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale"
//           ),
//           axios.get(
//             "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase"
//           ),
//           axios.get(
//             "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/stockmaster"
//           ),
//         ]);

//         const isWithinDateRange = (dateStr) => {
//           const d = parseDate(dateStr);
//           if (!d) return false;
//           return d >= fromDate && d <= uptoDate;
//         };

//         const allItems = [];

//         for (const ahead of aheads) {
//           const normalizedAhead = ahead.trim().toLowerCase();

//           const matchingStock = stockMasterRes.data.data.find(
//             (item) =>
//               item.formData?.Aheads?.trim().toLowerCase() === normalizedAhead
//           );
//           const opening = parseFloat(matchingStock?.formData?.openwts || 0);

//           const purchases = purchaseRes.data.flatMap((purchase) =>
//             purchase.items
//               .filter(
//                 (item) =>
//                   item.sdisc?.trim().toLowerCase() === normalizedAhead &&
//                   isWithinDateRange(purchase.formData.date)
//               )
//               .map((item) => ({
//                 date: parseDate(purchase.formData.date),
//                 // date: new Date(purchase.formData.date),
//                 sdisc: purchase.supplierdetails?.[0]?.vacode || "",
//                 purRec: parseFloat(item.weight),
//                 pcsPur: parseFloat(item.pkgs || 0), // ADDED
//                 sale: 0,
//                 pcsSale: 0,
//               }))
//           );

//           const sales = saleRes.data.flatMap((sale) =>
//             sale.items
//               .filter(
//                 (item) =>
//                   item.sdisc?.trim().toLowerCase() === normalizedAhead &&
//                   isWithinDateRange(sale.formData.date)
//               )
//               .map((item) => ({
//                 date: parseDate(sale.formData.date),
//                 sdisc: sale.customerDetails?.[0]?.vacode || "",
//                 purRec: 0,
//                 pcsPur: 0,
//                 sale: parseFloat(item.weight),
//                 pcsSale: parseFloat(item.pkgs || 0), // ADDED
//               }))
//           );

//           const merged = [...purchases, ...sales].sort(
//             (a, b) => new Date(a.date) - new Date(b.date)
//           );

//           let prevClosing = opening;
//           let totalPurRec = 0;
//           let totalSale = 0;

//           // NEW for PKGS
//           let pcsOpening = parseFloat(matchingStock?.formData?.openpcs || 0);
//           let pcsClosing = pcsOpening;
//           let totalPcsPur = 0;
//           let totalPcsSale = 0;

//           merged.forEach((item) => {
//             const purRec = item.purRec || 0;
//             const sale = item.sale || 0;
//             const pcsPur = item.pcsPur || 0;
//             const pcsSale = item.pcsSale || 0;

//             prevClosing += purRec - sale;
//             pcsClosing += pcsPur - pcsSale;

//             totalPurRec += purRec;
//             totalSale += sale;
//             totalPcsPur += pcsPur;
//             totalPcsSale += pcsSale;
//           });

//           allItems.push({
//             id: `ahead-${normalizedAhead}`,
//             date: "",
//             sdisc: ahead,
//             pcsOp: pcsOpening.toFixed(decimals),
//             opening: opening.toFixed(decimals),
//             pcsPur: totalPcsPur.toFixed(decimals),
//             purRec: totalPurRec.toFixed(decimals),
//             pcsSale: totalPcsSale.toFixed(decimals),
//             sale: totalSale.toFixed(decimals),
//             pcsClosing: pcsClosing.toFixed(decimals),
//             closing: prevClosing.toFixed(decimals),
//           });
//         }

//         setItems(allItems);
//       } catch (err) {
//         console.error("Error loading data", err);
//       } finally {
//         setTimeout(() => setLoading(false), 1000);
//       }
//     };

//     if (aheads.length > 0) {
//       fetchData();
//     }
//   }, [aheads, fromDate, uptoDate]);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (items.length === 0) return;

//       if (e.key === "ArrowDown") {
//         setActiveRow((prev) => Math.min(prev + 1, items.length - 1));
//       }
//       else if (e.key === "ArrowUp") {
//         setActiveRow((prev) => Math.max(prev - 1, 0));
//       }
//       else if (e.key === "Enter") {
//         const selectedItem = items[activeRow];
//           // ✅ SAVE ACTIVE ROW INDEX
//         sessionStorage.setItem("stock_activeRow1", activeRow);
//         if (selectedItem) {
//           navigate("/StockReport", {
//             state: { selectedAhead: selectedItem.sdisc }
//           });
//         }
//     }};
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [items, activeRow]);

//   const handleRowNavigate = (sdisc, index) => {
//     sessionStorage.setItem("stock_activeRow1", index);
//     navigate("/StockReport", {
//       state: { selectedAhead: sdisc },
//     });
//   };

//   useEffect(() => {
//     const savedRow = sessionStorage.getItem("stock_activeRow1");

//     if (savedRow !== null) {
//       const index = parseInt(savedRow, 10);
//       if (!isNaN(index)) {
//         setActiveRow(index);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const savedRow = sessionStorage.getItem("stock_activeRow1");

//     if (savedRow !== null && items.length > 0) {
//       const index = Math.min(
//         parseInt(savedRow, 10),
//         items.length - 1
//       );
//       setActiveRow(index);
//     }
//   }, [items]);

//   // Auto -scroll effect
//   useEffect(() => {
//     const container = tableContainerRef.current;
//     if (!container) return;

//     const rows = container.querySelectorAll("tbody tr");
//     if (!rows.length) return;

//     const idx = Math.max(0, Math.min(activeRow, rows.length - 1));
//     const selectedRow = rows[idx];
//     if (!selectedRow) return;

//     // Adjust for header height (if your thead is sticky)
//     const headerOffset = 40;  // Adjust if your header height is different
//     const buffer = 25;        // Extra space above/below row

//     const rowTop = selectedRow.offsetTop;
//     const rowBottom = rowTop + selectedRow.offsetHeight;

//     const containerHeight = container.clientHeight;
//     const visibleTop = container.scrollTop + buffer + headerOffset;
//     const visibleBottom = container.scrollTop + containerHeight - buffer;

//     // If row is below visible area → scroll down
//     if (rowBottom > visibleBottom) {
//       const newScroll =
//         rowBottom - containerHeight + buffer * 2;

//       container.scrollTo({
//         top: newScroll,
//         behavior: "smooth",
//       });
//     }

//     // If row is above visible area → scroll up
//     else if (rowTop < visibleTop) {
//       const newScroll =
//         rowTop - headerOffset - buffer;

//       container.scrollTo({
//         top: newScroll,
//         behavior: "smooth",
//       });
//     }
//   }, [activeRow, items]);

//   return (
//     <div style={{padding:"10px"}}>
//       <Card className={styles.cardL}>
//       <h1 className={styles.header}>STOCK SUMMARY</h1>
//       <div className={styles.TopPart}>
//         <div className={styles.Column}>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//           >
//             <text style={{ marginRight: "8px" }}>From:</text>
//             <DatePicker
//               selected={fromDate}
//               onChange={(date) => setFromDate(date)}
//               className={styles.From}
//               dateFormat="dd/MM/yyyy"
//             />
//           </div>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//               marginTop: 5,
//             }}
//           >
//             <text style={{ marginRight: "8px" }}>Upto:</text>
//             <DatePicker
//               selected={uptoDate}
//               onChange={(date) => setUptoDate(date)}
//               className={styles.Upto}
//               dateFormat="dd/MM/yyyy"
//             />
//           </div>
//         </div>
//         <div style={{ marginTop:"auto",marginLeft:"20px" }}>
//           <Button className="Buttonz" onClick={handleOpen}>Print</Button>
//         </div>
//         <div style={{ visibility: "hidden", width: 0, height: 0 }}>
//           <StockSummPrint
//             items={items}
//             isOpen={open}
//             handleClose={handleClose}
//             fromDate={fromDate}
//             uptoDate={uptoDate}
//           />
//         </div>
//       </div>
//         <div ref={tableContainerRef} className={styles.TableDIV}>
//           <Table className="custom-table">
//             <thead
//               style={{
//                 background: "skyblue",
//                 textAlign: "center",
//                 position: "sticky",
//                 top: 0,
//               }}
//             >
//               <tr style={{ color: "#575a5a" }}>
//                 <th style={{ minWidth: "400px" }}>ACCOUNT NAME</th>
//                 <th>Op.</th>
//                 <th>OPENING</th>
//                 <th>Rec.</th>
//                 <th>PUR/REC.</th>
//                 <th>ISSUE</th>
//                 <th>ISSUE QTY</th>
//                 <th>Cls.</th>
//                 <th>CLOSING</th>
//               </tr>
//             </thead>
//             <tbody
//               style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}
//             >
//               {items.map((item, index) => (
//                   <tr
//                   key={item.id}
//                   style={{
//                     backgroundColor: activeRow === index ? "#ffe08a" : "white",
//                     fontWeight: activeRow === index ? "bold" : "normal",
//                     cursor: "pointer",
//                     transition: "0.2s",
//                   }}
//                   tabIndex={0}        // ⭐ REQUIRED for key events
//                   onKeyDown={(e) => handleRowKeyDown(e, item.sdisc)}
//                   onClick={() => setActiveRow(index)}
//                   onDoubleClick={() => handleRowNavigate(item.sdisc, index)}   // ✅ ADD THIS
//                 >
//                   <td style={{ padding: 5, minWidth: "400px" }} className={styles.font}>
//                     {item.sdisc}
//                   </td>

//                   <td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
//                     {item.pcsOp}
//                   </td>

//                   <td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
//                     {item.opening}
//                   </td>

//                   <td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
//                     {item.pcsPur}
//                   </td>

//                   <td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
//                     {item.purRec}
//                   </td>

//                   <td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
//                     {item.pcsSale}
//                   </td>

//                   <td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
//                     {item.sale}
//                   </td>

//                   <td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
//                     {item.pcsClosing}
//                   </td>

//                   <td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
//                     {item.closing}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>

//       </Card>
//     </div>
//   );
// };

// export default StockSummary;

// import React, { useState, useEffect, useRef, useContext } from "react";
// import styles from "./StockReport.module.css";
// import { Button, Card } from "react-bootstrap";
// import Table from "react-bootstrap/Table";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import StockSummPrint from "./StockSummPrint";
// import { useNavigate } from "react-router-dom";
// import financialYear from "../Shared/financialYear";
// import useCompanySetup from "../Shared/useCompanySetup";
// import { CompanyContext } from "../Context/CompanyContext";

// const StockSummary = () => {
//   const { decimals } = useCompanySetup();
//   const { company } = useContext(CompanyContext);
//   const tenant = "shkun_05062025_05062026";

//   const navigate = useNavigate();

//   // -------------------- dates (store as Date objects always) --------------------
//   const [fromDate, setFromDate] = useState(null);
//   const [uptoDate, setUptoDate] = useState(null);

//   // Convert FY dates to Date safely
//   const parseToDate = (dateStrOrDate) => {
//     if (!dateStrOrDate) return null;
//     if (dateStrOrDate instanceof Date) return dateStrOrDate;

//     const s = String(dateStrOrDate).trim();

//     // ISO format
//     const iso = new Date(s);
//     if (!isNaN(iso.getTime())) return iso;

//     // dd/mm/yyyy OR dd-mm-yyyy
//     const parts = s.includes("/") ? s.split("/") : s.split("-");
//     if (parts.length === 3) {
//       const day = parseInt(parts[0], 10);
//       const month = parseInt(parts[1], 10) - 1;
//       let year = parseInt(parts[2], 10);
//       if (year < 100) year += 2000;
//       const d = new Date(year, month, day);
//       return isNaN(d.getTime()) ? null : d;
//     }
//     return null;
//   };

//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setFromDate(parseToDate(fy.start));
//     setUptoDate(parseToDate(fy.end));
//   }, []);

//   // -------------------- data --------------------
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // -------------------- print modal --------------------
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   // -------------------- active row / keyboard --------------------
//   const tableContainerRef = useRef(null);
//   const [activeRow, setActiveRow] = useState(0);

//   const handleRowKeyDown = (e, sdisc, index) => {
//     if (e.key === "Enter") {
//       sessionStorage.setItem("stock_activeRow1", index);
//       navigate("/StockReport", { state: { selectedAhead: sdisc } });
//     }
//   };

//   const handleRowNavigate = (sdisc, index) => {
//     sessionStorage.setItem("stock_activeRow1", index);
//     navigate("/StockReport", { state: { selectedAhead: sdisc } });
//   };

//   // restore active row
//   useEffect(() => {
//     const savedRow = sessionStorage.getItem("stock_activeRow1");
//     if (savedRow !== null) {
//       const index = parseInt(savedRow, 10);
//       if (!isNaN(index)) setActiveRow(index);
//     }
//   }, []);

//   // clamp active row after items load
//   useEffect(() => {
//     const savedRow = sessionStorage.getItem("stock_activeRow1");
//     if (savedRow !== null && items.length > 0) {
//       const index = Math.min(parseInt(savedRow, 10), items.length - 1);
//       if (!isNaN(index)) setActiveRow(index);
//     }
//   }, [items]);

//   // global arrow up/down + enter
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!items.length) return;

//       if (e.key === "ArrowDown") {
//         setActiveRow((prev) => Math.min(prev + 1, items.length - 1));
//       } else if (e.key === "ArrowUp") {
//         setActiveRow((prev) => Math.max(prev - 1, 0));
//       } else if (e.key === "Enter") {
//         const selectedItem = items[activeRow];
//         sessionStorage.setItem("stock_activeRow1", activeRow);
//         if (selectedItem) {
//           navigate("/StockReport", {
//             state: { selectedAhead: selectedItem.sdisc },
//           });
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [items, activeRow, navigate]);

//   // auto-scroll active row into view
//   useEffect(() => {
//     const container = tableContainerRef.current;
//     if (!container) return;

//     const rows = container.querySelectorAll("tbody tr");
//     if (!rows.length) return;

//     const idx = Math.max(0, Math.min(activeRow, rows.length - 1));
//     const selectedRow = rows[idx];
//     if (!selectedRow) return;

//     const headerOffset = 40;
//     const buffer = 25;

//     const rowTop = selectedRow.offsetTop;
//     const rowBottom = rowTop + selectedRow.offsetHeight;

//     const containerHeight = container.clientHeight;
//     const visibleTop = container.scrollTop + buffer + headerOffset;
//     const visibleBottom = container.scrollTop + containerHeight - buffer;

//     if (rowBottom > visibleBottom) {
//       const newScroll = rowBottom - containerHeight + buffer * 2;
//       container.scrollTo({ top: newScroll, behavior: "smooth" });
//     } else if (rowTop < visibleTop) {
//       const newScroll = rowTop - headerOffset - buffer;
//       container.scrollTo({ top: newScroll, behavior: "smooth" });
//     }
//   }, [activeRow, items]);

//   // -------------------- SINGLE API FETCH --------------------
//   useEffect(() => {
//     const fetchSummary = async () => {
//       try {
//         if (!tenant || !fromDate || !uptoDate) return;

//         setLoading(true);
//         setItems([]);

//         // backend expects YYYY-MM-DD
//         const from = new Date(fromDate).toISOString().slice(0, 10);
//         const upto = new Date(uptoDate).toISOString().slice(0, 10);
//         console.log(tenant);
//         const res = await axios.get(
//           `https://www.shkunweb.com/shkunlive/${tenant}/tenant/summary`,
//           { params: { from, upto, decimals } },
//         );

//         setItems(Array.isArray(res.data?.items) ? res.data.items : []);
//       } catch (err) {
//         console.error("Error loading stock summary", err);
//         setItems([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSummary();
//   }, [tenant, fromDate, uptoDate, decimals]);

//   return (
//     <div style={{ padding: "10px" }}>
//       <Card className={styles.cardL}>
//         <h1 className={styles.header}>STOCK SUMMARY</h1>

//         <div className={styles.TopPart}>
//           <div className={styles.Column}>
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//               }}
//             >
//               <text style={{ marginRight: "8px" }}>From:</text>
//               <DatePicker
//                 selected={fromDate}
//                 onChange={(date) => setFromDate(date)}
//                 className={styles.From}
//                 dateFormat="dd/MM/yyyy"
//               />
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//                 marginTop: 5,
//               }}
//             >
//               <text style={{ marginRight: "8px" }}>Upto:</text>
//               <DatePicker
//                 selected={uptoDate}
//                 onChange={(date) => setUptoDate(date)}
//                 className={styles.Upto}
//                 dateFormat="dd/MM/yyyy"
//               />
//             </div>
//           </div>

//           <div style={{ marginTop: "auto", marginLeft: "20px" }}>
//             <Button className="Buttonz" onClick={handleOpen} disabled={loading}>
//               {loading ? "Loading..." : "Print"}
//             </Button>
//           </div>

//           {/* hidden print component */}
//           <div style={{ visibility: "hidden", width: 0, height: 0 }}>
//             <StockSummPrint
//               items={items}
//               isOpen={open}
//               handleClose={handleClose}
//               fromDate={fromDate}
//               uptoDate={uptoDate}
//             />
//           </div>
//         </div>

//         <div ref={tableContainerRef} className={styles.TableDIV}>
//           <Table className="custom-table">
//             <thead
//               style={{
//                 background: "skyblue",
//                 textAlign: "center",
//                 position: "sticky",
//                 top: 0,
//               }}
//             >
//               <tr style={{ color: "#575a5a" }}>
//                 <th style={{ minWidth: "400px" }}>ACCOUNT NAME</th>
//                 <th>Op.</th>
//                 <th>OPENING</th>
//                 <th>Rec.</th>
//                 <th>PUR/REC.</th>
//                 <th>ISSUE</th>
//                 <th>ISSUE QTY</th>
//                 <th>Cls.</th>
//                 <th>CLOSING</th>
//               </tr>
//             </thead>

//             <tbody
//               style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}
//             >
//               {items.map((item, index) => (
//                 <tr
//                   key={item.id || index}
//                   style={{
//                     backgroundColor: activeRow === index ? "#ffe08a" : "white",
//                     fontWeight: activeRow === index ? "bold" : "normal",
//                     cursor: "pointer",
//                     transition: "0.2s",
//                   }}
//                   tabIndex={0}
//                   onKeyDown={(e) => handleRowKeyDown(e, item.sdisc, index)}
//                   onClick={() => setActiveRow(index)}
//                   onDoubleClick={() => handleRowNavigate(item.sdisc, index)}
//                 >
//                   <td
//                     style={{ padding: 5, minWidth: "400px" }}
//                     className={styles.font}
//                   >
//                     {item.sdisc}
//                   </td>

//                   <td
//                     style={{ padding: 5, textAlign: "right" }}
//                     className={styles.font}
//                   >
//                     {item.pcsOp}
//                   </td>

//                   <td
//                     style={{ padding: 5, textAlign: "right" }}
//                     className={styles.font}
//                   >
//                     {item.opening}
//                   </td>

//                   <td
//                     style={{ padding: 5, textAlign: "right" }}
//                     className={styles.font}
//                   >
//                     {item.pcsPur}
//                   </td>

//                   <td
//                     style={{ padding: 5, textAlign: "right" }}
//                     className={styles.font}
//                   >
//                     {item.purRec}
//                   </td>

//                   <td
//                     style={{ padding: 5, textAlign: "right" }}
//                     className={styles.font}
//                   >
//                     {item.pcsSale}
//                   </td>

//                   <td
//                     style={{ padding: 5, textAlign: "right" }}
//                     className={styles.font}
//                   >
//                     {item.sale}
//                   </td>

//                   <td
//                     style={{ padding: 5, textAlign: "right" }}
//                     className={styles.font}
//                   >
//                     {item.pcsClosing}
//                   </td>

//                   <td
//                     style={{ padding: 5, textAlign: "right" }}
//                     className={styles.font}
//                   >
//                     {item.closing}
//                   </td>
//                 </tr>
//               ))}

//               {!loading && items.length === 0 && (
//                 <tr>
//                   <td colSpan={9} style={{ textAlign: "center", padding: 20 }}>
//                     No data found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default StockSummary;
