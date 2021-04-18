import { Injectable, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotifyHeaderService {
  //Create one flag to receive events when change happen
  bellFlag = new EventEmitter<boolean>();
  cloaseChatWindow = new EventEmitter<boolean>();
  constructor() { }
}
