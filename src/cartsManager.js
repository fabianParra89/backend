const { promises: fs } = require('fs');
const { v4: uuidV4 } = require('uuid');
const ProductManager = require('./productManager');


class CartsManager {
    constructor(path, cart) {
        this.carts = cart;
        this.path = path;
        fileSaveInit(this.path, this.carts)
    }

    async addCart(cart) {

        this.carts = await getJSONFromFile(this.path);
        let _cart = this.carts.some(c => c.id === cart.id);
        if (_cart) {
            console.log('There is already a cart with this id');
            return 'There is already a cart with this id';
        }

        this.carts.push({
            ...cart
        });
        await saveJSONToFile(this.path, this.carts);
        return _cart;
    }

    async addProductCartbyId(cartId, productId) {

        this.carts = await getJSONFromFile(this.path);
        let _cart = this.carts.find(c => c.id === cartId);
        if (_cart) {
            const product = _cart.products.find(p => p.id === productId);
            if (product) {
                product.quantity++;
            } else {
                let newProduct = {
                    id: productId,
                    quantity: 1
                }
                _cart.products.push(newProduct)
            }
        } else {
            console.log('no existe carrito');
        }
        await saveJSONToFile(this.path, this.carts);
        return _cart;
    }

    async getProductsCartsById(cartId) {
        this.carts = await getJSONFromFile(this.path);
        let cart = this.carts.find(c => c.id === cartId);
        let listProduct = [];
        if (cart) {
            const product1 = new ProductManager('../productos.json');
            const products = await product1.getProducts();
            const cartProducts = cart.products;
            cartProducts.forEach(cp => {

                let productExist = products.find(p => p.id === parseInt(cp.id));
                if (productExist) {
                    listProduct.push({
                        ...productExist,
                        "quantity": cp.quantity
                    });
                }

            });
            return listProduct;
        } else {
            return `cart con id: ${cartId} no existe`;
        }
    }
}

module.exports = CartsManager;


const saveJSONToFile = async (path, data) => {
    const content = JSON.stringify(data, null, '\t');
    try {
        await fs.writeFile(path, content, 'utf-8');
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser escrito.`);
    }
}

const fileSaveInit = async (path, data) => {
    try {
        await fs.access(path);
    } catch (error) {
        await saveJSONToFile(path, data);
    }
}

const getJSONFromFile = async (path) => {
    try {
        await fs.access(path);
    } catch (error) {
        return [];
    }
    const content = await fs.readFile(path, 'utf-8');
    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
    }
}

