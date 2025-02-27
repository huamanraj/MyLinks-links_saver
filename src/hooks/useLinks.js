import { useState } from 'react';
import { createLink, getLinks, updateLink, deleteLink } from '../lib/appwrite';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';

export const useLinks = () => {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const fetchLinks = async () => {
    if (!user || !user.$id) {
      setLinks([]);
      setIsLoading(false);
      return [];
    }
    
    try {
      setIsLoading(true);
      const response = await getLinks(user.$id);
      const fetchedLinks = response.documents || [];
      setLinks(fetchedLinks);
      return fetchedLinks;
    } catch (error) {
      console.error("Error fetching links:", error);
      toast.error("Failed to load links");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const saveLink = async (title, url, linkId = null) => {
    if (!user) return false;
    
    try {
      if (linkId) {
        // Update
        const updated = await updateLink(linkId, title, url);
        setLinks(prev => prev.map(link => link.$id === linkId ? updated : link));
        toast.success("Link updated successfully!");
      } else {
        // Create
        const newLink = await createLink(title, url, user.$id);
        setLinks(prev => [newLink, ...prev]);
        toast.success("Link saved successfully!");
      }
      return true;
    } catch (error) {
      console.error("Error saving link:", error);
      toast.error(linkId ? "Failed to update link" : "Failed to save link");
      return false;
    }
  };

  const removeLink = async (id) => {
    try {
      await deleteLink(id);
      setLinks(prev => prev.filter(link => link.$id !== id));
      toast.success("Link deleted successfully!");
      return true;
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link");
      return false;
    }
  };

  return {
    links,
    isLoading,
    fetchLinks,
    saveLink,
    removeLink
  };
};
