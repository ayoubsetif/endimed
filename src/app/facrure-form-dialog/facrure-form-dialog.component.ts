import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formOptions } from '../../tools/columns';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
  selector: 'app-facrure-form-dialog',
  templateUrl: './facrure-form-dialog.component.html',
  styleUrls: ['./facrure-form-dialog.component.scss']
})
export class FacrureFormDialogComponent implements OnInit {

  FacureForm = new FormGroup({
    agence: new FormControl(''),
    dateFacture: new FormControl(''),
    numeroFacture: new FormControl(''),
    montantHT: new FormControl(''),
    dateReception: new FormControl(''),
    montantRist: new FormControl(''),
    TVA: new FormControl('', [ Validators.required ]),
    montantBrut: new FormControl(''),
    SHP: new FormControl(''),
    fournisseurs: new FormControl(''),
    bordreauxNumber: new FormControl(''),
  });
  formOptions = formOptions;

  constructor(
    public dialogRef: MatDialogRef<FacrureFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {

    }
  

  ngOnInit(): void {
    if(this.data) {
      this.FacureForm = new FormGroup({
        agence: new FormControl(this.data['agence']),
        dateFacture: new FormControl(this.data['dateFacture']),
        numeroFacture: new FormControl(this.data['numeroFacture']),
        montantHT: new FormControl(this.data['montantHT']),
        dateReception: new FormControl(this.data['dateReception']),
        montantRist: new FormControl(this.data['montantRist']),
        TVA: new FormControl(this.data['TVA'], [ Validators.required ]),
        montantBrut: new FormControl(this.data['montantBrut']),
        SHP: new FormControl(this.data['SHP']),
        fournisseurs: new FormControl(this.data['fournisseurs']),
        bordreauxNumber: new FormControl(this.data['bordreauxNumber'])
      });
    }
  }

  

  save() {
    return {
      id: this.data ? this.data['id'] : new Date().getTime(),
      agence: this.FacureForm.controls['agence'].value,
      dateFacture: this.FacureForm.controls['dateFacture'].value,
      numeroFacture: this.FacureForm.controls['numeroFacture'].value,
      dateReception: this.FacureForm.controls['dateReception'].value,
      montantHT: this.FacureForm.controls['montantHT'].value,
      TVA: this.FacureForm.controls['TVA'].value,
      montantRist: this.FacureForm.controls['montantRist'].value,
      montantNet: ((+this.FacureForm.controls['montantHT'].value  + +this.FacureForm.controls['TVA'].value) - <any>+this.FacureForm.controls['montantRist'].value),
      montantBrut: this.FacureForm.controls['montantBrut'].value,
      SHP: this.FacureForm.controls['SHP'].value,
      montantPPA: <any>+this.FacureForm.controls['montantBrut'].value + +this.FacureForm.controls['SHP'].value,
      fournisseurs: this.FacureForm.controls['fournisseurs'].value,
      bordreauxNumber: this.FacureForm.controls['bordreauxNumber'].value,
      marge: (<any>+this.FacureForm.controls['montantBrut'].value + +this.FacureForm.controls['SHP'].value) / ((+this.FacureForm.controls['montantHT'].value as any  + +this.FacureForm.controls['TVA'].value) - <any>+this.FacureForm.controls['montantRist'].value),
      echeance: moment(this.FacureForm.controls['dateReception'].value).add(3, 'months').format('YYYY-MM-DD')
    } 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
