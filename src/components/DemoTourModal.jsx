import React from 'react';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  X,
  PlayCircle,
  Brain,
  Mic,
  Bell,
  Users,
  WifiOff
} from 'lucide-react';

export default function DemoTourModal({ isOpen, onClose, setCurrentView, setIsOffline }) {
  if (!isOpen) return null;

  const demoSteps = [
    {
      step: '1',
      title: 'Open MindCare Landing',
      desc: 'Show high-contrast branding, regional language selection (English, Hindi, Telugu, Assamese), and role portal.',
      targetView: 'landing',
      icon: '🧠'
    },
    {
      step: '2',
      title: 'Select Elderly User',
      desc: 'Demonstrate the elderly-friendly greeting, date, and 4 large high-contrast activity tiles.',
      targetView: 'elderly_dashboard',
      icon: '👴'
    },
    {
      step: '3',
      title: 'Play Memory Game',
      desc: 'Memorize everyday picture cards (Easy/Medium/Hard) and answer multiple-choice questions.',
      targetView: 'memory',
      icon: '🍎'
    },
    {
      step: '4',
      title: 'Demonstrate Adaptive AI',
      desc: 'Explain how the AI adjusts difficulty: >80% increases level, 50-79% maintains, <50% eases difficulty.',
      targetView: 'memory',
      icon: '🤖'
    },
    {
      step: '5',
      title: 'Try Voice Interaction',
      desc: 'Tap "Talk to MindCare" to say "Start attention training", "Show reminders", or "What should I do now?".',
      targetView: 'elderly_dashboard',
      icon: '🎤'
    },
    {
      step: '6',
      title: 'Check Today\'s Reminders',
      desc: 'Show Medicine, Water, Walk, and Doctor appointments. Use "Read Aloud" or mark an item done.',
      targetView: 'reminders',
      icon: '⏰'
    },
    {
      step: '7',
      title: 'Caregiver Dashboard & Analytics',
      desc: 'View Ramesh Kumar (Age 68), Recharts weekly trend (60% to 85%), and domain breakdown.',
      targetView: 'caregiver_dashboard',
      icon: '📊'
    },
    {
      step: '8',
      title: 'Smart Caregiver Alert & Offline Mode',
      desc: 'Click "Simulate Performance Drop" to trigger the caregiver alert, then toggle Offline Mode to show 100% local persistence.',
      targetView: 'caregiver_dashboard',
      icon: '⚠️'
    }
  ];

  const handleGoToStep = (view) => {
    setCurrentView(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          aria-label="Close demo guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-6 h-6 text-amber-500" />
          <h2 className="text-2xl font-extrabold text-slate-900">
            3-Minute SIH Demo Presentation Guide
          </h2>
        </div>
        <p className="text-sm text-slate-500 mb-6">
          Problem Statement 26003: Step-by-step recommended presentation sequence for jury evaluation. Click any step to jump straight to it.
        </p>

        {/* Steps List */}
        <div className="space-y-3">
          {demoSteps.map((item) => (
            <div
              key={item.step}
              onClick={() => handleGoToStep(item.targetView)}
              className="p-4 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 transition cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-3.5">
                <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-teal-600 group-hover:text-white transition">
                  {item.step}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-900 transition">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition shrink-0" />
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">
            Tip: Use the header toggle to simulate offline mode at any moment.
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow transition"
          >
            Got it, Let's Demo
          </button>
        </div>
      </div>
    </div>
  );
}
