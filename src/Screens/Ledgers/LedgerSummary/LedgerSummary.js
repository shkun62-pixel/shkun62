// import React, { useState, useEffect } from "react";
// import { Modal, Button, Row, Col, Form } from "react-bootstrap";
// import InputMask from "react-input-mask";
// import axios from "axios";
// import LedgerSummaryResult from "./LedgerSummaryResult";

// const LedgerSummary = ({ show, onHide }) => {
//   /* ================= STATE ================= */
//   const [balance, setBalance] = useState("Active Balance");
//   const [orderBy, setOrderBy] = useState("Account Name Wise");
//   const [annexure, setAnnexure] = useState("All");
//   const [reportBy, setReportBy] = useState("value");
//   const [voucher, setVoucher] = useState("Cash Voucher");
//   const [stateName, setStateName] = useState("");
//   const [city, setCity] = useState("");
//   const [fromDate, setFromDate] = useState("01/04/2025");
//   const [uptoDate, setUptoDate] = useState("30/03/2026");
//   const [groupAgent, setGroupAgent] = useState("");
//   const [cashExceed, setCashExceed] = useState("");
//   const [area, setArea] = useState("");
//   const [groupTotal, setGroupTotal] = useState(false);

//   const [showResultModal, setShowResultModal] = useState(false);
//   const [summaryFilters, setSummaryFilters] = useState(null);

//   /* ===== Annexure from API ===== */
//   const [annexureList, setAnnexureList] = useState([]);
//   const [loadingAnnexure, setLoadingAnnexure] = useState(false);

//   /* ================= API CALL ================= */
//   useEffect(() => {
//     if (!show) return;

//     const fetchAnnexure = async () => {
//       try {
//         setLoadingAnnexure(true);

//         const res = await axios.get(
//           "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount",
//         );

//         if (res.data?.ok && Array.isArray(res.data.data)) {
//           const uniqueGroups = [
//             ...new Set(
//               res.data.data
//                 .map((item) => item?.formData?.Bsgroup)
//                 .filter(Boolean),
//             ),
//           ];
//           setAnnexureList(uniqueGroups);
//         }
//       } catch (err) {
//         console.error("Annexure API error:", err);
//       } finally {
//         setLoadingAnnexure(false);
//       }
//     };

//     fetchAnnexure();
//   }, [show]);

//   /* ================= UI ================= */
//   return (
//     <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
//       <Modal.Header closeButton>
//         <Modal.Title className="fw-bold">Ledger Summary</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Form>
//           {/* ================= ROW 1 ================= */}
//           <Row className="mb-2">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Balance</Form.Label>
//                 <Form.Select
//                   value={balance}
//                   onChange={(e) => setBalance(e.target.value)}
//                 >
//                   <option>Active Balance</option>
//                   <option>All Accounts</option>
//                   <option>Non-Active Accounts</option>
//                   <option>Payments/Debit Only</option>
//                   <option>Receipts/Credit Only</option>
//                   <option>Credit/Debit Only</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>

//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Order By</Form.Label>
//                 <Form.Select
//                   value={orderBy}
//                   onChange={(e) => setOrderBy(e.target.value)}
//                 >
//                   <option>Account Name Wise</option>
//                   <option>City Wise + Name Wise</option>
//                   <option>Card/TIN No.Wise</option>
//                   <option>Annexure Wise</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* ================= ROW 2 ================= */}
//           <Row className="mb-2">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Annexure</Form.Label>
//                 <Form.Select
//                   value={annexure}
//                   onChange={(e) => setAnnexure(e.target.value)}
//                 >
//                   <option value="All">All</option>
//                   {loadingAnnexure && <option disabled>Loading...</option>}
//                   {!loadingAnnexure &&
//                     annexureList.map((grp, idx) => (
//                       <option key={idx} value={grp}>
//                         {grp}
//                       </option>
//                     ))}
//                 </Form.Select>
//               </Form.Group>
//             </Col>

//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Report By</Form.Label>
//                 <Form.Select
//                   value={reportBy}
//                   onChange={(e) => setReportBy(e.target.value)}
//                 >
//                   <option>value</option>
//                   <option>Quantity</option>
//                   <option>Bags</option>
//                   <option>Sale With Payment</option>
//                   <option>Pur With Payment</option>
//                   <option>Ledger Export</option>
//                   <option>Cash Report</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* ================= ROW 3 ================= */}
//           <Row className="mb-2">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Voucher</Form.Label>
//                 <Form.Select
//                   value={voucher}
//                   onChange={(e) => setVoucher(e.target.value)}
//                 >
//                   <option>Cash Voucher</option>
//                   <option>Journal Voucher</option>
//                   <option>Sale Voucher</option>
//                   <option>Purchase Voucher</option>
//                 </Form.Select>
//               </Form.Group>
//             </Col>

