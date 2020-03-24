import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

type Plant_m = { id: string, name: string };
type Disease_m = { id: string, name: string };

@Component({
  selector: 'app-drugtarget',
  templateUrl: './drugtarget.component.html',
  styleUrls: ['./drugtarget.component.css']
})
export class DrugtargetComponent implements OnInit {


  constructor(private http: HttpClient) {
  }

// BAGIAN INPUT. BAGIAN INPUT
  addDrug_btn = 1;
  public plantFor: any[] = [{
    name: '',
  }];
  public compoundFor: any[] = [{
    name: '',
  }];

  addPlant() {
    if(this.addDrug_btn < 5){
        this.plantFor.push({
          name: '',
        });
        this.addDrug_btn += 1
    }
    console.log(this.addDrug_btn);
  }
  addCompound() {
  if(this.addDrug_btn < 5){
      this.compoundFor.push({
        name: '',
      });
      this.addDrug_btn += 1
    }
    console.log(this.addDrug_btn);
  }

  removePlant(i: number) {
      if(this.addDrug_btn > 0){
        this.plantFor.splice(i, 1);
        this.addDrug_btn -= 1;
      }
    }
  removeCompound(i: number) {
    if(this.addDrug_btn > 0){
      this.compoundFor.splice(i, 1);
      this.addDrug_btn -= 1;
    }
  }
  // end of input dynamic


  //show input
  public pla_input_btn = true;
  public com_input_btn = false;

