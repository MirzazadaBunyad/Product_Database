document.addEventListener("DOMContentLoaded", () => {
  const DOMSelectors = {
    productNameInput: document.querySelector("#productName"),
    productPriceInput: document.querySelector("#productPrice"),
    addProductBtn: document.querySelector("#addProductBtn"),
    productList: document.querySelector("#productList"),
    totalProducts: document.querySelector("#totalProducts"),
    totalPrice: document.querySelector("#totalPrice"),
  };

  const storageKey = "products";

  const getStoredProducts = () =>
    JSON.parse(localStorage.getItem(storageKey)) || [];

  let products = getStoredProducts();

  const updateLocalStorage = () => {
    localStorage.setItem(storageKey, JSON.stringify(products));
  };

  const updateSummary = () => {
    const totalProductCount = products.length;
    const totalProductPrice = products.reduce(
      (total, { price }) => total + price,
      0
    );

    DOMSelectors.totalProducts.textContent = totalProductCount;
    DOMSelectors.totalPrice.textContent = totalProductPrice;
  };

  const createProductMarkup = ({ name, price }, index) => `
      <li>
        <p class="product-name">${name} (${price} AZN)</p>
        <button class="remove-btn" data-index="${index}">Sil</button>
      </li>
    `;

  const renderProducts = () => {
    DOMSelectors.productList.innerHTML = products
      .map(createProductMarkup)
      .join("");
    updateSummary();
  };

  const addProduct = () => {
    const productName = DOMSelectors.productNameInput.value.trim();
    const productPrice = parseFloat(
      DOMSelectors.productPriceInput.value.trim()
    );

    if (productName && !isNaN(productPrice) && productPrice > 0) {
      products = [...products, { name: productName, price: productPrice }];
      updateLocalStorage();
      renderProducts();
      resetForm();
    } else {
      alert("Zəhmət olmasa, məhsul adı və qiyməti daxil edin.");
    }
  };

  const removeProduct = (index) => {
    products = products.filter((_, i) => i !== parseInt(index, 10));
    updateLocalStorage();
    renderProducts();
  };

  const resetForm = () => {
    DOMSelectors.productNameInput.value = "";
    DOMSelectors.productPriceInput.value = "";
    DOMSelectors.productNameInput.focus();
  };

  const handleRemoveProduct = (e) => {
    if (e.target.matches(".remove-btn")) {
      removeProduct(e.target.dataset.index);
    }
  };

  const handleEnterKey = (e) => {
    if (e.key === "Enter") addProduct();
  };

  const attachEventListeners = () => {
    DOMSelectors.addProductBtn.addEventListener("click", addProduct);
    DOMSelectors.productList.addEventListener("click", handleRemoveProduct);
    DOMSelectors.productNameInput.addEventListener("keydown", handleEnterKey);
    DOMSelectors.productPriceInput.addEventListener("keydown", handleEnterKey);
  };

  const init = () => {
    renderProducts();
    attachEventListeners();
  };

  init();
});
