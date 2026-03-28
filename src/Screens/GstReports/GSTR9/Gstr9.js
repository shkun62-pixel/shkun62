import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputMask from "react-input-mask";
import { TextField } from "@mui/material";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import financialYear from "../../Shared/financialYear";
import * as XLSX from "xlsx";

const Gstr9 = ({ show, onHide }) => {
  const [fromDate, setFromDate] = useState("");
  const [uptoDate, setUptoDate] = useState("");

  const fromRef = useRef(null);

  // ================= DATE =================
  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(formatDate(fy.start));
    setUptoDate(formatDate(fy.end));

    setTimeout(() => fromRef.current?.focus(), 100);
  }, []);

  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    // dd-mm-yyyy
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [dd, mm, yyyy] = dateStr.split("-");
      return new Date(yyyy, mm - 1, dd);
    }

    // ISO
    return new Date(dateStr);
  };

  const getRange = () => {
    const from = parseDate(fromDate);
    const upto = parseDate(uptoDate);

    from.setHours(0, 0, 0, 0);
    upto.setHours(23, 59, 59, 999);

    return { from, upto };
  };

  // ================= MAIN EXPORT =================
    const exportGSTR9 = async () => {
    try {
        const { from, upto } = getRange();

        // ================= FETCH =================
        const [saleRes, purchaseRes] = await Promise.all([
        axios.get("https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale"),
        axios.get("https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/purchase"),
        ]);

        const sales = saleRes.data.filter((s) => {
        const d = parseDate(s.formData?.date);
        return d && d >= from && d <= upto;
        });

        const purchases = purchaseRes.data.filter((p) => {
        const d = parseDate(p.formData?.date);
        return d && d >= from && d <= upto;
        });

        // ================= TABLE 4 =================
        const g9 = {
        b2c: { taxable: 0, cgst: 0, sgst: 0, igst: 0 },
        b2b: { taxable: 0, cgst: 0, sgst: 0, igst: 0 },
        export: { taxable: 0, igst: 0 },
        };

        sales.forEach((s) => {
        const f = s.formData || {};
        const taxable = Number(f.sub_total || 0);
        const cgst = Number(f.cgst || 0);
        const sgst = Number(f.sgst || 0);
        const igst = Number(f.igst || 0);

        const customer = s.customerDetails?.[0] || {};
        const isRegistered = customer.gstno;
        const isExport = f.stype?.toLowerCase().includes("export");

        if (isExport) {
            g9.export.taxable += taxable;
            g9.export.igst += igst;
        } else if (isRegistered) {
            g9.b2b.taxable += taxable;
            g9.b2b.cgst += cgst;
            g9.b2b.sgst += sgst;
            g9.b2b.igst += igst;
        } else {
            g9.b2c.taxable += taxable;
            g9.b2c.cgst += cgst;
            g9.b2c.sgst += sgst;
            g9.b2c.igst += igst;
        }
        });

        // ================= HSN OUTWARD =================
        const hsnOut = {};
        sales.forEach((s) => {
        (s.items || []).forEach((item) => {
            const hsn = item.tariff || "NA";

            if (!hsnOut[hsn]) {
            hsnOut[hsn] = {
                hsn,
                desc: item.sdisc || "",
                uqc: item.Units || "NOS",
                qty: 0,
                taxable: 0,
                igst: 0,
                cgst: 0,
                sgst: 0,
            };
            }

            hsnOut[hsn].qty += Number(item.weight || 0);
            hsnOut[hsn].taxable += Number(item.amount || 0);
            hsnOut[hsn].igst += Number(item.itax || 0);
            hsnOut[hsn].cgst += Number(item.ctax || 0);
            hsnOut[hsn].sgst += Number(item.stax || 0);
        });
        });

        // ================= HSN INWARD =================
        const hsnIn = {};
        purchases.forEach((p) => {
        (p.items || []).forEach((item) => {
            const hsn = item.tariff || "NA";

            if (!hsnIn[hsn]) {
            hsnIn[hsn] = {
                hsn,
                desc: item.sdisc || "",
                uqc: item.Units || "NOS",
                qty: 0,
                taxable: 0,
                igst: 0,
                cgst: 0,
                sgst: 0,
            };
            }

            hsnIn[hsn].qty += Number(item.weight || 0);
            hsnIn[hsn].taxable += Number(item.amount || 0);
            hsnIn[hsn].igst += Number(item.itax || 0);
            hsnIn[hsn].cgst += Number(item.ctax || 0);
            hsnIn[hsn].sgst += Number(item.stax || 0);
        });
        });

        // ================= LOAD XLSM =================
        const res = await fetch("excel/gstr-9.xlsm");
        const buffer = await res.arrayBuffer();

        const workbook = XLSX.read(buffer, {
        type: "array",
        bookVBA: true,
        cellStyles: true,
        WTF: false,
        });

        // ================= WRITE DATA =================
        const t4 = workbook.Sheets["4 Outward"];

        // B2C
        if (t4["F7"]) t4["F7"].v = g9.b2c.taxable;
        if (t4["G7"]) t4["G7"].v = g9.b2c.cgst;
        if (t4["H7"]) t4["H7"].v = g9.b2c.sgst;
        if (t4["I7"]) t4["I7"].v = g9.b2c.igst;

        // B2B
        if (t4["F8"]) t4["F8"].v = g9.b2b.taxable;
        if (t4["G8"]) t4["G8"].v = g9.b2b.cgst;
        if (t4["H8"]) t4["H8"].v = g9.b2b.sgst;
        if (t4["I8"]) t4["I8"].v = g9.b2b.igst;

        // ================= HSN OUTWARD =================
        const s17 = workbook.Sheets["17 HSN Outward"];
        let row = 6;

        Object.values(hsnOut).forEach((d) => {
        s17[`B${row}`] = { v: d.hsn };
        s17[`C${row}`] = { v: d.desc };
        s17[`D${row}`] = { v: d.uqc };
        s17[`E${row}`] = { v: d.qty };
        s17[`F${row}`] = { v: d.taxable };
        s17[`I${row}`] = { v: d.igst };
        s17[`J${row}`] = { v: d.cgst };
        s17[`K${row}`] = { v: d.sgst };
        row++;
        });

        // ================= HSN INWARD =================
        const s18 = workbook.Sheets["18 HSN Inward"];
        row = 6;

        Object.values(hsnIn).forEach((d) => {
        s18[`B${row}`] = { v: d.hsn };
        s18[`C${row}`] = { v: d.desc };
        s18[`D${row}`] = { v: d.uqc };
        s18[`E${row}`] = { v: d.qty };
        s18[`F${row}`] = { v: d.taxable };
        s18[`I${row}`] = { v: d.igst };
        s18[`J${row}`] = { v: d.cgst };
        s18[`K${row}`] = { v: d.sgst };
        row++;
        });

        // ================= SAVE XLSM =================
        const wbout = XLSX.write(workbook, {
        bookType: "xlsm",
        type: "array",
        bookVBA: true,
        cellStyles: true,
        bookSST: false,
        });

        saveAs(
        new Blob([wbout], {
            type: "application/vnd.ms-excel.sheet.macroEnabled.12",
        }),
        "GSTR9.xlsm"
        );

    } catch (err) {
        console.error(err);
        alert("Export Failed");
    }
    };

