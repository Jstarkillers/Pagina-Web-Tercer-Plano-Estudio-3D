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
let categories = JSON.parse(localStorage.getItem('categories')) || [
    { id: 1, name: 'Animales', description: 'Juguetes de animales', productCount: 0, status: 'active' },
    { id: 2, name: 'Robots', description: 'Juguetes robóticos', productCount: 0, status: 'active' },
    { id: 3, name: 'Educativos', description: 'Juguetes educativos', productCount: 0, status: 'active' },
    { id: 4, name: 'Vehículos', description: 'Vehículos y medios de transporte', productCount: 0, status: 'active' },
    { id: 5, name: 'Construcción', description: 'Juguetes de construcción', productCount: 0, status: 'active' },
    { id: 6, name: 'Personalizado', description: 'Productos personalizados', productCount: 0, status: 'active' }
];

// Producto en edición
let editingProduct = null;

// =============================================
// EFECTO DE CURSOR PERSONALIZADO
// =============================================

function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (!cursor || !cursorFollower) return;
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = e.clientX + 'px';
            cursorFollower.style.top = e.clientY + 'px';
        }, 100);
    });
    
    // Efectos al pasar sobre elementos interactivos
    const interactiveElements = document.querySelectorAll('a, button, .nav-link, .btn, .product-card, .value-card, .service-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.5)';
            cursorFollower.style.borderColor = 'var(--primary)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
            cursorFollower.style.borderColor = 'rgba(0, 255, 136, 0.5)';
        });
    });
}

// =============================================
// FONDO DE PARTÍCULAS
// =============================================

function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#00ff88', '#6c63ff', '#ff2e63']
                },
                shape: {
                    type: 'circle',
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#6c63ff',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1,
                    direction: 'none',
                    random: true,
                    straight: false,
                    out_mode: 'out',
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 0.5
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

// =============================================
// FONDO 3D CON THREE.JS
// =============================================

function init3DBackground() {
    const container = document.getElementById('background-3d');
    if (!container || typeof THREE === 'undefined') return;

    // Configuración de la escena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Controles de órbita para interactividad
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Geometrías y materiales
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.SphereGeometry(0.7, 12, 12),
        new THREE.ConeGeometry(0.5, 1.5, 8),
        new THREE.CylinderGeometry(0.5, 0.5, 1, 12),
        new THREE.TorusGeometry(0.6, 0.2, 12, 24)
    ];

    const materials = [
        new THREE.MeshBasicMaterial({ 
            color: 0x00ff88, 
            wireframe: true,
            transparent: true,
            opacity: 0.6
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0x6c63ff, 
            wireframe: true,
            transparent: true,
            opacity: 0.6
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0xff2e63, 
            wireframe: true,
            transparent: true,
            opacity: 0.6
        })
    ];

    // Crear objetos 3D
    const objects = [];
    const objectCount = 15;

    for (let i = 0; i < objectCount; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        // Posición aleatoria
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 20;
        
        // Rotación aleatoria
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        // Escala aleatoria
        const scale = Math.random() * 0.8 + 0.5;
        mesh.scale.set(scale, scale, scale);
        
        // Velocidad de rotación aleatoria
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };
        
        scene.add(mesh);
        objects.push(mesh);
    }

    // Posición de la cámara
    camera.position.z = 15;

    // Animación
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotar objetos
        objects.forEach(obj => {
            obj.rotation.x += obj.userData.rotationSpeed.x;
            obj.rotation.y += obj.userData.rotationSpeed.y;
            obj.rotation.z += obj.userData.rotationSpeed.z;
        });
        
        controls.update();
        renderer.render(scene, camera);
    }

    // Manejo de redimensionamiento
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

// =============================================
// SISTEMA DE CARGA DE IMÁGENES LOCALES
// =============================================

function initImageUpload() {
    const uploadContainer = document.getElementById('image-upload-container');
    const fileInput = document.getElementById('product-image-file');
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const urlInput = document.getElementById('product-image-url');
    
    if (!uploadContainer || !fileInput || !preview || !previewImg || !urlInput) return;
    
    // Arrastrar y soltar
    uploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadContainer.classList.add('dragover');
    });
    
    uploadContainer.addEventListener('dragleave', () => {
        uploadContainer.classList.remove('dragover');
    });
    
    uploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadContainer.classList.remove('dragover');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleImageSelection(e.dataTransfer.files[0]);
        }
    });
    
    // Click para seleccionar
    uploadContainer.addEventListener('click', () => {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleImageSelection(e.target.files[0]);
        }
    });
    
    // Cuando se ingresa una URL
    urlInput.addEventListener('input', () => {
        if (urlInput.value) {
            previewImg.src = urlInput.value;
            preview.style.display = 'block';
        } else {
            preview.style.display = 'none';
        }
    });
    
    function handleImageSelection(file) {
        if (!file.type.match('image.*')) {
            showNotification('Por favor, selecciona solo archivos de imagen', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            preview.style.display = 'block';
            urlInput.value = ''; // Limpiar URL si se sube un archivo
        };
        
        reader.readAsDataURL(file);
    }
}

