// on récupère d'abord les article du basket dans le LS
let basket = JSON.parse(localStorage.getItem("basket"));
//console.log(basket)

// on crée un tableau pour récupérer les ID de chaque product du basket
let itemsId = [];

displayBasket(basket);
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
      //let itemsId = [];
      // et on push les infos dedans
      itemsId.push(product.id);
      console.log(itemsId);
    }
    // on affiche la quantité totale grâce à la fonction totalQuantity()
    document.getElementById('totalQuantity').innerHTML = totalQuantity();
    // on affiche le prix total grâce à la fonction totalPrice()
    document.getElementById('totalPrice').innerHTML = totalPrice();

    // on met à jour le LS avec la fonction adéquate
    updateLocalStorage();
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
  let itemQuantity = Array.from(document.querySelectorAll('.itemQuantity'));
  console.log(itemQuantity)
  let totalSum = Array.from(document.querySelectorAll("#totalPrice"));
  console.log(totalSum)
  let screenQuantity = Array.from(document.querySelectorAll("#totalQuantity"));
  console.log(screenQuantity)

  let basketAddControl = [];

  itemQuantity.forEach(function (quantity, i) {
    quantity.addEventListener('change', (e) => {
      e.preventDefault();
      let newArticlePrice = quantity.value * basket[i].price;
      console.log(quantity.value);

      screenQuantity[i].textContent = quantity.value;
      basket[i].quantity = parseInt(quantity.value, 10);

      totalSum[i].textContent = newArticlePrice;
      basket[i].totalPrice = newArticlePrice;

      basketAddControl.push(newArticlePrice);
      basketAddControl = basket;
      basket = localStorage.setItem("basket", JSON.stringify(basketAddControl));

      //totalQuantity();
      //totalPrice();
    });
  });
}
addProducts();
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
deleteProducts();
/*---------------------------------------
          GESTION DU FORMULAIRE
---------------------------------------*/
// on vient cibler le btn commander du formulaire
const orderBtn = document.getElementById('order');
//console.log(orderBtn)

