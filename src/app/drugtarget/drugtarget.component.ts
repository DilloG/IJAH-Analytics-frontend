import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, merge } from 'rxjs';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-drugtarget',
  templateUrl: './drugtarget.component.html',
  styleUrls: ['./drugtarget.component.css']
})
export class DrugtargetComponent implements OnInit {

// for download images
  @ViewChild('screen',{static: false}) screen: ElementRef;
  @ViewChild('canvas',{static: false}) canvas: ElementRef;
  @ViewChild('downloadLink',{static: false}) downloadLink: ElementRef;

  downloadImage(){
    window.scrollTo(0,0);
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'drugTarget_graph.png';
      this.downloadLink.nativeElement.click();
    });
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
  }
  //end for download images

  constructor(private http: HttpClient) {
  }

  // BAGIAN INPUT. BAGIAN INPUT
  addDrug_btn = 1;
  addTarget_btn = 1;
  public plantFor: any[] = [{
    name: '',
  }];
  public compoundFor: any[] = [{
    name: '',
  }];
  public proteinFor: any[] = [{
    name: '',
  }];
  public diseaseFor: any[] = [{
    name: '',
  }];

  addPlant() {
    if (this.addDrug_btn < 5) {
      this.plantFor.push({
        name: '',
      });
      this.addDrug_btn += 1
    }
    console.log(this.addDrug_btn);
  }
  addCompound() {
    if (this.addDrug_btn < 5) {
      this.compoundFor.push({
        name: '',
      });
      this.addDrug_btn += 1
    }
    console.log(this.addDrug_btn);
  }
  addProtein() {
    if (this.addTarget_btn < 5) {
      this.proteinFor.push({
        name: '',
      });
      this.addTarget_btn += 1
    }
    console.log(this.addTarget_btn);
  }
  addDisease() {
    if (this.addTarget_btn < 5) {
      this.diseaseFor.push({
        name: '',
      });
      this.addTarget_btn += 1
    }
    console.log(this.addTarget_btn);
  }

  removePlant(i: number) {
    if (this.addDrug_btn > 1) {
      this.plantFor.splice(i, 1);
      this.addDrug_btn -= 1;
    }
  }
  removeCompound(i: number) {
    if (this.addDrug_btn > 1) {
      this.compoundFor.splice(i, 1);
      this.addDrug_btn -= 1;
    }
  }
  removeProtein(i: number) {
    if (this.addTarget_btn > 1) {
      this.proteinFor.splice(i, 1);
      this.addTarget_btn -= 1;
    }
  }
  removeDisease(i: number) {
    if (this.addTarget_btn > 1) {
      this.diseaseFor.splice(i, 1);
      this.addTarget_btn -= 1;
    }
  }
  // end of input dynamic

  //button for drugtarget side
  dsInput: boolean = true;
  tsInput: boolean = false;
  dstsInput: boolean = false;
  ds_input_btn() {
    this.dsInput = true;
    this.tsInput = false;
    this.dstsInput = false;
    this.disease_input();
    this.protein_input();
  }
  ts_input_btn() {
    this.dsInput = false;
    this.tsInput = true;
    this.dstsInput = false;
    this.compound_input();
    this.plant_input();
  }
  dsts_input_btn() {
    this.dsInput = false;
    this.tsInput = false;
    this.dstsInput = true;
    this.disease_input();
    this.compound_input();
    this.plant_input();
    this.protein_input();
  }

  //show input
  public pla_input_btn = true;
  public com_input_btn = false;
  public pro_input_btn = true;
  public dis_input_btn = false;

  plant_input() {
    if (this.pla_input_btn == false) {
      this.compoundFor.splice(0, this.compoundFor.length);
      this.addDrug_btn -= this.addDrug_btn;
      this.addCompound();
    }
    this.pla_input_btn = true;
    this.com_input_btn = false;
  }
  compound_input() {
    if (this.com_input_btn == false) {
      this.plantFor.splice(0, this.plantFor.length);
      this.addDrug_btn -= this.addDrug_btn;
      this.addPlant()
    }
    this.pla_input_btn = false;
    this.com_input_btn = true;
  }
  protein_input() {
    if (this.pro_input_btn == false) {
      this.diseaseFor.splice(0, this.diseaseFor.length);
      this.addTarget_btn -= this.addTarget_btn;
      this.addDisease()
    }
    this.pro_input_btn = true;
    this.dis_input_btn = false;
  }
  disease_input() {
    if (this.dis_input_btn == false) {
      this.proteinFor.splice(0, this.proteinFor.length);
      this.addTarget_btn -= this.addTarget_btn;
      this.addProtein()
    }
    this.pro_input_btn = false;
    this.dis_input_btn = true;
  }
  //endof show input

  resetinput(){

  }
  // getinput meta
  showloadFirst: boolean = true;

  // plant meta
  plant_new: Object;
  public plant_new_arr = [];
  getPlantNewMeta() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.get<any>("http://api.vidner.engineer/plant", httpOptions).toPromise().then(data => {
      this.plant_new = data.data;
      console.log(this.plant_new);
      if (this.plant_new) {
        var t2 = performance.now();
        const nilai = this.plant_new;
        this.plant_new_arr = Object.keys(this.plant_new).map(
          function(key) {
            return key + " | " + nilai[key].nlat;
          });
        console.log(this.plant_new_arr);
        var t3 = performance.now();
        console.log("Took: " + (t3 - t2) + "msecs");
      }
    });

  }

  // compound meta
  compound: any;
  compound_arr: any = [];
  getCompoundMeta() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.get<any>("http://api.vidner.engineer/compound", httpOptions).toPromise().then(data => {
      this.compound = data.data;
      if (this.compound) {
        var t2 = performance.now();
        const nilai = this.compound;
        this.compound_arr = Object.keys(this.compound).filter(
          function(key) {
            return nilai[key].npac !== null && nilai[key].npub !== null;
          }
        ).map(
          function(key) {
            return key + " | " + nilai[key].npub + " | " + nilai[key].npac;
          });
        console.log(this.compound_arr);
        var t3 = performance.now();
        console.log("Took: " + (t3 - t2) + "msecs");
        this.showloadFirst = false;
      }
    });
  }

  // disease meta
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
      if (this.disease) {
        var nilai = this.disease;
        this.disease_arr = Object.keys(this.disease).map(
          function(key) {
            return key + " | " + nilai[key].oid + " | " + nilai[key].name + " | " + nilai[key].uab;
          });
        console.log(this.disease_arr);
      }
    });
  }

  // protein meta
  protein: any;
  protein_arr: any = [];
  getProteinMeta() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.get<any>("http://api.vidner.engineer/protein", httpOptions).toPromise().then(data => {
      this.protein = data.data;
      if (this.protein) {
        var nilai = this.protein;
        this.protein_arr = Object.keys(this.protein).map(
          function(key) {
            return key + " | " + nilai[key].name + " | " + nilai[key].uid + " | " + nilai[key].uab;
          });
        console.log(this.protein_arr);
      }
    });
  }
  // end of getinput meta


  // ngbTypeahead
  public modelPla: any;
  searchPlant = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.plant_new_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  public modelCom: any;
  searchCompound = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.compound_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)));

  public modelPro: any;
  searchProtein = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.protein_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  public modelDis: any;
  searchDisease = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.disease_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );
  //end of ngbTypeahead


  // predict function
  showresult: boolean = false;
  showload: boolean = false;

  async predict() {
    this.showresult = false;
    this.showload = true;
    this.filtermodel = 0.0;
    this.getDrugTargetResult();
  }
  // END OF BAGIAN INPUT!

  dtOptions: any = {};
  ngOnInit() {
    window.onbeforeunload = function() {
      window.scrollTo(0, 0);
    }
    this.getPlantNewMeta();
    this.getDiseaseMeta();
    this.getProteinMeta();
    this.getCompoundMeta();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      order: [1, 'desc'],
      dom: 'Bfrtip',
      buttons: ['copy', 'print', 'excel']
    };
  }

  private data_sankey = [];

  // get result
  //get result
  drug_side: any = [];
  target_side: any = [];
  sendmsgjson:any = {}
  pla_com: any;
  com_pro: any;
  pro_dis: any;
  getDrugTargetResult() {
    this.sendmsgjson.length = 0;
    this.drug_side.length = 0;
    this.target_side.length = 0;
    if (this.dsInput == true) {
      if (this.pla_input_btn == true) {
        for (let i in this.plantFor) {
          this.drug_side.push(this.plantFor[i].name.substring(0, 11));
        }
        this.sendmsgjson = {plant: this.drug_side};
      }
      else {
        for (let i in this.compoundFor) {
          this.drug_side.push(this.compoundFor[i].name.substring(0, 11));
        }
        this.sendmsgjson = {compound: this.drug_side};
      }
      console.log(this.sendmsgjson);
      this.getResult();
    }
    if (this.tsInput == true) {
      if (this.pro_input_btn == true) {
        for (let i in this.proteinFor) {
          this.target_side.push(this.proteinFor[i].name.substring(0, 11));
        }
        this.sendmsgjson = {protein: this.target_side};
      }
      else {
        for (let i in this.diseaseFor) {
          this.target_side.push(this.diseaseFor[i].name.substring(0, 11));
        }
        this.sendmsgjson = {disease: this.target_side};
      }
      this.getResult();
    }
    if (this.dstsInput == true) {
      let helper_drug;
      let helper_target;
      if (this.pla_input_btn == true) {
        for (let i in this.plantFor) {
          this.drug_side.push(this.plantFor[i].name.substring(0, 11));
        }
        helper_drug = {plant: this.drug_side};
      }
      else {
        for (let i in this.compoundFor) {
          this.drug_side.push(this.compoundFor[i].name.substring(0, 11));
        }
        helper_drug = {compound: this.drug_side};
      }
      if (this.pro_input_btn == true) {
        for (let i in this.proteinFor) {
          this.target_side.push(this.proteinFor[i].name.substring(0, 11));
        }
        helper_target = {protein: this.target_side};
      }
      else {
        for (let i in this.diseaseFor) {
          this.target_side.push(this.diseaseFor[i].name.substring(0, 11));
        }
        helper_target = {disease: this.target_side};
      }
      this.sendmsgjson = {...helper_drug,...helper_target};
      this.getResult();
    }
  }

  result: any;
  getResult(){
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    const parseJson = JSON.stringify(this.sendmsgjson);
    console.log(parseJson);
    this.http.post<any>("http://api.vidner.engineer/graph_from_all", parseJson, httpOptions).toPromise().then(data => {
      this.result = data.data;
      console.log(data.data);
      if (this.result){
        console.log(this.result);

        this.filter();
        this.getSankey();
        this.getConnectivityTable();
        this.getMetaTable();
      }
    })

  }
  // end of get result
  filtermodel:any = 0.0;
  showmodals:boolean = false;

  filter(){

    const fil = this.filtermodel;
    const temp1 = Object.values(this.result.compound_similarity).filter(
      function(values: any) {
        return values[2] > fil;
      }
    );

    const temp_res_comcom = Object.values(temp1).map(
      function(values: any) {
        return values[0];
      }
    );
    const temp_res_comcom2 = Object.values(temp1).map(
      function(values: any) {
        return values[1];
      }
    );
    const temp_res_wait = Object.values(this.result.plant_vs_compound).map(
      function(values: any) {
        return values[1];
      }
    );
    const temp_res_wait2 = Object.values(this.result.compound_vs_protein).map(
      function(values: any) {
        return values[0];
      }
    );

    const temp_res_comcom_mix = temp_res_comcom.concat(temp_res_comcom2);

    const temp2 = Object.values(this.result.plant_vs_compound).filter(
      function(values:any){
        return temp_res_comcom_mix.includes(values[1]);
      }
    );
    const temp3 = Object.values(this.result.compound_vs_protein).filter(
      function(values:any){
        return temp_res_comcom_mix.includes(values[0]);
      }
    );

    const temp_res_compro = Object.values(temp3).map(
      function(values: any) {
        return values[1];
      }
    );

    const temp4 = Object.values(this.result.protein_vs_disease).filter(
      function(values:any){
        return temp_res_compro.includes(values[0]);
      }
    );
    console.log(temp3);
    console.log(temp4);
    console.log(temp2);
    console.log(temp1);
    console.log(temp_res_comcom);
    console.log(temp_res_comcom2);
    console.log(temp_res_compro);
    console.log(this.result.compound_vs_protein);

    this.result.compound_similarity = temp1;
    this.result.plant_vs_compound = temp2;
    this.result.compound_vs_protein = temp3;
    this.result.protein_vs_disease = temp4;
  }

  filtercallback(){
    // this.filtermodel = 0.8;
    this.openfilter();
    this.showresult = false;
    this.showload = true;
    this.getResult();
  }

  openfilter(){
    this.showmodals = !this.showmodals;
  }


  // show table ngIf
  private pla_com_btn: boolean = true;
  private com_pro_btn: boolean = false;
  private pro_dis_btn: boolean = false;
  private com_com_btn: boolean = false;

  pla_com_on() {
    this.pla_com_btn = true;
    this.com_pro_btn = false;
    this.pro_dis_btn = false;
    this.com_com_btn = false;
  }
  com_com_on() {
    this.pla_com_btn = false;
    this.com_pro_btn = false;
    this.pro_dis_btn = false;
    this.com_com_btn = true;
  }
  com_pro_on() {
    this.pla_com_btn = false;
    this.com_com_btn = false;
    this.com_pro_btn = true;
    this.pro_dis_btn = false;
  }
  pro_dis_on() {
    this.pla_com_btn = false;
    this.com_com_btn = false;
    this.com_pro_btn = false;
    this.pro_dis_btn = true;
  }
  // end of show table ngIf
  // end of show table ngIf


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
  }
  //end of links to gbif plant databases


  //summary score function & sankey diagram data

  private sankeyData: any;
  plaMeta_table:any;
  comMeta_table:any;
  proMeta_table:any;
  disMeta_table:any;
  plavscom_table: any;
  comvscom_table: any;
  comvspro_table: any;
  provsdis_table: any;
  len: any;
  showChart: boolean = false;
  // sankey function
  getSankey() {

    this.getSankeyData();
    this.sankeyData.push(["PLA", "COM", 0.0000000000000001]);
    this.sankeyData.push(["COM", "COM ", 0.0000000000000001]);
    this.sankeyData.push(["COM ", "PRO", 0.0000000000000001]);
    this.sankeyData.push(["PRO", "DIS", 0.0000000000000001]);
    console.log(this.sankeyData);

    this.len = this.sankeyData.length;
    if ((this.len / 2) * 30 > 4000) {
      this.len = 4000;
    } else {
      this.len = (this.len / 2) * 30;
    }
    // sankey diagram options
    var colors = ['#fcba03', '#fc0303', '#4afc03', '#03fcc2', '#03fcc2', '#03fcc2',
      '#030ffc', '#a903fc', '#e7fc03', '#33a02c', '#4afc03', '#03fcc2',
      '#fc036f', '#80fc03', '#03fcad', '#fcba03', '#fc0303', '#03fcc2',
      '#030ffc', '#a903fc', '#e7fc03', '#33a02c', '#4afc03', '#80fc03',
      '#fc036f', '#80fc03', '#03fcad', '#fcba03', '#fc0303', '#03fcc2',
      '#030ffc', '#a903fc', '#e7fc03', '#33a02c', '#03fcc2', '#fc036f',
      '#fc036f', '#80fc03', '#03fcad', '#fcba03', '#fc0303', '#4afc03',
      '#030ffc', '#a903fc', '#e7fc03', '#33a02c', '#4afc03', '#33a02c',
      '#fc036f', '#80fc03', '#03fcad', '#fcba03', '#fc0303', '#4afc03',
      '#030ffc', '#a903fc', '#e7fc03', '#33a02c', '#03fcc2', '#03fcad',
      '#fc036f', '#80fc03', '#03fcad', '#fcba03', '#fc0303', '#e7fc03',
      '#030ffc', '#a903fc', '#e7fc03', '#33a02c', '#4afc03', '#a903fc',
      '#fc036f', '#80fc03', '#03fcad', '#fcba03', '#fc0303', '#030ffc',
      '#030ffc', '#a903fc', '#e7fc03', '#33a02c', '#4afc03', '#030ffc',
      '#030ffc', '#a903fc', '#e7fc03', '#33a02c', '#4afc03', '#030ffc',
      '#fc036f', '#80fc03', '#03fcad', '#fcba03', '#fc0303', '#030ffc'];
    this.options = {
      sankey: {
        node: {
          colors: colors,
          width: 20,
          label: {
            fontSize: 10,
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
      height: this.len
    };
    this.showChart = true;
  }
  getSankeyData(){
    const temp_pla = this.plant_new;
    const temp_com = this.compound;
    const temp_pro = this.protein;
    const temp_dis = this.disease;

    console.log(this.result.plant_vs_compound[0]);
    const plavscom = Object.values(this.result.plant_vs_compound).map(
      function(values: any) {
        // const pla_side = values[0] +" | "+ temp_pla[values[0]].nlat;
        return [
          values[0] +" | "+ temp_pla[values[0]].nlat.substr(0, 10)+"..",
          values[1] +" | "+ temp_com[values[1]].npub,
          values[2]
       ];
      }
    );
    console.log(plavscom);
    const comvscom = Object.values(this.result.compound_similarity).map(
      function(values: any) {
        return [
          values[0] +" | "+ temp_com[values[0]].npub,
          values[1] +" | "+ temp_com[values[1]].npub,
          values[2]];
      }
    );
    console.log(comvscom);
    const comvspro = Object.values(this.result.compound_vs_protein).map(
      function(values: any) {
        return [
          values[0] +" | "+ temp_com[values[0]].npub,
          values[1] +" | "+ temp_pro[values[1]].name,
          values[2]
        ];
      }
    );
    const provsdis = Object.values(this.result.protein_vs_disease).map(
      function(values: any) {
        return [
          values[0] +" | "+ temp_pro[values[0]].name,
          values[1] +" | "+ temp_dis[values[1]].name,
          values[2]];
      }
    );
    console.log(provsdis);

    const provsdis2 = Object.values(this.result.protein_vs_disease).map(
      function(values: any) {
        return ["COM ", values[0] +" | "+ temp_pro[values[0]].name, 0.000000000000000001];
      }
    );
    const comvscom2 = Object.values(this.result.compound_similarity).map(
      function(values: any) {
        return ["PLA", values[0] +" | "+ temp_com[values[0]].npub, 0.0000000000000000001];
      }
    );
    const comvscom3 = Object.values(this.result.compound_similarity).map(
      function(values: any) {
        return [values[1] +" | "+ temp_com[values[1]].npub, "PRO", 0.0000000000000000001];
      }
    );
    console.log(provsdis);
    this.sankeyData = plavscom.concat(
      comvscom,
      comvspro,
      provsdis,
      provsdis2,
      comvscom2,
      comvscom3
    );

  }
  // meta Table
  getMetaTable(){
    const temp_pla = this.plant_new;
    const temp_com = this.compound;
    const temp_pro = this.protein;
    const temp_dis = this.disease;
    // plant meta
    const temp_placom = Object.values(this.result.plant_vs_compound).map(function (values:any) {
      return values[0];
    });
    const temp_placom_unique = temp_placom.filter(function(item, index){
      return temp_placom.indexOf(item) >= index;
    });
    console.log(temp_placom_unique);
    this.plaMeta_table = temp_placom_unique.map(
      function(key) {
        return{
          pla_id: key,
          pla_nlat: temp_pla[key].nlat,
          pla_nidr: temp_pla[key].nidr
        }
      }
    );

    //compund meta
    const temp_compro_1 = Object.values(this.result.compound_vs_protein).map(function (values:any) {
      return values[0];
    });
    const temp_placom_1 = Object.values(this.result.plant_vs_compound).map(function (values:any) {
      return values[1];
    });
    const temp_mix_com = temp_compro_1.concat(temp_placom_1);
    console.log(temp_mix_com);
    const temp_com_unique = temp_mix_com.filter(function(item, index){
      return temp_mix_com.indexOf(item) >= index;
    });
    this.comMeta_table = temp_com_unique.map(
      function(key){
        return {
          com_id: key,
          com_name: temp_com[key].npub,
          com_ccid: temp_com[key].ccid,
          com_npac: temp_com[key].npac
        }
      }
    );

    // protein meta
    const temp_compro = Object.values(this.result.compound_vs_protein).map(function (values:any) {
      return values[1];
    });
    const temp_compro_unique = temp_compro.filter(function(item, index){
      return temp_compro.indexOf(item) >= index;
    });
    console.log(temp_compro_unique);
    this.proMeta_table = temp_compro_unique.map(
      function(key) {
        return {
          pro_id: key,
          pro_name: temp_pro[key].name,
          pro_uab: temp_pro[key].uab
        }
      }
    );


    // disease meta
    const temp_prodis = Object.values(this.result.protein_vs_disease).map(function (values:any) {
      return values[1];
    });
    const temp_prodis_unique = temp_prodis.filter(function(item, index){
      return temp_prodis.indexOf(item) >= index;
    });
    console.log(temp_prodis_unique);
    this.disMeta_table = temp_prodis_unique.map(
      function(key) {
        return{
          dis_id: key,
          dis_name: temp_dis[key].name,
          dis_oid: temp_dis[key].oid,
          dis_uab: temp_dis[key].uab
        }
      }
    );
  }
  // connectivity table function
  pla_com_score:any;
  com_com_score:any;
  com_pro_score:any;
  pro_dis_score:any;
  totalScore:any;

  getConnectivityTable() {
    const temp_pla = this.plant_new;
    const temp_com = this.compound;
    const temp_pro = this.protein;
    const temp_dis = this.disease;

    let number0 = 0;
    let number1 = 0;
    let number2 = 0;
    let number3 = 0;

    this.plavscom_table = Object.values(this.result.plant_vs_compound).map(
      function(values: any) {
        return {
          pla_id: values[0],
          pla_nlat: temp_pla[values[0]].nlat,
          weight: values[2],
          com_id: values[1],
          com_npub: temp_com[values[1]].npub
        };
      }
    );
    this.comvscom_table = Object.values(this.result.compound_similarity).map(
      function(values: any) {
        return {
          com_id: values[0],
          com_npub: temp_com[values[0]].npub,
          weight: values[2],
          com_id2: values[1],
          com_npub2: temp_com[values[1]].npub,
        };
      }
    );
    this.comvspro_table = Object.values(this.result.compound_vs_protein).map(
      function(values: any) {
        return {
          com_id: values[0],
          com_npub: temp_com[values[0]].npub,
          weight: values[2],
          pro_id: values[1],
          pro_name: temp_pro[values[1]].name
        };
      }
    );
    this.provsdis_table = Object.values(this.result.protein_vs_disease).map(
      function(values: any) {
        return {
          pro_id: values[0],
          pro_name: temp_pro[values[0]].name,
          weight: values[2],
          dis_id: values[1],
          dis_name: temp_dis[values[1]].name
        };
      }
    );

    for(let i in this.plavscom_table){
       number0 += parseFloat(this.plavscom_table[i].weight);
    }
    this.pla_com_score = number0.toFixed(4);
    console.log(this.pla_com_score);

    for(let i in this.comvscom_table){
    number1 += parseFloat(this.comvscom_table[i].weight);
    }
    this.com_com_score = number1.toFixed(4);
    console.log(this.com_com_score);

    for(let i in this.comvspro_table){
      number2 += parseFloat(this.comvspro_table[i].weight);
    }
    this.com_pro_score = number2.toFixed(4);
    console.log(this.com_pro_score);

    for(let i in this.provsdis_table){
      number3 += parseFloat(this.provsdis_table[i].weight);
    }
    this.pro_dis_score = number3.toFixed(4);

    this.totalScore = (number0 + number1 + number2 + number3).toFixed(4);
    console.log(this.pro_dis_score);

    this.showload = false;
    this.showresult = true;
  }
  //end of summary score function & sankey diagram data


  // sankey diagram
  title = '';
  type = 'Sankey';
  columnNames = ['From', 'To', 'Weight'];
  options;
  // end of sankey diagram

  // slidervalue:any = 0.0;
}
