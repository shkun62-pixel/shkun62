import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputMask from "react-input-mask";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import HsnResultModal from "./HsnResultModal";

const HsnDetailModal = ({ show, onHide }) => {
  const [purSale, setPurSale] = useState("Purchase");
  const [grossDetail, setGrossDetail] = useState("Gross");
  const [rewriteHSN, setRewriteHSN] = useState(false);
  const [fromDate, setFromDate] = useState("01-04-2025");
  const [toDate, setToDate] = useState("31-03-2026");
  const [showHsnDetail, setShowHsnDetail] = useState(false);
  const [hsnType, setHsnType] = useState(""); // Sale | Purchase
  const [hsnData, setHsnData] = useState([]);

  const handlePrint = async (purSale) => {
    setHsnType(purSale);

    if (purSale === "Sale") {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale",
      );
      setHsnData(res.data);
    } else {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/Purchase",
      );
      setHsnData(res.data);
    }

    setShowHsnDetail(true);
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">HSN Detail</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Check
            type="checkbox"
            label="Re-write HSN"
            className="mb-3"
            checked={rewriteHSN}
            onChange={(e) => setRewriteHSN(e.target.checked)}
          />

          {/* Period From */}
          <div
            className="d-flex align-items-center mb-2"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <InputMask
              mask="99-99-9999"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            >
              {(props) => (
                <TextField
                  className="custom-bordered-input"
                  {...props}
                  label="FROM"
                  size="small"
                  variant="filled"
                  fullWidth
                  style={{ width: 230 }}
                />
              )}
            </InputMask>

            {/* To date */}
            <InputMask
              mask="99-99-9999"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            >
              {(props) => (
                <TextField
                  className="custom-bordered-input"
                  {...props}
                  label="UPTO"
                  size="small"
                  variant="filled"
                  fullWidth
                  style={{ width: 230, marginLeft: 5 }}
                />
              )}
            </InputMask>
          </div>

          {/* Pur / Sale (MUI Select) */}
          <div className="d-flex align-items-center mb-2">
            <FormControl
              className="custom-bordered-input"
              variant="filled"
              size="small"
              fullWidth
            >
              <InputLabel>PURCHASE / SALE</InputLabel>
              <Select
                value={purSale}
                label="Pur/Sale"
                onChange={(e) => setPurSale(e.target.value)}
              >
                <MenuItem value="Purchase">Purchase</MenuItem>
                <MenuItem value="Sale">Sale</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* Gross / Detail (MUI Select) */}
          <div className="d-flex align-items-center">
            <FormControl
              className="custom-bordered-input"
              variant="filled"
              size="small"
              fullWidth
            >
              <InputLabel>GROSS / DETAIL</InputLabel>
              <Select
                value={grossDetail}
                label="Gross/Detail"
                onChange={(e) => setGrossDetail(e.target.value)}
              >
                <MenuItem value="Gross">Gross</MenuItem>
                <MenuItem value="Detail">Detail</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={() => handlePrint(purSale)}>
          PRINT
        </Button>
        <HsnResultModal
          show={showHsnDetail}
          onHide={() => setShowHsnDetail(false)}
          data={hsnData}
          type={hsnType}
          fromDate = {fromDate}
          toDate = {toDate}
        />
        <Button variant="secondary" onClick={onHide}>
          EXIT
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HsnDetailModal;
