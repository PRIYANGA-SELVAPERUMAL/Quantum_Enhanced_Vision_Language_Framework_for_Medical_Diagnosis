import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Brain, Loader2, FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import jsPDF from 'jspdf';

const ReportView = ({ caseData, patientInfo, answers, uploadedImages, onShowXAI, onReportGenerated }: any) => {
  const [generating, setGenerating] = useState(true);
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    // Simulate LLaVA-Med report generation
    await new Promise(resolve => setTimeout(resolve, 3000));

    const historyNarrative = buildHistoryNarrative(answers, caseData.questions);
    
    const report = {
      patientInfo,
      caseData,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      historyNarrative,
      findings: caseData.findings,
      diagnosis: caseData.diagnosis,
      diagnosisConfirmation: generateDiagnosisConfirmation(caseData.title),
      treatment: caseData.treatment,
      complications: generateComplications(caseData.title),
      followUp: generateFollowUp(caseData.title),
      summaryImpression: generateSummaryImpression(caseData.title)
    };

    setReportData(report);
    onReportGenerated(report);
    setGenerating(false);
    toast.success("Report generated successfully!");
  };

  const buildHistoryNarrative = (answers: Record<string, string>, questions: string[]) => {
    const responses = Object.entries(answers).map(([key, value]) => {
      const qIndex = parseInt(key.replace('q', ''));
      return { question: questions[qIndex], answer: value };
    });

    const convertToThirdPerson = (text: string, gender: string) => {
      if (!text || text.trim() === '') return '';
      
      const pronoun = gender.toLowerCase() === 'male' ? 'he' : 'she';
      const possessive = gender.toLowerCase() === 'male' ? 'his' : 'her';
      const object = gender.toLowerCase() === 'male' ? 'him' : 'her';
      
      let converted = text
        .replace(/^(yes,?\s*i\s+have\s+been\s+|yes,?\s*i\s+have\s+|i\s+have\s+been\s+|i\s+have\s+|yes,?\s*i\s+|i\s+am\s+|yes,?\s*|i\s+)/i, '')
        .trim();
      
      converted = converted
        .replace(/\bI\s+/g, `${pronoun.charAt(0).toUpperCase() + pronoun.slice(1)} `)
        .replace(/\s+I\s+/g, ` ${pronoun} `)
        .replace(/\s+I\'/g, ` ${pronoun}'`)
        .replace(/\bmy\b/gi, possessive)
        .replace(/\bme\b/gi, object)
        .replace(/\bI'm\b/gi, `${pronoun} is`)
        .replace(/\bI've\b/gi, `${pronoun} has`)
        .replace(/\bI'll\b/gi, `${pronoun} will`)
        .replace(/\bI'd\b/gi, `${pronoun} would`);
      
      return converted;
    };

    const extractResponse = (keywords: string[]) => {
      return responses.find(r => 
        keywords.some(kw => r.question.toLowerCase().includes(kw.toLowerCase()))
      )?.answer || '';
    };

    const isNegative = (text: string) => {
      return !text || ['no', 'none', 'n/a', 'not applicable', 'unremarkable', 'negative', 'nothing'].some(term => text.toLowerCase().trim().startsWith(term));
    };

    // Extract all relevant information
    const symptoms = extractResponse(['symptom', 'complaint', 'experiencing', 'problem', 'chief']);
    const onset = extractResponse(['onset', 'started', 'began', 'when did']);
    const severity = extractResponse(['severe', 'pain scale', 'intensity', 'character', 'describe']);
    const location = extractResponse(['location', 'where', 'which side']);
    const aggravating = extractResponse(['aggravate', 'worse with', 'trigger', 'exacerbate']);
    const associated = extractResponse(['associated', 'other symptoms', 'along with', 'accompanied']);
    const trauma = extractResponse(['injury', 'accident', 'trauma', 'fall', 'incident']);
    const pastHistory = extractResponse(['medical history', 'past conditions', 'previous illnesses', 'health problems']);
    const surgical = extractResponse(['surgery', 'surgical', 'operation', 'procedure']);
    const medications = extractResponse(['medication', 'taking', 'drug', 'prescription']);
    const functional = extractResponse(['mobility', 'walk', 'function', 'daily activities', 'difficulty', 'limitation']);

    const gender = patientInfo.gender || 'Male';
    const pronoun = gender.toLowerCase() === 'male' ? 'he' : 'she';
    const pronounCap = pronoun.charAt(0).toUpperCase() + pronoun.slice(1);
    const possessive = gender.toLowerCase() === 'male' ? 'his' : 'her';

    let narrative = '';

    // Opening: Demographics and chief complaint
    narrative += `The patient is a ${patientInfo.age}-year-old ${gender.toLowerCase()} who `;
    
    if (symptoms) {
      const symptomText = convertToThirdPerson(symptoms, gender).replace(/^(experiencing|having|with)\s+/i, '');
      narrative += `presented with a history of ${symptomText}`;
      
      if (severity && !isNegative(severity)) {
        const severityText = convertToThirdPerson(severity, gender);
        narrative += `, ${severityText}`;
      }
      
      if (associated && !isNegative(associated)) {
        const assocText = convertToThirdPerson(associated, gender);
        narrative += `, accompanied by ${assocText}`;
      }
      
      narrative += '. ';
    }

    // Aggravating factors
    if (aggravating && !isNegative(aggravating)) {
      const aggText = convertToThirdPerson(aggravating, gender);
      narrative += `These symptoms are exacerbated ${aggText}. `;
    }

    // Location and other descriptors
    if (location && !isNegative(location)) {
      const locText = convertToThirdPerson(location, gender);
      narrative += `The symptoms are ${locText}. `;
    }

    // Trauma/precipitating event
    if (trauma && !isNegative(trauma)) {
      const traumaText = convertToThirdPerson(trauma, gender);
      narrative += `${pronounCap} ${traumaText}. `;
    }

    // Past medical/surgical history
    if (pastHistory && !isNegative(pastHistory)) {
      const histText = convertToThirdPerson(pastHistory, gender);
      narrative += `Past medical history includes ${histText}. `;
    }

    if (surgical && !isNegative(surgical)) {
      const surgText = convertToThirdPerson(surgical, gender);
      narrative += `Surgical history reveals ${surgText}. `;
    }

    // Medications
    if (medications && !isNegative(medications)) {
      const medText = convertToThirdPerson(medications, gender);
      narrative += `The patient ${medText}. `;
    } else {
      narrative += `The patient is not currently taking any regular prescription medications. `;
    }

    // Functional status
    if (functional && !isNegative(functional)) {
      const funcText = convertToThirdPerson(functional, gender);
      narrative += `Functionally, ${pronoun} ${funcText}. `;
    }

    return narrative.trim();
  };

  const generateComplications = (caseTitle: string) => {
    const complications: Record<string, string> = {
      "Legg-Calve-Perthes Disease Sequela": "Given the extensive surgical history spanning five decades with documented recurrent infection complications, several significant risks warrant consideration. Prosthetic joint infection remains the paramount concern, with historical infection episodes predisposing to bacterial colonization and biofilm formation on hardware. Prophylactic antibiotic protocols and extended perioperative monitoring are essential. Implant loosening or aseptic failure represents high probability given severely compromised bone stock, poor vascularity of scar tissue, and abnormal acetabular architecture, necessitating serial radiographic surveillance at 6-week, 3-month, 6-month, and annual intervals. Delayed or non-union of structural bone grafts may occur secondary to vascular compromise from multiple prior surgical approaches, with graft incorporation requiring 6-12 months of protected weight-bearing and nutritional optimization. Residual or worsening leg length discrepancy may persist post-reconstruction, necessitating comprehensive gait analysis and custom orthotic fabrication. Prosthetic dislocation risk is substantially elevated due to compromised soft tissue envelope, abnormal hip biomechanics, and muscular atrophy, requiring patient education on hip precautions and movement restrictions. Neurovascular injury during revision surgery presents elevated risk given distorted anatomical landmarks, extensive scar tissue planes, and proximity of critical structures. Heterotopic ossification formation may limit postoperative range of motion despite prophylactic measures. Thromboembolic complications including deep venous thrombosis and pulmonary embolism require chemoprophylaxis and mechanical compression devices given prolonged immobilization and advanced age.",
      "Left Upper Lobe Collapse, Squamous Cell Carcinoma": "Post-therapeutic complications requiring vigilant monitoring include local tumor recurrence or disease progression despite treatment, necessitating ongoing bronchoscopic surveillance and serial chest CT imaging at 3-month intervals for the first year. Radiation pneumonitis typically manifests 1-3 months following radiotherapy completion, presenting as dyspnea, cough, and low-grade fever, potentially requiring corticosteroid intervention and supportive oxygen therapy. Bronchial stenosis may develop from post-therapeutic scar formation and fibrosis, causing progressive airway compromise and warranting serial pulmonary function testing with consideration for bronchoscopic dilation if symptomatic. Platinum-based chemotherapy regimen carries inherent toxicities including nephrotoxicity requiring serial creatinine and glomerular filtration rate monitoring, ototoxicity with baseline and interval audiometry, peripheral neuropathy assessment, and myelosuppression necessitating complete blood count surveillance with dose modifications as indicated. Baseline COPD and chronic hypoxemia substantially increase vulnerability to respiratory decompensation from any additional pulmonary insult, requiring aggressive pulmonary rehabilitation, bronchodilator optimization, and low-threshold for hospitalization with acute exacerbations. Malnutrition and cachexia from disease burden and treatment side effects may impair healing and treatment tolerance, warranting nutritional consultation and supplementation strategies.",
      "Lemierre Syndrome": "Critical complications requiring intensive monitoring include septic embolization with potential for pulmonary abscess formation, cerebral infarction, hepatic or splenic seeding, or other systemic dissemination, necessitating continued therapeutic anticoagulation and broad-spectrum anaerobic antibiotic coverage for minimum 4-6 weeks duration. Recurrent or progressive internal jugular vein thrombosis despite anticoagulation therapy may occur, requiring serial venous duplex ultrasonography and consideration for catheter-directed thrombolysis in refractory cases. Neurological sequelae in pediatric population including ischemic stroke from venous sinus thrombosis, seizure disorder requiring anticonvulsant therapy, developmental regression, or permanent cognitive impairment warrant comprehensive neurological assessment with electroencephalography and neurodevelopmental follow-up. Abscess recurrence or inadequate source control from incomplete surgical drainage mandates clinical vigilance for persistent fever, recurrent neck swelling, or systemic sepsis with low threshold for repeat cross-sectional imaging. Prolonged intravenous antibiotic therapy carries inherent risks of line-associated bloodstream infection, antibiotic-associated diarrhea from Clostridium difficile, development of resistant organisms, and drug-specific toxicities requiring antimicrobial stewardship and infectious disease consultation. Airway compromise from expanding neck phlegmon or mediastinal extension represents life-threatening complication requiring intensive care unit monitoring and otolaryngology standby for emergent surgical airway if indicated.",
      "Lentiform Fork Sign Of Basal Ganglia In HELLP Syndrome": "Maternal complications in the immediate postpartum period include persistent eclampsia risk with seizure activity potentially occurring up to 48 hours following delivery, necessitating continuation of intravenous magnesium sulfate prophylaxis for minimum 24 hours postpartum with therapeutic levels maintained at 4-8 mg/dL. Disseminated intravascular coagulation may develop or worsen despite delivery, manifesting as multiorgan bleeding, requiring platelet transfusion for counts below 20,000/μL, fresh frozen plasma for coagulation factor replacement, and cryoprecipitate for fibrinogen repletion. Hepatic subcapsular hematoma or frank rupture, though rare complications occurring in less than 2% of HELLP cases, represents surgical emergency if sudden severe epigastric or right upper quadrant pain develops with hemodynamic instability. Acute kidney injury from endothelial dysfunction, intravascular hemolysis, and hypovolemia necessitates strict fluid balance monitoring, serial creatinine measurements, and nephrology consultation if oliguria persists or creatinine rises above 1.5 mg/dL. Pulmonary edema from capillary leak syndrome, fluid overload, or cardiac dysfunction requires oxygen saturation monitoring, judicious fluid restriction, and potential diuretic therapy. Permanent neurological injury from basal ganglia ischemia remains possible despite typical reversibility of vasogenic edema, warranting follow-up MRI brain at 2-4 weeks to confirm complete resolution. Future pregnancy carries approximately 20% recurrence risk for preeclampsia and 5% risk for recurrent HELLP syndrome, mandating aspirin prophylaxis initiated at 12 weeks gestation, enhanced prenatal surveillance with serial blood pressure and laboratory monitoring, and delivery planning at high-risk obstetric center.",
      "Leptomeningeal Carcinomatosis From Endometrial Carcinoma": "Progressive neurological deterioration represents expected disease trajectory, manifesting as sequential cranial nerve palsies (particularly III, IV, VI, VII affecting ocular motility and facial function), cognitive decline with memory impairment and executive dysfunction, ascending motor weakness from nerve root compression, bowel and bladder incontinence from cauda equina involvement, and intractable pain syndromes requiring escalating analgesic interventions including opioid therapy and adjuvant neuropathic agents. Communicating hydrocephalus from impaired cerebrospinal fluid reabsorption may develop, presenting as headache, nausea, gait instability, and altered mental status, potentially requiring ventriculoperitoneal shunt placement for symptom palliation and intracranial pressure management. Chronic aseptic meningitis from leptomeningeal tumor infiltration presents as persistent headache, photophobia, neck stiffness, and low-grade fever despite negative bacterial cultures. Intrathecal methotrexate neurotoxicity occurs in 10-15% of patients, manifesting as chemical arachnoiditis with severe headache, acute encephalopathy with confusion, or seizure activity requiring dose reduction or treatment discontinuation. Craniospinal radiation therapy carries delayed complications including radiation myelopathy with progressive myelopathic syndrome developing 6-24 months post-treatment, necessitating serial MRI surveillance to differentiate from disease progression. Limited prognosis with median survival of 3-6 months from diagnosis of leptomeningeal carcinomatosis mandates early palliative care integration, advanced directive discussions, hospice referral consideration, and comprehensive symptom management focused on quality of life optimization rather than disease-directed therapy alone."
    };
    return complications[caseTitle] || "Standard post-treatment monitoring required with attention to potential therapy-related adverse effects and disease progression.";
  };

  const generateFollowUp = (caseTitle: string) => {
    const followUps: Record<string, string[]> = {
      "Legg-Calve-Perthes Disease Sequela": [
        "Serial radiographic imaging every 6 months to assess joint stability and hardware integrity",
        "Physical therapy sessions twice weekly for range of motion and strengthening",
        "Orthopedic surgical consultation within 3 months to evaluate reconstruction candidacy",
        "Pain management review monthly with adjustment of analgesic regimen as needed",
        "Gait analysis and orthotic assessment if leg length discrepancy persists"
      ],
      "Left Upper Lobe Collapse, Squamous Cell Carcinoma": [
        "PET/CT imaging 6 weeks post-treatment completion for restaging",
        "Pulmonary function testing monthly during therapy, then quarterly",
        "Oncology follow-up every 3 months for first year, then every 6 months",
        "Bronchoscopy as clinically indicated to assess airway patency",
        "Smoking cessation counseling and pulmonary rehabilitation enrollment"
      ],
      "Lemierre Syndrome": [
        "Inflammatory markers (CRP, ESR) monitored weekly for 4 weeks",
        "Repeat imaging at 2 weeks to confirm thrombosis resolution",
        "Complete 4-6 week intravenous antibiotic course as prescribed",
        "Anticoagulation therapy for 3-6 months with regular INR monitoring if on warfarin",
        "ENT follow-up at 1 month and 3 months post-discharge"
      ],
      "Lentiform Fork Sign Of Basal Ganglia In HELLP Syndrome": [
        "Blood pressure monitoring twice daily for 6 weeks postpartum, target <140/90 mmHg",
        "Liver function tests and platelet count weekly for 1 month until normalized",
        "Follow-up MRI brain at 2 weeks to document complete resolution of basal ganglia changes",
        "Nephrology consultation if proteinuria persists beyond 12 weeks postpartum",
        "Preconception counseling for future pregnancies with aspirin prophylaxis discussion"
      ],
      "Leptomeningeal Carcinomatosis From Endometrial Carcinoma": [
        "MRI brain and complete spine every 3 months to assess disease progression",
        "CSF cytology analysis if new neurological symptoms develop",
        "Radiation oncology follow-up monthly during active treatment",
        "Neurology consultation for symptom palliation and seizure management",
        "Palliative care integration for comprehensive quality of life optimization"
      ]
    };
    
    const followUpList = followUps[caseTitle] || ["Regular follow-up appointments as scheduled by treating physician"];
    return followUpList.join('. ') + '.';
  };

  const generateDiagnosisConfirmation = (caseTitle: string) => {
    const confirmations: Record<string, string> = {
      "Lentiform Fork Sign Of Basal Ganglia In HELLP Syndrome": "The diagnosis is confirmed through comprehensive clinical and laboratory correlation. Imaging demonstrates bilateral symmetric hypodensity of the basal ganglia on non-enhanced CT, consistent with the characteristic lentiform fork sign, without post-contrast enhancement. MRI reveals hypointense T1-weighted and hyperintense T2-weighted and FLAIR signals, consistent with vasogenic edema symmetrically involving the globus pallidus, putamen, and internal and external capsules. Laboratory findings are pathognomonic for HELLP syndrome, demonstrating hemolysis with elevated lactate dehydrogenase and decreased haptoglobin, elevated liver transaminases (AST, ALT), and thrombocytopenia with platelet count below 100,000/μL. These imaging and laboratory findings, combined with severe hypertension (180/110 mmHg) during pregnancy, establish the diagnosis. Follow-up MRI at 2 weeks post-delivery demonstrated complete resolution of basal ganglia changes, confirming reversible metabolic-toxic injury and excluding permanent ischemic damage.",
      "Legg-Calve-Perthes Disease Sequela": "Diagnosis confirmed through comprehensive radiological evaluation including plain film radiography and nuclear bone scan demonstrating severe degenerative changes at the right hip joint with erosion and absence of the femoral head, presence of surgical hardware, and chronic remodeling changes. Clinical correlation with extensive surgical history and Legg-Calvé-Perthes disease in childhood supports the diagnosis of long-term sequelae.",
      "Left Upper Lobe Collapse, Squamous Cell Carcinoma": "Diagnosis established through fiberoptic bronchoscopy with direct visualization of obstructing endobronchial mass and tissue confirmation via brush cytology and biopsy demonstrating squamous cell carcinoma. Radiographic findings of left upper lobe collapse with abnormal hilar contour and fissure displacement correlate with bronchoscopic findings.",
      "Lemierre Syndrome": "Diagnosis confirmed through contrast-enhanced CT and MRI imaging demonstrating internal jugular vein thrombosis with extension to venous sinuses, rim-enhancing deep neck abscess, and microbiological confirmation with positive blood culture for Fusobacterium necrophorum. Clinical presentation of fever, neck mass, and septic symptoms in conjunction with imaging findings establish the diagnosis.",
      "Leptomeningeal Carcinomatosis From Endometrial Carcinoma": "Diagnosis established through MRI demonstrating multiple enhancing intradural lesions at the conus medullaris and surrounding the cauda equina, in conjunction with CSF cytology revealing malignant cells consistent with endometrial carcinoma origin. Clinical history of prior metastatic endometrial carcinoma with parietal lobe resection and new cranial nerve VI palsy supports leptomeningeal dissemination."
    };
    return confirmations[caseTitle] || "Diagnosis confirmed through clinical correlation and appropriate diagnostic modalities.";
  };

  const generateSummaryImpression = (caseTitle: string) => {
    const summaries: Record<string, string> = {
      "Lentiform Fork Sign Of Basal Ganglia In HELLP Syndrome": "Imaging demonstrates characteristic lentiform fork sign of bilateral basal ganglia involvement in HELLP syndrome with severe preeclampsia. Laboratory findings confirm hemolysis, elevated liver enzymes, and thrombocytopenia. Complete radiological and clinical resolution achieved following delivery and supportive management, with excellent maternal outcome and no permanent neurological sequelae.",
      "Legg-Calve-Perthes Disease Sequela": "Imaging reveals severe degenerative sequelae of Legg-Calvé-Perthes disease with complete loss of right femoral head integrity, extensive surgical hardware from multiple prior interventions, and chronic remodeling changes. Clinical presentation demonstrates significant functional impairment requiring ongoing pain management and consideration for complex reconstructive surgical intervention with realistic assessment of risks and benefits.",
      "Left Upper Lobe Collapse, Squamous Cell Carcinoma": "Imaging findings demonstrate complete left upper lobe collapse secondary to endobronchial squamous cell carcinoma causing mainstem bronchus obstruction. Bronchoscopic tissue confirmation obtained. Patient referred for comprehensive oncologic staging with PET/CT and initiation of multimodal therapy including radiation and platinum-based chemotherapy with appropriate supportive care measures.",
      "Lemierre Syndrome": "Imaging confirms Lemierre syndrome with extensive deep neck abscess formation, internal jugular vein thrombosis with venous sinus extension, and positive blood cultures for Fusobacterium necrophorum. Emergency surgical drainage performed successfully with prolonged intravenous antibiotic therapy and anticoagulation management, demonstrating clinical improvement and resolution of septic complications.",
      "Leptomeningeal Carcinomatosis From Endometrial Carcinoma": "Imaging demonstrates leptomeningeal carcinomatosis with multiple enhancing lesions along the cauda equina and conus medullaris, confirmed by CSF cytology positive for metastatic endometrial carcinoma. Treatment initiated with craniospinal radiation and intrathecal chemotherapy. Palliative care integration appropriate given limited prognosis, with focus on neurological symptom management and quality of life optimization."
    };
    return summaries[caseTitle] || "Comprehensive diagnostic evaluation confirms the diagnosis with appropriate management plan initiated.";
  };

  const downloadPDF = async () => {
    if (!reportData) return;

    toast.info("Generating PDF...");

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const lineHeight = 7;
      let yPos = 20;

      // Header
      pdf.setFillColor(23, 162, 184);
      pdf.rect(0, 0, pageWidth, 35, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('DiagnoQ', margin, 15);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Medical Diagnostic Report', margin, 25);

      // Add uploaded images after header
      if (uploadedImages && uploadedImages.length > 0) {
        yPos = 45;
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Medical Imaging Studies', margin, yPos);
        yPos += 10;

        const imgWidth = 40;
        const imgHeight = 40;
        const imgsPerRow = 4;
        let xPos = margin;

        for (let i = 0; i < uploadedImages.length; i++) {
          if (i > 0 && i % imgsPerRow === 0) {
            yPos += imgHeight + 5;
            xPos = margin;
          }

          if (yPos + imgHeight > 270) {
            pdf.addPage();
            yPos = 20;
            xPos = margin;
          }

          try {
            const imgData = URL.createObjectURL(uploadedImages[i]);
            pdf.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight);
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'normal');
            pdf.text(`Scan ${i + 1}`, xPos + imgWidth/2, yPos + imgHeight + 3, { align: 'center' });
          } catch (error) {
            console.error('Error adding image to PDF:', error);
          }

          xPos += imgWidth + 5;
        }

        yPos += imgHeight + 15;
      }

      if (!uploadedImages || uploadedImages.length === 0) {
        yPos = 45;
      }
      pdf.setTextColor(0, 0, 0);

      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }

      // Patient Information
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Patient Information', margin, yPos);
      yPos += lineHeight;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Name: ${reportData.patientInfo.name}`, margin, yPos);
      yPos += 5;
      pdf.text(`Age: ${reportData.patientInfo.age} | Gender: ${reportData.patientInfo.gender}`, margin, yPos);
      yPos += 5;
      pdf.text(`Report Date: ${reportData.date}`, margin, yPos);
      yPos += 10;

      // Case Diagnosis
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Case Diagnosis', margin, yPos);
      yPos += lineHeight;
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(23, 162, 184);
      const diagnosisLines = pdf.splitTextToSize(reportData.diagnosis, pageWidth - 2 * margin);
      pdf.text(diagnosisLines, margin, yPos);
      yPos += diagnosisLines.length * 5 + 10;
      pdf.setTextColor(0, 0, 0);

      // Diagnosis Confirmation
      if (reportData.diagnosisConfirmation) {
        if (yPos > 240) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Diagnosis Confirmation', margin, yPos);
        yPos += lineHeight;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const confirmLines = pdf.splitTextToSize(reportData.diagnosisConfirmation, pageWidth - 2 * margin);
        confirmLines.forEach((line: string) => {
          if (yPos > 270) {
            pdf.addPage();
            yPos = 20;
          }
          pdf.text(line, margin, yPos);
          yPos += 5;
        });
        yPos += 10;
      }

      // Clinical History
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Clinical History', margin, yPos);
      yPos += lineHeight;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const historyLines = pdf.splitTextToSize(reportData.historyNarrative, pageWidth - 2 * margin);
      historyLines.forEach((line: string) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += 5;
      });
      yPos += 5;

      // Radiological Findings
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Radiological & Diagnostic Findings', margin, yPos);
      yPos += lineHeight;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const findingsLines = pdf.splitTextToSize(reportData.findings, pageWidth - 2 * margin);
      findingsLines.forEach((line: string) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += 5;
      });
      yPos += 5;

      // Treatment Plan
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Treatment Plan & Clinical Management', margin, yPos);
      yPos += lineHeight;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const treatmentLines = pdf.splitTextToSize(reportData.treatment, pageWidth - 2 * margin);
      treatmentLines.forEach((line: string) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += 5;
      });
      yPos += 5;

      // Potential Complications
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Potential Complications & Risk Factors', margin, yPos);
      yPos += lineHeight;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const complicationLines = pdf.splitTextToSize(reportData.complications, pageWidth - 2 * margin);
      complicationLines.forEach((line: string) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += 5;
      });
      yPos += 5;

      // Follow-up Plan
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Follow-up Recommendations', margin, yPos);
      yPos += lineHeight;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const followUpItems = reportData.followUp.split('. ').filter((item: string) => item.trim());
      followUpItems.forEach((item: string, idx: number) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        const bulletLine = `\u2022 ${item.trim()}${item.endsWith('.') ? '' : '.'}`;
        const itemLines = pdf.splitTextToSize(bulletLine, pageWidth - 2 * margin - 5);
        itemLines.forEach((line: string) => {
          pdf.text(line, margin + 2, yPos);
          yPos += 5;
        });
      });
      yPos += 5;

      // Summary Impression
      if (yPos > 250) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Summary Impression', margin, yPos);
      yPos += lineHeight;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const summaryLines = pdf.splitTextToSize(reportData.summaryImpression, pageWidth - 2 * margin);
      summaryLines.forEach((line: string) => {
        if (yPos > 270) {
          pdf.addPage();
          yPos = 20;
        }
        pdf.text(line, margin, yPos);
        yPos += 5;
      });

      // Footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, 287);
        pdf.text('Generated by DiagnoQ AI Diagnostic System', margin, 287);
      }

      const fileName = `DiagnoQ_Report_${reportData.patientInfo.name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
      pdf.save(fileName);
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (generating) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 card-shadow text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <h3 className="text-xl font-semibold">Generating Detailed Medical Report</h3>
          <p className="text-muted-foreground">
            LLaVA-Med is analyzing imaging data and patient information...
          </p>
        </Card>
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-background dark:via-background dark:to-primary/10 p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-30 dark:opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl opacity-30 dark:opacity-20"></div>
      </div>
      
      <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 relative z-10">
        {/* Actions */}
        <div className="flex flex-wrap gap-3">
        <Button
          onClick={downloadPDF}
          className="medical-gradient text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-smooth medical-glow"
          size="lg"
        >
          <Download className="mr-2 h-5 w-5" />
          Download PDF Report
        </Button>
        <Button
          onClick={onShowXAI}
          variant="outline"
          size="lg"
          className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-md hover:shadow-lg transition-smooth"
        >
          <Brain className="mr-2 h-5 w-5" />
          Show Detailed Reasoning (XAI)
        </Button>
      </div>

      {/* Report Content */}
      <Card className="p-8 shadow-2xl medical-glow space-y-8 bg-card/95 backdrop-blur-sm border-2 border-primary/10">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Medical Diagnostic Report
              </h1>
              <p className="text-muted-foreground mt-2 text-lg font-medium">Generated by DiagnoQ AI System</p>
            </div>
            <div className="text-right bg-primary/5 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">Report Date</p>
              <p className="font-bold text-foreground text-lg">{reportData.date}</p>
            </div>
          </div>
          <Separator className="bg-gradient-to-r from-primary/50 via-secondary/50 to-accent/50" />
        </div>

        {/* Patient Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoBox label="Patient Name" value={reportData.patientInfo.name} />
          <InfoBox label="Age" value={reportData.patientInfo.age} />
          <InfoBox label="Gender" value={reportData.patientInfo.gender} />
        </div>

        {/* Case Diagnosis */}
        <Section title="Case Diagnosis" icon={<FileText className="h-5 w-5" />} highlight>
          <p className="text-lg font-semibold text-primary">{reportData.diagnosis}</p>
        </Section>

        {/* Diagnosis Confirmation */}
        <Section title="Diagnosis Confirmation">
          <p className="leading-relaxed text-justify break-words overflow-wrap-anywhere whitespace-normal">{reportData.diagnosisConfirmation}</p>
        </Section>

        {/* Medical Scans */}
        <Section title="Medical Imaging Studies" icon={<ImageIcon className="h-5 w-5" />}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedImages.map((img: File, idx: number) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-border card-shadow">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Medical Scan ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white text-xs py-2 px-3">
                  <p className="font-medium">Image {idx + 1}</p>
                  <p className="text-[10px] opacity-75">{reportData.caseData.title}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Clinical History */}
        <Section title="Clinical History & Patient Presentation">
          <p className="leading-relaxed text-justify break-words overflow-wrap-anywhere whitespace-normal">{reportData.historyNarrative}</p>
        </Section>

        {/* Findings */}
        <Section title="Radiological & Diagnostic Findings">
          <p className="leading-relaxed text-justify break-words overflow-wrap-anywhere whitespace-normal">{reportData.findings}</p>
        </Section>

        {/* Treatment */}
        <Section title="Treatment Plan & Clinical Management">
          <p className="leading-relaxed text-justify break-words overflow-wrap-anywhere whitespace-normal">{reportData.treatment}</p>
        </Section>

        {/* Complications */}
        <Section title="Potential Complications & Risk Factors">
          <p className="leading-relaxed text-justify break-words overflow-wrap-anywhere whitespace-normal">{reportData.complications}</p>
        </Section>

        {/* Follow-up */}
        <Section title="Follow-up Recommendations">
          <ul className="list-disc list-inside space-y-2 leading-relaxed">
            {reportData.followUp.split('. ').filter((item: string) => item.trim()).map((item: string, idx: number) => (
              <li key={idx} className="ml-2">{item.trim()}{item.endsWith('.') ? '' : '.'}</li>
            ))}
          </ul>
        </Section>

        {/* Summary Impression */}
        <Section title="Summary Impression" highlight>
          <p className="leading-relaxed text-justify font-medium break-words overflow-wrap-anywhere whitespace-normal">{reportData.summaryImpression}</p>
        </Section>

        {/* Footer Note */}
        <div className="pt-6 border-t-2 border-primary/20">
          <p className="text-sm text-muted-foreground text-center font-medium">
            All findings should be reviewed by qualified medical professionals.
          </p>
        </div>
      </Card>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-gradient-to-br from-primary/10 to-secondary/5 p-6 rounded-xl border-2 border-primary/20 hover:border-primary/40 transition-smooth shadow-md hover:shadow-lg">
    <p className="text-sm text-muted-foreground font-medium mb-2">{label}</p>
    <p className="font-bold text-foreground text-lg">{value}</p>
  </div>
);

const Section = ({ title, icon, children, highlight }: any) => (
  <div className={`space-y-4 ${highlight ? 'bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/5 -mx-4 p-6 rounded-xl border-l-4 border-primary shadow-md' : 'bg-muted/20 -mx-4 p-6 rounded-xl border-l-4 border-muted'}`}>
    <div className="flex items-center gap-3">
      <div className={`${highlight ? 'bg-primary/20' : 'bg-muted'} p-2 rounded-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
    </div>
    <div className="pl-4">
      {children}
    </div>
  </div>
);

export default ReportView;
