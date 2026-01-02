// import React,{useState,useEffect} from 'react'
// import { Button } from 'react-bootstrap';
// import AccountWiseSummPur from './IncomeTaxReports/PurchaseReports/AccountWiseSummPur';

// const Example = () => {
//   const [openPurRep, setopenPurRep] = useState(false);

//     useEffect(() => {
//     // Auto open the modal when component mounts
//     setopenPurRep(true);
//   }, []);

//   return (
//     <div>
//       {/* <Button onClick={() => setopenPurRep(true)}>Open Pur Report</Button> */}
//       <AccountWiseSummPur 
//         show={openPurRep} 
//         onClose={() => setopenPurRep(false)} 
//       />
//     </div>
//   )
// }

// export default Example


// import React, { useState, useEffect } from 'react';
// import InputMask from "react-input-mask";
// import financialYear from './Shared/financialYear';

// const Example = () => {
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setFromDate(formatDate(fy.start)); // converted
//     setToDate(formatDate(fy.end));     // converted
//   }, []);

//   return (
//     <div>
//       <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
//         <label className="form-label" style={{ width: "120px" }}>From Date</label>
//         <InputMask
//           mask="99-99-9999"
//           placeholder="dd-mm-yyyy"
//           value={fromDate}
//           onChange={(e) => setFromDate(e.target.value)}
//         >
//           {(inputProps) => <input {...inputProps} className="form-control" />}
//         </InputMask>
//       </div>

//       <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
//         <label className="form-label" style={{ width: "120px"}}>To Date</label>
//         <InputMask
//           mask="99-99-9999"
//           placeholder="dd-mm-yyyy"
//           value={toDate}
//           onChange={(e) => setToDate(e.target.value)}
//         >
//           {(inputProps) => <input {...inputProps} className="form-control" />}
//         </InputMask>
//       </div>
//     </div>
//   );
// };

// export default Example;

// import React,{useEffect} from 'react'
// import { useNavigate, useLocation } from "react-router-dom";

// const Example = () => {
//     const location = useLocation();
//     const saleId = location.state?.saleId;
//     const navigate = useNavigate();

// useEffect(() => {
//   const handleEsc = (e) => {
//     if (e.key === "Escape") {
//       navigate(-1, {
//         state: {
//           keepModalOpen: true,
//           accountName: location.state?.accountName,
//         },
//         replace: true,
//       });
//     }
//   };

//   window.addEventListener("keyup", handleEsc);
//   return () => window.removeEventListener("keyup", handleEsc);
// }, [navigate, location.state]);


//   return (
//     <div>
//       <h1>{saleId}</h1>
//     </div>
//   )
// }

// export default Example


