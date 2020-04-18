import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }


  ngOnInit() {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
    AOS.init(
      {
        duration: 1200
      }
    );
    window.scrollTo(0,0);
  }

  showCite: boolean = false;
  openCite(){
    this.showCite = !this.showCite;
  }


}
