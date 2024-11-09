import withAuth from "./middleware/withAuth";
import OrderService from "./services/orderService";
import ProductService from "./services/productService";
import { redisClient } from "./services/redisService";
import UserService from "./services/userService";

export const resolvers = {
  Query: {
    users: withAuth(async (_: any, args: any, context: any) => {
      const cacheKey = "users_list";
      try {
        const cachedUsers = await redisClient.get(cacheKey);
        if (cachedUsers) {
          console.log("returning cached users ... ");
          return JSON.parse(cachedUsers);
        }
        const users = await UserService.getAllUsers();
        await redisClient.set(cacheKey, JSON.stringify(users), "EX", 600);
        console.log("users cached ... ");
        return users;
      } catch (err) {
        console.error("Error accessing Redis cache:", err);
        return await UserService.getAllUsers();
      }
    }),
    user: async (_: any, { id }: { id: string }) => {
      return UserService.getUserById(id);
    },
    products: async () => {
      const cacheKey = "product_list";
      try {
        const cachedProducts = await redisClient.get(cacheKey);
        if (cachedProducts) {
          console.log("Returning cached products");
          console.log("in cache");
          return JSON.parse(cachedProducts);
        }
        const products = await ProductService.getAllProducts();
        await redisClient.set(cacheKey, JSON.stringify(products), "EX", 600); // Cache for 10 minutes
        console.log("Products cached");
        return products;
      } catch (err) {
        console.error("Error accessing Redis cache:", err);
        return await ProductService.getAllProducts();
      }
    },
    product: async (_: any, { id }: { id: string }) => {
      return ProductService.getProductDetails(id);
    },
    orders: async (_: any, {id}: {id: string}   ) => {
      const cache_key = "order_list";

      try {
        const cachedOrders = await redisClient.get(cache_key);
        if (cachedOrders) {
          console.log("ORDERS FOUND IN CACHE.. ");
          return JSON.parse(cachedOrders);
        }
        const orders = await OrderService.getOrderById(id);
        await redisClient.set(cache_key, JSON.stringify(orders), "EX", 600);
        return orders;
      } catch (err) {
        console.error("Error accessing Redis cache:", err);
        return await OrderService.getOrderById(id);
      }
    },
    order: async (_: any, { id }: { id: string }) => {
      return OrderService.getOrderById(id);
    },
  },

  Mutation: {
    registerUser: async (_: any, { input }: { input: any }) => {
      return UserService.register(input);
    },
    createProduct: async (_: any, { input }: { input: any }) => {
      await redisClient.del("product_list"); //   <- we are invalidating the redis cache when a new product is created

      return ProductService.createProduct(input);
    },
    placeOrder: withAuth(async (_: any, { input }: { input: any }) => {
      await redisClient.del("order_list");
      return OrderService.createOrder(input);
    }),
    loginUser: async (_: any, { input }: { input: any }) => {
      return UserService.login(input);
    },
  },
};
