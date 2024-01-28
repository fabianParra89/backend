import ticketModel from "./models/ticket.model.js";

export default class TicketDaoMongoDB {

    // getAll(criteria = {}) {
    //     return UserModel.find(criteria);
    // }

    // getByEmail(email) {
    //     return UserModel.findOne({ email });
    // }

    create(data) {
        return ticketModel.create(data); 
    }

    // updateById(uid, data) {
    //     return UserModel.updateOne({ _id: uid }, { $set: data });
    // }
    
    // updateByIdPush(filtro, data) {
    //     console.log('update product');
    //     //return CartModel.updateOne({ _id: cid }, { $set: data });
    //     return UserModel.updateOne(filtro, data);
    // }

    // deleteById(uid) {
    //     return UserModel.deleteOne({ _id: uid });
    // }

}