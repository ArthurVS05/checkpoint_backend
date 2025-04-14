import { Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Country } from "./Country";

@ObjectType()
@Entity()
export class Continent extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ length: 100, unique: true })
  name!: string;

  @OneToMany(() => Country, (country) => country.continent, { eager: true })
  countries!: Country[];
}

@InputType()
export class ContinentCreateInput {
  @Field()
  @Length(2, 100, { message: "Name must be between 2 and 100 characters" })
  name!: string;
}
