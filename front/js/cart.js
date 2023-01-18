// on récupère d'abord les article du basket dans le LS
let basket = JSON.parse(localStorage.getItem("basket"));
//console.log(basket)

displayBasket(basket)
/*-----------------------------------------------------------------------
    Création de la fonction qui affiche le(s) produit(s) sur la page
------------------------------------------------------------------------*/
function displayBasket(basket) {
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

    // on met à jour le LS avec la fonction adéquate
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
/*----------------------------------------------------------
      Création de la fonction qui ajoute des articles
----------------------------------------------------------*/
function addProducts() {
  let itemQuantity = Array.from(document.querySelectorAll('.itemQuantity'))
  console.log(itemQuantity)
  let totalSum = Array.from(document.querySelectorAll("#totalPrice"));
  console.log(totalSum)
  let screenQuantity = Array.from(document.querySelectorAll("#totalQuantity"));
  console.log(screenQuantity)

  itemQuantity.forEach(function (quantity, i) {
    quantity.addEventListener("change", (event) => {
      event.preventDefault();
      let newArticlePrice = quantity.value * basket[i].price;
      console.log(quantity.value);

      screenQuantity[i].textContent = quantity.value;
      basket[i].quantity = parseInt(quantity.value, 10);

      totalSum[i].textContent = newArticlePrice;
      basket[i].totalPrice = newArticlePrice;

      //console.log(`le prix de ${basket[i].name} et passé à ${newArticlePrice}`);

      totalQuantity();
      totalPrice();
    });
  });
}
addProducts()
/*----------------------------------------------------------
      Création de la fonction qui supprime des articles
----------------------------------------------------------*/
function deleteProducts() {
  // on récupère les btns supprimer qui existent dans le DOM et on transforme ça en tableau grâce à Array.from()
  let deleteBtn = Array.from(document.querySelectorAll('.deleteItem'))
  console.log(deleteBtn)

  // on crée un tableau vide pour récupérer le basket existant et contrôler les suppressions d'articles
  let basketControlDelete = [];
  //console.log(basketControlDelete)

  for (let i = 0; i < deleteBtn.length; i++) {
    // Écoute d'évènements au click sur le tableau des boutons supprimer
    deleteBtn[i].addEventListener("click", () => {
      // Suppression de l'article visuellement sur la page
      deleteBtn[i].parentElement.style.display = "none";

      // Copie du tableau basket dans le tableau basketControlDelete
      basketControlDelete = basket;

      // Array.prototype.splice() supprime un élément à chaque index [i] du tableau écouté
      basketControlDelete.splice([i], 1);

      // Mise à jour du local storage
      basket = localStorage.setItem("basket", JSON.stringify(basketControlDelete));

      // Rafraîchissement de la page
      window.location.href = "cart.html";
    });
  }
}
deleteProducts()
