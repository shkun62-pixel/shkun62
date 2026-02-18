// import React, { useEffect, useState,useRef, useCallback } from "react";
// import { Table, Button, Form, Modal } from "react-bootstrap";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import ReceiptListPrint from "./ReceiptListPrint";
// import styles from '../Books/SaleBook/SaleBook.module.css'
// import { CompanyContext } from "../Context/CompanyContext";
// import { useContext } from "react";
// import useCompanySetup from "../Shared/useCompanySetup";
// import { FaCog } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import ReceiptModal from "../Modals/ReceiptModal";
// import financialYear from "../Shared/financialYear";

// const LOCAL_STORAGE_KEY = "ReceiptTableData";

// const ReceiptList = () => {

//   const navigate = useNavigate();
//   const { dateFrom } = useCompanySetup();
//   const { company } = useContext(CompanyContext);
//   const tenant = company?.databaseName;

//     if (!tenant) {
//       // you may want to guard here or show an error state,
//       // since without a tenant you can’t hit the right API
//       // console.error("No tenant selected!");
//     }
//     // const [grossOrDetail, setGrossOrDetail] = useState('detailed');
//     const [formData, setFormData] = useState({
//       city: "",
//       vehicle:"",
//       btype:"All",
//       stype:"All",
//       v_tpt:"",
//       broker:"",
//       rem1:"",
//       exfor:"",
//       lDesc:"",
//       lPost:"",
//       terms:"",
//       pnc:"All",
//       mfg:"",
//       iFrom:"",
//       iUpto:"",
//       vRange1:"",
//       vRange2:"",
//     });

//     // Payement Modal State
//     const [showPaymentModal, setShowPaymentModal] = useState(false);
//     const [selectedEntry, setSelectedEntry] = useState(null);


//     const handleChangevalues = (event) => {
//       const { id, value } = event.target;
//       setFormData((prevState) => ({
//         ...prevState,
//         [id]: value,
//       }));
//     };
//     const handleAlphabetOnly = (e) => {
//       const { id, value } = e.target;
//       // Allow only alphabets (A-Z, a-z) and spaces
//       const alphabetRegex = /^[A-Za-z\s]*$/;
//       if (alphabetRegex.test(value)) {
//         setFormData({ ...formData, [id]: value });
//       }
//     };

//     const handleNumericValue = (event) => {
//       const { id, value } = event.target;
//       // Allow only numeric values, including optional decimal points
//       if (/^\d*\.?\d*$/.test(value) || value === "") {
//         setFormData((prevData) => ({
//           ...prevData,
//           [id]: value,
//         }));
//       }
//     };
//     const defaultTableFields = {
//       date: true,
//       billno: true,
//       weight: true, 
//       pcs: false, 
//       accountname: true,
//       city: true,
//       gstin: true,
//       value: true,
//       cgst: true,
//       sgst: true,
//       igst: true,
//       netvalue: true,
//       exp1: false,
//       exp2: false,
//       exp3: false,
//       exp4: false,
//       exp5: false,
//       exp6: false,
//       exp7: false,
//       exp8: false,
//       exp9: false,
//       exp10: false,          
//       description: false,  
//       vehicleno: false,    
//       remarks: false,     
//       transport: false, 
//       broker: false,    
//       taxtype: false,                               
//     };
    
//     const [tableData, settableData] = useState(() => {
//       const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//       const parsed = saved ? JSON.parse(saved) : {};
//       // Only keep keys that exist in defaultFormData
//       const sanitized = Object.fromEntries(
//         Object.entries({ ...defaultTableFields, ...parsed }).filter(([key]) =>
//           Object.hasOwn(defaultTableFields, key)
//         )
//       );
      
//       return sanitized;
//     });

//     const defaultColumnOrder = {
//       date: 1,
//       billno: 2,
//       weight: 3,
//       pcs: 4,
//       accountname: 5,
//       city: 6,
//       gstin:7,
//       value: 8,
//       cgst: 9,
//       sgst: 10,
//       igst: 11,
//       netvalue: 12,
//       exp1: 13,
//       exp2: 14,
//       exp3: 15,
//       exp4: 16,
//       exp5: 17,
//       exp6: 18,
//       exp7: 19,
//       exp8: 20,
//       exp9: 21,
//       exp10: 22,
//       description: 23,
//       vehicleno: 24,
//       remarks: 25,
//       transport: 26,
//       broker:27,
//       taxtype: 28,
//     };

//     const [columnOrder, setColumnOrder] = useState(() => {
//       const saved = localStorage.getItem("ColumnOrder");
//       console.log("saved:",saved);
      
//       const parsed = saved ? JSON.parse(saved) : {};
//       return { ...defaultColumnOrder, ...parsed }; // ✅ merge saved over defaults
//     });

//     // Save to localStorage whenever tableData changes
//     useEffect(() => {
//       localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tableData));
//     }, [tableData]);
  
//     const handleCheckboxChange = (field) => {
//       settableData((prev) => ({ ...prev, [field]: !prev[field] }));
//     };
    
//     const handleSerialChange = (field, value) => {
//       const sanitizedValue = Math.max(1, parseInt(value) || 1); // ⛔ No zero or negative values
//       setColumnOrder((prev) => {
//         const newOrder = { ...prev, [field]: sanitizedValue };
//         localStorage.setItem("ColumnOrder", JSON.stringify(newOrder));
//         return newOrder;
//       });
//     };

//     useEffect(() => {
//       localStorage.setItem("ColumnOrder", JSON.stringify(columnOrder));
//       console.log("columnOrder:",columnOrder);
      
//     }, [columnOrder]);

//     // Select Font weight 
//     const [fontWeight, setFontWeight] = useState(() => {
//       return localStorage.getItem("FontWeight") || "normal";
//     });

//     useEffect(() => {
//       localStorage.setItem("FontWeight", fontWeight);
//     }, [fontWeight]);

//     // Increase Decrease fontSize
//     const [fontSize, setFontSize] = useState(() => {
//       const saved = localStorage.getItem("FontSize");
//       return saved ? parseInt(saved, 10) : 15;
//     });

//     useEffect(() => {
//       localStorage.setItem("FontSize", fontSize.toString());
//     }, [fontSize]);


//   const [activeRowIndex, setActiveRowIndex] = useState(0);
//   const tableRef = useRef(null);
//   const [entries, setEntries] = useState([]);
//   const [filteredEntries, setFilteredEntries] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [moreModalOpen, setMoreModalOpen] = useState(false);
//   const [tableModalOpen, settableModalOpen] = useState(false);
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(() => new Date());
//   const [selectedSupplier, setSelectedSupplier] = useState(""); 
//   const [selectedItems, setSelectedItems] = useState(""); 
//   const rowRefs = useRef([]);

//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setFromDate(fy.start); // converted
//     setToDate(fy.end);     // converted
//   }, []);


//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (tableRef.current) {
//         tableRef.current.focus();
//       }
//     }, 0);

//     return () => clearTimeout(timer);
//   }, []);

//   const formatAmount = (val) => {
//     const num = parseFloat(val);
//     return isNaN(num) ? "0.00" : num.toFixed(2);
//   };

//  const fetchEntries = useCallback(async () => {
//     if (!fromDate || !toDate) return;

//     setLoading(true);
//     try {
//       // --- 1️⃣ Fetch sales ---
//       const saleRes = await fetch(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale`
//       );
//       if (!saleRes.ok) throw new Error("Failed to fetch sale data");
//       const saleData = await saleRes.json();

//       const filteredSales = (Array.isArray(saleData) ? saleData : []).filter(
//         (entry) => {
//           const entryDate = new Date(entry?.formData?.date || "");
//           return entryDate >= fromDate && entryDate <= toDate;
//         }
//       );

//       // --- 2️⃣ Fetch bank vouchers ---
//       const bankRes = await fetch(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/bank`
//       );
//       if (!bankRes.ok) throw new Error("Failed to fetch bank data");
//       const bankRaw = await bankRes.json();

//       const bankData = Array.isArray(bankRaw)
//         ? bankRaw.map((b) => b?.data || b)
//         : [];

//       // --- 3️⃣ Create payment map ---
//       const paymentMap = new Map();
//       bankData.forEach((voucher) => {
//         const vForm = voucher?.formData || {};
//         const items = Array.isArray(voucher?.items)
//           ? voucher.items
//           : Array.isArray(voucher?.data?.items)
//           ? voucher.data.items
//           : [];

//         const billNo = parseInt(vForm.againstbillno || 0);
//         if (!billNo) return;

