const { promises: fs } = require('fs');

class ProductManager {
    constructor(path) {
        this.products = [];
        this.path = path;
        fileSaveInit(this.path, this.products)
    }

    async addProduct(title, description, price, thumbnail, code, stock) {

        this.products = await getJSONFromFile(this.path);
        let product = this.products.some(product => product.code === code);
        if (product) {
            console.log('There is already a product with the identifier code');
            return;
        }

        if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
            console.log('Complete product information is required');
            return;
        }

        this.products.push({
            id: this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1,
            title: title,
            description: description,
            price: price,
            thumbnail: thumbnail,
            code: code,
            stock: stock
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

// Testing
/*
const test = async () => {
    const product1 = new ProductManager('./users.json');
    console.log(await product1.getProducts('./users.json'));
    await product1.addProduct('LIMONADA', 'bebida', 4000, 'https://images.unsplash.com/photo-1507281549113-040fcfef650e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGxpbW9uYWRhfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', 'beb001', 25);
    await product1.addProduct('BOTELLA DE AGUA', 'bebida', 9000, 'https://media.istockphoto.com/id/1306885005/es/foto/peque%C3%B1a-botella-de-agua-en-mano.jpg?s=612x612&w=0&k=20&c=R6TNNUxmg1pZoYLuxZBTv5g_67CcfolpAOQqZ3BRzNk=','ent005', 8);
    await product1.addProduct('COPA DE VINO', 'bebida', 9000, 'https://media.istockphoto.com/id/532009213/es/foto/vino-tinto.jpg?s=612x612&w=0&k=20&c=-CV-PBFZVuFuJ2PLA7xH3BSDnDf-05m-mhbef15jBE0=','ent006', 3);
    await product1.addProduct('PICADA MIXTA', 'rapida', 18000, 'https://media.istockphoto.com/id/960871972/es/foto/surtidos-de-carne-a-la-brasa-deliciosa-y-salchichas-con-verduras-en-la-parrilla.jpg?s=612x612&w=0&k=20&c=3H9BW8tFwVJW8OSVXg0no0F82l7TJuSKqfRgVw9YbHk=', 'rap001', 5);
    await product1.addProduct('HAMBURGUESA SENCILLA', 'rapida', 9000, 'https://plus.unsplash.com/premium_photo-1667682209935-b6c87cced668?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aGFtYnVyZ3Vlc2F8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60','ent007', 9);
    await product1.addProduct('SALCHIPAPA', 'rapida', 9000, 'https://media.istockphoto.com/id/1487083913/es/foto/la-salchipapa-o-salchipapas-es-una-comida-r%C3%A1pida-que-consiste-en-rodajas-fritas-de-salchicha-y.jpg?s=612x612&w=0&k=20&c=YfCSud89z7npVenSWp8q8UT7scUi-HWf1ET5_G3NV8E=', 'ent008',15);
    await product1.addProduct('HOT DOG', 'rapida', 13500, 'https://images.unsplash.com/photo-1541214113241-21578d2d9b62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aG90ZG9nfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60', 'rap002',10);
    await product1.addProduct('BURRITOS', 'rapida', 9000, 'https://images.unsplash.com/photo-1629450748686-c86699b710ac?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YnVycml0b3N8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60','ent004', 5);
    await product1.addProduct('CHINCHULINES', 'entrada', 10000, 'https://images.unsplash.com/photo-1566740933484-fb44d45c7a7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dG90b3Bvc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60','ent003', 20);
    await product1.addProduct('TOTOPOS', 'entrada', 9000, 'https://images.unsplash.com/photo-1566740933484-fb44d45c7a7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dG90b3Bvc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60','ent001', 15);
    
    
    console.log(await product1.getProducts(''));
}


test()
*/
