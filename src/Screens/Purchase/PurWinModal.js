// import React, { useContext, useEffect, useMemo, useState } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Grid,
//   Divider,
//   FormControlLabel,
//   Checkbox,
//   Chip,
//   IconButton,
//   Tooltip,
//   CircularProgress,
// } from "@mui/material";
// import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
// import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
// import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
// import AddRoundedIcon from "@mui/icons-material/AddRounded";
// import EditRoundedIcon from "@mui/icons-material/EditRounded";
// import { alpha } from "@mui/material/styles";
// import axios from "axios";
// import { CompanyContext } from "../Context/CompanyContext";
// const wrapStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 920,
//   bgcolor: "#fff",
//   borderRadius: 4,
//   boxShadow: "0 22px 70px rgba(0,0,0,.22)",
//   overflow: "hidden",
// };

// const ynToBool = (v) => String(v || "").toUpperCase() === "Y";
// const boolToYn = (b) => (b ? "Y" : "N");

// const emptyForm = {
//   name: "",
//   valpha: "",
//   serialno: 0,
//   prefix: "",
//   onbillno: true,
//   purchasef3: "",
//   path: "",
//   billtype: "",

//   ledpost: false,
//   gstpost: false,
//   stkpost: false,
//   vatpost: false,
// };

// export default function PurWinModal({
//   open,
//   onClose,
//   // api, // ✅ your axios instance
//   initialData, // ✅ null => add, object => edit
//   onChanged, // ✅ call after add/edit/delete to refresh list
// }) {
//   const isEdit = useMemo(() => !!initialData?._id, [initialData]);
//   const { company } = useContext(CompanyContext);
//   const tenant = "03AAYFG4472A1ZG_01042025_31032026";

//   const [form, setForm] = useState(emptyForm);
//   const [saving, setSaving] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   useEffect(() => {
//     if (!open) return;

//     if (initialData?._id) {
//       setForm({
//         name: initialData?.name || "",
//         valpha: initialData?.valpha || "",
//         serialno: Number(initialData?.serialno || 0),
//         prefix: initialData?.prefix || "",
//         onbillno: initialData?.onbillno == null ? true : ynToBool(initialData?.onbillno),
//         purchasef3: initialData?.purchasef3 || "",
//         path: initialData?.path || "",
//         billtype: initialData?.billtype || "",

//         ledpost: ynToBool(initialData?.ledpost),
//         gstpost: ynToBool(initialData?.gstpost),
//         stkpost: ynToBool(initialData?.stkpost),
//         vatpost: ynToBool(initialData?.vatpost),
//       });
//     } else {
//       setForm(emptyForm);
//     }
//   }, [open, initialData]);

//   const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

//   const validate = () => {
//     const name = String(form.name || "").trim();
//     const path = String(form.path || "").trim();
//     if (!name) return "Name is required";
//     if (!path) return "Path is required";
//     return "";
//   };

//   // ✅ ADD / EDIT API inside modal
//   const handleSave = async () => {
//     const errMsg = validate();
//     if (errMsg) return alert(errMsg);

//     const payload = {
//       name: String(form.name || "").trim(),
//       valpha: String(form.valpha || "").trim(),
//       serialno: Number(form.serialno || 0),
//       prefix: String(form.prefix || "").trim(),
//       purchasef3: String(form.purchasef3 || "").trim(),
//       path: String(form.path || "").trim(),
//       billtype: String(form.billtype || "").trim(),

//       ledpost: boolToYn(!!form.ledpost),
//       gstpost: boolToYn(!!form.gstpost),
//       stkpost: boolToYn(!!form.stkpost),
//       vatpost: boolToYn(!!form.vatpost),
//       onbillno: boolToYn(!!form.onbillno),
//     };

//     try {
//       setSaving(true);

//       let res;
//       if (isEdit) {
//         res = await axios.put(
//           `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchase-win-update/${initialData._id}`,
//           payload
//         );
//       } else {
//         res = await axios.post(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchase-win-post`, payload);
//       }

