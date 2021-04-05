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
  openChat: boolean = false; //after showing notifiacation if user clicks on view then only openChat
  //window should get opened
  showBell: boolean = false; //show bell only on notifiacation
  triggerMsg: boolean = false; //call message component only after user logs in

  constructor(public modalService:ModalService, private router:Router,
    private getChildNotification: NotifyHeaderService) {
    this.getChildNotification.bellFlag.subscribe(
      (flag: boolean) => {
        this.showBell = flag});
  }

  ngOnInit(): void {
    if(window.sessionStorage.getItem('EMAIL') != ""){
      this.email = window.sessionStorage.getItem('EMAIL');
    }
    if(this.email !== undefined && this.email !== null){
      this.triggerMsg = true;
    }
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
    if(this.email !== undefined && this.email !== null){
      this.triggerMsg = true;
    }
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
