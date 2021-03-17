import { Component, OnInit } from '@angular/core';

interface Action {
  name: string;
}
@Component({
  selector: 'sell-inventory',
  templateUrl: './sell-inventory.component.html',
  styleUrls: ['./sell-inventory.component.css']
})

export class SellInventoryComponent implements OnInit {
  products: any[];
  cols: any[];
  actions: Action[];
  images: any[];
  //selectedimage: Image;
  selectedaction: Action;
  constructor() {
    this.actions = [
      {name: 'Edit'},
      {name: 'Sold'},
      {name: 'Duplicate'}
    ];
   /* this.images=./assets/salvage1.png;*/
  }

  ngOnInit() {
    this.products = [
      { imageUrl: './assets/salvage1.png', partname: 'Head Lights ',make:'Nissan',model:'Altima',year:'2016', description: 'Describing about the part deatils ' },
      { imageUrl: './assets/salvage1.png', partname: 'AC compressor',make:'Honda',model:'Accord',year:'2002', description:'Describing about the part deatils' },
      { imageUrl: './assets/salvage1.png', partname: 'Side Door ',make:'Infinity',model:'QX60',year:'2015', description:'Describing about the part deatils ' },
      { imageUrl: './assets/salvage1.png', partname: 'Engine ',make:'Nissan',model:'Altima',year:'2017', description:'Describing about the part deatils ' },

    ];
    this.cols = [
      // { field: 'imageUrl', header: 'Image' },
      { field: 'partname', header: 'Part Name' },
      { field: 'make', header: 'Make' },
      { field: 'model', header: 'Model' },
      { field: 'year', header: 'Year' },
      { field: 'description', header: 'Description' },
      // { field: 'action', header: 'Action' },

    ];
  }

}
