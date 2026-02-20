import React, { useState, useEffect, useRef, forwardRef } from "react";
import "../CashVoucher/CashVoucher.css"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import { BiTrash } from "react-icons/bi";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEditMode } from "../../EditModeContext";
import ProductModal from "../Modals/ProductModal";
import styles from "./StockTransfer.module.css";
import { TextField } from "@mui/material";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { CompanyContext } from '../Context/CompanyContext';
import { useContext } from "react";
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

const StockTransfer = () => {
  
  const { company } = useContext(CompanyContext);
    // const tenant = company?.databaseName;
    const tenant = "03AAYFG4472A1ZG_01042025_31032026"
    const navigate = useNavigate();

    if (!tenant) {
      // you may want to guard here or show an error state,
      // since without a tenant you can’t hit the right API
      console.error("No tenant selected!");
    }
    
  const [fontSize] = useState(17); // Initial font size in pixels
  const [currentDate, setCurrentDate] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const datePickerRef = useRef(null);
  const voucherRef = useRef(null);
  const StockNameRef = useRef([]);
  const AcCodeRef = useRef([]);
  const NarrationRef = useRef([]);
  const pcsIssueRef = useRef([]);
  const pcsReceiptRef = useRef([]);
  const qtyIssueRef = useRef([]);
  const qtyreceiptRef = useRef([]);
  const SaveButtonRef = useRef([]);
  const [title, setTitle] = useState("View");
  const initialColors = ["#E9967A","#F0E68C","#FFDEAD","#ADD8E6","#87CEFA","#FFF0F5","#FFC0CB","#D8BFD8","#DC143C","#DCDCDC","#8FBC8F",];
  const [buttonColors, setButtonColors] = useState(initialColors);
  const [formData, setFormData] = useState({
    date: "",
    voucherno: 0,
    owner: "Owner",
    Balance:"",
    UOM:"",
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
    Narration:"",
    pcsIssue:"",
    pcsReceipt:"",
    qtyIssue:"",
    qtyReceipt:"",
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
  //     Narration:"",
  //     pcsIssue:"",
  //     pcsReceipt:"",
  //     qtyIssue:"",
  //     qtyReceipt:"",
  //   },
  // ]);
// DateError
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
  // DateError
  useEffect(() => {
    if (formData.date) {
      try {
        const date = new Date(formData.date);
        if (!isNaN(date.getTime())) {
          // Ensure the date is valid
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
      const formattedDate = today.toISOString().split("T")[0];
      setSelectedDate(today);
      setDayName(getDayName(today));
      setFormData({ ...formData, date: formattedDate });
      // console.log("Updated formData with today's date:", formattedDate);
    }
  }, [formData.date, setFormData]);

  const handleDateChange = (date) => {
    const today = new Date();
    const selectedDateOnly = new Date(date.setHours(0, 0, 0, 0));
    const todayOnly = new Date(today.setHours(0, 0, 0, 0));

    if (selectedDateOnly < todayOnly) {
      const isConfirmed = window.confirm(
        "The selected date is in the past. Do you want to proceed?"
      );
      if (!isConfirmed) {
        return;
      }
    } else if (selectedDateOnly > todayOnly) {
      const isConfirmed = window.confirm(
        "The selected date is in the future. Do you want to proceed?"
      );
      if (!isConfirmed) {
        return;
      }
    }
    setSelectedDate(date);
    setDayName(getDayName(date));
    setFormData({ ...formData, date: date });
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
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/stocktransfer/last`);
    
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

          setFormData(updatedFormData);
          // Update items and supplier details
          const updatedItems = lastEntry.items.map(item => ({
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
      Balance:"",
      UOM:"",
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
        Narration:"",
        pcsIssue:"",
        pcsReceipt:"",
        qtyIssue:"",
        qtyReceipt:"",
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
  const tableScrollRef = useRef(null);
  const focusAndScroll = (refArray, rowIndex) => {
    const inputEl = refArray.current?.[rowIndex];
    const container = tableScrollRef.current;

    if (!inputEl || !container) return;

    // focus & select
    inputEl.focus();
    setTimeout(() => inputEl.select && inputEl.select(), 0);

    // find row
    const rowEl = inputEl.closest("tr");
    if (!rowEl) return;

    const rowTop = rowEl.offsetTop;
    const rowHeight = rowEl.offsetHeight;
    const containerHeight = container.clientHeight;

    // 🔥 key line — force visibility
    container.scrollTop =
      rowTop - containerHeight + rowHeight + 60;
  };
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
        case "Narration":
            if (pcsIssueRef.current[index]?.disabled) {
              qtyIssueRef.current[index]?.focus();
            } else {
              pcsIssueRef.current[index]?.focus();
            }
            break;
        case "pcsIssue":
          pcsReceiptRef.current[index]?.focus();
          break;
        case "pcsReceipt": {
          if (qtyIssueRef.current[index]?.disabled) {
            if (index === items.length - 1) {
              // ✅ only add when row has data
              handleAddItem();
            }
            setTimeout(() => {
              focusAndScroll(StockNameRef, index + 1);
            }, 0);
          } else {
            focusAndScroll(qtyIssueRef, index);
          }
          break;
        }
          case "qtyIssue":
            qtyreceiptRef.current[index]?.focus();
            break;
          case "qtyReceipt":
          if (index === items.length - 1) {
            handleAddItem();
            setTimeout(() => {
              focusAndScroll(StockNameRef, index + 1);
            }, 0);
          } else {
            focusAndScroll(StockNameRef, index + 1);
          }
          break;
        default:
          break;
      }
    }
  };
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

    // Modal For Items
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const handleItemChange = (index, key, value,field) => {

       // If key is "pkgs" or "weight", allow only numbers and a single decimal point
       if ((key === "Issue" || key === "Receipt" || key === "pcs"|| key === "qty") && !/^\d*\.?\d*$/.test(value)) {
        return; // reject invalid input
      }
      const updatedItems = [...items];
      updatedItems[index][key] = value;
  
      // If the key is 'name', find the corresponding product and set the price
      if (key === "name") {
        const selectedProduct = products.find((product) => product.Aheads === value);
        if (selectedProduct) {
          updatedItems[index]["Acodes"] = selectedProduct.Acodes;
          updatedItems[index]["Aheads"] = selectedProduct.Aheads;
        } else {
          updatedItems[index]["Acodes"] = ""; // Reset price if product not found
          updatedItems[index]["Aheads"] = ""; // Reset gst if product not found
        }
      }
      calculateQtyIssue();
      calculatePcsIssue();
      calculateQtyRec();
      calculatePcsRec();
      setItems(updatedItems);
    };

    const handleAddItem = () => {
      if (isEditMode) {
        const newItem = {
        id: items.length + 1,
        Aheads: "",
        Acodes: "",
        Narration:"",
        pcsIssue:"",
        pcsReceipt:"",
        qtyIssue:"",
        qtyReceipt:"",
        };
        setItems((prevItems) => [...prevItems, newItem]);
        setTimeout(() => {
        StockNameRef.current[items.length].focus();
        }, 100);
      }
    };

    const handleDeleteItem = (index) => {
      if (isEditMode) {
          const confirmDelete = window.confirm("Do you really want to delete this item?");
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
      if(isEditMode){
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

  const handleNext = async () => {
    document.body.style.backgroundColor = "white";
    setTitle("View");
    // console.log(data1._id)
    try {
      if (data1) {
        const response = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/stocktransfer/next/${data1._id}`
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
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/stocktransfer/previous/${data1._id}`
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
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/stocktransfer/first`
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
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/stocktransfer/last`
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
    // let lastvoucherno = formData.voucherno ? parseInt(formData.voucherno) + 1 : 1;
    const lastEntry = await fetchData(); // This should set up the state correctly whether data is found or not
    let lastvoucherno = lastEntry?.formData?.voucherno ? parseInt(lastEntry.formData.voucherno) + 1 : 1;
    const newData = {
      date: "",
      voucherno: lastvoucherno,
      owner: "Owner",
      Balance:"",
      UOM:"",
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
    setTitle('(NEW)')
    skipItemCodeFocusRef.current = true;
    if (datePickerRef.current) {
      datePickerRef.current.setFocus();
    }
  } catch (error) {
    console.error("Error adding new entry:", error);
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
    try {
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/stocktransfer/${data1._id}`;
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


const handleExit = async () => {

    document.body.style.backgroundColor = "white"; // Reset background color
    setTitle("View");
    if(!isEditMode){
      navigate("/dashboard"); 
      return;
    }

    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/stocktransfer/last`
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
          Balance:"",
          UOM:"",
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

      let combinedData;
      if (isAbcmode) {
        combinedData = {
          _id: formData._id,
          formData: {
            date: selectedDate.toLocaleDateString("en-IN"),
            voucherno: formData.voucherno,
            owner: formData.owner,
            Balance: formData.Balance,
            UOM: formData.UOM,
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
          }))
        };
      } else {
        combinedData = {
          _id: formData._id,
          formData: {
            date: selectedDate.toLocaleDateString("en-IN"),
            voucherno: formData.voucherno,
            owner: formData.owner,
            Balance: formData.Balance,
            UOM: formData.UOM,
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
          }))
        };
      }
      // Debugging
      console.log("Combined Data:", combinedData);
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/stocktransfer${isAbcmode ? `/${data1._id}` : ""}`;
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
        setIsSPrintEnabled(true);
        setIsNextEnabled(true);
        setIsSearchEnabled(true);
        setIsDeleteEnabled(true);
        toast.success("Data Saved Successfully!", { position: "top-center" });
      } else {
        setIsAddEnabled(true);
        setIsDisabled(false);
      }
    }
};

const handleItemRateBlur = (id, field) => {
    const decimalPlaces = 3; // Default to 3 decimal places
    setItems((prevItems) =>
      prevItems.map((item) =>
      item.id === id? { ...item,[field]: isNaN(parseFloat(item[field])) ? "": parseFloat(item[field]).toFixed(decimalPlaces),}: item)
    );
};

  const handleSelectAuto = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      UOM: value, // Update the ratecalculate field in FormData
    }));
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

  const isRowFilled = (row) => {
    return (row.Aheads || "").trim() !== "";
  };
  const canEditRow = (rowIndex) => {
      // 🔒 If not in edit mode, nothing is editable
      if (!isEditMode) return false;

      // First row is editable in edit mode
      if (rowIndex === 0) return true;

      // All previous rows must be filled
      for (let i = 0; i < rowIndex; i++) {
        if (!isRowFilled(items[i])) {
          return false;
        }
      }
      return true;
  };
  return (
    <div>
      <ToastContainer />
      <h1 className="HeaderCASH">STOCK TRANSFER</h1>
      <text className="tittle">{title}</text>
      <div className="containers">
        <span style={styles2.dates}>{currentDate}</span>
        <span style={styles2.days}>{currentDay}</span>
      </div>
      <div className={styles.TOPcont} style={{ padding: 5 }}>
        <text style={{ marginRight: 8 }}>VOUCHER DATE:</text>
        <div>
          <DatePicker
            ref={datePickerRef}
            selected={selectedDate || null}
            openToDate={new Date()}
            // onCalendarClose={handleCalendarClose}
            dateFormat="dd-MM-yyyy"
            onChange={handleDateChange}
            // onBlur={() => validateDate(selectedDate)}
            customInput={<MaskedInput />}
          />
          {/* <DatePicker
          popperClassName="custom-datepicker-popper"
          ref={datePickerRef}
          className="cashdate"
          id="date"
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd-MM-yyyy"
        /> */}
        <span style={{ fontWeight: "bold", marginLeft: 10 }}>
          {dayName}
        </span>
        </div>
        <div style={{marginTop:2}}>
          <TextField
          ref={voucherRef}
          className="custom-bordered-input"
          value={formData.voucherno}
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
          sx={{ width: 200 }} // Adjust width as needed
          />
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
          disabled={!isEditMode || isDisabled}
          variant="filled"
        >
          <InputLabel id="supply-label">UOM</InputLabel>
          <Select
            labelId="supply-label"
            id="UOM"
            value={formData.UOM}
            onChange={handleSelectAuto}
            label="UOM"
            displayEmpty
            inputProps={{
              sx: {
                fontSize: 17,
                width:"153px"
              },
            }}
            MenuProps={{ disablePortal: true }}
          >
            <MenuItem value=""><em></em></MenuItem>
            <MenuItem value="Qty">Qty</MenuItem>
            <MenuItem value="Pcs">Pcs</MenuItem>
          </Select>
        </FormControl>
        </div>
        </div>
      <div ref={tableScrollRef} style={{marginTop:5}} className={styles.TableStock}>
        <Table  className="custom-table">
          <thead style={{background: "skyblue", textAlign: "center", position: "sticky", top: 0,}}>
            <tr style={{ color: "#575a5a" }}>
              <th>STOCK ITEM NAME</th>
              <th>NARRATION</th>
              <th>A.CODE</th>
              <th>PCS ISSUE</th>  
              <th>PCS RECEIPT</th>
              <th> QTY ISSUE</th>
              <th>QTY RECEIPT</th>
              {isEditMode && <th className="text-center">DELETE</th>}
            </tr>
          </thead>
          <tbody style={{ overflowY: "auto", maxHeight: "calc(320px - 40px)" }}>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td style={{ padding: 0,width:400}}>
                  <input
                  disabled={!canEditRow(index)}
                  className="ItemCode"
                    style={{height: 40,fontSize: `${fontSize}px`,width: "100%",boxSizing: "border-box",border: "none",padding: 5,}}
                    type="text"
                    value={item.Aheads}
                    onKeyDown={(e) => {handleOpenModal(e, index, "Aheads");
                    //  handleOpenModalBack(e, index, "vcode");
                    handleKeyDown(e, index, "Aheads");
                    }}
                    readOnly={!isEditMode || isDisabled}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                    ref={(el) => (StockNameRef.current[index] = el)}
                  />
                </td>
                <td style={{ padding: 0,width:350}}>
                  <input
                  disabled={!canEditRow(index)}
                    className="Hsn"
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    readOnly={!isEditMode || isDisabled}
                    value={item.Narration}
                    onChange={(e) =>handleItemChange(index, "Narration", e.target.value)}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                    onKeyDown={(e) => {  handleKeyDown(e, index, "Narration")}}
                    ref={(el) => (NarrationRef.current[index] = el)}
                  />
                </td>
                <td style={{ padding: 0,width:120}}>
                  <input
                  className="desc"
                    style={{
                      height: 40,
                      fontSize: `${fontSize}px`,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    disabled={!canEditRow(index)}
                    value={item.Acodes}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                    onKeyDown={(e) => {  handleKeyDown(e, index, "Acodes")}}
                    ref={(el) => (AcCodeRef.current[index] = el)}
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
                    readOnly={!isEditMode || isDisabled}
                    maxLength={48}
                    value={item.pcsIssue}
                    onChange={(e) =>handleItemChange(index, "pcsIssue", e.target.value)}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                    onBlur={() => handleItemRateBlur(item.id, "pcsIssue")}
                    onKeyDown={(e) => {  handleKeyDown(e, index, "pcsIssue")}}
                    ref={(el) => (pcsIssueRef.current[index] = el)}
                    disabled={!canEditRow(index) || parseFloat(item.qtyIssue) > 0}
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
                    readOnly={!isEditMode || isDisabled}
                    maxLength={48}
                    value={item.pcsReceipt}
                    onChange={(e) =>handleItemChange(index, "pcsReceipt", e.target.value)}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                    onBlur={() => handleItemRateBlur(item.id, "pcsReceipt")}
                    onKeyDown={(e) => {  handleKeyDown(e, index, "pcsReceipt")}}
                    ref={(el) => (pcsReceiptRef.current[index] = el)}
                    disabled={!canEditRow(index) || parseFloat(item.qtyReceipt) > 0}
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
                    readOnly={!isEditMode || isDisabled}
                    maxLength={48}
                    value={item.qtyIssue}
                    onChange={(e) =>handleItemChange(index, "qtyIssue", e.target.value)}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                    onBlur={() => handleItemRateBlur(item.id, "qtyIssue")}
                    onKeyDown={(e) => {  handleKeyDown(e, index, "qtyIssue")}}
                    ref={(el) => (qtyIssueRef.current[index] = el)}
                    disabled={!canEditRow(index) || parseFloat(item.pcsIssue) > 0}
                  />
                </td>
                <td style={{padding:0}}>
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
                    readOnly={!isEditMode || isDisabled}
                    value={item.qtyReceipt}
                    onChange={(e) =>handleItemChange(index, "qtyReceipt", e.target.value)}
                    onFocus={(e) => e.target.select()}  // Select text on focus
                    onBlur={() => handleItemRateBlur(item.id, "qtyReceipt")}
                    onKeyDown={(e) => {  handleKeyDown(e, index, "qtyReceipt")}}
                    ref={(el) => (qtyreceiptRef.current[index] = el)}
                    disabled={!canEditRow(index) || parseFloat(item.pcsReceipt) > 0}
                  />
                </td>
                {isEditMode && (
                  <td style={{ padding: 0 }}>
                    {canEditRow(index) && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <IconButton
                          color="error"
                          size="small"
                          tabIndex={-1}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
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
        // <ProductModal
        //   allFields={allFields}
        //   products={products}
        //   onSelect={handleProductSelect}
        //   onClose={() => setShowModal(false)}
        //   fetchProducts={fetchProducts}
        //   initialKey={pressedKey} // Pass the pressed key to the modal
        // />
      )}
      <div className="addbutton" style={{ marginTop: 10 }}>
        <Button className="fw-bold btn-secondary">
          Add Row
        </Button>
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

export default StockTransfer;
