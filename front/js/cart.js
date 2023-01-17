// on récupère d'abord les article du basket dans le LS
const basket = JSON.parse(localStorage.getItem("basket"));
//console.log(basket)

displayProduct()

/*-----------------------------------------------------------------------
    Création de la fonction qui affiche le(s) produit(s) sur la page
------------------------------------------------------------------------*/
function displayProduct(product) {
  // on vérifie d'abord si il existe un basket et si il contient des products
  if (basket === null || basket.length === 0) {
    // si il est vide on affiche un message pour informer l'utilisateur
    document.querySelector('h1').textContent = 'Votre panier est vide';
  } else {
    // on boucle pour afficher dans le DOM les products présents dans le basket
    for (product of basket) {
      //.innerHTML injecte le nouveau contenu dans le DOM
      document.getElementById('cart__items').innerHTML +=
        `<article class="cart__item" data-id="${product.id}" data-color="${product.color}">
          <div class="cart__item__img">
            <img src="${product.img}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${product.color}</p>
              <p>${product.price}€</p>
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
        </article>`

      // on crée un tableau pour récupérer les ID de chaque product
      let itemsId = []
      // et on push les infos dedans
      itemsId.push(product.id);
      console.log(itemsId);
    }
    // on affiche la quantité totale grâce à la fonction totalQuantity()
    document.getElementById('totalQuantity').innerHTML = totalQuantity()
    // on affiche le prix total grâce à la fonction totalPrice()
    document.getElementById('totalPrice').innerHTML = totalPrice()

    updateLocalStorage()
  }
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
