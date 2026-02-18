import React, { useEffect, useState, useRef } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import axios from "axios";
import useCompanySetup from "../../Shared/useCompanySetup";
import * as XLSX from 'sheetjs-style';

const PrintModal = ({ show, onHide, filters, selectedAccounts }) => {

  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  const { companyName, companyAdd, companyCity } = useCompanySetup();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    setLoading(true);

    axios
      .get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount`,
      )
      .then((res) => {
        if (res.data.ok) {
          let allData = res.data.data.map((a) => a.formData);

          // 🔹 PRIORITY 1: If user selected accounts → show ONLY those
          if (selectedAccounts && selectedAccounts.length > 0) {
            const selectedNames = selectedAccounts.map((a) =>
              a.ahead?.toLowerCase().trim(),
            );

            allData = allData.filter((f) =>
              selectedNames.includes(f.ahead?.toLowerCase().trim()),
            );
          }

          // 🔹 PRIORITY 2: Otherwise apply filters
          else if (filters) {
            allData = allData.filter((f) => {
              return (
                (!filters.cityName ||
                  f.city
                    ?.toLowerCase()
                    .includes(filters.cityName.toLowerCase())) &&
                (!filters.address1 ||
                  f.add1
                    ?.toLowerCase()
                    .includes(filters.address1.toLowerCase())) &&
                // ✅ State (Autocomplete → exact match)
                (!filters.stateName ||
                  f.state?.toLowerCase().trim() ===
                    filters.stateName.toLowerCase().trim()) &&
                (!filters.agent ||
                  f.agent
                    ?.toLowerCase()
                    .includes(filters.agent.toLowerCase())) &&
                (!filters.msmeStatus ||
                  f.msmed?.toLowerCase() ===
                    filters.msmeStatus.toLowerCase()) &&
                (!filters.area ||
                  f.area?.toLowerCase().includes(filters.area.toLowerCase())) &&
                // ✅ Group (Autocomplete → exact match)
                (!filters.group ||
                  f.Bsgroup?.toLowerCase().trim() ===
                    filters.group.toLowerCase().trim())
              );
            });
          }
          // 🔹 ORDER BY (Sorting)
          if (filters?.orderBy) {
            const order = filters.orderBy;
            allData.sort((a, b) => {
              switch (order) {
                case "Account Name":
                  return (a.ahead || "").localeCompare(b.ahead || "");
                case "Account Code":
                  return (a.acode || "")
                    .toString()
                    .localeCompare((b.acode || "").toString());
                case "GST No":
                  return (a.gstNo || "").localeCompare(b.gstNo || "");
                default:
                  return 0;
              }
            });
          }

          setData(allData);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [show, filters, selectedAccounts]);

  const handlePrint = () => {
    if (!contentRef.current) return;

    const printWindow = window.open("", "_blank", "width=900,height=650");

    printWindow.document.write(`
    <html>
      <head>
        <title>Ledger Summary</title>
        <style>
          body {
            font-family: monospace;
            padding: 20px;
          }
          .ledger-header {
            text-align: center !important;
            margin-bottom: 15px;
          }

          .ledger-header h5 {
            margin: 0;
            font-size: 20px;
            font-weight: bold;
          }

          .ledger-header div {
            font-size: 14px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid #000;
          }
          th, td {
            padding: 6px;
            font-size: 12px;
          }
          h5 {
            margin: 0;
          }
        </style>
      </head>
      <body>
        ${contentRef.current.innerHTML}

        <script>
          window.onafterprint = function () {
            window.close();
          };

          window.onload = function () {
            window.print();
          };

          // SAFETY FALLBACK (Esc / Cancel case)
          setTimeout(function () {
            window.close();
          }, 500);
        </script>
      </body>
    </html>
  `);

    printWindow.document.close();
  };

  const handleExportExcel = () => {
    if (!data || !data.length) {
      alert("No data to export");
      return;
    }

    // ===============================
    // 1️⃣ Table Data
    // ===============================
    const excelData = data.map((acc) => ({
      "A/C CODE": acc.acode || "",
      "ACCOUNT NAME": acc.ahead || "",
      "ADDRESS": acc.add1 || "",
      "GST NO": acc.gstNo || "",
      "PHONE": acc.phone || "",
      "CITY": acc.city || "",
      "STATE": acc.state || "",
      "PINCODE": acc.pincode || "",
      "DISTT": acc.distt || "",
      "AGENT": acc.agent || "",
      "CONTACT PERSON": acc.cperson || "",
      "PAN": acc.pan || "",
      "AREA": acc.area || "",
      "GROUP": acc.Bsgroup || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet([], { skipHeader: true });
    const workbook = XLSX.utils.book_new();

    // ===============================
    // 2️⃣ Company Header
    // ===============================
    XLSX.utils.sheet_add_aoa(
      worksheet,
      [[companyName], [companyAdd], [companyCity], []],
      { origin: "A1" }
    );

    const totalCols = Object.keys(excelData[0]).length;
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: totalCols - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: totalCols - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: totalCols - 1 } },
    ];

    ["A1", "A2", "A3"].forEach((cell) => {
      worksheet[cell].s = {
        font: { bold: true, sz: 14 },
        alignment: { horizontal: "center" },
      };
    });

    // ===============================
    // 3️⃣ Add Table (Headers + Data)
    // ===============================
    XLSX.utils.sheet_add_json(worksheet, excelData, {
      origin: "A5",
    });

    // ===============================
    // 4️⃣ Style Table Header Row
    // ===============================
    const headerRowIndex = 4; // row 5 (0-based)
    const headers = Object.keys(excelData[0]);

    headers.forEach((_, colIndex) => {
      const cellAddress = XLSX.utils.encode_cell({
        r: headerRowIndex,
        c: colIndex,
      });

      worksheet[cellAddress].s = {
        fill: { fgColor: { rgb: "D9D9D9" } },
        font: { bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        },
      };
    });

    // ===============================
    // 5️⃣ Align A/C CODE Column LEFT
    // ===============================
    const startRow = headerRowIndex + 1;
    const endRow = startRow + excelData.length;

    for (let r = startRow; r < endRow; r++) {
      const cellAddress = XLSX.utils.encode_cell({
        r,
        c: 0, // Column A → A/C CODE
      });

      if (worksheet[cellAddress]) {
        worksheet[cellAddress].s = {
          ...worksheet[cellAddress].s,
          alignment: {
            horizontal: "left",
            vertical: "center",
          },
        };
      }
    }

    // ===============================
    // 6️⃣ Auto Column Width
    // ===============================
    worksheet["!cols"] = headers.map((key) => ({
      wch:
        Math.max(
          key.length,
          ...excelData.map((row) =>
            row[key] ? row[key].toString().length : 0
          )
        ) + 2,
    }));

    XLSX.utils.book_append_sheet(workbook, worksheet, "Master Accounts");

    // ===============================
    // 7️⃣ Export
    // ===============================
    XLSX.writeFile(
      workbook,
      `Master_Account_List_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
      className="custom-modal"
      keyboard={true}
      style={{ marginTop: 10 }}
    >
      {/* HEADER */}
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Ledger Summary</Modal.Title>
      </Modal.Header>

      {/* BODY */}
      <Modal.Body style={{ overflowY: "auto" }}>
        <div ref={contentRef}>
          {/* Company Header */}
          <div
            className="ledger-header text-center mb-3"
            style={{ fontFamily: "Times New Roman", fontSize: 20,fontWeight:'bolder' }}
          >
            <h5 className="fw-bold">{companyName}</h5>
            <div>{companyAdd}</div>
            <div>{companyCity}</div>
          </div>

          {/* Date Range */}
          <div
            style={{ fontSize: 16, fontFamily: "monospace" }}
            className="d-flex justify-content-between mb-2"
          >
            <div>
              <b>Master Account List</b>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Table bordered size="sm">
              <thead style={{ background: "#dedcd7" }}>
                <tr>
                  <th>ACCOUNT NAME</th>
                  <th>GST NO</th>
                  <th>PHONE</th>
                  <th>CITY</th>
                </tr>
              </thead>
              <tbody>
                {data.length ? (
                  data.map((acc, idx) => (
                    <tr key={idx}>
                      <td>{acc.ahead || ""}</td>
                      <td>{acc.gstNo || ""}</td>
                      <td>{acc.phone || ""}</td>
                      <td>{acc.city || ""}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </Modal.Body>

      {/* FOOTER */}
      <Modal.Footer>
        <Button onClick={handlePrint}>PRINT</Button>
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

export default PrintModal;
