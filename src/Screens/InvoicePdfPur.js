import React, { useRef, useEffect, useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useCompanySetup from './Shared/useCompanySetup';

const InvoicePDFPur = React.forwardRef(({
    formData,
    items,
    supplierdetails,
    isOpen, // Changed from 'open' to 'isOpen'
    handleClose,
    componentRef,   // new
    selectedCopies,
  }, ref) => {

    const { companyName, companyAdd, companyPhn, companyPhn2, companyGST, companyPAN } = useCompanySetup();

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
    const chunks = chunkItems(items, 12 , 15);

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
              borderRadius: "5px",
              boxSizing: "border-box",
              marginTop: 5,
            }}
          >
            {/*  */}
            {selectedCopies.flatMap((copyType, copyIndex) =>
              chunks.map((chunk, pageIndex) => {
                const targetSize = pageIndex === 0 ? 12 : 15;
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
                  <div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      height: 70,
                      marginTop:10,
                      borderTop:"1px solid black",
                      borderLeft:"1px solid black",
                      borderRight:"1px solid black"
                    
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column",marginLeft:5 }}>
                      <p
                        style={{
                          marginBottom: 0,
                          fontWeight: "bold",
                          fontSize: 18,
                          width: 140,
                        }}
                      >
                        GSTIN:{companyGST}
                      </p>
                      <p
                        style={{
                          marginBottom: 0,
                          fontWeight: "bold",
                          fontSize: 18,
                        }}
                      >
                        PAN:{companyPAN}
                      </p>
                    </div>
                    <div
                      style={{
                        marginLeft: "25%",
                        display: "flex",
                        flexDirection: "column",
                        textAlign: "center",
                      }}
                    >
                      <text
                        style={{
                          color: "red",
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 18,
                        }}
                      >
                        REVERSE CHARGES:NO
                      </text>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "28%",
                      }}
                    >
                      {/* <p style={{marginBottom:0,fontWeight:"bold",marginLeft:"23%",fontSize:12}}>Tel: {invoiceData.date}</p> */}
                      <p
                        style={{
                          marginBottom: 0,
                          fontWeight: "bold",
                          fontSize: 18,
                        }}
                      >
                        Tel:{companyPhn}
                      </p>
                      <p
                        style={{
                          marginBottom: 0,
                          fontWeight: "bold",
                          fontSize: 18,
                          marginLeft: 20,
                        }}
                      >
                        {companyPhn2}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: "center", height: 120,marginTop:-20,borderLeft:"1px solid black",
                        borderRight:"1px solid black"}}>
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
                    {/* <p
                      style={{
                        marginBottom: 0,
                        fontWeight: "bold",
                        fontSize: 18,
                        marginLeft: 0,
                        marginTop:-20
                      }}
                    >
                      {description}
                    </p> */}
                    <p
                      style={{
                        marginBottom: 0,
                        fontWeight: "bold",
                        fontSize: 18,
                        marginLeft: 0,
                        marginTop:-15
                      }}
                    >
                      {companyAdd}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    
                    }}
                  >
                    <div style={{display:'flex',flexDirection:'column',border:"1px solid black",width:"40%",backgroundColor:"lightgrey"}}>
                      <div style={{marginTop:20}}>
                      <text style={{marginLeft:"30%",fontSize:30,}}>TAX-INVOICE</text>
                      </div>
                    </div>
                    {/* Invoice No */}
                    <div style={{display:'flex',flexDirection:'column',borderTop:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",width:"30%"}}>
                    <div style={{display:'flex',flexDirection:'row'}}>
                      <text style={{marginLeft:5,fontSize:20}}>Self Invoice No:</text>
                      <text style={{marginLeft:10,fontSize:20}}>{formData.vbillno}</text>
                      </div>
                      <div style={{height:1,backgroundColor:"black",width:"100%"}}></div>
                      <div style={{display:'flex',flexDirection:'row'}}>
                      <text style={{marginLeft:5,fontSize:20}}>Self Invoice Date:</text>
                      <text style={{marginLeft:10,fontSize:20}}>  {formatDate(formData.date)}</text>
                      </div>
                        <div style={{height:1,backgroundColor:"black",width:"100%"}}></div>
                        <div style={{display:'flex',flexDirection:'row'}}>
                      <text style={{marginLeft:5,fontSize:20}}>Payement Mode:</text>
                      <text style={{marginLeft:10,fontSize:20}}>{}</text>
                      </div>
                    </div>
                        {/* Reverse Charges */}
                        <div style={{display:'flex',flexDirection:'column',borderTop:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",width:"30%"}}>
                      <text style={{marginLeft:5,fontSize:20,textAlign:"right",marginRight:10}}>Original for Recipient</text>
                      <div style={{height:1,backgroundColor:"black",width:"100%"}}></div>
                      <text style={{marginLeft:5,fontSize:20,textAlign:"right",marginRight:10}}>Duplicate for Transporter</text>
                      <div style={{height:1,backgroundColor:"black",width:"100%"}}></div>
                      <text style={{ fontSize: 22, marginLeft: "35%" }}>
                        {selectedCopies.length > 0? copyType.replace(/([A-Z])/g, " $1").toUpperCase(): "OFFICE COPY"}
                      </text>
                    </div>
                
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    {/* Details of Receiver (Billed to) */}
                    <div
                      style={{
                        flex: 1,
                        borderRight: "1px solid black",
                        borderLeft: "1px solid black",
                        paddingRight: "20px",
                      }}
                    >
                      {supplierdetails.map((item) => (
                        <div key={item.vacode}>
                          <text
                            style={{
                              marginBottom: 0,
                              fontWeight: "bold",
                              fontSize: 18,
                              marginLeft: "30%",
                              textDecoration:'underline'
                            }}
                          >
                            Details of Services Provider
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
                          <p
                            style={{
                              marginBottom: 0,
                              fontWeight: "bold",
                              fontSize: 20,
                              marginLeft: 10,
                            }}
                          >
                            City: {item.city}{" "}
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
                      {/* Add receiver details here */}
                    </div>
                    {/* Details of Consignee (Shipped to) */}
                    <div
                      style={{
                        flex: 1,
                        borderRight: "1px solid black",
                        paddingRight: "20px",
                      }}
                    >
                      <text>
                      <p
                            style={{
                              marginBottom: 0,
                              fontWeight: "bold",
                              fontSize: 20,
                              marginLeft: 10,
                              marginTop:5
                            }}
                          >
                            Doc No: {formData.vbillno}{" "}
                          </p>
                          <div style={{height:0.5,backgroundColor:'black',width:"104%",marginTop:8}}></div>
                          <p
                            style={{
                              marginBottom: 0,
                              fontWeight: "bold",
                              fontSize: 20,
                              marginLeft: 10,
                              marginTop:5
                            }}
                          >
                            Doc.Date:   {formatDate(formData.date)}
                          </p>
                          <div style={{height:0.5,backgroundColor:'black',width:"104%",marginTop:8}}></div>
                          <p
                            style={{
                              marginBottom: 0,
                              fontWeight: "bold",
                              fontSize: 20,
                              marginLeft: 10,
                              marginTop:5
                            }}
                          >
                            Vehicle No: {formData.trpt}{" "}
                          </p>
                          <div style={{height:1,backgroundColor:'black',width:"104%",marginTop:8}}></div>
                          <p
                            style={{
                              marginBottom: 0,
                              fontWeight: "bold",
                              fontSize: 20,
                              marginLeft: 10,
                              marginTop:5
                            }}
                          >
                            Transporter: {formData.v_tpt}{" "}
                          </p>
                      </text>
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
                                <div style={{display:"flex",flexDirection:"row",borderLeft:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",height:220}}>
                  {/* REMARKS */}
                  <div style={{width:400}}>
                    <div style={{borderBottom:"1px solid black"}}>
                    <text style={{fontSize:20,marginLeft:"40%"}}>Remarks</text>
                    </div>
                    <div style={{marginTop:10}}>
                      <text style={{marginLeft:10}}>{formData.rem2}</text>
                    </div>
                    <div style={{borderTop:"1px solid black",marginTop:120.5,height:34,width:"175%"}}>
                      <text style={{fontSize:16,marginTop:5,color:'red'}}>Rs.InWords:{totalInWords}</text>
                    </div>
                   
                  </div>
                  {/* OTHER DETAILS */}
                  <div style={{width:300}}>
                  <div style={{borderBottom:"1px solid black",borderLeft:"1px solid black"}}>
                    <text style={{fontSize:20,marginLeft:90}}>Other Details</text>
                    </div>
                    <div style={{borderLeft:"1px solid black",height:154.5}}>
                      <div style={{display:'flex',flexDirection:'column',marginLeft:10}}>
                      <text>Labour:{items.Exp1}</text>
                      <text>Postage:{items.Exp1}</text>
                      <text>Discount:{items.Exp1}</text>
                      <text>Freight:{items.Exp1}</text>
                      <text>Expense 5:{items.Exp1}</text>
                      </div>
                      <div style={{height:1,backgroundColor:"black",marginTop:3,display:'flex',flexDirection:'row'}}>
                        <text style={{fontSize:18,marginLeft:10,color:'red'}}>Total GST Rs:</text>
                        <text style={{fontSize:18,marginLeft:20,color:'red'}}>{formData.tax}</text>
                      </div>
                    </div>
                  </div>
                  {/* EXPENSE */}
                  <div style={{display:'flex',flexDirection:"column",borderRight:"1px solid black",borderLeft:"1px solid black",width:180}}>
                  <span style={{fontSize:20,marginLeft:5,fontWeight:500}}>Expenses</span>
                    <div style={{height:1,backgroundColor:"black"}}></div>
                    <span style={{fontSize:20,marginLeft:5,fontWeight:500}}>TaxableValue</span>
                    <div style={{height:1,backgroundColor:"black"}}></div>
                    <span style={{fontSize:20,marginLeft:5,fontWeight:500}}>C.GST@ 9.00%</span>
                    <div style={{height:1,backgroundColor:"black"}}></div>
                    <span style={{fontSize:20,marginLeft:5,fontWeight:500}}>S.GST@ 9.00%</span>
                    <div style={{height:1,backgroundColor:"black"}}></div>
                    <span style={{fontSize:20,marginLeft:5,fontWeight:500}}>I.GST@</span>
                    <div style={{height:1,backgroundColor:"black"}}></div>
                    <span style={{fontSize:20,marginLeft:5,fontWeight:500}}>Others</span>
                    <div style={{height:1,backgroundColor:"black"}}></div>
                    <span style={{fontSize:20,marginLeft:5,fontWeight:500,color:'red'}}>Grand Total</span>
                  </div>
                  <div style={{display:'flex',flexDirection:"column",width:180}}>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10}}>{formData.expafterGST}</text>
                    <div style={{height:1,backgroundColor:"black"}}></div>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10}}>{formData.sub_total}</text>
                    <div style={{height:1,backgroundColor:"black"}}></div>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10}}>{formData.cgst}</text>
                    <div style={{height:1,backgroundColor:"black"}}></div>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10}}>{formData.sgst}</text>
                    <div style={{height:1,backgroundColor:"black"}}></div>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10}}>{formData.igst}</text>
                    <div style={{height:1,backgroundColor:"black"}}></div>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10}}>{formData.exp_before}</text>
                    <div style={{height:1,backgroundColor:"black"}}></div>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10,color:'red'}}>{formData.grandtotal}</text>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"row",borderLeft:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",height:130}}>
               <div style={{width:"50%",borderRight:"1px solid black"}}>
                <text style={{marginLeft:10,fontSize:20,textDecoration:"underline"}}>Our Bank:</text>
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
                {/*  */}
                <div style={{display:"flex",flexDirection:"row",borderLeft:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",height:180}}>
               <div style={{width:"70%",display:'flex',flexDirection:'column'}}>
                <text style={{fontSize:20,textDecoration:'underline',marginLeft:10}}>Terms & Conditions:</text>
                <span style={{marginLeft:10,fontSize:18}}>1.Our responsibility ceases after the goods are removed from our premises.</span>
                <span style={{marginLeft:10,fontSize:18}}>2.Goods once sold are not returnable or exchangeable.</span>
                <span style={{marginLeft:10,fontSize:18}}>3.If the bill is not paid within a week intrest@25% will be charged from the date of bill.</span>
                <span style={{marginLeft:10,fontSize:18}}>Subjected to FATEHGARH SAHIB Jurisdiction Only.</span>
                <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
                  <text style={{fontSize:18,marginLeft:"55%"}}>Signature of Service Provider</text>
                </div>
               </div>
               <div style={{display:'flex',flexDirection:"column",marginTop:10,marginLeft:50}}>
              <text style={{fontSize:20}}>FOR {companyName}</text>
              <text style={{fontSize:18,marginTop:"45%",marginLeft:60}}>Authorised Signature</text>
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
  export default InvoicePDFPur;