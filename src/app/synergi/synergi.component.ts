import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';

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
  public showresult: boolean = false;
  public buttonName: any = 'Show';
  public model_parse: any;

// prediction function
  async predict() {
    this.showload = true;
    this.getSynergiResult();
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
    this.http.get<any>("http://localhost:8000/synergy_result", httpOptions).toPromise().then(data => {
      this.synergi = data[0].data;
      console.log(this.synergi);
      if(this.synergi){
        var temp_modelDis= this.modelDis.substring(this.modelDis.length - 11);
        this.model_parse = this.disease[temp_modelDis].name;
        this.showload = false;
        this.showresult = true;
      }
    });
  }
  // end of get syenrgi function

  dtOptions: any = {};
  ngOnInit() {
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
    this.http.get<any>("http://localhost:8000/disease_json", httpOptions).toPromise().then(data => {
      this.disease = data[0].data;
      console.log(this.disease);
      if (this.disease) {
        this.getDiseaseSynergy();
      }
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
    this.http.get<any>("http://localhost:8000/synergy_meta", httpOptions).toPromise().then(data => {
      this.diseaseSyn = data[0].data;
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
      }
    });
  }
// end Get Meta

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
