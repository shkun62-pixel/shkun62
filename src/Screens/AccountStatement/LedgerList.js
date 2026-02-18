import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Table, Modal, Button, Card, Form } from "react-bootstrap"; // ✅ Form imported
import styles from "./LedgerList.module.css";
import TextField from "@mui/material/TextField";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Add this
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useCompanySetup from "../Shared/useCompanySetup";
import CoA from "../TrailBalance/CoA";
import * as XLSX from "sheetjs-style";
import { saveAs } from "file-saver";
import financialYear from "../Shared/financialYear";

const SEARCH_COL_STORAGE_KEY = "ledger_search_columns";

const LedgerList = () => {

  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  const { dateFrom, companyName, companyAdd, companyCity } = useCompanySetup();

  // Filter Ledgers
  const [ledgers, setLedgers] = useState([]);
  const [filteredLedgers, setFilteredLedgers] = useState([]); // ✅ for search
  const [searchTerm, setSearchTerm] = useState(""); // ✅ search state
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const rowRefs = useRef([]);
  const tableRef = useRef(null);

  const tableContainerRef = useRef(null);
  const txnContainerRef = useRef(null);

  const searchRef = useRef(null); // ✅ search input ref
  const [searchAllFields, setSearchAllFields] = useState(false);
  const navigate = useNavigate();
  const [activeRowIndex, setActiveRowIndex] = useState(0); // ✅ Track highlighted txn row
  const location = useLocation();
  const [checkedRows, setCheckedRows] = useState({});
  const [ledgerFromDate, setLedgerFromDate] = useState(null);
  const [ledgerToDate, setLedgerToDate] = useState(() => new Date());

  // useEffect(() => {
  //   if (!ledgerFromDate && dateFrom) {
  //     setLedgerFromDate(new Date(dateFrom));
  //   }
  // }, [dateFrom, ledgerFromDate]);

  // Filters Transactions
  const [vtypeFilters, setVtypeFilters] = useState({
    cash: true,
    journal: true,
    bank: true,
    sale: true,
    purchase: true,
    tds: true,
  });
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false); // ✅ For Options modal
  const [filterType, setFilterType] = useState("All"); // ✅ Debit / Credit / All
  const [filteredTransactions, setFilteredTransactions] = useState([]); // ✅ For filtered txns
  const [narrationFilter, setNarrationFilter] = useState(""); // ✅ for narration
  const [selectedRows, setSelectedRows] = useState({});
  const [selectionFilter, setSelectionFilter] = useState("All");
  const [ledgerTotals, setLedgerTotals] = useState({}); // { ledgerId: { netPcs, netWeight } }
  const [progressiveDebit, setProgressiveDebit] = useState(0);
  const [progressiveCredit, setProgressiveCredit] = useState(0);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleVtypeChange = (e) => {
    const { name, checked } = e.target;
    setVtypeFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(fy.start); // converted
    setToDate(fy.end); // converted
    setLedgerFromDate(fy.start); // converted
    setLedgerToDate(fy.end); // converted
  }, []);

  // ✅ Update filtered transactions whenever filters or transactions change
  useEffect(() => {
    let data = transactions;

    // ✅ Filter by Debit/Credit
    if (filterType !== "All") {
      data = data.filter(
        (txn) => txn.type.toLowerCase() === filterType.toLowerCase(),
      );
    }

    // ✅ Filter by narration
    if (narrationFilter.trim() !== "") {
      data = data.filter((txn) =>
        txn.narration?.toLowerCase().includes(narrationFilter.toLowerCase()),
      );
    }

    // ✅ Filter by Date range
    if (fromDate) {
      data = data.filter((txn) => new Date(txn.date) >= fromDate);
    }
    if (toDate) {
      data = data.filter((txn) => new Date(txn.date) <= toDate);
    }

    // ✅ Filter by VType checkboxes
    const selectedVtypes = [];
    if (vtypeFilters.cash) selectedVtypes.push("C");
    if (vtypeFilters.journal) selectedVtypes.push("J");
    if (vtypeFilters.bank) selectedVtypes.push("B");
    if (vtypeFilters.sale) selectedVtypes.push("S");
    if (vtypeFilters.purchase) selectedVtypes.push("P");
    if (vtypeFilters.tds) selectedVtypes.push("TDS");

    if (selectedVtypes.length > 0) {
      data = data.filter((txn) => selectedVtypes.includes(txn.vtype));
    }

    // ✅ Filter by selection (Selected / Unselected / All)
    if (selectionFilter === "Selected") {
      data = data.filter((txn) => selectedRows[txn._id]);
    } else if (selectionFilter === "Unselected") {
      data = data.filter((txn) => !selectedRows[txn._id]);
    }

    setFilteredTransactions(data);
  }, [
    filterType,
    narrationFilter,
    fromDate,
    toDate,
    vtypeFilters,
    selectionFilter, // 👈 added dependency
    selectedRows, // 👈 added dependency
    transactions,
  ]);

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

  const [flaggedRows, setFlaggedRows] = useState(() => {
    const saved = localStorage.getItem("flaggedRows");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem("flaggedRows", JSON.stringify([...flaggedRows]));
  }, [flaggedRows]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore modifier keys
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      const tag = document.activeElement?.tagName;

      // If already typing in search → do nothing
      if (document.activeElement === searchRef.current) return;

      // If typing in any input/textarea EXCEPT search → ignore
      if (tag === "INPUT" || tag === "TEXTAREA") {
        if (document.activeElement.type === "checkbox") {
          // checkbox focused → move focus back to search
          searchRef.current?.focus();
        }
        return;
      }

      // Any printable key → focus search
      if (e.key.length === 1 || e.key === "Backspace") {
        searchRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch ledger list
  useEffect(() => {
    axios
      .get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount`,
      )
      .then((res) => {
        const data = res.data.data || [];
        setLedgers(data);
        setFilteredLedgers(data); // ✅ keep backup
      })
      .catch((err) => console.error(err));
  }, []);

  // 👉 Function to handle navigation based on vtype
  const handleTransactionSelect = (txn) => {
    if (!txn) return;
    const modalState = {
      rowIndex: activeRowIndex,
      selectedLedger,
      keepModalOpen: true,
    };

    sessionStorage.setItem("trailModalState", JSON.stringify(modalState));

    switch (
      txn.vtype // ✅ use vtype from your transaction object
    ) {
      case "S": // Sale
        navigate("/Sale", {
          state: {
            saleId: txn.saleId,
            // saleId: txn._id,
          },
        });
        break;
      case "P": // Purchase
        navigate("/purchase", {
          state: {
            purId: txn.purId,
          },
        });
        // navigate("/purchase", { state: { purId: txn._id, rowIndex: activeRowIndex } });
        break;
      case "B": // Bank
        navigate("/bankvoucher", {
          state: {
            bankId: txn.bankId,
          },
        });
        // navigate("/bankvoucher", { state: { bankId: txn._id, rowIndex: activeRowIndex } });
        break;
      case "C": // Cash
        navigate("/cashvoucher", {
          state: {
            cashId: txn.cashId,
          },
        });
        // navigate("/cashvoucher", { state: { cashId: txn._id, rowIndex: activeRowIndex } });
        break;
      case "J": // Journal
        navigate("/journalvoucher", {
          state: {
            journalId: txn.journalId,
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
          prev < transactions.length - 1 ? prev + 1 : prev,
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
          prev === 0 ? filteredLedgers.length - 1 : prev - 1,
        );
      } else if (e.key === "Enter") {
        const ledger = filteredLedgers[selectedIndex];
        openLedgerDetails(ledger);
        setSearchTerm(""); // Clear search on open
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
      .get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/aa/fafile`,
      )
      .then((res) => {
        const allTxns = res.data.data || [];

        // Flatten transactions and attach saleId from parent voucher
        const ledgerTxns = allTxns.flatMap((entry) =>
          entry.transactions
            .filter(
              (txn) => String(txn.ACODE) === String(ledger.formData.acode),
            )
            .map((txn) => ({
              ...txn,
              saleId: entry.saleId || null, // ✅ attach saleId for Sales
              purId: entry.purchaseId || null,
              bankId: entry.bankId || null,
              cashId: entry.cashId || null,
              journalId: entry.journalId || null,
            })),
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
          ledgerId: selectedLedger._id, // ✅ pass the ID
          rowIndex: selectedIndex, // ✅ keep focus index
          selectedLedger, // ✅ full ledger object (if needed)
          // keepModalOpen: true,            // ✅ same flag style as Sale
        },
      });
    }
  };

  // ✅ Auto-scroll ledger list to keep selected row fully visible
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const rows = container.querySelectorAll("tbody tr");
    if (!rows.length) return;

    const idx = Math.max(0, Math.min(selectedIndex, rows.length - 1));
    const selectedRow = rows[idx];
    if (!selectedRow) return;

    // --- adjust for your table header height ---
    const headerOffset = 40; // px — tweak if your header is taller
    const buffer = 12; // space above/below row so it's fully visible

    const rowTop = selectedRow.offsetTop;
    const rowBottom = rowTop + selectedRow.offsetHeight;
    const containerHeight = container.clientHeight;

    const visibleTop = container.scrollTop + headerOffset + buffer;
    const visibleBottom = container.scrollTop + containerHeight - buffer;

    if (rowBottom > visibleBottom) {
      // Scroll down enough to show the whole row
      const newScrollTop = rowBottom - containerHeight + buffer * 2;
      container.scrollTo({ top: newScrollTop, behavior: "smooth" });
    } else if (rowTop < visibleTop) {
      // Scroll up enough so header doesn’t hide it
      const newScrollTop = rowTop - headerOffset - buffer;
      container.scrollTo({ top: newScrollTop, behavior: "smooth" });
    }
  }, [selectedIndex, filteredLedgers]);

  // ✅ Auto-scroll inside ACCOUNT STATEMENT modal
  useEffect(() => {
    if (!showModal || !txnContainerRef.current) return;

    const container = txnContainerRef.current;
    const rows = container.querySelectorAll("tbody tr");
    if (!rows.length) return;

    const idx = Math.max(0, Math.min(activeRowIndex, rows.length - 1));
    const selectedRow = rows[idx];
    if (!selectedRow) return;

    // heights & offsets
    const headerOffset = 40; // Adjust to match your modal header height
    const buffer = 18; // Space above/below so row is clearly visible

    const rowTop = selectedRow.offsetTop;
    const rowBottom = rowTop + selectedRow.offsetHeight;
    const containerHeight = container.clientHeight;

    // The currently visible top & bottom inside the scrollable container
    const visibleTop = container.scrollTop + headerOffset + buffer;
    const visibleBottom = container.scrollTop + containerHeight - buffer;

    // scroll adjustments
    if (rowBottom > visibleBottom) {
      // Scroll just enough so full row + buffer fits
      const newScrollTop = rowBottom - containerHeight + buffer * 2;
      container.scrollTo({ top: newScrollTop, behavior: "smooth" });
    } else if (rowTop < visibleTop) {
      const newScrollTop = rowTop - headerOffset - buffer;
      container.scrollTo({ top: newScrollTop, behavior: "smooth" });
    }
  }, [activeRowIndex, showModal, filteredTransactions]);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleRowCheckboxChange = (txnId) => {
    setSelectedRows((prev) => ({
      ...prev,
      [txnId]: !prev[txnId], // toggle selection
    }));
  };

  // Export Account Statement
  const exportAccountStatementToExcel = () => {
    if (!filteredTransactions || filteredTransactions.length === 0) return;

    // Build transaction data for Excel
    let balance = 0;
    const data = filteredTransactions.map((txn) => {
      if (txn.type.toLowerCase() === "debit") balance += txn.amount;
      else if (txn.type.toLowerCase() === "credit") balance -= txn.amount;

      const drcr = balance >= 0 ? "DR" : "CR";

      return {
        Date: new Date(txn.date).toLocaleDateString("en-GB"),
        Type: txn.vtype,
        Narration: txn.narration,
        Pcs: txn.pkgs?.toFixed(3) || "0.000",
        Qty: txn.weight?.toFixed(3) || "0.000",
        Debit: txn.type.toLowerCase() === "debit" ? txn.amount.toFixed(2) : "",
        Credit:
          txn.type.toLowerCase() === "credit" ? txn.amount.toFixed(2) : "",
        Balance: Math.abs(balance).toFixed(2),
        "DR/CR": drcr,
      };
    });

    const header = Object.keys(data[0]);

    // Period
    const periodFrom = ledgerFromDate ? formatDate(ledgerFromDate) : "--";
    const periodTo = ledgerToDate ? formatDate(ledgerToDate) : "--";

    // Build sheet data
    const sheetData = [
      [companyName || "Company Name"],
      [companyAdd || "Company Address"],
      [companyCity || "Company City"],
      [`Account Statement - ${selectedLedger?.formData?.ahead || ""}`],
      [`Period From: ${periodFrom} To: ${periodTo}`],
      [],
      header,
      ...data.map((row) => header.map((h) => row[h])),
    ];

    // Add totals row
    const numericFields = ["Pcs", "Qty", "Debit", "Credit", "Balance"];
    const totals = {};
    header.forEach((h, index) => {
      if (index === 0) totals[h] = "TOTAL";
      else if (numericFields.includes(h)) {
        const colLetter = XLSX.utils.encode_col(index);
        const firstRow = 8;
        const lastRow = 8 + data.length - 1;
        totals[h] = {
          f: `SUBTOTAL(9,${colLetter}${firstRow}:${colLetter}${lastRow})`,
        };
      } else totals[h] = "";
    });
    sheetData.push(header.map((h) => totals[h]));

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Column widths
    worksheet["!cols"] = [
      { wch: 12 }, // Date
      { wch: 10 }, // Type
      { wch: 35 }, // Narration
      { wch: 10 }, // Pcs
      { wch: 10 }, // Qty
      { wch: 15 }, // Debit
      { wch: 15 }, // Credit
      { wch: 15 }, // Balance
      { wch: 8 }, // DR/CR
    ];

    // Style header row
    header.forEach((_, colIdx) => {
      const addr = XLSX.utils.encode_cell({ r: 6, c: colIdx });
      if (worksheet[addr]) {
        worksheet[addr].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    });

    // Style top rows (company info)
    ["A1", "A2", "A3", "A4", "A5"].forEach((cell, idx) => {
      if (worksheet[cell]) {
        worksheet[cell].s = {
          font: { bold: true, sz: idx === 0 ? 16 : 12 },
          alignment: { horizontal: "center" },
        };
      }
    });

    // Numeric alignment
    numericFields.concat(["Balance"]).forEach((field) => {
      const colIdx = header.indexOf(field);
      if (colIdx !== -1) {
        for (let r = 7; r < data.length + 7; r++) {
          const addr = XLSX.utils.encode_cell({ r, c: colIdx });
          if (worksheet[addr]) {
            worksheet[addr].s = {
              alignment: { horizontal: "right" },
              numFmt: "0.00",
            };
          }
        }
      }
    });

    // Style totals row
    const totalRowIndex = data.length + 7;
    header.forEach((_, colIdx) => {
      const addr = XLSX.utils.encode_cell({ r: totalRowIndex, c: colIdx });
      if (worksheet[addr]) {
        worksheet[addr].s = {
          font: { bold: true },
          fill: { patternType: "solid", fgColor: { rgb: "D9D9D9" } },
          alignment: { horizontal: colIdx === 0 ? "left" : "right" },
        };
      }
    });

    // Merge title and header cells
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: header.length - 1 } },
      { s: { r: 4, c: 0 }, e: { r: 4, c: header.length - 1 } },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Account Statement");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, `${selectedLedger?.formData?.ahead || "Account"}_COA.xlsx`);
  };

  // ✅ Define all possible columns for Modify functionality
  const ALL_COLUMNS = [
    { key: "ahead", label: "NAME" },
    { key: "Bsgroup", label: "GROUP", width: "200px" },
    { key: "acode", label: "A/C CODE", width: "90px" },
    { key: "gstNo", label: "GST NO" },
    { key: "city", label: "CITY" },
    { key: "distt", label: "DISTRICT" },
    { key: "state", label: "STATE" },
    { key: "pinCode", label: "PINCODE" },
    { key: "area", label: "AREA" },
    { key: "distance", label: "DISTANCE" },
    { key: "pan", label: "PAN" },
    { key: "phone", label: "PHONE" },
    { key: "email", label: "EMAIL" },
    { key: "agent", label: "AGENT" },
    { key: "add1", label: "ADDRESS" },
    { key: "opening_dr", label: "OPENING DR" },
    { key: "opening_cr", label: "OPENING CR" },
    { key: "msmed", label: "MSMED" },
    { key: "group", label: "GROUP NAME" },
    { key: "tcs206", label: "TCS 206" },
    { key: "tds194q", label: "TDS 194Q" },
    { key: "tdsno", label: "TDS NO" },
    { key: "tds_rate", label: "TDS RATE" },
    { key: "tcs_rate", label: "TCS RATE" },
    { key: "sur_rate", label: "SURCHARGE RATE" },
    { key: "wahead", label: "WAREHOUSE NAME" },
    { key: "wadd1", label: "WAREHOUSE ADD 1" },
    { key: "wadd2", label: "WAREHOUSE ADD 2" },
    { key: "Rc", label: "RC" },
    { key: "Ecc", label: "ECC" },
    { key: "erange", label: "E RANGE" },
    { key: "collc", label: "COLLECTION" },
    { key: "srvno", label: "SERVICE NO" },
    { key: "cperson", label: "CONTACT PERSON" },
    { key: "irate", label: "INTEREST RATE" },
    { key: "weight", label: "WEIGHT" },
    { key: "bank_ac", label: "BANK A/C" },
    { key: "narration", label: "NARRATION" },
    { key: "subname", label: "SUB NAME" },
    { key: "subaddress", label: "SUB ADDRESS" },
    { key: "subcity", label: "SUB CITY" },
    { key: "subgstNo", label: "SUB GST NO" },
    { key: "payLimit", label: "PAY LIMIT" },
    { key: "payDuedays", label: "PAY DUE DAYS" },
    { key: "graceDays", label: "GRACE DAYS" },
    { key: "sortingindex", label: "SORTING INDEX" },
    { key: "qtyBsheet", label: "QTY B/SHEET" },
    { key: "discount", label: "DISCOUNT" },
    { key: "Terms", label: "TERMS" },
    { key: "tradingAc", label: "TRADING A/C" },
    { key: "prefixPurInvoice", label: "PREFIX PUR INV" },
    { key: "status", label: "STATUS" },
  ];

  const [showColumnModal, setShowColumnModal] = useState(false);
  const STORAGE_KEY = "ledger_visible_columns";

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }

    // default columns (first time only)
    return ALL_COLUMNS.reduce((acc, col) => {
      acc[col.key] = ["ahead", "Bsgroup", "city", "gstNo", "phone"].includes(
        col.key,
      );
      return acc;
    }, {});
  });
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visibleColumns));
  }, [visibleColumns]);
  const [searchColumns, setSearchColumns] = useState(() => {
    const saved = localStorage.getItem(SEARCH_COL_STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    // default (first load only)
    return ALL_COLUMNS.reduce((acc, col) => {
      acc[col.key] = false;
      return acc;
    }, {});
  });
  useEffect(() => {
    localStorage.setItem(SEARCH_COL_STORAGE_KEY, JSON.stringify(searchColumns));
  }, [searchColumns]);

  // ✅ Handle search filtering
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredLedgers(ledgers);
      setSelectedIndex(0);
      return;
    }

    const lower = searchTerm.toLowerCase();

    const activeCols = searchAllFields
      ? ALL_COLUMNS.map((col) => col.key) // 🔥 ALL fields
      : Object.keys(searchColumns).filter((key) => searchColumns[key]);

    const colsToSearch = activeCols.length > 0 ? activeCols : ["ahead"];

    const isMultiColumn = colsToSearch.length > 1;

    const filtered = ledgers.filter((ledger) =>
      colsToSearch.some((key) => {
        const v = ledger.formData?.[key];
        if (!v) return false;

        const text = v.toString().toLowerCase();

        return isMultiColumn ? text.includes(lower) : text.startsWith(lower);
      }),
    );

    setFilteredLedgers(filtered);
    setSelectedIndex(0);
  }, [searchTerm, ledgers, searchColumns]);

  const isValidPrefix = (value) => {
    const lower = value.toLowerCase();
    const activeCols = searchAllFields
      ? ALL_COLUMNS.map((col) => col.key)
      : Object.keys(searchColumns).filter((key) => searchColumns[key]);

    const colsToCheck = activeCols.length > 0 ? activeCols : ["ahead"];

    const isMultiColumn = colsToCheck.length > 1;

    return ledgers.some((ledger) =>
      colsToCheck.some((key) => {
        const v = ledger.formData?.[key];
        if (!v) return false;

        const text = v.toString().toLowerCase();

        // 🔥 RULE SWITCH
        return isMultiColumn
          ? text.includes(lower) // 2+ columns
          : text.startsWith(lower); // 0 or 1 column
      }),
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <Card className={styles.cardL}>
        <h3 className={styles.headerlist}>LEDGER ACCOUNTS</h3>
        <div className={styles.tablecont} ref={tableContainerRef}>
          <Table size="sm" className="custom-table" hover ref={tableRef}>
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "skyblue",
                fontSize: 17,
                textAlign: "center",
              }}
            >
              <tr>
                <th></th>
                {ALL_COLUMNS.filter((col) => visibleColumns[col.key]).map(
                  (col) => (
                    <th
                      key={col.key}
                      style={{
                        width: col.width,
                        minWidth: col.width,
                        maxWidth: col.width,
                        textAlign: "center",
                        verticalAlign: "middle",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center", // 👈 center the group horizontally
                          alignItems: "center", // 👈 center vertically
                          gap: "6px", // spacing between text & checkbox
                        }}
                      >
                        {/* Column Label */}
                        <span
                          style={{ fontSize: "13px", whiteSpace: "nowrap" }}
                        >
                          {col.label}
                        </span>

                        {/* Header Checkbox */}
                        <input
                          type="checkbox"
                          checked={!!searchColumns[col.key]}
                          onChange={(e) => {
                            e.stopPropagation();
                            setSearchColumns((prev) => ({
                              ...prev,
                              [col.key]: !prev[col.key],
                            }));
                          }}
                        />
                      </div>
                    </th>
                  ),
                )}
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
                  }}
                  onClick={() => {
                    setSelectedIndex(index);
                    openLedgerDetails(ledger);
                  }}
                >
                  {/* Row checkbox */}
                  <td
                    onClick={(e) => e.stopPropagation()}
                    style={{ textAlign: "center" }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedRows[ledger._id]}
                      onChange={() => handleCheckboxChange(ledger._id)}
                    />
                  </td>

                  {/* Dynamic columns */}
                  {ALL_COLUMNS.filter((col) => visibleColumns[col.key]).map(
                    (col) => (
                      <td
                        key={col.key}
                        style={{
                          width: col.width,
                          minWidth: col.width,
                          maxWidth: col.width,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {ledger.formData[col.key] || ""}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* ✅ Search Input */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* 🔍 Search All Fields Checkbox */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 10,
              marginRight: 20,
            }}
          >
            <span
              style={{ fontSize: "13px", fontWeight: 500, fontWeight: "bold" }}
            >
              SMART SEARCH
            </span>

            <div
              onClick={() => setSearchAllFields((v) => !v)}
              style={{
                width: "100px",
                height: "28px",
                borderRadius: "999px",
                background: searchAllFields ? "#0d6efd" : "#ccc",
                position: "relative",
                cursor: "pointer",
                transition: "background .3s",
              }}
            >
              <div
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "#fff",
                  position: "absolute",
                  top: "3px",
                  left: searchAllFields ? "75px" : "2px",
                  transition: "left .3s",
                  boxShadow: "0 2px 6px rgba(0,0,0,.3)",
                }}
              />
            </div>
          </div>
          <Form.Control
            ref={searchRef}
            className={styles.Search}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              const val = e.target.value;

              if (!val) {
                setSearchTerm("");
                return;
              }

              // ✅ Restrict typing based on selected columns
              if (isValidPrefix(val)) {
                setSearchTerm(val);
              }
              // ❌ else: typing stops (as you want)
            }}
          />
          <Button
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              marginTop: "10px",
            }}
            onClick={() => setShowColumnModal(true)}
          >
            Select Fields
          </Button>
          <Button
            style={{ marginRight: "20px", marginTop: "10px" }}
            onClick={handleModify}
          >
            Modify
          </Button>
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
        style={{ marginTop: 20 }}
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <p>
                  <span style={{ fontSize: 17 }}>
                    <b>Code:</b> {selectedLedger.formData.acode} <br />
                  </span>
                  <span style={{ fontSize: 17 }}>
                    <b>GST No:</b> {selectedLedger.formData.gstNo} <br />
                  </span>
                  <span style={{ fontSize: 17 }}>
                    <b>PAN:</b> {selectedLedger.formData.pan} <br />
                  </span>
                  <span style={{ fontSize: 17 }}>
                    <b>Phone:</b> {selectedLedger.formData.phone} <br />
                  </span>
                  <span style={{ fontSize: 17 }}>
                    <b>Email:</b> {selectedLedger.formData.email} <br />
                  </span>
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <b style={{ fontSize: 20 }}>
                    {selectedLedger.formData.ahead}{" "}
                  </b>
                  <b style={{ fontSize: 20 }}>
                    {selectedLedger.formData.add1}{" "}
                  </b>
                  <b style={{ fontSize: 20 }}>
                    {selectedLedger.formData.city}{" "}
                  </b>
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
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <b style={{ fontSize: 16, marginRight: "14px" }}>
                      Progressive DR
                    </b>
                    <TextField
                      className="custom-bordered-input"
                      size="small"
                      value={progressiveDebit.toFixed(2)} // ✅ show progressive debit
                      inputProps={{
                        maxLength: 48,
                        style: { height: "10px", width: "206px" },
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <b style={{ fontSize: 16, marginRight: "14px" }}>
                      Progressive CR
                    </b>
                    <TextField
                      className="custom-bordered-input"
                      size="small"
                      value={progressiveCredit.toFixed(2)} // ✅ show progressive credit
                      inputProps={{
                        maxLength: 48,
                        style: { height: "10px", width: "206px" },
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <b style={{ fontSize: 16, marginRight: "10px" }}>
                      Progressive Qty
                    </b>
                    <TextField
                      className="custom-bordered-input"
                      size="small"
                      inputProps={{
                        maxLength: 48,
                        style: {
                          height: "10px",
                          width: "206px",
                        },
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    <b style={{ fontSize: 16, marginRight: "77px" }}>Period</b>
                    <TextField
                      className="custom-bordered-input"
                      size="small"
                      value={formatDate(fromDate)} // 👈 formatted here
                      inputProps={{
                        maxLength: 48,
                        style: {
                          height: "10px",
                          width: "90px",
                        },
                      }}
                    />
                    <TextField
                      className="custom-bordered-input"
                      size="small"
                      value={formatDate(toDate)} // 👈 formatted here
                      inputProps={{
                        maxLength: 48,
                        style: {
                          height: "10px",
                          width: "90px",
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.tableHeight} ref={txnContainerRef}>
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
                            filteredTransactions.every(
                              (txn) => selectedRows[txn._id],
                            )
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

                        return filteredTransactions.map((txn, index) => {
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
                                  index === activeRowIndex
                                    ? "rgb(187, 186, 186)"
                                    : "transparent",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setActiveRowIndex(index);
                                handleTransactionSelect(txn);
                              }}
                              // onClick={() => handleTransactionSelect(txn)}
                              // onMouseEnter={() => setActiveRowIndex(index)}
                            >
                              <td
                                style={{ textAlign: "center" }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={!!selectedRows[txn._id]}
                                  onChange={() =>
                                    handleRowCheckboxChange(txn._id)
                                  }
                                  style={{
                                    transform: "scale(1.3)",
                                    cursor: "pointer",
                                  }}
                                />
                              </td>
                              <td>
                                {new Date(txn.date).toLocaleDateString("en-GB")}
                              </td>
                              <td style={{ textAlign: "center" }}>
                                {txn.vtype}
                              </td>
                              <td>{txn.narration}</td>
                              <td style={{ textAlign: "right" }}>{txn.pkgs}</td>
                              <td style={{ textAlign: "right" }}>
                                {txn.weight}
                              </td>
                              <td
                                style={{
                                  textAlign: "right",
                                  color: "darkblue",
                                }}
                              >
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
                              <td
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                  color,
                                }}
                              >
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
                  {transactions.length > 0 &&
                    (() => {
                      let totalDebit = 0;
                      let totalCredit = 0;
                      let balance = 0;
                      let netWeight = 0;
                      let netPcs = 0;

                    filteredTransactions.forEach((txn) => {
                        const weight = txn.weight || 0;
                        const pcs = txn.pkgs || 0;

                        if (txn.type.toLowerCase() === "debit") {
                          balance += txn.amount;
                          totalDebit += txn.amount;

                          netWeight += weight; // ✅ debit positive
                          netPcs += pcs; // ✅ debit positive
                        } else if (txn.type.toLowerCase() === "credit") {
                          balance -= txn.amount;
                          totalCredit += txn.amount;

                          netWeight -= weight; // ✅ credit negative
                          netPcs -= pcs; // ✅ credit negative
                        }
                      });

                      const drcrFinal = balance >= 0 ? "DR" : "CR";
                      const colorFinal =
                        drcrFinal === "DR" ? "darkblue" : "red";

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

                            <td style={{ textAlign: "right" }}>
                              {netPcs.toFixed(3)}
                            </td>

                            <td style={{ textAlign: "right" }}>
                              {netWeight.toFixed(3)}
                            </td>

                            <td
                              style={{ textAlign: "right", color: "darkblue" }}
                            >
                              {totalDebit.toFixed(2)}
                            </td>

                            <td style={{ textAlign: "right", color: "red" }}>
                              {totalCredit.toFixed(2)}
                            </td>

                            <td
                              style={{ textAlign: "right", color: colorFinal }}
                            >
                              {Math.abs(balance).toFixed(2)}
                            </td>

                            <td
                              style={{ textAlign: "center", color: colorFinal }}
                            >
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
                  <Button
                    className="Buttonz"
                    variant="secondary"
                    onClick={() => setShowOptions(true)}
                  >
                    Options
                  </Button>{" "}
                  {/* <Button className="Buttonz"  variant="secondary" onClick={exportAccountStatementToExcel}>Export</Button>{" "} */}
                  <Button
                    className="Buttonz"
                    variant="secondary"
                    onClick={() => setIsPrintOpen(true)}
                  >
                    Print
                  </Button>{" "}
                  <CoA
                    isOpen={isPrintOpen}
                    handleClose={() => setIsPrintOpen(false)}
                    filteredTransactions={filteredTransactions}
                    selectedLedger={selectedLedger}
                    ledgerFrom={ledgerFromDate}
                    ledgerTo={ledgerToDate}
                    handleExport={exportAccountStatementToExcel}
                  />
                  <Button
                    className="Buttonz"
                    variant="secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Exit
                  </Button>{" "}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Option Account Statement */}
      <Modal
        style={{ zIndex: 100000 }}
        show={showOptions}
        onHide={() => setShowOptions(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Filter Transactions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Form.Group>
                <Form.Label>From Date</Form.Label>
                <DatePicker
                  selected={fromDate}
                  onChange={(date) => setFromDate(date)}
                  onChangeRaw={(e) => {
                    if (!e.target.value) return; // ✅ prevent crash

                    let val = e.target.value.replace(/\D/g, ""); // Remove non-digits

                    if (val.length > 2)
                      val = val.slice(0, 2) + "/" + val.slice(2);
                    if (val.length > 5)
                      val = val.slice(0, 5) + "/" + val.slice(5, 9);

                    e.target.value = val; // Update formatted value
                  }}
                  dateFormat="dd/MM/yyyy"
                  className={styles.from}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Upto Date</Form.Label>
                <DatePicker
                  selected={toDate}
                  onChange={(date) => setToDate(date)}
                  onChangeRaw={(e) => {
                    if (!e.target.value) return; // ✅ prevent crash

                    let val = e.target.value.replace(/\D/g, ""); // Remove non-digits

                    if (val.length > 2)
                      val = val.slice(0, 2) + "/" + val.slice(2);
                    if (val.length > 5)
                      val = val.slice(0, 5) + "/" + val.slice(5, 9);

                    e.target.value = val; // Update formatted value
                  }}
                  dateFormat="dd/MM/yyyy"
                  className={styles.to}
                />
              </Form.Group>

              {/* Debit / Credit Select */}
              <Form.Group>
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

              <div style={{ display: "flex", flexDirection: "row" }}>
                <Form.Label style={{ marginTop: 5 }}>Narration</Form.Label>
                <input
                  className={styles.nar}
                  type="text"
                  value={narrationFilter}
                  onChange={(e) => setNarrationFilter(e.target.value)}
                />
              </div>

              <Form.Group>
                <Form.Label>Filter</Form.Label>
                <Form.Select
                  className="filterselect"
                  value={selectionFilter}
                  onChange={(e) => setSelectionFilter(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Selected">Selected</option>
                  <option value="Unselected">Unselected</option>
                </Form.Select>
              </Form.Group>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "50px",
              }}
            >
              <b style={{ fontSize: 18, marginBottom: "10px" }}>Vouchers</b>
              <Form.Check
                type="checkbox"
                label="Cash"
                name="cash"
                checked={vtypeFilters.cash}
                onChange={handleVtypeChange}
                style={{ transform: "scale(1.2)", marginRight: "8px" }}
              />
              <Form.Check
                type="checkbox"
                label="Journal"
                name="journal"
                checked={vtypeFilters.journal}
                onChange={handleVtypeChange}
                style={{ transform: "scale(1.2)", marginRight: "8px" }}
              />
              <Form.Check
                type="checkbox"
                label="Bank"
                name="bank"
                checked={vtypeFilters.bank}
                onChange={handleVtypeChange}
                style={{ transform: "scale(1.2)", marginRight: "8px" }}
              />
              <Form.Check
                type="checkbox"
                label="Sale"
                name="sale"
                checked={vtypeFilters.sale}
                onChange={handleVtypeChange}
                style={{ transform: "scale(1.2)", marginRight: "8px" }}
              />
              <Form.Check
                type="checkbox"
                label="Purchase"
                name="purchase"
                checked={vtypeFilters.purchase}
                onChange={handleVtypeChange}
                style={{ transform: "scale(1.2)", marginRight: "8px" }}
              />
              <Form.Check
                type="checkbox"
                label="TDS"
                name="tds"
                checked={vtypeFilters.tds}
                onChange={handleVtypeChange}
                style={{ transform: "scale(1.2)", marginRight: "8px" }}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="Buttonz"
            variant="secondary"
            onClick={() => setShowOptions(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Column Selection Modal */}
      <Modal
        show={showColumnModal}
        onHide={() => setShowColumnModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Columns</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
          {ALL_COLUMNS.map((col) => (
            <Form.Check
              key={col.key}
              type="checkbox"
              label={col.label}
              checked={!!visibleColumns[col.key]}
              onChange={() =>
                setVisibleColumns((prev) => ({
                  ...prev,
                  [col.key]: !prev[col.key],
                }))
              }
            />
          ))}
        </Modal.Body>

        <Modal.Footer>
          <Button onClick={() => setShowColumnModal(false)}>Apply</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LedgerList;
