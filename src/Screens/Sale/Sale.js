// import React, { useState, useEffect, useRef, forwardRef } from "react";
// import "./Sale.css";
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
// import SaleSetup from "./SaleSetup";
// import InvoicePDF from "../InvoicePDF/InvoicePDF";
// import InvoicepdfSale1 from "../InvoicePDF/InvoicepdfSale1";
// import InvoiceSaleChallan from "../InvoicePDF/InvoiceSaleChallan";
// import InvoiceSale2 from "../InvoicePDF/InvoiceSale2";
// import InvoiceSale3 from "../InvoicePDF/InvoiceSale3";
// import InvoiceKaryana from "../InvoicePDF/InvoiceKaryana";
// import InvoiceG4 from "../InvoicePDF/InvoiceG4";
// import InvoiceSlip from "../InvoicePDF/InvoiceSlip";
// import { useReactToPrint } from "react-to-print";
// import { useEditMode } from "../../EditModeContext";
// import { CompanyContext } from "../Context/CompanyContext";
// import { useContext } from "react";
// import TextField from "@mui/material/TextField";
// import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import {IconButton} from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import BillPrintMenu from "../Modals/BillPrintMenu";
// import useCompanySetup from "../Shared/useCompanySetup";
// import { Modal, Form } from "react-bootstrap";
// import useTdsApplicable from "../Shared/useTdsApplicable";
// import FAVoucherModal from "../Shared/FAVoucherModal";
// import { useNavigate, useLocation } from "react-router-dom";

// const LOCAL_STORAGE_KEY = "tabledataVisibility";

// const Sale = () => {

//   const location = useLocation();
//   const saleId = location.state?.saleId;
//   const navigate = useNavigate();

//   const { CompanyState, unitType } = useCompanySetup();
//   const { applicable194Q } = useTdsApplicable();
//   const { company } = useContext(CompanyContext);
//   const tenant = "shkun_05062025_05062026";
// //   const tenant = "shkun_05062025_05062026"

//   if (!tenant) {
//     // you may want to guard here or show an error state,
//     // since without a tenant you can’t hit the right API
//     // console.error("No tenant selected!");
//   }

//   const [selectedCopies, setSelectedCopies] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(null);
//   const [title, setTitle] = useState("(View)");
//   const datePickerRef = useRef(null);
//   const voucherNoRef = useRef(null);
//   const tableContainerRef = useRef(null);
//   const itemCodeRefs = useRef([]);
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
//   const shippedtoRef = useRef(null);
//   const remarksRef = useRef(null);
//   const transportRef = useRef(null);
//   const brokerRef = useRef(null);
//   const dueDateRef = useRef(null);
//   const tcsRef = useRef([]);
//   const tcsRef2 = useRef([]);
//   const addLessRef = useRef(null);
//   const printButtonRef = useRef(null);
//   const addButtonRef = useRef(null);
//   const expAfterGSTRef = useRef(null);
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
//   const [selectedInvoice, setSelectedInvoice] = useState("InvoicePDF");
//   const invoiceComponents = {
//     InvoicePDF,
//     InvoicepdfSale1,
//     InvoiceSaleChallan,
//     InvoiceSale2,
//     InvoiceSale3,
//     InvoiceKaryana,
//     InvoiceG4,
//     InvoiceSlip,
//   };
//   const handleCloseInvoice = () => setOpen(false);
//   const SelectedInvoiceComponent = invoiceComponents[selectedInvoice];
//   const [buttonColors, setButtonColors] = useState(initialColors); // Initial colors
//   const [formData, setFormData] = useState({
//     date: "",
//     vtype: "S",
//     vbillno: 0,
//     vno: 0,
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
//     gross: false,
//     tcsper: 0,
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
//   const [customerDetails, setcustomerDetails] = useState([
//     {
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
//   const MIN_ROWS = 5;

//   const createEmptyRow = (id, expRates = {}) => ({
//     id,
//     vcode: "",
//     sdisc: "",
//     Units: "",
//     pkgs: "0",
//     weight: "0",
//     rate: "0",
//     amount: "0",
//     disc: 0,
//     discount: "",
//     gst: 0,
//     Pcodes01: "",
//     Pcodess: "",
//     Scodes01: "",
//     Scodess: "",
//     Exp_rate1: expRates.ExpRate1 ?? 0,
//     Exp_rate2: expRates.ExpRate2 ?? 0,
//     Exp_rate3: expRates.ExpRate3 ?? 0,
//     Exp_rate4: expRates.ExpRate4 ?? 0,
//     Exp_rate5: expRates.ExpRate5 ?? 0,
//     Exp1: 0,
//     Exp2: 0,
//     Exp3: 0,
//     Exp4: 0,
//     Exp5: 0,
//     exp_before: 0,
//     ctax: "0.00",
//     stax: "0.00",
//     itax: "0.00",
//     tariff: "",
//     vamt: "0.00",
//   });

//   const normalizeItems = (items = [], expRates = {}) => {
//     const rows = [...items];

//     while (rows.length < MIN_ROWS) {
//       rows.push(createEmptyRow(rows.length + 1, expRates));
//     }

//     return rows;
//   };

//   const [items, setItems] = useState(() => normalizeItems());

//   const [shipped, setshipped] = useState([
//     {
//       shippedto: "",
//       shippingAdd: "",
//       shippingcity: "",
//       shippingState: "",
//       shippingGst: "",
//       shippingPan: "",
//     },
//   ]);

//   useEffect(() => {
//     console.log("CompanyState",CompanyState);
    
//     if (addButtonRef.current && !saleId) {
//       addButtonRef.current.focus();
//     }
//   }, []);

//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//       const openPrintMenu = () => {
//       setIsMenuOpen(true);
//   };

//   const closePrintMenu = () => {
//       setIsMenuOpen(false);
//   };

//   const defaultTableFields = {
//     itemcode: true,
//     sdisc: true,
//     hsncode: true,
//     pcs: true,
//     qty: true,
//     rate: true,
//     amount: true,
//     discount: false,
//     others: true,
//     gst:false,
//     cgst: true,
//     sgst: true,
//     igst: true,
//   };
  
//   const [tableData, settableData] = useState(() => {
//   const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//   const parsed = saved ? JSON.parse(saved) : {};
  
//   // Only keep keys that exist in defaultFormData
//   const sanitized = Object.fromEntries(
//     Object.entries({ ...defaultTableFields, ...parsed }).filter(([key]) =>
//       Object.hasOwn(defaultTableFields, key)
//     )
//   );
  
//   return sanitized;
// });


//   // Save to localStorage whenever tableData changes
//   useEffect(() => {
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tableData));
//   }, [tableData]);

//   const handleCheckboxChange = (field) => {
//     settableData((prev) => ({ ...prev, [field]: !prev[field] }));
//   };
  
//   const customerNameRef = useRef(null);
//   const grNoRef = useRef(null);
//   const termsRef = useRef(null);
//   const vehicleNoRef = useRef(null);
//   const tableRef = useRef(null);

//   const handleEnterKeyPress = (currentRef, nextRef) => (event) => {
//     if (event.key === "Enter" || event.key === "Tab") {
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
//   const [T11, setT11] = useState(false);
//   const [T12, setT12] = useState(false);
//   const [T21, setT21] = useState(false);
//   const [pkgsValue, setpkgsValue] = useState(0);
//   const [weightValue, setweightValue] = useState(0);
//   const [rateValue, setrateValue] = useState(0);
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
//   const [Defaultbutton, setDefaultbutton] = useState("");
//   const [alertbackdate, setalertbackdate] = useState("");
//   const [BillType, setBillType] = useState("");
//   const [SupplyType, setSupplyType] = useState("");

//   const fetchSalesSetup = async () => {
//     try {
//       const response = await fetch(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/salesetup`
//       );
//       if (!response.ok) throw new Error("Failed to fetch sales setup");

//       const data = await response.json();

//       if (Array.isArray(data) && data.length > 0 && data[0].formData) {
//         const formDataFromAPI = data[0].formData;
//         setsetupFormData(formDataFromAPI);
//         const T21Value = formDataFromAPI.T21;
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
//         setDefaultbutton(formDataFromAPI.T14);
//         setalertbackdate(formDataFromAPI.alertbackdate);
//         setBillType(formDataFromAPI.btype);
//         setSupplyType(formDataFromAPI.conv);
//         // Update T21 and T12 states
//         setT21(T21Value === "Yes");
//         setT12(T12Value === "Yes");
//         setT11(T11Value === "Yes");
//         // console.log("",T11);
//       } else {
//         throw new Error("Invalid response structure");
//       }
//     } catch (error) {
//       console.error("Error fetching sales setup:", error.message);
//     }
//   };
//   useEffect(() => {
//     fetchSalesSetup();
//   }, [T11,T21,T12,ExpRate1,ExpRate2,ExpRate3,ExpRate4,ExpRate5,ExpRate6,ExpRate7,ExpRate8,ExpRate9,ExpRate10,Defaultbutton,BillType,SupplyType
//   ]);

//   useEffect(() => {
//     setItems((prev) =>
//       normalizeItems(prev, {
//         ExpRate1,
//         ExpRate2,
//         ExpRate3,
//         ExpRate4,
//         ExpRate5,
//       })
//     );
//   }, [ExpRate1, ExpRate2, ExpRate3, ExpRate4, ExpRate5]);


//   // Calculate Total GST
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
//     let taxable = parseFloat(formDataOverride.sub_total);
//     // ✅ Skip TCS Calculation if skipTCS is true
//     let tcs206 = skipTCS ? parseFloat(formDataOverride.tcs206) : 0;
//     let tcs206Rate = skipTCS ? parseFloat(formDataOverride.tcs206_rate) : 0;
//     let tcs1 = skipTCS ? parseFloat(formDataOverride.tcs1) : 0;
//     let tcs1Rate = skipTCS ? parseFloat(formDataOverride.tcs1_rate) : 0;
//     let srvRate = skipTCS ? parseFloat(formDataOverride.srv_rate) : 0;
//     let srv_tax = skipTCS ? parseFloat(formDataOverride.srv_tax) : 0;

//     if (!skipTCS && unitType === "Trading") {
//       tcs1 = (grandTotal * 1) / 100; // 1% TCS
//       tcs1Rate = 1;
//       grandTotal += tcs1;
//     } else if (skipTCS) {
//       grandTotal += parseFloat(tcs1); // Add existing TCS to grand total
//     }

//     // const isTcs206c1HYes = customerDetails?.some((cust) => cust.Tcs206c1H?.toLowerCase() === "yes"
//     //   ) || false;
//     // if (!skipTCS && isTcs206c1HYes) {
//     //   tcs1 = (grandTotal * 0.1) / 100; // 0.1%
//     //   tcs1Rate = 0.1;
//     //   grandTotal += tcs1;
//     // } else if (skipTCS) {
//     //   grandTotal += parseFloat(tcs1); // Add existing TCS to grand total
//     // }

//     // const isTDS149QYes =customerDetails?.some((cust) => cust.TDS194Q?.toLowerCase() === "yes");
//     if (!skipTCS && applicable194Q === "Above 10 Crore") {
//       srv_tax = (taxable * 0.1) / 100;
//       srvRate = 0.1;
//       // grandTotal += srv_tax;
//     }

//     let cTds = 0,
//       sTds = 0,
//       iTds = 0,
//       tcspercentage = "0";
//     items.forEach((item) => {
//       if (
//         item.tariff &&
//         applicableTariffs.some((tariff) => item.tariff.startsWith(tariff))
//       ) {
//         if (CompanyState == customerDetails[0].state) {
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

//     if (T21) {
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
//   }, [items, T21, T12]);

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
//   const [shouldFocusPrint, setShouldFocusPrint] = useState(false); // 👈 New flag to track
//   const [shouldFocusAdd, setShouldFocusAdd] = useState(false); // 👈 New flag to track
//   const { isEditMode, setIsEditMode } = useEditMode(); // Access the context
//   const [isAbcmode, setIsAbcmode] = useState(false);
//   const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
//   const [firstTimeCheckData, setFirstTimeCheckData] = useState("");
//   const [setupFormData, setsetupFormData] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape" && !isEditMode && saleId) {
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

// // state
// const [isFAModalOpen, setIsFAModalOpen] = useState(false);

// // when user clicks “FA VOUCHER VIEW” inside BillPrintMenu
// const handleViewFAVoucher = () => {
//   // we need a voucher number for FA — you’re using formData.vno for FA entries
//   if (!formData?.vno) {
//     toast.info("No voucher number found.", { position: "top-center" });
//     return;
//   }
//   setIsFAModalOpen(true);
// };


//   useEffect(() => {
//     const hasVcode = (isEditMode && items.some(item => String(item.vcode).trim() !== ""));
//     setIsSubmitEnabled(hasVcode);
//   }, [items]);

//   // const formatDateToDDMMYYYY = (dateStr) => {
//   //   if (!dateStr) return "";

//   //   const date = new Date(dateStr);
//   //   if (isNaN(date.getTime())) return "";

//   //   const dd = String(date.getDate()).padStart(2, "0");
//   //   const mm = String(date.getMonth() + 1).padStart(2, "0");
//   //   const yyyy = date.getFullYear();

//   //   return `${dd}-${mm}-${yyyy}`;
//   // };

//   const formatDateToDDMMYYYY = (dateStr) => {
//     if (!dateStr) return "";

//     // ✅ Already dd-mm-yyyy
//     const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/;
//     const match = dateStr.match(ddmmyyyy);
//     if (match) {
//       const [, dd, mm, yyyy] = match;
//       const test = new Date(`${yyyy}-${mm}-${dd}`);
//       if (
//         test.getDate() === Number(dd) &&
//         test.getMonth() + 1 === Number(mm) &&
//         test.getFullYear() === Number(yyyy)
//       ) {
//         return dateStr;
//       }
//     }

//     let date;

//     // ✅ ISO with time (Z or offset)
//     if (/^\d{4}-\d{2}-\d{2}T/.test(dateStr)) {
//       const [y, m, d] = dateStr.substring(0, 10).split("-");
//       date = new Date(y, m - 1, d); // avoid timezone issues
//     }
//     // ✅ ISO date only (yyyy-mm-dd)
//     else if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
//       const [y, m, d] = dateStr.split("-");
//       date = new Date(y, m - 1, d);
//     }
//     // ✅ dd/mm/yyyy
//     else if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
//       const [d, m, y] = dateStr.split("/");
//       date = new Date(y, m - 1, d);
//     }
//     // ✅ yyyy/mm/dd
//     else if (/^\d{4}\/\d{2}\/\d{2}$/.test(dateStr)) {
//       const [y, m, d] = dateStr.split("/");
//       date = new Date(y, m - 1, d);
//     }
//     // 🔁 fallback (Date.parse)
//     else {
//       date = new Date(dateStr);
//     }

//     if (!date || isNaN(date.getTime())) return "";

//     const dd = String(date.getDate()).padStart(2, "0");
//     const mm = String(date.getMonth() + 1).padStart(2, "0");
//     const yyyy = date.getFullYear();

//     return `${dd}-${mm}-${yyyy}`;
//   };

//   const fetchData = async () => {
//     try {
//       let response;
//       if (saleId) {
//         response = await axios.get(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/salegstget/${saleId}`
//         );
//       } else {
//         response = await axios.get(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/salegst/last`
//         );
//       }
//       if (response.status === 200 && response.data && response.data.data) {
//         const lastEntry = response.data.data;

//          const updatedFormData = {
//           ...lastEntry.formData,
//           date: formatDateToDDMMYYYY(lastEntry.formData.date),
//           duedate: formatDateToDDMMYYYY(lastEntry.formData.duedate),
//         };

//         setFirstTimeCheckData("DataAvailable");
//         setFormData(updatedFormData);

//         // setItems([...lastEntry.items]);
//         setItems(normalizeItems(lastEntry.items));
//         setcustomerDetails([...lastEntry.customerDetails]);
//         setshipped([...lastEntry.shipped]);

