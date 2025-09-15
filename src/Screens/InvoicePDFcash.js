import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Modal, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useCompanySetup from './Shared/useCompanySetup';

const InvoicePDFcash = React.forwardRef(({
    formData,
    items,
    isOpen, // Changed from 'open' to 'isOpen'
    handleClose,
  }, ref) => {

    const { companyName, companyAdd, companyCity } = useCompanySetup();

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
                <div style={{display:"flex",flexDirection:"column",textAlign:'center'}}>
                  <text style={{fontSize:40}}>{companyName}</text>
                  <text style={{fontSize:20}}>{companyAdd}</text>
                  <text style={{fontSize:20}}>{companyCity}</text>
                </div>
               <div style={{display:"flex",flexDirection:'row',marginTop:50}}>
                <text style={{fontSize:20}}>DATE:{formatDate(formData.date)}</text>
                <text style={{marginLeft:"30%",fontSize:20}}>CASH VOUCHER</text>
                <text style={{marginLeft:"25%",fontSize:20}}>Voucher No:-{formData.voucherno}</text>
               </div>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    borderRight: "1px solid #000",
                    borderLeft: "1px solid #000",
                    borderBottom: "1px solid #000",
                  }}
                >
                  <thead style={{backgroundColor:"lightgrey"}}>
                    <tr style={{fontSize:20}}>
                      <th style={{ border: "1px solid #000", padding: "8px",textAlign:"center" }}>
                        Account Name
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px",textAlign:"center" }}>
                        Narration
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px" ,textAlign:"center"}}>
                        Debit
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px",textAlign:"center" }}>
                        Credit
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
                              fontSize:20
                        }}
                      > 
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                            display:"flex",
                            flexDirection:"column"
                          }}
                        >
                          {item.accountname}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.narration}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingRight: 10,
                            textAlign:"right",
                          }}
                        >
                          {item.payment_debit}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingRight: 10,
                            textAlign:"right",
                          }}
                        >
                          {item.receipt_credit}
                        </td>
                       
                        {/* <td style={{ borderRight: "1px solid black", padding: "8px 0" }}>{item.Others}</td>
                                        <td style={{ borderRight: "1px solid black", padding: "8px 0" }}>{item.CGST}</td>
                                        <td style={{ borderRight: "1px solid black", padding: "8px 0" }}>{item.total}</td> */}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr
                      style={{
                        borderBottom: "1px solid #000",
                        borderLeft: "1px solid #000",
                        borderRight: "1px solid #000",
                      }}
                    >
                      <td
                        colSpan="2"
                        style={{ paddingLeft: "39px", border: "none" ,fontSize:20, fontWeight:'bold'}}
                      >
                        TOTAL
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          paddingRight: "10px",
                          border: "1px solid #000",
                          fontSize:20,
                          fontWeight:'bold'
                        }}
                      >
                        {formData.totalpayment}
                      </td>
                      <td
                        style={{
                          textAlign: "right",
                          paddingRight: "10px",
                          border: "1px solid #000",
                          fontSize:20
                          ,fontWeight:'bold'
                        }}
                      >
                        {formData.totalreceipt}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <div style={{display:"flex",flexDirection:"row",marginTop:60}}>
                    <text style={{fontSize:25,fontFamily:'serif',marginLeft:20}}>Cashier</text>
                    <text style={{fontSize:25,marginLeft:"32%",fontFamily:'serif'}}>Accountant</text>
                    <text style={{fontSize:25,marginLeft:"32%",fontFamily:'serif'}}>Manager</text>
                </div>
                {/* <div style={{ fontSize: "12px" }}>
                  <text>Footer content specific to page {pageIndex + 1}</text>
                </div> */}
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    );
  });
  export default InvoicePDFcash;


// import React, { useRef, useEffect, useState } from "react";
// import { useReactToPrint } from "react-to-print";
// import { Modal, Box, Button } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import axios from "axios";
// import useCompanySetup from "./Shared/useCompanySetup";

// const InvoicePDFcash = React.forwardRef(({ isOpen, handleClose, voucherno }, ref) => {
//   const { companyName, companyAdd, companyCity } = useCompanySetup();

//   const [formData, setFormData] = useState({});
//   const [items, setItems] = useState([]);

//   // ✅ Fetch data from API by voucher number
//   useEffect(() => {
//     if (!isOpen || !voucherno) return;

//     const fetchData = async () => {
//       try {
//         const res = await axios.get(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cashfafile/byVoucher?voucherno=${voucherno}&type=C`
//         );
//         const data = res.data;

//         // Map API response to our format
//         setFormData({
//           date: data.date,
//           voucherno: data.voucherNo,
//           totalpayment: data.transactions
//             .filter((t) => t.ACODE && t.type === "debit")
//             .reduce((sum, t) => sum + t.amount, 0),
//           totalreceipt: data.transactions
//             .filter((t) => t.ACODE && t.type === "credit")
//             .reduce((sum, t) => sum + t.amount, 0),
//         });


//               // inside fetchData
//         const mappedItems = data.transactions
//           .filter((t) => t.ACODE)   // ✅ only include rows with ACODE
//           .map((t) => ({
//             accountname: t.account,
//             narration: t.narration,
//             payment_debit: t.type === "debit" ? t.amount : "",
//             receipt_credit: t.type === "credit" ? t.amount : "",
//           }));

//         setItems(mappedItems);

//       } catch (err) {
//         console.error("Error fetching invoice data:", err);
//       }
//     };

//     fetchData();
//   }, [isOpen, voucherno]);

