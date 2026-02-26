import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import Table from "react-bootstrap/Table";

const MIN_ROWS = 8;

const StyledModal = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  height: "80vh",
  backgroundColor: "#f9fbff",
  boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
  borderRadius: 15,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
});

const Header = styled(Box)({
  background: "linear-gradient(90deg, #1976d2, #42a5f5)",
  padding: "12px 20px",
  color: "white",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const CloseButton = styled("button")({
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "white",
});

const Footer = styled(Box)({
  padding: 10,
  borderTop: "1px solid #ddd",
  display: "flex",
  justifyContent: "flex-end",
  background: "#f1f5f9",
});

const getEmptyRow = (id) => ({
  id,
  ahead: "",
  form_type: "",
  led_post: "",
  vat_post: "",
  ex_post: "",
  serial: "",
  short_name: "",
  stk_post: "",
  form_rtype: "",
  rep_name: "",
  bill_no_h: "",
  salef3: "",
  tick: "",
  vacode: "",
  rep_gst: "",
});

const SaleWin = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState([]);

  // Load Data
  useEffect(() => {
    const stored = localStorage.getItem("SaleWin");
    let data = stored ? JSON.parse(stored) : [];

    // Ensure minimum rows
    while (data.length < MIN_ROWS) {
      data.push(getEmptyRow(data.length + 1));
    }

    setFormData(data);
  }, []);

  const handleInputChange = (event, index, field) => {
    const updated = [...formData];
    updated[index][field] = event.target.value;
    setFormData(updated);
  };

  // Save Only Filled Rows
  const handleSave = () => {
    const filtered = formData.filter((row) =>
      Object.values(row).some((val) => val !== "")
    );

    localStorage.setItem("SaleWin", JSON.stringify(filtered));
    alert("Saved Successfully!");
    onClose();
  };

  const handleAddRow = () => {
    setFormData([...formData, getEmptyRow(formData.length + 1)]);
  };

  return (
    <Modal open={isOpen} onClose={onClose} style={{zIndex: 100000}}>
      <StyledModal>

        {/* Header */}
        <Header>
          <Typography variant="h6">Sale Series</Typography>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </Header>

        {/* Table Section */}
        <Box sx={{ flex: 1, overflow: "auto", padding: 2, overflowX: "auto" }}>
          <Table bordered hover size="sm" className="custom-table">
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "#1976d2",
                color: "white",
                textAlign: "center",
              }}
            >
              <tr>
                <th style={{width:300}}>Ahead</th>
                <th>Form_Type</th>
                <th>Led_Post</th>
                <th>Vat_Post</th>
                <th>Ex_Post</th>
                <th>Serial</th>
                <th>Short_Name</th>
                <th>Stk_Post</th>
                <th>Form_Rtype</th>
                <th>Rep_Name</th>
                <th>Bill_No</th>
                <th>Sale_F3</th>
                <th>Tick</th>
                <th>Vacode</th>
                <th>Rep_GST</th>
              </tr>
            </thead>

            <tbody>
              {formData.map((item, index) => (
                <tr key={index}>
                  {Object.keys(getEmptyRow()).slice(1).map((field) => (
                    <td key={field} style={{ padding: 0 }}>
                      <input
                        style={{
                          height: 35,
                          width: "100%",
                          border: "none",
                          padding: 5,
                          background: "#ffffff",
                        }}
                        value={item[field]}
                        onChange={(e) =>
                          handleInputChange(e, index, field)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </Box>

        {/* Footer */}
        <Footer>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddRow}
            sx={{ marginRight: 2 }}
          >
            Add Row
          </Button>

          <Button variant="contained" color="success" onClick={handleSave}>
            Save
          </Button>
        </Footer>

      </StyledModal>
    </Modal>
  );
};

export default SaleWin;