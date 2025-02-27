import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { UserPlus, Check, X } from 'lucide-react';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { register } = useAuth();
  
  // Password validation criteria
  const passwordCriteria = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };
  
  // Check if all password criteria are met
  const passwordValid = Object.values(passwordCriteria).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!passwordValid) return;
    
    setIsSubmitting(true);
    
    try {
      await register(email, password, name);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to render validation status icons
  const ValidationIcon = ({ isValid }) => (
    isValid ? 
      <Check size={16} className="text-green-500" /> : 
      <X size={16} className="text-red-500" />
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-[#21262D] bg-[#21262D] rounded-xl focus:ring-2 focus:ring-[#DB4551] focus:border-transparent outline-none transition-all text-white"
          placeholder="Enter your full name"
          required
        />
      </div>

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
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(password.length === 0 ? false : true)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#DB4551] focus:border-transparent outline-none transition-all text-white ${
            password.length > 0 
              ? passwordValid 
                ? 'border-green-500 bg-opacity-10 bg-green-500' 
                : 'border-red-500 bg-opacity-10 bg-red-500' 
              : 'border-[#21262D] bg-[#21262D]'
          }`}
          placeholder="Create a password"
          required
          minLength="8"
        />
        
        {/* Password validation requirements display */}
        {passwordFocused && (
          <div className="mt-2 p-3 bg-[#21262D] rounded-lg border border-[#2D333B]">
            <p className="text-sm text-gray-300 mb-2">Password must have:</p>
            <ul className="space-y-1">
              <li className="flex items-center text-xs">
                <ValidationIcon isValid={passwordCriteria.minLength} />
                <span className={`ml-2 ${passwordCriteria.minLength ? 'text-green-400' : 'text-gray-400'}`}>
                  At least 8 characters
                </span>
              </li>
              <li className="flex items-center text-xs">
                <ValidationIcon isValid={passwordCriteria.hasUpperCase} />
                <span className={`ml-2 ${passwordCriteria.hasUpperCase ? 'text-green-400' : 'text-gray-400'}`}>
                  One uppercase letter (A-Z)
                </span>
              </li>
              <li className="flex items-center text-xs">
                <ValidationIcon isValid={passwordCriteria.hasLowerCase} />
                <span className={`ml-2 ${passwordCriteria.hasLowerCase ? 'text-green-400' : 'text-gray-400'}`}>
                  One lowercase letter (a-z)
                </span>
              </li>
              <li className="flex items-center text-xs">
                <ValidationIcon isValid={passwordCriteria.hasNumber} />
                <span className={`ml-2 ${passwordCriteria.hasNumber ? 'text-green-400' : 'text-gray-400'}`}>
                  One number (0-9)
                </span>
              </li>
              <li className="flex items-center text-xs">
                <ValidationIcon isValid={passwordCriteria.hasSymbol} />
                <span className={`ml-2 ${passwordCriteria.hasSymbol ? 'text-green-400' : 'text-gray-400'}`}>
                  One special character (!@#$%^&*...)
                </span>
              </li>
            </ul>
          </div>
        )}
      </div>

      <motion.button
        whileHover={{ scale: !passwordValid || isSubmitting ? 1 : 1.01 }}
        whileTap={{ scale: !passwordValid || isSubmitting ? 1 : 0.98 }}
        type="submit"
        disabled={!passwordValid || isSubmitting}
        className={`w-full py-3 px-5 rounded-xl font-medium flex items-center justify-center transition-colors ${
          passwordValid && !isSubmitting 
            ? 'bg-[#DB4551] hover:opacity-90 text-white cursor-pointer' 
            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
        }`}
      >
        {isSubmitting ? (
          <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <>
            <UserPlus className="h-5 w-5 mr-2" />
            Create Account
          </>
        )}
      </motion.button>
    </form>
  );
};

export default RegisterForm;
