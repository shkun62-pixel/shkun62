// import React, { useState, useEffect, useRef } from "react";
// import "./ExciseSetup.css";
// import { Button, Toast } from "react-bootstrap";
// import { ToastContainer, toast } from "react-toastify";
// import axios from "axios";

// const ExciseSetup = ({ onClose }) => {
//   const [title, setTitle] = useState('(View)');
//   const inputRefs = useRef([]);
//   const [formData, setFormData] = useState({
//     RG23A: 0.0,
//     RG23A1: 0.0,
//     RG23A2: 0.0,
//     RG23A3: 0.0,
//     RG23C: 0.0,
//     RG23C1: 0.0,
//     RG23C2: 0.0,
//     RG23C3: 0.0,
//     ServiceTax:0.00,
//     ServiceTax1:0.00,
//     ServiceTax2:0.00,
//     PLA: 0.0,
//     PLA1: 0.0,
//     PLA2: 0.0,
//     ExciseRate: 0.0,
//     PcessRate: 0.0,
//     HcessRate: 0.0,
//     ModvatSeries: 0.0,
//     TradingExcise: "",
//     StockCalcluationLevel: 0.0,
//     GroupWiseStock: "",
//   });

//   // Function to handle Enter key and shift focus to the next input field
//   const handleKeyDown = (e, index) => {
//     if (e.key === "Enter" && inputRefs.current[index + 1]) {
//       inputRefs.current[index + 1].focus();
//     }
//   };
  
//   const handleInputChange = (event) => {
//     const { id, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };
//   const handleNumberChange = (e) => {
//     const { id, value } = e.target;
//     if (/^\d*\.?\d*$/.test(value)) {
//       setFormData({ ...formData, [id]: value });
//     }
//   };
  
//  const handleInputChange2 = (e, field) => {
//     const value = e.target.value.toUpperCase();
//     if (value === 'Y') {
//       setFormData((prev) => ({ ...prev, [field]: true })); 
//     } else if (value === 'N') {
//       setFormData((prev) => ({ ...prev, [field]: false }));
//     } else {
//       setFormData((prev) => ({ ...prev, [field]: '' })); 
//     }
//   };
//   const [data, setData] = useState([]);
//   const [data1, setData1] = useState([]);
//   const [index, setIndex] = useState(0);
//   const [isAddEnabled, setIsAddEnabled] = useState(true);
//   const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false); // State to track edit mode
//   const [isAbcmode, setIsAbcmode] = useState(false);
//   const [isEditMode2, setIsEditMode2] = useState(false); // State to track edit mode
//   const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
//   const fetchData = async () => {
//     try {
//       const response = await axios.get("http://103.154.233.29:3007/auth/api/excisesetup");
//       if (response.status === 200 && response.data.length > 0) {
//         const lastEntry = response.data[response.data.length - 1]; // Assuming you want the last one
//         setFormData(lastEntry.formData);
//         setData1(lastEntry); // Assuming this is meant to hold the full data structure
//         setIndex(lastEntry._id);
//       } else {
//         setDefaults(); // If no data, reset everything
//       }
//     } catch (error) {
//       console.error("Error fetching data", error);
//       setDefaults(); // Reset in case of error
//     }
//   };
  
  
//   const setDefaults = () => {
//     // Define default empty states here to avoid redundancy and mistakes
//     const emptyData = {
//       RG23A: 0.0,
//     RG23A1: 0.0,
//     RG23A2: 0.0,
//     RG23A3: 0.0,
//     RG23C: 0.0,
//     RG23C1: 0.0,
//     RG23C2: 0.0,
//     RG23C3: 0.0,
//     ServiceTax:0.00,
//     ServiceTax1:0.00,
//     ServiceTax2:0.00,
//     PLA: 0.0,
//     PLA1: 0.0,
//     PLA2: 0.0,
//     ExciseRate: 0.0,
//     PcessRate: 0.0,
//     HcessRate: 0.0,
//     ModvatSeries: 0.0,
//     TradingExcise: "",
//     StockCalcluationLevel: 0.0,
//     GroupWiseStock: "",
//     };
//     setFormData(emptyData);
//     setData1({ formData: emptyData });
//     setIndex(0);
//   };
//  useEffect(() => {
//      fetchData(); // Fetch data when component mounts
//  }, []);

