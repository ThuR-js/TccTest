// Estado da aplicação
let currentUser = null;
let products = [];
let chats = [];
let currentChat = null;

// Dados de exemplo
const sampleProducts = [
    {
        id: 1,
        name: "Camiseta Hellstar Cinza",
        description: "Camiseta 100% algodão em ótimo estado",
        type: "camiseta",
        size: "M",
        condition: "seminovo",
        donor: "Maria Silva",
        image: "images/camiseta-hellstar.webp",
        status: "available",
        whatsapp: "11999999999",
        chatEnabled: true
    },
    {
        id: 2,
        name: "Calça Baggy Lavagem Preta",
        description: "Calça jeans azul, tamanho 40",
        type: "calca",
        size: "M",
        condition: "usado",
        donor: "João Santos",
        image: "images/calca-baggy.webp",
        status: "analyzing",
        whatsapp: "",
        chatEnabled: true
    },
    {
        id: 3,
        name: "Shorts Eric Emanuel",
        description: "Vestido estampado, nunca usado",
        type: "shorts",
        size: "M",
        condition: "novo",
        donor: "Ana Costa",
        image: "images/shorts-eric.webp",
        status: "donated",
        whatsapp: "11888888888",
        chatEnabled: false
    },
    {
        id: 4,
        name: "Shorts Nike",
        description: "Tênis para corrida, pouco usado",
        type: "shorts",
        size: "M",
        condition: "seminovo",
        donor: "Carlos Lima",
        image: "images/shorts-nike.webp",
        status: "available",
        whatsapp: "11777777777",
        chatEnabled: true
    },
    {
        id: 5,
        name: "Camiseta Stone Island Year of Dragon",
        description: "Casaco de lã quentinho para o inverno",
        type: "camiseta",
        size: "M",
        condition: "usado",
        donor: "Fernanda Oliveira",
        image: "images/camiseta-stone.webp",
        status: "available",
        whatsapp: "",
        chatEnabled: true
    },
    {
        id: 6,
        name: "Calça Corteiz Devil Island",
        description: "Saia social preta, ideal para trabalho",
        type: "calca",
        size: "M",
        condition: "novo",
        donor: "Patricia Mendes",
        image: "images/calca-corteiz.webp",
        status: "analyzing",
        whatsapp: "11666666666",
        chatEnabled: true
    }
]

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    products = [...sampleProducts];
    setupEventListeners();
    renderProducts();
});

// Event Listeners
function setupEventListeners() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('userType').addEventListener('change', toggleIncomeField);
    
    // Add product form
    document.getElementById('addProductForm').addEventListener('submit', handleAddProduct);
    
    // Search and filters
    document.getElementById('headerSearchInput').addEventListener('input', filterProducts);
    document.getElementById('typeFilter').addEventListener('change', filterProducts);
    document.getElementById('sizeFilter').addEventListener('change', filterProducts);
    document.getElementById('conditionFilter').addEventListener('change', filterProducts);
    
    // Chat input
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Authentication
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulação de login
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        closeModal('loginModal');
        updateUI();
        showDashboard();
    } else {
        alert('Email ou senha incorretos');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.getElementById('userType').value;
    const incomeProof = document.getElementById('incomeProof').files;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
        alert('Email já cadastrado');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name,
        email,
        password,
        type: userType,
        incomeProof: userType === 'donatario' ? incomeProof.length : null
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Alterar conteúdo do modal
    const modalContent = document.querySelector('#registerModal .modal-content');
    modalContent.innerHTML = `
        <span class="close" onclick="closeModal('registerModal')">&times;</span>
        <h2>Cadastro Enviado</h2>
        <p style="text-align: center; margin: 2rem 0; line-height: 1.6;">
            Analisaremos sua solicitação de cadastro em 24h, fique atento ao E-mail cadastrado.
        </p>
        <button onclick="closeModal('registerModal')" style="width: 100%; padding: 0.75rem; background: #4A230A; color: white; border: none; border-radius: 8px; cursor: pointer;">OK</button>
    `;
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
    showHome();
}

