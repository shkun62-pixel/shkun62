// import React, { useState } from "react";
// import {
//   Modal,
//   Box,
//   Typography,
//   TextField,
//   Select,
//   MenuItem,
//   Checkbox,
//   FormControlLabel,
//   Button,
//   Grid,
//   Divider,
// } from "@mui/material";
// import InputMask from "react-input-mask";

// const style = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 700,
//   bgcolor: "#f9fafc",
//   borderRadius: "10px",
//   boxShadow: 24,
//   p: 0,
//   overflow: "hidden",
// };

// export default function MonthlyFormModal({ open, onClose }) {
//   const [formData, setFormData] = useState({
//     reportName: "GSTR-1 Offline Excel",
//     fromDate: "01/04/2025",
//     toDate: "30/03/2026",
//     rewriteHSN: false,
//     taxTypeAuto: true,
//     previousCGST: "0.00",
//     previousSGST: "0.00",
//     previousIGST: "0.00",
//     previousCess: "0.00",
//     selectSeries: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, checked, type } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={style}>
//         {/* Header */}
//         <Box
//           sx={{
//             background: "linear-gradient(90deg, #1976d2, #0d47a1)",
//             color: "white",
//             px: 3,
//             py: 2,
//           }}
//         >
//           <Typography variant="h6" fontWeight="bold">
//             Monthly GST Reports
//           </Typography>
//         </Box>

//         {/* Body */}
//         <Box sx={{ p: 3 }}>
//           {/* Report Name */}
//           <Typography fontWeight="bold" mb={1}>
//             Report Name
//           </Typography>
//           <Select
//             fullWidth
//             size="small"
//             name="reportName"
//             value={formData.reportName}
//             onChange={handleChange}
//           >
//             <MenuItem value="GSTR-1 Offline Excel">
//               GSTR-1 Offline Excel
//             </MenuItem>
//             <MenuItem value="GSTR-1 Summary">GSTR-1 Summary</MenuItem>
//             <MenuItem value="GSTR-3B Summary">GSTR-3B Summary</MenuItem>
//           </Select>

//           {/* Checkboxes */}
//           <Grid container spacing={2} mt={2}>
//             <Grid item xs={6}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     name="rewriteHSN"
//                     checked={formData.rewriteHSN}
//                     onChange={handleChange}
//                   />
//                 }
//                 label="Re-Write HSN"
//               />
//             </Grid>
//             <Grid item xs={6}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     name="taxTypeAuto"
//                     checked={formData.taxTypeAuto}
//                     onChange={handleChange}
//                   />
//                 }
//                 label="Tax Type Auto"
//               />
//             </Grid>
//           </Grid>

//           {/* Date Fields with InputMask */}
//           <Grid container spacing={2} mt={1}>
//             <Grid item xs={6}>
//               <Typography>From</Typography>
//               <InputMask
//                 mask="99/99/9999"
//                 value={formData.fromDate}
//                 onChange={handleChange}
//               >
//                 {(inputProps) => (
//                   <TextField
//                     {...inputProps}
//                     fullWidth
//                     size="small"
//                     name="fromDate"
//                     placeholder="DD/MM/YYYY"
//                   />
//                 )}
//               </InputMask>
//             </Grid>

//             <Grid item xs={6}>
//               <Typography>Upto</Typography>
//               <InputMask
//                 mask="99/99/9999"
//                 value={formData.toDate}
//                 onChange={handleChange}
//               >
//                 {(inputProps) => (
//                   <TextField
//                     {...inputProps}
//                     fullWidth
//                     size="small"
//                     name="toDate"
//                     placeholder="DD/MM/YYYY"
//                   />
//                 )}
//               </InputMask>
//             </Grid>
//           </Grid>

//           {/* Previous Balance Section */}
//           <Divider sx={{ my: 3 }} />
//           <Typography fontWeight="bold" color="primary" mb={2}>
//             Previous Balances
//           </Typography>

//           <Grid container spacing={2}>
//             {["previousCGST", "previousSGST", "previousIGST", "previousCess"].map(
//               (field) => (
//                 <Grid item xs={6} key={field}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label={field.replace("previous", "")}
//                     name={field}
//                     value={formData[field]}
//                     onChange={handleChange}
//                     type="number"
//                   />
//                 </Grid>
//               )
//             )}
//           </Grid>

