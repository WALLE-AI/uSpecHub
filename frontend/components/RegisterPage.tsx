import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckCircle2, LayoutDashboard, Building2 } from 'lucide-react';

interface RegisterPageProps {
    onSuccess: () => void;
    onNavigateToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onSuccess, onNavigateToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            setIsLoading(false);
            onSuccess();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-blue-300 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-emerald-300 rounded-full blur-[100px]"></div>
            </div>

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-slate-100">
                {/* Left Side: Info */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-transparent"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                <LayoutDashboard className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold tracking-tight">uSpecHub</span>
                        </div>

                        <h1 className="text-4xl font-black mb-6 leading-tight">
                            加入行业智能<br />
                            <span className="text-emerald-400 text-5xl">集约化阵地</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">
                            uSpecHub 集成顶尖垂直行业模型，专为高标准行业级应用而生。在这里，我们将复杂的 AI 技术转化为即插即用的生产力。
                        </p>
                    </div>

                    <div className="relative z-10 space-y-8">
                        <div className="flex items-start gap-4 group">
                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">弹性私有化接入</h4>
                                <p className="text-sm text-slate-400">适配多种部署环境，保障数据主权与物理隔离安全</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 group">
                            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">敏捷业务编排</h4>
                                <p className="text-sm text-slate-400">基于行业逻辑的零代码工作流，大幅缩短 AI 落地周期</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-xs text-slate-500 border-t border-white/10 pt-6">
                        点击注册即代表您同意我们的 <a href="#" className="underline">服务协议</a> 和 <a href="#" className="underline">数据处理政策</a>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-8 text-center lg:text-left">
                            <h2 className="text-3xl font-black text-slate-900 mb-2">加入 uSpecHub</h2>
                            <p className="text-slate-500 font-medium">只需几步，开启您的行业大模型控制台</p>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">全名</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="请输入姓名"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">所属企业/机构</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={company}
                                        onChange={e => setCompany(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="例如：XX 建筑设计院"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">电子邮箱</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">初始密码</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xl shadow-emerald-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        立即开启智算账户 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-500">
                                已有账户?{' '}
                                <button
                                    onClick={onNavigateToLogin}
                                    className="font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                                >
                                    返回登录
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
