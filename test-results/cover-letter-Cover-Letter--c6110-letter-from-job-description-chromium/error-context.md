# Test info

- Name: Cover Letter Generator >> generates a cover letter from job description
- Location: /Users/govindroy/Documents/gorofolio/tests/cover-letter.spec.ts:4:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Jane Doe"
Received string:    "As a seasoned Frontend Engineer with a passion for building React applications, I am excited to apply for the Senior Frontend Engineer role at [Company]. With over 4 years of experience in the field, I am confident in my ability to leverage my skills and expertise to drive success in your team.In my current role, I have successfully led the development of several high-traffic React applications, achieving a 30% increase in page load speed and a 25% reduction in bugs reported. I have also applied my strong TypeScript skills to refactor large codebases, increasing code maintainability by 40%. Additionally, my experience with Next.js has allowed me to build scalable and efficient applications that have received rave reviews from users.I am excited about the opportunity to bring my skills and experience to your team and contribute to the success of [Company]. Thank you for considering my application. I would be thrilled to discuss my qualifications further and explore how I can make a meaningful impact at your organization."
    at /Users/govindroy/Documents/gorofolio/tests/cover-letter.spec.ts:34:25
```

# Page snapshot

```yaml
- main:
  - heading "Cover Letter Generator" [level=1]
  - text: Tone
  - combobox "Tone":
    - option "Professional" [selected]
    - option "Friendly"
    - option "Enthusiastic"
  - text: Job Description
  - textbox "Job Description": "Senior Frontend Engineer We are looking for a Senior Frontend Engineer to join our team. The ideal candidate should have: - 5+ years of experience with React - Strong TypeScript skills - Experience with Next.js - Knowledge of modern web technologies"
  - button "Generate Cover Letter"
  - heading "Generated Cover Letter" [level=2]
  - paragraph: As a seasoned Frontend Engineer with a passion for building React applications, I am excited to apply for the Senior Frontend Engineer role at [Company]. With over 4 years of experience in the field, I am confident in my ability to leverage my skills and expertise to drive success in your team.
  - paragraph
  - paragraph: In my current role, I have successfully led the development of several high-traffic React applications, achieving a 30% increase in page load speed and a 25% reduction in bugs reported. I have also applied my strong TypeScript skills to refactor large codebases, increasing code maintainability by 40%. Additionally, my experience with Next.js has allowed me to build scalable and efficient applications that have received rave reviews from users.
  - paragraph
  - paragraph: I am excited about the opportunity to bring my skills and experience to your team and contribute to the success of [Company]. Thank you for considering my application. I would be thrilled to discuss my qualifications further and explore how I can make a meaningful impact at your organization.
- alert
- button "Open Next.js Dev Tools":
  - img
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test';
   2 |
   3 | test.describe('Cover Letter Generator', () => {
   4 |   test('generates a cover letter from job description', async ({ page }) => {
   5 |     // Navigate to the cover letter page
   6 |     await page.goto('/dashboard/cover');
   7 |
   8 |     // Fill in the job description
   9 |     const jobDescription = `
  10 |       Senior Frontend Engineer
  11 |       
  12 |       We are looking for a Senior Frontend Engineer to join our team. The ideal candidate should have:
  13 |       - 5+ years of experience with React
  14 |       - Strong TypeScript skills
  15 |       - Experience with Next.js
  16 |       - Knowledge of modern web technologies
  17 |     `;
  18 |     await page.fill('textarea#jd', jobDescription);
  19 |
  20 |     // Select a tone
  21 |     await page.selectOption('select#tone', 'professional');
  22 |
  23 |     // Click generate button
  24 |     await page.click('button:has-text("Generate Cover Letter")');
  25 |
  26 |     // Wait for the cover letter to appear
  27 |     await page.waitForSelector('div.prose');
  28 |
  29 |     // Verify the cover letter content
  30 |     const coverLetter = await page.textContent('div.prose');
  31 |     expect(coverLetter).toBeTruthy();
  32 |     
  33 |     // Verify it contains key elements
> 34 |     expect(coverLetter).toContain('Jane Doe'); // From mock profile
     |                         ^ Error: expect(received).toContain(expected) // indexOf
  35 |     expect(coverLetter).toContain('Frontend Engineer'); // From mock profile
  36 |     expect(coverLetter).toContain('React'); // From job description
  37 |     expect(coverLetter).toContain('TypeScript'); // From job description
  38 |
  39 |     // Verify it's properly formatted (3 paragraphs)
  40 |     const paragraphs = coverLetter?.split('\n\n').filter(p => p.trim());
  41 |     expect(paragraphs?.length).toBe(3);
  42 |   });
  43 |
  44 |   test('shows error for empty job description', async ({ page }) => {
  45 |     await page.goto('/dashboard/cover');
  46 |     
  47 |     // Try to generate without entering job description
  48 |     await page.click('button:has-text("Generate Cover Letter")');
  49 |     
  50 |     // Verify error message
  51 |     const error = await page.textContent('p.text-red-600');
  52 |     expect(error).toContain('Please enter a job description');
  53 |   });
  54 |
  55 |   test('handles API errors gracefully', async ({ page }) => {
  56 |     await page.goto('/dashboard/cover');
  57 |     
  58 |     // Mock API error
  59 |     await page.route('/api/generate/cover', async (route) => {
  60 |       await route.fulfill({
  61 |         status: 500,
  62 |         body: JSON.stringify({ error: 'Test error message' })
  63 |       });
  64 |     });
  65 |
  66 |     // Fill in job description and try to generate
  67 |     await page.fill('textarea#jd', 'Test job description');
  68 |     await page.click('button:has-text("Generate Cover Letter")');
  69 |     
  70 |     // Verify error message
  71 |     const error = await page.textContent('p.text-red-600');
  72 |     expect(error).toContain('Test error message');
  73 |   });
  74 | }); 
```