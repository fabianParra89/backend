import CartModel from "./models/cart.model.js";


export default class CartDaoMongoDB {


    getAll(criterio = {}, options = {}) {
        return CartModel.paginate(criterio, options);
    }

    getById(cid) {
        return CartModel.findById(cid);
    }

    getProductInCarrito(cid, pid) {
        return CartModel.find({ $and: [{ _id: cid }, { 'products.product': pid }] })
    }

    getByCode(code) {
        return CartModel.findOne({ 'code': code });;
    }

    create(data) {
        return CartModel.create(data);
    }


    updateById(filtro, data) {
        console.log('update product');
        //return CartModel.updateOne({ _id: cid }, { $set: data });
        return CartModel.updateOne(filtro, data);
    }

    deleteById(tid) {
        return CartModel.deleteOne({ _id: tid });
    }
}