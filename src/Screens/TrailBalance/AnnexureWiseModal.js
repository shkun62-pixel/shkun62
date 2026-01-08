import React from "react";
import { Modal, Table, Button } from "react-bootstrap";

const AnnexureWiseModal = ({ show, onClose, data }) => {
  return (
    <Modal show={show} onHide={onClose} size="xl" className="custom-modal" >
      <Modal.Header closeButton>
        <Modal.Title>Annexure Wise Trial Balance</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{overflowY:'auto'}}>
        {Object.entries(data).map(([annexure, ledgers]) => {
          let totalDebit = 0;
          let totalCredit = 0;

          return (
            <div key={annexure} style={{ marginBottom: "30px" }}>
              {/* ANNEXURE HEADER */}
              <h5 style={{ fontWeight: "bold", borderBottom: "2px solid #000" }}>
                {annexure}
              </h5>

              <Table bordered size="sm">
                <thead style={{ background: "#e6f0ff", textAlign: "center" }}>
                  <tr>
                    <th>Account Name</th>
                    <th>City</th>
                    <th>Pkgs</th>
                    <th>Qty</th>
                    <th>Dr. Balance</th>
                    <th>Cr. Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {ledgers.map((l) => {
                    const bal = l.totals.balance;
                    const isDr = l.totals.drcr === "DR";

                    if (isDr) totalDebit += Math.abs(bal);
                    else totalCredit += Math.abs(bal);

                    return (
                      <tr key={l._id}>
                        <td>{l.formData.ahead}</td>
                        <td>{l.formData.city}</td>
                        <td align="right">
                          {l.netPcs?.toFixed(3) || "0.000"}
                        </td>
                        <td align="right">
                          {l.netQty?.toFixed(3) || "0.000"}
                        </td>
                        <td align="right">
                          {isDr ? Math.abs(bal).toFixed(2) : ""}
                        </td>
                        <td align="right">
                          {!isDr ? Math.abs(bal).toFixed(2) : ""}
                        </td>
                      </tr>
                    );
                  })}

                  {/* TOTAL ROW */}
                  <tr style={{ fontWeight: "bold", background: "#f2f2f2" }}>
                    <td colSpan={4} align="right">Totals :</td>
                    <td align="right">{totalDebit.toFixed(2)}</td>
                    <td align="right">{totalCredit.toFixed(2)}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          );
        })}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AnnexureWiseModal;
