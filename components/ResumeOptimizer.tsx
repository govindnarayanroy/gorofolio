"use client";

import { useState } from "react";
import { Profile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb,
  Search,
  BarChart3,
  Zap
} from "lucide-react";

interface OptimizationAnalysis {
  keywordAnalysis: {
    requiredSkills: string[];
    missingSkills: string[];
    matchingSkills: string[];
    matchPercentage: number;
  };
  recommendations: {
    summary: string;
    skills: string[];
    experience: string[];
    education: string[];
  };
  atsOptimization: {
    tips: string[];
    warnings: string[];
  };
  priorityActions: Array<{
    action: string;
    impact: 'high' | 'medium' | 'low';
    reason: string;
  }>;
  rawAnalysis?: string;
}

interface ResumeOptimizerProps {
  profile: Profile;
}

export function ResumeOptimizer({ profile }: ResumeOptimizerProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [analysis, setAnalysis] = useState<OptimizationAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      setError("Please enter a job description");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/resume/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile,
          jobDescription,
          targetRole: targetRole || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to analyze resume");
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-500/20 text-red-700 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-700 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Resume Optimization
        </CardTitle>
        <p className="text-sm text-gray-600">
          Analyze your resume against job descriptions for better ATS compatibility
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label htmlFor="targetRole" className="block text-sm font-medium text-gray-700 mb-2">
              Target Role (Optional)
            </label>
            <input
              id="targetRole"
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Job Description
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={6}
              placeholder="Paste the job description here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            onClick={handleOptimize}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Analyze Resume
              </div>
            )}
          </Button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6 pt-6 border-t border-gray-200">
            {/* Match Score */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <span className="text-2xl font-bold text-white">
                  {analysis.keywordAnalysis.matchPercentage}%
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Match Score</h3>
              <p className="text-sm text-gray-600">
                Your resume matches {analysis.keywordAnalysis.matchPercentage}% of the job requirements
              </p>
            </div>

            {/* Keyword Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-700">
                  {analysis.keywordAnalysis.matchingSkills.length}
                </div>
                <div className="text-sm text-green-600">Matching Skills</div>
              </div>
              
              <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-700">
                  {analysis.keywordAnalysis.missingSkills.length}
                </div>
                <div className="text-sm text-red-600">Missing Skills</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-700">
                  {analysis.keywordAnalysis.requiredSkills.length}
                </div>
                <div className="text-sm text-blue-600">Required Skills</div>
              </div>
            </div>

            {/* Priority Actions */}
            {analysis.priorityActions.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Priority Actions
                </h4>
                <div className="space-y-3">
                  {analysis.priorityActions.map((action, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-medium text-gray-900">{action.action}</span>
                        <Badge className={getImpactColor(action.impact)}>
                          {action.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{action.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Skills */}
            {analysis.keywordAnalysis.missingSkills.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-500" />
                  Missing Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordAnalysis.missingSkills.map((skill, index) => (
                    <Badge key={index} variant="destructive" className="bg-red-100 text-red-700 border-red-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Matching Skills */}
            {analysis.keywordAnalysis.matchingSkills.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Matching Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.keywordAnalysis.matchingSkills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* ATS Tips */}
            {analysis.atsOptimization.tips.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-500" />
                  ATS Optimization Tips
                </h4>
                <ul className="space-y-2">
                  {analysis.atsOptimization.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Detailed Recommendations */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Detailed Recommendations</h4>
              
              {analysis.recommendations.skills.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Skills Section</h5>
                  <ul className="space-y-1">
                    {analysis.recommendations.skills.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.recommendations.experience.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Experience Section</h5>
                  <ul className="space-y-1">
                    {analysis.recommendations.experience.map((rec, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 