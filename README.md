
# 🩺 Quantum-Enhanced Vision-Language Framework for Medical Diagnosis

A multimodal medical diagnosis system that integrates vision, language, and voice with quantum-inspired learning to support clinicians with transparent diagnostic insights.

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Dataset](#dataset)
- [Problem Statement](#problem-statement)
- [Methodology](#methodology)
- [Model Architecture](#model-architecture)
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
## 🧠 Model Architecture

- **BioMedCLIP ViT-B/16** for medical image understanding  
- **Attention Fusion** for combining multiple imaging views  
- **BioMistral-7B** for clinical question reasoning  
- **Quantum-Inspired Scaling Layer** to enhance diagnostic stability  
- **LLaVA-Med** for structured report + patient-friendly summaries  
- **Whisper ASR + Piper TTS** enabling voice interaction  
- **Explainability Module** (Grad-CAM, SHAP, LIME)
---
## 🧪 Model Performance

| Metric | Value | Metric Type |
|--------|------|-------------|
| AUROC_anatomy | **0.94** | Discrimination |
| AUROC_pathology | **0.865** | Discrimination |
| AUROC_mean | **0.902** | Global Discriminative Index |
| mAP_anatomy | **0.67** | Ranking Precision |
| mAP_pathology | **0.64** | Ranking Precision |
| mAP_mean | **0.655** | Retrieval Consistency |
| F1_macro | **0.69** | Harmonic balance (per class) |
| F1_micro | **0.675** | Harmonic balance (global) |
| F1_weighted | **0.71** | Weighted Harmonic Mean |
| Overall Diagnostic Score | **0.755** | Composite Index |
| q_scale_mean | **1.10** | Quantum Scaling Mean |
| q_scale_std | **0.115** | Quantum Scaling Variance |
| q_scale_gt1_frac | **0.78** | Fraction of amplified channels |
| q_scale_lt1_frac | **0.22** | Fraction of suppressed channels |

✨ Demonstrates strong diagnostic realism and explainability with quantum-enhanced feature stability.

---


## 🌐 Website Overview

The web UI provides an end-to-end clinical experience enabling:

- Patient details submission  
- Medical image upload (X-Ray / CT / MRI / Ultrasound)  
- AI-driven anomaly detection using BioMedCLIP ViT-B/16  
- Dynamic clinical question-answering using BioMistral (voice + text)  
- Merged case file with combined visual + patient information  
- Detailed radiology-style report generation using LLaVA-Med  
- Patient-friendly summary for easy understanding  
- XAI visualizations: heatmaps with evidence-based explanation  
- One-click PDF export for clinical documentation  


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

