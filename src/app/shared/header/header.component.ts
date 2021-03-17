import { Component, OnInit } from '@angular/core';
import {ModalService } from '../../_modal/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoginMode = true;
  email;
  constructor(public modalService:ModalService, private router:Router) { }

  ngOnInit(): void {
    if(window.sessionStorage.getItem('EMAIL') != ""){
      this.email = window.sessionStorage.getItem('EMAIL');
    }
    //  console.log(window.sessionStorage.getItem('EMAIL'));
  }

  onSwitchMode(set){
    this.isLoginMode = set;
  }
  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  logedinUserEmail(el) {
    console.log('email',el);
    this.email = el;
  }

  signOut(){
    sessionStorage.clear();
    //navigate to homepage
    this.ngOnInit();
    this.router.navigate(['welcome']);
  }
}
