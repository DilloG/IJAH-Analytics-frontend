import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  // url
  public URL = environment.baseURL.admin;

  name:any;
  email:any;
  affiliation:any;
  subject:any;
  message:any;

  showFailed:boolean = false;
  showSuccess:boolean = false;
  closeError(){
    this.showFailed = false;
    this.showload = false;
  }

  fileUpload:any;
  closeSuccess(){
    this.showSuccess = false;
    this.showload = false;
    this.name="",
    this.email="",
    this.affiliation="",
    this.subject="",
    this.message=""
  }
    result:any;
    errMsg:any;
    showload:boolean = false;
  getResult() {
    this.showload = true;
    const httpOptions = {
      headers: new HttpHeaders({
        "X-Requested-With": "XMLHttpRequest",
        "Content-type": "application/json"
      })
    };

    const fd = {
      name: this.name,
      email: this.email,
      affiliation: this.affiliation,
      subject: this.subject,
      message: this.message
    }


    const sendMsgJson = JSON.stringify(fd);
    console.log(sendMsgJson);
    this.http.post<any>(this.URL+"/feedback", sendMsgJson, httpOptions).toPromise().then(data => {
      this.result = data;
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
