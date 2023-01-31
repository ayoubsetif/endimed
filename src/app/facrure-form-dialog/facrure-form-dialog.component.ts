import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { formOptions } from '../../tools/columns';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-facrure-form-dialog',
  templateUrl: './facrure-form-dialog.component.html',
  styleUrls: ['./facrure-form-dialog.component.scss']
})
export class FacrureFormDialogComponent implements OnInit {

  FacureForm = new FormGroup({
    agence: new FormControl(''),
    dateFacture: new FormControl(''),
    numeroFacture: new FormControl('', [Validators.required, this.uniqueNameValidation(this.data.facture)]),
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
  agenceAutoComplete: string[] = [];
  filteredOptions: Observable<string[]>;
  
  constructor(
    public dialogRef: MatDialogRef<FacrureFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any ) {  }
  

  ngOnInit(): void {
    this.agenceAutoComplete = _.uniq(this.data.autocomplete);
  
    if(this.data.type === 'update') {
      this.FacureForm = new FormGroup({
        agence: new FormControl(this.data.data['agence']),
        dateFacture: new FormControl(this.data.data['dateFacture']),
        numeroFacture: new FormControl(this.data.data['numeroFacture'], [Validators.required, this.uniqueNameValidation(_.without(this.data.facture, this.data.data['numeroFacture']))]),
        montantHT: new FormControl(this.data.data['montantHT']),
        dateReception: new FormControl(this.data.data['dateReception']),
        montantRist: new FormControl(this.data.data['montantRist']),
        TVA: new FormControl(this.data.data['TVA'], [ Validators.required ]),
        montantBrut: new FormControl(this.data.data['montantBrut']),
        SHP: new FormControl(this.data.data['SHP']),
        fournisseurs: new FormControl(this.data.data['fournisseurs']),
        bordreauxNumber: new FormControl(this.data.data['bordreauxNumber'])
      });
    } else {
      //
    }
    this.filteredOptions = this.FacureForm.controls['agence'].valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  errorMessage() {
    if(this.FacureForm.controls['numeroFacture'].hasError('validateName')) {
      return 'déja existe'
    }
    else {
      return 'champs nécessaire'
    }
  }

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.agenceAutoComplete.filter(option => option.toLowerCase().includes(filterValue));
  }

  save() {
    return {
      id: this.data.data ? this.data.data['id'] : new Date().getTime(),
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

  uniqueNameValidation(names: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return !names.find((x) => x == control.value)
        ? null
        : {
            validateName: {
              valid: false,
            },
          };
    };
  }

}
