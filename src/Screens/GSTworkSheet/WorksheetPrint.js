// import React, { useRef } from "react";
// import { Modal, Box, Button, Table } from "@mui/material";
// import { useReactToPrint } from "react-to-print";
// import useCompanySetup from "../Shared/useCompanySetup";

// const WorksheetPrint = ({ isOpen, handleClose, entries, fromDate, uptoDate }) => {
//   const { companyName, companyAdd, companyCity } = useCompanySetup();
//   const componentRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   // Format date → dd/mm/yyyy
//   const formatDate = (d) => {
//     if (!d) return "";
//     const date = new Date(d);
//     return date.toLocaleDateString("en-GB");
//   };

//   // If date given as dd/mm/yyyy → convert
//   const parseDMY = (str) => {
//     const [d, m, y] = str.split("/");
//     return new Date(`${y}-${m}-${d}`);
//   };

//   return (
//     <Modal open={isOpen} onClose={handleClose}>
//       <Box
//         sx={{
//           bgcolor: "white",
//           p: 4,
//           width: "100%",
//           height: "100%",
//           margin: "auto",
//           overflowY: "auto",
//         }}
//       >
//         {/* ACTION BUTTONS */}
//         <Button variant="contained" color="primary" onClick={handlePrint}>
//           Print
//         </Button>

//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={handleClose}
//           style={{ marginLeft: 10 }}
//         >
//           Close
//         </Button>

//         {/* PRINT AREA */}
//         <div
//           ref={componentRef}
//           style={{
//             width: "390mm",
//             minHeight: "390mm",
//             margin: "auto",
//             padding: "30px",
//             borderRadius: "5px",
//             boxSizing: "border-box",
//           }}
//         >
//           {/* Header */}
//           <div style={{ display: "flex", flexDirection: "column" }}>
//             <span
//               style={{
//                 textAlign: "center",
//                 fontSize: 40,
//                 fontWeight: "bolder",
//               }}
//             >
//               {companyName}
//             </span>
//             <span style={{ textAlign: "center", fontSize: 35 }}>
//               {companyAdd}
//             </span>
//             <span style={{ textAlign: "center", fontSize: 35 }}>
//               {companyCity}
//             </span>
//           </div>

//           {/* PERIOD */}
//           <div style={{ display: "flex", marginTop: 10 }}>
//             <span style={{ fontSize: 25, fontWeight: "bolder", marginLeft: 15 }}>
//               Summary Detail Report
//             </span>

//             <span style={{ fontSize: 25, fontWeight: "bold", marginLeft: "auto" }}>
//               From : {formatDate(fromDate)}
//             </span>

//             <span
//               style={{
//                 fontSize: 25,
//                 fontWeight: "bold",
//                 marginLeft: 10,
//                 marginRight: 20,
//               }}
//             >
//               Upto : {formatDate(uptoDate)}
//             </span>
//           </div>

//           {/* TABLE */}
//           <div style={{ padding: "15px" }}>
//             <Table>
//               <thead>
//                 <tr style={{ backgroundColor: "lightgrey" }}>
//                   <th style={styles.tableHeader}>Date</th>
//                   <th style={styles.tableHeader}>Bill No</th>
//                   <th style={styles.tableHeader}>A/c Name</th>
//                   <th style={styles.tableHeader}>Gst</th>
//                   <th style={styles.tableHeader}>Qty</th>
//                   <th style={styles.tableHeader}>Taxable Value</th>
//                   <th style={styles.tableHeader}>C.Tax</th>
//                   <th style={styles.tableHeader}>S.Tax</th>
//                   <th style={styles.tableHeader}>I.Tax</th>
//                   <th style={styles.tableHeader}>V.Amt</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {(entries || []).map((en, idx) => (
//                   <tr key={idx}>
//                     <td style={styles.tableCell}>
//                       {en?.date?.includes("/")
//                         ? parseDMY(en.date).toLocaleDateString("en-GB")
//                         : formatDate(en.date)}
//                     </td>

//                     <td style={styles.tableCell}>{en.vbillno || en.vno}</td>

//                     <td style={styles.tableCell}>{en.item?.sdisc}</td>

//                     <td style={styles.tableCell}>{en.item?.gst}%</td>

//                     <td style={styles.tableCellRight}>{en.qty}</td>

//                     <td style={styles.tableCellRight}>
//                       {Number(en.value).toFixed(2)}
//                     </td>

