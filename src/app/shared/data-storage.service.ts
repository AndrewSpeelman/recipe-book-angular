import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Recipe} from "../recipes/recipe.model";
import {catchError, exhaustMap, map, take} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";
import {Observable, throwError} from "rxjs";

export interface UserNode {
  [userId: string]: RecipeList[]
}

export interface RecipeList {
  [recipeUUID: string]: Recipe
}

@Injectable({providedIn: 'root'})
export class DataStorageService {

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  fetchAllRecipes(): Observable<Recipe[]> {
    //TODO: This doesn't seem like the best way to do this...
    let recipes: Recipe[] = []
    return this.http
      .get<UserNode[]>(
        'https://recipebook-shoppinglist-5da6f-default-rtdb.firebaseio.com/recipes2.json'
      ).pipe(
        map((userNode: UserNode[]) => {
          Object.keys(userNode).forEach((userUuid) => {
            const userObject = userNode[userUuid]
            Object.keys(userObject).forEach((recipeKey) => {
              const recipe = userObject[recipeKey]
              recipes.push(recipe)
            })
          })
          return recipes
        })
      )
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    //TODO probably not need user here anymore...
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.put<Recipe>('https://recipebook-shoppinglist-5da6f-default-rtdb.firebaseio.com/recipes2/' + recipe.createdByUUID + '/' + recipe.uuid + '.json', recipe)
      })
    )
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    //TODO probably not need user here anymore...
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.put<Recipe>('https://recipebook-shoppinglist-5da6f-default-rtdb.firebaseio.com/recipes2/' + recipe.createdByUUID + '/' + recipe.uuid + '.json', recipe)
      }))
  }

  deleteRecipe(recipe: Recipe): Observable<Recipe> {
    //TODO probably not need user here anymore...
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        return this.http.delete<Recipe>('https://recipebook-shoppinglist-5da6f-default-rtdb.firebaseio.com/recipes2/' + recipe.createdByUUID + '/' + recipe.uuid + '.json').pipe(
          catchError(this.handleError)
        )
      })
    )
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error);
    return throwError(error);
  }
}
