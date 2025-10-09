import React, { useState, useEffect } from "react";
import styles from "./StockReport.module.css";
import { Button, Card } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StockRpPrint from "./StockRpPrint";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const StockReport = () => {
  const tenant = "shkun_05062025_05062026"
  const [fromDate, setFromDate] = useState(new Date());
  const [uptoDate, setUptoDate] = useState(new Date());

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
          const d = new Date(date);
          return d >= fromDate && d <= uptoDate;
        };

        const purchases = purchaseRes.data.flatMap((purchase) =>
          purchase.items
            .filter(
              (item) =>
                item.sdisc?.trim().toLowerCase() === normalizedAhead &&
                isWithinDateRange(purchase.formData.date)
            )
            .map((item) => ({
              id: `purchase-${purchase.id}-${item.id}`,
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
              id: `sale-${sale.id}-${item.id}`,
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
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span className="spinner-border text-primary" role="status" />
          <span style={{ marginLeft: 10 }}>Loading...</span>
        </div>
      ) : (
        <div className={styles.TableDIV}>
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
            <tbody
              style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}
            >
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ padding: 0 }}>
                    <input
                      className={styles.font}
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                      }}
                      type="text"
                      value={item.date}
                      readOnly
                    />
                  </td>
                  <td style={{ padding: 0, width: 400 }}>
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
                      value={item.production} // Show raw value during input
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
                      value={item.issue} // Show raw value during input
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
                      value={item.closing}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      </Card>
    </div>
  );
};

export default StockReport;