//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>State</Form.Label>
//                 <Form.Control
//                   value={stateName}
//                   onChange={(e) => setStateName(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* ================= ROW 4 ================= */}
//           <Row className="mb-2">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>City</Form.Label>
//                 <Form.Control
//                   value={city}
//                   onChange={(e) => setCity(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>From</Form.Label>
//                 <InputMask
//                   mask="99/99/9999"
//                   value={fromDate}
//                   onChange={(e) => setFromDate(e.target.value)}
//                 >
//                   {(props) => (
//                     <Form.Control {...props} placeholder="DD/MM/YYYY" />
//                   )}
//                 </InputMask>
//               </Form.Group>
//             </Col>

//             <Col md={3}>
//               <Form.Group>
//                 <Form.Label>Upto</Form.Label>
//                 <InputMask
//                   mask="99/99/9999"
//                   value={uptoDate}
//                   onChange={(e) => setUptoDate(e.target.value)}
//                 >
//                   {(props) => (
//                     <Form.Control {...props} placeholder="DD/MM/YYYY" />
//                   )}
//                 </InputMask>
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* ================= ROW 5 ================= */}
//           <Row className="mb-2">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Group / Agent</Form.Label>
//                 <Form.Control
//                   value={groupAgent}
//                   onChange={(e) => setGroupAgent(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>

//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Cash Exceed</Form.Label>
//                 <Form.Control
//                   value={cashExceed}
//                   onChange={(e) => setCashExceed(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           {/* ================= ROW 6 ================= */}
//           <Row className="mb-2">
//             <Col md={6}>
//               <Form.Group>
//                 <Form.Label>Area</Form.Label>
//                 <Form.Control
//                   value={area}
//                   onChange={(e) => setArea(e.target.value)}
//                 />
//               </Form.Group>
//             </Col>
//           </Row>

//           <Form.Check
//             type="checkbox"
//             label="Group Total"
//             checked={groupTotal}
//             onChange={(e) => setGroupTotal(e.target.checked)}
//             className="mt-2"
//           />
//         </Form>
//       </Modal.Body>

//       <Modal.Footer >
//         <Button
//           variant="primary"
//           onClick={() => {
//             const filters = {
//               balance,
//               orderBy,
//               annexure,
//               reportBy,
//               voucher,
//               stateName,
//               city,
//               fromDate,
//               uptoDate,
//               groupAgent,
//               cashExceed,
//               area,
//               groupTotal,
//             };

//             setSummaryFilters(filters);
//             setShowResultModal(true);
//           }}
//         >
//           Generate
//         </Button>
//         <LedgerSummaryResult
//           show={showResultModal}
//           onHide={() => setShowResultModal(false)}
//           filters={summaryFilters}
//         />
//         <Button variant="secondary" onClick={onHide}>
//           Exit
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default LedgerSummary;

import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import InputMask from "react-input-mask";
import axios from "axios";
import LedgerSummaryResult from "./LedgerSummaryResult";

/* ===== MUI ===== */
import {
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

/* ===== All Indian States ===== */
const indianStates = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Andaman and Nicobar Islands",
  "Chandigarh","Dadra and Nagar Haveli and Daman and Diu","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry"
];

