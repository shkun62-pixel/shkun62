// import React, { useState, useEffect, useRef,forwardRef } from "react";
// import "./Purchase.css";
// import DatePicker from "react-datepicker";
// import InputMask from "react-input-mask";
// import "react-datepicker/dist/react-datepicker.css";
// import "react-toastify/dist/ReactToastify.css";
// import Table from "react-bootstrap/Table";
// import Button from "react-bootstrap/Button";
// import ProductModal from "../Modals/ProductModal";
// import ProductModalCustomer from "../Modals/ProductModalCustomer";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaPlus, FaMinus, FaCog, FaTimes } from "react-icons/fa";
// import PurchaseSetup from "./PurchaseSetup";
// import InvoicePDFPur from "../InvoicePdfPur";
// import InvoicePur2 from "../InvoicePDF/InvoicePur2";
// import InvoicePur3 from "../InvoicePDF/InvoicePur3";
// import { useEditMode } from "../../EditModeContext";
// import { CompanyContext } from "../Context/CompanyContext";
// import { useContext } from "react";
// import TextField from "@mui/material/TextField";
// import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
// import { IconButton } from "@mui/material";
// import DeleteIcon from "@mui/icons-material/Delete";
// import BillPrintMenu from "../Modals/BillPrintMenu";
// import { useReactToPrint } from "react-to-print";
// import useCompanySetup from "../Shared/useCompanySetup";
// import { Modal, Form } from "react-bootstrap";
// import useTdsApplicable from "../Shared/useTdsApplicable";
// import { useNavigate, useLocation } from "react-router-dom";
// import PurFAVoucherModal from "./PurFAVoucherModal";
// import FAVoucherModal from "../Shared/FAVoucherModal";

// const LOCAL_STORAGE_KEY = "TABLEdataVisibility";
// // ✅ Forward ref so DatePicker can focus the input
// const MaskedInput = forwardRef(({ value, onChange, onBlur }, ref) => (
//   <InputMask
//     mask="99-99-9999"
//     maskChar=" "
//     value={value}
//     onChange={onChange}
//     onBlur={onBlur}
//   >
//     {(inputProps) => <input {...inputProps} ref={ref} className="DatePICKER" />}
//   </InputMask>
// ));

// const Purchase = () => {
//   const location = useLocation();
//   const purId = location.state?.purId;
//   const navigate = useNavigate();
//   const { applicable194Q } = useTdsApplicable();
//   const { CompanyState } = useCompanySetup();
//   const [selectedInvoice, setSelectedInvoice] = useState("InvoicePDFPur");
//   const invoiceComponents = {
//     InvoicePDFPur,
//     InvoicePur2,
//     InvoicePur3,
//   };
//   const handleCloseInvoice = () => setOpen(false);
//   const SelectedInvoiceComponent = invoiceComponents[selectedInvoice];

//   const { company } = useContext(CompanyContext);
//   // const tenant = company?.databaseName;
//     const tenant = "shkun_05062025_05062026"

//   if (!tenant) {
//     // you may want to guard here or show an error state,
//     // since without a tenant you can’t hit the right API
//     // console.error("No tenant selected!");
//   }

//   const [selectedCopies, setSelectedCopies] = useState([]);
//   const [title, setTitle] = useState("(View)");
//   const [currentIndex, setCurrentIndex] = useState(null);
//   const itemCodeRefs = useRef([]);
//   const datePickerRef = useRef([]);
//   const desciptionRefs = useRef([]);
//   const peciesRefs = useRef([]);
//   const quantityRefs = useRef([]);
//   const priceRefs = useRef([]);
//   const amountRefs = useRef([]);
//   const discountRef = useRef([]);
//   const discount2Ref = useRef([]);
//   const othersRefs = useRef([]);
//   const cgstRefs = useRef([]);
//   const sgstRefs = useRef([]);
//   const igstRefs = useRef([]);
//   const hsnCodeRefs = useRef([]);
//   const saveButtonRef = useRef(null);
//   const addButtonRef = useRef(null);
//   const expAfterGSTRef = useRef(null);
//   const printButtonRef = useRef(null);

//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   // const handleClose = () => setOpen(false);
//   const [custGst, setCustgst] = useState("");
//   const initialColors = [
//     "#E9967A",
//     "#F0E68C",
//     "#FFDEAD",
//     "#ADD8E6",
//     "#87CEFA",
//     "#FFF0F5",
//     "#FFC0CB",
//     "#D8BFD8",
//     "#DC143C",
//     "#DCDCDC",
//     "#8FBC8F",
//   ];
//   const [buttonColors, setButtonColors] = useState(initialColors); // Initial colors
//   const [formData, setFormData] = useState({
//     date: "",
//     vtype: "P",
//     vno: 0,
//     vbillno: 0,
//     exfor: "",
//     trpt: "",
//     p_entry: "",
//     stype: "",
//     btype: "",
//     conv: "",
//     vacode1: "",
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
//     gr: "",
//     tdson: "",
//     pcess: 0,
//     tax: 0,
//     cess1: 0,
//     cess2: 0,
//     sub_total: 0,
//     exp_before: 0,
//     Exp_rate6: 0,
//     Exp_rate7: 0,
//     Exp_rate8: 0,
//     Exp_rate9: 0,
//     Exp_rate10: 0,
//     Exp6: 0,
//     Exp7: 0,
//     Exp8: 0,
//     Exp9: 0,
//     Exp10: 0,
//     Tds2: "",
//     Ctds: "",
//     Stds: "",
//     iTds: "",
//     cgst: 0,
//     sgst: 0,
//     igst: 0,
//     expafterGST: 0,
//     ExpRoundoff: 0,
//     grandtotal: 0,
//   });
//   const [supplierdetails, setsupplierdetails] = useState([
//     {
//       // VcodeSup
//       Vcode: "",
//       vacode: "",
//       gstno: "",
//       pan: "",
//       Add1: "",
//       city: "",
//       state: "",
//       Tcs206c1H: "",
//       TDS194Q: "",
//     },
//   ]);
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       vcode: "",
//       sdisc: "",
//       Units: "",
//       pkgs: "",
//       weight: "",
//       rate: 0,
//       amount: 0,
//       disc: "",
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
//       RateCal: "",
//       Qtyperpc: 0,
//       exp_before: 0,
//       ctax: 0,
//       stax: 0,
//       itax: 0,
//       tariff: "",
//       vamt: 0,
//     },
//   ]);

//   useEffect(() => {
//     if (addButtonRef.current && !purId) {
//       addButtonRef.current.focus();
//     }
//   }, []);

//     const defaultTableFields = {
//       itemcode: true,
//       sdisc: true,
//       hsncode: true,
//       pcs: true,
//       qty: true,
//       rate: true,
//       amount: true,
//       discount: false,
//       others: true,
//       gst:false,
//       cgst: true,
//       sgst: true,
//       igst: true,
//     };
    
//     const [tableData, settableData] = useState(() => {
//     const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//     const parsed = saved ? JSON.parse(saved) : {};
    
//     // Only keep keys that exist in defaultFormData
//     const sanitized = Object.fromEntries(
//       Object.entries({ ...defaultTableFields, ...parsed }).filter(([key]) =>
//         Object.hasOwn(defaultTableFields, key)
//       )
//     );
    
//     return sanitized;
//   });
  
  
//     // Save to localStorage whenever tableData changes
//     useEffect(() => {
//       localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tableData));
//     }, [tableData]);
  
//     const handleCheckboxChange = (field) => {
//       settableData((prev) => ({ ...prev, [field]: !prev[field] }));
//     };
    
//   const customerNameRef = useRef(null);
//   const grNoRef = useRef(null);
//   const termsRef = useRef(null);
//   const vehicleNoRef = useRef(null);
//   const selfInvRef = useRef(null);
//   const vBillNoRef = useRef(null);
//   const tableRef = useRef(null);

//   // useEffect(() => {
//   //   if (customerNameRef.current) {
//   //     customerNameRef.current.focus();
//   //   }
//   // }, []);

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

//   const [T11, setT11] = useState(false); // State to hold T11 value
//   const [T12, setT12] = useState(false); // State to hold T11 value
//   const [pkgsValue, setpkgsValue] = useState(3);
//   const [weightValue, setweightValue] = useState(3);
//   const [rateValue, setrateValue] = useState(2);
//   const [Expense1, setExpense1] = useState("");
//   const [Expense2, setExpense2] = useState("");
//   const [Expense3, setExpense3] = useState("");
//   const [Expense4, setExpense4] = useState(null);
//   const [Expense5, setExpense5] = useState(null);
//   const [Expense6, setExpense6] = useState(null);
//   const [Expense7, setExpense7] = useState(null);
//   const [Expense8, setExpense8] = useState(null);
//   const [Expense9, setExpense9] = useState(null);
//   const [Expense10, setExpens10] = useState(null);
//   const [ExpRate1, setExpRate1] = useState(null);
//   const [ExpRate2, setExpRate2] = useState(null);
//   const [ExpRate3, setExpRate3] = useState(null);
//   const [ExpRate4, setExpRate4] = useState(null);
//   const [ExpRate5, setExpRate5] = useState(null);
//   const [ExpRate6, setExpRate6] = useState(null);
//   const [ExpRate7, setExpRate7] = useState(null);
//   const [ExpRate8, setExpRate8] = useState(null);
//   const [ExpRate9, setExpRate9] = useState(null);
//   const [ExpRate10, setExpRate10] = useState(null);
//   const [CalExp1, setCalExp1] = useState("");
//   const [CalExp2, setCalExp2] = useState("");
//   const [CalExp3, setCalExp3] = useState("");
//   const [CalExp4, setCalExp4] = useState("");
//   const [CalExp5, setCalExp5] = useState("");
//   const [CalExp6, setCalExp6] = useState("");
//   const [CalExp7, setCalExp7] = useState("");
//   const [CalExp8, setCalExp8] = useState("");
//   const [CalExp9, setCalExp9] = useState("");
//   const [CalExp10, setCalExp10] = useState("");
//   const [Pos, setPos] = useState("");
//   const [Pos2, setPos2] = useState("");
//   const [Pos3, setPos3] = useState("");
//   const [Pos4, setPos4] = useState("");
//   const [Pos5, setPos5] = useState("");
//   const [Pos6, setPos6] = useState("");
//   const [Pos7, setPos7] = useState("");
//   const [Pos8, setPos8] = useState("");
//   const [Pos9, setPos9] = useState("");
//   const [Pos10, setPos10] = useState("");
//   const [WindowBefore, setWindowBefore] = useState(null);
//   const [WindowAfter, setWindowAfter] = useState(null);
//   const [SupplyType, setSupplyType] = useState("");
//   const [Defaultbutton, setDefaultbutton] = useState("");

//   const fetchPurSetup = async () => {
//     try {
//       const response = await fetch(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchasesetup`
//       );
//       if (!response.ok) throw new Error("Failed to fetch sales setup");

//       const data = await response.json();

//       if (Array.isArray(data) && data.length > 0 && data[0].formData) {
//         const formDataFromAPI = data[0].formData;
//         setsetupFormData(formDataFromAPI);
//         const T11Value = formDataFromAPI.T11;
//         const T12Value = formDataFromAPI.T12;
//         const e1RateValue = formDataFromAPI.E1rate;
//         setpkgsValue(formDataFromAPI.pkgs);
//         setweightValue(formDataFromAPI.weight);
//         setrateValue(formDataFromAPI.rate);
//         setExpense1(formDataFromAPI.Exp1);
//         setExpense2(formDataFromAPI.Exp2);
//         setExpense3(formDataFromAPI.Exp3);
//         setExpense4(formDataFromAPI.Exp4);
//         setExpense5(formDataFromAPI.Exp5);
//         setExpense6(formDataFromAPI.Exp6);
//         setExpense7(formDataFromAPI.Exp7);
//         setExpense8(formDataFromAPI.Exp8);
//         setExpense9(formDataFromAPI.Exp9);
//         setExpens10(formDataFromAPI.Exp10);
//         setExpRate1(e1RateValue);
//         setExpRate2(formDataFromAPI.E2rate);
//         setExpRate3(formDataFromAPI.E3rate);
//         setExpRate4(formDataFromAPI.E4rate);
//         setExpRate5(formDataFromAPI.E5rate);
//         setExpRate6(formDataFromAPI.E6rate);
//         setExpRate7(formDataFromAPI.E7rate);
//         setExpRate8(formDataFromAPI.E8rate);
//         setExpRate9(formDataFromAPI.E9rate);
//         setExpRate10(formDataFromAPI.E10rate);
//         setCalExp1(formDataFromAPI.E1);
//         setCalExp2(formDataFromAPI.E2);
//         setCalExp3(formDataFromAPI.E3);
//         setCalExp4(formDataFromAPI.E4);
//         setCalExp5(formDataFromAPI.E5);
//         setCalExp6(formDataFromAPI.E6);
//         setCalExp7(formDataFromAPI.E7);
//         setCalExp8(formDataFromAPI.E8);
//         setCalExp9(formDataFromAPI.E9);
//         setCalExp10(formDataFromAPI.E10);
//         setPos(formDataFromAPI.E1add);
//         setPos2(formDataFromAPI.E2add);
//         setPos3(formDataFromAPI.E3add);
//         setPos4(formDataFromAPI.E4add);
//         setPos5(formDataFromAPI.E5add);
//         setPos6(formDataFromAPI.E6add);
//         setPos7(formDataFromAPI.E7add);
//         setPos8(formDataFromAPI.E8add);
//         setPos9(formDataFromAPI.E9add);
//         setPos10(formDataFromAPI.E10add);
//         setWindowBefore(formDataFromAPI.T6);
//         setWindowAfter(formDataFromAPI.T7);
//         setSelectedInvoice(formDataFromAPI.reportformat);
//         setSupplyType(formDataFromAPI.conv);
//         setDefaultbutton(formDataFromAPI.T14);
//         // Update T21 and T12 states
//         setT12(T12Value === "Yes");
//         setT11(T11Value === "Yes");
//       } else {
//         throw new Error("Invalid response structure");
//       }
//     } catch (error) {
//       console.error("Error fetching sales setup:", error.message);
//     }
//   };
//   useEffect(() => {
//     fetchPurSetup();
//   }, [
//     ExpRate1,
//     ExpRate2,
//     ExpRate3,
//     ExpRate4,
//     ExpRate5,
//     ExpRate6,
//     ExpRate7,
//     ExpRate8,
//     ExpRate9,
//     ExpRate10,
//     selectedInvoice,
//     Defaultbutton
//   ]);

//   // Getting UnitType From the Company Setup
//   const getUnitTypeFromLocalStorage = () => {
//     const companySetup = localStorage.getItem("companySetup");
//     if (companySetup) {
//       const parsedData = JSON.parse(companySetup);
//       return parsedData?.formData?.unitType || ""; // Safely access unitType or return an empty string if not found
//     }
//     return ""; // Return an empty string if no data in localStorage
//   };
//   // Usage
//   const unitType = getUnitTypeFromLocalStorage();

//   const calculateTotalGst = (formDataOverride = formData, skipTCS = false) => {
//     let totalValue = 0;
//     let cgstTotal = 0;
//     let sgstTotal = 0;
//     let igstTotal = 0;
//     let totalOthers = 0;
//     let totalpcs = 0;
//     let totalQty = 0;
//     let totalDis = 0;
//     const applicableTariffs = [
//       "7204",
//       "7602",
//       "7902",
//       "7404",
//       "7503",
//       "8002",
//       "8101",
//       "7802",
//       "8112",
//       "8113",
//       "8104",
//     ];

//     items.forEach((item) => {
//       const value = parseFloat(item.amount || 0);
//       totalValue += value;
//       cgstTotal += parseFloat(item.ctax || 0);
//       sgstTotal += parseFloat(item.stax || 0);
//       igstTotal += parseFloat(item.itax || 0);
//       totalOthers += parseFloat(item.exp_before || 0);
//       totalpcs += parseFloat(item.pkgs || 0);
//       totalQty += parseFloat(item.weight || 0);
//       totalDis += parseFloat(item.discount || 0);
//     });
//     // Expense Calculations
//     const subTotal = parseFloat(formDataOverride.sub_total) || 0;
//     let exp6Rate = parseFloat(formDataOverride.Exp_rate6) || 0;
//     let exp7Rate = parseFloat(formDataOverride.Exp_rate7) || 0;
//     let exp8Rate = parseFloat(formDataOverride.Exp_rate8) || 0;
//     let exp9Rate = parseFloat(formDataOverride.Exp_rate9) || 0;
//     let exp10Rate = parseFloat(formDataOverride.Exp_rate10) || 0;
//     let exp6 = 0;
//     let exp7 = 0;
//     let exp8 = 0;
//     let exp9 = 0;
//     let exp10 = 0;
//     const Exp1Multiplier6 = Pos6 === "-Ve" ? -1 : 1;
//     const Exp1Multiplier7 = Pos7 === "-Ve" ? -1 : 1;
//     const Exp1Multiplier8 = Pos8 === "-Ve" ? -1 : 1;
//     const Exp1Multiplier9 = Pos9 === "-Ve" ? -1 : 1;
//     const Exp1Multiplier10 = Pos10 === "-Ve" ? -1 : 1;

//     if (CalExp6 === "P" || CalExp6 === "p") {
//       exp6 = (totalpcs * exp6Rate) / 100 || 0;
//     } else if (CalExp6 === "W" || CalExp6 === "w") {
//       exp6 = (totalQty * exp6Rate) / 100 || 0;
//     } else if (CalExp6 === "V" || CalExp6 === "V" || CalExp6 === "") {
//       exp6 = (subTotal * exp6Rate) / 100 || 0;
//     }
//     exp6 *= Exp1Multiplier6; // Apply negative only for Exp if Pos is "-Ve"
//     formDataOverride.Exp6 = exp6.toFixed(2);
//     // EXP 7
//     if (CalExp7 === "P" || CalExp7 === "p") {
//       exp7 = (totalpcs * exp7Rate) / 100 || 0;
//     } else if (CalExp7 === "W" || CalExp7 === "w") {
//       exp7 = (totalQty * exp7Rate) / 100 || 0;
//     } else if (CalExp7 === "V" || CalExp7 === "V" || CalExp7 === "") {
//       exp7 = (subTotal * exp7Rate) / 100 || 0;
//     }
//     exp7 *= Exp1Multiplier7; // Apply negative only for Exp if Pos is "-Ve"
//     formDataOverride.Exp7 = exp7.toFixed(2);
//     // EXP 8
//     if (CalExp8 === "P" || CalExp8 === "p") {
//       exp8 = (totalpcs * exp8Rate) / 100 || 0;
//     } else if (CalExp8 === "W" || CalExp8 === "w") {
//       exp8 = (totalQty * exp8Rate) / 100 || 0;
//     } else if (CalExp8 === "V" || CalExp8 === "V" || CalExp8 === "") {
//       exp8 = (subTotal * exp8Rate) / 100 || 0;
//     }
//     exp8 *= Exp1Multiplier8; // Apply negative only for Exp if Pos is "-Ve"
//     formDataOverride.Exp8 = exp8.toFixed(2);
//     // EXP 9
//     if (CalExp9 === "P" || CalExp9 === "p") {
//       exp9 = (totalpcs * exp9Rate) / 100 || 0;
//     } else if (CalExp9 === "W" || CalExp9 === "w") {
//       exp9 = (totalQty * exp9Rate) / 100 || 0;
//     } else if (CalExp9 === "V" || CalExp9 === "V" || CalExp9 === "") {
//       exp9 = (subTotal * exp9Rate) / 100 || 0;
//     }
//     exp9 *= Exp1Multiplier9; // Apply negative only for Exp if Pos is "-Ve"
//     formDataOverride.Exp9 = exp9.toFixed(2);
//     // EXP 10
//     if (CalExp10 === "P" || CalExp10 === "p") {
//       exp10 = (totalpcs * exp10Rate) / 100 || 0;
//     } else if (CalExp10 === "W" || CalExp10 === "w") {
//       exp10 = (totalQty * exp10Rate) / 100 || 0;
//     } else if (CalExp10 === "V" || CalExp10 === "V" || CalExp10 === "") {
//       exp10 = (subTotal * exp10Rate) / 100 || 0;
//     }
//     exp10 *= Exp1Multiplier10; // Apply negative only for Exp if Pos is "-Ve"
//     formDataOverride.Exp10 = exp10.toFixed(2);

//     // Calculate Total Expenses
//     const totalExpenses = exp6 + exp7 + exp8 + exp9 + exp10;

//     let gstTotal = cgstTotal + sgstTotal + igstTotal;
//     let grandTotal = totalValue + gstTotal + totalOthers + totalExpenses + totalDis;
//     // let grandTotal = totalValue + gstTotal + totalOthers + totalExpenses - totalDis;
//     let taxable = parseFloat(formDataOverride.sub_total);
//     // ✅ Skip TCS Calculation if skipTCS is true
//     let tcs206 = skipTCS ? parseFloat(formDataOverride.tcs206) : 0;
//     let tcs206Rate = skipTCS ? parseFloat(formDataOverride.tcs206_rate) : 0;
//     let tcs1 = skipTCS ? parseFloat(formDataOverride.tcs1) : 0;
//     let tcs1Rate = skipTCS ? parseFloat(formDataOverride.tcs1_rate) : 0;
//     let srvRate = skipTCS ? parseFloat(formDataOverride.srv_rate) : 0;
//     let srv_tax = skipTCS ? parseFloat(formDataOverride.srv_tax) : 0;

//     if (!skipTCS && unitType === "Trading") {
//       tcs206 = (grandTotal * 1) / 100; // 1% TCS
//       tcs206Rate = 1;
//       grandTotal += tcs206;
//     } else if (skipTCS) {
//       grandTotal += parseFloat(tcs206); // Add existing TCS to grand total
//     }

//     if (!skipTCS && applicable194Q === "Above 10 Crore") {
//       srv_tax = (taxable * 0.1) / 100;
//       srvRate = 0.1;
//       // grandTotal += srv_tax;
//     }
//     // const isTcs206c1HYes =supplierdetails?.some( (cust) => cust.Tcs206c1H?.toLowerCase() === "yes") || false;
//     // if (!skipTCS && isTcs206c1HYes) {
//     //   tcs1 = (grandTotal * 0.1) / 100; // 0.1%
//     //   tcs1Rate = 0.1;
//     //   grandTotal += tcs1;
//     // } else if (skipTCS) {
//     //   grandTotal += parseFloat(tcs1); // Add existing TCS to grand total
//     // }

//     // const isTDS149QYes = supplierdetails?.some((cust) => cust.TDS194Q?.toLowerCase() === "yes") || false;
//     // if (!skipTCS && isTDS149QYes) {
//     //   srv_tax = (grandTotal * 2) / 100; // 2%
//     //   srvRate = 2;
//     //   // grandTotal += srv_tax;
//     // }

//     let cTds = 0,
//       sTds = 0,
//       iTds = 0,
//       tcspercentage = "0";
//     const gstNumber = "03";
//     const same = custGst.substring(0, 2);
//     items.forEach((item) => {
//       if (
//         item.tariff &&
//         applicableTariffs.some((tariff) => item.tariff.startsWith(tariff))
//       ) {
//         if (CompanyState == supplierdetails[0].state) {
//           cTds = totalValue * 0.01;
//           sTds = totalValue * 0.01;
//           tcspercentage = "2%";
//         } else {
//           iTds = totalValue * 0.02;
//           tcspercentage = "2%";
//         }
//       }
//     });

//     let totalTds = cTds + sTds + iTds;
//     let expafterGST = tcs206 + tcs1;
//     let originalGrandTotal = grandTotal; // Save the unrounded grandTotal

//     if (T11) {
//       totalValue = Math.round(totalValue);
//       grandTotal = Math.round(grandTotal);
//       totalDis = Math.round(totalDis);
//     }

//     if (T12) {
//       gstTotal = Math.round(gstTotal);
//       cgstTotal = Math.round(cgstTotal);
//       sgstTotal = Math.round(sgstTotal);
//       igstTotal = Math.round(igstTotal);
//       totalOthers = Math.round(totalOthers);
//       expafterGST = Math.round(expafterGST);
//       totalTds = Math.round(totalTds);
//       tcs206 = Math.round(tcs206);
//       srv_tax = Math.round(srv_tax);
//       cTds = Math.round(cTds);
//       sTds = Math.round(sTds);
//       iTds = Math.round(iTds);
//     }
//     // Calculate Round-Off Difference
//     let ExpRoundoff = grandTotal - originalGrandTotal;

//     return {
//       ...formDataOverride,
//       tcsper: tcspercentage,
//       tcs206: tcs206.toFixed(2),
//       tcs206_rate: tcs206Rate.toFixed(2),
//       tcs1: tcs1.toFixed(2),
//       tcs1_rate: tcs1Rate.toFixed(2),
//       srv_tax: srv_tax.toFixed(2),
//       srv_rate: srvRate.toFixed(2),
//       tax: gstTotal.toFixed(2),
//       cgst: cgstTotal.toFixed(2),
//       sgst: sgstTotal.toFixed(2),
//       igst: igstTotal.toFixed(2),
//       sub_total: totalValue.toFixed(2),
//       Tds2: totalTds.toFixed(2),
//       Ctds: cTds.toFixed(2),
//       Stds: sTds.toFixed(2),
//       iTds: iTds.toFixed(2),
//       grandtotal: grandTotal.toFixed(2),
//       exp_before: (totalOthers - totalDis).toFixed(2),
//       expafterGST: (totalExpenses + tcs206 + tcs1).toFixed(2),
//       ExpRoundoff: ExpRoundoff.toFixed(2),
//     };
//   };

//   useEffect(() => {
//     setFormData((prevState) => calculateTotalGst(prevState));
//   }, [items, T11, T12]);

//   // Api Response
//   const [data, setData] = useState([]);
//   const [data1, setData1] = useState([]);
//   const [index, setIndex] = useState(0);
//   const [isAddEnabled, setIsAddEnabled] = useState(true);
//   const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
//   const [isPreviousEnabled, setIsPreviousEnabled] = useState(true);
//   const [isNextEnabled, setIsNextEnabled] = useState(true);
//   const [isFirstEnabled, setIsFirstEnabled] = useState(true);
//   const [isLastEnabled, setIsLastEnabled] = useState(true);
//   const [isSearchEnabled, setIsSearchEnabled] = useState(true);
//   const [isPrintEnabled, setIsSPrintEnabled] = useState(true);
//   const [isDeleteEnabled, setIsDeleteEnabled] = useState(true);
//   const { isEditMode, setIsEditMode } = useEditMode(); // Access the context
//   const [isAbcmode, setIsAbcmode] = useState(false);
//   const [isEditMode2, setIsEditMode2] = useState(false); // State to track edit mode
//   const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
//   const [firstTimeCheckData, setFirstTimeCheckData] = useState("");
//   const [setupFormData, setsetupFormData] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [shouldFocusPrint, setShouldFocusPrint] = useState(false); // 👈 New flag to track
//   const [shouldFocusAdd, setShouldFocusAdd] = useState(false); // 👈 New flag to track
//   // Search Modal states
//   const [showSearch, setShowSearch] = useState(false);
//   const [allBills, setAllBills] = useState([]);
//   const [searchBillNo, setSearchBillNo] = useState("");
//   const [filteredBills, setFilteredBills] = useState([]);
//   const [searchDate, setSearchDate] = useState(null);

//   // state
//   const [isFAModalOpen, setIsFAModalOpen] = useState(false);
  
//   // when user clicks “FA VOUCHER VIEW” inside BillPrintMenu
//   const handleViewFAVoucher = () => {
//     // we need a voucher number for FA — you’re using formData.vno for FA entries
//     if (!formData?.vno) {
//       toast.info("No voucher number found.", { position: "top-center" });
//       return;
//     }
//     setIsFAModalOpen(true);
//   };

//   useEffect(() => {
//     const hasVcode =
//       isEditMode && items.some((item) => String(item.vcode).trim() !== "");
//     setIsSubmitEnabled(hasVcode);
//   }, [items]);

//   const fetchData = async () => {
//     try {
//       let response;
//       if (purId) {
//         console.log(purId);
        
//         response = await axios.get(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegstget/${purId}`
//         );
//       } else {
//         response = await axios.get(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/last`
//         );
//       }
//       // const response = await axios.get(
//       //   `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/last`
//       // );

//       if (response.status === 200 && response.data && response.data.data) {
//         const lastEntry = response.data.data;
//         // Ensure date is valid
//         const isValidDate = (date) => {
//           return !isNaN(Date.parse(date));
//         };

//         // Update form data, use current date if date is invalid or not available
//         const updatedFormData = {
//           ...lastEntry.formData,
//           date: isValidDate(lastEntry.formData.date)
//             ? lastEntry.formData.date
//             : new Date().toLocaleDateString("en-IN"),
//         };

//         setFirstTimeCheckData("DataAvailable");
//         setFormData(updatedFormData);
//         //console.log(updatedFormData, "Formdata2");

//         // Update items and supplier details
//         const updatedItems = lastEntry.items.map((item) => ({
//           ...item,
//         }));
//         const updatedCustomer = lastEntry.supplierdetails.map((item) => ({
//           ...item,
//         }));
//         setItems(updatedItems);
//         setsupplierdetails(updatedCustomer);

//         // Set custGst from the supplier details
//         if (updatedCustomer.length > 0) {
//           setCustgst(updatedCustomer[0].gstno); // Set GST number
//         }

//         // Set data and index
//         setData1({ ...lastEntry, formData: updatedFormData });
//         setIndex(lastEntry.vno);
//         return lastEntry; // ✅ Return this for use in handleAdd
//       } else {
//         setFirstTimeCheckData("DataNotAvailable");
//         //console.log("No data available");
//         initializeEmptyData();
//         return null;
//       }
//     } catch (error) {
//       console.error("Error fetching data", error);
//       initializeEmptyData();
//       return null;
//     }
//   };
//   // Function to initialize empty data
//   const initializeEmptyData = () => {
//     // Default date as current date
//     const emptyFormData = {
//       date: new Date().toLocaleDateString(), // Use today's date
//       vtype: "P",
//       vno: 0,
//       vbillno: 0,
//       exfor: "",
//       trpt: "",
//       p_entry: "",
//       stype: "",
//       btype: "",
//       conv: "",
//       vacode1: "",
//       rem2: "",
//       v_tpt: "",
//       broker: "",
//       srv_rate: 0,
//       srv_tax: 0,
//       tcs1_rate: 0,
//       tcs1: 0,
//       tcs206_rate: 0,
//       tcs206: 0,
//       duedate: "",
//       gr: "",
//       tdson: "",
//       pcess: 0,
//       tax: 0,
//       cess1: 0,
//       cess2: 0,
//       sub_total: 0,
//       exp_before: 0,
//       Exp_rate6: 0,
//       Exp_rate7: 0,
//       Exp_rate8: 0,
//       Exp_rate9: 0,
//       Exp_rate10: 0,
//       Exp6: 0,
//       Exp7: 0,
//       Exp8: 0,
//       Exp9: 0,
//       Exp10: 0,
//       cgst: 0,
//       sgst: 0,
//       igst: 0,
//       expafterGST: 0,
//       grandtotal: 0,
//     };
//     const emptyItems = [
//       {
//         id: 1,
//         vcode: "",
//         sdisc: "",
//         Units: "",
//         pkgs: "",
//         weight: "",
//         rate: 0,
//         amount: 0,
//         disc: "",
//         discount: "",
//         gst: 0,
//         Pcodes01: "",
//         Pcodess: "",
//         Scodes01: "",
//         Scodess: "",
//         Exp_rate1: 0,
//         Exp_rate2: 0,
//         Exp_rate3: 0,
//         Exp_rate4: 0,
//         Exp_rate5: 0,
//         Exp1: 0,
//         Exp2: 0,
//         Exp3: 0,
//         Exp4: 0,
//         Exp5: 0,
//         exp_before: 0,
//         ctax: 0,
//         stax: 0,
//         itax: 0,
//         tariff: "",
//         vamt: 0,
//       },
//     ];
//     const emptysupplier = [
//       {
//         // VcodeSup
//         Vcode: "",
//         vacode: "",
//         gstno: "",
//         pan: "",
//         Add1: "",
//         city: "",
//         state: "",
//         Tcs206c1H: "",
//         TDS194Q: "",
//       },
//     ];
//     // Set the empty data
//     setFormData(emptyFormData);
//     setItems(emptyItems);
//     setsupplierdetails(emptysupplier);
//     setData1({
//       formData: emptyFormData,
//       items: emptyItems,
//       supplierdetails: emptysupplier,
//     }); // Store empty data
//     setIndex(0);
//   };

//   useEffect(() => {
//     fetchData(); // Fetch data when component mounts
//   }, []);

//   // useEffect(() => {
//   //   const handleEsc = (e) => {
//   //     if (e.key === "Escape" && purId && !isEditMode) {
//   //       // ✅ Go back explicitly to LedgerList with state
//   //          navigate( -1, {
//   //         state: {
//   //           rowIndex: location.state?.rowIndex || 0,
//   //           selectedLedger: location.state?.selectedLedger,
//   //           keepModalOpen: true,
//   //         },
//   //       });
//   //     }
//   //   };

//   //   window.addEventListener("keydown", handleEsc);
//   //   return () => window.removeEventListener("keydown", handleEsc);
//   // }, [navigate, purId, location.state]);

//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape" && !isEditMode && purId) {
//         const modalState = JSON.parse(sessionStorage.getItem("trailModalState") || "{}");

//         navigate(-1); // go back
//         setTimeout(() => {
//           // restore modal state after navigation
//           if (modalState.keepModalOpen) {
//             window.dispatchEvent(
//               new CustomEvent("reopenTrailModal", { detail: modalState })
//             );
//           }
//         }, 50);
//       }
//     };

//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, [isEditMode]);

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

//   // Fetch all bills for search
//   const fetchAllBills = async () => {
//     try {
//       const res = await axios.get(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase"
//       );
//       if (Array.isArray(res.data)) {
//         setAllBills(res.data);
//         setFilteredBills(res.data);
//       }
//     } catch (error) {
//       console.error("Error fetching bills", error);
//     }
//   };

//   // Update filtering logic
//   useEffect(() => {
//     let filtered = allBills;

//     // Filter by Bill No if entered
//     if (searchBillNo.trim() !== "") {
//       filtered = filtered.filter((bill) =>
//         bill.formData.vno
//           .toString()
//           .toLowerCase()
//           .includes(searchBillNo.toLowerCase())
//       );
//     }

//     const formatLocalDate = (date) => {
//       const d = new Date(date);
//       if (isNaN(d)) return null; // invalid date
//       const year = d.getFullYear();
//       const month = String(d.getMonth() + 1).padStart(2, "0");
//       const day = String(d.getDate()).padStart(2, "0");
//       return `${year}-${month}-${day}`;
//     };

//     // Filter by Date if selected
//     if (searchDate) {
//         const selected = formatLocalDate(searchDate);

//       if (selected) {
//         filtered = filtered.filter((bill) => {
//           const billDate = formatLocalDate(bill.formData.date);
//           return billDate === selected;
//         });
//       }
//     }

//     setFilteredBills(filtered);
//   }, [searchBillNo, searchDate, allBills]);

//   const handleSelectBill = (bill) => {
//     setFormData(bill.formData);
//     setsupplierdetails(bill.supplierdetails);
//     setItems(bill.items);
//     setShowSearch(false);
//   };

//   const handleNext = async () => {
//     document.body.style.backgroundColor = "white";
//     setTitle("(View)");

//     try {
//       if (data1) {
//         const response = await axios.get(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/${data1._id}/next`
//         );
//         if (response.status === 200 && response.data) {
//           const nextData = response.data.data;
//           setData1(nextData);
//           setIndex(index + 1);
//           setFormData(nextData.formData);

//           // Update items and supplier details
//           const updatedItems = nextData.items.map((item) => ({
//             ...item,
//           }));
//           const updatedCustomer = nextData.supplierdetails.map((item) => ({
//             ...item,
//           }));
//           setItems(updatedItems);
//           setsupplierdetails(updatedCustomer);

//           // Set custGst from the supplier details
//           if (updatedCustomer.length > 0) {
//             setCustgst(updatedCustomer[0].gstno); // Set GST number
//           }

//           setIsDisabled(true);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching next record:", error);
//     }
//   };

//   const handlePrevious = async () => {
//     document.body.style.backgroundColor = "white";
//     setTitle("(View)");

//     try {
//       if (data1) {
//         const response = await axios.get(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/${data1._id}/previous`
//         );
//         if (response.status === 200 && response.data) {
//           const prevData = response.data.data;
//           setData1(prevData);
//           setIndex(index - 1);
//           setFormData(prevData.formData);

//           // Update items and supplier details
//           const updatedItems = prevData.items.map((item) => ({
//             ...item,
//           }));
//           const updatedCustomer = prevData.supplierdetails.map((item) => ({
//             ...item,
//           }));
//           setItems(updatedItems);
//           setsupplierdetails(updatedCustomer);

//           // Set custGst from the supplier details
//           if (updatedCustomer.length > 0) {
//             setCustgst(updatedCustomer[0].gstno); // Set GST number
//           }
//           setIsDisabled(true);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching previous record:", error);
//     }
//   };

