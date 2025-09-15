import React, { useState,useEffect} from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import Table from 'react-bootstrap/Table';
const StyledModal = styled(Box)({
  position: "absolute",
  top: "40%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  height: 500,
  backgroundColor: "white",
  boxShadow: 24,
  border: "2px solid black",
  padding: 16,
  borderRadius: 10,
});
const CloseButton = styled("button")({
    position: "absolute",
    top: 5,
    right: 16,
    borderRadius:5,
    border: "1px solid black",
    background: "red",
    cursor: "pointer",
    color:'white',
  });

const SaleWin = ({ isOpen, onClose, onNavigate }) => {
    const [formData, setFormData] = useState([
        {
            id: 1,
            ahead: "",
            form_type: "",
            led_post: "",
            vat_post: "",
            ex_post: "",
            serial: "",
            short_name: "",
            stk_post: "",
            form_rtype: "",
            rep_name: "",
            bill_no_h: "",
            salef3: "",
            tick: "",
            vacode: "",
            rep_gst: "",
        },
    ]);

     const handleInputChange = (event, index, field) => {
        const value = event.target.value;
        const updatedItems = [...formData];
        updatedItems[index][field] = value;    
        setFormData(updatedItems);
    };
    const handleAddItem = () => {
            const newItem = {
                id: formData.length + 1,
                ahead: "",
                form_type: "",
                led_post: "",
                vat_post: "",
                ex_post: "",
                serial: "",
                short_name: "",
                stk_post: "",
                form_rtype: "",
                rep_name: "",
                bill_no_h: "",
                salef3: "",
                tick: "",
                vacode: "",
                rep_gst: "",
            };
            setFormData([...formData, newItem]);
    };
       // Load formData and editedUser from localStorage on mount
         useEffect(() => {
            const storedFormData = localStorage.getItem('SaleWin');
            if (storedFormData) {
                setFormData(JSON.parse(storedFormData));  // Parse and load formData
                console.log("storedFormData:",storedFormData);
                
            }
        }, []);

    const handleSave = () =>{
        localStorage.setItem("SaleWin", JSON.stringify(formData));
        console.log("FormData Sale_win",formData);
    }
    
    const handleKeyDown = (event) => {
        if ((event.ctrlKey && (event.key === "y" || event.key === "Y"))) {
          event.preventDefault();
          handleAddItem();
        }
        if ((event.ctrlKey && (event.key === "Q" || event.key === "q"))) {
          event.preventDefault();
          handleSave();  
          onClose(); 
        }
      };
 
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      tabIndex={0} // Ensure modal is focusable for keyboard events
    >
        <StyledModal onKeyDown={handleKeyDown} tabIndex={-1}>
      <CloseButton onClick={onClose}>
          <CloseIcon />
        </CloseButton>
        <div style={{marginTop:25,maxHeight:450}} className='TableSectionz'>
                <Table className="custom-table">
                    <thead style={{ backgroundColor: "skyblue", textAlign: "center", position: "sticky", top: 0 }}>
                        <tr style={{ color: "white" }}>
                            <th>Ahead</th>
                            <th>Form_type</th>
                            <th>Led_post</th>
                            <th>Vat_post</th>
                            <th>Ex_post</th>
                            <th>Serial</th>
                            <th>Short_name</th>
                            <th>Stk_post</th>
                            <th>Form_rtype</th>
                            <th>Rep_name</th>
                            <th>Bill_no_h</th>
                            <th>Salef3</th>
                            <th>Tick</th>
                            <th>Vacode</th>
                            <th>Rep_gst</th>
                        </tr>
                    </thead>
                    <tbody style={{ overflowY: 'auto', maxHeight: 'calc(450px - 40px)' }}>
                        {formData.map((item, index) => (
                            <tr key={index}>
                                <td style={{ padding: 0 }}>
                                <input
                                    id="ahead"
                                    style={{ height: 40,width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.ahead}
                                    onChange={(e) => handleInputChange(e, index, 'ahead')}
                                    />
                                </td>
                                <td style={{ padding: 0 }}>
                                <input
                                    id="form_type"
                                    style={{ height: 40,width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.form_type}
                                    onChange={(e) => handleInputChange(e, index, 'form_type')}
                                    />
                                </td>
                                <td style={{ padding: 0, }}>
                                <input
                                    id="led_post"
                                    style={{ height: 40, width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.led_post}
                                    onChange={(e) => handleInputChange(e, index, 'led_post')}
                                    />
                                </td>
                                <td style={{ padding: 0, }}>
                                <input
                                    id="vat_post"
                                    style={{ height: 40, width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.vat_post}
                                    onChange={(e) => handleInputChange(e, index, 'vat_post')}
                                    />
                                </td>
                                <td style={{ padding: 0,}}>
                                <input
                                    id="ex_post"
                                    style={{ height: 40, width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.ex_post}
                                    onChange={(e) => handleInputChange(e, index, 'ex_post')}
                                    />
                                </td>
                                <td style={{ padding: 0 }}>
                                <input
                                    id="serial"
                                    style={{ height: 40,width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.serial}
                                    onChange={(e) => handleInputChange(e, index, 'serial')}
                                    />
                                </td>
                                <td style={{ padding: 0 }}>
                                <input
                                    id="short_name"
                                    style={{ height: 40, width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.short_name}
                                    onChange={(e) => handleInputChange(e, index, 'short_name')}
                                    />
                                </td>
                                <td style={{ padding: 0 }}>
                                <input
                                    id="stk_post"
                                    style={{ height: 40, width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.stk_post}
                                    onChange={(e) => handleInputChange(e, index, 'stk_post')}
                                    />
                                </td>
                                <td style={{ padding: 0 }}>
                                <input
                                    id="form_rtype"
                                    style={{ height: 40, width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.form_rtype}
                                    onChange={(e) => handleInputChange(e, index, 'form_rtype')}
                                    />
                                </td>
                                <td style={{ padding: 0 }}>
                                <input
                                    id="rep_name"
                                    style={{ height: 40,width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.rep_name}
                                    onChange={(e) => handleInputChange(e, index, 'rep_name')}
                                    />
                                </td>
                                <td style={{ padding: 0 }}>
                                <input
                                    id="bill_no_h"
                                    style={{ height: 40,width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.bill_no_h}
                                    onChange={(e) => handleInputChange(e, index, 'bill_no_h')}
                                    />
                                </td>
                                <td style={{ padding: 0 }}>
                                <input
                                    id="salef3"
                                    style={{ height: 40,width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.salef3}
                                    onChange={(e) => handleInputChange(e, index, 'salef3')}
                                    />
                                </td>
                                <td style={{ padding: 0 }}>
                                <input
                                    id="tick"
                                    style={{ height: 40, width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.tick}
                                    onChange={(e) => handleInputChange(e, index, 'tick')}
                                    />
                                </td>
                                <td style={{ padding: 0 }}>
                                <input
                                    id="vacode"
                                    style={{ height: 40,width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.vacode}
                                    onChange={(e) => handleInputChange(e, index, 'vacode')}
                                    />
                                </td>
                                <td style={{ padding: 0 }}>
                                <input
                                    id="rep_gst"
                                    style={{ height: 40, width: '100%', boxSizing: 'border-box', border: 'none', padding: 5 }}
                                    value={item.rep_gst}
                                    onChange={(e) => handleInputChange(e, index, 'rep_gst')}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table> 
            </div>
      </StyledModal>
    </Modal>
  );
};

export default SaleWin;
