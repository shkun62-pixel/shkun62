// import React,{useEffect,useState} from "react";
// import CBookModal from "./CashBook/CBookModal";
// import JournalBook from "./JournalBook/JournalBook";

// import { useNavigate, useLocation } from "react-router-dom";

// const Books = () => {
//   const [openPurRep, setopenPurRep] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Read query parameter
//   const query = new URLSearchParams(location.search);
//   const type = query.get("type");  // "party" or "account"

//   useEffect(() => {
//     setopenPurRep(true);
//   }, []);

//   const handleClose = () => {
//     setopenPurRep(false);
//     navigate("/");
//   };

//   return (
//     <div>
//       {type === "cBook" && (
//         <CBookModal show={openPurRep} onClose={handleClose} />
//       )}

//       {type === "jBook" && (
//         <JournalBook show={openPurRep} onClose={handleClose} />
//       )}
      
//     </div>
//   );
// };

// export default Books;

import React, { useEffect, useState } from "react";
import CBookModal from "./CashBook/CBookModal";
import JournalBook from "./JournalBook/JournalBook";
import { useNavigate, useLocation } from "react-router-dom";

const Books = () => {
  const [openPurRep, setOpenPurRep] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const type = query.get("type"); // "cBook" or "jBook"

  useEffect(() => {
    setOpenPurRep(true);
  }, []);

  const handleClose = () => {
    setOpenPurRep(false);
    navigate("/dashboard");
  };

  return (
    <>
      {type === "cBook" && (
        <CBookModal
          isOpen={openPurRep}
          handleClose={handleClose}
          onNavigate={() => {}}
        />
      )}

      {type === "jBook" && (
        <JournalBook
          isOpen={openPurRep}
          handleClose={handleClose}
          onNavigate={() => {}}
        />
      )}
    </>
  );
};

export default Books;