//  const handleEditClick = () => {
//   setTitle("(EDIT)")
//   setIsDisabled(false);
//   setIsEditMode(true);
//   setIsSubmitEnabled(true);
//   setIsAbcmode(true);
// };

//  const handleSaveClick = async () => {
//     let isDataSaved = false; 
//     const userConfirmed = window.confirm("Are you sure you want to save the data?");
//     if (!userConfirmed) return;

//     const prepareData = () => ({
//       _id: formData._id,
//       formData: {
//         ...formData,
//       }
//     });

//     try {
//       const combinedData = prepareData();
//       console.log("Combined Data New:", combinedData);
//       const apiEndpoint = `http://103.154.233.29:3007/auth/excisesetup${isAbcmode ? `/${data1._id}` : ""}`;
//       const method = isAbcmode ? "put" : "post";
//       const response = await axios({ method, url: apiEndpoint, data: combinedData });

//       if (response.status === 200 || response.status === 201) {
//         fetchData();
//         isDataSaved = true;
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       toast.error("Failed to save data. Please try again.", { position: "top-center" });
//     } finally {
//       setIsSubmitEnabled(false);
//       setIsDisabled(!isDataSaved);
//       setIsEditMode(!isDataSaved);
//       const toastMsg =  "Data Saved Successfully!";
//       toast.success(toastMsg, { position: "top-center" });
//     }
// };

