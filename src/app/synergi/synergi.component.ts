import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


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
    console.log(this.model);
  }

  // get syenrgi function
  synergi: any;
  getSynergiResult(){
    this.http.get<any>("http://localhost:3000/synergi_result").toPromise().then(data => {
      this.synergi = data;
      console.log(this.synergi);
      if(this.synergi){
        this.showload = false;
        this.showresult = true;
        this.model_parse = this.model;
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

  // for typeahead function and get
  disease: any;
  disease_arr: any = [];

  getDiseaseMeta() {
  this.http.get<any>("http://localhost:3000/disease").toPromise().then(data => {
    this.disease = data;
    console.log(this.disease[1].dis_name);
    if(this.disease){
      for(var i = 0; i < this.disease.length ; i++){
        this.disease_arr.push(this.disease[i].dis_name);
      }
    }
  });
  console.log(this.disease_arr);
}
  public model: any;

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.disease_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  // end of for typeahead
}
