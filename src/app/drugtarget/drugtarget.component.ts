import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


@Component({
  selector: 'app-drugtarget',
  templateUrl: './drugtarget.component.html',
  styleUrls: ['./drugtarget.component.css']
})
export class DrugtargetComponent implements OnInit {

  constructor(private http:HttpClient) { }
  // public proteinInput: boolean = true;

  showresult:boolean = false;

  async predict() {
    // this.showload = true;
    this.getDrugTargetResult();
    // console.log(this.model);
  }

  dtOptions: any = {};
  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      dom: 'Bfrtip',
      buttons: [ 'copy','print','excel']
    };
  }

  drugtarget: any;
  pla_com: any;
  getDrugTargetResult(){
    this.http.get<any>("http://localhost:3000/drugtarget_result").toPromise().then(data => {
      this.drugtarget = data;
      if(this.drugtarget){
        this.pla_com = this.drugtarget.plant_compound;
        this.showresult = true;
      }
    });
  }

}
