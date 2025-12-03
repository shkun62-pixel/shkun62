// // PurchaseSummaryModal.jsx
// import React, { useEffect, useState, useRef } from "react";
// import { Modal, Button, Spinner } from "react-bootstrap";
// import axios from "axios";
// import { useReactToPrint } from "react-to-print";
// import PurSummPrint from "./PurSummPrint";

// const API_URL = "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase";

// export default function PurchaseSummaryModal({ show, onClose }) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [rawData, setRawData] = useState([]);
//   const [grouped, setGrouped] = useState([]);
//   const [printModalOpen, setPrintModalOpen] = useState(false);

//   // date range - you can expose these as props or form controls
//   const [periodFrom] = useState("01-04-2025");
//   const [periodTo] = useState("30-03-2026");

//   // ref to printed content
//   const printRef = useRef();

//   // react-to-print hook
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: "Purchase Summary",
//   });

//   useEffect(() => {
//     if (!show) return;
//     fetchData();
//   }, [show]);

//   async function fetchData() {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(API_URL);
//       // expect res.data is an array
//       const data = Array.isArray(res.data) ? res.data : [];
//       setRawData(data);
//       const groupedData = groupBySupplier(data);
//       setGrouped(groupedData);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch data. Check console for details.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   /**
//    * Groups API response by supplier name (supplierdetails[0].vacode)
//    * Returns array of:
//    * { supplierName, city, pan, bags, qty, value }
//    */
//   function groupBySupplier(apiArray = []) {
//     const map = new Map();

//     apiArray.forEach((rec) => {
//       const supplier = (rec.supplierdetails && rec.supplierdetails[0]) || {};
//       const supplierName = (supplier.vacode || "Unknown Supplier").trim();
//       const city = supplier.city || "";
//       const pan = supplier.pan || supplier.pan || supplier.pan || "";

//       // items may be array with numeric strings
//       const items = Array.isArray(rec.items) ? rec.items : [];

//       // sum item fields
//       const itemSums = items.reduce(
//         (acc, it) => {
//           const pkgs = parseFloat(it.pkgs) || 0;
//           const weight = parseFloat(it.weight) || 0;
//           const amount = parseFloat(it.amount) || 0;
//           acc.bags += pkgs;
//           acc.qty += weight;
//           acc.value += amount;
//           return acc;
//         },
//         { bags: 0, qty: 0, value: 0 }
//       );

//       if (!map.has(supplierName)) {
//         map.set(supplierName, {
//           supplierName,
//           city,
//           pan,
//           bags: itemSums.bags,
//           qty: itemSums.qty,
//           value: itemSums.value,
//         });
//       } else {
//         const existing = map.get(supplierName);
//         existing.bags += itemSums.bags;
//         existing.qty += itemSums.qty;
//         existing.value += itemSums.value;
//       }
//     });

//     // convert to array preserving insertion order
//     return Array.from(map.values());
//   }

//   return (
//     <>
//       <Modal show={show} onHide={onClose} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Purchase Summary Party V</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {loading ? (
//             <div className="text-center my-4">
//               <Spinner animation="border" /> <div>Loading...</div>
//             </div>
//           ) : error ? (
//             <div className="alert alert-danger">{error}</div>
//           ) : (
//             <>
//               <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
//                 <div>
//                   <div><strong>From</strong>: {periodFrom}</div>
//                   <div><strong>Upto</strong>: {periodTo}</div>
//                 </div>
//                 <div style={{ textAlign: "right" }}>
//                   <div><strong>Grouped Suppliers</strong>: {grouped.length}</div>
//                   <div style={{ fontSize: 12, color: "#666" }}>Data loaded: {rawData.length} records</div>
//                 </div>
//               </div>

