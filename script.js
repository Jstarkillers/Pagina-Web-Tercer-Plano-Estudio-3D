// =============================================
// CONFIGURACIÓN INICIAL Y VARIABLES GLOBALES
// =============================================

// Super usuarios predefinidos
const SUPER_USERS = {
    'admin': { password: 'Admin123!', isSuper: true },
    'paulette': { password: 'Paulette123!', isSuper: true }
};

// Estado de la aplicación
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let products = JSON.parse(localStorage.getItem('products')) || [];
let wholesaleProducts = JSON.parse(localStorage.getItem('wholesaleProducts')) || [];

// =============================================
// INICIALIZACIÓN
// =============================================

function init() {
    // Cargar productos si no existen
    if (products.length === 0) {
        loadInitialProducts();
    }
    
    // Configurar eventos
    setupEventListeners();
    
    // Actualizar UI según estado de autenticación
    updateUI();
    
    // Renderizar productos
    renderProducts();
    
    // Iniciar efectos visuales
    initVisualEffects();
    
    // Configurar scroll
    setupScrollEffects();
}

// =============================================
// CONFIGURACIÓN DE EVENTOS
// =============================================

function setupEventListeners() {
    // Navegación móvil
    const menuToggle = document.getElementById('menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const closeMenu = document.getElementById('close-menu');
    const overlay = document.getElementById('overlay');
    
    if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
    if (closeMenu) closeMenu.addEventListener('click', closeMobileMenu);
    if (overlay) overlay.addEventListener('click', closeMobileMenu);
    
    // Cerrar menú al hacer clic en enlaces móviles
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Autenticación
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const closeLogin = document.getElementById('close-login');
    const closeRegister = document.getElementById('close-register');
    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    const mobileRegisterBtn = document.getElementById('mobile-register-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    
    if (loginBtn) loginBtn.addEventListener('click', () => openModal(loginModal));
    if (registerBtn) registerBtn.addEventListener('click', () => openModal(registerModal));
    if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', () => openModal(loginModal));
    if (mobileRegisterBtn) mobileRegisterBtn.addEventListener('click', () => openModal(registerModal));
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', logout);
    
    // Cerrar modales
    if (closeLogin) closeLogin.addEventListener('click', () => closeModal(loginModal));
    if (closeRegister) closeRegister.addEventListener('click', () => closeModal(registerModal));
    
    // Formularios
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
    // Administración
    const addProductBtn = document.getElementById('add-product-btn');
    const refreshProductsBtn = document.getElementById('refresh-products-btn');
    
    if (addProductBtn) {
        addProductBtn.addEventListener('click', showAddProductForm);
    }
    if (refreshProductsBtn) {
        refreshProductsBtn.addEventListener('click', refreshProducts);
    }
    
    // Scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function setupScrollEffects() {
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// =============================================
// FUNCIONALIDADES DE INTERFAZ
// =============================================

function openMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');
    
    if (!mobileNav || !overlay) return;
    mobileNav.classList.add('active');
    overlay.classList.add('active');
    menuToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobile-nav');
    const overlay = document.getElementById('overlay');
    const menuToggle = document.getElementById('menu-toggle');
    
    if (!mobileNav || !overlay) return;
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    menuToggle.classList.remove('active');
    document.body.style.overflow = '';
}

function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function updateUI() {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLoginBtn = document.getElementById('mobile-login-btn');
    const mobileRegisterBtn = document.getElementById('mobile-register-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const userWelcome = document.getElementById('user-welcome');
    const adminLink = document.getElementById('admin-link');
    const mobileAdminLink = document.getElementById('mobile-admin-link');
    const adminSection = document.getElementById('admin-panel');
    
    if (currentUser) {
        // Usuario logueado
        if (loginBtn) loginBtn.style.display = 'none';
        if (registerBtn) registerBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
        if (mobileRegisterBtn) mobileRegisterBtn.style.display = 'none';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'block';
        if (userWelcome) {
            userWelcome.textContent = `Hola, ${currentUser.username}`;
            userWelcome.style.display = 'inline';
        }
        
        // Si es super usuario, mostrar panel de administración
        if (currentUser.isSuper) {
            if (adminLink) adminLink.style.display = 'block';
            if (mobileAdminLink) mobileAdminLink.style.display = 'block';
            if (adminSection) adminSection.style.display = 'block';
        } else {
            if (adminLink) adminLink.style.display = 'none';
            if (mobileAdminLink) mobileAdminLink.style.display = 'none';
            if (adminSection) adminSection.style.display = 'none';
        }
    } else {
        // Usuario no logueado
        if (loginBtn) loginBtn.style.display = 'block';
        if (registerBtn) registerBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (mobileLoginBtn) mobileLoginBtn.style.display = 'block';
        if (mobileRegisterBtn) mobileRegisterBtn.style.display = 'block';
        if (mobileLogoutBtn) mobileLogoutBtn.style.display = 'none';
        if (userWelcome) userWelcome.style.display = 'none';
        
        // Ocultar panel de administración
        if (adminLink) adminLink.style.display = 'none';
        if (mobileAdminLink) mobileAdminLink.style.display = 'none';
        if (adminSection) adminSection.style.display = 'none';
    }
    
    // Renderizar productos según permisos
    renderProducts();
}

// =============================================
// SISTEMA DE AUTENTICACIÓN
// =============================================

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    // Validaciones
    if (!username || !password) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
    }
    
    // Verificar si es un super usuario
    if (SUPER_USERS[username] && SUPER_USERS[username].password === password) {
        currentUser = {
            username: username,
            isSuper: true
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUI();
        closeModal(document.getElementById('login-modal'));
        showNotification('¡Bienvenido, administrador!', 'success');
        return;
    }
    
    // Verificar usuarios normales
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = {
            username: username,
            isSuper: false
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUI();
        closeModal(document.getElementById('login-modal'));
        showNotification('¡Sesión iniciada correctamente!', 'success');
    } else {
        showNotification('Usuario o contraseña incorrectos', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    
    // Validaciones básicas
    if (username.length < 3) {
        showNotification('El usuario debe tener al menos 3 caracteres', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }
    
    // Verificar si el usuario ya existe
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.find(u => u.username === username)) {
        showNotification('El usuario ya existe', 'error');
        return;
    }
    
    // Registrar nuevo usuario
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    
    // Iniciar sesión automáticamente
    currentUser = {
        username: username,
        isSuper: false
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    updateUI();
    closeModal(document.getElementById('register-modal'));
    showNotification('¡Registro exitoso! Bienvenido/a', 'success');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
    showNotification('Sesión cerrada correctamente', 'info');
}

// =============================================
// GESTIÓN DE PRODUCTOS
// =============================================

function loadInitialProducts() {
    // Productos minoristas
    products = [
        {
            id: 1,
            name: 'Dragón Articulado',
            description: 'Impresionante dragón con cuerpo flexible y articulado, perfecto para juegos de fantasía. Impreso con filamento PLA biodegradable.',
            price: 18500,
            image: 'https://images.unsplash.com/photo-1567602901358-5ba17615aaeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            category: 'animales'
        },
        {
            id: 2,
            name: 'Robot Flexi',
            description: 'Robot articulado con extremidades flexibles, ideal para desarrollar la imaginación. Fabricado con materiales 100% ecológicos.',
            price: 15000,
            image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            category: 'robots'
        },
        {
            id: 3,
            name: 'Dinosaurio Articulado',
            description: 'Tyrannosaurus Rex con mandíbula móvil y articulaciones flexibles. Juguete educativo sobre prehistoria.',
            price: 16800,
            image: 'https://images.unsplash.com/photo-1596870239757-1a5db1efa261?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            category: 'animales'
        },
        {
            id: 6,
            name: 'Puzzle 3D Geométrico',
            description: 'Desafía tu mente con este puzzle 3D de formas geométricas. Perfecto para desarrollar habilidades espaciales.',
            price: 12500,
            image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            category: 'educativos'
        }
    ];
    
    // Productos mayoristas
    wholesaleProducts = [
        {
            id: 4,
            name: 'Lote de 10 Dragones Articulados',
            description: 'Pack mayorista de 10 dragones articulados. Ideal para revendedores. Precio especial por volumen.',
            price: 150000,
            image: 'https://images.unsplash.com/photo-1567602901358-5ba17615aaeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            category: 'animales',
            minQuantity: 10
        },
        {
            id: 5,
            name: 'Lote de 15 Robots Flexi',
            description: 'Pack mayorista de 15 robots flexi. Perfecto para tiendas de juguetes. Descuento por cantidad.',
            price: 180000,
            image: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            category: 'robots',
            minQuantity: 15
        },
        {
            id: 7,
            name: 'Kit Educativo STEM',
            description: 'Lote de 20 kits educativos STEM que incluyen rompecabezas y figuras geométricas. Perfecto para colegios y talleres.',
            price: 240000,
            image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            category: 'educativos',
            minQuantity: 20
        }
    ];
    
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('wholesaleProducts', JSON.stringify(wholesaleProducts));
}

function renderProducts() {
    renderMinoristaProducts();
    renderMayoristaProducts();
    renderAdminProducts();
}

function renderMinoristaProducts() {
    const minoristaGrid = document.getElementById('minorista-grid');
    if (!minoristaGrid) return;
    
    minoristaGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product, false);
        minoristaGrid.appendChild(productCard);
    });
}

function renderMayoristaProducts() {
    const mayoristaGrid = document.getElementById('mayorista-grid');
    if (!mayoristaGrid) return;
    
    mayoristaGrid.innerHTML = '';
    
    wholesaleProducts.forEach(product => {
        const productCard = createProductCard(product, true);
        mayoristaGrid.appendChild(productCard);
    });
}

function renderAdminProducts() {
    const adminGrid = document.getElementById('admin-products-grid');
    if (!adminGrid) return;
    
    adminGrid.innerHTML = '';
    
    // Combinar productos minoristas y mayoristas para administración
    const allProducts = [...products, ...wholesaleProducts];
    
    allProducts.forEach(product => {
        const adminCard = createAdminProductCard(product);
        adminGrid.appendChild(adminCard);
    });
}

function createProductCard(product, isWholesale) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price.toLocaleString('es-CL')}</div>
            ${isWholesale && product.minQuantity ? `<div class="product-min-quantity">Mínimo: ${product.minQuantity} unidades</div>` : ''}
            <a href="https://wa.me/56962485838?text=Hola!%20Estoy%20interesado%20en%20${encodeURIComponent(product.name)}" target="_blank" class="btn btn-primary">
                <span>Consultar por WhatsApp</span>
                <i class="fab fa-whatsapp"></i>
            </a>
        </div>
    `;
    return card;
}

function createAdminProductCard(product) {
    const isWholesale = product.minQuantity !== undefined;
    const card = document.createElement('div');
    card.className = 'admin-product-card';
    card.innerHTML = `
        <div class="admin-product-header">
            <h3 class="admin-product-title">${product.name}</h3>
            <div class="admin-product-actions">
                <button class="admin-btn btn-edit" data-id="${product.id}" data-wholesale="${isWholesale}">Editar</button>
                <button class="admin-btn btn-delete" data-id="${product.id}" data-wholesale="${isWholesale}">Eliminar</button>
            </div>
        </div>
        <div class="admin-product-details">
            <p><strong>Precio:</strong> $${product.price.toLocaleString('es-CL')}</p>
            <p><strong>Categoría:</strong> ${product.category || 'Sin categoría'}</p>
            ${isWholesale ? `<p><strong>Tipo:</strong> Mayorista (Mín. ${product.minQuantity} unidades)</p>` : '<p><strong>Tipo:</strong> Minorista</p>'}
            <p>${product.description}</p>
        </div>
    `;
    
    // Agregar eventos a los botones
    const editBtn = card.querySelector('.btn-edit');
    const deleteBtn = card.querySelector('.btn-delete');
    
    if (editBtn) editBtn.addEventListener('click', () => editProduct(product.id, isWholesale));
    if (deleteBtn) deleteBtn.addEventListener('click', () => deleteProduct(product.id, isWholesale));
    
    return card;
}

function showAddProductForm() {
    const name = prompt('Nombre del producto:');
    if (!name) return;
    
    const description = prompt('Descripción del producto:');
    if (!description) return;
    
    const price = parseFloat(prompt('Precio del producto:'));
    if (isNaN(price)) return;
    
    const category = prompt('Categoría (animales, robots, educativos, etc.):') || 'general';
    
    const isWholesale = confirm('¿Es un producto mayorista?');
    let minQuantity = 0;
    if (isWholesale) {
        minQuantity = parseInt(prompt('Cantidad mínima para venta mayorista:'));
        if (isNaN(minQuantity)) minQuantity = 10;
    }
    
    const newProduct = {
        id: Date.now(), // ID simple basado en timestamp
        name,
        description,
        price,
        category,
        image: 'https://images.unsplash.com/photo-1567602901358-5ba17615aaeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80'
    };
    
    if (isWholesale) {
        newProduct.minQuantity = minQuantity;
        wholesaleProducts.push(newProduct);
        localStorage.setItem('wholesaleProducts', JSON.stringify(wholesaleProducts));
    } else {
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    renderProducts();
    showNotification('Producto agregado correctamente', 'success');
}

function editProduct(id, isWholesale) {
    const productList = isWholesale ? wholesaleProducts : products;
    const product = productList.find(p => p.id === id);
    
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    const newName = prompt('Nuevo nombre:', product.name);
    if (newName === null) return;
    
    const newDescription = prompt('Nueva descripción:', product.description);
    if (newDescription === null) return;
    
    const newPrice = parseFloat(prompt('Nuevo precio:', product.price));
    if (isNaN(newPrice)) {
        showNotification('Precio inválido', 'error');
        return;
    }
    
    product.name = newName;
    product.description = newDescription;
    product.price = newPrice;
    
    if (isWholesale) {
        localStorage.setItem('wholesaleProducts', JSON.stringify(wholesaleProducts));
    } else {
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    renderProducts();
    showNotification('Producto actualizado correctamente', 'success');
}

function deleteProduct(id, isWholesale) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) return;
    
    if (isWholesale) {
        wholesaleProducts = wholesaleProducts.filter(p => p.id !== id);
        localStorage.setItem('wholesaleProducts', JSON.stringify(wholesaleProducts));
    } else {
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
    }
    
    renderProducts();
    showNotification('Producto eliminado correctamente', 'success');
}

function refreshProducts() {
    renderProducts();
    showNotification('Productos actualizados', 'info');
}

// =============================================
// EFECTOS VISUALES
// =============================================

function initVisualEffects() {
    // Efecto de escritura para el título
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const titleLines = heroTitle.querySelectorAll('.title-line');
        titleLines.forEach((line, index) => {
            const text = line.textContent;
            line.textContent = '';
            let i = 0;
            
            setTimeout(() => {
                const typeWriter = setInterval(() => {
                    if (i < text.length) {
                        line.textContent += text.charAt(i);
                        i++;
                    } else {
                        clearInterval(typeWriter);
                    }
                }, 100);
            }, index * 500);
        });
    }
    
    // Partículas animadas
    createParticles();
}

function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return; // Evitar errores si no existe
    
    const particleCount = 30;
    
    // Obtener colores de variables CSS (con fallback)
    const cssPrimary = getCSSVar('--primary') || '#00ff88';
    const cssSecondary = getCSSVar('--secondary') || '#6c63ff';
    const cssAccent = getCSSVar('--accent') || '#ff2e63';
    const colors = [cssPrimary.trim(), cssSecondary.trim(), cssAccent.trim()];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posición aleatoria
        const left = Math.random() * 100;
        const size = Math.random() * 4 + 2;
        const delay = Math.random() * 15;
        const duration = Math.random() * 10 + 10;
        
        particle.style.left = `${left}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        // Color aleatorio
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        
        container.appendChild(particle);
    }
}

// =============================================
// UTILIDADES
// =============================================

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getCSSVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name);
}

// =============================================
// INICIAR APLICACIÓN
// =============================================

document.addEventListener('DOMContentLoaded', init);
