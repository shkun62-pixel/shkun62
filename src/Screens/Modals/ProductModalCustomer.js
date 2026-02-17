// import React, { useState, useEffect, useRef } from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import Table from 'react-bootstrap/Table';
// import { TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
// import "./ProductModal.css";
// import { useNavigate } from "react-router-dom";
// import LedgerAcc from '../LedgerAcc/LedgerAcc';

// const ProductModalCustomer = ({
//   allFields,
//   onSelect,
//   onClose,
//   initialKey,
//   tenant,          // must be passed from parent
//   onRefresh
// }) => {
//   const [products, setProducts] = useState([]);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [searchTerm, setSearchTerm] = useState(initialKey || '');
//   const [lastValidTerm, setLastValidTerm] = useState(initialKey || '');
//   const [searchField, setSearchField] = useState('ahead');
//   const [showLedgerModal, setShowLedgerModal] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   const [showExampleModal, setShowExampleModal] = useState(false);
//   const [exampleLedgerId, setExampleLedgerId] = useState(null);


//   const inputRef = useRef(null);
//   const tableRef = useRef(null);
//   const loadMoreTimeoutRef = useRef(null);

//   // For custom long-press navigation
//   const isDownPressedRef = useRef(false);
//   const isUpPressedRef = useRef(false);
//   const navIntervalRef = useRef(null);

//   const navigate = useNavigate();

//   const [showFieldModal, setShowFieldModal] = useState(false);
//   const FIELD_STORAGE_KEY = `customer2_modal_fields_${tenant}`;
//   const [selectedFields, setSelectedFields] = useState(() => {
//     const saved = localStorage.getItem(FIELD_STORAGE_KEY);
//     return saved ? JSON.parse(saved) : [];
//   });

//   const allAvailableFields = useRef([]);

//   const fieldOrder = [
//     'ahead', 'gstNo', 'add1', 'city', 'pan',
//   ];

//   /* ---------------- Field list builder (from loaded products) ---------------- */
//   useEffect(() => {
//     if (products.length) {
//       const uniqueFields = [...new Set(products.flatMap(p => Object.keys(p)))];

//       const orderedFields = fieldOrder.filter(field => uniqueFields.includes(field));
//       const remainingFields = uniqueFields.filter(field => !fieldOrder.includes(field));

//       allAvailableFields.current = [...orderedFields, ...remainingFields];

//       if (selectedFields.length === 0) {
//         setSelectedFields([...orderedFields, ...remainingFields]);
//       }
//     }
//   }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

//   /* ---------------- Persist selected fields in localStorage ---------------- */
//   useEffect(() => {
//     localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(selectedFields));
//   }, [selectedFields, FIELD_STORAGE_KEY]);

//   /* ---------------- Backend paginated fetch (returns counts) ---------------- */
//   const fetchCustomers = async ({
//     search = '',
//     searchField = 'ahead',
//     page = 1,
//     append = false,
//   } = {}) => {
//     setIsLoading(true);
//     try {
//       const url = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount?search=${encodeURIComponent(
//         search
//       )}&searchField=${encodeURIComponent(searchField)}&page=${page}&limit=30`;

//       const res = await fetch(url);
//       if (!res.ok) throw new Error('Failed to fetch');
//       const result = await res.json();

//       const formattedData = (result.data || []).map(item => ({
//         ...item.formData,
//         _id: item._id,
//       }));

//       if (append) {
//         setProducts(prev => [...prev, ...formattedData]);
//       } else {
//         setProducts(formattedData);
//       }

//       const total = result.total || 0;
//       setTotalRecords(total);
//       setCurrentPage(page);

//       return { count: formattedData.length, total };
//     } catch (err) {
//       console.error("Error fetching customers:", err);
//       return { count: 0, total: 0 };
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   /* ---------------- Focus search box on open ---------------- */
//   useEffect(() => {
//     if (inputRef.current && !showLedgerModal) inputRef.current.focus();
//   }, [products, showLedgerModal]);

//   /* ---------------- Initial load when modal opens ---------------- */
//   useEffect(() => {
//     if (!initialKey && tenant) {
//       if (!products.length) {
//         fetchCustomers({ search: "", searchField, page: 1 });
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [tenant, searchField, initialKey]);

