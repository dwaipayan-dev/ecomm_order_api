import { User } from "../../AuthenticationEntities/User/User";
import userRepository from "../../AuthenticationRepository/UserRepository";

class UserDetailsService {
  public async loadUserDetails(id: number): Promise<User> {
    try {
      const user: User = await userRepository.findById(id);
      return user;
    } catch (error) {
      return null;
    }
  }

  public async addUser(
    userName: string,
    userEmail: string,
    userPasswordHash: string
  ): Promise<boolean> {
    const user: User = new User();
    user.name = userName;
    user.email = userEmail;
    user.passwordHash = userPasswordHash;
    console.log(user);
    try {
      await userRepository.getUserRepository().save(user);
      return true;
    } catch (error) {
      console.log("ERROR: User could not be persisted due to" + `${error}`);
      return false;
    }
  }
}

const userDetailsService: UserDetailsService = new UserDetailsService();
export default userDetailsService;
