import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";

const AccountSelectionModal = ({
  show,
  onHide,
  accounts,
  annexure,
  onApply,
}) => {
  const [checked, setChecked] = useState({});
  const [searchText, setSearchText] = useState("");

  const searchRef = useRef(null);

  useEffect(() => {
    const init = {};
    accounts.forEach((a) => (init[a.name] = false));
    setChecked(init);
    setSearchText("");
  }, [accounts]);

  useEffect(() => {
    if (show && searchRef.current) searchRef.current.focus();
  }, [show]);

  useEffect(() => {
    const handleKeyDown = () => {
      if (searchRef.current) searchRef.current.focus();
    };
    if (show) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [show]);

  const toggle = (name) => {
    setChecked((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleApply = () => {
    const selected = Object.keys(checked).filter((k) => checked[k]);
    onApply(selected);
    onHide();
  };

  // Filter accounts based on search
  const filteredAccounts = accounts
    .filter((a) => !annexure || a.group === annexure)
    .filter((a) =>
      a.name.toLowerCase().includes(searchText.toLowerCase())
    );

  // Restrict typing to valid account names
  const handleSearchChange = (e) => {
    const val = e.target.value;
    const match = accounts.some((a) =>
      a.name.toLowerCase().startsWith(val.toLowerCase())
    );
    if (val === "" || match) setSearchText(val);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      backdrop="static"
      className="custom-modal"
      style={{ marginTop: 10 }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Select Ledger Accounts</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ overflowY: "auto" }}>
        <Table bordered size="sm">
          <thead style={{ backgroundColor: "skyblue" }}>
            <tr>
              <th style={{ textAlign: "center" }}>Select</th>
              <th>Account Name</th>
              <th>Group</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((acc) => (
              <tr key={acc.id}>
                <td className="text-center">
                  <Form.Check
                    checked={checked[acc.name] || false}
                    onChange={() => toggle(acc.name)}
                  />
                </td>
                <td>{acc.name}</td>
                <td>{acc.group}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>

      {/* 🔹 Footer with search on left, buttons on right */}
      <Modal.Footer className="d-flex justify-content-between align-items-center">
        <Form.Control
          ref={searchRef}
          type="text"
          placeholder="Search Account"
          value={searchText}
          onChange={handleSearchChange}
          style={{ width: "350px" }}
        />

        <div>
          <Button variant="secondary" onClick={onHide} className="me-2">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AccountSelectionModal;
