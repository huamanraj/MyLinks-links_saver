import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, X, Save } from 'lucide-react';

const LinkForm = ({ onSave, editingLink, onCancelEdit }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingLink) {
      setTitle(editingLink.title);
      setUrl(editingLink.url);
    } else {
      setTitle('');
      setUrl('');
    }
  }, [editingLink]);

  // Function to fetch the title from the URL
  const fetchTitleFromUrl = async (url) => {
    try {
      const response = await fetch(`https://api.linkpreview.net?key=09a36449f63d4957454e99769f2ecd38&q=${url}`);
      const data = await response.json();
      if (data.title) {
        setTitle(data.title);
      }
    } catch (error) {
      console.error("Failed to fetch title:", error);
    }
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    
    // Fetch title when URL changes
    if (newUrl) {
      fetchTitleFromUrl(newUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !url.trim()) {
      return;
    }
    
    // Simple URL validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setUrl('https://' + url);
    }
    
    setIsSubmitting(true);
    const success = await onSave(title, url.startsWith('http') ? url : `https://${url}`);
    
    if (success) {
      setTitle('');
      setUrl('');
    }
    
    setIsSubmitting(false);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col sm:flex-row gap-3 mb-6"
    >
      <div className="flex items-center flex-1 bg-[#18181b] rounded-xl px-4 py-3">
        <LinkIcon className="text-[#DB4551] mr-2" size={18} />
        <input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-[#A0A0A0] mr-2"
          required
        />
      </div>
      
      <div className="flex-[2] flex items-center bg-[#18181b] rounded-xl px-4 py-3">
        <input
          type="text"
          placeholder="Enter URL"
          value={url}
          onChange={handleUrlChange}
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-[#A0A0A0]"
          required
        />
      </div>
      
      <div className="flex gap-2">
        {editingLink && (
          <motion.button
            type="button"
            onClick={onCancelEdit}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-3 bg-[#18181b] text-red-500 rounded-xl hover:bg-[#21262D]/80 transition-colors flex items-center justify-center"
          >
            <X size={18} />
          </motion.button>
        )}
        
        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          disabled={isSubmitting}
          className={`px-5 py-3 ${editingLink ? 'bg-[#6F59DD]' : 'bg-[#98323a]'} text-white rounded-md cursor-pointer hover:opacity-90 transition-colors flex items-center justify-center`}
        >
          {isSubmitting ? (
            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : editingLink ? (
            <>
              <Save size={18} className="mr-1" />
              Update
            </>
          ) : (
            'Save Link'
          )}
        </motion.button>
      </div>
    </motion.form>
  );
};

export default LinkForm;