//         if (lastEntry.customerDetails.length > 0) {
//           setCustgst(lastEntry.customerDetails[0].gstno);
//         }

//         setData1({ ...lastEntry, formData: updatedFormData });
//         setIndex(lastEntry.formData?.vbillno || 0);

//         return lastEntry; // ✅ Return this for use in handleAdd
//       } else {
//         setFirstTimeCheckData("DataNotAvailable");
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
//       vtype: "S",
//       vbillno: 0,
//       vno: 0,
//       gr: "",
//       exfor: "",
//       trpt: "",
//       stype: "",
//       btype: "",
//       conv: "",
//       rem1: "",
//       rem2: "",
//       v_tpt: "",
//       broker: "",
//       gross: false,
//       srv_rate: 0,
//       srv_tax: 0,
//       tcs1_rate: 0,
//       tcs1: 0,
//       tcs206_rate: 0,
//       tcs206: 0,
//       duedate: "",
//       pcess: 0,
//       tax: 0,
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
//         pkgs: "0.00",
//         weight: "0.00",
//         rate: "0.00",
//         amount: "0.00",
//         disc: 0,
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
//         ctax: "0.00",
//         stax: "0.00",
//         itax: "0.00",
//         tariff: "",
//         vamt: "0.00",
//       },
//     ];
//     const emptyshipped = [
//       {
//         shippedto: "",
//         shippingAdd: "",
//         shippingcity: "",
//         shippingState: "",
//         shippingGst: "",
//         shippingPan: "",
//       },
//     ];
//     const emptycustomer = [
//       {
//         Vcode: "",
//         vacode: "",
//         gstno: "",
//         pan: "",
//         city: "",
//         state: "",
//         Tcs206c1H: "",
//         TDS194Q: "",
//       },
//     ];
//     // Set the empty data
//     setFormData(emptyFormData);
//     setItems(normalizeItems([]));
//     setcustomerDetails(emptycustomer);
//     setshipped(emptyshipped);
//     setData1({
//       formData: emptyFormData,
//       items: emptyItems,
//       shipped: emptyshipped,
//       customerDetails: emptycustomer,
//     }); // Store empty data
//     setIndex(0);
//   };

//   useEffect(() => {
//     fetchData();
//     setIsDisabled(true);
//     // Add this line to set isDisabled to true initially
//   }, []);
  
//   // Modal & Search states
//   const [showSearch, setShowSearch] = useState(false);
//   const [allBills, setAllBills] = useState([]);
//   const [filteredBills, setFilteredBills] = useState([]);
//   const [searchBillNo, setSearchBillNo] = useState("");
//   const [searchDate, setSearchDate] = useState(""); // DD-MM-YYYY
//   const billNoRef = useRef(null);
//   const dateRef = useRef(null);
//   const proceedRef = useRef(null);
//   useEffect(() => {
//     if (showSearch) {
//       setTimeout(() => billNoRef.current?.focus(), 100);
//     }
//   }, [showSearch]);

//   const handleEnterKeyPressM = (currentRef, nextRef) => (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       nextRef.current?.focus();
//     }
//   };

//   // 🔹 Fetch all bills
//   const fetchAllBills = async () => {
//     try {
//       const res = await axios.get(
//         "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/sale"
//       );
//       if (Array.isArray(res.data)) {
//         setAllBills(res.data);
//         setFilteredBills([]); // empty until Proceed
//       }
//     } catch (error) {
//       console.error("Error fetching bills", error);
//     }
//   };

//   // 🔹 Proceed button logic
//   const handleProceed = () => {
//     // ✅ Require at least one filter
//     if (searchBillNo.trim() === "" && searchDate.trim() === "") {
//       alert("Please enter Bill No or Date to proceed.");
//       return; // stop execution
//     }

//     let filtered = allBills;

//     // Filter by Bill No
//     if (searchBillNo.trim() !== "") {
//       filtered = filtered.filter((bill) =>
//         bill.formData.vbillno.toString().includes(searchBillNo.trim())
//       );
//     }

//     // Filter by Date (DD-MM-YYYY)
//     if (/^\d{2}-\d{2}-\d{4}$/.test(searchDate)) {
//       filtered = filtered.filter((bill) => {
//         const billDate = formatDateToDDMMYYYY(bill.formData.date);
//         return billDate === searchDate;
//       });
//     }

//     setFilteredBills(filtered);
//   };

//   // 🔹 Select bill
//   const handleSelectBill = (bill) => {
//     setFormData({
//       ...bill.formData,
//       date: formatDateToDDMMYYYY(bill.formData.date),
//     });
//     setcustomerDetails(bill.customerDetails);
//     setItems(normalizeItems(bill.items));
//     setshipped(bill.shipped);
//     setShowSearch(false);
//     setFilteredBills([]);
//     setSearchBillNo("");
//     setSearchDate("");
//   };

//   const handleNext = async () => {
//     document.body.style.backgroundColor = "white";
//     setTitle("(View)");
//     try {
//       if (data1) {
//         const response = await axios.get(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/salegst/${data1._id}/next`
//         );
//         if (response.status === 200 && response.data) {
//           const nextData = response.data.data;
//           setData1(nextData);
//           setIndex(index + 1);
//           setFormData({
//             ...nextData.formData,
//             date: formatDateToDDMMYYYY(nextData.formData.date),
//             duedate: formatDateToDDMMYYYY(nextData.formData.duedate),
//           });
//           // Update items and supplier details
//           const updatedItems = nextData.items.map((item) => ({
//             ...item,
//           }));
//           const updatedCustomer = nextData.customerDetails.map((item) => ({
//             ...item,
//           }));
//           const updatedshipped = nextData.shipped.map((item) => ({
//             ...item,
//           }));
//           setItems(normalizeItems(updatedItems));
//           // setItems(updatedItems);
//           setcustomerDetails(updatedCustomer);
//           setshipped(updatedshipped);

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
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/salegst/${data1._id}/previous`
//         );
//         if (response.status === 200 && response.data) {
//           const prevData = response.data.data;
//           setData1(prevData);
//           setIndex(index - 1);
//           setFormData({
//             ...prevData.formData,
//             date: formatDateToDDMMYYYY(prevData.formData.date),
//             duedate: formatDateToDDMMYYYY(prevData.formData.duedate),
//           });
//           // Update items and supplier details
//           const updatedItems = prevData.items.map((item) => ({
//             ...item,
//           }));
//           const updatedCustomer = prevData.customerDetails.map((item) => ({
//             ...item,
//           }));
//           const updatedshipped = prevData.shipped.map((item) => ({
//             ...item,
//           }));
//           // setItems(updatedItems);
//           setItems(normalizeItems(updatedItems));
//           setcustomerDetails(updatedCustomer);
//           setshipped(updatedshipped);

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
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/salegst/first`
//       );
//       if (response.status === 200 && response.data) {
//         const firstData = response.data.data;
//         setData1(firstData);
//         setIndex(0);
//         setFormData({
//           ...firstData.formData,
//           date: formatDateToDDMMYYYY(firstData.formData.date),
//           duedate: formatDateToDDMMYYYY(firstData.formData.duedate),
//         });
//         // Update items and supplier details
//         const updatedItems = firstData.items.map((item) => ({
//           ...item,
//         }));
//         const updatedCustomer = firstData.customerDetails.map((item) => ({
//           ...item,
//         }));
//         const updatedshipped = firstData.shipped.map((item) => ({
//           ...item,
//         }));
//         // setItems(updatedItems);
//         setItems(normalizeItems(updatedItems));
//         setcustomerDetails(updatedCustomer);
//         setshipped(updatedshipped);

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
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/salegst/last`
//       );
//       if (response.status === 200 && response.data) {
//         const lastData = response.data.data;
//         setData1(lastData);
//         const lastIndex = response.data.length - 1;
//         setIndex(lastIndex);
//         setFormData({
//           ...lastData.formData,
//           date: formatDateToDDMMYYYY(lastData.formData.date),
//           duedate: formatDateToDDMMYYYY(lastData.formData.duedate),
//         });

//         // Update items and supplier details
//         const updatedItems = lastData.items.map((item) => ({
//           ...item,
//         }));
//         const updatedCustomer = lastData.customerDetails.map((item) => ({
//           ...item,
//         }));
//         const updatedshipped = lastData.shipped.map((item) => ({
//           ...item,
//         }));
//         // setItems(updatedItems);
//         setItems(normalizeItems(updatedItems));
//         setcustomerDetails(updatedCustomer);
//         setshipped(updatedshipped);
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

//   const getTodayDDMMYYYY = () => {
//     const today = new Date();
//     const dd = String(today.getDate()).padStart(2, "0");
//     const mm = String(today.getMonth() + 1).padStart(2, "0");
//     const yyyy = today.getFullYear();
//     return `${dd}-${mm}-${yyyy}`;
//   };
//   const handleAdd = async () => {
//     if (datePickerRef.current) {
//       datePickerRef.current.focus();
//     }
//     try {
//       const lastEntry = await fetchData();
//       await fetchSalesSetup();
//       const lastvoucherno = lastEntry?.formData?.vbillno ? parseInt(lastEntry.formData.vbillno) + 1 : 1;
//       const lastvno = lastEntry?.formData?.vno ? parseInt(lastEntry.formData.vno) + 1 : 1;

//       const newData = {
//         ...lastEntry?.formData,
//         date: getTodayDDMMYYYY(), // ✅ TODAY'S DATE
//         vbillno: lastvoucherno,
//         vno: lastvno,
//         vtype: "S",
//         gr: "",
//         exfor: "",
//         trpt: "",
//         stype: "",
//         btype: BillType,
//         conv: SupplyType,
//         rem1: "",
//         rem2: "",
//         v_tpt: "",
//         broker: "",
//         gross: false,
//         tcsper: 0,
//         srv_rate: 0,
//         srv_tax: 0,
//         tcs1_rate: 0,
//         tcs1: 0,
//         tcs206_rate: 0,
//         tcs206: 0,
//         duedate: getTodayDDMMYYYY(),
//         pcess: 0,
//         tax: 0,
//         sub_total: 0,
//         exp_before: 0,
//         Exp_rate6: 0,
//         Exp_rate7: 0,
//         Exp_rate8: 0,
//         Exp_rate9: 0,
//         Exp_rate10: 0,
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
//         ExpRoundoff: 0,
//         grandtotal: 0,
//       };
//       setData([...data, newData]);
//       setFormData(newData);
//       // setItems(normalizeItems([]));
//       setItems(
//         normalizeItems([], {
//           ExpRate1,
//           ExpRate2,
//           ExpRate3,
//           ExpRate4,
//           ExpRate5,
//         })
//       );

//       // setItems([
//       //   {
//       //     id: 1,
//       //     vcode: "",
//       //     sdisc: "",
//       //     Units: "",
//       //     pkgs: "0",
//       //     weight: "0",
//       //     rate: "0",
//       //     amount: "0",
//       //     disc: 0,
//       //     discount: "",
//       //     gst: 0,
//       //     Pcodes01: "",
//       //     Pcodess: "",
//       //     Scodes01: "",
//       //     Scodess: "",
//       //     Exp_rate1: ExpRate1 || 0,
//       //     Exp_rate2: ExpRate2 || 0,
//       //     Exp_rate3: ExpRate3 || 0,
//       //     Exp_rate4: ExpRate4 || 0,
//       //     Exp_rate5: ExpRate5 || 0,
//       //     Exp1: 0,
//       //     Exp2: 0,
//       //     Exp3: 0,
//       //     Exp4: 0,
//       //     Exp5: 0,
//       //     exp_before: 0,
//       //     ctax: "0.00",
//       //     stax: "0.00",
//       //     itax: "0.00",
//       //     tariff: "",
//       //     vamt: "0.00",
//       //   },
//       // ]);
//       setcustomerDetails([
//         {
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
//       setshipped([
//         {
//           shippedto: "",
//           shippingAdd: "",
//           shippingcity: "",
//           shippingState: "",
//           shippingGst: "",
//           shippingPan: "",
//         },
//       ]);

//       setIndex(data.length);
//       setIsAddEnabled(false);
//       setIsPreviousEnabled(false);
//       setIsNextEnabled(false);
//       setIsFirstEnabled(false);
//       setIsLastEnabled(false);
//       setIsSearchEnabled(false);
//       setIsSPrintEnabled(false);
//       setIsDeleteEnabled(false);
//       setIsDisabled(false);
//       setIsEditMode(true);
//       setIsAbcmode(false);
//       setTitle("NEW");
//     } catch (error) {
//       console.error("Error adding new entry:", error);
//     }
//   };
//   const handleExit = async () => {
//     // Check if grandtotal is Greater Than zero
//     if (formData.grandtotal > 0 && isEditMode) {
//       const confirmExit = window.confirm("Are you sure you want to Exit? Unsaved changes may be lost.");
//       if (!confirmExit) {
//         return;
//       }
//     }

//     setTitle("(View)");
//     try {
//       const response = await axios.get(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/salegst/last`
//       );

//       if (response.status === 200 && response.data.data) {
//         const lastEntry = response.data.data;
//         setFormData({
//           ...lastEntry.formData,
//           date: formatDateToDDMMYYYY(lastEntry.formData.date),
//           duedate: formatDateToDDMMYYYY(lastEntry.formData.duedate),
//         });
//         setData1(response.data.data);
//         // setItems(lastEntry.items.map((item) => ({ ...item })));
//         setItems(normalizeItems(lastEntry.items));
//         setcustomerDetails(lastEntry.customerDetails.map((item) => ({ ...item })));
//         setshipped(lastEntry.shipped.map((item) => ({ ...item })));

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
//           vtype: "S",
//           vbillno: 0,
//           vno: 0,
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
//         };
//         setFormData(newData);
//         setItems(normalizeItems([]));
//         setcustomerDetails([
//           {
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

//   const handleEditClick = () => {
//     setTitle("(Edit)");
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
  
//   const handleSaveClickwithSetup = async () => {
//     document.body.style.backgroundColor = "white";
//     let isDataSaved = false;

//     try {
//       // 1) Validate
//       const isValid = customerDetails.every((item) => item.vacode !== "");
//       if (!isValid) {
//         toast.error("Please Fill the Customer Details", { position: "top-center" });
//         return;
//       }

//       const nonEmptyItems = items.filter((item) => (item.sdisc || "").trim() !== "");
//       if (nonEmptyItems.length === 0) {
//         toast.error("Please fill in at least one Items name.", { position: "top-center" });
//         return;
//       }

//       // 2) Build base form with setup codes (common to both add/edit)
//       const baseForm = {
//         date: formData.date,
//         vtype: formData.vtype,
//         vbillno: formData.vbillno,
//         vno: formData.vno,
//         gr: formData.gr,
//         exfor: formData.exfor,
//         trpt: formData.trpt,
//         stype: formData.stype,
//         btype: formData.btype,
//         conv: formData.conv,
//         rem1: formData.rem1,
//         rem2: formData.rem2,
//         v_tpt: formData.v_tpt,
//         broker: formData.broker,
//         srv_rate: formData.srv_rate,
//         srv_tax: formData.srv_tax,
//         tcs1_rate: formData.tcs1_rate,
//         tcs1: formData.tcs1,
//         tcs206_rate: formData.tcs206_rate,
//         tcs206: formData.tcs206,
//         duedate: formData.duedate,
//         pcess: formData.pcess,
//         tax: formData.tax,
//         sub_total: formData.sub_total,
//         exp_before: formData.exp_before,
//         Exp_rate6: formData.Exp_rate6,
//         Exp_rate7: formData.Exp_rate7,
//         Exp_rate8: formData.Exp_rate8,
//         Exp_rate9: formData.Exp_rate9,
//         Exp_rate10: formData.Exp_rate10,
//         Exp6: formData.Exp6,
//         Exp7: formData.Exp7,
//         Exp8: formData.Exp8,
//         Exp9: formData.Exp9,
//         Exp10: formData.Exp10,
//         Tds2: formData.Tds2,
//         Ctds: formData.Ctds,
//         Stds: formData.Stds,
//         iTds: formData.iTds,
//         cgst: formData.cgst,
//         sgst: formData.sgst,
//         igst: formData.igst,
//         expafterGST: formData.expafterGST,
//         grandtotal: formData.grandtotal,

