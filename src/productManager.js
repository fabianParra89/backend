const { promises: fs } = require('fs');
const { v4: uuidV4 } = require('uuid');

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
        fileSaveInit(this.path, this.products)
    }

    async addProduct(title, description, price, thumbnail, code, stock, category ) {

        this.products = await getJSONFromFile(this.path);
        let product = this.products.some(product => product.code === code);
        if (product) {
            console.log('There is already a product with the identifier code');
            return;
        }

        if (!title || !description || !price || !category || !code || stock === undefined) {
            console.log('Complete product information is required');
            return;
        }

        this.products.push({
            id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1,
            // id: uuidV4(),
            title: title,
            description: description,
            code: code,
            price: price,
            status: true,
            stock: stock,
            category: category,
            thumbnail: thumbnail
        });
        await saveJSONToFile(this.path, this.products);

    }

    getProducts() {
        return getJSONFromFile(this.path);
    }

    async getProductsById(id) {
        this.products = await getJSONFromFile(this.path);
        let product = this.products.find(product => product.id === id);
        return product || `Producto con id: ${id} no existe`
    }

    async updateProduct(id, obj) {
        this.products = await getJSONFromFile(this.path);
        let product = this.products.find(product => product.id === id);
        const key = Object.keys(obj);
        key.map((k) => {
            (k in product) ? product[k] = obj[k] : console.error('NO existe la clave ', k)
        });
        await saveJSONToFile(this.path, this.products);
        return product;
    }

    async deleteProduct(id) {
        this.products = await getJSONFromFile(this.path);
        if (this.products.length === 0) {
            console.log('no existen productos para eliminar');
            return;
        }
        let product = this.products.find(product => product.id === id);
        if (!product) {
            console.log(`no existe el producto con id ${id} para eliminarlo`);
            return `no existe el producto con id ${id} para eliminarlo`
        }
        let ind = this.products.indexOf(product);
        this.products.splice(ind, 1);
        await saveJSONToFile(this.path, this.products);
        return;
    }

}

module.exports = ProductManager;


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

