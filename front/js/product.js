/*-----------------------------------------------
    Création d'une fonction async auto-appelée
------------------------------------------------*/
(function() {
    // on récupère d'abord l'id du produit dans l'url
    const productId = getProductId()
    console.log(productId)
    // on récupère le produit grâce à l'id
    const product = getProduct(productId)
    // puis on l'affiche
    displayProduct(product)
})()
/*------------------------------------------------------------
    Création de la fonction qui récupère l'id du produit
-------------------------------------------------------------*/
function getProductId() {
    return new URL(location.href).searchParams.get('_id')
}
/*-------------------------------------------------------------
    Création de la fonction qui récupère le produit via l'id
--------------------------------------------------------------*/
function getProduct(productId) {
    //
}
/*----------------------------------------------------------------
    Création de la fonction qui affiche le produit sur la page
-----------------------------------------------------------------*/
function displayProduct(product) {
    //
}
