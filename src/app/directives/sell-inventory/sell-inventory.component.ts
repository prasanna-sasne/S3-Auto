import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import {SellInventoryService} from './../../services/sell-inventiry.service'
@Component({
  selector: 'app-sell-inventory',
  templateUrl: './sell-inventory.component.html',
  styleUrls: ['./sell-inventory.component.css']
})
export class SellInventoryComponent implements OnInit {

  // constructor() { }

  // ngOnInit(): void {
  // }

  customers;

    totalRecords: number;

    cols: any[];

    loading: boolean;

    representatives ;

    constructor(private sellInventoryService: SellInventoryService) { }

    ngOnInit() {
        this.representatives = [
            {name: "Amy Elsner", image: 'amyelsner.png'},
            {name: "Anna Fali", image: 'annafali.png'},
            {name: "Asiya Javayant", image: 'asiyajavayant.png'},
            {name: "Bernardo Dominic", image: 'bernardodominic.png'},
            {name: "Elwin Sharvill", image: 'elwinsharvill.png'},
            {name: "Ioni Bowcher", image: 'ionibowcher.png'},
            {name: "Ivan Magalhaes",image: 'ivanmagalhaes.png'},
            {name: "Onyama Limba", image: 'onyamalimba.png'},
            {name: "Stephen Shaw", image: 'stephenshaw.png'},
            {name: "Xuxue Feng", image: 'xuxuefeng.png'}
        ];

      //  this.loading = true;
    }

    loadCustomers(event: LazyLoadEvent) {
      //  this.loading = true;

        // setTimeout(() => {
        //     this.sellInventoryService.getCustomers({lazyEvent: JSON.stringify(event)}).then(res => {
        //         this.customers = res.customers;
        //         this.totalRecords = res.totalRecords;
        //         this.loading = false;
        //     })
        // }, 1000);
    }

}
