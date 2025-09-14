# AI Excel Mock Interviewer

A conversational AI agent that conducts structured Excel skills assessments for hiring.

## 🚀 Quick Deploy (5 minutes)

### Method 1: Netlify (Recommended)
1. Create account at [netlify.com](https://netlify.com)
2. Drag the `index.html` file to Netlify dashboard
3. Set environment variable: `OPENAI_API_KEY=your_key_here`
4. Done! Your app is live.

### Method 2: GitHub Pages
1. Create new repo: `excel-interviewer`
2. Upload `index.html`
3. Go to Settings > Pages > Deploy from main branch
4. Access at: `https://yourusername.github.io/excel-interviewer`

## 📁 File Structure
```
excel-interviewer/
├── index.html (complete application)
├── netlify/functions/evaluate.js (OpenAI integration - optional)
└── README.md
```

## ✅ Features Working Out of Box

### Agent Behaviors
- ✅ Multi-turn conversation flow
- ✅ State management & memory
- ✅ Adaptive questioning based on responses
- ✅ Real-time response analysis
- ✅ Professional interview simulation

### Technical Features
- ✅ 4 structured Excel questions
- ✅ Follow-up questions based on performance
- ✅ Scoring system (1-10 scale)
- ✅ Final performance report
- ✅ Progress tracking
- ✅ Responsive design

### Evaluation System
- ✅ Rule-based keyword scoring
- ✅ Length and detail analysis
- ✅ Category-specific evaluation
- ✅ Performance level classification

## 🎯 Interview Flow

1. **Introduction** (2 min)
   - Agent introduces itself
   - Explains the process
   - Waits for candidate confirmation

2. **Assessment** (15-20 min)
   - 4 core Excel questions
   - Adaptive follow-up questions
   - Real-time response evaluation

3. **Summary** (3 min)
   - Overall score and performance level
   - Category breakdown
   - Specific recommendations

## 🧪 Test Scenarios

### Test 1: Strong Candidate
- Answer VLOOKUP question with exact match, error handling
- Should score 8+/10, minimal follow-ups

### Test 2: Medium Candidate  
- Mention pivot tables but miss some steps
- Should score 5-7/10, get follow-up questions

### Test 3: Weak Candidate
- Give vague answers
- Should score <5/10, multiple follow-ups

## 🔧 Environment Variables (Optional)

For advanced AI evaluation:
```
OPENAI_API_KEY=sk-your-openai-key
```

Without API key, uses rule-based evaluation (still fully functional).

## 🎨 Customization

### Add Questions
Edit `questions` array in HTML file:
```javascript
{
    id: 5,
    category: "Your Category",
    text: "Your question here?",
    followups: ["Follow-up 1?", "Follow-up 2?"]
}
```

### Modify Scoring
Update `evaluateResponse()` function with your keywords and weights.

### Styling
Edit CSS section for branding/colors.

## 📊 Success Metrics

- ✅ Complete interview flow (intro → questions → summary)
- ✅ Consistent scoring across similar answers
- ✅ Appropriate follow-up question triggers  
- ✅ Professional, coherent conversation
- ✅ Detailed performance feedback

## 🚨 No-Crash Guarantees

- ✅ Error handling for API failures
- ✅ Fallback evaluation system
- ✅ Input validation
- ✅ State persistence in browser
- ✅ No external dependencies that can break

## 📈 Future Enhancements

- Screen sharing for live Excel demos
- Integration with ATS systems
- Advanced AI with custom Excel training
- Analytics dashboard
- Multi-language support

---

**Total Build Time:** ~8 hours
**Deploy Time:** 5 minutes  
**Technologies:** Vanilla HTML/JS, OpenAI API, Netlify Functions