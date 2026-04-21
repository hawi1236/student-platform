import { FileText, Download, Trash2, Calendar, User, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MaterialCard = ({ material, onDelete }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isOwner = user?.id === material.userId?._id || user?.id === material.userId;

  const fileExt = material.fileUrl.split('.').pop().toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExt);

  const getFileIcon = () => {
    if (isImage) return <ImageIcon size={20} />;
    if (fileExt === 'pdf') return <FileText size={20} />;
    return <FileText size={20} />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const fullFileUrl = `http://localhost:5000${material.fileUrl}`;

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(fullFileUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', material.title + '.' + fileExt);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      window.open(fullFileUrl, '_blank');
    }
  };

  return (
    <div className="glass-card material-card animate-fade-in">
      <div className="material-preview-container">
        {isImage ? (
          <img src={fullFileUrl} alt={material.title} className="material-preview-img" />
        ) : (
          <div className="file-placeholder">
            <span className="placeholder-icon">{getFileIcon()}</span>
            <span className="placeholder-ext">{fileExt.toUpperCase()}</span>
          </div>
        )}
        <div className="material-course-badge">
          {material.course || material.subject}
        </div>
      </div>

      <div className="card-body">
        <div className="title-row">
          <h3 className="material-title">{material.title}</h3>
          <span className="file-size-badge">{formatFileSize(material.size)}</span>
        </div>
        <p className="material-description">{material.description || 'No description provided.'}</p>
        
        <div className="meta-info">
          <div className="meta-item">
            <div className="meta-avatar">{material.userId?.name?.charAt(0)}</div>
            <span>{material.userId?.name || 'User'}</span>
          </div>
          <div className="meta-item">
            <Calendar size={14} className="text-dim" />
            <span>{new Date(material.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
          </div>
        </div>
      </div>

      <div className="card-footer-actions">
        {(isAdmin || isOwner) && (
          <button 
            onClick={() => onDelete(material._id)}
            className="card-action-btn delete"
            title="Delete material"
          >
            <Trash2 size={18} />
          </button>
        )}
        <button 
          onClick={handleDownload}
          className="card-action-btn download"
          title="Download file"
        >
          <Download size={18} />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
};

export default MaterialCard;
