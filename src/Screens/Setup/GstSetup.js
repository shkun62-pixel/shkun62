import React, { useState, useEffect, useRef } from "react";
import "./GstSetup.css";
import { Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import ProductModalCustomer from "../Modals/ProductModalCustomer";
import { CompanyContext } from '../Context/CompanyContext';
import { useContext } from "react";

const GstSetup = ({ onClose }) => {

  const { company } = useContext(CompanyContext);
    const tenant = company?.databaseName;
  
    if (!tenant) {
      // you may want to guard here or show an error state,
      // since without a tenant you can’t hit the right API
      console.error("No tenant selected!");
    }

  const [pressedKey, setPressedKey] = useState("");
  const [formData, setFormData] = useState({
    setup: "GST SETUP",
  });

  const [cgstcode_Sale, setcgstcode_Sale] = useState([
    {
      cgst_codeSale: "",
      cgst_acSale: "",
    },
  ]);
  const [sgstcode_Sale, setsgstcode_Sale] = useState([
    {
      sgst_codeSale: "",
      sgst_acSale: "",
    },
  ]);
  const [igstcode_Sale, setigstcode_Sale] = useState([
    {
      igst_codeSale: "",
      igst_acSale: "",
    },
  ]);
// Purhcase
const [cgstcodePur, setcgstcodePur] = useState([
  {
    cgst_codePur: "",
    cgst_acPur: "",
  },
]);
const [cgstcodePur1, setcgstcodePur1] = useState([
  {
    cgst_codePur1: "",
    cgst_acPur1: "",
  },
]);
const [cgstcodePur2, setcgstcodePur2] = useState([
  {
    cgst_codePur2: "",
    cgst_acPur2: "",
  },
]);
const [sgstcodePur, setsgstcodePur] = useState([
  {
    sgst_codePur: "",
    sgst_acPur: "",
  },
]);
const [sgstcodePur1, setsgstcodePur1] = useState([
  {
    sgst_codePur1: "",
    sgst_acPur1: "",
  },
]);
const [sgstcodePur2, setsgstcodePur2] = useState([
  {
    sgst_codePur2: "",
    sgst_acPur2: "",
  },
]);
const [igstcodePur, setigstcodePur] = useState([
  {
    igst_codePur: "",
    igst_acPur: "",
  },
]);
const [igstcodePur1, setigstcodePur1] = useState([
  {
    igst_codePur1: "",
    igst_acPur1: "",
  },
]);
const [igstcodePur2, setigstcodePur2] = useState([
  {
    igst_codePur2: "",
    igst_acPur2: "",
  },
]);
// CASHBANK
const [cgstcodeBank, setcgstcodeBank] = useState([
  {
      cgst_codeBank: "",
      cgst_acBank: "",
  },
]);
const [sgstcodeBank, setsgstcodeBank] = useState([
  {
      sgst_codeBank: "",
      sgst_acBank: "",
  },
]);
const [igstcodeBank, setigstcodeBank] = useState([
  {
      igst_codeBank: "",
      igst_acBank: "",
  },
]);


  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const handleNumberChange = (e) => {
    const { id, value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setFormData({ ...formData, [id]: value });
    }
  };
  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  React.useEffect(() => {
    // Fetch products from the API when the component mounts
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch(
        `http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/api/ledgerAccount`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      // Ensure to extract the formData for easier access in the rest of your app
      const formattedData = data.map((item) => ({
        ...item.formData,
        _id: item._id,
      }));
      setProductsAcc(formattedData);
      setProductsgst(formattedData);
      setProductigst(formattedData);
      setProductcgstBank(formattedData);
      setProductsgstBank(formattedData);
      setProductigstBank(formattedData);
      setProductsCgstcodePur(formattedData);
      setProductcgstPur1(formattedData);
      setProductcgstPur2(formattedData);
      setProductsgstPur(formattedData);
      setProductsgstPur1(formattedData);
      setProductsgstPur2(formattedData)
      setProductigstPur(formattedData)
      setProductigstPur1(formattedData)
      setProductigstPur2(formattedData)
    } catch (error) {
      setErrorAcc(error.message);
      setLoadingAcc(false);
      setErrorsgst(error.message);
      setLoadingsgst(false);
      setErrorigst(error.message);
      setLoadingigst(false);
      setErrorCgstcodePur(error.message);
      setLoadingCgstcodePur(false);
      setErrorcgstPur1(error.message);
      setLoadingcgstPur1(false);
    }
  };

  // Modal For Account Name
  const [productsAcc, setProductsAcc] = useState([]);
  const [showModalAcc, setShowModalAcc] = useState(false);
  const [selectedItemIndexAcc, setSelectedItemIndexAcc] = useState(null);
  const [loadingAcc, setLoadingAcc] = useState(true);
  const [errorAcc, setErrorAcc] = useState(null);

  const handleItemChangeAcc = (index, key, value) => {
    const updatedItems = [...cgstcode_Sale];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productsAcc.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["cgst_codeSale"] = selectedProduct.acode;
        updatedItems[index]["cgst_acSale"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setcgstcode_Sale(updatedItems);
  };

  const handleProductSelectAcc = (product) => {
    if (selectedItemIndexAcc !== null) {
      handleItemChangeAcc(selectedItemIndexAcc, "ahead", product.ahead);
      setShowModalAcc(false);
    }
  };
  const openModalForItemAcc = (index) => {
    setSelectedItemIndexAcc(index);
    setShowModalAcc(true);
  };

  const allFieldsAcc = productsAcc.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  // Modal For SGST
  const [productsgst, setProductsgst] = useState([]);
  const [showModalsgst, setShowModalsgst] = useState(false);
  const [selectedItemIndexsgst, setSelectedItemIndexsgst] = useState(null);
  const [loadingsgst, setLoadingsgst] = useState(true);
  const [errorsgst, setErrorsgst] = useState(null);

  const handleItemChangesgst = (index, key, value) => {
    const updatedItems = [...sgstcode_Sale];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productsgst.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["sgst_codeSale"] = selectedProduct.acode;
        updatedItems[index]["sgst_acSale"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setsgstcode_Sale(updatedItems);
  };

  const handleProductSelectsgst = (product) => {
    if (selectedItemIndexsgst !== null) {
      handleItemChangesgst(selectedItemIndexsgst, "ahead", product.ahead);
      setShowModalsgst(false);
    }
  };
  const openModalForItemsgst = (index) => {
    setSelectedItemIndexsgst(index);
    setShowModalsgst(true);
  };

  const allFieldsgst = productsgst.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);

  // Modal For IGST
  const [productigst, setProductigst] = useState([]);
  const [showModaligst, setShowModaligst] = useState(false);
  const [selectedItemIndexigst, setSelectedItemIndexigst] = useState(null);
  const [loadingigst, setLoadingigst] = useState(true);
  const [errorigst, setErrorigst] = useState(null);

  const handleItemChangeigst = (index, key, value) => {
    const updatedItems = [...igstcode_Sale];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
      const selectedProduct = productigst.find(
        (product) => product.ahead === value
      );
      if (selectedProduct) {
        updatedItems[index]["igst_codeSale"] = selectedProduct.acode;
        updatedItems[index]["igst_acSale"] = selectedProduct.ahead;
      }
    } else if (key === "discount") {
    }
    setigstcode_Sale(updatedItems);
  };

  const handleProductSelectigst = (product) => {
    if (selectedItemIndexigst !== null) {
      handleItemChangeigst(selectedItemIndexigst, "ahead", product.ahead);
      setShowModaligst(false);
    }
  };

  const openModalForItemigst = (index) => {
    setSelectedItemIndexigst(index);
    setShowModaligst(true);
  };

  const allFieldsigst = productigst.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);
  // Purchase Modal 
  // CGSTPUR
  // Modal For CGST
const [productsCgstcodePur, setProductsCgstcodePur] = useState([]);
const [showModalCgstcodePur, setShowModalCgstcodePur] = useState(false);
const [selectedItemIndexCgstcodePur, setSelectedItemIndexCgstcodePur] = useState(null);
const [loadingCgstcodePur, setLoadingCgstcodePur] = useState(true);
const [errorCgstcodePur, setErrorCgstcodePur] = useState(null);

const handleItemChangeCgstcodePur = (index, key, value) => {
  const updatedItems = [...cgstcodePur];
  // If the key is 'ahead', find the corresponding product and set the price
  if (key === "ahead") {
    const selectedProduct = productsCgstcodePur.find(
      (product) => product.ahead === value
    );
    if (selectedProduct) {
      updatedItems[index]["cgst_codePur"] = selectedProduct.acode;
      updatedItems[index]["cgst_acPur"] = selectedProduct.ahead;
    }
  } else if (key === "discount") {
  }
  setcgstcodePur(updatedItems);
};

const handleProductSelectCgstcodePur = (product) => {
  if (selectedItemIndexCgstcodePur !== null) {
    handleItemChangeCgstcodePur(selectedItemIndexCgstcodePur, "ahead", product.ahead);
    setShowModalCgstcodePur(false);
  }
};

const openModalForItemCgstcodePur = (index) => {
    setSelectedItemIndexCgstcodePur(index);
    setShowModalCgstcodePur(true);
};

const allFieldsCgstcodePur = productsCgstcodePur.reduce((fields, product) => {
  Object.keys(product).forEach((key) => {
    if (!fields.includes(key)) {
      fields.push(key);
    }
  });
  return fields;
}, []);
// Modal For CGSTPur1
const [productcgstPur1, setProductcgstPur1] = useState([]);
const [showModalcgstPur1, setShowModalcgstPur1] = useState(false);
const [selectedItemIndexcgstPur1, setSelectedItemIndexcgstPur1] = useState(null);
const [loadingcgstPur1, setLoadingcgstPur1] = useState(true);
const [errorcgstPur1, setErrorcgstPur1] = useState(null);

const handleItemChangecgstPur1 = (index, key, value) => {
    const updatedItems = [...cgstcodePur1];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
        const selectedProduct = productcgstPur1.find(
            (product) => product.ahead === value
        );
        if (selectedProduct) {
            updatedItems[index]["cgst_codePur1"] = selectedProduct.acode;
            updatedItems[index]["cgst_acPur1"] = selectedProduct.ahead;
        }
    } else if (key === "discount") {
    }
    setcgstcodePur1(updatedItems);
};

const handleProductSelectcgstPur1 = (product) => {
    if (selectedItemIndexcgstPur1 !== null) {
        handleItemChangecgstPur1(selectedItemIndexcgstPur1, "ahead", product.ahead);
        setShowModalcgstPur1(false);
    }
};

const openModalForItemcgstPur1 = (index) => {
    setSelectedItemIndexcgstPur1(index);
    setShowModalcgstPur1(true);
};

const allFieldcgstPur1 = productcgstPur1.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);
// Modal For CGSTPur2
const [productcgstPur2, setProductcgstPur2] = useState([]);
const [showModalcgstPur2, setShowModalcgstPur2] = useState(false);
const [selectedItemIndexcgstPur2, setSelectedItemIndexcgstPur2] = useState(null);
const [loadingcgstPur2, setLoadingcgstPur2] = useState(true);
const [errorcgstPur2, setErrorcgstPur2] = useState(null);

