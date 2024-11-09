import axios from "axios";

const OrderService = {
  // router.post("/create-order", createOrderController);
  // router.get("/get-order/:id", getOrderController);
  // router.post("/update-order-status/:id", updateOrderController);


  async getOrderById(id: string) {
    const response = await axios.get(`http://localhost:4000/v1/orders/get-order/${id}`)
    return response.data;
  },

  async updateOrderStatus(id: string) {
    const response = await axios.post(`http://localhost:4000/v1/orders/update-order-status/${id}`, { status: "COMPLETED" })
    return response.data;
  },

  async createOrder(order: any) {
    const response = await axios.post(`http://localhost:4000/v1/orders/create-order`, order)
    return response.data;
  }
}

export default OrderService;
