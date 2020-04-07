import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import html2canvas from 'html2canvas';

type Plant_m = { id: string, name: string };
type Disease_m = { id: string, name: string };

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
    this.http.get<any>("http://localhost:8000/plant_json", httpOptions).toPromise().then(data => {
      this.plant_new = data[0].data;
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
    this.http.get<any>("http://localhost:8000/compound_json", httpOptions).toPromise().then(data => {
      this.compound = data[0].data;
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
    this.http.get<any>("http://localhost:8000/disease_json", httpOptions).toPromise().then(data => {
      this.disease = data[0].data;
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
    this.http.get<any>("http://localhost:8000/protein_json", httpOptions).toPromise().then(data => {
      this.protein = data[0].data;
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
    this.showresult = true;
    this.getDrugTargetResult();
  }
  // END OF BAGIAN INPUT!

  dtOptions: any = {};
  ngOnInit() {
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
  pla_com: any;
  com_pro: any;
  pro_dis: any;
  getDrugTargetResult() {
    this.drug_side.splice(0, this.drug_side.length);
    this.target_side.splice(0, this.target_side.length);
    if (this.dsInput == true) {
      if (this.pla_input_btn == true) {
        for (let i in this.plantFor) {
          this.drug_side.push({ index: i, value: this.plantFor[i].name.substring(0, 11) });
        }
      }
      else {
        for (let i in this.compoundFor) {
          this.drug_side.push({ index: i, value: this.compoundFor[i].name.substring(0, 11) });
        }
      }
      this.disPostMsgJSON = JSON.stringify(this.drug_side);
      this.getPlaCom();
    }
    if (this.tsInput == true) {
      if (this.pro_input_btn == true) {
        for (let i in this.proteinFor) {
          this.target_side.push({ index: i, value: this.proteinFor[i].name.substring(0, 11) });
        }
      }
      else {
        for (let i in this.diseaseFor) {
          this.target_side.push({ index: i, value: this.diseaseFor[i].name.substring(0, 11) });
        }
      }
      this.disPostProJSON = JSON.stringify(this.temp_meta_pro);
      this.getProDis();
    }
    if (this.dstsInput == true) {
      if (this.pro_input_btn == true) {
        for (let i in this.proteinFor) {
          this.target_side.push({ index: i, value: this.proteinFor[i].name.substring(0, 11) });
        }
      }
      else {
        for (let i in this.diseaseFor) {
          this.target_side.push({ index: i, value: this.diseaseFor[i].name.substring(0, 11) });
        }
      }

      if (this.pla_input_btn == true) {
        for (let i in this.plantFor) {
          this.drug_side.push({ index: i, value: this.plantFor[i].name.substring(0, 11) });
        }
      }
      else {
        for (let i in this.compoundFor) {
          this.drug_side.push({ index: i, value: this.compoundFor[i].name.substring(0, 11) });
        }
      }
      this.disPostMsgJSON = JSON.stringify(this.drug_side);
      this.disPostProJSON = JSON.stringify(this.target_side);
      // this.getPlaCom();
      // this.getProDis();
      console.log(this.disPostMsgJSON, this.disPostProJSON);
    }
  }


  con_plaCom: any;
  con_com_arr: any = [];
  temp_comId: any;
  sankey_plaCom: any;
  temp_meta_com = [{ index: 1, value: 'COM00008027' },
  { index: 2, value: 'COM00021005' },
  { index: 3, value: 'COM00009696' },
  { index: 4, value: 'COM00020511' }];
  temp_meta_pla = [{ index: 0, value: 'PLA00000007' },
  { index: 1, value: 'PLA00001504' },
  { index: 2, value: 'PLA00001838' },
  { index: 3, value: 'PLA00004093' },
  { index: 4, value: 'PLA00001600' }];
  temp_meta_pro = [{ index: 0, value : 'PRO00002168'},
            { index: 1, value : 'PRO00000061'},
            { index: 2, value : 'PRO00000261'},
            { index: 3, value : 'PRO00001836'}];
  disPostMsgJSON: any;
  placom_con_table: any;
  pla_meta_table:any;
  getPlaCom() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.post<any>('http://ijah.apps.cs.ipb.ac.id/api/connectivity.php', this.disPostMsgJSON, httpOptions).subscribe(data => {
      this.con_plaCom = data;
      console.log(this.con_plaCom);
      if (this.con_plaCom) {

        // sankey graph
        const temp_pla = this.plant_new; //temp_pla[key.pla_id].nlat
        const temp_com = this.compound; //temp_com[key.com_id].npub
        this.sankey_plaCom = this.con_plaCom.map(
          function(key) {
            return [temp_pla[key.pla_id].nlat,
            temp_com[key.com_id].npub,
            Number(key.weight)]
          }
        );

        //connectivity Table
        this.placom_con_table = this.con_plaCom.map(
          function(key) {
            return {
              pla_id: key.pla_id,
              pla_nlat: temp_pla[key.pla_id].nlat,
              pla_nidr: temp_pla[key.pla_id].nidr,
              weight: Number(key.weight),
              com_id: key.com_id,
              com_name: temp_com[key.com_id].npub,
              com_npac: temp_com[key.com_id].npac
            }
          }
        );

        //meta table
        var temp_conplaCom = this.con_plaCom.map(function (key) {
          return key.pla_id;
        });
        var temp_conplaCom_unique = temp_conplaCom.filter(function(item, index){
          return temp_conplaCom.indexOf(item) >= index;
        });
        this.pla_meta_table = temp_conplaCom_unique.map(
          function(key) {
            return{
              pla_id: key,
              pla_nlat: temp_pla[key].nlat,
              pla_nidr: temp_pla[key].nidr
            }
          }
        )

        console.log(this.sankey_plaCom);
        console.log(this.con_com_arr);

        this.getComId();
        this.switcherPlaCom();
      }
    })
  }

  switcherPlaCom(){
    if(this.dsInput == true){
      this.disPostComProJSON = JSON.stringify(this.temp_comId);
      this.getComPro();
    }
    if(this.tsInput == true){
      this.sankeyData();
    }
    if(this.dstsInput == true){
      this.disPostComProJSON = JSON.stringify(this.temp_comId);
      this.getComPro();
    }
  }
  getComId(){
      const temp_plaCom = this.con_plaCom;
      this.temp_comId = this.con_plaCom.map(
        function(key) { return { comId: key.com_id } }
      );
    }

  con_comPro: any;
  con_pro_arr: any = [];
  sankey_comPro: any;
  disPostComProJSON: any;
  compro_con_table:any;
  com_meta_table:any;
  pro_meta_table:any;
  getComPro() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };

    console.log(this.disPostComProJSON);
    this.http.post<any>('http://ijah.apps.cs.ipb.ac.id/api/connectivity.php', this.disPostComProJSON, httpOptions).subscribe(data => {
      this.con_comPro = data;
      if (this.con_comPro) {

        const temp_com = this.compound; //temp_pla[key.pla_id].nlat
        const temp_pro = this.protein; //temp_com[key.com_id].npub

        this.sankey_comPro = this.con_comPro.map(
          function(key) { return [
            temp_com[key.com_id].npub,
            key.pro_id,
            Number(key.weight)]
          }
        );

        this.compro_con_table = this.con_comPro.map(
          function(key) {
            return {
              com_id: key.com_id,
              com_name: temp_com[key.com_id].npub,
              com_npac:  temp_com[key.com_id].npac,
              weight: Number(key.weight),
              pro_id: key.pro_id,
              pro_name: temp_pro[key.pro_id].name,
              pro_uab: temp_pro[key.pro_id].uab
            }
          }
        );

        this.getcommeta();
        this.getprometa();
        this.getProValue();
        this.getComValue();
        this.switcherComPro();
      }
    })
  }

  switcherComPro(){
    if(this.dsInput == true){
      this.disPostProJSON = JSON.stringify(this.con_pro_arr);
      this.getProDis();
    }
    if(this.tsInput == true){
      this.disPostMsgJSON = JSON.stringify(this.con_com_arr);
      this.getPlaCom();
    }
  }
  getcommeta(){
    const temp_com = this.compound;
    if(this.dsInput == true){
      var temp_concomPro1 = this.con_plaCom.map(function (key) {
        return key.com_id;
      });
      var temp_concomPro1_unique = temp_concomPro1.filter(function(item, index){
        return temp_concomPro1.indexOf(item) >= index;
      });
      this.com_meta_table = temp_concomPro1_unique.map(
        function(key) {
          return{
            com_id: key,
            com_name: temp_com[key].npub,
            com_npac:  temp_com[key].npac
          }
        }
      );
    }
    if(this.tsInput == true){
      var temp_concomPro1 = this.con_comPro.map(function (key) {
        return key.com_id;
      });
      var temp_concomPro1_unique = temp_concomPro1.filter(function(item, index){
        return temp_concomPro1.indexOf(item) >= index;
      });
      this.com_meta_table = temp_concomPro1_unique.map(
        function(key) {
          return{
            com_id: key,
            com_name: temp_com[key].npub,
            com_npac:  temp_com[key].npac
          }
        }
      );
    }
  }
  getprometa(){
    const temp_pro = this.protein;
    if(this.tsInput == true){
      var temp_concomPro2 = this.con_proDis.map(function (key) {
        return key.pro_id;
      });
      var temp_concomPro2_unique = temp_concomPro2.filter(function(item, index){
        return temp_concomPro2.indexOf(item) >= index;
      });
      this.pro_meta_table = temp_concomPro2_unique.map(
        function(key) {
          return{
            pro_id: key,
            pro_name: temp_pro[key].name,
            pro_uab: temp_pro[key].uab
          }
        }
      );
    }
    if(this.dsInput == true){
      var temp_concomPro2 = this.con_comPro.map(function (key) {
        return key.pro_id;
      });
      var temp_concomPro2_unique = temp_concomPro2.filter(function(item, index){
        return temp_concomPro2.indexOf(item) >= index;
      });
      this.pro_meta_table = temp_concomPro2_unique.map(
        function(key) {
          return{
            pro_id: key,
            pro_name: temp_pro[key].name,
            pro_uab: temp_pro[key].uab
          }
        }
      );
    }
  }
  getProValue(){
    const temp_comPro = this.con_comPro;
    this.con_pro_arr = this.con_comPro.map(
      function(key) { return { value: key.pro_id } }
    );
    console.log(this.con_pro_arr);
  }
  getComValue(){
    const temp_comPro = this.con_comPro;
    this.con_com_arr = this.con_comPro.map(
      function(key) { return { value: key.com_id } }
    );
    console.log(this.con_com_arr);
  }

  con_proDis: any;
  sankey_proDis: any;
  disPostProJSON: any;
  dis_meta_table:any;
  getProDis() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    console.log(this.disPostProJSON);
    this.http.post<any>('http://ijah.apps.cs.ipb.ac.id/api/connectivity.php', this.disPostProJSON, httpOptions).subscribe(data => {
      this.con_proDis = data;
      if (this.con_proDis) {
        console.log(this.con_proDis);

        const temp_pro = this.protein; //temp_pla[key.pla_id].nlat
        const temp_dis = this.disease; //temp_com[key.com_id].npub
        this.sankey_proDis = this.con_proDis.map(
          function(key) {
            return [key.pro_id,
            key.dis_id,
            Number(key.weight)]
          }
        );


        var temp_conproDis = this.con_proDis.map(function (key) {
        	return key.dis_id;
        });
        var temp_conproDis_unique = temp_conproDis.filter(function(item, index){
        	return temp_conproDis.indexOf(item) >= index;
        });
        this.dis_meta_table = temp_conproDis_unique.map(
          function(key) {
            return{
              dis_id: key,
              dis_name: temp_dis[key].name,
              dis_uab: temp_dis[key].uab,
              dis_oid: temp_dis[key].oid
            }
          }
        )

        console.log(temp_conproDis_unique);

        this.getProId()
        this.switcherProDis();
      }
    })
  }

  switcherProDis(){
    if(this.dsInput == true){
      this.sankeyData();
    }
    if(this.tsInput == true){
      this.disPostComProJSON = JSON.stringify(this.temp_proId);
      this.getComPro();
    }
    if(this.dstsInput == true){
      this.disPostComProJSON = JSON.stringify(this.temp_proId);
      this.getComPro();
    }
  }

  temp_proId: any;
  getProId(){
    const temp_proDis = this.con_proDis;
    this.temp_proId = this.con_proDis.map(
      function(key) { return { proId: key.pro_id } }
    );
    console.log(this.con_pro_arr);
  }
  // end of get result

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
  }
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
    // compound remove duplicates
    for (i_com in this.pla_com) {
      let objTitle = this.pla_com[i_com]['com_pubchem_name'];
      com_unique[objTitle] = this.pla_com[i_com];
    }
    for (i_com in com_unique) {
      this.meta_com.push(com_unique[i_com]);
    }
    console.log(this.meta_com);
    // protein remove duplicates
    for (i_pro in this.pro_dis) {
      let objTitle = this.pro_dis[i_pro]['pro_name'];
      pro_unique[objTitle] = this.pro_dis[i_pro];
    }
    for (i_pro in pro_unique) {
      this.meta_pro.push(pro_unique[i_pro]);
    }
    console.log(this.meta_pro);
    // compound remove duplicates
    for (i_dis in this.pro_dis) {
      let objTitle = this.pro_dis[i_dis]['dis_name'];
      dis_unique[objTitle] = this.pro_dis[i_dis];
    }
    for (i_dis in dis_unique) {
      this.meta_dis.push(dis_unique[i_dis]);
    }
    console.log(this.meta_dis);
  }
  //end of remove duplicates in result


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
  private totalScore: any = 0;
  private pla_com_score: any = 0;
  private com_pro_score: any = 0;
  private pro_dis_score: any = 0;

  private sankey_Data = [];
  len;
  showChart: boolean = false;
  sankeyData() {
    console.log(this.sankey_Data.length);
    this.sankey_Data = this.sankey_proDis.concat(this.sankey_comPro, this.sankey_plaCom);
    if(this.dsInput == true){
      this.comNotPro();
      this.proNotDis();
    }
    if(this.tsInput == true){
      this.proNotCom();
      this.comNotPla();
    }
    this.sankey_Data.push(["PRO", "DIS", 0.0000000000000001]);
    this.sankey_Data.push(["COM", "PRO", 0.0000000000000001]);
    this.sankey_Data.push(["PLA", "COM", 0.0000000000000001]);
    console.log(this.sankey_Data);
    // size of output
    this.len = this.sankey_Data.length;
    if ((this.len / 2) * 30 > 2500) {
      this.len = 2700;
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

  comNotPro() {
    // fungsi untuk mencari com yang tidak punya link ke prot
    var t2 = performance.now();
    var compro = [];
    compro = this.con_comPro.map(
      function(key) { return key.com_id }
    );
    var compro2 = [];
    compro2 = this.temp_comId.filter(function(item) {
      return !compro.includes(item[0]);
    });
    var comNotPro = [];
    for (var i in compro2) {
      this.sankey_Data.push([this.compound[compro2[i].comId].npub, "PRO", 0.0000000000000001]);
      // console.log()
    }
    var t5 = performance.now();
    console.log("Took: " + (t5 - t2) + "msecs");

    console.log(this.con_comPro);
    console.log(compro);
    console.log(compro2);
  }
  proNotDis() {
    // fungsi untuk mencari com yang tidak punya link ke prot
        var t2 = performance.now();
        var compro = [];
        compro = this.con_proDis.map(
          function(key) { return key.pro_id }
        );
        var compro2 = [];
        compro2 = this.con_pro_arr.filter(function(item) {
          return !compro.includes(item[0]);
        });
        console.log(compro);
        console.log(compro2);
        for (var i in compro2) {
          this.sankey_Data.push([compro2[i].value, "DIS", 0.0000000000000001]);
          console.log(compro2[i].value);
        }
        var t5 = performance.now();
        console.log("Took: " + (t5 - t2) + "msecs");
  }
  proNotCom() {
    // fungsi untuk mencari com yang tidak punya link ke prot
    var t2 = performance.now();
    var compro = [];
    compro = this.con_comPro.map(
      function(key) { return key.pro_id }
    );
    var compro2 = [];
    compro2 = this.temp_proId.filter(function(item) {
      return !compro.includes(item[0]);
    });
    for (var i in compro2) {
      this.sankey_Data.push(["COM", compro2[i].proId, 0.0000000000000001]);
      console.log(compro2[i].proId);
    }
    var t5 = performance.now();
    console.log("Took: " + (t5 - t2) + "msecs");

  }
  comNotPla() {
    // this.con_com_arr

    var t2 = performance.now();
    var compro = [];
    compro = this.con_plaCom.map(
      function(key) { return key.com_id }
    );
    var compro2 = [];
    compro2 = this.con_com_arr.filter(function(item) {
      return !compro.includes(item[0]);
    });
    console.log(compro);
    console.log(compro2);
    for (var i in compro2) {
      this.sankey_Data.push(["PLA", this.compound[compro2[i].value].npub, 0.0000000000000001]);
      console.log(compro2[i].value);
    }
    var t5 = performance.now();
    console.log("Took: " + (t5 - t2) + "msecs");

  }
  //end of summary score function & sankey diagram data


  // sankey diagram
  title = '';
  type = 'Sankey';
  columnNames = ['From', 'To', 'Weight'];
  options;
  // end of sankey diagram



}