const handleItemChangecgstPur2 = (index, key, value) => {
    const updatedItems = [...cgstcodePur2];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
        const selectedProduct = productcgstPur2.find(
            (product) => product.ahead === value
        );
        if (selectedProduct) {
            updatedItems[index]["cgst_codePur2"] = selectedProduct.acode;
            updatedItems[index]["cgst_acPur2"] = selectedProduct.ahead;
        }
    } else if (key === "discount") {
    }
    setcgstcodePur2(updatedItems);
};

const handleProductSelectcgstPur2 = (product) => {
    if (selectedItemIndexcgstPur2 !== null) {
        handleItemChangecgstPur2(selectedItemIndexcgstPur2, "ahead", product.ahead);
        setShowModalcgstPur2(false);
    }
};

const openModalForItemcgstPur2 = (index) => {
    setSelectedItemIndexcgstPur2(index);
    setShowModalcgstPur2(true);
};

const allFieldcgstPur2 = productcgstPur2.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
      if (!fields.includes(key)) {
        fields.push(key);
      }
    });
    return fields;
  }, []);
// Pur SGST
const [productsgstPur, setProductsgstPur] = useState([]);
const [showModalsgstPur, setShowModalsgstPur] = useState(false);
const [selectedItemIndexsgstPur, setSelectedItemIndexsgstPur] = useState(null);
const [loadingsgstPur, setLoadingsgstPur] = useState(true);
const [errorsgstPur, setErrorsgstPur] = useState(null);

