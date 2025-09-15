import React, { useRef, useEffect, useState } from 'react';
import { Modal, Box, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useCompanySetup from '../Shared/useCompanySetup';

const InvoiceKaryana = React.forwardRef(({
    formData,
    items,
    customerDetails,
    shipped,
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
    const chunks = chunkItems(items, 12, 15);

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
              borderRadius: "5px",
              boxSizing: "border-box",
              marginTop: 5,
            }}
          >
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
                      <div style={{ display: "flex", flexDirection: "column",height:50,marginLeft:5 }}>
                        <p
                          style={{
                            marginBottom: 0,
                            fontWeight: "bold",
                            fontSize: 20,
                            width: 140,
                          }}
                        >
                          GSTIN:{companyGST}
                        </p>
                        <p
                          style={{
                            marginBottom: 0,
                            fontWeight: "bold",
                            fontSize: 20,
                          }}
                        >
                          PAN:{companyPAN}
                        </p>
                      </div>
                      <div
                        style={{
                          marginLeft: "24%",
                          display: "flex",
                          flexDirection: "column",
                          textAlign: "center",
                          height:50
                        }}
                      >
                        <text
                          style={{
                            color: "black",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 13,
                          }}
                        >
                          Form GST INV -1 ( TAX INVOICE )
                        </text>
                        <text
                          style={{
                            color: "black",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 13,
                          }}
                        >
                          (See Rule 7)
                        </text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: "25%",
                          height:50
                        }}
                      >
                        {/* <p style={{marginBottom:0,fontWeight:"bold",marginLeft:"23%",fontSize:12}}>Tel: {invoiceData.date}</p> */}
                        <p
                          style={{
                            marginBottom: 0,
                            fontWeight: "bold",
                            fontSize: 20,
                          }}
                        >
                          Tel:{companyPhn}
                        </p>
                        <p
                          style={{
                            marginBottom: 0,
                            fontWeight: "bold",
                            fontSize: 20,
                            marginLeft: 20,
                          }}
                        >
                          {companyPhn2}
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "center", height: 120,marginTop:-20,                          borderLeft:"1px solid black",
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
                        // border: "1px solid black",
                        // borderRadius: "5px",
                        display: "flex",
                        flexDirection: "row",    
                      }}
                    >
                      <div style={{display:'flex',flexDirection:'column',border:"1px solid black",width:"40%"}}>
                        <div style={{}}>
                        <text style={{marginLeft:"30%",fontSize:30}}>TAX-INVOICE</text>
                        </div>
                        <div style={{height:1,backgroundColor:"black",width:"100%"}}></div>
                        <text style={{ fontSize: 22, marginLeft: "35%" }}>
                            {selectedCopies.length > 0
                              ? copyType
                                  .replace(/([A-Z])/g, " $1")
                                  .toUpperCase()
                              : "OFFICE COPY"}
                          </text>
                        <div style={{height:1,backgroundColor:"black",width:"100%"}}></div>
                        {/* place of supply */}
                        <div style={{display:'flex',flexDirection:'row',marginTop:5}}>
                        {customerDetails.map((item) => (
                          <div key={item.vacode}>
                            <text style={{marginLeft:5,fontSize:20}}>Place of Supply:</text>
                            <text style={{marginLeft:10,fontSize:20}}>{item.city}</text> 
                          </div>
                        ))}
                        </div>
                      </div>
                      {/* Invoice No */}
                      <div style={{display:'flex',flexDirection:'column',borderTop:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",width:"45%"}}>
                      <div style={{display:'flex',flexDirection:'row'}}>
                        <text style={{marginLeft:5,fontSize:20}}>Invoice No:</text>
                        <text style={{marginLeft:10,fontSize:20}}>{formData.vbillno}</text>
                        </div>
                        <div style={{height:1,backgroundColor:"black",width:"100%"}}></div>
                        <div style={{display:'flex',flexDirection:'row'}}>
                        <text style={{marginLeft:5,fontSize:20}}>Invoice Date:</text>
                        <text style={{marginLeft:10,fontSize:20}}>{formatDate(formData.date)}</text>
                        </div>
                          <div style={{height:1,backgroundColor:"black",width:"100%"}}></div>
                          <div style={{display:'flex',flexDirection:'row'}}>
                        <text style={{marginLeft:5,fontSize:20}}>Vehicle No:</text>
                        <text style={{marginLeft:10,fontSize:20}}>{formData.trpt}</text>
                        </div>
                        <div style={{height:1,backgroundColor:"black",width:"100%"}}></div>
                        <div style={{display:'flex',flexDirection:'row'}}>
                        <text style={{marginLeft:5,fontSize:20}}>Transporter Name:</text>
                        <text style={{marginLeft:10,fontSize:20}}>{formData.v_tpt}</text>
                        </div>
                      </div>
                          {/* Reverse Charges */}
                          <div style={{display:'flex',flexDirection:'column',borderTop:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",width:"30%"}}>
                      <div style={{display:'flex',flexDirection:'row'}}>
                        <text style={{marginLeft:5,fontSize:20}}>Reverse Charges: NO</text>
                        <text style={{marginLeft:10,fontSize:20}}>{}</text>
                        </div>
                        <div style={{height:1,backgroundColor:"black",width:"100%"}}></div>
                        <div style={{display:'flex',flexDirection:'row'}}>
                        <text style={{marginLeft:5,fontSize:20}}>Payement Mode: CREDIT</text>
                        <text style={{marginLeft:10,fontSize:20}}>{}</text>
                        </div>
                          <div style={{height:1,backgroundColor:"black",width:"100%"}}></div>
                          <div style={{display:'flex',flexDirection:'row'}}>
                        <text style={{marginLeft:5,fontSize:20}}>GR No:</text>
                        <text style={{marginLeft:10,fontSize:20}}>{formData.gr}</text>
                        </div>
                        <div style={{height:1,backgroundColor:"black",width:"100%"}}></div>
                       
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
                            <p
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 20,
                                marginLeft: 10,
                              }}
                            >
                              City: {item.shippingcity}{" "}
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
                 <div className='Below'>
                <div style={{display:"flex",flexDirection:"row",borderLeft:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",height:230}}>
                  {/* REMARKS */}
                  <div style={{width:450}}>
                    <div style={{borderBottom:"1px solid black"}}>
                    <text style={{fontSize:20,marginLeft:"40%"}}>Remarks</text>
                    </div>
                    <div style={{marginTop:10,borderBottom:"1px solid black",height:38}}>
                      <text style={{marginLeft:10}}>{formData.rem2}</text>
                    </div>
                    <div style={{display:"flex",flexDirection:"column"}}>
                    <div style={{display:'flex',flexDirection:'row'}}>
                    <div style={{borderRight:'1px solid black',height:"100%",width:"20%"}}>
                      {""}
                    </div>
                    <div style={{borderRight:'1px solid black',height:30,width:"20%"}}>
                        Sale Value
                    </div>
                    <div style={{borderRight:'1px solid black',height:30,width:"20%"}}>
                        C.Gst
                    </div>
                    <div style={{borderRight:'1px solid black',height:30,width:"20%"}}>
                        S.Gst
                    </div>
                    <div style={{height:30,width:"20%"}}>
                        I.Gst
                    </div>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    Sale 5%
                </div>
                    <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                        <text>0</text>
                    </div>
                    <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>0</text>
                    </div>
                    <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>0</text>
                    </div>
                    <div style={{borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>0</text>
                    </div>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    Sale 12%
                </div>
                    <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>0</text>
                    </div>
                    <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>0</text>
                    </div>
                    <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>0</text>
                    </div>
                    <div style={{borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>0</text>
                    </div>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    Sale 18%
                </div>
                    <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>{formData.sub_total}</text>
                    </div>
                    <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>{formData.cgst}</text>
                    </div>
                    <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>{formData.sgst}</text>
                    </div>
                    <div style={{borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>{formData.igst}</text>
                    </div>
                </div>
                <div style={{display:'flex',flexDirection:'row'}}>
                <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    Sale 28%
                </div>
                    <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>0</text>
                    </div>
                    <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>0</text>
                    </div>
                    <div style={{borderRight:'1px solid black',borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>0</text>
                    </div>
                    <div style={{borderTop:'1px solid black',height:30,width:"20%"}}>
                    <text>0</text>
                    </div>
                </div>
                    </div>
                  </div>
                  {/* OTHER DETAILS */}
                  <div style={{width:250}}>
                  <div style={{borderBottom:"1px solid black",borderLeft:"1px solid black"}}>
                    <text style={{fontSize:20,marginLeft:90}}>Other Details</text>
                    </div>
                    {/* Height */}
                    <div style={{borderLeft:"1px solid black",height:"86.5%"}}>
                      <div style={{display:'flex',flexDirection:'column',marginLeft:10}}>
                      <text style={{fontSize:18}}>Labour:{items.Exp1}</text>
                      <text style={{fontSize:18}}>Postage:{items.Exp1}</text>
                      <text style={{fontSize:18}}>Discount:{items.Exp1}</text>
                      <text style={{fontSize:18}}>Freight:{items.Exp1}</text>
                    <text style={{fontSize:18}} >Expense5:</text>
                      </div>
                      <div style={{height:1,backgroundColor:"black",marginTop:3,display:'flex',flexDirection:'row'}}>
                        <text style={{fontSize:18,marginLeft:10,color:'red'}}>Total GST Rs:</text>
                        <text style={{fontSize:18,marginLeft:20,color:'red'}}>{formData.tax}</text>
                      </div>
                    </div>
                  </div>
                  {/* EXPENSE */}
                  <div style={{display:'flex',flexDirection:"column",borderRight:"1px solid black",borderLeft:"1px solid black",width:180}}>
                    <a style={{fontSize:20,marginLeft:5,fontWeight:500}}>Expenses</a>
                    <div style={{height:1,backgroundColor:"black",marginTop:2.5}}></div>
                    <a style={{fontSize:20,marginLeft:5,fontWeight:500}}>TaxableValue</a>
                    <div style={{height:1,backgroundColor:"black",marginTop:2.5}}></div>
                    <a style={{fontSize:20,marginLeft:5,fontWeight:500}}>C.GST@ 9.00%</a>
                    <div style={{height:1,backgroundColor:"black",marginTop:2.5}}></div>
                    <a style={{fontSize:20,marginLeft:5,fontWeight:500}}>S.GST@ 9.00%</a>
                    <div style={{height:1,backgroundColor:"black",marginTop:2.5}}></div>
                    <a style={{fontSize:20,marginLeft:5,fontWeight:500}}>I.GST@</a>
                    <div style={{height:1,backgroundColor:"black",marginTop:2.5}}></div>
                    <a style={{fontSize:20,marginLeft:5,fontWeight:500}}>Others</a>
                    <div style={{height:1,backgroundColor:"black",marginTop:2.5}}></div>
                    <a style={{fontSize:20,marginLeft:5,fontWeight:500,color:'red'}}>Grand Total</a>
                  </div>
                  <div style={{display:'flex',flexDirection:"column",width:180}}>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10}}>{formData.expafterGST}</text>
                    <div style={{height:1,backgroundColor:"black",marginTop:2.5}}></div>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10}}>{formData.sub_total}</text>
                    <div style={{height:1,backgroundColor:"black",marginTop:2.5}}></div>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10}}>{formData.cgst}</text>
                    <div style={{height:1,backgroundColor:"black",marginTop:2.5}}></div>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10}}>{formData.sgst}</text>
                    <div style={{height:1,backgroundColor:"black",marginTop:2.5}}></div>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10}}>{formData.igst}</text>
                    <div style={{height:1,backgroundColor:"black",marginTop:2.5}}></div>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10}}>{formData.exp_before}</text>
                    <div style={{height:1,backgroundColor:"black",marginTop:2.5}}></div>
                    <text style={{fontSize:20,textAlign:"right",marginRight:10,color:'red'}}>{formData.grandtotal}</text>
                  </div>
                </div>
                <div style={{borderBottom:"1px solid black",borderLeft:"1px solid black",borderRight:"1px solid black",marginTop:0,height:34,width:"100%"}}>
                  <text style={{fontSize:17,marginTop:5,color:'red'}}>Rs.(InWords){totalInWords}</text>
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
                {/*  */}
                <div style={{display:"flex",flexDirection:"row",borderLeft:"1px solid black",borderRight:"1px solid black",borderBottom:"1px solid black",height:180}}>
               <div style={{width:"72%",display:'flex',flexDirection:'column'}}>
                <text style={{fontSize:20,textDecoration:'underline',marginLeft:10}}>Terms & Conditions:</text>
                <a style={{marginLeft:10,fontSize:18}}>1.Our responsibility ceases after the goods are removed from our premises.</a>
                <a style={{marginLeft:10,fontSize:18}}>2.Goods once sold are not returnable or exchangeable.</a>
                <a style={{marginLeft:10,fontSize:18}}>3.If the bill is not paid within a week intrest@25% will be charged from the date of bill.</a>
                <a style={{marginLeft:10,fontSize:18}}>Subjected to FATEHGARH SAHIB Jurisdiction Only.</a>
                <div style={{display:'flex',flexDirection:'row',marginTop:5}}>
                  <text style={{fontSize:22,marginLeft:15}}>E.& O.E</text>
                  <text style={{fontSize:22,marginLeft:"42%"}}>Checked/Prepared by</text>
                </div>
               </div>
               <div style={{display:'flex',flexDirection:"column",marginTop:30,marginLeft:40}}>
              <text style={{fontSize:20}}>FOR {companyName}</text>
              <text style={{fontSize:22,marginTop:"33%",marginLeft:20}}>Authorised Signature</text>
               </div>
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
  export default InvoiceKaryana;