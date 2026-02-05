import { useState, useEffect } from 'react';
import Widget from '../components/Widget';
import { Download, AlertTriangle, CheckCircle, Info } from 'lucide-react';

const LogsPage = () => {
    const [logs, setLogs] = useState<any[]>([]);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        // Generate initial dummy logs
        const initialLogs = Array.from({ length: 20 }).map((_, i) => generateRandomLog(i));
        setLogs(initialLogs);

        // Simulate live incoming logs
        const interval = setInterval(() => {
            setLogs(prev => [generateRandomLog(prev.length), ...prev].slice(0, 100));
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const generateRandomLog = (id: number) => {
        const types = ['INFO', 'SUCCESS', 'WARNING', 'ERROR'];
        const type = types[Math.floor(Math.random() * types.length)];
        const messages = {
            INFO: ['System check initiated', 'Telemetry synced', 'Heartbeat signal sent', 'User login attempt'],
            SUCCESS: ['Connection established', 'Database verified', 'Command executed successfully', 'Path calculation complete'],
            WARNING: ['Latency high (120ms)', 'Battery usage spike', 'Minor terrain obstruction detected', 'Signal strength fluctuation'],
            ERROR: ['Connection timed out', 'Motor servo blocked', 'Auth token expired', 'Sensor calibration failed']
        };
        const msg = messages[type as keyof typeof messages][Math.floor(Math.random() * messages[type as keyof typeof messages].length)];

        return {
            id,
            timestamp: new Date().toLocaleTimeString(),
            type,
            message: msg,
            code: `LOG-${Math.floor(Math.random() * 1000)}`
        };
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ERROR': return <AlertTriangle className="w-4 h-4 text-neo-alert" />;
            case 'WARNING': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
            case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-neo-secondary" />;
            default: return <Info className="w-4 h-4 text-neo-primary" />;
        }
    };

    const filteredLogs = filter === 'ALL' ? logs : logs.filter(l => l.type === filter);

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-orbitron font-bold text-gray-800">System Logs & Analytics</h1>
                <div className="flex gap-2">
                    <button className="neo-btn bg-white border border-gray-200 text-gray-600 flex items-center gap-2 hover:bg-gray-50">
                        <Download className="w-4 h-4" /> Export
                    </button>
                    <div className="flex bg-white rounded-lg border border-gray-200 p-1">
                        {['ALL', 'INFO', 'WARNING', 'ERROR'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${filter === f ? 'bg-neo-primary text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Widget className="flex-1 overflow-hidden flex flex-col border border-gray-200 shadow-sm">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <div className="w-24">Time</div>
                    <div className="w-24">Level</div>
                    <div className="w-32">Code</div>
                    <div className="flex-1">Message</div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 font-mono text-sm bg-white">
                    {filteredLogs.map((log, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-3 rounded hover:bg-neo-primary/5 border border-transparent hover:border-neo-primary/10 transition-colors animate-in fade-in slide-in-from-left-2 duration-300">
                            <div className="w-24 text-gray-400 text-xs">{log.timestamp}</div>
                            <div className={`w-24 flex items-center gap-2 font-bold ${log.type === 'ERROR' ? 'text-neo-alert' :
                                log.type === 'WARNING' ? 'text-orange-500' :
                                    log.type === 'SUCCESS' ? 'text-neo-secondary' : 'text-neo-primary'
                                }`}>
                                {getIcon(log.type)}
                                {log.type}
                            </div>
                            <div className="w-32 text-gray-500">{log.code}</div>
                            <div className="flex-1 text-gray-700">{log.message}</div>
                        </div>
                    ))}
                    {filteredLogs.length === 0 && (
                        <div className="p-8 text-center text-gray-400">No logs found for this filter.</div>
                    )}
                </div>
            </Widget>
        </div>
    );
};

export default LogsPage;
