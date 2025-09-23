// import React, { useState, useEffect, useRef } from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import "./ProductModal.css";
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import LedgerAcc from "../LedgerAcc/LedgerAcc";

// // --- SelectModal remains unchanged ---
// const SelectModal = ({ allFieldsAcc, selectedFieldsAcc, handleFieldChangeAcc, onCloseAcc }) => (
//     <Modal show={true} onHide={onCloseAcc}>
//         <Modal.Header closeButton>
//             <Modal.Title>Select Fields</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//             <FormControl fullWidth>
//                 <InputLabel id="field-select-label">Select Fields</InputLabel>
//                 <Select
//                     labelId="field-select-label"
//                     id="field-select"
//                     multiple
//                     value={selectedFieldsAcc}
//                     onChange={handleFieldChangeAcc}
//                     IconComponent={CheckCircleIcon}
//                     className="select-field"
//                     renderValue={(selected) => (
//                         <div>
//                             {selected.map((value) => (
//                                 <span key={value} className="selected-option">{value}</span>
//                             ))}
//                         </div>
//                     )}
//                 >
//                     {allFieldsAcc.map(field => (
//                         <MenuItem key={field} value={field} className={selectedFieldsAcc.includes(field) ? 'selected' : ''}>
//                             {field}
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>
//         </Modal.Body>
//         <Modal.Footer>
//             <Button variant="secondary" onClick={onCloseAcc}>
//                 Close
//             </Button>
//         </Modal.Footer>
//     </Modal>
// );

// // --- MAIN COMPONENT ---
// const ProductModalAccount = ({
//     productsAcc,
//     onSelectAcc,
//     onCloseAcc,
//     allFieldsAcc,
//     initialKey,
//     onRefreshAcc
// }) => {
//     // State for table and search
//     const [filteredProductsAcc, setFilteredProductsAcc] = useState(productsAcc);
//     const [selectedIndexAcc, setSelectedIndexAcc] = useState(0);
//     const [selectedFieldsAcc, setSelectedFieldsAcc] = useState(['ahead', 'gstNo', ...allFieldsAcc.filter(field => field !== 'ahead' && field !== 'gstNo')]);
//     const [searchTerm, setSearchTerm] = useState(initialKey || '');
//     const [showSelectModalAcc, setShowSelectModalAcc] = useState(false);
//     const [showLedgerModal, setShowLedgerModal] = useState(false);

//     const inputRef = useRef(null);
//     const tableRef = useRef(null);

//     // Focus search input whenever products change or modal opens
//     useEffect(() => {
//         if (inputRef.current) inputRef.current.focus();
//     }, [productsAcc, showLedgerModal]);

//     // Keep filteredProducts in sync with productsAcc & searchTerm, always reset selection!
//     useEffect(() => {
//         if (searchTerm) {
//             const keyword = searchTerm.toLowerCase();
//             const filtered = productsAcc.filter(product =>
//                 product.ahead?.toLowerCase().split(' ').some(namePart => namePart.startsWith(keyword))
//             );
//             setFilteredProductsAcc(filtered);
//         } else {
//             setFilteredProductsAcc(productsAcc);
//         }
//         setSelectedIndexAcc(0); // Always reset to first row after product update!
//     }, [productsAcc, searchTerm]);

//     // Handle initialKey if passed
//     useEffect(() => {
//         if (initialKey) {
//             setSearchTerm(initialKey);
//         }
//     }, [initialKey]);

//     // Auto scroll highlighted row into view
//     useEffect(() => {
//         if (tableRef.current) {
//             const selectedRow = tableRef.current.querySelector('.highlighted-row');
//             if (selectedRow) {
//                 selectedRow.scrollIntoView({ block: 'nearest' });
//             }
//         }
//     }, [selectedIndexAcc, filteredProductsAcc]);

//     // Robust: Keyboard navigation, always using the latest filtered array & index!
//     useEffect(() => {
//         const handleKeyDown = (event) => {
//             if (showLedgerModal) return; // Pause navigation when Ledger modal is open
//             if (event.key === 'ArrowUp') {
//                 event.preventDefault();
//                 setSelectedIndexAcc(prevIndex => Math.max(prevIndex - 1, 0));
//             } else if (event.key === 'ArrowDown') {
//                 event.preventDefault();
//                 setSelectedIndexAcc(prevIndex => Math.min(prevIndex + 1, filteredProductsAcc.length - 1));
//             } else if (event.key === 'Enter') {
//                 event.preventDefault();
//                 onSelectAcc(filteredProductsAcc[selectedIndexAcc]);
//             }
//         };

