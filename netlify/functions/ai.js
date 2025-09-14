exports.handler = async (event, context) => {
  console.log('🔍 Function called with action:', JSON.parse(event.body || '{}').action);
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { action, question, answer, conversationHistory = [] } = JSON.parse(event.body || '{}');
    console.log('🔍 Has Groq key:', !!process.env.GROQ_API_KEY);

    if (action === 'start') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Hi! I'm Alex, your AI Excel interviewer. I'll be conducting a comprehensive interview to assess your Excel skills across various areas including formulas, data analysis, pivot tables, and problem-solving approaches. \n\nThis will be a conversational interview where I'll adapt questions based on your responses, ask follow-ups when needed, and provide a detailed assessment at the end. The interview typically takes 8-12 questions. Ready to begin?",
          question: "Let's start with a foundational question: Can you walk me through how you would use VLOOKUP to find employee salaries from a separate table? Please explain your approach step-by-step, including how you'd handle cases where an employee isn't found.",
          conversationState: {
            topicsExplored: [],
            currentDepth: 'basic',
            questionCount: 1
          }
        })
      };
    }

    if (action === 'evaluate') {
      console.log('📝 Evaluating question:', question);
      console.log('📝 User answer:', answer);
      console.log('📝 Conversation history length:', conversationHistory.length);
      
      // Validate inputs
      if (!question || !answer) {
        console.log('❌ Missing question or answer');
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            error: 'Missing question or answer',
            score: 0,
            feedback: 'No response received. Please provide an answer to continue.',
            nextQuestion: 'Can you try answering the previous question?',
            shouldContinue: true
          })
        };
      }
      
      let evaluation;
      
      if (process.env.GROQ_API_KEY) {
        try {
          console.log('🤖 Attempting Groq call...');
          evaluation = await callGroqAPI(question, answer, conversationHistory);
        } catch (error) {
          console.log('❌ Groq Failed:', error.message);
          evaluation = intelligentFallback(question, answer, conversationHistory);
        }
      } else {
        console.log('⚠️ No Groq API key, using fallback');
        evaluation = intelligentFallback(question, answer, conversationHistory);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(evaluation)
      };
    }

    throw new Error('Invalid action');
    
  } catch (error) {
    console.error('💥 Handler error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        score: 0,
        feedback: 'There was a technical issue. Let me ask you a fresh question.',
        nextQuestion: 'Can you explain what Excel functions you use most frequently in your work?',
        shouldContinue: true
      })
    };
  }
};