//   return (
//     <div className="NewModalcb">
//       <div className="Modalcontainer">
//         <h1 className="Headingz">EXCISE INFORMATION</h1>
//         <text style={{marginLeft:"48%"}} className="tittles">{title}</text>
//         <div style={{ display: "flex", flexDirection: "row", marginTop: 20 }}>
//           <div style={{ display: "flex", flexDirection: "column" }}>
//             <text className="LABEL" style={{ marginLeft: 120 }}>
//               EXCISE DUTY
//             </text>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>RG23A-II</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//               id="RG23A"
//                 className="RGA"
//                 value={formData.RG23A}
//                 onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[0] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 0)}
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>RG23C-II</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//               id="RG23C"
//                 className="RGC"
//                 value={formData.RG23C}
//                 onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[1] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 1)}
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>P.L.A</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//               id="PLA"
//                 className="PLA"
//                 value={formData.PLA}
//                 onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[2] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 2)}
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>SERVICE TAX</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//               id="ServiceTax"
//                 className="ServiceTax"
//                 value={formData.ServiceTax}
//                 onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[3] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 3)}
//               />
//             </div>
//           </div>
//           <div
//             style={{ display: "flex", flexDirection: "column", marginLeft: 20 }}
//           >
//             <text className="LABEL" style={{ marginLeft: 108 }}>
//               PRIMARY E.CESS
//             </text>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>RG23A-II</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//                id="RG23A1"
//                className="RGA"
//                value={formData.RG23A1}
//                onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[4] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 4)}
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>RG23C-II</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//                  id="RG23C1"
//                  className="RGC"
//                  value={formData.RG23C1}
//                  onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[5] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 5)}
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>P.L.A</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//                 id="PLA1"
//                 className="PLA"
//                 value={formData.PLA1}
//                 onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[6] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 6)}
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>SERVICE TAX</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//                   id="ServiceTax1"
//                   className="ServiceTax"
//                   value={formData.ServiceTax1}
//                   onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[7] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 7)}
//               />
//             </div>
//           </div>
//           <div
//             style={{ display: "flex", flexDirection: "column", marginLeft: 20 }}
//           >
//             <text className="LABEL" style={{ marginLeft: 110 }}>
//               HIGHER E.CESS
//             </text>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>RG23A-II</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//                id="RG23A2"
//                className="RGA"
//                value={formData.RG23A2}
//                onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[8] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 8)}
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>RG23C-II</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//               id="RG23C2"
//               className="RGC"
//               value={formData.RG23C2}
//               onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[9] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 9)}
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>P.L.A</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//                  id="PLA2"
//                  className="PLA"
//                  value={formData.PLA2}
//                  onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[10] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 10)}
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>SERVICE TAX</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//                id="ServiceTax2"
//                className="ServiceTax"
//                value={formData.ServiceTax2}
//                onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[11] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 11)}
//               />
//             </div>
//           </div>
//           <div
//             style={{ display: "flex", flexDirection: "column", marginLeft: 20 }}
//           >
//             <text className="LABEL" style={{ marginLeft: 140 }}>
//               AD.DUTY
//             </text>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>RG23A-II</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//                  id="RG23A3"
//                  className="RGA"
//                  value={formData.RG23A3}
//                  onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[12] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 12)}
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//             >
//               <text>RG23C-II</text>
//               <input
//                 readOnly={!isEditMode || isDisabled}
//               id="RG23C3"
//               className="RGC"
//               value={formData.RG23C3}
//               onChange={handleNumberChange}
//                 ref={(el) => (inputRefs.current[13] = el)}
//                 onKeyDown={(e) => handleKeyDown(e, 13)}
//               />
//             </div>
//           </div>
//         </div>
//         <div style={{ display: "flex", flexDirection: "row", marginTop: 50 }}>
//           <div style={{ marginLeft: 10 }}>
//             <text>Excise Rate:</text>
//             <input
//               readOnly={!isEditMode || isDisabled}
//             id="ExciseRate"
//               className="ExciseRate"
//               value={formData.ExciseRate}
//               onChange={handleNumberChange}
//               ref={(el) => (inputRefs.current[14] = el)}
//               onKeyDown={(e) => handleKeyDown(e, 14)}
//             />
//           </div>
//           <div style={{ marginLeft: 20 }}>
//             <text>PCess Rate:</text>
//             <input
//               readOnly={!isEditMode || isDisabled}
//             id="PcessRate"
//               className="PCessRate"
//               value={formData.PcessRate}
//               onChange={handleNumberChange}
//               ref={(el) => (inputRefs.current[15] = el)}
//               onKeyDown={(e) => handleKeyDown(e, 15)}
//             />
//           </div>
//           <div style={{ marginLeft: 20 }}>
//             <text>HCess Rate:</text>
//             <input
//               readOnly={!isEditMode || isDisabled}
//             id="HcessRate"
//               className="HCessRate"
//               value={formData.HcessRate}
//               onChange={handleNumberChange}
//               ref={(el) => (inputRefs.current[16] = el)}
//               onKeyDown={(e) => handleKeyDown(e, 16)}
//             />
//           </div>
//           <div style={{ marginLeft: 20 }}>
//             <text>Modvat Series:</text>
//             <input
//               readOnly={!isEditMode || isDisabled}
//             id="ModvatSeries"
//               className="Modvat"
//               value={formData.ModvatSeries}
//               onChange={handleNumberChange}
//               ref={(el) => (inputRefs.current[17] = el)}
//               onKeyDown={(e) => handleKeyDown(e, 17)}
//             />
//           </div>
//         </div>
//         <div style={{ display: "flex", flexDirection: "row", marginTop: 50 }}>
//           <div style={{ marginLeft: 20 }}>
//             <text>Trading Excise R/O Y/N:</text>
//             <input
//               readOnly={!isEditMode || isDisabled}
//               className="TradingExcise"
//               ref={(el) => (inputRefs.current[18] = el)}
//               onKeyDown={(e) => handleKeyDown(e, 18)}
//               value={formData.TradingExcise === '' ? '' : formData.TradingExcise ? 'Y' : 'N'}
//               onChange={(e) => handleInputChange2(e, 'TradingExcise')}
//               maxLength={1}
//             />
//           </div>
//           <div style={{ marginLeft: 30 }}>
//             <text>Stock Calculation Level:</text>
//             <input
//               readOnly={!isEditMode || isDisabled}
//             id="StockCalcluationLevel"
//               className="StockLevel"
//               value={formData.StockCalcluationLevel}
//               onChange={handleNumberChange}
//               ref={(el) => (inputRefs.current[19] = el)}
//               onKeyDown={(e) => handleKeyDown(e, 19)}
//             />
//           </div>
//           <div style={{ marginLeft: 30 }}>
//             <text>Group Wise Stock:</text>
//             <input
//               readOnly={!isEditMode || isDisabled}
//               className="GroupStock"
//               ref={(el) => (inputRefs.current[20] = el)}
//               onKeyDown={(e) => handleKeyDown(e, 20)}
//               value={formData.GroupWiseStock === '' ? '' : formData.GroupWiseStock ? 'Y' : 'N'}
//               onChange={(e) => handleInputChange2(e, 'GroupWiseStock')}
//               maxLength={1}
//             />
//           </div>
//           <Button
//           onClick={handleEditClick}
//           style={{borderColor: "transparent",
//               backgroundColor: "darkgoldenrod",width: 100,marginLeft:20}}>EDIT</Button>
//           <Button
//           disabled={!isSubmitEnabled} 
//           onClick={handleSaveClick}
//             ref={(el) => (inputRefs.current[21] = el)}
//             onKeyDown={(e) => handleKeyDown(e, 21)}
//             style={{
//               borderColor: "transparent",
//               backgroundColor: "green",
//               width: 100,marginLeft:10
//             }}
//           >
//             SAVE
//           </Button>
//           <Button
//             onClick={onClose}
//             style={{
//               borderColor: "transparent",
//               backgroundColor: "red",
//               width: 100,
//               marginLeft: 10,
//             }}
//           >
//             CLOSE
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExciseSetup;


