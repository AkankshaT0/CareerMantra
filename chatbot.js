// ============= CHATBOT CONFIGURATION =============
// AI requests are sent through the backend so API keys are never exposed in browser code.
const CHATBOT_API_URL = "http://localhost:3000/chat";

// Career guidance knowledge base for quick responses
const CAREER_RESPONSES = {
  // Career-related responses
  'skill development': 'Great question! To develop new skills, I recommend: 1) Identify your goal skills, 2) Find quality online courses on Coursera or Udemy, 3) Practice consistently (30-60 mins daily), 4) Build projects to showcase your skills, 5) Join communities and network. What specific skills interest you?',
  'career path': 'A solid career path involves: 1) Self-assessment (strengths, interests), 2) Research target roles, 3) Identify skill gaps, 4) Create a learning plan, 5) Gain practical experience, 6) Build your portfolio, 7) Network in your field. What career field are you exploring?',
  'resume': 'Here are key resume tips: 1) Tailor to each job, 2) Use action verbs, 3) Quantify achievements, 4) Keep it 1-2 pages, 5) Use clear formatting, 6) Include relevant skills, 7) Add measurable impact. What aspect of resume-building can I help with?',
  'interview preparation': 'Interview success requires: 1) Research the company, 2) Practice common questions, 3) Prepare your STAR stories, 4) Dress professionally, 5) Arrive early, 6) Ask thoughtful questions, 7) Follow up after. Would you like tips on a specific interview type?',
  'job search': 'Effective job search strategies: 1) Use multiple platforms (LinkedIn, Indeed, etc), 2) Network actively, 3) Customize applications, 4) Set job alerts, 5) Follow companies, 6) Practice interviews, 7) Track applications. What job type are you seeking?',
  'learning': 'Start learning by: 1) Choose your subject, 2) Find quality resources, 3) Set realistic goals, 4) Practice daily, 5) Build projects, 6) Join communities, 7) Stay consistent. What would you like to learn?',
  'personality career': 'Different personality types suit different careers. MBTI, Big Five, and DISC help identify ideal roles. CareerMantra uses personality matching to suggest careers that align with your strengths. Would you like to take our personality test?',

  // Tech-related responses
  'programming languages': 'To get started with programming, I recommend starting with languages like Python (great for beginners and AI), JavaScript (essential for web development), or Java (widely used in enterprise applications). Do you have a specific language in mind?',
  'python': 'Python is a versatile language used for web development, data science, artificial intelligence, and more. I recommend starting with basic syntax and moving to libraries like NumPy, pandas, and frameworks like Flask or Django. Would you like some learning resources?',
  'web development': 'Web development involves creating websites and applications. Start by learning HTML, CSS, and JavaScript. Once comfortable, explore front-end frameworks (like React or Angular) and back-end technologies (like Node.js or Python with Django/Flask). Do you have any specific web development area you\'re interested in?',
  'front-end development': 'Front-end development is about creating the part of a website that users interact with. Start by mastering HTML, CSS, and JavaScript, and then move on to frameworks like React, Vue.js, or Angular. Would you like help with any specific front-end topics?',
  'back-end development': 'Back-end development focuses on the server-side of applications. Learn server-side languages like Python (Django/Flask), JavaScript (Node.js), or PHP. Also, get familiar with databases (SQL, MongoDB) and APIs. Do you want more info about back-end frameworks?',
  'full-stack development': 'Full-stack development covers both front-end and back-end skills. Learn HTML, CSS, JavaScript for front-end, and Python, Node.js, or Java for back-end. Master frameworks like React for the front-end and Django, Express.js, or Flask for back-end. Would you like resources to get started?',
  'ai and machine learning': 'AI and Machine Learning are highly sought-after skills! Start by learning Python and libraries like scikit-learn, TensorFlow, and PyTorch. Dive into concepts like data preprocessing, supervised learning, and deep learning. Interested in resources for AI/ML?',
  'data science': 'Data science involves analyzing and interpreting complex data to help businesses make decisions. Start with Python, then explore libraries like pandas, NumPy, and visualization tools like Matplotlib. Would you like to know how to get started with data science?',
  'artificial intelligence': 'AI is the field of creating machines that can perform tasks that would typically require human intelligence. To get started, learn Python, then explore machine learning and deep learning algorithms. Would you like to dive into any specific area of AI?',
  'cloud computing': 'Cloud computing allows you to store and access data and programs over the internet. Learn about services like AWS, Azure, and Google Cloud, and get familiar with cloud deployment, storage, and scalability. Would you like to explore cloud computing tools?',
  'cybersecurity': 'Cybersecurity is crucial for protecting systems and networks. Learn about network security, encryption, ethical hacking, and security protocols. Familiarize yourself with tools like Wireshark, Metasploit, and Kali Linux. Want some tips to get started in cybersecurity?',
  'software development': 'Software development involves designing, coding, and testing software. Start by learning programming languages like Java, Python, or C++. Familiarize yourself with version control (Git) and frameworks. Would you like resources to learn software development?',
  'mobile app development': 'Mobile app development involves creating apps for platforms like Android and iOS. Start by learning Swift (for iOS) or Kotlin/Java (for Android). Explore frameworks like Flutter or React Native for cross-platform apps. Want help with mobile app development?',
  'blockchain': 'Blockchain is the technology behind cryptocurrencies like Bitcoin. Start by learning about decentralized networks, cryptography, and smart contracts. Explore platforms like Ethereum. Would you like to dive into blockchain development?',

  // Add more responses as needed

  // Greetings
  'hello': 'Hello! How can I assist you with your career journey today?',
  'hi': 'Hi there! What can I help you with today regarding your career?',
  'hey': 'Hey! Ready to explore new career opportunities? Ask me anything!',
  'good morning': 'Good morning! How can I guide you with your career today?',
  'good afternoon': 'Good afternoon! How can I help with your career goals today?',
  'good evening': 'Good evening! Feel free to ask me anything about career guidance!',
};