//         document.addEventListener('keydown', handleKeyDown);
//         return () => {
//             document.removeEventListener('keydown', handleKeyDown);
//         };
//     }, [filteredProductsAcc, selectedIndexAcc, showLedgerModal, onSelectAcc]);

//     // Search handler (first name or surname, robust)
//     const handleSearch = (e) => {
//         const keyword = e.target.value.toLowerCase();
//         setSearchTerm(e.target.value);
//         // Filtering is done in useEffect to always stay in sync!
//     };

//     const handleRowClick = (product, index) => {
//         setSelectedIndexAcc(index);
//         onSelectAcc(product);
//     };

//     const handleFieldChange = (event) => {
//         const { value } = event.target;
//         setSelectedFieldsAcc(['ahead', 'gstNo', ...value.filter(field => field !== 'ahead' && field !== 'gstNo')]);
//     };

//     const handleDataGridScroll = (event) => {
//         event.stopPropagation();
//     };

//     const openLedgerModal = () => setShowLedgerModal(true);

//     // FINAL: When closing Ledger modal, refresh parent data, reset selection, focus input
//     const handleLedgerModalClose = async () => {
//         setShowLedgerModal(false);
//         if (onRefreshAcc) await onRefreshAcc();
//         setSearchTerm(''); // Show all after new entry (optional)
//         setTimeout(() => {
//             setSelectedIndexAcc(0);
//             if (inputRef.current) inputRef.current.focus();
//         }, 100);
//     };

//     return (
//         <>
//             <Modal show={true} onHide={onCloseAcc} fullscreen className="custom-modal" style={{ marginTop: 20 }}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Select Account Name</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <div className="list-container" onScroll={handleDataGridScroll}>
//                         <TableContainer component={Paper} className="table-container">
//                             <Table bordered ref={tableRef}>
//                                 <TableHead style={{ backgroundColor: "lightgray" }}>
//                                     <TableRow>
//                                         {selectedFieldsAcc.map(field => (
//                                             <TableCell style={{ textTransform: "uppercase" }} key={field}>{field}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {filteredProductsAcc.map((product, index) => (
//                                         <TableRow
//                                             key={index}
//                                             className={selectedIndexAcc === index ? 'highlighted-row' : ''}
//                                             onClick={() => handleRowClick(product, index)}
//                                         >
//                                             {selectedFieldsAcc.map(field => (
//                                                 <TableCell key={field}>{product[field]}</TableCell>
//                                             ))}
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </div>
//                 </Modal.Body>
//                 <div className='searchdiv' style={{ marginBottom: 10 }}>
//                     <input
//                         type="text"
//                         className="search"
//                         placeholder="Search..."
//                         onChange={handleSearch}
//                         value={searchTerm}
//                         ref={inputRef}
//                     />
//                     <div className='buttondiv'>
//                         <Button className='new' onClick={openLedgerModal}>New</Button>
//                         <Button className='modify'>Modify</Button>
//                         <Button className='select'>Select</Button>
//                         <Button className='closebtn' variant="secondary" onClick={onCloseAcc}>Close</Button>
//                     </div>
//                 </div>
//             </Modal>
//             {showSelectModalAcc && (
//                 <SelectModal
//                     allFieldsAcc={allFieldsAcc}
//                     selectedFieldsAcc={selectedFieldsAcc}
//                     handleFieldChangeAcc={handleFieldChange}
//                     onCloseAcc={() => setShowSelectModalAcc(false)}
//                 />
//             )}
//             {showLedgerModal && (
//                 <Modal
//                     dialogClassName="custom-full-width-modal"
//                     show
//                     onHide={() => setShowLedgerModal(false)}
//                     size="lg"
//                     style={{ zIndex: 100000, marginTop: -30 }}
//                 >
//                     <Modal.Body style={{ marginTop: 10, marginLeft: 10 }}>
//                         <LedgerAcc onClose={handleLedgerModalClose} onRefresh={onRefreshAcc} />
//                     </Modal.Body>
//                 </Modal>
//             )}
//         </>
//     );
// };

// export default ProductModalAccount;