//   const handleFirst = async () => {
//     document.body.style.backgroundColor = "white";
//     setTitle("(View)");

//     try {
//       const response = await axios.get(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/first`
//       );
//       if (response.status === 200 && response.data) {
//         const firstData = response.data.data;
//         setData1(firstData);
//         setIndex(0);
//         setFormData(firstData.formData);

//         // Update items and supplier details
//         const updatedItems = firstData.items.map((item) => ({
//           ...item,
//         }));
//         const updatedCustomer = firstData.supplierdetails.map((item) => ({
//           ...item,
//         }));
//         setItems(updatedItems);
//         setsupplierdetails(updatedCustomer);

//         // Set custGst from the supplier details
//         if (updatedCustomer.length > 0) {
//           setCustgst(updatedCustomer[0].gstno); // Set GST number
//         }

//         setIsDisabled(true);
//       }
//     } catch (error) {
//       console.error("Error fetching first record:", error);
//     }
//   };

//   const handleLast = async () => {
//     document.body.style.backgroundColor = "white";
//     setTitle("(View)");

//     try {
//       const response = await axios.get(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/last`
//       );
//       if (response.status === 200 && response.data) {
//         const lastData = response.data.data;
//         setData1(lastData);
//         const lastIndex = response.data.length - 1;
//         setIndex(lastIndex);
//         setFormData(lastData.formData);

//         // Update items and supplier details
//         const updatedItems = lastData.items.map((item) => ({
//           ...item,
//         }));
//         const updatedCustomer = lastData.supplierdetails.map((item) => ({
//           ...item,
//         }));
//         setItems(updatedItems);
//         setsupplierdetails(updatedCustomer);

//         // Set custGst from the supplier details
//         if (updatedCustomer.length > 0) {
//           setCustgst(updatedCustomer[0].gstno); // Set GST number
//         }

//         setIsDisabled(true);
//       }
//     } catch (error) {
//       console.error("Error fetching last record:", error);
//     }
//   };

//   const handleAdd = async () => {
//     try {
//      const lastEntry = await fetchData();
//      const lastvoucherno = lastEntry?.formData?.vno ? parseInt(lastEntry.formData.vno) + 1 : 1;
//       let lastBillno = formData.vbillno ? parseInt(formData.vbillno) + 1 : 1;
//       const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
//       const newData = {
//         date: today,
//         vtype: "P",
//         vno: lastvoucherno,
//         vbillno: "",
//         exfor: "",
//         trpt: "",
//         p_entry: "",
//         stype: "",
//         btype: "",
//         conv: SupplyType,
//         vacode1: "",
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
//         gr: "",
//         tdson: "",
//         pcess: 0,
//         tax: 0,
//         cess1: 0,
//         cess2: 0,
//         sub_total: 0,
//         exp_before: 0,
//         Exp_rate6: ExpRate6 || 0,
//         Exp_rate7: ExpRate7 || 0,
//         Exp_rate8: ExpRate8 || 0,
//         Exp_rate9: ExpRate9 || 0,
//         Exp_rate10: ExpRate10 || 0,
//         Exp6: 0,
//         Exp7: 0,
//         Exp8: 0,
//         Exp9: 0,
//         Exp10: 0,
//         Tds2: "",
//         Ctds: "",
//         Stds: "",
//         iTds: "",
//         cgst: 0,
//         sgst: 0,
//         igst: 0,
//         expafterGST: 0,
//         grandtotal: 0,
//       };
//       setData([...data, newData]);
//       setFormData(newData);
//       setItems([
//         {
//           id: 1,
//           vcode: "",
//           sdisc: "",
//           Units: "",
//           pkgs: 0,
//           weight: 0,
//           rate: 0,
//           amount: 0,
//           disc: "",
//           discount: "",
//           gst: 0,
//           Pcodes01: "",
//           Pcodess: "",
//           Scodes01: "",
//           Scodess: "",
//           Exp_rate1: ExpRate1 || 0,
//           Exp_rate2: ExpRate2 || 0,
//           Exp_rate3: ExpRate3 || 0,
//           Exp_rate4: ExpRate4 || 0,
//           Exp_rate5: ExpRate5 || 0,
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
//         },
//       ]);
//       setsupplierdetails([
//         {
//           // VcodeSup
//           Vcode: "",
//           vacode: "",
//           gstno: "",
//           pan: "",
//           Add1: "",
//           city: "",
//           state: "",
//           Tcs206c1H: "",
//           TDS194Q: "",
//         },
//       ]);
//       setIndex(data.length);
//       setIsAddEnabled(false);
//       setIsSubmitEnabled(true);
//       setIsPreviousEnabled(false);
//       setIsNextEnabled(false);
//       setIsFirstEnabled(false);
//       setIsLastEnabled(false);
//       setIsSearchEnabled(false);
//       setIsSPrintEnabled(false);
//       setIsDeleteEnabled(false);
//       setIsDisabled(false);
//       setIsEditMode(true);
//       setTitle("NEW");
//       if (datePickerRef.current) {
//         datePickerRef.current.setFocus();
//       }
//     } catch (error) {
//       console.error("Error adding new entry:", error);
//     }
//   };

//   const handleEditClick = () => {
//     setTitle("EDIT");
//     setIsDisabled(false);
//     setIsEditMode(true);
//     setIsAddEnabled(false);
//     setIsSubmitEnabled(true);
//     setIsPreviousEnabled(false);
//     setIsNextEnabled(false);
//     setIsFirstEnabled(false);
//     setIsLastEnabled(false);
//     setIsSearchEnabled(false);
//     setIsSPrintEnabled(false);
//     setIsDeleteEnabled(false);
//     setIsAbcmode(true);
//     if (customerNameRef.current) {
//       customerNameRef.current.focus();
//     }
//   };

//   // const handleSaveClick = async () => {
//   //   document.body.style.backgroundColor = "white";
//   //   setIsSubmitEnabled(true); // Ensure submit button is enabled initially
//   //   let isDataSaved = false;

//   //   try {
//   //     // Validation: Check supplierdetails
//   //     const isValid = supplierdetails.every((item) => item.vacode !== "");
//   //     if (!isValid) {
//   //       toast.error("Please Fill the Customer Details", {
//   //         position: "top-center",
//   //       });
//   //       return;
//   //     }

//   //     // Validation: Check at least one item filled
//   //     const nonEmptyItems = items.filter((item) => item.sdisc.trim() !== "");
//   //     if (nonEmptyItems.length === 0) {
//   //       toast.error("Please fill in at least one Items name.", {
//   //         position: "top-center",
//   //       });
//   //       return;
//   //     }

//   //     // ✅ Check for duplicate p_entry only when adding (not editing)
//   //     if (!isAbcmode && formData.p_entry && formData.p_entry !== "0") {
//   //       try {
//   //         const res = await axios.get(
//   //           "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase"
//   //         );
//   //         const allPurchases = res.data || [];

//   //         const duplicate = allPurchases.find(
//   //           (item) => item.formData?.p_entry === formData.p_entry
//   //         );
//   //         if (duplicate) {
//   //           toast.error(`Self Invoice No Already Exists.`, {
//   //             position: "top-center",
//   //           });
//   //           return;
//   //         }
//   //       } catch (fetchError) {
//   //         console.error("Error checking duplicates:", fetchError);
//   //         toast.error("Error checking duplicate p_entry. Please try again.", {
//   //           position: "top-center",
//   //         });
//   //         return;
//   //       }
//   //     }

//   //     // ✅ Prepare combinedData here (use your existing combinedData logic)
//   //     const combinedData = {
//   //       _id: formData._id,
//   //       formData: {
//   //         date: selectedDate.toLocaleDateString("en-IN"),
//   //         vtype: formData.vtype,
//   //         vno: formData.vno,
//   //         vbillno: formData.vbillno,
//   //         exfor: formData.exfor,
//   //         trpt: formData.trpt,
//   //         p_entry: formData.p_entry,
//   //         stype: formData.stype,
//   //         btype: formData.btype,
//   //         conv: formData.conv,
//   //         vacode1: formData.vacode1,
//   //         rem2: formData.rem2,
//   //         v_tpt: formData.v_tpt,
//   //         broker: formData.broker,
//   //         srv_rate: formData.srv_rate,
//   //         srv_tax: formData.srv_tax,
//   //         tcs1_rate: formData.tcs1_rate,
//   //         tcs1: formData.tcs1,
//   //         tcs206_rate: formData.tcs206_rate,
//   //         tcs206: formData.tcs206,
//   //         duedate: expiredDate.toLocaleDateString("en-IN"),
//   //         gr: formData.gr,
//   //         tdson: formData.tdson,
//   //         pcess: formData.pcess,
//   //         tax: formData.tax,
//   //         cess1: formData.cess1,
//   //         cess2: formData.cess2,
//   //         sub_total: formData.sub_total,
//   //         exp_before: formData.exp_before,
//   //         Exp_rate6: formData.Exp_rate6,
//   //         Exp_rate7: formData.Exp_rate7,
//   //         Exp_rate8: formData.Exp_rate8,
//   //         Exp_rate9: formData.Exp_rate9,
//   //         Exp_rate10: formData.Exp_rate10,
//   //         Exp6: formData.Exp6,
//   //         Exp7: formData.Exp7,
//   //         Exp8: formData.Exp8,
//   //         Exp9: formData.Exp9,
//   //         Exp10: formData.Exp10,
//   //         Tds2: formData.Tds2,
//   //         Ctds: formData.Ctds,
//   //         Stds: formData.Stds,
//   //         iTds: formData.iTds,
//   //         cgst: formData.cgst,
//   //         sgst: formData.sgst,
//   //         igst: formData.igst,
//   //         expafterGST: formData.expafterGST,
//   //         ExpRoundoff: formData.ExpRoundoff,
//   //         grandtotal: formData.grandtotal,
//   //       },
//   //       items: nonEmptyItems.map((item) => ({
//   //         id: item.id,
//   //         vcode: item.vcode,
//   //         sdisc: item.sdisc,
//   //         Units: item.Units,
//   //         pkgs: item.pkgs,
//   //         weight: item.weight,
//   //         rate: item.rate,
//   //         amount: item.amount,
//   //         disc: item.disc,
//   //         discount: item.discount,
//   //         gst: item.gst,
//   //         Pcodess: item.Pcodess,
//   //         Pcodes01: item.Pcodes01,
//   //         Scodess: item.Scodess,
//   //         Scodes01: item.Scodes01,
//   //         exp_before: item.exp_before,
//   //         Exp_rate1: item.Exp_rate1,
//   //         Exp_rate2: item.Exp_rate2,
//   //         Exp_rate3: item.Exp_rate3,
//   //         Exp_rate4: item.Exp_rate4,
//   //         Exp_rate5: item.Exp_rate5,
//   //         Exp1: item.Exp1,
//   //         Exp2: item.Exp2,
//   //         Exp3: item.Exp3,
//   //         Exp4: item.Exp4,
//   //         Exp5: item.Exp5,
//   //         ctax: item.ctax,
//   //         stax: item.stax,
//   //         itax: item.itax,
//   //         tariff: item.tariff,
//   //         vamt: item.vamt,
//   //       })),
//   //       supplierdetails: supplierdetails.map((item) => ({
//   //         Vcode: item.Vcode,
//   //         vacode: item.vacode,
//   //         gstno: item.gstno,
//   //         pan: item.pan,
//   //         Add1: item.Add1,
//   //         city: item.city,
//   //         state: item.state,
//   //         Tcs206c1H: item.Tcs206c1H,
//   //         TDS194Q: item.TDS194Q,
//   //       })),
//   //     };

//   //     const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst${
//   //       isAbcmode ? `/${data1._id}` : ""
//   //     }`;
//   //     const method = isAbcmode ? "put" : "post";

//   //     const response = await axios({
//   //       method,
//   //       url: apiEndpoint,
//   //       data: combinedData,
//   //     });
//   //     if (response.status === 200 || response.status === 201) {
//   //       fetchData();
//   //       isDataSaved = true;
//   //     }
//   //   } catch (error) {
//   //     console.error("Error saving data:", error);
//   //     toast.error("Failed to save data. Please try again.", {
//   //       position: "top-center",
//   //     });
//   //   } finally {
//   //     setIsSubmitEnabled(!isDataSaved); // disable if saved, keep enabled if error/duplicate
//   //     if (isDataSaved) {
//   //       setTitle("View");
//   //       setIsAddEnabled(true);
//   //       setIsDisabled(true);
//   //       setIsEditMode(false);
//   //       setIsPreviousEnabled(true);
//   //       setIsNextEnabled(true);
//   //       setIsFirstEnabled(true);
//   //       setIsLastEnabled(true);
//   //       setIsSPrintEnabled(true);
//   //       setIsSearchEnabled(true);
//   //       setIsDeleteEnabled(true);
//   //       toast.success("Data Saved Successfully!", { position: "top-center" });
//   //       if (Defaultbutton === "Print") {
//   //         setShouldFocusPrint(true); // 👈 Signal that we should focus after enable
//   //       } else if (Defaultbutton === "Add") {
//   //         setShouldFocusAdd(true)
//   //       }
//   //     } else {
//   //       setIsAddEnabled(false);
//   //       setIsDisabled(false);
//   //     }
//   //   }
//   // };
  
//   // const handleSaveClickwithSetup = async () => {
//   //   document.body.style.backgroundColor = "white";
//   //   setIsSubmitEnabled(true); // Ensure submit button is enabled initially
//   //   let isDataSaved = false;

//   //   try {
//   //     // Validation: Check supplierdetails
//   //     const isValid = supplierdetails.every((item) => item.vacode !== "");
//   //     if (!isValid) {
//   //       toast.error("Please Fill the Customer Details", {
//   //         position: "top-center",
//   //       });
//   //       return;
//   //     }

//   //     // Validation: Check at least one item filled
//   //     const nonEmptyItems = items.filter((item) => item.sdisc.trim() !== "");
//   //     if (nonEmptyItems.length === 0) {
//   //       toast.error("Please fill in at least one Items name.", {
//   //         position: "top-center",
//   //       });
//   //       return;
//   //     }

//   //     // ✅ Check for duplicate p_entry only when adding (not editing)
//   //     if (!isAbcmode && formData.p_entry && formData.p_entry !== "0") {
//   //       try {
//   //         const res = await axios.get(
//   //           "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase"
//   //         );
//   //         const allPurchases = res.data || [];

//   //         const duplicate = allPurchases.find(
//   //           (item) => item.formData?.p_entry === formData.p_entry
//   //         );
//   //         if (duplicate) {
//   //           toast.error(`Self Invoice No Already Exists.`, {
//   //             position: "top-center",
//   //           });
//   //           return;
//   //         }
//   //       } catch (fetchError) {
//   //         console.error("Error checking duplicates:", fetchError);
//   //         toast.error("Error checking duplicate p_entry. Please try again.", {
//   //           position: "top-center",
//   //         });
//   //         return;
//   //       }
//   //     }

//   //     // ✅ Prepare combinedData here (use your existing combinedData logic)
//   //     const combinedData = {
//   //       _id: formData._id,
//   //       formData: {
//   //         date: selectedDate.toLocaleDateString("en-IN"),
//   //         vtype: formData.vtype,
//   //         vno: formData.vno,
//   //         vbillno: formData.vbillno,
//   //         exfor: formData.exfor,
//   //         trpt: formData.trpt,
//   //         p_entry: formData.p_entry,
//   //         stype: formData.stype,
//   //         btype: formData.btype,
//   //         conv: formData.conv,
//   //         vacode1: formData.vacode1,
//   //         rem2: formData.rem2,
//   //         v_tpt: formData.v_tpt,
//   //         broker: formData.broker,
//   //         srv_rate: formData.srv_rate,
//   //         srv_tax: formData.srv_tax,
//   //         tcs1_rate: formData.tcs1_rate,
//   //         tcs1: formData.tcs1,
//   //         tcs206_rate: formData.tcs206_rate,
//   //         tcs206: formData.tcs206,
//   //         duedate: expiredDate.toLocaleDateString("en-IN"),
//   //         gr: formData.gr,
//   //         tdson: formData.tdson,
//   //         pcess: formData.pcess,
//   //         tax: formData.tax,
//   //         cess1: formData.cess1,
//   //         cess2: formData.cess2,
//   //         sub_total: formData.sub_total,
//   //         exp_before: formData.exp_before,
//   //         Exp_rate6: formData.Exp_rate6,
//   //         Exp_rate7: formData.Exp_rate7,
//   //         Exp_rate8: formData.Exp_rate8,
//   //         Exp_rate9: formData.Exp_rate9,
//   //         Exp_rate10: formData.Exp_rate10,
//   //         Exp6: formData.Exp6,
//   //         Exp7: formData.Exp7,
//   //         Exp8: formData.Exp8,
//   //         Exp9: formData.Exp9,
//   //         Exp10: formData.Exp10,
//   //         Tds2: formData.Tds2,
//   //         Ctds: formData.Ctds,
//   //         Stds: formData.Stds,
//   //         iTds: formData.iTds,
//   //         cgst: formData.cgst,
//   //         sgst: formData.sgst,
//   //         igst: formData.igst,
//   //         expafterGST: formData.expafterGST,
//   //         ExpRoundoff: formData.ExpRoundoff,
//   //         grandtotal: formData.grandtotal,

//   //         // Setting Purchase Setup Accounts 
//   //         cgst_ac: setupFormData.cgst_ac,
//   //         cgst_code: setupFormData.cgst_code,
//   //         cgst_ac1: setupFormData.cgst_ac1,
//   //         cgst_code1: setupFormData.cgst_code1,
//   //         cgst_ac2: setupFormData.cgst_ac2,
//   //         cgst_code2: setupFormData.cgst_code2,

//   //         sgst_ac: setupFormData.sgst_ac,
//   //         sgst_code: setupFormData.sgst_code,
//   //         sgst_ac1: setupFormData.sgst_ac1,
//   //         sgst_code1: setupFormData.sgst_code1,
//   //         sgst_ac2: setupFormData.sgst_ac2,
//   //         sgst_code2: setupFormData.sgst_code2,

//   //         igst_ac: setupFormData.igst_ac,
//   //         igst_code: setupFormData.igst_code,
//   //         igst_ac1: setupFormData.igst_ac1,
//   //         igst_code1: setupFormData.igst_code1,
//   //         igst_ac2: setupFormData.igst_ac1,
//   //         igst_code2: setupFormData.igst_code1,

//   //         Adcode : setupFormData.Adcode,
//   //         Ad_ac : setupFormData.Ad_ac,

//   //         cesscode : setupFormData.cesscode,
//   //         cessAc : setupFormData.cessAc,

//   //         tds_code: setupFormData.tds_code,
//   //         tds_ac: setupFormData.tds_ac,

//   //         tcs_code: setupFormData.tcs_code,
//   //         tcs_ac: setupFormData.tcs_ac,
//   //         tcs206code:  setupFormData.tcs206code,
//   //         tcs206ac: setupFormData.tcs206ac,
//   //         discount_code:  setupFormData.discount_code,
//   //         discount_ac: setupFormData.discount_code,

//   //         expense1_code: setupFormData.E1Code,
//   //         expense1_ac: setupFormData.E1name,

//   //         expense2_code: setupFormData.E2Code,
//   //         expense2_ac: setupFormData.E2name,

//   //         expense3_code: setupFormData.E3Code,
//   //         expense3_ac: setupFormData.E3name,

//   //         expense4_code: setupFormData.E4Code,
//   //         expense4_ac: setupFormData.E4name,

//   //         expense5_code: setupFormData.E5Code,
//   //         expense5_ac: setupFormData.E5name,

//   //         expense6_code: setupFormData.E6Code,
//   //         expense6_ac: setupFormData.E6name,

//   //         expense7_code: setupFormData.E7Code,
//   //         expense7_ac: setupFormData.E7name,

//   //         expense8_code: setupFormData.E8Code,
//   //         expense8_ac: setupFormData.E8name,

//   //         expense9_code: setupFormData.E9Code,
//   //         expense9_ac: setupFormData.E9name,
          
//   //         expense10_code: setupFormData.E10Code,
//   //         expense10_ac: setupFormData.E10name,
//   //       },
//   //       items: nonEmptyItems.map((item) => ({
//   //         id: item.id,
//   //         vcode: item.vcode,
//   //         sdisc: item.sdisc,
//   //         Units: item.Units,
//   //         pkgs: item.pkgs,
//   //         weight: item.weight,
//   //         rate: item.rate,
//   //         amount: item.amount,
//   //         disc: item.disc,
//   //         discount: item.discount,
//   //         gst: item.gst,
//   //         Pcodess: item.Pcodess,
//   //         Pcodes01: item.Pcodes01,
//   //         Scodess: item.Scodess,
//   //         Scodes01: item.Scodes01,
//   //         exp_before: item.exp_before,
//   //         Exp_rate1: item.Exp_rate1,
//   //         Exp_rate2: item.Exp_rate2,
//   //         Exp_rate3: item.Exp_rate3,
//   //         Exp_rate4: item.Exp_rate4,
//   //         Exp_rate5: item.Exp_rate5,
//   //         Exp1: item.Exp1,
//   //         Exp2: item.Exp2,
//   //         Exp3: item.Exp3,
//   //         Exp4: item.Exp4,
//   //         Exp5: item.Exp5,
//   //         ctax: item.ctax,
//   //         stax: item.stax,
//   //         itax: item.itax,
//   //         tariff: item.tariff,
//   //         vamt: item.vamt,
//   //       })),
//   //       supplierdetails: supplierdetails.map((item) => ({
//   //         Vcode: item.Vcode,
//   //         vacode: item.vacode,
//   //         gstno: item.gstno,
//   //         pan: item.pan,
//   //         Add1: item.Add1,
//   //         city: item.city,
//   //         state: item.state,
//   //         Tcs206c1H: item.Tcs206c1H,
//   //         TDS194Q: item.TDS194Q,
//   //       })),
//   //     };

//   //     const apiEndpoint = `http://192.168.1.9:3012/03AEZFS6485G1BA_02072025_02072026/tenant/purchasefaFile${
//   //       isAbcmode ? `/${data1._id}` : ""
//   //     }`;
//   //     const method = isAbcmode ? "put" : "post";

//   //     const response = await axios({
//   //       method,
//   //       url: apiEndpoint,
//   //       data: combinedData,
//   //     });
//   //     if (response.status === 200 || response.status === 201) {
//   //       fetchData();
//   //       isDataSaved = true;
//   //     }
//   //   } catch (error) {
//   //     console.error("Error saving data:", error);
//   //     toast.error("Failed to save FA File. Please try again.", {
//   //       position: "top-center",
//   //     });
//   //   } finally {
//   //     setIsSubmitEnabled(!isDataSaved); // disable if saved, keep enabled if error/duplicate
//   //     if (isDataSaved) {
//   //       setTitle("View");
//   //       setIsAddEnabled(true);
//   //       setIsDisabled(true);
//   //       setIsEditMode(false);
//   //       setIsPreviousEnabled(true);
//   //       setIsNextEnabled(true);
//   //       setIsFirstEnabled(true);
//   //       setIsLastEnabled(true);
//   //       setIsSPrintEnabled(true);
//   //       setIsSearchEnabled(true);
//   //       setIsDeleteEnabled(true);
//   //       if (Defaultbutton === "Print") {
//   //         setShouldFocusPrint(true); // 👈 Signal that we should focus after enable
//   //       } else if (Defaultbutton === "Add") {
//   //         setShouldFocusAdd(true)
//   //       }
//   //     } else {
//   //       setIsAddEnabled(false);
//   //       setIsDisabled(false);
//   //     }
//   //   }
//   // };
  

//   // const handleSaveClick = async () => {
//   //   document.body.style.backgroundColor = "white";
//   //   setIsSubmitEnabled(true);
//   //   let isDataSaved = false;
  
//   //   try {
//   //     // Validation: Check supplierdetails
//   //     const isValid = supplierdetails.every((item) => item.vacode !== "");
//   //     if (!isValid) {
//   //       toast.error("Please Fill the Customer Details", { position: "top-center" });
//   //       return;
//   //     }
  
//   //     // Validation: At least one item filled
//   //     const nonEmptyItems = items.filter((item) => item.sdisc.trim() !== "");
//   //     if (nonEmptyItems.length === 0) {
//   //       toast.error("Please fill in at least one Items name.", { position: "top-center" });
//   //       return;
//   //     }
  
      

//   //     if (!isAbcmode && formData.p_entry && formData.p_entry !== "0") {
//   //       try {
//   //         const { data } = await axios.get(
//   //           `https://www.shkunweb.com/${tenant}/tenant/api/purchase/check`,
//   //           { params: { p_entry: String(formData.p_entry).trim() } }
//   //         );
      
//   //         if (data.exists) {
//   //           toast.error("Self Invoice No Already Exists.", { position: "top-center" });
//   //           return;
//   //         }
//   //       } catch (fetchError) {
//   //         console.error("Error checking duplicates:", fetchError);
//   //         toast.error("Error checking duplicate p_entry. Please try again.", { position: "top-center" });
//   //         return;
//   //       }
//   //     }
      
//   //     // Prepare combinedData
//   //     const combinedData = {
//   //       _id: formData._id,
//   //       formData: {
//   //         date: selectedDate.toLocaleDateString("en-IN"),
//   //         vtype: formData.vtype,
//   //         vno: formData.vno,
//   //         vbillno: formData.vbillno,
//   //         exfor: formData.exfor,
//   //         trpt: formData.trpt,
//   //         p_entry: formData.p_entry,
//   //         stype: formData.stype,
//   //         btype: formData.btype,
//   //         conv: formData.conv,
//   //         vacode1: formData.vacode1,
//   //         rem2: formData.rem2,
//   //         v_tpt: formData.v_tpt,
//   //         broker: formData.broker,
//   //         srv_rate: formData.srv_rate,
//   //         srv_tax: formData.srv_tax,
//   //         tcs1_rate: formData.tcs1_rate,
//   //         tcs1: formData.tcs1,
//   //         tcs206_rate: formData.tcs206_rate,
//   //         tcs206: formData.tcs206,
//   //         duedate: expiredDate.toLocaleDateString("en-IN"),
//   //         gr: formData.gr,
//   //         tdson: formData.tdson,
//   //         pcess: formData.pcess,
//   //         tax: formData.tax,
//   //         cess1: formData.cess1,
//   //         cess2: formData.cess2,
//   //         sub_total: formData.sub_total,
//   //         exp_before: formData.exp_before,
//   //         Exp_rate6: formData.Exp_rate6,
//   //         Exp_rate7: formData.Exp_rate7,
//   //         Exp_rate8: formData.Exp_rate8,
//   //         Exp_rate9: formData.Exp_rate9,
//   //         Exp_rate10: formData.Exp_rate10,
//   //         Exp6: formData.Exp6,
//   //         Exp7: formData.Exp7,
//   //         Exp8: formData.Exp8,
//   //         Exp9: formData.Exp9,
//   //         Exp10: formData.Exp10,
//   //         Tds2: formData.Tds2,
//   //         Ctds: formData.Ctds,
//   //         Stds: formData.Stds,
//   //         iTds: formData.iTds,
//   //         cgst: formData.cgst,
//   //         sgst: formData.sgst,
//   //         igst: formData.igst,
//   //         expafterGST: formData.expafterGST,
//   //         ExpRoundoff: formData.ExpRoundoff,
//   //         grandtotal: formData.grandtotal,

//   //         // Setting Purchase Setup Accounts 
//   //         cgst_ac: setupFormData.cgst_ac,
//   //         cgst_code: setupFormData.cgst_code,
//   //         cgst_ac1: setupFormData.cgst_ac1,
//   //         cgst_code1: setupFormData.cgst_code1,
//   //         cgst_ac2: setupFormData.cgst_ac2,
//   //         cgst_code2: setupFormData.cgst_code2,

//   //         sgst_ac: setupFormData.sgst_ac,
//   //         sgst_code: setupFormData.sgst_code,
//   //         sgst_ac1: setupFormData.sgst_ac1,
//   //         sgst_code1: setupFormData.sgst_code1,
//   //         sgst_ac2: setupFormData.sgst_ac2,
//   //         sgst_code2: setupFormData.sgst_code2,

//   //         igst_ac: setupFormData.igst_ac,
//   //         igst_code: setupFormData.igst_code,
//   //         igst_ac1: setupFormData.igst_ac1,
//   //         igst_code1: setupFormData.igst_code1,
//   //         igst_ac2: setupFormData.igst_ac1,
//   //         igst_code2: setupFormData.igst_code1,

//   //         Adcode : setupFormData.Adcode,
//   //         Ad_ac : setupFormData.Ad_ac,

//   //         cesscode : setupFormData.cesscode,
//   //         cessAc : setupFormData.cessAc,

//   //         tds_code: setupFormData.tds_code,
//   //         tds_ac: setupFormData.tds_ac,

//   //         tcs_code: setupFormData.tcs_code,
//   //         tcs_ac: setupFormData.tcs_ac,
//   //         tcs206code:  setupFormData.tcs206code,
//   //         tcs206ac: setupFormData.tcs206ac,
//   //         discount_code:  setupFormData.discount_code,
//   //         discount_ac: setupFormData.discount_code,

//   //         expense1_code: setupFormData.E1Code,
//   //         expense1_ac: setupFormData.E1name,

//   //         expense2_code: setupFormData.E2Code,
//   //         expense2_ac: setupFormData.E2name,

//   //         expense3_code: setupFormData.E3Code,
//   //         expense3_ac: setupFormData.E3name,

//   //         expense4_code: setupFormData.E4Code,
//   //         expense4_ac: setupFormData.E4name,

//   //         expense5_code: setupFormData.E5Code,
//   //         expense5_ac: setupFormData.E5name,

//   //         expense6_code: setupFormData.E6Code,
//   //         expense6_ac: setupFormData.E6name,

//   //         expense7_code: setupFormData.E7Code,
//   //         expense7_ac: setupFormData.E7name,

//   //         expense8_code: setupFormData.E8Code,
//   //         expense8_ac: setupFormData.E8name,

//   //         expense9_code: setupFormData.E9Code,
//   //         expense9_ac: setupFormData.E9name,
          
//   //         expense10_code: setupFormData.E10Code,
//   //         expense10_ac: setupFormData.E10name,
//   //       },
//   //       items: nonEmptyItems.map((item) => ({
//   //         id: item.id,
//   //         vcode: item.vcode,
//   //         sdisc: item.sdisc,
//   //         Units: item.Units,
//   //         pkgs: item.pkgs,
//   //         weight: item.weight,
//   //         rate: item.rate,
//   //         amount: item.amount,
//   //         disc: item.disc,
//   //         discount: item.discount,
//   //         gst: item.gst,
//   //         Pcodess: item.Pcodess,
//   //         Pcodes01: item.Pcodes01,
//   //         Scodess: item.Scodess,
//   //         Scodes01: item.Scodes01,
//   //         exp_before: item.exp_before,
//   //         Exp_rate1: item.Exp_rate1,
//   //         Exp_rate2: item.Exp_rate2,
//   //         Exp_rate3: item.Exp_rate3,
//   //         Exp_rate4: item.Exp_rate4,
//   //         Exp_rate5: item.Exp_rate5,
//   //         Exp1: item.Exp1,
//   //         Exp2: item.Exp2,
//   //         Exp3: item.Exp3,
//   //         Exp4: item.Exp4,
//   //         Exp5: item.Exp5,
//   //         ctax: item.ctax,
//   //         stax: item.stax,
//   //         itax: item.itax,
//   //         tariff: item.tariff,
//   //         vamt: item.vamt,
//   //       })),
//   //       supplierdetails: supplierdetails.map((item) => ({
//   //         Vcode: item.Vcode,
//   //         vacode: item.vacode,
//   //         gstno: item.gstno,
//   //         pan: item.pan,
//   //         Add1: item.Add1,
//   //         city: item.city,
//   //         state: item.state,
//   //         Tcs206c1H: item.Tcs206c1H,
//   //         TDS194Q: item.TDS194Q,
//   //       })),
//   //     };
  
//   //     const apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchasegstsave${isAbcmode ? `/${data1._id}` : ""}`;
//   //     const method = isAbcmode ? "put" : "post";
  
//   //     const response = await axios({
//   //       method,
//   //       url: apiEndpoint,
//   //       data: combinedData,
//   //     });
//   //     console.log(response);
  
    
//   //     if (response.status === 200 || response.status === 201) {
//   //       // 1️⃣ Purchase saved: now update stock (use your purchase endpoint)
//   //       await axios.post(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/stock/update`, {
//   //         items: nonEmptyItems.map(item => ({
//   //           vcode: item.vcode,
//   //           sdisc: item.sdisc,
//   //           weight: Number(item.weight) || 0,
//   //           pkgs: Number(item.pkgs) || 0,
//   //         }))
//   //       });
      
//   //       // 2️⃣ Post FA entries ONLY AFTER PurchaseGst success
//   //       try {
//   //         await axios.post(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchasefaFile`, {
//   //           formData: combinedData.formData,
//   //           items: combinedData.items,
//   //           supplierdetails: combinedData.supplierdetails,
//   //         });
//   //       } catch (faErr) {
//   //         console.error("purchasefaFile error:", faErr);
//   //         // Don't fail the whole save; just inform
//   //         toast.warn(
//   //           "Purchase saved & stock updated, but FA posting failed. Try 'Post to FA' later.",
//   //           { position: "top-center" }
//   //         );
//   //       }
      
//   //       fetchData();
//   //       isDataSaved = true;
//   //     }
      
//   //   } catch (error) {
//   //     console.error("Error saving data:", error);
//   //     toast.error("Failed to save data. Please try again.", { position: "top-center" });
//   //   } finally {
//   //     setIsSubmitEnabled(!isDataSaved);
//   //     if (isDataSaved) {
//   //       setTitle("View");
//   //       setIsAddEnabled(true);
//   //       setIsDisabled(true);
//   //       setIsEditMode(false);
//   //       setIsPreviousEnabled(true);
//   //       setIsNextEnabled(true);
//   //       setIsFirstEnabled(true);
//   //       setIsLastEnabled(true);
//   //       setIsSPrintEnabled(true);
//   //       setIsSearchEnabled(true);
//   //       setIsDeleteEnabled(true);
//   //       toast.success("Data Saved Successfully!", { position: "top-center" });
//   //       if (Defaultbutton === "Print") {
//   //         setShouldFocusPrint(true);
//   //       } else if (Defaultbutton === "Add") {
//   //         setShouldFocusAdd(true);
//   //       }
//   //     } else {
//   //       setIsAddEnabled(false);
//   //       setIsDisabled(false);
//   //     }
//   //   }
//   // };

//   // upp
  
//   // const handleSaveClick = async () => {
//   //   document.body.style.backgroundColor = "white";
//   //   setIsSubmitEnabled(true);
//   //   let isDataSaved = false;

//   //   try {
//   //     // --- 1) VALIDATIONS ---------------------------------------------------
//   //     const isValid = supplierdetails.every((item) => (item.vacode || "") !== "");
//   //     if (!isValid) {
//   //       toast.error("Please Fill the Customer Details", { position: "top-center" });
//   //       return;
//   //     }

//   //     const nonEmptyItems = items.filter((item) => (item.sdisc || "").trim() !== "");
//   //     if (nonEmptyItems.length === 0) {
//   //       toast.error("Please fill in at least one Items name.", { position: "top-center" });
//   //       return;
//   //     }

//   //     if (!isAbcmode && formData.p_entry && formData.p_entry !== "0") {
//   //       try {
//   //         const { data } = await axios.get(
//   //           `https://www.shkunweb.com/${tenant}/tenant/api/purchase/check`,
//   //           { params: { p_entry: String(formData.p_entry).trim() } }
//   //         );
//   //         if (data.exists) {
//   //           toast.error("Self Invoice No Already Exists.", { position: "top-center" });
//   //           return;
//   //         }
//   //       } catch (fetchError) {
//   //         console.error("Error checking duplicates:", fetchError);
//   //         toast.error("Error checking duplicate p_entry. Please try again.", { position: "top-center" });
//   //         return;
//   //       }
//   //     }

