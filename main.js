/* Constants */
const URL =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

/* Variables */
let catalog = [];
let cartItems = [];

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
 * Calculates cart total price
 * @returns {number} total products quantity
 */
const getTotalCartPrice = () => {
  const addAmount = (count, { quantity, price }) => count + quantity * price;
  return cartItems ? cartItems.reduce(addAmount, 0) : 0;
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
 * @param {name, category, price, quantity} product the product that wants to be added to cart
 */
const addProductToCart = (product, amount = 1) => {
  let cartProduct = cartItems.find(
    (cartProd) =>
      cartProd.name === product.name && cartProd.category === product.category,
  );
  if (cartProduct) {
    cartProduct.quantity += amount;
  } else {
    cartProduct = { ...product, quantity: amount };
    cartItems.push(cartProduct);
  }

  if (!cartProduct.quantity) {
    cartItems = cartItems.filter(
      (cartProd) =>
        !(
          cartProd.name === product.name &&
          cartProd.category === product.category
        ),
    );
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
    navItem.addEventListener("click", () => showProductsFromCategory(category));
  });
};

/**
 * Creates HTML table to display cart elements
 * @returns {HTMLTableElement} Table with headers and cartList content
 */
const createCartTable = () => {
  const cartTable = document.createElement("table");
  cartTable.classList.add("table", "table-striped");

  // Add headings
  const cartThead = document.createElement("thead");
  cartTable.appendChild(cartThead);
  const headRow = cartThead.insertRow(-1);
  let header = document.createElement("th");
  headRow.appendChild(header);
  header.innerHTML = "Item";
  header = document.createElement("th");
  headRow.appendChild(header);
  header.innerHTML = "Qty.";
  header = document.createElement("th");
  headRow.appendChild(header);
  header.innerHTML = "Description";
  header = document.createElement("th");
  headRow.appendChild(header);
  header.innerHTML = "Unit Price";
  header = document.createElement("th");
  headRow.appendChild(header);
  header.innerHTML = "Amount";
  header = document.createElement("th");
  headRow.appendChild(header);
  header.innerHTML = "Modify";

  // Add tbody
  const cartTableBody = document.createElement("tbody");
  cartTable.appendChild(cartTableBody);

  // Fill table
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    // Insert row
    const row = cartTableBody.insertRow(i);
    // Insert item cell
    let itemIndexCell = document.createElement("th");
    itemIndexCell.innerHTML = i + 1;
    row.appendChild(itemIndexCell);

    // Fill details
    row.insertCell(-1).innerHTML = item.quantity;
    row.insertCell(-1).innerHTML = item.name;
    row.insertCell(-1).innerHTML = item.price;
    row.insertCell(-1).innerHTML = item.quantity * item.price;

    // Add modify buttons
    const modifyCell = row.insertCell(-1);
    modifyCell.classList.add("align-middle");
    const addButton = document.createElement("button");
    modifyCell.appendChild(addButton);
    addButton.type = "button";
    addButton.classList.add("btn", "btn-secondary", "mr-1");
    addButton.textContent = "+";
    addButton.addEventListener("click", () => {
      addProductToCart(item, 1);
      showCartItems();
      updateCartIcon();
    });
    const subtractButton = document.createElement("button");
    modifyCell.appendChild(subtractButton);
    subtractButton.type = "button";
    subtractButton.classList.add("btn", "btn-secondary");
    subtractButton.textContent = "-";
    subtractButton.addEventListener("click", () => {
      addProductToCart(item, -1);
      showCartItems();
      updateCartIcon();
    });
  }
  return cartTable;
};

