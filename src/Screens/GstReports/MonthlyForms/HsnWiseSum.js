import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";
import Table from "react-bootstrap/Table";
import useCompanySetup from "../../Shared/useCompanySetup";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const HsnWiseSum = ({ show, handleClose, fromDate, upto }) => {
  const { companyName, companyAdd, companyCity, companyGST } =
    useCompanySetup();

  const [salesData, setSalesData] = useState([]);
  const [purchaseData, setPurchaseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("sale");

  // DATE PARSER
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    if (dateStr.includes("T")) return new Date(dateStr);

    const parts = dateStr.includes("/")
      ? dateStr.split("/")
      : dateStr.split("-");

    return new Date(parts[2], parts[1] - 1, parts[0]);
  };

  // FETCH + FILTER
  useEffect(() => {
    if (!show) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [salesRes, purchaseRes] = await Promise.all([
          axios.get(
            "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/sale",
          ),
          axios.get(
            "https://www.shkunweb.com/shkunlive/03AAYFG4472A1ZG_01042025_31032026/tenant/api/purchase",
          ),
        ]);

        const from = parseDate(fromDate);
        const to = parseDate(upto);

        setSalesData(
          salesRes.data.filter((s) => {
            const d = parseDate(s.formData?.date);
            return d && d >= from && d <= to;
          }),
        );

        setPurchaseData(
          purchaseRes.data.filter((p) => {
            const d = parseDate(p.formData?.date);
            return d && d >= from && d <= to;
          }),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [show, fromDate, upto]);

  // PROCESS
  const processHSNData = (sales = [], purchases = []) => {
    const result = { sale: {}, purchase: {} };

    const add = (bucket, item) => {
      const key = `${item.tariff}_${item.gst}`;

      if (!bucket[key]) {
        bucket[key] = {
          hsn: item.tariff,
          gst: item.gst,
          pcs: 0,
          qty: 0,
          value: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          sdisc: item.sdisc,
        };
      }

      bucket[key].pcs += Number(item.pkgs || 0);
      bucket[key].qty += Number(item.weight || 0);
      bucket[key].value += Number(item.amount || 0);
      bucket[key].cgst += Number(item.ctax || 0);
      bucket[key].sgst += Number(item.stax || 0);
      bucket[key].igst += Number(item.itax || 0);
    };

    sales.forEach((s) => s.items.forEach((i) => add(result.sale, i)));
    purchases.forEach((p) => p.items.forEach((i) => add(result.purchase, i)));

    return result;
  };

  const getTotals = (data) =>
    Object.values(data).reduce(
      (a, i) => ({
        pcs: a.pcs + i.pcs,
        qty: a.qty + i.qty,
        value: a.value + i.value,
        cgst: a.cgst + i.cgst,
        sgst: a.sgst + i.sgst,
        igst: a.igst + i.igst,
      }),
      { pcs: 0, qty: 0, value: 0, cgst: 0, sgst: 0, igst: 0 },
    );

  const { sale, purchase } = useMemo(
    () => processHSNData(salesData, purchaseData),
    [salesData, purchaseData],
  );

  const saleRows = Object.values(sale);
  const purchaseRows = Object.values(purchase);

  const saleTotal = getTotals(sale);
  const purchaseTotal = getTotals(purchase);

  const renderTable = (rows, total) => (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid #ddd",
      }}
    >
      {/* SCROLLABLE BODY */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <Table bordered hover size="sm" style={{ marginBottom: 0 }}>
          <thead
            style={{
              position: "sticky",
              top: 0,
              background: "#f5f5f5",
              zIndex: 2,
            }}
          >
            <tr>
              <th className="text-center">HSN</th>
              <th className="text-center">GST %</th>
              <th className="text-center">PCS</th>
              <th className="text-center">QTY</th>
              <th className="text-center">VALUE</th>
              <th className="text-center">C.GST</th>
              <th className="text-center">S.GST</th>
              <th className="text-center">I.GST</th>
              <th className="text-center">CESS</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.hsn}</td>
                <td className="text-end">{r.gst.toFixed(2)}</td>
                <td className="text-end">
                  {Number(r.pcs) === 0 ? "" : r.pcs.toFixed(3)}
                </td>
                <td className="text-end">
                  {Number(r.qty) === 0 ? "" : r.qty.toFixed(3)}
                </td>
                <td className="text-end">
                  {Number(r.value) === 0 ? "" : r.value.toFixed(2)}
                </td>
                <td className="text-end">
                  {Number(r.cgst) === 0 ? "" : r.cgst.toFixed(2)}
                </td>
                <td className="text-end">
                  {Number(r.sgst) === 0 ? "" : r.sgst.toFixed(2)}
                </td>
                <td className="text-end">
                  {Number(r.igst) === 0 ? "" : r.igst.toFixed(2)}
                </td>
                <td className="text-end"></td>
              </tr>
            ))}
          </tbody>

          {/* ✅ FOOTER (SAME TABLE = PERFECT ALIGNMENT) */}
          <tfoot
            style={{
              position: "sticky",
              bottom: 0,
              background: "#f0f0f0",
              fontWeight: "bold",
              color: "red",
            }}
          >
            <tr>
              <td>Total</td>
              <td></td>
              <td className="text-end">{total.pcs.toFixed(3)}</td>
              <td className="text-end">{total.qty.toFixed(3)}</td>
              <td className="text-end">{total.value.toFixed(2)}</td>
              <td className="text-end">{total.cgst.toFixed(2)}</td>
              <td className="text-end">{total.sgst.toFixed(2)}</td>
              <td className="text-end">{total.igst.toFixed(2)}</td>
              <td className="text-end"></td>
            </tr>
          </tfoot>
        </Table>
      </div>
    </div>
  );

  // Printing
  const printHSNDetail = () => {
    const printWindow = window.open("", "", "width=1200,height=800");

    const generateRows = (rows) => {
      return rows
        .map(
          (r) => `
          <tr>
            <td>${r.hsn}</td>
            <td>${r.gst.toFixed(2)}</td>
            <td>${r.pcs.toFixed(3)}</td>
            <td>${r.qty.toFixed(3)}</td>
            <td>${r.value.toFixed(2)}</td>
            <td>${r.cgst.toFixed(2)}</td>
            <td>${r.sgst.toFixed(2)}</td>
            <td>${r.igst.toFixed(2)}</td>
            <td>0</td>
          </tr>
        `,
        )
        .join("");
    };

    const html = `
      <html>
        <head>
          <title>HSN Detail</title>
          <style>
            body {
              font-family: Arial;
            }
            h7, h4 {
              text-align: center;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 10px;
            }
            th, td {
              border: 1px solid #000;
              padding: 5px;
              font-size: 12px;
            }
            th {
              background: #e0e0e0;
            }
            .section {
              font-weight: bold;
              margin-top: 10px;
            }
            .total {
              font-weight: bold;
              color: red;
            }
           .companyD {
              display: flex;
              flex-direction: column;
              align-items: center;
              font-family: "Courier New", monospace;
            }
            .subText {
              text-align: center;
              font-size: 14px;
              color: black;
            }
          </style>
        </head>

        <body>
        <div class="companyD">
          <div style="font-weight:bold; font-size:18px;">${companyName}</div>
          <div class="subText">${companyAdd}</div>
          <div class="subText">${companyCity}</div>
          <div class="subText">HSN DETAIL FROM ${fromDate} TO ${upto}</div>
        </div>
          <div class="section">SALE</div>
          <table>
            <thead>
              <tr>
                <th>HSN</th>
                <th>GST%</th>
                <th>PCS</th>
                <th>QTY</th>
                <th>VALUE</th>
                <th>C.GST</th>
                <th>S.GST</th>
                <th>I.GST</th>
                <th>CESS</th>
              </tr>
            </thead>
            <tbody>
              ${generateRows(saleRows)}
              <tr class="total">
                <td>Total</td>
                <td></td>
                <td>${saleTotal.pcs.toFixed(3)}</td>
                <td>${saleTotal.qty.toFixed(3)}</td>
                <td>${saleTotal.value.toFixed(2)}</td>
                <td>${saleTotal.cgst.toFixed(2)}</td>
                <td>${saleTotal.sgst.toFixed(2)}</td>
                <td>${saleTotal.igst.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <div class="section">PURCHASES</div>
          <table>
            <thead>
              <tr>
                <th>HSN</th>
                <th>GST%</th>
                <th>PCS</th>
                <th>QTY</th>
                <th>VALUE</th>
                <th>C.GST</th>
                <th>S.GST</th>
                <th>I.GST</th>
                <th>CESS</th>
              </tr>
            </thead>
            <tbody>
              ${generateRows(purchaseRows)}
              <tr class="total">
                <td>Total</td>
                <td></td>
                <td>${purchaseTotal.pcs.toFixed(3)}</td>
                <td>${purchaseTotal.qty.toFixed(3)}</td>
                <td>${purchaseTotal.value.toFixed(2)}</td>
                <td>${purchaseTotal.cgst.toFixed(2)}</td>
                <td>${purchaseTotal.sgst.toFixed(2)}</td>
                <td>${purchaseTotal.igst.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

         <script>
          const closeWindow = () => {
            setTimeout(() => {
              window.close();
            }, 300);
          };

          window.onload = function () {
            window.print();
          };

          // ✅ Works after printing (not always on ESC)
          window.onafterprint = closeWindow;

          // ✅ Detect print dialog close (ESC or cancel)
          const mediaQueryList = window.matchMedia('print');

          mediaQueryList.addEventListener('change', function (mql) {
            if (!mql.matches) {
              closeWindow();
            }
          });

          // ✅ Fallback (when user comes back from print dialog)
          window.onfocus = function () {
            closeWindow();
          };
        </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Export
  const exportHSNDetail = async () => {
    const templateResponse = await fetch("excel/hsndet.xlsx");
    if (!templateResponse.ok) {
      alert("Template file not found");
      return;
    }
    const buffer = await templateResponse.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    const sheet = workbook.getWorksheet("Sheet2");
    if (!sheet) {
      alert("Sheet 'hsndet / Sheet2' not found in template");
      return;
    }

    // ================= HEADER =================
    sheet.getCell("A1").value = companyName;
    sheet.getCell("A2").value = companyAdd;
    sheet.getCell("A3").value = `GSTIN : ${companyGST}`;
    sheet.getCell("A4").value = `HSN SUMMARY FROM ${fromDate} TO ${upto}`;

    let rowIndex = 7;

    // ================= SALE =================
    sheet.getCell(`A${rowIndex}`).value = "SALE";
    rowIndex++;

    saleRows.forEach((item) => {
      const row = sheet.getRow(rowIndex++);

      const taxable = item.value;
      const rate = item.gst;

      let calcCGST = 0,
        calcSGST = 0,
        calcIGST = 0;

      if (item.igst > 0) {
        calcIGST = (taxable * rate) / 100;
      } else {
        calcCGST = (taxable * rate) / 200;
        calcSGST = (taxable * rate) / 200;
      }

      // LEFT SIDE
      row.getCell(1).value = item.hsn;
      row.getCell(2).value = item.sdisc || "";
      row.getCell(3).value = rate;
      row.getCell(4).value = item.pcs;
      row.getCell(5).value = item.qty;
      row.getCell(6).value = item.unit || "";
      row.getCell(7).value = taxable;
      row.getCell(8).value = item.cgst;
      row.getCell(9).value = item.sgst;
      row.getCell(10).value = item.igst;
      row.getCell(11).value = 0;
      row.getCell(12).value = taxable + item.cgst + item.sgst + item.igst;

      // RIGHT SIDE (STANDARD)
      row.getCell(13).value = calcCGST;
      row.getCell(14).value = calcSGST;
      row.getCell(15).value = calcIGST;
      row.getCell(16).value = 0;
      row.getCell(17).value = taxable + calcCGST + calcSGST + calcIGST;

      row.commit();
    });

    // ===== SALE TOTAL =====
    const saleTotalRow = sheet.getRow(rowIndex++);

    saleTotalRow.getCell(7).value = saleTotal.value;
    saleTotalRow.getCell(8).value = saleTotal.cgst;
    saleTotalRow.getCell(9).value = saleTotal.sgst;
    saleTotalRow.getCell(10).value = saleTotal.igst;
    saleTotalRow.getCell(12).value =
      saleTotal.value + saleTotal.cgst + saleTotal.sgst + saleTotal.igst;

    saleTotalRow.getCell(13).value = saleTotal.cgst;
    saleTotalRow.getCell(14).value = saleTotal.sgst;
    saleTotalRow.getCell(15).value = saleTotal.igst;
    saleTotalRow.getCell(17).value =
      saleTotal.value + saleTotal.cgst + saleTotal.sgst + saleTotal.igst;

    // ================= PURCHASE =================
    rowIndex++;

    sheet.getCell(`A${rowIndex}`).value = "PURCHASES";
    rowIndex++;

    purchaseRows.forEach((item) => {
      const row = sheet.getRow(rowIndex++);

      const taxable = item.value;
      const rate = item.gst;

      let calcCGST = 0,
        calcSGST = 0,
        calcIGST = 0;

      if (item.igst > 0) {
        calcIGST = (taxable * rate) / 100;
      } else {
        calcCGST = (taxable * rate) / 200;
        calcSGST = (taxable * rate) / 200;
      }

      // LEFT
      row.getCell(1).value = item.hsn;
      row.getCell(2).value = item.sdisc || "";
      row.getCell(3).value = rate;
      row.getCell(4).value = item.pcs;
      row.getCell(5).value = item.qty;
      row.getCell(6).value = item.unit || "";
      row.getCell(7).value = taxable;
      row.getCell(8).value = item.cgst;
      row.getCell(9).value = item.sgst;
      row.getCell(10).value = item.igst;
      row.getCell(11).value = 0;
      row.getCell(12).value = taxable + item.cgst + item.sgst + item.igst;

      // RIGHT
      row.getCell(13).value = calcCGST;
      row.getCell(14).value = calcSGST;
      row.getCell(15).value = calcIGST;
      row.getCell(16).value = 0;
      row.getCell(17).value = taxable + calcCGST + calcSGST + calcIGST;

      row.commit();
    });

    // ===== PURCHASE TOTAL =====
    const purchaseTotalRow = sheet.getRow(rowIndex++);

    purchaseTotalRow.getCell(7).value = purchaseTotal.value;
    purchaseTotalRow.getCell(8).value = purchaseTotal.cgst;
    purchaseTotalRow.getCell(9).value = purchaseTotal.sgst;
    purchaseTotalRow.getCell(10).value = purchaseTotal.igst;
    purchaseTotalRow.getCell(12).value =
      purchaseTotal.value +
      purchaseTotal.cgst +
      purchaseTotal.sgst +
      purchaseTotal.igst;

    purchaseTotalRow.getCell(13).value = purchaseTotal.cgst;
    purchaseTotalRow.getCell(14).value = purchaseTotal.sgst;
    purchaseTotalRow.getCell(15).value = purchaseTotal.igst;
    purchaseTotalRow.getCell(17).value =
      purchaseTotal.value +
      purchaseTotal.cgst +
      purchaseTotal.sgst +
      purchaseTotal.igst;

    // ================= SAVE =================
    const fileBuffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([fileBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      "hsndet.xlsx",
    );
  };

  return (
    <Modal open={show} onClose={handleClose}>
      <Box
        sx={{
          width: "95%",
          height: "90vh",
          bgcolor: "#fff",
          m: "auto",
          mt: 2,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Box sx={{ textAlign: "center", p: 1.5 }}>
          <Typography fontWeight="bold">{companyName}</Typography>
          <Typography variant="body2">{companyAdd}</Typography>
          <Typography variant="body2">{companyCity}</Typography>

          <Typography mt={1} fontWeight="bold" variant="body2">
            HSN Detail From {fromDate} To {upto}
          </Typography>

          <Divider sx={{ my: 1 }} />

          {/* 🔥 TOGGLE */}
          <Box
            sx={{
              display: "flex",
              background: "linear-gradient(90deg, #7b2ff7, #f107a3)",
              borderRadius: "40px",
              padding: "4px",
              width: "260px",
              margin: "auto",
            }}
          >
            {[
              { label: "SALE", value: "sale" },
              { label: "PURCHASE", value: "purchase" },
            ].map((item) => (
              <Box
                key={item.value}
                onClick={() => setView(item.value)}
                sx={{
                  flex: 1,
                  textAlign: "center",
                  padding: "8px 0",
                  borderRadius: "40px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "14px",
                  transition: "all 0.3s ease",

                  color: view === item.value ? "#7b2ff7" : "#fff",
                  backgroundColor: view === item.value ? "#fff" : "transparent",

                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                {item.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* BODY */}
        <Box sx={{ flex: 1, overflow: "hidden" }}>
          <Box
            sx={{
              display: "flex",
              width: "200%",
              height: "100%",
              transform: `translateX(${view === "sale" ? "0%" : "-50%"})`,
              transition: "transform 0.4s ease",
            }}
          >
            <Box sx={{ width: "50%", p: 2, overflowY: "auto" }}>
              {loading ? (
                <CircularProgress />
              ) : (
                renderTable(saleRows, saleTotal)
              )}
            </Box>

            <Box sx={{ width: "50%", p: 2, overflowY: "auto" }}>
              {loading ? (
                <CircularProgress />
              ) : (
                renderTable(purchaseRows, purchaseTotal)
              )}
            </Box>
          </Box>
        </Box>

        {/* FOOTER */}
        <Box sx={{ p: 2, borderTop: "1px solid #ddd" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            sx={{ mr: 2, float: "right" }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={printHSNDetail}
            sx={{ mr: 2, float: "right"  }}
          >
            Print
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={exportHSNDetail}
            sx={{ mr: 2, float: "right"  }}
          >
            Export
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default HsnWiseSum;
