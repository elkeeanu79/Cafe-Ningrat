// ==================== DATA MENU ====================
const menuItems = [
    { id: 1, name: 'Espresso', price: 18000, img: 'https://placehold.co/300x200/6F4E37/FFF?text=Espresso' },
    { id: 2, name: 'Cappuccino', price: 25000, img: 'https://placehold.co/300x200/8B5A2B/FFF?text=Cappuccino' },
    { id: 3, name: 'Latte', price: 27000, img: 'https://placehold.co/300x200/A0522D/FFF?text=Latte' },
    { id: 4, name: 'Mocha', price: 30000, img: 'https://placehold.co/300x200/5C4033/FFF?text=Mocha' },
    { id: 5, name: 'Teh Tarik', price: 15000, img: 'https://placehold.co/300x200/CD853F/FFF?text=Teh+Tarik' },
    { id: 6, name: 'Red Velvet', price: 32000, img: 'https://placehold.co/300x200/B22222/FFF?text=Red+Velvet' }
];

// Menu misterius (rahasia)
const mysteryDrinks = [
    { name: 'Kopi Nebula', desc: 'Kopi dingin dengan sirup blueberry', message: '✨ Hari ini adalah awal yang baru.' },
    { name: 'Matcha Galaksi', desc: 'Matcha creamy dengan bintik cokelat', message: '🌿 Ketenangan ada di dalam dirimu.' },
    { name: 'Cokelat Meteor', desc: 'Cokelat panas dengan marshmallow', message: '☄️ Keberanian membawa kejutan manis.' }
];

// ==================== KERANJANG (localStorage) ====================
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countSpan = document.getElementById('cart-count');
    if (countSpan) countSpan.textContent = totalQty;
}

// Tambah item ke keranjang
function addToCart(item) {
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id && i.isMystery === item.isMystery);
    if (existing) {
        existing.quantity += item.quantity || 1;
    } else {
        cart.push({ ...item, quantity: item.quantity || 1 });
    }
    saveCart(cart);
    updateCartCount();
    renderCart(); // jika halaman order terbuka
}

// ==================== RENDER MENU (halaman menu) ====================
function renderMenu() {
    const container = document.getElementById('menu-container');
    if (!container) return;
    container.innerHTML = menuItems.map(item => `
        <div class="menu-item">
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>Rp${item.price.toLocaleString('id-ID')}</p>
            <button class="add-to-cart" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">Tambah ke Keranjang</button>
        </div>
    `).join('');

    // Event listener tombol tambah
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);
            addToCart({ id, name, price, isMystery: false });
            alert(`${name} ditambahkan ke keranjang!`);
        });
    });
}

// ==================== RENDER KERANJANG (halaman order) ====================
function renderCart() {
    const cartContainer = document.getElementById('cart-items');
    const summary = document.getElementById('cart-summary');
    const totalSpan = document.getElementById('total-price');
    if (!cartContainer) return;

    const cart = getCart();
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Keranjang masih kosong.</p>';
        summary.style.display = 'none';
        return;
    }

    let total = 0;
    cartContainer.innerHTML = cart.map((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        const mysteryTag = item.isMystery ? ` (🎁 ${item.revealedName || 'Misterius'})` : '';
        return `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${item.name}${mysteryTag}</strong> - Rp${item.price.toLocaleString('id-ID')} x ${item.quantity}
                </div>
                <div class="cart-item-actions">
                    <button class="qty-btn" data-index="${index}" data-action="minus">-</button>
                    <button class="qty-btn" data-index="${index}" data-action="plus">+</button>
                    <button class="remove-btn" data-index="${index}">Hapus</button>
                </div>
            </div>
        `;
    }).join('');

    totalSpan.textContent = total.toLocaleString('id-ID');
    summary.style.display = 'block';

    // Event quantity
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(btn.dataset.index);
            const action = btn.dataset.action;
            const cart = getCart();
            if (action === 'plus') cart[index].quantity++;
            else if (action === 'minus' && cart[index].quantity > 1) cart[index].quantity--;
            saveCart(cart);
            updateCartCount();
            renderCart();
        });
    });

    // Event hapus
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            const cart = getCart();
            cart.splice(index, 1);
            saveCart(cart);
            updateCartCount();
            renderCart();
        });
    });
}

// ==================== MYSTERY ORDER ====================
function setupMystery() {
    const mysteryBtn = document.getElementById('mystery-btn');
    if (!mysteryBtn) return;

    mysteryBtn.addEventListener('click', () => {
        // Pilih acak
        const randomDrink = mysteryDrinks[Math.floor(Math.random() * mysteryDrinks.length)];
        const mysteryItem = {
            id: Date.now(), // id unik
            name: 'Pesan Misterius',
            price: 15000,
            quantity: 1,
            isMystery: true,
            revealedName: randomDrink.name,
            revealedDesc: randomDrink.desc,
            revealedMessage: randomDrink.message
        };
        addToCart(mysteryItem);

        // Tampilkan pop-up
        alert(`🎉 Kamu mendapatkan: ${randomDrink.name}!\n${randomDrink.desc}\n\n"${randomDrink.message}"`);
    });
}

// ==================== CHECKOUT ====================
function setupCheckout() {
    const checkoutBtn = document.getElementById('checkout-btn');
    if (!checkoutBtn) return;

    checkoutBtn.addEventListener('click', () => {
        const cart = getCart();
        if (cart.length === 0) return;

        // Tampilkan modal
        const modal = document.getElementById('success-modal');
        const modalDetails = document.getElementById('modal-details');
        const mysteryReveals = cart.filter(i => i.isMystery);
        let detailsHTML = '<ul>';
        cart.forEach(item => {
            const nameDisplay = item.isMystery ? `${item.name} ➡️ ${item.revealedName}` : item.name;
            detailsHTML += `<li>${nameDisplay} x${item.quantity} - Rp${(item.price * item.quantity).toLocaleString('id-ID')}</li>`;
        });
        detailsHTML += '</ul>';
        if (mysteryReveals.length > 0) {
            detailsHTML += '<p><strong>Pesan spesial:</strong> ';
            detailsHTML += mysteryReveals.map(m => `"${m.revealedMessage}"`).join(' | ');
            detailsHTML += '</p>';
        }
        modalDetails.innerHTML = detailsHTML;
        modal.style.display = 'block';

        // Kosongkan keranjang
        localStorage.removeItem('cart');
        updateCartCount();
        renderCart();
    });
}

// Modal close
function setupModal() {
    const modal = document.getElementById('success-modal');
    if (!modal) return;
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// ==================== CONTACT FORM ====================
function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Pesan Anda telah terkirim! (Simulasi)');
        form.reset();
    });
}

// ==================== INISIALISASI ====================
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderMenu();
    renderCart();
    setupMystery();
    setupCheckout();
    setupModal();
    setupContactForm();

    // Cart icon click mengarahkan ke order.html
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            window.location.href = 'order.html';
        });
    }
});