//   //     // --- 2) BUILD PAYLOAD -------------------------------------------------
//   //     const combinedData = {
//   //       _id: formData._id,
//   //       formData: {
//   //         date: selectedDate.toLocaleDateString("en-IN"),
//   //         vtype: formData.vtype,
//   //         vno: formData.vno,
//   //         vbillno: formData.vbillno,
//   //         exfor: formData.exfor,
//   //         trpt: formData.trpt,
//   //         p_entry: formData.p_entry,
//   //         stype: formData.stype,
//   //         btype: formData.btype,
//   //         conv: formData.conv,
//   //         vacode1: formData.vacode1,
//   //         rem2: formData.rem2,
//   //         v_tpt: formData.v_tpt,
//   //         broker: formData.broker,
//   //         srv_rate: formData.srv_rate,
//   //         srv_tax: formData.srv_tax,
//   //         tcs1_rate: formData.tcs1_rate,
//   //         tcs1: formData.tcs1,
//   //         tcs206_rate: formData.tcs206_rate,
//   //         tcs206: formData.tcs206,
//   //         duedate: expiredDate.toLocaleDateString("en-IN"),
//   //         gr: formData.gr,
//   //         tdson: formData.tdson,
//   //         pcess: formData.pcess,
//   //         tax: formData.tax,
//   //         cess1: formData.cess1,
//   //         cess2: formData.cess2,
//   //         sub_total: formData.sub_total,
//   //         exp_before: formData.exp_before,
//   //         Exp_rate6: formData.Exp_rate6,
//   //         Exp_rate7: formData.Exp_rate7,
//   //         Exp_rate8: formData.Exp_rate8,
//   //         Exp_rate9: formData.Exp_rate9,
//   //         Exp_rate10: formData.Exp_rate10,
//   //         Exp6: formData.Exp6,
//   //         Exp7: formData.Exp7,
//   //         Exp8: formData.Exp8,
//   //         Exp9: formData.Exp9,
//   //         Exp10: formData.Exp10,
//   //         Tds2: formData.Tds2,
//   //         Ctds: formData.Ctds,
//   //         Stds: formData.Stds,
//   //         iTds: formData.iTds,
//   //         cgst: formData.cgst,
//   //         sgst: formData.sgst,
//   //         igst: formData.igst,
//   //         expafterGST: formData.expafterGST,
//   //         ExpRoundoff: formData.ExpRoundoff,
//   //         grandtotal: formData.grandtotal,

//   //         // ---- Setup (Purchase) accounts
//   //         cgst_ac:  setupFormData.cgst_ac,
//   //         cgst_code: setupFormData.cgst_code,
//   //         cgst_ac1: setupFormData.cgst_ac1,
//   //         cgst_code1: setupFormData.cgst_code1,
//   //         cgst_ac2: setupFormData.cgst_ac2,
//   //         cgst_code2: setupFormData.cgst_code2,

//   //         sgst_ac:  setupFormData.sgst_ac,
//   //         sgst_code: setupFormData.sgst_code,
//   //         sgst_ac1: setupFormData.sgst_ac1,
//   //         sgst_code1: setupFormData.sgst_code1,
//   //         sgst_ac2: setupFormData.sgst_ac2,
//   //         sgst_code2: setupFormData.sgst_code2,

//   //         igst_ac:  setupFormData.igst_ac,
//   //         igst_code: setupFormData.igst_code,
//   //         igst_ac1: setupFormData.igst_ac1,
//   //         igst_code1: setupFormData.igst_code1,
//   //         igst_ac2: setupFormData.igst_ac1,   // (kept as you had)
//   //         igst_code2: setupFormData.igst_code1,

//   //         Adcode: setupFormData.Adcode,
//   //         Ad_ac:  setupFormData.Ad_ac,

//   //         cesscode: setupFormData.cesscode,
//   //         cessAc:   setupFormData.cessAc,

//   //         tds_code: setupFormData.tds_code,
//   //         tds_ac:   setupFormData.tds_ac,

//   //         tcs_code:   setupFormData.tcs_code,
//   //         tcs_ac:     setupFormData.tcs_ac,
//   //         tcs206code: setupFormData.tcs206code,
//   //         tcs206ac:   setupFormData.tcs206ac,

//   //         discount_code: setupFormData.discount_code,
//   //         discount_ac:   setupFormData.discount_code, // (kept as you had)

//   //         // TDS ACCOUNTS
//   //         cTds_code: setupFormData.cTds_code,
//   //         cTds_ac: setupFormData.cTds_ac,
//   //         sTds_code: setupFormData.sTds_code,
//   //         sTds_ac: setupFormData.sTds_ac,
//   //         iTds_code: setupFormData.iTds_code,
//   //         iTds_ac: setupFormData.iTds_ac,

//   //         expense1_code: setupFormData.E1Code,  expense1_ac: setupFormData.E1name,
//   //         expense2_code: setupFormData.E2Code,  expense2_ac: setupFormData.E2name,
//   //         expense3_code: setupFormData.E3Code,  expense3_ac: setupFormData.E3name,
//   //         expense4_code: setupFormData.E4Code,  expense4_ac: setupFormData.E4name,
//   //         expense5_code: setupFormData.E5Code,  expense5_ac: setupFormData.E5name,
//   //         expense6_code: setupFormData.E6Code,  expense6_ac: setupFormData.E6name,
//   //         expense7_code: setupFormData.E7Code,  expense7_ac: setupFormData.E7name,
//   //         expense8_code: setupFormData.E8Code,  expense8_ac: setupFormData.E8name,
//   //         expense9_code: setupFormData.E9Code,  expense9_ac: setupFormData.E9name,
//   //         expense10_code: setupFormData.E10Code, expense10_ac: setupFormData.E10name,
//   //       },
//   //       items: nonEmptyItems.map((item) => ({
//   //         id: item.id,
//   //         vcode: item.vcode,
//   //         sdisc: item.sdisc,
//   //         Units: item.Units,
//   //         pkgs: item.pkgs,
//   //         weight: item.weight,
//   //         rate: item.rate,
//   //         amount: item.amount,
//   //         disc: item.disc,
//   //         discount: item.discount,
//   //         gst: item.gst,
//   //         Pcodess: item.Pcodess,
//   //         Pcodes01: item.Pcodes01,
//   //         Scodess: item.Scodess,
//   //         Scodes01: item.Scodes01,
//   //         exp_before: item.exp_before,
//   //         Exp_rate1: item.Exp_rate1,
//   //         Exp_rate2: item.Exp_rate2,
//   //         Exp_rate3: item.Exp_rate3,
//   //         Exp_rate4: item.Exp_rate4,
//   //         Exp_rate5: item.Exp_rate5,
//   //         Exp1: item.Exp1,
//   //         Exp2: item.Exp2,
//   //         Exp3: item.Exp3,
//   //         Exp4: item.Exp4,
//   //         Exp5: item.Exp5,
//   //         ctax: item.ctax,
//   //         stax: item.stax,
//   //         itax: item.itax,
//   //         tariff: item.tariff,
//   //         vamt: item.vamt,
//   //       })),
//   //       supplierdetails: supplierdetails.map((item) => ({
//   //         Vcode: item.Vcode,
//   //         vacode: item.vacode,
//   //         gstno: item.gstno,
//   //         pan: item.pan,
//   //         Add1: item.Add1,
//   //         city: item.city,
//   //         state: item.state,
//   //         Tcs206c1H: item.Tcs206c1H,
//   //         TDS194Q: item.TDS194Q,
//   //       })),
//   //     };

//   //     // --- 3) SAVE PURCHASE GST --------------------------------------------
//   //     const apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchasegstsave${isAbcmode ? `/${data1._id}` : ""}`
//   //     const method = isAbcmode ? "put" : "post";

//   //     const response = await axios({ method, url: apiEndpoint, data: combinedData });
//   //     console.log(response);

//   //     // Extract the new/updated PurchaseGst id
//   //     const purchaseId =
//   //       response?.data?.purchaseId ||   // preferred (from backend create)
//   //       response?.data?._id ||          // legacy (if PUT returns doc)
//   //       (isAbcmode ? data1?._id : null);

//   //     if (!purchaseId) {
//   //       console.warn("purchaseId not found in /purchasegstsave response. Ensure backend returns { ok: true, purchaseId }.");
//   //     }

//   //     if (response.status === 200 || response.status === 201) {
//   //       // --- 4) UPDATE STOCK (purchase -> add) ------------------------------
//   //       try {
//   //         await axios.post(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/stock/update`, {
//   //           items: nonEmptyItems.map(item => ({
//   //             vcode: item.vcode,
//   //             sdisc: item.sdisc,
//   //             weight: Number(item.weight) || 0,
//   //             pkgs: Number(item.pkgs) || 0,
//   //           }))
//   //         });
//   //       } catch (stkErr) {
//   //         console.error("Stock update error:", stkErr);
//   //         // continue; don't fail whole flow
//   //       }

//   //       // --- 5) POST FA ENTRIES with purchaseId ----------------------------
//   //       try {
//   //         await axios.post(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchasefaFile`, {
//   //           formData: combinedData.formData,
//   //           items: combinedData.items,
//   //           supplierdetails: combinedData.supplierdetails,
//   //           purchaseId, // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//   //         });
//   //       } catch (faErr) {
//   //         console.error("purchasefaFile error:", faErr);
//   //         toast.warn(
//   //           "Purchase saved & stock updated, but FA posting failed. Try 'Post to FA' later.",
//   //           { position: "top-center" }
//   //         );
//   //       }

//   //       // --- 6) REFRESH + UI STATE -----------------------------------------
//   //       fetchData();
//   //       isDataSaved = true;
//   //     }
//   //   } catch (error) {
//   //     console.error("Error saving data:", error);
//   //     toast.error("Failed to save data. Please try again.", { position: "top-center" });
//   //   } finally {
//   //     setIsSubmitEnabled(!isDataSaved);
//   //     if (isDataSaved) {
//   //       setTitle("View");
//   //       setIsAddEnabled(true);
//   //       setIsDisabled(true);
//   //       setIsEditMode(false);
//   //       setIsPreviousEnabled(true);
//   //       setIsNextEnabled(true);
//   //       setIsFirstEnabled(true);
//   //       setIsLastEnabled(true);
//   //       setIsSPrintEnabled(true);
//   //       setIsSearchEnabled(true);
//   //       setIsDeleteEnabled(true);
//   //       toast.success("Data Saved Successfully!", { position: "top-center" });
//   //       if (Defaultbutton === "Print") setShouldFocusPrint(true);
//   //       else if (Defaultbutton === "Add") setShouldFocusAdd(true);
//   //     } else {
//   //       setIsAddEnabled(false);
//   //       setIsDisabled(false);
//   //     }
//   //   }
//   // };
//   const handleSaveClick = async () => {
//     document.body.style.backgroundColor = "white";
//     setIsSubmitEnabled(true);
//     let isDataSaved = false;

//     try {
//       // --- 1) VALIDATIONS ---------------------------------------------------
//       const isValid = supplierdetails.every((item) => (item.vacode || "") !== "");
//       if (!isValid) {
//         toast.error("Please Fill the Customer Details", { position: "top-center" });
//         return;
//       }

//       const nonEmptyItems = items.filter((item) => (item.sdisc || "").trim() !== "");
//       if (nonEmptyItems.length === 0) {
//         toast.error("Please fill in at least one Items name.", { position: "top-center" });
//         return;
//       }

//       if (!isAbcmode && formData.p_entry && formData.p_entry !== "0") {
//         try {
//           const { data } = await axios.get(
//             `https://www.shkunweb.com/${tenant}/tenant/api/purchase/check`,
//             { params: { p_entry: String(formData.p_entry).trim() } }
//           );
//           if (data.exists) {
//             toast.error("Self Invoice No Already Exists.", { position: "top-center" });
//             return;
//           }
//         } catch (fetchError) {
//           console.error("Error checking duplicates:", fetchError);
//           toast.error("Error checking duplicate p_entry. Please try again.", { position: "top-center" });
//           return;
//         }
//       }

//       // --- 2) BUILD PAYLOAD -------------------------------------------------
//       const combinedData = {
//         _id: formData._id,
//         formData: {
//           date: selectedDate.toLocaleDateString("en-IN"),
//           vtype: formData.vtype,
//           vno: formData.vno,
//           vbillno: formData.vbillno,
//           exfor: formData.exfor,
//           trpt: formData.trpt,
//           p_entry: formData.p_entry,
//           stype: formData.stype,
//           btype: formData.btype,
//           conv: formData.conv,
//           vacode1: formData.vacode1,
//           rem2: formData.rem2,
//           v_tpt: formData.v_tpt,
//           broker: formData.broker,
//           srv_rate: formData.srv_rate,
//           srv_tax: formData.srv_tax,
//           tcs1_rate: formData.tcs1_rate,
//           tcs1: formData.tcs1,
//           tcs206_rate: formData.tcs206_rate,
//           tcs206: formData.tcs206,
//           duedate: expiredDate.toLocaleDateString("en-IN"),
//           gr: formData.gr,
//           tdson: formData.tdson,
//           pcess: formData.pcess,
//           tax: formData.tax,
//           cess1: formData.cess1,
//           cess2: formData.cess2,
//           sub_total: formData.sub_total,
//           exp_before: formData.exp_before,
//           Exp_rate6: formData.Exp_rate6,
//           Exp_rate7: formData.Exp_rate7,
//           Exp_rate8: formData.Exp_rate8,
//           Exp_rate9: formData.Exp_rate9,
//           Exp_rate10: formData.Exp_rate10,
//           Exp6: formData.Exp6,
//           Exp7: formData.Exp7,
//           Exp8: formData.Exp8,
//           Exp9: formData.Exp9,
//           Exp10: formData.Exp10,
//           Tds2: formData.Tds2,
//           Ctds: formData.Ctds,
//           Stds: formData.Stds,
//           iTds: formData.iTds,
//           cgst: formData.cgst,
//           sgst: formData.sgst,
//           igst: formData.igst,
//           expafterGST: formData.expafterGST,
//           ExpRoundoff: formData.ExpRoundoff,
//           grandtotal: formData.grandtotal,

//           // ---- Setup (Purchase) accounts
//           cgst_ac:  setupFormData.cgst_ac,
//           cgst_code: setupFormData.cgst_code,
//           cgst_ac1: setupFormData.cgst_ac1,
//           cgst_code1: setupFormData.cgst_code1,
//           cgst_ac2: setupFormData.cgst_ac2,
//           cgst_code2: setupFormData.cgst_code2,

//           sgst_ac:  setupFormData.sgst_ac,
//           sgst_code: setupFormData.sgst_code,
//           sgst_ac1: setupFormData.sgst_ac1,
//           sgst_code1: setupFormData.sgst_code1,
//           sgst_ac2: setupFormData.sgst_ac2,
//           sgst_code2: setupFormData.sgst_code2,

//           igst_ac:  setupFormData.igst_ac,
//           igst_code: setupFormData.igst_code,
//           igst_ac1: setupFormData.igst_ac1,
//           igst_code1: setupFormData.igst_code1,
//           igst_ac2: setupFormData.igst_ac1,   // (kept as you had)
//           igst_code2: setupFormData.igst_code1,

//           Adcode: setupFormData.Adcode,
//           Ad_ac:  setupFormData.Ad_ac,

//           cesscode: setupFormData.cesscode,
//           cessAc:   setupFormData.cessAc,

//           tds_code: setupFormData.tds_code,
//           tds_ac:   setupFormData.tds_ac,

//           tcs_code:   setupFormData.tcs_code,
//           tcs_ac:     setupFormData.tcs_ac,
//           tcs206code: setupFormData.tcs206code,
//           tcs206ac:   setupFormData.tcs206ac,

//           discount_code: setupFormData.discount_code,
//           discount_ac:   setupFormData.discount_code, // (kept as you had)

//           // TDS ACCOUNTS
//           cTds_code: setupFormData.cTds_code,
//           cTds_ac: setupFormData.cTds_ac,
//           sTds_code: setupFormData.sTds_code,
//           sTds_ac: setupFormData.sTds_ac,
//           iTds_code: setupFormData.iTds_code,
//           iTds_ac: setupFormData.iTds_ac,

//           expense1_code: setupFormData.E1Code,  expense1_ac: setupFormData.E1name,
//           expense2_code: setupFormData.E2Code,  expense2_ac: setupFormData.E2name,
//           expense3_code: setupFormData.E3Code,  expense3_ac: setupFormData.E3name,
//           expense4_code: setupFormData.E4Code,  expense4_ac: setupFormData.E4name,
//           expense5_code: setupFormData.E5Code,  expense5_ac: setupFormData.E5name,
//           expense6_code: setupFormData.E6Code,  expense6_ac: setupFormData.E6name,
//           expense7_code: setupFormData.E7Code,  expense7_ac: setupFormData.E7name,
//           expense8_code: setupFormData.E8Code,  expense8_ac: setupFormData.E8name,
//           expense9_code: setupFormData.E9Code,  expense9_ac: setupFormData.E9name,
//           expense10_code: setupFormData.E10Code, expense10_ac: setupFormData.E10name,
//         },
//         items: nonEmptyItems.map((item) => ({
//           id: item.id,
//           vcode: item.vcode,
//           sdisc: item.sdisc,
//           Units: item.Units,
//           pkgs: item.pkgs,
//           weight: item.weight,
//           rate: item.rate,
//           amount: item.amount,
//           disc: item.disc,
//           discount: item.discount,
//           gst: item.gst,
//           Pcodess: item.Pcodess,
//           Pcodes01: item.Pcodes01,
//           Scodess: item.Scodess,
//           Scodes01: item.Scodes01,
//           exp_before: item.exp_before,
//           Exp_rate1: item.Exp_rate1,
//           Exp_rate2: item.Exp_rate2,
//           Exp_rate3: item.Exp_rate3,
//           Exp_rate4: item.Exp_rate4,
//           Exp_rate5: item.Exp_rate5,
//           Exp1: item.Exp1,
//           Exp2: item.Exp2,
//           Exp3: item.Exp3,
//           Exp4: item.Exp4,
//           Exp5: item.Exp5,
//           ctax: item.ctax,
//           stax: item.stax,
//           itax: item.itax,
//           tariff: item.tariff,
//           vamt: item.vamt,
//         })),
//         supplierdetails: supplierdetails.map((item) => ({
//           Vcode: item.Vcode,
//           vacode: item.vacode,
//           gstno: item.gstno,
//           pan: item.pan,
//           Add1: item.Add1,
//           city: item.city,
//           state: item.state,
//           Tcs206c1H: item.Tcs206c1H,
//           TDS194Q: item.TDS194Q,
//         })),
//       };

//       // --- 3) SAVE PURCHASE GST --------------------------------------------
//       let apiEndpoint = "";
//       let method = "";

//       if (isAbcmode) {
//         // Edit Mode → use "purchasegstsave1"
//         apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchasegstsave1/${data1._id}`;
//         method = "put";
//       } else {
//         // Add Mode → normal "purchasegstsave"
//         apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchasegstsave`;
//         method = "post";
//       }


//       const response = await axios({ method, url: apiEndpoint, data: combinedData });
//       console.log(response);

//       // Extract the new/updated PurchaseGst id
//       const purchaseId =
//         response?.data?.purchaseId ||   // preferred (from backend create)
//         response?.data?._id ||          // legacy (if PUT returns doc)
//         (isAbcmode ? data1?._id : null);

//       if (!purchaseId) {
//         console.warn("purchaseId not found in /purchasegstsave response. Ensure backend returns { ok: true, purchaseId }.");
//       }

//       if (response.status === 200 || response.status === 201) {
//         // --- 4) UPDATE STOCK (purchase -> add) ------------------------------
//         try {
//           await axios.post(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/stock/update`, {
//             items: nonEmptyItems.map(item => ({
//               vcode: item.vcode,
//               sdisc: item.sdisc,
//               weight: Number(item.weight) || 0,
//               pkgs: Number(item.pkgs) || 0,
//             }))
//           });
//         } catch (stkErr) {
//           console.error("Stock update error:", stkErr);
//           // continue; don't fail whole flow
//         }

//         // --- 5) POST FA ENTRIES with purchaseId ----------------------------
//         try {
//           await axios.post(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchasefaFile`, {
//             formData: combinedData.formData,
//             items: combinedData.items,
//             supplierdetails: combinedData.supplierdetails,
//             purchaseId, // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
//           });
//         } catch (faErr) {
//           console.error("purchasefaFile error:", faErr);
//           toast.warn(
//             "Purchase saved & stock updated, but FA posting failed. Try 'Post to FA' later.",
//             { position: "top-center" }
//           );
//         }

//         // --- 6) REFRESH + UI STATE -----------------------------------------
//         fetchData();
//         isDataSaved = true;
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       toast.error("Failed to save data. Please try again.", { position: "top-center" });
//     } finally {
//       setIsSubmitEnabled(!isDataSaved);
//       if (isDataSaved) {
//         setTitle("View");
//         setIsAddEnabled(true);
//         setIsDisabled(true);
//         setIsEditMode(false);
//         setIsPreviousEnabled(true);
//         setIsNextEnabled(true);
//         setIsFirstEnabled(true);
//         setIsLastEnabled(true);
//         setIsSPrintEnabled(true);
//         setIsSearchEnabled(true);
//         setIsDeleteEnabled(true);
//         toast.success("Data Saved Successfully!", { position: "top-center" });
//         if (Defaultbutton === "Print") setShouldFocusPrint(true);
//         else if (Defaultbutton === "Add") setShouldFocusAdd(true);
//       } else {
//         setIsAddEnabled(false);
//         setIsDisabled(false);
//       }
//     }
//   };
//   const handleDataSave = async () => {
//     handleSaveClick();
//     // handleSaveClickwithSetup();
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
//       const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/${data1._id}`;
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

//   useEffect(() => {
//     if (shouldFocusPrint && isPrintEnabled && printButtonRef.current) {
//       printButtonRef.current.focus();
//       setShouldFocusPrint(false); // Reset flag
//     }
//     if (shouldFocusAdd && isAddEnabled && addButtonRef.current) {
//       addButtonRef.current.focus();
//       setShouldFocusAdd(false); // Reset flag
//     }
//   }, [isPrintEnabled,shouldFocusPrint,isAddEnabled,shouldFocusAdd]);

//   // Modal For Product Selection
//   const [products, setProducts] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedItemIndex, setSelectedItemIndex] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   React.useEffect(() => {
//     // Fetch products from the API when the component mounts
//     fetchProducts();
//   }, []);

//       const fetchProducts = async (search = "") => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/stockmaster?search=${encodeURIComponent(search)}`
//       );
//       if (!response.ok) throw new Error("Failed to fetch products");
//       const data = await response.json();
//       const flattenedData = data.data.map((item) => ({
//         ...item.formData,
//         _id: item._id,
//       }));
//       setProducts(flattenedData);
//     } catch (error) {
//       setError(error.message);
//     }
//     setLoading(false);
//   };

//   // const fetchProducts = async () => {
//   //   try {
//   //     const response = await fetch(
//   //       `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/stockmaster`
//   //     );
//   //     if (!response.ok) {
//   //       throw new Error("Failed to fetch products");
//   //     }
//   //     const data = await response.json();
//   //     // Flatten the data to make the nested formData directly accessible
//   //     const flattenedData = data.map((item) => ({
//   //       ...item.formData,
//   //       _id: item._id,
//   //       PurchaseAcc: item.PurchaseAcc,
//   //       SaleAcc: item.SaleAcc,
//   //     }));
//   //     setProducts(flattenedData);
//   //     setLoading(false);
//   //     //console.log(flattenedData);
//   //   } catch (error) {
//   //     setError(error.message);
//   //     setLoading(false);
//   //   }
//   // };

//   const handleItemChange = (index, key, value, field) => {
//     // If key is "pkgs" or "weight", allow only numbers and a single decimal point
//     if ((key === "pkgs" || key === "weight" || key === "tariff" || key === "rate" || key === "disc" || key === "discount") && !/^-?\d*\.?\d*$/.test(value)) {
//       return; // reject invalid input
//     }

//     // Always force disc/discount to be negative
//     if (key === "disc" || key === "discount") {
//       const numeric = parseFloat(value);
//       if (!isNaN(numeric)) {
//         value = -Math.abs(numeric); // Force negative
//       }
//     }

//     const updatedItems = [...items];
//     if (["sdisc"].includes(key)) {
//       updatedItems[index][key] = capitalizeWords(value);
//     } else {
//       updatedItems[index][key] = value;
//     }
//     // const updatedItems = [...items];
//     // updatedItems[index][key] = value;

//     // If the key is 'name', find the corresponding product and set the price
//     if (key === "name") {
//       const selectedProduct = products.find(
//         (product) => product.Aheads === value
//       );
//       if (selectedProduct) {
//         updatedItems[index]["vcode"] = selectedProduct.Acodes;
//         updatedItems[index]["sdisc"] = selectedProduct.Aheads;
//         updatedItems[index]["Units"] = selectedProduct.TradeName;
//         updatedItems[index]["rate"] = selectedProduct.Mrps;
//         updatedItems[index]["gst"] = selectedProduct.itax_rate;
//         updatedItems[index]["tariff"] = selectedProduct.Hsn;
//         updatedItems[index]["Scodes01"] = selectedProduct.AcCode;
//         updatedItems[index]["Scodess"] = selectedProduct.Scodess;
//         updatedItems[index]["Pcodes01"] = selectedProduct.acCode;
//         updatedItems[index]["Pcodess"] = selectedProduct.Pcodess;
//         updatedItems[index]["RateCal"] = selectedProduct.Rateins;
//         updatedItems[index]["Qtyperpc"] = selectedProduct.Qpps || 0;
//       } else {
//         updatedItems[index]["rate"] = ""; // Reset price if product not found
//         updatedItems[index]["gst"] = ""; // Reset gst if product not found
//       }
//     }
//     let pkgs = parseFloat(updatedItems[index].pkgs);
//     let Qtyperpkgs = updatedItems[index].Qtyperpc;
//     let AL = pkgs * Qtyperpkgs;
//     let gst;
//     if (pkgs > 0 && Qtyperpkgs > 0 && key !== "weight") {
//       updatedItems[index]["weight"] = AL.toFixed(weightValue);
//     }
//     // Calculate CGST and SGST based on the GST value
//     if (
//       formData.stype === "Tax Free Within State" &&
//       custGst.startsWith("03")
//     ) {
//       gst = 0;
//     } else if (
//       formData.stype === "Tax Free Interstate" &&
//       !custGst.startsWith("03")
//     ) {
//       gst = 0;
//     } else {
//       gst = parseFloat(updatedItems[index].gst);
//     }
//     const totalAccordingWeight =
//       parseFloat(updatedItems[index].weight) *
//       parseFloat(updatedItems[index].rate);
//     const totalAccordingPkgs =
//       parseFloat(updatedItems[index].pkgs) *
//       parseFloat(updatedItems[index].rate);
//     let RateCal = updatedItems[index].RateCal;
//     let TotalAcc = totalAccordingWeight; // Set a default value

//     // Calcuate the Amount According to RateCalculation field
//     if (
//       RateCal === "Default" ||
//       RateCal === "" ||
//       RateCal === null ||
//       RateCal === undefined
//     ) {
//       TotalAcc = totalAccordingWeight;
//       console.log("Default");
//     } else if (RateCal === "Wt/Qty") {
//       TotalAcc = totalAccordingWeight;
//       console.log("totalAccordingWeight");
//     } else if (RateCal === "Pc/Pkgs") {
//       TotalAcc = totalAccordingPkgs;
//       console.log("totalAccordingPkgs");
//     }
//     let others = parseFloat(updatedItems[index].exp_before) || 0;
//     let disc = parseFloat(updatedItems[index].disc) || 0;
//     let manualDiscount = parseFloat(updatedItems[index].discount) || 0;
//     let per;
//     if (key === "discount") {
//       per = manualDiscount;
//     } else {
//       per = ((disc / 100) * TotalAcc);
//       updatedItems[index]["discount"] = T11 ? Math.round(per).toFixed(2) : per.toFixed(2);
//     }

//     // ✅ Convert to float for reliable calculation
//     per = parseFloat(per);
//     let Amounts = TotalAcc + per + others;

//     // Ensure TotalAcc is a valid number before calling toFixed()
//     TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;
//     // Check if GST number starts with "0" to "3"
//     const same = custGst.substring(0, 2);
//     let cgst, sgst, igst;
//     if (CompanyState == supplierdetails[0].state) {
//       cgst = (Amounts * (gst / 2)) / 100 || 0;
//       sgst = (Amounts * (gst / 2)) / 100 || 0;
//       igst = 0;
//     } else {
//       cgst = sgst = 0;
//       igst = (Amounts * gst) / 100 || 0;
//     }

//     // Calculate the total with GST and Others
//     let totalWithGST = Amounts + cgst + sgst + igst;
//     // totalWithGST += others;
//     // Update CGST, SGST, Others, and total fields in the item
//     if (T11) {
//       if (key !== "discount") {
//         updatedItems[index]["discount"] = Math.round(per).toFixed(2);
//       }
//       updatedItems[index]["amount"] = Math.round(TotalAcc).toFixed(2);
//       updatedItems[index]["vamt"] = Math.round(totalWithGST).toFixed(2);
//     } else {
//       if (key !== "discount") {
//         updatedItems[index]["discount"] = parseFloat(per).toFixed(2);
//       }
//       updatedItems[index]["amount"] = TotalAcc.toFixed(2);
//       updatedItems[index]["vamt"] = totalWithGST.toFixed(2);
//     }
//     if (T12) {
//       updatedItems[index]["ctax"] = Math.round(cgst).toFixed(2);
//       updatedItems[index]["stax"] = Math.round(sgst).toFixed(2);
//       updatedItems[index]["itax"] = Math.round(igst).toFixed(2);
//     } else {
//       updatedItems[index]["ctax"] = cgst.toFixed(2);
//       updatedItems[index]["stax"] = sgst.toFixed(2);
//       updatedItems[index]["itax"] = igst.toFixed(2);
//     }
//     // Calculate the percentage of the value based on the GST percentage
//     const percentage = ((totalWithGST - Amounts) / TotalAcc) * 100;
//     updatedItems[index]["percentage"] = percentage.toFixed(2);
//     setItems(updatedItems);
//     calculateTotalGst();
//   };

//   const handleProductSelect = (product) => {
//     setIsEditMode(true);
//       if (selectedItemIndex !== null) {
//         handleItemChange(selectedItemIndex, "name", product.Aheads);
//         setShowModal(false);
//       }
//   };

//   const handleModalDone = (product) => {
//     if (product) {
//       console.log(product);
//       handleProductSelect(product);
//     }
//     setShowModal(false);
//     fetchProducts();
//     setIsEditMode(true);
//   };

//   const handleAddItem = () => {
//     if (isEditMode) {
//       const newItem = {
//         id: items.length + 1,
//         vcode: "",
//         sdisc: "",
//         Units: "",
//         pkgs: 0,
//         weight: 0,
//         rate: 0,
//         amount: 0,
//         disc: "",
//         discount: "",
//         gst: 0,
//         Pcodes01: "",
//         Pcodess: "",
//         Scodes01: "",
//         Scodess: "",
//         Exp_rate1: 0,
//         Exp_rate2: 0,
//         Exp_rate3: 0,
//         Exp_rate4: 0,
//         Exp_rate5: 0,
//         Exp1: 0,
//         Exp2: 0,
//         Exp3: 0,
//         Exp4: 0,
//         Exp5: 0,
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
//     if (isEditMode) {
//       const confirmDelete = window.confirm(
//         "Do you really want to delete this item?"
//       );
//       // Proceed with deletion if the user confirms
//       if (confirmDelete) {
//         const filteredItems = items.filter((item, i) => i !== index);
//         setItems(filteredItems);
//       }
//     }
//   };

//   const openModalForItem = (index) => {
//     if (isEditMode) {
//       setSelectedItemIndex(index);
//       setShowModal(true);
//     }
//   };

//   const allFields = products.length
//   ? Object.keys(products[0])
//   : ["Aheads", "Pcodes01", "UOM", "GST"]; // fallback/default fields

//   // Modal For Customer
//   const [productsCus, setProductsCus] = useState([]);
//   const [showModalCus, setShowModalCus] = useState(false);
//   const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
//   const [loadingCus, setLoadingCus] = useState(true);
//   const [errorCus, setErrorCus] = useState(null);

//   React.useEffect(() => {
//     // Fetch products from the API when the component mounts
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//       const response = await fetch(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch products");
//       }

//       const data = await response.json();
//       //console.log(data);
//       // Ensure to extract the formData for easier access in the rest of your app
//       const formattedData = data.map((item) => ({
//         ...item.formData,
//         _id: item._id,
//       }));
//       setProductsCus(formattedData);
//       setLoadingCus(false);
//     } catch (error) {
//       setErrorCus(error.message);
//       setLoadingCus(false);
//     }
//   };

//   const handleOpenModalTpt = (event, index, field) => {
//     if (event.key === "ArrowDown" && field === "v_tpt") {
//       setSelectedItemIndexCus(index);
//       setShowModalCus(true);
//       event.preventDefault();
//     }
//     if (event.key === "ArrowDown" && field === "broker") {
//       setSelectedItemIndexCus(index);
//       setShowModalCus(true);
//       event.preventDefault();
//     }
//   };

//   const determineSaleType = (state, gstno, CompanyState) => {
//     if (state === "Export") {
//       return "Export Sale";
//     } else if (state === CompanyState) {
//       return gstno.trim() !== "" ? "GST Sale (RD)" : "GST (URD)";
//     } else {
//       return gstno.trim() !== "" ? "IGST Sale (RD)" : "IGST (URD)";
//     }
//   };

//   const handleItemChangeCus = (index, key, value) => {
//     const updatedItems = [...supplierdetails];
//     updatedItems[index][key] = value;

//     if (key === "name") {
//       const selectedProduct = productsCus.find(
//         (product) => product.ahead === value
//       );
//       if (selectedProduct) {
//         updatedItems[index] = {
//           ...updatedItems[index],
//           Vcode: selectedProduct.acode,
//           vacode: selectedProduct.ahead,
//           gstno: selectedProduct.gstNo,
//           pan: selectedProduct.pan,
//           Add1: selectedProduct.add1,
//           city: selectedProduct.city,
//           state: selectedProduct.state,
//           Tcs206c1H: selectedProduct.tcs206,
//           TDS194Q: selectedProduct.tds194q,
//         };
//         setCustgst(selectedProduct.gstNo);

//         const stype = determineSaleType(
//           selectedProduct.state,
//           selectedProduct.gstNo,
//           CompanyState
//         );
//         setFormData((prevState) => ({
//           ...prevState,
//           stype,
//         }));
//       }
//     }

//     if (key === "state" || key === "gstno") {
//       const { state, gstno } = updatedItems[index];
//       const stype = determineSaleType(state, gstno, CompanyState);
//       setFormData((prevState) => ({
//         ...prevState,
//         stype,
//       }));
//     }

//     setsupplierdetails(updatedItems);
//   };

//   //   const handleProductSelectCus = (product) => {
//   //   setIsEditMode(true);
//   //   if (selectedItemIndexCus !== null) {
//   //     if (selectedItemIndexCus === "v_tpt") {
//   //       setFormData((prevData) => ({
//   //         ...prevData,
//   //         v_tpt: product.ahead, // Update v_tpt field with selected value
//   //       }));
//   //     } else if (selectedItemIndexCus === "broker") {
//   //       setFormData((prevData) => ({
//   //         ...prevData,
//   //         broker: product.ahead, // Update v_tpt field with selected value
//   //       }));
//   //     } else {
//   //       handleItemChangeCus(selectedItemIndexCus, "name", product.ahead);
//   //     }
//   //     setShowModalCus(false);

//   //     // Focus back on the respective input field after selecting the value
//   //     setTimeout(() => {
//   //       if (selectedItemIndexCus === "v_tpt") {
//   //         transportRef.current?.focus(); // Focus back to transport field
//   //       } else if (selectedItemIndexCus === "broker") {
//   //         expAfterGSTRef.current?.focus();
//   //       } else {
//   //         vBillNoRef.current.focus();
//   //       }
//   //     }, 0);
//   //   }
//   // };

//   const handleProductSelectCus = (product) => {
//     if (!product) {
//       alert("No product received!");
//       setShowModalCus(false);
//       return;
//     }
  
//     // clone the array
//     const newCustomers = [...supplierdetails];
  
//     // overwrite the one at the selected index
//     newCustomers[selectedItemIndexCus] = {
//       ...newCustomers[selectedItemIndexCus],
//       Vcode: product.acode || '',
//       vacode: product.ahead || '',
//       city:   product.city  || '',
//       gstno:  product.gstNo  || '',
//       pan:    product.pan    || '',
//       Add1: product.Add1 || '',
//       state: product.state    || '',
//       Tcs206c1H: product.Tcs206c1H    || '',
//       TDS194Q: product.TDS194Q    || '',
      
//     };

//     const stype = determineSaleType(product.state, product.gstNo || "", CompanyState);
//     setFormData((prevState) => ({
//       ...prevState,
//       stype,
//     }));

//     const nameValue = product.ahead || product.name || "";
//     if (selectedItemIndexCus !== null) {
//       if (selectedItemIndexCus === "v_tpt") {
//         setFormData((prevData) => ({
//           ...prevData,
//           v_tpt: nameValue, // Update v_tpt field with selected value
//         }));
//       } else if (selectedItemIndexCus === "broker") {
//         setFormData((prevData) => ({
//           ...prevData,
//           broker: nameValue, // Update v_tpt field with selected value
//         }));
//       } else {
//         handleItemChangeCus(selectedItemIndexCus, "name", nameValue);
//       }
//     }
//     setsupplierdetails(newCustomers);
//     setIsEditMode(true);
//     setShowModalCus(false);
  
//     // restore focus
//     setTimeout(() => {
//       if (selectedItemIndexCus === "v_tpt") {
//         transportRef.current?.focus(); // Focus back to transport field
//       } else if (selectedItemIndexCus === "broker") {
//         expAfterGSTRef.current?.focus();
//       } else {
//         vBillNoRef.current.focus();
//       }
//     }, 0);
//   };