//   // ✅ Split items into chunks for multipage
//   const chunkItems = (items, firstChunkSize, otherChunkSize) => {
//     const chunks = [];
//     let i = 0;
//     if (items.length > 0) {
//       chunks.push(items.slice(i, i + firstChunkSize));
//       i += firstChunkSize;
//     }
//     while (i < items.length) {
//       chunks.push(items.slice(i, i + otherChunkSize));
//       i += otherChunkSize;
//     }
//     return chunks;
//   };
//   const chunks = chunkItems(items, 10, 20);

//   const componentRef = useRef();
//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//   });

//   const formatDate = (dateValue) => {
//     if (!dateValue) return "";
//     const dateObj = new Date(dateValue);
//     if (isNaN(dateObj)) return "";
//     const day = String(dateObj.getDate()).padStart(2, "0");
//     const month = String(dateObj.getMonth() + 1).padStart(2, "0");
//     const year = dateObj.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   return (
//     <Modal open={isOpen} style={{ overflow: "auto" }} onClose={handleClose}>
//       <Box sx={{ bgcolor: "white", boxShadow: 24, p: 4, overflowY: "auto" }}>
//         <button className="close-button" onClick={handleClose}>
//           <CloseIcon />
//         </button>
//         <Button
//           style={{ color: "black", backgroundColor: "lightcoral" }}
//           onClick={handlePrint}
//         >
//           Print
//         </Button>

//         <div
//           ref={componentRef}
//           style={{
//             width: "290mm",
//             minHeight: "390mm",
//             margin: "auto",
//             padding: "20px",
//             borderRadius: "5px",
//             boxSizing: "border-box",
//             marginTop: 5,
//           }}
//         >
//           {chunks.map((chunk, pageIndex) => (
//             <div
//               key={pageIndex}
//               style={{
//                 minHeight: "257mm",
//                 marginBottom: "20px",
//                 pageBreakAfter:
//                   pageIndex === chunks.length - 1 ? "auto" : "always",
//               }}
//             >
//               {/* Company header */}
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "column",
//                   textAlign: "center",
//                 }}
//               >
//                 <text style={{ fontSize: 40 }}>{companyName}</text>
//                 <text style={{ fontSize: 20 }}>{companyAdd}</text>
//                 <text style={{ fontSize: 20 }}>{companyCity}</text>
//               </div>

//               {/* Voucher details */}
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   marginTop: 50,
//                 }}
//               >
//                 <text style={{ fontSize: 20 }}>
//                   DATE: {formatDate(formData.date)}
//                 </text>
//                 <text style={{ marginLeft: "30%", fontSize: 20 }}>
//                   CASH VOUCHER
//                 </text>
//                 <text style={{ marginLeft: "25%", fontSize: 20 }}>
//                   Voucher No:- {formData.voucherno}
//                 </text>
//               </div>

//               {/* Transactions table */}
//               <table
//                 style={{
//                   width: "100%",
//                   borderCollapse: "collapse",
//                   border: "1px solid #000",
//                 }}
//               >
//                 <thead style={{ backgroundColor: "lightgrey" }}>
//                   <tr style={{ fontSize: 20 }}>
//                     <th style={{ border: "1px solid #000", padding: "8px" }}>
//                       Account Name
//                     </th>
//                     <th style={{ border: "1px solid #000", padding: "8px" }}>
//                       Narration
//                     </th>
//                     <th style={{ border: "1px solid #000", padding: "8px" }}>
//                       Debit
//                     </th>
//                     <th style={{ border: "1px solid #000", padding: "8px" }}>
//                       Credit
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {chunk.map((item, index) => (
//                     <tr key={index} style={{ fontSize: 20 }}>
//                       <td style={{ border: "1px solid black", padding: "8px" }}>
//                         {item.accountname}
//                       </td>
//                       <td style={{ border: "1px solid black", padding: "8px" }}>
//                         {item.narration}
//                       </td>
//                       <td
//                         style={{
//                           border: "1px solid black",
//                           padding: "8px",
//                           textAlign: "right",
//                         }}
//                       >
//                         {item.payment_debit}
//                       </td>
//                       <td
//                         style={{
//                           border: "1px solid black",
//                           padding: "8px",
//                           textAlign: "right",
//                         }}
//                       >
//                         {item.receipt_credit}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//                 <tfoot>
//                   <tr>
//                     <td
//                       colSpan="2"
//                       style={{
//                         paddingLeft: "39px",
//                         fontSize: 20,
//                         fontWeight: "bold",
//                       }}
//                     >
//                       TOTAL
//                     </td>
//                     <td
//                       style={{
//                         textAlign: "right",
//                         paddingRight: "10px",
//                         border: "1px solid #000",
//                         fontSize: 20,
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {formData.totalpayment}
//                     </td>
//                     <td
//                       style={{
//                         textAlign: "right",
//                         paddingRight: "10px",
//                         border: "1px solid #000",
//                         fontSize: 20,
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {formData.totalreceipt}
//                     </td>
//                   </tr>
//                 </tfoot>
//               </table>

//               {/* Footer signatures */}
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   marginTop: 60,
//                 }}
//               >
//                 <text style={{ fontSize: 25, marginLeft: 20 }}>Cashier</text>
//                 <text style={{ fontSize: 25, marginLeft: "32%" }}>
//                   Accountant
//                 </text>
//                 <text style={{ fontSize: 25, marginLeft: "32%" }}>Manager</text>
//               </div>
//             </div>
//           ))}
//         </div>
//       </Box>
//     </Modal>
//   );
// });

// export default InvoicePDFcash;
