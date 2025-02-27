import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import LinkForm from './LinkForm';
import LinkItem from './LinkItem';
import { Search, Bookmark } from 'lucide-react';
import { createLink, getLinks, updateLink, deleteLink } from '../../lib/appwrite';
import { useAuth } from '../../hooks/useAuth';

const LinkContainer = () => {
  const [links, setLinks] = useState([]);
  const [filteredLinks, setFilteredLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingLink, setEditingLink] = useState(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchLinks = async () => {
      if (!user || !user.$id) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const response = await getLinks(user.$id);
        setLinks(response.documents || []);
        setFilteredLinks(response.documents || []);
      } catch (error) {
        console.error("Error fetching links:", error);
        toast.error("Failed to load links");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLinks();
  }, [user]);
  
  useEffect(() => {
    if (searchTerm) {
      const results = links.filter(link => 
        link.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        link.url.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLinks(results);
    } else {
      setFilteredLinks(links);
    }
  }, [searchTerm, links]);
  
  const handleSaveLink = async (title, url) => {
    try {
      if (editingLink) {
        // Update existing link
        const updated = await updateLink(editingLink.$id, title, url);
        const updatedLinks = links.map(link => 
          link.$id === editingLink.$id ? updated : link
        );
        setLinks(updatedLinks);
        toast.success("Link updated successfully!");
        setEditingLink(null);
      } else {
        // Create new link
        const newLink = await createLink(title, url, user.$id);
        setLinks([newLink, ...links]);
        toast.success("Link saved successfully!");
      }
      return true;
    } catch (error) {
      console.error("Error saving link:", error);
      toast.error(editingLink ? "Failed to update link" : "Failed to save link");
      return false;
    }
  };
  
  const handleEditLink = (link) => {
    setEditingLink(link);
  };
  
  const handleDeleteLink = async (id) => {
    try {
      await deleteLink(id);
      setLinks(links.filter(link => link.$id !== id));
      toast.success("Link deleted successfully!");
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link");
    }
  };
  
  return (
    <div className="py-6">
      
      
      <LinkForm 
        onSave={handleSaveLink} 
        editingLink={editingLink} 
        onCancelEdit={() => setEditingLink(null)} 
      />
      
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-[#DB4551]" />
        </div>
        <input
          type="text"
          placeholder="Search links..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-[#18181b] border border-[#21262D] rounded-xl focus:ring-1 focus:ring-[#DB4551] focus:border-transparent outline-none transition-all text-white"
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-10 w-10 border-3 border-[#DB4551] border-t-transparent rounded-full"></div>
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="text-center py-10 bg-[#21262D] rounded-xl border border-[#21262D]">
          <Bookmark size={40} className="mx-auto text-[#DB4551] mb-2 opacity-50" />
          <p className="text-white">
            {searchTerm ? "No links found matching your search" : "No links saved yet"}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#DB4551] mt-2 hover:text-white"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <AnimatePresence>
          {filteredLinks.map(link => (
            <LinkItem 
              key={link.$id}
              link={link}
              onEdit={handleEditLink}
              onDelete={handleDeleteLink}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default LinkContainer;
