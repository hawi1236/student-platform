import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Upload as UploadIcon, File, X, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', msg: '' });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 20 * 1024 * 1024) {
        setStatus({ type: 'error', msg: 'File size exceeds 20MB limit' });
        return;
      }
      setFile(selectedFile);
      setStatus({ type: '', msg: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus({ type: 'error', msg: 'Please select a file to upload' });
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('course', course);
    formData.append('description', description);
    formData.append('file', file);

    try {
      await api.post('/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStatus({ type: 'success', msg: 'Resource uploaded successfully!' });
      setTimeout(() => navigate('/materials'), 2000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.message || 'Upload failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-view animate-fade-in">
      <div className="upload-view-header">
        <h1 className="heading-lg">Share Study Material</h1>
        <p className="text-muted">Fill in the details below to publish your resource to the community.</p>
      </div>

      <div className="upload-view-card glass-card">
        <form onSubmit={handleSubmit} className="upload-view-form">
          <div className="upload-view-section">
            <h3 className="section-title">Resource Information</h3>
            <div className="form-group-vertical">
              <div className="input-block">
                <label>Title of the material</label>
                <input 
                  type="text" 
                  placeholder="e.g. Introduction to Physics - Week 5 Notes" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="input-block">
                <label>Course Name / ID</label>
                <input 
                  type="text" 
                  placeholder="e.g. PHYS101" 
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  required
                />
              </div>

              <div className="input-block">
                <label>Description (Optional)</label>
                <textarea 
                  placeholder="Briefly explain what this resource covers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          </div>

          <div className="upload-view-section">
            <h3 className="section-title">File Attachment</h3>
            <div 
              className={`upload-box-large ${file ? 'active' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange}
              />
              
              {file ? (
                <div className="file-box-active">
                  <div className="file-icon-circle">
                    <File size={28} />
                  </div>
                  <div className="file-meta">
                    <span className="file-name-text">{file.name}</span>
                    <span className="file-size-text">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                  <button 
                    type="button" 
                    className="btn-file-remove"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div className="upload-box-prompt">
                  <div className="icon-pulse-box">
                    <UploadIcon size={32} />
                  </div>
                  <p className="prompt-main">Click or Drag & Drop to upload</p>
                  <p className="prompt-sub">Supports PDF, Word, Images up to 20MB</p>
                </div>
              )}
            </div>
          </div>

          {status.msg && (
            <div className={`upload-status-alert ${status.type}`}>
              {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              <span>{status.msg}</span>
            </div>
          )}

          <div className="upload-view-footer">
            <button 
              type="submit" 
              className="btn btn-primary btn-publish"
              disabled={loading || !file}
            >
              {loading ? (
                'Publishing...'
              ) : (
                <>
                  <span>Publish Material</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
