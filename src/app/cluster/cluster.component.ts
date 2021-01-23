import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, merge } from 'rxjs';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { Directive, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-cluster',
  templateUrl: './cluster.component.html',
  styleUrls: ['./cluster.component.css']
})
export class ClusterComponent implements OnInit {

  constructor(private http: HttpClient) { }

  // for download images
  @ViewChild('screen', { static: false }) screen: ElementRef;
  @ViewChild('canvas', { static: false }) canvas: ElementRef;
  @ViewChild('downloadLink', { static: false }) downloadLink: ElementRef;

  downloadImage() {
    html2canvas(this.screen.nativeElement).then(canvas => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'drugTarget_graph.png';
      this.downloadLink.nativeElement.click();
    });
    window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
  }
  //end for download images

  public URL = "http://api.vidner.engineer";

  // typeahead
  public modelAnalg: any;
  public modelBacteri: any;
  public modelInflam: any;
  public modelActivity: any;
  public modelEfficacy: any;
  public modelTarget: any;
  public selectedValue: any;
  searchInflam = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.compound_Infl.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );
  searchAnalg = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.compound_Anal.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );
  searchBacteri = (text$: Observable<string>) => text$.pipe( //typeahead drug
    debounceTime(200),
    distinctUntilChanged(),
    map(term => term.length < 1 ? []
      : this.compound_Bact.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  );

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
  );
  //end of ngbTypeahead

  //button fro connectivity Table
  // show table ngIF for Metadata
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

  // show table ngIf
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
  // end of show table ngIf
  // end of show table ngIF for Metadata

  efficacy: any;
  compound_Anal: any = [];
  compound_Bact: any = [];
  compound_Infl: any = [];
  compound_subgroup: any = [];
  compound_group: any = [];
  compound_target: any = [];

  // efficacy meta
  getEfficacy() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    this.http.get<any>(this.URL+"/efficacy", httpOptions).toPromise().then(data => {
      this.efficacy = data.data;
      //console.log(this.efficacy);
      if (this.efficacy) {

        this.compound_group = Object.keys(this.efficacy.group).map(
          function(key: string) {
            return key;
          });
        //console.log(this.compound_group);

        this.getAnalgesic();
        this.getAntiinflamatory();
        this.getAntibacterial();
        window.scrollTo(0, 0);
        this.showloadfirst = false;
      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailedLoad = true;
    });
    // //console.log(this.compound_arr);
  }
  getAntiinflamatory() {
    var temp_compound = this.compound;
    this.compound_Infl = Object.values(this.efficacy.antiinflammatory).map(
      function(values: string) {
        var text = "";
        if (temp_compound[values].ccid !== null) {
          text += (temp_compound[values].ccid) + " | ";
        }
        if (temp_compound[values].npub !== null) {
          text += (temp_compound[values].npub) + " | ";
        }
        if (temp_compound[values].npac !== null) {
          text += (temp_compound[values].npac) + " | ";
        }
        text += values;
        return text;
      }
    );
    //console.log(this.compound_Infl);
  }
  getAntibacterial() {
    var temp_compound = this.compound;
    this.compound_Bact = Object.values(this.efficacy.antibacterial).map(
      function(values: string) {
        var text = "";
        if (temp_compound[values].ccid !== null) {
          text += (temp_compound[values].ccid) + " | ";
        }
        if (temp_compound[values].npub !== null) {
          text += (temp_compound[values].npub) + " | ";
        }
        if (temp_compound[values].npac !== null) {
          text += (temp_compound[values].npac) + " | ";
        }
        text += values;
        return text;
      }
    );
    //console.log(this.compound_Bact);
  }
  getAnalgesic() {
    var temp_compound = this.compound;
    this.compound_Anal = Object.values(this.efficacy.analgesic).map(
      function(values: string) {
        var text = "";
        if (temp_compound[values].ccid !== null) {
          text += (temp_compound[values].ccid) + " | ";
        }
        if (temp_compound[values].npub !== null) {
          text += (temp_compound[values].npub) + " | ";
        }
        if (temp_compound[values].npac !== null) {
          text += (temp_compound[values].npac) + " | ";
        }
        text += values;
        return text;
      }
    );
    //console.log(this.compound_Anal);
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
    this.http.get<any>(this.URL+"/plant", httpOptions).toPromise().then(data => {
      this.plant_new = data.data;
      //console.log(this.plant_new);
      if (this.plant_new) {
      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailedLoad = true;
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
    this.http.get<any>(this.URL+"/compound", httpOptions).toPromise().then(data => {
      this.compound = data.data;
      //console.log(this.compound["COM00021005"].npub);
      if (this.compound) {
        this.getEfficacy();
      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailedLoad = true;
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
    this.http.get<any>(this.URL+"/disease", httpOptions).toPromise().then(data => {
      this.disease = data.data;
      //console.log(this.disease);
      if (this.disease) {

      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailedLoad = true;
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
    this.http.get<any>(this.URL+"/protein", httpOptions).toPromise().then(data => {
      this.protein = data.data;
      //console.log(this.protein);
      if (this.protein) {

      }
    }).catch(err => {
      console.log(err.message);
      this.errMsg = err.message;
      this.showFailedLoad = true;
    });
  }
  // end of getinput meta
  //end of get metadata

  // predict function
  public showload = false;
  public showresult = false;
  showloadfirst: boolean = true;
  showFailedInput:boolean = false;
  async predict() {
    this.showresult = false;
    if(this.clickedItem == 6){
      this.showload = true;
      this.filtermodel = 0.0;
      this.getResultMeta();
    }else{
      this.showFailedInput = true;
    }
  }



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
      dom: 'Bfrtip',
      buttons: ['copy', 'print', 'excel']
    };
  }

  // close error
  showFailed:boolean = false;
  showFailedLoad:boolean = false;
  closeError(){
    this.showFailed = false;
    this.showFailedLoad = false;
    this.showload = false;
  }

  closeInfo(){
    this.showFailedInput = false;
  }

  // get Result
  showfiltermax:any;
  result: any;
  result_arr: any = [];
  errMsg:any;
  getResultMeta() {
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest"
      })
    };
    const postmsgcluster = JSON.stringify(
      {
        analgesic: this.modelAnalg.substring(this.modelAnalg.length - 11),
        antibacterial: this.modelBacteri.substring(this.modelBacteri.length - 11),
        antiinflamamtory: this.modelInflam.substring(this.modelInflam.length - 11),
        target: this.modelTarget.substring(this.modelTarget.length - 11)
      }
  );
    //console.log(postmsgcluster);
    this.http.post<any>(this.URL+"/graph_from_compound", postmsgcluster, httpOptions).toPromise().then(data => {
      this.result = data.data;
      //console.log(this.result);
      if (this.result) {
        if(this.filtermodel > 0.000001 || this.filtermodelMax < 0.9999999){
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
  //
  filtermodel:any = 0.0;
  showmodals:boolean = false;
  filtermodelMax:any = 1.0;
  showfilter:any;

  filter(){

    const fil = this.filtermodel;
    const filmax = this.filtermodelMax;
    console.log(filmax);
    const temp1 = Object.values(this.result.compound_similarity).filter(
      function(values: any) {
        return values[2] >= fil && values[2] <= filmax;
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
    this.openfilter();
    const scores = this.filtermodelMax - this.filtermodel;
    const film = parseFloat(this.filtermodel);
    const filmax = parseFloat(this.filtermodelMax);
    console.log(this.filtermodel, this.filtermodelMax);
    if(scores >= 0 && film >= 0 && film <= 1 && filmax >= 0 && filmax <= 1){
      this.showresult = false;
      this.showload = true;
      this.getResultMeta();
    }else{
      alert("Your Minimum Value bigger than Maximum Value OR Your Value bigger than 1 / smaller than 0");
    }
  }

  openfilter(){
    this.showmodals = !this.showmodals;
  }


  public sankeyData: any;
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
    ////console.log(this.sankeyData);

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
      tooltip: { isHtml: true },
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

    ////console.log(this.result.plant_vs_compound[0]);
    const plavscom = Object.values(this.result.plant_vs_compound).map(
      function(values: any) {
		  let comcas;
            if(temp_com[values[1]].ccid != null){
              comcas = temp_com[values[1]].ccid + " | ";
            } else{
              comcas = "";
            }
		  let plaidr;
            if(temp_pla[values[0]].nidr != null){
              plaidr = temp_pla[values[0]].nidr + " | ";
            } else{
              plaidr = "";
            }
        return [
          plaidr + temp_pla[values[0]].nlat,
          comcas+ temp_com[values[1]].npub.substr(0, 10)+"..",
          values[2]
       ];
      }
    );
    ////console.log(plavscom);
    const comvscom = Object.values(this.result.compound_similarity).map(
      function(values: any) {
		  let comcasA;
            if(temp_com[values[0]].ccid != null){
              comcasA = temp_com[values[0]].ccid + " | ";
            } else{
              comcasA = "";
            }
		  let comcasB;
            if(temp_com[values[1]].ccid != null){
              comcasB = temp_com[values[1]].ccid + " | ";
            } else{
              comcasB = "";
            }
        return [
          comcasB + temp_com[values[1]].npub.substr(0, 10)+"..",
          comcasA + temp_com[values[0]].npub.substr(0, 10)+"..",
          values[2]
        ];
      }
    );
    ////console.log(comvscom);
    const comvspro = Object.values(this.result.compound_vs_protein).map(
      function(values: any) {
		  let prouid;
            if(temp_pro[values[1]].uid != null){
              prouid = temp_pro[values[1]].uid + " | ";
            } else{
              prouid = "";
            }
		  let comcas;
            if(temp_com[values[0]].ccid != null){
              comcas = temp_com[values[0]].ccid + " | ";
            } else{
              comcas = "";
            }
        return [
          comcas + temp_com[values[0]].npub.substr(0, 10)+"..",
          prouid + temp_pro[values[1]].name.substr(0, 10)+"..",
          values[2]
        ];
      }
    );
    ////console.log(comvspro);
    const provsdis = Object.values(this.result.protein_vs_disease).map(
      function(values: any) {
		  let prouid;
            if(temp_pro[values[0]].uid != null){
              prouid = temp_pro[values[0]].uid + " | ";
            } else{
              prouid = "";
            }
		  let disabbrv;
            if(temp_dis[values[1]].uab != null){
              disabbrv = temp_dis[values[1]].uab + " | ";
            } else{
              disabbrv = "";
            }
        return [
          prouid + temp_pro[values[0]].name.substr(0, 10)+"..",
          disabbrv + temp_dis[values[1]].name.substr(0, 10)+"..",
          values[2]
        ];
      }
    );

    const com2vspro = Object.values(this.result.compound_vs_protein).map(
      function(values: any) {
		  let prouid;
            if(temp_pro[values[1]].uid != null){
              prouid = temp_pro[values[1]].uid + " | ";
            } else{
              prouid = "";
            }
        return ["COM ",
        prouid + temp_pro[values[1]].name.substr(0, 10)+"..",
        0.00000000000000000000000000001];
      }
    );
	
    const plavscom2 = Object.values(this.result.compound_similarity).map(
      function(values: any) {
		  let comcas;
            if(temp_com[values[0]].ccid != null){
              comcas = temp_com[values[0]].ccid + " | ";
            } else{
              comcas = "";
            }
        return [
          "PLA",
          comcas + temp_com[values[0]].npub.substr(0, 10)+"..",
          0.00000000000000000000000000001
        ];
      }
    );
	
	const plavscom3 = Object.values(this.result.compound_similarity).map(
      function(values: any) {
		  let comcas;
            if(temp_com[values[1]].ccid != null){
              comcas = temp_com[values[1]].ccid + " | ";
            } else{
              comcas = "";
            }
        return [
          "PLA",
          comcas + temp_com[values[1]].npub.substr(0, 10)+"..",
          0.00000000000000000000000000001
        ];
      }
    );
	console.log(this.result.compound_similarity);
	const plavscom4 = Object.values(this.result.compound_similarity).map(
      function(values: any) {
		  let comcas;
            if(temp_com[values[0]].ccid != null){
              comcas = temp_com[values[0]].ccid + " | ";
            } else{
              comcas = "";
            }
        return [
          "COM",
          comcas + temp_com[values[0]].npub.substr(0, 10)+"..",
          0.00000000000000000000000000001
        ];
      }
    );


    ////console.log(provsdis);
    this.sankeyData = plavscom.concat(
      comvscom,
      comvspro,
      com2vspro,
      provsdis,
      plavscom2,
	  plavscom3,
	  plavscom4
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
    //console.log(temp_placom_unique);
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
    //console.log(temp_mix_com);
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
    //console.log(temp_compro_unique);
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
    //console.log(temp_prodis_unique);
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
          pro_name: temp_pro[values[1]].name,
          pro_uab: temp_pro[values[1]].uab
        };
      }
    );
    this.provsdis_table = Object.values(this.result.protein_vs_disease).map(
      function(values: any) {
        return {
          pro_id: values[0],
          pro_name: temp_pro[values[0]].name,
          pro_uab: temp_pro[values[0]].uab,
          weight: values[2],
          dis_id: values[1],
          dis_name: temp_dis[values[1]].name,
          dis_oid: temp_dis[values[1]].oid
        };
      }
    );

    for(let i in this.plavscom_table){
       number0 += parseFloat(this.plavscom_table[i].weight);
    }
    this.pla_com_score = number0.toFixed(4);
    //console.log(this.pla_com_score);

    for(let i in this.comvscom_table){
    number1 += parseFloat(this.comvscom_table[i].weight);
    }
    this.com_com_score = number1.toFixed(4);
    //console.log(this.com_com_score);

    for(let i in this.comvspro_table){
      number2 += parseFloat(this.comvspro_table[i].weight);
    }
    this.com_pro_score = number2.toFixed(4);
    //console.log(this.com_pro_score);

    for(let i in this.provsdis_table){
      number3 += parseFloat(this.provsdis_table[i].weight);
    }
    this.pro_dis_score = number3.toFixed(4);

    this.totalScore = (number0 + number1 + number2 + number3).toFixed(4);
    //console.log(this.pro_dis_score);

    this.showload = false;
    this.showresult = true;
  }

  clickedItem: number = 0;
  clickedEfficacy: any = "";
  selectedEfficacy(item) {
    this.modelActivity = "";
    this.clickedEfficacy = item.item;
    this.efficacyDisabled = true;
    this.clickedItem += 1;
    //console.log(this.efficacy.group[this.clickedEfficacy]);

    // jalanin fungsi
    this.compound_subgroup = Object.keys(this.efficacy.group[this.clickedEfficacy]).map(
      function(key: string) {
        return key;
      });
    //console.log(this.compound_subgroup);
  }

  clickedActivity: any = "";
  selectedActivity(item) {
    this.modelTarget = "";
    this.clickedActivity = item.item;
    this.activityDisabled = true;
    this.clickedItem += 1;
    //console.log(this.efficacy.group[this.clickedEfficacy][this.clickedActivity]);

    var temp_Activity = this.efficacy.group[this.clickedEfficacy][this.clickedActivity];
    var temp_compound = this.compound;
    this.compound_target = Object.values(temp_Activity).map(
      function(values: string) {
        var text = "";
        if (temp_compound[values].ccid !== null) {
          text += (temp_compound[values].ccid) + " | ";
        }
        if (temp_compound[values].npub !== null) {
          text += (temp_compound[values].npub) + " | ";
        }
        if (temp_compound[values].npac !== null) {
          text += (temp_compound[values].npac) + " | ";
        }
        text += values;
        return text;
      });
    //console.log(this.compound_target);

  }

  clickedTarget:any = "";
  selectedTarget(item){
    if(item){
      this.targetDisabled = true;
      this.clickedTarget = item.item;
      this.clickedItem += 1;
    }
  }

  // remove function
  removeAnalgesic(){
    this.modelAnalg = "";
    this.showresult = false;
    if(this.analgDisabled){
      this.analgDisabled = false;
      this.clickedItem -= 1;
    }
    console.log(this.clickedItem)
  }
  analgDisabled:boolean = false;
  selectedAnalg(event){
    if(event){
      this.analgDisabled = true;
      this.clickedItem += 1;
    }
  }

  removeAntibacterial(){
    this.modelBacteri = "";
    this.showresult = false;
    if(this.bacteriDisabled){
      this.bacteriDisabled = false;
      this.clickedItem -= 1;
    }
    console.log(this.clickedItem)
  }

  bacteriDisabled:boolean = false;
  selectedBacteri(event){
    if(event){
      this.bacteriDisabled = true;
      this.clickedItem += 1;
    }
  }

  removeAntiinflamatory(){
    this.modelInflam = "";
    this.showresult = false;
    if(this.inflamDisabled){
      this.inflamDisabled = false;
      this.clickedItem -= 1;
    }
    console.log(this.clickedItem)
  }
  inflamDisabled:boolean = false;
  selectedInflam(event){
    if(event){
      this.inflamDisabled = true;
      this.clickedItem += 1;
    }
  }

  activityDisabled:boolean = false;
  targetDisabled:boolean = false;
  efficacyDisabled:boolean = false;
  removeEfficacy(){
    this.modelEfficacy = "";
    this.clickedEfficacy= "";
    this.showresult = false;
    if(this.efficacyDisabled){
      this.efficacyDisabled = false;
      this.clickedItem -= 1;
    }

    if(this.activityDisabled){
      console.log(this.clickedItem);
      this.removeActivity();
    }
    console.log(this.clickedItem)
  }

  removeActivity(){
    this.modelActivity = "";
    this.clickedActivity = "";
    this.showresult = false;
    if(this.activityDisabled){
      this.activityDisabled = false;
      this.clickedItem -= 1;
    }

    if(this.targetDisabled){
      console.log(this.clickedItem);
      this.removeTarget();
    }
    console.log(this.clickedItem)
  }

  removeTarget(){
    this.modelTarget = "";
    this.showresult = false;
    if(this.targetDisabled){
      this.targetDisabled = false;
      this.clickedItem -= 1;
    }
    console.log(this.clickedItem)
  }


  // showWantReset:boolean = true;

  resetulang(){
    this.showresult = false;
    this.clickedActivity = "";
    this.clickedEfficacy= "";
    this.modelAnalg = "";
    this.modelBacteri = "";
    this.modelInflam = "";
    this.modelActivity = "";
    this.modelEfficacy = "";
    this.modelTarget = "";
    this.inflamDisabled = false;
    this.bacteriDisabled = false;
    this.analgDisabled = false;
    this.removeEfficacy();
    this.removeActivity();
    this.removeTarget();
    this.clickedItem -= this.clickedItem;
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
  //end of links to gbif plant databases


  // sankey diagram
  title = '';
  type = 'Sankey';
  columnNames = ['From', 'To', 'Weight'];
  options;
  // end of sankey diagram

}
