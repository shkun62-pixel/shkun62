// import React, { useState, useEffect } from "react";
// import { Modal, Button, Row, Col, Form } from "react-bootstrap";
// import axios from "axios";
// import InputMask from "react-input-mask";
// import LedgerPreviewModal from "./LedgerPreviewModal";
// import financialYear from "../../Shared/financialYear";
// import AccountSelectionModal from "./AccountSelectionModal";
// import styles from "../Ledger.module.css";

// const LedgerPrint = ({ show, onHide }) => {
//   /* ===================== STATE ===================== */
//   const [showPreview, setShowPreview] = useState(false);
//   const [printPayload, setPrintPayload] = useState(null);

//   const [ledgerData, setLedgerData] = useState([]);
//   const [bsGroups, setBsGroups] = useState([]);
//   const [accounts, setAccounts] = useState([]);

//   const [annexure, setAnnexure] = useState("");
//   const [accountFrom, setAccountFrom] = useState("");

//   const [selection, setSelection] = useState(false);
//   const [openingBalance, setOpeningBalance] = useState(false);

//   const [filter, setFilter] = useState("All Accounts");
//   const [showAccountSelect, setShowAccountSelect] = useState(false);
//   const [selectedAccounts, setSelectedAccounts] = useState([]);

//   const [periodFrom, setPeriodFrom] = useState("");
//   const [upto, setUpto] = useState("");

//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     return `${String(d.getDate()).padStart(2, "0")}-${String(
//       d.getMonth() + 1
//     ).padStart(2, "0")}-${d.getFullYear()}`;
//   };

//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setPeriodFrom(formatDate(fy.start));
//     setUpto(formatDate(fy.end));
//   }, []);

//   const [pageBreak, setPageBreak] = useState("noBreak");
//   const [printType, setPrintType] = useState("none");

//   const [monthWiseTotal, setMonthWiseTotal] = useState(false);
//   const [dateWiseTotal, setDateWiseTotal] = useState(false);
//   const [fullDescription, setFullDescription] = useState(false);

//   useEffect(() => {
//     const fetchLedgerAccounts = async () => {
//       try {
//         const res = await axios.get(
//           "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount"
//         );

//         const data = res.data?.data || [];
//         setLedgerData(data);

//         setBsGroups([
//           ...new Set(data.map((i) => i.formData.Bsgroup).filter(Boolean)),
//         ]);

//         setAccounts(
//           data.map((i) => ({
//             id: i._id,
//             name: i.formData.ahead,
//             group: i.formData.Bsgroup,
//           }))
//         );
//       } catch (err) {
//         console.error("Ledger API Error:", err);
//       }
//     };

//     fetchLedgerAccounts();
//   }, []);

//   /* ===================== ACTIONS ===================== */
//   const handlePrint = () => {
//     setPrintPayload({
//       annexure,
//       selection,
//       openingBalance,
//       accountFrom,
//       selectedAccounts,
//       filter,
//       periodFrom,
//       upto,
//       pageBreak,
//       printType,
//       monthWiseTotal,
//       dateWiseTotal,
//       fullDescription,
//     });
//     setShowPreview(true);
//   };

//   return (
//     <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
//       <Modal.Header closeButton>
//         <Modal.Title className="w-100 text-center">
//           Printing Options
//         </Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Form>
//           {/* PERIOD ROW */}
//            <Row className="mb-3">
//             <Col md={3}>
//               <Form.Label>Period From</Form.Label>
//               <InputMask
//                className={styles.dateInput}
//                 mask="99-99-9999"
//                 value={periodFrom}
//                 onChange={(e) => setPeriodFrom(e.target.value)}
//               >
//                 {(p) => <Form.Control {...p} />}
//               </InputMask>
//             </Col>

//             <Col md={3}>
//               <Form.Label>Upto</Form.Label>
//               <InputMask
//                className={styles.dateInput}
//                 mask="99-99-9999"
//                 value={upto}
//                 onChange={(e) => setUpto(e.target.value)}
//               >
//                 {(p) => <Form.Control {...p} />}
//               </InputMask>
//             </Col>