// UI Updates
function updateUI() {
    const header = document.querySelector('.header .nav');
    const userMenu = document.getElementById('userMenu');
    
    if (currentUser) {
        header.style.display = 'none';
        userMenu.style.display = 'block';
        document.getElementById('userName').textContent = currentUser.name;
    } else {
        header.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

function toggleIncomeField() {
    const userType = document.getElementById('userType').value;
    const incomeField = document.getElementById('incomeField');
    
    if (userType === 'donatario') {
        incomeField.style.display = 'block';
        document.getElementById('incomeProof').required = true;
    } else {
        incomeField.style.display = 'none';
        document.getElementById('incomeProof').required = false;
    }
}

// Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

function showHome() {
    showPage('homePage');
    renderProducts();
}

function showLogin() {
    document.getElementById('loginModal').style.display = 'block';
}

function showRegister() {
    document.getElementById('registerModal').style.display = 'block';
}

function showDashboard() {
    if (!currentUser) {
        showLogin();
        return;
    }
    
    if (currentUser.type === 'doador') {
        showPage('donorPage');
        renderDonorProducts();
    } else {
        showPage('recipientPage');
        renderRecipientInterests();
    }
}

function showChat() {
    // Chat sem login obrigatório
    showPage('chatPage');
    renderChatList();
}

function showAddProduct() {
    if (!currentUser || currentUser.type !== 'doador') {
        alert('Apenas doadores podem adicionar produtos');
        return;
    }
    document.getElementById('addProductModal').style.display = 'block';
}

// Modal functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Product functions
function handleAddProduct(e) {
    e.preventDefault();
    
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDescription').value;
    const type = document.getElementById('productType').value;
    const size = document.getElementById('productSize').value;
    const condition = document.getElementById('productCondition').value;
    const whatsapp = document.getElementById('productWhatsapp').value;
    const chatEnabled = document.getElementById('enableChat').checked;
    const imageFile = document.getElementById('productImage').files[0];
    
    const newProduct = {
        id: Date.now(),
        name,
        description,
        type,
        size,
        condition,
        donor: currentUser.name,
        donorId: currentUser.id,
        image: imageFile ? URL.createObjectURL(imageFile) : `https://via.placeholder.com/280x200/e91e63/white?text=${encodeURIComponent(name)}`,
        status: 'available',
        whatsapp,
        chatEnabled
    };
    
    products.push(newProduct);
    localStorage.setItem('products', JSON.stringify(products));
    
    closeModal('addProductModal');
    document.getElementById('addProductForm').reset();
    renderProducts();
    renderDonorProducts();
}

function renderProducts() {
    renderRecentProducts();
    
    const grid = document.getElementById('productsGrid');
    const filteredProducts = getFilteredProducts();
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card ${product.status === 'donated' ? 'donated' : ''}">
            <img src="${product.image}" alt="${product.name}" class="product-image ${product.status === 'donated' ? 'donated' : ''}">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-details">Tam. <span style="color: #4A230A; font-weight: bold;">${product.size}</span> • ${product.type.charAt(0).toUpperCase() + product.type.slice(1)} • ${product.condition}</p>
                <div class="product-donor">
                    <img src="images/avatar2.webp?v=1" alt="Avatar" class="donor-avatar">
                    <span>${product.donor}</span>
                </div>
                ${product.status === 'analyzing' ? '<span class="product-status status-analyzing">Em Análise</span>' : ''}
                ${product.status === 'donated' ? '<span class="product-status status-donated">Doado</span>' : ''}
                ${product.status === 'available' ? `
                    <div class="product-actions">
                        ${product.chatEnabled ? '<button class="btn btn-primary" onclick="startChat(' + product.id + ')">Chat</button>' : ''}
                        ${product.whatsapp ? '<a href="https://wa.me/55' + product.whatsapp + '" class="btn btn-secondary">WhatsApp</a>' : ''}
                        ${currentUser && currentUser.type === 'donatario' ? '<button class="btn btn-outline" onclick="handleProductClick(' + product.id + ')">Tenho Interesse</button>' : ''}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function renderRecentProducts() {
    const recentGrid = document.getElementById('recentProducts');
    const recentProducts = products.slice(0, 5);
    
    recentGrid.innerHTML = recentProducts.map(product => `
        <div class="recent-card" onclick="handleProductClick(${product.id})">
            <img src="${product.image}" alt="${product.name}" class="product-image ${product.status === 'donated' ? 'donated' : ''}">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-details">${product.size} • ${product.condition}</p>
                <div class="product-donor">
                    <img src="images/avatar2.webp?v=1" alt="Avatar" class="donor-avatar">
                    <span>${product.donor}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderDonorProducts() {
    const grid = document.getElementById('donorProducts');
    const userProducts = products.filter(p => p.donorId === currentUser.id);
    
    grid.innerHTML = userProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-details">${product.size} • ${product.type} • ${product.condition}</p>
                <div class="product-donor">
                    <img src="images/avatar2.webp?v=1" alt="Avatar" class="donor-avatar">
                    <span>${product.donor}</span>
                </div>
                ${product.status === 'analyzing' ? '<span class="product-status status-analyzing">Em Análise</span>' : ''}
                ${product.status === 'donated' ? '<span class="product-status status-donated">Doado</span>' : ''}
                ${product.status === 'analyzing' ? `
                    <div class="product-actions">
                        <button class="btn btn-primary" onclick="approveRequest(${product.id})">Aprovar</button>
                        <button class="btn btn-outline" onclick="rejectRequest(${product.id})">Rejeitar</button>
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

function renderRecipientInterests() {
    const grid = document.getElementById('recipientInterests');
    grid.innerHTML = '<p>Seus interesses aparecerão aqui quando você manifestar interesse em algum produto.</p>';
}

function getFilteredProducts() {
    const search = document.getElementById('headerSearchInput').value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter').value;
    const sizeFilter = document.getElementById('sizeFilter').value;
    const conditionFilter = document.getElementById('conditionFilter').value;
    
    return products.filter(product => {
        return (
            product.name.toLowerCase().includes(search) &&
            (typeFilter === '' || product.type === typeFilter) &&
            (sizeFilter === '' || product.size === sizeFilter) &&
            (conditionFilter === '' || product.condition === conditionFilter)
        );
    });
}

function filterProducts() {
    renderProducts();
}

function filterByCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    document.getElementById('typeFilter').value = category;
    renderProducts();
}

function handleProductClick(productId) {
    const product = products.find(p => p.id === productId);
    if (product.status === 'donated') return;
    
    if (currentUser && currentUser.type === 'donatario' && product.status === 'available') {
        if (confirm('Deseja manifestar interesse neste produto?')) {
            product.status = 'analyzing';
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts();
        }
    }
}

function approveRequest(productId) {
    const product = products.find(p => p.id === productId);
    product.status = 'donated';
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    renderDonorProducts();
}

function rejectRequest(productId) {
    const product = products.find(p => p.id === productId);
    product.status = 'available';
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    renderDonorProducts();
}

// Chat functions
function startChat(productId) {
    const product = products.find(p => p.id === productId);
    
    if (currentUser) {
        const chatId = `${currentUser.id}-${product.donorId}-${productId}`;
        
        if (!chats.find(c => c.id === chatId)) {
            chats.push({
                id: chatId,
                participants: [currentUser.id, product.donorId],
                productId: productId,
                messages: []
            });
        }
        
        currentChat = chatId;
    } else {
        currentChat = `guest-${product.id}`;
    }
    
    showChat();
}

function renderChatList() {
    const chatList = document.getElementById('chatList');
    if (!currentUser) {
        chatList.innerHTML = '<p>Faça login para ver suas conversas</p>';
        return;
    }
    
    const userChats = chats.filter(chat => chat.participants.includes(currentUser.id));
    
    chatList.innerHTML = userChats.map(chat => {
        const product = products.find(p => p.id === chat.productId);
        return `
            <div class="chat-item ${chat.id === currentChat ? 'active' : ''}" onclick="selectChat('${chat.id}')">
                <strong>${product.name}</strong>
                <p>Chat sobre: ${product.name}</p>
            </div>
        `;
    }).join('');
    
    if (currentChat) {
        renderChatMessages();
    }
}

function selectChat(chatId) {
    currentChat = chatId;
    renderChatList();
    renderChatMessages();
}

function renderChatMessages() {
    const messagesDiv = document.getElementById('chatMessages');
    const chat = chats.find(c => c.id === currentChat);
    
    if (!chat) return;
    
    messagesDiv.innerHTML = chat.messages.map(message => `
        <div class="message ${message.senderId === currentUser.id ? 'sent' : 'received'}">
            <p>${message.text}</p>
            <small>${new Date(message.timestamp).toLocaleTimeString()}</small>
        </div>
    `).join('');
    
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function sendMessage() {
    if (!currentUser) {
        showLogin();
        return;
    }
    
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (!text || !currentChat) return;
    
    const chat = chats.find(c => c.id === currentChat);
    if (chat) {
        chat.messages.push({
            id: Date.now(),
            senderId: currentUser.id,
            text: text,
            timestamp: Date.now()
        });
        
        input.value = '';
        renderChatMessages();
    }
}

// Verificar se há usuário logado ao carregar a página
window.addEventListener('load', function() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUI();
    }
    
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
});