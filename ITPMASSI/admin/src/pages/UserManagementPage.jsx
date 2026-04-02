import { useEffect, useState } from "react";
import { FiUser, FiMail, FiShield } from "react-icons/fi";
import { getUsers } from "../services/api";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await getUsers();
        setUsers(response.data || []);
      } catch (error) {
        console.error("Failed to load users:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-300">Loading users...</p>
      </div>
    );
  }

  const adminCount = users.filter((u) => u.role === "admin").length;
  const studentCount = users.filter((u) => u.role === "student").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="panel-glass p-6 border border-slate-700/50">
        <h1 className="text-3xl font-bold text-white">User Management</h1>
        <p className="text-slate-300 mt-2">
          Total users: {users.length} (Admins: {adminCount}, Students: {studentCount})
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="panel-glass p-6 border border-blue-500/30 bg-blue-500/5">
          <p className="text-sm text-slate-400">Total Users</p>
          <p className="text-4xl font-bold text-white mt-2">{users.length}</p>
        </div>
        <div className="panel-glass p-6 border border-purple-500/30 bg-purple-500/5">
          <p className="text-sm text-slate-400">Administrators</p>
          <p className="text-4xl font-bold text-purple-400 mt-2">{adminCount}</p>
        </div>
        <div className="panel-glass p-6 border border-green-500/30 bg-green-500/5">
          <p className="text-sm text-slate-400">Students</p>
          <p className="text-4xl font-bold text-green-400 mt-2">{studentCount}</p>
        </div>
      </div>

      <div className="panel-glass p-6 border border-slate-700/50">
        <h3 className="text-lg font-bold text-white mb-4">User Directory</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-3 px-4 font-semibold text-slate-300">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-300">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-300">Role</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-slate-700/50 hover:bg-slate-800/50 transition"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiUser className="text-slate-400" />
                      <span className="text-white font-medium">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <FiMail size={14} className="text-slate-400" />
                      <span className="text-slate-300">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      <FiShield size={12} />
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
