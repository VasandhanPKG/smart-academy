import { useState, useMemo, FormEvent, ReactNode } from 'react';
import { 
  Calendar, 
  Users, 
  BookOpen, 
  MapPin, 
  LayoutDashboard, 
  Play, 
  CheckCircle2, 
  AlertCircle,
  Download,
  Plus,
  Trash2,
  ChevronRight,
  LogOut,
  User,
  Lock,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { cn } from './lib/utils';
import { MOCK_DATA } from './constants';
import { TimetableData, OptimizationResult } from './types';
import { optimizeTimetable } from './solver';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'solver' | 'output'>('dashboard');
  const [data, setData] = useState<TimetableData>(MOCK_DATA);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username && password) {
      setIsLoggedIn(true);
    }
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const res = optimizeTimetable(data);
      setResult(res);
      setIsOptimizing(false);
      setActiveTab('output');
    }, 1500);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200"
        >
          <div className="bg-blue-700 p-8 text-white text-center">
            <h1 className="text-3xl font-bold tracking-tight">Future Web</h1>
            <p className="text-blue-100 text-sm mt-2 opacity-80 uppercase tracking-widest font-mono">Academic Portal</p>
          </div>
          <form onSubmit={handleLogin} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
            >
              Sign In
            </button>
            <div className="text-center">
              <a href="#" className="text-xs text-blue-600 hover:underline font-medium">Forgot password?</a>
            </div>
          </form>
          <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest">Powered by Future Web</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-blue-900 text-white flex flex-col z-30 shadow-2xl relative"
      >
        <div className="p-6 flex items-center gap-3 border-b border-blue-800/50">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
            <Calendar className="text-blue-900" size={24} />
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="font-bold text-lg leading-none">Future Web</h1>
              <p className="text-[10px] text-blue-300 uppercase tracking-widest mt-1">Portal</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1">
          <NavButton 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')}
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            isOpen={isSidebarOpen}
          />
          <NavButton 
            active={activeTab === 'solver'} 
            onClick={() => setActiveTab('solver')}
            icon={<Play size={20} />}
            label="Optimizer"
            isOpen={isSidebarOpen}
          />
          <NavButton 
            active={activeTab === 'output'} 
            onClick={() => setActiveTab('output')}
            icon={<Calendar size={20} />}
            label="Timetables"
            disabled={!result}
            isOpen={isSidebarOpen}
          />
        </nav>

        <div className="p-4 border-t border-blue-800/50">
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="w-full flex items-center gap-3 px-3 py-3 text-blue-300 hover:text-white hover:bg-blue-800/50 rounded-lg transition-all"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search portal..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm w-64 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">{username}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold border-2 border-white shadow-sm">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <header>
                  <h2 className="text-2xl font-bold text-slate-800">Academic Dashboard</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage your institution's core data and optimization parameters.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  <StatCard label="Faculty" value={data.faculty.length} icon={<Users className="text-blue-600" />} trend="+2 this month" />
                  <StatCard label="Avg Attendance" value={`${(data.groups.reduce((acc, g) => acc + (g.attendance || 0), 0) / data.groups.length).toFixed(1)}%`} icon={<CheckCircle2 className="text-indigo-600" />} trend="Real-time" />
                  <StatCard label="Groups" value={data.groups.length} icon={<Users className="text-emerald-600" />} trend="63 Students/Class" />
                  <StatCard label="Rooms" value={data.rooms.length} icon={<MapPin className="text-orange-600" />} trend="Max Cap: 80" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-slate-800">Attendance Trends</h3>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" /> Faculty
                        <div className="w-2 h-2 bg-indigo-400 rounded-full ml-2" /> Students
                      </div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { name: 'Mon', faculty: 98, students: 85 },
                          { name: 'Tue', faculty: 95, students: 88 },
                          { name: 'Wed', faculty: 97, students: 92 },
                          { name: 'Thu', faculty: 94, students: 89 },
                          { name: 'Fri', faculty: 96, students: 84 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} domain={[0, 100]} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#f8fafc' }}
                          />
                          <Bar dataKey="faculty" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} />
                          <Bar dataKey="students" fill="#818cf8" radius={[4, 4, 0, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <DataCard 
                      title="Faculty Attendance" 
                      items={data.faculty.map(f => ({ id: f.id, primary: f.name, secondary: `${f.department} • ${f.attendance}%` }))}
                    />
                    <DataCard 
                      title="Student Attendance" 
                      items={data.groups.map(g => ({ id: g.id, primary: g.name, secondary: `${g.name} • ${g.attendance}%` }))}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'solver' && (
              <motion.div 
                key="solver"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="max-w-4xl mx-auto py-12"
              >
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center space-y-8">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                    <Play size={40} />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-slate-800">Optimization Engine</h2>
                    <p className="text-slate-500 max-w-md mx-auto">
                      Run the heuristic solver to generate a conflict-free timetable based on current dashboard parameters.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left max-w-2xl mx-auto bg-slate-50 p-6 rounded-xl">
                    <ConstraintCheck label="Hard Constraints" checked />
                    <ConstraintCheck label="Faculty Availability" checked />
                    <ConstraintCheck label="Room Capacity" checked />
                    <ConstraintCheck label="Student Overlaps" checked />
                    <ConstraintCheck label="Load Balancing" checked />
                    <ConstraintCheck label="Idle Time Min" checked />
                  </div>

                  <button 
                    onClick={handleOptimize}
                    disabled={isOptimizing}
                    className={cn(
                      "w-full max-w-md py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all relative overflow-hidden",
                      isOptimizing && "cursor-wait opacity-80"
                    )}
                  >
                    {isOptimizing ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Optimizing Search Space...</span>
                      </div>
                    ) : "Start Optimization Process"}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'output' && result && (
              <motion.div 
                key="output"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">Generated Timetables</h2>
                    <p className="text-sm text-slate-500">Successfully scheduled {result.metrics.totalSessions} sessions across 5 working days.</p>
                  </div>
                  <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                    <Download size={16} /> Export Schedule
                  </button>
                </header>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Utilization</p>
                    <p className="text-2xl font-bold text-blue-600">{result.metrics.roomUtilization.toFixed(1)}%</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Conflicts</p>
                    <p className={cn("text-2xl font-bold", result.conflicts.length > 0 ? "text-red-500" : "text-emerald-500")}>
                      {result.conflicts.length}
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Slots</p>
                    <p className="text-2xl font-bold text-slate-700">45</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avg Load</p>
                    <p className="text-2xl font-bold text-slate-700">12.5h</p>
                  </div>
                </div>

                <div className="space-y-12">
                  {data.groups.map(group => (
                    <div key={group.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-600 text-white rounded flex items-center justify-center font-bold text-xs">
                            {group.name.charAt(0)}
                          </div>
                          <h3 className="font-bold text-slate-800">{group.name}</h3>
                        </div>
                        <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">Semester {group.semester}</span>
                      </div>
                      <div className="p-6 overflow-x-auto">
                        <TimetableGrid 
                          sessions={result.sessions.filter(s => s.groupId === group.id)} 
                          data={data}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function NavButton({ active, onClick, icon, label, isOpen, disabled = false }: { active: boolean, onClick: () => void, icon: ReactNode, label: string, isOpen: boolean, disabled?: boolean }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-4 px-4 py-3 text-sm transition-all rounded-xl",
        active 
          ? "bg-white/10 text-white font-bold" 
          : "text-blue-200 hover:text-white hover:bg-white/5",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      <div className="shrink-0">{icon}</div>
      {isOpen && <span className="truncate">{label}</span>}
      {active && isOpen && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
    </button>
  );
}

function DataCard({ title, items }: { title: string, items: { id: string, primary: string, secondary: string }[] }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-800">{title}</h3>
        <button className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors">
          <Plus size={18} />
        </button>
      </div>
      <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto custom-scrollbar">
        {items.map(item => (
          <div key={item.id} className="group flex justify-between items-center p-4 hover:bg-slate-50 transition-colors">
            <div>
              <p className="text-sm font-semibold text-slate-700">{item.primary}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-medium mt-0.5">{item.secondary}</p>
            </div>
            <button className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, trend }: { label: string, value: string | number, icon: ReactNode, trend: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-slate-50 rounded-lg">{icon}</div>
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

function ConstraintCheck({ label, checked }: { label: string, checked: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn(
        "w-5 h-5 rounded flex items-center justify-center transition-colors",
        checked ? "bg-emerald-500 text-white" : "bg-slate-200"
      )}>
        {checked && <CheckCircle2 size={12} />}
      </div>
      <span className="text-xs font-medium text-slate-600">{label}</span>
    </div>
  );
}

function TimetableGrid({ sessions, data }: { sessions: any[], data: any }) {
  const { days, slots } = data;

  return (
    <table className="w-full border-collapse min-w-[800px]">
      <thead>
        <tr>
          <th className="p-4 bg-slate-50 border border-slate-200 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest w-24">Time</th>
          {days.map((day: string) => (
            <th key={day} className="p-4 bg-slate-50 border border-slate-200 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {slots.map((slot: any) => (
          <tr key={slot.id}>
            <td className="p-4 border border-slate-200 bg-slate-50/50">
              <p className="text-[10px] font-bold text-slate-600">{slot.startTime}</p>
              <p className="text-[10px] text-slate-400">{slot.endTime}</p>
            </td>
            {days.map((day: string) => {
              const session = sessions.find(s => s.day === day && s.slotIds.includes(slot.id));
              const course = session ? data.courses.find((c: any) => c.id === session.courseId) : null;
              const faculty = session ? data.faculty.find((f: any) => f.id === session.facultyId) : null;
              const room = session ? data.rooms.find((r: any) => r.id === session.roomId) : null;
              
              const isFirstSlot = session && session.slotIds[0] === slot.id;
              const rowSpan = session ? session.slotIds.length : 1;

              if (session && !isFirstSlot) return null;

              return (
                <td 
                  key={`${day}-${slot.id}`} 
                  rowSpan={rowSpan}
                  className={cn(
                    "border border-slate-200 p-2 align-top transition-all",
                    session ? "bg-blue-50/50" : "hover:bg-slate-50/50"
                  )}
                >
                  {session ? (
                    <div className="p-2 bg-white border-l-4 border-blue-600 rounded shadow-sm space-y-1">
                      <p className="text-xs font-bold text-blue-900 leading-tight">{course?.name}</p>
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[9px] font-semibold text-slate-500 flex items-center gap-1">
                          <User size={8} /> {faculty?.name}
                        </p>
                        <p className="text-[9px] font-semibold text-slate-500 flex items-center gap-1">
                          <MapPin size={8} /> {room?.name}
                        </p>
                      </div>
                      {course?.type === 'Lab' && (
                        <span className="inline-block px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[8px] font-bold rounded uppercase">Lab</span>
                      )}
                    </div>
                  ) : (
                    <div className="h-12" />
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
