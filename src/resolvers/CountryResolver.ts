import { validate } from "class-validator";
import { GraphQLError } from "graphql";
import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Continent } from "../entities/Continent";
import { Country, CountryCreateInput } from "../entities/Country";
import { CountryCodes, CountryCodeType } from "./../types/types";

@Resolver()
export class CountryResolver {
  // Get all countries
  @Query(() => [Country], { nullable: true })
  async countries(): Promise<Country[] | null> {
    const countries = await Country.find({ relations: ["continent"] });
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
      relations: ["continent"],
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
    // Check if continent exists
    const continent = await Continent.findOne({
      where: {
        id: data.continentId,
      },
    });
    if (!continent) {
      throw new GraphQLError("Continent not found", {
        extensions: {
          field: "continentId",
          message: "The specified continent does not exist",
        },
      });
    }

    // Create an instance of Country
    const country = new Country();

    // Fill country with input data
    Object.assign(country, data);

    // Assign continent object
    country.continent = continent;

    // Save new country in database
    await country.save();
    return country;
  }

  @Mutation(() => String)
  async deleteCountry(@Arg("id", () => ID) id: number): Promise<String> {
    try {
      const countryToDelete = await Country.findOneBy({ id });
      if (!countryToDelete) {
        throw new GraphQLError("Country not found");
      }
      await countryToDelete.remove();
      return "country deleted";
    } catch (error) {
      throw error;
    }
  }
}
