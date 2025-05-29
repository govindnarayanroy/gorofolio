# Test info

- Name: Interview Abort Dialog >> shows confirmation dialog when trying to leave active interview
- Location: /Users/govindroy/Documents/gorofolio/tests/interview-dialog.spec.ts:15:7

# Error details

```
Error: page.waitForSelector: Target page, context or browser has been closed
Call log:
  - waiting for locator('text=Question 1 / 10') to be visible

    at /Users/govindroy/Documents/gorofolio/tests/interview-dialog.spec.ts:12:16
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Interview Abort Dialog', () => {
   4 |   test.beforeEach(async ({ page }) => {
   5 |     // Navigate to interview session page
   6 |     await page.goto('/dashboard/interview/session?domain=general');
   7 |     
   8 |     // Start the interview
   9 |     await page.click('button:has-text("Start Interview")');
  10 |     
  11 |     // Wait for the interview to be active
> 12 |     await page.waitForSelector('text=Question 1 / 10');
     |                ^ Error: page.waitForSelector: Target page, context or browser has been closed
  13 |   });
  14 |
  15 |   test('shows confirmation dialog when trying to leave active interview', async ({ page }) => {
  16 |     // Click the back to dashboard button
  17 |     await page.click('button:has-text("Back to Dashboard")');
  18 |     
  19 |     // Verify dialog appears
  20 |     const dialog = await page.waitForSelector('text=Abort Interview?');
  21 |     expect(dialog).toBeTruthy();
  22 |     
  23 |     // Verify warning message
  24 |     const warningText = await page.textContent('text=You are currently in an active interview session');
  25 |     expect(warningText).toContain('your progress will be lost');
  26 |   });
  27 |
  28 |   test('stays on interview page when clicking Continue Interview', async ({ page }) => {
  29 |     // Click the back to dashboard button
  30 |     await page.click('button:has-text("Back to Dashboard")');
  31 |     
  32 |     // Click Continue Interview
  33 |     await page.click('button:has-text("Continue Interview")');
  34 |     
  35 |     // Verify still on interview page
  36 |     await expect(page).toHaveURL(/.*\/interview\/session/);
  37 |     
  38 |     // Verify interview is still active
  39 |     await expect(page.locator('text=Question 1 / 10')).toBeVisible();
  40 |   });
  41 |
  42 |   test('navigates to dashboard when confirming abort', async ({ page }) => {
  43 |     // Click the back to dashboard button
  44 |     await page.click('button:has-text("Back to Dashboard")');
  45 |     
  46 |     // Click Yes, Abort Interview
  47 |     await page.click('button:has-text("Yes, Abort Interview")');
  48 |     
  49 |     // Verify navigation to dashboard
  50 |     await expect(page).toHaveURL(/.*\/dashboard/);
  51 |   });
  52 | }); 
```