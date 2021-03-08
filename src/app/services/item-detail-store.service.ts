import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

// @Injectable({ providedIn: 'root'})
// export class ItemDetailStoreService {
// 	private readonly _itemsList = new BehaviorSubject<any[]>([]);

// 	// Expose the observable$ part of the _itemsList subject (read only stream)
// 	readonly todos$ = this._itemsList.asObservable();

// 	// the getter will return the last value emitted in _itemsList subject
// 	get items(): any[] {
// 		return this._itemsList.getValue();
// 	}

// 	 addTodo(title: string) {
//     // we assaign a new copy of todos by adding a new todo to it 
//     // with automatically assigned ID ( don't do this at home, use uuid() )
//     this.items = [
//       ...this.todos, 
//       {id: this.todos.length + 1, title, isCompleted: false}
//     ];
//   }
// }

//https://dev.to/avatsaev/simple-state-management-in-angular-with-only-services-and-rxjs-41p8