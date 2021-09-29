/* Constants */
const URL =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";

/* Variables */
let cartItems = [];

const getProductQuantity = () => {
  return cartItems.length;
};

const updateCartIcon = () => {
  const itemCount = document.getElementById("item-count");
  itemCount.textContent = `${getProductQuantity()} items`;
};

const addProduct = (product) => {
  cartItems.push(product);
  updateCartIcon();
};

/* Instructions */
fetch(URL)
  .then((res) => res.json())
  .then((catalog) => {
    console.log(catalog);
    const buildNavBar = (catalog) => {
      catalog.forEach((category) => {
        const navBar = document.getElementById("navbar-content");
        const navItem = document.createElement("a");
        navItem.classList.add("nav-item", "nav-link");
        navItem.innerHTML = category.name;
        navBar.appendChild(navItem);

        navItem.addEventListener("click", (element) => {
          showProducts(element.target.innerHTML);
        });
      });
    };

    const showProducts = (category) => {
      const heading = document.getElementById("main-heading");
      heading.textContent = category;

      const { products } = catalog.find((c) => c.name === category);
      console.log(products);

      const mainContent = document.getElementById("main-content");

      while (mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild);
      }

      products.forEach((product) => {
        // Column
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

        // Image
        const img = document.createElement("img");
        img.classList.add("card-img-top");
        card.appendChild(img);
        img.src = product.image;

        // Body
        const cardBody = document.createElement("div");
        card.appendChild(cardBody);
        cardBody.classList.add("card-body", "d-flex", "flex-column","align-items-start");

        // Title
        const cardTitle = document.createElement("h5");
        cardBody.appendChild(cardTitle);
        cardTitle.textContent = product.name;

        // Description
        const cardDescription = document.createElement("p");
        cardBody.appendChild(cardDescription);
        cardDescription.classList.add("card-text");
        cardDescription.textContent = product.description;

        // Price
        const cardPrice = document.createElement("h6");
        cardBody.appendChild(cardPrice);
        cardPrice.classList.add("card-text", "mt-auto");
        cardPrice.textContent = `$${product.price}`;

        // Button
        const cardButton = document.createElement("button");
        cardBody.appendChild(cardButton);
        cardButton.type = "button";
        cardButton.classList.add("btn", "btn-dark");
        cardButton.textContent = "Add to cart";

        cardButton.addEventListener("click", () => {
          addProduct({ name: "mock-product-add" });
        });
      });
    };

    buildNavBar(catalog);
    showProducts(catalog[0].name);
  });