//   const handleCloseModalCus = () => {
//     setShowModalCus(false);
//     setPressedKey(""); // resets for next modal open
//   };

//   const openModalForItemCus = (index) => {
//     if (isEditMode) {
//       setSelectedItemIndexCus(index);
//       setShowModalCus(true);
//     }
//   };

// const allFieldsCus = productsCus.reduce((fields, product) => {
//     Object.keys(product).forEach((key) => {
//       if (!fields.includes(key)) {
//         fields.push(key);
//       }
//     });

//     return fields;
//   }, []);

//   const handleTaxType = (event) => {
//     const { value } = event.target;

//     // Get customer state & GST number
//     const customerState = supplierdetails[0]?.state;
//     const customerGST = supplierdetails[0]?.gstno?.trim();

//     // Define allowed tax types
//     let allowedTypes = ["Not Applicable", "Exempted Sale"];

//     if (customerState === CompanyState) {
//       allowedTypes.push(customerGST ? "GST Sale (RD)" : "GST (URD)");
//     } else {
//       allowedTypes.push(customerGST ? "IGST Sale (RD)" : "IGST (URD)");
//     }

//     // Special condition for GST starting with "03"
//     if (customerGST.startsWith("03")) {
//       allowedTypes.push(
//         "Tax Free Within State",
//         "Including GST",
//         "Export Sale"
//       );
//     } else {
//       allowedTypes.push(
//         "Tax Free Interstate",
//         "Including IGST",
//         "Export Sale(IGST)"
//       );
//     }

//     if (!allowedTypes.includes(value)) {
//       toast.error("Invalid Tax Type Selection !", { autoClose: 1500 });
//       return; // Prevents state update
//     }

//     setFormData((prevState) => ({
//       ...prevState,
//       stype: value,
//     }));
//   };

//   const handleSupply = (event) => {
//     const { value } = event.target; // Get the selected value from the event
//     setFormData((prevState) => ({
//       ...prevState,
//       conv: value, // Update the ratecalculate field in FormData
//     }));
//   };

//   const handleTdsOn = (event) => {
//     const { value } = event.target; // Get the selected value from the event
//     setFormData((prevState) => ({
//       ...prevState,
//       tdson: value, // Update the ratecalculate field in FormData
//     }));
//   };

//   const [selectedDate, setSelectedDate] = useState(new Date());

//   // useEffect(() => {
//   //   if (formData.date) {
//   //     try {
//   //       // Expecting date in format "DD/MM/YYYY"
//   //       const [day, month, year] = formData.date.split("/").map(Number);
//   //       const date = new Date(year, month - 1, day); // month is 0-based
  
//   //       if (!isNaN(date.getTime())) {
//   //         setSelectedDate(date);
//   //       } else {
//   //         console.error("Invalid date value in formData.date:", formData.date);
//   //       }
//   //     } catch (error) {
//   //       console.error("Error parsing date:", error);
//   //     }
//   //   } else {
//   //     setSelectedDate(null);
//   //   }
//   // }, [formData.date]);

//   useEffect(() => {
//     // If formData.date has a valid date string, parse it and set selectedDate
//     if (formData.date) {
//       try {
//         const date = new Date(formData.date);
//         if (!isNaN(date.getTime())) {
//           setSelectedDate(date);
//         } else {
//           console.error("Invalid date value in formData.date:", formData.date);
//         }
//       } catch (error) {
//         console.error("Error parsing date:", error);
//       }
//     } else {
//       // If there's no date, we keep selectedDate as null so the DatePicker is blank,
//       // but we can still have it open on today's date via openToDate
//       setSelectedDate(null);
//     }
//   }, [formData.date]);

//   const [expiredDate, setexpiredDate] = useState(null);

//   useEffect(() => {
//     if (formData.duedate) {
//       setexpiredDate(new Date(formData.duedate));
//     } else {
//       const today = new Date();
//       setexpiredDate(today);
//       setFormData({ ...formData, duedate: today });
//     }
//   }, []);

//    const handleDateChange = (date) => {
//      if (date instanceof Date && !isNaN(date)) {
//        setSelectedDate(date);
//        const formattedDate = date.toISOString().split("T")[0];
//        setFormData((prev) => ({
//          ...prev,
//          date: date,
//          duedate: date,
//        }));
//      }
//    };
 
//    // ✅ Separate function to validate future or past date
//    const validateDate = (date) => {
//      if (!date) return;
 
//      const today = new Date();
//      today.setHours(0, 0, 0, 0); // normalize today
 
//      const checkDate = new Date(date);
//      checkDate.setHours(0, 0, 0, 0); // normalize selected date
 
//      if (checkDate > today) {
//        toast.info("You Have Selected a Future Date.", {
//          position: "top-center",
//        });
//      } else if (checkDate < today) {
//        toast.info("You Have Selected a Past Date.", {
//          position: "top-center",
//        });
//      }
//    };

//   const handleCalendarClose = () => {
//     // If no date is selected when the calendar closes, default to today's date
//     if (!selectedDate) {
//       const today = new Date();
//       setSelectedDate(today);
//     }
//   };

//   const capitalizeWords = (str) => {
//     return str.replace(/\b\w/g, (char) => char.toUpperCase());
//   };

//   const HandleInputsChanges = (event) => {
//     const { id, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: capitalizeWords(value),
//     }));
//   };

//   const handleCapitalAlpha = (event) => {
//   const { id, value } = event.target;
//   // force all letters to uppercase
//   const uppercasedValue = value.toUpperCase();
//   setFormData((prevData) => ({
//     ...prevData,
//     [id]: uppercasedValue,
//   }));
//   };

//   const handleNumberChange = (event) => {
//     const { id, value } = event.target;
//     const numberValue = value.replace(/[^0-9.]/g, "");
//     const validNumberValue =
//       numberValue.split(".").length > 2
//         ? numberValue.replace(/\.{2,}/g, "").replace(/(.*)\./g, "$1.")
//         : numberValue;

//     setFormData((prevState) => {
//       const newFormData = { ...prevState, [id]: validNumberValue };
//       return calculateTotalGst(newFormData, true); // ✅ Skip TCS recalculation
//     });
//   };
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
//           if (items[index].sdisc.trim() === "") {
//             transportRef.current.focus();
//           } else {
//             desciptionRefs.current[index]?.focus();
//           }
//           break;
//         case "sdisc":
//           hsnCodeRefs.current[index]?.focus();
//           break;
//         case "tariff":
//           peciesRefs.current[index]?.focus();
//           break;
//         case "pkgs":
//           quantityRefs.current[index]?.focus();
//           break;
//         case "weight":
//           priceRefs.current[index]?.focus();
//           break;
//         case "rate":
//           discountRef.current[index]?.focus();
//           break;
//         case "disc":
//           discount2Ref.current[index]?.focus();
//           break;
//         case "discount":
//           othersRefs.current[index]?.focus();
//           break;
//         case "exp_before":
//           if (index === items.length - 1) {
//             handleAddItem();
//             itemCodeRefs.current[index + 1]?.focus();
//           } else {
//             itemCodeRefs.current[index + 1]?.focus();
//           }
//           break;
//         default:
//           break;
//       }
//     }
//     // Move Right (→)
//     else if (event.key === "ArrowRight") {
//       if (field === "vcode") {
//         desciptionRefs.current[index]?.focus();
//         setTimeout(() => desciptionRefs.current[index]?.select(), 0);
//       } else if (field === "sdisc") {
//         hsnCodeRefs.current[index]?.focus();
//         setTimeout(() => hsnCodeRefs.current[index]?.select(), 0);
//       } else if (field === "tariff") {
//         peciesRefs.current[index]?.focus();
//         setTimeout(() => peciesRefs.current[index]?.select(), 0);
//       } else if (field === "pkgs") {
//         quantityRefs.current[index]?.focus();
//         setTimeout(() => quantityRefs.current[index]?.select(), 0);
//       } else if (field === "weight") {
//         priceRefs.current[index]?.focus();
//         setTimeout(() => priceRefs.current[index]?.select(), 0);
//       } else if (field === "rate") {
//         discountRef.current[index]?.focus();
//         setTimeout(() => discountRef.current[index]?.select(), 0);
//       } else if (field === "disc") {
//         discount2Ref.current[index]?.focus();
//         setTimeout(() => discount2Ref.current[index]?.select(), 0);
//       }
//       else if (field === "discount") {
//         othersRefs.current[index]?.focus();
//         setTimeout(() => othersRefs.current[index]?.select(), 0);
//       }
//     }
//     // Move Left (←)
//     else if (event.key === "ArrowLeft") {
//       if (field === "exp_before") {
//         discount2Ref.current[index]?.focus();
//         setTimeout(() => discount2Ref.current[index]?.select(), 0);
//       } else if (field === "discount") {
//         discountRef.current[index]?.focus();
//         setTimeout(() => discountRef.current[index]?.select(), 0);
//       }else if (field === "disc") {
//         priceRefs.current[index]?.focus();
//         setTimeout(() => priceRefs.current[index]?.select(), 0);
//       } else if (field === "rate") {
//         quantityRefs.current[index]?.focus();
//         setTimeout(() => quantityRefs.current[index]?.select(), 0);
//       } else if (field === "weight") {
//         peciesRefs.current[index]?.focus();
//         setTimeout(() => peciesRefs.current[index]?.select(), 0);
//       } else if (field === "pkgs") {
//         hsnCodeRefs.current[index]?.focus();
//         setTimeout(() => hsnCodeRefs.current[index]?.select(), 0);
//       } else if (field === "tariff") {
//         desciptionRefs.current[index]?.focus();
//         setTimeout(() => desciptionRefs.current[index]?.select(), 0);
//       } else if (field === "sdisc") {
//         itemCodeRefs.current[index]?.focus();
//         setTimeout(() => itemCodeRefs.current[index]?.select(), 0);
//       } else if (field === "vcode") itemCodeRefs.current[index]?.focus();
//     }
//     // Move Up
//     else if (event.key === "ArrowUp" && index > 0) {
//       setTimeout(() => {
//         if (field === "vcode") itemCodeRefs.current[index - 1]?.focus();
//         else if (field === "sdisc") desciptionRefs.current[index - 1]?.focus();
//         else if (field === "tariff") hsnCodeRefs.current[index - 1]?.focus();
//         else if (field === "pkgs") peciesRefs.current[index - 1]?.focus();
//         else if (field === "weight") quantityRefs.current[index - 1]?.focus();
//         else if (field === "rate") priceRefs.current[index - 1]?.focus();
//         else if (field === "disc") discountRef.current[index - 1]?.focus();
//         else if (field === "exp_before") othersRefs.current[index - 1]?.focus();
//       }, 100);
//     }
//     // Move Down
//     else if (event.key === "ArrowDown" && index < items.length - 1) {
//       setTimeout(() => {
//         if (field === "vcode") itemCodeRefs.current[index + 1]?.focus();
//         else if (field === "sdisc") desciptionRefs.current[index + 1]?.focus();
//         else if (field === "tariff") hsnCodeRefs.current[index + 1]?.focus();
//         else if (field === "pkgs") peciesRefs.current[index + 1]?.focus();
//         else if (field === "weight") quantityRefs.current[index + 1]?.focus();
//         else if (field === "rate") priceRefs.current[index + 1]?.focus();
//         else if (field === "disc") discountRef.current[index + 1]?.focus();
//         else if (field === "exp_before") othersRefs.current[index + 1]?.focus();
//       }, 100);
//     }
//     // Open Modal on Letter Input in Account Name
//     else if (/^[a-zA-Z]$/.test(event.key) && field === "accountname") {
//       setPressedKey(event.key);
//       openModalForItemCus(index);
//       event.preventDefault();
//     }
//   };

//   const handleOpenModal = (event, index, field) => {
//     if (/^[a-zA-Z]$/.test(event.key) && field === "vcode") {
//       setPressedKey(event.key); // Set the pressed key
//       openModalForItem(index);
//       event.preventDefault(); // Prevent any default action
//     }
//   };

//   const handleExit = async () => {
//     // Check if grandtotal is Greater Than zero
//     if (formData.grandtotal > 0 && isEditMode) {
//       const confirmExit = window.confirm(
//         "Are you sure you want to Exit? Unsaved changes may be lost."
//       );
//       if (!confirmExit) {
//         return;
//       }
//     }

//     setTitle("(View)");
//     try {
//       const response = await axios.get(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/last`
//       );

//       if (response.status === 200 && response.data.data) {
//         const lastEntry = response.data.data;
//         setFormData(lastEntry.formData);
//         setData1(response.data.data);
//         setItems(lastEntry.items.map((item) => ({ ...item })));
//         setsupplierdetails(
//           lastEntry.supplierdetails.map((item) => ({ ...item }))
//         );

//         setIsDisabled(true);
//         setIndex(lastEntry.formData);
//         setIsAddEnabled(true);
//         setIsEditMode(false);
//         setIsSubmitEnabled(false);
//         setIsPreviousEnabled(true);
//         setIsNextEnabled(true);
//         setIsFirstEnabled(true);
//         setIsLastEnabled(true);
//         setIsSearchEnabled(true);
//         setIsSPrintEnabled(true);
//         setIsDeleteEnabled(true);
//       } else {
//         console.log("No data available");
//         const newData = {
//           date: "",
//           vtype: "P",
//           vno: 0,
//           vbillno: 0,
//           exfor: "",
//           trpt: "",
//           p_entry: "",
//           stype: "",
//           btype: "",
//           conv: "",
//           vacode1: "",
//           rem2: "",
//           v_tpt: "",
//           broker: "",
//           srv_rate: "",
//           srv_tax: "",
//           tcs1_rate: "",
//           tcs1: "",
//           tcs206_rate: "",
//           tcs206: "",
//           duedate: "",
//           gr: "",
//           tdson: "",
//           pcess: "",
//           tax: "",
//           cess1: "",
//           cess2: "",
//           sub_total: "",
//           exp_before: "",
//           Exp_rate6: "",
//           Exp_rate7: "",
//           Exp_rate8: "",
//           Exp_rate9: "",
//           Exp_rate10: "",
//           Exp6: "",
//           Exp7: "'",
//           Exp8: "",
//           Exp9: "",
//           Exp10: "",
//           cgst: "",
//           sgst: "",
//           igst: "",
//           expafterGST: "",
//           grandtotal: "",
//         };
//         setFormData(newData); // Set default form data
//         setItems([
//           {
//             id: 1,
//             vcode: "",
//             sdisc: "",
//             Units: "",
//             pkgs: "",
//             weight: "",
//             rate: 0,
//             amount: 0,
//             disc: "",
//             discount: "",
//             gst: 0,
//             Pcodes01: "",
//             Pcodess: "",
//             Scodes01: "",
//             Scodess: "",
//             Exp_rate1: 0,
//             Exp_rate2: 0,
//             Exp_rate3: 0,
//             Exp_rate4: 0,
//             Exp_rate5: 0,
//             Exp1: 0,
//             Exp2: 0,
//             Exp3: 0,
//             Exp4: 0,
//             Exp5: 0,
//             exp_before: 0,
//             ctax: 0,
//             stax: 0,
//             itax: 0,
//             tariff: "",
//             vamt: 0,
//           },
//         ]);
//         setsupplierdetails([
//           {
//             Vcode: "",
//             vacode: "",
//             gstno: "",
//             pan: "",
//             Add1: "",
//             city: "",
//             state: "",
//             Tcs206c1H: "",
//             TDS194Q: "",
//           },
//         ]);
//         setIsDisabled(true);
//       }
//     } catch (error) {
//       console.error("Error fetching data", error);
//     }
//   };

//   // const handleExit = async () => {
//   //   try {
//   //       const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/last`); // Fetch the latest data
//   //       if (response.status === 200 && response.data.data) {
//   //           // If data is available
//   //           const lastEntry = response.data.data;
//   //           setFormData(lastEntry.formData); // Set form data
//   //           setData1(response.data.data);
//   //           const updateditems = lastEntry.items.map(item => ({
//   //             ...item,
//   //         }));
//   //         const updateditems2 = lastEntry.supplierdetails.map(item => ({
//   //           ...item,
//   //       }));
//   //       setItems(updateditems)
//   //       setsupplierdetails(updateditems2);
//   //       setIsDisabled(true); // Disable fields after loading the data
//   //       setIndex(lastEntry.formData)
//   //       setIsAddEnabled(true);
//   //       setIsSubmitEnabled(false);
//   //       setIsPreviousEnabled(true);
//   //       setIsNextEnabled(true);
//   //       setIsFirstEnabled(true);
//   //       setIsLastEnabled(true);
//   //       setIsSearchEnabled(true);
//   //       setIsSPrintEnabled(true)
//   //       setIsDeleteEnabled(true)
//   //       setTitle("VIEW")
//   //       } else {
//   //           // If no data is available, initialize with default values
//   //           //console.log("No data available");
//   //           const newData = {
//   //             date: "",
//   //             vtype: "P",
//   //             vno: 0,
//   //             vbillno: 0,
//   //             exfor: "",
//   //             trpt: "",
//   //             p_entry: 0,
//   //             stype: "",
//   //             btype: "",
//   //             conv: "",
//   //             vacode1: "",
//   //             rem2: "",
//   //             v_tpt: "",
//   //             broker: "",
//   //             srv_rate: "",
//   //             srv_tax: "",
//   //             tcs1_rate: "",
//   //             tcs1: "",
//   //             tcs206_rate: "",
//   //             tcs206: "",
//   //             duedate: "",
//   //             gr: "",
//   //             tdson: "",
//   //             pcess: "",
//   //             tax: "",
//   //             cess1: "",
//   //             cess2: "",
//   //             sub_total: "",
//   //             exp_before: "",
//   //             Exp_rate6: "",
//   //             Exp_rate7: "",
//   //             Exp_rate8: "",
//   //             Exp_rate9:"",
//   //             Exp_rate10: "",
//   //             Exp6: "",
//   //             Exp7: "'",
//   //             Exp8: "",
//   //             Exp9: "",
//   //             Exp10: "",
//   //             cgst: "",
//   //             sgst: "",
//   //             igst: "",
//   //             expafterGST: "",
//   //             grandtotal: "",
//   //           };
//   //           setFormData(newData); // Set default form data
//   //           setItems([{
//   //             id: 1,
//   //             vcode: "",
//   //             sdisc: "",
//   //             Units:"",
//   //             pkgs: "",
//   //             weight: "",
//   //             rate: 0,
//   //             amount: 0,
//   //             disc:"",
//   //             discount:"",
//   //             gst: 0,
//   //             Pcodes01:"",
//   //             Pcodess:"",
//   //             Scodes01:"",
//   //             Scodess:"",
//   //             Exp_rate1:0,
//   //             Exp_rate2:0,
//   //             Exp_rate3:0,
//   //             Exp_rate4:0,
//   //             Exp_rate5:0,
//   //             Exp1:0,
//   //             Exp2:0,
//   //             Exp3:0,
//   //             Exp4:0,
//   //             Exp5:0,
//   //             exp_before: 0,
//   //             ctax: 0,
//   //             stax: 0,
//   //             itax: 0,
//   //             tariff: "",
//   //             vamt: 0,
//   //           }]);
//   //           setsupplierdetails([{
//   //             Vcode:"",
//   //             vacode: "",
//   //             gstno: "",
//   //             pan: "",
//   //             Add1:"",
//   //             city: "",
//   //             state: "",
//   //             Tcs206c1H:"",
//   //             TDS194Q:"",
//   //           }]);

//   //           setIsDisabled(true); // Disable fields after loading the default data
//   //       }
//   //   } catch (error) {
//   //       console.error("Errorss fetching data", error);
//   //   }
//   // };

//   const advanceRef = useRef(null);
//   const twoBRef = useRef(null);
//   const transportRef = useRef(null);
//   const brokerRef = useRef(null);
//   const tcsRef = useRef([]);
//   const tdsRef = useRef([]);
//   const tdsRef2 = useRef([]);
//   const GrRef = useRef(null);
//   const vehicelRef = useRef(null);
//   const cess1Ref = useRef(null);
//   const cess2Ref = useRef(null);

//   const handleKeyDowndown = (event, nextFieldRef) => {
//     if (event.key === "Enter") {
//       event.preventDefault(); // Prevent form submission
//       if (nextFieldRef.current) {
//         nextFieldRef.current.focus();
//       }
//     }
//   };
//   const gradientOptions = [
//     { label: "Lavender", value: "linear-gradient(to right, #e6e6fa, #b19cd9)" },
//     { label: "Yellow", value: "linear-gradient(to right, #fffac2, #ffdd57)" },
//     { label: "Skyblue", value: "linear-gradient(to right, #ceedf0, #7fd1e4)" },
//     { label: "Green", value: "linear-gradient(to right, #9ff0c3, #45a049)" },
//     { label: "Pink", value: "linear-gradient(to right, #ecc7cd, #ff9a9e)" },
//   ];

//   const [color, setColor] = useState(() => {
//     return localStorage.getItem("SelectedColorZ") || gradientOptions[0].value;
//   });

//   useEffect(() => {
//     localStorage.setItem("SelectedColorZ", color);
//   }, [color]);

//   const handleChange = (event) => {
//     setColor(event.target.value);
//   };
//   const handleInputChange = (index, field, value) => {
//     const numericValue = value.replace(/[^0-9.-]/g, ""); // Allow only numbers, decimal points, and negative signs
//     const updatedItems = [...items];
//     updatedItems[index][field] = numericValue;

//     // Recalculate expenses when Exp_rate1 to Exp_rate6 change
//     const vamt = parseFloat(updatedItems[index].amount) || 0;
//     const expRates = [
//       parseFloat(updatedItems[index].Exp_rate1) || 0,
//       parseFloat(updatedItems[index].Exp_rate2) || 0,
//       parseFloat(updatedItems[index].Exp_rate3) || 0,
//       parseFloat(updatedItems[index].Exp_rate4) || 0,
//       parseFloat(updatedItems[index].Exp_rate5) || 0,
//     ];
//     const expFields = ["Exp1", "Exp2", "Exp3", "Exp4", "Exp5"];

//     let totalExpenses = 0;
//     expRates.forEach((rate, i) => {
//       const expense = (vamt * rate) / 100;
//       updatedItems[index][expFields[i]] = expense.toFixed(2);
//       totalExpenses += expense;
//     });
//     // Update the exp_before field with the total of all expenses
//     updatedItems[index].exp_before = totalExpenses.toFixed(2);

//     const gst = parseFloat(updatedItems[index].gst);
//     const totalAccordingWeight =
//       parseFloat(updatedItems[index].weight) *
//       parseFloat(updatedItems[index].rate);
//     const totalAccordingPkgs =
//       parseFloat(updatedItems[index].pkgs) *
//       parseFloat(updatedItems[index].rate);
//     let RateCal = updatedItems[index].RateCal;
//     let TotalAcc = totalAccordingWeight; // Set a default value

//     if (
//       RateCal === "Default" ||
//       RateCal === "" ||
//       RateCal === null ||
//       RateCal === undefined
//     ) {
//       TotalAcc = totalAccordingWeight;
//     } else if (RateCal === "Wt/Qty") {
//       TotalAcc = totalAccordingWeight;
//     } else if (RateCal === "Pc/Pkgs") {
//       TotalAcc = totalAccordingPkgs;
//     }

//     const others = parseFloat(updatedItems[index].exp_before) || 0;
//     let disc = parseFloat(updatedItems[index].disc) || 0;
//     let per = ((disc / 100) * TotalAcc).toFixed(2);
//     let Amounts = TotalAcc + others + parseFloat(per);

//     // Ensure TotalAcc is a valid number before calling toFixed()
//     TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;
//     const gstNumber = "03";
//     const same = custGst.substring(0, 2);

//     let cgst = 0,
//       sgst = 0,
//       igst = 0;
//     if (gstNumber === same) {
//       cgst = (Amounts * (gst / 2)) / 100;
//       sgst = (Amounts * (gst / 2)) / 100;
//     } else {
//       igst = (Amounts * gst) / 100;
//     }

//     const totalWithGST = Amounts + cgst + sgst + igst;

//     // Update tax and total fields
//     updatedItems[index]["ctax"] = cgst.toFixed(2);
//     updatedItems[index]["stax"] = sgst.toFixed(2);
//     updatedItems[index]["itax"] = igst.toFixed(2);
//     updatedItems[index]["discount"] = parseFloat(per).toFixed(2);
//     updatedItems[index]["vamt"] = totalWithGST.toFixed(2); // ✅ Update the total amount (vamt)

//     setItems(updatedItems);
//     calculateTotalGst(); // ✅ Recalculate the grand total
//   };
//   useEffect(() => {
//     if (currentIndex !== null && items[currentIndex]) {
//       const updatedItems = [...items];
//       const item = { ...updatedItems[currentIndex] };

//       const vamt = parseFloat(item.amount) || 0;
//       const pkgs = parseFloat(item.pkgs) || 0;
//       const weight = parseFloat(item.weight) || 0;
//       // Expense Calculations (Separate Logic for Each Expense)
//       let Exp1 = 0,
//         Exp2 = 0,
//         Exp3 = 0,
//         Exp4 = 0,
//         Exp5 = 0;
//       const Exp1Multiplier = Pos === "-Ve" ? -1 : 1;
//       const Exp1Multiplier2 = Pos2 === "-Ve" ? -1 : 1;
//       const Exp1Multiplier3 = Pos3 === "-Ve" ? -1 : 1;
//       const Exp1Multiplier4 = Pos4 === "-Ve" ? -1 : 1;
//       const Exp1Multiplier5 = Pos5 === "-Ve" ? -1 : 1;
//       if (item.Exp_rate1) {
//         if (CalExp1 === "W" || CalExp1 === "w") {
//           Exp1 = (weight * parseFloat(item.Exp_rate1)) / 100;
//         } else if (CalExp1 === "P" || CalExp1 === "p") {
//           Exp1 = (pkgs * parseFloat(item.Exp_rate1)) / 100;
//         } else if (CalExp1 === "V" || CalExp1 === "v" || CalExp1 === "") {
//           Exp1 = (vamt * parseFloat(item.Exp_rate1)) / 100;
//         }
//         Exp1 *= Exp1Multiplier; // Apply negative only for Exp if Pos is "-Ve"
//         item.Exp1 = Exp1.toFixed(2);
//       } else {
//         item.Exp1 = "0.00";
//       }

//       if (item.Exp_rate2) {
//         if (CalExp2 === "W" || CalExp2 === "w") {
//           Exp2 = (weight * parseFloat(item.Exp_rate2)) / 100;
//         } else if (CalExp2 === "P" || CalExp2 === "p") {
//           Exp2 = (pkgs * parseFloat(item.Exp_rate2)) / 100;
//         } else if (CalExp2 === "V" || CalExp2 === "v" || CalExp2 === "") {
//           Exp2 = (vamt * parseFloat(item.Exp_rate2)) / 100;
//         }
//         Exp2 *= Exp1Multiplier2; // Apply negative only for Exp if Pos is "-Ve"
//         item.Exp2 = Exp2.toFixed(2);
//       } else {
//         item.Exp2 = "0.00";
//       }

//       if (item.Exp_rate3) {
//         if (CalExp3 === "W" || CalExp3 === "w") {
//           Exp3 = (weight * parseFloat(item.Exp_rate3)) / 100;
//         } else if (CalExp3 === "P" || CalExp3 === "p") {
//           Exp3 = (pkgs * parseFloat(item.Exp_rate3)) / 100;
//         } else if (CalExp3 === "V" || CalExp3 === "v" || CalExp3 === "") {
//           Exp3 = (vamt * parseFloat(item.Exp_rate3)) / 100;
//         }
//         Exp3 *= Exp1Multiplier3; // Apply negative only for Exp if Pos is "-Ve"
//         item.Exp3 = Exp3.toFixed(2);
//       } else {
//         item.Exp3 = "0.00";
//       }

//       if (item.Exp_rate4) {
//         if (CalExp4 === "W" || CalExp4 === "w") {
//           Exp4 = (weight * parseFloat(item.Exp_rate4)) / 100;
//         } else if (CalExp4 === "P" || CalExp4 === "p") {
//           Exp4 = (pkgs * parseFloat(item.Exp_rate4)) / 100;
//         } else if (CalExp4 === "V" || CalExp4 === "v" || CalExp4 === "") {
//           Exp4 = (vamt * parseFloat(item.Exp_rate4)) / 100;
//         }
//         Exp4 *= Exp1Multiplier4; // Apply negative only for Exp if Pos is "-Ve"
//         item.Exp4 = Exp4.toFixed(2);
//       } else {
//         item.Exp4 = "0.00";
//       }

//       if (item.Exp_rate5) {
//         if (CalExp5 === "W" || CalExp5 === "w") {
//           Exp5 = (weight * parseFloat(item.Exp_rate5)) / 100;
//         } else if (CalExp5 === "P" || CalExp5 === "p") {
//           Exp5 = (pkgs * parseFloat(item.Exp_rate5)) / 100;
//         } else if (CalExp5 === "V" || CalExp5 === "v" || CalExp5 === "") {
//           Exp5 = (vamt * parseFloat(item.Exp_rate5)) / 100;
//         }
//         Exp5 *= Exp1Multiplier5; // Apply negative only for Exp if Pos is "-Ve"
//         item.Exp5 = Exp5.toFixed(2);
//       } else {
//         item.Exp5 = "0.00";
//       }

//       // Total Expense Before GST
//       const totalExpenses = Exp1 + Exp2 + Exp3 + Exp4 + Exp5;
//       item.exp_before = totalExpenses.toFixed(2);

//       // GST & Total Calculations
//       const gst = parseFloat(item.gst) || 0;
//       const totalAccordingWeight =
//         (parseFloat(item.weight) || 0) * (parseFloat(item.rate) || 0);
//       const totalAccordingPkgs =
//         (parseFloat(item.pkgs) || 0) * (parseFloat(item.rate) || 0);
//       let RateCal = item.RateCal;
//       let TotalAcc =
//         RateCal === "Pc/Pkgs" ? totalAccordingPkgs : totalAccordingWeight;

//       let disc = parseFloat(item.disc) || 0;
//       let per = ((disc / 100) * TotalAcc).toFixed(2);
//       let Amounts = TotalAcc + totalExpenses + parseFloat(per);

//       TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;

//       // GST Logic Based on State
//       const gstNumber = "03";
//       const same = custGst.substring(0, 2);
//       let cgst = 0,
//         sgst = 0,
//         igst = 0;

//       if (gstNumber === same) {
//         cgst = (Amounts * (gst / 2)) / 100;
//         sgst = (Amounts * (gst / 2)) / 100;
//       } else {
//         igst = (Amounts * gst) / 100;
//       }

//       // Final Total Calculation
//       const totalWithGST = Amounts + cgst + sgst + igst;
//       if (T12) {
//         item.ctax = Math.round(cgst).toFixed(2);
//         item.stax = Math.round(sgst).toFixed(2);
//         item.itax = Math.round(igst).toFixed(2);
//         item.discount = Math.round(per).toFixed(2);
//         item.vamt = Math.round(totalWithGST).toFixed(2);
//       } else {
//         item.ctax = cgst.toFixed(2);
//         item.stax = sgst.toFixed(2);
//         item.itax = igst.toFixed(2);
//         item.discount = parseFloat(per).toFixed(2);
//         item.vamt = totalWithGST.toFixed(2);
//       }

//       updatedItems[currentIndex] = item;
//       setItems(updatedItems);
//       calculateTotalGst();
//     }
//   }, [
//     currentIndex,
//     items[currentIndex]?.amount,
//     items[currentIndex]?.Exp_rate1,
//     items[currentIndex]?.Exp_rate2,
//     items[currentIndex]?.Exp_rate3,
//     items[currentIndex]?.Exp_rate4,
//     items[currentIndex]?.Exp_rate5,
//     items[currentIndex]?.gst,
//     items[currentIndex]?.weight,
//     items[currentIndex]?.rate,
//     items[currentIndex]?.pkgs,
//     items[currentIndex]?.RateCal,
//   ]);

//   const handleOpenModalBack = (event, index, field) => {
//     if (event.key === "Backspace" && field === "accountname") {
//       setSelectedItemIndexCus(index);
//       setShowModalCus(true);
//       event.preventDefault();
//     }
//     if (event.key === "Backspace" && field === "vcode") {
//       setSelectedItemIndex(index);
//       setShowModal(true);
//       event.preventDefault();
//     }
//   };

//   const handleGross = (e) => {
//     const { id, value, type, checked } = e.target;
//     const val = type === "checkbox" ? checked : value; // Handle checkbox differently
//     setFormData({ ...formData, [id]: val });
//   };

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const openModal = () => {
//     //console.log("Modal opened");
//     setIsModalOpen(true);
//   };
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };
//   const [isModalOpenExp, setIsModalOpenExp] = useState(false);

//  const handleKeyDownExp = (e, fieldName, index) => {
//   if (e.key === "F2" && fieldName === "exp_before") {
//     e.preventDefault(); // Optional: stop default F2 behavior
//     setCurrentIndex(index);
//     setIsModalOpenExp(true);
//   }
// };
//   const closeModalExp = () => {
//     setIsModalOpenExp(false);
//   };
//   const [isModalOpenAfter, setIsModalOpenAfter] = useState(false);
//   const handleKeyDownAfter = (e) => {
//     if (e.key === "ArrowDown") {
//       setIsModalOpenAfter(true);
//     }
//   };
//   const closeModalAfter = () => {
//     setIsModalOpenAfter(false);
//     saveButtonRef.current.focus();
//   };

//   const handleDoubleClickAfter = (fieldName, index) => {
//     if (fieldName === "expafterGST" && isEditMode) {
//       setIsModalOpenAfter(true);
//       // Open another modal if needed
//     } else if (fieldName === "exp_before" && isEditMode) {
//       setCurrentIndex(index); // Set the current index
//       setIsModalOpenExp(true); // Open the modal
//     }
//   };
//   const handleExpAfterGst = (event) => {
//     const { id, value } = event.target;
//     const subTotal = parseFloat(formData.sub_total) || 0;

//     // Initialize newFormData and expenses
//     let newFormData = { ...formData, [id]: value };
//     let expense = 0;

//     // Check if the value is empty; if so, set corresponding Exp value to 0
//     if (value === "") {
//       newFormData[id] = 0; // Ensure Exp_rate is set to 0
//     } else {
//       const expRate = parseFloat(value) || 0;

//       // Calculate percentage for Exp_rate7 to Exp_rate12
//       switch (id) {
//         case "Exp_rate7":
//           newFormData.Exp7 = ((subTotal * expRate) / 100).toFixed(2);
//           break;
//         case "Exp_rate8":
//           newFormData.Exp8 = ((subTotal * expRate) / 100).toFixed(2);
//           break;
//         case "Exp_rate9":
//           newFormData.Exp9 = ((subTotal * expRate) / 100).toFixed(2);
//           break;
//         case "Exp_rate10":
//           newFormData.Exp10 = ((subTotal * expRate) / 100).toFixed(2);
//           break;
//         case "Exp_rate11":
//           newFormData.Exp11 = ((subTotal * expRate) / 100).toFixed(2);
//           break;
//         case "Exp_rate12":
//           newFormData.Exp12 = ((subTotal * expRate) / 100).toFixed(2);
//           break;
//         default:
//           break;
//       }
//     }

//     // Calculate total of Exp7 to Exp12 and update expafterGST
//     const totalExpenses =
//       parseFloat(newFormData.Exp7 || 0) +
//       parseFloat(newFormData.Exp8 || 0) +
//       parseFloat(newFormData.Exp9 || 0) +
//       parseFloat(newFormData.Exp10 || 0) +
//       parseFloat(newFormData.Exp11 || 0) +
//       parseFloat(newFormData.Exp12 || 0);

//     newFormData.expafterGST = totalExpenses.toFixed(2);

//     setFormData(newFormData);
//   };

//   // Update the blur handlers so that they always format the value to 2 decimals.
//   const handlePkgsBlur = (index) => {
//     const decimalPlaces = pkgsValue;
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
//     if (isNaN(value)) {
//       value = 0;
//     }
//     updatedItems[index].weight = value.toFixed(decimalPlaces) || 0;
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

//   const handleBlur = (index, field) => {
//     const decimalPlaces = 2;
//     const updatedItems = [...items];
//     let value = parseFloat(updatedItems[index][field]);
//     if (isNaN(value)) {
//       value = 0;
//     }
//     updatedItems[index][field] = value.toFixed(decimalPlaces);
//     setItems(updatedItems);
//   };
//   const handleKeyDownTab = (e) => {
//     if (e.key === "Tab") {
//       e.preventDefault(); // prevent default Tab behavior
//       customerNameRef.current.focus(); // move focus to vaCode2 input
//     }
//   };

//   const printRef = useRef();
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//          const openPrintMenu = () => {
//           setIsMenuOpen(true);
//       };
  
//       const closePrintMenu = () => {
//           setIsMenuOpen(false);
//       };
//     const handlePrint = useReactToPrint({
//       content: () => printRef.current,
//       onAfterPrint: () => setOpen(false), // auto-close after print
//     });
  