//   /* ---------------- Fetch when initialKey changes ---------------- */
//   useEffect(() => {
//     if (initialKey !== undefined && initialKey !== null && tenant) {
//       setSearchTerm(initialKey);
//       setLastValidTerm(initialKey);
//       setCurrentPage(1);
//       setSelectedIndex(0);
//       fetchCustomers({ search: initialKey, searchField, page: 1 });
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [initialKey, tenant]);

//   /* ---------------- Helper: start/stop navigation interval ---------------- */
//   const startNavInterval = (direction) => {
//     if (navIntervalRef.current) {
//       clearInterval(navIntervalRef.current);
//       navIntervalRef.current = null;
//     }

//     const step = direction === 'down' ? 1 : -1;
//     const SPEED_MS = 70; // 🔹 control speed here

//     navIntervalRef.current = setInterval(() => {
//       setSelectedIndex(prev => {
//         if (!products.length) return 0;
//         const maxIndex = products.length - 1;
//         let next = prev + step;
//         if (next < 0) next = 0;
//         if (next > maxIndex) next = maxIndex;
//         return next;
//       });
//     }, SPEED_MS);
//   };

//   const stopNavIntervalIfNoKey = () => {
//     if (!isDownPressedRef.current && !isUpPressedRef.current) {
//       if (navIntervalRef.current) {
//         clearInterval(navIntervalRef.current);
//         navIntervalRef.current = null;
//       }
//     }
//   };

//   /* ---------------- Keyboard navigation (with long-press control) ---------- */
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       if (showLedgerModal) return;
//       if (!products.length) return;

//       if (event.key === 'ArrowDown') {
//         event.preventDefault();
//         if (!isDownPressedRef.current) {
//           isDownPressedRef.current = true;
//           isUpPressedRef.current = false;

//           // Move once immediately
//           setSelectedIndex(prev => {
//             const maxIndex = products.length - 1;
//             return Math.min(prev + 1, maxIndex);
//           });

//           // Start interval for continuous move
//           startNavInterval('down');
//         }
//       } else if (event.key === 'ArrowUp') {
//         event.preventDefault();
//         if (!isUpPressedRef.current) {
//           isUpPressedRef.current = true;
//           isDownPressedRef.current = false;

//           // Move once immediately
//           setSelectedIndex(prev => Math.max(prev - 1, 0));

//           // Start interval for continuous move
//           startNavInterval('up');
//         }
//       } else if (event.key === 'Enter') {
//         event.preventDefault();
//         const selected = products[selectedIndex];
//         if (selected) onSelect(selected);
//       }
//     };

//     const handleKeyUp = (event) => {
//       if (event.key === 'ArrowDown') {
//         event.preventDefault();
//         isDownPressedRef.current = false;
//         stopNavIntervalIfNoKey();
//       } else if (event.key === 'ArrowUp') {
//         event.preventDefault();
//         isUpPressedRef.current = false;
//         stopNavIntervalIfNoKey();
//       }
//     };

//     document.addEventListener('keydown', handleKeyDown);
//     document.addEventListener('keyup', handleKeyUp);

//     return () => {
//       document.removeEventListener('keydown', handleKeyDown);
//       document.removeEventListener('keyup', handleKeyUp);
//       if (navIntervalRef.current) {
//         clearInterval(navIntervalRef.current);
//         navIntervalRef.current = null;
//       }
//     };
//   }, [products.length, selectedIndex, onSelect, showLedgerModal]);

//   /* ---------------- Auto-scroll when selectedIndex changes ---------------- */
//     useEffect(() => {
//         if (!tableRef.current) return;

//         const container = document.querySelector(".table-container"); // scrollable wrapper
//         if (!container) return;

//         const rows = tableRef.current.querySelectorAll("tbody tr");
//         if (!rows.length) return;

//         const idx = Math.max(0, Math.min(selectedIndex, rows.length - 1));
//         const selectedRow = rows[idx];
//         if (!selectedRow) return;

//         // ---- Heights / positions ----
//         const headerOffset = 40; // adjust if needed
//         const buffer = 12;

//         const rowTop = selectedRow.offsetTop;
//         const rowBottom = rowTop + selectedRow.offsetHeight;
//         const containerHeight = container.clientHeight;

