// import React,{useState,useEffect} from 'react'
// import { Button } from 'react-bootstrap';
// import AccountWiseSummPur from './IncomeTaxReports/PurchaseReports/AccountWiseSummPur';

// const Example = () => {
//   const [openPurRep, setopenPurRep] = useState(false);

//     useEffect(() => {
//     // Auto open the modal when component mounts
//     setopenPurRep(true);
//   }, []);

//   return (
//     <div>
//       {/* <Button onClick={() => setopenPurRep(true)}>Open Pur Report</Button> */}
//       <AccountWiseSummPur 
//         show={openPurRep} 
//         onClose={() => setopenPurRep(false)} 
//       />
//     </div>
//   )
// }

// export default Example


// import React, { useState, useEffect } from 'react';
// import InputMask from "react-input-mask";
// import financialYear from './Shared/financialYear';

// const Example = () => {
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setFromDate(formatDate(fy.start)); // converted
//     setToDate(formatDate(fy.end));     // converted
//   }, []);

//   return (
//     <div>
//       <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
//         <label className="form-label" style={{ width: "120px" }}>From Date</label>
//         <InputMask
//           mask="99-99-9999"
//           placeholder="dd-mm-yyyy"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//         >
//           {(inputProps) => <input {...inputProps} className="form-control" />}
//         </InputMask>
//       </div>

//       <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
//         <label className="form-label" style={{ width: "120px"}}>To Date</label>
//         <InputMask
//           mask="99-99-9999"
//           placeholder="dd-mm-yyyy"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//         >
//           {(inputProps) => <input {...inputProps} className="form-control" />}
//         </InputMask>
//       </div>
//     </div>
//   );
// };

// export default Example;

// import React,{useEffect} from 'react'
// import { useNavigate, useLocation } from "react-router-dom";

// const Example = () => {
//     const location = useLocation();
//     const saleId = location.state?.saleId;
//     const navigate = useNavigate();

// useEffect(() => {
//   const handleEsc = (e) => {
//     if (e.key === "Escape") {
//       navigate(-1, {
//         state: {
//           keepModalOpen: true,
//           accountName: location.state?.accountName,
//         },
//         replace: true,
//       });
//     }
//   };

//   window.addEventListener("keyup", handleEsc);
//   return () => window.removeEventListener("keyup", handleEsc);
// }, [navigate, location.state]);


//   return (
//     <div>
//       <h1>{saleId}</h1>
//     </div>
//   )
// }

// export default Example


// import React,{useState,useRef,useEffect} from 'react'
// import ProductModal from './Modals/ProductModal';
// import { Table,Button } from 'react-bootstrap';

// const Example = () => {
//   const tenant = "shkun_05062025_05062026";
//   const createEmptyRow = (id) => ({
//     id,
//     vcode: "",
//     sdisc: "",
//     Units: "",
//     pkgs: "0.00",
//     weight: "0.00",
//     rate: "0.00",
//     amount: "0.00",
//     disc: 0,
//     discount: "",
//     gst: 0,
//     Pcodes01: "",
//     Pcodess: "",
//     Scodes01: "",
//     Scodess: "",
//     Exp_rate1: 0,
//     Exp_rate2: 0,
//     Exp_rate3: 0,
//     Exp_rate4: 0,
//     Exp_rate5: 0,
//     Exp1: 0,
//     Exp2: 0,
//     Exp3: 0,
//     Exp4: 0,
//     Exp5: 0,
//     exp_before: 0,
//     RateCal: "",
//     Qtyperpc: 0,
//     ctax: "0.00",
//     stax: "0.00",
//     itax: "0.00",
//     tariff: "",
//     vamt: "0.00",
//   });

