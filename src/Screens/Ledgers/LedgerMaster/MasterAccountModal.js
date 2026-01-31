import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  TextField,
} from "@mui/material";

import PrintModal from "./PrintModal"; // Import your PrintModal component

const MasterAccountModal = ({ show, onHide }) => {
  // ================= STATE VARIABLES =================
  const [cityName, setCityName] = useState("");
  const [address1, setAddress1] = useState("");
  const [stateName, setStateName] = useState("");
  const [agent, setAgent] = useState("");
  const [msmeStatus, setMsmeStatus] = useState("");
  const [occasionDate, setOccasionDate] = useState("");
  const [area, setArea] = useState("");
  const [group, setGroup] = useState("");
  const [fullAddress, setFullAddress] = useState("Yes");
  const [orderBy, setOrderBy] = useState("Account Name");
  const [format, setFormat] = useState("Excise");
  const [cancelledTinExist, setCancelledTinExist] = useState(false);
  const [cashCustomer, setCashCustomer] = useState(false);

  // Show PrintModal state
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Collect filters to send to PrintModal
  const filters = {
    cityName,
    address1,
    stateName,
    agent,
    msmeStatus,
    occasionDate,
    area,
    group,
    fullAddress,
    orderBy,
    format,
    cancelledTinExist,
    cashCustomer,
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Master Account List</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Box sx={{ width: "100%" }}>
            <Grid container spacing={2}>
              {/* Left Section */}
              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City Name"
                      size="small"
                      fullWidth
                      value={cityName}
                      onChange={(e) => setCityName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Add.1"
                      size="small"
                      fullWidth
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="State"
                      size="small"
                      fullWidth
                      value={stateName}
                      onChange={(e) => setStateName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Agent"
                      size="small"
                      fullWidth
                      value={agent}
                      onChange={(e) => setAgent(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>MSME Status</InputLabel>
                      <Select
                        value={msmeStatus}
                        label="MSME Status"
                        onChange={(e) => setMsmeStatus(e.target.value)}
                      >
                        <MenuItem value="">Select</MenuItem>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Occasion Date"
                      type="date"
                      size="small"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={occasionDate}
                      onChange={(e) => setOccasionDate(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Area"
                      size="small"
                      fullWidth
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Group</InputLabel>
                      <Select
                        value={group}
                        label="Group"
                        onChange={(e) => setGroup(e.target.value)}
                      >
                        <MenuItem value="">Select</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Full Address</InputLabel>
                      <Select
                        value={fullAddress}
                        label="Full Address"
                        onChange={(e) => setFullAddress(e.target.value)}
                      >
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Order By</InputLabel>
                      <Select
                        value={orderBy}
                        label="Order By"
                        onChange={(e) => setOrderBy(e.target.value)}
                      >
                        <MenuItem value="Account Name">Account Name</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Section */}
              <Grid item xs={12} md={4}>
                <FormControl component="fieldset" sx={{ mb: 2 }}>
                  <RadioGroup
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                  >
                    <FormControlLabel
                      value="Excise"
                      control={<Radio />}
                      label="Excise Format"
                    />
                    <FormControlLabel
                      value="Simple"
                      control={<Radio />}
                      label="Simple Format"
                    />
                    <FormControlLabel
                      value="Label"
                      control={<Radio />}
                      label="Label Format"
                    />
                  </RadioGroup>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={cancelledTinExist}
                      onChange={(e) => setCancelledTinExist(e.target.checked)}
                    />
                  }
                  label="Cancelled Tin A/c Exist"
                  sx={{ mb: 2 }}
                />
              </Grid>
            </Grid>
          </Box>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowPrintModal(true)}>
            Print
          </Button>
          <Button variant="primary">Export</Button>
          <Button variant="secondary">Selection</Button>
          <Button variant="danger" onClick={onHide}>
            Exit
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Print Modal */}
      <PrintModal
        show={showPrintModal}
        onHide={() => setShowPrintModal(false)}
        filters={filters}
      />
    </>
  );
};

export default MasterAccountModal;
