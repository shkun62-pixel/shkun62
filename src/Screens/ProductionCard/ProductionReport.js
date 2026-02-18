import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';
import useCompanySetup from "../Shared/useCompanySetup";



const ProductionReport = ({ isOpen, handleClose, reportType, selectedAhead, transactionType }) => {
    const tenant = "03AAYFG4472A1ZG_01042025_31032026";
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const componentRef = useRef();
    const handlePrint = useReactToPrint({ content: () => componentRef.current });

    useEffect(() => {
        if (isOpen) fetchProductionData();
    }, [isOpen]);

    const fetchProductionData = async () => {
        try {
            const response = await axios.get(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ProductionCard`);
            setData(response.data);
            filterData(response.data);
        } catch (error) {
            console.error("Error fetching production data:", error);
        }
    };

    const filterData = (data) => {
        if (reportType === "Date-wise") {
            setFilteredData({}); // ✅ Reset to object shape first

            const grouped = {};

            data.forEach(entry => {
                const date = entry.formData.date;
                if (!grouped[date]) grouped[date] = [];

                entry.items.forEach(item => {
                    if (selectedAhead !== "All" && item.Aheads !== selectedAhead) return;

                    const issue = parseFloat(item.pcsIssue) || 0;
                    const receipt = parseFloat(item.pcsReceipt) || 0;

                    if (transactionType === "Issue" && issue === 0) return;
                    if (transactionType === "Receipt" && receipt === 0) return;

                    grouped[date].push({
                        ahead: item.Aheads,
                        pcsIssue: issue,
                        pcsReceipt: receipt,
                    });
                });
            });

            setFilteredData(grouped);
        } 

        else if (reportType === "Month-wise") {
            setFilteredData([]); // ✅ Reset to array shape first

            const grouped = {};

            data.forEach(entry => {
                const [dd, mm, yyyy] = entry.formData.date.split("/");
                const monthYear = `${mm}-${yyyy}`;

                if (!grouped[monthYear]) grouped[monthYear] = {};

                entry.items.forEach(item => {
                    if (selectedAhead !== "All" && item.Aheads !== selectedAhead) return;

                    const issue = parseFloat(item.pcsIssue) || 0;
                    const receipt = parseFloat(item.pcsReceipt) || 0;

                    if (transactionType === "Issue" && issue === 0) return;
                    if (transactionType === "Receipt" && receipt === 0) return;

                    if (!grouped[monthYear][item.Aheads]) {
                        grouped[monthYear][item.Aheads] = { pcsIssue: 0, pcsReceipt: 0 };
                    }

                    grouped[monthYear][item.Aheads].pcsIssue += issue;
                    grouped[monthYear][item.Aheads].pcsReceipt += receipt;
                });
            });

            const monthWiseData = Object.entries(grouped).map(([monthYear, aheads]) => ({
                monthYear,
                rows: Object.entries(aheads).map(([ahead, values]) => ({
                    ahead,
                    ...values
                }))
            }));

            setFilteredData(monthWiseData);
        }
    };

    useEffect(() => {
        if (data.length > 0) {
            filterData(data);
        }
    }, [reportType, selectedAhead, transactionType]);

    const modalStyle = {
        bgcolor: "white",
        boxShadow: 24,
        p: 4,
        overflowY: "auto",
    };

    const thStyle = { border: "1px solid black", padding: "8px", textAlign: "center" };
    const tdStyle = { border: "1px solid black", padding: "8px", textAlign: "center", verticalAlign: "top" };
    const {companyName,companyAdd} = useCompanySetup();

    const handleExportExcel = () => {
        const workbook = XLSX.utils.book_new();
        const worksheetData = [];
        const merges = [];

        // Add company name and address rows
        const totalColumns = 5; // Sr., Date/Month, Account Name, Issue, Receipt
        worksheetData.push([companyName || "Company Name"]);
        merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: totalColumns - 1 } });

        worksheetData.push([companyAdd || "Company Address"]);
        merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: totalColumns - 1 } });

        // Header row
        const headers = reportType === "Date-wise"
            ? ["Sr.", "Date", "Account Name", "Issue", "Receipt"]
            : ["Sr.", "Month", "Account Name", "Issue", "Receipt"];

        worksheetData.push(headers);

        let rowIndex = 3; // Start from row 3 now (0 & 1 = company rows, 2 = header)
        let srNo = 1;

        if (reportType === "Date-wise" && typeof filteredData === "object") {
            Object.entries(filteredData).forEach(([date, rows]) => {
                if (Array.isArray(rows)) {
                    rows.forEach((item, i) => {
                        const row = [];

                        if (i === 0) {
                            row.push(srNo);
                            row.push(date);
                            merges.push(
                                { s: { r: rowIndex, c: 0 }, e: { r: rowIndex + rows.length - 1, c: 0 } },
                                { s: { r: rowIndex, c: 1 }, e: { r: rowIndex + rows.length - 1, c: 1 } }
                            );
                        } else {
                            row.push(null, null);
                        }

                        row.push(item.ahead);
                        row.push(item.pcsIssue > 0 ? item.pcsIssue.toFixed(3) : "");
                        row.push(item.pcsReceipt > 0 ? item.pcsReceipt.toFixed(3) : "");
                        worksheetData.push(row);
                        rowIndex++;
                    });
                    srNo++;
                }
            });
        }

        if (reportType === "Month-wise" && Array.isArray(filteredData)) {
            filteredData.forEach(group => {
                group.rows.forEach((item, i) => {
                    const row = [];

                    if (i === 0) {
                        row.push(srNo);
                        row.push(group.monthYear);
                        merges.push(
                            { s: { r: rowIndex, c: 0 }, e: { r: rowIndex + group.rows.length - 1, c: 0 } },
                            { s: { r: rowIndex, c: 1 }, e: { r: rowIndex + group.rows.length - 1, c: 1 } }
                        );
                    } else {
                        row.push(null, null);
                    }

                    row.push(item.ahead);
                    row.push(item.pcsIssue > 0 ? item.pcsIssue.toFixed(3) : "");
                    row.push(item.pcsReceipt > 0 ? item.pcsReceipt.toFixed(3) : "");
                    worksheetData.push(row);
                    rowIndex++;
                });
                srNo++;
            });
        }

        // Create worksheet manually
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        worksheet["!merges"] = merges;

        // Style header row
        headers.forEach((header, colIndex) => {
            const cell = worksheet[XLSX.utils.encode_cell({ r: 2, c: colIndex })]; // Header at row 2
            if (cell) {
                cell.s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: {
                        patternType: "solid",
                        fgColor: { rgb: "4F81BD" },
                    },
                    alignment: { horizontal: "center", vertical: "center" },
                    border: {
                        top: { style: "thin", color: { rgb: "000000" } },
                        bottom: { style: "thin", color: { rgb: "000000" } },
                        left: { style: "thin", color: { rgb: "000000" } },
                        right: { style: "thin", color: { rgb: "000000" } },
                    }
                };
            }
        });

        // Style company name and address rows
        [0, 1].forEach(rowIdx => {
            const cell = worksheet[XLSX.utils.encode_cell({ r: rowIdx, c: 0 })];
            if (cell) {
                cell.s = {
                    font: { bold: true, sz: 14 },
                    alignment: { horizontal: "center", vertical: "center" }
                };
            }
        });

        worksheet["!cols"] = [
            { wch: 6 },   // Sr.
            { wch: 15 },  // Date or Month
            { wch: 25 },  // Account Name
            { wch: 10 },  // Issue
            { wch: 10 }   // Receipt
        ];
        
        // Right-align "Issue" and "Receipt" cells
        for (let r = 3; r < rowIndex; r++) {
            [3, 4].forEach(c => {
                const cellAddress = XLSX.utils.encode_cell({ r, c });
                const cell = worksheet[cellAddress];
                if (cell && typeof cell.v !== "undefined" && cell.v !== null && cell.v !== "") {
                    cell.s = {
                        alignment: { horizontal: "right" }
                    };
                }
            });
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, "Production Report");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(dataBlob, `ProductionReport_${reportType}.xlsx`);
    };

    // const handleExportExcel = () => {
    //     const workbook = XLSX.utils.book_new();
    //     const worksheetData = [];
    //     const merges = [];

    //     // Header row
    //     const headers = reportType === "Date-wise"
    //         ? ["Sr.", "Date", "Account Name", "Issue", "Receipt"]
    //         : ["Sr.", "Month", "Account Name", "Issue", "Receipt"];

    //     worksheetData.push(headers);

    //     let rowIndex = 1; // Start from row 1 (row 0 is header)
    //     let srNo = 1;

    //     if (reportType === "Date-wise" && typeof filteredData === "object") {
    //         Object.entries(filteredData).forEach(([date, rows]) => {
    //             if (Array.isArray(rows)) {
    //                 rows.forEach((item, i) => {
    //                     const row = [];

    //                     if (i === 0) {
    //                         row.push(srNo);
    //                         row.push(date);
    //                         merges.push(
    //                             { s: { r: rowIndex, c: 0 }, e: { r: rowIndex + rows.length - 1, c: 0 } },
    //                             { s: { r: rowIndex, c: 1 }, e: { r: rowIndex + rows.length - 1, c: 1 } }
    //                         );
    //                     } else {
    //                         row.push(null, null); // Leave merged cells blank
    //                     }

    //                     row.push(item.ahead);
    //                     row.push(item.pcsIssue > 0 ? item.pcsIssue.toFixed(3) : "");
    //                     row.push(item.pcsReceipt > 0 ? item.pcsReceipt.toFixed(3) : "");
    //                     worksheetData.push(row);
    //                     rowIndex++;
    //                 });
    //                 srNo++;
    //             }
    //         });
    //     }

    //     if (reportType === "Month-wise" && Array.isArray(filteredData)) {
    //         filteredData.forEach(group => {
    //             group.rows.forEach((item, i) => {
    //                 const row = [];

    //                 if (i === 0) {
    //                     row.push(srNo);
    //                     row.push(group.monthYear);
    //                     merges.push(
    //                         { s: { r: rowIndex, c: 0 }, e: { r: rowIndex + group.rows.length - 1, c: 0 } },
    //                         { s: { r: rowIndex, c: 1 }, e: { r: rowIndex + group.rows.length - 1, c: 1 } }
    //                     );
    //                 } else {
    //                     row.push(null, null);
    //                 }

    //                 row.push(item.ahead);
    //                 row.push(item.pcsIssue > 0 ? item.pcsIssue.toFixed(3) : "");
    //                 row.push(item.pcsReceipt > 0 ? item.pcsReceipt.toFixed(3) : "");
    //                 worksheetData.push(row);
    //                 rowIndex++;
    //             });
    //             srNo++;
    //         });
    //     }

    //     // Create worksheet manually
    //     const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    //     worksheet["!merges"] = merges;

    //     // Style header row
    //     headers.forEach((header, colIndex) => {
    //         const cell = worksheet[XLSX.utils.encode_cell({ r: 0, c: colIndex })];
    //         if (cell) {
    //             cell.s = {
    //                 font: { bold: true, color: { rgb: "FFFFFF" } },
    //                 fill: {
    //                     patternType: "solid",
    //                     fgColor: { rgb: "4F81BD" },
    //                 },
    //                 alignment: { horizontal: "center", vertical: "center" },
    //                 border: {
    //                     top: { style: "thin", color: { rgb: "000000" } },
    //                     bottom: { style: "thin", color: { rgb: "000000" } },
    //                     left: { style: "thin", color: { rgb: "000000" } },
    //                     right: { style: "thin", color: { rgb: "000000" } },
    //                 }
    //             };
    //         }
    //     });

    //     worksheet["!cols"] = [
    //         { wch: 6 },   // Sr.
    //         { wch: 15 },  // Date or Month
    //         { wch: 25 },  // Account Name
    //         { wch: 10 },  // Issue
    //         { wch: 10 }   // Receipt
    //     ];

    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Production Report");
    //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    //     const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    //     saveAs(dataBlob, `ProductionReport_${reportType}.xlsx`);
    // };

    return (
        <Modal
            open={isOpen}
            onClose={handleClose}
            style={{ overflow: "auto" }}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={modalStyle}>
                <button className="close-button" onClick={handleClose}>
                    <CloseIcon />
                </button>
                <Button
                    style={{ color: "black", backgroundColor: "lightcoral" }}
                    onClick={handlePrint}
                >
                    Print
                </Button>
                <Button
                style={{ color: "black", backgroundColor: "lightgreen", marginLeft: 8 }}
                onClick={handleExportExcel}
                >
                    Export
                </Button>
                {/* Render Filtered Data */}
                <div ref={componentRef} style={{ marginTop: 20 }}>
                <h3 style={{ textAlign: "center",fontSize:18 }}>
                    {reportType} Report - {transactionType}
                </h3>
                {reportType === "Date-wise" && filteredData && typeof filteredData === "object" && (
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black" }}>
                        <thead style={{ backgroundColor: "lightgrey" }}>
                            <tr>
                                <th style={thStyle}>Sr.</th>
                                <th style={thStyle}>Date</th>
                                <th style={thStyle}>Account Name</th>
                                <th style={thStyle}>Issue</th>
                                <th style={thStyle}>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                        {Object.entries(filteredData).map(([date, rows], index) => (
                            Array.isArray(rows) ? (
                                rows.map((item, i) => (
                                    <tr key={`${date}-${i}`}>
                                        {i === 0 && (
                                            <>
                                                <td style={tdStyle} rowSpan={rows.length}>{index + 1}</td>
                                                <td style={tdStyle} rowSpan={rows.length}>{date}</td>
                                            </>
                                        )}
                                        <td style={tdStyle}>{item.ahead}</td>
                                        <td style={tdStyle}>{item.pcsIssue > 0 ? item.pcsIssue.toFixed(3) : ""}</td>
                                        <td style={tdStyle}>{item.pcsReceipt > 0 ? item.pcsReceipt.toFixed(3) : ""}</td>
                                    </tr>
                                ))
                            ) : null  // if rows is not an array, don't render anything yet
                        ))}
                        </tbody>
                    </table>
                )}

                {reportType === "Month-wise" && Array.isArray(filteredData) && (
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid black", marginTop: 20 }}>
                        <thead style={{ backgroundColor: "lightgrey" }}>
                            <tr>
                                <th style={thStyle}>Sr.</th>
                                <th style={thStyle}>Month</th>
                                <th style={thStyle}>Account Name</th>
                                <th style={thStyle}>Issue</th>
                                <th style={thStyle}>Receipt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((group, index) =>
                                group.rows.map((item, i) => (
                                    <tr key={`${group.monthYear}-${i}`}>
                                        {i === 0 && (
                                            <>
                                                <td style={tdStyle} rowSpan={group.rows.length}>{index + 1}</td>
                                                <td style={tdStyle} rowSpan={group.rows.length}>{group.monthYear}</td>
                                            </>
                                        )}
                                        <td style={tdStyle}>{item.ahead}</td>
                                        <td style={tdStyle}>{item.pcsIssue > 0 ? item.pcsIssue.toFixed(3) : ""}</td>
                                        <td style={tdStyle}>{item.pcsReceipt > 0 ? item.pcsReceipt.toFixed(3) : ""}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
                </div>
            </Box>
        </Modal>
    );
};

export default ProductionReport;


