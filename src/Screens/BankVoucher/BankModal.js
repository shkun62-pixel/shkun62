// import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
// import Modal from "@mui/material/Modal";
// import Box from "@mui/material/Box";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Button from "@mui/material/Button";
// import TextField from "@mui/material/TextField";
// import IconButton from "@mui/material/IconButton";
// import Divider from "@mui/material/Divider";
// import Chip from "@mui/material/Chip";
// import Tooltip from "@mui/material/Tooltip";
// import InputAdornment from "@mui/material/InputAdornment";
// import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import EditRoundedIcon from "@mui/icons-material/EditRounded";
// import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
// import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
// import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";
// import { styled } from "@mui/system";
// import { useNavigate } from "react-router-dom";

// // ✅ use your api instance (recommended)
// // import api from "../../your/api"; // <-- if you have
// // OR use axios
// import axios from "axios";
// import { CompanyContext } from "../Context/CompanyContext";

// const ModalCard = styled(Box)(() => ({
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: "min(720px, calc(100vw - 24px))",
//   maxHeight: "min(780px, calc(100vh - 24px))",
//   borderRadius: 0,
//   overflow: "hidden",
//   outline: "none",
//   background: "#fff",
//   border: "1px solid rgba(15,23,42,0.14)",
//   boxShadow: "0 22px 60px rgba(15,23,42,0.18), 0 2px 10px rgba(15,23,42,0.10)",
//   display: "flex",
//   flexDirection: "column",
// }));

// function clampIndex(i, len) {
//   if (len <= 0) return 0;
//   if (i < 0) return len - 1;
//   if (i >= len) return 0;
//   return i;
// }

// const BankModal = ({ isOpen, onClose, onNavigate }) => {
//   const navigate = useNavigate();
//   const focusTrapRef = useRef(null);

//   const { company } = useContext(CompanyContext);
//   const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  

// const API_LIST = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/bank-win`; // GET
// const API_UPDATE = (id) => `https://www.shkunweb.com/shkunlive/${tenant}/tenant/bank-win-update/${id}`; // PUT


//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [focusedRow, setFocusedRow] = useState(0);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editValue, setEditValue] = useState("");
//   const [q, setQ] = useState("");

//   const isPrimaryRow = (row) => {
//     const n = String(row?.name || "").toUpperCase().trim();
//     return n === "BANK VOUCHER" || n === "BANK 2";
//   };

//   // ✅ Load rows from API when modal opens
//   useEffect(() => {
//     if (!isOpen) return;

//     let alive = true;

//     (async () => {
//       try {
//         setLoading(true);

//         // if you need token:
//         // const token = localStorage.getItem("token");
//         // const res = await axios.get(API_LIST, { headers: { Authorization: `Bearer ${token}` } });

//         const res = await axios.get(API_LIST);

//         if (!alive) return;

//         const data = Array.isArray(res.data?.data) ? res.data.data : [];
//         setRows(data);
//         setFocusedRow(0);
//       } catch (e) {
//         if (!alive) return;
//         setRows([]);
//         console.error("bank-win load error:", e);
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();

//     return () => {
//       alive = false;
//     };
//   }, [isOpen]);

//   const filteredRows = useMemo(() => {
//     const needle = q.trim().toLowerCase();
//     if (!needle) return rows;
//     return rows.filter((r) => String(r?.name || "").toLowerCase().includes(needle));
//   }, [rows, q]);

//   useEffect(() => {
//     setFocusedRow((prev) => clampIndex(prev, filteredRows.length));
//   }, [filteredRows.length]);

//   const handleNavigation = (row) => {
//     if (!row?.path) return;

//     // ✅ pass FULL row to next screen
//     navigate(row.path, { state: { bankWin: row } });

//     if (onNavigate) onNavigate(row);
//     onClose?.();
//   };

//   const startEdit = () => {
//     if (!filteredRows.length) return;
//     const row = filteredRows[focusedRow];
//     if (!row?._id) return; // must have id from DB
//     setIsEditing(true);
//     setEditValue(row?.name || "");
//   };

//   const saveEdit = async () => {
//     if (!filteredRows.length) return;
//     const row = filteredRows[focusedRow];
//     if (!row?._id) return;

