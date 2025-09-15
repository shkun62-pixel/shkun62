// ✅ Step 1: Create a print option modal
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const PrintVoucherModal = ({ show, onClose, onSelect }) => {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Select Print Type</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Button
          className="w-100 mb-2"
          variant="primary"
          onClick={() => onSelect('normal')}
        >
          Print Normal Cash Voucher
        </Button>
        <Button
          className="w-100"
          variant="success"
          onClick={() => onSelect('fa')}
        >
          Print FA Voucher View
        </Button>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PrintVoucherModal;
