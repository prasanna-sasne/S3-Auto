import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
	selector: 'app-sell-info',
	templateUrl: './sell-info.component.html',
	styleUrls: ['./sell-info.component.css']
})
export class SellInfoComponent implements OnInit {
	fragment: any;
	constructor(private route: ActivatedRoute) { }

	ngOnInit(): void {
		this.route.fragment.subscribe((fragment: string) => {
			this.fragment = fragment;
		});
	}

}
