import {Ingredient} from "../shared/ingredient.model";

export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;
  public websiteURL: string;
  public ingredients: Ingredient[];

  public prepTime: String;
  public cookTime: String;
  public totalTime: String;
  public recipeYield: String;


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
    this.recipeYield = recipeYield;
    this.ingredients = ingredients;
  }
}