async function callGroqAPI(question, answer, conversationHistory = []) {
  console.log('🚀 Making Groq API request...');
  
  const questionCount = conversationHistory.length + 1;
  const averageScore = conversationHistory.length > 0 
    ? conversationHistory.reduce((sum, h) => sum + h.score, 0) / conversationHistory.length 
    : 0;
  
  // Check for consecutive minimal responses
  const consecutiveMinimal = conversationHistory.slice(-3).filter(h => {
    const ans = h.answer?.toLowerCase() || '';
    return ans.length < 5 || ['nope', 'idk', 'no', "i don't know", 'ope', 'mope'].includes(ans);
  }).length;
  
  const topicsExplored = [...new Set(conversationHistory.map(h => h.currentTopic || 'general'))];
  
  const historyContext = conversationHistory.length > 0 
    ? `\n\nCONVERSATION HISTORY (Recent ${Math.min(3, conversationHistory.length)} exchanges):\n${conversationHistory.slice(-3).map((item, i) => 
        `Q: ${item.question}\nA: ${item.answer}\nScore: ${item.score}/10\nTopic: ${item.currentTopic || 'general'}`
      ).join('\n\n')}` 
    : '';
  
  const prompt = `You are Alex, a friendly but professional Excel interviewer. You have a warm, encouraging personality and conduct efficient, intelligent interviews.

CURRENT SITUATION:
- Question #${questionCount}
- Current Question: ${question}
- Candidate's Answer: ${answer}
- Average Score So Far: ${averageScore.toFixed(1)}/10
- Consecutive Minimal Responses: ${consecutiveMinimal}
- Topics Explored: ${topicsExplored.join(', ')}
${historyContext}

INTERVIEW RULES:
1. **CONCLUDE INTERVIEW IF:**
   - 8+ questions asked (hard limit for efficiency)
   - Candidate clearly struggling (average < 2.0 after 5+ questions)
   - 3+ consecutive minimal responses ("nope", "idk", single letters)
   - Clear skill level established (very high or very low performance)
   - Candidate requests to end or asks for report

2. **ALEX'S PERSONALITY:**
   - Supportive for struggling candidates: "I can see Excel isn't your strong area yet, and that's perfectly okay."
   - Professional but encouraging: "I appreciate you working through this with me."
   - Decisive: End interviews efficiently when pattern is clear
   - Honest but kind: Provide constructive feedback

3. **TOPIC CLASSIFICATION:**
   - Assign specific topics: "vlookup", "basic_formulas", "data_analysis", "pivot_tables", "advanced_functions", "basic_concepts"
   - Don't stay on same topic more than 3 questions
   - For struggling candidates, focus on "basic_concepts" and "simple_formulas"

4. **ADAPTIVE QUESTIONING:**
   - High performers (7+): Challenge with advanced scenarios
   - Medium performers (4-6): Build on strengths, fill gaps
   - Low performers (<4): Very basic concepts, encourage learning
   - Minimal responders: Conclude gracefully with guidance

5. **INTERVIEW EFFICIENCY:**
   - For very low performers: 5-6 questions maximum
   - For clear patterns: Don't over-test
   - Always end with constructive guidance

RESPOND WITH VALID JSON ONLY:
{
  "score": <0-10 number>,
  "feedback": "<Alex's supportive, specific feedback (2-3 sentences)>",
  "nextQuestion": "<Next question OR conclusion message>",
  "shouldContinue": <true/false - be decisive>,
  "reasoning": "<Brief decision rationale>",
  "currentTopic": "<specific topic classification>",
  "interviewPhase": "<beginning/middle/concluding>"
}

EXAMPLE ALEX RESPONSES:
- Struggling candidate: "I can see you're honest about your current Excel level, which I appreciate. Let's focus on where you might start your learning journey."
- Good performer: "That's a solid understanding! Let me explore your knowledge in a different area."
- Conclusion: "Based on our conversation, I have a clear picture of your Excel skills. Let me provide you with a comprehensive assessment."

Be Alex - supportive, professional, and efficiently decisive about interview management.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are Alex, an expert Excel interviewer with a supportive personality. You conduct efficient, intelligent interviews and make smart decisions about when to continue vs conclude. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 0.9
    }),
  });

  console.log('📡 Groq response status:', response.status);

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  
  try {
    // Try to extract JSON if it's wrapped in other text
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const jsonContent = jsonMatch ? jsonMatch[0] : content;
    const parsed = JSON.parse(jsonContent);
    
    // Ensure required fields exist
    return {
      score: parsed.score || 0,
      feedback: parsed.feedback || "Let me continue with the next question.",
      nextQuestion: parsed.nextQuestion || "Can you tell me about your general Excel experience?",
      shouldContinue: parsed.shouldContinue !== undefined ? parsed.shouldContinue : true,
      reasoning: parsed.reasoning || "AI evaluation",
      currentTopic: parsed.currentTopic || "general",
      interviewPhase: parsed.interviewPhase || "middle"
    };
  } catch (parseError) {
    console.log('🔄 JSON parse failed, using fallback');
    return intelligentFallback(question, answer, conversationHistory);
  }
}

function intelligentFallback(question, answer, conversationHistory = []) {
  console.log('🔄 Using intelligent fallback analysis...');
  
  // Safety check for undefined inputs
  if (!question || !answer) {
    return {
      score: 0,
      feedback: "I didn't receive a clear answer. Could you please elaborate on your response?",
      nextQuestion: "Let's try a different approach. Can you tell me about your experience with Excel in general?",
      shouldContinue: true,
      reasoning: "Missing input parameters",
      currentTopic: "general",
      interviewPhase: "middle"
    };
  }
  
  const lowerAnswer = answer.toLowerCase().trim();
  const lowerQuestion = question.toLowerCase();
  const questionCount = conversationHistory.length + 1;
  const averageScore = conversationHistory.length > 0 
    ? conversationHistory.reduce((sum, h) => sum + h.score, 0) / conversationHistory.length 
    : 0;
  
  // Enhanced ending conditions for struggling candidates
  const consecutiveMinimal = conversationHistory.slice(-3).filter(h => {
    const ans = h.answer?.toLowerCase() || '';
    return ans.length < 5 || ['nope', 'idk', 'no', "i don't know", 'ope', 'mope', 'nlo', 'gimme report'].includes(ans);
  }).length;

  const shouldEnd = (
    questionCount >= 8 || // Hard limit
    (questionCount >= 5 && averageScore < 2.0) || // Struggling candidate
    (consecutiveMinimal >= 3 && questionCount >= 5) || // Minimal responses
    (questionCount >= 6 && averageScore < 3.0) || // Clear low pattern
    (lowerAnswer.includes("gimme report") || lowerAnswer.includes("pass me")) // Explicit request
  );
  
  let score = 0;
  let feedback = "";
  let currentTopic = "general";
  
  // Alex's supportive personality phrases
  const alexPersonality = {
    encouraging: [
      "I appreciate your honesty about your Excel level",
      "Thanks for being straightforward with me",
      "I can see you're trying to work through this"
    ],
    supportive: [
      "Excel isn't everyone's strong area, and that's perfectly okay",
      "Let me help you understand where you might start your learning journey",
      "Based on our conversation, I can provide some helpful guidance"
    ],
    professional: [
      "Let me try a different approach",
      "Based on our conversation so far",
      "I have a clear picture of your current level"
    ]
  };
  
  // Analyze the answer quality with Alex's personality
  if (lowerAnswer.includes("don't know") || lowerAnswer.includes("no idea") || lowerAnswer === "nope" || 
      lowerAnswer === "no" || lowerAnswer.length < 4 || lowerAnswer.match(/^[a-z]{1,3}$/)) {
    score = 0;
    feedback = `${alexPersonality.encouraging[Math.floor(Math.random() * alexPersonality.encouraging.length)]}, but I was hoping for at least an attempt to explain the concept.`;
  } else if (lowerAnswer.includes("sum") || lowerAnswer.includes("average") || lowerAnswer.includes("formula")) {
    score = 4;
    feedback = `${alexPersonality.professional[1]}, you show some familiarity with Excel basics. That's a good starting point.`;
    currentTopic = "basic_formulas";
  } else if (lowerAnswer.includes("vlookup") || lowerAnswer.includes("pivot") || lowerAnswer.includes("index")) {
    score = 6;
    feedback = `Good! You're familiar with some important Excel functions. I can see you have practical experience.`;
    currentTopic = "advanced_functions";
  } else if (lowerAnswer.includes("binary search") || lowerAnswer.includes("systematic") || lowerAnswer.includes("efficient")) {
    score = 7;
    feedback = `Excellent analytical thinking! You understand search concepts well, which translates nicely to Excel.`;
    currentTopic = "data_analysis";
  } else if (lowerAnswer.length > 20) {
    score = 3;
    feedback = `I appreciate the detailed response. Let me explore your Excel knowledge further.`;
  } else {
    score = 1;
    feedback = `${alexPersonality.encouraging[2]}, but I'd like to see more specific details in your explanations.`;
  }
  
  // DECISIVE INTERVIEW ENDING
  if (shouldEnd) {
    const supportiveEnding = averageScore < 3.0 
      ? `${alexPersonality.supportive[0]}. ${alexPersonality.supportive[1]}.`
      : `${alexPersonality.professional[2]} and can provide you with targeted recommendations.`;
      
    return {
      score: score,
      feedback: `${feedback} ${supportiveEnding}`,
      nextQuestion: `That concludes our Excel assessment. Let me prepare your comprehensive evaluation and learning recommendations.`,
      shouldContinue: false,
      reasoning: `Alex ended interview: Q${questionCount}, Avg: ${averageScore.toFixed(1)}, Consecutive minimal: ${consecutiveMinimal}`,
      currentTopic: currentTopic,
      interviewPhase: "concluding"
    };
  }
  
  // Continue with adaptive questioning based on performance
  let nextQuestion;
  if (averageScore < 2.0 && questionCount >= 3) {
    // Very basic questions for struggling candidates
    nextQuestion = "Let's try something fundamental: Can you tell me what you think the SUM function does in Excel, even if you're not sure about the syntax?";
    feedback += " Let me ask something more basic to understand your starting point.";
    currentTopic = "basic_concepts";
  } else if (score >= 6 && currentTopic !== "advanced_functions") {
    // Challenge good performers
    nextQuestion = "That's solid! Now, how would you handle errors in Excel formulas, like when a VLOOKUP can't find a match?";
    currentTopic = "advanced_functions";
  } else if (score >= 3 && questionCount <= 5) {
    // Build on partial knowledge
    nextQuestion = "Let's try a practical scenario: If you had sales data in Excel, how would you calculate the total for just one specific product category?";
    currentTopic = "practical_application";
  } else {
    // Default progression
    nextQuestion = "Can you describe a time when you used Excel to solve a real problem, even if it was something simple like tracking expenses?";
    currentTopic = "experience_based";
  }
  
  return {
    score: score,
    feedback: feedback,
    nextQuestion: nextQuestion,
    shouldContinue: true,
    reasoning: `Alex fallback: Q${questionCount}, Score: ${score}, Avg: ${averageScore.toFixed(1)}`,
    currentTopic: currentTopic,
    interviewPhase: questionCount < 3 ? "beginning" : "middle"
  };
}