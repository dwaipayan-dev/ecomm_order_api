import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../../../Authentication/AuthenticationEntities/User/User";
import { Item } from "../../Item/Item";
import { OrderStatus } from "./OrderStatus/OrderStatus";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: "orderstatus",
    type: "enum",
    enum: OrderStatus,
  })
  orderStatus: OrderStatus;

  @ManyToMany(() => Item, {
    cascade: true,
  })
  @JoinTable({
    name: "order_items",
    joinColumn: {
      name: "order",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "item",
      referencedColumnName: "id",
    },
  })
  items: Item[];

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