//         // visible area
//         const visibleTop = container.scrollTop + buffer + headerOffset;
//         const visibleBottom = container.scrollTop + containerHeight - buffer;

//         // ---- SCROLL DOWN: row is below view ----
//         if (rowBottom > visibleBottom) {
//             const newScrollTop = rowBottom - containerHeight + buffer * 2;
//             container.scrollTo({ top: newScrollTop, behavior: "smooth" });
//         }
//         // ---- SCROLL UP: row is above view ----
//         else if (rowTop < visibleTop) {
//             const newScrollTop = rowTop - headerOffset - buffer;
//             container.scrollTo({ top: newScrollTop, behavior: "smooth" });
//         }
//     }, [selectedIndex, products]);

//   /* ---------------- Auto-load more when at last row (after 2s) -------------- */
//   useEffect(() => {
//     if (loadMoreTimeoutRef.current) {
//       clearTimeout(loadMoreTimeoutRef.current);
//       loadMoreTimeoutRef.current = null;
//     }

//     if (
//       products.length > 0 &&
//       selectedIndex === products.length - 1 &&
//       products.length < totalRecords &&
//       !isLoading
//     ) {
//       loadMoreTimeoutRef.current = setTimeout(() => {
//         const nextPage = currentPage + 1;
//         fetchCustomers({
//           search: searchTerm,
//           searchField,
//           page: nextPage,
//           append: true,
//         });
//       }, 2000); // 2 seconds delay
//     }

//     return () => {
//       if (loadMoreTimeoutRef.current) {
//         clearTimeout(loadMoreTimeoutRef.current);
//       }
//     };
//   }, [
//     selectedIndex,
//     products.length,
//     totalRecords,
//     isLoading,
//     currentPage,
//     searchTerm,
//     searchField,
//   ]);

//   /* ---------------- Smart Search ---------------- */
//   const handleSearch = async (e) => {
//     const value = e.target.value;

//     if (value === "") {
//       setSearchTerm("");
//       setLastValidTerm("");
//       setCurrentPage(1);
//       setSelectedIndex(0);
//       await fetchCustomers({ search: "", searchField, page: 1 });
//       return;
//     }

//     if (value.length < searchTerm.length) {
//       setSearchTerm(value);
//       setLastValidTerm(value);
//       setCurrentPage(1);
//       setSelectedIndex(0);
//       await fetchCustomers({ search: value, searchField, page: 1 });
//       return;
//     }

//     const { total } = await fetchCustomers({
//       search: value,
//       searchField,
//       page: 1,
//     });

//     if (total > 0) {
//       setSearchTerm(value);
//       setLastValidTerm(value);
//       setCurrentPage(1);
//       setSelectedIndex(0);
//     } else {
//       setSearchTerm(lastValidTerm);
//       if (lastValidTerm !== "") {
//         await fetchCustomers({
//           search: lastValidTerm,
//           searchField,
//           page: 1,
//         });
//       }
//     }
//   };

//   /* ---------------- Change search field ---------------- */
//   const handleFieldChange = async (event) => {
//     const field = event.target.value;
//     setSearchField(field);
//     setSearchTerm('');
//     setLastValidTerm('');
//     setCurrentPage(1);
//     setSelectedIndex(0);

//     await fetchCustomers({
//       search: '',
//       searchField: field,
//       page: 1,
//     });
//   };

//   /* ---------------- Row click ---------------- */
//   const handleRowClick = (product, index) => {
//     setSelectedIndex(index);
//     onSelect(product);
//   };

//   /* ---------------- Ledger Modal handlers ---------------- */
//   const openLedgerModal = () => setShowLedgerModal(true);

//   const handleLedgerModalClose = async () => {
//     setShowLedgerModal(false);
//     setCurrentPage(1);

//     const term = (searchTerm || "").trim();

//     await fetchCustomers({
//       search: term,
//       searchField,
//       page: 1,
//     });

//     setTimeout(() => {
//       setSelectedIndex(0);
//       if (inputRef.current) inputRef.current.focus();
//     }, 100);

//     if (onRefresh) await onRefresh();
//   };

//   /* ---------------- Modify ---------------- */
//   const handleModify = () => {
//     if (!products[selectedIndex]) {
//       alert("Please select a row first!");
//       return;
//     }

//     const selectedProduct = products[selectedIndex];

