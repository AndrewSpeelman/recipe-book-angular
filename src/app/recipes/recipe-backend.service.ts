import {Injectable} from '@angular/core';
import {HttpBackend, HttpClient, HttpParams} from "@angular/common/http";
import {Recipe} from "./recipe.model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecipeBackendService {

  private httpClient: HttpClient;

  constructor(private handler: HttpBackend) {
    this.httpClient = new HttpClient(handler);
  }

  public getRecipe(websiteURL: string): Observable<Recipe> {
    let endpoint = `api/`;
    let params = new HttpParams().set("url", websiteURL);

    return this.httpClient.get<Recipe>(endpoint, {params: params});
  }
}
