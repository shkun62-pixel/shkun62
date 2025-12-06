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

  // print modal
  const [printOpen, setPrintOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [groupedData, setGroupedData] = useState([]);

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current
  });

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
        result[acc].value += Number(item.amount || 0);
      });
    });

    return Object.values(result).map((r) => ({
      ...r,
      avg: r.qty > 0 ? r.value / r.qty : 0,
    }));
  }

  // OPEN PRINT MODAL
  const onOpenPrint = () => {
    setFetching(true);

    axios.get(API_URL)
      .then(res => {
        const summary = summarizeByAccount(res.data);
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
        <Modal.Body>
          <h4 style={{ textAlign: "center" }}>Account Wise Purchase Summary</h4>

          <Form>

            {/* DATE FILTERS */}
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

            {/* SUMMARY TYPE */}
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
            </div>

            <br />

            {/* BUTTONS */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button variant="primary" onClick={onOpenPrint}>Print</Button>
              <Button variant="secondary" onClick={onClose}>Exit</Button>
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

