import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Modal, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useCompanySetup from "../Shared/useCompanySetup";
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';

const StockSummPrint = React.forwardRef(({
      items,
      isOpen, // Changed from 'open' to 'isOpen'
      handleClose,
      fromDate,
      uptoDate,
    },
    ref
  ) => {
    const chunkItems = (items, firstChunkSize, otherChunkSize) => {
      const chunks = [];
      let i = 0;
      // Handle the first chunk with a specific size
      if (items.length > 0) {
        chunks.push(items.slice(i, i + firstChunkSize));
        i += firstChunkSize;
      }
      // Handle all other chunks with a different size
      while (i < items.length) {
        chunks.push(items.slice(i, i + otherChunkSize));
        i += otherChunkSize;
      }
      return chunks;
    };

    const formattedFrom = fromDate
      ? new Date(fromDate).toLocaleDateString("en-GB")
      : "";
    const formattedUpto = uptoDate
      ? new Date(uptoDate).toLocaleDateString("en-GB")
      : "";
    // Split items into chunks of 10
    const chunks = chunkItems(items, 10, 20);
    const style = {
      bgcolor: "white",
      boxShadow: 24,
      p: 4,
      overflowY: "auto",
    };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });

  const {companyName,companyAdd} = useCompanySetup();

  const handleExportExcel = () => {
    const exportData = items.map(entry => {
    return {
      "Account Name": entry.sdisc,
      "Opening Pcs": entry.pcsOp || "",
      "Opening": entry.opening || "",
      "Rec Pcs": entry.pcsPur || "",
      "Rec Qty": entry.purRec,
      "Issue Pcs": entry.pcsSale || "0",
      "Issue Qty": entry.sale || "",
      "Cls Pcs":  entry.pcsClosing,
      "Cls Qty": entry.closing || "0",
      // "Desciption": entry.sdisc || "0",
    };
  });

    const header = Object.keys(exportData[0]);

    // Add an empty row at the top with the shop name
    const periodFrom = formattedFrom;
    const periodTo = formattedUpto;

    const sheetData = [
      [companyName || "Company Name"],                        // Row 0
      [companyAdd || "Company Address"],                      // Row 1
      [`STOCK STAEMENT DATED: ${periodFrom}  To: ${periodTo}`],  // Row 2
      [],                                                     // Row 3 (spacer)
      header,                                                 // Row 4
      ...exportData.map(row => header.map(h => row[h]))       // Row 5+
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 25 }, // Date
      { wch: 10 }, // Opening
      { wch: 10 }, // Purchase
      { wch: 10 }, // Production
      { wch: 10 }, // Trf/Cn
      { wch: 10 }, // Issue
      { wch: 10 }, // Sale
      { wch: 10 }, // Trf/Dn
      { wch: 10 }, // Closing
      // { wch: 45 }, // Desc
    ];

    // Style header row (Row 3, index 2)
    header.forEach((_, colIdx) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 4, c: colIdx }); // ✅ correct row index for header
      if (!worksheet[cellAddress]) return;
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: {
          patternType: "solid",
          fgColor: { rgb: "4F81BD" }
        },
        alignment: { horizontal: "center", vertical: "center" }
      };
    });

    // Style the company name (Row 0, Cell A1)
    const companyCell = worksheet["A1"];
    if (companyCell) {
      companyCell.s = {
        font: { bold: true, sz: 16, color: { rgb: "000000" } },
        alignment: { horizontal: "center" }
      };
    }
    const addressCell = worksheet["A2"];
    if (addressCell) {
      addressCell.s = {
        font: {bold: true, sz: 14, color: { rgb: "000000" } },
        alignment: { horizontal: "center" }
      };
    }

    const periodCell = worksheet["A3"];
    if (periodCell) {
      periodCell.s = {
        font: { bold: true, sz: 12, color: { rgb: "000000" } },
        alignment: { horizontal: "center" }
      };
    }

    const registerCell = worksheet["A4"];
    if (registerCell) {
      registerCell.s = {
        font: { bold: true, sz: 12, color: { rgb: "000000" } },
        alignment: { horizontal: "center" }
      };
    }

    // Merge company name across all columns
    worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } }, // Merge company name
    { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } }, // Merge company address
    { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } }, // Merge period row
  ];

  // Style data rows: right-align except "Date" and "Desciption"
  exportData.forEach((row, rowIdx) => {
    header.forEach((key, colIdx) => {
      const cellAddress = XLSX.utils.encode_cell({ r: 5 + rowIdx, c: colIdx });
      const cell = worksheet[cellAddress];
      if (!cell) return;

      // Apply alignment conditionally
      const isLeftAligned = key === "Account Name";
      cell.s = {
        alignment: {
          horizontal: isLeftAligned ? "left" : "right",
          vertical: "center"
        }
      };
    });
  });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stksum');

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    });

    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'stksum.xlsx');
  };

    return (
      <Modal
        open={isOpen}
        style={{ overflow: "auto" }}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button className="close-button" onClick={handleClose}>
            <CloseIcon />
          </button>
          <Button
            className="Button"
            style={{ color: "black", backgroundColor: "lightcoral" }}
            onClick={handlePrint}
          >
            Print
          </Button>            
          <Button
          className="Button"
          style={{ color: "black", backgroundColor: "lightgreen", marginLeft: 8 }}
          onClick={handleExportExcel}
        >
          Export
        </Button>
          <div
            ref={componentRef}
            style={{
              width: "290mm",
              minHeight: "390mm",
              margin: "auto",
              padding: "20px",
              // border: "1px solid #000",
              borderRadius: "5px",
              boxSizing: "border-box",
              marginTop: 5,
            }}
          >
            {chunks.map((chunk, pageIndex) => (
              <div
                key={pageIndex}
                style={{
                  minHeight: "257mm",
                  marginBottom: "20px",
                  pageBreakAfter:
                    pageIndex === chunks.length - 1 ? "auto" : "always", // Changed 'avoid' to 'auto'
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <text style={{ fontSize: 40 }}>{companyName}</text>
                  <text style={{ fontSize: 20 }}>{companyAdd}</text>
                  {/* <text style={{ fontSize: 20 }}>{"MANDI GOBINDGARH"}</text> */}
                </div>
                <text style={{ fontSize: 18 }}>
                  From: {formattedFrom} &nbsp;&nbsp; Upto: {formattedUpto}
                </text>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    borderRight: "1px solid #000",
                    borderLeft: "1px solid #000",
                    borderBottom: "1px solid #000",
                  }}
                >
                  <thead style={{ backgroundColor: "lightgrey" }}>
                    <tr style={{ fontSize: 20 }}>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Item Name
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Rate
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        OpeningPcs
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Opening
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Rec.Pcs
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Rec.Qty
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Issue Pcs
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Issue Qty
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Cls Pcs
                      </th>
                      <th
                        style={{
                          border: "1px solid #000",
                          padding: "8px",
                          textAlign: "center",
                        }}
                      >
                        Cls Qty
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ borderBottom: "1px solid black" }}>
                    {chunk.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom:
                            index === chunk.length - 1
                              ? "1px solid #000"
                              : "none",
                          fontSize: 20,
                        }}
                      >
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.sdisc}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.Mrps}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.pcsOp}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.opening}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.pcsPur}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.purRec}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.pcsSale}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.sale}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.pcsClosing}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.closing}
                        </td>

                        {/* <td style={{ borderRight: "1px solid black", padding: "8px 0" }}>{item.Others}</td>
                                        <td style={{ borderRight: "1px solid black", padding: "8px 0" }}>{item.CGST}</td>
                                        <td style={{ borderRight: "1px solid black", padding: "8px 0" }}>{item.total}</td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ fontSize: "12px" }}>
                  <text>Footer content specific to page {pageIndex + 1}</text>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    );
  }
);
export default StockSummPrint;
