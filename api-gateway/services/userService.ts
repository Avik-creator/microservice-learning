import axios from "axios";
const UserService = {
  async getUserById(userId: string) {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  async getAllUsers() {
    try {
      const response = await axios.get(`http://localhost:3000/api/users`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  async getMyProfile() {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/profile`);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  async updateProfile(data: any) {
    try {
      const response = await axios.put(`http://localhost:3000/api/users/profile`, data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  },
  async register(data: any) {
    try {
      const response = await axios.post(`http://localhost:3000/api/users/register`, data);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default UserService;
