import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has correct title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/GoRoFolio/)
    
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /AI‑powered résumé, portfolio & interview coach/)
  })

  test('renders hero section correctly', async ({ page }) => {
    // Check main heading
    await expect(page.getByRole('heading', { name: /Launch your career in minutes/i })).toBeVisible()
    
    // Check description
    await expect(page.getByText(/AI‑generated portfolio, résumé & real‑time interview coach/)).toBeVisible()
    
    // Check CTA buttons
    await expect(page.getByRole('link', { name: /get started free/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /watch demo/i })).toBeVisible()
  })

  test('navigation works correctly', async ({ page }) => {
    // Test "Get Started Free" button
    const getStartedButton = page.getByRole('link', { name: /get started free/i })
    await expect(getStartedButton).toHaveAttribute('href', '/dashboard')
    
    // Click and verify navigation (would need auth in real app)
    await getStartedButton.click()
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('features section displays correctly', async ({ page }) => {
    // Scroll to features section
    await page.getByText('Features').scrollIntoViewIfNeeded()
    
    // Check feature cards
    await expect(page.getByText('AI Portfolio Builder')).toBeVisible()
    await expect(page.getByText('ATS‑Ready Résumé Generator')).toBeVisible()
    await expect(page.getByText('Smart Cover Letter Writer')).toBeVisible()
    await expect(page.getByText('Mock Interview Coach')).toBeVisible()
    await expect(page.getByText('Real‑Time Feedback')).toBeVisible()
  })

  test('integrations section shows platforms', async ({ page }) => {
    // Scroll to integrations
    await page.getByText('Integrations').scrollIntoViewIfNeeded()
    
    // Check integration platforms
    await expect(page.getByText('LinkedIn')).toBeVisible()
    await expect(page.getByText('GitHub')).toBeVisible()
    await expect(page.getByText('Dribbble')).toBeVisible()
    await expect(page.getByText('Portfolio')).toBeVisible()
    await expect(page.getByText('Resume')).toBeVisible()
    await expect(page.getByText('Interview')).toBeVisible()
  })

  test('animations are working', async ({ page }) => {
    // Check for animation classes
    const heroSection = page.locator('section').first()
    await expect(heroSection).toHaveClass(/animate-fade-in-up|animation-delay/)
    
    // Check gradient animation
    const gradientText = page.locator('.animate-gradient-x')
    await expect(gradientText).toBeVisible()
  })

  test('responsive design works', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.getByRole('heading', { name: /Launch your career/i })).toBeVisible()
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await expect(page.getByRole('heading', { name: /Launch your career/i })).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page.getByRole('heading', { name: /Launch your career/i })).toBeVisible()
  })

  test('trust indicators are visible', async ({ page }) => {
    await expect(page.getByText(/trusted by 10,000\+ job seekers/i)).toBeVisible()
    await expect(page.getByText(/95% success rate/i)).toBeVisible()
    await expect(page.getByText(/avg 3x more interviews/i)).toBeVisible()
  })

  test('page loads within performance budget', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    // Page should load within 3 seconds
    expect(loadTime).toBeLessThan(3000)
  })

  test('accessibility standards are met', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 })
    await expect(h1).toBeVisible()
    
    // Check for alt text on images
    const images = page.locator('img')
    const imageCount = await images.count()
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i)
      await expect(img).toHaveAttribute('alt')
    }
    
    // Check for proper link accessibility
    const links = page.getByRole('link')
    const linkCount = await links.count()
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i)
      await expect(link).toHaveAttribute('href')
    }
  })
}) 