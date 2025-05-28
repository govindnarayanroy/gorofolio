# Environment Setup for Interview App

## Required API Keys

### 1. Groq API Key (for Speech-to-Text)

- Go to [Groq Console](https://console.groq.com/)
- Sign up or log in
- Navigate to API Keys section
- Create a new API key
- Copy the key (starts with `gsk_...`)

### 2. OpenAI API Key (for LLM Scoring)

- Go to [OpenAI Platform](https://platform.openai.com/)
- Sign up or log in
- Navigate to API Keys section
- Create a new API key
- Copy the key (starts with `sk-...`)

## Environment File Setup

Create a `.env.local` file in your project root with the following content:

```env
# Groq API Key for Speech-to-Text (Whisper)
GROQ_API_KEY=your_groq_api_key_here

# OpenAI API Key for LLM scoring
OPENAI_API_KEY=your_openai_api_key_here

# Development Environment
NODE_ENV=development
```

**Replace the placeholder values with your actual API keys.**

## Browser Requirements

### Microphone Permissions

- The app requires microphone access for audio recording
- When prompted, click "Allow" to grant microphone permissions
- If you accidentally denied permissions:
  1. Click the lock icon in your browser's address bar
  2. Set microphone to "Allow"
  3. Refresh the page

### Supported Browsers

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Testing Audio Recording

### Verification Steps

1. Start the development server: `pnpm dev`
2. Navigate to `/dashboard/interview/session?domain=backend`
3. Click the microphone button
4. Speak clearly for a few seconds
5. Click the stop button
6. Check console logs for:
   - Audio level indicators (should show percentage > 0 when speaking)
   - Blob size variations (should NOT be exactly 226,104 bytes every time)
   - Real Groq transcription (should show your actual words)

### Troubleshooting

#### Issue: All audio files are exactly 226,104 bytes

- **Problem**: MediaRecorder generating dummy data instead of real audio
- **Solutions**:
  1. Check microphone permissions
  2. Try a different browser
  3. Check if another app is using the microphone
  4. Restart the browser

#### Issue: Mock transcriptions instead of real speech-to-text

- **Problem**: Missing or invalid GROQ_API_KEY
- **Solutions**:
  1. Verify your Groq API key is correct in `.env.local`
  2. Check Groq console for API usage/errors
  3. Restart the development server after adding the key

#### Issue: Empty or silent recordings

- **Problem**: Microphone not capturing audio
- **Solutions**:
  1. Check microphone hardware connection
  2. Test microphone in other applications
  3. Check browser microphone permissions
  4. Try speaking louder during recording

## Development Commands

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Clear caches (if having issues)
rm -rf .next node_modules/.cache
pnpm install
pnpm dev
```

## Expected Behavior

When everything is working correctly:

1. **Audio Recording**:

   - Audio level indicator shows green bars when speaking
   - Different recording durations produce different file sizes
   - Console shows MediaRecorder capturing real audio chunks

2. **Speech-to-Text**:

   - Your actual spoken words appear in the transcript
   - Console shows "✅ Groq transcription successful"
   - No "fallback" or "mock" indicators in logs

3. **Interview Flow**:
   - Record answer → See real transcript → Get AI-powered score → Continue to next question
