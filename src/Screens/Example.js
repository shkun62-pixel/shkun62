import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { Table, Modal, Button, Card, Form } from "react-bootstrap";  // ✅ Form imported
import styles from "./AccountStatement/LedgerList.module.css";
import TextField from "@mui/material/TextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useCompanySetup from "./Shared/useCompanySetup";
import OptionModal from "./TrailBalance/OptionModal";
import "./TrailBalance/TrailBalance.css"

const Example = () => {
  const { dateFrom } = useCompanySetup();

  const [allLedgers, setAllLedgers] = useState([]); // keep full list
  const [filteredLedgers, setFilteredLedgers] = useState([]); // ✅ for search
  const [searchTerm, setSearchTerm] = useState("");           // ✅ search state
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const rowRefs = useRef([]);
  const tableRef = useRef(null);
  const searchRef = useRef(null);   // ✅ search input ref
  const groupRowRefs = useRef([]);

  const [activeRowIndex, setActiveRowIndex] = useState(0);  // ✅ Track highlighted txn row
  const [checkedRows, setCheckedRows] = useState({});

  // Filter Ledger Accounts 
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupedLedgersToPick, setGroupedLedgersToPick] = useState([]);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [currentGroupName, setCurrentGroupName] = useState("");
  const [selectedGroupRows, setSelectedGroupRows] = useState(new Set());




  const [ledgerFromDate, setLedgerFromDate] = useState(null);
  const [ledgerToDate, setLedgerToDate] = useState(() => new Date());
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [optionValues, setOptionValues] = useState({
    Balance: "Active Balance",
    OrderBy: "",
    Annexure: "All",
    T1: "", // ✅ include T1 (Selected Accounts)
    T3: false, // ✅ Print Current Date
    T10: false, // ✅ group by BsGroup toggle
  });
  
  const openOptionModal = () => {
    setIsOptionOpen(true);
  };
  const closeOptionModal = () => {
    setIsOptionOpen(false);
  };

