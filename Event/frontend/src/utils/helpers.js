// Utility functions for the frontend

// Format date to readable format
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format time
export const formatTime = (time) => {
  if (!time) return '';
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// ============================================
// EMAIL VALIDATION
// ============================================
// Validates email format using regex pattern
// Pattern: checks for non-whitespace@ non-whitespace. non-whitespace
// Returns: boolean - true if valid email format, false otherwise
// Used in: Login, Register, Booking forms
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// ============================================
// PHONE VALIDATION
// ============================================
// Validates phone number - must be exactly 10 digits
// Pattern: ^[0-9]{10}$ - only numbers, must be 10 characters
// Returns: boolean - true if valid phone, false otherwise
// Used in: Register, Booking forms
// Note: Only accepts numeric characters, no special characters
export const isValidPhone = (phone) => {
  const re = /^[0-9]{10}$/;
  return re.test(phone);
};

// ============================================
// NAME VALIDATION
// ============================================
// Validates person's name format
// Requirements:
//   - Minimum 2 characters after trim
//   - Only letters (a-z, A-Z) and spaces allowed
// Pattern: matches letters and spaces, length >= 2
// Returns: boolean - true if valid name, false otherwise
// Used in: Register, Booking forms
// Note: Rejects numbers and special characters
export const isValidName = (name) => {
  if (!name || name.trim().length < 2) return false;
  const re = /^[a-zA-Z\s]{2,}$/;
  return re.test(name.trim());
};

// ============================================
// PASSWORD VALIDATION - BASIC
// ============================================
// Validates basic password requirements
// Requirements:
//   - Minimum 6 characters
//   - Cannot be empty
// Returns: boolean - true if valid, false otherwise
// Used in: Login, Register forms
// Note: Does NOT check password strength (uppercase, lowercase, numbers)
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// ============================================
// PASSWORD STRENGTH VALIDATION
// ============================================
// Validates strong password requirements
// Requirements:
//   - Minimum 6 characters
//   - Contains at least one uppercase letter (A-Z)
//   - Contains at least one lowercase letter (a-z)
//   - Contains at least one number (0-9)
// Returns: boolean - true if strong password, false otherwise
// Used in: Register form (optional strength check)
// Note: More secure than basic validation
export const isValidPasswordStrength = (password) => {
  if (!password || password.length < 6) return false;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUppercase && hasLowercase && hasNumber;
};

// ============================================
// PASSWORD MATCH VALIDATION
// ============================================
// Validates that two passwords are identical
// Requirements:
//   - Both passwords must match exactly
//   - Both passwords must be non-empty
// Returns: boolean - true if passwords match, false otherwise
// Used in: Register form (confirm password field)
// Note: Case-sensitive comparison
export const isPasswordsMatch = (password, confirmPassword) => {
  return password === confirmPassword && password.length > 0;
};

// ============================================
// DATE VALIDATION - FUTURE DATE CHECK
// ============================================
// Validates that the provided date is in the future (not in the past)
// Requirements:
//   - Date must be provided (not empty)
//   - Date must be greater than current date and time
// Returns: boolean - true if date is in future, false otherwise
// Used in: EventForm (startDate), EventCalendar
// Note: Compares entire datetime, not just date
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  const selectedDate = new Date(dateString);
  const now = new Date();
  return selectedDate > now;
};

// ============================================
// DATE RANGE VALIDATION
// ============================================
// Validates that end date comes after start date
// Requirements:
//   - Both dates must be provided
//   - Start date must be before end date
// Returns: boolean - true if valid range, false otherwise
// Used in: EventForm (startDate + endDate validation)
// Note: Start date (inclusive) must be < End date (exclusive)
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  const start = new Date(startDate);
  const end = new Date(endDate);
  return start < end;
};

// ============================================
// POSITIVE NUMBER VALIDATION
// ============================================
// Validates that value is a positive number
// Requirements:
//   - Must be a valid number (not NaN)
//   - Must be greater than 0 (positive)
// Returns: boolean - true if valid positive number, false otherwise
// Used in: StallForm (price), EventForm (totalSeats), StallRequestForm (price)
// Note: Accepts decimals (parseFloat), rejects zero and negative numbers
export const isValidPositiveNumber = (num) => {
  const number = parseFloat(num);
  return !isNaN(number) && number > 0;
};

// ============================================
// TEXT FIELD VALIDATION
// ============================================
// Validates text field with minimum character requirement
// Requirements:
//   - Text must be provided (not empty)
//   - Text length (after trim) must be >= minLength (default: 3 characters)
// Returns: boolean - true if valid, false otherwise
// Parameters:
//   - text: string to validate
//   - minLength: minimum required length (default: 3)
// Used in: EventForm (title, location), StallForm (stallName, organizingFaculty)
// Note: Whitespace is trimmed before length check
export const isValidText = (text, minLength = 3) => {
  return text && text.trim().length >= minLength;
};

// Get all validation error messages
export const getValidationErrors = (formData, requiredFields = []) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    const value = formData[field.name];
    
    switch(field.type) {
      case 'email':
        if (!value) {
          errors[field.name] = `${field.label} is required`;
        } else if (!isValidEmail(value)) {
          errors[field.name] = 'Please enter a valid email address';
        }
        break;
      case 'phone':
        if (!value) {
          errors[field.name] = `${field.label} is required`;
        } else if (!isValidPhone(value)) {
          errors[field.name] = 'Phone number must be exactly 10 digits';
        }
        break;
      case 'name':
        if (!value) {
          errors[field.name] = `${field.label} is required`;
        } else if (!isValidName(value)) {
          errors[field.name] = 'Name must be at least 2 characters and contain only letters';
        }
        break;
      case 'password':
        if (!value) {
          errors[field.name] = `${field.label} is required`;
        } else if (!isValidPassword(value)) {
          errors[field.name] = 'Password must be at least 6 characters';
        }
        break;
      case 'text':
        if (!value) {
          errors[field.name] = `${field.label} is required`;
        } else if (!isValidText(value, field.minLength || 3)) {
          errors[field.name] = `${field.label} must be at least ${field.minLength || 3} characters`;
        }
        break;
      case 'number':
        if (!value) {
          errors[field.name] = `${field.label} is required`;
        } else if (!isValidPositiveNumber(value)) {
          errors[field.name] = `${field.label} must be a positive number`;
        }
        break;
      default:
        if (!value) {
          errors[field.name] = `${field.label} is required`;
        }
    }
  });
  
  return errors;
};

// Get event status color
export const getStatusColor = (status) => {
  switch(status) {
    case 'pending': return '#ffc107';
    case 'approved': return '#28a745';
    case 'rejected': return '#dc3545';
    case 'completed': return '#17a2b8';
    default: return '#6c757d';
  }
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export default {
  formatDate,
  formatTime,
  isValidEmail,
  isValidPhone,
  getStatusColor,
  truncateText,
};
