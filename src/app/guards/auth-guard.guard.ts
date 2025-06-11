import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuardGuard: CanActivateFn = (route, state) => {

       let _UserAuthService = inject(AuthService);
        let router = inject(Router);

      if(_UserAuthService.isLoggedIn){
        return true;
      }else{
        router.navigate(['login']);
        return false;
      }
};
