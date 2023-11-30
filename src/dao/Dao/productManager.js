import { promises as fs } from 'fs';
import { v4 as uuidV4 } from 'uuid';

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
        fileSaveInit(this.path, this.products)
    }

    async addProduct(title, description, price, thumbnail, code, stock, category) {

        this.products = await getJSONFromFile(this.path);
        let product = this.products.some(product => product.code === code);
        if (product) {
            return {
                status: 'Error',
                description: 'There is already a product with the identifier code'
            };
        }

        if (!title || !description || !price || !category || !code || stock === undefined) {
            return {
                status: 'Error',
                description: 'Complete product information is required'
            };
        }

        this.products.push({
            //id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1,
            id: uuidV4(),
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
        return {
            status: 'Success',
            description: 'Product add successfully'
        }
    }

    getProducts() {
        return getJSONFromFile(this.path);
    }

    async getProductsById(id) {
        this.products = await getJSONFromFile(this.path);
        let product = this.products.find(product => product.id === id);
        return product || {
            status: 'Error',
            description: `Product with id: ${id} not found`
        }

    }

    async updateProduct(id, obj) {
        this.products = await getJSONFromFile(this.path);
        let product = this.products.find(product => product.id === id);
        if (!product) {
           return  {
                status: 'Error',
                description: `Product with id: ${id} not found`
            };
        }
        const key = Object.keys(obj);
        let validKey = true;
        let invalidKeys = [];
        key.map((k) => {
            if (k in product) {
                product[k] = obj[k] 
            }else{
                invalidKeys.push(k);
                validKey = false;
            }
        });

        if (validKey) {
            await saveJSONToFile(this.path, this.products);
            return product;
        }else{
            return {
                status: 'Error',
                description: `keys invalids ${invalidKeys}`
            };
        }
       
    }

    async deleteProduct(id) {
        this.products = await getJSONFromFile(this.path);
        if (this.products.length === 0) {
            return {
                status: 'Error',
                description: 'no existen productos para eliminar'
            };
        }
        let product = this.products.find(product => product.id === id);
        if (!product) {

            return {
                status: 'Error',
                description: `Product with id ${id} not found`
            };
        }
        let ind = this.products.indexOf(product);
        this.products.splice(ind, 1);
        await saveJSONToFile(this.path, this.products);
        return {
            status: 'Success',
            description: `Product with id ${id} successfully deleted`
        };
    }

}

 export default ProductManager;


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

