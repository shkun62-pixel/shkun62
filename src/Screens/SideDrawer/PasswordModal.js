import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './NewModal.css'; // Assuming you have a modal.css file

const PasswordModal = ({ onClose }) => {
    const [formData, setFormData] = useState({
        C_add: false,
        C_mod: false,
        C_del: false,
        I_add: false,
        I_mod: false,
        I_del: false,
        J_add: false,
        J_mod: false,
        J_del: false,
        T_add: false,
        T_mod: false,
        T_del: false,
        B_add: false,
        B_mod: false,
        B_del: false,
        M_add: false,
        M_mod: false,
        M_del: false,
        S_add: false,
        S_mod: false,
        S_del: false,
        A_add: false,
        A_mod: false,
        A_del: false,
        P_add: false,
        P_mod: false,
        P_del: false,
        E_add: false,
        E_mod: false,
        E_del: false,
        So_add: false,
        So_mod: false,
        So_del: false,
        Sc_add: false,
        Sc_mod: false,
        Sc_del: false,
        C_book: false,
        D_book: false,
        S_book: false,
        P_book: false,
        B_book: false,
        Coa_book: false,
        Tb_book: false,
        Bs_book: false,
        Bill_book: false,
        S_rep: false,
        Int_book: false,
        L_book: false,
        C_summ: false,
        S_summ: false,
        Plist: false,
        Stk_book: false,
        E_book: false,
        Vat_ret: false,
        Tcs_ret: false,
        Tds_ret: false,
        Trf_ac: false,
        Tel_dir: false,
        Bck_book: false,
        Setup: false,
        Sc_days: "",
        Sc_date: "",
        Fo_pack: false,
        Password: "",
        Ahead: "",

    });
    const handleCheckboxChange = (name) => {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: !prevFormData[name],
        }));
    };

    const [selectedDate, setSelectedDate] = useState(new Date());
    useEffect(() => {
        // Set today's date when the component mounts
        setSelectedDate(new Date());
    }, []);
    // Select field implementation
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem('usersList');
        return savedUsers ? JSON.parse(savedUsers) : [];
    });
    const [selectedUser, setSelectedUser] = useState('');
    const [editedUser, setEditedUser] = useState('');

    useEffect(() => {
        localStorage.setItem('usersList', JSON.stringify(users));
    }, [users]);

    const handleChange = (event) => {
        setSelectedUser(event.target.value);
        setEditedUser(event.target.value);
    };
  // Update the `Ahead` field when `editedUser` changes
  useEffect(() => {
    setFormData((prevFormData) => ({
        ...prevFormData,
        Ahead: editedUser,
    }));
}, [editedUser]);

    // const handleSaveClick = () => {
    //     Object.entries(formData).forEach(([key, value]) => {
    //         console.log(`${key}: ${value ? 'true' : 'false'}`);
    //     });
    //     const updatedUsers = users.map(user => user === selectedUser ? editedUser : user);
    //     setUsers(updatedUsers);
    // };

    const handleSaveClick = () => {
        // Update users array with editedUser
        const updatedUsers = users.map(user => user === selectedUser ? editedUser : user);
        setUsers(updatedUsers);
    
        // Save formData to localStorage
        localStorage.setItem('formDATA', JSON.stringify(formData));
        localStorage.setItem('editedUser', editedUser);  // Save editedUser to localStorage
        localStorage.setItem('SelectedUser', selectedUser);  // Save editedUser to localStorage
        // Log formData for debugging
        console.log("FORMDATA:", formData);
    };
     // Load formData and editedUser from localStorage on mount
     useEffect(() => {
        const storedFormData = localStorage.getItem('formDATA');
        const storedEditedUser = localStorage.getItem('editedUser');
        const storedSelectedUser = localStorage.getItem('SelectedUser');
        if (storedFormData) {
            setFormData(JSON.parse(storedFormData));  // Parse and load formData
        }
        if (storedEditedUser) {
            setEditedUser(storedEditedUser);  // Load editedUser
        }
        if (storedSelectedUser) {
            setSelectedUser(storedSelectedUser);  // Load editedUser
        }
    }, []);

    const handleAddClick = () => {
        const newUser = "New User";
        setUsers([...users, newUser]);
    };
    const handleInputChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    return (
        <div className="newModal">
            <div className="newModal-content">
                <span className="closeModal" onClick={onClose}>&times;</span>
                <div>
                    <div style={{ display: 'flex', flexDirection: "row", }}>
                        <h3 style={{ marginLeft: "8%", marginTop: 5 }}>TRANSACTIONS</h3>
                        <div className='dash' style={{ display: 'flex', flexDirection: 'column', borderStyle: "dashed", borderWidth: 1, borderColor: "black", }}></div>
                        <h3 style={{ marginLeft: "7%", marginTop: 5 }}>REPORTS</h3>
                        <div style={{ marginLeft: "5%", marginTop: 5 }}>
                            <text className='texttop'>User List:</text>
                            <select style={{ marginLeft: 5 }} id="usersList" value={selectedUser} onChange={handleChange}>
                                <option value="">--Please choose a user--</option>
                                {users.map((user, index) => (
                                    <option key={index} value={user}>{user}</option>
                                ))}
                            </select>
                            <Button onClick={handleAddClick} style={{ width: 100, marginLeft: 10, backgroundColor: 'lightseagreen', marginBottom: 10 }} className='button'>Add</Button>
                        </div>
                    </div>
                    {/* Chechbox Part*/}
                    <div style={{ height: 1, borderStyle: "dashed", borderWidth: 1, borderColor: "black", display: 'flex', flexDirection: "row" }}></div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div className='leftcontainer' style={{ display: 'flex', flexDirection: 'column' }}>
                            <div className='cashinventory' style={{ display: 'flex', flexDirection: "row", }}>
                                <text className='texttop'>Cash</text>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 40 }}>
                                    <label>
                                        Add
                                        <input
                                            style={{ marginLeft: 30 }}
                                            type="checkbox"
                                            checked={formData.C_add}
                                            onChange={() => handleCheckboxChange('C_add')}
                                        />

                                    </label>
                                    <label>
                                        Modity
                                        <input
                                            style={{ marginLeft: 8 }}
                                            type="checkbox"
                                            checked={formData.C_mod}
                                            onChange={() => handleCheckboxChange('C_mod')}
                                        />

                                    </label>
                                    <label>
                                        Delete
                                        <input
                                            style={{ marginLeft: 12 }}
                                            type="checkbox"
                                            checked={formData.C_del}
                                            onChange={() => handleCheckboxChange('C_del')}
                                        />

                                    </label>
                                </div>
                                <text className='texttop' style={{ marginLeft: 50 }}>Inventory</text>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 48 }}>
                                    <label>
                                        Add
                                        <input
                                            style={{ marginLeft: 30 }}
                                            type="checkbox"
                                            checked={formData.I_add}
                                            onChange={() => handleCheckboxChange('I_add')}
                                        />

                                    </label>
                                    <label>
                                        Modity
                                        <input
                                            style={{ marginLeft: 8 }}
                                            type="checkbox"
                                            checked={formData.I_mod}
                                            onChange={() => handleCheckboxChange('I_mod')}
                                        />

                                    </label>
                                    <label>
                                        Delete
                                        <input
                                            style={{ marginLeft: 12 }}
                                            type="checkbox"
                                            checked={formData.I_del}
                                            onChange={() => handleCheckboxChange('I_del')}
                                        />

                                    </label>
                                </div>
                            </div>
                            <div className='journal' style={{ display: 'flex', flexDirection: "row" }}>
                                <text className='texttop'>Journal</text>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 30 }}>
                                    <label>
                                        Add
                                        <input
                                            style={{ marginLeft: 30 }}
                                            type="checkbox"
                                            checked={formData.J_add}
                                            onChange={() => handleCheckboxChange('J_add')}
                                        />

                                    </label>
                                    <label>
                                        Modity
                                        <input
                                            style={{ marginLeft: 8 }}
                                            type="checkbox"
                                            checked={formData.J_mod}
                                            onChange={() => handleCheckboxChange('J_mod')}
                                        />

                                    </label>
                                    <label>
                                        Delete
                                        <input
                                            style={{ marginLeft: 12 }}
                                            type="checkbox"
                                            checked={formData.J_del}
                                            onChange={() => handleCheckboxChange('J_del')}
                                        />

                                    </label>
                                </div>
                                <text className='texttop' style={{ marginLeft: 60 }}>TDS Vch</text>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 58 }}>
                                    <label>
                                        Add
                                        <input
                                            style={{ marginLeft: 30 }}
                                            type="checkbox"
                                            checked={formData.T_add}
                                            onChange={() => handleCheckboxChange('T_add')}
                                        />

                                    </label>
                                    <label>
                                        Modity
                                        <input
                                            style={{ marginLeft: 8 }}
                                            type="checkbox"
                                            checked={formData.T_mod}
                                            onChange={() => handleCheckboxChange('T_mod')}
                                        />

                                    </label>
                                    <label>
                                        Delete
                                        <input
                                            style={{ marginLeft: 12 }}
                                            type="checkbox"
                                            checked={formData.T_del}
                                            onChange={() => handleCheckboxChange('T_del')}
                                        />

                                    </label>
                                </div>
                            </div>
                            <div className='bank' style={{ display: 'flex', flexDirection: "row" }}>
                                <text className='texttop'>Bank</text>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 50 }}>
                                    <label>
                                        Add
                                        <input
                                            style={{ marginLeft: 30 }}
                                            type="checkbox"
                                            checked={formData.B_add}
                                            onChange={() => handleCheckboxChange('B_add')}
                                        />

                                    </label>
                                    <label>
                                        Modity
                                        <input
                                            style={{ marginLeft: 8 }}
                                            type="checkbox"
                                            checked={formData.B_mod}
                                            onChange={() => handleCheckboxChange('B_mod')}
                                        />

                                    </label>
                                    <label>
                                        Delete
                                        <input
                                            style={{ marginLeft: 12 }}
                                            type="checkbox"
                                            checked={formData.B_del}
                                            onChange={() => handleCheckboxChange('B_del')}
                                        />

                                    </label>
                                </div>
                                <text className='texttop' style={{ marginLeft: 40 }}>Ledger A/c</text>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 45 }}>
                                    <label>
                                        Add
                                        <input
                                            style={{ marginLeft: 30 }}
                                            type="checkbox"
                                            checked={formData.M_add}
                                            onChange={() => handleCheckboxChange('M_add')}
                                        />

                                    </label>
                                    <label>
                                        Modity
                                        <input
                                            style={{ marginLeft: 8 }}
                                            type="checkbox"
                                            checked={formData.M_mod}
                                            onChange={() => handleCheckboxChange('M_mod')}
                                        />

                                    </label>
                                    <label>
                                        Delete
                                        <input
                                            style={{ marginLeft: 12 }}
                                            type="checkbox"
                                            checked={formData.M_del}
                                            onChange={() => handleCheckboxChange('M_del')}
                                        />

                                    </label>
                                </div>
                            </div>
                            <div className='saleStock' style={{ display: 'flex', flexDirection: "row" }}>
                                <text className='texttop'>Sale</text>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 50 }}>
                                    <label>
                                        Add
                                        <input
                                            style={{ marginLeft: 30 }}
                                            type="checkbox"
                                            checked={formData.S_add}
                                            onChange={() => handleCheckboxChange('S_add')}
                                        />

                                    </label>
                                    <label>
                                        Modity
                                        <input
                                            style={{ marginLeft: 8 }}
                                            type="checkbox"
                                            checked={formData.S_mod}
                                            onChange={() => handleCheckboxChange('S_mod')}
                                        />

                                    </label>
                                    <label>
                                        Delete
                                        <input
                                            style={{ marginLeft: 12 }}
                                            type="checkbox"
                                            checked={formData.S_del}
                                            onChange={() => handleCheckboxChange('S_del')}
                                        />

                                    </label>
                                </div>
                                <text className='texttop' style={{ marginLeft: 40 }}>Stock Item</text>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 45 }}>
                                    <label>
                                        Add
                                        <input
                                            style={{ marginLeft: 30 }}
                                            type="checkbox"
                                            checked={formData.A_add}
                                            onChange={() => handleCheckboxChange('A_add')}
                                        />

                                    </label>
                                    <label>
                                        Modity
                                        <input
                                            style={{ marginLeft: 8 }}
                                            type="checkbox"
                                            checked={formData.A_mod}
                                            onChange={() => handleCheckboxChange('A_mod')}
                                        />

                                    </label>
                                    <label>
                                        Delete
                                        <input
                                            style={{ marginLeft: 12 }}
                                            type="checkbox"
                                            checked={formData.A_del}
                                            onChange={() => handleCheckboxChange('A_del')}
                                        />

                                    </label>
                                </div>
                            </div>
                            <div className='purchase' style={{ display: 'flex', flexDirection: "row" }}>
                                <span style={{ fontWeight: 'bold' }}>Purchase</span>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 10 }}>
                                    <label>
                                        Add
                                        <input
                                            style={{ marginLeft: 30 }}
                                            type="checkbox"
                                            checked={formData.P_add}
                                            onChange={() => handleCheckboxChange('P_add')}
                                        />

                                    </label>
                                    <label>
                                        Modity
                                        <input
                                            style={{ marginLeft: 8 }}
                                            type="checkbox"
                                            checked={formData.P_mod}
                                            onChange={() => handleCheckboxChange('P_mod')}
                                        />

                                    </label>
                                    <label>
                                        Delete
                                        <input
                                            style={{ marginLeft: 12 }}
                                            type="checkbox"
                                            checked={formData.P_del}
                                            onChange={() => handleCheckboxChange('P_del')}
                                        />

                                    </label>
                                </div>
                                <text className='texttop' style={{ marginLeft: 50 }}>Exice Vch</text>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 50, marginRight: 10 }}>
                                    <label>
                                        Add
                                        <input
                                            style={{ marginLeft: 30 }}
                                            type="checkbox"
                                            checked={formData.E_add}
                                            onChange={() => handleCheckboxChange('E_add')}
                                        />

                                    </label>
                                    <label>
                                        Modity
                                        <input
                                            style={{ marginLeft: 8 }}
                                            type="checkbox"
                                            checked={formData.E_mod}
                                            onChange={() => handleCheckboxChange('E_mod')}
                                        />

                                    </label>
                                    <label>
                                        Delete
                                        <input
                                            style={{ marginLeft: 12 }}
                                            type="checkbox"
                                            checked={formData.E_del}
                                            onChange={() => handleCheckboxChange('E_del')}
                                        />

                                    </label>
                                </div>
                            </div>
                            <div className='saleOrder' style={{ display: 'flex', flexDirection: "row", marginBottom: 20 }}>
                                <text className='texttop'>Sale Order</text>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 20 }}>
                                    <label>
                                        Add
                                        <input
                                            style={{ marginLeft: 30 }}
                                            type="checkbox"
                                            checked={formData.So_add}
                                            onChange={() => handleCheckboxChange('So_add')}
                                        />

                                    </label>
                                    <label>
                                        Modity
                                        <input
                                            style={{ marginLeft: 8 }}
                                            type="checkbox"
                                            checked={formData.So_mod}
                                            onChange={() => handleCheckboxChange('So_mod')}
                                        />

                                    </label>
                                    <label>
                                        Delete
                                        <input
                                            style={{ marginLeft: 12 }}
                                            type="checkbox"
                                            checked={formData.So_del}
                                            onChange={() => handleCheckboxChange('So_del')}
                                        />

                                    </label>
                                </div>
                                <text className='texttop' style={{ marginLeft: 30 }}>Sale Challan</text>
                                <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 30, marginRight: 10 }}>
                                    <label>
                                        Add
                                        <input
                                            style={{ marginLeft: 30 }}
                                            type="checkbox"
                                            checked={formData.Sc_add}
                                            onChange={() => handleCheckboxChange('Sc_add')}
                                        />

                                    </label>
                                    <label>
                                        Modity
                                        <input
                                            style={{ marginLeft: 8 }}
                                            type="checkbox"
                                            checked={formData.Sc_mod}
                                            onChange={() => handleCheckboxChange('Sc_mod')}
                                        />

                                    </label>
                                    <label>
                                        Delete
                                        <input
                                            style={{ marginLeft: 12 }}
                                            type="checkbox"
                                            checked={formData.Sc_del}
                                            onChange={() => handleCheckboxChange('Sc_del')}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                        {/* Right Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', borderStyle: "dashed", borderWidth: 1, borderColor: "black", marginLeft: 30 }}></div>
                        <div className='rightContainer' style={{ display: 'flex', flexDirection: 'row', marginLeft: 20 }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className='cashbook'>
                                    <label>
                                        Cash Book
                                        <input
                                            style={{ marginLeft: 87 }}
                                            type="checkbox"
                                            checked={formData.C_book}
                                            onChange={() => handleCheckboxChange('C_book')}
                                        />
                                    </label>
                                </div>
                                <div className='daybook'>
                                    <label>
                                        Day Book
                                        <input
                                            style={{ marginLeft: 94, marginTop: -10 }}
                                            type="checkbox"
                                            checked={formData.D_book}
                                            onChange={() => handleCheckboxChange('D_book')}
                                        />
                                    </label>
                                </div>
                                <div className='salebook'>
                                    <label>
                                        Sale Book
                                        <input
                                            style={{ marginLeft: 93 }}
                                            type="checkbox"
                                            checked={formData.S_book}
                                            onChange={() => handleCheckboxChange('S_book')}
                                        />
                                    </label>
                                </div>
                                <div className='purbook'>
                                    <label>
                                        Pur Book
                                        <input
                                            style={{ marginLeft: 89 }}
                                            type="checkbox"
                                            checked={formData.P_book}
                                            onChange={() => handleCheckboxChange('P_book')}
                                        />
                                    </label>
                                </div>
                                <div className='bankbook'>
                                    <label>
                                        Bank Book
                                        <input
                                            style={{ marginLeft: 80 }}
                                            type="checkbox"
                                            checked={formData.B_book}
                                            onChange={() => handleCheckboxChange('B_book')}
                                        />
                                    </label>
                                </div>
                                <div className='copyofAc'>
                                    <label>
                                        Copy Of A/c
                                        <input
                                            style={{ marginLeft: 68 }}
                                            type="checkbox"
                                            checked={formData.Coa_book}
                                            onChange={() => handleCheckboxChange('Coa_book')}
                                        />
                                    </label>
                                </div>
                                <div className='Trail'>
                                    <label>
                                        Trail Balance
                                        <input
                                            style={{ marginLeft: 68 }}
                                            type="checkbox"
                                            checked={formData.Tb_book}
                                            onChange={() => handleCheckboxChange('Tb_book')}
                                        />
                                    </label>
                                </div>
                                <div className='balance'>
                                    <label>
                                        Balance Sheet
                                        <input
                                            style={{ marginLeft: 58 }}
                                            type="checkbox"
                                            checked={formData.Bs_book}
                                            onChange={() => handleCheckboxChange('Bs_book')}
                                        />
                                    </label>
                                </div>
                                <div className='Bill'>
                                    <label>
                                        Bill Printing
                                        <input
                                            style={{ marginLeft: 75 }}
                                            type="checkbox"
                                            checked={formData.Bill_book}
                                            onChange={() => handleCheckboxChange('Bill_book')}
                                        />
                                    </label>
                                </div>
                                <div className='stock'>
                                    <label>
                                        Stock Report
                                        <input
                                            style={{ marginLeft: 67 }}
                                            type="checkbox"
                                            checked={formData.S_rep}
                                            onChange={() => handleCheckboxChange('S_rep')}
                                        />
                                    </label>
                                </div>
                                <div className='income'>
                                    <label>
                                        Income Tax Reports
                                        <input
                                            style={{ marginLeft: 20 }}
                                            type="checkbox"
                                            checked={formData.Int_book}
                                            onChange={() => handleCheckboxChange('Int_book')}
                                        />
                                    </label>
                                </div>
                                <div className='ledger'>
                                    <label>
                                        Ledger
                                        <input
                                            style={{ marginLeft: 119 }}
                                            type="checkbox"
                                            checked={formData.L_book}
                                            onChange={() => handleCheckboxChange('L_book')}
                                        />
                                    </label>
                                </div>

                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div className='salepursumm'>
                                    <label>
                                        Sale/Pur Summ
                                        <input
                                            style={{ marginLeft: 20 }}
                                            type="checkbox"
                                            checked={formData.S_summ}
                                            onChange={() => handleCheckboxChange('S_summ')}
                                        />
                                    </label>
                                </div>
                                <div className='outstanding'>
                                    <label>
                                        Outstanding
                                        <input
                                            style={{ marginLeft: 38 }}
                                            type="checkbox"
                                            checked={formData.Plist}
                                            onChange={() => handleCheckboxChange('Plist')}
                                        />
                                    </label>
                                </div>
                                <div className='inttstate'>
                                    <label>
                                        Intt Statement
                                        <input
                                            style={{ marginLeft: 22 }}
                                            type="checkbox"
                                            checked={formData.Stk_book}
                                            onChange={() => handleCheckboxChange('Stk_book')}
                                        />
                                    </label>
                                </div>
                                <div className='excisebook'>
                                    <label>
                                        Excise Books
                                        <input
                                            style={{ marginLeft: 36 }}
                                            type="checkbox"
                                            checked={formData.E_book}
                                            onChange={() => handleCheckboxChange('E_book')}
                                        />
                                    </label>
                                </div>
                                <div className='gstreturn'>
                                    <label>
                                        Gst Return
                                        <input
                                            style={{ marginLeft: 52 }}
                                            type="checkbox"
                                            checked={formData.Vat_ret}
                                            onChange={() => handleCheckboxChange('Vat_ret')}
                                        />
                                    </label>
                                </div>
                                <div className='tcsreport'>
                                    <label>
                                        TCS Reports
                                        <input
                                            style={{ marginLeft: 40 }}
                                            type="checkbox"
                                            checked={formData.Tcs_ret}
                                            onChange={() => handleCheckboxChange('Tcs_ret')}
                                        />
                                    </label>
                                </div>
                                <div className='tdsreport'>
                                    <label>
                                        TDS Reports
                                        <input
                                            style={{ marginLeft: 38 }}
                                            type="checkbox"
                                            checked={formData.Tds_ret}
                                            onChange={() => handleCheckboxChange('Tds_ret')}
                                        />
                                    </label>
                                </div>
                                <div className='trfacc'>
                                    <label>
                                        Trf Accounts
                                        <input
                                            style={{ marginLeft: 37 }}
                                            type="checkbox"
                                            checked={formData.Trf_ac}
                                            onChange={() => handleCheckboxChange('Trf_ac')}
                                        />
                                    </label>
                                </div>
                                <div className='telephone'>
                                    <label>
                                        Telephone dairy
                                        <input
                                            style={{ marginLeft: 10 }}
                                            type="checkbox"
                                            checked={formData.Tel_dir}
                                            onChange={() => handleCheckboxChange('Tel_dir')}
                                        />
                                    </label>
                                </div>
                                <div className='backup'>
                                    <label>
                                        Backup
                                        <input
                                            style={{ marginLeft: 76 }}
                                            type="checkbox"
                                            checked={formData.Bck_book}
                                            onChange={() => handleCheckboxChange('Bck_book')}
                                        />
                                    </label>
                                </div>
                                <div className='setup'>
                                    <label >
                                        Setup
                                        <input
                                            style={{ marginLeft: 88 }}
                                            type="checkbox"
                                            checked={formData.Setup}
                                            onChange={() => handleCheckboxChange('Setup')}
                                        />
                                    </label>
                                </div>
                                <div className='cashsummary'>
                                    <label >
                                        Cash Summary
                                        <input
                                            style={{ marginLeft: 20 }}
                                            type="checkbox"
                                            checked={formData.C_summ}
                                            onChange={() => handleCheckboxChange('C_summ')}
                                        />
                                    </label>
                                </div>
                            </div>
                            {/* passwords Block */}
                            <div className='pass' style={{ display: 'flex', flexDirection: 'column', backgroundColor: "#CCF9E4", padding: 10, height: 300, marginTop: "10%", marginLeft: 20, borderRadius: 10 }}>
                                <div style={{ display: 'flex', flexDirection: 'row', marginTop: 10 }}>
                                    <text>SecurityDays:</text>
                                    <input
                                        className="form-control"
                                        style={{ marginLeft: 42, width: 200, height: 30 }}
                                        value={formData.Sc_days}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: "row", marginTop: 5 }} >
                                    <text>Date:</text>
                                    <div style={{ marginLeft: "30%", height: 10 }}>
                                        <DatePicker
                                            className='custom-datepicker3'
                                            id='date'
                                            selected={selectedDate}
                                            onChange={date => setSelectedDate(date)}
                                            dateFormat="dd-MM-yyyy"
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: 20 }}>
                                    <label >
                                        With Hide Record
                                        <input
                                            style={{ marginLeft: 10 }}
                                            type="checkbox"
                                            checked={formData.Fo_pack}
                                            onChange={() => handleCheckboxChange('Fo_pack')}
                                        />
                                    </label>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }}>
                                    <text>Password:</text>
                                    <input
                                        id='Password'
                                        className="form-control"
                                        style={{ marginLeft: 72, width: 200, height: 30 }}
                                        value={formData.Password}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }}>
                                    <text>ConfirmPassword:</text>
                                    <input className="form-control" style={{ marginLeft: 10, width: 200, height: 30 }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', marginTop: 5 }}>
                                    <text>UserName:</text>
                                    <input
                                        className="form-control"
                                        style={{ marginLeft: 65, width: 200, height: 30 }}
                                        type="text"
                                        id="editedUser"
                                        value={editedUser}
                                        onChange={(e) => setEditedUser(e.target.value)}
                                    />
                                </div>
                                <Button className='button' onClick={handleSaveClick} style={{ marginLeft: "20%", marginTop: 10 }}>SAVE</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordModal;

