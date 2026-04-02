import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiImage, FiEdit, FiTrash2, FiX, FiUpload } from 'react-icons/fi';
import { toast } from 'react-toastify';
import eventService from '../services/eventService';
import galleryService from '../services/galleryService';
import EventCard from '../components/EventCard';
import '../styles/Pages.css';

const PastEvents = () => {
  const navigate = useNavigate();
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
  });
  const [galleryImages, setGalleryImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchPastEvents();
  }, []);

  const fetchPastEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getPastEvents();
      setPastEvents(data);
    } catch (error) {
      toast.error('Error fetching past events');
      console.error('Error fetching past events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventGallery = async (eventId) => {
    try {
      const images = await galleryService.getGalleryByEvent(eventId);
      setGalleryImages(images);
    } catch (error) {
      toast.error('Error loading gallery');
    }
  };

  const handleViewDetails = (eventId) => {
    navigate(`/past-events/${eventId}`);
  };

  const handleEditEvent = async (event) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title,
      description: event.description || '',
      location: event.location || '',
    });
    setEditMode(true);
    await fetchEventGallery(event._id);
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadData = new FormData();
      uploadData.append('image', file);

      const response = await eventService.uploadEventThumbnail(selectedEvent._id, uploadData);
      
      // Update local state
      setSelectedEvent({ ...selectedEvent, thumbnail: response.thumbnail });
      setPastEvents(pastEvents.map(ev => 
        ev._id === selectedEvent._id 
          ? { ...ev, thumbnail: response.thumbnail }
          : ev
      ));

      toast.success('Thumbnail uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload thumbnail');
    } finally {
      setIsUploading(false);
    }
  };

  const handleGalleryImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const uploadData = new FormData();
      uploadData.append('image', file);
      uploadData.append('event', selectedEvent._id);
      uploadData.append('title', 'Event Memory');

      await galleryService.uploadPhoto(selectedEvent._id, uploadData);
      
      toast.success('Image added to gallery!');
      await fetchEventGallery(selectedEvent._id);
    } catch (error) {
      toast.error('Failed to upload gallery image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteGalleryImage = async (imageId) => {
    if (!window.confirm('Delete this image?')) return;

    try {
      await galleryService.deletePhoto(imageId);
      toast.success('Image deleted!');
      await fetchEventGallery(selectedEvent._id);
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  const handleSaveEventDetails = async () => {
    try {
      setIsUploading(true);
      await eventService.updateEvent(selectedEvent._id, {
        title: formData.title,
        description: formData.description,
        location: formData.location,
      });

      // Update local state
      const updatedEvent = { ...selectedEvent, ...formData };
      setSelectedEvent(updatedEvent);
      setPastEvents(pastEvents.map(ev => 
        ev._id === selectedEvent._id 
          ? updatedEvent
          : ev
      ));

      toast.success('Event updated successfully!');
      setEditMode(false);
    } catch (error) {
      toast.error('Failed to save event details');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This cannot be undone.')) return;

    try {
      await eventService.deleteEvent(eventId);
      setPastEvents(pastEvents.filter(ev => ev._id !== eventId));
      setShowModal(false);
      toast.success('Event deleted!');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDropGallery = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const event = new Event('change', { bubbles: true });
      Object.defineProperty(event, 'target', { value: { files: [file] }, enumerable: true });
      handleGalleryImageUpload(event);
    }
  };

  return (
    <div className="past-events-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>Past Events</h1>
            <p>Relive amazing event memories</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading past events...</div>
      ) : pastEvents.length > 0 ? (
        <div className="events-grid">
          {pastEvents.map(event => (
            <div key={event._id} className="event-card-wrapper">
              <EventCard
                event={event}
                onViewDetails={handleViewDetails}
              />
              {event.eventOrganizer === user?._id && (
                <div className="event-card-actions">
                  <button
                    className="btn-edit-event"
                    onClick={() => handleEditEvent(event)}
                    title="Edit and manage images"
                  >
                    <FiEdit size={16} /> Manage
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-events">
          <p>No past events yet</p>
        </div>
      )}

      {/* Modal for editing event */}
      {showModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Manage Event</h2>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="modal-body">
              {/* Event Details Section */}
              <div className="event-details-section">
                <h3>Event Details</h3>
                
                {editMode ? (
                  <div className="edit-form">
                    <div className="form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Event title"
                      />
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Event description"
                        rows="4"
                      />
                    </div>

                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Event location"
                      />
                    </div>

                    <div className="form-buttons">
                      <button
                        className="btn-save"
                        onClick={handleSaveEventDetails}
                        disabled={isUploading}
                      >
                        {isUploading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={() => setEditMode(false)}
                        disabled={isUploading}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="event-info-display">
                    <p><strong>Title:</strong> {formData.title}</p>
                    <p><strong>Location:</strong> {formData.location || 'Not specified'}</p>
                    <p><strong>Description:</strong> {formData.description || 'No description'}</p>
                    <button
                      className="btn-edit"
                      onClick={() => setEditMode(true)}
                    >
                      <FiEdit size={16} /> Edit Details
                    </button>
                  </div>
                )}
              </div>

              {/* Thumbnail Section */}
              <div className="thumbnail-section">
                <h3>Event Thumbnail</h3>
                <div className="thumbnail-preview">
                  {selectedEvent.thumbnail ? (
                    <img src={selectedEvent.thumbnail} alt="Event thumbnail" />
                  ) : (
                    <div className="no-image">No thumbnail</div>
                  )}
                </div>
                <div className="upload-area">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    style={{ display: 'none' }}
                  />
                  <button
                    className="btn-upload"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <FiUpload size={16} /> {isUploading ? 'Uploading...' : 'Upload Thumbnail'}
                  </button>
                </div>
              </div>

              {/* Gallery Section */}
              <div className="gallery-section">
                <h3>Event Gallery</h3>
                
                <div
                  className={`gallery-upload-area ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDropGallery}
                  onClick={() => galleryInputRef.current?.click()}
                >
                  <input
                    ref={galleryInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleGalleryImageUpload}
                    style={{ display: 'none' }}
                  />
                  <FiUpload size={32} />
                  <p>Click or drag images here to add to gallery</p>
                </div>

                {galleryImages.length > 0 ? (
                  <div className="gallery-grid">
                    {galleryImages.map(image => (
                      <div key={image._id} className="gallery-thumbnail-card">
                        <img 
                          src={image.imageUrl || image.image} 
                          alt={image.title || 'Gallery'} 
                        />
                        <button
                          className="btn-delete-gallery"
                          onClick={() => handleDeleteGalleryImage(image._id)}
                          title="Delete image"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-gallery">No gallery images yet</p>
                )}
              </div>

              {/* Delete Event Button */}
              <div className="danger-zone">
                <button
                  className="btn-delete-event"
                  onClick={() => handleDeleteEvent(selectedEvent._id)}
                >
                  <FiTrash2 size={16} /> Delete Event
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PastEvents;
