import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
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
import financialYear from "../../Shared/financialYear";
import useCompanySetup from "../../Shared/useCompanySetup";
import SaleRegister from "./SaleRegister";
import PurRegister from "./PurRegister";

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
const GST_STATE_CODES = {
  "Jammu and Kashmir": "01",
  "Himachal Pradesh": "02",
  Punjab: "03",
  Chandigarh: "04",
  Uttarakhand: "05",
  Haryana: "06",
  Delhi: "07",
  Rajasthan: "08",
  "Uttar Pradesh": "09",
  Bihar: "10",
  Sikkim: "11",
  "Arunachal Pradesh": "12",
  Nagaland: "13",
  Manipur: "14",
  Mizoram: "15",
  Tripura: "16",
  Meghalaya: "17",
  Assam: "18",
  "West Bengal": "19",
  Jharkhand: "20",
  Odisha: "21",
  Chhattisgarh: "22",
  "Madhya Pradesh": "23",
  Gujarat: "24",
  "Dadra and Nagar Haveli and Daman and Diu": "26",
  Maharashtra: "27",
  Karnataka: "29",
  Goa: "30",
  Lakshadweep: "31",
  Kerala: "32",
  "Tamil Nadu": "33",
  Puducherry: "34",
  "Andaman and Nicobar Islands": "35",
  Telangana: "36",
  "Andhra Pradesh": "37",
  Ladakh: "38",
};