// on écoute l'event au click de orderBtn pour contrôler, récupérer les informations et les envoyer plus tard
orderBtn.addEventListener('click', (e) => {
  e.preventDefault();

  // on crée un objet qui stocke les données entrées par l'utilisateur
  let contact = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    address: document.getElementById('address').value,
    city: document.getElementById('city').value,
    email: document.getElementById('email').value
  };
  //console.log(contact)

  // REGEX pour contrôler la validité des champs firstName + lastName
  const regNamesAndCity = (value) => {
    return /^[A-Za-z][A-Za-z\é\è\ê\ë\ï\œ\-\s]+$/.test(value);
  };

  // REGEX pour contrôler la validité du champ address
  const regAddress = (value) => {
    return /^[a-zA-Z0-9.,-_ ]{5,50}[ ]{0,2}$/.test(value);
  };

  // REGEX pour contrôler la validité du champ email
  const regEmail = (value) => {
    return /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$/.test(value);
  }

  function controlFirstName() {
    // on récupère la valeur de l'input
    const firstName = contact.firstName;
    // on cible l'input afin de changer son apparence
    let inputFirstName = document.getElementById('firstName');
    // si firstName répond aux attentes OK...sinon ERROR
    if (regNamesAndCity(firstName)) {
      inputFirstName.style.backgroundColor = "green";
      document.getElementById('firstNameErrorMsg').textContent = "";
      return true;
    } else {
      inputFirstName.style.backgroundColor = "red";
      document.getElementById('firstNameErrorMsg').textContent = "Champ invalide. Ex: Mélanie";
      return false;
    }
  }

  function controlLastName() {
    // on récupère la valeur de l'input
    const lastName = contact.lastName;
    // on cible l'input afin de changer son apparence
    let inputLastName = document.getElementById('lastName');
    // si lastName répond aux attentes OK...sinon ERROR
    if (regNamesAndCity(lastName)) {
      inputLastName.style.backgroundColor = "green";
      document.getElementById('lastNameErrorMsg').textContent = "";
      return true;
    } else {
      inputLastName.style.backgroundColor = 'red';
      document.getElementById('lastNameErrorMsg').textContent = "Champ invalide. Ex: Morey";
      return false;
    }
  }

  function controlAddress() {
    // on récupère la valeur de l'input
    const address = contact.address;
    // on cible l'input afin de changer son apparence
    let inputAddress = document.getElementById('address');
    // si address répond aux attentes OK...sinon ERROR
    if (regAddress(address)) {
      inputAddress.style.backgroundColor = "green";
      document.getElementById('addressErrorMsg').textContent = "";
      return true;
    } else {
      inputAddress.style.backgroundColor = 'red';
      document.getElementById('addressErrorMsg').textContent = "Champ invalide. Ex: 44 avenue Montblanc";
      return false;
    }
  }

  function controlCity() {
    // on récupère la valeur de l'input
    const city = contact.city;
    // on cible l'input afin de changer son apparence
    let inputCity = document.getElementById('city');
    // si city répond aux attentes OK...sinon ERROR
    if (regNamesAndCity(city)) {
      inputCity.style.backgroundColor = "green";
      document.getElementById('cityErrorMsg').textContent = "";
      return true;
    } else {
      inputCity.style.backgroundColor = 'red';
      document.getElementById('cityErrorMsg').textContent = "Champ invalide. Ex: Lyon";
      return false;
    }
  }

  function controlEmail() {
    // on récupère la valeur de l'input
    const email = contact.email;
    // on cible l'input afin de changer son apparence
    let inputEmail = document.getElementById('email');
    // si email répond aux attentes OK...sinon ERROR
    if (regEmail(email)) {
      inputEmail.style.backgroundColor = "green";
      document.getElementById('emailErrorMsg').textContent = "";
      return true;
    } else {
      inputEmail.style.backgroundColor = "red";
      document.getElementById('emailErrorMsg').textContent = "Champ invalide. Ex: johndoe@contact.com";
      return false;
    }
  }

  // on vérifie que le panier n'est pas vide et la validité du formulaire afin de stocker les données de l'utilisateur dans le LS
  if (
    basket.length > 0 &&
    controlFirstName() &&
    controlLastName() &&
    controlAddress() &&
    controlCity() &&
    controlEmail()
  ) {
    // on enregistre le formulaire dans le LS
    localStorage.setItem('contact', JSON.stringify(contact));
    // on modifie le btn commander pour informer l'utilisateur que tout est bon
    orderBtn.value = "Commande passée!";
    // Appel de la fonction qui envoie les données au server
    sendToServer();
  } else {
    // si toutes les conditions ne sont pas remplies on alerte l'utilisateur
    alert('Formulaire incorrect. Veuillez le remplir à nouveau.');
  }
  /*----------------------------------------------------------------
      Création de la fonction qui envoie les données au serveur
  ----------------------------------------------------------------*/
  function sendToServer(orderId) {
    const serverToServer =
      fetch('http://localhost:3000/api/products/order', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contact, itemsId }),
      })
        // on récupère et stock la réponse de l'API (orderId)
        .then((response) => {
          return response.json();
        })
        .then((server) => {
          orderId = server.orderId;
          console.log(orderId);
        });
    // si orderId n'est pas une chaîne de caractère vide, on redirige l'utilisateur
    if (orderId != "") {
      //location.href = 'confirmation.html?id=' + orderId;
    }
  }
});

let formDatas = JSON.parse(localStorage.getItem('contact'));
console.log(formDatas)

if (formDatas) {
  document.getElementById('firstName').value = formDatas.firstName;
  document.getElementById('lastName').value = formDatas.lastName;
  document.getElementById('address').value = formDatas.address;
  document.getElementById('city').value = formDatas.city;
  document.getElementById('email').value = formDatas.email;
} else {
  console.log('Le formulaire est vide!')
}
