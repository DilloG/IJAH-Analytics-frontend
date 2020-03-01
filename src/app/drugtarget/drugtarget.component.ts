import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-drugtarget',
  templateUrl: './drugtarget.component.html',
  styleUrls: ['./drugtarget.component.css']
})
export class DrugtargetComponent implements OnInit {


  constructor(private http: HttpClient) {
  }

// BAGIAN INPUT. BAGIAN INPUT

 // input dynamic
  public addInput_btn = 0;
  public plants: any[] = [{
    pla_name: ''
  }];
  public compounds: any[] = [{
    dis_name: ''
  }]

  addPlant() {
    if(this.plants.length < 4){
      this.plants.push({
        pla_name: ''
      });
      this.addInput_btn +=1;
    }
        console.log(this.addInput_btn);
  }
  addCompound() {
    if(this.compounds.length < 4){
      this.compounds.push({
        dis_name: ''
      });
      this.addInput_btn +=1;
    }
    console.log(this.addInput_btn);
  }

  removePlant(i: number) {
    if(this.plants.length > 1){
      this.plants.splice(i, 1);
      this.addInput_btn -=1;
    }
  }
  removeCompound(i: number) {
    if(this.compounds.length > 1){
      this.compounds.splice(i, 1);
      this.addInput_btn -=1;
    }
  }

  logValue() {
    console.log(this.plants);
    console.log(this.compounds);
  }
  // end of input dynamic

  //show input
  //show input
  public pla_input_btn = true;
  public com_input_btn = false;
  public pro_input_btn = true;
  public dis_input_btn = false;

  plant_input() {
    if(this.pla_input_btn == false){
      this.addInput_btn -= (this.addInput_btn + 1);
      this.compounds.splice(0, this.compounds.length);
      this.addCompound();
    }
    this.pla_input_btn = true;
    this.com_input_btn = false;
  }
  compound_input() {
    if(this.com_input_btn == false){
      this.addInput_btn -= (this.addInput_btn + 1);
      this.plants.splice(0, this.plants.length);
      this.addPlant();
    }
    this.pla_input_btn = false;
    this.com_input_btn = true;
  }

  protein_input() {
    this.pro_input_btn = true;
    this.dis_input_btn = false;
  }
  disease_input() {
    this.pro_input_btn = false;
    this.dis_input_btn = true;
  }
  //endof show input

  // getdisease meta
  // getdisease meta
  disease: any;
  disease_arr: any = [];

  getDiseaseMeta() {
    this.http.get<any>("http://localhost:3000/disease").toPromise().then(data => {
      this.disease = data;
      console.log(this.disease[1].dis_name);
      if (this.disease) {
        for (var i = 0; i < this.disease.length; i++) {
          this.disease_arr.push(this.disease[i].dis_name);
        }
      }
    });
    console.log(this.disease_arr);
  }

  plant: any;
  plant_arr: any = [];

  getPlantMeta() {
    this.http.get<any>("http://localhost:3000/plant").toPromise().then(data => {
      this.plant = data;
      console.log(this.plant[1].pla_name);
      if (this.plant) {
        for (var i = 0; i < this.plant.length; i++) {
          this.plant_arr.push(this.plant[i].pla_name);
        }
      }
    });
    console.log(this.plant_arr);
  }

