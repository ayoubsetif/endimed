import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { formOptions } from '../../tools/columns';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

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
    echeance: new FormControl('')
  });
  formOptions = formOptions;

  constructor(
    public dialogRef: MatDialogRef<FacrureFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {

    }
  

  ngOnInit(): void { }

  save() {
    return {
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
      echeance: this.FacureForm.controls['echeance'].value,
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
