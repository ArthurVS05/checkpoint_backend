import { validate } from "class-validator";
import { GraphQLError } from "graphql";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { Country, CountryCreateInput } from "../entities/Country";
import { CountryCodes, CountryCodeType } from "./../types/types";

@Resolver()
export class CountryResolver {
  // Get all countries
  @Query(() => [Country], { nullable: true })
  async countries(): Promise<Country[] | null> {
    const countries = await Country.find();
    if (!countries) {
      throw new GraphQLError("Error to get countries");
    }
    return countries;
  }

  // Get a country by id
  @Query(() => Country, { nullable: true })
  async country(
    @Arg("code", () => CountryCodes) code: CountryCodeType
  ): Promise<Country | null> {
    const country = await Country.findOne({
      where: {
        code,
      },
    });
    if (!country) {
      throw new GraphQLError("Country not found");
    }
    return country;
  }

  @Mutation(() => Country)
  async createCountry(@Arg("data") data: CountryCreateInput): Promise<Country> {
    // Verify data format before creating country
    const errors = await validate(data);
    if (errors.length > 0) {
      throw new GraphQLError("Validation failed", {
        extensions: {
          errors: errors.map((err) => ({
            field: err.property,
            constraints: err.constraints,
          })),
        },
      });
    }

    // Create an instance of Country
    const country = new Country();

    // Fill country with input data
    Object.assign(country, data);

    // Save new country in database
    await country.save();
    return country;
  }
}
