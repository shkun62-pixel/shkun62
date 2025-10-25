import React, { useState, useEffect, useRef, forwardRef } from "react";
import "./CashVoucher.css";
import DatePicker from "react-datepicker";
import InputMask from "react-input-mask";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ProductModalCustomer from "../Modals/ProductModalCustomer";
import { Font } from "@react-pdf/renderer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "react-bootstrap"; // Import Bootstrap components
import { useEditMode } from "../../EditModeContext";
import InvoicePDFcash from "../InvoicePDFcash";
import { CompanyContext } from '../Context/CompanyContext';
import { useContext } from "react";
import TextField from "@mui/material/TextField";
import {IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useLocation } from "react-router-dom";
import useCompanySetup from "../Shared/useCompanySetup";
import PrintChoiceModal from "../Shared/PrintChoiceModal";
import FAVoucherModal from "../Shared/FAVoucherModal";

// Register font
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

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

const CashVoucher = () => {

  const companySetup = useCompanySetup();

  const location = useLocation();
  const cashId = location.state?.cashId;
  const navigate = useNavigate();

  const { company } = useContext(CompanyContext);
  // const tenant = company?.databaseName;
    const tenant = "shkun_05062025_05062026"

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    console.error("No tenant selected!");
  }
      
  const tableRef = useRef(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const addButtonRef = useRef(null);
  const datePickerRef = useRef(null);
  const voucherRef = useRef(null);
  const [title, setTitle] = useState("VIEW");
  const accountNameRefs = useRef([]);
  const narrationRefs = useRef([]);
  const paymentRefs = useRef([]);
  const receiptRefs = useRef([]);
  const discountRefs = useRef([]);
  const saveButtonRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
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
  const [buttonColors, setButtonColors] = useState(initialColors);
  const [showSearchModal, setShowSearchModal] = useState(false); // State to handle modal visibility
  const [searchResults, setSearchResults] = useState([]); // State to store search results
  const [formData, setFormData] = useState({
    vtype: "C",
    date: "",
    voucherno: 0,
    cashinhand: "",
    owner: "",
    user: "",
    totalpayment: "",
    totalreceipt: "",
    totaldiscount: "",
  });
  const [items, setItems] = useState([
    {
      id: 1,
      acode:"",
      accountname: "",
      narration: "",
      payment_debit: "",
      receipt_credit: "",
      discount: "",
      discounted_payment: "",
      discounted_receipt: "",
      disablePayment: false,
      disableReceipt: false,
    },
  ]);

  useEffect(() => {
    if (addButtonRef.current && !cashId) {
      addButtonRef.current.focus();
    }
  }, []);

// DateError
  useEffect(() => {
    const date = new Date();
    const options = { weekday: "long" };
    const day = new Intl.DateTimeFormat("en-US", options).format(date);

    const formattedDate = date.toLocaleDateString();

    setCurrentDate(formattedDate);
    setCurrentDay(day);
  }, []);

  const [selectedDate, setSelectedDate] = useState(new Date());

  // Date
  useEffect(() => {
  if (formData.date) {
    try {
      // Expecting date in format "DD/MM/YYYY"
      const [day, month, year] = formData.date.split("/").map(Number);
      const date = new Date(year, month - 1, day); // month is 0-based

      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
      } else {
        console.error("Invalid date value in formData.date:", formData.date);
      }
    } catch (error) {
      console.error("Error parsing date:", error);
    }
  } else {
    setSelectedDate(null);
  }
}, [formData.date]);

  // useEffect(() => {
  //   // If formData.date has a valid date string, parse it and set selectedDate
  //   if (formData.date) {
  //     try {
  //       const date = new Date(formData.date);
  //       if (!isNaN(date.getTime())) {
  //         setSelectedDate(date);
  //       } else {
  //         console.error("Invalid date value in formData.date:", formData.date);
  //       }
  //     } catch (error) {
  //       console.error("Error parsing date:", error);
  //     }
  //   } else {
  //     // If there's no date, we keep selectedDate as null so the DatePicker is blank,
  //     // but we can still have it open on today's date via openToDate
  //     setSelectedDate(null);
  //   }
  // }, [formData.date]);

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setSelectedDate(date);
      const formattedDate = date.toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, date: formattedDate }));
    }
  };
  
  // ✅ Separate function for future date check
  const checkFutureDate = (date) => {
    if (!date) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate > today) {
      toast.info("You Have Selected a Future Date.", {
        position: "top-center",
      });
    }
  };

  // const handleDateChange = (date) => {
  //   if (date instanceof Date && !isNaN(date)) {
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0); // Set today's date to midnight

  //     const selectedDate = new Date(date);
  //     selectedDate.setHours(0, 0, 0, 0); // Set selected date to midnight too

  //     if (selectedDate > today) {
  //       toast.info("You Have Selected a Future Date.", {
  //         position: "top-center",
  //       });
  //     }

  //     setSelectedDate(date);
  //     const formattedDate = date.toISOString().split("T")[0];
  //     setFormData((prev) => ({ ...prev, date: date }));
  //   } else {
  //     console.error("Invalid date value");
  //   }
  // };

  const handleCalendarClose = () => {
    // If no date is selected when the calendar closes, default to today's date
    if (!selectedDate) {
      const today = new Date();
      setSelectedDate(today);
    }
  };

  // Search functions
  const handleSearchClick = () => {
    setSearchResults([]); // Clear the search results when reopening the modal
    setShowSearchModal(true); // Open the modal
  };

  const handleCloseSearchModal = () => {
    setSearchResults([]); // Clear search results when the modal is closed
    setShowSearchModal(false); // Close the modal
  };

  const handleSelectSearchResult = (selectedData) => {
    setFormData(selectedData.formData); // Update the form with the selected search data
    setItems(selectedData.items); // Update items with the selected search result
    setShowSearchModal(false); // Close the modal
    setSearchResults([]); // Clear search results after selecting a result
  };

  const handleSearch = async (searchDate) => {
    try {
      // console.log(searchDate,"Hellloooo");
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/search?date=${searchDate}`
      );

      if (response.status === 200) {
        setSearchResults(response.data.data); // Assuming the data is in response.data.data
      } else {
        setSearchResults([]); // Clear results if no data is found
      }
    } catch (error) {
      console.error("Error fetching search data", error);
    }
  };
  
  const [firstTimeCheckData, setFirstTimeCheckData] = useState("");
  // Fetch Data
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
  const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
  const [isFAModalOpen, setIsFAModalOpen] = useState(false);
  const [printChoiceOpen, setPrintChoiceOpen] = useState(false);

    // replace your Print button onClick:
  const handlePrintClick = () => setPrintChoiceOpen(true);

  // 1) Normal print (your existing PDF)
  const handleNormalPrint = () => {
    setPrintChoiceOpen(false);
    handleOpen(); // your existing setOpen(true) that triggers InvoicePDFbank
  };

  // 2) FA voucher preview
  const handleFAPreview = async () => {
    setIsFAModalOpen(true);
  };

  const fetchData = async () => {
    try {
      let response;
      if (cashId) {
        response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cashget/${cashId}`
        );
      } else {
        response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/last`
        );
      }
      // const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/last`);

      if (response.status === 200 && response.data.data) {
        const lastEntry = response.data.data;
        // Set flags and update form data
        setFirstTimeCheckData("DataAvailable");
        setFormData(lastEntry.formData);
        // console.log(lastEntry.formData, "fetchFormdata");

        // Update items with the last entry's items
        const updatedItems = lastEntry.items.map((item) => ({
          ...item, // Ensure immutability
          disableReceipt: item.disableReceipt || false, // Handle disableReceipt flag safely
        }));
        setItems(updatedItems);

        // Calculate total payment, total receipt, and total discount
        const totalPayment = updatedItems
          .reduce((sum, item) => sum + parseFloat(item.payment_debit || 0), 0)
          .toFixed(2);
        const totalReceipt = updatedItems
          .reduce((sum, item) => sum + parseFloat(item.receipt_credit || 0), 0)
          .toFixed(2);
        const totalDiscount = updatedItems
          .reduce((sum, item) => sum + parseFloat(item.discount || 0), 0)
          .toFixed(2);

        // Update formData with the calculated totals
        setFormData((prevFormData) => ({
          ...prevFormData,
          totalpayment: totalPayment,
          totalreceipt: totalReceipt,
          totaldiscount: totalDiscount,
        }));

        // Set data and index
        setData1(lastEntry); // Assuming setData1 holds the current entry data
        setIndex(lastEntry.voucherno); // Set index to the voucher number or another identifier
        return lastEntry; // ✅ Return this for use in handleAdd
      } else {
        setFirstTimeCheckData("DataNotAvailable");
        console.log("No data available");
        // Create an empty data object with voucher number 0
        const emptyFormData = {
          voucherno: 0,
          date: new Date().toLocaleDateString(), // Use today's date
          cashinhand: "",
          owner: "Owner",
          user: "",
          totalpayment: "0.00",
          totalreceipt: "0.00",
          totaldiscount: "0.00",
        };
        const emptyItems = [
          {
            id: 1,
            acode:"",
            accountname: "",
            narration: "",
            payment_debit: "",
            receipt_credit: "",
            discount: "",
            discounted_payment: "0.00",
            discounted_receipt: "0.00",
            disablePayment: false,
            disableReceipt: false,
          },
        ];

        // Set the empty data
        setFormData(emptyFormData);
        setItems(emptyItems);
        setData1({ formData: emptyFormData, items: emptyItems }); // Store empty data
        setIndex(0); // Set index to 0 for the empty voucher
      }
    } catch (error) {
      console.error("Error fetching data", error);

      // In case of error, you can also initialize empty data if needed
      const emptyFormData = {
        voucherno: 0,
        date: new Date().toLocaleDateString(),
        cashinhand: "",
        owner: "Owner",
        user: "",
        totalpayment: "0.00",
        totalreceipt: "0.00",
        totaldiscount: "0.00",
      };
      const emptyItems = [
        {
          id: 1,
          acode:"",
          accountname: "",
          narration: "",
          payment_debit: "",
          receipt_credit: "",
          discount: "",
          discounted_payment: "0.00",
          discounted_receipt: "0.00",
          disablePayment: false,
          disableReceipt: false,
        },
      ];
      setFormData(emptyFormData);
      setItems(emptyItems);
      setData1({ formData: emptyFormData, items: emptyItems });
      setIndex(0);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isEditMode && cashId) {
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


  // useEffect(() => {
  //   const handleEsc = (e) => {
  //     if (e.key === "Escape" && cashId && !isEditMode) {
  //       // ✅ Go back explicitly to LedgerList with state
  //       navigate( -1, {
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
  // }, [navigate, cashId, location.state]);
  
  useEffect(() => {
    if (data.length > 0) {
      setFormData(data[data.length - 1]);
      setIndex(data.length - 1);
    }
  }, [data]);

  // Add this line to set isDisabled to true initially
  useEffect(() => {
    setIsDisabled(true);
  }, []);

  const handleNext = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("View");
    // console.log(data1._id)
    try {
      if (data1) {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/next/${data1._id}`
        );
        if (response.status === 200 && response.data) {
          const nextData = response.data.data;
          setData1(response.data.data);
          setIndex(index + 1);
          setFormData(nextData.formData);
          const updatedItems = nextData.items.map((item) => ({
            ...item,
            disableReceipt: item.disableReceipt || false,
          }));
          setItems(updatedItems);
          setIsDisabled(true);
        }
      }
    } catch (error) {
      console.error("Error fetching next record:", error);
    }
  };

  const handlePrevious = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("View");
    try {
      if (data1) {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/previous/${data1._id}`
        );
        if (response.status === 200 && response.data) {
          // console.log(response);
          setData1(response.data.data);
          const prevData = response.data.data;
          setIndex(index - 1);
          setFormData(prevData.formData);
          const updatedItems = prevData.items.map((item) => ({
            ...item,
            disableReceipt: item.disableReceipt || false,
          }));
          setItems(updatedItems);
          setIsDisabled(true);
        }
      }
    } catch (error) {
      console.error("Error fetching previous record:", error);
    }
  };

  const handleFirst = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("View");

    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/first`
      );
      if (response.status === 200 && response.data) {
        const firstData = response.data.data;
        setIndex(0);
        setFormData(firstData.formData);
        setData1(response.data.data);
        const updatedItems = firstData.items.map((item) => ({
          ...item,
          disableReceipt: item.disableReceipt || false,
        }));
        setItems(updatedItems);
        setIsDisabled(true);
      }
    } catch (error) {
      console.error("Error fetching first record:", error);
    }
  };

  const handleLast = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("View");

    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/last`
      );
      if (response.status === 200 && response.data) {
        const lastData = response.data.data;
        const lastIndex = response.data.length - 1;
        setIndex(lastIndex);
        setFormData(lastData.formData);
        setData1(response.data.data);
        const updatedItems = lastData.items.map((item) => ({
          ...item,
          disableReceipt: item.disableReceipt || false,
        }));
        setItems(updatedItems);
        setIsDisabled(true);
      }
    } catch (error) {
      console.error("Error fetching last record:", error);
    }
  };

  const handleAdd = async () => {
    setTitle("NEW");
    try {
      const lastEntry = await fetchData(); // This should set up the state correctly whether data is found or not
      let lastvoucherno = lastEntry?.formData?.voucherno ? parseInt(lastEntry.formData.voucherno) + 1 : 1;
      const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
      const newData = {
        vtype: "C",
        date: today,
        voucherno: lastvoucherno,
        cashinhand: "",
        owner: "Owner",
        user: "",
        totalpayment: "",
        totalreceipt: "",
        totaldiscount: "",
      };
      setData([...data, newData]);
      setFormData(newData);
      setItems([
        {
          id: 1,
          acode:"",
          accountname: "",
          narration: "",
          payment_debit: "",
          receipt_credit: "",
          discount: "",
          discounted_payment: "",
          discounted_receipt: "",
          disablePayment: false,
          disableReceipt: false,
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
      if (datePickerRef.current) {
        datePickerRef.current.setFocus();
      }
      // voucherRef.current.focus()
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
    if (accountNameRefs.current[0]) {
      accountNameRefs.current[0].focus();
    }
  };
  const calculateCashInHand = () => {
    const totalPayment = parseFloat(formData.totalpayment) || 0;
    const totalReceipt = parseFloat(formData.totalreceipt) || 0;
    const cashInHand = totalPayment - totalReceipt;
    setFormData((prevFormData) => ({
      ...prevFormData,
      cashinhand: cashInHand.toFixed(2),
    }));
  };

  const calculateTotalDiscount = () => {
    // Calculate the total discount by summing up all discount values
    const totalDiscount = items.reduce((acc, item) => {
      return acc + parseFloat(item.discount || 0);
    }, 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totaldiscount: totalDiscount.toFixed(2),
    }));
  };

  const calculateTotalPayment = () => {
    // Calculate the total payment by summing up all payment_debit values
    const totalPayment = items.reduce((acc, item) => {
      return acc + parseFloat(item.payment_debit || 0);
    }, 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalpayment: totalPayment.toFixed(2),
    }));
  };

  const calculateTotalReceipt = () => {
    // Calculate the total receipt by summing up all receipt_credit values
    const totalReceipt = items.reduce((acc, item) => {
      return acc + parseFloat(item.receipt_credit || 0);
    }, 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalreceipt: totalReceipt.toFixed(2),
    }));
  };

  const handleNumberChange = (event, index, field) => {
    const value = event.target.value;
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    const isValueGreaterThanZero = parseFloat(value) > 0;

    if (field === "payment_debit") {
      updatedItems[index].disableReceipt = isValueGreaterThanZero;
    } else if (field === "receipt_credit") {
      updatedItems[index].disablePayment = isValueGreaterThanZero;
    }
    setItems(updatedItems);
    // Calculate totals after updating items
    calculateTotalPayment();
    calculateTotalReceipt();
    calculateTotalDiscount();
    // calculateCashInHand();
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

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

  const handleItemChangeCus = (index, key, value) => {
    if ((key === "discount") && !/^\d*\.?\d*$/.test(value)) {
      return; // reject invalid input
    }
    const updatedItems = [...items];
    updatedItems[index][key] = capitalizeWords(value); // Capitalize words here
    calculateTotalDiscount();
    // If the key is 'name', find the corresponding product and set the price
    if (key === "name") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["accountname"] = selectedProduct.ahead;
      }
    } else if (key === "discount" || key === "payment_debit" ||key === "receipt_credit") {
      const payment = parseFloat(updatedItems[index]["payment_debit"]) || 0;
      const discount = parseFloat(updatedItems[index]["discount"]) || 0;
      const discountedPayment = payment - discount;
      const receipt = parseFloat(updatedItems[index]["receipt_credit"]) || 0;

      let discountedReceipt = receipt - discount;
      if (updatedItems[index].disableReceipt) {
        discountedReceipt = 0; // Set to zero if receipt field is disabled
      }

      let discounted_payment = discountedPayment;
      if (updatedItems[index].disablePayment) {
        discounted_payment = 0; // Set to zero if payment field is disabled
      }

      updatedItems[index]["payment_debit"] = payment.toFixed(2);
      updatedItems[index]["discounted_payment"] = discounted_payment.toFixed(2);
      updatedItems[index]["receipt_credit"] = receipt.toFixed(2);
      updatedItems[index]["discounted_receipt"] = discountedReceipt.toFixed(2);
      updatedItems[index]["discount"] = discount;
    }
    setItems(updatedItems);
  };
  const handleAddItem = () => {
    if (isEditMode) {
      const newItem = {
        id: items.length + 1,
        accountname: "",
        narration: "",
        payment_debit: "",
        receipt_credit: "",
        discount: "",
        discounted_payment: "",
        discounted_receipt: "",
        disablePayment: false,
        disableReceipt: false,
      };

      // Update the state with the new item
      setItems([...items, newItem]);
      setTimeout(() => {
        accountNameRefs.current[items.length].focus();
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

  // const handleProductSelectCus = (product) => {
  //   if (selectedItemIndexCus !== null) {
  //     handleItemChangeCus(selectedItemIndexCus, "name", product.ahead);
  //     setShowModalCus(false);
  //     setTimeout(() => {
  //       narrationRefs.current[selectedItemIndexCus].focus();
  //     }, 100);
  //   }
  // };

  const handleProductSelectCus = (product) => {
    if (!product) {
      alert("No product received!");
      setShowModalCus(false);
      return;
    }
  
    // clone the array
    const newCustomers = [...items];
  
    // overwrite the one at the selected index
    newCustomers[selectedItemIndexCus] = {
      ...newCustomers[selectedItemIndexCus],
      accountname: product.ahead || '', 
      acode: product.acode || '', 
    };
    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexCus !== null) {
      handleItemChangeCus(selectedItemIndexCus, "name", nameValue);
      setShowModalCus(false);
      setTimeout(() => {
        narrationRefs.current[selectedItemIndexCus].focus();
      }, 100);
    }
    setItems(newCustomers);
    setIsEditMode(true);
    setShowModalCus(false);
  
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

  const handleSaveClick = async () => {
    document.body.style.backgroundColor = "white";

    // Validate if at least one row is filled
    const filledRows = items.filter((item) => item.accountname !== "");
    if (filledRows.length === 0) {
      toast.error("Please fill in at least one account name before saving.", { position: "top-center" });
      return;
    }

    // Validate if EVERY row has either payment_debit > 0 or receipt_credit > 0
    const isValidTransaction = filledRows.every(
      (item) => parseFloat(item.payment_debit) > 0 || parseFloat(item.receipt_credit) > 0
    );
    if (!isValidTransaction) {
      toast.error("Payment or Receipt must be greater than 0.", { position: "top-center" });
      return;
    }

    // ✅ NEW VALIDATION: Prevent both debit and credit in same row
    const hasBothDebitAndCredit = filledRows.some(
      (item) => parseFloat(item.payment_debit) > 0 && parseFloat(item.receipt_credit) > 0
    );
    if (hasBothDebitAndCredit) {
      toast.error("A row cannot have both Payment Debit and Receipt Credit values at the same time.", {
        position: "top-center",
      });
      return;
    }

    // Only disable the save button AFTER validation passes
    setIsSaving(true);
    try {
      let combinedData = {
        _id: formData._id,
        formData: {
          date: selectedDate.toLocaleDateString("en-IN"),
          vtype: formData.vtype,
          voucherno: formData.voucherno,
          cashinhand: formData.cashinhand || "",
          owner: formData.owner,
          user: formData.user || "",
          totalpayment: formData.totalpayment,
          totalreceipt: formData.totalreceipt,
          totaldiscount: formData.totaldiscount,
        },
        items: filledRows.map((item) => ({
          id: item.id,
          acode: item.acode,
          accountname: item.accountname,
          narration: item.narration,
          payment_debit: item.payment_debit,
          receipt_credit: item.receipt_credit,
          discount: item.discount,
          discounted_payment: item.discounted_payment,
          discounted_receipt: item.discounted_receipt,
          name: item.name,
          disableReceipt: item.disableReceipt,
          disablePayment: item.disablePayment,
        })),
      };

      // console.log("Combined Data:", combinedData);
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash${
        isAbcmode ? `/${data1._id}` : ""
      }`;
      const method = isAbcmode ? "put" : "post";
      console.log("Method",method);
      

      const response = await axios({
        method,
        url: apiEndpoint,
        data: combinedData,
      });

      console.log("API Response:", response);

      if (response?.status === 200 || response?.status === 201) {
        toast.success("Data Saved Successfully!", { position: "top-center" });
        setIsAddEnabled(true);
        setIsDisabled(true);
        setIsEditMode(false);
        setIsSubmitEnabled(false);
        setIsPreviousEnabled(true);
        setIsNextEnabled(true);
        setIsFirstEnabled(true);
        setIsLastEnabled(true);
        setIsSearchEnabled(true);
        setIsSPrintEnabled(true);
        setIsDeleteEnabled(true);
        setTitle("VIEW");
      } else {
        throw new Error(`Unexpected response status: ${response?.status}`);
      }
    } catch (error) {
      console.error("Error saving data:", error?.response?.data || error.message);
      toast.error(`Failed to save data. ${error?.response?.data?.message || "Please try again."}`, {
        position: "top-center",
      });
    } finally {
      setIsSaving(false);
    }
  };


  // const handleSaveClick = async () => {
  //     document.body.style.backgroundColor = 'white';

  //     // Validate if at least one row is filled
  //     const filledRows = items.filter(item => item.accountname !== '');
  //     if (filledRows.length === 0) {
  //         toast.error("Please fill in at least one account name before saving.", { position: "top-center" });
  //         return;
  //     }

  //     // Validate if EVERY row has either payment_debit > 0 or receipt_credit > 0
  //     const isValidTransaction = filledRows.every(item => 
  //         parseFloat(item.payment_debit) > 0 || parseFloat(item.receipt_credit) > 0
  //     );

  //     if (!isValidTransaction) {
  //         toast.error("Payment or Receipt must be greater than 0.", { position: "top-center" });
  //         return;
  //     }

  //     // Only disable the save button AFTER validation passes
  //     setIsSaving(true);
  //     try {
  //         let combinedData = {
  //           _id: formData._id,
  //           formData: {
  //               date: selectedDate.toLocaleDateString("en-US"),
  //               vtype: formData.vtype,
  //               voucherno: formData.voucherno,
  //               cashinhand: formData.cashinhand || "",
  //               owner: formData.owner,
  //               user: formData.user || "",
  //               totalpayment: formData.totalpayment,
  //               totalreceipt: formData.totalreceipt,
  //               totaldiscount: formData.totaldiscount,
  //           },
  //           items: filledRows.map(item => ({
  //               id: item.id,
  //               acode: item.acode,
  //               accountname: item.accountname,
  //               narration: item.narration,
  //               payment_debit: item.payment_debit,
  //               receipt_credit: item.receipt_credit,
  //               discount: item.discount,
  //               discounted_payment: item.discounted_payment,
  //               discounted_receipt: item.discounted_receipt,
  //               name: item.name,
  //               disableReceipt: item.disableReceipt,
  //               disablePayment: item.disablePayment,
  //           }))
  //         };

  //         console.log('Combined Data:', combinedData);
  //         const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash${isAbcmode ? `/${data1._id}` : ''}`;
  //         const method = isAbcmode ? 'put' : 'post';

  //         const response = await axios({
  //             method,
  //             url: apiEndpoint,
  //             data: combinedData,
  //         });

  //         console.log('API Response:', response);

  //         if (response?.status === 200 || response?.status === 201) {
  //             toast.success("Data Saved Successfully!", { position: "top-center" });
  //             setIsAddEnabled(true);
  //             setIsDisabled(true);
  //             setIsEditMode(false);
  //             setIsSubmitEnabled(false);
  //             setIsPreviousEnabled(true);
  //             setIsNextEnabled(true);
  //             setIsFirstEnabled(true);
  //             setIsLastEnabled(true);
  //             setIsSearchEnabled(true);
  //             setIsSPrintEnabled(true);
  //             setIsDeleteEnabled(true);
  //             setTitle('VIEW');
  //         } else {
  //             throw new Error(`Unexpected response status: ${response?.status}`);
  //         }
  //     } catch (error) {
  //         console.error('Error saving data:', error?.response?.data || error.message);
  //         toast.error(`Failed to save data. ${error?.response?.data?.message || "Please try again."}`, { position: "top-center" });
  //     } finally {
  //         setIsSaving(false);
  //     }
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
    setIsSaving(true);
    try {
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/${data1._id}`;
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
      setIsSaving(false);
    }
  };

  const [fontSize, setFontSize] = useState(18);

  const handleEnterKeyPress = (currentRef, nextRef) => (event) => {
    if (event.key === "Enter") {
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

  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
  const handleKeyDown = (event, index, field) => {
    if (event.key === "Enter") {
      switch (field) {
        case "accountname":
          if (items[index].accountname.trim() === "") {
            saveButtonRef.current.focus();
          } else {
            narrationRefs.current[index]?.focus();
          }
          break;
          case "narration":
            if (items[index].accountname.trim() === "") {
              saveButtonRef.current?.focus();
            } else {
              if (items[index].disablePayment) {
                // If debit is disabled, move focus to credit
                receiptRefs.current[index]?.focus();
              } else {
                paymentRefs.current[index]?.focus();
              }
            }
            break;
        case "payment_debit":
          if (!items[index].disableReceipt) {
            receiptRefs.current[index]?.focus();
          } else {
            if (
              accountNameRefs.current[index].value.trim().length > 0 &&
              items[index].payment_debit.trim().length > 0
            ) {
              discountRefs.current[index]?.focus();
            } else {
              alert("Account name and Payment/Receipt cannot be empty");
              paymentRefs.current[index]?.focus();
            }
          }
          break;
        case "receipt_credit":
          if (accountNameRefs.current[index].value.trim().length > 0 && items[index].receipt_credit.trim().length > 0) {
            discountRefs.current[index]?.focus();
          } else {
            alert("Account name and Payment/Receipt cannot be empty");
            receiptRefs.current[index]?.focus();
          }
          break;
        case "discount":
          if (index === items.length - 1) {
            handleAddItem();
            accountNameRefs.current[index + 1]?.focus();
          } else {
            accountNameRefs.current[index + 1]?.focus();
          }
          break;
        default:
          break;
      }
    } 
    // Move Right (→)
    else if (event.key === "ArrowRight") {
      if (field === "accountname"){ narrationRefs.current[index]?.focus();
        setTimeout(() => narrationRefs.current[index]?.select(), 0);
      }
      if (field === "narration") {
        if (!items[index].disablePayment){ paymentRefs.current[index]?.focus();
          setTimeout(() => paymentRefs.current[index]?.select(), 0);
        }
        else {receiptRefs.current[index]?.focus();
        setTimeout(() => receiptRefs.current[index]?.select(), 0);
        }
      }
      // else if (field === "narration"){ paymentRefs.current[index]?.focus();
      //   setTimeout(() => paymentRefs.current[index]?.select(), 0);
      // }
      else if (field === "payment_debit" && !items[index].disableReceipt){
        receiptRefs.current[index]?.focus();
        setTimeout(() => receiptRefs.current[index]?.select(), 0);
      }
      else if (field === "payment_debit" && items[index].disableReceipt){
        discountRefs.current[index]?.focus();
        setTimeout(() => discountRefs.current[index]?.select(), 0);
      }
      else if (field === "receipt_credit"){ discountRefs.current[index]?.focus();
        setTimeout(() => discountRefs.current[index]?.select(), 0);
      }
    } 
    // Move Left (←)
    else if (event.key === "ArrowLeft") {
      if (field === "discount") {
        if (!items[index].disableReceipt){ receiptRefs.current[index]?.focus();
          setTimeout(() => receiptRefs.current[index]?.select(), 0);
        }
        else {paymentRefs.current[index]?.focus();
        setTimeout(() => paymentRefs.current[index]?.select(), 0);
        }
      } 
      if (field === "receipt_credit") {
        if (!items[index].disablePayment){ discountRefs.current[index]?.focus();
          setTimeout(() => discountRefs.current[index]?.select(), 0);
        }
        else {narrationRefs.current[index]?.focus();
        setTimeout(() => narrationRefs.current[index]?.select(), 0);
        }
      } 
      // else if (field === "receipt_credit"){ paymentRefs.current[index]?.focus();
      //   setTimeout(() => paymentRefs.current[index]?.select(), 0);
      // }
      else if (field === "payment_debit"){ narrationRefs.current[index]?.focus();
        setTimeout(() => narrationRefs.current[index]?.select(), 0);
      }
      else if (field === "narration"){ accountNameRefs.current[index]?.focus();
        setTimeout(() => accountNameRefs.current[index]?.select(), 0);
      }
    } 

    // Move Up
 else if (event.key === "ArrowUp" && index > 0) {
  setTimeout(() => {
    if (field === "accountname") accountNameRefs.current[index - 1]?.focus();
    else if (field === "narration") narrationRefs.current[index - 1]?.focus();
    else if (field === "payment_debit") paymentRefs.current[index - 1]?.focus();
    else if (field === "receipt_credit") receiptRefs.current[index - 1]?.focus();
    else if (field === "discount") discountRefs.current[index - 1]?.focus();
  }, 100);
} 
// Move Down
else if (event.key === "ArrowDown" && index < items.length - 1) {
  setTimeout(() => {
    if (field === "accountname") accountNameRefs.current[index + 1]?.focus();
    else if (field === "narration") narrationRefs.current[index + 1]?.focus();
    else if (field === "payment_debit") paymentRefs.current[index + 1]?.focus();
    else if (field === "receipt_credit") receiptRefs.current[index + 1]?.focus();
    else if (field === "discount") discountRefs.current[index + 1]?.focus();
  }, 100);
} 
    // Open Modal on Letter Input in Account Name
    else if (/^[a-zA-Z]$/.test(event.key) && field === "accountname") {
      setPressedKey(event.key);
      openModalForItemCus(index);
      event.preventDefault();
    }
  };
  

  const handleExit = async () => {
    document.body.style.backgroundColor = "white"; // Reset background color
    setTitle("View");
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/last`
      ); // Fetch the latest data

      if (response.status === 200 && response.data.data) {
        // If data is available
        const lastEntry = response.data.data;
        setFormData(lastEntry.formData); // Set form data

        const updatedItems = lastEntry.items.map((item) => ({
          ...item,
          disableReceipt: item.disableReceipt || false,
        }));
        setItems(updatedItems);
        setIsDisabled(true);
        setIndex(lastEntry.formData);
        setIsAddEnabled(true);
        setIsSubmitEnabled(false);
        setIsPreviousEnabled(true);
        setIsNextEnabled(true);
        setIsFirstEnabled(true);
        setIsLastEnabled(true);
        setIsSearchEnabled(true);
        setIsSPrintEnabled(true);
        setIsDeleteEnabled(true);
        // Update totals
        const totalPayment = updatedItems
          .reduce((sum, item) => sum + parseFloat(item.payment_debit || 0), 0)
          .toFixed(2);
        const totalReceipt = updatedItems
          .reduce((sum, item) => sum + parseFloat(item.receipt_credit || 0), 0)
          .toFixed(2);
        const totalDiscount = updatedItems
          .reduce((sum, item) => sum + parseFloat(item.discount || 0), 0)
          .toFixed(2);

        setFormData((prevFormData) => ({
          ...prevFormData,
          totalpayment: totalPayment,
          totalreceipt: totalReceipt,
          totaldiscount: totalDiscount,
        }));
      } else {
        // If no data is available, initialize with default values
        console.log("No data available");
        const newData = {
          date: "",
          voucherno: 0,
          cashinhand: "",
          owner: "Owner",
          user: "",
          totalpayment: "",
          totalreceipt: "",
          totaldiscount: "",
        };
        setFormData(newData); // Set default form data

        // Initialize with a single empty item
        setItems([
          {
            accountname: "",
            narration: "",
            payment_debit: "",
            receipt_credit: "",
            discount: "",
            discounted_payment: "",
            discounted_receipt: "",
            disablePayment: false,
            disableReceipt: false,
          },
        ]);

        setIsDisabled(true); // Disable fields after loading the default data
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
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
          // console.log(decimalValue);
          
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

  // Update the blur handlers so that they always format the value to 2 decimals.
  const handlePkgsBlur = (index) => {
    const decimalPlaces = decimalValue;
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index].payment_debit);
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index].payment_debit = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };

  const handleWeightBlur = (index) => {
    const decimalPlaces = decimalValue;
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index].receipt_credit);
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index].receipt_credit = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };

  const handleRateBlur = (index) => {
    const decimalPlaces = decimalValue;
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index].discount);
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index].discount = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };

  const handleOpenModalBack = (event, index, field) => {
    if (event.key === "Backspace" && field === "accountname") {
        setSelectedItemIndexCus(index);
        setShowModalCus(true);
        event.preventDefault();
    }
};

  return (
    <div>
      <ToastContainer />
      <div style={{ visibility: "hidden", width: 0, height: 0 }}>
        <InvoicePDFcash
          formData={formData}
          items={items}
          isOpen={open}
          handleClose={handleClose}
        />
      </div>
      <h1 className="HeaderCASH">CASH VOUCHER</h1>
      <span className="tittle">{title}</span>
      <div className="containers">
        <span style={styles2.dates}>{currentDate}</span>
        <span style={styles2.days}>{currentDay}</span>
      </div>
      {/* <div style={{ marginLeft: "90%", marginTop: -35 }}>
          <Button onClick={decreaseFontSize}><FaMinus /></Button>
          <Button style={{ marginLeft: 10 }} onClick={increaseFontSize}><FaPlus /></Button>
      </div> */}
      <div className="Tops">
        <span>DATE</span>
         <DatePicker
            ref={datePickerRef}
            selected={selectedDate || null}
            openToDate={new Date()}
            onCalendarClose={handleCalendarClose}
            dateFormat="dd-MM-yyyy"
            onChange={handleDateChange}
            onBlur={() => checkFutureDate(selectedDate)}
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
            onBlur={() => checkFutureDate(selectedDate)} // ✅ call function on blur
            onChangeRaw={(e) => {
              if (!e.target.value) return; // ✅ avoid undefined error

              let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
              if (val.length > 2) val = val.slice(0, 2) + "-" + val.slice(2);
              if (val.length > 5) val = val.slice(0, 5) + "-" + val.slice(5, 9);

              e.target.value = val; // Show formatted input
            }}
            readOnly={!isEditMode || isDisabled}
          /> */}
        <div style={{display:'flex',flexDirection:'row',marginTop:5}}>
          <TextField
          id="voucherno"
          value={formData.voucherno}
          label="VOUCHER NO."
          onFocus={(e) => e.target.select()}  // Select text on focus
          onKeyDown={handleEnterKeyPress(voucherRef, null)}
          // onChange={handleInputChange}
          inputProps={{
            maxLength: 48,
            style: {
              height: 20,
              fontSize: `${fontSize}px`,
              fontWeight: "bold",
            },
            readOnly: !isEditMode || isDisabled,
          }}
          size="small"
          variant="filled"
          className="custom-bordered-input"
          sx={{ width: 150 }}
          />
          <TextField
          id="owner"
          value={formData.owner}
          label="USER"
          onFocus={(e) => e.target.select()}  // Select text on focus
          // onChange={handleInputChange}
          inputProps={{
            maxLength: 48,
            style: {
              height: 20,
              fontSize: `${fontSize}px`,
              fontWeight: "bold",
            },
            readOnly: !isEditMode || isDisabled,
          }}
          size="small"
          variant="filled"
          className="custom-bordered-input"
          sx={{ width: 150,marginLeft:1 }}
          />
        </div>  
      </div>
      <div className="TableSectionz">
        <Table ref={tableRef} className="custom-table">
          <thead
            style={{
              backgroundColor: "skyblue",
              textAlign: "center",
              position: "sticky",
              top: 0,
            }}
          >
            <tr style={{ color: "white" }}>
              <th>ACCOUNTNAME</th>
              <th>NARRATION</th>
              <th>PAYMENT</th>
              <th>RECEIPT</th>
              <th>DISCOUNT</th>
              {isEditMode && <th className="text-center">DELETE</th>}
            </tr>
          </thead>
          <tbody style={{ overflowY: "auto", maxHeight: "calc(520px - 40px)" }}>
            {items.map((item, index) => (
              <tr key={`${item.accountname}-${index}`}>
                <td style={{ padding: 0 }}>
                  <input
                  className="Account"
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    type="text"
                    value={item.accountname}
                    readOnly={!isEditMode || isDisabled}
                    onChange={(e) => { // console.log(accountNameRefs.current[index].value)
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "accountname")
                      handleOpenModalBack(e, index, "accountname");
                    }}
                  
                    ref={(el) => (accountNameRefs.current[index] = el)}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                  />
                </td>
                <td style={{ padding: 0 }}>
                  <input
                  className="Narration"
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    readOnly={!isEditMode || isDisabled}
                    value={item.narration}
                    onChange={(e) =>
                      handleItemChangeCus(index, "narration", e.target.value)
                    }
                    ref={(el) => (narrationRefs.current[index] = el)}
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "narration");
                    }}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                  />
                </td>
                <td style={{ padding: 0, width: 160 }}>
                  <input
                  className="Payment"
                    style={{
                      height: 40,
                      textAlign: "right",
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    readOnly={!isEditMode || isDisabled}
                    value={item.payment_debit}
                    onChange={(e) =>
                      handleNumberChange(e, index, "payment_debit")
                    }
                    disabled={item.disablePayment}
                    ref={(el) => (paymentRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "payment_debit")}
                    onBlur={() => handlePkgsBlur(index)}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                  />
                </td>
                <td style={{ padding: 0, width: 160 }}>
                  <input
                  className="Receipt"
                    style={{
                      height: 40,
                      textAlign: "right",
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    readOnly={!isEditMode || isDisabled}
                    value={item.receipt_credit}
                    onChange={(e) =>
                      handleNumberChange(e, index, "receipt_credit")
                    }
                    disabled={item.disableReceipt}
                    ref={(el) => (receiptRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "receipt_credit")}
                    onBlur={() => handleWeightBlur(index)}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                  />
                </td>
                <td style={{ padding: 0, width: 160 }}>
                  <input
                  className="Discounts"
                    style={{
                      height: 40,
                      textAlign: "right",
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                    }}
                    readOnly={!isEditMode || isDisabled}
                    value={item.discount}
                    onChange={(e) =>
                      handleItemChangeCus(index, "discount", e.target.value)
                    }
                    ref={(el) => (discountRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "discount")}
                    onBlur={() => handleRateBlur(index)}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                  />
                </td>
                {isEditMode && (
                <td style={{ padding: 0}}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center", // horizontally center
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
        </Table>
      </div>
     
      <div className="addbutton" style={{ marginTop: 10 }}>
        <Button className="fw-bold btn-secondary" onClick={handleAddItem}>
          Add Row
        </Button>
      </div>
      {showModalCus && (
      <ProductModalCustomer
        allFields={allFieldsCus}
        onSelect={handleProductSelectCus}
        onClose={handleCloseModalCus}
        initialKey={pressedKey}
        tenant={tenant}
      />
      )}
      <div className="Belowcontent">
        <div style={{display:'flex',flexDirection:'row',justifyContent:'end',marginRight:20}}>
        <TextField
          id="totalpayment"
          value={formData.totalpayment}
          label="TOTAL PAYMENT"
          inputProps={{
            maxLength: 48,
            style: {
              height: 20,
              fontSize: `${fontSize}px`,
              fontWeight: "bold",
            },
            readOnly: !isEditMode || isDisabled,
          }}
          size="small"
          variant="filled"
          className="custom-bordered-input"
          sx={{ width: 150}}
          />
          <TextField
          id="totalreceipt"
          value={formData.totalreceipt}
          label="TOTAL RECEIPT"
          inputProps={{
            maxLength: 48,
            style: {
              height: 20,
              fontSize: `${fontSize}px`,
              fontWeight: "bold",
            },
            readOnly: !isEditMode || isDisabled,
          }}
          size="small"
          variant="filled"
          className="custom-bordered-input"
          sx={{ width: 150}}
          />
          <TextField
          id="totaldiscount"
          value={formData.totaldiscount}
          label="TOTAL DISCOUNT"
          inputProps={{
            maxLength: 48,
            style: {
              height: 20,
              fontSize: `${fontSize}px`,
              fontWeight: "bold",
            },
            readOnly: !isEditMode || isDisabled,
          }}
          size="small"
          variant="filled"
          className="custom-bordered-input"
          sx={{ width: 150}}
          />
        </div>

        <PrintChoiceModal
          open={printChoiceOpen}
          onClose={() => setPrintChoiceOpen(false)}
          onNormal={handleNormalPrint}
          onFA={handleFAPreview}
        />
 
        <FAVoucherModal
          open={isFAModalOpen}
          onClose={() => setIsFAModalOpen(false)}
          tenant="shkun_05062025_05062026"
          voucherno={formData?.voucherno}
          vtype="C"
        />


        {/* <PrintVoucherModal
        show={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        onSelect={async (type) => {
          setShowPrintModal(false);
        
          if (type === "normal") {
            handleOpen(); // your existing function
          } else if (type === "fa") {
            try {
              const res = await axios.get(
                `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cashfafile/byVoucher?vtype=C&voucherno=${formData.voucherno}&rebuild=1&save=1`
              );
              setFAVoucherData(res.data);
              setShowFAModal(true);
            } catch (err) {
              toast.error("Error loading FA voucher");
            }
          }
        }}
          
        /> */}
        {/* <Modal
          show={showFAModal}
          onHide={() => setShowFAModal(false)}
          dialogClassName="modal-xl"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Cash Voucher Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ height: "80vh" }}>
            {faVoucherData ? (
              <PDFViewer style={{ width: "100%", height: "100%" }}>
                <FAVoucherPDF data={faVoucherData} />
              </PDFViewer>
            ) : (
              <div>Loading...</div>
            )}
          </Modal.Body>
        </Modal> */}

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
            onClick={handleSearchClick} // Handle search button click
            disabled={!isSearchEnabled}
          >
            Search
          </Button>
          {/* Modal for Search */}
          <Modal
            show={showSearchModal}
            onHide={handleCloseSearchModal}
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Search by Date</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Input for Date */}
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="date"
                  className="form-control"
                  onChange={(e) => handleSearch(e.target.value)} // Fetch data when the date is selected
                />
              </div>
              {/* Search Results */}
              {searchResults.length > 0 ? (
                <Table bordered hover>
                  <thead>
                    <tr>
                      <th>Voucher No.</th>
                      <th>Date</th>
                      <th>Cash In Hand</th>
                      <th>Total Payment</th>
                      <th>Total Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((result, index) => (
                      <tr
                        key={index}
                        onClick={() => handleSelectSearchResult(result)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{result.formData.voucherno}</td>
                        <td>
                          {new Date(result.formData.date).toLocaleDateString()}
                        </td>
                        <td>{result.formData.cashinhand}</td>
                        <td>{result.formData.totalpayment}</td>
                        <td>{result.formData.totalreceipt}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No results found</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseSearchModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[7] }}
            // onClick={() => setIsFAModalOpen(true)}
            onClick={handlePrintClick}
            disabled={!isPrintEnabled}
          >
            Print
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[8] }}
            onClick={handleDeleteClick}
            disabled={!isDeleteEnabled}
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
          <Button
            ref={saveButtonRef}
            className="Buttonz"
            onClick={handleSaveClick}
            disabled={!isSubmitEnabled}
            style={{ color: "black", backgroundColor: buttonColors[10] }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

const styles2 = {
  days: {
    display: "block",
    fontSize: "22px",
    fontWeight: "bold",
  },
  dates: {
    display: "block",
    fontSize: "20px",
    fontWeight: "bold",
  },
};

export default CashVoucher;

// // NEW BELOW 
// import React, { useState, useEffect, useRef } from "react";
// import "./CashVoucher.css";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Table from "react-bootstrap/Table";
// import Button from "react-bootstrap/Button";
// import { motion } from "framer-motion";
// import ProductModalCustomer from "../Modals/ProductModalCustomer";
// import { StyleSheet, Font } from "@react-pdf/renderer";
// import axios from "axios";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { FaPlus, FaMinus } from "react-icons/fa";
// import { Modal } from "react-bootstrap"; // Import Bootstrap components
// import { useEditMode } from "../../EditModeContext";
// import { last } from "lodash";
// import InvoicePDFcash from "../InvoicePDFcash";
// import { CompanyContext } from "../Context/CompanyContext";
// import { useContext } from "react";
// import TextField from "@mui/material/TextField";
// import {IconButton} from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import PrintVoucherModal from "./PrintVoucherModal"; // import the modal
// import FAVoucherPDF from "./FAVoucherPreview";
// import { PDFViewer } from "@react-pdf/renderer";

// // Register font
// Font.register({
//   family: "Roboto",
//   src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
// });

// const CashVoucher = () => {
//    const { company } = useContext(CompanyContext);
//       const tenant = company?.databaseName;
//       //  const tenant = "shkun_05062025_05062026"
   
//       if (!tenant) {
//         // you may want to guard here or show an error state,
//         // since without a tenant you can’t hit the right API
//         console.error("No tenant selected!");
//       }
      
//   const tableRef = useRef(null);
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const [currentDate, setCurrentDate] = useState("");
//   const [currentDay, setCurrentDay] = useState("");
//   const datePickerRef = useRef(null);
//   const voucherRef = useRef(null);
//   const [title, setTitle] = useState("VIEW");
//   const accountNameRefs = useRef([]);
//   const narrationRefs = useRef([]);
//   const paymentRefs = useRef([]);
//   const receiptRefs = useRef([]);
//   const discountRefs = useRef([]);
//   const saveButtonRef = useRef(null);
//   const [isSaving, setIsSaving] = useState(false);
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
//   const [buttonColors, setButtonColors] = useState(initialColors);
//   const [showSearchModal, setShowSearchModal] = useState(false); // State to handle modal visibility
//   const [searchResults, setSearchResults] = useState([]); // State to store search results
//   const [formData, setFormData] = useState({
//     vtype: "C",
//     date: "",
//     voucherno: 0,
//     cashinhand: "",
//     owner: "",
//     user: "",
//     totalpayment: "",
//     totalreceipt: "",
//     totaldiscount: "",
//   });
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       acode:"",
//       accountname: "",
//       narration: "",
//       payment_debit: 0.0,
//       receipt_credit: 0.0,
//       discount: 0.0,
//       discounted_payment: "",
//       discounted_receipt: "",
//       disablePayment: false,
//       disableReceipt: false,
//     },
//   ]);
// // DateError
//   useEffect(() => {
//     const date = new Date();
//     const options = { weekday: "long" };
//     const day = new Intl.DateTimeFormat("en-US", options).format(date);

//     const formattedDate = date.toLocaleDateString();

//     setCurrentDate(formattedDate);
//     setCurrentDay(day);
//   }, []);

//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [dayName, setDayName] = useState("");
//   const getDayName = (date) => {
//     const daysOfWeek = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];
//     return daysOfWeek[date.getDay()];
//   };
//   // Date
// useEffect(() => {
//   // If formData.date has a valid date string, parse it and set selectedDate
//   if (formData.date) {
//     try {
//       const date = new Date(formData.date);
//       if (!isNaN(date.getTime())) {
//         setSelectedDate(date);
//       } else {
//         console.error("Invalid date value in formData.date:", formData.date);
//       }
//     } catch (error) {
//       console.error("Error parsing date:", error);
//     }
//   } else {
//     // If there's no date, we keep selectedDate as null so the DatePicker is blank,
//     // but we can still have it open on today's date via openToDate
//     setSelectedDate(null);
//   }
// }, [formData.date]);

//   const handleDateChange = (date) => {
//     if (date instanceof Date && !isNaN(date)) {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0); // Set today's date to midnight

//       const selectedDate = new Date(date);
//       selectedDate.setHours(0, 0, 0, 0); // Set selected date to midnight too

//       if (selectedDate > today) {
//         toast.info("You Have Selected a Future Date.", {
//           position: "top-center",
//         });
//       }

//       setSelectedDate(date);
//       const formattedDate = date.toISOString().split("T")[0];
//       setFormData((prev) => ({ ...prev, date: date }));
//     } else {
//       console.error("Invalid date value");
//     }
//   };

// const handleCalendarClose = () => {
//   // If no date is selected when the calendar closes, default to today's date
//   if (!selectedDate) {
//     const today = new Date();
//     setSelectedDate(today);
//   }
// };

//   // Search functions
//   const handleSearchClick = () => {
//     setSearchResults([]); // Clear the search results when reopening the modal
//     setShowSearchModal(true); // Open the modal
//   };

//   const handleCloseSearchModal = () => {
//     setSearchResults([]); // Clear search results when the modal is closed
//     setShowSearchModal(false); // Close the modal
//   };

//   const handleSelectSearchResult = (selectedData) => {
//     setFormData(selectedData.formData); // Update the form with the selected search data
//     setItems(selectedData.items); // Update items with the selected search result
//     setShowSearchModal(false); // Close the modal
//     setSearchResults([]); // Clear search results after selecting a result
//   };

//   const handleSearch = async (searchDate) => {
//     try {
//       // console.log(searchDate,"Hellloooo");
    
//       const response = await axios.get(
//       `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/search?date=${searchDate}`
//       );

//       if (response.status === 200) {
//         setSearchResults(response.data.data); // Assuming the data is in response.data.data
//       } else {
//         setSearchResults([]); // Clear results if no data is found
//       }
//     } catch (error) {
//       console.error("Error fetching search data", error);
//     }
//   };
  
//   const [firstTimeCheckData, setFirstTimeCheckData] = useState("");
//   // Fetch Data
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
//   const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
//   const [showPrintModal, setShowPrintModal] = useState(false);
//   const [showFAModal, setShowFAModal] = useState(false);
//   const [faVoucherData, setFAVoucherData] = useState(null);
  
//   const fetchData = async () => {
//     try {
//       const response = await axios.get(`  https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/last`);

//       if (response.status === 200 && response.data.data) {
//         const lastEntry = response.data.data;
//         // Set flags and update form data
//         setFirstTimeCheckData("DataAvailable");
//         setFormData(lastEntry.formData);
//         // console.log(lastEntry.formData, "fetchFormdata");

//         // Update items with the last entry's items
//         const updatedItems = lastEntry.items.map((item) => ({
//           ...item, // Ensure immutability
//           disableReceipt: item.disableReceipt || false, // Handle disableReceipt flag safely
//         }));
//         setItems(updatedItems);

//         // Calculate total payment, total receipt, and total discount
//         const totalPayment = updatedItems
//           .reduce((sum, item) => sum + parseFloat(item.payment_debit || 0), 0)
//           .toFixed(2);
//         const totalReceipt = updatedItems
//           .reduce((sum, item) => sum + parseFloat(item.receipt_credit || 0), 0)
//           .toFixed(2);
//         const totalDiscount = updatedItems
//           .reduce((sum, item) => sum + parseFloat(item.discount || 0), 0)
//           .toFixed(2);

//         // Update formData with the calculated totals
//         setFormData((prevFormData) => ({
//           ...prevFormData,
//           totalpayment: totalPayment,
//           totalreceipt: totalReceipt,
//           totaldiscount: totalDiscount,
//         }));

//         // Set data and index
//         setData1(lastEntry); // Assuming setData1 holds the current entry data
//         setIndex(lastEntry.voucherno); // Set index to the voucher number or another identifier
//         return lastEntry; // ✅ Return this for use in handleAdd
//       } else {
//         setFirstTimeCheckData("DataNotAvailable");
//         console.log("No data available");
//         // Create an empty data object with voucher number 0
//         const emptyFormData = {
//           voucherno: 0,
//           date: new Date().toLocaleDateString(), // Use today's date
//           cashinhand: "",
//           owner: "Owner",
//           user: "",
//           totalpayment: "0.00",
//           totalreceipt: "0.00",
//           totaldiscount: "0.00",
//         };
//         const emptyItems = [
//           {
//             id: 1,
//             acode:"",
//             accountname: "",
//             narration: "",
//             payment_debit: 0.0,
//             receipt_credit: 0.0,
//             discount: 0.0,
//             discounted_payment: "0.00",
//             discounted_receipt: "0.00",
//             disablePayment: false,
//             disableReceipt: false,
//           },
//         ];

//         // Set the empty data
//         setFormData(emptyFormData);
//         setItems(emptyItems);
//         setData1({ formData: emptyFormData, items: emptyItems }); // Store empty data
//         setIndex(0); // Set index to 0 for the empty voucher
//       }
//     } catch (error) {
//       console.error("Error fetching data", error);

//       // In case of error, you can also initialize empty data if needed
//       const emptyFormData = {
//         voucherno: 0,
//         date: new Date().toLocaleDateString(),
//         cashinhand: "",
//         owner: "Owner",
//         user: "",
//         totalpayment: "0.00",
//         totalreceipt: "0.00",
//         totaldiscount: "0.00",
//       };
//       const emptyItems = [
//         {
//           id: 1,
//           acode:"",
//           accountname: "",
//           narration: "",
//           payment_debit: 0.0,
//           receipt_credit: 0.0,
//           discount: 0.0,
//           discounted_payment: "0.00",
//           discounted_receipt: "0.00",
//           disablePayment: false,
//           disableReceipt: false,
//         },
//       ];
//       setFormData(emptyFormData);
//       setItems(emptyItems);
//       setData1({ formData: emptyFormData, items: emptyItems });
//       setIndex(0);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);
  
//   useEffect(() => {
//     if (data.length > 0) {
//       setFormData(data[data.length - 1]);
//       setIndex(data.length - 1);
//     }
//   }, [data]);

//   // Add this line to set isDisabled to true initially
//   useEffect(() => {
//     setIsDisabled(true);
//   }, []);

//   const handleNext = async () => {
//     document.body.style.backgroundColor = "white";
//     setTitle("View");
//     // console.log(data1._id)
//     try {
//       if (data1) {
//         const response = await axios.get(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/next/${data1._id}`
//         );
//         if (response.status === 200 && response.data) {
//           const nextData = response.data.data;
//           setData1(response.data.data);
//           setIndex(index + 1);
//           setFormData(nextData.formData);
//           const updatedItems = nextData.items.map((item) => ({
//             ...item,
//             disableReceipt: item.disableReceipt || false,
//           }));
//           setItems(updatedItems);
//           setIsDisabled(true);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching next record:", error);
//     }
//   };

//   const handlePrevious = async () => {
//     document.body.style.backgroundColor = "white";
//     setTitle("View");
//     try {
//       if (data1) {
//         const response = await axios.get(
//           `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/previous/${data1._id}`
//         );
//         if (response.status === 200 && response.data) {
//           // console.log(response);
//           setData1(response.data.data);
//           const prevData = response.data.data;
//           setIndex(index - 1);
//           setFormData(prevData.formData);
//           const updatedItems = prevData.items.map((item) => ({
//             ...item,
//             disableReceipt: item.disableReceipt || false,
//           }));
//           setItems(updatedItems);
//           setIsDisabled(true);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching previous record:", error);
//     }
//   };

//   const handleFirst = async () => {
//     document.body.style.backgroundColor = "white";
//     setTitle("View");

//     try {
//       const response = await axios.get(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/first`
//       );
//       if (response.status === 200 && response.data) {
//         const firstData = response.data.data;
//         setIndex(0);
//         setFormData(firstData.formData);
//         setData1(response.data.data);
//         const updatedItems = firstData.items.map((item) => ({
//           ...item,
//           disableReceipt: item.disableReceipt || false,
//         }));
//         setItems(updatedItems);
//         setIsDisabled(true);
//       }
//     } catch (error) {
//       console.error("Error fetching first record:", error);
//     }
//   };

//   const handleLast = async () => {
//     document.body.style.backgroundColor = "white";
//     setTitle("View");

//     try {
//       const response = await axios.get(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/last`
//       );
//       if (response.status === 200 && response.data) {
//         const lastData = response.data.data;
//         const lastIndex = response.data.length - 1;
//         setIndex(lastIndex);
//         setFormData(lastData.formData);
//         setData1(response.data.data);
//         const updatedItems = lastData.items.map((item) => ({
//           ...item,
//           disableReceipt: item.disableReceipt || false,
//         }));
//         setItems(updatedItems);
//         setIsDisabled(true);
//       }
//     } catch (error) {
//       console.error("Error fetching last record:", error);
//     }
//   };

//   const handleAdd = async () => {
//     setTitle("NEW");
//     try {
//       const lastEntry = await fetchData(); // This should set up the state correctly whether data is found or not
//       let lastvoucherno = lastEntry?.formData?.voucherno ? parseInt(lastEntry.formData.voucherno) + 1 : 1;
//       const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
//       const newData = {
//         vtype: "C",
//         date: today,
//         voucherno: lastvoucherno,
//         cashinhand: "",
//         owner: "Owner",
//         user: "",
//         totalpayment: "",
//         totalreceipt: "",
//         totaldiscount: "",
//       };
//       setData([...data, newData]);
//       setFormData(newData);
//       setItems([
//         {
//           id: 1,
//           acode:"",
//           accountname: "",
//           narration: "",
//           payment_debit: 0.0,
//           receipt_credit: 0.0,
//           discount: 0,
//           discounted_payment: "",
//           discounted_receipt: "",
//           disablePayment: false,
//           disableReceipt: false,
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
//       if (datePickerRef.current) {
//         datePickerRef.current.setFocus();
//       }
//       // voucherRef.current.focus()
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
//     if (accountNameRefs.current[0]) {
//       accountNameRefs.current[0].focus();
//     }
//   };
//   const calculateCashInHand = () => {
//     const totalPayment = parseFloat(formData.totalpayment) || 0;
//     const totalReceipt = parseFloat(formData.totalreceipt) || 0;
//     const cashInHand = totalPayment - totalReceipt;
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       cashinhand: cashInHand.toFixed(2),
//     }));
//   };

//   const handleInputChange = (event) => {
//     const { id, value } = event.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [id]: value,
//     }));
//   };
//   const calculateTotalDiscount = () => {
//     // Calculate the total discount by summing up all discount values
//     const totalDiscount = items.reduce((acc, item) => {
//       return acc + parseFloat(item.discount || 0);
//     }, 0);
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       totaldiscount: totalDiscount.toFixed(2),
//     }));
//   };

//   const calculateTotalPayment = () => {
//     // Calculate the total payment by summing up all payment_debit values
//     const totalPayment = items.reduce((acc, item) => {
//       return acc + parseFloat(item.payment_debit || 0);
//     }, 0);
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       totalpayment: totalPayment.toFixed(2),
//     }));
//   };

//   const calculateTotalReceipt = () => {
//     // Calculate the total receipt by summing up all receipt_credit values
//     const totalReceipt = items.reduce((acc, item) => {
//       return acc + parseFloat(item.receipt_credit || 0);
//     }, 0);
//     setFormData((prevFormData) => ({
//       ...prevFormData,
//       totalreceipt: totalReceipt.toFixed(2),
//     }));
//   };

//   const handleNumberChange = (event, index, field) => {
//     const value = event.target.value;
//     if (!/^\d*\.?\d*$/.test(value)) {
//       return;
//     }
//     const updatedItems = [...items];
//     updatedItems[index][field] = value;
//     const isValueGreaterThanZero = parseFloat(value) > 0;

//     if (field === "payment_debit") {
//       updatedItems[index].disableReceipt = isValueGreaterThanZero;
//     } else if (field === "receipt_credit") {
//       updatedItems[index].disablePayment = isValueGreaterThanZero;
//     }
//     setItems(updatedItems);
//     // Calculate totals after updating items
//     calculateTotalPayment();
//     calculateTotalReceipt();
//     calculateTotalDiscount();
//     calculateCashInHand();
//   };

//   const capitalizeWords = (str) => {
//     return str.replace(/\b\w/g, (char) => char.toUpperCase());
//   };

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

//   const handleItemChangeCus = (index, key, value) => {
//     if ((key === "discount") && !/^\d*\.?\d*$/.test(value)) {
//       return; // reject invalid input
//     }
//     const updatedItems = [...items];
//     updatedItems[index][key] = capitalizeWords(value); // Capitalize words here
//     calculateTotalDiscount();
//     // If the key is 'name', find the corresponding product and set the price
//     if (key === "name") {
//       const selectedProduct = productsCus.find(
//         (product) => product.ahead === value
//       );
//       if (selectedProduct) {
//         updatedItems[index]["accountname"] = selectedProduct.ahead;
//       }
//     } else if (key === "discount" || key === "payment_debit" ||key === "receipt_credit") {
//       const payment = parseFloat(updatedItems[index]["payment_debit"]) || 0;
//       const discount = parseFloat(updatedItems[index]["discount"]) || 0;
//       const discountedPayment = payment - discount;
//       const receipt = parseFloat(updatedItems[index]["receipt_credit"]) || 0;

//       let discountedReceipt = receipt - discount;
//       if (updatedItems[index].disableReceipt) {
//         discountedReceipt = 0; // Set to zero if receipt field is disabled
//       }

//       let discounted_payment = discountedPayment;
//       if (updatedItems[index].disablePayment) {
//         discounted_payment = 0; // Set to zero if payment field is disabled
//       }

//       updatedItems[index]["payment_debit"] = payment.toFixed(2);
//       updatedItems[index]["discounted_payment"] = discounted_payment.toFixed(2);
//       updatedItems[index]["receipt_credit"] = receipt.toFixed(2);
//       updatedItems[index]["discounted_receipt"] = discountedReceipt.toFixed(2);
//       updatedItems[index]["discount"] = discount;
//     }
//     setItems(updatedItems);
//   };
//   const handleAddItem = () => {
//     if (isEditMode) {
//       const newItem = {
//         id: items.length + 1,
//         accountname: "",
//         narration: "",
//         payment_debit: 0.0,
//         receipt_credit: 0.0,
//         discount: "",
//         discounted_payment: "",
//         discounted_receipt: "",
//         disablePayment: false,
//         disableReceipt: false,
//       };

//       // Update the state with the new item
//       setItems([...items, newItem]);
//       setTimeout(() => {
//         accountNameRefs.current[items.length].focus();
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


//   const handleProductSelectCus = (product) => {
//     if (!product) {
//       alert("No product received!");
//       setShowModalCus(false);
//       return;
//     }
  
//     // clone the array
//     const newCustomers = [...items];
  
//     // overwrite the one at the selected index
//     newCustomers[selectedItemIndexCus] = {
//       ...newCustomers[selectedItemIndexCus],
//       accountname: product.ahead || '', 
//       acode: product.acode || '', 
//     };
//     const nameValue = product.ahead || product.name || "";
//     if (selectedItemIndexCus !== null) {
//       handleItemChangeCus(selectedItemIndexCus, "name", nameValue);
//       setShowModalCus(false);
//       setTimeout(() => {
//         narrationRefs.current[selectedItemIndexCus].focus();
//       }, 100);
//     }
//     setItems(newCustomers);
//     setIsEditMode(true);
//     setShowModalCus(false);
  
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
//     Object.keys(product).forEach((key) => {
//       if (!fields.includes(key)) {
//         fields.push(key);
//       }
//     });

//     return fields;
//   }, []);


// const handleSaveClick = async () => {
//   document.body.style.backgroundColor = 'white';

//   const filledRows = items.filter(item => item.accountname !== '');
//   if (filledRows.length === 0) {
//     toast.error("Please fill in at least one account name before saving.", { position: "top-center" });
//     return;
//   }

//   const isValidTransaction = filledRows.every(item =>
//     parseFloat(item.payment_debit) > 0 || parseFloat(item.receipt_credit) > 0
//   );
//   if (!isValidTransaction) {
//     toast.error("Payment or Receipt must be greater than 0.", { position: "top-center" });
//     return;
//   }

//   setIsSaving(true);
//   try {
//     const combinedData = {
//       _id: formData._id,
//       formData: {
//         date: selectedDate.toLocaleDateString("en-IN"), // DD/MM/YYYY for India
//         dateFormat: "DD/MM/YYYY",                       // tell backend how to parse
//         vtype: formData.vtype,
//         voucherno: formData.voucherno,
//         cashinhand: formData.cashinhand || "",
//         owner: formData.owner,
//         user: formData.user || "",
//         totalpayment: formData.totalpayment,
//         totalreceipt: formData.totalreceipt,
//         totaldiscount: formData.totaldiscount,
//         decimals: cashSetup.decimals ?? decimalValue ?? 2,
//       },

//       // NEW: pass cash ledger explicitly
//       cashdetails: {
//         cashname: cashSetup.name,  // e.g., "Cash in Hand CASH"
//         code: cashSetup.code,      // e.g., "10002"
//       },

//       items: filledRows.map(item => ({
//         id: item.id,
//         acode: item.acode,
//         accountname: item.accountname,
//         narration: item.narration,
//         payment_debit: item.payment_debit,
//         receipt_credit: item.receipt_credit,
//         discount: item.discount,
//         discounted_payment: item.discounted_payment,
//         discounted_receipt: item.discounted_receipt,
//         name: item.name,
//         disableReceipt: item.disableReceipt,
//         disablePayment: item.disablePayment,
//       })),
//     };
  
//     const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash${isAbcmode ? `/${data1._id}` : ''}`;
//     const method = isAbcmode ? 'put' : 'post';

//     const response = await axios({ method, url: apiEndpoint, data: combinedData });

//     if (response?.status === 200 || response?.status === 201) {
//       toast.success("Data Saved Successfully!", { position: "top-center" });
//       setIsAddEnabled(true);
//       setIsDisabled(true);
//       setIsEditMode(false);
//       setIsSubmitEnabled(false);
//       setIsPreviousEnabled(true);
//       setIsNextEnabled(true);
//       setIsFirstEnabled(true);
//       setIsLastEnabled(true);
//       setIsSearchEnabled(true);
//       setIsSPrintEnabled(true);
//       setIsDeleteEnabled(true);
//       setTitle('VIEW');
//     } else {
//       throw new Error(`Unexpected response status: ${response?.status}`);
//     }
//   } catch (error) {
//     console.error('Error saving data:', error?.response?.data || error.message);
//     toast.error(`Failed to save data. ${error?.response?.data?.message || "Please try again."}`, { position: "top-center" });
//   } finally {
//     setIsSaving(false);
//   }
// };



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
//     setIsSaving(true);
//     try {
//       const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/${data1._id}`;
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
//       setIsSaving(false);
//     }
//   };

//   const [fontSize, setFontSize] = useState(18);
//   const increaseFontSize = () => {
//     setFontSize((prevSize) => (prevSize < 20 ? prevSize + 2 : prevSize));
//   };
//   const decreaseFontSize = () => {
//     setFontSize((prevSize) => (prevSize > 14 ? prevSize - 2 : prevSize));
//   };

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

//   const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
//   const handleKeyDown = (event, index, field) => {
//     if (event.key === "Enter") {
//       switch (field) {
//         case "accountname":
//           if (items[index].accountname.trim() === "") {
//             saveButtonRef.current.focus();
//           } else {
//             narrationRefs.current[index]?.focus();
//           }
//           break;
//           case "narration":
//             if (items[index].accountname.trim() === "") {
//               saveButtonRef.current?.focus();
//             } else {
//               if (items[index].disablePayment) {
//                 // If debit is disabled, move focus to credit
//                 receiptRefs.current[index]?.focus();
//               } else {
//                 paymentRefs.current[index]?.focus();
//               }
//             }
//             break;
//         case "payment_debit":
//           if (!items[index].disableReceipt) {
//             receiptRefs.current[index]?.focus();
//           } else {
//             if (
//               accountNameRefs.current[index].value.trim().length > 0 &&
//               items[index].payment_debit.trim().length > 0
//             ) {
//               discountRefs.current[index]?.focus();
//             } else {
//               alert("Account name and Payment/Receipt cannot be empty");
//               paymentRefs.current[index]?.focus();
//             }
//           }
//           break;
//         case "receipt_credit":
//           if (accountNameRefs.current[index].value.trim().length > 0 && items[index].receipt_credit.trim().length > 0) {
//             discountRefs.current[index]?.focus();
//           } else {
//             alert("Account name and Payment/Receipt cannot be empty");
//             receiptRefs.current[index]?.focus();
//           }
//           break;
//         case "discount":
//           if (index === items.length - 1) {
//             handleAddItem();
//             accountNameRefs.current[index + 1]?.focus();
//           } else {
//             accountNameRefs.current[index + 1]?.focus();
//           }
//           break;
//         default:
//           break;
//       }
//     } 
//     // Move Right (→)
//     else if (event.key === "ArrowRight") {
//       if (field === "accountname"){ narrationRefs.current[index]?.focus();
//         setTimeout(() => narrationRefs.current[index]?.select(), 0);
//       }
//       if (field === "narration") {
//         if (!items[index].disablePayment){ paymentRefs.current[index]?.focus();
//           setTimeout(() => paymentRefs.current[index]?.select(), 0);
//         }
//         else {receiptRefs.current[index]?.focus();
//         setTimeout(() => receiptRefs.current[index]?.select(), 0);
//         }
//       }
//       // else if (field === "narration"){ paymentRefs.current[index]?.focus();
//       //   setTimeout(() => paymentRefs.current[index]?.select(), 0);
//       // }
//       else if (field === "payment_debit" && !items[index].disableReceipt){
//         receiptRefs.current[index]?.focus();
//         setTimeout(() => receiptRefs.current[index]?.select(), 0);
//       }
//       else if (field === "payment_debit" && items[index].disableReceipt){
//         discountRefs.current[index]?.focus();
//         setTimeout(() => discountRefs.current[index]?.select(), 0);
//       }
//       else if (field === "receipt_credit"){ discountRefs.current[index]?.focus();
//         setTimeout(() => discountRefs.current[index]?.select(), 0);
//       }
//     } 
//     // Move Left (←)
//     else if (event.key === "ArrowLeft") {
//       if (field === "discount") {
//         if (!items[index].disableReceipt){ receiptRefs.current[index]?.focus();
//           setTimeout(() => receiptRefs.current[index]?.select(), 0);
//         }
//         else {paymentRefs.current[index]?.focus();
//         setTimeout(() => paymentRefs.current[index]?.select(), 0);
//         }
//       } 
//       if (field === "receipt_credit") {
//         if (!items[index].disablePayment){ discountRefs.current[index]?.focus();
//           setTimeout(() => discountRefs.current[index]?.select(), 0);
//         }
//         else {narrationRefs.current[index]?.focus();
//         setTimeout(() => narrationRefs.current[index]?.select(), 0);
//         }
//       } 
//       // else if (field === "receipt_credit"){ paymentRefs.current[index]?.focus();
//       //   setTimeout(() => paymentRefs.current[index]?.select(), 0);
//       // }
//       else if (field === "payment_debit"){ narrationRefs.current[index]?.focus();
//         setTimeout(() => narrationRefs.current[index]?.select(), 0);
//       }
//       else if (field === "narration"){ accountNameRefs.current[index]?.focus();
//         setTimeout(() => accountNameRefs.current[index]?.select(), 0);
//       }
//     } 

//     // Move Up
//  else if (event.key === "ArrowUp" && index > 0) {
//   setTimeout(() => {
//     if (field === "accountname") accountNameRefs.current[index - 1]?.focus();
//     else if (field === "narration") narrationRefs.current[index - 1]?.focus();
//     else if (field === "payment_debit") paymentRefs.current[index - 1]?.focus();
//     else if (field === "receipt_credit") receiptRefs.current[index - 1]?.focus();
//     else if (field === "discount") discountRefs.current[index - 1]?.focus();
//   }, 100);
// } 
// // Move Down
// else if (event.key === "ArrowDown" && index < items.length - 1) {
//   setTimeout(() => {
//     if (field === "accountname") accountNameRefs.current[index + 1]?.focus();
//     else if (field === "narration") narrationRefs.current[index + 1]?.focus();
//     else if (field === "payment_debit") paymentRefs.current[index + 1]?.focus();
//     else if (field === "receipt_credit") receiptRefs.current[index + 1]?.focus();
//     else if (field === "discount") discountRefs.current[index + 1]?.focus();
//   }, 100);
// } 
//     // Open Modal on Letter Input in Account Name
//     else if (/^[a-zA-Z]$/.test(event.key) && field === "accountname") {
//       setPressedKey(event.key);
//       openModalForItemCus(index);
//       event.preventDefault();
//     }
//   };
  

//   const handleExit = async () => {
//     document.body.style.backgroundColor = "white"; // Reset background color
//     setTitle("View");
//     try {
//       const response = await axios.get(
//         `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cash/last`
//       ); // Fetch the latest data

//       if (response.status === 200 && response.data.data) {
//         // If data is available
//         const lastEntry = response.data.data;
//         setFormData(lastEntry.formData); // Set form data

//         const updatedItems = lastEntry.items.map((item) => ({
//           ...item,
//           disableReceipt: item.disableReceipt || false,
//         }));
//         setItems(updatedItems);
//         setIsDisabled(true);
//         setIndex(lastEntry.formData);
//         setIsAddEnabled(true);
//         setIsSubmitEnabled(false);
//         setIsPreviousEnabled(true);
//         setIsNextEnabled(true);
//         setIsFirstEnabled(true);
//         setIsLastEnabled(true);
//         setIsSearchEnabled(true);
//         setIsSPrintEnabled(true);
//         setIsDeleteEnabled(true);
//         // Update totals
//         const totalPayment = updatedItems
//           .reduce((sum, item) => sum + parseFloat(item.payment_debit || 0), 0)
//           .toFixed(2);
//         const totalReceipt = updatedItems
//           .reduce((sum, item) => sum + parseFloat(item.receipt_credit || 0), 0)
//           .toFixed(2);
//         const totalDiscount = updatedItems
//           .reduce((sum, item) => sum + parseFloat(item.discount || 0), 0)
//           .toFixed(2);

//         setFormData((prevFormData) => ({
//           ...prevFormData,
//           totalpayment: totalPayment,
//           totalreceipt: totalReceipt,
//           totaldiscount: totalDiscount,
//         }));
//       } else {
//         // If no data is available, initialize with default values
//         console.log("No data available");
//         const newData = {
//           date: "",
//           voucherno: 0,
//           cashinhand: "",
//           owner: "Owner",
//           user: "",
//           totalpayment: "",
//           totalreceipt: "",
//           totaldiscount: "",
//         };
//         setFormData(newData); // Set default form data

//         // Initialize with a single empty item
//         setItems([
//           {
//             accountname: "",
//             narration: "",
//             payment_debit: 0.0,
//             receipt_credit: 0.0,
//             discount: 0.0,
//             discounted_payment: "",
//             discounted_receipt: "",
//             disablePayment: false,
//             disableReceipt: false,
//           },
//         ]);

//         setIsDisabled(true); // Disable fields after loading the default data
//       }
//     } catch (error) {
//       console.error("Error fetching data", error);
//     }
//   };

//   const updateTotals = () => {
//     calculateTotalPayment();
//     calculateTotalReceipt();
//     calculateTotalDiscount();
//     calculateCashInHand();
//   };
//   const [shopName, setShopName] = useState("SHADOW ARISE PVT LTD."); // Set default value here
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

//   const [backgroundColor, setBackgroundColor] = useState("");

//   const [decimalValue, setdecimalValue] = useState(0);
//     // const fetchCashBankSetup = async () => {
//     //   try {
//     //     const response = await fetch(
//     //       `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/cashbanksetup`
//     //     );
//     //     if (!response.ok) throw new Error("Failed to fetch sales setup");
  
//     //     const data = await response.json();
  
//     //     if (Array.isArray(data) && data.length > 0 && data[0].formData) {
//     //       const formDataFromAPI = data[0].formData;
//     //       setdecimalValue(formDataFromAPI.decimals);
//     //       console.log(decimalValue);
          
//     //     } else {
//     //       throw new Error("Invalid response structure");
//     //     }
//     //   } catch (error) {
//     //     console.error("Error fetching sales setup:", error.message);
//     //   }
//     // };
//     // state
// const [cashSetup, setCashSetup] = useState({ name: 'Cash A/c', code: '', decimals: 2 });

// const fetchCashBankSetup = async () => {
//   try {
//     const response = await fetch(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/cashbanksetup`);
//     if (!response.ok) throw new Error("Failed to fetch sales setup");

//     const data = await response.json();
//     if (Array.isArray(data) && data.length > 0 && data[0].formData) {
//       const f = data[0].formData;

//       // decimals
//       setdecimalValue(Number(f.decimals ?? 2));

//       // pick the cash ledger from either pair your DB may use
//       const cashName = f.cash_ac_name || f.cash_Ac || 'Cash A/c';
//       const cashCode = f.cash_ac_code || f.cash_code || '';

//       setCashSetup({
//         name: String(cashName),
//         code: String(cashCode),
//         decimals: Number(f.decimals ?? 2),
//       });
//     } else {
//       throw new Error("Invalid response structure");
//     }
//   } catch (error) {
//     console.error("Error fetching sales setup:", error.message);
//   }
// };

//     useEffect(() => {
//       fetchCashBankSetup();
//     }, [decimalValue]);

//   // Update the blur handlers so that they always format the value to 2 decimals.
//   const handlePkgsBlur = (index) => {
//     const decimalPlaces = decimalValue;
//     const updatedItems = [...items];
//     let value = parseFloat(updatedItems[index].payment_debit);
//     if (isNaN(value)) {
//       value = 0;
//     }
//     updatedItems[index].payment_debit = value.toFixed(decimalPlaces);
//     setItems(updatedItems);
//   };

//   const handleWeightBlur = (index) => {
//     const decimalPlaces = decimalValue;
//     const updatedItems = [...items];
//     let value = parseFloat(updatedItems[index].receipt_credit);
//     if (isNaN(value)) {
//       value = 0;
//     }
//     updatedItems[index].receipt_credit = value.toFixed(decimalPlaces);
//     setItems(updatedItems);
//   };

//   const handleRateBlur = (index) => {
//     const decimalPlaces = decimalValue;
//     const updatedItems = [...items];
//     let value = parseFloat(updatedItems[index].discount);
//     if (isNaN(value)) {
//       value = 0;
//     }
//     updatedItems[index].discount = value.toFixed(decimalPlaces);
//     setItems(updatedItems);
//   };

//   const handleOpenModalBack = (event, index, field) => {
//     if (event.key === "Backspace" && field === "accountname") {
//         setSelectedItemIndexCus(index);
//         setShowModalCus(true);
//         event.preventDefault();
//     }
// };

//   return (
//     <div style={{ backgroundColor }}>
//       <ToastContainer />
//       <div style={{ visibility: "hidden", width: 0, height: 0 }}>
//         <InvoicePDFcash
//           formData={formData}
//           items={items}
//           isOpen={open}
//           handleClose={handleClose}
//           GSTIN={GSTIN}
//           PAN={PAN}
//           shopName={shopName}
//           description={description}
//           address={address}
//         />
//       </div>




//       <h1 className="HeaderCASH">CASH VOUCHER</h1>
//       <text className="tittle">{title}</text>
//       <div className="containers">
//         <span style={styles2.dates}>{currentDate}</span>
//         <span style={styles2.days}>{currentDay}</span>
//       </div>
//       {/* <div style={{ marginLeft: "90%", marginTop: -35 }}>
//           <Button onClick={decreaseFontSize}><FaMinus /></Button>
//           <Button style={{ marginLeft: 10 }} onClick={increaseFontSize}><FaPlus /></Button>
//       </div> */}
//       <div className="Tops">
//         <text>DATE</text>
//           <DatePicker
//           popperClassName="custom-datepicker-popper"
//           ref={datePickerRef}
//           className="cashdate"
//           id="date"
//           // If selectedDate is null, nothing is "selected" in the calendar
//           selected={selectedDate || null}
//           // This ensures that if there's no selected date, 
//           // the calendar will open focused on today's date:
//           openToDate={new Date()}
//           onCalendarClose={handleCalendarClose}
//           dateFormat="dd-MM-yyyy"
//           onChange={handleDateChange}
//         />
//         <div style={{display:'flex',flexDirection:'row',marginTop:5}}>
//           <TextField
//           id="voucherno"
//           value={formData.voucherno}
//           label="VOUCHER NO."
//           onFocus={(e) => e.target.select()}  // Select text on focus
//           onKeyDown={handleEnterKeyPress(voucherRef, null)}
//           // onChange={handleInputChange}
//           inputProps={{
//             maxLength: 48,
//             style: {
//               height: 20,
//               fontSize: `${fontSize}px`,
//               fontWeight: "bold",
//             },
//             readOnly: !isEditMode || isDisabled,
//           }}
//           size="small"
//           variant="filled"
//           className="custom-bordered-input"
//           sx={{ width: 150 }}
//           />
//           <TextField
//           id="owner"
//           value={formData.owner}
//           label="USER"
//           onFocus={(e) => e.target.select()}  // Select text on focus
//           // onChange={handleInputChange}
//           inputProps={{
//             maxLength: 48,
//             style: {
//               height: 20,
//               fontSize: `${fontSize}px`,
//               fontWeight: "bold",
//             },
//             readOnly: !isEditMode || isDisabled,
//           }}
//           size="small"
//           variant="filled"
//           className="custom-bordered-input"
//           sx={{ width: 150,marginLeft:1 }}
//           />
//         </div>  
//       </div>
//       <div className="TableSectionz">
//         <Table ref={tableRef} className="custom-table">
//           <thead
//             style={{
//               backgroundColor: "skyblue",
//               textAlign: "center",
//               position: "sticky",
//               top: 0,
//             }}
//           >
//             <tr style={{ color: "white" }}>
//               <th>ACCOUNTNAME</th>
//               <th>NARRATION</th>
//               <th>PAYMENT</th>
//               <th>RECEIPT</th>
//               <th>DISCOUNT</th>
//               {isEditMode && <th className="text-center">DELETE</th>}
//             </tr>
//           </thead>
//           <tbody style={{ overflowY: "auto", maxHeight: "calc(520px - 40px)" }}>
//             {items.map((item, index) => (
//               <tr key={`${item.accountname}-${index}`}>
//                 {" "}
//                 <td style={{ padding: 0 }}>
//                   <input
//                   className="Account"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                     }}
//                     type="text"
//                     value={item.accountname}
//                     readOnly={!isEditMode || isDisabled}
//                     onChange={(e) => { // console.log(accountNameRefs.current[index].value)
//                     }}
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "accountname")
//                       handleOpenModalBack(e, index, "accountname");
//                     }}
                  
//                     ref={(el) => (accountNameRefs.current[index] = el)}
//                     onFocus={(e) => e.target.select()}  // Select text on focus
//                   />
//                 </td>
//                 <td style={{ padding: 0 }}>
//                   <input
//                   className="Narration"
//                     style={{
//                       height: 40,
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                     }}
//                     readOnly={!isEditMode || isDisabled}
//                     value={item.narration}
//                     onChange={(e) =>
//                       handleItemChangeCus(index, "narration", e.target.value)
//                     }
//                     ref={(el) => (narrationRefs.current[index] = el)}
//                     onKeyDown={(e) => {
//                       handleKeyDown(e, index, "narration");
//                     }}
//                     onFocus={(e) => e.target.select()}  // Select text on focus
//                   />
//                 </td>
//                 <td style={{ padding: 0, width: 160 }}>
//                   <input
//                   className="Payment"
//                     style={{
//                       height: 40,
//                       textAlign: "right",
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                     }}
//                     readOnly={!isEditMode || isDisabled}
//                     value={item.payment_debit}
//                     onChange={(e) =>
//                       handleNumberChange(e, index, "payment_debit")
//                     }
//                     disabled={item.disablePayment}
//                     ref={(el) => (paymentRefs.current[index] = el)}
//                     onKeyDown={(e) => handleKeyDown(e, index, "payment_debit")}
//                     onBlur={() => handlePkgsBlur(index)}
//                     onFocus={(e) => e.target.select()}  // Select text on focus
//                   />
//                 </td>
//                 <td style={{ padding: 0, width: 160 }}>
//                   <input
//                   className="Receipt"
//                     style={{
//                       height: 40,
//                       textAlign: "right",
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                       padding: 5,
//                     }}
//                     readOnly={!isEditMode || isDisabled}
//                     value={item.receipt_credit}
//                     onChange={(e) =>
//                       handleNumberChange(e, index, "receipt_credit")
//                     }
//                     disabled={item.disableReceipt}
//                     ref={(el) => (receiptRefs.current[index] = el)}
//                     onKeyDown={(e) => handleKeyDown(e, index, "receipt_credit")}
//                     onBlur={() => handleWeightBlur(index)}
//                     onFocus={(e) => e.target.select()}  // Select text on focus
//                   />
//                 </td>
//                 <td style={{ padding: 0, width: 160 }}>
//                   <input
//                   className="Discounts"
//                     style={{
//                       height: 40,
//                       textAlign: "right",
//                       fontSize: `${fontSize}px`,
//                       width: "100%",
//                       boxSizing: "border-box",
//                       border: "none",
//                     }}
//                     readOnly={!isEditMode || isDisabled}
//                     value={item.discount}
//                     onChange={(e) =>
//                       handleItemChangeCus(index, "discount", e.target.value)
//                     }
//                     ref={(el) => (discountRefs.current[index] = el)}
//                     onKeyDown={(e) => handleKeyDown(e, index, "discount")}
//                     onBlur={() => handleRateBlur(index)}
//                     onFocus={(e) => e.target.select()}  // Select text on focus
//                   />
//                 </td>
//                 {isEditMode && (
//                 <td style={{ padding: 0}}>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center", // horizontally center
//                       alignItems: "center",      // vertically center
//                       height: "100%",            // takes full cell height
//                     }}
//                   >
//                     <IconButton
//                       color="error"
//                       onClick={() => handleDeleteItem(index)}
//                       size="small"
//                     >
//                       <DeleteIcon />
//                     </IconButton>
//                   </div>
//                 </td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       </div>
     
//       <div className="addbutton" style={{ marginTop: 10 }}>
//         <Button className="fw-bold btn-secondary" onClick={handleAddItem}>
//           Add Row
//         </Button>
//       </div>
//       {showModalCus && (
//       <ProductModalCustomer
//         allFields={allFieldsCus}
//         onSelect={handleProductSelectCus}
//         onClose={handleCloseModalCus}
//         initialKey={pressedKey}
//         tenant={tenant}
//       />
//       )}
//       <div className="Belowcontent">
//         <div style={{display:'flex',flexDirection:'row',justifyContent:'end',marginRight:20}}>
//         <TextField
//           id="totalpayment"
//           value={formData.totalpayment}
//           label="TOTAL PAYMENT"
//           inputProps={{
//             maxLength: 48,
//             style: {
//               height: 20,
//               fontSize: `${fontSize}px`,
//               fontWeight: "bold",
//             },
//             readOnly: !isEditMode || isDisabled,
//           }}
//           size="small"
//           variant="filled"
//           className="custom-bordered-input"
//           sx={{ width: 150}}
//           />
//           <TextField
//           id="totalreceipt"
//           value={formData.totalreceipt}
//           label="TOTAL RECEIPT"
//           inputProps={{
//             maxLength: 48,
//             style: {
//               height: 20,
//               fontSize: `${fontSize}px`,
//               fontWeight: "bold",
//             },
//             readOnly: !isEditMode || isDisabled,
//           }}
//           size="small"
//           variant="filled"
//           className="custom-bordered-input"
//           sx={{ width: 150}}
//           />
//           <TextField
//           id="totaldiscount"
//           value={formData.totaldiscount}
//           label="TOTAL DISCOUNT"
//           inputProps={{
//             maxLength: 48,
//             style: {
//               height: 20,
//               fontSize: `${fontSize}px`,
//               fontWeight: "bold",
//             },
//             readOnly: !isEditMode || isDisabled,
//           }}
//           size="small"
//           variant="filled"
//           className="custom-bordered-input"
//           sx={{ width: 150}}
//           />
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
//             onClick={handleSearchClick} // Handle search button click
//             disabled={!isSearchEnabled}
//           >
//             Search
//           </Button>
//           {/* Modal for Search */}
//           <Modal
//             show={showSearchModal}
//             onHide={handleCloseSearchModal}
//             centered
//           >
//             <Modal.Header closeButton>
//               <Modal.Title>Search by Date</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               {/* Input for Date */}
//               <div style={{ marginBottom: "10px" }}>
//                 <input
//                   type="date"
//                   className="form-control"
//                   onChange={(e) => handleSearch(e.target.value)} // Fetch data when the date is selected
//                 />
//               </div>
//               {/* Search Results */}
//               {searchResults.length > 0 ? (
//                 <Table bordered hover>
//                   <thead>
//                     <tr>
//                       <th>Voucher No.</th>
//                       <th>Date</th>
//                       <th>Cash In Hand</th>
//                       <th>Total Payment</th>
//                       <th>Total Receipt</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {searchResults.map((result, index) => (
//                       <tr
//                         key={index}
//                         onClick={() => handleSelectSearchResult(result)}
//                         style={{ cursor: "pointer" }}
//                       >
//                         <td>{result.formData.voucherno}</td>
//                         <td>
//                           {new Date(result.formData.date).toLocaleDateString()}
//                         </td>
//                         <td>{result.formData.cashinhand}</td>
//                         <td>{result.formData.totalpayment}</td>
//                         <td>{result.formData.totalreceipt}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </Table>
//               ) : (
//                 <p>No results found</p>
//               )}
//             </Modal.Body>
//             <Modal.Footer>
//               <Button variant="secondary" onClick={handleCloseSearchModal}>
//                 Close
//               </Button>
//             </Modal.Footer>
//           </Modal>
//           {/* <Button
//             onClick={handleOpen}
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[7] }}
//             disabled={!isPrintEnabled}
//           >
//             Print
//           </Button> */}
//           <Button
//   className="Buttonz"
//   style={{ color: "black", backgroundColor: buttonColors[7] }}
//   onClick={() => setShowPrintModal(true)}
//   disabled={!isPrintEnabled}
// >
//   Print
// </Button>

