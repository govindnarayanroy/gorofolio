# Test info

- Name: Landing Page >> features section displays correctly
- Location: /Users/govindroy/Documents/gorofolio/tests/e2e/landing-page.spec.ts:37:7

# Error details

```
Error: expect.toBeVisible: Error: strict mode violation: getByText('AI Portfolio Builder') resolved to 2 elements:
    1) <h3 class="text-2xl font-black text-gray-900 mb-6 text-center group-hover:text-gray-700 transition-colors leading-tight">AI Portfolio Builder</h3> aka getByRole('heading', { name: 'AI Portfolio Builder' })
    2) <span>AI Portfolio Builder</span> aka getByRole('link', { name: 'AI Portfolio Builder' })

Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByText('AI Portfolio Builder')

    at /Users/govindroy/Documents/gorofolio/tests/e2e/landing-page.spec.ts:42:58
```

# Page snapshot

```yaml
- img "GoRoFolio"
- text: AI-Powered Career Platform
- heading "Build YourPersonal Brand& Land Your Dream Job" [level=1]
- text: in Minutes
- paragraph: Transform your raw resume into a polished portfolio, ATS-ready résumé, tailored cover letters, and AI-driven mock interviews.
- link "Get Started Free":
  - /url: /login
  - text: Get Started Free
  - img
- link "Watch Demo":
  - /url: /demo
  - img
  - text: Watch Demo
- img
- text: No Credit Card Required
- img
- text: Under 5 Minutes Portfolio Ready
- img
- text: ATS-Optimized Results POWERFUL FEATURES
- heading "Everything You Need to Land Your Dream Job" [level=2]
- paragraph: Our AI-powered platform streamlines your job search with intelligent tools designed for modern professionals
- heading "AI Portfolio Builder" [level=3]
- paragraph: Generate a fully hosted portfolio site from your resume or LinkedIn in seconds—custom subdomain and exportable HTML included.
- text: "01"
- heading "ATS‑Ready Résumé Generator" [level=3]
- paragraph: Auto‑format your résumé for applicant tracking systems with keyword analysis and real‑time optimization.
- text: "02"
- heading "Tailored Cover Letters" [level=3]
- paragraph: Write job‑specific cover letters with one click, using your profile data and the target job description.
- text: "03"
- heading "Personalized Job Alerts" [level=3]
- paragraph: Stay ahead of the curve with AI‑filtered job recommendations delivered straight to your inbox.
- text: "04"
- heading "AI Mock Interviewer" [level=3]
- paragraph: Practice real‑world interview questions with an AI interviewer that scores your answers and provides instant feedback.
- text: 05 GET STARTED TODAY
- heading "Ready to transform your career?" [level=3]
- paragraph: Join thousands of professionals who've accelerated their job search with AI-powered tools
- button "Start Building Your Portfolio":
  - text: Start Building Your Portfolio
  - img
- button "Watch Demo":
  - img
  - text: Watch Demo
- img
- text: No Credit Card Required
- img
- text: Setup in Under 5 Minutes
- img
- text: ATS-Optimized Results PLATFORM INTEGRATIONS
- heading "Connect All Your Professional Platforms" [level=2]
- paragraph: Seamlessly sync your profiles and showcase your work across multiple platforms with one unified portfolio
- heading "LinkedIn" [level=3]
- paragraph: Professional networking
- text: "1"
- heading "GitHub" [level=3]
- paragraph: Code repositories
- text: "2"
- heading "Dribbble" [level=3]
- paragraph: Design showcase
- text: "3"
- heading "Behance" [level=3]
- paragraph: Creative portfolio
- text: "4"
- heading "Portfolio" [level=3]
- paragraph: Personal website
- text: "5"
- heading "Custom Domain" [level=3]
- paragraph: Your own URL
- text: 6 ONE-CLICK SYNC
- heading "Sync Once, Showcase Everywhere" [level=3]
- paragraph: Import your professional data from any platform and automatically generate a unified, beautiful portfolio that showcases all your work in one place.
- img
- text: Automatic Data Import
- img
- text: Real-time Sync
- img
- text: Secure & Private
- contentinfo:
  - heading "Stay Updated" [level=3]
  - paragraph: Get the latest career tips and platform updates delivered to your inbox
  - textbox "Enter your email"
  - button "Subscribe"
  - img "GoRoFolio"
  - text: GoRoFolio
  - paragraph: Your AI-powered career companion for building personal brands, optimizing resumes, and landing dream jobs in the modern job market.
  - link:
    - /url: "#"
  - link:
    - /url: "#"
  - link:
    - /url: "#"
  - link:
    - /url: "#"
  - heading "Product" [level=3]
  - list:
    - listitem:
      - link "AI Portfolio Builder":
        - /url: /dashboard
    - listitem:
      - link "Resume Generator":
        - /url: /dashboard/preview
    - listitem:
      - link "Mock Interview":
        - /url: /dashboard/interview
    - listitem:
      - link "Pricing":
        - /url: /pricing
  - heading "Company" [level=3]
  - list:
    - listitem:
      - link "About Us":
        - /url: /about
    - listitem:
      - link "Privacy Policy":
        - /url: /privacy
    - listitem:
      - link "Terms of Service":
        - /url: /terms
    - listitem:
      - link "Contact":
        - /url: /contact
  - paragraph: © 2025 GoRoFolio. All rights reserved. Built with ❤️ for modern professionals.
  - link "System Status":
    - /url: /status
  - link "Changelog":
    - /url: /changelog
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test.describe('Landing Page', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('/')
   6 |   })
   7 |
   8 |   test('has correct title and meta description', async ({ page }) => {
   9 |     await expect(page).toHaveTitle(/GoRoFolio/)
   10 |     
   11 |     const metaDescription = page.locator('meta[name="description"]')
   12 |     await expect(metaDescription).toHaveAttribute('content', /AI‑powered résumé, portfolio & interview coach/)
   13 |   })
   14 |
   15 |   test('renders hero section correctly', async ({ page }) => {
   16 |     // Check main heading
   17 |     await expect(page.getByRole('heading', { name: /Launch your career in minutes/i })).toBeVisible()
   18 |     
   19 |     // Check description
   20 |     await expect(page.getByText(/AI‑generated portfolio, résumé & real‑time interview coach/)).toBeVisible()
   21 |     
   22 |     // Check CTA buttons
   23 |     await expect(page.getByRole('link', { name: /get started free/i })).toBeVisible()
   24 |     await expect(page.getByRole('link', { name: /watch demo/i })).toBeVisible()
   25 |   })
   26 |
   27 |   test('navigation works correctly', async ({ page }) => {
   28 |     // Test "Get Started Free" button
   29 |     const getStartedButton = page.getByRole('link', { name: /get started free/i })
   30 |     await expect(getStartedButton).toHaveAttribute('href', '/dashboard')
   31 |     
   32 |     // Click and verify navigation (would need auth in real app)
   33 |     await getStartedButton.click()
   34 |     await expect(page).toHaveURL(/\/dashboard/)
   35 |   })
   36 |
   37 |   test('features section displays correctly', async ({ page }) => {
   38 |     // Scroll to features section
   39 |     await page.getByText('Features').scrollIntoViewIfNeeded()
   40 |     
   41 |     // Check feature cards
>  42 |     await expect(page.getByText('AI Portfolio Builder')).toBeVisible()
      |                                                          ^ Error: expect.toBeVisible: Error: strict mode violation: getByText('AI Portfolio Builder') resolved to 2 elements:
   43 |     await expect(page.getByText('ATS‑Ready Résumé Generator')).toBeVisible()
   44 |     await expect(page.getByText('Smart Cover Letter Writer')).toBeVisible()
   45 |     await expect(page.getByText('Mock Interview Coach')).toBeVisible()
   46 |     await expect(page.getByText('Real‑Time Feedback')).toBeVisible()
   47 |   })
   48 |
   49 |   test('integrations section shows platforms', async ({ page }) => {
   50 |     // Scroll to integrations
   51 |     await page.getByText('Integrations').scrollIntoViewIfNeeded()
   52 |     
   53 |     // Check integration platforms
   54 |     await expect(page.getByText('LinkedIn')).toBeVisible()
   55 |     await expect(page.getByText('GitHub')).toBeVisible()
   56 |     await expect(page.getByText('Dribbble')).toBeVisible()
   57 |     await expect(page.getByText('Portfolio')).toBeVisible()
   58 |     await expect(page.getByText('Resume')).toBeVisible()
   59 |     await expect(page.getByText('Interview')).toBeVisible()
   60 |   })
   61 |
   62 |   test('animations are working', async ({ page }) => {
   63 |     // Check for animation classes
   64 |     const heroSection = page.locator('section').first()
   65 |     await expect(heroSection).toHaveClass(/animate-fade-in-up|animation-delay/)
   66 |     
   67 |     // Check gradient animation
   68 |     const gradientText = page.locator('.animate-gradient-x')
   69 |     await expect(gradientText).toBeVisible()
   70 |   })
   71 |
   72 |   test('responsive design works', async ({ page }) => {
   73 |     // Test mobile viewport
   74 |     await page.setViewportSize({ width: 375, height: 667 })
   75 |     await expect(page.getByRole('heading', { name: /Launch your career/i })).toBeVisible()
   76 |     
   77 |     // Test tablet viewport
   78 |     await page.setViewportSize({ width: 768, height: 1024 })
   79 |     await expect(page.getByRole('heading', { name: /Launch your career/i })).toBeVisible()
   80 |     
   81 |     // Test desktop viewport
   82 |     await page.setViewportSize({ width: 1920, height: 1080 })
   83 |     await expect(page.getByRole('heading', { name: /Launch your career/i })).toBeVisible()
   84 |   })
   85 |
   86 |   test('trust indicators are visible', async ({ page }) => {
   87 |     await expect(page.getByText(/trusted by 10,000\+ job seekers/i)).toBeVisible()
   88 |     await expect(page.getByText(/95% success rate/i)).toBeVisible()
   89 |     await expect(page.getByText(/avg 3x more interviews/i)).toBeVisible()
   90 |   })
   91 |
   92 |   test('page loads within performance budget', async ({ page }) => {
   93 |     const startTime = Date.now()
   94 |     await page.goto('/')
   95 |     await page.waitForLoadState('networkidle')
   96 |     const loadTime = Date.now() - startTime
   97 |     
   98 |     // Page should load within 3 seconds
   99 |     expect(loadTime).toBeLessThan(3000)
  100 |   })
  101 |
  102 |   test('accessibility standards are met', async ({ page }) => {
  103 |     // Check for proper heading hierarchy
  104 |     const h1 = page.getByRole('heading', { level: 1 })
  105 |     await expect(h1).toBeVisible()
  106 |     
  107 |     // Check for alt text on images
  108 |     const images = page.locator('img')
  109 |     const imageCount = await images.count()
  110 |     
  111 |     for (let i = 0; i < imageCount; i++) {
  112 |       const img = images.nth(i)
  113 |       await expect(img).toHaveAttribute('alt')
  114 |     }
  115 |     
  116 |     // Check for proper link accessibility
  117 |     const links = page.getByRole('link')
  118 |     const linkCount = await links.count()
  119 |     
  120 |     for (let i = 0; i < linkCount; i++) {
  121 |       const link = links.nth(i)
  122 |       await expect(link).toHaveAttribute('href')
  123 |     }
  124 |   })
  125 | }) 
```