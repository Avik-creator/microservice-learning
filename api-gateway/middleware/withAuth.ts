import { validateToken } from "./index";

const withAuth = (resolver) => async (parent, args, context, info) => {
  try{
  await validateToken(context.req);
  return resolver(parent, args, context, info);
}catch{
  console.log("Error: not authenticated");
  throw new Error("Not authenticated");
}
}