//             <Col md={6}>
//               <Form.Check
//                 type="radio"
//                 label="Each A/c on New Page"
//                 name="pagebreak"
//                 checked={pageBreak === "newPage"}
//                 onChange={() => setPageBreak("newPage")}
//               />
//               <Form.Check
//                 type="radio"
//                 label="No page break after A/c"
//                 name="pagebreak"
//                 checked={pageBreak === "noBreak"}
//                 onChange={() => setPageBreak("noBreak")}
//               />
//             </Col>
//           </Row>
//           {/* MAIN CONTENT ROW */}
//           <Row>
//             {/* LEFT SIDE */}
//             <Col md={6}>
//               <Form.Label>Annexure</Form.Label>
//               <Form.Select
//                 className={styles.annexureSelect}
//                 value={annexure}
//                 onChange={(e) => setAnnexure(e.target.value)}
//               >
//                 <option value="">-- All Group --</option>
//                 {bsGroups.map((g, i) => (
//                   <option key={i}>{g}</option>
//                 ))}
//               </Form.Select>

//               <Form.Label className="mt-3">A/c From</Form.Label>
//               <Form.Select
//                 className={styles.acFrom}
//                 value={accountFrom}
//                 onChange={(e) => setAccountFrom(e.target.value)}
//               >
//                 <option value="">-- All Account --</option>
//                 {accounts
//                   .filter((a) => !annexure || a.group === annexure)
//                   .map((a) => (
//                     <option key={a.id}>{a.name}</option>
//                   ))}
//               </Form.Select>

//               <Form.Label className="mt-3">Filter</Form.Label>
//               <Form.Select
//                 className={styles.filterSelect}
//                 value={filter}
//                 onChange={(e) => setFilter(e.target.value)}
//               >
//                 <option>All Accounts</option>
//                 <option>General Accounts</option>
//                 <option>Debtor/Creditor</option>
//                 <option>Active Dr Balance</option>
//                 <option>Active Cr Balance</option>
//                 <option>Active Nill</option>
//                 <option>Active Balance</option>
//               </Form.Select>
//             </Col>

//             {/* RIGHT SIDE */}
//             <Col md={6}>
//               <div className="mb-2 d-flex gap-6">
//                 <Form.Check
//                   type="checkbox"
//                   label="Selection"
//                   checked={selection}
//                   onChange={(e) => {
//                     const checked = e.target.checked;
//                     setSelection(checked);
//                     checked
//                       ? setShowAccountSelect(true)
//                       : setSelectedAccounts([]);
//                   }}
//                 />

//                 <Form.Check
//                   type="checkbox"
//                   label="Opening Balance"
//                   checked={openingBalance}
//                   onChange={(e) => setOpeningBalance(e.target.checked)}
//                 />
//               </div>

//               {showAccountSelect && (
//                 <AccountSelectionModal
//                   show={showAccountSelect}
//                   onHide={() => setShowAccountSelect(false)}
//                   accounts={accounts}
//                   annexure={annexure}
//                   onApply={(list) => setSelectedAccounts(list)}
//                 />
//               )}

//               <div className="mt-3" style={{display:'flex', flexDirection:'row'}}>
//                 <div style={{display:'flex', flexDirection:'column'}}>
//                 <Form.Check
//                   type="radio"
//                   label="Print Qty"
//                   name="printtype"
//                   checked={printType === "qty"}
//                   onChange={() => setPrintType("qty")}
//                 />
//                 <Form.Check
//                   type="radio"
//                   label="Print Bags"
//                   name="printtype"
//                   checked={printType === "bags"}
//                   onChange={() => setPrintType("bags")}
//                 />
//                 <Form.Check
//                   type="radio"
//                   label="None"
//                   name="printtype"
//                   checked={printType === "none"}
//                   onChange={() => setPrintType("none")}
//                 />
//                 </div>
//                 <div style={{display:'flex', flexDirection:'column',marginLeft:'20px'}}>
//                   <Form.Check
//                     label="Month Wise Group Total"
//                     checked={monthWiseTotal}
//                     onChange={(e) => setMonthWiseTotal(e.target.checked)}
//                   />
//                   <Form.Check
//                     label="Date Wise Group Total"
//                     checked={dateWiseTotal}
//                     onChange={(e) => setDateWiseTotal(e.target.checked)}
//                   />
//                   <Form.Check
//                     label="Full Description"
//                     checked={fullDescription}
//                     onChange={(e) => setFullDescription(e.target.checked)}
//                   />
//                 </div>
//               </div>

//             </Col>
//           </Row>
//         </Form>
//       </Modal.Body>