//changes for ProductModalAccount
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import {
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import "./ProductModal.css";
import LedgerAcc from "../LedgerAcc/LedgerAcc";

const ProductModalAccount = ({
  allFields,
  onSelect,
  onClose,
  initialKey,
  tenant,
  onRefresh
}) => {
  const [products, setProducts] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  // const [selectedFields, setSelectedFields] = useState(['ahead', 'gstNo', ...allFields.filter(f => !['ahead', 'gstNo'].includes(f))]);
  const [searchTerm, setSearchTerm] = useState(initialKey || '');
  const [searchField, setSearchField] = useState('ahead');
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const tableRef = useRef(null);

  const [showFieldModal, setShowFieldModal] = useState(false);
  const FIELD_STORAGE_KEY = `modal2_fields_${tenant}`;
  const allAvailableFields = useRef([]);
  const [selectedFields, setSelectedFields] = useState(() => {
  const saved = localStorage.getItem(FIELD_STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
  });
  
const fieldOrder = [
  'ahead', 'gstNo', 'add1', 'city', 'pan', // your preferred fields first
  // fallback or extra fields will be added later if present in data
];


  useEffect(() => {
  if (products.length) {
    const uniqueFields = [...new Set(products.flatMap(p => Object.keys(p)))];

    const orderedFields = fieldOrder.filter(field => uniqueFields.includes(field));
    const remainingFields = uniqueFields.filter(field => !fieldOrder.includes(field));

    allAvailableFields.current = [...orderedFields, ...remainingFields];

    if (selectedFields.length === 0) {
      setSelectedFields([...orderedFields, ...remainingFields]);
    }
  }
}, [products]);
  
  useEffect(() => {
      localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(selectedFields));
  }, [selectedFields]);

  // ---- API Fetch ----
  const fetchAccounts = async ({ search = '', searchField = 'ahead', page = 1, append = false } = {}) => {
    console.log(search);
    setIsLoading(true);
    try {
      const url = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount?search=${encodeURIComponent(search)}&searchField=${encodeURIComponent(searchField)}&page=${page}&limit=30`;
      const res = await fetch(url);
      console.log("Tenant:",tenant);
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      const formattedData = result.data.map(item => ({
        ...item.formData,
        _id: item._id,
      }));
      if (append) {
        setProducts(prev => [...prev, ...formattedData]);
      } else {
        setProducts(formattedData);
      }
      setTotalRecords(result.total);
      setCurrentPage(page);
    } catch (err) {
      // Optional: show error
    }
    setIsLoading(false);
  };

  // ---- Initial/Key Load ----
  useEffect(() => {
    if (initialKey !== undefined && initialKey !== null) {
      setSearchTerm(initialKey);
      setCurrentPage(1);
      fetchAccounts({ search: initialKey, searchField, page: 1 });
      setSelectedIndex(0);
    }
  }, [initialKey, searchField, tenant]);

  // ---- Focus on Modal Open ----
  useEffect(() => {
    if (inputRef.current && !showLedgerModal) inputRef.current.focus();
  }, [products, showLedgerModal]);

  // ---- Keyboard navigation ----
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (showLedgerModal) return;
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex(prevIndex => Math.max(prevIndex - 1, 0));
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex(prevIndex => Math.min(prevIndex + 1, products.length - 1));
      } else if (event.key === 'Enter') {
        event.preventDefault();
        onSelect(products[selectedIndex]);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [products, selectedIndex, onSelect, showLedgerModal]);

  // ---- Handlers ----
   const handleSearch = async (e) => {
    const value = e.target.value;

    // Empty always allowed
    if (value === "") {
        setSearchTerm("");
        setCurrentPage(1);
        await fetchAccounts({ search: value, searchField, page: 1 });
        setSelectedIndex(0);
        return;
    }

    // Check if ANY product in current list has the searchField starting with value
    const hasMatch = products.some((p) => {
        const fieldVal = String(p[searchField] || "").toLowerCase();
        return fieldVal.startsWith(value.toLowerCase()); // ✅ prefix match
    });

    if (hasMatch) {
        setSearchTerm(value);
        setCurrentPage(1);
        await fetchAccounts({ search: value, searchField, page: 1 });
        setSelectedIndex(0);
    }
    // else: ignore (block wrong typing)
    };
  // const handleSearch = async (e) => {
  //   const value = e.target.value;
  //   setSearchTerm(value);
  //   setCurrentPage(1);
  //   await fetchAccounts({ search: value, searchField, page: 1 });
  //   setSelectedIndex(0);
  // };

  const handleFieldChange = async (event) => {
    const field = event.target.value;
    setSearchField(field);
    setSearchTerm('');
    setCurrentPage(1);
    await fetchAccounts({ search: '', searchField: field, page: 1 });
  };

  const handleRowClick = (product, index) => {
    setSelectedIndex(index);
    onSelect(product);
  };

  const handleLoadMore = async () => {
    if (products.length >= totalRecords) return;
    const nextPage = currentPage + 1;
    await fetchAccounts({ search: searchTerm, searchField, page: nextPage, append: true });
  };

  const openLedgerModal = () => setShowLedgerModal(true);

  const handleLedgerModalClose = async () => {
    setShowLedgerModal(false);
    setCurrentPage(1);
    // Re-fetch after new account entry
    if (searchTerm && searchTerm.trim() !== "") {
      await fetchAccounts({ search: searchTerm, searchField, page: 1 });
    } else {
      await fetchAccounts({ search: "", searchField, page: 1 });
    }
    setTimeout(() => {
      setSelectedIndex(0);
      if (inputRef.current) inputRef.current.focus();
    }, 100);
    if (onRefresh) await onRefresh();
  };

  return (
    <>
      <Modal show={true} onHide={onClose} fullscreen className="custom-modal" style={{ marginTop: 20 }}>
        <Modal.Header closeButton>
          <Modal.Title>LEDGER ACCOUNTS</Modal.Title>
           <Button variant="info" style={{marginLeft:"70%"}}  onClick={() => setShowFieldModal(true)}>Fields</Button>
        </Modal.Header>
        <Modal.Body>
          <div className="list-container">
            <TableContainer component={Paper} className="table-container">
              <Table bordered ref={tableRef}>
                <TableHead style={{ backgroundColor: "lightgray" }}>
                  <TableRow>
                    {selectedFields.map(field => (
                      <TableCell style={{ textTransform: "uppercase" }} key={field}>{field}</TableCell>
                    ))}
                    <th>Action</th> {/* This is the new column header */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((product, index) => (
                    <TableRow
                      key={product._id || index}
                      className={selectedIndex === index ? 'highlighted-row' : ''}
                      onClick={() => handleRowClick(product, index)}
                    >
                      {selectedFields.map(field => (
                        <TableCell key={field}>{product[field]}</TableCell>
                      ))}
                      <td>
                      <Button
                          size="sm"
                          variant="primary"
                          // onClick={() => handleSelect(product)}
                      >
                          Select
                      </Button>
                      </td> {/* This is the new column cell */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {products.length < totalRecords && (
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                style={{ margin: '15px auto', display: 'block' }}
                variant="outline-primary"
              >
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            )}
          </div>
        </Modal.Body>
        <div className='searchdiv' style={{ marginBottom: 10 }}>
          <input
            type="text"
            className="search"
            placeholder="Search..."
            onChange={handleSearch}
            value={searchTerm}
            ref={inputRef}
          />
          <text style={{ fontSize: 20, marginLeft: 20 }} id="search-field-label">Search By:</text>
          <select
            style={{ width: 200, height: 30, marginLeft: 10, border: "1px solid black" }}
            labelid="search-field-label"
            value={searchField}
            onChange={handleFieldChange}
          >
            {selectedFields.map(field => (
              <option key={field} value={field}>
                {field.toUpperCase()}
              </option>
            ))}
          </select>
          <div className='buttondiv'>
            <Button className='new' onClick={openLedgerModal}>New</Button>
            <Button className='modify'>Modify</Button>
            <Button className='select'>Select</Button>
            <Button className='closebtn' variant="secondary" onClick={onClose}>
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
          style={{ zIndex: 100000 }}
        >
          <Modal.Body style={{ marginTop: 10, marginLeft: 10 }}>
            <LedgerAcc
              onClose={handleLedgerModalClose}
              onRefresh={onRefresh}
            />
          </Modal.Body>
        </Modal>
      )}
      <Modal style={{ zIndex: 100000 }} show={showFieldModal} onHide={() => setShowFieldModal(false)}>
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

export default ProductModalAccount;
 