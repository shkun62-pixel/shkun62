// components/PrintChoiceModal.jsx
import { Modal, Button } from "react-bootstrap";

export default function PrintChoiceModal({ open, onClose, onNormal, onFA }) {
  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton><Modal.Title>Print</Modal.Title></Modal.Header>
      <Modal.Body>
        <div className="d-grid gap-2">
          <Button variant="primary" onClick={onNormal}>Normal print</Button>
          <Button variant="secondary" onClick={onFA}>View FA voucher</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
