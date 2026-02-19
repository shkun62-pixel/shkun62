import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import InputMask from "react-input-mask";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "#f9fafc",
  borderRadius: "10px",
  boxShadow: 24,
  p: 0,
  overflow: "hidden",
};

export default function MonthlyFormModal({ open, onClose }) {
  const [formData, setFormData] = useState({
    reportName: "GSTR-8A Yearly Compare",
    fromDate: "01/04/2025",
    toDate: "30/03/2026",
    rewriteHSN: false,
    taxTypeAuto: true,
    previousCGST: "0.00",
    previousSGST: "0.00",
    previousIGST: "0.00",
    previousCess: "0.00",
    selectSeries: false,
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(90deg, #1976d2, #0d47a1)",
            color: "white",
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Monthly GST Reports
          </Typography>
        </Box>

        {/* Body */}
        <Box sx={{ p: 3 }}>
          {/* Report Name */}
          <Typography fontWeight="bold" mb={1}>
            Report Name
          </Typography>
          <Select
            fullWidth
            size="small"
            name="reportName"
            value={formData.reportName}
            onChange={handleChange}
          >
            <MenuItem value="GSTR-8A Yearly Compare">
              GSTR-8A Yearly Compare
            </MenuItem>
            <MenuItem value="GSTR-1 Summary">GSTR-1 Summary</MenuItem>
            <MenuItem value="GSTR-3B Summary">GSTR-3B Summary</MenuItem>
          </Select>

          {/* Checkboxes */}
          <Grid container spacing={2} mt={2}>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rewriteHSN"
                    checked={formData.rewriteHSN}
                    onChange={handleChange}
                  />
                }
                label="Re-Write HSN"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="taxTypeAuto"
                    checked={formData.taxTypeAuto}
                    onChange={handleChange}
                  />
                }
                label="Tax Type Auto"
              />
            </Grid>
          </Grid>

          {/* Date Fields with InputMask */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <Typography>From</Typography>
              <InputMask
                mask="99/99/9999"
                value={formData.fromDate}
                onChange={handleChange}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                    size="small"
                    name="fromDate"
                    placeholder="DD/MM/YYYY"
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item xs={6}>
              <Typography>Upto</Typography>
              <InputMask
                mask="99/99/9999"
                value={formData.toDate}
                onChange={handleChange}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                    size="small"
                    name="toDate"
                    placeholder="DD/MM/YYYY"
                  />
                )}
              </InputMask>
            </Grid>
          </Grid>

          {/* Previous Balance Section */}
          <Divider sx={{ my: 3 }} />
          <Typography fontWeight="bold" color="primary" mb={2}>
            Previous Balances
          </Typography>

          <Grid container spacing={2}>
            {["previousCGST", "previousSGST", "previousIGST", "previousCess"].map(
              (field) => (
                <Grid item xs={6} key={field}>
                  <TextField
                    fullWidth
                    size="small"
                    label={field.replace("previous", "")}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    type="number"
                  />
                </Grid>
              )
            )}
          </Grid>

          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Checkbox
                name="selectSeries"
                checked={formData.selectSeries}
                onChange={handleChange}
              />
            }
            label="Select Series"
          />
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            p: 2,
            backgroundColor: "#eef2f7",
          }}
        >
          <Button variant="outlined" color="inherit" onClick={onClose}>
            Exit
          </Button>
          <Button variant="contained" color="success">
            Export
          </Button>
          <Button variant="contained" color="primary">
            Print
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