//   const [items, setItems] = useState([
//     {
//       id: 1,
//       vcode: "",
//       sdisc: "",
//       Units: "",
//       pkgs: "0.00",
//       weight: "0.00",
//       rate: "0.00",
//       amount: "0.00",
//       disc: 0,
//       discount: "",
//       gst: 0,
//       Pcodes01: "",
//       Pcodess: "",
//       Scodes01: "",
//       Scodess: "",
//       Exp_rate1: 0,
//       Exp_rate2: 0,
//       Exp_rate3: 0,
//       Exp_rate4: 0,
//       Exp_rate5: 0,
//       Exp1: 0,
//       Exp2: 0,
//       Exp3: 0,
//       Exp4: 0,
//       Exp5: 0,
//       exp_before: 0,
//       RateCal: "",
//       Qtyperpc: 0,
//       ctax: "0.00",
//       stax: "0.00",
//       itax: "0.00",
//       tariff: "",
//       vamt: "0.00",
//     },
//   ]);
//   useEffect(() => {
//   setItems([
//     createEmptyRow(1),
//     createEmptyRow(2),
//     createEmptyRow(3),
//     createEmptyRow(4),
//   ]);
// }, []);

  
//     React.useEffect(() => {
//       // Fetch products from the API when the component mounts
//       fetchProducts();
//     }, []);
  
//     const fetchProducts = async (search = "") => {
//       setLoading(true);
//       try {
//         const response = await fetch(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/stockmaster?search=${encodeURIComponent(search)}`
//         );
//         if (!response.ok) throw new Error("Failed to fetch products");
//         const data = await response.json();
//         const flattenedData = data.data.map((item) => ({
//           ...item.formData,
//           _id: item._id,
//         }));
//         setProducts(flattenedData);
//       } catch (error) {
//         setError(error.message);
//       }
//       setLoading(false);
//     };
  
//     const capitalizeWords = (str) => {
//       return str.replace(/\b\w/g, (char) => char.toUpperCase());
//     };
  
//     // Modal For Items
//     const [products, setProducts] = useState([]);
//     const [showModal, setShowModal] = useState(false);
//     const [selectedProduct, setSelectedProduct] = useState(null);
//     const [selectedItemIndex, setSelectedItemIndex] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const handleItemChange = (index, key, value, field) => {
//       const updatedItems = [...items];
//       if (["sdisc"].includes(key)) {
//         updatedItems[index][key] = capitalizeWords(value);  
//       } else {
//         updatedItems[index][key] = value;
//       }
//       if (key === "name") {
//         const selectedProduct = products.find(
//           (product) => product.Aheads === value
//         );
//         if (selectedProduct) {
//           updatedItems[index]["vcode"] = selectedProduct.Acodes;
//           updatedItems[index]["sdisc"] = selectedProduct.Aheads;
//         } else {
//           updatedItems[index]["rate"] = ""; // Reset price if product not found
//           updatedItems[index]["gst"] = ""; // Reset gst if product not found
//         }
//       }
//       setItems(updatedItems);
//     };
  
//     // Function to handle adding a new item
//     const handleAddItem = () => {
//         const newItem = {
//           id: items.length + 1,
//           vcode: "",
//           sdisc: "",
//           Units: "",
//           pkgs: 0,
//           weight: 0,
//           rate: 0,
//           amount: 0,
//           disc: 0,
//           discount: "",
//           gst: 0,
//           Pcodes01: "",
//           Pcodess: "",
//           Scodes01: "",
//           Scodess: "",
//           Exp_rate1: "" || 0,
//           Exp_rate2: "" || 0,
//           Exp_rate3: "" || 0,
//           Exp_rate4: "" || 0,
//           Exp_rate5: "" || 0,
//           Exp1: 0,
//           Exp2: 0,
//           Exp3: 0,
//           Exp4: 0,
//           Exp5: 0,
//           exp_before: 0,
//           ctax: 0,
//           stax: 0,
//           itax: 0,
//           tariff: "",
//           vamt: 0,
//         };
//         setItems((prevItems) => [...prevItems, newItem]);
//     };
  
//   const handleProductSelect = (product) => {
//       if (selectedItemIndex !== null) {
//         handleItemChange(selectedItemIndex, "name", product.Aheads);
//         setShowModal(false);
//       }
//   };
  
