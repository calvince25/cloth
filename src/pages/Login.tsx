import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Navigate } from 'react-router-dom';
import { signIn, signUp } from '@/lib/auth';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const { user, role, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated and approved admin, redirect
  if (user && role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  // If authenticated but pending, redirect to trigger the AdminRoute blocked screen
  if (user && role === 'pending') {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) throw error;
        navigate('/admin/dashboard');
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        // Supabase auto signs in on signup if email confirmation is disabled
        navigate('/admin/dashboard'); 
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Admin Login | Buver Nairobi</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <h2 className="text-3xl font-serif font-bold text-gray-900">
          Buver Admin
        </h2>
        <p className="mt-2 text-sm text-gray-600 uppercase tracking-widest font-bold">
          {isLogin ? 'Sign in to your account' : 'Apply for admin access'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-sm sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-xs uppercase tracking-widest font-bold text-gray-700">
                  Full Name
                </label>
                <div className="mt-1">
                  <Input
                    type="text"
                    required
                    className="h-12 rounded-none"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <Input
                  type="email"
                  required
                  className="h-12 rounded-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <Input
                  type="password"
                  required
                  className="h-12 rounded-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-none bg-primary hover:bg-primary/90 text-white uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLogin ? 'Sign In' : 'Register Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm font-medium text-secondary hover:text-primary transition-colors"
            >
              {isLogin
                ? "Don't have an account? Register"
                : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
