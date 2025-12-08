import React, { useState, useEffect } from "react";
import { Modal, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import PrintModal from "./PrintModal"; // Import the new PrintModal component
import { CompanyContext } from "../../Context/CompanyContext";
import { useContext } from "react";
import styles from "../books.module.css";
import useCompanySetup from "../../Shared/useCompanySetup";
import financialYear from "../../Shared/financialYear";

const CBookModal = ({ isOpen, handleClose, onNavigate }) => {

  const {dateFrom} = useCompanySetup();
  const { company } = useContext(CompanyContext);
  const tenant = company?.databaseName;

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    console.error("No tenant selected!");
  }

  const [fromDate, setFromDate] = useState(null);
  const [uptoDate, setUptoDate] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState({});
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isSplitByDate, setIsSplitByDate] = useState(false);

  // Auto-set financial year when component loads
  useEffect(() => {
    const fy = financialYear.getFYDates();
    setFromDate(fy.start);
    setUptoDate(fy.end);
  }, []);

  useEffect(() => {
    if (isOpen) fetchData();
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/cash`
      );
      setData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilter = () => {
    if (!fromDate || !uptoDate) {
      alert("Please select both dates.");
      return;
    }

    const from = new Date(fromDate);
    const upto = new Date(uptoDate);
    const groupedData = {};

    data.forEach((entry) => {
      const entryDate = new Date(entry.formData.date);
      if (entryDate >= from && entryDate <= upto) {
        if (!groupedData[entry.formData.date]) {
          groupedData[entry.formData.date] = { receipts: [], payments: [] };
        }

        entry.items.forEach((item) => {
          if (parseFloat(item.receipt_credit) > 0) {
            groupedData[entry.formData.date].receipts.push({
              ...item,
              voucherno: entry.formData.voucherno,
            });
          }
          if (parseFloat(item.payment_debit) > 0) {
            groupedData[entry.formData.date].payments.push({
              ...item,
              voucherno: entry.formData.voucherno,
            });
          }
        });
      }
    });

    setFilteredData(groupedData);
    setIsPrintModalOpen(true); // Open Print Modal after filtering
  };

  const handleClose2 = () => {
    handleClose();
    onNavigate();
  };

  return (
    <>
      {/* Date Selection Modal */}
      <Modal open={isOpen} onClose={handleClose2}>
        <Box
          sx={{
            bgcolor: "white",
            p: 4,
            width: "30%",
            margin: "auto",
            mt: 5,
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <button
            onClick={handleClose2}
            style={{
              position: "absolute",
              right: 10,
              top: 10,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <CloseIcon />
          </button>
          <h3>Select Date Range</h3>

          <div style={{ marginBottom: 20,marginTop:20 }}>
            <label>From Date:</label>
            <DatePicker
              selected={fromDate}
              onChange={(date) => setFromDate(date)}
              dateFormat="dd/MM/yyyy"
              className={styles.From}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label>Upto Date:</label>
            <DatePicker
              selected={uptoDate}
              onChange={(date) => setUptoDate(date)}
              dateFormat="dd/MM/yyyy"
              className={styles.From}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label>
              <input
                type="checkbox"
                checked={isSplitByDate}
                onChange={(e) => setIsSplitByDate(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Print each date on a new page
            </label>
          </div>

          <Button
            variant="contained"
            color="primary"
            onClick={handleFilter}
            style={{ marginRight: 10 }}
          >
            View & Print
          </Button>
          <Button variant="contained" color="secondary" onClick={handleClose2}>
            Close
          </Button>
        </Box>
      </Modal>

      {/* Print Preview Modal */}
      <PrintModal
        isOpen={isPrintModalOpen}
        handleClose={() => setIsPrintModalOpen(false)}
        filteredData={filteredData}
        splitByDate={isSplitByDate}
        fromDate={fromDate}
        uptoDate={uptoDate}
      />
    </>
  );
};

export default CBookModal;
