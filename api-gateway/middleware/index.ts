import axios from "axios";

export const validateToken = async (req: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new Error("No token provided");
  }
  const token = authHeader.split(" ")[1];
  try{
    const response = await axios.post('http://localhost:3000/v1/user/validate-token', { token });
       req.userId = response.data.message.user.id;
       console.log(response.data.message.user.id,"reposnse")
  }catch{
    throw new Error("Invalid token");
  }
}
