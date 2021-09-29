/* Constants */
const URL =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

/* Variables */
let catalog = [];
let cartItems = [];

/* Functions */

/**
 * Calculates amount of products in cart
 * @returns {number} total products quantity
 */
const getProductQuantity = () => {
  return cartItems
    ? cartItems.reduce((count, { quantity }) => count + quantity, 0)
    : 0;
};

/**
 * Updates display of cart items
 */
const updateCartIcon = () => {
  const itemCount = document.getElementById("item-count");
  itemCount.textContent = `${getProductQuantity()} items`;
};

/**
 * Adds a product to Cart array and updates cart visualization
 * @param {*} product the product that wants to be added to cart
 */
const addProductToCart = (product, amount = 1) => {
  const cartProduct = cartItems.find(
    (cartProd) =>
      cartProd.name === product.name && cartProd.category === product.category,
  );
  if (cartProduct) {
    cartProduct.quantity += amount;
  } else {
    cartItems.push({ ...product, quantity: amount });
  }
  updateCartIcon();
};

/**
 * Builds Navigation Bar according to catalog by adding nav item
 * Adds event listener to Nav items so that they show category products
 */
const buildNavBar = () => {
  const navBar = document.getElementById("navbar-content");
  catalog.forEach((category) => {
    // Creates a Nav Item, styles it with bootstrap, labels it and adds to to navbar
    const navItem = document.createElement("a");
    navItem.classList.add("nav-item", "nav-link");
    navItem.innerHTML = category.name;
    navBar.appendChild(navItem);

    // Adds event listener so clicking a nav item displays the category products
    navItem.addEventListener("click", () => {
      showProductsFromCategory(category);
    });
  });
};

/**
 * Adds
 * @param {*} category
 */
const showProductsFromCategory = (category) => {
  // Modifies heading
  const heading = document.getElementById("main-heading");
  heading.textContent = category.name;

  // Extracts product list from catalog entry
  const { products } = category;

  // Resets content
  const mainContent = document.getElementById("main-content");
  while (mainContent.firstChild) {
    mainContent.removeChild(mainContent.firstChild);
  }

  // Creates card for each product
  products.forEach((product) => {
    // Column for card that ensures same sized and spaced cards
    const col = document.createElement("div");
    mainContent.appendChild(col);
    col.classList.add(
      "col",
      "col-3",
      "d-flex",
      "align-items-stretch",
      "px-2",
      "pb-3",
    );

    // Card
    const card = document.createElement("div");
    col.appendChild(card);
    card.classList.add("card");

    // Card's Image
    const img = document.createElement("img");
    img.classList.add("card-img-top");
    card.appendChild(img);
    img.src = product.image;

    // Card's Body
    const cardBody = document.createElement("div");
    card.appendChild(cardBody);
    cardBody.classList.add(
      "card-body",
      "d-flex",
      "flex-column",
      "align-items-start",
    );

    // Body's Product Title
    const cardTitle = document.createElement("h5");
    cardBody.appendChild(cardTitle);
    cardTitle.textContent = product.name;

    // Body's Product Description
    const cardDescription = document.createElement("p");
    cardBody.appendChild(cardDescription);
    cardDescription.classList.add("card-text");
    cardDescription.textContent = product.description;

    // Body's Product Price
    const cardPrice = document.createElement("h6");
    cardBody.appendChild(cardPrice);
    cardPrice.classList.add("card-text", "mt-auto");
    cardPrice.textContent = `$${product.price}`;

    // Body's Add to Cart Button
    const cardButton = document.createElement("button");
    cardBody.appendChild(cardButton);
    cardButton.type = "button";
    cardButton.classList.add("btn", "btn-dark");
    cardButton.textContent = "Add to cart";

    // Adds event listener so that button adds item to cart
    cardButton.addEventListener("click", () => {
      addProductToCart({ ...product, category: category.name });
    });
  });
};

/**
 * Fetches Restaurant's catalog data and builds parts that depend on it
 */
async function buildSite() {
  const response = await fetch(URL);
  catalog = await response.json();
  buildNavBar();
  showProductsFromCategory(catalog[0]);
}

/* Execution */
buildSite();
updateCartIcon();
