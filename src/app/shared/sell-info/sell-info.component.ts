import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
	selector: 'app-sell-info',
	templateUrl: './sell-info.component.html',
	styleUrls: ['./sell-info.component.css']
})
export class SellInfoComponent implements OnInit {
	fragment: any;
	constructor(private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.route.paramMap.subscribe((params: ParamMap) =>{
			this.fragment = params.get('role');
		})
	}

}
