import { test, expect } from '@playwright/test';

test.describe('Interview Abort Dialog', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to interview session page
    await page.goto('/dashboard/interview/session?domain=general');
    
    // Start the interview
    await page.click('button:has-text("Start Interview")');
    
    // Wait for the interview to be active
    await page.waitForSelector('text=Question 1 / 10');
  });

  test('shows confirmation dialog when trying to leave active interview', async ({ page }) => {
    // Click the back to dashboard button
    await page.click('button:has-text("Back to Dashboard")');
    
    // Verify dialog appears
    const dialog = await page.waitForSelector('text=Abort Interview?');
    expect(dialog).toBeTruthy();
    
    // Verify warning message
    const warningText = await page.textContent('text=You are currently in an active interview session');
    expect(warningText).toContain('your progress will be lost');
  });

  test('stays on interview page when clicking Continue Interview', async ({ page }) => {
    // Click the back to dashboard button
    await page.click('button:has-text("Back to Dashboard")');
    
    // Click Continue Interview
    await page.click('button:has-text("Continue Interview")');
    
    // Verify still on interview page
    await expect(page).toHaveURL(/.*\/interview\/session/);
    
    // Verify interview is still active
    await expect(page.locator('text=Question 1 / 10')).toBeVisible();
  });

  test('navigates to dashboard when confirming abort', async ({ page }) => {
    // Click the back to dashboard button
    await page.click('button:has-text("Back to Dashboard")');
    
    // Click Yes, Abort Interview
    await page.click('button:has-text("Yes, Abort Interview")');
    
    // Verify navigation to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
  });
}); 