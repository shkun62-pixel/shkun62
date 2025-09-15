// import React, { useState, useEffect, useRef } from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import Table from 'react-bootstrap/Table';
// import {
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from '@mui/material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import "./ProductModal.css";
// import NewStockAccount from "../NewStockAcc/NewStockAcc.js";

// // SelectModal unchanged
// const SelectModal = ({ allFields, selectedFields, handleFieldChange, onClose }) => (
//   <Modal show onHide={onClose}>
//     <Modal.Header closeButton>
//       <Modal.Title>Select Fields</Modal.Title>
//     </Modal.Header>
//     <Modal.Body>
//       <FormControl fullWidth>
//         <InputLabel id="field-select-label">Select Fields</InputLabel>
//         <Select
//           labelId="field-select-label"
//           id="field-select"
//           multiple
//           value={selectedFields}
//           onChange={handleFieldChange}
//           IconComponent={CheckCircleIcon}
//           MenuProps={{
//             anchorOrigin: { horizontal: "left", vertical: "bottom" },
//             transformOrigin: { vertical: "top", horizontal: "left" },
//             getContentAnchorEl: null,
//           }}
//           className="select-field"
//           renderValue={(selected) => (
//             <div>
//               {selected.map((value) => (
//                 <span key={value} className="selected-option">{value}</span>
//               ))}
//             </div>
//           )}
//         >
//           {allFields.map(field => (
//             <MenuItem key={field} value={field} className={selectedFields.includes(field) ? 'selected' : ''}>
//               {field}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </Modal.Body>
//     <Modal.Footer>
//       <Button variant="secondary" onClick={onClose}>
//         Close
//       </Button>
//     </Modal.Footer>
//   </Modal>
// );

// const ProductModal = ({
//   products,
//   onSelect,
//   onClose,
//   allFields,
//   initialKey,
//   fetchProducts,
// }) => {
//   const [filteredProducts, setFilteredProducts] = useState(products);
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [selectedFields, setSelectedFields] = useState(allFields);
//   const [showSelectModal, setShowSelectModal] = useState(false);
//   const [showNewStockModal, setShowNewStockModal] = useState(false);

//   // Restrictive search: track last valid term
//   const [searchTerm, setSearchTerm] = useState(initialKey || '');
//   const [lastValidTerm, setLastValidTerm] = useState(initialKey || '');

//   // Refs
//   const inputRef = useRef(null);
//   const tableRef = useRef(null);

//   // Ref to stash terms when opening "New"
//   const savedTermsRef = useRef({ searchTerm: '', lastValidTerm: '' });

//   // Focus search input after product list updates or modal closes
//   useEffect(() => {
//     if (inputRef.current && !showNewStockModal) inputRef.current.focus();
//   }, [products, showNewStockModal]);

//   // *ONLY* reset when initialKey prop changes
//   useEffect(() => {
//     setSearchTerm(initialKey || '');
//     setLastValidTerm(initialKey || '');
//   }, [initialKey]);

//   // Restrictive search handler
//   const handleSearch = (e) => {
//     const value = e.target.value;
//     const kw = value.toLowerCase();
//     const filtered = products.filter(p =>
//       p.Aheads?.toLowerCase().split(' ').some(part => part.startsWith(kw))
//     );

//     if (filtered.length > 0 || value === '') {
//       setSearchTerm(value);
//       setLastValidTerm(value);
//       setFilteredProducts(filtered.length > 0 ? filtered : products);
//       setSelectedIndex(0);
//     } else {
//       setSearchTerm(lastValidTerm);
//     }
//   };

//   // Sync filtered list whenever searchTerm or products change
//   useEffect(() => {
//     const kw = searchTerm.toLowerCase();
//     const filtered = products.filter(p =>
//       p.Aheads?.toLowerCase().split(' ').some(part => part.startsWith(kw))
//     );
//     setFilteredProducts(searchTerm ? filtered : products);
//     setSelectedIndex(0);
//   }, [products, searchTerm]);

//   // Scroll selected into view
//   useEffect(() => {
//     if (tableRef.current) {
//       const row = tableRef.current.querySelector('.highlighted-row');
//       if (row) row.scrollIntoView({ block: 'nearest' });
//     }
//   }, [selectedIndex, filteredProducts]);

//   // Keyboard nav
//   useEffect(() => {
//     const onKey = (ev) => {
//       if (showNewStockModal) return;
//       if (ev.key === 'ArrowUp') {
//         ev.preventDefault();
//         setSelectedIndex(i => Math.max(i - 1, 0));
//       } else if (ev.key === 'ArrowDown') {
//         ev.preventDefault();
//         setSelectedIndex(i => Math.min(i + 1, filteredProducts.length - 1));
//       } else if (ev.key === 'Enter') {
//         ev.preventDefault();
//         onSelect(filteredProducts[selectedIndex]);
//       }
//     };
//     document.addEventListener('keydown', onKey);
//     return () => document.removeEventListener('keydown', onKey);
//   }, [filteredProducts, selectedIndex, onSelect, showNewStockModal]);

