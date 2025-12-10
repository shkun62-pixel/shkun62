import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";
import "./NewStockAcc.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import ProductModal from "../Modals/ProductModal";
import ProductModalCustomer from "../Modals/ProductModalCustomer";
import { useEditMode } from "../../EditModeContext";
import { Modal, Box, Autocomplete, TextField, Typography } from "@mui/material";
// import { CompanyContext } from "../../context/CompanyContext";
import { CompanyContext } from "../Context/CompanyContext";
 import { useContext } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import useStockAcc from "../Shared/useStockAcc";

const NewStockAcc = ({ onSave }) => {

  const { getUniqueValues } = useStockAcc(); // only using hook
  const { company } = useContext(CompanyContext);
  // const tenant = company?.databaseName;
  const tenant = "shkun_05062025_05062026"

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    console.error("No tenant selected!");
  }

  const inputRefs = useRef([]); // Array to hold references for input fields
  const [formData, setFormData] = useState({
    Acodes: "",
    Aheads: "",
    openwts: "",
    openpcs: "",
    Mmopbals: "",
    Add2s: "",
    Prate: "",
    Mrps: "",
    Cds: "",
    Srate: "",
    itax_rate: "",
    ctax_rate: "",
    Drate: "",
    Stax_rate: "",
    Cess_rate: "",
    Pack: "",
    Hsn: "",
    Joint: "",
    schemes: "",
    duedate: "",
    Rateins: "",
    Stockins: "",
    Units: "",
    TradeName: "",
    Stkcals: "",
    Types: "",
    Stkvals: "",
    Qpps: "",
    tariff: "",
    Inval: "",
    Rg23c: "",
    Tcs206: "",
    Stype: "",
    T1: false,
    Psrno: "",
    PUnitno: "",
    percentage: "",
  });
  const [PurchaseAcc, setPurchaseAcc] = useState([
    {
      Pcodess: "",
      acCode: "",
    },
  ]);
  const [SaleAcc, setSaleAcc] = useState([
    {
      Scodess: "",
      AcCode: "",
    },
  ]);

   // Modal For Items
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
 
   const handleProductSelect = (product) => {
     if (selectedItemIndex !== null && product) {
       const updatedFormData = { ...formData };
 
       // Loop through formData keys and map values from product
       Object.keys(formData).forEach((key) => {
         updatedFormData[key] = product[key] ?? formData[key]; // Preserve default if missing
       });
 
       setFormData(updatedFormData);
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
   };
  
   const openModalForItem = (index) => {
       setSelectedItemIndex(index);
       setShowModal(true);
   };
  
   const allFields = products.length ? Object.keys(products[0])
   : ["Aheads", "Pcodes01", "UOM", "GST"]; // fallback/default fields
  
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

  const [productsCus, setProductsCus] = useState([]);
  const [showModalCus, setShowModalCus] = useState(false);
  const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
  const [loadingCus, setLoadingCus] = useState(true);
  const [errorCus, setErrorCus] = useState(null);
  const handleItemChangeCus = (index, key, value) => {
    const updatedItems = [...SaleAcc];
    updatedItems[index][key] = value;
    // If the key is 'name', find the corresponding product and set the price
    if (key === "name") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Scodess"] = selectedProduct.ahead;
        updatedItems[index]["AcCode"] = selectedProduct.acode;
      }
    }
    setSaleAcc(updatedItems);
  };

  // const handleProductSelectCus = (product) => {
  //   if (selectedItemIndexCus !== null) {
  //     handleItemChangeCus(selectedItemIndexCus, "name", product.ahead);
  //     setShowModalCus(false);
  //     setIsEditMode(true);
  //     // Focus back on the input field after selecting the value
  //     setTimeout(() => {
  //       inputRefs.current[15]?.focus();
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
    const newCustomers = [...SaleAcc];
  
    // overwrite the one at the selected index
    newCustomers[selectedItemIndexCus] = {
      ...newCustomers[selectedItemIndexCus],
      Scodess: product.ahead || '',
      AcCode: product.acode || '',   
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexCus !== null) {
      handleItemChangeCus(selectedItemIndexCus, "name", nameValue);

      // Focus back on the input field after selecting the value
      setTimeout(() => {
        inputRefs.current[12]?.focus();
      }, 0);
    }
    setSaleAcc(newCustomers);
    setIsEditMode(true);
    setShowModalCus(false);
  };

  const handleCloseModalCus = () => {
    setShowModalCus(false);
    setPressedKey(""); // resets for next modal open
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

  // Modal For Purchase Account
  const [productsAcc, setProductsAcc] = useState([]);
  const [showModalAcc, setShowModalAcc] = useState(false);
  const [selectedItemIndexAcc, setSelectedItemIndexAcc] = useState(null);
  const [loadingAcc, setLoadingAcc] = useState(true);
  const [errorAcc, setErrorAcc] = useState(null);
  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
  const handleItemChangeAcc = (index, key, value) => {
    const updatedItems = [...PurchaseAcc];
    updatedItems[index][key] = value;
    // If the key is 'name', find the corresponding product and set the price
    if (key === "acName") {
      const selectedProduct = productsAcc.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Pcodess"] = selectedProduct.ahead;
        updatedItems[index]["acCode"] = selectedProduct.acode;
      }
    }
    setPurchaseAcc(updatedItems);
  };

  // const handleProductSelectAcc = (product) => {
  //   if (selectedItemIndexAcc !== null) {
  //     handleItemChangeAcc(selectedItemIndexAcc, "acName", product.ahead);
  //     setShowModalAcc(false);

  //     // Focus back on the input field after selecting the value
  //     setTimeout(() => {
  //       inputRefs.current[14]?.focus();
  //     }, 0);
  //   }
  // };
  
  const handleProductSelectAcc = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalAcc(false);
      return;
    }
  
    // Deep copy shipped array
    const updatedShipped = [...PurchaseAcc];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexAcc] = {
      ...updatedShipped[selectedItemIndexAcc],
      Pcodess: product.ahead || "",
      acCode: product.acode || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexAcc !== null) {
      handleItemChangeAcc(selectedItemIndexAcc, "acName", nameValue);
      setShowModalAcc(false);

      // Focus back on the input field after selecting the value
      setTimeout(() => {
        inputRefs.current[11]?.focus();
      }, 0);
    }
    setPurchaseAcc(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalAcc(false);
  };

  const openModalForItemAcc = (index) => {
    setSelectedItemIndexAcc(index);
    setShowModalAcc(true);
  };
  const allFieldsAcc = productsAcc.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });

    return fields;
  }, []);

  const handleOpenModal = (event, index, field) => {
    if (/^[a-zA-Z]$/.test(event.key) && field === "Pcodess" && isEditMode) {
      setPressedKey(event.key); // Set the pressed key
      openModalForItemAcc(index);
      event.preventDefault(); // Prevent any default action
    }
    if (/^[a-zA-Z]$/.test(event.key) && field === "Scodess" && isEditMode) {
      setPressedKey(event.key); // Set the pressed key
      openModalForItemCus(index);
      event.preventDefault(); // Prevent any default action
    }
  };
  const handleOpenModalBack = (event, index, field) => {
    if (event.key === "Backspace" && field === "Pcodess" && isEditMode) {
      setSelectedItemIndexAcc(index);
      setShowModalAcc(true);
      event.preventDefault();
    }
    if (event.key === "Backspace" && field === "Scodess" && isEditMode) {
      setSelectedItemIndexCus(index);
      setShowModalCus(true);
      event.preventDefault();
    }
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
  const { isEditMode, setIsEditMode } = useEditMode(); // Access the context
  const [isAbcmode, setIsAbcmode] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/stockmaster/last`
      );
      if (response.status === 200 && response.data.data) {
        const lastEntry = response.data.data;
        console.log("LASTENTRY:", lastEntry);

        // if (onSave) onSave();   // <- THIS will notify parent to close & reload
        setFormData(lastEntry.formData);
        setData1(lastEntry); // Assuming this is meant to hold the full data structure
        setIndex(lastEntry._id);
        // Convert cesscode into an array containing one object
        setPurchaseAcc([
          {
            Pcodess: lastEntry.formData.Pcodess,
            acCode: lastEntry.formData.acCode,
          },
        ]);
        setSaleAcc([
          {
            Scodess: lastEntry.formData.Scodess,
            AcCode: lastEntry.formData.AcCode,
          },
        ]);
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
      Acodes: "",
      Aheads: "",
      openwts: "",
      openpcs: "",
      Mmopbals: "",
      Add2s: "",
      Prate: "",
      Mrps: "",
      Cds: "",
      Srate: "",
      itax_rate: "",
      ctax_rate: "",
      Drate: "",
      Stax_rate: "",
      Cess_rate: "",
      Pack: "",
      Hsn: "",
      Joint: "",
      schemes: "",
      duedate: "",
      Rateins: "",
      Stockins: "",
      Units: "",
      TradeName: "",
      Stkcals: "",
      Types: "",
      Stkvals: "",
      Qpps: "",
      tariff: "",
      Inval: "",
      Rg23c: "",
      Tcs206: "",
      Stype: "",
      T1: false,
      Psrno: "",
      PUnitno: "",
      percentage: "",
    };
    const emptyPurchaseACC = [{ cesscode: "", cessAc: "" }];
    const emptySaleAcc = [{ cgst_code: "", cgst_ac: "" }];
    setFormData(emptyData);
    setPurchaseAcc(emptyPurchaseACC);
    setSaleAcc(emptySaleAcc);
    setData1({
      formData: emptyData,
      PurchaseAcc: emptyPurchaseACC,
      SaleAcc: emptySaleAcc,
    });
    setIndex(0);
  };

  useEffect(() => {
    fetchData(); // Fetch data when component mounts
    setIsDisabled(true); // Add this line to set isDisabled to true initially
  }, []); // Empty dependency array ensures it only runs once when component mounts
  
  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleChangeAuto = (field) => (event, newValue) => {
    setFormData((prev) =>
       ({ ...prev, [field]: capitalizeWords(newValue) || "" }));
  };
 
  const handleNext = async () => {
    document.body.style.backgroundColor = "white";
    console.log(data1._id);
    try {
      if (data1) {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/stockmaster/next/${data1._id}`
        );
        if (response.status === 200 && response.data) {
          const nextData = response.data.data;
          setData1(response.data.data);
          setIndex(index + 1);
          setFormData(nextData.formData);
          setIsDisabled(true);
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
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/stockmaster/previous/${data1._id}`
        );
        if (response.status === 200 && response.data) {
          console.log(response);
          setData1(response.data.data);
          const prevData = response.data.data;
          setIndex(index - 1);
          setFormData(prevData.formData);
          setIsDisabled(true);
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
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/stockmaster/first`
      );
      if (response.status === 200 && response.data) {
        const firstData = response.data.data;
        setIndex(0);
        setFormData(firstData.formData);
        setData1(response.data.data);
        setIsDisabled(true);
      }
    } catch (error) {
      console.error("Error fetching first record:", error);
    }
  };

  const handleLast = async () => {
    document.body.style.backgroundColor = "white";
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/stockmaster/last`
      );
      if (response.status === 200 && response.data) {
        const lastData = response.data.data;
        const lastIndex = response.data.length - 1;
        setIndex(lastIndex);
        setFormData(lastData.formData);
        setData1(response.data.data);
        setIsDisabled(true);
      }
    } catch (error) {
      console.error("Error fetching last record:", error);
    }
  };

  const handleAdd = async () => {
    // document.body.style.backgroundColor = '#D5ECF3';
    try {
      await fetchData(); // This should set up the state correctly whether data is found or not
      let lastvoucherno = formData.Acodes ? parseInt(formData.Acodes) + 1 : 1;
      const newData = {
        Acodes: lastvoucherno, // Continue from the last voucher number or start new
        Aheads: "",
        openwts: "",
        openpcs: "",
        Mmopbals: "",
        Add2s: "",
        Prate: "",
        Mrps: "",
        Cds: "",
        Srate: "",
        itax_rate: "",
        ctax_rate: "",
        Drate: "",
        Stax_rate: "",
        Cess_rate: "",
        Pack: "",
        Hsn: "",
        Joint: "",
        schemes: "",
        duedate: "",
        Rateins: "Default",
        Stockins: "Wt/Qty",
        Units: "",
        TradeName: "MTS",
        Stkcals: "Wt/Qty",
        Types: "",
        Stkvals: "",
        Qpps: "",
        tariff: "",
        Inval: "",
        Rg23c: "",
        Tcs206: "Yes",
        Stype: "Taxable",
        T1: false,
        Psrno: "",
        PUnitno: "",
        percentage: "",
      };
      setData([...data, newData]);
      setFormData(newData);
      setPurchaseAcc([{ Pcodess: "", acCode: "" }]);
      setSaleAcc([{ Scodess: "", AcCode: "" }]);
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
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } catch (error) {
      console.error("Error adding new entry:", error);
    }
  };

  const handleExit = async () => {
    document.body.style.backgroundColor = "white"; // Reset background color
    setIsAddEnabled(true); // Enable "Add" button
    setIsSubmitEnabled(false);
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/stockmaster/last`
      ); // Fetch the latest data
      if (response.status === 200 && response.data.data) {
        // If data is available
        const lastEntry = response.data.data;
        const lastIndex = response.data.length - 1;
        setFormData(lastEntry.formData); // Set form data
        setData1(response.data.data);
        setIndex(lastIndex);
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
        const updatedPurAcc = lastEntry.PurchaseAcc.map((item) => ({
          ...item,
        }));
        const updatedSaleAcc = lastEntry.SaleAcc.map((item) => ({
          ...item,
        }));
        setPurchaseAcc(updatedPurAcc);
        setSaleAcc(updatedSaleAcc);
        setIsDisabled(true); // Disable fields after loading the data
      } else {
        // If no data is available, initialize with default values
        console.log("No data available");
        const newData = {
          Acodes: "",
          Aheads: "",
          openwts: "",
          openpcs: "",
          Mmopbals: "",
          Add2s: "",
          Prate: "",
          Mrps: "",
          Cds: "",
          Srate: "",
          itax_rate: "",
          ctax_rate: "",
          Drate: "",
          Stax_rate: "",
          Cess_rate: "",
          Pack: "",
          Hsn: "",
          Joint: "",
          schemes: "",
          duedate: "",
          Rateins: "",
          Stockins: "",
          Units: "",
          TradeName: "",
          Stkcals: "",
          Types: "",
          Stkvals: "",
          Qpps: "",
          tariff: "",
          Inval: "",
          Rg23c: "",
          Tcs206: "",
          Stype: "",
          T1: false,
          Psrno: "",
          PUnitno: "",
          percentage: "",
        };
        setFormData(newData); // Set default form data
        setPurchaseAcc([
          {
            Pcodess: "",
            acCode: "",
          },
        ]);
        setSaleAcc([
          {
            Scodess: "",
            AcCode: "",
          },
        ]);

        setIsDisabled(true); // Disable fields after loading the default data
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //   const handleAlphabetOnly = (e) => {
  //   const { id, value } = e.target;
  //   // Allow only alphabets (A-Z, a-z) and spaces
  //   const alphabetRegex = /^[A-Za-z\s]*$/;
  //   if (alphabetRegex.test(value)) {
  //     setFormData({ ...formData, [id]: value });
  //   }
  // };

  const handleKeyPress = (event, nextInputId) => {
    if (event.key === "Enter") {
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  let a = "Less%";
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

  const handleratecal = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      Rateins: value, // Update the Rateins field in FormData
    }));
  };
  const hanldeclsStock = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      Stockins: value, // Update the Rateins field in FormData
    }));
  };
  const handleqtyunit = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      Units: value, // Update the Rateins field in FormData
    }));
  };
  const handleportal = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      TradeName: value, // Update the Rateins field in FormData
    }));
  };
  const handlestockCal = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      Stkcals: value, // Update the Rateins field in FormData
    }));
  };
  const handleGoods = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      Types: value, // Update the Rateins field in FormData
    }));
  };
  const handlestkValuation = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      Stkvals: value, // Update the Rateins field in FormData
    }));
  };
  const handleselection = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      Tcs206: value, // Update the Rateins field in FormData
    }));
  };
  const handlegsttype = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      Stype: value, // Update the Rateins field in FormData
    }));
  };

  // Handle number input validation
  const handleNumberChange = (event) => {
    const { name, value } = event.target;
    const numberValue = value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimal
    const validNumberValue =
      numberValue.split(".").length > 2
        ? numberValue.replace(/\.{2,}/g, "").replace(/(.*)\./g, "$1.")
        : numberValue;

    setFormData((prevState) => ({
      ...prevState,
      [name]: validNumberValue,
    }));

    // If Mrps or Cds is changed, recalculate Srate
    if (name === "Mrps" || name === "Cds") {
      if (validNumberValue) {
        calculateSrate(
          name === "Mrps" ? validNumberValue : formData.Mrps,
          name === "Cds" ? validNumberValue : formData.Cds
        );
      }
    }
  };

  // Function to calculate and set Srate
  const calculateSrate = (mrps, cds) => {
    const mrpsValue = parseFloat(mrps);
    const cdsValue = parseFloat(cds);

    if (!isNaN(mrpsValue) && !isNaN(cdsValue)) {
      const discount = (cdsValue / 100) * mrpsValue;
      const saleRate = mrpsValue - discount;
      setFormData((prevState) => ({
        ...prevState,
        Srate: saleRate.toFixed(2), // Set the calculated sale rate with 2 decimal places
      }));
    }
  };

  const handleSrateChange = (event) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      Srate: value, // Allow manual entry in the Srate field
    }));
  };

  const handleSaveClick = async () => {
    document.body.style.backgroundColor = "white";
    let isDataSaved = false;

    // Check if formData.Aheads is empty
    if (!formData.Aheads || formData.Aheads.trim() === "") {
      toast.error("Name cannot be empty!", { position: "top-center" });
      return; // Prevent the save operation
    }

    const prepareData = () => ({
      _id: formData._id,
      formData: {
        ...formData,
        Pcodess: PurchaseAcc.length > 0 ? PurchaseAcc[0].Pcodess : "",
        acCode: PurchaseAcc.length > 0 ? PurchaseAcc[0].acCode : "",
        Scodess: SaleAcc.length > 0 ? SaleAcc[0].Scodess : "",
        AcCode: SaleAcc.length > 0 ? SaleAcc[0].AcCode : "",
      },
    });

    try {
      const combinedData = prepareData();
      console.log("Combined Data:", combinedData);
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/stockmaster${
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
        if (onSave) onSave();
        isDataSaved = true;
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsSubmitEnabled(false);
      isDataSaved ? setIsAddEnabled(true) : setIsAddEnabled(false);
      setIsDisabled(!isDataSaved);
      setIsEditMode(!isDataSaved);
      setIsPreviousEnabled(true);
      setIsNextEnabled(true);
      setIsFirstEnabled(true);
      setIsLastEnabled(true);
      setIsSearchEnabled(true);
      setIsSPrintEnabled(true);
      setIsDeleteEnabled(true);

      const toastMsg = isDataSaved
        ? "Data Saved Successfully!"
        : "Failed to save data.";
      if (isDataSaved) {
        toast.success(toastMsg, { position: "top-center" });
      }
    }
  };

  // const handleSaveClick = async () => {
  //     document.body.style.backgroundColor = "white";
  //     let isDataSaved = false;
  //     const userConfirmed = window.confirm("Are you sure you want to save the data?");
  //     if (!userConfirmed) return;
  //     const prepareData = () => ({
  //       _id: formData._id,
  //       formData: {
  //         ...formData,
  //         Pcodess: PurchaseAcc.length > 0 ? PurchaseAcc[0].Pcodess : '',
  //         acCode: PurchaseAcc.length > 0 ? PurchaseAcc[0].acCode : '',
  //         Scodess: SaleAcc.length > 0 ? SaleAcc[0].Scodess : '',
  //         AcCode: SaleAcc.length > 0 ? SaleAcc[0].AcCode : '',
  //       }
  //     });

  //     try {
  //       const combinedData = prepareData();
  //       console.log("Combined Data:", combinedData);
  //       const apiEndpoint = `http://103.168.19.65:3012/auth/stockmaster${isAbcmode ? `/${data1._id}` : ""}`;
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
  //       isDataSaved ? setIsAddEnabled(true) : setIsAddEnabled(false);
  //       setIsDisabled(!isDataSaved);
  //       setIsEditMode(!isDataSaved);
  //       const toastMsg = isDataSaved ? "Data Saved Successfully!" : "Failed to save data.";
  //       toast.success(toastMsg, { position: "top-center" });
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
    try {
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/stockmaster/${data1._id}`;
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
  const handleEditClick = () => {
    setIsDisabled(false);
    setIsEditMode(true);
    setIsSubmitEnabled(true);
    setIsAddEnabled(false);
    setIsPreviousEnabled(false);
    setIsNextEnabled(false);
    setIsFirstEnabled(false);
    setIsLastEnabled(false);
    setIsSearchEnabled(false);
    setIsSPrintEnabled(false);
    setIsDeleteEnabled(false);
    setIsAbcmode(true);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  const handleChangevalues = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Calculate CGST and SGST
    if (name === "itax_rate") {
      const gstValue = parseFloat(value);
      if (!isNaN(gstValue)) {
        const cgstValue = gstValue / 2;
        const sgstValue = gstValue / 2;
        setFormData((prevState) => ({
          ...prevState,
          ctax_rate: cgstValue.toFixed(2),
          Stax_rate: sgstValue.toFixed(2),
        }));
      }
    }
  };
  const [expiredDate, setexpiredDate] = useState(null);

  useEffect(() => {
    if (formData.duedate) {
      setexpiredDate(new Date(formData.duedate));
    } else {
      const today = new Date();
      setexpiredDate(today);
      setFormData({ ...formData, duedate: today });
    }
  }, [formData.duedate, setFormData]);

  const handleDateChange = (date) => {
    setexpiredDate(date);
    setFormData({ ...formData, duedate: date });
  };

  // Handle Enter key to move focus to the next enabled input
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

  const handleChangeCheckBox = (e) => {
    const { name, type, value, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value, // Update based on type
    }));
  };

  const handleRateBlur = (field) => {
    const decimalPlaces = 2; // Default to 3 decimal places if rateValue is undefined
    let value = parseFloat(formData[field]);

    if (isNaN(value)) {
      setFormData((prev) => ({ ...prev, [field]: "" })); // Keep empty if NaN
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value.toFixed(decimalPlaces),
      }));
    }
  };

  return (
    <div style={{ padding: 10 }}>
      <h1
        className="heading"
        style={{ fontWeight: 700, marginTop: -35, letterSpacing: 5 }}
      >
        STOCK ITEM MENU
      </h1>
      <ToastContainer style={{ width: "30%" }} />
      <div className="MainDiv">
        {/* First Half Screen */}
        <div className="FirstHalf">
          <div>
            <TextField
              className="billzNo custom-bordered-input"
              id="Acodes"
              value={formData.Acodes}
              variant="filled"
              size="small"
              label="A/C CODE"
              onChange={handleNumericValue}
              onKeyPress={(event) => handleKeyPress(event, "gstNo")}
              inputProps={{
                maxLength: 48,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
            />
          </div>
          <div style={{marginTop:2}}>
            <Autocomplete
            freeSolo
            disableClearable
            options={isEditMode && !isDisabled ? getUniqueValues("Aheads") : []}
            value={formData.Aheads}
            onInputChange={handleChangeAuto("Aheads")}
            renderInput={(params) => (
              <TextField
                {...params}
                className="custom-bordered-input"
                id="ahead"
                variant="filled"
                size="small"
                label="A/C NAME"
                inputRef={(el) => (inputRefs.current[0] = el)}
                onKeyDown={(e) => handleKeyDown(e, 0)}
                inputProps={{
                  ...params.inputProps,
                  maxLength: 48,
                  style: {
                    height: "15px",
                    fontSize: 16,
                  },
                  readOnly: !isEditMode || isDisabled,
                }}
                sx={{ width: 400 }}
              />
            )}
            />
            {/* <TextField
              className="custom-bordered-input"
              name="Aheads"
              value={formData.Aheads}
              variant="filled"
              size="small"
              label="NAME"
              onChange={handleChange}
              inputRef={(el) => (inputRefs.current[0] = el)}
              onKeyDown={(e) => handleKeyDown(e, 0)}
              inputProps={{
                maxLength: 100,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 400 }}
            /> */}
          </div>
          <div style={{ display: "flex", flexDirection: "row",marginTop:2 }}>
            <TextField
              className="custom-bordered-input"
              name="openwts"
              value={formData.openwts}
              variant="filled"
              size="small"
              label="Op.StockInQty"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[1] = el)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
              onBlur={() => handleRateBlur("openwts")}
              inputProps={{
                maxLength: 48,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
            <TextField
              className="custom-bordered-input"
              name="openpcs"
              value={formData.openpcs}
              variant="filled"
              size="small"
              label="Box/Pc"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[2] = el)}
              onKeyDown={(e) => handleKeyDown(e, 2)}
              onBlur={() => handleRateBlur("openpcs")}
              inputProps={{
                maxLength: 10,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
          </div>
          <div style={{marginTop:2}}>
            <TextField
              className="custom-bordered-input"
              name="Mmopbals"
              value={formData.Mmopbals}
              variant="filled"
              size="small"
              label="Op.Stock in Rs"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[3] = el)}
              onKeyDown={(e) => handleKeyDown(e, 3)}
              onBlur={() => handleRateBlur("Mmopbals")}
              inputProps={{
                maxLength: 10,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 400 }}
            />
          </div>
          <div style={{marginTop:2}}>
            <Autocomplete
            freeSolo
            disableClearable
            options={isEditMode && !isDisabled ? getUniqueValues("Add2s") : []}
            value={formData.Add2s}
            onInputChange={handleChangeAuto("Add2s")}
            renderInput={(params) => (
              <TextField
                {...params}
                className="custom-bordered-input"
                id="ahead"
                variant="filled"
                size="small"
                label="Group Name"
                inputRef={(el) => (inputRefs.current[4] = el)}
                onKeyDown={(e) => handleKeyDown(e, 4)}
                inputProps={{
                  ...params.inputProps,
                  maxLength: 48,
                  style: {
                    height: "15px",
                    fontSize: 16,
                  },
                  readOnly: !isEditMode || isDisabled,
                }}
                sx={{ width: 400 }}
              />
            )}
            />
            {/* <TextField
              className="custom-bordered-input"
              name="Add2s"
              value={formData.Add2s}
              variant="filled"
              size="small"
              label="Group Name"
              onChange={handleChange}
              inputRef={(el) => (inputRefs.current[4] = el)}
              onKeyDown={(e) => handleKeyDown(e, 4)}
              inputProps={{
                maxLength: 10,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 400 }}
            /> */}
          </div>
          <div style={{marginTop:2}}>
            <TextField
              className="custom-bordered-input"
              name="Prate"
              value={formData.Prate}
              variant="filled"
              size="small"
              label="Purchase Rate"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[5] = el)}
              onKeyDown={(e) => handleKeyDown(e, 5)}
              onBlur={() => handleRateBlur("Prate")}
              inputProps={{
                maxLength: 10,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 400 }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row",marginTop:2 }}>
            <TextField
              className="custom-bordered-input"
              name="Mrps"
              value={formData.Mrps}
              variant="filled"
              size="small"
              label="M.R.P"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[6] = el)}
              onKeyDown={(e) => handleKeyDown(e, 6)}
              onBlur={() => handleRateBlur("Mrps")}
              inputProps={{
                maxLength: 48,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
            <TextField
              className="custom-bordered-input"
              name="Cds"
              value={formData.Cds}
              variant="filled"
              size="small"
              label="Less%"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[7] = el)}
              onKeyDown={(e) => handleKeyDown(e, 7)}
              onBlur={() => handleRateBlur("Cds")}
              inputProps={{
                maxLength: 10,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row",marginTop:2 }}>
            <TextField
              className="custom-bordered-input"
              name="Srate"
              value={formData.Srate}
              variant="filled"
              size="small"
              label="Sale Rate"
              onChange={handleSrateChange}
              inputRef={(el) => (inputRefs.current[8] = el)}
              onKeyDown={(e) => handleKeyDown(e, 8)}
              onBlur={() => handleRateBlur("Srate")}
              inputProps={{
                maxLength: 48,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
            <div style={{ width: 200 }}>
              <FormControl
                className="custom-bordered-input"
                fullWidth
                size="small"
                variant="filled"
                disabled={!isEditMode || isDisabled}
              >
                <InputLabel id="itax_rate">GST RATE</InputLabel>
                <Select
                  className="custom-bordered-input"
                  labelId="itax_rate"
                  name="itax_rate"
                  value={formData.itax_rate}
                  onChange={handleChangevalues}
                  // inputRef={(el) => (inputRefs.current[9] = el)}
                  // onKeyDown={(e) => handleKeyDown(e, 9)}
                  label="GST RATE"
                  sx={{
                    fontSize: 16,
                    color: "black", // Dropdown text color
                    height: "42px",
                  }}
                    MenuProps={{
                    disablePortal: true,
                  }}
                >
                  <MenuItem value=""> </MenuItem>
                  <MenuItem value={5}>5%</MenuItem>
                  <MenuItem value={12}>12%</MenuItem>
                  <MenuItem value={18}>18%</MenuItem>
                  <MenuItem value={28}>28%</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row",marginTop:2 }}>
            <TextField
              className="custom-bordered-input"
              name="ctax_rate"
              value={formData.ctax_rate}
              variant="filled"
              size="small"
              label="C.GST"
              // onChange={handleNumberChange}
              // inputRef={(el) => (inputRefs.current[7] = el)}
              // onKeyDown={(e) => handleKeyDown(e, 7)}
              onBlur={() => handleRateBlur("ctax_rate")}
              inputProps={{
                maxLength: 48,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
            <TextField
              className="custom-bordered-input"
              name="Stax_rate"
              value={formData.Stax_rate}
              variant="filled"
              size="small"
              label="S.GST"
              // onChange={handleNumberChange}
              // inputRef={(el) => (inputRefs.current[7] = el)}
              // onKeyDown={(e) => handleKeyDown(e, 7)}
              onBlur={() => handleRateBlur("Stax_rate")}
              inputProps={{
                maxLength: 48,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row",marginTop:2 }}>
            <TextField
              className="custom-bordered-input"
              name="Drate"
              value={formData.Drate}
              variant="filled"
              size="small"
              label="CESS QTY"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[9] = el)}
              onKeyDown={(e) => handleKeyDown(e, 9)}
              onBlur={() => handleRateBlur("Drate")}
              inputProps={{
                maxLength: 48,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
            <TextField
              className="custom-bordered-input"
              name="Cess_rate"
              value={formData.Cess_rate}
              variant="filled"
              size="small"
              label="CESS @"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[10] = el)}
              onKeyDown={(e) => handleKeyDown(e, 10)}
              onBlur={() => handleRateBlur("Cess_rate")}
              inputProps={{
                maxLength: 48,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
          </div>
          <div style={{marginTop:2}}>
            {PurchaseAcc.map((item, index) => (
              <Box key={item.Pcodess}>
                <TextField
                  variant="filled"
                  size="small"
                  label="PURCHASE A/C"
                  className="custom-bordered-input"
                  value={item.Pcodess || ""}
                  inputRef={(el) => (inputRefs.current[11] = el)}
                  inputProps={{
                    maxLength: 48,
                    style: {
                      height: "15px",
                      fontSize: 16,
                      // padding: "0 8px"
                    },
                    readOnly: !isEditMode || isDisabled,
                  }}
                  onChange={(e) => {
                    const newPur = [...PurchaseAcc];
                    newPur[index].Pcodess = e.target.value;
                    setPurchaseAcc(newPur);
                    setIsEditMode(true);
                  }}
                  onKeyDown={(e) => {
                    handleOpenModal(e, index, "Pcodess");
                    handleKeyDown(e, 11);
                    handleOpenModalBack(e, index, "Pcodess");
                  }}
                  sx={{ width: 400 }}
                />
              </Box>
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
          <div style={{marginTop:2}}>
            {SaleAcc.map((item, index) => (
              <Box key={item.Scodess}>
                <TextField
                  variant="filled"
                  size="small"
                  label="SALE A/C"
                  className="custom-bordered-input"
                  value={item.Scodess || ""}
                  inputRef={(el) => (inputRefs.current[12] = el)}
                  inputProps={{
                    maxLength: 48,
                    style: {
                      height: "15px",
                      fontSize: 16,
                      // padding: "0 8px"
                    },
                    readOnly: !isEditMode || isDisabled,
                  }}
                  onChange={(e) => {
                    const newPur = [...SaleAcc];
                    newPur[index].Scodess = e.target.value;
                    setSaleAcc(newPur);
                  }}
                  onKeyDown={(e) => {
                    handleOpenModal(e, index, "Scodess");
                    handleKeyDown(e, 12);
                    handleOpenModalBack(e, index, "Scodess");
                  }}
                  sx={{ width: 400 }}
                />
              </Box>
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
          <div style={{ display: "flex", flexDirection: "row",marginTop:2 }}>
            <TextField
              className="custom-bordered-input"
              name="Pack"
              value={formData.Pack}
              variant="filled"
              size="small"
              label="SIZE"
              onChange={handleChange}
              inputRef={(el) => (inputRefs.current[13] = el)}
              onKeyDown={(e) => handleKeyDown(e, 13)}
              inputProps={{
                maxLength: 12,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
            <TextField
              className="custom-bordered-input"
              id="Hsn"
              value={formData.Hsn}
              variant="filled"
              size="small"
              label="HSN CODE"
              onChange={handleNumericValue}
              inputRef={(el) => (inputRefs.current[14] = el)}
              onKeyDown={(e) => handleKeyDown(e, 14)}
              inputProps={{
                maxLength: 12,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
          </div>
        </div>

        {/* Second Half Screen */}
        <div className="SecondHalf">
          <div style={{ display: "flex", flexDirection: "row",marginTop:3 }}>
            <TextField
              className="custom-bordered-input"
              name="schemes"
              value={formData.schemes}
              variant="filled"
              size="small"
              label="SCHEME @"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[15] = el)}
              onKeyDown={(e) => handleKeyDown(e, 15)}
              onBlur={() => handleRateBlur("schemes")}
              inputProps={{
                maxLength: 4,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
            <input
              value={"ExpireDate"}
              style={{
                width: 78,
                height: 40,
                textAlign: "center",
                marginLeft: 2,
                marginRight: 2,
                backgroundColor: "skyblue",
                color: "black",
                borderRadius: 5,
              }}
              disabled
            />
            <DatePicker
              id="duedate"
              value={formData.duedate}
              className="DatePICKERstock"
              selected={expiredDate}
              onChange={handleDateChange}
              readOnly={!isEditMode || isDisabled}
              placeholderText="DueDate"
              dateFormat="dd-MM-yyyy"
            />
          </div>
         <div style={{marginTop:3}}>
            <FormControl
              variant="filled"
              sx={{width: "100%"}}
              className="custom-bordered-input"
              size="small"
              disabled={!isEditMode || isDisabled}
            >
              <InputLabel
                id="rateins-label"
                sx={{
                  fontSize: "1rem", // 👈 Larger label
                  fontWeight: 600, // 👈 Bold
                  color: "black",
                }}
              >
                RATE CALCULATE
              </InputLabel>
              <Select
                labelId="rateins-label"
                className="custom-bordered-input"
                name="Rateins"
                id="rateins"
                value={formData.Rateins}
                onChange={handleratecal}
                label="RATE CALCULATE"
                // inputRef={(el) => (inputRefs.current[17] = el)} // 👈 Assign ref
                // onKeyDown={(e) => handleKeyDown(e, 17)} // 👈 Handle Enter key
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                <MenuItem value="Default">Default</MenuItem>
                <MenuItem value="Wt/Qty">Wt/Qty</MenuItem>
                <MenuItem value="Pc/Pkgs">Pc/Pkgs</MenuItem>
                <MenuItem value="Specific">Specific</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{marginTop:3}}>
            <FormControl
              variant="filled"
              size="small"
              disabled={!isEditMode || isDisabled}
              sx={{width: "100%"}}
              className="custom-bordered-input"
            >
              <InputLabel
                id="stockins-label"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "black",
                }}
              >
                CLS STOCK IN
              </InputLabel>

              <Select
                labelId="stockins-label"
                name="Stockins"
                value={formData.Stockins}
                onChange={hanldeclsStock}
                // inputRef={(el) => (inputRefs.current[18] = el)}
                // onKeyDown={(e) => handleKeyDown(e, 18)}
                displayEmpty
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                <MenuItem value="Wt/Qty">Wt/Qty</MenuItem>
                <MenuItem value="Pieces/Case">Pieces/Case</MenuItem>
                <MenuItem value="Default">Default</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{marginTop:3}}>
            <FormControl
              variant="filled"
              size="small"
              disabled={!isEditMode || isDisabled}
              sx={{width: "100%"}}
              className="custom-bordered-input"
            >
              <InputLabel
                id="tradename-label"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "black",
                }}
              >
                PORTAL UOM
              </InputLabel>

              <Select
                labelId="tradename-label"
                name="TradeName"
                value={formData.TradeName}
                onChange={handleportal}
                // inputRef={(el) => (inputRefs.current[19] = el)}
                // onKeyDown={(e) => handleKeyDown(e, 19)}
                displayEmpty
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>

                <MenuItem value="TUB">TUB-TUBES</MenuItem>
                <MenuItem value="UGS-US">UGS-US GALLONS</MenuItem>
                <MenuItem value="UNT">UNT-UNITS</MenuItem>
                <MenuItem value="YDS">YDS-YARDS</MenuItem>
                <MenuItem value="OTH">OTH-OTHERS</MenuItem>
                <MenuItem value="LTR">LTR-LITRES</MenuItem>
                <MenuItem value="TON">TON-TONNES</MenuItem>
                <MenuItem value="THD">THD-THOUSAND</MenuItem>
                <MenuItem value="TGM">TGM-TEN GROSS</MenuItem>
                <MenuItem value="TBS">TBS-TABLETS</MenuItem>
                <MenuItem value="SQY">SQY-SQUARE YARDS</MenuItem>
                <MenuItem value="SQM">SQM-SQUARE METERS</MenuItem>
                <MenuItem value="SQF">SQF-SQUARE-FEET</MenuItem>
                <MenuItem value="SET">SET-SETS</MenuItem>
                <MenuItem value="ROL">ROL-ROLLS</MenuItem>
                <MenuItem value="QTL">QTL-QUINTAL</MenuItem>
                <MenuItem value="PRS">PRS-PAIRS</MenuItem>
                <MenuItem value="PCS">PCS-PIECES</MenuItem>
                <MenuItem value="PAC">PAC-PACKS</MenuItem>
                <MenuItem value="NOS">NOS-NUMBERS</MenuItem>
                <MenuItem value="MTS">MTS-METRIC TON</MenuItem>
                <MenuItem value="MTR">MTR-METERS</MenuItem>
                <MenuItem value="MLT">MLT-MILILITRE</MenuItem>
                <MenuItem value="KME">KME-KILOMETRE</MenuItem>
                <MenuItem value="KLR">KLR-KILOLITRE</MenuItem>
                <MenuItem value="KGS">KGS-KILOGRAMS</MenuItem>
                <MenuItem value="GYD">GYD-GROSS YARDS</MenuItem>
                <MenuItem value="GRS">GRS-GROSS</MenuItem>
                <MenuItem value="GMS">GMS-GRAMMES</MenuItem>
                <MenuItem value="GGK">GGK-GREAT GROSS</MenuItem>
                <MenuItem value="DRM">DRM-DRUMS</MenuItem>
                <MenuItem value="DOZ">DOZ-DOZENS</MenuItem>
                <MenuItem value="CTN">CTN-CARTONS</MenuItem>
                <MenuItem value="CMS">CMS-CENTIMETERS</MenuItem>
                <MenuItem value="CCM">
                  CCM-CUBIC CENTIMETERS
                </MenuItem>
                <MenuItem value="CBM">CBM-CUBIC METERS</MenuItem>
                <MenuItem value="CAN">CAN-CANS</MenuItem>
                <MenuItem value="BUN">BUN-BUNCHES</MenuItem>
                <MenuItem value="BTL">BTL-BOTTLES</MenuItem>
                <MenuItem value="BOX">BOX-BOX</MenuItem>
                <MenuItem value="BAG">BAG-BAGS</MenuItem>
                <MenuItem value="BAL">BAL-BALE</MenuItem>
                <MenuItem value="BDL">BDL-BUNDLES</MenuItem>
                <MenuItem value="BKL">BKL-BUCKLES</MenuItem>
                <MenuItem value="BOU">
                  BOU-BILLION OF UNITS
                </MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{marginTop:3}}>
            <FormControl
              variant="filled"
              size="small"
              disabled={!isEditMode || isDisabled}
              sx={{width: "100%"}}
              className="custom-bordered-input"
            >
              <InputLabel
                id="stkcals-label"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "black",
                }}
              >
                STOCK CALCULATE
              </InputLabel>

              <Select
                labelId="stkcals-label"
                name="Stkcals"
                value={formData.Stkcals}
                onChange={handlestockCal}
                // inputRef={(el) => (inputRefs.current[20] = el)}
                // onKeyDown={(e) => handleKeyDown(e, 20)}
                displayEmpty
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                <MenuItem value="Wt/Qty">Wt/Qty</MenuItem>
                <MenuItem value="Pc/Packet">Pc/Packet</MenuItem>
                <MenuItem value="Default">Default</MenuItem>
                <MenuItem value="Wt/Qty Fix">Wt/Qty Fix</MenuItem>
                <MenuItem value="Pc/Packet Fix">Pc/Packet Fix</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{marginTop:3}}>
            <FormControl
              variant="filled"
              size="small"
              disabled={!isEditMode || isDisabled}
              sx={{width: "100%"}}
              className="custom-bordered-input"
            >
              <InputLabel
                id="types-label"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "black",
                }}
              >
                GOODS TYPE
              </InputLabel>

              <Select
                labelId="types-label"
                name="Types"
                value={formData.Types}
                onChange={handleGoods}
                // inputRef={(el) => (inputRefs.current[21] = el)}
                // onKeyDown={(e) => handleKeyDown(e, 21)}
                displayEmpty
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                <MenuItem value="Raw Material">Raw Material</MenuItem>
                <MenuItem value="Finished Product">Finished Product</MenuItem>
                <MenuItem value="Semi-Finished Product">
                  Semi-Finished Product
                </MenuItem>
                <MenuItem value="Bye Product">Bye Product</MenuItem>
                <MenuItem value="Wastage">Wastage</MenuItem>
                <MenuItem value="Consumable">Consumable</MenuItem>
                <MenuItem value="Other Goods">Other Goods</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{marginTop:3}}>
            <FormControl
              variant="filled"
              size="small"
              disabled={!isEditMode || isDisabled}
              sx={{width: "100%"}}
              className="custom-bordered-input"
            >
              <InputLabel
                id="stkvals-label"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "black",
                }}
              >
                STK VALUATION
              </InputLabel>

              <Select
                labelId="stkvals-label"
                name="Stkvals"
                value={formData.Stkvals}
                onChange={handlestkValuation}
                // inputRef={(el) => (inputRefs.current[22] = el)}
                // onKeyDown={(e) => handleKeyDown(e, 22)}
                displayEmpty
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                <MenuItem value="Purchase Rate">Purchase Rate</MenuItem>
                <MenuItem value="Sale Rate">Sale Rate</MenuItem>
                <MenuItem value="None">None</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={{ display: "flex", flexDirection: "row",marginTop:3}}>
            <TextField
              className="custom-bordered-input"
              name="Qpps"
              value={formData.Qpps}
              variant="filled"
              size="small"
              label="QTY PER PC/CASE"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[16] = el)}
              onKeyDown={(e) => handleKeyDown(e, 16)}
              onBlur={() => handleRateBlur("Qpps")}
              inputProps={{
                maxLength: 8,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
            <TextField
              className="custom-bordered-input"
              name="tariff"
              value={formData.tariff}
              variant="filled"
              size="small"
              label="TARIFF"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[17] = el)}
              onKeyDown={(e) => handleKeyDown(e, 17)}
              onBlur={() => handleRateBlur("tariff")}
              inputProps={{
                maxLength: 8,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "row",marginTop:3 }}>
            <TextField
              className="custom-bordered-input"
              name="Inval"
              value={formData.Inval}
              variant="filled"
              size="small"
              label="MIN> STOCK LEVEL"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[18] = el)}
              onKeyDown={(e) => handleKeyDown(e, 18)}
              onBlur={() => handleRateBlur("Inval")}
              inputProps={{
                maxLength: 8,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
            <TextField
              className="custom-bordered-input"
              name="Rg23c"
              value={formData.Rg23c}
              variant="filled"
              size="small"
              // label="TARIFF"
              onChange={handleNumberChange}
              inputRef={(el) => (inputRefs.current[19] = el)}
              onKeyDown={(e) => handleKeyDown(e, 19)}
              onBlur={() => handleRateBlur("Rg23c")}
              inputProps={{
                maxLength: 8,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
          </div>
          <div style={{marginTop:3}}>
            <FormControl
              variant="filled"
              size="small"
              disabled={!isEditMode || isDisabled}
              sx={{width: "100%"}}
              className="custom-bordered-input"
            >
              <InputLabel
                id="tcs206-label"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "black",
                }}
              >
                206(1H) / 194Q
              </InputLabel>

              <Select
                labelId="tcs206-label"
                name="Tcs206"
                value={formData.Tcs206}
                onChange={handleselection}
                // inputRef={(el) => (inputRefs.current[29] = el)}
                // onKeyDown={(e) => handleKeyDown(e, 29)}
                displayEmpty
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">NO</MenuItem>
                <MenuItem value="NA">NA</MenuItem>
              </Select>
            </FormControl>
          </div>
           <div style={{marginTop:3}}>
            <FormControl
              variant="filled"
              size="small"
              disabled={!isEditMode || isDisabled}
              sx={{width: "100%"}}
              className="custom-bordered-input"
            >
              <InputLabel
                id="stype-label"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "black",
                }}
              >
                GST TYPE
              </InputLabel>

              <Select
                className="custom-bordered-input"
                labelId="stype-label"
                name="Stype"
                value={formData.Stype}
                onChange={handlegsttype}
                // inputRef={(el) => (inputRefs.current[30] = el)}
                // onKeyDown={(e) => handleKeyDown(e, 30)}
                displayEmpty
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em></em>
                </MenuItem>
                <MenuItem value="Taxable">Taxable</MenuItem>
                <MenuItem value="Free Tax">Free Tax</MenuItem>
                <MenuItem value="Non GST">Non GST</MenuItem>
                <MenuItem value="Services">Services</MenuItem>
                <MenuItem value="Exempted">Exempted</MenuItem>
                <MenuItem value="X-Not Sale">X-Not Sale</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        
        <div className="ThirdHalf">
          <div style={{display:'flex',flexDirection:'row'}}>
          <input
          disabled={!isEditMode || isDisabled}
          type="checkbox"
          name="T1"
          checked={formData.T1}
          onChange={handleChangeCheckBox}
          className="custom-checkbox"
          />
          <text style={{marginLeft:"2%"}}>ADD TO PRODUCTION CARD</text>
          </div>
          {formData.T1 && (
          <>
          <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
            <TextField
              className="custom-bordered-input"
              id="Psrno"
              value={formData.Psrno}
              variant="filled"
              size="small"
              label="SR.NO"
              onChange={handleNumericValue}
              // inputRef={(el) => (inputRefs.current[14] = el)}
              // onKeyDown={(e) => handleKeyDown(e, 14)}
              inputProps={{
                maxLength: 12,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
          </div>
          <div style={{display:'flex',flexDirection:'row'}}>
            <TextField
              className="custom-bordered-input"
              id="PUnitno"
              value={formData.PUnitno}
              variant="filled"
              size="small"
              label="UNIT NO."
              onChange={handleNumericValue}
              // inputRef={(el) => (inputRefs.current[14] = el)}
              // onKeyDown={(e) => handleKeyDown(e, 14)}
              inputProps={{
                maxLength: 12,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
          </div>
          <div style={{display:'flex',flexDirection:'row'}}>
            <TextField
              className="custom-bordered-input"
              id="percentage"
              value={formData.percentage}
              variant="filled"
              size="small"
              label="PERCENTAGE"
              onChange={handleNumericValue}
              // inputRef={(el) => (inputRefs.current[14] = el)}
              // onKeyDown={(e) => handleKeyDown(e, 14)}
              onBlur={() => handleRateBlur("percentage")}
              inputProps={{
                maxLength: 12,
                style: {
                  height: "15px",
                  fontSize: 16,
                  // padding: "0 8px"
                },
                readOnly: !isEditMode || isDisabled,
              }}
              sx={{ width: 200 }}
            />
          </div>
          </>
          )}
        </div> 
      </div>
      <div className="Buttonsgroupz">
        <Button
          className="Buttonz"
          style={{ color: "black", backgroundColor: buttonColors[0] }}
          onClick={handleAdd}
          disabled={!isAddEnabled}
        >
          Add
        </Button>
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
          onClick={() => openModalForItem(0)}
        >
          Search
        </Button>
        {showModal && (
        <ProductModal
          products={products}
          allFields={allFields}
          onSelect={handleProductSelect}
          onClose={handleModalDone}
          tenant={tenant}
          fetchParentProducts={fetchProducts}
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
            ref={(el) => (inputRefs.current[20] = el)} // Assign ref
            className="Buttonz"
            onClick={handleSaveClick}
            disabled={!isSubmitEnabled}
            style={{ color: "black", backgroundColor: buttonColors[10] }}
            // onClick={handleSubmit} disabled={!isSubmitEnabled}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewStockAcc;
