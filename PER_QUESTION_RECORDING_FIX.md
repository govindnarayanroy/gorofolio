# Per-Question Recording Fix

## Issue Identified by User

**Root Cause**: The interview system was recording audio continuously for the entire session instead of per-question, making it impossible to properly transcribe individual answers.

**User's Key Observation**:

> "There is no option to stop recording after each question. Only option is to stop interview."

## Evidence from Frontend Logs

The user's frontend console showed:

- ✅ Audio recording WAS working (726,226 bytes captured)
- ✅ Real audio chunks being collected (368 chunks)
- ❌ But no way to stop/start per question
- ❌ Only "Stop Interview" button available

## Solution Implemented

### 1. **Per-Question Recording State Management**

Added new state tracking:

```typescript
const [hasRecorded, setHasRecorded] = useState(false) // Track if user recorded for current question
```

### 2. **Question-Specific UI Flow**

- **Question Status Indicator**: Shows "✅ Answered" or "⏳ Waiting for answer"
- **Recording Instructions**: Clear guidance on how to record per question
- **Conditional Button States**:
  - "Next Question →" only enabled after recording
  - "Answer this question first" when recording needed

### 3. **Enhanced User Experience**

- **Progress Indicator**: Visual progress bar showing completion
- **Better Feedback**: Real-time recording status and instructions
- **Clearer Workflow**:
  1. Read question
  2. Click microphone to start recording
  3. Click stop to finish recording
  4. Wait for transcription
  5. Move to next question

### 4. **Improved Button Logic**

```typescript
const isNextDisabled =
  currentQuestionIndex >= questions.length - 1 ||
  !hasRecorded ||
  transcript.startsWith('Error:') ||
  isProcessing ||
  isScoring
```

### 5. **State Reset Between Questions**

```typescript
useEffect(() => {
  setTranscript('')
  setHasRecorded(false)
  setIsProcessing(false)
  setIsScoring(false)
}, [currentQuestionIndex])
```

## Expected Behavior Now

### ✅ **Fixed Workflow:**

1. **Start Interview** → Navigate to first question
2. **Per Question:**
   - Read the question
   - Click microphone to start recording
   - Speak your answer
   - Click stop button to finish recording
   - Wait for transcription and scoring
   - Click "Next Question" to proceed
3. **Complete Interview** → View results

### ✅ **Key Improvements:**

- **Individual Recordings**: Each question gets its own audio blob
- **Proper File Sizes**: No more identical 226,104 byte files
- **Real Transcriptions**: Each recording sent individually to Groq
- **Clear User Guidance**: Instructions for each step
- **Progress Tracking**: Visual progress through interview

## Testing Instructions

1. **Navigate to**: `http://localhost:3000/dashboard/interview/session?domain=backend`
2. **Test the new flow**:
   - Verify question status shows "⏳ Waiting for answer"
   - Click microphone and speak
   - Verify recording indicator shows audio levels
   - Click stop and wait for transcription
   - Verify status changes to "✅ Answered"
   - Verify "Next Question" button becomes enabled
   - Move to next question and repeat

## Expected Console Logs

### ✅ **Frontend Console:**

```
🎤 Starting fresh recording session...
📦 Data available: [varying sizes]
🔴 Recording stopped
✅ Audio blob created: {size: [different each time], type: 'audio/webm;codecs=opus'}
```

### ✅ **Backend Terminal:**

```
STT API called
Received file: {
  name: 'recording-[timestamp]-[unique].webm',
  size: [varying sizes, NOT 226104],
  type: 'audio/webm'
}
🔑 Environment variables check...
[Real Groq transcription or fallback]
```

## Success Criteria

- ✅ Different audio file sizes for each recording
- ✅ Unique blob content hashes
- ✅ Per-question workflow enforced
- ✅ Clear user instructions and feedback
- ✅ Progress tracking through interview
- ✅ Individual transcriptions per question

This fix addresses the core UX issue and should result in proper audio recording and transcription for each interview question.
