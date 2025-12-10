import React, { useState, useEffect, useRef } from "react";
import "./PurchaseService.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import ProductModalCustomer from "../Modals/ProductModalCustomer";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useEditMode } from "../../EditModeContext";
import InvoicePDFPur from "../InvoicePdfPur";
import { CompanyContext } from '../Context/CompanyContext';
import { useContext } from "react";

const PurchaseService = () => {

const { company } = useContext(CompanyContext);
  const tenant = company?.databaseName;

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    console.error("No tenant selected!");
  }
  
  const [title, setTitle] = useState("(View)");
  const navigate = useNavigate();
  const itemCodeRefs = useRef([]);
  const datePickerRef = useRef([]);
  const desciptionRefs = useRef([]);
  const peciesRefs = useRef([]);
  const quantityRefs = useRef([]);
  const priceRefs = useRef([]);
  const amountRefs = useRef([]);
  const gstRefs = useRef([]);
  const othersRefs = useRef([]);
  const cgstRefs = useRef([]);
  const sgstRefs = useRef([]);
  const igstRefs = useRef([]);
  const hsnCodeRefs = useRef([]);
  const saveButtonRef = useRef(null);
  const adjustAdvance = useRef(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [custGst, setCustgst] = useState("");
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
    vtype: "P",
    valpha:"V1",
    vno: 0,
    vbillno: 0,
    service:"",
    exfor: "",
    trpt: "",
    p_entry: 0,
    stype: "",
    btype: "",
    conv: "",
    vacode1: "",
    rem2: "",
    v_tpt: "",
    suppliername:"",
    supplierAddress:"",
    place:"",
    broker: "",
    srv_rate: 0,
    srv_tax: 0,
    tcs1_rate: 0,
    tcs1: 0,
    tcs206_rate: 0,
    tcs206: 0,
    pan:"",
    state:"",
    duedate: "",
    gr: "",
    tdson: "",
    declartion:"",
    pcess: 0,
    tax: 0,
    cess1: 0,
    cess2: 0,
    sub_total: 0,
    exp_before: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    expafterGST: 0,
    grandtotal: 0,
    items: [
      {
        id: 1,
        vcode: "",
        sdisc: "",
        pkgs: 0,
        weight: 0,
        rate: 0,
        amount: 0,
        gst: 0,
        exp_before: 0,
        ctax: 0,
        stax: 0,
        itax: 0,
        tariff: "",
        vamt: 0,
      },
    ], // Initialize items array
    supplierdetails: [
      {
        vacode: "",
        gstno: "",
        pan: "",
        city: "",
        state: "",
      },
    ],
  });
  const [supplierdetails, setsupplierdetails] = useState([
    {
      vacode: "",
      gstno: "",
      pan: "",
      city: "",
      state: "",
    },
  ]);
  const [items, setItems] = useState([
    {
      id: 1,
      vcode: "",
      sdisc: "",
      pkgs: 0,
      weight: 0,
      rate: 0,
      amount: 0,
      gst: 0,
      exp_before: 0,
      ctax: 0,
      stax: 0,
      itax: 0,
      tariff: "",
      vamt: 0,
    },
  ]);
  const customerNameRef = useRef(null);
  const grNoRef = useRef(null);
  const termsRef = useRef(null);
  const vehicleNoRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    if (customerNameRef.current) {
      customerNameRef.current.focus();
    }
  }, []);

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
  const handleKeyPress = (event, rowIndex, columnIndex) => {
    if (event.key === "Enter") {
      const inputs = tableRef.current.querySelectorAll("input");
      const rowCount = tableRef.current.rows.length;
      let columnCount = 0;

      if (tableRef.current.rows[rowIndex]) {
        columnCount = Array.from(
          tableRef.current.rows[rowIndex].querySelectorAll("input")
        ).length;
      }

      // Calculate index of next input
      let nextRowIndex = rowIndex;
      let nextColumnIndex = columnIndex + 1;

      if (nextColumnIndex >= columnCount) {
        nextColumnIndex = 0;
        nextRowIndex++;
      }

      if (nextRowIndex >= rowCount) {
        // If the cursor is on the last field of the last row, add a new row
        handleAddItem();
      } else {
        const nextInput = inputs[nextRowIndex * columnCount + nextColumnIndex];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };
  const calculateTotalGst = () => {
    let gsttotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;
    let totalvalue = 0;
    let value = 0;
    let grandTotal = 0;
    items.forEach((item) => {
      value = parseFloat(item.weight) * parseFloat(item.rate);
      totalvalue += value;
      cgstTotal += parseFloat(item.ctax || 0);
      sgstTotal += parseFloat(item.stax || 0);
      igstTotal += parseFloat(item.itax || 0);
      grandTotal += parseFloat(item.vamt);
      gsttotal = cgstTotal + sgstTotal + igstTotal;
    });
    // Update cgst, sgst, and igst fields in formData state
    setFormData((prevState) => ({
      ...prevState,
      tax: gsttotal.toFixed(2),
      cgst: cgstTotal.toFixed(2),
      sgst: sgstTotal.toFixed(2),
      igst: igstTotal.toFixed(2),
      sub_total: totalvalue.toFixed(2),
      grandtotal: grandTotal.toFixed(2),
    }));
  };
  useEffect(() => {
    calculateTotalGst();
  }, [items]);
    const [pkgsValue, setpkgsValue] = useState(null); 
    const [weightValue, setweightValue] = useState(null); 
    const [rateValue, setrateValue] = useState(null); 
        useEffect(() => {
          fetchSalesSetup();
        }, []);
        const fetchSalesSetup = async () => {
          try {
            const response = await fetch(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/api/purchasesetup`);
            if (!response.ok) throw new Error("Failed to fetch sales setup");
        
            const data = await response.json();
        
            if (Array.isArray(data) && data.length > 0 && data[0].formData) {
              const formDataFromAPI = data[0].formData;
              const T11Value = formDataFromAPI.T11;
              const T12Value = formDataFromAPI.T12;
              setpkgsValue(formDataFromAPI.pkgs);
              setweightValue(formDataFromAPI.weight);
              setrateValue(formDataFromAPI.rate);   
            
            } else {
              throw new Error("Invalid response structure");
            }
          } catch (error) {
            console.error("Error fetching sales setup:", error.message);
          }
        };
  // Api Response
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [index, setIndex] = useState(0);
    const [isAddEnabled, setIsAddEnabled] = useState(true);
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
     const { isEditMode, setIsEditMode } = useEditMode(); // Access the context
    const [isAbcmode, setIsAbcmode] = useState(false);
    const [isEditMode2, setIsEditMode2] = useState(false); // State to track edit mode
    const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
    const [firstTimeCheckData, setFirstTimeCheckData] = useState("");
  
    const fetchData = async () => {
      try {
          const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/purchasegst/last`);
          console.log("Response: ", response.data);
  
          if (response.status === 200 && response.data && response.data.data) {
              const lastEntry = response.data.data;
              
              // Ensure date is valid
              const isValidDate = (date) => {
                  return !isNaN(Date.parse(date));
              };
  
              // Update form data, use current date if date is invalid or not available
              const updatedFormData = {
                  ...lastEntry.formData,
                  date: isValidDate(lastEntry.formData.date) ? lastEntry.formData.date : new Date().toLocaleDateString(),
              };
  
              setFirstTimeCheckData("DataAvailable");
              setFormData(updatedFormData);
              console.log(updatedFormData, "Formdata2");
  
              // Update items with the last entry's items
              const updatedItems = lastEntry.items.map(item => ({
                  ...item, // Ensure immutability
              }));
              const updatedItems2 = lastEntry.supplierdetails.map(item => ({
                  ...item, // Ensure immutability
              }));
              setItems(updatedItems);
              setsupplierdetails(updatedItems2);
              // Set data and index
              setData1({ ...lastEntry, formData: updatedFormData }); // Assuming setData1 holds the current entry data
              setIndex(lastEntry.vno); // Set index to the voucher number or another identifier
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
      date: new Date().toLocaleDateString(), // Use today's date
      vtype: "P",
      valpha:"V1",
      vno: 0,
      vbillno: 0,
      service:"",
      exfor: "",
      trpt: "",
      p_entry: 0,
      stype: "",
      btype: "",
      conv: "",
      vacode1: "",
      rem2: "",
      v_tpt: "",
      suppliername:"",
      supplierAddress:"",
      place:"",
      broker: "",
      srv_rate: 0,
      srv_tax: 0,
      tcs1_rate: 0,
      tcs1: 0,
      tcs206_rate: 0,
      tcs206: 0,
      pan:"",
      state:"",
      duedate: "",
      gr: "",
      tdson: "",
      declartion:"",
      pcess: 0,
      tax: 0,
      cess1: 0,
      cess2: 0,
      sub_total: 0,
      exp_before: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      expafterGST: 0,
      grandtotal: 0,
  };
  const emptyItems = [{
      id: 1,
      vcode: "",
      sdisc: "",
      pkgs: 0,
      weight: 1,
      rate: 0,
      amount: 0,
      gst: 0,
      exp_before: 0,
      ctax: 0,
      stax: 0,
      itax: 0,
      tariff: "",
      vamt: 0,
  }];
  const emptysupplier = [{
      vacode: "",
      gstno: "",
      pan: "",
      city: "",
      state: "",
  }];
  // Set the empty data
  setFormData(emptyFormData);
  setItems(emptyItems);
  setsupplierdetails(emptysupplier);
  setData1({ formData: emptyFormData, items: emptyItems, supplierdetails: emptysupplier }); // Store empty data
  setIndex(0);
};
 
  useEffect(() => {
    fetchData(); // Fetch data when component mounts
  }, []); // Empty dependency array ensures it only runs once when component mounts

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
    setTitle("(View)");
    console.log(data1._id)
    try {
        if (data1) {
            const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/purchasegst/${data1._id}/next`);
            if (response.status === 200 && response.data) {
                const nextData = response.data.data;
                setData1(response.data.data);
                setIndex(index + 1);
                setFormData(nextData.formData);
                const updatedItems = nextData.items.map(item => ({
                    ...item, 
                }));
                const updatedCustomer = nextData.supplierdetails.map(item => ({
                  ...item, 
              }));
                setItems(updatedItems);
                setsupplierdetails(updatedCustomer);
                setIsDisabled(true);
            }
        }
    } catch (error) {
        console.error("Error fetching next record:", error);
    }
};

const handlePrevious = async () => {
    document.body.style.backgroundColor = 'white';
    setTitle("(View)");
    try {
        if (data1) {
            const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/purchasegst/${data1._id}/previous`);
            if (response.status === 200 && response.data) {
                console.log(response);
                setData1(response.data.data);
                const prevData = response.data.data;
                setIndex(index - 1);
                setFormData(prevData.formData);
                const updatedItems = prevData.items.map(item => ({
                  ...item, 
              }));
              const updatedCustomer = prevData.supplierdetails.map(item => ({
                ...item, 
            }));
              setItems(updatedItems);
              setsupplierdetails(updatedCustomer);
              setIsDisabled(true);
            }
        }
    } catch (error) {
        console.error("Error fetching previous record:", error);
    }
};

const handleFirst = async () => {
    document.body.style.backgroundColor = 'white';
    setTitle("(View)");

    try {
        const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/purchasegst/first`);
        if (response.status === 200 && response.data) {
            const firstData = response.data.data;
            setIndex(0);
            setFormData(firstData.formData);
            setData1(response.data.data);
            const updatedItems = firstData.items.map(item => ({
              ...item, 
          }));
          const updatedCustomer = firstData.supplierdetails.map(item => ({
            ...item, 
        }));
          setItems(updatedItems);
          setsupplierdetails(updatedCustomer);
          setIsDisabled(true);
        }
    } catch (error) {
        console.error("Error fetching first record:", error);
    }
};

const handleLast = async () => {
    document.body.style.backgroundColor = 'white';
    setTitle("(View)");

    try {
      const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/purchasegst/last`);
        if (response.status === 200 && response.data) {
            const lastData = response.data.data;
            const lastIndex = response.data.length - 1;
            setIndex(lastIndex);
            setFormData(lastData.formData);
            setData1(response.data.data);
            const updatedItems = lastData.items.map(item => ({
              ...item, 
          }));
          const updatedCustomer = lastData.supplierdetails.map(item => ({
            ...item, 
        }));
          setItems(updatedItems);
          setsupplierdetails(updatedCustomer);
          setIsDisabled(true);
        }
    } catch (error) {
        console.error("Error fetching last record:", error);
    }
};

