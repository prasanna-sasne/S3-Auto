import { Component, OnInit } from '@angular/core';
import {ModalService } from '../../_modal/modal.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

isLoginMode = true;
email;
  constructor(public modalService:ModalService) { }

  ngOnInit(): void {

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

}
