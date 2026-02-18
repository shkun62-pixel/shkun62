import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "react-datepicker/dist/react-datepicker.css";
import "./TdsSetup.css";
import ProductModalCustomer from "../Modals/ProductModalCustomer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { CompanyContext } from "../Context/CompanyContext";
import { useContext } from "react";

const TdsSetup = ({ onClose }) => {
  const { company } = useContext(CompanyContext);
  const tenant = "03AAYFG4472A1ZG_01042025_31032026";

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    console.error("No tenant selected!");
  }

  const [title, setTitle] = useState("(View)");
  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
  const [formData, setFormData] = useState({
    color1: "",
    Crcode: "",
    Tds_srate: 0,
    Tds_crate: 0,
    Tds_hrate: 0,
    Tds_rate: 0,
    Gr: "",
    St_crate: 0,
    St_hrate: 0,
    St_rate: 0,
    Series: "",
    Tdson: "",
    Roundoff: "",
    Vehicle: "",
    Vtype: "",
  });
  const [debitAcc, setdebitAcc] = useState([{ Drcode: "" }]);
  const [TdsAcc, setTdsAcc] = useState([{ Tdscode: "" }]);
  const [SrvTaxAcc, setSrvTaxAcc] = useState([{ STax: "" }]);
  const [SrvTaxPay, setSrvTaxPay] = useState([{ STaxP: "" }]);
  const [Othercharges, setOtherCharges] = useState([{ Vbillno: "" }]);
  const [SBcessAcc, setSBcessAcc] = useState([{ STax1: "" }]);
  const [SBcessPay, setSBcessPay] = useState([{ STaxP1: "" }]);
  const [KKcessAcc, setKKcessAcc] = useState([{ STax2: "" }]);
  const [KKcessPay, setKKcessPay] = useState([{ STaxP2: "" }]);
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
      console.log(data);
      // Ensure to extract the formData for easier access in the rest of your app
      const formattedData = data.map((item) => ({
        ...item.formData,
        _id: item._id,
      }));
      setProductsDebit(formattedData);
      setLoadingDebit(false);
      setProductsTDS(formattedData);
      setLoadingTDS(false);
      setProductsSrvTaxAc(formattedData);
      setLoadingSrvTaxAc(false);
      setProductsSrvPay(formattedData);
      setLoadingSrvPay(false);
      setProductsOtherCharges(formattedData);
      setLoadingOtherCharges(false);
      setProductsSbCessAcc(formattedData);
      setLoadingSbCessAcc(false);
      setProductsSBCessPay(formattedData);
      setLoadingSBCessPay(false);
      setProductsKKCessAc(formattedData);
      setLoadingKKCessAc(false);
      setProductsKKCessPay(formattedData);
      setLoadingKKCessPay(false);
    } catch (error) {
      setErrorDebit(error.message);
      setLoadingDebit(false);
      setErrorTDS(error.message);
      setLoadingTDS(false);
      setErrorSrvTaxAc(error.message);
      setLoadingSrvTaxAc(false);
      setErrorSrvPay(error.message);
      setLoadingSrvPay(false);
      setErrorOtherCharges(error.message);
      setLoadingOtherCharges(false);
      setErrorSbCessAcc(error.message);
      setLoadingSbCessAcc(false);
      setErrorSBCessPay(error.message);
      setLoadingSBCessPay(false);
      setErrorKKCessAc(error.message);
      setLoadingKKCessAc(false);
      setErrorKKCessPay(error.message);
      setLoadingKKCessPay(false);
    }
  };
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
      const selectedProduct = productsDebit.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Drcode"] = selectedProduct.acode;
      }
    }
    setdebitAcc(updatedItems);
  };
  const handleProductSelectDebit = (product) => {
    setIsEditMode(true);
    if (selectedItemIndexDebit !== null) {
      handleItemChangeDebit(selectedItemIndexDebit, "ahead", product.ahead);
      setShowModalDebit(false);
    }
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
  // Modal For TDS
  const [productsTDS, setProductsTDS] = useState([]);
  const [showModalTDS, setShowModalTDS] = useState(false);
  const [selectedItemIndexTDS, setSelectedItemIndexTDS] = useState(null);
  const [loadingTDS, setLoadingTDS] = useState(true);
  const [errorTDS, setErrorTDS] = useState(null);

  const handleItemChangeTDS = (index, key, value) => {
    const updatedItems = [...TdsAcc];
    updatedItems[index][key] = value;
    // If the key is 'ahead', find the corresponding product and set the code
    if (key === "ahead") {
      const selectedProduct = productsTDS.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Tdscode"] = selectedProduct.acode;
      }
    }
    setTdsAcc(updatedItems);
  };

  const handleProductSelectTDS = (product) => {
    setIsEditMode(true);
    if (selectedItemIndexTDS !== null) {
      handleItemChangeTDS(selectedItemIndexTDS, "ahead", product.ahead);
      setShowModalTDS(false);
    }
  };

  const openModalForItemTDS = (index) => {
    if (isEditMode) {
      setSelectedItemIndexTDS(index);
      setShowModalTDS(true);
    }
  };

  const allFieldsTDS = productsTDS.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);
  // Modal For srvTaxAc
  const [productsSrvTaxAc, setProductsSrvTaxAc] = useState([]);
  const [showModalSrvTaxAc, setShowModalSrvTaxAc] = useState(false);
  const [selectedItemIndexSrvTaxAc, setSelectedItemIndexSrvTaxAc] =
    useState(null);
  const [loadingSrvTaxAc, setLoadingSrvTaxAc] = useState(true);
  const [errorSrvTaxAc, setErrorSrvTaxAc] = useState(null);

  const handleItemChangeSrvTaxAc = (index, key, value) => {
    const updatedItems = [...SrvTaxAcc];
    updatedItems[index][key] = value;
    // If the key is 'ahead', find the corresponding product and set the code
    if (key === "ahead") {
      const selectedProduct = productsSrvTaxAc.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["STax"] = selectedProduct.acode;
      }
    }
    setSrvTaxAcc(updatedItems);
  };

  const handleProductSelectSrvTaxAc = (product) => {
    setIsEditMode(true);
    if (selectedItemIndexSrvTaxAc !== null) {
      handleItemChangeSrvTaxAc(
        selectedItemIndexSrvTaxAc,
        "ahead",
        product.ahead
      );
      setShowModalSrvTaxAc(false);
    }
  };

  const openModalForItemSrvTaxAc = (index) => {
    if (isEditMode) {
      setSelectedItemIndexSrvTaxAc(index);
      setShowModalSrvTaxAc(true);
    }
  };

  const allFieldsSrvTaxAc = productsSrvTaxAc.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);
  // Modal For SrvPay
  const [productsSrvPay, setProductsSrvPay] = useState([]);
  const [showModalSrvPay, setShowModalSrvPay] = useState(false);
  const [selectedItemIndexSrvPay, setSelectedItemIndexSrvPay] = useState(null);
  const [loadingSrvPay, setLoadingSrvPay] = useState(true);
  const [errorSrvPay, setErrorSrvPay] = useState(null);

  const handleItemChangeSrvPay = (index, key, value) => {
    const updatedItems = [...SrvTaxPay];
    updatedItems[index][key] = value;
    // If the key is 'ahead', find the corresponding product and set the code
    if (key === "ahead") {
      const selectedProduct = productsSrvPay.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["STaxP"] = selectedProduct.acode;
      }
    }
    setSrvTaxPay(updatedItems);
  };

  const handleProductSelectSrvPay = (product) => {
    setIsEditMode(true);
    if (selectedItemIndexSrvPay !== null) {
      handleItemChangeSrvPay(selectedItemIndexSrvPay, "ahead", product.ahead);
      setShowModalSrvPay(false);
    }
  };

  const openModalForItemSrvPay = (index) => {
    if (isEditMode) {
      setSelectedItemIndexSrvPay(index);
      setShowModalSrvPay(true);
    }
  };

  const allFieldsSrvPay = productsSrvPay.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);
  // Modal For otherCharges
  const [productsOtherCharges, setProductsOtherCharges] = useState([]);
  const [showModalOtherCharges, setShowModalOtherCharges] = useState(false);
  const [selectedItemIndexOtherCharges, setSelectedItemIndexOtherCharges] =
    useState(null);
  const [loadingOtherCharges, setLoadingOtherCharges] = useState(true);
  const [errorOtherCharges, setErrorOtherCharges] = useState(null);

  const handleItemChangeOtherCharges = (index, key, value) => {
    const updatedItems = [...Othercharges];
    updatedItems[index][key] = value;
    // If the key is 'ahead', find the corresponding product and set the code
    if (key === "ahead") {
      const selectedProduct = productsOtherCharges.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Vbillno"] = selectedProduct.acode;
      }
    }
    setOtherCharges(updatedItems);
  };

  const handleProductSelectOtherCharges = (product) => {
    setIsEditMode(true);
    if (selectedItemIndexOtherCharges !== null) {
      handleItemChangeOtherCharges(
        selectedItemIndexOtherCharges,
        "ahead",
        product.ahead
      );
      setShowModalOtherCharges(false);
    }
  };

  const openModalForItemOtherCharges = (index) => {
    if (isEditMode) {
      setSelectedItemIndexOtherCharges(index);
      setShowModalOtherCharges(true);
    }
  };

  const allFieldsOtherCharges = productsOtherCharges.reduce(
    (fields, product) => {
      Object.keys(product).forEach((key) => {
        if (!fields.includes(key)) {
          fields.push(key);
        }
      });
      return fields;
    },
    []
  );
  // Modal For SbCessAcc
  const [productsSbCessAcc, setProductsSbCessAcc] = useState([]);
  const [showModalSbCessAcc, setShowModalSbCessAcc] = useState(false);
  const [selectedItemIndexSbCessAcc, setSelectedItemIndexSbCessAcc] =
    useState(null);
  const [loadingSbCessAcc, setLoadingSbCessAcc] = useState(true);
  const [errorSbCessAcc, setErrorSbCessAcc] = useState(null);

  const handleItemChangeSbCessAcc = (index, key, value) => {
    const updatedItems = [...SBcessAcc];
    updatedItems[index][key] = value;
    // If the key is 'ahead', find the corresponding product and set the code
    if (key === "ahead") {
      const selectedProduct = productsSbCessAcc.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["STax1"] = selectedProduct.acode;
      }
    }
    setSBcessAcc(updatedItems);
  };

  const handleProductSelectSbCessAcc = (product) => {
    setIsEditMode(true);
    if (selectedItemIndexSbCessAcc !== null) {
      handleItemChangeSbCessAcc(
        selectedItemIndexSbCessAcc,
        "ahead",
        product.ahead
      );
      setShowModalSbCessAcc(false);
    }
  };

  const openModalForItemSbCessAcc = (index) => {
    if (isEditMode) {
      setSelectedItemIndexSbCessAcc(index);
      setShowModalSbCessAcc(true);
    }
  };

  const allFieldsSbCessAcc = productsSbCessAcc.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  // Modal For SBCessPay
  const [productsSBCessPay, setProductsSBCessPay] = useState([]);
  const [showModalSBCessPay, setShowModalSBCessPay] = useState(false);
  const [selectedItemIndexSBCessPay, setSelectedItemIndexSBCessPay] =
    useState(null);
  const [loadingSBCessPay, setLoadingSBCessPay] = useState(true);
  const [errorSBCessPay, setErrorSBCessPay] = useState(null);

  const handleItemChangeSBCessPay = (index, key, value) => {
    const updatedItems = [...SBcessPay];
    updatedItems[index][key] = value;
    // If the key is 'ahead', find the corresponding product and set the code
    if (key === "ahead") {
      const selectedProduct = productsSBCessPay.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["STaxP1"] = selectedProduct.acode;
      }
    }
    setSBcessPay(updatedItems);
  };

  const handleProductSelectSBCessPay = (product) => {
    setIsEditMode(true);
    if (selectedItemIndexSBCessPay !== null) {
      handleItemChangeSBCessPay(
        selectedItemIndexSBCessPay,
        "ahead",
        product.ahead
      );
      setShowModalSBCessPay(false);
    }
  };

  const openModalForItemSBCessPay = (index) => {
    if (isEditMode) {
      setSelectedItemIndexSBCessPay(index);
      setShowModalSBCessPay(true);
    }
  };

  const allFieldsSBCessPay = productsSBCessPay.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  // Modal For KKCessAc
  const [productsKKCessAc, setProductsKKCessAc] = useState([]);
  const [showModalKKCessAc, setShowModalKKCessAc] = useState(false);
  const [selectedItemIndexKKCessAc, setSelectedItemIndexKKCessAc] =
    useState(null);
  const [loadingKKCessAc, setLoadingKKCessAc] = useState(true);
  const [errorKKCessAc, setErrorKKCessAc] = useState(null);

  const handleItemChangeKKCessAc = (index, key, value) => {
    const updatedItems = [...KKcessAcc];
    updatedItems[index][key] = value;
    // If the key is 'ahead', find the corresponding product and set the code
    if (key === "ahead") {
      const selectedProduct = productsKKCessAc.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["STax2"] = selectedProduct.acode;
      }
    }
    setKKcessAcc(updatedItems);
  };

  const handleProductSelectKKCessAc = (product) => {
    setIsEditMode(true);
    if (selectedItemIndexKKCessAc !== null) {
      handleItemChangeKKCessAc(
        selectedItemIndexKKCessAc,
        "ahead",
        product.ahead
      );
      setShowModalKKCessAc(false);
    }
  };

  const openModalForItemKKCessAc = (index) => {
    if (isEditMode) {
      setSelectedItemIndexKKCessAc(index);
      setShowModalKKCessAc(true);
    }
  };

  const allFieldsKKCessAc = productsKKCessAc.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);
  // Modal For KKCessPay
  const [productsKKCessPay, setProductsKKCessPay] = useState([]);
  const [showModalKKCessPay, setShowModalKKCessPay] = useState(false);
  const [selectedItemIndexKKCessPay, setSelectedItemIndexKKCessPay] =
    useState(null);
  const [loadingKKCessPay, setLoadingKKCessPay] = useState(true);
  const [errorKKCessPay, setErrorKKCessPay] = useState(null);

  const handleItemChangeKKCessPay = (index, key, value) => {
    const updatedItems = [...KKcessPay];
    updatedItems[index][key] = value;
    // If the key is 'ahead', find the corresponding product and set the code
    if (key === "ahead") {
      const selectedProduct = productsKKCessPay.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["STaxP2"] = selectedProduct.acode;
      }
    }
    setKKcessPay(updatedItems);
  };

  const handleProductSelectKKCessPay = (product) => {
    setIsEditMode(true);
    if (selectedItemIndexKKCessPay !== null) {
      handleItemChangeKKCessPay(
        selectedItemIndexKKCessPay,
        "ahead",
        product.ahead
      );
      setShowModalKKCessPay(false);
    }
  };

  const openModalForItemKKCessPay = (index) => {
    if (isEditMode) {
      setSelectedItemIndexKKCessPay(index);
      setShowModalKKCessPay(true);
    }
  };

  const allFieldsKKCessPay = productsKKCessPay.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  const handleOpenModal = (event, index, field) => {
    if (/^[a-zA-Z]$/.test(event.key) && field === "Drcode") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItemDebit(index);
      event.preventDefault(); // Prevent any default action
    }
    if (/^[a-zA-Z]$/.test(event.key) && field === "Tdscode") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItemTDS(index);
      event.preventDefault(); // Prevent any default action
    }
  };
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const handleNumberChange = (event) => {
    const { id, value } = event.target;
    // Only allow numeric values
    if (/^\d*$/.test(value)) {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }
  };
  // FETCH DATA
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [index, setIndex] = useState(0);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // State to track edit mode
  const [isAbcmode, setIsAbcmode] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
  const [firstTimeCheckData, setFirstTimeCheckData] = useState("");
  const [setupFormData, setsetupFormData] = useState(null);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://103.154.233.29:3007/auth/api/tdssetup`
      );
      if (response.status === 200 && response.data.length > 0) {
        const lastEntry = response.data[response.data.length - 1]; // Assuming you want the last one
        setFormData(lastEntry.formData);
        setData1(lastEntry);
        setIndex(lastEntry._id);
        // Convert cesscode into an array containing one object
        setdebitAcc([{ Drcode: lastEntry.formData.Drcode }]);
        setTdsAcc([{ Tdscode: lastEntry.formData.Tdscode }]);
        setSrvTaxAcc([{ STax: lastEntry.formData.STax }]);
        setSrvTaxPay([{ STaxP: lastEntry.formData.STaxP }]);
        setOtherCharges([{ Vbillno: lastEntry.formData.Vbillno }]);
        setSBcessAcc([{ STax1: lastEntry.formData.STax1 }]);
        setSBcessPay([{ STaxP1: lastEntry.formData.STaxP1 }]);
        setKKcessAcc([{ STax2: lastEntry.formData.STax2 }]);
        setKKcessPay([{ STaxP2: lastEntry.formData.STaxP2 }]);
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
      color1: "",
      Crcode: "",
      Tds_srate: 0,
      Tds_crate: 0,
      Tds_hrate: 0,
      Tds_rate: 0,
      Gr: "",
      St_crate: 0,
      St_hrate: 0,
      St_rate: 0,
      Series: "",
      Tdson: "",
      Roundoff: "",
      Vehicle: "",
      Vtype: "",
    };
    const emptyDebitAc = [{ Drcode: "" }];
    const emptyTdsAc = [{ Tdscode: "" }];
    const emptySrvTaxAc = [{ STax: "" }];
    const emptySrvTAxPay = [{ STaxP: "" }];
    const emptyOthers = [{ Vbillno: "" }];
    const emptySbAc = [{ STax1: "" }];
    const emptySbPay = [{ STaxP1: "" }];
    const emptyKKAc = [{ STax2: "" }];
    const emptyKKPay = [{ STaxP2: "" }];
    setFormData(emptyData);
    setData1({
      formData: emptyData,
      debitAcc: emptyDebitAc,
      TdsAcc: emptyTdsAc,
      SrvTaxAcc: emptySrvTaxAc,
      SrvTaxPay: emptySrvTAxPay,
      Othercharges: emptyOthers,
      SBcessAcc: emptySbAc,
      SBcessPay: emptySbPay,
      KKcessAcc: emptyKKAc,
      KKcessPay: emptyKKPay,
    });
    setIndex(0);
  };
  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []);
  
  const handleSaveClick = async () => {
    let isDataSaved = false;

    const prepareData = () => ({
      _id: formData._id,
      formData: {
        ...formData,
        Drcode: debitAcc.length > 0 ? debitAcc[0].Drcode : "",
        Tdscode: TdsAcc.length > 0 ? TdsAcc[0].Tdscode : "",
        STax: SrvTaxAcc.length > 0 ? SrvTaxAcc[0].STax : "",
        STaxP: SrvTaxPay.length > 0 ? SrvTaxPay[0].STaxP : "",
        Vbillno: Othercharges.length > 0 ? Othercharges[0].Vbillno : "",
        STax1: SBcessAcc.length > 0 ? SBcessAcc[0].STax1 : "",
        STaxP1: SBcessPay.length > 0 ? SBcessPay[0].STaxP1 : "",
        STax2: KKcessAcc.length > 0 ? KKcessAcc[0].STax2 : "",
        STaxP2: KKcessPay.length > 0 ? KKcessPay[0].STaxP2 : "",
      },
    });
    try {
      const combinedData = prepareData();
      console.log("Combined Data New:", combinedData);
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/tdssetup${
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
      setTitle("(View)");
      setIsSubmitEnabled(false);
      setIsDisabled(!isDataSaved);
      setIsEditMode(!isDataSaved);
      const toastMsg = "Data Saved Successfully!";
      toast.success(toastMsg, { position: "top-center" });
    }
  };
  const handleEditClick = () => {
    // fetchData();
    setTitle("(Edit)");
    setIsDisabled(false);
    setIsEditMode(true);
    setIsSubmitEnabled(true);
    setIsAbcmode(true);
  };

  return (
    <div className="NewModalTDS">
      <ToastContainer style={{ width: "30%" }} />
      <div className="ModalcontainerTDS">
        <h1 className="headingTDS">TDS FORM SETUP</h1>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div className="leftcontainer">
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>COLOR:</text>
              <select
                disabled={!isEditMode || isDisabled}
                className="Color1Select"
                id="color1"
                value={formData.color1}
                onChange={handleInputChange}
              >
                <option value=""></option>
                <option value="Default Scheme">0.Default Scheme</option>
                <option value="Scheme No.1">1.Scheme No.1</option>
                <option value="Scheme No.2">2.Scheme No.2</option>
                <option value="Scheme No.3">3.Scheme No.3</option>
                <option value="Scheme No.4">4.Scheme No.4</option>
                <option value="Scheme No.5">5.Scheme No.5</option>
                <option value="Scheme No.6">6.Scheme No.6</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>CREDIT ACCOUNT:</text>
              <input
                readOnly={!isEditMode || isDisabled}
                id="Crcode"
                className="creditAc"
                value={formData.Crcode}
                onChange={handleInputChange}
              />
            </div>
            <div>
              {debitAcc.map((item, index) => (
                <div key={item.Drcode}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <text>DEBIT A/C:</text>
                    <input
                      type="text"
                      className="debitAc"
                      value={item.Drcode}
                      onKeyDown={(e) => {
                        handleOpenModal(e, index, "Drcode");
                      }}
                      // onClick={() => openModalForItemDebit(index)}
                    />
                  </div>
                </div>
              ))}
              {showModalDebit && (
                <ProductModalCustomer
                  allFields={allFieldsDebit}
                  products={productsDebit}
                  onSelect={handleProductSelectDebit}
                  onClose={() => setShowModalDebit(false)}
                  onRefresh={fetchCustomers} // ✅ you passed this here
                  initialKey={pressedKey} // Pass the pressed key to the modal
                />
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>SB CESS:</text>
              <input
                readOnly={!isEditMode || isDisabled}
                className="sbCess"
                id="Tds_srate"
                value={formData.Tds_srate}
                onChange={handleNumberChange}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>CESS RATE:</text>
              <input
                className="cessRate"
                readOnly={!isEditMode || isDisabled}
                id="Tds_crate"
                value={formData.Tds_crate}
                onChange={handleNumberChange}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>HCESS RATE:</text>
              <input
                className="hcessRate"
                readOnly={!isEditMode || isDisabled}
                id="Tds_hrate"
                value={formData.Tds_hrate}
                onChange={handleNumberChange}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>TDS RATE:</text>
              <input
                className="TdsRate"
                readOnly={!isEditMode || isDisabled}
                id="Tds_rate"
                value={formData.Tds_rate}
                onChange={handleNumberChange}
              />
            </div>
            <div>
              {TdsAcc.map((item, index) => (
                <div key={item.Drcode}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <text>TDS A/C:</text>
                    <input
                      type="text"
                      className="TdsAcc"
                      value={item.Tdscode}
                      onKeyDown={(e) => {
                        handleOpenModal(e, index, "Tdscode");
                      }}
                      // onClick={() => openModalForItemDebit(index)}
                    />
                  </div>
                </div>
              ))}
              {showModalTDS && (
                <ProductModalCustomer
                  allFields={allFieldsTDS}
                  products={productsTDS}
                  onSelect={handleProductSelectTDS}
                  onClose={() => setShowModalTDS(false)}
                  onRefresh={fetchCustomers} // ✅ you passed this here
                  initialKey={pressedKey} // Pass the pressed key to the modal
                />
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>GR NUMBER:</text>
              <input
                className="GRnumber"
                readOnly={!isEditMode || isDisabled}
                id="Gr"
                value={formData.Gr}
                onChange={handleInputChange}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>KK CESS@:</text>
              <input
                className="KKCess"
                readOnly={!isEditMode || isDisabled}
                id="St_crate"
                value={formData.St_crate}
                onChange={handleNumberChange}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>S.Tx HCESS@:</text>
              <input
                className="StaxHcess"
                readOnly={!isEditMode || isDisabled}
                id="St_hrate"
                value={formData.St_hrate}
                onChange={handleNumberChange}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>Srv.TAX RATE:</text>
              <input
                className="srvTaxRate"
                readOnly={!isEditMode || isDisabled}
                id="St_rate"
                value={formData.St_rate}
                onChange={handleNumberChange}
              />
            </div>
            <div>
              {SrvTaxAcc.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <text>Srv.TAX A/C:</text>
                  <input
                    className="srvTaxAcc"
                    readOnly
                    value={item.STax || ""}
                    onChange={(e) => {
                      const newsrvTax = [...SrvTaxAcc];
                      newsrvTax[index].STax = e.target.value;
                      setSrvTaxAcc(newsrvTax);
                    }}
                  />
                  <input
                    className="check"
                    readOnly
                    style={{
                      width: 30,
                      fontWeight: "bold",
                      marginLeft: 1,
                      borderRadius: 5,
                      border: "1px solid black",
                    }}
                    onClick={() => openModalForItemSrvTaxAc(index)}
                    value={" ... "}
                  />
                </div>
              ))}
              {showModalSrvTaxAc && (
                <ProductModalCustomer
                  allFields={allFieldsSrvTaxAc}
                  products={productsSrvTaxAc}
                  onSelect={handleProductSelectSrvTaxAc}
                  onClose={() => setShowModalSrvTaxAc(false)}
                  onRefresh={fetchCustomers} // ✅ you passed this here
                  initialKey={pressedKey} // Pass the pressed key to the modal
                />
              )}
            </div>
            <div>
              {SrvTaxPay.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <text>Srv.TAX PAYBLE:</text>
                  <input
                    className="srvTaxPay"
                    readOnly
                    value={item.STaxP || ""}
                    onChange={(e) => {
                      const newsrvTaxPay = [...SrvTaxPay];
                      newsrvTaxPay[index].STaxP = e.target.value;
                      setSrvTaxPay(newsrvTaxPay);
                    }}
                  />
                  <input
                    className="check"
                    readOnly
                    style={{
                      width: 30,
                      fontWeight: "bold",
                      marginLeft: 1,
                      borderRadius: 5,
                      border: "1px solid black",
                    }}
                    onClick={() => openModalForItemSrvPay(index)}
                    value={" ... "}
                  />
                </div>
              ))}
              {showModalSrvPay && (
                <ProductModalCustomer
                  allFields={allFieldsSrvPay}
                  products={productsSrvPay}
                  onSelect={handleProductSelectSrvPay}
                  onClose={() => setShowModalSrvPay(false)}
                  onRefresh={fetchCustomers} // ✅ you passed this here
                  initialKey={pressedKey} // Pass the pressed key to the modal
                />
              )}
            </div>
            <div>
              {Othercharges.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <text>OTHER CHARGES:</text>
                  <input
                    className="Othercharges"
                    readOnly
                    value={item.Vbillno || ""}
                    onChange={(e) => {
                      const newCharges = [...Othercharges];
                      newCharges[index].Vbillno = e.target.value;
                      setOtherCharges(newCharges);
                    }}
                  />
                  <input
                    className="check"
                    readOnly
                    style={{
                      width: 30,
                      fontWeight: "bold",
                      marginLeft: 1,
                      borderRadius: 5,
                      border: "1px solid black",
                    }}
                    onClick={() => openModalForItemOtherCharges(index)}
                    value={" ... "}
                  />
                </div>
              ))}
              {showModalOtherCharges && (
                <ProductModalCustomer
                  allFields={allFieldsOtherCharges}
                  products={productsOtherCharges}
                  onSelect={handleProductSelectOtherCharges}
                  onClose={() => setShowModalOtherCharges(false)}
                  onRefresh={fetchCustomers} // ✅ you passed this here
                  initialKey={pressedKey} // Pass the pressed key to the modal
                />
              )}
            </div>
            <div>
              {SBcessAcc.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <text>SB CESS A/C:</text>
                  <input
                    className="sbCessACC"
                    readOnly
                    value={item.STax1 || ""}
                    onChange={(e) => {
                      const newSBCessAcc = [...SBcessAcc];
                      newSBCessAcc[index].STax1 = e.target.value;
                      setSBcessAcc(newSBCessAcc);
                    }}
                  />
                  <input
                    className="check"
                    readOnly
                    style={{
                      width: 30,
                      fontWeight: "bold",
                      marginLeft: 1,
                      borderRadius: 5,
                      border: "1px solid black",
                    }}
                    onClick={() => openModalForItemSbCessAcc(index)}
                    value={" ... "}
                  />
                </div>
              ))}
              {showModalSbCessAcc && (
                <ProductModalCustomer
                  allFields={allFieldsSbCessAcc}
                  products={productsSbCessAcc}
                  onSelect={handleProductSelectSbCessAcc}
                  onClose={() => setShowModalSbCessAcc(false)}
                  onRefresh={fetchCustomers} // ✅ you passed this here
                  initialKey={pressedKey} // Pass the pressed key to the modal
                />
              )}
            </div>
            <div>
              {SBcessPay.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <text>SB CESS PAYBLE:</text>
                  <input
                    className="sbCessPay"
                    readOnly
                    value={item.STaxP1 || ""}
                    onChange={(e) => {
                      const newSBCessPay = [...SBcessPay];
                      newSBCessPay[index].STaxP1 = e.target.value;
                      setSBcessPay(newSBCessPay);
                    }}
                  />
                  <input
                    className="check"
                    readOnly
                    style={{
                      width: 30,
                      fontWeight: "bold",
                      marginLeft: 1,
                      borderRadius: 5,
                      border: "1px solid black",
                    }}
                    onClick={() => openModalForItemSBCessPay(index)}
                    value={" ... "}
                  />
                </div>
              ))}
              {showModalSBCessPay && (
                <ProductModalCustomer
                  allFields={allFieldsSBCessPay}
                  products={productsSBCessPay}
                  onSelect={handleProductSelectSBCessPay}
                  onClose={() => setShowModalSBCessPay(false)}
                  onRefresh={fetchCustomers} // ✅ you passed this here
                  initialKey={pressedKey} // Pass the pressed key to the modal
                />
              )}
            </div>
            <div>
              {KKcessAcc.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <text>KK CESS A/C:</text>
                  <input
                    className="KKcessAcc"
                    readOnly
                    value={item.STax2 || ""}
                    onChange={(e) => {
                      const newKKcessAC = [...KKcessAcc];
                      newKKcessAC[index].STax2 = e.target.value;
                      setKKcessAcc(newKKcessAC);
                    }}
                  />
                  <input
                    className="check"
                    readOnly
                    style={{
                      width: 30,
                      fontWeight: "bold",
                      marginLeft: 1,
                      borderRadius: 5,
                      border: "1px solid black",
                    }}
                    onClick={() => openModalForItemKKCessAc(index)}
                    value={" ... "}
                  />
                </div>
              ))}
              {showModalKKCessAc && (
                <ProductModalCustomer
                  allFields={allFieldsKKCessAc}
                  products={productsKKCessAc}
                  onSelect={handleProductSelectKKCessAc}
                  onClose={() => setShowModalKKCessAc(false)}
                  onRefresh={fetchCustomers} // ✅ you passed this here
                  initialKey={pressedKey} // Pass the pressed key to the modal
                />
              )}
            </div>
            <div>
              {KKcessPay.map((item, index) => (
                <div
                  key={index}
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <text>KK CESS PAYBLE:</text>
                  <input
                    className="KKcessPay"
                    readOnly
                    value={item.STaxP2 || ""}
                    onChange={(e) => {
                      const newKKcessPay = [...KKcessPay];
                      newKKcessPay[index].STaxP2 = e.target.value;
                      setKKcessPay(newKKcessPay);
                    }}
                  />
                  <input
                    className="check"
                    readOnly
                    style={{
                      width: 30,
                      fontWeight: "bold",
                      marginLeft: 1,
                      borderRadius: 5,
                      border: "1px solid black",
                    }}
                    onClick={() => openModalForItemKKCessPay(index)}
                    value={" ... "}
                  />
                </div>
              ))}
              {showModalKKCessPay && (
                <ProductModalCustomer
                  allFields={allFieldsKKCessPay}
                  products={productsKKCessPay}
                  onSelect={handleProductSelectKKCessPay}
                  onClose={() => setShowModalKKCessPay(false)}
                  onRefresh={fetchCustomers} // ✅ you passed this here
                  initialKey={pressedKey} // Pass the pressed key to the modal
                />
              )}
            </div>
          </div>
          <div className="rightcontainer">
            <text style={{ marginLeft: "50%" }} className="tittles">
              {title}
            </text>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>SERIES:</text>
              <select
                className="Series"
                disabled={!isEditMode || isDisabled}
                id="Series"
                value={formData.Series}
                onChange={handleInputChange}
              >
                <option value=""></option>
                <option value="Voucher.1">Voucher.1</option>
                <option value="Voucher.2">Voucher.2</option>
                <option value="Voucher.3">Voucher.3</option>
                <option value="Voucher.4">Voucher.4</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>TDS ON:</text>
              <select
                className="TDSON"
                disabled={!isEditMode || isDisabled}
                id="Tdson"
                value={formData.Tdson}
                onChange={handleInputChange}
              >
                <option value=""></option>
                <option value="Interest">Interest</option>
                <option value="Freight">Freight</option>
                <option value="Brokerage">Brokerage</option>
                <option value="Commission">Commission</option>
                <option value="Advertisement">Advertisement</option>
                <option value="Labour">Labour</option>
                <option value="Contract">Contract</option>
                <option value="Job Work">Job Work</option>
                <option value="Salary">Salary</option>
                <option value="Rent">Rent</option>
                <option value="Professional">Professional</option>
                <option value="Purchase">Purchase</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>ROUND OFF:</text>
              <select
                className="Roundoff"
                disabled={!isEditMode || isDisabled}
                id="Roundoff"
                value={formData.Roundoff}
                onChange={handleInputChange}
              >
                <option value=""></option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>VEHICLE NO:</text>
              <input
                className="Vehicle"
                readOnly={!isEditMode || isDisabled}
                id="Vehicle"
                value={formData.Vehicle}
                onChange={handleInputChange}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "row", marginTop: 40 }}
            >
              <text>SHOW Wt.In LEDGER:</text>
              <select
                className="Ledgershow"
                disabled={!isEditMode || isDisabled}
                id="Vtype"
                value={formData.Vtype}
                onChange={handleInputChange}
              >
                <option value=""></option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </div>
            <Button
              style={{
                borderColor: "transparent",
                backgroundColor: "darkviolet",
                marginTop: 10,
              }}
              onClick={handleEditClick}
            >
              EDIT
            </Button>
            <Button
              style={{
                borderColor: "transparent",
                backgroundColor: "green",
                marginTop: 10,
              }}
              disabled={!isSubmitEnabled}
              onClick={handleSaveClick}
            >
              SAVE
            </Button>
            <Button
              onClick={onClose}
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
      </div>
    </div>
  );
};

export default TdsSetup;
