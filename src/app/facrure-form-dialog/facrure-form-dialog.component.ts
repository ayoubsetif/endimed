import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { columns } from '../../tools/columns';
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
    montantNet: new FormControl(''),
    SHP: new FormControl(''),
    montantPPA: new FormControl(''),
    fournisseurs: new FormControl(''),
    bordreauxNumber: new FormControl(''),
    marge: new FormControl(''),
    echeance: new FormControl('')
  });
  columns = columns;

  constructor(
    public dialogRef: MatDialogRef<FacrureFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {

    }
  

  ngOnInit(): void {
  }

  save() {
    const facture = {
      agence: this.FacureForm.controls['agence'].value,
      dateFacture: this.FacureForm.controls['dateFacture'].value,
      numeroFacture: this.FacureForm.controls['numeroFacture'].value,
      dateReception: this.FacureForm.controls['dateReception'].value,
      montantHT: this.FacureForm.controls['montantHT'].value,
      TVA: this.FacureForm.controls['TVA'].value,
      montantRist: this.FacureForm.controls['montantRist'].value,
      montantNet: this.FacureForm.controls['montantNet'].value,
      montantBrut: this.FacureForm.controls['montantBrut'].value,
      SHP: this.FacureForm.controls['SHP'].value,
      montantPPA: this.FacureForm.controls['montantPPA'].value,
      fournisseurs: this.FacureForm.controls['fournisseurs'].value,
      bordreauxNumber: this.FacureForm.controls['bordreauxNumber'].value,
      marge: this.FacureForm.controls['marge'].value,
      echeance: this.FacureForm.controls['echeance'].value,
    }

    this.data = facture;
    //this.invoice.push(facture)
    //this.dataSource = this.invoice;
    //localStorage.setItem('config', JSON.stringify(this.invoice));
    
    //this.table.renderRows();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