//               <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #ddd", padding: 8 }}>
//                 <table className="table table-sm table-bordered mb-0">
//                   <thead className="table-light">
//                     <tr>
//                       <th>Account Name</th>
//                       <th>City</th>
//                       <th>PAN</th>
//                       <th style={{ textAlign: "right" }}>Bags</th>
//                       <th style={{ textAlign: "right" }}>Qty</th>
//                       <th style={{ textAlign: "right" }}>Value</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {grouped.map((g, i) => (
//                       <tr key={i}>
//                         <td>{g.supplierName}</td>
//                         <td>{g.city}</td>
//                         <td>{g.pan}</td>
//                         <td style={{ textAlign: "right" }}>{Number(g.bags || 0).toFixed(3)}</td>
//                         <td style={{ textAlign: "right" }}>{Number(g.qty || 0).toFixed(3)}</td>
//                         <td style={{ textAlign: "right" }}>{Number(g.value || 0).toFixed(2)}</td>
//                       </tr>
//                     ))}
//                     {grouped.length === 0 && (
//                       <tr>
//                         <td colSpan={6} className="text-center">No data to display</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={onClose}>Exit</Button>
//           <Button
//             variant="primary"
//             disabled={loading || grouped.length === 0}
//             onClick={() => setPrintModalOpen(true)}
//           >
//             Print
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* Print Preview Modal */}
//       <Modal
//         show={printModalOpen}
//         onHide={() => setPrintModalOpen(false)}
//         size="xl"
//         dialogClassName="modal-90w"
//         aria-labelledby="print-preview-modal"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title id="print-preview-modal">Print Preview - Purchase Summary</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {/* The print content is the PurchaseSummaryPrintModalContent component.
//               We keep it in the DOM (not unmounted) so react-to-print can access it. */}
//           <div>
//             <PurSummPrint
//               ref={printRef}
//               groupedData={grouped}
//               periodFrom={periodFrom}
//               periodTo={periodTo}
//               companyInfo={{ name: "STARKS PVT LTD.", addressLine1: "WINTER FELL", addressLine2: "NORTH" }}
//             />
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setPrintModalOpen(false)}>Close</Button>
//           <Button variant="primary" onClick={handlePrint}>Send to Printer</Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }

// // PurchaseSummaryModal.jsx
// import React, { useState, useRef } from "react";
// import { Modal, Button, Form, Row, Col } from "react-bootstrap";
// import axios from "axios";
// import { useReactToPrint } from "react-to-print";
// import PurSummPrint from "./PurSummPrint";

// const API_URL = "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase";

// export default function PurchaseSummaryModal({ show, onClose }) {
//   // form state
//   const [fromDate, setFromDate] = useState("2025-04-01");
//   const [toDate, setToDate] = useState("2026-03-30");
//   const [city, setCity] = useState("");
//   const [stateName, setStateName] = useState("");
//   const [isB2B, setIsB2B] = useState(false);
//   const [reportType, setReportType] = useState("With GST");
//   const [fullAddress, setFullAddress] = useState("Yes");
//   const [taxType, setTaxType] = useState("All");
//   const [orderBy, setOrderBy] = useState("");
//   const [minQty, setMinQty] = useState("");
//   const [maxQty, setMaxQty] = useState("");
//   const [minValue, setMinValue] = useState("");
//   const [maxValue, setMaxValue] = useState("");
//   const [lessDrCrNote, setLessDrCrNote] = useState(false);

//   // Print preview modal state
//   const [printOpen, setPrintOpen] = useState(false);
//   const [fetching, setFetching] = useState(false);
//   const [groupedData, setGroupedData] = useState([]);
//   const [error, setError] = useState("");

//   // ref for react-to-print
//   const printRef = useRef();
//   const handlePrint = useReactToPrint({
//     content: () => printRef.current,
//     documentTitle: "Purchase Summary",
//   });

