import { Injectable, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotifyHeaderService {
  bellFlag = new EventEmitter<boolean>();
  cloaseChatWindow = new EventEmitter<boolean>();
  constructor() { }
}