const handleItemChangesgstPur = (index, key, value) => {
  const updatedItems = [...sgstcodePur];
  // If the key is 'ahead', find the corresponding product and set the price
  if (key === "ahead") {
    const selectedProduct = productsgstPur.find(
      (product) => product.ahead === value
    );
    if (selectedProduct) {
      updatedItems[index]["sgst_codePur"] = selectedProduct.acode;
      updatedItems[index]["sgst_acPur"] = selectedProduct.ahead;
    }
  } else if (key === "discount") {
  }
  setsgstcodePur(updatedItems);
};

const handleProductSelectsgstPur = (product) => {
  if (selectedItemIndexsgstPur !== null) {
    handleItemChangesgstPur(selectedItemIndexsgstPur, "ahead", product.ahead);
    setShowModalsgstPur(false);
  }
};

const openModalForItemsgstPur = (index) => {
    setSelectedItemIndexsgstPur(index);
    setShowModalsgstPur(true);
};

const allFieldsgstPur = productsgstPur.reduce((fields, product) => {
  Object.keys(product).forEach((key) => {
    if (!fields.includes(key)) {
      fields.push(key);
    }
  });
  return fields;
}, []);
const [productsgstPur1, setProductsgstPur1] = useState([]);
const [showModalsgstPur1, setShowModalsgstPur1] = useState(false);
const [selectedItemIndexsgstPur1, setSelectedItemIndexsgstPur1] = useState(null);
const [loadingsgstPur1, setLoadingsgstPur1] = useState(true);
const [errorsgstPur1, setErrorsgstPur1] = useState(null);

const handleItemChangesgstPur1 = (index, key, value) => {
  const updatedItems = [...sgstcodePur1];
  // If the key is 'ahead', find the corresponding product and set the price
  if (key === "ahead") {
    const selectedProduct = productsgstPur1.find(
      (product) => product.ahead === value
    );
    if (selectedProduct) {
      updatedItems[index]["sgst_codePur1"] = selectedProduct.acode;
      updatedItems[index]["sgst_acPur1"] = selectedProduct.ahead;
    }
  } else if (key === "discount") {
  }
  setsgstcodePur1(updatedItems);
};

const handleProductSelectsgstPur1 = (product) => {
  if (selectedItemIndexsgstPur1 !== null) {
    handleItemChangesgstPur1(selectedItemIndexsgstPur1, "ahead", product.ahead);
    setShowModalsgstPur1(false);
  }
};

const openModalForItemsgstPur1 = (index) => {
    setSelectedItemIndexsgstPur1(index);
    setShowModalsgstPur1(true);
};

const allFieldsgstPur1 = productsgstPur1.reduce((fields, product) => {
  Object.keys(product).forEach((key) => {
    if (!fields.includes(key)) {
      fields.push(key);
    }
  });
  return fields;
}, []);
const [productsgstPur2, setProductsgstPur2] = useState([]);
const [showModalsgstPur2, setShowModalsgstPur2] = useState(false);
const [selectedItemIndexsgstPur2, setSelectedItemIndexsgstPur2] = useState(null);
const [loadingsgstPur2, setLoadingsgstPur2] = useState(true);
const [errorsgstPur2, setErrorsgstPur2] = useState(null);

const handleItemChangesgstPur2 = (index, key, value) => {
  const updatedItems = [...sgstcodePur2];
  // If the key is 'ahead', find the corresponding product and set the price
  if (key === "ahead") {
    const selectedProduct = productsgstPur2.find(
      (product) => product.ahead === value
    );
    if (selectedProduct) {
      updatedItems[index]["sgst_codePur2"] = selectedProduct.acode;
      updatedItems[index]["sgst_acPur2"] = selectedProduct.ahead;
    }
  } else if (key === "discount") {
  }
  setsgstcodePur2(updatedItems);
};

const handleProductSelectsgstPur2 = (product) => {
  if (selectedItemIndexsgstPur2 !== null) {
    handleItemChangesgstPur2(selectedItemIndexsgstPur2, "ahead", product.ahead);
    setShowModalsgstPur2(false);
  }
};

const openModalForItemsgstPur2 = (index) => {
    setSelectedItemIndexsgstPur2(index);
    setShowModalsgstPur2(true);
};

const allFieldsgstPur2 = productsgstPur2.reduce((fields, product) => {
  Object.keys(product).forEach((key) => {
    if (!fields.includes(key)) {
      fields.push(key);
    }
  });
  return fields;
}, []);
// Modal For IGSTPur
const [productigstPur, setProductigstPur] = useState([]);
const [showModaligstPur, setShowModaligstPur] = useState(false);
const [selectedItemIndexigstPur, setSelectedItemIndexigstPur] = useState(null);
const [loadingigstPur, setLoadingigstPur] = useState(true);
const [errorigstPur, setErrorigstPur] = useState(null);

const handleItemChangeigstPur = (index, key, value) => {
  const updatedItems = [...igstcodePur];
  // If the key is 'ahead', find the corresponding product and set the price
  if (key === "ahead") {
    const selectedProduct = productigstPur.find(
      (product) => product.ahead === value
    );
    if (selectedProduct) {
      updatedItems[index]["igst_codePur"] = selectedProduct.acode;
      updatedItems[index]["igst_acPur"] = selectedProduct.ahead;
    }
  } else if (key === "discount") {
  }
  setigstcodePur(updatedItems);
};

const handleProductSelectigstPur = (product) => {
  if (selectedItemIndexigstPur !== null) {
    handleItemChangeigstPur(selectedItemIndexigstPur, "ahead", product.ahead);
    setShowModaligstPur(false);
  }
};

const openModalForItemigstPur = (index) => {
    setSelectedItemIndexigstPur(index);
    setShowModaligstPur(true);
};