const handleAdd = async () => {
  document.body.style.backgroundColor = '#D5ECF3';
  try {
      await fetchData(); // This should set up the state correctly whether data is found or not
      let lastvoucherno = formData.vno ? parseInt(formData.vno) + 1 : 1;
      const newData = {
        date: "",
        vtype: "P",
        valpha:"V1",
        vno: lastvoucherno,
        vbillno: 0,
        service:"",
        exfor: "",
        trpt: "",
        p_entry: 0,
        stype: "",
        btype: "",
        conv: "",
        vacode1: "",
        rem2: "",
        v_tpt: "",
        suppliername:"",
        supplierAddress:"",
        place:"",
        broker: "",
        srv_rate: 0,
        srv_tax: 0,
        tcs1_rate: 0,
        tcs1: 0,
        tcs206_rate: 0,
        tcs206: 0,
        pan:"",
        state:"",
        duedate: "",
        gr: "",
        tdson: "",
        declartion:"",
        pcess: 0,
        tax: 0,
        cess1: 0,
        cess2: 0,
        sub_total: 0,
        exp_before: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        expafterGST: 0,
        grandtotal: 0,
      };
      setData([...data, newData]);
      setFormData(newData);
      setItems([{ 
        id: 1,
        vcode: "",
        sdisc: "",
        pkgs: 0,
        weight: 0,
        rate: 0,
        amount: 0,
        gst: 0,
        exp_before: 0,
        ctax: 0,
        stax: 0,
        itax: 0,
        tariff: "",
        vamt: 0,}]);
      setsupplierdetails([{ 
        vacode: "",
        gstno: "",
        pan: "",
        city: "",
        state: "",}]);
      setIndex(data.length);
      setIsAddEnabled(false);
      setIsSubmitEnabled(true);
      setIsDisabled(false);
      setIsEditMode(true);

  } catch (error) {
      console.error("Error adding new entry:", error);
  }
};
  const handleEditClick = () => {
    // document.body.style.backgroundColor = "#F0E68C";
    setTitle("Edit");
    setIsDisabled(false);
    setIsEditMode(true);
    setIsSubmitEnabled(true);
    setIsAbcmode(true);
    if (customerNameRef.current) {
      customerNameRef.current.focus();
    }
  };
  const handleSaveClick = async () => {
    document.body.style.backgroundColor = "white";
    let isDataSaved = false;
    try {
      const isValid = supplierdetails.every((item) => item.vacode !== "");
      if (!isValid) {
        toast.error("Please Fill the Customer Details", {
          position: "top-center",
        });
        return; // Prevent save operation
      }
      const nonEmptyItems = items.filter((item) => item.sdisc.trim() !== "");
      if (nonEmptyItems.length === 0) {
        toast.error("Please fill in at least one Items name.", {
          position: "top-center",
        });
        return;
      }
  
      let combinedData;
      if (isAbcmode) {
        console.log(formData);
        combinedData = {
          _id: formData._id,
          formData: {
            date: selectedDate.toLocaleDateString("en-US"),
            vtype: formData.vtype,
            valpha:formData.valpha,
            vno: formData.vno,
            vbillno: formData.vbillno,
            service:formData.service,
            exfor: formData.exfor,
            trpt: formData.trpt,
            p_entry:formData.p_entry,
            stype:formData.stype,
            btype: formData.btype,
            conv:formData.conv,
            vacode1:formData.vacode1,
            rem2: formData.rem2,
            v_tpt:formData.v_tpt,
            broker: formData.broker,
            suppliername:formData.suppliername,
            supplierAddress:formData.supplierAddress,
            place:formData.place,
            srv_rate:formData.srv_rate,
            srv_tax:formData.srv_tax,
            tcs1_rate:formData.tcs1_rate,
            tcs1: formData.tcs1,
            tcs206_rate: formData.tcs206_rate,
            tcs206: formData.tcs206,
            pan:formData.pan,
            state:formData.state,
            duedate: expiredDate.toLocaleDateString("en-US"),
            gr: formData.gr,
            tdson: formData.tdson,
            declartion:formData.declartion,
            pcess: formData.pcess,
            tax: formData.tax,
            cess1: formData.cess1,
            cess2: formData.cess2,
            sub_total:formData.sub_total,
            exp_before: formData.exp_before,
            cgst: formData.cgst,
            sgst:formData.sgst,
            igst: formData.igst,
            expafterGST:formData.expafterGST,
            grandtotal: formData.grandtotal,
           
          },
          items: nonEmptyItems.map((item) => ({
            id: item.id,
            vcode: item.vcode,
            sdisc: item.sdisc,
            pkgs: item.pkgs,
            weight: item.weight,
            rate: item.rate,
            amount: item.amount,
            gst: item.gst,
            exp_before: item.exp_before,
            ctax: item.ctax,
            stax: item.stax,
            itax: item.itax,
            tariff: item.tariff,
            vamt: item.vamt,
          })),
          supplierdetails: supplierdetails.map((item) => ({
            vacode: item.vacode,
            gstno: item.gstno,
            pan: item.pan,
            city: item.city,
            state: item.state,
          })),
         
        };
      } else {
        combinedData = {
          _id: formData._id,
          formData: {
            date: selectedDate.toLocaleDateString("en-US"),
            vtype: formData.vtype,
            valpha:formData.valpha,
            vno: formData.vno,
            vbillno: formData.vbillno,
            service:formData.service,
            exfor: formData.exfor,
            trpt: formData.trpt,
            p_entry:formData.p_entry,
            stype:formData.stype,
            btype: formData.btype,
            conv:formData.conv,
            vacode1:formData.vacode1,
            rem2: formData.rem2,
            v_tpt:formData.v_tpt,
            broker: formData.broker,
            suppliername:formData.suppliername,
            supplierAddress:formData.supplierAddress,
            place:formData.place,
            srv_rate:formData.srv_rate,
            srv_tax:formData.srv_tax,
            tcs1_rate:formData.tcs1_rate,
            tcs1: formData.tcs1,
            tcs206_rate: formData.tcs206_rate,
            tcs206: formData.tcs206,
            pan:formData.pan,
            state:formData.state,
            duedate: expiredDate.toLocaleDateString("en-US"),
            gr: formData.gr,
            tdson: formData.tdson,
            declartion:formData.declartion,
            pcess: formData.pcess,
            tax: formData.tax,
            cess1: formData.cess1,
            cess2: formData.cess2,
            sub_total:formData.sub_total,
            exp_before: formData.exp_before,
            cgst: formData.cgst,
            sgst:formData.sgst,
            igst: formData.igst,
            expafterGST:formData.expafterGST,
            grandtotal: formData.grandtotal,
          },
          items: nonEmptyItems.map((item) => ({
            id: item.id,
            vcode: item.vcode,
            sdisc: item.sdisc,
            pkgs: item.pkgs,
            weight: item.weight,
            rate: item.rate,
            amount: item.amount,
            gst: item.gst,
            exp_before: item.exp_before,
            ctax: item.ctax,
            stax: item.stax,
            itax: item.itax,
            tariff: item.tariff,
            vamt: item.vamt,
          })),
          supplierdetails: supplierdetails.map((item) => ({
            vacode: item.vacode,
            gstno: item.gstno,
            pan: item.pan,
            city: item.city,
            state: item.state,
          })),
        };
      }
      // Debugging
      console.log("Combined Data:", combinedData);
      // const apiEndpoint = `http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/purchasegst${
      //   isAbcmode ? `/${data1._id}` : ""
      // }`;
      // const method = isAbcmode ? "put" : "post";
      // const response = await axios({
      //   method,
      //   url: apiEndpoint,
      //   data: combinedData,
      // });

      // if (response.status === 200 || response.status === 201) {
      //   fetchData();
      //   isDataSaved = true;
      // }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsSubmitEnabled(true);
      if (isDataSaved) {
        setTitle("View");
        setIsAddEnabled(true);
        setIsDisabled(true);
        setIsEditMode(false);
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
      const apiEndpoint = `http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/purchasegst/${data1._id}`;
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
   // Fetching Account Name
   React.useEffect(() => {
    // Fetch products from the API when the component mounts
    fetchAccountName();
}, []);

const fetchAccountName = async () => {
    try {
      const response = await fetch(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/api/ledgerAccount`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      // Ensure to extract the formData for easier access in the rest of your app
      const formattedData = data.map(item => ({ ...item.formData, _id: item._id }));
      setProductsAcc(formattedData);
      setLoadingAcc(false);
    } catch (error) {
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
  const updatedItems = [...items];
  updatedItems[index][key] = value;
  // If the key is 'name', find the corresponding product and set the price
  if (key === "ahead") {
    const selectedProduct = productsAcc.find((product) => product.ahead === value);
    if (selectedProduct) {
      updatedItems[index]["vcode"] = selectedProduct.ahead;
      // updatedItems[index]["sdisc"] = selectedProduct.Aheads;
      // updatedItems[index]["rate"] = selectedProduct.Mrps;
      // updatedItems[index]["gst"] = selectedProduct.itax_rate;
      // updatedItems[index]["tariff"] = selectedProduct.Hsn;
    } else {
      updatedItems[index]["rate"] = ""; // Reset price if product not found
      updatedItems[index]["gst"] = ""; // Reset gst if product not found
    }
  }

  // Calculate CGST and SGST based on the GST value
  const gst = parseFloat(updatedItems[index].gst);
  const totalExcludingGST =
    parseFloat(updatedItems[index].weight) *
    parseFloat(updatedItems[index].rate);
  // Check if GST number starts with "0" to "3"
  const gstNumber = "03";
  const same = custGst.substring(0, 2);
  let cgst, sgst, igst;
  if (gstNumber == same) {
    cgst = (totalExcludingGST * (gst / 2)) / 100 || 0;
    sgst = (totalExcludingGST * (gst / 2)) / 100 || 0;
    igst = 0;
  } else {
    cgst = sgst = 0;
    igst = (totalExcludingGST * gst) / 100 || 0;
  }

  // Set CGST and SGST to 0 if IGST is applied, and vice versa
  if (igst > 0) {
    cgst = 0;
    sgst = 0;
  } else {
    igst = 0;
  }

  // Calculate the total with GST and Others
  let totalWithGST = totalExcludingGST + cgst + sgst + igst;
  const others = parseFloat(updatedItems[index].exp_before) || 0;
  totalWithGST += others;

  // Update CGST, SGST, Others, and total fields in the item
  updatedItems[index]["amount"] = totalExcludingGST.toFixed(2);
  updatedItems[index]["ctax"] = cgst.toFixed(2);
  updatedItems[index]["stax"] = sgst.toFixed(2);
  updatedItems[index]["itax"] = igst.toFixed(2);
  updatedItems[index]["vamt"] = totalWithGST.toFixed(2);

  // Calculate the percentage of the value based on the GST percentage
  const percentage =
    ((totalWithGST - totalExcludingGST) / totalExcludingGST) * 100;
  updatedItems[index]["percentage"] = percentage.toFixed(2);

  // Update the state with the modified items array
  setItems(updatedItems);

  // Recalculate total GST and grand total
  calculateTotalGst();
};

const handleProductSelectAcc = (product) => {
  setIsEditMode(true);
    if (selectedItemIndexAcc !== null) {
        handleItemChangeAcc(selectedItemIndexAcc, 'ahead', product.ahead);
        setShowModalAcc(false);
    }
};
const openModalForItemAcc = (index) => {
    if (isEditMode) {
        setSelectedItemIndexAcc(index);
        setShowModalAcc(true);
    }
};

const allFieldsAcc = productsAcc.reduce((fields, product) => {
    Object.keys(product).forEach(key => {
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
        vcode: "",
        sdisc: "",
        pkgs: 0,
        weight: 0,
        rate: 0,
        amount: 0,
        gst: 0,
        exp_before: 0,
        ctax: 0,
        stax: 0,
        itax: 0,
        tariff: "",
        vamt: 0,
      };
      setItems((prevItems) => [...prevItems, newItem]);
      setTimeout(() => {
        itemCodeRefs.current[items.length].focus();
      }, 100);
    }
  };
  const handleDeleteItem = (index) => {
    const filteredItems = items.filter((item, i) => i !== index);
    setItems(filteredItems);
  };

  // Modal For Customer
  const [productsCus, setProductsCus] = useState([]);
  const [showModalCus, setShowModalCus] = useState(false);
  const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
  const [loadingCus, setLoadingCus] = useState(true);
  const [errorCus, setErrorCus] = useState(null);
  const handleItemChangeCus = (index, key, value) => {
    const updatedItems = [...supplierdetails];
    updatedItems[index][key] = value;
    // If the key is 'name', find the corresponding product and set the price
    if (key === "name") {
      const selectedProduct = productsCus.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["vacode"] = selectedProduct.ahead;
        updatedItems[index]["gstno"] = selectedProduct.gstNo;
        updatedItems[index]["pan"] = selectedProduct.pan;
        updatedItems[index]["city"] = selectedProduct.city;
        updatedItems[index]["state"] = selectedProduct.state;
        setCustgst(selectedProduct.gstNo);
      }
    }
    setsupplierdetails(updatedItems);
  };
  React.useEffect(() => {
    // Fetch products from the API when the component mounts
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/api/ledgerAccount`);
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      console.log(data);
      // Ensure to extract the formData for easier access in the rest of your app
      const formattedData = data.map(item => ({ ...item.formData, _id: item._id }));
      setProductsCus(formattedData);
      setLoadingCus(false);
    } catch (error) {
      setErrorCus(error.message);
      setLoadingCus(false);
    }
  };
  const handleProductSelectCus = (product) => {
    setIsEditMode(true);
    if (selectedItemIndexCus !== null) {
      handleItemChangeCus(selectedItemIndexCus, "name", product.ahead);
      setShowModalCus(false);
      // Move focus to grNo field after selecting customer
      if (grNoRef.current) {
        grNoRef.current.focus();
      }
    }
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

  const handleServiceSelect = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      service: value, // Update the ratecalculate field in FormData
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
  const handleTdsOn = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      tdson: value, // Update the ratecalculate field in FormData
    }));
  };

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayName, setDayName] = useState('');
  const getDayName = (date) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[date.getDay()];
};
// Search functions
  useEffect(() => {
    if (formData.date) {
        try {
            const date = new Date(formData.date);
            if (!isNaN(date.getTime())) { // Ensure the date is valid
                setSelectedDate(date);
                setDayName(getDayName(date));
            } else {
                console.error("Invalid date value in formData.date:", formData.date);
            }
        } catch (error) {
            console.error("Error parsing date:", error);
        }
    } else {
        // If no date exists in formData, handle the "else" part
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; 
        setSelectedDate(today);
        setDayName(getDayName(today));
        setFormData({ ...formData, date: formattedDate });
        console.log("Updated formData with today's date:", formattedDate);
    }
}, [formData.date, setFormData]);

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
  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleNumberChange = (event) => {
    const { id, value } = event.target;
    const numberValue = value.replace(/[^0-9.]/g, "");
    const validNumberValue =
      numberValue.split(".").length > 2
        ? numberValue.replace(/\.{2,}/g, "").replace(/(.*)\./g, "$1.")
        : numberValue;

    // Update form data with new value
    let newFormData = {
      ...formData,
      [id]: validNumberValue,
    };

    // Calculate new values for tcs1, tcs206, and grandtotal
    const grandTotal = parseFloat(newFormData.grandtotal) || 0;
    const tcs1Rate = parseFloat(newFormData.tcs1_rate) || 0;
    const tcs206Rate = parseFloat(newFormData.tcs206_rate) || 0;
    const srv_Rate = parseFloat(newFormData.srv_rate) || 0;

    // Calculate new values if rates are updated
    let newTcs1 = (tcs1Rate / 100) * grandTotal;
    let newTcs206 = (tcs206Rate / 100) * grandTotal;
    let newsrv_Rate = (srv_Rate / 100) * grandTotal;

    // Update grandtotal if rates are changed
    let newGrandTotal = grandTotal + newTcs1 + newTcs206 + newsrv_Rate;
    let expense = newTcs206;

    if (id === "tcs1_rate" || id === "tcs206_rate" || id === "srv_rate") {
      // Recalculate grandtotal based on the updated rates
      newGrandTotal =
        grandTotal -
        (parseFloat(formData.tcs1) || 0) -
        (parseFloat(formData.srv_tax) || 0) +
        newTcs1 +
        newsrv_Rate;
      newFormData = {
        ...newFormData,
        tcs1: newTcs1.toFixed(2),
        tcs206: newTcs206.toFixed(2),
        srv_tax: newsrv_Rate.toFixed(2),
        expafterGST: expense.toFixed(2),
        grandtotal: newGrandTotal.toFixed(2),
      };
    }

    setFormData(newFormData);
  };

  const [fontSize, setFontSize] = useState(16.5); // Initial font size in pixels
  const increaseFontSize = () => {
    setFontSize((prevSize) => (prevSize < 20 ? prevSize + 2 : prevSize)); // Increase font size up to 20 pixels
  };
  const decreaseFontSize = () => {
    setFontSize((prevSize) => (prevSize > 14 ? prevSize - 2 : prevSize)); // Decrease font size down to 14 pixels
  };
  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
  const handleKeyDown = (event, index, field) => {
    if (event.key === "Enter") {
      switch (field) {
        case "vcode":
          desciptionRefs.current[index].focus();
          break;
        case "sdisc":
          if (items[index].sdisc.trim() === "") {
            // Move focus to Save button if accountname is empty
            adjustAdvance.current.focus();
          } else {
            peciesRefs.current[index].focus();
          }
          break;
        case "pkgs":
          quantityRefs.current[index].focus();
          break;
        case "weight":
          priceRefs.current[index].focus();
          break;
        case "rate":
          amountRefs.current[index].focus();
          break;
        case "amount":
          gstRefs.current[index].focus();
          break;
        case 'gst':
            othersRefs.current[index].focus();
            break;
        case "exp_before":
          cgstRefs.current[index].focus();
          break;
        case "ctax":
          sgstRefs.current[index].focus();
          break;
        case "stax":
          igstRefs.current[index].focus();
          break;
        case "itax":
          hsnCodeRefs.current[index].focus();
          break;
        case "tariff":
          if (index === items.length - 1) {
            handleAddItem(); // Optionally add a new item if needed
            itemCodeRefs.current[index + 1]?.focus(); // Focus on the first input of the next row
          } else {
            itemCodeRefs.current[index + 1]?.focus();
          }
          break;
        default:
          break;
      }
    } else if (/^[a-zA-Z]$/.test(event.key) && field === "accountname") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItemCus(index);
      event.preventDefault(); // Prevent any default action
    }
  };
  const handleOpenModal = (event, index, field) => {
    if (/^[a-zA-Z]$/.test(event.key) && field === "vcode") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItemAcc(index);
      event.preventDefault(); // Prevent any default action
    }
  };
  const handleExit = async () => {
    document.body.style.backgroundColor = 'white'; // Reset background color
    setIsAddEnabled(true); // Enable "Add" button
    try {
        const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/purchasegst/last`); // Fetch the latest data
        if (response.status === 200 && response.data.data) {
            // If data is available
            const lastEntry = response.data.data;
            setFormData(lastEntry.formData); // Set form data
            setData1(response.data.data);
            const updateditems = lastEntry.items.map(item => ({
              ...item, 
          }));
          const updateditems2 = lastEntry.supplierdetails.map(item => ({
            ...item, 
        }));
        setItems(updateditems)
          setsupplierdetails(updateditems2);
          setIsDisabled(true); // Disable fields after loading the data
        } else {
            // If no data is available, initialize with default values
            console.log("No data available");
            const newData = {
              date: "",
              vtype: "P",
              valpha:"V1",
              vno: 0,
              vbillno: 0,
              service:"",
              exfor: "",
              trpt: "",
              p_entry: 0,
              stype: "",
              btype: "",
              conv: "",
              vacode1: "",
              rem2: "",
              v_tpt: "",
              suppliername:"",
              supplierAddress:"",
              place:"",
              broker: "",
              srv_rate: 0,
              srv_tax: 0,
              tcs1_rate: 0,
              tcs1: 0,
              tcs206_rate: 0,
              tcs206: 0,
              pan:"",
              state:"",
              duedate: "",
              gr: "",
              tdson: "",
              declartion:"",
              pcess: 0,
              tax: 0,
              cess1: 0,
              cess2: 0,
              sub_total: 0,
              exp_before: 0,
              cgst: 0,
              sgst: 0,
              igst: 0,
              expafterGST: 0,
              grandtotal: 0,
            };
            setFormData(newData); // Set default form data
            setItems([{
              id: 1,
              vcode: "",
              sdisc: "",
              pkgs: 0,
              weight: 0,
              rate: 0,
              amount: 0,
              gst: 0,
              exp_before: 0,
              ctax: 0,
              stax: 0,
              itax: 0,
              tariff: "",
              vamt: 0,
            }]);
            setsupplierdetails([{
              vacode: "",
              gstno: "",
              pan: "",
              city: "",
              state: "",
            }]);
  
            setIsDisabled(true); // Disable fields after loading the default data
        }
    } catch (error) {
        console.error("Error fetching data", error);
    }
  };

  const advanceRef = useRef(null);
  const twoBRef = useRef(null);
  const transportRef = useRef(null);
  const brokerRef = useRef(null);
  const tcsRef = useRef([]);
  const tdsRef = useRef([]);
  const tdsRef2 = useRef([]);
  const GrRef = useRef(null);
  const vehicelRef = useRef(null);
  const cess1Ref = useRef(null);
  const cess2Ref = useRef(null);

  const handleKeyDowndown = (event, nextFieldRef) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      if (nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };
  const [color, setColor] = useState(() => {
    // Get the initial color from local storage or default to 'black'
    return localStorage.getItem("SelectedColor") || "#ceedf0";
  });

  const handleChange = (event) => {
    const newColor = event.target.value;
    setColor(newColor);
    localStorage.setItem("SelectedColor", newColor); // Save the selected color to local storage
  };
  const handlechangeState = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      state: value, // Update the ratecalculate field in FormData
    }));
  };
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
   // Update the blur handlers so that they always format the value to 2 decimals.
   const handlePkgsBlur = (index) => {
    const decimalPlaces = pkgsValue
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index].pkgs);
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index].pkgs = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };
  
   const handleWeightBlur = (index) => {
      const decimalPlaces = weightValue;
      const updatedItems = [...items];
      let value = parseFloat(updatedItems[index].weight);
    
      // Validation: Check if weight is null, NaN, or <= 0
      if (isNaN(value) || value <= 0) {
        // Custom Confirmation Toast
        toast.info(
          ({ closeToast }) => (
            <div>
               <p style={{fontSize:20,color:'black'}}>⚠️ Quantity is invalid. It Should be Greater than 0 </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
                <button
                  onClick={() => {
                    closeToast(); // Close the toast
                    // Focus back on the invalid input
                    const weightInput = document.querySelectorAll('.QTY')[index];
                    if (weightInput) {
                      weightInput.focus();
                    }
                  }}
                  style={{width:100,backgroundColor: '#2ecc71',color: 'white',border: 'none',padding: '5px 10px',borderRadius: '5px',cursor: 'pointer'}}
                >
                  OK
                </button>
              </div>
            </div>
          ),
          {
            position: 'top-center',
            autoClose: false,
            closeOnClick: false,
            closeButton: false,
            draggable: false,
            style: {
              width: '400px',
              border:'1px solid black',
              textAlign: 'center',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              marginTop:150,
            },
          }
        );
        return;
      }
      updatedItems[index].weight = value.toFixed(decimalPlaces);
      setItems(updatedItems);
    };
  
  const handleRateBlur = (index) => {
    const decimalPlaces = rateValue;
    const updatedItems = [...items];
    let value = parseFloat(updatedItems[index].rate);
    if (isNaN(value)) {
      value = 0;
    }
    updatedItems[index].rate = value.toFixed(decimalPlaces);
    setItems(updatedItems);
  };;
  return (
    <div>
      <div>
        <ToastContainer />
      </div>
      <div className="Plusminus">
        <select className="colorselect" value={color} onChange={handleChange}>
          <option value="#ceedf0">Skyblue</option>
          <option value="lightyellow">Yellow</option>
          <option value="lavender">Lavender</option>
          <option value="#9ff0c3">Green</option>
          <option value="#ecc7cd">Pink</option>
        </select>
        <Button className="plusbutton" onClick={decreaseFontSize}>
          <FaMinus />
        </Button>
        <Button style={{ marginLeft: 10 }} onClick={increaseFontSize}>
          <FaPlus />
        </Button>
      </div>
      <div style={{ visibility: "hidden", width: 0, height: 0 }}>
      <InvoicePDFPur
      formData={formData}
      items={items}
      supplierdetails={supplierdetails}
      // shipped={shipped}
      isOpen={open}
      handleClose={handleClose}
    />
      </div>
      <h1 className="Headerz">PURCHASE GST SERVICES</h1>
      <div className="toppart">
        <div className="top" style={{ padding: 5, backgroundColor: color }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <text>Date:</text>
              <div className="Datez" style={{ height: 10 }}>
                <DatePicker
                  ref={datePickerRef}
                  className="custom-datepickerr"
                  id="date"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd-MM-yyyy"
                />
              </div>
              </div>
              <div
                className="vnodivz">
                <text>VNo:</text>
                <input
                  className="vnozw"
                  style={{
                    height: "30px",fontSize: `${fontSize}px`}}
                  id="vno"
                  value={formData.vno}
                  readOnly={!isEditMode || isDisabled}
                  placeholder="VNo."
                  // onChange={handleNumberChange}
                />
                <select
                className="service"
                id="service"
                style={{
                  height: "30px",
                  backgroundColor: "white",
                  fontSize: `${fontSize}px`,
                  color: "black",
                }}
                value={formData.service}
                onChange={handleServiceSelect}
                disabled={!isEditMode || isDisabled}
              >
                <option value="">Services</option>
                <option value="Services">Services</option>
                <option value="Goods">Goods</option>
              </select>
              {/* <input 
          
              style={{marginLeft:115}}
              /> */}
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              {supplierdetails.map((item, index) => (
                <div key={item.vacode}>
                  <div className="cus">
                    <div>
                      <text>Supplier:</text>
                      <input
                        ref={customerNameRef}
                        type="text"
                        className="supplierz"
                        style={{ height: "30px", fontSize: `${fontSize}px`,width:320 }}
                        placeholder="Supplier Name"
                        value={item.vacode}
                        // onClick={() => openModalForItemCus(index)}
                        onKeyDown={(e) => {
                          handleEnterKeyPress(customerNameRef, grNoRef)(e);
                          handleKeyDown(e, index, "accountname");
                        }}
                      />
                    </div>
                    <div className="citydiv" style={{marginLeft:2}}>
                      <text>City:</text>
                      <input
                        className="Cityz"
                        value={item.city}
                        style={{ height: "30px", fontSize: `${fontSize}px` }}
                        placeholder="Enter City"
                        readOnly={!isEditMode || isDisabled}
                        onChange={(e) =>
                          handleItemChangeCus(index, "city", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="gst">
                    <div>
                      <text>GST No:</text>
                      <input
                        className="Gstnoz"
                        value={item.gstno}
                        style={{ height: "30px", fontSize: `${fontSize}px`,width:320 }}
                        placeholder="GST No"
                        readOnly={!isEditMode || isDisabled}
                        onChange={(e) =>
                          handleItemChangeCus(index,"gstNumber",e.target.value)
                        }
                      />
                    </div>
                    <div className="pandiv" style={{marginLeft:2}}>
                      <text>PAN:</text>
                      <input
                        className="Panz"
                        style={{ height: "30px", fontSize: `${fontSize}px` }}
                        value={item.pan}
                        placeholder="PanNo"
                        readOnly={!isEditMode || isDisabled}
                        onChange={(e) =>
                          handleItemChangeCus(index, "PanNo", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
              {showModalCus && (
                <ProductModalCustomer
                  allFields={allFieldsCus}
                  products={productsCus}
                  onSelect={handleProductSelectCus}
                  onClose={() => setShowModalCus(false)}
                  onRefresh={fetchCustomers}  // ✅ you passed this here
                  initialKey={pressedKey} // Pass the pressed key to the modal
                />
              )}
            </div>
          </div>
        </div>
        <div className="top" style={{ padding: 5, backgroundColor: color }}>
          <div
            className="Billdiv"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <div>
              <text>DOC No:</text>
              <input
                ref={grNoRef}
                className="DocNo"
                style={{ height: "30px", fontSize: `${fontSize}px` }}
                id="vbillno"
                value={formData.vbillno}
                readOnly={!isEditMode || isDisabled}
                placeholder="Billno"
                onChange={handleNumberChange}
                onKeyDown={handleEnterKeyPress(grNoRef, termsRef)}
              />
            </div>
            <div
              className="datediv"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <text>Bill Date:</text>
              <div className="dbdate" style={{ height: 10,marginLeft:18 }}>
                <DatePicker
                  className="custom-datepickerr"
                  id="date"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd-MM-yyyy"
                />
              </div>
            </div>
            {/* <div>
              <text>Terms:</text>
              <input
                ref={termsRef}
                className="Termsz"
                style={{ height: "30px", fontSize: `${fontSize}px` }}
                id="exfor"
                placeholder="Terms"
                readOnly={!isEditMode || isDisabled}
                value={formData.exfor}
                onChange={handleInputChange}
                // onKeyDown={handleInputKeyDown}
                onKeyDown={handleEnterKeyPress(termsRef, null)}
              />
            </div> */}
            <div>
                <text>VehicleNo:</text>
                <input
                  ref={vehicelRef}
                  className="Trptz"
                  style={{ height: 30, fontSize: `${fontSize}px` }}
                  id="trpt"
                  placeholder="Vehicle NO"
                  value={formData.trpt}
                  readOnly={!isEditMode || isDisabled}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    handleKeyDowndown(e, saveButtonRef);
                  }}
                />
              </div>
          </div>
          <div
            className="selectors"
            style={{ display: "flex", flexDirection: "column",marginTop:10 }}
          >
            <div
              className="taxdiv"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <text>Taxtype:</text>
              <select
                className="Taxtype"
                id="taxtype"
                style={{
                  height: "30px",
                  backgroundColor: "white",
                  fontSize: `${fontSize}px`,
                  color: "black",
                }}
                value={formData.stype}
                onChange={handleTaxType}
                disabled={!isEditMode || isDisabled}
              >
                <option value="">Tax-Type</option>
                <option value="Vat Sale">Vat Sale</option>
                <option value="Out of State">Out of State</option>
                <option value="Retails Within State">
                  Retails Within State
                </option>
                <option value="Exempted Sale">Exempted Sale</option>
                <option value="Tax Free Within Sale">
                  Tax Free Within Sale
                </option>
                <option value="Export Sale">Export Sale</option>
                <option value="H Form Within State">H Form Within State</option>
                <option value="H Form Outside State">
                  H Form Outside State
                </option>
                <option value="E1/E2 Sale">E1/E2 Sale</option>
                <option value="Including Tax">Including Tax</option>
                <option value="Consigment">Consigment</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Tax Free Interstate">Tax Free Interstate</option>
              </select>
            </div>
            <div style={{ marginTop: 5 }}>
              <text>Self Inv.#:</text>
              <input
                ref={vehicleNoRef}
                className="Selfinv"
                style={{ height: "30px", fontSize: `${fontSize}px` }}
                id="p_entry"
                placeholder="Self Inv"
                readOnly={!isEditMode || isDisabled}
                value={formData.p_entry}
                onChange={handleInputChange}
                onKeyDown={handleEnterKeyPress(vehicleNoRef, null)}
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
            >
              <text>BillCash:</text>
              <select
                className="Billcash"
                id="billcash"
                style={{
                  height: "30px",
                  backgroundColor: "white",
                  fontSize: `${fontSize}px`,
                  color: "black",
                }}
                value={formData.btype}
                onChange={handleBillCash}
                disabled={!isEditMode || isDisabled}
              >
                <option value="">Bill Cash</option>
                <option value="Bill">Bill</option>
                <option value="Cash Memo">Cash Memo</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      {/* Table content */}
      <div>
        <div className="tablestyle">
          <Table ref={tableRef} className="custom-table">
            <thead
              style={{
                backgroundColor: color,
                textAlign: "center",
                position: "sticky",
                top: 0,
              }}
            >
              <tr style={{ color: "#575a5a" }}>
                <th>LEDGER A/C NAME</th>
                <th>DESCRIPTION</th>
                <th>PCS</th>
                <th>QTY</th>
                <th>PRICE/RATE</th>
                <th>AMOUNT</th>
                <th>GST</th>
                <th>Others</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
                <th>HSNCODE</th>
                {/* <th className="text-center">ACTION</th> */}
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody
              style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ padding: 0, width: 300 }}>
                    <input
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                      }}
                      type="text"
                      value={item.vcode}
                      readOnly
                      // onClick={() => openModalForItem(index)}
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "vcode");
                        handleOpenModal(e, index, "vcode");
                      }}
                      ref={(el) => (itemCodeRefs.current[index] = el)}
                    />
                  </td>
                  <td style={{ padding: 0, width: 200 }}>
                    <input
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        backgroundColor: "lightyellow",
                      }}
                      value={item.sdisc}
                      readOnly={!isEditMode || isDisabled}
                      onChange={(e) =>
                        handleItemChangeAcc(index, "sdisc", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "sdisc");
                      }}
                      ref={(el) => (desciptionRefs.current[index] = el)}
                    />
                  </td>
                  <td style={{ padding: 0 }}>
  <input
    className="PCS"
    style={{
      height: 40,
      width: "100%",
      boxSizing: "border-box",
      border: "none",
      padding: 5,
      textAlign: "right",
    }}
    maxLength={48}
    readOnly={!isEditMode || isDisabled}
    value={item.pkgs} // Show raw value during input
    onChange={(e) => handleItemChangeAcc(index, "pkgs", e.target.value)}
    onBlur={() => handlePkgsBlur(index)} // Format value on blur
    onKeyDown={(e) => {handleKeyDown(e, index, "pkgs");}}
    ref={(el) => (peciesRefs.current[index] = el)}
  />
</td>
<td style={{ padding: 0 }}>
  <input
    className="QTY"
    style={{
      height: 40,
      width: "100%",
      boxSizing: "border-box",
      border: "none",
      padding: 5,
      textAlign: "right",
    }}
    maxLength={48}
    readOnly={!isEditMode || isDisabled}
    value={item.weight} // Show raw value during input
    onChange={(e) => handleItemChangeAcc(index, "weight", e.target.value)}
    onBlur={() => handleWeightBlur(index)} // Format value on blur
    onKeyDown={(e) => {
      handleKeyDown(e, index, "weight");
    }}
    ref={(el) => (quantityRefs.current[index] = el)}
  />
</td>
<td style={{ padding: 0 }}>
  <input
    className="Price"
    style={{
      height: 40,
      width: "100%",
      boxSizing: "border-box",
      border: "none",
      padding: 5,
      textAlign: "right",
    }}
    maxLength={48}
    readOnly={!isEditMode || isDisabled}
    value={item.rate} // Show raw value during input
    onChange={(e) => handleItemChangeAcc(index, "rate", e.target.value)}
    onBlur={() => handleRateBlur(index)} // Format value on blur
    onKeyDown={(e) => {handleKeyDown(e, index, "rate");}}
    ref={(el) => (priceRefs.current[index] = el)}
  />
</td>
                  <td style={{ padding: 0 }}>
                    <input
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        backgroundColor: "lightyellow",
                        textAlign: "right",
                      }}
                      type="number"
                      readOnly={!isEditMode || isDisabled}
                      value={item.amount}
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "amount");
                      }}
                      ref={(el) => (amountRefs.current[index] = el)}
                      min="0"
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        backgroundColor: "lightyellow",
                        textAlign: "right",
                      }}
                      type="number"
                      readOnly={!isEditMode || isDisabled}
                      value={item.gst}
                      onChange={(e) =>
                        handleItemChangeAcc(index, "gst", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "gst");
                      }}
                      ref={(el) => (gstRefs.current[index] = el)}
                      min="0"
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      type="text"
                      value={item.exp_before}
                      readOnly={!isEditMode || isDisabled}
                      onChange={(e) =>
                        handleItemChangeAcc(index, "exp_before", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "exp_before");
                      }}
                      ref={(el) => (othersRefs.current[index] = el)}
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        backgroundColor: "#e3f8e3",
                        textAlign: "right",
                      }}
                      readOnly={!isEditMode || isDisabled}
                      value={item.ctax}
                      onChange={(e) =>
                        handleItemChangeAcc(index, "ctax", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "ctax");
                      }}
                      ref={(el) => (cgstRefs.current[index] = el)}
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      readOnly={!isEditMode || isDisabled}
                      value={item.stax}
                      onChange={(e) =>
                        handleItemChangeAcc(index, "stax", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "stax");
                      }}
                      ref={(el) => (sgstRefs.current[index] = el)}
                      min="0"
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        backgroundColor: "#e3f8e3",
                        textAlign: "right",
                      }}
                      readOnly={!isEditMode || isDisabled}
                      value={item.itax}
                      onChange={(e) =>
                        handleItemChangeAcc(index, "itax", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "itax");
                      }}
                      ref={(el) => (igstRefs.current[index] = el)}
                      min="0"
                    />
                  </td>
                  <td style={{ padding: 0 }}>
                    <input
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      readOnly={!isEditMode || isDisabled}
                      value={item.tariff}
                      onChange={(e) =>
                        handleItemChangeAcc(index, "tariff", e.target.value)
                      }
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "tariff");
                      }}
                      ref={(el) => (hsnCodeRefs.current[index] = el)}
                    />
                  </td>
                  {/* <td className="text-center">
                                        <BiTrash onClick={() => handleDeleteItem(index)} style={{ cursor: 'pointer' }} />
                                    </td> */}
                  <td style={{ padding: 0 }}>
                    <input
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        backgroundColor: "lavender",
                        textAlign: "right",
                      }}
                      readOnly
                      value={item.vamt}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        {showModalAcc && (
          <ProductModalCustomer
          allFieldsAcc={allFieldsAcc}
          productsAcc={productsAcc}
          onSelectAcc={handleProductSelectAcc}
          onCloseAcc={() => setShowModalAcc(false)}
          onRefreshAcc={fetchAccountName}  // ✅ you passed this here
          initialKey={pressedKey} // Pass the pressed key to the modal
          />
        )}
      </div>
      <div className="Belowcontents">
        <div className="Bottomcontainer">
          <div className="btl1">
            <div className="Bottomdiv" style={{ backgroundColor: color,marginLeft:0 }}>
              <text>Suplier Details if any</text>
              <div style={{ marginTop: 10 }}>
                <text>Name:</text>
                <input
                  ref={adjustAdvance}
                  className="Namez"
                  style={{ height: 30, fontSize: `${fontSize}px`,width:410 }}
                  id="suppliername"
                  value={formData.suppliername}
                  readOnly={!isEditMode || isDisabled}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    handleKeyDowndown(e, twoBRef);
                  }}
                />
              </div>
              <div>
                <text>Address:</text>
                <input
                  ref={twoBRef}
                  className="addressz"
                  style={{ height: 30, fontSize: `${fontSize}px`,width:410 }}
                  id="supplierAddress"
                  readOnly={!isEditMode || isDisabled}
                  value={formData.supplierAddress}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    handleKeyDowndown(e, transportRef);
                  }}
                />
              </div>
              <div style={{display:'flex',flexDirection:'row'}}>
                <text style={{marginTop:5}}>Place:</text>
                <input
                  ref={brokerRef}
                  className="place"
                  style={{ height: 30, fontSize: `${fontSize}px` ,width:200}}
                  id="place"
                  readOnly={!isEditMode || isDisabled}
                  value={formData.place}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    handleKeyDowndown(e, tcsRef);
                  }}
                />
                <text style={{marginTop:2,marginLeft:5}}>State :</text>
                 <select
                     readOnly={!isEditMode || isDisabled}
                    name="state"
                    // className="dropdown"
                   style={{height:30,marginTop:2}}
                    value={formData.state}
                    onChange={handlechangeState}
                    onKeyPress={(event) => handleKeyPress(event, "pinCode")}
                  >
                    <option value=""></option>
                    {states.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
              </div>
              <div>
                <text>Transport:</text>
                <input
                  ref={transportRef}
                  className="tpts"
                  style={{ height: 30, fontSize: `${fontSize}px`,width:410 }}
                  id="v_tpt"
                  readOnly={!isEditMode || isDisabled}
                  value={formData.v_tpt}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    handleKeyDowndown(e, brokerRef);
                  }}
                />
              </div>
            </div>
            <div className="Bottomdiv" style={{ backgroundColor: color,marginLeft:2 }}>
            <div style={{ display: "flex", flexDirection: "row", marginTop: 5 }}>
                <text>TdsOn:</text>
                <select
                  class="tdson"
                  id="tdson"
                  style={{
                    height: 30,
                    backgroundColor: "white",
                    borderColor: "black",
                    width: 400,
                    fontSize: `${fontSize}px`,
                    color: "black",
                    marginLeft:123
                  }}
                  value={formData.tdson}
                  onChange={handleTdsOn}
                  disabled={!isEditMode || isDisabled}
                  aria-label="Without label"
                >
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
              <div style={{ display: "flex", flexDirection: "row", marginTop: 2 }}>
               <text>Declaration Document</text>  
                <input
               className="declaration"
                style={{ height: 30, fontSize: `${fontSize}px`,width:400 }}
                id="declartion"
                placeholder="Declartion"
                readOnly={!isEditMode || isDisabled}
                value={formData.declartion}
                onChange={handleInputChange}
              />
                 
              </div>
           
              <div style={{display:"flex",flexDirection:'row'}}
              ><text>PAN:</text>
              <input
                    className="tdsq2"
                    style={{
                      height: 30,
                      width: "50%",
                      marginLeft: 137,
                      marginTop: 2,
                      fontSize: `${fontSize}px`,
                    }}
                    id="pan"
                    value={formData.pan}
                    readOnly={!isEditMode || isDisabled}
                    onChange={handleNumberChange}
                  />
                  <input
                  value={"F2-PAN List"}
                  style={{
                    width: 100,
                    backgroundColor: "skyblue",
                    fontWeight: 600,
                    textAlign: "center",
                    marginLeft:5,
                    height:30,marginTop:2
                  }}
                  disabled
                />
              </div>
              <div style={{display:"flex",flexDirection:'row',}}
              ><text>Previous Total:</text>
              <input
                  className="SubTotal"
                  style={{ height: 30, fontSize: `${fontSize}px`,marginLeft:64, width:"50%", }}
                  id="sub_total"
                  placeholder="subtotal"
                  value={formData.sub_total}
                  readOnly={!isEditMode || isDisabled}
                  onChange={handleNumberChange}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "row"}}>
                <text>Tcs@:</text>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <input
                    ref={tcsRef}
                    className="Tcs"
                    style={{ height: 30, width: 60, fontSize: `${fontSize}px`,marginLeft:132 }}
                    id="tcs206_rate"
                    value={formData.tcs206_rate}
                    readOnly={!isEditMode || isDisabled}
                    onChange={handleNumberChange}
                    onKeyDown={(e) => {
                      handleKeyDowndown(e, tdsRef);
                    }}
                  />
                  <input
                    className="tdsq2"
                    style={{
                      height: 30,
                      width: 95,
                      marginLeft: 5,
                      marginTop: 2,
                      fontSize: `${fontSize}px`,
                    }}
                    id="tcs206"
                    value={formData.tcs206}
                    readOnly={!isEditMode || isDisabled}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="btl2">
            {/* <div className="Bottomdiv" style={{ backgroundColor: color }}>
              <div
                style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
              >
                <text>DueDate:</text>
                <div className="vdate">
                  <DatePicker
                    id="duedate"
                    value={formData.duedate}
                    className="custom-datepickerr"
                    selected={expiredDate}
                    onChange={handleDateChange}
                    readOnly={!isEditMode || isDisabled}
                    placeholderText="DueDate"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
              <div className="margin">
                <text>GrNo:</text>
                <input
                  ref={GrRef}
                  className="grNo"
                  style={{ height: 30, fontSize: `${fontSize}px` }}
                  id="gr"
                  readOnly={!isEditMode || isDisabled}
                  value={formData.gr}
                  placeholder="Gr No"
                  onChange={handleNumberChange}
                  onKeyDown={(e) => {
                    handleKeyDowndown(e, vehicelRef);
                  }}
                />
              </div>
              <ModalVehicle
                open2={open2}
                handleClose2={handleClose2}
                users2={users2}
                filteredUsers={filteredUsers}
                highlightedIndex={highlightedIndex}
                setHighlightedIndex={setHighlightedIndex}
                handleRowClick={handleRowClick}
                handleUserClick={handleUserClick}
                handleSaveClick2={handleSaveClick2}
                handleAddClick={handleAddClick}
                editedUser2={editedUser2}
                setEditedUser2={setEditedUser2}
                isAddingNewUser2={isAddingNewUser2}
                searchQuery={searchQuery}
                handleSearchChange={handleSearchChange}
                inputRef={inputRef}
                tableBodyRef={tableBodyRef}
              />
              <div className="margin">
                <text>TotalGST:</text>
                <input
                  className="Totalgst"
                  style={{ height: 30, fontSize: `${fontSize}px` }}
                  id="tax"
                  placeholder="Total GSt"
                  readOnly={!isEditMode || isDisabled}
                  value={formData.tax}
                  // onChange={handleNumberChange}
                />
              </div>
            </div> */}
            {/* <div className="Bottomdiv" style={{ backgroundColor: color }}>
              <div className="margin">
                <text>Cess1:</text>
                <input
                  className="Cess1"
                  style={{ height: 30, fontSize: `${fontSize}px` }}
                  id="cess1"
                  value={formData.cess1}
                  placeholder="cess1"
                  readOnly={!isEditMode || isDisabled}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="margin">
                <text>Cess2:</text>
                <input
                  className="Cess2"
                  style={{ height: 30, fontSize: `${fontSize}px` }}
                  id="cess2"
                  placeholder="cess2"
                  value={formData.cess2}
                  readOnly={!isEditMode || isDisabled}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="margin">
                <text>Add/Less:</text>
                <input
                  className="Addless"
                  style={{ height: 30, fontSize: `${fontSize}px` }}
                  id="exp_before"
                  value={formData.exp_before}
                  readOnly={!isEditMode || isDisabled}
                  placeholder="Add/Less"
                  onChange={handleNumberChange}
                />
              </div>
              <div className="margin">
                <text>Expense:</text>
                <input
                  className="Expense"
                  style={{ height: 30, fontSize: `${fontSize}px` }}
                  id="expafterGST"
                  value={formData.expafterGST}
                  readOnly={!isEditMode || isDisabled}
                  placeholder="expenses"
                  onChange={handleNumberChange}
                />
              </div>
            </div> */}
            <div className="Bottomdiv" style={{ backgroundColor: color,marginLeft:2 }}>
              <div>
                <text>SubTotal:</text>
                <input
                  className="SubTotalz"
                  style={{ height: 30, fontSize: `${fontSize}px`,textAlign:'right' }}
                  id="sub_total"
                  placeholder="subtotal"
                  value={formData.sub_total}
                  readOnly={!isEditMode || isDisabled}
                  onChange={handleNumberChange}
                />
              </div>
              <div>
                <text>Expense:</text>
                <input
                  className="Expensez"
                  style={{ height: 30, fontSize: `${fontSize}px`,textAlign:'right' }}
                  id="expafterGST"
                  value={formData.expafterGST}
                  readOnly={!isEditMode || isDisabled}
                  placeholder="expenses"
                  onChange={handleNumberChange}
                />
              </div>
              <div className="margin"style={{display:'flex',flexDirection:'row',textAlign:'right'}}>
                <text>C.GST:</text>
                <input
                  className="CGSTz"
                  style={{ height: 30, fontSize: `${fontSize}px`,textAlign:'right'}}
                  id="cgst"
                  placeholder="cgst"
                  value={formData.cgst}
                  readOnly={!isEditMode || isDisabled}
                  onChange={handleNumberChange}
                />
                 <text style={{marginLeft:5}}>S.GST:</text>
                <input
                  className="SGSTz"
                  style={{ height: 30, fontSize: `${fontSize}px`,textAlign:'right' }}
                  id="sgst"
                  readOnly={!isEditMode || isDisabled}
                  placeholder="sgst"
                  value={formData.sgst}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="margin">
                <text>I.GST:</text>
                <input
                  className="IGSTz"
                  style={{ height: 30, fontSize: `${fontSize}px`,textAlign:'right' }}
                  id="igst"
                  value={formData.igst}
                  readOnly={!isEditMode || isDisabled}
                  placeholder="igst"
                  onChange={handleNumberChange}
                />
              </div>
              <div className="margin">
                <text>GrandTotal:</text>
                <input
                  className="GrandTotalz"
                  style={{ height: 30, fontSize: `${fontSize}px`,textAlign:'right',color:'red'}}
                  id="grandtotal"
                  placeholder="grandtotal"
                  readOnly={!isEditMode || isDisabled}
                  value={formData.grandtotal}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="Buttonsgroup">
          <Button
            className="Button"
            style={{ color: "black", backgroundColor: buttonColors[0] }}
            onClick={handleAdd}
            disabled={!isAddEnabled}
          >
            Add
          </Button>
          <Button
            className="Button"
            style={{ color: "black", backgroundColor: buttonColors[1] }}
            onClick={handleEditClick}
            disabled={!isAddEnabled}
          >
            Edit
          </Button>
          <Button
            className="Button"
            style={{ color: "black", backgroundColor: buttonColors[2] }}
            onClick={handlePrevious}
            disabled={index === 0}
          >
            Previous
          </Button>
          <Button
            className="Button"
            style={{ color: "black", backgroundColor: buttonColors[3] }}
            onClick={handleNext}
            disabled={index === data.length - 1}
          >
            Next
          </Button>
          <Button
            className="Button"
            style={{ color: "black", backgroundColor: buttonColors[4] }}
            onClick={handleFirst}
            disabled={index === 0}
          >
            First
          </Button>
          <Button
            className="Button"
            style={{ color: "black", backgroundColor: buttonColors[5] }}
            onClick={handleLast}
            disabled={index === data.length - 1}
          >
            Last
          </Button>
          <Button
            className="Button"
            style={{ color: "black", backgroundColor: buttonColors[6] }}
          >
            Search
          </Button>
          <Button
            className="Button"
            onClick={handleOpen}
            style={{ color: "black", backgroundColor: buttonColors[7] }}
          >
            Print
          </Button>
          <Button
            className="delete"
            style={{ color: "black", backgroundColor: buttonColors[8] }}
            // onClick={handleDeleteClick}
          >
            Delete
          </Button>
          <Button
            onClick={handleExit}
            className="Button"
            style={{ color: "black", backgroundColor: buttonColors[9] }}
          >
            Exit
          </Button>
          <Button
            ref={saveButtonRef}
            className="Button"
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
export default PurchaseService;
