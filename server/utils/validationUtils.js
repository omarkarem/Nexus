/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
const isValidEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} - Validation result with isValid and errors
   */
  const validatePassword = (password) => {
    const errors = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }
    
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    
    if (password.length > 128) {
      errors.push('Password must be less than 128 characters');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Validate name fields (firstName, lastName)
   * @param {string} name - Name to validate
   * @param {string} fieldName - Field name for error messages
   * @returns {Object} - Validation result
   */
  const validateName = (name, fieldName = 'Name') => {
    const errors = [];
    
    if (!name || !name.trim()) {
      errors.push(`${fieldName} is required`);
      return { isValid: false, errors };
    }
    
    if (name.trim().length < 2) {
      errors.push(`${fieldName} must be at least 2 characters long`);
    }
    
    if (name.trim().length > 30) {
      errors.push(`${fieldName} must be less than 30 characters`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Validate registration data
   * @param {Object} data - Registration data
   * @returns {Object} - Validation result with isValid and errors
   */
  const validateRegistrationData = (data) => {
    const { firstName, lastName, email, password } = data;
    const allErrors = [];
    
    // Validate first name
    const firstNameValidation = validateName(firstName, 'First name');
    if (!firstNameValidation.isValid) {
      allErrors.push(...firstNameValidation.errors);
    }
    
    // Validate last name
    const lastNameValidation = validateName(lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      allErrors.push(...lastNameValidation.errors);
    }
    
    // Validate email
    if (!email || !email.trim()) {
      allErrors.push('Email is required');
    } else if (!isValidEmail(email)) {
      allErrors.push('Please provide a valid email address');
    }
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      allErrors.push(...passwordValidation.errors);
    }
    
    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  };
  
  /**
   * Validate login data
   * @param {Object} data - Login data
   * @returns {Object} - Validation result
   */
  const validateLoginData = (data) => {
    const { email, password } = data;
    const errors = [];
    
    if (!email || !email.trim()) {
      errors.push('Email is required');
    } else if (!isValidEmail(email)) {
      errors.push('Please provide a valid email address');
    }
    
    if (!password || !password.trim()) {
      errors.push('Password is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };
  
  /**
   * Sanitize user input by trimming whitespace
   * @param {Object} data - Object with user input
   * @returns {Object} - Sanitized data
   */
  const sanitizeUserInput = (data) => {
    const sanitized = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = value.trim();
      } else {
        sanitized[key] = value;
      }
    }
    
    return sanitized;
  };
  
export { isValidEmail, validatePassword, validateName, validateRegistrationData, validateLoginData, sanitizeUserInput };