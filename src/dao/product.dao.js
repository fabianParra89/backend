import ProductModel from "./models/prodcut.model.js";

export default class ProductDaoMongoDB {
    static getAll(criterio = {}, options = {}) {
        return ProductModel.paginate(criterio, options);
    }

    static getById(pid) {
        console.log('getProduct by id');
        // const producto = ProductModel.findById(pid);
        // console.log("producto", producto);
        return ProductModel.findById(pid);
    }

    static getByCode(code) {
        return ProductModel.findOne({ 'code': code });;
    }
    
    static create(data) {
        return ProductModel.create(data); W
    }

    static updateById(pid, data) {
        return ProductModel.updateOne({ _id: pid }, { $set: data });
    }

    static deleteById(tid) {
        return ProductModel.deleteOne({ _id: tid });
    }
}