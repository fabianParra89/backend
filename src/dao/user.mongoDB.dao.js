import UserModel from "./models/user.model.js";

export default class UserDaoMongoDB {

    getAll(criteria = {}) {
        return UserModel.find(criteria);
    }

    getByEmail(email) {
        return UserModel.findOne({ email });
    }

    create(data) {
        return UserModel.create(data); W
    }

    updateById(uid, data) {
        return UserModel.updateOne({ _id: uid }, { $set: data });
    }

    deleteById(uid) {
        return UserModel.deleteOne({ _id: uid });
    }

}