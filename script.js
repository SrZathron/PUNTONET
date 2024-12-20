// Definir los productos (planes) disponibles
const productos = [
    { nombre: "Plan 1", velocidad: "10MB", precio: 17500 },
    { nombre: "Plan 2", velocidad: "15MB", precio: 21500 },
    { nombre: "Plan 3", velocidad: "20MB", precio: 28500 },
    { nombre: "Plan 4", velocidad: "30MB", precio: 35800 },
];

// Función para mostrar los productos en la página de productos
function mostrarProductos() {
    const container = document.querySelector('.grid-container');
    container.innerHTML = ""; // Limpiar el contenido previo

    productos.forEach((producto) => {
        const card = document.createElement('div');
        card.classList.add('plan');
        card.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p>${producto.velocidad}</p>
            <p>$${producto.precio}</p>
            <button onclick="addToCart('${producto.nombre}', ${producto.precio})">Agregar al Carrito</button>
        `;
        container.appendChild(card);
    });
}

// Definir el carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Actualizar el contador del carrito en el encabezado
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').innerText = count;
}

// Agregar productos al carrito
function addToCart(nombre, precio) {
    const existingProduct = cart.find((item) => item.nombre === nombre);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ nombre, precio, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`Producto "${nombre}" agregado al carrito.`);
}

// Mostrar los productos en el carrito en carrito.html
function renderCart() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>No hay productos en el carrito.</p>";
    } else {
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <p>${item.nombre} (x${item.quantity}) - $${item.precio * item.quantity}</p>
                <button onclick="removeFromCart(${index})">Eliminar</button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    const total = cart.reduce((sum, item) => sum + item.precio * item.quantity, 0);
    totalPriceElement.innerText = total.toFixed(2);
}

// Eliminar productos del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Redirigir a WhatsApp al confirmar la compra
function redirectToWhatsApp() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const selectedPlan = cart.map((item) => `${item.nombre} (x${item.quantity})`).join(", ");
    const message = `Gracias por comunicarte con PUNTONET. Has seleccionado: ${selectedPlan}.`;

    const phoneNumber = "+5492664957001"; // Número de WhatsApp de PUNTONET
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.location.href = whatsappLink;
}

// Cargar las funcionalidades cuando se carga la página
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelector('.grid-container')) {
        mostrarProductos();
    }

    if (document.getElementById('cart-items')) {
        renderCart();
    }

    if (document.getElementById('confirm-purchase')) {
        document.getElementById('confirm-purchase').addEventListener('click', redirectToWhatsApp);
    }

    updateCartCount();
});