//       if (!res.data?.ok) return alert(res.data?.message || "Failed");

//       onChanged?.(); // refresh grid/list
//       onClose?.();
//     } catch (e) {
//       alert(e?.response?.data?.message || e.message || "Server error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ✅ DELETE API inside modal
//   const handleDelete = async () => {
//     if (!isEdit) return;
//     const ok = window.confirm(`Delete "${initialData?.name || ""}" ?`);
//     if (!ok) return;

//     try {
//       setDeleting(true);

//       // ✅ (keep your base url same style as save)
//       const res = await axios.delete(
//         `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchase-win-delete/${initialData._id}`
//       );

//       if (!res.data?.ok) return alert(res.data?.message || "Delete failed");

//       onChanged?.(); // refresh grid/list
//       onClose?.();
//     } catch (e) {
//       alert(e?.response?.data?.message || e.message || "Server error");
//     } finally {
//       setDeleting(false);
//     }
//   };

//   const headerGradient = "linear-gradient(135deg, rgba(15,23,42,1), rgba(2,132,199,1))";

//   return (
//     <Modal
//       open={open}
//       onClose={saving || deleting ? undefined : onClose}
//       disablePortal={false} // ✅ keep portal
//       container={() => document.body} // ✅ force render at body so it comes above parent modal
//       style={{zIndex:10000}}
//     >
//       <Box sx={wrapStyle}>
//         {/* Header */}
//         <Box
//           sx={{
//             px: 2.2,
//             py: 1.8,
//             color: "white",
//             background: headerGradient,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
//             <Box
//               sx={{
//                 width: 42,
//                 height: 42,
//                 borderRadius: 2.5,
//                 background: alpha("#fff", 0.18),
//                 display: "grid",
//                 placeItems: "center",
//               }}
//             >
//               {isEdit ? <EditRoundedIcon /> : <AddRoundedIcon />}
//             </Box>

//             <Box>
//               <Typography sx={{ fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>
//                 {isEdit ? "Edit Purchase Window" : "Create Purchase Window"}
//               </Typography>
//               <Typography sx={{ opacity: 0.85, fontSize: 12, mt: 0.2 }}>
//                 Add / update posting rules, prefix, path and bill settings
//               </Typography>
//             </Box>

//             {isEdit && (
//               <Chip
//                 label={`ID: ${String(initialData._id).slice(-6)}`}
//                 size="small"
//                 sx={{
//                   ml: 1.5,
//                   color: "white",
//                   background: alpha("#fff", 0.18),
//                   border: `1px solid ${alpha("#fff", 0.18)}`,
//                 }}
//               />
//             )}
//           </Box>

//           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//             {isEdit && (
//               <Tooltip title="Delete">
//                 <span>
//                   <IconButton
//                     onClick={handleDelete}
//                     disabled={saving || deleting}
//                     sx={{
//                       color: "white",
//                       background: alpha("#000", 0.15),
//                       "&:hover": { background: alpha("#000", 0.28) },
//                     }}
//                   >
//                     {deleting ? <CircularProgress size={18} /> : <DeleteOutlineRoundedIcon />}
//                   </IconButton>
//                 </span>
//               </Tooltip>
//             )}

//             <Tooltip title="Close">
//               <span>
//                 <IconButton
//                   onClick={onClose}
//                   disabled={saving || deleting}
//                   sx={{
//                     color: "white",
//                     background: alpha("#000", 0.15),
//                     "&:hover": { background: alpha("#000", 0.28) },
//                   }}
//                 >
//                   <CloseRoundedIcon />
//                 </IconButton>
//               </span>
//             </Tooltip>
//           </Box>
//         </Box>

//         {/* Body */}
//         <Box sx={{ p: 2.2, bgcolor: "#fbfcff" }}>
//           <Box
//             sx={{
//               p: 2,
//               borderRadius: 3,
//               border: "1px solid #e7ebf3",
//               background: "white",
//             }}
//           >
//             <Typography sx={{ fontWeight: 800, mb: 1.5, color: "#0f172a" }}>
//               Basic Details
//             </Typography>

