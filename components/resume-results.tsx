"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { FileTypeIcon } from "./file-type-icon"
import type { Resume } from "./resume-screening-tool"

interface ResumeResultsProps {
  resumes: Resume[]
}

export function ResumeResults({ resumes }: ResumeResultsProps) {
  const [selectedResume, setSelectedResume] = useState<Resume | null>(resumes.length > 0 ? resumes[0] : null)

  if (resumes.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No results available. Please upload and process resumes first.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-xl">Candidate Rankings</CardTitle>
          <CardDescription>Ranked by match score to job requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resumes.map((resume, index) => {
              const isSelected = selectedResume?.id === resume.id

              return (
                <div
                  key={resume.id}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                  }`}
                  onClick={() => setSelectedResume(resume)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2 max-w-[75%]">
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-full font-semibold text-sm flex-shrink-0 ${
                          isSelected ? "bg-white text-primary" : "bg-primary/10 text-primary"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex items-center overflow-hidden">
                        <FileTypeIcon
                          filename={resume.name}
                          className={`mr-1 flex-shrink-0 ${isSelected ? "text-primary-foreground" : "text-muted-foreground"}`}
                        />
                        <h3 className="font-medium truncate">{resume.name.split(".").slice(0, -1).join(".")}</h3>
                      </div>
                    </div>
                    <Badge
                      variant={isSelected ? "secondary" : "secondary"}
                      className={`text-sm font-bold min-w-[48px] text-center ${
                        isSelected ? "bg-white text-primary" : ""
                      }`}
                    >
                      {resume.score}%
                    </Badge>
                  </div>

                  <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary/30">
                    <div
                      className={`h-full absolute left-0 top-0 rounded-full transition-all ${
                        isSelected ? "bg-white" : "bg-primary"
                      }`}
                      style={{ width: `${resume.score}%` }}
                    ></div>
                  </div>

                  {index === 0 && (
                    <div className="mt-2 text-xs flex items-center">
                      <span
                        className={`inline-flex items-center ${
                          isSelected ? "text-primary-foreground" : "text-amber-500 dark:text-amber-400"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <circle cx="12" cy="8" r="6" />
                          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                        </svg>
                        Top Match
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>
                <div className="flex items-center">
                  <FileTypeIcon filename={selectedResume?.name || ""} className="mr-2" />
                  {selectedResume?.name.split(".").slice(0, -1).join(".")}
                  {resumes.findIndex((r) => r.id === selectedResume?.id) === 0 && (
                    <span className="ml-2 inline-flex items-center text-amber-500 dark:text-amber-400 text-sm font-normal">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="None"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                      Top Match
                    </span>
                  )}
                </div>
              </CardTitle>
              <CardDescription className="flex items-center">
                <span className="font-medium text-base">Match score: {selectedResume?.score}%</span>
                <span className="ml-2 text-xs">
                  (Ranked #{resumes.findIndex((r) => r.id === selectedResume?.id) + 1} of {resumes.length})
                </span>
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Download Resume
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {selectedResume ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-1">Skills Match</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedResume.matchDetails?.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <h3 className="font-medium mb-1">Experience</h3>
                  <p className="text-sm text-muted-foreground">{selectedResume.matchDetails?.experience}</p>
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="resume-content">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      Resume Content
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="whitespace-pre-wrap bg-muted p-4 rounded-lg text-sm">{selectedResume.content}</div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ai-analysis">
                  <AccordionTrigger>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      AI Analysis
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-1">Skills Assessment</h4>
                        <p className="text-sm text-muted-foreground">
                          Candidate has {selectedResume.matchDetails?.skills.length} relevant skills that match the job
                          requirements.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">Experience Assessment</h4>
                        <p className="text-sm text-muted-foreground">{selectedResume.matchDetails?.experience}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">Education Assessment</h4>
                        <p className="text-sm text-muted-foreground">{selectedResume.matchDetails?.education}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">Overall Fit</h4>
                        <p className="text-sm text-muted-foreground">{selectedResume.matchDetails?.overallFit}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Select a candidate to view details</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

