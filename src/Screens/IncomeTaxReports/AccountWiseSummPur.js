import React, { useState, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import InputMask from "react-input-mask";
import AccountWisePrint from "./AccountWisePrint";
import { useReactToPrint } from "react-to-print";

const API_URL =
  "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase";

export default function AccountWiseSummPur({ show, onClose }) {
  // filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
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

  function parseDMY(dateStr) {
    if (!dateStr) return null;

    const [day, month, year] = dateStr.split("/").map(Number);
    // month - 1 because JS months start from 0
    return new Date(year, month - 1, day);
  }

  function parseInputDate(dateStr) {
    if (!dateStr || dateStr.includes("_")) return null;
    const [d, m, y] = dateStr.split("-");
    return new Date(`${y}-${m}-${d}`);
  }

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

  // const onOpenPrint = () => {
  //   setFetching(true);

  //   axios.get(API_URL)
  //     .then(res => {
  //       const summary = summarizeByAccount(res.data);
  //       setGroupedData(summary);
  //     })
  //     .catch(() => alert("Failed to load data"))
  //     .finally(() => {
  //       setFetching(false);
  //       setPrintOpen(true);
  //     });
  // };

  return (
    <>
      {/* MAIN FILTER MODAL */}
      <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Body style={{ padding: "30px", background: "#f8f9fa" }}>

        {/* TITLE */}
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
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >

          {/* FROM DATE */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="form-label">From Date</label>
            <InputMask
              mask="99-99-9999"
              placeholder="dd-mm-yyyy"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            >
              {(inputProps) => <input {...inputProps} className="form-control" />}
            </InputMask>
          </div>

          {/* TO DATE */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="form-label">To Date</label>
            <InputMask
              mask="99-99-9999"
              placeholder="dd-mm-yyyy"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            >
              {(inputProps) => <input {...inputProps} className="form-control" />}
            </InputMask>
          </div>

          {/* CITY */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label className="form-label">City</label>
            <Form.Control
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <hr />

          {/* SUMMARY TYPE */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontWeight: 600 }}>Summary Type</label>

            <div className="form-check">
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

            <Form.Select
              className="reportType"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ maxWidth: "100%" }}
            >
              <option>With GST</option>
              <option>Without GST</option>
            </Form.Select>
          </div>

          {/* BUTTONS */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "10px",
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

      {/* <Modal show={show} onHide={onClose} size="xl" centered>
        <Modal.Body>
          <h4 style={{ textAlign: "center" }}>Account Wise Purchase Summary</h4>

          <Form>

      
            <div style={{ display: "flex", gap: "20px" }}>

              <div>
                <label>From</label>
                <InputMask
                  mask="99-99-9999"
                  placeholder="dd-mm-yyyy"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                >
                  {(inputProps) => <input {...inputProps} className="form-control" />}
                </InputMask>
              </div>

              <div>
                <label>To</label>
                <InputMask
                  mask="99-99-9999"
                  placeholder="dd-mm-yyyy"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                >
                  {(inputProps) => <input {...inputProps} className="form-control" />}
                </InputMask>
              </div>

              <div>
                <label>City</label>
                <Form.Control
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>

            </div>

            <br />

          
            <div>
              <strong>Select Summary Type</strong>
              <div className="form-check">
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
              <Form.Select
                className="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option>With GST</option>
                <option>Without GST</option>
              </Form.Select>
            </div>

            <br />

      
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button variant="primary" onClick={onOpenPrint}>Print</Button>
              <Button variant="secondary" onClick={onClose}>Exit</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal> */}

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

