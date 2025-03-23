import { ResumeScreeningTool } from "@/components/resume-screening-tool"

export default function Home() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-4xl font-bold mb-2">AI Resume Screener</h1>
      <p className="text-muted-foreground mb-8">
        Upload resumes and job descriptions to get AI-powered candidate rankings
      </p>
      <ResumeScreeningTool />
    </main>
  )
}

