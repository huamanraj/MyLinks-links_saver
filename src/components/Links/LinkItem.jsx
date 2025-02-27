import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Edit, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const LinkItem = ({ link, onEdit, onDelete }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      setIsCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      toast.error("Failed to copy link");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="bg-[#18181b] rounded-xl p-5 mb-4 shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-lg text-white truncate">{link.title}</h3>
          <div className="flex items-center text-sm text-[#A0A0A0] mt-1">
            <p className="truncate mr-4">{link.url}</p>
            <span className="text-xs text-[#DB4551] whitespace-nowrap">{formatDate(link.created_at)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={copyToClipboard}
            className="p-2 text-[#A0A0A0] hover:text-[#DB4551] hover:bg-[#21262D]/70 rounded-full transition-colors"
            aria-label="Copy link"
            title="Copy link"
          >
            <Copy size={18} className={isCopied ? "text-[#DB4551]" : ""} />
          </button>
          
          <a 
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-[#A0A0A0] hover:text-[#DB4551] hover:bg-[#21262D]/70 rounded-full transition-colors"
            aria-label="Open link"
            title="Open link"
          >
            <ExternalLink size={18} />
          </a>
          
          <button 
            onClick={() => onEdit(link)}
            className="p-2 text-[#A0A0A0] hover:text-[#6F59DD] hover:bg-[#21262D]/70 rounded-full transition-colors"
            aria-label="Edit link"
            title="Edit link"
          >
            <Edit size={18} />
          </button>
          
          <button 
            onClick={() => onDelete(link.$id)}
            className="p-2 text-[#A0A0A0] hover:text-[#DB4551] hover:bg-[#21262D]/70 rounded-full transition-colors"
            aria-label="Delete link"
            title="Delete link"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LinkItem;
