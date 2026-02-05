import { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import Widget from '../components/Widget';
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Battery, Navigation, Play, Square, Wifi, WifiOff, RefreshCcw } from 'lucide-react';
import clsx from 'clsx';
import Rover3DView from '../components/Rover3DView';

const DashboardHome = () => {
    const { socket, isConnected } = useSocket();
    const [telemetry, setTelemetry] = useState<any[]>([]);
    const [currentStatus, setCurrentStatus] = useState({
        battery: 100,
        mode: 'STANDBY',
        speed: 0,
        status: 'OFFLINE'
    });

    useEffect(() => {
        if (!socket) return;

        socket.on('rover:telemetry', (data) => {
            setCurrentStatus(prev => ({ ...prev, ...data }));
            setTelemetry(prev => {
                const newData = [...prev, { time: new Date().toLocaleTimeString(), ...data }];
                if (newData.length > 50) newData.shift(); // Keep last 50 points
                return newData;
            });
        });

        return () => {
            socket.off('rover:telemetry');
        };
    }, [socket]);

    const handleCommand = (command: string) => {
        if (!socket) return;
        socket.emit('rover:command', { type: command });

        // Optimistic update / Local log
        setTelemetry(prev => {
            const newLog = {
                time: new Date().toLocaleTimeString(),
                message: `Command sent: ${command}`,
                type: 'COMMAND'
            };
            // Add new log and keep only last 50
            const newData = [...prev, newLog];
            if (newData.length > 50) newData.shift();
            return newData;
        });

        // Also update local status temporarily for immediate feedback
        if (command === 'ESTOP') {
            setCurrentStatus(prev => ({ ...prev, mode: 'EMERGENCY', speed: 0 }));
        } else if (command === 'AUTONAV') {
            setCurrentStatus(prev => ({ ...prev, mode: 'AUTONOMOUS' }));
        } else if (command === 'CALIBRATE') {
            setCurrentStatus(prev => ({ ...prev, mode: 'CALIBRATING' }));
            setTimeout(() => {
                setCurrentStatus(prev => ({ ...prev, mode: 'STANDBY' }));
            }, 2000);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
            {/* Status Cards */}
            <Widget className="md:col-span-1 border-l-4 border-l-neo-primary bg-gradient-to-br from-neo-panel to-black/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-neo-muted text-xs font-bold uppercase tracking-widest mb-1">System Status</p>
                        <h3 className={clsx("text-2xl font-black font-orbitron tracking-wide", isConnected ? "text-neo-secondary drop-shadow-[0_0_8px_rgba(0,255,153,0.5)]" : "text-neo-alert")}>
                            {isConnected ? 'ONLINE' : 'OFFLINE'}
                        </h3>
                    </div>
                    <div className={clsx("p-3 rounded-full bg-black/40 border border-white/5", isConnected && "animate-pulse")}>
                        {isConnected ? <Wifi className="text-neo-secondary w-6 h-6" /> : <WifiOff className="text-neo-alert w-6 h-6" />}
                    </div>
                </div>
            </Widget>

            <Widget className="md:col-span-1 border-l-4 border-l-yellow-400 bg-gradient-to-br from-neo-panel to-black/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-neo-muted text-xs font-bold uppercase tracking-widest mb-1">Battery Level</p>
                        <div className="flex items-baseline gap-2">
                            <h3 className="text-2xl font-black font-orbitron text-yellow-400">
                                {currentStatus.battery.toFixed(1)}%
                            </h3>
                            <span className="text-xs text-neo-muted animate-pulse">CHARGING</span>
                        </div>
                    </div>
                    <div className="p-3 rounded-full bg-black/40 border border-white/5">
                        <Battery className="text-yellow-400 w-6 h-6" />
                    </div>
                </div>
                <div className="w-full bg-black/40 h-1.5 mt-4 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-yellow-400 transition-all duration-1000 shadow-[0_0_10px_rgba(250,204,21,0.5)]" style={{ width: `${currentStatus.battery}%` }} />
                </div>
            </Widget>

            <Widget className="md:col-span-1 border-l-4 border-l-neo-secondary bg-gradient-to-br from-neo-panel to-black/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-neo-muted text-xs font-bold uppercase tracking-widest mb-1">Op Mode</p>
                        <h3 className="text-2xl font-black font-orbitron text-neo-secondary tracking-widest">
                            {currentStatus.mode}
                        </h3>
                    </div>
                    <div className="p-3 rounded-full bg-black/40 border border-white/5">
                        <Navigation className="text-neo-secondary w-6 h-6 animate-spin-slow" />
                    </div>
                </div>
            </Widget>

            <Widget className="md:col-span-1 border-l-4 border-l-white bg-gradient-to-br from-neo-panel to-black/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-neo-muted text-xs font-bold uppercase tracking-widest mb-1">Velocity</p>
                        <h3 className="text-2xl font-black font-orbitron text-white">
                            {currentStatus.speed.toFixed(2)} <span className="text-sm font-light text-neo-muted">m/s</span>
                        </h3>
                    </div>
                    <div className="p-3 rounded-full bg-black/40 border border-white/5">
                        <Activity className="text-white w-6 h-6" />
                    </div>
                </div>
            </Widget>

            {/* Main Map / Cam View */}
            <Widget title="Live Video Uplink" className="md:col-span-2 lg:col-span-3 h-[500px] border border-neo-primary/30 shadow-[0_0_30px_rgba(0,204,255,0.1)]">
                <div className="w-full h-full rounded-lg bg-black relative overflow-hidden group border border-neo-primary/20">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,153,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,153,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />

                    {/* Scanlines */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(0,0,0,0.8)_50%)] bg-[size:100%_4px] pointer-events-none opacity-50" />

                    {/* Animated Radar Sweep */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-neo-primary/20 animate-ping opacity-20" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full border border-neo-secondary/20 animate-pulse" />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
                        <RefreshCcw className="w-10 h-10 text-neo-primary animate-spin" />
                        <p className="z-10 bg-black/80 px-4 py-2 rounded text-neo-primary text-sm font-mono tracking-widest border border-neo-primary/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,204,255,0.3)]">
                            ESTABLISHING SECURE UPLINK...
                        </p>
                    </div>

                    {/* HUD Elements */}
                    <div className="absolute top-4 left-4 font-mono text-xs text-neo-secondary">
                        CAM_01 [ACTIVE]<br />
                        LAT: 34.0522 N<br />
                        LNG: 118.2437 W
                    </div>
                    <div className="absolute bottom-4 right-4 font-mono text-xs text-neo-alert">
                        SIGNAL: -82 dBm<br />
                        LATENCY: 24ms
                    </div>
                </div>
            </Widget>

            {/* Controls */}
            <Widget title="Mission Control" className="md:col-span-1 lg:col-span-1 h-[500px]">
                <div className="flex flex-col gap-4 h-full">
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => handleCommand('AUTONAV')}
                            className="neo-btn bg-neo-secondary/10 hover:bg-neo-secondary/20 text-neo-secondary border border-neo-secondary/50 flex items-center justify-center gap-3 py-4 text-sm uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_10px_rgba(0,255,153,0.1)] hover:shadow-[0_0_20px_rgba(0,255,153,0.3)]">
                            <Play className="w-5 h-5 fill-current" /> Auto Nav
                        </button>
                        <button
                            onClick={() => handleCommand('CALIBRATE')}
                            className="neo-btn bg-neo-primary/10 hover:bg-neo-primary/20 text-neo-primary border border-neo-primary/50 flex items-center justify-center gap-3 py-4 text-sm uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_10px_rgba(0,204,255,0.1)] hover:shadow-[0_0_20px_rgba(0,204,255,0.3)]">
                            <RefreshCcw className="w-5 h-5" /> Calibrate
                        </button>
                        <button
                            onClick={() => handleCommand('ESTOP')}
                            className="neo-btn bg-neo-alert/10 hover:bg-neo-alert/20 text-neo-alert border border-neo-alert/50 flex items-center justify-center gap-3 py-6 text-lg font-bold uppercase tracking-wider animate-pulse transition-all hover:scale-[1.05] active:scale-95 mt-4 shadow-[0_0_20px_rgba(255,0,51,0.2)] hover:shadow-[0_0_30px_rgba(255,0,51,0.4)]">
                            <Square className="w-6 h-6 fill-current" /> EMERGENCY STOP
                        </button>
                    </div>

                    <div className="mt-auto flex-1 p-3 rounded bg-black/80 border border-white/5 font-mono text-[10px] text-gray-400 overflow-hidden flex flex-col font-light shadow-inner">
                        <div className="text-neo-secondary border-b border-white/10 pb-1 mb-2 font-bold">SYSTEM LOGS</div>
                        <div className="space-y-1 overflow-y-auto pr-1 scrollbar-thin">
                            <div className="text-white">&gt; System initialized...</div>
                            <div className="text-gray-300">&gt; Telemetry link established</div>
                            <div className="text-gray-300">&gt; Waiting for user command...</div>
                            {telemetry.slice(-8).reverse().map((t, i) => (
                                <div key={i} className="text-gray-500">
                                    &gt; {t.message || `Bat: ${t.battery?.toFixed(0)}% | Spd: ${t.speed?.toFixed(1)}`}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Widget>

            {/* 3D View */}
            <div className="md:col-span-1 lg:col-span-1">
                <Rover3DView />
            </div>

            {/* Charts */}
            <Widget title="Energy Consumption" className="md:col-span-2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetry}>
                        <defs>
                            <linearGradient id="colorBatt" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#eab308" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" hide />
                        <YAxis domain={[90, 100]} hide />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(5, 11, 20, 0.9)', border: '1px solid rgba(0, 204, 255, 0.2)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)', color: '#fff' }}
                            itemStyle={{ color: '#eab308' }}
                        />
                        <Area type="monotone" dataKey="battery" stroke="#eab308" fillOpacity={1} fill="url(#colorBatt)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </Widget>

            <Widget title="Velocity Telemetry" className="md:col-span-2 h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={telemetry}>
                        <defs>
                            <linearGradient id="colorSpd" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00ccff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00ccff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(5, 11, 20, 0.9)', border: '1px solid rgba(0, 204, 255, 0.2)', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)', color: '#fff' }}
                            itemStyle={{ color: '#00ccff' }}
                        />
                        <Area type="monotone" dataKey="speed" stroke="#00ccff" fillOpacity={1} fill="url(#colorSpd)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>

            </Widget>
        </div>
    );
};
export default DashboardHome;
