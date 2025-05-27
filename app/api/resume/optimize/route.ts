import { NextResponse } from "next/server";
import { z } from "zod";
import { chatLLM } from "@/lib/llmClient";
import { Profile } from "@/lib/types";

// Helper function to extract skills from text
function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript', 'HTML', 'CSS',
    'SQL', 'Git', 'AWS', 'Docker', 'Kubernetes', 'MongoDB', 'PostgreSQL',
    'Project Management', 'Leadership', 'Communication', 'Problem Solving',
    'Marketing', 'Sales', 'Analytics', 'Strategy', 'Brand Management',
    'Digital Marketing', 'Social Media', 'Content Marketing', 'SEO', 'SEM',
    'Data Analysis', 'Machine Learning', 'AI', 'Agile', 'Scrum'
  ];
  
  const foundSkills: string[] = [];
  const lowerText = text.toLowerCase();
  
  commonSkills.forEach(skill => {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills;
}

// Input validation schema
const Body = z.object({
  profile: z.custom<Profile>(),
  jobDescription: z.string().min(1),
  targetRole: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { profile, jobDescription, targetRole } = Body.parse(body);

    // Create optimization prompt
    const prompt = `You are a professional resume optimization expert. Analyze the job description and user's profile to provide specific ATS optimization recommendations.

## User Profile Summary:
- Name: ${profile.name}
- Title: ${profile.headline}
- Skills: ${profile.skills.join(', ')}
- Experience: ${profile.experiences.length} roles
- Education: ${profile.education.length} degrees

## Job Description:
${jobDescription}

${targetRole ? `## Target Role: ${targetRole}` : ''}

## Analysis Required:
1. Extract key skills and requirements from the job description
2. Compare with user's current skills and experience
3. Calculate match percentage
4. Identify missing keywords
5. Provide specific recommendations

## Response Format:
Return ONLY a valid JSON object with this exact structure:

{
  "keywordAnalysis": {
    "requiredSkills": ["skill1", "skill2", "skill3"],
    "missingSkills": ["missing1", "missing2"],
    "matchingSkills": ["match1", "match2"],
    "matchPercentage": 75
  },
  "recommendations": {
    "summary": "Brief summary of key improvements needed",
    "skills": ["Add Python programming", "Emphasize project management"],
    "experience": ["Add metrics to achievements", "Include relevant keywords"],
    "education": ["Highlight relevant coursework"]
  },
  "atsOptimization": {
    "tips": ["Use standard section headers", "Include keywords naturally", "Quantify achievements"],
    "warnings": ["Avoid graphics in ATS systems", "Use standard fonts"]
  },
  "priorityActions": [
    {
      "action": "Add missing technical skills",
      "impact": "high",
      "reason": "Job requires specific technologies not mentioned in resume"
    }
  ]
}

Ensure the JSON is valid and complete. Do not include any text outside the JSON object.`;

    // Call LLM for optimization analysis
    const response = await chatLLM(
      "groq",
      "llama3-70b-8192", // Use the more powerful model for analysis
      [
        { role: "user", content: prompt }
      ]
    );

    if (!response?.content) {
      throw new Error("No content in LLM response");
    }

    // Try to parse JSON response with better error handling
    let analysis;
    try {
      // Clean the response content
      let jsonContent = response.content.trim();
      
      // Remove markdown code blocks if present
      const jsonMatch = jsonContent.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1].trim();
      }
      
      // Remove any leading/trailing text that's not JSON
      const jsonStart = jsonContent.indexOf('{');
      const jsonEnd = jsonContent.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonContent = jsonContent.substring(jsonStart, jsonEnd + 1);
      }
      
      analysis = JSON.parse(jsonContent);
      
      // Validate the structure and provide defaults
      analysis = {
        keywordAnalysis: {
          requiredSkills: analysis.keywordAnalysis?.requiredSkills || [],
          missingSkills: analysis.keywordAnalysis?.missingSkills || [],
          matchingSkills: analysis.keywordAnalysis?.matchingSkills || [],
          matchPercentage: analysis.keywordAnalysis?.matchPercentage || 0
        },
        recommendations: {
          summary: analysis.recommendations?.summary || "Analysis completed",
          skills: analysis.recommendations?.skills || [],
          experience: analysis.recommendations?.experience || [],
          education: analysis.recommendations?.education || []
        },
        atsOptimization: {
          tips: analysis.atsOptimization?.tips || ["Review job requirements carefully"],
          warnings: analysis.atsOptimization?.warnings || []
        },
        priorityActions: analysis.priorityActions || []
      };
      
    } catch (parseError) {
      console.error("JSON parsing failed:", parseError);
      console.log("Raw LLM response:", response.content);
      
      // Enhanced fallback: try to extract information from text
      const content = response.content;
      const skillsInProfile = profile.skills || [];
      const skillsInJob = extractSkillsFromText(jobDescription);
      
      const matchingSkills = skillsInProfile.filter((skill: string) => 
        skillsInJob.some((jobSkill: string) => 
          skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      );
      
      const missingSkills = skillsInJob.filter((jobSkill: string) =>
        !skillsInProfile.some((skill: string) =>
          skill.toLowerCase().includes(jobSkill.toLowerCase()) ||
          jobSkill.toLowerCase().includes(skill.toLowerCase())
        )
      ).slice(0, 10); // Limit to top 10
      
      const matchPercentage = skillsInJob.length > 0 
        ? Math.round((matchingSkills.length / skillsInJob.length) * 100)
        : 0;
      
      analysis = {
        keywordAnalysis: {
          requiredSkills: skillsInJob.slice(0, 15),
          missingSkills,
          matchingSkills,
          matchPercentage
        },
        recommendations: {
          summary: "Add missing keywords and optimize for ATS compatibility",
          skills: missingSkills.slice(0, 5).map((skill: string) => `Add ${skill} to skills section`),
          experience: ["Quantify achievements with numbers", "Include relevant keywords naturally"],
          education: ["Highlight relevant coursework and certifications"]
        },
        atsOptimization: {
          tips: [
            "Use standard section headers (Experience, Education, Skills)",
            "Include keywords from job description naturally",
            "Quantify achievements with specific numbers",
            "Use bullet points for easy scanning"
          ],
          warnings: [
            "Avoid graphics and images in ATS systems",
            "Use standard fonts (Arial, Calibri, Times New Roman)",
            "Don't use tables or complex formatting"
          ]
        },
        priorityActions: [
          {
            action: "Add missing technical skills",
            impact: "high" as const,
            reason: `${missingSkills.length} required skills are missing from your resume`
          },
          {
            action: "Quantify achievements",
            impact: "medium" as const,
            reason: "Numbers and metrics make achievements more impactful"
          }
        ],
        rawAnalysis: content
      };
    }

    return NextResponse.json({ 
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Resume optimization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 