import { useState, useEffect } from 'react';
import api from '../api/axios';
import MaterialCard from '../components/MaterialCard';
import { Search, Filter, BookOpen } from 'lucide-react';

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [courseFilter, setCourseFilter] = useState('');

  const fetchMaterials = async () => {
    try {
      const res = await api.get(`/materials?search=${searchTerm}`);
      setMaterials(res.data);
    } catch (err) {
      console.error('Failed to fetch materials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMaterials();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      await api.delete(`/materials/${id}`);
      setMaterials(materials.filter(m => m._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const filteredMaterials = materials.filter(m => 
    courseFilter ? (m.course || '').toLowerCase().includes(courseFilter.toLowerCase()) : true
  );

  const clearFilters = () => {
    setSearchTerm('');
    setCourseFilter('');
  };

  return (
    <div className="materials-page animate-fade-in">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="heading-lg mb-2">Study Materials</h1>
          <p className="text-muted">High-quality resources shared by your community</p>
        </div>
        {(searchTerm || courseFilter) && (
          <button onClick={clearFilters} className="text-primary-light text-sm font-bold hover:underline mb-2">
            Clear all filters
          </button>
        )}
      </div>

      <div className="glass-card mb-12 p-6">
        <div className="flex flex-wrap gap-6 items-center">
          <div className="search-wrapper flex-[2] min-w-[300px]">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by title or topic..." 
              className="input-field pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-wrapper flex-1 min-w-[200px]">
            <Filter size={18} className="filter-icon" />
            <input 
              type="text" 
              placeholder="Filter by course..." 
              className="input-field pl-12"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dim font-medium">Fetching materials...</p>
        </div>
      ) : filteredMaterials.length > 0 ? (
        <div className="grid-cols-auto">
          {filteredMaterials.map((m) => (
            <MaterialCard key={m._id} material={m} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 glass-card">
          <div className="w-20 h-20 bg-glass-highlight rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={32} className="text-dim opacity-50" />
          </div>
          <h3 className="heading-md text-white mb-2">No materials found</h3>
          <p className="text-muted max-w-xs mx-auto">We couldn't find any materials matching your current search or filters.</p>
          {(searchTerm || courseFilter) && (
            <button 
              onClick={clearFilters}
              className="btn btn-primary mt-8"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Materials;
