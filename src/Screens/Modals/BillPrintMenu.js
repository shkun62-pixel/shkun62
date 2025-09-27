import React, { useState, useEffect, useRef } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

const StyledModal = styled(Box)({
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "40%",
  height: "70%",
  backgroundColor: "lavender",
  border: "2px solid black",
  padding: 16,
  borderRadius: 10,
});

const BillPrintMenu = ({ isOpen, onClose, preview,formDataSale, handlePrint, setSelectedCopies, onFaView  }) => {
  const [formData, setFormData] = useState({
    challan: false,
    qrcode: false,
    bilty: false,
    invoice: false,
    original: true,
    duplicate: false,
    triplicate: false,
    officeCopy: false,
    extraCopy: false,
    directEmail: false,
    hsnGroupWise: false,
    Billfrom:"",
    Billupto:"",
  });

    const handleNumericValue = (event) => {
    const { id, value } = event.target;
    // Allow only numeric values, including optional decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

useEffect(() => {
  const selected = Object.keys(formData).filter(
    (key) => formData[key]
  );
  // console.log("Selected values: ", selected);
  // send only the relevant ones to parent:
  const copyTypes = selected.filter((key) =>
    ["original", "duplicate", "triplicate", "officeCopy", "extraCopy"].includes(key)
  );
  setSelectedCopies(copyTypes);
}, [formData]);


  const checkboxStyle = {
    width: "20px",
    height: "20px",
    marginRight: "8px",
  };

  const labelStyle = {
    fontSize: "17px",
    marginRight: "8px",
    fontFamily: "sans-serif",
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <StyledModal>
        <h3 style={{ textAlign: "center", color: "black", fontSize: 20,marginBottom:"25px",textDecoration:'underline' }}>
          Bill Printing Menu
        </h3>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            className="LeftSide"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <label style={labelStyle}>
                <input
                  type="checkbox"
                  name="challan"
                  checked={formData.challan}
                  onChange={handleChange}
                  style={checkboxStyle}
                />
                Challan
              </label>
              <label style={labelStyle}>
                <input
                  type="checkbox"
                  name="qrcode"
                  checked={formData.qrcode}
                  onChange={handleChange}
                  style={checkboxStyle}
                />
                Qrcode
              </label>
              <label style={labelStyle}>
                <input
                  type="checkbox"
                  name="bilty"
                  checked={formData.bilty}
                  onChange={handleChange}
                  style={checkboxStyle}
                />
                Bilty
              </label>
            </div>
            <h3
              style={{
                textAlign: "center",
                color: "maroon",
                fontSize: 20,
                textDecoration: "underline",
                marginTop:"10px"
              }}
            >
              Printing Options
            </h3>
            <div style={{marginTop:"20px",display:'flex',flexDirection:'column'}}>
              <label style={labelStyle}>
                <input
                  type="checkbox"
                  name="invoice"
                  checked={formData.invoice}
                  onChange={handleChange}
                  style={checkboxStyle}
                />
                Invoice Selection
              </label>
            <TextField
            className="custom-bordered-input"
                id="Billfrom"
                label="Bill From Sr.No."
                value={formDataSale.vbillno}
                variant="filled"
                size="small"
                onChange={handleNumericValue}
                inputProps={{
                maxLength: 12,
                style: {
                    height: "20px",
                    fontSize: 17,
                },
                }}
            />
            <TextField
            className="custom-bordered-input"
                id="Billupto"
                label="Bill Upto Sr.No."
                value={formData.Billupto}
                variant="filled"
                size="small"
                onChange={handleNumericValue}
                inputProps={{
                maxLength: 12,
                style: {
                    height: "20px",
                    fontSize: 17,
                },
                }}
                sx={{mt:1}}
            />
            <h3
              style={{
                textAlign: "center",
                color: "maroon",
                fontSize: 20,
                marginTop:"10px"
              }}
            >
              E-Way Bill  Optional
            </h3>
            </div>
          </div>
          <div
            className="RightSide"
            style={{ display: "flex", flexDirection: "column",marginLeft:"20%" }}
          >
            <label style={labelStyle}>
              <input
                type="checkbox"
                name="original"
                checked={formData.original}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Original
            </label>
            <label style={labelStyle}>
              <input
                type="checkbox"
                name="duplicate"
                checked={formData.duplicate}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Duplicate
            </label>
            <label style={labelStyle}>
              <input
                type="checkbox"
                name="triplicate"
                checked={formData.triplicate}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Triplicate
            </label>
            <label style={labelStyle}>
              <input
                type="checkbox"
                name="officeCopy"
                checked={formData.officeCopy}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Office Copy
            </label>
            <label style={labelStyle}>
              <input
                type="checkbox"
                name="extraCopy"
                checked={formData.extraCopy}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Extra Copy
            </label>
            <label style={labelStyle}>
              <input
                type="checkbox"
                name="directEmail"
                checked={formData.directEmail}
                onChange={handleChange}
                style={checkboxStyle}
              />
              Direct Email
            </label>
            <label style={labelStyle}>
              <input
                type="checkbox"
                name="hsnGroupWise"
                checked={formData.hsnGroupWise}
                onChange={handleChange}
                style={checkboxStyle}
              />
              HSN Group Wise
            </label>
            <Button
            className="Buttonz"
            style={{ backgroundColor: "blueviolet", color: "white",marginLeft:"23%" }}
          >
            Form 27-C
          </Button>
          <Button
            className="Buttonz"
            style={{ backgroundColor: "blueviolet", color: "white",marginLeft:"23%" ,marginTop:5}}
          >
            E-Way File
          </Button>
          </div>
        </div>
        <div style={{marginTop:5}}>
          <Button
            className="Buttonz"
            style={{ backgroundColor: "blueviolet", color: "white" }}
          >
            HSN DETAILS
          </Button>
          <Button
            className="Buttonz"
            style={{
              backgroundColor: "blueviolet",
              color: "white",
              marginLeft: 10,
            }}
            onClick={onClose}
          >
            EXIT
          </Button>
          <Button
            className="Buttonz"
            style={{
              backgroundColor: "blueviolet",
              color: "white",
              marginLeft: 10,
            }}
            onClick={preview}
          >
            PREVIEW
          </Button>
          <Button
            className="Buttonz"
            style={{
              backgroundColor: "blueviolet",
              color: "white",
              marginLeft: 10,
            }}
            onClick={handlePrint}
          >
            PRINT
          </Button>
          <Button
           onClick={onFaView}
            className="Buttonz"
            style={{ backgroundColor: "blueviolet", color: "white",marginTop:5}}
          >
            Print Voucher
          </Button>
        </div>
      </StyledModal>
    </Modal>
  );
};

export default BillPrintMenu;