//         // setupFormData mapping
//         cgst_ac: setupFormData.cgst_ac,
//         cgst_code: setupFormData.cgst_code,
//         sgst_ac: setupFormData.sgst_ac,
//         sgst_code: setupFormData.sgst_code,
//         igst_ac: setupFormData.igst_ac,
//         igst_code: setupFormData.igst_code,

//         cesscode: setupFormData.cesscode,
//         cessAc: setupFormData.cessAc,

//         tds_code: setupFormData.tds_code,
//         tds_ac: setupFormData.tds_ac,

//         tcs_code: setupFormData.tcs_code,
//         tcs_ac: setupFormData.tcs_ac,
//         tcs206_code: setupFormData.tcs206_code,
//         tcs206_ac: setupFormData.tcs206_ac,

//         discount_code: setupFormData.discount_code,
//         discount_ac: setupFormData.discount_ac, // NOTE: account name

//         // TDS ACCOUNTS
//         cTds_code: setupFormData.cTds_code,
//         cTds_ac: setupFormData.cTds_ac,
//         sTds_code: setupFormData.sTds_code,
//         sTds_ac: setupFormData.sTds_ac,
//         iTds_code: setupFormData.iTds_code,
//         iTds_ac: setupFormData.iTds_ac,

//         expense1_code: setupFormData.E1Code,  expense1_ac: setupFormData.E1name,
//         expense2_code: setupFormData.E2Code,  expense2_ac: setupFormData.E2name,
//         expense3_code: setupFormData.E3Code,  expense3_ac: setupFormData.E3name,
//         expense4_code: setupFormData.E4Code,  expense4_ac: setupFormData.E4name,
//         expense5_code: setupFormData.E5Code,  expense5_ac: setupFormData.E5name,
//         expense6_code: setupFormData.E6Code,  expense6_ac: setupFormData.E6name,
//         expense7_code: setupFormData.E7Code,  expense7_ac: setupFormData.E7name,
//         expense8_code: setupFormData.E8Code,  expense8_ac: setupFormData.E8name,
//         expense9_code: setupFormData.E9Code,  expense9_ac: setupFormData.E9name,
//         expense10_code: setupFormData.E10Code, expense10_ac: setupFormData.E10name,
//       };

//       const itemsPayload = nonEmptyItems.map((item) => ({
//         id: item.id,
//         vcode: item.vcode,
//         sdisc: item.sdisc,
//         Units: item.Units,
//         pkgs: item.pkgs,
//         weight: item.weight,
//         rate: item.rate,
//         amount: item.amount,
//         disc: item.disc,
//         discount: item.discount,
//         gst: item.gst,
//         Pcodes01: item.Pcodes01,
//         Pcodess: item.Pcodess,
//         Scodes01: item.Scodes01,
//         Scodess: item.Scodess,
//         exp_before: item.exp_before,
//         Exp_rate1: item.Exp_rate1,
//         Exp_rate2: item.Exp_rate2,
//         Exp_rate3: item.Exp_rate3,
//         Exp_rate4: item.Exp_rate4,
//         Exp_rate5: item.Exp_rate5,
//         Exp1: item.Exp1,
//         Exp2: item.Exp2,
//         Exp3: item.Exp3,
//         Exp4: item.Exp4,
//         Exp5: item.Exp5,
//         Exp6: item.Exp6,
//         ctax: item.ctax,
//         stax: item.stax,
//         itax: item.itax,
//         tariff: item.tariff,
//         vamt: item.vamt,
//       }));

//       const combinedData = {
//         _id: formData._id,
//         formData: baseForm,
//         items: itemsPayload,
//         customerDetails: customerDetails.map((item) => ({
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
//         shipped: shipped.map((item) => ({
//           shippedto: item.shippedto,
//           shippingAdd: item.shippingAdd,
//           shippingcity: item.shippingcity,
//           shippingState: item.shippingState,
//           shippingGst: item.shippingGst,
//           shippingPan: item.shippingPan,
//         })),
//       };

//       // 3) Save Sale GST (add/edit)
//       const saleGstUrl = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/salegst${isAbcmode ? `/${data1._id}` : ""}`; // NOTE: replace 'aa' with ${tenant} if you have it
//       const saleGstMethod = isAbcmode ? "put" : "post";
//       const saleRes = await axios({ method: saleGstMethod, url: saleGstUrl, data: combinedData });

//       // Try to extract saleId from response; fallbacks included for PUT/legacy responses
//       const saleId =
//         saleRes?.data?.saleId ||
//         saleRes?.data?._id ||
//         (isAbcmode ? data1?._id : null);

//       if (!saleId) {
//         console.warn("saleId not found in /salegst response. Ensure backend returns { ok: true, saleId }.");
//       }

//       if (saleRes?.status === 200 || saleRes?.status === 201) {
//         // 4) Update Stock (SALE => subtract)
//         try {
//           await axios.post(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/stock/update`, {
//             mode: "sale",
//             items: nonEmptyItems.map((item) => ({
//               vcode: item.vcode,
//               sdisc: item.sdisc,
//               weight: Number(item.weight) || 0,
//               pkgs: Number(item.pkgs) || 0,
//             })),
//           });
//         } catch (stkErr) {
//           console.error("Stock update error:", stkErr);
//           // Continue even if stock update fails
//         }

//         // 5) Post FA entries (with setup codes) — include saleId
//         try {
//           const faUrl = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/salefaFile${isAbcmode ? `/${data1._id}` : ""}`;
//           const faBody = saleId ? { ...combinedData, saleId } : combinedData;

//           await axios({
//             method: isAbcmode ? "put" : "post",
//             url: faUrl,
//             data: faBody,
//           });
//         } catch (faErr) {
//           console.error("salefaFile error:", faErr);
//           toast.warn(
//             "Sale saved & stock updated, but FA posting failed. Try 'Post to FA' later.",
//             { position: "top-center" }
//           );
//         }

//         fetchData();
//         isDataSaved = true;
//       }
//     } catch (error) {
//       console.error("Error saving data:", error);
//       toast.error("Failed to save data. Please try again.", { position: "top-center" });
//     } finally {
//       setIsSubmitEnabled(false);
//       if (isDataSaved) {
//         setTitle("(View)");
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
//         setIsAddEnabled(true);
//         setIsDisabled(false);
//       }
//     }
//   };

//   const handleDataSave = async () => {
//     handleSaveClickwithSetup();
//   };
  
//   // 👇 This runs AFTER isPrintEnabled changes
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

//   const handleDeleteClick = async (id) => {
//     if (!id) {
//       toast.error("Invalid ID. Please select an item to delete.", {
//         position: "top-center",
//       });
//       return;
//     }

//     const userConfirmed = window.confirm(
//       "Are you sure you want to delete this from records?"
//     );
//     if (!userConfirmed) return;

//     try {
//       // Only one API – backend will delete SaleGst + FAFile (via saleId)
//       const salegstEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/${data1._id}`;

//       const response = await axios.delete(salegstEndpoint);

//       if (response.status === 200) {
//         toast.success("Data deleted successfully from records.", {
//           position: "top-center",
//         });
//         fetchData(); // refresh grid
//       } else {
//         toast.error("Deletion failed.", {
//           position: "top-center",
//         });
//       }
//     } catch (error) {
//       console.error("Error deleting data:", error);
//       toast.error(`Failed to delete data. Error: ${error.message}`, {
//         position: "top-center",
//       });
//     }
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


//   React.useEffect(() => {
//     // Fetch products from the API when the component mounts
//     fetchProducts();
//   }, []);

//   const fetchProducts = async (search = "") => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/stockmaster?search=${encodeURIComponent(search)}`
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

//   const capitalizeWords = (str) => {
//     return str.replace(/\b\w/g, (char) => char.toUpperCase());
//   };

//   // Modal For Items
//   const [products, setProducts] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [selectedItemIndex, setSelectedItemIndex] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

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
//     } else if (RateCal === "Wt/Qty") {
//       TotalAcc = totalAccordingWeight;
//       // console.log("totalAccordingWeight");
//     } else if (RateCal === "Pc/Pkgs") {
//       TotalAcc = totalAccordingPkgs;
//       // console.log("totalAccordingPkgs");
//     }
//     let others = parseFloat(updatedItems[index].exp_before) || 0;
//     let disc = parseFloat(updatedItems[index].disc) || 0;
//     let manualDiscount = parseFloat(updatedItems[index].discount) || 0;
//     let per;
//     if (key === "discount") {
//       per = manualDiscount;
//     } else {
//       per = ((disc / 100) * TotalAcc);
//       updatedItems[index]["discount"] = T21 ? Math.round(per).toFixed(2) : per.toFixed(2);
//     }

//     // ✅ Convert to float for reliable calculation
//     per = parseFloat(per);
//     let Amounts = TotalAcc + per + others;

//     // Ensure TotalAcc is a valid number before calling toFixed()
//     TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;
//     // Check if GST number starts with "0" to "3"
//     let cgst, sgst, igst;
//     if (CompanyState == customerDetails[0].state) {
//       cgst = (Amounts * (gst / 2)) / 100 || 0;
//       sgst = (Amounts * (gst / 2)) / 100 || 0;
//       igst = 0;
//     } else {
//       cgst = sgst = 0;
//       igst = (Amounts * gst) / 100 || 0;
//     }

//     // Calculate the total with GST and Others
//     let totalWithGST = Amounts + cgst + sgst + igst;
//     // Update CGST, SGST, Others, and total fields in the item
//     if (T21) {
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

//   // Function to handle adding a new item
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
//         disc: 0,
//         discount: "",
//         gst: 0,
//         Pcodes01: "",
//         Pcodess: "",
//         Scodes01: "",
//         Scodess: "",
//         Exp_rate1: ExpRate1 || 0,
//         Exp_rate2: ExpRate2 || 0,
//         Exp_rate3: ExpRate3 || 0,
//         Exp_rate4: ExpRate4 || 0,
//         Exp_rate5: ExpRate5 || 0,
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

//   const handleProductSelect = (product) => {
//     setIsEditMode(true);
//       if (selectedItemIndex !== null) {
//         handleItemChange(selectedItemIndex, "name", product.Aheads);
//         setShowModal(false);
//       }
//   };

//   const handleModalDone = (product) => {
//     if (product) {
//       // console.log(product);
//       handleProductSelect(product);
//     }
//     setShowModal(false);
//     fetchProducts();
//     setIsEditMode(true);
//   };

//   const openModalForItem = (index) => {
//     if (isEditMode) {
//       setSelectedItemIndex(index);
//       setShowModal(true);
//     }
//   };

// const allFields = products.length ? Object.keys(products[0])
// : ["Aheads", "Pcodes01", "UOM", "GST"]; // fallback/default fields

//   // Modal For Customer
//   React.useEffect(() => {
//     // Fetch products from the API when the component mounts
//     fetchCustomers();
//   }, []);

//   const fetchCustomers = async () => {
//     try {
//        const response = await fetch(
//         `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount`
//       );
//       if (!response.ok) {
//         throw new Error("Failed to fetch products");
//       }
//       const data = await response.json();
//       // Ensure to extract the formData for easier access in the rest of your app
//       const formattedData = data.map((item) => ({
//         ...item.formData,
//         _id: item._id,
//       }));
//       setProductsCus(formattedData);
//       setLoadingCus(false);
//       setProductsAcc(formattedData);
//       setLoadingAcc(false);
//     } catch (error) {
//       setErrorCus(error.message);
//       setLoadingCus(false);
//       setErrorAcc(error.message);
//       setLoadingAcc(false);
//     }
//   };
  
//   // Modal For CustomerDetails
//   const [productsCus, setProductsCus] = useState([]);
//   const [showModalCus, setShowModalCus] = useState(false);
//   const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
//   const [loadingCus, setLoadingCus] = useState(true);
//   const [errorCus, setErrorCus] = useState(null);

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
//     const updatedItems = [...customerDetails];
//     updatedItems[index][key] = value;

// if (key === "name") {
//   const selectedProduct = productsCus.find(
//     (product) => product.ahead === value
//   );
//   if (selectedProduct) {
//     updatedItems[index] = {
//       ...updatedItems[index],
//       Vcode: selectedProduct.acode,
//       vacode: selectedProduct.ahead,
//       gstno: selectedProduct.gstNo,
//       pan: selectedProduct.pan,
//       Add1: selectedProduct.add1,
//       city: selectedProduct.city,
//       state: selectedProduct.state,
//       Tcs206c1H: selectedProduct.tcs206,
//       TDS194Q: selectedProduct.tds194q,
//     };
//     setCustgst(selectedProduct.gstNo);

//     const stype = determineSaleType(
//       selectedProduct.state,
//       selectedProduct.gstNo,
//       CompanyState
//     );
//     setFormData((prevState) => ({
//       ...prevState,
//       stype,
//     }));
//   }
// }

//     if (key === "state" || key === "gstno") {
//       const { state, gstno } = updatedItems[index];
//       const stype = determineSaleType(state, gstno, CompanyState);
//       setFormData((prevState) => ({
//         ...prevState,
//         stype,
//       }));
//     }

//     setcustomerDetails(updatedItems);
//   };

//   const handleProductSelectCus = (product) => {
//     if (!product) {
//       alert("No product received!");
//       setShowModalCus(false);
//       return;
//     }
  
//     // clone the array
//     const newCustomers = [...customerDetails];
  
//     // overwrite the one at the selected index
//     newCustomers[selectedItemIndexCus] = {
//       ...newCustomers[selectedItemIndexCus],
//       Vcode: product.acode || '',
//       vacode: product.ahead || '',
//       city:   product.city  || '',
//       gstno:  product.gstNo  || '',
//       pan:    product.pan    || '',
//       Add1: product.add1 || '',
//       state: product.state    || '',
//       Tcs206c1H: product.tcs206    || '',
//       TDS194Q: product.tds194q    || '',  
//     };

//     const stype = determineSaleType(product.state, product.gstNo || "", CompanyState);
//     setFormData((prevState) => ({
//       ...prevState,
//       stype,
//     }));

//     const nameValue = product.ahead || product.name || "";
//     if (selectedItemIndexCus !== null) {
//       setFormData((prev) => ({
//         ...prev,
//         broker: product.agent || ""   // <-- change key name based on your API
//       }));
//       if (selectedItemIndexCus === "v_tpt") {
//         setFormData((prevData) => ({
//           ...prevData,
//           v_tpt: nameValue,
//         }));
//       } else {
//         handleItemChangeCus(selectedItemIndexCus, "name", nameValue);
//       }
//     }
//     setcustomerDetails(newCustomers);
//     setIsEditMode(true);
//     setShowModalCus(false);
  
  
//     // restore focus
//     setTimeout(() => {
//       if (selectedItemIndexCus === "v_tpt") {
//         transportRef.current?.focus();
//       } else {
//         shippedtoRef.current?.focus();
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

//   const allFieldsCus = productsCus.reduce((fields, product) => {
//   Object.keys(product).forEach((key) => {
//     if (!fields.includes(key)) {
//       fields.push(key);
//     }
//   });

//   return fields;
//   }, []);

//   const handleOpenModalTpt = (event, index) => {
//     if (event.key === "ArrowDown" && isEditMode) {
//       setSelectedItemIndexCus(index);
//       setShowModalCus(true);
//       event.preventDefault();
//     }
//   };
//   // Modal For Shipping Address
//   const [productsAcc, setProductsAcc] = useState([]);
//   const [showModalAcc, setShowModalAcc] = useState(false);
//   const [selectedItemIndexAcc, setSelectedItemIndexAcc] = useState(null);
//   const [loadingAcc, setLoadingAcc] = useState(true);
//   const [errorAcc, setErrorAcc] = useState(null);

