import { useState, useEffect } from 'react';
import { getUsers, updateUserRole, deleteUser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Loader2, UserCheck, Shield, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Users() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await getUsers();
    if (error) alert('Error loading users: ' + error.message);
    if (data) setUsers(data);
    setLoading(false);
  }

  const handleRoleChange = async (id: string, newRole: 'admin' | 'pending' | 'user') => {
    setLoading(true);
    const { error } = await updateUserRole(id, newRole);
    if (error) alert('Error updating role: ' + error.message);
    await fetchUsers();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user? They will lose access.')) {
      setLoading(true);
      const { error } = await deleteUser(id);
      if (error) alert('Error deleting user: ' + error.message);
      await fetchUsers();
    }
  };

  if (loading && users.length === 0) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary w-8 h-8"/></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900">User Management</h1>
        <p className="text-gray-500 mt-1">Approve pending admins and manage staff roles.</p>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-widest text-gray-500">
              <th className="p-4 font-bold">User</th>
              <th className="p-4 font-bold">Status / Role</th>
              <th className="p-4 font-bold">Joined</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className={loading ? 'opacity-50' : ''} style={{display: loading ? 'table-row' : 'none'}}>
              <td colSpan={4} className="p-4 text-center text-sm text-gray-400">Updating...</td>
            </tr>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-sm text-gray-900">{u.full_name || 'Anonymous'}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {u.role === 'admin' && <Badge className="bg-green-100 text-green-700 hover:bg-green-100"><Shield className="w-3 h-3 mr-1"/> Admin</Badge>}
                    {u.role === 'pending' && <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>}
                    {u.role === 'user' && <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Standard User</Badge>}
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 items-center">
                    {u.role === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleRoleChange(u.id, 'admin')}
                        className="bg-primary text-white rounded-none h-8 px-3 text-xs"
                      >
                        <UserCheck className="w-3 h-3 mr-1" /> Approve
                      </Button>
                    )}
                    {u.role === 'admin' && currentUser?.id !== u.id && (
                       <Button 
                       variant="outline"
                       size="sm" 
                       onClick={() => handleRoleChange(u.id, 'user')}
                       className="rounded-none h-8 px-3 text-xs"
                     >
                       Demote
                     </Button>
                    )}
                    {currentUser?.id !== u.id && (
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