//   const handleRowClick = (product, idx) => {
//     setSelectedIndex(idx);
//     onSelect(product);
//   };

//   const handleFieldChange = (e) => {
//     setSelectedFields(e.target.value);
//   };

//   const handleDataGridScroll = (e) => e.stopPropagation();

//   // Before opening "New", stash
//   const openNewStockModal = () => {
//     savedTermsRef.current = { searchTerm, lastValidTerm };
//     setShowNewStockModal(true);
//   };

//   // Close "New" and restore
//   const handleNewStockClose = async () => {
//     setShowNewStockModal(false);
//     await fetchProducts();

//     setSearchTerm(savedTermsRef.current.searchTerm);
//     setLastValidTerm(savedTermsRef.current.lastValidTerm);

//     setSelectedIndex(0);
//     if (inputRef.current) inputRef.current.focus();
//   };

//   return (
//     <>
//       <Modal show onHide={onClose} fullscreen className="custom-modal" style={{ marginTop: 20 }}>
//         <Modal.Header closeButton>
//           <Modal.Title>STOCK ITEMS</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="list-container" onScroll={handleDataGridScroll}>
//             <TableContainer component={Paper} className="table-container">
//               <Table bordered size="small" ref={tableRef}>
//                 <TableHead style={{ backgroundColor: "lightgray" }}>
//                   <TableRow>
//                     {selectedFields.map(f => (
//                       <TableCell key={f} style={{ textTransform: 'uppercase' }}>{f}</TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {filteredProducts.map((p, idx) => (
//                     <TableRow
//                       key={idx}
//                       className={selectedIndex === idx ? 'highlighted-row' : ''}
//                       onClick={() => handleRowClick(p, idx)}
//                     >
//                       {selectedFields.map(f => <TableCell key={f}>{p[f]}</TableCell>)}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </div>
//         </Modal.Body>
//         <div className="searchdiv" style={{ marginBottom: 20 }}>
//           <input
//             type="text"
//             className="search"
//             placeholder="Search..."
//             onChange={handleSearch}
//             value={searchTerm}
//             ref={inputRef}
//           />
//           <div className="buttondiv">
//             <Button className="new" onClick={openNewStockModal}>New</Button>
//             <Button className="modify">Modify</Button>
//             <Button className="select">Select</Button>
//             <Button className="closebtn" variant="secondary" onClick={onClose}>Close</Button>
//           </div>
//         </div>
//       </Modal>

//       {showSelectModal && (
//         <SelectModal
//           allFields={allFields}
//           selectedFields={selectedFields}
//           handleFieldChange={handleFieldChange}
//           onClose={() => setShowSelectModal(false)}
//         />
//       )}

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
//     </>
//   );
// };

// export default ProductModal;

