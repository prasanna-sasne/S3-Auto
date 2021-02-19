import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buy-list',
  templateUrl: './buy-list.component.html',
  styleUrls: ['./buy-list.component.css']
})
export class BuyListComponent implements OnInit {
  value: number = 40;
  constructor() { }

  ngOnInit(): void {
  }

}
