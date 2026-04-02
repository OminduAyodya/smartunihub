import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import galleryService from '../services/galleryService';
import '../styles/Pages.css';
import { toast } from 'react-toastify';

const EventGallery = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
  });

  useEffect(() => {
    loadGallery();
  }, [eventId]);

  const loadGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryService.getGalleryByEvent(eventId);
      setImages(data);
    } catch (err) {
      toast.error(err.message || 'Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, file });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData({ ...formData, file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file || !formData.title) {
      toast.error('Please select an image and enter a title');
      return;
    }

    try {
      setIsUploading(true);
      
      const uploadData = new FormData();
      uploadData.append('title', formData.title);
      uploadData.append('description', formData.description);
      uploadData.append('image', formData.file);
      uploadData.append('event', eventId);

      await galleryService.uploadPhoto(eventId, uploadData);
      
      toast.success('Image uploaded successfully!');
      setFormData({ title: '', description: '', file: null });
      setShowUploadForm(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Reload gallery
      await loadGallery();
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      await galleryService.deletePhoto(imageId);
      toast.success('Image deleted successfully!');
      await loadGallery();
    } catch (err) {
      toast.error(err.message || 'Failed to delete image');
    }
  };

  if (loading) return <div className="loading">Loading gallery...</div>;

  return (
    <div className="event-gallery-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="page-header">
        <h1>Event Photo Gallery</h1>
        <p>View and share event memories</p>
      </div>

      {/* Upload Form */}
      {showUploadForm ? (
        <div className="gallery-upload-form">
          <h3>📸 Add Photo to Gallery</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Photo Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter photo title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter photo description (optional)"
              />
            </div>

            <div className="form-group">
              <label>Select Image *</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
                <label
                  className={`file-input-label ${dragOver ? 'drag-over' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  📁 Click to select or drag and drop your image
                </label>
              </div>
              {formData.file && (
                <div className="selected-file-name">
                  ✓ Selected: {formData.file.name}
                </div>
              )}
            </div>

            <div className="form-buttons">
              <button
                type="submit"
                className="btn-submit"
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => {
                  setShowUploadForm(false);
                  setFormData({ title: '', description: '', file: null });
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="gallery-upload">
          <button
            className="upload-btn"
            onClick={() => setShowUploadForm(true)}
          >
            + Add Photo
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="no-events">
          <p>No photos in gallery yet. Be the first to add one!</p>
        </div>
      ) : (
        <div className="gallery-container">
          <div className="gallery-grid">
            {images.map((image) => (
              <div key={image._id} className="gallery-image-card">
                <div className="gallery-image-container">
                  <img 
                    src={image.imageUrl || image.image} 
                    alt={image.title || image.caption} 
                    className="gallery-image"
                    onClick={() => setSelectedImage(image)}
                  />
                  <div className="gallery-image-overlay">
                    <button
                      className="delete-icon"
                      onClick={() => handleDeleteImage(image._id)}
                      title="Delete image"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="gallery-image-info">
                  <div className="gallery-image-title">{image.title || image.caption}</div>
                  {image.description && (
                    <div className="gallery-image-description">{image.description}</div>
                  )}
                  <div className="gallery-image-date">
                    {new Date(image.uploadedAt || image.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lightbox */}
          {selectedImage && (
            <div className="lightbox" onClick={() => setSelectedImage(null)}>
              <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedImage(null)}
                >
                  ×
                </button>
                <img src={selectedImage.imageUrl || selectedImage.image} alt={selectedImage.title || selectedImage.caption} />
                {(selectedImage.caption || selectedImage.description) && (
                  <p className="lightbox-caption">{selectedImage.caption || selectedImage.description}</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EventGallery;