import React, { useState, useEffect, useRef } from "react";
import "./ExciseSetup.css";
import { Button, Toast } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import shkunlogo2 from "../Shkunlogo.png"
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  FormLabel,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { CompanyContext } from "../../Context/CompanyContext";
import { useContext } from "react";

const ExciseSetup = ({ onClose }) => {
  const { company } = useContext(CompanyContext);
    const tenant = company?.databaseName;
  
    if (!tenant) {
      // you may want to guard here or show an error state,
      // since without a tenant you can’t hit the right API
      console.error("No tenant selected!");
    }

  const [title, setTitle] = useState('(View)');
  const inputRefs = useRef([]);
  const [formData, setFormData] = useState({
    RG23A: 0.0,
    RG23A1: 0.0,
    RG23A2: 0.0,
    RG23A3: 0.0,
    RG23C: 0.0,
    RG23C1: 0.0,
    RG23C2: 0.0,
    RG23C3: 0.0,
    ServiceTax:0.00,
    ServiceTax1:0.00,
    ServiceTax2:0.00,
    PLA: 0.0,
    PLA1: 0.0,
    PLA2: 0.0,
    ExciseRate: 0.0,
    PcessRate: 0.0,
    HcessRate: 0.0,
    ModvatSeries: 0.0,
    TradingExcise: "",
    StockCalcluationLevel: 0.0,
    GroupWiseStock: "",
  });

  // Function to handle Enter key and shift focus to the next input field
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter" && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleNumericValue = (event) => {
    const { id, value } = event.target;
    // Allow only numeric values, including optional decimal points
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };
  const handleAlphabeticValue = (event) => {
    const { id, value } = event.target;
    // Allow only alphabetic characters (A-Z, a-z) and empty string
    if (/^[a-zA-Z]*$/.test(value) || value === '') {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  }; 

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  }; 

  const handleDateChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };

 const handleInputChange2 = (e, field) => {
    const value = e.target.value.toUpperCase();
    if (value === 'Y') {
      setFormData((prev) => ({ ...prev, [field]: true })); 
    } else if (value === 'N') {
      setFormData((prev) => ({ ...prev, [field]: false }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: '' })); 
    }
  };
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [index, setIndex] = useState(0);
  const [isAddEnabled, setIsAddEnabled] = useState(true);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true); // State to track edit mode
  const [isAbcmode, setIsAbcmode] = useState(false);
  const [isEditMode2, setIsEditMode2] = useState(false); // State to track edit mode
  const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
  const [activeStep, setActiveStep] = useState(0);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/api/excisesetup`);
      if (response.status === 200 && response.data.length > 0) {
        const lastEntry = response.data[response.data.length - 1]; // Assuming you want the last one
        setFormData(lastEntry.formData);
        setData1(lastEntry); // Assuming this is meant to hold the full data structure
        setIndex(lastEntry._id);
      } else {
        setDefaults(); // If no data, reset everything
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setDefaults(); // Reset in case of error
    }
  };
  
  
  const setDefaults = () => {
    // Define default empty states here to avoid redundancy and mistakes
    const emptyData = {
      RG23A: 0.0,
    RG23A1: 0.0,
    RG23A2: 0.0,
    RG23A3: 0.0,
    RG23C: 0.0,
    RG23C1: 0.0,
    RG23C2: 0.0,
    RG23C3: 0.0,
    ServiceTax:0.00,
    ServiceTax1:0.00,
    ServiceTax2:0.00,
    PLA: 0.0,
    PLA1: 0.0,
    PLA2: 0.0,
    ExciseRate: 0.0,
    PcessRate: 0.0,
    HcessRate: 0.0,
    ModvatSeries: 0.0,
    TradingExcise: "",
    StockCalcluationLevel: 0.0,
    GroupWiseStock: "",
    };
    setFormData(emptyData);
    setData1({ formData: emptyData });
    setIndex(0);
  };
  useEffect(() => {
      fetchData(); // Fetch data when component mounts
  }, []);

  const handleEditClick = () => {
    setTitle("(EDIT)")
    setIsDisabled(false);
    setIsEditMode(true);
    setIsSubmitEnabled(true);
    setIsAbcmode(true);
  };

  const handleRateBlur = (field) => {
    const decimalPlaces = 3; // Default to 3 decimal places if rateValue is undefined
    let value = parseFloat(formData[field]);

    if (isNaN(value)) {
      setFormData((prev) => ({ ...prev, [field]: "" })); // Keep empty if NaN
    } else {
      setFormData((prev) => ({ ...prev, [field]: value.toFixed(decimalPlaces) }));
    }
  };

 const handleSaveClick = async () => {
    let isDataSaved = false; 

    const prepareData = () => ({
      _id: formData._id,
      formData: {
        ...formData,
      }
    });

    try {
      const combinedData = prepareData();
      console.log("Combined Data New:", combinedData);
      const apiEndpoint = `http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/excisesetup${isAbcmode ? `/${data1._id}` : ""}`;
      const method = isAbcmode ? "put" : "post";
      const response = await axios({ method, url: apiEndpoint, data: combinedData });

      if (response.status === 200 || response.status === 201) {
        fetchData();
        isDataSaved = true;
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.", { position: "top-center" });
    } finally {
      setIsSubmitEnabled(false);
      setIsDisabled(!isDataSaved);
      setIsEditMode(!isDataSaved);
      const toastMsg =  "Data Saved Successfully!";
      toast.success(toastMsg, { position: "top-center" });
    }
};

  // Header section with logo and title
  const headerSection = (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Typography variant="h4" sx={{ flexGrow: 1, textAlign: 'center', fontWeight: 'bold', ml: 2 }}>
        EXCISE SETUP
      </Typography>
    </Box>
  );

const steps = [
  "Excise Duty",
  "Primary E.Cess",
  "Higher E.Cess",
  "AD.Duty",
  "Rate And Others"
];
// Modern TextField style (smaller height & reduced margin)
const textFieldStyle = {
  mb: 1,
  '& .MuiOutlinedInput-root': {
    height: 48,
    fontSize: '0.9rem',
    fontWeight:'bold',
    borderRadius: '6px',
    backgroundColor: '#fff',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    '& fieldset': { borderColor: '#ccc' },
    '&:hover fieldset': { borderColor: '#999' },
    '&.Mui-focused fieldset': { borderColor: '#3f51b5', borderWidth: '2px' },
  },
};

  // Stepper content for each step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                label="RG23A-II"
                id="RG23A"
                fullWidth
                size="small"
                value={formData.RG23A}
                onChange={handleNumericValue}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
                onBlur={() => handleRateBlur("RG23A")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="RG23C-II"
                id="RG23C"
                fullWidth
                size="small"
                value={formData.RG23C}
                onChange={handleNumericValue}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
                onBlur={() => handleRateBlur("RG23C")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="P.L.A"
                id="PLA"
                fullWidth
                size="small"
                value={formData.PLA}
                onChange={handleNumericValue}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
                onBlur={() => handleRateBlur("PLA")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="SERVICE TAX"
                id="ServiceTax"
                fullWidth
                size="small"
                value={formData.ServiceTax}
                onChange={handleNumericValue}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
                onBlur={() => handleRateBlur("ServiceTax")}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                label="RG23A-II"
                id="RG23A1"
                fullWidth
                size="small"
                value={formData.RG23A1}
                onChange={handleNumericValue}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
                onBlur={() => handleRateBlur("RG23A1")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="RG23C-II"
                id="RG23C1"
                fullWidth
                size="small"
                value={formData.RG23C1}
                onChange={handleNumericValue}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
                onBlur={() => handleRateBlur("RG23C1")}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="P.L.A"
                id="PLA1"
                fullWidth
                size="small"
                value={formData.PLA1}
                onChange={handleNumericValue}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
                onBlur={() => handleRateBlur("PLA1")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="SERVICE TAX"
                id="ServiceTax1"
                fullWidth
                size="small"
                value={formData.ServiceTax1}
                onChange={handleNumericValue}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
                onBlur={() => handleRateBlur("ServiceTax1")}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                label="RG23A-II"
                id="RG23A2"
                fullWidth
                size="small"
                value={formData.RG23A2}
                onChange={handleNumericValue}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
                onBlur={() => handleRateBlur("RG23A2")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="RG23C-II"
                id="RG23C2"
                fullWidth
                size="small"
                value={formData.RG23C2}
                onChange={handleNumericValue}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
                onBlur={() => handleRateBlur("RG23C2")}

              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="P.L.A"
                id="PLA2"
                fullWidth
                size="small"
                value={formData.PLA2}
                onChange={handleNumericValue}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
                onBlur={() => handleRateBlur("PLA2")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="SERVICE TAX"
                id="ServiceTax2"
                fullWidth
                size="small"
                value={formData.ServiceTax2}
                onChange={handleNumericValue}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
                onBlur={() => handleRateBlur("ServiceTax2")}

              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={1}>
          <Grid item xs={12}>
            <TextField
              label="RG23A-II"
              id="RG23A3"
              fullWidth
              size="small"
              value={formData.RG23A3}
              onChange={handleNumericValue}
              sx={textFieldStyle}
              inputProps={{
                readOnly: !isEditMode || isDisabled,
              }}
              onBlur={() => handleRateBlur("RG23C2")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="RG23C-II"
              id="RG23C3"
              fullWidth
              size="small"
              value={formData.RG23C3}
              onChange={handleNumericValue}
              sx={textFieldStyle}
              inputProps={{
                readOnly: !isEditMode || isDisabled,
              }}
              onBlur={() => handleRateBlur("RG23C2")}
            />
          </Grid>
        </Grid>
        );
        case 4:
          return (
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  label="EXCISE RATE"
                  id="ExciseRate"
                  fullWidth
                  size="small"
                  value={formData.ExciseRate}
                  onChange={handleNumericValue}
                  sx={textFieldStyle}
                  inputProps={{
                    readOnly: !isEditMode || isDisabled,
                  }}
                  onBlur={() => handleRateBlur("ExciseRate")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="PCESS RATE"
                  id="PcessRate"
                  fullWidth
                  size="small"
                  value={formData.PcessRate}
                  onChange={handleNumericValue}
                  sx={textFieldStyle}
                  inputProps={{
                    readOnly: !isEditMode || isDisabled,
                  }}
                  onBlur={() => handleRateBlur("PcessRate")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="HCESS RATE"
                  id="HcessRate"
                  fullWidth
                  size="small"
                  value={formData.HcessRate}
                  onChange={handleNumericValue}
                  sx={textFieldStyle}
                  inputProps={{
                    readOnly: !isEditMode || isDisabled,
                  }}
                  onBlur={() => handleRateBlur("HcessRate")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="MODVAT SERIES"
                  id="ModvatSeries"
                  fullWidth
                  size="small"
                  value={formData.ModvatSeries}
                  onChange={handleNumericValue}
                  sx={textFieldStyle}
                  inputProps={{
                    readOnly: !isEditMode || isDisabled,
                  }}
                  onBlur={() => handleRateBlur("ModvatSeries")}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="TRADING EXCISE R/O Y/N"
                  id="TradingExcise"
                  fullWidth
                  size="small"
                  value={formData.TradingExcise === '' ? '' : formData.TradingExcise ? 'Y' : 'N'}
                  onChange={(e) => handleInputChange2(e, 'TradingExcise')}
                  sx={textFieldStyle}
                  inputProps={{
                    readOnly: !isEditMode || isDisabled,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="STOCK CALCULATION LEVEL"
                  id="StockCalcluationLevel"
                  fullWidth
                  size="small"
                  value={formData.StockCalcluationLevel}
                  onChange={handleNumericValue}
                  sx={textFieldStyle}
                  inputProps={{
                    readOnly: !isEditMode || isDisabled,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="GROUP WISE STOCK"
                  id="GroupWiseStock"
                  fullWidth
                  size="small"
                  value={formData.GroupWiseStock === '' ? '' : formData.GroupWiseStock ? 'Y' : 'N'}
                  onChange={(e) => handleInputChange2(e, 'GroupWiseStock')}
                  sx={textFieldStyle}
                  inputProps={{
                    readOnly: !isEditMode || isDisabled,
                  }}
                />
              </Grid>
            </Grid>
          );
      default:
        return 'Unknown Step';
    }
  };

  return (
    <div className="NewModalcb">
        <ToastContainer />
    <div className="Modalcontainer">
    {headerSection}
    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <form>
              {getStepContent(activeStep)}
              <Stack direction="row" spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  variant="contained"
                  style={{backgroundColor:"blue", color: '#fff'}}
                  type="button"
                >
                  BACK
                </Button>
                <Button
                  // disabled={activeStep === 0}
                  onClick={handleEditClick}
                  variant="contained"
                  style={{ backgroundColor: 'gray', color: '#fff' }}
                  type="button"
                >
                  EDIT
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    onClick={handleSaveClick}
                    variant="contained"
                    style={{ backgroundColor: '#006400', color: '#fff' }}
                    type="button"
                  >
                     {"SAVE"}
                    {/* {isUpdate ? "UPDATE" : "SAVE"} */}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setActiveStep((prev) => prev + 1)}
                    variant="contained"
                    style={{ backgroundColor: '#006400', color: '#fff' }}
                    type="button"
                  >
                    NEXT
                  </Button>
                )}
                   <Button
                    onClick={onClose}
                    variant="contained"
                    style={{ backgroundColor: '#8B0000', color: '#fff' }}
                    type="button"
                  >
                     {"CLOSE"}
                    {/* {isUpdate ? "UPDATE" : "SAVE"} */}
                  </Button>
              </Stack>
            </form>
    </div>
    </div>
  );
};

export default ExciseSetup;

