import jwt, { type JwtPayload } from "jsonwebtoken";

const JWTOptions = {
  algorithm: "HS256" as jwt.Algorithm,
  expiresIn: "12h",
  issuer: "user-microservice",
};

class Service {
  static sign(payload: JwtPayload, userId: string, expiresIn?: string): string {
    const secretKey = (process.env.JWT_SECRET_KEY as string) + userId;

    return jwt.sign(payload, secretKey, {
      ...JWTOptions,
      audience: userId,
      expiresIn: expiresIn || JWTOptions.expiresIn,
    });
  }

  static verify(token: string, userId: string): JwtPayload {
    const secretKey = (process.env.JWT_SECRET_KEY as string) + userId;
    return jwt.verify(token, secretKey, { ...JWTOptions, audience: userId }) as JwtPayload;
  }

  static decode(token: string): JwtPayload {
    const decoded = jwt.decode(token, { complete: true });

    if (decoded?.header?.alg !== JWTOptions.algorithm && decoded?.header.typ !== "JWT") {
      throw new Error("Header mismatch");
    }
    if ((decoded.payload as JwtPayload).iss !== JWTOptions.issuer) {
      throw new Error("Invalid token");
    }

    if ((decoded.payload as JwtPayload).userId !== (decoded.payload as JwtPayload).aud) {
      throw new Error("Audience mismatch");
    }

    return decoded.payload as JwtPayload;
  }
}

export default Service;