//     const v = String(editValue || "").trim();
//     if (!v) return;

//     try {
//       setLoading(true);

//       // if you need token:
//       // const token = localStorage.getItem("token");
//       // const res = await axios.put(API_UPDATE(row._id), { name: v }, { headers: { Authorization: `Bearer ${token}` } });

//       const res = await axios.put(API_UPDATE(row._id), { name: v });

//       const updated = res.data?.data;
//       if (updated?._id) {
//         // ✅ update rows in state
//         setRows((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
//       }

//       setIsEditing(false);
//     } catch (e) {
//       console.error("bank-win update error:", e);
//       // optional: alert
//       // alert(e?.response?.data?.message || "Update failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onKeyDown = (event) => {
//     if (!isOpen) return;

//     if (event.key === "Escape") {
//       event.preventDefault();
//       if (isEditing) setIsEditing(false);
//       else onClose?.();
//       return;
//     }

//     if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") {
//       event.preventDefault();
//       if (!isEditing) startEdit();
//       return;
//     }

//     if (isEditing) {
//       if (event.key === "Enter") {
//         event.preventDefault();
//         saveEdit();
//       }
//       return;
//     }

//     if (event.key === "ArrowUp") {
//       event.preventDefault();
//       setFocusedRow((prev) => clampIndex(prev - 1, filteredRows.length));
//     } else if (event.key === "ArrowDown") {
//       event.preventDefault();
//       setFocusedRow((prev) => clampIndex(prev + 1, filteredRows.length));
//     } else if (event.key === "Enter") {
//       event.preventDefault();
//       const row = filteredRows[focusedRow];
//       if (row?.path) handleNavigation(row);
//     }
//   };

//   useEffect(() => {
//     if (isOpen) {
//       setTimeout(() => focusTrapRef.current?.focus(), 0);
//     } else {
//       setIsEditing(false);
//       setQ("");
//       setEditValue("");
//     }
//   }, [isOpen]);

//   return (
//     <Modal open={isOpen} onClose={onClose}>
//       <ModalCard ref={focusTrapRef} tabIndex={0} onKeyDown={onKeyDown}>
//         {/* Header */}
//         <Box
//           sx={{
//             px: 2,
//             py: 1.4,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 1.5,
//             background: "#fff",
//             borderBottom: "1px solid rgba(15,23,42,0.10)",
//           }}
//         >
//           <Box sx={{ minWidth: 0 }}>
//             <Typography
//               sx={{
//                 fontWeight: 950,
//                 letterSpacing: 0.2,
//                 color: "#0f172a",
//                 lineHeight: 1.1,
//               }}
//             >
//               BANK
//             </Typography>
//             <Typography
//               sx={{
//                 mt: 0.3,
//                 fontSize: 12.5,
//                 color: "rgba(30,41,59,.70)",
//                 fontWeight: 700,
//               }}
//             >
//               Arrow keys • Enter open • Ctrl+E edit • Esc close
//             </Typography>
//           </Box>

//           <Stack direction="row" spacing={1} alignItems="center">
//             <Chip
//               size="small"
//               icon={<KeyboardReturnRoundedIcon />}
//               label={loading ? "Loading..." : `${filteredRows.length} books`}
//               sx={{
//                 borderRadius: 0,
//                 bgcolor: "rgba(15,23,42,0.06)",
//                 border: "1px solid rgba(15,23,42,0.10)",
//                 color: "#0f172a",
//                 fontWeight: 900,
//                 "& .MuiChip-icon": { color: "#0f172a" },
//               }}
//             />
//             <Tooltip title="Close">
//               <IconButton
//                 onClick={onClose}
//                 sx={{
//                   borderRadius: 0,
//                   bgcolor: "rgba(15,23,42,0.06)",
//                   border: "1px solid rgba(15,23,42,0.10)",
//                 }}
//               >
//                 <CloseRoundedIcon />
//               </IconButton>
//             </Tooltip>
//           </Stack>
//         </Box>

//         {/* Search + Actions */}
//         <Box sx={{ px: 2, pt: 1.4, pb: 1.2 }}>
//           <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems="stretch">
//             <TextField
//               value={q}
//               onChange={(e) => setQ(e.target.value)}
//               placeholder="Search book…"
//               fullWidth
//               size="small"
//               variant="outlined"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <SearchRoundedIcon />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   borderRadius: 0,
//                   bgcolor: "#fff",
//                 },
//               }}
//             />