//         const totalPaid = items.reduce(
//           (sum, item) => sum + parseFloat(item?.receipt_credit || 0),
//           0
//         );
//         paymentMap.set(billNo, (paymentMap.get(billNo) || 0) + totalPaid);
//       });

//       // --- 4️⃣ Merge payment info ---
//       const updatedSales = filteredSales
//         .map((sale) => {
//           const formData = sale?.formData || {};
//           const saleBillNo = parseInt(formData?.vno || 0);
//           const saleAmount = parseFloat(formData?.grandtotal || 0);
//           const paidAmount = paymentMap.get(saleBillNo) || 0;
//           const balance = saleAmount - paidAmount;

//           return {
//             ...sale,
//             formData: {
//               ...formData,
//               paidAmount,
//               balance,
//             },
//           };
//         })
//         // ✅ Hide fully paid bills
//         .filter((sale) => sale?.formData?.balance > 0.5);

//       setEntries(updatedSales);
//       setFilteredEntries(updatedSales);
//     } catch (err) {
//       console.error("❌ Fetch Error:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, [fromDate, toDate]);

//   // Fetch initially and when dates change
//   useEffect(() => {
//     fetchEntries();
//   }, [fetchEntries]);

//   useEffect(() => {
//     const filtered = entries.filter((entry) => {
//       const supplierMatch = selectedSupplier
//         ? entry.customerDetails?.[0]?.vacode === selectedSupplier
//         : true;

//       const cityMatch = formData.city
//         ? entry.customerDetails?.[0]?.city?.toLowerCase().includes(formData.city.toLowerCase())
//         : true;

//       const vehicleMatch = formData.vehicle
//         ? entry.formData?.trpt?.toLowerCase().includes(formData.vehicle.toLowerCase())
//         : true;

//       const btypeMatch = formData.btype && formData.btype !== "All"
//         ? (entry.formData?.btype || "").toLowerCase() === formData.btype.toLowerCase()
//         : true;

//       const stypeMatch = formData.stype && formData.stype !== "All"
//         ? (entry.formData?.stype || "").toLowerCase() === formData.stype.toLowerCase()
//         : true;

//       const productMatch = selectedItems
//         ? entry.items?.some(item => item.sdisc === selectedItems)
//         : true;

//       const transportMatch = formData.v_tpt
//         ? entry.formData?.v_tpt?.toLowerCase().includes(formData.v_tpt.toLowerCase())
//         : true;

//       const brokerMatch = formData.broker
//         ? entry.formData?.broker?.toLowerCase().includes(formData.broker.toLowerCase())
//         : true;

//       const remarkMatch = formData.rem1
//         ? entry.formData?.rem2?.toLowerCase().includes(formData.rem1.toLowerCase())
//         : true;

//       const termsMatch = formData.terms
//         ? entry.formData?.exfor?.toLowerCase().includes(formData.terms.toLowerCase())
//         : true;
      
//       const pncMatch = formData.pnc && formData.pnc !== "All"
//         ? formData.pnc === "Positive" ? Number(entry.formData?.grandtotal) > 0
//         : formData.pnc === "Negative" ? Number(entry.formData?.grandtotal) < 0
//         : formData.pnc === "Cancel" ? Number(entry.formData?.grandtotal) === 0
//         : true
//         : true;

//       const invoiceRangeMatch =
//       formData.iFrom && formData.iUpto
//         ? Number(entry.formData?.vno) >= Number(formData.iFrom) && Number(entry.formData?.vno) <= Number(formData.iUpto)
//         : formData.iFrom
//         ? Number(entry.formData?.vno) >= Number(formData.iFrom) : formData.iUpto
//         ? Number(entry.formData?.vno) <= Number(formData.iUpto)
//         : true;

//       const taxRateMatch = formData.taxRate
//       ? entry.items?.some(item => String(item.gst).includes(formData.taxRate))
//       : true;


//       return supplierMatch && cityMatch && vehicleMatch && btypeMatch && stypeMatch && productMatch && transportMatch && brokerMatch && remarkMatch && termsMatch && pncMatch && invoiceRangeMatch && taxRateMatch;
//     });

//     setFilteredEntries(filtered);
//   }, [selectedSupplier, formData.city, formData.vehicle, formData.btype, formData.stype, selectedItems, formData.v_tpt, formData.broker, formData.rem1, formData.terms, formData.pnc, formData.iFrom, formData.iUpto, formData.taxRate, entries]);

//   const uniqueSuppliers = [...new Set(entries.map(entry => entry.customerDetails?.[0]?.vacode))].filter(Boolean);
//   const uniqueItem = [...new Set(entries.map(entry => entry.items?.[0]?.sdisc))].filter(Boolean);

//     // Calculate totals based on filtered data
//   const totalGrandTotal = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.grandtotal || 0), 0);
//   const totalPaid = filteredEntries.reduce(
//   (acc, e) => acc + parseFloat(e?.formData?.paidAmount || 0),
//     0
//   );
//   const totalBalance = filteredEntries.reduce(
//     (acc, e) => acc + parseFloat(e?.formData?.balance || 0),
//     0
//   );
//   const totalCGST = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.cgst || 0), 0);
//   const totalSGST = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.sgst || 0), 0);
//   const totalIGST = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.igst || 0), 0);
//   const totalTAX = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.sub_total || 0), 0);
//   const totalWeight = filteredEntries.reduce((entryAcc, entry) => {
//     const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.weight || 0), 0);
//     return entryAcc + itemTotal;
//   }, 0);
//   const totalPcs = filteredEntries.reduce((entryAcc, entry) => {
//   const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.pkgs || 0), 0);
//   return entryAcc + itemTotal;
//   }, 0);

//   const totalexp1 = filteredEntries.reduce((entryAcc, entry) => {
//   const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp1 || 0), 0);
//   return entryAcc + itemTotal;
//   }, 0);
//     const totalexp2 = filteredEntries.reduce((entryAcc, entry) => {
//   const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp2 || 0), 0);
//   return entryAcc + itemTotal;
//   }, 0);
//     const totalexp3 = filteredEntries.reduce((entryAcc, entry) => {
//   const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp3 || 0), 0);
//   return entryAcc + itemTotal;
//   }, 0);
//     const totalexp4 = filteredEntries.reduce((entryAcc, entry) => {
//   const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp4 || 0), 0);
//   return entryAcc + itemTotal;
//   }, 0);
//     const totalexp5 = filteredEntries.reduce((entryAcc, entry) => {
//   const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp5 || 0), 0);
//   return entryAcc + itemTotal;
//   }, 0);

//   const totalexp6 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp6 || 0), 0);
//   const totalexp7 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp7 || 0), 0);
//   const totalexp8 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp8 || 0), 0);
//   const totalexp9 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp9 || 0), 0);
//   const totalexp10 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp10 || 0), 0);


//   const formatDate = (dateValue) => {
//     // Check if date is already in dd/mm/yyyy or d/m/yyyy format
//     const ddmmyyyyPattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

//     if (ddmmyyyyPattern.test(dateValue)) {
//       return dateValue;  // already correctly formatted
//     }

//     // otherwise assume ISO or another format, parse it
//     const dateObj = new Date(dateValue);
//     if (isNaN(dateObj)) {
//       return "";  // invalid date fallback
//     }
//     const day = String(dateObj.getDate()).padStart(2, "0");
//     const month = String(dateObj.getMonth() + 1).padStart(2, "0");
//     const year = dateObj.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "ArrowUp") {
//         setActiveRowIndex((prev) => (prev > 0 ? prev - 1 : prev));
//       } else if (e.key === "ArrowDown") {
//         setActiveRowIndex((prev) =>
//           prev < filteredEntries.length - 1 ? prev + 1 : prev
//         );
//     } else if (e.key === "Enter") {
//       const entry = filteredEntries[activeRowIndex];
//       if (entry) {
//         navigate("/sale", { state: { saleId: entry._id, rowIndex: activeRowIndex } }); // ✅ pass via state
//         localStorage.setItem("selectedRowIndex", activeRowIndex); 
//       }
//     }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [filteredEntries, activeRowIndex, navigate]);

//   // ✅ Restore selected row index if coming back from Sale
//   useEffect(() => {
//     const savedIndex = localStorage.getItem("selectedRowIndex");
//     if (savedIndex !== null) {
//       setActiveRowIndex(parseInt(savedIndex, 10));
//       setTimeout(() => {
//         if (rowRefs.current[savedIndex]) {
//           rowRefs.current[savedIndex].focus();
//           rowRefs.current[savedIndex].scrollIntoView({
//             behavior: "smooth",
//             block: "nearest",
//           });
//         }
//       }, 0);
//     }
//   }, []);

