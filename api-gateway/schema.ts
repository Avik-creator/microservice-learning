import { ggl } from "apollo-server";

export const typeDefs = ggl`

  type User{
    id: ID!
    name: String!
    email: String!
  }

  type Product{
    id: ID!
    name: String!
    price: Float!
    stock: Int!
    description: String!
  }

  type Order{
    id: ID!
    userId: ID!
    items: [OrderItem!]
    total: Float!
    status: String!
    shippingAddress: String!
    pincode: String!
    city: String!
    country: String!
    phoneNumber: String!
  }

  type OrderItem{
    id: ID!
    productId: ID!
    quantity: Int!
    price: Float!
  }

  # Queries for Getting the Data
  type Query{
  users: [User!]
  user(id: ID!): User
  products: [Product!]
  product(id: ID!): Product
  orders: [Order!]
  order(id: ID!): Order
  }

  type RegisterInput{
    name: String!
    email: String!
    password: String!
  }

  type LoginInput{
    email: String!
    password: String!
  }

  type ProductInput{
    name: String!
    price: Float!
    stock: Int!
    description: String!
  }

  type OrderInput{
  userId: ID!
  items: [OrderItemInput!]
  }

  type OrderItemInput{
    productId: ID!
    quantity: Int!
  }

  type AuthTokens{
    accessToken: String!
    refreshToken: String!
  }

  # Mutations for Creating, Updating and Deleting the Data

  type Mutation{
    register(input: RegisterInput!): User
    login(input: LoginInput!): AuthTokens
    createProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput!): Product
    deleteProduct(id: ID!): Product
    placeOrder(input: OrderInput!): Order
    updateOrder(id: ID!, status: String!): Order
    deleteOrder(id: ID!): Order

    }








  `;