//   // Called when user clicks Print on main modal
//   async function onOpenPrint() {
//     setError("");
//     setFetching(true);
//     setPrintOpen(true); // open modal immediately (user sees spinner)
//     try {
//       // fetch API (you can attach filter params if your backend supports them)
//       const params = {
//         from: fromDate,
//         to: toDate,
//         city,
//         state: stateName,
//         reportType,
//         taxType,
//         orderBy,
//         isB2B,
//       };

//       // Example: axios.get(API_URL, { params }) — server must accept these params.
//       const res = await axios.get(API_URL);
//       const arr = Array.isArray(res.data) ? res.data : [];

//       const grouped = groupBySupplier(arr, { minQty, maxQty, minValue, maxValue });
//       setGroupedData(grouped);
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch purchase data. Check console.");
//     } finally {
//       setFetching(false);
//     }
//   }

//   /**
//    * Grouping function:
//    * - groups by supplierdetails[0].vacode
//    * - sums pkgs -> bags, weight -> qty, amount -> value
//    * - filters by min/max qty/value (if provided)
//    */
//   function groupBySupplier(apiArray = [], filters = {}) {
//     const map = new Map();

//     apiArray.forEach((rec) => {
//       const supplier = (rec.supplierdetails && rec.supplierdetails[0]) || {};
//       const name = (supplier.vacode || "Unknown Supplier").trim();
//       const city = supplier.city || "";
//       const pan = supplier.pan || supplier.pan || supplier.pan || "";

//       const items = Array.isArray(rec.items) ? rec.items : [];

//       const sums = items.reduce(
//         (acc, it) => {
//           const pkgs = parseFloat(it.pkgs) || 0;
//           const weight = parseFloat(it.weight) || 0;
//           const amount = parseFloat(it.amount) || 0;
//           acc.bags += pkgs;
//           acc.qty += weight;
//           acc.value += amount;
//           return acc;
//         },
//         { bags: 0, qty: 0, value: 0 }
//       );

//       // apply min/max filters if provided (filter after summing)
//       const { minQty, maxQty, minValue, maxValue } = filters;
//       if (minQty && sums.qty < parseFloat(minQty)) return;
//       if (maxQty && sums.qty > parseFloat(maxQty)) return;
//       if (minValue && sums.value < parseFloat(minValue)) return;
//       if (maxValue && sums.value > parseFloat(maxValue)) return;

//       if (!map.has(name)) {
//         map.set(name, { supplierName: name, city, pan, bags: sums.bags, qty: sums.qty, value: sums.value });
//       } else {
//         const ex = map.get(name);
//         ex.bags += sums.bags;
//         ex.qty += sums.qty;
//         ex.value += sums.value;
//       }
//     });

//     return Array.from(map.values());
//   }

//   // small helpers
//   function handleCloseAll() {
//     setPrintOpen(false);
//     onClose && onClose();
//   }

//   return (
//     <>
//       <Modal show={show} onHide={onClose} size="lg" centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Purchase Summary Party V</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Row>
//               <Col md={3}>
//                 <Form.Group className="mb-2">
//                   <Form.Label>From</Form.Label>
//                   <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//                 </Form.Group>
//                 <Form.Group className="mb-2">
//                   <Form.Label>Upto</Form.Label>
//                   <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group className="mb-2">
//                   <Form.Label>City Name</Form.Label>
//                   <Form.Control value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" />
//                 </Form.Group>
//                 <Form.Group className="mb-2">
//                   <Form.Label>State</Form.Label>
//                   <Form.Control value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="State" />
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group className="mb-2">
//                   <Form.Check type="checkbox" label="Agent | B2B" checked={isB2B} onChange={(e) => setIsB2B(e.target.checked)} />
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Report Type</Form.Label>
//                   <Form.Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
//                     <option>With GST</option>
//                     <option>Without GST</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>

//               <Col md={3}>
//                 <Form.Group className="mb-2">
//                   <Form.Label>Full Address</Form.Label>
//                   <Form.Select value={fullAddress} onChange={(e) => setFullAddress(e.target.value)}>
//                     <option>Yes</option>
//                     <option>No</option>
//                   </Form.Select>
//                 </Form.Group>

