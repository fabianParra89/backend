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
            // console.log('There is already a cart with this id');
            return 'There is already a cart with this id';
        }

        this.carts.push({
            ...cart
        });
        await saveJSONToFile(this.path, this.carts);
        return _cart;
    }

    async addProductCartbyId(cartId, productId, body) {

        this.carts = await getJSONFromFile(this.path);
        let _cart = this.carts.find(c => c.id === cartId);
        if (_cart) {
            const product1 = new ProductManager('../productos.json');
            const products = await product1.getProducts();
            const { quantity } = body;
            // console.log(products);
            const validateProducts = products.some(vp => vp.id === productId);
            if (!validateProducts) {
                return {
                    status: 'Error',
                    description: `Product with id: ${productId} not found`
                };
            }
            const productCart = _cart.product.find(p => p.id === productId);
            if (productCart) {
                productCart.quantity += quantity;
            } else {
                let newProduct = {
                    id: productId,
                    quantity: quantity
                }
                _cart.product.push(newProduct)
            }
        } else {
            return {
                status: 'Error',
                description: `Cart with id: ${cartId} not found`
            };
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
            const cartProducts = cart.product;
            let validProduct = true;
            let invalidProducts = [];
            cartProducts.forEach(cp => {
                let productExist = products.find(p => p.id === cp.id);
                if (productExist) {
                    listProduct.push({
                        ...productExist,
                        "quantity": cp.quantity
                    });
                } else {
                    validProduct = false;
                    invalidProducts.push(cp.id);
                }
            });
            if (validProduct) {
                return listProduct;
            } else {
                return {
                    status: 'Error',
                    description: `Product with id: ${invalidProducts} not found in Products`
                };
            }
        } else {
            return {
                status: 'Error',
                description: `cart with id: ${cartId} not found`
            };

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

