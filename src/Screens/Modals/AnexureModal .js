import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";
import axios from "axios";
import "./AnexureModal.css";
import { CompanyContext } from "../Context/CompanyContext";
import { useContext } from "react";

const AnexureModal = ({ show, handleClose, onSelect, handleExit }) => {
  const { company } = useContext(CompanyContext);
  const tenant = company?.databaseName;

  if (!tenant) {
    // you may want to guard here or show an error state,
    // since without a tenant you can’t hit the right API
    // console.error("No tenant selected!");
  }

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (show) {
      axios
        .get(
          `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/anexure`
        )
        .then((response) => {
          setData(response.data);
          setFilteredData(response.data);
          setSelectedIndex(0);
          setTimeout(() => searchInputRef.current?.focus(), 100);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [show]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = data.filter((item) =>
      item.formData.name.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
    setSelectedIndex(0);
  };

  const handleCloseWithExit = () => {
    handleExit(); // Call handleExit from main component
    handleClose(); // Close the modal
  };

  const handleSelection = (index) => {
    if (filteredData[index]) {
      onSelect({
        name: filteredData[index].formData.name,
        code: filteredData[index].formData.code,
      });

      handleClose();
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setSelectedIndex((prevIndex) => {
        let newIndex = prevIndex;
        if (event.key === "ArrowDown" && prevIndex < filteredData.length - 1) {
          newIndex = prevIndex + 1;
        } else if (event.key === "ArrowUp" && prevIndex > 0) {
          newIndex = prevIndex - 1;
        }
        return newIndex;
      });
    }
    if (event.key === "Enter") {
      handleSelection(selectedIndex);
    }
  };

  useEffect(() => {
    const selectedRow = document.getElementById(`row-${selectedIndex}`);
    if (selectedRow) {
      selectedRow.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <Modal
      show={show}
      onHide={handleCloseWithExit}
      centered
      className="custom-modal2"
    >
      <Modal.Header className="modal-header-custom">
        <Modal.Title>ANNEXURES LIST</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom">
        {/* Table */}
        <Table bordered hover className="table-custom">
          <thead>
            <tr>
              <th>NAME</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={item._id}
                  id={`row-${index}`}
                  onClick={() => handleSelection(index)}
                  className={selectedIndex === index ? "selected-row" : ""}
                >
                  <td>{item.formData.name}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="1" className="text-center">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer className="modal-footer-custom">
        {/* Search Field */}
        <text>Search Name</text>
        <Form.Control
          type="text"
          placeholder="🔍 Search by name..."
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          ref={searchInputRef}
          className="search-input"
        />
        <Button
          variant="secondary"
          onClick={handleCloseWithExit}
          className="close-btn"
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AnexureModal;
