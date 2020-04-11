import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-comsimilar',
  templateUrl: './comsimilar.component.html',
  styleUrls: ['./comsimilar.component.css']
})
export class ComsimilarComponent implements OnInit {


  constructor(private http: HttpClient) {
  }

  types:any;
    ngOnInit() {

    }

}
//
// {
//   "type": "conectivity",
//   "data": {
//     "plant": {
//       "latin_name": "Oryza Sativa",
//        "idr_name": "padi"
//      },
//     "compound": {
//       "drugbank_id": "DB009234",
//       "cas_id": "234324",
//       "pubchem_id": "",
//       "iupac_name": "2 metil hidroksida",
//       "pubchem_name": "asam mefenamat"
//     }
//   },
//   "contributor": {
//     "name": "rendi yuda",
//     "email": "rendi_yuda@apps.ipb.ac.id",
//     "affiliation": "IPB University"
//   },
//     "publication": {
//       "title": "truth behind coruna vairus",
//       "author": "leonardo jametin",
//       "year": "2020",
//       "journal": "Virus React vol.20",
//       "link": "simak.ipb.ac.id"
//     }
// }
