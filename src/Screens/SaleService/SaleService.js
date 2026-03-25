// import React, { useState, useEffect, useRef } from "react";
// import "./SaleService.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Table from "react-bootstrap/Table";
// import Button from "react-bootstrap/Button";
// import { BiTrash } from "react-icons/bi";
// import ProductModalCustomer from "../Modals/ProductModalCustomer";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { useReactToPrint } from "react-to-print";
// import Modal from "@mui/material/Modal";
// import CloseIcon from "@mui/icons-material/Close";
// import { FaPlus, FaMinus } from "react-icons/fa";
// import { Select, MenuItem, FormControl, Box } from "@mui/material";
// import { event } from "jquery";
// import { useEditMode } from "../../EditModeContext";
// import { CompanyContext } from '../Context/CompanyContext';
// import { useContext } from "react";

// const SaleService = () => {
  
//  const { company } = useContext(CompanyContext);
//    const tenant = company?.databaseName;
 
//    if (!tenant) {
//      // you may want to guard here or show an error state,
//      // since without a tenant you can’t hit the right API
//      console.error("No tenant selected!");
//    }

//   const [title, setTitle] = useState("(View)");
//   const datePickerRef = useRef(null);
//   const itemCodeRefs = useRef([]);
//   const desciptionRefs = useRef([]);
//   const peciesRefs = useRef([]);
//   const quantityRefs = useRef([]);
//   const priceRefs = useRef([]);
//   const amountRefs = useRef([]);
//   const gstRefs = useRef([]);
//   const othersRefs = useRef([]);
//   const cgstRefs = useRef([]);
//   const sgstRefs = useRef([]);
//   const igstRefs = useRef([]);
//   const hsnCodeRefs = useRef([]);
//   const saveButtonRef = useRef(null);
//   const shippedtoRef = useRef(null);
//   const remarksRef = useRef(null);
//   const transportRef = useRef(null);
//   const brokerRef = useRef(null);
//   const tdsRef = useRef([]);
//   const tcsRef = useRef([]);
//   const tcsRef2 = useRef([]);
//   const advanceRef = useRef(null);
//   const gstRef = useRef(null);
//   const addLessRef = useRef(null);
//   const expAfterGSTRef = useRef(null);
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const [custGst, setCustgst] = useState("");
//   const initialColors = [ "#E9967A","#F0E68C","#FFDEAD","#ADD8E6","#87CEFA","#FFF0F5","#FFC0CB","#D8BFD8","#DC143C","#DCDCDC","#8FBC8F",];
//   const [buttonColors, setButtonColors] = useState(initialColors); // Initial colors
//   const [formData, setFormData] = useState({
//     date: "",
//     vtype: "S",
//     vbillno: 0,
//     gr: "",
//     exfor: "",
//     trpt: "",
//     stype: "",
//     btype: "",
//     conv: "",
//     rem1: "",
//     rem2: "",
//     v_tpt: "",
//     broker: "",
//     srv_rate: 0,
//     srv_tax: 0,
//     tcs1_rate: 0,
//     tcs1: 0,
//     tcs206_rate: 0,
//     tcs206: 0,
//     duedate: "",
//     pcess: 0,
//     tax: 0,
//     sub_total: 0,
//     exp_before: 0,
//     cgst: 0,
//     sgst: 0,
//     igst: 0,
//     expafterGST: 0,
//     grandtotal: 0,
//     items: [
//       {
//         id: 1,
//         vcode: "",
//         sdisc: "",
//         pkgs: 0,
//         weight: 1,
//         rate: 0,
//         gst: 0,
//         exp_before: 0,
//         ctax: 0,
//         stax: 0,
//         itax: 0,
//         tariff: "",
//         vamt: 0,
//       },
//     ], // Initialize items array
//     customerDetails: [
//       {
//         vacode: "",
//         gstno: "",
//         pan: "",
//         city: "",
//         state: "",
//       },
//     ],
//     shipped: [
//       {
//         shippedto: "",
//         shippingAdd: "",
//         shippingState: "",
//         shippingGst: "",
//       },
//     ],
//   });
//   const [customerDetails, setcustomerDetails] = useState([
//     {
//       vacode: "",
//       gstno: "",
//       pan: "",
//       city: "",
//       state: "",
//     },
//   ]);
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       vcode: "",
//       sdisc: "",
//       pkgs: 0,
//       weight: 1,
//       rate: 0,
//       amount: 0,
//       gst: 0,
//       exp_before: 0,
//       ctax: 0,
//       stax: 0,
//       itax: 0,
//       tariff: "",
//       vamt: 0,
//     },
//   ]);
//   const [shipped, setshipped] = useState([
//     {
//       shippedto: "",
//       shippingAdd: "",
//       shippingState: "",
//       shippingGst: "",
//       shippingPan: "",
//     },
//   ]);
//   const customerNameRef = useRef(null);
//   const grNoRef = useRef(null);
//   const termsRef = useRef(null);
//   const vehicleNoRef = useRef(null);
//   const tableRef = useRef(null);
//   const handleEnterKeyPress = (currentRef, nextRef) => (event) => {
//     if (event.key === "Enter") {
//       event.preventDefault();
//       if (nextRef && nextRef.current) {
//         nextRef.current.focus();
//       } else {
//         if (tableRef.current) {
//           const firstInputInTable = tableRef.current.querySelector("input");
//           if (firstInputInTable) {
//             firstInputInTable.focus();
//           }
//         }
//       }
//     }
//   };

//   const calculateTotalGst = (event) => {
//     let gsttotal = 0;
//     let cgstTotal = 0;
//     let sgstTotal = 0;
//     let igstTotal = 0;
//     let totalvalue = 0;
//     let value = 1;
//     let grandTotal = 0;
//     let totalothers = 0;
//     items.forEach((item) => {
//       value = parseFloat(item.weight) * parseFloat(item.rate);
//       totalvalue += value;
//       cgstTotal += parseFloat(item.ctax || 0);
//       sgstTotal += parseFloat(item.stax || 0);
//       igstTotal += parseFloat(item.itax || 0);
//       grandTotal += parseFloat(item.vamt);
//       totalothers += parseFloat(item.exp_before);
//       gsttotal = cgstTotal + sgstTotal + igstTotal;
//     });
//     // Update cgst, sgst, and igst fields in formData state
//     setFormData((prevState) => ({
//       ...prevState,
//       tax: gsttotal.toFixed(2),
//       cgst: cgstTotal.toFixed(2),
//       sgst: sgstTotal.toFixed(2),
//       igst: igstTotal.toFixed(2),
//       sub_total: totalvalue.toFixed(2),
//       grandtotal: grandTotal.toFixed(2),
//       exp_before: totalothers.toFixed(2),
//     }));
//   };
//   useEffect(() => {
//     calculateTotalGst();
//   }, [items]);
//    const [T11, setT11] = useState(false);
//       const [T12, setT12] = useState(false);
//       const [T21, setT21] = useState(false);
//       const [pkgsValue, setpkgsValue] = useState(null); 
//       const [weightValue, setweightValue] = useState(null); 
//       const [rateValue, setrateValue] = useState(null); 
//      useEffect(() => {
//        fetchSalesSetup();
//      }, []);
//      const fetchSalesSetup = async () => {
//       try {
//         const response = await fetch(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/api/salesetup`);
//         if (!response.ok) throw new Error("Failed to fetch sales setup");
    
//         const data = await response.json();
    
//         if (Array.isArray(data) && data.length > 0 && data[0].formData) {
//           const formDataFromAPI = data[0].formData;
//           const T21Value = formDataFromAPI.T21;
//           const T11Value = formDataFromAPI.T11;
//           const T12Value = formDataFromAPI.T12;
//           setpkgsValue(formDataFromAPI.pkgs);
//           setweightValue(formDataFromAPI.weight);
//           setrateValue(formDataFromAPI.rate);   
//           // Update T21 and T12 states
//           setT21(T21Value === "Yes");
//           setT12(T12Value === "Yes");
//           setT11(T11Value === "Yes");
//         } else {
//           throw new Error("Invalid response structure");
//         }
//       } catch (error) {
//         console.error("Error fetching sales setup:", error.message);
//       }
//     };
//     const [data, setData] = useState([]);
//     const [data1, setData1] = useState([]);
//     const [index, setIndex] = useState(0);
//     const [isAddEnabled, setIsAddEnabled] = useState(true);
//     const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
//     const { isEditMode, setIsEditMode } = useEditMode(); // Access the context
//     const [isAbcmode, setIsAbcmode] = useState(false);
//     const [isEditMode2, setIsEditMode2] = useState(false); // State to track edit mode
//     const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
//   const [firstTimeCheckData, setFirstTimeCheckData] = useState("");

//   const fetchData = async () => {
//     try {
//         const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/salegst/last`);
//         console.log("Response: ", response.data);

//         if (response.status === 200 && response.data.data) {
//             const lastEntry = response.data.data;
//             // Set flags and update form data
//             console.log("sadasd",formData);
//             setFirstTimeCheckData("DataAvailable");
//             setFormData(lastEntry.formData);
//             console.log(lastEntry.formData, "Formdata2");

//             // Update items with the last entry's items
//             const updatedItems = lastEntry.items.map(item => ({
//                 ...item, // Ensure immutability
//             }));
//             const updatedItems2 = lastEntry.customerDetails.map(item => ({
//                 ...item, // Ensure immutability
//             }));
//             const updatedItems3 = lastEntry.shipped.map(item => ({
//               ...item, // Ensure immutability
//           }));
//           setItems(updatedItems);
//           setcustomerDetails(updatedItems2);
//           setshipped(updatedItems3);
//             // Set data and index
//             setData1(lastEntry); // Assuming setData1 holds the current entry data
//             setIndex(lastEntry.voucherno); // Set index to the voucher number or another identifier
//         } else {
//             setFirstTimeCheckData("DataNotAvailable");
//             console.log("No data available");
//             // Create an empty data object with voucher number 0
//             const emptyFormData = {
//                 date: new Date().toLocaleDateString(), // Use today's date
//                 vtype: "S",
//                 vbillno: 0,
//                 gr: "",
//                 exfor: "",
//                 trpt: "",
//                 stype: "",
//                 btype: "",
//                 conv: "",
//                 rem1: "",
//                 rem2: "",
//                 v_tpt: "",
//                 broker: "", 
//                 srv_rate: 0,
//                 srv_tax: 0,
//                 tcs1_rate: 0,
//                 tcs1: 0,
//                 tcs206_rate: 0,
//                 tcs206: 0,
//                 duedate: "",
//                 pcess: 0,
//                 tax: 0,
//                 sub_total: 0,
//                 exp_before: 0,
//                 cgst: 0,
//                 sgst: 0,
//                 igst: 0,
//                 expafterGST: 0,
//                 grandtotal: 0,
//             };
//             const emptyItems = [{    
//               id: 1,
//               vcode: "",
//               sdisc: "",
//               pkgs: 0,
//               weight: 1,
//               rate: 0,
//               amount: 0,
//               gst: 0,
//               exp_before: 0,
//               ctax: 0,
//               stax: 0,
//               itax: 0,
//               tariff: "",
//               vamt: 0,
//             }];
//             const emptyshipped = [{    
//               shippedto: "",
//               shippingAdd: "",
//               shippingState: "",
//               shippingGst: "",
//               shippingPan: "",
//             }];
//             const emptycustomer = [{    
//               vacode: "",
//               gstno: "",
//               pan: "",
//               city: "",
//               state: "",
//             }];
//                 // Set the empty data
//             setFormData(emptyFormData);
//             setItems(emptyItems);
//             setcustomerDetails(emptycustomer)
//             setshipped(emptyshipped);
//             setData1({ formData: emptyFormData, items: emptyItems, shipped:emptyshipped,customerDetails:emptycustomer}); // Store empty data
//             setIndex(0); 
//         }
//     } catch (error) {
//         console.error("Error fetching data", error);
//         // In case of error, you can also initialize empty data if needed
//         const emptyFormData = {
//           date: new Date().toLocaleDateString(), // Use today's date
//           vtype: "S",
//           vbillno: 0,
//           gr: "",
//           exfor: "",
//           trpt: "",
//           stype: "",
//           btype: "",
//           conv: "",
//           rem1: "",
//           rem2: "",
//           v_tpt: "",
//           broker: "", 
//           srv_rate: 0,
//           srv_tax: 0,
//           tcs1_rate: 0,
//           tcs1: 0,
//           tcs206_rate: 0,
//           tcs206: 0,
//           duedate: "",
//           pcess: 0,
//           tax: 0,
//           sub_total: 0,
//           exp_before: 0,
//           cgst: 0,
//           sgst: 0,
//           igst: 0,
//           expafterGST: 0,
//           grandtotal: 0,
//       };
//       const emptyItems = [{    
//         id: 1,
//         vcode: "",
//         sdisc: "",
//         pkgs: 0,
//         weight: 1,
//         rate: 0,
//         amount: 0,
//         gst: 0,
//         exp_before: 0,
//         ctax: 0,
//         stax: 0,
//         itax: 0,
//         tariff: "",
//         vamt: 0,
//       }];
//       const emptyshipped = [{    
//         shippedto: "",
//         shippingAdd: "",
//         shippingState: "",
//         shippingGst: "",
//         shippingPan: "",
//       }];
//       const emptycustomer = [{    
//         vacode: "",
//         gstno: "",
//         pan: "",
//         city: "",
//         state: "",
//       }];
//       // Set the empty data
//       setFormData(emptyFormData);
//       setItems(emptyItems);
//       setcustomerDetails(emptycustomer)
//       setshipped(emptyshipped);
//       setData1({ formData: emptyFormData, items: emptyItems, shipped:emptyshipped,customerDetails:emptycustomer}); // Store empty data
//       setIndex(0); 
//     }
// };
 
//   useEffect(() => {
//     fetchData(); 
//   }, []); 

//   useEffect(() => {
//     if (data.length > 0) {
//       setFormData(data[data.length - 1]); // Set currentData to the last record
//       setIndex(data.length - 1);
//     }
//   }, [data]);

//   // Add this line to set isDisabled to true initially
//   useEffect(() => {
//     setIsDisabled(true);
//   }, []);

//   const handleNext = async () => {
//     document.body.style.backgroundColor = 'white';
//     setTitle("(View)");
//     console.log(data1._id)
//     try {
//         if (data1) {
//             const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/salegst/${data1._id}/next`);
//             if (response.status === 200 && response.data) {
//                 const nextData = response.data.data;
//                 setData1(response.data.data);
//                 setIndex(index + 1);
//                 setFormData(nextData.formData);
//                 const updatedItems = nextData.items.map(item => ({
//                     ...item, 
//                 }));
//                 const updatedCustomer = nextData.customerDetails.map(item => ({
//                   ...item, 
//               }));
//               const updatedShipped = nextData.shipped.map(item => ({
//                 ...item, 
//             }));
//             console.log("items:",updatedItems);
            
//                 setItems(updatedItems);
//                 setcustomerDetails(updatedCustomer);
//                 setshipped(updatedShipped);
//                 setIsDisabled(true);
//             }
//         }
//     } catch (error) {
//         console.error("Error fetching next record:", error);
//     }
// };

// const handlePrevious = async () => {
//     document.body.style.backgroundColor = 'white';
//     setTitle("(View)");
//     try {
//         if (data1) {
//             const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/salegst/${data1._id}/previous`);
//             if (response.status === 200 && response.data) {
//                 console.log(response);
//                 setData1(response.data.data);
//                 const prevData = response.data.data;
//                 setIndex(index - 1);
//                 setFormData(prevData.formData);
//                 const updatedItems = prevData.items.map(item => ({
//                   ...item, 
//               }));
//               const updatedCustomer = prevData.customerDetails.map(item => ({
//                 ...item, 
//             }));
//             const updatedShipped = prevData.shipped.map(item => ({
//               ...item, 
//           }));
//           console.log("items:",updatedItems);
//               setItems(updatedItems);
//               setcustomerDetails(updatedCustomer);
//               setshipped(updatedShipped);
//                 setIsDisabled(true);
//             }
//         }
//     } catch (error) {
//         console.error("Error fetching previous record:", error);
//     }
// };

// const handleFirst = async () => {
//     document.body.style.backgroundColor = 'white';
//     setTitle("(View)");

//     try {
//         const response = await axios.get(`http://103.154.233.29:3007/au${tenant}/tenant/salegst/first`);
//         if (response.status === 200 && response.data) {
//             const firstData = response.data.data;
//             setIndex(0);
//             setFormData(firstData.formData);
//             setData1(response.data.data);
//             const updatedItems = firstData.items.map(item => ({
//               ...item, 
//           }));
//           const updatedCustomer = firstData.customerDetails.map(item => ({
//             ...item, 
//         }));
//         const updatedShipped = firstData.shipped.map(item => ({
//           ...item, 
//       }));
//           setItems(updatedItems);
//           setcustomerDetails(updatedCustomer);
//           setshipped(updatedShipped);
//             setIsDisabled(true);
//         }
//     } catch (error) {
//         console.error("Error fetching first record:", error);
//     }
// };

// const handleLast = async () => {
//     document.body.style.backgroundColor = 'white';
//     setTitle("(View)");

//     try {
//         const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/salegst/last`);
//         if (response.status === 200 && response.data) {
//             const lastData = response.data.data;
//             const lastIndex = response.data.length - 1;
//             setIndex(lastIndex);
//             setFormData(lastData.formData);
//             setData1(response.data.data);
//             const updatedItems = lastData.items.map(item => ({
//               ...item, 
//           }));
//           const updatedCustomer = lastData.customerDetails.map(item => ({
//             ...item, 
//         }));
//         const updatedShipped = lastData.shipped.map(item => ({
//           ...item, 
//       }));
//           setItems(updatedItems);
//           setcustomerDetails(updatedCustomer);
//           setshipped(updatedShipped);
//             setIsDisabled(true);
//         }
//     } catch (error) {
//         console.error("Error fetching last record:", error);
//     }
// };

// const handleAdd = async () => {
//   document.body.style.backgroundColor = '#D5ECF3';
//   try {
//       await fetchData(); // This should set up the state correctly whether data is found or not
//       let lastvoucherno = formData.vbillno ? parseInt(formData.vbillno) + 1 : 1;
//       const newData = {
//         date: "",
//         vtype: "S",
//         vbillno: lastvoucherno,
//         gr: "",
//         exfor: "",
//         trpt: "",
//         stype: "",
//         btype: "",
//         conv: "",
//         rem1: "",
//         rem2: "",
//         v_tpt: "",
//         broker: "",
//         srv_rate: 0,
//         srv_tax: 0,
//         tcs1_rate: 0,
//         tcs1: 0,
//         tcs206_rate: 0,
//         tcs206: 0,
//         duedate: "",
//         pcess: 0,
//         tax: 0,
//         sub_total: 0,
//         exp_before: 0,
//         cgst: 0,
//         sgst: 0,
//         igst: 0,
//         expafterGST: 0,
//         grandtotal: 0,
//       };
//       setData([...data, newData]);
//       setFormData(newData);
//       setItems([{ 
//         id: 1,
//         vcode: "",
//         sdisc: "",
//         pkgs: 0,
//         weight: 0,
//         rate: 0,
//         amount: 0,
//         gst: 0,
//         exp_before: 0,
//         ctax: 0,
//         stax: 0,
//         itax: 0,
//         tariff: "",
//         vamt: 0,}]);
//       setcustomerDetails([{ 
//         vacode: "",
//         gstno: "",
//         pan: "",
//         city: "",
//         state: "",}]);
//       setIndex(data.length);
//       setIsAddEnabled(false);
//       setIsSubmitEnabled(true);
//       setIsDisabled(false);
//       setIsEditMode(true);

//   } catch (error) {
//       console.error("Error adding new entry:", error);
//   }
// };
//   const handleEditClick = () => {
//     // document.body.style.backgroundColor = "#F0E68C";
//     setTitle("Edit");
//     setIsDisabled(false);
//     setIsEditMode(true);
//     setIsSubmitEnabled(true);
//     setIsAbcmode(true);
//     if (customerNameRef.current) {
//       customerNameRef.current.focus();
//     }
//   };
 
//   const handleSaveClick = async () => {
//     document.body.style.backgroundColor = "white";
//     let isDataSaved = false; 
//     try {
//       const isValid = customerDetails.every((item) => item.vacode !== "");
//       if (!isValid) {
//         toast.error("Please Fill the Customer Details", {
//           position: "top-center",
//         });
//         return; // Prevent save operation
//       }
//       const nonEmptyItems = items.filter((item) => item.sdisc.trim() !== "");
//       if (nonEmptyItems.length === 0) {
//         toast.error("Please fill in at least one Items name.", {
//           position: "top-center",
//         });
//         return;
//       }

//       let combinedData;
//       if (isAbcmode) {
//         console.log(formData);
//         combinedData = {
//           _id: formData._id,
//           formData: {
//             date: selectedDate.toLocaleDateString("en-US"),
//             vtype: formData.vtype,
//             vbillno: formData.vbillno,
//             gr: formData.gr,
//             exfor: formData.exfor,
//             trpt: formData.trpt,
//             stype: formData.stype,
//             btype: formData.btype,
//             conv: formData.conv,
//             rem1:formData.rem1,
//             rem2:formData.rem2,
//             v_tpt: formData.v_tpt,
//             broker: formData.broker,
//             srv_rate: formData.srv_rate,
//             srv_tax: formData.srv_tax,
//             tcs1_rate: formData.tcs1_rate,
//             tcs1:formData.tcs1,
//             tcs206_rate: formData.tcs206_rate,
//             tcs206: formData.tcs206,
//             duedate:expiredDate.toLocaleDateString("en-US"),
//             pcess: formData.pcess,
//             tax:formData.tax,
//             sub_total:formData.sub_total,
//             exp_before: formData.exp_before,
//             cgst: formData.cgst,
//             sgst:formData.sgst,
//             igst:formData.igst,
//             expafterGST: formData.expafterGST,
//             grandtotal: formData.grandtotal,
           
//           },
//           items: nonEmptyItems.map((item) => ({
//             id: item.id,
//             vcode: item.vcode,
//             sdisc: item.sdisc,
//             pkgs: item.pkgs,
//             weight: item.weight,
//             rate: item.rate,
//             amount: item.amount,
//             gst: item.gst,
//             exp_before: item.exp_before,
//             ctax: item.ctax,
//             stax: item.stax,
//             itax: item.itax,
//             tariff: item.tariff,
//             vamt: item.vamt,
//           })),
//           customerDetails: customerDetails.map((item) => ({
//             vacode: item.vacode,
//             gstno: item.gstno,
//             pan: item.pan,
//             city: item.city,
//             state: item.state,
//           })),
//           shipped: shipped.map((item) => ({
//             shippedto: item.shippedto,
//             shippingAdd: item.shippingAdd,
//             shippingState: item.shippingState,
//             shippingGst: item.shippingGst,
//             shippingPan: item.shippingPan,
//           })),
//         };
//       } else {
//         combinedData = {
//           _id: formData._id,
//           formData: {
//             date: selectedDate.toLocaleDateString("en-US"),
//             vtype: formData.vtype,
//             vbillno: formData.vbillno,
//             gr: formData.gr,
//             exfor: formData.exfor,
//             trpt: formData.trpt,
//             stype: formData.stype,
//             btype: formData.btype,
//             conv: formData.conv,
//             rem1:formData.rem1,
//             rem2:formData.rem2,
//             v_tpt: formData.v_tpt,
//             broker: formData.broker,
//             srv_rate: formData.srv_rate,
//             srv_tax: formData.srv_tax,
//             tcs1_rate: formData.tcs1_rate,
//             tcs1:formData.tcs1,
//             tcs206_rate: formData.tcs206_rate,
//             tcs206: formData.tcs206,
//             duedate:expiredDate.toLocaleDateString("en-US"),
//             pcess: formData.pcess,
//             tax:formData.tax,
//             sub_total:formData.sub_total,
//             exp_before: formData.exp_before,
//             cgst: formData.cgst,
//             sgst:formData.sgst,
//             igst:formData.igst,
//             expafterGST: formData.expafterGST,
//             grandtotal: formData.grandtotal,
//           },
//           items: nonEmptyItems.map((item) => ({
//             id: item.id,
//             vcode: item.vcode,
//             sdisc: item.sdisc,
//             pkgs: item.pkgs,
//             weight: item.weight,
//             rate: item.rate,
//             amount: item.amount,
//             gst: item.gst,
//             exp_before: item.exp_before,
//             ctax: item.ctax,
//             stax: item.stax,
//             itax: item.itax,
//             tariff: item.tariff,
//             vamt: item.vamt,
//           })),
//           customerDetails: customerDetails.map((item) => ({
//             vacode: item.vacode,
//             gstno: item.gstno,
//             pan: item.pan,
//             city: item.city,
//             state: item.state,
//           })),
//           shipped: shipped.map((item) => ({
//             shippedto: item.shippedto,
//             shippingAdd: item.shippingAdd,
//             shippingState: item.shippingState,
//             shippingGst: item.shippingGst,
//             shippingPan: item.shippingPan,
//           })),
//         };
//       }
//       // Debugging
//       console.log("Combined Data:", combinedData);
//       const apiEndpoint = `http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/salegst${
//         isAbcmode ? `/${data1._id}` : ""
//       }`;
//       const method = isAbcmode ? "put" : "post";
//       const response = await axios({
//         method,
//         url: apiEndpoint,
//         data: combinedData,
//       });

