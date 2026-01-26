import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck, Zap, LayoutDashboard } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: any) => void;
  onNavigateToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      const mockUser = {
        name: 'Admin User',
        email: email || 'admin@nexus.ai',
        role: 'Admin',
        organization: 'Construction Corp',
        avatarColor: 'from-blue-600 to-indigo-600'
      };
      onLogin(mockUser);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-slate-100">
        {/* Left Side: Branding/Intro */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <LayoutDashboard className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight">uSpecHub</span>
            </div>

            <h1 className="text-4xl font-black mb-6 leading-tight">
              开启垂直行业<br />
              <span className="text-blue-400 text-5xl">AI 进化之路</span>
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">
              uSpecHub 为建筑、医疗及金融智造专属智能。让每一个行业决策都具备专家级视角，驱动生产力质变。
            </p>
          </div>

          <div className="relative z-10 space-y-8">
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg">行业深度增强</h4>
                <p className="text-sm text-slate-400">深度集成垂直领域专业规范与知识图谱，确保 AI 输出精准合规</p>
              </div>
            </div>
            <div className="flex items-start gap-4 group">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="font-bold text-lg">全链路可插拔</h4>
                <p className="text-sm text-slate-400">秒级对接极速 API，灵活编排 RAG 知识库与 Agent 工作流</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-500 border-t border-white/10 pt-6">
            &copy; 2026 uSpecHub Team. All rights reserved.
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="p-8 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-black text-slate-900 mb-2">身份验证</h2>
              <p className="text-slate-500 font-medium">登录您的 uSpecHub 账号以连接行业大模型能力</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">电子邮箱</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">登陆密码</label>
                  <a href="#" className="text-xs text-blue-600 hover:underline font-medium">忘记密码?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 py-2">
                <input type="checkbox" id="remember" className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" />
                <label htmlFor="remember" className="text-sm text-slate-600">记住登录状态</label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    登录控制台 <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm text-slate-500">
                还没有账户?{' '}
                <button
                  onClick={onNavigateToRegister}
                  className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  立即注册
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
