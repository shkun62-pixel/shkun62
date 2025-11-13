import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Modal, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';
import useCompanySetup from '../Shared/useCompanySetup';

const ReceiptListPrint = React.forwardRef(({
    items,
    isOpen, // Changed from 'open' to 'isOpen'
    handleClose,
    fromDate, toDate,
    tableData,
    fontWeight,
    sortedVisibleFields
  }, ref) => {
    const {companyName,companyAdd} = useCompanySetup();

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
    
    const handleExportExcel = () => {
      const exportData = items.map(entry => {
        const formData = entry.formData || {};
        const customer = entry.customerDetails?.[0] || {};
        const item = entry.items?.[0] || {};
        const row = {};

        sortedVisibleFields.forEach(field => {
          if (field === "date") row["Date"] = formatDate(formData.date);
          else if (field === "billno") row["Bill No."] = formData.vbillno || "";
          else if (field === "weight") {
            row["Qty"] = Number(entry.items?.reduce((sum, i) => sum + parseFloat(i.weight || 0), 0).toFixed(3));
          } else if (field === "pcs") {
            row["Pcs"] = Number(entry.items?.reduce((sum, i) => sum + parseFloat(i.pkgs || 0), 0).toFixed(3));
          } else if (field === "accountname") row["A/C Name"] = customer.vacode?.trim() || "";
          else if (field === "city") row["City"] = customer.city || "";
          else if (field === "gstin") row["Gstin"] = customer.gstno || "";
          else if (field === "netvalue") row["Net Sale"] = parseFloat(formData.sub_total) || 0;
          else if (field === "cgst") row["C.Tax"] = parseFloat(formData.cgst) || 0;
          else if (field === "sgst") row["S.Tax"] = parseFloat(formData.sgst) || 0;
          else if (field === "igst") row["I.Tax"] = parseFloat(formData.igst) || 0;
          else if (field === "value") row["Bill Amount"] = parseFloat(formData.grandtotal) || 0;
          else if (/^exp[1-5]$/.test(field)) row[`Exp ${field.slice(3)}`] = parseFloat(item[`Exp${field.slice(3)}`]) || 0;
          else if (/^exp[6-9]$|^exp10$/.test(field)) row[`Exp ${field.slice(3)}`] = parseFloat(formData[`Exp${field.slice(3)}`]) || 0;
          else if (field === "description") row["Description"] = item.sdisc || "";
          else if (field === "vehicleno") row["VehicleNo"] = formData.trpt || "";
          else if (field === "remarks") row["Remarks"] = formData.rem2 || "";
          else if (field === "transport") row["Transport"] = formData.v_tpt || "";
          else if (field === "broker") row["Broker"] = formData.broker || "";
          else if (field === "taxtype") row["TaxType"] = formData.stype || "";
        });
          row["Paid"] = parseFloat(formData.paidAmount) || 0;
          row["Balance"] = parseFloat(formData.balance) || 0;
        return row;
      });

      if (exportData.length === 0) return;

      const header = [
        ...sortedVisibleFields.map(field => {
          if (field === "date") return "Date";
          if (field === "billno") return "Bill No.";
          if (field === "accountname") return "A/C Name";
          if (field === "weight") return "Qty";
          if (field === "pcs") return "Pcs";
          if (field === "city") return "City";
          if (field === "gstin") return "Gstin";
          if (field === "netvalue") return "Net Sale";
          if (field === "cgst") return "C.Tax";
          if (field === "sgst") return "S.Tax";
          if (field === "igst") return "I.Tax";
          if (field === "value") return "Bill Amount";
          if (field.startsWith("exp")) return `Exp ${field.replace("exp", "")}`;
          if (field === "description") return "Description";
          if (field === "vehicleno") return "VehicleNo";
          if (field === "remarks") return "Remarks";
          if (field === "transport") return "Transport";
          if (field === "broker") return "Broker";
          if (field === "taxtype") return "TaxType";
          return field.toUpperCase();
        }),
        // ✅ Add headers for new columns
        "Paid",
        "Balance"
      ];

      // const header = sortedVisibleFields.map(field => {
      //   if (field === "date") return "Date";
      //   if (field === "billno") return "Bill No.";
      //   if (field === "accountname") return "A/C Name";
      //   if (field === "weight") return "Qty";
      //   if (field === "pcs") return "Pcs";
      //   if (field === "city") return "City";
      //   if (field === "gstin") return "Gstin";
      //   if (field === "netvalue") return "Net Sale";
      //   if (field === "cgst") return "C.Tax";
      //   if (field === "sgst") return "S.Tax";
      //   if (field === "igst") return "I.Tax";
      //   if (field === "value") return "Bill Amount";
      //   if (field.startsWith("exp")) return `Exp ${field.replace("exp", "")}`;
      //   if (field === "description") return "Description";
      //   if (field === "vehicleno") return "VehicleNo";
      //   if (field === "remarks") return "Remarks";
      //   if (field === "transport") return "Transport";
      //   if (field === "broker") return "Broker";
      //   if (field === "taxtype") return "TaxType";
      //   return field.toUpperCase();
      // });

      const numericFields = [
        "Qty", "Pcs", "Net Sale", "C.Tax", "S.Tax", "I.Tax", "Bill Amount",
        "Exp 1", "Exp 2", "Exp 3", "Exp 4", "Exp 5",
        "Exp 6", "Exp 7", "Exp 8", "Exp 9", "Exp 10","Paid", "Balance"
      ];

      const totals = {};
      header.forEach((h, index) => {
        if (index === 0) {
          totals[h] = "Total";
        } else if (numericFields.includes(h)) {
          const columnLetter = XLSX.utils.encode_col(index);
          const firstRow = 5; // Data starts at row 5 (Excel row 6)
          const lastRow = 4 + exportData.length;
          totals[h] = { f: `SUBTOTAL(9,${columnLetter}${firstRow + 1}:${columnLetter}${lastRow + 1})` };
        } else {
          totals[h] = "";
        }
      });

      const periodFrom = fromDate ? formatDate(fromDate) : "--";
      const periodTo = toDate ? formatDate(toDate) : "--";

      const sheetData = [
        [companyName || "Company Name"],
        [companyAdd || "Company Address"],
        [`Period From: ${periodFrom}  To: ${periodTo}`],
        [],
        header,
        ...exportData.map(row => header.map(h => row[h] ?? "")),
        header.map(h => totals[h])
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      const columnWidths = header.map(h => {
        if (h === "Date") return { wch: 12 };
        if (h === "Bill No.") return { wch: 10 };
        if (h === "A/C Name") return { wch: 45 };
        if (h === "City") return { wch: 20 };
        if (h === "Gstin") return { wch: 20 };
        if (h === "Net Sale" || h === "Bill Amount" || h === "Paid" || h === "Balance") return { wch: 15 }; // ✅ adjusted
        if (h.startsWith("Exp")) return { wch: 10 };
        return { wch: 15 };
      });
      worksheet["!cols"] = columnWidths;

      // Style header
      header.forEach((_, colIdx) => {
        const addr = XLSX.utils.encode_cell({ r: 4, c: colIdx });
        if (worksheet[addr]) {
          worksheet[addr].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
            alignment: { horizontal: "center", vertical: "center" }
          };
        }
      });

      // Style company header rows
      ["A1", "A2", "A3"].forEach((cell, idx) => {
        const fontSize = idx === 0 ? 16 : 12;
        if (worksheet[cell]) {
          worksheet[cell].s = {
            font: { bold: true, sz: fontSize },
            alignment: { horizontal: "center" }
          };
        }
      });

      // Style total row
      const totalRowIndex = exportData.length + 5;
      header.forEach((_, colIdx) => {
        const addr = XLSX.utils.encode_cell({ r: totalRowIndex, c: colIdx });
        if (worksheet[addr]) {
          worksheet[addr].s = {
            font: { bold: true, color: { rgb: "000000" } },
            fill: { patternType: "solid", fgColor: { rgb: "D9D9D9" } },
            alignment: { horizontal: "right", vertical: "center" }
          };
        }
      });

      const decimalFields3 = ["Qty", "Pcs"];
      const decimalFields2 = numericFields.filter(f => !decimalFields3.includes(f));

      // Format 3-decimal fields
      decimalFields3.forEach(field => {
        const colIdx = header.indexOf(field);
        if (colIdx !== -1) {
          for (let r = 5; r < exportData.length + 5; r++) {
            const cell = XLSX.utils.encode_cell({ r, c: colIdx });
            if (worksheet[cell]) worksheet[cell].z = "0.000";
          }
          const totalCell = XLSX.utils.encode_cell({ r: exportData.length + 5, c: colIdx });
          if (worksheet[totalCell]) worksheet[totalCell].z = "0.000";
        }
      });

      // Format 2-decimal fields
      decimalFields2.forEach(field => {
        const colIdx = header.indexOf(field);
        if (colIdx !== -1) {
          for (let r = 5; r < exportData.length + 5; r++) {
            const cell = XLSX.utils.encode_cell({ r, c: colIdx });
            if (worksheet[cell]) worksheet[cell].z = "0.00";
          }
          const totalCell = XLSX.utils.encode_cell({ r: exportData.length + 5, c: colIdx });
          if (worksheet[totalCell]) worksheet[totalCell].z = "0.00";
        }
      });

      // Merge headers
      worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } }
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Receipt List');

      const buffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        cellStyles: true
      });

      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, 'Receipt_List.xlsx');
    };

    const formatDate = (dateValue) => {
      // Check if date is already in dd/mm/yyyy or d/m/yyyy format
      const ddmmyyyyPattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

      if (ddmmyyyyPattern.test(dateValue)) {
        return dateValue;  // already correctly formatted
      }

      // otherwise assume ISO or another format, parse it
      const dateObj = new Date(dateValue);
      if (isNaN(dateObj)) {
        return "";  // invalid date fallback
      }
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const thStyle = {
      border: "1px solid #000", padding: "8px", textAlign: "center", fontSize: 17,
    };
    const tdStyle = {
      padding: "8px", fontSize: 17, borderRight: "1px solid #000",
    };
    const tdRight = {
      ...tdStyle, textAlign: "right",
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
            width: "390mm",
            minHeight: "390mm",
            margin: "auto",
            padding: "20px",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
        >
          <h2 style={{ textAlign: "center",marginTop:-5,fontSize:35,color:'darkblue'}}>{companyName}</h2>
          <h2 style={{ textAlign: "center",fontSize:35,color:'darkblue'}}>{companyAdd}</h2>
          <h4 style={{ textAlign:"center",textDecoration:'underline',fontSize:20,color:'darkblue'}}>Receipt List</h4>

          <div style={{ display:'flex',flexDirection:'row', textAlign: "center", fontWeight: "bold" }}>
            <span style={{fontSize:18}}>Period From: {fromDate ? new Date(fromDate).toLocaleDateString("en-GB") : "--"}</span>
            <span style={{fontSize:18,marginLeft:10}}>To: {toDate ? new Date(toDate).toLocaleDateString("en-GB") : "--"}</span>
          </div>
          
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #000",
              marginTop: "5px",
            }}
          >
          <thead style={{ backgroundColor: "lightgrey" }}>
            <tr>
              {sortedVisibleFields.map((field) => (
              <th key={field} style={thStyle}>
                {field === "date" ? "Date" :
                field === "billno" ? "BillNo." :
                field === "accountname" ? "A/C Name" :
                field === "weight" ? "Qty" :
                field === "pcs" ? "Pcs" :
                field === "city" ? "City" :
                field === "gstin" ? "Gstin" :
                field === "value" ? "Bill Value" :
                field === "cgst" ? "C.Tax" :
                field === "sgst" ? "S.Tax" :
                field === "igst" ? "I.Tax" :
                field === "netvalue" ? "Net value" :
                field === "exp1" ? "Exp1" :
                field === "exp2" ? "Exp2" :
                field === "exp3" ? "Exp3" :
                field === "exp4" ? "Exp4" :
                field === "exp5" ? "Exp5" :
                field === "exp6" ? "Exp6" :
                field === "exp7" ? "Exp7" :
                field === "exp8" ? "Exp8" :
                field === "exp9" ? "Exp9" :
                field === "exp10" ? "Exp10" : 
                field === "description" ? "Description" : 
                field === "vehicleno" ? "Vehicleno" :    
                field === "remarks" ? "Remarks" :      
                field === "transport" ? "Transport" :     
                field === "broker" ? "Broker" :
                field === "taxtype" ? "TaxType" :
                field.toUpperCase()}
              </th>
            ))}
            <th style={thStyle}>Paid</th>
            <th style={thStyle}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {items.map((entry, index) => {
              const formData = entry.formData || {};
              const customerDetails = entry.customerDetails?.[0] || {};
              const item = entry.items?.[0] || {};
              const totalItemWeight = entry.items?.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0).toFixed(3);
              const totalItemPkgs = entry.items?.reduce((sum, item) => sum + parseFloat(item.pkgs || 0), 0).toFixed(3);
              const formatAmount = (amt) => {
                const num = parseFloat(amt || 0);
                return num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
              };
              return (
                <tr key={index} style={{fontWeight:fontWeight}}>
                   {sortedVisibleFields.map((field) => {
                  let value = "";
                  if (field === "date") value = formatDate(formData.date);
                  else if (field === "billno") value = formData.vno || "";
                  else if (field === "accountname") value = customerDetails.vacode || "";
                  else if (field === "weight") value = totalItemWeight;
                  else if (field === "pcs") value = totalItemPkgs;
                  else if (field === "city") value = customerDetails.city || "";
                  else if (field === "gstin") value = customerDetails.gstno || "";
                  else if (field === "value") value = formData.grandtotal || "";
                  else if (field === "cgst") value = formData.cgst || "";
                  else if (field === "sgst") value = formData.sgst || "";
                  else if (field === "igst") value = formData.igst || "";
                  else if (field === "netvalue") value = formData.sub_total || "";
                  else if (field === "exp1") value = item.Exp1 || "0.00";
                  else if (field === "exp2") value = item.Exp2 || "0.00";
                  else if (field === "exp3") value = item.Exp3 || "0.00";
                  else if (field === "exp4") value = item.Exp4 || "0.00";
                  else if (field === "exp5") value = item.Exp5 || "0.00";
                  else if (field === "exp6") value = formData.Exp6 || "";
                  else if (field === "exp7") value = formData.Exp7 || "";
                  else if (field === "exp8") value = formData.Exp8 || "";
                  else if (field === "exp9") value = formData.Exp9 || "";
                  else if (field === "exp10") value = formData.Exp10 || ""; 
                  else if (field === "description") value = item.sdisc || "";
                  else if (field === "vehicleno") value = formData.trpt || "";
                  else if (field === "remarks") value = formData.rem2 || "";
                  else if (field === "transport") value = formData.v_tpt || "";
                  else if (field === "broker") value = formData.broker || "" ;
                  else if (field === "taxtype") value = formData.stype || "" ;
                  return <td style={tdStyle} key={field}>{value}</td>;
                })}
                <td style={tdRight}>{formatAmount(formData?.paidAmount)}</td>
                <td style={tdRight}>{formatAmount(formData?.balance)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot style={{borderTop:"1px solid black",color:'red'}}>
            <tr>
              {sortedVisibleFields.map((field, idx) => {
              let value = "";
              if (field === "date") value = "TOTAL";
              else if (field === "value") value = items.reduce((a, b) => a + (parseFloat(b.formData?.grandtotal) || 0), 0).toFixed(2);
              else if (field === "cgst") value = items.reduce((a, b) => a + (parseFloat(b.formData?.cgst) || 0), 0).toFixed(2);
              else if (field === "sgst") value = items.reduce((a, b) => a + (parseFloat(b.formData?.sgst) || 0), 0).toFixed(2);
              else if (field === "igst") value = items.reduce((a, b) => a + (parseFloat(b.formData?.igst) || 0), 0).toFixed(2);
              else if (field === "netvalue") value = items.reduce((a, b) => a + (parseFloat(b.formData?.sub_total) || 0), 0).toFixed(2);
              else if (field === "weight") value = items.reduce((a, b) => a + b.items?.reduce((sum, i) => sum + parseFloat(i.weight || 0), 0), 0).toFixed(3);
              else if (field === "pcs") value = items.reduce((a, b) => a + b.items?.reduce((sum, i) => sum + parseFloat(i.pkgs || 0), 0), 0).toFixed(3);
              else if (field === "exp1") value = items.reduce((a, b) => a + (parseFloat(b.items?.[0]?.Exp1 || 0)), 0).toFixed(2);
              else if (field === "exp2") value = items.reduce((a, b) => a + (parseFloat(b.items?.[0]?.Exp2 || 0)), 0).toFixed(2);
              else if (field === "exp3") value = items.reduce((a, b) => a + (parseFloat(b.items?.[0]?.Exp3 || 0)), 0).toFixed(2);
              else if (field === "exp4") value = items.reduce((a, b) => a + (parseFloat(b.items?.[0]?.Exp4 || 0)), 0).toFixed(2);
              else if (field === "exp5") value = items.reduce((a, b) => a + (parseFloat(b.items?.[0]?.Exp5 || 0)), 0).toFixed(2);
              else if (field === "exp6") value = items.reduce((a, b) => a + (parseFloat(b.formData?.Exp6 || 0)), 0).toFixed(2);
              else if (field === "exp7") value = items.reduce((a, b) => a + (parseFloat(b.formData?.Exp7 || 0)), 0).toFixed(2);
              else if (field === "exp8") value = items.reduce((a, b) => a + (parseFloat(b.formData?.Exp8 || 0)), 0).toFixed(2);
              else if (field === "exp9") value = items.reduce((a, b) => a + (parseFloat(b.formData?.Exp9 || 0)), 0).toFixed(2);
              else if (field === "exp10") value = items.reduce((a, b) => a + (parseFloat(b.formData?.Exp10 || 0)), 0).toFixed(2);
              return <td key={field} style={tdStyle}>{value}</td>;
            })}
            <td style={tdRight}>
              {items.reduce((a, b) => a + (parseFloat(b.formData?.paidAmount) || 0), 0).toFixed(2)}
            </td>
            <td style={tdRight}>
              {items.reduce((a, b) => a + (parseFloat(b.formData?.balance) || 0), 0).toFixed(2)}
            </td>
            </tr>
          </tfoot>
          </table>
        </div>
        </Box>
      </Modal>
    );
  });
  export default ReceiptListPrint;
