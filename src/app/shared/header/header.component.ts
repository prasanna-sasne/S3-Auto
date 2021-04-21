import { Component, OnInit } from '@angular/core';
import {ModalService } from '../../_modal/modal.service';
import { Router } from '@angular/router';
import { NotifyHeaderService } from '../../services/notify-header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isLoginMode = true;
  email;
  //after showing notifiacation if user clicks on view then only openChat
  //window should get opened
  openChat: boolean = false; 
  showBell: boolean = false; //show bell only on notifiacation
  triggerMsg: boolean = false; //call message component only after user logs in
  
  roleflag: boolean = false;  
  role;

  constructor(public modalService:ModalService, private router:Router,
    private getChildNotification: NotifyHeaderService) {
    //Receive an event when there is a change
    this.getChildNotification.bellFlag.subscribe(
      (flag: boolean) => {
        this.showBell = flag});
  }

  ngOnInit(): void {
    if(window.sessionStorage.getItem('EMAIL') != ""){
      this.email = window.sessionStorage.getItem('USERNAME');
    }
    if(this.email !== undefined && this.email !== null){
      this.triggerMsg = true;
    }
    this.showContactUs();  
  }

  showContactUs(){  
    this.role = JSON.parse(sessionStorage.getItem('ROLE') || '{}');  
    if(this.role !== undefined && this.role !== null && JSON.stringify(this.role) !== '{}'){  
      if(this.role.localeCompare("ADMIN") !== 0) this.roleflag = true;  
    } else {  
      this.roleflag = false;  
    }  
  }

  onSwitchMode(set){
    this.isLoginMode = set;
  }
  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.isLoginMode = true;

    this.modalService.close(id);
  }

  successRegister(event) {
    this.isLoginMode = true;
  }

  logedinUserEmail(el) {
    this.email = el;
    if(this.email !== undefined && this.email !== null){
      this.triggerMsg = true;
    }
    this.role = JSON.parse(sessionStorage.getItem('ROLE') || '{}');  
    this.showContactUs();  
  }
  
  loggedInUserRole(role){  
    this.role = role;  
  }

  closeNav(closeChatWindow: {closeNav:boolean}){
    this.openChat = closeChatWindow.closeNav;
  }

  newMsgPresent(showBell: {notificationPresent: boolean}){
    this.showBell = showBell.notificationPresent;
  }

  checkNotification(){
    this.openChat = true;
  }

  signOut(){
    sessionStorage.clear();
    this.ngOnInit();
    
    //close chat window when chat is opened from header
    this.getChildNotification.cloaseChatWindow.emit(false);
    this.router.navigate(['welcome']); //Navigate to welcome page
  }

  updateProfile(){
    this.router.navigate(['updateProfile']);
  }
}
