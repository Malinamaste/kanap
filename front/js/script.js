main()
/*-------------------------------------------------------------------
    Création d'une fonction main() qui contient le code de base
            et s'execute dès le chargement de la page
--------------------------------------------------------------------*/
async function main() {
    // on récupère les produits
    const products = await getProducts()
    //console.log(products)

    // on boucle pour afficher tous les produits
    for (product of products) {
        displayProduct(product)
    }
}
/*-------------------------------------------------------------------
    Création d'une fonction qui fait office de première requête
        pour récupérer les données des produits sur l'API
--------------------------------------------------------------------*/
function getProducts() {
    return fetch("http://localhost:3000/api/products")
        // récupération du résultat de la requête au format json (Promise)
        .then(function (httpBodyResponse) {
            return httpBodyResponse.json()
        })
        // on retourne et récupère la vraie valeur du résultat json précédent (Promise)
        .then(function (products) {
            //console.log(products)
            return products
        })
        // au cas où l'API serait down
        .catch(function (error) {
            alert(error)
        })
}
/*------------------------------------------------------
    Création d'une fonction d'affichage d'un produit
            de l'API sur la page index
-------------------------------------------------------*/
function displayProduct(product) {
    //.innerHTML injecte le nouveau contenu
    document.getElementById('items').innerHTML +=
        `<a href="./product.html?_id=${product._id}">
        <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
        </article>
    </a>`;
}
