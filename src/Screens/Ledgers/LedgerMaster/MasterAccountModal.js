import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import {
  Box,
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
  Autocomplete,
} from "@mui/material";
import axios from "axios";
import PrintModal from "./PrintModal";
import SelectionModal from "./SelectionModal";

const INDIA_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

const MasterAccountModal = ({ show, onHide }) => {
  // ================= STATE VARIABLES =================
  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  const [cityName, setCityName] = useState("");
  const [address1, setAddress1] = useState("");
  const [stateName, setStateName] = useState("");
  const [agent, setAgent] = useState("");
  const [msmeStatus, setMsmeStatus] = useState("");
  const [occasionDate, setOccasionDate] = useState("");
  const [area, setArea] = useState("");
  const [group, setGroup] = useState("");
  const [groupList, setGroupList] = useState([]);
  const [fullAddress, setFullAddress] = useState("Yes");
  const [orderBy, setOrderBy] = useState("Account Name");
  const [format, setFormat] = useState("Excise");
  const [cancelledTinExist, setCancelledTinExist] = useState(false);

  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);

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
  };

  useEffect(() => {
    if (!show) return; // load only when modal opens

    const fetchGroups = async () => {
      try {
        const res = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/anexure`,
        );
        setGroupList(res.data || []);
      } catch (err) {
        console.error("Failed to load group list", err);
      }
    };

    fetchGroups();
  }, [show]);

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
                    <Autocomplete
                      size="small"
                      options={INDIA_STATES}
                      value={stateName || null}
                      onChange={(e, newValue) => setStateName(newValue || "")}
                      renderInput={(params) => (
                        <TextField {...params} label="State" fullWidth />
                      )}
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
                        <MenuItem value="Micro Enterprises">
                          Micro Enterprises
                        </MenuItem>
                        <MenuItem value="Small Enterprises">
                          Small Enterprises
                        </MenuItem>
                        <MenuItem value="Medium Enterprises">
                          Medium Enterprises
                        </MenuItem>
                        <MenuItem value="Not Covered in MSMED">
                          Not Covered in MSMED
                        </MenuItem>
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
                    <Autocomplete
                      size="small"
                      options={groupList}
                      getOptionLabel={(option) => option.formData.name || ""}
                      value={
                        groupList.find((g) => g.formData.name === group) || null
                      }
                      onChange={(e, newValue) =>
                        setGroup(newValue ? newValue.formData.name : "")
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Group" fullWidth />
                      )}
                    />
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
                        <MenuItem value="Account Code">Account Code</MenuItem>
                        <MenuItem value="GST No">GST No</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Section */}
              <Grid item xs={12} md={4}>
                {/* <FormControl component="fieldset" sx={{ mb: 2 }}>
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
                </FormControl> */}

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
            PRINT
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowSelectionModal(true)}
          >
            SELECTION
          </Button>

          <Button variant="danger" onClick={onHide}>
            EXIT
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Print Modal */}
      <PrintModal
        show={showPrintModal}
        onHide={() => setShowPrintModal(false)}
        filters={filters}
        selectedAccounts={selectedAccounts}
      />
      {/* Selection Modal */}
      <SelectionModal
        show={showSelectionModal}
        onHide={() => setShowSelectionModal(false)}
        selectedAccounts={selectedAccounts}
        setSelectedAccounts={setSelectedAccounts}
      />
    </>
  );
};

export default MasterAccountModal;
