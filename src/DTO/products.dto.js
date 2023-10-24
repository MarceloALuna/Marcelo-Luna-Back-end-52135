export default class productDTO {
    constructor(product) {
      this.name = product.name;
      this.description = product.descripcion;
      this.code = product.code;
      this.price = product.price;
      this.stock = product.stock;
      this.image = product.image;
      this._id = product._id;
    }
  }