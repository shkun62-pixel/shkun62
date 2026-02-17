import React, { useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";
import InputMask from "react-input-mask";
import axios from "axios";

const style = {
  position: "absolute",
  top: "30%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "#f0f0f0",
  border: "2px solid #999",
  boxShadow: 24,
  p: 3,
  borderRadius: 2,
};

const RepostingModal = ({ open, onClose }) => {

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reposting: "Sale Bills",
    from: "01-04-2025",
    to: "30-03-2026",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOk = async () => {
    try {
      // Validate date
      if (!formData.from || !formData.to) {
        alert("Please enter both FROM and UPTO dates");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/repost/sale-fafile",
        {
          repostingType: formData.reposting,
          fromDate: formData.from,
          toDate: formData.to,
        }
      );

      console.log("API Response:", response.data);

      alert("Reposting saved successfully!");

      onClose();
    } catch (error) {
      console.error("API Save Error:", error);
      alert("Failed to save posting – check console for details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        
        {/* Title */}
        <Typography variant="h6" mb={2}>
          Re-write Books
        </Typography>

        <Grid container spacing={2}>

          {/* Check Vouchers */}
          <Grid item xs={12}>
            <Button variant="outlined" fullWidth>
              Check Vouchers
            </Button>
          </Grid>

          {/* Reposting Dropdown */}
          <Grid item xs={12}>
            <TextField
              className="custom-bordered-input"
              select
              fullWidth
              label="REPOSTING"
              name="reposting"
              value={formData.reposting}
              onChange={handleChange}
              size="small"
              variant="filled"
            >
              <MenuItem value="Sale Bills">Sale Bills</MenuItem>
              <MenuItem value="Purchase Bills">Purchase Bills</MenuItem>
              <MenuItem value="Journal Vouchers">Journal Vouchers</MenuItem>
              <MenuItem value="Bank Vouchers">Bank Vouchers</MenuItem>
              <MenuItem value="Cash Vouchers">Cash Vouchers</MenuItem>
              <MenuItem value="TDS Vouchers">TDS Vouchers</MenuItem>
              <MenuItem value="Credit Note">Credit Note</MenuItem>
              <MenuItem value="Debit Note">Debit Note</MenuItem>
              <MenuItem value="All Vouchers">All Vouchers</MenuItem>
            </TextField>
          </Grid>

          {/* Starting Date */}
          <Grid item xs={6}>
            <InputMask
              className="custom-bordered-input"
              mask="99-99-9999"
              value={formData.from}
              onChange={handleChange}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  fullWidth
                  label="FROM"
                  name="from"
                  placeholder="DD-MM-YYYY"
                  size="small"
                  variant="filled"
                />
              )}
            </InputMask>
          </Grid>

          {/* Ending Date */}
          <Grid item xs={6}>
            <InputMask
              className="custom-bordered-input"
              mask="99-99-9999"
              value={formData.to}
              onChange={handleChange}
            >
              {(inputProps) => (
                <TextField
                  {...inputProps}
                  fullWidth
                  label="UPTO"
                  name="to"
                  placeholder="DD-MM-YYYY"
                  size="small"
                  variant="filled"
                />
              )}
            </InputMask>
          </Grid>

          {/* Buttons */}
          <Grid item xs={6}>
            <Button
              onClick={onClose}
              variant="outlined"
              color="error"
              fullWidth
            >
              Exit
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
              onClick={handleOk}
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? "Saving..." : "Ok"}
            </Button>
          </Grid>

        </Grid>
      </Box>
    </Modal>
  );
};

export default RepostingModal;
