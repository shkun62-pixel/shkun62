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
        padding: '10px 10px',
        fontFamily: 'Arial, sans-serif',
        color: 'white',
        '& .MuiListItemIcon-root': {
            color: '#000000', // Dark icon color on hover
        },
    },
    padding: '15px 20px',
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
                    <StyledListItem button onClick={handleSaleClick}>
                        <StyledIcon>
                            <SyncAltIcon />
                        </StyledIcon>
                        <StyledListItemText primary="TRANSACTION" />
                        {isSaleOpen ? <ExpandLess /> : <ExpandMore />}
                    </StyledListItem>
                    <div style={{ marginLeft: 20 }}>
                        <Collapse in={isSaleOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
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
                                <StyledListItem button onClick={handleGoodsReturn}>
                                    <StyledIcon>
                                        <AssignmentReturnIcon />
                                    </StyledIcon>
                                    <StyledListItemText primary="Goods Return" />
                                    {isGoodReturn ? <ExpandLess /> : <ExpandMore />}
                                </StyledListItem>
                                <div style={{ marginLeft: 20 }}>
                                    <Collapse in={isGoodReturn} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                        <StyledListItem button onClick={() => handleNavigation('/SalesReturn')}>
                                                <StyledIcon>
                                                    <MenuBookIcon />
                                                </StyledIcon>
                                                <StyledListItemText primary="Sales Return" />
                                            </StyledListItem>
                                            <StyledListItem button onClick={() => handleNavigation('/PurchasesReturn')}>
                                                <StyledIcon>
                                                <MenuBookIcon />
                                                </StyledIcon>
                                                <StyledListItemText primary="Purchase Return" />
                                            </StyledListItem>
                                        </List>
                                    </Collapse>
                                </div>
                            </List>
                        </Collapse>
                    </div>
                    {/*Reports Section  */}
                    <StyledListItem button onClick={handleReportClick}>
                        <StyledIcon>
                            <AssessmentIcon />
                        </StyledIcon>
                        <StyledListItemText primary="REPORTS" />
                        {isReportOpen ? <ExpandLess /> : <ExpandMore />}
                    </StyledListItem>
                    <div style={{ marginLeft: 20 }}>
                        <Collapse in={isReportOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
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
                                <StyledListItem button onClick={handleBooksClick}>
                                    <StyledIcon>
                                        <BookIcon />
                                    </StyledIcon>
                                    <StyledListItemText primary="BOOKS" />
                                    {isBooksOpen ? <ExpandLess /> : <ExpandMore />}
                                </StyledListItem>
                                <div style={{ marginLeft: 20 }}>
                                    <Collapse in={isBooksOpen} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
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
                                    </Collapse>
                                </div>

                                {/* OutStandiing Reports */}
                                 <StyledListItem button onClick={handleOutStandingClick}>
                                    <StyledIcon>
                                        <SummarizeIcon />
                                    </StyledIcon>
                                    <StyledListItemText primary="OutStanding Reports" />
                                    {isOutStandingOpen ? <ExpandLess /> : <ExpandMore />}
                                </StyledListItem>
                                <div style={{ marginLeft: 20 }}>
                                <Collapse in={isOutStandingOpen} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
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
                                </Collapse>
                                </div>

                                {/* Stock Section */}
                                <StyledListItem button onClick={handleStockClick}>
                                    <StyledIcon>
                                        <ShowChartIcon  />
                                    </StyledIcon>
                                    <StyledListItemText primary="STOCKS..." />
                                    {isStockOpen ? <ExpandLess /> : <ExpandMore />}
                                </StyledListItem>
                                <div style={{ marginLeft: 20 }}>
                                    <Collapse in={isStockOpen} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
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
                                    </Collapse>
                                </div>
                                <StyledListItem button onClick={() => setOpen(true)}>
                                    <StyledIcon style={{}}>
                                        <TableChartIcon />
                                    </StyledIcon>
                                    <StyledListItemText primary="Define GST Rate" />
                                </StyledListItem>
                                <GstRateModal open={open} onClose={() => setOpen(false)} />
                            </List>
                        </Collapse>
                    </div>
                    {/* Extra Features */}
                    <StyledListItem button onClick={handleExtraFeature}>
                        <StyledIcon>
                            <ExtensionIcon />
                        </StyledIcon>
                        <StyledListItemText primary="EXTRA FEATURES" />
                        {isExtraFeatureOpen ? <ExpandLess /> : <ExpandMore />}
                    </StyledListItem>
                    <div style={{ marginLeft: 20 }}>
                        <Collapse in={isExtraFeatureOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
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
                        </Collapse>
                    </div>
                    {/* Data Security */}
                    <StyledListItem button onClick={handleDataSecurtiy}>
                        <StyledIcon>
                            <SecurityIcon />
                        </StyledIcon>
                        <StyledListItemText primary="DATA SECURITY" />
                        {isDataSecurityOpen ? <ExpandLess /> : <ExpandMore />}
                    </StyledListItem>
                    <div style={{ marginLeft: 20 }}>
                        <Collapse in={isDataSecurityOpen} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                            <StyledListItem button onClick={() => handleNavigation('/')}>
                                    <StyledIcon style={{}}>
                                        <BalanceIcon />
                                    </StyledIcon>
                                    <StyledListItemText primary="COPY FOLDER DATA" />
                                </StyledListItem>
                            </List>
                        </Collapse>
                    </div>
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

