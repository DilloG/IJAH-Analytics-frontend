import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';

interface Country {
  id?: number;
  name: string;
  flag: string;
  area: number;
  population: number;
}

const COUNTRIES: Country[] = [
  {
    name: 'Russia',
    flag: 'f/f3/Flag_of_Russia.svg',
    area: 17075200,
    population: 146989754
  },
  {
    name: 'France',
    flag: 'c/c3/Flag_of_France.svg',
    area: 640679,
    population: 64979548
  },
  {
    name: 'Germany',
    flag: 'b/ba/Flag_of_Germany.svg',
    area: 357114,
    population: 82114224
  },
  {
    name: 'Portugal',
    flag: '5/5c/Flag_of_Portugal.svg',
    area: 92090,
    population: 10329506
  },
  {
    name: 'Canada',
    flag: 'c/cf/Flag_of_Canada.svg',
    area: 9976140,
    population: 36624199
  },
  {
    name: 'Vietnam',
    flag: '2/21/Flag_of_Vietnam.svg',
    area: 331212,
    population: 95540800
  },
  {
    name: 'Brazil',
    flag: '0/05/Flag_of_Brazil.svg',
    area: 8515767,
    population: 209288278
  },
  {
    name: 'Mexico',
    flag: 'f/fc/Flag_of_Mexico.svg',
    area: 1964375,
    population: 129163276
  },
  {
    name: 'United States',
    flag: 'a/a4/Flag_of_the_United_States.svg',
    area: 9629091,
    population: 324459463
  },
  {
    name: 'India',
    flag: '4/41/Flag_of_India.svg',
    area: 3287263,
    population: 1324171354
  },
  {
    name: 'Indonesia',
    flag: '9/9f/Flag_of_Indonesia.svg',
    area: 1910931,
    population: 263991379
  },
  {
    name: 'Tuvalu',
    flag: '3/38/Flag_of_Tuvalu.svg',
    area: 26,
    population: 11097
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  },
  {
    name: 'China',
    flag: 'f/fa/Flag_of_the_People%27s_Republic_of_China.svg',
    area: 9596960,
    population: 1409517397
  }
];

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {

  private disease = ['Diabetes mellitus', 'Diabetes mellitus type 2', 'Diabetes mellitus type 3'];

  // typeahead
  public modelAnalg: any;
  public modelBacteri: any;
  public modelInflam: any;
  public modelActivity: any;
  public modelEfficacy: any;
  public modelTarget: any;

  searchInflam = (text$: Observable<string>) =>
    text$.pipe( //typeahead drug
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.compound_Infl.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  searchAnalg = (text$: Observable<string>) =>
    text$.pipe( //typeahead drug
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.compound_Anal.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  searchBacteri = (text$: Observable<string>) =>
    text$.pipe( //typeahead drug
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.compound_Bact.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  searchEfficacy = (text$: Observable<string>) =>
    text$.pipe( //typeahead target
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.disease.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  searchActivity = (text$: Observable<string>) =>
    text$.pipe( //typeahead target
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.disease.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  searchTarget = (text$: Observable<string>) =>
    text$.pipe( //typeahead target
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.disease.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  constructor(private http:HttpClient) { }

  public data = COUNTRIES;

  dtOptions: any = {};
  ngOnInit() {
    this.getCompoundMeta();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      dom: 'Bfrtip',
      buttons: [ 'copy','print','excel']
    };
  }

  compound: any;
  compound_Anal: any = [];
  compound_Bact: any = [];
  compound_Infl: any = [];

  getCompoundMeta() {
  this.http.get<any>("http://localhost:3000/compound").toPromise().then(data => {
    this.compound = data;
    console.log(this.compound[1].com_pubchem_name);
    if(this.compound){
      for(var i = 0; i < this.compound.length ; i++){
        if(this.compound[i].com_type == "Analgesic"){
          this.compound_Anal.push(this.compound[i].com_pubchem_name);
        }
        if(this.compound[i].com_type == "Antibacterial"){
          this.compound_Bact.push(this.compound[i].com_pubchem_name);
        }
        if(this.compound[i].com_type == "Antiinflamatory"){
          this.compound_Infl.push(this.compound[i].com_pubchem_name);
        }
          // this.compound_arr.push(this.compound[i].com_pubchem_name);
      }
    }
  });
  // console.log(this.compound_arr);
}

}
