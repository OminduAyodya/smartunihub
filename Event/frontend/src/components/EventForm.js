import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { isValidText, isValidDate, isValidDateRange, isValidPositiveNumber } from '../utils/helpers';
import '../styles/Pages.css';

const EventForm = ({ initialData, onSubmit, loading }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    eventType: 'indoor',
    totalSeats: 0,
    eventOrganizer: user?._id || '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value === 'indoor' || value === 'outdoor' ? value : (name === 'totalSeats' ? parseInt(value) || 0 : value),
    }));
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // ============================================
  // EVENT FORM VALIDATION LOGIC
  // ============================================
  // Validates all required and optional event form fields
  // Returns object with field names as keys and error messages as values
  // Returns empty object {} if validation passes
  const validateForm = () => {
    const newErrors = {};

    // Event Title Validation
    // Requirements: Required field, minimum 3 characters
    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    } else if (!isValidText(formData.title, 3)) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    // Description Validation
    // Note: Description is optional - no validation needed

    // Start Date Validation
    // Requirements: Required field, must be a future date
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else if (!isValidDate(formData.startDate)) {
      newErrors.startDate = 'Start date must be in the future';
    }

    // End Date Validation
    // Requirements: Required field, must be after start date
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (!isValidDateRange(formData.startDate, formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    // Location Validation
    // Requirements: Optional field (if provided, must be 3+ characters)
    if (formData.location && !isValidText(formData.location, 3)) {
      newErrors.location = 'Location must be at least 3 characters';
    }

    // Indoor Event - Seats Validation
    // Requirements: If eventType is 'indoor', total seats must be a positive number
    if (formData.eventType === 'indoor') {
      if (!formData.totalSeats) {
        newErrors.totalSeats = 'Total seats is required for indoor events';
      } else if (!isValidPositiveNumber(formData.totalSeats)) {
        newErrors.totalSeats = 'Total seats must be a positive number';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Remove eventOrganizer if empty to avoid ObjectId casting error
    const cleanedData = { ...formData };
    if (!cleanedData.eventOrganizer || cleanedData.eventOrganizer === '') {
      delete cleanedData.eventOrganizer;
    }

    onSubmit(cleanedData);
  };

  return (
    <form className="event-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Event Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Enter event title (minimum 3 characters)"
          className={errors.title ? 'input-error' : ''}
        />
        {errors.title && <span className="error-text">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Event description (optional)"
          rows={4}
          className={errors.description ? 'input-error' : ''}
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="startDate">Start Date *</label>
          <input
            type="datetime-local"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            className={errors.startDate ? 'input-error' : ''}
          />
          {errors.startDate && <span className="error-text">{errors.startDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date *</label>
          <input
            type="datetime-local"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
            className={errors.endDate ? 'input-error' : ''}
          />
          {errors.endDate && <span className="error-text">{errors.endDate}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event location (minimum 3 characters if provided)"
            className={errors.location ? 'input-error' : ''}
          />
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="eventType">Event Type *</label>
          <select
            id="eventType"
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
          >
            <option value="indoor">Indoor</option>
            <option value="outdoor">Outdoor</option>
          </select>
        </div>
      </div>

      {/* Only show seats input for indoor events */}
      {formData.eventType === 'indoor' && (
        <div className="form-group">
          <label htmlFor="totalSeats">Total Seats *</label>
          <input
            type="number"
            id="totalSeats"
            name="totalSeats"
            value={formData.totalSeats}
            onChange={handleChange}
            placeholder="Number of seats"
            min="1"
            required
            className={errors.totalSeats ? 'input-error' : ''}
          />
          {errors.totalSeats && <span className="error-text">{errors.totalSeats}</span>}
        </div>
      )}

      {/* Info message for outdoor events */}
      {formData.eventType === 'outdoor' && (
        <div className="form-group info-message">
          <p>ℹ️ Outdoor events don't require seat booking</p>
        </div>
      )}

      <button 
        type="submit" 
        className="btn-primary"
        disabled={loading}
      >
        {loading ? 'Submitting...' : (<><FiPlus /> Add Event</>)}
      </button>
    </form>
  );
};

export default EventForm;
