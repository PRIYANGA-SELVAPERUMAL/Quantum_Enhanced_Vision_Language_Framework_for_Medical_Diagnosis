# Quantum_Enhanced_Vision_Language_Framework_for_Medical_Diagnosis


````markdown
# 🩺 Quantum-Enhanced Vision-Language Framework for Medical Diagnosis

A multimodal medical diagnosis system that integrates **vision, language, and voice** with **quantum-inspired learning enhancements** to improve real-world diagnostic accuracy and interpretability. Designed to support clinicians with diagnostic reasoning, structured reports, and explainable insights.

---

## 📌 Table of Contents

* [About the Project](#about-the-project)
* [Dataset](#dataset)
* [Problem Statement](#problem-statement)
* [Methodology](#methodology)
* [Model Performance](#model-performance)
* [Website Overview](#website-overview)
* [Tech Stack](#tech-stack)
* [How to Run the Project](#how-to-run-the-project)
* [Future Work](#future-work)

---

<a name="about-the-project"></a>
## 📖 About the Project

Medical imaging is fundamental to healthcare, yet many AI-based diagnostic tools are limited due to:

- Low interpretability (black-box systems)
- Poor integration of image + clinical context
- Lack of clinician-aligned reasoning
- Limited accessibility for diverse patient groups

This framework introduces a **quantum-enhanced vision-language system** that:

✔ Accepts **medical images**  
✔ Generates **diagnostic reasoning + structured reports**  
✔ Supports **interactive voice-based question answering**  
✔ Offers **multi-level explainability**

The goal is to deliver **transparent, accurate, and clinically useful** diagnostic assistance.

---

<a name="dataset"></a>
## 📊 Dataset

Used the **MediCase-Multimodal** dataset containing:

- **7,431** real-world imaging cases
- Modalities: **X-Ray, CT, MRI, Ultrasound**
- **53 diseases** categorized into 8 clinical groups
- Includes **findings, differential diagnosis, follow-ups**, and symptoms

Each case contains:
- Radiology image
- Clinical narrative text
- JSON-based structured metadata

---

<a name="problem-statement"></a>
## ❓ Problem Statement

To develop an **explainable**, **quantum-enhanced**, and **multimodal** framework capable of:

1️⃣ Integrating images + clinical text + patient voice  
2️⃣ Providing clinician-style diagnostic reasoning  
3️⃣ Ensuring transparency with visual & textual explanations  

---

<a name="methodology"></a>
## 🔍 Methodology

### 1️⃣ Feature Extraction
- **BioMedCLIP Vision Transformer (ViT-B/16)**
- Multi-image fusion (attention pooling)

### 2️⃣ Quantum-Inspired Enhancement
- Parameterized rotation gates + Pauli-Z expectation
- Stabilizes features for robust decision reasoning

### 3️⃣ Diagnostic Reasoning
- **BioMistral-7B**: Adaptive question generation  
- Voice pipeline:  
  → **Whisper ASR** for patient responses  
  → **Piper TTS** for interactive communication

### 4️⃣ Reporting & Summarization
- **LLaVA-Med** produces:
  - Clinician-grade radiology reports
  - Patient-friendly summaries

### 5️⃣ Explainable AI (XAI)
- **Grad-CAM**: localization maps on disease-visible regions  
- **SHAP & LIME**: clinical reasoning transparency  

---

<a name="model-performance"></a>
## 🧪 Model Performance

| Metric | Score |
|--------|------|
| AUROC (Mean) | **0.902** |
| F1-Weighted | **0.71** |
| Training Loss | **0.0506** |
| Quantum Stability — q_scale_mean | **1.07** |
| q_scale_variance | **0.1334** |

🚀 Demonstrates strong diagnostic reliability with enhanced interpretability.

---

<a name="website-overview"></a>
## 🌐 Website Overview

The web interface enables:

✔ Secure medical image upload  
✔ AI-driven diagnosis output  
✔ Confidence scores + heatmaps  
✔ Voice-based interaction  
✔ User-friendly UI for clinics

🖼️ **Screenshots** (to add later here)
> Placeholder for: Upload page | Results with heatmaps | Report view

---

<a name="tech-stack"></a>
## 🛠️ Tech Stack

| Layer | Tools |
|------|------|
| Front-End | React, TypeScript, Vite |
| UI Framework | shadcn-ui, Tailwind CSS |
| Multimodal AI | BioMedCLIP, BioMistral-7B, LLaVA-Med |
| Voice Interface | Whisper ASR, Piper TTS |
| Explainability | Grad-CAM, SHAP, LIME |

---

<a name="how-to-run-the-project"></a>
## ⚙️ How to Run the Project

```sh
# Clone the repo
git clone https://github.com/PRIYANGA-SELVAPERUMAL/Quantum_Enhanced_Vision_Language_Framework_for_Medical_Diagnosis.git

# Enter project
cd Quantum_Enhanced_Vision_Language_Framework_for_Medical_Diagnosis/diago-q-assist-main

# Install dependencies
npm install

# Start development server
npm run dev
````

Open in browser:

```
http://localhost:5173/
```

---

<a name="future-work"></a>

## 🔭 Future Work

* Large-scale clinical validation
* Electronic Health Record (EHR) integration
* Multilingual question answering
* Temporal disease reasoning for progression analysis
* Deployment to cloud or hospital environments

---

