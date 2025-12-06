import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import InventoryIcon from '@mui/icons-material/Inventory';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import BalanceIcon from '@mui/icons-material/AccountBalanceWallet';
import LockIcon from '@mui/icons-material/Lock';
import AssessmentIcon from '@mui/icons-material/Assessment'; // Reports icon
import ExtensionIcon from '@mui/icons-material/Extension'; // Extra Features icon
import SecurityIcon from '@mui/icons-material/Security'; // Data Security icon
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Exit icon
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import BookIcon from '@mui/icons-material/Book';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import shkunlogo from './s.jpeg';
import { styled } from '@mui/system';
import PasswordModal from './PasswordModal';
import { useNavigate } from 'react-router-dom';
import { useEditMode } from '../../EditModeContext';
import SaleModal from './SaleModal ';
import PurchaseModal from './PurchaseModal';
import CashModal from './CashModal';
import BankModal from './BankModal';
import TdsModal from './TdsModal';
import SaleWin from './SaleWin';
import AnnexureModalParent from '../Modals/AnnexureModalParent';
import BalanceSheet from '../BalanceSheet/BalanceSheet';
import CBookModal from '../Books/CashBook/CBookModal';
import JournalBook from '../Books/JournalBook/JournalBook';
import GstRateModal from '../Modals/GstRateModal';
import { motion, AnimatePresence } from "framer-motion";

const StyledDrawer = styled(Drawer)({
    '.MuiPaper-root': {
        backgroundColor: '#242c38',
        width: 300,
        height: "98%",
        border: '1px solid #ddd',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2), 0px 7px 30px rgba(0, 0, 0, 0.1)',
        borderRadius: "10px",
        marginLeft: "5px",
        marginTop: "5px",
        marginBottom: "20px",
        transform: 'translateZ(0)',
        transition: 'transform 0.3s ease-in-out',
        overflow:'auto'
    },
    '& .MuiDrawer-paper': {
        overflowY: 'visible',
        transition: 'width 0.3s ease-in-out', // Add width transition
    },
});

const StyledListItem = styled(ListItem)({
    '&:hover': {
        backgroundColor: '#2196F3',
        borderRadius: '10px',
        // padding: '10px 10px',
        fontFamily: 'Arial, sans-serif',
        color: 'white',
        '& .MuiListItemIcon-root': {
            color: '#000000', // Dark icon color on hover
        },
    },
    // padding: '15px 20px',
    transition: 'background-color 0.3s ease-in-out, padding 0.3s ease-in-out, color 0.3s ease-in-out',
});

const StyledListItemText = styled(ListItemText)({
    fontSize: '1.2rem',
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'cursive',
});

const StyledIconButton = styled(IconButton)({
    color: 'white',
    '&:hover': {
        backgroundColor: '#2196F3',
        '& svg': {
            color: 'white',
        },
    },
});


const StyledIcon = styled('div')({
    marginRight: 10,
    color: 'white',
});

// New styled component for logo and company name
const CompanyHeader = styled('div')({
    display: 'flex',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #ddd',
});

const CompanyLogo = styled('img')({
    width: '55px',
    height: '55px',
    marginRight: '10px',
    backgroundColor: 'transparent',
    borderRadius: 40,
});

const CompanyName = styled('div')({
    fontSize: '1.1rem',
    fontWeight: 'bold',
    fontFamily: 'revert',
    letterSpacing: 5,
    color: 'white'

});

