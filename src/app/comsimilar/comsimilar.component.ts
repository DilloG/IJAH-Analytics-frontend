import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

type Plant_m = {id: string, name: string};
type Disease_m = {id: string, name: string};

@Component({
  selector: 'app-comsimilar',
  templateUrl: './comsimilar.component.html',
  styleUrls: ['./comsimilar.component.css']
})
export class ComsimilarComponent implements OnInit {


  constructor(private http: HttpClient) {
  }

// BAGIAN INPUT. BAGIAN INPUT


  logValue() {
    if (this.pla_input_btn == true) {
      console.log(this.modelPla);
    }
    if (this.dis_input_btn == true) {
      console.log(this.modelDis);
    }
  }
  // end of input dynamic


  //show input
  public pla_input_btn = true;
  public dis_input_btn = false;

  plant_input() {
    this.pla_input_btn = true;
    this.dis_input_btn = false;
  }
  disease_input() {
    this.pla_input_btn = false;
    this.dis_input_btn = true;
  }
  //endof show input


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
  plant_obj: any = {}; //dictionary have this
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
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 1),
      map(term => this.disease_arr.filter(disease => new RegExp(term, 'mi').test(disease.name)).slice(0, 10))
    )

    public modelPla: Plant_m;
    formatterPla = (plant : Plant_m) => plant.name;
    searchPlant = (text$: Observable<string>) => text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      filter(term => term.length >= 1),
      map(term => this.plant_new_arr.filter(plant => new RegExp(term, 'mi').test(plant.name)).slice(0, 10))
    )
  //end of ngbTypeahead


  showresult: boolean = false;
  showload: boolean = false;

  async predict() {
    this.showresult = true;
    // this.logValue();
    // console.log(this.model);
  }
// BAGIAN INPUT, END OF BAGIAN INPUT!

  dtOptions: any = {};
  ngOnInit() {

    this.getPlantNewMeta();
    this.getDiseaseMeta();
    this.getPlantMeta();
    this.getProteinMeta();
    this.getCompoundMeta();
    this.postDrugTarget();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      order: [1, 'desc'],
      dom: 'Bfrtip',
      buttons: ['copy', 'print', 'excel']
    };
  }

  // postinput user
  private data_result = [];
  postId;
  postDrugTarget(){
        // Simple POST request with a JSON body and response type <any>
        const httpOptions = {
            headers: new HttpHeaders({
              "X-Requested-With": "XMLHttpRequest"
            })
          };
        this.http.post<any>('https://cors-anywhere.herokuapp.com/http://8718c92d.ngrok.io/api/graph',{"id":"PLA00000200"}, httpOptions).subscribe(data => {
            this.postId = data.data;
            if(this.postId){
              console.log(this.postId);
              for(let i in this.postId){
                this.data_result.push({
                  parent: this.postId[i][0],
                  child: this.postId[i][1],
                  similarity: parseFloat(this.postId[i][2])
                })
              }
              console.log(this.data_result);
              this.predict();
            }

        })
  }
  // end of postinput user
// 260
  // get result
  // end of get result

  // show table ngIf
  // end of show table ngIf


  // show table ngIF for Metadata
  // end of show table ngIF for Metadata

  //remove duplicates in result
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
  //end of summary score function & sankey diagram data


  // sankey diagram
  // end of sankey diagram



}
