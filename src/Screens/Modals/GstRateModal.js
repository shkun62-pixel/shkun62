import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Button,
  Checkbox,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function GstRateModal({ open, onClose }) {
  const [rows, setRows] = useState([
    { gst: "28.00", purchase: "PURCHASE 28%", sale: "SALE 28%", from: "2025-04-01", upto: "2026-03-31", spec: "" },
    { gst: "18.00", purchase: "PURCHASE 18%", sale: "SALE 18%", from: "2025-04-01", upto: "2026-03-31", spec: "" },
    { gst: "12.00", purchase: "PURCHASE 12%", sale: "SALE 12%", from: "2025-04-01", upto: "2026-03-31", spec: "" }
  ]);

  const handleAdd = () => {
    setRows([...rows, { gst: "", purchase: "", sale: "", from: "", upto: "", spec: "" }]);
  };

  const handleDelete = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ textAlign: "center", color: "red", fontWeight: "bold" }}>
        GST RATE WISE LEDGER POSTING SETUP
        <Checkbox sx={{ position: "absolute", right: 20, top: 15 }} /> Default
      </DialogTitle>

      <DialogContent>
      <TableContainer component={Paper} sx={{ maxHeight: '70vh', overflowX: 'auto' }}>
        <Table
        // sx={{
        // border: "1px solid #575757ff",
        // "& td, & th": { border: "1px solid #575757ff" }
        // }}
        >
          <TableHead>
            <TableRow>
              <TableCell align="center">GST @</TableCell>
              <TableCell align="center">Purchase Account</TableCell>
              <TableCell align="center">Sale Account</TableCell>
              <TableCell align="center">From</TableCell>
              <TableCell align="center">Upto</TableCell>
              <TableCell align="center">Spec</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <TextField
                    value={row.gst}
                    onChange={(e) => handleChange(index, "gst", e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.purchase}
                    onChange={(e) => handleChange(index, "purchase", e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.sale}
                    onChange={(e) => handleChange(index, "sale", e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={row.from}
                    onChange={(e) => handleChange(index, "from", e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    type="date"
                    value={row.upto}
                    onChange={(e) => handleChange(index, "upto", e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.spec}
                    onChange={(e) => handleChange(index, "spec", e.target.value)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(index)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <Button variant="contained" onClick={handleAdd}>
            Add Record
          </Button>
          <Button variant="outlined" color="error" onClick={() => setRows([])}>
            Delete Record
          </Button>
          <Button variant="contained" color="warning">0.00%</Button>
          <Button variant="contained" color="secondary">A/c Reset</Button>
          <div style={{ flex: 1 }} />
          <Button variant="contained" color="success" onClick={onClose}>
            Save & Exit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
