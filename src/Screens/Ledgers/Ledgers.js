import React,{useEffect,useState} from "react";
import LedgerPrint from "./LedgerPrint/LedgerPrint";

import { useNavigate, useLocation } from "react-router-dom";

const Ledgers = () => {
  const [openPurRep, setopenPurRep] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Read query parameter
  const query = new URLSearchParams(location.search);
  const type = query.get("type");  // "party" or "account"

  useEffect(() => {
    setopenPurRep(true);
  }, []);

  const handleClose = () => {
    setopenPurRep(false);
    navigate("/");
  };

  return (
    <div>
      {type === "LedgerPrint" && (
        <LedgerPrint show={openPurRep} onHide={handleClose} />
      )}

    </div>
  );
};

export default Ledgers;
