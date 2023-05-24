export class User {
  constructor(private email: string,
              private _id: string,
              private _token: string,
              private _tokenExpirationDate: Date) {

  }

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get id() {
    return this._id
  }
}
