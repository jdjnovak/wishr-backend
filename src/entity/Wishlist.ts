import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Unique } from "typeorm";
import { Users } from "./Users";
import { Item } from "./Item";

@Entity()
@Unique(['owner', 'name'])
export class Wishlist {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'date'
  })
  date_created: Date;

  @Column({
    type: 'date'
  })
  last_updated: Date;

  @ManyToOne(() => Users, user => user.id)
  owner: Users;

  @OneToMany(() => Item, item => item.id)
  items: Item[];

}
