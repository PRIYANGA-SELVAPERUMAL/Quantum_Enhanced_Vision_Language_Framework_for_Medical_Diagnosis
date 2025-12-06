import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Stethoscope, Upload, MessageSquare, FileText, Brain, Download } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import QuestionFlow from "@/components/QuestionFlow";
import ReportView from "@/components/ReportView";
import XAIView from "@/components/XAIView";

type Step = "upload" | "questions" | "report" | "xai";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [patientInfo, setPatientInfo] = useState<any>(null);
  const [detectedCase, setDetectedCase] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [reportData, setReportData] = useState<any>(null);

  const handleUploadComplete = (images: File[], info: any, caseData: any) => {
    setUploadedImages(images);
    setPatientInfo(info);
    setDetectedCase(caseData);
    setCurrentStep("questions");
  };

  const handleQuestionsComplete = (questionAnswers: Record<string, string>) => {
    setAnswers(questionAnswers);
    setCurrentStep("report");
  };

  const handleShowXAI = () => {
    setCurrentStep("xai");
  };

  const handleBackToReport = () => {
    setCurrentStep("report");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-800/80 backdrop-blur-md sticky top-0 z-50 relative shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="medical-gradient p-2 rounded-lg shadow-lg medical-glow">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                  DiagnoQ
                </h1>
                <p className="text-xs text-slate-300">AI-Powered Medical Diagnostics</p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="hidden md:flex items-center gap-2">
              <StepIndicator icon={Upload} label="Upload" active={currentStep === "upload"} completed={currentStep !== "upload"} />
              <div className="w-8 h-0.5 bg-slate-600" />
              <StepIndicator icon={MessageSquare} label="Questions" active={currentStep === "questions"} completed={["report", "xai"].includes(currentStep)} />
              <div className="w-8 h-0.5 bg-slate-600" />
              <StepIndicator icon={FileText} label="Report" active={currentStep === "report"} completed={currentStep === "xai"} />
              <div className="w-8 h-0.5 bg-slate-600" />
              <StepIndicator icon={Brain} label="XAI" active={currentStep === "xai"} completed={false} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        {currentStep === "upload" && (
          <ImageUpload onComplete={handleUploadComplete} />
        )}
        
        {currentStep === "questions" && detectedCase && (
          <QuestionFlow 
            caseData={detectedCase}
            patientInfo={patientInfo}
            onComplete={handleQuestionsComplete}
          />
        )}

        {currentStep === "report" && (
          <ReportView
            caseData={detectedCase}
            patientInfo={patientInfo}
            answers={answers}
            uploadedImages={uploadedImages}
            onShowXAI={handleShowXAI}
            onReportGenerated={setReportData}
          />
        )}

        {currentStep === "xai" && reportData && (
          <XAIView
            caseData={detectedCase}
            reportData={reportData}
            onBack={handleBackToReport}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12 py-6 bg-slate-800/60 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 text-center text-sm text-slate-400">
          <p>DiagnoQ - Enhanced Vision Language Model Framework for Clinical Diagnosis</p>
          <p className="mt-1">Powered by BioMedCLIP, BioMistral-7B & LLaVA-Med</p>
        </div>
      </footer>
    </div>
  );
};

const StepIndicator = ({ icon: Icon, label, active, completed }: any) => (
  <div className="flex flex-col items-center gap-1">
    <div className={`p-2 rounded-lg transition-smooth ${
      active ? "medical-gradient text-white medical-glow" : 
      completed ? "bg-green-600 text-white" : 
      "bg-slate-700 text-slate-400"
    }`}>
      <Icon className="h-4 w-4" />
    </div>
    <span className={`text-xs font-medium ${active ? "text-white" : "text-slate-400"}`}>
      {label}
    </span>
  </div>
);

export default Index;
