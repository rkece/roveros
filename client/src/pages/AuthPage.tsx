import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Mail, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;
        const username = formData.get('username') as string;

        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await register(username, email, password);
            }
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neo-primary/10 via-black to-black relative overflow-y-auto overflow-x-hidden py-12 px-4">
            {/* Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-neo-primary/5 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:30px_30px]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="z-10 w-full max-w-md p-1"
            >
                <div className="neo-panel p-8 backdrop-blur-xl bg-black/60 border border-neo-primary/20 shadow-[0_0_40px_rgba(255,215,0,0.1)]">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-orbitron font-bold text-white mb-2">
                            {isLogin ? 'ACCESS TERMINAL' : 'NEW OPERATOR'}
                        </h2>
                        <p className="text-neo-muted text-sm">
                            {isLogin ? 'Enter credentials to access command center' : 'Register for surveillance clearance'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded bg-neo-alert/10 border border-neo-alert/30 text-neo-alert text-sm text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!isLogin && (
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest text-neo-muted">Operator Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neo-muted" />
                                    <input type="text" name="username" className="neo-input w-full pl-10" placeholder="John Doe" required />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-neo-muted">Secure ID (Email)</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neo-muted" />
                                <input type="email" name="email" className="neo-input w-full pl-10" placeholder="operator@rover.sys" required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest text-neo-muted">Passcode</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neo-muted" />
                                <input type="password" name="password" className="neo-input w-full pl-10" placeholder="••••••••" required />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="neo-btn neo-btn-primary w-full flex items-center justify-center gap-2 group mt-8 relative overflow-hidden"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-neo-bg border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'INITIATE SESSION' : 'REGISTER ID'}
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => { setIsLogin(!isLogin); setError(''); }}
                            className="text-sm text-neo-primary hover:text-neo-secondary transition-colors"
                        >
                            {isLogin ? 'Request Operator Access' : 'Return to Login'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
