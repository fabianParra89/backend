import UserModel from "./models/user.model.js";

export default class UserDaoMongoDB {

    getAll(criteria = {}) {
        return UserModel.find(criteria);
    }

    getByEmail(email) {
        return UserModel.findOne({ email });
    }

    create(data) {
        return UserModel.create(data); 
    }

    updateById(uid, data) {
        return UserModel.updateOne({ _id: uid }, { $set: data });
    }
    
    updateByIdPush(filtro, data) {
        console.debug('update product');
        return UserModel.updateOne(filtro, data);
    }

    deleteById(uid) {
        return UserModel.deleteOne({ _id: uid });
    }

    getByLastConnection(date){
        return UserModel.find({ last_connection: { $lt: date } })
    }

}