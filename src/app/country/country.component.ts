import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
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

    //call to the get all countries method and reload the form, it just like the refreshing the page
    this.getAllCountries();

    this.editForm = this.fb.group({
      id: [''],
      countryName: ['']
    });
  }


  getAllCountries() {
    this.httpClient.get<any>(`${this.baseApi}/rest/v2/countries`).subscribe(
      response => {

        //this console log used for the testing purposes
        //console.log(response);

        //load data to the country attributes that declared here
        this.countries = response;
      }
    );
  }

  //call when user wants to add new country to the list
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

  //when user click on onSubmit button it return the result set to this method
  onSubmit(f: NgForm): void {

    //send data set to backend through the url
    const url = `${this.baseApi}/rest/v2/country/add`;
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        //call to reloading method to refresh the page
        this.ngOnInit();
      });
    this.modalService.dismissAll();
  }

  //when user click on edit button this method loads data to the edit form
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

  //when user save the changers
  onSave() {
    const editURL = `${this.baseApi}/rest/v2/country/update/`+ this.editForm.value.id;
    this.httpClient.put(editURL, this.editForm.value)
      .subscribe((results) => {
        //call to reloading method to refresh the page
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  //when user click on delete button
  openDelete(targetModal: any, country: Country) {
    //get the id of the country which, user wants to delete
    this.deleteId = country.id;
    this.modalService.open(targetModal, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  //send the deleteId to backend through the url
  onDelete() {
    const deleteURL = `${this.baseApi}/rest/v2/country/delete/` + this.deleteId;
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        //call to reloading method to refresh the page
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }
}
