import {Ingredient} from "../shared/ingredient.model";

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public websiteURL: string;
  public ingredients: Ingredient[];

  public prepTime: string;
  public cookTime: string;
  public totalTime: string;
  public servings: string;

  constructor(name: string,
              description: string,
              imagePath: string,
              websiteURL: string,
              prepTime: string,
              cookTime: string,
              totalTime: string,
              recipeYield: string,
              ingredients: Ingredient[]) {
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.websiteURL = websiteURL;
    this.prepTime = prepTime;
    this.cookTime = cookTime;
    this.totalTime = totalTime;
    this.servings = recipeYield;
    this.ingredients = ingredients;
  }
}
