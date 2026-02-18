// import React, { useState, useEffect } from "react";
// import Modal from "react-bootstrap/Modal";
// import {
//   TableContainer,
//   Paper,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TextField,
//   Button,
//   Checkbox,
//   IconButton,
// } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import InputMask from "react-input-mask";
// import financialYear from "../Shared/financialYear";
// import ProductModalCustomer from "../Modals/ProductModalCustomer";
// import axios from "axios";

// // 👉 Row template
// const createEmptyRow = (id) => ({
//   id,
//   gst: "",
//   Pcodess: "",
//   Pcodes01: "",
//   Scodess: "",
//   Scodes01: "",
//   from: "",
//   upto: "",
//   spec: "",
// });

// export default function GstRateModal({ open, onClose }) {
//   const [showAccountModal, setShowAccountModal] = useState(false);
//   const [selectedRowIndex, setSelectedRowIndex] = useState(null);
//   const [selectedField, setSelectedField] = useState("");
//   const [pressedKey, setPressedKey] = useState("");
//   const [isDefault, setIsDefault] = useState(true);
//   const [saving, setSaving] = useState(false);

//   const [rows, setRows] = useState([createEmptyRow(1)]);

//   const MIN_ROWS = 4;

// useEffect(() => {
//   if (rows.length < MIN_ROWS) {
//     setRows((prev) => {
//       const nextId = prev.length + 1;
//       const extraRows = Array.from(
//         { length: MIN_ROWS - prev.length },
//         (_, i) => createEmptyRow(nextId + i)
//       );
//       return [...prev, ...extraRows];
//     });
//   }
// }, [rows.length]);


//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     return `${String(d.getDate()).padStart(2, "0")}-${String(
//       d.getMonth() + 1,
//     ).padStart(2, "0")}-${d.getFullYear()}`;
//   };

//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setRows((prev) =>
//       prev.map((row) => ({
//         ...row,
//         from: formatDate(fy.start),
//         upto: formatDate(fy.end),
//       })),
//     );
//   }, []);

//   const handleChange = (index, field) => (e) => {
//     const value = e.target.value;
//     setRows((prev) =>
//       prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
//     );
//   };

//   const handleAdd = () => {
//   setRows((prev) => [
//     ...prev,
//     createEmptyRow(prev.length + 1),
//   ]);
// };

// const handleDelete = (index) => {
//   setRows((prev) =>
//     prev
//       .filter((_, i) => i !== index)
//       .map((row, i) => ({ ...row, id: i + 1 }))
//   );
// };

// const handleDeleteAll = () => {
//   setRows([createEmptyRow(1)]);
// };


//   const isRowFilled = (row) =>
//     row.gst || row.Pcodess || row.Scodess || row.spec;

//   const handleAccountKeyDown = (e, index, field) => {
//     if (/^[a-zA-Z]$/.test(e.key) || e.key === "Backspace") {
//       setSelectedRowIndex(index);
//       setSelectedField(field);
//       setPressedKey(e.key === "Backspace" ? "" : e.key);
//       setShowAccountModal(true);
//       e.preventDefault();
//     }
//   };

//   const handleAccountSelect = (product) => {
//     if (!product || selectedRowIndex === null) return;

//     setRows((prev) =>
//       prev.map((row, i) => {
//         if (i !== selectedRowIndex) return row;

//         // Purchase selected
//         if (selectedField === "Pcodess") {
//           return {
//             ...row,
//             Pcodess: product.ahead || "",
//             Pcodes01: product.acode || "",
//           };
//         }

//         // Sale selected
//         if (selectedField === "Scodess") {
//           return {
//             ...row,
//             Scodess: product.ahead || "",
//             Scodes01: product.acode || "",
//           };
//         }

//         return row;
//       }),
//     );

//     setShowAccountModal(false);
//     setSelectedRowIndex(null);
//     setSelectedField("");
//   };
//   const handleSave = async () => {
//   const filledRows = rows.filter(isRowFilled);

//   if (filledRows.length === 0) {
//     alert("Please enter at least one GST Rate record");
//     return;
//   }

//   const payload = {
//     isDefault,
//     rows: filledRows.map((row) => ({
//       id: row.id,
//       gst: row.gst,
//       Pcodess: row.Pcodess,
//       Pcodes01: row.Pcodes01,
//       Scodess: row.Scodess,
//       Scodes01: row.Scodes01,
//       from: row.from,
//       upto: row.upto,
//       spec: row.spec,
//     })),
//   };

//   console.log("GST RATE SAVE PAYLOAD");
//   console.log(payload);
//   console.log("JSON:", JSON.stringify(payload, null, 2));

//   try {
//     setSaving(true);

//     await axios.post(
//       "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale-purchase-posting-setup",
//       payload,
//       { headers: { "Content-Type": "application/json" } }
//     );

