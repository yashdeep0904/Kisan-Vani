export const formatCurrency = (amount, locale = 'en-IN', currency = 'INR') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  export const formatDate = (dateString, locale = 'en-IN') => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(locale, options);
  };
  
  export const formatMetric = (value, unit) => {
    return `${value} ${unit}`;
  };