import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-junk-buy',
  templateUrl: './junk-buy.component.html',
  styleUrls: ['./junk-buy.component.css']
})
export class JunkBuyComponent implements OnInit {
  viewNum: number = 1;

  constructor(private router:Router) { }

  ngOnInit(): void {}

  setTab(tabname: string) {
    this.router.navigate([`/${tabname}`]);
  }
}