//   // Show loading only after user selects the dates
//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

//   // Sorting Column Order
//   const sortedVisibleFields = Object.keys(tableData)
//   .filter(field => tableData[field]) // only visible ones
//   .sort((a, b) => {
//     const orderA = parseInt(columnOrder[a]) || 999;
//     const orderB = parseInt(columnOrder[b]) || 999;
//     return orderA - orderB;
//   });

//   return (
//     <div>
//       <h3 className="bank-title">📒 RECEIPT LIST</h3>

//       <div style={{ display: "flex",flexDirection:"row", marginBottom: 10,marginLeft:10, marginTop:"20px" }}>
//       <div>
//         <span className="text-lg mr-2">Period From:</span>
//          <DatePicker
//             selected={fromDate}
//             onChange={(date) => setFromDate(date)}
//             dateFormat="dd/MM/yyyy"
//            className="datepickerBank"
//             placeholderText="From Date"
//           />
//         </div>
//         <div>
//         <span className="text-lg ml-3 mr-2">UpTo:</span>
//         <DatePicker
//           selected={toDate}
//           onChange={(date) => setToDate(date)}
//           dateFormat="dd/MM/yyyy"
//           className="datepickerBank2"
//           placeholderText="To Date"
//         />
//         </div>
//          <div style={{display:'flex',flexDirection:'row'}}>
//         <Button  onClick={() => setModalOpen(true)} variant="info" style={{ marginLeft: 10,background:"blue",width:"100px" }}>Print</Button>
//         <Button onClick={() => setMoreModalOpen(true)} variant="info" style={{ marginLeft: 10,background:"blue",width:"100px" }}>More</Button>
//         <button
//         style={{marginLeft:"10px"}}
//           onClick={() => settableModalOpen(true)}
//           className="text-xl text-blue-700"
//         >
//           <FaCog  size={25}/>
//         </button>
//         </div>
//       </div>

//       <div style={{ display: "none" }}>
//         <ReceiptListPrint 
//         isOpen={modalOpen} 
//         handleClose={() => 
//         setModalOpen(false)} 
//         items={filteredEntries}  
//         fromDate={fromDate}
//         toDate={toDate}
//         tableData={tableData} // ✅ Pass it here
//         fontWeight={fontWeight}
//         sortedVisibleFields = {sortedVisibleFields}
//         />
//       </div>
//       {/* More Modal */}
//       <Modal show={moreModalOpen} onHide={() => setMoreModalOpen(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Filters</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{display:'flex',flexDirection:'column'}}>
//         <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
//            <span style={{fontWeight:'bold'}}>A/c Name</span>
//           <Form.Select className={styles.filterz} value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
//             <option value="">All</option>
//             {uniqueSuppliers.map((vacode, index) => (
//               <option key={index} value={vacode}>{vacode}</option>
//             ))}
//           </Form.Select>
//         </div>
//         <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
//            <span style={{fontWeight:'bold'}}>City</span>
//            <input className={styles.citY}
//            id="city"
//            value={formData.city}
//            onChange={handleAlphabetOnly}
//            />
//         </div>
//         <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
//            <span style={{fontWeight:'bold'}}>Vehicle No</span>
//            <input className={styles.vehicle}
//            id="vehicle"
//            value={formData.vehicle}
//            onChange={handleChangevalues}
//            />
//            <span style={{fontWeight:'bold',marginLeft:2}}>Cash/Bill</span>
//           <Form.Select
//             id="btype"
//             className={styles.cbill}
//             style={{ marginTop: '0px' }}
//             value={formData.btype}
//             onChange={handleChangevalues}
//           >
//           <option value="All">All</option>
//           <option value="Bill">Bill</option>
//           <option value="Cash">Cash</option>
//           </Form.Select>
//         </div>
//         <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
//            <span style={{fontWeight:'bold',marginLeft:2}}>TaxType</span>
//           <Form.Select
//             id="stype"
//             className={styles.stype}
//             style={{ marginTop: '0px' }}
//             value={formData.stype}
//             onChange={handleChangevalues}
//           >
//           <option value="All">All</option>
//           <option value="GST Sale (RD)">GST Sale (RD)</option>
//           <option value="IGST Sale (RD)">IGST Sale (RD)</option>
//           <option value="GST (URD)">GST (URD)</option>
//           <option value="IGST (URD)">IGST (URD)</option>
//           <option value="Tax Free Within State">Tax Free Within State</option>
//           <option value="Tax Free Interstate">Tax Free Interstate</option>
//           <option value="Export Sale">Export Sale</option>
//           <option value="Export Sale(IGST)">Export Sale(IGST)</option>
//           <option value="Including GST">Including GST</option>
//           <option value="Including IGST">Including IGST</option>
//           <option value="Not Applicable">Not Applicable</option>
//           <option value="Exempted Sale">Exempted Sale</option>
//           </Form.Select>
//         </div>
//         <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
//            <span style={{fontWeight:'bold'}}>Product Name</span>
//           <Form.Select className={styles.pName} value={selectedItems} onChange={(e) => setSelectedItems(e.target.value)}>
//             <option value="">All</option>
//             {uniqueItem.map((sdisc, index) => (
//               <option key={index} value={sdisc}>{sdisc}</option>
//             ))}
//           </Form.Select>
//         </div>
//         <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
//            <span style={{fontWeight:'bold'}}>Transport</span>
//            <input className={styles.tpt}
//            id="v_tpt"
//            value={formData.v_tpt}
//            onChange={handleChangevalues}
//            />
//         </div>
//         <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
//            <span style={{fontWeight:'bold'}}>Broker</span>
//            <input className={styles.broker}
//            id="broker"
//            value={formData.broker}
//            onChange={handleChangevalues}
//            />
//         </div>
//         <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
//            <span style={{fontWeight:'bold'}}>Remarks</span>
//            <input className={styles.rem}
//            id="rem1"
//            value={formData.rem1}
//            onChange={handleChangevalues}
//            />
//         </div>
//         <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
//           <span style={{fontWeight:'bold',marginLeft:2}}>Pos/Neg/Cancel</span>
//           <Form.Select
//             id="pnc"
//             className={styles.pnc}
//             style={{ marginTop: '0px' }}
//             value={formData.pnc}
//             onChange={handleChangevalues}
//           >
//           <option value="All">All</option>
//           <option value="Positive">Positive</option>
//           <option value="Negative">Negative</option>
//           <option value="Cancel">Cancel</option>
//           </Form.Select>
//            <span style={{fontWeight:'bold',marginLeft:5}}>Terms</span>
//            <input className={styles.terms}
//            id="terms"
//            value={formData.terms}
//            onChange={handleChangevalues}
//            />
//         </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setMoreModalOpen(false)}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//       {/* Table fields */}
//       <Modal show={tableModalOpen} onHide={() => settableModalOpen(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Filters</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{display:'flex',flexDirection:'column'}}>
//           <span style={{ fontWeight: 'bold', marginTop: '10px' }}>Select Font Weight <span style={{marginLeft:"38%"}}>Font Size</span></span>
//           <div style={{display:'flex',flexDirection:'row'}}>
//           <Form.Select
//             className={styles.filterzFont}
//             style={{ marginTop: '0px' }}
//             value={fontWeight}
//             onChange={(e) => setFontWeight(e.target.value)}
//           >
//             <option value="normal">Normal</option>
//             <option value="bold">Bold</option>
//           </Form.Select>

