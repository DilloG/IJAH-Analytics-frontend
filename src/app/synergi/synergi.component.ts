import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { DataTableDirective } from 'angular-datatables';

type Disease_m = {id: string, name: string};

@Component({
  selector: 'app-synergi',
  templateUrl: './synergi.component.html',
  styleUrls: ['./synergi.component.css']
})


export class SynergiComponent implements OnInit {

constructor(private http:HttpClient) { }

// table design
  public showload: boolean = false;
  public showloadfirst: boolean = true;
  public showresult: boolean = false;
  public buttonName: any = 'Show';
  public model_parse: any;
  public model_link:any;

// prediction function
  async predict() {
    this.showresult = false;
    if(this.clickedItem){
      this.showload = true;
      this.getSynergiResult();
    }else{
      this.showFailedInput = true;
    }
  }

  resetinput(){
    this.modelDis = "";
    this.clickedItem = false;
  }

  errMsg:any;
  // close error
  showFailed:boolean = false;
  showFailedLoad:boolean = false;
  closeError(){
    this.showFailed = false;
    this.showFailedLoad = false;
    this.showload = false;
  }

  showFailedInput:boolean = false;
  closeInfo(){
    this.showFailedInput = false;
    this.showload = false;
  }

  // get syenrgi function
  synergi: any;
  synergy_arr: any;
  getSynergiResult(){
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    var postmsgsynergi = JSON.stringify({disease: this.modelDis.substring(this.modelDis.length - 11)});
    //tinggal dipost
    this.http.post<any>("http://api.vidner.engineer/sinergy_from_disease", postmsgsynergi, httpOptions).toPromise().then(data => {
      this.synergi = data.data;
      console.log(this.synergi);
      if(this.synergi){
        const temp_modelDis= this.modelDis.substring(this.modelDis.length - 11);
        this.model_parse = this.disease[temp_modelDis].name;
        this.model_link = this.disease[temp_modelDis].oid;
        this.synergi = Object.values(this.synergi).map(
          function(values:any){
            return {
              com1: values[0],
              com2: values[1],
              as: values[2],
              ts: values[3],
              ss: values[4]
            }
          }
        );
        this.showload = false;
        this.showresult = true;
      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailed = true;
    });
  }

  // end of get syenrgi function
  dtOptions: any = {};

  ngOnInit() {
    window.onbeforeunload = function () {
      window.scrollTo(0, 0);
    }
    this.getDiseaseMeta();
    // oninit datatables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      order: [4, 'desc'],
      dom: 'Bfrtip',
      buttons: [ 'copy','print','excel']
    };
  }
  //

// Get Meta
  // get disease meta
  disease: Object;
  disease_arr: any = [];
  getDiseaseMeta() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.get<any>("http://api.vidner.engineer/disease", httpOptions).toPromise().then(data => {
      this.disease = data.data;
      console.log(this.disease);
      if (this.disease) {
        this.getDiseaseSynergy();
      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailedLoad = true;
    });
  }
  // get synergy meta
  diseaseSyn: Object;
  getDiseaseSynergy() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.get<any>("http://api.vidner.engineer/sinergy", httpOptions).toPromise().then(data => {
      this.diseaseSyn = data.data;
      console.log(this.diseaseSyn);
      if (this.diseaseSyn) {
        var temp_disease = this.disease;
        this.disease_arr = Object.values(this.diseaseSyn).map(
          function(values){
            return temp_disease[values].name +" | "+
            temp_disease[values].oid +" | "+
            values;
          }
        );
        console.log(this.disease_arr);
        this.showloadfirst = false;
      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailedLoad = true;
    });
  }
// end Get Meta

clickedItem: boolean = false;
selectedEfficacy(item) {
  this.clickedItem = true;
}

// typeahead
  modelDis: any;
  searchDisease = (text$: Observable<string>) => text$.pipe( //typeahead target
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.disease_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )
// end of for typeahead
}
