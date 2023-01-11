/*-----------------------------------------------
    Création d'une fonction async auto-appelée
------------------------------------------------*/
(async function () {
    // on récupère d'abord l'id du produit dans l'url
    const productId = getProductId()
    //console.log(productId)
    // on récupère le produit grâce à l'id
    const product = await getProduct(productId)
    //console.log(product)
    // puis on l'affiche
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
    // on boucle pour le choix des couleurs
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
        const handleData = {
            id: id,
            color: color,
            quantity: qty
        }

        if (
            color == undefined ||
            color === "" ||
            qty < 1 ||
            qty > 100 ||
            qty === undefined
        ) {
            alert(`Veuillez sélectionner une couleur et/ou une quantité.`);
        } else {
            localStorage.setItem(id, JSON.stringify(handleData))
            document.getElementById('addToCart').textContent = 'Produit ajouté au panier';
            //window.location.href = "cart.html"
        }
    })
}