//             <Grid container spacing={2}>
//               <Grid item xs={12} md={6}>
//                 <TextField
//                   label="Name *"
//                   fullWidth
//                   value={form.name}
//                   onChange={(e) => setField("name", e.target.value)}
//                 />
//               </Grid>

//               <Grid item xs={12} md={3}>
//                 <TextField
//                   label="Serial No"
//                   type="number"
//                   fullWidth
//                   value={form.serialno}
//                   onChange={(e) => setField("serialno", e.target.value)}
//                 />
//               </Grid>

//               <Grid item xs={12} md={3}>
//                 <TextField
//                   label="Prefix"
//                   fullWidth
//                   value={form.prefix}
//                   onChange={(e) => setField("prefix", e.target.value)}
//                 />
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <TextField
//                   label="Valpha"
//                   fullWidth
//                   value={form.valpha}
//                   onChange={(e) => setField("valpha", e.target.value)}
//                 />
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <TextField
//                   label="purchaseF3"
//                   fullWidth
//                   value={form.purchasef3}
//                   onChange={(e) => setField("purchasef3", e.target.value)}
//                 />
//               </Grid>

//               <Grid item xs={12} md={4}>
//                 <TextField
//                   label="Bill Type"
//                   fullWidth
//                   value={form.billtype}
//                   onChange={(e) => setField("billtype", e.target.value)}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   label="Path *"
//                   fullWidth
//                   value={form.path}
//                   onChange={(e) => setField("path", e.target.value)}
//                   helperText="Example: /purchasegst, /purchase, /purchase-win etc."
//                 />
//               </Grid>
//             </Grid>

//             <Divider sx={{ my: 2 }} />

//             <Typography sx={{ fontWeight: 800, mb: 1.2, color: "#0f172a" }}>
//               Posting Options (Y/N)
//             </Typography>

//             <Grid container spacing={1}>
//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={!!form.ledpost}
//                       onChange={(e) => setField("ledpost", e.target.checked)}
//                     />
//                   }
//                   label="Led Post"
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={!!form.gstpost}
//                       onChange={(e) => setField("gstpost", e.target.checked)}
//                     />
//                   }
//                   label="GST Post"
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={!!form.stkpost}
//                       onChange={(e) => setField("stkpost", e.target.checked)}
//                     />
//                   }
//                   label="Stock Post"
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={!!form.vatpost}
//                       onChange={(e) => setField("vatpost", e.target.checked)}
//                     />
//                   }
//                   label="VAT Post"
//                 />
//               </Grid>

//               <Grid item xs={12} sm={6} md={4}>
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={!!form.onbillno}
//                       onChange={(e) => setField("onbillno", e.target.checked)}
//                     />
//                   }
//                   label="On Bill No"
//                 />
//               </Grid>
//             </Grid>
//           </Box>
//         </Box>

//         {/* Footer */}
//         <Box
//           sx={{
//             px: 2.2,
//             py: 1.6,
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             borderTop: "1px solid #e7ebf3",
//             bgcolor: "white",
//           }}
//         >
//           <Typography sx={{ fontSize: 12, color: "#64748b" }}>
//             {isEdit ? "Update and save changes." : "Fill details and create new record."}
//           </Typography>

//           <Box sx={{ display: "flex", gap: 1 }}>
//             <Button variant="outlined" onClick={onClose} disabled={saving || deleting}>
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               onClick={handleSave}
//               disabled={saving || deleting}
//               startIcon={saving ? <CircularProgress size={18} /> : <SaveRoundedIcon />}
//               sx={{ minWidth: 140 }}
//             >
//               {isEdit ? "Update" : "Create"}
//             </Button>
//           </Box>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }

import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { alpha } from "@mui/material/styles";
import axios from "axios";
import { CompanyContext } from "../Context/CompanyContext";

const wrapStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 920,
  bgcolor: "#fff",
  borderRadius: 4,
  boxShadow: "0 22px 70px rgba(0,0,0,.22)",
  overflow: "hidden",
};

