(function () {
  const socket = io();

  document
    .getElementById('form-product')
    .addEventListener('submit', (event) => {
      event.preventDefault();
      const inputTitle = document.getElementById('title');
      const inputDescription = document.getElementById('description');
      const inputPrice = document.getElementById('price');
      const inputThumbnail = document.getElementById('thumbnail');
      const inputCode = document.getElementById('code');
      const inputStock = document.getElementById('stock');
      const inputCategory = document.getElementById('category');
      const newProduct = {
        title: inputTitle.value,
        description: inputDescription.value,
        price: inputPrice.value,
        thumbnail: inputThumbnail.value,
        code: inputCode.value,
        stock: inputStock.value,
        category: inputCategory.value,
      };
      socket.emit('new-product', newProduct);
      inputTitle.value = '';
      inputDescription.value = '';
      inputPrice.value = '';
      inputThumbnail.value = '';
      inputCode.value = '';
      inputStock.value = '';
      inputCategory.value = '';
      newProduct.value = '';
      inputTitle.focus();
    });

  // document
  //   .getElementById('form-delProduct')
  //   .addEventListener('submit', (event) => {
  //     event.preventDefault();
  //     const productId = document.getElementById('productId');
  //     socket.emit('delete-product', productId.value);
  //     productId.value = '';
  //     productId.focus();
  //   });

  socket.on('update-products', (products) => {


    const tableProducts = document.getElementById('table-products');
    const tableBody = tableProducts.querySelector("tbody");
    tableBody.innerText = '';
    console.log('products', products);
    products.forEach((product) => {
      const row = document.createElement('tr');

      const colTitle = document.createElement('td');
      colTitle.textContent = product.title;

      const colId = document.createElement('td');
      colId.textContent = product.id;

      const colDescription = document.createElement('td');
      colDescription.textContent = product.description;

      const colPrice = document.createElement('td');
      colPrice.textContent = product.price;

      const colCode = document.createElement('td');
      colCode.textContent = product.code;

      const colStock = document.createElement('td');
      colStock.textContent = product.stock;

      const colStatus = document.createElement('td');
      colStatus.textContent = product.status;

      const colCategory = document.createElement('td');
      colCategory.textContent = product.category;

      const colImage = document.createElement('td');
      const image = document.createElement('img');
      image.classList.add("img-product");
      image.src = product.thumbnail;
      image.alt = product.title;
      colImage.appendChild(image)
      
      const colDelete = document.createElement('td');
      const buttDelete =  document.createElement('img');
      buttDelete.src = "./img/borrar.png";
      buttDelete.alt = "eliminar";
      buttDelete.classList.add("img-butt-Delete");
      buttDelete.addEventListener("click", () => {
        socket.emit('delete-product', product.id);
          // eliminarPedido(element, arrayPedidoRender)
      })
      colDelete.appendChild(buttDelete)


      row.appendChild(colTitle);
      row.appendChild(colId);
      row.appendChild(colDescription);
      row.appendChild(colPrice);
      row.appendChild(colCode);
      row.appendChild(colStock);
      row.appendChild(colStatus);
      row.appendChild(colCategory);
      row.appendChild(colImage);
      row.appendChild(colDelete);

      tableBody.appendChild(row);


      // p.innerText = `${product.title}: ${product.price}`;
      // listProducts.appendChild(p);
    });
  });
  // Swal.fire({
  //   title: 'Indentificate por favor 👮',
  //   input: 'text',
  //   allowOutsideClick: false,
  //   inputValidator:(value) => {
  //     if (!value) {
  //       return 'Necesitamos que ingreses su username para continuar.'
  //     }
  //   }
  // })
  // .then((result) => {
  //   username = result.value.trim();
  //   console.log('username', username);
  // })
  // .catch((error) => {
  //   console.error('Ah ocurrido un error al capturar el nombre 😨:',  error.message);
  // });

})();