//     // Set Ledger ID for Example modal
//     setExampleLedgerId(selectedProduct._id);

//     // Open modal
//     setShowLedgerModal(true);
//   };

//   // const handleModify = () => {
//   //   if (!products[selectedIndex]) {
//   //     alert("Please select a row first!");
//   //     return;
//   //   }

//   //   const selectedProduct = products[selectedIndex];
//   //   navigate("/Example", {
//   //     state: { ledgerId: selectedProduct._id, rowIndex: selectedIndex },
//   //   });

//   //   alert("Selected ID: " + selectedProduct._id);
//   // };

//   /* ---------------- Main render ---------------- */
//   return (
//     <>
//       <Modal
//         show={true}
//         onHide={onClose}
//         fullscreen
//         className="custom-modal"
//         style={{ marginTop: 20 }}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>LEDGER ACCOUNTS</Modal.Title>
//           <Button
//             variant="info"
//             style={{ marginLeft: "70%" }}
//             onClick={() => setShowFieldModal(true)}
//           >
//             Fields
//           </Button>
//         </Modal.Header>

//         <Modal.Body>
//           <div className="list-container">
//             <TableContainer component={Paper} className="table-container">
//               <Table bordered ref={tableRef}>
//                 <TableHead style={{ backgroundColor: "lightgray" }}>
//                   <TableRow>
//                     {selectedFields.map(field => (
//                       <TableCell style={{ textTransform: "uppercase" }} key={field}>
//                         {field}
//                       </TableCell>
//                     ))}
//                     <TableCell>Action</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {products.map((product, index) => (
//                     <TableRow
//                       key={product._id || index}
//                       className={selectedIndex === index ? 'highlighted-row' : ''}
//                       onClick={() => handleRowClick(product, index)}
//                     >
//                       {selectedFields.map(field => (
//                         <TableCell key={field}>{product[field]}</TableCell>
//                       ))}
//                       <TableCell>
//                         <Button
//                           size="sm"
//                           variant="primary"
//                           onClick={() => onSelect(product)}
//                         >
//                           Select
//                         </Button>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>

//             {/* 🔹 Loading More Indicator (after first 30, next 30, etc.) */}
//             {isLoading && products.length > 0 && products.length < totalRecords && (
//               <div
//                 style={{
//                   marginTop: 8,
//                   textAlign: "center",
//                   fontSize: 12,
//                   color: "#555",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: 8,
//                 }}
//               >
//                 <div
//                   className="spinner-border spinner-border-sm"
//                   role="status"
//                   aria-hidden="true"
//                 />
//                 <span>Loading more...</span>
//               </div>
//             )}
//           </div>
//         </Modal.Body>

//         <div className='searchdiv' style={{ marginBottom: 10 }}>
//           <input
//             type="text"
//             className="search"
//             placeholder="Search..."
//             onChange={handleSearch}
//             value={searchTerm}
//             ref={inputRef}
//           />
//           <span style={{ fontSize: 20, marginLeft: 20 }} id="search-field-label">
//             Search By:
//           </span>
//           <select
//             style={{ width: 200, height: 30, marginLeft: 10, border: "1px solid black" }}
//             aria-labelledby="search-field-label"
//             value={searchField}
//             onChange={handleFieldChange}
//           >
//             {selectedFields.map(field => (
//               <option key={field} value={field}>
//                 {field.toUpperCase()}
//               </option>
//             ))}
//           </select>

//           <div className='buttondiv'>
//             <Button className='new' onClick={openLedgerModal}>New</Button>
//             <Button className='modify' onClick={handleModify}>Modify</Button>
//             <Button className='select' onClick={() => {
//               const selected = products[selectedIndex];
//               if (selected) onSelect(selected);
//             }}>
//               Select
//             </Button>
//             <Button className='closebtn' variant="secondary" onClick={onClose}>Close</Button>
//           </div>
//         </div>
//       </Modal>

//       {showLedgerModal && (
//         <Modal
//           dialogClassName="custom-full-width-modal"
//           show
//           onHide={handleLedgerModalClose}
//           size="lg"
//           style={{ zIndex: 100000, marginTop: -30, height: "110vh" }}
//         >
//           <Modal.Body style={{ marginTop: 10, marginLeft: 10 }}>
//             <LedgerAcc
//                ledgerId2={exampleLedgerId}   // pass ID to Example
//               onClose={handleLedgerModalClose}
//               onRefresh={onRefresh}
//             />
//           </Modal.Body>
//         </Modal>
//       )}