useEffect(() => {
  const handleGroupModalKeyDown = (e) => {
    if (!showGroupModal || !groupedLedgersToPick.length) return;

    e.preventDefault(); // 🔹 prevent background scrolling or default browser behavior

    if (e.key === "ArrowDown") {
      setActiveGroupIndex((prev) => (prev + 1) % groupedLedgersToPick.length);
    } else if (e.key === "ArrowUp") {
      setActiveGroupIndex((prev) =>
        prev === 0 ? groupedLedgersToPick.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      const selectedLedger = groupedLedgersToPick[activeGroupIndex];
      setShowGroupModal(false);
      fetchLedgerTransactions(selectedLedger);
    } else if (e.key === "Escape") {
      setShowGroupModal(false);
    }
  };

  window.addEventListener("keydown", handleGroupModalKeyDown);
  return () => window.removeEventListener("keydown", handleGroupModalKeyDown);
}, [showGroupModal, groupedLedgersToPick, activeGroupIndex]);

const groupTotals = useMemo(() => {
  let debit = 0, credit = 0;
  selectedGroupRows.forEach((index) => {
    const ledger = groupedLedgersToPick[index];
    if (ledger?.totals) {
      const { drcr, balance } = ledger.totals;
      if (drcr === "DR") debit += Math.abs(balance);
      else if (drcr === "CR") credit += Math.abs(balance);
    }
  });
  return { debit, credit };
}, [selectedGroupRows, groupedLedgersToPick]);




  useEffect(() => {
    if (!ledgerFromDate && dateFrom) {
      setLedgerFromDate(new Date(dateFrom));
    }
  }, [dateFrom, ledgerFromDate]);

  // Filters Transactions Account Statement 
  const [showOptions, setShowOptions] = useState(false);   // ✅ For Options modal
  const [filteredTransactions, setFilteredTransactions] = useState([]); // ✅ For filtered txns
  const [selectedRows, setSelectedRows] = useState({});
  const [ledgerTotals, setLedgerTotals] = useState({}); // { ledgerId: { netPcs, netWeight } }
  const [progressiveDebit, setProgressiveDebit] = useState(0);
  const [progressiveCredit, setProgressiveCredit] = useState(0);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState(() => new Date());

  useEffect(() => {
    if (!fromDate && dateFrom) {
      setFromDate(new Date(dateFrom));
    }
  }, [dateFrom, fromDate]);

  const handleRowCheckboxChange = (txnId) => {
    setSelectedRows((prev) => ({
      ...prev,
      [txnId]: !prev[txnId], // toggle selection
    }));
  };

  useEffect(() => {
    if (!transactions.length || activeRowIndex < 0) {
      setProgressiveDebit(0);
      setProgressiveCredit(0);
      return;
    }

    let debit = 0;
    let credit = 0;

    filteredTransactions.slice(0, activeRowIndex + 1).forEach((txn) => {
      if (txn.type.toLowerCase() === "debit") {
        debit += txn.amount;
      } else if (txn.type.toLowerCase() === "credit") {
        credit += txn.amount;
      }
    });

    setProgressiveDebit(debit);
    setProgressiveCredit(credit);
  }, [activeRowIndex, filteredTransactions]);



  // ✅ Update filtered transactions whenever filters or transactions change
  useEffect(() => {
    let data = transactions;

    // ✅ Filter by Date range
    if (fromDate) {
      data = data.filter((txn) => new Date(txn.date) >= fromDate);
    }
    if (toDate) {
      data = data.filter((txn) => new Date(txn.date) <= toDate);
    }

    setFilteredTransactions(data);
  }, [
    fromDate,
    toDate,
    transactions,
  ]);

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

  // fetch ledger + fa
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ledgerRes, faRes] = await Promise.all([
          axios.get(
            "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount"
          ),
          axios.get(
            "https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile"
          ),
        ]);

        const ledgersData = ledgerRes.data.data || [];
        const faData = faRes.data.data || [];

        const ledgerTotals = {};
        faData.forEach((entry) => {
          entry.transactions.forEach((txn) => {
            const txnDate = new Date(txn.date);
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

        const enrichedLedgers = ledgersData.map((ledger) => {
          const acc = ledger.formData.ahead.trim();
          const totals = ledgerTotals[acc] || { debit: 0, credit: 0 };
          const balance = totals.debit - totals.credit;
          const drcr = balance > 0 ? "DR" : balance < 0 ? "CR" : "NIL";
          return {
            ...ledger,
            totals: { balance, drcr },
            hasTxn: !!ledgerTotals[acc],
          };
        });

        setAllLedgers(enrichedLedgers);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [ledgerFromDate, ledgerToDate]);

  // apply filters + sorting
  useEffect(() => {
  let result = [...allLedgers];

  // Balance filter
  switch (optionValues.Balance) {
    case "Active Balance":
    result = result.filter((l) => l.totals.balance !== 0);
    break;
    case "Nil Balance":
    result = result.filter((l) => l.totals.balance === 0);
    break;
    case "Debit Balance":
    result = result.filter((l) => l.totals.balance > 0);
    break;
    case "Credit Balance":
    result = result.filter((l) => l.totals.balance < 0);
    break;
    case "Transacted Account":
    result = result.filter((l) => l.hasTxn);
    break;
    case "Non Transacted Account":
    result = result.filter((l) => !l.hasTxn);
    break;
    case "All Accounts":
    default:
    break;
  }

  // Annexure filter
  if (optionValues.Annexure && optionValues.Annexure !== "All") {
      result = result.filter(
      (l) => l.formData.Bsgroup === optionValues.Annexure
      );
  }

  // Sorting
  switch (optionValues.OrderBy) {
    case "Annexure Wise":
    result.sort((a, b) =>
        (a.formData.Bsgroup || "").localeCompare(b.formData.Bsgroup || "")
    );
    break;
    case "Account Name Wise":
    result.sort((a, b) =>
        (a.formData.ahead || "").localeCompare(b.formData.ahead || "")
    );
    break;
    case "City Wise + Name Wise":
    result.sort((a, b) => {
      const cityComp = (a.formData.city || "").localeCompare(
      b.formData.city || ""
      );
      if (cityComp !== 0) return cityComp;
      return (a.formData.ahead || "").localeCompare(b.formData.ahead || "");
    });
    break;
    case "Sorting Order No.Wise":
    result.sort(
        (a, b) =>
        (a.formData.sortingOrderNo || 0) - (b.formData.sortingOrderNo || 0)
    );
    break;
    case "Prefix Annexure Wise":
    result.sort((a, b) =>
        (a.formData.Bsgroup || "")
        .toString()
        .charAt(0)
        .localeCompare((b.formData.Bsgroup || "").toString().charAt(0))
    );
    break;
    default:
    break;
  }

  // Selected Accounts filter
  if (optionValues.T1) {
    result = result.filter((l) => !!checkedRows[l._id]);
  }

 if (optionValues.T10) {
  const grouped = {};
  result.forEach((ledger) => {
    const group = ledger.formData.Bsgroup || "Others";
    if (!grouped[group]) {
      grouped[group] = {
        balance: 0,
        qty: 0,
        pcs: 0,
        debit: 0,
        credit: 0,
        ledgers: [],
      };
    }
    const { balance, drcr, qty = 0, pcs = 0 } = ledger.totals || {};
    grouped[group].balance += balance;
    grouped[group].qty += qty;
    grouped[group].pcs += pcs;
    if (drcr === "DR") {
      grouped[group].debit += Math.abs(balance);
    } else {
      grouped[group].credit += Math.abs(balance);
    }
    grouped[group].ledgers.push(ledger);
  });

  result = Object.entries(grouped).map(([group, data]) => {
    const drcr = data.balance >= 0 ? "DR" : "CR";
    return {
      _id: group,
      formData: { ahead: group, city: "" },
      totals: {
        balance: data.balance,
        drcr,
        qty: data.qty,
        pcs: data.pcs,
        debit: data.debit,
        credit: data.credit,
      },
      groupedLedgers: data.ledgers,
    };
  });
}


  // ✅ Search filter
  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    result = result.filter(
    (ledger) =>
      ledger.formData.ahead.toLowerCase().includes(lower) ||
      ledger.formData.city?.toLowerCase().includes(lower) ||
      ledger.formData.gstNo?.toLowerCase().includes(lower) ||
      ledger.formData.phone?.toLowerCase().includes(lower)
    );
  }

  setFilteredLedgers(result);
  }, [allLedgers, optionValues, checkedRows, searchTerm]);

  // Reset selectedIndex ONLY when filters/search change, not checkbox
  useEffect(() => {
  setSelectedIndex(0);
  }, [allLedgers, optionValues, searchTerm]);

  
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
      }
       else if (e.key === "Escape") {
        setShowModal(false); // ✅ Close modal
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [transactions, activeRowIndex, showModal]);

  // Handle keyboard navigation for LedgerList
useEffect(() => {
  const handleKeyDown = (e) => {
    // 🔹 Mini modal navigation
    if (showGroupModal && groupedLedgersToPick.length) {
      e.preventDefault(); // Prevent default scrolling & background nav

      if (e.key === "ArrowDown") {
        setActiveGroupIndex((prev) => (prev + 1) % groupedLedgersToPick.length);
      } else if (e.key === "ArrowUp") {
        setActiveGroupIndex((prev) =>
          prev === 0 ? groupedLedgersToPick.length - 1 : prev - 1
        );
      } else if (e.key === "Enter") {
        const selectedLedger = groupedLedgersToPick[activeGroupIndex];
        setShowGroupModal(false);
        fetchLedgerTransactions(selectedLedger);
      } else if (e.key === "Escape") {
        setShowGroupModal(false);
      }

      return; // 🔹 stop further handling
    }

    // 🔹 Account Statement modal navigation
    if (showModal && transactions.length) {
      e.preventDefault();
      if (e.key === "ArrowUp") {
        setActiveRowIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "ArrowDown") {
        setActiveRowIndex((prev) =>
          prev < transactions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "Escape") {
        setShowModal(false);
      }

      return;
    }

    // 🔹 Main ledger table navigation
    if (!showModal && filteredLedgers.length) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredLedgers.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
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
            newSet.delete(selectedIndex);
          } else {
            newSet.add(selectedIndex);
          }
          return newSet;
        });
      }
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [
  showModal,
  showGroupModal,
  filteredLedgers,
  selectedIndex,
  transactions,
  activeRowIndex,
  groupedLedgersToPick,
  activeGroupIndex,
]);


  // Open modal and fetch transactions
