import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../recipe.model";
import {RecipeStore} from "../recipe-store.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Subscription} from "rxjs";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  subscription: Subscription;
  searchControl = new FormControl('');

  constructor(private recipeService: RecipeStore,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.subscription = this.recipeService.recipes.subscribe(
      (recipes: Recipe[]) => {
        console.log('recipe-list fetched:')
        console.log(recipes)
        this.recipes = recipes;
        this.filteredRecipes = recipes;
      }
    );

    this.searchControl.valueChanges.subscribe((searchText: string) => {
      this.filteredRecipes = [...this.recipes].filter((recipeCard) => {
        return recipeCard.name.toLowerCase().includes(searchText.toLowerCase())
      })
    })
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