// =============================================
// INICIALIZACIÓN
// =============================================

function init() {
    // Cargar productos si no existen
    if (products.length === 0) {
        loadInitialProducts();
    }
    
    // Guardar categorías iniciales
    localStorage.setItem('categories', JSON.stringify(categories));
    
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
    
    // Inicializar efectos
    initCustomCursor();
    initParticles();
    init3DBackground();
    initImageUpload();
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
    
    // Autenticación unificada
    const authModal = document.getElementById('auth-modal');
    const authBtn = document.getElementById('auth-btn');
    const mobileAuthBtn = document.getElementById('mobile-auth-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const closeAuth = document.getElementById('close-auth');
    
    // Tabs de autenticación
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (authBtn) authBtn.addEventListener('click', () => openModal(authModal));
    if (mobileAuthBtn) mobileAuthBtn.addEventListener('click', () => openModal(authModal));
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', logout);
    if (closeAuth) closeAuth.addEventListener('click', () => closeModal(authModal));
    
    // Tabs de autenticación
    if (loginTab) loginTab.addEventListener('click', () => switchAuthTab('login'));
    if (registerTab) registerTab.addEventListener('click', () => switchAuthTab('register'));
    
    // Formularios
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (registerForm) registerForm.addEventListener('submit', handleRegister);
    
    // Administración - Productos
    const addProductBtn = document.getElementById('add-product-btn');
    const refreshProductsBtn = document.getElementById('refresh-products-btn');
    const productModal = document.getElementById('product-modal');
    const productForm = document.getElementById('product-form');
    const closeProductModal = document.getElementById('close-product-modal');
    const cancelProduct = document.getElementById('cancel-product');
    const productTypeSelect = document.getElementById('product-type');
    
    if (addProductBtn) {
        addProductBtn.addEventListener('click', showAddProductForm);
    }
    if (refreshProductsBtn) {
        refreshProductsBtn.addEventListener('click', refreshProducts);
    }
    if (closeProductModal) {
        closeProductModal.addEventListener('click', () => closeModal(productModal));
    }
    if (cancelProduct) {
        cancelProduct.addEventListener('click', () => closeModal(productModal));
    }
    if (productForm) {
        productForm.addEventListener('submit', handleProductSubmit);
    }
    if (productTypeSelect) {
        productTypeSelect.addEventListener('change', handleProductTypeChange);
    }
    
    // Pestañas de administración
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchAdminTab(tabId);
        });
    });
    
    // Categorías
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', showAddCategoryForm);
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
    // Resetear formulario de producto
    if (modal.id === 'product-modal') {
        editingProduct = null;
        document.getElementById('product-form').reset();
        document.getElementById('product-modal-title').textContent = 'Agregar Producto';
        document.getElementById('price2-group').style.display = 'none';
        document.getElementById('min-quantity-group').style.display = 'none';
        document.getElementById('image-preview').style.display = 'none';
    }
}

function switchAuthTab(tab) {
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (tab === 'login') {
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
    } else {
        loginTab.classList.remove('active');
        registerTab.classList.add('active');
        loginForm.classList.remove('active');
        registerForm.classList.add('active');
    }
}

function switchAdminTab(tabId) {
    // Actualizar pestañas activas
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Activar pestaña seleccionada
    const tabElement = document.querySelector(`.admin-tab[data-tab="${tabId}"]`);
    const contentElement = document.getElementById(`${tabId}-tab`);
    
    if (tabElement) tabElement.classList.add('active');
    if (contentElement) contentElement.classList.add('active');
    
    // Cargar contenido específico de la pestaña
    if (tabId === 'categories') {
        renderCategoriesTable();
    } else if (tabId === 'analytics') {
        updateAnalytics();
    }
}

