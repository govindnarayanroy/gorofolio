import { test, expect } from '@playwright/test';

test.describe('Cover Letter Generator', () => {
  test('generates a cover letter from job description', async ({ page }) => {
    // Navigate to the cover letter page
    await page.goto('/dashboard/cover');

    // Fill in the job description
    const jobDescription = `
      Senior Frontend Engineer
      
      We are looking for a Senior Frontend Engineer to join our team. The ideal candidate should have:
      - 5+ years of experience with React
      - Strong TypeScript skills
      - Experience with Next.js
      - Knowledge of modern web technologies
    `;
    await page.fill('textarea#jd', jobDescription);

    // Select a tone
    await page.selectOption('select#tone', 'professional');

    // Click generate button
    await page.click('button:has-text("Generate Cover Letter")');

    // Wait for the cover letter to appear
    await page.waitForSelector('div.prose');

    // Verify the cover letter content
    const coverLetter = await page.textContent('div.prose');
    expect(coverLetter).toBeTruthy();
    
    // Verify it contains key elements
    expect(coverLetter).toContain('Jane Doe'); // From mock profile
    expect(coverLetter).toContain('Frontend Engineer'); // From mock profile
    expect(coverLetter).toContain('React'); // From job description
    expect(coverLetter).toContain('TypeScript'); // From job description

    // Verify it's properly formatted (3 paragraphs)
    const paragraphs = coverLetter?.split('\n\n').filter(p => p.trim());
    expect(paragraphs?.length).toBe(3);
  });

  test('shows error for empty job description', async ({ page }) => {
    await page.goto('/dashboard/cover');
    
    // Try to generate without entering job description
    await page.click('button:has-text("Generate Cover Letter")');
    
    // Verify error message
    const error = await page.textContent('p.text-red-600');
    expect(error).toContain('Please enter a job description');
  });

  test('handles API errors gracefully', async ({ page }) => {
    await page.goto('/dashboard/cover');
    
    // Mock API error
    await page.route('/api/generate/cover', async (route) => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Test error message' })
      });
    });

    // Fill in job description and try to generate
    await page.fill('textarea#jd', 'Test job description');
    await page.click('button:has-text("Generate Cover Letter")');
    
    // Verify error message
    const error = await page.textContent('p.text-red-600');
    expect(error).toContain('Test error message');
  });
}); 