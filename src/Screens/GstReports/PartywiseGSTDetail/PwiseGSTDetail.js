import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Grid,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Typography,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import InputMask from "react-input-mask";
import axios from "axios";
import PWisePrint from "./PWisePrint";

const PAGE_SIZE = 10;

const PwiseGSTDetail = ({ open, onClose }) => {
  // -------- STATES --------

  const [selectedAccountCode, setSelectedAccountCode] = useState(null);
  const [saleType, setSaleType] = useState("sale");
  const [gstType, setGstType] = useState("gst");
  const [lessNote, setLessNote] = useState(true);

  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");

  const [city, setCity] = useState("");
  const [broker, setBroker] = useState("");

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [reportOpen, setReportOpen] = useState(false);

  // Modal for Selection
  const PAGE_SIZE_SELECTION = 20;

  const [selectionModalOpen, setSelectionModalOpen] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectionSearch, setSelectionSearch] = useState("");
  const [visibleSelectionCount, setVisibleSelectionCount] = useState(PAGE_SIZE_SELECTION);

  const selectionListRef = useRef(null);
  useEffect(() => {
  setVisibleSelectionCount(PAGE_SIZE_SELECTION);
}, [selectionSearch]);

  const listRef = useRef(null);
  const searchRef = useRef(null);

  const [dates, setDates] = useState({
    from: "01-04-2025",
    upto: "30-03-2026",
  });

  // -------- FETCH ACCOUNTS --------

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/ledgerAccount",
      );

      if (res.data.ok) {
        setAccounts(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------- SEARCH RESET --------

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
    setSelectedIndex(-1);
  }, [search]);

  // -------- AUTO FOCUS --------

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        searchRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // -------- FILTER --------

  const filteredAccounts = accounts.filter((acc) =>
    acc.formData?.ahead?.toLowerCase().includes(search.toLowerCase()),
  );

  const visibleAccounts = filteredAccounts.slice(0, visibleCount);

  // -------- LOAD MORE --------

  const loadMore = () => {
    if (visibleCount < filteredAccounts.length) {
      setVisibleCount((prev) => prev + PAGE_SIZE);
    }
  };

  // -------- SCROLL LOAD --------

  const handleScroll = () => {
    const el = listRef.current;

    if (!el) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      loadMore();
    }
  };

  // -------- AUTO SCROLL WHEN NAVIGATING --------

  const scrollToItem = (index) => {
    const container = listRef.current;

    if (!container) return;

    const itemHeight = 48;
    const scrollTop = index * itemHeight;

    if (scrollTop > container.scrollTop + container.clientHeight - itemHeight) {
      container.scrollTop = scrollTop;
    }

    if (scrollTop < container.scrollTop) {
      container.scrollTop = scrollTop;
    }
  };

  // -------- SELECT ACCOUNT --------

  const handleSelectAccount = (acc, index) => {
    setSearch(acc.formData?.ahead || "");
    setCity(acc.formData?.city || "");
    setSelectedAccountCode(acc.formData?.acode);   // ⭐ important
    setSelectedIndex(index);
  };

  // -------- KEYBOARD NAVIGATION --------

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();

      setSelectedIndex((prev) => {
        const next = prev + 1;

        if (next >= visibleCount) loadMore();

        scrollToItem(next);

        return Math.min(next, filteredAccounts.length - 1);
      });
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      setSelectedIndex((prev) => {
        const next = Math.max(prev - 1, 0);

        scrollToItem(next);

        return next;
      });
    }

    if (e.key === "Enter") {
      e.preventDefault();

      const acc = filteredAccounts[selectedIndex];

      if (acc) {
        setSearch(acc.formData?.ahead || "");
        setCity(acc.formData?.city || "");
        setSelectedAccountCode(acc.formData?.acode);
      }
    }
  };

  // FILTERED ACCOUNTS

  const filteredSelectionAccounts = accounts.filter((acc) =>
    acc.formData?.ahead?.toLowerCase().includes(selectionSearch.toLowerCase())
  );

  // CHECKBOX LOGIC
  const handleCheckboxChange = (id) => {
    setSelectedAccounts((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const ids = filteredSelectionAccounts.map((acc) => acc.formData?.acode);
    setSelectedAccounts(ids);
  };

  const handleUnselectAll = () => {
    setSelectedAccounts([]);
  };

  const visibleSelectionAccounts = filteredSelectionAccounts.slice(
    0,
    visibleSelectionCount
  );
  
  const handleSelectionScroll = () => {
    const el = selectionListRef.current;

    if (!el) return;

    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
      setVisibleSelectionCount((prev) =>
        prev + PAGE_SIZE_SELECTION > filteredSelectionAccounts.length
          ? filteredSelectionAccounts.length
          : prev + PAGE_SIZE_SELECTION
      );
    }
  };

  // -------- MODAL STYLE --------

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 900,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    overflow: "hidden",
  };

  return (
    <>
    <Modal
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        onClose();
      }}
    >
      <Box sx={style}>
        {/* HEADER */}

        <Box
          sx={{
            background: "linear-gradient(90deg,#1976d2,#42a5f5)",
            color: "white",
            px: 3,
            py: 2,
          }}
        >
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Party Wise GST Detail
              </Typography>

              <Typography variant="caption">
                View GST report by ledger account
              </Typography>
            </Grid>

            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Box>

        {/* BODY */}

        <Box sx={{ p: 2 }}>
          <Grid container spacing={2}>
            {/* LEFT SIDE */}

            <Grid item xs={7}>
              {/* DATE */}

              <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <InputMask
                      mask="99-99-9999"
                      value={dates.from}
                      onChange={(e) =>
                        setDates({ ...dates, from: e.target.value })
                      }
                    >
                      {(inputProps) => (
                        <TextField
                          {...inputProps}
                          label="From"
                          fullWidth
                          size="small"
                        />
                      )}
                    </InputMask>
                  </Grid>

                  <Grid item xs={6}>
                    <InputMask
                      mask="99-99-9999"
                      value={dates.upto}
                      onChange={(e) =>
                        setDates({ ...dates, upto: e.target.value })
                      }
                    >
                      {(inputProps) => (
                        <TextField
                          {...inputProps}
                          label="Upto"
                          fullWidth
                          size="small"
                        />
                      )}
                    </InputMask>
                  </Grid>
                </Grid>
              </Paper>

              {/* ACCOUNT LIST */}

              <Paper sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="A/C Name"
                  value={search}
                  inputRef={searchRef}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ mb: 1 }}
                />

                <Box
                  ref={listRef}
                  onScroll={handleScroll}
                  sx={{
                    height: 230,
                    overflow: "auto",
                    border: "1px solid #ddd",
                    borderRadius: 1,
                  }}
                >
                  <List dense>
                    {visibleAccounts.map((item, index) => (
                      <ListItemButton
                        key={item._id}
                        selected={index === selectedIndex}
                        onClick={() => handleSelectAccount(item, index)}
                      >
                        <ListItemText
                          primary={item.formData?.ahead}
                          secondary={`${item.formData?.city || ""} ${item.formData?.state || ""}`}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Box>
              </Paper>

              {/* EXTRA FIELDS */}

              <Paper sx={{ p: 2, mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Broker"
                      value={broker}
                      onChange={(e) => setBroker(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* RIGHT SIDE */}

            <Grid item xs={5}>
              <Paper sx={{ p: 1.5, mb: 2 }}>
                <RadioGroup
                  row
                  value={saleType}
                  onChange={(e) => setSaleType(e.target.value)}
                >
                  <FormControlLabel
                    value="sale"
                    control={<Radio />}
                    label="Sale"
                  />
                  <FormControlLabel
                    value="purchase"
                    control={<Radio />}
                    label="Purchase"
                  />
                </RadioGroup>
              </Paper>

              <Paper sx={{ p: 2, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={lessNote}
                      onChange={(e) => setLessNote(e.target.checked)}
                    />
                  }
                  label="Less Dr/Cr Note"
                />

                <Divider sx={{ my: 1 }} />

                <RadioGroup
                  value={gstType}
                  onChange={(e) => setGstType(e.target.value)}
                >
                  <FormControlLabel
                    value="gst"
                    control={<Radio />}
                    label="GST Detail"
                  />
                  <FormControlLabel
                    value="hsn"
                    control={<Radio />}
                    label="HSN Wise Detail"
                  />
                  <FormControlLabel
                    value="consignment"
                    control={<Radio />}
                    label="Consignment"
                  />
                </RadioGroup>
              </Paper>

              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => setSelectionModalOpen(true)}
                  >
                    Selection
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button variant="contained" fullWidth>
                    Bill Selection
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button variant="outlined" fullWidth
                  onClick={()=> setReportOpen(true)}
                  >
                    Print
                  </Button>
                </Grid>
                <PWisePrint
                  open={reportOpen}
                  onClose={()=>setReportOpen(false)}
                  saleType={saleType}
                  dates={dates}
                  city={city}
                  broker={broker}
                  lessNote={lessNote}
                  gstType={gstType}
                  selectedAccounts={selectedAccounts}
                  selectedAccountCode={selectedAccountCode}
                />

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={onClose}
                  >
                    Exit
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>

    {/* Selection Modal */}
    <Modal
      open={selectionModalOpen}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        setSelectionModalOpen(false);
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 750,
          bgcolor: "white",
          boxShadow: 24,
          borderRadius: 2,
          p: 2,
        }}
      >

        <Typography variant="h6" sx={{ mb: 2 }}>
          Ledger Account Selection
        </Typography>

        {/* SEARCH */}

        <TextField
          fullWidth
          size="small"
          placeholder="Search Ledger Account..."
          value={selectionSearch}
          onChange={(e) => setSelectionSearch(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* TABLE */}

        <Box
          ref={selectionListRef}
          onScroll={handleSelectionScroll}
          sx={{
            maxHeight: 350,
            overflow: "auto",
            border: "1px solid #ddd",
            borderRadius: 1,
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead
              style={{
                background: "#1976d2",
                color: "white",
                position: "sticky",
                top: 0,
              }}
            >
              <tr>
                <th style={{ padding: 8 }}>Select</th>
                <th style={{ padding: 8 }}>Account Name</th>
                <th style={{ padding: 8 }}>City</th>
                <th style={{ padding: 8 }}>State</th>
              </tr>
            </thead>

            <tbody>
              {visibleSelectionAccounts.map((acc) => (
                <tr key={acc._id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ textAlign: "center" }}>
                    <input
                      type="checkbox"
                      checked={selectedAccounts.includes(acc.formData?.acode)}
                      onChange={() => handleCheckboxChange(acc.formData?.acode)}
                    />
                  </td>

                  <td style={{ padding: 6 }}>{acc.formData?.ahead}</td>

                  <td style={{ padding: 6 }}>{acc.formData?.city}</td>

                  <td style={{ padding: 6 }}>{acc.formData?.state}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        {/* BUTTONS */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="contained" onClick={handleSelectAll}>
              Select All
            </Button>

            <Button variant="outlined" onClick={handleUnselectAll}>
              Unselect All
            </Button>
          </Box>

          <Button
            variant="contained"
            color="error"
            onClick={() => setSelectionModalOpen(false)}
          >
            Done
          </Button>
        </Box>

      </Box>
    </Modal>
    </>
  );
};

export default PwiseGSTDetail;