//             {!isEditing ? (
//               <Button
//                 onClick={startEdit}
//                 disabled={loading || !filteredRows.length}
//                 variant="contained"
//                 startIcon={<EditRoundedIcon />}
//                 sx={{
//                   borderRadius: 0,
//                   px: 2,
//                   fontWeight: 950,
//                   textTransform: "none",
//                   boxShadow: "none",
//                   bgcolor: "#0f172a",
//                   "&:hover": { bgcolor: "#000", boxShadow: "none" },
//                 }}
//               >
//                 Edit name
//               </Button>
//             ) : (
//               <Button
//                 onClick={saveEdit}
//                 disabled={loading}
//                 variant="contained"
//                 startIcon={<SaveRoundedIcon />}
//                 sx={{
//                   borderRadius: 0,
//                   px: 2,
//                   fontWeight: 950,
//                   textTransform: "none",
//                   boxShadow: "none",
//                   bgcolor: "#0f172a",
//                   "&:hover": { bgcolor: "#000", boxShadow: "none" },
//                 }}
//               >
//                 Save
//               </Button>
//             )}
//           </Stack>

//           {isEditing && (
//             <Box sx={{ mt: 1.2 }}>
//               <TextField
//                 value={editValue}
//                 onChange={(e) => setEditValue(e.target.value)}
//                 fullWidth
//                 size="small"
//                 autoFocus
//                 placeholder="Rename selected book…"
//                 onKeyDown={(e) => {
//                   if (e.key === "Escape") setIsEditing(false);
//                 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 0,
//                     bgcolor: "#fff",
//                   },
//                 }}
//               />
//               <Typography sx={{ mt: 0.6, fontSize: 12, color: "#64748b", fontWeight: 700 }}>
//                 Editing:{" "}
//                 <span style={{ color: "#0f172a" }}>
//                   {filteredRows[focusedRow]?.name || "-"}
//                 </span>
//               </Typography>
//             </Box>
//           )}
//         </Box>

//         <Divider sx={{ borderColor: "rgba(15,23,42,0.10)" }} />

