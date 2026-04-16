import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, role, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Not logged in -> redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but pending approval
  if (role === 'pending') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="bg-orange-50 text-orange-600 p-4 rounded-full mb-6">
          <Loader2 className="w-12 h-12 animate-spin" />
        </div>
        <h1 className="text-3xl font-serif font-bold mb-4">Pending Approval</h1>
        <p className="text-gray-600 max-w-md mb-8">
          Your account has been created successfully, but requires approval from the primary administrator before you can access the admin panel.
        </p>
        <Button onClick={() => signOut()} variant="outline" className="rounded-none">
          Sign Out
        </Button>
      </div>
    );
  }

  // Logged in but not an admin (just a standard user, if implemented later)
  if (role !== 'admin') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-serif font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">You do not have permission to view this page.</p>
        <Button onClick={() => window.location.href = '/'} className="rounded-none bg-primary">
          Return Home
        </Button>
      </div>
    );
  }

  // Is admin -> render content
  return <>{children}</>;
}
