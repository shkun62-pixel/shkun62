import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { ButtonGroup } from "@mui/material";
import "./LedgerAcc.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFilePicker } from "use-file-picker";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import axios from "axios";
import { useEditMode } from "../../EditModeContext";
import AnexureModal from "../Modals/AnexureModal ";
import { Modal, Box, Autocomplete, TextField,  Typography } from "@mui/material";
import { CompanyContext } from "../Context/CompanyContext";
import { useContext } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import ProductModalCustomer from "../Modals/ProductModalCustomer";
import useLedgerAccounts from "../Shared/useLedgerAccounts";
import { useNavigate, useLocation } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});
const LedgerAcc = ({ onClose, onRefresh, ledgerId2}) => {

  const location = useLocation();
  const ledgerId = location.state?.ledgerId;
  const navigate = useNavigate();

  const { getUniqueValues, existingGstList, existingpanList, existingTdsList, existingAdharList, existingAccList, existingAcCodeList, ledgerData, fetchLedgerAccounts } = useLedgerAccounts(); // only using hook
  const { company } = useContext(CompanyContext);
  // const tenant = company?.databaseName;
  const tenant = "shkun_05062025_05062026"

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    console.error("No tenant selected!");
  }
  const [title, setTitle] = useState("VIEW");
  const [imageSrc, setImageSrc] = useState(null);
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpenMisc, setIsModalOpenMisc] = useState(false);
  const inputRefs = useRef([]); // Array to hold references for input fields
  const [toastOpen, setToastOpen] = useState(false); // Track if toast is open
  const [formData, setFormData] = useState({
    Bsgroup: "",
    Bscode:"",
    acode: "",
    gstNo: "",
    ahead: "",
    add1: "",
    add2: "",
    city: "",
    state: "",
    distance:"",
    pinCode: "",
    distt: "",
    opening_dr: "",
    opening_cr: "",
    msmed: "",
    phone: "",
    email: "",
    area: "",
    agent: "",
    group: "",
    pan: "",
    tcs206: "",
    tds194q:"",
    tdsno: "",
    wahead: "",
    wadd1: "",
    wadd2: "",
    Rc: "",
    Ecc: "",
    erange: "",
    collc: "",
    srvno: "",
    cperson: "",
    irate: "",
    tds_rate: "",
    tcs_rate: "",
    sur_rate: "",
    weight: "",
    bank_ac: "",
    narration: "",
    subname: "",
    subaddress: "",
    subcity: "",
    subgstNo: "",
    payLimit:0,
    payDuedays:0,
    graceDays:0,
    sortingindex:"",
    qtyBsheet:"",
    discount:0,
    Terms:"",
    tradingAc:"",
    prefixPurInvoice:"",
    status:"",
    ward:"",
    areacode:"",
    aoType:"",
    rangecode:"",
    aoNo:"",
  });

  const handleOpenMisc = (e) => {
    if (isEditMode) {
      setIsModalOpenMisc(true);
    }
  };
  const handlecloseMisn = () => {
    setIsModalOpenMisc(false);
  };

    const [decimalValue, setdecimalValue] = useState(0);
    const fetchCashBankSetup = async () => {
      try {
        const response = await fetch(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/cashbanksetup`
        );
        if (!response.ok) throw new Error("Failed to fetch sales setup");
  
        const data = await response.json();
  
        if (Array.isArray(data) && data.length > 0 && data[0].formData) {
          const formDataFromAPI = data[0].formData;
          setdecimalValue(formDataFromAPI.decimals);
          console.log(decimalValue);
          
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Error fetching sales setup:", error.message);
      }
    };
    useEffect(() => {
      fetchCashBankSetup();
    }, [decimalValue]);

// fetch details From IFSC Code
  useEffect(() => {
    const fetchBankName = async () => {
      try {
        const response = await axios.get(
          `https://ifsc.razorpay.com/${formData.Ecc}`
        );
        setFormData((prev) => ({
          ...prev,
          erange: response.data.BANK,
        }));
      } catch (err) {
        setFormData((prev) => ({
          ...prev,
          erange: "Invalid IFSC",
        }));
      }
    };

    if (formData.Ecc.length === 11) {
      fetchBankName();
    } else {
      setFormData((prev) => ({
        ...prev,
        erange: "",
      }));
    }
  }, [formData.Ecc]);

    // Modal For CustomerDetails
    const [pressedKey, setPressedKey] = useState(" "); // State to hold the pressed key
    const [productsCus, setProductsCus] = useState([]);
    const [showModalCus, setShowModalCus] = useState(false);
    const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
    const [loadingCus, setLoadingCus] = useState(true);
    const [errorCus, setErrorCus] = useState(null);
  
    const handleProductSelectCus = (product) => {
      if (selectedItemIndexCus !== null && product) {
      const updatedFormData = { ...formData };

      // Loop through formData keys and map values from product
      Object.keys(formData).forEach((key) => {
        updatedFormData[key] = product[key] ?? formData[key]; // Preserve default if missing
      });

      setFormData(updatedFormData);
      setShowModalCus(false);
      }
    };
  
    const handleCloseModalCus = () => {
      setShowModalCus(false);
      setPressedKey("");
      setIsEditMode(true);
    };
  
    const openModalForItemCus = (index) => {
      setSelectedItemIndexCus(index);
      setShowModalCus(true);
    };
  
    const allFieldsCus = productsCus.reduce((fields, product) => {
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
      } catch (error) {
        setErrorCus(error.message);
        setLoadingCus(false);
      }
    };

  const handleSelectBsgroup = (selectedItem) => {
    setFormData((prevData) => ({
      ...prevData,
      Bsgroup: selectedItem.name,
      Bscode: selectedItem.code,
      group: selectedItem.group,
    }));

    setTimeout(() => {
      if (selectedItem.group !== "Balance Sheet") {
        // Focus A/C NAME
        inputRefs.current[1]?.focus();
      } else {
        // Focus GST NO
        inputRefs.current[0]?.focus();
      }
    }, 200);
  };

  // Api Response
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
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
  const [isFetchEnabled, setIsFetchEnabled] = useState(false);
  const [isSubMasterEnabled, setIsSubMasterEnabled] = useState(false);
  const { isEditMode, setIsEditMode } = useEditMode(); // Access the context
  const [isAbcmode, setIsAbcmode] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
  const [firstTimeCheckData, setFirstTimeCheckData] = useState("");

  const fetchData = async () => {
      try {
        console.log("ledger_Id:",ledgerId);
        
          let response;
          if (ledgerId) {
            response = await axios.get(
              `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount1/${ledgerId}`
            );
          }else if (ledgerId2) {
            response = await axios.get(
              `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount1/${ledgerId2}`
            );
          } else {
            response = await axios.get(
              `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount/last`
            );
          }
          // const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount/last`);
          if (response.status === 200 && response.data.data || response.data) {
            const lastEntry = response.data.data || response.data || null;
              // Set flags and update form data
              setFirstTimeCheckData("DataAvailable");
              setFormData(lastEntry.formData);
              // Set data and index
              setData1(lastEntry); // Assuming setData1 holds the current entry data
              setIndex(lastEntry.Acodes); // Set index to the voucher number or another identifier
          } else {
              setFirstTimeCheckData("DataNotAvailable");
              console.log("No data available");
              // Create an empty data object with voucher number 0
              const emptyFormData = {
                  Bsgroup: "",
                  Bscode:"",
                  acode: "",
                  gstNo: "",
                  ahead: "",
                  add1: "",
                  add2:"",
                  city: "",
                  state: "",
                  distance:"",
                  pinCode: "",
                  distt: "",
                  opening_dr: "",
                  opening_cr: "",
                  msmed: "",
                  phone: "",
                  email: "",
                  area: "",
                  agent: "",
                  group: "",
                  pan: "",
                  tcs206: "",
                  tds194q: "",
                  tdsno: "",
                  wahead: "",
                  wadd1: "",
                  wadd2: "",
                  Rc: "",
                  Ecc: "",
                  erange: "",
                  collc: "",
                  srvno: "",
                  cperson: "",
                  irate: "",
                  tds_rate: "",
                  tcs_rate: "",
                  sur_rate: "",
                  weight: "",
                  bank_ac: "",
                  narration: "",
                  subname: "",
                  subaddress: "",
                  subcity: "",
                  subgstNo: "",
                  payLimit:0,
                  payDuedays:0,
                  graceDays:0,
                  sortingindex:"",
                  qtyBsheet:"",
                  discount:0,
                  Terms:"",
                  tradingAc:"",
                  prefixPurInvoice:"",
                  status:"",
                  ward:"",
                  areacode:"",
                  aoType:"",
                  rangecode:"",
                  aoNo:"",
              };
              // Set the empty data
              setFormData(emptyFormData);
              setData1({ formData: emptyFormData}); // Store empty data
              setIndex(0); // Set index to 0 for the empty voucher
          }
      } catch (error) {
          console.error("Error fetching data", error);
          // In case of error, you can also initialize empty data if needed
          const emptyFormData = {
              Bsgroup: "",
              Bscode:"",
              acode: "",
              gstNo: "",
              ahead: "",
              add1: "",
              add2:"",
              city: "",
              state: "",
              distance: "",
              pinCode: "",
              distt: "",
              opening_dr: "",
              opening_cr: "",
              msmed: "",
              phone: "",
              email: "",
              area: "",
              agent: "",
              group: "",
              pan: "",
              tcs206: "",
              tds194q: "",
              tdsno: "",
              wahead: "",
              wadd1: "",
              wadd2: "",
              Rc: "",
              Ecc: "",
              erange: "",
              collc: "",
              srvno: "",
              cperson: "",
              irate: "",
              tds_rate: "",
              tcs_rate: "",
              sur_rate: "",
              weight: "",
              bank_ac: "",
              narration: "",
              subname: "",
              subaddress: "",
              subcity: "",
              subgstNo: "",
              payLimit:0,
              payDuedays:0,
              graceDays:0,
              sortingindex:"",
              qtyBsheet:"",
              discount:0,
              Terms:"",
              tradingAc:"",
              prefixPurInvoice:"",
              status:"",
              ward:"",
              areacode:"",
              aoType:"",
              rangecode:"",
              aoNo:"",
          };
              // Set the empty data
          setFormData(emptyFormData);
          setData1({ formData: emptyFormData}); // Store empty data
          setIndex(0);
      }finally {
      // ✅ Mark API load complete so typing now triggers checks
      setInitialLoadDone(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

    useEffect(() => {
      const handleEsc = (e) => {
        if (e.key === "Escape" && ledgerId) {
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

  const handleFetchData = async () => {
    if (!formData.gstNo) {
      alert("Please enter GST Number!");
      return;
    }
    try {
      const response = await axios.get(`https://www.shkunweb.com/shkunlive/gstsearchshkun2025?gstin=${formData.gstNo}&gst_no=${formData.gstNo}`);
      const data = response.data;
      // Filtering data by GST number
      if (data.gstin === formData.gstNo) {
        setFormData({
          ...formData,
          gstNo: data.gstin || "",
          ahead: data.tradeNam || "",
          add1: data.pradr?.addr?.bno+","  +  data.pradr?.addr?.st || "",
          city: data.pradr?.addr?.loc || "",
          state: data.pradr?.addr?.stcd || "",
          pinCode: data.pradr?.addr?.pncd || "",
          distt: data.pradr?.addr?.dst || "",
          cperson: data.lgnm || "",
        });
      } else {
        alert("No data found for the entered GST Number!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching data.");
    }
  };

  const fetchVoucherNumbers = async () => {
    try {
      const res = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/ledgerAccount/last-acode`
      );

      return {
        lastAcode: res?.data?.lastAcode || 0,
        nextAcode: res?.data?.nextAcode || 1,
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
    // console.log(data1._id);
    try {
      if (data1) {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount/next/${data1._id}`
        );
        if (response.status === 200 && response.data) {
          const nextData = response.data.data;
          setData1(response.data.data);
          setIndex(index + 1);
          setFormData(nextData.formData);
          setIsDisabled(true);
          setTitle("VIEW");
        }
      }
    } catch (error) {
      console.error("Error fetching next record:", error);
    }
  };

  const handlePrevious = async () => {
    document.body.style.backgroundColor = "white";
    try {
      if (data1) {
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount/previous/${data1._id}`);
        if (response.status === 200 && response.data) {
          console.log(response);
          setData1(response.data.data);
          const prevData = response.data.data;
          setIndex(index - 1);
          setFormData(prevData.formData);
          setIsDisabled(true);
          setTitle("VIEW");
        }
      }
    } catch (error) {
      console.error("Error fetching previous record:", error);
    }
  };

  const handleFirst = async () => {
    document.body.style.backgroundColor = "white";
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount/first`
      );
      if (response.status === 200 && response.data) {
        const firstData = response.data.data;
        setIndex(0);
        setFormData(firstData.formData);
        setData1(response.data.data);
        setIsDisabled(true);
        setTitle("(VIEW)");
      }
    } catch (error) {
      console.error("Error fetching first record:", error);
    }
  };

  const handleLast = async () => {
    document.body.style.backgroundColor = "white";
    try {
      const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount/last`);
      if (response.status === 200 && response.data) {
        const lastData = response.data.data;
        const lastIndex = response.data.length - 1;
        setIndex(lastIndex);
        setFormData(lastData.formData);
        setData1(response.data.data);
        setIsDisabled(true);
        setTitle("VIEW");
      }
    } catch (error) {
      console.error("Error fetching last record:", error);
    }
  };
  
  const handleAdd = async () => {
    setShowModal(true);
    setTitle("NEW");
    try {
      const voucherData = await fetchVoucherNumbers();
      if (!voucherData) return;

      const lastvoucherno = voucherData.nextAcode;
      const newData = {
        Bsgroup: "",
        Bscode:"",
        acode: lastvoucherno,
        gstNo: "",
        ahead: "",
        add1: "",
        add2:"",
        city: "",
        state: "",
        distance: "",
        pinCode: "",
        distt: "",
        opening_dr: "",
        opening_cr: "",
        msmed: "",
        phone: "",
        email: "",
        area: "",
        agent: "",
        group: "",
        pan: "",
        tcs206: "",
        tds194q: "",
        tdsno: "",
        wahead: "",
        wadd1: "",
        wadd2: "",
        Rc: "",
        Ecc: "",
        erange: "",
        collc: "",
        srvno: "",
        cperson: "",
        irate: "",
        tds_rate: "",
        tcs_rate: "",
        sur_rate: "",
        weight: "",
        bank_ac: "",
        narration: "",
        subname: "",
        subaddress: "",
        subcity: "",
        subgstNo: "",
        payLimit:0,
        payDuedays:0,
        graceDays:0,
        sortingindex:"",
        qtyBsheet:"",
        discount:0,
        Terms:"",
        tradingAc:"",
        prefixPurInvoice:"",
        status:"",
        ward:"",
        areacode:"",
        aoType:"",
        rangecode:"",
        aoNo:"",
      };
      setData([...data, newData]);
      setFormData(newData);
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
      setIsFetchEnabled(true);
      setIsSubMasterEnabled(true);
      setIsDisabled(false);
      setIsEditMode(true);
    } catch (error) {
        console.error("Error adding new entry:", error);
    }
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const HandleValueChange = (event) => {
    const { id, value } = event.target;
    const isDuplicate = existingpanList.includes(value);
    if (isDuplicate) {
      toast.error("PAN No Already Exists !!", {
        position: "top-center", // or "bottom-center"
      });
    }
    setFormData((prevData) => ({
      ...prevData,
      [id]:  capitalizeWords(value),
    }));
  };

   const [initialLoadDone, setInitialLoadDone] = useState(false);
   
  const handleValueChange = (field) => (event, newValue, reason) => {
    // Skip during initial API set
    if (!initialLoadDone) {
      return setFormData((prev) => ({ ...prev, [field]: capitalizeWords(newValue) || "" }));
    }

    // Only check duplicates for ahead field & when user actually sets a value
    if (field === "ahead" && newValue && reason !== "clear" && reason !== "reset") {
      const existingAheadList = ledgerData
        .map((item) => item.ahead?.toLowerCase())
        .filter(Boolean);

      if (existingAheadList.includes(newValue.toLowerCase())) {
        toast.error(`"${newValue}" already exists!`, {
          position: "top-center",
          autoClose: 2000,
        });
      }
    }

    setFormData((prev) => ({ ...prev, [field]: capitalizeWords(newValue) || "" }));
  };

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
    "575a65",
  ];
  const [buttonColors, setButtonColors] = useState(initialColors); // Initial colors

  const [formDataDialog, setFormDataDialog] = useState({
    subname: "",
    subaddress: "",
    subcity: "",
    subgstNo: "",

    // Add more fields as needed
  });
 
  const handlechangeStatus = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      msmed: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleTurnover = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      tds194q: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleApproved = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      tcs206: value, // Update the ratecalculate field in FormData
    }));
  };
  const handlePosition = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      narration: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleQtyBsheet = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      qtyBsheet: value, // Update the ratecalculate field in FormData
    }));
  };
    const handlestatus = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      status: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleFormSubmit = async () => {
    const jsonData2 = await JSON.stringify(formDataDialog);
    await console.log(jsonData2);
    // Close the dialog after submitting the form
    handleClose();
  };

  // GST Validation
  const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  const [isGstValid, setIsGstValid] = useState(true);

  const stateCodes = {
    "01": "Jammu & Kashmir",
    "02": "Himachal Pradesh",
    "03": "Punjab",
    "04": "Chandigarh",
    "05": "Uttarakhand",
    "06": "Haryana",
    "07": "Delhi",
    "08": "Rajasthan",
    "09": "Uttar Pradesh",
    "10": "Bihar",
    "11": "Sikkim",
    "12": "Arunachal Pradesh",
    "13": "Nagaland",
    "14": "Manipur",
    "15": "Mizoram",
    "16": "Tripura",
    "17": "Meghalaya",
    "18": "Assam",
    "19": "West Bengal",
    "20": "Jharkhand",
    "21": "Odisha",
    "22": "Chhattisgarh",
    "23": "Madhya Pradesh",
    "24": "Gujarat",
    "25": "Daman and Diu",
    "26": "Dadra and Nagar Haveli",
    "27": "Maharashtra",
    "28": "Andhra Pradesh",
    "29": "Karnataka",
    "30": "Goa",
    "31": "Lakshadweep",
    "32": "Kerala",
    "33": "Tamil Nadu",
    "34": "Puducherry",
    "35": "Andaman & Nicobar Islands",
    "36": "Telangana",
    "37": "Andhra Pradesh (New)",
    "38": "Ladakh",
    " " : "Export"
  };

  // Restrict invalid key presses
  const handleKeyPress = (e) => {
    const { value } = e.target;
    const char = e.key.toUpperCase();
    const pos = value.length;

    const validPattern = [
      /^[0-9]$/,            // 1st & 2nd: Digits
      /^[0-9]$/,
      /^[A-Z]$/,            // 3rd to 7th: Alphabets
      /^[A-Z]$/,
      /^[A-Z]$/,
      /^[A-Z]$/,
      /^[A-Z]$/,
      /^[0-9]$/,            // 8th to 11th: Digits
      /^[0-9]$/,
      /^[0-9]$/,
      /^[0-9]$/,
      /^[A-Z]$/,            // 12th: Alphabet
      /^[1-9A-Z]$/,         // 13th: Alphanumeric (1-9, A-Z)
      /^Z$/,                // 14th: Always 'Z'
      /^[0-9A-Z]$/          // 15th: Alphanumeric (0-9, A-Z)
    ];

    if (pos < 15 && !validPattern[pos].test(char)) {
      e.preventDefault(); // Block invalid characters
    }
  };

  const handleChangeGst = (e) => {
    let value = e.target.value.toUpperCase(); // Force uppercase
    if (value.length > 15) return; // Restrict length

    const isValid = GST_REGEX.test(value);  
    const isDuplicate = existingGstList.includes(value);
    setIsGstValid(isValid);

    let updatedState = "";
    let extractedPan = "";

    if (value.length >= 2) {
      const stateCode = value.slice(0, 2);
      updatedState = stateCodes[stateCode] || "";
    }

    // Extract PAN when GST is valid
    if (value.length === 15 && isValid) {
      extractedPan = value.substring(2, 12); // PAN is from 3rd to 12th character
    }

    setFormData((prev) => ({
      ...prev,
      gstNo: value,
      state: updatedState,
      pan: extractedPan,
    }));

    // Show toast only if value is fully entered (15 chars)
    if (value.length === 15) {
      if (isDuplicate) {
        toast.error("GST No Already Exists !!", {
          position: "top-center", // or "bottom-center"
        });
      }
    }

  };

  const handlechangeState = (event) => {
    const selectedState = event.target.value;
    const gstStateCode = formData.gstNo?.slice(0, 2); // Extract state code from GST
    
    // Allow "Export" to be selected manually
    if (selectedState === "Export") {
      setFormData((prevState) => ({
        ...prevState,
        state: selectedState,
      }));
      return;
    }
  
    // If GST code is empty or invalid, allow any state selection
    if (!gstStateCode || !stateCodes[gstStateCode]) {
      setFormData((prevState) => ({
        ...prevState,
        state: selectedState,
      }));
      return;
    }
  
    // Prevent wrong state selection if GST code is present and valid
    if (stateCodes[gstStateCode] !== selectedState) {
      toast.error("State does not match GST Number!", { autoClose: 2000 });
      return;
    }
  
    setFormData((prevState) => ({
      ...prevState,
      state: selectedState,
    }));
  };
  
  const [fileInputKey, setFileInputKey] = useState(0);
  const [open, setOpen] = useState(false);

  const handleSaveClick = async () => {
    document.body.style.backgroundColor = "white";
    let isDataSaved = false;
  
    try {
      const isValid = formData.ahead.trim() !== ""; // Ensure no empty spaces
      if (!isValid) {
        toast.error("Please Fill the Account Name", {
          position: "top-center",
        });
        return; // Prevent save operation
      }
      // const isState = formData.state.trim() !== ""; // Ensure no empty spaces
      // if (!isState) {
      //   toast.error("Please Fill the State Name", {
      //     position: "top-center",
      //   });
      //   return; // Prevent save operation
      // }
  
      const combinedData = {
        _id: formData._id,
        formData: { ...formData }, // Simplified merging
      };
  
      console.log("Combined Data:", combinedData);
  
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount${isAbcmode ? `/${data1._id}` : ""}`;
      const method = isAbcmode ? "put" : "post";
  
      const response = await axios({
        method,
        url: apiEndpoint,
        data: combinedData,
      });
  
      if (response.status === 200 || response.status === 201) {
        // fetchData();
        isDataSaved = true;
        await fetchLedgerAccounts(); // 🔥 refresh options immediately
        // ---------->>>>
        if (onRefresh) await onRefresh();
        // if (onClose) onClose();
        // ----------<<<<
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.", {
        position: "top-center",
      });
    } finally {
      // Only handle button states if user confirmed and data was attempted to be saved
      if (isDataSaved) {
        setIsSubmitEnabled(false); // Disable after successful save
        setIsAddEnabled(true);
        setIsPreviousEnabled(true);
        setIsNextEnabled(true);
        setIsFirstEnabled(true);
        setIsLastEnabled(true);
        setIsSPrintEnabled(true);
        setIsSearchEnabled(true);
        setIsDeleteEnabled(true);
        setIsDisabled(true);
        setIsEditMode(false);
        setTitle("VIEW");
        toast.success("Data Saved Successfully!", { position: "top-center" });
      } 
      // Remove else block to avoid changing button states when user cancels
    }
  };
  
  const handleEditClick = () => {
    setTitle("EDIT");
    setIsDisabled(false); // Enable fields when editing
    setIsEditMode(true); // Enter edit mode when editing
    setIsAddEnabled(false);
    setIsSubmitEnabled(true); // Enable the Save button when in edit mode
    setIsPreviousEnabled(false);
    setIsNextEnabled(false);
    setIsFirstEnabled(false);
    setIsLastEnabled(false);
    setIsSearchEnabled(false);
    setIsSPrintEnabled(false);
    setIsDeleteEnabled(false);
    setIsFetchEnabled(true);
    setIsSubMasterEnabled(true);
    setIsAbcmode(true);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

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
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount/${data1._id}`;
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
    } finally {
    }
  };
  const handleExit = async () => {
    setTitle("VIEW");
    setIsAddEnabled(true); // Enable "Add" button
    setIsSubmitEnabled(false);
    try {
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/ledgerAccount/last`); // Fetch the latest data
        if (response.status === 200 && response.data.data) {
            // If data is available
            const lastEntry = response.data.data;
            const lastIndex = response.data.length - 1;
            setFormData(lastEntry.formData); // Set form data
            setData1(response.data.data);
            setIndex(lastIndex);
            setIsDisabled(true); // Disable fields after loading the data
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
            // If no data is available, initialize with default values
            console.log("No data available");
            const newData = {
          Bsgroup: "",
          Bscode:"",
          acode: "",
          gstNo: "",
          ahead: "",
          add1: "",
          add2:"",
          city: "",
          state: "",
          distance: "",
          pinCode: "",
          distt: "",
          opening_dr: "",
          opening_cr: "",
          msmed: "",
          phone: "",
          email: "",
          area: "",
          agent: "",
          group: "",
          pan: "",
          tcs206: "",
          tds194q: "",
          tdsno: "",
          wahead: "",
          wadd1: "",
          wadd2: "",
          Rc: "",
          Ecc: "",
          erange: "",
          collc: "",
          srvno: "",
          cperson: "",
          irate: "",
          tds_rate: "",
          tcs_rate: "",
          sur_rate: "",
          weight: "",
          bank_ac: "",
          narration: "",
          subname: "",
          subaddress: "",
          subcity: "",
          subgstNo: "",
          payLimit:0,
          payDuedays:0,
          graceDays:0,
          sortingindex:"",
          qtyBsheet:"",
          discount:0,
          Terms:"",
          tradingAc:"",
          prefixPurInvoice:"",
          status:"",
          ward:"",
          areacode:"",
          aoType:"",
          rangecode:"",
          aoNo:"",
            };
            setFormData(newData); // Set default form data
            setIsDisabled(true); // Disable fields after loading the default data
        }
    } catch (error) {
        console.error("Error fetching data", error);
    }
  };
 
  // FILEPICKER
  const { openFilePicker, filesContent, loading } = useFilePicker({
    key: fileInputKey,
    accept: ".txt",
  });
  const resetFilePicker = () => {
    setFileInputKey(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleInputChange = async (event) => {
    const { name, value } = event.target;
    const numberValue = value.replace(/[^0-9]/g, ""); // Only allow numbers

    const isDuplicate = existingTdsList.includes(numberValue);
    if (isDuplicate) {
      toast.error("TDS No Already Exists !!", {
        position: "top-center", // or "bottom-center"
      });
    }
    const isDuplicateAd = existingAdharList.includes(numberValue);
    if (isDuplicateAd) {
      toast.error("Adhar No Already Exists !!", {
        position: "top-center", // or "bottom-center"
      });
    }
    const isDuplicateAccNo = existingAccList.includes(numberValue);
    if (isDuplicateAccNo) {
      toast.error("Account No Already Exists !!", {
        position: "top-center", // or "bottom-center"
      });
    }
    setFormData((prevState) => ({
      ...prevState,
      [name]: numberValue,
    }));

    // // Trigger API call when pincode length reaches 6
    // if (name === "pinCode" && numberValue.length === 6) {
    //   fetchDistrictByPincode(numberValue);
    // }
  };

  const handleAutoChange = (field) => (event, newValue) => {
    const cleanValue =
      field === "pinCode"
        ? (newValue || "").replace(/[^0-9]/g, "")
        : newValue || "";

    setFormData((prev) => ({
      ...prev,
      [field]:  capitalizeWords(cleanValue),
    }));

    if (field === "pinCode" && cleanValue.length === 6) {
      fetchDistrictByPincode(cleanValue);
    }
  };

  const fetchDistrictByPincode = async (pincode) => {
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const postOfficeData = response.data[0].PostOffice;

      if (postOfficeData && postOfficeData.length > 0) {
        setFormData((prevState) => ({
          ...prevState,
          distt: postOfficeData[0].District,
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          distt: "Invalid Pincode",
        }));
      }
    } catch (error) {
      console.error("Error fetching district:", error);
      setFormData((prevState) => ({
        ...prevState,
        distt: "Error fetching data",
      }));
    }
  };

  const handlePanChange = (event) => {
    const { name, value } = event.target;
    const panValue = value.toUpperCase().replace(/[^A-Z0-9]/g, ""); // Convert to uppercase and remove non-alphanumeric characters
    setFormData((prevState) => ({
      ...prevState,
      [name]: panValue,
    }));
  };
  const handleBlur = (event) => {
    const { name, value } = event.target;
    // Validate PAN format on blur
    if (value && !/^[A-Z]{5}\d{4}[A-Z]{1}$/i.test(value)) {
      toast.error("Please enter a Valid Pan Number", {
        position: "top-center",
      });
      setFormData((prevState) => ({
        ...prevState,
        [name]: "",
      }));
    }
  };
    // Handle Enter key to move focus to the next enabled input
    const handleKeyDown = (e, index) => {
      if (toastOpen && (e.key === "Tab" || e.key === "Enter")) {
        e.preventDefault();
        return;
      }

      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();

        // 🔥 Special case:
        // If group is Balance sheet AND current field is A/C NAME (index 1)
        if (formData.group !== "Balance Sheet" && index === 1) {
          inputRefs.current[29]?.focus(); // Jump directly to irate
          return;
        }

        let nextIndex = index + 1;

        while (
          inputRefs.current[nextIndex] &&
          inputRefs.current[nextIndex].disabled
        ) {
          nextIndex += 1;
        }

        inputRefs.current[nextIndex]?.focus();
      }

      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();

        let prevIndex = index - 1;

        while (
          inputRefs.current[prevIndex] &&
          inputRefs.current[prevIndex].disabled
        ) {
          prevIndex -= 1;
        }

        inputRefs.current[prevIndex]?.focus();
      }
    };

    // const handleKeyDown = (e, index) => {
    //   // If toast is open, prevent focus movement
    //   if (toastOpen && (e.key === "Tab" || e.key === "Enter")) {
    //     e.preventDefault();
    //     return;
    //   }

    //   if (e.key === "Enter" || e.key === "Tab") {
    //     e.preventDefault();
    //     let nextIndex = index + 1;

    //     while (inputRefs.current[nextIndex] && inputRefs.current[nextIndex].disabled) {
    //       nextIndex += 1;
    //     }

    //     const nextInput = inputRefs.current[nextIndex];
    //     if (nextInput) {
    //       nextInput.focus();
    //     }
    //   }

    //   if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    //     e.preventDefault();
    //     let prevIndex = index - 1;

    //     while (inputRefs.current[prevIndex] && inputRefs.current[prevIndex].disabled) {
    //       prevIndex -= 1;
    //     }

    //     const prevInput = inputRefs.current[prevIndex];
    //     if (prevInput) {
    //       prevInput.focus();
    //     }
    //   }
    // };
    const handleNumericValue = (event) => {
      const { id, value } = event.target;

      // Allow only numeric values with optional decimal
      if (/^\d*\.?\d*$/.test(value) || value === "") {
        // Only check duplicates if we have a list loaded
        if (value && existingAcCodeList.length > 0) {
          const isDuplicate = existingAcCodeList.includes(value);
          if (isDuplicate) {
            toast.error("Ac Code Already Exists !!", {
              position: "top-center",
            });
            return; // stop further execution
          }
        }

        // If valid and not duplicate, update state
        setFormData((prevData) => ({
          ...prevData,
          [id]: value,
        }));
      }
    };

    const validateEmail = (e) => {
      const email = e.target.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email validation pattern
    
      // Show toast only if there's input and it's invalid
      if (email !== "" && !emailRegex.test(email)) {
        toast.error("Email format is not correct", {
          position: "top-center",
        });
      }
    };

    const handleRateBlur = (field) => {
      const decimalPlaces = decimalValue; 
      let value = parseFloat(formData[field]);
    
      if (isNaN(value)) {
        setFormData((prev) => ({ ...prev, [field]: "" })); // Keep empty if NaN
      } else {
        setFormData((prev) => ({ ...prev, [field]: value.toFixed(decimalPlaces) }));
      }
    };

    const handleBlurGst = () => {
      if (formData.gstNo.length > 0 && formData.gstNo.length < 15) {
        setToastOpen(true); // Block focus movement
        toast.error(
          <div style={{ textAlign: "center" }}>
            <p>GST Number is Not Valid!</p>
            <button
              onClick={() => {
                toast.dismiss();
                setToastOpen(false); // Allow focus movement again
                inputRefs.current[0]?.focus();
              }}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
                borderRadius: "4px",
                marginTop: "5px",
              }}
            >
              OK
            </button>
          </div>,
          {
            autoClose: false,
            closeOnClick: false,
            position: "top-center",
          }
        );
      }
    };
    
    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageSrc(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

const handleAttachClick = () => {
  fileInputRef.current.click(); // manually trigger file input
};

  return (
    <div>
      <h1
        className="heading"
        style={{
          fontWeight:'bold',
          marginTop: -35,
          letterSpacing: 10,
          fontSize: 30,
          textAlign:'center'
        }}
      >
        {formData.Bsgroup}
      </h1>
      <div>
        <div>
          <ToastContainer style={{ width: "30%" }} />
        </div>
        {/* <div style={{ display: "flex", flexDirection: "row",width:"90%",marginLeft:"5%"}}> */}
        <div class="Container">
          {/* First Half Screen */}
          <div className="FirstSec">
            <div style={{display:'flex',flexDirection:'row',alignItems:'center'}}>
            <TextField
            className="custom-bordered-input"
            id="acode"
            value={formData.acode}
            variant="filled"
            size="small"
            label="A/C CODE"
            // onChange={handleNumericValue}
            inputProps={{
              maxLength: 48,
              style: {
                height: "15px",
                fontSize: 16,
                width: "120px",
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
          />
          <div style={{marginLeft:20}}>
             <span className="text-black-500 font-semibold text-base sm:text-lg">
                {title}
             </span>
          </div>
          </div>
          <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            label="GST No"
            variant="filled"
            size="small"
            value={formData.gstNo}
            onChange={handleChangeGst}
            onBlur={handleBlurGst}
            error={!isGstValid}
            helperText={!isGstValid ? "Invalid GST No" : ""}
            inputRef={(el) => (inputRefs.current[0] = el)}
            onKeyDown={(e) => handleKeyDown(e, 0)}
            onKeyPress={handleKeyPress}
            inputProps={{
              readOnly: !isEditMode || isDisabled,
              style: {
                height: "15px",
                fontSize: 16,
              },
            }}
            sx={{ width: 370 }}
          />
          <div>
          <Button
            className="back"
            style={{
              width:100,
              marginLeft:2,
              marginTop:2
              }}
              disabled={!isFetchEnabled}
            onClick={handleFetchData}
          >
            FetchData
          </Button>
          <Button
            className="back"
            style={{
            width:98,
            marginTop:2,
            marginLeft:8,
            }}
            disabled={!isSubMasterEnabled}
            onClick={handleClickOpen}
          >
          SubMaster
          </Button>
          <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          PaperProps={{
            style: {
              borderRadius: 20, // Add border radius here
              border:"2px solid black",
              width:"60%",
            },
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DialogTitle
              // className="headerBack"
              style={{
                marginTop: 10,
                textAlign: "center",
                fontSize: 30,
              }}
            >
              {"SUB-MASTER"}
            </DialogTitle>
          </div>
          <DialogContent>
            <DialogContentText>
            </DialogContentText>
            <div
              className="DialogInput"
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: 20,
              }}
            >
              <div style={{display:'flex',flexDirection:'row'}}>
                <text style={{fontSize:20}}>Name:</text>
              <input
                  className="form-control"
                  style={{
                    marginLeft: 25,
                    width:"100%"
                  }}
                  id="subname"
                  value={formData.subname}
                  onChange={HandleValueChange}
                  margin="dense"
                />
              </div>
              <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
              <text style={{fontSize:20}}>Address:</text>
              <input
                  className="form-control"
                  style={{
                    marginLeft: 5,
                      width:"100%"
                  }}
                  id="subaddress"
                  value={formData.subaddress}
                  onChange={HandleValueChange}
                  margin="dense"
                />
                </div>
                <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
                <text style={{fontSize:20}}>City:</text>
                <input
                  className="form-control"
                  style={{
                    marginLeft: 43,
                      width:"100%"
                  }}
                  id="subcity"
                  value={formData.subcity}
                  onChange={HandleValueChange}
                  margin="dense"
                />
                </div>
                <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
                <text style={{fontSize:20}}>GSTNo:</text>
                <input
                  className="form-control"
                  style={{
                    marginLeft: 14,
                      width:"100%"
                  }}
                  id="subgstNo"
                  value={formData.subgstNo}
                  onChange={HandleValueChange}
                  margin="dense"
                />
                  </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              style={{
                backgroundColor: "#DC143C",
                color: "black",
                border:"transparent",
                width:200
              }}
            >
              Disagree
            </Button>
            <Button
              onClick={handleFormSubmit}
              style={{
                backgroundColor: "#8FBC8F",
                color: "black",
                marginRight: "15%",
                  border:"transparent",
                  width:200
              }}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
          </div>
          </div>
          <div style={{marginTop:2}}>
          <Autocomplete
          freeSolo
          disableClearable
          options={isEditMode && !isDisabled ? getUniqueValues("ahead") : []}
          value={formData.ahead}
          onInputChange={handleValueChange("ahead")}
          renderInput={(params) => (
            <TextField
              {...params}
              className="custom-bordered-input"
              id="ahead"
              variant="filled"
              size="small"
              label="A/C NAME"
              inputRef={(el) => (inputRefs.current[1] = el)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
              inputProps={{
                ...params.inputProps,
                maxLength: 48,
                style: {
                  height: "15px",
                  fontSize: 16,
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 580 }}
            />
          )}
          />
            {/* <TextField
            className="custom-bordered-input"
            id="ahead"
            value={formData.ahead}
            variant="filled"
            size="small"
            label="A/C NAME"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[1] = el)}
            onKeyDown={(e) => handleKeyDown(e, 1)} // Handle Enter key
            inputProps={{
              maxLength: 48,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 580 }}
          /> */}
          </div>
          <div  style={{marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            id="add1"
            value={formData.add1}
            variant="filled"
            size="small"
            label="ADDRESS"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[2] = el)}
            onKeyDown={(e) => handleKeyDown(e, 2)} // Handle Enter key
            inputProps={{
              maxLength: 48,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 580 }}
          />
          </div>
          <div  style={{marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            id="add2"
            value={formData.add2}
            variant="filled"
            size="small"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[3] = el)}
            onKeyDown={(e) => handleKeyDown(e, 3)} // Handle Enter key
            inputProps={{
              maxLength: 48,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 580 }}
          />
          </div>
          <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
            <div>
              <Autocomplete
                freeSolo
                disableClearable
                options={isEditMode && !isDisabled ? getUniqueValues("city") : []}
                // options={getUniqueValues("city")}
                value={formData.city}
                onInputChange={handleAutoChange("city")}
                renderInput={(params) => (
                  <TextField
                   className="custom-bordered-input"
                    {...params}
                    label="CITY"
                    variant="filled"
                    size="small"
                    inputRef={(el) => (inputRefs.current[4] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 4)} // Handle Enter key
                    inputProps={{
                      ...params.inputProps,
                      maxLength: 48,
                      style: { height: "15px", fontSize: 16 },
                      readOnly: !isEditMode || isDisabled
                    }}
                    sx={{ width: 300 }}
                  />
                )}
              />
            {/* <TextField
            className="custom-bordered-input"
            id="city"
            value={formData.city}
            variant="filled"
            size="small"
            label="CITY"
            onChange={handleAlphabetOnly}
            inputRef={(el) => (inputRefs.current[3] = el)}
            onKeyDown={(e) => handleKeyDown(e, 3)} // Handle Enter key
            inputProps={{
              maxLength: 48,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 300 }}
            /> */}
            </div>
            <div>
            <Autocomplete
              freeSolo
              disableClearable
              options={isEditMode && !isDisabled ? getUniqueValues("pinCode") : []}
              // options={getUniqueValues("pinCode")}
              value={formData.pinCode}
              onInputChange={handleAutoChange("pinCode")}
              renderInput={(params) => (
                <TextField
                className="custom-bordered-input"
                  {...params}
                  label="PIN CODE"
                  variant="filled"
                  size="small"
                  inputRef={(el) => (inputRefs.current[5] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 5)} // Handle Enter key
                  inputProps={{
                    ...params.inputProps,
                    maxLength: 6,
                    style: { height: "15px", fontSize: 16 },
                    readOnly: !isEditMode || isDisabled
                  }}
                  
                  sx={{ width: 150 }}
                />
              )}
            />
              {/* <TextField
              className="custom-bordered-input"
              name="pinCode"
              value={formData.pinCode}
              variant="filled"
              size="small"
              label="PIN CODE"
              onChange={handleInputChange}
              inputRef={(el) => (inputRefs.current[4] = el)}
              onKeyDown={(e) => handleKeyDown(e, 4)} // Handle Enter key
              inputProps={{
                maxLength: 6,
                style: {
                  height: "15px", 
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled
              }}
              sx={{ width: 150 }}
            /> */}
            </div>
            <TextField
            className="custom-bordered-input"
            id="distance"
            value={formData.distance}
            variant="filled"
            size="small"
            label="DISTANCE"
            onChange={handleNumericValue}
            inputRef={(el) => (inputRefs.current[6] = el)}
            onKeyDown={(e) => handleKeyDown(e, 6)} // Handle Enter key
            inputProps={{
              maxLength: 48,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 130 }}
            />
          </div>
          {/* DISTT */}
          <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
          <div>
            <TextField
            className="custom-bordered-input"
            id="distt"
            value={formData.distt}
            variant="filled"
            size="small"
            label="DISTT"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[7] = el)}
            onKeyDown={(e) => handleKeyDown(e, 7)} // Handle Enter key
            inputProps={{
              maxLength: 48,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 300 }}
          />
          </div>
          <div>
          <FormControl
            className="custom-bordered-input"
            fullWidth
            size="small"
            variant="filled"
            sx={{ minWidth: 280 }}
          >
            <InputLabel
              id="state-label"
              sx={{
                color: formData.state ? "black" : "gray",
              }}
            >
              State
            </InputLabel>

            <Select
              className="custom-bordered-input"
              labelId="state-label"
              id="state"
              name="state"
              value={formData.state}
              onChange={(e) => {
                if (!isEditMode || isDisabled) return;
                handlechangeState(e);
              }}
              onOpen={(e) => {
                if (!isEditMode || isDisabled) {
                  e.preventDefault();
                }
              }}
              inputRef={(el) => (inputRefs.current[8] = el)}
              onKeyDown={(e) => handleKeyDown(e, 8)} // Handle Enter key
              label="State"
              sx={{
                backgroundColor: (!isEditMode || isDisabled) ? "#f0f0f0" : "white",
                pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto",
                fontSize: 16,
                color: formData.state ? "black" : "gray",
                height: "42px",
              }}
              MenuProps={{
                sx: {
                  zIndex: 200000,   // <<< FIX: dropdown above modal
                },
                PaperProps: {
                  sx: {
                    zIndex: 200000, // <<< also set for the menu paper
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>Select State</em>
              </MenuItem>

              {Object.values(stateCodes).map((state, index) => (
                <MenuItem key={index} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          </div>
          </div>
          <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            id="opening_dr"
            label="OPENING DR"
            variant="filled"
            size="small"
            fullWidth
            inputRef={(el) => (inputRefs.current[9] = el)}
            onKeyDown={(e) => handleKeyDown(e, 9)}
            value={formData.opening_dr}
            onChange={handleNumericValue}
            onBlur={() => handleRateBlur("opening_dr")}
            inputProps={{
              maxLength: 15,
              readOnly: !isEditMode || isDisabled,
              style: {
                height: "15px",
                fontSize: 16,
              },
            }}
            sx={{ width: 300 }}
            disabled={parseFloat(formData.opening_cr) > 0}
          />
          <TextField
            className="custom-bordered-input"
            id="opening_cr"
            label="OPENING CR"
            variant="filled"
            size="small"
            fullWidth
            inputRef={(el) => (inputRefs.current[10] = el)}
            value={formData.opening_cr}
            onChange={handleNumericValue}
            onKeyDown={(e) => handleKeyDown(e, 10)}
            onBlur={() => handleRateBlur("opening_cr")}
            inputProps={{
              maxLength: 15,
              readOnly: !isEditMode || isDisabled,
              style: {
                height: "15px",
                fontSize: 16,
              },
            }}
            sx={{ width: 280 }}
            disabled={parseFloat(formData.opening_dr) > 0}
          />
          </div>
          <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
          <div style={{width:300}}>
          <FormControl
          className="custom-bordered-input"
            fullWidth
            size="small"
            variant="filled"
            sx={{
              Width: 100,
            }}
          >
          <InputLabel id="msmed-label">MSMED Status</InputLabel>
          <Select
            className="custom-bordered-input"
            labelId="msmed-label"
            id="msmed"
            value={formData.msmed}
            onChange={(e) => {
              if (!isEditMode || isDisabled) return; // prevent changing
              handlechangeStatus(e);
            }}
            onOpen={(e) => {
              if (!isEditMode || isDisabled) {
                e.preventDefault(); // prevent dropdown opening
              }
            }}
            inputRef={(el) => (inputRefs.current[11] = el)}
            onKeyDown={(e) => handleKeyDown(e, 11)}
            label="MSMED Status"
            sx={{
              fontSize: 16,
              color: "black",
              height: "42px",
              backgroundColor: (!isEditMode || isDisabled) ? "#f0f0f0" : "white", // mimic disabled style
              pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
            }}
          >
            <MenuItem value=""> </MenuItem>
            <MenuItem value="Micro Enterprises">Micro Enterprises</MenuItem>
            <MenuItem value="Small Enterprises">Small Enterprises</MenuItem>
            <MenuItem value="Medium Enterprises">Medium Enterprises</MenuItem>
            <MenuItem value="Not Covered in MSMED">Not Covered in MSMED</MenuItem>
          </Select>
          </FormControl>
          </div>
           <TextField
            className="custom-bordered-input"
            id="area"
            value={formData.area}
            variant="filled"
            size="small"
            label="AREA"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[12] = el)}
            onKeyDown={(e) => handleKeyDown(e, 12)} // Handle Enter key
            inputProps={{
              maxLength: 48,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 280 }}
            />
          </div>
          <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
             <TextField
            className="custom-bordered-input"
            name="phone"
            value={formData.phone}
            variant="filled"
            size="small"
            label="CONTACT NO."
            onChange={handleInputChange}
            inputRef={(el) => (inputRefs.current[13] = el)}
            onKeyDown={(e) => handleKeyDown(e, 13)} // Handle Enter key
            inputProps={{
              maxLength: 10,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 300 }}
            />
            <TextField
            className="custom-bordered-input"
            id="email"
            value={formData.email}
            variant="filled"
            size="small"
            label="EMAIL"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[14] = el)}
            onKeyDown={(e) => handleKeyDown(e, 14)} // Handle Enter key
            onBlur={validateEmail}  
            inputProps={{
              maxLength: 48,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 280 }}
            />
          </div>
          <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            id="agent"
            value={formData.agent}
            variant="filled"
            size="small"
            label="AGENT"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[15] = el)}
            onKeyDown={(e) => handleKeyDown(e, 15)} // Handle Enter key
            inputProps={{
              maxLength: 10,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 300 }}
            />
            <TextField
            className="custom-bordered-input"
            id="group"
            value={formData.group}
            variant="filled"
            size="small"
            label="GROUP"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[16] = el)}
            onKeyDown={(e) => handleKeyDown(e, 16)} // Handle Enter key
            inputProps={{
              maxLength: 48,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 280 }}
            />
          </div>
          <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            id="pan"
            value={formData.pan}
            variant="filled"
            size="small"
            label="PAN NO."
            onChange={HandleValueChange}
            onBlur={handleBlur}
            inputRef={(el) => (inputRefs.current[17] = el)}
            onKeyDown={(e) => handleKeyDown(e, 17)} // Handle Enter key
            inputProps={{
              maxLength: 10,
              style: {
                height: "15px",
                fontSize: 16,
                color:'black',
                fontWeight:'bold'
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 300 }}
            readOnly={!!formData.gstNo}
            />
            <TextField
            className="custom-bordered-input"
            name="tdsno"
            value={formData.tdsno}
            variant="filled"
            size="small"
            label="TDS A/C NO."
            onChange={handleInputChange}
            inputRef={(el) => (inputRefs.current[18] = el)}
            onKeyDown={(e) => handleKeyDown(e, 18)} // Handle Enter key
            inputProps={{
              maxLength: 15,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 280 }}
            />
          </div>
          <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
          <div style={{width:300}}>
          <FormControl
          className="custom-bordered-input"
            fullWidth
            size="small"
            variant="filled"
            sx={{
              Width: 100,
            }}
          >
          <InputLabel id="tds194q-label">TURNOVER FOR 194-Q</InputLabel>
           <Select
            labelId="tds194q-label"
            id="tds194q"
            value={formData.tds194q}
            // onChange={handleTurnover}
            onChange={(e) => {
            if (!isEditMode || isDisabled) return; // prevent changing
              handleTurnover(e);
            }}
            onOpen={(e) => {
              if (!isEditMode || isDisabled) {
                e.preventDefault(); // prevent dropdown opening
              }
            }}
            inputRef={(el) => (inputRefs.current[19] = el)}
            onKeyDown={(e) => handleKeyDown(e, 19)}
            label="TURNOVER FOR 194-Q"
            sx={{
            fontSize: 16,
            color: "black", // Dropdown text color
            height: "42px",
            backgroundColor: (!isEditMode || isDisabled) ? "#f0f0f0" : "white", // mimic disabled style
            pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
          }}
          >
            <MenuItem value=""></MenuItem>
            <MenuItem value="No">Below 10 Cr</MenuItem>
            <MenuItem value="Yes">Above 10 Cr</MenuItem>
            <MenuItem value="All">All Applicable</MenuItem>
            <MenuItem value="NA">Not Applicable</MenuItem>
          </Select>
          </FormControl>
          </div>
          <div style={{width:280}}>
          <FormControl
          className="custom-bordered-input"
            fullWidth
            size="small"
            variant="filled"
            sx={{
              Width: 100,
            }}
          >
          <InputLabel id="tcs206-label">WHETHER APPROVED</InputLabel>
          <Select
              labelId="tcs206-label"
              id="tcs206"
              value={formData.tcs206}
              // onChange={handleApproved}
              onChange={(e) => {
              if (!isEditMode || isDisabled) return; // prevent changing
                handleApproved(e);
              }}
              onOpen={(e) => {
                if (!isEditMode || isDisabled) {
                  e.preventDefault(); // prevent dropdown opening
                }
              }}
              inputRef={(el) => (inputRefs.current[20] = el)}
              onKeyDown={(e) => handleKeyDown(e, 20)}
              label="WHETHER APPROVED"
              sx={{
              fontSize: 16,
              color: "black", // Dropdown text color
              height: "42px",
              backgroundColor: (!isEditMode || isDisabled) ? "#f0f0f0" : "white", // mimic disabled style
              pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
              }}
            >
              <MenuItem value=""></MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
          </Select>
          </FormControl>
          </div>
          </div>
          <div style={{marginTop:2,display:'flex', flexDirection:'row'}}>
            <TextField
            className="custom-bordered-input"
            id="wahead"
            value={formData.wahead}
            variant="filled"
            size="small"
            label="WORKS"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[21] = el)}
            onKeyDown={(e) => handleKeyDown(e, 21)} // Handle Enter key
            inputProps={{
              maxLength: 30,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: "50%" }}
            />
            <TextField
            className="custom-bordered-input"
            id="wadd1"
            value={formData.wadd1}
            variant="filled"
            size="small"
            label="NAME & ADDRESS"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[22] = el)}
            onKeyDown={(e) => handleKeyDown(e, 22)} // Handle Enter key
            inputProps={{
              maxLength: 30,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: "50%" }}
            />
          </div>
          </div>
          {/* Second Half Screen */}
          <div className="SecondSection">
            <div style={{ display: "flex", flexDirection: "row",marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            name="Rc"
            value={formData.Rc}
            variant="filled"
            size="small"
            label="A/C"
            onChange={handleInputChange}
            inputRef={(el) => (inputRefs.current[23] = el)}
            onKeyDown={(e) => handleKeyDown(e, 23)} // Handle Enter key
            inputProps={{
              maxLength: 15,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 250 }}
            />
            <TextField
            className="custom-bordered-input"
            id="Ecc"
            value={formData.Ecc}
            variant="filled"
            size="small"
            label="RTGS#"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[24] = el)}
            onKeyDown={(e) => handleKeyDown(e, 24)} // Handle Enter key
            inputProps={{
              maxLength: 15,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 250 }}
            />
            </div>
            <div style={{marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            id="erange"
            value={formData.erange}
            variant="filled"
            size="small"
            label="BANK NAME"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[25] = el)}
            onKeyDown={(e) => handleKeyDown(e, 25)} // Handle Enter key
            inputProps={{
              maxLength: 30,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 500 }}
            />
            </div>
            <div style={{ display: "flex", flexDirection: "row",marginTop:2 }}>
            <TextField
            className="custom-bordered-input"
            name="collc"
            value={formData.collc}
            variant="filled"
            size="small"
            label="ADHAR NO."
            onChange={handleInputChange}
            inputRef={(el) => (inputRefs.current[26] = el)}
            onKeyDown={(e) => handleKeyDown(e, 26)} // Handle Enter key
            inputProps={{
              maxLength: 15,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 250 }}
            />
            <TextField
            className="custom-bordered-input"
            name="srvno"
            value={formData.srvno}
            variant="filled"
            size="small"
            label="SAC CODE"
            onChange={handleInputChange}
            inputRef={(el) => (inputRefs.current[27] = el)}
            onKeyDown={(e) => handleKeyDown(e, 27)} // Handle Enter key
            inputProps={{
              maxLength: 15,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 250 }}
            />
            </div>
            <div
                style={{
                  display: "flex",
                  marginBottom: 5,
                  marginTop: 10,
                }}
              >
              <Button style={{width:500}} className="back" onClick={handleOpenMisc}>
                {" "}
                Misc. Information / Attach Image
              </Button>
              {isModalOpenMisc && (
              <div className="ModalZZ">
                <div className="Modal-contentZ">
                  <h3 className="headingEZ">MISC INFORMATION</h3>
                  <div className="MiscContainer">
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <div style={{display:'flex',flexDirection:"row"}}>
                        <text>Payment Limit:</text>
                        <input
                          className="PLimit"
                          id="payLimit"
                          value={formData.payLimit}
                          onChange={handleNumericValue}
                          ref={(el) => (inputRefs.current[35] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 35)} // Handle Enter key
                        />
                      </div>
                        <div style={{display:'flex',flexDirection:"row"}}>
                        <text>Payment Due Days:</text>
                        <input className="DueDays"
                          id="payDuedays"
                          value={formData.payDuedays}
                          onChange={handleNumericValue}
                          ref={(el) => (inputRefs.current[36] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 36)} // Handle Enter key
                        />
                      </div>
                        <div style={{display:'flex',flexDirection:"row"}}>
                        <text>Intt.Grace Days:</text>
                        <input className="Grace"
                          id="graceDays"
                          value={formData.graceDays}
                          onChange={handleNumericValue}
                          ref={(el) => (inputRefs.current[37] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 37)} // Handle Enter key
                        />
                      </div>
                        <div style={{display:'flex',flexDirection:"row"}}>
                        <text>Sorting Index No:</text>
                        <input className="Sorting"
                          id="sortingindex"
                          value={formData.sortingindex}
                          onChange={HandleValueChange}
                          ref={(el) => (inputRefs.current[38] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 38)} // Handle Enter key
                        />
                      </div>
                      <div style={{display:'flex',flexDirection:"row"}}>
                          <text>Qty in B.Sheet:</text>
                            <select
                            readOnly={!isEditMode || isDisabled}
                            className="QtyBSheet"
                            value={formData.qtyBsheet}
                            onChange={handleQtyBsheet}
                            ref={(el) => (inputRefs.current[39] = el)} // Assign ref
                            onKeyDown={(e) => handleKeyDown(e, 39)} // Handle Enter key
                          >
                            <option value=""></option>
                            <option value={"Yes"}>Yes</option>
                            <option value={"No"}>No</option>
                            <option value={"Pcs"}>Pcs</option>
                          </select>
                          </div>
                        <div style={{display:'flex',flexDirection:"row"}}>
                        <text>Discount:</text>
                        <input className="Discountz"
                          id="discount"
                          value={formData.discount}
                          onChange={handleNumericValue}
                          ref={(el) => (inputRefs.current[40] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 40)} // Handle Enter key
                        />
                      </div>
                        <div style={{display:'flex',flexDirection:"row"}}>
                        <text>Terms EX/FOR:</text>
                        <input className="EXFOR"
                          id="Terms"
                          value={formData.Terms}
                          onChange={HandleValueChange}
                          ref={(el) => (inputRefs.current[41] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 41)} // Handle Enter key
                        />
                      </div>
                        <div style={{display:'flex',flexDirection:"row"}}>
                        <text>Trading A/c No:</text>
                        <input className="Trading"
                          id="tradingAc"
                          value={formData.tradingAc}
                          onChange={HandleValueChange}
                          ref={(el) => (inputRefs.current[42] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 42)} // Handle Enter key
                        />
                      </div>
                        <div style={{display:'flex',flexDirection:"row"}}>
                        <text>Prefix Pur.Invoice:</text>
                        <input className="Prefix"
                          id="prefixPurInvoice"
                          value={formData.prefixPurInvoice}
                          onChange={HandleValueChange}
                          ref={(el) => (inputRefs.current[43] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 43)} // Handle Enter key
                        />
                      </div>
                      <text style={{color:"red",marginTop:20}}>Details for 27-C (TCS)</text>
                      <div style={{display:'flex',flexDirection:"row"}}>
                        <div style={{display:'flex',flexDirection:'column'}}>
                          <div style={{display:'flex',flexDirection:"row"}}>
                          <text>Status:</text>
                            <select
                            readOnly={!isEditMode || isDisabled}
                            className="Status"
                            value={formData.status}
                            onChange={handlestatus}
                            ref={(el) => (inputRefs.current[44] = el)} // Assign ref
                            onKeyDown={(e) => handleKeyDown(e, 44)} // Handle Enter key
                          >
                            <option value=""></option>
                            <option value={"Company"}>1.Company</option>
                            <option value={"Firm"}>2.Firm</option>
                            <option value={"AOP/BOI"}>3.AOP/BOI</option>
                            <option value={"HUF"}>4.HUF</option>
                            <option value={"Individual"}>5.Individual</option>
                            <option value={"Other"}>6.Other</option>
                          </select>
                          </div>
                          <div style={{display:'flex',flexDirection:"row"}}>
                          <text>Ward:</text>
                          <input className="Ward"
                          id="ward"
                          value={formData.ward}
                          onChange={HandleValueChange}
                          ref={(el) => (inputRefs.current[45] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 45)} // Handle Enter key
                          />
                          </div>
                        </div>
                        <div style={{display:'flex',flexDirection:"column",marginLeft:30}}>
                          <div style={{display:'flex',flexDirection:"row"}}>
                          <text>AreaCode:</text>
                          <input className="AreaCode"
                          id="areacode"
                          value={formData.areacode}
                          onChange={HandleValueChange}
                          ref={(el) => (inputRefs.current[46] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 46)} // Handle Enter key
                          />
                          </div>
                            <div style={{display:'flex',flexDirection:"row"}}>
                          <text>AOType:</text>
                          <input className="AOType"
                          id="aoType"
                          value={formData.aoType}
                          onChange={HandleValueChange}
                          ref={(el) => (inputRefs.current[47] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 47)} // Handle Enter key
                          />
                          </div>
                            <div style={{display:'flex',flexDirection:"row"}}>
                          <text>RangeCode:</text>
                          <input className="RangeCode"
                          id="rangecode"
                          value={formData.rangecode}
                          onChange={HandleValueChange}
                          ref={(el) => (inputRefs.current[48] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 48)} // Handle Enter key
                          />
                          </div>
                            <div style={{display:'flex',flexDirection:"row"}}>
                          <text>AoNo:</text>
                          <input className="AOName"
                          id="aoNo"
                          value={formData.aoNo}
                          onChange={HandleValueChange}
                          ref={(el) => (inputRefs.current[49] = el)} // Assign ref
                          onKeyDown={(e) => handleKeyDown(e, 49)} // Handle Enter key
                          />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ImageDiv" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',backgroundColor:"white" }}>
                    {imageSrc ? (
                    <img
                    src={imageSrc}
                    alt="Uploaded"
                    style={{
                      width: '600px',  // Adjust width as needed
                      height: '400px', // Adjust height as needed
                      objectFit: 'contain', // Ensures image scales without distortion
                      marginBottom: 10,
                      border: '1px solid #ccc',
                    }}
                  />

                    ) : (
                      <div style={{ marginBottom: 10, color: 'gray' }}>Attach Image Here</div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleImageChange}
                    />
                    <Button onClick={handleAttachClick} style={{ padding: '5px 10px',borderColor:"transparent",backgroundColor:"blue" }}>
                      Click here to Attach Image
                    </Button>
                  </div>
                  </div>
                  <Button 
                    ref={(el) => (inputRefs.current[50] = el)} // Assign ref
                  onKeyDown={(e) => handleKeyDown(e, 50)} // Handle Enter key
                  onClick={handlecloseMisn} style={{ borderColor: "transparent", backgroundColor: "green", marginTop: 10 }}>
                    CLOSE
                  </Button>
                </div>
              </div>
              )}
            </div> 
            <div style={{marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            id="cperson"
            value={formData.cperson}
            variant="filled"
            size="small"
            label="CONTACT PERSON"
            onChange={HandleValueChange}
            inputRef={(el) => (inputRefs.current[28] = el)}
            onKeyDown={(e) => handleKeyDown(e, 28)} // Handle Enter key
            inputProps={{
              maxLength: 40,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 500 }}
            />
            </div>  
            <div style={{marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            id="irate"
            value={formData.irate}
            variant="filled"
            size="small"
            label="INTT/DEPC.RATE"
            onChange={handleNumericValue}
            inputRef={(el) => (inputRefs.current[29] = el)}
            onKeyDown={(e) => handleKeyDown(e, 29)} // Handle Enter key
            onBlur={() => handleRateBlur("irate")}
            inputProps={{
              maxLength: 6,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 500 }}
            />
            </div>
            <div style={{marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            id="tds_rate"
            value={formData.tds_rate}
            variant="filled"
            size="small"
            label="TDS RATE"
            onChange={handleNumericValue}
            inputRef={(el) => (inputRefs.current[30] = el)}
            onKeyDown={(e) => handleKeyDown(e, 30)} // Handle Enter key
            onBlur={() => handleRateBlur("tds_rate")}
            inputProps={{
              maxLength: 6,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 500 }}
            />
            </div>
            <div style={{marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            id="tcs_rate"
            value={formData.tcs_rate}
            variant="filled"
            size="small"
            label="TCS RATE"
            onChange={handleNumericValue}
            inputRef={(el) => (inputRefs.current[31] = el)}
            onKeyDown={(e) => handleKeyDown(e, 31)} // Handle Enter key
            onBlur={() => handleRateBlur("tcs_rate")}
            inputProps={{
              maxLength: 6,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 500 }}
            />
            </div>
            <div style={{marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            id="sur_rate"
            value={formData.sur_rate}
            variant="filled"
            size="small"
            label="GST / SHARE %"
            onChange={handleNumericValue}
            inputRef={(el) => (inputRefs.current[32] = el)}
            onKeyDown={(e) => handleKeyDown(e, 32)} // Handle Enter key
            onBlur={() => handleRateBlur("sur_rate")}
            inputProps={{
              maxLength: 6,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 500 }}
            />
            </div>
            <div style={{marginTop:2}}>
            <TextField
            className="custom-bordered-input"
            id="weight"
            value={formData.weight}
            variant="filled"
            size="small"
            label="QUANTITY"
            onChange={handleNumericValue}
            inputRef={(el) => (inputRefs.current[33] = el)}
            onKeyDown={(e) => handleKeyDown(e, 33)} // Handle Enter key
            onBlur={() => handleRateBlur("weight")}
            inputProps={{
              maxLength: 6,
              style: {
                height: "15px",
                fontSize: 16,
                // padding: "0 8px"
              },
              readOnly: !isEditMode || isDisabled
            }}
            sx={{ width: 500 }}
            />
            </div>
            <div style={{width:500,marginTop:2}}>
            <FormControl
            className="custom-bordered-input"
              fullWidth
              size="small"
              variant="filled"
              sx={{
                Width: 100,
              }}
            >
            <InputLabel id="composition">COMPOSITION/RCM Y/N</InputLabel>
            <Select
              labelId="composition"
              id="narration"
              value={formData.narration}
              // onChange={handlePosition}
              onChange={(e) => {
              if (!isEditMode || isDisabled) return; // prevent changing
                handlePosition(e);
              }}
              onOpen={(e) => {
                if (!isEditMode || isDisabled) {
                  e.preventDefault(); // prevent dropdown opening
                }
              }}
              inputRef={(el) => (inputRefs.current[34] = el)}
              onKeyDown={(e) => handleKeyDown(e, 34)} // Handle Enter key
              label="COMPOSITION/RCM Y/N"
              sx={{
              fontSize: 16,
              color: "black", // Dropdown text color
              height: "42px",
              backgroundColor: (!isEditMode || isDisabled) ? "#f0f0f0" : "white", // mimic disabled style
              pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
            }}
            >
              <MenuItem value=""></MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
            </Select>
            </FormControl>
            </div>
            <div>
            </div>
          </div>
        </div>
        {/* </div> */}
        <div style={{marginTop:"1%"}} className="Buttonsgroupz">
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[0] }}
            onClick={handleAdd}
            disabled={!isAddEnabled}
          >
            Add
          </Button>
          <AnexureModal
            show={showModal}
            handleClose={() => setShowModal(false)}
            onSelect={handleSelectBsgroup} // Pass callback function
            handleExit={handleExit}
          />
          <Button
          disabled={!isAddEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[1] }}
            onClick={handleEditClick}
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
            disabled={!isSearchEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[6] }}
            onClick={() => openModalForItemCus(0)}
          >
            Search
          </Button>
          {showModalCus && (
          <ProductModalCustomer
            allFields={allFieldsCus}
            onSelect={handleProductSelectCus}
            onClose={handleCloseModalCus}
            initialKey={pressedKey}
            tenant={tenant}
          />
          )}
          <Button
            disabled={!isPrintEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[7] }}
          >
            Print
          </Button>
          <Button
            disabled={!isDeleteEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[8] }}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[9] }}
            onClick={handleExit}
          >
            Exit
          </Button>
          <div>
            <Button
              ref={(el) => (inputRefs.current[34] = el)} // Assign ref
              // onKeyDown={(e) => handleKeyDown(e, 34)} // Handle Enter key
              className="Buttonz"
              onClick={handleSaveClick}
              disabled={!isSubmitEnabled}
              style={{ color: "black", backgroundColor: buttonColors[10]}}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerAcc;
