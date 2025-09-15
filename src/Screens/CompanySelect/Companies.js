import React, { useState, useEffect, useRef } from "react";
import "./Companies.css";
import { Table} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Modal from 'react-bootstrap/Modal';
import Setup from "../Setup/Setup";

const Companies = () => {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tableRef = useRef(null);
  const searchRef = useRef(null); // Ref for search field
  const [showNewStockModal, setShowNewStockModal] = useState(false);
  const [searchText, setSearchText] = useState("");

    // Instead of opening a new window, open the modal for NewStockAcc
    const openNewStockModal = () => {
      
      setShowNewStockModal(true);
    };

    const allCompanies = [
      { name: "SHADOWPVTLTD1", gstNumber: "03ABAHT5580L1ZX", yearFrom: 2024, yearUpto: 2025,tenantCompanyId:"67e53fb56317c0bde396038f" },
      { name: "BRIGHTTECHSOLUTIONS", gstNumber: "07AACFB1234K1ZP", yearFrom: 2024, yearUpto: 2025 ,tenantCompanyId:"67e53fb56317c0bde396038f"},
      { name: "GREENWAYENTERPRISES", gstNumber: "09AABCG5678M1ZQ", yearFrom: 2024, yearUpto: 2025,tenantCompanyId:"67e53fb56317c0bde396038f" },
      { name: "RAPIDMANUFACTURING", gstNumber: "27AAACR7890N1ZR", yearFrom: 2024, yearUpto: 2025,tenantCompanyId:"67e53fb56317c0bde396038f" },
      { name: "SKYLINEEXPORTS", gstNumber: "19AADCS4321P1ZS", yearFrom: 2024, yearUpto: 2025,tenantCompanyId:"67e53fb56317c0bde396038f" },
      { name: "NEXTGENRETAIL", gstNumber: "33AAEFG8765R1ZT", yearFrom: 2024, yearUpto: 2025,tenantCompanyId:"67e53fb56317c0bde396038f" },
    ];

  // Filter companies based on search input
  const filteredCompanies = allCompanies.filter(company =>
    company.name.startsWith(searchText.toUpperCase())
  );

  useEffect(() => {
    // Focus on search input on render
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (["ArrowDown", "ArrowUp"].includes(event.key)) {
        event.preventDefault();
        setSelectedIndex((prevIndex) => {
          if (event.key === "ArrowDown") {
            return prevIndex < filteredCompanies.length - 1 ? prevIndex + 1 : prevIndex;
          } else if (event.key === "ArrowUp") {
            return prevIndex > 0 ? prevIndex - 1 : prevIndex;
          }
          return prevIndex;
        });
      } else if (event.key === "Enter" && filteredCompanies[selectedIndex]) {
        navigate("/Example", { state: filteredCompanies[selectedIndex] });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, filteredCompanies, navigate]);

  const handleSearchChange = (e) => {
    const input = e.target.value.toUpperCase();

    // Check if input matches any company name prefix
    const isValidInput = allCompanies.some(company => company.name.startsWith(input));

    if (isValidInput) {
      setSearchText(input);
      setSelectedIndex(0); // Reset selection to the first filtered result
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -90 }}
      animate={{ opacity: 1, y: 2 }}
      transition={{ duration: 0.9 }}
      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div
        className="MainContent"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "540px",
          width: "70%",
          position: "relative",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          className="HEADER"
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'green',
            fontSize: 20,
          }}
        >
          LICENCE NO. 878-763-225-852
        </div>
        <div
          style={{
            position: 'absolute',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <span style={{ fontSize: 18 }}>Visit Website:</span>
          <a
            href="https://www.sscshkun.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline', color: 'blue', fontSize: '18px'}}
          >
            www.sscshkun.com
          </a>
        </div>
        <h2
          className="HEADER"
          style={{
            color: "#D70654",
            textAlign: "center",
            letterSpacing: 10,
            marginTop: 30,
            fontSize: 35,
          }}
        >
          SELECT COMPANY
        </h2>
        
        <div style={{ display: "flex", flexGrow: 1 }}>
          <div className="TableContainer" style={{ flex: 1, overflowY: "auto", margin: 6 }}>
            <Table className="custom-table" ref={tableRef} tabIndex={0}>
              <thead className="Thead" style={{ background: "rgb(243, 202, 151)", textAlign: "center", position: "sticky", top: 0 }}>
                <tr style={{ color: "black" }}>
                  <th>NAME OF THE COMPANY</th>
                  <th>GST NUMBER</th>
                  <th>FROM</th>
                  <th>UPTO</th>
                  <th>LAST LOGIN</th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company, index) => (
                  <motion.tr
                    key={company.tenantCompanyId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={index === selectedIndex ? "selected-row" : ""}
                    style={{ backgroundColor: index === selectedIndex ? "#b3d9ff" : "white", cursor: "pointer" }}
                  >
                    <td style={{ padding: "8px", width: 350 }}>{company.name}</td>
                    <td style={{ padding: "8px" }}>{company.gstNumber}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{company.yearFrom}</td>
                    <td style={{ padding: "8px", textAlign: "center" }}>{company.yearUpto}</td>
                    <td style={{ padding: "8px" }}></td>
                  </motion.tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: 5 }}>
              <motion.button
                initial={{ opacity: 0, y: -90 }}
                animate={{ opacity: 1, y: 2 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={openNewStockModal}
                style={{ marginTop: 60 , backgroundColor:'#7755B7', border: "none", padding: "10px", color: "white", fontSize: "16px" ,borderRadius:5}}
              >
                NEW
              </motion.button>
                {showNewStockModal && (
                      <Modal
                      dialogClassName="custom-full-width-modal" // Add a custom class
                        show
                        onHide={() => setShowNewStockModal(false)}
                        size="lg"
                        style={{zIndex: 100000,marginTop:-20,overflow:"hidden"}}
                      >
                        <Modal.Body style={{padding:32}}>
                          <Setup />
                        </Modal.Body>
                        {/* <Modal.Footer>
                          <Button variant="secondary" onClick={() => setShowNewStockModal(false)}>
                            Close
                          </Button>
                        </Modal.Footer> */}
                      </Modal>
                    )}
              <motion.button
                initial={{ opacity: 0, y: -90 }}
                animate={{ opacity: 1, y: 2 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ marginTop: 10 , backgroundColor:'#7755B7', border: "none", padding: "10px", color: "white", fontSize: "16px" ,borderRadius:5}}
              >
                DELETE
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: -90 }}
                animate={{ opacity: 1, y: 2 }}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ marginTop: 10 , backgroundColor:'#7755B7', border: "none", padding: "10px", color: "white", fontSize: "16px" ,borderRadius:5}}
              >
                EXIT
              </motion.button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: '20px', left: '120px', display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="SPAN" style={{ fontSize: 18 }}>Search</span>
            <input
            ref={searchRef}
            className="SearchField"
            value={searchText}
            onChange={handleSearchChange}
            style={{ marginLeft: 5, textTransform: "uppercase" }}
          />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginLeft:40 }}>
            <span className="SPAN" style={{ fontSize: 18 }}>Password</span>
            <input type='password' className="SearchField" style={{ marginLeft: 5 }} />
            <a href="/companies" style={{ fontSize: 18, color: 'blue', textDecoration: 'underline', marginLeft: 10, cursor: 'pointer', fontStyle:'oblique' }}>Forgot Password</a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Companies;
