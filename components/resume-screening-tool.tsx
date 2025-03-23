"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { processResumes } from "@/lib/resume-processor";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FileUploader } from "./file-uploader";
import { ResumeResults } from "./resume-results";

export type Resume = {
  id: string;
  name: string;
  content: string;
  file: File;
  score?: number;
  matchDetails?: {
    skills: string[];
    experience: string;
    education: string;
    overallFit: string;
  };
};

export function ResumeScreeningTool() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [rankedResumes, setRankedResumes] = useState<Resume[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("upload");

  const handleFileUpload = (files: File[]) => {
    const newResumes = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      name: file.name,
      content: "",
      file,
    }));

    setResumes((prev) => [...prev, ...newResumes]);

    // Extract text content from files
    newResumes.forEach((resume) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const simulatedContent = `Resume content for ${resume.name}. 
        This would contain the actual text extracted from the file.`;

          setResumes((prev) => prev.map((r) => (r.id === resume.id ? { ...r, content: simulatedContent } : r)));
        }
      };

      const fileExtension = resume.file.name.split(".").pop()?.toLowerCase();
      if (fileExtension === "txt") {
        reader.readAsText(resume.file);
      } else {
        reader.readAsArrayBuffer(resume.file);
      }
    });
  };

  const handleRemoveResume = (id: string) => {
    setResumes((prev) => prev.filter((resume) => resume.id !== id));
  };

  const handleProcessResumes = async () => {
    if (resumes.length === 0 || !jobDescription.trim()) return;

    setIsProcessing(true);

    try {
      const results = await processResumes(resumes, jobDescription);
      setRankedResumes(results);
      setActiveTab("results");
    } catch (error) {
      console.error("Error processing resumes:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-8">
        <TabsTrigger value="upload">Upload & Configure</TabsTrigger>
        <TabsTrigger value="results" disabled={rankedResumes.length === 0}>
          Results
        </TabsTrigger>
      </TabsList>

      <TabsContent value="upload" className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <Textarea
              placeholder="Paste the job description here..."
              className="min-h-[200px] mb-4"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Upload Resumes</h2>
            <FileUploader
              onFilesUploadedAction={handleFileUpload} // ✅ Updated prop name
              acceptedFileTypes=".pdf,.doc,.docx,.txt,.rtf"
              maxFiles={10}
            />

            {resumes.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Uploaded Resumes ({resumes.length})</h3>
                <ul className="space-y-2">
                  {resumes.map((resume) => (
                    <li key={resume.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                      <span className="truncate max-w-[80%]">{resume.name}</span>
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveResume(resume.id)}>
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6">
              <Button
                onClick={handleProcessResumes}
                disabled={resumes.length === 0 || !jobDescription.trim() || isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Resumes...
                  </>
                ) : (
                  "Analyze and Rank Resumes"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="results">
        <ResumeResults resumes={rankedResumes} />
      </TabsContent>
    </Tabs>
  );
}
