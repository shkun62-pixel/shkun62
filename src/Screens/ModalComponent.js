import React from 'react';

const ModalComponent = ({ onClose }) => {
    return (
        <div style={modalStyles}>
            <div style={modalContentStyles}>
                <button onClick={onClose}>Close Modal</button>
                {/* Modal content goes here */}
            </div>
        </div>
    );
};

const modalStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
};

const modalContentStyles = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '5px',
    width: '300px',
    textAlign: 'center',
};

export default ModalComponent;