//                 <Form.Group className="mb-2">
//                   <Form.Label>Tax Type</Form.Label>
//                   <Form.Select value={taxType} onChange={(e) => setTaxType(e.target.value)}>
//                     <option>All</option>
//                     <option>GST</option>
//                     <option>Non-GST</option>
//                   </Form.Select>
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mt-2">
//               <Col md={4}>
//                 <Form.Group>
//                   <Form.Label>Order By</Form.Label>
//                   <Form.Control value={orderBy} onChange={(e) => setOrderBy(e.target.value)} placeholder="Order By" />
//                 </Form.Group>
//               </Col>

//               <Col md={4}>
//                 <Form.Label>Min / Max Qty</Form.Label>
//                 <Row>
//                   <Col><Form.Control value={minQty} onChange={(e) => setMinQty(e.target.value)} placeholder="Min Qty" /></Col>
//                   <Col><Form.Control value={maxQty} onChange={(e) => setMaxQty(e.target.value)} placeholder="Max Qty" /></Col>
//                 </Row>
//               </Col>

//               <Col md={4}>
//                 <Form.Label>Min / Max Value</Form.Label>
//                 <Row>
//                   <Col><Form.Control value={minValue} onChange={(e) => setMinValue(e.target.value)} placeholder="Min Value" /></Col>
//                   <Col><Form.Control value={maxValue} onChange={(e) => setMaxValue(e.target.value)} placeholder="Max Value" /></Col>
//                 </Row>
//               </Col>
//             </Row>

//             <Row className="mt-3">
//               <Col md={4}>
//                 <Button variant="outline-secondary" onClick={() => alert("Select Ledger Accounts (not implemented)")}>Select Ledger Accounts</Button>{" "}
//                 <Button variant="outline-secondary" disabled style={{ marginLeft: 8 }}>Select Stock Items</Button>
//               </Col>

//               <Col md={4} className="text-center">
//                 <Form.Check type="checkbox" label="Less Dr/Cr Note" checked={lessDrCrNote} onChange={(e) => setLessDrCrNote(e.target.checked)} />
//               </Col>

//               <Col md={4} className="text-end">
//                 <Button variant="warning" onClick={() => alert("Export not implemented – you can add XLSX export later")}>Export</Button>{" "}
//                 <Button variant="primary" onClick={onOpenPrint}>Print</Button>{" "}
//                 <Button variant="secondary" onClick={onClose}>Exit</Button>
//               </Col>
//             </Row>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* Print Preview Modal */}
//       <Modal show={printOpen} onHide={() => setPrintOpen(false)} size="xl" centered dialogClassName="modal-90w">
//         <Modal.Header closeButton>
//           <Modal.Title>Print Preview - Purchase Summary</Modal.Title>
//         </Modal.Header>

//         <Modal.Body>
//           {fetching ? (
//             <div className="text-center">Loading...</div>
//           ) : error ? (
//             <div className="alert alert-danger">{error}</div>
//           ) : (
//             <>
//               <div className="mb-3">
//                 <small>Filters: From {fromDate} To {toDate} • City: {city || "All"} • State: {stateName || "All"}</small>
//               </div>

//               <div style={{ border: "1px solid #ddd" }}>
//                 {/* Printable content is rendered here and referenced by react-to-print */}
//                 <PurSummPrint
//                   ref={printRef}
//                   groupedData={groupedData}
//                   periodFrom={fromDate}
//                   periodTo={toDate}
//                   companyInfo={{ name: "STARKS PVT LTD.", line1: "WINTER FELL", line2: "NORTH" }}
//                 />
//               </div>
//             </>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setPrintOpen(false)}>Close</Button>
//           <Button variant="primary" onClick={handlePrint} disabled={fetching || groupedData.length === 0}>
//             Send to Printer
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// }



