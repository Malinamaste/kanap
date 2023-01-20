/*------------------------------------------------------------
    Creation de la fonction qui récupère l'id du produit
-------------------------------------------------------------*/
function getProductId() {
  return new URL(location.href).searchParams.get('id')
}

const orderId = getProductId();
console.log(orderId);

const basket = JSON.parse(localStorage.getItem('basket'));
console.log(basket);

// on cible l'élément dans le DOM pour lui injecter plus tard une valeur
const confirmation = document.getElementById('orderId');

function displayOrderId() {
  // on affiche le numéro de commande
  confirmation.innerHTML = '${orderId}';

  // et on termine en vidant le LS
  localStorage.clear();
}
displayOrderId(orderId)