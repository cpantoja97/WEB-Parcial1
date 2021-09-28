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
        const navBar = document.querySelector("nav");
        const navItem = document.createElement("a");
        navItem.classList.add("nav-item");
        navItem.innerHTML = category.name;
        navBar.appendChild(navItem);

        navItem.addEventListener("click", (element) => {
          showProducts(element.target.innerHTML);
        });
      });
    };

    const showProducts = (category) => {
      const heading = document.getElementById("product-heading");
      heading.textContent = category;

      const { products } = catalog.find((c) => c.name === category);
      console.log(products);

      const cardsRow = document.getElementById("product-cards");

      while (cardsRow.firstChild) {
        cardsRow.removeChild(cardsRow.firstChild);
      }

      products.forEach((product) => {
        /*
          <div class="card" style="width: 18rem;">
  <img class="card-img-top" src="..." alt="Card image cap">
  <div class="card-body">
    <h5 class="card-title">Card title</h5>
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
          */

        // Column
        const col = document.createElement("div");
        cardsRow.appendChild(col);
        col.classList.add("col", "col-3");
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
        card.classList.add("card-body");

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
        const cardPrice = document.createElement("p");
        cardBody.appendChild(cardPrice);
        cardPrice.classList.add("card-text");
        cardPrice.textContent = `$${product.price}`;

        // Button
        const cardButton = document.createElement("a");
        cardBody.appendChild(cardButton);
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
