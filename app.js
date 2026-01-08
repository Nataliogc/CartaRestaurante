document.addEventListener('DOMContentLoaded', () => {
    // Determine which page we are on
    const path = window.location.pathname;
    const isCafeteria = path.includes('Cafeteria.html');
    const isRestaurant = path.includes('Restaurane.html');

    if (isCafeteria) {
        loadMenu('cafeteria');
    } else if (isRestaurant) {
        loadMenu('restaurante');
    }
});

function loadMenu(type) {
    let menuData = null;

    // 1. Try Local Storage
    try {
        const local = localStorage.getItem('menuData');
        if (local) {
            const parsed = JSON.parse(local);
            if (parsed && parsed[type]) {
                menuData = parsed[type];
                console.log(`Loaded ${type} from Local Storage`);
            }
        }
    } catch (e) {
        console.warn('Local Storage access blocked or error:', e);
    }

    // 2. Fallback to File Data
    if (!menuData) {
        if (typeof initialMenuData === 'undefined') {
            console.error('Menu data not found. Ensure menu-data.js is loaded.');
            return;
        }
        menuData = initialMenuData[type];
        console.log(`Loaded ${type} from file default`);
    }

    if (menuData) {
        renderMenu(menuData);
    }
}

function renderMenu(sections) {
    const container = document.querySelector('.menu-container');
    if (!container) return;

    // Clear hardcoded content
    container.innerHTML = '';

    sections.forEach((section, index) => {
        const details = document.createElement('details');
        details.className = 'menu-section';
        // Open the first section by default
        if (index === 0) details.open = true;

        const summary = document.createElement('summary');
        summary.textContent = section.category;
        details.appendChild(summary);

        const grid = document.createElement('div');
        grid.className = 'menu-grid';

        section.items.forEach(item => {
            const card = createMenuItem(item);
            grid.appendChild(card);
        });

        details.appendChild(grid);
        container.appendChild(details);
    });
}

function createMenuItem(item) {
    const div = document.createElement('div');
    div.className = 'menu-item';

    // Generate allergens tags
    const allergensHtml = item.allergens && item.allergens.length > 0
        ? `<div class="allergens">${item.allergens.map(a => `<span class="allergen">${a}</span>`).join('')}</div>`
        : '';

    // Handle missing description
    const descHtml = item.description ? `<p class="dish-description">${item.description}</p>` : '';

    div.innerHTML = `
        <div class="dish-main">
            <img src="${item.image}" alt="${item.name}" class="menu-img" onclick="openModal(this)" loading="lazy">
            <div class="dish-content">
                <div class="dish-header">
                    <h4 class="dish-name">${item.name}</h4>
                    <div class="price">${item.price}</div>
                </div>
                ${descHtml}
                ${allergensHtml}
            </div>
        </div>
    `;
    return div;
}

// Global Modal Functions
function openModal(img) {
    var modal = document.getElementById('myModal');
    var modalImg = document.getElementById('modalImg');
    if (modal && modalImg) {
        modal.style.display = "flex";
        modalImg.src = img.src;
    }
}

// Close modal when clicking outside
window.onclick = function (event) {
    var modal = document.getElementById('myModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
