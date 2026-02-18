import React, { useState, useEffect, useRef } from "react";
import "./BankBook.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from "react-bootstrap/Table";
import axios from "axios";
import useCompanySetup from "../../Shared/useCompanySetup";
import { useNavigate } from "react-router-dom";
import BankBookPrint from "./BankBookPrint";
import { Button, Modal, Form } from "react-bootstrap";
import financialYear from "../../Shared/financialYear";

const BankBook = () => {

  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  const rowRefs = useRef([]);
  const navigate = useNavigate();
  const { dateFrom } = useCompanySetup();
  const [bankData, setBankData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(() => new Date());
  const [selectedRow, setSelectedRow] = useState(0);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSplitByDate, setIsSplitByDate] = useState(false);

  // ✅ For More Modal
  const [isMoreModalOpen, setIsMoreModalOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [filterType, setFilterType] = useState(""); // "payment" | "receipt" | ""
  const [anexureList, setAnexureList] = useState([]);
  const [selectedAnexure, setSelectedAnexure] = useState("");

  // Fetch Anexure data
  useEffect(() => {
    const fetchAnexure = async () => {
      try {
        const res = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/anexure`
        );
        setAnexureList(res.data);
      } catch (err) {
        console.error("Error fetching anexure data", err);
      }
    };
    fetchAnexure();
  }, []);

  // Auto-set financial year when component loads
  useEffect(() => {
    const fy = financialYear.getFYDates();
    setStartDate(fy.start);
    setEndDate(fy.end);
  }, []);

  // ✅ Fetch API data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/bank`
        );
        setBankData(res.data);
        setFilteredData(res.data); // default show all
      } catch (err) {
        console.error("Error fetching bank data", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Filter when dates / bank / filterType / anexure change
  useEffect(() => {
    let data = [...bankData];

    // Date filter
    if (startDate && endDate) {
      data = data.filter((entry) => {
        const entryDate = parseDateUniversal(entry.formData.date);
        const start = parseDateUniversal(startDate);
        const end = parseDateUniversal(endDate);

        if (!entryDate || !start || !end) return false;

        return entryDate >= start && entryDate <= end;
      });
    }

    // Bank filter
    if (selectedBank) {
      data = data.filter(
        (entry) =>
          entry.bankdetails[0]?.Bankname?.toLowerCase() ===
          selectedBank.toLowerCase()
      );
    }

    // Payment / Receipt filter
    if (filterType === "payment") {
      data = data.filter((entry) => Number(entry.formData.totalpayment) > 0);
    } else if (filterType === "receipt") {
      data = data.filter((entry) => Number(entry.formData.totalreceipt) > 0);
    }

    // ✅ Anexure filter (match bsGroup with dropdown selection)
    if (selectedAnexure) {
      data = data.filter(
        (entry) =>
          entry.items[0]?.bsGroup &&
          entry.items[0]?.bsGroup.toLowerCase() === selectedAnexure.toLowerCase()
      );
    }

    setFilteredData(data);
  }, [startDate, endDate, bankData, selectedBank, filterType, selectedAnexure]);

  // useEffect(() => {
  //   let data = [...bankData];

  //   // Date filter
  //   if (startDate && endDate) {
  //     data = data.filter((entry) => {
  //       const entryDate = new Date(entry.formData.date);
  //       return entryDate >= startDate && entryDate <= endDate;
  //     });
  //   }

  //   // Bank filter
  //   if (selectedBank) {
  //     data = data.filter(
  //       (entry) =>
  //         entry.bankdetails[0]?.Bankname?.toLowerCase() ===
  //         selectedBank.toLowerCase()
  //     );
  //   }

  //   // Payment / Receipt filter
  //   if (filterType === "payment") {
  //     data = data.filter((entry) => Number(entry.formData.totalpayment) > 0);
  //   } else if (filterType === "receipt") {
  //     data = data.filter((entry) => Number(entry.formData.totalreceipt) > 0);
  //   }

  //   setFilteredData(data);
  // }, [startDate, endDate, bankData, selectedBank, filterType]);

  // ✅ Keyboard navigation + Enter key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        setSelectedRow((prev) =>
          prev < filteredData.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        setSelectedRow((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
        const entry = filteredData[selectedRow];
        if (entry) {
          navigate("/bankvoucher", {
            state: { bankId: entry._id, rowIndex: selectedRow },
          });
          localStorage.setItem("selectedRowIndexBank", selectedRow);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredData, selectedRow, navigate]);

  // ✅ Restore selected row index if coming back
  useEffect(() => {
    const savedIndex = localStorage.getItem("selectedRowIndexBank");
    if (savedIndex !== null) {
      setSelectedRow(parseInt(savedIndex, 10));
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

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // ✅ Get unique bank names
  const uniqueBanks = [
    ...new Set(
      bankData.map((entry) => entry.bankdetails[0]?.Bankname).filter(Boolean)
    ),
  ];

  return (
    <div style={{ padding: "10px" }}>
      <h3 className="bank-title">📒 BANK BOOK</h3>

      {/* Date Filters */}
      <div className="date-filter">
        <div className="date-inputs">
          <div>
            <span className="date-label">From:</span>
            <DatePicker
              className="datepickerBank"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <span className="date-label">To:</span>
            <DatePicker
              className="datepickerBank2"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
             dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
        <Button
          variant="success"
          className="btn-3d"
          onClick={() => setIsPrintModalOpen(true)}
        >
          Print 🖨️
        </Button>
        <Button
          className="btn-3d"
          variant="info"
          style={{ marginLeft: 10, background: "blue" }}
          onClick={() => setIsMoreModalOpen(true)}
        >
          More
        </Button>
      </div>

      {/* Table */}
      <div style={{ maxHeight: 550, overflowY: "auto", outline: "none" }}>
        <Table className="custom-table">
          <thead
            style={{
              backgroundColor: "skyblue",
              position: "sticky",
              top: -6,
              textAlign: "center",
              fontSize: "18px",
            }}
          >
            <tr>
              <th>Date</th>
              <th>Voucher No</th>
              <th>Account Name</th>
              <th>Payment</th>
              <th>Receipt</th>
              <th>Discount</th>
              <th>Bank Charges</th>
              <th>Cheque No</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((entry, index) => (
                <tr
                  key={entry._id}
                  ref={(el) => (rowRefs.current[index] = el)}
                  className={selectedRow === index ? "highlight-row" : ""}
                  style={{ fontSize: 16 }}
                  onMouseEnter={() => setSelectedRow(index)}
                  onClick={() => {
                    navigate("/bankvoucher", {
                      state: { bankId: entry._id, rowIndex: selectedRow },
                    });
                    localStorage.setItem("selectedRowIndexBank", selectedRow);
                  }}
                >
                  <td>{formatDate(entry.formData.date)}</td>
                  <td>{entry.formData.voucherno}</td>
                  <td>{entry.items[0]?.accountname}</td>
                  <td style={{ textAlign: "right" }}>
                    {entry.formData.totalpayment}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {entry.formData.totalreceipt}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {entry.formData.totaldiscount}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {entry.formData.totalbankcharges}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {entry.items[0]?.chqnoBank}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Print Modal */}
      <BankBookPrint
        isOpen={isPrintModalOpen}
        handleClose={() => setIsPrintModalOpen(false)}
        filteredData={filteredData}
        fromDate={startDate}
        uptoDate={endDate}
        splitByDate={isSplitByDate}
      />

      {/* More Modal */}
      <Modal
        show={isMoreModalOpen}
        onHide={() => setIsMoreModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>🔍 Advanced Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label style={{fontSize:17}}>Bank Name</Form.Label>
            <Form.Select
             className="bank"
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
            >
              <option value="">-- All Banks --</option>
              {uniqueBanks.map((bank, idx) => (
                <option key={idx} value={bank}>
                  {bank}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{fontSize:17}}>Filter</Form.Label>
            <Form.Select
            className="filter"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">-- All --</option>
              <option value="payment"> Payment </option>
              <option value="receipt"> Receipt </option>
            </Form.Select>
          </Form.Group>
          <Form.Group>
            <Form.Label style={{fontSize:17}}>Select Anexure</Form.Label>
            <Form.Select
            className="annexure"
              value={selectedAnexure}
              onChange={(e) => setSelectedAnexure(e.target.value)}
            >
              <option value="">-- All --</option>
              {anexureList.map((item) => (
                <option key={item._id} value={item.formData.name}>
                  {item.formData.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsMoreModalOpen(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BankBook;

export const parseDateUniversal = (input) => {
  if (!input) return null;

  if (input instanceof Date) {
    return isNaN(input) ? null : input;
  }

  if (typeof input === "number") {
    const date = new Date(input);
    return isNaN(date) ? null : date;
  }

  if (typeof input !== "string") return null;

  const value = input.trim();

  // Try native parsing (ISO, yyyy-mm-dd)
  const native = new Date(value);
  if (!isNaN(native)) return native;

  // dd-mm-yyyy OR dd/mm/yyyy
  const dmy = value.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
  if (dmy) {
    const [, day, month, year] = dmy;
    return new Date(year, month - 1, day);
  }

  // yyyy-mm-dd OR yyyy/mm/dd
  const ymd = value.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
  if (ymd) {
    const [, year, month, day] = ymd;
    return new Date(year, month - 1, day);
  }

  return null;
};
