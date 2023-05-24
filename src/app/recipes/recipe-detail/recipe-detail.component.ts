import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeStore} from "../recipe-store.service";
import {ActivatedRoute, Router} from "@angular/router";
import {combineLatest} from "rxjs";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(private recipeStore: RecipeStore,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    combineLatest([this.route.params, this.recipeStore.recipes]).subscribe(([params, recipes]) => {
      this.recipe = recipes[+params['id']]
      this.id = +params['id']
    })

  }

  onAddToShoppingList() {
    this.recipeStore.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.recipeStore.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }

}