//   const exportGSTR9 = async () => {
//     try {
//       const { from, upto } = getRange();

//       // 🔹 FETCH
//       const [saleRes, purchaseRes] = await Promise.all([
//         axios.get("https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale"),
//         axios.get("https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/purchase"),
//       ]);

//       const sales = saleRes.data.filter((s) => {
//         const d = parseDate(s.formData?.date);
//         return d >= from && d <= upto;
//       });

//       const purchases = purchaseRes.data.filter((p) => {
//         const d = parseDate(p.formData?.date);
//         return d >= from && d <= upto;
//       });

//       // ================= TABLE 4 =================
//       const g9 = {
//         b2c: { taxable: 0, cgst: 0, sgst: 0, igst: 0 },
//         b2b: { taxable: 0, cgst: 0, sgst: 0, igst: 0 },
//         export: { taxable: 0, igst: 0 },
//       };

//       sales.forEach((s) => {
//         const f = s.formData || {};
//         const taxable = Number(f.sub_total || 0);
//         const cgst = Number(f.cgst || 0);
//         const sgst = Number(f.sgst || 0);
//         const igst = Number(f.igst || 0);

//         const customer = s.customerDetails?.[0] || {};
//         const isRegistered = customer.gstno;
//         const isExport = f.stype?.toLowerCase().includes("export");

//         if (isExport) {
//           g9.export.taxable += taxable;
//           g9.export.igst += igst;
//         } else if (isRegistered) {
//           g9.b2b.taxable += taxable;
//           g9.b2b.cgst += cgst;
//           g9.b2b.sgst += sgst;
//           g9.b2b.igst += igst;
//         } else {
//           g9.b2c.taxable += taxable;
//           g9.b2c.cgst += cgst;
//           g9.b2c.sgst += sgst;
//           g9.b2c.igst += igst;
//         }
//       });

//       // ================= HSN OUTWARD =================
//       const hsnOut = {};

//       sales.forEach((s) => {
//         (s.items || []).forEach((item) => {
//           const hsn = item.tariff || "NA";