//       if (response.status === 200 || response.status === 201) {
//         fetchData();
//         isDataSaved = true;
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       toast.error("Failed to save data. Please try again.", {
//         position: "top-center",
//       });
//     } finally {
//       setIsSubmitEnabled(true);
//       if (isDataSaved) {
//         setTitle("View");
//         setIsAddEnabled(true);
//         setIsDisabled(true);
//         setIsEditMode(false);
//         toast.success("Data Saved Successfully!", { position: "top-center" });
//       } else {
//         setIsAddEnabled(false);
//         setIsDisabled(false);
//       }
//     }
//   };
//   const handleDeleteClick = async (id) => {
//     if (!id) {
//       toast.error("Invalid ID. Please select an item to delete.", {
//         position: "top-center",
//       });
//       return;
//     }
//     const userConfirmed = window.confirm(
//       "Are you sure you want to delete this item?"
//     );
//     if (!userConfirmed) return;
//     try {
//       const apiEndpoint = `http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/salegst/${data1._id}`;
//       const response = await axios.delete(apiEndpoint);

//       if (response.status === 200) {
//         toast.success("Data deleted successfully!", { position: "top-center" });
//         fetchData(); // Refresh the data after successful deletion
//       } else {
//         throw new Error(`Failed to delete data: ${response.statusText}`);
//       }
//     } catch (error) {
//       console.error("Error deleting data:", error);
//       toast.error(`Failed to delete data. Error: ${error.message}`, {
//         position: "top-center",
//       });
//     } finally {
   
//     }
//   };

//   // Fetching Account Name
//   React.useEffect(() => {
//     // Fetch products from the API when the component mounts
//     fetchAccountName();
// }, []);

// const fetchAccountName = async () => {
//     try {
//       const response = await fetch(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/api/ledgerAccount`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch products");
//       }
//       const data = await response.json();
//       // Ensure to extract the formData for easier access in the rest of your app
//       const formattedData = data.map(item => ({ ...item.formData, _id: item._id }));
//       setProductsAcc(formattedData);
//       setLoadingAcc(false);
//     } catch (error) {
//       setErrorAcc(error.message);
//       setLoadingAcc(false);
//     }
//   };
//   // Modal For Account Name
// const [productsAcc, setProductsAcc] = useState([]);
// const [showModalAcc, setShowModalAcc] = useState(false);
// const [selectedItemIndexAcc, setSelectedItemIndexAcc] = useState(null);
// const [loadingAcc, setLoadingAcc] = useState(true);
// const [errorAcc, setErrorAcc] = useState(null);

// const handleItemChangeAcc = (index, key, value) => {
//   const updatedItems = [...items];
//   updatedItems[index][key] = value;
//   // If the key is 'name', find the corresponding product and set the price
//   if (key === "ahead") {
//     const selectedProduct = productsAcc.find((product) => product.ahead === value);
//     if (selectedProduct) {
//       updatedItems[index]["vcode"] = selectedProduct.ahead;
//       // updatedItems[index]["sdisc"] = selectedProduct.Aheads;
//       // updatedItems[index]["rate"] = selectedProduct.Mrps;
//       // updatedItems[index]["gst"] = selectedProduct.itax_rate;
//       // updatedItems[index]["tariff"] = selectedProduct.Hsn;
//     } else {
//       updatedItems[index]["rate"] = ""; // Reset price if product not found
//       updatedItems[index]["gst"] = ""; // Reset gst if product not found
//     }
//   }

//   // Calculate CGST and SGST based on the GST value
//   const gst = parseFloat(updatedItems[index].gst);
//   const totalExcludingGST =
//     parseFloat(updatedItems[index].weight) *
//     parseFloat(updatedItems[index].rate);
//   // Check if GST number starts with "0" to "3"
//   const gstNumber = "03";
//   const same = custGst.substring(0, 2);
//   let cgst, sgst, igst;
//   if (gstNumber == same) {
//     cgst = (totalExcludingGST * (gst / 2)) / 100 || 0;
//     sgst = (totalExcludingGST * (gst / 2)) / 100 || 0;
//     igst = 0;
//   } else {
//     cgst = sgst = 0;
//     igst = (totalExcludingGST * gst) / 100 || 0;
//   }

//   // Set CGST and SGST to 0 if IGST is applied, and vice versa
//   if (igst > 0) {
//     cgst = 0;
//     sgst = 0;
//   } else {
//     igst = 0;
//   }

//   // Calculate the total with GST and Others
//   let totalWithGST = totalExcludingGST + cgst + sgst + igst;
//   const others = parseFloat(updatedItems[index].exp_before) || 0;
//   totalWithGST += others;

//   // Update CGST, SGST, Others, and total fields in the item
//   updatedItems[index]["amount"] = totalExcludingGST.toFixed(2);
//   updatedItems[index]["ctax"] = cgst.toFixed(2);
//   updatedItems[index]["stax"] = sgst.toFixed(2);
//   updatedItems[index]["itax"] = igst.toFixed(2);
//   updatedItems[index]["vamt"] = totalWithGST.toFixed(2);

//   // Calculate the percentage of the value based on the GST percentage
//   const percentage =
//     ((totalWithGST - totalExcludingGST) / totalExcludingGST) * 100;
//   updatedItems[index]["percentage"] = percentage.toFixed(2);

//   // Update the state with the modified items array
//   setItems(updatedItems);

//   // Recalculate total GST and grand total
//   calculateTotalGst();
// };

// const handleProductSelectAcc = (product) => {
//   setIsEditMode(true);
//     if (selectedItemIndexAcc !== null) {
//         handleItemChangeAcc(selectedItemIndexAcc, 'ahead', product.ahead);
//         setShowModalAcc(false);
//     }
// };
// const openModalForItemAcc = (index) => {
//     if (isEditMode) {
//         setSelectedItemIndexAcc(index);
//         setShowModalAcc(true);
//     }
// };

// const allFieldsAcc = productsAcc.reduce((fields, product) => {
//     Object.keys(product).forEach(key => {
//         if (!fields.includes(key)) {
//             fields.push(key);
//         }
//     });

//     return fields;
// }, []);
 
//   // Function to handle adding a new item
//   const handleAddItem = () => {
//     if (isEditMode) {
//       const newItem = {
//         id: items.length + 1,
//         vcode: "",
//         sdisc: "",
//         pkgs: 0,
//         weight: 1,
//         rate: 0,
//         amount: 0,
//         gst: 0,
//         exp_before: 0,
//         ctax: 0,
//         stax: 0,
//         itax: 0,
//         tariff: "",
//         vamt: 0,
//       };
//       setItems((prevItems) => [...prevItems, newItem]);
//       setTimeout(() => {
//         itemCodeRefs.current[items.length].focus();
//       }, 100);
//     }
//   };

//   const handleDeleteItem = (index) => {
//     if (isSubmitEnabled) {
//       const filteredItems = items.filter((item, i) => i !== index);
//       setItems(filteredItems);
//     }
//   };

//   // Modal For Customer
//   React.useEffect(() => {
//     // Fetch products from the API when the component mounts
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const response = await fetch(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/api/ledgerAccount`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch products");
//       }
//       const data = await response.json();
//       // Ensure to extract the formData for easier access in the rest of your app
//       const formattedData = data.map(item => ({ ...item.formData, _id: item._id }));
//       setProductsCus(formattedData);
//       setLoadingCus(false);
//     } catch (error) {
//       setErrorCus(error.message);
//       setLoadingCus(false);
//     }
//   };
//   const [productsCus, setProductsCus] = useState([]);
//   const [showModalCus, setShowModalCus] = useState(false);
//   const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
//   const [loadingCus, setLoadingCus] = useState(true);
//   const [errorCus, setErrorCus] = useState(null);
//   const handleItemChangeCus = (index, key, value) => {
//     const updatedItems = [...customerDetails];
//     updatedItems[index][key] = value;
//     // If the key is 'name', find the corresponding product and set the price
//     if (key === "name") {
//       const selectedProduct = productsCus.find(
//         (product) => product.ahead === value
//       );
//       if (selectedProduct) {
//         updatedItems[index]["vacode"] = selectedProduct.ahead;
//         updatedItems[index]["gstno"] = selectedProduct.gstNo;
//         updatedItems[index]["pan"] = selectedProduct.pan;
//         updatedItems[index]["city"] = selectedProduct.city;
//         updatedItems[index]["state"] = selectedProduct.state;
//         setCustgst(selectedProduct.gstNo);
//       }
//     }
//     setcustomerDetails(updatedItems);
//   };

//   const handleProductSelectCus = (product) => {
//     setIsEditMode(true);
//     if (selectedItemIndexCus !== null) {
//       handleItemChangeCus(selectedItemIndexCus, "name", product.ahead);
//       setShowModalCus(false);
//       // Move focus to grNo field after selecting customer
//       if (grNoRef.current) {
//         grNoRef.current.focus();
//       }
//     }
//   };

//   const openModalForItemCus = (index) => {
//     if (isEditMode) {
//       setSelectedItemIndexCus(index);
//       setShowModalCus(true);
//     }
//   };

//   const allFieldsCus = productsCus.reduce((fields, product) => {
//     Object.keys(product).forEach((key) => {
//       if (!fields.includes(key)) {
//         fields.push(key);
//       }
//     });

//     return fields;
//   }, []);

//   const handleTaxType = (event) => {
//     const { value } = event.target; // Get the selected value from the event
//     setFormData((prevState) => ({
//       ...prevState,
//       stype: value, // Update the ratecalculate field in FormData
//     }));
//   };
//   const handleBillCash = (event) => {
//     const { value } = event.target; // Get the selected value from the event
//     setFormData((prevState) => ({
//       ...prevState,
//       btype: value, // Update the ratecalculate field in FormData
//     }));
//   };
//   const handleSupply = (event) => {
//     const { value } = event.target; // Get the selected value from the event
//     setFormData((prevState) => ({
//       ...prevState,
//       conv: value, // Update the ratecalculate field in FormData
//     }));
//   };
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   useEffect(() => {
//     if (formData.date) {
//       setSelectedDate(new Date(formData.date));
//     } else {
//       const today = new Date();
//       setSelectedDate(today);
//       setFormData({ ...formData, date: today });
//     }
//   }, [formData.date, setFormData]);

//   const [expiredDate, setexpiredDate] = useState(null);
//   useEffect(() => {
//     if (formData.duedate) {
//       setexpiredDate(new Date(formData.duedate));
//     } else {
//       const today = new Date();
//       setexpiredDate(today);
//       setFormData({ ...formData, duedate: today });
//     }
//   }, [formData.duedate, setFormData]);

//   const handleDateChange = (date) => {
//     setexpiredDate(date);
//     setFormData({ ...formData, duedate: date });
//   };
//   const handleInputChange = (event) => {
//     const { id, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };

//   const handleNumberChange = (event) => {
//     const { id, value } = event.target;
//     const numberValue = value.replace(/[^0-9.]/g, "");
//     const validNumberValue =
//       numberValue.split(".").length > 2
//         ? numberValue.replace(/\.{2,}/g, "").replace(/(.*)\./g, "$1.")
//         : numberValue;

//     // Update form data with new value
//     let newFormData = {
//       ...formData,
//       [id]: validNumberValue,
//     };

//     // Calculate new values for tcs1, tcs206, and grandtotal
//     const grandTotal = parseFloat(newFormData.grandtotal) || 0;
//     const tcs1Rate = parseFloat(newFormData.tcs1_rate) || 0;
//     const tcs206Rate = parseFloat(newFormData.tcs206_rate) || 0;
//     const srv_Rate = parseFloat(newFormData.srv_rate) || 0;

//     // Calculate new values if rates are updated
//     let newTcs1 = (tcs1Rate / 100) * grandTotal;
//     let newTcs206 = (tcs206Rate / 100) * grandTotal;
//     let newsrv_Rate = (srv_Rate / 100) * grandTotal;

//     // Update grandtotal if rates are changed
//     let newGrandTotal = grandTotal + newTcs1 + newTcs206;
//     let expense = newTcs1 + newTcs206;

//     if (id === "tcs1_rate" || id === "tcs206_rate" || id === "srv_rate") {
//       // Recalculate grandtotal based on the updated rates
//       newGrandTotal =
//         grandTotal -
//         (parseFloat(formData.tcs1) || 0) -
//         (parseFloat(formData.tcs206) || 0) +
//         newTcs1 +
//         newTcs206;
//       newFormData = {
//         ...newFormData,
//         tcs1: newTcs1.toFixed(2),
//         tcs206: newTcs206.toFixed(2),
//         srv_tax: newsrv_Rate.toFixed(2),
//         expafterGST: expense.toFixed(2),
//         grandtotal: newGrandTotal.toFixed(2),
//       };
//     }

//     setFormData(newFormData);
//   };

//   // Determine if tcs1_rate or tcs206_rate should be disabled
//   const isTcs1Disabled = parseFloat(formData.tcs1_rate) > 0;
//   const isTcs206Disabled = parseFloat(formData.tcs206_rate) > 0;

//   // INVOICE
//   const [shopName, setShopName] = useState("NARAYAN FRUIT BAR"); // Set default value here
//   const [description, setDescription] = useState(
//     "STOCKISTS IN : FRESH FRUITS ARE AVAIABLE HERE"
//   );
//   const [address, setAddress] = useState(
//     "AMLOH ROAD, OPP. FRIENDS INDS., MANDI GOBINDGARH (PB)"
//   );
//   const [GSTIN, setGSTIN] = useState("07AAAHT5580L1ZX");
//   const [PAN, setPAN] = useState("BNV5855MN6");

//   // Function to save data to local storage
//   const saveToLocalStorage = () => {
//     localStorage.setItem("shopName", shopName);
//     localStorage.setItem("description", description);
//     localStorage.setItem("address", address);
//     localStorage.setItem("GSTIN", GSTIN);
//     localStorage.setItem("PAN", PAN);
//   };

//   // Function to retrieve data from local storage
//   const getFromLocalStorage = () => {
//     const savedShopName = localStorage.getItem("shopName");
//     const savedDescription = localStorage.getItem("description");
//     const savedAddress = localStorage.getItem("address");
//     const savedGSTIN = localStorage.getItem("GSTIN");
//     const savedPAN = localStorage.getItem("PAN");

//     if (savedShopName) setShopName(savedShopName);
//     if (savedDescription) setDescription(savedDescription);
//     if (savedAddress) setAddress(savedAddress);
//     if (savedGSTIN) setGSTIN(savedGSTIN);
//     if (savedPAN) setPAN(savedPAN);
//   };

//   useEffect(() => {
//     // Retrieve data from local storage when component mounts
//     getFromLocalStorage();
//   }, []);

//   useEffect(() => {
//     // Save data to local storage whenever shopName, description, or address change
//     saveToLocalStorage();
//   }, [shopName, description, address, GSTIN, PAN]);

//   const InvoicePDF = React.forwardRef(({ invoiceData }, ref) => {
//     const chunkItems = (items, firstChunkSize, otherChunkSize) => {
//       const chunks = [];
//       let i = 0;
//       // Handle the first chunk with a specific size
//       if (items.length > 0) {
//         chunks.push(items.slice(i, i + firstChunkSize));
//         i += firstChunkSize;
//       }
//       // Handle all other chunks with a different size
//       while (i < items.length) {
//         chunks.push(items.slice(i, i + otherChunkSize));
//         i += otherChunkSize;
//       }
//       return chunks;
//     };
//     // Split items into chunks of 10
//     const chunks = chunkItems(items, 10, 20);

//     const [totalQuantity, setTotalQuantity] = useState(0);
//     // Function to calculate total quantity
//     const calculateTotalQuantity = () => {
//       const total = items.reduce((accumulator, currentItem) => {
//         return accumulator + Number(currentItem.weight);
//       }, 0);
//       setTotalQuantity(total);
//     };
//     useEffect(() => {
//       calculateTotalQuantity();
//     }, [items]);

//     const style = {
//       bgcolor: "white",
//       boxShadow: 24,
//       p: 4,
//       overflowY: "auto",
//     };

//     const componentRef = useRef();
//     const handlePrint = useReactToPrint({
//       content: () => componentRef.current,
//     });
//     return (
//       <Modal
//         open={open}
//         style={{ overflow: "auto" }}
//         onClose={handleClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <button className="close-button" onClick={handleClose}>
//             <CloseIcon />
//           </button>
//           <Button
//             className="Button"
//             style={{ color: "black", backgroundColor: "lightcoral" }}
//             onClick={handlePrint}
//           >
//             Print
//           </Button>
//           <text style={{ fontWeight: "bold", fontSize: 30, marginLeft: "32%" }}>
//             This Is The Preview of Bill
//           </text>
//           <div
//             ref={componentRef}
//             style={{
//               width: "290mm",
//               minHeight: "390mm",
//               margin: "auto",
//               padding: "20px",
//               border: "1px solid #000",
//               borderRadius: "5px",
//               boxSizing: "border-box",
//               marginTop: 5,
//             }}
//           >
//             {chunks.map((chunk, pageIndex) => (
//               <div
//                 key={pageIndex}
//                 style={{
//                   minHeight: "257mm",
//                   marginBottom: "20px",
//                   pageBreakAfter:
//                     pageIndex === chunks.length - 1 ? "auto" : "always", // Changed 'avoid' to 'auto'
//                 }}
//               >
//                 {pageIndex === 0 && (
//                   <div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         height: 70,
//                       }}
//                     >
//                       <div style={{ display: "flex", flexDirection: "column" }}>
//                         <p
//                           style={{
//                             marginBottom: 0,
//                             fontWeight: "bold",
//                             fontSize: 16,
//                             width: 140,
//                           }}
//                         >
//                           GSTIN:{GSTIN}
//                         </p>
//                         <p
//                           style={{
//                             marginBottom: 0,
//                             fontWeight: "bold",
//                             fontSize: 16,
//                           }}
//                         >
//                           PAN:{PAN}
//                         </p>
//                       </div>
//                       <div
//                         style={{
//                           marginLeft: "23%",
//                           display: "flex",
//                           flexDirection: "column",
//                           textAlign: "center",
//                         }}
//                       >
//                         <text
//                           style={{
//                             color: "black",
//                             textAlign: "center",
//                             fontWeight: "bold",
//                             fontSize: 13,
//                           }}
//                         >
//                           Form GST INV -1 ( TAX INVOICE )
//                         </text>
//                         <text
//                           style={{
//                             color: "black",
//                             textAlign: "center",
//                             fontWeight: "bold",
//                             fontSize: 13,
//                           }}
//                         >
//                           (See Rule 7)
//                         </text>
//                         <text
//                           style={{
//                             color: "black",
//                             textAlign: "center",
//                             fontWeight: "bold",
//                             fontSize: 13,
//                           }}
//                         >
//                           Application for Electronic Reference Number of an
//                           Invoice
//                         </text>
//                       </div>
//                       <div
//                         style={{
//                           display: "flex",
//                           flexDirection: "column",
//                           marginLeft: "23%",
//                         }}
//                       >
//                         {/* <p style={{marginBottom:0,fontWeight:"bold",marginLeft:"23%",fontSize:12}}>Tel: {invoiceData.date}</p> */}
//                         <p
//                           style={{
//                             marginBottom: 0,
//                             fontWeight: "bold",
//                             fontSize: 16,
//                           }}
//                         >
//                           Tel:9872522662
//                         </p>
//                         <p
//                           style={{
//                             marginBottom: 0,
//                             fontWeight: "bold",
//                             fontSize: 16,
//                             marginLeft: 20,
//                           }}
//                         >
//                           7009588515
//                         </p>
//                       </div>
//                     </div>
//                     <div style={{ textAlign: "center", height: 120 }}>
//                       <text
//                         style={{
//                           fontSize: 40,
//                           fontWeight: "600",
//                           fontFamily: "serif",
//                         }}
//                       >
//                         {shopName}
//                       </text>
//                       <p
//                         style={{
//                           marginBottom: 0,
//                           fontWeight: "bold",
//                           fontSize: 18,
//                           marginLeft: 0,
//                         }}
//                       >
//                         {description}
//                       </p>
//                       <p
//                         style={{
//                           marginBottom: 0,
//                           fontWeight: "bold",
//                           fontSize: 18,
//                           marginLeft: 0,
//                         }}
//                       >
//                         {address}
//                       </p>
//                     </div>
//                     <div
//                       style={{
//                         border: "1px solid black",
//                         borderRadius: "5px",
//                         display: "flex",
//                         flexDirection: "row",
//                         marginTop: 30,
//                       }}
//                     >
//                       <p
//                         style={{
//                           marginBottom: 0,
//                           fontWeight: "bold",
//                           fontSize: 16,
//                           marginLeft: 10,
//                         }}
//                       >
//                         InvoiceNo:{formData.vbillno}{" "}
//                       </p>
//                       <p
//                         style={{
//                           marginBottom: 0,
//                           fontWeight: "bold",
//                           fontSize: 16,
//                           marginLeft: "32%",
//                         }}
//                       >
//                         InvoiceDate:{formData.date}
//                       </p>
//                       <p
//                         style={{
//                           marginBottom: 0,
//                           fontWeight: "bold",
//                           fontSize: 16,
//                           marginLeft: "25%",
//                         }}
//                       >
//                         TruckNo:{formData.trpt}{" "}
//                       </p>
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         justifyContent: "space-between",
//                       }}
//                     >
//                       {/* Details of Receiver (Billed to) */}
//                       <div
//                         style={{
//                           flex: 1,
//                           borderRight: "1px solid black",
//                           borderLeft: "1px solid black",
//                           paddingRight: "20px",
//                         }}
//                       >
//                         {customerDetails.map((item) => (
//                           <div key={item.vacode}>
//                             <text
//                               style={{
//                                 marginBottom: 0,
//                                 fontWeight: "bold",
//                                 fontSize: 16,
//                                 marginLeft: "30%",
//                               }}
//                             >
//                               Details of Receiver (Billed to)
//                             </text>
//                             <p
//                               style={{
//                                 marginBottom: 0,
//                                 fontWeight: "bold",
//                                 fontSize: 16,
//                                 marginLeft: 10,
//                               }}
//                             >
//                               Name: {item.vacode}{" "}
//                             </p>
//                             <p
//                               style={{
//                                 marginBottom: 0,
//                                 fontWeight: "bold",
//                                 fontSize: 16,
//                                 marginLeft: 10,
//                               }}
//                             >
//                               Address: {item.city}{" "}
//                             </p>
//                             <p
//                               style={{
//                                 marginBottom: 0,
//                                 fontWeight: "bold",
//                                 fontSize: 16,
//                                 marginLeft: 10,
//                               }}
//                             >
//                               State: {item.state}{" "}
//                             </p>
//                             <div
//                               style={{ display: "flex", flexDirection: "row" }}
//                             >
//                               <p
//                                 style={{
//                                   marginBottom: 0,
//                                   fontWeight: "bold",
//                                   fontSize: 16,
//                                   marginLeft: 10,
//                                 }}
//                               >
//                                 GSTIN: {item.gstno}{" "}
//                               </p>
//                               <p
//                                 style={{
//                                   marginBottom: 0,
//                                   fontWeight: "bold",
//                                   fontSize: 16,
//                                   marginLeft: 10,
//                                 }}
//                               >
//                                 PAN: {item.pan}{" "}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                         {/* Add receiver details here */}
//                       </div>
//                       {/* Details of Consignee (Shipped to) */}
//                       <div
//                         style={{
//                           flex: 1,
//                           borderRight: "1px solid black",
//                           paddingRight: "20px",
//                         }}
//                       >
//                         {shipped.map((item) => (
//                           <div key={item.shippedto}>
//                             <text
//                               style={{
//                                 marginBottom: 0,
//                                 fontWeight: "bold",
//                                 fontSize: 16,
//                                 marginLeft: "18%",
//                               }}
//                             >
//                               Details of Consignee ( Shipped to )
//                             </text>
//                             <p
//                               style={{
//                                 marginBottom: 0,
//                                 fontWeight: "bold",
//                                 fontSize: 16,
//                                 marginLeft: 10,
//                               }}
//                             >
//                               Name: {item.shippedto}{" "}
//                             </p>
//                             <p
//                               style={{
//                                 marginBottom: 0,
//                                 fontWeight: "bold",
//                                 fontSize: 16,
//                                 marginLeft: 10,
//                               }}
//                             >
//                               Address: {item.shippingAdd}{" "}
//                             </p>
//                             <p
//                               style={{
//                                 marginBottom: 0,
//                                 fontWeight: "bold",
//                                 fontSize: 16,
//                                 marginLeft: 10,
//                               }}
//                             >
//                               State: {item.shippingState}{" "}
//                             </p>
//                             <div
//                               style={{ display: "flex", flexDirection: "row" }}
//                             >
//                               <p
//                                 style={{
//                                   marginBottom: 0,
//                                   fontWeight: "bold",
//                                   fontSize: 16,
//                                   marginLeft: 10,
//                                 }}
//                               >
//                                 GSTIN: {item.shippingGst}{" "}
//                               </p>
//                               <p
//                                 style={{
//                                   marginBottom: 0,
//                                   fontWeight: "bold",
//                                   fontSize: 16,
//                                   marginLeft: 10,
//                                 }}
//                               >
//                                 PAN: {item.shippingPan}{" "}
//                               </p>
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <table
//                   style={{
//                     width: "100%",
//                     borderCollapse: "collapse",
//                     borderRight: "1px solid #000",
//                     borderLeft: "1px solid #000",
//                     borderBottom: "1px solid #000",
//                   }}
//                 >
//                   <thead>
//                     <tr>
//                       <th style={{ border: "1px solid #000", padding: "8px" }}>
//                         Description
//                       </th>
//                       <th style={{ border: "1px solid #000", padding: "8px" }}>
//                         Sr.No
//                       </th>
//                       <th style={{ border: "1px solid #000", padding: "8px" }}>
//                         HSN
//                       </th>
//                       <th style={{ border: "1px solid #000", padding: "8px" }}>
//                         PCS
//                       </th>
//                       <th style={{ border: "1px solid #000", padding: "8px" }}>
//                         Qty.
//                       </th>
//                       <th style={{ border: "1px solid #000", padding: "8px" }}>
//                         Unit
//                       </th>
//                       <th style={{ border: "1px solid #000", padding: "8px" }}>
//                         Rate
//                       </th>
//                       <th style={{ border: "1px solid #000", padding: "8px" }}>
//                         Amount
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody style={{ borderBottom: "1px solid black" }}>
//                     {chunk.map((item, index) => (
//                       <tr
//                         key={index}
//                         style={{
//                           borderBottom:
//                             index === chunk.length - 1
//                               ? "1px solid #000"
//                               : "none",
//                         }}
//                       >
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             padding: "8px 0",
//                             paddingLeft: 10,
//                           }}
//                         >
//                           {item.sdisc}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             padding: "8px 0",
//                             paddingLeft: 10,
//                           }}
//                         >
//                           {item.id}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             padding: "8px 0",
//                             paddingLeft: 10,
//                           }}
//                         >
//                           {item.tariff}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             padding: "8px 0",
//                             paddingLeft: 10,
//                           }}
//                         >
//                           {item.pkgs}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             padding: "8px 0",
//                             paddingLeft: 10,
//                           }}
//                         >
//                           {item.weight}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             padding: "8px 0",
//                             paddingLeft: 10,
//                           }}
//                         >
//                           {item.pcs}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             padding: "8px 0",
//                             paddingLeft: 10,
//                           }}
//                         >
//                           {item.rate}
//                         </td>
//                         <td
//                           style={{
//                             borderRight: "1px solid black",
//                             padding: "8px 0",
//                             paddingLeft: 10,
//                           }}
//                         >
//                           {item.weight * item.rate}
//                         </td>
//                         {/* <td style={{ borderRight: "1px solid black", padding: "8px 0" }}>{item.Others}</td>
//                                         <td style={{ borderRight: "1px solid black", padding: "8px 0" }}>{item.CGST}</td>
//                                         <td style={{ borderRight: "1px solid black", padding: "8px 0" }}>{item.total}</td> */}
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     <tr
//                       style={{
//                         borderBottom: "1px solid #000",
//                         borderLeft: "1px solid #000",
//                         borderRight: "1px solid #000",
//                       }}
//                     >
//                       <td
//                         colSpan="2"
//                         style={{ paddingLeft: "39px", border: "none" }}
//                       >
//                         TOTAL
//                       </td>
//                       {/* <td style={{ textAlign: 'right', padding: '8px' }}>${calculateSubtotal(chunk)}</td> */}
//                       <td></td>
//                       {/* <td colSpan="2" style={{  paddingLeft: '39px', border: '1px solid #000' }}>Qty. Total</td> */}
//                       <td></td>
//                       <td
//                         style={{
//                           textAlign: "left",
//                           paddingLeft: "11px",
//                           border: "1px solid #000",
//                         }}
//                       >
//                         {totalQuantity}
//                       </td>
//                       <td></td>
//                       <td
//                         style={{
//                           textAlign: "left",
//                           paddingLeft: "11px",
//                           border: "1px solid #000",
//                         }}
//                       >
//                         Total{" "}
//                       </td>

//                       <td
//                         style={{
//                           textAlign: "left",
//                           paddingLeft: "11px",
//                           border: "1px solid #000",
//                         }}
//                       >
//                         {formData.sub_total}
//                       </td>
//                     </tr>

//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         width: "100%",
//                         borderLeft: "1px solid #000",
//                         marginLeft: "195%",
//                       }}
//                     >
//                       <div
//                         style={{
//                           borderBottom: "1px solid #000",
//                           height: 270,
//                           display: "flex",
//                           flexDirection: "column",
//                           width: "100%",
//                         }}
//                       >
//                         <text
//                           style={{
//                             height: 50,
//                             marginTop: 10,
//                             borderBottom: "1px solid #000",
//                             fontWeight: "bold",
//                             fontSize: 18,
//                             paddingLeft: 10,
//                           }}
//                         >
//                           Expense
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             borderBottom: "1px solid #000",
//                             fontWeight: "bold",
//                             fontSize: 18,
//                             paddingLeft: 10,
//                           }}
//                         >
//                           TaxableValue
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             borderBottom: "1px solid #000",
//                             fontWeight: "bold",
//                             fontSize: 18,
//                             paddingLeft: 10,
//                           }}
//                         >
//                           C.GST@ 9.00%
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             borderBottom: "1px solid #000",
//                             fontWeight: "bold",
//                             fontSize: 18,
//                             paddingLeft: 10,
//                           }}
//                         >
//                           S.GST@ 9.00%
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             borderBottom: "1px solid #000",
//                             fontWeight: "bold",
//                             fontSize: 18,
//                             paddingLeft: 10,
//                           }}
//                         >
//                           I.GST@ 9.00%
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             borderBottom: "1px solid #000",
//                             fontWeight: "bold",
//                             fontSize: 18,
//                             paddingLeft: 10,
//                           }}
//                         >
//                           Tcs206c1H
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             borderBottom: "1px solid #000",
//                             fontWeight: "bold",
//                             fontSize: 18,
//                             paddingLeft: 10,
//                           }}
//                         >
//                           Tcs206C@
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             fontWeight: "bold",
//                             fontSize: 18,
//                             paddingLeft: 10,
//                           }}
//                         >
//                           Grand Total
//                         </text>
//                       </div>
//                       <div
//                         style={{
//                           borderBottom: "1px solid #000",
//                           height: 270,
//                           display: "flex",
//                           flexDirection: "column",
//                           width: "100%",
//                           borderLeft: "1px solid #000",
//                         }}
//                       >
//                         <text
//                           style={{
//                             height: 50,
//                             marginTop: 10,
//                             borderBottom: "1px solid #000",
//                             paddingLeft: 10,
//                             fontSize: 18,
//                           }}
//                         >
//                           {formData.expafterGST}
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             borderBottom: "1px solid #000",
//                             paddingLeft: 10,
//                             fontSize: 18,
//                           }}
//                         >
//                           {formData.sub_total}
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             borderBottom: "1px solid #000",
//                             paddingLeft: 10,
//                             fontSize: 18,
//                           }}
//                         >
//                           {formData.cgst}
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             borderBottom: "1px solid #000",
//                             paddingLeft: 10,
//                             fontSize: 18,
//                           }}
//                         >
//                           {formData.sgst}
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             borderBottom: "1px solid #000",
//                             paddingLeft: 10,
//                             fontSize: 18,
//                           }}
//                         >
//                           {formData.igst}
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             borderBottom: "1px solid #000",
//                             paddingLeft: 10,
//                             fontSize: 18,
//                           }}
//                         >
//                           {formData.tcs1}
//                         </text>
//                         <text
//                           style={{
//                             height: 50,
//                             borderBottom: "1px solid #000",
//                             paddingLeft: 10,
//                             fontSize: 18,
//                           }}
//                         >
//                           {formData.tcs206}
//                         </text>
//                         <text style={{ height: 50, paddingLeft: 10 }}>
//                           {formData.grandtotal}
//                         </text>
//                       </div>
//                     </div>
//                   </tfoot>
//                 </table>
//                 <div style={{ fontSize: "12px" }}>
//                   <text>Footer content specific to page {pageIndex + 1}</text>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Box>
//       </Modal>
//     );
//   });

//   const invoiceData = {
//     invoiceNumber: "INV-001",
//     date: "April 25, 2024",
//     customerName: "John Doe",
//     customerEmail: "john@example.com",
//     items: [
//       { description: "Item 1", quantity: 2, price: 10 },
//       { description: "Item 2", quantity: 1, price: 20 },
//       { description: "Item 3", quantity: 3, price: 15 },
//     ],
//   };

//   const [fontSize, setFontSize] = useState(16.5); // Initial font size in pixels
//   const increaseFontSize = () => {
//     setFontSize((prevSize) => (prevSize < 20 ? prevSize + 2 : prevSize)); // Increase font size up to 20 pixels
//   };

//   const decreaseFontSize = () => {
//     setFontSize((prevSize) => (prevSize > 14 ? prevSize - 2 : prevSize)); // Decrease font size down to 14 pixels
//   };
//   const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
//   const handleKeyDown = (event, index, field) => {
//     if (event.key === "Enter") {
//       switch (field) {
//         case "vcode":
//           desciptionRefs.current[index].focus();
//           break;
//         case "sdisc":
//           if (items[index].sdisc.trim() === "") {
//             // Move focus to Save button if accountname is empty
//             remarksRef.current.focus();
//           } else {
//             peciesRefs.current[index].focus();
//           }
//           break;
//         case "pkgs":
//           quantityRefs.current[index].focus();
//           break;
//         case "weight":
//           priceRefs.current[index].focus();
//           break;
//         case "rate":
//           amountRefs.current[index].focus();
//           break;
//         case "amount":
//           gstRefs.current[index].focus();
//           break;
//         case 'gst':
//             othersRefs.current[index].focus();
//             break;
//         case "exp_before":
//           cgstRefs.current[index].focus();
//           break;
//         case "ctax":
//           sgstRefs.current[index].focus();
//           break;
//         case "stax":
//           igstRefs.current[index].focus();
//           break;
//         case "itax":
//           hsnCodeRefs.current[index].focus();
//           break;
//         case "tariff":
//           if (index === items.length - 1) {
//             handleAddItem(); // Optionally add a new item if needed
//             itemCodeRefs.current[index + 1]?.focus(); // Focus on the first input of the next row
//           } else {
//             itemCodeRefs.current[index + 1]?.focus();
//           }
//           break;
//         default:
//           break;
//       }
//     } else if (/^[a-zA-Z]$/.test(event.key) && field === "accountname") {
//       setPressedKey(event.key); // Set the pressed key
//       openModalForItemCus(index);
//       event.preventDefault(); // Prevent any default action
//     }
//   };
//   const handleOpenModal = (event, index, field) => {
//     if (/^[a-zA-Z]$/.test(event.key) && field === "vcode") {
//       setPressedKey(event.key); // Set the pressed key
//       openModalForItemAcc(index);
//       event.preventDefault(); // Prevent any default action
//     }
//   };

//   const handleExit = async () => {
//     setIsAddEnabled(true);
//     if (data.length > 0) {
//       const lastIndex = data.length - 2;
//       setIndex(lastIndex);
//       const lastData = data[lastIndex];
//       setFormData(lastData);
//       setIsDisabled(true); // Disable all fields when navigating to next page
//       console.log(formData);
//       const updatedItems3 = lastData.shipped.map((item) => ({
//         shippedto: item.shippedto,
//         shippingAdd: item.shippingAdd,
//         shippingState: item.shippingState,
//         shippingGst: item.shippingGst,
//         shippingPan: item.shippingPan,
//       }));
//       const updatedcustomerDetails = lastData.customerDetails.map((item) => ({
//         vacode: item.vacode,
//         gstno: item.gstno,
//         pan: item.pan,
//         city: item.city,
//         state: item.state,
//       }));
//       const updatedItems = lastData.items.map((item) => ({
//         vcode: item.vcode,
//         sdisc: item.sdisc,
//         pkgs: item.pkgs,
//         weight: item.weight,
//         rate: item.rate,
//         amount: item.amount,
//         gst: item.gst,
//         exp_before: item.exp_before,
//         ctax: item.ctax,
//         stax: item.stax,
//         itax: item.itax,
//         tariff: item.tariff,
//         vamt: item.vamt,
//       }));
//       setshipped(updatedItems3);
//       setcustomerDetails(updatedcustomerDetails);
//       setItems(updatedItems);
//       await fetchData();
//     }
//   };
//   const [color, setColor] = useState(() => {
//     // Get the initial color from local storage or default to 'black'
//     return localStorage.getItem("Color") || "#ceedf0";
//   });

//   const handleChange = (event) => {
//     const newColor = event.target.value;
//     setColor(newColor);
//     localStorage.setItem("Color", newColor); // Save the selected color to local storage
//   };

//   const handleKeyDowndown = (event, nextFieldRef) => {
//     if (event.key === "Enter") {
//       event.preventDefault(); // Prevent form submission
//       if (nextFieldRef.current) {
//         nextFieldRef.current.focus();
//       }
//     }
//   };
// // Update the blur handlers so that they always format the value to 2 decimals.
//   const handlePkgsBlur = (index) => {
//     const decimalPlaces = pkgsValue
//     const updatedItems = [...items];
//     let value = parseFloat(updatedItems[index].pkgs);
//     if (isNaN(value)) {
//       value = 0;
//     }
//     updatedItems[index].pkgs = value.toFixed(decimalPlaces);
//     setItems(updatedItems);
//   };
//   const handleWeightBlur = (index) => {
//     const decimalPlaces = weightValue;
//     const updatedItems = [...items];
//     let value = parseFloat(updatedItems[index].weight);
  
//     // Validation: Check if weight is null, NaN, or <= 0
//     if (isNaN(value) || value <= 0) {
//       // Custom Confirmation Toast
//       toast.info(
//         ({ closeToast }) => (
//           <div>
//              <p style={{fontSize:20,color:'black'}}>⚠️ Quantity is invalid. It Should be Greater than 0 </p>
//             <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
//               <button
//                 onClick={() => {
//                   closeToast(); // Close the toast
//                   // Focus back on the invalid input
//                   const weightInput = document.querySelectorAll('.QTY')[index];
//                   if (weightInput) {
//                     weightInput.focus();
//                   }
//                 }}
//                 style={{width:100,backgroundColor: '#2ecc71',color: 'white',border: 'none',padding: '5px 10px',borderRadius: '5px',cursor: 'pointer'}}
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         ),
//         {
//           position: 'top-center',
//           autoClose: false,
//           closeOnClick: false,
//           closeButton: false,
//           draggable: false,
//           style: {
//             width: '400px',
//             border:'1px solid black',
//             textAlign: 'center',
//             borderRadius: '12px',
//             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
//             marginTop:150,
//           },
//         }
//       );
//       return;
//     }
//     updatedItems[index].weight = value.toFixed(decimalPlaces);
//     setItems(updatedItems);
//   };

//   const handleRateBlur = (index) => {
//     const decimalPlaces = rateValue;
//     const updatedItems = [...items];
//     let value = parseFloat(updatedItems[index].rate);
//     if (isNaN(value)) {
//       value = 0;
//     }
//     updatedItems[index].rate = value.toFixed(decimalPlaces);
//     setItems(updatedItems);
//   };
//   return (
//     <div>
//       <div>
//         <ToastContainer />
//       </div>
//       <div className="Plusminus">
//         {/* <text className="tittles">{title}</text> */}
//         <select className="colorselect" value={color} onChange={handleChange}>
//           <option value="#ceedf0">Skyblue</option>
//           <option value="lightyellow">Yellow</option>
//           <option value="lavender">Lavender</option>
//           <option value="#9ff0c3">Green</option>
//           <option value="#ecc7cd">Pink</option>
//         </select>
//         <Button className="plusbutton" onClick={decreaseFontSize}>
//           <FaMinus />
//         </Button>
//         <Button style={{ marginLeft: 10 }} onClick={increaseFontSize}>
//           <FaPlus />
//         </Button>
//       </div>
//       <div style={{ visibility: "hidden", width: 0, height: 0 }}>
//         <InvoicePDF invoiceData={invoiceData} />
//       </div>
//       <h1 className="header">SALE GST SERVICES</h1>
//       {/* Top Parts */}
//       <div className="toppart">
//         <div className="top" style={{ backgroundColor: color }}>
//           <div className="cusdetails">
//             <div className="datediv">
//               <text>Date:</text>
//               <div className="datez" style={{ height: 10 }}>
//                 <DatePicker
//                   ref={datePickerRef}
//                   className="custom-datepickerz"
//                   id="date"
//                   selected={selectedDate}
//                   onChange={(date) => setSelectedDate(date)}
//                   dateFormat="dd-MM-yyyy"
//                 />
//               </div>
//               <div
//                 className="billdiv"
//                 style={{ display: "flex", flexDirection: "row" }}
//               >
//                 <text>BillNo:</text>
//                 <input
//                   className="billz"
//                   style={{ height: "30px", fontSize: `${fontSize}px` }}
//                   id="vbillno"
//                   value={formData.vbillno}
//                   readOnly={!isEditMode || isDisabled}
//                   placeholder="Bill No."
//                 />
//               </div>
//             </div>
//             <div style={{ marginTop: 10 }}>
//               {customerDetails.map((item, index) => (
//                 <div key={item.vacode}>
//                   <div className="cus">
//                     <div className="customerdiv">
//                       <text>CustomerName:</text>
//                       <input
//                         ref={customerNameRef}
//                         type="text"
//                         className="customerz"
//                         style={{ height: "30px", fontSize: `${fontSize}px` }}
//                         placeholder="Customer Name"
//                         value={item.vacode}
//                         // onClick={() => openModalForItemCus(index)}
//                         onKeyDown={(e) => {
//                           handleEnterKeyPress(customerNameRef, grNoRef)(e);
//                           handleKeyDown(e, index, "accountname");
//                         }}
//                       />
//                     </div>
//                     <div className="citydivs">
//                       <text>City:</text>
//                       <input
//                         className="cityz"
//                         value={item.city}
//                         style={{ height: "30px", fontSize: `${fontSize}px` }}
//                         placeholder="Enter City"
//                         readOnly={!isEditMode || isDisabled}
//                         onChange={(e) =>
//                           handleItemChangeCus(index, "city", e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>
//                   <div className="gst">
//                     <div>
//                       <text>GSTNo:</text>
//                       <input
//                         className="gstnoz"
//                         value={item.gstno}
//                         style={{ height: "30px", fontSize: `${fontSize}px` }}
//                         placeholder="GST No"
//                         readOnly={!isEditMode || isDisabled}
//                         onChange={(e) =>
//                           handleItemChangeCus(index,"gstNumber",e.target.value)
//                         }
//                       />
//                     </div>
//                     <div className="pandivs">
//                       <text>PAN:</text>
//                       <input
//                         className="pannoz"
//                         style={{ height: "30px", fontSize: `${fontSize}px` }}
//                         value={item.pan}
//                         placeholder="PanNo"
//                         readOnly={!isEditMode || isDisabled}
//                         onChange={(e) =>
//                           handleItemChangeCus(index, "PanNo", e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//               {showModalCus && (
//                 <ProductModalCustomer
//                   allFields={allFieldsCus}
//                   products={productsCus}
//                   onSelect={handleProductSelectCus}
//                   onClose={() => setShowModalCus(false)}
//                   onRefresh={fetchCustomers}  // ✅ you passed this here
//                   initialKey={pressedKey} // Pass the pressed key to the modal
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//         <div className="top" style={{ backgroundColor: color }}>
//           <div>
//             <div className="gr">
//               <text>GrNo:</text>
//               <input
//                 ref={grNoRef}
//                 className="grnoz"
//                 style={{ height: "30px", fontSize: `${fontSize}px` }}
//                 id="gr"
//                 value={formData.gr}
//                 readOnly={!isEditMode || isDisabled}
//                 placeholder="Enter grNo"
//                 onChange={handleNumberChange}
//                 onKeyDown={handleEnterKeyPress(grNoRef, termsRef)}
//               />
//             </div>
//             <div className="tr">
//               <text>Terms:</text>
//               <input
//                 ref={termsRef}
//                 className="termz"
//                 style={{ height: "30px", fontSize: `${fontSize}px` }}
//                 id="exfor"
//                 value={formData.exfor}
//                 readOnly={!isEditMode || isDisabled}
//                 placeholder="Enter terms"
//                 onChange={handleInputChange}
//                 onKeyDown={handleEnterKeyPress(termsRef, vehicleNoRef)}
//               />
//             </div>
//             <div className="vh">
//               <text>Vehicle:</text>
//               <input
//                 ref={vehicleNoRef}
//                 className="vehiclez"
//                 style={{ height: "30px", fontSize: `${fontSize}px` }}
//                 id="trpt"
//                 placeholder="Enter VehicleNo."
//                 readOnly={!isEditMode || isDisabled}
//                 value={formData.trpt}
//                 onChange={handleInputChange}
//                 // onKeyDown={handleInputKeyDown}
//                 onKeyDown={handleEnterKeyPress(vehicleNoRef, null)}
//               />
//             </div>
//           </div>
//           <div className="selector">
//             <div className="ttype">
//               <text>Taxtype:</text>
//               <select
//                 className="taxtypez"
//                 id="taxtype"
//                 style={{
//                   height: "30px",
//                   backgroundColor: "white",
//                   fontSize: `${fontSize}px`,
//                   color: "black",
//                 }}
//                 value={formData.stype}
//                 onChange={handleTaxType}
//                 disabled={!isEditMode || isDisabled}
//               >
//                 <option value="">Tax-Type</option>
//                 <option value="Vat Sale">Vat Sale</option>
//                 <option value="Out of State">Out of State</option>
//                 <option value="Retails Within State">
//                   Retails Within State
//                 </option>
//                 <option value="Exempted Sale">Exempted Sale</option>
//                 <option value="Tax Free Within Sale">
//                   Tax Free Within Sale
//                 </option>
//                 <option value="Export Sale">Export Sale</option>
//                 <option value="H Form Within State">H Form Within State</option>
//                 <option value="H Form Outside State">
//                   H Form Outside State
//                 </option>
//                 <option value="E1/E2 Sale">E1/E2 Sale</option>
//                 <option value="Including Tax">Including Tax</option>
//                 <option value="Consigment">Consigment</option>
//                 <option value="Not Applicable">Not Applicable</option>
//                 <option value="Tax Free Interstate">Tax Free Interstate</option>
//               </select>
//             </div>
//             <div className="bc">
//               <text>BillCash:</text>
//               <select
//                 className="billcashz"
//                 id="billcash"
//                 style={{
//                   height: "30px",
//                   backgroundColor: "white",
//                   fontSize: `${fontSize}px`,
//                   color: "black",
//                 }}
//                 value={formData.btype}
//                 onChange={handleBillCash}
//                 disabled={!isEditMode || isDisabled}
//               >
//                 <option value="">Bill Cash</option>
//                 <option value="Bill">Bill</option>
//                 <option value="Cash Memo">Cash Memo</option>
//               </select>
//             </div>
//             <div className="sup">
//               <text>Supply:</text>
//               <select
//                 className="supplyz"
//                 id="supply"
//                 style={{
//                   height: "30px",
//                   backgroundColor: "white",
//                   fontSize: `${fontSize}px`,
//                   color: "black",
//                 }}
//                 value={formData.conv}
//                 onChange={handleSupply}
//                 disabled={!isEditMode || isDisabled}
//               >
//                 <option value="">Supply</option>
//                 <option value="Manufacturing Sale">1.Manufacturing Sale</option>
//                 <option value="Trading Sale">2.Trading Sale</option>
//               </select>
//               {/* <FormControl
//                                 size="small"
//                             >
//                                 <Select
//                                     className='supply'
//                                     id="supply"
//                                     style={{ height: 30, backgroundColor: "white", fontSize: `${fontSize}px` }}
//                                     value={formData.conv}
//                                     onChange={handleSupply}
//                                     readOnly={!isEditMode || isDisabled}
//                                     displayEmpty
//                                     inputProps={{ "aria-label": "Without label" }}
//                                 >
//                                     <MenuItem value="">Supply</MenuItem>
//                                     <MenuItem value={"Manufacturing Sale"}>1.Manufacturing Sale</MenuItem>
//                                     <MenuItem value={"Trading Sale"}>2.Trading Sale</MenuItem>
//                                 </Select>
//                             </FormControl> */}
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Top Part Ends Here */}
//       {/* Table Part */}
//       <div>
//         <div className="tablediv">
//         <Table ref={tableRef} className="custom-table">
//             <thead
//               style={{
//                 backgroundColor: color,
//                 textAlign: "center",
//                 position: "sticky",
//                 top: 0,
//               }}
//             >
//               <tr style={{ color: "#575a5a" }}>
//                 <th>LEDGER A/C NAME</th>
//                 <th>DESCRIPTION</th>
//                 <th>PCS</th>
//                 <th>QTY</th>
//                 <th>PRICE/RATE</th>
//                 <th>AMOUNT</th>
//                 <th>GST</th>
//                 <th>Others</th>
//                 <th>CGST</th>
//                 <th>SGST</th>
//                 <th>IGST</th>
//                 <th>HSNCODE</th>
//                 <th>TOTAL</th>
//                 <th className="text-center">ACTION</th>
//               </tr>
//             </thead>
//             <tbody
//               style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}>
//               {items.map((item, index) => (
//                 <tr key={item.id}>
//                   <td style={{ padding: 0, width: 300 }}>
//                     <input
//                        className="ItemCode"
//                       style={{
//                         height: 40,
//                         fontSize: `${fontSize}px`,
//                         width: "100%",
//                         boxSizing: "border-box",
//                         border: "none",
//                         padding: 5,
//                       }}
//                       type="text"
//                       value={item.vcode}
//                       readOnly
//                       // onClick={() => openModalForItem(index)}
//                       onKeyDown={(e) => {
//                         handleKeyDown(e, index, "vcode");
//                         handleOpenModal(e, index, "vcode");
//                       }}
//                       ref={(el) => (itemCodeRefs.current[index] = el)}
//                     />
//                   </td>
//                   <td style={{ padding: 0, width: 200 }}>
//                     <input
//                      className="desc"
//                       style={{
//                         height: 40,
//                         fontSize: `${fontSize}px`,
//                         width: "100%",
//                         boxSizing: "border-box",
//                         border: "none",
//                         padding: 5,
//                         backgroundColor: "lightyellow",
//                       }}
//                       value={item.sdisc}
//                       readOnly={!isEditMode || isDisabled}
//                       onChange={(e) =>
//                         handleItemChangeAcc(index, "sdisc", e.target.value)
//                       }
//                       onKeyDown={(e) => {
//                         handleKeyDown(e, index, "sdisc");
//                       }}
//                       ref={(el) => (desciptionRefs.current[index] = el)}
//                     />
//                   </td>
//                   <td style={{ padding: 0 }}>
//   <input
//     className="PCS"
//     style={{
//       height: 40,
//       width: "100%",
//       boxSizing: "border-box",
//       border: "none",
//       padding: 5,
//       textAlign: "right",
//     }}
//     maxLength={48}
//     readOnly={!isEditMode || isDisabled}
//     value={item.pkgs} // Show raw value during input
//     onChange={(e) => handleItemChangeAcc(index, "pkgs", e.target.value)}
//     onBlur={() => handlePkgsBlur(index)} // Format value on blur
//     onKeyDown={(e) => {handleKeyDown(e, index, "pkgs");}}
//     ref={(el) => (peciesRefs.current[index] = el)}
//   />
// </td>
// <td style={{ padding: 0 }}>
//   <input
//     className="QTY"
//     style={{
//       height: 40,
//       width: "100%",
//       boxSizing: "border-box",
//       border: "none",
//       padding: 5,
//       textAlign: "right",
//     }}
//     maxLength={48}
//     readOnly={!isEditMode || isDisabled}
//     value={item.weight} // Show raw value during input
//     onChange={(e) => handleItemChangeAcc(index, "weight", e.target.value)}
//     onBlur={() => handleWeightBlur(index)} // Format value on blur
//     onKeyDown={(e) => {
//       handleKeyDown(e, index, "weight");
//     }}
//     ref={(el) => (quantityRefs.current[index] = el)}
//   />
// </td>
// <td style={{ padding: 0 }}>
//   <input
//     className="Price"
//     style={{
//       height: 40,
//       width: "100%",
//       boxSizing: "border-box",
//       border: "none",
//       padding: 5,
//       textAlign: "right",
//     }}
//     maxLength={48}
//     readOnly={!isEditMode || isDisabled}
//     value={item.rate} // Show raw value during input
//     onChange={(e) => handleItemChangeAcc(index, "rate", e.target.value)}
//     onBlur={() => handleRateBlur(index)} // Format value on blur
//     onKeyDown={(e) => {handleKeyDown(e, index, "rate");}}
//     ref={(el) => (priceRefs.current[index] = el)}
//   />
// </td>
//                   <td style={{ padding: 0 }}>
//                     <input
//                       className="Amount"
//                       style={{
//                         height: 40,
//                         fontSize: `${fontSize}px`,
//                         width: "100%",
//                         boxSizing: "border-box",
//                         border: "none",
//                         padding: 5,
//                         backgroundColor: "lightyellow",
//                         textAlign: "right",
//                       }}
//                       type="number"
//                       readOnly={!isEditMode || isDisabled}
//                       value={item.amount}
//                       onKeyDown={(e) => {
//                         handleKeyDown(e, index, "amount");
//                       }}
//                       ref={(el) => (amountRefs.current[index] = el)}
//                       min="0"
//                     />
//                   </td>
//                   <td style={{ padding: 0 }}>
//                     <input
//                       style={{
//                         height: 40,
//                         fontSize: `${fontSize}px`,
//                         width: "100%",
//                         boxSizing: "border-box",
//                         border: "none",
//                         padding: 5,
//                         backgroundColor: "lightyellow",
//                         textAlign: "right",
//                       }}
//                       type="number"
//                       readOnly={!isEditMode || isDisabled}
//                       value={item.gst}
//                       onChange={(e) =>
//                         handleItemChangeAcc(index, "gst", e.target.value)
//                       }
//                       onKeyDown={(e) => {
//                         handleKeyDown(e, index, "gst");
//                       }}
//                       ref={(el) => (gstRefs.current[index] = el)}
//                       min="0"
//                     />
//                   </td>
//                   <td style={{ padding: 0 }}>
//                     <input
//                      className="Others"
//                       style={{
//                         height: 40,
//                         fontSize: `${fontSize}px`,
//                         width: "100%",
//                         boxSizing: "border-box",
//                         border: "none",
//                         padding: 5,
//                         textAlign: "right",
//                       }}
//                       type="text"
//                       value={item.exp_before}
//                       readOnly={!isEditMode || isDisabled}
//                       onChange={(e) =>
//                         handleItemChangeAcc(index, "exp_before", e.target.value)
//                       }
//                       onKeyDown={(e) => {
//                         handleKeyDown(e, index, "exp_before");
//                       }}
//                       ref={(el) => (othersRefs.current[index] = el)}
//                     />
//                   </td>
//                   <td style={{ padding: 0 }}>
//                     <input
//                       className="CTax"
//                       style={{
//                         height: 40,
//                         fontSize: `${fontSize}px`,
//                         width: "100%",
//                         boxSizing: "border-box",
//                         border: "none",
//                         padding: 5,
//                         backgroundColor: "#e3f8e3",
//                         textAlign: "right",
//                       }}
//                       readOnly={!isEditMode || isDisabled}
//                       value={item.ctax}
//                       onChange={(e) =>
//                         handleItemChangeAcc(index, "ctax", e.target.value)
//                       }
//                       onKeyDown={(e) => {
//                         handleKeyDown(e, index, "ctax");
//                       }}
//                       ref={(el) => (cgstRefs.current[index] = el)}
//                     />
//                   </td>
//                   <td style={{ padding: 0 }}>
//                     <input
//                     className="STax"
//                       style={{
//                         height: 40,
//                         fontSize: `${fontSize}px`,
//                         width: "100%",
//                         boxSizing: "border-box",
//                         border: "none",
//                         padding: 5,
//                         textAlign: "right",
//                       }}
//                       readOnly={!isEditMode || isDisabled}
//                       value={item.stax}
//                       onChange={(e) =>
//                         handleItemChangeAcc(index, "stax", e.target.value)
//                       }
//                       onKeyDown={(e) => {
//                         handleKeyDown(e, index, "stax");
//                       }}
//                       ref={(el) => (sgstRefs.current[index] = el)}
//                       min="0"
//                     />
//                   </td>
//                   <td style={{ padding: 0 }}>
//                     <input
//                     className="ITax"
//                       style={{
//                         height: 40,
//                         fontSize: `${fontSize}px`,
//                         width: "100%",
//                         boxSizing: "border-box",
//                         border: "none",
//                         padding: 5,
//                         backgroundColor: "#e3f8e3",
//                         textAlign: "right",
//                       }}
//                       readOnly={!isEditMode || isDisabled}
//                       value={item.itax}
//                       onChange={(e) =>
//                         handleItemChangeAcc(index, "itax", e.target.value)
//                       }
//                       onKeyDown={(e) => {
//                         handleKeyDown(e, index, "itax");
//                       }}
//                       ref={(el) => (igstRefs.current[index] = el)}
//                       min="0"
//                     />
//                   </td>
//                   <td style={{ padding: 0 }}>
//                     <input
//                        className="Hsn"
//                       style={{
//                         height: 40,
//                         fontSize: `${fontSize}px`,
//                         width: "100%",
//                         boxSizing: "border-box",
//                         border: "none",
//                         padding: 5,
//                         textAlign: "right",
//                       }}
//                       readOnly={!isEditMode || isDisabled}
//                       value={item.tariff}
//                       onChange={(e) =>
//                         handleItemChangeAcc(index, "tariff", e.target.value)
//                       }
//                       onKeyDown={(e) => {
//                         handleKeyDown(e, index, "tariff");
//                       }}
//                       ref={(el) => (hsnCodeRefs.current[index] = el)}
//                     />
//                   </td>
//                   <td style={{ padding: 0 }}>
//                     <input
//                       className="TotalTable"
//                       style={{
//                         height: 40,
//                         fontSize: `${fontSize}px`,
//                         width: "100%",
//                         boxSizing: "border-box",
//                         border: "none",
//                         padding: 5,
//                         backgroundColor: "lavender",
//                         textAlign: "right",
//                       }}
//                       readOnly
//                       value={item.vamt}
//                     />
//                   </td>
//                   <td style={{padding:0}} className="text-center">
//                     <BiTrash onClick={() => handleDeleteItem(index)} style={{ cursor: 'pointer' }} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//         {showModalAcc && (
//           <ProductModalCustomer
//           allFieldsAcc={allFieldsAcc}
//           productsAcc={productsAcc}
//           onSelectAcc={handleProductSelectAcc}
//           onCloseAcc={() => setShowModalAcc(false)}
//           onRefreshAcc={fetchAccountName}  // ✅ you passed this here
//           initialKey={pressedKey} // Pass the pressed key to the modal
//           />
//         )}
//       </div>
//       <div className="addbutton" style={{ marginTop: 2, marginBottom: 5 }}>
//         <Button className="fw-bold btn-secondary" onClick={handleAddItem}>
//           Add Row
//         </Button>
//       </div>
//       {/* Bottom Part */}
//       <div className="Belowcontents">
//         <div className="bottomcontainerz">
//           <div className="bottomdiv" style={{ backgroundColor: color }}>
//             <div
//               className="shipdiv"
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <div
//                 style={{ display: "flex", flexDirection: "row", marginTop: 2 }}>
//                 <text>Remarks:</text>
//                 <input
//                   ref={remarksRef}
//                   className="rem1"
//                   style={{ height: 30, fontSize: `${fontSize}px` }}
//                   id="rem1"
//                   readOnly={!isEditMode || isDisabled}
//                   placeholder="Remarks"
//                   value={formData.rem1}
//                   onChange={handleInputChange}
//                   onKeyDown={(e) => {
//                     handleKeyDowndown(e, transportRef);
//                   }}
//                 />
//               </div>
//               <input
//                   ref={transportRef}
//                   className="rem2"
//                   style={{ height: 30, fontSize: `${fontSize}px` }}
//                   id="rem2"
//                   readOnly={!isEditMode || isDisabled}
//                   placeholder="Remarks"
//                   value={formData.rem2}
//                   onChange={handleInputChange}
//                   onKeyDown={(e) => {
//                     handleKeyDowndown(e, brokerRef);
//                   }}
//                 />
//               <div
//                 style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
//               >
//                 <text>Agent:</text>
//                 <input
//                   ref={brokerRef}
//                   className="brokerss"
//                   style={{ height: 30, fontSize: `${fontSize}px` }}
//                   readOnly={!isEditMode || isDisabled}
//                   id="broker"
//                   placeholder="Broker"
//                   value={formData.broker}
//                   onChange={handleInputChange}
//                   onKeyDown={(e) => {
//                     handleKeyDowndown(e, tdsRef);
//                   }}
//                 />
//               </div>
//                 <div style={{ display: "flex", flexDirection: "row",marginTop:2 }}>
//                 <text style={{ color: "red" }}>TDS194Q:</text>
//                 <div style={{ display: "flex", flexDirection: "row" }}>
//                   <input
//                     ref={tdsRef}
//                     className="tdsqss"
//                     style={{
//                       height: 30,
//                       width: 100,
//                       fontSize: `${fontSize}px`,
//                       color: "red",
//                     }}
//                     readOnly={!isEditMode || isDisabled}
//                     id="srv_rate"
//                     value={formData.srv_rate}
//                     onChange={handleNumberChange}
//                     onKeyDown={(e) => {
//                       handleKeyDowndown(e, advanceRef);
//                     }}
//                   />
//                   <input
//                     className="tdsq22"
//                     style={{
//                       height: 30,
//                       width: 150,
//                       marginLeft: 5,
//                       fontSize: `${fontSize}px`,
//                       color: "red",
//                     }}
//                     readOnly={!isEditMode || isDisabled}
//                     id="srv_tax"
//                     value={formData.srv_tax}
//                     onChange={handleNumberChange}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="bottomdiv2" style={{ backgroundColor: color }}>
//             <div
//               className="adadv"
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <div style={{ display: "flex", flexDirection: "row" }}>
//                 <text style={{color:'red'}}>AdjustAdv:</text>
//                 <input
//                   ref={advanceRef}
//                   className="advancez"
//                   style={{ height: 30, width: 150, fontSize: `${fontSize}px`,color:"red",textAlign:'right' }}
//                   id="pcess"
//                   value={formData.pcess}
//                   placeholder="Adjust Advance Rs"
//                   readOnly={!isEditMode || isDisabled}
//                   onChange={handleNumberChange}
//                   onKeyDown={(e) => {
//                     handleKeyDowndown(e, addLessRef);
//                   }}
//                 />
//               </div>
//               <div
//                 style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
//               >
//                 <text>TotalGST:</text>
//                 <input
//                   className="totalGstz"
//                   style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
//                   id="tax"
//                   placeholder="Total GSt"
//                   value={formData.tax}
//                   readOnly={!isEditMode || isDisabled}
//                 />
//               </div>
//               <div
//                 style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
//               >
//                 <text>Add/Less:</text>
//                 <input
//                   ref={addLessRef}
//                   className="adlessz"
//                   style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
//                   id="exp_before"
//                   value={formData.exp_before}
//                   readOnly={!isEditMode || isDisabled}
//                   placeholder="Add/Less"
//                   onKeyDown={(e) => {
//                     handleKeyDowndown(e, expAfterGSTRef);
//                   }}
//                   // onChange={handleNumberChange}
//                 />
//               </div>
//               <div
//                 style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
//               >
//                 <text>ExpAfterGst:</text>
//                 <input
//                   ref={expAfterGSTRef}
//                   className="expensegstz"
//                   style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
//                   id="expafterGST"
//                   readOnly={!isEditMode || isDisabled}
//                   placeholder="Exp After GST"
//                   value={formData.expafterGST}
//                   onChange={handleNumberChange}
//                   onKeyDown={(e) => {
//                     handleKeyDowndown(e, saveButtonRef);
//                   }}
//                 />
//               </div>
//             </div>
//             <div
//               className="valuediv"
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//               }}
//             >
//               <div style={{ display: "flex", flexDirection: "row" }}>
//                 <text>Value:</text>
//                 <input
//                   className="valuez"
//                   style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
//                   id="sub_total"
//                   readOnly={!isEditMode || isDisabled}
//                   placeholder="value"
//                   value={formData.sub_total}
//                 />
//               </div>
//               <div
//                 style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
//               >
//                 <text>C.GST:</text>
//                 <input
//                   className="Cgstz"
//                   style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
//                   id="cgst"
//                   readOnly={!isEditMode || isDisabled}
//                   placeholder="CGST"
//                   value={formData.cgst}
//                 />
//               </div>
//               <div
//                 style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
//               >
//                 <text>S.GST:</text>
//                 <input
//                   className="Sgstz"
//                   style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
//                   id="sgst"
//                   placeholder="SGST"
//                   readOnly={!isEditMode || isDisabled}
//                   value={formData.sgst}
//                 />
//               </div>
//               <div
//                 style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
//               >
//                 <text>I.GST:</text>
//                 <input
//                   className="Igstz"
//                   style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
//                   id="igst"
//                   value={formData.igst}
//                   readOnly={!isEditMode || isDisabled}
//                   placeholder="IGST"
//                 />
//               </div>
//               <div
//                 style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
//               >
//                 <text style={{ color: "red" }}>GrandTotal:</text>
//                 <input
//                   className="Grandtotalz"
//                   style={{
//                     height: 30,
//                     width: 150,
//                     fontSize: `${fontSize}px`,
//                     color: "red",
//                     fontWeight: "bold",textAlign:'right'
//                   }}
//                   id="grandtotal"
//                   readOnly={!isEditMode || isDisabled}
//                   placeholder="Grand Total"
//                   value={formData.grandtotal}
//                   // onChange={handleNumberChange}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="Buttonsgroupz">
//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[0] }}
//             onClick={handleAdd}
//             disabled={!isAddEnabled}
//           >
//             Add
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[1] }}
//             onClick={handleEditClick}
//             disabled={!isAddEnabled}
//           >
//             Edit
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[2] }}
//             onClick={handlePrevious}
//             disabled={index === 0}
//           >
//             Previous
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[3] }}
//             onClick={handleNext}
//             disabled={index === data.length - 1}
//           >
//             Next
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[4] }}
//             onClick={handleFirst}
//             disabled={index === 0}
//           >
//             First
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[5] }}
//             onClick={handleLast}
//             disabled={index === data.length - 1}
//           >
//             Last
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[6] }}
//           >
//             Search
//           </Button>
//           <Button
//             className="Buttonz"
//             onClick={handleOpen}
//             style={{ color: "black", backgroundColor: buttonColors[7] }}
//           >
//             Print
//           </Button>
//           <Button
//             className="delete"
//             style={{ color: "black", backgroundColor: buttonColors[8] }}
//             onClick={handleDeleteClick}
//           >
//             Delete
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[9] }}
//             onClick={handleExit}
//           >
//             Exit
//           </Button>
//           <Button
//             ref={saveButtonRef}
//             className="Buttonz"
//             onClick={handleSaveClick}
//             disabled={!isSubmitEnabled}
//             style={{ color: "black", backgroundColor: buttonColors[10] }}
//           >
//             Save
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SaleService;


import React, { useState, useEffect, useRef } from "react";
import "../Sale/Sale.css";
import InputMask from "react-input-mask";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ProductModal from "../Modals/ProductModal";
import ProductModalCustomer from "../Modals/ProductModalCustomer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCog, FaTimes } from "react-icons/fa";
import SaleSetup from "../Sale/SaleSetup";
import InvoicePDF from "../InvoicePDF/InvoicePDF";
import InvoicepdfSale1 from "../InvoicePDF/InvoicepdfSale1";
import InvoiceSaleChallan from "../InvoicePDF/InvoiceSaleChallan";
import InvoiceSale2 from "../InvoicePDF/InvoiceSale2";
import InvoiceSale3 from "../InvoicePDF/InvoiceSale3";
import InvoiceKaryana from "../InvoicePDF/InvoiceKaryana";
import InvoiceG4 from "../InvoicePDF/InvoiceG4";
import InvoiceSlip from "../InvoicePDF/InvoiceSlip";
import { useReactToPrint } from "react-to-print";
import { useEditMode } from "../../EditModeContext";
import { CompanyContext } from "../Context/CompanyContext";
import { useContext } from "react";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BillPrintMenu from "../Modals/BillPrintMenu";
import useCompanySetup from "../Shared/useCompanySetup";
import { Modal, Form } from "react-bootstrap";
import useTdsApplicable from "../Shared/useTdsApplicable";
import FAVoucherModal from "../Shared/FAVoucherModal";
import { useNavigate, useLocation } from "react-router-dom";
import useShortcuts from "../Shared/useShortcuts";
import F3Modal from "../Modals/F3Modal";

const LOCAL_STORAGE_KEY = "tabledataSS";

const SaleService = () => {

  const location = useLocation();
  const saleId = location.state?.saleId;
  const navigate = useNavigate();

  const { CompanyState, unitType } = useCompanySetup();
  const { applicable194Q } = useTdsApplicable();
  const { company } = useContext(CompanyContext);
  const tenant = "03AAYFG4472A1ZG_01042025_31032026";

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    // console.error("No tenant selected!");
  }

  const [selectedCopies, setSelectedCopies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [title, setTitle] = useState("(View)");
  const datePickerRef = useRef(null);
  const voucherNoRef = useRef(null);
  const tableContainerRef = useRef(null);
  const itemCodeRefs = useRef([]);
  const desciptionRefs = useRef([]);
  const peciesRefs = useRef([]);
  const quantityRefs = useRef([]);
  const priceRefs = useRef([]);
  const amountRefs = useRef([]);
  const gstRef = useRef([]);
  const discountRef = useRef([]);
  const discount2Ref = useRef([]);
  const othersRefs = useRef([]);
  const cgstRefs = useRef([]);
  const sgstRefs = useRef([]);
  const igstRefs = useRef([]);
  const hsnCodeRefs = useRef([]);
  const saveButtonRef = useRef(null);
  const shippedtoRef = useRef(null);
  const remarksRef = useRef(null);
  const transportRef = useRef(null);
  const brokerRef = useRef(null);
  const tcsRef = useRef([]);
  const tcsRef2 = useRef([]);
  const addLessRef = useRef(null);
  const printButtonRef = useRef(null);
  const addButtonRef = useRef(null);
  const expAfterGSTRef = useRef(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  // const handleClose = () => setOpen(false);
  const [custGst, setCustgst] = useState("");
  const initialColors = [
    "#E9967A",
    "#F0E68C",
    "#FFDEAD",
    "#ADD8E6",
    "#87CEFA",
    "#FFF0F5",
    "#FFC0CB",
    "#D8BFD8",
    "#DC143C",
    "#DCDCDC",
    "#8FBC8F",
  ];
  const [selectedInvoice, setSelectedInvoice] = useState("InvoicePDF");
  const invoiceComponents = {
    InvoicePDF,
    InvoicepdfSale1,
    InvoiceSaleChallan,
    InvoiceSale2,
    InvoiceSale3,
    InvoiceKaryana,
    InvoiceG4,
    InvoiceSlip,
  };
  const handleCloseInvoice = () => setOpen(false);
  const SelectedInvoiceComponent = invoiceComponents[selectedInvoice];
  const [buttonColors, setButtonColors] = useState(initialColors); // Initial colors
  const [formData, setFormData] = useState({
    date: "",
    valpha:"",
    vtype: "S",
    vbillno: 0,
    vno: 0,
    gr: "",
    exfor: "",
    trpt: "",
    stype: "",
    btype: "",
    conv: "",
    rem1: "",
    rem2: "",
    v_tpt: "",
    broker: "",
    gross: false,
    tcsper: 0,
    srv_rate: 0,
    srv_tax: 0,
    tcs1_rate: 0,
    tcs1: 0,
    tcs206_rate: 0,
    tcs206: 0,
    duedate: "",
    pcess: 0,
    tax: 0,
    sub_total: 0,
    exp_before: 0,
    Exp_rate6: 0,
    Exp_rate7: 0,
    Exp_rate8: 0,
    Exp_rate9: 0,
    Exp_rate10: 0,
    Exp6: 0,
    Exp7: 0,
    Exp8: 0,
    Exp9: 0,
    Exp10: 0,
    Tds2: "",
    Ctds: "",
    Stds: "",
    iTds: "",
    cgst: 0,
    sgst: 0,
    igst: 0,
    expafterGST: 0,
    ExpRoundoff: 0,
    grandtotal: 0,
  });
  const [customerDetails, setcustomerDetails] = useState([
    {
      Vcode: "",
      vacode: "",
      gstno: "",
      pan: "",
      Add1: "",
      city: "",
      state: "",
      Tcs206c1H: "",
      TDS194Q: "",
    },
  ]);
  const MIN_ROWS = 5;

  const createEmptyRow = (id, expRates = {}) => ({
    id,
    vcode: "",
    vacode: "",
    stk_code: "",
    sdisc: "",
    Units: "",
    pkgs: "0",
    weight: "0",
    rate: "0",
    amount: "0",
    disc: 0,
    discount: "",
    gst: 0,
    Pcodes01: "",
    Pcodess: "",
    Scodes01: "",
    Scodess: "",
    RateCal: "",
    Qtyperpc: 0,
    Exp_rate1: expRates.ExpRate1 ?? 0,
    Exp_rate2: expRates.ExpRate2 ?? 0,
    Exp_rate3: expRates.ExpRate3 ?? 0,
    Exp_rate4: expRates.ExpRate4 ?? 0,
    Exp_rate5: expRates.ExpRate5 ?? 0,
    Exp1: 0,
    Exp2: 0,
    Exp3: 0,
    Exp4: 0,
    Exp5: 0,
    exp_before: 0,
    ctax: "0.00",
    stax: "0.00",
    itax: "0.00",
    tariff: "",
    vamt: "0.00",
  });

  const normalizeItems = (items = [], expRates = {}) => {
    const rows = [...items];

    while (rows.length < MIN_ROWS) {
      rows.push(createEmptyRow(rows.length + 1, expRates));
    }

    return rows;
  };

  const [items, setItems] = useState(() => normalizeItems());

  const [shipped, setshipped] = useState([
    {
      shippedto: "",
      shippingAdd: "",
      shippingcity: "",
      shippingState: "",
      shippingGst: "",
      shippingPan: "",
    },
  ]);

  useEffect(() => {
    console.log("CompanyState", CompanyState);

    if (addButtonRef.current && !saleId) {
      addButtonRef.current.focus();
    }
  }, []);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openPrintMenu = () => {
    setIsMenuOpen(true);
  };

  const closePrintMenu = () => {
    setIsMenuOpen(false);
  };

  const defaultTableFields = {
    itemcode: true,
    sdisc: true,
    hsncode: true,
    pcs: true,
    qty: true,
    rate: true,
    amount: true,
    discount: false,
    others: true,
    gst: true,
    cgst: true,
    sgst: true,
    igst: true,
  };

  const [tableData, settableData] = useState(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : {};

    // Only keep keys that exist in defaultFormData
    const sanitized = Object.fromEntries(
      Object.entries({ ...defaultTableFields, ...parsed }).filter(([key]) =>
        Object.hasOwn(defaultTableFields, key),
      ),
    );

    return sanitized;
  });

  // Save to localStorage whenever tableData changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tableData));
  }, [tableData]);

  const handleCheckboxChange = (field) => {
    settableData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const customerNameRef = useRef(null);
  const grNoRef = useRef(null);
  const termsRef = useRef(null);
  const vehicleNoRef = useRef(null);
  const billcashRef = useRef(null);
  const taxTypreRef = useRef(null);
  const supplyRef = useRef(null);
  const tableRef = useRef(null);

  const handleEnterKeyPress = (currentRef, nextRef) => (event) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      } else {
        if (tableRef.current) {
          const firstInputInTable = tableRef.current.querySelector("input");
          if (firstInputInTable) {
            firstInputInTable.focus();
          }
        }
      }
    }
  };
  const [T11, setT11] = useState(false);
  const [T12, setT12] = useState(false);
  const [T21, setT21] = useState(false);
  const [pkgsValue, setpkgsValue] = useState(0);
  const [weightValue, setweightValue] = useState(0);
  const [rateValue, setrateValue] = useState(0);
  const [Expense1, setExpense1] = useState("");
  const [Expense2, setExpense2] = useState("");
  const [Expense3, setExpense3] = useState("");
  const [Expense4, setExpense4] = useState(null);
  const [Expense5, setExpense5] = useState(null);
  const [Expense6, setExpense6] = useState(null);
  const [Expense7, setExpense7] = useState(null);
  const [Expense8, setExpense8] = useState(null);
  const [Expense9, setExpense9] = useState(null);
  const [Expense10, setExpens10] = useState(null);
  const [ExpRate1, setExpRate1] = useState(null);
  const [ExpRate2, setExpRate2] = useState(null);
  const [ExpRate3, setExpRate3] = useState(null);
  const [ExpRate4, setExpRate4] = useState(null);
  const [ExpRate5, setExpRate5] = useState(null);
  const [ExpRate6, setExpRate6] = useState(null);
  const [ExpRate7, setExpRate7] = useState(null);
  const [ExpRate8, setExpRate8] = useState(null);
  const [ExpRate9, setExpRate9] = useState(null);
  const [ExpRate10, setExpRate10] = useState(null);
  const [CalExp1, setCalExp1] = useState("");
  const [CalExp2, setCalExp2] = useState("");
  const [CalExp3, setCalExp3] = useState("");
  const [CalExp4, setCalExp4] = useState("");
  const [CalExp5, setCalExp5] = useState("");
  const [CalExp6, setCalExp6] = useState("");
  const [CalExp7, setCalExp7] = useState("");
  const [CalExp8, setCalExp8] = useState("");
  const [CalExp9, setCalExp9] = useState("");
  const [CalExp10, setCalExp10] = useState("");
  const [Pos, setPos] = useState("");
  const [Pos2, setPos2] = useState("");
  const [Pos3, setPos3] = useState("");
  const [Pos4, setPos4] = useState("");
  const [Pos5, setPos5] = useState("");
  const [Pos6, setPos6] = useState("");
  const [Pos7, setPos7] = useState("");
  const [Pos8, setPos8] = useState("");
  const [Pos9, setPos9] = useState("");
  const [Pos10, setPos10] = useState("");
  const [WindowBefore, setWindowBefore] = useState(null);
  const [WindowAfter, setWindowAfter] = useState(null);
  const [Defaultbutton, setDefaultbutton] = useState("");
  const [alertbackdate, setalertbackdate] = useState("");
  const [BillType, setBillType] = useState("");
  const [SupplyType, setSupplyType] = useState("");

  const fetchSalesSetup = async () => {
    try {
      const response = await fetch(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/salesetup`,
      );
      if (!response.ok) throw new Error("Failed to fetch sales setup");

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0 && data[0].formData) {
        const formDataFromAPI = data[0].formData;
        setsetupFormData(formDataFromAPI);
        const T21Value = formDataFromAPI.T21;
        const T11Value = formDataFromAPI.T11;
        const T12Value = formDataFromAPI.T12;
        const e1RateValue = formDataFromAPI.E1rate;
        setpkgsValue(formDataFromAPI.pkgs);
        setweightValue(formDataFromAPI.weight);
        setrateValue(formDataFromAPI.rate);
        setExpense1(formDataFromAPI.Exp1);
        setExpense2(formDataFromAPI.Exp2);
        setExpense3(formDataFromAPI.Exp3);
        setExpense4(formDataFromAPI.Exp4);
        setExpense5(formDataFromAPI.Exp5);
        setExpense6(formDataFromAPI.Exp6);
        setExpense7(formDataFromAPI.Exp7);
        setExpense8(formDataFromAPI.Exp8);
        setExpense9(formDataFromAPI.Exp9);
        setExpens10(formDataFromAPI.Exp10);
        setExpRate1(e1RateValue);
        setExpRate2(formDataFromAPI.E2rate);
        setExpRate3(formDataFromAPI.E3rate);
        setExpRate4(formDataFromAPI.E4rate);
        setExpRate5(formDataFromAPI.E5rate);
        setExpRate6(formDataFromAPI.E6rate);
        setExpRate7(formDataFromAPI.E7rate);
        setExpRate8(formDataFromAPI.E8rate);
        setExpRate9(formDataFromAPI.E9rate);
        setExpRate10(formDataFromAPI.E10rate);
        setCalExp1(formDataFromAPI.E1);
        setCalExp2(formDataFromAPI.E2);
        setCalExp3(formDataFromAPI.E3);
        setCalExp4(formDataFromAPI.E4);
        setCalExp5(formDataFromAPI.E5);
        setCalExp6(formDataFromAPI.E6);
        setCalExp7(formDataFromAPI.E7);
        setCalExp8(formDataFromAPI.E8);
        setCalExp9(formDataFromAPI.E9);
        setCalExp10(formDataFromAPI.E10);
        setPos(formDataFromAPI.E1add);
        setPos2(formDataFromAPI.E2add);
        setPos3(formDataFromAPI.E3add);
        setPos4(formDataFromAPI.E4add);
        setPos5(formDataFromAPI.E5add);
        setPos6(formDataFromAPI.E6add);
        setPos7(formDataFromAPI.E7add);
        setPos8(formDataFromAPI.E8add);
        setPos9(formDataFromAPI.E9add);
        setPos10(formDataFromAPI.E10add);
        setWindowBefore(formDataFromAPI.T6);
        setWindowAfter(formDataFromAPI.T7);
        setSelectedInvoice(formDataFromAPI.reportformat);
        setDefaultbutton(formDataFromAPI.T14);
        setalertbackdate(formDataFromAPI.alertbackdate);
        setBillType(formDataFromAPI.btype);
        setSupplyType(formDataFromAPI.conv);
        // Update T21 and T12 states
        setT21(T21Value === "Yes");
        setT12(T12Value === "Yes");
        setT11(T11Value === "Yes");
        // console.log("",T11);
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching sales setup:", error.message);
    }
  };
  useEffect(() => {
    fetchSalesSetup();
  }, [
    T11,
    T21,
    T12,
    ExpRate1,
    ExpRate2,
    ExpRate3,
    ExpRate4,
    ExpRate5,
    ExpRate6,
    ExpRate7,
    ExpRate8,
    ExpRate9,
    ExpRate10,
    Defaultbutton,
    BillType,
    SupplyType,
  ]);

  useEffect(() => {
    setItems((prev) =>
      normalizeItems(prev, {
        ExpRate1,
        ExpRate2,
        ExpRate3,
        ExpRate4,
        ExpRate5,
      }),
    );
  }, [ExpRate1, ExpRate2, ExpRate3, ExpRate4, ExpRate5]);

  // Calculate Total GST
  const calculateTotalGst = (formDataOverride = formData, skipTCS = false) => {
    let totalValue = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;
    let totalOthers = 0;
    let totalpcs = 0;
    let totalQty = 0;
    let totalDis = 0;
    const applicableTariffs = [
      "7204",
      "7602",
      "7902",
      "7404",
      "7503",
      "8002",
      "8101",
      "7802",
      "8112",
      "8113",
      "8104",
    ];

    items.forEach((item) => {
      const value = parseFloat(item.amount || 0);
      totalValue += value || 0;
      cgstTotal += parseFloat(item.ctax || 0);
      sgstTotal += parseFloat(item.stax || 0);
      igstTotal += parseFloat(item.itax || 0);
      totalOthers += parseFloat(item.exp_before || 0);
      totalpcs += parseFloat(item.pkgs || 0);
      totalQty += parseFloat(item.weight || 0);
      totalDis += parseFloat(item.discount || 0);
    });
    // Expense Calculations
    const subTotal = parseFloat(formDataOverride.sub_total) || 0;
    let exp6Rate = parseFloat(formDataOverride.Exp_rate6) || 0;
    let exp7Rate = parseFloat(formDataOverride.Exp_rate7) || 0;
    let exp8Rate = parseFloat(formDataOverride.Exp_rate8) || 0;
    let exp9Rate = parseFloat(formDataOverride.Exp_rate9) || 0;
    let exp10Rate = parseFloat(formDataOverride.Exp_rate10) || 0;
    let exp6 = 0;
    let exp7 = 0;
    let exp8 = 0;
    let exp9 = 0;
    let exp10 = 0;
    const Exp1Multiplier6 = Pos6 === "-Ve" ? -1 : 1;
    const Exp1Multiplier7 = Pos7 === "-Ve" ? -1 : 1;
    const Exp1Multiplier8 = Pos8 === "-Ve" ? -1 : 1;
    const Exp1Multiplier9 = Pos9 === "-Ve" ? -1 : 1;
    const Exp1Multiplier10 = Pos10 === "-Ve" ? -1 : 1;

    if (formDataOverride._manual_Exp6) {
      exp6 = parseFloat(formDataOverride.Exp6) || 0;
    } else {
      if (CalExp6 === "P" || CalExp6 === "p") {
        exp6 = (totalpcs * exp6Rate) / 100 || 0;
      } else if (CalExp6 === "W" || CalExp6 === "w") {
        exp6 = (totalQty * exp6Rate) / 100 || 0;
      } else {
        exp6 = (subTotal * exp6Rate) / 100 || 0;
      }
    }
    exp6 *= Exp1Multiplier6;
    if (!formDataOverride._manual_Exp6) {
      formDataOverride.Exp6 = exp6.toFixed(2);
    }

    // EXP 7
    if (formDataOverride._manual_Exp7) {
      exp7 = parseFloat(formDataOverride.Exp7) || 0;
    } else {
      if (CalExp7 === "P" || CalExp7 === "p") {
        exp7 = (totalpcs * exp7Rate) / 100 || 0;
      } else if (CalExp7 === "W" || CalExp7 === "w") {
        exp7 = (totalQty * exp7Rate) / 100 || 0;
      } else {
        exp7 = (subTotal * exp7Rate) / 100 || 0;
      }
    }

    exp7 *= Exp1Multiplier7;
      if (!formDataOverride._manual_Exp7) {
      formDataOverride.Exp7 = exp7.toFixed(2);
    }

    // EXP 8
    if (formDataOverride._manual_Exp8) {
      exp8 = parseFloat(formDataOverride.Exp8) || 0;
    } else {
      if (CalExp8 === "P" || CalExp8 === "p") {
        exp8 = (totalpcs * exp8Rate) / 100 || 0;
      } else if (CalExp8 === "W" || CalExp8 === "w") {
        exp8 = (totalQty * exp8Rate) / 100 || 0;
      } else {
        exp8 = (subTotal * exp8Rate) / 100 || 0;
      }
    }

    exp8 *= Exp1Multiplier8;
      if (!formDataOverride._manual_Exp8) {
      formDataOverride.Exp8 = exp8.toFixed(2);
    }

    // EXP 9
    if (formDataOverride._manual_Exp9) {
      exp9 = parseFloat(formDataOverride.Exp9) || 0;
    } else {
      if (CalExp9 === "P" || CalExp9 === "p") {
        exp9 = (totalpcs * exp9Rate) / 100 || 0;
      } else if (CalExp9 === "W" || CalExp9 === "w") {
        exp9 = (totalQty * exp9Rate) / 100 || 0;
      } else {
        exp9 = (subTotal * exp9Rate) / 100 || 0;
      }
    }

    exp9 *= Exp1Multiplier9;
      if (!formDataOverride._manual_Exp9) {
      formDataOverride.Exp9 = exp9.toFixed(2);
    }

    // EXP 10
    if (formDataOverride._manual_Exp10) {
      exp10 = parseFloat(formDataOverride.Exp10) || 0;
    } else {
      if (CalExp10 === "P" || CalExp10 === "p") {
        exp10 = (totalpcs * exp10Rate) / 100 || 0;
      } else if (CalExp10 === "W" || CalExp10 === "w") {
        exp10 = (totalQty * exp10Rate) / 100 || 0;
      } else {
        exp10 = (subTotal * exp10Rate) / 100 || 0;
      }
    }

    exp10 *= Exp1Multiplier10;
      if (!formDataOverride._manual_Exp10) {
      formDataOverride.Exp10 = exp10.toFixed(2);
    }

    // Calculate Total Expenses
    const totalExpenses = exp6 + exp7 + exp8 + exp9 + exp10;
    let gstTotal = cgstTotal + sgstTotal + igstTotal;
    let grandTotal =
      totalValue + gstTotal + totalOthers + totalExpenses + totalDis;
    let taxable = parseFloat(formDataOverride.sub_total) || 0;
    // ✅ Skip TCS Calculation if skipTCS is true
    let tcs206 = skipTCS ? parseFloat(formDataOverride.tcs206) : 0;
    let tcs206Rate = skipTCS ? parseFloat(formDataOverride.tcs206_rate) : 0;
    let tcs1 = parseFloat(formDataOverride.tcs1) || 0;
    let tcs1Rate = parseFloat(formDataOverride.tcs1_rate) || 0;
    let srvRate = skipTCS ? parseFloat(formDataOverride.srv_rate) : 0;
    let srv_tax = skipTCS ? parseFloat(formDataOverride.srv_tax) : 0;

    if (!skipTCS) {
      tcs1 = (grandTotal * tcs1Rate) / 100; // 1% TCS
      grandTotal += tcs1;
    } else if (skipTCS) {
      grandTotal += parseFloat(tcs1); // Add existing TCS to grand total
    }

    // const isTDS149QYes =customerDetails?.some((cust) => cust.TDS194Q?.toLowerCase() === "yes");
    if (!skipTCS && applicable194Q === "Above 10 Crore") {
      srv_tax = (taxable * 0.1) / 100;
      srvRate = 0.1;
      // grandTotal += srv_tax;
    }

    let cTds = 0,
      sTds = 0,
      iTds = 0,
      tcspercentage = "0";
    items.forEach((item) => {
      if (
        item.tariff &&
        applicableTariffs.some((tariff) => item.tariff.startsWith(tariff))
      ) {
        if (CompanyState == customerDetails[0].state) {
          cTds = totalValue * 0.01;
          sTds = totalValue * 0.01;
          tcspercentage = "2%";
        } else {
          iTds = totalValue * 0.02;
          tcspercentage = "2%";
        }
      }
    });

    let totalTds = cTds + sTds + iTds;
    let expafterGST = tcs206 + tcs1;
    let originalGrandTotal = grandTotal; // Save the unrounded grandTotal

    if (T21) {
      totalValue = Math.round(totalValue);
      grandTotal = Math.round(grandTotal);
      totalDis = Math.round(totalDis);
    }

    if (T12) {
      gstTotal = Math.round(gstTotal);
      cgstTotal = Math.round(cgstTotal);
      sgstTotal = Math.round(sgstTotal);
      igstTotal = Math.round(igstTotal);
      totalOthers = Math.round(totalOthers);
      expafterGST = Math.round(expafterGST);
      totalTds = Math.round(totalTds);
      tcs206 = Math.round(tcs206);
      srv_tax = Math.round(srv_tax);
      cTds = Math.round(cTds);
      sTds = Math.round(sTds);
      iTds = Math.round(iTds);
    }
    // Calculate Round-Off Difference
    let ExpRoundoff = grandTotal - originalGrandTotal;

    return {
      ...formDataOverride,
      tcsper: tcspercentage,
      tcs206: tcs206.toFixed(2),
      tcs206_rate: tcs206Rate.toFixed(2),
      tcs1: tcs1.toFixed(2),
      tcs1_rate: tcs1Rate.toFixed(2),
      srv_tax: srv_tax.toFixed(2),
      srv_rate: srvRate.toFixed(2),
      tax: gstTotal.toFixed(2),
      cgst: cgstTotal.toFixed(2),
      sgst: sgstTotal.toFixed(2),
      igst: igstTotal.toFixed(2),
      sub_total: totalValue.toFixed(2),
      Tds2: totalTds.toFixed(2),
      Ctds: cTds.toFixed(2),
      Stds: sTds.toFixed(2),
      iTds: iTds.toFixed(2),
      grandtotal: grandTotal.toFixed(2),
      exp_before: (totalOthers - totalDis).toFixed(2),
      expafterGST: (totalExpenses + tcs206 + tcs1).toFixed(2),
      ExpRoundoff: ExpRoundoff.toFixed(2),
    };
  };

  const handleNumberChange = (event) => {
    const { id, value } = event.target;

    const numberValue = value.replace(/[^0-9.]/g, "");

    setFormData((prevState) => {
      const newFormData = {
        ...prevState,
        [id]: numberValue,
      };

      // If typing directly in expense field → mark it manual
      if (["Exp6", "Exp7", "Exp8", "Exp9", "Exp10"].includes(id)) {
        newFormData[`_manual_${id}`] = true;
      }

      // If typing in rate → disable manual mode
      if (["Exp_rate6","Exp_rate7","Exp_rate8","Exp_rate9","Exp_rate10"].includes(id)) {
        const expField = id.replace("Exp_rate", "Exp");
        newFormData[`_manual_${expField}`] = false;
      }

      return calculateTotalGst(newFormData, true); // ✅ KEEP THIS
    });
  };

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [index, setIndex] = useState(0);
  const [isAddEnabled, setIsAddEnabled] = useState(true);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isPreviousEnabled, setIsPreviousEnabled] = useState(true);
  const [isNextEnabled, setIsNextEnabled] = useState(true);
  const [isFirstEnabled, setIsFirstEnabled] = useState(true);
  const [isLastEnabled, setIsLastEnabled] = useState(true);
  const [isSearchEnabled, setIsSearchEnabled] = useState(true);
  const [isPrintEnabled, setIsSPrintEnabled] = useState(true);
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(true);
  const [shouldFocusPrint, setShouldFocusPrint] = useState(false); // 👈 New flag to track
  const [shouldFocusAdd, setShouldFocusAdd] = useState(false); // 👈 New flag to track
  const { isEditMode, setIsEditMode } = useEditMode(); // Access the context
  const [isAbcmode, setIsAbcmode] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
  const [firstTimeCheckData, setFirstTimeCheckData] = useState("");
  const [setupFormData, setsetupFormData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isEditMode && saleId) {
        const modalState = JSON.parse(
          sessionStorage.getItem("trailModalState") || "{}",
        );

        navigate(-1); // go back
        setTimeout(() => {
          // restore modal state after navigation
          if (modalState.keepModalOpen) {
            window.dispatchEvent(
              new CustomEvent("reopenTrailModal", { detail: modalState }),
            );
          }
        }, 50);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isEditMode]);

  // state
  const [isFAModalOpen, setIsFAModalOpen] = useState(false);

  // when user clicks “FA VOUCHER VIEW” inside BillPrintMenu
  const handleViewFAVoucher = () => {
    // we need a voucher number for FA — you’re using formData.vno for FA entries
    if (!formData?.vno) {
      toast.info("No voucher number found.", { position: "top-center" });
      return;
    }
    setIsFAModalOpen(true);
  };

  useEffect(() => {
    const hasVcode =
      isEditMode && items.some((item) => String(item.vcode).trim() !== "");
    setIsSubmitEnabled(hasVcode);
  }, [items]);

  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";

    // ✅ Already dd-mm-yyyy
    const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/;
    const match = dateStr.match(ddmmyyyy);
    if (match) {
      const [, dd, mm, yyyy] = match;
      const test = new Date(`${yyyy}-${mm}-${dd}`);
      if (
        test.getDate() === Number(dd) &&
        test.getMonth() + 1 === Number(mm) &&
        test.getFullYear() === Number(yyyy)
      ) {
        return dateStr;
      }
    }

    let date;

    // ✅ ISO with time (Z or offset)
    if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
      const [y, m, d] = dateStr.substring(0, 10).split("-");
      date = new Date(y, m - 1, d); // avoid timezone issues
    }
    // ✅ ISO date only (yyyy-mm-dd)
    else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split("-");
      date = new Date(y, m - 1, d);
    }
    // ✅ dd/mm/yyyy
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split("/");
      date = new Date(y, m - 1, d);
    }
    // ✅ yyyy/mm/dd
    else if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split("/");
      date = new Date(y, m - 1, d);
    }
    // 🔁 fallback (Date.parse)
    else {
      date = new Date(dateStr);
    }

    if (!date || isNaN(date.getTime())) return "";

    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
  };

  const fetchData = async () => {
    try {
      let response;
      if (saleId) {
        response = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegstget/${saleId}`,
        );
      } else {
        response = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/last`,
        );
      }

      if (response.status === 200 && response.data && response.data.data) {
        const lastEntry = response.data.data;

        const updatedFormData = {
          ...lastEntry.formData,
          date: formatDateToDDMMYYYY(lastEntry.formData.date),
          duedate: formatDateToDDMMYYYY(lastEntry.formData.duedate),
        };

        setFirstTimeCheckData("DataAvailable");
        setFormData(updatedFormData);

        // setItems([...lastEntry.items]);
        setItems(normalizeItems(lastEntry.items));
        setcustomerDetails([...lastEntry.customerDetails]);
        setshipped([...lastEntry.shipped]);

        if (lastEntry.customerDetails.length > 0) {
          setCustgst(lastEntry.customerDetails[0].gstno);
        }

        setData1({ ...lastEntry, formData: updatedFormData });
        setIndex(lastEntry.formData?.vbillno || 0);

        return lastEntry; // ✅ Return this for use in handleAdd
      } else {
        setFirstTimeCheckData("DataNotAvailable");
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
      valpha:"",
      vtype: "S",
      vbillno: 0,
      vno: 0,
      gr: "",
      exfor: "",
      trpt: "",
      stype: "",
      btype: "",
      conv: "",
      rem1: "",
      rem2: "",
      v_tpt: "",
      broker: "",
      gross: false,
      srv_rate: 0,
      srv_tax: 0,
      tcs1_rate: 0,
      tcs1: 0,
      tcs206_rate: 0,
      tcs206: 0,
      duedate: "",
      pcess: 0,
      tax: 0,
      sub_total: 0,
      exp_before: 0,
      Exp_rate6: 0,
      Exp_rate7: 0,
      Exp_rate8: 0,
      Exp_rate9: 0,
      Exp_rate10: 0,
      Exp6: 0,
      Exp7: 0,
      Exp8: 0,
      Exp9: 0,
      Exp10: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      expafterGST: 0,
      grandtotal: 0,
    };
    const emptyItems = [
      {
        id: 1,
        vcode: "",
        vacode: "",
        stk_code: "",
        sdisc: "",
        Units: "",
        pkgs: "0.00",
        weight: "0.00",
        rate: "0.00",
        amount: "0.00",
        disc: 0,
        discount: "",
        gst: 0,
        RateCal: "",
        Qtyperpc: 0,
        Pcodes01: "",
        Pcodess: "",
        Scodes01: "",
        Scodess: "",
        Exp_rate1: 0,
        Exp_rate2: 0,
        Exp_rate3: 0,
        Exp_rate4: 0,
        Exp_rate5: 0,
        Exp1: 0,
        Exp2: 0,
        Exp3: 0,
        Exp4: 0,
        Exp5: 0,
        exp_before: 0,
        ctax: "0.00",
        stax: "0.00",
        itax: "0.00",
        tariff: "",
        vamt: "0.00",
      },
    ];
    const emptyshipped = [
      {
        shippedto: "",
        shippingAdd: "",
        shippingcity: "",
        shippingState: "",
        shippingGst: "",
        shippingPan: "",
      },
    ];
    const emptycustomer = [
      {
        Vcode: "",
        vacode: "",
        gstno: "",
        pan: "",
        city: "",
        state: "",
        Tcs206c1H: "",
        TDS194Q: "",
      },
    ];
    // Set the empty data
    setFormData(emptyFormData);
    setItems(normalizeItems([]));
    setcustomerDetails(emptycustomer);
    setshipped(emptyshipped);
    setData1({
      formData: emptyFormData,
      items: emptyItems,
      shipped: emptyshipped,
      customerDetails: emptycustomer,
    }); // Store empty data
    setIndex(0);
  };

  useEffect(() => {
    fetchData();
    setIsDisabled(true);
    // Add this line to set isDisabled to true initially
  }, []);

    // Search Modal states
  const [showSearch, setShowSearch] = useState(false);
  const [allBills, setAllBills] = useState([]);
  const [searchBillNo, setSearchBillNo] = useState("");
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchDate, setSearchDate] = useState(null);
  const [activeRowIndex, setActiveRowIndex] = useState(0);
    // ⭐ infinite scroll state
  const [visibleCount, setVisibleCount] = useState(10);

  // Fetch all bills for search
  const fetchAllBills = async () => {
    try {
      const res = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/sale`,
      );
      if (Array.isArray(res.data)) {
        setAllBills(res.data);
        setFilteredBills(res.data);
      }
    } catch (error) {
      console.error("Error fetching bills", error);
    }
  };

  // Update filtering logic
  useEffect(() => {
    let filtered = allBills;

    if (searchBillNo.trim() !== "") {
      filtered = filtered.filter((bill) =>
        bill.formData.vbillno
          .toString()
          .toLowerCase()
          .includes(searchBillNo.toLowerCase())
      );
    }

    if (searchDate) {
      const selected = formatDateToDDMMYYYY(searchDate);

      if (selected) {
        filtered = filtered.filter((bill) => {
          const billDate = formatDateToDDMMYYYY(bill.formData.date);
          return billDate === selected;
        });
      }
    }

    setFilteredBills(filtered);

    // ⭐ reset visible rows when search changes
    setVisibleCount(30);
  }, [searchBillNo, searchDate, allBills]);

  const handleSelectBill = (bill) => {
    setFormData(bill.formData);
    setcustomerDetails(bill.customerDetails);
    setItems(normalizeItems(bill.items));
    setshipped(bill.shipped);
  };
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSearch) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveRowIndex((prev) =>
          prev < filteredBills.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveRowIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const bill = filteredBills[activeRowIndex];
        if (bill) {
          handleSelectBill(bill);
          setShowSearch(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredBills, activeRowIndex, showSearch]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (showSearch) {
          setShowSearch(false);
          return;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showSearch]);

  const getTodayDDMMYYYY = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const fetchVoucherNumbers = async () => {
    try {
      const res = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/last-voucherno`,
      );

      return {
        lastVno: res?.data?.lastVno || 0,
        nextVno: res?.data?.nextVno || 1,
      };
    } catch (error) {
      console.error("Error fetching voucher numbers:", error);
      toast.error("Unable to fetch voucher number", {
        position: "top-center",
      });
      return null;
    }
  };

  const handleNext = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("(View)");
    try {
      if (data1) {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/${data1._id}/next`,
        );
        if (response.status === 200 && response.data) {
          const nextData = response.data.data;
          setData1(nextData);
          setIndex(index + 1);
          setFormData({
          ...nextData.formData,
          date: formatDateToDDMMYYYY(nextData.formData.date),
          duedate: formatDateToDDMMYYYY(nextData.formData.duedate),
          });

          // Update items and supplier details
          const updatedItems = nextData.items.map((item) => ({
            ...item,
          }));
          const updatedCustomer = nextData.customerDetails.map((item) => ({
            ...item,
          }));
          const updatedshipped = nextData.shipped.map((item) => ({
            ...item,
          }));
          setItems(normalizeItems(updatedItems));
          // setItems(updatedItems);
          setcustomerDetails(updatedCustomer);
          setshipped(updatedshipped);

          // Set custGst from the supplier details
          if (updatedCustomer.length > 0) {
            setCustgst(updatedCustomer[0].gstno); // Set GST number
          }
          setIsDisabled(true);
        }
      }
    } catch (error) {
      console.error("Error fetching next record:", error);
    }
  };

  const handlePrevious = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("(View)");
    try {
      if (data1) {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/${data1._id}/previous`,
        );
        if (response.status === 200 && response.data) {
          const prevData = response.data.data;
          setData1(prevData);
          setIndex(index - 1);
          setFormData({
          ...prevData.formData,
          date: formatDateToDDMMYYYY(prevData.formData.date),
          duedate: formatDateToDDMMYYYY(prevData.formData.duedate),
          });

          // Update items and supplier details
          const updatedItems = prevData.items.map((item) => ({
            ...item,
          }));
          const updatedCustomer = prevData.customerDetails.map((item) => ({
            ...item,
          }));
          const updatedshipped = prevData.shipped.map((item) => ({
            ...item,
          }));
          // setItems(updatedItems);
          setItems(normalizeItems(updatedItems));
          setcustomerDetails(updatedCustomer);
          setshipped(updatedshipped);

          // Set custGst from the supplier details
          if (updatedCustomer.length > 0) {
            setCustgst(updatedCustomer[0].gstno); // Set GST number
          }
          setIsDisabled(true);
        }
      }
    } catch (error) {
      console.error("Error fetching previous record:", error);
    }
  };

  const handleFirst = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("(View)");

    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/first`,
      );
      if (response.status === 200 && response.data) {
        const firstData = response.data.data;
        setData1(firstData);
        setIndex(0);
        setFormData({
        ...firstData.formData,
        date: formatDateToDDMMYYYY(firstData.formData.date),
        duedate: formatDateToDDMMYYYY(firstData.formData.duedate),
        });

        // Update items and supplier details
        const updatedItems = firstData.items.map((item) => ({
          ...item,
        }));
        const updatedCustomer = firstData.customerDetails.map((item) => ({
          ...item,
        }));
        const updatedshipped = firstData.shipped.map((item) => ({
          ...item,
        }));
        // setItems(updatedItems);
        setItems(normalizeItems(updatedItems));
        setcustomerDetails(updatedCustomer);
        setshipped(updatedshipped);

        // Set custGst from the supplier details
        if (updatedCustomer.length > 0) {
          setCustgst(updatedCustomer[0].gstno); // Set GST number
        }

        setIsDisabled(true);
      }
    } catch (error) {
      console.error("Error fetching first record:", error);
    }
  };

  const handleLast = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("(View)");

    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/last`,
      );
      if (response.status === 200 && response.data) {
        const lastData = response.data.data;
        setData1(lastData);
        const lastIndex = response.data.length - 1;
        setIndex(lastIndex);
        setFormData({
        ...lastData.formData,
        date: formatDateToDDMMYYYY(lastData.formData.date),
        duedate: formatDateToDDMMYYYY(lastData.formData.duedate),
        });

        // Update items and supplier details
        const updatedItems = lastData.items.map((item) => ({
          ...item,
        }));
        const updatedCustomer = lastData.customerDetails.map((item) => ({
          ...item,
        }));
        const updatedshipped = lastData.shipped.map((item) => ({
          ...item,
        }));
        // setItems(updatedItems);
        setItems(normalizeItems(updatedItems));
        setcustomerDetails(updatedCustomer);
        setshipped(updatedshipped);
        // Set custGst from the supplier details
        if (updatedCustomer.length > 0) {
          setCustgst(updatedCustomer[0].gstno); // Set GST number
        }

        setIsDisabled(true);
      }
    } catch (error) {
      console.error("Error fetching last record:", error);
    }
  };

  const handleAdd = async () => {
    if (datePickerRef.current) {
      datePickerRef.current.focus();
    }
    try {
      await fetchSalesSetup();
      const voucherData = await fetchVoucherNumbers();
      if (!voucherData) return;

      const lastvoucherno = voucherData.nextVno;
      const lastvno = voucherData.nextVno;

      const newData = {
        date: getTodayDDMMYYYY(),
        valpha: selectedValpha,
        vbillno: lastvoucherno,
        vno: lastvno,
        vtype: "S",
        gr: "",
        exfor: "",
        trpt: "",
        stype: "",
        btype: BillType,
        conv: SupplyType,
        rem1: "",
        rem2: "",
        v_tpt: "",
        broker: "",
        gross: false,
        tcsper: 0,
        srv_rate: 0,
        srv_tax: 0,
        tcs1_rate: 0,
        tcs1: 0,
        tcs206_rate: 0,
        tcs206: 0,
        duedate: getTodayDDMMYYYY(),
        pcess: 0,
        tax: 0,
        sub_total: 0,
        exp_before: 0,
        Exp_rate6: 0,
        Exp_rate7: 0,
        Exp_rate8: 0,
        Exp_rate9: 0,
        Exp_rate10: 0,
        Exp6: 0,
        Exp7: 0,
        Exp8: 0,
        Exp9: 0,
        Exp10: 0,
        Tds2: "",
        Ctds: "",
        Stds: "",
        iTds: "",
        cgst: 0,
        sgst: 0,
        igst: 0,
        expafterGST: 0,
        ExpRoundoff: 0,
        grandtotal: 0,
      };
      setData([...data, newData]);
      setFormData(newData);
      // setItems(normalizeItems([]));
      setItems(
        normalizeItems([], {
          ExpRate1,
          ExpRate2,
          ExpRate3,
          ExpRate4,
          ExpRate5,
        }),
      );
      setcustomerDetails([
        {
          Vcode: "",
          vacode: "",
          gstno: "",
          pan: "",
          Add1: "",
          city: "",
          state: "",
          Tcs206c1H: "",
          TDS194Q: "",
        },
      ]);
      setshipped([
        {
          shippedto: "",
          shippingAdd: "",
          shippingcity: "",
          shippingState: "",
          shippingGst: "",
          shippingPan: "",
        },
      ]);
      setIndex(data.length);
      setIsAddEnabled(false);
      setIsPreviousEnabled(false);
      setIsNextEnabled(false);
      setIsFirstEnabled(false);
      setIsLastEnabled(false);
      setIsSearchEnabled(false);
      setIsSPrintEnabled(false);
      setIsDeleteEnabled(false);
      setIsDisabled(false);
      setIsEditMode(true);
      setIsAbcmode(false);
      setTitle("NEW");
    } catch (error) {
      console.error("Error adding new entry:", error);
    }
  };

  const handleExit = async () => {
    // Check if grandtotal is Greater Than zero
    if (formData.grandtotal > 0 && isEditMode) {
      const confirmExit = window.confirm(
        "Are you sure you want to Exit? Unsaved changes may be lost.",
      );
      if (!confirmExit) {
        return;
      }
    }
    
    if(!isEditMode){
      navigate("/dashboard"); 
      return;
    }

    setTitle("(View)");
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/last`,
      );

      if (response.status === 200 && response.data.data) {
        const lastEntry = response.data.data;
        setFormData({
        ...lastEntry.formData,
        date: formatDateToDDMMYYYY(lastEntry.formData.date),
        duedate: formatDateToDDMMYYYY(lastEntry.formData.duedate),
        });
        setData1(response.data.data);
        // setItems(lastEntry.items.map((item) => ({ ...item })));
        setItems(normalizeItems(lastEntry.items));
        setcustomerDetails(
          lastEntry.customerDetails.map((item) => ({ ...item })),
        );
        setshipped(lastEntry.shipped.map((item) => ({ ...item })));

        setIsDisabled(true);
        setIndex(lastEntry.formData);
        setIsAddEnabled(true);
        setIsEditMode(false);
        setIsSubmitEnabled(false);
        setIsPreviousEnabled(true);
        setIsNextEnabled(true);
        setIsFirstEnabled(true);
        setIsLastEnabled(true);
        setIsSearchEnabled(true);
        setIsSPrintEnabled(true);
        setIsDeleteEnabled(true);
      } else {
        console.log("No data available");
        const newData = {
          date: "",
          valpha:"",
          vtype: "S",
          vbillno: 0,
          vno: 0,
          gr: "",
          exfor: "",
          trpt: "",
          stype: "",
          btype: "",
          conv: "",
          rem1: "",
          rem2: "",
          v_tpt: "",
          broker: "",
          srv_rate: 0,
          srv_tax: 0,
          tcs1_rate: 0,
          tcs1: 0,
          tcs206_rate: 0,
          tcs206: 0,
          duedate: "",
          pcess: 0,
          tax: 0,
          sub_total: 0,
          exp_before: 0,
          cgst: 0,
          sgst: 0,
          igst: 0,
          expafterGST: 0,
          grandtotal: 0,
        };
        setFormData(newData);
        setItems(normalizeItems([]));
        setcustomerDetails([
          {
            vacode: "",
            gstno: "",
            pan: "",
            Add1: "",
            city: "",
            state: "",
            Tcs206c1H: "",
            TDS194Q: "",
          },
        ]);
        setIsDisabled(true);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleEditClick = () => {
    setTitle("(Edit)");
    setIsDisabled(false);
    setIsEditMode(true);
    setIsAddEnabled(false);
    setIsSubmitEnabled(true);
    setIsPreviousEnabled(false);
    setIsNextEnabled(false);
    setIsFirstEnabled(false);
    setIsLastEnabled(false);
    setIsSearchEnabled(false);
    setIsSPrintEnabled(false);
    setIsDeleteEnabled(false);
    setIsAbcmode(true);
    if (customerNameRef.current) {
      customerNameRef.current.focus();
    }
  };

  const handleSaveClickwithSetup = async () => {
    document.body.style.backgroundColor = "white";
    let isDataSaved = false;

    try {
      // 1) Validate
      const isValid = customerDetails.every((item) => item.vacode !== "");
      if (!isValid) {
        toast.error("Please Fill the Customer Details", {
          position: "top-center",
        });
        return;
      }

      const nonEmptyItems = items.filter(
        (item) => (item.vacode || "").trim() !== "",
      );
      if (nonEmptyItems.length === 0) {
        toast.error("Please fill in at least one Items name.", {
          position: "top-center",
        });
        return;
      }

      const voucherData = await fetchVoucherNumbers();
      if (!voucherData) return;

      if (
        !isAbcmode &&
        Number(formData.vbillno) <= Number(voucherData.lastVno)
      ) {
        toast.error(`Voucher No ${formData.vbillno} already used!`, {
          position: "top-center",
        });
        setIsSubmitEnabled(true);
        return;
      }

      // 2) Build base form with setup codes (common to both add/edit)
      const baseForm = {
        date: formData.date,
        valpha: formData.valpha,
        duedate: formData.duedate,
        vtype: formData.vtype,
        vbillno: formData.vbillno,
        vno: formData.vno,
        gr: formData.gr,
        exfor: formData.exfor,
        trpt: formData.trpt,
        stype: formData.stype,
        btype: formData.btype,
        conv: formData.conv,
        rem1: formData.rem1,
        rem2: formData.rem2,
        v_tpt: formData.v_tpt,
        broker: formData.broker,
        srv_rate: formData.srv_rate,
        srv_tax: formData.srv_tax,
        tcs1_rate: formData.tcs1_rate,
        tcs1: formData.tcs1,
        tcs206_rate: formData.tcs206_rate,
        tcs206: formData.tcs206,
        // duedate: expiredDate.toLocaleDateString("en-IN"),
        pcess: formData.pcess,
        tax: formData.tax,
        sub_total: formData.sub_total,
        exp_before: formData.exp_before,
        Exp_rate6: formData.Exp_rate6,
        Exp_rate7: formData.Exp_rate7,
        Exp_rate8: formData.Exp_rate8,
        Exp_rate9: formData.Exp_rate9,
        Exp_rate10: formData.Exp_rate10,
        Exp6: formData.Exp6,
        Exp7: formData.Exp7,
        Exp8: formData.Exp8,
        Exp9: formData.Exp9,
        Exp10: formData.Exp10,
        Tds2: formData.Tds2,
        Ctds: formData.Ctds,
        Stds: formData.Stds,
        iTds: formData.iTds,
        cgst: formData.cgst,
        sgst: formData.sgst,
        igst: formData.igst,
        expafterGST: formData.expafterGST,
        grandtotal: formData.grandtotal,

        // setupFormData mapping
        cgst_ac: setupFormData.cgst_ac,
        cgst_code: setupFormData.cgst_code,
        sgst_ac: setupFormData.sgst_ac,
        sgst_code: setupFormData.sgst_code,
        igst_ac: setupFormData.igst_ac,
        igst_code: setupFormData.igst_code,

        cesscode: setupFormData.cesscode,
        cessAc: setupFormData.cessAc,

        tds_code: setupFormData.tds_code,
        tds_ac: setupFormData.tds_ac,

        tcs_code: setupFormData.tcs_code,
        tcs_ac: setupFormData.tcs_ac,
        tcs206_code: setupFormData.tcs206_code,
        tcs206_ac: setupFormData.tcs206_ac,

        discount_code: setupFormData.discount_code,
        discount_ac: setupFormData.discount_ac, // NOTE: account name

        // TDS ACCOUNTS
        cTds_code: setupFormData.cTds_code,
        cTds_ac: setupFormData.cTds_ac,
        sTds_code: setupFormData.sTds_code,
        sTds_ac: setupFormData.sTds_ac,
        iTds_code: setupFormData.iTds_code,
        iTds_ac: setupFormData.iTds_ac,

        expense1_code: setupFormData.E1Code,
        expense1_ac: setupFormData.E1name,
        expense2_code: setupFormData.E2Code,
        expense2_ac: setupFormData.E2name,
        expense3_code: setupFormData.E3Code,
        expense3_ac: setupFormData.E3name,
        expense4_code: setupFormData.E4Code,
        expense4_ac: setupFormData.E4name,
        expense5_code: setupFormData.E5Code,
        expense5_ac: setupFormData.E5name,
        expense6_code: setupFormData.E6Code,
        expense6_ac: setupFormData.E6name,
        expense7_code: setupFormData.E7Code,
        expense7_ac: setupFormData.E7name,
        expense8_code: setupFormData.E8Code,
        expense8_ac: setupFormData.E8name,
        expense9_code: setupFormData.E9Code,
        expense9_ac: setupFormData.E9name,
        expense10_code: setupFormData.E10Code,
        expense10_ac: setupFormData.E10name,
      };

      const itemsPayload = nonEmptyItems.map((item) => ({
        id: item.id,
        vcode: item.vcode,
        vacode: item.vacode,
        stk_code: item.stk_code,
        sdisc: item.sdisc,
        Units: item.Units,
        pkgs: item.pkgs,
        weight: item.weight,
        rate: item.rate,
        amount: item.amount,
        disc: item.disc,
        discount: item.discount,
        gst: item.gst,
        RateCal: item.RateCal,
        Qtyperpc: item.Qtyperpc,
        Pcodes01: item.Pcodes01,
        Pcodess: item.Pcodess,
        Scodes01: item.Scodes01,
        Scodess: item.Scodess,
        exp_before: item.exp_before,
        Exp_rate1: item.Exp_rate1,
        Exp_rate2: item.Exp_rate2,
        Exp_rate3: item.Exp_rate3,
        Exp_rate4: item.Exp_rate4,
        Exp_rate5: item.Exp_rate5,
        Exp1: item.Exp1,
        Exp2: item.Exp2,
        Exp3: item.Exp3,
        Exp4: item.Exp4,
        Exp5: item.Exp5,
        Exp6: item.Exp6,
        ctax: item.ctax,
        stax: item.stax,
        itax: item.itax,
        tariff: item.tariff,
        vamt: item.vamt,
      }));

      const combinedData = {
        _id: formData._id,
        formData: baseForm,
        items: itemsPayload,
        customerDetails: customerDetails.map((item) => ({
          Vcode: item.Vcode,
          vacode: item.vacode,
          gstno: item.gstno,
          pan: item.pan,
          Add1: item.Add1,
          city: item.city,
          state: item.state,
          Tcs206c1H: item.Tcs206c1H,
          TDS194Q: item.TDS194Q,
        })),
        shipped: shipped.map((item) => ({
          shippedto: item.shippedto,
          shippingAdd: item.shippingAdd,
          shippingcity: item.shippingcity,
          shippingState: item.shippingState,
          shippingGst: item.shippingGst,
          shippingPan: item.shippingPan,
        })),
      };

      // 3) Save Sale GST (add/edit)
      // const saleGstUrl = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst${isAbcmode ? `/${data1._id}` : ""}`; // NOTE: replace 'aa' with ${tenant} if you have it
      // const saleGstMethod = isAbcmode ? "put" : "post";
      // const saleRes = await axios({
      //   method: saleGstMethod,
      //   url: saleGstUrl,
      //   data: combinedData,
      // });

      // // Try to extract saleId from response; fallbacks included for PUT/legacy responses
      // const saleId =
      //   saleRes?.data?.saleId ||
      //   saleRes?.data?._id ||
      //   (isAbcmode ? data1?._id : null);

      // if (!saleId) {
      //   console.warn(
      //     "saleId not found in /salegst response. Ensure backend returns { ok: true, saleId }.",
      //   );
      // }

      // if (saleRes?.status === 200 || saleRes?.status === 201) {
      //   // 5) Post FA entries (with setup codes) — include saleId
      //   try {
      //     const faUrl = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salefaFile${isAbcmode ? `/${data1._id}` : ""}`;
      //     const faBody = saleId ? { ...combinedData, saleId } : combinedData;

      //     await axios({
      //       method: isAbcmode ? "put" : "post",
      //       url: faUrl,
      //       data: faBody,
      //     });
      //   } catch (faErr) {
      //     console.error("salefaFile error:", faErr);
      //   }

      //   fetchData();
      //   isDataSaved = true;
      // }
      console.table(combinedData);
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.", {
        position: "top-center",
      });
    } finally {
      // setIsSubmitEnabled(false);
      if (isDataSaved) {
        setIsSubmitEnabled(false);
        setTitle("(View)");
        setIsAddEnabled(true);
        setIsDisabled(true);
        setIsEditMode(false);
        setIsPreviousEnabled(true);
        setIsNextEnabled(true);
        setIsFirstEnabled(true);
        setIsLastEnabled(true);
        setIsSPrintEnabled(true);
        setIsSearchEnabled(true);
        setIsDeleteEnabled(true);
        toast.success("Data Saved Successfully!", { position: "top-center" });
        if (Defaultbutton === "Print") setShouldFocusPrint(true);
        else if (Defaultbutton === "Add") setShouldFocusAdd(true);
      } else {
        setIsAddEnabled(true);
        setIsDisabled(false);
      }
    }
  };

  const handleDataSave = async () => {
    handleSaveClickwithSetup();
  };

  // 👇 This runs AFTER isPrintEnabled changes
  useEffect(() => {
    if (shouldFocusPrint && isPrintEnabled && printButtonRef.current) {
      printButtonRef.current.focus();
      setShouldFocusPrint(false); // Reset flag
    }
    if (shouldFocusAdd && isAddEnabled && addButtonRef.current) {
      addButtonRef.current.focus();
      setShouldFocusAdd(false); // Reset flag
    }
  }, [isPrintEnabled, shouldFocusPrint, isAddEnabled, shouldFocusAdd]);

  const handleDeleteClick = async (id) => {
    if (!id) {
      toast.error("Invalid ID. Please select an item to delete.", {
        position: "top-center",
      });
      return;
    }

    const userConfirmed = window.confirm(
      "Are you sure you want to delete this from records?",
    );
    if (!userConfirmed) return;

    try {
      // Only one API – backend will delete SaleGst + FAFile (via saleId)
      const salegstEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/${data1._id}`;

      const response = await axios.delete(salegstEndpoint);

      if (response.status === 200) {
        toast.success("Data deleted successfully from records.", {
          position: "top-center",
        });
        fetchData(); // refresh grid
      } else {
        toast.error("Deletion failed.", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      toast.error(`Failed to delete data. Error: ${error.message}`, {
        position: "top-center",
      });
    }
  };
  // Update the blur handlers so that they always format the value to 2 decimals.
  const handlePkgsBlur = (index) => {
    const decimalPlaces = pkgsValue;
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index].pkgs);
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index].pkgs = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };
  const handleWeightBlur = (index) => {
    const decimalPlaces = weightValue;
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index].weight);
    updatedItems[index].weight = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };

  const handleRateBlur = (index) => {
    const decimalPlaces = rateValue;
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index].rate);
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index].rate = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };

  const handleBlur = (index, field) => {
    const decimalPlaces = 2;
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index][field]);
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index][field] = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };

  React.useEffect(() => {
    // Fetch products from the API when the component mounts
    fetchProducts();
  }, []);

  const fetchProducts = async (search = "") => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/stockmaster?search=${encodeURIComponent(search)}`,
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      const flattenedData = data.data.map((item) => ({
        ...item.formData,
        _id: item._id,
      }));
      // setProducts(flattenedData);
    } catch (error) {
      // setError(error.message);
    }
    setLoading(false);
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Modal For Items
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postingSetup, setPostingSetup] = useState({
    isDefault: false,
    rows: [],
  });
  useEffect(() => {
    const fetchPostingSetup = async () => {
      try {
        const res = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/sale-purchase-posting-setup`,
        );

        if (res.data?.ok) {
          setPostingSetup({
            isDefault: res.data.item.isDefault,
            rows: res.data.item.rows || [],
          });
        }
      } catch (error) {
        console.error("Failed to fetch posting setup", error);
      }
    };

    fetchPostingSetup();
  }, []);

  const handleItemChange = (index, key, value, field) => {
    if (
      (key === "pkgs" ||
        key === "weight" ||
        key === "tariff" ||
        key === "rate" ||
        key === "disc" ||
        key === "discount" ||
        key === "amount") &&
      !/^-?\d*\.?\d*$/.test(value)
    ) {
      return;
    }

    if (key === "disc" || key === "discount") {
      const numeric = parseFloat(value);
      if (!isNaN(numeric)) {
        value = -Math.abs(numeric);
      }
    }

    const updatedItems = [...items];

    if (["sdisc"].includes(key)) {
      updatedItems[index][key] = capitalizeWords(value);
    } else {
      updatedItems[index][key] = value;
    }

    // ================= PRODUCT SELECTION =================
    if (key === "name") {
      const selectedProduct = products.find(
        (product) => product.ahead === value
      );

      if (selectedProduct) {
        updatedItems[index]["vcode"] = selectedProduct.acode;
        updatedItems[index]["vacode"] = selectedProduct.ahead;
        updatedItems[index]["sdisc"] = selectedProduct.Aheads;
        updatedItems[index]["gst"] = selectedProduct.itax_rate;
        updatedItems[index]["tariff"] = selectedProduct.Hsn;
        updatedItems[index]["Units"] = selectedProduct.TradeName;

        if (isAbcmode) {
          const mrp = parseFloat(selectedProduct.Mrps);

          if (!isNaN(mrp) && mrp > 0) {
            updatedItems[index]["rate"] = mrp;

            // 🔥 FORCE AMOUNT CALCULATION BEFORE RETURN
            const pkgsVal = parseFloat(updatedItems[index].pkgs) || 0;
            const weightVal = parseFloat(updatedItems[index].weight) || 0;
            const RateCal = selectedProduct.Rateins;

            let total = 0;

            if (RateCal === "Pc/Pkgs") {
              total = pkgsVal * mrp;
            } else {
              total = weightVal * mrp;
            }

            updatedItems[index]["amount"] = T21
              ? Math.round(total).toFixed(2)
              : total.toFixed(2);
          }

          setItems(updatedItems);
          return; 
        }

        if (postingSetup?.isDefault === true) {
          const gstRate = String(selectedProduct.itax_rate);

          const matchedSetup = postingSetup.rows.find(
            (row) => String(row.gst) === gstRate
          );

          if (matchedSetup) {
            updatedItems[index]["Scodes01"] = matchedSetup.Scodes01;
            updatedItems[index]["Scodess"] = matchedSetup.Scodess;
            updatedItems[index]["Pcodes01"] = matchedSetup.Pcodes01;
            updatedItems[index]["Pcodess"] = matchedSetup.Pcodess;
          } else {
            updatedItems[index]["Scodes01"] = "";
            updatedItems[index]["Scodess"] = "";
            updatedItems[index]["Pcodes01"] = "";
            updatedItems[index]["Pcodess"] = "";
          }
        } else {
          updatedItems[index]["Scodes01"] = selectedProduct.AcCode;
          updatedItems[index]["Scodess"] = selectedProduct.Scodess;
          updatedItems[index]["Pcodes01"] = selectedProduct.acCode;
          updatedItems[index]["Pcodess"] = selectedProduct.Pcodess;
        }

        updatedItems[index]["RateCal"] = selectedProduct.Rateins;
        updatedItems[index]["Qtyperpc"] = selectedProduct.Qpps || 0;
        updatedItems[index]["curMrp"] = selectedProduct.Mrps || 0;

        // 🔥🔥🔥 ONLY ADDITION (Nothing else changed)
        key = "rate";
      }
    }

    // ================= REST OF YOUR ORIGINAL CODE (UNCHANGED) =================

    let pkgs = parseFloat(updatedItems[index].pkgs);
    pkgs = isNaN(pkgs) ? 0 : pkgs;

    let Qtyperpkgs = parseFloat(updatedItems[index].Qtyperpc);
    Qtyperpkgs = isNaN(Qtyperpkgs) ? 0 : Qtyperpkgs;

    let AL = pkgs * Qtyperpkgs || 0;
    let gst;

    if (pkgs > 0 && Qtyperpkgs > 0 && key !== "weight") {
      updatedItems[index]["weight"] = AL.toFixed(weightValue);
    }

    if (
      formData.stype === "Tax Free Within State" &&
      custGst.startsWith("03")
    ) {
      gst = 0;
    } else if (
      formData.stype === "Tax Free Interstate" &&
      !custGst.startsWith("03")
    ) {
      gst = 0;
    } else {
      gst = parseFloat(updatedItems[index].gst);
    }

    let weight = parseFloat(updatedItems[index].weight);
    weight = isNaN(weight) ? 0 : weight;

    const pkgsVal = parseFloat(updatedItems[index].pkgs) || 0;
    const rate = parseFloat(updatedItems[index].rate) || 0;

    const totalAccordingWeight = weight * rate;
    const totalAccordingPkgs = pkgsVal * rate;

    let RateCal = updatedItems[index].RateCal;
    let TotalAcc = totalAccordingWeight;

    if (
      RateCal === "Default" ||
      RateCal === "" ||
      RateCal === null ||
      RateCal === undefined
    ) {
      TotalAcc = totalAccordingWeight;
    } else if (RateCal === "Wt/Qty") {
      TotalAcc = totalAccordingWeight;
    } else if (RateCal === "Pc/Pkgs") {
      TotalAcc = totalAccordingPkgs;
    }

    const currentMrp = parseFloat(updatedItems[index].curMrp);

    if (key === "amount" && value !== "" && !isNaN(parseFloat(value)) && !value.endsWith(".")) {
      let enteredAmount = parseFloat(value);
      let rateVal = parseFloat(updatedItems[index].rate) || 0;

      // 🔥 NEW: Auto calculate qty when rate + amount entered
      if (rateVal > 0 && enteredAmount > 0) {
        let newQty = enteredAmount / rateVal;

        if (RateCal === "Pc/Pkgs") {
          updatedItems[index]["pkgs"] = newQty.toFixed(pkgsValue);
        } else {
          updatedItems[index]["weight"] = newQty.toFixed(weightValue);
        }
      }
      let qty = 0;

      if (RateCal === "Pc/Pkgs") {
        qty = parseFloat(updatedItems[index].pkgs) || 0;
      } else {
        qty = parseFloat(updatedItems[index].weight) || 0;
      }

      // 🔹 Keep your currentMrp logic exactly as it is
      if (!isNaN(currentMrp) && currentMrp > 0) {
        return;
      }

      // 🔹 Only calculate rate if quantity > 0
      if (qty > 0 && enteredAmount > 0) {
        let newRate = enteredAmount / qty;

        updatedItems[index]["rate"] = T21
          ? Math.round(newRate).toFixed(2)
          : newRate.toFixed(2);
      }

      // 🔹 Always set TotalAcc to enteredAmount so taxes calculate
      TotalAcc = enteredAmount;
    }

    TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;

    let others = parseFloat(updatedItems[index].exp_before) || 0;
    let disc = parseFloat(updatedItems[index].disc) || 0;
    let manualDiscount = parseFloat(updatedItems[index].discount) || 0;

    let per;
    if (key === "discount") {
      per = manualDiscount;
    } else {
      per = (disc / 100) * TotalAcc;
      updatedItems[index]["discount"] = T21
        ? Math.round(per).toFixed(2)
        : per.toFixed(2);
    }

    per = parseFloat(per);
    let Amounts = TotalAcc + per + others;

    let cgst, sgst, igst;
    if (CompanyState == customerDetails[0].state) {
      cgst = (Amounts * (gst / 2)) / 100 || 0;
      sgst = (Amounts * (gst / 2)) / 100 || 0;
      igst = 0;
    } else {
      cgst = sgst = 0;
      igst = (Amounts * gst) / 100 || 0;
    }

    let totalWithGST = Amounts + cgst + sgst + igst;

    if (T21) {
      if (key !== "discount") {
        updatedItems[index]["discount"] = Math.round(per).toFixed(2);
      }

      if (key !== "amount") {
        updatedItems[index]["amount"] = Math.round(TotalAcc).toFixed(2);
      }

      updatedItems[index]["vamt"] = Math.round(totalWithGST).toFixed(2);
    } else {
      if (key !== "discount") {
        updatedItems[index]["discount"] = parseFloat(per).toFixed(2);
      }

      if (key !== "amount") {
        updatedItems[index]["amount"] = TotalAcc.toFixed(2);
      }

      updatedItems[index]["vamt"] = totalWithGST.toFixed(2);
    }

    if (T12) {
      updatedItems[index]["ctax"] = Math.round(cgst).toFixed(2);
      updatedItems[index]["stax"] = Math.round(sgst).toFixed(2);
      updatedItems[index]["itax"] = Math.round(igst).toFixed(2);
    } else {
      updatedItems[index]["ctax"] = cgst.toFixed(2);
      updatedItems[index]["stax"] = sgst.toFixed(2);
      updatedItems[index]["itax"] = igst.toFixed(2);
    }

    const percentage =
      TotalAcc > 0 ? ((totalWithGST - Amounts) / TotalAcc) * 100 : 0;

    updatedItems[index]["percentage"] = percentage.toFixed(2);

    setItems(updatedItems);

    const updatedForm = calculateTotalGst(formData);
    setFormData(updatedForm);
  };

  // Function to handle adding a new item
  const handleAddItem = () => {
    if (isEditMode) {
      const newItem = {
        id: items.length + 1,
        vcode: "",
        vacode: "",
        stk_code: "",
        sdisc: "",
        Units: "",
        pkgs: 0,
        weight: 0,
        rate: 0,
        amount: 0,
        disc: 0,
        discount: "",
        gst: 0,
        RateCal: "",
        Qtyperpc: 0,
        Pcodes01: "",
        Pcodess: "",
        Scodes01: "",
        Scodess: "",
        Exp_rate1: ExpRate1 || 0,
        Exp_rate2: ExpRate2 || 0,
        Exp_rate3: ExpRate3 || 0,
        Exp_rate4: ExpRate4 || 0,
        Exp_rate5: ExpRate5 || 0,
        Exp1: 0,
        Exp2: 0,
        Exp3: 0,
        Exp4: 0,
        Exp5: 0,
        exp_before: 0,
        ctax: 0,
        stax: 0,
        itax: 0,
        tariff: "",
        vamt: 0,
      };
      setItems((prevItems) => [...prevItems, newItem]);
      setTimeout(() => {
        itemCodeRefs.current[items.length].focus();
      }, 100);
    }
  };

  const handleDeleteItem = (index) => {
    if (isEditMode) {
      const confirmDelete = window.confirm(
        "Do you really want to delete this item?",
      );
      // Proceed with deletion if the user confirms
      if (confirmDelete) {
        const filteredItems = items.filter((item, i) => i !== index);
        setItems(filteredItems);
      }
    }
  };

  const handleProductSelect = (product) => {
    if (selectedItemIndex !== null) {
      const updatedItems = [...items];

      updatedItems[selectedItemIndex]["vacode"] = product.ahead; // 🔥 MAIN LINE
      updatedItems[selectedItemIndex]["vcode"] = product.acode;  // optional

      setItems(updatedItems);
      setShowModal(false);
    }
  };

  const handleModalDone = (product) => {
    if (product) {
      // console.log(product);
      handleProductSelect(product);
    }
    setShowModal(false);
    fetchProducts();
    setIsEditMode(true);
  };

  const openModalForItem = (index) => {
    if (isEditMode) {
      setSelectedItemIndex(index);
      setShowModal(true);
    }
  };

  const allFields = products.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });

    return fields;
  }, []);

  // Modal For Customer
  React.useEffect(() => {
    // Fetch products from the API when the component mounts
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount`,
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      // Ensure to extract the formData for easier access in the rest of your app
      const formattedData = data.map((item) => ({
        ...item.formData,
        _id: item._id,
      }));
      setProducts(formattedData);
      setLoading(false);
      setProductsCus(formattedData);
      setLoadingCus(false);
      setProductsAcc(formattedData);
      setLoadingAcc(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
      setErrorCus(error.message);
      setLoadingCus(false);
      setErrorAcc(error.message);
      setLoadingAcc(false);
    }
  };

  // Modal For CustomerDetails
  const [productsCus, setProductsCus] = useState([]);
  const [showModalCus, setShowModalCus] = useState(false);
  const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
  const [loadingCus, setLoadingCus] = useState(true);
  const [errorCus, setErrorCus] = useState(null);

  const determineSaleType = (state, gstno, CompanyState) => {
    if (state === "Export") {
      return "Export Sale";
    } else if (state === CompanyState) {
      return gstno.trim() !== "" ? "GST Sale (RD)" : "GST (URD)";
    } else {
      return gstno.trim() !== "" ? "IGST Sale (RD)" : "IGST (URD)";
    }
  };

  const handleItemChangeCus = (index, key, value) => {
    const updatedItems = [...customerDetails];
    updatedItems[index][key] = value;

    if (key === "name") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value,
      );
      if (selectedProduct) {
        updatedItems[index] = {
          ...updatedItems[index],
          Vcode: selectedProduct.acode,
          vacode: selectedProduct.ahead,
          gstno: selectedProduct.gstNo,
          pan: selectedProduct.pan,
          Add1: selectedProduct.add1,
          city: selectedProduct.city,
          state: selectedProduct.state,
          Tcs206c1H: selectedProduct.tcs206,
          TDS194Q: selectedProduct.tds194q,
        };
        setCustgst(selectedProduct.gstNo);

        const stype = determineSaleType(
          selectedProduct.state,
          selectedProduct.gstNo,
          CompanyState,
        );
        setFormData((prevState) => ({
          ...prevState,
          stype,
        }));
      }
    }

    if (key === "state" || key === "gstno") {
      const { state, gstno } = updatedItems[index];
      const stype = determineSaleType(state, gstno, CompanyState);
      setFormData((prevState) => ({
        ...prevState,
        stype,
      }));
    }

    setcustomerDetails(updatedItems);
  };

  const handleProductSelectCus = (product) => {
    if (!product) {
      alert("No product received!");
      setShowModalCus(false);
      return;
    }

    // clone the array
    const newCustomers = [...customerDetails];

    // overwrite the one at the selected index
    newCustomers[selectedItemIndexCus] = {
      ...newCustomers[selectedItemIndexCus],
      Vcode: product.acode || "",
      vacode: product.ahead || "",
      city: product.city || "",
      gstno: product.gstNo || "",
      pan: product.pan || "",
      Add1: product.add1 || "",
      state: product.state || "",
      Tcs206c1H: product.tcs206 || "",
      TDS194Q: product.tds194q || "",
    };

    const stype = determineSaleType(
      product.state,
      product.gstNo || "",
      CompanyState,
    );
    setFormData((prevState) => ({
      ...prevState,
      stype,
    }));

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexCus !== null) {
      setFormData((prev) => ({
        ...prev,
        broker: product.agent || "", // <-- change key name based on your API
      }));
      if (selectedItemIndexCus === "v_tpt") {
        setFormData((prevData) => ({
          ...prevData,
          v_tpt: nameValue,
        }));
      } else {
        handleItemChangeCus(selectedItemIndexCus, "name", nameValue);
      }
    }
    setcustomerDetails(newCustomers);
    setIsEditMode(true);
    setShowModalCus(false);

    // restore focus
    setTimeout(() => {
      if (selectedItemIndexCus === "v_tpt") {
        transportRef.current?.focus();
      } else {
        shippedtoRef.current?.focus();
      }
    }, 0);
  };

  const handleCloseModalCus = () => {
    setShowModalCus(false);
    setIsEditMode(true);
    setPressedKey(""); // resets for next modal open
  };

  const openModalForItemCus = (index) => {
    if (isEditMode) {
      setSelectedItemIndexCus(index);
      setShowModalCus(true);
    }
  };

  const allFieldsCus = productsCus.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });

    return fields;
  }, []);

  const handleOpenModalTpt = (event, index) => {
    if (event.key === "ArrowDown" && isEditMode) {
      setSelectedItemIndexCus(index);
      setShowModalCus(true);
      event.preventDefault();
    }
  };
  // Modal For Shipping Address
  const [productsAcc, setProductsAcc] = useState([]);
  const [showModalAcc, setShowModalAcc] = useState(false);
  const [selectedItemIndexAcc, setSelectedItemIndexAcc] = useState(null);
  const [loadingAcc, setLoadingAcc] = useState(true);
  const [errorAcc, setErrorAcc] = useState(null);

  const handleItemChangeAcc = (index, key, value) => {
    const updatedItems = [...shipped];
    updatedItems[index][key] = value;
    // If the key is 'name', find the corresponding product and set the price
    if (key === "acName") {
      const selectedProduct = productsAcc.find(
        (product) => product.ahead === value,
      );
      if (selectedProduct) {
        updatedItems[index]["shippedto"] = selectedProduct.ahead;
        updatedItems[index]["shippingAdd"] = selectedProduct.add1;
        updatedItems[index]["shippingcity"] = selectedProduct.city;
        updatedItems[index]["shippingState"] = selectedProduct.state;
        updatedItems[index]["shippingGst"] = selectedProduct.gstNo;
        updatedItems[index]["shippingPan"] = selectedProduct.pan;
      }
    }
    setshipped(updatedItems);
  };
  const handleOpenModalBroker = (event, index) => {
    if (event.key === "ArrowDown" && isEditMode) {
      setSelectedItemIndexAcc(index);
      setShowModalAcc(true);
      event.preventDefault();
    }
  };

  const handleProductSelectAcc = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalAcc(false);
      return;
    }

    // Deep copy shipped array
    const updatedShipped = [...shipped];

    // Update the correct object in the array
    updatedShipped[selectedItemIndexAcc] = {
      ...updatedShipped[selectedItemIndexAcc],
      shippedto: product.ahead || "",
      shippingGst: product.gstNo || "",
      shippingAdd: product.add1 || "",
      shippingcity: product.city || "",
      shippingState: product.state || "",
      shippingPan: product.pan || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexAcc !== null) {
      if (selectedItemIndexAcc === "broker") {
        setFormData((prevData) => ({
          ...prevData,
          broker: nameValue,
        }));
      } else {
        handleItemChangeAcc(selectedItemIndexAcc, "acName", nameValue);
      }
    }
    setshipped(updatedShipped); // <- update the array in state!
    setIsEditMode(true);
    setShowModalAcc(false);

    // Optionally refocus
    setTimeout(() => {
      if (selectedItemIndexAcc === "broker") {
        brokerRef.current?.focus(); // Focus back to transport field
      } else {
        grNoRef.current.focus();
      }
    }, 0);
  };

  const openModalForItemAcc = (index) => {
    if (isEditMode) {
      setSelectedItemIndexAcc(index);
      setShowModalAcc(true);
    }
  };

  const allFieldsAcc = productsAcc.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });

    return fields;
  }, []);

  const handleTaxType = (event) => {
    const { value } = event.target;

    // Get customer state & GST number
    const customerState = customerDetails[0]?.state;
    const customerGST = customerDetails[0]?.gstno?.trim();

    // Define allowed tax types
    let allowedTypes = ["Not Applicable", "Exempted Sale"];

    if (customerState === CompanyState) {
      allowedTypes.push(customerGST ? "GST Sale (RD)" : "GST (URD)");
    } else {
      allowedTypes.push(customerGST ? "IGST Sale (RD)" : "IGST (URD)");
    }

    // Special condition for GST starting with "03"
    if (customerGST.startsWith("03")) {
      allowedTypes.push(
        "Tax Free Within State",
        "Including GST",
        "Export Sale",
      );
    } else {
      allowedTypes.push(
        "Tax Free Interstate",
        "Including IGST",
        "Export Sale(IGST)",
      );
    }

    if (!allowedTypes.includes(value)) {
      toast.error("Invalid Tax Type Selection !", { autoClose: 1500 });
      return; // Prevents state update
    }

    setFormData((prevState) => ({
      ...prevState,
      stype: value,
    }));
  };

  const handleBillCash = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      btype: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleSupply = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      conv: value, // Update the ratecalculate field in FormData
    }));
  };

  const HandleValueChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: capitalizeWords(value),
    }));
  };

  const handleCapitalAlpha = (event) => {
    const { id, value } = event.target;
    // force all letters to uppercase
    const uppercasedValue = value.toUpperCase();
    setFormData((prevData) => ({
      ...prevData,
      [id]: uppercasedValue,
    }));
  };

  const handleNumericValue = (event) => {
    const { id, value } = event.target;
    // Allow only numeric values, including optional decimal points
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  const handleInputChange = (index, field, value) => {
    const numericValue =
      typeof value === "string" ? value.replace(/[^0-9.-]/g, "") : value;

    const updatedItems = [...items];
    updatedItems[index][field] = numericValue;

    setItems(updatedItems);
  };

  const handleExpenseBlur = (index, field) => {
    const updatedItems = [...items];
    const item = updatedItems[index];

    const vamt = parseFloat(item.amount) || 0;

    const expMap = [
      { rate: "Exp_rate1", val: "Exp1", flag: "isManual1" },
      { rate: "Exp_rate2", val: "Exp2", flag: "isManual2" },
      { rate: "Exp_rate3", val: "Exp3", flag: "isManual3" },
      { rate: "Exp_rate4", val: "Exp4", flag: "isManual4" },
      { rate: "Exp_rate5", val: "Exp5", flag: "isManual5" },
    ];

    expMap.forEach(({ rate, val, flag }) => {
      // RATE → VALUE
      if (field === rate && vamt > 0) {
        const r = parseFloat(item[rate]) || 0;
        item[val] = ((vamt * r) / 100).toFixed(2);
        item[flag] = false; // calculated
      }

      // VALUE → RATE
      if (field === val && vamt > 0) {
        const v = parseFloat(item[val]) || 0;

        item[val] = v.toFixed(2); // fix value to 2 decimals
        item[rate] = ((v / vamt) * 100).toFixed(2); // 🔥 keep full precision
        item[flag] = true; // manually entered
      }
    });

    setItems(updatedItems);
  };

  useEffect(() => {
    if (currentIndex !== null && items[currentIndex]) {
      const updatedItems = [...items];
      const item = { ...updatedItems[currentIndex] };

      const vamt = parseFloat(item.amount) || 0;
      const pkgs = parseFloat(item.pkgs) || 0;
      const weight = parseFloat(item.weight) || 0;
      // Expense Calculations
      let Exp1 = 0,
        Exp2 = 0,
        Exp3 = 0,
        Exp4 = 0,
        Exp5 = 0;

      const Exp1Multiplier = Pos === "-Ve" ? -1 : 1;
      const Exp2Multiplier = Pos2 === "-Ve" ? -1 : 1;
      const Exp3Multiplier = Pos3 === "-Ve" ? -1 : 1;
      const Exp4Multiplier = Pos4 === "-Ve" ? -1 : 1;
      const Exp5Multiplier = Pos5 === "-Ve" ? -1 : 1;

      // ======================= EXP 1 =======================
      if (!item.isManual1 && item.Exp_rate1) {
        if (CalExp1?.toLowerCase() === "w") {
          Exp1 = (weight * parseFloat(item.Exp_rate1)) / 100;
        } else if (CalExp1?.toLowerCase() === "p") {
          Exp1 = (pkgs * parseFloat(item.Exp_rate1)) / 100;
        } else {
          Exp1 = (vamt * parseFloat(item.Exp_rate1)) / 100;
        }

        Exp1 *= Exp1Multiplier;
        item.Exp1 = Exp1.toFixed(2);
      } else {
        Exp1 = parseFloat(item.Exp1) || 0;
      }

      // ======================= EXP 2 =======================
      if (!item.isManual2 && item.Exp_rate2) {
        if (CalExp2?.toLowerCase() === "w") {
          Exp2 = (weight * parseFloat(item.Exp_rate2)) / 100;
        } else if (CalExp2?.toLowerCase() === "p") {
          Exp2 = (pkgs * parseFloat(item.Exp_rate2)) / 100;
        } else {
          Exp2 = (vamt * parseFloat(item.Exp_rate2)) / 100;
        }

        Exp2 *= Exp2Multiplier;
        item.Exp2 = Exp2.toFixed(2);
      } else {
        Exp2 = parseFloat(item.Exp2) || 0;
      }

      // ======================= EXP 3 =======================
      if (!item.isManual3 && item.Exp_rate3) {
        if (CalExp3?.toLowerCase() === "w") {
          Exp3 = (weight * parseFloat(item.Exp_rate3)) / 100;
        } else if (CalExp3?.toLowerCase() === "p") {
          Exp3 = (pkgs * parseFloat(item.Exp_rate3)) / 100;
        } else {
          Exp3 = (vamt * parseFloat(item.Exp_rate3)) / 100;
        }

        Exp3 *= Exp3Multiplier;
        item.Exp3 = Exp3.toFixed(2);
      } else {
        Exp3 = parseFloat(item.Exp3) || 0;
      }

      // ======================= EXP 4 =======================
      if (!item.isManual4 && item.Exp_rate4) {
        if (CalExp4?.toLowerCase() === "w") {
          Exp4 = (weight * parseFloat(item.Exp_rate4)) / 100;
        } else if (CalExp4?.toLowerCase() === "p") {
          Exp4 = (pkgs * parseFloat(item.Exp_rate4)) / 100;
        } else {
          Exp4 = (vamt * parseFloat(item.Exp_rate4)) / 100;
        }

        Exp4 *= Exp4Multiplier;
        item.Exp4 = Exp4.toFixed(2);
      } else {
        Exp4 = parseFloat(item.Exp4) || 0;
      }

      // ======================= EXP 5 =======================
      if (!item.isManual5 && item.Exp_rate5) {
        if (CalExp5?.toLowerCase() === "w") {
          Exp5 = (weight * parseFloat(item.Exp_rate5)) / 100;
        } else if (CalExp5?.toLowerCase() === "p") {
          Exp5 = (pkgs * parseFloat(item.Exp_rate5)) / 100;
        } else {
          Exp5 = (vamt * parseFloat(item.Exp_rate5)) / 100;
        }

        Exp5 *= Exp5Multiplier;
        item.Exp5 = Exp5.toFixed(2);
      } else {
        Exp5 = parseFloat(item.Exp5) || 0;
      }
      // Total Expense Before GST
      const totalExpenses = Exp1 + Exp2 + Exp3 + Exp4 + Exp5;
      item.exp_before = totalExpenses.toFixed(2);

      // GST & Total Calculations
      const gst = parseFloat(item.gst) || 0;
      const totalAccordingWeight =
        (parseFloat(item.weight) || 0) * (parseFloat(item.rate) || 0);
      const totalAccordingPkgs =
        (parseFloat(item.pkgs) || 0) * (parseFloat(item.rate) || 0);
      let RateCal = item.RateCal;
      let TotalAcc =
        RateCal === "Pc/Pkgs" ? totalAccordingPkgs : totalAccordingWeight;

      let disc = parseFloat(item.disc) || 0;
      let per = ((disc / 100) * TotalAcc).toFixed(2);
      let PerCenTage = parseFloat(per);
      let Amounts = TotalAcc + totalExpenses + parseFloat(per);

      TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;

      // GST Logic Based on State
      let cgst = 0,
        sgst = 0,
        igst = 0;

      if (CompanyState == customerDetails[0].state) {
        cgst = (Amounts * (gst / 2)) / 100;
        sgst = (Amounts * (gst / 2)) / 100;
      } else {
        igst = (Amounts * gst) / 100;
      }

      // Final Total Calculation
      const totalWithGST = Amounts + cgst + sgst + igst;
      if (T12) {
        item.ctax = Math.round(cgst).toFixed(2);
        item.stax = Math.round(sgst).toFixed(2);
        item.itax = Math.round(igst).toFixed(2);
        item.discount = Math.round(PerCenTage).toFixed(2);
        item.vamt = Math.round(totalWithGST).toFixed(2);
      } else {
        item.ctax = cgst.toFixed(2);
        item.stax = sgst.toFixed(2);
        item.itax = igst.toFixed(2);
        item.discount = PerCenTage.toFixed(2);
        item.vamt = totalWithGST.toFixed(2);
      }
      updatedItems[currentIndex] = item;
      setItems(updatedItems);
      calculateTotalGst();
    }
  }, [
    currentIndex,
    items[currentIndex]?.amount,
    items[currentIndex]?.Exp_rate1,
    items[currentIndex]?.Exp_rate2,
    items[currentIndex]?.Exp_rate3,
    items[currentIndex]?.Exp_rate4,
    items[currentIndex]?.Exp_rate5,
    items[currentIndex]?.gst,
    items[currentIndex]?.weight,
    items[currentIndex]?.rate,
    items[currentIndex]?.pkgs,
    items[currentIndex]?.RateCal,
  ]);

  const [fontSize, setFontSize] = useState(17); // Initial font size in pixels
  const increaseFontSize = () => {
    setFontSize((prevSize) => (prevSize < 20 ? prevSize + 2 : prevSize)); // Increase font size up to 20 pixels
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => (prevSize > 14 ? prevSize - 2 : prevSize)); // Decrease font size down to 14 pixels
  };
  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
  const fieldOrder = [
    { name: "vacode", refArray: itemCodeRefs },
    { name: "sdisc", refArray: desciptionRefs },
    { name: "tariff", refArray: hsnCodeRefs },
    { name: "pkgs", refArray: peciesRefs },
    { name: "weight", refArray: quantityRefs },
    { name: "rate", refArray: priceRefs },
    { name: "amount", refArray: amountRefs },
    { name: "disc", refArray: discountRef },
    { name: "discount", refArray: discount2Ref },
    { name: "exp_before", refArray: othersRefs },
    { name: "gst", refArray: gstRef },
  ];

  const focusRef = (refArray, rowIndex) => {
    const el = refArray?.current?.[rowIndex];
    if (el) {
      el.focus();
      // Safely call select if available
      setTimeout(() => el.select && el.select(), 0);
      return true;
    }
    return false;
  };
  const focusScrollRow = (refArray, rowIndex) => {
    const inputEl = refArray?.current?.[rowIndex];
    const container = tableContainerRef.current;

    if (!inputEl || !container) return;

    inputEl.focus();
    setTimeout(() => inputEl.select && inputEl.select(), 0);

    const rowEl = inputEl.closest("tr");
    if (!rowEl) return;

    const rowTop = rowEl.offsetTop;
    const rowHeight = rowEl.offsetHeight;
    const containerHeight = container.clientHeight;

    container.scrollTop = rowTop - containerHeight + rowHeight + 60;
  };

  const handleKeyDown = (event, index, field) => {
    // --------------- ENTER / TAB: move to NEXT FIELD -----------------
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();

      // Special case for vacode: your existing behaviour
      if (field === "vacode") {
        if ((items[index].vacode || "").trim() === "") {
          // Go to remarks if description is empty
          remarksRef.current?.focus();
        } else {
          focusRef(desciptionRefs, index);
        }
        return;
      }

      // Special case for exp_before: go to next row / add row
      if (field === "gst") {
        const isLastRow = index === items.length - 1;
        if (isLastRow) {
          handleAddItem();

          setTimeout(() => {
            focusScrollRow(itemCodeRefs, index + 1);
          }, 0);
        } else {
          focusScrollRow(itemCodeRefs, index + 1);
        }
        return;
      }

      // Generic: find current field in fieldOrder and move to next available
      const currentPos = fieldOrder.findIndex((f) => f.name === field);

      if (currentPos !== -1) {
        for (let i = currentPos + 1; i < fieldOrder.length; i++) {
          const nextField = fieldOrder[i];
          // Only move if that ref exists for this row (means column is visible)
          if (focusRef(nextField.refArray, index)) {
            return;
          }
        }
      }

      // If nothing else found, you can optionally jump to remarks or transport:
      // focusRef(remarksRef, 0);  // if you make remarksRef an array or handle separately

      return;
    }

    // -------------------- ARROW RIGHT --------------------
    else if (event.key === "ArrowRight") {
      if (field === "vacode") {
        focusRef(desciptionRefs, index);
      } else if (field === "sdisc") {
        focusRef(hsnCodeRefs, index);
      } else if (field === "tariff") {
        focusRef(peciesRefs, index);
      } else if (field === "pkgs") {
        focusRef(quantityRefs, index);
      } else if (field === "weight") {
        focusRef(priceRefs, index);
      } else if (field === "rate") {
        // If amount column exists, go there first, else to disc
        if (!focusRef(amountRefs, index)) {
          focusRef(discountRef, index);
        }
      } else if (field === "amount") {
        focusRef(discountRef, index);
      } else if (field === "disc") {
        focusRef(discount2Ref, index);
      } else if (field === "discount") {
        focusRef(othersRefs, index);
      }else if (field === "exp_before") {
        focusRef(gstRef, index);
      }
    }

    // -------------------- ARROW LEFT --------------------
    else if (event.key === "ArrowLeft") {
      if (field === "gst") {
        focusRef(othersRefs, index);
      }
      else if (field === "exp_before") {
        focusRef(discount2Ref, index);
      } else if (field === "discount") {
        focusRef(discountRef, index);
      } else if (field === "disc") {
        focusRef(amountRefs, index);
      } else if (field === "amount") {
        focusRef(priceRefs, index);
      } else if (field === "rate") {
        focusRef(quantityRefs, index);
      } else if (field === "weight") {
        focusRef(peciesRefs, index);
      } else if (field === "pkgs") {
        focusRef(hsnCodeRefs, index);
      } else if (field === "tariff") {
        focusRef(desciptionRefs, index);
      } else if (field === "sdisc") {
        focusRef(itemCodeRefs, index);
      } else if (field === "vacode") {
        focusRef(itemCodeRefs, index);
      }
    }

    // --------------- OPEN MODAL ON LETTER (ACCOUNT NAME) ---------------
    else if (/^[a-zA-Z]$/.test(event.key) && field === "accountname") {
      setPressedKey(event.key);
      openModalForItemCus(index);
      event.preventDefault();
    }
  };

  const handleOpenModalBack = (event, index, field) => {
    if (event.key === "Backspace" && field === "accountname" && isEditMode) {
      setSelectedItemIndexCus(index);
      setShowModalCus(true);
      event.preventDefault();
    }
    if (event.key === "Backspace" && field === "shippedto" && isEditMode) {
      setSelectedItemIndexAcc(index);
      setShowModalAcc(true);
      event.preventDefault();
    }
    if (event.key === "Backspace" && field === "vacode" && isEditMode) {
      setSelectedItemIndex(index);
      setShowModal(true);
      event.preventDefault();
    }
  };

  const handleOpenModal = (event, index, field) => {
    if (/^[a-zA-Z]$/.test(event.key) && field === "vacode") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItem(index);
      event.preventDefault(); // Prevent any default action
    }
    if (/^[a-zA-Z]$/.test(event.key) && field === "shippedto") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItemAcc(index);
      event.preventDefault(); // Prevent any default action
    }
  };

  const gradientOptions = [
    {
      label: "Lavender",
      value: "linear-gradient(to right, #d4d4fcff, #b19cd9)",
    },
    { label: "Yellow", value: "linear-gradient(to right, #fffac2, #ffdd57)" },
    { label: "Skyblue", value: "linear-gradient(to right, #ceedf0, #7fd1e4)" },
    { label: "Green", value: "linear-gradient(to right, #9ff0c3, #45a049)" },
    { label: "Pink", value: "linear-gradient(to right, #ecc7cd, #ff9a9e)" },
  ];

  const [color, setColor] = useState(() => {
    return localStorage.getItem("SelectedColorsSS") || gradientOptions[0].value;
  });

  useEffect(() => {
    localStorage.setItem("SelectedColorsSS", color);
  }, [color]);

  const handleChange = (event) => {
    setColor(event.target.value);
  };
  const handleKeyDowndown = (event, nextFieldRef) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault(); // Prevent form submission
      if (nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };

  const handleGross = (e) => {
    const { id, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value; // Handle checkbox differently
    setFormData({ ...formData, [id]: val });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    // console.log("Modal opened");
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [isModalOpenExp, setIsModalOpenExp] = useState(false);

  const handleKeyDownExp = (e, fieldName, index) => {
    if (e.key === "F2" && fieldName === "exp_before") {
      e.preventDefault(); // Optional: stop default F2 behavior
      setCurrentIndex(index);
      setIsModalOpenExp(true);
    }
  };

  const [isModalOpenAfter, setIsModalOpenAfter] = useState(false);
  const handleKeyDownAfter = (e) => {
    if (e.key === "ArrowDown") {
      setIsModalOpenAfter(true);
    }
  };
  const closeModalAfter = () => {
    setIsModalOpenAfter(false);
    expAfterGSTRef.current.focus();
  };

  const handleDoubleClickAfter = (fieldName) => {
    if (fieldName === "expafterGST" && isEditMode) {
      setIsModalOpenAfter(true);
    }
  };

  const handleDoubleClick = (event, fieldName, index) => {
    if (fieldName === "exp_before" && isEditMode) {
      setCurrentIndex(index); // Set the current index
      setIsModalOpenExp(true); // Open the modal
      event.preventDefault();
    }
    if (isEditMode && fieldName === "accountname") {
      setSelectedItemIndexCus(index);
      setShowModalCus(true);
      event.preventDefault();
    }
    if (isEditMode && fieldName === "shippedto") {
      setSelectedItemIndexAcc(index);
      setShowModalAcc(true);
      event.preventDefault();
    }
    if (isEditMode && fieldName === "vacode") {
      setSelectedItemIndex(index);
      setShowModal(true);
      event.preventDefault();
    }
  };
  const expRateRefs = useRef([]); // Store refs for Exp_rate fields
  const closeButtonRef = useRef(null); // Ref for the close button

  useEffect(() => {
    if (isModalOpenExp && expRateRefs.current[0]) {
      expRateRefs.current[0].focus(); // Focus on the first Exp_rate input when modal opens
    }
  }, [isModalOpenExp]);

  const handleKeyDownModal = (event, index) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();

      if (index < expRateRefs.current.length - 1) {
        expRateRefs.current[index + 1]?.focus();
        expRateRefs.current[index + 1]?.select();
      } else {
        closeButtonRef.current?.focus();
      }
    }
  };

  // EXP AFTER
  const expAfterRefs = useRef([]);
  const closeAfterRef = useRef(null);
  useEffect(() => {
    if (isModalOpenAfter && expAfterRefs.current[0]) {
      expAfterRefs.current[0].focus();
    }
  }, [isModalOpenAfter]);
  const handleKeyDownAfterw2 = (event, index) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault();

      if (index < expAfterRefs.current.length - 1) {
        expAfterRefs.current[index + 1]?.focus();
        expAfterRefs.current[index + 1]?.select();
      } else {
        closeAfterRef.current?.focus();
      }
    }
  };

  const handleKeyDownTab = (e) => {
    if (e.key === "Tab" || e.key === "Enter") {
      e.preventDefault(); // prevent default Tab behavior
      customerNameRef.current.focus(); // move focus to vaCode2 input
    }
  };

  const handleKeyDownTab2 = (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // prevent default Tab behavior
      saveButtonRef.current.focus(); // move focus to vaCode2 input
    }
  };

  const printRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: () => setOpen(false), // auto-close after print
  });

  const handlePrintClick = () => {
    setOpen(true);
    setTimeout(() => {
      handlePrint();
      setOpen(false); // hide right after print
    }, 300);
  };

  const isRowFilled = (row) => {
    return (row.vacode || "").trim() !== "";
  };
  const canEditRow = (rowIndex) => {
    // 🔒 If not in edit mode, nothing is editable
    if (!isEditMode) return false;

    // First row is editable in edit mode
    if (rowIndex === 0) return true;

    // All previous rows must be filled
    for (let i = 0; i < rowIndex; i++) {
      if (!isRowFilled(items[i])) {
        return false;
      }
    }
    return true;
  };

  const nonEmptyItems2 = items.filter(
    (item) => (item.vacode || "").trim() !== "",
  );

  // ShortCuts for Buttons
  const AnyModalOpen = showModalCus || showModal || showModalAcc ||
   isModalOpen || isModalOpenAfter || isModalOpenExp || drawerOpen || showSearch
  useShortcuts({
    handleAdd,
    handleEdit: handleEditClick,
    handlePrevious,
    handleNext,
    handleFirst,
    handleLast,
    handleExit,
    handlePrint: openPrintMenu,
    isEditMode,
    isModalOpen: AnyModalOpen,   // 👈 here
  });

  // Storing Valpha
  const saleWinFromState = location.state?.saleWin;

  // Load from localStorage if refresh
  const saleWinFromStorage = localStorage.getItem("saleWinSS")
    ? JSON.parse(localStorage.getItem("saleWinSS"))
    : null;

  // Final object (state first, then storage)
  const saleWin = saleWinFromState || saleWinFromStorage;

  // Extract valpha safely
  const selectedValpha = saleWin?.valpha || "";

  useEffect(() => {
    if (saleWinFromState) {
      localStorage.setItem("saleWinSS", JSON.stringify(saleWinFromState));
    }    
  }, [saleWinFromState]);

  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedItemIndexForPurchase, setSelectedItemIndexForPurchase] = useState(null);
  const handleF3Press = (e, index) => {
    if (e.key === "F3") {
      e.preventDefault();
      setSelectedItemIndexForPurchase(index);
      setShowPurchaseModal(true);
    }
  };

  return (
    <div>
      <ToastContainer />
      {isModalOpen && <SaleSetup onClose={closeModal} />}
      <div style={{ visibility: "hidden", width: 0, height: 0 }}>
        {SelectedInvoiceComponent && (
          <SelectedInvoiceComponent
            formData={formData}
            items={nonEmptyItems2}
            customerDetails={customerDetails}
            shipped={shipped}
            isOpen={open}
            handleClose={handleCloseInvoice}
            componentRef={printRef} // pass the ref
            selectedCopies={selectedCopies}
          />
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "row", marginTop: -30 }}>
        <h1 className="headerSale">
          SALE GST SERVICES{" "}
          <span className="text-black-500 font-semibold text-base sm:text-lg">
            {title}
          </span>
        </h1>
      </div>
      {/* Top Parts */}
      <div className="sale_toppart ">
        <div className="Dated ">
          <InputMask
            mask="99-99-9999"
            placeholder="dd-mm-yyyy"
            value={formData.date}
            readOnly={!isEditMode || isDisabled}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          >
            {(inputProps) => (
              <input
                {...inputProps}
                className="DatePICKER"
                ref={datePickerRef}
                onKeyDown={(e) => {
                  handleEnterKeyPress(datePickerRef, voucherNoRef)(e);
                }}
              />
            )}
          </InputMask>
          <div className="billdivz">
            <TextField
              inputRef={voucherNoRef}
              className="billzNo custom-bordered-input"
              id="vbillno"
              value={formData.vbillno}
              variant="filled"
              size="small"
              label="BILL NO"
              onKeyDown={handleKeyDownTab} // Handle Tab key here
              inputProps={{
                maxLength: 48,
                style: {
                  height: "20px",
                  fontSize: `${fontSize}px`,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
            />
          </div>
          <div className="Setup">
            <button
              className="Button"
              style={{
                backgroundColor: "blue",
                color: "white",
                fontWeight: "bold",
              }}
              onClick={openModal}
            >
              SETUP
            </button>
            {/* Settings Button */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="Setting text-xl text-blue-700"
              style={{
                cursor: "pointer",
                border: "none",
                background: "transparent",
                padding: 6,
                borderRadius: 10,
              }}
              title="Settings"
            >
              <FaCog />
            </button>
            {/* Fullscreen Overlay Drawer */}
            <Modal
              show={settingsOpen}
              onHide={() => setSettingsOpen(false)}
              centered
              size="lg"
              backdrop="static"
              keyboard={true}
              dialogClassName="p-0"
              style={{ maxHeight: "100vh", overflowY: "hidden", marginTop:-10 }}
            >
              {/* Premium Header */}
              <div
                style={{
                  padding: "14px 18px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid rgba(0,0,0,0.08)",
                  background:
                    "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(99,102,241,0.10), rgba(255,255,255,0.85))",
                }}
              >
                <div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#111827" }}>
                    Options
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                    Customize table fields & theme
                  </div>
                </div>
                <button
                  onClick={() => setSettingsOpen(false)}
                  style={{
                    height: 38,
                    width: 38,
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.08)",
                    background: "rgba(255,255,255,0.8)",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                  }}
                  title="Close"
                >
                  <FaTimes />
                </button>
              </div>
              {/* Body */}
              <Modal.Body style={{ padding: 18, background: "rgba(249,250,251,0.85)" }}>
                {/* Theme Card */}
                <div
                  style={{
                    borderRadius: 16,
                    padding: 14,
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 14px 40px rgba(0,0,0,0.06)",
                    marginBottom: 14,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>
                        COLOR / GRADIENT
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                        Choose header theme
                      </div>
                    </div>
                    <div
                      style={{
                        height: 34,
                        width: 34,
                        borderRadius: 12,
                        background: color,
                        border: "1px solid rgba(255,255,255,0.7)",
                        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.06)",
                      }}
                      title="Preview"
                    />
                  </div>
                  <select
                    value={color}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "10px 12px",
                      borderRadius: 12,
                      border: "1px solid rgba(0,0,0,0.12)",
                      background: "white",
                      fontSize: 13,
                      outline: "none",
                    }}
                  >
                    {gradientOptions.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Fields Card */}
                <div
                  style={{
                    borderRadius: 16,
                    padding: 14,
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 14px 40px rgba(0,0,0,0.06)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: "#111827" }}>
                        SELECT TABLE FIELDS
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                        Toggle column visibility
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "6px 10px",
                        borderRadius: 10,
                        background: "rgba(17,24,39,0.06)",
                        color: "#374151",
                      }}
                    >
                      {Object.values(tableData).filter(Boolean).length}/
                      {Object.keys(tableData).length}
                    </div>
                  </div>
                  <div
                    style={{
                      maxHeight: "52vh",
                      overflowY: "auto",
                      paddingRight: 6,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    {Object.keys(tableData).map((field) => {
                      const checked = tableData[field];
                      return (
                        <div
                          key={field}
                          onClick={() => handleCheckboxChange(field)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 10,
                            padding: "10px 12px",
                            borderRadius: 14,
                            cursor: "pointer",
                            border: checked
                              ? "1px solid rgba(59,130,246,0.35)"
                              : "1px solid rgba(0,0,0,0.10)",
                            background: checked
                              ? "linear-gradient(180deg, rgba(59,130,246,0.10), rgba(255,255,255,0.85))"
                              : "rgba(255,255,255,0.8)",
                            boxShadow: checked
                              ? "0 12px 26px rgba(37,99,235,0.10)"
                              : "0 10px 18px rgba(0,0,0,0.05)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => handleCheckboxChange(field)}
                              onClick={(e) => e.stopPropagation()}
                              style={{ height: 16, width: 16 }}
                            />
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>
                                {field.toUpperCase()}
                              </div>
                              <div style={{ fontSize: 12, color: "#6B7280" }}>
                                Show / hide column
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              fontWeight: 800,
                              padding: "5px 9px",
                              borderRadius: 10,
                              background: checked ? "#2563EB" : "rgba(17,24,39,0.06)",
                              color: checked ? "white" : "#4B5563",
                            }}
                          >
                            {checked ? "ON" : "OFF"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
        <div className="TopFields">
          {customerDetails.map((item, index) => (
            <div key={item.vacode}>
              <div className="CUS">
                <div className="customerdiv">
                  <TextField
                    inputRef={customerNameRef}
                    label="CUSTOMER NAME"
                    variant="filled"
                    size="small"
                    value={item.vacode}
                    className="customerNAME custom-bordered-input"
                    onKeyDown={(e) => {
                      handleEnterKeyPress(customerNameRef, shippedtoRef)(e);
                      handleKeyDown(e, index, "accountname");
                      handleOpenModalBack(e, index, "accountname");
                    }}
                    onDoubleClick={(e) => {
                      handleDoubleClick(e, "accountname", index);
                    }}
                    onFocus={(e) => e.target.select()}
                    inputProps={{
                      maxLength: 48,
                      style: {
                        height: "20px",
                        fontSize: `${fontSize}px`,
                      },
                      readOnly: !isEditMode || isDisabled,
                    }}
                  />
                </div>
                <div className="citydivZ">
                  <TextField
                    //  disabled
                    className="cityName custom-bordered-input"
                    value={item.city}
                    variant="filled"
                    label="CITY"
                    size="small"
                    inputProps={{
                      maxLength: 48,
                      style: {
                        height: "20px",
                        fontSize: `${fontSize}px`,
                        // padding: "0 8px",
                      },
                      readOnly: !isEditMode || isDisabled,
                    }}
                    onChange={(e) =>
                      handleItemChangeCus(index, "city", e.target.value)
                    }
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
              <div className="GST">
                <div>
                  <TextField
                    //  disabled
                    className="gstnoZ custom-bordered-input"
                    value={item.gstno}
                    variant="filled"
                    size="small"
                    label="GST NO"
                    inputProps={{
                      maxLength: 48,
                      style: {
                        height: "20px",
                        fontSize: `${fontSize}px`,
                        // padding: "0 8px",
                      },
                      readOnly: !isEditMode || isDisabled,
                    }}
                    onChange={(e) =>
                      handleItemChangeCus(index, "gstNumber", e.target.value)
                    }
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <div className="pandivZ">
                  <TextField
                    //  disabled
                    className="PANNoZ custom-bordered-input"
                    value={item.pan}
                    variant="filled"
                    size="small"
                    label="PAN NO"
                    inputProps={{
                      maxLength: 48,
                      style: {
                        height: "20px",
                        fontSize: `${fontSize}px`,
                        // padding: "0 8px",
                      },
                      readOnly: !isEditMode || isDisabled,
                    }}
                    onChange={(e) =>
                      handleItemChangeCus(index, "PanNo", e.target.value)
                    }
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
            </div>
          ))}
          {showModalCus && (
            <ProductModalCustomer
              allFields={allFieldsCus}
              onSelect={handleProductSelectCus}
              onClose={handleCloseModalCus}
              initialKey={pressedKey}
              tenant={tenant}
            />
          )}
          <div className="shippedTO">
            {shipped.map((item, index) => (
              <div key={item.shippedto}>
                <div>
                  <TextField
                    multiline
                    inputRef={shippedtoRef}
                    className="shippedtoz custom-bordered-input"
                    id="shippedto"
                    variant="filled"
                    label="SHIPPED TO"
                    size="small"
                    value={`${item.shippedto || ""}\n${item.shippingGst || ""}\n${item.shippingcity || ""}`}
                    InputProps={{
                      readOnly: !isEditMode || isDisabled,
                      style: {
                        height: 100,
                        fontSize: 14,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                    inputProps={{
                      maxLength: 150,
                      fontSize: 14,
                    }}
                    onKeyDown={(e) => {
                      handleOpenModal(e, index, "shippedto");
                      handleKeyDowndown(e, grNoRef);
                      handleOpenModalBack(e, index, "shippedto");
                    }}
                    onDoubleClick={(e) => {
                      handleDoubleClick(e, "shippedto", index);
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
            ))}
            {showModalAcc && (
              <ProductModalCustomer
                allFields={allFieldsAcc}
                onSelect={handleProductSelectAcc}
                onClose={() => setShowModalAcc(false)}
                initialKey={pressedKey}
                tenant={tenant}
                onRefresh={fetchCustomers}
              />
            )}
          </div>
          <div className="GRNo">
            <TextField
              inputRef={grNoRef}
              className="GRNOZ custom-bordered-input"
              id="gr"
              label="GR NO"
              value={formData.gr}
              variant="filled"
              size="small"
              onChange={handleNumericValue}
              onKeyDown={handleEnterKeyPress(grNoRef, termsRef)}
              onFocus={(e) => e.target.select()}
              inputProps={{
                maxLength: 12,
                style: {
                  height: "20px",
                  fontSize: `${fontSize}px`,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
            />
            <div className="ExFor">
              <TextField
                inputRef={termsRef}
                className="custom-bordered-input"
                id="exfor"
                value={formData.exfor}
                variant="filled"
                label="TERMS"
                size="small"
                onChange={HandleValueChange}
                onKeyDown={handleEnterKeyPress(termsRef, vehicleNoRef)}
                onFocus={(e) => e.target.select()}
                inputProps={{
                  maxLength: 10,
                  style: {
                    height: "20px",
                    fontSize: `${fontSize}px`,
                    // padding: "0 8px"
                  },
                  readOnly: !isEditMode || isDisabled,
                }}
                // sx={{ width: 128}}
              />
            </div>
          </div>
          <div className="VehicleDiv">
            <TextField
              inputRef={vehicleNoRef}
              className="VEHICLE custom-bordered-input"
              id="trpt"
              value={formData.trpt}
              variant="filled"
              label="VEHICLE NO."
              size="small"
              onChange={handleCapitalAlpha}
              onKeyDown={handleEnterKeyPress(vehicleNoRef, billcashRef)}
              onFocus={(e) => e.target.select()}
              inputProps={{
                maxLength: 48,
                style: {
                  height: "20px",
                  fontSize: `${fontSize}px`,
                },
                readOnly: !isEditMode || isDisabled,
              }}
            />
            <div className="BillType">
              <FormControl
                className=" Billss custom-bordered-input"
                sx={{
                  fontSize: `${fontSize}px`,
                  "& .MuiFilledInput-root": {
                    height: 48, // adjust as needed (default ~56px for filled)
                  },
                }}
                size="small"
                variant="filled"
                // disabled={!isEditMode || isDisabled}
              >
                <InputLabel id="billcash-label">BILL TYPE</InputLabel>
                <Select
                inputRef={billcashRef}
                  className="custom-bordered-input"
                  labelId="billcash-label"
                  id="billcash"
                  value={formData.btype}
                  onChange={(e) => {
                    if (!isEditMode || isDisabled) return; // prevent changing
                    handleBillCash(e);
                  }}
                  onOpen={(e) => {
                    if (!isEditMode || isDisabled) {
                      e.preventDefault(); // prevent dropdown opening
                    }
                  }}
                  onKeyDownCapture={(e) => {
                    if (e.key === "Enter") {
                      const menuOpen = document.querySelector(".MuiMenu-paper");

                      // ✅ CLOSED → move next (block opening)
                      if (!menuOpen) {
                        e.preventDefault();
                        e.stopPropagation();

                        handleEnterKeyPress(billcashRef, taxTypreRef)(e);
                      }
                      // ✅ OPEN → let MUI handle selection
                    }

                    // ArrowDown → let MUI open normally
                    if (e.key === "ArrowDown") return;
                  }}
                  label="BILL TYPE"
                  displayEmpty
                  inputProps={{
                    sx: {
                      fontSize: `${fontSize}px`,
                      pointerEvents:
                        !isEditMode || isDisabled ? "none" : "auto", // stop mouse clicks
                    },
                  }}
                  MenuProps={{ disablePortal: true }}
                >
                  <MenuItem value="">
                    <em></em>
                  </MenuItem>
                  <MenuItem value="Bill">Bill</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="TAXDiv">
            <div>
              <FormControl
                fullWidth
                size="small"
                variant="filled"
                // disabled={!isEditMode || isDisabled}
                className="TAXtypez custom-bordered-input"
                sx={{
                  fontSize: `${fontSize}px`,
                  "& .MuiFilledInput-root": {
                    height: 48, // adjust as needed (default ~56px for filled)
                  },
                }}
              >
                <InputLabel id="taxtype-label">TAX TYPE</InputLabel>
                <Select
                inputRef={taxTypreRef}
                  className="TAXtypez"
                  labelId="taxtype-label"
                  id="stype"
                  value={formData.stype}
                  onChange={(e) => {
                    if (!isEditMode || isDisabled) return; // prevent changing
                    handleTaxType(e);
                  }}
                  onOpen={(e) => {
                    if (!isEditMode || isDisabled) {
                      e.preventDefault(); // prevent dropdown opening
                    }
                  }}
                  onKeyDownCapture={(e) => {
                    if (e.key === "Enter") {
                      const menuOpen = document.querySelector(".MuiMenu-paper");

                      // ✅ CLOSED → move next (block opening)
                      if (!menuOpen) {
                        e.preventDefault();
                        e.stopPropagation();

                        handleEnterKeyPress(taxTypreRef, supplyRef)(e);
                      }
                      // ✅ OPEN → let MUI handle selection
                    }

                    // ArrowDown → let MUI open normally
                    if (e.key === "ArrowDown") return;
                  }}
                  label="TAX TYPE"
                  displayEmpty
                  MenuProps={{
                    disablePortal: true,
                  }}
                  inputProps={{
                    sx: {
                      fontSize: `${fontSize}px`,
                      pointerEvents:
                        !isEditMode || isDisabled ? "none" : "auto", // stop mouse clicks
                    },
                  }}
                >
                  <MenuItem value="">
                    <em></em>
                  </MenuItem>
                  <MenuItem value="GST Sale (RD)">GST Sale (RD)</MenuItem>
                  <MenuItem value="IGST Sale (RD)">IGST Sale (RD)</MenuItem>
                  <MenuItem value="GST (URD)">GST (URD)</MenuItem>
                  <MenuItem value="IGST (URD)">IGST (URD)</MenuItem>
                  <MenuItem value="Tax Free Within State">
                    Tax Free Within State
                  </MenuItem>
                  <MenuItem value="Tax Free Interstate">
                    Tax Free Interstate
                  </MenuItem>
                  <MenuItem value="Export Sale">Export Sale</MenuItem>
                  <MenuItem value="Export Sale(IGST)">
                    Export Sale(IGST)
                  </MenuItem>
                  <MenuItem value="Including GST">Including GST</MenuItem>
                  <MenuItem value="Including IGST">Including IGST</MenuItem>
                  <MenuItem value="Not Applicable">Not Applicable</MenuItem>
                  <MenuItem value="Exempted Sale">Exempted Sale</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div style={{ marginTop: 3 }}>
              <FormControl
                className="SupplyTYPE custom-bordered-input"
                sx={{
                  // width: '250px',
                  fontSize: `${fontSize}px`,
                  "& .MuiFilledInput-root": {
                    height: 48, // adjust as needed (default ~56px for filled)
                  },
                }}
                size="small"
                // disabled={!isEditMode || isDisabled}
                variant="filled"
              >
                <InputLabel id="supply-label">SUPPLY TYPE</InputLabel>
                <Select
                inputRef={supplyRef}
                  className="SupplyTYPE"
                  labelId="supply-label"
                  id="supply"
                  value={formData.conv}
                  onChange={(e) => {
                    if (!isEditMode || isDisabled) return; // prevent changing
                    handleSupply(e);
                  }}
                  onOpen={(e) => {
                    if (!isEditMode || isDisabled) {
                      e.preventDefault(); // prevent dropdown opening
                    }
                  }}
                  onKeyDownCapture={(e) => {
                    if (e.key === "Enter") {
                      const menuOpen = document.querySelector(".MuiMenu-paper");

                      // ✅ CLOSED → move next (block opening)
                      if (!menuOpen) {
                        e.preventDefault();
                        e.stopPropagation();

                        handleEnterKeyPress(supplyRef, null)(e);
                      }
                      // ✅ OPEN → let MUI handle selection
                    }

                    // ArrowDown → let MUI open normally
                    if (e.key === "ArrowDown") return;
                  }}
                  label="SUPPLY TYPE"
                  displayEmpty
                  inputProps={{
                    sx: {
                      fontSize: `${fontSize}px`,
                      pointerEvents:
                        !isEditMode || isDisabled ? "none" : "auto", // stop mouse clicks
                    },
                  }}
                  MenuProps={{ disablePortal: true }}
                >
                  <MenuItem value="">
                    <em></em>
                  </MenuItem>
                  <MenuItem value="Manufacturing Sale">
                    1. Manufacturing Sale
                  </MenuItem>
                  <MenuItem value="Trading Sale">2. Trading Sale</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
        </div>
      </div>
      {/* Table Part */}
      <div
        ref={tableContainerRef}
        style={{ marginTop: 5 }}
        className="TableContainer"
      >
        <Table ref={tableRef} className="custom-table">
          <thead
            style={{
              background: color,
              textAlign: "center",
              position: "sticky",
              top: 0,
            }}
          >
            <tr style={{ color: "#575a5a" }}>
              {tableData.itemcode && <th>LEDGER A/C</th>}
              {tableData.sdisc && <th>DESCRIPTION</th>}
              {tableData.hsncode && <th>HSNCODE</th>}
              {tableData.pcs && <th>PCS</th>}
              {tableData.qty && <th>QTY</th>}
              {tableData.rate && <th>RATE</th>}
              {tableData.amount && <th>AMOUNT</th>}
              {tableData.discount && <th>DIS@</th>}
              {tableData.discount && <th>DISCOUNT</th>}
              {tableData.others && <th>OTHERS</th>}
              {tableData.gst && <th>GST</th>}
              {tableData.cgst && <th>CGST</th>}
              {tableData.sgst && <th>SGST</th>}
              {tableData.igst && <th>IGST</th>}
              {isEditMode && <th className="text-center">DELETE</th>}
            </tr>
          </thead>
          <tbody style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}>
            {items.map((item, index) => (
              <tr key={item.id}>
                {tableData.itemcode && (
                  <td style={{ padding: 0, width: 300 }}>
                    <input
                      disabled={!canEditRow(index)}
                      className="ItemCode"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                      }}
                      type="text"
                      value={item.vacode}
                      readOnly
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "vacode");
                        handleOpenModal(e, index, "vacode");
                        handleOpenModalBack(e, index, "vacode");
                        handleF3Press(e, index)
                      }}
                      onDoubleClick={(e) => {
                        handleDoubleClick(e, "vacode", index);
                      }}
                      ref={(el) => (itemCodeRefs.current[index] = el)}
                      onFocus={(e) => e.target.select()} // Select text on focus
                    />
                  </td>
                )}
                {tableData.sdisc && (
                  <td style={{ padding: 0, width: 250 }}>
                    <input
                      disabled={!canEditRow(index)}
                      className="desc"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                      }}
                      maxLength={48}
                      value={item.sdisc}
                      readOnly={!isEditMode || isDisabled}
                      onChange={(e) =>
                        handleItemChange(index, "sdisc", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "sdisc");
                      }}
                      ref={(el) => (desciptionRefs.current[index] = el)}
                      onFocus={(e) => e.target.select()} // Select text on focus
                    />
                  </td>
                )}
                {tableData.hsncode && (
                  <td style={{ padding: 0 }}>
                    <input
                      disabled={!canEditRow(index)}
                      className="Hsn"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      maxLength={8}
                      readOnly={!isEditMode || isDisabled}
                      value={item.tariff}
                      onChange={(e) =>
                        handleItemChange(index, "tariff", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "tariff");
                      }}
                      ref={(el) => (hsnCodeRefs.current[index] = el)}
                      onFocus={(e) => e.target.select()} // Select text on focus
                    />
                  </td>
                )}
                {tableData.pcs && (
                  <td style={{ padding: 0 }}>
                    <input
                      disabled={!canEditRow(index)}
                      className="PCS"
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                        fontSize: `${fontSize}px`,
                      }}
                      maxLength={48}
                      readOnly={!isEditMode || isDisabled}
                      value={Number(item.pkgs) === 0 ? "" : item.pkgs}
                      onChange={(e) =>
                        handleItemChange(index, "pkgs", e.target.value)
                      }
                      onBlur={() => handlePkgsBlur(index)} // Format value on blur
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "pkgs");
                      }}
                      ref={(el) => (peciesRefs.current[index] = el)}
                      onFocus={(e) => e.target.select()} // Select text on focus
                    />
                  </td>
                )}
                {tableData.qty && (
                  <td style={{ padding: 0 }}>
                    <input
                      disabled={!canEditRow(index)}
                      className="QTY"
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                        fontSize: `${fontSize}px`,
                      }}
                      maxLength={48}
                      readOnly={!isEditMode || isDisabled}
                      value={Number(item.weight) === 0 ? "" : item.weight}
                      onChange={(e) =>
                        handleItemChange(index, "weight", e.target.value)
                      }
                      onBlur={() => handleWeightBlur(index)} // Format value on blur
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "weight");
                      }}
                      ref={(el) => (quantityRefs.current[index] = el)}
                      onFocus={(e) => e.target.select()} // Select text on focus
                    />
                  </td>
                )}
                {tableData.rate && (
                  <td style={{ padding: 0 }}>
                    <input
                      disabled={!canEditRow(index)}
                      className="Price"
                      style={{
                        height: 40,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                        fontSize: `${fontSize}px`,
                      }}
                      maxLength={48}
                      readOnly={!isEditMode || isDisabled}
                      value={Number(item.rate) === 0 ? "" : item.rate}
                      onChange={(e) =>
                        handleItemChange(index, "rate", e.target.value)
                      }
                      onBlur={() => handleRateBlur(index)} // Format value on blur
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "rate");
                      }}
                      ref={(el) => (priceRefs.current[index] = el)}
                      onFocus={(e) => e.target.select()} // Select text on focus
                    />
                  </td>
                )}
                {tableData.amount && (
                  <td style={{ padding: 0 }}>
                    <input
                      disabled={!canEditRow(index)}
                      className="Amount"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      maxLength={48}
                      readOnly={!isEditMode || isDisabled}
                      value={Number(item.amount) === 0 ? "" : item.amount}
                      onBlur={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value)) {
                          handleItemChange(
                            index,
                            "amount",
                            value.toFixed(rateValue),
                          );
                        }
                      }}
                      onChange={(e) =>
                        handleItemChange(index, "amount", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "amount");
                      }}
                      ref={(el) => (amountRefs.current[index] = el)}
                      onFocus={(e) => e.target.select()} // Select text on focus
                      min="0"
                    />
                  </td>
                )}
                {tableData.discount && (
                  <td style={{ padding: 0 }}>
                    <input
                      disabled={!canEditRow(index)}
                      className="Disc"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      value={Number(item.disc) === 0 ? "" : item.disc}
                      onChange={(e) =>
                        handleItemChange(index, "disc", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "disc");
                      }}
                      onBlur={() => handleBlur(index, "disc")}
                      ref={(el) => (discountRef.current[index] = el)}
                      onFocus={(e) => e.target.select()} // Select text on focus
                      readOnly={!isEditMode || isDisabled}
                    />
                  </td>
                )}
                {tableData.discount && (
                  <td style={{ padding: 0 }}>
                    <input
                      disabled={!canEditRow(index)}
                      id="discount"
                      className="discount"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      value={Number(item.discount) === 0 ? "" : item.discount}
                      onChange={(e) =>
                        handleItemChange(index, "discount", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "discount");
                      }}
                      onFocus={(e) => e.target.select()} // Select text on focus
                      ref={(el) => (discount2Ref.current[index] = el)}
                      onBlur={() => handleBlur(index, "discount")}
                      readOnly={!isEditMode || isDisabled}
                    />
                  </td>
                )}
                {tableData.others && (
                  <td style={{ padding: 0 }}>
                    <input
                      disabled={!canEditRow(index)}
                      className="Others"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      maxLength={48}
                      type="text"
                      value={
                        Number(item.exp_before) === 0 ? "" : item.exp_before
                      }
                      readOnly={!isEditMode || isDisabled}
                      onDoubleClick={(e) =>
                        handleDoubleClick(e, "exp_before", index)
                      }
                      // onChange={(e) => handleItemChange(index, "exp_before", e.target.value)}
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "exp_before");
                        handleKeyDownExp(e, "exp_before", index);
                      }}
                      onFocus={(e) => {
                        e.target.select(); // Select the entire text when the field is focused
                        if (WindowBefore) {
                          setCurrentIndex(index);
                          setIsModalOpenExp(true);
                        }
                      }}
                      ref={(el) => (othersRefs.current[index] = el)}
                    />
                  </td>
                )}
                {isModalOpenExp && currentIndex !== null && (
                  <div className="Modalz">
                    <div className="Modal-content">
                      <h1 className="headingE">ADD/LESS BEFORE GST</h1>
                      <div className="form-group">
                        <input
                          type="checkbox"
                          id="gross"
                          checked={items[currentIndex]?.gross || false}
                          onChange={(e) =>
                            handleInputChange(
                              currentIndex,
                              "gross",
                              e.target.checked,
                            )
                          }
                        />
                        <label
                          style={{ marginLeft: 5 }}
                          className="label"
                          htmlFor="Gross"
                        >
                          GROSS
                        </label>
                      </div>
                      {[
                        { label: Expense1, rate: "Exp_rate1", value: "Exp1" },
                        { label: Expense2, rate: "Exp_rate2", value: "Exp2" },
                        { label: Expense3, rate: "Exp_rate3", value: "Exp3" },
                        { label: Expense4, rate: "Exp_rate4", value: "Exp4" },
                        { label: Expense5, rate: "Exp_rate5", value: "Exp5" },
                        ].map((field, idx) => {
                          const rateIndex = idx * 2;
                          const valueIndex = idx * 2 + 1;

                          return (
                            <div key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", marginBottom: "10px" }}>
                              
                              <label style={{ width: "100px", fontWeight: "bold" }}>
                                {field.label}
                              </label>

                              {/* RATE FIELD */}
                              <input
                                ref={(el) => (expRateRefs.current[rateIndex] = el)}
                                value={items[currentIndex][field.rate]}
                                style={{
                                  border: "1px solid black",
                                  padding: "5px",
                                  width: "120px",
                                  textAlign: "right",
                                  borderRadius: "4px",
                                }}
                                onChange={(e) =>
                                  handleInputChange(currentIndex, field.rate, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDownModal(e, rateIndex)}
                              />

                              {/* VALUE FIELD */}
                              <input
                                ref={(el) => (expRateRefs.current[valueIndex] = el)}
                                value={items[currentIndex][field.value]}
                                style={{
                                  border: "1px solid black",
                                  padding: "5px",
                                  width: "120px",
                                  textAlign: "right",
                                  borderRadius: "4px",
                                }}
                                onBlur={() =>
                                  handleExpenseBlur(currentIndex, field.value)
                                }
                                onChange={(e) =>
                                  handleInputChange(currentIndex, field.value, e.target.value)
                                }
                                onKeyDown={(e) => handleKeyDownModal(e, valueIndex)}
                              />
                            </div>
                          );
                      })}
                      <Button
                        ref={closeButtonRef}
                        onClick={() => {
                          const idx = currentIndex; // store before reset

                          setIsModalOpenExp(false);
                          setCurrentIndex(null);

                          // restore focus to Others field
                          setTimeout(() => {
                            othersRefs.current[idx]?.focus();
                            othersRefs.current[idx]?.select();
                          }, 0);
                        }}
                        style={{
                          borderColor: "transparent",
                          backgroundColor: "red",
                          marginTop: 10,
                        }}
                      >
                        CLOSE
                      </Button>
                    </div>
                  </div>
                )}
                {tableData.gst && (
                  <td style={{ padding: 0 }}>
                   <input
                      disabled={!canEditRow(index)}
                      className="Others"
                      id="gst"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "center",
                      }}
                      maxLength={2}
                      ref={(el) => (gstRef.current[index] = el)}
                      value={Number(item.gst) === 0 ? "" : item.gst}
                      onChange={(e) =>
                        handleItemChange(index, "gst", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "gst");
                      }}
                      readOnly={!isEditMode || isDisabled}
                    />

                  </td>
                )}
                {tableData.cgst && (
                  <td style={{ padding: 0 }}>
                    <input
                      className="CTax"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                        color: "black",
                      }}
                      maxLength={48}
                      disabled
                      value={Number(item.ctax) === 0 ? "" : item.ctax}
                      onChange={(e) =>
                        handleItemChange(index, "ctax", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "ctax");
                      }}
                      ref={(el) => (cgstRefs.current[index] = el)}
                      onFocus={(e) => e.target.select()} // Select text on focus
                    />
                  </td>
                )}
                {tableData.sgst && (
                  <td style={{ padding: 0 }}>
                    <input
                      className="STax"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                        color: "black",
                      }}
                      maxLength={48}
                      disabled
                      value={Number(item.stax) === 0 ? "" : item.stax}
                      onChange={(e) =>
                        handleItemChange(index, "stax", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "stax");
                      }}
                      ref={(el) => (sgstRefs.current[index] = el)}
                      onFocus={(e) => e.target.select()} // Select text on focus
                      min="0"
                    />
                  </td>
                )}
                {tableData.igst && (
                  <td style={{ padding: 0 }}>
                    <input
                      className="ITax"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                        color: "black",
                      }}
                      maxLength={48}
                      disabled
                      value={Number(item.itax) === 0 ? "" : item.itax}
                      onChange={(e) =>
                        handleItemChange(index, "itax", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "itax");
                      }}
                      ref={(el) => (igstRefs.current[index] = el)}
                      onFocus={(e) => e.target.select()} // Select text on focus
                      min="0"
                    />
                  </td>
                )}
                {isEditMode && (
                  <td style={{ padding: 0 }}>
                    {canEditRow(index) && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <IconButton color="error" size="small" tabIndex={-1} onClick={() => handleDeleteItem(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot
            style={{
              background: color,
              position: "sticky",
              bottom: -6,
              fontSize: `${fontSize}px`,
              borderTop: "1px solid black",
            }}
          >
            <tr style={{ fontWeight: "bold", textAlign: "right" }}>
              {tableData.itemcode && <td></td>}
              {tableData.sdisc && <td>TOTAL</td>}
              {tableData.hsncode && <td></td>}
              {tableData.pcs && (
                <td>
                  {items
                    .reduce((sum, item) => sum + parseFloat(item.pkgs || 0), 0)
                    .toFixed(pkgsValue)}
                </td>
              )}
              {tableData.qty && (
                <td>
                  {items
                    .reduce(
                      (sum, item) => sum + parseFloat(item.weight || 0),
                      0,
                    )
                    .toFixed(weightValue)}
                </td>
              )}
              {tableData.rate && <td></td>}
              {tableData.amount && (
                <td>
                  {items
                    .reduce(
                      (sum, item) => sum + parseFloat(item.amount || 0),
                      0,
                    )
                    .toFixed(2)}
                </td>
              )}
              {tableData.discount && (
                <>
                  <td>
                    {items
                      .reduce(
                        (sum, item) => sum + parseFloat(item.disc || 0),
                        0,
                      )
                      .toFixed(2)}
                  </td>
                  <td>
                    {items
                      .reduce(
                        (sum, item) => sum + parseFloat(item.discount || 0),
                        0,
                      )
                      .toFixed(2)}
                  </td>
                </>
              )}
              {tableData.gst && <td></td>}
              {tableData.others && (
                <td>
                  {items
                    .reduce(
                      (sum, item) => sum + parseFloat(item.exp_before || 0),
                      0,
                    )
                    .toFixed(2)}
                </td>
              )}
              {tableData.cgst && (
                <td>
                  {items
                    .reduce((sum, item) => sum + parseFloat(item.ctax || 0), 0)
                    .toFixed(2)}
                </td>
              )}
              {tableData.sgst && (
                <td>
                  {items
                    .reduce((sum, item) => sum + parseFloat(item.stax || 0), 0)
                    .toFixed(2)}
                </td>
              )}
              {tableData.igst && (
                <td>
                  {items
                    .reduce((sum, item) => sum + parseFloat(item.itax || 0), 0)
                    .toFixed(2)}
                </td>
              )}
              {isEditMode && <td></td>}
            </tr>
          </tfoot>
        </Table>
      </div>
      {showModal && (
        <ProductModalCustomer
          allFields={allFields}
          onSelect={handleProductSelect}
          onClose={handleModalDone}
          initialKey={pressedKey}
          tenant={tenant}
          onRefresh={fetchCustomers}
        />
      )}

      <div className="addbutton" style={{ marginTop: 2, marginBottom: 5 }}>
        <Button className="fw-bold btn-secondary" onClick={handleAddItem}>
          Add Row
        </Button>
      </div>
      {/* Bottom Part */}
      <div className="Belowcontents">
        <div
          className="Parent"
          style={{ display: "flex", flexDirection: "row" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <TextField
              className="Remz custom-bordered-input"
              id="rem2"
              value={formData.rem2}
              inputRef={remarksRef}
              label="REMARKS"
              onChange={HandleValueChange}
              onKeyDown={(e) => {
                handleKeyDowndown(e, transportRef);
              }}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 20,
                  fontSize: `${fontSize}px`,
                },
              }}
              onFocus={(e) => e.target.select()}
              size="small"
              variant="filled"
              // sx={{ width: 280 }}
            />
            <TextField
              className="Remz custom-bordered-input"
              id="v_tpt"
              value={formData.v_tpt}
              inputRef={transportRef}
              label="TRANSPORT"
              onChange={HandleValueChange}
              onKeyDown={(e) => {
                handleKeyDowndown(e, brokerRef);
                handleOpenModalTpt(e, "v_tpt", "v_tpt");
              }}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 20,
                  fontSize: `${fontSize}px`,
                },
              }}
              onFocus={(e) => e.target.select()}
              size="small"
              variant="filled"
              // sx={{ width: 280 }}
            />
            <TextField
              className="Remz custom-bordered-input"
              id="broker"
              value={formData.broker}
              inputRef={brokerRef}
              label="BROKER"
              onChange={HandleValueChange}
              onKeyDown={(e) => {
                handleKeyDowndown(e, expAfterGSTRef);
                handleOpenModalBroker(e, "broker", "broker");
              }}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 20,
                  fontSize: `${fontSize}px`,
                },
              }}
              onFocus={(e) => e.target.select()}
              size="small"
              variant="filled"
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", marginLeft: 5 }}
          >
            <div className="duedatez">
              <InputMask
                mask="99-99-9999"
                placeholder="dd-mm-yyyy"
                value={formData.duedate}
                readOnly={!isEditMode || isDisabled}
                onChange={(e) =>
                  setFormData({ ...formData, duedate: e.target.value })
                }
              >
                {(props) => (
                  <TextField
                    className="custom-bordered-input"
                    {...props}
                    label="DUE DATE"
                    size="small"
                    variant="filled"
                    fullWidth
                    style={{ width: 225 }}
                  />
                )}
              </InputMask>
            </div>
            <div>
              <TextField
                className="custom-bordered-input"
                id="srv_tax"
                value={formData.srv_tax}
                // disabled
                label="TDS 194-Q"
                onChange={handleNumericValue}
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                    color: "red",
                  },
                }}
                onFocus={(e) => e.target.select()}
                size="small"
                variant="filled"
                sx={{ width: 225 }}
              />
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextField
                className="TCSRATE custom-bordered-input"
                inputRef={tcsRef2}
                id="tcs1_rate"
                value={formData.tcs1_rate}
                onKeyDown={(e) => handleKeyDowndown(e, expAfterGSTRef)}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    tcs1_rate: e.target.value,
                  }))
                }
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                    color: "red",
                  },
                }}
                onFocus={(e) => e.target.select()}
                size="small"
                variant="filled"
                InputProps={{ readOnly: !isEditMode || isDisabled }}
              />

              <TextField
                className="TCSPER custom-bordered-input"
                id="tcs1"
                value={formData.tcs1}
                label="TCS 206C@"
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                    color: "red",
                  },
                }}
                onFocus={(e) => e.target.select()}
                size="small"
                variant="filled"
                // sx={{ width: 120 }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: 5,
              marginTop: "auto",
            }}
          >
            {formData.Tds2 && Number(formData.Tds2) > 0 && (
              <TextField
                className="custom-bordered-input"
                id="tax"
                value={"2%"}
                label="GST. TDS"
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                  },
                }}
                onFocus={(e) => e.target.select()}
                size="small"
                variant="filled"
                sx={{ width: 120 }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "row" }}>
              <TextField
                className="CTDS custom-bordered-input"
                value={formData.Ctds}
                label="C.TDS"
                size="small"
                variant="filled"
                inputProps={{
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                    backgroundColor: "white",
                    borderRadius: 5,
                  },
                }}
                sx={{
                  // width: 150,
                  "& .MuiOutlinedInput-root": {
                    border: "1px solid black",
                    borderRadius: 1,
                  },
                }}
              />
              <TextField
                className="CTDS custom-bordered-input"
                value={formData.Stds}
                label="S.TDS"
                size="small"
                variant="filled"
                inputProps={{
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                    backgroundColor: "white",
                    borderRadius: 5,
                  },
                }}
                sx={{
                  // width: 150,
                  "& .MuiOutlinedInput-root": {
                    border: "1px solid black",
                    borderRadius: 1,
                  },
                }}
              />
              <TextField
                className="CTDS custom-bordered-input"
                value={formData.iTds}
                label="I.TDS"
                size="small"
                variant="filled"
                inputProps={{
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                    backgroundColor: "white",
                    borderRadius: 5,
                  },
                }}
                sx={{
                  // width: 150,
                  "& .MuiOutlinedInput-root": {
                    border: "1px solid black",
                    borderRadius: 1,
                  },
                }}
              />
              <span style={{ fontSize: 20, marginTop: "10px" }}>=</span>
              <TextField
                className="CTDS custom-bordered-input"
                value={formData.Tds2}
                label="TOTAL"
                size="small"
                variant="filled"
                inputProps={{
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                    backgroundColor: "white",
                    borderRadius: 5,
                  },
                }}
                sx={{
                  // width: 150,
                  "& .MuiOutlinedInput-root": {
                    border: "1px solid black",
                    borderRadius: 1,
                  },
                }}
              />
            </div>
          </div>
          <div
            className="totals"
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "auto",
              marginRight: "12px",
            }}
          >
            <TextField
              className="TOTALFIELDS custom-bordered-input"
              id="tax"
              value={formData.tax}
              label="TOTAL GST"
              inputProps={{
                maxLength: 48,
                style: {
                  height: 20,
                  fontSize: `${fontSize}px`,
                },
              }}
              onFocus={(e) => e.target.select()}
              size="small"
              variant="filled"
              // sx={{ width: 150 }}
            />
            <div>
              <TextField
                className="TOTALFIELDS custom-bordered-input"
                inputRef={expAfterGSTRef}
                id="expafterGST"
                value={formData.expafterGST}
                label="EXP AFTER GST"
                onKeyDown={(e) => {
                  handleKeyDowndown(e, saveButtonRef);
                  handleKeyDownAfter(e);
                }}
                onFocus={(e) => {
                  e.target.select();
                  if (WindowAfter) {
                    setIsModalOpenAfter(true);
                  }
                }}
                onDoubleClick={() => handleDoubleClickAfter("expafterGST")}
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                  },
                  readOnly: !isEditMode || isDisabled,
                }}
                size="small"
                variant="filled"
                // sx={{ width: 150 }}
              />
              {isModalOpenAfter && (
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                  }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(to bottom, #edc5a7,#a5d8ed)',
                      padding: "25px 30px",
                      borderRadius: "12px",
                      width: "450px",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                      animation: "fadeIn 0.3s ease-in-out",
                    }}
                  >
                    <h2
                      style={{
                        textAlign: "center",
                        marginBottom: "20px",
                        fontWeight: "600",
                        color: "#333",
                        fontSize:"18px",
                      }}
                    >
                      EXPENSE AFTER TAX
                    </h2>

                    {/* Expense Rows */}
                    {[
                    { label: Expense6, rate: "Exp_rate6", amount: "Exp6" },
                    { label: Expense7, rate: "Exp_rate7", amount: "Exp7" },
                    { label: Expense8, rate: "Exp_rate8", amount: "Exp8" },
                    { label: Expense9, rate: "Exp_rate9", amount: "Exp9" },
                    { label: Expense10, rate: "Exp_rate10", amount: "Exp10" },
                  ].map((item, index) => {
                    const rateIndex = index * 2;
                    const amountIndex = index * 2 + 1;

                    return (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "12px",
                        }}
                      >
                        <div
                          style={{
                            flex: 1,
                            fontWeight: "bold",
                            color: "#444",
                          }}
                        >
                          {item.label}
                        </div>

                        {/* RATE */}
                        <input
                          ref={(el) => (expAfterRefs.current[rateIndex] = el)}
                          id={item.rate}
                          value={formData[item.rate]}
                          onChange={handleNumberChange}
                          onKeyDown={(e) => handleKeyDownAfterw2(e, rateIndex)}
                          placeholder="Rate"
                          style={{
                            width: "90px",
                            padding: "6px",
                            borderRadius: "6px",
                            border: "1px solid black",
                            marginRight: "8px",
                            textAlign: "right",
                          }}
                        />

                        {/* AMOUNT */}
                        <input
                          ref={(el) => (expAfterRefs.current[amountIndex] = el)}
                          id={item.amount}
                          value={formData[item.amount]}
                          onChange={handleNumberChange}
                          onKeyDown={(e) => handleKeyDownAfterw2(e, amountIndex)}
                          placeholder="Amount"
                          style={{
                            width: "90px",
                            padding: "6px",
                            borderRadius: "6px",
                            border: "1px solid black",
                            textAlign: "right",
                          }}
                        />
                      </div>
                    );
                  })}
                    {/* Close Button */}
                    <div style={{ textAlign: "center", marginTop: "20px" }}>
                      <Button
                        ref={closeAfterRef}
                        onClick={closeModalAfter}
                        style={{
                          backgroundColor: "#ff4d4f",
                          border: "none",
                          padding: "8px 20px",
                          borderRadius: "6px",
                          fontWeight: "500",
                        }}
                      >
                        CLOSE
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <TextField
              id="grandtotal"
              value={formData.grandtotal}
              label="GRAND TOTAL"
              onKeyDown={handleKeyDownTab2} // Handle Tab key here
              inputProps={{
                maxLength: 48,
                style: {
                  height: 20,
                  fontSize: `${fontSize}px`,
                  color: "red",
                  fontWeight: "bold",
                },
              }}
              size="small"
              variant="filled"
              className="TOTALFIELDS custom-bordered-input"
              // sx={{ width: 150 }}
            />
          </div>
        </div>
        <div className="Buttonsgroupz">
          <Button
            ref={addButtonRef}
            className="Buttonz"
            style={{ background: color }}
            onClick={handleAdd}
            disabled={!isAddEnabled}
          >
            Add
          </Button>
          {isFAModalOpen && (
            <FAVoucherModal
              open={isFAModalOpen}
              onClose={() => setIsFAModalOpen(false)}
              tenant={tenant}
              voucherno={formData.vbillno}
              vtype="S"
            />
          )}
          <Button
            className="Buttonz"
            style={{ background: color }}
            onClick={handleEditClick}
            disabled={!isAddEnabled}
          >
            Edit
          </Button>
          <Button
            className="Buttonz"
            style={{ background: color }}
            onClick={handlePrevious}
            disabled={!isPreviousEnabled}
          >
            Previous
          </Button>
          <Button
            className="Buttonz"
            style={{ background: color }}
            onClick={handleNext}
            disabled={!isNextEnabled}
          >
            Next
          </Button>
          <Button
            className="Buttonz"
            style={{ background: color }}
            onClick={handleFirst}
            disabled={!isFirstEnabled}
          >
            First
          </Button>
          <Button
            className="Buttonz"
            style={{ background: color }}
            onClick={handleLast}
            disabled={!isLastEnabled}
          >
            Last
          </Button>
          <Button
            className="Buttonz"
            style={{ background: color }}
            disabled={!isSearchEnabled}
            onClick={() => {
              fetchAllBills();
              setActiveRowIndex(0);
              setShowSearch(true);
            }}
          >
            Search
          </Button>
          <Button
            ref={printButtonRef}
            className="Buttonz"
            // onClick={handleOpen}
            onClick={openPrintMenu}
            // onClick={handleViewFAVoucher}
            style={{ background: color }}
            disabled={!isPrintEnabled}
          >
            Print
          </Button>

          <BillPrintMenu
            isOpen={isMenuOpen}
            onClose={closePrintMenu}
            preview={handleOpen}
            formDataSale={formData}
            handlePrint={handlePrintClick}
            setSelectedCopies={setSelectedCopies}
            onFaView={handleViewFAVoucher}
          />

          <Button
            className="delete"
            style={{ background: color }}
            onClick={handleDeleteClick}
            disabled={!isDeleteEnabled}
          >
            Delete
          </Button>
          <Button
            className="Buttonz"
            style={{ background: color }}
            onClick={handleExit}
          >
            Exit
          </Button>
          <Button
            ref={saveButtonRef}
            className="Buttonz"
            onClick={handleDataSave}
            disabled={!isSubmitEnabled}
            style={{ background: color }}
          >
            Save
          </Button>
        </div>
      </div>
      {/* Search Modal */}
      <Modal
        show={showSearch}
        keyboard={false}
        backdrop="static"
        onHide={() => setShowSearch(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Search</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <TextField
              className="custom-bordered-input"
              size="small"
              variant="filled"
              label="Enter Bill No..."
              value={searchBillNo}
              onChange={(e) => setSearchBillNo(e.target.value)}
            />

            <InputMask
              mask="99-99-9999"
              placeholder="dd-mm-yyyy"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
            >
              {(props) => (
                <TextField
                  className="custom-bordered-input"
                  {...props}
                  label="DATE"
                  size="small"
                  variant="filled"
                  fullWidth
                  style={{ width: 230, marginLeft: 5 }}
                />
              )}
            </InputMask>
          </div>

          <div
            style={{ maxHeight: "300px", overflowY: "auto" }}
            onScroll={(e) => {
              const bottom =
                e.target.scrollHeight - e.target.scrollTop <=
                e.target.clientHeight + 5;

              if (bottom && visibleCount < filteredBills.length) {
                setVisibleCount((prev) => prev + 30);
              }
            }}
          >
            <Table>
              <thead>
                <tr>
                  <th>BILL NO</th>
                  <th>DATE</th>
                  <th>CUSTOMER</th>
                  <th>CITY</th>
                  <th>GRAND TOTAL</th>
                </tr>
              </thead>

              <tbody>
                {filteredBills.slice(0, visibleCount).map((bill, index) => (
                  <tr key={bill._id}
                  style={{
                    backgroundColor: index === activeRowIndex ? "#d1e7ff" : "",
                    cursor: "pointer",
                  }}
                   onClick={() => {
                    setActiveRowIndex(index);
                    handleSelectBill(bill);
                    setShowSearch(false);
                  }}
                  >
                    <td>{bill.formData.vbillno}</td>
                    <td>
                      {formatDateToDDMMYYYY(bill.formData.date)}
                    </td>
                    <td>{bill.customerDetails?.[0]?.vacode}</td>
                    <td>{bill.customerDetails?.[0]?.city}</td>
                    <td>{bill.formData.grandtotal}</td>
                  </tr>
                ))}

                {filteredBills.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      No matching records
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
      <F3Modal
        show={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        tenant={tenant}
        onSelect={(row) => {
          const index = selectedItemIndexForPurchase;
          if (index === null) return;

          // 🔥 Step 1: set base fields via handler
          handleItemChange(index, "sdisc", row.desc || "");
          handleItemChange(index, "pkgs", row.pkgs || 0);
          handleItemChange(index, "weight", row.qty || 0);
          handleItemChange(index, "rate", row.rate || 0);
          handleItemChange(index, "gst", row.gst || 0);

          // 🔥 Step 2: set remaining fields manually (no calc needed)
          setItems((prev) => {
            const updated = [...prev];
            const item = { ...updated[index] };

            item.stk_code = row.vcode || "";
            item.Units = row.Units || "";
            item.tariff = row.tariff || "";
            item.Pcodes01 = row.Pcodes01 || "";
            item.Pcodess = row.Pcodess || "";
            item.Scodes01 = row.Scodes01 || "";
            item.Scodess = row.Scodess || "";
            item.RateCal = row.RateCal || "";
            item.Qtyperpc = row.Qtyperpc || 0;

            updated[index] = item;
            return updated;
          });
        }}
      />
    </div>
  );
};

export default SaleService;