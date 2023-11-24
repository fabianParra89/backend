import MessageModel from '../models/message.model.js';


export default class MessageManager {
    static async addMessage(newMessage) {
         const messageCreate = await MessageModel.create(newMessage);
        console.log(`Messages is created successfully (${messageCreate._id}) 😁.`);
        return messageCreate;
    }

    static async getConversation(){
        const conversation =  MessageModel.find();
        // console.log(conversation);
        return conversation;
    }
    
}