import { DataSource } from "typeorm";
import { User } from "../../Authentication/AuthenticationEntities/User/User";
import { Item } from "../../OrderManagement/Item/Item";
import { Order } from "../../OrderManagement/Order/OrderEntity/Order";
import { Product } from "../../OrderManagement/Product/ProductEntity/Product";

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
        entities: [User, Order, Product, Item],
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
