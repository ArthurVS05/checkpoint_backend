import { IsIn, Length } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CountryCodes } from "../types/types";
import type { CountryCodeType } from "./../types/types";

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

@InputType()
export class CountryCreateInput {
  @Field()
  @IsIn(Object.values(CountryCodes), {
    message: "Code should be one of the valid country codes",
  })
  code!: CountryCodeType; // Check if code country is valid

  @Field()
  @Length(2, 100, { message: "Name must be between 2 and 100 characters" })
  name!: string;

  @Field()
  @Length(2, 2, { message: "Emoji must be exactly 2 characters" })
  emoji!: string;
}
