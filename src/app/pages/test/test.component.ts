import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { SendDataService } from '../../services/send-data.service';
import { fireStoreRestApi, fireStoreRestApiGet } from '../../firebaseUrl';
import { Route, Router } from '@angular/router';
import { GetDataService } from '../../services/get-data.service';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  showErrorAlert = false;
 constructor(private sendData:SendDataService,private authServive:AuthService,private router:Router,private getData:GetDataService){}


//  test(){
//   this.sendData.postRequest(fireStoreRestApi,
//           {
//       "fields": {
//         "name": { "stringValue": "tessssssssssssssst" },
//         "email": { "stringValue": `${this.authServive.email}` }
//       }
//     }
//     ,{ headers: { 'Content-Type': 'application/json',
//       'Authorization': `Bearer ${this.authServive.idtoken}`
//      } }
// ).subscribe(
//   {
//         next: (response) => {
//           console.log('send correctly:', response);

//         },
//         error: (error) => {
//           this.showAlert();
//           this.router.navigate(['login']);
//           console.error('there is an error:', error);

//         }
//       }
// )
//  }


test(){
  this.getData.getRequest(fireStoreRestApiGet.concat(this.authServive.Uid),
    { headers: { 'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authServive.idtoken}`
     } }
).subscribe(
  {
        next: (response) => {
          console.log('send correctly:', response);

        },
        error: (error) => {
          this.showAlert();
          this.router.navigate(['login']);
          console.error('there is an error:', error);

        }
      }
)
 }

 showAlert(){
  this.showErrorAlert = true;
 }
}
