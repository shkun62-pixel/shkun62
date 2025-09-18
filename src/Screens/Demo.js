
import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";
import { Table, Modal, Button, Card, Form } from "react-bootstrap";  // ✅ Form imported
import styles from "../Screens/AccountStatement/LedgerList.module.css";
import { useNavigate, useLocation } from "react-router-dom";  // ✅ Add this
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useCompanySetup from "./Shared/useCompanySetup";
import OptionModal from "./TrailBalance/OptionModal";
import "../Screens/TrailBalance/TrailBalance.css";
import * as XLSX from 'sheetjs-style';
import { saveAs } from 'file-saver';

const Demo = () => {
  const { dateFrom, companyName, companyAdd, companyCity } = useCompanySetup();

  // const [ledgers, setLedgers] = useState([]);
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
  const navigate = useNavigate();
  const [activeRowIndex, setActiveRowIndex] = useState(0);  // ✅ Track highlighted txn row
  const [checkedRows, setCheckedRows] = useState({});

  // Filter Ledger Accounts 
  const [ledgerFromDate, setLedgerFromDate] = useState(null);
  const [ledgerToDate, setLedgerToDate] = useState(() => new Date());
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [optionValues, setOptionValues] = useState({
    Balance: "Active Balance",
    OrderBy: "",
    Annexure: "All",
    T1: "", // ✅ include T1 (Selected Accounts)
  });
  
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

  // Auto focus search field on mount
  useEffect(() => {
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

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
                      backgroundColor:
                     index === selectedIndex
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
            <OptionModal
                isOpen={isOptionOpen}
                onClose={closeOptionModal}
                onApply={(values) => setOptionValues(values)} // ✅ capture all values (Balance, OrderBy, Annexure, T1...)
            />
          <Button className="Button" style={{backgroundColor:'#3d85c6',width:"100px"}} onClick={exportToExcel} >Export </Button>
          </div>
        </div>

      </Card>
    </div>
  );
};

export default Demo;
