import { useEffect } from "react";

const useShortcuts = ({
  handleAdd,
  handleEdit,
  handlePrevious,
  handleNext,
  handleFirst,
  handleLast,
  handleExit,
  handlePrint,
  isEditMode,
  isModalOpen,   // 👈 add this
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.repeat) return;

      const key = e.key.toLowerCase();

      // 🚫 If modal is open, stop global shortcuts
      if (isModalOpen) return;

      // 🚫 If editing, allow only Escape
      if (isEditMode && key !== "escape") return;

      switch (key) {
        case "a":
          handleAdd?.();
          break;

        case "e":
          handleEdit?.();
          break;

        case "p":
          handlePrevious?.();
          break;

        case "n":
          handleNext?.();
          break;

        case "f":
          handleFirst?.();
          break;

        case "l":
          handleLast?.();
          break;

        case "t":
          handlePrint?.();
          break;

        case "escape":
          handleExit?.();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    handleAdd,
    handleEdit,
    handlePrevious,
    handleNext,
    handleFirst,
    handleLast,
    handleExit,
    handlePrint,
    isEditMode,
    isModalOpen,   // 👈 dependency
  ]);
};

export default useShortcuts;
