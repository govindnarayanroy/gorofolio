'use client'

import { useState } from 'react'
import { Download, FileText, Palette, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Profile } from '@/lib/types'

interface ResumeDownloadProps {
  profile: Profile
  className?: string
}

type ResumeStyle = 'modern' | 'creative' | 'professional'

const styles = {
  modern: {
    name: 'Modern',
    description: 'Clean, minimalist design with subtle colors',
    icon: <FileText className="h-5 w-5" />,
    preview: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
  },
  creative: {
    name: 'Creative',
    description: 'Bold design with vibrant colors and unique layout',
    icon: <Palette className="h-5 w-5" />,
    preview: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
  },
  professional: {
    name: 'Professional',
    description: 'Traditional, corporate-friendly format',
    icon: <Briefcase className="h-5 w-5" />,
    preview: 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200',
  },
}

export function ResumeDownload({ profile, className = '' }: ResumeDownloadProps) {
  const [selectedStyle, setSelectedStyle] = useState<ResumeStyle>('modern')
  const [isDownloading, setIsDownloading] = useState(false)

  const generatePDFContent = (style: ResumeStyle) => {
    const baseStyles = `
      <style>
        @page {
          margin: 0.5in;
          size: A4;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.5;
          color: #1e293b;
          background: white;
          font-size: 11pt;
        }
        
        .container {
          max-width: 100%;
          margin: 0 auto;
        }
        
        .header {
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .name {
          font-size: 28pt;
          font-weight: 700;
          margin-bottom: 8px;
          letter-spacing: -0.5px;
        }
        
        .title {
          font-size: 14pt;
          margin-bottom: 12px;
          font-weight: 400;
        }
        
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 10pt;
        }
        
        .section {
          margin-bottom: 20px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 13pt;
          font-weight: 700;
          margin-bottom: 12px;
          padding-bottom: 4px;
          border-bottom: 1px solid #cbd5e1;
        }
        
        .experience-item {
          margin-bottom: 16px;
          page-break-inside: avoid;
        }
        
        .job-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        
        .job-title {
          font-size: 12pt;
          font-weight: 600;
        }
        
        .company {
          font-size: 11pt;
          font-weight: 500;
          margin-bottom: 4px;
        }
        
        .date {
          font-size: 10pt;
          color: #64748b;
          white-space: nowrap;
        }
        
        .bullets {
          list-style: none;
          padding-left: 0;
        }
        
        .bullets li {
          margin-bottom: 4px;
          padding-left: 16px;
          position: relative;
        }
        
        .bullets li:before {
          content: "•";
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        
        .education-item {
          margin-bottom: 12px;
        }
        
        .degree {
          font-weight: 600;
          font-size: 11pt;
        }
        
        .school {
          font-weight: 500;
          margin-bottom: 2px;
        }
        
        .year {
          font-size: 10pt;
          color: #64748b;
        }
        
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        
        .skill {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10pt;
          text-align: center;
        }
        
        .two-column {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        
        @media print {
          body { margin: 0; }
          .no-print { display: none !important; }
        }
      </style>
    `

    const styleSpecific = {
      modern: `
        .name { color: #0f172a; }
        .title { color: #475569; }
        .section-title { color: #0ea5e9; border-bottom-color: #0ea5e9; }
        .company { color: #0ea5e9; }
        .bullets li:before { color: #0ea5e9; }
        .skill { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
      `,
      creative: `
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; border: none; margin-bottom: 24px; }
        .name { color: white; }
        .title { color: #e2e8f0; }
        .section-title { color: #7c3aed; border-bottom-color: #7c3aed; text-transform: uppercase; letter-spacing: 1px; }
        .company { color: #7c3aed; }
        .bullets li:before { color: #7c3aed; }
        .skill { background: #f3e8ff; color: #7c3aed; border: 1px solid #d8b4fe; }
      `,
      professional: `
        .name { color: #1f2937; }
        .title { color: #4b5563; }
        .section-title { color: #374151; text-transform: uppercase; letter-spacing: 0.5px; }
        .company { color: #4b5563; }
        .bullets li:before { color: #6b7280; }
        .skill { background: #f9fafb; color: #374151; border: 1px solid #d1d5db; }
      `,
    }

    // Helper function to safely get string value
    const safeString = (value: any): string => {
      if (value === null || value === undefined) return ''
      return String(value)
    }

    // Helper function to safely clean URL
    const cleanUrl = (url: string): string => {
      if (!url) return ''
      return url.replace(/^https?:\/\//, '')
    }

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${safeString(profile.name)} - Resume</title>
          ${baseStyles}
          <style>${styleSpecific[style]}</style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 class="name">${safeString(profile.name)}</h1>
              <p class="title">${safeString(profile.headline)}</p>
              ${
                profile.links && profile.links.length > 0
                  ? `
                <div class="contact-info">
                  ${profile.links
                    .slice(0, 3)
                    .map(link => {
                      if (!link || !link.label || !link.url) return ''
                      return `<span>${safeString(link.label)}: ${cleanUrl(safeString(link.url))}</span>`
                    })
                    .filter(Boolean)
                    .join('')}
                </div>
              `
                  : ''
              }
            </div>
            
            <div class="section">
              <h2 class="section-title">Professional Summary</h2>
              <p>${safeString(profile.summary)}</p>
            </div>
            
            ${
              profile.experiences && profile.experiences.length > 0
                ? `
              <div class="section">
                <h2 class="section-title">Professional Experience</h2>
                ${profile.experiences
                  .map(exp => {
                    if (!exp) return ''
                    return `
                    <div class="experience-item">
                      <div class="job-header">
                        <div>
                          <div class="job-title">${safeString(exp.role)}</div>
                          <div class="company">${safeString(exp.company)}</div>
                        </div>
                        <div class="date">${safeString(exp.start)} - ${safeString(exp.end) || 'Present'}</div>
                      </div>
                      <ul class="bullets">
                        ${(exp.bullets || [])
                          .map(bullet => (bullet ? `<li>${safeString(bullet)}</li>` : ''))
                          .filter(Boolean)
                          .join('')}
                      </ul>
                    </div>
                  `
                  })
                  .filter(Boolean)
                  .join('')}
              </div>
            `
                : ''
            }
            
            <div class="two-column">
              ${
                profile.education && profile.education.length > 0
                  ? `
                <div class="section">
                  <h2 class="section-title">Education</h2>
                  ${profile.education
                    .map(edu => {
                      if (!edu) return ''
                      return `
                      <div class="education-item">
                        <div class="degree">${safeString(edu.degree)}</div>
                        <div class="school">${safeString(edu.school)}</div>
                        <div class="year">${safeString(edu.year)}</div>
                      </div>
                    `
                    })
                    .filter(Boolean)
                    .join('')}
                </div>
              `
                  : ''
              }
              
              ${
                profile.skills && profile.skills.length > 0
                  ? `
                <div class="section">
                  <h2 class="section-title">Core Competencies</h2>
                  <div class="skills-grid">
                    ${profile.skills
                      .map(skill => (skill ? `<div class="skill">${safeString(skill)}</div>` : ''))
                      .filter(Boolean)
                      .join('')}
                  </div>
                </div>
              `
                  : ''
              }
            </div>
          </div>
        </body>
      </html>
    `
  }

  const handleDownload = async (style: ResumeStyle) => {
    setIsDownloading(true)

    try {
      const htmlContent = generatePDFContent(style)

      // Create a new window for printing
      const printWindow = window.open('', '_blank', 'width=800,height=600')

      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()

        // Wait for content to load
        printWindow.onload = () => {
          // Focus and print
          printWindow.focus()
          setTimeout(() => {
            printWindow.print()
            printWindow.close()
          }, 250)
        }
      }
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card className={`border-0 bg-white/95 shadow-2xl backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <Download className="h-5 w-5" />
          Download Resume
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Style Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-slate-700">Choose Style</h3>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(styles).map(([key, style]) => (
              <button
                key={key}
                onClick={() => setSelectedStyle(key as ResumeStyle)}
                className={`rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                  selectedStyle === key
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border-2 ${style.preview}`}
                  >
                    {style.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800">{style.name}</div>
                    <div className="text-sm text-slate-600">{style.description}</div>
                  </div>
                  {selectedStyle === key && (
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={() => handleDownload(selectedStyle)}
          disabled={isDownloading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
        >
          {isDownloading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
              Generating PDF...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download {styles[selectedStyle].name} Resume
            </>
          )}
        </Button>

        <p className="text-center text-xs text-slate-500">
          PDF will be generated without watermarks or timestamps
        </p>
      </CardContent>
    </Card>
  )
}
