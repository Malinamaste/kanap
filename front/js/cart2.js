// on récupère d'abord les article du basket dans le LS
const basket = JSON.parse(localStorage.getItem("basket"));
//console.log(basket)

// on crée un tableau pour récupérer les ID de chaque product
//let productsDatas = [];

getProducts();
//----------------------------------------------------------------------
async function getProducts() {
  // on fetch l'API pour récupérer les données
  const res = await fetch("http://localhost:3000/api/products");
  // puis on transforme la response en JSON
  const productsDatas = await res.json();

  // call des fonctions nécessaires
  displayCart(productsDatas);
}

//productsDatas.push(products.id);
//console.log(productsDatas);

//const products = await getProducts()
//console.log(products)
//getProducts()
//displayProduct()

if (basket.length > 0) {
  getProducts();
}
/*-----------------------------------------------------------------------
    Création de la fonction qui affiche le(s) produit(s) sur la page
------------------------------------------------------------------------*/
function displayCart(productsDatas) {
  let productsDatas = [];
  // on boucle pour afficher dans le DOM les products présents dans le basket
  for (let index of basket) {
    const index = productsDatas.findIndex((product) => product._id === products._id);
    //.innerHTML injecte le nouveau contenu dans le DOM
    const products =
      `<article class="cart__item" data-id="${index.id}" data-color="${index.color}">
          <div class="cart__item__img">
            <img src="${products.img}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${index.color}</p>
              <p>${productsDatas[index].price}€</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`;

    document.getElementById('cart__items').innerHTML += product

    // on crée un tableau pour récupérer les ID de chaque product
    //let itemsId = []

    //itemsId.push(product.id);
    //console.log(itemsId);
  }
  // on affiche la quantité totale grâce à la fonction totalQuantity()
  document.getElementById('totalQuantity').innerHTML = totalQuantity()
  // on affiche le prix total grâce à la fonction totalPrice()
  document.getElementById('totalPrice').innerHTML = totalPrice()

  updateLocalStorage()
}

/*-------------------------------------------------------
    Création de la fonction qui récupère les prix
      des articles et calcule la somme totale
--------------------------------------------------------*/
function totalPrice() {
  //console.log(basket);
  let foundPrices = basket.map((element) => element.totalPrice);
  console.log(foundPrices);

  const reducer = (previousValue, currentValue) => previousValue + currentValue;
  // reduce() traite chaque valeur d'une liste (gauche -> droite) afin de la réduire à une seule valeur
  let sumPrices = foundPrices.reduce(reducer);
  console.log(sumPrices);
  return sumPrices;
};
/*----------------------------------------------------------
    Création de la fonction qui récupère les quantité de
      chaque produit et calcule la quantité totale
----------------------------------------------------------*/
function totalQuantity() {
  //console.log(basket);
  let foundQty = basket.map((element) => element.quantity);
  console.log(foundQty);

  const reducer = (previousValue, currentValue) => previousValue + currentValue;
  // reduce() traite chaque valeur d'une liste (gauche -> droite) afin de la réduire à une seule valeur
  let sumQty = foundQty.reduce(reducer);
  console.log(sumQty);
  return sumQty;
};
/*----------------------------------------------------------
      Création de la fonction qui met à jour le LS
----------------------------------------------------------*/
function updateLocalStorage() {
  localStorage.setItem('basket', JSON.stringify(basket))
}
