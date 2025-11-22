import React, { useState, useEffect, useRef, forwardRef } from "react";
import "./BankVoucher.css";
import DatePicker from "react-datepicker";
import InputMask from "react-input-mask";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import ProductModalCustomer from "../Modals/ProductModalCustomer";
import ProductModalAccount from "../Modals/ProductModalAccount";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InvoicePDFbank from "../InvoicePDFbank";
import { useEditMode } from "../../EditModeContext";
import { CompanyContext } from "../Context/CompanyContext";
import { useContext } from "react";
import TextField from "@mui/material/TextField";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useLocation } from "react-router-dom";
import PrintChoiceModal from "../Shared/PrintChoiceModal";
import useCompanySetup from "../Shared/useCompanySetup";
import FAVoucherModal from "../Shared/FAVoucherModal";

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

const BankVoucher = () => {

  const companySetup = useCompanySetup();
  const location = useLocation();
  const bankId = location.state?.bankId;
  const navigate = useNavigate();
  const { company } = useContext(CompanyContext);
  // const tenant = company?.databaseName;
  const tenant = "shkun_05062025_05062026"

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    console.error("No tenant selected!");
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const addButtonRef = useRef(null);
  const datePickerRef = useRef(null);
  const VoucherRef = useRef(null);
  const BankRefs = useRef(null);
  const tableRef = useRef(null);
  const accountNameRefs = useRef([]);
  const paymentDebitRefs = useRef([]);
  const receiptCreditRefs = useRef([]);
  const discountRefs = useRef([]);
  const totalRefs = useRef([]);
  const bankChargersRefs = useRef([]);
  const tdsRsRefs = useRef([]);
  const chqnoBankRefs = useRef([]);
  const remarksRefs = useRef([]);
  const saveButtonRef = useRef(null);
  const [title, setTitle] = useState("VIEW");
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
  const [buttonColors, setButtonColors] = useState(initialColors); // Initial colors
  const [fontSize, setFontSize] = useState(17);
  const [formData, setFormData] = useState({
    vtype: "B",
    date: "",
    voucherno: 0,
    user: "Owner",
    totalpayment: "",
    totalreceipt: "",
    totaldiscount: "",
    totalbankcharges: "",
    againstbillno: "",
  });
  const [items, setItems] = useState([
    {
      id: 1,
      accountname: "",
      pan:"",
      Add1:"",
      bsGroup:"",
      payment_debit: "",
      receipt_credit: "",
      discount: "",
      Total: "",
      bankchargers: "",
      tdsRs: "",
      chqnoBank: "",
      remarks: "",
      discounted_payment: "",
      discounted_receipt: "",
      destination: "",
      disablePayment: false,
      disableReceipt: false,
    },
  ]);
  const [bankdetails, setbankdetails] = useState([
    {
      Bankname: "",
      code: "",
    },
  ]);

  useEffect(() => {
    if (addButtonRef.current && !bankId) {
      addButtonRef.current.focus();
    }
  }, []);

  // Naration Suggestions
  const [narrationSuggestions, setNarrationSuggestions] = useState([]);
  const [showNarrationSuggestions, setShowNarrationSuggestions] = useState(true);
  const fetchNarrations = async () => {
    try {
      const res = await fetch(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/bank"
      );
      const data = await res.json();

      // extract narrations from all items
      const narrs = data
        .flatMap(entry => entry.items || [])
        .map(item => item.remarks)
        .filter(n => n && n.trim() !== "");  // remove empty narrations

      // unique values
      const uniqueNarrs = [...new Set(narrs)];

      setNarrationSuggestions(uniqueNarrs);
    } catch (err) {
      console.error("Narration fetch failed:", err);
    }
  };

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

  const [selectedDate, setSelectedDate] = useState(new Date());
  // Date
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

  const handleCalendarClose = () => {
    // If no date is selected when the calendar closes, default to today's date
    if (!selectedDate) {
      const today = new Date();
      setSelectedDate(today);
    }
  };

  const calculateTotalBankCharges = () => {
    const totalBankCharges = items.reduce((acc, item) => {
      return acc + parseFloat(item.bankchargers || 0);
    }, 0);

    setFormData((prevFormData) => ({
      ...prevFormData,
      totalbankcharges: totalBankCharges.toFixed(2),
    }));
  };
  const calculateTotalDiscount = () => {
    const totalDiscount = items.reduce((acc, item) => {
      return acc + parseFloat(item.discount || 0);
    }, 0);

    setFormData((prevFormData) => ({
      ...prevFormData,
      totaldiscount: totalDiscount.toFixed(2),
    }));
  };

  const calculateTotalPayment = () => {
    const totalPayment = items.reduce((acc, item) => {
      return acc + parseFloat(item.payment_debit || 0);
    }, 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalpayment: totalPayment.toFixed(2), // Format to 2 decimal places
    }));
  };
  const calculateTotalReceipt = () => {
    const totalReceipt = items.reduce((acc, item) => {
      return acc + parseFloat(item.receipt_credit || 0);
    }, 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalreceipt: totalReceipt.toFixed(2), // Format to 2 decimal places
    }));
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

  // Fetching LedgerAccount Details
  React.useEffect(() => {
    // Fetch products from the API when the component mounts
    fetchCustomers();
    fetchNarrations();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        `http://localhost:3012/${tenant}/tenant/api/ledgerAccount`
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

  // Modal For Account Name
  const [productsAcc, setProductsAcc] = useState([]);
  const [showModalAcc, setShowModalAcc] = useState(false);
  const [selectedItemIndexAcc, setSelectedItemIndexAcc] = useState(null);
  const [loadingAcc, setLoadingAcc] = useState(true);
  const [errorAcc, setErrorAcc] = useState(null);

  const handleItemChangeAcc = (index, key, value) => {
    if (
      (key === "bankchargers" || key === "tdsRs") &&
      !/^\d*\.?\d*$/.test(value)
    ) {
      return; // reject invalid input
    }
    const updatedItems = [...items];
    updatedItems[index][key] = value;
    calculateTotalPayment();
    calculateTotalReceipt();
    calculateTotalDiscount();
    calculateTotalBankCharges();

    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productsAcc.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["accountname"] = selectedProduct.ahead;
        updatedItems[index]["destination"] = selectedProduct.city;
        updatedItems[index]["pan"] = selectedProduct.pan;
        updatedItems[index]["Add1"] = selectedProduct.add1;
        // alert(updatedItems[index]['destination'] = selectedProduct.city)
      }
    } else if (key === "discount") {
      const payment = parseFloat(updatedItems[index]["payment_debit"]) || 0;
      const receipt = parseFloat(updatedItems[index]["receipt_credit"]) || 0;
      const discount = parseFloat(value) || 0;

      let total = payment + receipt + discount;
      updatedItems[index]["Total"] = total.toFixed(2);

      let discountedPayment = payment - discount;
      updatedItems[index]["discounted_payment"] = updatedItems[index]
        .disablePayment
        ? "0.00"
        : discountedPayment.toFixed(2);

      let discountedReceipt = receipt - discount;
      updatedItems[index]["discounted_receipt"] = updatedItems[index]
        .disableReceipt
        ? "0.00"
        : discountedReceipt.toFixed(2);
    }

    setItems(updatedItems);
  };

    const handleProductSelectAcc = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalAcc(false);
      return;
    }
  
    // Deep copy shipped array
    const updatedShipped = [...items];

    // Update the correct object in the array
    updatedShipped[selectedItemIndexAcc] = {
      ...updatedShipped[selectedItemIndexAcc],
      accountname: product.ahead || "",
      destination: product.city || "",
      pan: product.pan || "",
      Add1: product.add1 || "",
      bsGroup : product.Bsgroup || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexAcc !== null) {
      handleItemChangeAcc(selectedItemIndexAcc, "ahead", nameValue);
      setShowModalAcc(false);
      setTimeout(() => {
        paymentDebitRefs.current[selectedItemIndexAcc].focus();
      }, 100);
    }
    setItems(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalAcc(false);
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

  const handleAddItem = () => {
    if (isEditMode) {
      const newItem = {
        id: items.length + 1,
        accountname: "",
        pan:"",
        Add1:"",
        bsGroup:"",
        payment_debit: "",
        receipt_credit: "",
        discount: "",
        Total: "",
        bankchargers: "",
        tdsRs: "",
        chqnoBank: "",
        remarks: "",
        discounted_payment: "",
        discounted_receipt: "",
        destination: "",
        disablePayment: false,
        disableReceipt: false,
      };
      setItems((prevItems) => [...prevItems, newItem]);
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

  // Modal For BanK Details
  const [productsCus, setProductsCus] = useState([]);
  const [showModalCus, setShowModalCus] = useState(false);
  const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
  const [loadingCus, setLoadingCus] = useState(true);
  const [errorCus, setErrorCus] = useState(null);

  const handleItemChangeCus = (index, key, value) => {
    const updatedItems = [...bankdetails];
    updatedItems[index][key] = value;
    // If the key is 'name', find the corresponding product and set the price
    if (key === "name") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Bankname"] = selectedProduct.ahead;
        updatedItems[index]["code"] = selectedProduct.acode;
      }
    }
    setbankdetails(updatedItems);
  };

    const handleProductSelectCus = (product) => {
    if (!product) {
      alert("No product received!");
      setShowModalCus(false);
      return;
    }
  
    // clone the array
    const newCustomers = [...bankdetails];
  
    // overwrite the one at the selected index
    newCustomers[selectedItemIndexCus] = {
      ...newCustomers[selectedItemIndexCus],
      Bankname: product.ahead || '', 
      code: product.acode || '', 
    };
    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexCus !== null) {
      handleItemChangeCus(selectedItemIndexCus, "name", nameValue);
      setShowModalCus(false);
      setTimeout(() => {
        accountNameRefs.current[selectedItemIndexCus].focus();
      }, 100);
    }
    setbankdetails(newCustomers);
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

  // Api Response
  const [firstTimeCheckData, setFirstTimeCheckData] = useState("");
  const fetchData = async () => {
    try {
      let response;
      if (bankId) {
        response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bankget/${bankId}`
        );
      } else {
        response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank/last`
        );
      }
      // const response = await axios.get(
      //   `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank/last`
      // );
      // console.log("Response: ", response.data);

      if (response.status === 200 && response.data.data) {
        const lastEntry = response.data.data;
        // Set flags and update form data
        setFirstTimeCheckData("DataAvailable");
        setFormData(lastEntry.formData);
        // console.log(lastEntry.formData, "Formdata");

        // Update items with the last entry's items
        const updatedItems = lastEntry.items.map((item) => ({
          ...item, // Ensure immutability
          disableReceipt: item.disableReceipt || false, // Handle disableReceipt flag safely
        }));
        setItems(updatedItems);
        const updatedItems2 = lastEntry.bankdetails.map((item) => ({
          ...item, // Ensure immutability
        }));
        setbankdetails(updatedItems2);

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
        const totalBankcharges = updatedItems
          .reduce((sum, item) => sum + parseFloat(item.bankchargers || 0), 0)
          .toFixed(2);

        // Update formData with the calculated totals
        setFormData((prevFormData) => ({
          ...prevFormData,
          totalpayment: totalPayment,
          totalreceipt: totalReceipt,
          totaldiscount: totalDiscount,
          totalbankcharges: totalBankcharges,
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
          vtype: "B",
          user: "Owner",
          totalpayment: "",
          totalreceipt: "",
          totaldiscount: "",
          totalbankcharges: "",
          againstbillno: "",
        };
        const emptyItems = [
          {
            id: 1,
            accountname: "",
            pan:"",
            Add1:"",
            bsGroup:"",
            payment_debit: "",
            receipt_credit: "",
            discount: "",
            Total: "",
            bankchargers: "",
            tdsRs: "",
            chqnoBank: "",
            remarks: "",
            discounted_payment: "",
            discounted_receipt: "",
            destination: "",
            disablePayment: false,
            disableReceipt: false,
          },
        ];
        const emptybankdetails = [
          {
            Bankname: "",
            code: "",
          },
        ];
        // Set the empty data
        setFormData(emptyFormData);
        setItems(emptyItems);
        setbankdetails(emptybankdetails);
        setData1({
          formData: emptyFormData,
          items: emptyItems,
          bankdetails: emptybankdetails,
        }); // Store empty data
        setIndex(0); // Set index to 0 for the empty voucher
      }
    } catch (error) {
      console.error("Error fetching data", error);

      // In case of error, you can also initialize empty data if needed
      const emptyFormData = {
        voucherno: 0,
        date: new Date().toLocaleDateString(), // Use today's date
        vtype: "B",
        user: "Owner",
        totalpayment: "",
        totalreceipt: "",
        totaldiscount: "",
        totalbankcharges: "",
        againstbillno: "",
      };
      const emptyItems = [
        {
          id: 1,
          accountname: "",
          pan:"",
          Add1:"",
          bsGroup:"",
          payment_debit: "",
          receipt_credit: "",
          discount: "",
          Total: "",
          bankchargers: "",
          tdsRs: "",
          chqnoBank: "",
          remarks: "",
          discounted_payment: "",
          discounted_receipt: "",
          destination: "",
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

  // useEffect(() => {
  //   const handleEsc = (e) => {
  //     if (e.key === "Escape" && bankId && !isEditMode) {
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
  // }, [navigate, bankId, location.state]);

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

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isEditMode && bankId) {
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

  const handleNext = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("View");
    console.log(data1._id);
    try {
      if (data1) {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank/next/${data1._id}`
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
          const updatedItems2 = nextData.bankdetails.map((item) => ({
            ...item,
          }));
          setbankdetails(updatedItems2);
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
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank/previous/${data1._id}`
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
          const updatedItems2 = prevData.bankdetails.map((item) => ({
            ...item,
          }));
          setbankdetails(updatedItems2);
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
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant//bank/first`
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
        const updatedItems2 = firstData.bankdetails.map((item) => ({
          ...item,
        }));
        setbankdetails(updatedItems2);
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
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank/last`
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
        const updatedItems2 = lastData.bankdetails.map((item) => ({
          ...item,
        }));
        setbankdetails(updatedItems2);
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
        vtype: "B",
        date: today,
        voucherno: lastvoucherno,
        user: "Owner",
        totalpayment: "",
        totalreceipt: "",
        totaldiscount: "",
        totalbankcharges: "",
        againstbillno: "",
      };
      setData([...data, newData]);
      setFormData(newData);
      setItems([
        {
          id: 1,
          accountname: "",
          pan:"",
          Add1:"",
          bsGroup:"",
          payment_debit: "",
          receipt_credit: "",
          discount: "",
          Total: "",
          bankchargers: "",
          tdsRs: "",
          chqnoBank: "",
          remarks: "",
          discounted_payment: "",
          discounted_receipt: "",
          destination: "",
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
      setIsPreviousEnabled(false);
      setIsSPrintEnabled(false);
      setIsDeleteEnabled(false);
      setIsDisabled(false);
      setIsEditMode(true);
      if (datePickerRef.current) {
        datePickerRef.current.setFocus();
      }
    } catch (error) {
      console.error("Error adding new entry:", error);
    }
  };

  const handleNumberChange = (event, index, field) => {
    const value = event.target.value;
    // Validate that the input is numeric
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // Calculate total payment, total receipt, total discount, and total bank charges for all rows
    let totalPayment = 0;
    let totalReceipt = 0;
    let totalDiscount = 0;
    let totalBankCharges = 0;

    updatedItems.forEach((item) => {
      const payment = parseFloat(item.payment_debit) || 0;
      const receipt = parseFloat(item.receipt_credit) || 0;
      const discount = parseFloat(item.discount) || 0;
      const bankCharges = parseFloat(item.bankchargers) || 0;
      totalPayment += payment;
      totalReceipt += receipt;
      totalDiscount += discount;
      totalBankCharges += bankCharges;
    });
    // Update total payment, total receipt, total discount, and total bank charges in formData
    setFormData((prevState) => ({
      ...prevState,
      totalpayment: totalPayment.toFixed(2),
      totalreceipt: totalReceipt.toFixed(2),
      totaldiscount: totalDiscount.toFixed(2),
      totalbankcharges: totalBankCharges.toFixed(2),
    }));

    if (field === "payment_debit" || field === "receipt_credit") {
      const payment = parseFloat(updatedItems[index]["payment_debit"]) || 0;
      const receipt = parseFloat(updatedItems[index]["receipt_credit"]) || 0;
      const discount = parseFloat(updatedItems[index]["discount"]) || 0;

      let total = payment + receipt + discount;
      updatedItems[index]["Total"] = total.toFixed(2);

      let discountedPayment = payment - discount;
      updatedItems[index]["discounted_payment"] = updatedItems[index]
        .disablePayment
        ? "0.00"
        : discountedPayment.toFixed(2);

      let discountedReceipt = receipt - discount;
      updatedItems[index]["discounted_receipt"] = updatedItems[index]
        .disableReceipt
        ? "0.00"
        : discountedReceipt.toFixed(2);
    }

    // Check if the value is greater than 0 to update disable conditions
    const isValueGreaterThanZero = parseFloat(value) > 0;

    // Disable According to debit or credit
    if (field === "payment_debit") {
      updatedItems[index].disableReceipt = isValueGreaterThanZero;
    } else if (field === "receipt_credit") {
      updatedItems[index].disablePayment = isValueGreaterThanZero;
    }
    setItems(updatedItems);
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
    setIsPreviousEnabled(false);
    setIsSPrintEnabled(false);
    setIsDeleteEnabled(false);
    setIsAbcmode(true);
    if (accountNameRefs.current[0]) {
      accountNameRefs.current[0].focus();
    }
  };
  const handleSaveClick = async () => {
    document.body.style.backgroundColor = "white";
    setIsSaving(true);
    let isDataSaved = false;
    try {
      const filledRows = items.filter((item) => item.accountname !== "");
      if (filledRows.length === 0) {
        toast.error("Please fill in at least one account name before saving.", {
          position: "top-center",
        });
        setIsSaving(false);
        return;
      }
      // Validate if EVERY row has either payment_debit > 0 or receipt_credit > 0
      const isValidTransaction = filledRows.every(
        (item) =>
          parseFloat(item.payment_debit) > 0 ||
          parseFloat(item.receipt_credit) > 0
      );

      if (!isValidTransaction) {
        toast.error("Payment or Receipt must be greater than 0.", {
          position: "top-center",
        });
        return;
      }

      let combinedData;
      if (isAbcmode) {
        // console.log(formData);
        // formData.totalpayment = formData.totalpayment;
        // formData.totalreceipt = formData.totalreceipt;
        // formData.totaldiscount = formData.totaldiscount;
        // formData.totalbankcharges = formData.totalbankcharges;
        combinedData = {
          _id: formData._id,
          formData: {
            date: selectedDate.toLocaleDateString("en-US"),
            vtype: formData.vtype,
            voucherno: formData.voucherno,
            user: formData.user || "",
            totalpayment: formData.totalpayment,
            totalreceipt: formData.totalreceipt || "",
            totaldiscount: formData.totaldiscount,
            totalbankcharges: formData.totalbankcharges,
            againstbillno: formData.againstbillno || "",
          },
          items: filledRows.map((item) => ({
            id: item.id,
            accountname: item.accountname,
            pan: item.pan,
            Add1: item.Add1,
            bsGroup: item.bsGroup,
            payment_debit: item.payment_debit,
            receipt_credit: item.receipt_credit,
            discount: item.discount,
            Total: item.Total,
            bankchargers: item.bankchargers,
            tdsRs: item.tdsRs,
            chqnoBank: item.chqnoBank,
            remarks: item.remarks,
            discounted_payment: item.discounted_payment,
            discounted_receipt: item.discounted_receipt,
            destination: item.destination,
            disablePayment: item.disablePayment,
            disableReceipt: item.disableReceipt,
            name: item.name,
          })),
          bankdetails: bankdetails.map((item) => ({
            Bankname: item.Bankname,
            code: item.code,
          })),
        };
      } else {
        combinedData = {
          _id: formData._id,
          formData: {
            date: selectedDate.toLocaleDateString("en-US"),
            vtype: formData.vtype,
            voucherno: formData.voucherno,
            user: formData.user || "",
            totalpayment: formData.totalpayment,
            totalreceipt: formData.totalreceipt || "",
            totaldiscount: formData.totaldiscount,
            totalbankcharges: formData.totalbankcharges,
            againstbillno: formData.againstbillno || "",
          },
          items: filledRows.map((item) => ({
            id: item.id,
            accountname: item.accountname,
            pan: item.pan,
            Add1: item.Add1,
            bsGroup: item.bsGroup,
            payment_debit: item.payment_debit,
            receipt_credit: item.receipt_credit,
            discount: item.discount,
            Total: item.Total,
            bankchargers: item.bankchargers,
            tdsRs: item.tdsRs,
            chqnoBank: item.chqnoBank,
            remarks: item.remarks,
            discounted_payment: item.discounted_payment,
            discounted_receipt: item.discounted_receipt,
            destination: item.destination,
            disablePayment: item.disablePayment,
            disableReceipt: item.disableReceipt,
            name: item.name,
          })),
          bankdetails: bankdetails.map((item) => ({
            Bankname: item.Bankname,
            code: item.code,
          })),
        };
      }
      // Debugging
      // console.log("Combined Data:", combinedData);
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank${
        isAbcmode ? `/${data1._id}` : ""
      }`;
      const method = isAbcmode ? "put" : "post";
      const response = await axios({
        method,
        url: apiEndpoint,
        data: combinedData,
      });

      if (response.status === 200 || response.status === 201) {
        // fetchData();
        isDataSaved = true;
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsSubmitEnabled(true);
      setIsSaving(false);
      if (isDataSaved) {
        setTitle("VIEW");
        setIsAddEnabled(true);
        setIsDisabled(true);
        setIsEditMode(false);
        setIsEditMode2(false);
        setIsSubmitEnabled(false);
        setIsPreviousEnabled(true);
        setIsNextEnabled(true);
        setIsFirstEnabled(true);
        setIsLastEnabled(true);
        setIsSearchEnabled(true);
        setIsPreviousEnabled(true);
        setIsSPrintEnabled(true);
        setIsDeleteEnabled(true);
        fetchData(); // Refresh data after saving
        fetchNarrations(); // Refresh narrations after saving
        toast.success("Data Saved Successfully!", { position: "top-center" });
      } else {
        setIsAddEnabled(false);
        setIsDisabled(false);
      }
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
    setIsSaving(true);
    try {
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank/${data1._id}`;
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
  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key

  const handleKeyDown = (event, index, field) => {
    if (event.key === "Enter" || event.key === "Tab") {
      event.preventDefault(); // Stop default Tab navigation
      switch (field) {
        case "accountname":
          if (items[index].accountname.trim() === "") {
            saveButtonRef.current.focus();
          } else {
            if (items[index].disablePayment) {
              receiptCreditRefs.current[index]?.focus();
            } else {
              paymentDebitRefs.current[index]?.focus();
            }
          }
          break;
        case "payment_debit":
          if (!items[index].disableReceipt) {
            receiptCreditRefs.current[index]?.focus();
          } else {
            discountRefs.current[index]?.focus();
          }
          break;
        case "receipt_credit":
          if (items[index].accountname.trim() === "") {
            saveButtonRef.current.focus();
          } else {
            discountRefs.current[index]?.focus();
          }
          break;
        case "discount":
          totalRefs.current[index]?.focus();
          break;
        case "Total":
          bankChargersRefs.current[index]?.focus();
          break;
        case "bankchargers":
          tdsRsRefs.current[index]?.focus();
          break;
        case "tdsRs":
          chqnoBankRefs.current[index]?.focus();
          break;
        case "chqnoBank":
          remarksRefs.current[index]?.focus();
          break;
        case "remarks":
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
      if (field === "accountname") {
        if (items[index].disablePayment) {
          receiptCreditRefs.current[index]?.focus();
          setTimeout(() => receiptCreditRefs.current[index]?.select(), 0);
        } else {
          paymentDebitRefs.current[index]?.focus();
          setTimeout(() => paymentDebitRefs.current[index]?.select(), 0);
        }
      } else if (field === "payment_debit" && !items[index].disableReceipt) {
        receiptCreditRefs.current[index]?.focus();
        setTimeout(() => receiptCreditRefs.current[index]?.select(), 0);
      } else if (field === "payment_debit" && items[index].disableReceipt) {
        discountRefs.current[index]?.focus();
        setTimeout(() => discountRefs.current[index]?.select(), 0);
      } else if (field === "receipt_credit") {
        discountRefs.current[index]?.focus();
        setTimeout(() => discountRefs.current[index]?.select(), 0);
      } else if (field === "discount") {
        totalRefs.current[index]?.focus();
        setTimeout(() => totalRefs.current[index]?.select(), 0);
      } else if (field === "Total") {
        bankChargersRefs.current[index]?.focus();
        setTimeout(() => bankChargersRefs.current[index]?.select(), 0);
      } else if (field === "bankchargers") {
        tdsRsRefs.current[index]?.focus();
        setTimeout(() => tdsRsRefs.current[index]?.select(), 0);
      } else if (field === "tdsRs") {
        chqnoBankRefs.current[index]?.focus();
        setTimeout(() => chqnoBankRefs.current[index]?.select(), 0);
      } else if (field === "chqnoBank") {
        remarksRefs.current[index]?.focus();
        setTimeout(() => remarksRefs.current[index]?.select(), 0);
      }
    }
    // Move Left (←)
    else if (event.key === "ArrowLeft") {
      if (field === "remarks") {
        chqnoBankRefs.current[index]?.focus();
        setTimeout(() => chqnoBankRefs.current[index]?.select(), 0);
      } else if (field === "chqnoBank") {
        tdsRsRefs.current[index]?.focus();
        setTimeout(() => tdsRsRefs.current[index]?.select(), 0);
      } else if (field === "tdsRs") {
        bankChargersRefs.current[index]?.focus();
        setTimeout(() => bankChargersRefs.current[index]?.select(), 0);
      } else if (field === "bankchargers") {
        totalRefs.current[index]?.focus();
        setTimeout(() => totalRefs.current[index]?.select(), 0);
      } else if (field === "Total") {
        discountRefs.current[index]?.focus();
        setTimeout(() => discountRefs.current[index]?.select(), 0);
      } else if (field === "discount") {
        if (!items[index].disableReceipt) {
          receiptCreditRefs.current[index]?.focus();
          setTimeout(() => receiptCreditRefs.current[index]?.select(), 0);
        } else if (!items[index].disablePayment) {
          paymentDebitRefs.current[index]?.focus();
          setTimeout(() => paymentDebitRefs.current[index]?.select(), 0);
        } else {
          accountNameRefs.current[index]?.focus();
          setTimeout(() => accountNameRefs.current[index]?.select(), 0);
        }
      } else if (field === "receipt_credit" && !items[index].disablePayment) {
        accountNameRefs.current[index]?.focus();
        setTimeout(() => accountNameRefs.current[index]?.select(), 0);
      } else if (field === "receipt_credit" && items[index].disablePayment) {
        accountNameRefs.current[index]?.focus();
        setTimeout(() => accountNameRefs.current[index]?.select(), 0);
      } else if (field === "payment_debit") {
        accountNameRefs.current[index]?.focus();
        setTimeout(() => accountNameRefs.current[index]?.select(), 0);
      }
    }

    // Move Up
    else if (event.key === "ArrowUp" && index > 0) {
      setTimeout(() => {
        if (field === "accountname")
          accountNameRefs.current[index - 1]?.focus();
        else if (field === "payment_debit")
          paymentDebitRefs.current[index - 1]?.focus();
        else if (field === "receipt_credit")
          receiptCreditRefs.current[index - 1]?.focus();
        else if (field === "discount") discountRefs.current[index - 1]?.focus();
        else if (field === "Total") totalRefs.current[index - 1]?.focus();
        else if (field === "bankchargers")
          bankChargersRefs.current[index - 1]?.focus();
        else if (field === "tdsRs") tdsRsRefs.current[index - 1]?.focus();
        else if (field === "chqnoBank")
          chqnoBankRefs.current[index - 1]?.focus();
        else if (field === "remarks") remarksRefs.current[index - 1]?.focus();
      }, 100);
    }
    // Move Down
    else if (event.key === "ArrowDown" && index < items.length - 1) {
      setTimeout(() => {
        if (field === "accountname")
          accountNameRefs.current[index + 1]?.focus();
        else if (field === "payment_debit")
          paymentDebitRefs.current[index + 1]?.focus();
        else if (field === "receipt_credit")
          receiptCreditRefs.current[index + 1]?.focus();
        else if (field === "discount") discountRefs.current[index + 1]?.focus();
        else if (field === "Total") totalRefs.current[index + 1]?.focus();
        else if (field === "bankchargers")
          bankChargersRefs.current[index + 1]?.focus();
        else if (field === "tdsRs") tdsRsRefs.current[index + 1]?.focus();
        else if (field === "chqnoBank")
          chqnoBankRefs.current[index + 1]?.focus();
        else if (field === "remarks") remarksRefs.current[index + 1]?.focus();
      }, 100);
    }
    // Open Modal on Letter Input in Account Name
    else if (/^[a-zA-Z]$/.test(event.key) && field === "accountname") {
      setPressedKey(event.key);
      openModalForItemAcc(index);
      event.preventDefault();
    }
  };

  const handleOpenModal = (event, index, field) => {
    if (/^[a-zA-Z]$/.test(event.key) && field === "Bankname") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItemCus(index);
      event.preventDefault(); // Prevent any default action
    }
  };
  const handleExit = async () => {
    document.body.style.backgroundColor = "white"; // Reset background color
    setTitle("View");
    try {
      const response = await axios.get(
        "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/bank/last"
      ); // Fetch the latest data
      if (response.status === 200 && response.data.data) {
        // If data is available
        const lastEntry = response.data.data;
        setFormData(lastEntry.formData);
        const updatedItems = lastEntry.items.map((item) => ({
          ...item,
          disableReceipt: item.disableReceipt || false,
        }));
        const updatedItems2 = lastEntry.bankdetails.map((item) => ({
          ...item,
          disableReceipt: item.disableReceipt || false,
        }));
        setItems(updatedItems); // Set items array with updated items
        setbankdetails(updatedItems2);
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
        const totalpayment = updatedItems
          .reduce((sum, item) => sum + parseFloat(item.payment_debit || 0), 0)
          .toFixed(2);
        const totalreceipt = updatedItems
          .reduce((sum, item) => sum + parseFloat(item.receipt_credit || 0), 0)
          .toFixed(2);
        const totaldiscount = updatedItems
          .reduce((sum, item) => sum + parseFloat(item.discount || 0), 0)
          .toFixed(2);
        const totalbankcharges = updatedItems
          .reduce((sum, item) => sum + parseFloat(item.bankchargers || 0), 0)
          .toFixed(2);
        setFormData((prevFormData) => ({
          ...prevFormData,
          totalpayment: totalpayment,
          totalreceipt: totalreceipt,
          totaldiscount: totaldiscount,
          totalbankcharges: totalbankcharges,
        }));
        setIsDisabled(true); // Disable fields after loading the data
      } else {
        // If no data is available, initialize with default values
        console.log("No data available");
        const newData = {
          vtype: "B",
          date: "",
          voucherno: 0,
          user: "Owner",
          totalpayment: "",
          totalreceipt: "",
          totaldiscount: "",
          totalbankcharges: "",
          againstbillno: "",
        };
        setFormData(newData);
        setItems([
          {
            id: 1,
            accountname: "",
            pan: "",
            Add1: "",
            bsGroup: "",
            payment_debit: "",
            receipt_credit: "",
            discount: "",
            Total: "",
            bankchargers: "",
            tdsRs: "",
            chqnoBank: "",
            remarks: "",
            discounted_payment: "",
            discounted_receipt: "",
            destination: "",
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

  const handleBankBlur = (index) => {
    const decimalPlaces = decimalValue;
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index].bankchargers);
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index].bankchargers = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };
  const handleTDSBlur = (index) => {
    const decimalPlaces = decimalValue;
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index].tdsRs);
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index].tdsRs = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };

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

  return (
    <div>
      <ToastContainer />
      <div style={{ visibility: "hidden", width: 0, height: 0 }}>
        <InvoicePDFbank
          formData={formData}
          items={items}
          isOpen={open}
          handleClose={handleClose}
        />
      </div>
      <h1 className="HeaderBANK">BANK VOUCHER</h1>
      <span className="tittle">{title}</span>
      <div className="topdetails">
        <div style={{ display: "flex", flexDirection: "row" }}>
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
          <div style={{ marginLeft: 5 }}>
            <TextField
              className="custom-bordered-input"
              inputRef={VoucherRef}
              id="voucherno"
              value={formData.voucherno}
              onChange={handleNumericValue}
              onKeyDown={(e) => handleEnterKeyPress(VoucherRef, BankRefs)(e)}
              onFocus={(e) => e.target.select()}
              label="VOUCHER NO"
              size="small"
              variant="filled"
              inputProps={{
                maxLength: 48,
                style: {
                  height: 20,
                  fontSize: `${fontSize}px`,
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 150 }} // Adjust width as needed
            />
          </div>
          <div style={{ marginLeft: 5 }}>
            <TextField
              className="custom-bordered-input"
              id="user"
              value={formData.user}
              onFocus={(e) => e.target.select()}
              label="USER"
              size="small"
              variant="filled"
              inputProps={{
                maxLength: 48,
                style: {
                  height: 20,
                  fontSize: `${fontSize}px`,
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 150 }} // Adjust width as needed
            />
          </div>
        </div>
        <div style={{ marginTop: 5 }}>
          {bankdetails.map((item, index) => (
            <div className="bankdiv" key={item.Bankname}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TextField
                  inputRef={BankRefs}
                  className="custom-bordered-input"
                  id="Bankname"
                  value={item.Bankname}
                  onFocus={(e) => e.target.select()}
                  label="BANK NAME"
                  size="small"
                  variant="filled"
                  onKeyDown={(e) => {
                    handleOpenModal(e, index, "Bankname");
                    // handleEnterKeyPress(BankRefs, null)(e);
                  }}
                  inputProps={{
                    maxLength: 48,
                    style: {
                      height: 20,
                      fontSize: `${fontSize}px`,
                    },
                    readOnly: !isEditMode || isDisabled,
                  }}
                  sx={{ width: 280 }} // Adjust width as needed
                />
              </div>
              <div style={{ marginLeft: 5 }}>
                <TextField
                  className="custom-bordered-input"
                  id="code"
                  value={item.code}
                  onFocus={(e) => e.target.select()}
                  label="AC CODE"
                  size="small"
                  variant="filled"
                  inputProps={{
                    maxLength: 48,
                    style: {
                      height: 20,
                      fontSize: `${fontSize}px`,
                    },
                    readOnly: !isEditMode || isDisabled,
                  }}
                  sx={{ width: 150 }} // Adjust width as needed
                   disabled     // ← ALWAYS DISABLED
                />
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
        </div>
      </div>
      <div className="Tablesections">
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
              <th style={{ width: 450 }}>ACCOUNT NAME</th>
              <th>PAYMENT</th>
              <th>RECEIPT</th>
              <th>DISCOUNT</th>
              <th>TOTAL</th>
              <th>BNK.CHG.</th>
              <th>TDS Rs.</th>
              <th>CHQNO+BANK</th>
              <th>
                REMARKS
                <input 
                  type="checkbox"
                  style={{ marginLeft: 5,transform: "scale(1.2)",cursor: "pointer"}}
                  tabIndex={-1}       // ⬅⬅ prevents tab focus
                  checked={showNarrationSuggestions}
                  onChange={(e) => setShowNarrationSuggestions(e.target.checked)}
                />
              </th>
              {isEditMode && <th className="text-center">DELETE</th>}
            </tr>
          </thead>
          <tbody style={{ overflowY: "auto", maxHeight: "calc(380px - 40px)" }}>
            {items.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: 0}}>
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
                    // onClick={() => openModalForItemAcc(index)}
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "accountname");
                    }}
                    ref={(el) => (accountNameRefs.current[index] = el)}
                    onFocus={(e) => e.target.select()} // Select text on focus
                  />
                </td>
                <td style={{ padding: 0 }}>
                  <input
                    className="Payments"
                    readOnly={!isEditMode || isDisabled}
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    value={item.payment_debit}
                    onChange={(e) =>
                      handleNumberChange(e, index, "payment_debit")
                    }
                    disabled={item.disablePayment}
                    ref={(el) => (paymentDebitRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "payment_debit")}
                    onBlur={() => handlePkgsBlur(index)}
                    onFocus={(e) => e.target.select()} // Select text on focus
                  />
                </td>
                <td style={{ padding: 0 }}>
                  <input
                    className="Receipts"
                    readOnly={!isEditMode || isDisabled}
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    value={item.receipt_credit}
                    onChange={(e) =>
                      handleNumberChange(e, index, "receipt_credit")
                    }
                    disabled={item.disableReceipt}
                    ref={(el) => (receiptCreditRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "receipt_credit")}
                    onBlur={() => handleWeightBlur(index)}
                    onFocus={(e) => e.target.select()} // Select text on focus
                  />
                </td>
                <td style={{ padding: 0 }}>
                  <input
                    className="Discounts"
                    readOnly={!isEditMode || isDisabled}
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    value={item.discount}
                    onChange={(e) =>
                      handleItemChangeAcc(index, "discount", e.target.value)
                    }
                    ref={(el) => (discountRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "discount")}
                    onBlur={() => handleRateBlur(index)}
                    onFocus={(e) => e.target.select()} // Select text on focus
                  />
                </td>
                <td style={{ padding: 0 }}>
                  <input
                    className="Totals"
                    readOnly
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                      backgroundColor: "#e3f8e3",
                    }}
                    value={item.Total}
                    onChange={(e) =>
                      handleItemChangeAcc(index, "Total", e.target.value)
                    }
                    ref={(el) => (totalRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "Total")}
                    onFocus={(e) => e.target.select()} // Select text on focus
                  />
                </td>
                <td style={{ padding: 0 }}>
                  <input
                    className="Bankcharges"
                    readOnly={!isEditMode || isDisabled}
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    value={item.bankchargers}
                    onChange={(e) =>
                      handleItemChangeAcc(index, "bankchargers", e.target.value)
                    }
                    ref={(el) => (bankChargersRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "bankchargers")}
                    onBlur={() => handleBankBlur(index)}
                    onFocus={(e) => e.target.select()} // Select text on focus
                  />
                </td>
                <td style={{ padding: 0 }}>
                  <input
                    className="TDSrs"
                    readOnly={!isEditMode || isDisabled}
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    value={item.tdsRs}
                    onChange={(e) =>
                      handleItemChangeAcc(index, "tdsRs", e.target.value)
                    }
                    ref={(el) => (tdsRsRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "tdsRs")}
                    onBlur={() => handleTDSBlur(index)}
                    onFocus={(e) => e.target.select()} // Select text on focus
                  />
                </td>
                <td style={{ padding: 0 }}>
                  <input
                    className="chnqBank"
                    readOnly={!isEditMode || isDisabled}
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    type="text"
                    value={item.chqnoBank}
                    onChange={(e) =>
                      handleItemChangeAcc(index, "chqnoBank", e.target.value)
                    }
                    ref={(el) => (chqnoBankRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "chqnoBank")}
                    onFocus={(e) => e.target.select()} // Select text on focus
                  />
                </td>
                <td style={{ padding: 0 }}>
                  <input
                    className="REM"
                    list={showNarrationSuggestions ? "narrationList" : undefined}
                    readOnly={!isEditMode || isDisabled}
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    type="text"
                    value={item.remarks}
                    onChange={(e) =>
                      handleItemChangeAcc(index, "remarks", e.target.value)
                    }
                    ref={(el) => (remarksRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "remarks")}
                    onFocus={(e) => e.target.select()} // Select text on focus
                  />
                  {showNarrationSuggestions && (
                    <datalist id="narrationList">
                      {narrationSuggestions.map((n, i) => (
                        <option key={i} value={n} />
                      ))}
                    </datalist>
                  )}
                </td>
                {isEditMode && (
                  <td style={{ padding: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center", // horizontally center
                        alignItems: "center", // vertically center
                        height: "100%", // takes full cell height
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
      <div className="addbutton">
        <Button className="fw-bold btn-secondary" onClick={handleAddItem}>
          Add Row
        </Button>
      </div>
      {showModalAcc && (
        <ProductModalAccount
        allFields={allFieldsAcc}
        onSelect={handleProductSelectAcc}
        onClose={() => setShowModalAcc(false)} 
        initialKey={pressedKey}
        tenant={tenant}
        onRefresh={fetchCustomers}
        />
      )}
      <div className="Belowcontent">
        <div
          style={{ display: "flex", flexDirection: "row", marginLeft: "15%" }}
        >
          <TextField
            className="custom-bordered-input"
            value={formData.totalpayment}
            label="TOTAL PAYEMNT"
            size="small"
            variant="filled"
            inputProps={{
              maxLength: 48,
              style: {
                height: 20,
                fontSize: `${fontSize}px`,
              },
              readOnly: !isEditMode || isDisabled,
            }}
            sx={{ width: 200 }} // Adjust width as needed
          />
          <TextField
            className="custom-bordered-input"
            value={formData.totalreceipt}
            label="TOTAL RECEIPT"
            size="small"
            variant="filled"
            inputProps={{
              maxLength: 48,
              style: {
                height: 20,
                fontSize: `${fontSize}px`,
              },
              readOnly: !isEditMode || isDisabled,
            }}
            sx={{ width: 200 }} // Adjust width as needed
          />
          <TextField
            className="custom-bordered-input"
            value={formData.totaldiscount}
            label="TOTAL DISCOUNT"
            size="small"
            variant="filled"
            inputProps={{
              maxLength: 48,
              style: {
                height: 20,
                fontSize: `${fontSize}px`,
              },
              readOnly: !isEditMode || isDisabled,
            }}
            sx={{ width: 200 }} // Adjust width as needed
          />
          <TextField
            className="custom-bordered-input"
            value={formData.totalbankcharges}
            label="TOTAL BANK CHARGES"
            size="small"
            variant="filled"
            inputProps={{
              maxLength: 48,
              style: {
                height: 20,
                fontSize: `${fontSize}px`,
              },
              readOnly: !isEditMode || isDisabled,
            }}
            sx={{ width: 200 }} // Adjust width as needed
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
          vtype="B"
        />

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
            // disabled={!isAddEnabled}
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
          >
            Search
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[7] }}
            onClick={handlePrintClick}
            disabled={!isPrintEnabled}
          >
            Print
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[8] }}
            disabled={!isDeleteEnabled}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[9] }}
            onClick={handleExit}
            // onClick={handleLast}
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
export default BankVoucher;