//     const handlePrintClick = () => {
//     setOpen(true);
//     setTimeout(() => {
//       handlePrint();
//       setOpen(false); // hide right after print
//     }, 300);
//     };
//   return (
//     <div>
//       <div>
//         <ToastContainer />
//       </div>
//       <div style={{ visibility: "hidden", width: 0, height: 0 }}>
//         {SelectedInvoiceComponent && (
//           <SelectedInvoiceComponent
//             formData={formData}
//             items={items}
//             supplierdetails={supplierdetails}
//             isOpen={open}
//             handleClose={handleCloseInvoice}
//             componentRef={printRef} // pass the ref
//             selectedCopies={selectedCopies}
//           />
//         )}
//       </div>
//       <div style={{ display: "flex", flexDirection: "row", marginTop: -30 }}>
//         <h1 className="headerSale">
//           PURCHASE GST{" "}
//           <span className="text-black-500 font-semibold text-base sm:text-lg">
//             {title}
//           </span>
//         </h1>
//       </div>
//       <div className="pur_toppart ">
//         <div className="Dated ">
//           <DatePicker
//             ref={datePickerRef}
//             selected={selectedDate || null}
//             openToDate={new Date()}
//             onCalendarClose={handleCalendarClose}
//             dateFormat="dd-MM-yyyy"
//             onChange={handleDateChange}
//             onBlur={() => validateDate(selectedDate)}
//             customInput={<MaskedInput />}
//           />
//           {/* <DatePicker
//             popperClassName="custom-datepicker-popper"
//             ref={datePickerRef}
//             className="DatePICKER"
//             id="date"
//             selected={selectedDate || null}
//             openToDate={new Date()}
//             onCalendarClose={handleCalendarClose}
//             dateFormat="dd-MM-yyyy"
//             onChange={handleDateChange}
//             onBlur={() => validateDate(selectedDate)} // ✅ call on blur
//             onChangeRaw={(e) => {
//               if (!e.target.value) return; // ✅ avoid undefined error

//               let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
//               if (val.length > 2) val = val.slice(0, 2) + "-" + val.slice(2);
//               if (val.length > 5) val = val.slice(0, 5) + "-" + val.slice(5, 9);

//               e.target.value = val; // Show formatted input
//             }}
//             readOnly={!isEditMode || isDisabled}
//           /> */}
//           <div className="billdivz">
//             <TextField
//               className="billzNo custom-bordered-input"
//               id="vno"
//               value={formData.vno}
//               variant="filled"
//               size="small"
//               label="V.NO"
//               onKeyDown={handleKeyDownTab} // Handle Tab key here
//               inputProps={{
//                 maxLength: 48,
//                 style: {
//                   height: "20px",
//                   fontSize: `${fontSize}px`,
//                   // padding: "0 8px"
//                 },
//                 readOnly: !isEditMode || isDisabled,
//               }}
//             />
//           </div>
//           <div className="Setup">
//             <button
//               className="Button"
//               style={{backgroundColor:"blue",color:'white',fontWeight:'bold'}}
//               onClick={openModal}
//               >
//                 SETUP
//               </button>

//               {/* Settings Button */}
//               <button
//                 onClick={() => setDrawerOpen(true)}
//                 className="Setting text-xl text-blue-700"
//               >
//                 <FaCog />
//               </button>
//             {/* Fullscreen Overlay Drawer */}
//             {drawerOpen && (
//               <div style={{zIndex:10000}}>
//                 {/* Background Overlay */}
//                 <div
//                   className="fixed inset-0 bg-black bg-opacity-50 z-40"
//                   onClick={() => setDrawerOpen(false)}
//                 ></div>

//                 {/* Drawer Panel */}
//                 <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
//                   {/* Drawer Header */}
//                   <div className="flex justify-between items-center px-4 py-3 border-b">
//                     <span className="font-bold text-lg">Options</span>
//                     <button
//                       onClick={() => setDrawerOpen(false)}
//                       className="text-xl text-gray-600"
//                     >
//                       <FaTimes />
//                     </button>
//                   </div>

//                   {/* Drawer Body */}
//                   <div className="flex flex-col p-4 gap-3">
//                     {/* Color Selector */}
//                     <select
//                       className="border border-gray-400 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                       value={color}
//                       onChange={handleChange}
//                     >
//                       {gradientOptions.map((option, index) => (
//                         <option key={index} value={option.value}>
//                           {option.label}
//                         </option>
//                       ))}
//                     </select>

//                     {/* Font Size Buttons */}
//                     {/* <div className="flex gap-2">
//                       <button
//                         onClick={decreaseFontSize}
//                         className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center text-lg"
//                       >
//                         <FaMinus />
//                       </button>

//                       <button
//                         onClick={increaseFontSize}
//                         className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center text-lg"
//                       >
//                         <FaPlus />
//                       </button>
//                     </div> */}
//                   <div style={{ display: "flex", flexWrap: "wrap",flexDirection:'column'}}>
//                     <span style={{fontSize:17,fontWeight:'bold'}}>SELECT TABLE FIELDS</span>
//                     <div style={{marginTop:"10px",display:'flex',flexDirection:"column"}}>
//                     {Object.keys(tableData).map((field) => (
//                       <label key={field} style={{ marginRight: "15px",fontSize:16 }}>
//                         <input
//                         style={{height:"15px",width:"15px"}}
//                           type="checkbox"
//                           checked={tableData[field]}
//                           onChange={() => handleCheckboxChange(field)}
//                         />
//                         &nbsp;{field.toUpperCase()}
//                       </label>
//                     ))}
//                     </div>
//                   </div>
//                   </div>
//                 </div>
              
//               </div>
//             )}
//           </div>
//           {isModalOpen && <PurchaseSetup onClose={closeModal} />}
//         </div>
//         <div className="TopFields">
//           {supplierdetails.map((item, index) => (
//             <div key={item.vacode}>
//               <div className="CUS">
//                 <div className="customerdiv">
//                   <TextField
//                     inputRef={customerNameRef}
//                     label="CUSTOMER NAME"
//                     variant="filled"
//                     size="small"
//                     value={item.vacode}
//                     className="customerNAME custom-bordered-input"
//                     onKeyDown={(e) => {
//                       handleEnterKeyPress(customerNameRef, grNoRef)(e);
//                       handleKeyDown(e, index, "accountname");
//                       handleOpenModalBack(e, index, "accountname");
//                     }}
//                     onDoubleClick={(e) => {
//                       handleDoubleClickAfter(e, "accountname", index);
//                     }}
//                     onFocus={(e) => e.target.select()}
//                     inputProps={{
//                       maxLength: 48,
//                       style: {
//                         height: "20px",
//                         fontSize: `${fontSize}px`,
//                       },
//                       readOnly: !isEditMode || isDisabled,
//                     }}
//                   />
//                 </div>
//                 <div className="citydivZ">
//                   <TextField
//                     className="cityName custom-bordered-input"
//                     value={item.city}
//                     variant="filled"
//                     label="CITY"
//                     size="small"
//                     inputProps={{
//                       maxLength: 48,
//                       style: {
//                         height: "20px",
//                         fontSize: `${fontSize}px`,
//                         // padding: "0 8px",
//                       },
//                       readOnly: !isEditMode || isDisabled,
//                     }}
//                     onChange={(e) =>
//                       handleItemChangeCus(index, "city", e.target.value)
//                     }
//                     onFocus={(e) => e.target.select()}
//                   />
//                 </div>
//               </div>
//               <div className="GST">
//                 <div>
//                   <TextField
//                     className="gstnoZ custom-bordered-input"
//                     value={item.gstno}
//                     variant="filled"
//                     size="small"
//                     label="GST NO"
//                     inputProps={{
//                       maxLength: 48,
//                       style: {
//                         height: "20px",
//                         fontSize: `${fontSize}px`,
//                         // padding: "0 8px",
//                       },
//                       readOnly: !isEditMode || isDisabled,
//                     }}
//                     onChange={(e) =>
//                       handleItemChangeCus(index, "gstNumber", e.target.value)
//                     }
//                     onFocus={(e) => e.target.select()}
//                   />
//                 </div>
//                 <div className="pandivZ">
//                   <TextField
//                     className="PANNoZ custom-bordered-input"
//                     value={item.pan}
//                     variant="filled"
//                     size="small"
//                     label="PAN NO"
//                     inputProps={{
//                       maxLength: 48,
//                       style: {
//                         height: "20px",
//                         fontSize: `${fontSize}px`,
//                         // padding: "0 8px",
//                       },
//                       readOnly: !isEditMode || isDisabled,
//                     }}
//                     onChange={(e) =>
//                       handleItemChangeCus(index, "PanNo", e.target.value)
//                     }
//                     onFocus={(e) => e.target.select()}
//                   />
//                 </div>
//               </div>
//             </div>
//           ))}
//           {showModalCus && (
//           <ProductModalCustomer
//             allFields={allFieldsCus}
//             onSelect={handleProductSelectCus}
//             onClose={handleCloseModalCus}
//             initialKey={pressedKey}
//             tenant={tenant}
//           />
//           )}
//           <div className="BillDate">
//             <TextField
//               inputRef={vBillNoRef}
//               className="VbillzNo custom-bordered-input"
//               id="vbillno"
//               value={formData.vbillno}
//               variant="filled"
//               size="small"
//               label="BILL NO"
//               onChange={handleCapitalAlpha}
//               onKeyDown={handleEnterKeyPress(vBillNoRef, grNoRef)}
//               inputProps={{
//                 maxLength: 48,
//                 style: {
//                   height: "20px",
//                   fontSize: `${fontSize}px`,
//                   // padding: "0 8px"
//                 },
//                 readOnly: !isEditMode || isDisabled,
//               }}
//             />
//             <DatePicker
//               className="DatePICKERP"
//               id="date"
//               selected={selectedDate}
//               onChange={(date) => setSelectedDate(date)}
//               dateFormat="dd-MM-yyyy"
//             />
//           </div>
//           <div className="GRNo">
//             <TextField
//               inputRef={grNoRef}
//               className="GRNOZ custom-bordered-input"
//               id="gr"
//               label="GR NO"
//               value={formData.gr}
//               variant="filled"
//               size="small"
//               onChange={handleNumberChange}
//               onKeyDown={handleEnterKeyPress(grNoRef, termsRef)}
//               onFocus={(e) => e.target.select()}
//               inputProps={{
//                 maxLength: 12,
//                 style: {
//                   height: "20px",
//                   fontSize: `${fontSize}px`,
//                   // padding: "0 8px"
//                 },
//                 readOnly: !isEditMode || isDisabled,
//               }}
//             />
//             <div className="ExFor">
//               <TextField
//                 inputRef={termsRef}
//                 className="custom-bordered-input"
//                 id="exfor"
//                 value={formData.exfor}
//                 variant="filled"
//                 label="TERMS"
//                 size="small"
//                 onChange={HandleInputsChanges}
//                 onKeyDown={handleEnterKeyPress(termsRef, vehicleNoRef)}
//                 onFocus={(e) => e.target.select()}
//                 inputProps={{
//                   maxLength: 10,
//                   style: {
//                     height: "20px",
//                     fontSize: `${fontSize}px`,
//                     // padding: "0 8px"
//                   },
//                   readOnly: !isEditMode || isDisabled,
//                 }}
//                 // sx={{ width: 128,mt:0.5 }}
//               />
//             </div>
//           </div>
//           <div className="VehicleDiv">
//             <TextField
//               inputRef={vehicleNoRef}
//               className="VEHICLE custom-bordered-input"
//               id="trpt"
//               value={formData.trpt}
//               variant="filled"
//               label="VEHICLE NO."
//               size="small"
//               onChange={handleCapitalAlpha}
//               onKeyDown={handleEnterKeyPress(vehicleNoRef, selfInvRef)}
//               onFocus={(e) => e.target.select()}
//               inputProps={{
//                 maxLength: 48,
//                 style: {
//                   height: "20px",
//                   fontSize: `${fontSize}px`,
//                   // padding: "0 8px"
//                 },
//                 readOnly: !isEditMode || isDisabled,
//               }}
//             />
//             <div className="SELFinv">
//               <TextField
//                 inputRef={selfInvRef}
//                 className="custom-bordered-input"
//                 id="p_entry"
//                 value={formData.p_entry}
//                 variant="filled"
//                 label="SELF INV#"
//                 size="small"
//                 onChange={HandleInputsChanges}
//                 onKeyDown={handleEnterKeyPress(selfInvRef, null)}
//                 onFocus={(e) => e.target.select()}
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: "20px",
//                     fontSize: `${fontSize}px`,
//                     // padding: "0 8px"
//                   },
//                   readOnly: !isEditMode || isDisabled,
//                 }}
//               />
//             </div>
//           </div>
//           <div className="TAXDiv">
//             <div>
//               <FormControl
//                 fullWidth
//                 size="small"
//                 variant="filled"
//                 className="custom-bordered-input"
//                 sx={{
//                   fontSize: `${fontSize}px`,
//                   "& .MuiFilledInput-root": {
//                     height: 47, // adjust as needed (default ~56px for filled)
//                   },
//                 }}
//               >
//                 <InputLabel id="taxtype-label">TAX TYPE</InputLabel>
//                 <Select
//                   className="TAXtypez custom-bordered-input"
//                   labelId="taxtype-label"
//                   id="stype"
//                   value={formData.stype}
//                   onChange={(e) => {
//                   if (!isEditMode || isDisabled) return; // prevent changing
//                     handleTaxType(e);
//                   }}
//                   onOpen={(e) => {
//                     if (!isEditMode || isDisabled) {
//                       e.preventDefault(); // prevent dropdown opening
//                     }
//                   }}
//                   // onChange={handleTaxType}
//                   label="TAX TYPE"
//                   displayEmpty
//                   MenuProps={{
//                     disablePortal: true,
//                   }}
//                   inputProps={{
//                     sx: {
//                       fontSize: `${fontSize}px`,
//                       pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
//                     },
//                   }}
//                 >
//                   <MenuItem value="">
//                     <em></em>
//                   </MenuItem>
//                   <MenuItem value="GST Sale (RD)">GST Sale (RD)</MenuItem>
//                   <MenuItem value="IGST Sale (RD)">IGST Sale (RD)</MenuItem>
//                   <MenuItem value="GST (URD)">GST (URD)</MenuItem>
//                   <MenuItem value="IGST (URD)">IGST (URD)</MenuItem>
//                   <MenuItem value="Tax Free Within State">
//                     Tax Free Within State
//                   </MenuItem>
//                   <MenuItem value="Tax Free Interstate">
//                     Tax Free Interstate
//                   </MenuItem>
//                   <MenuItem value="Export Sale">Export Sale</MenuItem>
//                   <MenuItem value="Export Sale(IGST)">
//                     Export Sale(IGST)
//                   </MenuItem>
//                   <MenuItem value="Including GST">Including GST</MenuItem>
//                   <MenuItem value="Including IGST">Including IGST</MenuItem>
//                   <MenuItem value="Not Applicable">Not Applicable</MenuItem>
//                   <MenuItem value="Exempted Sale">Exempted Sale</MenuItem>
//                 </Select>
//               </FormControl>
//             </div>
//             <div style={{ marginTop: 3 }}>
//               <FormControl
//                 className="SupplyTYPE custom-bordered-input"
//                 sx={{
//                   // width: '250px',
//                   fontSize: `${fontSize}px`,
//                   "& .MuiFilledInput-root": {
//                     height: 47, // adjust as needed (default ~56px for filled)
//                   },
//                 }}
//                 size="small"
//                 variant="filled"
//               >
//                 <InputLabel id="supply-label">SUPPLY TYPE</InputLabel>
//                 <Select
//                   className="SupplyTYPE custom-bordered-input"
//                   labelId="supply-label"
//                   id="supply"
//                   value={formData.conv}
//                    onChange={(e) => {
//                   if (!isEditMode || isDisabled) return; // prevent changing
//                     handleSupply(e);
//                   }}
//                   onOpen={(e) => {
//                     if (!isEditMode || isDisabled) {
//                       e.preventDefault(); // prevent dropdown opening
//                     }
//                   }}
//                   // onChange={handleSupply}
//                   label="SUPPLY TYPE"
//                   displayEmpty
//                   inputProps={{
//                     sx: {
//                       fontSize: `${fontSize}px`,
//                       pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
//                     },
//                   }}
//                   MenuProps={{ disablePortal: true }}
//                 >
//                   <MenuItem value="">
//                     <em></em>
//                   </MenuItem>
//                   <MenuItem value="Manufacturing Sale">
//                     1. Manufacturing Sale
//                   </MenuItem>
//                   <MenuItem value="Trading Sale">2. Trading Sale</MenuItem>
//                 </Select>
//               </FormControl>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Table content */}
//       <div className="tablestylez">
//         <Table ref={tableRef} className="custom-table">
//           <thead
//             style={{
//               background: color,
//               textAlign: "center",
//               position: "sticky",
//               top: 0,
//             }}
//           >
//             <tr style={{ color: "#575a5a" }}>
//             {tableData.itemcode && <th>ITEMCODE</th>}
//             {tableData.sdisc && <th>DESCRIPTION</th>}
//             {tableData.hsncode && <th>HSNCODE</th>}
//             {tableData.pcs && <th>PCS</th>}
//             {tableData.qty && <th>QTY</th>}
//             {tableData.rate && <th>RATE</th>}
//             {tableData.amount && <th>AMOUNT</th>}
//             {tableData.discount && <th>DIS@</th>}
//             {tableData.discount && <th>DISCOUNT</th>}
//             {tableData.gst && <th>GST</th>}
//             {tableData.others && <th>OTHERS</th>}
//             {tableData.cgst && <th>CGST</th>}
//             {tableData.sgst && <th>SGST</th>}
//             {tableData.igst && <th>IGST</th>}
//             {isEditMode && <th className="text-center">DELETE</th>}
//             </tr>
//           </thead>
//           <tbody style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}>
//             {items.map((item, index) => (
//               <tr key={item.id}>
//                 {tableData.itemcode && (
//                 <td style={{ padding: 0, width: 30 }}>
//                   <input
//                     className="ItemCode"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
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
//                       handleOpenModal(e, index, "vcode");
//                       handleOpenModalBack(e, index, "vcode");
//                     }}
//                     onDoubleClick={(e) => {
//                      handleDoubleClickAfter(e,"vcode", index)
//                     }}
//                     ref={(el) => (itemCodeRefs.current[index] = el)}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                   />
//                 </td>
//                 )}
//                 {tableData.sdisc && (
//                 <td style={{ padding: 0, width: 300 }}>
//                   <input
//                     className="desc"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                     }}
//                     maxLength={48}
//                     value={item.sdisc}
//                     readOnly={!isEditMode || isDisabled}
//                     onChange={(e) =>
//                       handleItemChange(index, "sdisc", e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "sdisc");
//                     }}
//                     ref={(el) => (desciptionRefs.current[index] = el)}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                   />
//                 </td>
//                 )}
//                 {tableData.hsncode && (
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Hsn"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     maxLength={8}
//                     readOnly={!isEditMode || isDisabled}
//                     value={item.tariff}
//                     onChange={(e) =>
//                       handleItemChange(index, "tariff", e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "tariff");
//                     }}
//                     ref={(el) => (hsnCodeRefs.current[index] = el)}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                   />
//                 </td>
//                   )}
//                 {tableData.pcs && (
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
//                       fontSize: `${fontSize}px`,
//                     }}
//                     maxLength={48}
//                     readOnly={!isEditMode || isDisabled}
//                     value={item.pkgs} // Show raw value during input
//                     onChange={(e) =>
//                       handleItemChange(index, "pkgs", e.target.value)
//                     }
//                     onBlur={() => handlePkgsBlur(index)} // Format value on blur
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "pkgs");
//                     }}
//                     ref={(el) => (peciesRefs.current[index] = el)}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                   />
//                 </td>
//                   )}
//                 {tableData.qty && (
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
//                       fontSize: `${fontSize}px`,
//                     }}
//                     maxLength={48}
//                     readOnly={!isEditMode || isDisabled}
//                     value={item.weight} // Show raw value during input
//                     onChange={(e) =>
//                       handleItemChange(index, "weight", e.target.value)
//                     }
//                     onBlur={() => handleWeightBlur(index)} // Format value on blur
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "weight");
//                     }}
//                     ref={(el) => (quantityRefs.current[index] = el)}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                   />
//                 </td>
//                   )}
//                 {tableData.rate && (
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
//                       fontSize: `${fontSize}px`,
//                     }}
//                     maxLength={48}
//                     readOnly={!isEditMode || isDisabled}
//                     value={item.rate} // Show raw value during input
//                     onChange={(e) =>
//                       handleItemChange(index, "rate", e.target.value)
//                     }
//                     onBlur={() => handleRateBlur(index)} // Format value on blur
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "rate");
//                     }}
//                     ref={(el) => (priceRefs.current[index] = el)}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                   />
//                 </td>
//                   )}
//                 {tableData.amount && (
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Amount"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     maxLength={48}
//                     readOnly={!isEditMode || isDisabled}
//                     value={item.amount}
//                     onChange={(e) =>
//                       handleItemChange(index, "amount", e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "amount");
//                     }}
//                     ref={(el) => (amountRefs.current[index] = el)}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                     min="0"
//                   />
//                 </td>
//                   )}
//                 {tableData.discount && (
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Disc"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     value={item.disc}
//                     onChange={(e) =>
//                       handleItemChange(index, "disc", e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "disc");
//                     }}
//                     onBlur={() => handleBlur(index, "disc")}
//                     ref={(el) => (discountRef.current[index] = el)}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                     readOnly={!isEditMode || isDisabled}
//                   />
//                 </td>
//                   )}
//                 {tableData.discount && (
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="discount"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     value={item.discount}
//                     onChange={(e) =>
//                       handleItemChange(index, "discount", e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "discount");
//                     }}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                     ref={(el) => (discount2Ref.current[index] = el)}
//                     onBlur={() => handleBlur(index, "discount")}
//                     readOnly={!isEditMode || isDisabled}
//                   />
//                 </td>
//                 )}
//                 {tableData.gst && (
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Others"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "center",
//                     }}
//                     maxLength={2}
//                     value={item.gst +"%"}
//                     readOnly={!isEditMode || isDisabled}
//                   />
//                 </td>
//                 )}
//                 {tableData.others && (
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="Others"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                     }}
//                     maxLength={48}
//                     type="text"
//                     value={item.exp_before}
//                     readOnly={!isEditMode || isDisabled}
//                     onDoubleClick={() =>
//                       handleDoubleClickAfter("exp_before", index)
//                     } // Pass index here
//                     // onChange={(e) => handleItemChange(index, "exp_before", e.target.value)}
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "exp_before");
//                        handleKeyDownExp(e, "exp_before", index)
//                     }}
//                     onFocus={(e) => {
//                       e.target.select(); // Select the entire text when the field is focused
//                       if (WindowBefore) {
//                         setCurrentIndex(index);
//                         setIsModalOpenExp(true);
//                       }
//                     }}
//                     ref={(el) => (othersRefs.current[index] = el)}
//                   />
//                 </td>
//                 )}
//                 {isModalOpenExp && currentIndex !== null && (
//                   <div className="Modal">
//                     <div className="Modal-content">
//                       <h1 className="headingE">ADD/LESS BEFORE GST</h1>
//                       <div className="form-group">
//                         <input
//                           type="checkbox"
//                           id="gross"
//                           checked={items[currentIndex]?.gross || false}
//                           onChange={(e) =>
//                             handleInputChange(
//                               currentIndex,
//                               "gross",
//                               e.target.checked
//                             )
//                           }
//                         />
//                         <label
//                           style={{ marginLeft: 5 }}
//                           className="label"
//                           htmlFor="Gross"
//                         >
//                           GROSS
//                         </label>
//                       </div>
//                       {[
//                         { label: Expense1, rate: "Exp_rate1", value: "Exp1" },
//                         { label: Expense2, rate: "Exp_rate2", value: "Exp2" },
//                         { label: Expense3, rate: "Exp_rate3", value: "Exp3" },
//                         { label: Expense4, rate: "Exp_rate4", value: "Exp4" },
//                         { label: Expense5, rate: "Exp_rate5", value: "Exp5" },
//                       ].map((field, idx) => (
//                         <div
//                           key={idx}
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "space-between",
//                             gap: "10px", // Spacing between items
//                             marginBottom: "10px", // Space between rows
//                           }}
//                         >
//                           <label style={{ width: "100px", fontWeight: "bold" }}>
//                             {field.label}
//                           </label>

//                           <input
//                             value={items[currentIndex][field.rate]}
//                             style={{
//                               border: "1px solid black",
//                               padding: "5px",
//                               width: "120px",
//                               textAlign: "right",
//                               borderRadius: "4px",
//                             }}
//                             onChange={(e) =>
//                               handleInputChange(
//                                 currentIndex,
//                                 field.rate,
//                                 e.target.value
//                               )
//                             }
//                           />

//                           <input
//                             value={items[currentIndex][field.value]}
//                             style={{
//                               border: "1px solid black",
//                               padding: "5px",
//                               width: "120px",
//                               textAlign: "right",
//                               borderRadius: "4px",
//                             }}
//                             onChange={(e) =>
//                               handleInputChange(
//                                 currentIndex,
//                                 field.value,
//                                 e.target.value
//                               )
//                             }
//                           />
//                         </div>
//                       ))}
//                       <Button
//                         onClick={() => {
//                           setIsModalOpenExp(false);
//                           setCurrentIndex(null); // Reset the index when closing the modal
//                           handleAddItem();
//                         }}
//                         style={{
//                           borderColor: "transparent",
//                           backgroundColor: "red",
//                           marginTop: 10,
//                         }}
//                       >
//                         CLOSE
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//                 {tableData.cgst && (
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="CTax"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                       color: "black",
//                     }}
//                     maxLength={48}
//                     disabled
//                     value={item.ctax}
//                     onChange={(e) =>
//                       handleItemChange(index, "ctax", e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "ctax");
//                     }}
//                     ref={(el) => (cgstRefs.current[index] = el)}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                   />
//                 </td>
//                 )}
//                 {tableData.sgst && (
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="STax"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                       color: "black",
//                     }}
//                     maxLength={48}
//                     disabled
//                     value={item.stax}
//                     onChange={(e) =>
//                       handleItemChange(index, "stax", e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "stax");
//                     }}
//                     ref={(el) => (sgstRefs.current[index] = el)}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                     min="0"
//                   />
//                 </td>
//                 )}
//                 {tableData.igst && (
//                 <td style={{ padding: 0 }}>
//                   <input
//                     className="ITax"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                       textAlign: "right",
//                       color: "black",
//                     }}
//                     maxLength={48}
//                     disabled
//                     value={item.itax}
//                     onChange={(e) =>
//                       handleItemChange(index, "itax", e.target.value)
//                     }
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "itax");
//                     }}
//                     ref={(el) => (igstRefs.current[index] = el)}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                     min="0"
//                   />
//                 </td>
//                 )}
//                 {isEditMode && (
//                 <td style={{ padding: 0}}>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",  // horizontally center
//                       alignItems: "center",      // vertically center
//                       height: "100%",            // takes full cell height
//                     }}
//                   >
//                     <IconButton
//                       color="error"
//                       onClick={() => handleDeleteItem(index)}
//                       size="small"
//                       tabIndex={-1} // ✅ prevent focus when tabbing
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </div>
//                 </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//           <tfoot style={{ background: color, position: "sticky", bottom: -6, fontSize: `${fontSize}px`,borderTop:"1px solid black" }}>
//           <tr style={{ fontWeight: "bold", textAlign: "right" }}>
//             {tableData.itemcode && <td></td>}
//             {tableData.sdisc && <td>TOTAL</td>}
//             {tableData.hsncode && <td></td>}
//             {tableData.pcs && (
//               <td>{items.reduce((sum, item) => sum + parseFloat(item.pkgs || 0), 0).toFixed(pkgsValue)}</td>
//             )}
//             {tableData.qty && (
//               <td>{items.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0).toFixed(weightValue)}</td>
//             )}
//             {tableData.rate && <td></td>}
//             {tableData.amount && (
//               <td>{items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2)}</td>
//             )}
//             {tableData.discount && (
//               <>
//                 <td>{items.reduce((sum, item) => sum + parseFloat(item.disc || 0), 0).toFixed(2)}</td>
//                 <td>{items.reduce((sum, item) => sum + parseFloat(item.discount || 0), 0).toFixed(2)}</td>
//               </>
//             )}
//             {tableData.gst && <td></td>}
//             {tableData.others && (
//               <td>{items.reduce((sum, item) => sum + parseFloat(item.exp_before || 0), 0).toFixed(2)}</td>
//             )}
//             {tableData.cgst && (
//               <td>{items.reduce((sum, item) => sum + parseFloat(item.ctax || 0), 0).toFixed(2)}</td>
//             )}
//             {tableData.sgst && (
//               <td>{items.reduce((sum, item) => sum + parseFloat(item.stax || 0), 0).toFixed(2)}</td>
//             )}
//             {tableData.igst && (
//               <td>{items.reduce((sum, item) => sum + parseFloat(item.itax || 0), 0).toFixed(2)}</td>
//             )}
//             {isEditMode && <td></td>}
//           </tr>
//           </tfoot>
//         </Table>
//       </div>
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

//       <div className="Belowcontents">
//         <div className="bottomcontainer1">
//           <div
//             style={{ display: "flex", flexDirection: "column", marginLeft: 5 }}
//           >
//             <div>
//               <TextField
//                 id="vacode1"
//                 label="2B STATUS"
//                 value={formData.vacode1}
//                 onChange={HandleInputsChanges}
//                 onKeyDown={(e) => {
//                   handleKeyDowndown(e, transportRef);
//                 }}
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                   },
//                 }}
//                 size="small"
//                 variant="filled"
//                 className="Remz custom-bordered-input"
//                 // sx={{ width: 250 }} // Adjust width as needed
//               />
//             </div>
//             <div>
//               <TextField
//                 inputRef={transportRef}
//                 id="v_tpt"
//                 label="TRANSPORT"
//                 value={formData.v_tpt}
//                 onChange={HandleInputsChanges}
//                 onKeyDown={(e) => {
//                   handleOpenModalTpt(e, "v_tpt", "v_tpt");
//                   handleKeyDowndown(e, brokerRef);
//                 }}
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                     readOnly: !isEditMode || isDisabled,
//                   },
//                 }}
//                 size="small"
//                 variant="filled"
//                 className="Remz custom-bordered-input"
//                 // sx={{ width: 250 }} // Adjust width as needed
//               />
//             </div>
//             <div>
//               <TextField
//                 inputRef={brokerRef}
//                 id="broker"
//                 label="BROKER"
//                 value={formData.broker}
//                 onChange={HandleInputsChanges}
//                 onKeyDown={(e) => {
//                   handleOpenModalTpt(e, "broker", "broker");
//                   handleKeyDowndown(e, expAfterGSTRef);
//                 }}
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                     readOnly: !isEditMode || isDisabled,
//                   },
//                 }}
//                 size="small"
//                 variant="filled"
//                 className="Remz custom-bordered-input"
//                 // sx={{ width: 250 }} // Adjust width as needed
//               />
//             </div>
//           </div>
//           <div
//             style={{ display: "flex", flexDirection: "column", marginLeft: 5 }}
//           >
//             <div>
//               <FormControl
//                 variant="filled"
//                 size="small"
//                 // disabled={!isEditMode || isDisabled}
//                 sx={{
//                   // width: '100%', // Let width be controlled by content or parent
//                   "& .MuiFilledInput-root": {
//                     height: 48, // Match your original height
//                   },
//                 }}
//                 className="TDSon custom-bordered-input"
//               >
//                 <InputLabel
//                   id="tdson"
//                   sx={{
//                     fontSize: "1rem",
//                     fontWeight: 600,
//                   }}
//                 >
//                   TDS ON
//                 </InputLabel>
//                 <Select
//                   labelId="tdson"
//                   className="TDSon custom-bordered-input"
//                   id="tdson"
//                   value={formData.tdson}
//                   onChange={(e) => {
//                   if (!isEditMode || isDisabled) return; // prevent changing
//                     handleTdsOn(e);
//                   }}
//                   onOpen={(e) => {
//                     if (!isEditMode || isDisabled) {
//                       e.preventDefault(); // prevent dropdown opening
//                     }
//                   }}
//                   // onChange={handleTdsOn}
//                   displayEmpty
//                   inputProps={{ "aria-label": "Without label" }}
//                   sx={{
//                     color: "red",
//                     fontWeight: "bold",
//                     fontSize: `${fontSize}px`, // 👈 Dynamic font size
//                     backgroundColor: (!isEditMode || isDisabled) ? "#f0f0f0" : "white", // mimic disabled style
//                     pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
//                   }}
//                   MenuProps={{ disablePortal: true }}
//                 >
//                   <MenuItem value="Interest">Interest</MenuItem>
//                   <MenuItem value="Freight">Freight</MenuItem>
//                   <MenuItem value="Brokerage">Brokerage</MenuItem>
//                   <MenuItem value="Commission">Commission</MenuItem>
//                   <MenuItem value="Advertisement">Advertisement</MenuItem>
//                   <MenuItem value="Labour">Labour</MenuItem>
//                   <MenuItem value="Contract">Contract</MenuItem>
//                   <MenuItem value="Job Work">Job Work</MenuItem>
//                   <MenuItem value="Salary">Salary</MenuItem>
//                   <MenuItem value="Rent">Rent</MenuItem>
//                   <MenuItem value="Professional">Professional</MenuItem>
//                   <MenuItem value="Purchase">Purchase</MenuItem>
//                 </Select>
//               </FormControl>
//             </div>
//               <TextField
//                 className="custom-bordered-input"
//                 id="srv_tax"
//                 value={formData.srv_tax}
//                 // disabled
//                 label='TDS 194-Q'
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                     color: 'red',
//                   },
//                 }}
//                 onFocus={(e) => e.target.select()}
//                 size="small"
//                 variant="filled"
//                 sx={{ width: 200 }}
//               />
//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//               }}
//             >
//               <TextField
//                 className="TCSRATE custom-bordered-input"
//                 // inputRef={tcsRef2}
//                 id="tcs206_rate"
//                 value={formData.tcs206_rate}
//                 // onKeyDown={(e) => handleKeyDowndown(e, expAfterGSTRef)}
//                 label="%"
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                     color: "red",
//                   },
//                 }}
//                 onFocus={(e) => e.target.select()}
//                 size="small"
//                 variant="filled"
//                 // sx={{ width: 100}}
//                 InputProps={{ readOnly: !isEditMode || isDisabled }}
//               />

