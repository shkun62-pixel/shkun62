import React, { useEffect, useState, useRef, useMemo, useContext } from "react";
import axios from "axios";
import { Table, Modal, Button, Card, Form } from "react-bootstrap";
import styles from "../AccountStatement/LedgerList.module.css";
import TextField from "@mui/material/TextField";
// import { useNavigate } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useCompanySetup from "../Shared/useCompanySetup";
import OptionModal from "./OptionModal";
import "./TrailBalance.css";
import PrintTrail from "./PrintTrail";
import * as XLSX from "sheetjs-style";
import { saveAs } from "file-saver";
import CoA from "./CoA";
import InputMask from "react-input-mask";
import financialYear from "../Shared/financialYear";
import AnnexureWiseModal from "./AnnexureWiseModal";
import { CompanyContext } from "../Context/CompanyContext";

const money2 = (n) =>
  Number(n || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
const num3 = (n) => {
  const v = Number(n || 0);
  return v ? v.toFixed(3) : "";
};

const parseDDMMYYYY = (str) => {
  if (!str) return null;
  const [dd, mm, yyyy] = String(str).split("/").map(Number);
  if (!dd || !mm || !yyyy) return null;
  return new Date(yyyy, mm - 1, dd, 0, 0, 0, 0);
};
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};
const TrailBalance = () => {
  const { dateFrom, companyName, companyAdd, companyCity } = useCompanySetup();
  const { company } = useContext(CompanyContext);
  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  const navigate = useNavigate();
  const [allRows, setAllRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [checkedRows, setCheckedRows] = useState({});
  const [flaggedRows, setFlaggedRows] = useState(() => {
    const saved = localStorage.getItem("flaggedRowsTrail");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const location = useLocation();
  const restoringRef = useRef(false);
  useEffect(() => {
    localStorage.setItem("flaggedRowsTrail", JSON.stringify([...flaggedRows]));
  }, [flaggedRows]);
  const [ledgerFromDate, setLedgerFromDate] = useState(null); // dd/mm/yyyy string
  const [ledgerToDate, setLedgerToDate] = useState(null); // dd/mm/yyyy string
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [isOptionOpen, setIsOptionOpen] = useState(false);
  const [optionValues, setOptionValues] = useState({
    Balance: "Active Balance",
    OrderBy: "",
    Annexure: "All",
    T1: "",
    T3: false,
    T10: false,
  });
  const [printDateValue, setPrintDateValue] = useState(null);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupedRowsToPick, setGroupedRowsToPick] = useState([]);
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [currentGroupName, setCurrentGroupName] = useState("");
  const [selectedGroupRows, setSelectedGroupRows] = useState(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedLedger, setSelectedLedger] = useState(null); // will store TB row
  const [transactions, setTransactions] = useState([]);
  const [vtypeFilters, setVtypeFilters] = useState({
    cash: true,
    journal: true,
    bank: true,
    sale: true,
    purchase: true,
    tds: true,
  });
  const [filterType, setFilterType] = useState("All");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [narrationFilter, setNarrationFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState({});
  const [selectionFilter, setSelectionFilter] = useState("All");
  const [activeRowIndex, setActiveRowIndex] = useState(0);
  const [progressiveDebit, setProgressiveDebit] = useState(0);
  const [progressiveCredit, setProgressiveCredit] = useState(0);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showAnnexureModal, setShowAnnexureModal] = useState(false);
  const [annexureGroupedData, setAnnexureGroupedData] = useState({});
  const tableRef = useRef(null);
  const tableContainerRef = useRef(null);
  const txnContainerRef = useRef(null);
  const groupRowRefs = useRef([]);
  useEffect(() => {
    const fy = financialYear.getFYDates();
    setLedgerFromDate(formatDate(fy.start));
    setLedgerToDate(formatDate(fy.end));
    setFromDate(fy.start);
    setToDate(fy.end);
  }, []);
  useEffect(() => {
    searchRef.current?.focus();
  }, []);
  const openOptionModal = () => setIsOptionOpen(true);
  const closeOptionModal = () => setIsOptionOpen(false);
  const handleCheckboxChange = (key) => {
    setCheckedRows((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const handleVtypeChange = (e) => {
    const { name, checked } = e.target;
    setVtypeFilters((prev) => ({ ...prev, [name]: checked }));
  };
  const handleRowCheckboxChange = (txnId) => {
    setSelectedRows((prev) => ({ ...prev, [txnId]: !prev[txnId] }));
  };
  const isValidPrefix = (value) => {
    const lower = String(value || "").toLowerCase();
    return allRows.some((r) =>
      String(r.ahead || "")
        .toLowerCase()
        .startsWith(lower),
    );
  };
  useEffect(() => {
    if (!tenant || !ledgerFromDate || !ledgerToDate) return;
    const fetchTB = async () => {
      try {
        const balanceMap = {
          "Active Balance": "Active",
          "Nil Balance": "Nil",
          "Debit Balance": "Debit",
          "Credit Balance": "Credit",
          "All Accounts": "All",
          "Transacted Account": "All", // backend already only has transacted (FAFile)
          "Non Transacted Account": "All", // not possible from FAFile-only
        };
        const apiBalance = balanceMap[optionValues.Balance] || "All";
        const url = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/reports/trialbalance`;
        const res = await axios.get(url, {
          params: {
            from: ledgerFromDate,
            to: ledgerToDate,
            balance: apiBalance,
          },
        });
        const rows = res.data?.rows || [];
        setAllRows(rows);
      } catch (err) {
        console.error("TB fetch error:", err);
        setAllRows([]);
      }
    };
    fetchTB();
  }, [tenant, ledgerFromDate, ledgerToDate, optionValues.Balance]);
  useEffect(() => {
    let result = [...allRows];
    if (optionValues.Annexure && optionValues.Annexure !== "All") {
      result = result.filter(
        (r) => String(r.bsgroup || "") === String(optionValues.Annexure),
      );
    }
    if (optionValues.T1) {
      result = result.filter((r) => !!checkedRows[r.acode]);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((r) => {
        const name = String(r.ahead || "").toLowerCase();
        const city = String(r.city || "").toLowerCase();
        const gst = String(r.gstNo || "").toLowerCase();
        const phone = String(r.phone || "").toLowerCase();
        const acode = String(r.acode || "").toLowerCase();
        return (
          name.includes(lower) ||
          city.includes(lower) ||
          gst.includes(lower) ||
          phone.includes(lower) ||
          acode.includes(lower)
        );
      });
    }
    switch (optionValues.OrderBy) {
      case "Account Name Wise":
        result.sort((a, b) =>
          String(a.ahead || "").localeCompare(String(b.ahead || "")),
        );
        break;
      case "City Wise + Name Wise":
        result.sort((a, b) => {
          const cityComp = String(a.city || "").localeCompare(
            String(b.city || ""),
          );
          if (cityComp !== 0) return cityComp;
          return String(a.ahead || "").localeCompare(String(b.ahead || ""));
        });
        break;
      case "Prefix Annexure Wise":
        result.sort((a, b) =>
          String(a.bsgroup || "")
            .charAt(0)
            .localeCompare(String(b.bsgroup || "").charAt(0)),
        );
        break;
      default:
        break;
    }
    if (optionValues.T10) {
      const grouped = {};
      result.forEach((r) => {
        const group = r.bsgroup || "Others";
        if (!grouped[group])
          grouped[group] = { balance: 0, debit: 0, credit: 0, rows: [] };
        const bal = Number(r.balance || 0);
        grouped[group].balance += bal;
        if (bal > 0) grouped[group].debit += Math.abs(bal);
        if (bal < 0) grouped[group].credit += Math.abs(bal);
        grouped[group].rows.push(r);
      });
      result = Object.entries(grouped).map(([group, data]) => {
        const drcr = data.balance >= 0 ? "DR" : data.balance < 0 ? "CR" : "NIL";
        return {
          acode: group, // group key
          ahead: group,
          city: "",
          gstNo: "",
          phone: "",
          bsgroup: group,
          debit: data.debit,
          credit: data.credit,
          balance: data.balance,
          drcr,
          netQty: 0,
          netPcs: 0,
          groupedRows: data.rows,
        };
      });
    }
    setFilteredRows(result);
  }, [allRows, optionValues, checkedRows, searchTerm]);
  useEffect(() => setSelectedIndex(0), [allRows, optionValues, searchTerm]);
  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;
    const rows = container.querySelectorAll("tbody tr");
    if (!rows.length) return;
    const idx = Math.max(0, Math.min(selectedIndex, rows.length - 1));
    const selectedRow = rows[idx];
    if (!selectedRow) return;
    const headerOffset = 40;
    const buffer = 25;
    const rowTop = selectedRow.offsetTop;
    const rowBottom = rowTop + selectedRow.offsetHeight;
    const containerHeight = container.clientHeight;
    const visibleTop = container.scrollTop + headerOffset + buffer;
    const visibleBottom = container.scrollTop + containerHeight - buffer;
    if (rowBottom > visibleBottom) {
      container.scrollTo({
        top: rowBottom - containerHeight + buffer * 2,
        behavior: "smooth",
      });
    } else if (rowTop < visibleTop) {
      container.scrollTo({
        top: rowTop - headerOffset - buffer,
        behavior: "smooth",
      });
    }
  }, [selectedIndex, filteredRows]);
  const buildAnnexureData = () => {
    const grouped = {};
    filteredRows.forEach((r) => {
      const annexure = r.bsgroup || "Others";
      if (!grouped[annexure]) grouped[annexure] = [];
      grouped[annexure].push({
        formData: {
          ahead: r.ahead,
          city: r.city,
          acode: r.acode,
          Bsgroup: r.bsgroup,
        },
        totals: { balance: r.balance, drcr: r.drcr },
        netPcs: r.netPcs || 0,
        netQty: r.netQty || 0,
      });
    });
    setAnnexureGroupedData(grouped);
  };
  const openLedgerDetails = (row) => {
    if (!row) return;
    if (row.groupedRows) {
      setGroupedRowsToPick(row.groupedRows);
      setCurrentGroupName(row.ahead || "");
      setActiveGroupIndex(0);
      setSelectedGroupRows(new Set());
      setShowGroupModal(true);
      return;
    }
    fetchLedgerTransactions(row);
  };
  const fetchLedgerTransactions = async (row) => {
    if (!tenant) return;
    const acode = String(row?.acode || "").trim();
    if (!acode) return;
    try {
      const url = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/reports/accountstatement`;
      const res = await axios.get(url, {
        params: {
          acode,
          from: ledgerFromDate,
          to: ledgerToDate,
        },
      });
      const txns = res.data?.transactions || res.data?.data || [];
      setSelectedLedger(row);
      setTransactions(txns);
      setActiveRowIndex(0);
      setSelectedRows({});
      setShowModal(true);
      return;
    } catch (e) {
      try {
        const faRes = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/aa/fafile`,
        );
        const faData = faRes.data?.data || [];
        const fromD = parseDDMMYYYY(ledgerFromDate);
        const toD = parseDDMMYYYY(ledgerToDate);
        if (toD) toD.setHours(23, 59, 59, 999);
        const ledgerTxns = faData.flatMap((entry) =>
          (entry.transactions || [])
            .filter((txn) => String(txn.ACODE || "").trim() === acode)
            .filter((txn) => {
              const d = new Date(txn.date);
              if (fromD && d < fromD) return false;
              if (toD && d > toD) return false;
              return true;
            })
            .map((txn) => ({
              ...txn,
              saleId: entry.saleId || null,
              purId: entry.purchaseId || null,
              bankId: entry.bankId || null,
              cashId: entry.cashId || null,
              journalId: entry.journalId || null,
            })),
        );
        setSelectedLedger(row);
        setTransactions(ledgerTxns);
        setActiveRowIndex(0);
        setSelectedRows({});
        setShowModal(true);
      } catch (err2) {
        console.error("Account statement fallback error:", err2);
      }
    }
  };
  const handleTransactionSelect = (txn) => {
    if (!txn) return;
    const modalState = {
      rowIndex: activeRowIndex,
      selectedLedger,
      keepModalOpen: true,
    };
    sessionStorage.setItem("trailModalState", JSON.stringify(modalState));
    switch (txn.vtype) {
      case "S":
        navigate("/Sale", { state: { saleId: txn.saleId } });
        break;
      case "P":
        navigate("/purchase", { state: { purId: txn.purId } });
        break;
      case "B":
        navigate("/bankvoucher", { state: { bankId: txn.bankId } });
        break;
      case "C":
        navigate("/cashvoucher", { state: { cashId: txn.cashId } });
        break;
      case "J":
        navigate("/journalvoucher", { state: { journalId: txn.journalId } });
        break;
      default:
        console.log("Unknown vtype:", txn.vtype);
    }
  };
  useEffect(() => {
    const saved = sessionStorage.getItem("trailModalState");
    if (!saved) return;

    const state = JSON.parse(saved);

    // only restore if we came back from voucher and asked to keep modal open
    if (!state?.keepModalOpen || !state?.selectedLedger) return;

    // prevent repeated re-open loop
    if (restoringRef.current) return;
    restoringRef.current = true;

    (async () => {
      // This will reopen modal because fetchLedgerTransactions() already does setShowModal(true)
      await fetchLedgerTransactions(state.selectedLedger);

      // restore the highlighted row inside account statement table
      setTimeout(() => {
        setActiveRowIndex(state.rowIndex ?? 0);
        restoringRef.current = false;
      }, 0);
    })();
  }, [location.key]); // runs whenever you come back to this page (history back / escape)

  useEffect(() => {
    let data = [...transactions];
    if (filterType !== "All") {
      data = data.filter(
        (txn) => String(txn.type).toLowerCase() === filterType.toLowerCase(),
      );
    }
    if (narrationFilter.trim() !== "") {
      data = data.filter((txn) =>
        String(txn.narration || "")
          .toLowerCase()
          .includes(narrationFilter.toLowerCase()),
      );
    }
    if (fromDate) data = data.filter((txn) => new Date(txn.date) >= fromDate);
    if (toDate) data = data.filter((txn) => new Date(txn.date) <= toDate);
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
    if (selectionFilter === "Selected")
      data = data.filter((txn) => selectedRows[txn._id]);
    else if (selectionFilter === "Unselected")
      data = data.filter((txn) => !selectedRows[txn._id]);
    setFilteredTransactions(data);
  }, [
    filterType,
    narrationFilter,
    fromDate,
    toDate,
    vtypeFilters,
    selectionFilter,
    selectedRows,
    transactions,
  ]);
  useEffect(() => {
    if (!filteredTransactions.length || activeRowIndex < 0) {
      setProgressiveDebit(0);
      setProgressiveCredit(0);
      return;
    }
    let debit = 0;
    let credit = 0;
    filteredTransactions.slice(0, activeRowIndex + 1).forEach((txn) => {
      if (String(txn.type).toLowerCase() === "debit")
        debit += Number(txn.amount) || 0;
      else if (String(txn.type).toLowerCase() === "credit")
        credit += Number(txn.amount) || 0;
    });
    setProgressiveDebit(debit);
    setProgressiveCredit(credit);
  }, [activeRowIndex, filteredTransactions]);
  useEffect(() => {
    if (!showModal || !txnContainerRef.current) return;
    const container = txnContainerRef.current;
    const rows = container.querySelectorAll("tbody tr");
    if (!rows.length) return;
    const idx = Math.max(0, Math.min(activeRowIndex, rows.length - 1));
    const selectedRow = rows[idx];
    if (!selectedRow) return;
    const headerOffset = 40;
    const buffer = 18;
    const rowTop = selectedRow.offsetTop;
    const rowBottom = rowTop + selectedRow.offsetHeight;
    const containerHeight = container.clientHeight;
    const visibleTop = container.scrollTop + headerOffset + buffer;
    const visibleBottom = container.scrollTop + containerHeight - buffer;
    if (rowBottom > visibleBottom) {
      container.scrollTo({
        top: rowBottom - containerHeight + buffer * 2,
        behavior: "smooth",
      });
    } else if (rowTop < visibleTop) {
      container.scrollTo({
        top: rowTop - headerOffset - buffer,
        behavior: "smooth",
      });
    }
  }, [activeRowIndex, showModal, filteredTransactions]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showModal || !filteredTransactions.length) return;
      if (e.key === "ArrowUp")
        setActiveRowIndex((prev) => (prev > 0 ? prev - 1 : prev));
      else if (e.key === "ArrowDown")
        setActiveRowIndex((prev) =>
          prev < filteredTransactions.length - 1 ? prev + 1 : prev,
        );
      else if (e.key === "PageUp") setActiveRowIndex(0);
      else if (e.key === "PageDown")
        setActiveRowIndex(filteredTransactions.length - 1);
      else if (e.key === "Enter")
        handleTransactionSelect(filteredTransactions[activeRowIndex]);
      else if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal, filteredTransactions, activeRowIndex]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showGroupModal && groupedRowsToPick.length) {
        e.preventDefault();
        if (e.key === "ArrowDown")
          setActiveGroupIndex((prev) => (prev + 1) % groupedRowsToPick.length);
        else if (e.key === "ArrowUp")
          setActiveGroupIndex((prev) =>
            prev === 0 ? groupedRowsToPick.length - 1 : prev - 1,
          );
        else if (e.key === "Enter")
          fetchLedgerTransactions(groupedRowsToPick[activeGroupIndex]);
        else if (e.key === "Escape") setShowGroupModal(false);
        return;
      }
      if (!showModal && filteredRows.length) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredRows.length - 1 ? prev + 1 : prev,
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === "PageUp") setSelectedIndex(0);
        else if (e.key === "PageDown")
          setSelectedIndex(filteredRows.length - 1);
        else if (e.key === "Enter") {
          const row = filteredRows[selectedIndex];

          // ✅ save current TB selected row so we can restore after closing account statement
          sessionStorage.setItem(
            "trailTbSelectedIndex",
            JSON.stringify({
              index: selectedIndex,
              acode: row?.acode || "",
            }),
          );

          openLedgerDetails(row);
          setSearchTerm("");
        } else if (e.key === "F3") {
          e.preventDefault();
          setFlaggedRows((prev) => {
            const ns = new Set(prev);
            if (ns.has(selectedIndex)) ns.delete(selectedIndex);
            else ns.add(selectedIndex);
            return ns;
          });
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    showModal,
    filteredRows,
    selectedIndex,
    showGroupModal,
    groupedRowsToPick,
    activeGroupIndex,
  ]);
  const { selectedDebit, selectedCredit } = useMemo(() => {
    let debitSum = 0;
    let creditSum = 0;
    filteredRows.forEach((r) => {
      if (checkedRows[r.acode]) {
        const bal = Number(r.balance || 0);
        if (r.drcr === "DR") debitSum += Math.abs(bal);
        if (r.drcr === "CR") creditSum += Math.abs(bal);
      }
    });
    return { selectedDebit: debitSum, selectedCredit: creditSum };
  }, [checkedRows, filteredRows]);
  const groupTotals = useMemo(() => {
    let debit = 0;
    let credit = 0;
    selectedGroupRows.forEach((index) => {
      const r = groupedRowsToPick[index];
      if (!r) return;
      const bal = Number(r.balance || 0);
      if (r.drcr === "DR") debit += Math.abs(bal);
      else if (r.drcr === "CR") credit += Math.abs(bal);
    });
    return { debit, credit };
  }, [selectedGroupRows, groupedRowsToPick]);
  const exportToExcel = () => {
    const data = filteredRows.map((r) => ({
      Name: r.ahead || "",
      City: r.city || "",
      Debit: r.drcr === "DR" ? Math.abs(r.balance).toFixed(2) : "",
      Credit: r.drcr === "CR" ? Math.abs(r.balance).toFixed(2) : "",
      Pcs: num3(r.netPcs),
      Qty: num3(r.netQty),
      "A/c Code": r.acode || "",
      "Group Name": r.bsgroup || "",
    }));
    if (!data.length) return;
    const header = Object.keys(data[0]);
    const periodFrom = ledgerFromDate || "--";
    const periodTo = ledgerToDate || "--";
    const sheetData = [
      [companyName || "Company Name"],
      [companyAdd || "Company Address"],
      [companyCity || "Company City"],
      [`TRIAL BALANCE - Period From: ${periodFrom} To: ${periodTo}`],
      [],
      header,
      ...data.map((row) => header.map((h) => row[h])),
    ];
    const numericFields = ["Debit", "Credit", "Pcs", "Qty"];
    const totals = {};
    header.forEach((h, index) => {
      if (index === 0) totals[h] = "TOTAL";
      else if (numericFields.includes(h)) {
        const colLetter = XLSX.utils.encode_col(index);
        const firstRow = 6;
        const lastRow = 6 + data.length;
        totals[h] = {
          f: `SUBTOTAL(9,${colLetter}${firstRow}:${colLetter}${lastRow})`,
        };
      } else totals[h] = "";
    });
    sheetData.push(header.map((h) => totals[h]));
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    worksheet["!cols"] = [
      { wch: 40 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
      { wch: 30 },
    ];
    header.forEach((_, colIdx) => {
      const cellAddr = XLSX.utils.encode_cell({ r: 5, c: colIdx });
      if (worksheet[cellAddr]) {
        worksheet[cellAddr].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
    });
    ["A1", "A2", "A3", "A4"].forEach((cell, idx) => {
      if (worksheet[cell]) {
        worksheet[cell].s = {
          font: {
            bold: true,
            sz: idx === 0 ? 16 : 12,
            color: { rgb: "000000" },
          },
          alignment: { horizontal: "center" },
        };
      }
    });
    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: header.length - 1 } },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trial Balance");
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, "TrialBalance.xlsx");
  };
  const exportLedgerMonthwiseFY = async () => {
    if (!tenant || !filteredRows.length) return;
    try {
      const faRes = await axios.get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/aa/fafile`,
      );
      const faData = faRes.data?.data || [];
      const from = parseDDMMYYYY(ledgerFromDate);
      const to = parseDDMMYYYY(ledgerToDate);
      if (to) to.setHours(23, 59, 59, 999);
      const monthNames = [
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
      ];
      const getFYMonthIndex = (date) => (date.getMonth() + 9) % 12;
      const acodeMonthTotals = {};
      faData.forEach((entry) => {
        (entry.transactions || []).forEach((txn) => {
          const txnDate = new Date(txn.date);
          if (from && txnDate < from) return;
          if (to && txnDate > to) return;
          const acode = String(txn.ACODE || "").trim();
          if (!acode) return;
          const monthIndex = getFYMonthIndex(txnDate);
          const monthKey = monthNames[monthIndex];
          if (!acodeMonthTotals[acode]) acodeMonthTotals[acode] = {};
          if (!acodeMonthTotals[acode][monthKey])
            acodeMonthTotals[acode][monthKey] = 0;
          const amount = Number(txn.amount) || 0;
          const signed =
            String(txn.type).toLowerCase() === "debit" ? amount : -amount;
          acodeMonthTotals[acode][monthKey] += signed;
        });
      });
      const data = filteredRows.map((r) => {
        const row = {
          "Account Name": r.ahead || "",
          Destination: r.city || "",
        };
        monthNames.forEach(
          (m) => (row[m] = acodeMonthTotals[r.acode]?.[m] || 0),
        );
        row["Total"] = monthNames.reduce(
          (sum, m) => sum + (Number(row[m]) || 0),
          0,
        );
        return row;
      });
      const totalRow = { "Account Name": "TOTAL", Destination: "" };
      monthNames.forEach((m) => {
        totalRow[m] = data.reduce((sum, rr) => sum + (Number(rr[m]) || 0), 0);
      });
      totalRow["Total"] = data.reduce(
        (sum, rr) => sum + (Number(rr["Total"]) || 0),
        0,
      );
      data.push(totalRow);
      const header = ["Account Name", "Destination", ...monthNames, "Total"];
      const sheetData = [
        [companyName || "Company Name"],
        [companyAdd || "Company Address"],
        [companyCity || "Company City"],
        [`TRIAL BALANCE - Financial Year (Apr → Mar)`],
        [],
        header,
        ...data.map((row) => header.map((h) => row[h])),
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      ["A1", "A2", "A3", "A4"].forEach((cellAddr, idx) => {
        if (worksheet[cellAddr]) {
          worksheet[cellAddr].s = {
            font: { bold: true, sz: idx === 0 ? 16 : 12 },
            alignment: { horizontal: "center" },
          };
        }
      });
      worksheet["!cols"] = header.map((h) => {
        if (h === "Account Name") return { wch: 40 };
        if (h === "Destination") return { wch: 25 };
        return { wch: Math.max(h.length + 5, 12) };
      });
      worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: header.length - 1 } },
      ];
      header.forEach((_, colIdx) => {
        const addr = XLSX.utils.encode_cell({ r: 5, c: colIdx });
        if (worksheet[addr]) {
          worksheet[addr].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
            alignment: { horizontal: "center", vertical: "center" },
          };
        }
      });
      const firstDataRow = 6;
      const lastDataRow = data.length + 5;
      [...monthNames, "Total"].forEach((m) => {
        const colIdx = header.indexOf(m);
        for (let r = firstDataRow; r <= lastDataRow; r++) {
          const addr = XLSX.utils.encode_cell({ r, c: colIdx });
          const cell = worksheet[addr];
          if (cell && typeof cell.v === "number") {
            worksheet[addr].s = {
              font: { color: { rgb: cell.v >= 0 ? "0000FF" : "FF0000" } },
              alignment: { horizontal: "right" },
              numFmt: "0.00",
            };
          }
        }
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger_FY_Apr_Mar");
      const buffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
        cellStyles: true,
      });
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      saveAs(blob, "Ledger_FY_Apr_Mar.xlsx");
    } catch (err) {
      console.error("Monthwise export error:", err);
    }
  };
  const exportGroupToExcel = () => {
    const data = groupedRowsToPick.map((r) => ({
      Name: r.ahead || "",
      City: r.city || "",
      Qty: num3(r.netQty),
      Pcs: num3(r.netPcs),
      Debit: r.drcr === "DR" ? Math.abs(r.balance) : 0,
      Credit: r.drcr === "CR" ? Math.abs(r.balance) : 0,
    }));
    if (!data.length) return;
    const header = Object.keys(data[0]);
    const periodFrom = ledgerFromDate || "--";
    const periodTo = ledgerToDate || "--";
    const sheetData = [
      [companyName || "Company Name"],
      [companyAdd || "Company Address"],
      [companyCity || "Company City"],
      [`Group Ledger - ${currentGroupName}`],
      [`Period From: ${periodFrom} To: ${periodTo}`],
      [],
      header,
      ...data.map((row) => header.map((h) => row[h])),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    worksheet["!cols"] = [
      { wch: 40 },
      { wch: 20 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
      { wch: 15 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Group Ledger");
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, `${currentGroupName}_Ledger.xlsx`);
  };
  const exportAccountStatementToExcel = () => {
    if (!filteredTransactions.length) return;
    let running = 0;
    const data = filteredTransactions.map((txn) => {
      const amt = Number(txn.amount) || 0;
      if (String(txn.type).toLowerCase() === "debit") running += amt;
      else running -= amt;
      const drcr = running >= 0 ? "DR" : "CR";
      return {
        Date: new Date(txn.date).toLocaleDateString("en-GB"),
        Type: txn.vtype,
        Narration: txn.narration || "",
        Pcs: num3(txn.pkgs),
        Qty: num3(txn.weight),
        Debit: String(txn.type).toLowerCase() === "debit" ? amt.toFixed(2) : "",
        Credit:
          String(txn.type).toLowerCase() === "credit" ? amt.toFixed(2) : "",
        Balance: Math.abs(running).toFixed(2),
        "DR/CR": drcr,
      };
    });
    const header = Object.keys(data[0]);
    const periodFrom = ledgerFromDate || "--";
    const periodTo = ledgerToDate || "--";
    const sheetData = [
      [companyName || "Company Name"],
      [companyAdd || "Company Address"],
      [companyCity || "Company City"],
      [`Account Statement - ${selectedLedger?.ahead || ""}`],
      [`Period From: ${periodFrom} To: ${periodTo}`],
      [],
      header,
      ...data.map((row) => header.map((h) => row[h])),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    worksheet["!cols"] = [
      { wch: 12 },
      { wch: 10 },
      { wch: 35 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 8 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Account Statement");
    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });
    const blob = new Blob([buffer], { type: "application/octet-stream" });
    saveAs(blob, `${selectedLedger?.ahead || "Account"}_COA.xlsx`);
  };
  return (
    <div style={{ padding: "10px" }}>
      <Card className="contMain">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: "10px",
          }}
        >
          {/* Date Filters */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "row" }}>
              <span className="textform">
                <b>From:</b>
              </span>
              <InputMask
                mask="99/99/9999"
                placeholder="dd/mm/yyyy"
                value={ledgerFromDate || ""}
                onChange={(e) => setLedgerFromDate(e.target.value)}
                className="fDate"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <span className="textform">
                <b>To:</b>
              </span>
              <InputMask
                mask="99/99/9999"
                placeholder="dd/mm/yyyy"
                value={ledgerToDate || ""}
                onChange={(e) => setLedgerToDate(e.target.value)}
                className="toDate"
              />
            </div>
          </div>
          <h3 className="headerTrail">TRIAL BALANCE</h3>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <span style={{ fontSize: 20 }} className="textform">
                Selected Debit:
              </span>
              <input
                style={{ marginLeft: 15, color: "darkblue" }}
                className="value"
                value={money2(selectedDebit)}
                readOnly
              />
            </div>
            <div
              style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
            >
              <span style={{ fontSize: 20 }} className="textform">
                Selected Credit:
              </span>
              <input
                style={{ marginLeft: 7, color: "red" }}
                className="value"
                value={money2(selectedCredit)}
                readOnly
              />
            </div>
          </div>
        </div>
        <div className="TableT" ref={tableContainerRef}>
          <Table size="sm" className="custom-table" hover ref={tableRef}>
            <thead
              style={{
                position: "sticky",
                top: 1,
                background: "skyblue",
                fontSize: 17,
                textAlign: "center",
              }}
            >
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
              {filteredRows.map((r, index) => (
                <tr
                  key={r.acode + "_" + index}
                  style={{
                    backgroundColor: flaggedRows.has(index)
                      ? "red"
                      : index === selectedIndex
                        ? "rgb(187, 186, 186)"
                        : "transparent",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                  // onClick={() => {
                  //   setSelectedIndex(index);
                  //   openLedgerDetails(r);
                  // }}
                  onClick={() => {
                    setSelectedIndex(index);

                    sessionStorage.setItem(
                      "trailTbSelectedIndex",
                      JSON.stringify({
                        index,
                        acode: r?.acode || "",
                      }),
                    );

                    openLedgerDetails(r);
                  }}
                >
                  <td
                    style={{ textAlign: "center" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      style={{
                        width: "18px",
                        height: "18px",
                        cursor: "pointer",
                      }}
                      type="checkbox"
                      checked={!!checkedRows[r.acode]}
                      onChange={() => handleCheckboxChange(r.acode)}
                    />
                  </td>
                  <td>{r.ahead}</td>
                  <td>{r.city}</td>
                  <td style={{ textAlign: "right" }}>{num3(r.netPcs)}</td>
                  <td style={{ textAlign: "right" }}>{num3(r.netQty)}</td>
                  <td
                    style={{
                      textAlign: "right",
                      color: "darkblue",
                      fontWeight: "bold",
                    }}
                  >
                    {r.drcr === "DR" ? money2(Math.abs(r.balance)) : ""}
                  </td>
                  <td
                    style={{
                      textAlign: "right",
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    {r.drcr === "CR" ? money2(Math.abs(r.balance)) : ""}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot
              style={{
                backgroundColor: "skyblue",
                position: "sticky",
                bottom: 0,
              }}
            >
              <tr style={{ fontWeight: "bold", fontSize: 20 }}>
                <td colSpan={5} style={{ textAlign: "right" }}>
                  TOTAL:
                </td>
                <td style={{ textAlign: "right", color: "darkblue" }}>
                  {money2(
                    filteredRows.reduce(
                      (sum, r) =>
                        sum + (r.drcr === "DR" ? Math.abs(r.balance) : 0),
                      0,
                    ),
                  )}
                </td>
                <td style={{ textAlign: "right", color: "red" }}>
                  {money2(
                    filteredRows.reduce(
                      (sum, r) =>
                        sum + (r.drcr === "CR" ? Math.abs(r.balance) : 0),
                      0,
                    ),
                  )}
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
        {/* Search + buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: "auto",
          }}
        >
          <TextField
            inputRef={searchRef}
            label="SEARCH"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              if (!val) return setSearchTerm("");
              if (isValidPrefix(val)) setSearchTerm(val);
            }}
            className={styles.Search}
          />
          <div style={{ marginTop: "5px", marginLeft: "auto" }}>
            <Button
              className="Buttonz"
              style={{ backgroundColor: "#3d85c6" }}
              onClick={openOptionModal}
            >
              Options
            </Button>
            <OptionModal
              isOpen={isOptionOpen}
              onClose={closeOptionModal}
              exportMonthWise={exportLedgerMonthwiseFY}
              onApply={(values) => {
                setOptionValues(values);
                if (values.OrderBy === "Annexure Wise") {
                  buildAnnexureData();
                  setShowAnnexureModal(true);
                }
                if (values.T3) setPrintDateValue(new Date());
                else setPrintDateValue(null);
              }}
            />
            <AnnexureWiseModal
              show={showAnnexureModal}
              onClose={() => setShowAnnexureModal(false)}
              data={annexureGroupedData}
              fromDate={formatDate(fromDate)}
              toDate={formatDate(toDate)}
            />
            <Button
              className="Buttonz"
              style={{ backgroundColor: "#3d85c6" }}
              onClick={handleOpen}
            >
              Print
            </Button>
            <PrintTrail
              items={filteredRows.map((r) => ({
                name: r.ahead || "",
                city: r.city || "",
                netPcs: num3(r.netPcs),
                netWeight: num3(r.netQty),
                debit: r.drcr === "DR" ? Math.abs(r.balance) : 0,
                credit: r.drcr === "CR" ? Math.abs(r.balance) : 0,
              }))}
              isOpen={open}
              handleClose={handleClose}
              ledgerFrom={ledgerFromDate}
              ledgerTo={ledgerToDate}
              currentDate={printDateValue}
              handleExport={exportToExcel}
            />
            <Button
              className="Buttonz"
              style={{ backgroundColor: "#3d85c6" }}
              onClick={() => navigate("/dashboard")}
            >
              Exit
            </Button>
          </div>
        </div>
      </Card>
      {/* ACCOUNT STATEMENT MODAL */}
      {/* <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setActiveRowIndex(0);
        }}
        className="custom-modal"
        style={{ marginTop: 20 }}
        centered
      > */}
      <Modal
        show={showModal}
        // onHide={() => {
        //   sessionStorage.removeItem("trailModalState"); // ✅ clear saved restore state
        //   setShowModal(false);
        //   setActiveRowIndex(0);
        // }}
        onHide={() => {
          sessionStorage.removeItem("trailModalState"); // ✅ clear voucher-restore state
          setShowModal(false);
          setActiveRowIndex(0);

          // ✅ restore TrialBalance selected row (the row you opened modal from)
          const saved = sessionStorage.getItem("trailTbSelectedIndex");
          if (saved) {
            const s = JSON.parse(saved);

            // Prefer restoring by acode (best), fallback to index
            if (s?.acode) {
              const i = filteredRows.findIndex(
                (x) => String(x.acode) === String(s.acode),
              );
              if (i >= 0) setSelectedIndex(i);
              else if (typeof s.index === "number") setSelectedIndex(s.index);
            } else if (typeof s.index === "number") {
              setSelectedIndex(s.index);
            }
          }
        }}
        className="custom-modal"
        style={{ marginTop: 20 }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>ACCOUNT STATEMENT</Modal.Title>
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
                    <b>Code:</b> {selectedLedger?.acode}
                    <br />
                  </span>
                  <span style={{ fontSize: 17 }}>
                    <b>GST No:</b> {selectedLedger?.gstNo}
                    <br />
                  </span>
                  <span style={{ fontSize: 17 }}>
                    <b>Phone:</b> {selectedLedger?.phone}
                    <br />
                  </span>
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                  }}
                >
                  <b style={{ fontSize: 20 }}>{selectedLedger?.ahead || ""}</b>
                  <b style={{ fontSize: 20 }}>{selectedLedger?.city || ""}</b>
                  {filteredTransactions.length > 0 && (
                    <div style={{ fontSize: "20px" }}>
                      {(() => {
                        let balance = 0;
                        filteredTransactions.forEach((txn) => {
                          const amt = Number(txn.amount) || 0;
                          if (String(txn.type).toLowerCase() === "debit")
                            balance += amt;
                          else balance -= amt;
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
                      value={progressiveDebit.toFixed(2)}
                      inputProps={{ style: { height: "10px", width: "206px" } }}
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
                      value={progressiveCredit.toFixed(2)}
                      inputProps={{ style: { height: "10px", width: "206px" } }}
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
                      value={formatDate(fromDate)}
                      inputProps={{ style: { height: "10px", width: "90px" } }}
                    />
                    <TextField
                      className="custom-bordered-input"
                      size="small"
                      value={formatDate(toDate)}
                      inputProps={{ style: { height: "10px", width: "90px" } }}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.tableHeight} ref={txnContainerRef}>
                <Table size="sm" className="custom-table">
                  <thead
                    style={{
                      position: "sticky",
                      top: -1,
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
                            const ns = {};
                            filteredTransactions.forEach(
                              (txn) => (ns[txn._id] = checked),
                            );
                            setSelectedRows(ns);
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
                    {filteredTransactions.length > 0 ? (
                      (() => {
                        let running = 0;
                        return filteredTransactions.map((txn, index) => {
                          const amt = Number(txn.amount) || 0;
                          if (String(txn.type).toLowerCase() === "debit")
                            running += amt;
                          else running -= amt;
                          const drcr = running >= 0 ? "DR" : "CR";
                          const color = drcr === "DR" ? "darkblue" : "red";
                          return (
                            <tr
                              key={txn._id || index}
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
                              <td style={{ textAlign: "right" }}>
                                {num3(txn.pkgs)}
                              </td>
                              <td style={{ textAlign: "right" }}>
                                {num3(txn.weight)}
                              </td>
                              <td
                                style={{
                                  textAlign: "right",
                                  color: "darkblue",
                                }}
                              >
                                {String(txn.type).toLowerCase() === "debit"
                                  ? amt.toFixed(2)
                                  : ""}
                              </td>
                              <td style={{ textAlign: "right", color: "red" }}>
                                {String(txn.type).toLowerCase() === "credit"
                                  ? amt.toFixed(2)
                                  : ""}
                              </td>
                              <td style={{ textAlign: "right", color }}>
                                {Math.abs(running).toFixed(2)}
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
                  {filteredTransactions.length > 0 &&
                    (() => {
                      let totalDebit = 0,
                        totalCredit = 0,
                        running = 0,
                        netWeight = 0,
                        netPcs = 0;
                      filteredTransactions.forEach((txn) => {
                        const amt = Number(txn.amount) || 0;
                        if (String(txn.type).toLowerCase() === "debit") {
                          running += amt;
                          totalDebit += amt;
                        } else {
                          running -= amt;
                          totalCredit += amt;
                        }
                        if (txn.vtype === "P") {
                          netWeight += Number(txn.weight) || 0;
                          netPcs += Number(txn.pkgs) || 0;
                        } else if (txn.vtype === "S") {
                          netWeight -= Number(txn.weight) || 0;
                          netPcs -= Number(txn.pkgs) || 0;
                        }
                      });
                      const drcrFinal = running >= 0 ? "DR" : "CR";
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
                              {Math.abs(running).toFixed(2)}
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
                    selectedLedger={{
                      formData: {
                        ahead: selectedLedger?.ahead,
                        acode: selectedLedger?.acode,
                      },
                    }}
                    ledgerFrom={ledgerFromDate}
                    ledgerTo={ledgerToDate}
                    currentDate={printDateValue}
                    handleExport={exportAccountStatementToExcel}
                  />
                  {/* <Button className="Buttonz" variant="secondary" onClick={() => setShowModal(false)}>Exit</Button>{" "} */}
                  <Button
                    className="Buttonz"
                    variant="secondary"
                    onClick={() => {
                      sessionStorage.removeItem("trailModalState"); // ✅ clear saved restore state
                      setShowModal(false);
                    }}
                  >
                    Exit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
      {/* Options Modal for transactions */}
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
                    if (!e?.target?.value) return;
                    let val = e.target.value.replace(/\D/g, "");
                    if (val.length > 2)
                      val = val.slice(0, 2) + "/" + val.slice(2);
                    if (val.length > 5)
                      val = val.slice(0, 5) + "/" + val.slice(5, 9);
                    e.target.value = val;
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
                    if (!e?.target?.value) return;
                    let val = e.target.value.replace(/\D/g, "");
                    if (val.length > 2)
                      val = val.slice(0, 2) + "/" + val.slice(2);
                    if (val.length > 5)
                      val = val.slice(0, 5) + "/" + val.slice(5, 9);
                    e.target.value = val;
                  }}
                  dateFormat="dd/MM/yyyy"
                  className={styles.to}
                />
              </Form.Group>
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
                style={{ transform: "scale(1.2)" }}
              />
              <Form.Check
                type="checkbox"
                label="Journal"
                name="journal"
                checked={vtypeFilters.journal}
                onChange={handleVtypeChange}
                style={{ transform: "scale(1.2)" }}
              />
              <Form.Check
                type="checkbox"
                label="Bank"
                name="bank"
                checked={vtypeFilters.bank}
                onChange={handleVtypeChange}
                style={{ transform: "scale(1.2)" }}
              />
              <Form.Check
                type="checkbox"
                label="Sale"
                name="sale"
                checked={vtypeFilters.sale}
                onChange={handleVtypeChange}
                style={{ transform: "scale(1.2)" }}
              />
              <Form.Check
                type="checkbox"
                label="Purchase"
                name="purchase"
                checked={vtypeFilters.purchase}
                onChange={handleVtypeChange}
                style={{ transform: "scale(1.2)" }}
              />
              <Form.Check
                type="checkbox"
                label="TDS"
                name="tds"
                checked={vtypeFilters.tds}
                onChange={handleVtypeChange}
                style={{ transform: "scale(1.2)" }}
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
      {/* BsGroup Listing (Group Modal) */}
      <Modal
        show={showGroupModal}
        onHide={() => setShowGroupModal(false)}
        centered
        className="custom-modal"
        backdrop="static"
        style={{ marginTop: 20 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <span style={{ color: "darkblue" }}>{currentGroupName}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", marginTop: 5 }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <b style={{ fontSize: 16, marginRight: "10px" }}>Period From</b>
                <TextField
                  className="custom-bordered-input"
                  size="small"
                  value={formatDate(fromDate)}
                  inputProps={{ style: { height: "10px", width: "120px" } }}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
              >
                <b style={{ fontSize: 16, marginRight: "61px" }}>UpTo</b>
                <TextField
                  className="custom-bordered-input"
                  size="small"
                  value={formatDate(toDate)}
                  inputProps={{ style: { height: "10px", width: "120px" } }}
                />
              </div>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", marginTop: 5 }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <b style={{ fontSize: 16, marginRight: "16px" }}>
                  Selected Debit
                </b>
                <TextField
                  className="custom-bordered-input"
                  size="small"
                  value={money2(groupTotals.debit)}
                  inputProps={{ style: { height: "10px", width: "150px" } }}
                />
              </div>
              <div
                style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
              >
                <b style={{ fontSize: 16, marginRight: "10px" }}>
                  Selected Credit
                </b>
                <TextField
                  className="custom-bordered-input"
                  size="small"
                  value={money2(groupTotals.credit)}
                  inputProps={{ style: { height: "10px", width: "150px" } }}
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
                      checked={
                        selectedGroupRows.size === groupedRowsToPick.length &&
                        groupedRowsToPick.length > 0
                      }
                      onChange={(e) => {
                        if (e.target.checked)
                          setSelectedGroupRows(
                            new Set(groupedRowsToPick.map((_, i) => i)),
                          );
                        else setSelectedGroupRows(new Set());
                      }}
                      style={{ transform: "scale(1.2)", cursor: "pointer" }}
                    />
                  </th>
                  <th>NAME</th>
                  <th>CITY</th>
                  <th>QTY</th>
                  <th>PCS</th>
                  <th>DEBIT</th>
                  <th>CREDIT</th>
                </tr>
              </thead>
              <tbody>
                {groupedRowsToPick.map((r, index) => (
                  <tr
                    key={r.acode + "_" + index}
                    ref={(el) => (groupRowRefs.current[index] = el)}
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        index === activeGroupIndex
                          ? "rgb(187,186,186)"
                          : "transparent",
                    }}
                    onMouseEnter={() => setActiveGroupIndex(index)}
                    onClick={() => fetchLedgerTransactions(r)}
                  >
                    <td
                      style={{ textAlign: "center" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroupRows.has(index)}
                        onChange={() => {
                          setSelectedGroupRows((prev) => {
                            const ns = new Set(prev);
                            if (ns.has(index)) ns.delete(index);
                            else ns.add(index);
                            return ns;
                          });
                        }}
                        style={{ transform: "scale(1.2)", cursor: "pointer" }}
                      />
                    </td>
                    <td>{r.ahead}</td>
                    <td>{r.city}</td>
                    <td style={{ textAlign: "right" }}>{num3(r.netQty)}</td>
                    <td style={{ textAlign: "right" }}>{num3(r.netPcs)}</td>
                    <td
                      style={{
                        textAlign: "right",
                        color: "darkblue",
                        fontWeight: "bold",
                      }}
                    >
                      {r.drcr === "DR" ? money2(Math.abs(r.balance)) : ""}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        color: "red",
                        fontWeight: "bold",
                      }}
                    >
                      {r.drcr === "CR" ? money2(Math.abs(r.balance)) : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Button
              className="Buttonz"
              style={{ marginRight: "10px" }}
              onClick={handleOpen}
            >
              Print
            </Button>
            <PrintTrail
              items={groupedRowsToPick.map((r) => ({
                name: r.ahead || "",
                city: r.city || "",
                netPcs: num3(r.netPcs),
                netWeight: num3(r.netQty),
                debit: r.drcr === "DR" ? Math.abs(r.balance) : 0,
                credit: r.drcr === "CR" ? Math.abs(r.balance) : 0,
              }))}
              isOpen={open}
              handleClose={handleClose}
              ledgerFrom={ledgerFromDate}
              ledgerTo={ledgerToDate}
              currentDate={printDateValue}
              currentGroupName={currentGroupName}
              handleExport={exportGroupToExcel}
            />
            <Button
              className="Buttonz"
              variant="secondary"
              onClick={() => setShowGroupModal(false)}
            >
              Close
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
export default TrailBalance;

// import React, { useEffect, useState, useRef, useMemo } from "react";
// import axios from "axios";
// import { Table, Modal, Button, Card, Form } from "react-bootstrap"; // ✅ Form imported
// import styles from "../AccountStatement/LedgerList.module.css";
// import TextField from "@mui/material/TextField";
// import { useNavigate, useLocation } from "react-router-dom"; // ✅ Add this
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import useCompanySetup from "../Shared/useCompanySetup";
// import OptionModal from "./OptionModal";
// import "./TrailBalance.css";
// import PrintTrail from "./PrintTrail";
// import * as XLSX from "sheetjs-style";
// import { saveAs } from "file-saver";
// import CoA from "./CoA";
// import InputMask from "react-input-mask";
// import financialYear from "../Shared/financialYear";
// import AnnexureWiseModal from "./AnnexureWiseModal";

// const TrailBalance = () => {
//   const { dateFrom, companyName, companyAdd, companyCity } = useCompanySetup();

//   const [allLedgers, setAllLedgers] = useState([]); // keep full list
//   // const [allLedgers, setAllLedgers] = useState([]);
//   const [faDataState, setFaDataState] = useState([]); // ✅ store faData here
//   const [filteredLedgers, setFilteredLedgers] = useState([]); // ✅ for search
//   const [searchTerm, setSearchTerm] = useState(""); // ✅ search state
//   const [selectedIndex, setSelectedIndex] = useState(0);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedLedger, setSelectedLedger] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const rowRefs = useRef([]);
//   const tableRef = useRef(null);

//   const tableContainerRef = useRef(null);
//   const txnContainerRef = useRef(null);

//   const searchRef = useRef(null); // ✅ search input ref
//   const groupRowRefs = useRef([]);
//   const navigate = useNavigate();
//   const [activeRowIndex, setActiveRowIndex] = useState(0); // ✅ Track highlighted txn row
//   const [checkedRows, setCheckedRows] = useState({});

//   // Printing Trail Balance
//   const [open, setOpen] = React.useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   // Filter Ledger Accounts
//   const [showGroupModal, setShowGroupModal] = useState(false);
//   const [groupedLedgersToPick, setGroupedLedgersToPick] = useState([]);
//   const [activeGroupIndex, setActiveGroupIndex] = useState(0);
//   const [currentGroupName, setCurrentGroupName] = useState("");
//   const [selectedGroupRows, setSelectedGroupRows] = useState(new Set());

//   const [ledgerFromDate, setLedgerFromDate] = useState(null);
//   const [ledgerToDate, setLedgerToDate] = useState(null);
//   const [fromDate, setFromDate] = useState(null);
//   const [toDate, setToDate] = useState(null);
//   const [isOptionOpen, setIsOptionOpen] = useState(false);
//   const [optionValues, setOptionValues] = useState({
//     Balance: "Active Balance",
//     OrderBy: "",
//     Annexure: "All",
//     T1: "", // ✅ include T1 (Selected Accounts)
//     T3: false, // ✅ Print Current Date
//     T10: false, // ✅ group by BsGroup toggle
//   });

//   const [printDateValue, setPrintDateValue] = useState(null); // ✅ actual stored date

//   const openOptionModal = () => {
//     setIsOptionOpen(true);
//   };
//   const closeOptionModal = () => {
//     setIsOptionOpen(false);
//   };

//   useEffect(() => {
//     const fy = financialYear.getFYDates();
//     setLedgerFromDate(formatDate(fy.start)); // converted
//     setLedgerToDate(formatDate(fy.end)); // converted
//     setFromDate(fy.start); // converted
//     setToDate(fy.end); // converted
//   }, []);

//   // Filters Transactions Account Statement
//   const [vtypeFilters, setVtypeFilters] = useState({
//     cash: true,
//     journal: true,
//     bank: true,
//     sale: true,
//     purchase: true,
//     tds: true,
//   });
//   const [isPrintOpen, setIsPrintOpen] = useState(false);
//   const [showOptions, setShowOptions] = useState(false); // ✅ For Options modal
//   const [filterType, setFilterType] = useState("All"); // ✅ Debit / Credit / All
//   const [filteredTransactions, setFilteredTransactions] = useState([]); // ✅ For filtered txns
//   const [narrationFilter, setNarrationFilter] = useState(""); // ✅ for narration
//   const [selectedRows, setSelectedRows] = useState({});
//   const [selectionFilter, setSelectionFilter] = useState("All");
//   const [ledgerTotals, setLedgerTotals] = useState({}); // { ledgerId: { netPcs, netWeight } }
//   const [progressiveDebit, setProgressiveDebit] = useState(0);
//   const [progressiveCredit, setProgressiveCredit] = useState(0);

//   const handleVtypeChange = (e) => {
//     const { name, checked } = e.target;
//     setVtypeFilters((prev) => ({
//       ...prev,
//       [name]: checked,
//     }));
//   };

//   const handleRowCheckboxChange = (txnId) => {
//     setSelectedRows((prev) => ({
//       ...prev,
//       [txnId]: !prev[txnId], // toggle selection
//     }));
//   };

//   useEffect(() => {
//     if (!transactions.length || activeRowIndex < 0) {
//       setProgressiveDebit(0);
//       setProgressiveCredit(0);
//       return;
//     }

//     let debit = 0;
//     let credit = 0;

//     filteredTransactions.slice(0, activeRowIndex + 1).forEach((txn) => {
//       if (txn.type.toLowerCase() === "debit") {
//         debit += txn.amount;
//       } else if (txn.type.toLowerCase() === "credit") {
//         credit += txn.amount;
//       }
//     });

//     setProgressiveDebit(debit);
//     setProgressiveCredit(credit);
//   }, [activeRowIndex, filteredTransactions]);

//   // ✅ Update filtered transactions whenever filters or transactions change
//   useEffect(() => {
//     let data = transactions;

//     // ✅ Filter by Debit/Credit
//     if (filterType !== "All") {
//       data = data.filter(
//         (txn) => txn.type.toLowerCase() === filterType.toLowerCase(),
//       );
//     }

//     // ✅ Filter by narration
//     if (narrationFilter.trim() !== "") {
//       data = data.filter((txn) =>
//         txn.narration?.toLowerCase().includes(narrationFilter.toLowerCase()),
//       );
//     }

//     // ✅ Filter by Date range
//     if (fromDate) {
//       data = data.filter((txn) => new Date(txn.date) >= fromDate);
//     }
//     if (toDate) {
//       data = data.filter((txn) => new Date(txn.date) <= toDate);
//     }

//     // ✅ Filter by VType checkboxes
//     const selectedVtypes = [];
//     if (vtypeFilters.cash) selectedVtypes.push("C");
//     if (vtypeFilters.journal) selectedVtypes.push("J");
//     if (vtypeFilters.bank) selectedVtypes.push("B");
//     if (vtypeFilters.sale) selectedVtypes.push("S");
//     if (vtypeFilters.purchase) selectedVtypes.push("P");
//     if (vtypeFilters.tds) selectedVtypes.push("TDS");

//     if (selectedVtypes.length > 0) {
//       data = data.filter((txn) => selectedVtypes.includes(txn.vtype));
//     }

//     // ✅ Filter by selection (Selected / Unselected / All)
//     if (selectionFilter === "Selected") {
//       data = data.filter((txn) => selectedRows[txn._id]);
//     } else if (selectionFilter === "Unselected") {
//       data = data.filter((txn) => !selectedRows[txn._id]);
//     }

//     setFilteredTransactions(data);
//   }, [
//     filterType,
//     narrationFilter,
//     fromDate,
//     toDate,
//     vtypeFilters,
//     selectionFilter, // 👈 added dependency
//     selectedRows, // 👈 added dependency
//     transactions,
//   ]);

//   const [flaggedRows, setFlaggedRows] = useState(() => {
//     const saved = localStorage.getItem("flaggedRowsTrail");
//     return saved ? new Set(JSON.parse(saved)) : new Set();
//   });

//   useEffect(() => {
//     localStorage.setItem("flaggedRowsTrail", JSON.stringify([...flaggedRows]));
//   }, [flaggedRows]);

//   // Auto focus search field on mount
//   useEffect(() => {
//     if (searchRef.current) {
//       searchRef.current.focus();
//     }
//   }, []);

//   const parseDDMMYYYY = (str) => {
//     if (!str) return null;
//     const [dd, mm, yyyy] = str.split("/").map(Number);
//     return new Date(yyyy, mm - 1, dd);
//   };

//   // fetch ledger + fa
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [ledgerRes, faRes] = await Promise.all([
//           axios.get(
//             "https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount",
//           ),
//           axios.get(
//             "https://www.shkunweb.com/shkunlive/${tenant}/tenant/aa/fafile",
//           ),
//         ]);

//         const ledgersData = ledgerRes.data.data || [];
//         const faData = faRes.data.data || [];

//         /* ---------- TOTALS (ACODE BASED) ---------- */
//         const totalsMap = {};

//         faData.forEach((entry) => {
//           const from = parseDDMMYYYY(ledgerFromDate);
//           const to = parseDDMMYYYY(ledgerToDate);

//           entry.transactions.forEach((txn) => {
//             const txnDate = new Date(txn.date);
//             if (from && txnDate < from) return;
//             if (to && txnDate > to) return;

//             const acode = String(txn.ACODE); // 🔥 FIX
//             if (!acode) return;

//             if (!totalsMap[acode]) {
//               totalsMap[acode] = {
//                 debit: 0,
//                 credit: 0,
//                 netWeight: 0,
//                 netPcs: 0,
//               };
//             }

//             if (txn.type.toLowerCase() === "debit") {
//               totalsMap[acode].debit += txn.amount;
//             } else {
//               totalsMap[acode].credit += txn.amount;
//             }

//             if (txn.type.toLowerCase() === "debit") {
//               totalsMap[acode].netWeight += txn.weight || 0;
//               totalsMap[acode].netPcs += txn.pkgs || 0;
//             } else if (txn.type.toLowerCase() === "credit") {
//               totalsMap[acode].netWeight -= txn.weight || 0;
//               totalsMap[acode].netPcs -= txn.pkgs || 0;
//             }
//           });
//         });

//         setLedgerTotals(totalsMap);

//         /* ---------- ENRICH LEDGERS ---------- */
//         const enriched = ledgersData.map((ledger) => {
//           const acode = String(ledger.formData.acode);
//           const t = totalsMap[acode] || {
//             debit: 0,
//             credit: 0,
//             netWeight: 0,
//             netPcs: 0,
//           };
//           const balance = t.debit - t.credit;
//           const drcr = balance > 0 ? "DR" : balance < 0 ? "CR" : "NIL";

//           return {
//             ...ledger,
//             totals: { balance, drcr },
//             hasTxn: !!totalsMap[acode],
//           };
//         });

//         setAllLedgers(enriched);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchData();
//   }, [ledgerFromDate, ledgerToDate]);

//   // apply filters + sorting
//   useEffect(() => {
//     let result = [...allLedgers];

//     // Balance filter
//     switch (optionValues.Balance) {
//       case "Active Balance":
//         result = result.filter((l) => l.totals.balance !== 0);
//         break;
//       case "Nil Balance":
//         result = result.filter((l) => l.totals.balance === 0);
//         break;
//       case "Debit Balance":
//         result = result.filter((l) => l.totals.balance > 0);
//         break;
//       case "Credit Balance":
//         result = result.filter((l) => l.totals.balance < 0);
//         break;
//       case "Transacted Account":
//         result = result.filter((l) => l.hasTxn);
//         break;
//       case "Non Transacted Account":
//         result = result.filter((l) => !l.hasTxn);
//         break;
//       case "All Accounts":
//       default:
//         break;
//     }

//     // Annexure filter
//     if (optionValues.Annexure && optionValues.Annexure !== "All") {
//       result = result.filter(
//         (l) => l.formData.Bsgroup === optionValues.Annexure,
//       );
//     }

//     // Sorting
//     switch (optionValues.OrderBy) {
//       case "Account Name Wise":
//         result.sort((a, b) =>
//           (a.formData.ahead || "").localeCompare(b.formData.ahead || ""),
//         );
//         break;
//       case "City Wise + Name Wise":
//         result.sort((a, b) => {
//           const cityComp = (a.formData.city || "").localeCompare(
//             b.formData.city || "",
//           );
//           if (cityComp !== 0) return cityComp;
//           return (a.formData.ahead || "").localeCompare(b.formData.ahead || "");
//         });
//         break;
//       case "Sorting Order No.Wise":
//         result.sort(
//           (a, b) =>
//             (a.formData.sortingOrderNo || 0) - (b.formData.sortingOrderNo || 0),
//         );
//         break;
//       case "Prefix Annexure Wise":
//         result.sort((a, b) =>
//           (a.formData.Bsgroup || "")
//             .toString()
//             .charAt(0)
//             .localeCompare((b.formData.Bsgroup || "").toString().charAt(0)),
//         );
//         break;
//       default:
//         break;
//     }

//     // Selected Accounts filter
//     if (optionValues.T1) {
//       result = result.filter((l) => !!checkedRows[l._id]);
//     }

//     if (optionValues.T10) {
//       const grouped = {};
//       result.forEach((ledger) => {
//         const group = ledger.formData.Bsgroup || "Others";
//         if (!grouped[group]) {
//           grouped[group] = {
//             balance: 0,
//             qty: 0,
//             pcs: 0,
//             debit: 0,
//             credit: 0,
//             ledgers: [],
//           };
//         }
//         const { balance, drcr, qty = 0, pcs = 0 } = ledger.totals || {};
//         grouped[group].balance += balance;
//         grouped[group].qty += qty;
//         grouped[group].pcs += pcs;
//         if (drcr === "DR") {
//           grouped[group].debit += Math.abs(balance);
//         } else {
//           grouped[group].credit += Math.abs(balance);
//         }
//         grouped[group].ledgers.push(ledger);
//       });

//       result = Object.entries(grouped).map(([group, data]) => {
//         const drcr = data.balance >= 0 ? "DR" : "CR";
//         return {
//           _id: group,
//           formData: { ahead: group, city: "" },
//           totals: {
//             balance: data.balance,
//             drcr,
//             qty: data.qty,
//             pcs: data.pcs,
//             debit: data.debit,
//             credit: data.credit,
//           },
//           groupedLedgers: data.ledgers,
//         };
//       });
//     }

//     // ✅ Search filter
//     if (searchTerm) {
//       const lower = searchTerm.toLowerCase();
//       result = result.filter(
//         (ledger) =>
//           ledger.formData.ahead.toLowerCase().includes(lower) ||
//           ledger.formData.city?.toLowerCase().includes(lower) ||
//           ledger.formData.gstNo?.toLowerCase().includes(lower) ||
//           ledger.formData.phone?.toLowerCase().includes(lower),
//       );
//     }

//     setFilteredLedgers(result);
//   }, [allLedgers, optionValues, checkedRows, searchTerm]);

//   // Reset selectedIndex ONLY when filters/search change, not checkbox
//   useEffect(() => {
//     setSelectedIndex(0);
//   }, [allLedgers, optionValues, searchTerm]);

//   // 👉 Function to handle navigation based on vtype
//   const handleTransactionSelect = (txn) => {
//     if (!txn) return;
//     const modalState = {
//       rowIndex: activeRowIndex,
//       selectedLedger,
//       keepModalOpen: true,
//     };

//     sessionStorage.setItem("trailModalState", JSON.stringify(modalState));

//     switch (
//       txn.vtype // ✅ use vtype from your transaction object
//     ) {
//       case "S": // Sale
//         navigate("/Sale", {
//           state: {
//             saleId: txn.saleId,
//             // saleId: txn._id,
//           },
//         });
//         break;
//       case "P": // Purchase
//         navigate("/purchase", {
//           state: {
//             purId: txn.purId,
//           },
//         });
//         // navigate("/purchase", { state: { purId: txn._id, rowIndex: activeRowIndex } });
//         break;
//       case "B": // Bank
//         navigate("/bankvoucher", {
//           state: {
//             bankId: txn.bankId,
//           },
//         });
//         // navigate("/bankvoucher", { state: { bankId: txn._id, rowIndex: activeRowIndex } });
//         break;
//       case "C": // Cash
//         navigate("/cashvoucher", {
//           state: {
//             cashId: txn.cashId,
//           },
//         });
//         // navigate("/cashvoucher", { state: { cashId: txn._id, rowIndex: activeRowIndex } });
//         break;
//       case "J": // Journal
//         navigate("/journalvoucher", {
//           state: {
//             journalId: txn.journalId,
//           },
//         });
//         // navigate("/journalvoucher", { state: { journalId: txn._id, rowIndex: activeRowIndex } });
//         break;
//       default:
//         console.log("Unknown vtype:", txn.vtype);
//     }
//   };

//   // Open modal and fetch transactions
//   const openLedgerDetails = (ledger) => {
//     if (ledger.groupedLedgers) {
//       setGroupedLedgersToPick(ledger.groupedLedgers);
//       setCurrentGroupName(ledger.formData.ahead); // 🔹 store group name
//       setShowGroupModal(true);
//     } else {
//       fetchLedgerTransactions(ledger);
//     }
//   };

//   const loadLedgerData = (selectedLedger = null) => {
//     axios
//       .get(
//         "https://www.shkunweb.com/shkunlive/${tenant}/tenant/aa/fafile",
//       )
//       .then((res) => {
//         const allTxns = res.data.data || [];

//         // -----------------------------------------
//         // 1️⃣ Compute Totals for All Ledgers
//         // -----------------------------------------
//         const totals = {};
//         allLedgers.forEach((ledger) => {
//           const ledgerTxns = allTxns.flatMap((entry) =>
//             entry.transactions.filter(
//               (txn) => String(txn.ACODE) === String(ledger.formData.acode),
//             ),
//           );

//           let netWeight = 0;
//           let netPcs = 0;

//           ledgerTxns.forEach((txn) => {
//             const weight = txn.weight || 0;
//             const pcs = txn.pkgs || 0;

//             if (txn.type?.toLowerCase() === "debit") {
//               netWeight += weight; // ✅ debit positive
//               netPcs += pcs;
//             } else if (txn.type?.toLowerCase() === "credit") {
//               netWeight -= weight; // ✅ credit negative
//               netPcs -= pcs;
//             }
//           });

//           totals[ledger._id] = { netWeight, netPcs };
//         });

//         setLedgerTotals(totals);

//         // -----------------------------------------
//         // 2️⃣ If a ledger is selected → prepare its txns
//         // -----------------------------------------
//         if (selectedLedger) {
//           const ledgerTxns = allTxns.flatMap((entry) =>
//             entry.transactions
//               .filter(
//                 (txn) =>
//                   txn.account.trim() === selectedLedger.formData.ahead.trim(),
//               )
//               .map((txn) => ({
//                 ...txn,
//                 saleId: entry.saleId || null,
//                 purId: entry.purchaseId || null,
//                 bankId: entry.bankId || null,
//                 cashId: entry.cashId || null,
//                 journalId: entry.journalId || null,
//               })),
//           );

//           setSelectedLedger(selectedLedger);
//           setTransactions(ledgerTxns);
//           setShowModal(true);
//         }
//       })
//       .catch((err) => console.error(err));
//   };

//   useEffect(() => {
//     loadLedgerData();
//   }, [allLedgers]);

//   const fetchLedgerTransactions = (ledger) => {
//     loadLedgerData(ledger);
//   };

//   useEffect(() => {
//     const reopenModal = (e) => {
//       const { rowIndex, selectedLedger } = e.detail;
//       setActiveRowIndex(rowIndex || 0);
//       if (selectedLedger) openLedgerDetails(selectedLedger);
//     };

//     window.addEventListener("reopenTrailModal", reopenModal);
//     return () => window.removeEventListener("reopenTrailModal", reopenModal);
//   }, []);

//   // 🔹 Keyboard navigation inside transactions for Account Statement
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (!transactions.length || !showModal) return;

//       if (e.key === "ArrowUp") {
//         setActiveRowIndex((prev) => (prev > 0 ? prev - 1 : prev));
//       } else if (e.key === "ArrowDown") {
//         setActiveRowIndex((prev) =>
//           prev < transactions.length - 1 ? prev + 1 : prev,
//         );
//       } else if (e.key === "PageUp") {
//         // Jump to first entry
//         setActiveRowIndex(0);
//       } else if (e.key === "PageDown") {
//         // Jump to last entry
//         setActiveRowIndex(transactions.length - 1);
//       } else if (e.key === "Enter") {
//         const entry = transactions[activeRowIndex];
//         handleTransactionSelect(entry);
//       } else if (e.key === "Escape") {
//         setShowModal(false);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [transactions, activeRowIndex, showModal]);

//   // Handle keyboard navigation for LedgerList
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       // 🔹 Mini modal navigation
//       if (showGroupModal && groupedLedgersToPick.length) {
//         e.preventDefault(); // Prevent default scrolling & background nav

//         if (e.key === "ArrowDown") {
//           setActiveGroupIndex(
//             (prev) => (prev + 1) % groupedLedgersToPick.length,
//           );
//         } else if (e.key === "ArrowUp") {
//           setActiveGroupIndex((prev) =>
//             prev === 0 ? groupedLedgersToPick.length - 1 : prev - 1,
//           );
//         } else if (e.key === "Enter") {
//           const selectedLedger = groupedLedgersToPick[activeGroupIndex];
//           fetchLedgerTransactions(selectedLedger);
//         }
//         return; // 🔹 stop further handling
//       }

//       // 🔹 Main ledger table navigation
//       if (!showModal && filteredLedgers.length) {
//         if (e.key === "ArrowDown") {
//           e.preventDefault();
//           setSelectedIndex((prev) =>
//             prev < filteredLedgers.length - 1 ? prev + 1 : prev,
//           );
//         } else if (e.key === "ArrowUp") {
//           e.preventDefault();
//           setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
//         } else if (e.key === "PageUp") {
//           // Jump to first entry
//           setSelectedIndex(0);
//         } else if (e.key === "PageDown") {
//           // Jump to last entry
//           setSelectedIndex(filteredLedgers.length - 1);
//         } else if (e.key === "Enter") {
//           const ledger = filteredLedgers[selectedIndex];
//           openLedgerDetails(ledger);
//           setSearchTerm(""); // Clear search on open
//         } else if (e.key === "F3") {
//           e.preventDefault();
//           setFlaggedRows((prev) => {
//             const newSet = new Set(prev);
//             if (newSet.has(selectedIndex)) {
//               newSet.delete(selectedIndex);
//             } else {
//               newSet.add(selectedIndex);
//             }
//             return newSet;
//           });
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [
//     showModal,
//     showGroupModal,
//     filteredLedgers,
//     selectedIndex,
//     transactions,
//     activeRowIndex,
//     groupedLedgersToPick,
//     activeGroupIndex,
//   ]);

//   // ✅ Auto-scroll ledger list to keep selected row fully visible
//   useEffect(() => {
//     const container = tableContainerRef.current;
//     if (!container) return;

//     const rows = container.querySelectorAll("tbody tr");
//     if (!rows.length) return;

//     const idx = Math.max(0, Math.min(selectedIndex, rows.length - 1));
//     const selectedRow = rows[idx];
//     if (!selectedRow) return;

//     // --- adjust for your table header height ---
//     const headerOffset = 40; // px — tweak if your header is taller
//     const buffer = 25; // space above/below row so it's fully visible

//     const rowTop = selectedRow.offsetTop;
//     const rowBottom = rowTop + selectedRow.offsetHeight;
//     const containerHeight = container.clientHeight;

//     const visibleTop = container.scrollTop + headerOffset + buffer;
//     const visibleBottom = container.scrollTop + containerHeight - buffer;

//     if (rowBottom > visibleBottom) {
//       // Scroll down enough to show the whole row
//       const newScrollTop = rowBottom - containerHeight + buffer * 2;
//       container.scrollTo({ top: newScrollTop, behavior: "smooth" });
//     } else if (rowTop < visibleTop) {
//       // Scroll up enough so header doesn’t hide it
//       const newScrollTop = rowTop - headerOffset - buffer;
//       container.scrollTo({ top: newScrollTop, behavior: "smooth" });
//     }
//   }, [selectedIndex, filteredLedgers]);

//   // ✅ Auto-scroll inside ACCOUNT STATEMENT modal
//   useEffect(() => {
//     if (!showModal || !txnContainerRef.current) return;

//     const container = txnContainerRef.current;
//     const rows = container.querySelectorAll("tbody tr");
//     if (!rows.length) return;

//     const idx = Math.max(0, Math.min(activeRowIndex, rows.length - 1));
//     const selectedRow = rows[idx];
//     if (!selectedRow) return;

//     // heights & offsets
//     const headerOffset = 40; // Adjust to match your modal header height
//     const buffer = 18; // Space above/below so row is clearly visible

//     const rowTop = selectedRow.offsetTop;
//     const rowBottom = rowTop + selectedRow.offsetHeight;
//     const containerHeight = container.clientHeight;

//     // The currently visible top & bottom inside the scrollable container
//     const visibleTop = container.scrollTop + headerOffset + buffer;
//     const visibleBottom = container.scrollTop + containerHeight - buffer;

//     // scroll adjustments
//     if (rowBottom > visibleBottom) {
//       // Scroll just enough so full row + buffer fits
//       const newScrollTop = rowBottom - containerHeight + buffer * 2;
//       container.scrollTo({ top: newScrollTop, behavior: "smooth" });
//     } else if (rowTop < visibleTop) {
//       const newScrollTop = rowTop - headerOffset - buffer;
//       container.scrollTo({ top: newScrollTop, behavior: "smooth" });
//     }
//   }, [activeRowIndex, showModal, filteredTransactions]);

//   const handleCheckboxChange = (id) => {
//     setCheckedRows((prev) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   // ✅ Compute selected debit/credit sums
//   const { selectedDebit, selectedCredit } = useMemo(() => {
//     let debitSum = 0;
//     let creditSum = 0;

//     filteredLedgers.forEach((ledger) => {
//       if (checkedRows[ledger._id]) {
//         const { balance, drcr } = ledger.totals || {};
//         if (drcr === "DR") debitSum += Math.abs(balance);
//         if (drcr === "CR") creditSum += Math.abs(balance);
//       }
//     });

//     return {
//       selectedDebit: debitSum,
//       selectedCredit: creditSum,
//     };
//   }, [checkedRows, filteredLedgers]);

//   const formatDate = (date) => {
//     if (!date) return "";
//     const d = new Date(date);
//     const day = String(d.getDate()).padStart(2, "0");
//     const month = String(d.getMonth() + 1).padStart(2, "0");
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
//   };

//   // Export Trail Balance
//   const exportToExcel = () => {
//     const data = filteredLedgers.map((ledger) => {
//       const { balance, drcr } = ledger.totals || {};
//       return {
//         Name: ledger.formData.ahead,
//         City: ledger.formData.city,
//         Debit: drcr === "DR" ? Math.abs(balance) : "",
//         Credit: drcr === "CR" ? Math.abs(balance) : "",
//         Pcs: ledgerTotals[ledger._id]?.netPcs.toFixed(3) || "",
//         Qty: ledgerTotals[ledger._id]?.netWeight?.toFixed(3) || "",
//         "A/c Code": ledger.formData.acode,
//         "Group Name": ledger.formData.Bsgroup,
//       };
//     });

//     if (data.length === 0) return;

//     const header = Object.keys(data[0]);

//     // Period
//     const periodFrom = ledgerFromDate ? formatDate(ledgerFromDate) : "--";
//     const periodTo = ledgerToDate ? formatDate(ledgerToDate) : "--";

//     // Build sheet data
//     const sheetData = [
//       [companyName || "Company Name"],
//       [companyAdd || "Company Address"],
//       [companyCity || "Company City"],
//       [`TRIAL BALANCE - Period From: ${periodFrom} To: ${periodTo}`],
//       [],
//       header,
//       ...data.map((row) => header.map((h) => row[h])),
//     ];

//     // ✅ Totals Row with Excel formula
//     const numericFields = ["Debit", "Credit", "Pcs", "Qty"];
//     const totals = {};
//     header.forEach((h, index) => {
//       if (index === 0) {
//         totals[h] = "TOTAL";
//       } else if (numericFields.includes(h)) {
//         const colLetter = XLSX.utils.encode_col(index);
//         const firstRow = 6; // data starts row 6
//         const lastRow = 6 + data.length;
//         totals[h] = {
//           f: `SUBTOTAL(9,${colLetter}${firstRow}:${colLetter}${lastRow})`,
//         };
//       } else {
//         totals[h] = "";
//       }
//     });
//     sheetData.push(header.map((h) => totals[h]));

//     const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

//     // Column widths
//     worksheet["!cols"] = [
//       { wch: 40 }, // Name
//       { wch: 20 }, // City
//       { wch: 15 }, // Debit
//       { wch: 15 }, // Credit
//       { wch: 10 }, // Pcs
//       { wch: 10 }, // Qty
//       { wch: 15 }, // A/c Code
//       { wch: 30 }, // BsGroup
//     ];

//     // Style headers
//     header.forEach((_, colIdx) => {
//       const cellAddr = XLSX.utils.encode_cell({ r: 5, c: colIdx });
//       if (worksheet[cellAddr]) {
//         worksheet[cellAddr].s = {
//           font: { bold: true, color: { rgb: "FFFFFF" } },
//           fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
//           alignment: { horizontal: "center", vertical: "center" },
//         };
//       }
//     });

//     // Style company rows
//     ["A1", "A2", "A3", "A4"].forEach((cell, idx) => {
//       if (worksheet[cell]) {
//         worksheet[cell].s = {
//           font: {
//             bold: true,
//             sz: idx === 0 ? 16 : 12,
//             color: { rgb: "000000" },
//           },
//           alignment: { horizontal: "center" },
//         };
//       }
//     });

//     // Right-align numeric fields
//     numericFields.forEach((field) => {
//       const colIdx = header.indexOf(field);
//       if (colIdx !== -1) {
//         for (let r = 6; r < data.length + 6; r++) {
//           const addr = XLSX.utils.encode_cell({ r, c: colIdx });
//           if (worksheet[addr]) {
//             worksheet[addr].s = {
//               alignment: { horizontal: "right" },
//               numFmt: "0.00", // ✅ keeps 2 decimal places
//             };
//           }
//         }
//       }
//     });

//     // Left-align A/c Code column
//     const acCodeColIdx = header.indexOf("A/c Code");
//     if (acCodeColIdx !== -1) {
//       for (let r = 6; r < data.length + 6; r++) {
//         const addr = XLSX.utils.encode_cell({ r, c: acCodeColIdx });
//         if (worksheet[addr]) {
//           worksheet[addr].s = { alignment: { horizontal: "center" } };
//         }
//       }
//     }

//     // Style totals row
//     const totalRowIndex = data.length + 6;
//     header.forEach((_, colIdx) => {
//       const addr = XLSX.utils.encode_cell({ r: totalRowIndex, c: colIdx });
//       if (worksheet[addr]) {
//         worksheet[addr].s = {
//           font: { bold: true, color: { rgb: "000000" } },
//           fill: { patternType: "solid", fgColor: { rgb: "D9D9D9" } },
//           alignment: {
//             horizontal: colIdx === 0 ? "left" : "right",
//             vertical: "center",
//           },
//         };
//       }
//     });

//     // Merge headers (company rows)
//     worksheet["!merges"] = [
//       { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
//       { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
//       { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } },
//       { s: { r: 3, c: 0 }, e: { r: 3, c: header.length - 1 } },
//     ];

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Trial Balance");

//     const buffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//       cellStyles: true,
//     });
//     const blob = new Blob([buffer], { type: "application/octet-stream" });
//     saveAs(blob, "TrialBalance.xlsx");
//   };

//   // Export Month-Wise
//   const exportLedgerMonthwiseFY = () => {
//     if (!allLedgers || allLedgers.length === 0 || !faDataState) return;

//     // Financial Year months: April → March
//     const monthNames = [
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//       "Jan",
//       "Feb",
//       "Mar",
//     ];

//     // Helper: map transaction date to FY month index 0–11
//     const getFYMonthIndex = (date) => (date.getUTCMonth() + 9) % 12;

//     // Step 1: Build ledger → month → amount map from faDataState
//     const ledgerMonthwiseTotals = {}; // { ledgerName: { monthName: amount } }

//     faDataState.forEach((entry) => {
//       entry.transactions.forEach((txn) => {
//         const txnDate = new Date(txn.date);
//         if (ledgerFromDate && txnDate < ledgerFromDate) return;
//         if (ledgerToDate && txnDate > ledgerToDate) return;

//         const acc = txn.account.trim();
//         const monthIndex = getFYMonthIndex(txnDate); // 0–11 FY order
//         const monthKey = monthNames[monthIndex];

//         if (!ledgerMonthwiseTotals[acc]) ledgerMonthwiseTotals[acc] = {};
//         if (!ledgerMonthwiseTotals[acc][monthKey])
//           ledgerMonthwiseTotals[acc][monthKey] = 0;

//         const amount = Number(txn.amount) || 0;
//         ledgerMonthwiseTotals[acc][monthKey] +=
//           txn.type.toLowerCase() === "debit" ? amount : -amount;
//       });
//     });

//     // Step 2: Prepare data rows for Excel
//     const data = allLedgers.map((ledger) => {
//       const acc = ledger.formData.ahead.trim();
//       const row = {
//         "Account Name": ledger.formData.ahead,
//         Destination: ledger.formData.city,
//       };

//       // Fill all FY months
//       monthNames.forEach((month) => {
//         row[month] = ledgerMonthwiseTotals[acc]?.[month] || 0;
//       });

//       // ✅ Add total of all months for this row
//       row["Total"] = monthNames.reduce(
//         (sum, month) => sum + (Number(row[month]) || 0),
//         0,
//       );

//       return row;
//     });

//     // Step 3: TOTAL row
//     const totalRow = { "Account Name": "TOTAL", Destination: "" };
//     monthNames.forEach((month) => {
//       totalRow[month] = data.reduce(
//         (sum, r) => sum + (Number(r[month]) || 0),
//         0,
//       );
//     });
//     totalRow["Total"] = data.reduce(
//       (sum, r) => sum + (Number(r["Total"]) || 0),
//       0,
//     );
//     data.push(totalRow);

//     // Step 4: Build Excel sheet
//     const header = [
//       "Account Name",
//       "Destination",
//       ...monthNames,
//       "Total", // <-- new Total column
//     ];

//     const sheetData = [
//       [companyName || "Company Name"],
//       [companyAdd || "Company Address"],
//       [companyCity || "Company City"],
//       [`TRIAL BALANCE - Financial Year (Apr → Mar)`],
//       [],
//       header,
//       ...data.map((row) => header.map((h) => row[h])),
//     ];

//     const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

//     // Style company rows (bold & center)
//     ["A1", "A2", "A3", "A4"].forEach((cellAddr, idx) => {
//       if (worksheet[cellAddr]) {
//         worksheet[cellAddr].s = {
//           font: {
//             bold: true,
//             sz: idx === 0 ? 16 : 12,
//             color: { rgb: "000000" },
//           },
//           alignment: { horizontal: "center", indent: 25 }, // <-- gives "margin left"
//         };
//       }
//     });

//     // Column widths
//     worksheet["!cols"] = header.map((h) => {
//       if (h === "Account Name") return { wch: 40 }; // wider
//       if (h === "Destination") return { wch: 25 }; // wider
//       return { wch: Math.max(h.length + 5, 12) }; // default
//     });

//     // Merge top header rows
//     worksheet["!merges"] = [
//       { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
//       { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
//       { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } },
//       { s: { r: 3, c: 0 }, e: { r: 3, c: header.length - 1 } },
//     ];

//     // Style headers
//     header.forEach((_, colIdx) => {
//       const addr = XLSX.utils.encode_cell({ r: 5, c: colIdx });
//       if (worksheet[addr]) {
//         worksheet[addr].s = {
//           font: { bold: true, color: { rgb: "FFFFFF" } },
//           fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
//           alignment: { horizontal: "center", vertical: "center" },
//         };
//       }
//     });

//     // Style month cells and Total (Debit = blue, Credit = red)
//     const firstDataRow = 6;
//     const lastDataRow = data.length + 5;
//     [...monthNames, "Total"].forEach((month) => {
//       const colIdx = header.indexOf(month);
//       for (let r = firstDataRow; r <= lastDataRow; r++) {
//         const addr = XLSX.utils.encode_cell({ r, c: colIdx });
//         const cell = worksheet[addr];
//         if (cell && typeof cell.v === "number") {
//           worksheet[addr].s = {
//             font: { color: { rgb: cell.v >= 0 ? "0000FF" : "FF0000" } },
//             alignment: { horizontal: "right" },
//             numFmt: "0.00",
//           };
//         }
//       }
//     });

//     // Style totals row
//     const totalRowIndex = lastDataRow;
//     header.forEach((_, colIdx) => {
//       const addr = XLSX.utils.encode_cell({ r: totalRowIndex, c: colIdx });
//       if (worksheet[addr]) {
//         worksheet[addr].s = {
//           font: { bold: true },
//           fill: { patternType: "solid", fgColor: { rgb: "D9D9D9" } },
//           alignment: { horizontal: colIdx < 2 ? "left" : "right" },
//         };
//       }
//     });

//     // Step 5: Save Excel
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Ledger_FY_Apr_Mar");

//     const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([buffer], { type: "application/octet-stream" });
//     saveAs(blob, "Ledger_FY_Apr_Mar.xlsx");
//   };

//   // Export BsGroup Wise
//   const exportGroupToExcel = () => {
//     const data = groupedLedgersToPick.map((ledger) => {
//       const { balance, drcr } = ledger.totals || {};
//       return {
//         Name: ledger.formData.ahead,
//         City: ledger.formData.city,
//         Qty: ledgerTotals[ledger._id]?.netWeight?.toFixed(3) || "0.000",
//         Pcs: ledgerTotals[ledger._id]?.netPcs?.toFixed(3) || "0.000",
//         Debit: drcr === "DR" ? Math.abs(balance) : 0,
//         Credit: drcr === "CR" ? Math.abs(balance) : 0,
//       };
//     });

//     if (data.length === 0) return;

//     const header = Object.keys(data[0]);

//     // Period
//     const periodFrom = ledgerFromDate ? formatDate(ledgerFromDate) : "--";
//     const periodTo = ledgerToDate ? formatDate(ledgerToDate) : "--";

//     // Build sheet data
//     const sheetData = [
//       [companyName || "Company Name"],
//       [companyAdd || "Company Address"],
//       [companyCity || "Company City"],
//       [`Group Ledger - ${currentGroupName}`],
//       [`Period From: ${periodFrom} To: ${periodTo}`],
//       [],
//       header,
//       ...data.map((row) => header.map((h) => row[h])),
//     ];

//     // Totals row for numeric fields
//     const numericFields = ["Debit", "Credit", "Pcs", "Qty"];
//     const totals = {};
//     header.forEach((h, index) => {
//       if (index === 0) totals[h] = "TOTAL";
//       else if (numericFields.includes(h)) {
//         const colLetter = XLSX.utils.encode_col(index);
//         const firstRow = 7; // data starts at row 7 (0-indexed)
//         const lastRow = 7 + data.length - 1;
//         totals[h] = {
//           f: `SUBTOTAL(9,${colLetter}${firstRow}:${colLetter}${lastRow})`,
//         };
//       } else {
//         totals[h] = "";
//       }
//     });
//     sheetData.push(header.map((h) => totals[h]));

//     const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

//     // Column widths
//     worksheet["!cols"] = [
//       { wch: 40 }, // Name
//       { wch: 20 }, // City
//       { wch: 12 }, // Qty
//       { wch: 12 }, // Pcs
//       { wch: 15 }, // Debit
//       { wch: 15 }, // Credit
//     ];

//     // Style headers
//     header.forEach((_, colIdx) => {
//       const cellAddr = XLSX.utils.encode_cell({ r: 6, c: colIdx });
//       if (worksheet[cellAddr]) {
//         worksheet[cellAddr].s = {
//           font: { bold: true, color: { rgb: "FFFFFF" } },
//           fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
//           alignment: { horizontal: "center", vertical: "center" },
//         };
//       }
//     });

//     // Style company rows
//     ["A1", "A2", "A3", "A4", "A5"].forEach((cell, idx) => {
//       if (worksheet[cell]) {
//         worksheet[cell].s = {
//           font: {
//             bold: true,
//             sz: idx === 0 ? 16 : 12,
//             color: { rgb: "000000" },
//           },
//           alignment: { horizontal: "center" },
//         };
//       }
//     });

//     // Right-align numeric fields
//     numericFields.forEach((field) => {
//       const colIdx = header.indexOf(field);
//       if (colIdx !== -1) {
//         for (let r = 7; r < data.length + 7; r++) {
//           const addr = XLSX.utils.encode_cell({ r, c: colIdx });
//           if (worksheet[addr]) {
//             worksheet[addr].s = {
//               alignment: { horizontal: "right" },
//               numFmt: "0.00",
//             };
//           }
//         }
//       }
//     });

//     // Style totals row
//     const totalRowIndex = data.length + 7;
//     header.forEach((_, colIdx) => {
//       const addr = XLSX.utils.encode_cell({ r: totalRowIndex, c: colIdx });
//       if (worksheet[addr]) {
//         worksheet[addr].s = {
//           font: { bold: true, color: { rgb: "000000" } },
//           fill: { patternType: "solid", fgColor: { rgb: "D9D9D9" } },
//           alignment: {
//             horizontal: colIdx === 0 ? "left" : "right",
//             vertical: "center",
//           },
//         };
//       }
//     });

//     // Merge company rows
//     worksheet["!merges"] = [
//       { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
//       { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
//       { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } },
//       { s: { r: 3, c: 0 }, e: { r: 3, c: header.length - 1 } },
//       { s: { r: 4, c: 0 }, e: { r: 4, c: header.length - 1 } },
//     ];

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Group Ledger");

//     const buffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//       cellStyles: true,
//     });
//     const blob = new Blob([buffer], { type: "application/octet-stream" });
//     saveAs(blob, `${currentGroupName}_Ledger.xlsx`);
//   };

//   // Export Account Statement
//   const exportAccountStatementToExcel = () => {
//     if (!filteredTransactions || filteredTransactions.length === 0) return;

//     // Build transaction data for Excel
//     let balance = 0;
//     const data = filteredTransactions.map((txn) => {
//       if (txn.type.toLowerCase() === "debit") balance += txn.amount;
//       else if (txn.type.toLowerCase() === "credit") balance -= txn.amount;

//       const drcr = balance >= 0 ? "DR" : "CR";

//       return {
//         Date: new Date(txn.date).toLocaleDateString("en-GB"),
//         Type: txn.vtype,
//         Narration: txn.narration,
//         Pcs: txn.pkgs?.toFixed(3) || "0.000",
//         Qty: txn.weight?.toFixed(3) || "0.000",
//         Debit: txn.type.toLowerCase() === "debit" ? txn.amount.toFixed(2) : "",
//         Credit:
//           txn.type.toLowerCase() === "credit" ? txn.amount.toFixed(2) : "",
//         Balance: Math.abs(balance).toFixed(2),
//         "DR/CR": drcr,
//       };
//     });

//     const header = Object.keys(data[0]);

//     // Period
//     const periodFrom = ledgerFromDate ? formatDate(ledgerFromDate) : "--";
//     const periodTo = ledgerToDate ? formatDate(ledgerToDate) : "--";

//     // Build sheet data
//     const sheetData = [
//       [companyName || "Company Name"],
//       [companyAdd || "Company Address"],
//       [companyCity || "Company City"],
//       [`Account Statement - ${selectedLedger?.formData?.ahead || ""}`],
//       [`Period From: ${periodFrom} To: ${periodTo}`],
//       [],
//       header,
//       ...data.map((row) => header.map((h) => row[h])),
//     ];

//     // Add totals row
//     const numericFields = ["Pcs", "Qty", "Debit", "Credit", "Balance"];
//     const totals = {};
//     header.forEach((h, index) => {
//       if (index === 0) totals[h] = "TOTAL";
//       else if (numericFields.includes(h)) {
//         const colLetter = XLSX.utils.encode_col(index);
//         const firstRow = 8;
//         const lastRow = 8 + data.length - 1;
//         totals[h] = {
//           f: `SUBTOTAL(9,${colLetter}${firstRow}:${colLetter}${lastRow})`,
//         };
//       } else totals[h] = "";
//     });
//     sheetData.push(header.map((h) => totals[h]));

//     const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

//     // Column widths
//     worksheet["!cols"] = [
//       { wch: 12 }, // Date
//       { wch: 10 }, // Type
//       { wch: 35 }, // Narration
//       { wch: 10 }, // Pcs
//       { wch: 10 }, // Qty
//       { wch: 15 }, // Debit
//       { wch: 15 }, // Credit
//       { wch: 15 }, // Balance
//       { wch: 8 }, // DR/CR
//     ];

//     // Style header row
//     header.forEach((_, colIdx) => {
//       const addr = XLSX.utils.encode_cell({ r: 6, c: colIdx });
//       if (worksheet[addr]) {
//         worksheet[addr].s = {
//           font: { bold: true, color: { rgb: "FFFFFF" } },
//           fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
//           alignment: { horizontal: "center", vertical: "center" },
//         };
//       }
//     });

//     // Style top rows (company info)
//     ["A1", "A2", "A3", "A4", "A5"].forEach((cell, idx) => {
//       if (worksheet[cell]) {
//         worksheet[cell].s = {
//           font: { bold: true, sz: idx === 0 ? 16 : 12 },
//           alignment: { horizontal: "center" },
//         };
//       }
//     });

//     // Numeric alignment
//     numericFields.concat(["Balance"]).forEach((field) => {
//       const colIdx = header.indexOf(field);
//       if (colIdx !== -1) {
//         for (let r = 7; r < data.length + 7; r++) {
//           const addr = XLSX.utils.encode_cell({ r, c: colIdx });
//           if (worksheet[addr]) {
//             worksheet[addr].s = {
//               alignment: { horizontal: "right" },
//               numFmt: "0.00",
//             };
//           }
//         }
//       }
//     });

//     // Style totals row
//     const totalRowIndex = data.length + 7;
//     header.forEach((_, colIdx) => {
//       const addr = XLSX.utils.encode_cell({ r: totalRowIndex, c: colIdx });
//       if (worksheet[addr]) {
//         worksheet[addr].s = {
//           font: { bold: true },
//           fill: { patternType: "solid", fgColor: { rgb: "D9D9D9" } },
//           alignment: { horizontal: colIdx === 0 ? "left" : "right" },
//         };
//       }
//     });

//     // Merge title and header cells
//     worksheet["!merges"] = [
//       { s: { r: 0, c: 0 }, e: { r: 0, c: header.length - 1 } },
//       { s: { r: 1, c: 0 }, e: { r: 1, c: header.length - 1 } },
//       { s: { r: 2, c: 0 }, e: { r: 2, c: header.length - 1 } },
//       { s: { r: 3, c: 0 }, e: { r: 3, c: header.length - 1 } },
//       { s: { r: 4, c: 0 }, e: { r: 4, c: header.length - 1 } },
//     ];

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Account Statement");

//     const buffer = XLSX.write(workbook, {
//       bookType: "xlsx",
//       type: "array",
//       cellStyles: true,
//     });
//     const blob = new Blob([buffer], { type: "application/octet-stream" });
//     saveAs(blob, `${selectedLedger?.formData?.ahead || "Account"}_COA.xlsx`);
//   };

//   const groupTotals = useMemo(() => {
//     let debit = 0,
//       credit = 0;
//     selectedGroupRows.forEach((index) => {
//       const ledger = groupedLedgersToPick[index];
//       if (ledger?.totals) {
//         const { drcr, balance } = ledger.totals;
//         if (drcr === "DR") debit += Math.abs(balance);
//         else if (drcr === "CR") credit += Math.abs(balance);
//       }
//     });
//     return { debit, credit };
//   }, [selectedGroupRows, groupedLedgersToPick]);

//   // Annexure Wise
//   const [showAnnexureModal, setShowAnnexureModal] = useState(false);
//   const [annexureGroupedData, setAnnexureGroupedData] = useState({});
//   const buildAnnexureData = () => {
//     const grouped = {};

//     filteredLedgers.forEach((ledger) => {
//       const annexure = ledger.formData.Bsgroup || "Others";

//       if (!grouped[annexure]) grouped[annexure] = [];

//       grouped[annexure].push({
//         ...ledger,
//         netPcs: ledgerTotals[ledger._id]?.netPcs || 0,
//         netQty: ledgerTotals[ledger._id]?.netWeight || 0,
//       });
//     });

//     setAnnexureGroupedData(grouped);
//   };

//   const isValidPrefix = (value) => {
//     const lower = value.toLowerCase();

//     return allLedgers.some(
//       (ledger) =>
//         ledger.formData.ahead &&
//         ledger.formData.ahead.toLowerCase().startsWith(lower),
//     );
//   };

//   return (
//     <div style={{ padding: "10px" }}>
//       <Card className="contMain">
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             marginBottom: "10px",
//           }}
//         >
//           {/* Date Filters */}
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               gap: "10px",
//             }}
//           >
//             <div style={{ display: "flex", flexDirection: "row" }}>
//               <span className="textform">
//                 <b>From:</b>
//               </span>
//               <InputMask
//                 mask="99/99/9999"
//                 placeholder="dd/mm/yyyy"
//                 value={ledgerFromDate}
//                 onChange={(e) => setLedgerFromDate(e.target.value)}
//                 className="fDate"
//               />
//             </div>
//             <div style={{ display: "flex", flexDirection: "row" }}>
//               <span className="textform">
//                 <b>To:</b>
//               </span>
//               <InputMask
//                 mask="99/99/9999"
//                 placeholder="dd/mm/yyyy"
//                 value={ledgerToDate}
//                 onChange={(e) => setLedgerToDate(e.target.value)}
//                 className="toDate"
//               />
//             </div>
//           </div>
//           <h3 className="headerTrail">TRAIL BALANCE</h3>
//           <div style={{ display: "flex", flexDirection: "column" }}>
//             <div style={{ display: "flex", flexDirection: "row" }}>
//               <text style={{ fontSize: 20 }} className="textform">
//                 Selected Debit:
//               </text>
//               <input
//                 style={{ marginLeft: 15, color: "darkblue" }}
//                 className="value"
//                 value={selectedDebit.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//                 readOnly
//               />
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "row", marginTop: 10 }}
//             >
//               <text style={{ fontSize: 20 }} className="textform">
//                 Selected Credit:
//               </text>
//               <input
//                 style={{ marginLeft: 7, color: "red" }}
//                 className="value"
//                 value={selectedCredit.toLocaleString(undefined, {
//                   minimumFractionDigits: 2,
//                   maximumFractionDigits: 2,
//                 })}
//                 readOnly
//               />
//             </div>
//           </div>
//         </div>

//         <div className="TableT" ref={tableContainerRef}>
//           <Table size="sm" className="custom-table" hover ref={tableRef}>
//             <thead
//               style={{
//                 position: "sticky",
//                 top: 1,
//                 background: "skyblue",
//                 fontSize: 17,
//                 textAlign: "center",
//               }}
//             >
//               <tr>
//                 <th></th>
//                 <th>NAME</th>
//                 <th>CITY</th>
//                 <th>PCS</th>
//                 <th>QTY</th>
//                 <th>DEBIT</th>
//                 <th>CREDIT</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredLedgers.map((ledger, index) => {
//                 const { balance, drcr } = ledger.totals || {};
//                 return (
//                   <tr
//                     key={ledger._id}
//                     style={{
//                       backgroundColor: flaggedRows.has(index)
//                         ? "red"
//                         : index === selectedIndex
//                           ? "rgb(187, 186, 186)"
//                           : "transparent",
//                       cursor: "pointer",
//                       fontSize: 16,
//                     }}
//                     // onClick={() => openLedgerDetails(ledger)}
//                     onClick={() => {
//                       setSelectedIndex(index);
//                       openLedgerDetails(ledger);
//                     }}
//                     // onMouseEnter={() => setSelectedIndex(index)}
//                   >
//                     <td
//                       style={{ textAlign: "center" }}
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <input
//                         style={{
//                           width: "18px",
//                           height: "18px",
//                           cursor: "pointer",
//                         }}
//                         type="checkbox"
//                         checked={!!checkedRows[ledger._id]}
//                         onChange={() => handleCheckboxChange(ledger._id)}
//                       />
//                     </td>
//                     <td>{ledger.formData.ahead}</td>
//                     <td>{ledger.formData.city}</td>
//                     <td style={{ textAlign: "right" }}>
//                       {ledgerTotals[ledger._id]?.netPcs?.toFixed(3) || "0.000"}
//                     </td>
//                     <td style={{ textAlign: "right" }}>
//                       {ledgerTotals[ledger._id]?.netWeight?.toFixed(3) ||
//                         "0.000"}
//                     </td>
//                     <td
//                       style={{
//                         textAlign: "right",
//                         color: "darkblue",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {drcr === "DR"
//                         ? Math.abs(balance).toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })
//                         : ""}
//                     </td>
//                     <td
//                       style={{
//                         textAlign: "right",
//                         color: "red",
//                         fontWeight: "bold",
//                       }}
//                     >
//                       {drcr === "CR"
//                         ? Math.abs(balance).toLocaleString(undefined, {
//                             minimumFractionDigits: 2,
//                             maximumFractionDigits: 2,
//                           })
//                         : ""}
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>

//             <tfoot
//               style={{
//                 backgroundColor: "skyblue",
//                 position: "sticky",
//                 bottom: 0,
//               }}
//             >
//               <tr style={{ fontWeight: "bold", fontSize: 20 }}>
//                 <td colSpan={3} style={{ textAlign: "right" }}>
//                   TOTAL:
//                 </td>
//                 <td></td>
//                 <td></td>
//                 <td style={{ textAlign: "right", color: "darkblue" }}>
//                   {filteredLedgers
//                     .reduce(
//                       (sum, ledger) =>
//                         sum +
//                         (ledger.totals?.drcr === "DR"
//                           ? Math.abs(ledger.totals.balance)
//                           : 0),
//                       0,
//                     )
//                     .toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                 </td>
//                 <td style={{ textAlign: "right", color: "red" }}>
//                   {filteredLedgers
//                     .reduce(
//                       (sum, ledger) =>
//                         sum +
//                         (ledger.totals?.drcr === "CR"
//                           ? Math.abs(ledger.totals.balance)
//                           : 0),
//                       0,
//                     )
//                     .toLocaleString(undefined, {
//                       minimumFractionDigits: 2,
//                       maximumFractionDigits: 2,
//                     })}
//                 </td>
//               </tr>
//             </tfoot>
//           </Table>
//         </div>

//         {/* ✅ Search Input */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "row",
//             alignItems: "center",
//             marginTop: "auto",
//           }}
//         >
//           <TextField
//             inputRef={searchRef}
//             label="SEARCH"
//             variant="outlined"
//             size="small"
//             value={searchTerm}
//             onChange={(e) => {
//               const val = e.target.value;
//               // ✅ allow clearing
//               if (!val) {
//                 setSearchTerm("");
//                 return;
//               }
//               // ✅ allow only if prefix matches some ledger name
//               if (isValidPrefix(val)) {
//                 setSearchTerm(val);
//               }
//             }}
//             className={styles.Search}
//           />

//           {/* <span style={{fontSize:18,marginRight:"10px"}}>SEARCH : </span>
//           <Form.Control
//             ref={searchRef}
//             className={styles.Search}
//             style={{marginTop:0}}
//             type="text"
//             // placeholder="Search..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           /> */}
//           <div style={{ marginTop: "5px", marginLeft: "auto" }}>
//             <Button
//               className="Buttonz"
//               style={{ backgroundColor: "#3d85c6" }}
//               onClick={openOptionModal}
//             >
//               Options
//             </Button>
//             <OptionModal
//               isOpen={isOptionOpen}
//               onClose={closeOptionModal}
//               exportMonthWise={exportLedgerMonthwiseFY}
//               onApply={(values) => {
//                 setOptionValues(values);
//                 if (values.OrderBy === "Annexure Wise") {
//                   buildAnnexureData();
//                   setShowAnnexureModal(true);
//                 }
//                 // ✅ store date only if Print Current Date checkbox is true
//                 if (values.T3) {
//                   setPrintDateValue(new Date());
//                 } else {
//                   setPrintDateValue(null);
//                 }
//               }}
//             />
//             <AnnexureWiseModal
//               show={showAnnexureModal}
//               onClose={() => setShowAnnexureModal(false)}
//               data={annexureGroupedData}
//               fromDate={formatDate(fromDate)}
//               toDate={formatDate(toDate)}
//             />
//             <Button
//               className="Buttonz"
//               style={{ backgroundColor: "#3d85c6" }}
//               onClick={handleOpen}
//             >
//               Print
//             </Button>
//             <PrintTrail
//               items={filteredLedgers.map((ledger) => {
//                 const { balance, drcr } = ledger.totals || {};
//                 return {
//                   name: ledger.formData.ahead,
//                   city: ledger.formData.city,
//                   netPcs:
//                     ledgerTotals[ledger._id]?.netPcs?.toFixed(3) || "0.000", // ✅ added
//                   netWeight:
//                     ledgerTotals[ledger._id]?.netWeight?.toFixed(3) || "0.000", // ✅ added
//                   debit: drcr === "DR" ? Math.abs(balance) : 0,
//                   credit: drcr === "CR" ? Math.abs(balance) : 0,
//                 };
//               })}
//               isOpen={open}
//               handleClose={handleClose}
//               ledgerFrom={ledgerFromDate}
//               ledgerTo={ledgerToDate}
//               currentDate={printDateValue} // ✅ pass actual date
//               handleExport={exportToExcel}
//             />
//             {/* <Button className="Buttonz" style={{backgroundColor:'#3d85c6'}}  onClick={exportToExcel}>Export </Button> */}
//             <Button className="Buttonz" style={{ backgroundColor: "#3d85c6" }}>
//               Exit
//             </Button>
//           </div>
//         </div>
//       </Card>
//       {/* ... Modal Account Statement ... */}
//       <Modal
//         show={showModal}
//         onHide={() => {
//           setShowModal(false);
//           setActiveRowIndex(0); // ✅ reset highlight when closing modal manually
//         }}
//         className="custom-modal"
//         style={{ marginTop: 20 }}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             ACCOUNT STATEMENT
//             {/* Ledger Details - {selectedLedger?.formData?.ahead} */}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedLedger && (
//             <div>
//               <div
//                 style={{
//                   display: "flex",
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <p>
//                   <span style={{ fontSize: 17 }}>
//                     <b>Code:</b> {selectedLedger.formData.acode} <br />
//                   </span>
//                   <span style={{ fontSize: 17 }}>
//                     <b>GST No:</b> {selectedLedger.formData.gstNo} <br />
//                   </span>
//                   <span style={{ fontSize: 17 }}>
//                     <b>PAN:</b> {selectedLedger.formData.pan} <br />
//                   </span>
//                   <span style={{ fontSize: 17 }}>
//                     <b>Phone:</b> {selectedLedger.formData.phone} <br />
//                   </span>
//                   <span style={{ fontSize: 17 }}>
//                     <b>Email:</b> {selectedLedger.formData.email} <br />
//                   </span>
//                 </p>
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     textAlign: "center",
//                   }}
//                 >
//                   <b style={{ fontSize: 20 }}>
//                     {selectedLedger.formData.ahead}{" "}
//                   </b>
//                   <b style={{ fontSize: 20 }}>
//                     {selectedLedger.formData.add1}{" "}
//                   </b>
//                   <b style={{ fontSize: 20 }}>
//                     {selectedLedger.formData.city}{" "}
//                   </b>
//                   {/* ✅ Closing Balance Display */}
//                   {transactions.length > 0 && (
//                     <div style={{ fontSize: "20px" }}>
//                       {(() => {
//                         let balance = 0;
//                         transactions.forEach((txn) => {
//                           if (txn.type.toLowerCase() === "debit") {
//                             balance += txn.amount;
//                           } else if (txn.type.toLowerCase() === "credit") {
//                             balance -= txn.amount;
//                           }
//                         });
//                         const drcr = balance >= 0 ? "DR" : "CR";
//                         const color = drcr === "DR" ? "darkblue" : "red";
//                         return (
//                           <b style={{ color }}>
//                             Balance Rs: {Math.abs(balance).toFixed(2)} {drcr}
//                           </b>
//                         );
//                       })()}
//                     </div>
//                   )}
//                 </div>
//                 <div
//                   style={{
//                     display: "flex",
//                     flexDirection: "column",
//                     textAlign: "center",
//                   }}
//                 >
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "row",
//                       alignItems: "center",
//                     }}
//                   >
//                     <b style={{ fontSize: 16, marginRight: "14px" }}>
//                       Progressive DR
//                     </b>
//                     <TextField
//                       className="custom-bordered-input"
//                       size="small"
//                       value={progressiveDebit.toFixed(2)} // ✅ show progressive debit
//                       inputProps={{
//                         maxLength: 48,
//                         style: { height: "10px", width: "206px" },
//                       }}
//                     />
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "row",
//                       alignItems: "center",
//                     }}
//                   >
//                     <b style={{ fontSize: 16, marginRight: "14px" }}>
//                       Progressive CR
//                     </b>
//                     <TextField
//                       className="custom-bordered-input"
//                       size="small"
//                       value={progressiveCredit.toFixed(2)} // ✅ show progressive credit
//                       inputProps={{
//                         maxLength: 48,
//                         style: { height: "10px", width: "206px" },
//                       }}
//                     />
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "row",
//                       alignItems: "center",
//                     }}
//                   >
//                     <b style={{ fontSize: 16, marginRight: "10px" }}>
//                       Progressive Qty
//                     </b>
//                     <TextField
//                       className="custom-bordered-input"
//                       size="small"
//                       inputProps={{
//                         maxLength: 48,
//                         style: {
//                           height: "10px",
//                           width: "206px",
//                         },
//                       }}
//                     />
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       flexDirection: "row",
//                       alignItems: "center",
//                       marginTop: 5,
//                     }}
//                   >
//                     <b style={{ fontSize: 16, marginRight: "77px" }}>Period</b>
//                     <TextField
//                       className="custom-bordered-input"
//                       size="small"
//                       value={formatDate(fromDate)} // 👈 formatted here
//                       inputProps={{
//                         maxLength: 48,
//                         style: {
//                           height: "10px",
//                           width: "90px",
//                         },
//                       }}
//                     />
//                     <TextField
//                       className="custom-bordered-input"
//                       size="small"
//                       value={formatDate(toDate)} // 👈 formatted here
//                       inputProps={{
//                         maxLength: 48,
//                         style: {
//                           height: "10px",
//                           width: "90px",
//                         },
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className={styles.tableHeight} ref={txnContainerRef}>
//                 <Table size="sm" className="custom-table">
//                   <thead
//                     style={{
//                       position: "sticky",
//                       top: -1,
//                       background: "skyblue",
//                       fontSize: 17,
//                       textAlign: "center",
//                       zIndex: 2,
//                     }}
//                   >
//                     <tr>
//                       <th>
//                         <input
//                           type="checkbox"
//                           onChange={(e) => {
//                             const checked = e.target.checked;
//                             const newSelections = {};
//                             filteredTransactions.forEach((txn) => {
//                               newSelections[txn._id] = checked;
//                             });
//                             setSelectedRows(newSelections);
//                           }}
//                           checked={
//                             filteredTransactions.length > 0 &&
//                             filteredTransactions.every(
//                               (txn) => selectedRows[txn._id],
//                             )
//                           }
//                         />
//                       </th>
//                       <th>Date</th>
//                       <th>Type</th>
//                       <th>Narration</th>
//                       <th>Pcs</th>
//                       <th>Qty</th>
//                       <th>Debit</th>
//                       <th>Credit</th>
//                       <th>Balance</th>
//                       <th>DR/CR</th>
//                     </tr>
//                   </thead>

//                   <tbody>
//                     {transactions.length > 0 ? (
//                       (() => {
//                         let balance = 0;
//                         let totalDebit = 0;
//                         let totalCredit = 0;

//                         return filteredTransactions.map((txn, index) => {
//                           if (txn.type.toLowerCase() === "debit") {
//                             balance += txn.amount;
//                             totalDebit += txn.amount;
//                           } else if (txn.type.toLowerCase() === "credit") {
//                             balance -= txn.amount;
//                             totalCredit += txn.amount;
//                           }

//                           const drcr = balance >= 0 ? "DR" : "CR";
//                           const color = drcr === "DR" ? "darkblue" : "red";

//                           return (
//                             <tr
//                               key={txn._id}
//                               ref={(el) => (rowRefs.current[index] = el)}
//                               style={{
//                                 fontWeight: "bold",
//                                 fontSize: 16,
//                                 backgroundColor:
//                                   index === activeRowIndex
//                                     ? "rgb(187, 186, 186)"
//                                     : "transparent",
//                                 cursor: "pointer",
//                               }}
//                               onClick={() => {
//                                 setActiveRowIndex(index);
//                                 handleTransactionSelect(txn);
//                               }}
//                             >
//                               <td
//                                 style={{ textAlign: "center" }}
//                                 onClick={(e) => e.stopPropagation()}
//                               >
//                                 <input
//                                   type="checkbox"
//                                   checked={!!selectedRows[txn._id]}
//                                   onChange={() =>
//                                     handleRowCheckboxChange(txn._id)
//                                   }
//                                   style={{
//                                     transform: "scale(1.3)",
//                                     cursor: "pointer",
//                                   }}
//                                 />
//                               </td>
//                               <td>
//                                 {new Date(txn.date).toLocaleDateString("en-GB")}
//                               </td>
//                               <td style={{ textAlign: "center" }}>
//                                 {txn.vtype}
//                               </td>
//                               <td>{txn.narration}</td>
//                               <td style={{ textAlign: "right" }}>{txn.pkgs}</td>
//                               <td style={{ textAlign: "right" }}>
//                                 {txn.weight}
//                               </td>
//                               <td
//                                 style={{
//                                   textAlign: "right",
//                                   color: "darkblue",
//                                 }}
//                               >
//                                 {txn.type.toLowerCase() === "debit"
//                                   ? txn.amount.toFixed(2)
//                                   : ""}
//                               </td>
//                               <td style={{ textAlign: "right", color: "red" }}>
//                                 {txn.type.toLowerCase() === "credit"
//                                   ? txn.amount.toFixed(2)
//                                   : ""}
//                               </td>
//                               <td style={{ textAlign: "right", color }}>
//                                 {Math.abs(balance).toFixed(2)}
//                               </td>
//                               <td
//                                 style={{
//                                   textAlign: "center",
//                                   fontWeight: "bold",
//                                   color,
//                                 }}
//                               >
//                                 {drcr}
//                               </td>
//                             </tr>
//                           );
//                         });
//                       })()
//                     ) : (
//                       <tr>
//                         <td colSpan={10} className="text-center">
//                           No transactions found
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>

//                   {/* ✅ Proper footer row */}
//                   {transactions.length > 0 &&
//                     (() => {
//                       let totalDebit = 0;
//                       let totalCredit = 0;
//                       let balance = 0;
//                       let netWeight = 0;
//                       let netPcs = 0;

//                       filteredTransactions.forEach((txn) => {
//                         const weight = txn.weight || 0;
//                         const pcs = txn.pkgs || 0;

//                         if (txn.type.toLowerCase() === "debit") {
//                           balance += txn.amount;
//                           totalDebit += txn.amount;

//                           netWeight += weight; // ✅ debit positive
//                           netPcs += pcs; // ✅ debit positive
//                         } else if (txn.type.toLowerCase() === "credit") {
//                           balance -= txn.amount;
//                           totalCredit += txn.amount;

//                           netWeight -= weight; // ✅ credit negative
//                           netPcs -= pcs; // ✅ credit negative
//                         }
//                       });

//                       const drcrFinal = balance >= 0 ? "DR" : "CR";
//                       const colorFinal =
//                         drcrFinal === "DR" ? "darkblue" : "red";

//                       return (
//                         <tfoot>
//                           <tr
//                             style={{
//                               position: "sticky",
//                               bottom: -1,
//                               background: "skyblue",
//                               fontWeight: "bold",
//                               fontSize: 16,
//                             }}
//                           >
//                             <td colSpan={4} style={{ textAlign: "center" }}>
//                               Totals
//                             </td>
//                             <td style={{ textAlign: "right" }}>
//                               {netPcs.toFixed(3)}
//                             </td>
//                             {/* ✅ Net weight (sale in minus, purchase in plus) */}
//                             <td style={{ textAlign: "right" }}>
//                               {netWeight.toFixed(3)}
//                             </td>
//                             <td
//                               style={{ textAlign: "right", color: "darkblue" }}
//                             >
//                               {totalDebit.toFixed(2)}
//                             </td>
//                             <td style={{ textAlign: "right", color: "red" }}>
//                               {totalCredit.toFixed(2)}
//                             </td>
//                             <td
//                               style={{ textAlign: "right", color: colorFinal }}
//                             >
//                               {Math.abs(balance).toFixed(2)}
//                             </td>
//                             <td
//                               style={{ textAlign: "center", color: colorFinal }}
//                             >
//                               {drcrFinal}
//                             </td>
//                           </tr>
//                         </tfoot>
//                       );
//                     })()}
//                 </Table>
//               </div>
//               <div className="d-flex justify-content-between mt-2">
//                 <div>
//                   <Button
//                     className="Buttonz"
//                     variant="secondary"
//                     onClick={() => setShowOptions(true)}
//                   >
//                     Options
//                   </Button>{" "}
//                   {/* <Button className="Buttonz"  variant="secondary" onClick={exportAccountStatementToExcel}>Export</Button>{" "} */}
//                   <Button
//                     className="Buttonz"
//                     variant="secondary"
//                     onClick={() => setIsPrintOpen(true)}
//                   >
//                     Print
//                   </Button>{" "}
//                   <CoA
//                     isOpen={isPrintOpen}
//                     handleClose={() => setIsPrintOpen(false)}
//                     filteredTransactions={filteredTransactions}
//                     selectedLedger={selectedLedger}
//                     ledgerFrom={ledgerFromDate}
//                     ledgerTo={ledgerToDate}
//                     currentDate={printDateValue} // ✅ pass actual date
//                     handleExport={exportAccountStatementToExcel}
//                   />
//                   <Button
//                     className="Buttonz"
//                     variant="secondary"
//                     onClick={() => setShowModal(false)}
//                   >
//                     Exit
//                   </Button>{" "}
//                 </div>
//               </div>
//             </div>
//           )}
//         </Modal.Body>
//       </Modal>

//       {/* Option Account Statement */}
//       <Modal
//         style={{ zIndex: 100000 }}
//         show={showOptions}
//         onHide={() => setShowOptions(false)}
//         centered
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Filter Transactions</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               alignItems: "center",
//             }}
//           >
//             <div style={{ display: "flex", flexDirection: "column" }}>
//               <Form.Group>
//                 <Form.Label>From Date</Form.Label>
//                 <DatePicker
//                   selected={fromDate}
//                   onChange={(date) => setFromDate(date)} // ✅ FIXED
//                   onChangeRaw={(e) => {
//                     if (!e?.target?.value) return; // ✅ Prevent crash when value is undefined

//                     let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
//                     if (val.length > 2)
//                       val = val.slice(0, 2) + "/" + val.slice(2);
//                     if (val.length > 5)
//                       val = val.slice(0, 5) + "/" + val.slice(5, 9);

//                     e.target.value = val; // Show formatted input
//                   }}
//                   dateFormat="dd/MM/yyyy"
//                   className={styles.from}
//                 />
//               </Form.Group>

//               <Form.Group className="mb-3">
//                 <Form.Label>Upto Date</Form.Label>
//                 <DatePicker
//                   selected={toDate}
//                   onChange={(date) => setToDate(date)} // ✅ FIXED
//                   onChangeRaw={(e) => {
//                     if (!e?.target?.value) return; // ✅ Prevent crash when value is undefined

//                     let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
//                     if (val.length > 2)
//                       val = val.slice(0, 2) + "/" + val.slice(2);
//                     if (val.length > 5)
//                       val = val.slice(0, 5) + "/" + val.slice(5, 9);

//                     e.target.value = val; // Show formatted input
//                   }}
//                   dateFormat="dd/MM/yyyy"
//                   className={styles.to}
//                 />
//               </Form.Group>

//               {/* Debit / Credit Select */}
//               <Form.Group>
//                 <Form.Label>Select Type</Form.Label>
//                 <Form.Select
//                   className={styles.tType}
//                   value={filterType}
//                   onChange={(e) => setFilterType(e.target.value)}
//                 >
//                   <option value="All">All</option>
//                   <option value="Debit">Debit</option>
//                   <option value="Credit">Credit</option>
//                 </Form.Select>
//               </Form.Group>

//               <div style={{ display: "flex", flexDirection: "row" }}>
//                 <Form.Label style={{ marginTop: 5 }}>Narration</Form.Label>
//                 <input
//                   className={styles.nar}
//                   type="text"
//                   value={narrationFilter}
//                   onChange={(e) => setNarrationFilter(e.target.value)}
//                 />
//               </div>

//               <Form.Group>
//                 <Form.Label>Filter</Form.Label>
//                 <Form.Select
//                   className="filterselect"
//                   value={selectionFilter}
//                   onChange={(e) => setSelectionFilter(e.target.value)}
//                 >
//                   <option value="All">All</option>
//                   <option value="Selected">Selected</option>
//                   <option value="Unselected">Unselected</option>
//                 </Form.Select>
//               </Form.Group>
//             </div>

//             <div
//               style={{
//                 display: "flex",
//                 flexDirection: "column",
//                 marginLeft: "50px",
//               }}
//             >
//               <b style={{ fontSize: 18, marginBottom: "10px" }}>Vouchers</b>
//               <Form.Check
//                 type="checkbox"
//                 label="Cash"
//                 name="cash"
//                 checked={vtypeFilters.cash}
//                 onChange={handleVtypeChange}
//                 style={{ transform: "scale(1.2)", marginRight: "8px" }}
//               />
//               <Form.Check
//                 type="checkbox"
//                 label="Journal"
//                 name="journal"
//                 checked={vtypeFilters.journal}
//                 onChange={handleVtypeChange}
//                 style={{ transform: "scale(1.2)", marginRight: "8px" }}
//               />
//               <Form.Check
//                 type="checkbox"
//                 label="Bank"
//                 name="bank"
//                 checked={vtypeFilters.bank}
//                 onChange={handleVtypeChange}
//                 style={{ transform: "scale(1.2)", marginRight: "8px" }}
//               />
//               <Form.Check
//                 type="checkbox"
//                 label="Sale"
//                 name="sale"
//                 checked={vtypeFilters.sale}
//                 onChange={handleVtypeChange}
//                 style={{ transform: "scale(1.2)", marginRight: "8px" }}
//               />
//               <Form.Check
//                 type="checkbox"
//                 label="Purchase"
//                 name="purchase"
//                 checked={vtypeFilters.purchase}
//                 onChange={handleVtypeChange}
//                 style={{ transform: "scale(1.2)", marginRight: "8px" }}
//               />
//               <Form.Check
//                 type="checkbox"
//                 label="TDS"
//                 name="tds"
//                 checked={vtypeFilters.tds}
//                 onChange={handleVtypeChange}
//                 style={{ transform: "scale(1.2)", marginRight: "8px" }}
//               />
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button
//             className="Buttonz"
//             variant="secondary"
//             onClick={() => setShowOptions(false)}
//           >
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* BsGroup Listing */}
//       <Modal
//         show={showGroupModal}
//         onHide={() => setShowGroupModal(false)}
//         centered
//         className="custom-modal"
//         backdrop="static" // 👈 prevents closing when clicking outside
//         style={{ marginTop: 20 }}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {" "}
//             <span style={{ color: "darkblue" }}>{currentGroupName}</span>{" "}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
//           <div
//             style={{
//               display: "flex",
//               flexDirection: "row",
//               justifyContent: "space-between",
//               marginBottom: 10,
//             }}
//           >
//             <div
//               style={{ display: "flex", flexDirection: "column", marginTop: 5 }}
//             >
//               <div style={{ display: "flex", flexDirection: "row" }}>
//                 <b style={{ fontSize: 16, marginRight: "10px" }}>Period From</b>
//                 <TextField
//                   className="custom-bordered-input"
//                   size="small"
//                   value={formatDate(fromDate)} // 👈 formatted here
//                   inputProps={{
//                     maxLength: 48,
//                     style: {
//                       height: "10px",
//                       width: "120px",
//                     },
//                   }}
//                 />
//               </div>
//               <div
//                 style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//               >
//                 <b style={{ fontSize: 16, marginRight: "61px" }}>UpTo</b>
//                 <TextField
//                   className="custom-bordered-input"
//                   size="small"
//                   value={formatDate(toDate)} // 👈 formatted here
//                   inputProps={{
//                     maxLength: 48,
//                     style: {
//                       height: "10px",
//                       width: "120px",
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//             <div
//               style={{ display: "flex", flexDirection: "column", marginTop: 5 }}
//             >
//               <div style={{ display: "flex", flexDirection: "row" }}>
//                 <b style={{ fontSize: 16, marginRight: "16px" }}>
//                   Selected Debit
//                 </b>
//                 <TextField
//                   className="custom-bordered-input"
//                   size="small"
//                   value={groupTotals.debit.toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })} // 👈 formatted here
//                   inputProps={{
//                     maxLength: 48,
//                     style: {
//                       height: "10px",
//                       width: "150px",
//                     },
//                   }}
//                 />
//               </div>
//               <div
//                 style={{ display: "flex", flexDirection: "row", marginTop: 5 }}
//               >
//                 <b style={{ fontSize: 16, marginRight: "10px" }}>
//                   Selected Credit
//                 </b>
//                 <TextField
//                   className="custom-bordered-input"
//                   size="small"
//                   value={groupTotals.credit.toLocaleString(undefined, {
//                     minimumFractionDigits: 2,
//                     maximumFractionDigits: 2,
//                   })} // 👈 formatted here
//                   inputProps={{
//                     maxLength: 48,
//                     style: {
//                       height: "10px",
//                       width: "150px",
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className={styles.tableHeight}>
//             <Table size="sm" className="custom-table">
//               <thead
//                 style={{
//                   position: "sticky",
//                   top: 0,
//                   background: "skyblue",
//                   fontSize: 17,
//                   textAlign: "center",
//                   zIndex: 2,
//                 }}
//               >
//                 <tr>
//                   <th>
//                     <input
//                       type="checkbox"
//                       checked={
//                         selectedGroupRows.size === groupedLedgersToPick.length
//                       }
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedGroupRows(
//                             new Set(groupedLedgersToPick.map((_, i) => i)),
//                           );
//                         } else {
//                           setSelectedGroupRows(new Set());
//                         }
//                       }}
//                       style={{ transform: "scale(1.2)", cursor: "pointer" }}
//                     />
//                   </th>
//                   <th>NAME</th>
//                   <th>CITY</th>
//                   <th>QTY</th>
//                   <th>PCS</th>
//                   <th>DEBIT</th>
//                   <th>CREDIT</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {groupedLedgersToPick.map((ledger, index) => {
//                   const { balance, drcr } = ledger.totals || {};
//                   return (
//                     <tr
//                       key={ledger._id}
//                       ref={(el) => (groupRowRefs.current[index] = el)}
//                       style={{
//                         cursor: "pointer",
//                         backgroundColor:
//                           index === activeGroupIndex
//                             ? "rgb(187,186,186)"
//                             : "transparent",
//                       }}
//                       onMouseEnter={() => setActiveGroupIndex(index)}
//                       onClick={() => {
//                         // setShowGroupModal(false);
//                         fetchLedgerTransactions(ledger);
//                       }}
//                     >
//                       <td
//                         style={{ textAlign: "center" }}
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <input
//                           type="checkbox"
//                           checked={selectedGroupRows.has(index)}
//                           onChange={() => {
//                             setSelectedGroupRows((prev) => {
//                               const newSet = new Set(prev);
//                               if (newSet.has(index)) newSet.delete(index);
//                               else newSet.add(index);
//                               return newSet;
//                             });
//                           }}
//                           style={{ transform: "scale(1.2)", cursor: "pointer" }}
//                         />
//                       </td>
//                       <td>{ledger.formData.ahead}</td>
//                       <td>{ledger.formData.city}</td>
//                       <td style={{ textAlign: "right" }}>
//                         {" "}
//                         {ledgerTotals[ledger._id]?.netWeight?.toFixed(3) ||
//                           "0.000"}
//                       </td>
//                       <td style={{ textAlign: "right" }}>
//                         {" "}
//                         {ledgerTotals[ledger._id]?.netPcs?.toFixed(3) ||
//                           "0.000"}
//                       </td>
//                       <td
//                         style={{
//                           textAlign: "right",
//                           color: "darkblue",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {drcr === "DR"
//                           ? Math.abs(balance).toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             })
//                           : ""}
//                       </td>
//                       <td
//                         style={{
//                           textAlign: "right",
//                           color: "red",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {drcr === "CR"
//                           ? Math.abs(balance).toLocaleString(undefined, {
//                               minimumFractionDigits: 2,
//                               maximumFractionDigits: 2,
//                             })
//                           : ""}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </Table>
//           </div>

//           <div style={{ display: "flex", flexDirection: "row" }}>
//             <Button
//               className="Buttonz"
//               style={{ marginRight: "10px" }}
//               onClick={handleOpen}
//             >
//               Print
//             </Button>
//             <PrintTrail
//               items={groupedLedgersToPick.map((ledger) => {
//                 const { balance, drcr } = ledger.totals || {};
//                 return {
//                   name: ledger.formData.ahead,
//                   city: ledger.formData.city,
//                   netPcs:
//                     ledgerTotals[ledger._id]?.netPcs?.toFixed(3) || "0.000", // ✅ added
//                   netWeight:
//                     ledgerTotals[ledger._id]?.netWeight?.toFixed(3) || "0.000", // ✅ added
//                   debit: drcr === "DR" ? Math.abs(balance) : 0,
//                   credit: drcr === "CR" ? Math.abs(balance) : 0,
//                 };
//               })}
//               isOpen={open}
//               handleClose={handleClose}
//               ledgerFrom={ledgerFromDate}
//               ledgerTo={ledgerToDate}
//               currentDate={printDateValue} // ✅ pass actual date
//               currentGroupName={currentGroupName}
//               handleExport={exportGroupToExcel}
//             />
//             {/* <Button className="Buttonz" style={{marginRight:"10px"}} onClick={exportGroupToExcel}>Export</Button> */}
//             <Button
//               className="Buttonz"
//               variant="secondary"
//               onClick={() => setShowGroupModal(false)}
//             >
//               Close
//             </Button>
//           </div>
//         </Modal.Body>
//       </Modal>
//     </div>
//   );
// };

// export default TrailBalance;
