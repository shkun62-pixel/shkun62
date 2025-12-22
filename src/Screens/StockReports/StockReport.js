import React, { useState, useEffect, useRef } from "react";
import styles from "./StockReport.module.css";
import { Button, Card } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StockRpPrint from "./StockRpPrint";
import { useNavigate } from "react-router-dom";
import financialYear from "../Shared/financialYear";
import InputMask from "react-input-mask";

const StockReport = () => {
  const tenant = "shkun_05062025_05062026"
  const [fromDate, setFromDate] = useState("");
  const [uptoDate, setUptoDate] = useState("");

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(formatDate(fy.start)); // converted
    setUptoDate(formatDate(fy.end));     // converted
  }, []);

  const [items, setItems] = useState([
    {
      id: 1,
      date: "",
      sdisc: "",
      opening: "",
      purRec: "",
      production: "",
      issue: "",
      sale: "",
      closing: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [aheads, setAheads] = useState([]);
  const [selectedAhead, setSelectedAhead] = useState("");
  const [reportType, setReportType] = useState("");
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [openingWeight, setOpeningWeight] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Active Row 
  const tableContainerRef = useRef(null);
  const [activeRow, setActiveRow] = useState(0);
  const navigate = useNavigate();


  // Fetch unique Aheads list
  useEffect(() => {
    const fetchAheads = async () => {
      try {
        const res = await axios.get(
          "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/stockmaster"
        );
        const list = res.data.data
          .map((item) => item.formData?.Aheads?.trim())
          .filter((v, i, arr) => v && arr.indexOf(v) === i);
        setAheads(list);
        if (list.length > 0) setSelectedAhead(list[0]);
      } catch (e) {
        console.error("Error loading Aheads", e);
      }
    };
    fetchAheads();
  }, []);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    // If ISO format → let JS handle it
    if (!isNaN(Date.parse(dateStr))) {
      return new Date(dateStr);
    }

    // dd/mm/yyyy OR dd-mm-yyyy
    const parts = dateStr.includes("/")
      ? dateStr.split("/")
      : dateStr.split("-");

    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      let year = parseInt(parts[2], 10);

      // handle 2-digit year
      if (year < 100) year += 2000;

      return new Date(year, month, day);
    }

    return null;
  };

  useEffect(() => {
    if (!selectedAhead) return;
    setLoading(true);

    setPurchaseItems([]);
    setSaleItems([]);
    setItems([]);
    setOpeningWeight(0);

    const fetchData = async () => {
      try {
        const [saleRes, purchaseRes, stockMasterRes] = await Promise.all([
          axios.get(
            "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale"
          ),
          axios.get(
            "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase"
          ),
          axios.get(
            "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/stockmaster"
          ),
        ]);

        const matchingStock = stockMasterRes.data.data.find(
          (item) => item.formData?.Aheads?.trim() === selectedAhead
        );
        const opening = parseFloat(matchingStock?.formData?.openwts || 0);
        setOpeningWeight(opening);

        const normalizedAhead = selectedAhead.trim().toLowerCase();
        const isWithinDateRange = (date) => {
          const d = parseDate(date);
          const f = parseDate(fromDate);
          const u = parseDate(uptoDate);
          if (!d || !f || !u) return false;
          return d >= f && d <= u;
        };

        const purchases = purchaseRes.data.flatMap((purchase) =>
          purchase.items
            .filter(
              (item) =>
                item.sdisc?.trim().toLowerCase() === normalizedAhead &&
                isWithinDateRange(purchase.formData.date)
            )
            .map((item) => ({
              id: item.id,            // item number
              docId: purchase._id,    // Mongo document ID
              type: "purchase",
              date: new Date(purchase.formData.date),
              sdisc: purchase.supplierdetails?.[0]?.vacode || "",
              purRec: parseFloat(item.weight),
              sale: 0,
            }))
        );

        const sales = saleRes.data.flatMap((sale) =>
          sale.items
            .filter(
              (item) =>
                item.sdisc?.trim().toLowerCase() === normalizedAhead &&
                isWithinDateRange(sale.formData.date)
            )
            .map((item) => ({
              id: item.id,          // item number
              docId: sale._id,      // Mongo document ID
              type: "sale",
              date: new Date(sale.formData.date),
              sdisc: sale.customerDetails?.[0]?.vacode || "",
              purRec: 0,
              sale: parseFloat(item.weight),
            }))
        );

        setPurchaseItems(purchases);
        setSaleItems(sales);

        const merged = [...purchases, ...sales].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        let prevClosing = opening;
        const finalItems = merged.map((item) => {
          const opening = prevClosing;
          const closing = opening + item.purRec - item.sale;
          prevClosing = closing;
          return {
            ...item,
            date: new Date(item.date).toLocaleDateString("en-GB"),
            opening: opening.toFixed(2),
            closing: closing.toFixed(2),
            purRec: item.purRec.toFixed(2),
            sale: item.sale.toFixed(2),
          };
        });

        setItems(finalItems);
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchData();
  }, [selectedAhead, fromDate, uptoDate]); // 👈 Add these dependencies

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        setActiveRow((prev) => Math.min(prev + 1, items.length - 1));
      } 
      else if (e.key === "ArrowUp") {
        setActiveRow((prev) => Math.max(prev - 1, 0));
      }
      else if (e.key === "Enter") {
        const row = items[activeRow];
        if (!row) return;

        // 🔥 Navigation Logic
        if (row.type === "sale") {
          navigate("/sale", {
            state: {
              saleId: row.docId
            }
          });
        }
        else if (row.type === "purchase") {
          navigate("/purchase", {
            state: {
              purId: row.docId
            }
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, activeRow]);

  // Auto -scroll effect
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const rows = container.querySelectorAll("tbody tr");
    if (!rows.length) return;

    const idx = Math.max(0, Math.min(activeRow, rows.length - 1));
    const selectedRow = rows[idx];
    if (!selectedRow) return;

    // Adjust for header height (if your thead is sticky)
    const headerOffset = 40;  // Adjust if your header height is different
    const buffer = 25;        // Extra space above/below row

    const rowTop = selectedRow.offsetTop;
    const rowBottom = rowTop + selectedRow.offsetHeight;

    const containerHeight = container.clientHeight;
    const visibleTop = container.scrollTop + buffer + headerOffset;
    const visibleBottom = container.scrollTop + containerHeight - buffer;

    // If row is below visible area → scroll down
    if (rowBottom > visibleBottom) {
      const newScroll =
        rowBottom - containerHeight + buffer * 2;

      container.scrollTo({
        top: newScroll,
        behavior: "smooth",
      });
    }

    // If row is above visible area → scroll up
    else if (rowTop < visibleTop) {
      const newScroll =
        rowTop - headerOffset - buffer;

      container.scrollTo({
        top: newScroll,
        behavior: "smooth",
      });
    }
  }, [activeRow, items]);


  return (
    <div style={{ padding: "10px" }}>
      <Card className={styles.cardL}>
      <h1 className={styles.header}>STOCK REPORT</h1>
      <div className={styles.TopPart}>
        <div className={styles.Column}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <label htmlFor="aheadSelect">A/c Name:</label>
            <select
              className={styles.AcName}
              id="aheadSelect"
              value={selectedAhead}
              onChange={(e) => setSelectedAhead(e.target.value)}
            >
              <option value="">-- Select Ahead --</option>
              {aheads.map((ahead, index) => (
                <option key={index} value={ahead}>
                  {ahead}
                </option>
              ))}
            </select>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <text style={{ marginRight: "8px" }}>Options:</text>
            <select
              className={styles.options}
              id="reportTypeSelect"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="">-- Select Report Type --</option>
              <option value="record_active">Record Wise Active</option>
              <option value="record_all">Record Wise All</option>
              <option value="date_active">Date Wise Active</option>
              <option value="date_all">Date Wise All</option>
              <option value="Month Wise Display">Month Wise Display</option>
              <option value="Record Wise with Product Details">
                Record Wise with Product Details
              </option>
            </select>
          </div>
        </div>
        <div className={styles.Column}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <text style={{ marginRight: "8px" }}>From:</text>
              <InputMask
                mask="99/99/9999"
                placeholder="dd/mm/yyyy"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className={styles.From}
              />
            {/* <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              className={styles.From}
              dateFormat="dd/MM/yyyy"
            /> */}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: 5,
            }}
          >
            <text style={{ marginRight: "8px" }}>Upto:</text>
            <InputMask
              mask="99/99/9999"
              placeholder="dd/mm/yyyy"
              value={uptoDate}
              onChange={(e) => setUptoDate(e.target.value)}
              className={styles.Upto}
            />
            {/* <DatePicker
              selected={uptoDate}
              onChange={(date) => setUptoDate(date)}
              className={styles.Upto}
              dateFormat="dd/MM/yyyy"
            /> */}
          </div>
        </div>
        <div style={{marginLeft:"20px",marginTop:"auto"}}>
          <Button className="Buttonz" onClick={handleOpen}>Print</Button>
        </div>
        <div style={{ visibility: "hidden", width: 0, height: 0 }}>
          <StockRpPrint
            items={items}
            isOpen={open}
            handleClose={handleClose}
            selectedAhead={selectedAhead}
            fromDate={fromDate}
            uptoDate={uptoDate}
          />
        </div>
      </div>
        <div ref={tableContainerRef} className={styles.TableDIV}>
          <Table className="custom-table">
            <thead
              style={{
                background: "skyblue",
                textAlign: "center",
                position: "sticky",
                top: 0,
              }}
            >
              <tr style={{ color: "#575a5a" }}>
                <th>DATE</th>
                <th>DESCRIPTION</th>
                <th>OPENING</th>
                <th>PUR/REC.</th>
                <th>PRODUCTION</th>
                <th>ISSUE</th>
                <th>SALE</th>
                <th>CLOSING</th>
              </tr>
            </thead>
           <tbody style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}>
              {items.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: activeRow === index ? "#ffe08a" : "white",
                    fontWeight: activeRow === index ? "bold" : "normal",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onClick={() => setActiveRow(index)}
                >
                  <td className={styles.font} style={{ padding: "8px" }}>{item.date}</td>
                  <td className={styles.font} style={{ padding: "8px" }}>{item.sdisc}</td>
                  <td className={styles.font} style={{ padding: "8px", textAlign: "right" }}>{item.opening}</td>
                  <td className={styles.font} style={{ padding: "8px", textAlign: "right" }}>{item.purRec}</td>
                  <td className={styles.font} style={{ padding: "8px", textAlign: "right" }}>{item.production}</td>
                  <td className={styles.font} style={{ padding: "8px", textAlign: "right" }}>{item.issue}</td>
                  <td className={styles.font} style={{ padding: "8px", textAlign: "right" }}>{item.sale}</td>
                  <td className={styles.font} style={{ padding: "8px", textAlign: "right" }}>{item.closing}</td>
                </tr>
              ))}
           </tbody>

          </Table>
        </div>
    
      </Card>
    </div>
  );
};

export default StockReport;
