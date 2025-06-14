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


function onSubmitSendMsg() {
    const chatContainer = document.getElementById('chatContainer');
    const messageInput = document.getElementById('messageInput');
    if (!chatContainer) return;
    if (!messageInput) return;
    const message = messageInput.value.trim();
    if (!message) return;
    const form = document.getElementById('form-send-message');
    console.log(form);

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Form Data:', data);

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