//         {/* Table */}
//         <Box sx={{ px: 2, py: 1.5, flex: 1, minHeight: 0 }}>
//           <TableContainer
//             sx={{
//               height: "100%",
//               border: "1px solid rgba(15,23,42,0.12)",
//               bgcolor: "#fff",
//               overflow: "auto",
//             }}
//           >
//             <Table stickyHeader size="small">
//               <TableHead>
//                 <TableRow>
//                   <TableCell
//                     sx={{
//                       fontWeight: 950,
//                       color: "#0f172a",
//                       bgcolor: "rgba(241,245,249,1)",
//                       borderBottom: "1px solid rgba(15,23,42,0.12)",
//                       py: 1.2,
//                     }}
//                   >
//                     BOOK NAME
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {filteredRows.length ? (
//                   filteredRows.map((row, index) => {
//                     const active = index === focusedRow;
//                     const primary = isPrimaryRow(row);

//                     return (
//                       <TableRow
//                         key={row._id || row.path || index}
//                         hover
//                         onMouseEnter={() => setFocusedRow(index)}
//                         onClick={() => handleNavigation(row)}
//                         sx={{
//                           cursor: "pointer",
//                           transition: "140ms ease",
//                           height: primary ? 64 : 44,
//                           bgcolor: active
//                             ? primary
//                               ? "rgba(59,130,246,0.18)"
//                               : "rgba(59,130,246,0.10)"
//                             : primary
//                             ? "rgba(15,23,42,0.02)"
//                             : "transparent",
//                           "&:hover": {
//                             bgcolor: primary
//                               ? "rgba(59,130,246,0.16)"
//                               : "rgba(15,23,42,0.04)",
//                           },
//                         }}
//                       >
//                         <TableCell
//                           sx={{
//                             color: "#0f172a",
//                             borderBottom: "1px solid rgba(15,23,42,0.06)",
//                             py: primary ? 1.6 : 1.0,
//                           }}
//                         >
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "space-between",
//                               gap: 1.2,
//                             }}
//                           >
//                             {/* Left: Title */}
//                             <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
//                               <Typography
//                                 sx={{
//                                   fontWeight: primary ? 950 : active ? 900 : 800,
//                                   fontSize: primary ? 15.5 : 13.5,
//                                   letterSpacing: primary ? 0.2 : 0,
//                                   lineHeight: 1.1,
//                                   whiteSpace: "nowrap",
//                                   overflow: "hidden",
//                                   textOverflow: "ellipsis",
//                                 }}
//                               >
//                                 {row.name}
//                               </Typography>

//                               {primary && (
//                                 <Typography
//                                   sx={{
//                                     mt: 0.4,
//                                     fontSize: 12,
//                                     fontWeight: 800,
//                                     color: "rgba(30,41,59,.70)",
//                                     whiteSpace: "nowrap",
//                                     overflow: "hidden",
//                                     textOverflow: "ellipsis",
//                                   }}
//                                 >
//                                   Fast entry
//                                 </Typography>
//                               )}
//                                 <Typography
//                                   sx={{
//                                     mt: 0.4,
//                                     fontSize: 12,
//                                     fontWeight: 800,
//                                     color: "rgba(30,41,59,.70)",
//                                     whiteSpace: "nowrap",
//                                     overflow: "hidden",
//                                     textOverflow: "ellipsis",
//                                   }}
//                                 >
//                                   {row.valpha}
//                                 </Typography>
//                             </Box>

//                             {/* Right: Actions */}
//                             <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                               {primary ? (
//                                 <>
//                                   <Chip
//                                     size="small"
//                                     label="MAIN"
//                                     sx={{
//                                       borderRadius: 0,
//                                       fontWeight: 950,
//                                       bgcolor: "rgba(16,185,129,0.16)",
//                                       border: "1px solid rgba(16,185,129,0.30)",
//                                       color: "#065f46",
//                                     }}
//                                   />
//                                   <Button
//                                     variant="contained"
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleNavigation(row);
//                                     }}
//                                     sx={{
//                                       borderRadius: 0,
//                                       px: 2,
//                                       py: 0.9,
//                                       fontWeight: 950,
//                                       textTransform: "none",
//                                       boxShadow: "none",
//                                       background:
//                                         "linear-gradient(90deg, rgba(59,130,246,1), rgba(16,185,129,0.95))",
//                                       "&:hover": {
//                                         filter: "brightness(.98)",
//                                         boxShadow: "none",
//                                       },
//                                     }}
//                                   >
//                                     OPEN
//                                   </Button>
//                                 </>
//                               ) : (
//                                 active && (
//                                   <Typography
//                                     sx={{
//                                       fontSize: 12,
//                                       fontWeight: 900,
//                                       color: "rgba(30,41,59,.60)",
//                                     }}
//                                   >
//                                     Enter →
//                                   </Typography>
//                                 )
//                               )}
//                             </Box>
//                           </Box>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })
//                 ) : (
//                   <TableRow>
//                     <TableCell sx={{ py: 3, color: "#64748b", fontWeight: 800 }}>
//                       {loading ? "Loading..." : "No books found."}
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>

//         {/* Footer */}
//         <Box
//           sx={{
//             px: 2,
//             py: 1.2,
//             borderTop: "1px solid rgba(15,23,42,0.10)",
//             bgcolor: "#fff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             gap: 1,
//           }}
//         >
//           <Typography sx={{ fontSize: 12, color: "rgba(30,41,59,.70)", fontWeight: 700 }}>
//             Tip: Use <b>Ctrl+E</b> to rename selected.
//           </Typography>

//           <Stack direction="row" spacing={1}>
//             <Button
//               onClick={onClose}
//               variant="outlined"
//               sx={{
//                 borderRadius: 0,
//                 textTransform: "none",
//                 fontWeight: 950,
//                 borderColor: "rgba(15,23,42,0.22)",
//                 color: "#0f172a",
//                 "&:hover": { bgcolor: "rgba(15,23,42,0.04)" },
//               }}
//             >
//               Close
//             </Button>
//           </Stack>
//         </Box>
//       </ModalCard>
//     </Modal>
//   );
// };

// export default BankModal;

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import KeyboardReturnRoundedIcon from "@mui/icons-material/KeyboardReturnRounded";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

// ✅ use your api instance (recommended)
// import api from "../../your/api"; // <-- if you have
// OR use axios
import axios from "axios";
import { CompanyContext } from "../Context/CompanyContext";

const ModalCard = styled(Box)(() => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(720px, calc(100vw - 24px))",
  maxHeight: "min(780px, calc(100vh - 24px))",
  borderRadius: 0,
  overflow: "hidden",
  outline: "none",
  background: "#fff",
  border: "1px solid rgba(15,23,42,0.14)",
  boxShadow: "0 22px 60px rgba(15,23,42,0.18), 0 2px 10px rgba(15,23,42,0.10)",
  display: "flex",
  flexDirection: "column",
}));