const openLedgerDetails = (ledger) => {
  if (ledger.groupedLedgers) {
    setGroupedLedgersToPick(ledger.groupedLedgers);
    setCurrentGroupName(ledger.formData.ahead); // 🔹 store group name
    setShowGroupModal(true);
  } else {
    fetchLedgerTransactions(ledger);
  }
};

const fetchLedgerTransactions = (ledger) => {
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

  // const openLedgerDetails = (ledger) => {
  //   setSelectedLedger(ledger);
  //   axios
  //     .get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile")
  //     .then((res) => {
  //       const allTxns = res.data.data || [];
  //       const ledgerTxns = allTxns.flatMap((entry) =>
  //         entry.transactions.filter(
  //           (txn) => txn.account.trim() === ledger.formData.ahead.trim()
  //         )
  //       );
  //       setTransactions(ledgerTxns);
  //       setShowModal(true);
  //     })
  //     .catch((err) => console.error(err));
  // };

  // For calculating net pcs and weight
  useEffect(() => {
    // Fetch all transactions once
    axios.get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/aa/fafile")
      .then((res) => {
        const allTxns = res.data.data || [];
        
        // Compute totals for each ledger
        const totals = {};
        allLedgers.forEach((ledger) => {
          const ledgerTxns = allTxns.flatMap((entry) =>
            entry.transactions.filter(
              (txn) => txn.account.trim() === ledger.formData.ahead.trim()
            )
          );

          let netWeight = 0;
          let netPcs = 0;

          ledgerTxns.forEach((txn) => {
            if (txn.vtype === "P") {
              netWeight += txn.weight || 0;
              netPcs += txn.pkgs || 0;
            } else if (txn.vtype === "S") {
              netWeight -= txn.weight || 0;
              netPcs -= txn.pkgs || 0;
            }
          });

          totals[ledger._id] = { netWeight, netPcs };
        });

        setLedgerTotals(totals);
      })
      .catch((err) => console.error(err));
  }, [allLedgers]);

  const handleCheckboxChange = (id) => {
    setCheckedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
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
              onChangeRaw={(e) => {
                let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
                if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9);

                e.target.value = val; // Show formatted input
              }}
              dateFormat="dd/MM/yyyy"
            />
            </div>
            <div style={{display:'flex',flexDirection:'row'}}>
            <span className="textform"><b>To:</b></span>
            <DatePicker
              className="toDate"
              selected={ledgerToDate}
              onChange={(date) => setLedgerToDate(date)}
              onChangeRaw={(e) => {
                let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
                if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
                if (val.length > 5) val = val.slice(0, 5) + "/" + val.slice(5, 9);

                e.target.value = val; // Show formatted input
              }}
              dateFormat="dd/MM/yyyy"
            />
            </div>
          </div>
           <h3 className="headerTrail">TRAIL BALANCE</h3>
        </div>

        <div className="tableT">
          <Table size="sm" className="custom-table" hover ref={tableRef}>
            <thead style={{ position: "sticky", top: 1, background: "skyblue", fontSize: 17, textAlign: "center" }}>
              <tr>
                <th></th>
                <th>NAME</th>
                <th>CITY</th>
                <th>PCS</th>
                <th>QTY</th>
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
                    <td style={{ textAlign: "right" }}>
                      {ledgerTotals[ledger._id]?.netPcs?.toFixed(3) || "0.000"}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {ledgerTotals[ledger._id]?.netWeight?.toFixed(3) || "0.000"}
                    </td>
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

        
            <tfoot style={{backgroundColor: "skyblue", position: "sticky", bottom: -8,}}>
              <tr style={{ fontWeight: "bold",fontSize:20 }}>
                <td colSpan={3} style={{ textAlign: "right" }}>TOTAL:</td>
                <td></td>
                <td></td>
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
          <OptionModal
            isOpen={isOptionOpen}
            onClose={closeOptionModal}
            onApply={(values) => {
              setOptionValues(values);
            }}
          />
          </div>
        </div>

      </Card>
      {/* ... Modal Account Statement ... */}
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
                      <th>
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const newSelections = {};
                            filteredTransactions.forEach((txn) => {
                              newSelections[txn._id] = checked;
                            });
                            setSelectedRows(newSelections);
                          }}
                          checked={
                            filteredTransactions.length > 0 &&
                            filteredTransactions.every((txn) => selectedRows[txn._id])
                          }
                        />
                      </th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Narration</th>
                      <th>Pcs</th>
                      <th>Qty</th>
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
                           <tr
                            key={txn._id}
                            ref={(el) => (rowRefs.current[index] = el)}
                            style={{
                              fontWeight: "bold",
                              fontSize: 16,
                              backgroundColor:
                                index === activeRowIndex ? "rgb(187, 186, 186)" : "transparent",
                              cursor: "pointer",
                            }}
                            onMouseEnter={() => setActiveRowIndex(index)}
                          >
                            <td style={{ textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                                <input
                                type="checkbox"
                                checked={!!selectedRows[txn._id]}
                                onChange={() => handleRowCheckboxChange(txn._id)}
                                style={{ transform: "scale(1.3)", cursor: "pointer" }}
                              />
                            </td>
                            <td>{new Date(txn.date).toLocaleDateString("en-GB")}</td>
                            <td style={{ textAlign: "center" }}>{txn.vtype}</td>
                            <td>{txn.narration}</td>
                            <td style={{ textAlign: "right" }}>{txn.pkgs}</td>
                            <td style={{ textAlign: "right" }}>{txn.weight}</td>                
                            <td style={{ textAlign: "right", color: "darkblue" }}>
                              {txn.type.toLowerCase() === "debit" ? txn.amount.toFixed(2) : ""}
                            </td>
                            <td style={{ textAlign: "right", color: "red" }}>
                              {txn.type.toLowerCase() === "credit" ? txn.amount.toFixed(2) : ""}
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
                        <td colSpan={10} className="text-center">
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
                    let netWeight = 0;
                    let netPcs = 0;

                    filteredTransactions.forEach((txn) => {
                      if (txn.type.toLowerCase() === "debit") {
                        balance += txn.amount;
                        totalDebit += txn.amount;
                      } else if (txn.type.toLowerCase() === "credit") {
                        balance -= txn.amount;
                        totalCredit += txn.amount;
                      }

                      // ✅ Weight handling
                      if (txn.vtype === "P") {
                        netWeight += txn.weight || 0;   // Purchase positive
                      } else if (txn.vtype === "S") {
                        netWeight -= txn.weight || 0;   // Sale negative
                      }
                       // ✅ Pcs handling
                      if (txn.vtype === "P") {
                        netPcs += txn.pkgs || 0;   // Purchase positive
                      } else if (txn.vtype === "S") {
                        netPcs -= txn.pkgs || 0;   // Sale negative
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
                          <td colSpan={4} style={{ textAlign: "center" }}>
                            Totals
                          </td>
                          <td style={{ textAlign: "right"}}>
                            {netPcs.toFixed(3)}
                          </td>
                          {/* ✅ Net weight (sale in minus, purchase in plus) */}
                          <td style={{ textAlign: "right" }}>
                            {netWeight.toFixed(3)}
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
                <Button  variant="secondary" onClick={() => setShowOptions(true)}>Options</Button>{" "}
              </div>
            </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
      {/* modal for listing */}
 <Modal
  show={showGroupModal}
  onHide={() => setShowGroupModal(false)}
  centered
  size="lg"
>
  <Modal.Header closeButton>
    <Modal.Title> <span style={{ color: "darkblue" }}>{currentGroupName}</span> </Modal.Title>
  </Modal.Header>
  <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
    <div style={{ display: "flex", justifyContent: "flex-end", gap: "2rem", marginBottom: "8px" }}>
  <div>
    <label style={{ fontWeight: "bold", color: "darkblue" }}>Selected Debit:</label>
    <div style={{ textAlign: "right", fontWeight: "bold", color: "darkblue" }}>
      {groupTotals.debit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
  </div>
  <div>
    <label style={{ fontWeight: "bold", color: "red" }}>Selected Credit:</label>
    <div style={{ textAlign: "right", fontWeight: "bold", color: "red" }}>
      {groupTotals.credit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </div>
  </div>
</div>
<Table size="sm" hover>
  <thead>
    <tr>
      <th>
        <input
          type="checkbox"
          checked={selectedGroupRows.size === groupedLedgersToPick.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedGroupRows(new Set(groupedLedgersToPick.map((_, i) => i)));
            } else {
              setSelectedGroupRows(new Set());
            }
          }}
        />
      </th>
      <th>Name</th>
      <th>City</th>
      <th style={{ textAlign: "right" }}>Qty</th>
      <th style={{ textAlign: "right" }}>Pcs</th>
      <th style={{ textAlign: "right" }}>Debit</th>
      <th style={{ textAlign: "right" }}>Credit</th>
    </tr>
  </thead>
  <tbody>
    {groupedLedgersToPick.map((ledger, index) => {
      const { balance, drcr, qty = 0, pcs = 0 } = ledger.totals || {};
      return (
        <tr
          key={ledger._id}
          ref={(el) => (groupRowRefs.current[index] = el)}
          style={{
            cursor: "pointer",
            backgroundColor: index === activeGroupIndex ? "rgb(187,186,186)" : "transparent",
          }}
          onMouseEnter={() => setActiveGroupIndex(index)}
          onDoubleClick={() => {
            setShowGroupModal(false);
            fetchLedgerTransactions(ledger);
          }}
        >
          <td>
            <input
              type="checkbox"
              checked={selectedGroupRows.has(index)}
              onChange={() => {
                setSelectedGroupRows((prev) => {
                  const newSet = new Set(prev);
                  if (newSet.has(index)) newSet.delete(index);
                  else newSet.add(index);
                  return newSet;
                });
              }}
            />
          </td>
          <td>{ledger.formData.ahead}</td>
          <td>{ledger.formData.city}</td>
          <td style={{ textAlign: "right" }}>{qty}</td>
          <td style={{ textAlign: "right" }}>{pcs}</td>
          <td style={{ textAlign: "right", color: "darkblue", fontWeight: "bold" }}>
            {drcr === "DR"
              ? Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : ""}
          </td>
          <td style={{ textAlign: "right", color: "red", fontWeight: "bold" }}>
            {drcr === "CR"
              ? Math.abs(balance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              : ""}
          </td>
        </tr>
      );
    })}
  </tbody>
</Table>


  </Modal.Body>
</Modal>

    </div>
  );
};

export default Example;
