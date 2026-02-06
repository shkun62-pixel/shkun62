import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import SignIn from './Screens/SignIn/SignIn';
import Companies from './Screens/CompanySelect/Companies';
import LedgerAcc from './Screens/LedgerAcc/LedgerAcc';
import NewStockAcc from './Screens/NewStockAcc/NewStockAcc';
import Sale from './Screens/Sale/Sale'
import SaleService from './Screens/SaleService/SaleService';
import Purchase from './Screens/Purchase/Purchase';
import PurchaseService from './Screens/PurchaseService/PurchaseService';
import CashVoucher from './Screens/CashVoucher/CashVoucher';
import JournalVoucher from './Screens/JournalVoucher/JournalVoucher';
import BankVoucher from './Screens/BankVoucher/BankVoucher';
import TdsVoucher from './Screens/TdsVoucher/TdsVoucher';
import DebitNote from './Screens/DebitNote//DebitNote';
import CreditNote from './Screens/CreditNote/CreditNote';
import SaleBook from './Screens/Books/SaleBook/SaleBook';
import PurchaseBook from './Screens/Books/PurchaseBook/PurchaseBook';
import StockTransfer from './Screens/StockTransfer/StockTransfer';
import TrailBalance from './Screens/TrailBalance/TrailBalance';
import Setup from './Screens/Setup/Setup';
import SideDrawer from './Screens/SideDrawer/SideDrawer';
import Example from './Screens/Example';
import SplashScreen from './Screens/SplashScreen/SplashScreen';
import LedgerSetup from './Screens/LedgerAcc/LedgerSetup';
import ProductionCard from './Screens/ProductionCard/ProductionCard';
import SalesReturn from './Screens/GoodsReturn/SalesReturn';
import PurchasesReturn from './Screens/GoodsReturn/PurchasesReturn';
import StockReport from './Screens/StockReports/StockReport';
import StockSummary from './Screens/StockReports/StockSummary';
import BankBook from './Screens/Books/BankBook/BankBook';
import CashReceipt from './Screens/CashVoucher/CashReceipt';
import LedgerList from './Screens/AccountStatement/LedgerList';
import DebtorsList from './Screens/OutStandingReports/DebtorsList';
import CreditorsList from './Screens/OutStandingReports/CreditorsList';
import PaymentList from './Screens/PaymentList/PaymentList';
import ReceiptList from './Screens/ReceiptList/ReceiptList';
import GstWorksheet from './Screens/GSTworkSheet/GstWorksheet';
import GstRegister from './Screens/GstRegister/GstRegister';
import IncomeTaxReport from './Screens/IncomeTaxReports/IncomeTaxReport';
import Books from './Screens/Books/Books';
import SaleSumm from './Screens/Summary/SaleSummary/SaleSumm';
import TaxWiseSale from './Screens/GstReports/TaxWiseSumm/TaxWiseSale';
import TaxWisePur from './Screens/GstReports/TaxWisePur/TaxWisePur';
import PurchaseSumm from './Screens/Summary/PurchaseSummary/PurchaseSumm';
import Ledgers from './Screens/Ledgers/Ledgers';
import GstReport from './Screens/GstReports/GstReport';
// import Dashboard from './Screens/DashBoard/Dashboard';
import Demo from './Screens/Demo';


function App() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]); // Initialize with an empty array

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Set your desired loading time

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);
  return (
    <div>
      {/* <Navbar /> */}
      <SideDrawer />
      <Routes>
        <Route path="/" element={loading ? <SplashScreen /> : <SignIn />} />
        <Route path='/Companies' element={<Companies />}></Route>
        {/* <Route path="/" element={loading ? <SplashScreen /> : <SignInForm />} /> */}
        <Route path='/LedgerAcc' element={<LedgerAcc />}></Route>
        <Route path='/Example' element={<Example></Example>}></Route>
        <Route path='/NewStockAcc' element={<NewStockAcc />}></Route>
        <Route path='/Sale' element={<Sale />}></Route>
        <Route path='/SaleService' element={<SaleService />}></Route>
        <Route path='/Purchase' element={<Purchase />}></Route>
        <Route path='/PurchaseService' element={<PurchaseService />}></Route>
        <Route path='/CashVoucher' element={<CashVoucher />}></Route>
        <Route path='/JournalVoucher' element={<JournalVoucher />}></Route>
        <Route path='/BankVoucher' element={<BankVoucher />}></Route>
        <Route path='/TdsVoucher' element={<TdsVoucher />}></Route>
        <Route path='/DebitNote' element={<DebitNote />}></Route>
        <Route path='/CreditNote' element={<CreditNote />}></Route>
        <Route path='/SaleBook' element={<SaleBook />}></Route>
        <Route path='/PurchaseBook' element={<PurchaseBook />}></Route>
        <Route path='/StockTransfer' element={<StockTransfer />}></Route>
        <Route path='/TrailBalance' element={<TrailBalance />}></Route>
        <Route path='/Setup' element={<Setup />}></Route>
        <Route path='/SideDrawer' element={<SideDrawer />}></Route>
        <Route path='/LedgerSetup' element={<LedgerSetup />}></Route>
        <Route path='/ProductionCard' element={<ProductionCard />}></Route>
        <Route path='/SalesReturn' element={<SalesReturn />}></Route>
        <Route path='/PurchasesReturn' element={<PurchasesReturn />}></Route>
        <Route path='/StockReport' element={<StockReport />}></Route>
        <Route path='/StockSummary' element={<StockSummary />}></Route>
        <Route path='/BankBook' element={<BankBook />}></Route>
        <Route path='/CashReceipt' element={<CashReceipt />}></Route>
        <Route path='/LedgerList' element={<LedgerList />}></Route>
        <Route path='/DebtorsList' element={<DebtorsList />}></Route>
        <Route path='/CreditorsList' element={<CreditorsList />}></Route>
        <Route path='/PaymentList' element={<PaymentList />}></Route>
        <Route path='/ReceiptList' element={<ReceiptList />}></Route>
        <Route path='/GstWorksheet' element={<GstWorksheet />}></Route>
        <Route path='/GstRegister' element={<GstRegister />}></Route>
        <Route path='/IncomeTaxReport' element={<IncomeTaxReport />}></Route>
        <Route path='/Books' element={<Books />}></Route>
        <Route path='/SaleSumm' element={<SaleSumm />}></Route>
        <Route path='/PurchaseSumm' element={<PurchaseSumm />}></Route>
        <Route path='/Ledgers' element={<Ledgers />}></Route>
        <Route path='/TaxWiseSale' element={<TaxWiseSale />}></Route>
        <Route path='/TaxWisePur' element={<TaxWisePur />}></Route>
        <Route path='/GstReport' element={<GstReport />}></Route>
        {/* <Route path='/Dashboard' element={<Dashboard />}></Route> */}
        <Route path='/Demo' element={<Demo />}></Route>
      </Routes>

    </div>
  );
}

export default App;


