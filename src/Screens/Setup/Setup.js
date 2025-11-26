import React, { useState, useEffect, useRef } from "react";
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
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import shkunlogo2 from "./Shkunlogo.png";

// Import modal components
import CashBankSetup from "./CashBankSetup";
import SaleSetup from "../Sale/SaleSetup";
import PurchaseSetup from "../Purchase/PurchaseSetup";
import ExciseSetup from "./ExciseSetup/ExciseSetup";
import GstSetup from "./GstSetup";
import ProductModalAccount from "../Modals/ProductModalAccount";

const DRAWER_WIDTH = 220;

const Setup = () => {
  const inputRefs = useRef([]); // Array to hold references for input fields
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("companyId");
  // const companyNameParam = searchParams.get("companyName");

  const tenantName = searchParams.get("tenantName");
  // If companyId exists, we are in update mode
  const isUpdate = Boolean(companyId);

  // Define step labels for the stepper
  const steps = [
    "Basic Info",
    "Address & Contact",
    "Financial & Registration",
    "Additional Details",
  ];
  const [activeStep, setActiveStep] = useState(0);

  // Dropdown options for state
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

  // Colors for the drawer items
  const initialColors = [
    "#E9967A",
    "#F0E68C",
    "#FFDEAD",
    "#FFCFEE",
    "#87CEFA",
    "#FFF0F5",
    "#FFC0CB",
    "#D8BFD8",
    "#ac8a21",
    "#DCDCDC",
    "#8FBC8F",
    "#c4bae2",
    "#b55182",
    "#b19fe8",
    "#DC143C",
    "#539c33",
  ];

  // Main form data state
  const [formData, setFormData] = useState({
    AdminId: "",
    unitType: "",
    Networking: false,
    Ahead: "",
    Add1: "",
    city: "",
    owner: "",
    distt: "",
    state: "",
    pin: "",
    Office: "",
    Resi: "",
    pan: "",
    tdsno: "",
    tdsCircle: "",
    style: "",
    item: "",
    Afrom: null,
    Aupto: null,
    Decimals: "",
    Email: "",
    prncode: "",
    Tcsynsale: "",
    Disp_act: "",
    Tdscode: "",
    Tdsname: "",
    Tdscode1: "",
    Tdsname1: "",
    Rc: "",
    Div: "",
    Collc: "",
    Erange: "",
    Pla: "",
    Ecc: "",
    ward: "",
    Gstno: "",
    Pfno: "",
    Esino: "",
    Cperson: "",
    Disc: "",
    Dongal: false,
  });

  // TDS arrays
  const [Tdsname, setTdsname] = useState([{ Tdsname: "" }]);
  const [Tdsname1, setTdsname1] = useState([{ Tdsname1: "" }]);

  // Ledger accounts for TDS modal selection
  const [productsTdsname, setProductsTdsname] = useState([]);
  const [productsTdsname1, setProductsTdsname1] = useState([]);
  const [showModalTdsname, setShowModalTdsname] = useState(false);
  const [showModalTdsname1, setShowModalTdsname1] = useState(false);
  const [selectedItemIndexTdsname, setSelectedItemIndexTdsname] =
    useState(null);
  const [selectedItemIndexTdsname1, setSelectedItemIndexTdsname1] =
    useState(null);
  const [loadingTdsname, setLoadingTdsname] = useState(true);
  const [loadingTdsname1, setLoadingTdsname1] = useState(true);
  const [pressedKey, setPressedKey] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(null);

  const [isSubmitEnabled, setIsSubmitEnabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);

  // Side modal states for additional setups
  const [isModalOpen, setIsModalOpen] = useState(false); // CashBankSetup
  const [isModalOpenS, setIsModalOpenS] = useState(false); // SaleSetup
  const [isModalOpenP, setIsModalOpenP] = useState(false); // PurchaseSetup
  const [isModalOpenE, setIsModalOpenE] = useState(false); // ExciseSetup
  const [isModalOpenV, setIsModalOpenV] = useState(false); // GstSetup

  // Functions to open modal states (used in drawer items)
  const openModal = () => setIsModalOpen(true);
  const openModalS = () => setIsModalOpenS(true);
  const openModalP = () => setIsModalOpenP(true);
  const openModalE = () => setIsModalOpenE(true);
  const openModalV = () => setIsModalOpenV(true);

  // Fetch company data if editing an existing company
  useEffect(() => {
    if (companyId) {
      const API_URL = "http://103.168.19.65:3012";
      const token = localStorage.getItem("token");
      console.log(`${API_URL}/${tenantName}/tenant/getcompany/${companyId}`);
      fetch(`${API_URL}/${tenantName}/tenant/getcompany/${companyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((company) => {
          if (company && !company.error) {
            setFormData((prev) => ({
              ...prev,
              Ahead: company.formData?.Ahead || "",
              Add1: company.formData?.Add1 || "",
              city: company.formData?.city || "",
              owner: company.formData?.owner || "",
              distt: company.formData?.distt || "",
              state: company.formData?.state || "",
              pin: company.formData?.pin || "",
              Office: company.formData?.Office || "",
              Resi: company.formData?.Resi || "",
              pan: company.formData?.pan || "",
              tdsno: company.formData?.tdsno || "",
              tdsCircle: company.formData?.tdsCircle || "",
              style: company.formData?.style || "",
              item: company.formData?.item || "",
              Afrom: company.formData?.Afrom
                ? new Date(company.formData?.Afrom)
                : null,
              Aupto: company.formData?.Aupto
                ? new Date(company.formData?.Aupto)
                : null,
              Decimals: company.formData?.Decimals || "",
              Email: company.formData?.Email || "",
              prncode: company.formData?.prncode || "",
              Tcsynsale: company.formData?.Tcsynsale || "",
              Disp_act: company.formData?.Disp_act || "",
              Rc: company.formData?.Rc || "",
              Div: company.formData?.Div || "",
              Collc: company.formData?.Collc || "",
              Erange: company.formData?.Erange || "",
              Pla: company.formData?.Pla || "",
              Ecc: company.formData?.Ecc || "",
              ward: company.formData?.ward || "",
              Gstno: company.formData?.Gstno || "",
              Pfno: company.formData?.Pfno || "",
              Esino: company.formData?.Esino || "",
              Cperson: company.formData?.Cperson || "",
              Disc: company.formData?.Disc || "",
              Dongal: !!company.formData?.Dongal,
            }));
            setTdsname([{ Tdsname: company.formData?.Tdsname || "" }]);
            setTdsname1([{ Tdsname1: company.formData?.Tdsname1 || "" }]);
          } else {
            console.error("No company data or error in response:", company);
          }
        })
        .catch((err) => console.error("Fetch company error:", err));
    }
  }, [companyId, tenantName]);

  // Fetch ledger accounts for TDS modals
  // useEffect(() => {
  //   const fetchCustomers = async () => {
  //     try {
  //       const response = await fetch("http://103.154.233.29:3007/auth/api/ledgerAccount");
  //       if (!response.ok) throw new Error("Failed to fetch ledger accounts");
  //       const data = await response.json();
  //       const formattedData = data.map((item) => ({
  //         ...item.formData,
  //         _id: item._id,
  //       }));
  //       setProductsTdsname(formattedData);
  //       setProductsTdsname1(formattedData);
  //       setLoadingTdsname(false);
  //       setLoadingTdsname1(false);
  //     } catch (error) {
  //       console.error(error.message);
  //       setLoadingTdsname(false);
  //       setLoadingTdsname1(false);
  //     }
  //   };
  //   fetchCustomers();
  // }, []);
  useEffect(() => {
    // kick off loading
    setLoadingTdsname(true);
    setLoadingTdsname1(true);

    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const urlTenant = tenantName; // fallback to 'auth' if tenantName missing

        const response = await fetch(
          `http://103.168.19.65:3012/${urlTenant}/auth/api/ledgerAccount`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch ledger accounts");
        }

        const data = await response.json();
        const formattedData = data.map(({ _id, formData }) => ({
          _id,
          ...formData,
        }));

        setProductsTdsname(formattedData);
        setProductsTdsname1(formattedData);
      } catch (error) {
        console.error("Ledger fetch error:", error);
      } finally {
        // turn off loading in all cases
        setLoadingTdsname(false);
        setLoadingTdsname1(false);
      }
    };

    fetchCustomers();
  }, [tenantName]);

  // Functions for TDS modals
  const handleItemChangeTdsname = (index, key, value) => {
    const updatedItems = [...Tdsname];
    if (key === "ahead") {
      const selectedProduct = productsTdsname.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Tdsname"] = selectedProduct.ahead;
      }
    }
    setTdsname(updatedItems);
  };
  const handleProductSelectTdsname = (product) => {
    if (selectedItemIndexTdsname !== null) {
      handleItemChangeTdsname(selectedItemIndexTdsname, "ahead", product.ahead);
      setShowModalTdsname(false);
    }
  };
  const openModalForItemTdsname = (index) => {
    setSelectedItemIndexTdsname(index);
    setShowModalTdsname(true);
  };

  const handleItemChangeTdsname1 = (index, key, value) => {
    const updatedItems = [...Tdsname1];
    if (key === "ahead") {
      const selectedProduct = productsTdsname1.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Tdsname1"] = selectedProduct.ahead;
      }
    }
    setTdsname1(updatedItems);
  };
  const handleProductSelectTdsname1 = (product) => {
    if (selectedItemIndexTdsname1 !== null) {
      handleItemChangeTdsname1(
        selectedItemIndexTdsname1,
        "ahead",
        product.ahead
      );
      setShowModalTdsname1(false);
    }
  };
  const openModalForItemTdsname1 = (index) => {
    setSelectedItemIndexTdsname1(index);
    setShowModalTdsname1(true);
  };

  const allFieldsTdsname = productsTdsname.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) fields.push(key);
    });
    return fields;
  }, []);
  const allFieldsTdsname1 = productsTdsname1.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) fields.push(key);
    });
    return fields;
  }, []);

  const handleOpenModal = (event, index, field) => {
    if (/^[a-zA-Z]$/.test(event.key)) {
      if (field === "Tdsname") {
        setPressedKey(event.key);
        openModalForItemTdsname(index);
        event.preventDefault();
      } else if (field === "Tdsname1") {
        setPressedKey(event.key);
        openModalForItemTdsname1(index);
        event.preventDefault();
      }
    }
  };

  // Generic change handlers
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

  const handleAlphabeticValue = (event) => {
    const { id, value } = event.target;
    // Allow letters and spaces only
    if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };

  // const handlePanChange = (event) => {
  //   const { id, value } = event.target;
  //   // Allow only uppercase letters and digits, max 10 characters
  //   if (/^[A-Z0-9]{0,10}$/.test(value) || value === "") {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [id]: value.toUpperCase(),
  //     }));
  //   }
  // };

  const handlePanChange = (event) => {
    const { id, value } = event.target;
    let newValue = value.toUpperCase();

    // Position-based PAN validation
    if (newValue.length <= 5) {
      // First 5 must be A-Z
      if (!/^[A-Z]*$/.test(newValue)) return;
    } 
    else if (newValue.length <= 9) {
      // Next 4 must be 0-9
      if (!/^[A-Z]{5}[0-9]*$/.test(newValue)) return;
    } 
    else if (newValue.length === 10) {
      // Last must be A-Z
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]?$/.test(newValue)) return;
    } 
    else {
      return; // Block beyond 10 characters
    }

    setFormData((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };


  const handleDateChange = (date, field) => {
    setFormData((prev) => ({ ...prev, [field]: date }));
  };
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };
  const handlechangeState = (event) => {
    setFormData((prev) => ({ ...prev, state: event.target.value }));
  };
  const handleBackUp = (event) => {
    setFormData((prev) => ({ ...prev, Cperson: event.target.value }));
  };
  const handleUnitType = (event) => {
    setFormData((prev) => ({ ...prev, unitType: event.target.value }));
  };

  const handleGstChange = (event) => {
    const { id, value } = event.target;
    let gst = value.toUpperCase();

    // Block if length > 15
    if (gst.length > 15) return;

    // Validate position-wise
    const pos = gst.length;

    if (pos <= 2) {
      // First 2 must be digits
      if (!/^[0-9]*$/.test(gst)) return;
    }
    else if (pos <= 7) {
      // 3rd–7th must be letters
      if (!/^[0-9]{2}[A-Z]*$/.test(gst)) return;
    }
    else if (pos <= 11) {
      // 8th–11th must be numbers
      if (!/^[0-9]{2}[A-Z]{5}[0-9]*$/.test(gst)) return;
    }
    else if (pos === 12) {
      // 12th must be alphanumeric
      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z0-9]?$/.test(gst)) return;
    }
    else if (pos === 13) {
      // 13th must be 'Z'
      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z0-9]Z?$/.test(gst)) return;
    }
    else if (pos === 14) {
      // 14th alphanumeric
      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z0-9]Z[A-Z0-9]?$/.test(gst)) return;
    }
    else if (pos === 15) {
      // 15th alphanumeric (checksum)
      if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z0-9]Z[A-Z0-9][A-Z0-9]?$/.test(gst)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [id]: gst,
    }));
  };


  const handleEmailChange = (event) => {
    const { id, value } = event.target;
    let newValue = value;

    // Block spaces
    if (/\s/.test(newValue)) return;

    // Allow only email-safe characters
    if (!/^[A-Za-z0-9@._-]*$/.test(newValue)) return;

    // Partial email validation while typing:
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    setFormData((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };


  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      let nextIndex = index + 1;

      while (
        inputRefs.current[nextIndex] &&
        inputRefs.current[nextIndex].disabled
      ) {
        nextIndex += 1;
      }

      const nextInput = inputRefs.current[nextIndex];
      if (nextInput) {
        nextInput.focus();
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      let prevIndex = index - 1;

      while (
        inputRefs.current[prevIndex] &&
        inputRefs.current[prevIndex].disabled
      ) {
        prevIndex -= 1;
      }

      const prevInput = inputRefs.current[prevIndex];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  // Background image change handler
  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (file) setBackgroundImage(URL.createObjectURL(file));
  };

  // Separate date states for submission
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [expiredDate, setexpiredDate] = useState(null);

  const handleSave = async () => {
    const AfromString = selectedDate ? selectedDate.toISOString() : "";
    const AuptoString = expiredDate ? expiredDate.toISOString() : "";
    const tdsNameFinal = Tdsname.length > 0 ? Tdsname[0].Tdsname : "";
    const tdsName1Final = Tdsname1.length > 0 ? Tdsname1[0].Tdsname1 : "";

    // Generate unique date time string (used previously, kept here if needed)
    const now = new Date();
    const dateTimeStr =
      `${now.getFullYear()}${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}` +
      `_${now.getHours().toString().padStart(2, "0")}${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}${now.getSeconds().toString().padStart(2, "0")}${now
        .getMilliseconds()
        .toString()
        .padStart(3, "0")}`;

    // Construct initial tenant name using GST number and dateTimeStr as a fallback.
    const tenantName =
      formData.Gstno && formData.Gstno.trim().length > 0
        ? encodeURIComponent(formData.Gstno.trim())
        : "shkun";

    // Helper function to format a Date as ddmmyyyy
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}${month}${year}`;
    };

    // Build the final tenant name in the format tenantname_ddmmyyyy_ddmmyyyy+1
    let finalTenantName = tenantName; // Fallback if no date is provided
    if (selectedDate) {
      const startDateStr = formatDate(selectedDate);
      // Create a new Date instance for the same day next year
      const nextYearDate = new Date(
        selectedDate.getFullYear() + 1,
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      const nextYearStr = formatDate(nextYearDate);
      finalTenantName = `${tenantName}_${startDateStr}_${nextYearStr}`;
    }

    const dataToSend = {
      name: formData.Ahead || "", // Company name is taken from formData.Ahead
      formData: {
        ...formData,
        Afrom: AfromString,
        Aupto: AuptoString,
        address: formData.Add1,
        phoneNumber: formData.Office,
        Tdsname: tdsNameFinal,
        Tdsname1: tdsName1Final,
        Gstno: formData.Gstno,
      },
    };

    const token = localStorage.getItem("token");
    // Use the finalTenantName in the API URL
    const apiUrl = `http://103.168.19.65:3012/${finalTenantName}/tenant/company`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Company created successfully", result.company);
        navigate("/companies");
      } else {
        console.error("Error:", result);
        alert(result.message || "Error in creating company");
      }
    } catch (error) {
      console.error("Server error:", error);
      alert("Server error while creating company");
    }
  };

  // Update API for existing company (you can modify the URL/method as needed)
  const handleUpdate = async () => {
    const AfromString = selectedDate ? selectedDate.toISOString() : "";
    const AuptoString = expiredDate ? expiredDate.toISOString() : "";
    const tdsNameFinal = Tdsname.length > 0 ? Tdsname[0].Tdsname : "";
    const tdsName1Final = Tdsname1.length > 0 ? Tdsname1[0].Tdsname1 : "";
    const dataToSend = {
      name: formData.Ahead || "",
      formData: {
        ...formData,
        Afrom: AfromString,
        Aupto: AuptoString,
        address: formData.Add1,
        phoneNumber: formData.Office,
        Tdsname: tdsNameFinal,
        Tdsname1: tdsName1Final,
        Gstno: formData.Gstno,
      },
    };

    const token = localStorage.getItem("token");
    const tenantName = searchParams.get("tenantName");
    const apiUrl = `http://103.168.19.65:3012/${tenantName}/tenant/company11/${companyId}`;
    alert(tenantName);

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Company updated successfully", result.company);
        navigate("/companies");
      } else {
        console.error("Error:", result);
        alert(result.message || "Error in updating company");
      }
    } catch (error) {
      console.error("Server error:", error);
      alert("Server error while updating company");
    }
  };

  // Handle submit button click based on mode (save or update)
  const handleFinalSubmit = () => {
    if (isUpdate) {
      handleUpdate();
    } else {
      handleSave();
    }
  };

  // Function to enable editing mode
  const handleEditClick = () => {
    setIsDisabled(false);
    setIsEditMode(true);
  };

  // Drawer items for side navigation
  const drawerItems = [
    { label: "ADDITIONAL  ADDRESS" },
    { label: "EXCISE SETUP", onClick: openModalE },
    // { label: "GST SETUP", onClick: openModalV },
    { label: "FACTORY ACT SETUP" },
    { label: "SALE SETUP", onClick: openModalS },
    { label: "PURCHASE SETUP", onClick: openModalP },
    { label: "CASH/BANK SETUP", onClick: openModal },
    { label: "KEY INFORMATION" },
    { label: "PC RESOLUTION" },
    // {
    //   label: "BACKGROUND IMAGE",
    //   onClick: () => document.getElementById("fileInput").click(),
    // },
    { label: "BROWSE SETUP FILE" },
    { label: "PRODUCTION SETUP" },
    { label: "CREATE LOG" },
  ];

  const drawerContent = (
    <List sx={{ py: 2 }}>
      {drawerItems.map((item, index) => (
        <ListItem disablePadding key={index}>
          <ListItemButton
            onClick={item.onClick}
            sx={{
              backgroundColor: initialColors[index % initialColors.length],
              color: "black",
              borderRadius: "4px",
              mx: 1,
              my: 0.5,
              "&:hover": {
                backgroundColor: initialColors[index % initialColors.length],
                opacity: 0.9,
              },
            }}
          >
            <ListItemText primary={item.label} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  // Modern TextField style (smaller height & reduced margin)
  const textFieldStyle = {
    mb: 1,
    "& .MuiOutlinedInput-root": {
      height: 48,
      fontSize: "0.9rem",
      borderRadius: "6px",
      backgroundColor: "#fff",
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
      "& fieldset": { borderColor: "#ccc" },
      "&:hover fieldset": { borderColor: "#999" },
      "&.Mui-focused fieldset": { borderColor: "#3f51b5", borderWidth: "2px" },
    },
  };

  // Header section with logo and title
  const headerSection = (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <img
        src={shkunlogo2}
        alt="Company Logo"
        style={{ width: "10%", height: "10%", objectFit: "cover" }}
      />
      <Typography
        variant="h4"
        sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold", ml: 2 }}
      >
        Company Details
      </Typography>
    </Box>
  );

  // Stepper content for each step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                label="COMPANY NAME"
                id="Ahead"
                fullWidth
                size="small"
                value={formData.Ahead}
                onChange={handleAlphabeticValue}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[0] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 0)} // Handle Enter key
                inputProps={{ maxLength: 80 }}   // ← LIMIT SET HERE
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="OWNER NAME"
                id="owner"
                fullWidth
                size="small"
                value={formData.owner}
                onChange={handleAlphabeticValue}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[1] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 1)} // Handle Enter key
                inputProps={{ maxLength: 80 }}   // ← LIMIT SET HERE
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                label="ADDRESS"
                id="Add1"
                fullWidth
                size="small"
                value={formData.Add1}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[2] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 2)} // Handle Enter key
                inputProps={{ maxLength: 150 }}   // ← LIMIT SET HERE
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CITY"
                id="city"
                fullWidth
                size="small"
                value={formData.city}
                onChange={handleAlphabeticValue}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[3] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 3)} // Handle Enter key
                inputProps={{ maxLength: 80 }}   // ← LIMIT SET HERE
              />
            </Grid>
            <Grid item xs={6}>
              <FormLabel sx={{ fontSize: "0.8rem" }}>STATE</FormLabel>
              <Select
                id="state"
                fullWidth
                size="small"
                value={formData.state}
                onChange={handlechangeState}
                sx={{ ...textFieldStyle, mb: 1 }}
                inputRef={(el) => (inputRefs.current[4] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 4)} // Handle Enter key
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {states.map((s) => (
                  <MenuItem value={s} key={s}>
                    {s}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="PIN CODE"
                id="pin"
                fullWidth
                size="small"
                value={formData.pin}
                onChange={handleNumericValue}
                inputProps={{
                  maxLength: 6,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[5] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 5)} // Handle Enter key
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="PHONE OFFICE"
                id="Office"
                fullWidth
                size="small"
                value={formData.Office}
                onChange={handleNumericValue}
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[6] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 6)} // Handle Enter key
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="PHONE RESIDENCE"
                id="Resi"
                fullWidth
                size="small"
                value={formData.Resi}
                onChange={handleNumericValue}
                inputProps={{
                  maxLength: 10,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[7] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 7)} // Handle Enter key
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="PAN"
                id="pan"
                fullWidth
                size="small"
                value={formData.pan}
                onChange={handlePanChange}
                inputProps={{
                  maxLength: 10
                }}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[8] = el)}
                onKeyDown={(e) => handleKeyDown(e, 8)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="TDS A/C NO"
                id="tdsno"
                fullWidth
                size="small"
                value={formData.tdsno}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[9] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 9)} // Handle Enter key
                inputProps={{ maxLength: 10 }}   // ← LIMIT SET HERE
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="TDS CIRCLE"
                id="tdsCircle"
                fullWidth
                size="small"
                value={formData.tdsCircle}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[10] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 10)} // Handle Enter key
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="STYLE"
                id="style"
                fullWidth
                size="small"
                value={formData.style}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[11] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 11)} // Handle Enter key
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="COMMODITY"
                id="item"
                fullWidth
                size="small"
                value={formData.item}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[12] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 12)} // Handle Enter key
              />
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 1 }}>
                <FormLabel sx={{ fontSize: "0.8rem" }}>
                  ACTT YEAR FROM
                </FormLabel>
                <br />
                <DatePicker
                  id="Afrom"
                  selected={formData.Afrom}
                  onChange={(date) => handleDateChange(date, "Afrom")}
                  dateFormat="dd-MM-yyyy"
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 1 }}>
                <FormLabel sx={{ fontSize: "0.8rem" }}>
                  ACTT YEAR UPTO
                </FormLabel>
                <br />
                <DatePicker
                  id="Aupto"
                  selected={formData.Aupto}
                  onChange={(date) => handleDateChange(date, "Aupto")}
                  dateFormat="dd-MM-yyyy"
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="WEIGHT DECIMALS"
                id="Decimals"
                fullWidth
                size="small"
                value={formData.Decimals}
                onChange={handleNumericValue}
                inputProps={{
                  maxLength: 2,
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                }}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[13] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 13)} // Handle Enter key
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="EMAIL ADDRESS"
                id="Email"
                fullWidth
                size="small"
                value={formData.Email}
                onChange={handleEmailChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[14] = el)}
                onKeyDown={(e) => handleKeyDown(e, 14)}
              />
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                <Select
                  id="unitType"
                  fullWidth
                  size="small"
                  value={formData.unitType}
                  onChange={handleUnitType}
                  disabled={!isEditMode || isDisabled}
                  sx={textFieldStyle}
                  inputRef={(el) => (inputRefs.current[15] = el)} // Assign ref
                  onKeyDown={(e) => handleKeyDown(e, 15)} // Handle Enter key
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                  <MenuItem value="Trading">Trading</MenuItem>
                  <MenuItem value="Income/Expenditure">
                    Income/Expenditure
                  </MenuItem>
                </Select>
                <FormControlLabel
                  control={
                    <Checkbox
                      id="Networking"
                      checked={formData.Networking}
                      onChange={handleChange}
                      disabled={!isEditMode || isDisabled}
                    />
                  }
                  label="Networking"
                />
              </Box>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="REGISTRATION NO"
                id="Rc"
                fullWidth
                size="small"
                value={formData.Rc}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[16] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 16)} // Handle Enter key
                inputProps={{ maxLength: 21 }}   // ← LIMIT SET HERE
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="IEC NO"
                id="Div"
                fullWidth
                size="small"
                value={formData.Div}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[17] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 17)} // Handle Enter key
                inputProps={{ maxLength: 10 }}   // ← LIMIT SET HERE
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="COLLECTORATE"
                id="Collc"
                fullWidth
                size="small"
                value={formData.Collc}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[18] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 18)} // Handle Enter key
                inputProps={{ maxLength: 40 }}   // ← LIMIT SET HERE
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="RANGE"
                id="Erange"
                fullWidth
                size="small"
                value={formData.Erange}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[19] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 19)} // Handle Enter key
                inputProps={{ maxLength: 40 }}   // ← LIMIT SET HERE
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="AADHAR UDYOG"
                id="Pla"
                fullWidth
                size="small"
                value={formData.Pla}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[20] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 20)} // Handle Enter key
                inputProps={{ maxLength: 19 }}   // ← LIMIT SET HERE
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="CIN NO"
                id="Ecc"
                fullWidth
                size="small"
                value={formData.Ecc}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[21] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 21)} // Handle Enter key
                inputProps={{ maxLength: 21 }}   // ← LIMIT SET HERE
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="JOB WORK"
                id="ward"
                fullWidth
                size="small"
                value={formData.ward}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[22] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 22)} // Handle Enter key
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="GST NO"
                id="Gstno"
                fullWidth
                size="small"
                value={formData.Gstno}
                onChange={handleGstChange}
                inputProps={{ maxLength: 15 }}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[23] = el)}
                onKeyDown={(e) => handleKeyDown(e, 23)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="GSTIN TYPE"
                id="Pfno"
                fullWidth
                size="small"
                value={formData.Pfno}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[24] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 24)} // Handle Enter key
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="PEID/ESI NO"
                id="Esino"
                fullWidth
                size="small"
                value={formData.Esino}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[25] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 25)} // Handle Enter key
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="QTY APPLICABLE"
                id="prncode"
                fullWidth
                size="small"
                value={formData.prncode}
                onChange={handleChange}
                sx={textFieldStyle}
                inputRef={(el) => (inputRefs.current[26] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 26)} // Handle Enter key
              />
            </Grid>
            <Grid item xs={12}>
              {Tdsname.map((item, index) => (
                <TextField
                  key={index}
                  label="TDS Payable"
                  id="Tdsname"
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  value={item.Tdsname || ""}
                  onChange={(e) => {
                    const newTdsname = [...Tdsname];
                    newTdsname[index].Tdsname = e.target.value;
                    setTdsname(newTdsname);
                  }}
                  onKeyDown={(e) => {
                    handleOpenModal(e, index, "Tdsname");
                    handleKeyDown(e, 27);
                  }}
                  inputRef={(el) => (inputRefs.current[27] = el)} // Assign ref
                  InputProps={{ readOnly: !isEditMode || isDisabled }}
                />
              ))}
              {showModalTdsname && (
                <ProductModalAccount
                  allFieldsAcc={allFieldsTdsname}
                  productsAcc={productsTdsname}
                  onSelectAcc={handleProductSelectTdsname}
                  onCloseAcc={() => setShowModalTdsname(false)}
                  initialKey={pressedKey}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="206(1H) ON SALE"
                id="Tcsynsale"
                fullWidth
                size="small"
                sx={textFieldStyle}
                value={formData.Tcsynsale}
                onChange={handleChange}
                InputProps={{ readOnly: !isEditMode || isDisabled }}
                inputRef={(el) => (inputRefs.current[28] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 28)} // Handle Enter key
              />
            </Grid>
            <Grid item xs={12}>
              {Tdsname1.map((item, index) => (
                <TextField
                  key={index}
                  label="TDS Recov"
                  id="Tdsname1"
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  value={item.Tdsname1 || ""}
                  onChange={(e) => {
                    const newTdsname1 = [...Tdsname1];
                    newTdsname1[index].Tdsname1 = e.target.value;
                    setTdsname1(newTdsname1);
                  }}
                  onKeyDown={(e) => {
                    handleOpenModal(e, index, "Tdsname1");
                    handleKeyDown(e, 29);
                  }}
                  inputRef={(el) => (inputRefs.current[29] = el)} // Assign ref
                  InputProps={{ readOnly: !isEditMode || isDisabled }}
                />
              ))}
              {showModalTdsname1 && (
                <ProductModalAccount
                  allFieldsAcc={allFieldsTdsname1}
                  productsAcc={productsTdsname1}
                  onSelectAcc={handleProductSelectTdsname1}
                  onCloseAcc={() => setShowModalTdsname1(false)}
                  initialKey={pressedKey}
                />
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="TDS 194Q POLICY"
                id="Disp_act"
                fullWidth
                size="small"
                sx={textFieldStyle}
                value={formData.Disp_act}
                onChange={handleChange}
                InputProps={{ readOnly: !isEditMode || isDisabled }}
                inputRef={(el) => (inputRefs.current[30] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 30)} // Handle Enter key
              />
            </Grid>
            <Grid item xs={12}>
              <FormLabel sx={{ mt: 1 }}>BACKUP ON EXIT</FormLabel>
              <Select
                id="Cperson"
                fullWidth
                size="small"
                value={formData.Cperson}
                onChange={handleBackUp}
                disabled={!isEditMode || isDisabled}
                sx={{ ...textFieldStyle, mb: 1 }}
                inputRef={(el) => (inputRefs.current[31] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 31)} // Handle Enter key
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Ask Backup(Default Yes)">
                  Ask Backup(Default Yes)
                </MenuItem>
                <MenuItem value="Ask Backup(Default No)">
                  Ask Backup(Default No)
                </MenuItem>
                <MenuItem value="Always Backup">Always Backup</MenuItem>
                <MenuItem value="No Backup">No Backup</MenuItem>
                <MenuItem value="Auto Bck Alternate Days">
                  Auto Bck Alternate Days
                </MenuItem>
              </Select>
              <FormControlLabel
                sx={{ mt: 1 }}
                control={
                  <Checkbox
                    id="Dongal"
                    checked={formData.Dongal}
                    onChange={handleChange}
                    disabled={!isEditMode || isDisabled}
                  />
                }
                label="APPLY DONGAL"
              />
            </Grid>
          </Grid>
        );
      default:
        return "Unknown Step";
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#ffffff",
      }}
    >
      <ToastContainer />
      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, p: 2, overflow: "auto" }}>
        {headerSection}
        <Card sx={{ maxHeight: "calc(100vh - 150px)", overflow: "auto" }}>
          <CardContent>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 2 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            <form>
              {getStepContent(activeStep)}
              <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 2, justifyContent: "center" }}
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => prev - 1)}
                  variant="contained"
                  sx={{ backgroundColor: "#8B0000", color: "#fff" }}
                  type="button"
                >
                  Back
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    onClick={handleFinalSubmit}
                    variant="contained"
                    sx={{ backgroundColor: "#006400", color: "#fff" }}
                    type="button"
                  >
                    {isUpdate ? "UPDATE" : "SAVE"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setActiveStep((prev) => prev + 1)}
                    variant="contained"
                    sx={{ backgroundColor: "#006400", color: "#fff" }}
                    type="button"
                  >
                    Next
                  </Button>
                )}
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            borderLeft: "1px solid #ccc",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Hidden file input for background image */}
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        id="fileInput"
        onChange={handleBackgroundChange}
      />

      {/* Modal components */}
      {isModalOpen && <CashBankSetup onClose={() => setIsModalOpen(false)} />}
      {isModalOpenS && <SaleSetup onClose={() => setIsModalOpenS(false)} />}
      {isModalOpenP && <PurchaseSetup onClose={() => setIsModalOpenP(false)} />}
      {isModalOpenE && <ExciseSetup onClose={() => setIsModalOpenE(false)} />}
      {isModalOpenV && <GstSetup onClose={() => setIsModalOpenV(false)} />}
    </Box>
  );
};

export default Setup;