// PurchaseSummaryModal.jsx
import React, { useState, useRef, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import PurSummPrint from "./PurSummPrint";
import useCompanySetup from "../Shared/useCompanySetup";
import InputMask from "react-input-mask";

const API_URL =
  "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase";

export default function PurchaseSummaryModal({ show, onClose }) {
  const {dateFrom, companyName, companyAdd, companyCity } = useCompanySetup();
  // form state
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [isB2B, setIsB2B] = useState(false);
  const [reportType, setReportType] = useState("With GST");
  const [fullAddress, setFullAddress] = useState("Yes");
  const [taxType, setTaxType] = useState("All");
  const [orderBy, setOrderBy] = useState("");
  const [minQty, setMinQty] = useState("");
  const [maxQty, setMaxQty] = useState("");
  const [minValue, setMinValue] = useState("");
  const [maxValue, setMaxValue] = useState("");
  const [lessDrCrNote, setLessDrCrNote] = useState(false);
  const [summaryType, setSummaryType] = useState("total"); 

  // Print preview modal state
  const [printOpen, setPrintOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [groupedData, setGroupedData] = useState([]);
  const [error, setError] = useState("");

  // ref for react-to-print
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Purchase Summary",
  });

  const [rawValue, setRawValue] = useState("");
  const [toRaw, setToRaw] = useState("");

  // intialize fromDate input with formatted dateFrom
  useEffect(() => {
    if (!rawValue && dateFrom) {
      const d = new Date(dateFrom);

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
      const year = d.getFullYear();

      setRawValue(`${day}/${month}/${year}`);
      console.log(dateFrom, "dateFrom formatted");
    }
  }, [dateFrom, rawValue]);

  // Initialize to today's date
  useEffect(() => {
    if (!toRaw) {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0"); // Months 0-indexed
      const year = today.getFullYear();
      setToRaw(`${day}/${month}/${year}`);
      setToDate(today);
    }
  }, [toRaw]);
  
  // Date change handles 
  const handleChange = (e) => {
    setRawValue(e.target.value);

    const [d, m, y] = e.target.value.split("/");
    if (d.length === 2 && m.length === 2 && y.length === 4) {
      const dateObj = new Date(`${y}-${m}-${d}`);
      if (!isNaN(dateObj.getTime())) setFromDate(dateObj);
    }
  };

  const handleToChange = (e) => {
    const val = e.target.value;
    setToRaw(val);

    const [d, m, y] = val.split("/");
    if (d.length === 2 && m.length === 2 && y.length === 4) {
      const dateObj = new Date(`${y}-${m}-${d}`);
      if (!isNaN(dateObj.getTime())) setToDate(dateObj);
    }
  };

  // Called when user clicks Print on main modal
  async function onOpenPrint() {
    setError("");
    setFetching(true);
    setPrintOpen(true); // open modal immediately (spinner shows)

    try {
      const res = await axios.get(API_URL);
      let arr = Array.isArray(res.data) ? res.data : [];

      //-----------------------------------------------------
      // ⭐ FILTER BY CITY & STATE (case-insensitive)
      //-----------------------------------------------------
      const filterCity = city.trim().toLowerCase();
      const filterState = stateName.trim().toLowerCase();

      arr = arr.filter((rec) => {
        const supplier = rec.supplierdetails?.[0] || {};
        const apiCity = (supplier.city || "").trim().toLowerCase();
        const apiState = (supplier.state || "").trim().toLowerCase();

        let cityMatch = true;
        if (filterCity !== "") cityMatch = apiCity === filterCity;

        let stateMatch = true;
        if (filterState !== "") stateMatch = apiState === filterState;

        return cityMatch && stateMatch;
      });

      //-----------------------------------------------------
      // GROUP AFTER FILTERING
      //-----------------------------------------------------
    let grouped = [];

    if (summaryType === "total") {
      grouped = groupBySupplier(arr, { minQty, maxQty, minValue, maxValue }, reportType);
    }
    else if (summaryType === "month") {
      grouped = groupByMonth(arr, reportType);
    }
    else if (summaryType === "date") {
      grouped = groupByDate(arr, reportType);
    }
    else if (summaryType === "account") {
      grouped = groupBySupplier(arr, { minQty, maxQty, minValue, maxValue }, reportType)
        .sort((a, b) => a.supplierName.localeCompare(b.supplierName));
    }
      setGroupedData(grouped);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch purchase data. Check console.");
    } finally {
      setFetching(false);
    }
  }

  /**
   * Grouping function:
   * - groups by supplierdetails[0].vacode
   * - sums pkgs -> bags, weight -> qty, amount -> value
   * - filters by min/max qty/value (if provided)
   */

  function groupBySupplier(apiArray = [], filters = {}, reportType) {
    const map = new Map();

    apiArray.forEach((rec) => {
      const supplier = rec.supplierdetails?.[0] || {};
      const name = (supplier.vacode || "Unknown Supplier").trim();
      const city = supplier.city || "";
      const pan = supplier.pan || "";

      const items = Array.isArray(rec.items) ? rec.items : [];

      let sums = { bags: 0, qty: 0, value: 0 };

      if (reportType === "Without GST") {
        sums = items.reduce(
          (acc, it) => {
            acc.bags += parseFloat(it.pkgs) || 0;
            acc.qty += parseFloat(it.weight) || 0;
            acc.value += parseFloat(it.amount) || 0;
            return acc;
          },
          { bags: 0, qty: 0, value: 0 }
        );
      } else if (reportType === "With GST") {
        const bags = items.reduce((a, it) => a + (parseFloat(it.pkgs) || 0), 0);
        const qty = items.reduce(
          (a, it) => a + (parseFloat(it.weight) || 0),
          0
        );

        sums.bags = bags;
        sums.qty = qty;

        // Use grandtotal from formData
        const grand = parseFloat(rec.formData?.grandtotal);
        sums.value = isNaN(grand) ? 0 : grand;
      }

      const { minQty, maxQty, minValue, maxValue } = filters;
      if (minQty && sums.qty < parseFloat(minQty)) return;
      if (maxQty && sums.qty > parseFloat(maxQty)) return;
      if (minValue && sums.value < parseFloat(minValue)) return;
      if (maxValue && sums.value > parseFloat(maxValue)) return;

      if (!map.has(name)) {
        map.set(name, {
          supplierName: name,
          city,
          pan,
          bags: sums.bags,
          qty: sums.qty,
          value: sums.value,
        });
      } else {
        const ex = map.get(name);
        ex.bags += sums.bags;
        ex.qty += sums.qty;
        ex.value += sums.value;
      }
    });

    return Array.from(map.values());
  }

  function groupByDate(apiArray = [], reportType) {
    return apiArray.map(rec => {
      const items = rec.items ?? [];

      const bags = items.reduce((a, it) => a + (parseFloat(it.pkgs) || 0), 0);
      const qty = items.reduce((a, it) => a + (parseFloat(it.weight) || 0), 0);

      let value = 0;
      if (reportType === "With GST") {
        value = parseFloat(rec.formData?.grandtotal) || 0;
      } else {
        value = items.reduce((a, it) => a + (parseFloat(it.amount) || 0), 0);
      }

      return {
        date: rec.formData?.date?.substring(0, 10),
        bags,
        qty,
        value,
        supplier: rec.supplierdetails?.[0]?.vacode || "",
      };
    });
  }

  // helper: parse DD/MM/YYYY or ISO -> Date object (returns null if invalid)
  function parseAnyDate(dateStr) {
    if (!dateStr) return null;
    // If already a Date object
    if (dateStr instanceof Date) {
      return isNaN(dateStr.getTime()) ? null : dateStr;
    }

    // Trim
    const s = String(dateStr).trim();

    // Case 1: DD/MM/YYYY  (e.g. 28/11/2025)
    const ddmmyyyy = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    const m1 = s.match(ddmmyyyy);
    if (m1) {
      const d = parseInt(m1[1], 10);
      const m = parseInt(m1[2], 10) - 1;
      const y = parseInt(m1[3], 10);
      const dt = new Date(y, m, d);
      return isNaN(dt.getTime()) ? null : dt;
    }

    // Case 2: ISO-ish (YYYY-MM-DD or full ISO)
    const iso = Date.parse(s);
    if (!isNaN(iso)) return new Date(iso);

    // fallback: try Date constructor once more
    const dt2 = new Date(s);
    return isNaN(dt2.getTime()) ? null : dt2;
  }

  // GROUP BY MONTH - safe parsing for DD/MM/YYYY and ISO
  function groupByMonth(apiArray = [], reportType) {
    const map = new Map();

    apiArray.forEach((rec) => {
      const dateStr = rec.formData?.date || rec.date || "";
      const d = parseAnyDate(dateStr);
      if (!d) return;

      // e.g. "Nov 2025" or "Nov-2025"
      const monthKey = d.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      const items = Array.isArray(rec.items) ? rec.items : [];

      const bags = items.reduce((a, it) => a + (parseFloat(it.pkgs) || 0), 0);
      const qty = items.reduce((a, it) => a + (parseFloat(it.weight) || 0), 0);

      let value = 0;
      if (reportType === "With GST") {
        value = parseFloat(rec.formData?.grandtotal) || 0;
      } else {
        value = items.reduce((a, it) => a + (parseFloat(it.amount) || 0), 0);
      }

      if (!map.has(monthKey)) {
        map.set(monthKey, { month: monthKey, bags, qty, value });
      } else {
        const ex = map.get(monthKey);
        ex.bags += bags;
        ex.qty += qty;
        ex.value += value;
      }
    });

    return Array.from(map.values());
  }

  const format = (d) => {
    if (!d) return "";
    if (d instanceof Date) {
      const dd = String(d.getDate()).padStart(2, "0");
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const yy = d.getFullYear();
      return `${dd}/${mm}/${yy}`;
    }
    return d;
  };

  return (
    <>
      {/* MAIN FILTER MODAL */}
      <Modal show={show} onHide={onClose} size="xl" centered>
      
        <Modal.Body style={{ background: "#f7f9fc" }}>
          <h2 className="header" style={{marginTop:0,marginLeft:"35%",fontSize:"22px"}}>PURCHASE SUMMARY PARTY WISE</h2>
          <Form>
            <div
              style={{
                display: "flex",
                gap: "25px",
                padding: "10px 5px",
              }}
            >
              {/* LEFT SIDE */}
              <div
                style={{
                  flex: 1,
                  background: "white",
                  padding: "18px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                }}
              >
                {/* <h6 className="text-primary fw-bold mb-3">Basic Filters</h6> */}

                {/* DATE FIELDS */}
                <div style={rowStyle}>
                  <label style={labelStyle}>From</label>
                    <InputMask
                      mask="99/99/9999"
                      placeholder="dd/mm/yyyy"
                      value={rawValue}
                      onChange={handleChange}
                    >
                      {(inputProps) => (
                        <input {...inputProps} className="form-control" />
                      )}
                    </InputMask>
                  {/* <Form.Control
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                  /> */}
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>Upto</label>
                  <InputMask
                    mask="99/99/9999"
                    placeholder="dd/mm/yyyy"
                    value={toRaw}
                    onChange={handleToChange}
                  >
                    {(inputProps) => <input {...inputProps} className="form-control" />}
                  </InputMask>
                  {/* <Form.Control
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                  /> */}
                </div>

                {/* CITY & STATE */}
                <div style={rowStyle}>
                  <label style={labelStyle}>City</label>
                  <Form.Control
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div style={rowStyle}>
                  <label style={labelStyle}>State</label>
                  <Form.Control
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                  />
                </div>

                {/* B2B Checkbox */}
                <div style={rowStyle}>
                  <label>Agent | B2B</label>
                  <input
                    type="checkbox"
                    checked={isB2B}
                    onChange={(e) => setIsB2B(e.target.checked)}
                  />
                </div>

                {/* Report Type */}
                <div style={rowStyle}>
                  <label style={labelStyle}>Report Type</label>
                  <Form.Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option>With GST</option>
                    <option>Without GST</option>
                  </Form.Select>
                </div>

                {/* Full Address */}
                <div style={rowStyle}>
                  <label style={labelStyle}>Full Address</label>
                  <Form.Select
                    value={fullAddress}
                    onChange={(e) => setFullAddress(e.target.value)}
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </Form.Select>
                </div>

                {/* Tax Type */}
                <div style={rowStyle}>
                  <label style={labelStyle}>Tax Type</label>
                  <Form.Select
                    value={taxType}
                    onChange={(e) => setTaxType(e.target.value)}
                  >
                    <option>All</option>
                    <option>GST</option>
                    <option>Non-GST</option>
                  </Form.Select>
                </div>

                {/* Order By */}
                <div style={rowStyle}>
                  <label style={labelStyle}>Order By</label>
                  <Form.Control
                    value={orderBy}
                    onChange={(e) => setOrderBy(e.target.value)}
                    placeholder="Order By"
                  />
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div
                style={{
                  flex: 1,
                  background: "white",
                  padding: "18px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.09)",
                }}
              >
                {/* <h6 className="text-primary fw-bold mb-2">Quantity & Value</h6> */}
                          {/* SUMMARY TYPE RADIO BUTTONS */}
      <div style={{ padding: "10px"}}>
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="summaryType"
            value="total"
            checked={summaryType === "total"}
            onChange={(e) => setSummaryType(e.target.value)}
          />
          <label className="form-check-label">Total Summary</label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="summaryType"
            value="month"
            checked={summaryType === "month"}
            onChange={(e) => setSummaryType(e.target.value)}
          />
          <label className="form-check-label">Month Wise</label>
        </div>

        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            name="summaryType"
            value="date"
            checked={summaryType === "date"}
            onChange={(e) => setSummaryType(e.target.value)}
          />
          <label className="form-check-label">Date Wise</label>
        </div>

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

                {/* Min Max Qty */}
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

                {/* Checkbox */}
                <div style={rowStyle}>
                  <label style={labelStyle}>Less Dr/Cr Note</label>
                  <Form.Check
                    checked={lessDrCrNote}
                    onChange={(e) => setLessDrCrNote(e.target.checked)}
                  />
                </div>

                <hr />

                {/* Buttons */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                  }}
                >
                  <Button variant="outline-secondary">
                    Select Ledger Accounts
                  </Button>

                  <Button variant="outline-secondary" disabled>
                    Select Stock Items
                  </Button>

                  <Button variant="warning">Export</Button>

                  <Button variant="primary" onClick={onOpenPrint}>
                    Print
                  </Button>

                  <Button variant="secondary" onClick={onClose}>
                    Exit
                  </Button>
                </div>
              </div>
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
        dialogClassName="modal-90w"
      >
        <Modal.Body>
          {fetching ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <>
              <div>
                <PurSummPrint
                  ref={printRef}
                  groupedData={groupedData}
                  periodFrom={format(fromDate)}
                  periodTo={format(toDate)}
                  companyName={companyName}
                  companyAdd={companyAdd}
                  companyCity={companyCity}
                />
              </div>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setPrintOpen(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handlePrint}
            disabled={fetching || groupedData.length === 0}
          >
            Send to Printer
          </Button>
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
