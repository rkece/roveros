import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Radio, Globe, ChevronRight } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full bg-neo-bg z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-neo-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-neo-secondary/10 rounded-full blur-[120px]" />
            </div>

            <div className="z-10 container mx-auto px-4 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="mb-6"
                >
                    <span className="px-4 py-1 rounded-full border border-neo-primary/30 bg-neo-primary/5 text-neo-primary text-xs tracking-[0.2em] font-orbitron">
                        SYSTEM ONLINE v2.4
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-black font-orbitron bg-clip-text text-transparent bg-gradient-to-r from-neo-primary via-white to-neo-secondary mb-8 drop-shadow-sm leading-tight"
                >
                    AUTONOMOUS<br />SURVEILLANCE
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-lg md:text-xl text-neo-muted max-w-2xl mb-12 font-light tracking-wide"
                >
                    Solar Powered. AI Driven. The future of remote monitoring is here.
                    Control the rover from anywhere in the world.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col md:flex-row gap-6"
                >
                    <button
                        onClick={() => navigate('/auth')}
                        className="neo-btn neo-btn-primary group flex items-center gap-2"
                    >
                        ENTER CONTROL CENTER
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>

                {/* Feature Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl"
                >
                    {[
                        { icon: <Zap className="w-8 h-8 text-yellow-400" />, title: "Solar Powered", desc: "Infinite runtime with advanced MPPT solar charging." },
                        { icon: <Radio className="w-8 h-8 text-neo-primary" />, title: "Long Range Telemetry", desc: "Low-latency control via WebSocket & 4G/LTE." },
                        { icon: <Globe className="w-8 h-8 text-neo-secondary" />, title: "AI Navigation", desc: "LIDAR-based obstacle avoidance & pathfinding." }
                    ].map((feature, i) => (
                        <div key={i} className="neo-panel p-6 flex flex-col items-center hover:bg-neo-panel/80 transition-colors cursor-default">
                            <div className="mb-4 p-3 rounded-full bg-neo-bg/50 border border-white/10">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 font-orbitron">{feature.title}</h3>
                            <p className="text-sm text-neo-muted">{feature.desc}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default LandingPage;
