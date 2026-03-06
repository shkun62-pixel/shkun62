import React, { useContext, useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Paper,
  Divider,
  InputAdornment,
  Fade,
  Backdrop,
} from "@mui/material";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import FactCheckRoundedIcon from "@mui/icons-material/FactCheckRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import InputMask from "react-input-mask";
import axios from "axios";
import { CompanyContext } from "../Context/CompanyContext";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "94%", sm: 520 },
  borderRadius: "24px",
  overflow: "hidden",
  outline: "none",
  boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)",
  bgcolor: "#ffffff",
};

const fieldSx = {
  "& .MuiFilledInput-root": {
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    transition: "all 0.25s ease",
    overflow: "hidden",
    "&:hover": {
      backgroundColor: "#f8fafc",
      borderColor: "#94a3b8",
    },
    "&.Mui-focused": {
      backgroundColor: "#fff",
      borderColor: "#6366f1",
      boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.10)",
    },
    "&:before, &:after": {
      display: "none",
    },
  },
  "& .MuiInputLabel-root": {
    fontWeight: 600,
    color: "#475569",
  },
};

const RepostingModal = ({ open, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reposting: "Sale Bills",
    from: "01-04-2025",
    to: "30-03-2026",
  });

  const { company } = useContext(CompanyContext);
  const tenant = company?.databaseName;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // API mapping
  const apiMap = {
    "Sale Bills": "/repost/sale-fafile",
    "Purchase Bills": "/repost/purchase-fafile",
    "Cash Vouchers": "/repost/cash-fafile",
    "Bank Vouchers": "/repost/bank-fafile",
  };

  const handleOk = async () => {
    try {
      if (!formData.from || !formData.to) {
        alert("Please enter both FROM and UPTO dates");
        return;
      }

      const apiPath = apiMap[formData.reposting];

      if (!apiPath) {
        alert("API not configured for this voucher type");
        return;
      }

      setLoading(true);

      const response = await axios.post(
        `https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant${apiPath}`,
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
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
          sx: {
            background: "rgba(15, 23, 42, 0.45)",
            backdropFilter: "blur(6px)",
          },
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          {/* Header */}
          <Box
            sx={{
              px: 3,
              py: 2.5,
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "#fff",
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" alignItems="center" gap={1.5}>
                <Box
                  sx={{
                    width: 46,
                    height: 46,
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "rgba(255,255,255,0.16)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <AutorenewRoundedIcon sx={{ fontSize: 24 }} />
                </Box>

                <Box>
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                  >
                    Re-write Books
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.88rem",
                      opacity: 0.9,
                      mt: 0.4,
                    }}
                  >
                    Repost voucher entries within a selected date range
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Body */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 0,
              bgcolor: "#ffffff",
            }}
          >
            <Grid container spacing={2.2}>
              {/* Check Vouchers */}
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<FactCheckRoundedIcon />}
                  sx={{
                    height: 48,
                    borderRadius: "14px",
                    textTransform: "none",
                    fontWeight: 700,
                    borderColor: "#cbd5e1",
                    color: "#334155",
                    backgroundColor: "#f8fafc",
                    "&:hover": {
                      borderColor: "#6366f1",
                      backgroundColor: "#eef2ff",
                    },
                  }}
                >
                  Check Vouchers
                </Button>
              </Grid>

              {/* Reposting Type */}
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="REPOSTING"
                  name="reposting"
                  value={formData.reposting}
                  onChange={handleChange}
                  size="small"
                  variant="filled"
                  sx={fieldSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ReceiptLongRoundedIcon sx={{ color: "#6366f1", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  }}
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

              {/* Date Range Title */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    px: 1,
                    pt: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.92rem",
                      fontWeight: 700,
                      color: "#334155",
                      mb: 0.7,
                    }}
                  >
                    Select Date Range
                  </Typography>
                  <Divider />
                </Box>
              </Grid>

              {/* From Date */}
              <Grid item xs={12} sm={6}>
                <InputMask
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
                      sx={fieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthRoundedIcon
                              sx={{ color: "#6366f1", fontSize: 20 }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </InputMask>
              </Grid>

              {/* To Date */}
              <Grid item xs={12} sm={6}>
                <InputMask
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
                      sx={fieldSx}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonthRoundedIcon
                              sx={{ color: "#6366f1", fontSize: 20 }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                </InputMask>
              </Grid>

              {/* Footer Buttons */}
              <Grid item xs={12}>
                <Box
                  sx={{
                    mt: 1,
                    display: "flex",
                    gap: 1.5,
                    justifyContent: "flex-end",
                    flexWrap: "wrap",
                  }}
                >
                  <Button
                    onClick={onClose}
                    variant="outlined"
                    startIcon={<CloseRoundedIcon />}
                    sx={{
                      minWidth: 120,
                      height: 46,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 700,
                      borderColor: "#fecaca",
                      color: "#dc2626",
                      backgroundColor: "#fff5f5",
                      "&:hover": {
                        borderColor: "#ef4444",
                        backgroundColor: "#fee2e2",
                      },
                    }}
                  >
                    Exit
                  </Button>

                  <Button
                    onClick={handleOk}
                    variant="contained"
                    startIcon={<DoneRoundedIcon />}
                    disabled={loading}
                    sx={{
                      minWidth: 140,
                      height: 46,
                      borderRadius: "14px",
                      textTransform: "none",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                      boxShadow: "0 12px 24px rgba(99, 102, 241, 0.28)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #4338ca 0%, #6d28d9 100%)",
                        boxShadow: "0 14px 28px rgba(99, 102, 241, 0.34)",
                      },
                      "&.Mui-disabled": {
                        color: "#fff",
                        opacity: 0.7,
                      },
                    }}
                  >
                    {loading ? "Saving..." : "Ok"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
};

export default RepostingModal;