const financialYear = {
  getFYDates(today = new Date()) {
    const year = today.getFullYear();
    const month = today.getMonth(); // 0 = Jan, 11 = Dec

    const fyStartYear = month < 3 ? year - 1 : year;
    const fyEndYear = fyStartYear + 1;

    return {
      start: new Date(fyStartYear, 3, 1),   // 1 April
      end: new Date(fyEndYear, 2, 31),      // 31 March
    };
  }
};

export default financialYear;
