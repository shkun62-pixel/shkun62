import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import InputMask from "react-input-mask";
import financialYear from "../../Shared/financialYear";
import styles from "../GstReport.module.css";
import AcwiseGstPreviewModal from "./AcwiseGstPreviewModal";

const AcwiseGstRep = ({ show, onHide }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const [reportType, setReportType] = useState("Sale");
  const [fromDate, setFromDate] = useState("");
  const [uptoDate, setUptoDate] = useState("");
  const [state, setState] = useState("All");
  const [grouping, setGrouping] = useState("Gross");
  const [b2bType, setB2bType] = useState("All");

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
    setFromDate(formatDate(fy.start));
    setUptoDate(formatDate(fy.end));
  }, []);

  const handlePrint = () => {
    setPreviewData({
      reportType,
      fromDate,
      uptoDate,
      state,
      grouping,
      b2bType,
    });

    setShowPreview(true);
    // onHide(); // uncomment if you want to close first modal
  };

  return (
    <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
      {/* Header */}
      <Modal.Header closeButton className={styles.modalHeader}>
        <Modal.Title className={styles.modalTitle}>
          Ledger Account GST Report
        </Modal.Title>
      </Modal.Header>

      {/* Body */}
      <Modal.Body className={styles.modalBody}>
        {/* Sale / Purchase / All */}
        <div className={styles.radioGroup}>
          {["Sale", "Purchase", "All"].map((t) => (
            <Form.Check
              key={t}
              inline
              label={t}
              name="type"
              type="radio"
              value={t}
              checked={reportType === t}
              className={styles.radioLabel}
              onChange={(e) => setReportType(e.target.value)}
            />
          ))}
        </div>

        {/* From */}
        <div className={`${styles.inputWrapper} mb-2`}>
          <InputMask
            className="custom-bordered-input"
            mask="99-99-9999"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          >
            {(props) => (
              <TextField
                {...props}
                label="FROM"
                size="small"
                variant="filled"
                fullWidth
              />
            )}
          </InputMask>
        </div>

        {/* Upto */}
        <div className={`${styles.inputWrapper} mb-2`}>
          <InputMask
            className="custom-bordered-input"
            mask="99-99-9999"
            value={uptoDate}
            onChange={(e) => setUptoDate(e.target.value)}
          >
            {(props) => (
              <TextField
                {...props}
                label="UPTO"
                size="small"
                variant="filled"
                fullWidth
              />
            )}
          </InputMask>
        </div>

        {/* State */}
        <div className={`${styles.inputWrapper} mb-2`}>
          <FormControl
            className="custom-bordered-input"
            variant="filled"
            fullWidth
            size="small"
          >
            <InputLabel>STATE</InputLabel>
            <Select value={state} onChange={(e) => setState(e.target.value)}>
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="withinstate">With In State</MenuItem>
              <MenuItem value="outofstate">Out Of State</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* Grouping */}
        <div className={`${styles.inputWrapper} mb-2`}>
          <FormControl
            className="custom-bordered-input"
            variant="filled"
            fullWidth
            size="small"
          >
            <InputLabel>GROUPING</InputLabel>
            <Select
              value={grouping}
              onChange={(e) => setGrouping(e.target.value)}
            >
              <MenuItem value="Gross">Gross</MenuItem>
              <MenuItem value="Detail">Detail</MenuItem>
            </Select>
          </FormControl>
        </div>

        {/* B2B / B2C */}
        <div className={`${styles.inputWrapper} mb-3`}>
          <FormControl
            className="custom-bordered-input"
            variant="filled"
            fullWidth
            size="small"
          >
            <InputLabel>B2B / B2C</InputLabel>
            <Select
              value={b2bType}
              onChange={(e) => setB2bType(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="B2B">B2B Registered</MenuItem>
              <MenuItem value="B2C">B2C Un-Reg</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Modal.Body>

      {/* Footer */}
      <Modal.Footer className={styles.modalFooter}>
        <Button
          className={styles.footerBtn}
          variant="primary"
          onClick={handlePrint}
        >
          PRINT
        </Button>
        {showPreview && previewData && (
  <AcwiseGstPreviewModal
    show={showPreview}
    onHide={() => setShowPreview(false)}
    filters={previewData}
  />
)}

        <Button
          className={styles.footerBtn}
          variant="secondary"
          onClick={onHide}
        >
          EXIT
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AcwiseGstRep;
