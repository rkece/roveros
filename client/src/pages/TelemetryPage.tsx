import { useEffect, useState } from 'react';
import Widget from '../components/Widget';
import { useSocket } from '../hooks/useSocket';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Zap, Thermometer, Cpu } from 'lucide-react';

const TelemetryPage = () => {
    const { socket } = useSocket();
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (!socket) return;
        const handleData = (data: any) => {
            setHistory(prev => {
                const newData = [...prev, {
                    time: new Date().toLocaleTimeString(),
                    ...data,
                    temp: 20 + Math.random() * 5,
                    cpu: 10 + Math.random() * 20
                }];
                if (newData.length > 100) newData.shift();
                return newData;
            });
        };
        socket.on('rover:telemetry', handleData);
        return () => { socket.off('rover:telemetry', handleData); }
    }, [socket]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-orbitron font-bold text-gray-800 mb-6">Advanced Telemetry</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Widget title="Core Temperature" className="h-40 border-l-4 border-l-orange-500">
                    <div className="flex items-center justify-between h-full pb-6">
                        <div>
                            <p className="text-4xl font-bold text-gray-800">24.5°C</p>
                            <p className="text-sm text-gray-500">Optimal Range</p>
                        </div>
                        <Thermometer className="w-12 h-12 text-orange-500 opacity-20" />
                    </div>
                </Widget>
                <Widget title="CPU Load" className="h-40 border-l-4 border-l-cyan-500">
                    <div className="flex items-center justify-between h-full pb-6">
                        <div>
                            <p className="text-4xl font-bold text-gray-800">12%</p>
                            <p className="text-sm text-gray-500">AI Processing Active</p>
                        </div>
                        <Cpu className="w-12 h-12 text-cyan-500 opacity-20" />
                    </div>
                </Widget>
                <Widget title="Motor Power" className="h-40 border-l-4 border-l-purple-500">
                    <div className="flex items-center justify-between h-full pb-6">
                        <div>
                            <p className="text-4xl font-bold text-gray-800">45 W</p>
                            <p className="text-sm text-gray-500">Efficiency 94%</p>
                        </div>
                        <Zap className="w-12 h-12 text-purple-500 opacity-20" />
                    </div>
                </Widget>
            </div>

            <Widget title="Real-Time Power Consumption" className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                        <defs>
                            <linearGradient id="colorBatt" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0066cc" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#0066cc" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="time" stroke="#9ca3af" fontSize={12} tickCount={5} />
                        <YAxis domain={[95, 100]} stroke="#9ca3af" fontSize={12} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Area type="monotone" dataKey="battery" stroke="#0066cc" strokeWidth={3} fillOpacity={1} fill="url(#colorBatt)" />
                    </AreaChart>
                </ResponsiveContainer>
            </Widget>
        </div>
    );
};
export default TelemetryPage;
