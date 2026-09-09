# SIH 26003 MindCare TODO

## Completed Basic Prototype

- [x] React + Vite project setup
- [x] MindCare landing page and elderly-friendly home
- [x] Caregiver entry and dashboard view
- [x] Memory Recall Game with timed object display
- [x] Attention Game with visual selection tasks
- [x] Correct, incorrect, accuracy, response-time, and score tracking
- [x] Separate transparent adaptive-difficulty module
- [x] Difficulty increase, hold, decrease, and boundary rules
- [x] LocalStorage game-session persistence
- [x] Progress and caregiver trend views
- [x] Non-diagnostic caregiver alert
- [x] Medicine, hydration, and activity reminder examples
- [x] Reminder completion persistence
- [x] Browser Web Speech API voice commands with fallback buttons
- [x] English, Hindi, Telugu, and Assamese language selector scaffold
- [x] Online/offline browser status indicator
- [x] Local offline saving and simulated synchronization messaging
- [x] Random Forest ML-ready training and prediction scaffold
- [x] Demo patient data and sample development dataset
- [x] README setup and safety documentation
- [x] Responsive mobile/tablet CSS
- [x] Lint, production build, and Python syntax validation

## Verified Commands

```powershell
npm install
npm run lint
npm run build
python -m py_compile ml/train.py ml/predict.py
npm run dev -- --host 127.0.0.1
```

## SIH Demo Flow

1. Open MindCare at `http://127.0.0.1:5173/`.
2. Select Elderly User.
3. Complete Memory Training or Attention Training.
4. Show the adaptive performance result.
5. Open progress and reminders.
6. Switch to Caregiver view.
7. Show the updated trend and supportive alert.
8. Toggle the browser offline and continue using local data.

## Production Follow-up

- [ ] Replace LocalStorage with a FastAPI backend and MongoDB.
- [ ] Add real authentication, password hashing, and role-based authorization.
- [ ] Add robust offline conflict resolution and server synchronization.
- [ ] Replace browser speech recognition with configured Whisper deployment where appropriate.
- [ ] Complete translations with reviewed language content.
- [ ] Collect consented gameplay data before training a meaningful ML model.
- [ ] Add security, privacy, accessibility, and clinical/safety review.
- [ ] Package a mobile application.

## Safety Boundary

MindCare reports gameplay performance and engagement only. It does not diagnose dementia, predict disease, recommend treatment, or replace a healthcare professional.

## Resources

- Whisper: https://huggingface.co/openai/whisper-small
- MongoDB Atlas: https://www.mongodb.com/docs/atlas/
