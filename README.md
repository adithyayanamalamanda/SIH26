# MindCare — AI Cognitive Companion for Elderly Dementia Patients
### Smart India Hackathon (SIH) 2026 • Problem Statement 26003

> **MindCare** is an AI-powered, assistive cognitive gaming and memory companion designed specifically for elderly individuals experiencing early cognitive decline or dementia. It pairs an elderly-accessible interface with an adaptive cognitive difficulty engine, voice commands, daily wellness reminders, and a caregiver monitoring dashboard.

---

## 🌟 Key Features

### 1. 👴 Elderly-Centric Design & Accessibility
- **High-Contrast & Large Typography**: Designed specifically for aging eyes with big touch targets (min 60-70px), clear iconography, and zero cluttered menus.
- **Calm Healthcare Aesthetics**: Uses soothing teals, warm ambers, and clean cards rather than frantic game graphics.
- **Regional Languages**: Built-in translation engine supporting **English, Hindi (हिंदी), Telugu (తెలుగు), and Assamese (অসমীয়া)** with instant switching.
- **Accessibility Controls**: One-click toggles for high-contrast dark mode and extra-large typography.

### 2. 🧠 Adaptive AI Cognitive Difficulty
- **Explainable Rule-Based AI**:
  - Score $\ge 80\%$: Progresses difficulty level (Easy $\rightarrow$ Medium $\rightarrow$ Hard), increasing object count and challenge.
  - Score $50\% - 79\%$: Maintains current level for comfortable reinforcement.
  - Score $< 50\%$: Lowers difficulty to prevent cognitive fatigue and frustration.
- **Transparent AI Rationale**: Displays clear, reassuring explanations of why the AI adjusted the activity level.

### 3. 🍎 Cognitive Games
- **Memory Card Training**:
  - Phase 1: Memorize everyday picture cards (🍎 Apple, 🥛 Milk, 🔑 Key, 📱 Phone, ☂️ Umbrella, 📖 Book).
  - Phase 2: Recall testing with multiple-choice questions ("What object did you see?").
  - Tracks correct answers, wrong answers, average response latency, and overall accuracy.
- **Attention & Focus Training**:
  - Visual discrimination tasks: "Tap the RED object as quickly as possible" and "Tap the object that appeared TWICE".
  - Instant positive reinforcement and response time tracking.

### 4. 🎤 Voice Interaction & Text-to-Speech (TTS)
- **Browser Web Speech API**:
  - Elderly users can speak commands: *"Start memory game"*, *"Show reminders"*, *"My progress"*, *"What should I do now?"*.
  - SpeechSynthesis (TTS) provides spoken responses in a gentle, warm tone.
  - Speaker buttons (🔊) read aloud greetings, game instructions, and reminders.
  - Graceful fallback with clickable quick-command pills if microphone or browser support is unavailable.

### 5. ⏰ Today's Reminders
- **Essential Daily Care**:
  - 💊 Medicine: *"Take blood pressure medicine at 1:00 PM"*
  - 💧 Hydration: *"Drink a glass of water"*
  - 🏃 Activity: *"Take a short garden walk"*
  - 🏥 Appointment: *"Doctor appointment at 5:00 PM"*
- **Full Interactivity**: Caregivers and users can mark completed, add custom reminders, or hear them read aloud.

### 6. 👨‍👩‍👧 Caregiver Dashboard & Smart Alerts
- **Patient Profile**: Ramesh Kumar (Age: 68), current cognitive status, and daily activity completion rate.
- **Cognitive Analytics with Recharts**:
  - Weekly performance line chart (Mon–Sun + dynamic session updates).
  - Comparative bar chart of Memory Recall vs Attention Focus.
  - Recent activity session history with response times and AI level tags.
- **Smart Non-Diagnostic Alert**:
  - Triggers a caring notification if performance drops significantly across sessions: *"⚠️ Attention: Patient performance has decreased compared with previous sessions. Consider gently checking in."*
  - Dedicated *"Simulate Performance Drop"* button for live demonstration during judging!
  - Explicit medical disclaimers adhering to assistive boundaries.

### 7. 🟢 100% Offline Capability
- Fully functional without internet access via browser `LocalStorage`.
- Visual online/offline status badge.
- Interactive offline simulation toggle to demonstrate resilience during jury Q&A.

---

## ⏱️ 3–5 Minute SIH Presentation Flow

To deliver a high-impact demonstration during SIH evaluation:
1. **Open MindCare Landing**: Highlight the clean healthcare design and switch languages (e.g. Hindi or Telugu).
2. **Select Elderly User**: Show the friendly morning greeting and tap the 🔊 speaker button to hear it read aloud.
3. **Play Memory Game**: Memorize the objects, complete the recall questions, and observe the score.
4. **Show Adaptive AI in Action**: Show the AI explanation badge explaining how the difficulty adapted.
5. **Demonstrate Voice Interaction**: Click "Talk to MindCare" and test a voice command (or click a quick prompt like *"Show reminders"*).
6. **Review Today's Reminders**: Check off the afternoon medicine and tap *"Read Reminders Aloud"*.
7. **Switch to Caregiver Dashboard**: Show Ramesh Kumar's profile, the Recharts weekly trend graph, and the newly recorded game session.
8. **Simulate Caregiver Alert**: Click *"Simulate Performance Drop"* to show the proactive caregiver alert.
9. **Simulate Offline Mode**: Toggle offline mode in the top header and verify that games, reminders, and scores continue to work without a hitch.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom accessibility extensions
- **Data Persistence**: Browser `LocalStorage`
- **Charts & Visualizations**: Recharts
- **Voice Recognition**: Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`)
- **Speech Synthesis**: Web Speech API (`speechSynthesis`)
- **Icons**: Lucide React
- **Celebrations**: Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation
```bash
# Clone or navigate to the project directory
cd "c:/SIH 2026"

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

### Production Build
```bash
npm run build
npm run preview
```

---

*MindCare was created as a prototype submission for SIH 2026 Problem Statement 26003.*