//     alert("GST Rate records saved successfully ✅");
//   } catch (error) {
//     console.error("SAVE ERROR:", error);
//     alert("Error while saving GST Rate records ❌");
//   } finally {
//     setSaving(false);
//   }
// };

//   return (
//     <Modal show={open} onHide={onClose} size="xl" centered backdrop="static">
//       <Modal.Header closeButton>
//         <Modal.Title
//           style={{ color: "red", fontWeight: "bold", width: "100%" }}
//         >
//           GST RATE WISE LEDGER POSTING SETUP
//           <span style={{ float: "right" }}>
//             Default{" "}
//             <Checkbox
//               checked={isDefault}
//               onChange={(e) => setIsDefault(e.target.checked)}
//             />
//           </span>
//         </Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell align="center">GST @</TableCell>
//                 <TableCell align="center" sx={{ width: 260 }}>
//                   Purchase Account
//                 </TableCell>
//                 <TableCell align="center" sx={{ width: 260 }}>
//                   Sale Account
//                 </TableCell>
//                 <TableCell align="center" sx={{ width: 150 }}>
//                   From
//                 </TableCell>
//                 <TableCell align="center" sx={{ width: 150 }}>
//                   Upto
//                 </TableCell>
//                 <TableCell align="center">Spec</TableCell>
//                 <TableCell />
//               </TableRow>
//             </TableHead>

//             <TableBody>
//               {rows.map((row, index) => (
//                 <TableRow key={row.id}>
//                   <TableCell>
//                     <TextField
//                       value={row.gst}
//                       onChange={handleChange(index, "gst")}
//                       size="small"
//                       fullWidth
//                     />
//                   </TableCell>

//                   <TableCell>
//                     <TextField
//                       value={row.Pcodess}
//                       onChange={handleChange(index, "Pcodess")}
//                       onKeyDown={(e) =>
//                         handleAccountKeyDown(e, index, "Pcodess")
//                       }
//                       size="small"
//                       fullWidth
//                     />
//                   </TableCell>

//                   <TableCell>
//                     <TextField
//                       value={row.Scodess}
//                       onChange={handleChange(index, "Scodess")}
//                       onKeyDown={(e) =>
//                         handleAccountKeyDown(e, index, "Scodess")
//                       }
//                       size="small"
//                       fullWidth
//                     />
//                   </TableCell>

//                   <TableCell>
//                     <InputMask
//                       mask="99-99-9999"
//                       value={row.from}
//                       onChange={handleChange(index, "from")}
//                     >
//                       {(props) => (
//                         <TextField {...props} size="small" fullWidth />
//                       )}
//                     </InputMask>
//                   </TableCell>

//                   <TableCell>
//                     <InputMask
//                       mask="99-99-9999"
//                       value={row.upto}
//                       onChange={handleChange(index, "upto")}
//                     >
//                       {(props) => (
//                         <TextField {...props} size="small" fullWidth />
//                       )}
//                     </InputMask>
//                   </TableCell>

//                   <TableCell>
//                     <TextField
//                       value={row.spec}
//                       onChange={handleChange(index, "spec")}
//                       size="small"
//                       fullWidth
//                     />
//                   </TableCell>

//                   <TableCell align="center">
//                     <IconButton
//                       color="error"
//                       onClick={() => handleDelete(index)}
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>

//         {showAccountModal && (
//           <ProductModalCustomer
//             onSelect={handleAccountSelect}
//             onClose={() => setShowAccountModal(false)}
//             initialKey={pressedKey}
//             tenant="shkun_05062025_05062026"
//           />
//         )}

//         {/* ACTION BUTTONS */}
//         <div className="d-flex gap-2 mt-3">
//           <Button variant="contained" onClick={handleAdd}>
//             Add Record
//           </Button>

//           <Button variant="outlined" color="error" onClick={handleDeleteAll}>
//             Delete All Records
//           </Button>

//           <Button variant="contained" color="warning">
//             0.00%
//           </Button>

//           <Button variant="contained" color="secondary">
//             A/c Reset
//           </Button>

//           <div style={{ flex: 1 }} />

//           <Button
//             variant="contained"
//             color="success"
//             onClick={() => {
//               handleSave();
//             }}
//           >
//             Save
//           </Button>
//           <Button
//             variant="contained"
//             color="secondary"
//             onClick={() => {
//               onClose();
//             }}
//           >
//             Exit
//           </Button>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// }


