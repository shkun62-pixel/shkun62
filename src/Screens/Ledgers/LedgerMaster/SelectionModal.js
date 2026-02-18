import React, { useEffect, useState, useRef } from "react";
import { Modal, Table, Button, Form } from "react-bootstrap";
import axios from "axios";

const SelectionModal = ({
  show,
  onHide,
  selectedAccounts,
  setSelectedAccounts,
}) => {

  const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  const [accounts, setAccounts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const searchInputRef = useRef(null);
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [show]);

  useEffect(() => {
    if (!show) return;

    axios
      .get(
        `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount`,
      )
      .then((res) => {
        if (res.data.ok) {
          setAccounts(res.data.data.map((a) => a.formData));
        }
      })
      .catch((err) => console.error(err));
  }, [show]);

  // 🔹 Toggle checkbox
  const toggleAccount = (account) => {
    setSelectedAccounts((prev) => {
      const exists = prev.find((a) => a.ahead === account.ahead);
      if (exists) {
        return prev.filter((a) => a.ahead !== account.ahead);
      }
      return [...prev, account];
    });
  };

  const isChecked = (account) =>
    selectedAccounts.some((a) => a.ahead === account.ahead);

  // 🔹 Search filter
  const filteredAccounts = accounts.filter((acc) => {
    const text = searchText.toLowerCase();

    return (
      acc.ahead?.toLowerCase().includes(text) ||
      acc.city?.toLowerCase().includes(text) ||
      acc.gstNo?.toLowerCase().includes(text)
    );
  });

  const isValidSearchInput = (value) => {
    if (!value) return true; // allow clearing

    const text = value.toLowerCase();

    return accounts.some(
      (acc) =>
        acc.ahead?.toLowerCase().startsWith(text) ||
        acc.city?.toLowerCase().startsWith(text) ||
        acc.gstNo?.toLowerCase().startsWith(text),
    );
  };
  
  useEffect(() => {
    if (!show) return;

    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;

      // If already focused on search → do nothing
      if (activeEl === searchInputRef.current) return;

      // If focused on a TEXT input or textarea → do nothing
      if (activeEl?.tagName === "INPUT" && activeEl?.type !== "checkbox") {
        return;
      }

      if (activeEl?.tagName === "TEXTAREA") return;

      // If user types a visible character
      if (e.key.length === 1) {
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Ledger Accounts</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ overflowY: "auto", height: "70vh" }}>
        <Table bordered size="sm">
          <thead style={{ backgroundColor: "#ebeced" }}>
            <tr>
              <th style={{ width: 80 }}>Select</th>
              <th>ACCOUNT NAME</th>
              <th>CITY</th>
              <th>GST NO</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.length ? (
              filteredAccounts.map((acc, idx) => (
                <tr key={idx}>
                  <td className="text-center">
                    <Form.Check
                      type="checkbox"
                      checked={isChecked(acc)}
                      onChange={() => toggleAccount(acc)}
                    />
                  </td>
                  <td>{acc.ahead || ""}</td>
                  <td>{acc.city || ""}</td>
                  <td>{acc.gstNo || ""}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center">
                  No matching accounts
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-between align-items-center">
        {/* 🔍 Search (LEFT) */}
        <Form.Control
          ref={searchInputRef}
          type="text"
          placeholder="Search..."
          style={{ width: 300 }}
          value={searchText}
          onChange={(e) => {
            const value = e.target.value;
            if (isValidSearchInput(value)) {
              setSearchText(value);
            }
          }}
        />

        {/* Buttons (RIGHT) */}
        <div>
          <Button variant="secondary" onClick={onHide}>
            Done
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SelectionModal;