//   const handleItemChangeAcc = (index, key, value) => {
//     const updatedItems = [...shipped];
//     updatedItems[index][key] = value;
//     // If the key is 'name', find the corresponding product and set the price
//     if (key === "acName") {
//       const selectedProduct = productsAcc.find(
//         (product) => product.ahead === value
//       );
//       if (selectedProduct) {
//         updatedItems[index]["shippedto"] = selectedProduct.ahead;
//         updatedItems[index]["shippingAdd"] = selectedProduct.add1;
//         updatedItems[index]["shippingcity"] = selectedProduct.city;
//         updatedItems[index]["shippingState"] = selectedProduct.state;
//         updatedItems[index]["shippingGst"] = selectedProduct.gstNo;
//         updatedItems[index]["shippingPan"] = selectedProduct.pan;
//       }
//     }
//     setshipped(updatedItems);
//   };
//   const handleOpenModalBroker = (event, index ) => {
//     if (event.key === "ArrowDown" && isEditMode ) {
//       setSelectedItemIndexAcc(index);
//       setShowModalAcc(true);
//       event.preventDefault();
//     }
//   };

//   const handleProductSelectAcc = (product) => {
//     if (!product) {
//       alert("No account selected!");
//       setShowModalAcc(false);
//       return;
//     }
  
//     // Defensive: index of the row being edited
//     // if (typeof selectedItemIndexAcc !== "number") {
//     //   alert("No shipped row selected!");
//     //   setShowModalAcc(false);
//     //   return;
//     // }
  
//     // Deep copy shipped array
//     const updatedShipped = [...shipped];
  
//     // Update the correct object in the array
//     updatedShipped[selectedItemIndexAcc] = {
//       ...updatedShipped[selectedItemIndexAcc],
//       shippedto: product.ahead || "",
//       shippingGst: product.gstNo || "",
//       shippingAdd: product.add1 || "",
//       shippingcity: product.city || "",
//       shippingState:product.state || "",
//       shippingPan:product.pan || "",
//       // Add any other mappings needed
//     };

//     const nameValue = product.ahead || product.name || "";
//     if (selectedItemIndexAcc !== null) {
//       if (selectedItemIndexAcc === "broker") {
//         setFormData((prevData) => ({
//           ...prevData,
//           broker: nameValue,
//         }));
//       } else {
//         handleItemChangeAcc(selectedItemIndexAcc, "acName", nameValue);
//       }
//     }
//     setshipped(updatedShipped);       // <- update the array in state!
//     setIsEditMode(true);
//     setShowModalAcc(false);
  
//     // Optionally refocus
//     setTimeout(() => {
//       if (selectedItemIndexAcc === "broker") {
//         brokerRef.current?.focus(); // Focus back to transport field
//       } else {
//         grNoRef.current.focus();
//       }
//     }, 0);
//   };

//   const openModalForItemAcc = (index) => {
//     if(isEditMode){
//     setSelectedItemIndexAcc(index);
//     setShowModalAcc(true);
//     }
//   };

//   const allFieldsAcc = productsAcc.reduce((fields, product) => {
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
//     const customerState = customerDetails[0]?.state;
//     const customerGST = customerDetails[0]?.gstno?.trim();

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

//   const HandleValueChange = (event) => {
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
// };

//   const handleNumericValue = (event) => {
//     const { id, value } = event.target;
//     // Allow only numeric values, including optional decimal points
//     if (/^\d*\.?\d*$/.test(value) || value === "") {
//       setFormData((prevData) => ({
//         ...prevData,
//         [id]: value,
//       }));
//     }
//   };

//   const handleInputChange = (index, field, value) => {
//     const numericValue = typeof value === "string" ? value.replace(/[^0-9.-]/g, "") : value;
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
//     const totalAccordingWeight = parseFloat(updatedItems[index].weight) *  parseFloat(updatedItems[index].rate);
//     const totalAccordingPkgs =  parseFloat(updatedItems[index].pkgs) *  parseFloat(updatedItems[index].rate);
//     let RateCal = updatedItems[index].RateCal;
//     let TotalAcc = totalAccordingWeight; // Set a default value

//     if ( RateCal === "Default" || RateCal === "" || RateCal === null || RateCal === undefined) {
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
//     let cgst = 0,
//       sgst = 0,
//       igst = 0;
//     if (CompanyState == customerDetails[0].state) {
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
//       let PerCenTage = parseFloat(per);
//       let Amounts = TotalAcc + totalExpenses + parseFloat(per);

//       TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;

//       // GST Logic Based on State
//       let cgst = 0,
//         sgst = 0,
//         igst = 0;

//       if (CompanyState == customerDetails[0].state) {
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
//         item.discount = Math.round(PerCenTage).toFixed(2);
//         item.vamt = Math.round(totalWithGST).toFixed(2);
//       } else {
//         item.ctax = cgst.toFixed(2);
//         item.stax = sgst.toFixed(2);
//         item.itax = igst.toFixed(2);
//         item.discount = PerCenTage.toFixed(2);
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

//   const [fontSize, setFontSize] = useState(17); // Initial font size in pixels
//   const increaseFontSize = () => {
//     setFontSize((prevSize) => (prevSize < 20 ? prevSize + 2 : prevSize)); // Increase font size up to 20 pixels
//   };

//   const decreaseFontSize = () => {
//     setFontSize((prevSize) => (prevSize > 14 ? prevSize - 2 : prevSize)); // Decrease font size down to 14 pixels
//   };
//   const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
//   const fieldOrder = [
//   { name: "vcode",      refArray: itemCodeRefs },
//   { name: "sdisc",      refArray: desciptionRefs },
//   { name: "tariff",     refArray: hsnCodeRefs },
//   { name: "pkgs",       refArray: peciesRefs },
//   { name: "weight",     refArray: quantityRefs },
//   { name: "rate",       refArray: priceRefs },
//   { name: "amount",     refArray: amountRefs },
//   { name: "disc",       refArray: discountRef },
//   { name: "discount",   refArray: discount2Ref },
//   { name: "exp_before", refArray: othersRefs },
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
//     rowTop - containerHeight + rowHeight + 60;
// };
// const handleKeyDown = (event, index, field) => {
//   // --------------- ENTER / TAB: move to NEXT FIELD -----------------
//   if (event.key === "Enter" || event.key === "Tab") {
//     event.preventDefault();

//     // Special case for vcode: your existing behaviour
//     if (field === "vcode") {
//       if ((items[index].sdisc || "").trim() === "") {
//         // Go to remarks if description is empty
//         remarksRef.current?.focus();
//       } else {
//         focusRef(desciptionRefs, index);
//       }
//       return;
//     }

//     // Special case for exp_before: go to next row / add row
//     if (field === "exp_before") {
//       const isLastRow = index === items.length - 1;

//       // if (isLastRow) {
//       //   handleAddItem();
//       //   // Focus ItemCode of newly added row
//       //   focusRef(itemCodeRefs, index + 1);
//       // }
//       if (isLastRow) {
//         handleAddItem();

//         setTimeout(() => {
//           focusScrollRow(itemCodeRefs, index + 1);
//         }, 0);
//       }
//        else {
//         focusScrollRow(itemCodeRefs, index + 1);
//       }
//       return;
//     }

//     // Generic: find current field in fieldOrder and move to next available
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

//     // If nothing else found, you can optionally jump to remarks or transport:
//     // focusRef(remarksRef, 0);  // if you make remarksRef an array or handle separately

//     return;
//   }

//   // -------------------- ARROW RIGHT --------------------
//   else if (event.key === "ArrowRight") {
//     if (field === "vcode") {
//       focusRef(desciptionRefs, index);
//     } else if (field === "sdisc") {
//       focusRef(hsnCodeRefs, index);
//     } else if (field === "tariff") {
//       focusRef(peciesRefs, index);
//     } else if (field === "pkgs") {
//       focusRef(quantityRefs, index);
//     } else if (field === "weight") {
//       focusRef(priceRefs, index);
//     } else if (field === "rate") {
//       // If amount column exists, go there first, else to disc
//       if (!focusRef(amountRefs, index)) {
//         focusRef(discountRef, index);
//       }
//     } else if (field === "amount") {
//       focusRef(discountRef, index);
//     } else if (field === "disc") {
//       focusRef(discount2Ref, index);
//     } else if (field === "discount") {
//       focusRef(othersRefs, index);
//     }
//   }

//   // -------------------- ARROW LEFT --------------------
//   else if (event.key === "ArrowLeft") {
//     if (field === "exp_before") {
//       focusRef(discount2Ref, index);
//     } else if (field === "discount") {
//       focusRef(discountRef, index);
//     } else if (field === "disc") {
//       focusRef(priceRefs, index);
//     } else if (field === "amount") {
//       focusRef(priceRefs, index);
//     } else if (field === "rate") {
//       focusRef(quantityRefs, index);
//     } else if (field === "weight") {
//       focusRef(peciesRefs, index);
//     } else if (field === "pkgs") {
//       focusRef(hsnCodeRefs, index);
//     } else if (field === "tariff") {
//       focusRef(desciptionRefs, index);
//     } else if (field === "sdisc") {
//       focusRef(itemCodeRefs, index);
//     } else if (field === "vcode") {
//       focusRef(itemCodeRefs, index);
//     }
//   }

//   // --------------- OPEN MODAL ON LETTER (ACCOUNT NAME) ---------------
//   else if (/^[a-zA-Z]$/.test(event.key) && field === "accountname") {
//     setPressedKey(event.key);
//     openModalForItemCus(index);
//     event.preventDefault();
//   }
// };

//   const handleOpenModalBack = (event, index, field) => {
//     if (event.key === "Backspace" && field === "accountname" && isEditMode ) {
//       setSelectedItemIndexCus(index);
//       setShowModalCus(true);
//       event.preventDefault();
//     }
//     if (event.key === "Backspace" && field === "shippedto" && isEditMode ) {
//       setSelectedItemIndexAcc(index);
//       setShowModalAcc(true);
//       event.preventDefault();
//     }
//     if (event.key === "Backspace" && field === "vcode" && isEditMode ) {
//       setSelectedItemIndex(index);
//       setShowModal(true);
//       event.preventDefault();
//     }
//   };

//   const handleOpenModal = (event, index, field) => {
//     if (/^[a-zA-Z]$/.test(event.key) && field === "vcode") {
//       setPressedKey(event.key); // Set the pressed key
//       openModalForItem(index);
//       event.preventDefault(); // Prevent any default action
//     }
//     if (/^[a-zA-Z]$/.test(event.key) && field === "shippedto") {
//       setPressedKey(event.key); // Set the pressed key
//       openModalForItemAcc(index);
//       event.preventDefault(); // Prevent any default action
//     }
//   };

//   const gradientOptions = [
//     { label: "Lavender", value: "linear-gradient(to right, #d4d4fcff, #b19cd9)" },
//     { label: "Yellow", value: "linear-gradient(to right, #fffac2, #ffdd57)" },
//     { label: "Skyblue", value: "linear-gradient(to right, #ceedf0, #7fd1e4)" },
//     { label: "Green", value: "linear-gradient(to right, #9ff0c3, #45a049)" },
//     { label: "Pink", value: "linear-gradient(to right, #ecc7cd, #ff9a9e)" },
//   ];

//   const [color, setColor] = useState(() => {
//     return localStorage.getItem("SelectedColors") || gradientOptions[0].value;
//   });

//   useEffect(() => {
//     localStorage.setItem("SelectedColors", color);
//   }, [color]);

//   const handleChange = (event) => {
//     setColor(event.target.value);
//   };
//   const handleKeyDowndown = (event, nextFieldRef) => {
//     if (event.key === "Enter" || event.key === "Tab") {
//       event.preventDefault(); // Prevent form submission
//       if (nextFieldRef.current) {
//         nextFieldRef.current.focus();
//       }
//     }
//   };

//   const handleGross = (e) => {
//     const { id, value, type, checked } = e.target;
//     const val = type === "checkbox" ? checked : value; // Handle checkbox differently
//     setFormData({ ...formData, [id]: val });
//   };

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const openModal = () => {
//     // console.log("Modal opened");
//     setIsModalOpen(true);
//   };
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };
//   const [isModalOpenExp, setIsModalOpenExp] = useState(false);

// const handleKeyDownExp = (e, fieldName, index) => {
//   if (e.key === "F2" && fieldName === "exp_before") {
//     e.preventDefault(); // Optional: stop default F2 behavior
//     setCurrentIndex(index);
//     setIsModalOpenExp(true);
//   }
// };


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

//   const handleDoubleClickAfter = (fieldName) => {
//     if (fieldName === "expafterGST" && isEditMode) {
//       setIsModalOpenAfter(true);
//     }
//   }

//   const handleDoubleClick = (event,fieldName, index) => {
    
//     if (fieldName === "exp_before" && isEditMode) {
//       setCurrentIndex(index); // Set the current index
//       setIsModalOpenExp(true); // Open the modal
//       event.preventDefault();
//     }
//     if (isEditMode && fieldName === "accountname") {
//       setSelectedItemIndexCus(index);
//       setShowModalCus(true);
//       event.preventDefault();
//     }
//     if (isEditMode && fieldName === "shippedto") {
//       setSelectedItemIndexAcc(index);
//       setShowModalAcc(true);
//       event.preventDefault();
//     }
//     if (isEditMode && fieldName === "vcode") {
//       setSelectedItemIndex(index);
//       setShowModal(true);
//       event.preventDefault();
//     }
//   };
//   const expRateRefs = useRef([]); // Store refs for Exp_rate fields
//   const closeButtonRef = useRef(null); // Ref for the close button

//   useEffect(() => {
//     if (isModalOpenExp && expRateRefs.current[0]) {
//       expRateRefs.current[0].focus(); // Focus on the first Exp_rate input when modal opens
//     }
//   }, [isModalOpenExp]);

//   const handleKeyDownModal = (event, index) => {
//     if (event.key === "Enter" || event.key === "Tab") {
//       event.preventDefault();
//       if (index < expRateRefs.current.length - 1) {
//         expRateRefs.current[index + 1].focus(); // Move to the next Exp_rate input
//       } else {
//         closeButtonRef.current.focus(); // Move focus to Close button when on Exp_rate5
//       }
//     }
//   };

//   // Permission For Sale Form Open
//   const formData22 = JSON.parse(localStorage.getItem("formDATA") || "{}");
//   const canAccessSale = formData22.S_add === true;

//   // useEffect(() => {
//   //   if (!canAccessSale) {
//   //     alert("Access Denied: You do not have permission to navigate to the Sale page.");
//   //   }
//   // }, [canAccessSale]);

//   // if (!canAccessSale) {
//   //   // Redirect the user if C_add is not true
//   //   return <Navigate to="/" replace />;
//   // }

//   const handleKeyDownTab2 = (e) => {
//     if (e.key === 'Tab' || e.key === 'Enter' ) {
//       e.preventDefault(); // prevent default Tab behavior
//       saveButtonRef.current.focus(); // move focus to vaCode2 input
//     }
//   };

//    const printRef = useRef();
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

//     const isRowFilled = (row) => {
//       return (row.sdisc || "").trim() !== "";
//     };
//     const canEditRow = (rowIndex) => {
//       // 🔒 If not in edit mode, nothing is editable
//       if (!isEditMode) return false;

//       // First row is editable in edit mode
//       if (rowIndex === 0) return true;

//       // All previous rows must be filled
//       for (let i = 0; i < rowIndex; i++) {
//         if (!isRowFilled(items[i])) {
//           return false;
//         }
//       }
//       return true;
//     };

