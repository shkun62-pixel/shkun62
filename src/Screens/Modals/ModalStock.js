import React, { useState, useEffect, useRef } from "react";
import { Container } from "@mui/material";
import Button from "react-bootstrap/Button";
import { ButtonGroup } from "@mui/material";
import "../NewStockAcc/NewStockAcc.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useEditMode } from "../../EditModeContext";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import NewStockAccount from "../NewStockAcc/NewStockAcc.js";

const ModalStock = ({ isOpen, onClose, onNavigate }) => {
  return (
    <Modal
      style={{ zIndex: 100000, backgroundColor: "white" }}
      open={isOpen}
      onClose={onClose}
      tabIndex={0} // Ensure modal is focusable for keyboard events
    >
      <NewStockAccount />
    </Modal>
  );
};

export default ModalStock;