//               <TextField
//                 className="TCSPER custom-bordered-input"
//                 id="tcs206"
//                 value={formData.tcs206}
//                 onChange={handleNumberChange}
//                 label="TCS @"
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                     color: "red",
//                   },
//                 }}
//                 onFocus={(e) => e.target.select()}
//                 size="small"
//                 variant="filled"
//                 // sx={{ width: 120 }}
//               />
//             </div>
//             {/* <div
//               style={{
//                 display: "flex",
//                 flexDirection: "row",
//                 alignItems: "center",
//               }}
//             >
//               <TextField
//                 className="TCSRATE custom-bordered-input"
//                 inputRef={tcsRef}
//                 id="tcs1_rate"
//                 label="%"
//                 value={formData.tcs1_rate}
//                 onChange={handleNumberChange}
//                 // onKeyDown={(e) => handleKeyDowndown(e, tcsRef2)}
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                     color: "red",
//                   },
//                 }}
//                 onFocus={(e) => e.target.select()}
//                 size="small"
//                 variant="filled"
//                 // sx={{ width: 100}}
//                 InputProps={{ readOnly: !isEditMode || isDisabled }}
//               />
//               <TextField
//                 className="TCSPER custom-bordered-input"
//                 id="tcs1"
//                 value={formData.tcs1}
//                 // disabled
//                 label="TCS 206c1H"
//                 onChange={handleNumberChange}
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                     color: "red",
//                   },
//                 }}
//                 onFocus={(e) => e.target.select()}
//                 size="small"
//                 variant="filled"
//                 // sx={{ width: 120 }}
//               />
//             </div> */}
//           </div>
//           {/* C/S/I/TDS */}
//           <div
//             style={{ display: "flex", flexDirection: "column", marginLeft: 5}}
//           >
//             <div style={{ display: "flex", flexDirection: "row",marginTop:"auto" }}>
//             <div className="duedatez">
//                 <DatePicker
//                   id="duedate"
//                   value={formData.duedate}
//                   className="dueDatePICKER"
//                   selected={expiredDate}
//                   onChange={handleDateChange}
//                   readOnly={!isEditMode || isDisabled}
//                   dateFormat="dd-MM-yyyy"
//                   customInput={
//                     <TextField
//                       className="custom-bordered-input"
//                       label="DUE DATE"
//                       variant="filled"
//                       size="small"
//                       sx={{
//                         "& .MuiInputBase-root": {
//                           height: 46.5, // Adjust height here
//                         },
//                         "& .MuiInputBase-input": {
//                           padding: "20px 14px 6px", // more top padding so text sits lower
//                         }
//                       }}
//                     />
//                   }
//                 />
//             </div>
//             <div style={{marginLeft:"5px"}}>
//               <TextField
//                 id="cess1"
//                 value={formData.cess1}
//                 label="CESS1"
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                   },
//                 }}
//                 size="small"
//                 variant="filled"
//                 className="custom-bordered-input"
//                 sx={{ width: 165 }} // Adjust width as needed
//               />
//             </div>
//             <div style={{marginLeft:"5px"}}>
//               <TextField
//                 id="cess2"
//                 value={formData.cess2}
//                 label="CESS2"
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                   },
//                 }}
//                 size="small"
//                 variant="filled"
//                 className="custom-bordered-input"
//                 sx={{ width: 165 }} // Adjust width as needed
//               />
//             </div>
//             </div>
//             <div className="tdstax" style={{ display: "flex", flexDirection: "row" }}>
//               <TextField
//                 className="CTDS custom-bordered-input"
//                 value={formData.Ctds}
//                 label="C.TDS"
//                 size="small"
//                 variant="filled"
//                 inputProps={{
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                     backgroundColor: "white",
//                     borderRadius: 5,
//                   },
//                 }}
//                 sx={{
//                   // width: 150,
//                   "& .MuiOutlinedInput-root": {
//                     border: "1px solid black",
//                     borderRadius: 1,
//                   },
//                 }}
//               />
//               <TextField
//                 className="CTDS custom-bordered-input"
//                 value={formData.Stds}
//                 label="S.TDS"
//                 size="small"
//                 variant="filled"
//                 inputProps={{
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                     backgroundColor: "white",
//                     borderRadius: 5,
//                   },
//                 }}
//                 sx={{
//                   // width: 150,
//                   "& .MuiOutlinedInput-root": {
//                     border: "1px solid black",
//                     borderRadius: 1,
//                   },
//                 }}
//               />
//               <TextField
//                 className="CTDS custom-bordered-input"
//                 value={formData.iTds}
//                 label="I.TDS"
//                 size="small"
//                 variant="filled"
//                 inputProps={{
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                     backgroundColor: "white",
//                     borderRadius: 5,
//                   },
//                 }}
//                 sx={{
//                   // width: 150,
//                   "& .MuiOutlinedInput-root": {
//                     border: "1px solid black",
//                     borderRadius: 1,
//                   },
//                 }}
//               />
//               <span style={{ fontSize: 20, marginTop: "10px" }}>=</span> 
//                <TextField
//                 className="CTDS custom-bordered-input"
//                 value={formData.Tds2}
//                 label="TOTAL"
//                 size="small"
//                 variant="filled"
//                 inputProps={{
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                     backgroundColor: "white",
//                     borderRadius: 5,
//                   },
//                 }}
//                 sx={{
//                   // width: 150,
//                   "& .MuiOutlinedInput-root": {
//                     border: "1px solid black",
//                     borderRadius: 1,
//                   },
//                 }}
//               />
//             </div>
//           </div>
//           {/* TOTALS */}
//           <div
//             style={{ display: "flex", flexDirection: "column",marginLeft:"auto",marginRight:"12px"}}
//           >
//             <div>
//               <TextField
//                 className="TOTALFIELD custom-bordered-input"
//                 id="tax"
//                 value={formData.tax}
//                 label="TOTAL GST"
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                   },
//                 }}
//                 onFocus={(e) => e.target.select()}
//                 size="small"
//                 variant="filled"
//                 // sx={{ width: 150 }}
//               />
//             </div>
//             <div>
//               <TextField
//                 className="TOTALFIELD custom-bordered-input"
//                 inputRef={expAfterGSTRef}
//                 id="expafterGST"
//                 value={formData.expafterGST}
//                 label="EXP AFTER GST"
//                 onKeyDown={(e) => {
//                   handleKeyDowndown(e, saveButtonRef);
//                   handleKeyDownAfter(e);
//                 }}
//                 onFocus={(e) => {
//                   e.target.select();
//                   if (WindowAfter) {
//                     setIsModalOpenAfter(true);
//                   }
//                 }}
//                 onDoubleClick={() => handleDoubleClickAfter("expafterGST")}
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                   },
//                   readOnly: !isEditMode || isDisabled,
//                 }}
//                 size="small"
//                 variant="filled"
//                 // sx={{ width: 150 }}
//               />
//               {isModalOpenAfter && (
//                 <div className="Modal">
//                   <div className="Modal-content">
//                     <h1 className="headingE">EXPENSE AFTER TAX</h1>
//                     <div className="form-group">
//                       <input
//                         type="checkbox"
//                         id="gross"
//                         checked={formData.gross}
//                         onChange={handleGross}
//                       />
//                       <label
//                         style={{ marginLeft: 5 }}
//                         className="label"
//                         htmlFor="Gross"
//                       >
//                         GROSS
//                       </label>
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         marginTop: 10,
//                       }}
//                     >
//                       <text>{Expense6}</text>
//                       <input
//                         id="Exp_rate6"
//                         value={formData.Exp_rate6}
//                         style={{
//                           border: "1px solid black",
//                           width: 100,
//                           marginLeft: 26,
//                         }}
//                         onChange={handleNumberChange} // Updated to the new function name
//                       />
//                       <input
//                         id="Exp6"
//                         value={formData.Exp6}
//                         style={{
//                           border: "1px solid black",
//                           width: 100,
//                           marginLeft: 5,
//                         }}
//                       />
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         marginTop: 10,
//                       }}
//                     >
//                       <text>{Expense7}</text>
//                       <input
//                         id="Exp_rate7"
//                         value={formData.Exp_rate7}
//                         style={{
//                           border: "1px solid black",
//                           width: 100,
//                           marginLeft: 26,
//                         }}
//                         onChange={handleNumberChange} // Updated to the new function name
//                       />
//                       <input
//                         id="Exp7"
//                         value={formData.Exp7}
//                         style={{
//                           border: "1px solid black",
//                           width: 100,
//                           marginLeft: 5,
//                         }}
//                       />
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         marginTop: 10,
//                       }}
//                     >
//                       <text>{Expense8}</text>
//                       <input
//                         id="Exp_rate8"
//                         value={formData.Exp_rate8}
//                         style={{
//                           border: "1px solid black",
//                           width: 100,
//                           marginLeft: 26.5,
//                         }}
//                         onChange={handleNumberChange} // Updated to the new function name
//                       />
//                       <input
//                         id="Exp8"
//                         value={formData.Exp8}
//                         style={{
//                           border: "1px solid black",
//                           width: 100,
//                           marginLeft: 5,
//                         }}
//                       />
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         marginTop: 10,
//                       }}
//                     >
//                       <text>{Expense9}</text>
//                       <input
//                         id="Exp_rate9"
//                         value={formData.Exp_rate9}
//                         style={{
//                           border: "1px solid black",
//                           width: 100,
//                           marginLeft: 18,
//                         }}
//                         onChange={handleNumberChange} // Updated to the new function name
//                       />
//                       <input
//                         id="Exp9"
//                         value={formData.Exp9}
//                         style={{
//                           border: "1px solid black",
//                           width: 100,
//                           marginLeft: 5,
//                         }}
//                       />
//                     </div>
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "row",
//                         marginTop: 10,
//                       }}
//                     >
//                       <text>{Expense10}</text>
//                       <input
//                         id="Exp_rate10"
//                         value={formData.Exp_rate10}
//                         style={{
//                           border: "1px solid black",
//                           width: 100,
//                           marginLeft: 24.5,
//                         }}
//                         onChange={handleNumberChange} // Updated to the new function name
//                       />
//                       <input
//                         id="Exp10"
//                         value={formData.Exp10}
//                         style={{
//                           border: "1px solid black",
//                           width: 100,
//                           marginLeft: 5,
//                         }}
//                       />
//                     </div>
//                     <Button
//                       onClick={closeModalAfter}
//                       style={{
//                         borderColor: "transparent",
//                         backgroundColor: "red",
//                         marginTop: 10,
//                       }}
//                     >
//                       CLOSE
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//                <div>
//               <TextField
//                 id="grandtotal"
//                 value={formData.grandtotal}
//                 label="GRAND TOTAL"
//                 inputProps={{
//                   maxLength: 48,
//                   style: {
//                     height: 20,
//                     fontSize: `${fontSize}px`,
//                     color: "red",
//                     fontWeight: "bold",
//                   },
//                 }}
//                 size="small"
//                 variant="filled"
//                 className="TOTALFIELD custom-bordered-input"
//                 // sx={{ width: 150 }}
//               />
//             </div>
//           </div>
//         </div>
//         <div className="Buttonsgroupz">
//           <Button
//           ref={addButtonRef}
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
//             disabled={!isPreviousEnabled}
//           >
//             Previous
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[3] }}
//             onClick={handleNext}
//             disabled={!isNextEnabled}
//           >
//             Next
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[4] }}
//             onClick={handleFirst}
//             disabled={!isFirstEnabled}
//           >
//             First
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[5] }}
//             onClick={handleLast}
//             disabled={!isLastEnabled}
//           >
//             Last
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[6] }}
//             disabled={!isSearchEnabled}
//             onClick={() => {
//               fetchAllBills();
//               setShowSearch(true);
//             }}
//           >
//             Search
//           </Button>

//           {isFAModalOpen && (
//             <FAVoucherModal
//               open={isFAModalOpen}
//               onClose={() => setIsFAModalOpen(false)}
//               tenant={tenant}
//               voucherno={formData.vno}
//               vtype="P"
//             />
//             // <PurFAVoucherModal
//             //   open={isFAModalOpen}
//             //   onClose={() => setIsFAModalOpen(false)}
//             //   tenant={"shkun_05062025_05062026"}
//             //   voucherno={formData?.vno}
//             //   vtype="P"
//             //   headerTitle="FA VOUCHER (PURCHASE)"
//             // />
//           )}

//           <Button
//             ref={printButtonRef}
//             className="Buttonz"
//             onClick={openPrintMenu}
//             style={{ color: "black", backgroundColor: buttonColors[7] }}
//             disabled={!isPrintEnabled}
//           >
//             Print
//           </Button>
//           <BillPrintMenu 
//           isOpen={isMenuOpen} 
//           onClose={closePrintMenu} 
//           preview={handleOpen} 
//           formDataSale={formData}
//           handlePrint={handlePrintClick}
//           setSelectedCopies={setSelectedCopies}
//           onFaView={handleViewFAVoucher}
//             />
//           <Button
//             className="delete"
//             style={{ color: "black", backgroundColor: buttonColors[8] }}
//             onClick={handleDeleteClick}
//             disabled={!isDeleteEnabled}
//           >
//             Delete
//           </Button>
//           <Button
//             onClick={handleExit}
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[9] }}
//           >
//             Exit
//           </Button>
//           <Button
//             ref={saveButtonRef}
//             className="Buttonz"
//             onClick={handleDataSave}
//             disabled={!isSubmitEnabled}
//             style={{ color: "black", backgroundColor: buttonColors[10] }}
//           >
//             Save
//           </Button>
//         </div>
//       </div>
//       {/* Search Modal */}
//       <Modal show={showSearch} onHide={() => setShowSearch(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>Search</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//         <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//           <Form.Control
//             type="text"
//             placeholder="Enter Bill No..."
//             value={searchBillNo}
//             onChange={(e) => setSearchBillNo(e.target.value)}
//           />
//           <DatePicker
//             selected={searchDate}
//             onChange={(date) => setSearchDate(date)}
//             placeholderText="Select Date"
//             dateFormat="dd-MM-yyyy"
//             className="form-control"
//           />
//           <Button
//             variant="secondary"
//             onClick={() => {
//               setSearchBillNo("");
//               setSearchDate(null);
//             }}
//           >
//             Clear
//           </Button>
//         </div>
//         <div style={{ maxHeight: "300px", overflowY: "auto" }}>
//           <Table  bordered hover>
//             <thead style={{background:"lightgrey"}}> 
//               <tr>
//                 <th>BillNo</th>
//                 <th>Date</th>
//                 <th>Supplier</th>
//                 <th>City</th>
//                 <th>GrandTotal</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredBills.map((bill) => (
//                   <tr
//                     key={bill.vbillno}
//                     onClick={() => handleSelectBill(bill)}
//                     style={{ cursor: "pointer" }}
//                   >
//                   <td>{bill.formData.vno}</td>
//                   <td>
//                     {new Date(bill.formData.date).toLocaleDateString("en-GB")}
//                   </td>
//                   <td>{bill.supplierdetails?.[0]?.vacode}</td>
//                   <td>{bill.supplierdetails?.[0]?.city}</td>
//                   <td>{bill.formData.grandtotal}</td>
//                   <td>
//                     <Button
//                       size="sm"
//                       onClick={() => {
//                         handleSelectBill(bill);
//                         setShowSearch(false);
//                       }}
//                     >
//                       Select
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//               {filteredBills.length === 0 && (
//                 <tr>
//                   <td colSpan="6" style={{ textAlign: "center" }}>
//                     No matching records
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </Table>
//         </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };
// export default Purchase;


import React, { useState, useEffect, useRef,forwardRef } from "react";
import "./Purchase.css";
import DatePicker from "react-datepicker";
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
import { FaPlus, FaMinus, FaCog, FaTimes } from "react-icons/fa";
import PurchaseSetup from "./PurchaseSetup";
import InvoicePDFPur from "../InvoicePdfPur";
import InvoicePur2 from "../InvoicePDF/InvoicePur2";
import InvoicePur3 from "../InvoicePDF/InvoicePur3";
import { useEditMode } from "../../EditModeContext";
import { CompanyContext } from "../Context/CompanyContext";
import { useContext } from "react";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BillPrintMenu from "../Modals/BillPrintMenu";
import { useReactToPrint } from "react-to-print";
import useCompanySetup from "../Shared/useCompanySetup";
import { Modal, Form } from "react-bootstrap";
import useTdsApplicable from "../Shared/useTdsApplicable";
import { useNavigate, useLocation } from "react-router-dom";
import PurFAVoucherModal from "./PurFAVoucherModal";
import FAVoucherModal from "../Shared/FAVoucherModal";

const LOCAL_STORAGE_KEY = "TABLEdataVisibility";
// ✅ Forward ref so DatePicker can focus the input
const MaskedInput = forwardRef(({ value, onChange, onBlur }, ref) => (
  <InputMask
    mask="99-99-9999"
    maskChar=" "
    value={value}
    onChange={onChange}
    onBlur={onBlur}
  >
    {(inputProps) => <input {...inputProps} ref={ref} className="DatePICKER" />}
  </InputMask>
));

