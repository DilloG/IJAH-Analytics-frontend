import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

type Plant_m = {id: string, name: string};
type Disease_m = {id: string, name: string};

@Component({
  selector: 'app-drugtarget',
  templateUrl: './drugtarget.component.html',
  styleUrls: ['./drugtarget.component.css']
})
export class DrugtargetComponent implements OnInit {


  constructor(private http: HttpClient) {
  }

// BAGIAN INPUT. BAGIAN INPUT

<<<<<<< HEAD

  logValue() {
    if (this.pla_input_btn == true) {
      console.log(this.modelPla);
    }
    if (this.dis_input_btn == true) {
      console.log(this.modelDis);
    }
=======
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
>>>>>>> parent of c7c2c48... testo
  }
  // end of input dynamic

  //show input
  //show input
  public pla_input_btn = true;
  public dis_input_btn = false;

  plant_input() {
<<<<<<< HEAD
    this.pla_input_btn = true;
    this.dis_input_btn = false;
  }
  disease_input() {
    this.pla_input_btn = false;
=======
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
>>>>>>> parent of c7c2c48... testo
    this.dis_input_btn = true;
  }
  //endof show input

<<<<<<< HEAD

  // getinput meta

  showloadFirst: boolean = true;
  i_load = 0;
  switchLoad(){
    this.i_load += 1;
    if(this.i_load > 1){
      this.showloadFirst = false;
    }
  }

  plant_new: Object;
  public plant_new_arr: Plant_m[] = [];
  getPlantNewMeta(){
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.get<any>("https://cors-anywhere.herokuapp.com/http://8718c92d.ngrok.io/api/plant", httpOptions).toPromise().then(data => {
      this.plant_new = data.data;
      if (this.plant_new) {
        console.log(this.plant_new["PLA00000220"].nlat);
        // var i = 0;
        var n = Object.keys(this.plant_new).length;
        for (let i = 0; i < n; i++) {
            this.plant_new_arr.push(
              {
                id : Object.keys(this.plant_new)[i],
                name : this.plant_new[Object.keys(this.plant_new)[i]].nlat
              }
            );
        }
        console.log(this.plant_new_arr);
        // this.showloadFirst = false;
        this.switchLoad();
      }
    });

  }

  disease: Object;
  public disease_arr: Disease_m[] = [];
=======
  // getdisease meta
  // getdisease meta
  disease: any;
  disease_arr: any = [];

>>>>>>> parent of c7c2c48... testo
  getDiseaseMeta() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.get<any>("https://cors-anywhere.herokuapp.com/http://8718c92d.ngrok.io/api/disease", httpOptions).toPromise().then(data => {
      this.disease = data.data;
      if (this.disease) {
        console.log(this.disease["DIS00000007"].name);
        // // var i = 0;
        var d = Object.keys(this.disease).length;
        for (let i = 0; i < d; i++) {
            this.disease_arr.push(
              {
                id : Object.keys(this.disease)[i],
                name : this.disease[Object.keys(this.disease)[i]].oid +" | "+ this.disease[Object.keys(this.disease)[i]].name +" | "+ this.disease[Object.keys(this.disease)[i]].uab
              }
            );
        }
        console.log(this.disease_arr);
        this.switchLoad();
        // this.showloadFirst = false;
      }
    });
  }

  plant: any;
  plant_arr: any = [];
<<<<<<< HEAD
  plant_obj: any = {}; //dictionary have this
=======
>>>>>>> parent of c7c2c48... testo

  getPlantMeta() {
    this.http.get<any>("http://localhost:8000/plant").toPromise().then(data => {
      this.plant = data;
      console.log(this.plant[1].pla_name);
      if (this.plant) {
        for (var i = 0; i < this.plant.length; i++) {
          this.plant_arr.push(this.plant[i].pla_name);
        }

        //dictionary example
        for (var i = 0, emp; i < this.plant.length; i++) {
           emp = this.plant[i];
           this.plant_obj[emp.pla_id] = emp;
        }
        console.log(this.plant_obj); //important thing
        //end of dictionary example
      }
    });

  }

<<<<<<< HEAD


  protein: any;
  protein_arr: any = [];
  getProteinMeta() {
    this.http.get<any>("http://localhost:8000/protein").toPromise().then(data => {
      this.protein = data;
      console.log(this.protein[1].pro_name);
      if (this.protein) {
        for (var i = 0; i < this.protein.length; i++) {
          this.protein_arr.push(this.protein[i].pro_name);
        }
      }
    });
    console.log(this.protein_arr);
  }

  compound: any;
  compound_arr: any = [];
  getCompoundMeta() {
    this.http.get<any>("http://localhost:8000/compound").toPromise().then(data => {
      this.compound = data;
      console.log(this.compound[1].com_pubchem_name);
      if (this.compound) {
        for (var i = 0; i < this.compound.length; i++) {
          this.compound_arr.push(this.compound[i].com_pubchem_name);
        }
      }
    });
    console.log(this.compound_arr);
  }
  // end of getinput meta


  // ngbTypeahead

    public modelDis: Disease_m;
    formatterDis = (disease : Disease_m) => disease.name;
    searchDisease = (text$: Observable<string>) => text$.pipe(
=======
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
>>>>>>> parent of c7c2c48... testo
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 1),
      map(term => this.disease_arr.filter(disease => new RegExp(term, 'mi').test(disease.name)).slice(0, 10))
    )

<<<<<<< HEAD
    public modelPla: Plant_m;
    formatterPla = (plant : Plant_m) => plant.name;
    searchPlant = (text$: Observable<string>) => text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 1),
      map(term => this.plant_new_arr.filter(plant => new RegExp(term, 'mi').test(plant.name)).slice(0, 10))
    )
  //end of ngbTypeahead

=======
>>>>>>> parent of c7c2c48... testo

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

    this.getPlantNewMeta();
    this.getDiseaseMeta();
    this.getPlantMeta();
<<<<<<< HEAD
    this.getProteinMeta();
    this.getCompoundMeta();
    this.postDrugTarget();
=======
>>>>>>> parent of c7c2c48... testo

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      order: [1, 'desc'],
      dom: 'Bfrtip',
      buttons: ['copy', 'print', 'excel']
    };
  }

<<<<<<< HEAD
  private data_sankey = [];
  postId;
  postDrugTarget(){
        // Simple POST request with a JSON body and response type <any>
        const httpOptions = {
            headers: new HttpHeaders({
              "X-Requested-With": "XMLHttpRequest"
            })
          };
        this.http.post<any>('https://cors-anywhere.herokuapp.com/http://8718c92d.ngrok.io/api/graph',{"id":"PLA00000260"}, httpOptions).subscribe(data => {
            this.postId = data.data;
            if(this.postId){
              console.log(this.postId);
              for(let i in this.postId){
                this.data_sankey.push([this.postId[i][0], this.postId[i][1], parseFloat(this.postId[i][2])])
              }
            }

        })
  }

  // get result
=======
>>>>>>> parent of c7c2c48... testo
  drugtarget: any;
  pla_com: any;
  com_pro: any;
  pro_dis: any;
  getDrugTargetResult() {
    this.http.get<any>("http://localhost:8000/drugtarget_result").toPromise().then(data => {
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
      this.sankey_Data.push([this.plant_new[this.pla_com[i].pla_id].nlat, this.pla_com[i].com_pubchem_name, parseFloat(this.pla_com[i].weight)]);
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
    height: 10000
  };
  // width = 1000;
  // height = 400;




}
