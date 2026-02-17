// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import Table from 'react-bootstrap/Table';
// import {
//   TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
// } from '@mui/material';
// import NewStockAccount from "../NewStockAcc/NewStockAcc.js";

// // Optional: loading spinner, you can use your own or a package
// function Loader() {
//   return <div style={{ padding: 10, textAlign: 'center' }}>Searching...</div>;
// }

// const ProductModal = ({
//   products, allFields, onSelect, onClose, tenant, fetchParentProducts,initialKey
// }) => {
//   const FIELD_STORAGE_KEY = `product_modal_fields_${tenant}`;
//   const [modalProducts, setModalProducts] = useState(products);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [selectedFields, setSelectedFields] = useState(() => {
//   const saved = localStorage.getItem(FIELD_STORAGE_KEY);
//   return saved ? JSON.parse(saved) : allFields;
//   });
//   const [showNewStockModal, setShowNewStockModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [showFieldModal, setShowFieldModal] = useState(false);
//   const allAvailableFields = useRef([...new Set(products.flatMap(p => Object.keys(p)))]);
//   useEffect(() => {
//     localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(selectedFields));
//   }, [selectedFields]);

//   const inputRef = useRef(null);
//   const tableRef = useRef(null);
//   useEffect(() => {
//     if (initialKey) {
//       setSearchTerm(initialKey); // Set searchTerm if initialKey is present
//     }
//   }, [initialKey]);
  
//   // Live search API call
//   const fetchProductsFromApi = useCallback(async (search) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(
//         `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/stockmaster?search=${encodeURIComponent(search)}`
//       );
//       const data = await response.json();
//       const flattened = data.data.map(item => ({ ...item.formData, _id: item._id }));
//       setModalProducts(flattened);
//     } catch {
//       setModalProducts([]);
//     }
//     setIsLoading(false);
//   }, [tenant]);

//   // On open or parent product update: reset to parent's list, clear search
//   useEffect(() => {
//     setModalProducts(products);
//     setSelectedIndex(0);
//   }, [products]);

//   // Debounced search (350ms). API only for non-empty search.
//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       if (searchTerm.trim() === "") {
//         setModalProducts(products);
//         setIsLoading(false);
//       } else {
//         fetchProductsFromApi(searchTerm);
//       }
//       setSelectedIndex(0);
//     }, 50);
//     return () => clearTimeout(delayDebounce);
//   }, [searchTerm, fetchProductsFromApi, products]);

//   // Focus input when modal is opened/new is closed
//   useEffect(() => {
//     if (inputRef.current && !showNewStockModal) inputRef.current.focus();
//   }, [modalProducts, showNewStockModal]);

//   // Keyboard navigation
//   useEffect(() => {
//     const onKey = (ev) => {
//       if (showNewStockModal) return;
//       if (ev.key === 'ArrowUp') {
//         ev.preventDefault();
//         setSelectedIndex(i => Math.max(i - 1, 0));
//       } else if (ev.key === 'ArrowDown') {
//         ev.preventDefault();
//         setSelectedIndex(i => Math.min(i + 1, modalProducts.length - 1));
//       } else if (ev.key === 'Enter') {
//         ev.preventDefault();
//         if (modalProducts[selectedIndex]) onSelect(modalProducts[selectedIndex]);
//       }
//     };
//     document.addEventListener('keydown', onKey);
//     return () => document.removeEventListener('keydown', onKey);
//   }, [modalProducts, selectedIndex, onSelect, showNewStockModal]);

//   // Scroll selected row into view
//   useEffect(() => {
//     if (tableRef.current) {
//       const row = tableRef.current.querySelector('.highlighted-row');
//       if (row) row.scrollIntoView({ block: 'nearest' });
//     }
//   }, [selectedIndex, modalProducts]);

//   const handleRowClick = (product, idx) => {
//     setSelectedIndex(idx);
//     onSelect(product);
//   };

//   // Open New Product modal
//   const openNewStockModal = () => setShowNewStockModal(true);

// const handleNewStockClose = async () => {
//   setShowNewStockModal(false);
//   // Always fetch parent products (force update)
//   if (fetchParentProducts) {
//     await fetchParentProducts();
//   }
//   // Optionally: also fetch filtered if search active
//   if (searchTerm.trim() === "") {
//     setModalProducts(products); // Will update due to products prop
//   } else {
//     await fetchProductsFromApi(searchTerm);
//   }
//   setSelectedIndex(0);
//   if (inputRef.current) inputRef.current.focus();
// };

// const handleSearchChange = (e) => {
//   const value = e.target.value;

