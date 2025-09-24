import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Table, Modal, Button, Card, Form } from "react-bootstrap";  // ✅ Form imported
import styles from "./LedgerList.module.css";
import TextField from "@mui/material/TextField";
import { useNavigate, useLocation } from "react-router-dom";  // ✅ Add this
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useCompanySetup from "../Shared/useCompanySetup";

const LedgerList = () => {
  const { dateFrom } = useCompanySetup();

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

  // Filters Transactions
  const [showOptions, setShowOptions] = useState(false);   // ✅ For Options modal
  const [filterType, setFilterType] = useState("All");     // ✅ Debit / Credit / All
  const [filteredTransactions, setFilteredTransactions] = useState([]); // ✅ For filtered txns
  const [narrationFilter, setNarrationFilter] = useState(""); // ✅ for narration
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

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
    const saved = localStorage.getItem("flaggedRows");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem("flaggedRows", JSON.stringify([...flaggedRows]));
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
    axios
      .get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount")
      .then((res) => {
        const data = res.data.data || [];
        setLedgers(data);
        setFilteredLedgers(data); // ✅ keep backup
      })
      .catch((err) => console.error(err));
  }, []);

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

  const handleModify = () => {
    if (!filteredLedgers.length) return;
    const selectedLedger = filteredLedgers[selectedIndex]; // focused row
    if (selectedLedger) {
      navigate("/ledgerAcc", {
        state: {
          ledgerId: selectedLedger._id,   // ✅ pass the ID
          rowIndex: selectedIndex,        // ✅ keep focus index
          selectedLedger,                 // ✅ full ledger object (if needed)
          // keepModalOpen: true,            // ✅ same flag style as Sale
        },
      });
    }
  };



  return (
    <div style={{ padding: "20px" }}>
      <Card className={styles.cardL}>
        <h3 className={styles.headerlist}>LEDGER ACCOUNTS</h3>

        <div className={styles.tablecont}>
          <Table size="sm" className="custom-table" hover ref={tableRef}>
            <thead style={{ position: "sticky", top: 0, background: "skyblue", fontSize: 17, textAlign: "center" }}>
              <tr>
                <th></th>  {/* ✅ Checkbox column header (empty) */}
                <th>NAME</th>
                <th>GROUP</th>
                <th>CITY</th>
                <th>GST NO</th>
                <th>PHONE</th>
              </tr>
            </thead>
            <tbody>
              {filteredLedgers.map((ledger, index) => (
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
                  onMouseEnter={() => setSelectedIndex(index)}   // ✅ highlight on hover
                >
                  <td style={{ textAlign: "center" }}
                    onClick={(e) => e.stopPropagation()}
                    >
                    <input
                      type="checkbox"
                      checked={!!checkedRows[ledger._id]}
                      onChange={() => handleCheckboxChange(ledger._id)}
                    />
                  </td>
                  <td>{ledger.formData.ahead}</td>
                  <td>{ledger.formData.Bsgroup}</td>
                  <td>{ledger.formData.city}</td>
                  <td>{ledger.formData.gstNo}</td>
                  <td>{ledger.formData.phone}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* ✅ Search Input */}
        <div style={{display:'flex',flexDirection:"row",justifyContent:"space-between"}}>
          <Form.Control
          ref={searchRef}
          className={styles.Search}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            style={{ marginRight: "20px", marginTop: "10px" }}
            onClick={handleModify}
          >
            Modify
          </Button>

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
                      value={fromDate}
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
              onChangeRaw={(e) => {
                let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
                if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9);

                e.target.value = val; // Show formatted input
              }}
              dateFormat="dd/MM/yyyy"
              className={styles.from}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upto Date</Form.Label>
            <DatePicker
              selected={toDate}
              onChange={(date) => setToDate(date)}     // ✅ FIXED
              onChangeRaw={(e) => {
                let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
                if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9);

                e.target.value = val; // Show formatted input
              }}
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
          <Button
            variant="warning"
            onClick={() => {
              setFilterType("All");
              setNarrationFilter("");
              setFromDate("");
              setToDate("");
            }}
          >
            Clear Filters
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LedgerList;
