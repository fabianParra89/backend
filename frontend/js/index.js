(function () {
    fetch('http://localhost:8080/api/carts/')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(console.erros);
})();