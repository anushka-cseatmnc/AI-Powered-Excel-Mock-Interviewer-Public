# AI Excel Mock Interviewer

A conversational AI agent that conducts structured Excel skills assessments for hiring.

see Live - https://moonlit-flan-f672af.netlify.app/

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
├── netlify/functions/evaluate.js (Groq AI API  integration)
|- .env( Groq api key)
└── README.md
```
Output- 

<img width="1579" height="866" alt="Screenshot 2025-09-14 132420" src="https://github.com/user-attachments/assets/2ac16c29-ebf2-46a1-867c-e1c0cfc642b3" />

<img width="1356" height="875" alt="Screenshot 2025-09-14 132454" src="https://github.com/user-attachments/assets/2bb328fd-aa95-445c-a060-19b61df1fa91" />

<img width="1157" height="858" alt="Screenshot 2025-09-14 132616" src="https://github.com/user-attachments/assets/2ac0fd92-a6fe-4a5f-8d5c-0010e3167ea0" />

<img width="1232" height="880" alt="Screenshot 2025-09-14 132627" src="https://github.com/user-attachments/assets/5778eb36-1286-4151-848c-24e371077b17" />


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
- voice assitance 
- Analytics dashboard
- Multi-language support

---

**Total Build Time:** ~8 hours
**Deploy Time:** 5 minutes  
**Technologies:** Vanilla HTML/JS, OpenAI API, Netlify Functions
