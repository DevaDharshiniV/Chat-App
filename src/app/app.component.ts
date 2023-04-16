import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from './services/chat/chat.service';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterViewInit{
  @ViewChild('popup', {static: false}) popup: any;
  // minlength = 10;
  // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}";
  public roomId!: string;
  // phoneC = new FormControl();
  public messageText!: string;
  public messageArray: { user: string, message: string }[] = [];
  // private storageArray = [];
  private storageArray: { roomId: string, chats: { user: string, message: string }[] }[] = [];


  public showScreen = false;
  public phone!: string;
  // public currentUser: { id: number; name: string; phone: string; image: string; roomId: { 2: string; 3: string; 4: string; 1?: undefined; }; } | { id: number; name: string; phone: string; image: string; roomId: { 1: string; 3: string; 4: string; 2?: undefined; }; } | { id: number; name: string; phone: string; image: string; roomId: { 1: string; 2: string; 4: string; 3?: undefined; }; } | { id: number; name: string; phone: string; image: string; roomId: { 1: string; 2: string; 3: string; 4?: undefined; }; } | undefined;
  public currentUser: any;
  public selectedUser: any;
  // public selectedUser: { id: number; name: string; phone: string; image: string; roomId: { 2: string; 3: string; 4: string; 1?: undefined; }; } | { id: number; name: string; phone: string; image: string; roomId: { 1: string; 3: string; 4: string; 2?: undefined; }; } | { id: number; name: string; phone: string; image: string; roomId: { 1: string; 2: string; 4: string; 3?: undefined; }; } | { id: number; name: string; phone: string; image: string; roomId: { 1: string; 2: string; 3: string; 4?: undefined; }; } | undefined;

  public userList = [
    {
      id: 1,
      name: 'Klaus Mikaelson',
      phone: '9438987427',
      image: 'assets/users/kla.jpg',
      roomId: {
        2: 'room-1',
        3: 'room-2',
        4: 'room-3'
      }
    },
    {
      id: 2,
      name: 'Caroline Forbes',
      phone: '9765432187',
      image: 'assets/users/car.jpg',
      roomId: {
        1: 'room-1',
        3: 'room-4',
        4: 'room-5'
      }
    },
    {
      id: 3,
      name: 'Stefan Salvatore',
      phone: '9683875293',
      image: 'assets/users/stef.jpg',
      roomId: {
        1: 'room-2',
        2: 'room-4',
        4: 'room-6'
      }
    },
    {
      id: 4,
      name: 'Hayley Marshall',
      phone: '9824684359',
      image: 'assets/users/hay.jpg',
      roomId: {
        1: 'room-3',
        2: 'room-5',
        3: 'room-6'
      }
    }
  ];


  constructor(private chatService: ChatService,private modalService: NgbModal){


  }
  ngOnInit(): void {
    this.chatService.getMessage()
      .subscribe((data: { user: string, room: string, message: string }) => {
        // this.messageArray.push(data);
        if (this.roomId) {
          setTimeout(() => {
            this.storageArray = this.chatService.getStorage();
            const storeIndex = this.storageArray
              .findIndex((storage:any) => storage.roomId === this.roomId);
            this.messageArray = this.storageArray[storeIndex].chats;
          }, 500);
        }
      });

  }

  ngAfterViewInit(): void {
    this.openPopup(this.popup);
  }

  openPopup(content: any): void {
    this.modalService.open(content, {backdrop: 'static', centered: true});
  }
  login(dismiss: any): void {
    this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
    this.userList = this.userList.filter((user) => user.phone !== this.phone.toString());

    if (this.currentUser) {
      this.showScreen = true;
      dismiss();
    }
    else{
      alert('User not found');
    }
  }
  // login(form: any) {
  //   if (form.valid) {
  //     this.currentUser = this.userList.find((user) => user.phone === this.phone);
  //     if (this.currentUser) {
  //       this.showScreen = true;
  //     } else {
  //       alert('User not found');
  //     }
  //   }
  // }
  selectUserHandler(phone: string): void {
    this.selectedUser = this.userList.find(user => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];


    this.storageArray = this.chatService.getStorage();

    const storeIndex = this.storageArray.findIndex((storage: any) => storage.roomId === this.roomId);

  if (storeIndex > -1) {
    this.messageArray = this.storageArray[storeIndex].chats;
  }

    this.join(this.currentUser.name,this.roomId);
  }

  join(username: string, roomId: string){
    this.chatService.joinRoom({user: username, room: roomId});
  }
  sendMessage(): void {
    this.chatService.sendMessage({
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText
    });

    this.storageArray = this.chatService.getStorage();

    const storeIndex = this.storageArray.findIndex((storage: any) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      });
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser.name,
          message: this.messageText
        }]
      };

      this.storageArray.push(updateStorage);
    }
    this.chatService.setStorage(this.storageArray);
    this.messageText='';
  }



  title = 'frontend';
}
