import React,{useState,useEffect,useRef}from 'react';
// import Modal from '@mui/material/Modal';
import { Modal, Box, Autocomplete, TextField, Button, Typography } from "@mui/material";
import { styled } from '@mui/system';
import Select from "react-select";
import {toast,ToastContainer } from "react-toastify";
import "./ParentAnnexure.css";
import { useEditMode } from "../../EditModeContext";
import axios from 'axios';
import { CompanyContext } from '../Context/CompanyContext';
import { useContext } from "react";

const StyledModal = styled(Box)({
    position: 'absolute',
    top: '48%',
    left: '55%',
    transform: 'translate(-50%, -50%)',
    width: "60%",
    height: "92%",
    background: 'linear-gradient(to right,rgb(238, 238, 248), #b19cd9)',
    boxShadow: `5px 5px 15px rgb(255, 248, 248),
    -5px -5px 15px rgba(255, 255, 255, 0.1),
    inset 5px 5px 10px rgba(0, 0, 0, 0.2),
    inset -5px -5px 10px rgba(255, 255, 255, 0.2)`,
    border: '2px solid black',
    padding: 16,
    borderRadius: 15,
});

const AnnexureModalParent = ({ isOpen, onClose, onNavigate}) => {

   const { company } = useContext(CompanyContext);
    const tenant = company?.databaseName;
  
    if (!tenant) {
      // you may want to guard here or show an error state,
      // since without a tenant you can’t hit the right API
      console.error("No tenant selected!");
    }
  
    const inputRefs = useRef([]); // Array to hold references for input fields
    const [formData, setFormData] = useState({
     name:"",
     code:0,
     bSheet:"",
     drCr:"",
     desciption:"",
     drCrEffect:0,
     Annxserial:"",
     group:"",
     BalanceSheet: "",
     });
    const [title, setTitle] = useState("(View)");
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [index, setIndex] = useState(0);
    const [isAddEnabled, setIsAddEnabled] = useState(true);
    const [isPreviousEnabled, setIsPreviousEnabled] = useState(true);
    const [isNextEnabled, setIsNextEnabled] = useState(true);
    const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
    const { isEditMode, setIsEditMode } = useEditMode(); // Access the context
    const [isAbcmode, setIsAbcmode] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false); // State to track field disablement
    const [firstTimeCheckData,setFirstTimeCheckData] = useState("")

    const fetchData = async () => {
      try {
          const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/anexure/last`);
          if (response.status === 200 && response.data.data) {
            const lastEntry = response.data.data;
              // Set flags and update form data
              setFirstTimeCheckData("DataAvailable");
              setFormData(lastEntry.formData);
              // Set data and index
              setData1(lastEntry); // Assuming setData1 holds the current entry data
              setIndex(lastEntry.name); // Set index to the voucher number or another identifier
          } else {
              setFirstTimeCheckData("DataNotAvailable");
              console.log("No data available");
              // Create an empty data object with voucher number 0
              const emptyFormData = {
                name:"",
                code:0,
                bSheet:"",
                drCr:"",
                desciption:"",
                drCrEffect:0,
                Annxserial:"",
                group:"",
                BalanceSheet: "",
              };
              // Set the empty data
              setFormData(emptyFormData);
              setData1({ formData: emptyFormData}); // Store empty data
              setIndex(0); // Set index to 0 for the empty voucher
          }
      } catch (error) {
          console.error("Error fetching data", error);
          // In case of error, you can also initialize empty data if needed
          const emptyFormData = {
            name:"",
            code:0,
            bSheet:"",
            drCr:"",
            desciption:"",
            drCrEffect:0,
            Annxserial:"",
            group:"",
            BalanceSheet: "",
          };
          // Set the empty data
          setFormData(emptyFormData);
          setData1({ formData: emptyFormData}); // Store empty data
          setIndex(0);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    try {
        await fetchData(); // This should set up the state correctly whether data is found or not
        let lastvoucherno = formData.code ? parseInt(formData.code) + 1 : 1;
        setTitle("(New)")
          const newData = {
          name:"",
          code:lastvoucherno,
          bSheet:"",
          drCr:"",
          desciption:"",
          drCrEffect:0,
          Annxserial:"",
          group:"",
          BalanceSheet: "",
        };
        setData([...data, newData]);
        setFormData(newData);
        setIndex(data.length);
        setIsAddEnabled(false);
        setIsPreviousEnabled(false);
        setIsNextEnabled(false);
        setIsSubmitEnabled(true);
        setIsDisabled(false);
        setIsEditMode(true);
        // NameRef.current.focus();
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
    } catch (error) {
        console.error("Error adding new entry:", error);
    }
  };

  const handleEditClick = () => {
    setTitle("(Edit)")
    setIsDisabled(false);
    setIsEditMode(true);
    setIsPreviousEnabled(false);
    setIsNextEnabled(false);
    setIsSubmitEnabled(true);
    setIsAbcmode(true);
  };

  const handleNext = async () => {
    document.body.style.backgroundColor = "white";
    console.log(data1._id);
    try {
      if (data1) {
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/anexure/next/${data1._id}`);
        if (response.status === 200 && response.data) {
          const nextData = response.data.data;
          setData1(response.data.data);
          setIndex(index + 1);
          setFormData(nextData.formData);
          setIsDisabled(true);
        }
      }
    } catch (error) {
      console.error("Error fetching next record:", error);
    }
  };

  const handlePrevious = async () => {
    document.body.style.backgroundColor = "white";
    try {
      if (data1) {
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/anexure/previous/${data1._id}`);
        if (response.status === 200 && response.data) {
          console.log(response);
          setData1(response.data.data);
          const prevData = response.data.data;
          setIndex(index - 1);
          setFormData(prevData.formData);
          setIsDisabled(true);
        }
      }
    } catch (error) {
      console.error("Error fetching previous record:", error);
    }
  };

  const handleExit = async () => {
    setTitle("(View)")
    setIsAddEnabled(true); // Enable "Add" button
    setIsPreviousEnabled(true);
    setIsNextEnabled(true);
    setIsSubmitEnabled(false);
    setIsEditMode(false);
    try {
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/anexure/last`); // Fetch the latest data
        if (response.status === 200 && response.data.data) {
            // If data is available
            const lastEntry = response.data.data;
            const lastIndex = response.data.length - 1;
            setFormData(lastEntry.formData); // Set form data
            setData1(response.data.data);
            setIndex(lastIndex);
           setIsDisabled(true); // Disable fields after loading the data
        } else {
            // If no data is available, initialize with default values
            console.log("No data available");
            const newData = {
              name:"",
              code:0,
              bSheet:"",
              drCr:"",
              desciption:"",
              drCrEffect:0,
              Annxserial:"",
              group:"",
              BalanceSheet: "",
            };
            setFormData(newData); // Set default form data
            setIsDisabled(true); // Disable fields after loading the default data
        }
    } catch (error) {
        console.error("Error fetching data", error);
    }
  };

    const handleNavigation = (path) => {
    onNavigate(); // Close the side drawer
    onClose(); // Close the modal
    };

    const handleActionExit = () => {
      if (isEditMode) {
        handleExit();
      } else {
        handleNavigation();
      }
    };
    
    const handleNumericValue = (event) => {
        const { id, value } = event.target;
        // Allow only numeric values, including optional decimal points
        if (/^\d*\.?\d*$/.test(value) || value === '') {
          setFormData((prevData) => ({
            ...prevData,
            [id]: value,
          }));
        }
      };
      const handleValueChange = (event) => {
        const { id, value } = event.target;
        setFormData((prevData) => ({
          ...prevData,
          [id]: value.toUpperCase(), // Convert value to uppercase
        }));
      };
      
 // Flatten data for select dropdown
 const flattenData = (data, parentKey = "") => {
  let options = [];
  for (let key in data) {
    if (typeof data[key] === "object") {
      options = options.concat(flattenData(data[key], `${parentKey}  ${key}`));
    } else {
      options.push(`${parentKey}  ${key}: ${data[key] || ""}`); // Store as raw text
    }
  }
  return options;
};