//                     <td style={styles.tableCellRight}>
//                       {Number(en.ctax).toFixed(2)}
//                     </td>

//                     <td style={styles.tableCellRight}>
//                       {Number(en.stax).toFixed(2)}
//                     </td>

//                     <td style={styles.tableCellRight}>
//                       {Number(en.itax).toFixed(2)}
//                     </td>

//                     <td style={styles.tableCellRight}>
//                       {Number(en.vamt).toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>

//               {/* TOTALS */}
//               <tfoot>
//                 <tr style={{ backgroundColor: "#d9d9d9", fontWeight: "bold" }}>
//                   <td colSpan={4} style={styles.totalLabel}>
//                     Totals:
//                   </td>

//                   <td style={styles.tableCellRight}>
//                     {entries.reduce((s, e) => s + Number(e.qty || 0), 0)}
//                   </td>

//                   <td style={styles.tableCellRight}>
//                     {entries
//                       .reduce((s, e) => s + Number(e.value || 0), 0)
//                       .toFixed(2)}
//                   </td>

//                   <td style={styles.tableCellRight}>
//                     {entries
//                       .reduce((s, e) => s + Number(e.ctax || 0), 0)
//                       .toFixed(2)}
//                   </td>

//                   <td style={styles.tableCellRight}>
//                     {entries
//                       .reduce((s, e) => s + Number(e.stax || 0), 0)
//                       .toFixed(2)}
//                   </td>

//                   <td style={styles.tableCellRight}>
//                     {entries
//                       .reduce((s, e) => s + Number(e.itax || 0), 0)
//                       .toFixed(2)}
//                   </td>

//                   <td style={styles.tableCellRight}>
//                     {entries
//                       .reduce((s, e) => s + Number(e.vamt || 0), 0)
//                       .toFixed(2)}
//                   </td>
//                 </tr>
//               </tfoot>
//             </Table>
//           </div>
//         </div>
//       </Box>
//     </Modal>
//   );
// };

// // styles
// const styles = {
//   tableHeader: {
//     border: "1px solid black",
//     padding: "8px",
//     textAlign: "center",
//     fontWeight: "bold",
//     fontSize: "25px",
//   },
//   tableCell: {
//     border: "1px solid black",
//     padding: "8px",
//     textAlign: "left",
//     fontSize: "22px",
//   },
//   tableCellRight: {
//     border: "1px solid black",
//     padding: "8px",
//     textAlign: "right",
//     fontSize: "22px",
//   },
//   totalLabel: {
//     textAlign: "right",
//     border: "1px solid black",
//     padding: "8px",
//     fontSize: "22px",
//   },
// };

// export default WorksheetPrint;


import React, { useRef } from "react";
import { Modal, Box, Button, Table } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import useCompanySetup from "../Shared/useCompanySetup";

