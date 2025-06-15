import { BehaviorSubject, Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Injectable } from '@angular/core';
import { signIn, signUp } from '../firebaseUrl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  idtoken:string=``;
  email:string=``;
  Uid:string=``;
  private _isLoggedIn = new BehaviorSubject<boolean>(false);

  isLoggedIn$ = this._isLoggedIn.asObservable();

  login() {
    this._isLoggedIn.next(true);
  }

  logout() {
    this._isLoggedIn.next(false);
  }
  get isLoggedIn(): boolean {
    return this._isLoggedIn.value;
  }


  constructor(private  firebaseService: FirebaseService) { }

  signUp(email:string,password:string):Observable<any>{
    return this.firebaseService.postRequest(signUp,{
      email,password,'returnSecureToken':true
    },{ headers: { 'Content-Type': 'application/json' } })
  }
  signIn(email:string,password:string,):Observable<any>{
     return this.firebaseService.postRequest(signIn,{
       email,password,'returnSecureToken':true

     },
      {headers: { 'Content-Type': 'application/json' }})
  }
}
