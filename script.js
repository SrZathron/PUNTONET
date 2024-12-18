// Inicializar el carrito desde localStorage o como un array vacío
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Actualizar el contador del carrito
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;
}

// Agregar un producto al carrito
function addToCart(name, price) {
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    // Guardar en localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Escuchar clics en los botones "Agregar al carrito"
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.add-to-cart');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = parseInt(button.getAttribute('data-price'));
            addToCart(name, price);
        });
    });

    // Actualizar el contador del carrito al cargar la página
    updateCartCount();
});

// Función para renderizar el carrito en la página del carrito
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItemsContainer.innerHTML = ''; // Limpiar contenido previo

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

// Función para eliminar un producto del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Redirigir a WhatsApp al confirmar la compra
function redirectToWhatsApp() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }

    const selectedPlan = cart.map(item => `${item.name} (x${item.quantity})`).join(', ');
    const message = `Gracias por comunicarte con PUNTONET. Has seleccionado: ${selectedPlan}.`;

    const phoneNumber = "+5492664957001"; // Reemplaza con tu número de WhatsApp
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.location.href = whatsappLink;
}

// Vincular las funcionalidades al cargar la página del carrito
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cart-items')) {
        renderCart();
    }
    if (document.getElementById('confirm-purchase')) {
        document.getElementById('confirm-purchase').addEventListener('click', redirectToWhatsApp);
    }
});
