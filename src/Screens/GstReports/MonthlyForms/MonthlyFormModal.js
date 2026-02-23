import React, { useState, useEffect } from "react";
import { Modal,Box,Typography,TextField, MenuItem, Checkbox, FormControlLabel,
  Button, Grid, Divider, CircularProgress
} from "@mui/material";
import InputMask from "react-input-mask";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import financialYear from "../../Shared/financialYear";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: "#f9fafc",
  borderRadius: "10px",
  boxShadow: 24,
  overflow: "hidden",
};

export default function MonthlyFormModal({ open, onClose }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    reportName: "GSTR-1 Offline Excel",
    fromDate: "",
    toDate: "",

    // 🔹 Conditional Fields
    taxType: "Exempted",
    defaultUom: "MTS",
    invoiceValue: "Taxable+GST",

    // 🔹 Always Visible
    rewriteHSN: false,
    taxTypeAuto: true,
    previousCGST: "0.00",
    previousSGST: "0.00",
    previousIGST: "0.00",
    previousCess: "0.00",
    selectSeries: false,
  });

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const fy = financialYear.getFYDates();

    setFormData((prev) => ({
      ...prev,
      fromDate: formatDate(fy.start),
      toDate: formatDate(fy.end),
    }));
    console.log(formData.fromDate + formData.toDate);
    
  }, []);

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

  const groupHSNData = (salesData) => {
    const hsnMap = {};

    salesData.forEach((sale) => {
      sale.items?.forEach((item) => {
        const hsn = item.tariff || "UNKNOWN";

        if (!hsnMap[hsn]) {
          hsnMap[hsn] = {
            hsn: hsn,
            description: item.sdisc || "",
            uqc: item.Units || "NOS",
            quantity: 0,
            totalValue: 0,
            taxableValue: 0,
            rate: item.gst || 0,
            igst: 0,
            cgst: 0,
            sgst: 0,
            cess: 0,
          };
        }

        hsnMap[hsn].quantity += Number(item.weight || 0);
        hsnMap[hsn].totalValue += Number(item.vamt || 0);
        hsnMap[hsn].taxableValue += Number(item.amount || 0);
        hsnMap[hsn].igst += Number(item.itax || 0);
        hsnMap[hsn].cgst += Number(item.ctax || 0);
        hsnMap[hsn].sgst += Number(item.stax || 0);
      });
    });

    return Object.values(hsnMap);
  };

  // const handleExport = async () => {
  //   if (formData.reportName !== "GSTR-1 Offline Excel") {
  //     alert("Export available only for GSTR-1 Offline Excel");
  //     return;
  //   }

  //   if (!formData.fromDate || !formData.toDate) {
  //     alert("Please select From and To date");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const from = parseDate(formData.fromDate);
  //     const to = parseDate(formData.toDate);

  //     const response = await axios.get(
  //       "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale"
  //     );

  //     const salesData = response.data;

  //     const filteredData = salesData.filter((sale) => {
  //       const saleDate = new Date(sale.formData?.date);
  //       return saleDate >= from && saleDate <= to;
  //     });

  //     if (filteredData.length === 0) {
  //       alert("No Data Found for Selected Date Range");
  //       return;
  //     }

  //     const templateResponse = await fetch("/GSTR-1.xlsx");
  //     const buffer = await templateResponse.arrayBuffer();

  //     const workbook = new ExcelJS.Workbook();
  //     await workbook.xlsx.load(buffer, {
  //       ignoreNodes: [
  //         "dataValidations",
  //         "sheetProtection",
  //         "conditionalFormatting",
  //       ],
  //     });

  //     workbook.definedNames.model = [];
  //     const sheet = workbook.getWorksheet("b2b,sez,de");

  //     let startRow = 5;

  //     filteredData.forEach((sale, index) => {
  //       const row = sheet.getRow(startRow + index);

  //       const customer = sale.customerDetails?.[0] || {};
  //       const item = sale.items?.[0] || {};
  //       const form = sale.formData || {};
  //       const gstNumber = customer.gstno || "";
  //       const stateCode = gstNumber.substring(0, 2);

  //       row.getCell(1).value = customer.gstno || "";
  //       row.getCell(2).value = customer.vacode || "";
  //       row.getCell(3).value = form.vbillno || "";
  //       row.getCell(4).value = form.date ? new Date(form.date) : "";
  //       row.getCell(5).value = Number(form.grandtotal || 0);
  //       row.getCell(6).value = stateCode
  //         ? `${stateCode}-${customer.state || ""}`
  //         : "";
  //       row.getCell(7).value = "N";
  //       row.getCell(8).value = item.gst || 0;
  //       row.getCell(9).value = "Regular B2B";
  //       row.getCell(11).value = item.gst || 0;
  //       row.getCell(12).value = Number(form.sub_total || 0);
  //       row.getCell(13).value = Number(form.pcess || 0);

  //       row.commit();
  //     });

  //     // 🔥 HSN (B2B) Sheet
  //     const hsnSheet = workbook.getWorksheet("hsn(b2b)");

  //     const groupedHSN = groupHSNData(filteredData);

  //     let hsnStartRow = 5; // change if your template starts at different row

  //     groupedHSN.forEach((hsnItem, index) => {
  //       const row = hsnSheet.getRow(hsnStartRow + index);

  //       row.getCell(1).value = hsnItem.hsn;
  //       row.getCell(2).value = hsnItem.description;
  //       row.getCell(3).value = hsnItem.uqc;
  //       row.getCell(4).value = hsnItem.quantity;
  //       row.getCell(5).value = hsnItem.totalValue;
  //       row.getCell(6).value = hsnItem.rate;
  //       row.getCell(7).value = hsnItem.taxableValue;
  //       row.getCell(8).value = hsnItem.igst;
  //       row.getCell(9).value = hsnItem.cgst;
  //       row.getCell(10).value = hsnItem.sgst;
  //       row.getCell(11).value = hsnItem.cess;

  //       row.commit();
  //     });

  //     const fileBuffer = await workbook.xlsx.writeBuffer();

  //     saveAs(
  //       new Blob([fileBuffer], {
  //         type:
  //           "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       }),
  //       "GSTR1_Filtered.xlsx"
  //     );
  //   } catch (error) {
  //     alert("Export Failed");
  //     console.error(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleExport = async () => {
    if (!formData.fromDate || !formData.toDate) {
      alert("Please select From and To date");
      return;
    }

    try {
      setLoading(true);

      const from = parseDate(formData.fromDate);
      const to = parseDate(formData.toDate);

      // ===============================
      // 🔥 GSTR-1 EXPORT
      // ===============================
      if (formData.reportName === "GSTR-1 Offline Excel") {

        const response = await axios.get(
          "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale"
        );

        const salesData = response.data;

        const filteredData = salesData.filter((sale) => {
          const saleDate = new Date(sale.formData?.date);
          return saleDate >= from && saleDate <= to;
        });

        if (filteredData.length === 0) {
          alert("No Data Found for Selected Date Range");
          return;
        }

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

        // ===== B2B Sheet =====
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
          row.getCell(6).value = stateCode
            ? `${stateCode}-${customer.state || ""}`
            : "";
          row.getCell(7).value = "N";
          row.getCell(8).value = item.gst || 0;
          row.getCell(9).value = "Regular B2B";
          row.getCell(11).value = item.gst || 0;
          row.getCell(12).value = Number(form.sub_total || 0);
          row.getCell(13).value = Number(form.pcess || 0);

          row.commit();
        });

        // ===== HSN Sheet =====
        const hsnSheet = workbook.getWorksheet("hsn(b2b)");
        const groupedHSN = groupHSNData(filteredData);

        let hsnStartRow = 5;

        groupedHSN.forEach((hsnItem, index) => {
          const row = hsnSheet.getRow(hsnStartRow + index);

          row.getCell(1).value = hsnItem.hsn;
          row.getCell(2).value = hsnItem.description;
          row.getCell(3).value = hsnItem.uqc;
          row.getCell(4).value = hsnItem.quantity;
          row.getCell(5).value = hsnItem.totalValue;
          row.getCell(6).value = hsnItem.rate;
          row.getCell(7).value = hsnItem.taxableValue;
          row.getCell(8).value = hsnItem.igst;
          row.getCell(9).value = hsnItem.cgst;
          row.getCell(10).value = hsnItem.sgst;
          row.getCell(11).value = hsnItem.cess;

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
      }

      // ===============================
      // 🔥 GSTR-3B EXPORT
      // ===============================
      else if (formData.reportName === "GSTR-3B Offline") {

        const [salesRes, purchaseRes] = await Promise.all([
          axios.get(
            "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale"
          ),
          axios.get(
            "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/purchase"
          ),
        ]);

        const salesFiltered = salesRes.data.filter((sale) => {
          const saleDate = new Date(sale.formData?.date);
          return saleDate >= from && saleDate <= to;
        });

        const purchaseFiltered = purchaseRes.data.filter((purchase) => {
          const rawDate = purchase.formData?.date;
          if (!rawDate) return false;

          const [d, m, y] = rawDate.split("-");
          const dateObj = new Date(`${y}-${m}-${d}`);
          return dateObj >= from && dateObj <= to;
        });

        // ===== Calculate Sales Summary =====
        let taxable = 0,
          igst = 0,
          cgst = 0,
          sgst = 0;

        salesFiltered.forEach((sale) => {
          taxable += Number(sale.formData?.sub_total || 0);
          igst += Number(sale.formData?.igst || 0);
          cgst += Number(sale.formData?.cgst || 0);
          sgst += Number(sale.formData?.sgst || 0);
        });

        // ===== Calculate ITC =====
        let itcIGST = 0,
          itcCGST = 0,
          itcSGST = 0;

        purchaseFiltered.forEach((purchase) => {
          itcIGST += Number(purchase.formData?.igst || 0);
          itcCGST += Number(purchase.formData?.cgst || 0);
          itcSGST += Number(purchase.formData?.sgst || 0);
        });

        const templateResponse = await fetch("excel/GSTR3B.xlsx");
        const buffer = await templateResponse.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        workbook.definedNames.model = [];

        const sheet = workbook.getWorksheet("Sheet2");

        // 3.1(a)
        sheet.getCell("D14").value = taxable;
        sheet.getCell("G14").value = igst;
        sheet.getCell("J14").value = cgst;
        sheet.getCell("M14").value = sgst;

        // 4(A)(5)
        sheet.getCell("D27").value = itcIGST;
        sheet.getCell("E27").value = itcCGST;
        sheet.getCell("F27").value = itcSGST;

        const fileBuffer = await workbook.xlsx.writeBuffer();

        saveAs(
          new Blob([fileBuffer], {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          "GSTR3B.xlsx"
        );
      }

      else {
        alert("Export not configured for selected report");
      }

    } catch (error) {
      alert("Export Failed");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
        open={open}
        onClose={(event, reason) => {
          if (reason === "backdropClick") return; // ❌ Prevent outside click close
          onClose(); // ✅ Allow close only from Exit button or ESC
        }}
      >
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

          <TextField
            fullWidth
            size="small"
            select
            label="REPORT NAME"
            name="reportName"
            value={formData.reportName}
            onChange={handleChange}
            variant="filled"
            className="custom-bordered-input"
          >
            <MenuItem value="GSTR-1 Offline Excel">
              GSTR-1 Offline Excel
            </MenuItem>
            {/* <MenuItem value="GSTR-1 Direct Upload">
              GSTR-1 Direct Upload
            </MenuItem> */}
            <MenuItem value="GSTR-3B Offline">
              GSTR-3B Offline
            </MenuItem>
            <MenuItem value="GSTR-2B / 3B Compare">
              GSTR-2B / 3B Compare
            </MenuItem>
            <MenuItem value="GSTR-2 Offline Excel">
              GSTR-2 Offline Excel
            </MenuItem>
            <MenuItem value="GSTR-1 IFF (Monthly)">
              GSTR-1 IFF (Monthly) 
            </MenuItem>
            <MenuItem value="GSTR-1 IFF (Quarterly)">
              GSTR-1 IFF (Quarterly) 
            </MenuItem>
            <MenuItem value="GSTR-2A Compare">
              GSTR-2A Compare
            </MenuItem>
            <MenuItem value="GSTR-8A Yearly Compare">
              GSTR-8A Yearly Compare
            </MenuItem>
            <MenuItem value="Sale GSTR-1">
              Sale GSTR-1
            </MenuItem>
            <MenuItem value="Purchase GSTR-2">
              Purchase GSTR-2
            </MenuItem>
            <MenuItem value="Job Work GSTR-04">
              Job Work GSTR-04
            </MenuItem>
            <MenuItem value="Sale Register">
              Sale Register
            </MenuItem>
            <MenuItem value="Purchase Register">
              Purchase Register
            </MenuItem>
          </TextField>

          {/* 🔹 Conditional Fields */}
          {formData.reportName === "GSTR-1 Offline Excel" && (
            <Grid container spacing={1} mt={1}>

              {/* Tax Type */}
              <Grid item xs={5}>
                <TextField
                  className="custom-bordered-input"
                  variant="filled"
                  fullWidth
                  size="small"
                  select
                  label="TAX TYPE"
                  name="taxType"
                  value={formData.taxType}
                  onChange={handleChange}
                >
                  <MenuItem value="Exempted">
                    Tax Free Sale in Exempted Sheet
                  </MenuItem>
                  <MenuItem value="B2b & B2c">
                    Tax Free Sale in B2B & B2C Sheet
                  </MenuItem>
                </TextField>
              </Grid>

              {/* Default UOM */}
              <Grid item xs={4}>
                <TextField
                  className="custom-bordered-input"
                  variant="filled"
                  fullWidth
                  size="small"
                  select
                  label="DEFAULT UOM"
                  name="defaultUom"
                  value={formData.defaultUom}
                  onChange={handleChange}
                >
                  <MenuItem value="TUB">TUB-TUBES</MenuItem>
                  <MenuItem value="UGS-US">UGS-US GALLONS</MenuItem>
                  <MenuItem value="UNT">UNT-UNITS</MenuItem>
                  <MenuItem value="YDS">YDS-YARDS</MenuItem>
                  <MenuItem value="OTH">OTH-OTHERS</MenuItem>
                  <MenuItem value="LTR">LTR-LITRES</MenuItem>
                  <MenuItem value="TON">TON-TONNES</MenuItem>
                  <MenuItem value="THD">THD-THOUSAND</MenuItem>
                  <MenuItem value="TGM">TGM-TEN GROSS</MenuItem>
                  <MenuItem value="TBS">TBS-TABLETS</MenuItem>
                  <MenuItem value="SQY">SQY-SQUARE YARDS</MenuItem>
                  <MenuItem value="SQM">SQM-SQUARE METERS</MenuItem>
                  <MenuItem value="SQF">SQF-SQUARE-FEET</MenuItem>
                  <MenuItem value="SET">SET-SETS</MenuItem>
                  <MenuItem value="ROL">ROL-ROLLS</MenuItem>
                  <MenuItem value="QTL">QTL-QUINTAL</MenuItem>
                  <MenuItem value="PRS">PRS-PAIRS</MenuItem>
                  <MenuItem value="PCS">PCS-PIECES</MenuItem>
                  <MenuItem value="PAC">PAC-PACKS</MenuItem>
                  <MenuItem value="NOS">NOS-NUMBERS</MenuItem>
                  <MenuItem value="MTS">MTS-METRIC TON</MenuItem>
                  <MenuItem value="MTR">MTR-METERS</MenuItem>
                  <MenuItem value="MLT">MLT-MILILITRE</MenuItem>
                  <MenuItem value="KME">KME-KILOMETRE</MenuItem>
                  <MenuItem value="KLR">KLR-KILOLITRE</MenuItem>
                  <MenuItem value="KGS">KGS-KILOGRAMS</MenuItem>
                  <MenuItem value="GYD">GYD-GROSS YARDS</MenuItem>
                  <MenuItem value="GRS">GRS-GROSS</MenuItem>
                  <MenuItem value="GMS">GMS-GRAMMES</MenuItem>
                  <MenuItem value="GGK">GGK-GREAT GROSS</MenuItem>
                  <MenuItem value="DRM">DRM-DRUMS</MenuItem>
                  <MenuItem value="DOZ">DOZ-DOZENS</MenuItem>
                  <MenuItem value="CTN">CTN-CARTONS</MenuItem>
                  <MenuItem value="CMS">CMS-CENTIMETERS</MenuItem>
                  <MenuItem value="CCM">
                    CCM-CUBIC CENTIMETERS
                  </MenuItem>
                  <MenuItem value="CBM">CBM-CUBIC METERS</MenuItem>
                  <MenuItem value="CAN">CAN-CANS</MenuItem>
                  <MenuItem value="BUN">BUN-BUNCHES</MenuItem>
                  <MenuItem value="BTL">BTL-BOTTLES</MenuItem>
                  <MenuItem value="BOX">BOX-BOX</MenuItem>
                  <MenuItem value="BAG">BAG-BAGS</MenuItem>
                  <MenuItem value="BAL">BAL-BALE</MenuItem>
                  <MenuItem value="BDL">BDL-BUNDLES</MenuItem>
                  <MenuItem value="BKL">BKL-BUCKLES</MenuItem>
                  <MenuItem value="BOU">
                    BOU-BILLION OF UNITS
                  </MenuItem>
                </TextField>
              </Grid>

              {/* Invoice Value */}
              <Grid item xs={3}>
                <TextField
                className="custom-bordered-input"
                  variant="filled"
                  fullWidth
                  size="small"
                  select
                  label="INVOICE VALUE"
                  name="invoiceValue"
                  value={formData.invoiceValue}
                  onChange={handleChange}
                >
                  <MenuItem value="Taxable+GST">
                    Taxable + GST
                  </MenuItem>
                  <MenuItem value="OnlyTaxable">
                    Only Taxable
                  </MenuItem>
                </TextField>
              </Grid>

            </Grid>
          )}

          {/* Date Fields */}
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <InputMask
                mask="99/99/9999"
                value={formData.fromDate}
                onChange={handleChange}
              >
                {(inputProps) => (
                  <TextField
                    {...inputProps}
                    fullWidth
                    label ="FROM"
                    variant="filled"
                    className="custom-bordered-input"
                    size="small"
                    name="fromDate"
                  />
                )}
              </InputMask>
            </Grid>

            <Grid item xs={6}>
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
                    label ="UPTO"
                    variant="filled"
                    className="custom-bordered-input"
                    name="toDate"
                  />
                )}
              </InputMask>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Always Visible Section */}
          <Grid container spacing={2}>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="PREVIOUS CGST"
                name="previousCGST"
                variant="filled"
                className="custom-bordered-input"
                value={formData.previousCGST}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="PREVIOUS SGST"
                name="previousSGST"
                variant="filled"
                className="custom-bordered-input"
                value={formData.previousSGST}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="PREVIOUS IGST"
                name="previousIGST"
                variant="filled"
                className="custom-bordered-input"
                value={formData.previousIGST}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="PREVIOUS CESS"
                name="previousCess"
                variant="filled"
                className="custom-bordered-input"
                value={formData.previousCess}
                onChange={handleChange}
              />
            </Grid>

            {/* <Grid item xs={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="selectSeries"
                    checked={formData.selectSeries}
                    onChange={handleChange}
                  />
                }
                label="Select Series"
              />
            </Grid> */}
              <Grid item xs={4}>
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

            <Grid item xs={4}>
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
          <a style={{color:"darkblue", fontWeight:'bold', fontSize:"16px"}} href="https://www.youtube.com/watch?v=zenkpKhwRJc" target="_blank" rel="noopener noreferrer">Click Here
          <b style={{color:"red", marginLeft:10}}>[How to Prepare & Upload GSTR-1 Excel Return]</b></a>
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
          <Button variant="outlined" disabled={loading} onClick={onClose}>
            Exit
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={handleExport}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "Blue" }} />
            ) : (
              "Export"
            )}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}