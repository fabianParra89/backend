import ProductModel from "./models/prodcut.model.js";

export default class ProductDaoMongoDB {
    getAll(criterio = {}, options = {}) {
        return ProductModel.paginate(criterio, options);
    }

    getById(pid) {
        return ProductModel.findById(pid);
    }

    getByCode(code) {
        return ProductModel.findOne({ 'code': code });;
    }

    create(data) {
        return ProductModel.create(data); W
    }

    updateById(pid, data) {
        return ProductModel.updateOne({ _id: pid }, { $set: data });
    }

    deleteById(tid) {
        return ProductModel.deleteOne({ _id: tid });
    }
}