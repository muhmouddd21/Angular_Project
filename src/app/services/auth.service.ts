import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Injectable } from '@angular/core';
import { signUp } from '../firebaseUrl';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private  firebaseService: FirebaseService) { }

  signUp(email:string,password:string,):Observable<any>{
    return this.firebaseService.postRequest(signUp,{
      email,password,'returnSecureToken':true
    },{ headers: { 'Content-Type': 'application/json' } })
  }
}