//     const handleModalDone = (product) => {
//       if (product) {
//         handleProductSelect(product);
//       }
//       setShowModal(false);
//       fetchProducts();
//     };
  
//     const openModalForItem = (index) => {
//         setSelectedItemIndex(index);
//         setShowModal(true);
//     };
  
//   const allFields = products.length ? Object.keys(products[0])
//   : ["Aheads", "Pcodes01", "UOM", "GST"]; // fallback/default fields
//   const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
//   const tableContainerRef = useRef(null);
//   const itemCodeRefs = useRef([]);
//   const desciptionRefs = useRef([]);
//   const peciesRefs = useRef([]);
//   const quantityRefs = useRef([]);
//   const priceRefs = useRef([]);
//   const amountRefs = useRef([]);
//   const hsnCodeRefs = useRef([]);
//   const fieldOrder = [
//   { name: "vcode",      refArray: itemCodeRefs },
//   { name: "sdisc",      refArray: desciptionRefs },
//   { name: "tariff",     refArray: hsnCodeRefs },
//   { name: "pkgs",       refArray: peciesRefs },
//   { name: "weight",     refArray: quantityRefs },
//   { name: "rate",       refArray: priceRefs },
//   { name: "amount",     refArray: amountRefs },
// ];

// const focusRef = (refArray, rowIndex) => {
//   const el = refArray?.current?.[rowIndex];
//   if (el) {
//     el.focus();
//     // Safely call select if available
//     setTimeout(() => el.select && el.select(), 0);
//     return true;
//   }
//   return false;
// };
// const focusScrollRow = (refArray, rowIndex) => {
//   const inputEl = refArray?.current?.[rowIndex];
//   const container = tableContainerRef.current;

//   if (!inputEl || !container) return;

//   inputEl.focus();
//   setTimeout(() => inputEl.select && inputEl.select(), 0);

//   const rowEl = inputEl.closest("tr");
//   if (!rowEl) return;

//   const rowTop = rowEl.offsetTop;
//   const rowHeight = rowEl.offsetHeight;
//   const containerHeight = container.clientHeight;

//   container.scrollTop =
//     rowTop - containerHeight + rowHeight + 40;
// };

// const isRowFilled = (row) => {
//   return (row.sdisc || "").trim() !== "";
// };
// const canEditRow = (rowIndex) => {
//   // First row is always editable
//   if (rowIndex === 0) return true;

//   // ALL rows above must be filled
//   for (let i = 0; i < rowIndex; i++) {
//     if (!isRowFilled(items[i])) {
//       return false;
//     }
//   }
//   return true;
// };

// const handleKeyDown = (event, index, field) => {
//   if (event.key === "Enter" || event.key === "Tab") {
//     event.preventDefault();
//     if (field === "vcode") {
//       if ((items[index].sdisc || "").trim() === "") {
//         alert("Please enter Description before Item Code.");
//       } else {
//         focusRef(desciptionRefs, index);
//       }
//       return;
//     }
//     if (field === "amount") {
//       const isLastRow = index === items.length - 1;

//     if (isLastRow) {
//       handleAddItem();

//       setTimeout(() => {
//         focusScrollRow(itemCodeRefs, index + 1);
//       }, 0);
//     }
//  else {
//         focusScrollRow(itemCodeRefs, index + 1);
//       }
//       return;
//     }
//     const currentPos = fieldOrder.findIndex((f) => f.name === field);

//     if (currentPos !== -1) {
//       for (let i = currentPos + 1; i < fieldOrder.length; i++) {
//         const nextField = fieldOrder[i];
//         // Only move if that ref exists for this row (means column is visible)
//         if (focusRef(nextField.refArray, index)) {
//           return;
//         }
//       }
//     }
//     return;
//   }
//   else if (/^[a-zA-Z]$/.test(event.key) && field === "vcode") {
//     setPressedKey(event.key);
//     openModalForItem(index);
//     event.preventDefault();
//   }
// };

