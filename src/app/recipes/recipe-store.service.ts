import {Recipe} from "./recipe.model";
import {Injectable, OnDestroy} from "@angular/core";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {DataStorageService} from "../shared/data-storage.service";
import {take} from "rxjs/operators";

@Injectable()
export class RecipeStore implements OnDestroy {

  private recipeSubscription$: Subscription
  private recipes$ = new BehaviorSubject<Recipe[]>([])

  constructor(private shoppingListService: ShoppingListService,
              private dataStorageService: DataStorageService) {
    this.initialize()
  }

  get recipes(): Observable<Recipe[]> {
    return this.recipes$.asObservable()
  }

  ngOnDestroy() {
    this.recipeSubscription$.unsubscribe()
  }

  private initialize() {
    this.recipeSubscription$ = this.dataStorageService.fetchAllRecipes().subscribe((allRecipes: Recipe[]) => {
      console.log('recipe store initialized!', allRecipes)
      this.recipes$.next(allRecipes)
    }, (error) => {
      console.log(error)
    })
  }

  getRecipe(index: number): Recipe {
    console.log('fetching recipes from recipe-service:', this.recipes$.getValue())
    return this.recipes$.getValue()[index]
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients)
  }

  addRecipe(newRecipe: Recipe): Observable<Recipe> {
    let obs = this.dataStorageService.addRecipe(newRecipe)
    obs.subscribe(result => {
      let temp = this.recipes$.getValue();
      temp.push(newRecipe)
      this.recipes$.next(temp.slice())
    })
    return obs
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    console.log('update-recipe...newRecipe', newRecipe)
    let recipeStoreContents: Recipe[] = this.recipes$.getValue()
    let recipeFromStore: Recipe = recipeStoreContents[index]
    Object.keys(recipeFromStore).forEach(key => {
      if (newRecipe[key] !== undefined) recipeFromStore[key] = newRecipe[key]
    })
    console.log('----------------------------')
    console.log('ingredients', newRecipe.ingredients)
    console.log('instructions', newRecipe.instructions)
    console.log('----------------------------')
    recipeFromStore.ingredients = newRecipe.ingredients
    recipeFromStore.instructions = newRecipe.instructions
    recipeStoreContents[index] = recipeFromStore
    console.log('update-recipe...recipeFromStore', recipeFromStore)


    this.dataStorageService.updateRecipe(recipeFromStore).subscribe(res => {
      this.recipes$.next(recipeStoreContents.slice());
    })

  }

  deleteRecipe(index: number) {
    let recipeToDelete: Recipe = this.getRecipe(index)
    this.dataStorageService.deleteRecipe(recipeToDelete).pipe(take(1)).subscribe(res => {
      const currentList = this.recipes$.value.slice()
      currentList.splice(index, 1)
      this.recipes$.next(currentList)
    })
  }
}

//TODO: need to add a redirect if recipe no longer exists (/recipes/1, when recipe #1 no longer exists)
