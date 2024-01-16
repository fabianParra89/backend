import CartModel from "./models/cart.model.js";


export default class CartDaoMongoDB {
    

    static getAll(criterio = {}, options = {}) {
        return CartModel.paginate(criterio, options);
    }

    static getById(cid) {
        return CartModel.findById(cid);
    }

    static getProductInCarrito(cid, pid){
        return CartModel.find({ $and: [{ _id: cid }, { 'products.product': pid }] })
    }

    static getByCode(code) {
        return CartModel.findOne({ 'code': code });;
    }
    
     static create(data) {
        return CartModel.create(data);
    }
    

    static updateById(filtro, data) {
        console.log('update product');
        //return CartModel.updateOne({ _id: cid }, { $set: data });
        return CartModel.updateOne(filtro, data);
    }

    static deleteById(tid) {
        return CartModel.deleteOne({ _id: tid });
    }
}