import React from "react";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";

const AccountEntriesModal = ({
  show,
  onClose,
  accountName,
  entries,
  formatDate,
}) => {
  if (!show) return null;

  const isGSTOnly = entries.every((e) => !e.qty);

  return (
    <Modal show={show} onHide={onClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>{accountName}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Table bordered size="sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Bill No</th>
              <th>Customer</th>

              {!isGSTOnly && <th>Qty</th>}
              <th>Value</th>

              {!isGSTOnly && (
                <>
                  <th>CGST</th>
                  <th>SGST</th>
                  <th>IGST</th>
                </>
              )}

              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((e, i) => (
              <tr key={i}>
                <td>{formatDate(e.date)}</td>
                <td>{e.vno}</td>
                <td>{e.customer}</td>

                {!isGSTOnly && (
                  <td className="text-end">{e.qty || ""}</td>
                )}

                <td className="text-end">{e.value || ""}</td>

                {!isGSTOnly && (
                  <>
                    <td className="text-end">{e.cgst || ""}</td>
                    <td className="text-end">{e.sgst || ""}</td>
                    <td className="text-end">{e.igst || ""}</td>
                  </>
                )}

                <td className="text-end">
                  {e.total ?? e.value}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
};

export default AccountEntriesModal;
