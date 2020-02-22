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
  com_pro: any;
  pro_dis: any;
  getDrugTargetResult(){
    this.http.get<any>("http://localhost:3000/drugtarget_result").toPromise().then(data => {
      this.drugtarget = data;
      if(this.drugtarget){
        this.pla_com = this.drugtarget.plant_compound;
        this.com_pro = this.drugtarget.compound_protein;
        this.pro_dis = this.drugtarget.protein_disease;
        this.showresult = true;
      }
    });
  }

  //show input
  //show input
  public pla_input_btn = true;
  public com_input_btn = false;
  public pro_input_btn = true;
  public dis_input_btn = false;

  plant_input(){
    this.pla_input_btn = true;
    this.com_input_btn = false;
  }
  compound_input(){
    this.pla_input_btn = false;
    this.com_input_btn = true;
  }

  protein_input(){
    this.pro_input_btn = true;
    this.dis_input_btn = false;
  }
  disease_input(){
    this.pro_input_btn = false;
    this.dis_input_btn = true;
  }

  // show table ngIf
  // show table ngIf
  private pla_com_btn: boolean = true;
  private com_pro_btn: boolean = false;
  private pro_dis_btn: boolean = false;

  pla_com_on(){
    this.pla_com_btn = true;
    this.com_pro_btn = false;
    this.pro_dis_btn = false;
  }
  com_pro_on(){
    this.pla_com_btn = false;
    this.com_pro_btn = true;
    this.pro_dis_btn = false;
  }
  pro_dis_on(){
    this.pla_com_btn = false;
    this.com_pro_btn = false;
    this.pro_dis_btn = true;
  }  // end of show table ngIf
  // end of show table ngIf
}
