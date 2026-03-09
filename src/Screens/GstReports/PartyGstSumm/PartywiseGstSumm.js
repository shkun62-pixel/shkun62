import React, { useState, useEffect } from "react";
import {
  Modal,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";
import InputMask from "react-input-mask";
import GSTPrintModal from "./GSTPrintModal";
import axios from "axios";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 720,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

export default function PartywiseGstSumm({ open, handleClose }) {
  const [formData, setFormData] = useState({
    startDate: "01-04-2025",
    endDate: "30-03-2026",
    listType: "Sale",
    dateCondition: "As Per Voucher Date",
    reportType: "List.1 A4 Paper",
    city: "",
    state: "",
    agent: "",
    account: "All",
    condition: "Pending",
    taxType: "All",
  });
  const [openPrint, setOpenPrint] = useState(false);
  const [accounts, setAccounts] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axios.get(
          "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/ledgerAccount"
        );

        if (res.data?.data) {
          setAccounts(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        handleClose();
      }}
      backdrop="static"
    >
      <Paper sx={style}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          Party Wise GST Detail
        </Typography>

        <Grid container spacing={3}>
          {/* LEFT SIDE FORM */}
          <Grid item xs={8}>
            <Grid container spacing={2}>
              {/* Starting Date */}
              <Grid item xs={6}>
                <InputMask
                  mask="99-99-9999"
                  value={formData.startDate}
                  onChange={handleChange}
                >
                  {() => (
                    <TextField
                      label="Starting Date"
                      name="startDate"
                      fullWidth
                      size="small"
                    />
                  )}
                </InputMask>
              </Grid>

              {/* Ending Date */}
              <Grid item xs={6}>
                <InputMask
                  mask="99-99-9999"
                  value={formData.endDate}
                  onChange={handleChange}
                >
                  {() => (
                    <TextField
                      label="Ending Date"
                      name="endDate"
                      fullWidth
                      size="small"
                    />
                  )}
                </InputMask>
              </Grid>

              {/* Sale/Purchase */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="List Sale/Purchase"
                  name="listType"
                  value={formData.listType}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="Sale">Sale</MenuItem>
                  <MenuItem value="Purchase">Purchase</MenuItem>
                </TextField>
              </Grid>

              {/* Date Condition */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Date Condition"
                  name="dateCondition"
                  value={formData.dateCondition}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="As Per Voucher Date">
                    As Per Voucher Date
                  </MenuItem>
                  <MenuItem value="As Per Bill Date">As Per Bill Date</MenuItem>
                </TextField>
              </Grid>

              {/* Report Type */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Report Type"
                  name="reportType"
                  value={formData.reportType}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="List.1 A4 Paper">List.1 A4 Paper</MenuItem>
                  <MenuItem value="Summary">Summary</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="City Name"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Agent"
                  name="agent"
                  value={formData.agent}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="A/c Name"
                  name="account"
                  value={formData.account}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="All">-All-</MenuItem>
                  {accounts.map((acc) => (
                    <MenuItem key={acc._id} value={acc.formData?.ahead}>
                      {acc.formData?.ahead}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="Condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  select
                  label="Tax Type"
                  name="taxType"
                  value={formData.taxType}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="GST Sale (RD)">GST Sale (RD)</MenuItem>
                  <MenuItem value="IGST Sale (RD)">IGST Sale (RD)</MenuItem>
                  <MenuItem value="GST (URD)">GST (URD)</MenuItem>
                  <MenuItem value="IGST (URD)">IGST (URD)</MenuItem>
                  <MenuItem value="Tax Free Within State">
                    Tax Free Within State
                  </MenuItem>
                  <MenuItem value="Tax Free Interstate">
                    Tax Free Interstate
                  </MenuItem>
                  <MenuItem value="Export Sale">Export Sale</MenuItem>
                  <MenuItem value="Export Sale(IGST)">
                    Export Sale(IGST)
                  </MenuItem>
                  <MenuItem value="Including GST">Including GST</MenuItem>
                  <MenuItem value="Including IGST">Including IGST</MenuItem>
                  <MenuItem value="Not Applicable">Not Applicable</MenuItem>
                  <MenuItem value="Exempted Sale">Exempted Sale</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Grid>

          {/* RIGHT SIDE BUTTONS */}
          <Grid item xs={4}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <Button variant="contained" fullWidth>
                  Add Number
                </Button>
              </Grid>

              <Grid item>
                <Button variant="contained" fullWidth onClick={() => setOpenPrint(true)}>
                  Print List
                </Button>
                <GSTPrintModal
                  open={openPrint}
                  handleClose={() => setOpenPrint(false)}
                  type={formData.listType}
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  city={formData.city}
                  state={formData.state}
                  agent={formData.agent}
                  accountname = {formData.account}
                  condition = {formData.condition}
                  taxType = {formData.taxType}
                />
              </Grid>

              <Grid item>
                <Button variant="contained" fullWidth>
                  Reminder
                </Button>
              </Grid>

              <Grid item>
                <Button
                  variant="outlined"
                  color="error"
                  fullWidth
                  onClick={handleClose}
                >
                  Exit
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Modal>
  );
}
