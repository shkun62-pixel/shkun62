import React, { useState, useEffect, useRef, forwardRef } from "react";
import "./ProductionCard.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEditMode } from "../../EditModeContext";
import ProductModal from "../Modals/ProductModal";
import ProductionPDF from "../InvoicePDF/ProductionPDF";
import ProductionReport from "./ProductionReport";
import { CompanyContext } from "../Context/CompanyContext";
import { useContext } from "react";
import { TextField } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import {IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InputMask from "react-input-mask";
import { useNavigate } from "react-router-dom";

const MaskedInput = forwardRef(({ value, onChange, onBlur }, ref) => (
  <InputMask
    mask="99-99-9999"
    maskChar="_"
    value={value}
    onChange={onChange}
    onBlur={onBlur}
  >
    {(inputProps) => <input {...inputProps} ref={ref} className="DatePICKER" />}
  </InputMask>
));

const ProductionCard = () => {
  const { company } = useContext(CompanyContext);
  // const tenant = company?.databaseName;
  const tenant = "03AAYFG4472A1ZG_01042025_31032026"
  const navigate = useNavigate();

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    console.error("No tenant selected!");
  }

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [fontSize] = useState(17); // Initial font size in pixels
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const datePickerRef = useRef(null);
  const voucherRef = useRef(null);
  const StockNameRef = useRef([]);
  const AcCodeRef = useRef([]);
  const NarrationRef = useRef([]);
  const qtyReceiptRef = useRef([]);
  const qtyIssueRef = useRef([]);
  const pcsissueRef = useRef([]);
  const pcsreceiptRef = useRef([]);
  const SaveButtonRef = useRef([]);
  const [title, setTitle] = useState("View");
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
  const [buttonColors] = useState(initialColors);
  const [formData, setFormData] = useState({
    date: "",
    voucherno: 0,
    owner: "Owner",
    UnitNo: "",
    SelectAuto: "",
    totalQtyIssue:"",
    totalPcsIssue:"",
    totalQtyReceipt:"",
    totalPcsReceipt:"",
  });
  const MIN_ROWS = 8;

  const createEmptyRow = (id) => ({
    id,
    Aheads: "",
    Acodes: "",
    Narration: "",
    pcsIssue: "",
    pcsReceipt: "",
    qtyIssue: "",
    qtyReceipt: "",
    Types: "",
    Psrno: "",
    PUnitno: "",
    Percentage: "",
  });

  const normalizeItems = (items = []) => {
    const rows = [...items];

    while (rows.length < MIN_ROWS) {
      rows.push(createEmptyRow(rows.length + 1));
    }

    return rows;
  };

  const [items, setItems] = useState(() => normalizeItems());
  // const [items, setItems] = useState([
  //   {
  //     id: 1,
  //     Aheads: "",
  //     Acodes: "",
  //     Narration: "",
  //     pcsIssue: "",
  //     pcsReceipt: "",
  //     qtyIssue: "",
  //     qtyReceipt: "",
  //     Types: "",
  //     Psrno: "",
  //     PUnitno: "",
  //     Percentage: "",
  //   },
  // ]);

  useEffect(() => {
    const date = new Date();
    const options = { weekday: "long" };
    const day = new Intl.DateTimeFormat("en-US", options).format(date);

    const formattedDate = date.toLocaleDateString();

    setCurrentDate(formattedDate);
    setCurrentDay(day);
  }, []);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayName, setDayName] = useState("");
  const getDayName = (date) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[date.getDay()];
  };

  const formatDDMMYYYY = (date) => {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const y = date.getFullYear();
    return `${d}/${m}/${y}`;
  };
  useEffect(() => {
    if (formData.date) {
      const parts = formData.date.split("/");

      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // JS months are 0-based
        const year = parseInt(parts[2], 10);

        const parsedDate = new Date(year, month, day);

        if (!isNaN(parsedDate.getTime())) {
          setSelectedDate(parsedDate);
        } else {
          console.error("Invalid parsed date:", formData.date);
          setSelectedDate(null);
        }
      } else {
        console.error("Date format should be dd/mm/yyyy:", formData.date);
        setSelectedDate(null);
      }
    } else {
      setSelectedDate(null);
    }
  }, [formData.date]);
  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      setSelectedDate(date);

      const formattedDate = formatDDMMYYYY(date);

      setFormData((prev) => ({
        ...prev,
        date: formattedDate,
      }));

      setDayName(getDayName(date));
    } else {
      console.error("Invalid date value");
    }
  };

  const handleCalendarClose = () => {
    // If no date is selected when the calendar closes, default to today's date
    if (!selectedDate) {
      const today = new Date();
      setSelectedDate(today);
    }
  };

  const handleChangevalues = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/productioncard/last`
      );

      if (response.status === 200 && response.data && response.data.data) {
        const lastEntry = response.data.data;
        // Ensure date is valid
        const isValidDate = (date) => {
          return !isNaN(Date.parse(date));
        };

        // Update form data, use current date if date is invalid or not available
        const updatedFormData = {
          ...lastEntry.formData,
          date: isValidDate(lastEntry.formData.date)
            ? lastEntry.formData.date
            : new Date().toLocaleDateString(),
        };

        setFormData(updatedFormData);
        // Update items and supplier details
        const updatedItems = lastEntry.items.map((item) => ({
          ...item,
        }));
        setItems(normalizeItems(updatedItems));
        // Set data and index
        setData1({ ...lastEntry, formData: updatedFormData });
        setIndex(lastEntry.voucherno);
        return lastEntry; // ✅ Return this for use in handleAdd
      } else {
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
    const emptyFormData = {
      date: "",
      voucherno: 0,
      owner: "Owner",
      UnitNo: "",
      SelectAuto: "",
      totalQtyIssue:"",
      totalPcsIssue:"",
      totalQtyReceipt:"",
      totalPcsReceipt:"",
    };
    const emptyItems = [
      {
        id: 1,
        Aheads: "",
        Acodes: "",
        Narration: "",
        pcsIssue: "",
        pcsReceipt: "",
        qtyIssue: "",
        qtyReceipt: "",
        Types: "",
        Psrno: "",
        PUnitno: "",
        Percentage: "",
      },
    ];
    // Set the empty data
    setFormData(emptyFormData);
    setItems(normalizeItems([]));
    setData1({
      formData: emptyFormData,
      items: emptyItems,
    });
    setIndex(0);
  };

  useEffect(() => {
    fetchData();
    setIsDisabled(true);
    // Add this line to set isDisabled to true initially
  }, []);

  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
  const handleKeyDown = (event, index, field) => {
    if (event.key === "Enter") {
      switch (field) {
        case "Aheads":
          if (items[index].Aheads.trim() === "") {
            SaveButtonRef.current.focus();
          } else {
            NarrationRef.current[index]?.focus();
          }
          break;
        case "Acodes":
          NarrationRef.current[index]?.focus();
          break;
        case "Narration":
          if (pcsissueRef.current[index]?.disabled) {
            pcsreceiptRef.current[index]?.focus();
          }
          if (pcsissueRef.current[index]?.disabled && qtyReceiptRef.current[index]?.disabled) {
            qtyIssueRef.current[index]?.focus();
          }
          if (pcsissueRef.current[index]?.disabled &&pcsreceiptRef.current[index]?.disabled) {
            qtyReceiptRef.current[index]?.focus();
          } else {
            pcsissueRef.current[index]?.focus();
          }
          break;
        case "pcsIssue":
          if (index === items.length - 1) {
            handleAddItem();
          }
          StockNameRef.current[index + 1]?.focus();
          break;
        case "pcsReceipt":
          if (index === items.length - 1) {
            handleAddItem();
          }
          StockNameRef.current[index + 1]?.focus();
          break;
        // case "qtyIssue":
        //   qtyReceiptRef.current[index]?.focus();
        //   break;
        case "qtyReceipt":
          if (index === items.length - 1) {
            handleAddItem();
          }
          StockNameRef.current[index + 1]?.focus();
          break;
        case "qtyIssue":
          if (index === items.length - 1) {
            handleAddItem();
          }
          StockNameRef.current[index + 1]?.focus();
          break;
        default:
          break;
      }
    }
  };

  const calculateQtyIssue = () => {
    const QtyIssue = items.reduce((acc, item) => {
      return acc + parseFloat(item.qtyIssue || 0);
    }, 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalQtyIssue: QtyIssue.toFixed(3),
    }));
  };
  const calculatePcsIssue = () => {
    const PcsIssue = items.reduce((acc, item) => {
      return acc + parseFloat(item.pcsIssue || 0);
    }, 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalPcsIssue: PcsIssue.toFixed(3),
    }));
  };

  const calculateQtyRec = () => {
    // Calculate the total receipt by summing up all receipt_credit values
    const QtyReceipt = items.reduce((acc, item) => {
      return acc + parseFloat(item.qtyReceipt || 0);
    }, 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalQtyReceipt: QtyReceipt.toFixed(3),
    }));
  };

  const calculatePcsRec = () => {
    // Calculate the total receipt by summing up all receipt_credit values
    const PcsReceipt = items.reduce((acc, item) => {
      return acc + parseFloat(item.pcsReceipt || 0);
    }, 0);
    setFormData((prevFormData) => ({
      ...prevFormData,
      totalPcsReceipt: PcsReceipt.toFixed(3),
    }));
  };

  useEffect(() => {
    fetchProducts();

    if (!isAddEnabled && formData.SelectAuto === "Auto Selection One by One") {
      fetchProducts2();
    } else {
      fetchProducts();
    }
  }, [formData.SelectAuto]);

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


  const fetchProducts2 = async () => {
    try {
      const response = await fetch(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/stockmaster`
      );
      const data = await response.json();
      const filteredData = data.data
        .filter((item) => item.formData?.T1 === true)
        .sort((a, b) => (a.formData.Psrno || 0) - (b.formData.Psrno || 0))
        .map((item, index) => ({
          id: index + 1,
          Aheads: item.formData.Aheads || "",
          Acodes: item.formData.Acodes || "",
          Narration: "",
          pcsIssue: "",
          pcsReceipt: "",
          qtyIssue: "",
          qtyReceipt: "",
          Types: item.formData.Types || "",
          Psrno: item.formData.Psrno || "",
          PUnitno: item.formData.PUnitno || "",
          Percentage: item.formData.percentage || "",
        }));
        setItems(normalizeItems(filteredData));
      // setItems(filteredData);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  // Modal For Items
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleItemChange = (index, key, value, field) => {
    // If key is "pkgs" or "weight", allow only numbers and a single decimal point
    if ((key === "pcsIssue" || key === "pcsReceipt" || key === "qtyIssue" || key === "qtyReceipt") && !/^\d*\.?\d*$/.test(value)) {
      return; // reject invalid input
    }
    const updatedItems = [...items];
    updatedItems[index][key] = value;

    // If the key is 'name', find the corresponding product and set the price
    if (key === "name") {
      const selectedProduct = products.find(
        (product) => product.Aheads === value
      );
      if (selectedProduct) {
        updatedItems[index]["Acodes"] = selectedProduct.Acodes;
        updatedItems[index]["Aheads"] = selectedProduct.Aheads;
        updatedItems[index]["Types"] = selectedProduct.Types;
        updatedItems[index]["Psrno"] = selectedProduct.Psrno;
        updatedItems[index]["PUnitno"] = selectedProduct.PUnitno;
        updatedItems[index]["Percentage"] = selectedProduct.percentage;
      } else {
        updatedItems[index]["Acodes"] = ""; // Reset price if product not found
        updatedItems[index]["Aheads"] = ""; // Reset gst if product not found
      }
    }
    // Get Raw Material issue values
    const rawMaterial = updatedItems.find(
      (item) => item.Types === "Raw Material"
    );
    const pcsIssueValue = rawMaterial
      ? parseFloat(rawMaterial.pcsIssue) || 0
      : 0;
    const qtyIssueValue = rawMaterial
      ? parseFloat(rawMaterial.qtyIssue) || 0
      : 0;

    // Initialize total receipts
    let totalPcsReceipt = 0;
    let totalQtyReceipt = 0;
    let wastageIndex = -1;

    updatedItems.forEach((item, idx) => {
      if (item.Types === "Wastage") {
        wastageIndex = idx; // Track wastage index for later adjustment
      }

      if (
        (item.Types === "Finished Product" ||
          item.Types === "Semi-Finished Product") &&
        parseFloat(item.Percentage) > 0
      ) {
        // Calculate based on pcsIssue and update pcsReceipt
        if (pcsIssueValue > 0) {
          const pcsReceiptValue = (
            (pcsIssueValue * parseFloat(item.Percentage)) /
            100
          ).toFixed(3);
          updatedItems[idx]["pcsReceipt"] = pcsReceiptValue;
          totalPcsReceipt += parseFloat(pcsReceiptValue);
        } else {
          updatedItems[idx]["pcsReceipt"] = "0";
        }

        // Calculate based on qtyIssue and update qtyReceipt
        if (qtyIssueValue > 0) {
          const qtyReceiptValue = (
            (qtyIssueValue * parseFloat(item.Percentage)) /
            100
          ).toFixed(3);
          updatedItems[idx]["qtyReceipt"] = qtyReceiptValue;
          totalQtyReceipt += parseFloat(qtyReceiptValue);
        } else {
          updatedItems[idx]["qtyReceipt"] = "0";
        }
      }
    });

    // Adjust wastage for both pcsReceipt and qtyReceipt
    if (wastageIndex !== -1) {
      updatedItems[wastageIndex]["pcsReceipt"] =
        pcsIssueValue > 0 ? (pcsIssueValue - totalPcsReceipt).toFixed(3) : "0";
      updatedItems[wastageIndex]["qtyReceipt"] =
        qtyIssueValue > 0 ? (qtyIssueValue - totalQtyReceipt).toFixed(3) : "0";
    }

    // Handle Manual Selection for matching items
    if (formData.SelectAuto === "Mannauly Selection") {
      const matchingItems = updatedItems.filter(
        (item, idx) =>
          idx !== index &&
          item.Aheads === updatedItems[index].Aheads &&
          item.Types !== "Raw Material" &&
          parseFloat(item.Percentage) > 0
      );

      matchingItems.forEach((match) => {
        if (pcsIssueValue > 0) {
          const pcsReceiptValue = (
            (pcsIssueValue * parseFloat(match.Percentage)) /
            100
          ).toFixed(3);
          match["pcsReceipt"] = pcsReceiptValue;
        } else {
          match["pcsReceipt"] = "0";
        }

        if (qtyIssueValue > 0) {
          const qtyReceiptValue = (
            (qtyIssueValue * parseFloat(match.Percentage)) /
            100
          ).toFixed(3);
          match["qtyReceipt"] = qtyReceiptValue;
        } else {
          match["qtyReceipt"] = "0";
        }
      });
    }
    calculateQtyIssue();
    calculatePcsIssue();
    calculateQtyRec();
    calculatePcsRec();
    setItems(updatedItems);
  };
  // Function to handle adding a new item
  const handleAddItem = () => {
    if (isEditMode) {
      const newItem = {
        id: items.length + 1,
        Aheads: "",
        Acodes: "",
        Narration: "",
        pcsIssue: "",
        pcsReceipt: "",
        qtyIssue: "",
        qtyReceipt: "",
        Types: "",
        Percentage: "",
      };
      setItems((prevItems) => [...prevItems, newItem]);
      setTimeout(() => {
        StockNameRef.current[items.length].focus();
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

  const handleProductSelect = (product) => {
    setIsEditMode(true);
    if (selectedItemIndex !== null) {
      handleItemChange(selectedItemIndex, "name", product.Aheads);
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
    setIsEditMode(true);
  };

  const openModalForItem = (index) => {
    if (isEditMode) {
      setSelectedItemIndex(index);
      setShowModal(true);
    }
  };

  const allFields = products.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });

    return fields;
  }, []);

  const handleOpenModal = (event, index, field) => {
    if (/^[a-zA-Z]$/.test(event.key) && field === "Aheads") {
      setPressedKey(event.key); // Set the pressed key
      openModalForItem(index);
      event.preventDefault(); // Prevent any default action
    }
  };

  const handleSelectAuto = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      SelectAuto: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleNext = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("View");
    // console.log(data1._id)
    try {
      if (data1) {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/productioncard/next/${data1._id}`
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
          setItems(normalizeItems(updatedItems));
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
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/productioncard/previous/${data1._id}`
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
          setItems(normalizeItems(updatedItems));
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
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/productioncard/first`
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
        setItems(normalizeItems(updatedItems));
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
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/productioncard/last`
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
        setItems(normalizeItems(updatedItems));
        setIsDisabled(true);
      }
    } catch (error) {
      console.error("Error fetching last record:", error);
    }
  };

  const skipItemCodeFocusRef = useRef(false);
  const handleAdd = async () => {
    // document.body.style.backgroundColor = "#D5ECF3";
    try {
      const today = new Date().toISOString().slice(0, 10);
      const lastEntry = await fetchData(); // This should set up the state correctly whether data is found or not
      let lastvoucherno = lastEntry?.formData?.voucherno ? parseInt(lastEntry.formData.voucherno) + 1 : 1;
      const newData = {
        date: today,
        voucherno: lastvoucherno,
        owner: "Owner",
        UnitNo: "",
        SelectAuto: "",
        totalQtyIssue:"",
        totalPcsIssue:"",
        totalQtyReceipt:"",
        totalPcsReceipt:"",
      };
      setData([...data, newData]);
      setFormData(newData);
      setItems(normalizeItems([]));
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
      setTitle("(NEW)");
      skipItemCodeFocusRef.current = true;
      if (datePickerRef.current) {
        datePickerRef.current.setFocus();
      }
    } catch (error) {
      console.error("Error adding new entry:", error);
    }
  };
    const handleExit = async () => {

    document.body.style.backgroundColor = "white"; // Reset background color
    setTitle("View");
    if(!isEditMode){
      navigate("/dashboard"); 
      return;
    }

    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/productioncard/last`
      ); // Fetch the latest data

      if (response.status === 200 && response.data.data) {
        // If data is available
        const lastEntry = response.data.data;
        setFormData(lastEntry.formData); // Set form data
        const updatedItems = lastEntry.items.map((item) => ({
          ...item,
        }));
        setItems(normalizeItems(updatedItems));
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
      } else {
        // If no data is available, initialize with default values
        console.log("No data available");
        const newData = {
          date: "",
          voucherno: 0,
          owner: "Owner",
          UnitNo: "",
          SelectAuto: "",
          totalQtyIssue:"",
          totalPcsIssue:"",
          totalQtyReceipt:"",
          totalPcsReceipt:"",
        };
        setFormData(newData); // Set default form data
        setItems(normalizeItems([]));
        setIsDisabled(true); // Disable fields after loading the default data
      }
    } catch (error) {
      console.error("Error fetching data", error);
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
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/productioncard/${data1._id}`;
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
    setTitle("(Edit)");
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
    if (StockNameRef.current[0]) {
      StockNameRef.current[0].focus();
    }
  };

  useEffect(() => {
    if (isEditMode) {
      if (skipItemCodeFocusRef.current) {
        skipItemCodeFocusRef.current = false; // reset
        return;
      }
  
      setTimeout(() => {
        const el = StockNameRef.current[0];
        if (el && !el.disabled) {
          el.focus();
          el.select && el.select();
        }
      }, 0);
    }
  }, [isEditMode]);

  const handleSaveClick = async () => {
    document.body.style.backgroundColor = "white";
    let isDataSaved = false;
    try {
      const nonEmptyItems = items.filter((item) => item.Aheads.trim() !== "");
      if (nonEmptyItems.length === 0) {
        toast.error("Please fill in at least one Items name.", {
          position: "top-center",
        });
        return;
      }
      // Ensure that total Issue and total Receipt are equal
      const totalIssue = formData.totalPcsIssue || formData.totalQtyIssue;
      const totalReceipt = formData.totalPcsReceipt || formData.totalQtyReceipt;
      if (totalIssue !== totalReceipt) {
        toast.error("Total Issue and Total Receipt must be equal.", {
          position: "top-center",
        });
        return;
      }
      
      setIsSubmitEnabled(false);

      let combinedData;
      if (isAbcmode) {
        combinedData = {
          _id: formData._id,
          formData: {
            date: selectedDate.toLocaleDateString("en-IN"),
            voucherno: formData.voucherno,
            owner: formData.owner,
            UnitNo: formData.UnitNo,
            SelectAuto: formData.SelectAuto,
            totalQtyIssue: formData.totalQtyIssue,
            totalPcsIssue: formData.totalPcsIssue,
            totalQtyReceipt: formData.totalQtyReceipt,
            totalPcsReceipt: formData.totalPcsReceipt,
          },
          items: nonEmptyItems.map((item) => ({
            id: item.id,
            Aheads: item.Aheads,
            Acodes: item.Acodes,
            Narration: item.Narration,
            pcsIssue: item.pcsIssue,
            pcsReceipt: item.pcsReceipt,
            qtyIssue: item.qtyIssue,
            qtyReceipt: item.qtyReceipt,
            Types: item.Types,
            Psrno: item.Psrno,
            PUnitno: item.PUnitno,
            Percentage: item.Percentage,
          })),
        };
      } else {
        combinedData = {
          _id: formData._id,
          formData: {
            date: selectedDate.toLocaleDateString("en-IN"),
            voucherno: formData.voucherno,
            owner: formData.owner,
            UnitNo: formData.UnitNo,
            SelectAuto: formData.SelectAuto,
            totalQtyIssue: formData.totalQtyIssue,
            totalPcsIssue: formData.totalPcsIssue,
            totalQtyReceipt: formData.totalQtyReceipt,
            totalPcsReceipt: formData.totalPcsReceipt,
          },
          items: nonEmptyItems.map((item) => ({
            id: item.id,
            Aheads: item.Aheads,
            Acodes: item.Acodes,
            Narration: item.Narration,
            pcsIssue: item.pcsIssue,
            pcsReceipt: item.pcsReceipt,
            qtyIssue: item.qtyIssue,
            qtyReceipt: item.qtyReceipt,
            Types: item.Types,
            Psrno: item.Psrno,
            PUnitno: item.PUnitno,
            Percentage: item.Percentage,
          })),
        };
      }
      // Debugging
      console.log("Combined Data:", combinedData);
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/productioncard${
        isAbcmode ? `/${data1._id}` : ""
      }`;
      const method = isAbcmode ? "put" : "post";
      const response = await axios({
        method,
        url: apiEndpoint,
        data: combinedData,
      });
      if (response) {
        // console.log("Response1234:",response);
        fetchData();
        isDataSaved = true;
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.", {
        position: "top-center",
      });
    } finally {
      if (isDataSaved) {
        setTitle("(View)");
        setIsAddEnabled(true);
        setIsDisabled(true);
        setIsEditMode(false);
        setIsPreviousEnabled(true);
        setIsNextEnabled(true);
        setIsFirstEnabled(true);
        setIsLastEnabled(true);
        setIsSPrintEnabled(true);
        setIsNextEnabled(true);
        setIsSearchEnabled(true);
        setIsDeleteEnabled(true);
        toast.success("Data Saved Successfully!", { position: "top-center" });
      } else {
        setIsAddEnabled(true);
        setIsDisabled(false);
        setIsSubmitEnabled(true); // re-enable submit if saving failed or was skipped
      }
    }
  };

  const handleItemRateBlur = (id, field) => {
    const decimalPlaces = 3; // Default to 3 decimal places
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: isNaN(parseFloat(item[field]))
                ? ""
                : parseFloat(item[field]).toFixed(decimalPlaces),
            }
          : item
      )
    );
  };

  const [openReport, setOpenReport] = useState(false);
  const [showModalReport, setShowModalReport] = useState(false);
  const [reportType, setReportType] = useState("Date-wise");
  const [ahead, setAhead] = useState("All");
  const [transactionType, setTransactionType] = useState("All"); // New state for Receipt/Issue/All
  const [aheadOptions, setAheadOptions] = useState([]);

  const handleOpenModalReport = () => setShowModalReport(true);
  const handleCloseModalReport = () => setShowModalReport(false);

  const handleOpenPDF = () => {
    setShowModalReport(false);
    setOpenReport(true);
  };

  const handleClosePDF = () => setOpenReport(false);

  // Fetch unique Aheads from API
  useEffect(() => {
    const fetchAheads = async () => {
      try {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/productioncard`
        );
        const allAheads = response.data.flatMap((entry) =>
          entry.items.map((item) => item.Aheads)
        );
        const uniqueAheads = ["All", ...new Set(allAheads)];
        setAheadOptions(uniqueAheads);
      } catch (error) {
        console.error("Error fetching Aheads:", error);
      }
    };

    fetchAheads();
  }, []);

  return (
    <div>
      <ToastContainer />
      <h1 className="headerCard">PRODUCTION CARD</h1>
      <text className="tittle">{title}</text>
      <div className="dayanddate">
        <span style={styles2.dates}>{currentDate}</span>
        <span style={styles2.days}>{currentDay}</span>
      </div>
      <div className="TopCard" style={{ padding: 5 }}>
        <span style={{fontWeight:'bold'}}>DATE</span>
          <DatePicker
            ref={datePickerRef}
            selected={selectedDate}
            openToDate={new Date()}
            // onCalendarClose={handleCalendarClose}
            dateFormat="dd-MM-yyyy"
            onChange={handleDateChange}
            // onBlur={() => validateDate(selectedDate)}
            customInput={<MaskedInput />}
          />
           {/* <DatePicker
            ref={datePickerRef}
            className="cashdate"
            id="date"
            selected={selectedDate || null}
            openToDate={new Date()}
            onCalendarClose={handleCalendarClose}
            dateFormat="dd-MM-yyyy"
            onChange={handleDateChange}
          /> */}
        <div style={{display:'flex',flexDirection:'row',marginTop:2}}>
          <TextField
          ref={voucherRef}
          className="VoucherNo custom-bordered-input"
          id="voucherno"
          value={formData.voucherno}
          variant="filled"
          size="small"
          label="VOUCHER NO."
          inputProps={{
            maxLength: 48,
            style: {
              height: "20px",
              fontSize: 16,
            },
            readOnly: !isEditMode || isDisabled
          }}
        />
        <div style={{marginLeft:5}}>
          <TextField
          ref={voucherRef}
          className="VoucherNo custom-bordered-input"
          name="UnitNo"
          value={formData.UnitNo}
          onChange={handleChangevalues}
          variant="filled"
          size="small"
          label="UNIT NO."
          inputProps={{
            maxLength: 48,
            style: {
              height: "20px",
              fontSize: 16,
            },
            readOnly: !isEditMode || isDisabled
          }}
        />
        </div>
        </div>
        <div style={{marginTop:2}}>
        <FormControl
          className="custom-bordered-input"
          sx={{
            fontSize: 17,
            '& .MuiFilledInput-root': {
              height: 48, // adjust as needed (default ~56px for filled)
            },
          }}
          size="small"
          variant="filled"
        >
          <InputLabel id="supply-label">SELECTION TYPE</InputLabel>
          <Select
            labelId="supply-label"
            id="SelectAuto"
            value={formData.SelectAuto}
            onChange={(e) => {
            if (!isEditMode || isDisabled) return; // prevent changing
              handleSelectAuto(e);
            }}
            onOpen={(e) => {
              if (!isEditMode || isDisabled) {
                e.preventDefault(); // prevent dropdown opening
              }
            }}
            // onChange={handleSelectAuto}
            label="SUPPLY TYPE"
            displayEmpty
            inputProps={{
              sx: {
                fontSize: 17,
                width:"258px",
                pointerEvents: (!isEditMode || isDisabled) ? "none" : "auto", // stop mouse clicks
              },
            }}
            MenuProps={{ disablePortal: true }}
          >
            <MenuItem value=""><em></em></MenuItem>
            <MenuItem value="Auto Selection One by One">Auto Selection One by One</MenuItem>
            <MenuItem value="Mannauly Selection">Mannauly Selection</MenuItem>
          </Select>
        </FormControl>
        </div>
      </div>
      <div style={{ marginTop: 5 }} className="TableProd">
        <Table className="custom-table">
          <thead
            style={{
              background: "skyblue",
              textAlign: "center",
              position: "sticky",
              top: 0,
            }}
          >
            <tr style={{ color: "#575a5a" }}>
              <th>STOCK ITEM NAME</th>
              <th>A.CODE</th>
              <th>NARRATION</th>
              <th>PCS ISSUE</th>
              <th>PCS RECEIPT</th>
              <th>QTY ISSUE</th>
              <th>QTY RECEIPT</th>
              {isEditMode && <th className="text-center">DELETE</th>}
            </tr>
          </thead>
          <tbody style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}>
            {items.map((item, index) => {
              const pcsIssue = parseFloat(item.pcsIssue) || 0;
              const pcsReceipt = parseFloat(item.pcsReceipt) || 0;
              const qtyIssue = parseFloat(item.qtyIssue) || 0;
              const qtyReceipt = parseFloat(item.qtyReceipt) || 0;

              const disablePcsIssue =
                pcsReceipt > 0 || qtyIssue > 0 || qtyReceipt > 0;
              const disablePcsReceipt =
                pcsIssue > 0 || qtyIssue > 0 || qtyReceipt > 0;
              const disableQtyIssue =
                pcsIssue > 0 || pcsReceipt > 0 || qtyReceipt > 0;
              const disableQtyReceipt =
                pcsIssue > 0 || pcsReceipt > 0 || qtyIssue > 0;

              return (
                <tr key={item.id}>
                  <td style={{ padding: 0, width: 400 }}>
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
                      value={item.Aheads}
                      onKeyDown={(e) => {
                        handleOpenModal(e, index, "Aheads");
                        //  handleOpenModalBack(e, index, "vcode");
                        handleKeyDown(e, index, "Aheads");
                      }}
                      onFocus={(e) => e.target.select()} // Select text on focus
                      readOnly={!isEditMode || isDisabled}
                      ref={(el) => (StockNameRef.current[index] = el)}
                    />
                  </td>
                  <td style={{ padding: 0, width: 120 }}>
                    <input
                      className="desc"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        color: "black",
                      }}
                      maxLength={48}
                      value={item.Acodes}
                      onChange={(e) =>
                        handleItemChange(index, "Acodes", e.target.value)
                      }
                      onFocus={(e) => e.target.select()} // Select text on focus
                      disabled
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "Acodes");
                      }}
                      ref={(el) => (AcCodeRef.current[index] = el)}
                    />
                  </td>
                  <td style={{ padding: 0, width: 400 }}>
                    <input
                      className="Hsn"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                      }}
                      value={item.Narration}
                      onChange={(e) =>
                        handleItemChange(index, "Narration", e.target.value)
                      }
                      onFocus={(e) => e.target.select()} // Select text on focus
                      readOnly={!isEditMode || isDisabled}
                      onKeyDown={(e) => {
                        handleKeyDown(e, index, "Narration");
                      }}
                      ref={(el) => (NarrationRef.current[index] = el)}
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
                        textAlign: "right",
                      }}
                      name="pcsIssue"
                      value={item.pcsIssue}
                      onChange={(e) =>
                        handleItemChange(index, "pcsIssue", e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                      onBlur={() => handleItemRateBlur(item.id, "pcsIssue")}
                      readOnly={!isEditMode || isDisabled}
                      onKeyDown={(e) => handleKeyDown(e, index, "pcsIssue")}
                      ref={(el) => (pcsissueRef.current[index] = el)}
                      disabled={disablePcsIssue}
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
                        textAlign: "right",
                      }}
                      name="pcsReceipt"
                      value={item.pcsReceipt}
                      onChange={(e) =>
                        handleItemChange(index, "pcsReceipt", e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                      onBlur={() => handleItemRateBlur(item.id, "pcsReceipt")}
                      readOnly={!isEditMode || isDisabled}
                      onKeyDown={(e) => handleKeyDown(e, index, "pcsReceipt")}
                      ref={(el) => (pcsreceiptRef.current[index] = el)}
                      disabled={disablePcsReceipt}
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
                        textAlign: "right",
                      }}
                      name="qtyIssue"
                      value={item.qtyIssue}
                      onChange={(e) =>
                        handleItemChange(index, "qtyIssue", e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                      onBlur={() => handleItemRateBlur(item.id, "qtyIssue")}
                      readOnly={!isEditMode || isDisabled}
                      onKeyDown={(e) => handleKeyDown(e, index, "qtyIssue")}
                      ref={(el) => (qtyIssueRef.current[index] = el)}
                      disabled={disableQtyIssue}
                    />
                  </td>

                  <td style={{ padding: 0 }}>
                    <input
                      className="Disc"
                      style={{
                        height: 40,
                        fontSize: `${fontSize}px`,
                        width: "100%",
                        boxSizing: "border-box",
                        border: "none",
                        padding: 5,
                        textAlign: "right",
                      }}
                      name="qtyReceipt"
                      value={item.qtyReceipt}
                      onChange={(e) =>
                        handleItemChange(index, "qtyReceipt", e.target.value)
                      }
                      onFocus={(e) => e.target.select()}
                      onBlur={() => handleItemRateBlur(item.id, "qtyReceipt")}
                      readOnly={!isEditMode || isDisabled}
                      onKeyDown={(e) => handleKeyDown(e, index, "qtyReceipt")}
                      ref={(el) => (qtyReceiptRef.current[index] = el)}
                      disabled={disableQtyReceipt}
                    />
                  </td>
                  {isEditMode && (
                  <td style={{ padding: 0}}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",  // horizontally center
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
              );
            })}
          </tbody>
          <tfoot style={{ background: "skyblue", position: "sticky", bottom: -1, fontSize: `${fontSize}px`,borderTop:"1px solid black" }}>
            <tr style={{ fontWeight: "bold", textAlign: "right" }}>
              <td colSpan={3}></td>
              <td>{Number(formData.totalPcsIssue) === 0 ? "" : formData.totalPcsIssue}</td>
              <td>{Number(formData.totalPcsReceipt) === 0 ? "" : formData.totalPcsReceipt}</td>
              <td>{Number(formData.totalQtyIssue) === 0 ? "" : formData.totalQtyIssue}</td>
              <td>{Number(formData.totalQtyReceipt) === 0 ? "" : formData.totalQtyReceipt}</td>
              {isEditMode && <td></td>}
            </tr>
          </tfoot>
        </Table>
      </div>
      {showModal && (
      <ProductModal
        products={products}
        allFields={allFields}
        onSelect={handleProductSelect}
        onClose={handleModalDone}
        tenant={tenant}
        initialKey={pressedKey}
        fetchParentProducts={fetchProducts}
      />
      )}
      <div className="addbutton" style={{ marginTop: 10 }}>
        <Button className="fw-bold btn-secondary">Add Row</Button>
      </div>
      <div className="Belowcontent">
        <div className="Buttonsgroupz">
          <Button
            disabled={!isAddEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[0] }}
            onClick={handleAdd}
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
            disabled={!isPreviousEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[2] }}
            onClick={handlePrevious}
          >
            Previous
          </Button>
          <Button
            disabled={!isNextEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[3] }}
            onClick={handleNext}
          >
            Next
          </Button>
          <Button
            disabled={!isFirstEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[4] }}
            onClick={handleFirst}
          >
            First
          </Button>
          <Button
            disabled={!isLastEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[5] }}
            onClick={handleLast}
          >
            Last
          </Button>
          <Button
            disabled={!isSearchEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[6] }}
          >
            Search
          </Button>
          <Button
            onClick={handleOpen}
            disabled={!isPrintEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[7] }}
          >
            Print
          </Button>
          <ProductionPDF
            formData={formData}
            items={items}
            isOpen={open}
            handleClose={handleClose}
          />
          <Button
            onClick={handleOpenModalReport}
            disabled={!isPrintEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: "lightcoral" }}
          >
            Report
          </Button>
          {/* Modal for selecting Report Type, Ahead, and Transaction Type */}
          <Modal show={showModalReport} onHide={handleCloseModalReport}>
            <Modal.Header closeButton>
              <Modal.Title>Select Report Options</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                {/* Report Type Dropdown */}
                <div style={{marginTop:3}}>
                <FormControl
                  className="custom-bordered-input"
                  sx={{
                    // width: '250px',
                    fontSize: `${fontSize}px`,
                    '& .MuiFilledInput-root': {
                      height: 48, // adjust as needed (default ~56px for filled)
                    },
                  }}
                  size="small"
                  variant="filled"
                >
                  <InputLabel id="supply-label">REPORT BY</InputLabel>
                  <Select
                  className="Report"
                    labelId="supply-label"
                    id="supply"
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                    label="REPORT BY"
                    displayEmpty
                    inputProps={{
                      sx: {
                        fontSize: `${fontSize}px`,
                      },
                    }}
                    MenuProps={{ disablePortal: true }}
                  >
                    <MenuItem value="Date-wise">Date-wise</MenuItem>
                    <MenuItem value="Month-wise">Month-wise</MenuItem>
                  </Select>
                </FormControl>
                </div>
                {/* Transaction Type Dropdown */}
                <div style={{marginTop:3}}>
                <FormControl
                  className="custom-bordered-input"
                  sx={{
                    // width: '250px',
                    fontSize: `${fontSize}px`,
                    '& .MuiFilledInput-root': {
                      height: 48, // adjust as needed (default ~56px for filled)
                    },
                  }}
                  size="small"
                  variant="filled"
                >
                  <InputLabel id="filter">FILTER BY</InputLabel>
                  <Select
                  className="Report"
                    labelId="filter"
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    label="FILTER BY"
                    displayEmpty
                    inputProps={{
                      sx: {
                        fontSize: `${fontSize}px`,
                      },
                    }}
                    MenuProps={{ disablePortal: true }}
                  >
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Issue">Issue</MenuItem>
                    <MenuItem value="Receipt">Receipt</MenuItem>
                  </Select>
                </FormControl>
                </div>
                {/* Aheads Dropdown */}
                <div style={{marginTop:3}}>
                <FormControl
                  className="custom-bordered-input"
                  sx={{
                    // width: '250px',
                    fontSize: `${fontSize}px`,
                    '& .MuiFilledInput-root': {
                      height: 48, // adjust as needed (default ~56px for filled)
                    },
                  }}
                  size="small"
                  variant="filled"
                >
                  <InputLabel id="product">PRODUCT NAME</InputLabel>
                  <Select
                  className="Report"
                    labelId="product"
                    value={ahead}
                    onChange={(e) => setAhead(e.target.value)}
                    label="PRODUCT NAME"
                    displayEmpty
                    inputProps={{
                      sx: {
                        fontSize: `${fontSize}px`,
                      },
                    }}
                    MenuProps={{ disablePortal: true }}
                  >
                    {aheadOptions.map((option, index) => (
                      <MenuItem key={index} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                </div>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModalReport}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleOpenPDF}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
          <ProductionReport
            isOpen={openReport}
            handleClose={handleClosePDF}
            reportType={reportType}
            selectedAhead={ahead}
            transactionType={transactionType} // Passing the selected transaction type
          />
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
          <Button
            ref={SaveButtonRef}
            disabled={!isSubmitEnabled}
            className="Buttonz"
            style={{ color: "black", backgroundColor: buttonColors[10] }}
            onClick={handleSaveClick}
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

export default ProductionCard;
