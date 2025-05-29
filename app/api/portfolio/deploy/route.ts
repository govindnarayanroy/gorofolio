import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Portfolio deploy API called')

    // Create server-side Supabase client with proper authentication
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('❌ Authentication failed:', authError?.message || 'No user')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('✅ User authenticated:', user.id)

    const { profileId, customSlug } = await request.json()

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 })
    }

    console.log('📋 Deploy request:', { profileId, customSlug, userId: user.id })

    // Get user's actual profile data from database
    const { data: resumeData, error: dbError } = await supabase
      .from('resumes')
      .select('data, image_url')
      .eq('user_id', user.id)
      .single()

    if (dbError || !resumeData?.data) {
      console.log('❌ No profile data found for user:', user.id)
      return NextResponse.json({ error: 'Profile not found. Please upload a resume or add your information first.' }, { status: 404 })
    }

    // Include image_url in the profile data
    const profile = {
      ...resumeData.data,
      image_url: resumeData.image_url
    }

    console.log('✅ User profile loaded:', { name: profile.name, headline: profile.headline })

    // Check for Vercel API token
    const vercelToken = process.env.VERCEL_TOKEN
    
    if (!vercelToken) {
      console.log('⚠️ No Vercel API token found, using mock deployment')
      
      // Mock deployment for development/testing
      const mockUrl = `https://portfolio-${profile.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.vercel.app`
      
      try {
        // Save portfolio directly using the server-side supabase client
        const { data: existingPortfolio } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (existingPortfolio) {
          // Update existing portfolio
          await supabase
            .from('portfolios')
            .update({
              url: mockUrl,
              resume_id: profileId,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingPortfolio.id)
        } else {
          // Create new portfolio
          await supabase
            .from('portfolios')
            .insert({
              user_id: user.id,
              url: mockUrl,
              resume_id: profileId,
            })
        }
        
        console.log('✅ Mock portfolio URL saved to database')
      } catch (dbError) {
        console.error('❌ Failed to save mock portfolio URL:', dbError)
      }
      
      return NextResponse.json({
        success: true,
        url: mockUrl,
        message: 'Portfolio published successfully (mock deployment)',
        note: 'This is a mock deployment. Configure VERCEL_TOKEN for live deployments.',
        deploymentId: `mock-${Date.now()}`,
      })
    }

    console.log('🔑 Environment check:', { 
      hasVercelToken: !!vercelToken, 
      tokenLength: vercelToken.length 
    })

    // Generate static files for deployment
    const staticHTML = generateStaticHTML(profile, profileId)
    const staticCSS = generateStaticCSS()

    // Generate SHA256 hashes for files (required by Vercel API)
    const crypto = require('crypto')
    const htmlHash = crypto.createHash('sha1').update(staticHTML).digest('hex')
    const cssHash = crypto.createHash('sha1').update(staticCSS).digest('hex')

    console.log('📁 Generated file hashes:', { htmlHash, cssHash })

    // Step 1: Upload files to Vercel
    const uploadPromises = [
      uploadFileToVercel(vercelToken, htmlHash, staticHTML),
      uploadFileToVercel(vercelToken, cssHash, staticCSS)
    ]

    await Promise.all(uploadPromises)
    console.log('✅ Files uploaded to Vercel')

    // Step 2: Create deployment
    const deploymentPayload = {
      name: `portfolio-${profile.name.toLowerCase().replace(/\s+/g, '-')}`,
      files: [
        {
          file: 'index.html',
          sha: htmlHash,
          size: Buffer.byteLength(staticHTML, 'utf8')
        },
        {
          file: 'style.css',
          sha: cssHash,
          size: Buffer.byteLength(staticCSS, 'utf8')
        }
      ],
      target: 'production',
      public: true,
      projectSettings: {
        framework: null,
        buildCommand: null,
        outputDirectory: null
      }
    }

    console.log('📤 Creating Vercel deployment...')

    const deployResponse = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deploymentPayload),
    })

    if (!deployResponse.ok) {
      const errorText = await deployResponse.text()
      console.error('❌ Vercel deployment failed:', {
        status: deployResponse.status,
        statusText: deployResponse.statusText,
        error: errorText,
      })
      
      return NextResponse.json(
        {
          error: 'Deployment failed',
          details: `Status: ${deployResponse.status}, Error: ${errorText}`,
        },
        { status: 500 }
      )
    }

    const deployResult = await deployResponse.json()
    console.log('✅ Vercel deployment created:', deployResult)

    // Step 3: Disable Vercel Authentication for the project to make it truly public
    if (deployResult.project?.id) {
      console.log('🔓 Disabling Vercel Authentication for project...')
      try {
        const projectUpdateResponse = await fetch(`https://api.vercel.com/v9/projects/${deployResult.project.id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${vercelToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ssoProtection: null // Disable Vercel Authentication completely
          }),
        })

        if (projectUpdateResponse.ok) {
          console.log('✅ Vercel Authentication disabled - portfolio is now completely public')
        } else {
          const errorText = await projectUpdateResponse.text()
          console.log('⚠️ Failed to disable Vercel Authentication:', errorText)
        }
      } catch (authError) {
        console.log('⚠️ Could not disable Vercel Authentication:', authError)
      }
    }

    // Generate the portfolio URL
    const portfolioUrl = deployResult.url ? `https://${deployResult.url}` : `https://${deployResult.id}.vercel.app`

    // Save the portfolio URL to database
    try {
      const { data: existingPortfolio } = await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (existingPortfolio) {
        // Update existing portfolio
        await supabase
          .from('portfolios')
          .update({
            url: portfolioUrl,
            resume_id: profileId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingPortfolio.id)
      } else {
        // Create new portfolio
        await supabase
          .from('portfolios')
          .insert({
            user_id: user.id,
            url: portfolioUrl,
            resume_id: profileId,
          })
      }
      
      console.log('✅ Portfolio URL saved to database')
    } catch (dbError) {
      console.error('❌ Failed to save portfolio URL:', dbError)
    }

    return NextResponse.json({
      success: true,
      url: portfolioUrl,
      message: 'Portfolio published successfully',
      note: 'Your static portfolio is now live and accessible to anyone.',
      deploymentId: deployResult.id,
      vercelResponse: deployResult,
    })
  } catch (error) {
    console.error('❌ Deployment error:', error)
    return NextResponse.json(
      {
        error: 'Failed to publish portfolio',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Upload individual file to Vercel
async function uploadFileToVercel(token: string, sha: string, content: string) {
  const uploadResponse = await fetch(`https://api.vercel.com/v2/files`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/octet-stream',
      'x-vercel-digest': sha,
    },
    body: content,
  })

  if (!uploadResponse.ok) {
    const errorText = await uploadResponse.text()
    throw new Error(`File upload failed: ${uploadResponse.status} - ${errorText}`)
  }

  return uploadResponse.json()
}

// Generate static HTML for deployment
function generateStaticHTML(profile: any, profileId: string): string {
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Present'
    const date = new Date(dateStr)
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long' 
    }
    return date.toLocaleDateString('en-US', options)
  }

  const getInitials = (name: string) => {
    if (!name) return ''
    const names = name.trim().split(' ')
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profile.name} - Portfolio</title>
    <meta name="description" content="${profile.headline} - Professional portfolio showcasing experience, skills, and achievements.">
    <meta name="keywords" content="${profile.skills?.join(', ') || 'portfolio, resume, professional'}">
    <meta property="og:title" content="${profile.name} - Portfolio">
    <meta property="og:description" content="${profile.headline}">
    <meta property="og:type" content="website">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="page-container">
        <!-- Background Effects -->
        <div class="bg-overlay"></div>
        <div class="bg-blur bg-blur-1"></div>
        <div class="bg-blur bg-blur-2"></div>

        <div class="content-wrapper">
            <!-- Profile Content -->
            <div class="profile-card">
                <!-- Profile Header -->
                <header class="profile-header">
                    <div class="profile-photo-container">
                        ${profile.image_url 
                          ? `<img src="${profile.image_url}" alt="${profile.name}" class="profile-image" />`
                          : `<div class="profile-initials">${getInitials(profile.name)}</div>`
                        }
                    </div>
                    <h1 class="profile-name">${profile.name}</h1>
                    <h2 class="profile-headline">${profile.headline}</h2>
                </header>

                <!-- External Links -->
                ${profile.links && profile.links.length > 0 ? `
                <section class="links-section">
                    <h3 class="section-title">External Links</h3>
                    <div class="links-grid">
                        ${profile.links.map((link: any) => `
                            <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-card">
                                <span class="link-icon">🔗</span>
                                <span class="link-label">${link.label || 'Link'}</span>
                                <span class="link-arrow">→</span>
                            </a>
                        `).join('')}
                    </div>
                </section>
                ` : ''}

                <!-- Summary Section -->
                <section class="content-section">
                    <h2 class="section-heading">Summary</h2>
                    <p class="summary-text">${profile.summary}</p>
                </section>

                <!-- Experience Section -->
                ${profile.experiences && profile.experiences.length > 0 ? `
                <section class="content-section">
                    <h2 class="section-heading">Experience</h2>
                    <div class="experience-list">
                        ${profile.experiences.map((exp: any) => `
                            <div class="experience-card">
                                <div class="experience-header">
                                    <div class="experience-title-group">
                                        <h3 class="experience-role">${exp.role}</h3>
                                        <h4 class="experience-company">${exp.company}</h4>
                                    </div>
                                    <div class="experience-date">${formatDate(exp.start)} - ${formatDate(exp.end)}</div>
                                </div>
                                ${exp.bullets && exp.bullets.length > 0 ? `
                                    <ul class="experience-bullets">
                                        ${exp.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('')}
                                    </ul>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}

                <!-- Education Section -->
                ${profile.education && profile.education.length > 0 ? `
                <section class="content-section">
                    <h2 class="section-heading">Education</h2>
                    <div class="education-list">
                        ${profile.education.map((edu: any) => `
                            <div class="education-card">
                                <div class="education-header">
                                    <div class="education-title-group">
                                        <h3 class="education-degree">${edu.degree}</h3>
                                        <h4 class="education-school">${edu.school}</h4>
                                    </div>
                                    <div class="education-year">${edu.year}</div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}

                <!-- Skills Section -->
                ${profile.skills && profile.skills.length > 0 ? `
                <section class="content-section">
                    <h2 class="section-heading">Skills</h2>
                    <div class="skills-grid">
                        ${profile.skills.map((skill: string) => `
                            <span class="skill-tag">${skill}</span>
                        `).join('')}
                    </div>
                </section>
                ` : ''}

                <!-- Footer -->
                <footer class="portfolio-footer">
                    <p class="footer-text">Generated by GoRoFolio • ${new Date().getFullYear()}</p>
                    <p class="footer-powered">🚀 <strong>Powered by Vercel</strong> - Public portfolio website</p>
                </footer>
            </div>
        </div>
    </div>
</body>
</html>`
}

// Generate CSS for deployment
function generateStaticCSS(): string {
  return `
/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif;
    line-height: 1.6;
    color: #374151;
    background: #0f172a;
    overflow-x: hidden;
}

/* Page Container with Gradient Background */
.page-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3730a3 100%);
    position: relative;
}

/* Background Effects */
.bg-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.1) 0%, transparent 50%, rgba(147, 51, 234, 0.1) 100%);
    pointer-events: none;
}

.bg-blur {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
}

.bg-blur-1 {
    top: 5rem;
    left: 5rem;
    width: 24rem;
    height: 24rem;
    background: rgba(59, 130, 246, 0.2);
}

.bg-blur-2 {
    bottom: 5rem;
    right: 5rem;
    width: 24rem;
    height: 24rem;
    background: rgba(147, 51, 234, 0.15);
}

/* Content Wrapper */
.content-wrapper {
    position: relative;
    z-index: 1;
    max-width: 64rem;
    margin: 0 auto;
    padding: 3rem 1.5rem;
}

/* Profile Card */
.profile-card {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(16px);
    border-radius: 1.5rem;
    padding: 3rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Profile Header */
.profile-header {
    text-align: center;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid #e5e7eb;
}

.profile-photo-container {
    margin: 0 auto 1.5rem;
    width: 8rem;
    height: 8rem;
    border-radius: 50%;
    overflow: hidden;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.profile-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.profile-initials {
    font-size: 2.5rem;
    font-weight: bold;
    color: white;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-name {
    font-size: 3rem;
    font-weight: bold;
    color: #111827;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #1f2937, #374151);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.profile-headline {
    font-size: 1.5rem;
    color: #6b7280;
    font-weight: 500;
    letter-spacing: 0.025em;
}

/* Section Styles */
.content-section {
    margin-bottom: 3rem;
}

.section-heading {
    font-size: 2rem;
    font-weight: bold;
    color: #111827;
    margin-bottom: 1.5rem;
    position: relative;
    padding-bottom: 0.75rem;
}

.section-heading::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 4rem;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    border-radius: 2px;
}

.section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
}

.summary-text {
    font-size: 1.125rem;
    line-height: 1.8;
    text-align: justify;
    color: #4b5563;
}

/* Links Section */
.links-section {
    margin-bottom: 2.5rem;
}

.links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.link-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    background: linear-gradient(135deg, #dbeafe, #ede9fe);
    border: 1px solid #bfdbfe;
    border-radius: 0.75rem;
    text-decoration: none;
    color: #1d4ed8;
    font-weight: 500;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.link-card:hover {
    background: linear-gradient(135deg, #bfdbfe, #ddd6fe);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.link-icon {
    font-size: 1.125rem;
}

.link-label {
    flex: 1;
}

.link-arrow {
    font-size: 1rem;
    opacity: 0.7;
    transition: transform 0.3s ease;
}

.link-card:hover .link-arrow {
    transform: translateX(4px);
}

/* Experience Section */
.experience-list {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.experience-card {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.experience-card:hover {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
}

.experience-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1.5rem;
}

.experience-title-group {
    flex: 1;
}

.experience-role {
    font-size: 1.375rem;
    font-weight: bold;
    color: #111827;
    margin-bottom: 0.5rem;
}

.experience-company {
    font-size: 1.125rem;
    font-weight: 600;
    color: #3b82f6;
    margin: 0;
}

.experience-date {
    color: #6b7280;
    font-weight: 500;
    font-size: 0.875rem;
    text-align: right;
    white-space: nowrap;
    margin-left: 1rem;
}

.experience-bullets {
    list-style: none;
    margin-left: 0;
}

.experience-bullets li {
    position: relative;
    margin-bottom: 0.75rem;
    padding-left: 1.5rem;
    line-height: 1.6;
    color: #4b5563;
}

.experience-bullets li::before {
    content: '▶';
    color: #3b82f6;
    font-size: 0.75rem;
    position: absolute;
    left: 0;
    top: 0.125rem;
}

/* Education Section */
.education-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.education-card {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.education-card:hover {
    box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
}

.education-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.education-title-group {
    flex: 1;
}

.education-degree {
    font-size: 1.125rem;
    font-weight: bold;
    color: #111827;
    margin-bottom: 0.25rem;
}

.education-school {
    font-size: 1rem;
    font-weight: 600;
    color: #3b82f6;
    margin: 0;
}

.education-year {
    color: #6b7280;
    font-weight: 500;
    font-size: 0.875rem;
    white-space: nowrap;
    margin-left: 1rem;
}

/* Skills Section */
.skills-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.skill-tag {
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #dbeafe, #ede9fe);
    color: #1e40af;
    border-radius: 9999px;
    border: 1px solid #bfdbfe;
    font-weight: 500;
    font-size: 0.875rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.skill-tag:hover {
    background: linear-gradient(135deg, #bfdbfe, #ddd6fe);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

/* Footer */
.portfolio-footer {
    text-align: center;
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
}

.footer-text {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
}

.footer-powered {
    color: #6b7280;
    font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    .content-wrapper {
        padding: 2rem 1rem;
    }
    
    .profile-card {
        padding: 2rem;
    }
    
    .profile-name {
        font-size: 2.25rem;
    }
    
    .profile-headline {
        font-size: 1.25rem;
    }
    
    .section-heading {
        font-size: 1.75rem;
    }
    
    .experience-header,
    .education-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .experience-date,
    .education-year {
        margin-left: 0;
        margin-top: 0.5rem;
        text-align: left;
    }
    
    .links-grid {
        grid-template-columns: 1fr;
    }
    
    .bg-blur {
        width: 16rem;
        height: 16rem;
    }
}

@media (max-width: 480px) {
    .content-wrapper {
        padding: 1.5rem 0.75rem;
    }
    
    .profile-card {
        padding: 1.5rem;
        border-radius: 1rem;
    }
    
    .profile-photo-container {
        width: 6rem;
        height: 6rem;
    }
    
    .profile-initials {
        font-size: 2rem;
    }
    
    .profile-name {
        font-size: 2rem;
    }
    
    .experience-card,
    .education-card {
        padding: 1.5rem;
    }
}

/* Print Styles */
@media print {
    .page-container {
        background: white;
    }
    
    .bg-overlay,
    .bg-blur {
        display: none;
    }
    
    .profile-card {
        background: white;
        box-shadow: none;
        border: none;
        padding: 0;
    }
    
    .content-wrapper {
        padding: 0;
    }
    
    .profile-name {
        color: #111827;
        -webkit-text-fill-color: #111827;
    }
}
`
}