//           <div style={{ display: "flex", alignItems: "center", gap: "10px",marginLeft:"15%"}}>
//             <Button
//               variant="outline-secondary"
//               onClick={() => setFontSize((prev) => Math.max(prev - 1, 10))} // limit minimum size
//               style={{ fontSize: "18px", padding: "0px 10px",backgroundColor:"darkblue",border:'transparent',color:"white" }}
//             >
//               −
//             </Button>
//             <span style={{ fontSize: "16px", minWidth: "30px", textAlign: "center" }}>{fontSize}px</span>
//             <Button
//               variant="outline-secondary"
//               onClick={() => setFontSize((prev) => Math.min(prev + 1, 25))} // limit max size
//               style={{ fontSize: "18px", padding: "0px 10px",backgroundColor:"darkblue",border:'transparent',color:"white" }}
//             >
//               +
//             </Button>
//           </div>
//           </div>
//           <span style={{fontSize:17,fontWeight:'bold',marginTop:"10px"}}>SELECT TABLE FIELDS</span>
//           <div style={{ display: "flex", flexDirection:'column',padding:"5px",border:"1px solid black",height:"340px",overflow:"auto"}}>
//             <div style={{marginTop:"10px",display:'flex',flexDirection:"column"}}>
//             {Object.keys(tableData).map((field) => (
//             <div
//               key={field}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "space-between",
//                 marginBottom: "8px",
//               }}
//             >
//               <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
//                 <input
//                   type="checkbox"
//                   checked={tableData[field]}
//                   onChange={() => handleCheckboxChange(field)}
//                   style={{ width: "16px", height: "16px", marginRight: "8px" }}
//                 />
//                 <span style={{ marginRight: "8px", minWidth: "80px" }}>
//                   {field.toUpperCase()}
//                 </span>
//               </div>
//               <input
//                 type="number"
//                 min="1"
//                 value={columnOrder[field] || ""}
//                 onChange={(e) => handleSerialChange(field, e.target.value)}
//                 placeholder="Order"
//                 style={{
//                   width: "80px",
//                   padding: "2px 5px",
//                   border: "1px solid black",
//                   marginRight:"40%"
//                 }}
//               />
//             </div>
//             ))}
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => settableModalOpen(false)}>Close</Button>
//         </Modal.Footer>
//       </Modal>
//       {/* Main Table Component  */}
//       <div
//           ref={tableRef}
//           tabIndex={0}
//           style={{ maxHeight: 530, overflowY: "auto", padding: 5, outline: "none" }}
//         >
//         <Table className="custom-table" bordered>
//         <thead style={{ backgroundColor: "skyblue", position: "sticky", top: -6, textAlign: 'center',    fontSize: `${fontSize}px` }}>
//           <tr>
//             {sortedVisibleFields.map((field) => (
//               <th key={field}>
//                 {field === "date" ? "Date" :
//                 field === "billno" ? "BillNo." :
//                 field === "accountname" ? "A/C Name" :
//                 field === "weight" ? "Qty" :
//                 field === "pcs" ? "Pcs" :
//                 field === "city" ? "City" :
//                 field === "gstin" ? "Gstin" :
//                 field === "value" ? "Bill Value" :
//                 field === "cgst" ? "C.Tax" :
//                 field === "sgst" ? "S.Tax" :
//                 field === "igst" ? "I.Tax" :
//                 field === "netvalue" ? "Net value" :
//                 field === "exp1" ? "Exp1" :
//                 field === "exp2" ? "Exp2" :
//                 field === "exp3" ? "Exp3" :
//                 field === "exp4" ? "Exp4" :
//                 field === "exp5" ? "Exp5" :
//                 field === "exp6" ? "Exp6" :
//                 field === "exp7" ? "Exp7" :
//                 field === "exp8" ? "Exp8" :
//                 field === "exp9" ? "Exp9" :
//                 field === "exp10" ? "Exp10" : 
//                 field === "description" ? "Description" : 
//                 field === "vehicleno" ? "Vehicleno" :    
//                 field === "remarks" ? "Remarks" :      
//                 field === "transport" ? "Transport" :     
//                 field === "broker" ? "Broker" :
//                 field === "taxtype" ? "TaxType" :
//                 field.toUpperCase()}
//               </th>
//             ))}
//             <th>Paid</th>
//             <th>Balance</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredEntries.map((entry, index) => {
//             const formData = entry.formData || {};
//             const customerDetails = entry.customerDetails?.[0] || {};
//             const item = entry.items?.[0] || {};
//             const totalItemWeight = entry.items?.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0).toFixed(3);
//             const totalItemPkgs = entry.items?.reduce((sum, item) => sum + parseFloat(item.pkgs || 0), 0).toFixed(3);
//             const isActive = index === activeRowIndex;

//             return (
//              <tr
//                 key={index}
//                 ref={(el) => (rowRefs.current[index] = el)}
//                 tabIndex={0} // ✅ focusable row
//                 onMouseEnter={() => setActiveRowIndex(index)}
//                 onClick={() => {
//                   navigate("/sale", { state: { saleId: entry._id, rowIndex: index } }); // ✅ pass via state
//                    localStorage.setItem("selectedRowIndex", activeRowIndex); 
//                 }}
//                 style={{
//                   backgroundColor: isActive ? "rgb(197, 190, 190)" : "",
//                   cursor: "pointer",
//                   fontWeight: fontWeight,
//                   fontSize: `${fontSize}px`,
//                 }}
//                 >
//                 {sortedVisibleFields.map((field) => {
//                   let value = "";
//                   if (field === "date") value = formatDate(formData.date);
//                   else if (field === "billno") value = formData.vno || "";
//                   else if (field === "accountname") value = customerDetails.vacode || "";
//                   else if (field === "weight") value = totalItemWeight;
//                   else if (field === "pcs") value = totalItemPkgs;
//                   else if (field === "city") value = customerDetails.city || "";
//                   else if (field === "gstin") value = customerDetails.gstno || "";
//                   else if (field === "value") value = formData.grandtotal || "";
//                   else if (field === "cgst") value = formData.cgst || "";
//                   else if (field === "sgst") value = formData.sgst || "";
//                   else if (field === "igst") value = formData.igst || "";
//                   else if (field === "netvalue") value = formData.sub_total || "";
//                   else if (field === "exp1") value = item.Exp1 || "0.00";
//                   else if (field === "exp2") value = item.Exp2 || "0.00";
//                   else if (field === "exp3") value = item.Exp3 || "0.00";
//                   else if (field === "exp4") value = item.Exp4 || "0.00";
//                   else if (field === "exp5") value = item.Exp5 || "0.00";
//                   else if (field === "exp6") value = formData.Exp6 || "";
//                   else if (field === "exp7") value = formData.Exp7 || "";
//                   else if (field === "exp8") value = formData.Exp8 || "";
//                   else if (field === "exp9") value = formData.Exp9 || "";
//                   else if (field === "exp10") value = formData.Exp10 || ""; 
//                   else if (field === "description") value = item.sdisc || "";
//                   else if (field === "vehicleno") value = formData.trpt || "";
//                   else if (field === "remarks") value = formData.rem2 || "";
//                   else if (field === "transport") value = formData.v_tpt || "";
//                   else if (field === "broker") value = formData.broker || "" ;
//                   else if (field === "taxtype") value = formData.stype || "" ;
//                   return <td key={field}>{value}</td>;
//                 })}
//                 <td>{formatAmount(formData?.paidAmount)}</td>
//                 <td>{formatAmount(formData?.balance)}</td>
//                 <td style={{ textAlign: "center" }}>
//                  <Button
//                   variant="success"
//                   size="sm"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setSelectedEntry(entry);
//                     console.log("Selected entry:", entry);
//                     setShowPaymentModal(true);
//                   }}
//                 >
//                   Make Payment
//                 </Button>
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       <tfoot style={{ backgroundColor: "skyblue", position: "sticky", bottom: -6, fontWeight, fontSize: `${fontSize}px` }}>
//           <tr>
//             {sortedVisibleFields.map((field, idx) => {
//               let value = "";
//               if (field === "date") value = "TOTAL";
//               else if (field === "value") value = totalGrandTotal.toFixed(2);
//               else if (field === "cgst") value = totalCGST.toFixed(2);
//               else if (field === "sgst") value = totalSGST.toFixed(2);
//               else if (field === "igst") value = totalIGST.toFixed(2);
//               else if (field === "netvalue") value = totalTAX.toFixed(2);
//               else if (field === "weight") value = totalWeight.toFixed(3);
//               else if (field === "pcs") value = totalPcs.toFixed(3);
//               else if (field === "exp1") value = totalexp1.toFixed(2);
//               else if (field === "exp2") value = totalexp2.toFixed(2);
//               else if (field === "exp3") value = totalexp3.toFixed(2);
//               else if (field === "exp4") value = totalexp4.toFixed(2);
//               else if (field === "exp5") value = totalexp5.toFixed(2);
//               else if (field === "exp6") value = totalexp6.toFixed(2);
//               else if (field === "exp7") value = totalexp7.toFixed(2);
//               else if (field === "exp8") value = totalexp8.toFixed(2);
//               else if (field === "exp9") value = totalexp9.toFixed(2);
//               else if (field === "exp10") value = totalexp10.toFixed(2);
//               return <td key={field} style={{ fontWeight: value ? "bold" : "", color: value ? "red" : "" }}>{value}</td>;
//             })}
//             <td style={{ fontWeight: "bold", color: "red" }}>
//                 {formatAmount(totalPaid)}
//             </td>
//             <td style={{ fontWeight: "bold", color: "red" }}>
//               {formatAmount(totalBalance)}
//             </td>
//             <td></td>
//           </tr>
//         </tfoot>
//         </Table>
//       </div>
//      <ReceiptModal
//       show={showPaymentModal}
//       onHide={() => setShowPaymentModal(false)}
//       entry={selectedEntry}
//       onPaymentSaved={fetchEntries}
//     />

