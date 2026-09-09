import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Circle,
  Plus,
  Volume2,
  Clock,
  Home,
  Check,
  Droplets,
  Pill,
  Calendar,
  Footprints,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { translations } from '../services/translations';
import { speakText } from '../services/speech';

export default function RemindersView({ setCurrentView, language }) {
  const t = translations[language] || translations.en;
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'medicines' | 'hydration' | 'activities' | 'appointments'

  // 1. Medicine Reminders (Taken, Skip, Remind Later)
  const [medicines, setMedicines] = useState([
    { id: 'm1', medicineName: 'Donepezil (Cognitive Support)', dosageText: '5 mg • 1 Tablet with water', time: '8:30 AM', status: 'taken', repeat: 'Daily Morning' },
    { id: 'm2', medicineName: 'Blood Pressure / Amlodipine', dosageText: '5 mg • 1 Tablet after food', time: '1:00 PM', status: 'pending', repeat: 'Daily Afternoon' },
    { id: 'm3', medicineName: 'Multivitamin / Calcium', dosageText: '1 Tablet with dinner', time: '8:00 PM', status: 'pending', repeat: 'Daily Evening' }
  ]);

  // 2. Hydration Reminders (Daily target tracker)
  const [hydrationTarget] = useState(8);
  const [hydrationCompleted, setHydrationCompleted] = useState(5);

  // 3. Daily Activities
  const [activities, setActivities] = useState([
    { id: 'a1', title: 'Gentle Morning Garden Walk', time: '7:00 AM', completed: true, emoji: '🚶‍♂️' },
    { id: 'a2', title: 'Nutritious Warm Breakfast', time: '8:00 AM', completed: true, emoji: '🥣' },
    { id: 'a3', title: 'Play MindCare Memory Recall Game', time: '10:30 AM', completed: true, emoji: '🧠' },
    { id: 'a4', title: 'Afternoon Quiet Rest / Nap', time: '2:30 PM', completed: false, emoji: '🛋️' }
  ]);

  // 4. Medical Appointments
  const [appointments, setAppointments] = useState([
    { id: 'ap1', doctorName: 'Dr. Debajit Barman (Geriatrician)', date: 'Tomorrow, Oct 12', time: '11:00 AM', location: 'Guwahati Neurological Wellness Clinic', notes: 'Quarterly routine cognitive health check-up' },
    { id: 'ap2', doctorName: 'Dr. Anita Roy (General Physician)', date: 'Friday, Oct 20', time: '4:30 PM', location: 'Civil Hospital OPD Room 4', notes: 'Routine blood pressure review' }
  ]);

  const handleMedicineAction = (id, action) => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return { ...m, status: action };
        }
        return m;
      })
    );
    const med = medicines.find((m) => m.id === id);
    if (action === 'taken') speakText(`Marked ${med.medicineName} as taken. Wonderful!`);
    if (action === 'skip') speakText(`Marked ${med.medicineName} as skipped.`);
    if (action === 'later') speakText(`We will remind you of ${med.medicineName} in 30 minutes.`);
  };

  const handleDrinkWater = () => {
    if (hydrationCompleted < hydrationTarget) {
      setHydrationCompleted((prev) => prev + 1);
      speakText('Great hydration! That is another glass of fresh water.');
    }
  };

  const handleToggleActivity = (id) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  const handleReadAll = () => {
    const pendingMeds = medicines.filter((m) => m.status === 'pending');
    const remainingWater = Math.max(0, hydrationTarget - hydrationCompleted);
    speakText(
      `Reminders summary: You have ${pendingMeds.length} pending medicines to take today. You have drank ${hydrationCompleted} out of ${hydrationTarget} glasses of water. Take care and stay comfortable!`
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('elderly_dashboard')}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition"
            title="Return to Dashboard"
          >
            <Home className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Daily Reminders & Care
            </h1>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              Medicines, hydration, activities and medical visits
            </p>
          </div>
        </div>

        <button
          onClick={handleReadAll}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950 hover:bg-amber-200 text-amber-900 dark:text-amber-200 font-bold text-sm sm:text-base transition border border-amber-300 dark:border-amber-700"
        >
          <Volume2 className="w-5 h-5 text-amber-600" />
          <span className="hidden sm:inline">Read All Aloud</span>
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {[
          { id: 'all', label: 'All Reminders', icon: Bell },
          { id: 'medicines', label: 'Medicines', icon: Pill },
          { id: 'hydration', label: 'Hydration (Water)', icon: Droplets },
          { id: 'activities', label: 'Daily Activities', icon: Footprints },
          { id: 'appointments', label: 'Appointments', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Hydration Widget (Featured in All or Hydration tab) */}
      {(activeTab === 'all' || activeTab === 'hydration') && (
        <div className="p-6 rounded-3xl bg-cyan-50 dark:bg-slate-800 border-2 border-cyan-200 dark:border-slate-700 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-600 text-white flex items-center justify-center shadow-md">
                <Droplets className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Hydration Reminders
                </h3>
                <p className="text-sm text-cyan-800 dark:text-cyan-300 font-semibold">
                  “Time to drink some fresh water.”
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-cyan-900 dark:text-cyan-200">
                {hydrationCompleted} of {hydrationTarget} Glasses
              </span>
              <p className="text-xs text-slate-500">
                {Math.max(0, hydrationTarget - hydrationCompleted)} glasses remaining today
              </p>
            </div>
          </div>

          {/* Water Glasses Bar */}
          <div className="flex items-center gap-2 mb-4">
            {Array.from({ length: hydrationTarget }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-6 rounded-lg transition-all ${
                  i < hydrationCompleted
                    ? 'bg-cyan-500 shadow-sm'
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleDrinkWater}
            className="w-full py-4 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <Droplets className="w-5 h-5 fill-current" />
            <span>+ Just Drank a Glass of Water</span>
          </button>
        </div>
      )}

      {/* Medicines Section (Taken / Skip / Remind Later) */}
      {(activeTab === 'all' || activeTab === 'medicines') && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Pill className="w-5 h-5 text-rose-600" />
            <span>Medicine Reminders</span>
          </h2>

          <div className="space-y-4">
            {medicines.map((med) => (
              <div
                key={med.id}
                className={`p-5 rounded-3xl border-2 transition-all bg-white dark:bg-slate-800 shadow-sm ${
                  med.status === 'taken'
                    ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : med.status === 'skip'
                    ? 'border-slate-300 opacity-60'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💊</span>
                      <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {med.medicineName}
                      </h3>
                    </div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 ml-8">
                      {med.dosageText} • <span className="text-blue-600">{med.repeat}</span>
                    </p>
                  </div>

                  <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-black flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{med.time}</span>
                  </span>
                </div>

                {/* 3 Explicit Elderly Actions: Taken | Skip | Remind Later */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex-wrap">
                  <button
                    onClick={() => handleMedicineAction(med.id, 'taken')}
                    className={`flex-1 min-w-[120px] py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                      med.status === 'taken'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{med.status === 'taken' ? '✓ Taken' : 'Mark as Taken'}</span>
                  </button>

                  <button
                    onClick={() => handleMedicineAction(med.id, 'later')}
                    className="px-4 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-sm transition-all"
                  >
                    Remind Later (30m)
                  </button>

                  <button
                    onClick={() => handleMedicineAction(med.id, 'skip')}
                    className="px-4 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-sm transition-all"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Daily Activities Section */}
      {(activeTab === 'all' || activeTab === 'activities') && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Footprints className="w-5 h-5 text-indigo-600" />
            <span>Daily Routine Activities</span>
          </h2>

          <div className="space-y-3">
            {activities.map((act) => (
              <div
                key={act.id}
                onClick={() => handleToggleActivity(act.id)}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  act.completed
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 text-slate-500'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl select-none">{act.emoji}</span>
                  <div>
                    <h4 className={`text-lg font-bold ${act.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                      {act.title}
                    </h4>
                    <span className="text-xs text-slate-500">{act.time}</span>
                  </div>
                </div>

                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                  act.completed ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                }`}>
                  {act.completed && <Check className="w-5 h-5 stroke-[3]" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Medical Appointments Section */}
      {(activeTab === 'all' || activeTab === 'appointments') && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span>Upcoming Medical Appointments</span>
          </h2>

          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-slate-700 shadow-sm"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    {apt.doctorName}
                  </h3>
                  <span className="px-3 py-1 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 text-xs font-black">
                    {apt.date} • {apt.time}
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  📍 {apt.location}
                </p>
                <p className="text-xs text-slate-500 italic">
                  Note: {apt.notes}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-xs text-slate-500 text-center">
        “MindCare reminder system provides assistive cues for daily activities and medications. It does not provide clinical or medical prescriptions.”
      </div>
    </div>
  );
}