//   return (
//     <div>
//       <div ref={tableContainerRef} style={{marginTop:5}} className="TableContainer">
//         <Table className="custom-table">
//           <thead
//             style={{
//               textAlign: "center",
//               position: "sticky",
//               top: 0,
//             }}
//           >
//             <tr style={{ color: "#575a5a" }}>
//               <th>ITEMCODE</th>
//               <th>DESCRIPTION</th>
//               <th>HSNCODE</th>
//               <th>PCS</th>
//               <th>QTY</th>
//               <th>RATE</th>
//               <th>AMOUNT</th>
//             </tr>
//           </thead>
//           <tbody>
//             {items.map((item, index) => (
//               <tr key={item.id}>
//                 <td style={{ padding: 0, width: 30 }}>
//                   <input
//                   disabled={!canEditRow(index)}
//                     className="ItemCode"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                     }}
//                     type="text"
//                     value={item.vcode}
//                     readOnly
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "vcode");
//                     }}
//                     ref={(el) => (itemCodeRefs.current[index] = el)}
//                   />
//                 </td>
//                 <td style={{ padding: 0, width: 300 }}>
//                   <input
//                   disabled={!canEditRow(index)}
//                     className="desc"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                     }}
//                     maxLength={48}
//                     value={item.sdisc}
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "sdisc");
//                     }}
//                       ref={(el) => (desciptionRefs.current[index] = el)}
//                   />
//                 </td>
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Hsn"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     value={item.tariff}
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "tariff");
//                     }}
//                       ref={(el) => (hsnCodeRefs.current[index] = el)}
//                   />
//                 </td>   
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="PCS"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     value={item.pkgs} // Show raw value during input
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "pkgs");
//                     }}
//                       ref={(el) => (peciesRefs.current[index] = el)}
//                   />
//                 </td>       
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="QTY"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     value={item.weight} // Show raw value during input
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "weight");
//                     }}
//                       ref={(el) => (quantityRefs.current[index] = el)}
//                   />
//                 </td>        
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Price"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     value={item.rate} // Show raw value during input
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "rate");
//                     }}
//                       ref={(el) => (priceRefs.current[index] = el)}
//                   />
//                 </td>            
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Amount"
//                     style={{
//                       height: 40,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     value={item.amount}
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "amount");
//                     }}
//                       ref={(el) => (amountRefs.current[index] = el)}
//                   />
//                 </td>      
//               </tr>
//             ))}
//           </tbody>
//           <tfoot style={{ background: "#f0f0f0", position: "sticky", bottom: -6,borderTop:"1px solid black" }}>
//           <tr style={{ fontWeight: "bold", textAlign: "right" }}>
//               <td></td>
//               <td>TOTAL</td>
//               <td></td>
//               <td>{items.reduce((sum, item) => sum + parseFloat(item.pkgs || 0), 0).toFixed(3)}</td>
//               <td>{items.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0).toFixed(3)}</td>
//               <td></td>
//               <td>{items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2)}</td>
//           </tr>
//           </tfoot>

//         </Table>
//       </div>
//           <Button onClick={handleAddItem}>ADD</Button>
//       {showModal && (
//       <ProductModal
//         products={products}
//         allFields={allFields}
//         onSelect={handleProductSelect}
//         onClose={handleModalDone}
//         tenant={tenant}
//         initialKey={pressedKey}
//         fetchParentProducts={fetchProducts}
//       />
//       )}
//     </div>
//   )
// }

// export default Example


import React,{useState, forwardRef, useEffect} from 'react'
import DatePicker from "react-datepicker";
import InputMask from "react-input-mask";
import { ToastContainer, toast } from "react-toastify";
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const MaskedInput = forwardRef(({ value, onChange, onBlur }, ref) => (
  <InputMask
    mask="99-99-9999"
    maskChar="_"
    value={value}
    onChange={onChange}
    onBlur={onBlur}
  >
    {(inputProps) => <input {...inputProps} ref={ref} className="DatePICKER" />}
  </InputMask>
));

