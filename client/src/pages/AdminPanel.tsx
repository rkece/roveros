import { useEffect, useState } from 'react';
import Widget from '../components/Widget';
import { User, Shield, AlertTriangle, CheckCircle, Server, Database } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AdminPanel = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        users: 0,
        systemHealth: 'Good',
        uptime: '99.9%',
        dbStatus: 'Connected'
    });
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        // Simulate fetching admin data
        setStats({
            users: 12,
            systemHealth: 'Optimal',
            uptime: `${(Math.random() * 2 + 97).toFixed(2)}%`,
            dbStatus: 'Connected'
        });

        setLogs([
            '[SYSTEM] Health check passed',
            '[AUTH] New operator registered',
            '[DB] Backup completed successfully',
            '[NETWORK] Latency spike detected (resolved)',
            '[SYSTEM] Firmware v2.5.1 ready for deployment'
        ]);
    }, []);

    if (user?.role !== 'admin' && user?.role !== 'operator') { // Simplified check for demo
        return (
            <div className="flex flex-col items-center justify-center h-[500px]">
                <Shield className="w-16 h-16 text-neo-alert mb-4 animate-pulse" />
                <h2 className="text-2xl font-orbitron text-gray-800">ACCESS DENIED</h2>
                <p className="text-neo-muted mt-2">Insufficient Clearance Level</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-orbitron font-bold text-gray-800 mb-6">Administrator Console</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Widget className="border-l-4 border-l-neo-primary">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-neo-primary/20 rounded-full"><User className="text-neo-primary w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-neo-muted uppercase">Total Personnel</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.users}</p>
                        </div>
                    </div>
                </Widget>

                <Widget className="border-l-4 border-l-neo-secondary">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-neo-secondary/20 rounded-full"><Server className="text-neo-secondary w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-neo-muted uppercase">System Health</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.systemHealth}</p>
                        </div>
                    </div>
                </Widget>

                <Widget className="border-l-4 border-l-yellow-400">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-400/20 rounded-full"><AlertTriangle className="text-yellow-400 w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-neo-muted uppercase">Uptime</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.uptime}</p>
                        </div>
                    </div>
                </Widget>

                <Widget className="border-l-4 border-l-gray-400">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-400/20 rounded-full"><Database className="text-gray-600 w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-neo-muted uppercase">Database</p>
                            <p className="text-2xl font-bold text-gray-800">{stats.dbStatus}</p>
                        </div>
                    </div>
                </Widget>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Widget title="System Event Logs">
                    <div className="space-y-2 font-mono text-sm">
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-2">
                                <span className="text-neo-time text-xs opacity-50">{new Date().toLocaleTimeString()}</span>
                                <span className="text-neo-text">{log}</span>
                            </div>
                        ))}
                    </div>
                </Widget>

                <Widget title="User Management">
                    <table className="w-full text-left text-sm">
                        <thead className="text-xs text-neo-muted uppercase border-b border-white/10">
                            <tr>
                                <th className="py-2">User</th>
                                <th className="py-2">Role</th>
                                <th className="py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr>
                                <td className="py-3">Commander Shepard</td>
                                <td className="text-neo-primary">Admin</td>
                                <td className="text-neo-secondary flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</td>
                            </tr>
                            <tr>
                                <td className="py-3">Operator 7</td>
                                <td className="text-neo-text">Operator</td>
                                <td className="text-neo-muted">Offline</td>
                            </tr>
                        </tbody>
                    </table>
                </Widget>
            </div>
        </div>
    );
};

export default AdminPanel;
