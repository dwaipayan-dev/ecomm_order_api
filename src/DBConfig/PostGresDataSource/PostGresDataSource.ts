import { DataSource } from "typeorm";
import { User } from "../../Authentication/AuthenticationEntities/User/User";

class PostGresDataSource {
  private static appDataSource: DataSource;

  public static getDataSource(): DataSource {
    if (!PostGresDataSource.appDataSource) {
      PostGresDataSource.appDataSource = new DataSource({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: `${process.env.POSTGRES_USER}`,
        password: `${process.env.POSTGRES_PASSWORD}`,
        database: `${process.env.POSTGRES_DB}`,
        entities: [User],
        synchronize: true,
      });
      PostGresDataSource.appDataSource
        .initialize()
        .then(() => {
          console.log("DataSource initialized ...");
        })
        .catch((err: Error) => {
          console.log(err.message);
        });
    }
    return PostGresDataSource.appDataSource;
  }
}

const pgDataSource = PostGresDataSource.getDataSource();
export default pgDataSource;
