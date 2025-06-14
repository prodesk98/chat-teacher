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


const storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get(key) {
    const item = localStorage.getItem(key);
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  has(key) {
    return localStorage.getItem(key) !== null;
  }
};

const uuid = () => {return crypto.randomUUID()}

let thinking = false;
async function call_api(uri, method = 'POST', body = null) {
    if (thinking) return;
    thinking = true;
    const resp = fetch(uri, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null
    });
    thinking = false;
    return resp;
}

const converter = new showdown.Converter();
function onSubmitSendMsg() {
    if (thinking) return;
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    if (!chatContainer) return;
    if (!messageInput) return;
    const message = messageInput.value.trim();
    if (!message) return;
    const form = document.getElementById('form-send-message');

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Create a user message element
    const userMessage = document.createElement('div');
    userMessage.className = 'message user bg-primary-50 rounded-xl p-4 mb-4 shadow-sm border border-indigo-100';
    userMessage.innerHTML = `
        <div class="flex justify-end">
            <div class="text-right max-w-full">
                <h3 class="font-medium text-gray-800">You</h3>
                <div class="text-gray-700 mt-1">${message.length > 1024 ? `${message.slice(0, 1024)}...` : message}</div>
            </div>
            <div class="ml-3 mt-0.5 flex-shrink-0">
                <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-user">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                    </svg>
                </div>
            </div>
        </div>
    `;

    // Add a user message to chat
    chatContainer.appendChild(userMessage);

    // Create AI "typing" indicator
    const typingIndicator = document.createElement('div');
    const contentId = `content-${uuid()}`;
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
                <div class="text-indigo-500 mt-1" id="${contentId}">
                    <span class="typing-dot w-2 h-2 bg-indigo-500 rounded-full inline-block mx-1"></span>
                    <span class="typing-dot w-2 h-2 bg-indigo-500 rounded-full inline-block mx-1"></span>
                    <span class="typing-dot w-2 h-2 bg-indigo-500 rounded-full inline-block mx-1"></span>
                </div>
            </div>
        </div>
    `;

    chatContainer.appendChild(typingIndicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (!storage.has('currentChat')) return;
    const currentChat = storage.get('currentChat');
    call_api(`/chat/${currentChat.id}`, 'POST', {
        content: data.message,
        role: 'user',
    }).then(async (response) => {
        const responseData = await response.json();
        if (!response.ok) {
            console.error('Error sending message:', responseData);
            return;
        }
        // Update the typing indicator with the AI response
        const contentHTML = chatContainer.querySelector(`#${contentId}`);
        contentHTML.innerHTML = converter.makeHtml(responseData.content) || 'No response from AI.';
    }).catch(e => {
        console.error('Error sending message:', e)});

    // Clear input
    messageInput.value = '';
    messageInput.style.height = 'auto';
}

function loadChatHistory() {
    const chatContainer = document.getElementById('chatContainer');
    if (!chatContainer) return;

    // Load current chat from storage
    const currentChat = storage.get('currentChat');
    if (!currentChat) return;

    // Clear existing messages
    chatContainer.innerHTML = '';

    // Get chat
    call_api(`/chat/${currentChat.id}`, 'GET').then(async (r) => {
        const chat = await r.json();
        if (chat === null) return;

        // Render chat title
        const chatTitle = document.getElementById('chatTitle');
        if (chatTitle) chatTitle.textContent = currentChat.title || 'Chat';
        // Render chat messages
        let messages = chat.messages || [];
        // Ensure messages are in the correct format
        messages = messages.map(msg => {
            return {
                isUser: msg.role === 'user',
                html: msg.content || ''
            };
        });

        // Sort messages by ID (if needed)
        messages.sort((a, b) => a.id - b.id);

        // Render messages
        messages.forEach(msg => {
            const messageElement = document.createElement('div');
            messageElement.className = `message ${msg.isUser ? 'user' : 'ai'} bg-${msg.isUser ? 'primary-50' : 'white'} rounded-xl p-4 mb-4 shadow-sm border border-${msg.isUser ? 'indigo-100' : 'gray-100'}`;
            messageElement.innerHTML = `
                <div class="flex ${msg.isUser ? 'justify-end' : ''}">
                    <div class="${msg.isUser ? 'text-right max-w-full' : ''}">
                        <h3 class="font-medium text-gray-800">${msg.isUser ? 'You' : 'Study Assistant'}</h3>
                        <div class="text-gray-700 mt-1">${msg.html}</div>
                    </div>
                    ${msg.isUser ?
                        '<div class="ml-3 mt-0.5 flex-shrink-0">\n' +
                    '<div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">\n' +
                    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"\n' +
                    'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"\n' +
                    'class="icon icon-tabler icons-tabler-outline icon-tabler-user">\n' +
                    '<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>\n' +
                    '<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>\n' +
                    '<path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>\n' +
                    '</svg>\n' +
                    '</div>\n' +
                    '</div>' : ''
                    }
                </div>
            `;
            chatContainer.appendChild(messageElement);
        });

        chatContainer.scrollTop = chatContainer.scrollHeight;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Elements
    const messageInput = document.getElementById('messageInput');
    const chatContainer = document.getElementById('chatContainer');

    // Auto-resize textarea
    messageInput.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmitSendMsg();
        }
    });
    // Initialize textarea height
    messageInput.style.height = 'auto';

    // Chat history functionality
    const newChatBtn = document.getElementById('newChatBtn');

    let currentChat = storage.get('currentChat') || {
        id: uuid(),
        title: 'New Chat',
    };
    if (!storage.has('currentChat')) startNewChat(); else loadChatHistory();

    // New chat
    function startNewChat() {
        currentChat = {
            id: uuid(),
            title: 'New Chat',
        };
        call_api("/chat/new", 'POST', {uuid: currentChat.id, title: currentChat.title}).then(r => {
            if (!r.ok) {
                console.error('Failed to start new chat:', r.statusText);
                return;
            }
            console.log('New chat started:', currentChat);
        });
        chatContainer.innerHTML = '';
        storage.set('currentChat', currentChat);
        loadChatHistory();
    }

    newChatBtn.addEventListener('click', startNewChat);

    // Modify sendMessage to track messages in the current chat
    const originalSendMessage = onSubmitSendMsg;
    onSubmitSendMsg = function () {
        originalSendMessage.apply(this, arguments);

        // Update current chat messages after sending
        currentChat.messages = Array.from(chatContainer.querySelectorAll('.message')).map(msg => ({
            isUser: msg.classList.contains('user'),
            html: msg.innerHTML
        }));
    };
});