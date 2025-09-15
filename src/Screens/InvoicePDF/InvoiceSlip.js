import React, { useEffect, useState } from 'react';
import { Modal, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useCompanySetup from '../Shared/useCompanySetup';

const InvoiceSlip = React.forwardRef(({
    formData,
    items,
    customerDetails,
    isOpen, // Changed from 'open' to 'isOpen'
    handleClose,
    componentRef,   // new
    selectedCopies
  }, ref) => {

    const { companyName, companyAdd, companyPhn, companyPhn2, companyGST, companyPAN, companyDesc, companyEmail } = useCompanySetup();

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
          <div
            ref={componentRef}
            style={{
              width: "180mm",
              minHeight: "390mm",
              margin: "auto",
              padding: "20px",
              borderRadius: "5px",
              boxSizing: "border-box",
              marginTop: 5,
            }}
          >
           {selectedCopies.flatMap((copyType, copyIndex) =>
              chunks.map((chunk, pageIndex) => {
                const targetSize = pageIndex === 0 ? 10 : 10;
                const paddedChunk = [
                  ...chunk,
                  ...Array.from({ length: targetSize - chunk.length }, (_, fillerIndex) => ({
                    id: "",
                    sdisc: "",
                    pkgs: "",
                    weight: "",
                    rate: "",
                    amount: "",
                  })),
                ];

                return (
                  <div
                    key={`${copyType}-${pageIndex}`}
                    style={{
                      minHeight: "257mm",
                      pageBreakAfter:
                        pageIndex === chunks.length - 1 &&
                        copyIndex === selectedCopies.length - 1
                          ? "auto"
                          : "always",
                    }}
                  >
                  <div style={{height:100,borderTop:"1px solid black",borderLeft:"1px solid black",borderRight:"1px solid black",marginTop:10}}>
                    <h1   style={{
                          fontSize: 45,
                          fontWeight: "600",
                          fontFamily: "serif",
                          color:'darkblue',
                          textAlign:'center'
                        }}>{companyName}</h1>
                  </div>
                  <div style={{display:"flex",flexDirection:"row",height:80,borderTop:"1px solid black",borderLeft:"1px solid black",borderRight:"1px solid black"}}>
                   <div style={{borderRight:"1px solid black",width:"70%",display:'flex',flexDirection:'row'}}>
                    <a style={{fontSize:20,fontWeight:'bold'}}>SOLD:</a>
                    <div>
                       {customerDetails.map((item) => (
                          <div key={item.vacode} style={{display:'flex',flexDirection:'column',marginLeft:10}}>
                           <a style={{fontSize:18}}>{item.vacode}</a> 
                            <a style={{fontSize:18}}>{item.Add1}</a> 
                            <a style={{fontSize:18}}>{item.city}</a> 
                          </div>
                        ))}
                       </div>                    
                   </div>
                   <div style={{width:"30%",display:'flex',flexDirection:"column"}}>
                    <text style={{fontSize:20,marginLeft:10}}>Invoice No. {formData.vbillno}</text>
                    <text style={{fontSize:18,marginLeft:10}}>Date. {formatDate(formData.date)}</text>
                   </div>
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
                    <tr>
                    <th style={{ border: "1px solid #000", padding: "8px",textAlign:'center',fontSize:20 }}>
                        Sr.No
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px",textAlign:'center',fontSize:20}}>
                        Description
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px",textAlign:'center',fontSize:20 }}>
                        PCS
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px",textAlign:'center',fontSize:20 }}>
                        Qty.
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px",textAlign:'center',fontSize:20 }}>
                        Rate
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px",textAlign:'center',fontSize:20 }}>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paddedChunk.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom: index === paddedChunk.length - 1 ? "1px solid #000" : "none",
                          fontSize: 20,
                          fontWeight: 650,
                          height: "26px"  // you can adjust row height if needed
                        }}
                      >
                        <td style={{ borderRight: "1px solid black", paddingLeft: 10 }}>{item.id}</td>
                        <td style={{ borderRight: "1px solid black", paddingLeft: 10 }}>{item.sdisc}</td>
                        <td style={{ borderRight: "1px solid black", paddingLeft: 10 }}>{item.pkgs}</td>
                        <td style={{ borderRight: "1px solid black", paddingLeft: 10 }}>{item.weight}</td>
                        <td style={{ borderRight: "1px solid black", paddingLeft: 10 }}>{item.rate}</td>
                        <td style={{ borderRight: "1px solid black", textAlign: "right", paddingRight: 10 }}>{item.amount}</td>
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
                        style={{ paddingLeft: "39px", border: "none",fontWeight:"bold",fontSize:18 }}
                      >
                      
                      </td>
                      <td></td>
                      <td
                        style={{
                          textAlign: "left",
                          paddingLeft: "11px",
                          fontWeight:"bold",
                          fontSize:18
                        }}
                      >
                    
                      </td>
                      <td
                        style={{
                          textAlign: "left",
                          paddingLeft: "11px",
                          border: "1px solid #000",
                          fontWeight:"bold",
                          fontSize:18,
                          color:'red'
                        }}
                      >
                        Total{" "}
                      </td>

                      <td
                        style={{
                          textAlign: "right",
                          textAlign:"right",
                          paddingRight:10,
                          border: "1px solid #000",
                          fontWeight:"bold",
                          fontSize:18,
                          color:"red"
                        }}
                      >
                        {formData.sub_total}
                      </td>
                    </tr>
                  </tfoot>
                  <tfoot>
                    <tr
                      style={{
                        borderBottom: "1px solid #000",
                      }}
                    >
                      <td
                        colSpan="2"
                        style={{ paddingLeft: "39px", border: "none",fontWeight:"bold",fontSize:18 }}
                      >
                      
                      </td>
                      <td></td>
                      <td
                        style={{
                          textAlign: "left",
                          paddingLeft: "11px",
                          border: "1px solid #000",
                          fontWeight:"bold",
                          fontSize:18
                        }}
                      >
                        {totalQuantity}
                      </td>
                      <td
                        style={{
                          textAlign: "left",
                          paddingLeft: "11px",
                          border: "1px solid #000",
                          fontWeight:"bold",
                          fontSize:18,
                          color:'red'
                        }}
                      >
                        Others{" "}
                      </td>

                      <td
                        style={{
                          textAlign: "right",
                          textAlign:"right",
                          paddingRight:10,
                          border: "1px solid #000",
                          fontWeight:"bold",
                          fontSize:18,
                          color:"red"
                        }}
                      >
                        {formData.expafterGST}
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <div style={{ fontSize: "12px" }}>
                  <text>Footer content specific to page {pageIndex + 1}</text>
                </div>
                  </div>
                );
              })
            )}
          </div>
        </Box>
      </Modal>
    );
  });
  export default InvoiceSlip;