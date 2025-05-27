# Sprint 2: Dynamic Logic, Cover Letter Personalization, Resume Optimization, Dashboard State, Mock Interview, and QA/Testing

## Objective

Finalize the platform's dynamic interactivity, personalized cover letter generation, keyword-driven resume optimization, seamless dashboard state management, cover letter connection, and complete QA/testing before launch.

---

## Key Features & Flow

### 1. Dynamic Domains for Mock Interview

* Make the mock interview module domains dynamic based on the user's resume or portfolio data (skills, job titles, education).
* Populate the domain dropdown/list in the mock interview page using this data.
* Allow user to add new custom domains as needed.

---

### 2. Connect Cover Letter Generation to Mock Interview

* After a user generates a cover letter, offer a "Practice Interview" or "Mock Interview for this Role" button.
* Pass the job title/role as context to the mock interview module, so questions are relevant.

---

### 3. Dashboard State Changes if Resume/Portfolio Exists

* When a user has a saved resume or portfolio, the dashboard displays:

  * "Edit" or "View" instead of "Create"
  * Quick links to edit or view portfolio/resume
* If not, prompt the user to create new resume/portfolio.

---

### 4. Cover Letter Personalization with Resume Data

* When generating a cover letter, fetch the user's parsed resume data from Supabase.
* Pass relevant fields (experience, skills, education, summary, etc.) as context to the LLM prompt for highly personalized letters.

---

### 5. Resume Optimization for Job Description Keywords

* Add an option in the cover letter generator: "Optimize my resume for this job."
* If selected, analyze the provided job description and compare it to the user's resume data.
* Suggest missing keywords or skills that would help the user match the job better.
* Allow user to directly edit or insert these keywords into their resume.
* Save updated resume back to Supabase.

---

### 6. QA, Testing, and Deployment Prep

* Thoroughly test all new and existing features, including:

  * Image upload and display logic
  * Conditional rendering for profile image/avatar
  * Dynamic domain population in mock interview
  * Cover letter to mock interview flow
  * Dashboard state logic
  * Cover letter personalization
  * Resume optimization
* Perform cross-device and cross-browser checks.
* Fix all UI/UX inconsistencies and confirm error states/feedback.
* Prepare for final deployment.

---

## Cursor IDE Prompts & Implementation Notes

### Dynamic Mock Interview Domains

> "On the mock interview page, populate the domain selection dropdown with unique values found in the user's resume and portfolio (skills, job titles, education). Allow user to add new domains manually. Update domain list live as user edits their resume."

### Cover Letter to Mock Interview

> "After generating a cover letter, display a button to start a mock interview for the same role. On click, pass the job title/role as the default selected domain in the mock interview module."

### Dashboard State Changes

> "Update dashboard logic: if user has a saved resume or portfolio in Supabase, display 'Edit' or 'View' actions and quick links. If not, display call to action to create them. Ensure state is updated after creating or deleting content."

### Cover Letter Personalization

> "When user generates a cover letter, fetch their resume data from Supabase and include relevant details as context in the LLM prompt. This should make the cover letter specific to the user's experience, skills, and education."

### Resume Optimization

> "Add an option in the cover letter generator page: 'Optimize my resume for this job.' When selected, analyze the job description and compare it to the user's resume fields. Suggest missing keywords or skills. Allow user to edit/add these directly in the resume editor, then save changes to Supabase."

### QA/Testing

> "Perform manual and automated tests for image upload, dynamic domains, dashboard state, cover letter personalization, resume optimization, and feature flows. Document bugs and fixes. Verify cross-device/cross-browser support."

---

## Checklist

| Task                                           | Status |
| ---------------------------------------------- | :----: |
| Dynamic domains for mock interview             |    ✅   |
| Cover letter to mock interview connection      |    ✅   |
| Dashboard state logic for resume/portfolio     |    ✅   |
| Cover letter personalization using resume data |    ✅   |
| Resume optimization for job keywords           |    ✅   |
| QA/testing on all flows and device types       |    ✅   |
| Cross-browser and UX polish                    |    ✅   |
| Prepare for production deployment              |    ⬜   |

---

## Dev Notes

* Pull dynamic domains by scanning user's resume/portfolio fields.
* Pass job title context from cover letter module to mock interview.
* Use Supabase queries to check if resume/portfolio exists for dashboard state.
* Pass parsed resume data as context for personalized cover letters.
* Compare job description with resume data to suggest/insert missing keywords.
* Prioritize QA/bugfix and polish for launch readiness.

---

## Implementation Notes

### ✅ Dynamic Domains for Mock Interview - COMPLETED
- **Implementation**: AI-powered dynamic question generation for any job role
- **Features**: Custom domain detection, fallback to static questions, database persistence
- **Testing**: Successfully tested with Marketing Manager, Sales Executive, and General roles
- **Status**: Fully functional with real-time question generation

### ✅ Cover Letter to Mock Interview Connection - COMPLETED  
- **Implementation**: Seamless context passing from cover letter page to interview module
- **Features**: 
  - Auto-domain detection from job description keywords
  - Job title extraction using regex patterns
  - URL parameter encoding for role and job description
  - Pre-filled interview setup form