const allFieldsigstPur = productigstPur.reduce((fields, product) => {
  Object.keys(product).forEach((key) => {
    if (!fields.includes(key)) {
      fields.push(key);
    }
  });
  return fields;
}, []);
// Modal For IGSTPur1
const [productigstPur1, setProductigstPur1] = useState([]);
const [showModaligstPur1, setShowModaligstPur1] = useState(false);
const [selectedItemIndexigstPur1, setSelectedItemIndexigstPur1] = useState(null);
const [loadingigstPur1, setLoadingigstPur1] = useState(true);
const [errorigstPur1, setErrorigstPur1] = useState(null);

const handleItemChangeigstPur1 = (index, key, value) => {
  const updatedItems = [...igstcodePur1];
  // If the key is 'ahead', find the corresponding product and set the price
  if (key === "ahead") {
    const selectedProduct = productigstPur1.find(
      (product) => product.ahead === value
    );
    if (selectedProduct) {
      updatedItems[index]["igst_codePur1"] = selectedProduct.acode;
      updatedItems[index]["igst_acPur1"] = selectedProduct.ahead;
    }
  } else if (key === "discount") {
  }
  setigstcodePur1(updatedItems);
};

const handleProductSelectigstPur1 = (product) => {
  if (selectedItemIndexigstPur1 !== null) {
    handleItemChangeigstPur1(selectedItemIndexigstPur1, "ahead", product.ahead);
    setShowModaligstPur1(false);
  }
};

const openModalForItemigstPur1 = (index) => {
    setSelectedItemIndexigstPur1(index);
    setShowModaligstPur1(true);
};

const allFieldsigstPur1 = productigstPur1.reduce((fields, product) => {
  Object.keys(product).forEach((key) => {
    if (!fields.includes(key)) {
      fields.push(key);
    }
  });
  return fields;
}, []);
// Modal For IGSTPur2
const [productigstPur2, setProductigstPur2] = useState([]);
const [showModaligstPur2, setShowModaligstPur2] = useState(false);
const [selectedItemIndexigstPur2, setSelectedItemIndexigstPur2] = useState(null);
const [loadingigstPur2, setLoadingigstPur2] = useState(true);
const [errorigstPur2, setErrorigstPur2] = useState(null);

const handleItemChangeigstPur2 = (index, key, value) => {
  const updatedItems = [...igstcodePur2];
  // If the key is 'ahead', find the corresponding product and set the price
  if (key === "ahead") {
    const selectedProduct = productigstPur2.find(
      (product) => product.ahead === value
    );
    if (selectedProduct) {
      updatedItems[index]["igst_codePur2"] = selectedProduct.acode;
      updatedItems[index]["igst_acPur2"] = selectedProduct.ahead;
    }
  } else if (key === "discount") {
  }
  setigstcodePur2(updatedItems);
};

const handleProductSelectigstPur2 = (product) => {
  if (selectedItemIndexigstPur2 !== null) {
    handleItemChangeigstPur2(selectedItemIndexigstPur2, "ahead", product.ahead);
    setShowModaligstPur2(false);
  }
};

const openModalForItemigstPur2 = (index) => {
    setSelectedItemIndexigstPur2(index);
    setShowModaligstPur2(true);
};

const allFieldsigstPur2 = productigstPur2.reduce((fields, product) => {
  Object.keys(product).forEach((key) => {
    if (!fields.includes(key)) {
      fields.push(key);
    }
  });
  return fields;
}, []);
// MODAL FOR CASHBAK SEtUP
const [productcgstBank, setProductcgstBank] = useState([]);
const [showModalcgstBank, setShowModalcgstBank] = useState(false);
const [selectedItemIndexcgstBank, setSelectedItemIndexcgstBank] = useState(null);
const [loadingcgstBank, setLoadingcgstBank] = useState(true);
const [errorcgstBank, setErrorcgstBank] = useState(null);

const handleItemChangecgstBank = (index, key, value) => {
    const updatedItems = [...cgstcodeBank];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
        const selectedProduct = productcgstBank.find(
            (product) => product.ahead === value
        );
        if (selectedProduct) {
            updatedItems[index]["cgst_codeBank"] = selectedProduct.acode;
            updatedItems[index]["cgst_acBank"] = selectedProduct.ahead;
        }
    } else if (key === "discount") {
        // Handle discount key if necessary
    }
    setcgstcodeBank(updatedItems);
};

const handleProductSelectcgstBank = (product) => {
    if (selectedItemIndexcgstBank !== null) {
        handleItemChangecgstBank(selectedItemIndexcgstBank, "ahead", product.ahead);
        setShowModalcgstBank(false);
    }
};

const openModalForItemcgstBank = (index) => {
    setSelectedItemIndexcgstBank(index);
    setShowModalcgstBank(true);
};

const allFieldscgstBank = productcgstBank.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
        if (!fields.includes(key)) {
            fields.push(key);
        }
    });
    return fields;
}, []);
// Modal For SGST
const [productsgstBank, setProductsgstBank] = useState([]);
const [showModalsgstBank, setShowModalsgstBank] = useState(false);
const [selectedItemIndexsgstBank, setSelectedItemIndexsgstBank] = useState(null);
const [loadingsgstBank, setLoadingsgstBank] = useState(true);
const [errorsgstBank, setErrorsgstBank] = useState(null);

const handleItemChangesgstBank = (index, key, value) => {
    const updatedItems = [...sgstcodeBank];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
        const selectedProduct = productsgstBank.find(
            (product) => product.ahead === value
        );
        if (selectedProduct) {
            updatedItems[index]["sgst_codeBank"] = selectedProduct.acode;
            updatedItems[index]["sgst_acBank"] = selectedProduct.ahead;
        }
    } else if (key === "discount") {
        // Handle discount key if necessary
    }
    setcgstcodeBank(updatedItems);
};

const handleProductSelectsgstBank = (product) => {
    if (selectedItemIndexsgstBank !== null) {
        handleItemChangesgstBank(selectedItemIndexsgstBank, "ahead", product.ahead);
        setShowModalsgstBank(false);
    }
};

const openModalForItemsgstBank = (index) => {
    setSelectedItemIndexsgstBank(index);
    setShowModalsgstBank(true);
};

