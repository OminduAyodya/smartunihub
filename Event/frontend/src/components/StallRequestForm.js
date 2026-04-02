import React, { useState } from 'react';
import { isValidText, isValidPositiveNumber } from '../utils/helpers';
import { toast } from 'react-toastify';

const StallRequestForm = ({ eventId, stallService, onSuccess }) => {
  const [showForm, setShowForm] = useState(false);
  const [requestData, setRequestData] = useState({
    stallName: '',
    category: '',
    size: '',
    price: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ============================================
  // STALL REQUEST FORM VALIDATION LOGIC
  // ============================================
  // Validates all required stall request form fields
  // Returns object with field names as keys and error messages as values
  // Returns empty object {} if validation passes
  const validateStallForm = () => {
    const newErrors = {};

    // Stall Name Validation
    // Requirements: Required field, minimum 3 characters
    if (!requestData.stallName.trim()) {
      newErrors.stallName = 'Stall name is required';
    } else if (!isValidText(requestData.stallName, 3)) {
      newErrors.stallName = 'Stall name must be at least 3 characters';
    }

    // Stall Category Validation
    // Requirements: Required field, user must select a category option
    if (!requestData.category) {
      newErrors.category = 'Category is required';
    }

    // Stall Size Validation
    // Requirements: Required field, user must select a size option (small/medium/large)
    if (!requestData.size) {
      newErrors.size = 'Size is required';
    }

    // Stall Price Validation
    // Requirements: Required field, must be a positive number (greater than 0)
    if (!requestData.price) {
      newErrors.price = 'Price is required';
    } else if (!isValidPositiveNumber(requestData.price)) {
      newErrors.price = 'Price must be a positive number';
    }

    return newErrors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateStallForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields correctly');
      return;
    }

    try {
      setLoading(true);
      await stallService.requestStall({
        ...requestData,
        event: eventId,
      });
      toast.success('Stall request submitted successfully!');
      setShowForm(false);
      setRequestData({ stallName: '', category: '', size: '', price: '' });
      setErrors({});
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request stall');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stall-request-form-container">
      {!showForm ? (
        <button
          className="btn-primary btn-request-stall"
          onClick={() => setShowForm(true)}
        >
          📋 Request New Stall
        </button>
      ) : (
        <div className="stall-form-card">
          <div className="form-header">
            <h2>Request Stall for Event</h2>
            <button
              className="btn-close"
              onClick={() => setShowForm(false)}
              type="button"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="stall-request-form">
            <div className="form-group">
              <label htmlFor="stallName">
                Stall Name <span className="required">*</span>
              </label>
              <input
                type="text"
                id="stallName"
                name="stallName"
                value={requestData.stallName}
                onChange={handleInputChange}
                placeholder="Enter stall name (minimum 3 characters)"
                className={errors.stallName ? 'input-error' : ''}
              />
              {errors.stallName && (
                <span className="error-text">❌ {errors.stallName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={requestData.category}
                onChange={handleInputChange}
                className={errors.category ? 'input-error' : ''}
              >
                <option value="">-- Select category --</option>
                <option value="food">🍔 Food & Beverages</option>
                <option value="crafts">🎨 Crafts & Arts</option>
                <option value="retail">🛍️ Retail Products</option>
                <option value="services">💼 Services</option>
                <option value="other">📦 Other</option>
              </select>
              {errors.category && (
                <span className="error-text">❌ {errors.category}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="size">
                  Size <span className="required">*</span>
                </label>
                <select
                  id="size"
                  name="size"
                  value={requestData.size}
                  onChange={handleInputChange}
                  className={errors.size ? 'input-error' : ''}
                >
                  <option value="">-- Select size --</option>
                  <option value="small">📦 Small (10x10 ft)</option>
                  <option value="medium">📦 Medium (15x15 ft)</option>
                  <option value="large">📦 Large (20x20 ft)</option>
                </select>
                {errors.size && (
                  <span className="error-text">❌ {errors.size}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="price">
                  Price per Day (LKR) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={requestData.price}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000"
                  min="0"
                  className={errors.price ? 'input-error' : ''}
                />
                {errors.price && (
                  <span className="error-text">❌ {errors.price}</span>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-success"
                disabled={loading}
              >
                {loading ? 'Submitting...' : '✓ Submit Request'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default StallRequestForm;