//   return (
//     <div>
//       <ToastContainer />
//       {isModalOpen && <SaleSetup onClose={closeModal} />}
//       <div style={{ visibility: "hidden", width: 0, height: 0 }}>
//         {SelectedInvoiceComponent && (
//           <SelectedInvoiceComponent
//             formData={formData}
//             items={items}
//             customerDetails={customerDetails}
//             shipped={shipped}
//             isOpen={open}
//             handleClose={handleCloseInvoice}
//             componentRef={printRef} // pass the ref
//             selectedCopies={selectedCopies}
//           />
//         )}
//       </div>
//       <div style={{display:'flex',flexDirection:'row',marginTop:-30}}>
//         <h1 className="headerSale">
//           SALE GST{" "}
//           <span className="text-black-500 font-semibold text-base sm:text-lg">
//             {title}
//           </span>
//         </h1>
//       </div>
//       {/* Top Parts */}
//       <div className="sale_toppart ">
//       <div className="Dated ">
//         <InputMask
//             mask="99-99-9999"
//             placeholder="dd-mm-yyyy"
//             value={formData.date}
//             readOnly={!isEditMode || isDisabled}
//             onChange={(e) =>
//               setFormData({ ...formData, date: e.target.value })
//             }
//           >
//             {(inputProps) => (
//               <input
//                 {...inputProps}
//                 className="DatePICKER"
//                 ref={datePickerRef}
//                 onKeyDown={(e) => {
//                   handleEnterKeyPress(datePickerRef, voucherNoRef)(e);
//                 }}
//               />
//             )}
//         </InputMask>
//         {/* <DatePicker
//           ref={datePickerRef}
//           selected={selectedDate || null}
//           openToDate={new Date()}
//           onCalendarClose={handleCalendarClose}
//           dateFormat="dd-MM-yyyy"
//           onChange={handleDateChange}
//           onBlur={() => validateDate(selectedDate)}
//           customInput={<MaskedInput />}
//         /> */}
//       <div  className="billdivz">
//         <TextField
//           inputRef={voucherNoRef}
//           className="billzNo custom-bordered-input"
//           id="vbillno"
//           value={formData.vbillno}
//           variant="filled"
//           size="small"
//           label="BILL NO"
//           onKeyDown={(e) => {
//             handleEnterKeyPress(voucherNoRef,customerNameRef )(e);
//           }}
//           inputProps={{
//             maxLength: 48,
//             style: {
//               height: "20px",
//               fontSize: `${fontSize}px`,
//               // padding: "0 8px"
//             },
//             readOnly: !isEditMode || isDisabled
//           }}
//         />
//       </div>
//       <div className="Setup">
//         <button
//           className="Button"
//           style={{backgroundColor:"blue",color:'white',fontWeight:'bold'}}
//           onClick={openModal}
//           >
//             SETUP
//           </button>

//           {/* Settings Button */}
//           <button
//             onClick={() => setDrawerOpen(true)}
//             className="Setting text-xl text-blue-700"
//           >
//             <FaCog />
//           </button>
//         {/* Fullscreen Overlay Drawer */}
//         {drawerOpen && (
//           <div style={{zIndex:10000}}>
//             {/* Background Overlay */}
//             <div
//               className="fixed inset-0 bg-black bg-opacity-50 z-40"
//               onClick={() => setDrawerOpen(false)}
//             ></div>

//             {/* Drawer Panel */}
//             <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out">
//               {/* Drawer Header */}
//               <div className="flex justify-between items-center px-4 py-3 border-b">
//                 <span className="font-bold text-lg">Options</span>
//                 <button
//                   onClick={() => setDrawerOpen(false)}
//                   className="text-xl text-gray-600"
//                 >
//                   <FaTimes />
//                 </button>
//               </div>

//               {/* Drawer Body */}
//               <div className="flex flex-col p-4 gap-3">
//                 {/* Color Selector */}
//                 <select
//                   className="border border-gray-400 px-3 py-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//                   value={color}
//                   onChange={handleChange}
//                 >
//                   {gradientOptions.map((option, index) => (
//                     <option key={index} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Font Size Buttons */}
//                 {/* <div className="flex gap-2">
//                   <button
//                     onClick={decreaseFontSize}
//                     className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center text-lg"
//                   >
//                     <FaMinus />
//                   </button>

//                   <button
//                     onClick={increaseFontSize}
//                     className="w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded flex items-center justify-center text-lg"
//                   >
//                     <FaPlus />
//                   </button>
//                 </div> */}
//               <div style={{ display: "flex", flexWrap: "wrap",flexDirection:'column'}}>
//                 <span style={{fontSize:17,fontWeight:'bold'}}>SELECT TABLE FIELDS</span>
//                 <div style={{marginTop:"10px",display:'flex',flexDirection:"column"}}>
//                 {Object.keys(tableData).map((field) => (
//                   <label key={field} style={{ marginRight: "15px",fontSize:16 }}>
//                     <input
//                     style={{height:"15px",width:"15px"}}
//                       type="checkbox"
//                       checked={tableData[field]}
//                       onChange={() => handleCheckboxChange(field)}
//                     />
//                     &nbsp;{field.toUpperCase()}
//                   </label>
//                 ))}
//                 </div>
//               </div>
//               </div>
//             </div>
          
//           </div>
//         )}
//       </div>
//       </div>
//       <div className="TopFields">
//           {customerDetails.map((item, index) => (
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
//                       handleDoubleClick(e,"accountname", index)
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
//                     //  disabled
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
//                   //  disabled
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
//                       handleItemChangeCus(
//                         index,
//                         "gstNumber",
//                         e.target.value
//                       )
//                     }
//                     onFocus={(e) => e.target.select()}
//                   />
//                 </div>
//                 <div className="pandivZ">
//                   <TextField
//                   //  disabled
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
//           <div className="shippedTO">
//                 {shipped.map((item, index) => (
//                   <div key={item.shippedto}>
//                       <div>
//                         <TextField
//                           multiline
//                           inputRef={shippedtoRef}
//                           className="shippedtoz custom-bordered-input"
//                           id="shippedto"
//                           variant="filled"
//                           label="SHIPPED TO"
//                           size="small"
//                           value={`${item.shippedto || ''}\n${item.shippingGst || ''}\n${item.shippingcity || ''}`}
//                           InputProps={{
//                             readOnly: !isEditMode || isDisabled,
//                             style: {
//                               height: 100,
//                               fontSize: 14,
//                               overflow: 'hidden',
//                               textOverflow: 'ellipsis',
//                               whiteSpace: 'nowrap',
//                             },
//                           }}
//                           inputProps={{
//                             maxLength: 150,
//                             fontSize: 14,
//                           }}
//                           onKeyDown={(e) => {
//                             handleOpenModal(e, index, "shippedto");
//                             handleKeyDowndown(e, grNoRef);
//                             handleOpenModalBack(e, index, "shippedto");
//                           }}
//                           onDoubleClick={(e) => {
//                           handleDoubleClick(e,"shippedto", index)
//                           }}
//                           onFocus={(e) => e.target.select()} 
//                         />
//                       </div>
//                   </div>
//                 ))}
//                 {showModalAcc && (
//                <ProductModalCustomer
//                 allFields={allFieldsAcc}
//                 onSelect={handleProductSelectAcc}
//                 onClose={() => setShowModalAcc(false)} 
//                 initialKey={pressedKey}
//                 tenant={tenant}
//                 onRefresh={fetchCustomers}
//                 />
//                 )}
//           </div>
//           <div className="GRNo">
//           <TextField
//             inputRef={grNoRef}
//             className="GRNOZ custom-bordered-input"
//             id="gr"
//             label="GR NO"
//             value={formData.gr}
//             variant="filled"
//             size="small"
//             onChange={handleNumericValue}
//             onKeyDown={handleEnterKeyPress(grNoRef, termsRef)}
//             onFocus={(e) => e.target.select()}
//             inputProps={{
//               maxLength: 12,
//               style: {
//                 height: "20px",
//                 fontSize: `${fontSize}px`,
//                 // padding: "0 8px"
//               },
//               readOnly: !isEditMode || isDisabled,
//             }}
//           />
//           <div className="ExFor">
//            <TextField
//             inputRef={termsRef}
//             className="custom-bordered-input"
//             id="exfor"
//             value={formData.exfor}
//             variant="filled"
//             label="TERMS"
//             size="small"
//             onChange={HandleValueChange}
//             onKeyDown={handleEnterKeyPress(termsRef, vehicleNoRef)}
//             onFocus={(e) => e.target.select()}
//             inputProps={{
//               maxLength: 10,
//               style: {
//                 height: "20px",
//                 fontSize: `${fontSize}px`,
//                 // padding: "0 8px"
//               },
//               readOnly: !isEditMode || isDisabled
//             }}
//             // sx={{ width: 128}}
//           />
//           </div>
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
//               onKeyDown={handleEnterKeyPress(vehicleNoRef, null)}
//               onFocus={(e) => e.target.select()}
//               inputProps={{
//                 maxLength: 48,
//                 style: {
//                   height: "20px",
//                   fontSize: `${fontSize}px`,
//                 },
//                 readOnly: !isEditMode || isDisabled
//               }}
//             />
//             <div className="BillType">
//             <FormControl
//               className=" Billss custom-bordered-input"
//               sx={{
//                 fontSize: `${fontSize}px`,
//                 '& .MuiFilledInput-root': {
//                   height: 48, // adjust as needed (default ~56px for filled)
//                 },
//               }}
//               size="small"
//               variant="filled"
//               // disabled={!isEditMode || isDisabled}
//             >
//               <InputLabel id="billcash-label">BILL TYPE</InputLabel>
//                 <Select
//                 className="custom-bordered-input"
//                 labelId="billcash-label"
//                 id="billcash"
//                 value={formData.btype}
//                 onChange={(e) => {
//                   if (!isEditMode || isDisabled) return; // prevent changing
//                     handleBillCash(e);
//                 }}
//                 onOpen={(e) => {
//                   if (!isEditMode || isDisabled) {
//                     e.preventDefault(); // prevent dropdown opening
//                   }
//                 }}
//                 label="BILL TYPE"
//                 displayEmpty
//                 inputProps={{
//                   sx: {
//                     fontSize: `${fontSize}px`, 
//                     pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
//                   },
//                 }}
//                 MenuProps={{ disablePortal: true }}
//               >
//                 <MenuItem value=""><em></em></MenuItem>
//                 <MenuItem value="Bill">Bill</MenuItem>
//                 <MenuItem value="Cash">Cash</MenuItem>
//               </Select>
//             </FormControl>
//             </div>
//           </div>
//           <div className="TAXDiv">
//             <div>
//               <FormControl
//                 fullWidth
//                 size="small"
//                 variant="filled"
//                 // disabled={!isEditMode || isDisabled}
//                 className="TAXtypez custom-bordered-input"
//                 sx={{
//                   fontSize: `${fontSize}px`,
//                   '& .MuiFilledInput-root': {
//                     height: 48, // adjust as needed (default ~56px for filled)
//                   },
//                 }}
//               >
//                 <InputLabel id="taxtype-label">TAX TYPE</InputLabel>
//                 <Select
//                   className="TAXtypez"
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
//                   <MenuItem value="Tax Free Within State">Tax Free Within State</MenuItem>
//                   <MenuItem value="Tax Free Interstate">Tax Free Interstate</MenuItem>
//                   <MenuItem value="Export Sale">Export Sale</MenuItem>
//                   <MenuItem value="Export Sale(IGST)">Export Sale(IGST)</MenuItem>
//                   <MenuItem value="Including GST">Including GST</MenuItem>
//                   <MenuItem value="Including IGST">Including IGST</MenuItem>
//                   <MenuItem value="Not Applicable">Not Applicable</MenuItem>
//                   <MenuItem value="Exempted Sale">Exempted Sale</MenuItem>
//                 </Select>
//               </FormControl>
//             </div>
//             <div style={{marginTop:3}}>
//             <FormControl
//              className="SupplyTYPE custom-bordered-input"
//               sx={{
//                 // width: '250px',
//                 fontSize: `${fontSize}px`,
//                 '& .MuiFilledInput-root': {
//                   height: 48, // adjust as needed (default ~56px for filled)
//                 },
//               }}
//               size="small"
//               // disabled={!isEditMode || isDisabled}
//               variant="filled"
//             >
//               <InputLabel id="supply-label">SUPPLY TYPE</InputLabel>
//               <Select
//                 className="SupplyTYPE"
//                 labelId="supply-label"
//                 id="supply"
//                 value={formData.conv}
//                 onChange={(e) => {
//                   if (!isEditMode || isDisabled) return; // prevent changing
//                     handleSupply(e);
//                 }}
//                 onOpen={(e) => {
//                   if (!isEditMode || isDisabled) {
//                     e.preventDefault(); // prevent dropdown opening
//                   }
//                 }}
//                 // onChange={handleSupply}
//                 label="SUPPLY TYPE"
//                 displayEmpty
//                 inputProps={{
//                   sx: {
//                     fontSize: `${fontSize}px`,
//                     pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
//                   },
//                 }}
//                 MenuProps={{ disablePortal: true }}
//               >
//                 <MenuItem value=""><em></em></MenuItem>
//                 <MenuItem value="Manufacturing Sale">1. Manufacturing Sale</MenuItem>
//                 <MenuItem value="Trading Sale">2. Trading Sale</MenuItem>
//               </Select>
//             </FormControl>
//             </div>
//           </div>
//       </div>
//       </div>
//       {/* Top Part Ends Here */}
//       {/* Table Part */}
//       <div ref={tableContainerRef} style={{marginTop:5}} className="TableContainer">
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
//                   disabled={!canEditRow(index)}
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
//                      handleDoubleClick(e,"vcode", index)
//                     }}
//                     ref={(el) => (itemCodeRefs.current[index] = el)}
//                     onFocus={(e) => e.target.select()} // Select text on focus
//                   />
//                 </td>
//                 )}
//                 {tableData.sdisc && (
//                 <td style={{ padding: 0, width: 300 }}>
//                   <input
//                   disabled={!canEditRow(index)}
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
//                   disabled={!canEditRow(index)}
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
//                   disabled={!canEditRow(index)}
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
//                     value={Number(item.pkgs) === 0 ? "" : item.pkgs}
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
//                   disabled={!canEditRow(index)}
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
//                     value={Number(item.weight) === 0 ? "" : item.weight}
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
//                   disabled={!canEditRow(index)}
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
//                     value={Number(item.rate) === 0 ? "" : item.rate}
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
//                   disabled={!canEditRow(index)}
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
//                     value={Number(item.amount) === 0 ? "" : item.amount}
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
//                   disabled={!canEditRow(index)}
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
//                     value={Number(item.disc) === 0 ? "" : item.disc}
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
//                   disabled={!canEditRow(index)}
//                   id="discount"
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
//                     value={Number(item.discount) === 0 ? "" : item.discount}
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
//                   disabled={!canEditRow(index)}
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
//                     value={Number(item.gst) === 0 ? "" : item.gst +"%"}
//                     // value={item.gst +"%"}
//                     readOnly={!isEditMode || isDisabled}
//                   />
//                 </td>
//                 )}
//                 {tableData.others && (
//                 <td style={{ padding: 0 }}>
//                   <input
//                   disabled={!canEditRow(index)}
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
//                     value={Number(item.exp_before) === 0 ? "" : item.exp_before}
//                     readOnly={!isEditMode || isDisabled}
//                     onDoubleClick={(e) => handleDoubleClick(e, "exp_before", index)}
//                     // onChange={(e) => handleItemChange(index, "exp_before", e.target.value)}
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "exp_before");
//                      handleKeyDownExp(e, "exp_before", index)
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
//                   <div className="Modalz">
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
//                             ref={(el) => (expRateRefs.current[idx] = el)} // Assign ref dynamically
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
//                             onKeyDown={(e) => handleKeyDownModal(e, idx)}
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
//                      <Button
//                         ref={closeButtonRef}
//                         onClick={() => {
//                           const idx = currentIndex; // store before reset

//                           setIsModalOpenExp(false);
//                           setCurrentIndex(null);

