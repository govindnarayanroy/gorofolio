'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Plus,
  X,
  Save,
  ArrowRight,
  Loader2,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Link as LinkIcon,
  ArrowUpDown,
} from 'lucide-react'
import { Profile, Experience, Education } from '@/lib/types'
import { getUserResume, saveResume } from '@/lib/database'
import { toast } from 'sonner'
import { BackToDashboard } from '@/components/BackToDashboard'
import { ImageUpload } from '@/components/ImageUpload'

export default function EditorPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile>({
    name: '',
    headline: '',
    summary: '',
    experiences: [],
    education: [],
    skills: [],
    links: [],
    image_url: undefined,
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
    const newExperience = {
      company: '',
      role: '',
      start: '',
      end: '',
      bullets: [],
    }

    setProfile(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExperience],
    }))

    // Show success toast
    toast.success('New experience added! Fill in the details below.')

    // Scroll to the newly added experience after a short delay to ensure DOM update
    setTimeout(() => {
      const experienceElements = document.querySelectorAll('[data-experience-index]')
      const lastExperienceElement = experienceElements[experienceElements.length - 1]
      if (lastExperienceElement) {
        lastExperienceElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
        // Add a subtle highlight effect
        lastExperienceElement.classList.add('ring-2', 'ring-blue-400', 'ring-opacity-50')
        setTimeout(() => {
          lastExperienceElement.classList.remove('ring-2', 'ring-blue-400', 'ring-opacity-50')
        }, 2000)
      }
    }, 100)
  }

  // Function to sort experiences chronologically (most recent first)
  const sortExperiencesChronologically = (silent = false) => {
    setProfile(prev => ({
      ...prev,
      experiences: [...prev.experiences].sort((a, b) => {
        // Handle empty dates - put them at the top (most recent)
        if (!a.start && !b.start) return 0
        if (!a.start) return -1
        if (!b.start) return 1

        // Parse dates to handle various formats
        const parseDate = (dateStr: string) => {
          // Remove any whitespace
          const cleaned = dateStr.trim()
          
          // Handle formats like "2023-12", "2023-1", "12/2023", "Dec 2023", etc.
          let year: number, month: number
          
          // Format: YYYY-MM or YYYY-M
          if (cleaned.match(/^\d{4}-\d{1,2}$/)) {
            const [yearStr, monthStr] = cleaned.split('-')
            year = parseInt(yearStr)
            month = parseInt(monthStr)
          }
          // Format: MM/YYYY or M/YYYY
          else if (cleaned.match(/^\d{1,2}\/\d{4}$/)) {
            const [monthStr, yearStr] = cleaned.split('/')
            year = parseInt(yearStr)
            month = parseInt(monthStr)
          }
          // Format: Mon YYYY (e.g., "Dec 2023", "January 2024")
          else if (cleaned.match(/^[A-Za-z]{3,9}\s+\d{4}$/)) {
            const [monthStr, yearStr] = cleaned.split(/\s+/)
            year = parseInt(yearStr)
            const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
            const monthIndex = monthNames.findIndex(m => monthStr.toLowerCase().startsWith(m))
            month = monthIndex >= 0 ? monthIndex + 1 : 1
          }
          // Format: Just year (YYYY)
          else if (cleaned.match(/^\d{4}$/)) {
            year = parseInt(cleaned)
            month = 12 // Assume December for year-only dates
          }
          // Format: Just month (MM or M) - assume current year
          else if (cleaned.match(/^\d{1,2}$/)) {
            year = new Date().getFullYear()
            month = parseInt(cleaned)
          }
          // Fallback: try to parse as Date
          else {
            const date = new Date(cleaned)
            if (!isNaN(date.getTime())) {
              year = date.getFullYear()
              month = date.getMonth() + 1
            } else {
              // If all else fails, treat as very old date
              year = 1900
              month = 1
            }
          }
          
          // Ensure month is valid (1-12)
          month = Math.max(1, Math.min(12, month))
          
          // Return a comparable number: YYYYMM format
          return year * 100 + month
        }

        const dateA = parseDate(a.start)
        const dateB = parseDate(b.start)

        // Sort in descending order (most recent first)
        return dateB - dateA
      }),
    }))

    if (!silent) {
      toast.success('Experiences sorted chronologically!')
    }
  }

  const updateExperience = (index: number, field: keyof Experience, value: string | string[]) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      ),
    }))

    // Auto-sort when start date is updated and there are multiple experiences
    if (field === 'start' && value && profile.experiences.length > 1) {
      setTimeout(() => {
        sortExperiencesChronologically(true) // Pass true for silent sort
      }, 500) // Small delay to allow user to finish typing
    }
  }

  const removeExperience = (index: number) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }))
  }

  const addEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [
        ...prev.education,
        {
          school: '',
          degree: '',
          year: '',
        },
      ],
    }))
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))
  }

  const removeEducation = (index: number) => {
    setProfile(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }))
  }

  const addLink = () => {
    if (newLink.label.trim() && newLink.url.trim()) {
      setProfile(prev => ({
        ...prev,
        links: [...prev.links, { ...newLink }],
      }))
      setNewLink({ label: '', url: '' })
    }
  }

  const removeLink = (index: number) => {
    setProfile(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }))
  }

  const addBulletPoint = (expIndex: number) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === expIndex ? { ...exp, bullets: [...exp.bullets, ''] } : exp
      ),
    }))
  }

  const updateBulletPoint = (expIndex: number, bulletIndex: number, value: string) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              bullets: exp.bullets.map((bullet, j) => (j === bulletIndex ? value : bullet)),
            }
          : exp
      ),
    }))
  }

  const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
    setProfile(prev => ({
      ...prev,
      experiences: prev.experiences.map((exp, i) =>
        i === expIndex
          ? {
              ...exp,
              bullets: exp.bullets.filter((_, j) => j !== bulletIndex),
            }
          : exp
      ),
    }))
  }

  const handleImageUploaded = (imageUrl: string) => {
    setProfile(prev => ({
      ...prev,
      image_url: imageUrl,
    }))
    // Auto-save when image is uploaded
    handleSave()
  }

  const handleImageRemoved = () => {
    setProfile(prev => ({
      ...prev,
      image_url: undefined,
    }))
    // Auto-save when image is removed
    handleSave()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black">
        <div className="text-center text-white">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p>Loading your resume data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black">
      {/* Background decorations */}
      <div className="absolute -top-20 left-1/4 -z-10 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />
      <div className="absolute right-1/4 top-1/2 -z-10 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />

      <div className="container mx-auto px-6 py-12">
        {/* Back to Dashboard Button - Top Left */}
        <div className="mb-8">
          <BackToDashboard variant="button" className="inline-flex" />
        </div>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-extrabold text-white">
            Edit Your <span className="text-sky-400">Resume</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-300">
            Fine-tune your professional profile. All changes are automatically saved to your
            account.
          </p>
        </div>

        <div className="mx-auto max-w-4xl space-y-8">
          {/* Personal Information */}
          <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                  <Input
                    value={profile.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile(prev => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="John Doe"
                    className="border-slate-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Professional Title
                  </label>
                  <Input
                    value={profile.headline}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile(prev => ({ ...prev, headline: e.target.value }))
                    }
                    placeholder="Senior Software Engineer"
                    className="border-slate-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Professional Summary
                </label>
                <Textarea
                  value={profile.summary}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setProfile(prev => ({ ...prev, summary: e.target.value }))
                  }
                  placeholder="Brief overview of your professional background and key achievements..."
                  rows={4}
                  className="border-slate-200 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* External Links */}
          <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <LinkIcon className="h-5 w-5" />
                External Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mb-4 flex flex-wrap gap-2">
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
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <Input
                  value={newLink.label}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewLink(prev => ({ ...prev, label: e.target.value }))
                  }
                  placeholder="LinkedIn"
                  className="border-slate-200"
                />
                <Input
                  value={newLink.url}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewLink(prev => ({ ...prev, url: e.target.value }))
                  }
                  placeholder="https://linkedin.com/in/johndoe"
                  className="border-slate-200"
                />
                <Button
                  onClick={addLink}
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Link
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Work Experience
                </div>
                <div className="flex gap-2">
                  {profile.experiences.length > 1 && (
                    <Button
                      onClick={() => sortExperiencesChronologically(false)}
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-600 hover:bg-green-50"
                      title="Sort experiences by date (most recent first)"
                    >
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      Sort by Date
                    </Button>
                  )}
                  <Button
                    onClick={addExperience}
                    variant="outline"
                    size="sm"
                    className="border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Experience
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.experiences.map((exp, index) => (
                <div
                  key={index}
                  data-experience-index={index}
                  className="space-y-4 rounded-lg border border-slate-200 p-4 transition-all duration-300"
                >
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-slate-800">Experience {index + 1}</h4>
                    <Button
                      onClick={() => removeExperience(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Input
                      value={exp.role}
                      onChange={e => updateExperience(index, 'role', e.target.value)}
                      placeholder="Job Title"
                      className="border-slate-200"
                    />
                    <Input
                      value={exp.company}
                      onChange={e => updateExperience(index, 'company', e.target.value)}
                      placeholder="Company Name"
                      className="border-slate-200"
                    />
                    <Input
                      value={exp.start}
                      onChange={e => updateExperience(index, 'start', e.target.value)}
                      placeholder="Start Date (e.g., 2020-01)"
                      className="border-slate-200"
                    />
                    <Input
                      value={exp.end || ''}
                      onChange={e => updateExperience(index, 'end', e.target.value)}
                      placeholder="End Date (leave empty for Present)"
                      className="border-slate-200"
                    />
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-slate-700">
                        Key Achievements & Responsibilities
                      </label>
                      <Button
                        onClick={() => addBulletPoint(index)}
                        variant="outline"
                        size="sm"
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Point
                      </Button>
                    </div>
                    {exp.bullets.map((bullet, bulletIndex) => (
                      <div key={bulletIndex} className="flex gap-2">
                        <Input
                          value={bullet}
                          onChange={e => updateBulletPoint(index, bulletIndex, e.target.value)}
                          placeholder="• Describe a key achievement or responsibility..."
                          className="border-slate-200"
                        />
                        <Button
                          onClick={() => removeBulletPoint(index, bulletIndex)}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:bg-red-50 hover:text-red-700"
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
          <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-800">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </div>
                <Button
                  onClick={addEducation}
                  variant="outline"
                  size="sm"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Education
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile.education.map((edu, index) => (
                <div key={index} className="space-y-4 rounded-lg border border-slate-200 p-4">
                  <div className="flex items-start justify-between">
                    <h4 className="font-medium text-slate-800">Education {index + 1}</h4>
                    <Button
                      onClick={() => removeEducation(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:bg-red-50 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Input
                      value={edu.degree}
                      onChange={e => updateEducation(index, 'degree', e.target.value)}
                      placeholder="Degree (e.g., Bachelor of Science)"
                      className="border-slate-200"
                    />
                    <Input
                      value={edu.school}
                      onChange={e => updateEducation(index, 'school', e.target.value)}
                      placeholder="Institution Name"
                      className="border-slate-200"
                    />
                    <Input
                      value={edu.year}
                      onChange={e => updateEducation(index, 'year', e.target.value)}
                      placeholder="Year (e.g., 2020)"
                      className="border-slate-200"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <Code className="h-5 w-5" />
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mb-4 flex flex-wrap gap-2">
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
                  onChange={e => setNewSkill(e.target.value)}
                  placeholder="Add a skill (e.g., React, Python, Project Management)"
                  className="border-slate-200"
                  onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && addSkill()}
                />
                <Button
                  onClick={addSkill}
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card className="border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-slate-800">
                <User className="h-5 w-5" />
                Profile Image
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                currentImageUrl={profile.image_url}
                onImageUploaded={handleImageUploaded}
                onImageRemoved={handleImageRemoved}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-8">
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="outline"
              className="border-slate-300 bg-white/90 text-slate-700 hover:bg-white hover:text-slate-900 shadow-lg"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </>
              )}
            </Button>

            <Button
              onClick={handleNext}
              disabled={saving}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Next: Portfolio Builder
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
