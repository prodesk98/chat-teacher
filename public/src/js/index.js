tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#4F46E5',
                secondary: '#6366F1',
                dark: '#1E293B',
                light: '#F8FAFC',
                success: '#10B981',
                warning: '#F59E0B'
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const chatContainer = document.getElementById('chatContainer');

    // Auto-resize textarea
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Send message function
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Create a user message element
        const userMessage = document.createElement('div');
        userMessage.className = 'message user bg-primary-50 rounded-xl p-4 mb-4 shadow-sm border border-indigo-100';
        userMessage.innerHTML = `
                    <div class="flex justify-end">
                        <div class="text-right max-w-full">
                            <h3 class="font-medium text-gray-800">You</h3>
                            <div class="text-gray-700 mt-1">${message}</div>
                        </div>
                        <div class="ml-3 mt-0.5 flex-shrink-0">
                            <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                <i class="fas fa-user text-white text-sm"></i>
                            </div>
                        </div>
                    </div>
                `;

        // Add a user message to chat
        chatContainer.appendChild(userMessage);

        // Clear input
        messageInput.value = '';
        messageInput.style.height = 'auto';

        // Create AI "typing" indicator
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message ai bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100';
        typingIndicator.innerHTML = `
                    <div class="flex">
                        <div class="mr-3 mt-0.5 flex-shrink-0">
                            <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                <i class="fas fa-graduation-cap text-white text-sm"></i>
                            </div>
                        </div>
                        <div>
                            <h3 class="font-medium text-gray-800">Study Assistant</h3>
                            <div class="text-indigo-500 mt-1">
                                <span class="typing-dot"></span>
                                <span class="typing-dot"></span>
                                <span class="typing-dot"></span>
                            </div>
                        </div>
                    </div>
                `;

        chatContainer.appendChild(typingIndicator);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Simulate AI response after delay
        setTimeout(() => {
            // Replace typing indicator with actual response
            typingIndicator.remove();

            // Get subject based on user's message
            const subject = getSubjectFromMessage(message);

            // Create AI response element
            const aiMessage = document.createElement('div');
            aiMessage.className = 'message ai bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-100';
            aiMessage.innerHTML = `
                        <div class="flex">
                            <div class="mr-3 mt-0.5 flex-shrink-0">
                                <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                    <i class="fas fa-graduation-cap text-white text-sm"></i>
                                </div>
                            </div>
                            <div>
                                <div class="flex justify-between items-start">
                                    <h3 class="font-medium text-gray-800">Study Assistant</h3>
                                    <span class="subject-badge bg-${subject.color}-100 text-${subject.color}-800">${subject.name}</span>
                                </div>
                                <div class="markdown-content text-gray-700 mt-1">
                                    ${generateResponse(message, subject.name)}
                                </div>
                                <div class="mt-3 space-x-2">
                                    <button class="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1 rounded">
                                        Save for later
                                    </button>
                                    <button class="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1 rounded">
                                        More examples
                                    </button>
                                    <button class="text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2 py-1 rounded">
                                        Practice questions
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

            chatContainer.appendChild(aiMessage);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 2000);
    }

    // Generate a random educational response
    function generateResponse(message, subject) {
        const responses = {
            'Mathematics': {
                start: [
                    "Great question about Mathematics!",
                    "I see you're asking about Mathematics - that's an interesting topic!",
                    "Mathematics concepts can be challenging - let me explain this:"
                ],
                content: [
                    `<p>Mathematics is the abstract science of number, quantity, and space. Let's break down the key components of your question:</p>
                            <ul>
                                <li><strong>Core Principles:</strong> Mathematics builds from basic operations to complex theories</li>
                                <li><strong>Problem Solving:</strong> Approaching mathematical problems systematically</li>
                                <li><strong>Real-world Applications:</strong> From engineering to finance and beyond</li>
                            </ul>
                            <p class="mt-2">For your specific question about <strong>"${message}"</strong>, consider that mathematics often uses symbols and formulas to represent relationships between quantities.</p>`
                ],
                examples: [
                    "<strong>Example 1:</strong> Consider a simple algebraic equation like 2x + 3 = 7. To solve for x, we subtract 3 from both sides: 2x = 4, then divide both sides by 2: x = 2.",
                    "<strong>Example 2:</strong> The Pythagorean theorem (a² + b² = c²) shows the relationship between the sides of a right triangle."
                ],
                end: "Would you like me to clarify any part or provide practice problems?"
            },
            'Physics': {
                start: [
                    "Physics is the fascinating study of matter and energy!",
                    "You're asking about Physics - one of the fundamental sciences!",
                    "Physical laws describe how the universe behaves. Let's explore:"
                ],
                content: [
                    `<p>Physics involves understanding the fundamental forces and constituents of the universe. Your question about <strong>"${message}"</strong> relates to:</p>
                            <ul>
                                <li><strong>Mechanics:</strong> Motion, forces and energy</li>
                                <li><strong>Electromagnetism:</strong> Electricity, magnetism and light</li>
                                <li><strong>Thermodynamics:</strong> Heat, temperature, and energy transfer</li>
                            </ul>`
                ],
                examples: [
                    "<strong>Example:</strong> Newton's Second Law states that force equals mass times acceleration (F=ma). A car accelerating at 2 m/s² with a mass of 1000 kg requires 2000 N of force.",
                    "<strong>Example:</strong> The Law of Conservation of Energy shows that energy cannot be created or destroyed, only transformed."
                ],
                end: "Shall I elaborate on any specific concept or provide calculations?"
            },
            'Chemistry': {
                start: [
                    "Chemistry is the study of matter and its transformations!",
                    "Chemical principles can explain so much about our world. Let's see:"
                ],
                content: [
                    `<p>Chemistry examines substances, their properties, and how they change. Your question about <strong>"${message}"</strong> touches on:</p>
                            <ul>
                                <li><strong>Atomic Structure:</strong> The building blocks of matter</li>
                                <li><strong>Chemical Bonds:</strong> How atoms connect to form molecules</li>
                                <li><strong>Reactions:</strong> Transformations between substances</li>
                            </ul>`
                ],
                examples: [
                    "<strong>Example:</strong> In the chemical reaction 2H₂ + O₂ → 2H₂O, hydrogen and oxygen combine to form water.",
                    "<strong>Example:</strong> Acid-base chemistry involves proton transfer, with acids donating H⁺ ions and bases accepting them."
                ],
                end: "Would you like a more detailed explanation or practical examples?"
            },
            'Biology': {
                start: [
                    "Biology reveals the wonder of life!",
                    "Living systems are incredibly complex. Let's examine:"
                ],
                content: [
                    `<p>Biology explores living organisms, their structure, function, and evolution. Your question about <strong>"${message}"</strong> relates to:</p>
                            <ul>
                                <li><strong>Cellular Processes:</strong> How cells function and reproduce</li>
                                <li><strong>Genetics:</strong> Heredity and variation in organisms</li>
                                <li><strong>Ecology:</strong> Interactions between organisms and environments</li>
                            </ul>`
                ],
                examples: [
                    "<strong>Example:</strong> Photosynthesis converts sunlight to chemical energy: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂.",
                    "<strong>Example:</strong> Natural selection drives evolution - organisms with advantageous traits survive and reproduce."
                ],
                end: "Would you like more details on any particular biological concept?"
            },
            'default': {
                start: [
                    "That's an excellent educational question!",
                    "I'm happy to help with your study question!",
                    "As your educational assistant, I can explain:"
                ],
                content: [
                    `<p>Based on your question about <strong>"${message}"</strong>, I'd like to present some key information:</p>
                            <ul>
                                <li><strong>Core Concept:</strong> Every subject has fundamental principles that build understanding</li>
                                <li><strong>Learning Strategy:</strong> Break complex topics into smaller parts and master them step-by-step</li>
                                <li><strong>Application:</strong> Understand how concepts relate to real-world situations</li>
                            </ul>
                            <p class="mt-3">Would you like me to provide more specific information on this topic or suggest learning resources?</p>`
                ],
                examples: [],
                end: "Let me know how I can assist further with your studies!"
            }
        };

        const subjectData = responses[subject] || responses['default'];

        const randomStart = subjectData.start[Math.floor(Math.random() * subjectData.start.length)];
        const randomContent = subjectData.content[Math.floor(Math.random() * subjectData.content.length)];

        let exampleContent = '';
        if (subjectData.examples.length > 0) {
            const example = subjectData.examples[Math.floor(Math.random() * subjectData.examples.length)];
            exampleContent = `<div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">${example}</div>`;
        }

        return `
                    <p>${randomStart}</p>
                    ${randomContent}
                    ${exampleContent}
                    <p class="mt-4 font-medium">${subjectData.end}</p>
                `;
    }

    // Determine subject from message content
    function getSubjectFromMessage(message) {
        const subjects = [
            {
                name: 'Mathematics',
                keywords: ['math', 'algebra', 'geometry', 'calculus', 'equation', 'trigonometry', 'statistics'],
                color: 'blue'
            },
            {
                name: 'Physics',
                keywords: ['physics', 'newton', 'motion', 'gravity', 'force', 'velocity', 'acceleration'],
                color: 'green'
            },
            {
                name: 'Chemistry',
                keywords: ['chemistry', 'atom', 'molecule', 'reaction', 'bond', 'acid', 'base'],
                color: 'yellow'
            },
            {
                name: 'Biology',
                keywords: ['biology', 'cell', 'dna', 'photosynthesis', 'evolution', 'genetics', 'organism'],
                color: 'purple'
            },
            {
                name: 'History',
                keywords: ['history', 'war', 'revolution', 'ancient', 'civilization', 'battle', 'king'],
                color: 'red'
            },
            {
                name: 'Literature',
                keywords: ['literature', 'poetry', 'novel', 'poem', 'shakespeare', 'author', 'story'],
                color: 'pink'
            }
        ];

        const lowerMessage = message.toLowerCase();
        for (const subject of subjects) {
            if (subject.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return subject;
            }
        }

        return {name: 'General', color: 'indigo'};
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Add example prompts functionality
    document.querySelectorAll('.bg-gray-200').forEach(button => {
        button.addEventListener('click', function () {
            messageInput.value = this.textContent.trim();
            messageInput.focus();
        });
    });

    // Initialize textarea height
    messageInput.style.height = 'auto';

    // Chat history functionality
    const newChatBtn = document.getElementById('newChatBtn');

    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
    let currentChat = {
        id: Date.now(),
        title: 'New Chat',
        messages: []
    };

    // New chat
    function startNewChat() {
        currentChat = {
            id: Date.now(),
            title: 'New Chat',
            messages: []
        };
        chatContainer.innerHTML = '';
        // Add a welcome message
        const welcomeMsg = chatContainer.querySelector('.message.ai');
        if (welcomeMsg) {
            currentChat.messages.push({
                isUser: false,
                html: welcomeMsg.innerHTML
            });
        }
    }

    newChatBtn.addEventListener('click', startNewChat);

    // Modify sendMessage to track messages in the current chat
    const originalSendMessage = sendMessage;
    sendMessage = function () {
        originalSendMessage.apply(this, arguments);

        // Update current chat messages after sending
        currentChat.messages = Array.from(chatContainer.querySelectorAll('.message')).map(msg => ({
            isUser: msg.classList.contains('user'),
            html: msg.innerHTML
        }));
    };

    // Initialize
    loadChatHistory();
});