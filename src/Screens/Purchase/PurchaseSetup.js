import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "../Sale/SaleSetup.css";
import ProductModalAccount from "../Modals/ProductModalAccount";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import InvoicePDFPur from "../InvoicePdfPur";
import InvoicePur2 from "../InvoicePDF/InvoicePur2";
import InvoicePur3 from "../InvoicePDF/InvoicePur3";
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

const PurchaseSetup = ({ onClose }) => {
  const { company } = useContext(CompanyContext);
  // const tenant = company?.databaseName;
    const tenant = "shkun_05062025_05062026"

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    console.error("No tenant selected!");
  }
  const [isHighlighted, setIsHighlighted] = useState(false); // For changing color
  const [formData, setFormData] = useState({
    color1: "",
    reportformat: "",
    vacode: "",
    others: "",
    btype: "",
    stype: "",
    weight: 0,
    pkgs: 0,
    tax: "",
    exfor: "",
    rate: 0,
    stkcode: "",
    balance: "",
    conv: "",
    sale_code: "",
    trpt: "",
    rem1: "",
    rem2: "",
    rem3: "",
    rem4: "",
    transport: "",
    agent: "",
    broker: "",
    gr: "",
    sale_ac: "",
    alertbackdate: "",
    invtime: "",
    revtime: "",
    acNameLed: "",
    cursorFocus: "",
    expbefore: "",
    Tcsontax: "",
    TcsRate: "",
    Tround: "",
    Sale_code: "",
    Roundoff: "",
    Salef3: "",
    Exp1: "",
    Exp2: "",
    Exp3: "",
    Exp4: "",
    Exp5: "",
    Exp6: "",
    Exp7: "",
    Exp8: "",
    Exp9: "",
    Exp10: "",
    E1: "",
    E2: "",
    E3: "",
    E4: "",
    E5: "",
    E6: "",
    E7: "",
    E8: "",
    E9: "",
    E10: "",
    T1: "",
    T2: "",
    T3: "",
    T4: "",
    T5: "",
    T6: "",
    T7: "",
    T8: "",
    T9: "",
    T10: "",
    T11: "",
    T12: "",
    T13: "",
    T14: "",
    T15: "",
    T16: "",
    T17: "",
    T18: "",
    T19: "",
    T20: "",
    E1add: "",
    E2add: "",
    E3add: "",
    E4add: "",
    E5add: "",
    E6add: "",
    E7add: "",
    E8add: "",
    E9add: "",
    E10add: "",
    E1rate: 0,
    E2rate: 0,
    E3rate: 0,
    E4rate: 0,
    E5rate: 0,
    E6rate: 0,
    E7rate: 0,
    E8rate: 0,
    E9rate: 0,
    E10rate: 0,
  });
  const [cesscode, setcesscode] = useState([
    {
      cesscode: "",
      cessAc: "",
    },
  ]);
  const [Adcode, setAdcode] = useState([
    {
      Adcode: "",
      Ad_ac: "",
    },
  ]);
  const [cgstcode, setcgstcode] = useState([
    {
      cgst_code: "",
      cgst_ac: "",
    },
  ]);
  const [cgstcode1, setcgstcode1] = useState([
    {
      cgst_code1: "",
      cgst_ac1: "",
    },
  ]);
  const [cgstcode2, setcgstcode2] = useState([
    {
      cgst_code2: "",
      cgst_ac2: "",
    },
  ]);
  const [sgstcode, setsgstcode] = useState([
    {
      sgst_code: "",
      sgst_ac: "",
    },
  ]);
  const [sgstcode1, setsgstcode1] = useState([
    {
      sgst_code1: "",
      sgst_ac1: "",
    },
  ]);
  const [sgstcode2, setsgstcode2] = useState([
    {
      sgst_code2: "",
      sgst_ac2: "",
    },
  ]);
  const [igstcode, setigstcode] = useState([
    {
      igst_code: "",
      igst_ac: "",
    },
  ]);
  const [igstcode1, setigstcode1] = useState([
    {
      igst_code1: "",
      igst_ac1: "",
    },
  ]);
  const [igstcode2, setigstcode2] = useState([
    {
      igst_code2: "",
      igst_ac2: "",
    },
  ]);
  const [tcscode, settcscode] = useState([
    {
      tcs_code: "",
      tcs_ac: "",
    },
  ]);
  const [tcs206code, settcs206code] = useState([
    {
      tcs206code: "",
      tcs206ac: "",
    },
  ]);
  const [discountcode, setdiscountcode] = useState([
  {
    discount_code: "",
    discount_ac: "",
  },
  ]);

  // TDS SCRAP
  const [cTds, setcTds] = useState([
  {
    cTds_code: "",
    cTds_ac: "",
  },
  ]);
  const [sTds, setsTds] = useState([
  {
    sTds_code: "",
    sTds_ac: "",
  },
  ]);
  const [iTds, setiTds] = useState([
  {
    iTds_code: "",
    iTds_ac: "",
  },
  ]);

  const [E1name, setE1name] = useState([{ E1Code: "", E1name: "" }]);
  const [E2name, setE2name] = useState([{ E2Code: "", E2name: "" }]);
  const [E3name, setE3name] = useState([{ E3Code: "", E3name: "" }]);
  const [E4name, setE4name] = useState([{ E4Code: "", E4name: "" }]);
  const [E5name, setE5name] = useState([{ E5Code: "", E5name: "" }]);
  const [E6name, setE6name] = useState([{ E6Code: "", E6name: "" }]);
  const [E7name, setE7name] = useState([{ E7Code: "", E7name: "" }]);
  const [E8name, setE8name] = useState([{ E8Code: "", E8name: "" }]);
  const [E9name, setE9name] = useState([{ E9Code: "", E9name: "" }]);
  const [E10name, setE10name] = useState([{ E10Code: "", E10name: "" }]);

  const invoiceComponents = {
    InvoicePDFPur,
    InvoicePur2,
    InvoicePur3,
  };

  const handleChangeInvoice = (e) => {
    setFormData((prev) => ({
      ...prev,
      reportformat: e.target.value,
    }));
  };

  // FETCH DATA
  // const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [index, setIndex] = useState(0);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [isEditMode, setIsEditMode] = useState(true);
  const [isAbcmode, setIsAbcmode] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  
  // useEffect(() => {
  //   const isFormEmpty = Object.values(formData).every(
  //     (value) =>
  //       value === "" || value === 0 || value === null || value === undefined
  //   );

  //   setIsSubmitEnabled(isFormEmpty);
  // }, [formData]);


  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchasesetup`
      );
      if (response.status === 200 && response.data.length > 0) {
        const lastEntry = response.data[response.data.length - 1]; // Assuming you want the last one
        setFormData(lastEntry.formData);
        setData1(lastEntry); // Assuming this is meant to hold the full data structure
        setIndex(lastEntry._id);
        // Convert cesscode into an array containing one object
        setcesscode([
          {
            cesscode: lastEntry.formData.cesscode,
            cessAc: lastEntry.formData.cessAc,
          },
        ]);
        setAdcode([
          {
            Adcode: lastEntry.formData.Adcode,
            Ad_ac: lastEntry.formData.Ad_ac,
          },
        ]);
        setcgstcode([
          {
            cgst_code: lastEntry.formData.cgst_code,
            cgst_ac: lastEntry.formData.cgst_ac,
          },
        ]);
        setcgstcode1([
          {
            cgst_code1: lastEntry.formData.cgst_code1,
            cgst_ac1: lastEntry.formData.cgst_ac1,
          },
        ]);
        setcgstcode2([
          {
            cgst_code2: lastEntry.formData.cgst_code2,
            cgst_ac2: lastEntry.formData.cgst_ac2,
          },
        ]);
        setsgstcode([
          {
            sgst_code: lastEntry.formData.sgst_code,
            sgst_ac: lastEntry.formData.sgst_ac,
          },
        ]);
        setsgstcode1([
          {
            sgst_code1: lastEntry.formData.sgst_code1,
            sgst_ac1: lastEntry.formData.sgst_ac1,
          },
        ]);
        setsgstcode2([
          {
            sgst_code2: lastEntry.formData.sgst_code2,
            sgst_ac2: lastEntry.formData.sgst_ac2,
          },
        ]);
        setigstcode([
          {
            igst_code: lastEntry.formData.igst_code,
            igst_ac: lastEntry.formData.igst_ac,
          },
        ]);
        setigstcode1([
          {
            igst_code1: lastEntry.formData.igst_code1,
            igst_ac1: lastEntry.formData.igst_ac1,
          },
        ]);
        setigstcode2([
          {
            igst_code2: lastEntry.formData.igst_code2,
            igst_ac2: lastEntry.formData.igst_ac2,
          },
        ]);
        settcscode([
          {
            tcs_code: lastEntry.formData.tcs_code,
            tcs_ac: lastEntry.formData.tcs_ac,
          },
        ]);
        settcs206code([
          {
            tcs206code: lastEntry.formData.tcs206code,
            tcs206ac: lastEntry.formData.tcs206ac,
          },
        ]);
        setdiscountcode([
        {
          discount_code: lastEntry.formData.discount_code,
          discount_ac: lastEntry.formData.discount_ac,
        },
        ]);
        // TDS SCRAP
        setcTds([
          {
            cTds_code: lastEntry.formData.cTds_code,
            cTds_ac: lastEntry.formData.cTds_ac,
          },
        ]);
        setsTds([
          {
            sTds_code: lastEntry.formData.sTds_code,
            sTds_ac: lastEntry.formData.sTds_ac,
          },
        ]);
        setiTds([
          {
            iTds_code: lastEntry.formData.iTds_code,
            iTds_ac: lastEntry.formData.iTds_ac,
          },
        ]);
        setE1name([
          {
            E1Code: lastEntry.formData.E1Code,
            E1name: lastEntry.formData.E1name,
          },
        ]);
        setE2name([
          {
            E2Code: lastEntry.formData.E2Code,
            E2name: lastEntry.formData.E2name,
          },
        ]);
        setE3name([
          {
            E3Code: lastEntry.formData.E3Code,
            E3name: lastEntry.formData.E3name,
          },
        ]);
        setE4name([
          {
            E4Code: lastEntry.formData.E4Code,
            E4name: lastEntry.formData.E4name,
          },
        ]);
        setE5name([
          {
            E5Code: lastEntry.formData.E5Code,
            E5name: lastEntry.formData.E5name,
          },
        ]);
        setE6name([
          {
            E6Code: lastEntry.formData.E6Code,
            E6name: lastEntry.formData.E6name,
          },
        ]);
        setE7name([
          {
            E7Code: lastEntry.formData.E7Code,
            E7name: lastEntry.formData.E7name,
          },
        ]);
        setE8name([
          {
            E8Code: lastEntry.formData.E8Code,
            E8name: lastEntry.formData.E8name,
          },
        ]);
        setE9name([
          {
            E9Code: lastEntry.formData.E9Code,
            E9name: lastEntry.formData.E9name,
          },
        ]);
        setE10name([
          {
            E10Code: lastEntry.formData.E10Code,
            E10name: lastEntry.formData.E10name,
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
      color1: "",
      vacode: "",
      others: "",
      btype: "",
      stype: "",
      weight: 0,
      reportformat: "",
      pkgs: 0,
      tax: "",
      exfor: "",
      rate: 0,
      stkcode: "",
      balance: "",
      conv: "",
      sale_code: "",
      trpt: "",
      rem1: "",
      rem2: "",
      rem3: "",
      rem4: "",
      transport: "",
      agent: "",
      broker: "",
      gr: "",
      sale_ac: "",
      alertbackdate: "",
      invtime: "",
      revtime: "",
      acNameLed: "",
      cursorFocus: "",
      expbefore: "",
      Tcsontax: "",
      TcsRate: "",
      Tround: "",
      Sale_code: "",
      Roundoff: "",
      Salef3: "",
      T1: "",
      T2: "",
      T3: "",
      T4: "",
      T5: "",
      T6: "",
      T7: "",
      T8: "",
      T9: "",
      T10: "",
      T11: "",
      T12: "",
      T13: "",
      T14: "",
      T15: "",
      T16: "",
      T17: "",
      T18: "",
      T19: "",
      T20: "",
      E1add: "",
      E2add: "",
      E3add: "",
      E4add: "",
      E5add: "",
      E6add: "",
      E7add: "",
      E8add: "",
      E9add: "",
      E10add: "",
      E1rate: 0,
      E2rate: 0,
      E3rate: 0,
      E4rate: 0,
      E5rate: 0,
      E6rate: 0,
      E7rate: 0,
      E8rate: 0,
      E9rate: 0,
      E10rate: 0,
      E1: "",
      E2: "",
      E3: "",
      E4: "",
      E5: "",
      E6: "",
      E7: "",
      E8: "",
      E9: "",
      E10: "",
    };
    const emptycesscode = [{ cesscode: "", cessAc: "" }];
    const emptyAdcode = [{ Adcode: "", Ad_ac: "" }];
    const emptycgstcode = [{ cgst_code: "", cgst_ac: "" }];
    const emptysgstcode = [{ sgst_code: "", sgst_ac: "" }];
    const emptyigstcode = [{ igst_code: "", igst_ac: "" }];
    const emptyTcscode = [{ tcs_code: "", tcs_ac: "" }];
    const emptyTcs206code = [{ tcs206code: "", tcs206ac: "" }];
    setFormData(emptyData);
    setcesscode(emptycesscode);
    setAdcode(emptyAdcode);
    setcgstcode(emptycgstcode);
    setsgstcode(emptysgstcode);
    setigstcode(emptyigstcode);
    settcscode(emptyTcscode);
    settcs206code(emptyTcs206code);
    setData1({
      formData: emptyData,
      cesscode: emptycesscode,
      Adcode: emptyAdcode,
      cgstcode: emptycgstcode,
      sgstcode: emptysgstcode,
      igstcode: emptyigstcode,
      tcscode,
      emptyTcscode,
      tcs206code: emptyTcs206code,
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

  const handleSaveClick = async () => {
    document.body.style.backgroundColor = "white";
    let isDataSaved = false;

    const prepareData = () => ({
      _id: formData._id,
      formData: {
        ...formData,
        cesscode: cesscode.length > 0 ? cesscode[0].cesscode : 0,
        cessAc: cesscode.length > 0 ? cesscode[0].cessAc : "",
        Adcode: Adcode.length > 0 ? Adcode[0].Adcode : "",
        Ad_ac: Adcode.length > 0 ? Adcode[0].Ad_ac : "",
        cgst_code: cgstcode.length > 0 ? cgstcode[0].cgst_code : "",
        cgst_ac: cgstcode.length > 0 ? cgstcode[0].cgst_ac : "",
        cgst_code1: cgstcode1.length > 0 ? cgstcode1[0].cgst_code1 : "",
        cgst_ac1: cgstcode1.length > 0 ? cgstcode1[0].cgst_ac1 : "",
        cgst_code2: cgstcode2.length > 0 ? cgstcode2[0].cgst_code2 : "",
        cgst_ac2: cgstcode2.length > 0 ? cgstcode2[0].cgst_ac2 : "",
        sgst_code: sgstcode.length > 0 ? sgstcode[0].sgst_code : "",
        sgst_ac: sgstcode.length > 0 ? sgstcode[0].sgst_ac : "",
        sgst_code1: sgstcode1.length > 0 ? sgstcode1[0].sgst_code1 : "",
        sgst_ac1: sgstcode1.length > 0 ? sgstcode1[0].sgst_ac1 : "",
        sgst_code2: sgstcode2.length > 0 ? sgstcode2[0].sgst_code2 : "",
        sgst_ac2: sgstcode2.length > 0 ? sgstcode2[0].sgst_ac2 : "",
        igst_code: igstcode.length > 0 ? igstcode[0].igst_code : "",
        igst_ac: igstcode.length > 0 ? igstcode[0].igst_ac : "",
        igst_code1: igstcode1.length > 0 ? igstcode1[0].igst_code1 : "",
        igst_ac1: igstcode1.length > 0 ? igstcode1[0].igst_ac1 : "",
        igst_code2: igstcode2.length > 0 ? igstcode2[0].igst_code2 : "",
        igst_ac2: igstcode2.length > 0 ? igstcode2[0].igst_ac2 : "",
        tcs_code: tcscode.length > 0 ? tcscode[0].tcs_code : "",
        tcs_ac: tcscode.length > 0 ? tcscode[0].tcs_ac : "",
        tcs206code: tcs206code.length > 0 ? tcs206code[0].tcs206code : "",
        tcs206ac: tcs206code.length > 0 ? tcs206code[0].tcs206ac : "",
        discount_code: discountcode.length > 0 ? discountcode[0].discount_code : "",
        discount_ac: discountcode.length > 0 ? discountcode[0].discount_ac : "",

        // TDS SCRAP
        cTds_code: cTds.length > 0 ? cTds[0].cTds_code : "",
        cTds_ac: cTds.length > 0 ? cTds[0].cTds_ac : "",
        
        sTds_code: sTds.length > 0 ? sTds[0].sTds_code : "",
        sTds_ac: sTds.length > 0 ? sTds[0].sTds_ac : "",

        iTds_code: iTds.length > 0 ? iTds[0].iTds_code : "",
        iTds_ac: iTds.length > 0 ? iTds[0].iTds_ac : "",
        
        E1name: E1name.length > 0 ? E1name[0].E1name : "",
        E1Code: E1name.length > 0 ? E1name[0].E1Code : "",
        E2name: E2name.length > 0 ? E2name[0].E2name : "",
        E2Code: E2name.length > 0 ? E2name[0].E2Code : "",
        E3name: E3name.length > 0 ? E3name[0].E3name : "",
        E3Code: E3name.length > 0 ? E3name[0].E3Code : "",
        E4name: E4name.length > 0 ? E4name[0].E4name : "",
        E4Code: E4name.length > 0 ? E4name[0].E4Code : "",
        E5name: E5name.length > 0 ? E5name[0].E5name : "",
        E5Code: E5name.length > 0 ? E5name[0].E5Code : "",
        E6name: E6name.length > 0 ? E6name[0].E6name : "",
        E6Code: E6name.length > 0 ? E6name[0].E6Code : "",
        E7name: E7name.length > 0 ? E7name[0].E7name : "",
        E7Code: E7name.length > 0 ? E7name[0].E7Code : "",
        E8name: E8name.length > 0 ? E8name[0].E8name : "",
        E8Code: E8name.length > 0 ? E8name[0].E8Code : "",
        E9name: E9name.length > 0 ? E9name[0].E9name : "",
        E9Code: E9name.length > 0 ? E9name[0].E9Code : "",
        E10name: E10name.length > 0 ? E10name[0].E10name : "",
        E10Code: E10name.length > 0 ? E10name[0].E10Code : "",
      },
    });
    try {
      const combinedData = prepareData();
      console.log("Combined Data New:", combinedData);
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/purchasesetup${
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
      setIsHighlighted(false); // Change color when button is clicked
      setIsDisabled(!isDataSaved);
      setIsEditMode(!isDataSaved);
      const toastMsg = "Data Saved Successfully!";
      toast.success(toastMsg, { position: "top-center" });
    }
  };

  const handleEditClick = () => {
    setIsHighlighted(true); // Change color when button is clicked
    setIsDisabled(false);
    setIsEditMode(true);
    setIsSubmitEnabled(true);
    setIsAbcmode(true);
  };

  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
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
      setProductAdcode(formattedData);
      setProductsAcc(formattedData);
      setProductcgst1(formattedData);
      setProductcgst2(formattedData);
      setProductsgst(formattedData);
      setProductsgst1(formattedData);
      setProductsgst2(formattedData);
      setProductigst(formattedData);
      setProductigst1(formattedData);
      setProductigst2(formattedData);
      setProducttcs(formattedData);
      setProducttcs206(formattedData);
      setProductE1name(formattedData);
      setProductE2name(formattedData);
      setProductE3name(formattedData);
      setProductE4name(formattedData);
      setProductE5name(formattedData);
      setProductE6name(formattedData);
      setProductE7name(formattedData);
      setProductE8name(formattedData);
      setProductE9name(formattedData);
      setProductE10name(formattedData);

      setProductscTds(formattedData);
      setProductssTds(formattedData);
      setProductsiTds(formattedData);
      // Set loading states to false after data is fetched
      setLoadingcTds(false);
      setLoadingsTds(false);
      setLoadingiTds(false);

      setLoadingCus(false);
      setLoadingAdcode(false);
      setLoadingAcc(false);
      setLoadingcgst1(false);
      setLoadingcgst2(false);
      setLoadingsgst(false);
      setLoadingsgst1(false);
      setLoadingsgst2(false);
      setLoadingigst(false);
      setLoadingigst1(false);
      setLoadingigst2(false);
      setLoadingtcs(false);
      setLoadingtcs206(false);
      setLoadingE1name(false);
      setLoadingE2name(false);
      setLoadingE3name(false);
      setLoadingE4name(false);
      setLoadingE5name(false);
      setLoadingE6name(false);
      setLoadingE7name(false);
      setLoadingE8name(false);
      setLoadingE9name(false);
      setLoadingE10name(false);
    } catch (error) {
      setErrorcTds(error.message);
      setLoadingcTds(false);
      setErrorsTds(error.message);
      setLoadingsTds(false);
      setErroriTds(error.message);
      setLoadingiTds(false);

      setErrorCus(error.message);
      setLoadingCus(false);
      setErrorcgst1(error.message);
      setLoadingcgst1(false);
      setErrorcgst2(error.message);
      setLoadingcgst2(false);
      setErrorAdcode(error.message);
      setLoadingAdcode(false);
      setErrorAcc(error.message);
      setLoadingAcc(false);
      setErrorsgst(error.message);
      setLoadingsgst(false);
      setErrorigst(error.message);
      setLoadingigst(false);
      setErrortcs(error.message);
      setLoadingtcs(false);
      setErrortcs206(error.message);
      setLoadingtcs206(false);
      setErrorE1name(error.message);
      setLoadingE1name(false);
      setErrorE2name(error.message);
      setLoadingE2name(false);
      setErrorE3name(error.message);
      setLoadingE3name(false);
      setErrorE4name(error.message);
      setLoadingE4name(false);
      setErrorE5name(error.message);
      setLoadingE5name(false);
      setErrorE6name(error.message);
      setLoadingE6name(false);
      setErrorE7name(error.message);
      setLoadingE7name(false);
      setErrorE8name(error.message);
      setLoadingE8name(false);
      setErrorE9name(error.message);
      setLoadingE9name(false);
      setErrorE10name(error.message);
      setLoadingE10name(false);
    }
  };
  // modal for CTDS
    const [productscTds, setProductscTds] = useState([]);
    const [showModalcTds, setShowModalcTds] = useState(false);
    const [selectedItemIndexcTds, setSelectedItemIndexcTds] = useState(null);
    const [loadingcTds, setLoadingcTds] = useState(true);
    const [errorcTds, setErrorcTds] = useState(null);

    const handleItemChangecTds = (index, key, value) => {
      const updatedItems = [...cTds];
      updatedItems[index][key] = capitalizeWords(value); // Capitalize words here

      // If the key is 'name', find the corresponding product and set the price
      if (key === "name") {
        const selectedProduct = productscTds.find(
          (product) => product.ahead === value
        );
        if (selectedProduct) {
          updatedItems[index]["cTds_ac"] = selectedProduct.ahead;
          updatedItems[index]["cTds_code"] = selectedProduct.acode;
        }
      } else if (key === "discount") {
        // No operation
      }
      setcTds(updatedItems);
    };

    const handleProductSelectcTds = (product) => {
      if (!product) {
        alert("No account selected!");
        setShowModalcTds(false);
        return;
      }

      // Deep copy cesscode array
      const updatedShipped = [...cTds];

      // Update the correct object in the array
      updatedShipped[selectedItemIndexcTds] = {
        ...updatedShipped[selectedItemIndexcTds],
        cTds_ac: product.ahead || "",
        cTds_code: product.acode || "",
        // Add any other mappings needed
      };

      const nameValue = product.ahead || product.name || "";
      if (selectedItemIndexcTds !== null) {
        handleItemChangecTds(selectedItemIndexcTds, "name", nameValue);
      }
      setcTds(updatedShipped);
      setIsEditMode(true);
      setShowModalcTds(false);
    };

    const openModalForItemcTds = (index) => {
      if (isEditMode) {
        setSelectedItemIndexcTds(index);
        setShowModalcTds(true);
      }
    };

    const allFieldscTds = productscTds.reduce((fields, product) => {
      Object.keys(product).forEach((key) => {
        if (!fields.includes(key)) {
          fields.push(key);
        }
      });
      return fields;
    }, []);

    // ITDS
    const [productssTds, setProductssTds] = useState([]);
    const [showModalsTds, setShowModalsTds] = useState(false);
    const [selectedItemIndexsTds, setSelectedItemIndexsTds] = useState(null);
    const [loadingsTds, setLoadingsTds] = useState(true);
    const [errorsTds, setErrorsTds] = useState(null);

    const handleItemChangesTds = (index, key, value) => {
      const updatedItems = [...sTds];
      updatedItems[index][key] = capitalizeWords(value); // Capitalize words here

      // If the key is 'name', find the corresponding product and set the price
      if (key === "name") {
        const selectedProduct = productssTds.find(
          (product) => product.ahead === value
        );
        if (selectedProduct) {
          updatedItems[index]["sTds_ac"] = selectedProduct.ahead;
          updatedItems[index]["sTds_code"] = selectedProduct.acode;
        }
      } else if (key === "discount") {
        // No operation
      }
      setsTds(updatedItems);
    };

    const handleProductSelectsTds = (product) => {
      if (!product) {
        alert("No account selected!");
        setShowModalsTds(false);
        return;
      }

      // Deep copy cesscode array
      const updatedShipped = [...sTds];

      // Update the correct object in the array
      updatedShipped[selectedItemIndexsTds] = {
        ...updatedShipped[selectedItemIndexsTds],
        sTds_ac: product.ahead || "",
        sTds_code: product.acode || "",
        // Add any other mappings needed
      };

      const nameValue = product.ahead || product.name || "";
      if (selectedItemIndexsTds !== null) {
        handleItemChangesTds(selectedItemIndexsTds, "name", nameValue);
      }
      setsTds(updatedShipped);
      setIsEditMode(true);
      setShowModalsTds(false);
    };

    const openModalForItemsTds = (index) => {
      if (isEditMode) {
        setSelectedItemIndexsTds(index);
        setShowModalsTds(true);
      }
    };

    const allFieldssTds = productssTds.reduce((fields, product) => {
      Object.keys(product).forEach((key) => {
        if (!fields.includes(key)) {
          fields.push(key);
        }
      });
      return fields;
    }, []);

    // ITDS
    const [productsiTds, setProductsiTds] = useState([]);
    const [showModaliTds, setShowModaliTds] = useState(false);
    const [selectedItemIndexiTds, setSelectedItemIndexiTds] = useState(null);
    const [loadingiTds, setLoadingiTds] = useState(true);
    const [erroriTds, setErroriTds] = useState(null);

    const handleItemChangeiTds = (index, key, value) => {
      const updatedItems = [...iTds];
      updatedItems[index][key] = capitalizeWords(value); // Capitalize words here

      // If the key is 'name', find the corresponding product and set the price
      if (key === "name") {
        const selectedProduct = productsiTds.find(
          (product) => product.ahead === value
        );
        if (selectedProduct) {
          updatedItems[index]["iTds_ac"] = selectedProduct.ahead;
          updatedItems[index]["iTds_code"] = selectedProduct.acode;
        }
      } else if (key === "discount") {
        // No operation
      }
      setiTds(updatedItems);
    };

    const handleProductSelectiTds = (product) => {
      if (!product) {
        alert("No account selected!");
        setShowModaliTds(false);
        return;
      }

      // Deep copy cesscode array
      const updatedShipped = [...iTds];

      // Update the correct object in the array
      updatedShipped[selectedItemIndexiTds] = {
        ...updatedShipped[selectedItemIndexiTds],
        iTds_ac: product.ahead || "",
        iTds_code: product.acode || "",
        // Add any other mappings needed
      };

      const nameValue = product.ahead || product.name || "";
      if (selectedItemIndexiTds !== null) {
        handleItemChangeiTds(selectedItemIndexiTds, "name", nameValue);
      }
      setiTds(updatedShipped);
      setIsEditMode(true);
      setShowModaliTds(false);
    };

    const openModalForItemiTds = (index) => {
      if (isEditMode) {
        setSelectedItemIndexiTds(index);
        setShowModaliTds(true);
      }
    };

    const allFieldsiTds = productsiTds.reduce((fields, product) => {
      Object.keys(product).forEach((key) => {
        if (!fields.includes(key)) {
          fields.push(key);
        }
      });
      return fields;
    }, []);

    // Modal For Discount 
    const [productsDis, setProductsDis] = useState([]);
    const [showModalDis, setShowModalDis] = useState(false);
    const [selectedItemIndexDis, setSelectedItemIndexDis] = useState(null);
    const [loadingDis, setLoadingDis] = useState(true);
    const [errorDis, setErrorDis] = useState(null);
  
    const handleItemChangeDis = (index, key, value) => {
      const updatedItems = [...discountcode];
      updatedItems[index][key] = capitalizeWords(value); // Capitalize words here
  
      // If the key is 'name', find the corresponding product and set the price
      if (key === "name") {
        const selectedProduct = productsDis.find(
          (product) => product.ahead === value
        );
        if (selectedProduct) {
          updatedItems[index]["discount_ac"] = selectedProduct.ahead;
          updatedItems[index]["discount_code"] = selectedProduct.acode;
        }
      } else if ( key === "discount") {
        // No operation
      }
      setdiscountcode(updatedItems);
    };
  
    const handleProductSelectDis = (product) => {
      if (!product) {
        alert("No account selected!");
        setShowModalDis(false);
        return;
      }
  
      // Deep copy cesscode array
      const updatedShipped = [...discountcode];
  
      // Update the correct object in the array
      updatedShipped[selectedItemIndexDis] = {
        ...updatedShipped[selectedItemIndexDis],
        discount_ac: product.ahead || "",
        discount_code: product.acode || "",
        // Add any other mappings needed
      };
  
      const nameValue = product.ahead || product.name || "";
      if (selectedItemIndexDis !== null) {
        handleItemChangeDis(selectedItemIndexDis, "name", nameValue);
      }
      setdiscountcode(updatedShipped);
      setIsEditMode(true);
      setShowModalDis(false);
    };
  
    const openModalForItemDis = (index) => {
      if (isEditMode) {
        setSelectedItemIndexDis(index);
        setShowModalDis(true);
      }
    };
  
    const allFieldsDis = productsDis.reduce((fields, product) => {
      Object.keys(product).forEach((key) => {
        if (!fields.includes(key)) {
          fields.push(key);
        }
      });
      return fields;
    }, []);

  // Modal for CessAC
  const [productsCus, setProductsCus] = useState([]);
  const [showModalCus, setShowModalCus] = useState(false);
  const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
  const [loadingCus, setLoadingCus] = useState(true);
  const [errorCus, setErrorCus] = useState(null);
  const handleItemChangeCus = (index, key, value) => {
    const updatedItems = [...cesscode];
    updatedItems[index][key] = capitalizeWords(value); // Capitalize words here
    // If the key is 'name', find the corresponding product and set the price
    if (key === "name") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["cessAc"] = selectedProduct.ahead;
        updatedItems[index]["cesscode"] = selectedProduct.acode;
      }
    } else if (key === "discount") {
    }
    setcesscode(updatedItems);
  };

  // const handleProductSelectCus = (product) => {
  //   if (selectedItemIndexCus !== null) {
  //     handleItemChangeCus(selectedItemIndexCus, "name", product.ahead);
  //     setShowModalCus(false);
  //   }
  // };
  
  const handleProductSelectCus = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalCus(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...cesscode];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexCus] = {
      ...updatedShipped[selectedItemIndexCus],
      cessAc: product.ahead || "",
      cesscode: product.acode || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexCus !== null) {
      handleItemChangeCus(selectedItemIndexCus, "name", product.ahead);
    }
    setcesscode(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalCus(false);
  
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

  // Modal For Adcode
  const [productAdcode, setProductAdcode] = useState([]);
  const [showModalAdcode, setShowModalAdcode] = useState(false);
  const [selectedItemIndexAdcode, setSelectedItemIndexAdcode] = useState(null);
  const [loadingAdcode, setLoadingAdcode] = useState(true);
  const [errorAdcode, setErrorAdcode] = useState(null);

  const handleItemChangeAdcode = (index, key, value) => {
    const updatedItems = [...Adcode];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productAdcode.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["Adcode"] = selectedProduct.acode;
        updatedItems[index]["Ad_ac"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setAdcode(updatedItems);
  };

  // const handleProductSelectAdcode = (product) => {
  //   if (selectedItemIndexAdcode !== null) {
  //     handleItemChangeAdcode(selectedItemIndexAdcode, "ahead", product.ahead);
  //     setShowModalAdcode(false);
  //   }
  // };

    const handleProductSelectAdcode = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalAdcode(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...Adcode];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexAdcode] = {
      ...updatedShipped[selectedItemIndexAdcode],
      Ad_ac: product.ahead || "",
      Adcode: product.acode || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexAdcode !== null) {
      handleItemChangeAdcode(selectedItemIndexAdcode, "ahead", nameValue);
    }
    setAdcode(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalAdcode(false);
  
  };

  const openModalForItemAdcode = (index) => {
    if (isEditMode) {
      setSelectedItemIndexAdcode(index);
      setShowModalAdcode(true);
    }
  };

  const allFieldsAdcode = productAdcode.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  // Modal For CGST
  const [productsAcc, setProductsAcc] = useState([]);
  const [showModalAcc, setShowModalAcc] = useState(false);
  const [selectedItemIndexAcc, setSelectedItemIndexAcc] = useState(null);
  const [loadingAcc, setLoadingAcc] = useState(true);
  const [errorAcc, setErrorAcc] = useState(null);

  const handleItemChangeAcc = (index, key, value) => {
    const updatedItems = [...cgstcode];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productsAcc.find(
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

  // const handleProductSelectAcc = (product) => {
  //   if (selectedItemIndexAcc !== null) {
  //     handleItemChangeAcc(selectedItemIndexAcc, "ahead", product.ahead);
  //     setShowModalAcc(false);
  //   }
  // };
  const handleProductSelectAcc = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalAcc(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...cgstcode];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexAcc] = {
      ...updatedShipped[selectedItemIndexAcc],
      cgst_ac: product.ahead || "",
      cgst_code: product.acode || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexAcc !== null) {
      handleItemChangeAcc(selectedItemIndexAcc, "ahead", nameValue);
    }
    setcgstcode(updatedShipped);       // <- update the array in state!
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

  // Modal For CGST1
  const [productcgst1, setProductcgst1] = useState([]);
  const [showModalcgst1, setShowModalcgst1] = useState(false);
  const [selectedItemIndexcgst1, setSelectedItemIndexcgst1] = useState(null);
  const [loadingcgst1, setLoadingcgst1] = useState(true);
  const [errorcgst1, setErrorcgst1] = useState(null);

  const handleItemChangecgst1 = (index, key, value) => {
    const updatedItems = [...cgstcode1];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productcgst1.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["cgst_code1"] = selectedProduct.acode;
        updatedItems[index]["cgst_ac1"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setcgstcode1(updatedItems);
  };

  // const handleProductSelectcgst1 = (product) => {
  //   if (selectedItemIndexcgst1 !== null) {
  //     handleItemChangecgst1(selectedItemIndexcgst1, "ahead", product.ahead);
  //     setShowModalcgst1(false);
  //   }
  // };
  const handleProductSelectcgst1 = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalcgst1(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...cgstcode1];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexcgst1] = {
      ...updatedShipped[selectedItemIndexcgst1],
      cgst_ac1: product.ahead || "",
      cgst_code1: product.acode || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexcgst1 !== null) {
      handleItemChangecgst1(selectedItemIndexcgst1, "ahead", nameValue);
    }
    setcgstcode1(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalcgst1(false);
  
  };

  const openModalForItemcgst1 = (index) => {
    if (isEditMode) {
      setSelectedItemIndexcgst1(index);
      setShowModalcgst1(true);
    }
  };
  const allFieldcgst1 = productcgst1.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  // Modal For CGST2
  const [productcgst2, setProductcgst2] = useState([]);
  const [showModalcgst2, setShowModalcgst2] = useState(false);
  const [selectedItemIndexcgst2, setSelectedItemIndexcgst2] = useState(null);
  const [loadingcgst2, setLoadingcgst2] = useState(true);
  const [errorcgst2, setErrorcgst2] = useState(null);

  const handleItemChangecgst2 = (index, key, value) => {
    const updatedItems = [...cgstcode2];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productcgst2.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["cgst_code2"] = selectedProduct.acode;
        updatedItems[index]["cgst_ac2"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setcgstcode2(updatedItems);
  };

  // const handleProductSelectcgst2 = (product) => {
  //   if (selectedItemIndexcgst2 !== null) {
  //     handleItemChangecgst2(selectedItemIndexcgst2, "ahead", product.ahead);
  //     setShowModalcgst2(false);
  //   }
  // };
  const handleProductSelectcgst2 = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalcgst1(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...cgstcode2];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexcgst2] = {
      ...updatedShipped[selectedItemIndexcgst2],
      cgst_ac2: product.ahead || "",
      cgst_code2: product.acode || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexcgst2 !== null) {
      handleItemChangecgst2(selectedItemIndexcgst2, "ahead", nameValue);
    }
    setcgstcode2(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalcgst2(false);
  
  };

  const openModalForItemcgst2 = (index) => {
    if (isEditMode) {
      setSelectedItemIndexcgst2(index);
      setShowModalcgst2(true);
    }
  };
  const allFieldcgst2 = productcgst2.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  const [pressedKey, setPressedKey] = useState("");
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
      sgst_ac: product.ahead || "",
      sgst_code: product.acode || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexsgst !== null) {
      handleItemChangesgst(selectedItemIndexsgst, "ahead", nameValue);
    }
    setsgstcode(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalsgst(false);
  
  };

  const openModalForItemsgst = (index) => {
    if (isEditMode) {
      setSelectedItemIndexsgst(index);
      setShowModalsgst(true);
    }
  };

  const allFieldsgst = productsgst.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  // Modal For SGST1
  const [productsgst1, setProductsgst1] = useState([]);
  const [showModalsgst1, setShowModalsgst1] = useState(false);
  const [selectedItemIndexsgst1, setSelectedItemIndexsgst1] = useState(null);
  const [loadingsgst1, setLoadingsgst1] = useState(true);
  const [errorsgst1, setErrorsgst1] = useState(null);

  const handleItemChangesgst1 = (index, key, value) => {
    const updatedItems = [...sgstcode1];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productsgst1.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["sgst_code1"] = selectedProduct.acode;
        updatedItems[index]["sgst_ac1"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setsgstcode1(updatedItems);
  };

  // const handleProductSelectsgst1 = (product) => {
  //   if (selectedItemIndexsgst1 !== null) {
  //     handleItemChangesgst1(selectedItemIndexsgst1, "ahead", product.ahead);
  //     setShowModalsgst1(false);
  //   }
  // };
  const handleProductSelectsgst1 = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalsgst1(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...sgstcode1];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexsgst1] = {
      ...updatedShipped[selectedItemIndexsgst1],
      sgst_ac1: product.ahead || "",
      sgst_code1: product.acode || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexsgst1 !== null) {
      handleItemChangesgst1(selectedItemIndexsgst1, "ahead", nameValue);
    }
    setsgstcode1(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalsgst1(false);
  
  };

  const openModalForItemsgst1 = (index) => {
    if (isEditMode) {
      setSelectedItemIndexsgst1(index);
      setShowModalsgst1(true);
    }
  };

  const allFieldsgst1 = productsgst1.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  // Modal For SGST2
  const [productsgst2, setProductsgst2] = useState([]);
  const [showModalsgst2, setShowModalsgst2] = useState(false);
  const [selectedItemIndexsgst2, setSelectedItemIndexsgst2] = useState(null);
  const [loadingsgst2, setLoadingsgst2] = useState(true);
  const [errorsgst2, setErrorsgst2] = useState(null);

  const handleItemChangesgst2 = (index, key, value) => {
    const updatedItems = [...sgstcode2];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productsgst2.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["sgst_code2"] = selectedProduct.acode;
        updatedItems[index]["sgst_ac2"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setsgstcode2(updatedItems);
  };

  // const handleProductSelectsgst2 = (product) => {
  //   if (selectedItemIndexsgst2 !== null) {
  //     handleItemChangesgst2(selectedItemIndexsgst2, "ahead", product.ahead);
  //     setShowModalsgst2(false);
  //   }
  // };

  const handleProductSelectsgst2 = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModalsgst2(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...sgstcode2];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexsgst2] = {
      ...updatedShipped[selectedItemIndexsgst2],
      sgst_ac2: product.ahead || "",
      sgst_code2: product.acode || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexsgst2 !== null) {
      handleItemChangesgst2(selectedItemIndexsgst2, "ahead", nameValue);
    }
    setsgstcode2(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModalsgst2(false);
  
  };

  const openModalForItemsgst2 = (index) => {
    if (isEditMode) {
      setSelectedItemIndexsgst2(index);
      setShowModalsgst2(true);
    }
  };

  const allFieldsgst2 = productsgst2.reduce((fields, product) => {
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
      igst_ac: product.ahead || "",
      igst_code: product.acode || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexigst !== null) {
      handleItemChangeigst(selectedItemIndexigst, "ahead", nameValue);
    }
    setigstcode(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModaligst(false);
  
  };

  const openModalForItemigst = (index) => {
    if (isEditMode) {
      setSelectedItemIndexigst(index);
      setShowModaligst(true);
    }
  };

  const allFieldsigst = productigst.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);
  // Modal For IGST1
  const [productigst1, setProductigst1] = useState([]);
  const [showModaligst1, setShowModaligst1] = useState(false);
  const [selectedItemIndexigst1, setSelectedItemIndexigst1] = useState(null);
  const [loadingigst1, setLoadingigst1] = useState(true);
  const [errorigst1, setErrorigst1] = useState(null);

  const handleItemChangeigst1 = (index, key, value) => {
    const updatedItems = [...igstcode1];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productigst1.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["igst_code1"] = selectedProduct.acode;
        updatedItems[index]["igst_ac1"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setigstcode1(updatedItems);
  };

  // const handleProductSelectigst1 = (product) => {
  //   if (selectedItemIndexigst1 !== null) {
  //     handleItemChangeigst1(selectedItemIndexigst1, "ahead", product.ahead);
  //     setShowModaligst1(false);
  //   }
  // };
  const handleProductSelectigst1 = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModaligst1(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...igstcode1];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexigst1] = {
      ...updatedShipped[selectedItemIndexigst1],
      igst_ac1: product.ahead || "",
      igst_code1: product.acode || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexigst1 !== null) {
      handleItemChangeigst1(selectedItemIndexigst1, "ahead", nameValue);
    }
    setigstcode1(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModaligst1(false);
  
  };

  const openModalForItemigst1 = (index) => {
    if (isEditMode) {
      setSelectedItemIndexigst1(index);
      setShowModaligst1(true);
    }
  };

  const allFieldsigst1 = productigst1.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  // Modal For IGST2
  const [productigst2, setProductigst2] = useState([]);
  const [showModaligst2, setShowModaligst2] = useState(false);
  const [selectedItemIndexigst2, setSelectedItemIndexigst2] = useState(null);
  const [loadingigst2, setLoadingigst2] = useState(true);
  const [errorigst2, setErrorigst2] = useState(null);

  const handleItemChangeigst2 = (index, key, value) => {
    const updatedItems = [...igstcode2];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productigst2.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["igst_code2"] = selectedProduct.acode;
        updatedItems[index]["igst_ac2"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setigstcode2(updatedItems);
  };

  // const handleProductSelectigst2 = (product) => {
  //   if (selectedItemIndexigst2 !== null) {
  //     handleItemChangeigst2(selectedItemIndexigst2, "ahead", product.ahead);
  //     setShowModaligst2(false);
  //   }
  // };
    const handleProductSelectigst2 = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModaligst2(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...igstcode2];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndexigst2] = {
      ...updatedShipped[selectedItemIndexigst2],
      igst_ac2: product.ahead || "",
      igst_code2: product.acode || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndexigst2 !== null) {
      handleItemChangeigst2(selectedItemIndexigst2, "ahead", nameValue);
    }
    setigstcode2(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModaligst2(false);
  
  };

  const openModalForItemigst2 = (index) => {
    if (isEditMode) {
      setSelectedItemIndexigst2(index);
      setShowModaligst2(true);
    }
  };

  const allFieldsigst2 = productigst2.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  // Modal For TCS
  const [producttcs, setProducttcs] = useState([]);
  const [showModaltcs, setShowModaltcs] = useState(false);
  const [selectedItemIndextcs, setSelectedItemIndextcs] = useState(null);
  const [loadingtcs, setLoadingtcs] = useState(true);
  const [errortcs, setErrortcs] = useState(null);

  const handleItemChangetcs = (index, key, value) => {
    const updatedItems = [...tcscode];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = producttcs.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["tcs_code"] = selectedProduct.acode;
        updatedItems[index]["tcs_ac"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    settcscode(updatedItems);
  };

  // const handleProductSelecttcs = (product) => {
  //   if (selectedItemIndextcs !== null) {
  //     handleItemChangetcs(selectedItemIndextcs, "ahead", product.ahead);
  //     setShowModaltcs(false);
  //   }
  // };
      const handleProductSelecttcs = (product) => {
    if (!product) {
      alert("No account selected!");
      setShowModaltcs(false);
      return;
    }
    
    // Deep copy shipped array
    const updatedShipped = [...tcscode];
  
    // Update the correct object in the array
    updatedShipped[selectedItemIndextcs] = {
      ...updatedShipped[selectedItemIndextcs],
      tcs_code: product.acode || "",
      tcs_ac: product.ahead || "",
      // Add any other mappings needed
    };

    const nameValue = product.ahead || product.name || "";
    if (selectedItemIndextcs !== null) {
      handleItemChangetcs(selectedItemIndextcs, "ahead", nameValue);

    }
    settcscode(updatedShipped);       // <- update the array in state!
    setIsEditMode(true);
    setShowModaltcs(false);
  
  };

  const openModalForItemtcs = (index) => {
    if (isEditMode) {
      setSelectedItemIndextcs(index);
      setShowModaltcs(true);
    }
  };

  const allFieldstcs = producttcs.reduce((fields, product) => {
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
         updatedItems[index]["tcs206code"] = selectedProduct.acode;
         updatedItems[index]["tcs206ac"] = selectedProduct.ahead;
       }
     } else if (key === "discount") {
     }
     settcs206code(updatedItems);
   };
 
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
       tcs206code: product.acode || "",
       tcs206ac: product.ahead || "",
       // Add any other mappings needed
     };
 
     const nameValue = product.ahead || product.name || "";
     if (selectedItemIndextcs206 !== null) {
      handleItemChangetcs206(selectedItemIndextcs206, "ahead", nameValue);
     }
     settcs206code(updatedShipped);       // <- update the array in state!
     setIsEditMode(true);
     setShowModaltcs206(false);
   };
 
   const openModalForItemtcs206 = (index) => {
     if (isEditMode) {
       setSelectedItemIndextcs206(index);
       setShowModaltcs206(true);
     }
   };
 
   const allFieldstcs206 = producttcs206.reduce((fields, product) => {
     Object.keys(product).forEach((key) => {
       if (!fields.includes(key)) {
         fields.push(key);
       }
     });
     return fields;
   }, []);

  
   // Modal For E1name
   const [productE1name, setProductE1name] = useState([]);
   const [showModalE1name, setShowModalE1name] = useState(false);
   const [selectedItemIndexE1name, setSelectedItemIndexE1name] = useState(null);
   const [loadingE1name, setLoadingE1name] = useState(true);
   const [errorE1name, setErrorE1name] = useState(null);
 
   const handleItemChangeE1name = (index, key, value) => {
     const updatedItems = [...E1name];
     // If the key is 'ahead', find the corresponding product and set the price
     if (key === "ahead") {
       const selectedProduct = productE1name.find(
         (product) => product.ahead === value
       );
       if (selectedProduct) {
         updatedItems[index]["E1Code"] = selectedProduct.acode;
         updatedItems[index]["E1name"] = selectedProduct.ahead;
       }
     } else if (key === "discount") {
     }
     setE1name(updatedItems);
   };
 
   // const handleProductSelectE1name = (product) => {
   //   if (selectedItemIndexE1name !== null) {
   //     handleItemChangeE1name(selectedItemIndexE1name, "ahead", product.ahead);
   //     setShowModalE1name(false);
   //   }
   // };
 
   const handleProductSelectE1name = (product) => {
     if (!product) {
       alert("No account selected!");
       setShowModalE1name(false);
       return;
     }
     
     // Deep copy shipped array
     const updatedShipped = [...E1name];
   
     // Update the correct object in the array
     updatedShipped[selectedItemIndexE1name] = {
       ...updatedShipped[selectedItemIndexE1name],
       E1Code: product.acode || "",
       E1name: product.ahead || "",
       // Add any other mappings needed
     };
 
     const nameValue = product.ahead || product.name || "";
     if (selectedItemIndexE1name !== null) {
       handleItemChangeE1name(selectedItemIndexE1name, "ahead", nameValue);
     }
     setE1name(updatedShipped);       // <- update the array in state!
     setIsEditMode(true);
     setShowModalE1name(false);
   
   };
 
   const openModalForItemE1name = (index) => {
     if (isEditMode) {
       setSelectedItemIndexE1name(index);
       setShowModalE1name(true);
     }
   };
 
   const allFieldsE1name = productE1name.reduce((fields, product) => {
     Object.keys(product).forEach((key) => {
       if (!fields.includes(key)) {
         fields.push(key);
       }
     });
     return fields;
   }, []);
 
   // Modal For E2name
   const [productE2name, setProductE2name] = useState([]);
   const [showModalE2name, setShowModalE2name] = useState(false);
   const [selectedItemIndexE2name, setSelectedItemIndexE2name] = useState(null);
   const [loadingE2name, setLoadingE2name] = useState(true);
   const [errorE2name, setErrorE2name] = useState(null);
 
   const handleItemChangeE2name = (index, key, value) => {
     const updatedItems = [...E2name];
     // If the key is 'ahead', find the corresponding product and set the price
     if (key === "ahead") {
       const selectedProduct = productE2name.find(
         (product) => product.ahead === value
       );
       if (selectedProduct) {
         updatedItems[index]["E2Code"] = selectedProduct.acode;
         updatedItems[index]["E2name"] = selectedProduct.ahead;
       }
     } else if (key === "discount") {
     }
     setE2name(updatedItems);
   };
 
   // const handleProductSelectE2name = (product) => {
   //   if (selectedItemIndexE2name !== null) {
   //     handleItemChangeE2name(selectedItemIndexE2name, "ahead", product.ahead);
   //     setShowModalE2name(false);
   //   }
   // };
   const handleProductSelectE2name = (product) => {
     if (!product) {
       alert("No account selected!");
       setShowModalE2name(false);
       return;
     }
     
     // Deep copy shipped array
     const updatedShipped = [...E2name];
   
     // Update the correct object in the array
     updatedShipped[selectedItemIndexE2name] = {
       ...updatedShipped[selectedItemIndexE2name],
       E2Code: product.acode || "",
       E2name: product.ahead || "",
       // Add any other mappings needed
     };
 
     const nameValue = product.ahead || product.name || "";
     if (selectedItemIndexE2name !== null) {
       handleItemChangeE2name(selectedItemIndexE2name, "ahead", nameValue);
     }
     setE2name(updatedShipped);       // <- update the array in state!
     setIsEditMode(true);
     setShowModalE2name(false);
   
   };
 
   const openModalForItemE2name = (index) => {
     if (isEditMode) {
       setSelectedItemIndexE2name(index);
       setShowModalE2name(true);
     }
   };
 
   const allFieldsE2name = productE2name.reduce((fields, product) => {
     Object.keys(product).forEach((key) => {
       if (!fields.includes(key)) {
         fields.push(key);
       }
     });
     return fields;
   }, []);
 
   // Modal For E3name
   const [productE3name, setProductE3name] = useState([]);
   const [showModalE3name, setShowModalE3name] = useState(false);
   const [selectedItemIndexE3name, setSelectedItemIndexE3name] = useState(null);
   const [loadingE3name, setLoadingE3name] = useState(true);
   const [errorE3name, setErrorE3name] = useState(null);
 
   const handleItemChangeE3name = (index, key, value) => {
     const updatedItems = [...E3name];
     if (key === "ahead") {
       const selectedProduct = productE3name.find(
         (product) => product.ahead === value
       );
       if (selectedProduct) {
         updatedItems[index]["E3Code"] = selectedProduct.acode;
         updatedItems[index]["E3name"] = selectedProduct.ahead;
       }
     } else if (key === "discount") {
     }
     setE3name(updatedItems);
   };
 
   // const handleProductSelectE3name = (product) => {
   //   if (selectedItemIndexE3name !== null) {
   //     handleItemChangeE3name(selectedItemIndexE3name, "ahead", product.ahead);
   //     setShowModalE3name(false);
   //   }
   // };
   const handleProductSelectE3name = (product) => {
     if (!product) {
       alert("No account selected!");
       setShowModalE3name(false);
       return;
     }
     
     // Deep copy shipped array
     const updatedShipped = [...E3name];
   
     // Update the correct object in the array
     updatedShipped[selectedItemIndexE3name] = {
       ...updatedShipped[selectedItemIndexE3name],
       E3Code: product.acode || "",
       E3name: product.ahead || "",
       // Add any other mappings needed
     };
 
     const nameValue = product.ahead || product.name || "";
     if (selectedItemIndexE3name !== null) {
       handleItemChangeE3name(selectedItemIndexE3name, "ahead", nameValue);
     }
     setE3name(updatedShipped);       // <- update the array in state!
     setIsEditMode(true);
     setShowModalE3name(false);
   
   };
 
   const openModalForItemE3name = (index) => {
     if (isEditMode) {
       setSelectedItemIndexE3name(index);
       setShowModalE3name(true);
     }
   };
 
   const allFieldsE3name = productE3name.reduce((fields, product) => {
     Object.keys(product).forEach((key) => {
       if (!fields.includes(key)) {
         fields.push(key);
       }
     });
     return fields;
   }, []);
 
   // Modal For E4name
   const [productE4name, setProductE4name] = useState([]);
   const [showModalE4name, setShowModalE4name] = useState(false);
   const [selectedItemIndexE4name, setSelectedItemIndexE4name] = useState(null);
   const [loadingE4name, setLoadingE4name] = useState(true);
   const [errorE4name, setErrorE4name] = useState(null);
 
   const handleItemChangeE4name = (index, key, value) => {
     const updatedItems = [...E4name];
     if (key === "ahead") {
       const selectedProduct = productE4name.find(
         (product) => product.ahead === value
       );
       if (selectedProduct) {
         updatedItems[index]["E4Code"] = selectedProduct.acode;
         updatedItems[index]["E4name"] = selectedProduct.ahead;
       }
     } else if (key === "discount") {
     }
     setE4name(updatedItems);
   };
 
   // const handleProductSelectE4name = (product) => {
   //   if (selectedItemIndexE4name !== null) {
   //     handleItemChangeE4name(selectedItemIndexE4name, "ahead", product.ahead);
   //     setShowModalE4name(false);
   //   }
   // };
     const handleProductSelectE4name = (product) => {
     if (!product) {
       alert("No account selected!");
       setShowModalE4name(false);
       return;
     }
     
     // Deep copy shipped array
     const updatedShipped = [...E4name];
   
     // Update the correct object in the array
     updatedShipped[selectedItemIndexE4name] = {
       ...updatedShipped[selectedItemIndexE4name],
       E4Code: product.acode || "",
       E4name: product.ahead || "",
       // Add any other mappings needed
     };
 
     const nameValue = product.ahead || product.name || "";
     if (selectedItemIndexE4name !== null) {
       handleItemChangeE4name(selectedItemIndexE4name, "ahead", nameValue);
     }
     setE4name(updatedShipped);       // <- update the array in state!
     setIsEditMode(true);
     setShowModalE4name(false);
   
   };
 
   const openModalForItemE4name = (index) => {
     if (isEditMode) {
       setSelectedItemIndexE4name(index);
       setShowModalE4name(true);
     }
   };
 
   const allFieldsE4name = productE4name.reduce((fields, product) => {
     Object.keys(product).forEach((key) => {
       if (!fields.includes(key)) {
         fields.push(key);
       }
     });
     return fields;
   }, []);
 
   // Modal For E5name
   const [productE5name, setProductE5name] = useState([]);
   const [showModalE5name, setShowModalE5name] = useState(false);
   const [selectedItemIndexE5name, setSelectedItemIndexE5name] = useState(null);
   const [loadingE5name, setLoadingE5name] = useState(true);
   const [errorE5name, setErrorE5name] = useState(null);
 
   const handleItemChangeE5name = (index, key, value) => {
     const updatedItems = [...E5name];
     if (key === "ahead") {
       const selectedProduct = productE5name.find(
         (product) => product.ahead === value
       );
       if (selectedProduct) {
         updatedItems[index]["E5Code"] = selectedProduct.acode;
         updatedItems[index]["E5name"] = selectedProduct.ahead;
       }
     } else if (key === "discount") {
     }
     setE5name(updatedItems);
   };
 
   // const handleProductSelectE5name = (product) => {
   //   if (selectedItemIndexE5name !== null) {
   //     handleItemChangeE5name(selectedItemIndexE5name, "ahead", product.ahead);
   //     setShowModalE5name(false);
   //   }
   // };
   const handleProductSelectE5name = (product) => {
     if (!product) {
       alert("No account selected!");
       setShowModalE5name(false);
       return;
     }
     
     // Deep copy shipped array
     const updatedShipped = [...E5name];
   
     // Update the correct object in the array
     updatedShipped[selectedItemIndexE5name] = {
       ...updatedShipped[selectedItemIndexE5name],
       E5Code: product.acode || "",
       E5name: product.ahead || "",
       // Add any other mappings needed
     };
 
     const nameValue = product.ahead || product.name || "";
     if (selectedItemIndexE5name !== null) {
       handleItemChangeE5name(selectedItemIndexE5name, "ahead", nameValue);
     }
     setE5name(updatedShipped);       // <- update the array in state!
     setIsEditMode(true);
     setShowModalE5name(false);
   
   };
 
   const openModalForItemE5name = (index) => {
     if (isEditMode) {
       setSelectedItemIndexE5name(index);
       setShowModalE5name(true);
     }
   };
 
   const allFieldsE5name = productE5name.reduce((fields, product) => {
     Object.keys(product).forEach((key) => {
       if (!fields.includes(key)) {
         fields.push(key);
       }
     });
     return fields;
   }, []);
 
   // Modal For E6name
   const [productE6name, setProductE6name] = useState([]);
   const [showModalE6name, setShowModalE6name] = useState(false);
   const [selectedItemIndexE6name, setSelectedItemIndexE6name] = useState(null);
   const [loadingE6name, setLoadingE6name] = useState(true);
   const [errorE6name, setErrorE6name] = useState(null);
 
   const handleItemChangeE6name = (index, key, value) => {
     const updatedItems = [...E6name];
     if (key === "ahead") {
       const selectedProduct = productE6name.find(
         (product) => product.ahead === value
       );
       if (selectedProduct) {
         updatedItems[index]["E6Code"] = selectedProduct.acode;
         updatedItems[index]["E6name"] = selectedProduct.ahead;
       }
     } else if (key === "discount") {
     }
     setE6name(updatedItems);
   };
 
   // const handleProductSelectE6name = (product) => {
   //   if (selectedItemIndexE6name !== null) {
   //     handleItemChangeE6name(selectedItemIndexE6name, "ahead", product.ahead);
   //     setShowModalE6name(false);
   //   }
   // };
 
   const handleProductSelectE6name = (product) => {
     if (!product) {
       alert("No account selected!");
       setShowModalE6name(false);
       return;
     }
     
     // Deep copy shipped array
     const updatedShipped = [...E6name];
   
     // Update the correct object in the array
     updatedShipped[selectedItemIndexE6name] = {
       ...updatedShipped[selectedItemIndexE6name],
       E6Code: product.acode || "",
       E6name: product.ahead || "",
       // Add any other mappings needed
     };
 
     const nameValue = product.ahead || product.name || "";
     if (selectedItemIndexE6name !== null) {
       handleItemChangeE6name(selectedItemIndexE6name, "ahead", nameValue);
     }
     setE6name(updatedShipped);       // <- update the array in state!
     setIsEditMode(true);
     setShowModalE6name(false);
   
   };
 
   const openModalForItemE6name = (index) => {
     if (isEditMode) {
       setSelectedItemIndexE6name(index);
       setShowModalE6name(true);
     }
   };
 
   const allFieldsE6name = productE6name.reduce((fields, product) => {
     Object.keys(product).forEach((key) => {
       if (!fields.includes(key)) {
         fields.push(key);
       }
     });
     return fields;
   }, []);
 
   // Modal For E7name
   const [productE7name, setProductE7name] = useState([]);
   const [showModalE7name, setShowModalE7name] = useState(false);
   const [selectedItemIndexE7name, setSelectedItemIndexE7name] = useState(null);
   const [loadingE7name, setLoadingE7name] = useState(true);
   const [errorE7name, setErrorE7name] = useState(null);
 
   const handleItemChangeE7name = (index, key, value) => {
     const updatedItems = [...E7name];
     if (key === "ahead") {
       const selectedProduct = productE7name.find(
         (product) => product.ahead === value
       );
       if (selectedProduct) {
         updatedItems[index]["E7Code"] = selectedProduct.acode;
         updatedItems[index]["E7name"] = selectedProduct.ahead;
       }
     } else if (key === "discount") {
     }
     setE7name(updatedItems);
   };
 
   // const handleProductSelectE7name = (product) => {
   //   if (selectedItemIndexE7name !== null) {
   //     handleItemChangeE7name(selectedItemIndexE7name, "ahead", product.ahead);
   //     setShowModalE7name(false);
   //   }
   // };
     const handleProductSelectE7name = (product) => {
     if (!product) {
       alert("No account selected!");
       setShowModalE7name(false);
       return;
     }
     
     // Deep copy shipped array
     const updatedShipped = [...E7name];
   
     // Update the correct object in the array
     updatedShipped[selectedItemIndexE7name] = {
       ...updatedShipped[selectedItemIndexE7name],
       E7Code: product.acode || "",
       E7name: product.ahead || "",
       // Add any other mappings needed
     };
 
     const nameValue = product.ahead || product.name || "";
     if (selectedItemIndexE7name !== null) {
       handleItemChangeE7name(selectedItemIndexE7name, "ahead", nameValue);
     }
     setE7name(updatedShipped);       // <- update the array in state!
     setIsEditMode(true);
     setShowModalE7name(false);
   
   };
 
   const openModalForItemE7name = (index) => {
     if (isEditMode) {
       setSelectedItemIndexE7name(index);
       setShowModalE7name(true);
     }
   };
 
   const allFieldsE7name = productE7name.reduce((fields, product) => {
     Object.keys(product).forEach((key) => {
       if (!fields.includes(key)) {
         fields.push(key);
       }
     });
     return fields;
   }, []);
 
   // Modal For E8name
   const [productE8name, setProductE8name] = useState([]);
   const [showModalE8name, setShowModalE8name] = useState(false);
   const [selectedItemIndexE8name, setSelectedItemIndexE8name] = useState(null);
   const [loadingE8name, setLoadingE8name] = useState(true);
   const [errorE8name, setErrorE8name] = useState(null);
 
   const handleItemChangeE8name = (index, key, value) => {
     const updatedItems = [...E8name];
     if (key === "ahead") {
       const selectedProduct = productE8name.find(
         (product) => product.ahead === value
       );
       if (selectedProduct) {
         updatedItems[index]["E8Code"] = selectedProduct.acode;
         updatedItems[index]["E8name"] = selectedProduct.ahead;
       }
     } else if (key === "discount") {
     }
     setE8name(updatedItems);
   };
 
   // const handleProductSelectE8name = (product) => {
   //   if (selectedItemIndexE8name !== null) {
   //     handleItemChangeE8name(selectedItemIndexE8name, "ahead", product.ahead);
   //     setShowModalE8name(false);
   //   }
   // };
     const handleProductSelectE8name = (product) => {
     if (!product) {
       alert("No account selected!");
       setShowModalE8name(false);
       return;
     }
     
     // Deep copy shipped array
     const updatedShipped = [...E8name];
   
     // Update the correct object in the array
     updatedShipped[selectedItemIndexE8name] = {
       ...updatedShipped[selectedItemIndexE8name],
       E8Code: product.acode || "",
       E8name: product.ahead || "",
       // Add any other mappings needed
     };
 
     const nameValue = product.ahead || product.name || "";
     if (selectedItemIndexE8name !== null) {
       handleItemChangeE8name(selectedItemIndexE8name, "ahead", nameValue);
     }
     setE8name(updatedShipped);       // <- update the array in state!
     setIsEditMode(true);
     setShowModalE8name(false);
   
   };
 
   const openModalForItemE8name = (index) => {
     if (isEditMode) {
       setSelectedItemIndexE8name(index);
       setShowModalE8name(true);
     }
   };
 
   const allFieldsE8name = productE8name.reduce((fields, product) => {
     Object.keys(product).forEach((key) => {
       if (!fields.includes(key)) {
         fields.push(key);
       }
     });
     return fields;
   }, []);
 
   // Modal For E9name
   const [productE9name, setProductE9name] = useState([]);
   const [showModalE9name, setShowModalE9name] = useState(false);
   const [selectedItemIndexE9name, setSelectedItemIndexE9name] = useState(null);
   const [loadingE9name, setLoadingE9name] = useState(true);
   const [errorE9name, setErrorE9name] = useState(null);
 
   const handleItemChangeE9name = (index, key, value) => {
     const updatedItems = [...E9name];
     if (key === "ahead") {
       const selectedProduct = productE9name.find(
         (product) => product.ahead === value
       );
       if (selectedProduct) {
         updatedItems[index]["E9Code"] = selectedProduct.acode;
         updatedItems[index]["E9name"] = selectedProduct.ahead;
       }
     } else if (key === "discount") {
     }
     setE9name(updatedItems);
   };
 
   // const handleProductSelectE9name = (product) => {
   //   if (selectedItemIndexE9name !== null) {
   //     handleItemChangeE9name(selectedItemIndexE9name, "ahead", product.ahead);
   //     setShowModalE9name(false);
   //   }
   // };
     const handleProductSelectE9name = (product) => {
     if (!product) {
       alert("No account selected!");
       setShowModalE9name(false);
       return;
     }
     
     // Deep copy shipped array
     const updatedShipped = [...E9name];
   
     // Update the correct object in the array
     updatedShipped[selectedItemIndexE9name] = {
       ...updatedShipped[selectedItemIndexE9name],
       E9Code: product.acode || "",
       E9name: product.ahead || "",
       // Add any other mappings needed
     };
 
     const nameValue = product.ahead || product.name || "";
     if (selectedItemIndexE9name !== null) {
       handleItemChangeE9name(selectedItemIndexE9name, "ahead", nameValue);
     }
     setE9name(updatedShipped);       // <- update the array in state!
     setIsEditMode(true);
     setShowModalE9name(false);
   
   };
 
   const openModalForItemE9name = (index) => {
     if (isEditMode) {
       setSelectedItemIndexE9name(index);
       setShowModalE9name(true);
     }
   };
 
   const allFieldsE9name = productE9name.reduce((fields, product) => {
     Object.keys(product).forEach((key) => {
       if (!fields.includes(key)) {
         fields.push(key);
       }
     });
     return fields;
   }, []);
 
   // Modal For E10name
   const [productE10name, setProductE10name] = useState([]);
   const [showModalE10name, setShowModalE10name] = useState(false);
   const [selectedItemIndexE10name, setSelectedItemIndexE10name] =
     useState(null);
   const [loadingE10name, setLoadingE10name] = useState(true);
   const [errorE10name, setErrorE10name] = useState(null);
 
   const handleItemChangeE10name = (index, key, value) => {
     const updatedItems = [...E10name];
     if (key === "ahead") {
       const selectedProduct = productE10name.find(
         (product) => product.ahead === value
       );
       if (selectedProduct) {
         updatedItems[index]["E10Code"] = selectedProduct.acode;
         updatedItems[index]["E10name"] = selectedProduct.ahead;
       }
     } else if (key === "discount") {
     }
     setE10name(updatedItems);
   };
 
   // const handleProductSelectE10name = (product) => {
   //   if (selectedItemIndexE10name !== null) {
   //     handleItemChangeE10name(selectedItemIndexE10name, "ahead", product.ahead);
   //     setShowModalE10name(false);
   //   }
   // };
     const handleProductSelectE10name = (product) => {
     if (!product) {
       alert("No account selected!");
       setShowModalE10name(false);
       return;
     }
     
     // Deep copy shipped array
     const updatedShipped = [...E10name];
   
     // Update the correct object in the array
     updatedShipped[selectedItemIndexE10name] = {
       ...updatedShipped[selectedItemIndexE10name],
       E10Code: product.acode || "",
       E10name: product.ahead || "",
       // Add any other mappings needed
     };
 
     const nameValue = product.ahead || product.name || "";
     if (selectedItemIndexE10name !== null) {
       handleItemChangeE10name(selectedItemIndexE10name, "ahead", nameValue);
     }
     setE10name(updatedShipped);       // <- update the array in state!
     setIsEditMode(true);
     setShowModalE10name(false);
   
   };
 
   const openModalForItemE10name = (index) => {
     if (isEditMode) {
       setSelectedItemIndexE10name(index);
       setShowModalE10name(true);
     }
   };
 
   const allFieldsE10name = productE10name.reduce((fields, product) => {
     Object.keys(product).forEach((key) => {
       if (!fields.includes(key)) {
         fields.push(key);
       }
     });
     return fields;
   }, []);

  const handleOpenModal = (event, index, field) => {
    if (/^[a-zA-Z]$/.test(event.key)) {
      if (field === "cgstcode" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemAcc(index);
        event.preventDefault();
      } else if (field === "cgstcode1" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemcgst1(index);
        event.preventDefault();
      } else if (field === "cgstcode2" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemcgst2(index);
        event.preventDefault();
      } else if (field === "sgstcode" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemsgst(index);
        event.preventDefault();
      } else if (field === "sgstcode1" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemsgst1(index);
        event.preventDefault();
      } else if (field === "sgstcode2" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemsgst2(index);
        event.preventDefault();
      } else if (field === "igstcode" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemigst(index);
        event.preventDefault();
      } else if (field === "igstcode1" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemigst1(index);
        event.preventDefault();
      } else if (field === "igstcode2" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemigst2(index);
        event.preventDefault();
      } else if (field === "Adcode" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemAdcode(index);
        event.preventDefault();
      } else if (field === "cesscode" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemCus(index);
        event.preventDefault();
      } else if (field === "tcscode" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemtcs(index);
        event.preventDefault();
      } else if (field === "tcs206code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemtcs206(index);
        event.preventDefault();
      } else if (field === "discountcode" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemDis(index);
        event.preventDefault();
      }else if (field === "cTds_code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemcTds(index);
        event.preventDefault();
      }  
      else if (field === "sTds_code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemsTds(index);
        event.preventDefault();
      }  
      else if (field === "iTds_code" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemiTds(index);
        event.preventDefault();
      }  
      
      else if (field === "E1name" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemE1name(index);
        event.preventDefault();
      } else if (field === "E2name" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemE2name(index);
        event.preventDefault();
      } else if (field === "E3name" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemE3name(index);
        event.preventDefault();
      } else if (field === "E4name" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemE4name(index);
        event.preventDefault();
      } else if (field === "E5name" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemE5name(index);
        event.preventDefault();
      } else if (field === "E6name" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemE6name(index);
        event.preventDefault();
      } else if (field === "E7name" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemE7name(index);
        event.preventDefault();
      } else if (field === "E8name" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemE8name(index);
        event.preventDefault();
      } else if (field === "E9name" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemE9name(index);
        event.preventDefault();
      } else if (field === "E10name" && isEditMode) {
        setPressedKey(event.key);
        openModalForItemE10name(index);
        event.preventDefault();
      }
    }
  };

  const handleTcsonTax = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      Tcsontax: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleTaxType = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      stype: value, // Update the ratecalculate field in FormData
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
  const handleRoundoff = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      T11: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleTround = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      T12: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleDisplayitem = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      T13: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleDefbutton = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      T14: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleLowsale = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      T15: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleTDS194 = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      T16: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleTDSoption = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      T19: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleZerovalue = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      T20: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleDisplayHSN = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      T18: value, // Update the ratecalculate field in FormData
    }));
  };
  const handleCdwindow = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      T10: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value === "") {
      setFormData({ ...formData, [name]: "" });
    } else if (value === "+") {
      setFormData({ ...formData, [name]: "+Ve" });
    } else if (value === "-") {
      setFormData({ ...formData, [name]: "-Ve" });
    }
  };

  const handleKeyDown = (e) => {
    const { name, value } = e.target;
    if (e.key === "Backspace" && (value === "+Ve" || value === "-Ve")) {
      setFormData({ ...formData, [name]: "" });
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleInputChange2 = (e, field) => {
    const value = e.target.value.toUpperCase();
    if (value === "T") {
      setFormData((prev) => ({ ...prev, [field]: true }));
    } else if (value === "F") {
      setFormData((prev) => ({ ...prev, [field]: false }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: "" }));
    }
  };
  const handleInputChangeCapital = (event) => {
    const { id, value } = event.target;
    const uppercaseValue = value.toUpperCase(); // Convert input to uppercase

    // Allow only capital alphabets
    if (/^[A-Z]*$/.test(uppercaseValue)) {
      setFormData((prevData) => ({
        ...prevData,
        [id]: uppercaseValue,
      }));
    }
  };
  // Header section with logo and title
  const headerSection = (
    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Typography
        variant="h4"
        sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold", ml: 2 }}
      >
        PURCHASE SETUP
      </Typography>
    </Box>
  );

  const steps = ["Select Accounts", "Other Options", "Additional Settings"];

  // Modern TextField style (smaller height & reduced margin)
  const textFieldStyleTax = {
    mb: 1,
    "& .MuiOutlinedInput-root": {
      height: 40,
      width: 150,
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
  const textFieldStyle = {
    mb: 1,
    "& .MuiOutlinedInput-root": {
      height: 40,
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
  const textFieldStyle2 = {
    mb: 1,
    "& .MuiOutlinedInput-root": {
      height: 40,
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
  const textFieldStyle3 = {
    mb: 1,
    "& .MuiOutlinedInput-root": {
      height: 40,
      width: 150,
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
  const textFieldStyle4 = {
    mb: 1,
    "& .MuiOutlinedInput-root": {
      height: 40,
      width: 90,
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
          <Grid container spacing={2}>
            {/* Left Column - Expense Accounts */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "5%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  marginLeft: "65%",
                  marginTop: 15,
                }}
              >
                <text>+/-</text>
                <text style={{ marginLeft: "20%" }}>Calculations</text>
                <text style={{ marginLeft: "10%" }}>RATE</text>
              </div>
              <div style={{ marginLeft: "1%" }}>
                {E1name.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        id="Exp1"
                        value={formData.Exp1}
                        onChange={handleInputChange}
                        sx={textFieldStyle2}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        className="Labour"
                        //label="SELECT ACCOUNT"
                        readOnly
                        style={{ width: 220 }}
                        value={item.E1Code || ""}
                        onChange={(e) => {
                          const newE1code = [...E1name];
                          newE1code[index].E1Code = e.target.value;
                          setE1name(newE1code);
                        }}
                        sx={textFieldStyle3}
                        onKeyDown={(e) => handleOpenModal(e, index, "E1name")}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      {/* <Button style={{height:40,marginLeft:"-9.2%",marginRight:2}} onClick={() => openModalForItemE1name(index)} >..</Button> */}
                      <TextField
                        name="E1add"
                        //label="+/-"
                        value={formData.E1add}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        id="E1"
                        value={formData.E1}
                        onChange={handleInputChangeCapital}
                        sx={textFieldStyle4}
                        inputProps={{
                          readOnly: !isEditMode || isDisabled,
                          maxLength: 1,
                        }}
                      />
                      <TextField
                        name="E1rate"
                        //label="RATE"
                        value={formData.E1rate}
                        onChange={handleNumberChange}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                    </div>
                  </div>
                ))}
                {showModalE1name && (
                  <ProductModalAccount
                    allFields={allFieldsE1name}
                    onSelect={handleProductSelectE1name}
                    onClose={() => setShowModalAcc(false)} 
                    initialKey={pressedKey}
                    tenant={tenant}
                    onRefresh={fetchCustomers}
                  />
                )}
              </div>
              <div style={{ marginLeft: "1%" }}>
                {E2name.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        id="Exp2"
                        //  className="Exp1"
                        value={formData.Exp2}
                        onChange={handleInputChange}
                        sx={textFieldStyle2}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        className="Labour"
                        //label="SELECT ACCOUNT"
                        readOnly
                        style={{ width: 220 }}
                        value={item.E2Code || ""}
                        onChange={(e) => {
                          const newE1code = [...E2name];
                          newE1code[index].E2Code = e.target.value;
                          setE2name(newE1code);
                        }}
                        sx={textFieldStyle3}
                        onKeyDown={(e) => handleOpenModal(e, index, "E2name")}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      {/* <Button style={{height:40,marginLeft:"-9.2%",marginRight:2}} onClick={() => openModalForItemE2name(index)} >..</Button> */}
                      <TextField
                        name="E2add"
                        //label="+/-"
                        value={formData.E2add}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        id="E2"
                        value={formData.E2}
                        onChange={handleInputChangeCapital}
                        sx={textFieldStyle4}
                        inputProps={{
                          readOnly: !isEditMode || isDisabled,
                          maxLength: 1,
                        }}
                      />
                      <TextField
                        name="E2rate"
                        //label="RATE"
                        value={formData.E2rate}
                        onChange={handleNumberChange}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                    </div>
                  </div>
                ))}
                {showModalE2name && (
                  <ProductModalAccount
                    allFields={allFieldsE2name}
                    onSelect={handleProductSelectE2name}
                    onClose={() => setShowModalE2name(false)} 
                    initialKey={pressedKey}
                    tenant={tenant}
                    onRefresh={fetchCustomers}
                  />
                )}
              </div>
              <div style={{ marginLeft: "1%" }}>
                {E3name.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        id="Exp3"
                        //  className="Exp1"
                        value={formData.Exp3}
                        onChange={handleInputChange}
                        sx={textFieldStyle2}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        className="Labour"
                        //label="SELECT ACCOUNT"
                        readOnly
                        style={{ width: 220 }}
                        value={item.E3Code || ""}
                        onChange={(e) => {
                          const newE1code = [...E3name];
                          newE1code[index].E3Code = e.target.value;
                          setE3name(newE1code);
                        }}
                        sx={textFieldStyle3}
                        onKeyDown={(e) => handleOpenModal(e, index, "E3name")}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      {/* <Button style={{height:40,marginLeft:"-9.2%",marginRight:2}} onClick={() => openModalForItemE3name(index)} >..</Button> */}
                      <TextField
                        name="E3add"
                        //label="+/-"
                        value={formData.E3add}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        id="E3"
                        value={formData.E3}
                        onChange={handleInputChangeCapital}
                        sx={textFieldStyle4}
                        inputProps={{
                          readOnly: !isEditMode || isDisabled,
                          maxLength: 1,
                        }}
                      />
                      <TextField
                        name="E3rate"
                        //label="RATE"
                        value={formData.E3rate}
                        onChange={handleNumberChange}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                    </div>
                  </div>
                ))}
                {showModalE3name && (
                  <ProductModalAccount
                    allFields={allFieldsE3name}
                    onSelect={handleProductSelectE3name}
                    onClose={() => setShowModalE3name(false)} 
                    initialKey={pressedKey}
                    tenant={tenant}
                    onRefresh={fetchCustomers}
                  />
                )}
              </div>
              <div style={{ marginLeft: "1%" }}>
                {E4name.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        id="Exp4"
                        //  className="Exp1"
                        value={formData.Exp4}
                        onChange={handleInputChange}
                        sx={textFieldStyle2}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        className="Labour"
                        //label="SELECT ACCOUNT"
                        readOnly
                        style={{ width: 220 }}
                        value={item.E4Code || ""}
                        onChange={(e) => {
                          const newE1code = [...E4name];
                          newE1code[index].E4Code = e.target.value;
                          setE4name(newE1code);
                        }}
                        sx={textFieldStyle3}
                        onKeyDown={(e) => handleOpenModal(e, index, "E4name")}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      {/* <Button style={{height:40,marginLeft:"-9.2%",marginRight:2}} onClick={() => openModalForItemE4name(index)} >..</Button> */}
                      <TextField
                        name="E4add"
                        //label="+/-"
                        value={formData.E4add}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        id="E4"
                        value={formData.E4}
                        onChange={handleInputChangeCapital}
                        sx={textFieldStyle4}
                        inputProps={{
                          readOnly: !isEditMode || isDisabled,
                          maxLength: 1,
                        }}
                      />
                      <TextField
                        name="E4rate"
                        //label="RATE"
                        value={formData.E4rate}
                        onChange={handleNumberChange}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                    </div>
                  </div>
                ))}
                {showModalE4name && (
                  <ProductModalAccount
                    allFields={allFieldsE4name}
                    onSelect={handleProductSelectE4name}
                    onClose={() => setShowModalE4name(false)} 
                    initialKey={pressedKey}
                    tenant={tenant}
                    onRefresh={fetchCustomers}
                  />
                )}
              </div>
              <div style={{ marginLeft: "1%" }}>
                {E5name.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        id="Exp5"
                        //  className="Exp1"
                        value={formData.Exp5}
                        onChange={handleInputChange}
                        sx={textFieldStyle2}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        className="Labour"
                        //label="SELECT ACCOUNT"
                        readOnly
                        style={{ width: 220 }}
                        value={item.E5Code || ""}
                        onChange={(e) => {
                          const newE1code = [...E5name];
                          newE1code[index].E5Code = e.target.value;
                          setE5name(newE1code);
                        }}
                        sx={textFieldStyle3}
                        onKeyDown={(e) => handleOpenModal(e, index, "E5name")}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      {/* <Button style={{height:40,marginLeft:"-9.2%",marginRight:2}} onClick={() => openModalForItemE5name(index)} >..</Button> */}
                      <TextField
                        name="E5add"
                        //label="+/-"
                        value={formData.E5add}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        id="E5"
                        value={formData.E5}
                        onChange={handleInputChangeCapital}
                        sx={textFieldStyle4}
                        inputProps={{
                          readOnly: !isEditMode || isDisabled,
                          maxLength: 1,
                        }}
                      />
                      <TextField
                        name="E5rate"
                        //label="RATE"
                        value={formData.E5rate}
                        onChange={handleNumberChange}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                    </div>
                  </div>
                ))}
                {showModalE5name && (
                  <ProductModalAccount
                    allFields={allFieldsE5name}
                    onSelect={handleProductSelectE5name}
                    onClose={() => setShowModalE5name(false)} 
                    initialKey={pressedKey}
                    tenant={tenant}
                    onRefresh={fetchCustomers}
                  />
                )}
              </div>
              <div style={{ marginLeft: "1%" }}>
                {E6name.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        id="Exp6"
                        //  className="Exp1"
                        value={formData.Exp6}
                        onChange={handleInputChange}
                        sx={textFieldStyle2}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        className="Labour"
                        //label="SELECT ACCOUNT"
                        readOnly
                        style={{ width: 220 }}
                        value={item.E6Code || ""}
                        onChange={(e) => {
                          const newE1code = [...E6name];
                          newE1code[index].E6Code = e.target.value;
                          setE6name(newE1code);
                        }}
                        sx={textFieldStyle3}
                        onKeyDown={(e) => handleOpenModal(e, index, "E6name")}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      {/* <Button style={{height:40,marginLeft:"-9.2%",marginRight:2}} onClick={() => openModalForItemE6name(index)} >..</Button> */}
                      <TextField
                        name="E6add"
                        //label="+/-"
                        value={formData.E6add}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        id="E6"
                        value={formData.E6}
                        onChange={handleInputChangeCapital}
                        sx={textFieldStyle4}
                        inputProps={{
                          readOnly: !isEditMode || isDisabled,
                          maxLength: 1,
                        }}
                      />
                      <TextField
                        name="E6rate"
                        //label="RATE"
                        value={formData.E6rate}
                        onChange={handleNumberChange}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                    </div>
                  </div>
                ))}
                {showModalE6name && (
                  <ProductModalAccount
                    allFields={allFieldsE6name}
                    onSelect={handleProductSelectE6name}
                    onClose={() => setShowModalE6name(false)} 
                    initialKey={pressedKey}
                    tenant={tenant}
                    onRefresh={fetchCustomers}
                  />
                )}
              </div>
              <div style={{ marginLeft: "1%" }}>
                {E7name.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        id="Exp7"
                        //  className="Exp1"
                        value={formData.Exp7}
                        onChange={handleInputChange}
                        sx={textFieldStyle2}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        className="Labour"
                        //label="SELECT ACCOUNT"
                        readOnly
                        style={{ width: 220 }}
                        value={item.E7Code || ""}
                        onChange={(e) => {
                          const newE1code = [...E7name];
                          newE1code[index].E7Code = e.target.value;
                          setE7name(newE1code);
                        }}
                        sx={textFieldStyle3}
                        onKeyDown={(e) => handleOpenModal(e, index, "E7name")}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      {/* <Button style={{height:40,marginLeft:"-9.2%",marginRight:2}} onClick={() => openModalForItemE7name(index)} >..</Button> */}
                      <TextField
                        name="E7add"
                        //label="+/-"
                        value={formData.E7add}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        id="E7"
                        value={formData.E7}
                        onChange={handleInputChangeCapital}
                        sx={textFieldStyle4}
                        inputProps={{
                          readOnly: !isEditMode || isDisabled,
                          maxLength: 1,
                        }}
                      />
                      <TextField
                        name="E7rate"
                        //label="RATE"
                        value={formData.E7rate}
                        onChange={handleNumberChange}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                    </div>
                  </div>
                ))}
                {showModalE7name && (
                  <ProductModalAccount
                    allFields={allFieldsE7name}
                    onSelect={handleProductSelectE7name}
                    onClose={() => setShowModalE7name(false)} 
                    initialKey={pressedKey}
                    tenant={tenant}
                    onRefresh={fetchCustomers}
                  />
                )}
              </div>
              <div style={{ marginLeft: "1%" }}>
                {E8name.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        id="Exp8"
                        //  className="Exp1"
                        value={formData.Exp8}
                        onChange={handleInputChange}
                        sx={textFieldStyle2}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        className="Labour"
                        //label="SELECT ACCOUNT"
                        readOnly
                        style={{ width: 220 }}
                        value={item.E8Code || ""}
                        onChange={(e) => {
                          const newE1code = [...E8name];
                          newE1code[index].E8Code = e.target.value;
                          setE8name(newE1code);
                        }}
                        sx={textFieldStyle3}
                        onKeyDown={(e) => handleOpenModal(e, index, "E8name")}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      {/* <Button style={{height:40,marginLeft:"-9.2%",marginRight:2}} onClick={() => openModalForItemE8name(index)} >..</Button> */}
                      <TextField
                        name="E8add"
                        //label="+/-"
                        value={formData.E8add}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        id="E8"
                        value={formData.E8}
                        onChange={handleInputChangeCapital}
                        sx={textFieldStyle4}
                        inputProps={{
                          readOnly: !isEditMode || isDisabled,
                          maxLength: 1,
                        }}
                      />
                      <TextField
                        //label="RATE"
                        name="E8rate"
                        value={formData.E8rate}
                        onChange={handleNumberChange}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                    </div>
                  </div>
                ))}
                {showModalE8name && (
                  <ProductModalAccount
                    allFields={allFieldsE8name}
                    onSelect={handleProductSelectE8name}
                    onClose={() => setShowModalE8name(false)} 
                    initialKey={pressedKey}
                    tenant={tenant}
                    onRefresh={fetchCustomers}
                  />
                )}
              </div>
              <div style={{ marginLeft: "1%" }}>
                {E9name.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        id="Exp9"
                        //  className="Exp1"
                        value={formData.Exp9}
                        onChange={handleInputChange}
                        sx={textFieldStyle2}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        className="Labour"
                        //label="SELECT ACCOUNT"
                        readOnly
                        style={{ width: 220 }}
                        value={item.E9Code || ""}
                        onChange={(e) => {
                          const newE1code = [...E9name];
                          newE1code[index].E9Code = e.target.value;
                          setE9name(newE1code);
                        }}
                        sx={textFieldStyle3}
                        onKeyDown={(e) => handleOpenModal(e, index, "E9name")}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      {/* <Button style={{height:40,marginLeft:"-9.2%",marginRight:2}} onClick={() => openModalForItemE9name(index)} >..</Button> */}
                      <TextField
                        name="E9add"
                        //label="+/-"
                        value={formData.E9add}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        id="E9"
                        value={formData.E9}
                        onChange={handleInputChangeCapital}
                        sx={textFieldStyle4}
                        inputProps={{
                          readOnly: !isEditMode || isDisabled,
                          maxLength: 1,
                        }}
                      />
                      <TextField
                        //label="RATE"
                        name="E9rate"
                        value={formData.E9rate}
                        onChange={handleNumberChange}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                    </div>
                  </div>
                ))}
                {showModalE9name && (
                  <ProductModalAccount
                    allFields={allFieldsE9name}
                    onSelect={handleProductSelectE9name}
                    onClose={() => setShowModalE9name(false)} 
                    initialKey={pressedKey}
                    tenant={tenant}
                    onRefresh={fetchCustomers}
                  />
                )}
              </div>
              <div style={{ marginLeft: "1%" }}>
                {E10name.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <TextField
                        id="Exp10"
                        //  className="Exp1"
                        value={formData.Exp10}
                        onChange={handleInputChange}
                        sx={textFieldStyle2}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        //label="SELECT ACCOUNT"
                        className="Labour"
                        readOnly
                        style={{ width: 220 }}
                        value={item.E10Code || ""}
                        onChange={(e) => {
                          const newE1code = [...E10name];
                          newE1code[index].E10Code = e.target.value;
                          setE10name(newE1code);
                        }}
                        sx={textFieldStyle3}
                        onKeyDown={(e) => handleOpenModal(e, index, "E10name")}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      {/* <Button style={{height:40,marginLeft:"-9.2%",marginRight:2}} onClick={() => openModalForItemE10name(index)} >..</Button> */}
                      <TextField
                        name="E10add"
                        //label="+/-"
                        value={formData.E10add}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                      <TextField
                        id="E10"
                        value={formData.E10}
                        onChange={handleInputChangeCapital}
                        sx={textFieldStyle4}
                        inputProps={{
                          readOnly: !isEditMode || isDisabled,
                          maxLength: 1,
                        }}
                      />
                      <TextField
                        //label="RATE"
                        name="E10rate"
                        value={formData.E10rate}
                        onChange={handleNumberChange}
                        sx={textFieldStyle4}
                        InputProps={{ readOnly: !isEditMode || isDisabled }}
                      />
                    </div>
                  </div>
                ))}
                {showModalE10name && (
                  <ProductModalAccount
                    allFields={allFieldsE10name}
                    onSelect={handleProductSelectE10name}
                    onClose={() => setShowModalE10name(false)} 
                    initialKey={pressedKey}
                    tenant={tenant}
                    onRefresh={fetchCustomers}
                  />
                )}
              </div>
            </div>
            {/* Right Column - Tax Codes */}
            <Grid item xs={12} md={5}>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <text style={{ marginLeft: "18%" }}>REGD. DEALER</text>
                <text style={{ marginLeft: "16%" }}>UN-REGD. DEALER</text>
              </div>
              {/* Row 1: CGST */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {cgstcode.map((item, index) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: 20,
                    }}
                    key={`cgstcode-${index}`}
                  >
                    <text
                      style={{ color: "red", marginTop: 5, marginRight: 10 }}
                    >
                      C.GSTA/C:
                    </text>
                    <TextField
                      label="ITC(DR)"
                      fullWidth
                      size="small"
                      sx={textFieldStyleTax}
                      value={item.cgst_code || ""}
                      onChange={(e) => {
                        const newCode = [...cgstcode];
                        newCode[index].cgst_code = e.target.value;
                        setcgstcode(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "cgstcode")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
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
                  </div>
                ))}
                {cgstcode1.map((item, index) => (
                  <div item xs={4} key={`cgstcode1-${index}`}>
                    <TextField
                      label="ITC REVERSE(CR)"
                      fullWidth
                      size="small"
                      sx={textFieldStyleTax}
                      value={item.cgst_code1 || ""}
                      onChange={(e) => {
                        const newCode = [...cgstcode1];
                        newCode[index].cgst_code1 = e.target.value;
                        setcgstcode1(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "cgstcode1")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModalcgst1 && (
                      <ProductModalAccount
                        allFields={allFieldcgst1}
                        onSelect={handleProductSelectcgst1}
                        onClose={() => setShowModalcgst1(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </div>
                ))}
                {cgstcode2.map((item, index) => (
                  <div item xs={4} key={`cgstcode2-${index}`}>
                    <TextField
                      label="ITC REVERSE(DR)"
                      fullWidth
                      size="small"
                      sx={textFieldStyleTax}
                      value={item.cgst_code2 || ""}
                      onChange={(e) => {
                        const newCode = [...cgstcode2];
                        newCode[index].cgst_code2 = e.target.value;
                        setcgstcode2(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "cgstcode2")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModalcgst2 && (
                      <ProductModalAccount
                        allFields={allFieldcgst2}
                        onSelect={handleProductSelectcgst2}
                        onClose={() => setShowModalcgst2(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </div>
                ))}
              </Grid>
              {/* Row 2: SGST */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {sgstcode.map((item, index) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: 20,
                    }}
                    key={`sgstcode-${index}`}
                  >
                    <text
                      style={{ color: "red", marginTop: 5, marginRight: 10 }}
                    >
                      S.GSTA/C:
                    </text>
                    <TextField
                      label="ITC(DR)"
                      fullWidth
                      size="small"
                      sx={textFieldStyleTax}
                      value={item.sgst_code || ""}
                      onChange={(e) => {
                        const newCode = [...sgstcode];
                        newCode[index].sgst_code = e.target.value;
                        setsgstcode(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "sgstcode")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModalsgst && (
                      <ProductModalAccount
                        allFields={allFieldsgst}
                        onSelect={handleProductSelectsgst}
                        onClose={() => setShowModalsgst(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </div>
                ))}
                {sgstcode1.map((item, index) => (
                  <div item xs={4} key={`sgstcode1-${index}`}>
                    <TextField
                      label="ITC REVERSE(CR)"
                      fullWidth
                      size="small"
                      sx={textFieldStyleTax}
                      value={item.sgst_code1 || ""}
                      onChange={(e) => {
                        const newCode = [...sgstcode1];
                        newCode[index].sgst_code1 = e.target.value;
                        setsgstcode1(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "sgstcode1")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModalsgst1 && (
                      <ProductModalAccount
                        allFields={allFieldsgst1}
                        onSelect={handleProductSelectsgst1}
                        onClose={() => setShowModalsgst1(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </div>
                ))}
                {sgstcode2.map((item, index) => (
                  <div item xs={4} key={`sgstcode2-${index}`}>
                    <TextField
                      label="ITC REVERSE(DR)"
                      fullWidth
                      size="small"
                      sx={textFieldStyleTax}
                      value={item.sgst_code2 || ""}
                      onChange={(e) => {
                        const newCode = [...sgstcode2];
                        newCode[index].sgst_code2 = e.target.value;
                        setsgstcode2(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "sgstcode2")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModalsgst2 && (
                      <ProductModalAccount
                        allFields={allFieldsgst2}
                        onSelect={handleProductSelectsgst2}
                        onClose={() => setShowModalsgst2(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </div>
                ))}
              </Grid>
              {/* Row 3 : IGST */}
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {igstcode.map((item, index) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: 20,
                    }}
                    key={`igstcode-${index}`}
                  >
                    <text
                      style={{ color: "red", marginTop: 5, marginRight: 12 }}
                    >
                      I.GSTA/C:
                    </text>
                    <TextField
                      label="ITC(DR)"
                      fullWidth
                      size="small"
                      sx={textFieldStyleTax}
                      value={item.igst_code || ""}
                      onChange={(e) => {
                        const newCode = [...igstcode];
                        newCode[index].igst_code = e.target.value;
                        setigstcode(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "igstcode")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModaligst && (
                      <ProductModalAccount
                        allFields={allFieldsigst}
                        onSelect={handleProductSelectigst}
                        onClose={() => setShowModaligst(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </div>
                ))}
                {igstcode1.map((item, index) => (
                  <div item xs={4} key={`igstcode1-${index}`}>
                    <TextField
                      label="ITC REVERSE(CR)"
                      fullWidth
                      size="small"
                      sx={textFieldStyleTax}
                      value={item.igst_code1 || ""}
                      onChange={(e) => {
                        const newCode = [...igstcode1];
                        newCode[index].igst_code1 = e.target.value;
                        setigstcode1(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "igstcode1")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModaligst1 && (
                      <ProductModalAccount
                        allFields={allFieldsigst1}
                        onSelect={handleProductSelectigst1}
                        onClose={() => setShowModaligst1(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </div>
                ))}
                {igstcode2.map((item, index) => (
                  <div item xs={4} key={`igstcode2-${index}`}>
                    <TextField
                      label="ITC REVERSE(DR)"
                      fullWidth
                      size="small"
                      sx={textFieldStyleTax}
                      value={item.igst_code2 || ""}
                      onChange={(e) => {
                        const newCode = [...igstcode2];
                        newCode[index].igst_code2 = e.target.value;
                        setigstcode2(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "igstcode2")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModaligst2 && (
                      <ProductModalAccount
                        allFields={allFieldsigst2}
                        onSelect={handleProductSelectigst2}
                        onClose={() => setShowModaligst2(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </div>
                ))}
              </Grid>
              {/* TDS */}
              <Grid container spacing={2} mt={1}>
                {cTds.map((item, index) => (
                  <Grid item xs={4} key={`cTds-${index}`}>
                    <TextField
                      label="TDS CGST"
                      fullWidth
                      size="small"
                      sx={textFieldStyle}
                      value={item.cTds_code || ""}
                      onChange={(e) => {
                        const newCode = [...cTds];
                        newCode[index].cTds_code = e.target.value;
                        setcTds(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "cTds_code")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModalcTds && (
                      <ProductModalAccount
                        allFields={allFieldscTds}
                        onSelect={handleProductSelectcTds}
                        onClose={() => setShowModalcTds(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </Grid>
                ))}
                {sTds.map((item, index) => (
                  <Grid item xs={4} key={`sTds-${index}`}>
                    <TextField
                      label="TDS SGST"
                      fullWidth
                      size="small"
                      sx={textFieldStyle}
                      value={item.sTds_code || ""}
                      onChange={(e) => {
                        const newCode = [...sTds];
                        newCode[index].sTds_code = e.target.value;
                        setsTds(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "sTds_code")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModalsTds && (
                      <ProductModalAccount
                        allFields={allFieldssTds}
                        onSelect={handleProductSelectsTds}
                        onClose={() => setShowModalsTds(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </Grid>
                ))}
                {iTds.map((item, index) => (
                  <Grid item xs={4} key={`iTds-${index}`}>
                    <TextField
                      label="TDS IGST"
                      fullWidth
                      size="small"
                      sx={textFieldStyle}
                      value={item.iTds_code || ""}
                      onChange={(e) => {
                        const newCode = [...iTds];
                        newCode[index].iTds_code = e.target.value;
                        setiTds(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "iTds_code")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModaliTds && (
                      <ProductModalAccount
                        allFields={allFieldsiTds}
                        onSelect={handleProductSelectiTds}
                        onClose={() => setShowModaliTds(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
              {/* Row 4: ADcode & CessCode */}
              <Grid container spacing={2} mt={1}>
                {Adcode.map((item, index) => (
                  <Grid item xs={4} key={`Adcode-${index}`}>
                    <TextField
                      label="PUR.IMP GST"
                      fullWidth
                      size="small"
                      sx={textFieldStyle}
                      value={item.Adcode || ""}
                      onChange={(e) => {
                        const newCode = [...Adcode];
                        newCode[index].Adcode = e.target.value;
                        setAdcode(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "Adcode")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModalAdcode && (
                      <ProductModalAccount
                        allFields={allFieldsAdcode}
                        onSelect={handleProductSelectAdcode}
                        onClose={() => setShowModalAdcode(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </Grid>
                ))}
                {cesscode.map((item, index) => (
                  <Grid item xs={4} key={`cesscode-${index}`}>
                    <TextField
                      label="CESS CODE"
                      fullWidth
                      size="small"
                      sx={textFieldStyle}
                      value={item.cesscode || ""}
                      onChange={(e) => {
                        const newCode = [...cesscode];
                        newCode[index].cesscode = e.target.value;
                        setcesscode(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "cesscode")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
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
                ))}
                {tcs206code.map((item, index) => (
                  <Grid item xs={4} key={`tcs206code-${index}`}>
                    <TextField
                      label="TCS 206 C(1H)"
                      fullWidth
                      size="small"
                      sx={textFieldStyle}
                      value={item.tcs206code || ""}
                      onChange={(e) => {
                        const newCode = [...tcs206code];
                        newCode[index].tcs206code = e.target.value;
                        settcs206code(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "tcs206code")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModaltcs206 && (
                      <ProductModalAccount
                        allFields={allFieldstcs206}
                        onSelect={handleProductSelecttcs206}
                        onClose={() => setShowModaltcs206(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
              {/* Row 4: TCS 206 */}
              <Grid container spacing={2} mt={1}>
                {tcscode.map((item, index) => (
                  <Grid item xs={4} key={`tcscode-${index}`}>
                    <TextField
                      label="TCS A/C"
                      fullWidth
                      size="small"
                      sx={textFieldStyle}
                      value={item.tcs_code || ""}
                      onChange={(e) => {
                        const newCode = [...tcscode];
                        newCode[index].tcs_code = e.target.value;
                        settcscode(newCode);
                      }}
                      onKeyDown={(e) => handleOpenModal(e, index, "tcscode")}
                      InputProps={{ readOnly: !isEditMode || isDisabled }}
                    />
                    {showModaltcs && (
                      <ProductModalAccount
                        allFields={allFieldstcs}
                        onSelect={handleProductSelecttcs}
                        onClose={() => setShowModaltcs(false)} 
                        initialKey={pressedKey}
                        tenant={tenant}
                        onRefresh={fetchCustomers}
                      />
                    )}
                  </Grid>
                ))}
                {discountcode.map((item, index) => (
                <Grid item xs={4} key={`discountcode-${index}`}>
                  <TextField
                    label="DISCOUNT"
                    fullWidth
                    size="small"
                    sx={textFieldStyle}
                    value={item.discount_code || ""}
                    onChange={(e) => {
                      const newCode = [...discountcode];
                      newCode[index].discount_code = e.target.value;
                      setdiscountcode(newCode);
                    }}
                    onKeyDown={(e) => handleOpenModal(e, index, "discountcode")}
                    InputProps={{ readOnly: !isEditMode || isDisabled }}
                  />
                  {showModalDis && (
                    <ProductModalAccount
                      allFields={allFieldsDis}
                      onSelect={handleProductSelectDis}
                      onClose={() => setShowModalDis(false)} 
                      initialKey={pressedKey}
                      tenant={tenant}
                      onRefresh={fetchCustomers}
                    />
                  )}
              </Grid>
                ))}
                 <Grid item xs={4}>
                {/* <FormLabel sx={{ mt: 1 }}>TCS RATE ALL</FormLabel> */}
                <TextField
                  label="TCS RATE ALL"
                  id="TcsRate"
                  fullWidth
                  size="small"
                  sx={textFieldStyle}
                  value={formData.TcsRate || ""}
                  onChange={handleInputChange}
                  InputProps={{ readOnly: !isEditMode || isDisabled }}
                />
              </Grid>
              </Grid>
              {/*  */}
              <Grid item xs={6}>
                <FormLabel sx={{ mt: 1 }}>TCS ON TAX</FormLabel>
                <Select
                  id="Tcsontax"
                  fullWidth
                  size="small"
                  value={formData.Tcsontax}
                  onChange={handleTcsonTax}
                  disabled={!isEditMode || isDisabled}
                  sx={{
                    backgroundColor: "white", // 👈 Background color white
                    ...textFieldStyle, // 👈 Keep your existing styles too
                  }}
                  MenuProps={{
                    disablePortal: true,
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="CUSTOMER NAME"
                id="vacode"
                fullWidth
                size="small"
                value={formData.vacode}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="TERMS"
                id="exfor"
                fullWidth
                size="small"
                value={formData.exfor}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="VEHICLE NO"
                id="trpt"
                fullWidth
                size="small"
                value={formData.trpt}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="PRODUCT"
                id="sale_code"
                fullWidth
                size="small"
                value={formData.sale_code}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="REM 1"
                id="rem1"
                fullWidth
                size="small"
                value={formData.rem1}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="REM 2"
                id="rem2"
                fullWidth
                size="small"
                value={formData.rem2}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="REM 3"
                id="rem3"
                fullWidth
                size="small"
                value={formData.rem3}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="TRANSPORT"
                id="transport"
                fullWidth
                size="small"
                value={formData.transport}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="BROKER"
                id="broker"
                fullWidth
                size="small"
                value={formData.broker}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="GR NO"
                id="gr"
                fullWidth
                size="small"
                value={formData.gr}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                TAXTYPE
              </FormLabel>
              <Select
                id="stype"
                fullWidth
                size="small"
                value={formData.stype}
                onChange={handleTaxType}
                disabled={!isEditMode || isDisabled}
                sx={{
                  backgroundColor: "white", // 👈 Background color white
                  ...textFieldStyle, // 👈 Keep your existing styles too
                }}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="GST Sale (RD)">GST Sale (RD)</MenuItem>
                <MenuItem value="IGST Sale (RD)">IGST Sale(RD)</MenuItem>
                <MenuItem value="GST (URD)">GST (URD)</MenuItem>
                <MenuItem value="IGST (URD)">IGST (URD)</MenuItem>
                <MenuItem value="Tax Free Within State">
                  Tax Free Within State
                </MenuItem>
                <MenuItem value="Tax Free Interstate">
                  Tax Free Interstate
                </MenuItem>
                <MenuItem value="Export Sale">Export Sale</MenuItem>
                <MenuItem value="Export Sale(IGST)">Export Sale(IGST)</MenuItem>
                <MenuItem value="Including GST">Including GST</MenuItem>
                <MenuItem value="Including IGST">Including IGST</MenuItem>
                <MenuItem value="Not Applicable">Not Applicable</MenuItem>
                <MenuItem value="Exempted Sale">Exempted Sale</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={3}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                BILL CASH
              </FormLabel>
              <Select
                id="btype"
                fullWidth
                size="small"
                value={formData.btype}
                onChange={handleBillCash}
                disabled={!isEditMode || isDisabled}
                sx={{
                  backgroundColor: "white", // 👈 Background color white
                  ...textFieldStyle, // 👈 Keep your existing styles too
                }}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Bill">Bill</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={3}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                SUPPLY
              </FormLabel>
              <Select
                id="conv"
                fullWidth
                size="small"
                value={formData.conv}
                onChange={handleSupply}
                disabled={!isEditMode || isDisabled}
                sx={{
                  backgroundColor: "white", // 👈 Background color white
                  ...textFieldStyle, // 👈 Keep your existing styles too
                }}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Manufacturing Sale">
                  1.Manufacturing Sale
                </MenuItem>
                <MenuItem value="Trading Sale">2.Trading Sale</MenuItem>
              </Select>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <TextField
                label="DISABLE INC.TIME"
                id="B1"
                fullWidth
                size="small"
                value={formData.T1 === "" ? "" : formData.T1 ? "T" : "F"}
                onChange={(e) => handleInputChange2(e, "T1")}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="DISABLE REV.TIME"
                id="T2"
                fullWidth
                size="small"
                value={formData.T2 === "" ? "" : formData.T2 ? "T" : "F"}
                onChange={(e) => handleInputChange2(e, "T2")}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="A/C NAME IN LED"
                id="T3"
                fullWidth
                size="small"
                value={formData.T3 === "" ? "" : formData.T3 ? "T" : "F"}
                onChange={(e) => handleInputChange2(e, "T3")}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="REMARKS POST"
                id="T4"
                fullWidth
                size="small"
                value={formData.T4 === "" ? "" : formData.T4 ? "T" : "F"}
                onChange={(e) => handleInputChange2(e, "T4")}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="SHOW WINDOW EXP.BEFORE TAX"
                id="T6"
                fullWidth
                size="small"
                value={formData.T6 === "" ? "" : formData.T6 ? "T" : "F"}
                onChange={(e) => handleInputChange2(e, "T6")}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                label="SHOW WINDOW EXP.AFTER TAX"
                id="T7"
                fullWidth
                size="small"
                value={formData.T7 === "" ? "" : formData.T7 ? "T" : "F"}
                onChange={(e) => handleInputChange2(e, "T7")}
                sx={textFieldStyle}
                inputProps={{
                  readOnly: !isEditMode || isDisabled,
                }}
              />
            </Grid>
            {/* ROund OFF */}
            {/*  */}
            {/* <Grid item xs={2}>
                  <FormLabel sx={{ fontSize: '0.8rem',color:'black' }}>INDIVIDUAL ROUND OFF</FormLabel>
                  <Select
                  id="T21"
                  fullWidth
                  size="small"
                  value={formData.T21}
                  onChange={handleIndRoundoff}
                  disabled={!isEditMode || isDisabled}
                  sx={textFieldStyle}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                  </Grid> */}
            <Grid item xs={2}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                ROUND OFF
              </FormLabel>
              <Select
                id="T11"
                fullWidth
                size="small"
                value={formData.T11}
                onChange={handleRoundoff}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={2}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                TAX ROUND OFF
              </FormLabel>
              <Select
                id="T12"
                fullWidth
                size="small"
                value={formData.T12}
                onChange={handleTround}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={2}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                DISPLAY ITEM
              </FormLabel>
              <Select
                id="T13"
                fullWidth
                size="small"
                value={formData.T13}
                onChange={handleDisplayitem}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Product Code">Product Code</MenuItem>
                <MenuItem value="HSN Code">HSN Code</MenuItem>
                <MenuItem value="Product Name">Product Name</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={2}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                DEFAULT BUTTON
              </FormLabel>
              <Select
                id="T14"
                fullWidth
                size="small"
                value={formData.T14}
                onChange={handleDefbutton}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Print">Print</MenuItem>
                <MenuItem value="Add">Add</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={2}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                LOW SALE
              </FormLabel>
              <Select
                id="T15"
                fullWidth
                size="small"
                value={formData.T15}
                onChange={handleLowsale}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            {/*TDS POLICY*/}
            <Grid item xs={2}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                TDS 194Q POLICY 50 LAC
              </FormLabel>
              <Select
                id="T16"
                fullWidth
                size="small"
                value={formData.T16}
                onChange={handleTDS194}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Taxable Amt">Taxable Amt</MenuItem>
                <MenuItem value="Taxable + Tax">Taxable + Tax</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={2}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                TDS OPTIONS
              </FormLabel>
              <Select
                id="T19"
                fullWidth
                size="small"
                value={formData.T19}
                onChange={handleTDSoption}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
                <MenuItem value="Warning">Warning</MenuItem>
              </Select>
            </Grid>
            {/* <Grid item xs={2}>
                  <FormLabel sx={{ fontSize: '0.8rem',color:'black' }}>NEGATIVE STOCK LEVEL</FormLabel>
                  <Select
                  id="T19"
                  fullWidth
                  size="small"
                  value={formData.T19}
                  onChange={handleInputChange}
                  disabled={!isEditMode || isDisabled}
                  sx={textFieldStyle}
                  MenuProps={{
                    disablePortal: true
                  }}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                  </Grid> */}
            <Grid item xs={2}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                ZERO VALUE POST
              </FormLabel>
              <Select
                id="T20"
                fullWidth
                size="small"
                value={formData.T20}
                onChange={handleZerovalue}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={2}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                DISPLAY HSN CODE
              </FormLabel>
              <Select
                id="T18"
                fullWidth
                size="small"
                value={formData.T18}
                onChange={handleDisplayHSN}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            {/* Reportformat */}
            <Grid item xs={2}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                INVOICE FORMAT
              </FormLabel>
              <Select
                id="reportformat"
                fullWidth
                size="small"
                value={formData.reportformat}
                onChange={handleChangeInvoice}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                {Object.keys(invoiceComponents).map((key) => (
                  <MenuItem key={key} value={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={2}>
              <FormLabel sx={{ fontSize: "0.8rem", color: "black" }}>
                CD WINDOW
              </FormLabel>
              <Select
                id="T10"
                fullWidth
                size="small"
                value={formData.T10}
                onChange={handleCdwindow}
                disabled={!isEditMode || isDisabled}
                sx={textFieldStyle}
                MenuProps={{
                  disablePortal: true,
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </Grid>
            {/*  */}
            <Grid item xs={4}>
              <TextField
                label="DECIMAL RATE"
                id="rate"
                fullWidth
                size="small"
                value={formData.rate}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{ readOnly: !isEditMode || isDisabled }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="BAG"
                id="pkgs"
                fullWidth
                size="small"
                value={formData.pkgs}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{ readOnly: !isEditMode || isDisabled }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="QTY"
                id="weight"
                fullWidth
                size="small"
                value={formData.weight}
                onChange={handleInputChange}
                sx={textFieldStyle}
                inputProps={{ readOnly: !isEditMode || isDisabled }}
              />
            </Grid>
          </Grid>
        );
      default:
        return "Unknown Step";
    }
  };

  return (
    <div className="newModalz">
      <div>
        <ToastContainer style={{ width: "30%" }} />
      </div>
      <div className="maincontainer" style={{ backgroundColor: isHighlighted ? "#f0dba4" : "white" }}>
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

export default PurchaseSetup;
