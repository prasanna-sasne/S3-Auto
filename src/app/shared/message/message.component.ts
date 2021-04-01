import {Component, OnInit, 
	    EventEmitter, Output, 
	    Input, ViewChild, ElementRef,
		AfterViewChecked } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {ChatMessageService} from '../../services/chat-message.service';

@Component({
	selector: 'app-message',
	templateUrl: './message.component.html',
	styleUrls: ['./message.component.css'],
	providers: [ChatMessageService]
})
export class MessageComponent implements OnInit, AfterViewChecked{
	//Emit the flag to parent component by sending alert
	@Output() closeNavFlag = new EventEmitter<{closeNav: boolean}>();

	//Property binding from parent componant 
	@Input('name') toUserName: string;
	@ViewChild('divToScroll') private divToScroll: ElementRef;

	public sideNavClicked : boolean = true;
	public username: any;
	public message: string="";
	public chatMessage: any;
	private webSocketEndPoint: any;
	private topic: any;
	private stompClient: any;
	private token: any;
	public messageFrom: string;
	public messageTo: string;
	public chatArray: {from: string, to: string, msg: string, ts: number, read: boolean}[] = [];
	
	public conversations: {chatId: number, msg: {to: string, msg: string, from: string, 
		ts:number, read: boolean}[],
	read: boolean, receiver: string, sender: string, notification: number}[] = []

	public constructor(private chatService: ChatMessageService) {
		this.token = sessionStorage.getItem('TOKEN');
		this.username = sessionStorage.getItem('USERNAME');
		console.log(this.toUserName);
	}

	public ngOnInit(): void {
		this.webSocketEndPoint = 'http://s3auto-env.eba-dqkeutck.us-east-2.elasticbeanstalk.com/uvp/ws';
		this.topic = '/topic/messages/';
		this.connect();
		this.getUserChatHistory();
	}
	
	//The AfterViewChecked triggers every time the view was checked
	ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

	public connect(): void {
		this.stompClient = Stomp.over(new SockJS(this.webSocketEndPoint));
		this.stompClient.connect({'X-Authorization': 'Bearer ' + this.token}, (): void => {
			this.stompClient.subscribe(this.topic + this.username, (message: any) => {
				this.handleMessage(message);
			});
		});
	}

	//Get selected user chat record
	getSelectedChat(item: any){
		console.log(item);
		this.toUserName = item.receiver;
		this.chatArray = item.msg;
		
		this.conversations.map(record => {
			if(record.receiver == this.toUserName){
				record.notification = 0;
				this.chatService.markConvAsRead({sender: this.username, receiver: this.toUserName, read: true})
				.subscribe(data => {
					record.read = true;
					console.log(record);
					console.log(this.conversations);
				}, error => {
					console.log("Error occured in put");
				})
			}
		})
	}

	//Send new message to the user
	public send(formMsg: string): void {
		console.log(this.toUserName);
		let sendObj = {
			msgFrom: this.username,
			msgTo: this.toUserName,
			message: formMsg,
			ts: Date.now(),
			read: false
		};

		this.stompClient.send('/chat/send/to/' + this.toUserName, {}, JSON.stringify(sendObj));
		this.chatArray.push({from: this.username, to: this.toUserName, msg: formMsg, 
			ts: Date.now(), read: false});
		this.message = "";
	}

	//To get logged in user's all chat history 
	private getUserChatHistory(){
		this.conversations = [];
		this.chatService.getUserChat(this.username)
		.subscribe(data => {
			console.log(data.conversations);

			data.conversations.forEach((chatRecord) =>{
				chatRecord.msg = JSON.parse(chatRecord.msg);
				this.conversations.push(chatRecord);
			});
			console.log(this.conversations);
			//toUserName and conversations.receiver need to check
			if(this.conversations.length !== 0){
				let itemExist = false;
				
				this.conversations.forEach((ele) => {
					//if previous conversations exist, update chatArray
					if(ele.receiver == this.toUserName){
						itemExist = true;
						this.chatArray = ele.msg;

						this.chatService.markConvAsRead(
							{sender: this.username, receiver: this.toUserName, read: true})
						.subscribe(data => {
							ele.read = true;
						}, error => {
							console.log("Error occured in put");
						});

					}
					this.scrollToBottom();
				});
				if(!itemExist){
					this.pushNewUser();
				} 
			}

		}, error => {
			//set array to the empty
			console.log(error);
			if(this.conversations.length == 0){
				this.pushNewUser();
			}
		});
	}

	//Add new user to the conversations
	private pushNewUser(){
		this.conversations.push({chatId: -1, msg: this.chatArray, read: true,
			receiver: this.toUserName, sender: this.username, notification: 0});
	}

	public handleMessage(message: any): void {
		console.log(JSON.parse(message.body));
		let messageObj = JSON.parse(message.body);
		this.messageFrom = messageObj.msgFrom;
		this.messageTo = messageObj.msgTo;
		this.chatMessage = messageObj.message;

		let arrPushObj = {
			from: this.messageFrom, 
			to: this.messageTo, 
			msg: this.chatMessage,
			ts: messageObj.ts,
			read: messageObj.read
		}

		let itemExist = false;
		this.conversations.forEach((ele) => {
			if(ele.receiver == messageObj.msgFrom){
				ele.msg.push(arrPushObj);
				if(this.toUserName == ele.receiver){
					if(this.chatArray.length == 0) this.chatArray = ele.msg; 
					//ele.read = false;//need to push new array	
					
					this.chatService.markConvAsRead(
							{sender: this.messageFrom, receiver: this.messageTo, read: true})
						.subscribe(data => {
							ele.read = true;
						}, error => {
							console.log("Error occured in put");
						});
				} else {
					if(ele.notification != undefined && ele.notification !== NaN)
						ele.notification++;
					else ele.notification = 1;
					
		
					for (let i = 0; i < ele.msg.length; i++) {
						if(ele.msg[i].read == false){
							ele.read = false;
						} 	
					} 
				}

				itemExist = true;
			}
		});

		
		if(!itemExist){
			// Creating new chat in array
			this.conversations.push({chatId: -1, msg: [arrPushObj], read: false,
				receiver: messageObj.msgFrom, sender: this.username, notification: 1});
			if(this.toUserName == messageObj.msgFrom){
				this.chatArray.push(arrPushObj);
			}
		}
	}

	scrollToBottom(): void {
        try {
            this.divToScroll.nativeElement.scrollTop = this.divToScroll.nativeElement.scrollHeight;
        } catch(err) { }                 
    }

	//side navbar hide and show
	openNav(){
		this.sideNavClicked = true;

	}

	closeNav(): void {
		console.log(this.conversations);

		this.sideNavClicked = false;
		this.closeNavFlag.emit({
			closeNav: false
		});
	}
}
