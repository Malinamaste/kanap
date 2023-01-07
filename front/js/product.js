/*-----------------------------------------------
    Création d'une fonction async auto-appelée
------------------------------------------------*/
(async function () {
    // on récupère d'abord l'id du produit dans l'url
    const productId = getProductId()
    console.log(productId)
    // on récupère le produit grâce à l'id
    const product = await getProduct(productId)
    console.log(product)
    // puis on l'affiche
    displayProduct(product)
})()
/*------------------------------------------------------------
    Creation de la fonction qui récupère l'id du produit
-------------------------------------------------------------*/
function getProductId() {
    return new URL(location.href).searchParams.get('_id')
}
/*---------------------------------------------------------------
    Création de la fonction qui récupère le produit via l'id
----------------------------------------------------------------*/
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
