import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import API from "../api/axios";
import { toast } from "sonner";
import { motion } from 'framer-motion';

export default function AuthPage({ setIsAuth }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await API.post("/auth/login", { email, password });
      } else {
        await API.post("/auth/signup", { name, email, password });
      }
      setIsAuth(true);
      navigate("/dashboard");
      toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred";
      toast.error("Authentication Failed", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] p-4 overflow-hidden relative">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="card shadow-2xl border-none backdrop-blur-xl bg-white/80 dark:bg-black/60 p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-16 h-16 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/30 flex items-center justify-center text-white mb-6"
            >
              <CheckCircle size={36} />
            </motion.div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">TaskFlow</h1>
            <p className="text-[var(--text-secondary)] text-sm mt-2 font-medium">
              {isLogin ? "Unlock your productivity." : "Start your streak journey today."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Full Name"
                  className="w-full bg-[var(--bg-secondary)] border-none rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Email Address"
                className="w-full bg-[var(--bg-secondary)] border-none rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className="w-full bg-[var(--bg-secondary)] border-none rounded-xl pl-12 pr-4 py-4 focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 mt-4 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-semibold text-[var(--text-secondary)] hover:text-blue-500 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}