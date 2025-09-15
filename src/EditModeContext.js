import React, { createContext, useContext, useState } from 'react';

// Create the context
const EditModeContext = createContext();

// Custom hook to use the context
export const useEditMode = () => useContext(EditModeContext);

// Provider component to wrap around your app
export const EditModeProvider = ({ children }) => {
    const [isEditMode, setIsEditMode] = useState(false);

    return (
        <EditModeContext.Provider value={{ isEditMode, setIsEditMode }}>
            {children}
        </EditModeContext.Provider>
    );
};
