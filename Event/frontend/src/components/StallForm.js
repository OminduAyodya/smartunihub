import React, { useState, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import eventService from '../services/eventService';
import '../styles/Pages.css';

const StallForm = ({ initialData, onSubmit, loading, initialEvent }) => {
  const [formData, setFormData] = useState(initialData || {
    stallName: '',
    organizingFaculty: '',
    event: initialEvent?._id || '',
    eventName: initialEvent?.title || '',
    location: '',
    category: 'food',
    size: 'medium',
    price: 0,
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Fetch events for dropdown
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await eventService.getEventsForStallBooking();
      console.log('Available events:', data);
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
      alert('Failed to load events. Please refresh the page.');
    } finally {
      setLoadingEvents(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
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
  // STALL BOOKING FORM VALIDATION LOGIC
  // ============================================
  // Validates all required stall form fields before submission
  // Returns object with field names as keys and error messages as values
  // Returns empty object {} if validation passes
  const validateForm = () => {
    const newErrors = {};

    // Stall Name Validation
    // Requirements: Required field, must not be empty or whitespace
    if (!formData.stallName?.trim()) {
      newErrors.stallName = 'Stall name is required';
    }

    // Organizing Faculty Validation
    // Requirements: Required field, must not be empty or whitespace
    if (!formData.organizingFaculty?.trim()) {
      newErrors.organizingFaculty = 'Organizing faculty is required';
    }

    // Event Selection Validation
    // Requirements: Required field, user must select an event
    if (!formData.eventName?.trim()) {
      newErrors.event = 'Event name is required';
    }

    // Location Validation
    // Requirements: Required field, must not be empty or whitespace
    if (!formData.location?.trim()) {
      newErrors.location = 'Location is required';
    }

    // Price Validation
    // Requirements: Required field, must be a positive number (greater than 0)
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate form
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorField = document.querySelector('.input-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      return;
    }

    // All validation passed, proceed with submission
    // Send eventName as event field to backend
    const dataToSubmit = {
      ...formData,
      event: formData.eventName, // Send event name string instead of ObjectId
    };

    onSubmit(dataToSubmit);
  };

  return (
    <form className="event-form stall-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="stallName">Stall Name *</label>
        <input
          type="text"
          id="stallName"
          name="stallName"
          value={formData.stallName}
          onChange={handleChange}
          required
          placeholder="Enter stall name (minimum 3 characters)"
          className={errors.stallName ? 'input-error' : ''}
        />
        {errors.stallName && <span className="error-text">{errors.stallName}</span>}
      </div>

      <div className="form-group">        <label htmlFor="organizingFaculty">Organizing Faculty *</label>
        <input
          type="text"
          id="organizingFaculty"
          name="organizingFaculty"
          value={formData.organizingFaculty}
          onChange={handleChange}
          required
          placeholder="Enter faculty name or department (minimum 3 characters)"
          className={errors.organizingFaculty ? 'input-error' : ''}
        />
        {errors.organizingFaculty && <span className="error-text">{errors.organizingFaculty}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="eventName">Event Name *</label>
        <input
          type="text"
          id="eventName"
          name="eventName"
          value={formData.eventName}
          onChange={handleChange}
          required
          placeholder="Type event name or select from list"
          className={errors.event ? 'input-error' : ''}
          disabled={loadingEvents || !!initialEvent}
          list="event-list"
        />
        <datalist id="event-list">
          {events.map(event => (
            <option key={event._id} value={event.title}>
              {event.title} ({new Date(event.startDate).toLocaleDateString()})
            </option>
          ))}
        </datalist>
        {errors.event && <span className="error-text">{errors.event}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="location">Location/Booth Number *</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="e.g., Hall A, Section B"
            className={errors.location ? 'input-error' : ''}
          />
          {errors.location && <span className="error-text">{errors.location}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="size">Stall Size *</label>
          <select
            id="size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
          >
            <option value="small">Small (1x1 meter)</option>
            <option value="medium">Medium (2x2 meters)</option>
            <option value="large">Large (3x3 meters)</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category">Category *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="food">Food & Beverages</option>
            <option value="crafts">Crafts & Art</option>
            <option value="retail">Retail & Products</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (LKR) *</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="Enter price"
            min="0"
            step="100"
            className={errors.price ? 'input-error' : ''}
          />
          {errors.price && <span className="error-text">{errors.price}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Additional Details</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe your stall offerings, business details, etc. (minimum 10 characters if provided)"
          rows={4}
          className={errors.description ? 'input-error' : ''}
        />
        {errors.description && <span className="error-text">{errors.description}</span>}
      </div>

      <div className="form-group info-message">
        <p>📋 Your stall request will be pending admin approval before being visible to event organizers.</p>
      </div>

      <button 
        type="submit" 
        className="btn-primary"
        disabled={loading || loadingEvents}
      >
        {loading ? 'Submitting...' : (<><FiPlus /> Request Stall</>)}
      </button>
    </form>
  );
};

export default StallForm;
