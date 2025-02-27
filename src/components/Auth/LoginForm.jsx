import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { LogIn } from 'lucide-react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login(email, password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-[#21262D] bg-[#21262D] rounded-xl focus:ring-2 focus:ring-[#DB4551] focus:border-transparent outline-none transition-all text-white"
          placeholder="Enter your email"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-[#21262D] bg-[#21262D] rounded-xl focus:ring-2 focus:ring-[#DB4551] focus:border-transparent outline-none transition-all text-white"
          placeholder="Enter your password"
          required
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#DB4551] hover:opacity-90 text-white py-3 px-5 rounded-xl font-medium transition-colors flex items-center justify-center"
      >
        {isSubmitting ? (
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <LogIn className="h-5 w-5 mr-2" />
            Sign In
          </>
        )}
      </motion.button>
    </form>
  );
};

export default LoginForm;
