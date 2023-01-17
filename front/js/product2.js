/*-----------------------------------------------
    Création d'une fonction async auto-appelée
------------------------------------------------*/
(async function () {
  // On récupère d'abord l'id du produit dans l'url
  const productId = getProductId()
  //console.log(productId)

  // On récupère le produit grâce à l'id
  const product = await getProduct(productId)
  //console.log(product)

  // Puis on l'affiche
  displayProduct(product)
  // et on permet l'ajout de produit au panier
  addToCart(product)
})()
/*------------------------------------------------------------
    Creation de la fonction qui récupère l'id du produit
-------------------------------------------------------------*/
function getProductId() {
  return new URL(location.href).searchParams.get('_id')
}
/*--------------------------------------------------------
    Création de la fonction qui récupère le produit
        au sein de l'API via son id
---------------------------------------------------------*/
function getProduct(productId) {
  return fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function (httpBodyResponse) {
      return httpBodyResponse.json()
    })
    .then(function (product) {
      return product
    })
    .catch(function (error) {
      alert(error)
    })
}
/*----------------------------------------------------------------
    Création de la fonction qui affiche le produit sur la page
-----------------------------------------------------------------*/
function displayProduct(product) {
  let colorOption = document.getElementById('colors');

  document.querySelector('div.item__img').innerHTML =
    `<img src="${product.imageUrl}" alt="${product.altTxt}">`
  document.getElementById('title').textContent = product.name
  document.getElementById('price').textContent = product.price
  document.getElementById('description').textContent = product.description
  // On boucle pour le choix des couleurs
  for (let color of product.colors) {
    colorOption.innerHTML += `<option value="${color}">${color}</option>`
  }
}
/*---------------------------------------------------------------------
        Création de la fonction d'ajout de produits au panier
----------------------------------------------------------------------*/
function addToCart(product) {
  // on cible le bouton 'Ajouter au panier'
  const button = document.getElementById('addToCart')

  // on écoute l'event au click sur le btn et on lui dit ce qu'il doit faire
  button.addEventListener("click", (e) => {
    // valeur de la couleur sélectionnée par l'utilisateur
    const color = document.getElementById('colors').value
    // valeur de la qty sélectionnée par l'utilisateur
    const qty = document.getElementById('quantity').value
    //on récupère l'id du produit en question
    const id = getProductId()

    // on vérifie que la color et qty sont conformes aux attentes
    if (color == undefined || color === "" || qty < 1 || qty > 100 || qty === undefined) {
      alert(`Veuillez sélectionner une couleur et/ou une quantité.`);
    } else {
      // on stocke les valeurs du produit choisit dans un objet
      let choosenProduct = {
        id: id,
        //name: product.name,
        //img: product.imageUrl,
        //altTxt: product.altTxt,
        color: color,
        quantity: parseInt(qty, 10),
        //price: product.price,
        //totalPrice: product.price * parseInt(qty, 10)
      }
      //console.log(choosenProduct)

      // on déclare une variable contenant le LS
      let localStorageBasket = JSON.parse(localStorage.getItem("basket"));

      // puis on vérifie si le basket existe déjà dans le LS
      if (localStorageBasket) {
        // on vérifie avec .find() si l'id et la couleur d'un article sont déjà présents et égaux
        let item = localStorageBasket.find(
          (item) => item.id == choosenProduct.id && item.color == choosenProduct.color
        );
        // SI OUI > on ajoute la nouvelle quantité à l'ancienne
        if (item) {
          let newItemQuantity = item.quantity;
          item.quantity = item.quantity + choosenProduct.quantity;
          console.log(newItemQuantity)

          if (newItemQuantity === 100) {
            alert('Vous ne pouvez pas commander plus de 100 exemplaires.')
            return
          }

          localStorage.setItem("basket", JSON.stringify(localStorageBasket));
          return;

          /*while (item.quantity + choosenProduct.quantity <= 100 && item.color === choosenProduct.color) {
              item.quantity = item.quantity + choosenProduct.quantity;
              //item.totalPrice += item.price * choosenProduct.quantity;
              //console.log(item.totalPrice);
              console.log(item.quantity);
          }*/
        } /*else {
                    alert('Vous ne pouvez pas commander plus de 100 exemplaires de ce modèle.')
                }*/
        // si le produit n'existe pas déjà dans le LS on le push
        localStorageBasket.push(choosenProduct);
        localStorage.setItem("basket", JSON.stringify(localStorageBasket));
      } else {
        //  sinon on crée un nouveau tableau dans lequel on push choosenProduct
        let newBasketLS = [];
        newBasketLS.push(choosenProduct);
        localStorage.setItem("basket", JSON.stringify(newBasketLS));
      }
      document.getElementById('addToCart').textContent = 'Produit ajouté!';
      //window.location.href = "cart.html" ?
    }
  })
}