import React,{useState,useRef,useEffect} from 'react'
import ProductModal from './Modals/ProductModal';
import { Table,Button } from 'react-bootstrap';
import { useEditMode } from '../EditModeContext';
import {IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Example = () => {
  const { isEditMode, setIsEditMode } = useEditMode(); // Access the context
  const tenant = "shkun_05062025_05062026";
  const createEmptyRow = (id) => ({
    id,
    vcode: "",
    sdisc: "",
    Units: "",
    pkgs: "0.00",
    weight: "0.00",
    rate: "0.00",
    amount: "0.00",
    disc: 0,
    discount: "",
    gst: 0,
    Pcodes01: "",
    Pcodess: "",
    Scodes01: "",
    Scodess: "",
    Exp_rate1: 0,
    Exp_rate2: 0,
    Exp_rate3: 0,
    Exp_rate4: 0,
    Exp_rate5: 0,
    Exp1: 0,
    Exp2: 0,
    Exp3: 0,
    Exp4: 0,
    Exp5: 0,
    exp_before: 0,
    RateCal: "",
    Qtyperpc: 0,
    ctax: "0.00",
    stax: "0.00",
    itax: "0.00",
    tariff: "",
    vamt: "0.00",
  });

  const [items, setItems] = useState([
    {
      id: 1,
      vcode: "",
      sdisc: "",
      Units: "",
      pkgs: "0.00",
      weight: "0.00",
      rate: "0.00",
      amount: "0.00",
      disc: 0,
      discount: "",
      gst: 0,
      Pcodes01: "",
      Pcodess: "",
      Scodes01: "",
      Scodess: "",
      Exp_rate1: 0,
      Exp_rate2: 0,
      Exp_rate3: 0,
      Exp_rate4: 0,
      Exp_rate5: 0,
      Exp1: 0,
      Exp2: 0,
      Exp3: 0,
      Exp4: 0,
      Exp5: 0,
      exp_before: 0,
      RateCal: "",
      Qtyperpc: 0,
      ctax: "0.00",
      stax: "0.00",
      itax: "0.00",
      tariff: "",
      vamt: "0.00",
    },
  ]);
  useEffect(() => {
  setItems([
    createEmptyRow(1),
    createEmptyRow(2),
    createEmptyRow(3),
    createEmptyRow(4),
  ]);
}, []);

  
    React.useEffect(() => {
      // Fetch products from the API when the component mounts
      fetchProducts();
    }, []);
  
    const fetchProducts = async (search = "") => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/stockmaster?search=${encodeURIComponent(search)}`
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
  
    const capitalizeWords = (str) => {
      return str.replace(/\b\w/g, (char) => char.toUpperCase());
    };
  
    // Modal For Items
    const [products, setProducts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleItemChange = (index, key, value, field) => {
      const updatedItems = [...items];
      if (["sdisc"].includes(key)) {
        updatedItems[index][key] = capitalizeWords(value);  
      } else {
        updatedItems[index][key] = value;
      }
      if (key === "name") {
        const selectedProduct = products.find(
          (product) => product.Aheads === value
        );
        if (selectedProduct) {
          updatedItems[index]["vcode"] = selectedProduct.Acodes;
          updatedItems[index]["sdisc"] = selectedProduct.Aheads;
        } else {
          updatedItems[index]["rate"] = ""; // Reset price if product not found
          updatedItems[index]["gst"] = ""; // Reset gst if product not found
        }
      }
      setItems(updatedItems);
    };
  
    // Function to handle adding a new item
    const handleAddItem = () => {
        const newItem = {
          id: items.length + 1,
          vcode: "",
          sdisc: "",
          Units: "",
          pkgs: 0,
          weight: 0,
          rate: 0,
          amount: 0,
          disc: 0,
          discount: "",
          gst: 0,
          Pcodes01: "",
          Pcodess: "",
          Scodes01: "",
          Scodess: "",
          Exp_rate1: "" || 0,
          Exp_rate2: "" || 0,
          Exp_rate3: "" || 0,
          Exp_rate4: "" || 0,
          Exp_rate5: "" || 0,
          Exp1: 0,
          Exp2: 0,
          Exp3: 0,
          Exp4: 0,
          Exp5: 0,
          exp_before: 0,
          ctax: 0,
          stax: 0,
          itax: 0,
          tariff: "",
          vamt: 0,
        };
        setItems((prevItems) => [...prevItems, newItem]);
    };
  
  const handleProductSelect = (product) => {
      if (selectedItemIndex !== null) {
        handleItemChange(selectedItemIndex, "name", product.Aheads);
        setShowModal(false);
      }
  };
  
    const handleModalDone = (product) => {
      if (product) {
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
  const [pressedKey, setPressedKey] = useState(""); // State to hold the pressed key
  const tableContainerRef = useRef(null);
  const itemCodeRefs = useRef([]);
  const desciptionRefs = useRef([]);
  const peciesRefs = useRef([]);
  const quantityRefs = useRef([]);
  const priceRefs = useRef([]);
  const amountRefs = useRef([]);
  const hsnCodeRefs = useRef([]);
  const fieldOrder = [
  { name: "vcode",      refArray: itemCodeRefs },
  { name: "sdisc",      refArray: desciptionRefs },
  { name: "tariff",     refArray: hsnCodeRefs },
  { name: "pkgs",       refArray: peciesRefs },
  { name: "weight",     refArray: quantityRefs },
  { name: "rate",       refArray: priceRefs },
  { name: "amount",     refArray: amountRefs },
];

const focusRef = (refArray, rowIndex) => {
  const el = refArray?.current?.[rowIndex];
  if (el) {
    el.focus();
    // Safely call select if available
    setTimeout(() => el.select && el.select(), 0);
    return true;
  }
  return false;
};
const focusScrollRow = (refArray, rowIndex) => {
  const inputEl = refArray?.current?.[rowIndex];
  const container = tableContainerRef.current;

  if (!inputEl || !container) return;

  inputEl.focus();
  setTimeout(() => inputEl.select && inputEl.select(), 0);

  const rowEl = inputEl.closest("tr");
  if (!rowEl) return;

  const rowTop = rowEl.offsetTop;
  const rowHeight = rowEl.offsetHeight;
  const containerHeight = container.clientHeight;

  container.scrollTop =
    rowTop - containerHeight + rowHeight + 40;
};

const isRowFilled = (row) => {
  return (row.sdisc || "").trim() !== "";
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


const handleKeyDown = (event, index, field) => {
  if (event.key === "Enter" || event.key === "Tab") {
    event.preventDefault();
    if (field === "vcode") {
      if ((items[index].sdisc || "").trim() === "") {
        alert("Please enter Description before Item Code.");
      } else {
        focusRef(desciptionRefs, index);
      }
      return;
    }
    if (field === "amount") {
      const isLastRow = index === items.length - 1;

    if (isLastRow) {
      handleAddItem();

      setTimeout(() => {
        focusScrollRow(itemCodeRefs, index + 1);
      }, 0);
    }
 else {
        focusScrollRow(itemCodeRefs, index + 1);
      }
      return;
    }
    const currentPos = fieldOrder.findIndex((f) => f.name === field);

    if (currentPos !== -1) {
      for (let i = currentPos + 1; i < fieldOrder.length; i++) {
        const nextField = fieldOrder[i];
        // Only move if that ref exists for this row (means column is visible)
        if (focusRef(nextField.refArray, index)) {
          return;
        }
      }
    }
    return;
  }
  else if (/^[a-zA-Z]$/.test(event.key) && field === "vcode") {
    setPressedKey(event.key);
    openModalForItem(index);
    event.preventDefault();
  }
};
  const handleEditClick = () => {
    setIsEditMode(true);
  };

  return (
    <div>
      <div ref={tableContainerRef} style={{marginTop:5}} className="TableContainer">
        <Table className="custom-table">
          <thead
            style={{
              textAlign: "center",
              position: "sticky",
              top: 0,
            }}
          >
            <tr style={{ color: "#575a5a" }}>
              <th>ITEMCODE</th>
              <th>DESCRIPTION</th>
              <th>HSNCODE</th>
              <th>PCS</th>
              <th>QTY</th>
              <th>RATE</th>
              <th>AMOUNT</th>
              {isEditMode && <th className="text-center">DELETE</th>}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id}>
                <td style={{ padding: 0, width: 30 }}>
                  <input
                  disabled={!canEditRow(index)}
                    className="ItemCode"
                    style={{
                      height: 40,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    type="text"
                    value={item.vcode}
                    readOnly
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "vcode");
                    }}
                    ref={(el) => (itemCodeRefs.current[index] = el)}
                  />
                </td>
                <td style={{ padding: 0, width: 300 }}>
                  <input
                  disabled={!canEditRow(index)}
                    className="desc"
                    style={{
                      height: 40,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                    }}
                    maxLength={48}
                    value={item.sdisc}
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "sdisc");
                    }}
                      ref={(el) => (desciptionRefs.current[index] = el)}
                  />
                </td>
                <td style={{ padding: 0 }}>
                  <input
                    className="Hsn"
                    style={{
                      height: 40,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                      textAlign: "right",
                    }}
                    value={item.tariff}
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "tariff");
                    }}
                      ref={(el) => (hsnCodeRefs.current[index] = el)}
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
                    value={Number(item.pkgs) === 0 ? "" : item.pkgs}
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "pkgs");
                    }}
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
                    value={item.weight} // Show raw value during input
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
                    value={item.rate} // Show raw value during input
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "rate");
                    }}
                      ref={(el) => (priceRefs.current[index] = el)}
                  />
                </td>            
                <td style={{ padding: 0 }}>
                  <input
                    className="Amount"
                    style={{
                      height: 40,
                      width: "100%",
                      boxSizing: "border-box",
                      border: "none",
                      padding: 5,
                      textAlign: "right",
                    }}
                    value={item.amount}
                    onKeyDown={(e) => {
                      handleKeyDown(e, index, "amount");
                    }}
                      ref={(el) => (amountRefs.current[index] = el)}
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
          <tfoot style={{ background: "#f0f0f0", position: "sticky", bottom: -6,borderTop:"1px solid black" }}>
          <tr style={{ fontWeight: "bold", textAlign: "right" }}>
              <td></td>
              <td>TOTAL</td>
              <td></td>
              <td>{items.reduce((sum, item) => sum + parseFloat(item.pkgs || 0), 0).toFixed(3)}</td>
              <td>{items.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0).toFixed(3)}</td>
              <td></td>
              <td>{items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0).toFixed(2)}</td>
              <td></td>
          </tr>
          </tfoot>

        </Table>
      </div>
      <Button onClick={handleAddItem}>ADD</Button>
      <Button onClick={handleEditClick}>EDIT</Button>
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
    </div>
  )
}

export default Example

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { Table, Modal, Button, Card, Form } from "react-bootstrap";  // ✅ Form imported
// import styles from "./AccountStatement/LedgerList.module.css";
// import { useNavigate, useLocation } from "react-router-dom";  // ✅ Add this
// import "react-datepicker/dist/react-datepicker.css";
// import useCompanySetup from "./Shared/useCompanySetup";
// import financialYear from "./Shared/financialYear";

// const SEARCH_COL_STORAGE_KEY = "ledger_search_columns";

// const Example = () => {

//   const { dateFrom, companyName, companyAdd, companyCity } = useCompanySetup();

//   // Filter Ledgers
//   const [ledgers, setLedgers] = useState([]);
//   const [filteredLedgers, setFilteredLedgers] = useState([]); // ✅ for search
//   const [searchTerm, setSearchTerm] = useState("");           // ✅ search state
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedLedger, setSelectedLedger] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const rowRefs = useRef([]);
//   const tableRef = useRef(null);

//   const tableContainerRef = useRef(null);
//   const txnContainerRef = useRef(null);

//   const searchRef = useRef(null);   // ✅ search input ref
//   const navigate = useNavigate();
//   const [activeRowIndex, setActiveRowIndex] = useState(0);  // ✅ Track highlighted txn row
//   const location = useLocation();
//   const [checkedRows, setCheckedRows] = useState({});
//   const [ledgerFromDate, setLedgerFromDate] = useState(null);
//   const [ledgerToDate, setLedgerToDate] = useState(() => new Date());

//   useEffect(() => {
//     if (!ledgerFromDate && dateFrom) {
//       setLedgerFromDate(new Date(dateFrom));
//     }
//   }, [dateFrom, ledgerFromDate]);

//   const [filterType, setFilterType] = useState("All");     // ✅ Debit / Credit / All
//   const [filteredTransactions, setFilteredTransactions] = useState([]); // ✅ For filtered txns
//   const [narrationFilter, setNarrationFilter] = useState(""); // ✅ for narration
//   const [selectedRows, setSelectedRows] = useState({});
//   const [selectionFilter, setSelectionFilter] = useState("All"); 

//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setFromDate(fy.start); // converted
//     setToDate(fy.end);     // converted
//   }, []);

//   // ✅ Update filtered transactions whenever filters or transactions change
//   useEffect(() => {
//     let data = transactions;

//     // ✅ Filter by Debit/Credit
//     if (filterType !== "All") {
//       data = data.filter(
//         (txn) => txn.type.toLowerCase() === filterType.toLowerCase()
//       );
//     }

//     // ✅ Filter by narration
//     if (narrationFilter.trim() !== "") {
//       data = data.filter((txn) =>
//         txn.narration?.toLowerCase().includes(narrationFilter.toLowerCase())
//       );
//     }

//     // ✅ Filter by Date range
//     if (fromDate) {
//       data = data.filter((txn) => new Date(txn.date) >= fromDate);
//     }
//     if (toDate) {
//       data = data.filter((txn) => new Date(txn.date) <= toDate);
//     }

//     // ✅ Filter by selection (Selected / Unselected / All)
//     if (selectionFilter === "Selected") {
//       data = data.filter((txn) => selectedRows[txn._id]);
//     } else if (selectionFilter === "Unselected") {
//       data = data.filter((txn) => !selectedRows[txn._id]);
//     }

//     setFilteredTransactions(data);
//   }, [
//     filterType,
//     narrationFilter,
//     fromDate,
//     toDate,
//     selectionFilter,   // 👈 added dependency
//     selectedRows,      // 👈 added dependency
//     transactions,
//   ]);

//   const [flaggedRows, setFlaggedRows] = useState(() => {
//     const saved = localStorage.getItem("flaggedRows");
//     return saved ? new Set(JSON.parse(saved)) : new Set();
//   });

//   // Fetch ledger list
//   useEffect(() => {
//     axios
//       .get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount")
//       .then((res) => {
//         const data = res.data.data || [];
//         setLedgers(data);
//         setFilteredLedgers(data); // ✅ keep backup
//       })
//       .catch((err) => console.error(err));
//   }, []);

//   // Handle keyboard navigation for LedgerList
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!filteredLedgers.length) return;

//       if (e.key === "ArrowDown") {
//         setSelectedIndex((prev) => (prev + 1) % filteredLedgers.length);
//       } else if (e.key === "ArrowUp") {
//         setSelectedIndex((prev) =>
//           prev === 0 ? filteredLedgers.length - 1 : prev - 1
//         );
//       } else if (e.key === "Enter") {
//         const ledger = filteredLedgers[selectedIndex];
//         openLedgerDetails(ledger);
//         setSearchTerm(""); // Clear search on open
//       } else if (e.key === "F3") {
//         e.preventDefault();
//         setFlaggedRows((prev) => {
//           const newSet = new Set(prev);
//           if (newSet.has(selectedIndex)) {
//             newSet.delete(selectedIndex); // unflag if already red
//           } else {
//             newSet.add(selectedIndex); // mark as red
//           }
//           return newSet;
//         });
//       }
//     };

//     if (!showModal) {
//       window.addEventListener("keydown", handleKeyDown);
//     }
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [filteredLedgers, selectedIndex, showModal]);

//   // Open modal and fetch transactions
//   const openLedgerDetails = (ledger) => {
//   setSelectedLedger(ledger);
//   axios
//     .get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile")
//     .then((res) => {
//       const allTxns = res.data.data || [];

//       // Flatten transactions and attach saleId from parent voucher
//       const ledgerTxns = allTxns.flatMap((entry) =>
//         entry.transactions
//           .filter((txn) => txn.account.trim() === ledger.formData.ahead.trim())
//           .map((txn) => ({
//             ...txn,
//             saleId: entry.saleId || null, // ✅ attach saleId for Sales
//             purId: entry.purchaseId || null,
//             bankId: entry.bankId || null,  
//             cashId: entry.cashId || null,  
//             journalId: entry.journalId || null, 
//           }))
//       );

//       setTransactions(ledgerTxns);
//       setShowModal(true);
//     })
//     .catch((err) => console.error(err));
// };

//   const handleCheckboxChange = (id) => {
//     setCheckedRows((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   // ✅ Define all possible columns for Modify functionality
//   const ALL_COLUMNS = [
//     { key: "ahead", label: "NAME"},
//     { key: "Bsgroup", label: "GROUP", width: "200px" },
//     { key: "acode", label: "A/C CODE", width: "90px" },
//     { key: "gstNo", label: "GST NO" },
//     { key: "city", label: "CITY" },
//     { key: "distt", label: "DISTRICT" },
//     { key: "state", label: "STATE" },
//     { key: "pinCode", label: "PINCODE" },
//     { key: "area", label: "AREA" },
//     { key: "distance", label: "DISTANCE" },
//     { key: "pan", label: "PAN" },
//     { key: "phone", label: "PHONE" },
//     { key: "email", label: "EMAIL" },
//     { key: "agent", label: "AGENT" },
//     { key: "add1", label: "ADDRESS" },
//     { key: "opening_dr", label: "OPENING DR" },
//     { key: "opening_cr", label: "OPENING CR" },
//     { key: "msmed", label: "MSMED" },
//     { key: "group", label: "GROUP NAME" },
//     { key: "tcs206", label: "TCS 206" },
//     { key: "tds194q", label: "TDS 194Q" },
//     { key: "tdsno", label: "TDS NO" },
//     { key: "tds_rate", label: "TDS RATE" },
//     { key: "tcs_rate", label: "TCS RATE" },
//     { key: "sur_rate", label: "SURCHARGE RATE" },
//     { key: "wahead", label: "WAREHOUSE NAME" },
//     { key: "wadd1", label: "WAREHOUSE ADD 1" },
//     { key: "wadd2", label: "WAREHOUSE ADD 2" },
//     { key: "Rc", label: "RC" },
//     { key: "Ecc", label: "ECC" },
//     { key: "erange", label: "E RANGE" },
//     { key: "collc", label: "COLLECTION" },
//     { key: "srvno", label: "SERVICE NO" },
//     { key: "cperson", label: "CONTACT PERSON" },
//     { key: "irate", label: "INTEREST RATE" },
//     { key: "weight", label: "WEIGHT" },
//     { key: "bank_ac", label: "BANK A/C" },
//     { key: "narration", label: "NARRATION" },
//     { key: "subname", label: "SUB NAME" },
//     { key: "subaddress", label: "SUB ADDRESS" },
//     { key: "subcity", label: "SUB CITY" },
//     { key: "subgstNo", label: "SUB GST NO" },
//     { key: "payLimit", label: "PAY LIMIT" },
//     { key: "payDuedays", label: "PAY DUE DAYS" },
//     { key: "graceDays", label: "GRACE DAYS" },
//     { key: "sortingindex", label: "SORTING INDEX" },
//     { key: "qtyBsheet", label: "QTY B/SHEET" },
//     { key: "discount", label: "DISCOUNT" },
//     { key: "Terms", label: "TERMS" },
//     { key: "tradingAc", label: "TRADING A/C" },
//     { key: "prefixPurInvoice", label: "PREFIX PUR INV" },
//     { key: "status", label: "STATUS" },
//   ];

//   const [showColumnModal, setShowColumnModal] = useState(false);
//   const STORAGE_KEY = "ledger_visible_columns";

//   const [visibleColumns, setVisibleColumns] = useState(() => {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) {
//       return JSON.parse(saved);
//     }

//     // default columns (first time only)
//     return ALL_COLUMNS.reduce((acc, col) => {
//       acc[col.key] = ["ahead", "Bsgroup", "city", "gstNo", "phone"].includes(col.key);
//       return acc;
//     }, {});
//   });
//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns));
//   }, [visibleColumns]);
  
// const [searchColumns, setSearchColumns] = useState(() => {
//   const saved = localStorage.getItem(SEARCH_COL_STORAGE_KEY);

//   if (saved) {
//     return JSON.parse(saved);
//   }

//   // default (first load only)
//   return ALL_COLUMNS.reduce((acc, col) => {
//     acc[col.key] = false;
//     return acc;
//   }, {});
// });
// useEffect(() => {
//   localStorage.setItem(
//     SEARCH_COL_STORAGE_KEY,
//     JSON.stringify(searchColumns)
//   );
// }, [searchColumns]);

//   // ✅ Handle search filtering
// useEffect(() => {
//   const lower = searchTerm.toLowerCase();

//   const activeCols = Object.keys(searchColumns).filter(
//     (key) => searchColumns[key]
//   );

//   const filtered = ledgers.filter((ledger) => {
//     const colsToSearch =
//       activeCols.length > 0 ? activeCols : ["ahead"];

//     return colsToSearch.some((key) => {
//       const value = ledger.formData[key]?.toString().toLowerCase();
//       if (!value) return false;

//       // ✅ No checkbox → prefix search
//       if (activeCols.length === 0) {
//         return value.startsWith(lower);
//       }

//       // ✅ Checkbox selected → contains search
//       return value.includes(lower);
//     });
//   });

//   setFilteredLedgers(filtered);
//   setSelectedIndex(0);
// }, [searchTerm, ledgers, searchColumns]);

// useEffect(() => {
//   const handleKeyDown = (e) => {
//     // Ignore modifier keys
//     if (e.ctrlKey || e.altKey || e.metaKey) return;

//     const tag = document.activeElement?.tagName;

//     // If already typing in search → do nothing
//     if (document.activeElement === searchRef.current) return;

//     // If typing in any input/textarea EXCEPT search → ignore
//     if (tag === "INPUT" || tag === "TEXTAREA") {
//       if (document.activeElement.type === "checkbox") {
//         // checkbox focused → move focus back to search
//         searchRef.current?.focus();
//       }
//       return;
//     }

//     // Any printable key → focus search
//     if (e.key.length === 1 || e.key === "Backspace") {
//       searchRef.current?.focus();
//     }
//   };

//   window.addEventListener("keydown", handleKeyDown);
//   return () => window.removeEventListener("keydown", handleKeyDown);
// }, []);


//   return (
//     <div style={{ padding: "20px" }}>
//       <Card className={styles.cardL}>
//         <h3 className={styles.headerlist}>EXAMPLE</h3>
//         <div className={styles.tablecont} ref={tableContainerRef}>
//           <Table size="sm" className="custom-table" hover ref={tableRef}>
//             <thead style={{ position: "sticky", top: 0, background: "skyblue", fontSize: 17, textAlign: "center" }}>
//               <tr>
//               <th></th>
//               {ALL_COLUMNS.filter(col => visibleColumns[col.key]).map(col => (
//                 <th
//                   key={col.key}
//                   style={{
//                     width: col.width,
//                     minWidth: col.width,
//                     maxWidth: col.width,
//                     textAlign: "center",
//                     verticalAlign: "middle",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "center",   // 👈 center the group horizontally
//                       alignItems: "center",       // 👈 center vertically
//                       gap: "6px",                 // spacing between text & checkbox
//                     }}
//                   >
//                     {/* Column Label */}
//                     <span style={{ fontSize: "13px", whiteSpace: "nowrap" }}>
//                       {col.label}
//                     </span>

//                     {/* Header Checkbox */}
//                     <input
//                       type="checkbox"
//                       checked={!!searchColumns[col.key]}
//                       onChange={(e) => {
//                         e.stopPropagation();
//                         setSearchColumns(prev => ({
//                           ...prev,
//                           [col.key]: !prev[col.key],
//                         }));
//                       }}
//                     />
//                   </div>
//                 </th>
//               ))}

//             </tr>
//             </thead>
//             <tbody>
//               {filteredLedgers.map((ledger, index) => (
//                 <tr
//                   key={ledger._id}
//                   style={{
//                     backgroundColor: flaggedRows.has(index)
//                       ? "red"
//                       : index === selectedIndex
//                       ? "rgb(187, 186, 186)"
//                       : "transparent",
//                     cursor: "pointer",
//                   }}
//                   onClick={() => {
//                     setSelectedIndex(index);
//                     openLedgerDetails(ledger);
//                   }}
//                 >
//                   {/* Row checkbox */}
//                   <td onClick={(e) => e.stopPropagation()} style={{ textAlign: "center" }}>
//                     <input
//                       type="checkbox"
//                       checked={!!checkedRows[ledger._id]}
//                       onChange={() => handleCheckboxChange(ledger._id)}
//                     />
//                   </td>

//                   {/* Dynamic columns */}
//                  {ALL_COLUMNS.filter(col => visibleColumns[col.key]).map(col => (
//                     <td
//                       key={col.key}
//                       style={{
//                         width: col.width,
//                         minWidth: col.width,
//                         maxWidth: col.width,
//                         whiteSpace: "nowrap",
//                         overflow: "hidden",
//                         textOverflow: "ellipsis",
//                       }}
//                     >
//                       {ledger.formData[col.key] || ""}
//                     </td>
//                  ))}
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>

//         {/* ✅ Search Input */}
//         <div style={{display:'flex',flexDirection:"row"}}>
//           <Form.Control
//           ref={searchRef}
//           className={styles.Search}
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//          <Button 
//             style={{ marginLeft: "10px",marginRight: "10px", marginTop: "10px" }}
//             onClick={() => setShowColumnModal(true)}
//           >
//             Select Fields
//           </Button>
//         </div>
//       </Card>
//       {/* Column Selection Modal */}
//       <Modal show={showColumnModal} onHide={() => setShowColumnModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Select Columns</Modal.Title>
//         </Modal.Header>

//         <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
//           {ALL_COLUMNS.map((col) => (
//             <Form.Check
//               key={col.key}
//               type="checkbox"
//               label={col.label}
//               checked={!!visibleColumns[col.key]}
//               onChange={() =>
//                 setVisibleColumns((prev) => ({
//                   ...prev,
//                   [col.key]: !prev[col.key],
//                 }))
//               }
//             />
//           ))}
//         </Modal.Body>

//         <Modal.Footer>
//           <Button onClick={() => setShowColumnModal(false)}>Apply</Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Example;
