import { servicesProducts } from "../js/producto-servicio.js";

const productsContainer = document.querySelector("[data-product]");
const form = document.querySelector("[data-form]");

if (!productsContainer || !form) {
    console.error("No se encontraron los elementos necesarios en el DOM.");
}

// Crea estructura HTML para ser renderizada dinámicamente con JS
function createCard(product) {
    const { id, name, price, image } = product;

    const card = document.createElement('div');
    card.classList.add("card");

     // Formateo del precio a moneda local (ejemplo: $50000)
    const formattedPrice = price.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0, // Sin decimales

    });



    card.innerHTML = `
        <div class="img-container">
            <img src="${image}" alt="${name}">
        </div>
        <div class="card-container--info">
            <h3>${name}</h3>
            <div class="card-container--value">
                <span class="price">${formattedPrice} COP</span>
            </div>
            <button class="button-clear" data-id="${id}">
                <img src="img/trashIcon.svg" alt="Eliminar">
            </button>
        </div>
    `;

    addDeleteEvent(card, id);
    return card;
}

// Asigna el evento de eliminar producto a la tarjeta
function addDeleteEvent(card, id) {
    const deleteButton = card.querySelector(".button-clear");
    if (!deleteButton) {
        console.error('No se encontró el botón de eliminar');
        return;
    }

    deleteButton.addEventListener("click", async () => {
        try {
            await servicesProducts.deleteProduct(id);
            card.remove();
            console.log(`Producto con id ${id} eliminado`);
        } catch (error) {
            console.error(`Error al eliminar el producto con id ${id}:`, error);
        }
    });
}

// Renderiza los productos en el DOM
const renderProducts = async () => {
    try {
        const listProducts = await servicesProducts.productList();

        productsContainer.innerHTML = '';

        listProducts.forEach((product) => {
            const productCard = createCard(product);
            productsContainer.appendChild(productCard);
        });
    } catch (err) {
        console.error("Error al renderizar productos:", err);
    }
};

// Manejo del evento de envío del formulario
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameInput = document.querySelector("[data-name]");
    const priceInput = document.querySelector("[data-price]");
    const imageInput = document.querySelector("[data-image]");

    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value.trim());
    const image = imageInput.value.trim();

    if (!name || isNaN(price) || price <= 0 || !image) {
        alert("Por favor, complete todos los campos con valores válidos.");
        return;
    }

    try {
        const newProduct = await servicesProducts.createProduct(
            name,
            price,
            image
        );

        const newCard = createCard(newProduct);
        productsContainer.appendChild(newCard);
        form.reset();
    } catch (error) {
        console.error("Error al crear el producto:", error);
        alert("Hubo un error al crear el producto");
    }
});

// Ejecuta la función de renderizado inicial
renderProducts();
