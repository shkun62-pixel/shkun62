import React, { useEffect, useState } from "react";
import PasswordModal from "./PasswordModal";
import { useNavigate, useLocation } from "react-router-dom";

const PasswordSetting = () => {
  const [openPurRep, setopenPurRep] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const type = query.get("type");  

  useEffect(() => {
    setopenPurRep(true);
  }, []);

  const handleClose = () => {
    setopenPurRep(false);
    navigate("/dashboard");
  };

  return (
    <div>
      {type === "Password" && (
  <PasswordModal 
    open={openPurRep} 
    onClose={handleClose} 
  />
)}

    </div>
  );
};

export default PasswordSetting;
