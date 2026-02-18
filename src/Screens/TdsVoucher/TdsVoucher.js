import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ProductModalCustomer from "../Modals/ProductModalCustomer";
import { ToastContainer, toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import "./TdsVoucher.css";
import { Select, MenuItem, FormControl, ButtonGroup, InputLabel } from "@mui/material";
import { Button } from "react-bootstrap";
import TdsSetup from "./TdsSetup";
import { CompanyContext } from "../Context/CompanyContext";
import { useContext } from "react";
import TextField from "@mui/material/TextField";
import InputMask from "react-input-mask";

const TdsVoucher = () => {
  const { company } = useContext(CompanyContext);
  // const tenant = company?.databaseName;
  const tenant = "03AAYFG4472A1ZG_01042025_31032026"

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    console.error("No tenant selected!");
  }

  const [title, setTitle] = useState("(View)");
  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
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
    vno: 0,
    vtype: "T",
    tdson: "",
    amount: "",
    others: "",
    vehicle: "",
    gr: "",
    grdate: "",
    invoiceno: "",
    invoicedate: "",
    weight: "",
    tdscode: "",
    rem1: "",
    tds_rate: "",
    tds_amt: "",
    tds_srate: "",
    sur: "",
    tds_crate: "",
    cess: "",
    tds_hrate: "",
    Hcess: 0,
    tds_tot: 0,
    tds_dep: "",
    tds_ch: "",
    tds_chq: "",
    Bank: "",
    post: "",
  });
  const [debitAcc, setdebitAcc] = useState([
    {
      Drcode: "",
      City: "",
    },
  ]);
  const [creditAcc, setcreditAcc] = useState([
    {
      Crcode1: 0,
      Crcode: "",
      city: "",
    },
  ]);
  const [tdsRetAcc, settdsRetAcc] = useState([
    {
      Cacode: "",
      Pan: "",
    },
  ]);
  const [TdsAcc, setTdsAcc] = useState([
    {
      tdscode: "",
    },
  ]);

  const [fontSize] = useState(17);
  // FETCH DATA
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
  const [isEditMode, setIsEditMode] = useState(false); // State to track edit mode
  const [isAbcmode, setIsAbcmode] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
  const [firstTimeCheckData, setFirstTimeCheckData] = useState("");
 
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/tdsvoucher/last`
      );
      console.log("Response: ", response.data.data);
      if (response.status === 200 && response.data && response.data.data) {
        const lastEntry = response.data.data;
        setFirstTimeCheckData("DataAvailable");
        setFormData(lastEntry.formData);
        // Update items and supplier details
        const updatedItems = lastEntry.debitAcc.map((item) => ({
          ...item,
        }));
        const updatedCustomer = lastEntry.creditAcc.map((item) => ({
          ...item,
        }));
        const updatedshipped = lastEntry.tdsRetAcc.map((item) => ({
          ...item,
        }));
        const updatedTdsAcc = lastEntry.TdsAcc.map((item) => ({
          ...item,
        }));
        setdebitAcc(updatedItems);
        setcreditAcc(updatedCustomer);
        settdsRetAcc(updatedshipped);
        setTdsAcc(updatedTdsAcc);
        // Set data and index
        setData1(lastEntry);
        setIndex(lastEntry.vno);
      } else {
        setFirstTimeCheckData("DataNotAvailable");
        console.log("No data available");
        initializeEmptyData();
      }
    } catch (error) {
      console.error("Error fetching data", error);
      initializeEmptyData();
    }
  };
  // Function to initialize empty data
  const initializeEmptyData = () => {
    // Default date as current date
    const emptyFormData = {
      date: "", // Use today's date
      date: "",
      vno: 0,
      vtype: "T",
      tdson: "",
      amount: 0,
      others: 0,
      vehicle: "",
      gr: "",
      grdate: "",
      invoiceno: 0,
      invoicedate: "",
      weight: 0,
      tdscode: "",
      rem1: "",
      tds_rate: 0,
      tds_amt: 0,
      tds_srate: 0,
      sur: 0,
      tds_crate: 0,
      cess: 0,
      tds_hrate: 0,
      Hcess: 0,
      tds_tot: 0,
      tds_dep: "",
      tds_ch: "",
      tds_chq: "",
      Bank: "",
      post: "",
    };
    const emptyItems = [
      {
        Drcode: "",
        City: "",
      },
    ];
    const emptyshipped = [
      {
        Crcode1: 0,
        Crcode: "",
        city: "",
      },
    ];
    const emptycustomer = [
      {
        Cacode: "",
        Pan: "",
      },
    ];
    // Set the empty data
    setFormData(emptyFormData);
    setdebitAcc(emptyItems);
    setcreditAcc(emptycustomer);
    settdsRetAcc(emptyshipped);
    setData1({
      formData: emptyFormData,
      debitAcc: emptyItems,
      creditAcc: emptyshipped,
      tdsRetAcc: emptycustomer,
    }); // Store empty data
    setIndex(0);
  };
  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleNumberChange = (event) => {
    const { id, value } = event.target;

    // Allow empty, decimal dot, or valid number pattern
    if (!/^\d*\.?\d*$/.test(value)) return;

    const updatedFormData = {
      ...formData,
      [id]: value, // Keep raw input string
    };

    if (
      ["tds_rate", "tds_srate", "tds_crate", "tds_hrate", "amount"].includes(id)
    ) {
      const amount = parseFloat(updatedFormData.amount) || 0;
      const tds_rate = parseFloat(updatedFormData.tds_rate) || 0;
      const tds_srate = parseFloat(updatedFormData.tds_srate) || 0;
      const tds_crate = parseFloat(updatedFormData.tds_crate) || 0;
      const tds_hrate = parseFloat(updatedFormData.tds_hrate) || 0;

      updatedFormData.tds_amt = (tds_rate / 100) * amount;
      updatedFormData.sur = (tds_srate / 100) * amount;
      updatedFormData.cess = (tds_crate / 100) * amount;
      updatedFormData.Hcess = (tds_hrate / 100) * amount;
      updatedFormData.tds_tot =
        updatedFormData.tds_amt +
        updatedFormData.sur +
        updatedFormData.cess +
        updatedFormData.Hcess;
    }

    setFormData(updatedFormData);
  };

  const inputRefs = useRef([]); // Array to hold references for input fields
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior
      let nextIndex = index + 1;

      // Find the next input that is not disabled
      while (
        inputRefs.current[nextIndex] &&
        inputRefs.current[nextIndex].disabled
      ) {
        nextIndex += 1;
      }

      const nextInput = inputRefs.current[nextIndex];
      if (nextInput) {
        nextInput.focus(); // Focus the next enabled input field
      }
    }

    if (e.key === "ArrowUp") {
      e.preventDefault(); // Prevent default behavior
      let prevIndex = index - 1;

      // Find the previous input that is not disabled
      while (
        inputRefs.current[prevIndex] &&
        inputRefs.current[prevIndex].disabled
      ) {
        prevIndex -= 1;
      }

      const prevInput = inputRefs.current[prevIndex];
      if (prevInput) {
        prevInput.focus(); // Focus the previous enabled input field
      }
    }
  };

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
      //   console.log(data);
      // Ensure to extract the formData for easier access in the rest of your app
      const formattedData = data.map((item) => ({
        ...item.formData,
        _id: item._id,
      }));
      setProductsCus(formattedData);
      setLoadingCus(false);
      setProductsDebit(formattedData);
      setLoadingDebit(false);
      setProductsAcc(formattedData);
      setLoadingAcc(false);
      setProductsTdsAcc(formattedData);
      setLoadingTdsAcc(false);
    } catch (error) {
      setErrorCus(error.message);
      setLoadingCus(false);
      setErrorDebit(error.message);
      setLoadingDebit(false);
      setErrorAcc(error.message);
      setLoadingAcc(false);
      setErrorTdsAcc(error.message);
      setLoadingTdsAcc(false);
    }
  };
  const [productsCus, setProductsCus] = useState([]);
  const [showModalCus, setShowModalCus] = useState(false);
  const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
  const [loadingCus, setLoadingCus] = useState(true);
  const [errorCus, setErrorCus] = useState(null);
  const handleItemChangeCus = (index, key, value) => {
    const updatedItems = [...creditAcc];
    updatedItems[index][key] = value;
    // If the key is 'name', find the corresponding product and set the price
    if (key === "name") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Crcode1"] = selectedProduct.acode;
        updatedItems[index]["Crcode"] = selectedProduct.ahead;
        updatedItems[index]["city"] = selectedProduct.city;
      }
    }
    setcreditAcc(updatedItems);
  };

  const handleProductSelectCus = (product) => {
    if (!product) {
      alert("No product received!");
      setShowModalCus(false);
      return;
    }
  
    // clone the array
    const newCustomers = [...creditAcc];
  
    // overwrite the one at the selected index
    newCustomers[selectedItemIndexCus] = {
      ...newCustomers[selectedItemIndexCus],
      Crcode1: product.acode || '',
      Crcode: product.ahead || '',
      city:   product.city  || '',  
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexCus !== null) {
      handleItemChangeCus(selectedItemIndexCus, "name", nameValue);
    }
    // Focus back on the input field after selecting the value
    setTimeout(() => {
      inputRefs.current[2]?.focus();
    }, 0);
    setcreditAcc(newCustomers);
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

  const [selectOpen, setSelectOpen] = useState(false);
  const handleTdsOn = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      tdson: value, // Update the ratecalculate field in FormData
    }));
  };

  // Modal For Credit
  const [productsAcc, setProductsAcc] = useState([]);
  const [showModalAcc, setShowModalAcc] = useState(false);
  const [selectedItemIndexAcc, setSelectedItemIndexAcc] = useState(null);
  const [loadingAcc, setLoadingAcc] = useState(true);
  const [errorAcc, setErrorAcc] = useState(null);

  const handleItemChangeAcc = (index, key, value) => {
    const updatedItems = [...tdsRetAcc];
    updatedItems[index][key] = value;
    // If the key is 'name', find the corresponding product and set the price
    if (key === "acName") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Cacode"] = selectedProduct.ahead;
        updatedItems[index]["Pan"] = selectedProduct.pan;
      }
    }
    settdsRetAcc(updatedItems);
  };
  // const handleProductSelectAcc = (product) => {
  //   setIsEditMode(true);
  //   if (selectedItemIndexAcc !== null) {
  //     handleItemChangeAcc(selectedItemIndexAcc, "acName", product.ahead);
  //     setShowModalAcc(false);
  //   }
  // };

    const handleProductSelectAcc = (product) => {
    if (!product) {
      alert("No product received!");
      setShowModalAcc(false);
      return;
    }
  
    // clone the array
    const newCustomers = [...tdsRetAcc];
  
    // overwrite the one at the selected index
    newCustomers[selectedItemIndexAcc] = {
      ...newCustomers[selectedItemIndexAcc],
      Cacode: product.ahead || '',
      Pan: product.pan || '',
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexAcc !== null) {
      handleItemChangeAcc(selectedItemIndexAcc, "acName", nameValue);
      setShowModalAcc(false);
    }
    setTimeout(() => {
      inputRefs.current[5]?.focus();
    }, 0);
    settdsRetAcc(newCustomers);
    setIsEditMode(true);
    setShowModalAcc(false);
  };

  const handleCloseModalAcc = () => {
    setShowModalAcc(false);
    setPressedKey(""); // resets for next modal open
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

  // Modal For Debit
  const [productsDebit, setProductsDebit] = useState([]);
  const [showModalDebit, setShowModalDebit] = useState(false);
  const [selectedItemIndexDebit, setSelectedItemIndexDebit] = useState(null);
  const [loadingDebit, setLoadingDebit] = useState(true);
  const [errorDebit, setErrorDebit] = useState(null);

  const handleItemChangeDebit = (index, key, value) => {
    const updatedItems = [...debitAcc];
    updatedItems[index][key] = value;
    // If the key is 'name', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Drcode"] = selectedProduct.ahead;
        updatedItems[index]["City"] = selectedProduct.city;
      }
    }
    setdebitAcc(updatedItems);
  };
  // const handleProductSelectDebit = (product) => {
  //   setIsEditMode(true);
  //   if (selectedItemIndexDebit !== null) {
  //     handleItemChangeDebit(selectedItemIndexDebit, "ahead", product.ahead);
  //     setShowModalDebit(false);
  //   }
  // };

  const handleProductSelectDebit = (product) => {
    if (!product) {
      alert("No product received!");
      setShowModalDebit(false);
      return;
    }
  
    // clone the array
    const newCustomers = [...debitAcc];
  
    // overwrite the one at the selected index
    newCustomers[selectedItemIndexDebit] = {
      ...newCustomers[selectedItemIndexDebit],
      Drcode: product.ahead || '',
      City: product.city || '',  
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexDebit !== null) {
      handleItemChangeDebit(selectedItemIndexDebit, "ahead", nameValue);
    }
    setTimeout(() => {
      inputRefs.current[15]?.focus();
    }, 0);
    setdebitAcc(newCustomers);
    setIsEditMode(true);
    setShowModalDebit(false);
  };

  const handleCloseModalDebit = () => {
    setShowModalDebit(false);
    setPressedKey(""); // resets for next modal open
  };

  const openModalForItemDebit = (index) => {
    if (isEditMode) {
      setSelectedItemIndexDebit(index);
      setShowModalDebit(true);
    }
  };
  const allFieldsDebit = productsDebit.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });

    return fields;
  }, []);

  // Modal For TdsAcc
  const [productsTdsAcc, setProductsTdsAcc] = useState([]);
  const [showModalTdsAcc, setShowModalTdsAcc] = useState(false);
  const [selectedItemIndexTdsAcc, setSelectedItemIndexTdsAcc] = useState(null);
  const [loadingTdsAcc, setLoadingTdsAcc] = useState(true);
  const [errorTdsAcc, setErrorTdsAcc] = useState(null);

  const handleItemChangeTdsAcc = (index, key, value) => {
    const updatedItems = [...TdsAcc];
    updatedItems[index][key] = value;
    // If the key is 'ahead', find the corresponding product and set the code
    if (key === "ahead") {
      const selectedProduct = productsTdsAcc.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["tdscode"] = selectedProduct.ahead;
      }
    }
    setTdsAcc(updatedItems);
  };

    const handleProductSelectTdsAcc = (product) => {
    if (!product) {
      alert("No product received!");
      setShowModalTdsAcc(false);
      return;
    }
  
    // clone the array
    const newCustomers = [...TdsAcc];
  
    // overwrite the one at the selected index
    newCustomers[selectedItemIndexTdsAcc] = {
      ...newCustomers[selectedItemIndexTdsAcc],
      tdscode: product.ahead || '', 
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexTdsAcc !== null) {
      handleItemChangeTdsAcc(selectedItemIndexTdsAcc, "ahead", nameValue);
    }
    setTimeout(() => {
      inputRefs.current[17]?.focus();
    }, 0);
    setTdsAcc(newCustomers);
    setIsEditMode(true);
    setShowModalTdsAcc(false);
  };

  const handleCloseModalTdsAcc = () => {
    setShowModalTdsAcc(false);
    setPressedKey(""); // resets for next modal open
  };

  const openModalForItemTdsAcc = (index) => {
    if (isEditMode) {
      setSelectedItemIndexTdsAcc(index);
      setShowModalTdsAcc(true);
    }
  };

  const allFieldsTdsAcc = productsTdsAcc.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  const handleOpenModal = (event, index, field) => {
    if (/^[a-zA-Z]$/.test(event.key) && field === "Crcode") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItemCus(index);
      event.preventDefault(); // Prevent any default action
    }
    if (/^[a-zA-Z]$/.test(event.key) && field === "Cacode") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItemAcc(index);
      event.preventDefault(); // Prevent any default action
    }
    if (/^[a-zA-Z]$/.test(event.key) && field === "Drcode") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItemDebit(index);
      event.preventDefault(); // Prevent any default action
    }
    if (/^[a-zA-Z]$/.test(event.key) && field === "tdscode") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItemTdsAcc(index);
      event.preventDefault(); // Prevent any default action
    }
  };
  const handleNext = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("(View)");

    try {
      if (data1) {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/tdsvoucher/next/${data1._id}`
        );
        if (response.status === 200 && response.data) {
          const nextData = response.data.data;
          setData1(nextData);
          setIndex(index + 1);
          setFormData(nextData.formData);

          // Update items and supplier details
          const updatedDebit = nextData.debitAcc.map((item) => ({
            ...item,
          }));
          const updatedCredit = nextData.creditAcc.map((item) => ({
            ...item,
          }));
          const updatedTdsAcc = nextData.tdsRetAcc.map((item) => ({
            ...item,
          }));
          const updatedTdsAcc2 = nextData.TdsAcc.map((item) => ({
            ...item,
          }));
          setTdsAcc(updatedTdsAcc2);
          setdebitAcc(updatedDebit);
          setcreditAcc(updatedCredit);
          settdsRetAcc(updatedTdsAcc);
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
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/tdsvoucher/previous/${data1._id}`
        );
        if (response.status === 200 && response.data) {
          const prevData = response.data.data;
          setData1(prevData);
          setIndex(index - 1);
          setFormData(prevData.formData);
          // Update items and supplier details
          const updatedDebit = prevData.debitAcc.map((item) => ({
            ...item,
          }));
          const updatedCredit = prevData.creditAcc.map((item) => ({
            ...item,
          }));
          const updatedTdsAcc = prevData.tdsRetAcc.map((item) => ({
            ...item,
          }));
          const updatedTdsAcc2 = prevData.TdsAcc.map((item) => ({
            ...item,
          }));
          setTdsAcc(updatedTdsAcc2);
          setdebitAcc(updatedDebit);
          setcreditAcc(updatedCredit);
          settdsRetAcc(updatedTdsAcc);
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
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/tdsvoucher/first`
      );
      if (response.status === 200 && response.data) {
        const firstData = response.data.data;
        setData1(firstData);
        setIndex(0);
        setFormData(firstData.formData);
        // Update items and supplier details
        const updatedDebit = firstData.debitAcc.map((item) => ({
          ...item,
        }));
        const updatedCredit = firstData.creditAcc.map((item) => ({
          ...item,
        }));
        const updatedTdsAcc = firstData.tdsRetAcc.map((item) => ({
          ...item,
        }));
        const updatedTdsAcc2 = firstData.TdsAcc.map((item) => ({
          ...item,
        }));
        setTdsAcc(updatedTdsAcc2);
        setdebitAcc(updatedDebit);
        setcreditAcc(updatedCredit);
        settdsRetAcc(updatedTdsAcc);
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
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/tdsvoucher/last`
      );
      if (response.status === 200 && response.data) {
        const lastData = response.data.data;
        setData1(lastData);
        const lastIndex = response.data.length - 1;
        setIndex(lastIndex);
        setFormData(lastData.formData);
        // Update items and supplier details
        const updatedDebit = lastData.debitAcc.map((item) => ({
          ...item,
        }));
        const updatedCredit = lastData.creditAcc.map((item) => ({
          ...item,
        }));
        const updatedTdsAcc = lastData.tdsRetAcc.map((item) => ({
          ...item,
        }));
        const updatedTdsAcc2 = lastData.TdsAcc.map((item) => ({
          ...item,
        }));
        setTdsAcc(updatedTdsAcc2);
        setdebitAcc(updatedDebit);
        setcreditAcc(updatedCredit);
        settdsRetAcc(updatedTdsAcc);
        setIsDisabled(true);
      }
    } catch (error) {
      console.error("Error fetching last record:", error);
    }
  };

  const getTodayDDMMYYYY = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  const handleAdd = async () => {
    try {
      let lastvoucherno = formData.vno ? parseInt(formData.vno) + 1 : 1;
      const newData = {
        date: getTodayDDMMYYYY(), // ✅ TODAY'S DATE
        vno: lastvoucherno,
        vtype: "T",
        tdson: "",
        amount: 0,
        others: 0,
        vehicle: "",
        gr: "",
        grdate: "",
        invoiceno: 0,
        invoicedate: "",
        weight: 0,
        tdscode: "",
        rem1: "",
        tds_rate: 0,
        tds_amt: 0,
        tds_srate: 0,
        sur: 0,
        tds_crate: 0,
        cess: 0,
        tds_hrate: 0,
        Hcess: 0,
        tds_tot: 0,
        tds_dep: "",
        tds_ch: "",
        tds_chq: "",
        Bank: "",
        post: "",
      };
      setData([...data, newData]);
      setFormData(newData);
      setcreditAcc([
        {
          Crcode1: "",
          Crcode: "",
          city: "",
        },
      ]);
      settdsRetAcc([
        {
          Cacode: "",
          Pan: "",
        },
      ]);
      setdebitAcc([
        {
          Drcode: "",
          City: "",
        },
      ]);
      setTdsAcc([
        {
          tdscode: "",
        },
      ]);
      setTitle("(New)");
      setIndex(data.length);
      setIsAddEnabled(false);
      setIsSubmitEnabled(true);
      setIsDisabled(false);
      setIsEditMode(true);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (error) {
      console.error("Error adding new entry:", error);
    }
  };
  const handleExitClick = async () => {
    setTitle("VIEW")
    document.body.style.backgroundColor = "white"; // Reset background color
    setIsAddEnabled(true); // Enable "Add" button
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/tdsvoucher/last`
      ); // Fetch the latest data
      if (response.status === 200 && response.data.data) {
        // If data is available
        const lastEntry = response.data.data;
        setFormData(lastEntry.formData); // Set form data
        setData1(response.data.data);
        // Update items and supplier details
        const updatedDebit = lastEntry.debitAcc.map((item) => ({
          ...item,
        }));
        const updatedCredit = lastEntry.creditAcc.map((item) => ({
          ...item,
        }));
        const updatedTdsAcc = lastEntry.tdsRetAcc.map((item) => ({
          ...item,
        }));
        const updatedTdsAcc2 = lastEntry.TdsAcc.map((item) => ({
          ...item,
        }));
        setTdsAcc(updatedTdsAcc2);
        setdebitAcc(updatedDebit);
        setcreditAcc(updatedCredit);
        settdsRetAcc(updatedTdsAcc);
        setIsDisabled(true);
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
          date: "",
          vno: 0,
          vtype: "T",
          tdson: "",
          amount: 0,
          others: 0,
          vehicle: "",
          gr: "",
          grdate: "",
          invoiceno: 0,
          invoicedate: "",
          weight: 0,
          tdscode: "",
          rem1: "",
          tds_rate: 0,
          tds_amt: 0,
          tds_srate: 0,
          sur: 0,
          tds_crate: 0,
          cess: 0,
          tds_hrate: 0,
          Hcess: 0,
          tds_tot: 0,
          tds_dep: "",
          tds_ch: "",
          tds_chq: "",
          Bank: "",
          post: "",
        };
        setFormData(newData); // Set default form data
        setdebitAcc([
          {
            Drcode: "",
            City: "",
          },
        ]);
        setcreditAcc([
          {
            Crcode1: "",
            Crcode: "",
            city: "",
          },
        ]);
        settdsRetAcc([
          {
            Cacode: "",
            Pan: "",
          },
        ]);
        setTdsAcc([
          {
            tdscode: "",
          },
        ]);
        setIsDisabled(true); // Disable fields after loading the default data
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  const handleEditClick = () => {
    setTitle("(EDIT)");
    setIsAddEnabled(false);
    setIsDisabled(false);
    setIsEditMode(true);
    setIsSubmitEnabled(true);
    setIsPreviousEnabled(false);
    setIsNextEnabled(false);
    setIsFirstEnabled(false);
    setIsLastEnabled(false);
    setIsSearchEnabled(false);
    setIsSPrintEnabled(false);
    setIsDeleteEnabled(false);
    setIsAbcmode(true);
    if (inputRefs.current[2]) {
      inputRefs.current[2].focus();
    }
  };
  const handleSaveClick = async () => {
    document.body.style.backgroundColor = "white";
    let isDataSaved = false;
    try {
      
      let combinedData;
      if (isAbcmode) {
        combinedData = {
          _id: formData._id,
          formData: {
            // date: selectedDate.toLocaleDateString("en-IN"),
            date: formData.date,
            vno: formData.vno,
            vtype: formData.vtype,
            tdson: formData.tdson,
            amount: formData.amount,
            others: formData.others,
            vehicle: formData.vehicle,
            gr: formData.gr,
            grdate: formData.grdate,
            invoiceno: formData.invoiceno,
            invoicedate: formData.invoicedate,
            weight: formData.weight,
            tdscode: formData.tdscode,
            rem1: formData.rem1,
            tds_rate: formData.tds_rate,
            tds_amt: formData.tds_amt,
            tds_srate: formData.tds_srate,
            sur: formData.sur,
            tds_crate: formData.tds_crate,
            cess: formData.cess,
            tds_hrate: formData.tds_hrate,
            Hcess: formData.Hcess,
            tds_tot: formData.tds_tot,
            tds_dep: formData.tds_dep,
            tds_ch: formData.tds_ch,
            tds_chq: formData.tds_chq,
            Bank: formData.Bank,
            post: formData.post,
          },
          debitAcc: debitAcc.map((item) => ({
            Drcode: item.Drcode,
            City: item.City,
          })),
          creditAcc: creditAcc.map((item) => ({
            Crcode1: item.Crcode1,
            Crcode: item.Crcode,
            city: item.city,
          })),
          tdsRetAcc: tdsRetAcc.map((item) => ({
            Cacode: item.Cacode,
            Pan: item.Pan,
          })),
          TdsAcc: TdsAcc.map((item) => ({
            tdscode: item.tdscode,
          })),
        };
      } else {
        combinedData = {
          _id: formData._id,
          formData: {
            // date: selectedDate.toLocaleDateString("en-IN"),
            date: formData.date,
            vno: formData.vno,
            vtype: formData.vtype,
            tdson: formData.tdson,
            amount: formData.amount,
            others: formData.others,
            vehicle: formData.vehicle,
            gr: formData.gr,
            grdate: formData.grdate,
            invoiceno: formData.invoiceno,
            invoicedate: formData.invoicedate,
            weight: formData.weight,
            tdscode: formData.tdscode,
            rem1: formData.rem1,
            tds_rate: formData.tds_rate,
            tds_amt: formData.tds_amt,
            tds_srate: formData.tds_srate,
            sur: formData.sur,
            tds_crate: formData.tds_crate,
            cess: formData.cess,
            tds_hrate: formData.tds_hrate,
            Hcess: formData.Hcess,
            tds_tot: formData.tds_tot,
            tds_dep: formData.tds_dep,
            tds_ch: formData.tds_ch,
            tds_chq: formData.tds_chq,
            Bank: formData.Bank,
            post: formData.post,
          },
          debitAcc: debitAcc.map((item) => ({
            Drcode: item.Drcode,
            City: item.City,
          })),
          creditAcc: creditAcc.map((item) => ({
            Crcode1: item.Crcode1,
            Crcode: item.Crcode,
            city: item.city,
          })),
          tdsRetAcc: tdsRetAcc.map((item) => ({
            Cacode: item.Cacode,
            Pan: item.Pan,
          })),
          TdsAcc: TdsAcc.map((item) => ({
            tdscode: item.tdscode,
          })),
        };
      }
      // Debugging
      console.log("Combined Data:", combinedData);

      const apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/tdsvoucher${
        isAbcmode ? `/${data1._id}` : ""
      }`;
      const method = isAbcmode ? "put" : "post";
      const response = await axios({
        method,
        url: apiEndpoint,
        data: combinedData,
      });

      if (response.status === 200 || response.status === 201) {
        fetchData();
        isDataSaved = true;
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.", {
        position: "top-center",
      });
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
        setIsSearchEnabled(true);
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
    const userConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!userConfirmed) return;
    try {
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/tdsvoucher/${data1._id}`;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    console.log("Modal opened");
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <ToastContainer />
      <Button onClick={openModal} style={{ marginLeft: "70%", marginTop: -40 }}>
        SETUP
      </Button>
      {isModalOpen && <TdsSetup onClose={closeModal} />}
      <h1 className="header" style={{ marginTop: -50, fontSize: 35 }}>
        TDS VOUCHER
      </h1>
      <div className="containerTDSvoucher">
        <div className="left">
        <div className={`erp-input ${(!isEditMode || isDisabled) ? "disabled" : ""}`}>
          <span className="erp-label">VOUCHER DATE</span>

          <InputMask
            mask="99-99-9999"
            value={formData.date}
            readOnly={!isEditMode || isDisabled}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          >
            {(inputProps) => (
              <input
                {...inputProps}
                className="erp-field custom-style"
                ref={(el) => (inputRefs.current[0] = el)}
                onKeyDown={(e) => handleKeyDown(e, 0)}
              />
            )}
          </InputMask>
        </div>
        {/* <div>
          <InputMask
            mask="99-99-9999"
            placeholder="dd-mm-yyyy"
            value={formData.date}
            readOnly={!isEditMode || isDisabled}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          >
            {(inputProps) => (
              <input
                {...inputProps}
                className="datepickerVoucher"
                ref={(el) => (inputRefs.current[0] = el)} // ✅ CORRECT
                onKeyDown={(e) => handleKeyDown(e, 0)}
              />
            )}
          </InputMask>
        </div> */}
        <div>
        <TextField
        id="vno"
        value={formData.vno}
        label="VOUCHER NO."
        onChange={handleNumberChange}
        onFocus={(e) => e.target.select()}  // Select text on focus
        inputRef={(el) => (inputRefs.current[1] = el)}
        onKeyDown={(e) => handleKeyDown(e, 1)}
        inputProps={{
          maxLength: 48,
          style: {
            height: 18,
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
          },
          readOnly: !isEditMode || isDisabled,
        }}
        size="small"
        variant="filled"
        className="custom-bordered-input"
        sx={{ width: 225 }}
        />
        </div>
        <div>
          {creditAcc.map((item, index) => (
            <div key={item.Crcode}>
              <div style={{display:'flex',flexDirection:"row"}}>
              <TextField
                id="Crcode"
                value={item.Crcode}
                label="CREDIT A/C"
                // onKeyDown={(e) => { handleOpenModal(e, index, "Crcode")}}
                onKeyDown={(e) => {
                  handleOpenModal(e, index, "Crcode");
                  handleKeyDown(e, 2);
                }}
                 inputRef={(el) => (inputRefs.current[2] = el)}
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 18,
                    fontSize: `${fontSize}px`,
                    fontWeight: "bold",
                  },
                  readOnly: !isEditMode || isDisabled,
                }}
                size="small"
                variant="filled"
                className="custom-bordered-input"
                sx={{ width: 350 }}
              />
              <TextField
                id="Crcode1"
                value={item.Crcode1}
                label="CODE"
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 18,
                    fontSize: `${fontSize}px`,
                    fontWeight: "bold",
                  },
                  readOnly: !isEditMode || isDisabled,
                }}
                size="small"
                variant="filled"
                className="custom-bordered-input"
                sx={{ width: 100 }}
              />
              </div>
              <TextField
                id="city"
                value={item.city}
                label="CITY"
                inputRef={(el) => (inputRefs.current[3] = el)}
                onKeyDown={(e) => handleKeyDown(e, 3)}
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 18,
                    fontSize: `${fontSize}px`,
                    fontWeight: "bold",
                  },
                  readOnly: !isEditMode || isDisabled,
                }}
                size="small"
                variant="filled"
                className="custom-bordered-input"
                sx={{ width: 450 }}
              />

              
            </div>
          ))}
          {/* Modal */}
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
        <div>
        <FormControl
          className="custom-bordered-input"
          sx={{
            width: '450px',
            fontSize: `${fontSize}px`,
            '& .MuiFilledInput-root': {
              height: 48, // adjust as needed (default ~56px for filled)
            },
          }}
          size="small"
          variant="filled"
        >
          <InputLabel id="tdson">TDS ON</InputLabel>
            <Select
              labelId="tdson"
              id="tdson"
              value={formData.tdson}
              onChange={(e) => {
                  if (!isEditMode || isDisabled) return; // prevent changing
                    handleTdsOn(e);
                  }}
              // onChange={handleTdsOn} // 🔹 selection only
              open={selectOpen}
              onOpen={() => setSelectOpen(true)}
              onClose={() => setSelectOpen(false)}
              inputRef={(el) => (inputRefs.current[4] = el)}
              onKeyDownCapture={(e) => {
                if (e.key === "Enter") {
                  if (selectOpen) {
                    // 🔹 Menu open → let MUI select option
                    return;
                  }
    
                  // 🔹 Menu closed → move to next field
                  e.preventDefault();
                  e.stopPropagation();
                  inputRefs.current[5]?.focus();
                }
    
                // Optional: ArrowDown opens menu
                if (e.key === "ArrowDown" && !selectOpen) {
                  e.preventDefault();
                  setSelectOpen(true);
                }
              }}
               inputProps={{
                sx: {
                  fontSize: `${fontSize}px`,
                  pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
                },
              }}
              label="TDS ON"
              displayEmpty
              MenuProps={{ disablePortal: true }}
            >
            <MenuItem value=""><em></em></MenuItem>
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
        <div>
        {tdsRetAcc.map((item, index) => (
          <div key={item.Cacode} style={{display:'flex',flexDirection:'column'}}>
            <TextField
            id="Cacode"
            value={item.Cacode}
            label="TDS RET A/C"
            onKeyDown={(e) => {
              handleOpenModal(e, index, "Cacode");
              handleKeyDown(e, 5);
            }}
            inputRef={(el) => (inputRefs.current[5] = el)}
            // onKeyDown={(e) => { handleOpenModal(e, index, "Cacode")}}
            onFocus={(e) => e.target.select()}  // Select text on focus
            inputProps={{
              maxLength: 48,
              style: {
                height: 18,
                fontSize: `${fontSize}px`,
                fontWeight: "bold",
              },
              readOnly: !isEditMode || isDisabled,
            }}
            size="small"
            variant="filled"
            className="custom-bordered-input"
            sx={{ width: 450 }}
            />
            <TextField
            id="Pan"
            value={item.Pan}
            label="PAN NO"
            onFocus={(e) => e.target.select()}  // Select text on focus
            inputRef={(el) => (inputRefs.current[6] = el)}
            onKeyDown={(e) => handleKeyDown(e, 6)}
            inputProps={{
              maxLength: 48,
              style: {
                height: 18,
                fontSize: `${fontSize}px`,
                fontWeight: "bold",
              },
              readOnly: !isEditMode || isDisabled,
            }}
            size="small"
            variant="filled"
            className="custom-bordered-input"
            sx={{ width: 450 }}
            />
          </div>
          ))}
          {showModalAcc && (
            <ProductModalCustomer
            allFields={allFieldsAcc}
            onSelect={handleProductSelectAcc}
            onClose={handleCloseModalAcc}
            initialKey={pressedKey}
            tenant={tenant}
          />
          )}
        </div>
        <div>
        <TextField
        id="amount"
        value={formData.amount === 0 || formData.amount == null ? "" : formData.amount}
        label="AMOUNT"
        onChange={handleNumberChange}
        onFocus={(e) => e.target.select()}  // Select text on focus
        inputRef={(el) => (inputRefs.current[7] = el)}
        onKeyDown={(e) => handleKeyDown(e, 7)}
        inputProps={{
          maxLength: 48,
          style: {
            height: 18,
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
          },
          readOnly: !isEditMode || isDisabled,
        }}
        size="small"
        variant="filled"
        className="custom-bordered-input"
        sx={{ width: 450 }}
        />
        </div>
        <div>
        <TextField
        id="others"
        value={formData.others === 0 || formData.others == null ? "" : formData.others}
        label="OTHER EXP"
        onChange={handleNumberChange}
        onFocus={(e) => e.target.select()}  // Select text on focus
        inputRef={(el) => (inputRefs.current[8] = el)}
        onKeyDown={(e) => handleKeyDown(e, 8)}
        inputProps={{
          maxLength: 48,
          style: {
            height: 18,
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
          },
          readOnly: !isEditMode || isDisabled,
        }}
        size="small"
        variant="filled"
        className="custom-bordered-input"
        sx={{ width: 450 }}
        />
        </div>
        <div style={{display:'flex',flexDirection:'row'}}>
        <TextField
        id="vehicle"
        value={formData.vehicle}
        label="VEHICLE NO"
        onChange={handleInputChange}
        onFocus={(e) => e.target.select()}  // Select text on focus
        inputRef={(el) => (inputRefs.current[9] = el)}
        onKeyDown={(e) => handleKeyDown(e, 9)}
        inputProps={{
          maxLength: 48,
          style: {
            height: 18,
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
          },
          readOnly: !isEditMode || isDisabled,
        }}
        size="small"
        variant="filled"
        className="custom-bordered-input"
        sx={{ width: 225 }}
        />
        <TextField
        id="weight"
        value={formData.weight === 0 || formData.weight == null ? "" : formData.weight}
        label="WEIGHT"
        onChange={handleNumberChange}
        onFocus={(e) => e.target.select()}  // Select text on focus
        inputRef={(el) => (inputRefs.current[10] = el)}
        onKeyDown={(e) => handleKeyDown(e, 10)}
        inputProps={{
          maxLength: 48,
          style: {
            height: 18,
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
          },
          readOnly: !isEditMode || isDisabled,
        }}
        size="small"
        variant="filled"
        className="custom-bordered-input"
        sx={{ width: 225 }}
        />
        </div>
        <div style={{display:'flex',flexDirection:'row'}}>
        <TextField
        id="gr"
        value={formData.gr}
        label="GR NO"
        onChange={handleNumberChange}
        onFocus={(e) => e.target.select()}  // Select text on focus
        inputRef={(el) => (inputRefs.current[11] = el)}
        onKeyDown={(e) => handleKeyDown(e, 11)}
        inputProps={{
          maxLength: 48,
          style: {
            height: 18,
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
          },
          readOnly: !isEditMode || isDisabled,
        }}
        size="small"
        variant="filled"
        className="custom-bordered-input"
        sx={{ width: 225 }}
        />
        <div className={`erp-input ${(!isEditMode || isDisabled) ? "disabled" : ""}`}>
          <span className="erp-label">GR DATE</span>

          <InputMask
            mask="99-99-9999"
            value={formData.grdate}
            readOnly={!isEditMode || isDisabled}
            onChange={(e) =>
              setFormData({ ...formData, grdate: e.target.value })
            }
          >
            {(inputProps) => (
              <input
                {...inputProps}
                className="erp-field custom-style"
                ref={(el) => (inputRefs.current[12] = el)}
                onKeyDown={(e) => handleKeyDown(e, 12)}
              />
            )}
          </InputMask>
        </div>

        {/* <InputMask
          mask="99-99-9999"
          placeholder="dd-mm-yyyy"
          value={formData.grdate}
          readOnly={!isEditMode || isDisabled}
          onChange={(e) =>
            setFormData({ ...formData, grdate: e.target.value })
          }
        >
          {(inputProps) => (
            <input
              {...inputProps}
              className="custom-datepickerTDS"
              ref={(el) => (inputRefs.current[12] = el)} // ✅ CORRECT
              onKeyDown={(e) => handleKeyDown(e, 12)}
            />
          )}
        </InputMask> */}
        </div>
        <div style={{display:'flex',flexDirection:'row'}}>
        <TextField
        id="invoiceno"
        value={formData.invoiceno === 0 || formData.invoiceno == null ? "" : formData.invoiceno}
        label="INVOICE NO"
        onChange={handleNumberChange}
        onFocus={(e) => e.target.select()}  // Select text on focus
        inputRef={(el) => (inputRefs.current[13] = el)}
        onKeyDown={(e) => handleKeyDown(e, 13)}
        inputProps={{
          maxLength: 48,
          style: {
            height: 18,
            fontSize: `${fontSize}px`,
            fontWeight: "bold",
          },
          readOnly: !isEditMode || isDisabled,
        }}
        size="small"
        variant="filled"
        className="custom-bordered-input"
        sx={{ width: 225 }}
        />
        <div className={`erp-input ${(!isEditMode || isDisabled) ? "disabled" : ""}`}>
          <span className="erp-label">INVOICE DATE</span>

          <InputMask
            mask="99-99-9999"
            value={formData.invoicedate}
            readOnly={!isEditMode || isDisabled}
            onChange={(e) =>
              setFormData({ ...formData, invoicedate: e.target.value })
            }
          >
            {(inputProps) => (
              <input
                {...inputProps}
                className="erp-field custom-style"
                ref={(el) => (inputRefs.current[14] = el)}
                onKeyDown={(e) => handleKeyDown(e, 14)}
              />
            )}
          </InputMask>
        </div>
        {/* <InputMask
          mask="99-99-9999"
          placeholder="dd-mm-yyyy"
          value={formData.invoicedate}
          readOnly={!isEditMode || isDisabled}
          onChange={(e) =>
            setFormData({ ...formData, invoicedate: e.target.value })
          }
        >
          {(inputProps) => (
            <input
              {...inputProps}
              className="custom-datepickerTDS"
              ref={(el) => (inputRefs.current[14] = el)} // ✅ CORRECT
              onKeyDown={(e) => handleKeyDown(e, 14)}
            />
          )}
        </InputMask> */}
        </div>
        </div>
        {/* Right Section */}
        <div className="Right">
          <div>
            {debitAcc.map((item, index) => (
              <div key={item.Drcode}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 2,
                  }}
                >
                <TextField
                id="Drcode"
                value={item.Drcode}
                label="DEBIT A/C"
                // onKeyDown={(e) => { handleOpenModal(e, index, "Drcode") }}
                onKeyDown={(e) => {
                  handleOpenModal(e, index, "Drcode");
                  handleKeyDown(e, 15);
                }}
                inputRef={(el) => (inputRefs.current[15] = el)}
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 18,
                    fontSize: `${fontSize}px`,
                    fontWeight: "bold",
                  },
                  readOnly: !isEditMode || isDisabled,
                }}
                size="small"
                variant="filled"
                className="custom-bordered-input"
                sx={{ width: 450 }}
              />
                </div>
                <TextField
                id="City"
                value={item.City}
                label="CITY"
                inputRef={(el) => (inputRefs.current[16] = el)}
                onKeyDown={(e) => handleKeyDown(e, 16)}
                inputProps={{
                  maxLength: 48,
                  style: {
                    height: 18,
                    fontSize: `${fontSize}px`,
                    fontWeight: "bold",
                  },
                  readOnly: !isEditMode || isDisabled,
                }}
                size="small"
                variant="filled"
                className="custom-bordered-input"
                sx={{ width: 450 }}
              />
              </div>
            ))}
            {showModalDebit && (
              <ProductModalCustomer
              allFields={allFieldsDebit}
              onSelect={handleProductSelectDebit}
              onClose={handleCloseModalDebit}
              initialKey={pressedKey}
              tenant={tenant}
            />
            )}
          </div>
          <div>
          {TdsAcc.map((item, index) => (
            <div key={item.Cacode}>
            <TextField
            id="tdscode"
            value={item.tdscode}
            label="TDS A/C"
            // onKeyDown={(e) => { handleOpenModal(e, index, "tdscode") }}
            onKeyDown={(e) => {
              handleOpenModal(e, index, "tdscode");
              handleKeyDown(e, 17);
            }}
            inputRef={(el) => (inputRefs.current[17] = el)}
            inputProps={{
              maxLength: 48,
              style: {
                height: 18,
                fontSize: `${fontSize}px`,
                fontWeight: "bold",
              },
              readOnly: !isEditMode || isDisabled,
            }}
            size="small"
            variant="filled"
            className="custom-bordered-input"
            sx={{ width: 450 }}
          />
          </div>
          ))}
          {showModalTdsAcc && (
            <ProductModalCustomer
            allFields={allFieldsTdsAcc}
            onSelect={handleProductSelectTdsAcc}
            onClose={handleCloseModalTdsAcc}
            initialKey={pressedKey}
            tenant={tenant}
          />
          )}
          </div>
          <div>
            <TextField
              id="rem1"
              value={formData.rem1}
              label="REMARKS"
              onChange={handleInputChange}
              inputRef={(el) => (inputRefs.current[18] = el)}
              onKeyDown={(e) => handleKeyDown(e, 18)}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 450 }}
            />
          </div>
          <div className="TdsBlock">
            <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              id="tds_rate"
              value={formData.tds_rate === 0 || formData.tds_rate == null ? "" : formData.tds_rate}
              label="T.D.S RATE"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[19] = el)}
              onKeyDown={(e) => handleKeyDown(e, 19)}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 225 }}
            />
            <TextField
              id="tds_amt"
              value={formData.tds_amt === 0 || formData.tds_amt == null ? "" : formData.tds_amt}
              label="T.D.S AMOUNT"
              onKeyDown={handleNumberChange}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 225 }}
            />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              id="tds_srate"
              value={formData.tds_srate === 0 || formData.tds_srate == null ? "" : formData.tds_srate}
              label="SUR@ RATE"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[20] = el)}
              onKeyDown={(e) => handleKeyDown(e, 20)}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 225 }}
            />
            <TextField
              id="sur"
              value={formData.sur === 0 || formData.sur == null ? "" : formData.sur}
              label="SUR@ AMOUNT"
              onKeyDown={handleNumberChange}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 225 }}
            />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              id="tds_crate"
              value={formData.tds_crate === 0 || formData.tds_crate == null ? "" : formData.tds_crate}
              label="CESS RATE"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[21] = el)}
              onKeyDown={(e) => handleKeyDown(e, 21)}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 225 }}
            />
            <TextField
              id="cess"
              value={formData.cess === 0 || formData.cess == null ? "" : formData.cess}
              label="CESS AMOUNT"
              onKeyDown={handleNumberChange}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 225 }}
            />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              id="tds_hrate"
              value={formData.tds_hrate === 0 || formData.tds_hrate == null ? "" : formData.tds_hrate}
              label="HE.CESS RATE"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[22] = el)}
              onKeyDown={(e) => handleKeyDown(e, 22)}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 225 }}
            />
            <TextField
              id="Hcess"
              value={formData.Hcess === 0 || formData.Hcess == null ? "" : formData.Hcess}
              label="H.CESS AMOUNT"
              onKeyDown={handleNumberChange}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 225 }}
            />
            </div>
            <div style={{ display: "flex", flexDirection: "row",marginLeft:"50%"}}>
            <TextField
              id="tds_tot"
              value={formData.tds_tot === 0 || formData.tds_tot == null ? "" : formData.tds_tot}
              label="TOTAL"
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 225 }}
            />
            </div>
            <div style={{display:'flex',flexDirection:'row',marginTop:20}}>
            <div className={`erp-input ${(!isEditMode || isDisabled) ? "disabled" : ""}`}>
              <span className="erp-label">DEPOSIT DATE</span>

              <InputMask
                mask="99-99-9999"
                value={formData.tds_dep}
                readOnly={!isEditMode || isDisabled}
                onChange={(e) =>
                  setFormData({ ...formData, tds_dep: e.target.value })
                }
              >
                {(inputProps) => (
                  <input
                    {...inputProps}
                    className="erp-field custom-style"
                    ref={(el) => (inputRefs.current[23] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 23)}
                  />
                )}
              </InputMask>
            </div>
            {/* <InputMask
              mask="99-99-9999"
              placeholder="dd-mm-yyyy"
              value={formData.tds_dep}
              readOnly={!isEditMode || isDisabled}
              onChange={(e) =>
                setFormData({ ...formData, tds_dep: e.target.value })
              }
            >
              {(inputProps) => (
                <input
                  {...inputProps}
                  className="custom-datepickerTDS"
                  ref={(el) => (inputRefs.current[23] = el)} // ✅ CORRECT
                  onKeyDown={(e) => handleKeyDown(e, 23)}
                />
              )}
            </InputMask> */}
            <TextField
              id="tds_ch"
              value={formData.tds_ch}
              label="CHALLAN NO"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[24] = el)}
              onKeyDown={(e) => handleKeyDown(e, 24)}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 225 }}
            />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
            <TextField
              id="tds_chq"
              value={formData.tds_chq}
              label="CHEQUE NO"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[25] = el)}
              onKeyDown={(e) => handleKeyDown(e, 25)}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 225 }}
            />
            <TextField
              id="Bank"
              value={formData.Bank}
              label="BANK NAME"
              onChange={handleInputChange}
              inputRef={(el) => (inputRefs.current[26] = el)}
              onKeyDown={(e) => handleKeyDown(e, 26)}
              inputProps={{
                maxLength: 48,
                style: {
                  height: 18,
                  fontSize: `${fontSize}px`,
                  fontWeight: "bold",
                },
                readOnly: !isEditMode || isDisabled,
              }}
              size="small"
              variant="filled"
              className="custom-bordered-input"
              sx={{ width: 225 }}
            />
            </div>
          </div>
        </div>
      </div>
      <ButtonGroup
        className="button-group"
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        }}
        variant="contained"
        aria-label="Basic button group"
      >
        <Button
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
          onClick={handleEditClick} // Add this onClick event handler
          disabled={!isAddEnabled} // Disable edit button when not in add mode
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
        >
          Search
        </Button>
        <Button
          className="Buttonz"
          // onClick={handleOpen}
          style={{ color: "black", backgroundColor: buttonColors[7] }}
          disabled={!isPrintEnabled}
        >
          Print
        </Button>
        {/* <PrintButton contentRef={componentRef} /> */}
        <Button
          className="Buttonz"
          style={{ color: "black", backgroundColor: buttonColors[8] }}
          onClick={handleDeleteClick}
          disabled={!isDeleteEnabled}
        >
          Delete
        </Button>
        <Button
          onClick={handleExitClick}
          className="Buttonz"
          style={{ color: "black", backgroundColor: buttonColors[9] }}
        >
          Exit
        </Button>
        <div>
          <Button
            ref={(el) => (inputRefs.current[27] = el)}
            disabled={!isSubmitEnabled}
            className="Buttonz"
            onClick={handleSaveClick}
            style={{ color: "black", backgroundColor: buttonColors[10] }}
          >
            Save
          </Button>
        </div>
      </ButtonGroup>
    </div>
  );
};

export default TdsVoucher;
