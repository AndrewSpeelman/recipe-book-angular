import {Ingredient} from "../shared/ingredient.model";

export class Recipe {
  public uuid: string;
  public name: string;
  public description: string;
  public imagePath: string;
  public websiteURL: string;
  public createdBy: string;
  public createdByUUID: string;

  public prepTime: string;
  public cookTime: string;
  public totalTime: string;
  public servings: string;

  public ingredients?: Ingredient[];
  public instructions?: Instruction[];
  //TODO: #14.
  // public instructions: string[];

  constructor(name: string,
              description: string,
              imagePath: string,
              websiteURL: string,
              prepTime: string,
              cookTime: string,
              totalTime: string,
              recipeYield: string,
              ingredients: Ingredient[],
              instructions: Instruction[],
              createdBy: string) {
    // instructions: string[]) {
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.websiteURL = websiteURL;
    this.prepTime = prepTime;
    this.cookTime = cookTime;
    this.totalTime = totalTime;
    this.servings = recipeYield;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.createdBy = createdBy;
  }
}

// TODO: #14 This is the only way we're able to use string interpolation on the instruction... primitive string[] was
//  not working... giving [object Object] when attempting to display.
export class Instruction {

  public instruction: string;

  constructor(instruction: string) {
    this.instruction = instruction;
  }
}
