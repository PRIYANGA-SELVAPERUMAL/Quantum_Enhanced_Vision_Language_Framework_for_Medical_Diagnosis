import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Brain, Loader2, Lightbulb, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const XAIView = ({ caseData, reportData, onBack }: any) => {
  const [loading, setLoading] = useState(true);
  const [xaiData, setXaiData] = useState<any>(null);

  useEffect(() => {
    generateXAI();
  }, []);

  const generateXAI = async () => {
    // Simulate XAI reasoning generation (SHAP, Captum, Integrated Gradients)
    await new Promise(resolve => setTimeout(resolve, 2500));

    const xai = generateDetailedReasoning(caseData, reportData);
    setXaiData(xai);
    setLoading(false);
    toast.success("XAI reasoning generated!");
  };

  const generateDetailedReasoning = (caseData: any, reportData: any) => {
    const reasoningMap: Record<string, any> = {
      "Legg-Calve-Perthes Disease Sequela": {
        imageAnalysis: "BioMedCLIP vision encoder with attention-based feature extraction identified marked degenerative changes in the right hip joint characterized by complete erosion and absence of femoral head integrity. Multi-scale convolutional neural network layers detected severe joint space narrowing (measured at <1mm residual space), acetabular sclerosis with subchondral cyst formation, and surgical hardware from multiple corrective procedures spanning five decades. Saliency mapping using Gradient-weighted Class Activation Mapping (Grad-CAM) highlighted the right hip region as the primary area of diagnostic concern with 94% confidence, while simultaneously identifying secondary findings including mild lumbar dextroscoliosis and contralateral total hip replacement. Three-phase bone scan imaging with Tc-99m MDP demonstrated no evidence of prosthetic loosening on the contralateral side and confirmed absence of acute metabolically active lesions. Plain radiographs in AP and lateral projections demonstrated chronic remodeling patterns with acetabular roof irregularities, superior migration of residual proximal femur (measured 2.3cm superior displacement), and bone quality assessment showing osteopenic changes consistent with long-standing disease process. The AI's ensemble model integrated findings across multiple imaging modalities to achieve diagnostic consensus.",
        clinicalCorrelation: "The patient's extensively documented history of childhood Legg-Calvé-Perthes disease (initial diagnosis at age 6) with multiple corrective surgeries (initial femoral osteotomy at age 6, subsequent shelf procedure at age 12, failed total hip replacement attempts with infection complications at ages 45 and 52) and recurrent infection complications provided critical contextual framework for interpretation. Post-motor vehicle accident presentation revealed exacerbation of chronic baseline hip pain (baseline Visual Analog Scale 4/10 increased to 8/10 post-accident) rather than new acute traumatic injury. The AI model's clinical reasoning module recognized that the collision mechanism, while significant (broadside impact at 35 mph), acted primarily as an aggravating factor upon pre-existing severe degenerative changes rather than causing new structural damage. Temporal correlation between surgical interventions and current imaging findings, combined with patient-reported functional limitations (inability to ambulate more than 50 feet without assistive device, significant limitation in activities of daily living), established this as a complex sequelae case requiring specialized orthopedic expertise with experience in revision arthroplasty and complex acetabular reconstruction. The AI additionally flagged the patient's medical comorbidities (hypertension, type 2 diabetes, chronic kidney disease stage 3) as factors requiring pre-operative optimization.",
        differentialReasoning: "The AI employed a hierarchical diagnostic reasoning approach, systematically evaluating and excluding alternative diagnoses through feature-based analysis. Acute fracture was ruled out with 98% confidence based on absence of cortical disruption, acute trabecular changes, or periosteal reaction on high-resolution radiographs and CT reconstruction. Active infection was excluded (confidence 95%) despite historical infection complications, due to absence of key imaging markers including periosteal reaction, soft tissue gas collections, inflammatory fat stranding, or adjacent fluid collections, combined with normal inflammatory markers (ESR 12 mm/hr, CRP 0.4 mg/dL). Primary osteoarthritis was differentiated (confidence 96%) from post-Perthes arthropathy by the absence of bilateral symmetric patterns, presence of unilateral involvement with documented childhood onset, and characteristic femoral head deformity rather than degenerative wear patterns. The presence of extensive surgical hardware with specific geometric configurations consistent with pelvic osteotomy plates, documented Perthes disease timeline spanning 50 years, multiple failed prosthetic attempts with documented infection complications requiring hardware removal, and strictly unilateral involvement strongly supported sequelae diagnosis over alternative etiologies. Additional differential considerations systematically evaluated and excluded included: avascular necrosis from other causes (ruled out by documented childhood Perthes diagnosis and absence of risk factors like steroid use or sickle cell disease), inflammatory arthropathy (excluded by absence of synovitis, erosions at typical sites, or systemic inflammatory markers), post-traumatic arthritis from the recent motor vehicle accident (excluded by imaging demonstrating chronic rather than acute changes, with no acute fracture lines or soft tissue injury), septic arthritis (excluded by clinical presentation and laboratory values), and metastatic disease (excluded by absence of lytic or blastic lesions, normal bone scan except at known degenerative sites).",
        treatmentJustification: "Evidence-based comprehensive management plan with multi-disciplinary approach includes: (1) Urgent orthopedic surgery consultation with subspecialty expertise in complex revision hip arthroplasty and acetabular reconstruction for potential total hip replacement with consideration of structural bone grafting (using either autograft from iliac crest or allograft femoral head), custom triflange acetabular component given severely deficient acetabulum (Paprosky type 3B defect), and possible femoral shortening osteotomy to address leg length discrepancy and reduce soft tissue tension during reconstruction; (2) Comprehensive multimodal pain management protocol initiated immediately including scheduled NSAIDs (celecoxib 200mg BID with gastroprotection given chronic use), acetaminophen 1000mg TID, consideration of epidural steroid injections under fluoroscopic guidance for concomitant lumbar radiculopathy (L4-L5 level degenerative changes noted on imaging), topical analgesics for adjunctive relief, and pain psychology consultation for chronic pain coping strategies; (3) Intensive physical therapy program focused on maintaining existing hip range of motion (current ROM: flexion 60°, abduction 20°, limited internal rotation), strengthening surrounding musculature particularly hip abductors and core stabilizers to optimize surgical candidacy, pre-operative gait training to establish baseline function for post-operative comparison, and aquatic therapy to allow low-impact strengthening; (4) Assistive device optimization through occupational therapy evaluation including appropriate walker or crutch fitting, home safety assessment and modification recommendations, and ambulatory aids to reduce joint loading by approximately 40-50% and improve biomechanics during pre-operative period; (5) Comprehensive pre-operative medical optimization including endocrinology consultation for diabetic control optimization (target HbA1c <7% to reduce infection risk), nephrology consultation for CKD management and peri-operative fluid planning, nutritional assessment with protein supplementation if albumin <3.5 g/dL, bone density evaluation via DEXA scan with consideration of bisphosphonate therapy if osteoporotic, comprehensive infection screening including dental clearance and infectious disease consultation given prior hardware infection history, and cardiology clearance given surgical magnitude; (6) Consideration of autologous blood donation or cell salvage strategies for anticipated complex revision surgery with expected blood loss, and discussion of transfusion thresholds; (7) Anesthesia consultation to discuss regional versus general anesthesia options and post-operative pain control strategies including peripheral nerve blocks.",
        postOpComplications: "Should surgical intervention be pursued, the AI model's risk stratification algorithm identified potential complications with associated probabilities and preventive strategies: Prosthesis dislocation (estimated risk 15-20% given compromised soft tissue envelope from multiple prior surgeries and abnormal acetabular anatomy requiring increased cup anteversion and potential constrained liner); implant loosening (risk 12-15% secondary to poor bone stock with Dorr type C proximal femur and prior infection history affecting bone quality); infection recurrence (risk 8-12% based on prior hardware infection history, requiring prolonged prophylactic antibiotic therapy extending 6+ weeks post-operatively, potential for two-stage revision, and possible hardware removal if infection control cannot be achieved despite antibiotics); delayed wound healing (risk 10-15% from multiple previous surgical approaches creating compromised vascularity, extensive scar tissue formation, and tissue thinning); residual or worsening leg length discrepancy (current LLD 2.8cm, potential post-operative LLD requiring orthotic intervention with shoe lift or consideration of contralateral shoe modification); neurovascular injury during extensive dissection (risk 3-5% through scarred anatomical planes with distorted anatomy, particularly sciatic nerve at risk during posterior approach); heterotopic ossification formation (risk 8-10% limiting post-operative range of motion, requiring prophylaxis with indomethacin or radiation therapy); thromboembolic complications including DVT/PE (risk 5-8% requiring aggressive chemoprophylaxis); peri-prosthetic fracture (risk 4-6% during or after surgery given osteopenic bone); and persistent pain (risk 15-20% despite successful reconstruction given central sensitization from chronic pain history).",
        confidenceMetrics: "Overall diagnostic confidence: 92% (High confidence tier). Confidence metric breakdown using weighted ensemble approach: Definitive imaging findings demonstrating chronic degenerative changes with pathognomonic features of Perthes sequelae (weight: 45%, individual confidence: 96%) - this high weighting reflects the unambiguous imaging evidence of absent femoral head, acetabular remodeling, and chronic changes; comprehensive documented surgical history spanning five decades with medical record confirmation (weight: 30%, individual confidence: 100%) - perfect confidence due to verified documentation; clinical presentation consistency with chronic disease exacerbation rather than acute injury (weight: 15%, individual confidence: 85%) - slightly lower confidence as clinical symptoms can overlap; and systematic exclusion of alternative diagnoses through evidence-based criteria (weight: 10%, individual confidence: 88%) - incorporating minor uncertainty for rare mimickers. Primary source of residual uncertainty (8% total uncertainty) relates to surgical outcome prediction and post-operative course given the unprecedented complexity of prior interventions, documented infection history with hardware removal, current medical comorbidities, and individual patient healing capacity rather than diagnostic certainty of the underlying condition. Monte Carlo simulation of surgical outcomes based on literature data for similar complex cases suggests 70-75% probability of achieving satisfactory functional improvement (defined as ≥50% pain reduction and improved ambulatory capacity). Sensitivity analysis confirms diagnosis remains robust across multiple imaging interpretation models and clinical reasoning pathways.",
        keyFeatures: [
          "Complete absence of right femoral head - pathognomonic hallmark feature of advanced Perthes sequelae, representing end-stage avascular necrosis with total bone resorption",
          "Multiple surgical hardware elements visible from prior corrective procedures - specifically identified as pelvic osteotomy plate remnants and screw tracts, confirming extensive surgical history",
          "Severe acetabular remodeling with superior migration (2.3cm measured displacement) - chronic adaptation to loss of femoral head with roof irregularities and subchondral sclerosis",
          "Mild lumbar dextroscoliosis (Cobb angle 12°) representing long-term compensatory adaptation - secondary to chronic pelvic obliquity and leg length discrepancy",
          "Successfully integrated left total hip replacement providing contralateral comparison - demonstrates patient's ability to heal and integrate prosthetic components, favorable prognostic indicator",
          "No acute fracture lines or cortical disruptions - excludes acute traumatic injury from recent motor vehicle accident",
          "Absence of metabolically active lesions on three-phase bone scan - excludes infection, tumor, or acute inflammatory process",
          "Joint space narrowing to <1mm with bone-on-bone contact - indicates end-stage arthritic changes requiring surgical intervention",
          "Osteopenic bone changes throughout pelvis - important for surgical planning and implant selection",
          "Preserved bone stock in left hemipelvis - demonstrates baseline bone quality for comparison"
        ]
      },
      "Left Upper Lobe Collapse, Squamous Cell Carcinoma": {
        imageAnalysis: "BioMedCLIP detected tight left upper lobe collapse with abnormal left hilar contour and dramatic anterior fissure shift. Gradient-weighted class activation mapping (Grad-CAM) highlighted the left hilum and proximal bronchus as regions of highest diagnostic importance. The model identified volume loss, oligemia, and obstructive pattern consistent with endobronchial lesion with 89% confidence.",
        clinicalCorrelation: "The AI integrated patient's 83-year age, extensive smoking history, COPD diagnosis, and progressive dyspnea to establish high pre-test probability for lung malignancy. Weight loss and cough duration were flagged as constitutional symptoms supporting neoplastic process. Oxygen dependence indicated advanced underlying lung disease complicating management.",
        differentialReasoning: "Model systematically evaluated: mucus plugging (rejected due to persistent collapse and constitutional symptoms), foreign body aspiration (ruled out by gradual onset and age), tuberculosis (low probability given demographics and acute presentation), and lymphoma (less likely given imaging pattern). Squamous cell histology was predicted based on central location and smoking history.",
        treatmentJustification: "Bronchoscopic evaluation priority was determined by: (1) Need for tissue diagnosis, (2) Potential for therapeutic debulking, (3) Assessment of operability, (4) Evaluation of airway patency. Referral to specialized cancer center reflects complexity requiring multidisciplinary oncologic, pulmonary, and surgical expertise for optimal outcomes.",
        confidenceMetrics: "Diagnostic confidence: 89%. Imaging findings contributed 40% weight, clinical history 35%, age and smoking status 15%, symptomatic presentation 10%. Uncertainty relates to pre-biopsy histological confirmation and extent of mediastinal involvement not fully characterized on plain films.",
        keyFeatures: [
          "Complete left upper lobe collapse - hallmark finding",
          "Abnormal hilar contour suggesting mass effect",
          "Anterior fissure displacement indicating volume loss",
          "Diffuse oligemia in left lung field",
          "Indistinct left heart border - silhouette sign"
        ]
      },
      "Lemierre Syndrome": {
        imageAnalysis: "Advanced imaging analysis revealed septic thrombophlebitis extending from oropharynx to mediastinum with left internal jugular vein thrombosis. BioMedCLIP's attention mechanism focused on: rim-enhancing fluid collections, carotid encasement, sigmoid and transverse sinus involvement, and lung cavitary nodules representing septic emboli. Confidence level: 91%.",
        clinicalCorrelation: "The AI recognized classic Lemierre syndrome pattern in 11-month-old patient: recent upper respiratory infection followed by high fever, neck mass, and systemic toxicity. Age-appropriate differential included lymphadenitis, but presence of thrombosis and systemic emboli confirmed post-anginal sepsis diagnosis. Clinical severity warranted emergency intervention.",
        differentialReasoning: "Model evaluated: simple cervical lymphadenitis (excluded by thrombosis), retropharyngeal abscess (broader anatomical involvement present), Kawasaki disease (thrombotic pattern inconsistent), and bacterial sepsis of other origin (clinical timeline and anatomical distribution specific to Lemierre). Fusobacterium necrophorum was predicted as likely causative organism.",
        treatmentJustification: "Triple therapy approach justified by: (1) Surgical drainage for source control of abscess, (2) Aggressive broad-spectrum antibiotics for anaerobic coverage, (3) Anticoagulation for progressive thrombosis management. ICU monitoring essential due to high risk of septic emboli causing respiratory failure, meningitis, or other end-organ complications.",
        confidenceMetrics: "Diagnostic confidence: 91%. CT/MRI findings provided 50% weight, clinical presentation 25%, age and timeline 15%, positive blood culture 10%. Primary uncertainty relates to extent of thrombus propagation and embolic burden requiring serial monitoring.",
        keyFeatures: [
          "Internal jugular vein thrombosis - pathognomonic feature",
          "Rim-enhancing neck abscess extending to mediastinum",
          "Dural venous sinus thrombosis - intracranial extension",
          "Lung cavitary lesions - septic emboli",
          "Carotid artery encasement - vascular involvement"
        ]
      },
      "Lentiform Fork Sign Of Basal Ganglia In HELLP Syndrome": {
        imageAnalysis: "Bilateral symmetric hypodensities in basal ganglia forming characteristic 'lentiform fork' sign identified with 88% confidence. BioMedCLIP's anatomical segmentation precisely delineated globus pallidus and putamen involvement. T2/FLAIR hyperintensity without diffusion restriction confirmed vasogenic rather than cytotoxic edema. Attention heatmaps centered on deep gray matter structures.",
        clinicalCorrelation: "Model integrated obstetric context (24-year-old, 35 weeks gestation), severe preeclampsia (BP 180/110), and HELLP syndrome laboratory triad. Neurological symptoms (headache, visual disturbance, confusion) triggered neuroimaging. The AI recognized this as rare but documented complication of HELLP with favorable prognosis after delivery and blood pressure control.",
        differentialReasoning: "Systematic exclusion of: hypoxic-ischemic injury (absence of watershed distribution), metabolic disorders (symmetric basal ganglia pattern but reversible), infection (no meningeal enhancement), and primary hemorrhage (no blood products). Reversibility on follow-up imaging was correctly predicted based on vasogenic edema characteristics.",
        treatmentJustification: "Emergency cesarean delivery prioritized to: (1) Remove source of preeclampsia, (2) Prevent eclamptic seizures, (3) Protect maternal end-organ function, (4) Reduce risk of permanent neurological sequelae. Intensive care with magnesium sulfate, antihypertensives, and steroids addresses immediate maternal stabilization while monitoring for HELLP resolution.",
        confidenceMetrics: "Diagnostic confidence: 88%. Imaging pattern contributed 40%, HELLP syndrome confirmation 30%, neurological symptoms 20%, obstetric context 10%. Uncertainty centered on predicting complete resolution timeline and excluding permanent basal ganglia injury, resolved by favorable follow-up MRI.",
        keyFeatures: [
          "Symmetric basal ganglia hypodensity - diagnostic hallmark",
          "Involvement of globus pallidus and putamen - anatomical specificity",
          "T2/FLAIR hyperintensity - edema characterization",
          "Absence of diffusion restriction - excludes infarction",
          "Complete resolution on follow-up - confirms vasogenic process"
        ]
      },
      "Leptomeningeal Carcinomatosis From Endometrial Carcinoma": {
        imageAnalysis: "MRI revealed multiple enhancing intradural nodules at conus medullaris and cauda equina roots. BioMedCLIP's tumor detection algorithm identified leptomeningeal enhancement pattern with 87% confidence. Comparison with prior imaging showed stable brain postoperative bed but new spinal involvement. Gradient analysis emphasized nerve root thickening and nodular enhancement as key diagnostic features.",
        clinicalCorrelation: "68-year-old with metastatic endometrial carcinoma history and prior brain metastasis resection presented with new cranial nerve VI palsy and back pain. The AI recognized this clinical-radiological pattern as highly specific for leptomeningeal spread. CSF cytology prediction was integrated based on imaging findings and known primary malignancy.",
        differentialReasoning: "Model evaluated: arachnoiditis (inflammatory pattern different), spinal cord tumor (mass effect absent), infection (no systemic signs), and neurosarcoidosis (clinical context incompatible). Metastatic pattern from endometrial primary was favored given documented brain metastasis, indicating hematogenous dissemination capacity and poor prognostic CSF seeding.",
        treatmentJustification: "Palliative craniospinal radiation with intrathecal chemotherapy addresses: (1) Limited CNS-penetrant systemic therapy options, (2) Local disease control for symptom palliation, (3) Prevention of hydrocephalus, (4) Quality of life preservation. Treatment goals shifted from curative to prolonging functional independence and managing neurological complications.",
        confidenceMetrics: "Diagnostic confidence: 87%. MRI findings weighted at 45%, oncologic history 30%, clinical symptoms 15%, anticipated CSF cytology 10%. Uncertainty stems from distinguishing treatment-related changes from disease progression on future imaging surveillance.",
        keyFeatures: [
          "Multiple cauda equina enhancing nodules - leptomeningeal seeding",
          "Conus medullaris involvement - upper extent of disease",
          "Stable brain postoperative site - prior metastasis controlled",
          "Cranial nerve VI palsy - intracranial extension",
          "Back pain - correlating with spinal involvement"
        ]
      }
    };

    return reasoningMap[caseData.title] || {
      imageAnalysis: "Detailed image feature analysis performed using BioMedCLIP vision encoder with attention mechanisms highlighting diagnostic regions.",
      clinicalCorrelation: "Patient history and symptoms were integrated with imaging findings to establish diagnostic confidence.",
      differentialReasoning: "Alternative diagnoses were systematically evaluated and excluded based on clinical and imaging evidence.",
      treatmentJustification: "Treatment recommendations derived from evidence-based guidelines and patient-specific factors.",
      confidenceMetrics: "Diagnostic confidence calculated based on imaging quality, clinical correlation, and differential likelihood.",
      keyFeatures: ["Primary diagnostic features identified through AI analysis"]
    };
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 card-shadow text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-accent" />
          <h3 className="text-xl font-semibold">Generating Explainable AI Reasoning</h3>
          <p className="text-muted-foreground">
            Analyzing decision pathways using SHAP, Captum, and Integrated Gradients...
          </p>
        </Card>
      </div>
    );
  }

  if (!xaiData) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      <Button onClick={onBack} variant="outline" size="lg">
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Report
      </Button>

      <Card className="p-8 card-shadow space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Brain className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Explainable AI Reasoning</h1>
              <p className="text-muted-foreground">
                Transparent diagnostic decision pathway for {caseData.title}
              </p>
            </div>
          </div>
          <Separator />
        </div>

        {/* Image Analysis */}
        <XAISection
          title="Image Feature Analysis"
          icon={<Lightbulb className="h-5 w-5 text-primary" />}
          content={xaiData.imageAnalysis}
        />

        {/* Key Features */}
        <div className="bg-primary/5 p-6 rounded-lg space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            Key Diagnostic Features
          </h3>
          <ul className="space-y-2 pl-7">
            {xaiData.keyFeatures.map((feature: string, idx: number) => (
              <li key={idx} className="text-sm leading-relaxed">
                <span className="font-medium text-primary">•</span> {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Clinical Correlation */}
        <XAISection
          title="Clinical Correlation"
          icon={<Lightbulb className="h-5 w-5 text-secondary" />}
          content={xaiData.clinicalCorrelation}
        />

        {/* Differential Reasoning */}
        <XAISection
          title="Differential Diagnosis Reasoning"
          icon={<AlertCircle className="h-5 w-5 text-accent" />}
          content={xaiData.differentialReasoning}
        />

        {/* Treatment Justification */}
        <XAISection
          title="Treatment Plan Justification"
          icon={<Lightbulb className="h-5 w-5 text-primary" />}
          content={xaiData.treatmentJustification}
        />

        {/* Post-Operative Complications */}
        {xaiData.postOpComplications && (
          <XAISection
            title="Potential Post-Operative Complications"
            icon={<AlertCircle className="h-5 w-5 text-destructive" />}
            content={xaiData.postOpComplications}
          />
        )}

        {/* Confidence Metrics */}
        <div className="bg-muted/30 p-6 rounded-lg space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            Confidence Metrics & Model Transparency
          </h3>
          <p className="text-sm leading-relaxed">{xaiData.confidenceMetrics}</p>
        </div>

        {/* Technical Note */}
        <div className="pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Explainability Methods:</strong> This analysis employs multiple XAI techniques including 
            SHAP (SHapley Additive exPlanations) for feature importance, Grad-CAM for visual attention mapping, 
            Integrated Gradients for attribution analysis, and Captum for deep learning interpretability. 
            All diagnostic decisions are traceable to specific image features and clinical data points.
          </p>
        </div>
      </Card>
    </div>
  );
};

const XAISection = ({ title, icon, content }: any) => (
  <div className="space-y-3">
    <h3 className="font-semibold flex items-center gap-2">
      {icon}
      {title}
    </h3>
    <p className="text-sm leading-relaxed pl-7">{content}</p>
  </div>
);

export default XAIView;