const ynToBool = (v) => String(v || "").toUpperCase() === "Y";
const boolToYn = (b) => (b ? "Y" : "N");

const emptyForm = {
  name: "",
  valpha: "",
  serialno: 0,
  prefix: "",
  onbillno: true,
  purchasef3: "",
  path: "",
  billtype: "",
  ledpost: false,
  gstpost: false,
  stkpost: false,
  vatpost: false,
};

export default function PurWinModal({ open, onClose }) {
  const { company } = useContext(CompanyContext);

  const tenant = "03AAYFG4472A1ZG_01042025_31032026";

  const [records, setRecords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isEdit = useMemo(() => !!editingId, [editingId]);

  // FETCH DATA
  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/purchase-win`
      );

      if (res.data?.ok) {
        setRecords(res.data.data || []);

        if (res.data.data.length > 0) {
          loadRecord(res.data.data[0], 0);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (open) fetchData();
  }, [open]);

  // LOAD RECORD INTO FORM
  const loadRecord = (rec, index) => {
    setCurrentIndex(index);
    setEditingId(rec._id);

    setForm({
      name: rec?.name || "",
      valpha: rec?.valpha || "",
      serialno: Number(rec?.serialno || 0),
      prefix: rec?.prefix || "",
      onbillno: ynToBool(rec?.onbillno),
      purchasef3: rec?.purchasef3 || "",
      path: rec?.path || "",
      billtype: rec?.billtype || "",
      ledpost: ynToBool(rec?.ledpost),
      gstpost: ynToBool(rec?.gstpost),
      stkpost: ynToBool(rec?.stkpost),
      vatpost: ynToBool(rec?.vatpost),
    });
  };

  const setField = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));

    if (!editingId) return;

    // switch to edit mode automatically
    setEditingId(records[currentIndex]?._id);
  };

  const validate = () => {
    if (!form.name.trim()) return "Name is required";
    if (!form.path.trim()) return "Path is required";
    return "";
  };

  // ADD NEw
  const addNewRecord = () => {
    setForm(emptyForm);
    setEditingId(null);
    setCurrentIndex(records.length);
  };

  // SAVE
  const handleSave = async () => {
    const err = validate();
    if (err) return alert(err);

    const payload = {
      name: form.name,
      valpha: form.valpha,
      serialno: Number(form.serialno),
      prefix: form.prefix,
      purchasef3: form.purchasef3,
      path: form.path,
      billtype: form.billtype,
      ledpost: boolToYn(form.ledpost),
      gstpost: boolToYn(form.gstpost),
      stkpost: boolToYn(form.stkpost),
      vatpost: boolToYn(form.vatpost),
      onbillno: boolToYn(form.onbillno),
    };

    try {
      setSaving(true);

      let res;

      if (isEdit) {
        res = await axios.put(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchase-win-update/${editingId}`,
          payload
        );
      } else {
        res = await axios.post(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchase-win-post`,
          payload
        );
      }

      if (!res.data?.ok) return alert("Save failed");
      onClose();
      fetchData();
    } catch (e) {
      alert(e.message);
    } finally {
      setSaving(false);
    }
  };

  // DELETE
  const handleDelete = async () => {
    if (!editingId) return;

    if (!window.confirm("Delete this record?")) return;

    try {
      setDeleting(true);

      const res = await axios.delete(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchase-win-delete/${editingId}`
      );

      if (!res.data?.ok) return alert("Delete failed");

      fetchData();
    } catch (e) {
      alert(e.message);
    } finally {
      setDeleting(false);
    }
  };

  // NEXT
  const nextRecord = () => {
    if (currentIndex + 1 >= records.length) return;

    loadRecord(records[currentIndex + 1], currentIndex + 1);
  };

  // PREVIOUS
  const prevRecord = () => {
    if (currentIndex === 0) return;

    loadRecord(records[currentIndex - 1], currentIndex - 1);
  };

  const headerGradient =
    "linear-gradient(135deg, rgba(15,23,42,1), rgba(2,132,199,1))";

  return (
    <Modal open={open} onClose={onClose} style={{ zIndex: 10000 }}>
      <Box sx={wrapStyle}>
        {/* HEADER */}
        <Box
          sx={{
            px: 2,
            py: 2,
            color: "white",
            background: headerGradient,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {isEdit ? <EditRoundedIcon /> : <AddRoundedIcon />}

            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>
                {isEdit ? "Edit Purchase Window" : "Create Purchase Window"}
              </Typography>
              <Typography sx={{ opacity: 0.85, fontSize: 12, mt: 0.2 }}>
                Add / update posting rules, prefix, path and bill settings
              </Typography>
            </Box>

            {isEdit && (
              <Chip
                label={`ID: ${editingId?.slice(-6)}`}
                size="small"
                sx={{ background: alpha("#fff", 0.2), color: "white" }}
              />
            )}
          </Box>

          <Box>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseRoundedIcon />
            </IconButton>
          </Box>
        </Box>

        {/* BODY */}
        <Box sx={{ p: 2 }}>
          <div style={{display:'flex', flexDirection:'row', justifyContent:"space-between"}}>
            <Typography sx={{ fontWeight: 800, mb: 1.5, color: "#0f172a" }}>           
              Basic Details        
            </Typography>
            <Typography sx={{ mb: 2, fontWeight: 700 }}>
              Record {records.length ? currentIndex + 1 : 0} / {records.length}
            </Typography>
          </div>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Name"
                fullWidth
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Serial"
                type="number"
                fullWidth
                value={form.serialno}
                onChange={(e) => setField("serialno", e.target.value)}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                label="Prefix"
                fullWidth
                value={form.prefix}
                onChange={(e) => setField("prefix", e.target.value)}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Valpha"
                fullWidth
                value={form.valpha}
                onChange={(e) => setField("valpha", e.target.value)}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="purchaseF3"
                fullWidth
                value={form.purchasef3}
                onChange={(e) => setField("purchasef3", e.target.value)}
              />
            </Grid>

            <Grid item xs={4}>
              <TextField
                label="Bill Type"
                fullWidth
                value={form.billtype}
                onChange={(e) => setField("billtype", e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Path"
                fullWidth
                value={form.path}
                onChange={(e) => setField("path", e.target.value)}
                helperText="Example: /purchasegst, /purchase, /purchase-win etc."
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Typography sx={{ fontWeight: 800, mb: 1.2, color: "#0f172a" }}>
            Posting Options (Y/N)
          </Typography>

          <Grid container>
            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.ledpost}
                    onChange={(e) => setField("ledpost", e.target.checked)}
                  />
                }
                label="Led Post"
              />
            </Grid>

            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.gstpost}
                    onChange={(e) => setField("gstpost", e.target.checked)}
                  />
                }
                label="GST Post"
              />
            </Grid>

            <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={form.stkpost}
                    onChange={(e) => setField("stkpost", e.target.checked)}
                  />
                }
                label="Stock Post"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!form.vatpost}
                      onChange={(e) => setField("vatpost", e.target.checked)}
                    />
                  }
                  label="VAT Post"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={!!form.onbillno}
                      onChange={(e) => setField("onbillno", e.target.checked)}
                    />
                  }
                  label="On Bill No"
                />
              </Grid>
          </Grid>
        </Box>

        {/* FOOTER */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #eee",
          }}
        >
          <Box>
            <Button
              variant="outlined"
              startIcon={<AddRoundedIcon />}
              onClick={addNewRecord}
              sx={{ mr: 1 }}
              >
              Add New
            </Button>
            <Button variant="outlined" onClick={prevRecord}>
              Previous
            </Button>

            <Button
              variant="outlined"
              onClick={nextRecord}
              sx={{ ml: 1 }}
            >
              Next
            </Button>
            <Button
              variant="outlined"
              onClick={handleDelete}
              sx={{ ml: 1 }}
            >
              Delete
            </Button>
          </Box>

          <Button
            variant="contained"
            onClick={handleSave}
            startIcon={<SaveRoundedIcon />}
            disabled={saving}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}