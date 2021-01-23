import { Component, OnInit } from "@angular/core";
import { HostListener } from "@angular/core";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ijahtesting';

  showmenu:boolean = false;
  screenHeight: number;
  screenWidth: number;

   constructor() {
       this.getScreenSize();
   }

   @HostListener('window:resize', ['$event'])
   getScreenSize(event?) {
      this.screenHeight = window.innerHeight;
      this.screenWidth = window.innerWidth;
      if(this.screenWidth > 780){
        this.showmenu = true;
      }
      console.log(this.showmenu)
      console.log(this.screenHeight, this.screenWidth);
   }

  showside(){
    this.showmenu = !this.showmenu;
  }
}