const allFieldsgstBank = productsgstBank.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
        if (!fields.includes(key)) {
            fields.push(key);
        }
    });
    return fields;
}, []);
// Modal For IGST
const [productigstBank, setProductigstBank] = useState([]);
const [showModaligstBank, setShowModaligstBank] = useState(false);
const [selectedItemIndexigstBank, setSelectedItemIndexigstBank] = useState(null);
const [loadingigstBank, setLoadingigstBank] = useState(true);
const [errorigstBank, setErrorigstBank] = useState(null);

const handleItemChangeigstBank = (index, key, value) => {
    const updatedItems = [...igstcodeBank];
    // If the key is 'ahead', find the corresponding product and set the price
    if (key === "ahead") {
        const selectedProduct = productigstBank.find(
            (product) => product.ahead === value
        );
        if (selectedProduct) {
            updatedItems[index]["igst_codeBank"] = selectedProduct.acode;
            updatedItems[index]["igst_acBank"] = selectedProduct.ahead;
        }
    } else if (key === "discount") {
        // Handle discount key if necessary
    }
    setigstcodeBank(updatedItems);
};

const handleProductSelectigstBank = (product) => {
    if (selectedItemIndexigstBank !== null) {
        handleItemChangeigstBank(selectedItemIndexigstBank, "ahead", product.ahead);
        setShowModaligstBank(false);
    }
};

const openModalForItemigstBank = (index) => {
    setSelectedItemIndexigstBank(index);
    setShowModaligstBank(true);
};

const allFieldsigstBank = productigstBank.reduce((fields, product) => {
    Object.keys(product).forEach((key) => {
        if (!fields.includes(key)) {
            fields.push(key);
        }
    });
    return fields;
}, []);
// fetchdata
const [data, setData] = useState([]);
const [data1, setData1] = useState([]);
const [index, setIndex] = useState(0);
const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
const [isEditMode, setIsEditMode] = useState(false);
const [isAbcmode, setIsAbcmode] = useState(false);
const [isDisabled, setIsDisabled] = useState(false);
const [firstTimeCheckData,setFirstTimeCheckData] = useState("");

