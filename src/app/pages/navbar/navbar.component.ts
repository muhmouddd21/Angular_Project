import { CommonModule } from '@angular/common';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent  {

  islogged: boolean = false;
  constructor(private authService: AuthService,private router:Router) {}


  ngOnInit() {
    this.authService.isLoggedIn$.subscribe(
      (status) => (this.islogged = status)
    );
  }
  logOut(){
    this.authService.logout();
    this.authService.idtoken=``;
    this.router.navigate(['login'])
  }
  navigate(){
    const idOfUser:string =this.authService.Uid;
    console.log(idOfUser);
    console.log(this.authService.Uid);


    this.router.navigate([`/user`,idOfUser])
  }
}
