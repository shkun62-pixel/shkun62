import React, { useRef, useEffect, useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useCompanySetup from '../Shared/useCompanySetup';

const InvoiceSaleChallan = React.forwardRef(({
    formData,
    items,
    customerDetails,
    shipped,
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

    // const componentRef = useRef();
    // const handlePrint = useReactToPrint({
    //   content: () => componentRef.current,
    // });
    function numberToIndianWords(num) {
      const ones = [
          "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
          "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
          "Seventeen", "Eighteen", "Nineteen"
      ];
      const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
      const scales = ["", "Thousand", "Lakh", "Crore"];
  
      if (num === 0) return "Zero Rupees";
  
      function convertHundred(n) {
          let result = "";
          if (n >= 100) {
              result += ones[Math.floor(n / 100)] + " Hundred ";
              n %= 100;
          }
          if (n >= 20) {
              result += tens[Math.floor(n / 10)] + " ";
              n %= 10;
          }
          if (n > 0) {
              result += ones[n] + " ";
          }
          return result.trim();
      }
  
      function convertDecimal(decimalPart) {
          let result = "";
          for (let digit of decimalPart) {
              result += ones[parseInt(digit)] + " ";
          }
          return result.trim();
      }
  
      let [whole, decimal] = num.toString().split(".");
      let word = "";
  
      // Convert the whole number part using Indian numbering system
      let scaleIndex = 0;
      while (whole.length > 0) {
          let part = 0;
          if (scaleIndex === 0) { // Last 3 digits for Thousand
              part = parseInt(whole.slice(-3));
              whole = whole.slice(0, -3);
          } else { // Next 2 digits for Lakh, Crore, etc.
              part = parseInt(whole.slice(-2));
              whole = whole.slice(0, -2);
          }
  
          if (part > 0) {
              word = convertHundred(part) + " " + scales[scaleIndex] + " " + word;
          }
          scaleIndex++;
      }
  
      word = word.trim() + " Rupees";
  
      // Convert the decimal part if present
      if (decimal) {
          word += " and " + convertDecimal(decimal) + " Paise";
      }
  
      return word.trim();
  }
  
  // Example usage with formData.grandtotal
  let totalInWords = numberToIndianWords(formData.grandtotal);

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
          {/* <Button
            className="Button"
            style={{ color: "black", backgroundColor: "lightcoral" }}
            onClick={handlePrint}
          >
            Print
          </Button> */}
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
            //   border: "1px solid #000",
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
                    tariff: "",
                    pkgs: "",
                    weight: "",
                    Units: "",
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
                  <div style={{marginTop:10}}>
                    <div style={{ textAlign: "center", height: 200,borderLeft:"1px solid black",borderRight:"1px solid black",borderTop:"1px solid black",display:'flex',flexDirection:'column'}}>
                    <div style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
                    <a style={{fontSize:18,marginLeft:10}}>GSTIN: {companyGST}</a>
                    <span style={{ fontSize: 18 }}>
                    {selectedCopies.length > 0
                      ? copyType
                          .replace(/([A-Z])/g, " $1")
                          .toUpperCase()
                      : "OFFICE COPY"}
                    </span>
                    <a style={{fontSize:18,marginRight:10}}>Phone: {companyPhn}</a>
                  </div>
                  <text style={{fontSize:20,marginTop:20}}>CHALLAN UNDER RULE 55(1)(C)OF CGST/SGST RULE FOR WEIGHMENT OF GOODS</text>
                      <text
                        style={{
                          fontSize: 60,
                          fontWeight: "600",
                          fontFamily: "serif",
                          color:'darkblue'
                        }}
                      >
                        {companyName}
                      </text>
                      <p
                        style={{
                          marginBottom: 0,
                          fontSize: 18,
                          marginLeft: 0,
                          fontFamily:'Times New Roman, Times, serif'
                        }}
                      >
                        {companyAdd}
                      </p>
                    </div>
                    <div
                      style={{
                        borderTop: "1px solid black",
                        borderLeft: "1px solid black",
                        borderRight: "1px solid black",
                        height:160,
                        display: "flex",
                        flexDirection: "row",    
                      }}
                    >
                       <div style={{height:"100%",width:"50%"}}>
                       {customerDetails.map((item) => (
                          <div key={item.vacode} style={{display:'flex',flexDirection:'column',marginLeft:10}}>
                           <text style={{fontSize:18}}>Name & Address of Consignee</text>
                           <a style={{fontSize:20}}>{item.vacode}</a> 
                            <a style={{fontSize:20}}>{item.Add1}</a> 
                            <a style={{fontSize:20}}>{item.city}</a> 
                            <a style={{fontSize:20}}>GSTIN: {item.gstno}</a> 
                          </div>
                        ))}
                       </div>
                       <div style={{height:"100%",width:"50%",display:'flex',flexDirection:'column',borderLeft:"1px solid black"}}>
                        <div style={{display:"flex",flexDirection:"row",borderBottom:'1px solid black',height:"25%"}}>
                            <div style={{borderRight:"1px solid black",width:"50%",fontSize:20}}> <text style={{marginLeft:10}}>CHALLAN No.</text></div>
                            <div><text style={{fontSize:20,marginLeft:10}}>{formData.vbillno}</text></div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",borderBottom:'1px solid black',height:"25%"}}>
                            <div style={{borderRight:"1px solid black",width:"50%",fontSize:20}}> <text style={{marginLeft:10}}>CHALLAN DATE</text></div>
                            <div><text style={{fontSize:20,marginLeft:10}}>{formatDate(formData.date)}</text></div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",borderBottom:'1px solid black',height:"25%"}}>
                            <div style={{borderRight:"1px solid black",width:"50%",fontSize:20}}> <text style={{marginLeft:10}}>VEHICLE NO.</text></div>
                            <div><text style={{fontSize:20,marginLeft:10}}>{formData.trpt}</text></div>
                        </div>
                        <div style={{display:"flex",flexDirection:"row",height:"25%"}}>
                            <div style={{borderRight:"1px solid black",width:"50%",fontSize:20}}> <text style={{marginLeft:10}}>PLACE OF SUPPLY</text></div>
                            <div style={{display:'flex',flexDirection:'row'}}>
                        {customerDetails.map((item) => (
                          <div key={item.vacode}>
                            <text style={{marginLeft:10,fontSize:20}}>{item.city}</text> 
                          </div>
                        ))}
                        </div>
                        </div>
                       </div>
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
                  <thead style={{ backgroundColor: "lightgrey" }}>
                    <tr>
                      <th style={{ border: "1px solid #000", padding: "8px", textAlign: 'center', fontSize: 20, width: 30 }}>Sr.No</th>
                      <th style={{ border: "1px solid #000", padding: "8px", textAlign: 'center', fontSize: 20, width: 400 }}>Description</th>
                      <th style={{ border: "1px solid #000", padding: "8px", textAlign: 'center', fontSize: 20 }}>HSN</th>
                      <th style={{ border: "1px solid #000", padding: "8px", textAlign: 'center', fontSize: 20 }}>PCS</th>
                      <th style={{ border: "1px solid #000", padding: "8px", textAlign: 'center', fontSize: 20 }}>Qty.</th>
                      <th style={{ border: "1px solid #000", padding: "8px", textAlign: 'center', fontSize: 20 }}>Unit</th>
                      <th style={{ border: "1px solid #000", padding: "8px", textAlign: 'center', fontSize: 20 }}>Rate</th>
                      <th style={{ border: "1px solid #000", padding: "8px", textAlign: 'center', fontSize: 20 }}>Amount</th>
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
                        <td style={{ borderRight: "1px solid black", paddingLeft: 10 }}>{item.tariff}</td>
                        <td style={{ borderRight: "1px solid black", paddingLeft: 10 }}>{item.pkgs}</td>
                        <td style={{ borderRight: "1px solid black", paddingLeft: 10 }}>{item.weight}</td>
                        <td style={{ borderRight: "1px solid black", paddingLeft: 10 }}>{item.Units}</td>
                        <td style={{ borderRight: "1px solid black", paddingLeft: 10 }}>{item.rate}</td>
                        <td style={{ borderRight: "1px solid black", textAlign: "right", paddingRight: 10 }}>{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="2" style={{ fontWeight: "bold", fontSize: 18, paddingLeft: 20 }}>TOTAL</td>
                      <td></td>
                      <td></td>
                      <td style={{ fontWeight: "bold", fontSize: 18 }}>{totalQuantity}</td>
                      <td></td>
                      <td style={{ fontWeight: "bold", fontSize: 18, color: "red" }}>Total</td>
                      <td style={{ fontWeight: "bold", fontSize: 18, color: "red", textAlign: "right", paddingRight: 10 }}>{formData.sub_total}</td>
                    </tr>
                  </tfoot>
                </table>
            <div style={{width:"100%",height:160,borderLeft:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",display:'flex',flexDirection:"row"}}>
             <div style={{borderRight:"1px solid black",width:"70%",display:'flex',flexDirection:'column'}}>
                <div style={{display:'flex',flexDirection:'row',marginLeft:10}}>
                    <a style={{fontSize:20}}>Against Bill No.</a>
                    <a style={{fontSize:20,marginLeft:10}}>{formData.vbillno}</a>
                </div>
                <div style={{display:'flex',flexDirection:'row',marginLeft:10}}>
                    <a style={{fontSize:20}}>KANDA:</a>
                    <a style={{fontSize:20,marginLeft:10}}>{formData.rem2}</a>
                </div>
             </div>
             <div style={{borderRight:"1px solid black",width:"18.08%",display:'flex',flexDirection:'column'}}>
                <a style={{fontSize:20,marginLeft:10}}>Approx. Value</a>
                <a style={{fontSize:20,marginLeft:10}}>Approx.CGST 9.00%</a>
                <a style={{fontSize:20,marginLeft:10}}>Approx.SGST 9.00%</a>
                <a style={{fontSize:20,marginLeft:10}}>Approx.IGST</a>
                <a style={{fontSize:20,marginLeft:10,color:'red'}}>Approx. Total</a>
             </div>
             <div style={{width:"11.92%",display:'flex',flexDirection:'column'}}>
                <text style={{fontSize:20,textAlign:'right',paddingRight:10}}>{formData.sub_total} </text>
                <text style={{fontSize:20,textAlign:'right',paddingRight:10}}>{formData.cgst} </text>
                <text style={{fontSize:20,textAlign:'right',paddingRight:10}}>{formData.sgst} </text>
                <text style={{fontSize:20,textAlign:'right',paddingRight:10}}>{formData.igst} </text>
                <text style={{fontSize:20,textAlign:'right',paddingRight:10,color:'red'}}>{formData.grandtotal} </text>
             </div>
            </div>
                {/*  */}
                <div style={{display:"flex",flexDirection:"row",borderLeft:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",height:150}}>
               <div style={{width:"72%",display:'flex',flexDirection:'column',marginTop:10}}>
                <text style={{marginLeft:10,fontSize:18}}>Certified that the goods are transported for weighment purpose at</text>
                <text style={{marginLeft:10,fontSize:18}}>the weighbridge and the tax invoice shall be issued to the above</text>
                <text style={{marginLeft:10,fontSize:18}}>consiignee after completion of weighment (Gross and Tare weight)</text>
               </div>
               <div style={{display:'flex',flexDirection:"column",marginTop:5,marginLeft:40}}>
              <text style={{fontSize:20}}>FOR {companyName}</text>
              <text style={{fontSize:22,marginTop:"15%",marginLeft:20}}>Authorised Signature</text>
               </div>
                </div>
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
  export default InvoiceSaleChallan;