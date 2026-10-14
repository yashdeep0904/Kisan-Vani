export const isValidPhone = (phone) => {
    const phoneRegex = /^(?:\+91|0)?[6789]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };
  
  export const isValidImageSize = (file, maxSizeMB = 5) => {
    if (!file) return false;
    const sizeInMB = file.size / (1024 * 1024);
    return sizeInMB <= maxSizeMB;
  };
  
  export const isValidImageType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    return allowedTypes.includes(file.type);
  };