//   // Empty always allowed
//   if (value === "") {
//     setSearchTerm("");
//     return;
//   }

//   // Check if ANY product field starts with the typed value
//   const hasMatch = products.some((p) =>
//     selectedFields.some((field) => {
//       const fieldVal = String(p[field] || "").toLowerCase();
//       return fieldVal.startsWith(value.toLowerCase()); // ✅ prefix match
//     })
//   );

//   if (hasMatch) {
//     setSearchTerm(value);  // ✅ allow typing
//   }
//   // else ignore (user typed wrong letter)
// };

//   return (
//     <>
//       <Modal show onHide={onClose} fullscreen className="custom-modal" style={{ marginTop: 20 }}>
//         <Modal.Header closeButton>
//           <Modal.Title>STOCK ITEMS</Modal.Title>
//           <Button variant="info" style={{marginLeft:"70%"}} onClick={() => setShowFieldModal(true)}>Fields</Button>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="list-container">
//             <TableContainer component={Paper} className="table-container">
//               <Table bordered size="small" ref={tableRef}>
//                <TableHead style={{ backgroundColor: "lightgray" }}>
//                 <TableRow>
//                   {selectedFields.map(f => (
//                     <TableCell key={f} style={{ textTransform: 'uppercase' }}>{f}</TableCell>
//                   ))}
//                   <TableCell>ACTION</TableCell> {/* Add this line */}
//                 </TableRow>
//               </TableHead>
//              <TableBody>
//               {isLoading && (
//                 <TableRow>
//                   <TableCell colSpan={selectedFields.length + 1}><Loader /></TableCell> {/* +1 for new column */}
//                 </TableRow>
//               )}
//               {!isLoading && modalProducts.length === 0 && (
//                 <TableRow>
//                   <TableCell colSpan={selectedFields.length + 1}>No products found.</TableCell> {/* +1 */}
//                 </TableRow>
//               )}
//               {!isLoading && modalProducts.map((p, idx) => (
//                 <TableRow
//                   key={p._id || idx}
//                   className={selectedIndex === idx ? 'highlighted-row' : ''}
//                   onClick={() => handleRowClick(p, idx)}
//                   style={{ cursor: 'pointer' }}
//                 >
//                   {selectedFields.map(f => (
//                     <TableCell key={f}>{p[f]}</TableCell>
//                   ))}
//                   <TableCell>
//                     <Button
//                       size="sm"
//                       variant="primary"
//                       onClick={(e) => {
//                         e.stopPropagation(); // Prevent row click
//                         onSelect(p); // Trigger selection logic
//                       }}
//                     >
//                       Select
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//               </Table>
//             </TableContainer>
//           </div>
//         </Modal.Body>
//         <div className="searchdiv" style={{ marginBottom: 20 }}>
//           <input
//             type="text"
//             className="search"
//             placeholder="Search..."
//             onChange={handleSearchChange}   // ✅ use new function
//             value={searchTerm}
//             ref={inputRef}
//           />
//           <div className="buttondiv">
//             <Button className="new" onClick={openNewStockModal}>New</Button>
//             <Button className="closebtn" variant="secondary" onClick={onClose}>Close</Button>
//           </div>
//         </div>
//       </Modal>
//       {showNewStockModal && (
//         <Modal
//           dialogClassName="custom-full-width-modal"
//           show
//           onHide={handleNewStockClose}
//           size="lg"
//           style={{ zIndex: 100000 }}
//         >
//           <Modal.Body>
//             <NewStockAccount onSave={handleNewStockClose} />
//           </Modal.Body>
//           <Modal.Footer>
//             <Button variant="secondary" onClick={handleNewStockClose}>Close</Button>
//           </Modal.Footer>
//         </Modal>
//       )}
//     <Modal style={{zIndex:100000}} show={showFieldModal} onHide={() => setShowFieldModal(false)}>
//       <Modal.Header closeButton>
//         <Modal.Title>Select Fields to Show</Modal.Title>
//       </Modal.Header>
//       <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
//         {allAvailableFields.current.map((field) => (
//           <div key={field}>
//             <input
//               type="checkbox"
//               checked={selectedFields.includes(field)}
//               onChange={() => {
//                 if (selectedFields.includes(field)) {
//                   setSelectedFields(selectedFields.filter(f => f !== field));
//                 } else {
//                   setSelectedFields([...selectedFields, field]);
//                 }
//               }}
//             />
//             <label style={{ marginLeft: 8 }}>{field}</label>
//           </div>
//         ))}
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={() => setShowFieldModal(false)}>
//           Done
//         </Button>
//       </Modal.Footer>
//     </Modal>
//     </>
//   );
// };

