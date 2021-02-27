import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum Role {
  ADMIN = "admin",
  USER = "user"
}

@Entity()
export class Users {

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    unique: true
  })
  username: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  password: string;

  @Column({
    type: 'date',
    nullable: true
  })
  date_of_birth: Date;

  @Column({
    unique: true
  })
  email: string;

  @Column()
  is_active: boolean;

  @Column({
    type: "enum",
    enum: Role,
    default: Role.USER
  })
  user_role: Role;

}
