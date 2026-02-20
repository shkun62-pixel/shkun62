import React,{useEffect,useState} from "react";
import GstRateModal from "./GstRateModal";
import { useNavigate, useLocation } from "react-router-dom";

const Inventory = () => {
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
    navigate("/dashboard");
  };

  return (
    <div>
      {type === "LedgerPost" && (
        <GstRateModal open={openPurRep} onClose={handleClose} />
      )}
    </div>
  );
};

export default Inventory;
