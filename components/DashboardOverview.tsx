"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Upload, 
  Edit3, 
  Eye, 
  Share2, 
  Download, 
  MessageSquare, 
  Mic,
  CheckCircle,
  Clock,
  ArrowRight,
  User,
  Briefcase,
  FileText,
  Trophy,
  Target,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { Profile } from '@/lib/types';
import { ProfileImage } from './ProfileImage';

// Define the InterviewSession type locally to avoid importing from server-side module
interface InterviewSession {
  id: string;
  domain: string;
  job_description?: string;
  custom_job_position?: string;
  overall_score?: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

interface DashboardOverviewProps {
  className?: string;
}

export function DashboardOverview({ className = "" }: DashboardOverviewProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resumeResponse, sessionsResponse] = await Promise.all([
          fetch('/api/resume').then(res => res.json()),
          fetch('/api/interview/sessions?limit=5').then(res => res.json())
        ]);
        
        if (resumeResponse?.data?.data) {
          // The API returns nested data: { data: { data: profileData } }
          setProfile(resumeResponse.data.data);
        }
        
        if (sessionsResponse.success) {
          setInterviewSessions(sessionsResponse.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const hasProfile = profile && profile.name && profile.name !== '';
  const completionPercentage = hasProfile ? calculateCompletionPercentage(profile) : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <div className="flex justify-center mb-4">
          {hasProfile ? (
            <ProfileImage 
              imageUrl={profile.image_url}
              name={profile.name}
              size="xl"
            />
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white">
          {hasProfile ? `Welcome back, ${profile.name.split(' ')[0]}!` : 'Welcome to Gorofolio!'}
        </h1>
        <p className="text-blue-200 max-w-2xl mx-auto">
          {hasProfile 
            ? 'Your professional portfolio is ready. Continue building your career story.'
            : 'Create your professional portfolio in minutes. Upload your resume or start from scratch.'
          }
        </p>
      </div>

      {/* Profile Completion */}
      {hasProfile && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-white">
                <span>Profile Strength</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-blue-200 text-sm">
                {completionPercentage === 100 
                  ? '🎉 Your profile is complete and ready to impress!'
                  : `Add ${getNextSuggestion(profile)} to strengthen your profile`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Upload Resume */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-yellow-400" />
              Upload Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200 text-sm mb-4">
              Upload your PDF resume and let AI extract your information automatically.
            </p>
            <Link href="/dashboard/ingest">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
                Upload PDF
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-400" />
              {hasProfile ? 'Edit Profile' : 'Create Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200 text-sm mb-4">
              {hasProfile 
                ? 'Fine-tune your professional information, add experiences, and upload photos.'
                : 'Start building your professional profile. Add your information, experiences, and skills.'
              }
            </p>
            <Link href="/dashboard/editor">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium">
                {hasProfile ? 'Edit Profile' : 'Create Profile'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Preview Resume */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-green-400" />
              {hasProfile ? 'Preview Resume' : 'Resume Preview'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200 text-sm mb-4">
              {hasProfile 
                ? 'See how your resume looks and download it in multiple professional formats.'
                : 'Create your profile first to preview and download your professional resume.'
              }
            </p>
            <Link href="/dashboard/preview">
              <Button 
                className={`w-full font-medium ${
                  hasProfile 
                    ? 'bg-green-500 hover:bg-green-600 text-white' 
                    : 'bg-gray-500 hover:bg-gray-600 text-white opacity-75'
                }`}
                {...(!hasProfile && { 'aria-disabled': true })}
              >
                {hasProfile ? 'View Preview' : 'Create Profile First'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Portfolio */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-purple-400" />
              {hasProfile ? 'View Portfolio' : 'Create Portfolio'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200 text-sm mb-4">
              {hasProfile 
                ? 'View and manage your beautiful online portfolio. Share it with potential employers.'
                : 'Create a beautiful online portfolio to showcase your professional profile.'
              }
            </p>
            <Link href="/dashboard/profile/123">
              <Button 
                className={`w-full font-medium ${
                  hasProfile 
                    ? 'bg-purple-500 hover:bg-purple-600 text-white' 
                    : 'bg-gray-500 hover:bg-gray-600 text-white opacity-75'
                }`}
                {...(!hasProfile && { 'aria-disabled': true })}
              >
                {hasProfile ? 'View Portfolio' : 'Create Profile First'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Cover Letter */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-pink-400" />
              {hasProfile ? 'Generate Cover Letter' : 'Cover Letter Generator'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200 text-sm mb-4">
              {hasProfile 
                ? 'Generate personalized cover letters for any job posting using your profile data.'
                : 'Create your profile first to generate personalized cover letters with AI.'
              }
            </p>
            <Link href="/dashboard/cover">
              <Button 
                className={`w-full font-medium ${
                  hasProfile 
                    ? 'bg-pink-500 hover:bg-pink-600 text-white' 
                    : 'bg-gray-500 hover:bg-gray-600 text-white opacity-75'
                }`}
                {...(!hasProfile && { 'aria-disabled': true })}
              >
                {hasProfile ? 'Write Letter' : 'Create Profile First'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Interview Practice */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mic className="w-5 h-5 text-red-400" />
              Interview Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-200 text-sm mb-4">
              Practice interviews with AI feedback to improve your performance.
            </p>
            <Link href="/dashboard/interview">
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium">
                Start Practice
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Edit Actions for Existing Users */}
      {hasProfile && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Quick Edit Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/dashboard/editor?section=experience">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Edit Experience
                </Button>
              </Link>
              <Link href="/dashboard/editor?section=education">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  <User className="w-4 h-4 mr-2" />
                  Edit Education
                </Button>
              </Link>
              <Link href="/dashboard/editor?section=skills">
                <Button variant="outline" className="w-full bg-white/5 border-white/20 text-white hover:bg-white/10">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Edit Skills
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {hasProfile && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-blue-200">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm">Profile updated with latest information</span>
                <span className="text-xs text-blue-300 ml-auto">Today</span>
              </div>
              <div className="flex items-center gap-3 text-blue-200">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm">Resume downloaded in Modern style</span>
                <span className="text-xs text-blue-300 ml-auto">Yesterday</span>
              </div>
              <div className="flex items-center gap-3 text-blue-200">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-sm">Portfolio shared with 3 contacts</span>
                <span className="text-xs text-blue-300 ml-auto">2 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interview History */}
      {hasProfile && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Interview History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {interviewSessions.length > 0 ? (
                interviewSessions.map((session) => (
                  <Link key={session.id} href={`/dashboard/interview/results?session=${session.id}`}>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          session.overall_score 
                            ? `bg-gradient-to-br ${session.overall_score >= 8 ? 'from-green-500 to-emerald-600' : session.overall_score >= 6 ? 'from-yellow-500 to-orange-600' : 'from-red-500 to-pink-600'}`
                            : 'bg-gray-500'
                        }`}>
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-white font-medium capitalize">{session.domain} Interview</div>
                          <div className="text-xs text-blue-300">
                            {session.completed ? 'Completed' : 'In Progress'} • {formatDate(session.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {session.overall_score ? (
                          <div className={`text-lg font-bold ${getScoreColor(session.overall_score)}`}>
                            {session.overall_score}/10
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">—</div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-4">
                  <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-200 text-sm mb-3">No interview sessions yet</p>
                  <Link href="/dashboard/interview">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                      Start First Interview
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function calculateCompletionPercentage(profile: Profile): number {
  let score = 0;
  const maxScore = 8;

  if (profile.name) score += 1;
  if (profile.headline) score += 1;
  if (profile.summary) score += 1;
  if (profile.image_url) score += 1;
  if (profile.experiences && profile.experiences.length > 0) score += 1;
  if (profile.education && profile.education.length > 0) score += 1;
  if (profile.skills && profile.skills.length >= 3) score += 1;
  if (profile.links && profile.links.length > 0) score += 1;

  return Math.round((score / maxScore) * 100);
}

function getNextSuggestion(profile: Profile): string {
  if (!profile.image_url) return 'a profile photo';
  if (!profile.summary) return 'a professional summary';
  if (!profile.experiences || profile.experiences.length === 0) return 'work experience';
  if (!profile.education || profile.education.length === 0) return 'education details';
  if (!profile.skills || profile.skills.length < 3) return 'more skills';
  if (!profile.links || profile.links.length === 0) return 'professional links';
  return 'more details';
} 