function updateUI() {
    const authBtn = document.getElementById('auth-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const mobileAuthBtn = document.getElementById('mobile-auth-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
    const userWelcome = document.getElementById('user-welcome');
    const adminLink = document.getElementById('admin-link');
    const mobileAdminLink = document.getElementById('mobile-admin-link');
    const adminSection = document.getElementById('admin-panel');
    
    if (currentUser) {
        // Usuario logueado
        if (authBtn) authBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (mobileAuthBtn) mobileAuthBtn.style.display = 'none';
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
            
            // Actualizar estadísticas
            updateAdminStats();
        } else {
            if (adminLink) adminLink.style.display = 'none';
            if (mobileAdminLink) mobileAdminLink.style.display = 'none';
            if (adminSection) adminSection.style.display = 'none';
        }
    } else {
        // Usuario no logueado
        if (authBtn) authBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (mobileAuthBtn) mobileAuthBtn.style.display = 'block';
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
        closeModal(document.getElementById('auth-modal'));
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
        closeModal(document.getElementById('auth-modal'));
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
    closeModal(document.getElementById('auth-modal'));
    showNotification('¡Registro exitoso! Bienvenido/a', 'success');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUI();
    showNotification('Sesión cerrada correctamente', 'info');
}

// =============================================
// GESTIÓN DE PRODUCTOS MEJORADA
// =============================================

function loadInitialProducts() {
    // Productos minoristas de ejemplo
    products = [
        {
            id: 1,
            name: 'Robot Eco-Amistoso',
            description: 'Un adorable robot impreso en 3D con materiales biodegradables. Perfecto para aprender sobre tecnología y sostenibilidad.',
            price: 12990,
            price2: 23980,
            category: 'robots',
            type: 'minorista',
            image: 'https://images.unsplash.com/photo-1589256469067-ea99122bbdc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            status: 'activo',
            tags: ['robot', 'ecológico', 'educativo', '3D']
        },
        {
            id: 2,
            name: 'Animales del Bosque',
            description: 'Set de animales del bosque chileno impresos en 3D con filamento PLA. Incluye zorro, puma y huemul.',
            price: 8990,
            price2: 16980,
            category: 'animales',
            type: 'minorista',
            image: 'https://images.unsplash.com/photo-1567602901358-5ba17615aaeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            status: 'activo',
            tags: ['animales', 'bosque', 'chileno', 'ecológico']
        }
    ];
    
    // Productos mayoristas de ejemplo
    wholesaleProducts = [
        {
            id: 3,
            name: 'Kit Educativo STEM',
            description: 'Kit completo de piezas educativas para aprendizaje STEM. Ideal para escuelas y talleres.',
            price: 5990,
            category: 'educativos',
            type: 'mayorista',
            minQuantity: 10,
            image: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
            status: 'activo',
            tags: ['STEM', 'educativo', 'escuela', 'aprendizaje']
        }
    ];
    
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('wholesaleProducts', JSON.stringify(wholesaleProducts));
}

function renderProducts() {
    renderMinoristaProducts();
    renderMayoristaProducts();
    
    if (currentUser && currentUser.isSuper) {
        renderAdminProducts();
        updateAdminStats();
    }
}

function renderMinoristaProducts() {
    const minoristaGrid = document.getElementById('minorista-grid');
    if (!minoristaGrid) return;
    
    minoristaGrid.innerHTML = '';
    
    const activeProducts = products.filter(p => p.status === 'activo');
    
    if (activeProducts.length === 0) {
        // Mostrar mensaje de "pronto disponible" para minorista
        const comingSoon = document.createElement('div');
        comingSoon.className = 'coming-soon';
        comingSoon.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <h3>Pronto Disponible</h3>
            <p>Estamos preparando nuestro catálogo minorista con los mejores juguetes ecológicos impresos en 3D. ¡Contáctanos para más información!</p>
            <a href="https://wa.me/56962485838?text=Hola!%20Estoy%20interesado%20en%20sus%20productos%20minoristas" target="_blank" class="btn btn-primary" style="margin-top: 1.5rem;">
                <span>Contactar para Más Información</span>
                <i class="fab fa-whatsapp"></i>
            </a>
        `;
        minoristaGrid.appendChild(comingSoon);
    } else {
        activeProducts.forEach(product => {
            const productCard = createProductCard(product, false);
            minoristaGrid.appendChild(productCard);
        });
    }
}

function renderMayoristaProducts() {
    const mayoristaGrid = document.getElementById('mayorista-grid');
    if (!mayoristaGrid) return;
    
    mayoristaGrid.innerHTML = '';
    
    const activeProducts = wholesaleProducts.filter(p => p.status === 'activo');
    
    if (activeProducts.length === 0) {
        // Mostrar mensaje de "pronto disponible" para mayorista
        const comingSoon = document.createElement('div');
        comingSoon.className = 'coming-soon';
        comingSoon.innerHTML = `
            <i class="fas fa-truck-loading"></i>
            <h3>Pronto Disponible</h3>
            <p>Si estás interesado en distribuir nuestros productos, contáctanos para acceder a precios especiales por volumen.</p>
            <a href="https://wa.me/56962485838?text=Hola!%20Estoy%20interesado%20en%20distribuir%20sus%20productos" target="_blank" class="btn btn-primary" style="margin-top: 1.5rem;">
                <span>Contactar para Distribución</span>
                <i class="fab fa-whatsapp"></i>
            </a>
        `;
        mayoristaGrid.appendChild(comingSoon);
    } else {
        activeProducts.forEach(product => {
            const productCard = createProductCard(product, true);
            mayoristaGrid.appendChild(productCard);
        });
    }
}

function renderAdminProducts() {
    const adminGrid = document.getElementById('admin-products-grid');
    if (!adminGrid) return;
    
    adminGrid.innerHTML = '';
    
    // Combinar productos minoristas y mayoristas para administración
    const allProducts = [...products, ...wholesaleProducts];
    
    if (allProducts.length === 0) {
        adminGrid.innerHTML = `
            <div class="coming-soon">
                <i class="fas fa-box-open"></i>
                <h3>No hay productos</h3>
                <p>Aún no has agregado ningún producto. ¡Comienza agregando tu primer producto!</p>
                <button class="btn btn-primary" style="margin-top: 1.5rem;" id="add-first-product">
                    <span>Agregar Primer Producto</span>
                    <i class="fas fa-plus"></i>
                </button>
            </div>
        `;
        
        const addFirstProductBtn = document.getElementById('add-first-product');
        if (addFirstProductBtn) {
            addFirstProductBtn.addEventListener('click', showAddProductForm);
        }
    } else {
        allProducts.forEach(product => {
            const adminCard = createAdminProductCard(product);
            adminGrid.appendChild(adminCard);
        });
    }
}

function createProductCard(product, isWholesale) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    let priceHTML = `<div class="product-price">$${product.price.toLocaleString('es-CL')}</div>`;
    if (product.price2) {
        priceHTML = `
            <div class="product-price">1 unidad: $${product.price.toLocaleString('es-CL')}</div>
            <div class="product-price">2 unidades: $${product.price2.toLocaleString('es-CL')}</div>
        `;
    }
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            ${priceHTML}
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
    const isWholesale = product.type === 'mayorista';
    const card = document.createElement('div');
    card.className = 'admin-product-card';
    
    const statusBadge = product.status === 'activo' ? 
        '<span style="color: var(--primary); font-weight: 600;">● Activo</span>' : 
        '<span style="color: var(--accent); font-weight: 600;">● Inactivo</span>';
    
    card.innerHTML = `
        <div class="admin-product-header">
            <h3 class="admin-product-title">${product.name}</h3>
            <div class="admin-product-actions">
                <button class="admin-btn btn-edit" data-id="${product.id}" data-type="${product.type}">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="admin-btn btn-delete" data-id="${product.id}" data-type="${product.type}">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </div>
        </div>
        <div class="admin-product-details">
            <p><strong>Precio:</strong> $${product.price.toLocaleString('es-CL')}</p>
            ${product.price2 ? `<p><strong>Precio 2 unidades:</strong> $${product.price2.toLocaleString('es-CL')}</p>` : ''}
            <p><strong>Categoría:</strong> ${getCategoryName(product.category)}</p>
            <p><strong>Tipo:</strong> ${isWholesale ? 'Mayorista' : 'Minorista'} ${isWholesale ? `(Mín. ${product.minQuantity} unidades)` : ''}</p>
            <p><strong>Estado:</strong> ${statusBadge}</p>
            <p>${product.description}</p>
            ${product.tags && product.tags.length > 0 ? `<p><strong>Etiquetas:</strong> ${product.tags.join(', ')}</p>` : ''}
        </div>
    `;
    
    // Agregar eventos a los botones
    const editBtn = card.querySelector('.btn-edit');
    const deleteBtn = card.querySelector('.btn-delete');
    
    if (editBtn) editBtn.addEventListener('click', () => editProduct(product.id, isWholesale));
    if (deleteBtn) deleteBtn.addEventListener('click', () => deleteProduct(product.id, isWholesale));
    
    return card;
}

function getCategoryName(categoryId) {
    const category = categories.find(c => c.id == categoryId);
    return category ? category.name : 'Sin categoría';
}

function showAddProductForm() {
    editingProduct = null;
    document.getElementById('product-modal-title').textContent = 'Agregar Producto';
    document.getElementById('product-form').reset();
    document.getElementById('price2-group').style.display = 'none';
    document.getElementById('min-quantity-group').style.display = 'none';
    document.getElementById('image-preview').style.display = 'none';
    openModal(document.getElementById('product-modal'));
}

function handleProductTypeChange() {
    const productType = document.getElementById('product-type').value;
    const price2Group = document.getElementById('price2-group');
    const minQuantityGroup = document.getElementById('min-quantity-group');
    
    if (productType === 'minorista') {
        price2Group.style.display = 'block';
        minQuantityGroup.style.display = 'none';
    } else if (productType === 'mayorista') {
        price2Group.style.display = 'none';
        minQuantityGroup.style.display = 'block';
    } else {
        price2Group.style.display = 'none';
        minQuantityGroup.style.display = 'none';
    }
}

function editProduct(id, isWholesale) {
    const productList = isWholesale ? wholesaleProducts : products;
    const product = productList.find(p => p.id === id);
    
    if (!product) {
        showNotification('Producto no encontrado', 'error');
        return;
    }
    
    editingProduct = product;
    
    document.getElementById('product-modal-title').textContent = 'Editar Producto';
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-type').value = product.type;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-price2').value = product.price2 || '';
    document.getElementById('product-image-url').value = product.image;
    document.getElementById('product-status').value = product.status;
    document.getElementById('product-tags').value = product.tags ? product.tags.join(', ') : '';
    
    // Mostrar vista previa de la imagen
    const preview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    previewImg.src = product.image;
    preview.style.display = 'block';
    
    if (product.type === 'mayorista') {
        document.getElementById('product-min-quantity').value = product.minQuantity || 10;
    }
    
    // Mostrar/ocultar campos según tipo
    handleProductTypeChange();
    
    openModal(document.getElementById('product-modal'));
}

async function handleProductSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const category = document.getElementById('product-category').value;
    const type = document.getElementById('product-type').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const price2 = document.getElementById('product-price2').value ? parseFloat(document.getElementById('product-price2').value) : null;
    const status = document.getElementById('product-status').value;
    const tags = document.getElementById('product-tags').value ? document.getElementById('product-tags').value.split(',').map(tag => tag.trim()) : [];
    const minQuantity = type === 'mayorista' ? parseInt(document.getElementById('product-min-quantity').value) : null;
    
    // Obtener imagen (archivo o URL)
    const fileInput = document.getElementById('product-image-file');
    const urlInput = document.getElementById('product-image-url');
    let imageValue;
    
    if (fileInput.files.length > 0) {
        // Usar archivo local
        const file = fileInput.files[0];
        imageValue = await readFileAsDataURL(file);
    } else if (urlInput.value) {
        // Usar URL
        imageValue = urlInput.value;
    } else {
        showNotification('Por favor, proporciona una imagen (archivo o URL)', 'error');
        return;
    }
    
    // Validaciones
    if (!name || !description || !category || !type || !price || !imageValue) {
        showNotification('Por favor, completa todos los campos obligatorios', 'error');
        return;
    }
    
    const productData = {
        id: editingProduct ? editingProduct.id : Date.now(),
        name,
        description,
        category,
        type,
        price,
        price2,
        image: imageValue,
        status,
        tags
    };
    
    if (type === 'mayorista') {
        productData.minQuantity = minQuantity;
    }
    
    if (editingProduct) {
        // Editar producto existente
        const wasWholesale = editingProduct.type === 'mayorista';
        const isNowWholesale = type === 'mayorista';
        
        // Eliminar de la lista original
        if (wasWholesale) {
            wholesaleProducts = wholesaleProducts.filter(p => p.id !== editingProduct.id);
        } else {
            products = products.filter(p => p.id !== editingProduct.id);
        }
        
        // Agregar a la lista correcta
        if (isNowWholesale) {
            wholesaleProducts.push(productData);
        } else {
            products.push(productData);
        }
        
        showNotification('Producto actualizado correctamente', 'success');
    } else {
        // Agregar nuevo producto
        if (type === 'mayorista') {
            wholesaleProducts.push(productData);
        } else {
            products.push(productData);
        }
        
        showNotification('Producto agregado correctamente', 'success');
    }
    
    // Actualizar localStorage
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('wholesaleProducts', JSON.stringify(wholesaleProducts));
    
    // Cerrar modal y actualizar
    closeModal(document.getElementById('product-modal'));
    renderProducts();
}

// Función auxiliar para leer un archivo como Data URL (base64)
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function deleteProduct(id, isWholesale) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) return;
    
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

function updateAdminStats() {
    const totalProducts = products.length + wholesaleProducts.length;
    const activeProducts = [...products, ...wholesaleProducts].filter(p => p.status === 'activo').length;
    const minoristaCount = products.length;
    const mayoristaCount = wholesaleProducts.length;
    
    const totalProductsEl = document.getElementById('total-products');
    const activeProductsEl = document.getElementById('active-products');
    const minoristaProductsEl = document.getElementById('minorista-products');
    const mayoristaProductsEl = document.getElementById('mayorista-products');
    
    if (totalProductsEl) totalProductsEl.textContent = totalProducts;
    if (activeProductsEl) activeProductsEl.textContent = activeProducts;
    if (minoristaProductsEl) minoristaProductsEl.textContent = minoristaCount;
    if (mayoristaProductsEl) mayoristaProductsEl.textContent = mayoristaCount;
}

// =============================================
// GESTIÓN DE CATEGORÍAS
// =============================================

function renderCategoriesTable() {
    const tableBody = document.getElementById('categories-table-body');
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // Actualizar conteo de productos por categoría
    updateCategoryProductCounts();
    
    categories.forEach(category => {
        const row = document.createElement('tr');
        
        const statusBadge = category.status === 'active' ? 
            '<span style="color: var(--primary);">● Activa</span>' : 
            '<span style="color: var(--accent);">● Inactiva</span>';
        
        row.innerHTML = `
            <td>${category.name}</td>
            <td>${category.description}</td>
            <td>${category.productCount}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="admin-btn btn-edit" data-category-id="${category.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="admin-btn btn-delete" data-category-id="${category.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Agregar event listeners a los botones
    document.querySelectorAll('.admin-btn[data-category-id]').forEach(btn => {
        if (btn.classList.contains('btn-edit')) {
            btn.addEventListener('click', (e) => {
                const categoryId = e.currentTarget.getAttribute('data-category-id');
                editCategory(categoryId);
            });
        } else if (btn.classList.contains('btn-delete')) {
            btn.addEventListener('click', (e) => {
                const categoryId = e.currentTarget.getAttribute('data-category-id');
                deleteCategory(categoryId);
            });
        }
    });
}

function updateCategoryProductCounts() {
    // Reiniciar conteos
    categories.forEach(category => {
        category.productCount = 0;
    });
    
    // Contar productos por categoría
    [...products, ...wholesaleProducts].forEach(product => {
        const category = categories.find(c => c.id == product.category);
        if (category) {
            category.productCount++;
        }
    });
    
    // Guardar cambios
    localStorage.setItem('categories', JSON.stringify(categories));
}

function showAddCategoryForm() {
    const name = prompt('Nombre de la categoría:');
    if (!name) return;
    
    const description = prompt('Descripción de la categoría:') || '';
    
    const newCategory = {
        id: Date.now(),
        name,
        description,
        productCount: 0,
        status: 'active'
    };
    
    categories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(categories));
    
    renderCategoriesTable();
    showNotification('Categoría agregada correctamente', 'success');
}

function editCategory(categoryId) {
    const category = categories.find(c => c.id == categoryId);
    if (!category) return;
    
    const newName = prompt('Nuevo nombre de la categoría:', category.name);
    if (newName === null) return;
    
    const newDescription = prompt('Nueva descripción:', category.description) || '';
    
    category.name = newName;
    category.description = newDescription;
    
    localStorage.setItem('categories', JSON.stringify(categories));
    
    renderCategoriesTable();
    showNotification('Categoría actualizada correctamente', 'success');
}

function deleteCategory(categoryId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría? Los productos asociados quedarán sin categoría.')) return;
    
    categories = categories.filter(c => c.id != categoryId);
    localStorage.setItem('categories', JSON.stringify(categories));
    
    renderCategoriesTable();
    showNotification('Categoría eliminada correctamente', 'success');
}

function updateAnalytics() {
    // En una implementación real, aquí se cargarían datos de analytics
    console.log('Actualizando analíticas...');
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
}

// =============================================
// UTILIDADES
// =============================================

function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
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

// =============================================
// INICIAR APLICACIÓN
// =============================================

document.addEventListener('DOMContentLoaded', init);