const Example = () => {

  const location = useLocation();
  const purId = location.state?.purId;
  const [selectedDate, setSelectedDate] = useState(new Date());
   const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [index, setIndex] = useState(0);
  const [formData, setFormData] = useState({
    date: "",
    grandtotal: 0,
  });
  // useEffect(() => {
  //   if (formData.date) {
  //     try {
  //       let date;

  //       // Check for dd/mm/yyyy
  //       if (/^\d{2}\/\d{2}\/\d{4}$/.test(formData.date)) {
  //         const [day, month, year] = formData.date.split("/").map(Number);
  //         date = new Date(year, month - 1, day); // JS months are 0-based
  //       } else {
  //         // Otherwise try normal parsing (ISO etc.)
  //         date = new Date(formData.date);
  //       }

  //       if (!isNaN(date.getTime())) {
  //         setSelectedDate(date);
  //       } else {
  //         console.error("Invalid date value:", formData.date);
  //       }
  //     } catch (error) {
  //       console.error("Error parsing date:", error);
  //     }
  //   } else {
  //     setSelectedDate(null);
  //   }
  // }, [formData.date]);
  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split("T")[0];
      setFormData((prev) => ({
        ...prev,
        date: date,
      }));
    }
  };

  // ✅ Separate function to validate future or past date
  const validateDate = (date) => {
    if (!date) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize today

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0); // normalize selected date

    if (checkDate > today) {
      toast.info("You Have Selected a Future Date.", {
        position: "top-center",
      });
    } else if (checkDate < today) {
      toast.info("You Have Selected a Past Date.", {
        position: "top-center",
      });
    }
  };

  const handleCalendarClose = () => {
    // If no date is selected when the calendar closes, default to today's date
    if (!selectedDate) {
      const today = new Date();
      setSelectedDate(today);
    }
  };
  const parseDDMMYYYY = (dateStr) => {
    if (!dateStr) return null;
    const [dd, mm, yyyy] = dateStr.split("/");
    return new Date(yyyy, mm - 1, dd);
  };

  const fetchData = async () => {
    try {
      let response;
      if (purId) {
        console.log(purId);
        
        response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegstget/${purId}`
        );
      } else {
        response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/last`
        );
      }

      if (response.status === 200 && response.data && response.data.data) {
        const lastEntry = response.data.data;
        // // Ensure date is valid
        // const isValidDate = (date) => {
        //   return !isNaN(Date.parse(date));
        // };

        // // Update form data, use current date if date is invalid or not available
        // const updatedFormData = {
        //   ...lastEntry.formData,
        //   date: isValidDate(lastEntry.formData.date)
        //     ? lastEntry.formData.date
        //     : new Date().toLocaleDateString("en-IN"),
        // };
        // setFormData(updatedFormData);
        const apiDate = lastEntry.formData.date; // "29/12/2025"
        const parsedDate = parseDDMMYYYY(apiDate);

        setFormData(lastEntry.formData);     // keep string as-is
        setSelectedDate(parsedDate);     // Date object for DatePicker

        // Set data and index
        setData1(lastEntry);
        // setData1({ ...lastEntry, formData: updatedFormData });
        setIndex(lastEntry.vno);
        return lastEntry; // ✅ Return this for use in handleAdd
      } else {
        initializeEmptyData();
        return null;
      }
    } catch (error) {
      console.error("Error fetching data", error);
      initializeEmptyData();
      return null;
    }
  };
  // Function to initialize empty data
  const initializeEmptyData = () => {
    // Default date as current date
    const emptyFormData = {
      date: new Date().toLocaleDateString(), // Use today's date
    };
    // Set the empty data
    setFormData(emptyFormData);
    setData1({
      formData: emptyFormData,
    }); // Store empty data
    setIndex(0);
  };

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);
  return (
    <div>
      <DatePicker
        selected={selectedDate || null}
        openToDate={new Date()}
        onCalendarClose={handleCalendarClose}
        dateFormat="dd-MM-yyyy"
        onChange={handleDateChange}
        onBlur={() => validateDate(selectedDate)}
        customInput={<MaskedInput />}
      />
      <h1>{formData.grandtotal}</h1>
    </div>
  )
}

export default Example
