import React, { useState, useEffect, useRef } from "react";
import styles from "./StockReport.module.css";
import { Button, Card } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StockSummPrint from "./StockSummPrint";
import { useNavigate } from "react-router-dom";

const StockSummary = () => {

  const navigate = useNavigate();

const handleRowKeyDown = (e, sdisc) => {
  if (e.key === "Enter") {
    navigate("/StockReport", {
      state: { selectedAhead: sdisc }
    });
  }
};

  const [fromDate, setFromDate] = useState(new Date());
  const [uptoDate, setUptoDate] = useState(new Date());

  const [items, setItems] = useState([
    {
      id: 1,
      date: "",
      sdisc: "",
      pcsOp: "",
      opening: "",
      pcsPur: "",
      purRec: "",
      pcsSale: "",
      sale: "",
      pcsClosing: "",
      closing: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [aheads, setAheads] = useState([]);
  const [selectedAhead, setSelectedAhead] = useState("");
  const [openingWeight, setOpeningWeight] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Active Row 
  const tableContainerRef = useRef(null);
  const [activeRow, setActiveRow] = useState(0);

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
    const fetchData = async () => {
      try {
        setLoading(true);
        setItems([]);
        setOpeningWeight(0);

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

        const isWithinDateRange = (date) => {
          const d = new Date(date);
          return d >= fromDate && d <= uptoDate;
        };

        const allItems = [];

        for (const ahead of aheads) {
          const normalizedAhead = ahead.trim().toLowerCase();

          const matchingStock = stockMasterRes.data.data.find(
            (item) =>
              item.formData?.Aheads?.trim().toLowerCase() === normalizedAhead
          );
          const opening = parseFloat(matchingStock?.formData?.openwts || 0);

          const purchases = purchaseRes.data.flatMap((purchase) =>
            purchase.items
              .filter(
                (item) =>
                  item.sdisc?.trim().toLowerCase() === normalizedAhead &&
                  isWithinDateRange(purchase.formData.date)
              )
              .map((item) => ({
                date: parseDate(purchase.formData.date),
                // date: new Date(purchase.formData.date),
                sdisc: purchase.supplierdetails?.[0]?.vacode || "",
                purRec: parseFloat(item.weight),
                pcsPur: parseFloat(item.pkgs || 0), // ADDED
                sale: 0,
                pcsSale: 0,
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
                date: new Date(sale.formData.date),
                sdisc: sale.customerDetails?.[0]?.vacode || "",
                purRec: 0,
                pcsPur: 0,
                sale: parseFloat(item.weight),
                pcsSale: parseFloat(item.pkgs || 0), // ADDED
              }))
          );

          const merged = [...purchases, ...sales].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          );

          let prevClosing = opening;
          let totalPurRec = 0;
          let totalSale = 0;

          // NEW for PKGS
          let pcsOpening = parseFloat(matchingStock?.formData?.openpcs || 0);
          let pcsClosing = pcsOpening;
          let totalPcsPur = 0;
          let totalPcsSale = 0;

          merged.forEach((item) => {
            const purRec = item.purRec || 0;
            const sale = item.sale || 0;
            const pcsPur = item.pcsPur || 0;
            const pcsSale = item.pcsSale || 0;

            prevClosing += purRec - sale;
            pcsClosing += pcsPur - pcsSale;

            totalPurRec += purRec;
            totalSale += sale;
            totalPcsPur += pcsPur;
            totalPcsSale += pcsSale;
          });

          allItems.push({
            id: `ahead-${normalizedAhead}`,
            date: "",
            sdisc: ahead,
            pcsOp: pcsOpening.toFixed(2),
            opening: opening.toFixed(2),
            pcsPur: totalPcsPur.toFixed(2),
            purRec: totalPurRec.toFixed(2),
            pcsSale: totalPcsSale.toFixed(2),
            sale: totalSale.toFixed(2),
            pcsClosing: pcsClosing.toFixed(2),
            closing: prevClosing.toFixed(2),
          });
        }

        setItems(allItems);
      } catch (err) {
        console.error("Error loading data", err);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    if (aheads.length > 0) {
      fetchData();
    }
  }, [aheads, fromDate, uptoDate]);

  useEffect(() => {
    const fetchInitialAfromDate = async () => {
      try {
        const res = await axios.get(
          "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/company"
        );
  
        // Choose which company to use for fromDate initialization
        // Example: use the first one, or filter by some known Ahead
        const matchingCompany = res.data[0]; // 👈 You can adjust this logic
  
        if (matchingCompany?.formData?.Afrom) {
          const afromDate = new Date(matchingCompany.formData.Afrom);
          if (!isNaN(afromDate.getTime())) {
            setFromDate(afromDate);
          }
        }
      } catch (e) {
        console.error("Error fetching initial Afrom date:", e);
      }
    };
  
    fetchInitialAfromDate(); // Run once when component mounts
  }, []);

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
          const selectedItem = items[activeRow];
           // ✅ SAVE ACTIVE ROW INDEX
          sessionStorage.setItem("stock_activeRow1", activeRow);
          if (selectedItem) {
            navigate("/StockReport", {
              state: { selectedAhead: selectedItem.sdisc }
            });
          }  
      }};
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }, [items, activeRow]);
  
    useEffect(() => {
      const savedRow = sessionStorage.getItem("stock_activeRow1");
  
      if (savedRow !== null) {
        const index = parseInt(savedRow, 10);
        if (!isNaN(index)) {
          setActiveRow(index);
        }
      }
    }, []);
  
    useEffect(() => {
      const savedRow = sessionStorage.getItem("stock_activeRow1");
  
      if (savedRow !== null && items.length > 0) {
        const index = Math.min(
          parseInt(savedRow, 10),
          items.length - 1
        );
        setActiveRow(index);
      }
    }, [items]);
  
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
    <div style={{padding:"10px"}}>
      <Card className={styles.cardL}>
      <h1 className={styles.header}>STOCK SUMMARY</h1>
      <div className={styles.TopPart}>
        <div className={styles.Column}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <text style={{ marginRight: "8px" }}>From:</text>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              className={styles.From}
              dateFormat="dd/MM/yyyy"
            />
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
            <DatePicker
              selected={uptoDate}
              onChange={(date) => setUptoDate(date)}
              className={styles.Upto}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
        <div style={{ marginTop:"auto",marginLeft:"20px" }}>
          <Button className="Buttonz" onClick={handleOpen}>Print</Button>
        </div>
        <div style={{ visibility: "hidden", width: 0, height: 0 }}>
          <StockSummPrint
            items={items}
            isOpen={open}
            handleClose={handleClose}
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
                <th style={{ minWidth: "400px" }}>ACCOUNT NAME</th>
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
            <tbody
              style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}
            >
              {items.map((item, index) => (
                  <tr
                  key={item.id}
                  style={{
                    backgroundColor: activeRow === index ? "#ffe08a" : "white",
                    fontWeight: activeRow === index ? "bold" : "normal",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  tabIndex={0}        // ⭐ REQUIRED for key events
                  onKeyDown={(e) => handleRowKeyDown(e, item.sdisc)}
                  onClick={() => setActiveRow(index)}
                >
                  <td style={{ padding: 5, minWidth: "400px" }} className={styles.font}>
  {item.sdisc}
</td>

<td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
  {item.pcsOp}
</td>

<td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
  {item.opening}
</td>

<td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
  {item.pcsPur}
</td>

<td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
  {item.purRec}
</td>

<td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
  {item.pcsSale}
</td>

<td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
  {item.sale}
</td>

<td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
  {item.pcsClosing}
</td>

<td style={{ padding: 5, textAlign: "right" }} className={styles.font}>
  {item.closing}
</td>

                  {/* <td style={{ padding: 0, minWidth: "400px" }}>
                    <input
                      className={styles.font}
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                      }}
                      maxLength={48}
                      value={item.sdisc}
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      className={styles.font}
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      value={item.pcsOp}
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      className={styles.font}
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      value={item.opening}
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      className={styles.font}
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      value={item.pcsPur}
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      className={styles.font}
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      value={item.purRec} // Show raw value during input
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      className={styles.font}
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      value={item.pcsSale}
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      className={styles.font}
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      maxLength={48}
                      value={item.sale}
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      className={styles.font}
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      value={item.pcsClosing}
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      className={styles.font}
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      value={item.closing}
                    />
                  </td> */}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
    
      </Card>
    </div>
  );
};

export default StockSummary;
