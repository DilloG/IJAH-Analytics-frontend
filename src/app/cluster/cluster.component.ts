import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, merge } from 'rxjs';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {

  // typeahead
  public modelAnalg: any;
  public modelBacteri: any;
  public modelInflam: any;
  public modelActivity: any;
  public modelEfficacy: any;
  public modelTarget: any;

  searchInflam = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.compound_Infl.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

  searchAnalg = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.compound_Anal.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

  searchBacteri = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.compound_Bact.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

  @ViewChild('instanceEfficacy', { static: true }) instanceEfficacy: NgbTypeahead;
  focusEfficacy$ = new Subject<string>();
  clickEfficacy$ = new Subject<string>();
  searchEfficacy = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickEfficacy$.pipe(filter(() => !this.instanceEfficacy.isPopupOpen()));
    const inputFocus$ = this.focusEfficacy$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.compound_group
        : this.compound_group.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
    );
  }

  @ViewChild('instanceActivity', { static: true }) instanceActivity: NgbTypeahead;
  focusActiviy$ = new Subject<string>();
  clickActiviy$ = new Subject<string>();
  searchActivity = (text$: Observable<string>) => {
    const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
    const clicksWithClosedPopup$ = this.clickActiviy$.pipe(filter(() => !this.instanceActivity.isPopupOpen()));
    const inputFocus$ = this.focusActiviy$;

    return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
      map(term => (term === '' ? this.compound_subgroup
        : this.compound_subgroup.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 20))
    );
  }

  searchTarget = (text$: Observable<string>) => text$.pipe( //typeahead target
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.compound_target.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  )

  constructor(private http: HttpClient) { }
//end of ngbTypeahead

//button fro connectivity Table
 // show table ngIF for Metadata
  private pla_btn: boolean = true;
  private com_btn: boolean = false;
  private pro_btn: boolean = false;
  private dis_btn: boolean = false;
  com_meta_table = [];
  pro_meta_table = [];
  pla_meta_table = [];
  herb_meta_table = [];
  dis_meta_table = [];

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

  // show table ngIf
  private pla_com_btn: boolean = true;
  private com_pro_btn: boolean = false;
  private pro_dis_btn: boolean = false;
  private com_com_btn: boolean = false;
  con_plaCom = true;
  con_comPro = true;
  con_proDis = true;

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
  // end of show table ngIF for Metadata

  efficacy: any;
  compound_Anal: any = [];
  compound_Bact: any = [];
  compound_Infl: any = [];
  compound_subgroup: any = [];
  compound_group: any = [];
  compound_target: any = [];

  getEfficacy() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.get<any>("http://localhost:8000/efficacy", httpOptions).toPromise().then(data => {
      this.efficacy = data[0].data;
      console.log(this.efficacy);
      if (this.efficacy) {

        this.compound_group = Object.keys(this.efficacy.group).map(
          function(key) {
            return key;
          });
        console.log(this.compound_group);

        this.getAnalgesic();
        this.getAntiinflamatory();
        this.getAntibacterial();
      }
    });
    // console.log(this.compound_arr);
  }

  getAntiinflamatory() {
    var temp_compound = this.compound;
    this.compound_Infl = Object.values(this.efficacy.antiinflamatory).map(
      function(values) {
        var text = "";
        if(temp_compound[values].ccid !== null){
          text += (temp_compound[values].ccid) +" | ";
        }
        if(temp_compound[values].npub !== null){
          text += (temp_compound[values].npub)+" | ";
        }
        if(temp_compound[values].npac !== null){
          text += (temp_compound[values].npac)+" | ";
        }
        text += values;
        return text;
      }
    );
    console.log(this.compound_Infl);
  }
  getAntibacterial() {
    var temp_compound = this.compound;
    this.compound_Bact = Object.values(this.efficacy.antibacterial).map(
      function(values) {
        var text = "";
        if(temp_compound[values].ccid !== null){
          text += (temp_compound[values].ccid) +" | ";
        }
        if(temp_compound[values].npub !== null){
          text += (temp_compound[values].npub)+" | ";
        }
        if(temp_compound[values].npac !== null){
          text += (temp_compound[values].npac)+" | ";
        }
        text += values;
        return text;
      }
    );
    console.log(this.compound_Bact);
  }
  getAnalgesic() {
    var temp_compound = this.compound;
    this.compound_Anal = Object.values(this.efficacy.analgesic).map(
      function(values) {
        var text = "";
        if(temp_compound[values].ccid !== null){
          text += (temp_compound[values].ccid) +" | ";
        }
        if(temp_compound[values].npub !== null){
          text += (temp_compound[values].npub)+" | ";
        }
        if(temp_compound[values].npac !== null){
          text += (temp_compound[values].npac)+" | ";
        }
        text += values;
        return text;
      }
    );
    console.log(this.compound_Anal);
  }

  // get meta data
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
      console.log(this.compound["COM00021005"].npub);
      if (this.compound) {
        this.getEfficacy();
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

      }
    });
  }
  // end of getinput meta
  //end of get metadata

  public showload = false;
  public showresult = true;
  async predict() {
    // this.showload = true;
    // this.getDrugTargetResult();
    this.getResultMeta();
  }

  dtOptions: any = {};
  ngOnInit() {
    this.getPlantNewMeta();
    this.getDiseaseMeta();
    this.getProteinMeta();
    this.getCompoundMeta();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      processing: true,
      dom: 'Bfrtip',
      buttons: ['copy', 'print', 'excel']
    };
  }

  // get Result
  result: any;
  result_arr: any = [];
  getResultMeta() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    var postmsgcluster = JSON.stringify({
      analgesic: this.modelAnalg.substring(this.modelAnalg.length - 11),
      antibacterial: this.modelBacteri.substring(this.modelBacteri.length - 11),
      antiinflamamtory: this.modelInflam.substring(this.modelInflam.length - 11),
      target: this.modelTarget.substring(this.modelTarget.length - 11)
    });
    console.log(postmsgcluster);
    this.http.get<any>("http://localhost:8000/efficacy_result", httpOptions).toPromise().then(data => {
      this.result = data[0].data;
      console.log(this.result);
      if (this.result) {
        console.log(this.result);
        this.getSankey();
      }
    });
  }


  private sankeyData:any;
  getSankey(){
    this.sankeyData = this.result;
  }


  sankey_Data() {
    // console.log(this.pla_com);
  }

  clickedEfficacy: any;
  selectedEfficacy(item) {
    this.modelActivity = "";
    this.clickedEfficacy = item.item;
    console.log(this.efficacy.group[this.clickedEfficacy]);

    // jalanin fungsi
    this.compound_subgroup = Object.keys(this.efficacy.group[this.clickedEfficacy]).map(
      function(key) {
        return key;
      });
    console.log(this.compound_subgroup);
  }

  clickedActivity: any;
  selectedActivity(item) {
    this.clickedActivity = item.item;
    console.log(this.efficacy.group[this.clickedEfficacy][this.clickedActivity]);

    var temp_Activity = this.efficacy.group[this.clickedEfficacy][this.clickedActivity];
    var temp_compound = this.compound;
    this.compound_target = Object.values(temp_Activity).map(
      function(values) {
        var text = "";
        if(temp_compound[values].ccid !== null){
          text += (temp_compound[values].ccid) +" | ";
        }
        if(temp_compound[values].npub !== null){
          text += (temp_compound[values].npub)+" | ";
        }
        if(temp_compound[values].npac !== null){
          text += (temp_compound[values].npac)+" | ";
        }
        text += values;
        return text;
      });
    console.log(this.compound_target);

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
