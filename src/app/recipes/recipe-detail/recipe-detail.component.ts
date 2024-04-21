import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeStore} from "../recipe-store.service";
import {ActivatedRoute, Router} from "@angular/router";
import {combineLatest} from "rxjs";
import {AuthService} from "../../auth/auth.service";
import {User} from "../../auth/user.model";

declare var $: any

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe
  id: number
  user: User

  constructor(private recipeStore: RecipeStore,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService) {
  }

  ngOnInit(): void {
    combineLatest([this.route.params, this.recipeStore.recipes, this.authService.user]).subscribe(([params, recipes, user]) => {
      this.recipe = recipes[+params['id']]
      this.id = +params['id']
      this.user = user;
      // disabled tooltip because couldn't get it to conditionally render.
      // this.initTooltip();
    })
  }

  private initTooltip() {
    $(document).ready(function () {
      $('[data-toggle="tooltip"]').tooltip();
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

  isNotRecipeOwner(): boolean {
    return this.user.id != this.recipe.createdByUUID
  }
}
