import React, { useRef, useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Modal, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useCompanySetup from './Shared/useCompanySetup';

const InvoicePDFbank = React.forwardRef(({
    formData,
    items,
    isOpen, // Changed from 'open' to 'isOpen'
    handleClose,
  }, ref) => {
    
    const { companyName, companyAdd } = useCompanySetup();

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

    const [totalQuantity, setTotalQuantity] = useState(0);
    // Function to calculate total quantity
    const calculateTotalQuantity = () => {
      const total = items.reduce((accumulator, currentItem) => {
        return accumulator + Number(currentItem.weight);
      }, 0);
      setTotalQuantity(total);
    };
    useEffect(() => {
      calculateTotalQuantity();
    }, [items]);

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
          {/* <text style={{ fontWeight: "bold", fontSize: 30, marginLeft: "32%" }}>
            This Is The Preview of Bill
          </text> */}
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
              fontFamily: "Courier New"
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
                </div>
               <div style={{display:"flex",flexDirection:'row',marginTop:50}}>
                <text style={{fontSize:20}}>DATE:{formatDate(formData.date)}</text>
                <text style={{marginLeft:"68%",fontSize:20}}>BANK VOUCHER</text>
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
                          <span style={{fontWeight:'bold'}}>{item.accountname}</span>
                          <div style={{display:'flex',flexDirection:'row'}}>
                                <span>{item.chqnoBank}</span>
                                <span style={{marginLeft:10}}>{item.remarks}</span>
                                </div>
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
                      <td style={{fontSize:20,fontWeight:'bold',marginLeft:20}}>
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
                <div style={{display:"flex",flexDirection:"row",marginTop:60,fontFamily: "Courier New",justifyContent:'space-between'}}>
                    <text style={{fontSize:25,marginLeft:10}}>Cashier</text>
                    <text style={{fontSize:25}}>Accountant</text>
                    <text style={{fontSize:25, marginRight:10}}>Manager</text>
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
  export default InvoicePDFbank;