const LedgerSummary = ({ show, onHide }) => {
  /* ================= STATE ================= */
  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  const [balance, setBalance] = useState("Active Balance");
  const [orderBy, setOrderBy] = useState("Account Name Wise");
  const [annexure, setAnnexure] = useState("All");
  const [reportBy, setReportBy] = useState("value");
  const [voucher, setVoucher] = useState("All");
  const [stateName, setStateName] = useState("");
  const [city, setCity] = useState("");
  const [fromDate, setFromDate] = useState("01/04/2025");
  const [uptoDate, setUptoDate] = useState("30/03/2026");
  const [groupAgent, setGroupAgent] = useState("");
  const [cashExceed, setCashExceed] = useState("");
  const [area, setArea] = useState("");
  const [groupTotal, setGroupTotal] = useState(false);

  const [showResultModal, setShowResultModal] = useState(false);
  const [summaryFilters, setSummaryFilters] = useState(null);

  const [annexureList, setAnnexureList] = useState([]);
  const [loadingAnnexure, setLoadingAnnexure] = useState(false);

  /* ================= API CALL ================= */
  useEffect(() => {
    if (!show) return;

    const fetchAnnexure = async () => {
      try {
        setLoadingAnnexure(true);
        const res = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount`,
        );

        if (res.data?.ok && Array.isArray(res.data.data)) {
          const uniqueGroups = [
            ...new Set(
              res.data.data
                .map((item) => item?.formData?.Bsgroup)
                .filter(Boolean),
            ),
          ];
          setAnnexureList(uniqueGroups);
        }
      } catch (err) {
        console.error("Annexure API error:", err);
      } finally {
        setLoadingAnnexure(false);
      }
    };

    fetchAnnexure();
  }, [show]);

  /* ================= UI ================= */
  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Ledger Summary</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* ================= ROW 1 ================= */}
        <Row className="mb-3">
          <Col md={6}>
            <Autocomplete
              options={[
                "Active Balance",
                "All Accounts",
                "Non-Active Accounts",
                "Payments/Debit Only",
                "Receipts/Credit Only",
                "Credit/Debit Only",
              ]}
              value={balance}
              onChange={(e, newValue) => setBalance(newValue || "")}
              disableClearable
              renderInput={(params) => (
                <TextField {...params} label="BALANCE" size="small" fullWidth />
              )}
            />
          </Col>

          <Col md={6}>
            <Autocomplete
              options={[
                "Account Name Wise",
                "City Wise + Name Wise",
                "Card/TIN No.Wise",
                "Annexure Wise",
              ]}
              value={orderBy}
              onChange={(e, newValue) => setOrderBy(newValue || "")}
              disableClearable
              renderInput={(params) => (
                <TextField {...params} label="ORDER BY" size="small" fullWidth />
              )}
            />
          </Col>
        </Row>

        {/* ================= ROW 2 ================= */}
        <Row className="mb-3">
          <Col md={6}>
            <Autocomplete
              options={["All", ...annexureList]}
              loading={loadingAnnexure}
              value={annexure}
              onChange={(e, newValue) => setAnnexure(newValue || "")}
              disableClearable
              renderInput={(params) => (
                <TextField {...params} label="ANNEXURE" size="small" fullWidth />
              )}
            />
          </Col>

          <Col md={6}>
            <Autocomplete
              options={[
                "value",
                "Quantity",
                "Bags",
                "Sale With Payment",
                "Pur With Payment",
                "Ledger Export",
                "Cash Report",
              ]}
              value={reportBy}
              onChange={(e, newValue) => setReportBy(newValue || "")}
              disableClearable
              renderInput={(params) => (
                <TextField {...params} label="REPORT BY" size="small" fullWidth />
              )}
            />
          </Col>
        </Row>

        {/* ================= ROW 3 ================= */}
        <Row className="mb-3">
          <Col md={6}>
            <Autocomplete
              options={[
                "All",
                "Cash Voucher",
                "Journal Voucher",
                "Sale Voucher",
                "Purchase Voucher",
              ]}
              value={voucher}
              onChange={(e, newValue) => setVoucher(newValue || "")}
              disableClearable
              renderInput={(params) => (
                <TextField {...params} label="VOUCHER" size="small" fullWidth />
              )}
            />
          </Col>

          <Col md={6}>
            <Autocomplete
              options={indianStates}
              value={stateName}
              onChange={(e, newValue) => setStateName(newValue || "")}
              renderInput={(params) => (
                <TextField {...params} label="STATE" size="small" fullWidth />
              )}
            />
          </Col>
        </Row>

        {/* ================= ROW 4 ================= */}
        <Row className="mb-3">
          <Col md={6}>
            <TextField
              label="CITY"
              size="small"
              fullWidth
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Col>

          <Col md={3}>
            <InputMask mask="99/99/9999" value={fromDate} onChange={(e) => setFromDate(e.target.value)}>
              {(props) => (
                <TextField {...props} label="FROM" size="small" fullWidth />
              )}
            </InputMask>
          </Col>

          <Col md={3}>
            <InputMask mask="99/99/9999" value={uptoDate} onChange={(e) => setUptoDate(e.target.value)}>
              {(props) => (
                <TextField {...props} label="UPTO" size="small" fullWidth />
              )}
            </InputMask>
          </Col>
        </Row>

        {/* ================= ROW 5 ================= */}
        <Row className="mb-3">
          <Col md={6}>
            <TextField
              label="AGENT"
              size="small"
              fullWidth
              value={groupAgent}
              onChange={(e) => setGroupAgent(e.target.value)}
            />
          </Col>

          <Col md={6}>
            <TextField
              label="CASH EXCEED"
              size="small"
              fullWidth
              value={cashExceed}
              onChange={(e) => setCashExceed(e.target.value)}
            />
          </Col>
        </Row>

        {/* ================= ROW 6 ================= */}
        <Row className="mb-3">
          <Col md={6}>
            <TextField
              label="AREA"
              size="small"
              fullWidth
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </Col>
        </Row>

        <FormControlLabel
          control={
            <Checkbox
              checked={groupTotal}
              onChange={(e) => setGroupTotal(e.target.checked)}
            />
          }
          label="Group Total"
        />
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="primary"
          onClick={() => {
            setSummaryFilters({
              balance,
              orderBy,
              annexure,
              reportBy,
              voucher,
              stateName,
              city,
              fromDate,
              uptoDate,
              groupAgent,
              cashExceed,
              area,
              groupTotal,
            });
            setShowResultModal(true);
          }}
        >
          Generate
        </Button>

        <LedgerSummaryResult
          show={showResultModal}
          onHide={() => setShowResultModal(false)}
          filters={summaryFilters}
        />

        <Button variant="secondary" onClick={onHide}>
          Exit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LedgerSummary;