const optionsList = flattenData(balanceSheetData).map((item) => ({
  label: item,
  value: item, // Store raw text as value
}));

// Handle selection (store raw value)
const handleSelectChange = (selectedOption) => {
  setFormData({ ...formData, BalanceSheet: selectedOption.value });
};

  const handleGroup = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      group: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleCreditDebit = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      drCr: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleDetails = (event) => {
    const { value } = event.target; // Get the selected value from the event
    setFormData((prevState) => ({
      ...prevState,
      bSheet: value, // Update the ratecalculate field in FormData
    }));
  };

  const handleSaveClick = async () => {
    setTitle("(View)")
    let isDataSaved = false;
    try {
      const isValid = formData.name.trim() !== ""; // Ensure no empty spaces
      if (!isValid) {
        toast.error("Please Fill the Name", {
          position: "top-center",
        });
        return; // Prevent save operation
      }
  
      const userConfirmed = window.confirm("Are you sure you want to save the data?");
      if (!userConfirmed) {
        return; // Exit without disabling buttons
      }
  
      const combinedData = {
        _id: formData._id,
        formData: { ...formData }, // Simplified merging
      };
  
      console.log("Combined Data:", combinedData);
  
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/anexure${isAbcmode ? `/${data1._id}` : ""}`;
      const method = isAbcmode ? "put" : "post";
      const response = await axios({
        method,
        url: apiEndpoint,
        data: combinedData,
      });
  
      if (response.status === 200 || response.status === 201) {
        // fetchData();
        isDataSaved = true;
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data. Please try again.", {
        position: "top-center",
      });
    } finally {
      // Only handle button states if user confirmed and data was attempted to be saved
      if (isDataSaved) {
        setIsSubmitEnabled(false); // Disable after successful save
        setIsAddEnabled(true);
        setIsPreviousEnabled(false);
        setIsNextEnabled(false);
        setIsDisabled(true);
        setIsEditMode(false);
        toast.success("Data Saved Successfully!", { position: "top-center" });
      } 
      // Remove else block to avoid changing button states when user cancels
    }
  };

    const handleDeleteClick = async (id) => {
      if (!id) {
        toast.error("Invalid ID. Please select an item to delete.", {
          position: "top-center",
        });
        return;
      }
      const userConfirmed = window.confirm(
        "Are you sure you want to delete this item?"
      );
      if (!userConfirmed) return;
      try {
        const apiEndpoint = `https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/anexure/${data1._id}`;
        const response = await axios.delete(apiEndpoint);
  
        if (response.status === 200) {
          toast.success("Data deleted successfully!", { position: "top-center" });
          fetchData(); // Refresh the data after successful deletion
        } else {
          throw new Error(`Failed to delete data: ${response.statusText}`);
        }
      } catch (error) {
        console.error("Error deleting data:", error);
        toast.error(`Failed to delete data. Error: ${error.message}`, {
          position: "top-center",
        });
      } finally {
     
      }
    };

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent default behavior
      let nextIndex = index + 1;
  
      // Find the next input that is not disabled
      while (inputRefs.current[nextIndex] && inputRefs.current[nextIndex].disabled) {
        nextIndex += 1;
      }
  
      const nextInput = inputRefs.current[nextIndex];
      if (nextInput) {
        nextInput.focus(); // Focus the next enabled input field
      }
    }
  };

  // Search options
    const [open, setOpen] = useState(false); // Modal Visibility
  const [selectedOption, setSelectedOption] = useState(null); // Selected Item
  const autoCompleteRef = useRef(null); // Reference for AutoComplete Input

  // Fetch data from API when component mounts
  useEffect(() => {
    axios
      .get(`https://www.shkunweb.com/shkunlive/shkun_05062025_05062026/tenant/api/anexure`)
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Open Modal and Set Focus to Autocomplete
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      if (autoCompleteRef.current) {
        autoCompleteRef.current.focus(); // Focus Autocomplete
      }
    }, 100); // Delay to ensure modal opens first
  };

  // Close Modal & Clear Selection
  const handleClose = () => {
    setSelectedOption(null); // Reset selection
    setOpen(false);
  };

  // Handle ComboBox Selection & Close Modal on Enter
  const handleSelect = (event, newValue) => {
    if (newValue) {
      setFormData(newValue.formData); // Set Selected Data
      handleClose(); // Close Modal
    }
  };
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            tabIndex={0} // Ensure modal is focusable for keyboard events
        >
            <StyledModal>
            {/* <ToastContainer/> */}
                <h2 style={{ textAlign: 'center', marginBottom: 20, color: '#6242a2',letterSpacing:4,fontFamily:'Times New Roman',fontWeight:'bold'}}>BALANCE SHEET ANNEXURE FORM</h2>
                <text style={{marginLeft:"45%"}}>{title}</text>
                <div style={{display:'flex',flexDirection:'column',marginLeft:"2%"}}>
                <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
                    <text style={{fontSize:18}}>Name</text>
                    <input
                    id='name'
                    className='NAME'
                    value={formData.name}
                    onChange={handleValueChange}
                    readOnly={!isEditMode || isDisabled}
                    ref={(el) => (inputRefs.current[0] = el)} // Assign ref
                      onKeyDown={(e) => handleKeyDown(e, 0)} // Handle Enter key
                    />
                    <Button onClick={handleAdd} style={{backgroundColor:'#7755B7',color:'white',width:"15%",marginLeft:'5%'}}  disabled={!isAddEnabled} >ADD</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
                    <text style={{fontSize:18}}>Code</text>
                    <input
                    id='code'
                    className='Code'
                    value={formData.code}
                    onChange={handleNumericValue}
                    readOnly={!isEditMode || isDisabled}
                    ref={(el) => (inputRefs.current[1] = el)} // Assign ref
                    onKeyDown={(e) => handleKeyDown(e, 1)} // Handle Enter key
                    />
                    <Button onClick={handleEditClick} disabled={!isAddEnabled} style={{backgroundColor:'#7755B7',color:'white',width:"15%",marginLeft:'5%'}}>EDIT</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
                    <text style={{fontSize:18}}>Details in B/Sheet</text>
                    <select
                className="Bsheet"
                id="bSheet"
                style={{
                  backgroundColor: "white",
                  color: "black",
                }}
                value={formData.bSheet}
                onChange={handleDetails}
                disabled={!isEditMode || isDisabled}
                ref={(el) => (inputRefs.current[2] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 2)} // Handle Enter key
              >
                <option value=""></option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
              <Button onClick={handlePrevious} style={{backgroundColor:'#7755B7',color:'white',width:"15%",marginLeft:'5%'}} disabled={!isPreviousEnabled}>PREVIOUS</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
                    <text style={{fontSize:18}}>Debit/Credit</text>
                    <select
                className="DrCr"
                id="drCr"
                style={{
                  backgroundColor: "white",
                  color: "black",
                }}
                value={formData.drCr}
                onChange={handleCreditDebit}
                disabled={!isEditMode || isDisabled}
                ref={(el) => (inputRefs.current[3] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 3)} // Handle Enter key
              >
                <option value=""></option>
                <option value="Credit">Credit</option>
                <option value="Debit">Debit</option>
              </select>
                    <Button onClick={handleNext} style={{backgroundColor:'#7755B7',color:'white',width:"15%",marginLeft:'5%'}} disabled={!isNextEnabled}>NEXT</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
                    <text style={{fontSize:18}}>Description</text>
                    <input
                    id='desciption'
                    className='Description'
                    value={formData.desciption}
                    onChange={handleValueChange}
                    readOnly={!isEditMode || isDisabled}
                    ref={(el) => (inputRefs.current[4] = el)} // Assign ref
                    onKeyDown={(e) => handleKeyDown(e, 4)} // Handle Enter key
                    />
                    <Button onClick={handleDeleteClick} style={{backgroundColor:'#7755B7',color:'white',width:"15%",marginLeft:'5%'}} disabled={!isAddEnabled}>DELETE</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
                    <text style={{fontSize:18}}>Dr/Cr Effect</text>
                    <input
                    id='drCrEffect'
                    className='Effect'
                    value={formData.drCrEffect}
                    onChange={handleNumericValue}
                    readOnly={!isEditMode || isDisabled}
                    ref={(el) => (inputRefs.current[5] = el)} // Assign ref
                    onKeyDown={(e) => handleKeyDown(e, 5)} // Handle Enter key
                    />
                    <Button onClick={handleSaveClick}  
                    ref={(el) => (inputRefs.current[9] = el)} // Assign ref
                    onKeyDown={(e) => handleKeyDown(e, 9)} // Handle Enter key
                    disabled={!isSubmitEnabled} style={{backgroundColor:'#7755B7',color:'white',width:"15%",marginLeft:'5%'}}>SAVE</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
                    <text style={{fontSize:18}}>Annx.Serial</text>
                    <input
                    id='Annxserial'
                    className='Annx'
                    value={formData.Annxserial}
                    onChange={handleValueChange}
                    readOnly={!isEditMode || isDisabled}
                    ref={(el) => (inputRefs.current[6] = el)} // Assign ref
                    onKeyDown={(e) => handleKeyDown(e, 6)} // Handle Enter key
                    />
                    <Button onClick={handleOpen} style={{backgroundColor:'#7755B7',color:'white',width:"15%",marginLeft:'5%'}}>SEARCH</Button>
                </div>
               <Modal open={open} onClose={handleClose}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 400,
                          bgcolor: "background.paper",
                          boxShadow: 24,
                          p: 4,
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="h6" mb={2}>
                          Select Anexure
                        </Typography>
                        <Autocomplete
                          fullWidth
                          options={data}
                          getOptionLabel={(option) => option.formData.name} // Display name
                          value={selectedOption}
                          onChange={handleSelect} // Handle selection
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="outlined"
                              label="Search and Select"
                              inputRef={autoCompleteRef} // Set focus on open
                            />
                          )}
                        />
                      </Box>
                    </Modal>
                <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
                    <text style={{fontSize:18}}>Group</text>
                    <select
                className="Group"
                id="group"
                style={{
                  backgroundColor: "white",
                  color: "black",
                }}
                value={formData.group}
                onChange={handleGroup}
                disabled={!isEditMode || isDisabled}
                ref={(el) => (inputRefs.current[7] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 7)} // Handle Enter key
              >
                <option value=""></option>
                <option value="Trading / Mfg Account">Trading / Mfg Account</option>
                <option value="Profit and Loss Account"> Profit and Loss Account</option>
                <option value="Balance Sheet">Balance Sheet</option>
              </select>
                    <Button onClick={handleActionExit} style={{backgroundColor:'#7755B7',color:'white',width:"15%",marginLeft:'5%'}}>EXIT</Button>
                </div>
                <div style={{display:'flex',flexDirection:'row',marginTop:10}}>
                <text style={{fontSize:18,marginTop:5}}>BalanceSheet</text>
                <Select
                className='MultiSelect'
                options={optionsList}
                value={optionsList.find((option) => option.value === formData.BalanceSheet)}
                onChange={handleSelectChange}
                placeholder="Select balance sheet item..."
                isDisabled={!isEditMode || isDisabled} 
                ref={(el) => (inputRefs.current[8] = el)} // Assign ref
                onKeyDown={(e) => handleKeyDown(e, 8)} // Handle Enter key 
                />
               </div>
                <text style={{fontFamily:'cursive',fontSize:20,fontWeight:'bold',color:'red',letterSpacing:3,marginTop:"8%"}}>NOTE : For New Group Please Click "Add" Button</text>
                </div>
            </StyledModal>
        </Modal>
    );
};