//           <Button
//             className="Buttonz"
//             style={{ color: "black", backgroundColor: buttonColors[8] }}
//             onClick={handleDeleteClick}
//             disabled={!isDeleteEnabled}
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
//       <PrintVoucherModal
//         show={showPrintModal}
//         onClose={() => setShowPrintModal(false)}
//         onSelect={async (type) => {
//           setShowPrintModal(false);
        
//           if (type === "normal") {
//             handleOpen(); // your existing function
//           } else if (type === "fa") {
//             try {
//               const res = await axios.get(
//                 `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cashfafile/byVoucher?vtype=C&voucherno=${formData.voucherno}&rebuild=1&save=1`
//               );
//               setFAVoucherData(res.data);
//               setShowFAModal(true);
//             } catch (err) {
//               toast.error("Error loading FA voucher");
//             }
//           }
//         }}
        
//       />
//       <Modal
//         show={showFAModal}
//         onHide={() => setShowFAModal(false)}
//         dialogClassName="modal-xl"
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Cash Voucher Preview</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ height: "80vh" }}>
//           {faVoucherData ? (
//             <PDFViewer style={{ width: "100%", height: "100%" }}>
//               <FAVoucherPDF data={faVoucherData} />
//             </PDFViewer>
//           ) : (
//             <div>Loading...</div>
//           )}
//         </Modal.Body>
//       </Modal>
//       </div>
//   );
// };

// const styles2 = {
//   days: {
//     display: "block",
//     fontSize: "22px",
//     fontWeight: "bold",
//   },
//   dates: {
//     display: "block",
//     fontSize: "20px",
//     fontWeight: "bold",
//   },
// };

// export default CashVoucher;