import ProductModel from '../models/prodcut.model.js';

export default class ProductsManager {
    static async get(criterio, options) {
        return await ProductModel.paginate(criterio, options);
    }

    static async getById(id) {
        try {
            const product = await ProductModel.findById(id);
            console.log(product);
            if (product) {
                return {
                    product: product,
                    message: "Product found",
                    status: "Success",
                    statusCode: 200
                };
            } else {
                return {
                    message: "Product not Found",
                    status: "Error",
                    statusCode: 404
                };
            }
        } catch (error) {
            console.log(error.message);
            return {
                message: "Error when searching for the product",
                status: "Error",
                statusCode: 400
            };
        }
    }

    static async create(data) {
        try {
            const { code } = data;
            const productByCode = await ProductModel.findOne({ 'code': code });
            console.log(productByCode);

            if (productByCode) {
                return {
                    description: "There is already a product with the identifier code",
                    status: "Error",
                    statusCode: 400
                };
            } else {
                const product = await ProductModel.create(data);
                console.log(`Product is created successfully (${product._id}) 😁.`);
                return {
                    product: { product },
                    message: "Product is created successfully",
                    status: "Success",
                    statusCode: 200
                };
            }

        } catch (error) {
            return {
                message: error.message,
                status: "Error",
                statusCode: 400
            };
        }

    }

    static async updateById(pid, data) {
        try {
            const product = await ProductModel.findById(pid);
            if (!product) {
                return {
                    message: "Product not Found by update",
                    status: "Error",
                    statusCode: 404
                };
            }
            const productUpdated = await ProductModel.updateOne({ _id: pid }, { $set: data });
            console.log(productUpdated);
            console.log(`Product successfully updated (${pid}) 😁.`);
            return {
                message: "Product successfully updated",
                status: "Success",
                statusCode: 202
            };
        } catch (error) {
            return {
                message: error.message,
                status: "Error",
                statusCode: 400
            };
        }
    }

    static async deleteById(pid) {
        try {
            const product = await ProductModel.findById(pid);
            if (!product) {
                return {
                    message: "Product not Found by delete",
                    status: "Error",
                    statusCode: 404
                };
            }
            await ProductModel.deleteOne({ _id: pid });
            console.log(`Estudiante eliminado correctamente (${pid}) 🤔.`);
            return {
                message: "Product successfully deleteded",
                status: "Success",
                statusCode: 200
            };
        } catch (error) {
            return {
                message: error.message,
                status: "Error",
                statusCode: 400
            };
        }
    }
}
