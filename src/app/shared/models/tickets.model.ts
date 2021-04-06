export class TicketItems{
  constructor(
    public issueId: number,
    public ticketNumber: number,
    public description: string,
    public email: string
  ){}
}
