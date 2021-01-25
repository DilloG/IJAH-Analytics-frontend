import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-comsimilar',
  templateUrl: './comsimilar.component.html',
  styleUrls: ['./comsimilar.component.css']
})
export class ComsimilarComponent implements OnInit {


  constructor(private http: HttpClient) {
  }

  public URL = environment.baseURL.api;

  // get plant meta
  plant_new: Object;
  public plant_new_arr = [];
  getPlantNewMeta() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.get<any>(URL+"/plant", httpOptions).toPromise().then(data => {
      this.plant_new = data.data;
      if (this.plant_new) {
        const nilai = this.plant_new;
        this.plant_new_arr = Object.keys(this.plant_new).map(
          function(key) {
            return nilai[key].nlat + " | " + key;
          });
        console.log(this.plant_new_arr);
      }
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
    this.http.get<any>(this.URL+"/compound", httpOptions).toPromise().then(data => {
      this.compound = data.data;
      if (this.compound) {
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
        this.showloadFirst = false;
      }
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
    this.http.get<any>(this.URL+"/disease", httpOptions).toPromise().then(data => {
      this.disease = data.data;
      if (this.disease) {
        var nilai = this.disease;
        this.disease_arr = Object.keys(this.disease).map(
          function(key) {
            return nilai[key].oid + " | " + nilai[key].name + " | " + nilai[key].uab + " | " + key;
          });
        console.log(this.disease_arr);
      }
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
    this.http.get<any>(this.URL+"/protein", httpOptions).toPromise().then(data => {
      this.protein = data.data;
      if (this.protein) {
        var nilai = this.protein;
        this.protein_arr = Object.keys(this.protein).map(
          function(key) {
            return nilai[key].name + " | " + nilai[key].uid + " | " + nilai[key].uab + " | " + key;
          });
        console.log(this.protein_arr);
      }
    });
  }

  // ngbTypeahead
  public modelPla: any;
  public modelCom: any;
  public modelCom1: any;
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

  // input models
  contributor:any = {
    name: "",
    email: "",
    affiliation: ""
  }
  publication:any = {
    title: "",
    author: "",
    year: "",
    journal: "",
    link: ""
  }
  plantMetadata:any = {
    pla_name:"",
    pla_idr_name:""
  }
  compoundMetadata:any = {
    com_drugbank_id:"",
    com_knapsack_id:"",
    com_kegg_id:"",
    com_cas_id:"",
    com_smiles:"",
    com_pubchem_synonym:"",
    com_smiles_isomeric:"",
    com_smiles_canonical:"",
    com_pubchem_id:"",
    com_inchikey:"",
    com_iupac_name:"",
    com_pubchem_name:""
  }
  proteinMetadata:any = {
    pro_uniprot_id:"",
    pro_uniprot_abbrv:"",
    pro_name:"",
    pro_pdb_id:""
  }
  diseaseMetadata:any = {
    dis_omim_id:"",
    dis_uniprot_abbrv:"",
    dis_name:""
  }
    // ngOnInit
    ngOnInit() {
      // get meta on first load
      this.getPlantNewMeta();
      this.getDiseaseMeta();
      this.getProteinMeta();
      this.getCompoundMeta();
    }

    // open input type
    openConnectivity:boolean = true;
    openMetadata:boolean = false;
    typeConnectivity(){
      this.openConnectivity = true;
      this.openMetadata = false;
    }
    typeMetadata(){
      this.openConnectivity = false;
      this.openMetadata = true;
    }

    // open input subtype Connectivity
    plaConnectivity:boolean = true;
    comConnectivity:boolean = true;
    com1Connectivity:boolean = false;
    proConnectivity:boolean = false;
    disConnectivity:boolean = false;
    placomConnectivity(){
      this.plaConnectivity = true;
      this.comConnectivity = true;
      this.com1Connectivity = false;
      this.proConnectivity = false;
      this.disConnectivity = false;
    }
    comcomConnectivity(){
      this.plaConnectivity = false;
      this.comConnectivity = true;
      this.com1Connectivity = true;
      this.proConnectivity = false;
      this.disConnectivity = false;
    }
    comproConnectivity(){
      this.plaConnectivity = false;
      this.comConnectivity = true;
      this.com1Connectivity = false;
      this.proConnectivity = true;
      this.disConnectivity = false;
    }
    prodisConnectivity(){
      this.plaConnectivity = false;
      this.comConnectivity = false;
      this.com1Connectivity = false;
      this.proConnectivity = true;
      this.disConnectivity = true;
    }

    // open input subtype Metadata
    plaMetadata:boolean = true;
    comMetadata:boolean = false;
    proMetadata:boolean = false;
    disMetadata:boolean = false;
    plaMetadataOpen(){
      this.plaMetadata = true;
      this.comMetadata = false;
      this.proMetadata = false;
      this.disMetadata = false;
    }
    comMetadataOpen(){
      this.plaMetadata = false;
      this.comMetadata = true;
      this.proMetadata = false;
      this.disMetadata = false;
    }
    proMetadataOpen(){
      this.plaMetadata = false;
      this.comMetadata = false;
      this.proMetadata = true;
      this.disMetadata = false;
    }
    disMetadataOpen(){
      this.plaMetadata = false;
      this.comMetadata = false;
      this.proMetadata = false;
      this.disMetadata = true;
    }


    // submit form function
    data:any = {};
    sendMsgJson = {};
    sendForm(){
      let type;
      if(this.openConnectivity){
        type = "connectivity";
        if(this.plaConnectivity){
          this.data = {
            plant:{
              pla_id: this.modelPla.substring(this.modelPla.length - 11)
            },
            compound:{
              com_id: this.modelCom.substring(this.modelCom.length - 11)
            }
          }
        }
        else if(this.com1Connectivity){
          this.data = {
            compound:{
              com_id: this.modelCom.substring(this.modelCom.length - 11)
            },
            compound1:{
              com_id: this.modelCom1.substring(this.modelCom1.length - 11)
            }
          }
        }
        else if(this.proConnectivity && this.comConnectivity){
          this.data = {
            compound:{
              com_id: this.modelCom.substring(this.modelCom.length - 11)
            },
            protein:{
              pro_id: this.modelPro.substring(this.modelPro.length - 11)
            }
          }
        }
        else if(this.disConnectivity){
          this.data = {
            protein:{
              pro_id: this.modelPro.substring(this.modelPro.length - 11)
            },
            disease:{
              dis_id: this.modelDis.substring(this.modelDis.length - 11)
            }
          }
        }
      } else if(this.openMetadata){
        type = "metadata";
        if(this.plaMetadata){
          this.data = {
            plant: this.plantMetadata
          }
        }else if(this.comMetadata){
          this.data = {
            compound: this.compoundMetadata
          }
        }else if(this.proMetadata){
          this.data = {
            protein: this.proteinMetadata
          }
        }else if(this.disMetadata){
          this.data = {
            disease: this.diseaseMetadata
          }
        }
      }

      this.sendMsgJson = {
        type: type,
        data: this.data,
        contributor: this.contributor,
        publication: this.publication
      }
      console.log(this.sendMsgJson);
    }

    // file onFileSelected
    selectedFile = null;
    onFileSelected(e){
      this.selectedFile = e.target.files[0];
      console.log(this.selectedFile);
    }

    showFailed:boolean = false;
    showSuccess:boolean = false;
    showloadFirst:boolean = true;
    showload:boolean = false;

    closeError(){
      this.showFailed = false;
      this.showload = false;
    }

    fileUpload:any;
    closeSuccess(){
      this.showSuccess = false;
      this.showload = false;
      this.contributor = {
        name: "",
        email: "",
        affiliation: ""
      }
      this.publication = {
        title: "",
        author: "",
        year: "",
        journal: "",
        link: ""
      }
      this.plantMetadata = {
        pla_name:"",
        pla_idr_name:""
      }
      this.compoundMetadata = {
        com_drugbank_id:"",
        com_knapsack_id:"",
        com_kegg_id:"",
        com_cas_id:"",
        com_smiles:"",
        com_pubchem_synonym:"",
        com_smiles_isomeric:"",
        com_smiles_canonical:"",
        com_pubchem_id:"",
        com_inchikey:"",
        com_iupac_name:"",
        com_pubchem_name:""
      }
      this.proteinMetadata = {
        pro_uniprot_id:"",
        pro_uniprot_abbrv:"",
        pro_name:"",
        pro_pdb_id:""
      }
      this.diseaseMetadata = {
        dis_omim_id:"",
        dis_uniprot_abbrv:"",
        dis_name:""
      }
      this.modelPla = "";
      this.modelCom= "";
      this.modelCom1= "";
      this.modelPro= "";
      this.modelDis= "";
      this.fileUpload="";
    }

    onUpload(){
      this.showload = true;
      this.sendForm();
      const fd = new FormData();
      fd.append('pdf', this.selectedFile, this.selectedFile.name);
      fd.append('data',  JSON.stringify(this.sendMsgJson));
      console.log(fd);
     this.getResult(fd);
    }

    errMsg:any;
    result:any;
    getResult(fd) {
      const httpOptions = {
        headers: new HttpHeaders({
          "X-Requested-With": "XMLHttpRequest"
        })
      };
      this.http.post<any>(this.URL+"/contribute", fd, httpOptions).toPromise().then(data => {
        this.result = data;
        // console.log(data);
        if (this.result) {
          console.log(this.result);
          this.showSuccess = true;
		  this.showload = false;
        }
      }).catch(err => {
        console.log(err.message);
        this.errMsg = err.message;
        this.showFailed = true;
		this.showload = false;
      });

    }

}
