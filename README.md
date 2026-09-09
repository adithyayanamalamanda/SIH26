# MindCare

MindCare is a basic SIH 26003 prototype for elderly-friendly cognitive engagement. It demonstrates memory and attention games, explainable adaptive difficulty, local progress history, reminders, browser voice controls, caregiver views, and offline-friendly browser storage.

This is not a medical diagnostic system. Scores describe gameplay performance only and must not be used as a dementia, disease, or clinical prediction.

## Run

```powershell
npm install
npm run dev
```

Open `http://127.0.0.1:5173/`.

Build validation:

```powershell
npm run build
```

## Prototype Features

- Large, high-contrast elderly user interface
- Memory Recall Game with timed object display
- Attention Game with visual selection tasks
- Transparent adaptive difficulty rules
- LocalStorage session and reminder persistence
- Progress and caregiver trend views
- Medicine, hydration, and activity reminder examples
- Browser Web Speech API with button fallback
- English, Hindi, Telugu, and Assamese language selector scaffold
- Online/offline status indicator
- Simulated local synchronization behavior

## Adaptive Logic

The prototype uses a transparent rule-based engine. Scores at least 80 recommend the next level, scores from 50-79 keep the level, and scores below 50 reduce the level. Difficulty is clamped between levels 1 and 4. The rule engine remains the fallback for any future ML model.

## Optional ML Pipeline

The `ml/` folder contains a Random Forest training scaffold. The checked-in CSV is only a tiny development sample and is not clinical data. Do not report meaningful accuracy from it. Collect enough real, consented gameplay data before training:

```powershell
python ml/train.py
```

Install optional dependencies first with `pip install scikit-learn joblib`. The app does not require the ML model to run.

## Future Production Work

A production system still needs a FastAPI backend, MongoDB persistence, real authentication and authorization, audited privacy controls, robust offline conflict resolution, native/mobile packaging, professional localization, and clinical/safety review. Hugging Face Whisper can be added later for local or configured speech recognition: https://huggingface.co/openai/whisper-small
