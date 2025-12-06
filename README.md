
# 🩺 Quantum-Enhanced Vision-Language Framework for Medical Diagnosis

A multimodal medical diagnosis system that integrates vision, language, and voice with quantum-inspired learning to support clinicians with transparent diagnostic insights.

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Dataset](#dataset)
- [Problem Statement](#problem-statement)
- [Methodology](#methodology)
- [Model Performance](#model-performance)
- [Website Overview](#website-overview)
- [Tech Stack](#tech-stack)
- [How to Run the Project](#how-to-run-the-project)
- [Future Work](#future-work)

---

## 📖 About the Project

Medical imaging is fundamental to healthcare, yet many AI-based diagnostic tools are limited due to:

- Low interpretability (black-box systems)
- Poor integration of image + clinical context
- Lack of clinician-aligned reasoning
- Limited accessibility for diverse patient groups

This framework introduces a quantum-enhanced vision-language system that:

✔ Accepts medical images  
✔ Generates diagnostic reasoning + structured reports  
✔ Supports interactive voice-based question answering  
✔ Offers multi-level explainability  

The goal is to deliver **transparent, accurate, and clinically useful** diagnostic assistance.

---

## 📊 Dataset

Uses the MediCase-Multimodal dataset:

- 7,431 real-world imaging cases  
- Modalities: X-Ray, CT, MRI, Ultrasound  
- 53 diseases under 8 categories  
- Includes findings, differential diagnosis, follow-ups, and symptoms  

---

## ❓ Problem Statement

To develop an explainable, quantum-enhanced, and multimodal framework capable of:

1️⃣ Integrating images + clinical text + patient voice  
2️⃣ Providing clinician-style diagnostic reasoning  
3️⃣ Ensuring transparency with visual & textual explanations

---

## 🔍 Methodology

### 1️⃣ Feature Extraction
- BioMedCLIP Vision Transformer (ViT-B/16)
- Multi-image fusion with attention pooling

### 2️⃣ Quantum-Inspired Enhancement
- Parameterized rotation gates + Pauli-Z expectation  
- Improves stability and diagnostic reliability

### 3️⃣ Diagnostic Reasoning
- BioMistral-7B for medical question generation  
- Whisper ASR + Piper TTS for voice-based interaction  

### 4️⃣ Reporting
- LLaVA-Med produces clinician-grade reports and patient-friendly summaries  

### 5️⃣ Explainability (XAI)
- **Grad-CAM** → Visual heatmaps  
- **SHAP & LIME** → Textual reasoning transparency  

---

## 🧪 Model Performance

| Metric | Score |
|--------|------|
| AUROC (Mean) | **0.902** |
| F1-Weighted | **0.71** |
| Training Loss | **0.0506** |
| q_scale_mean | **1.07** |
| q_scale_variance | **0.1334** |

✨ Demonstrates strong diagnostic reliability with enhanced clarity & explainability.

---

## 🌐 Website Overview

The web UI enables:

✔ Medical image upload  
✔ AI-driven diagnosis + heatmaps  
✔ Confidence scoring  
✔ Voice interaction for anamnesis  
✔ Clean and accessible clinical interface  

📸 Screenshots will be added here soon!

---

## 🛠 Tech Stack

| Layer | Tools |
|------|------|
| Front-End | React, TypeScript, Vite |
| UI | shadcn-ui, Tailwind CSS |
| Multimodal AI | BioMedCLIP, BioMistral-7B, LLaVA-Med |
| Voice | Whisper ASR, Piper TTS |
| Explainability | Grad-CAM, SHAP, LIME |

---

## ⚙️ How to Run the Project

```sh
git clone https://github.com/PRIYANGA-SELVAPERUMAL/Quantum_Enhanced_Vision_Language_Framework_for_Medical_Diagnosis.git
cd Quantum_Enhanced_Vision_Language_Framework_for_Medical_Diagnosis/diago-q-assist-main
npm install
npm run dev
````

Then open in browser:

```
http://localhost:5173/
```

---

## 🔭 Future Work

* Large-scale clinical validation
* EHR integration
* Multilingual voice support
* Disease progression analysis
* Cloud deployment for hospitals

---