//       <Modal
//         style={{ zIndex: 100000 }}
//         show={showFieldModal}
//         onHide={() => setShowFieldModal(false)}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Select Fields to Show</Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
//           {allAvailableFields.current.map((field) => (
//             <div key={field}>
//               <input
//                 type="checkbox"
//                 checked={selectedFields.includes(field)}
//                 onChange={() => {
//                   if (selectedFields.includes(field)) {
//                     setSelectedFields(selectedFields.filter(f => f !== field));
//                   } else {
//                     setSelectedFields([...selectedFields, field]);
//                   }
//                 }}
//               />
//               <label style={{ marginLeft: 8 }}>{field}</label>
//             </div>
//           ))}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowFieldModal(false)}>
//             Done
//           </Button>
//         </Modal.Footer>
//       </Modal>

//     </>
//   );
// };

// export default ProductModalCustomer;

import React, { useState, useEffect, useRef, useMemo } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import "./ProductModal.css";
import LedgerAcc from "../LedgerAcc/LedgerAcc";

const PAGE_SIZE = 30;
const DEBOUNCE_MS = 250;

const ProductModalCustomer = ({
  allFields,
  onSelect,
  onClose,
  initialKey,
  tenant,
  onRefresh,
}) => {
  const [products, setProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [searchTerm, setSearchTerm] = useState(initialKey || "");
  const [searchField, setSearchField] = useState("ahead");

  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [exampleLedgerId, setExampleLedgerId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef(null);
  const tableRef = useRef(null);

  // Debounce + Abort + latest-only response
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const reqIdRef = useRef(0);

  // Long press nav
  const isDownPressedRef = useRef(false);
  const isUpPressedRef = useRef(false);
  const navIntervalRef = useRef(null);

  // Fields modal
  const [showFieldModal, setShowFieldModal] = useState(false);
  const FIELD_STORAGE_KEY = `customer2_modal_fields_${tenant}`;

  const fieldOrder = useMemo(() => ["ahead", "gstNo", "add1", "city", "pan"], []);
  const allAvailableFields = useRef([]);

  const [selectedFields, setSelectedFields] = useState(() => {
    try {
      const saved = localStorage.getItem(FIELD_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ✅ Smart Search Toggle + State
  const [smartSearchOn, setSmartSearchOn] = useState(true);

  // ✅ last valid query that returned results (for smart backtracking)
  const lastValidQueryRef = useRef(initialKey || "");
  const lastValidProductsRef = useRef([]);
  const lastValidTotalRef = useRef(0);

  // Persist selected fields
  useEffect(() => {
    try {
      localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(selectedFields));
    } catch {}
  }, [selectedFields, FIELD_STORAGE_KEY]);

  // Build available fields after products load
  useEffect(() => {
    if (!products.length) return;

    const uniqueFields = [...new Set(products.flatMap((p) => Object.keys(p)))];
    const orderedFields = fieldOrder.filter((f) => uniqueFields.includes(f));
    const remainingFields = uniqueFields.filter((f) => !fieldOrder.includes(f));

    allAvailableFields.current = [...orderedFields, ...remainingFields];

    if (selectedFields.length === 0) {
      setSelectedFields([...orderedFields, ...remainingFields]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
      if (navIntervalRef.current) clearInterval(navIntervalRef.current);
    };
  }, []);

  // ✅ Fetch (Abort + latest-only)
  const fetchCustomers = async ({
    search = "",
    field = "ahead",
    page = 1,
    append = false,
  } = {}) => {
    if (!tenant) return { count: 0, total: 0 };

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const myReqId = ++reqIdRef.current;
    setIsLoading(true);

    try {
      const url = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount?search=${encodeURIComponent(
        search
      )}&searchField=${encodeURIComponent(field)}&page=${page}&limit=${PAGE_SIZE}`;

      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error("Failed to fetch");
      const result = await res.json();

      if (myReqId !== reqIdRef.current) return { count: 0, total: 0 };

      const formattedData = (result.data || []).map((item) => ({
        ...item.formData,
        _id: item._id,
      }));

      setProducts((prev) => (append ? [...prev, ...formattedData] : formattedData));
      setTotalRecords(result.total || 0);
      setCurrentPage(page);

      // ✅ Store last valid results (only page 1 and non-empty)
      if (!append && page === 1 && formattedData.length > 0) {
        lastValidQueryRef.current = search;
        lastValidProductsRef.current = formattedData;
        lastValidTotalRef.current = result.total || 0;
      }

      return { count: formattedData.length, total: result.total || 0 };
    } catch (err) {
      if (err?.name !== "AbortError") console.error("Error fetching customers:", err);
      return { count: 0, total: 0 };
    } finally {
      if (myReqId === reqIdRef.current) setIsLoading(false);
    }
  };

  // Focus input when open
  useEffect(() => {
    if (!showLedgerModal) setTimeout(() => inputRef.current?.focus(), 80);
  }, [showLedgerModal]);

  // Initial load
  useEffect(() => {
    if (!tenant) return;

    const key = (initialKey || "").trim();
    setSearchTerm(key);
    setSelectedIndex(0);
    setCurrentPage(1);

    fetchCustomers({ search: key, field: searchField, page: 1, append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tenant]);

  // When initialKey changes
  useEffect(() => {
    if (!tenant) return;
    const key = (initialKey || "").trim();
    setSearchTerm(key);
    setSelectedIndex(0);
    setCurrentPage(1);
    fetchCustomers({ search: key, field: searchField, page: 1, append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialKey]);

  // Auto-scroll highlighted row
  useEffect(() => {
    if (!tableRef.current) return;
    const container = document.querySelector(".table-container");
    if (!container) return;

    const rows = tableRef.current.querySelectorAll("tbody tr");
    if (!rows.length) return;

    const idx = Math.max(0, Math.min(selectedIndex, rows.length - 1));
    const row = rows[idx];
    if (!row) return;

    const buffer = 12;
    const rowTop = row.offsetTop;
    const rowBottom = rowTop + row.offsetHeight;
    const containerHeight = container.clientHeight;
    const visibleTop = container.scrollTop + buffer;
    const visibleBottom = container.scrollTop + containerHeight - buffer;

    if (rowBottom > visibleBottom) {
      container.scrollTo({
        top: rowBottom - containerHeight + buffer * 2,
        behavior: "smooth",
      });
    } else if (rowTop < visibleTop) {
      container.scrollTo({
        top: Math.max(0, rowTop - buffer * 2),
        behavior: "smooth",
      });
    }
  }, [selectedIndex, products]);

  // Load more when last row selected
  useEffect(() => {
    if (!products.length) return;
    if (isLoading) return;
    if (products.length >= totalRecords) return;

    if (selectedIndex === products.length - 1) {
      const t = setTimeout(() => {
        const nextPage = currentPage + 1;
        fetchCustomers({
          search: searchTerm.trim(),
          field: searchField,
          page: nextPage,
          append: true,
        });
      }, 600);

      return () => clearTimeout(t);
    }
  }, [
    selectedIndex,
    products.length,
    totalRecords,
    isLoading,
    currentPage,
    searchTerm,
    searchField,
  ]);

  // Long-press nav
  const startNavInterval = (direction) => {
    if (navIntervalRef.current) clearInterval(navIntervalRef.current);
    const step = direction === "down" ? 1 : -1;
    const SPEED_MS = 70;

    navIntervalRef.current = setInterval(() => {
      setSelectedIndex((prev) => {
        if (!products.length) return 0;
        const max = products.length - 1;
        const next = prev + step;
        return Math.max(0, Math.min(max, next));
      });
    }, SPEED_MS);
  };

  const stopNavIntervalIfNoKey = () => {
    if (!isDownPressedRef.current && !isUpPressedRef.current) {
      if (navIntervalRef.current) clearInterval(navIntervalRef.current);
      navIntervalRef.current = null;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e) => {
      if (showLedgerModal) return;
      if (!products.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isDownPressedRef.current) {
          isDownPressedRef.current = true;
          isUpPressedRef.current = false;
          setSelectedIndex((p) => Math.min(p + 1, products.length - 1));
          startNavInterval("down");
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isUpPressedRef.current) {
          isUpPressedRef.current = true;
          isDownPressedRef.current = false;
          setSelectedIndex((p) => Math.max(p - 1, 0));
          startNavInterval("up");
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = products[selectedIndex];
        if (selected) onSelect(selected);
      } else if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    const onKeyUp = (e) => {
      if (e.key === "ArrowDown") {
        isDownPressedRef.current = false;
        stopNavIntervalIfNoKey();
      } else if (e.key === "ArrowUp") {
        isUpPressedRef.current = false;
        stopNavIntervalIfNoKey();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      if (navIntervalRef.current) clearInterval(navIntervalRef.current);
    };
  }, [products, selectedIndex, onSelect, showLedgerModal, onClose]);

  // ✅ Smart backtracking search:
  // If user types "commision" but valid is "commis", it will fall back to the last prefix that had results.
  // If smartSearchOff => show "No records found" (normal search).
  const smartBacktrackSearch = async (term) => {
    // try term, then shrink term until we find results or empty
    let t = term;
    while (t.length > 0) {
      const { count } = await fetchCustomers({ search: t, field: searchField, page: 1, append: false });
      if (count > 0) {
        setSearchTerm(t); // ✅ show the reduced term in input (commis)
        setSelectedIndex(0);
        setCurrentPage(1);
        return;
      }
      t = t.slice(0, -1); // remove last character
    }

    // if nothing found at all
    setProducts([]);
    setTotalRecords(0);
    setSelectedIndex(0);
    setCurrentPage(1);
  };

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const term = value.trim();

      // If cleared
      if (term === "") {
        // show default list
        setSelectedIndex(0);
        setCurrentPage(1);
        await fetchCustomers({ search: "", field: searchField, page: 1, append: false });
        return;
      }

      // If SMART SEARCH is ON
      if (smartSearchOn) {
        await smartBacktrackSearch(term);
        return;
      }

      // NORMAL SEARCH (smart search OFF)
      const { count } = await fetchCustomers({
        search: term,
        field: searchField,
        page: 1,
        append: false,
      });

      // show "no records" (products already empty)
      setSelectedIndex(0);
      setCurrentPage(1);

      // (optional) do nothing else
      if (count === 0) {
        // keep term, show no records
      }
    }, DEBOUNCE_MS);
  };

  // Change search field
  const handleFieldChange = (e) => {
    const field = e.target.value;
    setSearchField(field);
    setSelectedIndex(0);
    setCurrentPage(1);

    // re-run search with same term
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const term = searchTerm.trim();
      if (!term) {
        fetchCustomers({ search: "", field, page: 1, append: false });
        return;
      }
      if (smartSearchOn) smartBacktrackSearch(term);
      else fetchCustomers({ search: term, field, page: 1, append: false });
    }, 0);
  };

  // Row click
  const handleRowClick = (product, index) => {
    setSelectedIndex(index);
    onSelect(product);
  };

  // New / Modify
  const openLedgerModal = () => {
    setExampleLedgerId(null);
    setShowLedgerModal(true);
  };

  const handleModify = () => {
    const selected = products[selectedIndex];
    if (!selected?._id) {
      alert("Please select a row first!");
      return;
    }
    setExampleLedgerId(selected._id);
    setShowLedgerModal(true);
  };

  const handleLedgerModalClose = async () => {
    setShowLedgerModal(false);

    setSelectedIndex(0);
    setCurrentPage(1);

    const term = searchTerm.trim();
    if (!term) {
      await fetchCustomers({ search: "", field: searchField, page: 1, append: false });
    } else {
      if (smartSearchOn) await smartBacktrackSearch(term);
      else await fetchCustomers({ search: term, field: searchField, page: 1, append: false });
    }

    setTimeout(() => inputRef.current?.focus(), 100);
    if (onRefresh) await onRefresh();
  };

  return (
    <>
      <Modal
        show={true}
        onHide={onClose}
        fullscreen
        className="custom-modal"
        keyboard={false}   // ✅ prevent bootstrap auto Esc handling
        backdrop="static"  // optional
        style={{ marginTop: 20 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>LEDGER ACCOUNTS</Modal.Title>

          {/* ✅ Smart Search Toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginLeft: 18 }}>
            <input
              type="checkbox"
              checked={smartSearchOn}
              onChange={(e) => setSmartSearchOn(e.target.checked)}
              style={{ width: 18, height: 18 }}
              id="smart-search-toggle"
            />
            <label htmlFor="smart-search-toggle" style={{ marginBottom: 0, fontSize: 14 }}>
              Smart Search
            </label>
          </div>

          <Button
            variant="info"
            style={{ marginLeft: "auto" }}
            onClick={() => setShowFieldModal(true)}
          >
            Fields
          </Button>
        </Modal.Header>

        <Modal.Body>
          <div className="list-container">
            <TableContainer component={Paper} className="table-container">
              <Table bordered ref={tableRef}>
                <TableHead style={{ backgroundColor: "lightgray" }}>
                  <TableRow>
                    {selectedFields.map((field) => (
                      <TableCell style={{ textTransform: "uppercase" }} key={field}>
                        {field}
                      </TableCell>
                    ))}
                    <TableCell style={{ width: 120 }}>Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {products.map((product, index) => (
                    <TableRow
                      key={product._id || index}
                      className={selectedIndex === index ? "highlighted-row" : ""}
                      onClick={() => handleRowClick(product, index)}
                      style={{ cursor: "pointer" }}
                    >
                      {selectedFields.map((field) => (
                        <TableCell key={field}>
                          {String(product?.[field] ?? "")}
                        </TableCell>
                      ))}
                      <TableCell>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => onSelect(product)}
                        >
                          Select
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}

                  {!isLoading && products.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={selectedFields.length + 1}
                        style={{ textAlign: "center", padding: 18 }}
                      >
                        No records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {isLoading && (
              <div
                style={{
                  marginTop: 10,
                  textAlign: "center",
                  fontSize: 12,
                  color: "#555",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <div
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                />
                <span>Loading...</span>
              </div>
            )}

            {!isLoading && products.length > 0 && (
              <div style={{ marginTop: 8, textAlign: "center", fontSize: 12, color: "#666" }}>
                Showing {products.length} of {totalRecords}
              </div>
            )}
          </div>
        </Modal.Body>

        <div className="searchdiv" style={{ marginBottom: 10 }}>
          <input
            type="text"
            className="search"
            placeholder="Search..."
            onChange={onSearchChange}
            value={searchTerm}
            ref={inputRef}
          />

          <span style={{ fontSize: 18, marginLeft: 16 }} id="search-field-label">
            Search By:
          </span>

          <select
            style={{
              width: 220,
              height: 34,
              marginLeft: 10,
              border: "1px solid black",
            }}
            aria-labelledby="search-field-label"
            value={searchField}
            onChange={handleFieldChange}
          >
            {selectedFields.map((field) => (
              <option key={field} value={field}>
                {field.toUpperCase()}
              </option>
            ))}
          </select>

          <div className="buttondiv">
            <Button className="new" onClick={openLedgerModal}>
              New
            </Button>
            <Button className="modify" onClick={handleModify}>
              Modify
            </Button>
            <Button
              className="select"
              onClick={() => {
                const selected = products[selectedIndex];
                if (selected) onSelect(selected);
              }}
            >
              Select
            </Button>
            <Button className="closebtn" variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {showLedgerModal && (
        <Modal
          dialogClassName="custom-full-width-modal"
          show
          onHide={handleLedgerModalClose}
          size="lg"
          style={{ zIndex: 100000, marginTop: -30, height: "110vh" }}
        >
          <Modal.Body style={{ marginTop: 10, marginLeft: 10 }}>
            <LedgerAcc
              ledgerId2={exampleLedgerId}
              onClose={handleLedgerModalClose}
              onRefresh={onRefresh}
            />
          </Modal.Body>
        </Modal>
      )}

      <Modal
        style={{ zIndex: 100000 }}
        show={showFieldModal}
        onHide={() => setShowFieldModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Fields to Show</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: 500, overflowY: "auto" }}>
          {allAvailableFields.current.map((field) => (
            <div
              key={field}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 0",
              }}
            >
              <input
                type="checkbox"
                checked={selectedFields.includes(field)}
                onChange={() => {
                  setSelectedFields((prev) =>
                    prev.includes(field)
                      ? prev.filter((f) => f !== field)
                      : [...prev, field]
                  );
                }}
              />
              <label>{field}</label>
            </div>
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFieldModal(false)}>
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductModalCustomer;
