import { validate } from "class-validator";
import { GraphQLError } from "graphql";
import { Arg, ID, Mutation, Query, Resolver } from "type-graphql";
import { Continent, ContinentCreateInput } from "../entities/Continent";

@Resolver()
export class ContinentResolver {
  // Get all continents
  @Query(() => [Continent], { nullable: true })
  async continents(): Promise<Continent[] | null> {
    const continents = await Continent.find();
    if (!continents) {
      throw new GraphQLError("Error to get continents");
    }
    return continents;
  }

  @Mutation(() => Continent)
  async createContinent(
    @Arg("data") data: ContinentCreateInput
  ): Promise<Continent> {
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

    // Create an instance of Continent
    const continent = new Continent();

    // Fill continent with input data
    Object.assign(continent, data);

    // Save new continent in database
    await continent.save();
    return continent;
  }

  // Get a continent and its countries
  @Query(() => Continent, { nullable: true })
  async continentWithCountries(
    @Arg("id", () => ID) id: number
  ): Promise<Continent | null> {
    const continent = await Continent.findOne({
      where: { id },
      relations: ["countries"],
    });

    if (!continent) {
      throw new Error("Continent not found");
    }

    return continent;
  }
}