const WorksheetPrint = ({ isOpen, handleClose, entries = [], fromDate, uptoDate }) => {
  const { companyName, companyAdd, companyCity } = useCompanySetup();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // Format date → dd/mm/yyyy
  const formatDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-GB");
  };

  // If date given as dd/mm/yyyy → convert
  const parseDMY = (str) => {
    const [d, m, y] = str.split("/");
    return new Date(`${y}-${m}-${d}`);
  };

  // ---------- PAGINATION: 20 ROWS PER PAGE ----------
  const rowsPerPage = 20;
  const pages = [];
  for (let i = 0; i < entries.length; i += rowsPerPage) {
    pages.push(entries.slice(i, i + rowsPerPage));
  }

  // ---------- TOTALS (OVER ALL ENTRIES) ----------
  const totalQty = entries.reduce((s, e) => s + Number(e.qty || 0), 0);
  const totalValue = entries.reduce((s, e) => s + Number(e.value || 0), 0);
  const totalCtax = entries.reduce((s, e) => s + Number(e.ctax || 0), 0);
  const totalStax = entries.reduce((s, e) => s + Number(e.stax || 0), 0);
  const totalItax = entries.reduce((s, e) => s + Number(e.itax || 0), 0);
  const totalVamt = entries.reduce((s, e) => s + Number(e.vamt || 0), 0);

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          bgcolor: "white",
          p: 4,
          width: "100%",
          height: "100%",
          margin: "auto",
          overflowY: "auto",
        }}
      >
        {/* ACTION BUTTONS */}
        <Button className="Button" variant="contained" color="primary" onClick={handlePrint}>
          Print
        </Button>

        <Button
          className="Button"
          variant="contained"
          color="secondary"
          onClick={handleClose}
          style={{ marginLeft: 10 }}
        >
          Close
        </Button>

        {/* PRINT AREA */}
        <div
          ref={componentRef}
          style={{
            width: "390mm",
            minHeight: "390mm",
            margin: "auto",
            padding: "30px",
            borderRadius: "5px",
            boxSizing: "border-box",
          }}
        >
          {/* Header (printed once at top) */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              className="headers2"
              style={{
                textAlign: "center",
                fontSize: 40,
                fontWeight: "bolder",
              }}
            >
              {companyName}
            </span>
            <span className="headers" style={{ textAlign: "center", fontSize: 35 }}>
              {companyAdd}
            </span>
            <span className="headers" style={{ textAlign: "center", fontSize: 35 }}>
              {companyCity}
            </span>
          </div>

          {/* PERIOD */}
          <div style={{ display: "flex", marginTop: 10 }}>
            <span style={{ fontSize: 25, fontWeight: "bolder", marginLeft: 15 }}>
              Summary Detail Report
            </span>

            <span style={{ fontSize: 25, fontWeight: "bold", marginLeft: "auto" }}>
              From : {formatDate(fromDate)}
            </span>

            <span
              style={{
                fontSize: 25,
                fontWeight: "bold",
                marginLeft: 10,
                marginRight: 20,
              }}
            >
              Upto : {formatDate(uptoDate)}
            </span>
          </div>

          {/* TABLE PAGES */}
          <div style={{ padding: "15px" }}>
            {pages.map((pageEntries, pageIndex) => {
              const isLastPage = pageIndex === pages.length - 1;

              return (
                <div
                  key={pageIndex}
                  style={{
                    pageBreakAfter: isLastPage ? "auto" : "always",
                    marginBottom: 20,
                  }}
                >
                  <Table size="small">
                    <thead>
                      <tr style={{ backgroundColor: "lightgrey" }}>
                        <th style={styles.tableHeader}>Date</th>
                        <th style={styles.tableHeader}>Bill No</th>
                        <th style={styles.tableHeader}>A/c Name</th>
                        <th style={styles.tableHeader}>Gst</th>
                        <th style={styles.tableHeader}>Qty</th>
                        <th style={styles.tableHeader}>Taxable Value</th>
                        <th style={styles.tableHeader}>C.Tax</th>
                        <th style={styles.tableHeader}>S.Tax</th>
                        <th style={styles.tableHeader}>I.Tax</th>
                        <th style={styles.tableHeader}>V.Amt</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pageEntries.map((en, idx) => (
                        <tr key={idx}>
                          <td style={styles.tableCell}>
                            {en?.date?.includes("/")
                              ? parseDMY(en.date).toLocaleDateString("en-GB")
                              : formatDate(en.date)}
                          </td>

                          <td style={styles.tableCell}>{en.vbillno || en.vno}</td>

                          <td style={styles.tableCell}>{en.item?.sdisc}</td>

                          <td style={styles.tableCell}>{en.item?.gst}%</td>

                          <td style={styles.tableCellRight}>{en.qty}</td>

                          <td style={styles.tableCellRight}>
                            {Number(en.value || 0).toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {Number(en.ctax || 0).toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {Number(en.stax || 0).toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {Number(en.itax || 0).toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {Number(en.vamt || 0).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>

                    {/* TOTALS ONLY ON LAST PAGE */}
                    {isLastPage && (
                      <tfoot>
                        <tr style={{ backgroundColor: "#d9d9d9", fontWeight: "bold" }}>
                          <td colSpan={4} style={styles.totalLabel}>
                            Totals:
                          </td>

                          <td style={styles.tableCellRight}>{totalQty}</td>

                          <td style={styles.tableCellRight}>
                            {totalValue.toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {totalCtax.toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {totalStax.toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {totalItax.toFixed(2)}
                          </td>

                          <td style={styles.tableCellRight}>
                            {totalVamt.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </Table>
                </div>
              );
            })}
          </div>
        </div>
      </Box>
    </Modal>
  );
};

// styles
const styles = {
  tableHeader: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: "20px",
  },
  tableCell: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "left",
    fontSize: "18px",
  },
  tableCellRight: {
    border: "1px solid black",
    padding: "8px",
    textAlign: "right",
    fontSize: "18px",
  },
  totalLabel: {
    textAlign: "right",
    border: "1px solid black",
    padding: "8px",
    fontSize: "18px",
  },
};

export default WorksheetPrint;
