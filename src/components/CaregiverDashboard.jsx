import React, { useState } from 'react';
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Brain,
  Target,
  Calendar,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Info,
  RefreshCw,
  Bell
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { translations } from '../services/translations';
import {
  getPatientProfile,
  getWeeklyData,
  getGameHistory,
  getReminders,
  getAIState,
  saveAIState,
  resetAllDemoData
} from '../services/storage';
import { checkCaregiverAlertConditions } from '../services/adaptiveAI';

export default function CaregiverDashboard({ setCurrentView, language }) {
  const t = translations[language] || translations.en;
  const patient = getPatientProfile();
  const reminders = getReminders();
  const completedReminders = reminders.filter((r) => r.completed).length;

  const [weeklyData, setWeeklyData] = useState(getWeeklyData());
  const [history, setHistory] = useState(getGameHistory());
  const [aiState, setAiState] = useState(getAIState());
  const [alertInfo, setAlertInfo] = useState(checkCaregiverAlertConditions());

  // Toggle simulated performance drop for presentation demonstration
  const handleToggleSimulatedDrop = () => {
    const updatedState = { ...aiState, simulatedDrop: !aiState.simulatedDrop };
    saveAIState(updatedState);
    setAiState(updatedState);
    setTimeout(() => {
      setAlertInfo(checkCaregiverAlertConditions());
    }, 50);
  };

  const handleResetDemo = () => {
    resetAllDemoData();
    setWeeklyData(getWeeklyData());
    setHistory(getGameHistory());
    setAiState(getAIState());
    setAlertInfo(checkCaregiverAlertConditions());
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
      {/* Header & Demo Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold mb-2">
            <Info className="w-3.5 h-3.5" />
            <span>{t.common.demoDataBadge}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t.caregiver.title}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Care supervision, cognitive trends & wellness assistance
          </p>
        </div>

        {/* Demo Presentation Helper Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleToggleSimulatedDrop}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm border transition shadow-sm flex items-center gap-2 ${
              aiState.simulatedDrop
                ? 'bg-amber-100 text-amber-900 border-amber-400'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="Demonstrate how MindCare detects performance drops during presentations"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{aiState.simulatedDrop ? t.caregiver.restoreBaseline : t.caregiver.simulateDrop}</span>
          </button>

          <button
            onClick={handleResetDemo}
            className="p-2.5 rounded-2xl bg-white border border-slate-300 text-slate-600 hover:bg-slate-50 transition shadow-sm"
            title="Reset to Demo Defaults"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Smart Caregiver Alert Notification */}
      {alertInfo.triggered ? (
        <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 shadow-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-7 h-7 text-amber-700" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-extrabold text-lg text-amber-900">
                  {t.caregiver.smartAlertTitle}
                </span>
                {alertInfo.isSimulated && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold">
                    Demo Simulated
                  </span>
                )}
              </div>
              <p className="text-base sm:text-lg font-bold text-amber-900 mb-1">
                {t.caregiver.alertMessage}
              </p>
              <p className="text-xs sm:text-sm text-amber-800 font-medium">
                {alertInfo.recommendation}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">{t.caregiver.healthyNotice}</span>
        </div>
      )}

      {/* Patient Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Name & Age */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">👴</span>
            <div>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                {t.caregiver.patientName}
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">
                {patient.name}
              </h2>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Age: <strong>{patient.age}</strong> • Primary: {patient.primaryCaregiver}
          </p>
        </div>

        {/* Cognitive Engagement Level */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
            {t.caregiver.cognitiveLevel}
          </span>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-extrabold text-teal-700">
              {alertInfo.triggered ? 'Attention Advised' : t.caregiver.levelGood}
            </span>
          </div>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
            alertInfo.triggered ? 'bg-amber-100 text-amber-900' : 'bg-teal-100 text-teal-800'
          }`}>
            Adaptive Pace: {aiState.memoryDifficulty}
          </span>
        </div>

        {/* Today's Activity */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
            {t.caregiver.todayActivity}
          </span>
          <div className="text-3xl font-extrabold text-slate-900 mb-1">
            {completedReminders + 1} / {reminders.length + 1}
          </div>
          <p className="text-xs font-semibold text-emerald-700">
            Daily engagement target on track
          </p>
        </div>

        {/* System Adaptive Status */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Adaptive AI Engine
          </span>
          <div className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-teal-600" />
            <span>Active Scaling</span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2">
            Auto-tunes game difficulty to prevent cognitive fatigue
          </p>
        </div>
      </div>

      {/* Analytics Charts Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Trend Line Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <span>{t.caregiver.weeklyPerformance}</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Cognitive score trajectory over the last 7 days
              </p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-xl">
              Avg: 73%
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis domain={[40, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Overall Score %"
                  stroke="#0d9488"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#0d9488' }}
                  activeDot={{ r: 7 }}
                />
                <Line
                  type="monotone"
                  dataKey="memoryScore"
                  name="Memory %"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Memory vs Attention Comparative Bar Chart */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                <span>Cognitive Domains Comparison</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Comparing Memory Recall vs Focused Attention
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl">
              Domains
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                    border: '1px solid #e2e8f0'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                <Bar dataKey="memoryScore" name="Memory" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="attentionScore" name="Attention" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity Sessions & Quick Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Session Logs */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <span>{t.caregiver.recentSessions}</span>
          </h2>

          <div className="space-y-3">
            {history.slice(0, 4).map((sess) => (
              <div
                key={sess.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-bold text-sm text-slate-800 flex items-center gap-2">
                    <span>{sess.game}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                      {sess.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {sess.details} • Resp: {sess.responseTime}s
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-lg font-extrabold ${
                    sess.score >= 80 ? 'text-emerald-600' : sess.score >= 50 ? 'text-teal-600' : 'text-amber-600'
                  }`}>
                    {sess.score}%
                  </span>
                  <div className="text-xs text-slate-400">
                    {new Date(sess.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Care Reminders Overview */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-600" />
              <span>{t.caregiver.upcomingReminders}</span>
            </h2>
            <button
              onClick={() => setCurrentView('reminders')}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{rem.icon}</span>
                  <div>
                    <span className={`font-semibold ${rem.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                      {rem.title}
                    </span>
                    <span className="text-xs text-slate-400 block">{rem.time}</span>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  rem.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                }`}>
                  {rem.completed ? 'Done' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-500">
        <p className="font-semibold text-slate-700 mb-0.5">
          SIH 2026 Problem Statement 26003 Regulatory & Assistive Boundary Notice
        </p>
        <p>
          {t.common.disclaimer} MindCare offers supportive cognitive exercises, schedule reminders, and progress visualization for caregivers and families.
        </p>
      </div>
    </div>
  );
}
