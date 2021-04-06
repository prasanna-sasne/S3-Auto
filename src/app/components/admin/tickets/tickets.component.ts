import { Component, OnInit } from '@angular/core';
import { TicketItems } from '../../../shared/models/tickets.model'

import { TicketsService } from '../../../services/tickets.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
  providers: [TicketsService]
})
export class TicketsComponent implements OnInit {
  public ticketItems: TicketItems[];
  public j: any;
  alert:boolean=false
  constructor(private ticketsService:TicketsService) { }
  delete(j)
  {
    console.log(j);
    this.ticketsService.deleteData(j).subscribe(data=>
    {
      this.ticketsService.getTicketsList().subscribe(data =>  {this.ticketItems=data;});
    })
    this.alert=true
  }
  closeAlert()
  {
    this.alert=false
  }

  ngOnInit(): void {
    this.ticketsService.getTicketsList().subscribe(data =>  {this.ticketItems=data;});
    console.log("component start ");
    console.log(this.ticketItems);
  }

}