import React, { useState, useEffect, useMemo, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import {
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
import InputMask from "react-input-mask";
import financialYear from "../Shared/financialYear";
import ProductModalCustomer from "../Modals/ProductModalCustomer";
import axios from "axios";
import { CompanyContext } from "../Context/CompanyContext";

// 👉 Row template
const createEmptyRow = (id) => ({
  id,
  gst: "",
  Pcodess: "",
  Pcodes01: "",
  Scodess: "",
  Scodes01: "",
  from: "",
  upto: "",
  spec: "",
});

export default function GstRateModal({ open, onClose }) {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedField, setSelectedField] = useState("");
  const [pressedKey, setPressedKey] = useState("");
  const [isDefault, setIsDefault] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  const [rows, setRows] = useState([createEmptyRow(1)]);
  const MIN_ROWS = 4;

  // ✅ Tenant + Base API (same as you used in modal)
  // const TENANT = "shkun_05062025_05062026";
  const { company } = useContext(CompanyContext);
  const TENANT = "03AAYFG4472A1ZG_01042025_31032026";
  const BASE_URL = useMemo(
    () => `https://www.shkunweb.com/shkunlive/${TENANT}/tenant`,
    [TENANT]
  );

  // ✅ helper: format FY dates
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const applyFYDatesToAllRows = (inputRows) => {
    const fy = financialYear.getFYDates();
    const from = formatDate(fy.start);
    const upto = formatDate(fy.end);

    return (inputRows || []).map((r, idx) => ({
      ...createEmptyRow(idx + 1),
      ...r,
      id: idx + 1,      // ✅ keep ids clean 1..n
      from: r?.from || from,
      upto: r?.upto || upto,
    }));
  };

  // ✅ ensure min rows
  useEffect(() => {
    if (rows.length < MIN_ROWS) {
      setRows((prev) => {
        const nextId = prev.length + 1;
        const extraRows = Array.from(
          { length: MIN_ROWS - prev.length },
          (_, i) => createEmptyRow(nextId + i)
        );
        return [...prev, ...extraRows];
      });
    }
  }, [rows.length]);

  // ✅ set FY dates initially (if no data loaded yet)
  useEffect(() => {
    const fy = financialYear.getFYDates();
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        from: row.from || formatDate(fy.start),
        upto: row.upto || formatDate(fy.end),
      }))
    );
  }, []);

  // ==========================================================
  // ✅ API: LOAD on OPEN (GET)
  // ==========================================================
  useEffect(() => {
    if (!open) return;

    const fetchSetup = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(
          `${BASE_URL}/sale-purchase-posting-setup`,
          { headers: { "Content-Type": "application/json" } }
        );

        const item = data?.item;

        if (item && Array.isArray(item.rows)) {
          setIsDefault(!!item.isDefault);
          const normalized = applyFYDatesToAllRows(item.rows);
          setRows(normalized.length ? normalized : applyFYDatesToAllRows([createEmptyRow(1)]));
        } else {
          // no doc found -> reset default
          setIsDefault(true);
          setRows(applyFYDatesToAllRows([createEmptyRow(1)]));
        }
      } catch (err) {
        console.error("LOAD ERROR:", err);
        // keep UI usable even if load fails
        setIsDefault(true);
        setRows(applyFYDatesToAllRows([createEmptyRow(1)]));
      } finally {
        setLoading(false);
      }
    };

    fetchSetup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, BASE_URL]);

  // ==========================================================
  // UI Handlers
  // ==========================================================
  const handleChange = (index, field) => (e) => {
    const value = e.target.value;
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const handleAdd = () => {
    setRows((prev) => [...prev, createEmptyRow(prev.length + 1)]);
  };

  const handleDelete = (index) => {
    setRows((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((row, i) => ({ ...row, id: i + 1 }))
    );
  };

  const handleDeleteAll = async () => {
    // UI reset + optional backend delete
    const ok = window.confirm("Delete all setup records?");
    if (!ok) return;

    try {
      setSaving(true);
      await axios.delete(`${BASE_URL}/sale-purchase-posting-setup`);
      setIsDefault(true);
      setRows(applyFYDatesToAllRows([createEmptyRow(1)]));
      alert("Deleted successfully ✅");
    } catch (err) {
      console.error("DELETE ALL ERROR:", err);
      alert("Error while deleting ❌");
    } finally {
      setSaving(false);
    }
  };

  const isRowFilled = (row) =>
    row.gst || row.Pcodess || row.Scodess || row.spec;

  const handleAccountKeyDown = (e, index, field) => {
    if (/^[a-zA-Z]$/.test(e.key) || e.key === "Backspace") {
      setSelectedRowIndex(index);
      setSelectedField(field);
      setPressedKey(e.key === "Backspace" ? "" : e.key);
      setShowAccountModal(true);
      e.preventDefault();
    }
  };

  const handleAccountSelect = (product) => {
    if (!product || selectedRowIndex === null) return;

    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== selectedRowIndex) return row;

        if (selectedField === "Pcodess") {
          return {
            ...row,
            Pcodess: product.ahead || "",
            Pcodes01: product.acode || "",
          };
        }

        if (selectedField === "Scodess") {
          return {
            ...row,
            Scodess: product.ahead || "",
            Scodes01: product.acode || "",
          };
        }

        return row;
      })
    );

    setShowAccountModal(false);
    setSelectedRowIndex(null);
    setSelectedField("");
  };

  // ==========================================================
  // ✅ API: SAVE (POST)
  // ==========================================================
  const handleSave = async () => {
    const filledRows = rows.filter(isRowFilled);

    if (filledRows.length === 0) {
      alert("Please enter at least one GST Rate record");
      return;
    }

    const payload = {
      isDefault,
      rows: filledRows.map((row, idx) => ({
        id: idx + 1, // ✅ ensure sequential ids
        gst: row.gst,
        Pcodess: row.Pcodess,
        Pcodes01: row.Pcodes01,
        Scodess: row.Scodess,
        Scodes01: row.Scodes01,
        from: row.from,
        upto: row.upto,
        spec: row.spec,
      })),
    };

    console.log("GST RATE SAVE PAYLOAD", payload);

    try {
      setSaving(true);

      const { data } = await axios.post(
        `${BASE_URL}/sale-purchase-posting-setup`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      // update UI with saved doc (if backend returns it)
      if (data?.item?.rows) {
        setIsDefault(!!data.item.isDefault);
        setRows(applyFYDatesToAllRows(data.item.rows));
      }

      alert("GST Rate records saved successfully ✅");
    } catch (error) {
      console.error("SAVE ERROR:", error);
      alert("Error while saving GST Rate records ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={open} onHide={onClose} size="xl" centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "red", fontWeight: "bold", width: "100%" }}>
          GST RATE WISE LEDGER POSTING SETUP
          <span style={{ float: "right" }}>
            Default{" "}
            <Checkbox
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              disabled={loading || saving}
            />
          </span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading && (
          <div style={{ marginBottom: 10, fontWeight: "bold" }}>
            Loading setup...
          </div>
        )}

        <TableContainer component={Paper} sx={{ maxHeight: "70vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="center">GST @</TableCell>
                <TableCell align="center" sx={{ width: 260 }}>
                  Purchase Account
                </TableCell>
                <TableCell align="center" sx={{ width: 260 }}>
                  Sale Account
                </TableCell>
                <TableCell align="center" sx={{ width: 150 }}>
                  From
                </TableCell>
                <TableCell align="center" sx={{ width: 150 }}>
                  Upto
                </TableCell>
                <TableCell align="center">Spec</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>

            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <TextField
                      value={row.gst}
                      onChange={handleChange(index, "gst")}
                      size="small"
                      fullWidth
                      disabled={loading || saving}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      value={row.Pcodess}
                      onChange={handleChange(index, "Pcodess")}
                      onKeyDown={(e) => handleAccountKeyDown(e, index, "Pcodess")}
                      size="small"
                      fullWidth
                      disabled={loading || saving}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      value={row.Scodess}
                      onChange={handleChange(index, "Scodess")}
                      onKeyDown={(e) => handleAccountKeyDown(e, index, "Scodess")}
                      size="small"
                      fullWidth
                      disabled={loading || saving}
                    />
                  </TableCell>

                  <TableCell>
                    <InputMask
                      mask="99-99-9999"
                      value={row.from}
                      onChange={handleChange(index, "from")}
                      disabled={loading || saving}
                    >
                      {(props) => <TextField {...props} size="small" fullWidth />}
                    </InputMask>
                  </TableCell>

                  <TableCell>
                    <InputMask
                      mask="99-99-9999"
                      value={row.upto}
                      onChange={handleChange(index, "upto")}
                      disabled={loading || saving}
                    >
                      {(props) => <TextField {...props} size="small" fullWidth />}
                    </InputMask>
                  </TableCell>

                  <TableCell>
                    <TextField
                      value={row.spec}
                      onChange={handleChange(index, "spec")}
                      size="small"
                      fullWidth
                      disabled={loading || saving}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(index)}
                      disabled={loading || saving}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {showAccountModal && (
          <ProductModalCustomer
            onSelect={handleAccountSelect}
            onClose={() => setShowAccountModal(false)}
            initialKey={pressedKey}
            tenant={TENANT}
          />
        )}

        {/* ACTION BUTTONS */}
        <div className="d-flex gap-2 mt-3">
          <Button variant="contained" onClick={handleAdd} disabled={loading || saving}>
            Add Record
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteAll}
            disabled={loading || saving}
          >
            Delete All Records
          </Button>

          <Button variant="contained" color="warning" disabled>
            0.00%
          </Button>

          <Button variant="contained" color="secondary" disabled>
            A/c Reset
          </Button>

          <div style={{ flex: 1 }} />

          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
            disabled={loading || saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>

          <Button
            variant="contained"
            color="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Exit
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
