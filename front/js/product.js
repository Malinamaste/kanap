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
    addToCart()
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
        .then(function (products) {
            return products
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
function addToCart() {
    const button = document.getElementById('addToCart')

    button.addEventListener("click", () => {
        const color = document.getElementById('colors').value
        const qty = document.getElementById('quantity').value
        const id = getProductId()

        if (color == undefined || color === "" || qty < 1 || qty > 100 || qty === undefined) {
            alert(`Veuillez sélectionner une couleur et/ou une quantité.`);
        } else {
            // on stocke les valeurs du produit choisit dans un objet
            let choosenProduct = {
                id: id,
                color: color,
                quantity: parseInt(qty, 10),
            }
            //console.log(choosenProduct)

            // on déclare une variable contenant le LS
            let localStorageProducts = JSON.parse(localStorage.getItem("basket"));

            // on vérifie si le basket existe  déjà dans le LS
            if (localStorageProducts) {
                // on vérifie avec .find() si l'id et la couleur d'un article sont déjà présents et égaux
                let item = localStorageProducts.find(
                    (item) =>
                        item.id == choosenProduct.id && item.color == choosenProduct.color
                );
                // SI OUI > on ajoute la nouvelle quantité à l'ancienne
                if (item) {
                    item.quantity = item.quantity + choosenProduct.quantity;
                    //item.totalPrice += item.price * choosenProduct.quantity;
                    //console.log(item.totalPrice);
                    //console.log(item.quantity);
                    localStorage.setItem("basket", JSON.stringify(localStorageProducts));
                    return;
                }
                // si le produit n'existe pas déjà dans le LS on le push
                localStorageProducts.push(choosenProduct);
                localStorage.setItem("basket", JSON.stringify(localStorageProducts));
            } else {
                //  sinon on crée un tableau dans lequel on push choosenProduct
                let newTabLocalStorage = [];
                newTabLocalStorage.push(choosenProduct);
                localStorage.setItem("basket", JSON.stringify(newTabLocalStorage));
            }
        }
        //document.getElementById('addToCart').textContent = 'Produit ajouté au panier';
        //window.location.href = "cart.html"*/
    })
}
