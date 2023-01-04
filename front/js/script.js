/*-------------------------------------------------------------------
    1ère requête pour récupérer les données des produits sur l'API
--------------------------------------------------------------------*/
fetch("http://localhost:3000/api/products")
  // récupération du résultat de la requête au format json (Promise)
  .then(function(res) {
    if (res.ok) {
      return res.json();
    }
  })
  // on retourne et récupère la vraie valeur du résultat json précédent (Promise)
  .then(function(objectKanap) {
    console.log(objectKanap);
    // call de la fonction d'affichage des produits
    displayKanaps(objectKanap);
  })
  // si erreur, on remplace le contenu h1 par erreur 404 et on affiche l'erreur dans la console
  .catch(function(err) {
    document.querySelector(".titles").innerHTML = "<h1>erreur 404</h1>";
    console.log("erreur 404 :" + err);
  });
/*-------------------------------------------------------------------
    Fonction d'affichage des produits de l'API sur la page index
--------------------------------------------------------------------*/
function displayKanaps(index) {
  // variable qui contient la section#items > article
  let sectionKanap = document.getElementById('items');
  // boucle pour chaque article > section#items de la page index
  for (let article of index) {
    // création et ajout des zones d'articles
    sectionKanap.innerHTML += `<a href="./product.html?_id=${article._id}">
   <article>
     <img src="${article.imageUrl}" alt="${article.altTxt}">
     <h3 class="productName">${article.name}</h3>
     <p class="productDescription">${article.description}</p>
   </article>
  </a>`;
  }
}