//Changes in Product Modal
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import {
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import NewStockAccount from "../NewStockAcc/NewStockAcc.js";

// Optional: loading spinner, you can use your own or a package
function Loader() {
  return <div style={{ padding: 10, textAlign: 'center' }}>Searching...</div>;
}

const ProductModal = ({
  products, allFields, onSelect, onClose, tenant, fetchParentProducts,initialKey
}) => {
  const FIELD_STORAGE_KEY = `product_modal_fields_${tenant}`;
  const [modalProducts, setModalProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedFields, setSelectedFields] = useState(() => {
  const saved = localStorage.getItem(FIELD_STORAGE_KEY);
  return saved ? JSON.parse(saved) : allFields;
  });
  const [showNewStockModal, setShowNewStockModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const allAvailableFields = useRef([...new Set(products.flatMap(p => Object.keys(p)))]);
  useEffect(() => {
    localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(selectedFields));
  }, [selectedFields]);

  const inputRef = useRef(null);
  const tableRef = useRef(null);
  useEffect(() => {
    if (initialKey) {
      setSearchTerm(initialKey); // Set searchTerm if initialKey is present
    }
  }, [initialKey]);
  
  // Live search API call
  const fetchProductsFromApi = useCallback(async (search) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/stockmaster?search=${encodeURIComponent(search)}`
      );
      const data = await response.json();
      const flattened = data.data.map(item => ({ ...item.formData, _id: item._id }));
      setModalProducts(flattened);
    } catch {
      setModalProducts([]);
    }
    setIsLoading(false);
  }, [tenant]);

  // On open or parent product update: reset to parent's list, clear search
  useEffect(() => {
    setModalProducts(products);
    setSelectedIndex(0);
  }, [products]);

  // Debounced search (350ms). API only for non-empty search.
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() === "") {
        setModalProducts(products);
        setIsLoading(false);
      } else {
        fetchProductsFromApi(searchTerm);
      }
      setSelectedIndex(0);
    }, 50);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, fetchProductsFromApi, products]);

  // Focus input when modal is opened/new is closed
  useEffect(() => {
    if (inputRef.current && !showNewStockModal) inputRef.current.focus();
  }, [modalProducts, showNewStockModal]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (ev) => {
      if (showNewStockModal) return;
      if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, modalProducts.length - 1));
      } else if (ev.key === 'Enter') {
        ev.preventDefault();
        if (modalProducts[selectedIndex]) onSelect(modalProducts[selectedIndex]);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modalProducts, selectedIndex, onSelect, showNewStockModal]);

  // Scroll selected row into view
  useEffect(() => {
    if (tableRef.current) {
      const row = tableRef.current.querySelector('.highlighted-row');
      if (row) row.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, modalProducts]);

  const handleRowClick = (product, idx) => {
    setSelectedIndex(idx);
    onSelect(product);
  };

  // Open New Product modal
  const openNewStockModal = () => setShowNewStockModal(true);

  // After closing "New", refresh API if search is active, else use parent
  // const handleNewStockClose = async () => {
  //   setShowNewStockModal(false);
  //   if (searchTerm.trim() === "") {
  //     setModalProducts(products);
  //   } else {
  //     await fetchProductsFromApi(searchTerm);
  //   }
  //   setSelectedIndex(0);
  //   if (inputRef.current) inputRef.current.focus();
  // };
  // In ProductModal
const handleNewStockClose = async () => {
  setShowNewStockModal(false);
  // Always fetch parent products (force update)
  if (fetchParentProducts) {
    await fetchParentProducts();
  }
  // Optionally: also fetch filtered if search active
  if (searchTerm.trim() === "") {
    setModalProducts(products); // Will update due to products prop
  } else {
    await fetchProductsFromApi(searchTerm);
  }
  setSelectedIndex(0);
  if (inputRef.current) inputRef.current.focus();
};


  return (
    <>
      <Modal show onHide={onClose} fullscreen className="custom-modal" style={{ marginTop: 20 }}>
        <Modal.Header closeButton>
          <Modal.Title>STOCK ITEMS</Modal.Title>
          <Button variant="info" style={{marginLeft:"70%"}} onClick={() => setShowFieldModal(true)}>Fields</Button>
        </Modal.Header>
        <Modal.Body>
          <div className="list-container">
            <TableContainer component={Paper} className="table-container">
              <Table bordered size="small" ref={tableRef}>
               <TableHead style={{ backgroundColor: "lightgray" }}>
                <TableRow>
                  {selectedFields.map(f => (
                    <TableCell key={f} style={{ textTransform: 'uppercase' }}>{f}</TableCell>
                  ))}
                  <TableCell>ACTION</TableCell> {/* Add this line */}
                </TableRow>
              </TableHead>
             <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={selectedFields.length + 1}><Loader /></TableCell> {/* +1 for new column */}
                </TableRow>
              )}
              {!isLoading && modalProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={selectedFields.length + 1}>No products found.</TableCell> {/* +1 */}
                </TableRow>
              )}
              {!isLoading && modalProducts.map((p, idx) => (
                <TableRow
                  key={p._id || idx}
                  className={selectedIndex === idx ? 'highlighted-row' : ''}
                  onClick={() => handleRowClick(p, idx)}
                  style={{ cursor: 'pointer' }}
                >
                  {selectedFields.map(f => (
                    <TableCell key={f}>{p[f]}</TableCell>
                  ))}
                  <TableCell>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        onSelect(p); // Trigger selection logic
                      }}
                    >
                      Select
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
            onChange={e => setSearchTerm(e.target.value)}
            value={searchTerm}
            ref={inputRef}
          />
          <div className="buttondiv">
            <Button className="new" onClick={openNewStockModal}>New</Button>
            <Button className="closebtn" variant="secondary" onClick={onClose}>Close</Button>
          </div>
        </div>
      </Modal>
      {showNewStockModal && (
        <Modal
          dialogClassName="custom-full-width-modal"
          show
          onHide={handleNewStockClose}
          size="lg"
          style={{ zIndex: 100000 }}
        >
          <Modal.Body>
            <NewStockAccount onSave={handleNewStockClose} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleNewStockClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    <Modal style={{zIndex:100000}} show={showFieldModal} onHide={() => setShowFieldModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Select Fields to Show</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {allAvailableFields.current.map((field) => (
          <div key={field}>
            <input
              type="checkbox"
              checked={selectedFields.includes(field)}
              onChange={() => {
                if (selectedFields.includes(field)) {
                  setSelectedFields(selectedFields.filter(f => f !== field));
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
        <Button variant="secondary" onClick={() => setShowFieldModal(false)}>
          Done
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default ProductModal;
