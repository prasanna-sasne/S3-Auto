export class BuyItems{
	constructor(
			public imageUri: string, public price: number, public make: string, 
			public model: string, public year: number, public sellDate: string,
			public city: string, public state: string, public userId: number,
			public vehId: number, public part: string, public junkyardId: number,
			public partId: number, public rating: number
		){}
}