//                           // restore focus to Others field
//                           setTimeout(() => {
//                             othersRefs.current[idx]?.focus();
//                             othersRefs.current[idx]?.select();
//                           }, 0);
//                         }}
//                         style={{
//                           borderColor: "transparent",
//                           backgroundColor: "red",
//                           marginTop: 10,
//                         }}
//                       >
//                         CLOSE
//                      </Button>
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
//                     value={Number(item.ctax) === 0 ? "" : item.ctax}
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
//                     value={Number(item.stax) === 0 ? "" : item.stax}
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
//                     value={Number(item.itax) === 0 ? "" : item.itax}
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
//                     <td style={{ padding: 0 }}>
//                       {canEditRow(index) && (
//                         <div
//                           style={{
//                             display: "flex",
//                             justifyContent: "center",
//                             alignItems: "center",
//                             height: "100%",
//                           }}
//                         >
//                           <IconButton
//                             color="error"
//                             size="small"
//                             tabIndex={-1}
//                           >
//                             <DeleteIcon />
//                           </IconButton>
//                         </div>
//                       )}
//                     </td>
//                   )}
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

//       <div className="addbutton" style={{ marginTop: 2, marginBottom: 5 }}>
//         <Button className="fw-bold btn-secondary" onClick={handleAddItem}>
//           Add Row
//         </Button>
//       </div>
//       {/* Bottom Part */}
//       <div className="Belowcontents">
//         <div className="Parent">
//         <div style={{display:'flex',flexDirection:"column",marginLeft:5}}>
//           <TextField
//             className="Remz custom-bordered-input"
//               id="rem2"
//               value={formData.rem2}
//               inputRef={remarksRef}
//               label='REMARKS'
//               onChange={HandleValueChange}
//               onKeyDown={(e) => {
//                 handleKeyDowndown(e, transportRef);
//               }}
//               inputProps={{
//               maxLength: 48,
//               style: {
//                 height: 20,
//                 fontSize: `${fontSize}px`,
//               },
//               }}
//               onFocus={(e) => e.target.select()}
//               size="small"
//               variant="filled"
//               // sx={{ width: 280 }}
//             />
//               <TextField
//             className="Remz custom-bordered-input"
//               id="v_tpt"
//               value={formData.v_tpt}
//               inputRef={transportRef}
//               label='TRANSPORT'
//               onChange={HandleValueChange}
//               onKeyDown={(e) => { handleKeyDowndown(e, brokerRef);
//               handleOpenModalTpt(e, "v_tpt", "v_tpt")
//               }}
//               inputProps={{
//               maxLength: 48,
//               style: {
//                 height: 20,
//                 fontSize: `${fontSize}px`,
//               },
//               }}
//               onFocus={(e) => e.target.select()}
//               size="small"
//               variant="filled"
//               // sx={{ width: 280 }}
//             />
//             <TextField
//             className="Remz custom-bordered-input"
//               id="broker"
//               value={formData.broker}
//               inputRef={brokerRef}
//               label='BROKER'
//               onChange={HandleValueChange}
//               onKeyDown={(e) => {
//                 handleKeyDowndown(e, dueDateRef);
//                 handleOpenModalBroker(e, "broker", "broker")
//               }}
//               inputProps={{
//               maxLength: 48,
//               style: {
//                 height: 20,
//                 fontSize: `${fontSize}px`,
//               },
//               }}
//               onFocus={(e) => e.target.select()}
//               size="small"
//               variant="filled"
//             />

//         </div>
//         <div style={{display:'flex',flexDirection:"column",marginLeft:5}}>
//           <div className="duedatez">
//             <div className={`erp-input2 ${(!isEditMode || isDisabled) ? "disabled" : ""}`}>
//               <span className="erp-label2">DUE DATE</span>

//               <InputMask
//                 mask="99-99-9999"
//                 value={formData.duedate}
//                 readOnly={!isEditMode || isDisabled}
//                 onChange={(e) =>
//                   setFormData({ ...formData, duedate: e.target.value })
//                 }
//               >
//                 {(inputProps) => (
//                   <input
//                     {...inputProps}
//                     ref={dueDateRef}
//                     className="erp-field2 custom-style2"
//                     onKeyDown={(e) => {
//                       handleKeyDowndown(e, expAfterGSTRef);
//                     }}
//                   />
//                 )}
//               </InputMask>
//             </div>
//             {/* <DatePicker
//               id="duedate"
//               value={formData.duedate}
//               className="dueDatePICKER"
//               // selected={expiredDate}
//               onChange={handleDateChange}
//               readOnly={!isEditMode || isDisabled}
//               dateFormat="dd-MM-yyyy"
//               customInput={
//                 <TextField
//                   className="custom-bordered-input"
//                   label="DUE DATE"
//                   variant="filled"
//                   size="small"
//                   sx={{
//                     "& .MuiInputBase-root": {
//                       height: 47, // Adjust height here
//                     },
//                     "& .MuiInputBase-input": {
//                       padding: "20px 14px 6px", // more top padding so text sits lower
//                     }
//                   }}
//                 />
//               }
//             /> */}
//           </div>
//           <div>
//           <TextField
//             className="custom-bordered-input"
//             id="srv_tax"
//             value={formData.srv_tax}
//             // disabled
//             label='TDS 194-Q'
//             onChange={handleNumericValue}
//             inputProps={{
//               maxLength: 48,
//               style: {
//                 height: 20,
//                 fontSize: `${fontSize}px`,
//                 color: 'red',
//               },
//             }}
//             onFocus={(e) => e.target.select()}
//             size="small"
//             variant="filled"
//             sx={{ width: 225 }}
//           />
//           </div>
//           <div style={{ display: "flex", flexDirection: "row",alignItems: "center" }}>
//             <TextField
//             className="TCSRATE custom-bordered-input"
//               inputRef={tcsRef2}
//               id="tcs206_rate"
//               value={formData.tcs206_rate}
//               onKeyDown={(e) => handleKeyDowndown(e, expAfterGSTRef)}
//               inputProps={{
//                 maxLength: 48,
//                 style: {
//                   height: 20,
//                   fontSize: `${fontSize}px`,
//                   color: 'red',
//                 },
//               }}
//               onFocus={(e) => e.target.select()}
//               size="small"
//               variant="filled"
//               InputProps={{ readOnly: !isEditMode || isDisabled }}
//             />

//             <TextField
//             className="TCSPER custom-bordered-input"
//               id="tcs206"
//               value={formData.tcs206}
//               onChange={handleNumericValue}
//               label="TCS 206C@"
//               inputProps={{
//                 maxLength: 48,
//                 style: {
//                   height: 20,
//                   fontSize: `${fontSize}px`,
//                   color: 'red',
//                 },
//               }}
//               onFocus={(e) => e.target.select()}
//               size="small"
//               variant="filled"
//               // sx={{ width: 120 }}
//             />
//           </div>
//         </div>
//         <div style={{display:'flex',flexDirection:"column",marginLeft:5,marginTop:'auto'}}>
//         {formData.Tds2 && Number(formData.Tds2) > 0 && (
//           <TextField
//             className="custom-bordered-input"
//             id="tax"
//             value={"2%"}
//             label="GST. TDS"
//             inputProps={{
//               maxLength: 48,
//               style: {
//                 height: 20,
//                 fontSize: `${fontSize}px`,
//               },
//             }}
//             onFocus={(e) => e.target.select()}
//             size="small"
//             variant="filled"
//             sx={{ width: 120 }}
//           />
//         )}
//         <div style={{display:'flex',flexDirection:"row"}}>
//           <TextField
//             className="CTDS custom-bordered-input"
//             value={formData.Ctds}
//             label="C.TDS"
//             size="small"
//             variant="filled"
//             inputProps={{
//               style: {
//                 height: 20,
//                 fontSize: `${fontSize}px`,
//                 backgroundColor: "white",
//                 borderRadius: 5,
//               },
//             }}
//             sx={{
//               // width: 150,
//               "& .MuiOutlinedInput-root": {
//                 border: "1px solid black",
//                 borderRadius: 1,
//               },
//             }}
//           />
//           <TextField
//             className="CTDS custom-bordered-input"
//             value={formData.Stds}
//             label="S.TDS"
//             size="small"
//             variant="filled"
//             inputProps={{
//               style: {
//                 height: 20,
//                 fontSize: `${fontSize}px`,
//                 backgroundColor: "white",
//                 borderRadius: 5,
//               },
//             }}
//             sx={{
//               // width: 150,
//               "& .MuiOutlinedInput-root": {
//                 border: "1px solid black",
//                 borderRadius: 1,
//               },
//             }}
//           />
//            <TextField
//             className="CTDS custom-bordered-input"
//             value={formData.iTds}
//             label="I.TDS"
//             size="small"
//             variant="filled"
//             inputProps={{
//               style: {
//                 height: 20,
//                 fontSize: `${fontSize}px`,
//                 backgroundColor: "white",
//                 borderRadius: 5,
//               },
//             }}
//             sx={{
//               // width: 150,
//               "& .MuiOutlinedInput-root": {
//                 border: "1px solid black",
//                 borderRadius: 1,
//               },
//             }}
//           />
//           <span style={{ fontSize: 20, marginTop: "10px" }}>=</span> 
//           <TextField
//             className="CTDS custom-bordered-input"
//             value={formData.Tds2}
//             label="TOTAL"
//             size="small"
//             variant="filled"
//             inputProps={{
//               style: {
//                 height: 20,
//                 fontSize: `${fontSize}px`,
//                 backgroundColor: "white",
//                 borderRadius: 5,
//               },
//             }}
//             sx={{
//               // width: 150,
//               "& .MuiOutlinedInput-root": {
//                 border: "1px solid black",
//                 borderRadius: 1,
//               },
//             }}
//           />

//         </div>
//         </div>
//         <div className="totals" >
//         <TextField
//           className="TOTALFIELDS custom-bordered-input"
//           id="tax"
//           value={formData.tax}
//           label="TOTAL GST"
//           inputProps={{
//             maxLength: 48,
//             style: {
//               height: 20,
//               fontSize: `${fontSize}px`,
//             },
//           }}
//           onFocus={(e) => e.target.select()}
//           size="small"
//           variant="filled"
//           // sx={{ width: 150 }}
//         />
//         <div>
//           <TextField
//           className="TOTALFIELDS custom-bordered-input"
//           inputRef={expAfterGSTRef}
//           id="expafterGST"
//           value={formData.expafterGST}
//           label="EXP AFTER GST"
//           onKeyDown={(e) => {
//             handleKeyDowndown(e, saveButtonRef);
//             handleKeyDownAfter(e);
//           }}
//           onFocus={(e) => {
//             e.target.select();
//             if (WindowAfter) {
//               setIsModalOpenAfter(true);
//             }
//           }}
//           onDoubleClick={() => handleDoubleClickAfter("expafterGST")}
//           inputProps={{
//             maxLength: 48,
//             style: {
//               height: 20,
//               fontSize: `${fontSize}px`,
//             },
//             readOnly: !isEditMode || isDisabled,
//           }}
//           size="small"
//           variant="filled"
//           // sx={{ width: 150 }}
//         />
//         {isModalOpenAfter && (
//           <div className="Modal">
//             <div className="Modal-content">
//               <h1 className="headingE">EXPENSE AFTER TAX</h1>
//               <div className="form-group">
//                 <input
//                   type="checkbox"
//                   id="gross"
//                   checked={formData.gross}
//                   onChange={handleGross}
//                 />
//                 <label
//                   style={{ marginLeft: 5 }}
//                   className="label"
//                   htmlFor="Gross"
//                 >
//                   GROSS
//                 </label>
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   marginTop: 10,
//                 }}
//               >
//                 <text>{Expense6}</text>
//                 <input
//                   id="Exp_rate6"
//                   value={formData.Exp_rate6}
//                   style={{
//                     border: "1px solid black",
//                     width: 100,
//                     marginLeft: 26,
//                   }}
//                   onChange={handleNumberChange} // Updated to the new function name
//                 />
//                 <input
//                   id="Exp6"
//                   value={formData.Exp6}
//                   style={{
//                     border: "1px solid black",
//                     width: 100,
//                     marginLeft: 5,
//                   }}
//                 />
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   marginTop: 10,
//                 }}
//               >
//                 <text>{Expense7}</text>
//                 <input
//                   id="Exp_rate7"
//                   value={formData.Exp_rate7}
//                   style={{
//                     border: "1px solid black",
//                     width: 100,
//                     marginLeft: 26,
//                   }}
//                   onChange={handleNumberChange} // Updated to the new function name
//                 />
//                 <input
//                   id="Exp7"
//                   value={formData.Exp7}
//                   style={{
//                     border: "1px solid black",
//                     width: 100,
//                     marginLeft: 5,
//                   }}
//                 />
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   marginTop: 10,
//                 }}
//               >
//                 <text>{Expense8}</text>
//                 <input
//                   id="Exp_rate8"
//                   value={formData.Exp_rate8}
//                   style={{
//                     border: "1px solid black",
//                     width: 100,
//                     marginLeft: 26.5,
//                   }}
//                   onChange={handleNumberChange} // Updated to the new function name
//                 />
//                 <input
//                   id="Exp8"
//                   value={formData.Exp8}
//                   style={{
//                     border: "1px solid black",
//                     width: 100,
//                     marginLeft: 5,
//                   }}
//                 />
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   marginTop: 10,
//                 }}
//               >
//                 <text>{Expense9}</text>
//                 <input
//                   id="Exp_rate9"
//                   value={formData.Exp_rate9}
//                   style={{
//                     border: "1px solid black",
//                     width: 100,
//                     marginLeft: 18,
//                   }}
//                   onChange={handleNumberChange} // Updated to the new function name
//                 />
//                 <input
//                   id="Exp9"
//                   value={formData.Exp9}
//                   style={{
//                     border: "1px solid black",
//                     width: 100,
//                     marginLeft: 5,
//                   }}
//                 />
//               </div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   marginTop: 10,
//                 }}
//               >
//                 <text>{Expense10}</text>
//                 <input
//                   id="Exp_rate10"
//                   value={formData.Exp_rate10}
//                   style={{
//                     border: "1px solid black",
//                     width: 100,
//                     marginLeft: 24.5,
//                   }}
//                   onChange={handleNumberChange} // Updated to the new function name
//                 />
//                 <input
//                   id="Exp10"
//                   value={formData.Exp10}
//                   style={{
//                     border: "1px solid black",
//                     width: 100,
//                     marginLeft: 5,
//                   }}
//                 />
//               </div>
//               <Button
//                 onClick={closeModalAfter}
//                 style={{
//                   borderColor: "transparent",
//                   backgroundColor: "red",
//                   marginTop: 10,
//                 }}
//               >
//                 CLOSE
//               </Button>
//             </div>
//           </div>
//         )}
//         </div>
//         <TextField
//         id="grandtotal"
//         value={formData.grandtotal}
//         label="GRAND TOTAL"
//         onKeyDown={handleKeyDownTab2} // Handle Tab key here
//         inputProps={{
//           maxLength: 48,
//           style: {
//             height: 20,
//             fontSize: `${fontSize}px`,
//             color: "red",
//             fontWeight: "bold",
//           },
//         }}
//         size="small"
//         variant="filled"
//         className="TOTALFIELDS custom-bordered-input"
//         // sx={{ width: 150 }}
//         />
//         </div>
//         </div>
//         <div className="Buttonsgroupz">
//           <Button
//             ref={addButtonRef} 
//             className="Buttonz"
//             style={{ background: color }}
//             onClick={handleAdd}
//             disabled={!isAddEnabled}
//           >
//             Add
//           </Button>
//           {isFAModalOpen && (
//             <FAVoucherModal
//               open={isFAModalOpen}
//               onClose={() => setIsFAModalOpen(false)}
//               tenant={tenant}
//               voucherno={formData.vbillno}
//               vtype="S"
//             />
//           )}
//           <Button
//             className="Buttonz"
//             style={{ background: color }}
//             onClick={handleEditClick}
//             disabled={!isAddEnabled}
//           >
//             Edit
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{background: color }}
//             onClick={handlePrevious}
//             disabled={!isPreviousEnabled}
//           >
//             Previous
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{background: color }}
//             onClick={handleNext}
//             disabled={!isNextEnabled}
//           >
//             Next
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{background: color }}
//             onClick={handleFirst}
//             disabled={!isFirstEnabled}
//           >
//             First
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{background: color }}
//             onClick={handleLast}
//             disabled={!isLastEnabled}
//           >
//             Last
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{background: color }}
//             disabled={!isSearchEnabled}
//             onClick={() => {
//               fetchAllBills();
//               setShowSearch(true);
//             }}
//           >
//             Search
//           </Button>
//           <Button
//             ref={printButtonRef}
//             className="Buttonz"
//             // onClick={handleOpen}
//             onClick={openPrintMenu}
//             // onClick={handleViewFAVoucher}
//             style={{background: color }}
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
//           />
          