//           if (!hsnOut[hsn]) {
//             hsnOut[hsn] = {
//               hsn,
//               desc: item.sdisc || "",
//               uqc: item.Units || "NOS",
//               qty: 0,
//               taxable: 0,
//               gst: 0,
//               igst: 0,
//               cgst: 0,
//               sgst: 0,
//             };
//           }

//           hsnOut[hsn].qty += Number(item.weight || 0);
//           hsnOut[hsn].taxable += Number(item.amount || 0);
//           hsnOut[hsn].igst += Number(item.itax || 0);
//           hsnOut[hsn].cgst += Number(item.ctax || 0);
//           hsnOut[hsn].sgst += Number(item.stax || 0);
//         });
//       });

//       // ================= HSN INWARD =================
//       const hsnIn = {};

//       purchases.forEach((p) => {
//         (p.items || []).forEach((item) => {
//           const hsn = item.tariff || "NA";

//           if (!hsnIn[hsn]) {
//             hsnIn[hsn] = {
//               hsn,
//               desc: item.sdisc || "",
//               uqc: item.Units || "NOS",
//               qty: 0,
//               taxable: 0,
//               gst: 0,
//               igst: 0,
//               cgst: 0,
//               sgst: 0,
//             };
//           }

//           hsnIn[hsn].qty += Number(item.weight || 0);
//           hsnIn[hsn].taxable += Number(item.amount || 0);
//           hsnIn[hsn].igst += Number(item.itax || 0);
//           hsnIn[hsn].cgst += Number(item.ctax || 0);
//           hsnIn[hsn].sgst += Number(item.stax || 0);
//         });
//       });

//       // ================= LOAD EXCEL =================
//       const res = await fetch("excel/gstr-9.xlsm");
//       const buffer = await res.arrayBuffer();

//       const workbook = new ExcelJS.Workbook();
//       await workbook.xlsx.load(buffer);

//       // ================= TABLE 4 =================
//       const t4 = workbook.getWorksheet("4 Outward");

//       t4.getCell("F7").value = g9.b2c.taxable;
//       t4.getCell("G7").value = g9.b2c.cgst;
//       t4.getCell("H7").value = g9.b2c.sgst;
//       t4.getCell("I7").value = g9.b2c.igst;

//       t4.getCell("F8").value = g9.b2b.taxable;
//       t4.getCell("G8").value = g9.b2b.cgst;
//       t4.getCell("H8").value = g9.b2b.sgst;
//       t4.getCell("I8").value = g9.b2b.igst;

//       // ================= HSN OUTWARD =================
//       const s17 = workbook.getWorksheet("17 HSN Outward");
//       let row = 6;

//       Object.values(hsnOut).forEach((d) => {
//         s17.getCell(`B${row}`).value = d.hsn;
//         s17.getCell(`C${row}`).value = d.desc;
//         s17.getCell(`D${row}`).value = d.uqc;
//         s17.getCell(`E${row}`).value = d.qty;
//         s17.getCell(`F${row}`).value = d.taxable;
//         s17.getCell(`H${row}`).value = d.gst;
//         s17.getCell(`I${row}`).value = d.igst;
//         s17.getCell(`J${row}`).value = d.cgst;
//         s17.getCell(`K${row}`).value = d.sgst;
//         row++;
//       });

//       // ================= HSN INWARD =================
//       const s18 = workbook.getWorksheet("18 HSN Inward");
//       row = 6;

//       Object.values(hsnIn).forEach((d) => {
//         s18.getCell(`B${row}`).value = d.hsn;
//         s18.getCell(`C${row}`).value = d.desc;
//         s18.getCell(`D${row}`).value = d.uqc;
//         s18.getCell(`E${row}`).value = d.qty;
//         s18.getCell(`F${row}`).value = d.taxable;
//         s18.getCell(`I${row}`).value = d.igst;
//         s18.getCell(`J${row}`).value = d.cgst;
//         s18.getCell(`K${row}`).value = d.sgst;
//         row++;
//       });

//       // ================= SAVE =================
//       const fileBuffer = await workbook.xlsx.writeBuffer();
//       saveAs(new Blob([fileBuffer]), "GSTR9.xlsx");

//     } catch (err) {
//       console.error(err);
//       alert("Export Failed");
//     }
//   };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>GSTR-9 Export</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <InputMask mask="99-99-9999" value={fromDate} onChange={(e) => setFromDate(e.target.value)}>
          {(props) => (
            <TextField {...props} label="FROM" inputRef={fromRef} fullWidth />
          )}
        </InputMask>

        <InputMask mask="99-99-9999" value={uptoDate} onChange={(e) => setUptoDate(e.target.value)}>
          {(props) => (
            <TextField {...props} label="UPTO" fullWidth style={{ marginTop: 10 }} />
          )}
        </InputMask>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={exportGSTR9}>EXPORT</Button>
        <Button onClick={onHide}>CLOSE</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Gstr9;