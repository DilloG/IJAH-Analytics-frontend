import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import { Subject } from 'rxjs';

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

public showload = false;
public showresult = false;
async predict() {
  this.showload = true;
  this.getDrugTargetResult();
  // this.logValue();
  // console.log(this.model);
}
  dtOptions: any = {};
  ngOnInit() {
    this.getCompoundMeta();
    // this.getDrugTargetResult()

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      dom: 'Bfrtip',
      buttons: [ 'copy','print','excel']
    };
  }

drugtarget: any;
pla_com: any;
com_pro: any;
pro_dis: any;
getDrugTargetResult() {
  this.http.get<any>("http://localhost:3000/drugtarget_result").toPromise().then(data => {
    this.drugtarget = data;
    if (this.drugtarget) {
      this.pla_com = this.drugtarget.plant_compound;
      this.com_pro = this.drugtarget.compound_protein;
      this.pro_dis = this.drugtarget.protein_disease;
      if (this.pla_com) {
        this.sankey_Data();
        this.showresult = true;
        this.showload = false;
      }
      // this.removeDuplicates();
    }
  });
}

public totalScore:any;
public pla_com_score:any;
public com_pro_score:any;
public pro_dis_score:any;

public meta_pla = 9;
public meta_pro = 13;
public meta_com = 9;
public meta_dis = 4;
private sankeyData = [];

sankey_Data() {
  // console.log(this.pla_com);
  var number0 = 0;
  var number1 = 0;
  var number2 = 0;

  for (var i in this.pla_com) {
    this.sankeyData.push([this.pla_com[i].pla_name, this.pla_com[i].com_pubchem_name, parseFloat(this.pla_com[i].weight)]);
    // adding score pla_com connectivity
    number0 += parseFloat(this.pla_com[i].weight)
  }
  for (var i in this.com_pro) {
    this.sankeyData.push([this.com_pro[i].com_pubchem_name, this.com_pro[i].pro_name, parseFloat(this.com_pro[i].weight)]);
    // adding score pla_com connectivity
    number1 += parseFloat(this.com_pro[i].weight);
  }
  for (var i in this.pro_dis) {
    this.sankeyData.push([this.pro_dis[i].pro_name, this.pro_dis[i].dis_name, parseFloat(this.pro_dis[i].weight)]);
    number2 += parseFloat(this.pro_dis[i].weight);
  }

  this.pla_com_score = number0.toFixed(3);
  this.com_pro_score = number1.toFixed(3);
  this.pro_dis_score = number2.toFixed(3);
  this.totalScore = (number0 + number1 + number2).toFixed(3);

  console.log(this.sankeyData);
  console.log(this.pla_com_score);
}

// sankey diagram
title = '';
type = 'Sankey';
columnNames = ['From', 'To', 'Weight'];
options = {
  sankey: {
    node: {
      width: 15,
      label: {
        fontSize: 11,
        color: '#000000',
        bold: true,
      },
      interactivity: true
    },
    link: {
      colorMode: 'source'
    }
  },
  width: $(window).width() * 0.80,
  height: 2100
};
}
