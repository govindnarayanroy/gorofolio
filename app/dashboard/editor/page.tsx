"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Save, ArrowRight, Loader2, User, Briefcase, GraduationCap, Code, Link as LinkIcon } from 'lucide-react'
import { Profile, Experience, Education } from '@/lib/types'
import { getUserResume, saveResume } from '@/lib/database'
import { toast } from 'sonner'

export default function EditorPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>({
    name: '',
    headline: '',
    summary: '',
    experiences: [],
    education: [],
    skills: [],
    links: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [newLink, setNewLink] = useState({ label: '', url: '' })

  useEffect(() => {
    loadExistingResume()
  }, [])

  const loadExistingResume = async () => {
    try {
      const resume = await getUserResume()
      if (resume?.data) {
        setProfile(resume.data)
      }
    } catch (error) {
      console.error('Error loading resume:', error)
      toast.error('Failed to load existing resume data')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveResume(profile)
      toast.success('Resume saved successfully!')
    } catch (error) {
      console.error('Error saving resume:', error)
      toast.error('Failed to save resume')
    } finally {
      setSaving(false)
    }
  }

  const handleNext = async () => {
    setSaving(true)
    try {
      await saveResume(profile)
      toast.success('Resume saved! Redirecting to portfolio builder...')
      router.push('/dashboard/preview')
    } catch (error) {
      console.error('Error saving resume:', error)
      toast.error('Failed to save resume')
      setSaving(false)
    }
  }

  const addExperience = () => {
    setProfile(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        company: '',
        role: '',
        start: '',
        end: '',
        bullets: []
      }]
    }))
  }

  const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeExperience = (index: number) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index)
    }))
  }

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [...prev.education, {
        school: '',
        degree: '',
        year: ''
      }]
    }))
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (index: number) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const addLink = () => {
    if (newLink.label.trim() && newLink.url.trim()) {
      setProfile(prev => ({
        ...prev,
        links: [...prev.links, { ...newLink }]
      }))
      setNewLink({ label: '', url: '' })
    }
  }

  const removeLink = (index: number) => {
    setProfile(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }))
  }

  const addBulletPoint = (expIndex: number) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === expIndex ? { ...exp, bullets: [...exp.bullets, ''] } : exp
      )
    }))
  }

  const updateBulletPoint = (expIndex: number, bulletIndex: number, value: string) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          bullets: exp.bullets.map((bullet, j) => j === bulletIndex ? value : bullet)
        } : exp
      )
    }))
  }

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) => 
        i === expIndex ? {
          ...exp,
          bullets: exp.bullets.filter((_, j) => j !== bulletIndex)
        } : exp
      )
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your resume data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black">
      {/* Background decorations */}
      <div className="absolute -z-10 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl left-1/4 -top-20" />
      <div className="absolute -z-10 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl right-1/4 top-1/2" />
      
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">
            Edit Your <span className="text-sky-400">Resume</span>
          </h1>
          <p className="text-lg text-zinc-300 max-w-2xl mx-auto">
            Fine-tune your professional profile. All changes are automatically saved to your account.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Personal Information */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    className="border-slate-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Professional Title</label>
                  <Input
                    value={profile.headline}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile(prev => ({ ...prev, headline: e.target.value }))}
                    placeholder="Senior Software Engineer"
                    className="border-slate-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Professional Summary</label>
                <Textarea
                  value={profile.summary}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setProfile(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Brief overview of your professional background and key achievements..."
                  rows={4}
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* External Links */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <LinkIcon className="h-5 w-5" />
                External Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.links.map((link, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-2">
                    {link.label}: {link.url}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeLink(index)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={newLink.label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLink(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="LinkedIn"
                  className="border-slate-200"
                />
                <Input
                  value={newLink.url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://linkedin.com/in/johndoe"
                  className="border-slate-200"
                />
                <Button onClick={addLink} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </div>
                <Button onClick={addExperience} variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.experiences.map((exp, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-slate-800">Experience {index + 1}</h4>
                    <Button 
                      onClick={() => removeExperience(index)} 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      value={exp.role}
                      onChange={(e) => updateExperience(index, 'role', e.target.value)}
                      placeholder="Job Title"
                      className="border-slate-200"
                    />
                    <Input
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      placeholder="Company Name"
                      className="border-slate-200"
                    />
                    <Input
                      value={exp.start}
                      onChange={(e) => updateExperience(index, 'start', e.target.value)}
                      placeholder="Start Date (e.g., 2020-01)"
                      className="border-slate-200"
                    />
                    <Input
                      value={exp.end || ''}
                      onChange={(e) => updateExperience(index, 'end', e.target.value)}
                      placeholder="End Date (leave empty for Present)"
                      className="border-slate-200"
                    />
                  </div>
                  
                  {/* Bullet Points */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">Key Achievements & Responsibilities</label>
                      <Button 
                        onClick={() => addBulletPoint(index)} 
                        variant="outline" 
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Point
                      </Button>
                    </div>
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex gap-2">
                        <Input
                          value={bullet}
                          onChange={(e) => updateBulletPoint(index, bulletIndex, e.target.value)}
                          placeholder="• Describe a key achievement or responsibility..."
                          className="border-slate-200"
                        />
                        <Button 
                          onClick={() => removeBulletPoint(index, bulletIndex)}
                          variant="ghost" 
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </div>
                <Button onClick={addEducation} variant="outline" size="sm" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.education.map((edu, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-slate-800">Education {index + 1}</h4>
                    <Button 
                      onClick={() => removeEducation(index)} 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="Degree (e.g., Bachelor of Science)"
                      className="border-slate-200"
                    />
                    <Input
                      value={edu.school}
                      onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      placeholder="Institution Name"
                      className="border-slate-200"
                    />
                    <Input
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      placeholder="Year (e.g., 2020)"
                      className="border-slate-200"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Code className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-2">
                    {skill}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-red-500" 
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g., React, Python, Project Management)"
                  className="border-slate-200"
                  onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && addSkill()}
                />
                <Button onClick={addSkill} variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-8">
            <Button 
              onClick={handleSave} 
              disabled={saving}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
            
            <Button 
              onClick={handleNext} 
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Next: Portfolio Builder
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 