//           <Button
//             className="delete"
//             style={{background: color }}
//             onClick={handleDeleteClick}
//             disabled={!isDeleteEnabled}
//           >
//             Delete
//           </Button>
//           <Button
//             className="Buttonz"
//             style={{background: color }}
//             onClick={handleExit}
//           >
//             Exit
//           </Button>
//           <Button
//             ref={saveButtonRef}
//             className="Buttonz"
//             onClick={handleDataSave}
//             disabled={!isSubmitEnabled}
//             style={{background: color }}
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
//           {/* Filters */}
//           <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
//             <Form.Control
//               ref={billNoRef}
//               type="text"
//               placeholder="Enter Bill No..."
//               value={searchBillNo}
//               onChange={(e) => setSearchBillNo(e.target.value)}
//               onKeyDown={handleEnterKeyPress(billNoRef, dateRef)}
//             />

//             <InputMask
//               mask="99-99-9999"
//               placeholder="DD-MM-YYYY"
//               value={searchDate}
//               onChange={(e) => setSearchDate(e.target.value)}
//             >
//               {(inputProps) => (
//                 <input
//                   {...inputProps}
//                   className="form-control"
//                   ref={dateRef}
//                   onKeyDown={handleEnterKeyPress(dateRef, proceedRef)}
//                 />
//               )}
//             </InputMask>

//             {/* <InputMask
//               mask="99-99-9999"
//               placeholder="DD-MM-YYYY"
//               value={searchDate}
//               onChange={(e) => setSearchDate(e.target.value)}
//               className="form-control"
//             /> */}

//             <Button ref={proceedRef} variant="primary" onClick={handleProceed}>
//               Proceed
//             </Button>

//             <Button
//               variant="secondary"
//               onClick={() => {
//                 setSearchBillNo("");
//                 setSearchDate("");
//                 setFilteredBills([]);
//               }}
//             >
//               Clear
//             </Button>
//           </div>

//           {/* Results */}
//           <div style={{ maxHeight: "300px", overflowY: "auto" }}>
//             <Table striped bordered hover>
//               <thead>
//                 <tr>
//                   <th>Bill No</th>
//                   <th>Date</th>
//                   <th>Customer</th>
//                   <th>City</th>
//                   <th>Grand Total</th>
//                   <th>Action</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {filteredBills.map((bill) => (
//                   <tr key={bill._id}>
//                     <td>{bill.formData.vbillno}</td>
//                     <td>{formatDateToDDMMYYYY(bill.formData.date)}</td>
//                     <td>{bill.customerDetails?.[0]?.vacode}</td>
//                     <td>{bill.customerDetails?.[0]?.city}</td>
//                     <td>{bill.formData.grandtotal}</td>
//                     <td>
//                       <Button
//                         size="sm"
//                         onClick={() => handleSelectBill(bill)}
//                       >
//                         Select
//                       </Button>
//                     </td>
//                   </tr>
//                 ))}

//                 {filteredBills.length === 0 && (
//                   <tr>
//                     <td colSpan="6" style={{ textAlign: "center" }}>
//                       No matching records
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default Sale;


import React, { useState, useEffect, useRef, forwardRef } from "react";
import "./Sale.css";
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
import SaleSetup from "./SaleSetup";
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
// import { CompanyContext } from "../../context/CompanyContext";
import { CompanyContext } from "../Context/CompanyContext";
import { useContext } from "react";
import TextField from "@mui/material/TextField";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import BillPrintMenu from "../Modals/BillPrintMenu";
import useCompanySetup from "../Shared/useCompanySetup";
import { Modal, Form } from "react-bootstrap";
import useTdsApplicable from "../Shared/useTdsApplicable";
import FAVoucherModal from "../Shared/FAVoucherModal";
import { useNavigate, useLocation } from "react-router-dom";

const LOCAL_STORAGE_KEY = "tabledataVisibility";

// ✅ Forward ref so DatePicker can focus the input
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