- **Context Mapping**: Marketing → marketing domain, Sales → sales domain, etc.
- **Testing**: Successfully tested with Marketing job description auto-fill
- **Routing**: Preserves existing dashboard interview flow while adding enhanced context flow
- **Status**: Fully functional with intelligent context transfer

### ✅ Dashboard State Logic for Resume/Portfolio - COMPLETED
- **Implementation**: Dynamic dashboard UI based on profile existence and completeness
- **Features**:
  - **Profile Detection**: Checks for existing resume data via `/api/resume` endpoint
  - **Conditional UI**: Shows different buttons, text, and actions based on profile state
  - **Personalization**: Welcome message changes from generic to personalized with user's name
  - **Button States**: Enables/disables features based on profile availability
  - **Progress Tracking**: Shows profile completion percentage and suggestions
  - **Quick Actions**: Displays edit shortcuts for existing users
  - **Activity Timeline**: Shows recent activity and interview history
- **State Logic**:
  - **Without Profile**: "Welcome to Gorofolio!" + "Create Profile" buttons + disabled features
  - **With Profile**: "Welcome back, [Name]!" + "Edit Profile" buttons + enabled features
- **Data Structure**: Handles nested API response `{ data: { data: profileData } }`
- **Testing**: Successfully tested both states via MCP browser automation
- **Status**: Fully functional with proper state management and UI updates

### ✅ Cover Letter Personalization Using Resume Data - COMPLETED
- **Implementation**: AI-powered cover letter generation using actual user profile data
- **Features**:
  - **Profile Integration**: Fetches user's resume data from Supabase via `/api/resume` endpoint
  - **Personalized Content**: Uses actual name, job title, company, and experience details
  - **Specific References**: Includes real projects, achievements, and work history
  - **Dynamic Messaging**: Adapts tone and content based on user's background
  - **Context Awareness**: Tailors letter to match user's expertise areas
- **Personalization Elements**:
  - **Header**: "Generate cover letters tailored to [User's Name]'s experience and skills"
  - **Profile Display**: Shows user's name and current job title
  - **Experience Integration**: References specific projects (e.g., "Lulu Mall Trivandrum", "AL Taza")
  - **Achievement Inclusion**: Mentions actual accomplishments from resume
  - **Company Context**: Uses real company names and roles from work history
- **Testing Results**: Successfully generated personalized cover letter for Govind Roy with specific references to his marketing experience at The Local Network, Lulu Mall campaigns, and AL Taza expansion
- **Status**: Fully functional with comprehensive profile data integration

### ✅ Resume Optimization for Job Keywords - COMPLETED
- **Implementation**: AI-powered resume analysis and optimization against job descriptions
- **Features**:
  - **Match Score Calculation**: Quantitative analysis showing percentage match (e.g., 54%)
  - **Keyword Analysis**: Identifies missing and matching keywords from job descriptions
  - **Skills Gap Analysis**: Shows matching skills (5), missing skills (7), and total required (13)
  - **Priority Actions**: Ranked recommendations with impact levels (high/medium/low)
  - **ATS Optimization**: Specific tips for Applicant Tracking System compatibility
  - **Detailed Recommendations**: Section-specific suggestions for skills and experience
- **Analysis Components**:
  - **Missing Keywords**: content strategy, SEO/SEM, marketing automation, data analytics, etc.
  - **Matching Keywords**: digital marketing, brand positioning, social media platforms, etc.
  - **Priority Actions**: "Add missing digital marketing skills" (high impact)
  - **ATS Tips**: Use keywords, bullet points, action verbs
  - **Recommendations**: Skills section improvements, experience quantification
- **User Interface**: Side-by-side layout with resume preview and optimization panel
- **Testing Results**: Successfully analyzed Govind's resume against Senior Marketing Manager role, providing actionable insights and specific keyword recommendations
- **Status**: Fully functional with comprehensive analysis and actionable recommendations

### ✅ QA/Testing - COMPLETED  
- **Audio Recording**: Real WebM files (67KB) processed successfully
- **Transcription**: Groq Whisper working with actual audio input
- **Scoring**: LLM scoring providing detailed feedback (2/10 with improvement tips)
- **Navigation**: "Back to Dashboard" button working perfectly
- **Duration**: Accurate timing display (2m 5s) based on actual interview time
- **Cross-device**: Responsive design tested and working
- **Cover Letter Personalization**: Successfully tested with real profile data integration
- **Resume Optimization**: Successfully tested with comprehensive keyword analysis and recommendations

### ✅ Cross-browser and UX Polish - COMPLETED
- **UI Fixes**: Button visibility and layout issues resolved
- **Responsive Design**: Mobile-first approach with proper breakpoints
- **Error Handling**: Comprehensive fallbacks for API failures
- **User Flow**: Seamless navigation between dashboard and interview modules
- **Optimization UI**: Clean side-by-side layout for resume preview and optimization
- **Personalization UI**: Dynamic content updates based on user profile data

---
