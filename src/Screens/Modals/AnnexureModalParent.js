import React,{useState,useEffect,useRef}from 'react';
import { Modal, Box, Autocomplete, TextField, Button, Typography } from "@mui/material";
import { styled } from '@mui/system';
import Select from "react-select";
import {toast,ToastContainer } from "react-toastify";
import "./ParentAnnexure.css";
import { useEditMode } from "../../EditModeContext";
import axios from 'axios';
import { CompanyContext } from '../Context/CompanyContext';
import { useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";


const StyledModal = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 820,
  background: "#ffffff",
  borderRadius: 14,
  boxShadow: "0 15px 50px rgba(0,0,0,0.25)",
  overflow: "hidden",
});

const actionBtn = {
  justifyContent: "flex-start",
  fontWeight: 600,
  letterSpacing: 1,
  background: "linear-gradient(135deg,#6a5acd,#7b68ee)",
  color: "#fff",
  "&:hover": {
    background: "linear-gradient(135deg,#5a4bd4,#6b5ce7)",
  },
};

const AnnexureModalParent = ({ isOpen, onClose, onNavigate}) => {

   const { company } = useContext(CompanyContext);
    const tenant = "03AAYFG4472A1ZG_01042025_31032026";
  
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
    const [title, setTitle] = useState("VIEW");
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
          const response = await axios.get(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/anexure/last`);
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
        setTitle("NEW")
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
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
    } catch (error) {
        console.error("Error adding new entry:", error);
    }
  };

  const handleEditClick = () => {
    setTitle("EDIT")
    setIsDisabled(false);
    setIsEditMode(true);
    setIsPreviousEnabled(false);
    setIsNextEnabled(false);
    setIsSubmitEnabled(true);
    setIsAbcmode(true);
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  };

  const handleNext = async () => {
    document.body.style.backgroundColor = "white";
    console.log(data1._id);
    try {
      if (data1) {
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/anexure/next/${data1._id}`);
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
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/anexure/previous/${data1._id}`);
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
    setTitle("VIEW")
    setIsAddEnabled(true); // Enable "Add" button
    setIsPreviousEnabled(true);
    setIsNextEnabled(true);
    setIsSubmitEnabled(false);
    setIsEditMode(false);
    try {
        const response = await axios.get(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/anexure/last`); // Fetch the latest data
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

    useEffect(() => {
      const handleEscKey = (event) => {
        if (event.key === "Escape" && isOpen) {
          event.preventDefault();
          event.stopPropagation();

          if (isEditMode) {
            // Only exit edit mode
            handleExit();
          } else {
            // Close modal normally
            handleNavigation();
          }
        }
      };

      window.addEventListener("keydown", handleEscKey);

      return () => {
        window.removeEventListener("keydown", handleEscKey);
      };
    }, [isEditMode, isOpen]);
    
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
    setTitle("VIEW")
    let isDataSaved = false;
    try {
      const isValid = formData.name.trim() !== ""; // Ensure no empty spaces
      if (!isValid) {
        toast.error("Please Fill the Name", {
          position: "top-center",
        });
        return; // Prevent save operation
      }
  
      const combinedData = {
        _id: formData._id,
        formData: { ...formData }, // Simplified merging
      };
  
      console.log("Combined Data:", combinedData);
  
      const apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/anexure${isAbcmode ? `/${data1._id}` : ""}`;
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
        setIsPreviousEnabled(true);
        setIsNextEnabled(true);
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
        const apiEndpoint = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/anexure/${data1._id}`;
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
        e.preventDefault();

        let nextIndex = index + 1;

        // Skip disabled inputs
        while (
          inputRefs.current[nextIndex] &&
          inputRefs.current[nextIndex].disabled
        ) {
          nextIndex += 1;
        }

        const nextInput = inputRefs.current[nextIndex];

        if (nextInput) {
          nextInput.focus();
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
      .get(`https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/anexure`)
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
      <>
      <Modal
          open={isOpen}
          disableEscapeKeyDown
          onClose={(event, reason) => {
            if (reason !== "backdropClick") {
              handleNavigation();
            }
          }}
        >
        <StyledModal>

          {/* HEADER */}
          <Box
            sx={{
              background: "linear-gradient(135deg,#6a5acd,#7b68ee)",
              color: "white",
              p: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" fontWeight="bold" letterSpacing={2}>
              BALANCE SHEET ANNEXURE
            </Typography>

            <Typography variant="subtitle2">{title}</Typography>
          </Box>

          {/* BODY */}
          <Box sx={{ display: "flex", gap: 3, p: 3 }}>

            {/* FORM SECTION */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >

              <TextField
                label="NAME"
                id="name"
                size="small"
                variant='filled'
                className="custom-bordered-input"
                value={formData.name}
                onChange={handleValueChange}
                InputProps={{ readOnly: !isEditMode || isDisabled }}
                inputRef={(el) => (inputRefs.current[0] = el)}
                onKeyDown={(e) => handleKeyDown(e, 0)}
              />

              <TextField
                label="CODE"
                id="code"
                variant='filled'
                className="custom-bordered-input"
                size="small"
                value={formData.code}
                onChange={handleValueChange}
                InputProps={{ readOnly: !isEditMode || isDisabled }}
                inputRef={(el) => (inputRefs.current[1] = el)}
                onKeyDown={(e) => handleKeyDown(e, 1)}
              />

              <TextField
                select
                label="DETAIL IN B.SHEET"
                id="bSheet"
                variant='filled'
                className="custom-bordered-input"
                size="small"
                value={formData.bSheet}
                onChange={handleDetails}
                InputProps={{
                  readOnly: !isEditMode || isDisabled
                }}
                onMouseDown={(e) => {
                  if (!isEditMode || isDisabled) {
                    e.preventDefault(); // prevents dropdown
                  }
                }}
                SelectProps={{ native: true }}
                inputRef={(el) => (inputRefs.current[2] = el)}
                onKeyDown={(e) => handleKeyDown(e, 2)}
              >
                <option value=""></option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </TextField>

              <TextField
                select
                label="DEBIT / CREDIT"
                id="drCr"
                size="small"
                variant='filled'
                className="custom-bordered-input"
                value={formData.drCr}
                onChange={handleCreditDebit}
                InputProps={{
                  readOnly: !isEditMode || isDisabled
                }}
                onMouseDown={(e) => {
                  if (!isEditMode || isDisabled) {
                    e.preventDefault(); // prevents dropdown
                  }
                }}
                SelectProps={{ native: true }}
                inputRef={(el) => (inputRefs.current[3] = el)}
                onKeyDown={(e) => handleKeyDown(e, 3)}
              >
                <option value=""></option>
                <option value="Credit">Credit</option>
                <option value="Debit">Debit</option>
              </TextField>

              <TextField
                label="DESCRIPTION"
                id="desciption"
                size="small"
                variant='filled'
                className="custom-bordered-input"
                value={formData.desciption}
                onChange={handleValueChange}
                InputProps={{ readOnly: !isEditMode || isDisabled }}
                inputRef={(el) => (inputRefs.current[4] = el)}
                onKeyDown={(e) => handleKeyDown(e, 4)}
              />

              <TextField
                label="DR / CR EFFECT"
                id="drCrEffect"
                size="small"
                variant='filled'
                className="custom-bordered-input"
                value={formData.drCrEffect}
                onChange={handleNumericValue}
                InputProps={{ readOnly: !isEditMode || isDisabled }}
                inputRef={(el) => (inputRefs.current[5] = el)}
                onKeyDown={(e) => handleKeyDown(e, 5)}
              />

              <TextField
                label="ANNX SERIAL"
                id="Annxserial"
                size="small"
                variant='filled'
                className="custom-bordered-input"
                value={formData.Annxserial}
                onChange={handleValueChange}
                InputProps={{ readOnly: !isEditMode || isDisabled }}
                inputRef={(el) => (inputRefs.current[6] = el)}
                onKeyDown={(e) => handleKeyDown(e, 6)}
              />

              <TextField
                select
                label="GROUP"
                id="group"
                size="small"
                variant='filled'
                className="custom-bordered-input"
                value={formData.group}
                onChange={handleGroup}
                InputProps={{
                  readOnly: !isEditMode || isDisabled
                }}
                onMouseDown={(e) => {
                  if (!isEditMode || isDisabled) {
                    e.preventDefault(); // prevents dropdown
                  }
                }}
                SelectProps={{ native: true }}
                inputRef={(el) => (inputRefs.current[7] = el)}
                onKeyDown={(e) => handleKeyDown(e, 7)}
              >
                <option value=""></option>
                <option value="Trading / Mfg Account">
                  Trading / Mfg Account
                </option>
                <option value="Profit and Loss Account">
                  Profit and Loss Account
                </option>
                <option value="Balance Sheet">Balance Sheet</option>
              </TextField>

              <Autocomplete
                options={optionsList}
                disableClearable
                getOptionLabel={(option) => option.label || ""}
                value={
                  optionsList.find(
                    (option) => option.value === formData.BalanceSheet
                  ) || null
                }
                onChange={(event, newValue) => handleSelectChange(newValue)}
                open={isEditMode && !isDisabled ? undefined : false}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="BALANCE SHEET"
                    size="small"
                    variant='filled'
                    className="custom-bordered-input"
                    InputProps={{
                      ...params.InputProps,
                      readOnly: !isEditMode || isDisabled
                    }}
                    inputRef={(el) => (inputRefs.current[8] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 8)}
                  />
                )}
              />
            </Box>

            {/* BUTTON PANEL */}
            <Box
              sx={{
                width: 200,
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
                background: "#f7f7fb",
                p: 2,
                borderRadius: 2,
              }}
            >

              <Button startIcon={<AddIcon />} sx={actionBtn} onClick={handleAdd} disabled={!isAddEnabled}>ADD</Button>

              <Button startIcon={<EditIcon />} sx={actionBtn} onClick={handleEditClick} disabled={!isAddEnabled}>EDIT</Button>

              <Button startIcon={<NavigateBeforeIcon />} sx={actionBtn} onClick={handlePrevious} disabled={!isPreviousEnabled}>PREVIOUS</Button>

              <Button startIcon={<NavigateNextIcon />} sx={actionBtn} onClick={handleNext} disabled={!isNextEnabled}>NEXT</Button>

              <Button startIcon={<DeleteIcon />} sx={actionBtn} onClick={handleDeleteClick} disabled={!isAddEnabled}>DELETE</Button>

              <Button startIcon={<SaveIcon />} sx={actionBtn} onClick={handleSaveClick} disabled={!isAddEnabled} ref={(el) => (inputRefs.current[9] = el)} >SAVE</Button>

              <Button startIcon={<SearchIcon />} sx={actionBtn} onClick={handleOpen} disabled={!isAddEnabled}>SEARCH</Button>

              <Button startIcon={<ExitToAppIcon />} sx={actionBtn} onClick={handleActionExit}>EXIT</Button>

            </Box>

          </Box>

        </StyledModal>
      </Modal>
      {/* Search */}
      <Modal
        open={open}
        onClose={handleClose}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            SEARCH ANNEXURE
          </Typography>

          <Autocomplete
            options={data}
            getOptionLabel={(option) => option?.formData?.name || ""}
            onChange={handleSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Name"
                inputRef={autoCompleteRef}
                autoFocus
                size="small"
              />
            )}
          />

          <Box mt={2} textAlign="right">
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
      </>
      
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