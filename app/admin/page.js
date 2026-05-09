'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/api';
import useStore from '@/store/useStore';
import { 
  Users, ShieldCheck, ShieldAlert, CheckCircle2, 
  XCircle, Loader2, Search, Filter, Mail, Calendar, 
  Settings, UserCheck, UserX, ExternalLink, AlertCircle
} from 'lucide-react';


export default function AdminDashboard() {
  const router = useRouter();
  const { user, sessionLoading } = useStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('workshop'); // Show workshops by default
  const [actioning, setActioning] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!user || user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchUsers();
  }, [user, sessionLoading]);

  const toggleApproval = async (userId, currentStatus) => {
    setActioning(userId);
    try {
      await API.patch(`/admin/users/${userId}/approve`, { isApproved: !currentStatus });
      await fetchUsers();
    } catch (err) {
      alert('Failed to update approval status');
    } finally {
      setActioning(null);
    }
  };

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true;
    return u.role === filter;
  });

  if (sessionLoading || loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-primary bg-background">
      <Loader2 className="animate-spin mb-4" size={48} />
      <p className="font-orbitron tracking-widest uppercase animate-pulse">Initializing Admin Core...</p>
    </div>
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full flex items-center gap-2">
              <ShieldCheck className="text-red-500" size={14} />
              <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Admin Authorization Active</span>
            </div>
          </div>
          <h1 className="font-orbitron text-5xl font-black text-white tracking-tighter uppercase mb-2">
            System <span className="text-primary">Admin</span>
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Governance & User Control Center</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-surface border border-border p-6 rounded-3xl flex items-center gap-6">
            <div className="text-right">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Total Registered</p>
              <p className="font-orbitron text-2xl font-bold text-white">{users.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Users size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Management Control Bar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center bg-surface border border-border p-6 rounded-[2rem]">
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:border-primary outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto bg-black/20 p-1.5 rounded-2xl border border-white/5">
            {['all', 'customer', 'workshop', 'admin'].map(r => (
              <button 
                key={r}
                onClick={() => setFilter(r)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === r ? 'bg-primary text-background' : 'text-gray-500 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-surface border border-border rounded-[2.5rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-border">
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">User Profile</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Account Type</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">Permissions</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((u) => (
                <tr key={u._id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-surface to-black flex items-center justify-center text-primary border border-white/5">
                        <Users size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">{u.name}</p>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1.5 mt-0.5">
                          <Mail size={12} /> {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      u.role === 'admin' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                      u.role === 'workshop' ? 'bg-primary/10 text-primary border-primary/20' :
                      'bg-white/5 text-gray-500 border-white/5'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-3">
                      {u.isApproved ? (
                        <div className="flex items-center gap-2 text-secondary">
                          <CheckCircle2 size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Authorized</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-yellow-500">
                          <AlertCircle size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Pending Review</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-8 text-right">
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => toggleApproval(u._id, u.isApproved)}
                        disabled={actioning === u._id}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          u.isApproved 
                            ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                            : 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-background shadow-[0_0_20px_rgba(0,255,136,0.1)]'
                        }`}
                      >
                        {actioning === u._id ? (
                          <Loader2 size={14} className="animate-spin mx-auto" />
                        ) : u.isApproved ? (
                          <span className="flex items-center gap-2 justify-center"><UserX size={14} /> Revoke Access</span>
                        ) : (
                          <span className="flex items-center gap-2 justify-center"><UserCheck size={14} /> Grant Access</span>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
