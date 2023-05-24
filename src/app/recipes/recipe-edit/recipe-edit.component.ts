import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeStore} from "../recipe-store.service";
import {Recipe} from "../recipe.model";
import {RecipeBackendService} from "../recipe-backend.service";
import {Ingredient} from "../../shared/ingredient.model";
import {v4 as uuid} from "uuid"


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
              private recipeService: RecipeStore,
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
    let websiteURL = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);
    let recipeInstructions = new FormArray([]);
    let prepTime = '';
    let cookTime = '';
    let totalTime = '';
    let servings = '';

    if (this.editMode) {
      const recipe = this.recipeService.getRecipe(this.id);
      recipeName = recipe.name;
      websiteURL = recipe.websiteURL;
      recipeImagePath = recipe.imagePath;
      recipeDescription = recipe.description;
      prepTime = recipe.prepTime;
      cookTime = recipe.cookTime;
      totalTime = recipe.totalTime;
      servings = recipe.servings;

      if (recipe['ingredients']) {
        for (let ingredient of recipe.ingredients) {
          recipeIngredients.push(
            new FormGroup({
              'name': new FormControl(ingredient.name, Validators.required),
              'amount': new FormControl(ingredient.amount)
            })
          )
        }
      }

      if (recipe['instructions']) {
        for (let instruction of recipe.instructions) {
          //TODO: #14. Shouldn't have to do 'instruction.instruction'.
          recipeInstructions.push(
            new FormGroup({
              'instruction': new FormControl(instruction.instruction, Validators.required)
            })
          )
        }
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'websiteURL': new FormControl(websiteURL),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients,
      'instructions': recipeInstructions,
      'prepTime': new FormControl(prepTime),
      'cookTime': new FormControl(cookTime),
      'totalTime': new FormControl(totalTime),
      'servings': new FormControl(servings)
    });
  }

  onSubmit() {
    //TODO: cannot use recipeForm.value because not all fields are in form (e.g. UUID)... so we lose data doing this.
    if (this.editMode) {
      this.recipeService.updateRecipe(this.id, this.recipeForm.value)
    } else {
      const newRecipe: Recipe = this.recipeForm.value
      newRecipe.uuid = uuid()
      this.recipeService.addRecipe(newRecipe);
    }
    this.onCancel();
  }

  ingredientControl() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls
  }

  instructionControl() {
    return (<FormArray>this.recipeForm.get('instructions')).controls
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null)
      })
    )
  }

  onAddInstruction() {
    (<FormArray>this.recipeForm.get('instructions')).push(
      new FormGroup({
        'instruction': new FormControl(null, Validators.required)
      })
    )
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onDeleteInstruction(index: number) {
    (<FormArray>this.recipeForm.get('instructions')).removeAt(index);
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
          let recipeIngredients = []
          let ingredients = data['http://schema.org/recipeIngredient']

          for (let ingredient of ingredients) {
            recipeIngredients.push(new Ingredient(ingredient, 1))
          }

          let instructions = data['http://schema.org/recipeInstructions']
          let recipeInstructions = [];
          for (let instruction of instructions.values()) {
            recipeInstructions.push(instruction['http://schema.org/text'])
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
            recipeIngredients,
            recipeInstructions);
        },
        error => {
          console.log("ERROR");
          console.log(error);
        },
        () => {
          console.log("COMPLETE:");
          console.log(this.recipeFromURL);

          for (let counter in this.recipeFromURL.ingredients) {
            this.onAddIngredient();
          }

          this.recipeForm.patchValue({
            'name': this.recipeFromURL.name,
            'imagePath': this.recipeFromURL.imagePath,
            'description': this.recipeFromURL.description,
            'prepTime': this.recipeFromURL.prepTime,
            'cookTime': this.recipeFromURL.cookTime,
            'totalTime': this.recipeFromURL.totalTime,
            'servings': this.recipeFromURL.servings,
            'ingredients': this.recipeFromURL.ingredients,
            'instructions': this.recipeFromURL.instructions
          });
        });
  }
}
