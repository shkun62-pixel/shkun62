import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import axios from "axios";
import InputMask from "react-input-mask";
import PWiseDetailPrint from "./PwiseDetailPrint";
import { useReactToPrint } from "react-to-print";
import useCompanySetup from "../../Shared/useCompanySetup";
import financialYear from "../../Shared/financialYear";

const tenant = "03AAYFG4472A1ZG_01042025_31032026";
const API_URL = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/purchase`;

export default function ProdWiseDetail({ show, onClose }) {
  const { companyName, companyAdd, companyCity } = useCompanySetup();
  // filters
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(formatDate(fy.start)); // converted
    setToDate(formatDate(fy.end)); // converted
  }, []);

  const [city, setCity] = useState("");
  const [reportType, setReportType] = useState("Without GST");
  const [stateName, setStateName] = useState("");
  const [minQty, setMinQty] = useState("");
  const [maxQty, setMaxQty] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [agent, setAgent] = useState("");
  const [taxType, setTaxType] = useState("All");
  const [lessDrCr, setLessDrCr] = useState(true);

  // Ledger selection modal state
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [ledgers, setLedgers] = useState([]); // All ledger names from API
  const [selectedLedgers, setSelectedLedgers] = useState([]); // Only checked
  const [ledgerSearch, setLedgerSearch] = useState(""); // Search input
  const [selectAll, setSelectAll] = useState(false); // Select All toggle

  // print modal
  const [printOpen, setPrintOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [groupedData, setGroupedData] = useState([]);

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
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

  function summarizeAccountProductWise(purchases) {
    const result = {};

    purchases.forEach(p => {
      const supplier = p.supplierdetails?.[0] || {};

      const accountCode = supplier.Vcode || "UNKNOWN";
      const account = supplier.vacode || "UNKNOWN";
      const city = supplier.city || p.formData?.city || "";

      if (!result[accountCode]) {
        result[accountCode] = {
          accountCode,
          account,
          city,
          products: {},
          totalBags: 0,
          totalQty: 0,
          totalValue: 0,
        };
      }

      p.items.forEach(item => {
        const productCode = item.vcode || "UNKNOWN";
        const product = item.sdisc || "UNKNOWN";

        if (!result[accountCode].products[productCode]) {
          result[accountCode].products[productCode] = {
            productCode,
            product,
            bags: 0,
            qty: 0,
            value: 0,
          };
        }

        const bags = Number(item.pkgs || 0);
        const qty = Number(item.weight || 0);
        const value =
          reportType === "Without GST"
            ? Number(item.amount || 0)
            : Number(item.vamt || 0);

        result[accountCode].products[productCode].bags += bags;
        result[accountCode].products[productCode].qty += qty;
        result[accountCode].products[productCode].value += value;

        result[accountCode].totalBags += bags;
        result[accountCode].totalQty += qty;
        result[accountCode].totalValue += value;
      });
    });

    return Object.values(result).map(acc => ({
      ...acc,
      products: Object.values(acc.products),
    }));
  }

  // OPEN PRINT MODAL
  const onOpenPrint = () => {
    // ❗ Stop if dates are empty or incomplete
    if (
      !fromDate ||
      fromDate.includes("_") ||
      !toDate ||
      toDate.includes("_")
    ) {
      alert("Please select both From and To dates.");
      return;
    }

    setFetching(true);

    axios
      .get(API_URL)
      .then((res) => {
        let data = res.data;

        // DATE FILTER
        let from = parseAnyDate(fromDate);
        let to = parseAnyDate(toDate);

        const isValid = (d) => d instanceof Date && !isNaN(d);

        if (isValid(from) && isValid(to)) {
          data = data.filter((p) => {
            const apiDate = parseAnyDate(p.formData?.date);
            if (!isValid(apiDate)) return false;
            return apiDate >= from && apiDate <= to;
          });
        }

        // FILTER BY LEDGERS IF SELECTED
        if (selectedLedgers.length > 0) {
          data = data
            .map(rec => ({
              ...rec,
              items: rec.items?.filter(item =>
                selectedLedgers.includes(String(item.vcode))
              )
            }))
            .filter(rec => rec.items && rec.items.length > 0);
        }

        // CITY FILTER
        if (city.trim() !== "") {
          data = data.filter((p) => {
            const apiCity =
              p.supplierdetails?.[0]?.city || p.formData?.city || "";
            return apiCity.toLowerCase().includes(city.toLowerCase());
          });
        }
        // STATE FILTER
        if (stateName.trim() !== "") {
          data = data.filter((p) => {
            const apiState =
              p.supplierdetails?.[0]?.state || p.formData?.state || "";
            return apiState.toLowerCase().includes(stateName.toLowerCase());
          });
        }
        // Agent FILTER
        if (agent.trim() !== "") {
          data = data.filter((p) =>
            p.formData?.broker?.toLowerCase().includes(agent.toLowerCase()),
          );
        }
        // Tax Type FILTER
        if (taxType !== "All") {
          data = data.filter((p) => p.formData?.stype === taxType);
        }

        // GROUP SUMMARY
        let summary = [];

        summary = summarizeAccountProductWise(data);

        // APPLY QTY / VALUE RANGE (same for all)
        if (minQty !== "")
          summary = summary.filter((r) => r.qty >= Number(minQty));
        if (maxQty !== "")
          summary = summary.filter((r) => r.qty <= Number(maxQty));
        if (minValue !== "")
          summary = summary.filter((r) => r.value >= Number(minValue));
        if (maxValue !== "")
          summary = summary.filter((r) => r.value <= Number(maxValue));

        setGroupedData(summary);
      })

      .catch(() => alert("Failed to load data"))

      .finally(() => {
        setFetching(false);
        setPrintOpen(true);
      });
  };

  useEffect(() => {
    axios.get(API_URL).then((res) => {
      if (Array.isArray(res.data)) {

        const list = res.data
          .flatMap(r =>
            (r.items || []).map(item => ({
              name: item.sdisc || "",
              code: item.vcode || ""
            }))
          )
          .filter(x => x.code !== "");

        const unique = [];
        const map = new Map();

        for (const item of list) {
          if (!map.has(item.code)) {
            map.set(item.code, true);
            unique.push(item);
          }
        }

        setLedgers(unique);
        setSelectedLedgers(unique.map(x => String(x.code)));
        setSelectAll(true);
      }
    });
  }, []);

  // Toggle single ledger
  function toggleLedger(code) {
    const strCode = String(code);

    setSelectedLedgers(prev =>
      prev.includes(strCode)
        ? prev.filter(x => x !== strCode)
        : [...prev, strCode]
    );
  }

  // helper: currently visible (filtered) ledgers based on search
  function getVisibleLedgers() {
    const q = (ledgerSearch || "").toLowerCase();
    return ledgers.filter(
      (x) =>
        x.name.toLowerCase().includes(q) ||
        (x.code + "").toLowerCase()().includes(q)
    );
  }

  // Select all
  function toggleSelectAll() {
    const visible = getVisibleLedgers();
    const visibleCodes = visible.map(x => String(x.code));

    const allVisibleSelected =
      visibleCodes.length > 0 &&
      visibleCodes.every(v => selectedLedgers.includes(v));

    if (allVisibleSelected) {
      setSelectedLedgers(prev =>
        prev.filter(v => !visibleCodes.includes(v))
      );
      setSelectAll(false);
    } else {
      setSelectedLedgers(prev => {
        const set = new Set(prev);
        visibleCodes.forEach(v => set.add(v));
        return Array.from(set);
      });
      setSelectAll(true);
    }
  }

  useEffect(() => {
    const visible = getVisibleLedgers();
    if (visible.length === 0) {
      setSelectAll(false);
      return;
    }

    const visibleCodes = visible.map(x => String(x.code));
    const allVisibleSelected = visibleCodes.every(v =>
      selectedLedgers.includes(v)
    );

    setSelectAll(allVisibleSelected);
  }, [ledgerSearch, ledgers, selectedLedgers]);

  return (
    <>
      {/* MAIN FILTER MODAL */}
      <Modal
        show={show}
        onHide={onClose}
        size="xl"
        centered
        backdrop="static"
        keyboard={true}
      >
        <Modal.Body style={{ background: "#f8f9fa" }}>
          <Form
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h4
              className="header"
              style={{ marginTop: 0, marginLeft: "35%", fontSize: "22px" }}
            >
              PRODUCT WISE REPORT PURCHASE
            </h4>

            {/* MAIN 2-COLUMN CONTAINER */}
            <div style={{ display: "flex", gap: "25px", marginTop: "5px" }}>
              {/* LEFT CONTAINER */}
              <div
                style={{
                  flex: 1,
                  background: "#f5f6f7",
                  padding: "20px",
                  borderRadius: "10px",
                }}
              >
                {/* FROM DATE ROW */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <label className="form-label" style={{ width: "120px" }}>
                    From Date
                  </label>
                  <InputMask
                    mask="99-99-9999"
                    placeholder="dd-mm-yyyy"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  >
                    {(inputProps) => (
                      <input {...inputProps} className="form-control" />
                    )}
                  </InputMask>
                </div>

                {/* TO DATE ROW */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <label className="form-label" style={{ width: "120px" }}>
                    To Date
                  </label>
                  <InputMask
                    mask="99-99-9999"
                    placeholder="dd-mm-yyyy"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  >
                    {(inputProps) => (
                      <input {...inputProps} className="form-control" />
                    )}
                  </InputMask>
                </div>

                {/* CITY ROW */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <label className="form-label" style={{ width: "120px" }}>
                    City
                  </label>
                  <Form.Control
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <label className="form-label" style={{ width: "120px" }}>
                    State
                  </label>
                  <Form.Control
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                  />
                </div>

                {/* AGENT */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <label className="form-label" style={{ width: "120px" }}>
                    Agent
                  </label>
                  <Form.Control
                    value={agent}
                    onChange={(e) => setAgent(e.target.value)}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
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

                {/* TAX TYPE */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "12px",
                  }}
                >
                  <label style={{}}>Tax Type</label>
                  <Form.Select
                    className="taxType"
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                  >
                    <option>All</option>
                    <option value="GST Sale (RD)">GST Sale (RD)</option>
                    <option value="IGST Sale (RD)">IGST Sale (RD)</option>
                    <option value="GST (URD)">GST (URD)</option>
                    <option value="IGST (URD)">IGST (URD)</option>
                    <option value="Tax Free Within State">
                      Tax Free Within State
                    </option>
                    <option value="Tax Free Interstate">
                      Tax Free Interstate
                    </option>
                    <option value="Export Sale">Export Sale</option>
                    <option value="Export Sale(IGST)">Export Sale(IGST)</option>
                    <option value="Including GST">Including GST</option>
                    <option value="Including IGST">Including IGST</option>
                    <option value="Not Applicable">Not Applicable</option>
                    <option value="Exempted Sale">Exempted Sale</option>
                  </Form.Select>
                </div>
                {/* LESS DR/CR */}
                <div className="form-check mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={lessDrCr}
                    onChange={(e) => setLessDrCr(e.target.checked)}
                  />
                  <label className="form-check-label">Less Dr/Cr Note</label>
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
                <div style={rowStyle}>
                  <label style={labelStyle}>Min Qty</label>
                  <Form.Control
                    value={minQty}
                    onChange={(e) => setMinQty(e.target.value)}
                  />
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>Max Qty</label>
                  <Form.Control
                    value={maxQty}
                    onChange={(e) => setMaxQty(e.target.value)}
                  />
                </div>

                {/* Min Max Value */}
                <div style={rowStyle}>
                  <label style={labelStyle}>Min Value</label>
                  <Form.Control
                    value={minValue}
                    onChange={(e) => setMinValue(e.target.value)}
                  />
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>Max Value</label>
                  <Form.Control
                    value={maxValue}
                    onChange={(e) => setMaxValue(e.target.value)}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "25px",
                  }}
                >
                  <Button
                    variant="outline-secondary"
                    onClick={() => setLedgerModalOpen(true)}
                  >
                    Select Stock Accounts
                  </Button>
                  <Button variant="primary" onClick={onOpenPrint}>
                    PRINT
                  </Button>
                  <Button variant="secondary" onClick={onClose}>
                    EXIT
                  </Button>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
          </Form>
        </Modal.Body>
      </Modal>

      {/* PRINT PREVIEW MODAL */}
      <Modal
        show={printOpen}
        onHide={() => setPrintOpen(false)}
        fullscreen
        className="custom-modal"
        style={{ marginTop: 20, overflow: "auto" }}
        backdrop="static"
        keyboard={true}
      >
        <Modal.Body
          style={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}
        >
          {fetching ? (
            <div style={{ overflow: "auto" }} className="text-center">
              Loading...
            </div>
          ) : (
            <PWiseDetailPrint
              ref={printRef}
              rows={groupedData}
              fromDate={fromDate}
              toDate={toDate}
              companyName={companyName}
              companyAdd={companyAdd}
              companyCity={companyCity}
              tittle={"PRODUCT WISE DETAIL PURCHASE"}
            />
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={handlePrint}>
            PRINT
          </Button>
          <Button variant="secondary" onClick={() => setPrintOpen(false)}>
            CLOSE
          </Button>
        </Modal.Footer>
      </Modal>

      {/* LEDGER SELECTION MODAL */}
      <Modal
        show={ledgerModalOpen}
        onHide={() => setLedgerModalOpen(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Stock Accounts</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* LEDGER TABLE */}
          <div
            style={{
              maxHeight: "350px",
              overflowY: "auto",
              padding: "10px",
            }}
          >
            <Table className="custom-table" size="sm">
              <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr>
                  <th style={{ width: "50px", textAlign: "center" }}>Select</th>
                  <th>Account Name</th>
                  <th>Ac Code</th>
                </tr>
              </thead>

              <tbody>
                {ledgers
                  .filter(
                    (x) =>
                      x.name.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
                      x.code.toLowerCase().includes(ledgerSearch.toLowerCase())
                  )
                  .map((x, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={selectedLedgers.includes(String(x.code))}
                          onChange={() => toggleLedger(String(x.code))}
                        />
                      </td>
                      <td>{x.name}</td>
                      <td>{x.code}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>

        <Modal.Footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* SEARCH BAR ON LEFT */}
          <input
            type="text"
            className="form-control"
            placeholder="Search ledger..."
            style={{ width: "300px" }}
            value={ledgerSearch}
            onChange={(e) => setLedgerSearch(e.target.value)}
          />

          {/* BUTTONS ON RIGHT */}
          <div>
            <Button
              variant={selectAll ? "warning" : "success"}
              onClick={toggleSelectAll}
            >
              {selectAll ? "Unselect All" : "Select All"}
            </Button>{" "}
            <Button
              variant="secondary"
              onClick={() => setLedgerModalOpen(false)}
            >
              Close
            </Button>{" "}
            <Button variant="primary" onClick={() => setLedgerModalOpen(false)}>
              Apply
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const rowStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "10px",
};

const labelStyle = {
  width: "120px",
  fontWeight: "600",
};
