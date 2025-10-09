import React, { useState, useEffect } from "react";
import styles from "./StockReport.module.css";
import { Button, Card } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import StockSummPrint from "./StockSummPrint";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const StockSummary = () => {
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
                date: new Date(purchase.formData.date),
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
      {loading ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <span className="spinner-border text-primary" role="status" />
          <span style={{ marginLeft: 10 }}>Loading...</span>
        </div>
      ) : (
        <div className="tablediv">
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
                <tr key={item.id}>
                  <td style={{ padding: 0, minWidth: "400px" }}>
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

export default StockSummary;
