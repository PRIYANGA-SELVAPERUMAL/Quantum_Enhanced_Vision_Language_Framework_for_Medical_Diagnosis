import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const QuestionFlow = ({ caseData, patientInfo, onComplete }: any) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const questions = caseData.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // Auto-speak question when it changes
    speakQuestion(currentQuestion);
  }, [currentQuestionIndex]);

  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("Voice recognition not supported in this browser");
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      toast.info("Listening... Speak your answer");
    };

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setCurrentAnswer(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      toast.error("Voice recognition error. Please try again.");
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();

    // Auto-stop after 30 seconds
    setTimeout(() => {
      if (isRecording) {
        recognition.stop();
      }
    }, 30000);
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) {
      toast.error("Please provide an answer before continuing");
      return;
    }

    const newAnswers = { ...answers, [`q${currentQuestionIndex}`]: currentAnswer };
    setAnswers(newAnswers);
    setCurrentAnswer("");

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      toast.success("All questions completed! Generating report...");
      setTimeout(() => {
        onComplete(newAnswers);
      }, 1000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Detected Case Banner */}
      <Card className="p-6 medical-gradient text-white medical-glow">
        <div className="space-y-2">
          <p className="text-sm opacity-90">Detected Condition</p>
          <h2 className="text-2xl font-bold">{caseData.title}</h2>
          <p className="text-sm opacity-90">
            Based on BioMedCLIP analysis of {patientInfo.name}'s medical scans
          </p>
        </div>
      </Card>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-white">Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span className="text-slate-300">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-8 card-shadow space-y-6 bg-slate-800/90 backdrop-blur border-slate-700">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-3">
                Patient History Collection
              </div>
              <h3 className="text-xl font-semibold leading-relaxed text-white">
                {currentQuestion}
              </h3>
            </div>
            <Button
              onClick={() => speakQuestion(currentQuestion)}
              variant="outline"
              size="icon"
              disabled={isSpeaking}
              className="shrink-0 border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-white"
            >
              <Volume2 className={`h-4 w-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-200">Your Answer</label>
            <Button
              onClick={startVoiceRecording}
              variant="outline"
              size="sm"
              className={isRecording ? "border-red-500 text-red-500 bg-red-500/10" : "border-slate-600 bg-slate-700/50 hover:bg-slate-700 text-white"}
            >
              <Mic className={`h-4 w-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
              {isRecording ? "Recording..." : "Voice Input"}
            </Button>
          </div>
          
          <Textarea
            value={currentAnswer}
            onChange={(e) => setCurrentAnswer(e.target.value)}
            placeholder="Type your answer here or use voice input..."
            className="min-h-32 resize-none bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
          />
          
          <p className="text-xs text-slate-300">
            You can type your answer or click "Voice Input" to speak your response
          </p>
        </div>

        <Button
          onClick={handleNext}
          className="w-full medical-gradient text-white hover:opacity-90 transition-smooth"
          size="lg"
          disabled={!currentAnswer.trim()}
        >
          {currentQuestionIndex < questions.length - 1 ? (
            <>
              Next Question
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>
              Complete & Generate Report
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </Card>

      {/* Question Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {questions.map((_: any, idx: number) => (
          <div
            key={idx}
            className={`h-2 w-8 rounded-full transition-smooth ${
              idx < currentQuestionIndex ? 'bg-green-500' :
              idx === currentQuestionIndex ? 'bg-primary medical-glow' :
              'bg-slate-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionFlow;
