// numberFormatUtils.js
export function formatToTwoDecimals(value) {
  const num = parseFloat(value);
  return isNaN(num) ? "" : num.toFixed(2);
}

export function createForceTwoDecimalsOnBlur(handleChange, fieldName, index = null) {
  return (e) => {
    // Remove non-numeric characters (except the decimal point)
    const rawValue = e.target.value.replace(/[^\d.-]/g, '');
    if (rawValue && !isNaN(parseFloat(rawValue))) {
      const formatted = formatToTwoDecimals(rawValue);
      // If index is provided, assume we're in MeasuresForm so pass index as needed.
      if (index !== null) {
        handleChange(index, { target: { name: fieldName, value: formatted } });
      } else {
        // For BasicForm, index is not needed.
        handleChange({ target: { name: fieldName, value: formatted } });
      }
    }
  };
}
