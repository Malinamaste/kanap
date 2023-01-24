// on récupère d'abord les article du basket dans le LS
let basket = JSON.parse(localStorage.getItem("basket"));
//console.log(basket)

// on crée un tableau pour récupérer les ID de chaque product du basket
let products = [];

// on crée une variable qui contiendra l'orderId de la future requête POST
let orderId = "";

// on récupère les données supplémentaires via l'API
function getDatas(productId) {
  response = fetch('http://localhost:3000/api/products/' + productId)
    .then(data => {
      return data.json();
    });
  console.log(response)
  return response;
}

/*-----------------------------------------------------------------------
    Création de la fonction qui affiche le(s) produit(s) sur la page
------------------------------------------------------------------------*/
async function displayBasket() {
  // on vérifie d'abord si il existe un basket et si il contient des products
  if (basket === null || basket.length === 0) {
    // si il est vide on affiche un message pour informer l'utilisateur
    document.querySelector('h1').textContent = 'Votre panier est vide';
    // sinon on regarde ce qu'il y a dans le LS
  } else for (let i = 0; i < basket.length; i++) {
    let item = basket[i];
    //console.table(basket);

    productData = await getDatas(item.id);
    //console.log(productData);

    //.innerHTML injecte le nouveau contenu dans le DOM
    document.getElementById('cart__items').innerHTML +=
      `<article class="cart__item" data-id="${item.id}" data-color="${item.color}">
          <div class="cart__item__img">
            <img src="${productData.imageUrl}" alt="${productData.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${productData.name}</h2>
              <p>${item.color}</p>
              <p>${productData.price}€</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item.quantity}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`;

    // on push les infos dans products[]
    products.push(item.id);
    //console.log(products);

    // on met à jour le LS avec la fonction adéquate
    updateLocalStorage();
    // appel de la fonction pour ajouter des produits
    addProducts();
    // appel de la fonction pour supprimer des produits
    deleteProducts();
  }
}
displayBasket();
/*----------------------------------------------------------
      Création de la fonction qui met à jour le LS
----------------------------------------------------------*/
function updateLocalStorage() {
  localStorage.setItem('basket', JSON.stringify(basket))
}
/*---------------------------------------------------------------------
    Création de la fonction qui récupère les prix et quantités des 
    articles et calcule la somme totale du prix et de la quantité
----------------------------------------------------------------------*/
async function totalQtyAndPrice() {
  let totalPrice = 0;
  let totalQty = 0;

  if (basket.length != 0) {
    for (let j = 0; j < basket.length; j++) {
      let itemStorage = basket[j];
      const product = await getDatas(itemStorage.id);
      totalPrice +=
        parseInt(itemStorage.quantity) * parseInt(product.price);
      totalQty += parseInt(itemStorage.quantity);
    }
  }

  const finalQty = document.getElementById('totalQuantity');
  finalQty.innerHTML = totalQty;

  const finalPrice = document.getElementById('totalPrice');
  finalPrice.innerHTML = totalPrice;
}
totalQtyAndPrice();
/*----------------------------------------------------------
      Création de la fonction qui ajoute des articles
----------------------------------------------------------*/
function addProducts() {
  let itemQty = document.querySelectorAll('.itemQuantity');

  for (let n = 0; n < itemQty.length; n++) {
    itemQty[n].addEventListener('change', (event) => {
      event.preventDefault();

      let newItemQty = itemQty[n].value;
      let newTotalQty = document.getElementById('totalQuantity');

      const newLS = {
        id: basket[n].id,
        img: basket[n].img,
        name: basket[n].name,
        color: basket[n].color,
        quantity: parseInt(newItemQty),
      };

      if (newItemQty > 100) {
        alert('Trop de produits');
        return;
      }

      if (newItemQty <= 0) {
        alert('Quantité non valide');
        return;
      }

      basket[n] = newLS;
      localStorage.setItem('basket', JSON.stringify(basket));

      newTotalQty.innerHTML = totalQtyAndPrice();
    });
  }
}
/*----------------------------------------------------------
      Création de la fonction qui supprime des articles
----------------------------------------------------------*/
function deleteProducts() {
  // on récupère les btns supprimer qui existent dans le DOM et on transforme ça en tableau grâce à Array.from()
  let deleteBtn = Array.from(document.querySelectorAll('.deleteItem'))
  //console.log(deleteBtn)

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
/***************************************************************
      GESTION DU FORMULAIRE / REGEX / REQUETE SERVEUR POST
****************************************************************/
// on vient cibler le btn 'commander' du formulaire
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

  // REGEX pour contrôler la validité des champs firstName + lastName + city
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

  // fonction de contrôle des valeurs de firstName
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

  // fonction de contrôle des valeurs de lastName
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

  // fonction de contrôle des valeurs de address
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

  // fonction de contrôle des valeurs de city
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

  // fonction de contrôle des valeurs de email
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
    controlFirstName() &&
    controlLastName() &&
    controlAddress() &&
    controlCity() &&
    controlEmail()
  ) {
    // on enregistre le formulaire dans le LS
    localStorage.setItem('contact', JSON.stringify(contact));
    // on appelle la fonction qui envoie les données au serveur
    sendToServer();
  } else {
    // si toutes les conditions ne sont pas remplies on alerte l'utilisateur
    alert('Formulaire incorrect. Veuillez le remplir à nouveau.');
  }
  /*------------------------------------------------------
      Création de la fonction qui envoie les données
          au serveur avec la méthode POST
  -------------------------------------------------------*/
  function sendToServer() {
    fetch('http://localhost:3000/api/products/order', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ contact, products }), // clefs contact et products
    })
      // on récupère et stock la réponse de l'API (orderId)
      .then((response) => {
        return response.json();
      })
      .then((server) => {
        const orderId = server.orderId;
        console.log(orderId);
        // si orderId n'est pas undefined on redirige l'utilisateur vers la page confirmation
        if (orderId != undefined) {
          location.href = 'confirmation.html?id=' + orderId;
        }
      });
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
