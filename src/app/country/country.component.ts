import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
// import {countryService} from './country.c'

export class Country {
  constructor(
    public id: number,
    public countryName: string
  ) {
  }
}


@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css']
})
export class CountryComponent implements OnInit {

  countries: Country[] = [];
  closeResult: string | undefined;
  private baseApi = environment.baseApi;
  editForm!: FormGroup;
  private deleteId!: number;

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.getAllCountries();

    this.editForm = this.fb.group({
      id: [''],
      countryName: ['']
    });
  }


  getAllCountries() {
    this.httpClient.get<any>(`${this.baseApi}/rest/v2/countries`).subscribe(
      response => {
        console.log(response);
        this.countries = response;
      }
    );
  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(f: NgForm): void {
    // this.countryService.add
    const url = `${this.baseApi}/rest/v2/country/add`;
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit();
      });
    this.modalService.dismissAll();
  }

  openEdit(targetModel: any, country: Country){
    this.modalService.open(targetModel,{
      centered: true,
      backdrop: 'static',
      size: 'lg'
    });
    // @ts-ignore
    this.editForm.patchValue( {
      id: country.id,
      countryName: country.countryName
    });
  }

  onSave() {
    const editURL = `${this.baseApi}/rest/v2/country/update/`+ this.editForm.value.id;
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(targetModal: any, country: Country) {
    this.deleteId = country.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete() {
    const deleteURL = `${this.baseApi}/rest/v2/country/delete/` + this.deleteId;
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }
}