// export default ProductModal;




import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import NewStockAccount from "../NewStockAcc/NewStockAcc.js";

// Optional: loading spinner, you can use your own or a package
function Loader() {
  return <div style={{ padding: 10, textAlign: 'center' }}>Searching...</div>;
}

const ProductModal = ({
  products,
  allFields,
  onSelect,
  onClose,
  tenant,
  fetchParentProducts,
  initialKey,
}) => {
  const FIELD_STORAGE_KEY = `product_modal_fields_${tenant}`;

  const [modalProducts, setModalProducts] = useState(products);
  const [searchInput, setSearchInput] = useState("");      // what user is typing now
  const [lastValidTerm, setLastValidTerm] = useState("");  // last term that had results
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [stockId, setStockId] = useState(null);
  const [selectedFields, setSelectedFields] = useState(() => {
    const saved = localStorage.getItem(FIELD_STORAGE_KEY);
    return saved ? JSON.parse(saved) : allFields;
  });

  const [showNewStockModal, setShowNewStockModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFieldModal, setShowFieldModal] = useState(false);

  const allAvailableFields = useRef(
    [...new Set(products.flatMap((p) => Object.keys(p)))]
  );

  const inputRef = useRef(null);
  const tableRef = useRef(null);

  // For custom long-press navigation (same style as customer modal)
  const isDownPressedRef = useRef(false);
  const isUpPressedRef = useRef(false);
  const navIntervalRef = useRef(null);

  /* ---------------- Persist selected fields in localStorage ---------------- */
  useEffect(() => {
    localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(selectedFields));
  }, [selectedFields, FIELD_STORAGE_KEY]);

  /* ---------------- Initial key (coming from parent) ---------------- */
  useEffect(() => {
    if (initialKey) {
      setSearchInput(initialKey);
      setLastValidTerm(initialKey);
    }
  }, [initialKey]);

  /* ---------------- Live search API call (returns count) ---------------- */
  const fetchProductsFromApi = useCallback(
    async (search) => {
      if (!tenant) return 0;

      setIsLoading(true);
      try {
        const response = await fetch(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/stockmaster?search=${encodeURIComponent(
            search
          )}`
        );
        const data = await response.json();
        const flattened = (data.data || []).map((item) => ({
          ...item.formData,
          _id: item._id,
        }));
        setModalProducts(flattened);
        return flattened.length;
      } catch {
        setModalProducts([]);
        return 0;
      } finally {
        setIsLoading(false);
      }
    },
    [tenant]
  );

  /* ---------------- On parent products update ----------------
     - If search is empty, reflect parent list.
     - If search is not empty, keep filtered results (we don't touch).
  ---------------------------------------------------------------- */
  useEffect(() => {
    if (searchInput.trim() === "") {
      setModalProducts(products);
      setSelectedIndex(0);
    }
  }, [products, searchInput]);

  /* ---------------- Debounced search with "valid prefix only" -------------- */
  useEffect(() => {
    const term = searchInput;

    const handler = setTimeout(async () => {
      // Empty: show parent list, no restriction
      if (term.trim() === "") {
        setLastValidTerm("");
        setModalProducts(products);
        setSelectedIndex(0);
        return;
      }

      // Non-empty: validate with backend
      const count = await fetchProductsFromApi(term);

      if (count > 0) {
        // Valid prefix
        setLastValidTerm(term);
        setSelectedIndex(0);
      } else {
        // ❌ No match → revert to last valid prefix
        setSearchInput((prev) => {
          if (prev === term) return lastValidTerm;
          return prev;
        });

        if (!lastValidTerm || lastValidTerm.trim() === "") {
          // No valid prefix stored → show full parent list
          setModalProducts(products);
        } else {
          // Re-fetch results for last valid prefix
          await fetchProductsFromApi(lastValidTerm);
        }
      }
    }, 250); // debounce delay

    return () => clearTimeout(handler);
  }, [searchInput, fetchProductsFromApi, products, lastValidTerm]);

  /* ---------------- Focus input when modal is opened / new is closed ------- */
  useEffect(() => {
    if (inputRef.current && !showNewStockModal) inputRef.current.focus();
  }, [modalProducts, showNewStockModal]);

  /* ---------------- Helper: start/stop navigation interval ---------------- */
  const startNavInterval = (direction) => {
    if (navIntervalRef.current) {
      clearInterval(navIntervalRef.current);
      navIntervalRef.current = null;
    }

    const step = direction === 'down' ? 1 : -1;
    const SPEED_MS = 70; // 🔹 control speed here (lower = faster)

    navIntervalRef.current = setInterval(() => {
      setSelectedIndex(prev => {
        if (!modalProducts.length) return 0;
        const maxIndex = modalProducts.length - 1;
        let next = prev + step;
        if (next < 0) next = 0;
        if (next > maxIndex) next = maxIndex;
        return next;
      });
    }, SPEED_MS);
  };

  const stopNavIntervalIfNoKey = () => {
    if (!isDownPressedRef.current && !isUpPressedRef.current) {
      if (navIntervalRef.current) {
        clearInterval(navIntervalRef.current);
        navIntervalRef.current = null;
      }
    }
  };

  /* ---------------- Keyboard navigation (with long-press control) ---------- */
  useEffect(() => {
    const onKeyDown = (ev) => {
      if (showNewStockModal) return;
      if (!modalProducts.length) return;

      if (ev.key === "ArrowDown") {
        ev.preventDefault();
        if (!isDownPressedRef.current) {
          isDownPressedRef.current = true;
          isUpPressedRef.current = false;

          // Move once immediately
          setSelectedIndex(prev => {
            const maxIndex = modalProducts.length - 1;
            return Math.min(prev + 1, maxIndex);
          });

          // Then continuous
          startNavInterval('down');
        }
      } else if (ev.key === "ArrowUp") {
        ev.preventDefault();
        if (!isUpPressedRef.current) {
          isUpPressedRef.current = true;
          isDownPressedRef.current = false;

          // Move once immediately
          setSelectedIndex(prev => Math.max(prev - 1, 0));

          // Then continuous
          startNavInterval('up');
        }
      } else if (ev.key === "Enter") {
        ev.preventDefault();
        if (modalProducts[selectedIndex]) onSelect(modalProducts[selectedIndex]);
      }
    };

    const onKeyUp = (ev) => {
      if (ev.key === "ArrowDown") {
        ev.preventDefault();
        isDownPressedRef.current = false;
        stopNavIntervalIfNoKey();
      } else if (ev.key === "ArrowUp") {
        ev.preventDefault();
        isUpPressedRef.current = false;
        stopNavIntervalIfNoKey();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      if (navIntervalRef.current) {
        clearInterval(navIntervalRef.current);
        navIntervalRef.current = null;
      }
    };
  }, [modalProducts.length, selectedIndex, onSelect, showNewStockModal]);

  /* ---------------- Scroll selected row into view (no shaking) ------------- */
  useEffect(() => {
    if (!tableRef.current) return;

    const container = document.querySelector(".table-container"); // scrollable wrapper
    if (!container) return;

    const rows = tableRef.current.querySelectorAll("tbody tr");
    if (!rows.length) return;

    const idx = Math.max(0, Math.min(selectedIndex, rows.length - 1));
    const selectedRow = rows[idx];
    if (!selectedRow) return;

    // ---- Heights / positions ----
    const headerOffset = 40; // adjust if needed
    const buffer = 12;

    const rowTop = selectedRow.offsetTop;
    const rowBottom = rowTop + selectedRow.offsetHeight;
    const containerHeight = container.clientHeight;

    // visible area
    const visibleTop = container.scrollTop + buffer + headerOffset;
    const visibleBottom = container.scrollTop + containerHeight - buffer;

    // ---- SCROLL DOWN: row is below view ----
    if (rowBottom > visibleBottom) {
        const newScrollTop = rowBottom - containerHeight + buffer * 2;
        container.scrollTo({ top: newScrollTop, behavior: "smooth" });
    }
    // ---- SCROLL UP: row is above view ----
    else if (rowTop < visibleTop) {
        const newScrollTop = rowTop - headerOffset - buffer;
        container.scrollTo({ top: newScrollTop, behavior: "smooth" });
    }
  }, [selectedIndex, products]);

  const handleRowClick = (product, idx) => {
    setSelectedIndex(idx);
    onSelect(product);
  };

  /* ---------------- Open / Close New Product modal ---------------- */
  const openNewStockModal = () => setShowNewStockModal(true);

  const handleNewStockClose = async () => {
    setShowNewStockModal(false);

    // Always refresh parent products
    if (fetchParentProducts) {
      await fetchParentProducts();
    }

    // If no search, show updated parent products
    if (searchInput.trim() === "") {
      setModalProducts(products);
    } else {
      // Re-apply current search on updated data
      await fetchProductsFromApi(searchInput);
    }

    setSelectedIndex(0);
    if (inputRef.current) inputRef.current.focus();
  };

  /* ---------------- Plain input change (no blocking here) ------------------ */
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleModify = () => {
    if (!products[selectedIndex]) {
      alert("Please select a row first!");
      return;
    }

    const selectedProduct = products[selectedIndex];

    // Set Ledger ID for Example modal
    setStockId(selectedProduct._id);

    // Open modal
    setShowNewStockModal(true);
  };
  
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();   // 🔥 stops global shortcut
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <>
      <Modal
        show
        onHide={onClose}
        fullscreen
        className="custom-modal"
        keyboard={false}   // ✅ VERY IMPORTANT
        backdrop="static"  // optional but recommended
        style={{ marginTop: 20 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>STOCK ITEMS</Modal.Title>
          <Button
            variant="info"
            style={{ marginLeft: "70%" }}
            onClick={() => setShowFieldModal(true)}
          >
            Fields
          </Button>
        </Modal.Header>

        <Modal.Body>
          <div className="list-container">
            <TableContainer component={Paper} className="table-container">
              <Table bordered size="small" ref={tableRef}>
                <TableHead style={{ backgroundColor: "lightgray" }}>
                  <TableRow>
                    {selectedFields.map((f) => (
                      <TableCell
                        key={f}
                        style={{ textTransform: "uppercase" }}
                      >
                        {f}
                      </TableCell>
                    ))}
                    <TableCell>ACTION</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading && modalProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={selectedFields.length + 1}>
                        <Loader />
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading && modalProducts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={selectedFields.length + 1}>
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                  {!isLoading &&
                    modalProducts.map((p, idx) => (
                      <TableRow
                        key={p._id || idx}
                        className={
                          selectedIndex === idx ? "highlighted-row" : ""
                        }
                        onClick={() => handleRowClick(p, idx)}
                        style={{ cursor: "pointer" }}
                      >
                        {selectedFields.map((f) => (
                          <TableCell key={f}>{p[f]}</TableCell>
                        ))}
                        <TableCell>
                          <Button
                            size="sm"
                            variant="primary"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              onSelect(p);
                            }}
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}

                  {/* 🔹 When search is in progress but there are already rows, show small "Loading..." below */}
                  {isLoading && modalProducts.length > 0 && (
                    <TableRow>
                      <TableCell colSpan={selectedFields.length + 1}>
                        <div
                          style={{
                            padding: 6,
                            textAlign: "center",
                            fontSize: 12,
                            color: "#555",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
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
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Modal.Body>

        <div className="searchdiv" style={{ marginBottom: 20 }}>
          <input
            type="text"
            className="search"
            placeholder="Search..."
            onChange={handleSearchChange}
            value={searchInput}
            ref={inputRef}
          />
          <div className="buttondiv">
            <Button className="new" onClick={openNewStockModal}>
              New
            </Button>
            <Button className='modify' onClick={handleModify}>Modify</Button>
            <Button
              className="closebtn"
              variant="secondary"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
      {/* {showNewStockModal && (
        <Modal
          dialogClassName="custom-full-width-modal"
          show
          onHide={handleNewStockClose}
          size="lg"
          style={{ zIndex: 100000, marginTop: -30, height: "110vh" }}
        >
          <Modal.Body style={{ marginTop: 10, marginLeft: 10 }}>
            <NewStockAccount
              StockId={stockId}   // pass ID to Example
              onClose={handleNewStockClose}
              // onRefresh={onRefresh}
            />
          </Modal.Body>
        </Modal>
      )} */}

      {/* For NEw */}
      {showNewStockModal && (
        <Modal
          dialogClassName="custom-full-width-modal"
          show
          onHide={handleNewStockClose}
          size="lg"
          style={{ zIndex: 100000, marginTop: -25, height: "110vh"  }}
        >
          <Modal.Body>
            <NewStockAccount
             StockId={stockId}   // pass ID to Example
              onClose={handleNewStockClose}
             onSave={handleNewStockClose} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleNewStockClose}>
              Close
            </Button>
          </Modal.Footer>
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
        <Modal.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
          {allAvailableFields.current.map((field) => (
            <div key={field}>
              <input
                type="checkbox"
                checked={selectedFields.includes(field)}
                onChange={() => {
                  if (selectedFields.includes(field)) {
                    setSelectedFields(
                      selectedFields.filter((f) => f !== field)
                    );
                  } else {
                    setSelectedFields([...selectedFields, field]);
                  }
                }}
              />
              <label style={{ marginLeft: 8 }}>{field}</label>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowFieldModal(false)}
          >
            Done
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductModal;