function clampIndex(i, len) {
  if (len <= 0) return 0;
  if (i < 0) return len - 1;
  if (i >= len) return 0;
  return i;
}

const BankModal = ({ isOpen, onClose, onNavigate }) => {
  const navigate = useNavigate();
  const focusTrapRef = useRef(null);

  const { company } = useContext(CompanyContext);
  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  // const tenant = company?.databaseName;

const API_LIST = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/bank-win`; // GET
const API_UPDATE = (id) => `https://www.shkunweb.com/shkunlive/${tenant}/tenant/bank-win-update/${id}`; // PUT


  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [focusedRow, setFocusedRow] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [q, setQ] = useState("");

  const isPrimaryRow = (row) => {
    const n = String(row?.name || "").toUpperCase().trim();
    return n === "BANK VOUCHER" || n === "BANK 2";
  };

  // ✅ Load rows from API when modal opens
  useEffect(() => {
    if (!isOpen) return;

    let alive = true;

    (async () => {
      try {
        setLoading(true);

        // if you need token:
        // const token = localStorage.getItem("token");
        // const res = await axios.get(API_LIST, { headers: { Authorization: `Bearer ${token}` } });

        const res = await axios.get(API_LIST);

        if (!alive) return;

        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        setRows(data);
        setFocusedRow(0);
      } catch (e) {
        if (!alive) return;
        setRows([]);
        console.error("bank-win load error:", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [isOpen]);

  const filteredRows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) => String(r?.name || "").toLowerCase().includes(needle));
  }, [rows, q]);

  useEffect(() => {
    setFocusedRow((prev) => clampIndex(prev, filteredRows.length));
  }, [filteredRows.length]);

  const handleNavigation = (row) => {
    if (!row?.path) return;

    // ✅ pass FULL row to next screen
    navigate(row.path, { state: { bankWin: row } });

    if (onNavigate) onNavigate(row);
    onClose?.();
  };

  const startEdit = () => {
    if (!filteredRows.length) return;
    const row = filteredRows[focusedRow];
    if (!row?._id) return; // must have id from DB
    setIsEditing(true);
    setEditValue(row?.name || "");
  };

  const saveEdit = async () => {
    if (!filteredRows.length) return;
    const row = filteredRows[focusedRow];
    if (!row?._id) return;

    const v = String(editValue || "").trim();
    if (!v) return;

    try {
      setLoading(true);

      // if you need token:
      // const token = localStorage.getItem("token");
      // const res = await axios.put(API_UPDATE(row._id), { name: v }, { headers: { Authorization: `Bearer ${token}` } });

      const res = await axios.put(API_UPDATE(row._id), { name: v });

      const updated = res.data?.data;
      if (updated?._id) {
        // ✅ update rows in state
        setRows((prev) => prev.map((x) => (x._id === updated._id ? updated : x)));
      }

      setIsEditing(false);
    } catch (e) {
      console.error("bank-win update error:", e);
      // optional: alert
      // alert(e?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (event) => {
    if (!isOpen) return;

    if (event.key === "Escape") {
      event.preventDefault();
      if (isEditing) setIsEditing(false);
      else onClose?.();
      return;
    }

    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "e") {
      event.preventDefault();
      if (!isEditing) startEdit();
      return;
    }

    if (isEditing) {
      if (event.key === "Enter") {
        event.preventDefault();
        saveEdit();
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setFocusedRow((prev) => clampIndex(prev - 1, filteredRows.length));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setFocusedRow((prev) => clampIndex(prev + 1, filteredRows.length));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const row = filteredRows[focusedRow];
      if (row?.path) handleNavigation(row);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => focusTrapRef.current?.focus(), 0);
    } else {
      setIsEditing(false);
      setQ("");
      setEditValue("");
    }
  }, [isOpen]);

  return (
    <Modal open={isOpen} onClose={onClose}>
      <ModalCard ref={focusTrapRef} tabIndex={0} onKeyDown={onKeyDown}>
        {/* Header */}
        <Box
          sx={{
            px: 2,
            py: 1.4,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1.5,
            background: "#fff",
            borderBottom: "1px solid rgba(15,23,42,0.10)",
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 950,
                letterSpacing: 0.2,
                color: "#0f172a",
                lineHeight: 1.1,
              }}
            >
              BANK
            </Typography>
            <Typography
              sx={{
                mt: 0.3,
                fontSize: 12.5,
                color: "rgba(30,41,59,.70)",
                fontWeight: 700,
              }}
            >
              Arrow keys • Enter open • Ctrl+E edit • Esc close
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              size="small"
              icon={<KeyboardReturnRoundedIcon />}
              label={loading ? "Loading..." : `${filteredRows.length} books`}
              sx={{
                borderRadius: 0,
                bgcolor: "rgba(15,23,42,0.06)",
                border: "1px solid rgba(15,23,42,0.10)",
                color: "#0f172a",
                fontWeight: 900,
                "& .MuiChip-icon": { color: "#0f172a" },
              }}
            />
            <Tooltip title="Close">
              <IconButton
                onClick={onClose}
                sx={{
                  borderRadius: 0,
                  bgcolor: "rgba(15,23,42,0.06)",
                  border: "1px solid rgba(15,23,42,0.10)",
                }}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>

        {/* Search + Actions */}
        <Box sx={{ px: 2, pt: 1.4, pb: 1.2 }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2} alignItems="stretch">
            <TextField
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search book…"
              fullWidth
              size="small"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 0,
                  bgcolor: "#fff",
                },
              }}
            />

            {!isEditing ? (
              <Button
                onClick={startEdit}
                disabled={loading || !filteredRows.length}
                variant="contained"
                startIcon={<EditRoundedIcon />}
                sx={{
                  borderRadius: 0,
                  px: 2,
                  fontWeight: 950,
                  textTransform: "none",
                  boxShadow: "none",
                  bgcolor: "#0f172a",
                  "&:hover": { bgcolor: "#000", boxShadow: "none" },
                }}
              >
                Edit name
              </Button>
            ) : (
              <Button
                onClick={saveEdit}
                disabled={loading}
                variant="contained"
                startIcon={<SaveRoundedIcon />}
                sx={{
                  borderRadius: 0,
                  px: 2,
                  fontWeight: 950,
                  textTransform: "none",
                  boxShadow: "none",
                  bgcolor: "#0f172a",
                  "&:hover": { bgcolor: "#000", boxShadow: "none" },
                }}
              >
                Save
              </Button>
            )}
          </Stack>

          {isEditing && (
            <Box sx={{ mt: 1.2 }}>
              <TextField
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                fullWidth
                size="small"
                autoFocus
                placeholder="Rename selected book…"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setIsEditing(false);
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 0,
                    bgcolor: "#fff",
                  },
                }}
              />
              <Typography sx={{ mt: 0.6, fontSize: 12, color: "#64748b", fontWeight: 700 }}>
                Editing:{" "}
                <span style={{ color: "#0f172a" }}>
                  {filteredRows[focusedRow]?.name || "-"}
                </span>
              </Typography>
            </Box>
          )}
        </Box>

        <Divider sx={{ borderColor: "rgba(15,23,42,0.10)" }} />

        {/* Table */}
        <Box sx={{ px: 2, py: 1.5, flex: 1, minHeight: 0 }}>
          <TableContainer
            sx={{
              height: "100%",
              border: "1px solid rgba(15,23,42,0.12)",
              bgcolor: "#fff",
              overflow: "auto",
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 950,
                      color: "#0f172a",
                      bgcolor: "rgba(241,245,249,1)",
                      borderBottom: "1px solid rgba(15,23,42,0.12)",
                      py: 1.2,
                    }}
                  >
                    BOOK NAME
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredRows.length ? (
                  filteredRows.map((row, index) => {
                    const active = index === focusedRow;
                    const primary = isPrimaryRow(row);

                    return (
                      <TableRow
                        key={row._id || row.path || index}
                        hover
                        onMouseEnter={() => setFocusedRow(index)}
                        onClick={() => handleNavigation(row)}
                        sx={{
                          cursor: "pointer",
                          transition: "140ms ease",
                          height: primary ? 64 : 44,
                          bgcolor: active
                            ? primary
                              ? "rgba(59,130,246,0.18)"
                              : "rgba(59,130,246,0.10)"
                            : primary
                            ? "rgba(15,23,42,0.02)"
                            : "transparent",
                          "&:hover": {
                            bgcolor: primary
                              ? "rgba(59,130,246,0.16)"
                              : "rgba(15,23,42,0.04)",
                          },
                        }}
                      >
                        <TableCell
                          sx={{
                            color: "#0f172a",
                            borderBottom: "1px solid rgba(15,23,42,0.06)",
                            py: primary ? 1.6 : 1.0,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 1.2,
                            }}
                          >
                            {/* Left: Title */}
                            <Box sx={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                              <Typography
                                sx={{
                                  fontWeight: primary ? 950 : active ? 900 : 800,
                                  fontSize: primary ? 15.5 : 13.5,
                                  letterSpacing: primary ? 0.2 : 0,
                                  lineHeight: 1.1,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {row.name}
                              </Typography>

                              {primary && (
                                <Typography
                                  sx={{
                                    mt: 0.4,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color: "rgba(30,41,59,.70)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  Fast entry
                                </Typography>
                              )}
                                <Typography
                                  sx={{
                                    mt: 0.4,
                                    fontSize: 12,
                                    fontWeight: 800,
                                    color: "rgba(30,41,59,.70)",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {row.valpha}
                                </Typography>
                            </Box>

                            {/* Right: Actions */}
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              {primary ? (
                                <>
                                  <Chip
                                    size="small"
                                    label="MAIN"
                                    sx={{
                                      borderRadius: 0,
                                      fontWeight: 950,
                                      bgcolor: "rgba(16,185,129,0.16)",
                                      border: "1px solid rgba(16,185,129,0.30)",
                                      color: "#065f46",
                                    }}
                                  />
                                  <Button
                                    variant="contained"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleNavigation(row);
                                    }}
                                    sx={{
                                      borderRadius: 0,
                                      px: 2,
                                      py: 0.9,
                                      fontWeight: 950,
                                      textTransform: "none",
                                      boxShadow: "none",
                                      background:
                                        "linear-gradient(90deg, rgba(59,130,246,1), rgba(16,185,129,0.95))",
                                      "&:hover": {
                                        filter: "brightness(.98)",
                                        boxShadow: "none",
                                      },
                                    }}
                                  >
                                    OPEN
                                  </Button>
                                </>
                              ) : (
                                active && (
                                  <Typography
                                    sx={{
                                      fontSize: 12,
                                      fontWeight: 900,
                                      color: "rgba(30,41,59,.60)",
                                    }}
                                  >
                                    Enter →
                                  </Typography>
                                )
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell sx={{ py: 3, color: "#64748b", fontWeight: 800 }}>
                      {loading ? "Loading..." : "No books found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 2,
            py: 1.2,
            borderTop: "1px solid rgba(15,23,42,0.10)",
            bgcolor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
          }}
        >
          <Typography sx={{ fontSize: 12, color: "rgba(30,41,59,.70)", fontWeight: 700 }}>
            Tip: Use <b>Ctrl+E</b> to rename selected.
          </Typography>

          <Stack direction="row" spacing={1}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                borderRadius: 0,
                textTransform: "none",
                fontWeight: 950,
                borderColor: "rgba(15,23,42,0.22)",
                color: "#0f172a",
                "&:hover": { bgcolor: "rgba(15,23,42,0.04)" },
              }}
            >
              Close
            </Button>
          </Stack>
        </Box>
      </ModalCard>
    </Modal>
  );
};

export default BankModal;