const Sale = () => {

  const location = useLocation();
  const saleId = location.state?.saleId;
  const navigate = useNavigate();

  const { CompanyState, unitType } = useCompanySetup();
  const { applicable194Q } = useTdsApplicable();
  const { company } = useContext(CompanyContext);
  const tenant = "shkun_05062025_05062026";

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    // console.error("No tenant selected!");
  }

  const [selectedCopies, setSelectedCopies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [title, setTitle] = useState("(View)");
  const datePickerRef = useRef(null);
  const tableContainerRef = useRef(null);
  const itemCodeRefs = useRef([]);
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
    console.log("CompanyState",CompanyState);
    
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
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/salesetup`
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
  }, [T11,T21,T12,ExpRate1,ExpRate2,ExpRate3,ExpRate4,ExpRate5,ExpRate6,ExpRate7,ExpRate8,ExpRate9,ExpRate10,Defaultbutton,BillType,SupplyType
  ]);

  useEffect(() => {
    setItems((prev) =>
      normalizeItems(prev, {
        ExpRate1,
        ExpRate2,
        ExpRate3,
        ExpRate4,
        ExpRate5,
      })
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
    let taxable = parseFloat(formDataOverride.sub_total);
    // ✅ Skip TCS Calculation if skipTCS is true
    let tcs206 = skipTCS ? parseFloat(formDataOverride.tcs206) : 0;
    let tcs206Rate = skipTCS ? parseFloat(formDataOverride.tcs206_rate) : 0;
    let tcs1 =  parseFloat(formDataOverride.tcs1) || 0;
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

  useEffect(() => {
    setFormData((prevState) => calculateTotalGst(prevState));
  }, [items, T21, T12, formData.tcs1_rate]);

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
  // Search Modal states
  const [showSearch, setShowSearch] = useState(false);
  const [allBills, setAllBills] = useState([]);
  const [searchBillNo, setSearchBillNo] = useState("");
  const [filteredBills, setFilteredBills] = useState([]);
  const [searchDate, setSearchDate] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isEditMode && saleId) {
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
    const hasVcode = (isEditMode && items.some(item => String(item.vcode).trim() !== ""));
    setIsSubmitEnabled(hasVcode);
  }, [items]);

  const fetchData = async () => {
    try {
      let response;
      if (saleId) {
        response = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegstget/${saleId}`
        );
      } else {
        response = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/last`
        );
      }
      // const response = await axios.get(
      //   `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/last`
      // );

      if (response.status === 200 && response.data && response.data.data) {
        const lastEntry = response.data.data;

        const isValidDate = (date) => !isNaN(Date.parse(date));

        const updatedFormData = {
          ...lastEntry.formData,
          date: isValidDate(lastEntry.formData.date)
            ? lastEntry.formData.date
            : new Date().toLocaleDateString(),
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
        sdisc: "",
        Units: "",
        pkgs: "0.00",
        weight: "0.00",
        rate: "0.00",
        amount: "0.00",
        disc: 0,
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

  // Fetch all bills for search
  const fetchAllBills = async () => {
    try {
      const res = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/sale`
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
        bill.formData.vbillno
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
    setcustomerDetails(bill.customerDetails);
    setItems(bill.items);
    setshipped(bill.shipped);
  };

  const handleNext = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("(View)");
    try {
      if (data1) {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/${data1._id}/next`
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
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/${data1._id}/previous`
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
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/first`
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
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/last`
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
      datePickerRef.current.setFocus();
    }
    try {
      const lastEntry = await fetchData();
      await fetchSalesSetup();
      const today = new Date().toISOString().slice(0, 10);
      const lastvoucherno = lastEntry?.formData?.vbillno ? parseInt(lastEntry.formData.vbillno) + 1 : 1;
      const lastvno = lastEntry?.formData?.vno ? parseInt(lastEntry.formData.vno) + 1 : 1;

      const newData = {
        ...lastEntry?.formData,
        date: today,
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
        })
      );

      // setItems([
      //   {
      //     id: 1,
      //     vcode: "",
      //     sdisc: "",
      //     Units: "",
      //     pkgs: "0",
      //     weight: "0",
      //     rate: "0",
      //     amount: "0",
      //     disc: 0,
      //     discount: "",
      //     gst: 0,
      //     Pcodes01: "",
      //     Pcodess: "",
      //     Scodes01: "",
      //     Scodess: "",
      //     Exp_rate1: ExpRate1 || 0,
      //     Exp_rate2: ExpRate2 || 0,
      //     Exp_rate3: ExpRate3 || 0,
      //     Exp_rate4: ExpRate4 || 0,
      //     Exp_rate5: ExpRate5 || 0,
      //     Exp1: 0,
      //     Exp2: 0,
      //     Exp3: 0,
      //     Exp4: 0,
      //     Exp5: 0,
      //     exp_before: 0,
      //     ctax: "0.00",
      //     stax: "0.00",
      //     itax: "0.00",
      //     tariff: "",
      //     vamt: "0.00",
      //   },
      // ]);
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
      const confirmExit = window.confirm("Are you sure you want to Exit? Unsaved changes may be lost.");
      if (!confirmExit) {
        return;
      }
    }

    setTitle("(View)");
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst/last`
      );

      if (response.status === 200 && response.data.data) {
        const lastEntry = response.data.data;
        setFormData(lastEntry.formData);
        setData1(response.data.data);
        // setItems(lastEntry.items.map((item) => ({ ...item })));
        setItems(normalizeItems(lastEntry.items));
        setcustomerDetails(lastEntry.customerDetails.map((item) => ({ ...item })));
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
        toast.error("Please Fill the Customer Details", { position: "top-center" });
        return;
      }

      const nonEmptyItems = items.filter((item) => (item.sdisc || "").trim() !== "");
      if (nonEmptyItems.length === 0) {
        toast.error("Please fill in at least one Items name.", { position: "top-center" });
        return;
      }
const ddmmyyyy = (d) => {
  if (!d) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};
      // 2) Build base form with setup codes (common to both add/edit)
      const baseForm = {
      date: isAbcmode ? selectedDate?.toISOString() : ddmmyyyy(selectedDate),
  duedate: isAbcmode ? expiredDate?.toISOString() : ddmmyyyy(expiredDate),
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
      };

      const itemsPayload = nonEmptyItems.map((item) => ({
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
      const saleGstUrl = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salegst${isAbcmode ? `/${data1._id}` : ""}`; // NOTE: replace 'aa' with ${tenant} if you have it
      const saleGstMethod = isAbcmode ? "put" : "post";
      const saleRes = await axios({ method: saleGstMethod, url: saleGstUrl, data: combinedData });

      // Try to extract saleId from response; fallbacks included for PUT/legacy responses
      const saleId =
        saleRes?.data?.saleId ||
        saleRes?.data?._id ||
        (isAbcmode ? data1?._id : null);

      if (!saleId) {
        console.warn("saleId not found in /salegst response. Ensure backend returns { ok: true, saleId }.");
      }

      if (saleRes?.status === 200 || saleRes?.status === 201) {
        // 4) Update Stock (SALE => subtract)
        // try {
        //   await axios.post(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/stock/update`, {
        //     mode: "sale",
        //     items: nonEmptyItems.map((item) => ({
        //       vcode: item.vcode,
        //       sdisc: item.sdisc,
        //       weight: Number(item.weight) || 0,
        //       pkgs: Number(item.pkgs) || 0,
        //     })),
        //   });
        // } catch (stkErr) {
        //   console.error("Stock update error:", stkErr);
        //   // Continue even if stock update fails
        // }

        // 5) Post FA entries (with setup codes) — include saleId
        try {
          const faUrl = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/salefaFile${isAbcmode ? `/${data1._id}` : ""}`;
          const faBody = saleId ? { ...combinedData, saleId } : combinedData;

          await axios({
            method: isAbcmode ? "put" : "post",
            url: faUrl,
            data: faBody,
          });
        } catch (faErr) {
          console.error("salefaFile error:", faErr);
          toast.warn(
            "Sale saved & stock updated, but FA posting failed. Try 'Post to FA' later.",
            { position: "top-center" }
          );
        }

        fetchData();
        isDataSaved = true;
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.", { position: "top-center" });
    } finally {
      setIsSubmitEnabled(false);
      if (isDataSaved) {
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
  }, [isPrintEnabled,shouldFocusPrint,isAddEnabled,shouldFocusAdd]);

  const handleDeleteClick = async (id) => {
    if (!id) {
      toast.error("Invalid ID. Please select an item to delete.", {
        position: "top-center",
      });
      return;
    }

    const userConfirmed = window.confirm(
      "Are you sure you want to delete this from records?"
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
    } else if (RateCal === "Wt/Qty") {
      TotalAcc = totalAccordingWeight;
      // console.log("totalAccordingWeight");
    } else if (RateCal === "Pc/Pkgs") {
      TotalAcc = totalAccordingPkgs;
      // console.log("totalAccordingPkgs");
    }
    let others = parseFloat(updatedItems[index].exp_before) || 0;
    let disc = parseFloat(updatedItems[index].disc) || 0;
    let manualDiscount = parseFloat(updatedItems[index].discount) || 0;
    let per;
    if (key === "discount") {
      per = manualDiscount;
    } else {
      per = ((disc / 100) * TotalAcc);
      updatedItems[index]["discount"] = T21 ? Math.round(per).toFixed(2) : per.toFixed(2);
    }

    // ✅ Convert to float for reliable calculation
    per = parseFloat(per);
    let Amounts = TotalAcc + per + others;

    // Ensure TotalAcc is a valid number before calling toFixed()
    TotalAcc = isNaN(TotalAcc) ? 0 : TotalAcc;
    // Check if GST number starts with "0" to "3"
    let cgst, sgst, igst;
    if (CompanyState == customerDetails[0].state) {
      cgst = (Amounts * (gst / 2)) / 100 || 0;
      sgst = (Amounts * (gst / 2)) / 100 || 0;
      igst = 0;
    } else {
      cgst = sgst = 0;
      igst = (Amounts * gst) / 100 || 0;
    }

    // Calculate the total with GST and Others
    let totalWithGST = Amounts + cgst + sgst + igst;
    // Update CGST, SGST, Others, and total fields in the item
    if (T21) {
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

  // Function to handle adding a new item
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
        disc: 0,
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

  const handleProductSelect = (product) => {
    setIsEditMode(true);
      if (selectedItemIndex !== null) {
        handleItemChange(selectedItemIndex, "name", product.Aheads);
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

const allFields = products.length ? Object.keys(products[0])
: ["Aheads", "Pcodes01", "UOM", "GST"]; // fallback/default fields

  // Modal For Customer
  React.useEffect(() => {
    // Fetch products from the API when the component mounts
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
       const response = await fetch(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount`
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
      setProductsCus(formattedData);
      setLoadingCus(false);
      setProductsAcc(formattedData);
      setLoadingAcc(false);
    } catch (error) {
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
      Vcode: product.acode || '',
      vacode: product.ahead || '',
      city:   product.city  || '',
      gstno:  product.gstNo  || '',
      pan:    product.pan    || '',
      Add1: product.add1 || '',
      state: product.state    || '',
      Tcs206c1H: product.tcs206    || '',
      TDS194Q: product.tds194q    || '',  
    };

    const stype = determineSaleType(product.state, product.gstNo || "", CompanyState);
    setFormData((prevState) => ({
      ...prevState,
      stype,
    }));

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexCus !== null) {
      setFormData((prev) => ({
        ...prev,
        broker: product.agent || ""   // <-- change key name based on your API
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
        (product) => product.ahead === value
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
  const handleOpenModalBroker = (event, index ) => {
    if (event.key === "ArrowDown" && isEditMode ) {
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
  
    // Defensive: index of the row being edited
    // if (typeof selectedItemIndexAcc !== "number") {
    //   alert("No shipped row selected!");
    //   setShowModalAcc(false);
    //   return;
    // }
  
    // Deep copy shipped array
    const updatedShipped = [...shipped];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexAcc] = {
      ...updatedShipped[selectedItemIndexAcc],
      shippedto: product.ahead || "",
      shippingGst: product.gstNo || "",
      shippingAdd: product.add1 || "",
      shippingcity: product.city || "",
      shippingState:product.state || "",
      shippingPan:product.pan || "",
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
    setshipped(updatedShipped);       // <- update the array in state!
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
    if(isEditMode){
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

  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // If formData.date has a valid date string, parse it and set selectedDate
    if (formData.date) {
      try {
        const date = new Date(formData.date);
        if (!isNaN(date.getTime())) {
          setSelectedDate(date);
        } else {
          console.error("Invalid date value in formData.date:", formData.date);
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    } else {
      // If there's no date, we keep selectedDate as null so the DatePicker is blank,
      // but we can still have it open on today's date via openToDate
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

    if (isEditMode && checkDate > today) {
      toast.info("You Have Selected a Future Date.", {
        position: "top-center",
      });
    } else if (isEditMode && checkDate < today) {
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
    const numericValue = typeof value === "string" ? value.replace(/[^0-9.-]/g, "") : value;
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
    const totalAccordingWeight = parseFloat(updatedItems[index].weight) *  parseFloat(updatedItems[index].rate);
    const totalAccordingPkgs =  parseFloat(updatedItems[index].pkgs) *  parseFloat(updatedItems[index].rate);
    let RateCal = updatedItems[index].RateCal;
    let TotalAcc = totalAccordingWeight; // Set a default value

    if ( RateCal === "Default" || RateCal === "" || RateCal === null || RateCal === undefined) {
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
    let cgst = 0,
      sgst = 0,
      igst = 0;
    if (CompanyState == customerDetails[0].state) {
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
  { name: "vcode",      refArray: itemCodeRefs },
  { name: "sdisc",      refArray: desciptionRefs },
  { name: "tariff",     refArray: hsnCodeRefs },
  { name: "pkgs",       refArray: peciesRefs },
  { name: "weight",     refArray: quantityRefs },
  { name: "rate",       refArray: priceRefs },
  { name: "amount",     refArray: amountRefs },
  { name: "disc",       refArray: discountRef },
  { name: "discount",   refArray: discount2Ref },
  { name: "exp_before", refArray: othersRefs },
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

  container.scrollTop =
    rowTop - containerHeight + rowHeight + 60;
};
const handleKeyDown = (event, index, field) => {
  // --------------- ENTER / TAB: move to NEXT FIELD -----------------
  if (event.key === "Enter" || event.key === "Tab") {
    event.preventDefault();

    // Special case for vcode: your existing behaviour
    if (field === "vcode") {
      if ((items[index].sdisc || "").trim() === "") {
        // Go to remarks if description is empty
        remarksRef.current?.focus();
      } else {
        focusRef(desciptionRefs, index);
      }
      return;
    }

    // Special case for exp_before: go to next row / add row
    if (field === "exp_before") {
      const isLastRow = index === items.length - 1;

      // if (isLastRow) {
      //   handleAddItem();
      //   // Focus ItemCode of newly added row
      //   focusRef(itemCodeRefs, index + 1);
      // }
      if (isLastRow) {
        handleAddItem();

        setTimeout(() => {
          focusScrollRow(itemCodeRefs, index + 1);
        }, 0);
      }
       else {
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
    if (field === "vcode") {
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
    }
  }

  // -------------------- ARROW LEFT --------------------
  else if (event.key === "ArrowLeft") {
    if (field === "exp_before") {
      focusRef(discount2Ref, index);
    } else if (field === "discount") {
      focusRef(discountRef, index);
    } else if (field === "disc") {
      focusRef(priceRefs, index);
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
    } else if (field === "vcode") {
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
    if (event.key === "Backspace" && field === "accountname" && isEditMode ) {
      setSelectedItemIndexCus(index);
      setShowModalCus(true);
      event.preventDefault();
    }
    if (event.key === "Backspace" && field === "shippedto" && isEditMode ) {
      setSelectedItemIndexAcc(index);
      setShowModalAcc(true);
      event.preventDefault();
    }
    if (event.key === "Backspace" && field === "vcode" && isEditMode ) {
      setSelectedItemIndex(index);
      setShowModal(true);
      event.preventDefault();
    }
  };

  const handleOpenModal = (event, index, field) => {
    if (/^[a-zA-Z]$/.test(event.key) && field === "vcode") {
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
    { label: "Lavender", value: "linear-gradient(to right, #d4d4fcff, #b19cd9)" },
    { label: "Yellow", value: "linear-gradient(to right, #fffac2, #ffdd57)" },
    { label: "Skyblue", value: "linear-gradient(to right, #ceedf0, #7fd1e4)" },
    { label: "Green", value: "linear-gradient(to right, #9ff0c3, #45a049)" },
    { label: "Pink", value: "linear-gradient(to right, #ecc7cd, #ff9a9e)" },
  ];

  const [color, setColor] = useState(() => {
    return localStorage.getItem("SelectedColors") || gradientOptions[0].value;
  });

  useEffect(() => {
    localStorage.setItem("SelectedColors", color);
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
    saveButtonRef.current.focus();
  };

  const handleDoubleClickAfter = (fieldName) => {
    if (fieldName === "expafterGST" && isEditMode) {
      setIsModalOpenAfter(true);
    }
  }

  const handleDoubleClick = (event,fieldName, index) => {
    
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
    if (isEditMode && fieldName === "vcode") {
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
        expRateRefs.current[index + 1].focus(); // Move to the next Exp_rate input
      } else {
        closeButtonRef.current.focus(); // Move focus to Close button when on Exp_rate5
      }
    }
  };

  // Permission For Sale Form Open
  const formData22 = JSON.parse(localStorage.getItem("formDATA") || "{}");
  const canAccessSale = formData22.S_add === true;

  // useEffect(() => {
  //   if (!canAccessSale) {
  //     alert("Access Denied: You do not have permission to navigate to the Sale page.");
  //   }
  // }, [canAccessSale]);

  // if (!canAccessSale) {
  //   // Redirect the user if C_add is not true
  //   return <Navigate to="/" replace />;
  // }

    const handleKeyDownTab = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault(); // prevent default Tab behavior
      customerNameRef.current.focus(); // move focus to vaCode2 input
    }
  };

    const handleKeyDownTab2 = (e) => {
    if (e.key === 'Tab') {
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
      return (row.sdisc || "").trim() !== "";
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

    const nonEmptyItems2 = items.filter((item) => (item.sdisc || "").trim() !== "");
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
      <div style={{display:'flex',flexDirection:'row',marginTop:-30}}>
        <h1 className="headerSale">
          SALE GST{" "}
          <span className="text-black-500 font-semibold text-base sm:text-lg">
            {title}
          </span>
        </h1>
      </div>
      {/* Top Parts */}
      <div className="sale_toppart ">
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
      <div  className="billdivz">
        <TextField
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
            readOnly: !isEditMode || isDisabled
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
                      handleEnterKeyPress(customerNameRef, grNoRef)(e);
                      handleKeyDown(e, index, "accountname");
                      handleOpenModalBack(e, index, "accountname");
                    }}
                    onDoubleClick={(e) => {
                      handleDoubleClick(e,"accountname", index)
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
                      handleItemChangeCus(
                        index,
                        "gstNumber",
                        e.target.value
                      )
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
                          value={`${item.shippedto || ''}\n${item.shippingGst || ''}\n${item.shippingcity || ''}`}
                          InputProps={{
                            readOnly: !isEditMode || isDisabled,
                            style: {
                              height: 100,
                              fontSize: 14,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
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
                          handleDoubleClick(e,"shippedto", index)
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
              readOnly: !isEditMode || isDisabled
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
              onKeyDown={handleEnterKeyPress(vehicleNoRef, null)}
              onFocus={(e) => e.target.select()}
              inputProps={{
                maxLength: 48,
                style: {
                  height: "20px",
                  fontSize: `${fontSize}px`,
                },
                readOnly: !isEditMode || isDisabled
              }}
            />
            <div className="BillType">
            <FormControl
              className=" Billss custom-bordered-input"
              sx={{
                fontSize: `${fontSize}px`,
                '& .MuiFilledInput-root': {
                  height: 48, // adjust as needed (default ~56px for filled)
                },
              }}
              size="small"
              variant="filled"
              // disabled={!isEditMode || isDisabled}
            >
              <InputLabel id="billcash-label">BILL TYPE</InputLabel>
                <Select
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
                label="BILL TYPE"
                displayEmpty
                inputProps={{
                  sx: {
                    fontSize: `${fontSize}px`, 
                    pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
                  },
                }}
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value=""><em></em></MenuItem>
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
                  '& .MuiFilledInput-root': {
                    height: 48, // adjust as needed (default ~56px for filled)
                  },
                }}
              >
                <InputLabel id="taxtype-label">TAX TYPE</InputLabel>
                <Select
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
                  <MenuItem value="Tax Free Within State">Tax Free Within State</MenuItem>
                  <MenuItem value="Tax Free Interstate">Tax Free Interstate</MenuItem>
                  <MenuItem value="Export Sale">Export Sale</MenuItem>
                  <MenuItem value="Export Sale(IGST)">Export Sale(IGST)</MenuItem>
                  <MenuItem value="Including GST">Including GST</MenuItem>
                  <MenuItem value="Including IGST">Including IGST</MenuItem>
                  <MenuItem value="Not Applicable">Not Applicable</MenuItem>
                  <MenuItem value="Exempted Sale">Exempted Sale</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div style={{marginTop:3}}>
            <FormControl
             className="SupplyTYPE custom-bordered-input"
              sx={{
                // width: '250px',
                fontSize: `${fontSize}px`,
                '& .MuiFilledInput-root': {
                  height: 48, // adjust as needed (default ~56px for filled)
                },
              }}
              size="small"
              // disabled={!isEditMode || isDisabled}
              variant="filled"
            >
              <InputLabel id="supply-label">SUPPLY TYPE</InputLabel>
              <Select
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
                <MenuItem value=""><em></em></MenuItem>
                <MenuItem value="Manufacturing Sale">1. Manufacturing Sale</MenuItem>
                <MenuItem value="Trading Sale">2. Trading Sale</MenuItem>
              </Select>
            </FormControl>
            </div>
          </div>
      </div>
      </div>
      {/* Top Part Ends Here */}
      {/* Table Part */}
      <div ref={tableContainerRef} style={{marginTop:5}} className="TableContainer">
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
                    value={item.vcode}
                    readOnly
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "vcode");
                      handleOpenModal(e, index, "vcode");
                      handleOpenModalBack(e, index, "vcode");
                    }}
                    onDoubleClick={(e) => {
                     handleDoubleClick(e,"vcode", index)
                    }}
                    ref={(el) => (itemCodeRefs.current[index] = el)}
                    onFocus={(e) => e.target.select()} // Select text on focus
                  />
                </td>
                )}
                {tableData.sdisc && (
                <td style={{ padding: 0, width: 300 }}>
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
                {tableData.gst && (
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
                      textAlign: "center",
                    }}
                    maxLength={2}
                    value={Number(item.gst) === 0 ? "" : item.gst +"%"}
                    // value={item.gst +"%"}
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
                    value={Number(item.exp_before) === 0 ? "" : item.exp_before}
                    readOnly={!isEditMode || isDisabled}
                    onDoubleClick={(e) => handleDoubleClick(e, "exp_before", index)}
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
                            ref={(el) => (expRateRefs.current[idx] = el)} // Assign ref dynamically
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
                            onKeyDown={(e) => handleKeyDownModal(e, idx)}
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
                          <IconButton
                            color="error"
                            size="small"
                            tabIndex={-1}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      )}
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

      <div className="addbutton" style={{ marginTop: 2, marginBottom: 5 }}>
        <Button className="fw-bold btn-secondary" onClick={handleAddItem}>
          Add Row
        </Button>
      </div>
      {/* Bottom Part */}
      <div className="Belowcontents">
        <div className="Parent" style={{display:'flex',flexDirection:'row'}}>
        <div style={{display:'flex',flexDirection:"column"}}>
          <TextField
            className="Remz custom-bordered-input"
              id="rem2"
              value={formData.rem2}
              inputRef={remarksRef}
              label='REMARKS'
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
              label='TRANSPORT'
              onChange={HandleValueChange}
              onKeyDown={(e) => { handleKeyDowndown(e, brokerRef);
              handleOpenModalTpt(e, "v_tpt", "v_tpt")
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
              label='BROKER'
              onChange={HandleValueChange}
              onKeyDown={(e) => {
                handleKeyDowndown(e, expAfterGSTRef);
                handleOpenModalBroker(e, "broker", "broker")
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
        <div style={{display:'flex',flexDirection:"column",marginLeft:5}}>
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
                      height: 47, // Adjust height here
                    },
                    "& .MuiInputBase-input": {
                      padding: "20px 14px 6px", // more top padding so text sits lower
                    }
                  }}
                />
              }
            />
          </div>
          <div>
          <TextField
            className="custom-bordered-input"
            id="srv_tax"
            value={formData.srv_tax}
            // disabled
            label='TDS 194-Q'
            onChange={handleNumericValue}
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
            sx={{ width: 150 }}
          />
          </div>
          <div style={{ display: "flex", flexDirection: "row",alignItems: "center" }}>
            <TextField
            className="TCSRATE custom-bordered-input"
              inputRef={tcsRef2}
              id="tcs1_rate"
              value={formData.tcs1_rate}
              onKeyDown={(e) => handleKeyDowndown(e, expAfterGSTRef)}
              onChange={(e) =>
                setFormData(prev => ({
                  ...prev,
                  tcs1_rate: e.target.value
                }))
              }
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
                  color: 'red',
                },
              }}
              onFocus={(e) => e.target.select()}
              size="small"
              variant="filled"
              // sx={{ width: 120 }}
            />
          </div>
        </div>
        <div style={{display:'flex',flexDirection:"column",marginLeft:5,marginTop:'auto'}}>
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
        <div style={{display:'flex',flexDirection:"row"}}>
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
        <div className="totals" style={{display:"flex",flexDirection:"column",marginLeft:"auto",marginRight:"12px" }}>
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
            style={{background: color }}
            onClick={handlePrevious}
            disabled={!isPreviousEnabled}
          >
            Previous
          </Button>
          <Button
            className="Buttonz"
            style={{background: color }}
            onClick={handleNext}
            disabled={!isNextEnabled}
          >
            Next
          </Button>
          <Button
            className="Buttonz"
            style={{background: color }}
            onClick={handleFirst}
            disabled={!isFirstEnabled}
          >
            First
          </Button>
          <Button
            className="Buttonz"
            style={{background: color }}
            onClick={handleLast}
            disabled={!isLastEnabled}
          >
            Last
          </Button>
          <Button
            className="Buttonz"
            style={{background: color }}
            disabled={!isSearchEnabled}
            onClick={() => {
              fetchAllBills();
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
            style={{background: color }}
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
            style={{background: color }}
            onClick={handleDeleteClick}
            disabled={!isDeleteEnabled}
          >
            Delete
          </Button>
          <Button
            className="Buttonz"
            style={{background: color }}
            onClick={handleExit}
          >
            Exit
          </Button>
          <Button
            ref={saveButtonRef}
            className="Buttonz"
            onClick={handleDataSave}
            disabled={!isSubmitEnabled}
            style={{background: color }}
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
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>BillNo</th>
                <th>Date</th>
                <th>Customer</th>
                <th>City</th>
                <th>GrandTotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.formData.vbillno}</td>
                  <td>
                    {new Date(bill.formData.date).toLocaleDateString("en-GB")}
                  </td>
                  <td>{bill.customerDetails?.[0]?.vacode}</td>
                  <td>{bill.customerDetails?.[0]?.city}</td>
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

export default Sale;