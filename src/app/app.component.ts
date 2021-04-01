import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'S3Auto';
  flagresetForm = false;
  url = new URL(window.location.href);

  constructor(private router:Router) {}

  ngOnInit(): void {
  //  this.router.navigate(['welcome']);
    this.flagresetForm = false;
    if(this.url.searchParams.get('token') !== null || undefined){
        console.log(this.url.searchParams.get('token'));
        this.flagresetForm = true;
        this.router.navigate(['/resetPassword/reset']);
      }
  }

}
