import React, { useEffect, useState, useRef } from "react";
import { Modal, Table, Button } from "react-bootstrap";
import axios from "axios";

const PrintModal = ({ show, onHide, filters }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!show) return;

    setLoading(true);
    axios
      .get("https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/ledgerAccount")
      .then((res) => {
        if (res.data.ok) {
          let allData = res.data.data.map((a) => a.formData);

          if (filters) {
            allData = allData.filter((f) => {
              return (
                (!filters.cityName || f.city?.toLowerCase().includes(filters.cityName.toLowerCase())) &&
                (!filters.stateName || f.state?.toLowerCase().includes(filters.stateName.toLowerCase())) &&
                (!filters.agent || f.agent?.toLowerCase().includes(filters.agent.toLowerCase())) &&
                (!filters.msmeStatus || f.msmed?.toLowerCase().includes(filters.msmeStatus.toLowerCase())) &&
                (!filters.area || f.area?.toLowerCase().includes(filters.area.toLowerCase())) &&
                (!filters.group || f.group?.toLowerCase().includes(filters.group.toLowerCase()))
              );
            });
          }

          setData(allData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [show, filters]);

  const handlePrint = () => {
    if (contentRef.current) {
      const printContent = contentRef.current.innerHTML;
      const newWin = window.open("", "_blank");
      newWin.document.write(printContent);
      newWin.document.close();
      newWin.print();
    }
  };

  const handleExportExcel = () => {
    alert("Export logic goes here");
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      backdrop="static"
      className="custom-modal"
      keyboard={true}
      style={{ marginTop: 10 }}
    >
      {/* HEADER */}
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">Ledger Summary</Modal.Title>
      </Modal.Header>

      {/* BODY */}
      <Modal.Body style={{ overflowY: "auto" }}>
        <div ref={contentRef}>
          {/* Company Header */}
          <div
            className="ledger-header text-center mb-3"
            style={{ fontFamily: "monospace", fontSize: 20 }}
          >
            <h5 className="fw-bold">Company Name Here</h5>
            <div>Company Address Here</div>
            <div>Company City Here</div>
          </div>

          {/* Date Range */}
          <div
            style={{ fontSize: 16, fontFamily: "monospace" }}
            className="d-flex justify-content-between mb-2"
          >
            <div>
              <b>Balance Detail From Dated:</b> {filters?.fromDate} To {filters?.uptoDate}
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <Table bordered size="sm">
              <thead style={{ background: "#dedcd7" }}>
                <tr>
                  <th>ACCOUNT NAME</th>
                  <th>GST NO</th>
                  <th>PHONE</th>
                  <th>CITY</th>
                </tr>
              </thead>
              <tbody>
                {data.length ? (
                  data.map((acc, idx) => (
                    <tr key={idx}>
                      <td>{acc.ahead || "-"}</td>
                      <td>{acc.gstNo || "-"}</td>
                      <td>{acc.phone || "-"}</td>
                      <td>{acc.city || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </div>
      </Modal.Body>

      {/* FOOTER */}
      <Modal.Footer>
        <Button onClick={handlePrint}>PRINT</Button>
        <Button variant="success" onClick={handleExportExcel}>
          EXPORT
        </Button>
        <Button variant="secondary" onClick={onHide}>
          CLOSE
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PrintModal;
