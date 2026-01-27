import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import InputMask from "react-input-mask";
import LedgerPreviewModal from "./LedgerPreviewModal";
import financialYear from "../../Shared/financialYear";

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

  const [periodFrom, setPeriodFrom] = useState("");
  const [upto, setUpto] = useState("");
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
    setPeriodFrom(formatDate(fy.start)); // converted
    setUpto(formatDate(fy.end)); // converted
  }, []);

  const [pageBreak, setPageBreak] = useState("noBreak"); // newPage | noBreak
  const [printType, setPrintType] = useState("none"); // qty | bags | none

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

        /* 🔹 Unique BS Groups */
        const uniqueGroups = [
          ...new Set(data.map((item) => item.formData.Bsgroup).filter(Boolean)),
        ];
        setBsGroups(uniqueGroups);

        /* 🔹 Account Names (ahead) */
        const accountList = data.map((item) => ({
          id: item._id,
          name: item.formData.ahead,
          group: item.formData.Bsgroup,
        }));
        setAccounts(accountList);
      } catch (error) {
        console.error("Ledger API Error:", error);
      }
    };

    fetchLedgerAccounts();
  }, []);

  /* ===================== ACTIONS ===================== */
  const handlePrint = () => {
    const payload = {
      annexure,
      selection,
      openingBalance,
      accountFrom,
      filter,
      periodFrom,
      upto,
      pageBreak,
      printType,
      monthWiseTotal,
      dateWiseTotal,
      fullDescription,
    };

    setPrintPayload(payload);
    setShowPreview(true); // 🔥 open ledger preview modal
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop="static"
      keyboard={true}
    >
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          Printing Options
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Period */}
          <Row className="mb-3">
            <Col md={3}>
              <Form.Label>Period From</Form.Label>
              <InputMask
                mask="99-99-9999"
                value={periodFrom}
                onChange={(e) => setPeriodFrom(e.target.value)}
              >
                {(inputProps) => (
                  <Form.Control {...inputProps} placeholder="dd-mm-yyyy" />
                )}
              </InputMask>
            </Col>

            <Col md={3}>
              <Form.Label>Upto</Form.Label>
              <InputMask
                mask="99-99-9999"
                value={upto}
                onChange={(e) => setUpto(e.target.value)}
              >
                {(inputProps) => (
                  <Form.Control {...inputProps} placeholder="dd-mm-yyyy" />
                )}
              </InputMask>
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

          {/* Row 2 */}
          <Row className="mb-2">
            <Col md={6}>
              <Form.Label>Annexure</Form.Label>
              <Form.Select
                value={annexure}
                onChange={(e) => setAnnexure(e.target.value)}
              >
                <option value="">-- All Group --</option>
                {bsGroups.map((group, index) => (
                  <option key={index} value={group}>
                    {group}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6} className="d-flex align-items-end gap-3">
              <Form.Check
                type="checkbox"
                label="Selection"
                checked={selection}
                onChange={(e) => setSelection(e.target.checked)}
              />
              <Form.Check
                type="checkbox"
                label="Opening Balance"
                checked={openingBalance}
                onChange={(e) => setOpeningBalance(e.target.checked)}
              />
            </Col>
          </Row>

          {/* Row 3 */}
          <Row className="mb-2">
            <Col md={6}>
              <Form.Label>A/c From</Form.Label>
              <Form.Select
                value={accountFrom}
                onChange={(e) => setAccountFrom(e.target.value)}
              >
                <option value="">-- All Account --</option>
                {accounts
                  .filter(
                    (acc) => !annexure || acc.group === annexure, // filter by Annexure
                  )
                  .map((acc) => (
                    <option key={acc.id} value={acc.name}>
                      {acc.name}
                    </option>
                  ))}
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Label>Filter</Form.Label>
              <Form.Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option>All Accounts</option>
                <option>General Accounts</option>
                <option>Debtor/Creditor</option>
                <option>Active Dr Balance</option>
                <option>Active Cr Balance</option>
                <option>Active Nill</option>
                <option>Active Balance</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Print Options */}
          <Row className="mb-3">
            <Col md={3}>
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
            </Col>

            <Col md={4}>
              <Form.Check
                type="checkbox"
                label="Month Wise Group Total"
                checked={monthWiseTotal}
                onChange={(e) => setMonthWiseTotal(e.target.checked)}
              />
              <Form.Check
                type="checkbox"
                label="Date Wise Group Total"
                checked={dateWiseTotal}
                onChange={(e) => setDateWiseTotal(e.target.checked)}
              />
              <Form.Check
                type="checkbox"
                label="Full Description"
                checked={fullDescription}
                onChange={(e) => setFullDescription(e.target.checked)}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary">Export</Button>
        <Button variant="outline-secondary" onClick={onHide}>
          Exit
        </Button>
        <Button variant="primary" onClick={handlePrint}>
          Print
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
