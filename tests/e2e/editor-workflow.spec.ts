import { test, expect } from '@playwright/test'

test.describe('Editor Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/editor')
    await page.waitForLoadState('networkidle')
  })

  test('editor page loads correctly', async ({ page }) => {
    await expect(page.getByText('Edit Your Professional Profile')).toBeVisible()
    await expect(page.getByRole('button', { name: /back to dashboard/i })).toBeVisible()
    await expect(page.getByText('Personal Information')).toBeVisible()
    await expect(page.getByText('Work Experience')).toBeVisible()
  })

  test('can add new experience with auto-scroll', async ({ page }) => {
    const initialExperiences = await page.locator('[data-experience-index]').count()

    await page.getByRole('button', { name: /add experience/i }).click()
    await page.waitForTimeout(500)

    const newExperienceCount = await page.locator('[data-experience-index]').count()
    expect(newExperienceCount).toBe(initialExperiences + 1)

    const lastExperience = page.locator('[data-experience-index]').last()
    await expect(lastExperience).toBeInViewport()

    await expect(page.getByText('New experience added!')).toBeVisible()
  })

  test('can add external links', async ({ page }) => {
    await page.getByText('External Links').scrollIntoViewIfNeeded()

    await page.getByPlaceholder('Link label').fill('GitHub')
    await page.getByPlaceholder('URL').fill('https://github.com/testuser')
    await page.getByRole('button', { name: /add link/i }).click()

    await expect(page.getByText('GitHub: https://github.com/testuser')).toBeVisible()
  })

  test('can save draft', async ({ page }) => {
    await page.getByPlaceholder('Full Name').fill('Test User')
    await page.getByPlaceholder('Email Address').fill('test@example.com')

    await page.getByRole('button', { name: /save draft/i }).click()
    await expect(page.getByText('Draft saved successfully')).toBeVisible()
  })
})
