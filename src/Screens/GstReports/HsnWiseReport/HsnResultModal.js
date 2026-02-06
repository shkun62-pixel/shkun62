import { useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import useCompanySetup from "../../Shared/useCompanySetup";
import * as XLSX from "sheetjs-style";
import { saveAs } from "file-saver";

const HsnResultModal = ({ show, onHide, data, type, fromDate, toDate }) => {
  const printRef = useRef(null);
  const { companyName, companyAdd, companyCity } = useCompanySetup();

  /* ================= PRINT ================= */
  const handlePrint = () => {
    const WinPrint = window.open("", "", "width=1200,height=800");

    WinPrint.document.write(`
      <html>
      <head>
      <style>
        @page { size: A4 landscape; margin: 10mm; }
        body { font-family: serif; font-size: 12px; }
        .print-header { text-align: center; margin-bottom: 14px; }
        .company-name { font-size: 16px; font-weight: bold; text-transform: uppercase; }
        .company-address, .company-city { font-size: 12px; }
        .report-title { margin-top: 6px; font-size: 13px; font-weight: bold; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid black; padding: 4px; font-size: 11px; }
        th { background: #f0f0f0; text-align: center; }
        .text-end { text-align: right; }
      </style>
      </head>
      <body>
        <div class="print-header">
          <div class="company-name">${companyName}</div>
          <div class="company-address">${companyAdd}</div>
          <div class="company-city">${companyCity}</div>
          <div class="report-title">HSN WISE ${type.toUpperCase()} DETAILS</div>
        </div>
    `);

    WinPrint.document.write(printRef.current.innerHTML);
    WinPrint.document.write("</body></html>");
    WinPrint.document.close();
    WinPrint.print();
    WinPrint.close();
  };

  /* ================= EXCEL ================= */

  const getAutoColumnWidths = (rows) => {
    const widths = [];
    rows.forEach((row) => {
      row.forEach((cell, i) => {
        const len = cell ? cell.toString().length : 0;
        widths[i] = Math.max(widths[i] || 10, len + 2);
      });
    });
    return widths.map((w) => ({ wch: Math.min(w, 40) }));
  };

  const fmt3 = "0.000"; // Pcs, Qty
  const fmt2 = "0.00"; // Amounts & Taxes

  const handleExportExcel = () => {
    const table = printRef.current.querySelector("table");
    if (!table) return;

    // 🔥 Read table
    const sheetFromTable = XLSX.utils.table_to_sheet(table, { raw: true });
    let tableData = XLSX.utils.sheet_to_json(sheetFromTable, { header: 1 });

    // 🔥 FORCE NUMERIC CELLS (THIS FIXES SUBTOTAL = 0 ISSUE)
    const numericCols = [5, 6, 7, 8, 9, 10];
    for (let r = 1; r < tableData.length; r++) {
      numericCols.forEach((c) => {
        if (tableData[r][c] !== "" && tableData[r][c] != null) {
          tableData[r][c] = Number(tableData[r][c]);
        }
      });
    }

    const ws = XLSX.utils.aoa_to_sheet([]);

    /* ---------- COMPANY HEADERS ---------- */
    const headerRows = [
      [companyName],
      [companyAdd],
      [companyCity],
      [`HSN WISE DETAIL OF ${type.toUpperCase()} FROM ${fromDate} TO ${toDate}`],
      [],
    ];

    XLSX.utils.sheet_add_aoa(ws, headerRows, { origin: "A1" });

    /* ---------- TABLE ---------- */
    const tableStartRow = headerRows.length;
    XLSX.utils.sheet_add_aoa(ws, tableData, {
      origin: { r: tableStartRow, c: 0 },
    });

    const totalCols = tableData[0].length;
    const firstDataRow = tableStartRow + 1;
    const lastDataRow = tableStartRow + tableData.length - 1;

    /* ---------- TOTAL (SUBTOTAL) ---------- */
    const totalRowIndex = lastDataRow + 1;
    const totalRow = Array(totalCols).fill("");
    totalRow[0] = "TOTAL";

    numericCols.forEach((c) => {
      const colLetter = XLSX.utils.encode_col(c);
      totalRow[c] = {
        t: "n",
        f: `SUBTOTAL(9,${colLetter}${firstDataRow + 1}:${colLetter}${lastDataRow + 1})`,
      };
    });

    XLSX.utils.sheet_add_aoa(ws, [totalRow], {
      origin: { r: totalRowIndex, c: 0 },
    });

    /* ---------- STYLES ---------- */
    const range = XLSX.utils.decode_range(ws["!ref"]);

    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[cellRef];
        if (!cell) continue;

        // Company header
        if (R <= 3) {
          cell.s = {
            font: { bold: true },
            alignment: { horizontal: "center" },
          };
        }

        // Table header
        if (R === tableStartRow) {
          cell.s = {
            font: { bold: true },
            alignment: { horizontal: "center" },
            fill: { fgColor: { rgb: "E0E0E0" } },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        }

        // Body + TOTAL row
        if (R > tableStartRow) {
          cell.s = {
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };

          // 🔢 Decimal formatting
          if ([5, 6].includes(C)) {
            // Pcs, Qty → 3 decimals
            cell.z = fmt3;
          }

          if ([7, 8, 9, 10].includes(C)) {
            // Amount & Taxes → 2 decimals
            cell.z = fmt2;
          }
        }
      }
    }

    /* ---------- MERGE COMPANY HEADERS ---------- */
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: totalCols - 1 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: totalCols - 1 } },
    ];

    /* ---------- AUTO WIDTH ---------- */
    ws["!cols"] = getAutoColumnWidths([...headerRows, ...tableData]);

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "HSN Report");

    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    saveAs(
      new Blob([excelBuffer], { type: "application/octet-stream" }),
      `HSN_WISE_${type.toUpperCase()}_DETAILS.xlsx`,
    );
  };

  /* ================= UI ================= */
  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static" className="custom-modal"
      style={{ marginTop: 10 }} >
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">HSN WISE DETAIL OF {type.toUpperCase()}</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ overflowY: "auto" }}>
        <div ref={printRef}>
          <a>Period From:{fromDate} - Upto {toDate}</a>
          <Table bordered hover size="sm" className="custom-table">
            <thead style={{ background: "#dedcd7" }}>
              <tr>
                <th>Account Name</th>
                <th>City</th>
                <th>GST No</th>
                <th>HSN</th>
                <th>Description</th>
                <th className="text-end">Pcs</th>
                <th className="text-end">Qty</th>
                <th className="text-end">Taxable Value</th>
                <th className="text-end">CGST</th>
                <th className="text-end">SGST</th>
                <th className="text-end">IGST</th>
              </tr>
            </thead>

            <tbody>
              {data.map((row, i) =>
                row.items.map((item, idx) => {
                  const party =
                    type === "Sale"
                      ? row.customerDetails?.[0]
                      : row.supplierdetails?.[0];

                  return (
                    <tr key={`${i}-${idx}`}>
                      <td>{party?.vacode}</td>
                      <td>{party?.city}</td>
                      <td>{party?.gstno}</td>
                      <td>{item.tariff}</td>
                      <td>{item.sdisc}</td>
                      <td className="text-end">{item.pkgs}</td>
                      <td className="text-end">{item.weight}</td>
                      <td className="text-end">{item.amount}</td>
                      <td className="text-end">{item.ctax}</td>
                      <td className="text-end">{item.stax}</td>
                      <td className="text-end">{item.itax}</td>
                    </tr>
                  );
                }),
              )}
            </tbody>
          </Table>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="primary" onClick={handlePrint}>
          PRINT
        </Button>
        <Button variant="success" onClick={handleExportExcel}>
          EXPORT
        </Button>
        <Button variant="secondary" onClick={onHide}>
          CLOSE
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default HsnResultModal;