  plant_input() {
    if(this.pla_input_btn == false){
      this.compoundFor.splice(0, this.compoundFor.length);
      this.addDrug_btn -= this.addDrug_btn;
      this.addCompound();
    }
    this.pla_input_btn = true;
    this.com_input_btn = false;
  }
  compound_input() {
    if(this.com_input_btn == false){
      this.plantFor.splice(0, this.plantFor.length);
      this.addDrug_btn -= this.addDrug_btn;
      this.addPlant()
    }
    this.pla_input_btn = false;
    this.com_input_btn = true;
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
    this.http.get<any>("http://localhost:8000/plant_meta", httpOptions).toPromise().then(data => {
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
        this.showloadFirst = false;
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
    this.http.get<any>("https://cors-anywhere.herokuapp.com/http://8718c92d.ngrok.io/api/compound", httpOptions).toPromise().then(data => {
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
  disease_arr: any;
  getDiseaseMeta() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.get<any>("https://cors-anywhere.herokuapp.com/http://8718c92d.ngrok.io/api/disease", httpOptions).toPromise().then(data => {
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
  protein_arr: any;
  getProteinMeta() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.get<any>("https://cors-anywhere.herokuapp.com/http://8718c92d.ngrok.io/api/protein", httpOptions).toPromise().then(data => {
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
  public modelDis: Disease_m;
  formatterDis = (disease: Disease_m) => disease.name;
  searchDisease = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 1),
    map(term => this.disease_arr.filter(disease => new RegExp(term, 'mi').test(disease.name)).slice(0, 10))
  )

  public modelPla: any;
  searchPlant = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.plant_new_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

  public modelCom: any;
  searchCompound = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.compound_arr.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)))
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
    // this.getDiseaseMeta();
    // this.getProteinMeta();
    // this.getCompoundMeta();

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
  postId;
  postDrugTarget() {
    // Simple POST request with a JSON body and response type <any>
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.post<any>('https://cors-anywhere.herokuapp.com/http://8718c92d.ngrok.io/api/graph', { "id": "PLA00000260" }, httpOptions).subscribe(data => {
      this.postId = data.data;
      if (this.postId) {
        console.log(this.postId);
        for (let i in this.postId) {
          this.data_sankey.push([this.postId[i][0], this.postId[i][1], parseFloat(this.postId[i][2])])
        }
      }

    })
  }

  // get result
  drug_side: any = [];
  pla_com: any;
  com_pro: any;
  pro_dis: any;
  getDrugTargetResult() {
    if(this.pla_input_btn == true){
      for (let i in this.plantFor) {
        this.drug_side.push({ index: i, value: this.plantFor[i].name.substring(0, 11) });
      }
    }
    else{
      for (let i in this.compoundFor) {
        this.drug_side.push({ index: i, value: this.compoundFor[i].name.substring(0, 11) });
      }
    }
    this.getPlaCom();
  }

  con_plaCom: any;
  com_arr: any = [];
  sankey_plaCom: any;
  getPlaCom() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    let disPostMsgJSON = JSON.stringify(this.drug_side);
    if (disPostMsgJSON) {
      this.drug_side.splice(0, this.drug_side.length);
    }
    console.log(disPostMsgJSON);
    this.http.post<any>('http://ijah.apps.cs.ipb.ac.id/api/connectivity.php', disPostMsgJSON, httpOptions).subscribe(data => {
      this.con_plaCom = data;
      console.log(this.con_plaCom);
      if (this.con_plaCom) {
        const temp_plaCom = this.con_plaCom;
        this.com_arr = this.con_plaCom.map(
          function(key){ return {comId: key.com_id} }
        );

        const temp_pla = this.plant_new; //temp_pla[key.pla_id].nlat
        const temp_com = this.compound; //temp_com[key.com_id].npub
        this.sankey_plaCom = this.con_plaCom.map(
          function(key){ return [key.pla_id,
           key.com_id,
           Number(key.weight)] }
        );
        // let x = (names) => names.filter((v,i) => names.indexOf(v) === i)
        console.log(this.sankey_plaCom);
        console.log(this.com_arr);

        // compro function
        this.getComPro();
        // this.sankeyData();
      }
    })
  }

  con_comPro: any;
  pro_arr: any = [];
  sankey_comPro: any;
  getComPro(){
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    let disPostComJSON = JSON.stringify(this.com_arr);
    console.log(disPostComJSON);
    this.http.post<any>('http://ijah.apps.cs.ipb.ac.id/api/connectivity.php',disPostComJSON, httpOptions).subscribe(data => {
        this.con_comPro = data;
        if(this.con_comPro){
          const temp_comPro = this.con_comPro;
          this.pro_arr = this.con_comPro.map(
            function(key){ return {value: key.pro_id} }
          );
          console.log(this.pro_arr);

          const temp_com = this.compound; //temp_pla[key.pla_id].nlat
          const temp_pro = this.protein; //temp_com[key.com_id].npub
          this.sankey_comPro = this.con_comPro.map(
            function(key){ return [key.com_id,
             key.pro_id,
             Number(key.weight)] }
          );

          this.getProDis();
        }
    })
  }

  con_proDis: any;
  sankey_proDis: any;
  getProDis(){
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    let disPostProJSON = JSON.stringify(this.pro_arr);
    console.log(disPostProJSON);
    this.http.post<any>('http://ijah.apps.cs.ipb.ac.id/api/connectivity.php',disPostProJSON, httpOptions).subscribe(data => {
        this.con_proDis = data;
        if(this.con_proDis){
          console.log(this.con_proDis);

          const temp_pro = this.protein; //temp_pla[key.pla_id].nlat
          const temp_dis = this.disease; //temp_com[key.com_id].npub
          this.sankey_proDis = this.con_proDis.map(
            function(key){ return [key.pro_id,
             key.dis_id,
             Number(key.weight)] }
          );
          console.log(this.sankey_proDis);
          this.sankeyData();
        }
    })
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
  sankeyData() {
    this.sankey_Data = this.sankey_proDis.concat(this.sankey_comPro, this.sankey_plaCom);
    console.log(this.sankey_Data.length);
  }
  //end of summary score function & sankey diagram data


  // sankey diagram
  title = '';
  type = 'Sankey';
  columnNames = ['From', 'To', 'Weight'];
  options = {
    sankey: {
      node: {
        width: 20,
        label: {
          fontSize: 9,
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
    height: 10 * 100
  };
  // end of sankey diagram



}
