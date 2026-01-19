import React, { useEffect, useState,useRef, useCallback } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PrintList from "./PrintList";
import styles from '../Books/SaleBook/SaleBook.module.css'
import { CompanyContext } from "../Context/CompanyContext";
import { useContext } from "react";
import useCompanySetup from "../Shared/useCompanySetup";
import { FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PaymentModal from "../Modals/PaymentModal";
import financialYear from "../Shared/financialYear";

const LOCAL_STORAGE_KEY = "PayementListTableData";

const PaymentList = () => {
  
  const navigate = useNavigate();
  const {dateFrom} = useCompanySetup();
  const { company } = useContext(CompanyContext);
  const tenant = company?.databaseName;

    if (!tenant) {
      // you may want to guard here or show an error state,
      // since without a tenant you can’t hit the right API
      // console.error("No tenant selected!");
    }
    const [formData, setFormData] = useState({
        city: "",
        vehicle:"",
        btype:"All",
        stype:"All",
        v_tpt:"",
        broker:"",
        rem1:"",
        exfor:"",
        lDesc:"",
        lPost:"",
        terms:"",
        pnc:"All",
        mfg:"",
        iFrom:"",
        iUpto:"",
        vRange1:"",
        vRange2:"",
    });

     const handleChangevalues = (event) => {
      const { id, value } = event.target;
      setFormData((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    };
    const handleAlphabetOnly = (e) => {
      const { id, value } = e.target;
      // Allow only alphabets (A-Z, a-z) and spaces
      const alphabetRegex = /^[A-Za-z\s]*$/;
      if (alphabetRegex.test(value)) {
        setFormData({ ...formData, [id]: value });
      }
    };

    const defaultTableFields = {
      date: true,
      billno: true,
      weight: true, 
      pcs: false, 
      accountname: true,
      city: true,
      gstin: true,
      value: true,
      cgst: true,
      sgst: true,
      igst: true,
      netvalue: true,
      exp1: false,
      exp2: false,
      exp3: false,
      exp4: false,
      exp5: false,
      exp6: false,
      exp7: false,
      exp8: false,
      exp9: false,
      exp10: false,          
      description: false,  
      vehicleno: false,    
      remarks: false,     
      transport: false, 
      broker: false,    
      taxtype: false,                               
    };
    
    const [tableData, settableData] = useState(() => {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      // Only keep keys that exist in defaultFormData
      const sanitized = Object.fromEntries(
        Object.entries({ ...defaultTableFields, ...parsed }).filter(([key]) =>
          Object.hasOwn(defaultTableFields, key)
        )
      );
      
      return sanitized;
    });

    const defaultColumnOrder = {
      date: 1,
      billno: 2,
      weight: 3,
      pcs: 4,
      accountname: 5,
      city: 6,
      gstin:7,
      value: 8,
      cgst: 9,
      sgst: 10,
      igst: 11,
      netvalue: 12,
      exp1: 13,
      exp2: 14,
      exp3: 15,
      exp4: 16,
      exp5: 17,
      exp6: 18,
      exp7: 19,
      exp8: 20,
      exp9: 21,
      exp10: 22,
      description: 23,
      vehicleno: 24,
      remarks: 25,
      transport: 26,
      broker:27,
      taxtype: 28,
    };

    const [columnOrder, setColumnOrder] = useState(() => {
      const saved = localStorage.getItem("ColumnOrderPList");
      console.log("saved:",saved);
      
      const parsed = saved ? JSON.parse(saved) : {};
      return { ...defaultColumnOrder, ...parsed }; // ✅ merge saved over defaults
    });

    // Save to localStorage whenever tableData changes
    useEffect(() => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tableData));
    }, [tableData]);
  
    const handleCheckboxChange = (field) => {
      settableData((prev) => ({ ...prev, [field]: !prev[field] }));
    };
    
    const handleSerialChange = (field, value) => {
      const sanitizedValue = Math.max(1, parseInt(value) || 1); // ⛔ No zero or negative values
      setColumnOrder((prev) => {
        const newOrder = { ...prev, [field]: sanitizedValue };
        localStorage.setItem("ColumnOrderPList", JSON.stringify(newOrder));
        return newOrder;
      });
    };

    useEffect(() => {
      localStorage.setItem("ColumnOrderPList", JSON.stringify(columnOrder));
      console.log("ColumnOrderPList:",columnOrder);
      
    }, [columnOrder]);

    // Select Font weight 
    const [fontWeight, setFontWeight] = useState(() => {
      return localStorage.getItem("FontWeightPList") || "normal";
    });

    useEffect(() => {
      localStorage.setItem("FontWeightPList", fontWeight);
    }, [fontWeight]);

    // Increase Decrease fontSize
    const [fontSize, setFontSize] = useState(() => {
      const saved = localStorage.getItem("FontSizePList");
      return saved ? parseInt(saved, 10) : 15;
    });

    useEffect(() => {
      localStorage.setItem("FontSizePList", fontSize.toString());
    }, [fontSize]);

  // Payement Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const tableRef = useRef(null);
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [moreModalOpen, setMoreModalOpen] = useState(false);
  const [tableModalOpen, settableModalOpen] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(() => new Date());
  const [selectedSupplier, setSelectedSupplier] = useState(""); 
  const [selectedItems, setSelectedItems] = useState(""); 
  const rowRefs = useRef([]);

  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(fy.start); // converted
    setToDate(fy.end);     // converted
  }, []);

  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const formatAmount = (val) => {
    const num = parseFloat(val);
    return isNaN(num) ? "0.00" : num.toFixed(2);
  };

  const fetchEntries = useCallback(async () => {
    if (!fromDate || !toDate) return;

    setLoading(true);
    try {
      // --- 1️⃣ Fetch sales ---
      const saleRes = await fetch(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/purchase`
      );
      if (!saleRes.ok) throw new Error("Failed to fetch sale data");
      const saleData = await saleRes.json();

      // ✅ Helper to parse both ISO and DD/MM/YYYY formats
      const parseDate = (dateValue) => {
        if (!dateValue) return null;

        // 1️⃣ If already Date object
        if (dateValue instanceof Date && !isNaN(dateValue)) {
          return dateValue;
        }

        // 2️⃣ ISO string or YYYY-MM-DD
        const isoDate = new Date(dateValue);
        if (!isNaN(isoDate.getTime())) {
          return isoDate;
        }

        // 3️⃣ DD-MM-YYYY or DD/MM/YYYY
        if (typeof dateValue === "string") {
          const parts = dateValue.includes("-")
            ? dateValue.split("-")
            : dateValue.split("/");

          if (parts.length === 3) {
            const [day, month, year] = parts.map(Number);

            if (
              day >= 1 && day <= 31 &&
              month >= 1 && month <= 12 &&
              year > 1900
            ) {
              return new Date(year, month - 1, day);
            }
          }
        }

        return null; // ❌ unrecognized format
      };

      const startDate = new Date(fromDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(toDate);
      endDate.setHours(23, 59, 59, 999);

      const filteredSales = saleData.filter((entry) => {
        const entryDate = parseDate(entry?.formData?.date);
        return entryDate && entryDate >= startDate && entryDate <= endDate;
      });

      // --- 2️⃣ Fetch bank vouchers ---
      const bankRes = await fetch(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/bank`
      );
      if (!bankRes.ok) throw new Error("Failed to fetch bank data");
      const bankRaw = await bankRes.json();

      const bankData = Array.isArray(bankRaw)
        ? bankRaw.map((b) => b?.data || b)
        : [];

      // --- 3️⃣ Create payment map ---
      const paymentMap = new Map();
      bankData.forEach((voucher) => {
        const vForm = voucher?.formData || {};
        const items = Array.isArray(voucher?.items)
          ? voucher.items
          : Array.isArray(voucher?.data?.items)
          ? voucher.data.items
          : [];

        const billNo = parseInt(vForm.againstbillno || 0);
        if (!billNo) return;

        const totalPaid = items.reduce(
          (sum, item) => sum + parseFloat(item?.payment_debit || 0),
          0
        );
        paymentMap.set(billNo, (paymentMap.get(billNo) || 0) + totalPaid);
      });

      // --- 4️⃣ Merge payment info ---
      const updatedSales = filteredSales
        .map((sale) => {
          const formData = sale?.formData || {};
          const saleBillNo = parseInt(formData?.vno || 0);
          const saleAmount = parseFloat(formData?.grandtotal || 0);
          const paidAmount = paymentMap.get(saleBillNo) || 0;
          const balance = saleAmount - paidAmount;

          return {
            ...sale,
            formData: {
              ...formData,
              paidAmount,
              balance,
            },
          };
        })
        // ✅ Hide fully paid bills
        .filter((sale) => sale?.formData?.balance > 0.5);

      setEntries(updatedSales);
      setFilteredEntries(updatedSales);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fromDate, toDate]);
  
  // Fetch initially and when dates change
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  useEffect(() => {
    const filtered = entries.filter((entry) => {
      const supplierMatch = selectedSupplier
        ? entry.supplierdetails?.[0]?.vacode === selectedSupplier
        : true;

      const cityMatch = formData.city
        ? entry.supplierdetails?.[0]?.city?.toLowerCase().includes(formData.city.toLowerCase())
        : true;

      const vehicleMatch = formData.vehicle
        ? entry.formData?.trpt?.toLowerCase().includes(formData.vehicle.toLowerCase())
        : true;

      const btypeMatch = formData.btype && formData.btype !== "All"
        ? (entry.formData?.btype || "").toLowerCase() === formData.btype.toLowerCase()
        : true;

      const stypeMatch = formData.stype && formData.stype !== "All"
        ? (entry.formData?.stype || "").toLowerCase() === formData.stype.toLowerCase()
        : true;

      const productMatch = selectedItems
        ? entry.items?.some(item => item.sdisc === selectedItems)
        : true;

      const transportMatch = formData.v_tpt
        ? entry.formData?.v_tpt?.toLowerCase().includes(formData.v_tpt.toLowerCase())
        : true;

      const brokerMatch = formData.broker
        ? entry.formData?.broker?.toLowerCase().includes(formData.broker.toLowerCase())
        : true;

      const remarkMatch = formData.rem1
        ? entry.formData?.rem2?.toLowerCase().includes(formData.rem1.toLowerCase())
        : true;

      const termsMatch = formData.terms
        ? entry.formData?.exfor?.toLowerCase().includes(formData.terms.toLowerCase())
        : true;
      
      const pncMatch = formData.pnc && formData.pnc !== "All"
        ? formData.pnc === "Positive" ? Number(entry.formData?.grandtotal) > 0
        : formData.pnc === "Negative" ? Number(entry.formData?.grandtotal) < 0
        : formData.pnc === "Cancel" ? Number(entry.formData?.grandtotal) === 0
        : true
        : true;

      const invoiceRangeMatch =
      formData.iFrom && formData.iUpto
        ? Number(entry.formData?.vno) >= Number(formData.iFrom) && Number(entry.formData?.vno) <= Number(formData.iUpto)
        : formData.iFrom
        ? Number(entry.formData?.vno) >= Number(formData.iFrom) : formData.iUpto
        ? Number(entry.formData?.vno) <= Number(formData.iUpto)
        : true;

      const taxRateMatch = formData.taxRate
      ? entry.items?.some(item => String(item.gst).includes(formData.taxRate))
      : true;


      return supplierMatch && cityMatch && vehicleMatch && btypeMatch && stypeMatch && productMatch && transportMatch && brokerMatch && remarkMatch && termsMatch && pncMatch && invoiceRangeMatch && taxRateMatch;
    });

    setFilteredEntries(filtered);
  }, [selectedSupplier, formData.city, formData.vehicle, formData.btype, formData.stype, selectedItems, formData.v_tpt, formData.broker, formData.rem1, formData.terms, formData.pnc, formData.iFrom, formData.iUpto, formData.taxRate, entries]);

  const uniqueItem = [...new Set(entries.map(entry => entry.items?.[0]?.sdisc))].filter(Boolean);
  const uniqueSuppliers = [...new Set(entries.map(entry => entry.supplierdetails?.[0]?.vacode))].filter(Boolean);

  // Calculate totals based on filtered data
  const totalGrandTotal = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.grandtotal || 0), 0);
  const totalPaid = filteredEntries.reduce(
  (acc, e) => acc + parseFloat(e?.formData?.paidAmount || 0),
    0
  );
  const totalBalance = filteredEntries.reduce(
    (acc, e) => acc + parseFloat(e?.formData?.balance || 0),
    0
  );

  const totalCGST = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.cgst || 0), 0);
  const totalSGST = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.sgst || 0), 0);
  const totalIGST = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.igst || 0), 0);
  const totalTAX = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.sub_total || 0), 0);
  const totalWeight = filteredEntries.reduce((entryAcc, entry) => {
    const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.weight || 0), 0);
    return entryAcc + itemTotal;
  }, 0);
  const totalPcs = filteredEntries.reduce((entryAcc, entry) => {
  const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.pkgs || 0), 0);
  return entryAcc + itemTotal;
  }, 0);

  const totalexp1 = filteredEntries.reduce((entryAcc, entry) => {
  const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp1 || 0), 0);
  return entryAcc + itemTotal;
  }, 0);
    const totalexp2 = filteredEntries.reduce((entryAcc, entry) => {
  const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp2 || 0), 0);
  return entryAcc + itemTotal;
  }, 0);
    const totalexp3 = filteredEntries.reduce((entryAcc, entry) => {
  const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp3 || 0), 0);
  return entryAcc + itemTotal;
  }, 0);
    const totalexp4 = filteredEntries.reduce((entryAcc, entry) => {
  const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp4 || 0), 0);
  return entryAcc + itemTotal;
  }, 0);
    const totalexp5 = filteredEntries.reduce((entryAcc, entry) => {
  const itemTotal = entry.items?.reduce((itemAcc, item) => itemAcc + parseFloat(item.Exp5 || 0), 0);
  return entryAcc + itemTotal;
  }, 0);

  const totalexp6 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp6 || 0), 0);
  const totalexp7 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp7 || 0), 0);
  const totalexp8 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp8 || 0), 0);
  const totalexp9 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp9 || 0), 0);
  const totalexp10 = filteredEntries.reduce((acc, entry) => acc + parseFloat(entry.formData?.Exp10 || 0), 0);


  const formatDate = (dateValue) => {
    // Check if date is already in dd/mm/yyyy or d/m/yyyy format
    const ddmmyyyyPattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;

    if (ddmmyyyyPattern.test(dateValue)) {
      return dateValue;  // already correctly formatted
    }

    // otherwise assume ISO or another format, parse it
    const dateObj = new Date(dateValue);
    if (isNaN(dateObj)) {
      return "";  // invalid date fallback
    }
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowUp") {
        setActiveRowIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "ArrowDown") {
        setActiveRowIndex((prev) =>
          prev < filteredEntries.length - 1 ? prev + 1 : prev
        );
    } else if (e.key === "Enter") {
      const entry = filteredEntries[activeRowIndex];
      if (entry) {
        navigate("/purchase", { state: { purId: entry._id, rowIndex: activeRowIndex } }); // ✅ pass via state
        localStorage.setItem("selectedRowIndexPList", activeRowIndex); 
      }
    }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredEntries, activeRowIndex, navigate]);

  // ✅ Restore selected row index if coming back from Sale
  useEffect(() => {
    const savedIndex = localStorage.getItem("selectedRowIndexPList");
    if (savedIndex !== null) {
      setActiveRowIndex(parseInt(savedIndex, 10));
      setTimeout(() => {
        if (rowRefs.current[savedIndex]) {
          rowRefs.current[savedIndex].focus();
          rowRefs.current[savedIndex].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }, 0);
    }
  }, []);

  // Show loading only after user selects the dates
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  // Sorting Column Order
  const sortedVisibleFields = Object.keys(tableData)
  .filter(field => tableData[field]) // only visible ones
  .sort((a, b) => {
    const orderA = parseInt(columnOrder[a]) || 999;
    const orderB = parseInt(columnOrder[b]) || 999;
    return orderA - orderB;
  });

  return (
    <div>
      <h3 className="bank-title">📒 PAYMENT LIST</h3>

      <div style={{ display: "flex",flexDirection:"row", marginBottom: 10,marginLeft:10, marginTop:"20px" }}>
      <div>
        <span className="text-lg mr-2">Period From:</span>
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            dateFormat="dd/MM/yyyy"
            className="datepickerBank"
            placeholderText="From Date"
          />
        </div>
        <div>
        <span className="text-lg ml-3 mr-2">UpTo:</span>
        <DatePicker
          selected={toDate}
          onChange={(date) => setToDate(date)}
          dateFormat="dd/MM/yyyy"
          className="datepickerBank2"
          placeholderText="To Date"
        />
        </div>
          <div style={{display:'flex',flexDirection:'row'}}>
        <Button  onClick={() => setModalOpen(true)} variant="info" style={{ marginLeft: 10,background:"blue",width:"100px" }}>Print</Button>
        <Button onClick={() => setMoreModalOpen(true)} variant="info" style={{ marginLeft: 10,background:"blue",width:"100px" }}>More</Button>
        <button
        style={{marginLeft:"10px"}}
          onClick={() => settableModalOpen(true)}
          className="text-xl text-blue-700"
        >
          <FaCog  size={25}/>
        </button>
        </div>
      </div>

      <div style={{ display: "none" }}>
        <PrintList 
        isOpen={modalOpen} 
        handleClose={() => 
        setModalOpen(false)} 
        items={filteredEntries}  
        fromDate={fromDate}
        toDate={toDate}
        tableData={tableData} // ✅ Pass it here
        fontWeight={fontWeight}
        sortedVisibleFields = {sortedVisibleFields}
        />
      </div>
        {/* More Modal */}
        <Modal show={moreModalOpen} onHide={() => setMoreModalOpen(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Filters</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{display:'flex',flexDirection:'column'}}>
          <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
              <span style={{fontWeight:'bold'}}>A/c Name</span>
            <Form.Select className={styles.filterz} value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
              <option value="">All</option>
              {uniqueSuppliers.map((vacode, index) => (
                <option key={index} value={vacode}>{vacode}</option>
              ))}
            </Form.Select>
          </div>
          <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
              <span style={{fontWeight:'bold'}}>City</span>
              <input className={styles.citY}
              id="city"
              value={formData.city}
              onChange={handleAlphabetOnly}
              />
          </div>
          <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
              <span style={{fontWeight:'bold'}}>Vehicle No</span>
              <input className={styles.vehicle}
              id="vehicle"
              value={formData.vehicle}
              onChange={handleChangevalues}
              />
          </div>
          <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
              <span style={{fontWeight:'bold',marginLeft:2}}>TaxType</span>
            <Form.Select
              id="stype"
              className={styles.stype}
              style={{ marginTop: '0px' }}
              value={formData.stype}
              onChange={handleChangevalues}
            >
            <option value="All">All</option>
            <option value="GST Sale (RD)">GST Sale (RD)</option>
            <option value="IGST Sale (RD)">IGST Sale (RD)</option>
            <option value="GST (URD)">GST (URD)</option>
            <option value="IGST (URD)">IGST (URD)</option>
            <option value="Tax Free Within State">Tax Free Within State</option>
            <option value="Tax Free Interstate">Tax Free Interstate</option>
            <option value="Export Sale">Export Sale</option>
            <option value="Export Sale(IGST)">Export Sale(IGST)</option>
            <option value="Including GST">Including GST</option>
            <option value="Including IGST">Including IGST</option>
            <option value="Not Applicable">Not Applicable</option>
            <option value="Exempted Sale">Exempted Sale</option>
            </Form.Select>
          </div>
          <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
              <span style={{fontWeight:'bold'}}>Product Name</span>
            <Form.Select className={styles.pName} value={selectedItems} onChange={(e) => setSelectedItems(e.target.value)}>
              <option value="">All</option>
              {uniqueItem.map((sdisc, index) => (
                <option key={index} value={sdisc}>{sdisc}</option>
              ))}
            </Form.Select>
          </div>
          <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
              <span style={{fontWeight:'bold'}}>Transport</span>
              <input className={styles.tpt}
              id="v_tpt"
              value={formData.v_tpt}
              onChange={handleChangevalues}
              />
          </div>
          <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
              <span style={{fontWeight:'bold'}}>Broker</span>
              <input className={styles.broker}
              id="broker"
              value={formData.broker}
              onChange={handleChangevalues}
              />
          </div>
          <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
              <span style={{fontWeight:'bold'}}>Remarks</span>
              <input className={styles.rem}
              id="rem1"
              value={formData.rem1}
              onChange={handleChangevalues}
              />
          </div>
          <div style={{display:'flex',flexDirection:"row",alignItems:'center',marginTop:"3px"}}>
            <span style={{fontWeight:'bold',marginLeft:2}}>Pos/Neg/Cancel</span>
            <Form.Select
              id="pnc"
              className={styles.pnc}
              style={{ marginTop: '0px' }}
              value={formData.pnc}
              onChange={handleChangevalues}
            >
            <option value="All">All</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
            <option value="Cancel">Cancel</option>
            </Form.Select>
            <span style={{fontWeight:'bold',marginLeft:5}}>Terms</span>
              <input className={styles.terms}
              id="terms"
              value={formData.terms}
              onChange={handleChangevalues}
              />
              {/* <span style={{fontWeight:'bold',marginLeft:5}}>Mfg/Trd</span>
              <Form.Select
              id="mfg"
              className={styles.mfg}
              style={{ marginTop: '0px' }}
              value={formData.mfg}
              onChange={handleChangevalues}
            >
            <option value=""></option>
            <option value="Manu">Manufacturing</option>
            <option value="TED">Trading Extra Duty</option>
            <option value="TS">Trading Sale</option>
            </Form.Select> */}
          </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setMoreModalOpen(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
        {/* Table fields */}
        <Modal show={tableModalOpen} onHide={() => settableModalOpen(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Filters</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{display:'flex',flexDirection:'column'}}>
            <span style={{ fontWeight: 'bold', marginTop: '10px' }}>Select Font Weight <span style={{marginLeft:"38%"}}>Font Size</span></span>
            <div style={{display:'flex',flexDirection:'row'}}>
            <Form.Select
              className={styles.filterzFont}
              style={{ marginTop: '0px' }}
              value={fontWeight}
              onChange={(e) => setFontWeight(e.target.value)}
            >
              <option value="normal">Normal</option>
              <option value="bold">Bold</option>
            </Form.Select>

            <div style={{ display: "flex", alignItems: "center", gap: "10px",marginLeft:"15%"}}>
              <Button
                variant="outline-secondary"
                onClick={() => setFontSize((prev) => Math.max(prev - 1, 10))} // limit minimum size
                style={{ fontSize: "18px", padding: "0px 10px",backgroundColor:"darkblue",border:'transparent',color:"white" }}
              >
                −
              </Button>
              <span style={{ fontSize: "16px", minWidth: "30px", textAlign: "center" }}>{fontSize}px</span>
              <Button
                variant="outline-secondary"
                onClick={() => setFontSize((prev) => Math.min(prev + 1, 25))} // limit max size
                style={{ fontSize: "18px", padding: "0px 10px",backgroundColor:"darkblue",border:'transparent',color:"white" }}
              >
                +
              </Button>
            </div>
            </div>
            <span style={{fontSize:17,fontWeight:'bold',marginTop:"10px"}}>SELECT TABLE FIELDS</span>
            <div style={{ display: "flex", flexDirection:'column',padding:"5px",border:"1px solid black",height:"340px",overflow:"auto"}}>
              <div style={{marginTop:"10px",display:'flex',flexDirection:"column"}}>
              {Object.keys(tableData).map((field) => (
              <div
                key={field}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <input
                    type="checkbox"
                    checked={tableData[field]}
                    onChange={() => handleCheckboxChange(field)}
                    style={{ width: "16px", height: "16px", marginRight: "8px" }}
                  />
                  <span style={{ marginRight: "8px", minWidth: "80px" }}>
                    {field.toUpperCase()}
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  value={columnOrder[field] || ""}
                  onChange={(e) => handleSerialChange(field, e.target.value)}
                  placeholder="Order"
                  style={{
                    width: "80px",
                    padding: "2px 5px",
                    border: "1px solid black",
                    marginRight:"40%"
                  }}
                />
              </div>
              ))}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => settableModalOpen(false)}>Close</Button>
          </Modal.Footer>
        </Modal>
        <div
          ref={tableRef}
          tabIndex={0}
          style={{ maxHeight: 530, overflowY: "auto", padding: 5, outline: "none" }}
        >
        <Table className="custom-table" bordered>
        <thead style={{ backgroundColor: "skyblue", position: "sticky", top: -6, textAlign: 'center',    fontSize: `${fontSize}px` }}>
          <tr>
            {sortedVisibleFields.map((field) => (
              <th key={field}>
                {field === "date" ? "Date" :
                field === "billno" ? "BillNo." :
                field === "accountname" ? "A/C Name" :
                field === "weight" ? "Qty" :
                field === "pcs" ? "Pcs" :
                field === "city" ? "City" :
                field === "gstin" ? "Gstin" :
                field === "value" ? "Bill Value" :
                field === "cgst" ? "C.Tax" :
                field === "sgst" ? "S.Tax" :
                field === "igst" ? "I.Tax" :
                field === "netvalue" ? "Net value" :
                field === "exp1" ? "Exp1" :
                field === "exp2" ? "Exp2" :
                field === "exp3" ? "Exp3" :
                field === "exp4" ? "Exp4" :
                field === "exp5" ? "Exp5" :
                field === "exp6" ? "Exp6" :
                field === "exp7" ? "Exp7" :
                field === "exp8" ? "Exp8" :
                field === "exp9" ? "Exp9" :
                field === "exp10" ? "Exp10" : 
                field === "description" ? "Description" : 
                field === "vehicleno" ? "Vehicleno" :    
                field === "remarks" ? "Remarks" :      
                field === "transport" ? "Transport" :     
                field === "broker" ? "Broker" :
                field === "taxtype" ? "TaxType" :
                field.toUpperCase()}
              </th>
            ))}
            <th>Paid</th>
            <th>Balance</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEntries.map((entry, index) => {
            const formData = entry.formData || {};
            const supplierdetails = entry.supplierdetails?.[0] || {};
            const item = entry.items?.[0] || {};
            const totalItemWeight = entry.items?.reduce((sum, item) => sum + parseFloat(item.weight || 0), 0).toFixed(3);
            const totalItemPkgs = entry.items?.reduce((sum, item) => sum + parseFloat(item.pkgs || 0), 0).toFixed(3);
            const isActive = index === activeRowIndex;

            return (
             <tr key={index}
                ref={(el) => (rowRefs.current[index] = el)}
                tabIndex={0} // ✅ focusable row
                onMouseEnter={() => setActiveRowIndex(index)}
                onClick={() => {
                  navigate("/purchase", { state: { purId: entry._id, rowIndex: activeRowIndex } }); // ✅ pass via state
                  localStorage.setItem("selectedRowIndexPList", activeRowIndex); 
                }}
                style={{
                  backgroundColor: isActive ? "rgb(197, 190, 190)" : "",
                  cursor: "pointer",
                  fontWeight: fontWeight,
                  fontSize: `${fontSize}px`,
                }}
              >
                {sortedVisibleFields.map((field) => {
                  let value = "";
                  if (field === "date") value = formatDate(formData.date);
                  else if (field === "billno") value = formData.vno || "";
                  else if (field === "accountname") value = supplierdetails.vacode || "";
                  else if (field === "weight") value = totalItemWeight;
                  else if (field === "pcs") value = totalItemPkgs;
                  else if (field === "city") value = supplierdetails.city || "";
                  else if (field === "gstin") value = supplierdetails.gstno || "";
                  else if (field === "value") value = formData.grandtotal || "";
                  else if (field === "cgst") value = formData.cgst || "";
                  else if (field === "sgst") value = formData.sgst || "";
                  else if (field === "igst") value = formData.igst || "";
                  else if (field === "netvalue") value = formData.sub_total || "";
                  else if (field === "exp1") value = item.Exp1 || "0.00";
                  else if (field === "exp2") value = item.Exp2 || "0.00";
                  else if (field === "exp3") value = item.Exp3 || "0.00";
                  else if (field === "exp4") value = item.Exp4 || "0.00";
                  else if (field === "exp5") value = item.Exp5 || "0.00";
                  else if (field === "exp6") value = formData.Exp6 || "";
                  else if (field === "exp7") value = formData.Exp7 || "";
                  else if (field === "exp8") value = formData.Exp8 || "";
                  else if (field === "exp9") value = formData.Exp9 || "";
                  else if (field === "exp10") value = formData.Exp10 || ""; 
                  else if (field === "description") value = item.sdisc || "";
                  else if (field === "vehicleno") value = formData.trpt || "";
                  else if (field === "remarks") value = formData.rem2 || "";
                  else if (field === "transport") value = formData.v_tpt || "";
                  else if (field === "broker") value = formData.broker || "" ;
                  else if (field === "taxtype") value = formData.stype || "" ;
                  return <td key={field}>{value}</td>;
                })}
                <td>{formatAmount(formData?.paidAmount)}</td>
                <td>{formatAmount(formData?.balance)}</td>
                <td style={{ textAlign: "center" }}>
                <Button
                  variant="success"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEntry(entry);
                    console.log("Selected entry:", entry);
                    setShowPaymentModal(true);
                  }}
                >
                  Make Payment
                </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      <tfoot style={{ backgroundColor: "skyblue", position: "sticky", bottom: -6, fontWeight, fontSize: `${fontSize}px` }}>
          <tr>
            {sortedVisibleFields.map((field, idx) => {
              let value = "";
              if (field === "date") value = "TOTAL";
              else if (field === "value") value = totalGrandTotal.toFixed(2);
              else if (field === "cgst") value = totalCGST.toFixed(2);
              else if (field === "sgst") value = totalSGST.toFixed(2);
              else if (field === "igst") value = totalIGST.toFixed(2);
              else if (field === "netvalue") value = totalTAX.toFixed(2);
              else if (field === "weight") value = totalWeight.toFixed(3);
              else if (field === "pcs") value = totalPcs.toFixed(3);
              else if (field === "exp1") value = totalexp1.toFixed(2);
              else if (field === "exp2") value = totalexp2.toFixed(2);
              else if (field === "exp3") value = totalexp3.toFixed(2);
              else if (field === "exp4") value = totalexp4.toFixed(2);
              else if (field === "exp5") value = totalexp5.toFixed(2);
              else if (field === "exp6") value = totalexp6.toFixed(2);
              else if (field === "exp7") value = totalexp7.toFixed(2);
              else if (field === "exp8") value = totalexp8.toFixed(2);
              else if (field === "exp9") value = totalexp9.toFixed(2);
              else if (field === "exp10") value = totalexp10.toFixed(2);
              return <td key={field} style={{ fontWeight: value ? "bold" : "", color: value ? "red" : "" }}>{value}</td>;
            })}
             <td style={{ fontWeight: "bold", color: "red" }}>
                {formatAmount(totalPaid)}
              </td>
              <td style={{ fontWeight: "bold", color: "red" }}>
                {formatAmount(totalBalance)}
              </td>
            <td></td>
          </tr>
        </tfoot>
        </Table>
      </div>
        <PaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        entry={selectedEntry}
        onPaymentSaved={fetchEntries}
      />
    </div>
  );
};

export default PaymentList;