  // ngbTypeahead
  public modelDrug0: any;
  public modelDrug1: any;
  public modelDrug2: any;
  public modelDrug3: any;
  searchDisease = (text$: Observable<string>) =>
    text$.pipe( //typeahead target
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.disease_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)),
    )

  public modelPlant0: any;
  searchPlant = (text$: Observable<string>) =>
    text$.pipe( //typeahead target
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 1 ? []
        : this.plant_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )


  showresult: boolean = false;

  async predict() {
    // this.showload = true;
    this.getDrugTargetResult();
    this.logValue();
    // console.log(this.model);
  }
  // BAGIAN INPUT. END OF BAGIAN INPUT!

  dtOptions: any = {};
  ngOnInit() {

    this.getDiseaseMeta();
    this.getPlantMeta();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      order: [1, 'desc'],
      dom: 'Bfrtip',
      buttons: ['copy', 'print', 'excel']
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
          this.sankeyData();
        }
        this.showresult = true;
        this.removeDuplicates();
      }
    });
  }


  // show table ngIf
  // show table ngIf
  private pla_com_btn: boolean = true;
  private com_pro_btn: boolean = false;
  private pro_dis_btn: boolean = false;

  pla_com_on() {
    this.pla_com_btn = true;
    this.com_pro_btn = false;
    this.pro_dis_btn = false;
  }
  com_pro_on() {
    this.pla_com_btn = false;
    this.com_pro_btn = true;
    this.pro_dis_btn = false;
  }
  pro_dis_on() {
    this.pla_com_btn = false;
    this.com_pro_btn = false;
    this.pro_dis_btn = true;
  }  // end of show table ngIf
  // end of show table ngIf


  // show table ngIF for Metadata
  // show table ngIF for Metadata
  private pla_btn: boolean = true;
  private com_btn: boolean = false;
  private pro_btn: boolean = false;
  private dis_btn: boolean = false;

  pla_on() {
    this.pla_btn = true;
    this.com_btn = false;
    this.pro_btn = false;
    this.dis_btn = false;
  }
  com_on() {
    this.pla_btn = false;
    this.com_btn = true;
    this.pro_btn = false;
    this.dis_btn = false;
  }
  pro_on() {
    this.pla_btn = false;
    this.com_btn = false;
    this.pro_btn = true;
    this.dis_btn = false;
  }
  dis_on() {
    this.pla_btn = false;
    this.com_btn = false;
    this.pro_btn = false;
    this.dis_btn = true;
  }
  // end of show table ngIF for Metadata
  // end of show table ngIF for Metadata

  //remove duplicates in result
  //remove duplicates in result
  private meta_pla = [];
  private meta_com = [];
  private meta_pro = [];
  private meta_dis = [];

  removeDuplicates() {

    this.meta_pla.splice(0, this.meta_pla.length);
    this.meta_com.splice(0, this.meta_com.length);
    this.meta_pro.splice(0, this.meta_pro.length);
    this.meta_dis.splice(0, this.meta_dis.length);

    let pla_unique = {};
    let com_unique = {};
    let pro_unique = {};
    let dis_unique = {};

    let i_pla;
    let i_com;
    let i_pro;
    let i_dis;

    // plant remove duplicate
    for (i_pla in this.pla_com) {
      let objTitle = this.pla_com[i_pla]['pla_name'];
      pla_unique[objTitle] = this.pla_com[i_pla];
    }

    for (i_pla in pla_unique) {
      this.meta_pla.push(pla_unique[i_pla]);
    }
    console.log(this.meta_pla);

    // compound remove removeDuplicates
    for (i_com in this.pla_com) {
      let objTitle = this.pla_com[i_com]['com_pubchem_name'];
      com_unique[objTitle] = this.pla_com[i_com];
    }

    for (i_com in com_unique) {
      this.meta_com.push(com_unique[i_com]);
    }
    console.log(this.meta_com);

    // protein remove removeDuplicates
    for (i_pro in this.pro_dis) {
      let objTitle = this.pro_dis[i_pro]['pro_name'];
      pro_unique[objTitle] = this.pro_dis[i_pro];
    }

    for (i_pro in pro_unique) {
      this.meta_pro.push(pro_unique[i_pro]);
    }
    console.log(this.meta_pro);

    // compound remove removeDuplicates
    for (i_dis in this.pro_dis) {
      let objTitle = this.pro_dis[i_dis]['dis_name'];
      dis_unique[objTitle] = this.pro_dis[i_dis];
    }

    for (i_dis in dis_unique) {
      this.meta_dis.push(dis_unique[i_dis]);
    }
    console.log(this.meta_dis);
  }  //end of remove duplicates in result
  //end of remove duplicates in result


  //links to gbif plant databases
  //links to gbif plant databases
  generateLink(a: string) {
    var links = "";
    var newurl = "";
    this.http.get<any>("http://api.gbif.org/v1/species/match?verbose=false&kingdom=Plantae&name=" + a).toPromise().then(data => {
      links = data.usageKey;
      if (links) {
        var newurl = "https://www.gbif.org/species/" + links;
        window.open(newurl, "_blank")
      }
    });
  }//end of links to gbif plant databases
  //end of links to gbif plant databases

  //summary score function & sankey diagram data
  //summary score function & sankey diagram data
  private totalScore: any = 0;
  private pla_com_score: any = 0;
  private com_pro_score: any = 0;
  private pro_dis_score: any = 0;

  private sankey_Data = [];
  sankeyData() {
    // console.log(this.pla_com);
    var number0 = 0;
    var number1 = 0;
    var number2 = 0;

    for (var i in this.pla_com) {
      this.sankey_Data.push([this.pla_com[i].pla_name, this.pla_com[i].com_pubchem_name, parseFloat(this.pla_com[i].weight)]);
      // adding score pla_com connectivity
      number0 += parseFloat(this.pla_com[i].weight)
    }
    for (var i in this.com_pro) {
      this.sankey_Data.push([this.com_pro[i].com_pubchem_name, this.com_pro[i].pro_name, parseFloat(this.com_pro[i].weight)]);
      // adding score pla_com connectivity
      number1 += parseFloat(this.com_pro[i].weight);
    }
    for (var i in this.pro_dis) {
      this.sankey_Data.push([this.pro_dis[i].pro_name, this.pro_dis[i].dis_name, parseFloat(this.com_pro[i].weight)]);
      number2 += parseFloat(this.pro_dis[i].weight);
    }

    this.pla_com_score = number0.toFixed(3);
    this.com_pro_score = number1.toFixed(3);
    this.pro_dis_score = number2.toFixed(3);
    this.totalScore = (number0 + number1 + number2).toFixed(3);

    console.log(this.sankey_Data);
    console.log(this.pla_com_score);
  }

  // sankey diagram
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
  // width = 1000;
  // height = 400;


}
