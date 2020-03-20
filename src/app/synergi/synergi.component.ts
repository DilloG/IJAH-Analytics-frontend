import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';

type Disease_m = {id: string, name: string};

@Component({
  selector: 'app-synergi',
  templateUrl: './synergi.component.html',
  styleUrls: ['./synergi.component.css']
})


export class SynergiComponent implements OnInit {

constructor(private http:HttpClient) { }

// table design
  public showload: boolean = false;
  public showresult: boolean = false;
  public buttonName: any = 'Show';
  public model_parse: any;

// prediction function
  async predict() {
    this.showload = true;
    this.getSynergiResult();
    // console.log(this.model);
  }

  // get syenrgi function
  synergi: any;
  getSynergiResult(){
    this.http.get<any>("http://localhost:3000/synergi_result").toPromise().then(data => {
      this.synergi = data;
      console.log(this.synergi);
      if(this.synergi){
        this.showload = false;
        this.showresult = true;
        // this.model_parse = this.model;
      }
    });
  }
  // end of get syenrgi function
  postId;

  dtOptions: any = {};
  ngOnInit() {
    // this.getDiseaseMeta();
    // this.getDiseaseMetaV2();
    this.getConV2();

    // oninit datatables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 15,
      processing: true,
      order: [4, 'desc'],
      dom: 'Bfrtip',
      buttons: [ 'copy','print','excel']
    };
  }
  //

  inputuser: any = [{index: 0, value: 'COM00004561'}];
  // searchFromDrug: boolean = false;
  // searchFromTarget: boolean = false
  // testing output drugtarget_post
  con_res: any;
  com_arr: any = [];
  getConV2(){
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    let disPostMsgJSON = JSON.stringify(this.inputuser);
    this.http.post<any>('http://ijah.apps.cs.ipb.ac.id/api/connectivity.php',disPostMsgJSON, httpOptions).subscribe(data => {
        this.con_res = data;
        console.log(this.con_res);
        if(this.con_res){
          for(let i in this.con_res){
            this.com_arr.push({comId: this.con_res[i].com_id})
          }
          this.getConComProV2();
        }
    })
  }

  com_pro: any;
  pro_arr: any = [];
  getConComProV2(){
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    let disPostComJSON = JSON.stringify(this.com_arr);
    console.log(disPostComJSON);
    this.http.post<any>('http://ijah.apps.cs.ipb.ac.id/api/connectivity.php',disPostComJSON, httpOptions).subscribe(data => {
        this.com_pro = data;
        if(this.com_pro){
          for(let i in this.com_pro){
            this.pro_arr.push({value: this.com_pro[i].pro_id})
          }
          console.log(this.pro_arr);
          this.getConProDisV2();
        }
    })
  }


  pro_dis: any;
  getConProDisV2(){
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    let disPostProJSON = JSON.stringify(this.pro_arr);
    console.log(disPostProJSON);
    this.http.post<any>('http://ijah.apps.cs.ipb.ac.id/api/connectivity.php',disPostProJSON, httpOptions).subscribe(data => {
        this.pro_dis = data;
        if(this.pro_dis){
          for(let i in this.pro_dis){
            // this.pro_arr.push({proId: this.com_pro[i].pro_id})
          }
          console.log(this.pro_dis);
        }
    })
  }


  // ijah v2 meta
  metaDis: any;
  getDiseaseMetaV2(){
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    let disPostMsgJSON = JSON.stringify([{id: 'PLA_ALL_ROWS'}]);
    this.http.post<any>('http://ijah.apps.cs.ipb.ac.id/api/metadata.php',disPostMsgJSON, httpOptions).subscribe(data => {
        this.metaDis = data;
        if(this.metaDis){
          console.log(this.metaDis);
          // for(let i in this.postId){
          //   this.data_sankey.push([this.postId[i][0], this.postId[i][1], parseFloat(this.postId[i][2])])
          // }
        }

    })
  }


  // for typeahead function and get
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
        // this.switchLoad();
        // this.showloadFirst = false;
      }
    });
  }

  public modelDis: Disease_m;
  formatterDis = (disease : Disease_m) => disease.name;
  searchDisease = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 1),
    map(term => this.disease_arr.filter(disease => new RegExp(term, 'mi').test(disease.name)).slice(0, 10))
  )

  // end of for typeahead
}