//           <FormControlLabel
//             sx={{ mt: 2 }}
//             control={
//               <Checkbox
//                 name="selectSeries"
//                 checked={formData.selectSeries}
//                 onChange={handleChange}
//               />
//             }
//             label="Select Series"
//           />
//         </Box>

//         {/* Footer */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "flex-end",
//             gap: 2,
//             p: 2,
//             backgroundColor: "#eef2f7",
//           }}
//         >
//           <Button variant="outlined" color="inherit" onClick={onClose}>
//             Exit
//           </Button>
//           <Button variant="contained" color="success">
//             Export
//           </Button>
//           <Button variant="contained" color="primary">
//             Print
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }

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
  CircularProgress,
} from "@mui/material";
import InputMask from "react-input-mask";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

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
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    reportName: "GSTR-1 Offline Excel",
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

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const handleExport = async () => {
    if (formData.reportName !== "GSTR-1 Offline Excel") {
      alert("Export available only for GSTR-1 Offline Excel");
      return;
    }

    if (!formData.fromDate || !formData.toDate) {
      alert("Please select From and To date");
      return;
    }

    try {
      setLoading(true);

      const from = parseDate(formData.fromDate);
      const to = parseDate(formData.toDate);

      // 1️⃣ Fetch API
      const response = await axios.get(
        "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale"
      );

      const salesData = response.data;

      // 2️⃣ Filter By Date
      const filteredData = salesData.filter((sale) => {
        const saleDate = new Date(sale.formData?.date);
        return saleDate >= from && saleDate <= to;
      });

      if (filteredData.length === 0) {
        alert("No Data Found for Selected Date Range");
        setLoading(false);
        return;
      }

      // 3️⃣ Load Template
      const templateResponse = await fetch("/GSTR-1.xlsx");
      const buffer = await templateResponse.arrayBuffer();

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer, {
        ignoreNodes: [
          "dataValidations",
          "sheetProtection",
          "conditionalFormatting",
        ],
      });

      workbook.definedNames.model = [];

      const sheet = workbook.getWorksheet("b2b,sez,de");

      let startRow = 5;

      filteredData.forEach((sale, index) => {
        const row = sheet.getRow(startRow + index);

        const customer = sale.customerDetails?.[0] || {};
        const item = sale.items?.[0] || {};
        const form = sale.formData || {};
        const gstNumber = customer.gstno || "";
        const stateCode = gstNumber.substring(0, 2);

        row.getCell(1).value = customer.gstno || "";
        row.getCell(2).value = customer.vacode || "";
        row.getCell(3).value = form.vbillno || "";
        row.getCell(4).value = form.date ? new Date(form.date) : "";
        row.getCell(5).value = Number(form.grandtotal || 0);
        row.getCell(6).value = stateCode ? `${stateCode}-${customer.state || ""}` : "";
        row.getCell(7).value = "N";
        row.getCell(8).value = item.gst || 0;
        row.getCell(9).value = "Regular B2B";
        row.getCell(11).value = item.gst || 0;
        row.getCell(12).value = Number(form.sub_total || 0);
        row.getCell(13).value = Number(form.pcess || 0);

        row.commit();
      });

      const fileBuffer = await workbook.xlsx.writeBuffer();

      saveAs(
        new Blob([fileBuffer], {
          type:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        "GSTR1_Filtered.xlsx"
      );

    } catch (error) {
      alert("Export Failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* HEADER */}
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

        {/* BODY */}
        <Box sx={{ p: 3 }}>
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
            <MenuItem value="GSTR-1 Offline Excel">
              GSTR-1 Offline Excel
            </MenuItem>
            <MenuItem value="GSTR-1 Summary">GSTR-1 Summary</MenuItem>
            <MenuItem value="GSTR-3B Summary">GSTR-3B Summary</MenuItem>
          </Select>

          {/* Date Fields */}
          <Grid container spacing={2} mt={2}>
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
        </Box>

        {/* FOOTER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            p: 2,
            backgroundColor: "#eef2f7",
          }}
        >
          <Button variant="outlined" onClick={onClose}>
            Exit
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Export"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