export default function App() {
    const navigate = useNavigate(); // Hook for programmatic navigation
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSaleOpen, setIsSaleOpen] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [isGstReportOpen, setIsGstReportOpen] = useState(false);
    const [isTdsTcsOpen, setIsTdsTcsOpen] = useState(false);
    const [isIncomeTaxOpen, setIsIncomeTaxOpen] = useState(false);
    const [isPurReportOpen, setIsPurReportOpen] = useState(false);
    const [isSaleReportOpen, setIsSaleReportOpen] = useState(false);
    const [isBooksOpen, setIsBooksOpen] = useState(false); 
    const [isGoodReturn, setIsGoodReturn] = useState(false); 
    const [isStockOpen, setIsStockOpen] = useState(false); 
    const [isExtraFeatureOpen, setIsExtraFeatureOpen] = useState(false);
    const [isDataSecurityOpen, setIsDataSecurityOpen] = useState(false);
    const { isEditMode } = useEditMode(); // Call the hook here
    const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
    const [isPurModalOpen, setIsPurModalOpen] = useState(false);
    const [isCashModalOpen, setIsCashModalOpen] = useState(false);
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [isTdsModalOpen, setIsTdsModalOpen] = useState(false);
    const [isAnnexureOpen, setIsAnnexureOpen] = useState(false);
    const [isBSheetOpen, setIsBsheetOpen] = useState(false);
    const [isModalOpenCBook, setModalOpenCBook] = useState(false);
    const [isJBookOpen, setJBookOpen] = useState(false);
    const [isOutStandingOpen, setIsOutStandingOpen] = useState(false); 
    const [open, setOpen] = useState(false);

    const handleNavigation = (path) => {
        if (isEditMode) {
            window.open(path, '_blank'); // Open in a new tab if in Edit Mode
            setIsDrawerOpen(false); // Close the drawer after navigation
            setIsSaleOpen(false);
            setIsReportOpen(false);
            setIsGstReportOpen(false);
            setIsTdsTcsOpen(false);
            setIsIncomeTaxOpen(false);
            setIsBooksOpen(false);
            setIsOutStandingOpen(false);
            setIsStockOpen(false);
            setIsExtraFeatureOpen(false);
            setIsDataSecurityOpen(false);
            setIsGoodReturn(false);
        } else {
            navigate(path); // Regular navigation
            setIsDrawerOpen(false); // Close the drawer after navigation
            setIsSaleOpen(false);
            setIsReportOpen(false);
            setIsGstReportOpen(false);
            setIsTdsTcsOpen(false);
            setIsIncomeTaxOpen(false);
            setIsBooksOpen(false);
            setIsOutStandingOpen(false);
            setIsStockOpen(false);
            setIsExtraFeatureOpen(false);
            setIsDataSecurityOpen(false);
            setIsGoodReturn(false);
        }
    };

    const toggleDrawer = (open) => () => {
        setIsDrawerOpen(open);
    };
     const openSaleModal = () => {
        setIsSaleModalOpen(true);
    };

    const closeSaleModal = () => {
        setIsSaleModalOpen(false);
    };
    const openPurModal = () => {
        setIsPurModalOpen(true);
    };

    const closePurModal = () => {
        setIsPurModalOpen(false);
    };
    
    const openCashModal = () => {
        setIsCashModalOpen(true);
    };

    const closeCashModal = () => {
        setIsCashModalOpen(false);
    };

    const openBankModal = () => {
        setIsBankModalOpen(true);
    };

    const closeBankModal = () => {
        setIsBankModalOpen(false);
    };

    const openTdsModal = () => {
        setIsTdsModalOpen(true);
    };

    const closeTdsModal = () => {
        setIsTdsModalOpen(false);
    };

    const openAnnexureParent = () => {
        setIsAnnexureOpen(true);
    };

    const closeAnnexureParent = () => {
        setIsAnnexureOpen(false);
    };

    const OpenBalanceSheet = () => {
        setIsBsheetOpen(true);
    };

    const closeBalanceSheet = () => {
        setIsBsheetOpen(false);
    };

    const openCashBOOk = () => {
        setModalOpenCBook(true);
    };

    const closeCashbook = () => {
        setModalOpenCBook(false);
    };

    const openJournalBOOk = () => {
        setJBookOpen(true);
    };

    const closeJournalbook = () => {
        setJBookOpen(false);
    };

    const handleModalNavigate = () => {
        setIsDrawerOpen(false); // Close the drawer
        setIsSaleModalOpen(false); // Close the modal
        setIsSaleOpen(false);
        setIsReportOpen(false);
        setIsGstReportOpen(false);
        setIsTdsTcsOpen(false);
        setIsIncomeTaxOpen(false);
        setIsBooksOpen(false);
        setIsOutStandingOpen(false);
        setIsStockOpen(false);
        setIsExtraFeatureOpen(false);
        setIsDataSecurityOpen(false);
        setIsGoodReturn(false);
    };
    
    const handleSaleClick = () => {
        setIsSaleOpen(!isSaleOpen);
    };
    const handleReportClick = () => {
        setIsReportOpen(!isReportOpen);
    };
    const handleGstReport = () => {
        setIsGstReportOpen(!isGstReportOpen);
    };
    const handleTdsTcs = () => {
        setIsTdsTcsOpen(!isTdsTcsOpen);
    };
    const handleIncomeTax = () => {
        setIsIncomeTaxOpen(!isIncomeTaxOpen);
    };
    const handleExtraFeature = () => {
        setIsExtraFeatureOpen(!isExtraFeatureOpen);
    };

    const handleDataSecurtiy = () => {
        setIsDataSecurityOpen(!isDataSecurityOpen);
    };

    const handleBooksClick = () => {
        setIsBooksOpen(!isBooksOpen); // Toggle BOOKS section
    };

    const handleOutStandingClick = () => {
        setIsOutStandingOpen(!isOutStandingOpen); // Toggle OutStanding section
    };

    const handleGoodsReturn = () => {
        setIsGoodReturn(!isGoodReturn); // Toggle Goods Return section
    };

        const handleStockClick = () => {
        setIsStockOpen(!isStockOpen); // Toggle Stock section
    };
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const openModal = () => {
        console.log("Modal opened");
        setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div>
            <StyledIconButton onClick={toggleDrawer(true)}>
                <MenuIcon style={{ color: 'black',zIndex:10000 }} />
            </StyledIconButton>
            <StyledDrawer
                anchor="left"
                open={isDrawerOpen}
                onClose={toggleDrawer(false)}
            >
                <CompanyHeader>
                    <CompanyLogo src={shkunlogo} alt="Company Logo" />
                    <CompanyName>SHKUNSOFT INNOVATIONS</CompanyName>
                </CompanyHeader>
                <List>
                <StyledListItem button onClick={() => handleNavigation('/')}>
                        <StyledIcon>
                            <HomeIcon />
                        </StyledIcon>
                        <StyledListItemText primary="HOME" />
                    </StyledListItem>
                    <StyledListItem button
                        onMouseEnter={() => setIsSaleOpen(true)}
                        onMouseLeave={() => setIsSaleOpen(false)}>
                        <StyledIcon>
                            <SyncAltIcon />
                        </StyledIcon>
                        <StyledListItemText primary="TRANSACTION" />
                    </StyledListItem>
                    {/* FLOATING SUBMENU PANEL */}
                    <AnimatePresence>
                    {isSaleOpen && (
                        <motion.div
                            onMouseEnter={() => setIsSaleOpen(true)}
                            onMouseLeave={() => setIsSaleOpen(false)}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.50, ease: "easeOut" }}
                            style={{
                                position: "fixed",
                                top: "80px",
                                left: "305px",
                                width: "250px",
                                background: "#2f3847",
                                borderRadius: "10px",
                                padding: "10px",
                                zIndex: 20000,
                                border: "1px solid #444",
                                boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                            }}
                        >
                        <List>
                            <StyledListItem button onClick={openSaleModal}>
                                <StyledIcon>
                                    <LocalOfferIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Sale" />
                            </StyledListItem>
                            <SaleModal isOpen={isSaleModalOpen} onClose={closeSaleModal} onNavigate={handleModalNavigate}  />
                            <StyledListItem button onClick={openPurModal}>
                                <StyledIcon>
                                    <ShoppingCartIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Purchase" />
                            </StyledListItem>
                            <PurchaseModal isOpen={isPurModalOpen} onClose={closePurModal} onNavigate={handleModalNavigate}  />
                            <StyledListItem button onClick={openCashModal}>
                                <StyledIcon>
                                    <AttachMoneyIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Cash Voucher" />
                            </StyledListItem>
                            <CashModal isOpen={isCashModalOpen} onClose={closeCashModal} onNavigate={handleModalNavigate}  />
                            <StyledListItem button onClick={() => handleNavigation('/JournalVoucher')}>
                                <StyledIcon>
                                    <ReceiptIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Journal Voucher" />
                            </StyledListItem>
                            <StyledListItem button onClick={openBankModal}>
                                <StyledIcon>
                                    <AccountBalanceIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Bank Voucher" />
                            </StyledListItem>
                            <BankModal isOpen={isBankModalOpen} onClose={closeBankModal} onNavigate={handleModalNavigate}  />
                            <StyledListItem button onClick={openTdsModal}>
                                <StyledIcon>
                                    <ReceiptLongIcon />
                                </StyledIcon>
                                <StyledListItemText primary="TDS Voucher" />
                            </StyledListItem>
                            <TdsModal isOpen={isTdsModalOpen} onClose={closeTdsModal} onNavigate={handleModalNavigate}  />
                            <StyledListItem button onClick={() => handleNavigation('/LedgerAcc')}>
                                <StyledIcon>
                                    <AccountTreeIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Ledger Account" />
                            </StyledListItem>
                            <StyledListItem button onClick={() => handleNavigation('/NewStockAcc')}>
                                <StyledIcon>
                                    <InventoryIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Stock Account" />
                            </StyledListItem>
                            <StyledListItem button onClick={openAnnexureParent}>
                                <StyledIcon>
                                    <LocalOfferIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Annexure" />
                            </StyledListItem>
                            <AnnexureModalParent isOpen={isAnnexureOpen} onClose={closeAnnexureParent} onNavigate={handleModalNavigate}/>
                            <StyledListItem button onClick={() => handleNavigation('/StockTransfer')}>
                                <StyledIcon>
                                    <SwapVertIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Stock Transfer" />
                            </StyledListItem>
                            <StyledListItem button onClick={() => handleNavigation('/Productioncard')}>
                                <StyledIcon>
                                <BarChartIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Production Chart" />
                            </StyledListItem>
                            <StyledListItem
                                button
                                onMouseEnter={() => setIsGoodReturn(true)}
                                onMouseLeave={() => setIsGoodReturn(false)}
                            >
                                <StyledIcon><AssignmentReturnIcon /></StyledIcon>
                                <StyledListItemText primary="Goods Return" />
                            </StyledListItem>
                        
                            {isGoodReturn && (
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.50, ease: "easeOut" }}
                                onMouseEnter={() => setIsGoodReturn(true)}
                                onMouseLeave={() => setIsGoodReturn(false)}
                                style={{
                                    position: "fixed",
                                    top: "558px",
                                    left: "555px",   // Drawer(300) + First submenu(250) + 15px gap
                                    width: "220px",
                                    background: "#2f3847",
                                    borderRadius: "10px",
                                    padding: "10px",
                                    zIndex: 30000,
                                    border: "1px solid #444",
                                    boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                                }}
                                >
                                <List>
                                    <StyledListItem button onClick={() => handleNavigation('/SalesReturn')}>
                                        <StyledIcon><MenuBookIcon /></StyledIcon>
                                        <StyledListItemText primary="Sales Return" />
                                    </StyledListItem>

                                    <StyledListItem button onClick={() => handleNavigation('/PurchasesReturn')}>
                                        <StyledIcon><MenuBookIcon /></StyledIcon>
                                        <StyledListItemText primary="Purchase Return" />
                                    </StyledListItem>
                                </List>
                            </motion.div>
                            )}
                        </List>
                        </motion.div>
                    )}
                    </AnimatePresence>
                    {/*Financial Reports Section  */}
                    <StyledListItem button 
                        onMouseEnter={() => setIsReportOpen(true)}
                        onMouseLeave={() => setIsReportOpen(false)}>
                        <StyledIcon>
                            <AssessmentIcon />
                        </StyledIcon>
                        <StyledListItemText primary="FINANCIAL REPORTS" />

                    </StyledListItem>
                    {/* Report – FLOATING RIGHT SUBMENU */}
                    <AnimatePresence>
                    {isReportOpen && (
                    <motion.div
                        onMouseEnter={() => setIsReportOpen(true)}
                        onMouseLeave={() => setIsReportOpen(false)}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.50, ease: "easeOut" }}
                        style={{
                             position: "fixed",
                            top: "208px",
                            left: "305px",     // Aligns right of Drawer (Drawer width = 300)
                            width: "250px",
                            background: "#2f3847",
                            borderRadius: "10px",
                            // padding: "10px",
                            zIndex: 20000,
                            border: "1px solid #444",
                            boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                        }}
                    >
                        <List>
                            <StyledListItem button onClick={() => handleNavigation('/LedgerList')}>
                                <StyledIcon style={{}}>
                                    <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Account Statement" />
                            </StyledListItem>
                            <StyledListItem button onClick={() => handleNavigation('/TrailBalance')}>
                                <StyledIcon style={{}}>
                                    <BalanceIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Trail Balance" />
                            </StyledListItem>
                            <BalanceSheet isOpen={isBSheetOpen} onClose={closeBalanceSheet} onNavigate={handleModalNavigate}/>
                            <StyledListItem button onClick={OpenBalanceSheet}>
                                <StyledIcon style={{}}>
                                    <TableChartIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Balance Sheet" />
                            </StyledListItem>
                            <StyledListItem button onClick={() => handleNavigation('/PaymentList')}>
                                <StyledIcon>
                                    <MenuBookIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Payment List" />
                            </StyledListItem>
                                <StyledListItem button onClick={() => handleNavigation('/ReceiptList')}>
                                <StyledIcon>
                                    <MenuBookIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Receipt List" />
                            </StyledListItem>
                            <StyledListItem
                                button
                                onMouseEnter={() => setIsBooksOpen(true)}
                                onMouseLeave={() => setIsBooksOpen(false)}
                            >
                                <StyledIcon>
                                    <AssessmentIcon />
                                </StyledIcon>
                            <StyledListItemText primary="Books" />
                            </StyledListItem>
                            {/* Books – FLOATING RIGHT SUBMENU */}
                            {isBooksOpen && (
                            <motion.div
                                onMouseEnter={() => setIsBooksOpen(true)}
                                onMouseLeave={() => setIsBooksOpen(false)}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.50, ease: "easeOut" }}
                                style={{
                                    position: "fixed",
                                    top: "328px",
                                    left: "555px",   // Drawer(300) + First submenu(250) + 15px gap
                                    width: "220px",
                                    background: "#2f3847",
                                    borderRadius: "10px",
                                    padding: "10px",
                                    zIndex: 30000,
                                    border: "1px solid #444",
                                    // boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                                }}
                            >
                            <List>
                                <StyledListItem button onClick={() => handleNavigation('/SaleBook')}>
                                        <StyledIcon>
                                            <MenuBookIcon />
                                        </StyledIcon>
                                        <StyledListItemText primary="Sales Book" />
                                </StyledListItem>
                                <StyledListItem button onClick={() => handleNavigation('/PurchaseBook')}>
                                    <StyledIcon>
                                    <MenuBookIcon />
                                    </StyledIcon>
                                    <StyledListItemText primary="Purchase Book" />
                                </StyledListItem>
                                <StyledListItem button onClick={openCashBOOk}>
                                    <StyledIcon>
                                    <MenuBookIcon />
                                    </StyledIcon>
                                    <StyledListItemText primary="Cash Book" />
                                </StyledListItem>
                                <CBookModal isOpen={isModalOpenCBook} handleClose={closeCashbook} onNavigate={handleModalNavigate} />
                                <StyledListItem button onClick={openJournalBOOk}>
                                    <StyledIcon>
                                    <MenuBookIcon />
                                    </StyledIcon>
                                    <StyledListItemText primary="Journal Book" />
                                </StyledListItem>
                                <JournalBook isOpen={isJBookOpen} handleClose={closeJournalbook} onNavigate={handleModalNavigate} />
                                <StyledListItem button onClick={() => handleNavigation('/BankBook')}>
                                    <StyledIcon>
                                    <MenuBookIcon />
                                    </StyledIcon>
                                    <StyledListItemText primary="Bank Book" />
                                </StyledListItem>
                            </List>
                            </motion.div>
                            )}
                            {/* OutStanding Reports */}
                            <StyledListItem
                                button
                                onMouseEnter={() => setIsOutStandingOpen(true)}
                                onMouseLeave={() => setIsOutStandingOpen(false)}
                            >
                                <StyledIcon>
                                    <SummarizeIcon />
                                </StyledIcon>
                            <StyledListItemText primary="OutStanding Reports" />
                            </StyledListItem>
                            {/* Outstanding – FLOATING RIGHT SUBMENU */}
                            {isOutStandingOpen && (
                            <motion.div
                                onMouseEnter={() => setIsOutStandingOpen(true)}
                                onMouseLeave={() => setIsOutStandingOpen(false)}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.50, ease: "easeOut" }}
                                style={{
                                    position: "fixed",
                                    top: "474px",
                                    left: "555px",   // Drawer(300) + First submenu(250) + 15px gap
                                    width: "220px",
                                    background: "#2f3847",
                                    borderRadius: "10px",
                                    padding: "10px",
                                    zIndex: 30000,
                                    border: "1px solid #444",
                                    // boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                                }}
                            >
                            <List>
                               <StyledListItem button onClick={() => handleNavigation('/DebtorsList')}>
                                    <StyledIcon>
                                        <MenuBookIcon />
                                    </StyledIcon>
                                    <StyledListItemText primary="Debtors" />
                                </StyledListItem>
                                <StyledListItem button onClick={() => handleNavigation('/CreditorsList')}>
                                    <StyledIcon>
                                        <MenuBookIcon />
                                    </StyledIcon>
                                    <StyledListItemText primary="Creditors" />
                                </StyledListItem>
                            </List>
                            </motion.div>
                            )}
                            {/* OutStanding Reports */}
                            <StyledListItem
                                button
                                onMouseEnter={() => setIsStockOpen(true)}
                                onMouseLeave={() => setIsStockOpen(false)}
                            >
                                <StyledIcon>
                                    <ShowChartIcon />
                                </StyledIcon>
                            <StyledListItemText primary="Stock Reports" />
                            </StyledListItem>
                            {/* Stock Report – FLOATING RIGHT SUBMENU */}
                            {isStockOpen && (
                            <motion.div
                                onMouseEnter={() => setIsStockOpen(true)}
                                onMouseLeave={() => setIsStockOpen(false)}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.50, ease: "easeOut" }}
                                style={{
                                    position: "fixed",
                                    top: "475px",
                                    left: "555px",   // Drawer(300) + First submenu(250) + 15px gap
                                    width: "300px",
                                    background: "#2f3847",
                                    borderRadius: "10px",
                                    padding: "10px",
                                    zIndex: 30000,
                                    border: "1px solid #444",
                                    // boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                                }}
                            >
                            <List>
                               <StyledListItem button onClick={() => handleNavigation('/StockReport')}>
                                <StyledIcon>
                                    <WidgetsIcon  />
                                </StyledIcon>
                                <StyledListItemText primary="Particular Item" />
                            </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/StockSummary')}>
                                <StyledIcon>
                                    <ViewModuleIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Stock Pieces & Weight" />
                            </StyledListItem>
                            </List>
                            </motion.div>
                            )}
                        </List>
                    </motion.div>
                    )}
                    </AnimatePresence>
                    {/* GST Reports */}
                    <StyledListItem button 
                        onMouseEnter={() => setIsGstReportOpen(true)}
                        onMouseLeave={() => setIsGstReportOpen(false)}>
                        <StyledIcon>
                            <DescriptionIcon />
                        </StyledIcon>
                        <StyledListItemText primary="GST REPORTS" />
                    </StyledListItem>
                    {/* GST Report – FLOATING RIGHT SUBMENU */}
                    {isGstReportOpen && (
                    <motion.div
                        onMouseEnter={() => setIsGstReportOpen(true)}
                        onMouseLeave={() => setIsGstReportOpen(false)}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.50, ease: "easeOut" }}
                        style={{
                            position: "fixed",
                            top: "0px",
                            left: "305px",
                            width: "300px",
                            background: "#2f3847",
                            borderRadius: "10px",
                            padding: "10px",
                            zIndex: 30000,
                            border: "1px solid #444",
                            // boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                        }}
                    >
                    <List>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Monthly Forms" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/GstRegister')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="GST Ledger" />
                        </StyledListItem>
                        {/*  */}
                        <StyledListItem button onClick={() => handleNavigation('/GstWorksheet')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="WorkSheet" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="GSTR-2 Filed Status" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="GSTR-3B Yearly Summary" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="GSTR-3B Reconciliation" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Party Wise GST Details" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Party Wise GST Summary" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Account Wise GST Details" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Other Details" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Yearly GSTR-9" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Tax Wise Summary" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="GSTIN Wise Expenditure" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <DescriptionIcon />
                            </StyledIcon>
                            <StyledListItemText primary="HSN Wise Inward / Outward" />
                        </StyledListItem>
                    </List>
                    </motion.div>
                    )}
                    {/* TDS/TCS Reports */}
                    <StyledListItem button 
                        onMouseEnter={() => setIsTdsTcsOpen(true)}
                        onMouseLeave={() => setIsTdsTcsOpen(false)}>
                        <StyledIcon>
                            <ReceiptIcon />
                        </StyledIcon>
                        <StyledListItemText primary="TDS/TCS REPORTS" />
                    </StyledListItem>
                    {/* Tds/Tcds Report – FLOATING RIGHT SUBMENU */}
                    {isTdsTcsOpen && (
                    <motion.div
                        onMouseEnter={() => setIsTdsTcsOpen(true)}
                        onMouseLeave={() => setIsTdsTcsOpen(false)}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.50, ease: "easeOut" }}
                        style={{
                            position: "fixed",
                            top: "300px",
                            left: "305px",
                            width: "300px",
                            background: "#2f3847",
                            borderRadius: "10px",
                            padding: "10px",
                            zIndex: 30000,
                            border: "1px solid #444",
                            // boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                        }}
                    >
                    <List>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <ReceiptIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Form 16-A" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <ReceiptIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Form 26-Q" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <ReceiptIcon />
                            </StyledIcon>
                            <StyledListItemText primary="194-Q Detail" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <ReceiptIcon />
                            </StyledIcon>
                            <StyledListItemText primary="194-Q Check List" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <ReceiptIcon />
                            </StyledIcon>
                            <StyledListItemText primary="TCS & TDS Combine List" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <ReceiptIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Commission List" />
                        </StyledListItem>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <ReceiptIcon />
                            </StyledIcon>
                            <StyledListItemText primary="TCS Reports" />
                        </StyledListItem>
                    </List>
                    </motion.div>
                    )}
                    {/* IncomeTax Reports */}
                    <StyledListItem button     
                        onMouseEnter={() => setIsIncomeTaxOpen(true)}
                        onMouseLeave={() => setIsIncomeTaxOpen(false)}
                        >
                        <StyledIcon>
                            <ReceiptLongIcon />
                        </StyledIcon>
                        <StyledListItemText primary="INCOME TAX REPORTS" />
                    </StyledListItem>
                    {/* IncomeTax Report – FLOATING RIGHT SUBMENU */}
                    {isIncomeTaxOpen && (
                    <motion.div
                        onMouseEnter={() => setIsIncomeTaxOpen(true)}
                        onMouseLeave={() => setIsIncomeTaxOpen(false)}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.50, ease: "easeOut" }}
                        style={{
                            position: "fixed",
                            top: "350px",
                            left: "305px",
                            width: "300px",
                            background: "#2f3847",
                            borderRadius: "10px",
                            // padding: "10px",
                            zIndex: 30000,
                            border: "1px solid #444",
                            // boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                        }}
                    >
                    <List>
                        <StyledListItem button 
                            onMouseEnter={() => setIsPurReportOpen(true)}
                            onMouseLeave={() => setIsPurReportOpen(false)}
                        >
                            <StyledIcon style={{}}>
                                <ReceiptLongIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Purchase Report" />
                        </StyledListItem>
                        {isPurReportOpen && (
                        <motion.div
                            onMouseEnter={() => setIsPurReportOpen(true)}
                            onMouseLeave={() => setIsPurReportOpen(false)}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.50, ease: "easeOut" }}
                            style={{
                                position: "fixed",
                                top: "350px",
                                left: "600px",   // Drawer(300) + First submenu(250) + 15px gap
                                width: "300px",
                                background: "#2f3847",
                                borderRadius: "10px",
                                padding: "10px",
                                zIndex: 30000,
                                border: "1px solid #444",
                                // boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                            }}
                        >
                        <List>
                            <StyledListItem button onClick={() => handleNavigation('/IncomeTaxReport')}>
                                <StyledIcon>
                                    <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Party Wise Summary" />
                            </StyledListItem>
                            <StyledListItem button onClick={() => handleNavigation('/')}>
                                <StyledIcon>
                                     <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="A/C Wise Summary" />
                            </StyledListItem>
                            <StyledListItem button onClick={() => handleNavigation('/')}>
                                <StyledIcon>
                                    <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Product Wise Purchase" />
                            </StyledListItem>
                             <StyledListItem button onClick={() => handleNavigation('/')}>
                                <StyledIcon>
                                    <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Product Wise Detail" />
                            </StyledListItem>
                             <StyledListItem button onClick={() => handleNavigation('/')}>
                                <StyledIcon>
                                    <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="State Wise Summary" />
                            </StyledListItem>
                             <StyledListItem button onClick={() => handleNavigation('/')}>
                                <StyledIcon>
                                    <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Broker Wise Summary" />
                            </StyledListItem>
                        </List>
                        </motion.div>
                        )}
                        <StyledListItem button 
                            onMouseEnter={() => setIsSaleReportOpen(true)}
                            onMouseLeave={() => setIsSaleReportOpen(false)}
                        >
                            <StyledIcon style={{}}>
                                <ReceiptLongIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Sale Reports" />
                        </StyledListItem>
                        {isSaleReportOpen && (
                        <motion.div
                            onMouseEnter={() => setIsSaleReportOpen(true)}
                            onMouseLeave={() => setIsSaleReportOpen(false)}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.50, ease: "easeOut" }}
                            style={{
                                position: "fixed",
                                top: "350px",
                                left: "600px",   // Drawer(300) + First submenu(250) + 15px gap
                                width: "300px",
                                background: "#2f3847",
                                borderRadius: "10px",
                                padding: "10px",
                                zIndex: 30000,
                                border: "1px solid #444",
                                // boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                            }}
                        >
                        <List>
                            <StyledListItem button onClick={() => handleNavigation('/')}>
                                <StyledIcon>
                                    <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Party Wise Summary" />
                            </StyledListItem>
                            <StyledListItem button onClick={() => handleNavigation('/')}>
                                <StyledIcon>
                                     <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="A/C Wise Summary" />
                            </StyledListItem>
                            <StyledListItem button onClick={() => handleNavigation('/')}>
                                <StyledIcon>
                                    <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Product Wise Sale" />
                            </StyledListItem>
                             <StyledListItem button onClick={() => handleNavigation('/')}>
                                <StyledIcon>
                                    <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Product Wise Detail" />
                            </StyledListItem>
                             <StyledListItem button onClick={() => handleNavigation('/')}>
                                <StyledIcon>
                                    <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="State Wise Summary" />
                            </StyledListItem>
                             <StyledListItem button onClick={() => handleNavigation('/')}>
                                <StyledIcon>
                                    <DescriptionIcon />
                                </StyledIcon>
                                <StyledListItemText primary="Broker Wise Summary" />
                            </StyledListItem>
                        </List>
                        </motion.div>
                        )}
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <ReceiptLongIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Section 40A(3) Detail" />
                        </StyledListItem>
                    </List>
                    </motion.div>
                    )}
                    {/* Extra Features */}
                    <StyledListItem button 
                        onMouseEnter={() => setIsExtraFeatureOpen(true)}
                        onMouseLeave={() => setIsExtraFeatureOpen(false)}>
                        <StyledIcon>
                            <ExtensionIcon />
                        </StyledIcon>
                        <StyledListItemText primary="EXTRA FEATURES" />
                    </StyledListItem>
                    {/* Extra Feature Report – FLOATING RIGHT SUBMENU */}
                    {isExtraFeatureOpen && (
                    <motion.div
                        onMouseEnter={() => setIsExtraFeatureOpen(true)}
                        onMouseLeave={() => setIsExtraFeatureOpen(false)}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.50, ease: "easeOut" }}
                        style={{
                            position: "fixed",
                            top: "390px",
                            left: "305px",
                            width: "300px",
                            background: "#2f3847",
                            borderRadius: "10px",
                            padding: "10px",
                            zIndex: 30000,
                            border: "1px solid #444",
                            // boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                        }}
                    >
                    <List>
                        <StyledListItem button onClick={() => handleNavigation('/companies')}>
                            <StyledIcon style={{}}>
                                <BalanceIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Change Company" />
                        </StyledListItem>
                        <StyledListItem button onClick={openModal}>
                            <StyledIcon>
                                <LockIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Password Setting" />
                        </StyledListItem>
                        {isModalOpen && <PasswordModal onClose={closeModal} />}
                        <StyledListItem button onClick={() => handleNavigation('/Setup')}>
                            <StyledIcon>
                                <SettingsIcon />
                            </StyledIcon>
                            <StyledListItemText primary="Setup" />
                        </StyledListItem>
                        {/* <StyledListItem button onClick={openSale_WinModal}>
                            <StyledIcon>1
                                <SettingsIcon />
                            </StyledIcon>
                            <StyledListItemText primary="SALE WIN" />
                        </StyledListItem>
                        <SaleWin isOpen={isSale_winOpen} onClose={closeSale_WinModal} /> */}
                    </List>
                    </motion.div>
                    )}
                    {/* Data Security */}
                    <StyledListItem button 
                        onMouseEnter={() => setIsDataSecurityOpen(true)}
                        onMouseLeave={() => setIsDataSecurityOpen(false)}>
                        <StyledIcon>
                            <SecurityIcon />
                        </StyledIcon>
                        <StyledListItemText primary="DATA SECURITY" />
                    </StyledListItem>
                    {/* Extra Feature Report – FLOATING RIGHT SUBMENU */}
                    {isDataSecurityOpen && (
                    <motion.div
                        onMouseEnter={() => setIsDataSecurityOpen(true)}
                        onMouseLeave={() => setIsDataSecurityOpen(false)}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        transition={{ duration: 0.50, ease: "easeOut" }}
                        style={{
                            position: "fixed",
                            top: "440px",
                            left: "305px",
                            width: "300px",
                            background: "#2f3847",
                            borderRadius: "10px",
                            padding: "10px",
                            zIndex: 30000,
                            border: "1px solid #444",
                            // boxShadow: "0px 4px 20px rgba(0,0,0,0.3)"
                        }}
                    >
                    <List>
                        <StyledListItem button onClick={() => handleNavigation('/')}>
                            <StyledIcon style={{}}>
                                <BalanceIcon />
                            </StyledIcon>
                            <StyledListItemText primary="COPY FOLDER DATA" />
                        </StyledListItem>
                    </List>
                    </motion.div>
                    )}
                    <StyledListItem button onClick={() => handleNavigation('/')}>
                        <StyledIcon>
                            <ExitToAppIcon />
                        </StyledIcon>
                        <StyledListItemText primary="EXIT" />
                    </StyledListItem>
                </List>
                <Divider />
                {/* Additional list items or content can be added here */}
            </StyledDrawer>
            <div>
                {/* Other components or content */}
            </div>
        </div>
    );
}

