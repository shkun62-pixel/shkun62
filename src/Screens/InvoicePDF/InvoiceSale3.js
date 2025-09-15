import React, { useRef, useEffect, useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import logo from './/logo.jpg';
import qrcode from './/qrcode.png'
import useCompanySetup from '../Shared/useCompanySetup';

const InvoiceSale3 = React.forwardRef(({
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
      setTotalQuantity(total.toFixed(2));
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
             
            }}
          >
            {/* <text style={{fontSize:30,marginLeft:"42%"}}>TAX-INVOICE</text>
            <span style={{fontSize:20,marginLeft:"28%"}}>OFFICE COPY</span> */}
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
                <div style={{marginTop:20}}>
                <text style={{fontSize:30,marginLeft:"42%"}}>TAX-INVOICE</text>
                <text style={{ fontSize: 20, marginLeft: "28%"}}>
                  {selectedCopies.length > 0 ? copyType.replace(/([A-Z])/g, " $1").toUpperCase(): "OFFICE COPY"}
                </text>
                </div>
                 <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        height: 510,
                    //   backgroundColor:'yellow',
                      borderLeft:"1px solid black",
                       borderRight:"1px solid black",
                        borderTop:"1px solid black",
                      }}
                    >

                      <div style={{ display: 'flex', flexDirection: 'row', height: 190, justifyContent: 'space-between', alignItems: 'center' }}>
                        {/* Logo */}
                        <div style={{ display: 'flex' }}>
                          <img src={logo} alt="Logo" style={{ width: '140px', height: '140px', borderRadius: "50%" }} />
                        </div>
                        {/* Company Info */}
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                          <div
                            style={{
                              fontSize: 50,
                              fontWeight: "600",
                              fontFamily: "serif",
                              color: 'darkblue',
                              marginLeft: 10
                            }}
                          >
                            {companyName}
                          </div>
                          <span style={{ fontSize: 20, marginTop: -20 }}>{companyDesc}</span>
                          <span style={{ fontSize: 20 }}>{companyAdd}</span>
                          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                            <span style={{ fontSize: 20 }}>GSTIN: {companyGST}</span>
                            <span style={{ fontSize: 20, marginLeft: 20 }}>PAN: {companyPAN}</span>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', marginTop: 5 }}>
                            <span style={{ fontSize: 20 }}>Ph No: {companyPhn}</span>
                            <span style={{ fontSize: 20, marginLeft: 20 }}>Email: {companyEmail}</span>
                          </div>
                        </div>
                        {/* QR Code */}
                        <div style={{ display: 'flex' }}>
                          <img src={qrcode} alt="QR Code" style={{ width: '150px', height: '150px', marginRight: 10, marginTop:5 }} />
                        </div>
                      </div>
                      <div style={{height:380,borderTop:"1px solid black",display:'flex',flexDirection:"row"}}>
                      <div style={{width:"50%",height:"100%",borderRight:"1px solid black",display:'flex',flexDirection:'column'}}>
                        <div style={{borderBottom:"1px solid black",height:"25%"}}>
                            <text style={{fontSize:20,marginLeft:10}}>Invoice No. {formData.vbillno}</text>
                        </div>
                        <div style={{borderBottom:"1px solid black",height:"25%"}}>
                            <text style={{fontSize:20,marginLeft:10}}>Invoice Date. {formatDate(formData.date)}</text>
                        </div>
                        <div style={{borderBottom:"1px solid black",height:"25%"}}>
                            <text style={{fontSize:20,marginLeft:10}}>Vehicle No. {formData.trpt}</text>
                        </div>
                        <div style={{height:"25%"}}>
                            <text style={{fontSize:20,marginLeft:10}}>Transporter Name. {formData.v_tpt}</text>
                        </div>
                        </div>
                        <div style={{width:"50%",display:'flex',flexDirection:"column"}}>
                            <div style={{display:'flex',flexDirection:'row',color:'red'}}>
                                <span style={{fontSize:20,marginLeft:10}}>EWB NO.</span>
                                <text style={{fontSize:20,marginLeft:10}}>31185669823</text>
                            </div>
                            <div style={{display:'flex',flexDirection:'row',color:'red'}}>
                                <span style={{fontSize:20,marginLeft:10}}>Valid Upto.</span>
                                <text style={{fontSize:20,marginLeft:10}}>25/11/2024</text>
                            </div>
                            <div style={{display:'flex',flexDirection:'row',color:'red'}}>
                                <span style={{fontSize:20,marginLeft:10}}>IRN:</span>
                                <text style={{fontSize:20,marginLeft:10}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor</text>
                            </div>
                        </div>
                      </div>
                        <div style={{borderTop:"1px solid black",height:40,color:'red'}}>
                          <text style={{fontSize:20,marginLeft:10}}>Ack No.</text>
                          <text style={{fontSize:20,marginLeft:5}}>88995666226633</text>
                          <text style={{fontSize:20,marginLeft:"20%"}}>Ack Dt.</text>
                          <text style={{fontSize:20,marginLeft:5}}>21/11/2024</text>
                          <text style={{fontSize:20,marginLeft:"20%"}}>Distance Km.</text>
                          <text style={{fontSize:20,marginLeft:5}}>250</text>
                        </div>
                      <div style={{height:160,borderTop:"1px solid black",display:'flex',flexDirection:"row"}}>
                      {/* Billed To */}
                      <div style={{width:"50%",borderRight:"1px solid black"}}>
                      {customerDetails.map((item) => (
                          <div key={item.vacode}>
                            <text
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 18,
                                marginLeft: "30%",
                                textDecoration:"underline"
                              }}
                            >
                              Details of Receiver (Billed to)
                            </text>
                            <p
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 20,
                                marginLeft: 10,
                              }}
                            >
                              Name: {item.vacode}{" "}
                            </p>
                            <p
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 20,
                                marginLeft: 10,
                              }}
                            >
                              Address: {item.Add1}{" "}
                            </p>
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <p
                                style={{
                                  marginBottom: 0,
                                  fontWeight: "bold",
                                  fontSize: 20,
                                  marginLeft: 10,
                                }}
                              >
                                City: {item.city}{" ,"}
                              </p>
                              <p
                                style={{
                                  marginBottom: 0,
                                  fontWeight: "bold",
                                  fontSize: 20,
                                  marginLeft: 10,
                                }}
                              >
                                State: {item.state}{" "}
                              </p>
                            </div>
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <p
                                style={{
                                  marginBottom: 0,
                                  fontWeight: "bold",
                                  fontSize: 20,
                                  marginLeft: 10,
                                }}
                              >
                                GSTIN: {item.gstno}{" "}
                              </p>
                              <p
                                style={{
                                  marginBottom: 0,
                                  fontWeight: "bold",
                                  fontSize: 20,
                                  marginLeft: 10,
                                }}
                              >
                                PAN: {item.pan}{" "}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Shipped to */}
                        <div style={{width:"50%"}}>
                        {shipped.map((item) => (
                          <div key={item.shippedto}>
                            <text
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 18,
                                marginLeft: "18%",
                                textDecoration:"underline"
                              }}
                            >
                              Details of Consignee ( Shipped to )
                            </text>
                            <p
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 20,
                                marginLeft: 10,
                              }}
                            >
                              Name: {item.shippedto}{" "}
                            </p>
                            <p
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 20,
                                marginLeft: 10,
                              }}
                            >
                              Address: {item.shippingAdd}{" "}
                            </p>
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <p
                                style={{
                                  marginBottom: 0,
                                  fontWeight: "bold",
                                  fontSize: 20,
                                  marginLeft: 10,
                                }}
                              >
                                City: {item.shippingcity}{" ,"}
                              </p>
                              <p
                                style={{
                                  marginBottom: 0,
                                  fontWeight: "bold",
                                  fontSize: 20,
                                  marginLeft: 10,
                                }}
                              >
                                State: {item.shippingState}{" "}
                              </p>
                            </div>
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <p
                                style={{
                                  marginBottom: 0,
                                  fontWeight: "bold",
                                  fontSize: 20,
                                  marginLeft: 10,
                                }}
                              >
                                GSTIN: {item.shippingGst}{" "}
                              </p>
                              <p
                                style={{
                                  marginBottom: 0,
                                  fontWeight: "bold",
                                  fontSize: 20,
                                  marginLeft: 10,
                                }}
                              >
                                PAN: {item.shippingPan}{" "}
                              </p>
                            </div>
                          </div>
                        ))}
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
                <div style={{display:"flex",flexDirection:"column",borderLeft:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",height:245}}>
                  {/* Taxable */}
                 <div style={{width:"100%",display:'flex',flexDirection:'row'}}>
                  <div  style={{width:"15%",height:90,display:'flex',flexDirection:"column",borderRight:"1px solid black"}}>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center'}}>
                      <span style={{fontSize:20}}>Taxable</span>
                    </div>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center'}}>
                    <span style={{fontSize:20}}>Amount</span>
                    </div>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center'}}>
                      <text style={{fontSize:20}}>{formData.sub_total}</text>
                    </div>
                  </div>
                  {/* CGST */}
                  <div  style={{width:"20%",height:90,display:'flex',flexDirection:"column",borderRight:"1px solid black"}}>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center'}}>
                      <span style={{fontSize:20}}>CGST</span>
                    </div>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center',display:'flex',flexDirection:'row'}}>
                  <div style={{borderRight:'1px solid black',width:"40%"}}>
                    <span style={{fontSize:20}}>Rate</span>
                  </div>
                  <div style={{width:"70%"}}>
                    <span style={{fontSize:20}}>Amount</span>
                  </div>
                    </div>
                    <div style={{borderBottom:"1px solid black",height:30,display:'flex',flexDirection:'row',textAlign:'center'}}>
                    <div style={{borderRight:'1px solid black',width:"40%"}}>
                    <text style={{fontSize:20}}>9.00%</text>
                  </div>
                  <div style={{width:"70%"}}>
                    <text style={{fontSize:20}}>{formData.cgst}</text>
                  </div>
                    </div>
                  </div>
                  {/* SGST */}
                  <div  style={{width:"20%",height:90,display:'flex',flexDirection:"column",borderRight:"1px solid black"}}>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center'}}>
                      <span style={{fontSize:20}}>SGST</span>
                    </div>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center',display:'flex',flexDirection:'row'}}>
                  <div style={{borderRight:'1px solid black',width:"40%"}}>
                    <span style={{fontSize:20}}>Rate</span>
                  </div>
                  <div style={{width:"70%"}}>
                    <span style={{fontSize:20}}>Amount</span>
                  </div>
                    </div>
                    <div style={{borderBottom:"1px solid black",height:30,display:'flex',flexDirection:'row',textAlign:'center'}}>
                    <div style={{borderRight:'1px solid black',width:"40%"}}>
                    <text style={{fontSize:20}}>9.00%</text>
                  </div>
                  <div style={{width:"70%"}}>
                    <text style={{fontSize:20}}>{formData.sgst}</text>
                  </div>
                    </div>
                  </div>
                  {/* IGST */}
                  <div  style={{width:"20%",height:90,display:'flex',flexDirection:"column",borderRight:"1px solid black"}}>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center'}}>
                      <span style={{fontSize:20}}>IGST</span>
                    </div>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center',display:'flex',flexDirection:'row'}}>
                  <div style={{borderRight:'1px solid black',width:"40%"}}>
                    <span style={{fontSize:20}}>Rate</span>
                  </div>
                  <div style={{width:"70%"}}>
                    <span style={{fontSize:20}}>Amount</span>
                  </div>
                    </div>
                    <div style={{borderBottom:"1px solid black",height:30,display:'flex',flexDirection:'row',textAlign:'center'}}>
                    <div style={{borderRight:'1px solid black',width:"40%"}}>
                    <text style={{fontSize:20}}>9.00%</text>
                  </div>
                  <div style={{width:"70%"}}>
                    <text style={{fontSize:20}}>{formData.igst}</text>
                  </div>
                    </div>
                  </div>
                  {/* Others */}
                  <div  style={{width:"15%",height:90,display:'flex',flexDirection:"column",borderRight:"1px solid black"}}>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center'}}>
                      <span style={{fontSize:20}}>Others</span>
                    </div>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center'}}>
                    <span style={{fontSize:20}}>Amount</span>
                    </div>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center'}}>
                      <text style={{fontSize:20}}>{formData.exp_before}</text>
                    </div>
                  </div>
                  {/* GrandTotal */}
                  <div  style={{width:"15%",height:90,display:'flex',flexDirection:"column"}}>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center'}}>
                      <span style={{fontSize:20}}>Expense</span>
                    </div>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center'}}>
                    <span style={{fontSize:20}}>Amount</span>
                    </div>
                    <div style={{borderBottom:"1px solid black",height:30,textAlign:'center'}}>
                      <text style={{fontSize:20}}>{formData.expafterGST}</text>
                    </div>
                  </div>
                  </div>
                  {/* OTHER DETAILS */}
                  <div style={{display:"flex",flexDirection:'row',height:'100%'}}>
                    <div style={{width:"45%",borderRight:"1px solid black",padding:10}}>
                      <text style={{fontSize:20}}>Remarks: {formData.rem2}</text>
                    </div>
                    {/* Labour */}
                    <div style={{display:'flex',flexDirection:'column',width:"25%",height:"100%",marginLeft:10,borderRight:"1px solid"}}>
                  <span style={{fontSize:20}}>Labour:</span>
                  <span style={{fontSize:20}}>Postage:</span>
                  <span style={{fontSize:20}}>Discount:</span>
                  <span style={{fontSize:20}}>Freight:</span>
                  <span style={{fontSize:20}}>Expense5:</span>
                  </div>
                  {/* sd */}
                  <div style={{display:'flex',flexDirection:'column',width:"30%",height:"100%"}}>
                    <div style={{width:'100%',borderBottom:'1px solid black'}}>
                      <text style={{fontSize:18,color:'red',textAlign:'center',marginLeft:5}}>Total Tax: {formData.tax}</text>
                    </div>
                    <div style={{width:'100%',borderBottom:'1px solid black'}}>
                      <text style={{fontSize:18,color:'red',marginLeft:5}}>Grand Total: {formData.grandtotal}</text>
                    </div>
                  </div>
                  </div>
                  {/* EXPENSE */}
                </div>
                <div style={{height:30,borderRight:"1px solid black",borderLeft:"1px solid black",borderBottom:"1px solid black"}}>
                  <text style={{fontSize:20,color:'red'}}>Rs.(InWords):{totalInWords}</text>
                </div>
                <div style={{display:"flex",flexDirection:"row",borderLeft:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",height:120}}>
               <div style={{width:"50%",borderRight:"1px solid black"}}>
                <text style={{marginLeft:10,fontSize:17,textDecoration:"underline"}}>Our Bank:</text>
                <text style={{fontSize:16,marginLeft:20}}>{companyName}</text>
                <div style={{display:'flex',flexDirection:'column'}}>
                <text style={{fontSize:16,marginLeft:"24%"}}>A/C No.5022334421341</text>
                <text style={{fontSize:16,marginLeft:"24%"}}>IFSC.HDFC0002763</text>
                <text style={{fontSize:16,marginLeft:"24%"}}>BANK-HDFC BANK LTD</text>
                <text style={{fontSize:16,marginLeft:"24%"}}>MANDI GOBINDGARH</text>
                </div>
               </div>
               <div style={{display:'flex',flexDirection:"column",marginTop:20,textAlign:'center',marginLeft:40}}>
                <text style={{fontSize:20}}>Received the above goods in good conditions,</text>
                <text  style={{fontSize:20}}>Rate & Weight of this bill found correct</text>
               </div>
                </div>
                {/* Terms and Conditons  */}
                <div style={{display:"flex",flexDirection:"row",borderLeft:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",height:180}}>
               <div style={{width:"72%",display:'flex',flexDirection:'column'}}>
                <text style={{fontSize:20,textDecoration:'underline',marginLeft:10}}>Terms & Conditions:</text>
                <span style={{marginLeft:10,fontSize:18}}>1.Our responsibility ceases after the goods are removed from our premises.</span>
                <span style={{marginLeft:10,fontSize:18}}>2.Goods once sold are not returnable or exchangeable.</span>
                <span style={{marginLeft:10,fontSize:18}}>3.If the bill is not paid within a week intrest@25% will be charged from the date of bill.</span>
                <span style={{marginLeft:10,fontSize:18}}>Subjected to FATEHGARH SAHIB Jurisdiction Only.</span>
                <div style={{display:'flex',flexDirection:'row',marginTop:5,width:'138%',justifyContent:'space-between'}}>
                  <text style={{fontSize:22,marginLeft:10}}>E.& O.E</text>
                  <text style={{fontSize:22,marginLeft:70}}>Checked/Prepared by</text>
                  <text style={{fontSize:22,marginLeft:20,marginRight:10}}>Authorised Signature</text>
                </div>
               </div>
               <div style={{display:'flex',flexDirection:"column",marginTop:30,marginLeft:40}}>
              <text style={{fontSize:20}}>FOR {companyName}</text>
             
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
  export default InvoiceSale3;