// DOM Elements
let chatMessages = null;
let chatInput = null;
let chatSendBtn = null;
let closeBtn = null;

// ============= MESSAGE FUNCTIONS =============
function addMessage(text, isUser = false) {
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = text;
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message bot typing';
  messageDiv.id = 'typing-indicator';
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const typingEl = document.getElementById('typing-indicator');
  if (typingEl) typingEl.remove();
}

// ============= RESPONSE MATCHING =============
function getQuickResponse(userMessage) {
  const lowerMessage = userMessage.toLowerCase();
  
  for (const [key, response] of Object.entries(CAREER_RESPONSES)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return null;
}

// ============= API INTEGRATION =============
async function getChatbotResponse(userMessage) {
  try {
    // First, try to match with quick responses
    const quickResponse = getQuickResponse(userMessage);
    if (quickResponse) {
      removeTyping();
      return quickResponse;
    }

    showTyping();

    const response = await fetch(CHATBOT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    const result = await response.json();
    removeTyping();

    console.log('API Response:', result);

    if (response.ok && result && result.reply) {
      let botMessage = result.reply.trim();

      if (botMessage.length > 300) {
        botMessage = botMessage.substring(0, 300) + '...';
      }

      return botMessage || "That's an interesting question! Can you tell me more about what specific career aspect you'd like to explore?";
    } else {
      return "That's an interesting question! Please try asking me about: career paths, skill development, interviews, or job opportunities.";
    }
  } catch (error) {
    removeTyping();
    console.error('Chatbot API Error:', error);
    return "I'm having trouble connecting to the AI right now, but I can answer many questions! Ask me about: career guidance, skills, interviews, or resumes.";
  }
}

// ============= EVENT HANDLERS =============
async function sendMessage() {
  if (!chatInput) return;
  
  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  chatInput.value = '';
  chatInput.focus();

  const response = await getChatbotResponse(message);
  addMessage(response, false);
}

function handleKeyPress(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
}

function closeChat() {
  window.history.back();
}

// ============= INITIALIZATION =============
function initializeChatbot() {
  chatMessages = document.getElementById('chatMessages');
  chatInput = document.getElementById('chatInput');
  chatSendBtn = document.getElementById('chatSendBtn');
  closeBtn = document.getElementById('closeBtn');

  if (!chatMessages || !chatInput || !chatSendBtn) {
    console.error('Chatbot: Required DOM elements not found');
    return;
  }

  chatSendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', handleKeyPress);
  
  if (closeBtn) {
    closeBtn.addEventListener('click', closeChat);
  }

  addMessage("👋 Hi! I'm your Career Assistant powered by AI. Ask me anything about:\n\n✨ Career guidance\n📚 Skill development\n💼 Job preparation\n🎓 Learning resources\n🎯 Personality-based careers\n\nWhat would you like to know?", false);
  
  console.log('✅ Chatbot initialized successfully');
}

// ============= DOM READY CHECK =============
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeChatbot);
} else {
  initializeChatbot();
}