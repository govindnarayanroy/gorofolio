# Test info

- Name: Editor Workflow >> can add external links
- Location: /Users/govindroy/Documents/gorofolio/tests/e2e/editor-workflow.spec.ts:31:7

# Error details

```
Error: locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByText('External Links')

    at /Users/govindroy/Documents/gorofolio/tests/e2e/editor-workflow.spec.ts:32:44
```

# Page snapshot

```yaml
- link "GoRoFolio":
  - /url: /
  - img "GoRoFolio"
- heading "Welcome to GoRoFolio" [level=1]
- paragraph: Sign in to your account
- text: Email address
- textbox "Email address"
- text: Password
- textbox "Password"
- button "Sign In"
- button "Don't have an account? Sign up"
- link "← Back to Home":
  - /url: /
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | test.describe('Editor Workflow', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     await page.goto('/dashboard/editor')
   6 |     await page.waitForLoadState('networkidle')
   7 |   })
   8 |
   9 |   test('editor page loads correctly', async ({ page }) => {
  10 |     await expect(page.getByText('Edit Your Professional Profile')).toBeVisible()
  11 |     await expect(page.getByRole('button', { name: /back to dashboard/i })).toBeVisible()
  12 |     await expect(page.getByText('Personal Information')).toBeVisible()
  13 |     await expect(page.getByText('Work Experience')).toBeVisible()
  14 |   })
  15 |
  16 |   test('can add new experience with auto-scroll', async ({ page }) => {
  17 |     const initialExperiences = await page.locator('[data-experience-index]').count()
  18 |     
  19 |     await page.getByRole('button', { name: /add experience/i }).click()
  20 |     await page.waitForTimeout(500)
  21 |     
  22 |     const newExperienceCount = await page.locator('[data-experience-index]').count()
  23 |     expect(newExperienceCount).toBe(initialExperiences + 1)
  24 |     
  25 |     const lastExperience = page.locator('[data-experience-index]').last()
  26 |     await expect(lastExperience).toBeInViewport()
  27 |     
  28 |     await expect(page.getByText('New experience added!')).toBeVisible()
  29 |   })
  30 |
  31 |   test('can add external links', async ({ page }) => {
> 32 |     await page.getByText('External Links').scrollIntoViewIfNeeded()
     |                                            ^ Error: locator.scrollIntoViewIfNeeded: Test timeout of 30000ms exceeded.
  33 |     
  34 |     await page.getByPlaceholder('Link label').fill('GitHub')
  35 |     await page.getByPlaceholder('URL').fill('https://github.com/testuser')
  36 |     await page.getByRole('button', { name: /add link/i }).click()
  37 |     
  38 |     await expect(page.getByText('GitHub: https://github.com/testuser')).toBeVisible()
  39 |   })
  40 |
  41 |   test('can save draft', async ({ page }) => {
  42 |     await page.getByPlaceholder('Full Name').fill('Test User')
  43 |     await page.getByPlaceholder('Email Address').fill('test@example.com')
  44 |     
  45 |     await page.getByRole('button', { name: /save draft/i }).click()
  46 |     await expect(page.getByText('Draft saved successfully')).toBeVisible()
  47 |   })
  48 | }) 
```