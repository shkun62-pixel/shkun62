import React, { useRef } from "react";
import { Modal, Box, Button, Table } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import useCompanySetup from "../../Shared/useCompanySetup";
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';


const BankBookPrint = ({ isOpen, handleClose, filteredData, fromDate, uptoDate,splitByDate   }) => {
  const {companyName,companyAdd, companyCity} = useCompanySetup();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Helper function to format date to dd/mm/yyyy
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB"); // 'en-GB' formats to dd/mm/yyyy
  };

  const handleExportExcel = () => {
    let exportData = [];

    (filteredData || []).forEach((entry) => {
      const formData = entry.formData || {};
      const bank = entry.bankdetails?.[0] || {};
      const item = entry.items?.[0] || {};
      exportData.push({
        "Date": formatDate(formData?.date),
        "VNo.": formData?.voucherno || "",
        "A/C Name": item?.accountname || "",
        "Destination": item?.destination || "",
        "Cheque No": item?.chqnoBank || "",
        "Receipt": parseFloat(item?.receipt_credit || 0),
        "Payment": parseFloat(item?.payment_debit || 0),
        "Discount": parseFloat(item?.discount || 0),
        "B.Charges": parseFloat(item?.bankchargers || 0),
        "Pan": item?.pan || "",
        "Add": item?.Add1 || "",
        "Bank Name": bank?.Bankname || "",
        "Remarks": item?.remarks || "",
      });
    });

    if (exportData.length === 0) return;

    const header = Object.keys(exportData[0]);

    // Period
    const periodFrom = fromDate ? formatDate(fromDate) : "--";
    const periodTo = uptoDate ? formatDate(uptoDate) : "--";

    // Build sheet data
    const sheetData = [
      [companyName || "Company Name"],                       
      [companyAdd || "Company Address"],                     
      [`BANK BOOK - Period From: ${periodFrom}  To: ${periodTo}`], 
      [],                                                    
      header,                                                
      ...exportData.map(row => header.map(h => row[h]))      
    ];

    // ------------------ 📌 Add Totals Row ------------------
    const numericFields = ["Receipt", "Payment", "Discount", "B.Charges"];
    const totals = {};
    header.forEach((h, index) => {
      if (index === 0) {
        totals[h] = "Total"; // first col label
      } else if (numericFields.includes(h)) {
        const colLetter = XLSX.utils.encode_col(index);
        const firstRow = 5; // header at row 5 → data starts row 6
        const lastRow = 4 + exportData.length;
        totals[h] = { f: `SUBTOTAL(9,${colLetter}${firstRow + 1}:${colLetter}${lastRow + 1})` };
      } else {
        totals[h] = "";
      }
    });
    sheetData.push(header.map(h => totals[h])); // add totals row
    // -------------------------------------------------------

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Column widths
    worksheet['!cols'] = [
      { wch: 12 }, // Date
      { wch: 10 }, // VNo
      { wch: 40 }, // A/C Name
      { wch: 20 }, // Destination
      { wch: 15 }, // Cheque No
      { wch: 12 }, // Receipt
      { wch: 12 }, // Payment
      { wch: 12 }, // Discount
      { wch: 12 }, // B.Charges
      { wch: 15 }, // Pan
      { wch: 30 }, // Add
      { wch: 30 }, // Bank Name
      { wch: 30 }, // Remarks
    ];

    // Style header
    header.forEach((_, colIdx) => {
      const cellAddr = XLSX.utils.encode_cell({ r: 4, c: colIdx });
      if (worksheet[cellAddr]) {
        worksheet[cellAddr].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
    });

    // Style company rows
    ["A1", "A2", "A3"].forEach((cell, idx) => {
      if (worksheet[cell]) {
        worksheet[cell].s = {
          font: { bold: true, sz: idx === 0 ? 16 : 12, color: { rgb: "000000" } },
          alignment: { horizontal: "center" }
        };
      }
    });

    // Right-align numeric fields
    numericFields.forEach(field => {
      const colIdx = header.indexOf(field);
      if (colIdx !== -1) {
        for (let r = 5; r < exportData.length + 6; r++) {
          const addr = XLSX.utils.encode_cell({ r, c: colIdx });
          if (worksheet[addr]) {
            worksheet[addr].s = { alignment: { horizontal: "right" } };
          }
        }
      }
    });

    // Style totals row
    const totalRowIndex = exportData.length + 5;
    header.forEach((_, colIdx) => {
      const addr = XLSX.utils.encode_cell({ r: totalRowIndex, c: colIdx });
      if (worksheet[addr]) {
        worksheet[addr].s = {
          font: { bold: true, color: { rgb: "000000" } },
          fill: { patternType: "solid", fgColor: { rgb: "D9D9D9" } },
          alignment: { horizontal: colIdx === 0 ? "left" : "right", vertical: "center" }
        };
      }
    });

    // Merge headers
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bank Book');

    const buffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    });

    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'BankBook.xlsx');
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
          width: "100%",
          height:"100%",
          margin: "auto",
          overflowY: "auto",
        }}
      >
        <Button className="Button" variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>
        <Button
        className="Button"
        style={{ color: "black", backgroundColor: "lightgreen", marginLeft: 8 }}
        onClick={handleExportExcel}
        >
          Export
        </Button>
        <Button className="Button" variant="contained" color="secondary" onClick={handleClose} style={{ marginLeft: 10 }}>
          Close
        </Button>
        {/* Printable Area */}
        <div ref={componentRef} 
         style={{
            width: "390mm",
            minHeight: "390mm",
            margin: "auto",
            padding: "30px",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
        >
          <div style={{display:'flex', flexDirection:'column'}}>
            <span className="headers2" style={{textAlign:'center',fontSize:40, fontWeight:'bolder'}}>{companyName}</span>
            <span className="headers" style={{textAlign:'center',fontSize:35}}>{companyAdd}</span>
            <span className="headers" style={{textAlign:'center',fontSize:35}}>{companyCity}</span>
          </div>
          <div style={{display:'flex'}}>
            <span style={{fontSize:25, fontWeight:'bolder',marginLeft:15}}>BANK BOOK</span>
            <span style={{fontSize:25, fontWeight:'bold',marginLeft:'auto'}}>From : {formatDate(fromDate)}</span>
            <span style={{fontSize:25, fontWeight:'bold', marginLeft:10,marginRight:20}}>Upto : {formatDate(uptoDate)}</span>
          </div>
           {/* Print Header Once If Not Splitting Pages */}
           <div style={{padding:"15px"}}>
              <Table>
                <thead>
                  <tr style={{ backgroundColor: "lightgrey" }}>
                    <th style={styles.tableHeader}>Date</th>
                    <th style={styles.tableHeader}>V.No</th>
                    <th style={styles.tableHeader}>Account Name</th>
                    {/* <th style={styles.tableHeader}>Destination</th> */}
                    <th style={styles.tableHeader}>Receipts</th>
                    <th style={styles.tableHeader}>Payments</th>
                    <th style={styles.tableHeader}>Discount</th>
                    <th style={styles.tableHeader}>B.Charges</th>
                      <th style={styles.tableHeader}>Cheque No</th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredData || []).map((entry, idx) => (
                    <tr key={idx}>
                      <td style={styles.tableCell}>{formatDate(entry.formData?.date)}</td>
                      <td style={styles.tableCell}>{entry.formData?.voucherno}</td>
                      <td style={styles.tableCell}>{entry.items?.[0]?.accountname || ""}</td>
                      {/* <td style={styles.tableCell}>{entry.items?.[0]?.destination || ""}</td> */}
                      <td style={{ textAlign: "right",border: "1px solid black", padding: "8px",fontSize: "22px" }}>
                        {entry.formData?.totalreceipt || "0"}
                      </td>
                      <td style={{ textAlign: "right", border: "1px solid black",  padding: "8px",fontSize: "22px" }}>
                        {entry.formData?.totalpayment || "0"}
                      </td>
                      <td style={{ textAlign: "right", border: "1px solid black",  padding: "8px",fontSize: "22px" }}>
                         {entry.formData?.totaldiscount || "0"}
                      </td>
                      <td style={{ textAlign: "right", border: "1px solid black",  padding: "8px",fontSize: "22px" }}>
                         {entry.formData?.totalbankcharges || "0"}
                      </td>
                      <td style={styles.tableCell}>{entry.items?.[0]?.chqnoBank || ""}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                <tr style={{ backgroundColor: "#d9d9d9", fontWeight: "bold" }}>
                  <td colSpan={3} style={{ textAlign: "right", border: "1px solid black", padding: "8px", fontSize: "22px" }}>
                    Totals:
                  </td>
                  <td style={{ textAlign: "right", border: "1px solid black", padding: "8px", fontSize: "22px" }}>
                    {filteredData
                      ?.reduce((sum, entry) => sum + parseFloat(entry.formData?.totalreceipt || 0), 0)
                      .toFixed(2)}
                  </td>
                  <td style={{ textAlign: "right", border: "1px solid black", padding: "8px", fontSize: "22px" }}>
                    {filteredData
                      ?.reduce((sum, entry) => sum + parseFloat(entry.formData?.totalpayment || 0), 0)
                      .toFixed(2)}
                  </td>
                  <td style={{ textAlign: "right", border: "1px solid black", padding: "8px", fontSize: "22px" }}>
                    {filteredData
                      ?.reduce((sum, entry) => sum + parseFloat(entry.formData?.totaldiscount || 0), 0)
                      .toFixed(2)}
                  </td>
                  <td style={{ textAlign: "right", border: "1px solid black", padding: "8px", fontSize: "22px" }}>
                    {filteredData
                      ?.reduce((sum, entry) => sum + parseFloat(entry.formData?.totalbankcharges || 0), 0)
                      .toFixed(2)}
                  </td>
                     <td style={{ textAlign: "right", border: "1px solid black", padding: "8px", fontSize: "22px" }}>
                    
                  </td>
                </tr>
              </tfoot>
              </Table>
            </div>
        </div>
      </Box>
    </Modal>
  );
};

// Styles for table elements
const styles = {
  tableHeader: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "25px"
  },
  tableCell: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "left",
    fontSize: "22px"
  },
  subTotalCell: {
    border: "1px solid black",
    padding: "8px",
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
  },
};

export default BankBookPrint;



