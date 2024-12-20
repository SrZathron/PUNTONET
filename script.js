// Persistencia del carrito con LocalStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Actualizar el contador del carrito en el encabezado
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;
}

// Agregar productos al carrito (y manejar cantidades si ya existen)
function addToCart(name, price) {
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Mostrar los productos del carrito en la página carrito.html
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <p>${item.name} (x${item.quantity}) - $${item.price * item.quantity}</p>
            <button onclick="removeFromCart(${index})">Eliminar</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalPriceElement.innerText = total.toFixed(2);
}

// Eliminar productos del carrito según el índice
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Conexión con WhatsApp al confirmar la compra
function redirectToWhatsApp() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }

    const selectedPlan = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    const message = `Gracias por comunicarte con PUNTONET. Has seleccionado: ${selectedPlan}.`;

    const phoneNumber = "+5492664957001"; // Número de WhatsApp de PUNTONET
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.location.href = whatsappLink;
}

// Manejar el menú desplegable para dispositivos móviles
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('menu');

    menuToggle.addEventListener('click', () => {
        menu.classList.toggle('show');
    });

    updateCartCount();

    if (document.getElementById('cart-items')) {
        renderCart();
    }

    if (document.getElementById('confirm-purchase')) {
        document.getElementById('confirm-purchase').addEventListener('click', redirectToWhatsApp);
    }
});
