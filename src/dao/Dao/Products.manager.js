import ProductModel from '../models/prodcut.model.js';

export default class ProductsManager {
    static get() {
      return ProductModel.find();
    }
    // static async getById(sid) {
    //   const student = await ProductModel.findById(sid);
    //   if (!student) {
    //     throw new Error('Estudiantes no encontrado.');
    //   }
    //   return student;
    // }
    static async create(data) {
      const prodcut = await ProductModel.create(data);
      console.log(`Producto creado correctamente (${prodcut._id}) 😁.`);
      return prodcut;
    }
  
    // static async updateById(sid, data) {
    //   await ProductModel.updateOne({ _id: sid }, { $set: data });
    //   console.log(`Estudiante actualizado correctamente (${sid}) 😁.`);
    // }
  
    // static async deleteById(sid) {
    //   await ProductModel.deleteOne({ _id: sid });
    //   console.log(`Estudiante eliminado correctamente (${sid}) 🤔.`);
    // }
  
  }
  