//     </div>
    
//   );
// };

// export default ReceiptList;


import React, { useEffect, useMemo, useRef, useState, useCallback, useContext } from "react";
import { Table, Button, Form, Modal, Badge } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReceiptListPrint from "./ReceiptListPrint";
import styles from "../Books/SaleBook/SaleBook.module.css";
import { CompanyContext } from "../Context/CompanyContext";
import { FaCog, FaSyncAlt, FaFilter, FaPrint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ReceiptModal from "../Modals/ReceiptModal";
import financialYear from "../Shared/financialYear";

const LOCAL_STORAGE_KEY = "ReceiptTableData_v2";
const COL_ORDER_KEY = "ReceiptColumnOrder_v2";
const FONT_WEIGHT_KEY = "ReceiptFontWeight_v2";
const FONT_SIZE_KEY = "ReceiptFontSize_v2";
const SELECTED_ROW_KEY = "ReceiptSelectedRowIndex_v2";

/** ---------- date helpers ---------- **/
function parseAnyDate(input) {
  if (!input) return null;
  if (input instanceof Date && !isNaN(input)) return input;
  if (typeof input !== "string") return null;

  const s = input.trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    const d = new Date(s);
    return isNaN(d) ? null : d;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [dd, mm, yyyy] = s.split("/");
    const d = new Date(`${yyyy}-${mm}-${dd}`);
    return isNaN(d) ? null : d;
  }
  if (/^\d{2}-\d{2}-\d{4}$/.test(s)) {
    const [dd, mm, yyyy] = s.split("-");
    const d = new Date(`${yyyy}-${mm}-${dd}`);
    return isNaN(d) ? null : d;
  }
  return null;
}

function formatDateDisplay(dateInput) {
  const d = parseAnyDate(dateInput);
  if (!d) return "";
  return d.toLocaleDateString("en-GB");
}

