import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../recipe.service";
import {Recipe} from "../recipe.model";
import {RecipeBackendService} from "../recipe-backend.service";
import {Ingredient} from "../../shared/ingredient.model";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  recipeFromURL: Recipe;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private recipeService: RecipeService,
              private recipeBackendService: RecipeBackendService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeWebsiteURL = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
              ])
            })
          );
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'websiteURL': new FormControl(recipeWebsiteURL),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    });
  }

  onSubmit() {
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.recipeService.addRecipe(this.recipeForm.value);
    }
    this.onCancel();
  }

  controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/)
        ])
      })
    )
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onPopulate1() {
    let populatedRecipe: Recipe;

    this.recipeBackendService.getRecipe(this.recipeForm.get("websiteURL").value).subscribe((result: Recipe) => {
      populatedRecipe = result;
      console.log(populatedRecipe);
    });
  }

  onPopulate() {
    let url = this.recipeForm.get("websiteURL").value;
    this.recipeBackendService.getRecipe(url)
      .subscribe((data: Recipe) => {
          console.log(data);
          let recipeIngredients = [];
          let ingredients = data['http://schema.org/recipeIngredient'];
          for (let ingredient of ingredients) {
            recipeIngredients.push(new Ingredient(ingredient, 1));
          }
          this.recipeFromURL = new Recipe(
            data['http://schema.org/name'],
            data['http://schema.org/description'],
            data['http://schema.org/image']['http://schema.org/url']['@id'],
            data['http://schema.org/mainEntityOfPage']['@id'],
            data['http://schema.org/prepTime'],
            data['http://schema.org/cookTime'],
            data['http://schema.org/totalTime'],
            data['http://schema.org/recipeYield'],
            recipeIngredients);
        },
        error => {
          console.log("ERROR");
          console.log(error);
        },
        () => {
          console.log("COMPLETE:");
          console.log(this.recipeFromURL);

          for(let counter in this.recipeFromURL.ingredients) {
            this.onAddIngredient();
          }

          this.recipeForm.patchValue({
            'name': this.recipeFromURL.name,
            'imagePath': this.recipeFromURL.imagePath,
            'description': this.recipeFromURL.description,
            'ingredients': this.recipeFromURL.ingredients
          });
        });
  }
}