const Purchase = () => {
  const location = useLocation();
  const purId = location.state?.purId;
  const navigate = useNavigate();
  const { applicable194Q } = useTdsApplicable();
  const { CompanyState } = useCompanySetup();
  const [selectedInvoice, setSelectedInvoice] = useState("InvoicePDFPur");
  const invoiceComponents = {
    InvoicePDFPur,
    InvoicePur2,
    InvoicePur3,
  };
  const handleCloseInvoice = () => setOpen(false);
  const SelectedInvoiceComponent = invoiceComponents[selectedInvoice];

  const { company } = useContext(CompanyContext);
  // const tenant = company?.databaseName;
    const tenant = "shkun_05062025_05062026"

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    // console.error("No tenant selected!");
  }

  const [selectedCopies, setSelectedCopies] = useState([]);
  const [title, setTitle] = useState("(View)");
  const [currentIndex, setCurrentIndex] = useState(null);
  const itemCodeRefs = useRef([]);
  const datePickerRef = useRef([]);
  const desciptionRefs = useRef([]);
  const peciesRefs = useRef([]);
  const quantityRefs = useRef([]);
  const priceRefs = useRef([]);
  const amountRefs = useRef([]);
  const discountRef = useRef([]);
  const discount2Ref = useRef([]);
  const othersRefs = useRef([]);
  const cgstRefs = useRef([]);
  const sgstRefs = useRef([]);
  const igstRefs = useRef([]);
  const hsnCodeRefs = useRef([]);
  const saveButtonRef = useRef(null);
  const addButtonRef = useRef(null);
  const expAfterGSTRef = useRef(null);
  const printButtonRef = useRef(null);

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
  const [buttonColors, setButtonColors] = useState(initialColors); // Initial colors
  const [formData, setFormData] = useState({
    date: "",
    vtype: "P",
    vno: 0,
    vbillno: 0,
    exfor: "",
    trpt: "",
    p_entry: "",
    stype: "",
    btype: "",
    conv: "",
    vacode1: "",
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
    gr: "",
    tdson: "",
    pcess: 0,
    tax: 0,
    cess1: 0,
    cess2: 0,
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
  const [supplierdetails, setsupplierdetails] = useState([
    {
      // VcodeSup
      Vcode: "",
      vacode: "",
      gstno: "",
      pan: "",
      Add1: "",
      city: "",
      state: "",
      bsGroup:"",
      Tcs206c1H: "",
      TDS194Q: "",
    },
  ]);
  const [items, setItems] = useState([
    {
      id: 1,
      vcode: "",
      sdisc: "",
      Units: "",
      pkgs: "",
      weight: "",
      rate: 0,
      amount: 0,
      disc: "",
      discount: "",
      gst: 0,
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
      RateCal: "",
      Qtyperpc: 0,
      exp_before: 0,
      ctax: 0,
      stax: 0,
      itax: 0,
      tariff: "",
      vamt: 0,
    },
  ]);

  useEffect(() => {
    if (addButtonRef.current && !purId) {
      addButtonRef.current.focus();
    }
  }, []);

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
      gst:false,
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
        Object.hasOwn(defaultTableFields, key)
      )
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
  const selfInvRef = useRef(null);
  const vBillNoRef = useRef(null);
  const tableRef = useRef(null);

  // useEffect(() => {
  //   if (customerNameRef.current) {
  //     customerNameRef.current.focus();
  //   }
  // }, []);

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

  const [purchaseData, setPurchaseData] = useState([]);
  const [T11, setT11] = useState(false); // State to hold T11 value
  const [T12, setT12] = useState(false); // State to hold T11 value
  const [pkgsValue, setpkgsValue] = useState(3);
  const [weightValue, setweightValue] = useState(3);
  const [rateValue, setrateValue] = useState(2);
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
  const [SupplyType, setSupplyType] = useState("");
  const [Defaultbutton, setDefaultbutton] = useState("");

  const fetchPurSetup = async () => {
    try {
      const response = await fetch(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchasesetup`
      );
      if (!response.ok) throw new Error("Failed to fetch sales setup");

      const data = await response.json();

      if (Array.isArray(data) && data.length > 0 && data[0].formData) {
        const formDataFromAPI = data[0].formData;
        setsetupFormData(formDataFromAPI);
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
        setSupplyType(formDataFromAPI.conv);
        setDefaultbutton(formDataFromAPI.T14);
        // Update T21 and T12 states
        setT12(T12Value === "Yes");
        setT11(T11Value === "Yes");
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error) {
      console.error("Error fetching sales setup:", error.message);
    }
  };
  useEffect(() => {
    fetchPurSetup();
  }, [
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
    selectedInvoice,
    Defaultbutton
  ]);

  // Getting UnitType From the Company Setup
  const getUnitTypeFromLocalStorage = () => {
    const companySetup = localStorage.getItem("companySetup");
    if (companySetup) {
      const parsedData = JSON.parse(companySetup);
      return parsedData?.formData?.unitType || ""; // Safely access unitType or return an empty string if not found
    }
    return ""; // Return an empty string if no data in localStorage
  };
  // Usage
  const unitType = getUnitTypeFromLocalStorage();

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
      totalValue += value;
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

    if (CalExp6 === "P" || CalExp6 === "p") {
      exp6 = (totalpcs * exp6Rate) / 100 || 0;
    } else if (CalExp6 === "W" || CalExp6 === "w") {
      exp6 = (totalQty * exp6Rate) / 100 || 0;
    } else if (CalExp6 === "V" || CalExp6 === "V" || CalExp6 === "") {
      exp6 = (subTotal * exp6Rate) / 100 || 0;
    }
    exp6 *= Exp1Multiplier6; // Apply negative only for Exp if Pos is "-Ve"
    formDataOverride.Exp6 = exp6.toFixed(2);
    // EXP 7
    if (CalExp7 === "P" || CalExp7 === "p") {
      exp7 = (totalpcs * exp7Rate) / 100 || 0;
    } else if (CalExp7 === "W" || CalExp7 === "w") {
      exp7 = (totalQty * exp7Rate) / 100 || 0;
    } else if (CalExp7 === "V" || CalExp7 === "V" || CalExp7 === "") {
      exp7 = (subTotal * exp7Rate) / 100 || 0;
    }
    exp7 *= Exp1Multiplier7; // Apply negative only for Exp if Pos is "-Ve"
    formDataOverride.Exp7 = exp7.toFixed(2);
    // EXP 8
    if (CalExp8 === "P" || CalExp8 === "p") {
      exp8 = (totalpcs * exp8Rate) / 100 || 0;
    } else if (CalExp8 === "W" || CalExp8 === "w") {
      exp8 = (totalQty * exp8Rate) / 100 || 0;
    } else if (CalExp8 === "V" || CalExp8 === "V" || CalExp8 === "") {
      exp8 = (subTotal * exp8Rate) / 100 || 0;
    }
    exp8 *= Exp1Multiplier8; // Apply negative only for Exp if Pos is "-Ve"
    formDataOverride.Exp8 = exp8.toFixed(2);
    // EXP 9
    if (CalExp9 === "P" || CalExp9 === "p") {
      exp9 = (totalpcs * exp9Rate) / 100 || 0;
    } else if (CalExp9 === "W" || CalExp9 === "w") {
      exp9 = (totalQty * exp9Rate) / 100 || 0;
    } else if (CalExp9 === "V" || CalExp9 === "V" || CalExp9 === "") {
      exp9 = (subTotal * exp9Rate) / 100 || 0;
    }
    exp9 *= Exp1Multiplier9; // Apply negative only for Exp if Pos is "-Ve"
    formDataOverride.Exp9 = exp9.toFixed(2);
    // EXP 10
    if (CalExp10 === "P" || CalExp10 === "p") {
      exp10 = (totalpcs * exp10Rate) / 100 || 0;
    } else if (CalExp10 === "W" || CalExp10 === "w") {
      exp10 = (totalQty * exp10Rate) / 100 || 0;
    } else if (CalExp10 === "V" || CalExp10 === "V" || CalExp10 === "") {
      exp10 = (subTotal * exp10Rate) / 100 || 0;
    }
    exp10 *= Exp1Multiplier10; // Apply negative only for Exp if Pos is "-Ve"
    formDataOverride.Exp10 = exp10.toFixed(2);

    // Calculate Total Expenses
    const totalExpenses = exp6 + exp7 + exp8 + exp9 + exp10;

    let gstTotal = cgstTotal + sgstTotal + igstTotal;
    let grandTotal = totalValue + gstTotal + totalOthers + totalExpenses + totalDis;
    // let grandTotal = totalValue + gstTotal + totalOthers + totalExpenses - totalDis;
    let taxable = parseFloat(formDataOverride.sub_total);
    // ✅ Skip TCS Calculation if skipTCS is true
    let tcs206 = skipTCS ? parseFloat(formDataOverride.tcs206) : 0;
    let tcs206Rate = skipTCS ? parseFloat(formDataOverride.tcs206_rate) : 0;
    let tcs1 = skipTCS ? parseFloat(formDataOverride.tcs1) : 0;
    let tcs1Rate = skipTCS ? parseFloat(formDataOverride.tcs1_rate) : 0;
    let srvRate = skipTCS ? parseFloat(formDataOverride.srv_rate) : 0;
    let srv_tax = skipTCS ? parseFloat(formDataOverride.srv_tax) : 0;

    if (!skipTCS && unitType === "Trading") {
      tcs206 = (grandTotal * 1) / 100; // 1% TCS
      tcs206Rate = 1;
      grandTotal += tcs206;
    } else if (skipTCS) {
      grandTotal += parseFloat(tcs206); // Add existing TCS to grand total
    }

    if (!skipTCS && applicable194Q === "Above 10 Crore") {
      srv_tax = (taxable * 0.1) / 100;
      srvRate = 0.1;
      // grandTotal += srv_tax;
    }
    // const isTcs206c1HYes =supplierdetails?.some( (cust) => cust.Tcs206c1H?.toLowerCase() === "yes") || false;
    // if (!skipTCS && isTcs206c1HYes) {
    //   tcs1 = (grandTotal * 0.1) / 100; // 0.1%
    //   tcs1Rate = 0.1;
    //   grandTotal += tcs1;
    // } else if (skipTCS) {
    //   grandTotal += parseFloat(tcs1); // Add existing TCS to grand total
    // }

    // const isTDS149QYes = supplierdetails?.some((cust) => cust.TDS194Q?.toLowerCase() === "yes") || false;
    // if (!skipTCS && isTDS149QYes) {
    //   srv_tax = (grandTotal * 2) / 100; // 2%
    //   srvRate = 2;
    //   // grandTotal += srv_tax;
    // }

    let cTds = 0,
      sTds = 0,
      iTds = 0,
      tcspercentage = "0";
    const gstNumber = "03";
    const same = custGst.substring(0, 2);
    items.forEach((item) => {
      if (
        item.tariff &&
        applicableTariffs.some((tariff) => item.tariff.startsWith(tariff))
      ) {
        if (CompanyState == supplierdetails[0].state) {
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

    if (T11) {
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

  useEffect(() => {
    setFormData((prevState) => calculateTotalGst(prevState));
  }, [items, T11, T12]);

  // Api Response
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
  const { isEditMode, setIsEditMode } = useEditMode(); // Access the context
  const [isAbcmode, setIsAbcmode] = useState(false);
  const [isEditMode2, setIsEditMode2] = useState(false); // State to track edit mode
  const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
  const [firstTimeCheckData, setFirstTimeCheckData] = useState("");
  const [setupFormData, setsetupFormData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [shouldFocusPrint, setShouldFocusPrint] = useState(false); // 👈 New flag to track
  const [shouldFocusAdd, setShouldFocusAdd] = useState(false); // 👈 New flag to track
  // Search Modal states
  const [showSearch, setShowSearch] = useState(false);
  const [allBills, setAllBills] = useState([]);
  const [searchBillNo, setSearchBillNo] = useState("");
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchDate, setSearchDate] = useState(null);

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
      // const response = await axios.get(
      //   `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/last`
      // );

      if (response.status === 200 && response.data && response.data.data) {
        const lastEntry = response.data.data;
        // Ensure date is valid
        const isValidDate = (date) => {
          return !isNaN(Date.parse(date));
        };

        // Update form data, use current date if date is invalid or not available
        const updatedFormData = {
          ...lastEntry.formData,
          date: isValidDate(lastEntry.formData.date)
            ? lastEntry.formData.date
            : new Date().toLocaleDateString("en-IN"),
        };

        setFirstTimeCheckData("DataAvailable");
        setFormData(updatedFormData);
        //console.log(updatedFormData, "Formdata2");

        // Update items and supplier details
        const updatedItems = lastEntry.items.map((item) => ({
          ...item,
        }));
        const updatedCustomer = lastEntry.supplierdetails.map((item) => ({
          ...item,
        }));
        setItems(updatedItems);
        setsupplierdetails(updatedCustomer);

        // Set custGst from the supplier details
        if (updatedCustomer.length > 0) {
          setCustgst(updatedCustomer[0].gstno); // Set GST number
        }

        // Set data and index
        setData1({ ...lastEntry, formData: updatedFormData });
        setIndex(lastEntry.vno);
        return lastEntry; // ✅ Return this for use in handleAdd
      } else {
        setFirstTimeCheckData("DataNotAvailable");
        //console.log("No data available");
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
      vtype: "P",
      vno: 0,
      vbillno: 0,
      exfor: "",
      trpt: "",
      p_entry: "",
      stype: "",
      btype: "",
      conv: "",
      vacode1: "",
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
      gr: "",
      tdson: "",
      pcess: 0,
      tax: 0,
      cess1: 0,
      cess2: 0,
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
        sdisc: "",
        Units: "",
        pkgs: "",
        weight: "",
        rate: 0,
        amount: 0,
        disc: "",
        discount: "",
        gst: 0,
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
        ctax: 0,
        stax: 0,
        itax: 0,
        tariff: "",
        vamt: 0,
      },
    ];
    const emptysupplier = [
      {
        // VcodeSup
        Vcode: "",
        vacode: "",
        gstno: "",
        pan: "",
        Add1: "",
        city: "",
        state: "",
        bsGroup:"",
        Tcs206c1H: "",
        TDS194Q: "",
      },
    ];
    // Set the empty data
    setFormData(emptyFormData);
    setItems(emptyItems);
    setsupplierdetails(emptysupplier);
    setData1({
      formData: emptyFormData,
      items: emptyItems,
      supplierdetails: emptysupplier,
    }); // Store empty data
    setIndex(0);
  };

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  // useEffect(() => {
  //   const handleEsc = (e) => {
  //     if (e.key === "Escape" && purId && !isEditMode) {
  //       // ✅ Go back explicitly to LedgerList with state
  //          navigate( -1, {
  //         state: {
  //           rowIndex: location.state?.rowIndex || 0,
  //           selectedLedger: location.state?.selectedLedger,
  //           keepModalOpen: true,
  //         },
  //       });
  //     }
  //   };

  //   window.addEventListener("keydown", handleEsc);
  //   return () => window.removeEventListener("keydown", handleEsc);
  // }, [navigate, purId, location.state]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isEditMode && purId) {
        const modalState = JSON.parse(sessionStorage.getItem("trailModalState") || "{}");

        navigate(-1); // go back
        setTimeout(() => {
          // restore modal state after navigation
          if (modalState.keepModalOpen) {
            window.dispatchEvent(
              new CustomEvent("reopenTrailModal", { detail: modalState })
            );
          }
        }, 50);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isEditMode]);

  useEffect(() => {
    if (data.length > 0) {
      setFormData(data[data.length - 1]); // Set currentData to the last record
      setIndex(data.length - 1);
    }
  }, [data]);

  // Add this line to set isDisabled to true initially
  useEffect(() => {
    setIsDisabled(true);
  }, []);

  // Fetch all bills for search
  const fetchAllBills = async () => {
    try {
      const res = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase"
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

    // Filter by Bill No if entered
    if (searchBillNo.trim() !== "") {
      filtered = filtered.filter((bill) =>
        bill.formData.vno
          .toString()
          .toLowerCase()
          .includes(searchBillNo.toLowerCase())
      );
    }

    const formatLocalDate = (date) => {
      const d = new Date(date);
      if (isNaN(d)) return null; // invalid date
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    // Filter by Date if selected
    if (searchDate) {
        const selected = formatLocalDate(searchDate);

      if (selected) {
        filtered = filtered.filter((bill) => {
          const billDate = formatLocalDate(bill.formData.date);
          return billDate === selected;
        });
      }
    }

    setFilteredBills(filtered);
  }, [searchBillNo, searchDate, allBills]);

  const handleSelectBill = (bill) => {
    setFormData(bill.formData);
    setsupplierdetails(bill.supplierdetails);
    setItems(bill.items);
    setShowSearch(false);
  };

  const handleNext = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("(View)");

    try {
      if (data1) {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/${data1._id}/next`
        );
        if (response.status === 200 && response.data) {
          const nextData = response.data.data;
          setData1(nextData);
          setIndex(index + 1);
          setFormData(nextData.formData);

          // Update items and supplier details
          const updatedItems = nextData.items.map((item) => ({
            ...item,
          }));
          const updatedCustomer = nextData.supplierdetails.map((item) => ({
            ...item,
          }));
          setItems(updatedItems);
          setsupplierdetails(updatedCustomer);

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
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/${data1._id}/previous`
        );
        if (response.status === 200 && response.data) {
          const prevData = response.data.data;
          setData1(prevData);
          setIndex(index - 1);
          setFormData(prevData.formData);

          // Update items and supplier details
          const updatedItems = prevData.items.map((item) => ({
            ...item,
          }));
          const updatedCustomer = prevData.supplierdetails.map((item) => ({
            ...item,
          }));
          setItems(updatedItems);
          setsupplierdetails(updatedCustomer);

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
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/first`
      );
      if (response.status === 200 && response.data) {
        const firstData = response.data.data;
        setData1(firstData);
        setIndex(0);
        setFormData(firstData.formData);

        // Update items and supplier details
        const updatedItems = firstData.items.map((item) => ({
          ...item,
        }));
        const updatedCustomer = firstData.supplierdetails.map((item) => ({
          ...item,
        }));
        setItems(updatedItems);
        setsupplierdetails(updatedCustomer);

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
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/last`
      );
      if (response.status === 200 && response.data) {
        const lastData = response.data.data;
        setData1(lastData);
        const lastIndex = response.data.length - 1;
        setIndex(lastIndex);
        setFormData(lastData.formData);

        // Update items and supplier details
        const updatedItems = lastData.items.map((item) => ({
          ...item,
        }));
        const updatedCustomer = lastData.supplierdetails.map((item) => ({
          ...item,
        }));
        setItems(updatedItems);
        setsupplierdetails(updatedCustomer);

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
    try {
     const lastEntry = await fetchData();
     const lastvoucherno = lastEntry?.formData?.vno ? parseInt(lastEntry.formData.vno) + 1 : 1;
      let lastBillno = formData.vbillno ? parseInt(formData.vbillno) + 1 : 1;
      const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const newData = {
        date: today,
        vtype: "P",
        vno: lastvoucherno,
        vbillno: "",
        exfor: "",
        trpt: "",
        p_entry: "",
        stype: "",
        btype: "",
        conv: SupplyType,
        vacode1: "",
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
        gr: "",
        tdson: "",
        pcess: 0,
        tax: 0,
        cess1: 0,
        cess2: 0,
        sub_total: 0,
        exp_before: 0,
        Exp_rate6: ExpRate6 || 0,
        Exp_rate7: ExpRate7 || 0,
        Exp_rate8: ExpRate8 || 0,
        Exp_rate9: ExpRate9 || 0,
        Exp_rate10: ExpRate10 || 0,
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
        grandtotal: 0,
      };
      setData([...data, newData]);
      setFormData(newData);
      setItems([
        {
          id: 1,
          vcode: "",
          sdisc: "",
          Units: "",
          pkgs: 0,
          weight: 0,
          rate: 0,
          amount: 0,
          disc: "",
          discount: "",
          gst: 0,
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
        },
      ]);
      setsupplierdetails([
        {
          // VcodeSup
          Vcode: "",
          vacode: "",
          gstno: "",
          pan: "",
          Add1: "",
          city: "",
          state: "",
          bsGroup:"",
          Tcs206c1H: "",
          TDS194Q: "",
        },
      ]);
      setIndex(data.length);
      setIsAddEnabled(false);
      setIsSubmitEnabled(true);
      setIsPreviousEnabled(false);
      setIsNextEnabled(false);
      setIsFirstEnabled(false);
      setIsLastEnabled(false);
      setIsSearchEnabled(false);
      setIsSPrintEnabled(false);
      setIsDeleteEnabled(false);
      setIsDisabled(false);
      setIsEditMode(true);
      setTitle("NEW");
      if (datePickerRef.current) {
        datePickerRef.current.setFocus();
      }
    } catch (error) {
      console.error("Error adding new entry:", error);
    }
  };

  const handleEditClick = () => {
    setTitle("EDIT");
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

  const handleSaveClick = async () => {
    document.body.style.backgroundColor = "white";
    setIsSubmitEnabled(true);
    let isDataSaved = false;

    try {
      // --- 1) VALIDATIONS ---------------------------------------------------
      const isValid = supplierdetails.every((item) => (item.vacode || "") !== "");
      if (!isValid) {
        toast.error("Please Fill the Customer Details", { position: "top-center" });
        return;
      }

      // --- Duplicate BILL NO check -----------------------------------------------
      const customerName = supplierdetails[0]?.vacode;
      const billNo = formData.vbillno;

      if (checkDuplicateBill(customerName, billNo)) {
        toast.error(`Bill No "${billNo}" already exists for customer "${customerName}".`, { 
          position: "top-center" 
        });
        return; // 🚫 STOP SAVE
      }
      const p_entry = formData.p_entry;
      if (checkDuplicatePEntry(p_entry)) {
        toast.error(`Self Inv No Already exists: "${p_entry}".`, { 
          position: "top-center" 
        });
        return; // 🚫 STOP SAVE
      }

      const nonEmptyItems = items.filter((item) => (item.sdisc || "").trim() !== "");
      if (nonEmptyItems.length === 0) {
        toast.error("Please fill in at least one Items name.", { position: "top-center" });
        return;
      }

      // --- 2) BUILD PAYLOAD -------------------------------------------------
      const combinedData = {
        _id: formData._id,
        formData: {
          // keep dates as locale strings; backend normalizes
          date: selectedDate.toLocaleDateString("en-IN"),
          duedate: expiredDate.toLocaleDateString("en-IN"),

          // core fields
          vtype: formData.vtype,
          vno: formData.vno,
          vbillno: formData.vbillno,
          exfor: formData.exfor,
          trpt: formData.trpt,
          p_entry: formData.p_entry,
          stype: formData.stype,
          btype: formData.btype,
          conv: formData.conv,
          vacode1: formData.vacode1,
          rem2: formData.rem2,
          v_tpt: formData.v_tpt,
          broker: formData.broker,

          // TDS/TCS
          srv_rate: formData.srv_rate,
          srv_tax: formData.srv_tax,
          tcs1_rate: formData.tcs1_rate,
          tcs1: formData.tcs1,
          tcs206_rate: formData.tcs206_rate,
          tcs206: formData.tcs206,
          tdson: formData.tdson,

          // taxes & totals
          pcess: formData.pcess,
          tax: formData.tax,
          cess1: formData.cess1,
          cess2: formData.cess2,
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
          ExpRoundoff: formData.ExpRoundoff,
          grandtotal: formData.grandtotal,

          // (optional) if your backend matches by these
          fy: formData.fy,
          series: formData.series,
          uom_default: formData.uom_default,

          // ---- Setup (Purchase) accounts
          cgst_ac:  setupFormData.cgst_ac,
          cgst_code: setupFormData.cgst_code,
          cgst_ac1: setupFormData.cgst_ac1,
          cgst_code1: setupFormData.cgst_code1,
          cgst_ac2: setupFormData.cgst_ac2,
          cgst_code2: setupFormData.cgst_code2,

          sgst_ac:  setupFormData.sgst_ac,
          sgst_code: setupFormData.sgst_code,
          sgst_ac1: setupFormData.sgst_ac1,
          sgst_code1: setupFormData.sgst_code1,
          sgst_ac2: setupFormData.sgst_ac2,
          sgst_code2: setupFormData.sgst_code2,

          igst_ac:  setupFormData.igst_ac,
          igst_code: setupFormData.igst_code,
          igst_ac1: setupFormData.igst_ac1,
          igst_code1: setupFormData.igst_code1,
          igst_ac2: setupFormData.igst_ac1,   // (as you had)
          igst_code2: setupFormData.igst_code1,

          Adcode: setupFormData.Adcode,
          Ad_ac:  setupFormData.Ad_ac,

          cesscode: setupFormData.cesscode,
          cessAc:   setupFormData.cessAc,

          tds_code: setupFormData.tds_code,
          tds_ac:   setupFormData.tds_ac,

          tcs_code:   setupFormData.tcs_code,
          tcs_ac:     setupFormData.tcs_ac,
          tcs206code: setupFormData.tcs206code,
          tcs206ac:   setupFormData.tcs206ac,

          discount_code: setupFormData.discount_code,
          discount_ac:   setupFormData.discount_code, // kept as you had

          // TDS ACCOUNTS
          cTds_code: setupFormData.cTds_code,
          cTds_ac: setupFormData.cTds_ac,
          sTds_code: setupFormData.sTds_code,
          sTds_ac: setupFormData.sTds_ac,
          iTds_code: setupFormData.iTds_code,
          iTds_ac: setupFormData.iTds_ac,

          expense1_code: setupFormData.E1Code,  expense1_ac: setupFormData.E1name,
          expense2_code: setupFormData.E2Code,  expense2_ac: setupFormData.E2name,
          expense3_code: setupFormData.E3Code,  expense3_ac: setupFormData.E3name,
          expense4_code: setupFormData.E4Code,  expense4_ac: setupFormData.E4name,
          expense5_code: setupFormData.E5Code,  expense5_ac: setupFormData.E5name,
          expense6_code: setupFormData.E6Code,  expense6_ac: setupFormData.E6name,
          expense7_code: setupFormData.E7Code,  expense7_ac: setupFormData.E7name,
          expense8_code: setupFormData.E8Code,  expense8_ac: setupFormData.E8name,
          expense9_code: setupFormData.E9Code,  expense9_ac: setupFormData.E9name,
          expense10_code: setupFormData.E10Code, expense10_ac: setupFormData.E10name,
        },
        items: nonEmptyItems.map((item) => ({
          id: item.id,
          vcode: item.vcode,
          sdisc: item.sdisc,
          Units: item.Units,
          pkgs: item.pkgs,
          weight: item.weight,
          rate: item.rate,
          amount: item.amount,
          disc: item.disc,
          discount: item.discount,
          gst: item.gst,
          Pcodess: item.Pcodess,
          Pcodes01: item.Pcodes01,
          Scodess: item.Scodess,
          Scodes01: item.Scodes01,
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
          ctax: item.ctax,
          stax: item.stax,
          itax: item.itax,
          tariff: item.tariff,
          vamt: item.vamt,
        })),
        supplierdetails: supplierdetails.map((item) => ({
          Vcode: item.Vcode,
          vacode: item.vacode,
          gstno: item.gstno,
          pan: item.pan,
          Add1: item.Add1,
          city: item.city,
          state: item.state,
          bsGroup: item.bsGroup,
          Tcs206c1H: item.Tcs206c1H,
          TDS194Q: item.TDS194Q,
        })),
      };

      // --- 3) SAVE PURCHASE GST --------------------------------------------
      let apiEndpoint = "";
      let method = "";

      if (isAbcmode) {
        // Edit Mode → use "purchasegstsave1/:id"
        const editId = data1?._id || combinedData?._id;
        if (!editId) {
          toast.error("Edit id missing for update.", { position: "top-center" });
          return;
        }
        apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchasegstsave1/${editId}`;
        method = "put";
      } else {
        // Add Mode → normal "purchasegstsave"
        apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchasegstsave`;
        method = "post";
      }

      const response = await axios({ method, url: apiEndpoint, data: combinedData });

      // Extract the new/updated PurchaseGst id
      const purchaseId =
        response?.data?.purchaseId ||   // preferred (backend create returns this)
        response?.data?._id ||          // legacy (if PUT returns doc)
        (isAbcmode ? data1?._id : null);

      if (!purchaseId) {
        console.warn("purchaseId not found in /purchasegstsave response. Ensure backend returns { ok: true, purchaseId }.");
      }

      if (response.status === 200 || response.status === 201) {
        // --- 4) UPDATE STOCK (purchase -> add) ------------------------------
        try {
          await axios.post(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/stock/update`, {
            items: nonEmptyItems.map(item => ({
              vcode: item.vcode,
              sdisc: item.sdisc,
              weight: Number(item.weight) || 0,
              pkgs: Number(item.pkgs) || 0,
            }))
          });
        } catch (stkErr) {
          console.error("Stock update error:", stkErr);
          // continue; don't fail whole flow
        }

        // --- 5) POST/PUT FA ENTRIES with purchaseId ------------------------
        try {
          const faMethod = isAbcmode ? "put" : "post";
          const faUrl = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchasefaFile`;

          await axios({
            method: faMethod,
            url: faUrl,
            data: {
              purchaseId, // ⭐ ensures we hit/update the same FAFile
              formData: combinedData.formData,
              items: combinedData.items,
              supplierdetails: combinedData.supplierdetails,
            },
          });
        } catch (faErr) {
          console.error("purchasefaFile error:", faErr);
          toast.warn(
            "Purchase saved & stock updated, but FA posting failed. Try 'Post to FA' later.",
            { position: "top-center" }
          );
        }

        // --- 6) REFRESH + UI STATE -----------------------------------------
        fetchData?.();
        isDataSaved = true;
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.", { position: "top-center" });
    } finally {
      setIsSubmitEnabled(!isDataSaved);
      if (isDataSaved) {
        setTitle?.("View");
        setIsAddEnabled?.(true);
        setIsDisabled?.(true);
        setIsEditMode?.(false);
        setIsPreviousEnabled?.(true);
        setIsNextEnabled?.(true);
        setIsFirstEnabled?.(true);
        setIsLastEnabled?.(true);
        setIsSPrintEnabled?.(true);
        setIsSearchEnabled?.(true);
        setIsDeleteEnabled?.(true);
        toast.success("Data Saved Successfully!", { position: "top-center" });
        if (Defaultbutton === "Print") setShouldFocusPrint?.(true);
        else if (Defaultbutton === "Add") setShouldFocusAdd?.(true);
      } else {
        setIsAddEnabled?.(false);
        setIsDisabled?.(false);
      }
    }
  };

  const handleDataSave = async () => {
    handleSaveClick();

  };

  // const handleDeleteClick = async (id) => {
  //   if (!id) {
  //     toast.error("Invalid ID. Please select an item to delete.", {
  //       position: "top-center",
  //     });
  //     return;
  //   }
  //   const userConfirmed = window.confirm(
  //     "Are you sure you want to delete this item?"
  //   );
  //   if (!userConfirmed) return;
  //   try {
  //     const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/${data1._id}`;
  //     const response = await axios.delete(apiEndpoint);

  //     if (response.status === 200) {
  //       toast.success("Data deleted successfully!", { position: "top-center" });
  //       fetchData(); // Refresh the data after successful deletion
  //     } else {
  //       throw new Error(`Failed to delete data: ${response.statusText}`);
  //     }
  //   } catch (error) {
  //     console.error("Error deleting data:", error);
  //     toast.error(`Failed to delete data. Error: ${error.message}`, {
  //       position: "top-center",
  //     });
  //   } finally {
  //   }
  // };
  const handleDeleteClick = async (id) => {
  if (!id) {
    toast.error("Invalid ID. Please select an item to delete.", {
      position: "top-center",
    });
    return;
  }

  const userConfirmed = window.confirm(
    "Are you sure you want to delete this item?"
  );
  if (!userConfirmed) return;

  try {
    // ✅ use the id passed into the function, not data1._id
    const apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/purchasegst/${data1._id}`;
    const response = await axios.delete(apiEndpoint);

    if (response.status === 200) {
      toast.success("Data deleted successfully!", { position: "top-center" });
      fetchData(); // Refresh the data after successful deletion
    } else {
      throw new Error(`Failed to delete data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting data:", error);
    toast.error(`Failed to delete data. Error: ${error.message}`, {
      position: "top-center",
    });
  }
};

  useEffect(() => {
    if (shouldFocusPrint && isPrintEnabled && printButtonRef.current) {
      printButtonRef.current.focus();
      setShouldFocusPrint(false); // Reset flag
    }
    if (shouldFocusAdd && isAddEnabled && addButtonRef.current) {
      addButtonRef.current.focus();
      setShouldFocusAdd(false); // Reset flag
    }
  }, [isPrintEnabled,shouldFocusPrint,isAddEnabled,shouldFocusAdd]);

  // Modal For Product Selection
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    // Fetch products from the API when the component mounts
    fetchProducts();
  }, []);

      const fetchProducts = async (search = "") => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/stockmaster?search=${encodeURIComponent(search)}`
      );
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      const flattenedData = data.data.map((item) => ({
        ...item.formData,
        _id: item._id,
      }));
      setProducts(flattenedData);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  // const fetchProducts = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/stockmaster`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch products");
  //     }
  //     const data = await response.json();
  //     // Flatten the data to make the nested formData directly accessible
  //     const flattenedData = data.map((item) => ({
  //       ...item.formData,
  //       _id: item._id,
  //       PurchaseAcc: item.PurchaseAcc,
  //       SaleAcc: item.SaleAcc,
  //     }));
  //     setProducts(flattenedData);
  //     setLoading(false);
  //     //console.log(flattenedData);
  //   } catch (error) {
  //     setError(error.message);
  //     setLoading(false);
  //   }
  // };

  const handleItemChange = (index, key, value, field) => {
    // If key is "pkgs" or "weight", allow only numbers and a single decimal point
    if ((key === "pkgs" || key === "weight" || key === "tariff" || key === "rate" || key === "disc" || key === "discount") && !/^-?\d*\.?\d*$/.test(value)) {
      return; // reject invalid input
    }

    // Always force disc/discount to be negative
    if (key === "disc" || key === "discount") {
      const numeric = parseFloat(value);
      if (!isNaN(numeric)) {
        value = -Math.abs(numeric); // Force negative
      }
    }

    const updatedItems = [...items];
    if (["sdisc"].includes(key)) {
      updatedItems[index][key] = capitalizeWords(value);
    } else {
      updatedItems[index][key] = value;
    }
    // const updatedItems = [...items];
    // updatedItems[index][key] = value;

    // If the key is 'name', find the corresponding product and set the price
    if (key === "name") {
      const selectedProduct = products.find(
        (product) => product.Aheads === value
      );
      if (selectedProduct) {
        updatedItems[index]["vcode"] = selectedProduct.Acodes;
        updatedItems[index]["sdisc"] = selectedProduct.Aheads;
        updatedItems[index]["Units"] = selectedProduct.TradeName;
        updatedItems[index]["rate"] = selectedProduct.Mrps;
        updatedItems[index]["gst"] = selectedProduct.itax_rate;
        updatedItems[index]["tariff"] = selectedProduct.Hsn;
        updatedItems[index]["Scodes01"] = selectedProduct.AcCode;
        updatedItems[index]["Scodess"] = selectedProduct.Scodess;
        updatedItems[index]["Pcodes01"] = selectedProduct.acCode;
        updatedItems[index]["Pcodess"] = selectedProduct.Pcodess;
        updatedItems[index]["RateCal"] = selectedProduct.Rateins;
        updatedItems[index]["Qtyperpc"] = selectedProduct.Qpps || 0;
      } else {
        updatedItems[index]["rate"] = ""; // Reset price if product not found
        updatedItems[index]["gst"] = ""; // Reset gst if product not found
      }
    }
    let pkgs = parseFloat(updatedItems[index].pkgs);
    let Qtyperpkgs = updatedItems[index].Qtyperpc;
    let AL = pkgs * Qtyperpkgs;
    let gst;
    if (pkgs > 0 && Qtyperpkgs > 0 && key !== "weight") {
      updatedItems[index]["weight"] = AL.toFixed(weightValue);
    }
    // Calculate CGST and SGST based on the GST value
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
    const totalAccordingWeight =
      parseFloat(updatedItems[index].weight) *
      parseFloat(updatedItems[index].rate);
    const totalAccordingPkgs =
      parseFloat(updatedItems[index].pkgs) *
      parseFloat(updatedItems[index].rate);
    let RateCal = updatedItems[index].RateCal;
    let TotalAcc = totalAccordingWeight; // Set a default value

    // Calcuate the Amount According to RateCalculation field
    if (
      RateCal === "Default" ||
      RateCal === "" ||
      RateCal === null ||
      RateCal === undefined
    ) {
      TotalAcc = totalAccordingWeight;
      console.log("Default");
    } else if (RateCal === "Wt/Qty") {
      TotalAcc = totalAccordingWeight;
      console.log("totalAccordingWeight");
    } else if (RateCal === "Pc/Pkgs") {
      TotalAcc = totalAccordingPkgs;
      console.log("totalAccordingPkgs");
    }
    let others = parseFloat(updatedItems[index].exp_before) || 0;
    let disc = parseFloat(updatedItems[index].disc) || 0;
    let manualDiscount = parseFloat(updatedItems[index].discount) || 0;
    let per;
    if (key === "discount") {
      per = manualDiscount;
    } else {
      per = ((disc / 100) * TotalAcc);
      updatedItems[index]["discount"] = T11 ? Math.round(per).toFixed(2) : per.toFixed(2);
    }

    // ✅ Convert to float for reliable calculation
    per = parseFloat(per);
    let Amounts = TotalAcc + per + others;

    // Ensure TotalAcc is a valid number before calling toFixed()
    TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;
    // Check if GST number starts with "0" to "3"
    const same = custGst.substring(0, 2);
    let cgst, sgst, igst;
    if (CompanyState == supplierdetails[0].state) {
      cgst = (Amounts * (gst / 2)) / 100 || 0;
      sgst = (Amounts * (gst / 2)) / 100 || 0;
      igst = 0;
    } else {
      cgst = sgst = 0;
      igst = (Amounts * gst) / 100 || 0;
    }

    // Calculate the total with GST and Others
    let totalWithGST = Amounts + cgst + sgst + igst;
    // totalWithGST += others;
    // Update CGST, SGST, Others, and total fields in the item
    if (T11) {
      if (key !== "discount") {
        updatedItems[index]["discount"] = Math.round(per).toFixed(2);
      }
      updatedItems[index]["amount"] = Math.round(TotalAcc).toFixed(2);
      updatedItems[index]["vamt"] = Math.round(totalWithGST).toFixed(2);
    } else {
      if (key !== "discount") {
        updatedItems[index]["discount"] = parseFloat(per).toFixed(2);
      }
      updatedItems[index]["amount"] = TotalAcc.toFixed(2);
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
    // Calculate the percentage of the value based on the GST percentage
    const percentage = ((totalWithGST - Amounts) / TotalAcc) * 100;
    updatedItems[index]["percentage"] = percentage.toFixed(2);
    setItems(updatedItems);
    calculateTotalGst();
  };

  const handleProductSelect = (product) => {
    setIsEditMode(true);
      if (selectedItemIndex !== null) {
        handleItemChange(selectedItemIndex, "name", product.Aheads);
        setShowModal(false);
      }
  };

  const handleModalDone = (product) => {
    if (product) {
      console.log(product);
      handleProductSelect(product);
    }
    setShowModal(false);
    fetchProducts();
    setIsEditMode(true);
  };

  const handleAddItem = () => {
    if (isEditMode) {
      const newItem = {
        id: items.length + 1,
        vcode: "",
        sdisc: "",
        Units: "",
        pkgs: 0,
        weight: 0,
        rate: 0,
        amount: 0,
        disc: "",
        discount: "",
        gst: 0,
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
        "Do you really want to delete this item?"
      );
      // Proceed with deletion if the user confirms
      if (confirmDelete) {
        const filteredItems = items.filter((item, i) => i !== index);
        setItems(filteredItems);
      }
    }
  };

  const openModalForItem = (index) => {
    if (isEditMode) {
      setSelectedItemIndex(index);
      setShowModal(true);
    }
  };

  const allFields = products.length
  ? Object.keys(products[0])
  : ["Aheads", "Pcodes01", "UOM", "GST"]; // fallback/default fields

  // Modal For Customer
  const [productsCus, setProductsCus] = useState([]);
  const [showModalCus, setShowModalCus] = useState(false);
  const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
  const [loadingCus, setLoadingCus] = useState(true);
  const [errorCus, setErrorCus] = useState(null);

  React.useEffect(() => {
    // Fetch products from the API when the component mounts
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      //console.log(data);
      // Ensure to extract the formData for easier access in the rest of your app
      const formattedData = data.map((item) => ({
        ...item.formData,
        _id: item._id,
      }));
      setProductsCus(formattedData);
      setLoadingCus(false);
    } catch (error) {
      setErrorCus(error.message);
      setLoadingCus(false);
    }
  };

  const handleOpenModalTpt = (event, index, field) => {
    if (event.key === "ArrowDown" && field === "v_tpt") {
      setSelectedItemIndexCus(index);
      setShowModalCus(true);
      event.preventDefault();
    }
    if (event.key === "ArrowDown" && field === "broker") {
      setSelectedItemIndexCus(index);
      setShowModalCus(true);
      event.preventDefault();
    }
  };

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
    const updatedItems = [...supplierdetails];
    updatedItems[index][key] = value;

    if (key === "name") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value
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
          bsGroup: selectedProduct.Bsgroup,
          Tcs206c1H: selectedProduct.tcs206,
          TDS194Q: selectedProduct.tds194q,
        };
        setCustgst(selectedProduct.gstNo);

        const stype = determineSaleType(
          selectedProduct.state,
          selectedProduct.gstNo,
          CompanyState
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

    setsupplierdetails(updatedItems);
  };

  //   const handleProductSelectCus = (product) => {
  //   setIsEditMode(true);
  //   if (selectedItemIndexCus !== null) {
  //     if (selectedItemIndexCus === "v_tpt") {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         v_tpt: product.ahead, // Update v_tpt field with selected value
  //       }));
  //     } else if (selectedItemIndexCus === "broker") {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         broker: product.ahead, // Update v_tpt field with selected value
  //       }));
  //     } else {
  //       handleItemChangeCus(selectedItemIndexCus, "name", product.ahead);
  //     }
  //     setShowModalCus(false);

  //     // Focus back on the respective input field after selecting the value
  //     setTimeout(() => {
  //       if (selectedItemIndexCus === "v_tpt") {
  //         transportRef.current?.focus(); // Focus back to transport field
  //       } else if (selectedItemIndexCus === "broker") {
  //         expAfterGSTRef.current?.focus();
  //       } else {
  //         vBillNoRef.current.focus();
  //       }
  //     }, 0);
  //   }
  // };

  const handleProductSelectCus = (product) => {
    if (!product) {
      alert("No product received!");
      setShowModalCus(false);
      return;
    }
  
    // clone the array
    const newCustomers = [...supplierdetails];
  
    // overwrite the one at the selected index
    newCustomers[selectedItemIndexCus] = {
      ...newCustomers[selectedItemIndexCus],
      Vcode: product.acode || '',
      vacode: product.ahead || '',
      city:   product.city  || '',
      gstno:  product.gstNo  || '',
      pan:    product.pan    || '',
      Add1: product.Add1 || '',
      state: product.state    || '',
      bsGroup: product.Bsgroup || '',
      Tcs206c1H: product.Tcs206c1H    || '',
      TDS194Q: product.TDS194Q    || '',
      
    };

    const stype = determineSaleType(product.state, product.gstNo || "", CompanyState);
    setFormData((prevState) => ({
      ...prevState,
      stype,
    }));

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexCus !== null) {
      if (selectedItemIndexCus === "v_tpt") {
        setFormData((prevData) => ({
          ...prevData,
          v_tpt: nameValue, // Update v_tpt field with selected value
        }));
      } else if (selectedItemIndexCus === "broker") {
        setFormData((prevData) => ({
          ...prevData,
          broker: nameValue, // Update v_tpt field with selected value
        }));
      } else {
        handleItemChangeCus(selectedItemIndexCus, "name", nameValue);
      }
    }
    setsupplierdetails(newCustomers);
    setIsEditMode(true);
    setShowModalCus(false);
  
    // restore focus
    setTimeout(() => {
      if (selectedItemIndexCus === "v_tpt") {
        transportRef.current?.focus(); // Focus back to transport field
      } else if (selectedItemIndexCus === "broker") {
        expAfterGSTRef.current?.focus();
      } else {
        vBillNoRef.current.focus();
      }
    }, 0);
  };

  const handleCloseModalCus = () => {
    setShowModalCus(false);
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

  const handleTaxType = (event) => {
    const { value } = event.target;

    // Get customer state & GST number
    const customerState = supplierdetails[0]?.state;
    const customerGST = supplierdetails[0]?.gstno?.trim();

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
        "Export Sale"
      );
    } else {
      allowedTypes.push(
        "Tax Free Interstate",
        "Including IGST",
        "Export Sale(IGST)"
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

  const handleSupply = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      conv: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleTdsOn = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      tdson: value, // Update the ratecalculate field in FormData
    }));
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (formData.date) {
      try {
        let date;

        // Check for dd/mm/yyyy
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(formData.date)) {
          const [day, month, year] = formData.date.split("/").map(Number);
          date = new Date(year, month - 1, day); // JS months are 0-based
        } else {
          // Otherwise try normal parsing (ISO etc.)
          date = new Date(formData.date);
        }

        if (!isNaN(date.getTime())) {
          setSelectedDate(date);
        } else {
          console.error("Invalid date value:", formData.date);
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    } else {
      setSelectedDate(null);
    }
  }, [formData.date]);


  const [expiredDate, setexpiredDate] = useState(null);

  useEffect(() => {
    if (formData.duedate) {
      setexpiredDate(new Date(formData.duedate));
    } else {
      const today = new Date();
      setexpiredDate(today);
      setFormData({ ...formData, duedate: today });
    }
  }, []);

   const handleDateChange = (date) => {
     if (date instanceof Date && !isNaN(date)) {
       setSelectedDate(date);
       const formattedDate = date.toISOString().split("T")[0];
       setFormData((prev) => ({
         ...prev,
         date: date,
         duedate: date,
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

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const HandleInputsChanges = (event) => {
    const { id, value } = event.target;
    const cap = capitalizeWords(value);

    setFormData((prevData) => ({
      ...prevData,
      [id]: cap,
    }));

    // ⭐ If SELF INV field changed
    if (id === "p_entry") {
      const upper = value.toUpperCase();

      if (checkDuplicatePEntry(upper)) {
        alert(`Self Invoice No ${upper} already exists!`);
      }
    }
  };


  // const handleCapitalAlpha = (event) => {
  // const { id, value } = event.target;
  // // force all letters to uppercase
  // const uppercasedValue = value.toUpperCase();
  // setFormData((prevData) => ({
  //   ...prevData,
  //   [id]: uppercasedValue,
  // }));
  // };

    // 1️⃣ Fetch purchase API once
    useEffect(() => {
      const fetchPurchase = async () => {
        try {
          const res = await fetch(
            "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase"
          );
          const data = await res.json();
          setPurchaseData(data);
        } catch (err) {
          console.error("API Fetch Error", err);
        }
      };
  
      fetchPurchase();
    }, []);
  
    // 2️⃣ Function to check duplicate bill for same customer
    const checkDuplicateBill = (customerName, billNo) => {
      if (!customerName || !billNo) return false;
  
      return purchaseData.some((entry) => {
        const apiCustomer = entry.supplierdetails?.[0]?.vacode?.trim().toUpperCase();
        const apiBill = entry.formData?.vbillno?.trim().toUpperCase();
  
        return (
          apiCustomer === customerName.trim().toUpperCase() &&
          apiBill === billNo.trim().toUpperCase()
        );
      });
    };

    // ⭐ 3️⃣ Function to check duplicate SELF INVOICE p_entry (GLOBAL CHECK)
    const checkDuplicatePEntry = (pEntry) => {
      if (!pEntry) return false;

      return purchaseData.some((entry) => {
        const apiPentry = entry.formData?.p_entry?.trim().toUpperCase();
        return apiPentry === pEntry.trim().toUpperCase();
      });
    };

    const handleCapitalAlpha = (event) => {
    const { id, value } = event.target;
    const upper = value.toUpperCase();

    setFormData((prev) => ({
      ...prev,
      [id]: upper,
    }));

    const customerName = supplierdetails[0].vacode;

    if (customerName && checkDuplicateBill(customerName, upper)) {
      alert(`Bill No ${upper} already exists for this customer: ${customerName}`);
    }
  };

  const handleNumberChange = (event) => {
    const { id, value } = event.target;
    const numberValue = value.replace(/[^0-9.]/g, "");
    const validNumberValue =
      numberValue.split(".").length > 2
        ? numberValue.replace(/\.{2,}/g, "").replace(/(.*)\./g, "$1.")
        : numberValue;

    setFormData((prevState) => {
      const newFormData = { ...prevState, [id]: validNumberValue };
      return calculateTotalGst(newFormData, true); // ✅ Skip TCS recalculation
    });
  };

  const [fontSize, setFontSize] = useState(16.5); // Initial font size in pixels
  const increaseFontSize = () => {
    setFontSize((prevSize) => (prevSize < 20 ? prevSize + 2 : prevSize)); // Increase font size up to 20 pixels
  };
  const decreaseFontSize = () => {
    setFontSize((prevSize) => (prevSize > 14 ? prevSize - 2 : prevSize)); // Decrease font size down to 14 pixels
  };
  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
  const handleKeyDown = (event, index, field) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault(); // Stop default Tab navigation
      switch (field) {
        case "vcode":
          if (items[index].sdisc.trim() === "") {
            transportRef.current.focus();
          } else {
            desciptionRefs.current[index]?.focus();
          }
          break;
        case "sdisc":
          hsnCodeRefs.current[index]?.focus();
          break;
        case "tariff":
          peciesRefs.current[index]?.focus();
          break;
        case "pkgs":
          quantityRefs.current[index]?.focus();
          break;
        case "weight":
          priceRefs.current[index]?.focus();
          break;
        case "rate":
          discountRef.current[index]?.focus();
          break;
        case "disc":
          discount2Ref.current[index]?.focus();
          break;
        case "discount":
          othersRefs.current[index]?.focus();
          break;
        case "exp_before":
          if (index === items.length - 1) {
            handleAddItem();
            itemCodeRefs.current[index + 1]?.focus();
          } else {
            itemCodeRefs.current[index + 1]?.focus();
          }
          break;
        default:
          break;
      }
    }
    // Move Right (→)
    else if (event.key === "ArrowRight") {
      if (field === "vcode") {
        desciptionRefs.current[index]?.focus();
        setTimeout(() => desciptionRefs.current[index]?.select(), 0);
      } else if (field === "sdisc") {
        hsnCodeRefs.current[index]?.focus();
        setTimeout(() => hsnCodeRefs.current[index]?.select(), 0);
      } else if (field === "tariff") {
        peciesRefs.current[index]?.focus();
        setTimeout(() => peciesRefs.current[index]?.select(), 0);
      } else if (field === "pkgs") {
        quantityRefs.current[index]?.focus();
        setTimeout(() => quantityRefs.current[index]?.select(), 0);
      } else if (field === "weight") {
        priceRefs.current[index]?.focus();
        setTimeout(() => priceRefs.current[index]?.select(), 0);
      } else if (field === "rate") {
        discountRef.current[index]?.focus();
        setTimeout(() => discountRef.current[index]?.select(), 0);
      } else if (field === "disc") {
        discount2Ref.current[index]?.focus();
        setTimeout(() => discount2Ref.current[index]?.select(), 0);
      }
      else if (field === "discount") {
        othersRefs.current[index]?.focus();
        setTimeout(() => othersRefs.current[index]?.select(), 0);
      }
    }
    // Move Left (←)
    else if (event.key === "ArrowLeft") {
      if (field === "exp_before") {
        discount2Ref.current[index]?.focus();
        setTimeout(() => discount2Ref.current[index]?.select(), 0);
      } else if (field === "discount") {
        discountRef.current[index]?.focus();
        setTimeout(() => discountRef.current[index]?.select(), 0);
      }else if (field === "disc") {
        priceRefs.current[index]?.focus();
        setTimeout(() => priceRefs.current[index]?.select(), 0);
      } else if (field === "rate") {
        quantityRefs.current[index]?.focus();
        setTimeout(() => quantityRefs.current[index]?.select(), 0);
      } else if (field === "weight") {
        peciesRefs.current[index]?.focus();
        setTimeout(() => peciesRefs.current[index]?.select(), 0);
      } else if (field === "pkgs") {
        hsnCodeRefs.current[index]?.focus();
        setTimeout(() => hsnCodeRefs.current[index]?.select(), 0);
      } else if (field === "tariff") {
        desciptionRefs.current[index]?.focus();
        setTimeout(() => desciptionRefs.current[index]?.select(), 0);
      } else if (field === "sdisc") {
        itemCodeRefs.current[index]?.focus();
        setTimeout(() => itemCodeRefs.current[index]?.select(), 0);
      } else if (field === "vcode") itemCodeRefs.current[index]?.focus();
    }
    // Move Up
    else if (event.key === "ArrowUp" && index > 0) {
      setTimeout(() => {
        if (field === "vcode") itemCodeRefs.current[index - 1]?.focus();
        else if (field === "sdisc") desciptionRefs.current[index - 1]?.focus();
        else if (field === "tariff") hsnCodeRefs.current[index - 1]?.focus();
        else if (field === "pkgs") peciesRefs.current[index - 1]?.focus();
        else if (field === "weight") quantityRefs.current[index - 1]?.focus();
        else if (field === "rate") priceRefs.current[index - 1]?.focus();
        else if (field === "disc") discountRef.current[index - 1]?.focus();
        else if (field === "exp_before") othersRefs.current[index - 1]?.focus();
      }, 100);
    }
    // Move Down
    else if (event.key === "ArrowDown" && index < items.length - 1) {
      setTimeout(() => {
        if (field === "vcode") itemCodeRefs.current[index + 1]?.focus();
        else if (field === "sdisc") desciptionRefs.current[index + 1]?.focus();
        else if (field === "tariff") hsnCodeRefs.current[index + 1]?.focus();
        else if (field === "pkgs") peciesRefs.current[index + 1]?.focus();
        else if (field === "weight") quantityRefs.current[index + 1]?.focus();
        else if (field === "rate") priceRefs.current[index + 1]?.focus();
        else if (field === "disc") discountRef.current[index + 1]?.focus();
        else if (field === "exp_before") othersRefs.current[index + 1]?.focus();
      }, 100);
    }
    // Open Modal on Letter Input in Account Name
    else if (/^[a-zA-Z]$/.test(event.key) && field === "accountname") {
      setPressedKey(event.key);
      openModalForItemCus(index);
      event.preventDefault();
    }
  };

  const handleOpenModal = (event, index, field) => {
    if (/^[a-zA-Z]$/.test(event.key) && field === "vcode") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItem(index);
      event.preventDefault(); // Prevent any default action
    }
  };

  const handleExit = async () => {
    // Check if grandtotal is Greater Than zero
    if (formData.grandtotal > 0 && isEditMode) {
      const confirmExit = window.confirm(
        "Are you sure you want to Exit? Unsaved changes may be lost."
      );
      if (!confirmExit) {
        return;
      }
    }

    setTitle("(View)");
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasegst/last`
      );

      if (response.status === 200 && response.data.data) {
        const lastEntry = response.data.data;
        setFormData(lastEntry.formData);
        setData1(response.data.data);
        setItems(lastEntry.items.map((item) => ({ ...item })));
        setsupplierdetails(
          lastEntry.supplierdetails.map((item) => ({ ...item }))
        );

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
          vtype: "P",
          vno: 0,
          vbillno: 0,
          exfor: "",
          trpt: "",
          p_entry: "",
          stype: "",
          btype: "",
          conv: "",
          vacode1: "",
          rem2: "",
          v_tpt: "",
          broker: "",
          srv_rate: "",
          srv_tax: "",
          tcs1_rate: "",
          tcs1: "",
          tcs206_rate: "",
          tcs206: "",
          duedate: "",
          gr: "",
          tdson: "",
          pcess: "",
          tax: "",
          cess1: "",
          cess2: "",
          sub_total: "",
          exp_before: "",
          Exp_rate6: "",
          Exp_rate7: "",
          Exp_rate8: "",
          Exp_rate9: "",
          Exp_rate10: "",
          Exp6: "",
          Exp7: "'",
          Exp8: "",
          Exp9: "",
          Exp10: "",
          cgst: "",
          sgst: "",
          igst: "",
          expafterGST: "",
          grandtotal: "",
        };
        setFormData(newData); // Set default form data
        setItems([
          {
            id: 1,
            vcode: "",
            sdisc: "",
            Units: "",
            pkgs: "",
            weight: "",
            rate: 0,
            amount: 0,
            disc: "",
            discount: "",
            gst: 0,
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
            ctax: 0,
            stax: 0,
            itax: 0,
            tariff: "",
            vamt: 0,
          },
        ]);
        setsupplierdetails([
          {
            Vcode: "",
            vacode: "",
            gstno: "",
            pan: "",
            Add1: "",
            city: "",
            state: "",
            bsGroup: "",
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

  const advanceRef = useRef(null);
  const twoBRef = useRef(null);
  const transportRef = useRef(null);
  const brokerRef = useRef(null);
  const tcsRef = useRef([]);
  const tdsRef = useRef([]);
  const tdsRef2 = useRef([]);
  const GrRef = useRef(null);
  const vehicelRef = useRef(null);
  const cess1Ref = useRef(null);
  const cess2Ref = useRef(null);

  const handleKeyDowndown = (event, nextFieldRef) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault(); // Prevent form submission
      if (nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };
  const gradientOptions = [
    { label: "Lavender", value: "linear-gradient(to right, #e6e6fa, #b19cd9)" },
    { label: "Yellow", value: "linear-gradient(to right, #fffac2, #ffdd57)" },
    { label: "Skyblue", value: "linear-gradient(to right, #ceedf0, #7fd1e4)" },
    { label: "Green", value: "linear-gradient(to right, #9ff0c3, #45a049)" },
    { label: "Pink", value: "linear-gradient(to right, #ecc7cd, #ff9a9e)" },
  ];

  const [color, setColor] = useState(() => {
    return localStorage.getItem("SelectedColorZ") || gradientOptions[0].value;
  });

  useEffect(() => {
    localStorage.setItem("SelectedColorZ", color);
  }, [color]);

  const handleChange = (event) => {
    setColor(event.target.value);
  };
  const handleInputChange = (index, field, value) => {
    const numericValue = value.replace(/[^0-9.-]/g, ""); // Allow only numbers, decimal points, and negative signs
    const updatedItems = [...items];
    updatedItems[index][field] = numericValue;

    // Recalculate expenses when Exp_rate1 to Exp_rate6 change
    const vamt = parseFloat(updatedItems[index].amount) || 0;
    const expRates = [
      parseFloat(updatedItems[index].Exp_rate1) || 0,
      parseFloat(updatedItems[index].Exp_rate2) || 0,
      parseFloat(updatedItems[index].Exp_rate3) || 0,
      parseFloat(updatedItems[index].Exp_rate4) || 0,
      parseFloat(updatedItems[index].Exp_rate5) || 0,
    ];
    const expFields = ["Exp1", "Exp2", "Exp3", "Exp4", "Exp5"];

    let totalExpenses = 0;
    expRates.forEach((rate, i) => {
      const expense = (vamt * rate) / 100;
      updatedItems[index][expFields[i]] = expense.toFixed(2);
      totalExpenses += expense;
    });
    // Update the exp_before field with the total of all expenses
    updatedItems[index].exp_before = totalExpenses.toFixed(2);

    const gst = parseFloat(updatedItems[index].gst);
    const totalAccordingWeight =
      parseFloat(updatedItems[index].weight) *
      parseFloat(updatedItems[index].rate);
    const totalAccordingPkgs =
      parseFloat(updatedItems[index].pkgs) *
      parseFloat(updatedItems[index].rate);
    let RateCal = updatedItems[index].RateCal;
    let TotalAcc = totalAccordingWeight; // Set a default value

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

    const others = parseFloat(updatedItems[index].exp_before) || 0;
    let disc = parseFloat(updatedItems[index].disc) || 0;
    let per = ((disc / 100) * TotalAcc).toFixed(2);
    let Amounts = TotalAcc + others + parseFloat(per);

    // Ensure TotalAcc is a valid number before calling toFixed()
    TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;
    const gstNumber = "03";
    const same = custGst.substring(0, 2);

    let cgst = 0,
      sgst = 0,
      igst = 0;
    if (gstNumber === same) {
      cgst = (Amounts * (gst / 2)) / 100;
      sgst = (Amounts * (gst / 2)) / 100;
    } else {
      igst = (Amounts * gst) / 100;
    }

    const totalWithGST = Amounts + cgst + sgst + igst;

    // Update tax and total fields
    updatedItems[index]["ctax"] = cgst.toFixed(2);
    updatedItems[index]["stax"] = sgst.toFixed(2);
    updatedItems[index]["itax"] = igst.toFixed(2);
    updatedItems[index]["discount"] = parseFloat(per).toFixed(2);
    updatedItems[index]["vamt"] = totalWithGST.toFixed(2); // ✅ Update the total amount (vamt)

    setItems(updatedItems);
    calculateTotalGst(); // ✅ Recalculate the grand total
  };
  useEffect(() => {
    if (currentIndex !== null && items[currentIndex]) {
      const updatedItems = [...items];
      const item = { ...updatedItems[currentIndex] };

      const vamt = parseFloat(item.amount) || 0;
      const pkgs = parseFloat(item.pkgs) || 0;
      const weight = parseFloat(item.weight) || 0;
      // Expense Calculations (Separate Logic for Each Expense)
      let Exp1 = 0,
        Exp2 = 0,
        Exp3 = 0,
        Exp4 = 0,
        Exp5 = 0;
      const Exp1Multiplier = Pos === "-Ve" ? -1 : 1;
      const Exp1Multiplier2 = Pos2 === "-Ve" ? -1 : 1;
      const Exp1Multiplier3 = Pos3 === "-Ve" ? -1 : 1;
      const Exp1Multiplier4 = Pos4 === "-Ve" ? -1 : 1;
      const Exp1Multiplier5 = Pos5 === "-Ve" ? -1 : 1;
      if (item.Exp_rate1) {
        if (CalExp1 === "W" || CalExp1 === "w") {
          Exp1 = (weight * parseFloat(item.Exp_rate1)) / 100;
        } else if (CalExp1 === "P" || CalExp1 === "p") {
          Exp1 = (pkgs * parseFloat(item.Exp_rate1)) / 100;
        } else if (CalExp1 === "V" || CalExp1 === "v" || CalExp1 === "") {
          Exp1 = (vamt * parseFloat(item.Exp_rate1)) / 100;
        }
        Exp1 *= Exp1Multiplier; // Apply negative only for Exp if Pos is "-Ve"
        item.Exp1 = Exp1.toFixed(2);
      } else {
        item.Exp1 = "0.00";
      }

      if (item.Exp_rate2) {
        if (CalExp2 === "W" || CalExp2 === "w") {
          Exp2 = (weight * parseFloat(item.Exp_rate2)) / 100;
        } else if (CalExp2 === "P" || CalExp2 === "p") {
          Exp2 = (pkgs * parseFloat(item.Exp_rate2)) / 100;
        } else if (CalExp2 === "V" || CalExp2 === "v" || CalExp2 === "") {
          Exp2 = (vamt * parseFloat(item.Exp_rate2)) / 100;
        }
        Exp2 *= Exp1Multiplier2; // Apply negative only for Exp if Pos is "-Ve"
        item.Exp2 = Exp2.toFixed(2);
      } else {
        item.Exp2 = "0.00";
      }

      if (item.Exp_rate3) {
        if (CalExp3 === "W" || CalExp3 === "w") {
          Exp3 = (weight * parseFloat(item.Exp_rate3)) / 100;
        } else if (CalExp3 === "P" || CalExp3 === "p") {
          Exp3 = (pkgs * parseFloat(item.Exp_rate3)) / 100;
        } else if (CalExp3 === "V" || CalExp3 === "v" || CalExp3 === "") {
          Exp3 = (vamt * parseFloat(item.Exp_rate3)) / 100;
        }
        Exp3 *= Exp1Multiplier3; // Apply negative only for Exp if Pos is "-Ve"
        item.Exp3 = Exp3.toFixed(2);
      } else {
        item.Exp3 = "0.00";
      }

      if (item.Exp_rate4) {
        if (CalExp4 === "W" || CalExp4 === "w") {
          Exp4 = (weight * parseFloat(item.Exp_rate4)) / 100;
        } else if (CalExp4 === "P" || CalExp4 === "p") {
          Exp4 = (pkgs * parseFloat(item.Exp_rate4)) / 100;
        } else if (CalExp4 === "V" || CalExp4 === "v" || CalExp4 === "") {
          Exp4 = (vamt * parseFloat(item.Exp_rate4)) / 100;
        }
        Exp4 *= Exp1Multiplier4; // Apply negative only for Exp if Pos is "-Ve"
        item.Exp4 = Exp4.toFixed(2);
      } else {
        item.Exp4 = "0.00";
      }

      if (item.Exp_rate5) {
        if (CalExp5 === "W" || CalExp5 === "w") {
          Exp5 = (weight * parseFloat(item.Exp_rate5)) / 100;
        } else if (CalExp5 === "P" || CalExp5 === "p") {
          Exp5 = (pkgs * parseFloat(item.Exp_rate5)) / 100;
        } else if (CalExp5 === "V" || CalExp5 === "v" || CalExp5 === "") {
          Exp5 = (vamt * parseFloat(item.Exp_rate5)) / 100;
        }
        Exp5 *= Exp1Multiplier5; // Apply negative only for Exp if Pos is "-Ve"
        item.Exp5 = Exp5.toFixed(2);
      } else {
        item.Exp5 = "0.00";
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
      let Amounts = TotalAcc + totalExpenses + parseFloat(per);

      TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;

      // GST Logic Based on State
      const gstNumber = "03";
      const same = custGst.substring(0, 2);
      let cgst = 0,
        sgst = 0,
        igst = 0;

      if (gstNumber === same) {
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
        item.discount = Math.round(per).toFixed(2);
        item.vamt = Math.round(totalWithGST).toFixed(2);
      } else {
        item.ctax = cgst.toFixed(2);
        item.stax = sgst.toFixed(2);
        item.itax = igst.toFixed(2);
        item.discount = parseFloat(per).toFixed(2);
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

  const handleOpenModalBack = (event, index, field) => {
    if (event.key === "Backspace" && field === "accountname") {
      setSelectedItemIndexCus(index);
      setShowModalCus(true);
      event.preventDefault();
    }
    if (event.key === "Backspace" && field === "vcode") {
      setSelectedItemIndex(index);
      setShowModal(true);
      event.preventDefault();
    }
  };

  const handleGross = (e) => {
    const { id, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value; // Handle checkbox differently
    setFormData({ ...formData, [id]: val });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    //console.log("Modal opened");
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
  const closeModalExp = () => {
    setIsModalOpenExp(false);
  };
  const [isModalOpenAfter, setIsModalOpenAfter] = useState(false);
  const handleKeyDownAfter = (e) => {
    if (e.key === "ArrowDown") {
      setIsModalOpenAfter(true);
    }
  };
  const closeModalAfter = () => {
    setIsModalOpenAfter(false);
    saveButtonRef.current.focus();
  };

  const handleDoubleClickAfter = (fieldName, index) => {
    if (fieldName === "expafterGST" && isEditMode) {
      setIsModalOpenAfter(true);
      // Open another modal if needed
    } else if (fieldName === "exp_before" && isEditMode) {
      setCurrentIndex(index); // Set the current index
      setIsModalOpenExp(true); // Open the modal
    }
  };
  const handleExpAfterGst = (event) => {
    const { id, value } = event.target;
    const subTotal = parseFloat(formData.sub_total) || 0;

    // Initialize newFormData and expenses
    let newFormData = { ...formData, [id]: value };
    let expense = 0;

    // Check if the value is empty; if so, set corresponding Exp value to 0
    if (value === "") {
      newFormData[id] = 0; // Ensure Exp_rate is set to 0
    } else {
      const expRate = parseFloat(value) || 0;

      // Calculate percentage for Exp_rate7 to Exp_rate12
      switch (id) {
        case "Exp_rate7":
          newFormData.Exp7 = ((subTotal * expRate) / 100).toFixed(2);
          break;
        case "Exp_rate8":
          newFormData.Exp8 = ((subTotal * expRate) / 100).toFixed(2);
          break;
        case "Exp_rate9":
          newFormData.Exp9 = ((subTotal * expRate) / 100).toFixed(2);
          break;
        case "Exp_rate10":
          newFormData.Exp10 = ((subTotal * expRate) / 100).toFixed(2);
          break;
        case "Exp_rate11":
          newFormData.Exp11 = ((subTotal * expRate) / 100).toFixed(2);
          break;
        case "Exp_rate12":
          newFormData.Exp12 = ((subTotal * expRate) / 100).toFixed(2);
          break;
        default:
          break;
      }
    }

    // Calculate total of Exp7 to Exp12 and update expafterGST
    const totalExpenses =
      parseFloat(newFormData.Exp7 || 0) +
      parseFloat(newFormData.Exp8 || 0) +
      parseFloat(newFormData.Exp9 || 0) +
      parseFloat(newFormData.Exp10 || 0) +
      parseFloat(newFormData.Exp11 || 0) +
      parseFloat(newFormData.Exp12 || 0);

    newFormData.expafterGST = totalExpenses.toFixed(2);

    setFormData(newFormData);
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
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index].weight = value.toFixed(decimalPlaces) || 0;
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
  const handleKeyDownTab = (e) => {
    if (e.key === "Tab") {
      e.preventDefault(); // prevent default Tab behavior
      customerNameRef.current.focus(); // move focus to vaCode2 input
    }
  };

  const printRef = useRef();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
         const openPrintMenu = () => {
          setIsMenuOpen(true);
      };
  
      const closePrintMenu = () => {
          setIsMenuOpen(false);
      };
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
  return (
    <div>
      <div>
        <ToastContainer />
      </div>
      <div style={{ visibility: "hidden", width: 0, height: 0 }}>
        {SelectedInvoiceComponent && (
          <SelectedInvoiceComponent
            formData={formData}
            items={items}
            supplierdetails={supplierdetails}
            isOpen={open}
            handleClose={handleCloseInvoice}
            componentRef={printRef} // pass the ref
            selectedCopies={selectedCopies}
          />
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "row", marginTop: -30 }}>
        <h1 className="headerSale">
          PURCHASE GST{" "}
          <span className="text-black-500 font-semibold text-base sm:text-lg">
            {title}
          </span>
        </h1>
      </div>
      <div className="pur_toppart ">
        <div className="Dated ">
          <DatePicker
            ref={datePickerRef}
            selected={selectedDate || null}
            openToDate={new Date()}
            onCalendarClose={handleCalendarClose}
            dateFormat="dd-MM-yyyy"
            onChange={handleDateChange}
            onBlur={() => validateDate(selectedDate)}
            customInput={<MaskedInput />}
          />
          {/* <DatePicker
            popperClassName="custom-datepicker-popper"
            ref={datePickerRef}
            className="DatePICKER"
            id="date"
            selected={selectedDate || null}
            openToDate={new Date()}
            onCalendarClose={handleCalendarClose}
            dateFormat="dd-MM-yyyy"
            onChange={handleDateChange}
            onBlur={() => validateDate(selectedDate)} // ✅ call on blur
            onChangeRaw={(e) => {
              if (!e.target.value) return; // ✅ avoid undefined error

              let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
              if (val.length > 2) val = val.slice(0, 2) + "-" + val.slice(2);
              if (val.length > 5) val = val.slice(0, 5) + "-" + val.slice(5, 9);

              e.target.value = val; // Show formatted input
            }}
            readOnly={!isEditMode || isDisabled}
          /> */}
          <div className="billdivz">
            <TextField
              className="billzNo custom-bordered-input"
              id="vno"
              value={formData.vno}
              variant="filled"
              size="small"
              label="V.NO"
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
              style={{backgroundColor:"blue",color:'white',fontWeight:'bold'}}
              onClick={openModal}
              >
                SETUP
              </button>

              {/* Settings Button */}
              <button
                onClick={() => setDrawerOpen(true)}
                className="Setting text-xl text-blue-700"
              >
                <FaCog />
              </button>
            {/* Fullscreen Overlay Drawer */}
            {drawerOpen && (
              <div style={{zIndex:10000}}>
                {/* Background Overlay */}
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setDrawerOpen(false)}
                ></div>

                {/* Drawer Panel */}
                <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
                  {/* Drawer Header */}
                  <div className="flex justify-between items-center px-4 py-3 border-b">
                    <span className="font-bold text-lg">Options</span>
                    <button
                      onClick={() => setDrawerOpen(false)}
                      className="text-xl text-gray-600"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {/* Drawer Body */}
                  <div className="flex flex-col p-4 gap-3">
                    {/* Color Selector */}
                    <select
                      className="border border-gray-400 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                      value={color}
                      onChange={handleChange}
                    >
                      {gradientOptions.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>

                    {/* Font Size Buttons */}
                    {/* <div className="flex gap-2">
                      <button
                        onClick={decreaseFontSize}
                        className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center text-lg"
                      >
                        <FaMinus />
                      </button>

                      <button
                        onClick={increaseFontSize}
                        className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center text-lg"
                      >
                        <FaPlus />
                      </button>
                    </div> */}
                  <div style={{ display: "flex", flexWrap: "wrap",flexDirection:'column'}}>
                    <span style={{fontSize:17,fontWeight:'bold'}}>SELECT TABLE FIELDS</span>
                    <div style={{marginTop:"10px",display:'flex',flexDirection:"column"}}>
                    {Object.keys(tableData).map((field) => (
                      <label key={field} style={{ marginRight: "15px",fontSize:16 }}>
                        <input
                        style={{height:"15px",width:"15px"}}
                          type="checkbox"
                          checked={tableData[field]}
                          onChange={() => handleCheckboxChange(field)}
                        />
                        &nbsp;{field.toUpperCase()}
                      </label>
                    ))}
                    </div>
                  </div>
                  </div>
                </div>
              
              </div>
            )}
          </div>
          {isModalOpen && <PurchaseSetup onClose={closeModal} />}
        </div>
        <div className="TopFields">
          {supplierdetails.map((item, index) => (
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
                      handleEnterKeyPress(customerNameRef, grNoRef)(e);
                      handleKeyDown(e, index, "accountname");
                      handleOpenModalBack(e, index, "accountname");
                    }}
                    onDoubleClick={(e) => {
                      handleDoubleClickAfter(e, "accountname", index);
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
          <div className="BillDate">
            <TextField
              inputRef={vBillNoRef}
              className="VbillzNo custom-bordered-input"
              id="vbillno"
              value={formData.vbillno}
              variant="filled"
              size="small"
              label="BILL NO"
              onChange={handleCapitalAlpha}
              onKeyDown={handleEnterKeyPress(vBillNoRef, grNoRef)}
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
            <DatePicker
              className="DatePICKERP"
              id="date"
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd-MM-yyyy"
            />
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
              onChange={handleNumberChange}
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
                onChange={HandleInputsChanges}
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
                // sx={{ width: 128,mt:0.5 }}
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
              onKeyDown={handleEnterKeyPress(vehicleNoRef, selfInvRef)}
              onFocus={(e) => e.target.select()}
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
            <div className="SELFinv">
              <TextField
                inputRef={selfInvRef}
                className="custom-bordered-input"
                id="p_entry"
                value={formData.p_entry}
                variant="filled"
                label="SELF INV#"
                size="small"
                onChange={HandleInputsChanges}
                onKeyDown={handleEnterKeyPress(selfInvRef, null)}
                onFocus={(e) => e.target.select()}
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
          </div>
          <div className="TAXDiv">
            <div>
              <FormControl
                fullWidth
                size="small"
                variant="filled"
                className="custom-bordered-input"
                sx={{
                  fontSize: `${fontSize}px`,
                  "& .MuiFilledInput-root": {
                    height: 47, // adjust as needed (default ~56px for filled)
                  },
                }}
              >
                <InputLabel id="taxtype-label">TAX TYPE</InputLabel>
                <Select
                  className="TAXtypez custom-bordered-input"
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
                  // onChange={handleTaxType}
                  label="TAX TYPE"
                  displayEmpty
                  MenuProps={{
                    disablePortal: true,
                  }}
                  inputProps={{
                    sx: {
                      fontSize: `${fontSize}px`,
                      pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
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
                    height: 47, // adjust as needed (default ~56px for filled)
                  },
                }}
                size="small"
                variant="filled"
              >
                <InputLabel id="supply-label">SUPPLY TYPE</InputLabel>
                <Select
                  className="SupplyTYPE custom-bordered-input"
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
                  // onChange={handleSupply}
                  label="SUPPLY TYPE"
                  displayEmpty
                  inputProps={{
                    sx: {
                      fontSize: `${fontSize}px`,
                      pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
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
      {/* Table content */}
      <div className="tablestylez">
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
            {tableData.itemcode && <th>ITEMCODE</th>}
            {tableData.sdisc && <th>DESCRIPTION</th>}
            {tableData.hsncode && <th>HSNCODE</th>}
            {tableData.pcs && <th>PCS</th>}
            {tableData.qty && <th>QTY</th>}
            {tableData.rate && <th>RATE</th>}
            {tableData.amount && <th>AMOUNT</th>}
            {tableData.discount && <th>DIS@</th>}
            {tableData.discount && <th>DISCOUNT</th>}
            {tableData.gst && <th>GST</th>}
            {tableData.others && <th>OTHERS</th>}
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
                <td style={{ padding: 0, width: 30 }}>
                  <input
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
                    value={item.vcode}
                    readOnly
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "vcode");
                      handleOpenModal(e, index, "vcode");
                      handleOpenModalBack(e, index, "vcode");
                    }}
                    onDoubleClick={(e) => {
                     handleDoubleClickAfter(e,"vcode", index)
                    }}
                    ref={(el) => (itemCodeRefs.current[index] = el)}
                    onFocus={(e) => e.target.select()} // Select text on focus
                  />
                </td>
                )}
                {tableData.sdisc && (
                <td style={{ padding: 0, width: 300 }}>
                  <input
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
                    value={item.pkgs} // Show raw value during input
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
                    value={item.weight} // Show raw value during input
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
                    value={item.rate} // Show raw value during input
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
                    value={item.amount}
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
                    value={item.disc}
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
                    value={item.discount}
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
                {tableData.gst && (
                <td style={{ padding: 0 }}>
                  <input
                    className="Others"
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
                    value={item.gst +"%"}
                    readOnly={!isEditMode || isDisabled}
                  />
                </td>
                )}
                {tableData.others && (
                <td style={{ padding: 0 }}>
                  <input
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
                    value={item.exp_before}
                    readOnly={!isEditMode || isDisabled}
                    onDoubleClick={() =>
                      handleDoubleClickAfter("exp_before", index)
                    } // Pass index here
                    // onChange={(e) => handleItemChange(index, "exp_before", e.target.value)}
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "exp_before");
                       handleKeyDownExp(e, "exp_before", index)
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
                  <div className="Modal">
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
                              e.target.checked
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
                      ].map((field, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "10px", // Spacing between items
                            marginBottom: "10px", // Space between rows
                          }}
                        >
                          <label style={{ width: "100px", fontWeight: "bold" }}>
                            {field.label}
                          </label>

                          <input
                            value={items[currentIndex][field.rate]}
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                              width: "120px",
                              textAlign: "right",
                              borderRadius: "4px",
                            }}
                            onChange={(e) =>
                              handleInputChange(
                                currentIndex,
                                field.rate,
                                e.target.value
                              )
                            }
                          />

                          <input
                            value={items[currentIndex][field.value]}
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                              width: "120px",
                              textAlign: "right",
                              borderRadius: "4px",
                            }}
                            onChange={(e) =>
                              handleInputChange(
                                currentIndex,
                                field.value,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      ))}
                      <Button
                        onClick={() => {
                          setIsModalOpenExp(false);
                          setCurrentIndex(null); // Reset the index when closing the modal
                          handleAddItem();
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
                    value={item.ctax}
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
                    value={item.stax}
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
                    value={item.itax}
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
                <td style={{ padding: 0}}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",  // horizontally center
                      alignItems: "center",      // vertically center
                      height: "100%",            // takes full cell height
                    }}
                  >
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteItem(index)}
                      size="small"
                      tabIndex={-1} // ✅ prevent focus when tabbing
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </td>
                )}
              </tr>
            ))}
          </tbody>
          <tfoot style={{ background: color, position: "sticky", bottom: -6, fontSize: `${fontSize}px`,borderTop:"1px solid black" }}>
          <tr style={{ fontWeight: "bold", textAlign: "right" }}>
            {tableData.itemcode && <td></td>}
            {tableData.sdisc && <td>TOTAL</td>}
            {tableData.hsncode && <td></td>}
            {tableData.pcs && (
              <td>{items.reduce((sum, item) => sum + parseFloat(item.pkgs || 0), 0).toFixed(pkgsValue)}</td>
            )}
            {tableData.qty && (
              <td>{items.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0).toFixed(weightValue)}</td>
            )}
            {tableData.rate && <td></td>}
            {tableData.amount && (
              <td>{items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2)}</td>
            )}
            {tableData.discount && (
              <>
                <td>{items.reduce((sum, item) => sum + parseFloat(item.disc || 0), 0).toFixed(2)}</td>
                <td>{items.reduce((sum, item) => sum + parseFloat(item.discount || 0), 0).toFixed(2)}</td>
              </>
            )}
            {tableData.gst && <td></td>}
            {tableData.others && (
              <td>{items.reduce((sum, item) => sum + parseFloat(item.exp_before || 0), 0).toFixed(2)}</td>
            )}
            {tableData.cgst && (
              <td>{items.reduce((sum, item) => sum + parseFloat(item.ctax || 0), 0).toFixed(2)}</td>
            )}
            {tableData.sgst && (
              <td>{items.reduce((sum, item) => sum + parseFloat(item.stax || 0), 0).toFixed(2)}</td>
            )}
            {tableData.igst && (
              <td>{items.reduce((sum, item) => sum + parseFloat(item.itax || 0), 0).toFixed(2)}</td>
            )}
            {isEditMode && <td></td>}
          </tr>
          </tfoot>
        </Table>
      </div>
      {showModal && (
      <ProductModal
        products={products}
        allFields={allFields}
        onSelect={handleProductSelect}
        onClose={handleModalDone}
        tenant={tenant}
        initialKey={pressedKey}
        fetchParentProducts={fetchProducts}
      />
      )}

      <div className="Belowcontents">
        <div className="bottomcontainer1">
          <div
            style={{ display: "flex", flexDirection: "column", marginLeft: 5 }}
          >
            <div>
              <TextField
                id="vacode1"
                label="2B STATUS"
                value={formData.vacode1}
                onChange={HandleInputsChanges}
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
                size="small"
                variant="filled"
                className="Remz custom-bordered-input"
                // sx={{ width: 250 }} // Adjust width as needed
              />
            </div>
            <div>
              <TextField
                inputRef={transportRef}
                id="v_tpt"
                label="TRANSPORT"
                value={formData.v_tpt}
                onChange={HandleInputsChanges}
                onKeyDown={(e) => {
                  handleOpenModalTpt(e, "v_tpt", "v_tpt");
                  handleKeyDowndown(e, brokerRef);
                }}
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                    readOnly: !isEditMode || isDisabled,
                  },
                }}
                size="small"
                variant="filled"
                className="Remz custom-bordered-input"
                // sx={{ width: 250 }} // Adjust width as needed
              />
            </div>
            <div>
              <TextField
                inputRef={brokerRef}
                id="broker"
                label="BROKER"
                value={formData.broker}
                onChange={HandleInputsChanges}
                onKeyDown={(e) => {
                  handleOpenModalTpt(e, "broker", "broker");
                  handleKeyDowndown(e, expAfterGSTRef);
                }}
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                    readOnly: !isEditMode || isDisabled,
                  },
                }}
                size="small"
                variant="filled"
                className="Remz custom-bordered-input"
                // sx={{ width: 250 }} // Adjust width as needed
              />
            </div>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", marginLeft: 5 }}
          >
            <div>
              <FormControl
                variant="filled"
                size="small"
                // disabled={!isEditMode || isDisabled}
                sx={{
                  // width: '100%', // Let width be controlled by content or parent
                  "& .MuiFilledInput-root": {
                    height: 48, // Match your original height
                  },
                }}
                className="TDSon custom-bordered-input"
              >
                <InputLabel
                  id="tdson"
                  sx={{
                    fontSize: "1rem",
                    fontWeight: 600,
                  }}
                >
                  TDS ON
                </InputLabel>
                <Select
                  labelId="tdson"
                  className="TDSon custom-bordered-input"
                  id="tdson"
                  value={formData.tdson}
                  onChange={(e) => {
                  if (!isEditMode || isDisabled) return; // prevent changing
                    handleTdsOn(e);
                  }}
                  onOpen={(e) => {
                    if (!isEditMode || isDisabled) {
                      e.preventDefault(); // prevent dropdown opening
                    }
                  }}
                  // onChange={handleTdsOn}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  sx={{
                    color: "red",
                    fontWeight: "bold",
                    fontSize: `${fontSize}px`, // 👈 Dynamic font size
                    backgroundColor: (!isEditMode || isDisabled) ? "#f0f0f0" : "white", // mimic disabled style
                    pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
                  }}
                  MenuProps={{ disablePortal: true }}
                >
                  <MenuItem value="Interest">Interest</MenuItem>
                  <MenuItem value="Freight">Freight</MenuItem>
                  <MenuItem value="Brokerage">Brokerage</MenuItem>
                  <MenuItem value="Commission">Commission</MenuItem>
                  <MenuItem value="Advertisement">Advertisement</MenuItem>
                  <MenuItem value="Labour">Labour</MenuItem>
                  <MenuItem value="Contract">Contract</MenuItem>
                  <MenuItem value="Job Work">Job Work</MenuItem>
                  <MenuItem value="Salary">Salary</MenuItem>
                  <MenuItem value="Rent">Rent</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="Purchase">Purchase</MenuItem>
                </Select>
              </FormControl>
            </div>
              <TextField
                className="custom-bordered-input"
                id="srv_tax"
                value={formData.srv_tax}
                // disabled
                label='TDS 194-Q'
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                    color: 'red',
                  },
                }}
                onFocus={(e) => e.target.select()}
                size="small"
                variant="filled"
                sx={{ width: 200 }}
              />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextField
                className="TCSRATE custom-bordered-input"
                // inputRef={tcsRef2}
                id="tcs206_rate"
                value={formData.tcs206_rate}
                // onKeyDown={(e) => handleKeyDowndown(e, expAfterGSTRef)}
                label="%"
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
                // sx={{ width: 100}}
                InputProps={{ readOnly: !isEditMode || isDisabled }}
              />

              <TextField
                className="TCSPER custom-bordered-input"
                id="tcs206"
                value={formData.tcs206}
                onChange={handleNumberChange}
                label="TCS @"
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
            {/* <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <TextField
                className="TCSRATE custom-bordered-input"
                inputRef={tcsRef}
                id="tcs1_rate"
                label="%"
                value={formData.tcs1_rate}
                onChange={handleNumberChange}
                // onKeyDown={(e) => handleKeyDowndown(e, tcsRef2)}
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
                // sx={{ width: 100}}
                InputProps={{ readOnly: !isEditMode || isDisabled }}
              />
              <TextField
                className="TCSPER custom-bordered-input"
                id="tcs1"
                value={formData.tcs1}
                // disabled
                label="TCS 206c1H"
                onChange={handleNumberChange}
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
            </div> */}
          </div>
          {/* C/S/I/TDS */}
          <div
            style={{ display: "flex", flexDirection: "column", marginLeft: 5}}
          >
            <div style={{ display: "flex", flexDirection: "row",marginTop:"auto" }}>
            <div className="duedatez">
                <DatePicker
                  id="duedate"
                  value={formData.duedate}
                  className="dueDatePICKER"
                  selected={expiredDate}
                  onChange={handleDateChange}
                  readOnly={!isEditMode || isDisabled}
                  dateFormat="dd-MM-yyyy"
                  customInput={
                    <TextField
                      className="custom-bordered-input"
                      label="DUE DATE"
                      variant="filled"
                      size="small"
                      sx={{
                        "& .MuiInputBase-root": {
                          height: 46.5, // Adjust height here
                        },
                        "& .MuiInputBase-input": {
                          padding: "20px 14px 6px", // more top padding so text sits lower
                        }
                      }}
                    />
                  }
                />
            </div>
            <div style={{marginLeft:"5px"}}>
              <TextField
                id="cess1"
                value={formData.cess1}
                label="CESS1"
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                  },
                }}
                size="small"
                variant="filled"
                className="custom-bordered-input"
                sx={{ width: 165 }} // Adjust width as needed
              />
            </div>
            <div style={{marginLeft:"5px"}}>
              <TextField
                id="cess2"
                value={formData.cess2}
                label="CESS2"
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 20,
                    fontSize: `${fontSize}px`,
                  },
                }}
                size="small"
                variant="filled"
                className="custom-bordered-input"
                sx={{ width: 165 }} // Adjust width as needed
              />
            </div>
            </div>
            <div className="tdstax" style={{ display: "flex", flexDirection: "row" }}>
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
          {/* TOTALS */}
          <div
            style={{ display: "flex", flexDirection: "column",marginLeft:"auto",marginRight:"12px"}}
          >
            <div>
              <TextField
                className="TOTALFIELD custom-bordered-input"
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
            </div>
            <div>
              <TextField
                className="TOTALFIELD custom-bordered-input"
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
                <div className="Modal">
                  <div className="Modal-content">
                    <h1 className="headingE">EXPENSE AFTER TAX</h1>
                    <div className="form-group">
                      <input
                        type="checkbox"
                        id="gross"
                        checked={formData.gross}
                        onChange={handleGross}
                      />
                      <label
                        style={{ marginLeft: 5 }}
                        className="label"
                        htmlFor="Gross"
                      >
                        GROSS
                      </label>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <text>{Expense6}</text>
                      <input
                        id="Exp_rate6"
                        value={formData.Exp_rate6}
                        style={{
                          border: "1px solid black",
                          width: 100,
                          marginLeft: 26,
                        }}
                        onChange={handleNumberChange} // Updated to the new function name
                      />
                      <input
                        id="Exp6"
                        value={formData.Exp6}
                        style={{
                          border: "1px solid black",
                          width: 100,
                          marginLeft: 5,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <text>{Expense7}</text>
                      <input
                        id="Exp_rate7"
                        value={formData.Exp_rate7}
                        style={{
                          border: "1px solid black",
                          width: 100,
                          marginLeft: 26,
                        }}
                        onChange={handleNumberChange} // Updated to the new function name
                      />
                      <input
                        id="Exp7"
                        value={formData.Exp7}
                        style={{
                          border: "1px solid black",
                          width: 100,
                          marginLeft: 5,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <text>{Expense8}</text>
                      <input
                        id="Exp_rate8"
                        value={formData.Exp_rate8}
                        style={{
                          border: "1px solid black",
                          width: 100,
                          marginLeft: 26.5,
                        }}
                        onChange={handleNumberChange} // Updated to the new function name
                      />
                      <input
                        id="Exp8"
                        value={formData.Exp8}
                        style={{
                          border: "1px solid black",
                          width: 100,
                          marginLeft: 5,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <text>{Expense9}</text>
                      <input
                        id="Exp_rate9"
                        value={formData.Exp_rate9}
                        style={{
                          border: "1px solid black",
                          width: 100,
                          marginLeft: 18,
                        }}
                        onChange={handleNumberChange} // Updated to the new function name
                      />
                      <input
                        id="Exp9"
                        value={formData.Exp9}
                        style={{
                          border: "1px solid black",
                          width: 100,
                          marginLeft: 5,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <text>{Expense10}</text>
                      <input
                        id="Exp_rate10"
                        value={formData.Exp_rate10}
                        style={{
                          border: "1px solid black",
                          width: 100,
                          marginLeft: 24.5,
                        }}
                        onChange={handleNumberChange} // Updated to the new function name
                      />
                      <input
                        id="Exp10"
                        value={formData.Exp10}
                        style={{
                          border: "1px solid black",
                          width: 100,
                          marginLeft: 5,
                        }}
                      />
                    </div>
                    <Button
                      onClick={closeModalAfter}
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
            </div>
               <div>
              <TextField
                id="grandtotal"
                value={formData.grandtotal}
                label="GRAND TOTAL"
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
                className="TOTALFIELD custom-bordered-input"
                // sx={{ width: 150 }}
              />
            </div>
          </div>
        </div>
        <div className="Buttonsgroupz">
          <Button
          ref={addButtonRef}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[0] }}
            onClick={handleAdd}
            disabled={!isAddEnabled}
          >
            Add
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[1] }}
            onClick={handleEditClick}
            disabled={!isAddEnabled}
          >
            Edit
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[2] }}
            onClick={handlePrevious}
            disabled={!isPreviousEnabled}
          >
            Previous
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[3] }}
            onClick={handleNext}
            disabled={!isNextEnabled}
          >
            Next
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[4] }}
            onClick={handleFirst}
            disabled={!isFirstEnabled}
          >
            First
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[5] }}
            onClick={handleLast}
            disabled={!isLastEnabled}
          >
            Last
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[6] }}
            disabled={!isSearchEnabled}
            onClick={() => {
              fetchAllBills();
              setShowSearch(true);
            }}
          >
            Search
          </Button>

          {isFAModalOpen && (
            <FAVoucherModal
              open={isFAModalOpen}
              onClose={() => setIsFAModalOpen(false)}
              tenant={tenant}
              voucherno={formData.vno}
              vtype="P"
            />
            // <PurFAVoucherModal
            //   open={isFAModalOpen}
            //   onClose={() => setIsFAModalOpen(false)}
            //   tenant={"shkun_05062025_05062026"}
            //   voucherno={formData?.vno}
            //   vtype="P"
            //   headerTitle="FA VOUCHER (PURCHASE)"
            // />
          )}

          <Button
            ref={printButtonRef}
            className="Buttonz"
            onClick={openPrintMenu}
            style={{ color: "black", backgroundColor: buttonColors[7] }}
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
            style={{ color: "black", backgroundColor: buttonColors[8] }}
            onClick={handleDeleteClick}
            disabled={!isDeleteEnabled}
          >
            Delete
          </Button>
          <Button
            onClick={handleExit}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[9] }}
          >
            Exit
          </Button>
          <Button
            ref={saveButtonRef}
            className="Buttonz"
            onClick={handleDataSave}
            disabled={!isSubmitEnabled}
            style={{ color: "black", backgroundColor: buttonColors[10] }}
          >
            Save
          </Button>
        </div>
      </div>
      {/* Search Modal */}
      <Modal show={showSearch} onHide={() => setShowSearch(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <Form.Control
            type="text"
            placeholder="Enter Bill No..."
            value={searchBillNo}
            onChange={(e) => setSearchBillNo(e.target.value)}
          />
          <DatePicker
            selected={searchDate}
            onChange={(date) => setSearchDate(date)}
            placeholderText="Select Date"
            dateFormat="dd-MM-yyyy"
            className="form-control"
          />
          <Button
            variant="secondary"
            onClick={() => {
              setSearchBillNo("");
              setSearchDate(null);
            }}
          >
            Clear
          </Button>
        </div>
        <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <Table  bordered hover>
            <thead style={{background:"lightgrey"}}> 
              <tr>
                <th>BillNo</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>City</th>
                <th>GrandTotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                  <tr
                    key={bill.vbillno}
                    onClick={() => handleSelectBill(bill)}
                    style={{ cursor: "pointer" }}
                  >
                  <td>{bill.formData.vno}</td>
                  <td>
                    {new Date(bill.formData.date).toLocaleDateString("en-GB")}
                  </td>
                  <td>{bill.supplierdetails?.[0]?.vacode}</td>
                  <td>{bill.supplierdetails?.[0]?.city}</td>
                  <td>{bill.formData.grandtotal}</td>
                  <td>
                    <Button
                      size="sm"
                      onClick={() => {
                        handleSelectBill(bill);
                        setShowSearch(false);
                      }}
                    >
                      Select
                    </Button>
                  </td>
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
    </div>
  );
};
export default Purchase;

