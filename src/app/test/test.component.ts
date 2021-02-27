import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";

/* Use only for testing */
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  countries: any[];
  selectedCountry: { name: string, code: string } = {name:"", code:""};

  constructor(public fb: FormBuilder) { 
      this.countries = [
      { name: "Australia", code: "AU" },
      { name: "Brazil", code: "BR" },
      { name: "China", code: "CN" },
      { name: "Egypt", code: "EG" },
      { name: "France", code: "FR" },
      { name: "Germany", code: "DE" },
      { name: "India", code: "IN" },
      { name: "Japan", code: "JP" },
      { name: "Spain", code: "ES" },
      { name: "United States", code: "US" }
    ];
  }
  ngOnInit(): void {}

  onChange(event: any) {
    if(event.value !== null)
        console.log(event.value.name);
  }

}   
