import { motion } from 'framer-motion';
import { BookmarkIcon, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import logo from '/logo.png'
const Header = () => {
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-[#18181b] py-4 px-6 sticky top-0 z-10 shadow-lg rounded-b-3xl">
      <div className="container mx-auto max-w-3xl flex justify-between items-center">
        <motion.div 
          className="flex items-center" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        > 
          <img src={logo} className='h-8 w-8 mx-2' alt="" />
          <h1 className="text-xl font-bold text-gray-300">MyLinks</h1>
        </motion.div>
        
        {user && (
          <div className="flex items-center">
            <div className="hidden sm:flex items-center mr-4">
              <div className="bg-[#6F59DD] p-2 rounded-full">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm text-white ml-2">{user.name}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex cursor-pointer items-center text-sm px-4 py-2 rounded-full text-white bg-[#21262D] border border-[#DB4551] hover:bg-[#DB4551] transition-colors"
            >
              <LogOut size={16} className="mr-1.5" />
              <span>Logout</span>
            </motion.button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
