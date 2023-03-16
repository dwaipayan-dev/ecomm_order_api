import { Request, Response, NextFunction } from "express";
import { User } from "../../AuthenticationEntities/User/User";
import jwtService from "../../AuthenticationServices/JWTUtils/JwtUtilsService";
import userDetailsService from "../../AuthenticationServices/UserDetailsService/UserDetailsService";
import excluded from "../../Excluded/Excluded";

class JwtAuthFilter {
  public async doFilter(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const path: string = req.path;
    console.log(path);
    if (excluded.includes(path)) {
      console.log("Auth not required");
      next();
      return;
    }
    console.log("Carrying on...");
    const tokenString: string = req.headers.authorization;
    if (!tokenString || tokenString.substring(0, 6) !== "Bearer") {
      res.status(401).send("Unauthorized!");
      return;
    }
    const token: string = tokenString.substring(7);
    const userId: number = jwtService.getUserIdFromJwt(token);
    const user: User = await userDetailsService.loadUserDetails(userId);
    if (!user) {
      res.status(401).send("Unauthorized!");
      return;
    }
    const isValid: boolean = jwtService.verifyJwt(token, user.id, user.name);
    if (isValid) {
      req.headers.userId = user.id.toString();
      req.headers.userName = user.name;
      next();
      return;
    }
  }
}

const jwtAuthFilter: JwtAuthFilter = new JwtAuthFilter();
export default jwtAuthFilter;
