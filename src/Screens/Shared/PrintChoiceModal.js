// components/PrintChoiceModal.jsx
// import { Modal, Button } from "react-bootstrap";

// export default function PrintChoiceModal({ open, onClose, onNormal, onFA }) {
//   return (
//     <Modal show={open} onHide={onClose} centered>
//       <Modal.Header closeButton><Modal.Title>Print</Modal.Title></Modal.Header>
//       <Modal.Body>
//         <div className="d-grid gap-2">
//           <Button variant="primary" onClick={onNormal}>Normal print</Button>
//           <Button variant="secondary" onClick={onFA}>View FA voucher</Button>
//         </div>
//       </Modal.Body>
//     </Modal>
//   );
// }


import { Modal, Button } from "react-bootstrap";

export default function PrintChoiceModal({ open, onClose, onNormal, onFA }) {
  return (
    <Modal
      show={open}
      onHide={onClose}
      centered
      backdrop="static"
      contentClassName="custom-modal-content"
    >
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(90deg, #007bff 0%, #00c4ff 100%)",
          color: "white",
          borderBottom: "none",
        }}
      >
        <Modal.Title style={{ fontWeight: 600, letterSpacing: 0.5 }}>
          🖨️ Print Options
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          background: "#f8f9fa",
          padding: "30px",
          borderRadius: "0 0 10px 10px",
          boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)",
        }}
      >
        <div
          className="d-grid gap-3"
          style={{ textAlign: "center", fontSize: 15 }}
        >
          <p style={{ color: "#6c757d", marginBottom: 10 }}>
            Choose how you want to print your document
          </p>

          <Button
            variant="primary"
            size="lg"
            onClick={onNormal}
            style={{
              fontWeight: 600,
              background: "linear-gradient(90deg, #007bff 0%, #00b4d8 100%)",
              border: "none",
              borderRadius: "10px",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(0,123,255,0.3)",
              marginRight:" 10px"
            }}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 6px 20px rgba(0,123,255,0.5)")
            }
            onMouseLeave={(e) =>
              (e.target.style.boxShadow = "0 4px 12px rgba(0,123,255,0.3)")
            }
          >
            Normal Print
          </Button>

          <Button
            variant="outline-dark"
            size="lg"
            onClick={onFA}
            style={{
              fontWeight: 600,
              borderRadius: "10px",
              border: "2px solid #343a40",
              transition: "all 0.3s ease",
              backgroundColor: "white",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#343a40";
              e.target.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "white";
              e.target.style.color = "#343a40";
            }}
          >
            View FA Voucher
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
