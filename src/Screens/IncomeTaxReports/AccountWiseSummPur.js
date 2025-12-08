import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import InputMask from "react-input-mask";
import AccountWisePrint from "./AccountWisePrint";
import { useReactToPrint } from "react-to-print";

const API_URL =
  "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase";

export default function AccountWiseSummPur({ show, onClose }) {

  // filters
  const [fromDate, setFromDate] = useState("01-04-2025");
  const [toDate, setToDate] = useState("31-03-2026");
  const [city, setCity] = useState("");
  const [summaryType, setSummaryType] = useState("account");
  const [reportType, setReportType] = useState("With GST");

  // print modal
  const [printOpen, setPrintOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [groupedData, setGroupedData] = useState([]);

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  });

  function parseAnyDate(dateStr) {
    if (!dateStr) return null;

    // 1️⃣ dd/mm/yyyy
    if (dateStr.includes("/")) {
      const [d, m, y] = dateStr.split("/");
      return new Date(`${y}-${m}-${d}`);
    }

    // 2️⃣ dd-mm-yyyy
    if (dateStr.includes("-")) {
      const [a, b, c] = dateStr.split("-");

      // Check if first part is day or year
      // dd-mm-yyyy → a.length == 2
      // yyyy-mm-dd → a.length == 4
      if (a.length === 2) {
        const [d, m, y] = [a, b, c];
        return new Date(`${y}-${m}-${d}`);
      } else if (a.length === 4) {
        // yyyy-mm-dd
        return new Date(`${a}-${b}-${c}`);
      }
    }

    // 3️⃣ ISO (auto handled by JS)
    const auto = new Date(dateStr);
    if (!isNaN(auto)) return auto;

    return null; // invalid format
  }

  // group into single row per account
  function summarizeByAccount(purchases) {
    const result = {};

    purchases.forEach((p) => {
      p.items.forEach((item) => {
        const acc = item.Pcodess;

        if (!result[acc]) {
          result[acc] = {
            account: acc,
            city: p.formData.city || "",
            bags: 0,
            qty: 0,
            value: 0,
          };
        }

        result[acc].bags += Number(item.pkgs || 0);
        result[acc].qty += Number(item.weight || 0);
        if(reportType === "Without GST"){
          result[acc].value += Number(item.amount || 0);
        } else{
          result[acc].value += Number(item.vamt || 0);
        }
        
      });
    });

    return Object.values(result).map((r) => ({
      ...r,
      avg: r.qty > 0 ? r.value / r.qty : 0,
    }));
  }

  // OPEN PRINT MODAL
  const onOpenPrint = () => {

    // ❗ Stop if dates are empty or incomplete
    if (!fromDate || fromDate.includes("_") || !toDate || toDate.includes("_")) {
      alert("Please select both From and To dates.");
      return;
    }

    setFetching(true);

    axios.get(API_URL)
      .then(res => {

        let data = res.data;

      // DATE FILTER
      let from = parseAnyDate(fromDate);
      let to   = parseAnyDate(toDate);

      const isValid = (d) => d instanceof Date && !isNaN(d);

      if (isValid(from) && isValid(to)) {
        data = data.filter(p => {
          const apiDate = parseAnyDate(p.formData?.date);
          if (!isValid(apiDate)) return false;
          return apiDate >= from && apiDate <= to;
        });
      }

        // CITY FILTER
        if (city.trim() !== "") {
          data = data.filter(p => {
            const apiCity =
              p.supplierdetails?.[0]?.city ||
              p.formData?.city ||
              "";
            return apiCity.toLowerCase().includes(city.toLowerCase());
          });
        }

        // GROUP SUMMARY
        const summary = summarizeByAccount(data);
        setGroupedData(summary);
      })

      .catch(() => alert("Failed to load data"))

      .finally(() => {
        setFetching(false);
        setPrintOpen(true);
      });
  };

  return (
    <>
    {/* MAIN FILTER MODAL */}
    <Modal show={show} onHide={onClose} size="xl" centered>
      <Modal.Body style={{ padding: "30px", background: "#f8f9fa" }}>

        <h4
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: 600,
          }}
        >
          Account Wise Purchase Summary
        </h4>

        <Form
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "12px",
            boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
          }}
        >

          {/* MAIN 2-COLUMN CONTAINER */}
          <div style={{ display: "flex", gap: "25px" }}>

            {/* LEFT CONTAINER */}
            <div
              style={{
                flex: 1,
                background: "#f5f6f7",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <h5 style={{ marginBottom: "18px", fontWeight: 600 }}>Filters</h5>

              {/* FROM DATE ROW */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <label className="form-label" style={{ width: "120px" }}>From Date</label>
                <InputMask
                  mask="99-99-9999"
                  placeholder="dd-mm-yyyy"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                >
                  {(inputProps) => <input {...inputProps} className="form-control" />}
                </InputMask>
              </div>

              {/* TO DATE ROW */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <label className="form-label" style={{ width: "120px"}}>To Date</label>
                <InputMask
                  mask="99-99-9999"
                  placeholder="dd-mm-yyyy"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                >
                  {(inputProps) => <input {...inputProps} className="form-control" />}
                </InputMask>
              </div>

              {/* CITY ROW */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <label className="form-label" style={{ width: "120px" }}>City</label>
                <Form.Control
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              
              <div style={{ display: "flex", alignItems: "center" }}>
              <label className="form-label">Report Type</label>
              <Form.Select
                className="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option>With GST</option>
                <option>Without GST</option>
              </Form.Select>
              </div>

            </div>

            {/* RIGHT CONTAINER */}
            <div
              style={{
                flex: 1,
                background: "#f5f6f7",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <h5 style={{ marginBottom: "15px", fontWeight: 600 }}>Summary Type</h5>

              <div className="form-check mb-3">
                <input
                  type="radio"
                  className="form-check-input"
                  name="summaryType"
                  value="account"
                  checked={summaryType === "account"}
                  onChange={(e) => setSummaryType(e.target.value)}
                />
                <label className="form-check-label">Account Wise</label>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "25px",
            }}
          >
            <Button variant="primary" onClick={onOpenPrint}>
              Print
            </Button>
            <Button variant="secondary" onClick={onClose}>
              Exit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>

    {/* PRINT PREVIEW MODAL */}
    <Modal
      show={printOpen}
      onHide={() => setPrintOpen(false)}
      size="xl"
      centered
    >
      <Modal.Body>
        {fetching ? (
          <div className="text-center">Loading...</div>
        ) : (
          <AccountWisePrint
            ref={printRef}
            rows={groupedData}
            fromDate={fromDate}
            toDate={toDate}
          />
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setPrintOpen(false)}>Close</Button>
        <Button variant="primary" onClick={handlePrint}>Send to Printer</Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}

