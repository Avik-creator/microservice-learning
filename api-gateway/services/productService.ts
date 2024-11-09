import axios from "axios";

const ProductService = {
  async getAllProducts() {
    const response = await axios.get("http://localhost:6000/get-all-products");
    return response.data;
  },

  async getProductDetails(id: string) {
    const response = await axios.get(`http://localhost:6000/get-product/${id}`);
    return response.data;
  }

  async createProduct(product: any) {
    const response = await axios.post("http://localhost:6000/create-product", product);
    return response.data;
  },

  async updateProduct(id: string, product: any) {
    const response = await axios.patch(`http://localhost:6000/update-product/${id}`, product);
    return response.data;
  },

  async deleteProduct(id: string) {
    const response = await axios.delete(`http://localhost:6000/delete-product/${id}`);
    return response.data;
  }
}

export default ProductService;