const createModal = () => {
  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.id = "cancelationModal";
  modal.tabIndex = "-1";
  modal.role = "dialog";
  modal.ariaLabel = "modalLabel";
  modal.ariaHidden = "true";

  const modalDialog = document.createElement("div");
  modalDialog.classList.add("modal-dialog");
  modalDialog.role = "document";
  modal.appendChild(modalDialog);

  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalDialog.appendChild(modalContent);

  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  modalContent.appendChild(modalHeader);

  const modalTitle = document.createElement("h5");
  modalTitle.classList.add("modal-title");
  modalTitle.textContent = "Cancel the order";
  modalHeader.appendChild(modalTitle);

  const modalCloseBtn = document.createElement("button");
  modalCloseBtn.classList.add("close");
  modalCloseBtn.ariaLabel = "Close";
  modalCloseBtn.dataset.dismiss = "modal";
  modalHeader.appendChild(modalCloseBtn);
  const closeSpan = document.createElement("span");
  closeSpan.ariaHidden = "true";
  closeSpan.innerHTML = "&times;";
  modalCloseBtn.appendChild(closeSpan);

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");
  modalContent.appendChild(modalBody);

  const modalBodyText = document.createElement("p");
  modalBodyText.classList.add("m-0");
  modalBodyText.textContent = "Are you sure about cancelling the order?";
  modalBody.appendChild(modalBodyText);

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");
  modalContent.appendChild(modalFooter);

  const footerDiv = document.createElement("div");
  footerDiv.classList.add("container");
  modalFooter.appendChild(footerDiv);

  const btnYesRow = document.createElement("div");
  btnYesRow.classList.add("row", "justify-content-end", "mb-2");
  footerDiv.appendChild(btnYesRow);
  const btnNoRow = document.createElement("div");
  btnNoRow.classList.add("row", "justify-content-end");
  footerDiv.appendChild(btnNoRow);

  const yesBtn = document.createElement("button");
  btnYesRow.appendChild(yesBtn);
  yesBtn.type = "button";
  yesBtn.classList.add("btn", "btn-outline-dark", "bg-confirm");
  yesBtn.textContent = "Yes, I want to cancel the order";
  yesBtn.addEventListener("click", () => {
    cartItems = [];
    showCartItems();
    updateCartIcon();
  });
  yesBtn.dataset.dismiss = "modal";

  const noBtn = document.createElement("button");
  btnNoRow.appendChild(noBtn);
  btnNoRow.dataset.dismiss = "modal";
  noBtn.type = "button";
  noBtn.classList.add("btn", "btn-outline-dark", "bg-cancel");
  noBtn.textContent = "No, I want to continue adding products";

  return modal;
};

/**
 *
 */
const showCartItems = () => {
  // Modifies heading
  const heading = document.getElementById("main-heading");
  heading.textContent = "Order Detail";

  // Resets content
  const mainContent = document.getElementById("main-content");
  while (mainContent.firstChild) {
    mainContent.removeChild(mainContent.firstChild);
  }

  // Creates table
  const tableRow = document.createElement("div");
  tableRow.classList.add("row");
  mainContent.appendChild(tableRow);

  const tableCol = document.createElement("div");
  tableCol.classList.add("col");
  tableRow.appendChild(tableCol);

  const cartTable = createCartTable();
  tableCol.appendChild(cartTable);

  // Add content footer row
  const orderFooterRow = document.createElement("div");
  orderFooterRow.classList.add("row", "justify-content-between", "mb-4");
  mainContent.appendChild(orderFooterRow);

  // Add total
  const totalCol = document.createElement("div");
  totalCol.classList.add("col", "col-5");
  orderFooterRow.appendChild(totalCol);
  const totalPriceP = document.createElement("h6");
  totalCol.appendChild(totalPriceP);
  totalPriceP.innerHTML = `Total: $${getTotalCartPrice()}`;

  // Add Buttons
  const buttonsCol = document.createElement("div");
  buttonsCol.classList.add("col", "col-3");
  orderFooterRow.appendChild(buttonsCol);

  const cancelButton = document.createElement("button");
  buttonsCol.appendChild(cancelButton);
  const modal = createModal();
  buttonsCol.appendChild(modal);
  cancelButton.type = "button";
  cancelButton.classList.add("btn", "btn-outline-dark", "bg-cancel", "mr-2");
  cancelButton.textContent = "Cancel";
  cancelButton.dataset.toggle = "modal";
  cancelButton.dataset.target = "#cancelationModal";
  // cancelButton.addEventListener("click", () => {});

  const confirmButton = document.createElement("button");
  buttonsCol.appendChild(confirmButton);
  confirmButton.type = "button";
  confirmButton.classList.add("btn", "btn-outline-dark", "bg-confirm");
  confirmButton.textContent = "Confirm order";
  confirmButton.addEventListener("click", () =>
    console.log(
      cartItems.map((item, index) => {
        return {
          item: index + 1,
          quantity: item.quantity,
          description: item.name,
          unitPrice: item.price,
        };
      }),
    ),
  );
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
  mainContent.appendChild(document.createElement("hr"));

  // Creates row for content
  const contentRow = document.createElement("div");
  contentRow.classList.add("row");
  mainContent.appendChild(contentRow);

  // Creates card for each product
  products.forEach((product) => {
    // Column for card that ensures same sized and spaced cards
    const col = document.createElement("div");
    contentRow.appendChild(col);
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

  // TODO REMOVE
  showCartItems();
}

/* Execution */
// Load json and build site's content from json
buildSite();
// Update Cart icon
updateCartIcon();
// Add Cart icon event listener
document.getElementById("cart-icon").addEventListener("click", showCartItems);
