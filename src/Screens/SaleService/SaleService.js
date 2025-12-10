import React, { useState, useEffect, useRef } from "react";
import "./SaleService.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import ProductModalCustomer from "../Modals/ProductModalCustomer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useReactToPrint } from "react-to-print";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Select, MenuItem, FormControl, Box } from "@mui/material";
import { event } from "jquery";
import { useEditMode } from "../../EditModeContext";
import { CompanyContext } from '../Context/CompanyContext';
import { useContext } from "react";

const SaleService = () => {
  
 const { company } = useContext(CompanyContext);
   const tenant = company?.databaseName;
 
   if (!tenant) {
     // you may want to guard here or show an error state,
     // since without a tenant you can’t hit the right API
     console.error("No tenant selected!");
   }

  const [title, setTitle] = useState("(View)");
  const datePickerRef = useRef(null);
  const itemCodeRefs = useRef([]);
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
  const shippedtoRef = useRef(null);
  const remarksRef = useRef(null);
  const transportRef = useRef(null);
  const brokerRef = useRef(null);
  const tdsRef = useRef([]);
  const tcsRef = useRef([]);
  const tcsRef2 = useRef([]);
  const advanceRef = useRef(null);
  const gstRef = useRef(null);
  const addLessRef = useRef(null);
  const expAfterGSTRef = useRef(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [custGst, setCustgst] = useState("");
  const initialColors = [ "#E9967A","#F0E68C","#FFDEAD","#ADD8E6","#87CEFA","#FFF0F5","#FFC0CB","#D8BFD8","#DC143C","#DCDCDC","#8FBC8F",];
  const [buttonColors, setButtonColors] = useState(initialColors); // Initial colors
  const [formData, setFormData] = useState({
    date: "",
    vtype: "S",
    vbillno: 0,
    gr: "",
    exfor: "",
    trpt: "",
    stype: "",
    btype: "",
    conv: "",
    rem1: "",
    rem2: "",
    v_tpt: "",
    broker: "",
    srv_rate: 0,
    srv_tax: 0,
    tcs1_rate: 0,
    tcs1: 0,
    tcs206_rate: 0,
    tcs206: 0,
    duedate: "",
    pcess: 0,
    tax: 0,
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
        weight: 1,
        rate: 0,
        gst: 0,
        exp_before: 0,
        ctax: 0,
        stax: 0,
        itax: 0,
        tariff: "",
        vamt: 0,
      },
    ], // Initialize items array
    customerDetails: [
      {
        vacode: "",
        gstno: "",
        pan: "",
        city: "",
        state: "",
      },
    ],
    shipped: [
      {
        shippedto: "",
        shippingAdd: "",
        shippingState: "",
        shippingGst: "",
      },
    ],
  });
  const [customerDetails, setcustomerDetails] = useState([
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
    },
  ]);
  const [shipped, setshipped] = useState([
    {
      shippedto: "",
      shippingAdd: "",
      shippingState: "",
      shippingGst: "",
      shippingPan: "",
    },
  ]);
  const customerNameRef = useRef(null);
  const grNoRef = useRef(null);
  const termsRef = useRef(null);
  const vehicleNoRef = useRef(null);
  const tableRef = useRef(null);
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

  const calculateTotalGst = (event) => {
    let gsttotal = 0;
    let cgstTotal = 0;
    let sgstTotal = 0;
    let igstTotal = 0;
    let totalvalue = 0;
    let value = 1;
    let grandTotal = 0;
    let totalothers = 0;
    items.forEach((item) => {
      value = parseFloat(item.weight) * parseFloat(item.rate);
      totalvalue += value;
      cgstTotal += parseFloat(item.ctax || 0);
      sgstTotal += parseFloat(item.stax || 0);
      igstTotal += parseFloat(item.itax || 0);
      grandTotal += parseFloat(item.vamt);
      totalothers += parseFloat(item.exp_before);
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
      exp_before: totalothers.toFixed(2),
    }));
  };
  useEffect(() => {
    calculateTotalGst();
  }, [items]);
   const [T11, setT11] = useState(false);
      const [T12, setT12] = useState(false);
      const [T21, setT21] = useState(false);
      const [pkgsValue, setpkgsValue] = useState(null); 
      const [weightValue, setweightValue] = useState(null); 
      const [rateValue, setrateValue] = useState(null); 
     useEffect(() => {
       fetchSalesSetup();
     }, []);
     const fetchSalesSetup = async () => {
      try {
        const response = await fetch(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/api/salesetup`);
        if (!response.ok) throw new Error("Failed to fetch sales setup");
    
        const data = await response.json();
    
        if (Array.isArray(data) && data.length > 0 && data[0].formData) {
          const formDataFromAPI = data[0].formData;
          const T21Value = formDataFromAPI.T21;
          const T11Value = formDataFromAPI.T11;
          const T12Value = formDataFromAPI.T12;
          setpkgsValue(formDataFromAPI.pkgs);
          setweightValue(formDataFromAPI.weight);
          setrateValue(formDataFromAPI.rate);   
          // Update T21 and T12 states
          setT21(T21Value === "Yes");
          setT12(T12Value === "Yes");
          setT11(T11Value === "Yes");
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Error fetching sales setup:", error.message);
      }
    };
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
        const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/salegst/last`);
        console.log("Response: ", response.data);

        if (response.status === 200 && response.data.data) {
            const lastEntry = response.data.data;
            // Set flags and update form data
            console.log("sadasd",formData);
            setFirstTimeCheckData("DataAvailable");
            setFormData(lastEntry.formData);
            console.log(lastEntry.formData, "Formdata2");

            // Update items with the last entry's items
            const updatedItems = lastEntry.items.map(item => ({
                ...item, // Ensure immutability
            }));
            const updatedItems2 = lastEntry.customerDetails.map(item => ({
                ...item, // Ensure immutability
            }));
            const updatedItems3 = lastEntry.shipped.map(item => ({
              ...item, // Ensure immutability
          }));
          setItems(updatedItems);
          setcustomerDetails(updatedItems2);
          setshipped(updatedItems3);
            // Set data and index
            setData1(lastEntry); // Assuming setData1 holds the current entry data
            setIndex(lastEntry.voucherno); // Set index to the voucher number or another identifier
        } else {
            setFirstTimeCheckData("DataNotAvailable");
            console.log("No data available");
            // Create an empty data object with voucher number 0
            const emptyFormData = {
                date: new Date().toLocaleDateString(), // Use today's date
                vtype: "S",
                vbillno: 0,
                gr: "",
                exfor: "",
                trpt: "",
                stype: "",
                btype: "",
                conv: "",
                rem1: "",
                rem2: "",
                v_tpt: "",
                broker: "", 
                srv_rate: 0,
                srv_tax: 0,
                tcs1_rate: 0,
                tcs1: 0,
                tcs206_rate: 0,
                tcs206: 0,
                duedate: "",
                pcess: 0,
                tax: 0,
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
            const emptyshipped = [{    
              shippedto: "",
              shippingAdd: "",
              shippingState: "",
              shippingGst: "",
              shippingPan: "",
            }];
            const emptycustomer = [{    
              vacode: "",
              gstno: "",
              pan: "",
              city: "",
              state: "",
            }];
                // Set the empty data
            setFormData(emptyFormData);
            setItems(emptyItems);
            setcustomerDetails(emptycustomer)
            setshipped(emptyshipped);
            setData1({ formData: emptyFormData, items: emptyItems, shipped:emptyshipped,customerDetails:emptycustomer}); // Store empty data
            setIndex(0); 
        }
    } catch (error) {
        console.error("Error fetching data", error);
        // In case of error, you can also initialize empty data if needed
        const emptyFormData = {
          date: new Date().toLocaleDateString(), // Use today's date
          vtype: "S",
          vbillno: 0,
          gr: "",
          exfor: "",
          trpt: "",
          stype: "",
          btype: "",
          conv: "",
          rem1: "",
          rem2: "",
          v_tpt: "",
          broker: "", 
          srv_rate: 0,
          srv_tax: 0,
          tcs1_rate: 0,
          tcs1: 0,
          tcs206_rate: 0,
          tcs206: 0,
          duedate: "",
          pcess: 0,
          tax: 0,
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
      const emptyshipped = [{    
        shippedto: "",
        shippingAdd: "",
        shippingState: "",
        shippingGst: "",
        shippingPan: "",
      }];
      const emptycustomer = [{    
        vacode: "",
        gstno: "",
        pan: "",
        city: "",
        state: "",
      }];
      // Set the empty data
      setFormData(emptyFormData);
      setItems(emptyItems);
      setcustomerDetails(emptycustomer)
      setshipped(emptyshipped);
      setData1({ formData: emptyFormData, items: emptyItems, shipped:emptyshipped,customerDetails:emptycustomer}); // Store empty data
      setIndex(0); 
    }
};
 
  useEffect(() => {
    fetchData(); 
  }, []); 

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
            const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/salegst/${data1._id}/next`);
            if (response.status === 200 && response.data) {
                const nextData = response.data.data;
                setData1(response.data.data);
                setIndex(index + 1);
                setFormData(nextData.formData);
                const updatedItems = nextData.items.map(item => ({
                    ...item, 
                }));
                const updatedCustomer = nextData.customerDetails.map(item => ({
                  ...item, 
              }));
              const updatedShipped = nextData.shipped.map(item => ({
                ...item, 
            }));
            console.log("items:",updatedItems);
            
                setItems(updatedItems);
                setcustomerDetails(updatedCustomer);
                setshipped(updatedShipped);
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
            const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/salegst/${data1._id}/previous`);
            if (response.status === 200 && response.data) {
                console.log(response);
                setData1(response.data.data);
                const prevData = response.data.data;
                setIndex(index - 1);
                setFormData(prevData.formData);
                const updatedItems = prevData.items.map(item => ({
                  ...item, 
              }));
              const updatedCustomer = prevData.customerDetails.map(item => ({
                ...item, 
            }));
            const updatedShipped = prevData.shipped.map(item => ({
              ...item, 
          }));
          console.log("items:",updatedItems);
              setItems(updatedItems);
              setcustomerDetails(updatedCustomer);
              setshipped(updatedShipped);
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
        const response = await axios.get(`http://103.154.233.29:3007/au${tenant}/tenant/salegst/first`);
        if (response.status === 200 && response.data) {
            const firstData = response.data.data;
            setIndex(0);
            setFormData(firstData.formData);
            setData1(response.data.data);
            const updatedItems = firstData.items.map(item => ({
              ...item, 
          }));
          const updatedCustomer = firstData.customerDetails.map(item => ({
            ...item, 
        }));
        const updatedShipped = firstData.shipped.map(item => ({
          ...item, 
      }));
          setItems(updatedItems);
          setcustomerDetails(updatedCustomer);
          setshipped(updatedShipped);
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
        const response = await axios.get(`http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/salegst/last`);
        if (response.status === 200 && response.data) {
            const lastData = response.data.data;
            const lastIndex = response.data.length - 1;
            setIndex(lastIndex);
            setFormData(lastData.formData);
            setData1(response.data.data);
            const updatedItems = lastData.items.map(item => ({
              ...item, 
          }));
          const updatedCustomer = lastData.customerDetails.map(item => ({
            ...item, 
        }));
        const updatedShipped = lastData.shipped.map(item => ({
          ...item, 
      }));
          setItems(updatedItems);
          setcustomerDetails(updatedCustomer);
          setshipped(updatedShipped);
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
      let lastvoucherno = formData.vbillno ? parseInt(formData.vbillno) + 1 : 1;
      const newData = {
        date: "",
        vtype: "S",
        vbillno: lastvoucherno,
        gr: "",
        exfor: "",
        trpt: "",
        stype: "",
        btype: "",
        conv: "",
        rem1: "",
        rem2: "",
        v_tpt: "",
        broker: "",
        srv_rate: 0,
        srv_tax: 0,
        tcs1_rate: 0,
        tcs1: 0,
        tcs206_rate: 0,
        tcs206: 0,
        duedate: "",
        pcess: 0,
        tax: 0,
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
      setcustomerDetails([{ 
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
      const isValid = customerDetails.every((item) => item.vacode !== "");
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
            vbillno: formData.vbillno,
            gr: formData.gr,
            exfor: formData.exfor,
            trpt: formData.trpt,
            stype: formData.stype,
            btype: formData.btype,
            conv: formData.conv,
            rem1:formData.rem1,
            rem2:formData.rem2,
            v_tpt: formData.v_tpt,
            broker: formData.broker,
            srv_rate: formData.srv_rate,
            srv_tax: formData.srv_tax,
            tcs1_rate: formData.tcs1_rate,
            tcs1:formData.tcs1,
            tcs206_rate: formData.tcs206_rate,
            tcs206: formData.tcs206,
            duedate:expiredDate.toLocaleDateString("en-US"),
            pcess: formData.pcess,
            tax:formData.tax,
            sub_total:formData.sub_total,
            exp_before: formData.exp_before,
            cgst: formData.cgst,
            sgst:formData.sgst,
            igst:formData.igst,
            expafterGST: formData.expafterGST,
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
          customerDetails: customerDetails.map((item) => ({
            vacode: item.vacode,
            gstno: item.gstno,
            pan: item.pan,
            city: item.city,
            state: item.state,
          })),
          shipped: shipped.map((item) => ({
            shippedto: item.shippedto,
            shippingAdd: item.shippingAdd,
            shippingState: item.shippingState,
            shippingGst: item.shippingGst,
            shippingPan: item.shippingPan,
          })),
        };
      } else {
        combinedData = {
          _id: formData._id,
          formData: {
            date: selectedDate.toLocaleDateString("en-US"),
            vtype: formData.vtype,
            vbillno: formData.vbillno,
            gr: formData.gr,
            exfor: formData.exfor,
            trpt: formData.trpt,
            stype: formData.stype,
            btype: formData.btype,
            conv: formData.conv,
            rem1:formData.rem1,
            rem2:formData.rem2,
            v_tpt: formData.v_tpt,
            broker: formData.broker,
            srv_rate: formData.srv_rate,
            srv_tax: formData.srv_tax,
            tcs1_rate: formData.tcs1_rate,
            tcs1:formData.tcs1,
            tcs206_rate: formData.tcs206_rate,
            tcs206: formData.tcs206,
            duedate:expiredDate.toLocaleDateString("en-US"),
            pcess: formData.pcess,
            tax:formData.tax,
            sub_total:formData.sub_total,
            exp_before: formData.exp_before,
            cgst: formData.cgst,
            sgst:formData.sgst,
            igst:formData.igst,
            expafterGST: formData.expafterGST,
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
          customerDetails: customerDetails.map((item) => ({
            vacode: item.vacode,
            gstno: item.gstno,
            pan: item.pan,
            city: item.city,
            state: item.state,
          })),
          shipped: shipped.map((item) => ({
            shippedto: item.shippedto,
            shippingAdd: item.shippingAdd,
            shippingState: item.shippingState,
            shippingGst: item.shippingGst,
            shippingPan: item.shippingPan,
          })),
        };
      }
      // Debugging
      console.log("Combined Data:", combinedData);
      const apiEndpoint = `http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/salegst${
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
      const apiEndpoint = `http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/salegst/${data1._id}`;
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
 
  // Function to handle adding a new item
  const handleAddItem = () => {
    if (isEditMode) {
      const newItem = {
        id: items.length + 1,
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
      };
      setItems((prevItems) => [...prevItems, newItem]);
      setTimeout(() => {
        itemCodeRefs.current[items.length].focus();
      }, 100);
    }
  };

  const handleDeleteItem = (index) => {
    if (isSubmitEnabled) {
      const filteredItems = items.filter((item, i) => i !== index);
      setItems(filteredItems);
    }
  };

  // Modal For Customer
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
      // Ensure to extract the formData for easier access in the rest of your app
      const formattedData = data.map(item => ({ ...item.formData, _id: item._id }));
      setProductsCus(formattedData);
      setLoadingCus(false);
    } catch (error) {
      setErrorCus(error.message);
      setLoadingCus(false);
    }
  };
  const [productsCus, setProductsCus] = useState([]);
  const [showModalCus, setShowModalCus] = useState(false);
  const [selectedItemIndexCus, setSelectedItemIndexCus] = useState(null);
  const [loadingCus, setLoadingCus] = useState(true);
  const [errorCus, setErrorCus] = useState(null);
  const handleItemChangeCus = (index, key, value) => {
    const updatedItems = [...customerDetails];
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
    setcustomerDetails(updatedItems);
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  useEffect(() => {
    if (formData.date) {
      setSelectedDate(new Date(formData.date));
    } else {
      const today = new Date();
      setSelectedDate(today);
      setFormData({ ...formData, date: today });
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
    let newGrandTotal = grandTotal + newTcs1 + newTcs206;
    let expense = newTcs1 + newTcs206;

    if (id === "tcs1_rate" || id === "tcs206_rate" || id === "srv_rate") {
      // Recalculate grandtotal based on the updated rates
      newGrandTotal =
        grandTotal -
        (parseFloat(formData.tcs1) || 0) -
        (parseFloat(formData.tcs206) || 0) +
        newTcs1 +
        newTcs206;
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

  // Determine if tcs1_rate or tcs206_rate should be disabled
  const isTcs1Disabled = parseFloat(formData.tcs1_rate) > 0;
  const isTcs206Disabled = parseFloat(formData.tcs206_rate) > 0;

  // INVOICE
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

  const InvoicePDF = React.forwardRef(({ invoiceData }, ref) => {
    const chunkItems = (items, firstChunkSize, otherChunkSize) => {
      const chunks = [];
      let i = 0;
      // Handle the first chunk with a specific size
      if (items.length > 0) {
        chunks.push(items.slice(i, i + firstChunkSize));
        i += firstChunkSize;
      }
      // Handle all other chunks with a different size
      while (i < items.length) {
        chunks.push(items.slice(i, i + otherChunkSize));
        i += otherChunkSize;
      }
      return chunks;
    };
    // Split items into chunks of 10
    const chunks = chunkItems(items, 10, 20);

    const [totalQuantity, setTotalQuantity] = useState(0);
    // Function to calculate total quantity
    const calculateTotalQuantity = () => {
      const total = items.reduce((accumulator, currentItem) => {
        return accumulator + Number(currentItem.weight);
      }, 0);
      setTotalQuantity(total);
    };
    useEffect(() => {
      calculateTotalQuantity();
    }, [items]);

    const style = {
      bgcolor: "white",
      boxShadow: 24,
      p: 4,
      overflowY: "auto",
    };

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });
    return (
      <Modal
        open={open}
        style={{ overflow: "auto" }}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <button className="close-button" onClick={handleClose}>
            <CloseIcon />
          </button>
          <Button
            className="Button"
            style={{ color: "black", backgroundColor: "lightcoral" }}
            onClick={handlePrint}
          >
            Print
          </Button>
          <text style={{ fontWeight: "bold", fontSize: 30, marginLeft: "32%" }}>
            This Is The Preview of Bill
          </text>
          <div
            ref={componentRef}
            style={{
              width: "290mm",
              minHeight: "390mm",
              margin: "auto",
              padding: "20px",
              border: "1px solid #000",
              borderRadius: "5px",
              boxSizing: "border-box",
              marginTop: 5,
            }}
          >
            {chunks.map((chunk, pageIndex) => (
              <div
                key={pageIndex}
                style={{
                  minHeight: "257mm",
                  marginBottom: "20px",
                  pageBreakAfter:
                    pageIndex === chunks.length - 1 ? "auto" : "always", // Changed 'avoid' to 'auto'
                }}
              >
                {pageIndex === 0 && (
                  <div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        height: 70,
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <p
                          style={{
                            marginBottom: 0,
                            fontWeight: "bold",
                            fontSize: 16,
                            width: 140,
                          }}
                        >
                          GSTIN:{GSTIN}
                        </p>
                        <p
                          style={{
                            marginBottom: 0,
                            fontWeight: "bold",
                            fontSize: 16,
                          }}
                        >
                          PAN:{PAN}
                        </p>
                      </div>
                      <div
                        style={{
                          marginLeft: "23%",
                          display: "flex",
                          flexDirection: "column",
                          textAlign: "center",
                        }}
                      >
                        <text
                          style={{
                            color: "black",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 13,
                          }}
                        >
                          Form GST INV -1 ( TAX INVOICE )
                        </text>
                        <text
                          style={{
                            color: "black",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 13,
                          }}
                        >
                          (See Rule 7)
                        </text>
                        <text
                          style={{
                            color: "black",
                            textAlign: "center",
                            fontWeight: "bold",
                            fontSize: 13,
                          }}
                        >
                          Application for Electronic Reference Number of an
                          Invoice
                        </text>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          marginLeft: "23%",
                        }}
                      >
                        {/* <p style={{marginBottom:0,fontWeight:"bold",marginLeft:"23%",fontSize:12}}>Tel: {invoiceData.date}</p> */}
                        <p
                          style={{
                            marginBottom: 0,
                            fontWeight: "bold",
                            fontSize: 16,
                          }}
                        >
                          Tel:9872522662
                        </p>
                        <p
                          style={{
                            marginBottom: 0,
                            fontWeight: "bold",
                            fontSize: 16,
                            marginLeft: 20,
                          }}
                        >
                          7009588515
                        </p>
                      </div>
                    </div>
                    <div style={{ textAlign: "center", height: 120 }}>
                      <text
                        style={{
                          fontSize: 40,
                          fontWeight: "600",
                          fontFamily: "serif",
                        }}
                      >
                        {shopName}
                      </text>
                      <p
                        style={{
                          marginBottom: 0,
                          fontWeight: "bold",
                          fontSize: 18,
                          marginLeft: 0,
                        }}
                      >
                        {description}
                      </p>
                      <p
                        style={{
                          marginBottom: 0,
                          fontWeight: "bold",
                          fontSize: 18,
                          marginLeft: 0,
                        }}
                      >
                        {address}
                      </p>
                    </div>
                    <div
                      style={{
                        border: "1px solid black",
                        borderRadius: "5px",
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 30,
                      }}
                    >
                      <p
                        style={{
                          marginBottom: 0,
                          fontWeight: "bold",
                          fontSize: 16,
                          marginLeft: 10,
                        }}
                      >
                        InvoiceNo:{formData.vbillno}{" "}
                      </p>
                      <p
                        style={{
                          marginBottom: 0,
                          fontWeight: "bold",
                          fontSize: 16,
                          marginLeft: "32%",
                        }}
                      >
                        InvoiceDate:{formData.date}
                      </p>
                      <p
                        style={{
                          marginBottom: 0,
                          fontWeight: "bold",
                          fontSize: 16,
                          marginLeft: "25%",
                        }}
                      >
                        TruckNo:{formData.trpt}{" "}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Details of Receiver (Billed to) */}
                      <div
                        style={{
                          flex: 1,
                          borderRight: "1px solid black",
                          borderLeft: "1px solid black",
                          paddingRight: "20px",
                        }}
                      >
                        {customerDetails.map((item) => (
                          <div key={item.vacode}>
                            <text
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 16,
                                marginLeft: "30%",
                              }}
                            >
                              Details of Receiver (Billed to)
                            </text>
                            <p
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 16,
                                marginLeft: 10,
                              }}
                            >
                              Name: {item.vacode}{" "}
                            </p>
                            <p
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 16,
                                marginLeft: 10,
                              }}
                            >
                              Address: {item.city}{" "}
                            </p>
                            <p
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 16,
                                marginLeft: 10,
                              }}
                            >
                              State: {item.state}{" "}
                            </p>
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <p
                                style={{
                                  marginBottom: 0,
                                  fontWeight: "bold",
                                  fontSize: 16,
                                  marginLeft: 10,
                                }}
                              >
                                GSTIN: {item.gstno}{" "}
                              </p>
                              <p
                                style={{
                                  marginBottom: 0,
                                  fontWeight: "bold",
                                  fontSize: 16,
                                  marginLeft: 10,
                                }}
                              >
                                PAN: {item.pan}{" "}
                              </p>
                            </div>
                          </div>
                        ))}
                        {/* Add receiver details here */}
                      </div>
                      {/* Details of Consignee (Shipped to) */}
                      <div
                        style={{
                          flex: 1,
                          borderRight: "1px solid black",
                          paddingRight: "20px",
                        }}
                      >
                        {shipped.map((item) => (
                          <div key={item.shippedto}>
                            <text
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 16,
                                marginLeft: "18%",
                              }}
                            >
                              Details of Consignee ( Shipped to )
                            </text>
                            <p
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 16,
                                marginLeft: 10,
                              }}
                            >
                              Name: {item.shippedto}{" "}
                            </p>
                            <p
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 16,
                                marginLeft: 10,
                              }}
                            >
                              Address: {item.shippingAdd}{" "}
                            </p>
                            <p
                              style={{
                                marginBottom: 0,
                                fontWeight: "bold",
                                fontSize: 16,
                                marginLeft: 10,
                              }}
                            >
                              State: {item.shippingState}{" "}
                            </p>
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <p
                                style={{
                                  marginBottom: 0,
                                  fontWeight: "bold",
                                  fontSize: 16,
                                  marginLeft: 10,
                                }}
                              >
                                GSTIN: {item.shippingGst}{" "}
                              </p>
                              <p
                                style={{
                                  marginBottom: 0,
                                  fontWeight: "bold",
                                  fontSize: 16,
                                  marginLeft: 10,
                                }}
                              >
                                PAN: {item.shippingPan}{" "}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    borderRight: "1px solid #000",
                    borderLeft: "1px solid #000",
                    borderBottom: "1px solid #000",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #000", padding: "8px" }}>
                        Description
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px" }}>
                        Sr.No
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px" }}>
                        HSN
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px" }}>
                        PCS
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px" }}>
                        Qty.
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px" }}>
                        Unit
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px" }}>
                        Rate
                      </th>
                      <th style={{ border: "1px solid #000", padding: "8px" }}>
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ borderBottom: "1px solid black" }}>
                    {chunk.map((item, index) => (
                      <tr
                        key={index}
                        style={{
                          borderBottom:
                            index === chunk.length - 1
                              ? "1px solid #000"
                              : "none",
                        }}
                      >
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.sdisc}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.id}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.tariff}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.pkgs}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.weight}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.pcs}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.rate}
                        </td>
                        <td
                          style={{
                            borderRight: "1px solid black",
                            padding: "8px 0",
                            paddingLeft: 10,
                          }}
                        >
                          {item.weight * item.rate}
                        </td>
                        {/* <td style={{ borderRight: "1px solid black", padding: "8px 0" }}>{item.Others}</td>
                                        <td style={{ borderRight: "1px solid black", padding: "8px 0" }}>{item.CGST}</td>
                                        <td style={{ borderRight: "1px solid black", padding: "8px 0" }}>{item.total}</td> */}
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr
                      style={{
                        borderBottom: "1px solid #000",
                        borderLeft: "1px solid #000",
                        borderRight: "1px solid #000",
                      }}
                    >
                      <td
                        colSpan="2"
                        style={{ paddingLeft: "39px", border: "none" }}
                      >
                        TOTAL
                      </td>
                      {/* <td style={{ textAlign: 'right', padding: '8px' }}>${calculateSubtotal(chunk)}</td> */}
                      <td></td>
                      {/* <td colSpan="2" style={{  paddingLeft: '39px', border: '1px solid #000' }}>Qty. Total</td> */}
                      <td></td>
                      <td
                        style={{
                          textAlign: "left",
                          paddingLeft: "11px",
                          border: "1px solid #000",
                        }}
                      >
                        {totalQuantity}
                      </td>
                      <td></td>
                      <td
                        style={{
                          textAlign: "left",
                          paddingLeft: "11px",
                          border: "1px solid #000",
                        }}
                      >
                        Total{" "}
                      </td>

                      <td
                        style={{
                          textAlign: "left",
                          paddingLeft: "11px",
                          border: "1px solid #000",
                        }}
                      >
                        {formData.sub_total}
                      </td>
                    </tr>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: "100%",
                        borderLeft: "1px solid #000",
                        marginLeft: "195%",
                      }}
                    >
                      <div
                        style={{
                          borderBottom: "1px solid #000",
                          height: 270,
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                        }}
                      >
                        <text
                          style={{
                            height: 50,
                            marginTop: 10,
                            borderBottom: "1px solid #000",
                            fontWeight: "bold",
                            fontSize: 18,
                            paddingLeft: 10,
                          }}
                        >
                          Expense
                        </text>
                        <text
                          style={{
                            height: 50,
                            borderBottom: "1px solid #000",
                            fontWeight: "bold",
                            fontSize: 18,
                            paddingLeft: 10,
                          }}
                        >
                          TaxableValue
                        </text>
                        <text
                          style={{
                            height: 50,
                            borderBottom: "1px solid #000",
                            fontWeight: "bold",
                            fontSize: 18,
                            paddingLeft: 10,
                          }}
                        >
                          C.GST@ 9.00%
                        </text>
                        <text
                          style={{
                            height: 50,
                            borderBottom: "1px solid #000",
                            fontWeight: "bold",
                            fontSize: 18,
                            paddingLeft: 10,
                          }}
                        >
                          S.GST@ 9.00%
                        </text>
                        <text
                          style={{
                            height: 50,
                            borderBottom: "1px solid #000",
                            fontWeight: "bold",
                            fontSize: 18,
                            paddingLeft: 10,
                          }}
                        >
                          I.GST@ 9.00%
                        </text>
                        <text
                          style={{
                            height: 50,
                            borderBottom: "1px solid #000",
                            fontWeight: "bold",
                            fontSize: 18,
                            paddingLeft: 10,
                          }}
                        >
                          Tcs206c1H
                        </text>
                        <text
                          style={{
                            height: 50,
                            borderBottom: "1px solid #000",
                            fontWeight: "bold",
                            fontSize: 18,
                            paddingLeft: 10,
                          }}
                        >
                          Tcs206C@
                        </text>
                        <text
                          style={{
                            height: 50,
                            fontWeight: "bold",
                            fontSize: 18,
                            paddingLeft: 10,
                          }}
                        >
                          Grand Total
                        </text>
                      </div>
                      <div
                        style={{
                          borderBottom: "1px solid #000",
                          height: 270,
                          display: "flex",
                          flexDirection: "column",
                          width: "100%",
                          borderLeft: "1px solid #000",
                        }}
                      >
                        <text
                          style={{
                            height: 50,
                            marginTop: 10,
                            borderBottom: "1px solid #000",
                            paddingLeft: 10,
                            fontSize: 18,
                          }}
                        >
                          {formData.expafterGST}
                        </text>
                        <text
                          style={{
                            height: 50,
                            borderBottom: "1px solid #000",
                            paddingLeft: 10,
                            fontSize: 18,
                          }}
                        >
                          {formData.sub_total}
                        </text>
                        <text
                          style={{
                            height: 50,
                            borderBottom: "1px solid #000",
                            paddingLeft: 10,
                            fontSize: 18,
                          }}
                        >
                          {formData.cgst}
                        </text>
                        <text
                          style={{
                            height: 50,
                            borderBottom: "1px solid #000",
                            paddingLeft: 10,
                            fontSize: 18,
                          }}
                        >
                          {formData.sgst}
                        </text>
                        <text
                          style={{
                            height: 50,
                            borderBottom: "1px solid #000",
                            paddingLeft: 10,
                            fontSize: 18,
                          }}
                        >
                          {formData.igst}
                        </text>
                        <text
                          style={{
                            height: 50,
                            borderBottom: "1px solid #000",
                            paddingLeft: 10,
                            fontSize: 18,
                          }}
                        >
                          {formData.tcs1}
                        </text>
                        <text
                          style={{
                            height: 50,
                            borderBottom: "1px solid #000",
                            paddingLeft: 10,
                            fontSize: 18,
                          }}
                        >
                          {formData.tcs206}
                        </text>
                        <text style={{ height: 50, paddingLeft: 10 }}>
                          {formData.grandtotal}
                        </text>
                      </div>
                    </div>
                  </tfoot>
                </table>
                <div style={{ fontSize: "12px" }}>
                  <text>Footer content specific to page {pageIndex + 1}</text>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </Modal>
    );
  });

  const invoiceData = {
    invoiceNumber: "INV-001",
    date: "April 25, 2024",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    items: [
      { description: "Item 1", quantity: 2, price: 10 },
      { description: "Item 2", quantity: 1, price: 20 },
      { description: "Item 3", quantity: 3, price: 15 },
    ],
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
            remarksRef.current.focus();
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
    setIsAddEnabled(true);
    if (data.length > 0) {
      const lastIndex = data.length - 2;
      setIndex(lastIndex);
      const lastData = data[lastIndex];
      setFormData(lastData);
      setIsDisabled(true); // Disable all fields when navigating to next page
      console.log(formData);
      const updatedItems3 = lastData.shipped.map((item) => ({
        shippedto: item.shippedto,
        shippingAdd: item.shippingAdd,
        shippingState: item.shippingState,
        shippingGst: item.shippingGst,
        shippingPan: item.shippingPan,
      }));
      const updatedcustomerDetails = lastData.customerDetails.map((item) => ({
        vacode: item.vacode,
        gstno: item.gstno,
        pan: item.pan,
        city: item.city,
        state: item.state,
      }));
      const updatedItems = lastData.items.map((item) => ({
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
      }));
      setshipped(updatedItems3);
      setcustomerDetails(updatedcustomerDetails);
      setItems(updatedItems);
      await fetchData();
    }
  };
  const [color, setColor] = useState(() => {
    // Get the initial color from local storage or default to 'black'
    return localStorage.getItem("Color") || "#ceedf0";
  });

  const handleChange = (event) => {
    const newColor = event.target.value;
    setColor(newColor);
    localStorage.setItem("Color", newColor); // Save the selected color to local storage
  };

  const handleKeyDowndown = (event, nextFieldRef) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission
      if (nextFieldRef.current) {
        nextFieldRef.current.focus();
      }
    }
  };
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
  };
  return (
    <div>
      <div>
        <ToastContainer />
      </div>
      <div className="Plusminus">
        {/* <text className="tittles">{title}</text> */}
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
        <InvoicePDF invoiceData={invoiceData} />
      </div>
      <h1 className="header">SALE GST SERVICES</h1>
      {/* Top Parts */}
      <div className="toppart">
        <div className="top" style={{ backgroundColor: color }}>
          <div className="cusdetails">
            <div className="datediv">
              <text>Date:</text>
              <div className="datez" style={{ height: 10 }}>
                <DatePicker
                  ref={datePickerRef}
                  className="custom-datepickerz"
                  id="date"
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd-MM-yyyy"
                />
              </div>
              <div
                className="billdiv"
                style={{ display: "flex", flexDirection: "row" }}
              >
                <text>BillNo:</text>
                <input
                  className="billz"
                  style={{ height: "30px", fontSize: `${fontSize}px` }}
                  id="vbillno"
                  value={formData.vbillno}
                  readOnly={!isEditMode || isDisabled}
                  placeholder="Bill No."
                />
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              {customerDetails.map((item, index) => (
                <div key={item.vacode}>
                  <div className="cus">
                    <div className="customerdiv">
                      <text>CustomerName:</text>
                      <input
                        ref={customerNameRef}
                        type="text"
                        className="customerz"
                        style={{ height: "30px", fontSize: `${fontSize}px` }}
                        placeholder="Customer Name"
                        value={item.vacode}
                        // onClick={() => openModalForItemCus(index)}
                        onKeyDown={(e) => {
                          handleEnterKeyPress(customerNameRef, grNoRef)(e);
                          handleKeyDown(e, index, "accountname");
                        }}
                      />
                    </div>
                    <div className="citydivs">
                      <text>City:</text>
                      <input
                        className="cityz"
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
                      <text>GSTNo:</text>
                      <input
                        className="gstnoz"
                        value={item.gstno}
                        style={{ height: "30px", fontSize: `${fontSize}px` }}
                        placeholder="GST No"
                        readOnly={!isEditMode || isDisabled}
                        onChange={(e) =>
                          handleItemChangeCus(index,"gstNumber",e.target.value)
                        }
                      />
                    </div>
                    <div className="pandivs">
                      <text>PAN:</text>
                      <input
                        className="pannoz"
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
        <div className="top" style={{ backgroundColor: color }}>
          <div>
            <div className="gr">
              <text>GrNo:</text>
              <input
                ref={grNoRef}
                className="grnoz"
                style={{ height: "30px", fontSize: `${fontSize}px` }}
                id="gr"
                value={formData.gr}
                readOnly={!isEditMode || isDisabled}
                placeholder="Enter grNo"
                onChange={handleNumberChange}
                onKeyDown={handleEnterKeyPress(grNoRef, termsRef)}
              />
            </div>
            <div className="tr">
              <text>Terms:</text>
              <input
                ref={termsRef}
                className="termz"
                style={{ height: "30px", fontSize: `${fontSize}px` }}
                id="exfor"
                value={formData.exfor}
                readOnly={!isEditMode || isDisabled}
                placeholder="Enter terms"
                onChange={handleInputChange}
                onKeyDown={handleEnterKeyPress(termsRef, vehicleNoRef)}
              />
            </div>
            <div className="vh">
              <text>Vehicle:</text>
              <input
                ref={vehicleNoRef}
                className="vehiclez"
                style={{ height: "30px", fontSize: `${fontSize}px` }}
                id="trpt"
                placeholder="Enter VehicleNo."
                readOnly={!isEditMode || isDisabled}
                value={formData.trpt}
                onChange={handleInputChange}
                // onKeyDown={handleInputKeyDown}
                onKeyDown={handleEnterKeyPress(vehicleNoRef, null)}
              />
            </div>
          </div>
          <div className="selector">
            <div className="ttype">
              <text>Taxtype:</text>
              <select
                className="taxtypez"
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
            <div className="bc">
              <text>BillCash:</text>
              <select
                className="billcashz"
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
            <div className="sup">
              <text>Supply:</text>
              <select
                className="supplyz"
                id="supply"
                style={{
                  height: "30px",
                  backgroundColor: "white",
                  fontSize: `${fontSize}px`,
                  color: "black",
                }}
                value={formData.conv}
                onChange={handleSupply}
                disabled={!isEditMode || isDisabled}
              >
                <option value="">Supply</option>
                <option value="Manufacturing Sale">1.Manufacturing Sale</option>
                <option value="Trading Sale">2.Trading Sale</option>
              </select>
              {/* <FormControl
                                size="small"
                            >
                                <Select
                                    className='supply'
                                    id="supply"
                                    style={{ height: 30, backgroundColor: "white", fontSize: `${fontSize}px` }}
                                    value={formData.conv}
                                    onChange={handleSupply}
                                    readOnly={!isEditMode || isDisabled}
                                    displayEmpty
                                    inputProps={{ "aria-label": "Without label" }}
                                >
                                    <MenuItem value="">Supply</MenuItem>
                                    <MenuItem value={"Manufacturing Sale"}>1.Manufacturing Sale</MenuItem>
                                    <MenuItem value={"Trading Sale"}>2.Trading Sale</MenuItem>
                                </Select>
                            </FormControl> */}
            </div>
          </div>
        </div>
      </div>
      {/* Top Part Ends Here */}
      {/* Table Part */}
      <div>
        <div className="tablediv">
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
                <th>TOTAL</th>
                <th className="text-center">ACTION</th>
              </tr>
            </thead>
            <tbody
              style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ padding: 0, width: 300 }}>
                    <input
                       className="ItemCode"
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
                     className="desc"
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
                      className="Amount"
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
                     className="Others"
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
                      className="CTax"
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
                    className="STax"
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
                    className="ITax"
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
                       className="Hsn"
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
                  <td style={{ padding: 0 }}>
                    <input
                      className="TotalTable"
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
                  <td style={{padding:0}} className="text-center">
                    <BiTrash onClick={() => handleDeleteItem(index)} style={{ cursor: 'pointer' }} />
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
      <div className="addbutton" style={{ marginTop: 2, marginBottom: 5 }}>
        <Button className="fw-bold btn-secondary" onClick={handleAddItem}>
          Add Row
        </Button>
      </div>
      {/* Bottom Part */}
      <div className="Belowcontents">
        <div className="bottomcontainerz">
          <div className="bottomdiv" style={{ backgroundColor: color }}>
            <div
              className="shipdiv"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{ display: "flex", flexDirection: "row", marginTop: 2 }}>
                <text>Remarks:</text>
                <input
                  ref={remarksRef}
                  className="rem1"
                  style={{ height: 30, fontSize: `${fontSize}px` }}
                  id="rem1"
                  readOnly={!isEditMode || isDisabled}
                  placeholder="Remarks"
                  value={formData.rem1}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    handleKeyDowndown(e, transportRef);
                  }}
                />
              </div>
              <input
                  ref={transportRef}
                  className="rem2"
                  style={{ height: 30, fontSize: `${fontSize}px` }}
                  id="rem2"
                  readOnly={!isEditMode || isDisabled}
                  placeholder="Remarks"
                  value={formData.rem2}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    handleKeyDowndown(e, brokerRef);
                  }}
                />
              <div
                style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
              >
                <text>Agent:</text>
                <input
                  ref={brokerRef}
                  className="brokerss"
                  style={{ height: 30, fontSize: `${fontSize}px` }}
                  readOnly={!isEditMode || isDisabled}
                  id="broker"
                  placeholder="Broker"
                  value={formData.broker}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    handleKeyDowndown(e, tdsRef);
                  }}
                />
              </div>
                <div style={{ display: "flex", flexDirection: "row",marginTop:2 }}>
                <text style={{ color: "red" }}>TDS194Q:</text>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <input
                    ref={tdsRef}
                    className="tdsqss"
                    style={{
                      height: 30,
                      width: 100,
                      fontSize: `${fontSize}px`,
                      color: "red",
                    }}
                    readOnly={!isEditMode || isDisabled}
                    id="srv_rate"
                    value={formData.srv_rate}
                    onChange={handleNumberChange}
                    onKeyDown={(e) => {
                      handleKeyDowndown(e, advanceRef);
                    }}
                  />
                  <input
                    className="tdsq22"
                    style={{
                      height: 30,
                      width: 150,
                      marginLeft: 5,
                      fontSize: `${fontSize}px`,
                      color: "red",
                    }}
                    readOnly={!isEditMode || isDisabled}
                    id="srv_tax"
                    value={formData.srv_tax}
                    onChange={handleNumberChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bottomdiv2" style={{ backgroundColor: color }}>
            <div
              className="adadv"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <text style={{color:'red'}}>AdjustAdv:</text>
                <input
                  ref={advanceRef}
                  className="advancez"
                  style={{ height: 30, width: 150, fontSize: `${fontSize}px`,color:"red",textAlign:'right' }}
                  id="pcess"
                  value={formData.pcess}
                  placeholder="Adjust Advance Rs"
                  readOnly={!isEditMode || isDisabled}
                  onChange={handleNumberChange}
                  onKeyDown={(e) => {
                    handleKeyDowndown(e, addLessRef);
                  }}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
              >
                <text>TotalGST:</text>
                <input
                  className="totalGstz"
                  style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
                  id="tax"
                  placeholder="Total GSt"
                  value={formData.tax}
                  readOnly={!isEditMode || isDisabled}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
              >
                <text>Add/Less:</text>
                <input
                  ref={addLessRef}
                  className="adlessz"
                  style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
                  id="exp_before"
                  value={formData.exp_before}
                  readOnly={!isEditMode || isDisabled}
                  placeholder="Add/Less"
                  onKeyDown={(e) => {
                    handleKeyDowndown(e, expAfterGSTRef);
                  }}
                  // onChange={handleNumberChange}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
              >
                <text>ExpAfterGst:</text>
                <input
                  ref={expAfterGSTRef}
                  className="expensegstz"
                  style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
                  id="expafterGST"
                  readOnly={!isEditMode || isDisabled}
                  placeholder="Exp After GST"
                  value={formData.expafterGST}
                  onChange={handleNumberChange}
                  onKeyDown={(e) => {
                    handleKeyDowndown(e, saveButtonRef);
                  }}
                />
              </div>
            </div>
            <div
              className="valuediv"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <text>Value:</text>
                <input
                  className="valuez"
                  style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
                  id="sub_total"
                  readOnly={!isEditMode || isDisabled}
                  placeholder="value"
                  value={formData.sub_total}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
              >
                <text>C.GST:</text>
                <input
                  className="Cgstz"
                  style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
                  id="cgst"
                  readOnly={!isEditMode || isDisabled}
                  placeholder="CGST"
                  value={formData.cgst}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
              >
                <text>S.GST:</text>
                <input
                  className="Sgstz"
                  style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
                  id="sgst"
                  placeholder="SGST"
                  readOnly={!isEditMode || isDisabled}
                  value={formData.sgst}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
              >
                <text>I.GST:</text>
                <input
                  className="Igstz"
                  style={{ height: 30, width: 150, fontSize: `${fontSize}px`,textAlign:'right' }}
                  id="igst"
                  value={formData.igst}
                  readOnly={!isEditMode || isDisabled}
                  placeholder="IGST"
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", marginTop: 2 }}
              >
                <text style={{ color: "red" }}>GrandTotal:</text>
                <input
                  className="Grandtotalz"
                  style={{
                    height: 30,
                    width: 150,
                    fontSize: `${fontSize}px`,
                    color: "red",
                    fontWeight: "bold",textAlign:'right'
                  }}
                  id="grandtotal"
                  readOnly={!isEditMode || isDisabled}
                  placeholder="Grand Total"
                  value={formData.grandtotal}
                  // onChange={handleNumberChange}
                />
              </div>
            </div>
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
            disabled={index === 0}
          >
            Previous
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[3] }}
            onClick={handleNext}
            disabled={index === data.length - 1}
          >
            Next
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[4] }}
            onClick={handleFirst}
            disabled={index === 0}
          >
            First
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[5] }}
            onClick={handleLast}
            disabled={index === data.length - 1}
          >
            Last
          </Button>
          <Button
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[6] }}
          >
            Search
          </Button>
          <Button
            className="Buttonz"
            onClick={handleOpen}
            style={{ color: "black", backgroundColor: buttonColors[7] }}
          >
            Print
          </Button>
          <Button
            className="delete"
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

export default SaleService;
