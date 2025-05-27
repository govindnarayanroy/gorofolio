import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getProfileById } from "@/lib/profiles";
import { savePortfolio } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Portfolio deploy API called");
    
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.log("❌ Authentication failed");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { profileId, customSlug } = await request.json();

    if (!profileId) {
      return NextResponse.json({ error: 'Profile ID is required' }, { status: 400 });
    }

    console.log("📋 Deploy request:", { profileId, customSlug, userId: user.id });

    // Get user's profile data
    const profile = getProfileById(profileId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check for Vercel deploy hook
    const vercelDeployHook = process.env.VERCEL_DEPLOY_HOOK;
    
    console.log("🔑 Environment check:", {
      hasVercelDeployHook: !!vercelDeployHook,
      hookLength: vercelDeployHook?.length || 0
    });

    if (!vercelDeployHook) {
      console.log("⚠️ No Vercel deploy hook found, using mock deployment");
      
      // Mock deployment for development/testing
      const mockUrl = customSlug 
        ? `https://${customSlug}.vercel.app`
        : `https://portfolio-${profileId}-${Date.now()}.vercel.app`;
      
      // Save the mock URL to database
      try {
        await savePortfolio(mockUrl, profileId);
        console.log("✅ Mock portfolio URL saved to database");
      } catch (dbError) {
        console.error("❌ Failed to save portfolio URL:", dbError);
      }

      return NextResponse.json({
        success: true,
        url: mockUrl,
        deploymentId: `mock-${Date.now()}`,
        message: "Portfolio published successfully (mock deployment)",
        mock: true
      });
    }

    // Generate static files for deployment
    const htmlContent = generateStaticHTML(profile, profileId);
    const cssContent = generateStaticCSS();
    const packageJson = generatePackageJson(profile.name);

    // Prepare deployment data for the deploy hook
    const deploymentData = {
      profileId,
      customSlug,
      userId: user.id,
      timestamp: Date.now(),
      files: {
        "index.html": htmlContent,
        "style.css": cssContent,
        "package.json": packageJson
      }
    };

    console.log("📤 Triggering Vercel deploy hook...");

    // Trigger Vercel deploy hook
    const deployResponse = await fetch(vercelDeployHook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Gorofolio-Portfolio-Deploy/1.0'
      },
      body: JSON.stringify(deploymentData)
    });

    if (!deployResponse.ok) {
      const errorData = await deployResponse.text();
      console.error("❌ Vercel deploy hook failed:", {
        status: deployResponse.status,
        statusText: deployResponse.statusText,
        error: errorData
      });
      
      throw new Error(`Deploy hook failed: ${deployResponse.status} ${deployResponse.statusText}`);
    }

    // Deploy hook response might be empty or contain deployment info
    let deploymentInfo;
    try {
      deploymentInfo = await deployResponse.json();
    } catch {
      // Deploy hook might return empty response, which is normal
      deploymentInfo = { triggered: true };
    }

    console.log("✅ Deploy hook triggered successfully:", deploymentInfo);

    // Generate the expected deployment URL
    // Use the correct Vercel domain format: gorofolio-git-main-govind-roys-projects.vercel.app
    const baseUrl = process.env.VERCEL_PROJECT_URL || 'gorofolio-git-main-govind-roys-projects.vercel.app';
    const deploymentUrl = customSlug 
      ? `https://${customSlug}-govind-roys-projects.vercel.app`
      : `https://${baseUrl}`;

    // Save the deployment URL to database
    try {
      await savePortfolio(deploymentUrl, profileId);
      console.log("✅ Portfolio URL saved to database");
    } catch (dbError) {
      console.error("❌ Failed to save portfolio URL:", dbError);
      // Continue anyway - deployment was triggered successfully
    }

    return NextResponse.json({
      success: true,
      url: deploymentUrl,
      deploymentId: deploymentInfo?.id || `hook-${Date.now()}`,
      message: "Portfolio deployment triggered successfully",
      hookTriggered: true,
      note: "Deployment is processing. Your portfolio will be live shortly.",
      deploymentInfo
    });

  } catch (error) {
    console.error("❌ Deployment error:", error);
    return NextResponse.json({
      error: "Failed to trigger portfolio deployment",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

// Generate static HTML for deployment
function generateStaticHTML(profile: any, profileId: string): string {
  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Present";
    const [year, month] = dateStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

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
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="profile-photo">
                <span class="initials">${profile.name.split(' ').map((n: string) => n[0]).join('')}</span>
            </div>
            <h1 class="name">${profile.name}</h1>
            <h2 class="headline">${profile.headline}</h2>
        </header>

        <!-- External Links -->
        ${profile.links && profile.links.length > 0 ? `
        <section class="links-section">
            <h3>External Links</h3>
            <div class="links-container">
                ${profile.links.map((link: any) => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="link-item">
                        ${link.label || 'Link'}
                    </a>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Summary -->
        <section class="section">
            <h2>Summary</h2>
            <p class="summary">${profile.summary}</p>
        </section>

        <!-- Experience -->
        <section class="section">
            <h2>Experience</h2>
            ${profile.experiences?.map((exp: any) => `
                <div class="experience-item">
                    <div class="experience-header">
                        <div>
                            <div class="role">${exp.role}</div>
                            <div class="company">${exp.company}</div>
                        </div>
                        <div class="date">${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}</div>
                    </div>
                    ${exp.bullets && exp.bullets.length > 0 ? `
                        <ul class="bullets">
                            ${exp.bullets.map((bullet: string) => `<li>${bullet}</li>`).join('')}
                        </ul>
                    ` : ''}
                </div>
            `).join('') || '<p>No experience data available.</p>'}
        </section>

        <!-- Education -->
        <section class="section">
            <h2>Education</h2>
            ${profile.education?.map((edu: any) => `
                <div class="education-item">
                    <div class="education-header">
                        <div>
                            <div class="degree">${edu.degree}</div>
                            <div class="school">${edu.school}</div>
                        </div>
                        <div class="year">${edu.year}</div>
                    </div>
                </div>
            `).join('') || '<p>No education data available.</p>'}
        </section>

        <!-- Skills -->
        <section class="section">
            <h2>Skills</h2>
            <div class="skills-container">
                ${profile.skills?.map((skill: string) => `
                    <span class="skill-tag">${skill}</span>
                `).join('') || '<p>No skills data available.</p>'}
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <p>Generated by GoRoFolio • ${new Date().getFullYear()}</p>
        </footer>
    </div>
</body>
</html>`;
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #374151;
    background: #f9fafb;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: white;
    min-height: 100vh;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* Header Styles */
.header {
    text-align: center;
    margin-bottom: 3rem;
    padding-bottom: 2rem;
    border-bottom: 2px solid #e5e7eb;
}

.profile-photo {
    width: 120px;
    height: 120px;
    margin: 0 auto 1.5rem;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.initials {
    font-size: 2rem;
    font-weight: bold;
    color: white;
}

.name {
    font-size: 2.5rem;
    font-weight: bold;
    color: #111827;
    margin-bottom: 0.5rem;
}

.headline {
    font-size: 1.25rem;
    color: #6b7280;
    font-weight: 500;
}

/* Section Styles */
.section {
    margin-bottom: 2.5rem;
}

.section h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #111827;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #3b82f6;
}

.summary {
    font-size: 1rem;
    line-height: 1.7;
    text-align: justify;
}

/* Links Section */
.links-section {
    margin-bottom: 2rem;
}

.links-section h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1rem;
}

.links-container {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.link-item {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #dbeafe, #ede9fe);
    color: #1d4ed8;
    text-decoration: none;
    border-radius: 0.75rem;
    border: 1px solid #bfdbfe;
    font-weight: 500;
    transition: all 0.2s ease;
}

.link-item:hover {
    background: linear-gradient(135deg, #bfdbfe, #ddd6fe);
    transform: translateY(-1px);
}

/* Experience Styles */
.experience-item {
    background: linear-gradient(135deg, #f0f9ff, #faf5ff);
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid #e0e7ff;
    margin-bottom: 1.5rem;
}

.experience-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.role {
    font-size: 1.125rem;
    font-weight: bold;
    color: #111827;
}

.company {
    font-size: 1rem;
    font-weight: 600;
    color: #2563eb;
    margin-top: 0.25rem;
}

.date {
    color: #6b7280;
    font-weight: 500;
    font-size: 0.875rem;
}

.bullets {
    list-style: none;
    margin-left: 0;
}

.bullets li {
    position: relative;
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
}

.bullets li:before {
    content: '•';
    color: #3b82f6;
    font-weight: bold;
    position: absolute;
    left: 0;
}

/* Education Styles */
.education-item {
    background: linear-gradient(135deg, #f0f9ff, #faf5ff);
    padding: 1.5rem;
    border-radius: 0.75rem;
    border: 1px solid #e0e7ff;
    margin-bottom: 1rem;
}

.education-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.degree {
    font-size: 1rem;
    font-weight: bold;
    color: #111827;
}

.school {
    font-size: 0.875rem;
    font-weight: 600;
    color: #2563eb;
    margin-top: 0.25rem;
}

.year {
    color: #6b7280;
    font-weight: 500;
    font-size: 0.875rem;
}

/* Skills Styles */
.skills-container {
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
}

/* Footer */
.footer {
    text-align: center;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #e5e7eb;
    color: #6b7280;
    font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 640px) {
    .container {
        padding: 1rem;
    }
    
    .name {
        font-size: 2rem;
    }
    
    .experience-header,
    .education-header {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .date,
    .year {
        margin-top: 0.5rem;
    }
}
`;
}

// Generate package.json for Vercel deployment
function generatePackageJson(name: string): string {
  return JSON.stringify({
    name: `portfolio-${name.toLowerCase().replace(/\s+/g, '-')}`,
    version: "1.0.0",
    description: `Portfolio website for ${name}`,
    main: "index.html",
    scripts: {
      "start": "serve .",
      "build": "echo 'No build step required'"
    },
    keywords: ["portfolio", "resume", "professional"],
    author: name,
    license: "MIT"
  }, null, 2);
} 