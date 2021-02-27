import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Wishlist } from "./Wishlist";

@Entity()
export class Item {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  link: string;

  @Column()
  description: string;

  @Column({
    type: 'date'
  })
  date_added: Date;

  @ManyToOne(() => Wishlist, wishlist => wishlist.id)
  wishlist: Wishlist
}
