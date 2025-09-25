import React, { useState, useEffect, useRef, forwardRef } from "react";
import "./JournalVoucher.css";
import DatePicker from "react-datepicker";
import InputMask from "react-input-mask";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import ProductModalCustomer from "../Modals/ProductModalCustomer";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { Modal } from 'react-bootstrap'; // Import Bootstrap components
import InvoiceJournal from "../InvoicePDF/InvoiceJournal";
import { useEditMode } from "../../EditModeContext";
import { CompanyContext } from '../Context/CompanyContext';
import { useContext } from "react";
import TextField from "@mui/material/TextField";
import {IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate, useLocation } from "react-router-dom";

// ✅ Forward ref so DatePicker can focus the input
const MaskedInput = forwardRef(({ value, onChange, onBlur }, ref) => (
  <InputMask
    mask="99-99-9999"
    maskChar={null}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
  >
    {(inputProps) => <input {...inputProps} ref={ref} className="DatePICKER" />}
  </InputMask>
));

const JournalVoucher = () => {
  const location = useLocation();
  const journalId = location.state?.journalId;
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
  const accountNameRefs = useRef([]);
  const narrationRefs = useRef([]);
  const debitRefs = useRef([]);
  const credittRefs = useRef([]);
  const saveButtonRef = useRef(null);
  const [title, setTitle] = useState("View");
  const datePickerRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false); // State to handle modal visibility
  const [searchResults, setSearchResults] = useState([]); // State to store search results
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
    vtype: "J",
    date: "",
    voucherno: 0,
    owner: "",
    totaldebit: "",
    totalcredit: "",
  });
  const [items, setItems] = useState([
    {
      id: "",
      accountname: "",
      narration: "",
      debit: "",
      credit: "",
      disableDebit: false,
      disableCredit: false,
    },
  ]);

  useEffect(() => {
    if (addButtonRef.current && !journalId) {
      addButtonRef.current.focus();
    }
  }, []);

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
      const formattedDate = date.toLocaleDateString("en-US");
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
  
  const [shopName, setShopName] = useState("NARAYAN FRUIT BAR"); // Set default value here
  const [description, setDescription] = useState(
    "STOCKISTS IN : FRESH FRUITS ARE AVAIABLE HERE"
  );
  const [address, setAddress] = useState(
    "AMLOH ROAD, OPP. FRIENDS INDS., MANDI GOBINDGARH (PB)"
  );
  const [GSTIN, setGSTIN] = useState("07AAAHT5580L1ZX");
  const [PAN, setPAN] = useState("BNV5855MN6");

  // Function to save data to local storage
  const saveToLocalStorage = () => {
    localStorage.setItem("shopName", shopName);
    localStorage.setItem("description", description);
    localStorage.setItem("address", address);
    localStorage.setItem("GSTIN", GSTIN);
    localStorage.setItem("PAN", PAN);
  };

  // Function to retrieve data from local storage
  const getFromLocalStorage = () => {
    const savedShopName = localStorage.getItem("shopName");
    const savedDescription = localStorage.getItem("description");
    const savedAddress = localStorage.getItem("address");
    const savedGSTIN = localStorage.getItem("GSTIN");
    const savedPAN = localStorage.getItem("PAN");

    if (savedShopName) setShopName(savedShopName);
    if (savedDescription) setDescription(savedDescription);
    if (savedAddress) setAddress(savedAddress);
    if (savedGSTIN) setGSTIN(savedGSTIN);
    if (savedPAN) setPAN(savedPAN);
  };

  useEffect(() => {
    // Retrieve data from local storage when component mounts
    getFromLocalStorage();
  }, []);

  useEffect(() => {
    // Save data to local storage whenever shopName, description, or address change
    saveToLocalStorage();
  }, [shopName, description, address, GSTIN, PAN]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const calculateTotalPayment = () => {
    const totalPayment = items.reduce((acc, item) => {
      return acc + parseFloat(item.debit || 0);
    }, 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totaldebit: totalPayment.toFixed(2),
    }));
  };
  const calculateTotalReceipt = () => {
    const totalReceipt = items.reduce((acc, item) => {
      return acc + parseFloat(item.credit || 0);
    }, 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalcredit: totalReceipt.toFixed(2), // Format to 2 decimal places
    }));
  };
  const handleNumberChange = (event, index, field) => {
    const value = event.target.value;

    // Validate that the input is numeric
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const updatedItems = [...items];
    updatedItems[index][field] = value;

    // If the field is 'debit' and its value is greater than zero, disable 'credit'
    if (field === "debit") {
      updatedItems[index].disableCredit = parseFloat(value) > 0;
      updatedItems[index].disableDebit = false; // Ensure 'debit' is not disabled
    }
    // If the field is 'credit' and its value is greater than zero, disable 'debit'
    else if (field === "credit") {
      updatedItems[index].disableDebit = parseFloat(value) > 0;
      updatedItems[index].disableCredit = false; // Ensure 'credit' is not disabled
    }
    calculateTotalPayment();
    calculateTotalReceipt();
    setItems(updatedItems);
  };

  const formattedDate = `${String(selectedDate.getDate()).padStart(2, '0')}/${
  String(selectedDate.getMonth() + 1).padStart(2, '0')}/${
  selectedDate.getFullYear()}`;

  const handleSaveClick = async () => {
    document.body.style.backgroundColor = 'white';
    setIsSaving(true);
    let isDataSaved = false;
    try {
        const filledRows = items.filter(item => item.accountname !== '');
        if (filledRows.length === 0) {
            toast.error("Please fill in at least one account name before saving.", { position: "top-center" });
            setIsSaving(false);
            return;
        }
        // Validate if EVERY row has either payment_debit > 0 or receipt_credit > 0
            const isValidTransaction = filledRows.every(item => 
                parseFloat(item.debit) > 0 || parseFloat(item.credit) > 0
            );
        
            if (!isValidTransaction) {
                toast.error("Credit or Debit must be greater than 0.", { position: "top-center" });
                return;
            }
             // Ensure that total debit and total credit are equal
        const totalDebit = filledRows.reduce((sum, item) => sum + parseFloat(item.debit || 0), 0);
        const totalCredit = filledRows.reduce((sum, item) => sum + parseFloat(item.credit || 0), 0);

        if (totalDebit !== totalCredit) {
            toast.error("Total Debit and Total Credit must be equal.", { position: "top-center" });
            setIsSaving(false);
            return;
        }
        let combinedData;
        if (isAbcmode) {
            console.log(formData);
            formData.totalcredit = formData.totalcredit;
            formData.totaldebit = formData.totaldebit;
            combinedData = {
                _id: formData._id,
                formData: {
                  vtype: formData.vtype,
                  date: formattedDate, // <-- use the formatted date here
                  voucherno: formData.voucherno,
                  owner: formData.owner,
                  totaldebit: formData.totaldebit,
                  totalcredit: formData.totalcredit,
                },
                items: filledRows.map(item => ({
                  id: item.id,
                  accountname: item.accountname,
                  narration: item.narration,
                  debit: item.debit,
                  credit: item.credit,
                  disableDebit: item.disableDebit,
                  disableCredit: item.disableCredit,
                }))
            };
        } else {
            combinedData = {
                _id: formData._id,
                formData: {
                  vtype: formData.vtype,
                  date: selectedDate.toLocaleDateString("en-US"),
                  voucherno: formData.voucherno,
                  owner: formData.owner,
                  totaldebit: formData.totaldebit,
                  totalcredit: formData.totalcredit,
                },
                items: filledRows.map(item => ({
                  id: item.id,
                  accountname: item.accountname,
                  narration: item.narration,
                  debit: item.debit,
                  credit: item.credit,
                  disableDebit: item.disableDebit,
                  disableCredit: item.disableCredit,
                }))
            };
        }
        // Debugging
        console.log('Combined Data:', combinedData);
        const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/journal${isAbcmode ? `/${data1._id}` : ''}`;
        const method = isAbcmode ? 'put' : 'post';
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
        console.error('Error saving data:', error);
        toast.error("Failed to save data. Please try again.", { position: "top-center" });
    } finally {
        setIsSubmitEnabled(true);
        setIsSaving(false);
        if (isDataSaved) {
            setTitle('View');
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
    const userConfirmed = window.confirm("Are you sure you want to delete this item?");
    if (!userConfirmed) return;
    setIsSaving(true);
    try {
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/journal/${data1._id}`;
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
    } catch (error) {
      setErrorCus(error.message);
      setLoadingCus(false);
    }
  };

  const handleItemChangeCus = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index][key] = capitalizeWords(value); // Capitalize words here
    // If the key is 'name', find the corresponding product and set the price
    if (key === "name") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["accountname"] = selectedProduct.ahead;
      }
    }
    // Disable credit field if debit field is filled
    if (key === "debit") {
      updatedItems[index]["disableCredit"] = !!value; // Convert value to boolean
    }

    // Disable debit field if credit field is filled
    if (key === "credit") {
      updatedItems[index]["disableDebit"] = !!value; // Convert value to boolean
    }
    setItems(updatedItems);
  };
  const handleAddItem = () => {
    if (isEditMode) {
      const newItem = {
        id: items.length + 1,
        accountname: "",
        narration: "",
        debit: "",
        credit: "",
        disableDebit: false,
        disableCredit: false,
      };
      setItems([...items, newItem]);
      setTimeout(() => {
        accountNameRefs.current[items.length].focus();
      }, 100);
    }
  };

  const handleDeleteItem = (index) => {
    const filteredItems = items.filter((item, i) => i !== index);
    setItems(filteredItems);
  };

  // const handleProductSelectCus = (product) => {
  //   setIsEditMode(true);
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

  const handleEditClick = () => {
    setTitle("Edit");
    setIsDisabled(false);
    setIsEditMode(true);
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
    setIsAbcmode(true);
    if (accountNameRefs.current[0]) {
      accountNameRefs.current[0].focus();
    }
  };

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
  // Fetch Data
  const fetchData = async () => {
    try {
      let response;
      if (journalId) {
        response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/journalget/${journalId}`
        );
      } else {
        response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/journal/last`
        );
      }
      // const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/journal/last`);
      // console.log("fetch Response: ", response.data);
  
      if (response.status === 200 && response.data.data) {
        const lastEntry = response.data.data;
        // Set flags and update form data
        setFirstTimeCheckData("DataAvailable");
        setFormData(lastEntry.formData);
        console.log(lastEntry.formData, "Formdata");
  
        // Update the selectedDate state with the date from the last entry
        if (lastEntry.formData.date) {
          setSelectedDate(new Date(lastEntry.formData.date)); // Convert to Date object
        }
  
        // Update items with the last entry's items
        const updatedItems = lastEntry.items.map(item => ({
          ...item, // Ensure immutability
          disableCredit: item.disableCredit || false, // Handle disableReceipt flag safely
        }));
        setItems(updatedItems);
  
        // Calculate total debit and total credit
        const totalDebit = updatedItems.reduce((sum, item) => sum + parseFloat(item.debit || 0), 0).toFixed(2);
        const totalCredit = updatedItems.reduce((sum, item) => sum + parseFloat(item.credit || 0), 0).toFixed(2);
  
        // Update formData with the calculated totals
        setFormData(prevFormData => ({
          ...prevFormData,
          totaldebit: totalDebit,
          totalcredit: totalCredit,
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
          vtype: "J",
          owner: "",
          totaldebit: "0.00",
          totalcredit: "0.00",
        };
  
        const emptyItems = [{
          id: 1,
          accountname: "",
          narration: "",
          debit: "",
          credit: "",
          disableDebit: false,
          disableCredit: false,
        }];
  
        // Set the empty data
        setFormData(emptyFormData);
        setItems(emptyItems);
        setData1({ formData: emptyFormData, items: emptyItems }); // Store empty data
        setIndex(0); // Set index to 0 for the empty voucher
  
        // Set the selectedDate to today's date
        setSelectedDate(new Date());
      }
    } catch (error) {
      console.error("Error fetching data", error);
      
      // In case of error, initialize empty data
      const emptyFormData = {
        voucherno: 0,
        date: new Date().toLocaleDateString(),
        cashinhand: "",
        owner: "Owner",
        user: "",
        totalpayment: "0.00",
        totalreceipt: "0.00",
        totaldiscount: "0.00"
      };
      const emptyItems = [{
        id: 1,
        accountname: "",
        narration: "",
        payment_debit: 0.00,
        receipt_credit: 0.00,
        discount: 0.00,
        discounted_payment: "0.00",
        discounted_receipt: "0.00",
        disablePayment: false,
        disableReceipt: false
      }];
      
      setFormData(emptyFormData);
      setItems(emptyItems);
      setData1({ formData: emptyFormData, items: emptyItems });
      setIndex(0);
      
      // Set the selectedDate to today's date
      setSelectedDate(new Date());
    }
  };
  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && !isEditMode && journalId) {
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
  //     if (e.key === "Escape" && journalId && !isEditMode) {
  //       // ✅ Go back explicitly to LedgerList with state
  //       navigate( -1, {
  //         state: {
  //           rowIndex: location.state?.rowIndex || 0,
  //           selectedLedger: location.state?.selectedLedger,
  //           keepModalOpen: true,
  //         },
  //       });
  //       // navigate("/ledgerlist", {
  //       //   state: {
  //       //     rowIndex: location.state?.rowIndex || 0,
  //       //     selectedLedger: location.state?.selectedLedger,
  //       //     keepModalOpen: true,
  //       //   },
  //       // });
  //     }
  //   };

  //   window.addEventListener("keydown", handleEsc);
  //   return () => window.removeEventListener("keydown", handleEsc);
  // }, [navigate, journalId, location.state]);

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

  const handleNext = async () => {
    document.body.style.backgroundColor = 'white';
    setTitle("View");
console.log(data1._id)
    try {
        if (data1) {
            const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/journal/next/${data1._id}`);
            if (response.status === 200 && response.data) {
                const nextData = response.data.data;
                setData1(response.data.data);
                setIndex(index + 1);
                setFormData(nextData.formData);
                if (nextData.formData.date) {
                  setSelectedDate(new Date(nextData.formData.date)); // Convert to Date object
                }
                const updatedItems = nextData.items.map(item => ({
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
    document.body.style.backgroundColor = 'white';
    setTitle("View");
    try {
        if (data1) {
            const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/journal/previous/${data1._id}`);
            if (response.status === 200 && response.data) {
                console.log(response);
                setData1(response.data.data);
                const prevData = response.data.data;
                setIndex(index - 1);
                setFormData(prevData.formData);      
                if (prevData.formData.date) {
                  setSelectedDate(new Date(prevData.formData.date)); // Convert to Date object
                }          
                const updatedItems = prevData.items.map(item => ({
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
    document.body.style.backgroundColor = 'white';
    setTitle("View");
    try {
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/journal/first`);
        if (response.status === 200 && response.data) {
            const firstData = response.data.data;
            setIndex(0);
            setFormData(firstData.formData);
            setData1(response.data.data);
            if (firstData.formData.date) {
              setSelectedDate(new Date(firstData.formData.date)); // Convert to Date object
            }
            const updatedItems = firstData.items.map(item => ({
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
    document.body.style.backgroundColor = 'white';
    setTitle("View");

    try {
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/journal/last`);
        if (response.status === 200 && response.data) {
            const lastData = response.data.data;
            const lastIndex = response.data.length - 1;
            setIndex(lastIndex);
            setFormData(lastData.formData);
            setData1(response.data.data);
            if (lastData.formData.date) {
              setSelectedDate(new Date(lastData.formData.date)); // Convert to Date object
            }
            const updatedItems = lastData.items.map(item => ({
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
    setTitle("NEW")
    try {
        const lastEntry = await fetchData(); // This should set up the state correctly whether data is found or not
        let lastvoucherno = lastEntry?.formData?.voucherno ? parseInt(lastEntry.formData.voucherno) + 1 : 1;
        const today = new Date().toISOString().slice(0, 10); // Format: YYYY-MM-DD
        const newData = {
          vtype: "J",
          date: today,
          voucherno: lastvoucherno,
          owner: "",
          totaldebit: "",
          totalcredit: "",
        };
        setData([...data, newData]);
        setFormData(newData);
        setItems([{ 
          id: "1",
          accountname: "",
          narration: "",
          debit: "",
          credit: "",
          disableDebit: false,
          disableCredit: false,
        }]);
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
  
  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key

const handleKeyDown = (event, index, field) => {
  if (event.key === "Enter") {
    switch (field) {
      case "accountname":
         if (items[index].accountname.trim() === "") {
          saveButtonRef.current?.focus();
        }else{
          narrationRefs.current[index]?.focus();
        }
        break;
      case "narration":
        if (items[index].disableDebit) {
          // If debit is disabled, move focus to credit
          credittRefs.current[index]?.focus();
        } else {
          debitRefs.current[index]?.focus();
        }
      break;
      case "debit":
        if (!items[index].disableCredit) {
          credittRefs.current[index]?.focus();
        } else {
          // If credit is also disabled, move to next row
          if (index === items.length - 1) {
            handleAddItem();
            accountNameRefs.current[index + 1]?.focus();
          } else {
            accountNameRefs.current[index + 1]?.focus();
          }
        }
        break;

      case "credit":
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
      narrationRefs.current[index]?.focus();
      setTimeout(() => narrationRefs.current[index]?.select(), 0);
  }
  else if (field === "narration") {
      if (items[index].disableDebit) {
          // If debit is disabled, move focus to credit
          credittRefs.current[index]?.focus();
          setTimeout(() => credittRefs.current[index]?.select(), 0);
      } else {
          debitRefs.current[index]?.focus();
          setTimeout(() => debitRefs.current[index]?.select(), 0);
      }
  }
  else if (field === "debit") {
      if (!items[index].disableCredit) {
          credittRefs.current[index]?.focus();
          setTimeout(() => credittRefs.current[index]?.select(), 0);
      }
  } else if (field === "credit") {
      if (index === items.length - 1) {
          // handleAddItem(); (If needed, uncomment this)
          accountNameRefs.current[index + 1]?.focus();
          setTimeout(() => accountNameRefs.current[index]?.select(), 0);
      } else {
          accountNameRefs.current[index + 1]?.focus();
          setTimeout(() => accountNameRefs.current[index]?.select(), 0);
      }
  }
}
// Move Left (←)
else if (event.key === "ArrowLeft") {
  if (field === "credit") { 
      if (!items[index].disableDebit) {
          debitRefs.current[index]?.focus();
          setTimeout(() => debitRefs.current[index]?.select(), 0);
      } else {
          // If debit is disabled, move to narration
          narrationRefs.current[index]?.focus();
          setTimeout(() => narrationRefs.current[index]?.select(), 0);
      }
  }
  else if (field === "debit") { 
      narrationRefs.current[index]?.focus();
      setTimeout(() => narrationRefs.current[index]?.select(), 0);
  }
  else if (field === "narration") { 
      accountNameRefs.current[index]?.focus();
      setTimeout(() => accountNameRefs.current[index]?.select(), 0);
  }
}
 // Move Up
 else if (event.key === "ArrowUp" && index > 0) {
  setTimeout(() => {
    if (field === "accountname") accountNameRefs.current[index - 1]?.focus();
    else if (field === "narration") narrationRefs.current[index - 1]?.focus();
    else if (field === "debit") debitRefs.current[index - 1]?.focus();
    else if (field === "credit") credittRefs.current[index - 1]?.focus();
  }, 100);
} 
// Move Down
else if (event.key === "ArrowDown" && index < items.length - 1) {
  setTimeout(() => {
    if (field === "accountname") accountNameRefs.current[index + 1]?.focus();
    else if (field === "narration") narrationRefs.current[index + 1]?.focus();
    else if (field === "debit") debitRefs.current[index + 1]?.focus();
    else if (field === "credit") credittRefs.current[index + 1]?.focus();
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
    document.body.style.backgroundColor = 'white'; // Reset background color
    setIsAddEnabled(true); // Enable "Add" button
    setTitle("View");
    try {
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/journal/last`); // Fetch the latest data

        if (response.status === 200 && response.data.data) {
            // If data is available
            const lastEntry = response.data.data;
            setFormData(lastEntry.formData); // Set form data

            const updatedItems = lastEntry.items.map(item => ({
                ...item,
                disableReceipt: item.disableReceipt || false,
            }));
            setItems(updatedItems); // Set items array with updated items

            // Update totals
            const totaldebit = updatedItems.reduce((sum, item) => sum + parseFloat(item.debit || 0), 0).toFixed(2);
            const totalcredit = updatedItems.reduce((sum, item) => sum + parseFloat(item.credit || 0), 0).toFixed(2);
    
            setFormData(prevFormData => ({
                ...prevFormData,
                totaldebit: totaldebit,
                totalcredit: totalcredit,
               
            }));
            setIsDisabled(true); // Disable fields after loading the data
            setIndex(lastEntry.formData)
            setIsAddEnabled(true);
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
              vtype: "J",
              date: "",
              voucherno: 0,
              owner: "",
              totaldebit: "",
              totalcredit: "",
            };
            setFormData(newData); 
            setItems([{
              id: "",
              accountname: "",
              narration: "",
              debit: "",
              credit: "",
              disableDebit: false,
              disableCredit: false,
            }]);
            setIsDisabled(true); // Disable fields after loading the default data
        }
    } catch (error) {
        console.error("Error fetching data", error);
    }
};
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
        console.log(searchDate,"Hellloooo");
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/journal/search?date=${searchDate}`);
        
        if (response.status === 200) {
            setSearchResults(response.data.data); // Assuming the data is in response.data.data
        } else {
            setSearchResults([]); // Clear results if no data is found
        }
    } catch (error) {
        console.error("Error fetching search data", error);
    }
};
  // Update the blur handlers so that they always format the value to 2 decimals.
  const handlePkgsBlur = (index) => {
    const decimalPlaces = 2
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index].debit);
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index].debit = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };

  const handleWeightBlur = (index) => {
    const decimalPlaces = 2;
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index].credit);
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index].credit = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };
  return (
    <div>
      <ToastContainer />
      <div style={{ visibility: "hidden", width: 0, height: 0 }}>
      <InvoiceJournal
      formData={formData}
      items={items}
      isOpen={open}
      handleClose={handleClose}
      GSTIN={GSTIN}
      PAN={PAN}
      shopName={shopName}
      description={description}
      address={address}
    />
      </div>
      <h1 className="HeaderJOU">JOURNAL VOUCHER</h1>
      <text className="tittle">{title}</text>
      
      <div className="Top">
        <text>DATE</text>
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
      <div className="Tablesection">
        <Table className="custom-table">
          <thead
            style={{
              backgroundColor: "skyblue",
              textAlign: "center",
              position: "sticky",
              top: 0,
            }}
          >
            <tr style={{ color: "white" }}>
              <th>ACCOUNT NAME</th>
              <th>NARRATION</th>
              <th>DEBIT</th>
              <th>CREDIT</th>
              {isEditMode && <th className="text-center">DELETE</th>}
            </tr>
          </thead>
          <tbody
            style={{
              overflowY: "auto",
              maxHeight: "calc(420px - 40px)",
              marginTop: 10,
            }}
          >
            {items.map((item, index) => (
              <tr key={`${item.accountname}-${index}`}>
                {" "}
                {/* Use a combination of accountname and index as key */}
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
                    readOnly={!isEditMode || isDisabled}
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "accountname");
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
                <td style={{ padding: 0 ,width:250}}>
                  <input
                  className="Debit"
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      paddingRight: 10,
                    }}
                    readOnly={!isEditMode || isDisabled}
                    value={item.debit}
                    onChange={(e) => handleNumberChange(e, index, "debit")}
                    disabled={item.disableDebit} // Disable debit field if disableDebit is true
                    ref={(el) => (debitRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "debit")}
                    onBlur={() => handlePkgsBlur(index)}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                  />
                </td>
                <td style={{ padding: 0,width:250 }}>
                  <input
                  className="Credits"
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      paddingRight: 10,
                    }}
                    readOnly={!isEditMode || isDisabled}
                    value={item.credit}
                    onChange={(e) => handleNumberChange(e, index, "credit")}
                    disabled={item.disableCredit} // Disable credit field if disableCredit is true
                    ref={(el) => (credittRefs.current[index] = el)}
                    onKeyDown={(e) => handleKeyDown(e, index, "credit")}
                    onBlur={() => handleWeightBlur(index)}
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
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </td>
                )}
              </tr>
            ))}
            {/* Total Row */}
            {/* <tr style={{ backgroundColor: "white" }}>
              <td style={{ padding: 5, fontWeight: "bold" }}> Total:</td>
              <td style={{ padding: 0 }}></td>
              <td style={{ padding: 0 }}>
                <input
                  style={{
                    fontSize: `${fontSize}px`,
                    width: "100%",
                    boxSizing: "border-box",
                    border: "none",
                    paddingRight: 10,
                    fontWeight: "bold",
                    color:'black',textAlign:'right'
                  }}
                  value={formData.totaldebit}
                  onChange={handleInputChange}
                 disabled
                />
              </td>
              <td style={{ padding: 0 }}>
                <input
                  style={{
                    fontSize: `${fontSize}px`,
                    width: "100%",
                    boxSizing: "border-box",
                    border: "none",
                    paddingRight: 15,
                    fontWeight: "bold",
                      color:'black',textAlign:'right'
                  }}
                  value={formData.totalcredit}
                  onChange={handleInputChange}
                  disabled
                />
              </td>
              <td style={{ padding: 0 }}></td>
            </tr> */}
          </tbody>
        </Table>
      </div>
      <div className="addbutton">
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
     <div style={{display:'flex',flexDirection:'row',marginLeft:"70%"}}>
        <TextField
          id="totaldebit"
          value={formData.totaldebit}
          label="TOTAL DEBIT"
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
          sx={{ width: 200}}
          />
          <TextField
          id="totalcredit"
          value={formData.totalcredit}
          label="TOTAL CREDIT"
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
          sx={{ width: 200}}
          />
      </div>
        <div className="Buttonsgroupz">
          <Button
            ref={addButtonRef}
            className="Buttonz"
            style={{
              color: "black",
              backgroundColor: buttonColors[0],
            }}
            onClick={handleAdd}
            disabled={!isAddEnabled}
          >
            Add
          </Button>
          <Button
            className="Buttonz"
            style={{
              color: "black",
              backgroundColor: buttonColors[1],
            }}
            onClick={handleEditClick}
            disabled={!isAddEnabled}
          >
            Edit
          </Button>
          <Button
            className="Buttonz"
            style={{
              color: "black",
              backgroundColor: buttonColors[2],
            }}
            onClick={handlePrevious}
            disabled={!isPreviousEnabled}
          >
            Previous
          </Button>
          <Button
            className="Buttonz"
            style={{
              color: "black",
              backgroundColor: buttonColors[3],
            }}
            onClick={handleNext}
            disabled={!isNextEnabled}
          >
            Next
          </Button>
          <Button
            className="Buttonz"
            style={{
              color: "black",
              backgroundColor: buttonColors[4],
            }}
            onClick={handleFirst}
            disabled={!isFirstEnabled}
          >
            First
          </Button>
          <Button
            className="Buttonz"
            style={{
              color: "black",
              backgroundColor: buttonColors[5],
            }}
            onClick={handleLast}
            disabled={!isLastEnabled}
          >
            Last
          </Button>
          <Button
            className="Buttonz"
            style={{
              color: "black",
              backgroundColor: buttonColors[6],
            }}
            onClick={handleSearchClick} // Handle search button click
            disabled={!isSearchEnabled}
          >
            Search
          </Button>
           {/* Modal for Search */}
           <Modal show={showSearchModal} onHide={handleCloseSearchModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Search by Date</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Input for Date */}
                    <div style={{ marginBottom: '10px' }}>
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
                                    <th>Total Debit</th>
                                    <th>Total Credit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {searchResults.map((result, index) => (
                                    <tr key={index} onClick={() => handleSelectSearchResult(result)} style={{ cursor: 'pointer' }}>
                                        <td>{result.formData.voucherno}</td>
                                        <td>{new Date(result.formData.date).toLocaleDateString()}</td>
                                        <td>{result.formData.totaldebit}</td>
                                        <td>{result.formData.totalcredit}</td>
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
           onClick={handleOpen}
            className="Buttonz"
            style={{
              color: "black",
              backgroundColor: buttonColors[7],
            }}
            disabled={!isPrintEnabled}
          >
            Print
          </Button>
          <Button
            className="Buttonz"
            style={{
              color: "black",
              backgroundColor: buttonColors[8],
            }}
            disabled={!isDeleteEnabled}
            onClick={handleDeleteClick}
          >
            Delete
          </Button>
          <Button
            className="Buttonz"
            style={{
              color: "black",
              backgroundColor: buttonColors[9],
            }}
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
            style={{
              color: "black",
              backgroundColor: buttonColors[10],
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JournalVoucher;
