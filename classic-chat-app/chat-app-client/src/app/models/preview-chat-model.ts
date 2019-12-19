//@author Rohith Ravindranath
export class PreviewChatModel {
  constructor(
    public chatname:string,
    public recent_message_user:string,
    public recent_message:string,
    public recent_message_timestamp:string,
    public group_id:number,
    public is_group_chat:number
  ) { }
}