function toDDMMYYYY(dateObj) {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return "";
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = dateObj.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

const defaultTableFields = {
  date: true,
  billno: true,
  weight: true,
  pcs: false,
  accountname: true,
  city: true,
  gstin: true,
  value: true,
  cgst: true,
  sgst: true,
  igst: true,
  netvalue: true,
  exp1: false,
  exp2: false,
  exp3: false,
  exp4: false,
  exp5: false,
  exp6: false,
  exp7: false,
  exp8: false,
  exp9: false,
  exp10: false,
  description: false,
  vehicleno: false,
  remarks: false,
  transport: false,
  broker: false,
  taxtype: false,
};

const defaultColumnOrder = {
  date: 1,
  billno: 2,
  weight: 3,
  pcs: 4,
  accountname: 5,
  city: 6,
  gstin: 7,
  value: 8,
  cgst: 9,
  sgst: 10,
  igst: 11,
  netvalue: 12,
  exp1: 13,
  exp2: 14,
  exp3: 15,
  exp4: 16,
  exp5: 17,
  exp6: 18,
  exp7: 19,
  exp8: 20,
  exp9: 21,
  exp10: 22,
  description: 23,
  vehicleno: 24,
  remarks: 25,
  transport: 26,
  broker: 27,
  taxtype: 28,
};

const ReceiptList = () => {
  const navigate = useNavigate();
  const { company } = useContext(CompanyContext);
  const tenant = "03AAYFG4472A1ZG_01042025_31032026";

  // filters modal inputs
  const [formData, setFormData] = useState({
    city: "",
    vehicle: "",
    btype: "All",
    stype: "All",
    v_tpt: "",
    broker: "",
    rem1: "",
    terms: "",
    pnc: "All",
    iFrom: "",
    iUpto: "",
    taxRate: "",
  });

  const handleChangevalues = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAlphabetOnly = (e) => {
    const { id, value } = e.target;
    const alphabetRegex = /^[A-Za-z\s]*$/;
    if (alphabetRegex.test(value)) setFormData((prev) => ({ ...prev, [id]: value }));
  };

  /** ---------- table field visibility ---------- **/
  const [tableData, settableData] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    const merged = { ...defaultTableFields, ...parsed };
    const sanitized = Object.fromEntries(Object.entries(merged).filter(([k]) => Object.hasOwn(defaultTableFields, k)));
    return sanitized;
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tableData));
  }, [tableData]);

  const handleCheckboxChange = (field) => settableData((prev) => ({ ...prev, [field]: !prev[field] }));

  /** ---------- column order ---------- **/
  const [columnOrder, setColumnOrder] = useState(() => {
    const saved = localStorage.getItem(COL_ORDER_KEY);
    const parsed = saved ? JSON.parse(saved) : {};
    return { ...defaultColumnOrder, ...parsed };
  });

  useEffect(() => {
    localStorage.setItem(COL_ORDER_KEY, JSON.stringify(columnOrder));
  }, [columnOrder]);

  const handleSerialChange = (field, value) => {
    const sanitizedValue = Math.max(1, parseInt(value) || 1);
    setColumnOrder((prev) => ({ ...prev, [field]: sanitizedValue }));
  };

  /** ---------- font prefs ---------- **/
  const [fontWeight, setFontWeight] = useState(() => localStorage.getItem(FONT_WEIGHT_KEY) || "normal");
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem(FONT_SIZE_KEY);
    return saved ? parseInt(saved, 10) : 15;
  });

  useEffect(() => localStorage.setItem(FONT_WEIGHT_KEY, fontWeight), [fontWeight]);
  useEffect(() => localStorage.setItem(FONT_SIZE_KEY, String(fontSize)), [fontSize]);

  /** ---------- screen state ---------- **/
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const tableRef = useRef(null);
  const rowRefs = useRef([]);

  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [tableModalOpen, settableModalOpen] = useState(false);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(() => new Date());

  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedItems, setSelectedItems] = useState("");

  // receipt modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  /** ---------- init FY dates ---------- **/
  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(fy.start);
    setToDate(fy.end);
  }, []);

  /** ---------- focus table ---------- **/
  useEffect(() => {
    const timer = setTimeout(() => tableRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, []);

  /** ---------- fetch via ONE API ---------- **/
  const fetchEntries = useCallback(async () => {
    if (!tenant) return;
    if (!fromDate || !toDate) return;

    setLoading(true);
    setError(null);

    try {
      const fromStr = toDDMMYYYY(fromDate);
      const toStr = toDDMMYYYY(toDate);

      const url = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/reports/receiptlist?from=${encodeURIComponent(
        fromStr
      )}&to=${encodeURIComponent(toStr)}&onlyPending=1`;

      const res = await fetch(url);
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`ReceiptList API failed (${res.status}) ${txt}`);
      }
      const data = await res.json();

      const list = Array.isArray(data) ? data : [];
      setEntries(list);
      setFilteredEntries(list);
    } catch (err) {
      console.error("❌ ReceiptList fetch error:", err);
      setError(err.message || "Fetch failed");
    } finally {
      setLoading(false);
    }
  }, [tenant, fromDate, toDate]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  /** ---------- filters (client side) ---------- **/
  useEffect(() => {
    const filtered = (entries || []).filter((entry) => {
      const f = entry?.formData || {};
      const cust = entry?.customerDetails?.[0] || {};
      const items = Array.isArray(entry?.items) ? entry.items : [];

      const supplierMatch = selectedSupplier ? cust?.vacode === selectedSupplier : true;

      const cityMatch = formData.city ? String(cust?.city || "").toLowerCase().includes(formData.city.toLowerCase()) : true;

      const vehicleMatch = formData.vehicle ? String(f?.trpt || "").toLowerCase().includes(formData.vehicle.toLowerCase()) : true;

      const stypeMatch =
        formData.stype && formData.stype !== "All"
          ? String(f?.stype || "").toLowerCase() === formData.stype.toLowerCase()
          : true;

      const productMatch = selectedItems ? items.some((it) => String(it?.sdisc || "") === String(selectedItems)) : true;

      const transportMatch = formData.v_tpt ? String(f?.v_tpt || "").toLowerCase().includes(formData.v_tpt.toLowerCase()) : true;

      const brokerMatch = formData.broker ? String(f?.broker || "").toLowerCase().includes(formData.broker.toLowerCase()) : true;

      const remarkMatch = formData.rem1 ? String(f?.rem2 || "").toLowerCase().includes(formData.rem1.toLowerCase()) : true;

      const termsMatch = formData.terms ? String(f?.exfor || "").toLowerCase().includes(formData.terms.toLowerCase()) : true;

      const pncMatch =
        formData.pnc && formData.pnc !== "All"
          ? formData.pnc === "Positive"
            ? Number(f?.grandtotal) > 0
            : formData.pnc === "Negative"
            ? Number(f?.grandtotal) < 0
            : formData.pnc === "Cancel"
            ? Number(f?.grandtotal) === 0
            : true
          : true;

      const invoiceRangeMatch =
        formData.iFrom && formData.iUpto
          ? Number(f?.vno) >= Number(formData.iFrom) && Number(f?.vno) <= Number(formData.iUpto)
          : formData.iFrom
          ? Number(f?.vno) >= Number(formData.iFrom)
          : formData.iUpto
          ? Number(f?.vno) <= Number(formData.iUpto)
          : true;

      const taxRateMatch = formData.taxRate ? items.some((it) => String(it?.gst || "").includes(String(formData.taxRate))) : true;

      return (
        supplierMatch &&
        cityMatch &&
        vehicleMatch &&
        stypeMatch &&
        productMatch &&
        transportMatch &&
        brokerMatch &&
        remarkMatch &&
        termsMatch &&
        pncMatch &&
        invoiceRangeMatch &&
        taxRateMatch
      );
    });

    setFilteredEntries(filtered);
  }, [
    entries,
    selectedSupplier,
    selectedItems,
    formData.city,
    formData.vehicle,
    formData.stype,
    formData.v_tpt,
    formData.broker,
    formData.rem1,
    formData.terms,
    formData.pnc,
    formData.iFrom,
    formData.iUpto,
    formData.taxRate,
  ]);

  /** ---------- unique dropdown values ---------- **/
  const uniqueSuppliers = useMemo(() => {
    return [...new Set((entries || []).map((e) => e?.customerDetails?.[0]?.vacode))].filter(Boolean);
  }, [entries]);

  const uniqueItem = useMemo(() => {
    const vals = [];
    for (const e of entries || []) {
      const it = e?.items?.[0]?.sdisc;
      if (it) vals.push(it);
    }
    return [...new Set(vals)].filter(Boolean);
  }, [entries]);

  /** ---------- totals ---------- **/
  const formatAmount = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const totals = useMemo(() => {
    const list = filteredEntries || [];

    const totalGrandTotal = list.reduce((acc, e) => acc + Number(e?.formData?.grandtotal || 0), 0);
    const totalPaid = list.reduce((acc, e) => acc + Number(e?.formData?.paidAmount || 0), 0);
    const totalBalance = list.reduce((acc, e) => acc + Number(e?.formData?.balance || 0), 0);

    const totalCGST = list.reduce((acc, e) => acc + Number(e?.formData?.cgst || 0), 0);
    const totalSGST = list.reduce((acc, e) => acc + Number(e?.formData?.sgst || 0), 0);
    const totalIGST = list.reduce((acc, e) => acc + Number(e?.formData?.igst || 0), 0);
    const totalTAX = list.reduce((acc, e) => acc + Number(e?.formData?.sub_total || 0), 0);

    const totalWeight = list.reduce((acc, e) => acc + Number(e?.meta?.totalWeight || 0), 0);
    const totalPcs = list.reduce((acc, e) => acc + Number(e?.meta?.totalPkgs || 0), 0);

    const totalexp1 = list.reduce((acc, e) => acc + Number(e?.meta?.exp1 || 0), 0);
    const totalexp2 = list.reduce((acc, e) => acc + Number(e?.meta?.exp2 || 0), 0);
    const totalexp3 = list.reduce((acc, e) => acc + Number(e?.meta?.exp3 || 0), 0);
    const totalexp4 = list.reduce((acc, e) => acc + Number(e?.meta?.exp4 || 0), 0);
    const totalexp5 = list.reduce((acc, e) => acc + Number(e?.meta?.exp5 || 0), 0);

    const totalexp6 = list.reduce((acc, e) => acc + Number(e?.formData?.Exp6 || 0), 0);
    const totalexp7 = list.reduce((acc, e) => acc + Number(e?.formData?.Exp7 || 0), 0);
    const totalexp8 = list.reduce((acc, e) => acc + Number(e?.formData?.Exp8 || 0), 0);
    const totalexp9 = list.reduce((acc, e) => acc + Number(e?.formData?.Exp9 || 0), 0);
    const totalexp10 = list.reduce((acc, e) => acc + Number(e?.formData?.Exp10 || 0), 0);

    return {
      totalGrandTotal,
      totalPaid,
      totalBalance,
      totalCGST,
      totalSGST,
      totalIGST,
      totalTAX,
      totalWeight,
      totalPcs,
      totalexp1,
      totalexp2,
      totalexp3,
      totalexp4,
      totalexp5,
      totalexp6,
      totalexp7,
      totalexp8,
      totalexp9,
      totalexp10,
    };
  }, [filteredEntries]);

  /** ---------- sorted visible fields ---------- **/
  const sortedVisibleFields = useMemo(() => {
    return Object.keys(tableData)
      .filter((field) => tableData[field])
      .sort((a, b) => {
        const orderA = parseInt(columnOrder[a]) || 999;
        const orderB = parseInt(columnOrder[b]) || 999;
        return orderA - orderB;
      });
  }, [tableData, columnOrder]);

  /** ---------- UI helpers ---------- **/
  const cardStyle = {
    background: "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,255,255,0.88))",
    border: "1px solid rgba(0,0,0,0.06)",
    borderRadius: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    overflow: "hidden",
  };

  const softBtn = {
    height: 40,
    borderRadius: 10,
    paddingInline: 14,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 700,
  };

  const isNumericCol = (field) =>
    ["weight","pcs","value","cgst","sgst","igst","netvalue","exp1","exp2","exp3","exp4","exp5","exp6","exp7","exp8","exp9","exp10"].includes(field);

  const thLabel = (field) => {
    const map = {
      date: "Date",
      billno: "Bill No.",
      accountname: "A/C Name",
      weight: "Qty",
      pcs: "Pcs",
      city: "City",
      gstin: "GSTIN",
      value: "Bill Value",
      cgst: "C.Tax",
      sgst: "S.Tax",
      igst: "I.Tax",
      netvalue: "Net Value",
      description: "Description",
      vehicleno: "Vehicle No",
      remarks: "Remarks",
      transport: "Transport",
      broker: "Broker",
      taxtype: "Tax Type",
    };
    return map[field] || field.toUpperCase();
  };

  /** ---------- keyboard nav ---------- **/
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!filteredEntries?.length) return;

      if (showPaymentModal || moreModalOpen || tableModalOpen || modalOpen) return;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveRowIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveRowIndex((prev) => Math.min(filteredEntries.length - 1, prev + 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const entry = filteredEntries[activeRowIndex];
        if (entry?._id) {
          navigate("/sale", { state: { saleId: entry._id, rowIndex: activeRowIndex } });
          localStorage.setItem(SELECTED_ROW_KEY, String(activeRowIndex));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredEntries, activeRowIndex, navigate, showPaymentModal, moreModalOpen, tableModalOpen, modalOpen]);

  // restore row focus
  useEffect(() => {
    const savedIndex = localStorage.getItem(SELECTED_ROW_KEY);
    if (savedIndex !== null) {
      const idx = parseInt(savedIndex, 10);
      if (!isNaN(idx)) {
        setActiveRowIndex(idx);
        setTimeout(() => {
          rowRefs.current[idx]?.focus?.();
          rowRefs.current[idx]?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
        }, 0);
      }
    }
  }, []);

  if (!tenant) return <p style={{ padding: 12 }}>❌ No company selected (tenant missing).</p>;

  if (loading)
    return (
      <div style={{ padding: 18 }}>
        <div style={cardStyle}>
          <div style={{ padding: 18 }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>Loading Receipt List…</div>
            <div style={{ opacity: 0.75, marginTop: 6 }}>Please wait</div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div style={{ padding: 18 }}>
        <div style={{ ...cardStyle, borderColor: "rgba(255,0,0,0.22)" }}>
          <div style={{ padding: 18 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: "crimson" }}>Error</div>
            <div style={{ marginTop: 6 }}>{error}</div>
            <Button onClick={fetchEntries} variant="secondary" style={{ marginTop: 12, ...softBtn }}>
              <FaSyncAlt /> Retry
            </Button>
          </div>
        </div>
      </div>
    );

  return (
    <div style={{ padding: 18 }}>
      {/* ===== Header ===== */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: 0.2 }}>
            📒 RECEIPT LIST{" "}
            <Badge bg="primary" style={{ fontSize: 12, marginLeft: 8, borderRadius: 999 }}>
              Only Pending
            </Badge>
          </div>
          <div style={{ marginTop: 2, opacity: 0.75, fontSize: 13 }}>
            Keyboard: <b>↑ ↓</b> to move, <b>Enter</b> to open Sale
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, opacity: 0.8 }}>From</span>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="dd/MM/yyyy"
              className="datepickerBank"
              placeholderText="From Date"
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, opacity: 0.8 }}>To</span>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}
              dateFormat="dd/MM/yyyy"
              className="datepickerBank2"
              placeholderText="To Date"
            />
          </div>
        </div>
      </div>

      {/* ===== Sticky Toolbar ===== */}
      <div style={{ position: "sticky", top: 10, zIndex: 20, marginBottom: 12 }}>
        <div
          style={{
            ...cardStyle,
            padding: 12,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            backdropFilter: "blur(10px)",
          }}
        >
          {/* left summary */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Badge bg="light" text="dark" style={{ borderRadius: 999, padding: "8px 10px" }}>
              Rows: <b>{filteredEntries.length}</b>
            </Badge>
            <Badge bg="light" text="dark" style={{ borderRadius: 999, padding: "8px 10px" }}>
              Paid: <b>{formatAmount(totals.totalPaid)}</b>
            </Badge>
            <Badge bg="light" text="dark" style={{ borderRadius: 999, padding: "8px 10px" }}>
              Balance: <b>{formatAmount(totals.totalBalance)}</b>
            </Badge>
          </div>

          {/* actions */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Button onClick={() => setModalOpen(true)} variant="primary" style={softBtn}>
              <FaPrint /> Print
            </Button>

            <Button onClick={() => setMoreModalOpen(true)} variant="outline-primary" style={softBtn}>
              <FaFilter /> More
            </Button>

            <Button variant="outline-secondary" style={softBtn} onClick={fetchEntries} title="Refresh">
              <FaSyncAlt /> Refresh
            </Button>

            <button
              onClick={() => settableModalOpen(true)}
              title="Settings"
              style={{
                height: 40,
                width: 44,
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "white",
                display: "grid",
                placeItems: "center",
              }}
              type="button"
            >
              <FaCog size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Print Component (hidden) */}
      <div style={{ display: "none" }}>
        <ReceiptListPrint
          isOpen={modalOpen}
          handleClose={() => setModalOpen(false)}
          items={filteredEntries}
          fromDate={fromDate}
          toDate={toDate}
          tableData={tableData}
          fontWeight={fontWeight}
          sortedVisibleFields={sortedVisibleFields}
        />
      </div>

      {/* More Modal */}
      <Modal show={moreModalOpen} onHide={() => setMoreModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "3px" }}>
            <span style={{ fontWeight: "bold" }}>A/c Name</span>
            <Form.Select className={styles.filterz} value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
              <option value="">All</option>
              {uniqueSuppliers.map((vacode, index) => (
                <option key={index} value={vacode}>
                  {vacode}
                </option>
              ))}
            </Form.Select>
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "3px" }}>
            <span style={{ fontWeight: "bold" }}>City</span>
            <input className={styles.citY} id="city" value={formData.city} onChange={handleAlphabetOnly} />
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "3px" }}>
            <span style={{ fontWeight: "bold" }}>Vehicle No</span>
            <input className={styles.vehicle} id="vehicle" value={formData.vehicle} onChange={handleChangevalues} />
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "3px" }}>
            <span style={{ fontWeight: "bold", marginLeft: 2 }}>TaxType</span>
            <Form.Select id="stype" className={styles.stype} style={{ marginTop: "0px" }} value={formData.stype} onChange={handleChangevalues}>
              <option value="All">All</option>
              <option value="GST Sale (RD)">GST Sale (RD)</option>
              <option value="IGST Sale (RD)">IGST Sale (RD)</option>
              <option value="GST (URD)">GST (URD)</option>
              <option value="IGST (URD)">IGST (URD)</option>
              <option value="Tax Free Within State">Tax Free Within State</option>
              <option value="Tax Free Interstate">Tax Free Interstate</option>
              <option value="Export Sale">Export Sale</option>
              <option value="Export Sale(IGST)">Export Sale(IGST)</option>
              <option value="Including GST">Including GST</option>
              <option value="Including IGST">Including IGST</option>
              <option value="Not Applicable">Not Applicable</option>
              <option value="Exempted Sale">Exempted Sale</option>
            </Form.Select>
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "3px" }}>
            <span style={{ fontWeight: "bold" }}>Product Name</span>
            <Form.Select className={styles.pName} value={selectedItems} onChange={(e) => setSelectedItems(e.target.value)}>
              <option value="">All</option>
              {uniqueItem.map((sdisc, index) => (
                <option key={index} value={sdisc}>
                  {sdisc}
                </option>
              ))}
            </Form.Select>
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "3px" }}>
            <span style={{ fontWeight: "bold" }}>Transport</span>
            <input className={styles.tpt} id="v_tpt" value={formData.v_tpt} onChange={handleChangevalues} />
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "3px" }}>
            <span style={{ fontWeight: "bold" }}>Broker</span>
            <input className={styles.broker} id="broker" value={formData.broker} onChange={handleChangevalues} />
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "3px" }}>
            <span style={{ fontWeight: "bold" }}>Remarks</span>
            <input className={styles.rem} id="rem1" value={formData.rem1} onChange={handleChangevalues} />
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "3px" }}>
            <span style={{ fontWeight: "bold", marginLeft: 2 }}>Pos/Neg/Cancel</span>
            <Form.Select id="pnc" className={styles.pnc} style={{ marginTop: "0px" }} value={formData.pnc} onChange={handleChangevalues}>
              <option value="All">All</option>
              <option value="Positive">Positive</option>
              <option value="Negative">Negative</option>
              <option value="Cancel">Cancel</option>
            </Form.Select>

            <span style={{ fontWeight: "bold", marginLeft: 5 }}>Terms</span>
            <input className={styles.terms} id="terms" value={formData.terms} onChange={handleChangevalues} />
          </div>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "6px" }}>
            <span style={{ fontWeight: "bold", marginLeft: 2 }}>Inv From</span>
            <input style={{ width: 90, marginLeft: 8 }} id="iFrom" value={formData.iFrom} onChange={handleChangevalues} />
            <span style={{ fontWeight: "bold", marginLeft: 12 }}>Inv Upto</span>
            <input style={{ width: 90, marginLeft: 8 }} id="iUpto" value={formData.iUpto} onChange={handleChangevalues} />
            <span style={{ fontWeight: "bold", marginLeft: 12 }}>TaxRate</span>
            <input style={{ width: 90, marginLeft: 8 }} id="taxRate" value={formData.taxRate} onChange={handleChangevalues} />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMoreModalOpen(false)} style={softBtn}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Table fields */}
      <Modal show={tableModalOpen} onHide={() => settableModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Table Settings</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ display: "flex", flexDirection: "column" }}>
          <span style={{ fontWeight: "bold", marginTop: "10px" }}>
            Select Font Weight <span style={{ marginLeft: "38%" }}>Font Size</span>
          </span>

          <div style={{ display: "flex", flexDirection: "row" }}>
            <Form.Select className={styles.filterzFont} style={{ marginTop: "0px" }} value={fontWeight} onChange={(e) => setFontWeight(e.target.value)}>
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </Form.Select>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "15%" }}>
              <Button
                variant="outline-secondary"
                onClick={() => setFontSize((prev) => Math.max(prev - 1, 10))}
                style={{ fontSize: "18px", padding: "0px 10px", backgroundColor: "darkblue", border: "transparent", color: "white" }}
              >
                −
              </Button>
              <span style={{ fontSize: "16px", minWidth: "30px", textAlign: "center" }}>{fontSize}px</span>
              <Button
                variant="outline-secondary"
                onClick={() => setFontSize((prev) => Math.min(prev + 1, 25))}
                style={{ fontSize: "18px", padding: "0px 10px", backgroundColor: "darkblue", border: "transparent", color: "white" }}
              >
                +
              </Button>
            </div>
          </div>

          <span style={{ fontSize: 17, fontWeight: "bold", marginTop: "10px" }}>SELECT TABLE FIELDS</span>

          <div style={{ display: "flex", flexDirection: "column", padding: "5px", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 12, height: "340px", overflow: "auto" }}>
            <div style={{ marginTop: "10px", display: "flex", flexDirection: "column" }}>
              {Object.keys(tableData).map((field) => (
                <div
                  key={field}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    padding: "6px 8px",
                    borderRadius: 10,
                    background: "rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={tableData[field]}
                      onChange={() => handleCheckboxChange(field)}
                      style={{ width: "16px", height: "16px", marginRight: "10px" }}
                    />
                    <span style={{ marginRight: "8px", minWidth: "120px", fontWeight: 800 }}>{field.toUpperCase()}</span>
                  </div>

                  <input
                    type="number"
                    min="1"
                    value={columnOrder[field] || ""}
                    onChange={(e) => handleSerialChange(field, e.target.value)}
                    placeholder="Order"
                    style={{
                      width: "90px",
                      padding: "6px 10px",
                      border: "1px solid rgba(0,0,0,0.18)",
                      borderRadius: 10,
                      background: "white",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => settableModalOpen(false)} style={softBtn}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ===== Main Table Card ===== */}
      <div style={cardStyle}>
        <div
          ref={tableRef}
          tabIndex={0}
          style={{
            maxHeight: 560,
            overflow: "auto",
            outline: "none",
          }}
        >
          <Table bordered hover className="custom-table" style={{ marginBottom: 0 }}>
            <thead
              style={{
                backgroundColor: "skyblue",
                position: "sticky",
                top: 0,
                zIndex: 5,
                textAlign: "center",
                fontSize: `${fontSize}px`,
                boxShadow: "0 2px 0 rgba(0,0,0,0.06)",
              }}
            >
              <tr>
                {sortedVisibleFields.map((field) => (
                  <th key={field} style={{ whiteSpace: "nowrap" }}>
                    {thLabel(field)}
                  </th>
                ))}
                <th style={{ whiteSpace: "nowrap" }}>Paid</th>
                <th style={{ whiteSpace: "nowrap" }}>Balance</th>
                <th style={{ whiteSpace: "nowrap" }}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={sortedVisibleFields.length + 3} style={{ padding: 20, textAlign: "center", opacity: 0.75 }}>
                    No data found for selected filters.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry, index) => {
                  const f = entry?.formData || {};
                  const cust = entry?.customerDetails?.[0] || {};
                  const meta = entry?.meta || {};
                  const items = Array.isArray(entry?.items) ? entry.items : [];

                  const isActive = index === activeRowIndex;

                  return (
                    <tr
                      key={entry?._id || index}
                      ref={(el) => (rowRefs.current[index] = el)}
                      tabIndex={0}
                      onMouseEnter={() => setActiveRowIndex(index)}
                      onClick={() => {
                        navigate("/sale", { state: { saleId: entry._id, rowIndex: index } });
                        localStorage.setItem(SELECTED_ROW_KEY, String(index));
                      }}
                      style={{
                        backgroundColor: isActive ? "rgba(25, 118, 210, 0.12)" : "",
                        cursor: "pointer",
                        fontWeight: fontWeight,
                        fontSize: `${fontSize}px`,
                        transition: "background 140ms ease",
                      }}
                    >
                      {sortedVisibleFields.map((field) => {
                        let value = "";

                        if (field === "date") value = formatDateDisplay(f?.date);
                        else if (field === "billno") value = f?.vno || "";
                        else if (field === "accountname") value = cust?.vacode || "";
                        else if (field === "weight") value = Number(meta?.totalWeight || 0).toFixed(3);
                        else if (field === "pcs") value = Number(meta?.totalPkgs || 0).toFixed(3);
                        else if (field === "city") value = cust?.city || "";
                        else if (field === "gstin") value = cust?.gstno || "";
                        else if (field === "value") value = f?.grandtotal || "";
                        else if (field === "cgst") value = f?.cgst || "";
                        else if (field === "sgst") value = f?.sgst || "";
                        else if (field === "igst") value = f?.igst || "";
                        else if (field === "netvalue") value = f?.sub_total || "";
                        else if (field === "exp1") value = Number(meta?.exp1 || 0).toFixed(2);
                        else if (field === "exp2") value = Number(meta?.exp2 || 0).toFixed(2);
                        else if (field === "exp3") value = Number(meta?.exp3 || 0).toFixed(2);
                        else if (field === "exp4") value = Number(meta?.exp4 || 0).toFixed(2);
                        else if (field === "exp5") value = Number(meta?.exp5 || 0).toFixed(2);
                        else if (field === "exp6") value = f?.Exp6 || "";
                        else if (field === "exp7") value = f?.Exp7 || "";
                        else if (field === "exp8") value = f?.Exp8 || "";
                        else if (field === "exp9") value = f?.Exp9 || "";
                        else if (field === "exp10") value = f?.Exp10 || "";
                        else if (field === "description") value = meta?.firstSdisc || items?.[0]?.sdisc || "";
                        else if (field === "vehicleno") value = f?.trpt || "";
                        else if (field === "remarks") value = f?.rem2 || "";
                        else if (field === "transport") value = f?.v_tpt || "";
                        else if (field === "broker") value = f?.broker || "";
                        else if (field === "taxtype") value = f?.stype || "";

                        return (
                          <td
                            key={field}
                            style={{
                              whiteSpace: field === "date" || field === "billno" ? "nowrap" : "normal",
                              textAlign: isNumericCol(field) ? "right" : "left",
                              verticalAlign: "middle",
                            }}
                          >
                            {value}
                          </td>
                        );
                      })}

                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>{formatAmount(f?.paidAmount)}</td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap", fontWeight: 800, color: "#0b5ed7" }}>
                        {formatAmount(f?.balance)}
                      </td>

                      <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEntry(entry);
                            setShowPaymentModal(true);
                          }}
                          style={{ borderRadius: 10, fontWeight: 800 }}
                        >
                          Make Receipt
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            <tfoot
              style={{
                backgroundColor: "skyblue",
                position: "sticky",
                bottom: 0,
                fontWeight,
                fontSize: `${fontSize}px`,
                boxShadow: "0 -2px 0 rgba(0,0,0,0.06)",
              }}
            >
              <tr>
                {sortedVisibleFields.map((field) => {
                  let value = "";

                  if (field === "date") value = "TOTAL";
                  else if (field === "value") value = totals.totalGrandTotal.toFixed(2);
                  else if (field === "cgst") value = totals.totalCGST.toFixed(2);
                  else if (field === "sgst") value = totals.totalSGST.toFixed(2);
                  else if (field === "igst") value = totals.totalIGST.toFixed(2);
                  else if (field === "netvalue") value = totals.totalTAX.toFixed(2);
                  else if (field === "weight") value = totals.totalWeight.toFixed(3);
                  else if (field === "pcs") value = totals.totalPcs.toFixed(3);
                  else if (field === "exp1") value = totals.totalexp1.toFixed(2);
                  else if (field === "exp2") value = totals.totalexp2.toFixed(2);
                  else if (field === "exp3") value = totals.totalexp3.toFixed(2);
                  else if (field === "exp4") value = totals.totalexp4.toFixed(2);
                  else if (field === "exp5") value = totals.totalexp5.toFixed(2);
                  else if (field === "exp6") value = totals.totalexp6.toFixed(2);
                  else if (field === "exp7") value = totals.totalexp7.toFixed(2);
                  else if (field === "exp8") value = totals.totalexp8.toFixed(2);
                  else if (field === "exp9") value = totals.totalexp9.toFixed(2);
                  else if (field === "exp10") value = totals.totalexp10.toFixed(2);

                  return (
                    <td
                      key={field}
                      style={{
                        fontWeight: value ? "bold" : "",
                        color: value ? "red" : "",
                        textAlign: isNumericCol(field) ? "right" : "left",
                        whiteSpace: field === "date" ? "nowrap" : "normal",
                      }}
                    >
                      {value}
                    </td>
                  );
                })}

                <td style={{ fontWeight: "bold", color: "red", textAlign: "right" }}>{formatAmount(totals.totalPaid)}</td>
                <td style={{ fontWeight: "bold", color: "red", textAlign: "right" }}>{formatAmount(totals.totalBalance)}</td>
                <td></td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>

      <ReceiptModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        entry={selectedEntry}
        onPaymentSaved={fetchEntries}
      />
    </div>
  );
};

export default ReceiptList;
