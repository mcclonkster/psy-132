import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Tag, 
  Trash2, 
  Edit2, 
  Image as ImageIcon, 
  X, 
  ExternalLink,
  Filter,
  Info,
  FileText,
  Copy,
  Calendar,
  Bookmark,
  Hash
} from 'lucide-react';

const App = () => {
  // --- Initial Data (Now using arrays for topic_name and topic_number) ---
  const initialData = [
    {
      id: 'iq-1',
      url: 'https://www.verywellmind.com/thmb/rX5FpFTVw9SkKY3CrfcQpDWtAOE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/theories-of-intelligence-2795035-01-152b36bf815d40f99533cd7dd4d5d2df.png',
      title: 'Theories of Intelligence',
      description: 'How Psychologists Define Intelligence: learn, recognize problems, solve problems.',
      text_extract: `How Psychologists Define Intelligence
The ability to learn
The ability to
recognize problems
The ability to solve problems
verywell`,
      alt_text: 'Diagram showing definition of intelligence: learning, problem recognition, and problem solving.',
      topic_name: ['Intelligence Foundations', 'Cognitive Psych 101'],
      topic_number: ['1.0', '1.1'],
      tags: ['psychology', 'intelligence', 'theories'],
      file_size: '45 KB',
      date_added: 'Feb 24, 2026'
    },
    {
      id: 'memory-strat-01',
      url: 'https://elearningimages.adobe.com/files/2024/07/611918513-five-powerful-memory-boosting-learning-strategies-01-01-scaled.jpg',
      title: 'Five Powerful Memory-Boosting Learning Strategies',
      description: 'Detailed breakdown of educational psychology memory strategies.',
      text_extract: `Five Powerful Memory-Boosting Learning Strategies
5. METACOGNITION
Provide opportunities for self-monitoring, self-testing, and self-explanation.
...`,
      alt_text: 'Infographic of five memory-boosting learning strategies.',
      topic_name: ['Memory Enhancement'],
      topic_number: ['2.3'],
      tags: ['memory', 'learning', 'education', 'mnemonics'],
      file_size: '438 KB',
      date_added: 'Feb 24, 2026'
    }
  ];

  // --- State ---
  const [images, setImages] = useState(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingImage, setViewingImage] = useState(null);
  const [editingImage, setEditingImage] = useState(null);
  
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    text_extract: '',
    alt_text: '',
    topic_name: '',
    topic_number: '',
    tags: '',
    file_size: ''
  });

  // --- Derived State ---
  const allTags = useMemo(() => {
    const tags = new Set(['All']);
    images.forEach(img => img.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [images]);

  const filteredImages = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return images.filter(img => {
      const matchesSearch = 
        img.title.toLowerCase().includes(query) ||
        img.description.toLowerCase().includes(query) ||
        (img.text_extract && img.text_extract.toLowerCase().includes(query)) ||
        (img.alt_text && img.alt_text.toLowerCase().includes(query)) ||
        img.topic_name.some(t => t.toLowerCase().includes(query)) ||
        img.topic_number.some(t => t.toLowerCase().includes(query)) ||
        img.tags.some(t => t.toLowerCase().includes(query));
      
      const matchesTag = selectedTag === 'All' || img.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [images, searchQuery, selectedTag]);

  // --- Handlers ---
  const handleOpenAddModal = () => {
    setEditingImage(null);
    setFormData({ url: '', title: '', description: '', text_extract: '', alt_text: '', topic_name: '', topic_number: '', tags: '', file_size: '' });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (e, image) => {
    e.stopPropagation();
    setEditingImage(image);
    setFormData({
      url: image.url,
      title: image.title,
      description: image.description,
      text_extract: image.text_extract || '',
      alt_text: image.alt_text || '',
      topic_name: image.topic_name.join(', '),
      topic_number: image.topic_number.join(', '),
      tags: image.tags.join(', '),
      file_size: image.file_size || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Helper to parse comma strings to clean arrays
    const parseList = (str) => str.split(',').map(s => s.trim()).filter(s => s !== '');

    const processedData = {
      ...formData,
      tags: parseList(formData.tags),
      topic_name: parseList(formData.topic_name),
      topic_number: parseList(formData.topic_number),
    };

    if (editingImage) {
      setImages(images.map(img => 
        img.id === editingImage.id 
          ? { ...img, ...processedData } 
          : img
      ));
    } else {
      const newImage = {
        id: Math.random().toString(36).substr(2, 9),
        ...processedData,
        date_added: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      setImages([newImage, ...images]);
    }
    setIsModalOpen(false);
  };

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-800 flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <ImageIcon className="text-white" size={32} />
              </div>
              Insight Vault
            </h1>
            <p className="text-slate-500 mt-2 text-lg">Multi-Topic Verbatim Asset Library</p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-200 active:scale-95"
          >
            <Plus size={24} />
            Import Entry
          </button>
        </div>
      </header>

      {/* Search & Filters */}
      <section className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
          <input
            type="text"
            placeholder="Search titles, multiple topics, or verbatim content..."
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-blue-500 outline-none transition-all shadow-sm text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative min-w-[220px]">
          <Filter className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <select
            className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl appearance-none outline-none cursor-pointer shadow-sm font-semibold text-slate-700"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            {allTags.map(tag => (
              <option key={tag} value={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredImages.map((image) => (
            <div 
              key={image.id} 
              onClick={() => setViewingImage(image)}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={image.url}
                  alt={image.alt_text || image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={(e) => handleOpenEditModal(e, image)}
                    className="p-3 bg-white/90 backdrop-blur shadow-lg rounded-xl text-slate-700 hover:text-blue-600 transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                </div>
                {image.topic_number.length > 0 && (
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-1">
                    {image.topic_number.map(num => (
                      <span key={num} className="px-2 py-1 bg-blue-600/90 backdrop-blur text-white text-[9px] font-bold rounded-md uppercase tracking-widest shadow-lg">
                        {num}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-grow">
                {image.topic_name.length > 0 && (
                  <div className="flex flex-wrap gap-x-2 text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">
                    {image.topic_name.map((name, idx) => (
                      <span key={name}>
                        {name}{idx < image.topic_name.length - 1 ? ' •' : ''}
                      </span>
                    ))}
                  </div>
                )}
                <h3 className="font-extrabold text-lg text-slate-800 leading-tight group-hover:text-blue-600 transition-colors mb-2">
                  {image.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                  {image.description}
                </p>
                {image.text_extract && (
                  <div className="mb-4 flex items-start gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <FileText size={14} className="text-slate-400 mt-1 flex-shrink-0" />
                    <p className="text-[11px] text-slate-400 italic line-clamp-2 leading-relaxed">
                      {image.text_extract}
                    </p>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {image.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Full Asset Viewer */}
      {viewingImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl" onClick={() => setViewingImage(null)}></div>
          <div className="relative bg-white w-full max-w-6xl rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh]">
            <button 
              onClick={() => setViewingImage(null)}
              className="absolute top-6 right-6 z-10 p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-all"
            >
              <X size={24} />
            </button>
            <div className="w-full md:w-3/5 bg-slate-200 flex items-center justify-center p-4 overflow-hidden">
              <img src={viewingImage.url} className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" alt={viewingImage.alt_text || viewingImage.title} />
            </div>
            <div className="w-full md:w-2/5 p-8 md:p-12 overflow-y-auto bg-white flex flex-col">
              <div className="mb-6 space-y-2">
                <div className="flex flex-wrap gap-2">
                  {viewingImage.topic_number.map(num => (
                    <div key={num} className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-[10px] rounded-lg uppercase tracking-wider">
                      Topic {num}
                    </div>
                  ))}
                </div>
                <div className="text-slate-400 font-bold text-[11px] uppercase tracking-widest flex flex-wrap gap-x-3">
                  {viewingImage.topic_name.map((name, i) => (
                    <span key={name} className="flex items-center">
                       {name}{i < viewingImage.topic_name.length - 1 && <span className="ml-3 text-slate-200">|</span>}
                    </span>
                  ))}
                </div>
              </div>

              <h2 className="text-3xl font-black text-slate-800 mb-6 leading-tight">{viewingImage.title}</h2>
              
              <div className="space-y-8 flex-grow">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info size={14} /> Description
                  </h4>
                  <p className="text-slate-600 leading-relaxed">{viewingImage.description}</p>
                </div>
                {viewingImage.text_extract && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <FileText size={14} /> Verbatim Text Extract
                    </h4>
                    <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl relative group font-mono text-sm">
                      <pre className="text-slate-700 whitespace-pre-wrap leading-relaxed">
                        {viewingImage.text_extract}
                      </pre>
                      <button 
                        onClick={() => copyToClipboard(viewingImage.text_extract)}
                        className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Copy size={16} />
                      </button>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-8 mt-auto">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Import Date</span>
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <Calendar size={14} className="text-blue-500" />
                      {viewingImage.date_added}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">File Size</span>
                    <div className="text-slate-700 font-semibold">{viewingImage.file_size || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-2xl font-black text-slate-800">
                {editingImage ? 'Edit Metadata' : 'New Library Entry'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={28} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Image URL</label>
                  <input required type="url" className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-medium" 
                    value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Topic Names (Comma Sep)</label>
                  <div className="relative">
                    <Bookmark size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input type="text" placeholder="Memory, IQ" className="w-full pl-10 pr-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-medium"
                      value={formData.topic_name} onChange={(e) => setFormData({ ...formData, topic_name: e.target.value })} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Topic Numbers (Comma Sep)</label>
                  <div className="relative">
                    <Hash size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input type="text" placeholder="1.2, 2.3" className="w-full pl-10 pr-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-medium"
                      value={formData.topic_number} onChange={(e) => setFormData({ ...formData, topic_number: e.target.value })} />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Title</label>
                <input required type="text" className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-medium"
                  value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Alt Text</label>
                <input type="text" placeholder="Describe the visual content..." className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-medium"
                  value={formData.alt_text} onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Verbatim Text Content</label>
                <textarea rows="6" placeholder="Paste extracted text exactly..." className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-mono text-sm leading-relaxed"
                  value={formData.text_extract} onChange={(e) => setFormData({ ...formData, text_extract: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tags</label>
                  <input type="text" placeholder="nature, iq" className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-medium"
                    value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Size Metadata</label>
                  <input type="text" placeholder="e.g. 438 KB" className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-medium"
                    value={formData.file_size} onChange={(e) => setFormData({ ...formData, file_size: e.target.value })} />
                </div>
              </div>
              <div className="pt-6 flex gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-grow py-4 px-6 border-2 border-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-50 transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-grow py-4 px-6 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all">
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;