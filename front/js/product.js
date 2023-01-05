/*------------------------------------------
    Récupération des paramètres d'URL
-------------------------------------------*/
const url = new URL(document.location.href);
console.log(url);
const searchParams = new URLSearchParams(url.search);
console.log(searchParams);
const id = url.searchParams.get("_id");
console.log(id);