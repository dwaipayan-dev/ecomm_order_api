import jwt from "jsonwebtoken";

interface JwtBody {
  userId: number;
  userName: string;
}

class JwtUtilsService {
  public createJwt(userId: number, userName: string): string {
    const body: JwtBody = {
      userId,
      userName,
    };
    const token: string = jwt.sign(body, process.env.JWT_SECRET, {
      expiresIn: "10 days",
    });
    return token;
  }

  public getUserIdFromJwt(token: string): number {
    const decodedObj = jwt.decode(token) as JwtBody;
    return decodedObj.userId;
  }

  public verifyJwt(token: string, userId: number, userName: string): boolean {
    try {
      const decodedObj = jwt.verify(token, process.env.JWT_SECRET);
      const decodedBody = decodedObj as JwtBody;
      if (decodedBody.userId === userId && decodedBody.userName === userName)
        return true;
      return false;
    } catch (error: any) {
      console.log("Invalid/Expired token");
      return false;
    }
  }
}

const jwtService = new JwtUtilsService();
export default jwtService;
