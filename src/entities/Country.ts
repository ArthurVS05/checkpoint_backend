import { Field, ID, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CountryCodeType } from "../types/types";

// later :
// code continent

@ObjectType()
@Entity()
export class Country extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ length: 2, unique: true }) // Only existing countries can be added
  code!: CountryCodeType; // Countries codes : ISO 3166-1 alpha-2. Ex : FR, BE, AN

  @Field()
  @Column({ length: 100 })
  name!: string;

  @Field()
  @Column({ length: 2 }) // Unicode
  emoji!: string;
}
