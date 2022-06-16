import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "../recipes/recipe.service";
import {Recipe} from "../recipes/recipe.model";
import {map, tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService) {
  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://recipebook-shoppinglist-5da6f-default-rtdb.firebaseio.com/recipes.json',
      recipes).subscribe(response => {
      console.log(response);
    })
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://recipebook-shoppinglist-5da6f-default-rtdb.firebaseio.com/recipes.json'
      ).pipe(
        map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        }));


  }
}
