import React,{useEffect,useState} from "react";
import RepostingModal from "./RepostingModal";
import AnnexureModalParent from "../Modals/AnnexureModalParent";

import { useNavigate, useLocation } from "react-router-dom";

const Repost = () => {
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
      {type === "Reposting" && (
        <RepostingModal open={openPurRep} onClose={handleClose} />
      )}

      {type === "Annexure" && (
        <AnnexureModalParent isOpen={openPurRep} onClose={handleClose} onNavigate={handleClose} />
      )}

    </div>
  );
};

export default Repost;