const handleEditClick = () => {
  document.body.style.backgroundColor = '#F3F2C8';
  setIsDisabled(false);
  setIsEditMode(true);
  setIsSubmitEnabled(true);
  setIsAbcmode(true);
};
const handleSaveClick = async () => {
  document.body.style.backgroundColor = "white";
  let isDataSaved = false; 

  const prepareData = () => ({
    _id: formData._id,
    formData: {
      ...formData,
      cgst_codeSale: cgstcode_Sale.length > 0 ? cgstcode_Sale[0].cgst_codeSale : '', 
      cgst_acSale: cgstcode_Sale.length > 0 ? cgstcode_Sale[0].cgst_acSale : '',
sgst_codeSale: sgstcode_Sale.length > 0 ? sgstcode_Sale[0].sgst_codeSale : '', 
sgst_acSale: sgstcode_Sale.length > 0 ? sgstcode_Sale[0].sgst_acSale : '',
igst_codeSale: igstcode_Sale.length > 0 ? igstcode_Sale[0].igst_codeSale : '', 
igst_acSale: igstcode_Sale.length > 0 ? igstcode_Sale[0].igst_acSale : '',
cgst_codePur: cgstcodePur.length > 0 ? cgstcodePur[0].cgst_codePur : '', 
cgst_acPur: cgstcodePur.length > 0 ? cgstcodePur[0].cgst_acPur : '',
cgst_codePur1: cgstcodePur1.length > 0 ? cgstcodePur1[0].cgst_codePur1 : '', 
cgst_acPur1: cgstcodePur1.length > 0 ? cgstcodePur1[0].cgst_acPur1 : '',
cgst_codePur2: cgstcodePur2.length > 0 ? cgstcodePur2[0].cgst_codePur2 : '', 
cgst_acPur2: cgstcodePur2.length > 0 ? cgstcodePur2[0].cgst_acPur2 : '',
sgst_codePur: sgstcodePur.length > 0 ? sgstcodePur[0].sgst_codePur : '', 
sgst_acPur: sgstcodePur.length > 0 ? sgstcodePur[0].sgst_acPur : '',
sgst_codePur1: sgstcodePur1.length > 0 ? sgstcodePur1[0].sgst_codePur1 : '', 
sgst_acPur1: sgstcodePur1.length > 0 ? sgstcodePur1[0].sgst_acPur1 : '',
sgst_codePur2: sgstcodePur2.length > 0 ? sgstcodePur2[0].sgst_codePur2 : '', 
sgst_acPur2: sgstcodePur2.length > 0 ? sgstcodePur2[0].sgst_acPur2 : '',
igst_codePur: igstcodePur.length > 0 ? igstcodePur[0].igst_codePur : '', 
igst_acPur: igstcodePur.length > 0 ? igstcodePur[0].igst_acPur : '',
igst_codePur1: igstcodePur1.length > 0 ? igstcodePur1[0].igst_codePur1 : '', 
igst_acPur1:igstcodePur1.length > 0 ? igstcodePur1[0].igst_acPur1 : '',
igst_codePur2: igstcodePur2.length > 0 ? igstcodePur2[0].igst_codePur2 : '', 
igst_acPur2: igstcodePur2.length > 0 ? igstcodePur2[0].igst_acPur2 : '',
cgst_codeBank: cgstcodeBank.length > 0 ? cgstcodeBank[0].cgst_codeBank : '', 
cgst_acBank: cgstcodeBank.length > 0 ? cgstcodeBank[0].cgst_acBank : '',
sgst_codeBank: sgstcodeBank.length > 0 ? sgstcodeBank[0].sgst_codeBank : '', 
sgst_acBank: sgstcodeBank.length > 0 ? sgstcodeBank[0].sgst_acBank : '',
igst_codeBank: igstcodeBank.length > 0 ? igstcodeBank[0].igst_codeBank : '', 
cigst_acBank: igstcodeBank.length > 0 ? igstcodeBank[0].igst_acBank : '',
    }
  });
  try {
    const combinedData = prepareData();
    console.log("Combined Data New:", combinedData);
    // const apiEndpoint = `http://103.168.19.65:3012/08ABCDE9911F1Z2_25042025_25042026/tenant/purchasesetup${isAbcmode ? `/${data1._id}` : ""}`;
    // const method = isAbcmode ? "put" : "post";
    // const response = await axios({ method, url: apiEndpoint, data: combinedData });
    // if (response.status === 200 || response.status === 201) {
    //   fetchData();
    //   isDataSaved = true;
    // }
  } catch (error) {
    console.error("Error saving data:", error);
    toast.error("Failed to save data. Please try again.", { position: "top-center" });
  } finally {
    setIsSubmitEnabled(false);
    setIsDisabled(!isDataSaved);
    setIsEditMode(!isDataSaved);
    const toastMsg =  "Data Saved Successfully!";
    toast.success(toastMsg, { position: "top-center" });
  }
};

  return (
    <div className="NewModalVat">
      <div className="ModalcontainerVat">
        <h1 className="HeadingGST">GST SETUP </h1>
        <text style={{fontSize:25,letterSpacing:3,}}>---------------SALE SETUP----------------</text>
        <div className="salegst">
          <div>
            {cgstcode_Sale.map((item, index) => (
              <div key={index}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: 5,
                  }}
                >
                  <text style={{ color: "red" }}>C.GST A/c:</text>
                  <input
                    className="CgstAc"
                    readOnly
                    style={{ width: 220 }}
                    value={item.cgst_codeSale || ""}
                    onChange={(e) => {
                      const newcgstcode_Sale = [...cgstcode_Sale];
                      newcgstcode_Sale[index].cgst_codeSale = e.target.value;
                      setcgstcode_Sale(newcgstcode_Sale);
                    }}
                  />
                  <input
                    className="check"
                    readOnly
                    style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                    onClick={() => openModalForItemAcc(index)}
                    value={" ... "}
                  />
                </div>
              </div>
            ))}
            {showModalAcc && (
              <ProductModalCustomer
                allFieldsAcc={allFieldsAcc}
                productsAcc={productsAcc}
                onSelectAcc={handleProductSelectAcc}
                onCloseAcc={() => setShowModalAcc(false)}
                initialKey={pressedKey} // Pass the pressed key to the modal
              />
            )}
          </div>
          <div style={{marginTop:5}}>
            {sgstcode_Sale.map((item, index) => (
              <div key={index}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <text style={{ color: "red" }}>S.GST A/c:</text>
                  <input
                    className="SgstAc"
                    readOnly
                    style={{ width: 220 }}
                    value={item.sgst_codeSale || ""}
                    onChange={(e) => {
                      const newsgstcode_Sale = [...sgstcode_Sale];
                      newsgstcode_Sale[index].sgst_codeSale = e.target.value;
                      setsgstcode_Sale(newsgstcode_Sale);
                    }}
                  />
                  <input
                    className="check"
                    readOnly
                    style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                    onClick={() => openModalForItemsgst(index)}
                    value={" ... "}
                  />
                </div>
              </div>
            ))}
            {showModalsgst && (
              <ProductModalCustomer
                allFieldsAcc={allFieldsgst}
                productsAcc={productsgst}
                onSelectAcc={handleProductSelectsgst}
                onCloseAcc={() => setShowModalsgst(false)}
                initialKey={pressedKey} // Pass the pressed key to the modal
              />
            )}
          </div>
          <div style={{marginTop:5}}>
            {igstcode_Sale.map((item, index) => (
              <div key={index}>
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <text style={{ color: "red" }}>I.GST A/c:</text>
                  <input
                    className="IgstAc"
                    readOnly
                    style={{ width: 220 }}
                    value={item.igst_codeSale || ""}
                    onChange={(e) => {
                      const newigstcode_Sale = [...igstcode_Sale];
                      newigstcode_Sale[index].igst_codeSale = e.target.value;
                      setigstcode_Sale(newigstcode_Sale);
                    }}
                  />
                  <input
                    className="check"
                    readOnly
                    style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                    onClick={() => openModalForItemigst(index)}
                    value={" ... "}
                  />
                </div>
              </div>
            ))}
            {showModaligst && (
              <ProductModalCustomer
                allFieldsAcc={allFieldsigst}
                productsAcc={productigst}
                onSelectAcc={handleProductSelectigst}
                onCloseAcc={() => setShowModaligst(false)}
                initialKey={pressedKey} // Pass the pressed key to the modal
              />
            )}
          </div>
        </div>
        <text style={{fontSize:25,letterSpacing:3,marginTop:10}}>--------------PURCHASE SETUP-----------</text>
        <div className="purgst">
             {/* CGST */}
             <div style={{display:'flex',flexDirection:'row'}}>
                <div>
                {cgstcodePur.map((item, index) => (
                  <div key={index}>
                    <div style={{display: "flex",flexDirection: "row",}}>
                      <text style={{ color: "red" }}>C.GST A/c:</text>
                      <input
                    className="CgstAc"
                    readOnly
                    style={{ width: 100 }}
                    value={item.cgst_codePur || ''}
                    onChange={(e) => {
                      const newCgstcode = [...cgstcodePur];
                      newCgstcode[index].cgst_codePur = e.target.value;
                      setcgstcodePur(newCgstcode);
                    }}
                  />
                      <input
                        className="check"
                        readOnly
                        style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                        onClick={() => openModalForItemCgstcodePur(index)}
                        value={" ... "}
                        
                      />
                    </div>
                  </div>
                ))}
                {showModalCgstcodePur && (
                  <ProductModalCustomer
                    allFieldsAcc={allFieldsCgstcodePur}
                    productsAcc={productsCgstcodePur}
                    onSelectAcc={handleProductSelectCgstcodePur}
                    onCloseAcc={() => setShowModalCgstcodePur(false)}
                    initialKey={pressedKey} // Pass the pressed key to the modal
                  />
                )}
              </div>
              <div>
                {cgstcodePur1.map((item, index) => (
                  <div key={index}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                    
                      }}
                    >
                        <input
                           readOnly
                    style={{ width: 100,fontWeight:"bold",color:"blue",border:'1px solid black',marginLeft:2 }}
                    value={item.cgst_codePur1 || ''}
                    onChange={(e) => {
                      const newCgstcode1 = [...cgstcodePur1];
                      newCgstcode1[index].cgst_codePur1 = e.target.value;
                      setcgstcodePur1(newCgstcode1);
                    }}
                  />
                      <input
                        className="check"
                        readOnly
                        style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                        onClick={() => openModalForItemcgstPur1(index)}
                        value={" ... "}
                      />
                    </div>
                  </div>
                ))}
                {showModalcgstPur1 && (
                  <ProductModalCustomer
                    allFieldsAcc={allFieldcgstPur1}
                    productsAcc={productcgstPur1}
                    onSelectAcc={handleProductSelectcgstPur1}
                    onCloseAcc={() => setShowModalcgstPur1(false)}
                    initialKey={pressedKey} // Pass the pressed key to the modal
                  />
                )}
              </div>
              <div>
                {cgstcodePur2.map((item, index) => (
                  <div key={index}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                        <input
                           readOnly
                        style={{ width: 100,fontWeight:"bold",color:"green",border:'1px solid black',marginLeft:2 }}
                    value={item.cgst_codePur2 || ''}
                    onChange={(e) => {
                      const newCgstcode2 = [...cgstcodePur2];
                      newCgstcode2[index].cgst_codePur2 = e.target.value;
                      setcgstcodePur2(newCgstcode2);
                    }}
                  />
                      <input
                        className="check"
                        readOnly
                        style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                        onClick={() => openModalForItemcgstPur2(index)}
                        value={" ... "}
                      />
                    </div>
                  </div>
                ))}
                {showModalcgstPur2 && (
                  <ProductModalCustomer
                    allFieldsAcc={allFieldcgstPur2}
                    productsAcc={productcgstPur2}
                    onSelectAcc={handleProductSelectcgstPur2}
                    onCloseAcc={() => setShowModalcgstPur2(false)}
                    initialKey={pressedKey} // Pass the pressed key to the modal
                  />
                )}
              </div>
              </div>
              {/* SGST */}
              <div style={{display:'flex',flexDirection:'row'}}>
              <div style={{marginTop:5}}>
                {sgstcodePur.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <text style={{ color: "red" }}>S.GST A/c:</text>
                      <input
                         readOnly
                    className="SgstAc"
                    style={{ width: 100 }}
                    value={item.sgst_codePur || ''}
                    onChange={(e) => {
                      const newSgstcode = [...sgstcodePur];
                      newSgstcode[index].sgst_codePur = e.target.value;
                      setsgstcodePur(newSgstcode);
                    }}
                  />
                      <input
                        className="check"
                        readOnly
                        style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                        onClick={() => openModalForItemsgstPur(index)}
                        value={" ... "}
                      />
                    </div>
                  </div>
                ))}
                {showModalsgstPur && (
                  <ProductModalCustomer
                    allFieldsAcc={allFieldsgstPur}
                    productsAcc={productsgstPur}
                    onSelectAcc={handleProductSelectsgstPur}
                    onCloseAcc={() => setShowModalsgstPur(false)}
                    initialKey={pressedKey} // Pass the pressed key to the modal
                  />
                )}
              </div>
              <div style={{marginTop:5}}>
                {sgstcodePur1.map((item, index) => (
                  <div key={index}>
                      <input
                         readOnly
                      style={{ width: 100,fontWeight:"bold",color:"blue",border:'1px solid black',marginLeft:2 }}
                    value={item.sgst_codePur1 || ''}
                    onChange={(e) => {
                      const newSgstcode1 = [...sgstcodePur1];
                      newSgstcode1[index].sgst_codePur1 = e.target.value;
                      setsgstcodePur1(newSgstcode1);
                    }}
                  />
                      <input
                        className="check"
                        readOnly
                        style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                        onClick={() => openModalForItemsgstPur1(index)}
                        value={" ... "}
                      />
                   
                  </div>
                ))}
                {showModalsgstPur1 && (
                  <ProductModalCustomer
                    allFieldsAcc={allFieldsgstPur1}
                    productsAcc={productsgstPur1}
                    onSelectAcc={handleProductSelectsgstPur1}
                    onCloseAcc={() => setShowModalsgstPur1(false)}
                    initialKey={pressedKey} // Pass the pressed key to the modal
                  />
                )}
              </div>
              <div style={{marginTop:5}}>
                {sgstcodePur2.map((item, index) => (
                  <div key={index}>
                      <input
                         readOnly
                      style={{ width: 100,fontWeight:"bold",color:"green",border:'1px solid black',marginLeft:2 }}
                    value={item.sgst_codePur2 || ''}
                    onChange={(e) => {
                      const newSgstcode2 = [...sgstcodePur2];
                      newSgstcode2[index].sgst_codePur2 = e.target.value;
                      setsgstcodePur2(newSgstcode2);
                    }}
                  />
                      <input
                        className="check"
                        readOnly
                        style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                        onClick={() => openModalForItemsgstPur2(index)}
                        value={" ... "}
                      />
                   
                  </div>
                ))}
                {showModalsgstPur2 && (
                  <ProductModalCustomer
                    allFieldsAcc={allFieldsgstPur2}
                    productsAcc={productsgstPur2}
                    onSelectAcc={handleProductSelectsgstPur2}
                    onCloseAcc={() => setShowModalsgstPur2(false)}
                    initialKey={pressedKey} // Pass the pressed key to the modal
                  />
                )}
              </div>
              </div>
              {/* IGST */}
              <div style={{display:'flex',flexDirection:"row"}}>
              <div style={{marginTop:5}}>
                {igstcodePur.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <text style={{ color: "red" }}>I.GST A/c:</text>
                      <input
                    className="IgstAc"
                    readOnly
                    style={{ width: 100 ,fontWeight:"bold",color:"red"}}
                    value={item.igst_codePur || ''}
                    onChange={(e) => {
                      const newIgstcode = [...igstcodePur];
                      newIgstcode[index].igst_codePur = e.target.value;
                      setigstcodePur(newIgstcode);
                    }}
                  />
                      <input
                        className="check"
                        readOnly
                        style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                        onClick={() => openModalForItemigstPur(index)}
                        value={" ... "}
                      />
                    </div>
                  </div>
                ))}
                {showModaligstPur && (
                  <ProductModalCustomer
                    allFieldsAcc={allFieldsigstPur}
                    productsAcc={productigstPur}
                    onSelectAcc={handleProductSelectigstPur}
                    onCloseAcc={() => setShowModaligstPur(false)}
                    initialKey={pressedKey} // Pass the pressed key to the modal
                  />
                )}
              </div>
              <div style={{marginTop:5}}>
                {igstcodePur1.map((item, index) => (
                  <div key={index}>
                      <input
                         readOnly
                        style={{ width: 100,fontWeight:"bold",color:"blue",border:'1px solid black',marginLeft:2 }}
                    value={item.igst_codePur1 || ''}
                    onChange={(e) => {
                      const newIgstcode1 = [...igstcodePur1];
                      newIgstcode1[index].igst_codePur1 = e.target.value;
                      setigstcodePur1(newIgstcode1);
                    }}
                  />
                      <input
                        className="check"
                        readOnly
                        style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                        onClick={() => openModalForItemigstPur1(index)}
                        value={" ... "}
                      />
                    
                  </div>
                ))}
                {showModaligstPur1 && (
                  <ProductModalCustomer
                    allFieldsAcc={allFieldsigstPur1}
                    productsAcc={productigstPur1}
                    onSelectAcc={handleProductSelectigstPur1}
                    onCloseAcc={() => setShowModaligstPur1(false)}
                    initialKey={pressedKey}
                  />
                )}
              </div>
              <div style={{marginTop:5}}>
                {igstcodePur2.map((item, index) => (
                  <div key={index}>
                      <input
                         readOnly
                        style={{ width: 100,fontWeight:"bold",color:"green",border:'1px solid black',marginLeft:2 }}
                    value={item.igst_codePur2 || ''}
                    onChange={(e) => {
                      const newIgstcode2 = [...igstcodePur2];
                      newIgstcode2[index].igst_codePur2 = e.target.value;
                      setigstcodePur2(newIgstcode2);
                    }}
                  />
                      <input
                        className="check"
                        readOnly
                        style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                        onClick={() => openModalForItemigstPur2(index)}
                        value={" ... "}
                      />
                    
                  </div>
                ))}
                {showModaligstPur2 && (
                  <ProductModalCustomer
                    allFieldsAcc={allFieldsigstPur2}
                    productsAcc={productigstPur2}
                    onSelectAcc={handleProductSelectigstPur2}
                    onCloseAcc={() => setShowModaligstPur2(false)}
                    initialKey={pressedKey}
                  />
                )}
              </div>
              </div>
        </div>
        <text style={{fontSize:25,letterSpacing:3,marginTop:10}}>------------BANK/CASH SETUP------------</text>
        <div className="bankcashgst">
        <div>
                {cgstcodeBank.map((item, index) => (
                  <div key={index}>
                    <div style={{display: "flex",flexDirection: "row",}}>
                      <text  style={{ color: "red" }}>C.GST A/C:</text>
                      <input
                         className="cgstaccount"
                    readOnly
                    value={item.cgst_codeBank || ''}
                    onChange={(e) => {
                      const newcgstcode = [...cgstcodeBank];
                      newcgstcode[index].cgst_codeBank = e.target.value;
                      setcgstcodeBank(newcgstcode);
                    }}
                  />
                      <input
                        className="check"
                        readOnly
                        style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                        onClick={() => openModalForItemcgstBank(index)}
                        value={" ... "}
                        
                      />
                    </div>
                  </div>
                ))}
                {showModalcgstBank && (
                  <ProductModalCustomer
                    allFieldsAcc={allFieldscgstBank}
                    productsAcc={productcgstBank}
                    onSelectAcc={handleProductSelectcgstBank}
                    onCloseAcc={() => setShowModalcgstBank(false)}
                    initialKey={pressedKey} // Pass the pressed key to the modal
                  />
                )}
              </div>
              <div style={{marginTop:5}}>
                {sgstcodeBank.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <text  style={{ color: "red" }}>S.GST A/c:</text>
                      <input
                      className="sgstaccount"
                    readOnly
                    value={item.sgst_codeBank || ''}
                    onChange={(e) => {
                      const newSgstcode = [...sgstcodeBank];
                      newSgstcode[index].sgst_codeBank = e.target.value;
                      setsgstcodeBank(newSgstcode);
                    }}
                  />
                      <input
                        className="check"
                        readOnly
                        style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                        onClick={() => openModalForItemsgstBank(index)}
                        value={" ... "}
                      />
                    </div>
                  </div>
                ))}
                {showModalsgstBank && (
                  <ProductModalCustomer
                    allFieldsAcc={allFieldsgstBank}
                    productsAcc={productsgstBank}
                    onSelectAcc={handleProductSelectsgstBank}
                    onCloseAcc={() => setShowModalsgstBank(false)}
                    initialKey={pressedKey} // Pass the pressed key to the modal
                  />
                )}
              </div>
              <div style={{marginTop:5}}>
                {igstcodeBank.map((item, index) => (
                  <div key={index}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <text  style={{ color: "red" }}>I.GST A/c:</text>
                      <input
                         className="igstaccount"
                    readOnly
                    value={item.igst_codeBank || ''}
                    onChange={(e) => {
                      const newIgstcode = [...igstcodeBank];
                      newIgstcode[index].igst_codeBank = e.target.value;
                      setigstcodeBank(newIgstcode);
                    }}
                  />
                      <input
                        className="check"
                        readOnly
                        style={{ width: 30, fontWeight: "bold",border:"1px solid black",marginLeft:1}}
                        onClick={() => openModalForItemigstBank(index)}
                        value={" ... "}
                      />
                    </div>
                  </div>
                ))}
                {showModaligstBank && (
                  <ProductModalCustomer
                    allFieldsAcc={allFieldsigstBank}
                    productsAcc={productigstBank}
                    onSelectAcc={handleProductSelectigstBank}
                    onCloseAcc={() => setShowModaligstBank(false)}
                    initialKey={pressedKey} // Pass the pressed key to the modal
                  />
                )}
              </div>
        </div>
<div style={{display:'flex',flexDirection:"row",marginTop:15,marginLeft:60}}>
        <Button style={{backgroundColor:'darksalmon',borderColor:"transparent",width:150}}>EDIT</Button>
        <Button  style={{backgroundColor:"green",borderColor:"transparent",marginLeft:10,width:150}} onClick={handleSaveClick}>SAVE</Button>
        <Button style={{backgroundColor:"red",borderColor:"transparent",marginLeft:10,width:150}} onClick={onClose}>CLOSE</Button>
        </div>
      </div>
    </div>
  );
};

export default GstSetup;
