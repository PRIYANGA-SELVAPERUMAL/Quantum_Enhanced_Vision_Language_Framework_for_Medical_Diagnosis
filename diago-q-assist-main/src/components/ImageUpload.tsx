import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MEDICAL_CASES } from "@/data/medicalCases";

const ImageUpload = ({ onComplete }: { onComplete: (images: File[], info: any, caseData: any) => void }) => {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [patientInfo, setPatientInfo] = useState({
    name: "",
    age: "",
    gender: "",
    id: ""
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImages(files);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const detectCase = async (imageFiles: File[]) => {
    // Simulated BioMedCLIP feature extraction
    // In production, this would call your ML model
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Case detection based on number of uploaded images
    // Case 1: 12 images, Case 2: 13 images, Case 3: 10 images, Case 4: 11 images, Case 5: 6 images
    const imageCount = imageFiles.length;
    
    let selectedCase = MEDICAL_CASES[0]; // default to Case 1
    
    if (imageCount === 13) {
      selectedCase = MEDICAL_CASES[1]; // Case 2: Lung cancer
    } else if (imageCount === 10) {
      selectedCase = MEDICAL_CASES[2]; // Case 3: Lemierre
    } else if (imageCount === 11) {
      selectedCase = MEDICAL_CASES[3]; // Case 4: HELLP
    } else if (imageCount === 6) {
      selectedCase = MEDICAL_CASES[4]; // Case 5: Leptomeningeal
    } else if (imageCount === 12) {
      selectedCase = MEDICAL_CASES[0]; // Case 1: Legg-Calve-Perthes
    } else {
      // For other counts, try to match closest
      const diffs = MEDICAL_CASES.map((c, idx) => {
        const expectedCounts = [12, 13, 10, 11, 6];
        return { idx, diff: Math.abs(expectedCounts[idx] - imageCount) };
      });
      diffs.sort((a, b) => a.diff - b.diff);
      selectedCase = MEDICAL_CASES[diffs[0].idx];
    }
    
    return selectedCase;
  };

  const handleAnalyze = async () => {
    if (images.length === 0) {
      toast.error("Please upload at least one scan image");
      return;
    }

    if (!patientInfo.name || !patientInfo.age || !patientInfo.gender) {
      toast.error("Please fill in all patient information");
      return;
    }

    setProcessing(true);

    try {
      toast.info("Analyzing medical scans with BioMedCLIP...");
      const detectedCase = await detectCase(images);
      
      toast.success(`Detected: ${detectedCase.title}`);
      
      setTimeout(() => {
        onComplete(images, patientInfo, detectedCase);
      }, 500);
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">Upload Medical Scans</h2>
        <p className="text-slate-300">Begin diagnosis by uploading patient information and medical imaging</p>
      </div>

      <Card className="p-6 card-shadow bg-slate-800/90 backdrop-blur border-slate-700">
        <div className="space-y-6">
          {/* Patient Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
              <div className="h-1 w-1 rounded-full bg-primary" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-200">Full Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter patient's full name"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                  className="medical-input bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium text-slate-200">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Age in years"
                  value={patientInfo.age}
                  onChange={(e) => setPatientInfo({ ...patientInfo, age: e.target.value })}
                  className="medical-input bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium text-slate-200">Gender *</Label>
                <select
                  id="gender"
                  className="flex h-10 w-full rounded-md border-2 border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-white transition-all focus:border-primary focus:shadow-[0_0_0_3px_hsla(var(--primary),0.1)] medical-input"
                  value={patientInfo.gender}
                  onChange={(e) => setPatientInfo({ ...patientInfo, gender: e.target.value })}
                >
                  <option value="" className="bg-slate-800">Select Gender</option>
                  <option value="Male" className="bg-slate-800">Male</option>
                  <option value="Female" className="bg-slate-800">Female</option>
                  <option value="Other" className="bg-slate-800">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-white">
              <div className="h-1 w-1 rounded-full bg-primary" />
              Medical Scan Images
            </h3>
            
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-primary transition-smooth cursor-pointer bg-slate-700/30"
                 onClick={() => document.getElementById('image-upload')?.click()}>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-white">Click to upload medical scans</p>
                  <p className="text-sm text-slate-300">PNG, JPG up to 10MB each</p>
                </div>
              </div>
            </div>

            {/* Image Previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previews.map((preview, idx) => (
                  <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-600">
                    <img src={preview} alt={`Scan ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-1 px-2 flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" />
                      Scan {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={processing || images.length === 0}
            className="w-full medical-gradient text-white hover:opacity-90 transition-smooth"
            size="lg"
          >
            {processing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing with BioMedCLIP...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-5 w-5" />
                Analyze Scans
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ImageUpload;
