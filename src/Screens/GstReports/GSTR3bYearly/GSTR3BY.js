import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputMask from "react-input-mask";
import axios from "axios";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { TextField } from "@mui/material";
import financialYear from "../../Shared/financialYear";

const GSTR3BY = ({ show, onHide }) => {
  const fromRef = useRef(null);
  const uptoRef = useRef(null);
  const printRef = useRef(null);
  const [fromDate, setFromDate] = useState("");
  const [uptoDate, setUptoDate] = useState("");

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Auto-set financial year when component loads
  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(formatDate(fy.start)); // converted
    setUptoDate(formatDate(fy.end)); // converted

    // 🔥 Focus after render
    setTimeout(() => {
      fromRef.current?.focus();
    }, 100);
  }, []);

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return null;

    // ✅ dd-mm-yyyy (MOST IMPORTANT FIRST)
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
      const [dd, mm, yyyy] = dateStr.split("-");
      return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    }

    // ✅ ISO (2026-03-09T00:00:00.000Z)
    if (typeof dateStr === "string" && dateStr.includes("T")) {
      const d = new Date(dateStr);
      return isNaN(d) ? null : d;
    }

    // ✅ yyyy-mm-dd
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [yyyy, mm, dd] = dateStr.split("-");
      return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
    }

    return null;
  };

  const getParsedRange = () => {
    const from = parseDate(fromDate);
    const upto = parseDate(uptoDate);

    if (!from || !upto) {
      alert("Please enter valid From and Upto dates");
      return null;
    }

    // set time to full day
    from.setHours(0, 0, 0, 0);
    upto.setHours(23, 59, 59, 999);

    return { from, upto };
  };

  const exportSum3B = async () => {
    try {
      const range = getParsedRange();
      if (!range) return;

      const { from, upto } = range;

      const [saleRes, purchaseRes] = await Promise.all([
        axios.get(
          "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale",
        ),
        axios.get(
          "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/purchase",
        ),
      ]);

      // ✅ FILTER HERE
      const sales = saleRes.data.filter((s) => {
        const d = parseDate(s.formData?.date);
        return d && d >= from && d <= upto;
      });

      const purchases = purchaseRes.data.filter((p) => {
        const d = parseDate(p.formData?.date);
        return d && d >= from && d <= upto;
      });

      const monthMap = {
        3: "B",
        4: "C",
        5: "D",
        6: "E",
        7: "F",
        8: "G",
        9: "H",
        10: "I",
        11: "J",
        0: "K",
        1: "L",
        2: "M",
      };

      const init = () => ({
        sale_regWithin: 0,
        sale_regOut: 0,
        sale_unregWithin: 0,
        sale_unregOut: 0,
        sale_taxFreeWithin: 0,
        sale_taxFreeOut: 0,
        sale_export: 0,

        sale_regWithin_cgst: 0,
        sale_regWithin_sgst: 0,
        sale_unregWithin_cgst: 0,
        sale_unregWithin_sgst: 0,

        sale_regOut_igst: 0,
        sale_unregOut_igst: 0,
        sale_export_igst: 0,

        pur_regWithin: 0,
        pur_regOut: 0,
        pur_unregWithin: 0,
        pur_unregOut: 0,
        pur_taxFreeWithin: 0,
        pur_taxFreeOut: 0,

        pur_regWithin_cgst: 0,
        pur_regWithin_sgst: 0,
        pur_unregWithin_cgst: 0,
        pur_unregWithin_sgst: 0,

        pur_regOut_igst: 0,
        pur_unregOut_igst: 0,
        pur_import_igst: 0,
      });

      const monthData = {};
      Object.values(monthMap).forEach((col) => {
        monthData[col] = init();
      });

      // ================= SALES =================
      sales.forEach((s) => {
        const d = parseDate(s.formData?.date);
        if (!d || isNaN(d)) return;

        const col = monthMap[d.getMonth()];
        if (!col) return;

        const cgst = Number(s.formData?.cgst || 0);
        const sgst = Number(s.formData?.sgst || 0);
        const igst = Number(s.formData?.igst || 0);
        const tax = Number(s.formData?.tax || 0);
        const taxable = Number(s.formData?.sub_total || 0);

        const customer = s.customerDetails?.[0] || {};
        const isRegistered = customer.gstno && customer.gstno !== "";
        const isOut = igst > 0;
        const isTaxFree = tax === 0;
        const isExport = s.formData?.stype?.toLowerCase().includes("export");

        // ORIGINAL
        if (isExport) {
          monthData[col].sale_export += taxable;
        } else if (isTaxFree) {
          if (isOut) monthData[col].sale_taxFreeOut += taxable;
          else monthData[col].sale_taxFreeWithin += taxable;
        } else if (isRegistered) {
          if (isOut) monthData[col].sale_regOut += taxable;
          else monthData[col].sale_regWithin += taxable;
        } else {
          if (isOut) monthData[col].sale_unregOut += taxable;
          else monthData[col].sale_unregWithin += taxable;
        }

        // CGST/SGST
        if (!isOut) {
          if (isRegistered) {
            monthData[col].sale_regWithin_cgst += cgst;
            monthData[col].sale_regWithin_sgst += sgst;
          } else {
            monthData[col].sale_unregWithin_cgst += cgst;
            monthData[col].sale_unregWithin_sgst += sgst;
          }
        }

        // IGST
        if (isExport) {
          monthData[col].sale_export_igst += igst;
        } else if (isOut) {
          if (isRegistered) {
            monthData[col].sale_regOut_igst += igst;
          } else {
            monthData[col].sale_unregOut_igst += igst;
          }
        }
      });

      // ================= PURCHASE =================
      purchases.forEach((p) => {
        const d = parseDate(p.formData?.date);
        if (!d || isNaN(d)) return;

        const col = monthMap[d.getMonth()];
        if (!col) return;

        const cgst = Number(p.formData?.cgst || 0);
        const sgst = Number(p.formData?.sgst || 0);
        const igst = Number(p.formData?.igst || 0);
        const tax = Number(p.formData?.tax || 0);
        const taxable = Number(p.formData?.sub_total || 0);

        const supplier = p.supplierdetails?.[0] || {};
        const isRegistered = supplier.gstno && supplier.gstno !== "";
        const isOut = igst > 0;
        const isImport = p.formData?.stype?.toLowerCase().includes("import");

        // ORIGINAL
        if (isRegistered) {
          if (isOut) monthData[col].pur_regOut += taxable;
          else monthData[col].pur_regWithin += taxable;
        } else {
          if (isOut) monthData[col].pur_unregOut += taxable;
          else monthData[col].pur_unregWithin += taxable;
        }

        // CGST/SGST
        if (!isOut) {
          if (isRegistered) {
            monthData[col].pur_regWithin_cgst += cgst;
            monthData[col].pur_regWithin_sgst += sgst;
          } else {
            monthData[col].pur_unregWithin_cgst += cgst;
            monthData[col].pur_unregWithin_sgst += sgst;
          }
        }

        // IGST
        if (isImport) {
          monthData[col].pur_import_igst += igst;
        } else if (isOut) {
          if (isRegistered) {
            monthData[col].pur_regOut_igst += igst;
          } else {
            monthData[col].pur_unregOut_igst += igst;
          }
        }
      });

      // ================= EXCEL =================
      const res = await fetch("excel/sum3b.xlsx");
      const buffer = await res.arrayBuffer();

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const sheet = workbook.getWorksheet("Pur_Sale");

      Object.keys(monthData).forEach((col) => {
        const d = monthData[col];

        // ===== SALES =====
        sheet.getCell(`${col}7`).value = d.sale_regWithin;
        sheet.getCell(`${col}8`).value = d.sale_regOut;
        sheet.getCell(`${col}9`).value = d.sale_unregWithin;
        sheet.getCell(`${col}10`).value = d.sale_unregOut;
        sheet.getCell(`${col}11`).value = d.sale_taxFreeWithin;
        sheet.getCell(`${col}12`).value = d.sale_taxFreeOut;
        sheet.getCell(`${col}13`).value = d.sale_export;

        // ===== PURCHASE =====
        sheet.getCell(`${col}17`).value = d.pur_regWithin;
        sheet.getCell(`${col}18`).value = d.pur_regOut;
        sheet.getCell(`${col}19`).value = d.pur_unregWithin;
        sheet.getCell(`${col}20`).value = d.pur_unregOut;
        sheet.getCell(`${col}21`).value = d.pur_taxFreeWithin;
        sheet.getCell(`${col}22`).value = d.pur_taxFreeOut;

        sheet.getCell(`${col}29`).value = d.sale_regWithin_cgst;
        sheet.getCell(`${col}30`).value = d.sale_unregWithin_cgst;

        sheet.getCell(`${col}35`).value = d.pur_regWithin_cgst;
        sheet.getCell(`${col}36`).value = d.pur_unregWithin_cgst;

        sheet.getCell(`${col}43`).value = d.sale_regWithin_sgst;
        sheet.getCell(`${col}44`).value = d.sale_unregWithin_sgst;

        sheet.getCell(`${col}49`).value = d.pur_regWithin_sgst;
        sheet.getCell(`${col}50`).value = d.pur_unregWithin_sgst;

        sheet.getCell(`${col}58`).value = d.sale_regOut_igst;
        sheet.getCell(`${col}59`).value = d.sale_unregOut_igst;
        sheet.getCell(`${col}60`).value = d.sale_export_igst;

        sheet.getCell(`${col}64`).value = d.pur_regOut_igst;
        sheet.getCell(`${col}65`).value = d.pur_unregOut_igst;
        sheet.getCell(`${col}66`).value = d.pur_import_igst;
      });

      const fileBuffer = await workbook.xlsx.writeBuffer();
      saveAs(new Blob([fileBuffer]), "sum3b.xlsx");
    } catch (err) {
      console.error(err);
      alert("Export failed");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(135deg, #4f46e5, #6366f1)",
          color: "#fff",
        }}
      >
        <Modal.Title className="fw-bold"> 📊 GSTR-3B YEARLY</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* Period From */}
          <div
            className="mb-2"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <InputMask
              mask="99-99-9999"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            >
              {(props) => (
                <TextField
                  className="custom-bordered-input"
                  {...props}
                  inputRef={fromRef}
                  label="FROM"
                  size="small"
                  variant="filled"
                  fullWidth
                  onKeyDown={(e) => handleKeyDown(e, uptoRef)}
                />
              )}
            </InputMask>

            {/* To date */}
            <InputMask
              mask="99-99-9999"
              value={uptoDate}
              onChange={(e) => setUptoDate(e.target.value)}
            >
              {(props) => (
                <TextField
                  className="custom-bordered-input"
                  {...props}
                  inputRef={uptoRef}
                  label="UPTO"
                  size="small"
                  variant="filled"
                  fullWidth
                  style={{ marginTop: 10 }}
                  onKeyDown={(e) => handleKeyDown(e, printRef)}
                />
              )}
            </InputMask>
          </div>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button ref={printRef} variant="primary" onClick={exportSum3B}>
          PRINT
        </Button>
        <Button variant="secondary" onClick={onHide}>
          EXIT
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GSTR3BY;
