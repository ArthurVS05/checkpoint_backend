import { GraphQLError } from "graphql";
import { Arg, Query, Resolver } from "type-graphql";
import { Country } from "../entities/Country";
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
}
