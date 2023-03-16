import { Repository } from "typeorm";
import pgDataSource from "../../DBConfig/PostGresDataSource/PostGresDataSource";
import { User } from "../AuthenticationEntities/User/User";

class UserRepository {
  private userRepository: Repository<User>;
  constructor() {
    this.userRepository = pgDataSource.getRepository(User);
  }

  public getUserRepository(): Repository<User> {
    return this.userRepository;
  }

  public async findById(id: number): Promise<User> {
    try {
      const user: User = await this.userRepository.findOneBy({
        id: id,
      });
      return user;
    } catch (err: any) {
      console.log(`ERROR: User does not exist`);
      return null;
    }
  }

  public async findByEmail(email: string): Promise<User> {
    try {
      const user: User = await this.userRepository.findOneBy({
        email: email,
      });
      return user;
    } catch (err: any) {
      console.log(`ERROR: User does not exist`);
      return null;
    }
  }
}

const userRepository = new UserRepository();
export default userRepository;
