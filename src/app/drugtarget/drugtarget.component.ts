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

  constructor(private http: HttpClient) {
  }

  // for download images
  @ViewChild('screen', { static: false }) screen: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('downloadLink', { static: false }) downloadLink: ElementRef;
  downloadImage() {
    window.scrollTo(0, 0);
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'drugTarget_graph.png';
      this.downloadLink.nativeElement.click();
    });
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
  }

  // inialisasi variable untuk input field
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

  // fungsi menambahkan field inputant
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

  // fungsi menghapus field input
  removePlant(i: number) {
    if (this.addDrug_btn > 1) {
      this.plantFor.splice(i, 1);
      this.addDrug_btn -= 1;
      this.plaInputHoldersDisabled.splice(i,1);
      this.plantForm.splice(i,1);
      this.clickedItemPla -= 1;
    }else if(this.clickedItemPla == 1){
      this.plaInputHoldersDisabled.splice(i,1);
      this.plantForm.splice(i,1);
      this.plantFor[0].name="";
      this.clickedItemPla -= 1;
    }
  }
  removeCompound(i: number) {
    if (this.addDrug_btn > 1) {
      this.compoundFor.splice(i, 1);
      this.addDrug_btn -= 1;
      this.comInputHoldersDisabled.splice(i,1);
      this.compoundForm.splice(i,1);
      this.clickedItemCom -= 1;
    }else if(this.clickedItemCom == 1){
      this.comInputHoldersDisabled.splice(i,1);
      this.compoundForm.splice(i,1);
      this.compoundFor[0].name="";
      this.clickedItemCom -= 1;
    }
  }
  removeProtein(i: number) {
    if (this.addTarget_btn > 1) {
      this.proteinFor.splice(i, 1);
      this.addTarget_btn -= 1;
      this.proInputHoldersDisabled.splice(i,1);
      this.proteinForm.splice(i,1);
      this.clickedItemPro -= 1;
    }else if(this.clickedItemPro == 1){
      this.proInputHoldersDisabled.splice(i,1);
      this.proteinForm.splice(i,1);
      this.proteinFor[0].name="";
      this.clickedItemPro -= 1;
    }
  }
  removeDisease(i: number) {
    if (this.addTarget_btn > 1) {
      this.diseaseFor.splice(i, 1);
      this.addTarget_btn -= 1;
      this.disInputHoldersDisabled.splice(i,1);
      this.diseaseForm.splice(i,1);
      this.clickedItemDis -= 1;
    }else if(this.clickedItemDis == 1){
      this.disInputHoldersDisabled.splice(i,1);
      this.diseaseForm.splice(i,1);
      this.clickedItemDis -= 1;
    }
  }

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
      this.compoundForm.splice(0, this.compoundForm.length);
      this.comInputHoldersDisabled.splice(0, this.comInputHoldersDisabled.length);
      this.addDrug_btn -= this.addDrug_btn;
      this.clickedItemCom -= this.clickedItemCom;
      this.addCompound();
    }
    this.pla_input_btn = true;
    this.com_input_btn = false;
  }
  compound_input() {
    if (this.com_input_btn == false) {
      this.plantFor.splice(0, this.plantFor.length);
      this.plantForm.splice(0, this.plantForm.length);
      this.plaInputHoldersDisabled.splice(0, this.plaInputHoldersDisabled.length);
      this.addDrug_btn -= this.addDrug_btn;
      this.clickedItemPla -= this.clickedItemPla;
      this.addPlant()
    }
    this.pla_input_btn = false;
    this.com_input_btn = true;
  }
  protein_input() {
    if (this.pro_input_btn == false) {
      this.diseaseFor.splice(0, this.diseaseFor.length);
      this.proteinForm.splice(0, this.proteinForm.length);
      this.proInputHoldersDisabled.splice(0, this.proInputHoldersDisabled.length);
      this.addTarget_btn -= this.addTarget_btn;
      this.clickedItemPro -= this.clickedItemPro;
      this.addDisease()
    }
    this.pro_input_btn = true;
    this.dis_input_btn = false;
  }
  disease_input() {
    if (this.dis_input_btn == false) {
      this.proteinFor.splice(0, this.proteinFor.length);
      this.diseaseForm.splice(0, this.diseaseForm.length);
      this.disInputHoldersDisabled.splice(0, this.disInputHoldersDisabled.length);
      this.addTarget_btn -= this.addTarget_btn;
      this.clickedItemDis -= this.clickedItemDis;
      this.addProtein()
    }
    this.pro_input_btn = false;
    this.dis_input_btn = true;
  }

  // fungsi untuk reset input
  resetinput() {
    this.showresult = false;
    this.compound_input();
    this.protein_input();
    this.disease_input();
    this.plant_input();
  }

  // get plant meta
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
      if (this.plant_new) {
        // var t2 = performance.now();
        const nilai = this.plant_new;
        this.plant_new_arr = Object.keys(this.plant_new).map(
          function(key) {
            let nameidr;
            if(nilai[key].nidr != null){
              nameidr = nilai[key].nidr + " | ";
            } else{
              nameidr = "";
            }

            return nilai[key].nlat + " | " + nameidr + key;
          });
        console.log(this.plant_new_arr);
        // var t3 = performance.now();
        // console.log("Took: " + (t3 - t2) + "msecs");
      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailedLoad = true;
    });

  }

  // get compound meta
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
            return nilai[key].npub + " | " + nilai[key].npac + " | " + key;
          });
        console.log(this.compound_arr);
        var t3 = performance.now();
        console.log("Took: " + (t3 - t2) + "msecs");
        this.showloadFirst = false;
        this.showFailedLoad = false;
      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailedLoad = true;
    });
  }

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
      if (this.disease) {
        var nilai = this.disease;
        this.disease_arr = Object.keys(this.disease).map(
          function(key) {
            return nilai[key].oid + " | " + nilai[key].name + " | " + nilai[key].uab + " | " + key;
          });
        console.log(this.disease_arr);
      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailedLoad = true;
    });
  }

  // get protein meta
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
            return nilai[key].name + " | " + nilai[key].uid + " | " + nilai[key].uab + " | " + key;
          });
        console.log(this.protein_arr);
      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailedLoad = true;
    });
  }

  // ngbTypeahead
  public modelPla: any;
  public modelCom: any;
  public modelPro: any;
  public modelDis: any;
  searchPlant = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.plant_new_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );
  searchCompound = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.compound_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)));
  searchProtein = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.protein_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );
  searchDisease = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.disease_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

  // predict function saat tombol search diclick
  showresult: boolean = false;
  showload: boolean = false;
  showloadFirst: boolean = true;
  showFailedInput:boolean = false;
  async predict() {
    const clickedItem = this.clickedItemPro + this.clickedItemCom + this.clickedItemDis + this.clickedItemPla;
    this.showresult = false;
    if(clickedItem == 0){
      this.showFailedInput = true;
    }else{
        this.showload = true;
        this.filtermodel = 0.0;
        this.filtermodelMax = 1.0;
        this.getDrugTargetResult();
    }
  }

  closeInfo(){
    this.showFailedInput = false;
    this.showload = false;
  }

  // ngOnInit
  dtOptions: any = {};
  ngOnInit() {
    window.onbeforeunload = function() {
      window.scrollTo(0, 0);
    }
    // get meta on first load
    this.getPlantNewMeta();
    this.getDiseaseMeta();
    this.getProteinMeta();
    this.getCompoundMeta();

    // data tables configuration
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      order: [2, 'desc'],
      dom: 'Bfrtip',
      buttons: ['copy', 'print', 'excel']
    };
  }

  //fungsi untuk mengolah input kedalam format API
  drug_side: any = [];
  target_side: any = [];
  sendmsgjson: any = {}
  pla_com: any;
  com_pro: any;
  pro_dis: any;
  getDrugTargetResult() {
    this.sendmsgjson.length = 0;
    this.drug_side.length = 0;
    this.target_side.length = 0;
    if (this.dsInput == true) {
      if (this.pla_input_btn == true) {
        for (let i in this.plantForm) {
          this.drug_side.push(this.plantForm[i].name.substring(this.plantForm[i].name.length - 11));
        }
        this.sendmsgjson = { plant: this.drug_side };
      }
      else {
        for (let i in this.compoundForm) {
          this.drug_side.push(this.compoundForm[i].name.substring(this.compoundForm[i].name.length - 11));
        }
        this.sendmsgjson = { compound: this.drug_side };
      }
      console.log(this.sendmsgjson);
    }
    if (this.tsInput == true) {
      if (this.pro_input_btn == true) {
        for (let i in this.proteinForm) {
          this.target_side.push(this.proteinForm[i].name.substring(this.proteinForm[i].name.length - 11));
        }
        this.sendmsgjson = { protein: this.target_side };
      }
      else {
        for (let i in this.diseaseForm) {
          this.target_side.push(this.diseaseForm[i].name.substring(this.diseaseForm[i].name.length - 11));
        }
        this.sendmsgjson = { disease: this.target_side };
      }

    }
    if (this.dstsInput == true) {
      let helper_drug;
      let helper_target;
      if (this.pla_input_btn == true) {
        for (let i in this.plantForm) {
          this.drug_side.push(this.plantForm[i].name.substring(this.plantForm[i].name.length - 11));
        }
        helper_drug = { plant: this.drug_side };
      }
      else {
        for (let i in this.compoundForm) {
          this.drug_side.push(this.compoundForm[i].name.substring(this.compoundForm[i].name.length - 11));
        }
        helper_drug = { compound: this.drug_side };
      }
      if (this.pro_input_btn == true) {
        for (let i in this.proteinForm) {
          this.target_side.push(this.proteinForm[i].name.substring(this.proteinForm[i].name.length - 11));
        }
        helper_target = { protein: this.target_side };
      }
      else {
        for (let i in this.diseaseForm) {
          this.target_side.push(this.diseaseForm[i].name.substring(this.diseaseForm[i].name.length - 11));
        }
        helper_target = { disease: this.target_side };
      }
      this.sendmsgjson = { ...helper_drug, ...helper_target };

    }
    this.getResult();

  }

  // close error
  showFailed:boolean = false;
  showFailedLoad:boolean = false;
  closeError(){
    this.showFailed = false;
    this.showFailedLoad = false;
    this.showload = false;
  }

  //fungsi untuk mendapatkan hasil dari api
  showfiltermax: any;
  result: any;
  getResult() {
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
      if (this.result) {
        console.log(this.result);

        if (this.filtermodel > 0.000001 || this.filtermodelMax < 0.9999999) {
          this.filter();
        }
        this.showfilter = this.filtermodel;
        this.showfiltermax = this.filtermodelMax;
        this.getSankey();
        this.getConnectivityTable();
        this.getMetaTable();
      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailed = true;
    });

  }

  // fungsi untuk melakukan filter pada output
  filtermodel: any = 0.0;
  filtermodelMax: any = 1.0;
  showmodals: boolean = false;
  showfilter: any;
  filter() {

    const fil = this.filtermodel;
    const filmax = this.filtermodelMax;

    // find protein compound with similarity one
    // fltering the compound similarity
    const temp1 = Object.values(this.result.compound_similarity).filter(
      function(values: any) {
        return values[2] >= fil && values[2] <= filmax;
      }
    );

    // split compound values and mix in one array
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
    const temp_res_comcom_mix = temp_res_comcom.concat(temp_res_comcom2);

    // filtering the plant-compound and compound-protein base on temp1
    const temp2 = Object.values(this.result.plant_vs_compound).filter(
      function(values: any) {
        return temp_res_comcom_mix.includes(values[1]);
      }
    );
    const temp3 = Object.values(this.result.compound_vs_protein).filter(
      function(values: any) {
        return temp_res_comcom_mix.includes(values[0]);
      }
    );

    // filtering the link to protein
    const temp_res_compro = Object.values(temp3).map(
      function(values: any) {
        return values[1];
      }
    );
    const temp4 = Object.values(this.result.protein_vs_disease).filter(
      function(values: any) {
        return temp_res_compro.includes(values[0]);
      }
    );

    this.result.compound_similarity = temp1;
    this.result.plant_vs_compound = temp2;
    this.result.compound_vs_protein = temp3;
    this.result.protein_vs_disease = temp4;
  }

  //fungsi jika tombol apply filter dipanggil
  filtercallback() {

    this.openfilter();
    const scores = this.filtermodelMax - this.filtermodel;
    const film = parseFloat(this.filtermodel);
    const filmax = parseFloat(this.filtermodelMax);
    console.log(this.filtermodel, this.filtermodelMax);
    if (scores >= 0 && film >= 0 && film <= 1 && filmax >= 0 && filmax <= 1) {
      this.showresult = false;
      this.showload = true;
      this.getResult();
    } else {
      alert("Your Minimum Value bigger than Maximum Value OR Your Value bigger than 1 / smaller than 0");
    }
  }

  //fungsi untuk membuka modal view filter
  openfilter() {
    this.showmodals = !this.showmodals;
  }


  // show table ngIf for connectivity table btn
  public pla_com_btn: boolean = true;
  public com_pro_btn: boolean = false;
  public pro_dis_btn: boolean = false;
  public com_com_btn: boolean = false;
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


  // show table ngIF for Metadata btn
  public pla_btn: boolean = true;
  public com_btn: boolean = false;
  public pro_btn: boolean = false;
  public dis_btn: boolean = false;
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

  //summary score function & sankey diagram data
  public sankeyData: any;
  comtopro: any;
  len: any;
  showChart: boolean = false;
  temp_sankey: any;

  // parent sankey function
  getSankey() {

    // pushing sankey data value
    this.getSankeyData();
    this.sankeyData.push(["PLA", "COM", 0.0000000000000001, "Test"]);
    this.sankeyData.push(["COM", "PRO", 0.0000000000000001, "Test"]);
    this.sankeyData.push(["PRO", "DIS", 0.0000000000000001, "Test"]);

    // remove sankey duplicate
    this.temp_sankey = this.removeDuplicate(this.sankeyData);

    // sankey graph height
    this.len = this.sankeyData.length;
    if ((this.len / 3) * 30 > 4000) {
      this.len = 4000;
    } else {
      this.len = (this.len / 3) * 30;
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
      tooltip: {
        isHtml: true
      },
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

  // fungsi untuk mendapatkan data sankey
  getSankeyData() {
    const temp_pla = this.plant_new;
    const temp_com = this.compound;
    const temp_pro = this.protein;
    const temp_dis = this.disease;

    // ini fungsi untuk menyambungkan protein dengan compound
    this.trycompro();
    this.tryplapro();

    // ini untuk menggabungkan hasil
    this.comtopro = this.plavscomtopro.concat(this.comvscomtopro);

    //filter to remove lost connection
    const temp_ = Object.values(this.comtopro).map(
      function(values: any) {
        return values[0];
      }
    );
    const temp2 = Object.values(this.result.plant_vs_compound).filter(
      function(values: any) {
        return temp_.includes(values[1]);
      }
    );

    this.result.plant_vs_compound = temp2;

    //mapping hasil ke dalam format data sankey graf
    const plavscom = Object.values(this.result.plant_vs_compound).map(
      function(values: any) {
        let com_side;
        if (temp_com[values[1]].npub != null) {
          com_side = temp_com[values[1]].npub;
        }else if(temp_com[values[1]].ccid != null){
          com_side = temp_com[values[1]].ccid;
        }else if(temp_com[values[1]].pbid != null){
          com_side = temp_com[values[1]].pbid;
        }else{
          com_side = "null";
        }
        return [
          values[0] +" | "+ temp_pla[values[0]].nlat.substr(0, 10)+"..",
          values[1] +" | "+ com_side.substr(0, 10) + "..",
          values[2],
          values[0] +" | "+ temp_pla[values[0]].nlat +" -> "+
          values[1] +" | "+ com_side +"<br>Weight :"+
          values[2]
        ];
      }
    );
    const comvspro = Object.values(this.comtopro).map(
      function(values: any) {

        // compound if
        let com_side;
        if (temp_com[values[0]].npub != null) {
          com_side = temp_com[values[0]].npub;
        }else if(temp_com[values[0]].ccid != null){
          com_side = temp_com[values[0]].ccid;
        }else if(temp_com[values[0]].pbid != null){
          com_side = temp_com[values[0]].pbid;
        }else{
          com_side = "null";
        }

        // protein if
        let pro_side;
        if (temp_pro[values[1]].name != null) {
          pro_side = temp_pro[values[1]].name;
        }else{
          pro_side = "null";
        }

        // values if
        let scoreval;
        if(values[2]<1){
          scoreval = "Compound similarity with"
        }else{
          scoreval = "Actual Value"
        }

        // com similarity source
        let sim_side;
        if (temp_com[values[3]].npub != null) {
          sim_side = temp_com[values[3]].npub;
        }else if(temp_com[values[3]].ccid != null){
          sim_side = temp_com[values[3]].ccid;
        }else if(temp_com[values[3]].pbid != null){
          sim_side = temp_com[values[3]].pbid;
        }else{
          sim_side = "null";
        }

        return [
          values[0] + " | " + com_side.substr(0, 10) + "..",
          values[1] + " | " + pro_side.substr(0, 10) + "..",
          values[2],
          values[0] + " | " + com_side +" -> "+
          values[1] + " | " + pro_side +"<br>Weight :"+
          values[2] + " *" + scoreval +" "+ values[3] + " | " + sim_side
        ];
      }
    );
    const provsdis = Object.values(this.result.protein_vs_disease).map(
      function(values: any) {
        let pro_side;
        if (temp_pro[values[0]].name != null) {
          pro_side = temp_pro[values[0]].name;
        }
        return [
          values[0] +" | "+ pro_side.substr(0, 10) + "..",
          values[1] +" | "+ temp_dis[values[1]].name.substr(0, 10)+"..",
          values[2],
          values[0] +" | "+ pro_side +" -> "+
          values[1] +" | "+ temp_dis[values[1]].name +"<br>Weight :"+
          values[2]
        ];
      }
    );

    //menyambungkan konektivitas yang putus agar sesuai kolom
    const void_placom = Object.values(this.comtopro).map(
      function(values: any) {
        let com_side;
        if (temp_com[values[0]].npub != null) {
          com_side = temp_com[values[0]].npub;
        }else if(temp_com[values[0]].ccid != null){
          com_side = temp_com[values[0]].ccid;
        }else if(temp_com[values[0]].pbid != null){
          com_side = temp_com[values[0]].pbid;
        }else{
          com_side = "null";
        }
        return [
          "PLA",
          values[0] + " | " + com_side.substr(0, 10) + "..",
          0.0000000000000000001,
          "null"
        ];
      }
    );
    const void_compro = Object.values(this.comtopro).map(
      function(values: any) {
        let com_side;
        if (temp_com[values[0]].npub != null) {
          com_side = temp_com[values[0]].npub;
        }else if(temp_com[values[0]].ccid != null){
          com_side = temp_com[values[0]].ccid;
        }else if(temp_com[values[0]].pbid != null){
          com_side = temp_com[values[0]].pbid;
        }else{
          com_side = "null";
        }
        return [
          values[0] + " | " + com_side.substr(0, 10) + "..",
          "PRO",
          0.0000000000000000001,
          "null"
        ];
      }
    );
    const void_pla_compro = Object.values(this.result.plant_vs_compound).map(
      function(values: any) {
        let com_side;
        if (temp_com[values[1]].npub != null) {
          com_side = temp_com[values[1]].npub;
        }else if(temp_com[values[1]].ccid != null){
          com_side = temp_com[values[1]].ccid;
        }else if(temp_com[values[1]].pbid != null){
          com_side = temp_com[values[1]].pbid;
        }else{
          com_side = "null";
        }
        return [
          values[1] + " | " + com_side.substr(0, 10) + "..",
          "PRO",
          0.0000000000000000001,
          "null"
        ];
      }
    );

    // menggabungkan semua sankey connectivity
    this.sankeyData = plavscom.concat(
      comvspro,
      provsdis,
      void_placom,
      void_compro,
      void_pla_compro
    );

  }

  // ini fungsi untuk menghilangkan duplikasi dengan kecepatan penuh
  removeDuplicate(arr) {
    const seenNames = {};
    const nonDuplicate = arr.filter(function(currentObject) {
      if (JSON.stringify([currentObject[0],currentObject[1]]) in seenNames) {
        return false;
      } else {
        seenNames[JSON.stringify([currentObject[0],currentObject[1]])] = true;
        return true;
      }
    });
    return nonDuplicate
  }

  // fungsi untuk menyambungkan pla-com ke com-pro dengan key comsimilarity
  comvscomtopro: any;
  trycompro() {
    const c = [];
    const a = this.result.compound_vs_protein;
    const b = this.result.compound_similarity;
    a.forEach((arr1) => {
      b.forEach((arr2) => {
        if (arr2[1] == arr1[0]) {
          c.push([arr2[0], arr1[1], arr2[2], arr1[0]]);
          c.push([arr1[0], arr1[1], arr1[2], arr1[0]]);
        } else if (arr2[0] == arr1[0]) {
          c.push([arr2[1], arr1[1], arr2[2], arr1[0]]);
          c.push([arr1[0], arr1[1], arr1[2], arr1[0]]);
        }
      });
    });

    this.comvscomtopro = c;
    console.log(this.comvscomtopro);
  }

  // fungsi untuk menyambungkan com-com ke com-pro dengan key comsimilarity
  plavscomtopro: any;
  tryplapro() {
    const c = [];
    const a = this.result.plant_vs_compound;
    const b = this.result.compound_vs_protein;
    a.forEach((arr1) => {
      b.forEach((arr2) => {
        if (arr2[0] == arr1[1]) {
          c.push([arr1[1], arr2[1], arr2[2], arr2[0]]);
        }
      });
    });
    // this.plavscomtopro = c;
    // console.log(plavscom);
    let tmp = [];
    this.plavscomtopro = c.filter(function(v) {
      if (tmp.indexOf(v.toString()) < 0) {
        tmp.push(v.toString());
        return v;
      }
    });
    console.log(this.plavscomtopro);
  }

  errMsg:any;
  // meta Table
  plaMeta_table: any;
  comMeta_table: any;
  proMeta_table: any;
  disMeta_table: any;
  getMetaTable() {
    const temp_pla = this.plant_new;
    const temp_com = this.compound;
    const temp_pro = this.protein;
    const temp_dis = this.disease;

    // plant meta
    const temp_placom = Object.values(this.result.plant_vs_compound).map(function(values: any) {
      return values[0];
    });
    const temp_placom_unique = temp_placom.filter(function(item, index) {
      return temp_placom.indexOf(item) >= index;
    });
    console.log(temp_placom_unique);
    this.plaMeta_table = temp_placom_unique.map(
      function(key) {
        return {
          pla_id: key,
          pla_nlat: temp_pla[key].nlat,
          pla_nidr: temp_pla[key].nidr
        }
      }
    );

    //compund meta
    const temp_compro_1 = Object.values(this.comtopro).map(function(values: any) {
      return values[0];
    });
    const temp_com_unique = temp_compro_1.filter(function(item, index) {
      return temp_compro_1.indexOf(item) >= index;
    });
    this.comMeta_table = temp_com_unique.map(
      function(key) {
        return {
          com_id: key,
          com_name: temp_com[key].npub,
          com_ccid: temp_com[key].ccid,
          com_npac: temp_com[key].npac,
          com_ksid: temp_com[key].ksid,
          com_pbid: temp_com[key].pbid

        }
      });

    // protein meta
    const temp_compro = Object.values(this.result.compound_vs_protein).map(function(values: any) {
      return values[1];
    });
    const temp_compro_unique = temp_compro.filter(function(item, index) {
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
    const temp_prodis = Object.values(this.result.protein_vs_disease).map(function(values: any) {
      return values[1];
    });
    const temp_prodis_unique = temp_prodis.filter(function(item, index) {
      return temp_prodis.indexOf(item) >= index;
    });
    console.log(temp_prodis_unique);
    this.disMeta_table = temp_prodis_unique.map(
      function(key) {
        return {
          dis_id: key,
          dis_name: temp_dis[key].name,
          dis_oid: temp_dis[key].oid,
          dis_uab: temp_dis[key].uab
        }
      }
    );
  }

  // connectivity table function
  plavscom_table: any;
  comvscom_table: any;
  comvspro_table: any;
  provsdis_table: any;
  getConnectivityTable() {
    const temp_pla = this.plant_new;
    const temp_com = this.compound;
    const temp_pro = this.protein;
    const temp_dis = this.disease;

    // plantkesenyawa punya
    const temp_platocom = this.removeDuplicate(this.result.plant_vs_compound); //filtering
    this.plavscom_table = Object.values(temp_platocom).map(
      function(values: any) {
        let com_side;
        if (temp_com[values[1]].npub != null) {
          com_side = temp_com[values[1]].npub;
        }else if(temp_com[values[1]].ccid != null){
          com_side = temp_com[values[1]].ccid;
        }else if(temp_com[values[1]].pbid != null){
          com_side = temp_com[values[1]].pbid;
        }else{
          com_side = "null";
        }

        return {
          pla_id: values[0],
          pla_nlat: temp_pla[values[0]].nlat,
          weight: values[2],
          com_id: values[1],
          com_npub: com_side
        };
      }
    ); //mapping

    // senyawakeprotein punya
    const temp_comtopro = this.removeDuplicate(this.comtopro); //filtering
    this.comvspro_table = Object.values(temp_comtopro).map(
      function(values: any) {
        let com_side;
        if (temp_com[values[0]].npub != null) {
          com_side = temp_com[values[0]].npub;
        }else if(temp_com[values[0]].ccid != null){
          com_side = temp_com[values[0]].ccid;
        }else if(temp_com[values[0]].pbid != null){
          com_side = temp_com[values[0]].pbid;
        }else{
          com_side = "null";
        }
        return {
          com_id: values[0],
          com_npub: com_side,
          weight: values[2],
          pro_id: values[1],
          pro_name: temp_pro[values[1]].name
        };
      }); //mapping

    // proteinkedisease punya
    const temp_protodis = this.removeDuplicate(this.result.protein_vs_disease); //filtering
    this.provsdis_table = Object.values(temp_protodis).map(
      function(values: any) {
        return {
          pro_id: values[0],
          pro_name: temp_pro[values[0]].name,
          weight: values[2],
          dis_id: values[1],
          dis_name: temp_dis[values[1]].name
        };
      }); //mapping

    //kefungsi ambil total weight
    this.getTotalWeight();

    this.showload = false;
    this.showresult = true;
  }

  // fungsi untuk mendapatkan score untuk summary
  pla_com_score: any;
  com_com_score: any;
  com_pro_score: any;
  pro_dis_score: any;
  totalScore: any;
  getTotalWeight() {
    let number0 = 0;
    let number1 = 0;
    let number2 = 0;
    let number3 = 0;

    //get total weight placom
    for (let i in this.plavscom_table) {
      number0 += parseFloat(this.plavscom_table[i].weight);
    }
    this.pla_com_score = number0.toFixed(4);

    //get total weight compro
    for (let i in this.comvspro_table) {
      number2 += parseFloat(this.comvspro_table[i].weight);
    }
    this.com_pro_score = number2.toFixed(4);

    //get total weight prodis
    for (let i in this.provsdis_table) {
      number3 += parseFloat(this.provsdis_table[i].weight);
    }
    this.pro_dis_score = number3.toFixed(4);

    //get total weight all
    this.totalScore = (number0 + number1 + number2 + number3).toFixed(4);
    console.log(this.pro_dis_score);
  }

  // sankey diagram
  title = '';
  type = 'Sankey';
  columnNames = ['From', 'To', 'Weight', {'type': 'string', 'role': 'tooltip', 'p': {'html': true}}];
  options;


  //// TEMP:

  item:any;
  clickedItemPla:any = 0;
  clickedItemCom:any = 0;
  clickedItemPro:any = 0;
  clickedItemDis:any = 0;

  public plantForm: any[] = [];
  plaInputHoldersDisabled:any = [];
  selectedPlant(item, i){
    this.plaInputHoldersDisabled[i] = true;
    this.clickedItemPla += 1;
    this.plantForm.push({
      name: item.item
    });
    console.log(this.clickedItemPla);
  }

  public compoundForm: any[] = [];
  comInputHoldersDisabled:any = [];
  selectedCompound(item, i){
    this.comInputHoldersDisabled[i] = true;
    this.clickedItemCom += 1;
    this.compoundForm.push({
      name: item.item
    });
    console.log(this.clickedItemCom);
  }

  public diseaseForm: any[] = [];
  disInputHoldersDisabled:any = [];
  selectedDisease(item, i){
    this.disInputHoldersDisabled[i] = true;
    this.clickedItemDis += 1;
    this.diseaseForm.push({
      name: item.item
    });
    console.log(this.clickedItemDis);
  }

  public proteinForm: any[] = [];
  proInputHoldersDisabled:any = [];
  selectedProtein(item, i){
    this.proInputHoldersDisabled[i] = true;
    this.clickedItemPro += 1;
    this.proteinForm.push({
      name: item.item
    });
    console.log(this.clickedItemPro);
  }

}
