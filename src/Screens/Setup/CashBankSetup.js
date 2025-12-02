import React, { useState, useEffect } from "react";
import "./CashBankSetup.css";
import ProductModalAccount from "../Modals/ProductModalAccount";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  Stack,
  FormLabel,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { CompanyContext } from "../Context/CompanyContext";
import { useContext } from "react";

const CashBankSetup = ({ onClose }) => {
  const { company } = useContext(CompanyContext);
  // const tenant = company?.databaseName;
  const tenant = "shkun_05062025_05062026"

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    console.error("No tenant selected!");
  }

  const [title, setTitle] = useState("(View)");
  const [pressedKey, setPressedKey] = useState("");
  const [formData, setFormData] = useState({
    Bank_text1: "",
    Bank_text5: "",
    narration: "",
    chg_narr: "",
    Bnk_narr: "",
    AcDiscBank: "",
    ApplyNarration: "",
    NegativeCashTransac: "",
    duplicateAlert: "",
    TdsOption: "",
    CashValidate: "",
    B1: "",
    B2: "",
    B3: "",
    B4: "",
    B5: "",
    decimals: "",
  });
  const [cashCode, setcashCode] = useState([
    {
      cash_code: "",
      cash_Ac: "",
    },
  ]);
  const [DiscountPaid, setDiscountPaid] = useState([
    {
      disPaid_code: "",
      disPaid_Ac: "",
    },
  ]);
  const [DiscountReceipt, setDiscountReceipt] = useState([
    {
      disRec_code: "",
      disRec_Ac: "",
    },
  ]);
  const [BankChargesCode, setBankChargesCode] = useState([
    {
      bankchr_code: "",
      bankchr_Ac: "",
    },
  ]);
  const [DefBankName, setDefBankName] = useState([
    {
      defBank_code: "",
      defBank_Ac: "",
    },
  ]);
  const [tcs206code, settcs206code] = useState([
    {
      Tcs206_code: "",
      Tcs206_ac: "",
    },
  ]);
  const [cgstcode, setcgstcode] = useState([
    {
      cgst_code: "",
      cgst_ac: "",
    },
  ]);
  const [sgstcode, setsgstcode] = useState([
    {
      sgst_code: "",
      sgst_ac: "",
    },
  ]);
  const [igstcode, setigstcode] = useState([
    {
      igst_code: "",
      igst_ac: "",
    },
  ]);
  // FETCH DATA
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [index, setIndex] = useState(0);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAbcmode, setIsAbcmode] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [firstTimeCheckData, setFirstTimeCheckData] = useState("");
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const isEmpty =
      formData &&
      Object.values(formData).every((v) =>
        v === "" ||
        v === null ||
        v === undefined ||
        v === 0 ||
        v === false
      );

    setIsSubmitEnabled(isEmpty);
  }, [formData]);
  
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/cashbanksetup`
      );
      if (response.status === 200 && response.data.length > 0) {
        const lastEntry = response.data[response.data.length - 1]; // Assuming you want the last one
        setFormData(lastEntry.formData);
        setData1(lastEntry);
        setIndex(lastEntry._id);
        // Convert cesscode into an array containing one object
        setcashCode([{ cash_code: lastEntry.formData.cash_code, cash_Ac: lastEntry.formData.cash_Ac,  }]);
        setDiscountPaid([{ disPaid_code: lastEntry.formData.disPaid_code, disPaid_Ac: lastEntry.formData.disPaid_Ac }]);
        setDiscountReceipt([{ disRec_code: lastEntry.formData.disRec_code, disRec_Ac: lastEntry.formData.disRec_Ac }]);
        setBankChargesCode([{ bankchr_code: lastEntry.formData.bankchr_code, bankchr_Ac: lastEntry.formData.bankchr_Ac }]);
        setDefBankName([{ defBank_code: lastEntry.formData.defBank_code, defBank_Ac: lastEntry.formData.defBank_Ac }]);
        settcs206code([
          {
            Tcs206_code: lastEntry.formData.Tcs206_code,
            Tcs206_ac: lastEntry.formData.Tcs206_ac,
          },
        ]);
        setcgstcode([
          {
            cgst_code: lastEntry.formData.cgst_code,
            cgst_ac: lastEntry.formData.cgst_ac,
          },
        ]);
        setsgstcode([
          {
            sgst_code: lastEntry.formData.sgst_code,
            sgst_ac: lastEntry.formData.sgst_ac,
          },
        ]);
        setigstcode([
          {
            igst_code: lastEntry.formData.igst_code,
            igst_ac: lastEntry.formData.igst_ac,
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
    const emptyData = {
      Bank_text1: "",
      Bank_text5: "",
      narration: "",
      chg_narr: "",
      Bnk_narr: "",
      AcDiscBank: "",
      ApplyNarration: "",
      NegativeCashTransac: "",
      duplicateAlert: "",
      TdsOption: "",
      CashValidate: "",
      B1: "",
      B2: "",
      B3: "",
      B4: "",
      B5: "",
      decimals: 2,
    };
    const emptyDisPaid = [{ disPaid_code: "", disPaid_Ac: "" }];
    const emptyDisReceipt = [{ disRec_code: "", disRec_Ac: "" }];
    const emptyBankChr = [{ bankchr_code: "", bankchr_Ac:"" }];
    const emptyDefBank = [{ defBank_code: "", defBank_Ac:"" }];
    const emptyTcs206code = [{ Tcs206_code: "", Tcs206_ac: "" }];
    const emptycgstcode = [{ cgst_code: "", cgst_ac: "" }];
    const emptysgstcode = [{ sgst_code: "", sgst_ac: "" }];
    const emptyigstcode = [{ igst_code: "", igst_ac: "" }];

    setFormData(emptyData);
    setData1({
      formData: emptyData,
      DiscountPaid: emptyDisPaid,
      DiscountReceipt: emptyDisReceipt,
      BankChargesCode: emptyBankChr,
      DefBankName: emptyDefBank,
      tcs206code: emptyTcs206code,
      cgstcode: emptycgstcode,
      sgstcode: emptysgstcode,
      igstcode: emptyigstcode,
    });
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

  const handleNarration = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      ApplyNarration: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleDesc = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      AcDiscBank: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleNegCash = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      NegativeCashTransac: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleDuplicate = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      duplicateAlert: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleTdsOption = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      TdsOption: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleCashValidate = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      CashValidate: value, // Update the ratecalculate field in FormData
    }));
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
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
      setProductsCashAc(formattedData);
      setLoadingCashAc(false);
      setProductsAcc(formattedData);
      setLoadingAcc(false);
      setProductbankchrg(formattedData);
      setLoadingbankchrg(false);
      setProductdefaultname(formattedData);
      setLoadingdefaultname(false);
      setProducttcs206(formattedData);
      setLoadingtcs206(false);
      setProductcgst(formattedData);
      setLoadingcgst(false);
      setProductsgst(formattedData);
      setLoadingsgst(false);
      setProductigst(formattedData);
      setLoadingigst(false);
    } catch (error) {
      setErrorCus(error.message);
      setLoadingCus(false);
      setErrorCashAc(error.message);
      setLoadingCashAc(false);
      setErrorAcc(error.message);
      setLoadingAcc(false);
      setErrorbankchrg(error.message);
      setLoadingbankchrg(false);
      setErrordefaultname(error.message);
      setLoadingdefaultname(false);
      setErrortcs206(error.message);
      setLoadingtcs206(false);
      setErrorcgst(error.message);
      setLoadingcgst(false);
      setErrorsgst(error.message);
      setLoadingsgst(false);
      setErrorigst(error.message);
      setLoadingigst(false);
    }
  };

    // Modal for Discount Paid
  const [productsCashAc, setProductsCashAc] = useState([]);
  const [showModalCashAc, setShowModalCashAc] = useState(false);
  const [selectedItemIndexCashAc, setSelectedItemIndexCashAc] = useState(null);
  const [loadingCashAc, setLoadingCashAc] = useState(true);
  const [errorCashAc, setErrorCashAc] = useState(null);

  const handleItemChangeCashAc = (index, key, value) => {
    const updatedItems = [...cashCode];
    updatedItems[index][key] = capitalizeWords(value); // Capitalize words here

    // If the key is 'name', find the corresponding product and set the price
    if (key === "name") {
      const selectedProduct = productsCashAc.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["cash_code"] = selectedProduct.acode;
        updatedItems[index]["cash_Ac"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
      // Add discount logic here if needed
    }

    setcashCode(updatedItems);
  };

  const handleProductSelectCashAc = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalCashAc(false);
      return;
    }

    // Deep copy DiscountPaid array
    const updatedDiscountPaid = [...cashCode];

    // Update the correct object in the array
    updatedDiscountPaid[selectedItemIndexCashAc] = {
      ...updatedDiscountPaid[selectedItemIndexCashAc],
      cash_code: product.acode || "",
      cash_Ac: product.ahead || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexCashAc !== null) {
      handleItemChangeCashAc(selectedItemIndexCashAc, "name", nameValue);
    }

    setcashCode(updatedDiscountPaid); // <- update the array in state!
    setIsEditMode(true);
    setShowModalCashAc(false);
  };

  const openModalForItemCashAc = (index) => {
    setSelectedItemIndexCashAc(index);
    setShowModalCashAc(true);
  };

  const allFieldsCashAc = productsCashAc.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });

    return fields;
  }, []);

  // Modal for Discount Paid
  const [productsCus, setProductsCus] = useState([]);
  const [showModalCus, setShowModalCus] = useState(false);
  const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
  const [loadingCus, setLoadingCus] = useState(true);
  const [errorCus, setErrorCus] = useState(null);
  const handleItemChangeCus = (index, key, value) => {
    const updatedItems = [...DiscountPaid];
    updatedItems[index][key] = capitalizeWords(value); // Capitalize words here
    // If the key is 'name', find the corresponding product and set the price
    if (key === "name") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["disPaid_code"] = selectedProduct.acode;
        updatedItems[index]["disPaid_Ac"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setDiscountPaid(updatedItems);
  };

  const handleProductSelectCus = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalCus(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...DiscountPaid];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexCus] = {
      ...updatedShipped[selectedItemIndexCus],
      disPaid_code: product.acode || "",
      disPaid_Ac: product.ahead || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexCus !== null) {
      handleItemChangeCus(selectedItemIndexCus, "name", nameValue);
    }
    setDiscountPaid(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalCus(false);
  
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

  // Modal For Discount Receipt
  const [productsAcc, setProductsAcc] = useState([]);
  const [showModalAcc, setShowModalAcc] = useState(false);
  const [selectedItemIndexAcc, setSelectedItemIndexAcc] = useState(null);
  const [loadingAcc, setLoadingAcc] = useState(true);
  const [errorAcc, setErrorAcc] = useState(null);

  const handleItemChangeAcc = (index, key, value) => {
    const updatedItems = [...DiscountReceipt];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productsAcc.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["disRec_code"] = selectedProduct.acode;
        updatedItems[index]["disRec_Ac"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setDiscountReceipt(updatedItems);
  };

  const handleProductSelectAcc = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalAcc(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...DiscountReceipt];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexAcc] = {
      ...updatedShipped[selectedItemIndexAcc],
      disRec_code: product.acode || "",
      disRec_Ac: product.ahead || ""
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexAcc !== null) {
      handleItemChangeAcc(selectedItemIndexAcc, "name", nameValue);
    }
    setDiscountReceipt(updatedShipped);       // <- update the array in state!
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

  // Modal For Bank Charges (bankchrg)
  const [productbankchrg, setProductbankchrg] = useState([]);
  const [showModalbankchrg, setShowModalbankchrg] = useState(false);
  const [selectedItemIndexbankchrg, setSelectedItemIndexbankchrg] =
    useState(null);
  const [loadingbankchrg, setLoadingbankchrg] = useState(true);
  const [errorbankchrg, setErrorbankchrg] = useState(null);

  const handleItemChangebankchrg = (index, key, value) => {
    const updatedItems = [...BankChargesCode];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productbankchrg.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["bankchr_code"] = selectedProduct.acode;
        updatedItems[index]["bankchr_Ac"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setBankChargesCode(updatedItems);
  };

  // const handleProductSelectbankchrg = (product) => {
  //   setIsEditMode(true);
  //   if (selectedItemIndexbankchrg !== null) {
  //     handleItemChangebankchrg(selectedItemIndexbankchrg,"ahead", product.ahead);
  //     setShowModalbankchrg(false);
  //   }
  // };
  const handleProductSelectbankchrg = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalbankchrg(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...BankChargesCode];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexbankchrg] = {
      ...updatedShipped[selectedItemIndexbankchrg],
      bankchr_code: product.acode || "",
      bankchr_Ac: product.ahead || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexbankchrg !== null) {
      handleItemChangebankchrg(selectedItemIndexbankchrg, "name", nameValue);
    }
    setBankChargesCode(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalbankchrg(false);
  
  };

  const openModalForItembankchrg = (index) => {
    setSelectedItemIndexbankchrg(index);
    setShowModalbankchrg(true);
  };

  const allFieldsbankchrg = productbankchrg.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);
  // Modal For Default Name (defaultname)
  const [productdefaultname, setProductdefaultname] = useState([]);
  const [showModaldefaultname, setShowModaldefaultname] = useState(false);
  const [selectedItemIndexdefaultname, setSelectedItemIndexdefaultname] =
    useState(null);
  const [loadingdefaultname, setLoadingdefaultname] = useState(true);
  const [errordefaultname, setErrordefaultname] = useState(null);

  const handleItemChangedefaultname = (index, key, value) => {
    const updatedItems = [...DefBankName];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productdefaultname.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["defBank_code"] = selectedProduct.acode;
        updatedItems[index]["defBank_Ac"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setDefBankName(updatedItems);
  };

  // const handleProductSelectdefaultname = (product) => {
  //   setIsEditMode(true);
  //   if (selectedItemIndexdefaultname !== null) {
  //     handleItemChangedefaultname(
  //       selectedItemIndexdefaultname,
  //       "ahead",
  //       product.ahead
  //     );
  //     setShowModaldefaultname(false);
  //   }
  // };
  const handleProductSelectdefaultname = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModaldefaultname(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...DefBankName];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexdefaultname] = {
      ...updatedShipped[selectedItemIndexdefaultname],
      defBank_code: product.acode || "",
      defBank_Ac: product.ahead || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexdefaultname !== null) {
      handleItemChangedefaultname(selectedItemIndexdefaultname, "name", nameValue);
    }
    setDefBankName(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModaldefaultname(false);
  
  };

  const openModalForItemdefaultname = (index) => {
    setSelectedItemIndexdefaultname(index);
    setShowModaldefaultname(true);
  };

  const allFieldsdefaultname = productdefaultname.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);
  // Modal For TCS206
  const [producttcs206, setProducttcs206] = useState([]);
  const [showModaltcs206, setShowModaltcs206] = useState(false);
  const [selectedItemIndextcs206, setSelectedItemIndextcs206] = useState(null);
  const [loadingtcs206, setLoadingtcs206] = useState(true);
  const [errortcs206, setErrortcs206] = useState(null);

  const handleItemChangetcs206 = (index, key, value) => {
    const updatedItems = [...tcs206code];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = producttcs206.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Tcs206_code"] = selectedProduct.acode;
        updatedItems[index]["Tcs206_ac"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    settcs206code(updatedItems);
  };

  // const handleProductSelecttcs206 = (product) => {
  //   setIsEditMode(true);
  //   if (selectedItemIndextcs206 !== null) {
  //     handleItemChangetcs206(selectedItemIndextcs206, "ahead", product.ahead);
  //     setShowModaltcs206(false);
  //   }
  // };
  const handleProductSelecttcs206 = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModaltcs206(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...tcs206code];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndextcs206] = {
      ...updatedShipped[selectedItemIndextcs206],
      Tcs206_code: product.acode || "",
      Tcs206_ac: product.ahead || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndextcs206 !== null) {
      handleItemChangetcs206(selectedItemIndextcs206, "name", nameValue);
    }
    settcs206code(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModaltcs206(false);
  };

  const openModalForItemtcs206 = (index) => {
    setSelectedItemIndextcs206(index);
    setShowModaltcs206(true);
  };

  const allFieldstcs206 = producttcs206.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);
  // Modal For CGST
  const [productcgst, setProductcgst] = useState([]);
  const [showModalcgst, setShowModalcgst] = useState(false);
  const [selectedItemIndexcgst, setSelectedItemIndexcgst] = useState(null);
  const [loadingcgst, setLoadingcgst] = useState(true);
  const [errorcgst, setErrorcgst] = useState(null);

  const handleItemChangecgst = (index, key, value) => {
    const updatedItems = [...cgstcode];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productcgst.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["cgst_code"] = selectedProduct.acode;
        updatedItems[index]["cgst_ac"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setcgstcode(updatedItems);
  };

  // const handleProductSelectcgst = (product) => {
  //   setIsEditMode(true);
  //   if (selectedItemIndexcgst !== null) {
  //     handleItemChangecgst(selectedItemIndexcgst, "ahead", product.ahead);
  //     setShowModalcgst(false);
  //   }
  // };
  const handleProductSelectcgst = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalcgst(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...cgstcode];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexcgst] = {
      ...updatedShipped[selectedItemIndexcgst],
      cgst_code: product.acode || "",
      cgst_ac: product.ahead || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexcgst !== null) {
      handleItemChangecgst(selectedItemIndexcgst, "name", nameValue);
    }
    setcgstcode(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalcgst(false);
  };

  const openModalForItemcgst = (index) => {
    setSelectedItemIndexcgst(index);
    setShowModalcgst(true);
  };

  const allFieldscgst = productcgst.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);
  // Modal For SGST
  const [productsgst, setProductsgst] = useState([]);
  const [showModalsgst, setShowModalsgst] = useState(false);
  const [selectedItemIndexsgst, setSelectedItemIndexsgst] = useState(null);
  const [loadingsgst, setLoadingsgst] = useState(true);
  const [errorsgst, setErrorsgst] = useState(null);

  const handleItemChangesgst = (index, key, value) => {
    const updatedItems = [...sgstcode];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productsgst.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["sgst_code"] = selectedProduct.acode;
        updatedItems[index]["sgst_ac"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setsgstcode(updatedItems);
  };

  // const handleProductSelectsgst = (product) => {
  //   setIsEditMode(true);
  //   if (selectedItemIndexsgst !== null) {
  //     handleItemChangesgst(selectedItemIndexsgst, "ahead", product.ahead);
  //     setShowModalsgst(false);
  //   }
  // };
  const handleProductSelectsgst = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalsgst(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...sgstcode];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexsgst] = {
      ...updatedShipped[selectedItemIndexsgst],
      sgst_code: product.acode || "",
      sgst_ac: product.ahead || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexsgst !== null) {
      handleItemChangesgst(selectedItemIndexsgst, "name", nameValue);
    }
    setsgstcode(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalsgst(false);
  };

  const openModalForItemsgst = (index) => {
    setSelectedItemIndexsgst(index);
    setShowModalsgst(true);
  };

  const allFieldsgst = productsgst.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  // Modal For IGST
  const [productigst, setProductigst] = useState([]);
  const [showModaligst, setShowModaligst] = useState(false);
  const [selectedItemIndexigst, setSelectedItemIndexigst] = useState(null);
  const [loadingigst, setLoadingigst] = useState(true);
  const [errorigst, setErrorigst] = useState(null);

  const handleItemChangeigst = (index, key, value) => {
    const updatedItems = [...igstcode];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productigst.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["igst_code"] = selectedProduct.acode;
        updatedItems[index]["igst_ac"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setigstcode(updatedItems);
  };

  // const handleProductSelectigst = (product) => {
  //   setIsEditMode(true);
  //   if (selectedItemIndexigst !== null) {
  //     handleItemChangeigst(selectedItemIndexigst, "ahead", product.ahead);
  //     setShowModaligst(false);
  //   }
  // };
  const handleProductSelectigst = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModaligst(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...igstcode];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexigst] = {
      ...updatedShipped[selectedItemIndexigst],
      igst_code: product.acode || "",
      igst_ac: product.ahead || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexigst !== null) {
      handleItemChangeigst(selectedItemIndexigst, "name", nameValue);
    }
    setigstcode(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModaligst(false);
  };

  const openModalForItemigst = (index) => {
    setSelectedItemIndexigst(index);
    setShowModaligst(true);
  };

  const allFieldsigst = productigst.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  const handleOpenModal = (event, index, field) => {
    if (/^[a-zA-Z]$/.test(event.key)) {
      if (field === "disPaid_code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemCus(index);
        event.preventDefault();
      }else if (field === "cash_code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemCashAc(index);
        event.preventDefault();
      }else if (field === "disRec_code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemAcc(index);
        event.preventDefault();
      } else if (field === "bankchr_code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItembankchrg(index);
        event.preventDefault();
      } else if (field === "defBank_code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemdefaultname(index);
        event.preventDefault();
      } else if (field === "cgst_code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemcgst(index);
        event.preventDefault();
      } else if (field === "sgst_code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemsgst(index);
        event.preventDefault();
      } else if (field === "igst_code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemigst(index);
        event.preventDefault();
      } else if (field === "Tcs206_code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemtcs206(index);
        event.preventDefault();
      }
    }
  };

  const handleEditClick = () => {
    setTitle("(EDIT)");
    setIsDisabled(false);
    setIsEditMode(true);
    setIsSubmitEnabled(true);
    setIsAbcmode(true);
  };

  const handleSaveClick = async () => {
    let isDataSaved = false;
 
    const prepareData = () => ({
      _id: formData._id,
      formData: {
        ...formData,
        disPaid_code: DiscountPaid.length > 0 ? DiscountPaid[0].disPaid_code : "",
        disPaid_Ac: DiscountPaid.length > 0 ? DiscountPaid[0].disPaid_Ac : "",

        disRec_code: DiscountReceipt.length > 0 ? DiscountReceipt[0].disRec_code : "",
        disRec_Ac: DiscountReceipt.length > 0 ? DiscountReceipt[0].disRec_Ac : "",

        bankchr_code: BankChargesCode.length > 0 ? BankChargesCode[0].bankchr_code : "",
        bankchr_Ac: BankChargesCode.length > 0 ? BankChargesCode[0].bankchr_Ac : "",

        defBank_code: DefBankName.length > 0 ? DefBankName[0].defBank_code : "",
        defBank_Ac: DefBankName.length > 0 ? DefBankName[0].defBank_Ac : "",
        
        Tcs206_code: tcs206code.length > 0 ? tcs206code[0].Tcs206_code : "",
        Tcs206_ac: tcs206code.length > 0 ? tcs206code[0].Tcs206_ac : "",
        cgst_code: cgstcode.length > 0 ? cgstcode[0].cgst_code : "",
        cgst_ac: cgstcode.length > 0 ? cgstcode[0].cgst_ac : "",
        sgst_code: sgstcode.length > 0 ? sgstcode[0].sgst_code : "",
        sgst_ac: sgstcode.length > 0 ? sgstcode[0].sgst_ac : "",
        igst_code: igstcode.length > 0 ? igstcode[0].igst_code : "",
        igst_ac: igstcode.length > 0 ? igstcode[0].igst_ac : "",

        cash_code: cashCode.length > 0 ? cashCode[0].cash_code : "",
        cash_Ac: cashCode.length > 0 ? cashCode[0].cash_Ac : "",
      },
    });

    try {
      const combinedData = prepareData();
      console.log("Combined Data New:", combinedData);
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/cashbanksetup${
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
      setIsDisabled(!isDataSaved);
      setIsEditMode(!isDataSaved);
      const toastMsg = "Data Saved Successfully!";
      toast.success(toastMsg, { position: "top-center" });
    }
  };

  // Header section with logo and title
  const headerSection = (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Typography
        variant="h4"
        sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold", ml: 2 }}
      >
        CASH / BANK SETUP
      </Typography>
    </Box>
  );

  const steps = ["Select Accounts", "Other Options", "Bank Details"];

  // Modern TextField style (smaller height & reduced margin)
  const textFieldStyle = {
    mb: 1,
    "& .MuiOutlinedInput-root": {
      height: 48,
      fontSize: "0.9rem",
      fontWeight: "bold",
      borderRadius: "6px",
      backgroundColor: "#fff",
      boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
      "& fieldset": { borderColor: "#ccc" },
      "&:hover fieldset": { borderColor: "#999" },
      "&.Mui-focused fieldset": { borderColor: "#3f51b5", borderWidth: "2px" },
    },
  };

  // Stepper content for each step
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={1}>
              <Grid item xs={6}>
              {cashCode.map((item, index) => (
                <TextField
                  key={index}
                  label="CASH A/C"
                  id="cash_code"
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  value={item.cash_code || ""}
                  onChange={(e) => {
                    const newTdsname = [...cashCode];
                    newTdsname[index].cash_code = e.target.value;
                    setcashCode(newTdsname);
                  }}
                  onKeyDown={(e) => handleOpenModal(e, index, "cash_code")}
                  InputProps={{ readOnly: !isEditMode || isDisabled }}
                />
              ))}
              {showModalCashAc && (
                <ProductModalAccount
                  allFields={allFieldsCashAc}
                  onSelect={handleProductSelectCashAc}
                  onClose={() => setShowModalCashAc(false)} 
                  initialKey={pressedKey}
                  tenant={tenant}
                  onRefresh={fetchCustomers}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              {DiscountPaid.map((item, index) => (
                <TextField
                  key={index}
                  label="DISCOUNT PAID"
                  id="disPaid_code"
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  value={item.disPaid_code || ""}
                  onChange={(e) => {
                    const newTdsname = [...DiscountPaid];
                    newTdsname[index].disPaid_code = e.target.value;
                    setDiscountPaid(newTdsname);
                  }}
                  onKeyDown={(e) => handleOpenModal(e, index, "disPaid_code")}
                  InputProps={{ readOnly: !isEditMode || isDisabled }}
                />
              ))}
              {showModalCus && (
                <ProductModalAccount
                  allFields={allFieldsCus}
                  onSelect={handleProductSelectCus}
                  onClose={() => setShowModalCus(false)} 
                  initialKey={pressedKey}
                  tenant={tenant}
                  onRefresh={fetchCustomers}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              {DiscountReceipt.map((item, index) => (
                <TextField
                  key={index}
                  label="DISCOUNT RECEIPT"
                  id="disRec_code"
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  value={item.disRec_code || ""}
                  onChange={(e) => {
                    const newReceipt = [...DiscountReceipt];
                    newReceipt[index].disRec_code = e.target.value;
                    setDiscountReceipt(newReceipt);
                  }}
                  onKeyDown={(e) => handleOpenModal(e, index, "disRec_code")}
                  InputProps={{ readOnly: !isEditMode || isDisabled }}
                />
              ))}
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
            </Grid>
            <Grid item xs={6}>
              {BankChargesCode.map((item, index) => (
                <TextField
                  key={index}
                  label="BANK CHARGES CODE"
                  id="bankchr_code"
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  value={item.bankchr_code || ""}
                  onChange={(e) => {
                    const newReceipt = [...BankChargesCode];
                    newReceipt[index].bankchr_code = e.target.value;
                    setBankChargesCode(newReceipt);
                  }}
                  onKeyDown={(e) => handleOpenModal(e, index, "bankchr_code")}
                  InputProps={{ readOnly: !isEditMode || isDisabled }}
                />
              ))}
              {showModalbankchrg && (
                 <ProductModalAccount
                  allFields={allFieldsbankchrg}
                  onSelect={handleProductSelectbankchrg}
                  onClose={() => setShowModalbankchrg(false)} 
                  initialKey={pressedKey}
                  tenant={tenant}
                  onRefresh={fetchCustomers}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              {DefBankName.map((item, index) => (
                <TextField
                  key={index}
                  label="DEFAULT BANK NAME"
                  id="defBank_code"
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  value={item.defBank_code || ""}
                  onChange={(e) => {
                    const newReceipt = [...DefBankName];
                    newReceipt[index].defBank_code = e.target.value;
                    setDefBankName(newReceipt);
                  }}
                  onKeyDown={(e) => handleOpenModal(e, index, "defBank_code")}
                  InputProps={{ readOnly: !isEditMode || isDisabled }}
                />
              ))}
              {showModaldefaultname && (
                <ProductModalAccount
                  allFields={allFieldsdefaultname}
                  onSelect={handleProductSelectdefaultname}
                  onClose={() => setShowModaldefaultname(false)} 
                  initialKey={pressedKey}
                  tenant={tenant}
                  onRefresh={fetchCustomers}
                />
                // <ProductModalAccount
                //   allFieldsAcc={allFieldsdefaultname}  
                //   productsAcc={productdefaultname}
                //   onSelectAcc={handleProductSelectdefaultname}
                //   onCloseAcc={() => setShowModaldefaultname(false)}
                //   onRefreshAcc={fetchCustomers} // ✅ you passed this here
                //   initialKey={pressedKey}
                // />
              )}
            </Grid>
            <Grid item xs={6}>
              {cgstcode.map((item, index) => (
                <TextField
                  key={index}
                  label="C.GST A/C"
                  id="cgst_code"
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  value={item.cgst_code || ""}
                  onChange={(e) => {
                    const newReceipt = [...cgstcode];
                    newReceipt[index].cgst_code = e.target.value;
                    setcgstcode(newReceipt);
                  }}
                  onKeyDown={(e) => handleOpenModal(e, index, "cgst_code")}
                  InputProps={{ readOnly: !isEditMode || isDisabled }}
                />
              ))}
              {showModalcgst && (
                <ProductModalAccount
                  allFields={allFieldscgst}
                  onSelect={handleProductSelectcgst}
                  onClose={() => setShowModalcgst(false)} 
                  initialKey={pressedKey}
                  tenant={tenant}
                  onRefresh={fetchCustomers}
                />
                // <ProductModalAccount
                //   allFieldsAcc={allFieldscgst}
                //   productsAcc={productcgst}
                //   onSelectAcc={handleProductSelectcgst}
                //   onCloseAcc={() => setShowModalcgst(false)}
                //   onRefreshAcc={fetchCustomers} // ✅ you passed this here
                //   initialKey={pressedKey}
                // />
              )}
            </Grid>
            <Grid item xs={6}>
              {sgstcode.map((item, index) => (
                <TextField
                  key={index}
                  label="S.GST A/C"
                  id="sgst_code"
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  value={item.sgst_code || ""}
                  onChange={(e) => {
                    const newReceipt = [...sgstcode];
                    newReceipt[index].sgst_code = e.target.value;
                    setsgstcode(newReceipt);
                  }}
                  onKeyDown={(e) => handleOpenModal(e, index, "sgst_code")}
                  InputProps={{ readOnly: !isEditMode || isDisabled }}
                />
              ))}
              {showModalsgst && (
                <ProductModalAccount
                  allFields={allFieldsgst}
                  onSelect={handleProductSelectsgst}
                  onClose={() => setShowModalsgst(false)} 
                  initialKey={pressedKey}
                  tenant={tenant}
                  onRefresh={fetchCustomers}
                />
                // <ProductModalAccount
                //   allFieldsAcc={allFieldsgst}
                //   productsAcc={productsgst}
                //   onSelectAcc={handleProductSelectsgst}
                //   onCloseAcc={() => setShowModalsgst(false)}
                //   onRefreshAcc={fetchCustomers} // ✅ you passed this here
                //   initialKey={pressedKey}
                // />
              )}
            </Grid>
            <Grid item xs={6}>
              {igstcode.map((item, index) => (
                <TextField
                  key={index}
                  label="I.GST A/C"
                  id="igst_code"
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  value={item.igst_code || ""}
                  onChange={(e) => {
                    const newReceipt = [...igstcode];
                    newReceipt[index].igst_code = e.target.value;
                    setigstcode(newReceipt);
                  }}
                  onKeyDown={(e) => handleOpenModal(e, index, "igst_code")}
                  InputProps={{ readOnly: !isEditMode || isDisabled }}
                />
              ))}
              {showModaligst && (
                <ProductModalAccount
                  allFields={allFieldsigst}
                  onSelect={handleProductSelectigst}
                  onClose={() => setShowModaligst(false)} 
                  initialKey={pressedKey}
                  tenant={tenant}
                  onRefresh={fetchCustomers}
                />
                // <ProductModalAccount
                //   allFieldsAcc={allFieldsigst}
                //   productsAcc={productigst}
                //   onSelectAcc={handleProductSelectigst}
                //   onCloseAcc={() => setShowModaligst(false)}
                //   onRefreshAcc={fetchCustomers} // ✅ you passed this here
                //   initialKey={pressedKey}
                // />
              )}
            </Grid>
            <Grid item xs={6}>
              {tcs206code.map((item, index) => (
                <TextField
                  key={index}
                  label="TCS 206(1H) A/C"
                  id="Tcs206_code"
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  value={item.Tcs206_code || ""}
                  onChange={(e) => {
                    const newReceipt = [...tcs206code];
                    newReceipt[index].Tcs206_code = e.target.value;
                    settcs206code(newReceipt);
                  }}
                  onKeyDown={(e) => handleOpenModal(e, index, "Tcs206_code")}
                  InputProps={{ readOnly: !isEditMode || isDisabled }}
                />
              ))}
              {showModaltcs206 && (
                 <ProductModalAccount
                  allFields={allFieldstcs206}
                  onSelect={handleProductSelecttcs206}
                  onClose={() => setShowModaltcs206(false)} 
                  initialKey={pressedKey}
                  tenant={tenant}
                  onRefresh={fetchCustomers}
                />
                // <ProductModalAccount
                //   allFieldsAcc={allFieldstcs206}
                //   productsAcc={producttcs206}
                //   onSelectAcc={handleProductSelecttcs206}
                //   onCloseAcc={() => setShowModaltcs206(false)}
                //   onRefreshAcc={fetchCustomers} // ✅ you passed this here
                //   initialKey={pressedKey}
                // />
              )}
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="Discount Description"
                id="Bank_text1"
                fullWidth
                size="small"
                value={formData.Bank_text1}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="B.Chg Description"
                id="Bank_text5"
                fullWidth
                size="small"
                value={formData.Bank_text5}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Cash Receipt Description"
                id="narration"
                fullWidth
                size="small"
                value={formData.narration}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Bank Receipt Description"
                id="chg_narr"
                fullWidth
                size="small"
                value={formData.chg_narr}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Bank Issue Description"
                id="Bnk_narr"
                fullWidth
                size="small"
                value={formData.Bnk_narr}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="DECIMALS"
                id="decimals"
                fullWidth
                size="small"
                value={formData.decimals}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                A/C Desc. in Bank A/c
              </FormLabel>
              <Select
                id="AcDiscBank"
                fullWidth
                size="small"
                value={formData.AcDiscBank}
                onChange={handleDesc}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={6}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                Apply Narration Manager
              </FormLabel>
              <Select
                id="ApplyNarration"
                fullWidth
                size="small"
                value={formData.ApplyNarration}
                onChange={handleNarration}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={6}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                Negative Cash Transaction
              </FormLabel>
              <Select
                id="NegativeCashTransac"
                fullWidth
                size="small"
                value={formData.NegativeCashTransac}
                onChange={handleNegCash}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Continue Transaction">
                  Continue Transaction
                </MenuItem>
                <MenuItem value="Stop Transaction">Stop Transaction</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={6}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                Duplicate Alert
              </FormLabel>
              <Select
                id="duplicateAlert"
                fullWidth
                size="small"
                value={formData.duplicateAlert}
                onChange={handleDuplicate}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={6}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                TDS Option
              </FormLabel>
              <Select
                id="TdsOption"
                fullWidth
                size="small"
                value={formData.TdsOption}
                onChange={handleTdsOption}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>

            <Grid item xs={6}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                Cash Validate
              </FormLabel>
              <Select
                id="CashValidate"
                fullWidth
                size="small"
                value={formData.CashValidate}
                onChange={handleCashValidate}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{ disablePortal: true }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                // label="Bank Name"
                id="B1"
                fullWidth
                size="small"
                value={formData.B1}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                // label="A/C No"
                id="B2"
                fullWidth
                size="small"
                value={formData.B2}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                // label="IFSC code"
                id="B3"
                fullWidth
                size="small"
                value={formData.B3}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label=""
                id="B4"
                fullWidth
                size="small"
                value={formData.B4}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label=""
                id="B5"
                fullWidth
                size="small"
                value={formData.B5}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
          </Grid>
        );
      default:
        return "Unknown Step";
    }
  };

  return (
    <div className="newModalcb">
      <div className="modalcontainer">
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
          <Stack direction="row" spacing={2} sx={{ justifyContent: "center" }}>
            <Button
              disabled={activeStep === 0}
              onClick={() => setActiveStep((prev) => prev - 1)}
              variant="contained"
              style={{ backgroundColor: "blue", color: "#fff" }}
              type="button"
            >
              BACK
            </Button>
            <Button
              onClick={() => setActiveStep((prev) => prev + 1)}
              variant="contained"
              style={{ backgroundColor: "blue", color: "#fff" }}
              type="button"
              disabled={activeStep === steps.length - 1}
            >
              {"NEXT"}
            </Button>
            <Button
              disabled={!isSubmitEnabled}
              onClick={handleSaveClick}
              variant="contained"
              style={{ backgroundColor: "#006400", color: "#fff" }}
              type="button"
            >
              {"SAVE"}
            </Button>
            <Button
              // disabled={activeStep === 0}
              onClick={handleEditClick}
              variant="contained"
              style={{ backgroundColor: "gray", color: "#fff" }}
              type="button"
            >
              EDIT
            </Button>

            <Button
              onClick={onClose}
              variant="contained"
              style={{ backgroundColor: "#8B0000", color: "#fff" }}
              type="button"
            >
              {"CLOSE"}
            </Button>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default CashBankSetup;