//       <Modal.Footer>
//         <Button variant="outline-secondary" onClick={onHide}>
//           Exit
//         </Button>
//         <Button variant="primary" onClick={handlePrint}>
//           Print
//         </Button>
//       </Modal.Footer>

//       {showPreview && (
//         <LedgerPreviewModal
//           show={showPreview}
//           onHide={() => setShowPreview(false)}
//           printPayload={printPayload}
//         />
//       )}
//     </Modal>
//   );
// };

// export default LedgerPrint;

import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import InputMask from "react-input-mask";
import LedgerPreviewModal from "./LedgerPreviewModal";
import financialYear from "../../Shared/financialYear";
import AccountSelectionModal from "./AccountSelectionModal";
import styles from "../Ledger.module.css";

/* ===== MUI ===== */
import {
  TextField,
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

const LedgerPrint = ({ show, onHide }) => {
  /* ===================== STATE ===================== */
  const [showPreview, setShowPreview] = useState(false);
  const [printPayload, setPrintPayload] = useState(null);

  const [ledgerData, setLedgerData] = useState([]);
  const [bsGroups, setBsGroups] = useState([]);
  const [accounts, setAccounts] = useState([]);

  const [annexure, setAnnexure] = useState("");
  const [accountFrom, setAccountFrom] = useState("");

  const [selection, setSelection] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(false);

  const [filter, setFilter] = useState("All Accounts");
  const [showAccountSelect, setShowAccountSelect] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

  const [periodFrom, setPeriodFrom] = useState("");
  const [upto, setUpto] = useState("");

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1,
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  useEffect(() => {
    const fy = financialYear.getFYDates();
    setPeriodFrom(formatDate(fy.start));
    setUpto(formatDate(fy.end));
  }, []);

  const [pageBreak, setPageBreak] = useState("noBreak");
  const [printType, setPrintType] = useState("none");

  const [monthWiseTotal, setMonthWiseTotal] = useState(false);
  const [dateWiseTotal, setDateWiseTotal] = useState(false);
  const [fullDescription, setFullDescription] = useState(false);

  useEffect(() => {
    const fetchLedgerAccounts = async () => {
      try {
        const res = await axios.get(
          "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount",
        );

        const data = res.data?.data || [];
        setLedgerData(data);

        setBsGroups([
          ...new Set(data.map((i) => i.formData.Bsgroup).filter(Boolean)),
        ]);

        setAccounts(
          data.map((i) => ({
            id: i._id,
            name: i.formData.ahead,
            group: i.formData.Bsgroup,
          })),
        );
      } catch (err) {
        console.error("Ledger API Error:", err);
      }
    };

    fetchLedgerAccounts();
  }, []);

  /* ===================== ACTIONS ===================== */
  const handlePrint = () => {
    setPrintPayload({
      annexure,
      selection,
      openingBalance,
      accountFrom,
      selectedAccounts,
      filter,
      periodFrom,
      upto,
      pageBreak,
      printType,
      monthWiseTotal,
      dateWiseTotal,
      fullDescription,
    });
    setShowPreview(true);
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg" backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          Printing Options
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* PERIOD ROW */}
          <Row className="mb-3">
            <Col md={3}>
              <InputMask
                mask="99-99-9999"
                value={periodFrom}
                onChange={(e) => setPeriodFrom(e.target.value)}
              >
                {(props) => (
                  <TextField {...props} label="FROM" size="small" fullWidth />
                )}
              </InputMask>
              {/* <Form.Label>Period From</Form.Label>
              <InputMask
                className={styles.dateInput}
                mask="99-99-9999"
                value={periodFrom}
                onChange={(e) => setPeriodFrom(e.target.value)}
              >
                {(p) => <TextField {...p} size="small" fullWidth />}
              </InputMask> */}
            </Col>

            <Col md={3}>
            <InputMask
                mask="99-99-9999"
                value={upto}
                onChange={(e) => setUpto(e.target.value)}
              >
                {(props) => (
                  <TextField {...props} label="UPTO" size="small" fullWidth />
                )}
              </InputMask>
              {/* <Form.Label>Upto</Form.Label>
              <InputMask
                className={styles.dateInput}
                mask="99-99-9999"
                value={upto}
                onChange={(e) => setUpto(e.target.value)}
              >
                {(p) => <TextField {...p} size="small" fullWidth />}
              </InputMask> */}
            </Col>

            <Col md={6}>
              <Form.Check
                type="radio"
                label="Each A/c on New Page"
                name="pagebreak"
                checked={pageBreak === "newPage"}
                onChange={() => setPageBreak("newPage")}
              />
              <Form.Check
                type="radio"
                label="No page break after A/c"
                name="pagebreak"
                checked={pageBreak === "noBreak"}
                onChange={() => setPageBreak("noBreak")}
              />
            </Col>
          </Row>

          {/* MAIN CONTENT ROW */}
          <Row>
            {/* LEFT SIDE */}
            <Col md={6}>
              {/* Annexure */}
              <Autocomplete
                options={["-- All Group --", ...bsGroups]}
                value={annexure || "-- All Group --"}
                onChange={(e, newValue) =>
                  setAnnexure(newValue === "-- All Group --" ? "" : newValue)
                }
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="ANNEXURE"
                    size="small"
                    fullWidth
                  />
                )}
              />

              {/* A/c From */}
              <Autocomplete
                options={[
                  "-- All Account --",
                  ...accounts
                    .filter((a) => !annexure || a.group === annexure)
                    .map((a) => a.name),
                ]}
                value={accountFrom || "-- All Account --"}
                onChange={(e, newValue) =>
                  setAccountFrom(
                    newValue === "-- All Account --" ? "" : newValue,
                  )
                }
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="A/C FROM"
                    size="small"
                    fullWidth
                    className="mt-3"
                  />
                )}
              />

              {/* Filter */}
              <Autocomplete
                options={[
                  "All Accounts",
                  "General Accounts",
                  "Debtor/Creditor",
                  "Active Dr Balance",
                  "Active Cr Balance",
                  "Active Nill",
                  "Active Balance",
                ]}
                value={filter}
                onChange={(e, newValue) =>
                  setFilter(newValue || "All Accounts")
                }
                disableClearable
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="FILTER"
                    size="small"
                    fullWidth
                    className="mt-3"
                  />
                )}
              />
            </Col>

            {/* RIGHT SIDE */}
            <Col md={6}>
              <div className="mb-2 d-flex gap-6">
                <Form.Check
                  type="checkbox"
                  label="Selection"
                  checked={selection}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setSelection(checked);
                    checked
                      ? setShowAccountSelect(true)
                      : setSelectedAccounts([]);
                  }}
                />

                <Form.Check
                  type="checkbox"
                  label="Opening Balance"
                  checked={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.checked)}
                />
              </div>

              {showAccountSelect && (
                <AccountSelectionModal
                  show={showAccountSelect}
                  onHide={() => setShowAccountSelect(false)}
                  accounts={accounts}
                  annexure={annexure}
                  onApply={(list) => setSelectedAccounts(list)}
                />
              )}

              <div
                className="mt-3"
                style={{ display: "flex", flexDirection: "row" }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Form.Check
                    type="radio"
                    label="Print Qty"
                    name="printtype"
                    checked={printType === "qty"}
                    onChange={() => setPrintType("qty")}
                  />
                  <Form.Check
                    type="radio"
                    label="Print Bags"
                    name="printtype"
                    checked={printType === "bags"}
                    onChange={() => setPrintType("bags")}
                  />
                  <Form.Check
                    type="radio"
                    label="None"
                    name="printtype"
                    checked={printType === "none"}
                    onChange={() => setPrintType("none")}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "20px",
                  }}
                >
                  <Form.Check
                    label="Month Wise Group Total"
                    checked={monthWiseTotal}
                    onChange={(e) => setMonthWiseTotal(e.target.checked)}
                  />
                  <Form.Check
                    label="Date Wise Group Total"
                    checked={dateWiseTotal}
                    onChange={(e) => setDateWiseTotal(e.target.checked)}
                  />
                  <Form.Check
                    label="Full Description"
                    checked={fullDescription}
                    onChange={(e) => setFullDescription(e.target.checked)}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handlePrint}>
          PRINT
        </Button>
        <Button variant="outline-secondary" onClick={onHide}>
          EXIT
        </Button>
      </Modal.Footer>

      {showPreview && (
        <LedgerPreviewModal
          show={showPreview}
          onHide={() => setShowPreview(false)}
          printPayload={printPayload}
        />
      )}
    </Modal>
  );
};

export default LedgerPrint;
