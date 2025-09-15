// src/context/CompanyContext.js
import React, { createContext, useState } from 'react';

export const CompanyContext = createContext({
  company: null,
  setCompany: () => {}
});

export function CompanyProvider({ children }) {
  const [company, setCompanyState] = useState(() => {
    // initialize from localStorage if present
    const saved = localStorage.getItem('selectedCompany');
    return saved ? JSON.parse(saved) : null;
  });

  const setCompany = (c) => {
    setCompanyState(c);
    localStorage.setItem('selectedCompany', JSON.stringify(c));
  };

  return (
    <CompanyContext.Provider value={{ company, setCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}