export default function MonthlyFormModal({ open, onClose }) {
  const { companyName, companyAdd, companyCity, companyGST } =
    useCompanySetup();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    reportName: "GSTR-1 Offline Excel",
    fromDate: "",
    toDate: "",

    // 🔹 Conditional Fields
    taxType: "Exempted",
    defaultUom: "MTS",
    invoiceValue: "Taxable+GST",
    taxTypeS: "All",
    taxRate:"All",

    // 🔹 Always Visible
    rewriteHSN: false,
    taxTypeAuto: true,
    previousCGST: "0.00",
    previousSGST: "0.00",
    previousIGST: "0.00",
    previousCess: "0.00",
    selectSeries: false,
  });

  const [openSaleRegister, setOpenSaleRegister] = useState(false);
  const handleOpenSaleRegister = () => {
    setOpenSaleRegister(true);
  };

  const handleCloseSaleRegister = () => {
    setOpenSaleRegister(false);
  };
  const [openPurRegister, setOpenPurRegister] = useState(false);
  const handleOpenPurRegister = () => {
    setOpenPurRegister(true);
  };

  const handleClosePurRegister = () => {
    setOpenPurRegister(false);
  };

  const getCurrentFYAndMonth = () => {
    const today = new Date();

    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();
    const monthIndex = today.getMonth(); // 0 = Jan, 11 = Dec

    let startYear, endYear;

    // If month is Jan, Feb, Mar → FY started last year
    if (monthIndex <= 2) {
      startYear = year - 1;
      endYear = year;
    } else {
      startYear = year;
      endYear = year + 1;
    }

    const financialYear = `${startYear}-${endYear.toString().slice(-2)}`;

    return { financialYear, month };
  };

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");

  useEffect(() => {
    const { financialYear, month } = getCurrentFYAndMonth();
    setYear(financialYear);
    setMonth(month);
  }, []);

  const formatDate = (date) => {
    if (!date) return "";

    // If already in dd-mm-yyyy format, return as it is
    if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      return date;
    }

    const d = new Date(date);
    if (isNaN(d)) return date;

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
    if (!dateStr) return null;

    // ISO format (2026-03-09T00:00:00.000Z)
    if (dateStr.includes("T")) {
      return new Date(dateStr);
    }

    // dd/mm/yyyy
    if (dateStr.includes("/")) {
      const [day, month, year] = dateStr.split("/");
      return new Date(year, month - 1, day);
    }

    // dd-mm-yyyy
    if (dateStr.includes("-")) {
      const [day, month, year] = dateStr.split("-");
      return new Date(year, month - 1, day);
    }

    return new Date(dateStr);
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

  const groupB2CSData = (data) => {
    const grouped = {};

    data.forEach((sale) => {
      const customer = sale.customerDetails?.[0] || {};
      const stateName = customer.state || "Unknown";
      const stateCode = GST_STATE_CODES[stateName] || "";

      // 🔥 LOOP ALL ITEMS (instead of first item)
      (sale.items || []).forEach((item) => {
        const rate = Number(item.gst || 0);
        const taxable = Number(item.amount || 0); // item-wise taxable
        const cess = Number(item.cess || 0); // if exists

        const key = `${stateName}_${rate}`;

        if (!grouped[key]) {
          grouped[key] = {
            type: "OE",
            placeOfSupply: stateCode ? `${stateCode}-${stateName}` : stateName,
            rate: rate,
            taxableValue: 0,
            cess: 0,
          };
        }

        // ✅ ADD ITEM WISE (not invoice subtotal)
        grouped[key].taxableValue += taxable;
        grouped[key].cess += cess;
      });
    });

    return Object.values(grouped);
  };

  const handleExport = async () => {
    if (!formData.fromDate || !formData.toDate) {
      alert("Please select From and To date");
      return;
    }

    try {
      setLoading(true);

      const from = parseDate(formData.fromDate);
      const to = parseDate(formData.toDate);

      // GSTR-1 EXPORT
      if (
        formData.reportName === "GSTR-1 Offline Excel" ||
        formData.reportName === "GSTR-1 IFF (Quarterly)"
      ) {
        const response = await axios.get(
          "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale",
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

        // ✅ SPLIT REGISTERED & UNREGISTERED
        const b2bData = filteredData.filter((sale) =>
          sale.customerDetails?.[0]?.gstno?.trim(),
        );

        const b2csData = filteredData.filter(
          (sale) => !sale.customerDetails?.[0]?.gstno?.trim(),
        );

        const templateResponse = await fetch("excel/GSTR-1.xlsx");
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

        // ======================
        // ✅ B2B SHEET
        // ======================
        const b2bSheet = workbook.getWorksheet("b2b,sez,de");
        let currentRow = 5;

        b2bData.forEach((sale) => {
          const customer = sale.customerDetails?.[0] || {};
          const form = sale.formData || {};
          const gstNumber = customer.gstno || "";
          const stateCode = gstNumber.substring(0, 2);

          // 🔥 GROUP BY GST RATE
          const rateMap = {};

          (sale.items || []).forEach((item) => {
            const rate = Number(item.gst || 0);

            if (!rateMap[rate]) {
              rateMap[rate] = {
                taxableValue: 0,
                cgst: 0,
                sgst: 0,
                igst: 0,
                cess: 0,
              };
            }

            rateMap[rate].taxableValue += Number(item.amount || 0);
            rateMap[rate].cgst += Number(item.ctax || 0);
            rateMap[rate].sgst += Number(item.stax || 0);
            rateMap[rate].igst += Number(item.itax || 0);
          });

          // 🔥 CREATE ROW FOR EACH RATE
          Object.keys(rateMap).forEach((rate) => {
            const data = rateMap[rate];

            const row = b2bSheet.getRow(currentRow++);

            row.getCell(1).value = gstNumber;
            row.getCell(2).value = customer.vacode || "";
            row.getCell(3).value = form.vbillno || "";
            row.getCell(4).value = form.date ? new Date(form.date) : "";
            row.getCell(5).value = Number(form.grandtotal || 0);
            row.getCell(6).value = stateCode
              ? `${stateCode}-${customer.state || ""}`
              : "";
            row.getCell(7).value = "N";
            row.getCell(9).value = "Regular B2B";
            row.getCell(11).value = Number(rate);
            row.getCell(12).value = data.taxableValue;
            row.getCell(13).value = data.cess;

            row.commit();
          });
        });

        // ===== B2CS Sheet =====
        const b2csSheet = workbook.getWorksheet("b2cs");
        const groupedB2CS = groupB2CSData(b2csData);

        let b2csStartRow = 5;

        groupedB2CS.forEach((data, index) => {
          const row = b2csSheet.getRow(b2csStartRow + index);

          row.getCell(1).value = data.type;
          row.getCell(2).value = data.placeOfSupply;
          row.getCell(4).value = data.rate;
          row.getCell(5).value = data.taxableValue;
          row.getCell(6).value = data.cess;
          row.getCell(7).value = "";

          row.commit();
        });

        // ✅ HSN SHEET
        const hsnSheet = workbook.getWorksheet("hsn(b2b)");
        const groupedHSN = groupHSNData(b2bData);

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

        // ===== HSN (B2C) Sheet =====
        const hsnB2CSheet = workbook.getWorksheet("hsn(b2c)");

        const groupedHSN_B2C = groupHSNData(b2csData);

        let hsnB2CStartRow = 5;

        groupedHSN_B2C.forEach((hsnItem, index) => {
          const row = hsnB2CSheet.getRow(hsnB2CStartRow + index);

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
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          "GSTR1_Filtered.xlsx",
        );
      }

      //  GSTR-3B EXPORT
      else if (formData.reportName === "GSTR-3B Offline") {
        const [salesRes, purchaseRes] = await Promise.all([
          axios.get(
            "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale",
          ),
          axios.get(
            "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/purchase",
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
          itcSGST = 0,
          itcCess = 0;

        purchaseFiltered.forEach((purchase) => {
          itcIGST += Number(purchase.formData?.igst || 0);
          itcCGST += Number(purchase.formData?.cgst || 0);
          itcSGST += Number(purchase.formData?.sgst || 0);
          itcCess += Number(purchase.formData?.pcess || 0);
        });

        const templateResponse = await fetch("excel/gstr3b.xlsx");
        const buffer = await templateResponse.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        workbook.definedNames.model = [];

        const sheet = workbook.getWorksheet("Sheet2");
        // Company Details
        sheet.getCell("Q4").value = year;
        sheet.getCell("Q5").value = month;
        sheet.getCell("D8").value =
          companyName + "," + companyAdd + "," + companyCity;
        // ===== GSTIN Character Wise (Row 7, D to R) =====
        if (companyGST) {
          const gstArray = companyGST.split(""); // Split into characters

          const startCol = 4; // Column D = 4
          const rowNumber = 7;

          gstArray.forEach((char, index) => {
            const cell = sheet.getRow(rowNumber).getCell(startCol + index);
            cell.value = char;
          });
        }
        // 3.1(a)
        sheet.getCell("D14").value = taxable;
        sheet.getCell("G14").value = igst;
        sheet.getCell("J14").value = cgst;
        sheet.getCell("M14").value = sgst;
        // Eligible ITC
        sheet.getCell("D44").value = itcIGST;
        sheet.getCell("H44").value = itcCGST;
        sheet.getCell("L44").value = itcSGST;
        sheet.getCell("P44").value = itcCess;
        // Payment of Tax
        sheet.getCell("F71").value = igst;
        sheet.getCell("F72").value = itcIGST - igst;
        sheet.getCell("H72").value = itcCGST;

        // Sale Sheet
        const saleSheet = workbook.getWorksheet("Sale");
        let startRow = 3; // your data starts from row 3

        salesFiltered.forEach((sale, index) => {
          const row = saleSheet.getRow(startRow + index);

          const customer = sale.customerDetails?.[0] || {};
          const form = sale.formData || {};

          row.getCell(1).value = customer.vacode || ""; // Account Name
          row.getCell(2).value = customer.gstno || ""; // GST No
          row.getCell(3).value = form.vno || ""; // Bill No
          row.getCell(4).value = form.date ? new Date(form.date) : ""; // Date
          row.getCell(5).value = Number(form.sub_total || 0); // Taxable Value

          const gstRate = sale.items?.[0]?.gst || 0;
          row.getCell(6).value = gstRate; // GST Rate

          row.getCell(7).value = Number(form.cgst || 0); // CGST
          row.getCell(8).value = Number(form.sgst || 0); // SGST
          row.getCell(9).value = Number(form.igst || 0); // IGST
          row.getCell(10).value = Number(form.cess1 || 0); // Cess

          row.getCell(11).value = "Sheet2-D14"; // Link column

          row.commit();
        });

        // Purchase Sheet
        const purchaseSheet = workbook.getWorksheet("Purchase");
        let purchaseStartRow = 3; // your data starts from row 3

        purchaseFiltered.forEach((purchase, index) => {
          const row = purchaseSheet.getRow(purchaseStartRow + index);

          const supplier = purchase.supplierdetails?.[0] || {};
          const form = purchase.formData || {};
          const item = purchase.items?.[0] || {};

          row.getCell(1).value = supplier.vacode || ""; // Account Name
          row.getCell(2).value = supplier.gstno || ""; // GST No
          row.getCell(3).value = form.vno || ""; // Bill No

          // Input Date (Bill Date)
          if (form.date) {
            const [d, m, y] = form.date.split("-");
            row.getCell(4).value = new Date(`${y}-${m}-${d}`);
          }

          row.getCell(5).value = Number(form.sub_total || 0); // Taxable Value
          row.getCell(6).value = item.gst || 0; // GST Rate
          row.getCell(7).value = Number(form.cgst || 0); // CGST
          row.getCell(8).value = Number(form.sgst || 0); // SGST
          row.getCell(9).value = Number(form.igst || 0); // IGST
          row.getCell(10).value = Number(form.cess1 || 0); // Cess

          row.getCell(11).value = "Sheet2-D44"; // ITC mapping

          // Voucher Date (optional if different)
          if (form.vbdate) {
            const [d2, m2, y2] = form.vbdate.split("-");
            row.getCell(12).value = new Date(`${y2}-${m2}-${d2}`);
          }

          row.commit();
        });

        const fileBuffer = await workbook.xlsx.writeBuffer();

        saveAs(
          new Blob([fileBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          "GSTR3B.xlsx",
        );
      }

      // GSTR-1 IFF
      else if (formData.reportName === "GSTR-1 IFF (Monthly)") {
        const response = await axios.get(
          "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale",
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

        // ✅ SPLIT REGISTERED & UNREGISTERED
        const b2bData = filteredData.filter((sale) =>
          sale.customerDetails?.[0]?.gstno?.trim(),
        );

        const b2csData = filteredData.filter(
          (sale) => !sale.customerDetails?.[0]?.gstno?.trim(),
        );

        const templateResponse = await fetch("excel/gstr-f.xlsx");
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

        // ======================
        // ✅ B2B SHEET
        // ======================
        const b2bSheet = workbook.getWorksheet("b2b,sez,de");
        let currentRow = 5;

        b2bData.forEach((sale) => {
          const customer = sale.customerDetails?.[0] || {};
          const form = sale.formData || {};
          const gstNumber = customer.gstno || "";
          const stateCode = gstNumber.substring(0, 2);

          // 🔥 GROUP BY GST RATE
          const rateMap = {};

          (sale.items || []).forEach((item) => {
            const rate = Number(item.gst || 0);

            if (!rateMap[rate]) {
              rateMap[rate] = {
                taxableValue: 0,
                cgst: 0,
                sgst: 0,
                igst: 0,
                cess: 0,
              };
            }

            rateMap[rate].taxableValue += Number(item.amount || 0);
            rateMap[rate].cgst += Number(item.ctax || 0);
            rateMap[rate].sgst += Number(item.stax || 0);
            rateMap[rate].igst += Number(item.itax || 0);
          });

          // 🔥 CREATE ROW FOR EACH RATE
          Object.keys(rateMap).forEach((rate) => {
            const data = rateMap[rate];

            const row = b2bSheet.getRow(currentRow++);

            row.getCell(1).value = gstNumber;
            row.getCell(2).value = customer.vacode || "";
            row.getCell(3).value = form.vbillno || "";
            row.getCell(4).value = form.date ? new Date(form.date) : "";
            row.getCell(5).value = Number(form.grandtotal || 0);
            row.getCell(6).value = stateCode
              ? `${stateCode}-${customer.state || ""}`
              : "";
            row.getCell(7).value = "N";
            row.getCell(9).value = "Regular B2B";
            row.getCell(11).value = Number(rate);
            row.getCell(12).value = data.taxableValue;
            row.getCell(13).value = data.cess;

            row.commit();
          });
        });

        const fileBuffer = await workbook.xlsx.writeBuffer();

        saveAs(
          new Blob([fileBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          "gstr-f.xlsx",
        );
      }

      // SALE GSTR-1
      else if (formData.reportName === "Sale GSTR-1") {
        const salesRes = await axios.get(
          "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale",
        );

        const salesFiltered = salesRes.data.filter((sale) => {

          const form = sale.formData || {};
          const items = sale.items || [];

          const saleDate = new Date(form.date);

          const dateMatch = saleDate >= from && saleDate <= to;

          const taxTypeMatch =
            formData.taxTypeS === "All" ||
            form.stype === formData.taxTypeS;

          const taxRateMatch =
            formData.taxRate === "All" ||
            items.some((item) => Number(item.gst) === Number(formData.taxRate));

          return dateMatch && taxTypeMatch && taxRateMatch;

        });

        // Load Template
        const templateResponse = await fetch("excel/gstr-2.xlsx");
        const buffer = await templateResponse.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        workbook.definedNames.model = [];

        const sheet = workbook.getWorksheet("GROSS");

        // Company Details
        sheet.getCell("A1").value = "DETAIL OF OUTWARD SUPPLY";
        sheet.getCell("B3").value = "1.GSTIN : " + companyGST;
        sheet.getCell("B5").value =
          "2.NAME OF TAXABLE PERSON : " + companyName + ", " + companyCity;
        sheet.getCell("B7").value = `${formData.fromDate} - ${formData.toDate}`;

        // GROUP DATA USING customer.vcode

        let grouped = {};

        salesFiltered.forEach((sale) => {
          const customer = sale.customerDetails?.[0] || {};
          const form = sale.formData || {};
          const items = sale.items || [];

          const key = String(customer.Vcode || "UNKNOWN");

          const taxable = Number(form.sub_total || 0);
          const igst = Number(form.igst || 0);
          const cgst = Number(form.cgst || 0);
          const sgst = Number(form.sgst || 0);
          const cess = Number(form.cess1 || 0);

          let totalWeight = 0;
          let totalPkgs = 0;

          items.forEach((item) => {
            totalWeight += Number(item.weight || 0);
            totalPkgs += Number(item.pkgs || 0);
          });

          if (!grouped[key]) {
            grouped[key] = {
              date: formatDate(form.date),
              gstno: customer.gstno || "",
              name: customer.vacode || "",
              taxable: 0,
              igst: 0,
              cgst: 0,
              sgst: 0,
              cess: 0,
              weight: 0,
              pkgs: 0,
              taxtype: form.stype,
            };
          }

          grouped[key].taxable += taxable;
          grouped[key].igst += igst;
          grouped[key].cgst += cgst;
          grouped[key].sgst += sgst;
          grouped[key].cess += cess;
          grouped[key].weight += totalWeight;
          grouped[key].pkgs += totalPkgs;
        });

        // WRITE GROUPED DATA TO GROSS

        let startRow = 13;

        Object.values(grouped).forEach((data) => {
          const row = sheet.getRow(startRow++);

          const totalGST = data.igst + data.cgst + data.sgst;
          const totalAmount = data.taxable + totalGST + data.cess;

          row.getCell("A").value = data.gstno;
          row.getCell("B").value = data.name;
          row.getCell("C").value = data.taxable;
          row.getCell("E").value = data.igst;
          row.getCell("G").value = data.cgst;
          row.getCell("I").value = data.sgst;
          row.getCell("L").value = totalGST;
          row.getCell("M").value = data.cess;
          row.getCell("N").value = totalAmount;
          row.getCell("O").value = data.weight;
          row.getCell("P").value = data.pkgs;
          row.getCell("R").value = data.date;
          row.getCell("S").value = data.taxtype;

          row.commit();
        });

        // PRODUCT WISE (NO GROUPING)

        const productSheet = workbook.getWorksheet("PRODUCT_WISE");

        let productStartRow = 13;

        productSheet.getCell("A1").value = "DETAIL OF OUTWARD SUPPLY";
        productSheet.getCell("A3").value = "1.GSTIN : " + companyGST;
        productSheet.getCell("A5").value =
          "2.NAME OF TAXABLE PERSON : " + companyName + ", " + companyCity;
        productSheet.getCell("B7").value =
          `${formData.fromDate} - ${formData.toDate}`;
        productSheet.getCell("F7").value = "Apr-25";

        salesFiltered.forEach((sale) => {
          const customer = sale.customerDetails?.[0] || {};
          const form = sale.formData || {};
          const items = sale.items || [];

          items.forEach((item) => {
            const row = productSheet.getRow(productStartRow++);

            const taxable = Number(item.amount || 0);
            const igst = Number(item.itax || 0);
            const cgst = Number(item.ctax || 0);
            const sgst = Number(item.stax || 0);
            const total = Number(item.vamt || 0);
            const gstRate = Number(item.gst || 0);

            row.getCell("A").value = customer.gstno || "";
            row.getCell("B").value = customer.vacode || "";
            row.getCell("C").value = formatDate(form.date);
            row.getCell("D").value = form.vno || "";
            row.getCell("E").value = item.tariff || "";
            row.getCell("F").value = taxable;

            row.getCell("G").value = igst > 0 ? gstRate : 0;
            row.getCell("H").value = igst;

            row.getCell("I").value = cgst > 0 ? gstRate / 2 : 0;
            row.getCell("J").value = cgst;

            row.getCell("K").value = sgst > 0 ? gstRate / 2 : 0;
            row.getCell("L").value = sgst;

            row.getCell("M").value = 0;
            row.getCell("N").value = total;
            row.getCell("O").value = Number(item.weight || 0);
            row.getCell("P").value = Number(item.pkgs || 0);
            row.getCell("Q").value = form.stype || "";
            row.getCell("R").value = formatDate(form.date);
            row.getCell("S").value = item.sdisc || "";
            row.getCell("T").value = item.sdisc || "";
            row.getCell("U").value = item.Scodess || "";

            row.commit();
          });
        });

        // CREATE NEW SHEET
        const nameSheet = workbook.getWorksheet("NAME_WISE");

        let nameStartRow = 13;

        // HEADER
        nameSheet.getCell("A1").value = "DETAIL OF OUTWARD SUPPLY";
        nameSheet.getCell("F7").value = "Apr-25";

        let groupeddata = {};

        salesFiltered.forEach((sale) => {
          const customer = sale.customerDetails?.[0] || {};
          const form = sale.formData || {};
          const items = sale.items || [];

          const key = `${customer.vacode}_${form.vno}`;

          if (!groupeddata[key]) {
            groupeddata[key] = {
              customerName: customer.vacode || "",
              customerGST: customer.gstno || "",
              form,
              taxable: 0,
              igst: 0,
              cgst: 0,
              sgst: 0,
              total: 0,
              weight: 0,
              pkgs: 0,
              gstRate: 0,
              tariff: "",
            };
          }

          items.forEach((item) => {
            groupeddata[key].taxable += Number(item.amount || 0);
            groupeddata[key].igst += Number(item.itax || 0);
            groupeddata[key].cgst += Number(item.ctax || 0);
            groupeddata[key].sgst += Number(item.stax || 0);
            groupeddata[key].total += Number(item.vamt || 0);
            groupeddata[key].weight += Number(item.weight || 0);
            groupeddata[key].pkgs += Number(item.pkgs || 0);

            groupeddata[key].gstRate = Number(item.gst || 0);
            groupeddata[key].tariff = item.tariff || "";
          });
        });

        // ---- SORT ALPHABETICALLY ----
        let allRows = Object.values(groupeddata);
        allRows.sort((a, b) => a.customerName.localeCompare(b.customerName));

        // ---- INSERT ROWS ----
        allRows.forEach((data) => {

          const row = nameSheet.getRow(nameStartRow++);

          row.getCell("A").value = data.customerGST;
          row.getCell("B").value = data.customerName;
          row.getCell("C").value = formatDate(data.form.date);
          row.getCell("D").value = data.form.vno || "";
          row.getCell("E").value = data.tariff || "";

          row.getCell("F").value = data.taxable;

          row.getCell("G").value = data.igst > 0 ? data.gstRate : 0;
          row.getCell("H").value = data.igst;

          row.getCell("I").value = data.cgst > 0 ? data.gstRate / 2 : 0;
          row.getCell("J").value = data.cgst;

          row.getCell("K").value = data.sgst > 0 ? data.gstRate / 2 : 0;
          row.getCell("L").value = data.sgst;

          row.getCell("M").value = 0;
          row.getCell("N").value = data.total;
          row.getCell("O").value = data.weight;
          row.getCell("P").value = data.pkgs;

          row.commit();
        });

        const billSheet = workbook.getWorksheet("BILL_WISE");

        let billStartRow = 13;

        // HEADER
        billSheet.getCell("A1").value = "DETAIL OF OUTWARD SUPPLY";
        billSheet.getCell("A3").value = "1.GSTIN : " + companyGST;
        billSheet.getCell("A5").value =
          "2.NAME OF TAXABLE PERSON : " + companyName + ", " + companyCity;

        billSheet.getCell("B7").value = `${formData.fromDate} - ${formData.toDate}`;
        billSheet.getCell("F7").value = "Apr-25";

        // LOOP SALES (ONE ROW PER BILL)

        salesFiltered.forEach((sale) => {

          const customer = sale.customerDetails?.[0] || {};
          const form = sale.formData || {};
          const items = sale.items || [];

          const row = billSheet.getRow(billStartRow++);

          const taxable = Number(form.sub_total || 0);
          const igst = Number(form.igst || 0);
          const cgst = Number(form.cgst || 0);
          const sgst = Number(form.sgst || 0);
          const cess = Number(form.cess1 || 0);

          const totalGST = igst + cgst + sgst;
          const totalAmount = taxable + totalGST + cess;

          let totalWeight = 0;
          let totalPkgs = 0;
          let tarrif = "";
          let gstRate = 0
          let SaleAc = "";

          items.forEach((item) => {
            totalWeight += Number(item.weight || 0);
            totalPkgs += Number(item.pkgs || 0);
            tarrif = item.tariff || "" ;
            gstRate = Number(item.gst || 0);
            SaleAc = item.Scodess || "";
          });

          row.getCell("A").value = customer.gstno || "";
          row.getCell("B").value = customer.vacode || "";
          row.getCell("C").value = formatDate(form.date);
          row.getCell("D").value = form.vno || "";
          row.getCell("E").value = tarrif || "";
          row.getCell("F").value = taxable;

          row.getCell("G").value = igst > 0 ? gstRate : 0;
          row.getCell("H").value = igst;

          row.getCell("I").value = cgst > 0 ? gstRate / 2 : 0;
          row.getCell("J").value = cgst;

          row.getCell("K").value = sgst > 0 ? gstRate / 2 : 0;
          row.getCell("L").value = sgst;
          row.getCell("M").value = cess;
          row.getCell("N").value = totalAmount;
          row.getCell("O").value = totalWeight;
          row.getCell("P").value = totalPkgs;
          row.getCell("Q").value = form.stype || "";
          row.getCell("R").value = formatDate(form.date);
          row.getCell("S").value = SaleAc || "";

          row.commit();

        });
        workbook.views = [{
            activeTab: workbook.getWorksheet("GROSS").id - 1,},
        ];

        const fileBuffer = await workbook.xlsx.writeBuffer();

        saveAs(
          new Blob([fileBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          "gstr-2.xlsx",
        );
      }
      
      // PURCHASE GSTR-2
      else if (formData.reportName === "Purchase GSTR-2") {
        const purRes = await axios.get(
          "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/purchase",
        );

        const purFiltered = purRes.data.filter((pur) => {

          const form = pur.formData || {};
          const items = pur.items || [];

          const purDate = parseDate(form.date);

          const dateMatch = purDate >= from && purDate <= to;

          const taxTypeMatch =
            formData.taxTypeS === "All" ||
            form.stype === formData.taxTypeS;

          const taxRateMatch =
            formData.taxRate === "All" ||
            items.some((item) => Number(item.gst) === Number(formData.taxRate));

          return dateMatch && taxTypeMatch && taxRateMatch;

        });

        // Load Template
        const templateResponse = await fetch("excel/gstr-2.xlsx");
        const buffer = await templateResponse.arrayBuffer();

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);

        workbook.definedNames.model = [];

        const sheet = workbook.getWorksheet("GROSS");

        // Company Details
        sheet.getCell("B3").value = "1.GSTIN : " + companyGST;
        sheet.getCell("B5").value =
          "2.NAME OF TAXABLE PERSON : " + companyName + ", " + companyCity;
        sheet.getCell("B7").value = `${formData.fromDate} - ${formData.toDate}`;

        // GROUP DATA USING customer.vcode

        let grouped = {};

        purFiltered.forEach((pur) => {
          const customer = pur.supplierdetails?.[0] || {};
          const form = pur.formData || {};
          const items = pur.items || [];

          const key = String(customer.Vcode || "UNKNOWN");

          const taxable = Number(form.sub_total || 0);
          const igst = Number(form.igst || 0);
          const cgst = Number(form.cgst || 0);
          const sgst = Number(form.sgst || 0);
          const cess = Number(form.cess1 || 0);

          let totalWeight = 0;
          let totalPkgs = 0;

          items.forEach((item) => {
            totalWeight += Number(item.weight || 0);
            totalPkgs += Number(item.pkgs || 0);
          });

          if (!grouped[key]) {
            grouped[key] = {
              date: formatDate(form.date),
              gstno: customer.gstno || "",
              name: customer.vacode || "",
              taxable: 0,
              igst: 0,
              cgst: 0,
              sgst: 0,
              cess: 0,
              weight: 0,
              pkgs: 0,
              taxtype: form.stype,
            };
          }

          grouped[key].taxable += taxable;
          grouped[key].igst += igst;
          grouped[key].cgst += cgst;
          grouped[key].sgst += sgst;
          grouped[key].cess += cess;
          grouped[key].weight += totalWeight;
          grouped[key].pkgs += totalPkgs;
        });

        // WRITE GROUPED DATA TO GROSS

        let startRow = 13;

        Object.values(grouped).forEach((data) => {
          const row = sheet.getRow(startRow++);

          const totalGST = data.igst + data.cgst + data.sgst;
          const totalAmount = data.taxable + totalGST + data.cess;

          row.getCell("A").value = data.gstno;
          row.getCell("B").value = data.name;
          row.getCell("C").value = data.taxable;
          row.getCell("E").value = data.igst;
          row.getCell("G").value = data.cgst;
          row.getCell("I").value = data.sgst;
          row.getCell("L").value = totalGST;
          row.getCell("M").value = data.cess;
          row.getCell("N").value = totalAmount;
          row.getCell("O").value = data.weight;
          row.getCell("P").value = data.pkgs;
          row.getCell("R").value = data.date;
          row.getCell("S").value = data.taxtype;

          row.commit();
        });

        // PRODUCT WISE (NO GROUPING)

        const productSheet = workbook.getWorksheet("PRODUCT_WISE");

        let productStartRow = 13;

        productSheet.getCell("A3").value = "1.GSTIN : " + companyGST;
        productSheet.getCell("A5").value =
          "2.NAME OF TAXABLE PERSON : " + companyName + ", " + companyCity;
        productSheet.getCell("B7").value =
          `${formData.fromDate} - ${formData.toDate}`;
        productSheet.getCell("F7").value = "Apr-25";

        purFiltered.forEach((pur) => {
          const customer = pur.supplierdetails?.[0] || {};
          const form = pur.formData || {};
          const items = pur.items || [];

          items.forEach((item) => {
            const row = productSheet.getRow(productStartRow++);

            const taxable = Number(item.amount || 0);
            const igst = Number(item.itax || 0);
            const cgst = Number(item.ctax || 0);
            const sgst = Number(item.stax || 0);
            const total = Number(item.vamt || 0);
            const gstRate = Number(item.gst || 0);

            row.getCell("A").value = customer.gstno || "";
            row.getCell("B").value = customer.vacode || "";
            row.getCell("C").value = formatDate(form.date);
            row.getCell("D").value = form.vno || "";
            row.getCell("E").value = item.tariff || "";
            row.getCell("F").value = taxable;

            row.getCell("G").value = igst > 0 ? gstRate : 0;
            row.getCell("H").value = igst;

            row.getCell("I").value = cgst > 0 ? gstRate / 2 : 0;
            row.getCell("J").value = cgst;

            row.getCell("K").value = sgst > 0 ? gstRate / 2 : 0;
            row.getCell("L").value = sgst;

            row.getCell("M").value = 0;
            row.getCell("N").value = total;
            row.getCell("O").value = Number(item.weight || 0);
            row.getCell("P").value = Number(item.pkgs || 0);
            row.getCell("Q").value = form.stype || "";
            row.getCell("R").value = formatDate(form.date);
            row.getCell("S").value = item.sdisc || "";
            row.getCell("T").value = item.sdisc || "";
            row.getCell("U").value = item.Pcodess || "";

            row.commit();
          });
        });

        // CREATE NEW SHEET
        const nameSheet = workbook.getWorksheet("NAME_WISE");

        let nameStartRow = 13;

        // HEADER
        nameSheet.getCell("F7").value = "Apr-25";

        // ---- FLATTEN DATA ----
        let allRows = [];

        purFiltered.forEach((pur) => {
          const customer = pur.supplierdetails?.[0] || {};
          const form = pur.formData || {};
          const items = pur.items || [];

          items.forEach((item) => {
            allRows.push({
              customerName: customer.vacode || "",
              customerGST: customer.gstno || "",
              form,
              item,
            });
          });
        });

        // ---- SORT ALPHABETICALLY ----
        allRows.sort((a, b) => a.customerName.localeCompare(b.customerName));

        // ---- INSERT ROWS ----
        allRows.forEach((data) => {
          const { customerName, customerGST, form, item } = data;

          const row = nameSheet.getRow(nameStartRow++);

          const taxable = Number(item.amount || 0);
          const igst = Number(item.itax || 0);
          const cgst = Number(item.ctax || 0);
          const sgst = Number(item.stax || 0);
          const total = Number(item.vamt || 0);
          const gstRate = Number(item.gst || 0);

          row.getCell("A").value = customerGST;
          row.getCell("B").value = customerName;
          row.getCell("C").value = formatDate(form.date);
          row.getCell("D").value = form.vno || "";
          row.getCell("E").value = item.tariff || "";
          row.getCell("F").value = taxable;

          row.getCell("G").value = igst > 0 ? gstRate : 0;
          row.getCell("H").value = igst;

          row.getCell("I").value = cgst > 0 ? gstRate / 2 : 0;
          row.getCell("J").value = cgst;

          row.getCell("K").value = sgst > 0 ? gstRate / 2 : 0;
          row.getCell("L").value = sgst;

          row.getCell("M").value = 0;
          row.getCell("N").value = total;
          row.getCell("O").value = Number(item.weight || 0);
          row.getCell("P").value = Number(item.pkgs || 0);

          row.commit();
        });

        const billSheet = workbook.getWorksheet("BILL_WISE");

        let billStartRow = 13;

        // HEADER
        billSheet.getCell("A3").value = "1.GSTIN : " + companyGST;
        billSheet.getCell("A5").value =
          "2.NAME OF TAXABLE PERSON : " + companyName + ", " + companyCity;

        billSheet.getCell("B7").value = `${formData.fromDate} - ${formData.toDate}`;
        billSheet.getCell("F7").value = "Apr-25";

        // LOOP PURCHASE (ONE ROW PER ITEM)

        purFiltered.forEach((pur) => {

          const customer = pur.supplierdetails?.[0] || {};
          const form = pur.formData || {};
          const items = pur.items || [];

          items.forEach((item) => {

            const row = billSheet.getRow(billStartRow++);

            const taxable = Number(item.amount || 0);
            const igst = Number(item.itax || 0);
            const cgst = Number(item.ctax || 0);
            const sgst = Number(item.stax || 0);
            const cess = Number(item.cess || 0);

            const totalAmount = taxable + igst + cgst + sgst + cess;

            const gstRate = Number(item.gst || 0);
            const tariff = item.tariff || "";
            const purAc = item.Pcodess || "";

            const weight = Number(item.weight || 0);
            const pkgs = Number(item.pkgs || 0);

            row.getCell("A").value = customer.gstno || "";
            row.getCell("B").value = customer.vacode || "";
            row.getCell("C").value = formatDate(form.date);
            row.getCell("D").value = form.vno || "";
            row.getCell("E").value = tariff;
            row.getCell("F").value = taxable;

            row.getCell("G").value = igst > 0 ? gstRate : 0;
            row.getCell("H").value = igst;

            row.getCell("I").value = cgst > 0 ? gstRate / 2 : 0;
            row.getCell("J").value = cgst;

            row.getCell("K").value = sgst > 0 ? gstRate / 2 : 0;
            row.getCell("L").value = sgst;

            row.getCell("M").value = cess;
            row.getCell("N").value = totalAmount;
            row.getCell("O").value = weight;
            row.getCell("P").value = pkgs;
            row.getCell("Q").value = form.stype || "";
            row.getCell("R").value = formatDate(form.date);
            row.getCell("S").value = purAc;

            row.commit();

          });

        });

        workbook.views = [
          {
            activeTab: workbook.getWorksheet("GROSS").id - 1,
          },
        ];

        const fileBuffer = await workbook.xlsx.writeBuffer();

        saveAs(
          new Blob([fileBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          "gstr-2.xlsx",
        );
      }

      // SALE REGISTER
      else if(formData.reportName === "Sale Register"){
        handleOpenSaleRegister()
      }

      // PURCHASE REGISTER
      else if(formData.reportName === "Purchase Register"){
        handleOpenPurRegister()
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
            <MenuItem value="GSTR-3B Offline">GSTR-3B Offline</MenuItem>
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
            <MenuItem value="GSTR-2A Compare">GSTR-2A Compare</MenuItem>
            <MenuItem value="GSTR-8A Yearly Compare">
              GSTR-8A Yearly Compare
            </MenuItem>
            <MenuItem value="Sale GSTR-1">Sale GSTR-1</MenuItem>
            <MenuItem value="Purchase GSTR-2">Purchase GSTR-2</MenuItem>
            <MenuItem value="Job Work GSTR-04">Job Work GSTR-04</MenuItem>
            <MenuItem value="Sale Register">Sale Register</MenuItem>
            <MenuItem value="Purchase Register">Purchase Register</MenuItem>
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
                  <MenuItem value="CCM">CCM-CUBIC CENTIMETERS</MenuItem>
                  <MenuItem value="CBM">CBM-CUBIC METERS</MenuItem>
                  <MenuItem value="CAN">CAN-CANS</MenuItem>
                  <MenuItem value="BUN">BUN-BUNCHES</MenuItem>
                  <MenuItem value="BTL">BTL-BOTTLES</MenuItem>
                  <MenuItem value="BOX">BOX-BOX</MenuItem>
                  <MenuItem value="BAG">BAG-BAGS</MenuItem>
                  <MenuItem value="BAL">BAL-BALE</MenuItem>
                  <MenuItem value="BDL">BDL-BUNDLES</MenuItem>
                  <MenuItem value="BKL">BKL-BUCKLES</MenuItem>
                  <MenuItem value="BOU">BOU-BILLION OF UNITS</MenuItem>
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
                  <MenuItem value="Taxable+GST">Taxable + GST</MenuItem>
                  <MenuItem value="OnlyTaxable">Only Taxable</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          )}
          {(formData.reportName === "Sale GSTR-1" || formData.reportName === "Purchase GSTR-2"
           || formData.reportName === "Sale Register" || formData.reportName === "Purchase Register")  && (
            <Grid container spacing={1} mt={1}>
              {/* Default UOM */}
              <Grid item xs={4}>
                <TextField
                  className="custom-bordered-input"
                  variant="filled"
                  fullWidth
                  size="small"
                  select
                  label="TAX TYPE"
                  name="taxTypeS"
                  value={formData.taxTypeS}
                  onChange={handleChange}
                >
                  <MenuItem value="All">ALL</MenuItem>
                  <MenuItem value="GST Sale (RD)">GST Sale (RD)</MenuItem>
                  <MenuItem value="IGST Sale (RD)">IGST Sale (RD)</MenuItem>
                  <MenuItem value="GST (URD)">GST (URD)</MenuItem>
                  <MenuItem value="IGST (URD)">IGST (URD)</MenuItem>
                  <MenuItem value="Tax Free Within State">
                    Tax Free Within State
                  </MenuItem>
                  <MenuItem value="Tax Free Interstate">
                    Tax Free Interstate
                  </MenuItem>
                  <MenuItem value="Export Sale">Export Sale</MenuItem>
                  <MenuItem value="Export Sale(IGST)">
                    Export Sale(IGST)
                  </MenuItem>
                  <MenuItem value="Including GST">Including GST</MenuItem>
                  <MenuItem value="Including IGST">Including IGST</MenuItem>
                  <MenuItem value="Not Applicable">Not Applicable</MenuItem>
                  <MenuItem value="Exempted Sale">Exempted Sale</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  className="custom-bordered-input"
                  variant="filled"
                  fullWidth
                  size="small"
                  select
                  label="TAX RATE"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleChange}
                >
                  <MenuItem value="All">ALL</MenuItem>
                  <MenuItem value="5">5%</MenuItem>
                  <MenuItem value="12">12%</MenuItem>
                  <MenuItem value="18">18%</MenuItem>
                  <MenuItem value="28">28%</MenuItem>

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
                    label="FROM"
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
                    label="UPTO"
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
          <a
            style={{ color: "darkblue", fontWeight: "bold", fontSize: "16px" }}
            href="https://www.youtube.com/watch?v=zenkpKhwRJc"
            target="_blank"
            rel="noopener noreferrer"
          >
            Click Here
            <b style={{ color: "red", marginLeft: 10 }}>
              [How to Prepare & Upload GSTR-1 Excel Return]
            </b>
          </a>
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
          <SaleRegister
            open={openSaleRegister}
            onClose={handleCloseSaleRegister}
            formData={formData}
          />
          <PurRegister
            open={openPurRegister}
            onClose={handleClosePurRegister}
            formData={formData}
          />
        </Box>
      </Box>
    </Modal>
  );
}
