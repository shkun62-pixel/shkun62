import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { Table, Modal, Button, Card, Form } from "react-bootstrap";  // ✅ Form imported
import styles from "../AccountStatement/LedgerList.module.css";
import TextField from "@mui/material/TextField";
import { useNavigate, useLocation } from "react-router-dom";  // ✅ Add this
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useCompanySetup from "../Shared/useCompanySetup";
import OptionModal from "./OptionModal";
import "./TrailBalance.css"
import PrintTrail from "./PrintTrail";
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';

const TrailBalance = () => {
  const { dateFrom, companyName, companyAdd, companyCity } = useCompanySetup();

  const [ledgers, setLedgers] = useState([]);
  const [filteredLedgers, setFilteredLedgers] = useState([]); // ✅ for search
  const [searchTerm, setSearchTerm] = useState("");           // ✅ search state
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const rowRefs = useRef([]);
  const tableRef = useRef(null);
  const searchRef = useRef(null);   // ✅ search input ref
  const navigate = useNavigate();
  const [activeRowIndex, setActiveRowIndex] = useState(0);  // ✅ Track highlighted txn row
  const location = useLocation();
  const [checkedRows, setCheckedRows] = useState({});

  // Printing Trail Balance
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Filter Ledger Accounts 
  const [ledgerFromDate, setLedgerFromDate] = useState(null);
  const [ledgerToDate, setLedgerToDate] = useState(() => new Date());
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  
  const openOptionModal = () => {
    setIsOptionOpen(true);
  };
  const closeOptionModal = () => {
    setIsOptionOpen(false);
  };

  useEffect(() => {
    if (!ledgerFromDate && dateFrom) {
      setLedgerFromDate(new Date(dateFrom));
    }
  }, [dateFrom, ledgerFromDate]);

  // Filters Transactions Account Statement 
  const [showOptions, setShowOptions] = useState(false);   // ✅ For Options modal
  const [filterType, setFilterType] = useState("All");     // ✅ Debit / Credit / All
  const [filteredTransactions, setFilteredTransactions] = useState([]); // ✅ For filtered txns
  const [narrationFilter, setNarrationFilter] = useState(""); // ✅ for narration
  const [fromDate, setFromDate] = useState("");
  // const [toDate, setToDate] = useState("");
  const [toDate, setToDate] = useState(() => new Date());

  useEffect(() => {
    if (!fromDate && dateFrom) {
      setFromDate(new Date(dateFrom));
    }
  }, [dateFrom, fromDate]);

  // ✅ Update filtered transactions whenever filterType or transactions change
  useEffect(() => {
    let data = transactions;

    // ✅ Filter by Debit/Credit
    if (filterType !== "All") {
      data = data.filter(
        (txn) => txn.type.toLowerCase() === filterType.toLowerCase()
      );
    }

    // ✅ Filter by narration
    if (narrationFilter.trim() !== "") {
      data = data.filter((txn) =>
        txn.narration?.toLowerCase().includes(narrationFilter.toLowerCase())
      );
    }

    // ✅ Filter by Date range
    if (fromDate) {
      data = data.filter((txn) => new Date(txn.date) >= fromDate);
    }
    if (toDate) {
      data = data.filter((txn) => new Date(txn.date) <= toDate);
    }

    setFilteredTransactions(data);
  }, [filterType, narrationFilter, fromDate, toDate, transactions]);

  const [flaggedRows, setFlaggedRows] = useState(() => {
    const saved = localStorage.getItem("flaggedRowsTrail");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem("flaggedRowsTrail", JSON.stringify([...flaggedRows]));
  }, [flaggedRows]);

  // Auto focus search field on mount
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (showModal && rowRefs.current[activeRowIndex]) {
      const row = rowRefs.current[activeRowIndex];
      const container = row.closest(`.${styles.tableHeight}`);

      if (container && row) {
        const rowTop = row.offsetTop;
        const rowBottom = rowTop + row.offsetHeight;
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;

        // 🔹 Scroll down if row is below view
        if (rowBottom > containerBottom) {
          container.scrollTop = rowBottom - container.clientHeight;
        }
        // 🔹 Scroll up if row is above view
        else if (rowTop < containerTop) {
          container.scrollTop = rowTop;
        }
      }
    }
  }, [activeRowIndex, showModal]);

  // Fetch ledger list
  useEffect(() => {
  const fetchData = async () => {
    try {
      const [ledgerRes, faRes] = await Promise.all([
        axios.get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount"),
        axios.get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile")
      ]);

      const ledgersData = ledgerRes.data.data || [];
      const faData = faRes.data.data || [];

      const ledgerTotals = {};

      faData.forEach(entry => {
        entry.transactions.forEach(txn => {
          const txnDate = new Date(txn.date);

          // 🔹 Apply date filter if selected
          if (ledgerFromDate && txnDate < ledgerFromDate) return;
          if (ledgerToDate && txnDate > ledgerToDate) return;

          const acc = txn.account.trim();
          if (!ledgerTotals[acc]) {
            ledgerTotals[acc] = { debit: 0, credit: 0 };
          }
          if (txn.type.toLowerCase() === "debit") {
            ledgerTotals[acc].debit += txn.amount;
          } else if (txn.type.toLowerCase() === "credit") {
            ledgerTotals[acc].credit += txn.amount;
          }
        });
      });

      // Attach totals
      const filtered = ledgersData
        .filter(ledger => ledgerTotals[ledger.formData.ahead.trim()])
        .map(ledger => {
          const acc = ledger.formData.ahead.trim();
          const debit = ledgerTotals[acc].debit;
          const credit = ledgerTotals[acc].credit;
          const balance = debit - credit;
          const drcr = balance >= 0 ? "DR" : "CR";
          return {
            ...ledger,
            totals: {
              balance,
              drcr
            }
          };
        });

      setLedgers(filtered);
      setFilteredLedgers(filtered);

    } catch (err) {
      console.error(err);
    }
  };

  fetchData();
}, [ledgerFromDate, ledgerToDate]);   // ✅ re-run when dates change

  // ✅ Handle search filtering
  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = ledgers.filter((ledger) =>
      ledger.formData.ahead.toLowerCase().includes(lower) ||
      ledger.formData.city?.toLowerCase().includes(lower) ||
      ledger.formData.gstNo?.toLowerCase().includes(lower) ||
      ledger.formData.phone?.toLowerCase().includes(lower)
    );
    setFilteredLedgers(filtered);
    setSelectedIndex(0); // reset highlight
  }, [searchTerm, ledgers]);

  // 👉 Function to handle navigation based on vtype
  const handleTransactionSelect = (txn) => {
    if (!txn) return;
    const modalState = {
      rowIndex: activeRowIndex,
      selectedLedger,
      keepModalOpen: true,
    };

    sessionStorage.setItem("trailModalState", JSON.stringify(modalState));

    switch (txn.vtype) {   // ✅ use vtype from your transaction object
      case "S": // Sale
        navigate("/Sale", {
        state: {
          saleId: txn._id,
        },
      });
        break;
      case "P": // Purchase
        navigate("/purchase", {
        state: {
          purId: txn._id,
        },
      });
        // navigate("/purchase", { state: { purId: txn._id, rowIndex: activeRowIndex } });
        break;
      case "B": // Bank
       navigate("/bankvoucher", {
        state: {
          bankId: txn._id,
        },
      });
        // navigate("/bankvoucher", { state: { bankId: txn._id, rowIndex: activeRowIndex } });
        break;
      case "C": // Cash
        navigate("/cashvoucher", {
        state: {
          cashId: txn._id,
        },
      });
        // navigate("/cashvoucher", { state: { cashId: txn._id, rowIndex: activeRowIndex } });
        break;
      case "J": // Journal
       navigate("/journalvoucher", {
        state: {
          journalId: txn._id,
        },
      });
        // navigate("/journalvoucher", { state: { journalId: txn._id, rowIndex: activeRowIndex } });
        break;
      default:
        console.log("Unknown vtype:", txn.vtype);
    }
  };

  useEffect(() => {
    const reopenModal = (e) => {
      const { rowIndex, selectedLedger } = e.detail;
      setActiveRowIndex(rowIndex || 0);
      if (selectedLedger) openLedgerDetails(selectedLedger);
    };

    window.addEventListener("reopenTrailModal", reopenModal);
    return () => window.removeEventListener("reopenTrailModal", reopenModal);
  }, []);

  // 🔹 Keyboard navigation inside transactions for Account Statement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!transactions.length || !showModal) return; // ✅ Only when modal is open

      if (e.key === "ArrowUp") {
        setActiveRowIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "ArrowDown") {
        setActiveRowIndex((prev) =>
          prev < transactions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "Enter") {
        const entry = transactions[activeRowIndex];
        handleTransactionSelect(entry); // ✅ Navigate
      } else if (e.key === "Escape") {
        setShowModal(false); // ✅ Close modal
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [transactions, activeRowIndex, showModal]);

  // Handle keyboard navigation for LedgerList
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!filteredLedgers.length) return;

      if (e.key === "ArrowDown") {
        setSelectedIndex((prev) => (prev + 1) % filteredLedgers.length);
      } else if (e.key === "ArrowUp") {
        setSelectedIndex((prev) =>
          prev === 0 ? filteredLedgers.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        const ledger = filteredLedgers[selectedIndex];
        openLedgerDetails(ledger);
      } else if (e.key === "F3") {
        e.preventDefault();
        setFlaggedRows((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(selectedIndex)) {
            newSet.delete(selectedIndex); // unflag if already red
          } else {
            newSet.add(selectedIndex); // mark as red
          }
          return newSet;
        });
      }
    };

    if (!showModal) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredLedgers, selectedIndex, showModal]);

  // Open modal and fetch transactions
  const openLedgerDetails = (ledger) => {
    setSelectedLedger(ledger);
    axios
      .get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile")
      .then((res) => {
        const allTxns = res.data.data || [];
        const ledgerTxns = allTxns.flatMap((entry) =>
          entry.transactions.filter(
            (txn) => txn.account.trim() === ledger.formData.ahead.trim()
          )
        );
        setTransactions(ledgerTxns);
        setShowModal(true);
      })
      .catch((err) => console.error(err));
  };

  const handleCheckboxChange = (id) => {
    setCheckedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ Compute selected debit/credit sums
  const { selectedDebit, selectedCredit } = useMemo(() => {
    let debitSum = 0;
    let creditSum = 0;

    filteredLedgers.forEach((ledger) => {
      if (checkedRows[ledger._id]) {
        const { balance, drcr } = ledger.totals || {};
        if (drcr === "DR") debitSum += Math.abs(balance);
        if (drcr === "CR") creditSum += Math.abs(balance);
      }
    });

    return {
      selectedDebit: debitSum,
      selectedCredit: creditSum,
    };
  }, [checkedRows, filteredLedgers]);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const exportToExcel = () => {
    const data = filteredLedgers.map((ledger) => {
      const { balance, drcr } = ledger.totals || {};
      return {
        Name: ledger.formData.ahead,
        City: ledger.formData.city,
        Debit: drcr === "DR" ? Math.abs(balance) : "",
        Credit: drcr === "CR" ? Math.abs(balance) : "",
        Qty : ledger.formData.qty,
        "A/c Code": ledger.formData.acode,
        "Group Name": ledger.formData.Bsgroup,
      };
    });

    if (data.length === 0) return;

    const header = Object.keys(data[0]);

    // Period
    const periodFrom = ledgerFromDate ? formatDate(ledgerFromDate) : "--";
    const periodTo = ledgerToDate ? formatDate(ledgerToDate) : "--";

    // Build sheet data
    const sheetData = [
      [companyName || "Company Name"],
      [companyAdd || "Company Address"],
      [companyCity || "Company City"],
      [`TRIAL BALANCE - Period From: ${periodFrom} To: ${periodTo}`],
      [],
      header,
      ...data.map(row => header.map(h => row[h]))
    ];

    // ✅ Totals Row with Excel formula
    const numericFields = ["Debit", "Credit"];
    const totals = {};
    header.forEach((h, index) => {
      if (index === 0) {
        totals[h] = "TOTAL";
      } else if (numericFields.includes(h)) {
        const colLetter = XLSX.utils.encode_col(index);
        const firstRow = 6; // data starts row 6
        const lastRow = 6 + data.length;
        totals[h] = { f: `SUBTOTAL(9,${colLetter}${firstRow}:${colLetter}${lastRow})` };
      } else {
        totals[h] = "";
      }
    });
    sheetData.push(header.map(h => totals[h]));

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Column widths
    worksheet["!cols"] = [
      { wch: 40 }, // Name
      { wch: 20 }, // City
      { wch: 15 }, // Debit
      { wch: 15 }, // Credit
      { wch: 10 }, // Qty
      { wch: 15 }, // A/c Code
      { wch: 30 }, // BsGroup
    ];

    // Style headers
    header.forEach((_, colIdx) => {
      const cellAddr = XLSX.utils.encode_cell({ r: 5, c: colIdx });
      if (worksheet[cellAddr]) {
        worksheet[cellAddr].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
    });

    // Style company rows
    ["A1", "A2", "A3", "A4"].forEach((cell, idx) => {
      if (worksheet[cell]) {
        worksheet[cell].s = {
          font: { bold: true, sz: idx === 0 ? 16 : 12, color: { rgb: "000000" } },
          alignment: { horizontal: "center" }
        };
      }
    });

    // Right-align numeric fields
    numericFields.forEach(field => {
      const colIdx = header.indexOf(field);
      if (colIdx !== -1) {
        for (let r = 6; r < data.length + 6; r++) {
          const addr = XLSX.utils.encode_cell({ r, c: colIdx });
          if (worksheet[addr]) {
            worksheet[addr].s = {
              alignment: { horizontal: "right" },
              numFmt: "0.00"  // ✅ keeps 2 decimal places
            };
          }
        }
      }
    });

    // Left-align A/c Code column
    const acCodeColIdx = header.indexOf("A/c Code");
    if (acCodeColIdx !== -1) {
      for (let r = 6; r < data.length + 6; r++) {
        const addr = XLSX.utils.encode_cell({ r, c: acCodeColIdx });
        if (worksheet[addr]) {
          worksheet[addr].s = { alignment: { horizontal: "left" } };
        }
      }
    }

    // Style totals row
    const totalRowIndex = data.length + 6;
    header.forEach((_, colIdx) => {
      const addr = XLSX.utils.encode_cell({ r: totalRowIndex, c: colIdx });
      if (worksheet[addr]) {
        worksheet[addr].s = {
          font: { bold: true, color: { rgb: "000000" } },
          fill: { patternType: "solid", fgColor: { rgb: "D9D9D9" } },
          alignment: { horizontal: colIdx === 0 ? "left" : "right", vertical: "center" }
        };
      }
    });

    // Merge headers (company rows)
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: header.length - 1 } }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trial Balance");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array", cellStyles: true });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "TrialBalance.xlsx");
  };



  return (
    <div style={{ padding: "10px" }}>
      <Card className="contMain">
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: "10px" }}>
          {/* Date Filters */}
          <div style={{ display: "flex", flexDirection:"column", alignItems: "center",gap:"10px" }}>
            <div style={{display:'flex',flexDirection:'row'}}>
            <span className="textform"><b>From:</b></span>
            <DatePicker
              className="fDate"
              selected={ledgerFromDate}
              onChange={(date) => setLedgerFromDate(date)}
              dateFormat="dd/MM/yyyy"
            />
            </div>
            <div style={{display:'flex',flexDirection:'row'}}>
            <span className="textform"><b>To:</b></span>
            <DatePicker
              className="toDate"
              selected={ledgerToDate}
              onChange={(date) => setLedgerToDate(date)}
              dateFormat="dd/MM/yyyy"
            />
            </div>
          </div>
           <h3 className="headerTrail">TRAIL BALANCE</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
           <text style={{ fontSize:20}} className="textform">
              Selected Debit:
            </text>
            <input
              style={{ marginLeft: 15,color:"darkblue" }}
              className="value"
              value={selectedDebit.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              readOnly
            />
         </div>
         <div style={{ display: "flex", flexDirection: "row",marginTop:10}}>
          <text style={{fontSize:20}} className="textform">
              Selected Credit:
          </text>
           <input
              style={{ marginLeft: 7,color:"red" }}
              className="value"
              value={selectedCredit.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              readOnly
            />
          </div>
        </div>

        </div>

        <div className="tableT">
          <Table size="sm" className="custom-table" hover ref={tableRef}>
            <thead style={{ position: "sticky", top: 1, background: "skyblue", fontSize: 17, textAlign: "center" }}>
              <tr>
                <th></th>
                <th>NAME</th>
                <th>CITY</th>
                <th>DEBIT</th>
                <th>CREDIT</th>
              </tr>
            </thead>

            <tbody>
              {filteredLedgers.map((ledger, index) => {
                const { balance, drcr } = ledger.totals || {};
                return (
                  <tr
                    key={ledger._id}
                    style={{
                      backgroundColor: flaggedRows.has(index)
                        ? "red"
                        : index === selectedIndex
                        ? "rgb(187, 186, 186)"
                        : "transparent",
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                    onClick={() => openLedgerDetails(ledger)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                      <input
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                        type="checkbox"
                        checked={!!checkedRows[ledger._id]}
                        onChange={() => handleCheckboxChange(ledger._id)}
                      />
                    </td>
                    <td>{ledger.formData.ahead}</td>
                    <td>{ledger.formData.city}</td>

                    <td style={{ textAlign: "right", color: "darkblue", fontWeight:"bold" }}>
                      {drcr === "DR" ? Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}

                    </td>
                    <td style={{ textAlign: "right", color: "red", fontWeight:"bold" }}>
                      {drcr === "CR" ? Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""}

                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* ✅ Footer for totals */}
            <tfoot style={{backgroundColor: "skyblue", position: "sticky", bottom: -8,}}>
              <tr style={{ fontWeight: "bold",fontSize:20 }}>
                <td colSpan={3} style={{ textAlign: "right" }}>TOTAL:</td>
                <td style={{ textAlign: "right", color: "darkblue" }}>
                {filteredLedgers
                  .reduce((sum, ledger) => sum + (ledger.totals?.drcr === "DR" ? Math.abs(ledger.totals.balance) : 0), 0)
                  .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td style={{ textAlign: "right", color: "red" }}>
                {filteredLedgers
                  .reduce((sum, ledger) => sum + (ledger.totals?.drcr === "CR" ? Math.abs(ledger.totals.balance) : 0), 0)
                  .toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>

        {/* ✅ Search Input */}
        <div style={{display:'flex',flexDirection:"row"}}>
          <Form.Control
            ref={searchRef}
            className={styles.Search}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div style={{marginTop:"5px"}}>
          <Button className="Button" style={{backgroundColor:"#3d85c6",width:"100px"}} onClick={openOptionModal} >Options</Button>
          <OptionModal isOpen={isOptionOpen} onClose={closeOptionModal}/> 
          <Button className="Button" style={{backgroundColor:'#3d85c6',width:"100px"}} onClick={handleOpen} >Print</Button>
          <PrintTrail
            items={filteredLedgers.map((ledger) => {
              const { balance, drcr } = ledger.totals || {};
              return {
                name: ledger.formData.ahead,
                city: ledger.formData.city,
                debit: drcr === "DR" ? Math.abs(balance) : 0,
                credit: drcr === "CR" ? Math.abs(balance) : 0,
              };
            })}
            isOpen={open}
            handleClose={handleClose}
            ledgerFrom={ledgerFromDate}
            ledgerTo={ledgerToDate}
          />

            {/* <PrintTrail
            items={filteredLedgers}   // ✅ renamed correctly
            isOpen={open}
            handleClose={handleClose}
          /> */}
          <Button className="Button" style={{backgroundColor:'#3d85c6',width:"100px"}}  onClick={exportToExcel}>Export </Button>
          <Button className="Button" style={{backgroundColor:'#3d85c6',width:"100px"}}>Exit</Button>
          </div>
        </div>

      </Card>
      {/* ... Modal code remains same ... */}
        <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setActiveRowIndex(0); // ✅ reset highlight when closing modal manually
        }}
       className="custom-modal"
       style={{marginTop:20}}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            ACCOUNT STATEMENT
            {/* Ledger Details - {selectedLedger?.formData?.ahead} */}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLedger && (
            <div>
              <div style={{display:'flex',flexDirection:"row",justifyContent:'space-between'}}>             
                <p>
                  <span style={{fontSize:17}}><b>Code:</b> {selectedLedger.formData.acode} <br /></span>
                  <span style={{fontSize:17}}><b>GST No:</b> {selectedLedger.formData.gstNo} <br /></span>
                  <span style={{fontSize:17}}><b>PAN:</b> {selectedLedger.formData.pan} <br /></span>
                  <span style={{fontSize:17}}><b>Phone:</b>  {selectedLedger.formData.phone}  <br /></span>
                  <span style={{fontSize:17}}><b>Email:</b> {selectedLedger.formData.email} <br /></span>
                </p>
                <div style={{display:'flex',flexDirection:'column',textAlign:'center'}}>
                  <b style={{fontSize:20}}>{selectedLedger.formData.ahead}{" "}</b> 
                  <b style={{fontSize:20}}>{selectedLedger.formData.add1}{" "}</b> 
                  <b style={{fontSize:20}}>{selectedLedger.formData.city}{" "}</b> 
                  {/* ✅ Closing Balance Display */}
                  {transactions.length > 0 && (
                    <div style={{ fontSize: "20px" }}>
                      {(() => {
                        let balance = 0;
                        transactions.forEach((txn) => {
                          if (txn.type.toLowerCase() === "debit") {
                            balance += txn.amount;
                          } else if (txn.type.toLowerCase() === "credit") {
                            balance -= txn.amount;
                          }
                        });
                        const drcr = balance >= 0 ? "DR" : "CR";
                        const color = drcr === "DR" ? "darkblue" : "red";
                        return (
                          <b style={{ color }}>
                            Balance Rs: {Math.abs(balance).toFixed(2)} {drcr}
                          </b>
                        );
                      })()}
                    </div>
                  )}
              </div>
              <div style={{display:'flex',flexDirection:'column',textAlign:'center'}}>
                <div style={{display:'flex',flexDirection:"row",alignItems:'center'}}>
                  <b style={{fontSize:16,marginRight:"14px"}}>Progressive DR</b>
                   <TextField
                      className="custom-bordered-input"
                      size="small"
                      inputProps={{
                        maxLength: 48,
                        style: {
                          height: "10px",
                          width:"206px"
                        },
                      }}
                    />
                </div>
                <div style={{display:'flex',flexDirection:"row",alignItems:'center'}}>
                  <b style={{fontSize:16,marginRight:"14px"}}>Progressive CR</b>
                   <TextField
                      className="custom-bordered-input"
                      size="small"
                      inputProps={{
                        maxLength: 48,
                        style: {
                          height: "10px",
                          width:"206px"
                        },
                      }}
                    />
                </div>
                <div style={{display:'flex',flexDirection:"row",alignItems:'center'}}>
                  <b style={{fontSize:16,marginRight:"10px"}}>Progressive Qty</b>
                   <TextField
                      className="custom-bordered-input"
                      size="small"
                      inputProps={{
                        maxLength: 48,
                        style: {
                          height: "10px",
                          width:"206px"
                        },
                      }}
                    />
                </div>
                <div style={{display:'flex',flexDirection:"row",alignItems:'center', marginTop:5}}>
                  <b style={{fontSize:16,marginRight:"77px"}}>Period</b>
                   <TextField
                      className="custom-bordered-input"
                      size="small"
                      value={formatDate(fromDate)}   // 👈 formatted here
                      inputProps={{
                        maxLength: 48,
                        style: {
                          height: "10px",
                          width:"90px"
                        },
                      }}
                    />
                     <TextField
                      className="custom-bordered-input"
                      size="small"
                      value={formatDate(toDate)}   // 👈 formatted here
                      inputProps={{
                        maxLength: 48,
                        style: {
                          height: "10px",
                          width:"90px"
                        },
                      }}
                    />
                </div>
              </div>
              </div>

              <div className={styles.tableHeight}>
                <Table size="sm" className="custom-table">
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      background: "skyblue",
                      fontSize: 17,
                      textAlign: "center",
                      zIndex: 2,
                    }}
                  >
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Narration</th>
                      <th>Debit</th>
                      <th>Credit</th>
                      <th>Balance</th>
                      <th>DR/CR</th>
                    </tr>
                  </thead>

                  <tbody>
                    {transactions.length > 0 ? (
                      (() => {
                        let balance = 0;
                        let totalDebit = 0;
                        let totalCredit = 0;

                        return filteredTransactions.map((txn,index) => {
                          if (txn.type.toLowerCase() === "debit") {
                            balance += txn.amount;
                            totalDebit += txn.amount;
                          } else if (txn.type.toLowerCase() === "credit") {
                            balance -= txn.amount;
                            totalCredit += txn.amount;
                          }

                          const drcr = balance >= 0 ? "DR" : "CR";
                          const color = drcr === "DR" ? "darkblue" : "red";

                          return (
                            <tr key={txn._id}     
                              ref={(el) => (rowRefs.current[index] = el)} // ✅ attach ref
                              style={{
                                  fontWeight: "bold",
                                  fontSize: 16,
                                  backgroundColor: index === activeRowIndex ? "rgb(187, 186, 186)" : "transparent", // ✅ highlight
                                  cursor: "pointer",
                                }}
                                onClick={() => handleTransactionSelect(txn)}
                                onMouseEnter={() => setActiveRowIndex(index)}   // ✅ highlight on hover
                              >
                              <td>{new Date(txn.date).toLocaleDateString("en-GB")}</td>
                              <td style={{ textAlign: "center" }}>{txn.vtype}</td>
                              <td>{txn.narration}</td>
                              <td style={{ textAlign: "right", color: "darkblue" }}>
                                {txn.type.toLowerCase() === "debit"
                                  ? txn.amount.toFixed(2)
                                  : ""}
                              </td>
                              <td style={{ textAlign: "right", color: "red" }}>
                                {txn.type.toLowerCase() === "credit"
                                  ? txn.amount.toFixed(2)
                                  : ""}
                              </td>
                              <td style={{ textAlign: "right", color }}>
                                {Math.abs(balance).toFixed(2)}
                              </td>
                              <td style={{ textAlign: "center", fontWeight: "bold", color }}>
                                {drcr}
                              </td>
                            </tr>
                          );
                        });
                      })()
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>

                  {/* ✅ Proper footer row */}
                  {transactions.length > 0 && (() => {
                    let totalDebit = 0;
                    let totalCredit = 0;
                    let balance = 0;

                 filteredTransactions.forEach((txn) => {
                  if (txn.type.toLowerCase() === "debit") {
                    balance += txn.amount;
                    totalDebit += txn.amount;
                  } else if (txn.type.toLowerCase() === "credit") {
                    balance -= txn.amount;
                    totalCredit += txn.amount;
                  }
                });

                    const drcrFinal = balance >= 0 ? "DR" : "CR";
                    const colorFinal = drcrFinal === "DR" ? "darkblue" : "red";

                    return (
                      <tfoot>
                        <tr
                          style={{
                            position: "sticky",
                            bottom: -1,
                            background: "skyblue",
                            fontWeight: "bold",
                            fontSize: 16,
                          }}
                        >
                          <td colSpan={3} style={{ textAlign: "center" }}>
                            Totals
                          </td>
                          <td style={{ textAlign: "right", color: "darkblue" }}>
                            {totalDebit.toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right", color: "red" }}>
                            {totalCredit.toFixed(2)}
                          </td>
                          <td style={{ textAlign: "right", color: colorFinal }}>
                            {Math.abs(balance).toFixed(2)}
                          </td>
                          <td style={{ textAlign: "center", color: colorFinal }}>
                            {drcrFinal}
                          </td>
                        </tr>
                      </tfoot>
                    );
                  })()}
                </Table>
              </div>
              <div className="d-flex justify-content-between mt-2">
              <div>
                <Button size="sm" variant="secondary">Refresh</Button>{" "}
                <Button size="sm" variant="secondary" onClick={() => setShowOptions(true)}>Options</Button>{" "}
                <Button size="sm" variant="secondary">Select</Button>{" "}
                <Button size="sm" variant="secondary">Export</Button>{" "}
                <Button size="sm" variant="secondary">Print</Button>{" "}
                <Button size="sm" variant="secondary">Email</Button>{" "}
              </div>
            </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
      <Modal style={{zIndex:100000}} show={showOptions} onHide={() => setShowOptions(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Filter Transactions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>From Date</Form.Label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}   // ✅ FIXED
              dateFormat="dd/MM/yyyy"
              className={styles.from}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upto Date</Form.Label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}     // ✅ FIXED
              dateFormat="dd/MM/yyyy"
              className={styles.to}
            />
          </Form.Group>
          {/* Debit / Credit Select */}
          <Form.Group >
            <Form.Label>Select Type</Form.Label>
            <Form.Select
              className={styles.tType}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Debit">Debit</option>
              <option value="Credit">Credit</option>
            </Form.Select>
          </Form.Group>

            
          <div style={{display:'flex',flexDirection:'row'}}>
            <Form.Label style={{marginTop:5}}>Narration</Form.Label>
            <input
              className={styles.nar}
              type="text"
              value={narrationFilter}
              onChange={(e) => setNarrationFilter(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOptions(false)}>
            Close
          </Button>
          {/* <Button
            variant="warning"
            onClick={() => {
              setFilterType("All");
              setNarrationFilter("");
              setFromDate("");
              setToDate("");
            }}
          >
            Clear Filters
          </Button> */}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TrailBalance;