export default AnnexureModalParent;

const balanceSheetData = {
    "1.Shareholders' Funds": {
      "(a) Share Capital": "2",
      "(b) Reserves and Surplus": "3",
      "(c) Money received against Share Warrants": "",
    },
    "2.Share Application Money pending allotment": "4",
    "3.Non-Current Liabilities": {
      "(a) Long-Term Borrowings": "5",
      "(b) Deferred Tax Liabilities (Net)": "6",
      "(c) Other Long-Term Liabilities": "7",
      "(d) Long-Term Provisions": "8",
    },
    "4.Current Liabilities": {
      "(a) Short-Term Borrowings": "5",
      "(b) Trade Payables": {
        "(A) Total outstanding dues of Micro Enterprises and Small Enterprises":
          "",
        "(B) Total outstanding dues of creditors other than Micro Enterprises and Small Enterprises":
          "",
      },
      "(c) Other Current Liabilities": "10",
      "(d) Short-Term Provisions": "8",
    },
    "5.Non-Current Assets": {
      "(a) Property, Plant and Equipment and Intangible Assets": {
        "(i) Property, Plant and Equipment": "11",
        "(ii) Intangible Assets": "12",
        "(iii) Capital Work-in-Progress": "13",
        "(iv) Intangible Assets under Development": "14",
      },
      "(b) Non-Current Investments": "15",
      "(c) Deferred Tax Assets (Net)": "6",
      "(d) Long-Term Loans and Advances": "16",
      "(e) Other Non-Current Assets": "17",
    },
    "6.Current Assets": {
      "(a) Current Investments": "18",
      "(b) Inventories": "19",
      "(c) Trade Receivables": "20",
      "(d) Cash and Cash Equivalents": "21",
      "(e) Short-Term Loans and Advances": "22",
      "(f) Other Current Assets": "23",
    },
  };