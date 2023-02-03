import { Component, ViewChild} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FacrureFormDialogComponent } from './facrure-form-dialog/facrure-form-dialog.component';
import { columns } from '../tools/columns';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as XLSX from 'xlsx';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { AgenceDialogComponent } from './agence-dialog/agence-dialog.component';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  columns = columns;
  invoice: any = [];
  dataSource: any = [];
  file: File;
	arrayBuffer: any;
  agenceList: string[] = [];

  displayedColumns: string[] = ['position', 'agence', 'dateFacture', 'numeroFacture', 'dateReception' , 'montantHT', 'TVA','montantRist',
  'montantNet','montantBrut','SHP','montantPPA','fournisseurs', 'delete'];
  
  searchForm = new FormGroup({
    startDate: new FormControl(''),
    endDate: new FormControl(''),
    agence: new FormControl(''),
    fournisseur: new FormControl('')
  });

  constructor(public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
			'delete',
			sanitizer.bypassSecurityTrustResourceUrl('assets/delete.svg'));
  }

  @ViewChild(MatTable) table: MatTable<Facturation>;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(JSON.parse(localStorage.getItem('config') as any));
    if(JSON.parse(localStorage.getItem('config') as any)) {
      this.invoice = JSON.parse(localStorage.getItem('config') as any);
    } else {
      this.invoice = [];
    }
    if(JSON.parse(localStorage.getItem('agenceList'))) {
      this.agenceList = JSON.parse(localStorage.getItem('agenceList'));
    }
	}

  ngAfterViewInit() {
   // this.dataSource.sort = this.sort;
  }

  returnFournisseurList() {
    return this.invoice.map((m: any) => m['fournisseurs']);
  }

  openDialog(type: string, element?: any): void {
    const facture = this.invoice.map((m: any) => m['numeroFacture']);
    if(type === "add") {
      const dialogRef = this.dialog.open(FacrureFormDialogComponent , { data: { facture: facture, autocomplete: this.agenceList , type: 'add' }, autoFocus: false} );
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if (result) {
          this.invoice.push(result)
          this.dataSource = new MatTableDataSource(this.invoice)
          localStorage.setItem('config', JSON.stringify(this.invoice));
        
          this.table.renderRows();
        }
      });
    }else { // update facture
      const dialogRef = this.dialog.open(FacrureFormDialogComponent, { data: { facture: facture, autocomplete: this.agenceList, data: element, type: 'update'}, autoFocus: false });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if (result) {
          this.invoice.find((f: any) => {
            if(f['id'] === result['id']) {
              f['agence'] = result['agence'];
              f['dateFacture'] = result['dateFacture'];
              f['numeroFacture'] = result['numeroFacture'];
              f['montantHT'] = result['montantHT'];
              f['dateReception'] = result['dateReception'];
              f['montantRist'] = result['montantRist'];
              f['TVA'] = result['TVA'];
              f['montantBrut'] = result['montantBrut'];
              f['SHP'] = result['SHP'];
              f['fournisseurs'] = result['fournisseurs'];
              f['bordreauxNumber'] = result['bordreauxNumber'];
              f['echeance'] = result['echeance'];
              f['marge'] = result['marge'];
              f['montantNet'] = result['montantNet'];
              f['montantPPA'] = result['montantPPA'];
            }
          })
          this.dataSource = new MatTableDataSource(this.invoice)
          localStorage.setItem('config', JSON.stringify(this.invoice));
          this.table.renderRows();
        }
      });
    }
  }

  openAgenceDialog() {
    const dialogRef = this.dialog.open(AgenceDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result && result.length) {
        console.log('result add agence', result)
        this.agenceList = _.uniq(_.concat(result, this.agenceList))
        localStorage.setItem('agenceList', JSON.stringify(this.agenceList));
      }
      console.log('agence', this.agenceList)
    });
  }

  delete(index: any) {
    const dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.invoice.splice(index, 1);
        localStorage.setItem('config', JSON.stringify(this.invoice));
        this.dataSource = new MatTableDataSource(this.invoice)
        this.table.renderRows();
      }
    });
  }

  printRecap() {
    const data = [...this.dataSource.filteredData];
    const recap = [];
    const grouped = _.groupBy(data, 'agence');
    recap.push(['Agence','Montant HT','Montant Net', 'Montant Brut','Montant PPA']);
    
    Object.keys(grouped).forEach(e => {
        const aon = grouped[e].map(p => p['montantHT']);
				const sumHT = _.reduce(aon, function(a, b) { return a + b; }, 0);

        const aonNet = grouped[e].map(p => p['montantNet']);
				const sumNet = _.reduce(aonNet, function(a, b) { return a + b; }, 0);

        const aonPPA = grouped[e].map(p => p['montantPPA']);
				const sumPPA = _.reduce(aonPPA, function(a, b) { return a + b; }, 0);

        const aonBrut = grouped[e].map(p => p['montantBrut']);
				const sumBrut = _.reduce(aonBrut, function(a, b) { return a + b; }, 0);

				recap.push([e,  sumHT, sumNet, sumBrut, sumPPA ])
		});

    const sumHT = _.reduce(<any>_.tail(recap.map(m => m[1])), function(a, b) { return a + b; }, 0);
    const sumNet = _.reduce(<any>_.tail(recap.map(m => m[2])), function(a, b) { return a + b; }, 0);
    const sumBrut= _.reduce(<any>_.tail(recap.map(m => m[3])), function(a, b) { return a + b; }, 0);
    const sumPPA = _.reduce(<any>_.tail(recap.map(m => m[4])), function(a, b) { return a + b; }, 0);
    recap.push(['Total',sumHT, sumNet, sumBrut, sumPPA])

		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(recap);
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
		
		XLSX.writeFile(wb, `recap.xlsx`);
  }

  getTotal(type: string) {
    if(this.dataSource.filteredData) {
      return this.dataSource.filteredData.map((t: any) => t[type]).reduce((acc: number, value: number) => +acc + +value, 0);
    } else {
      return 0;
    }
  }

  search() {
    const startDate = this.searchForm.controls['startDate'].value ? moment(this.searchForm.controls['startDate'].value).format('YYYY-MM-DD') : moment('1980-12-31').format("YYYY-MM-DD");
    const endDate = this.searchForm.controls['endDate'].value ? moment(this.searchForm.controls['endDate'].value).format('YYYY-MM-DD') : moment('9999-12-31').format("YYYY-MM-DD");
    const agence = this.searchForm.controls['agence'].value;
    const fournisseur = this.searchForm.controls['fournisseur'].value;

    const factures = [...this.invoice];
    let filterd: any[]= [];
    if(!this.searchForm.controls['startDate'].value && !this.searchForm.controls['endDate'].value && !this.searchForm.controls['agence'].value && !this.searchForm.controls['fournisseur'].value) {
      filterd = [...this.invoice]
    } else {
      factures.forEach(fac => {
        if(fac['dateFacture'] >= startDate && fac['dateFacture'] <= endDate) {
         if(!agence && !fournisseur) {
          filterd.push(fac)
         } else {
          if(fac['fournisseurs'] === fournisseur && fac['agence'] == agence) {
            filterd.push(fac)
          } else {
            if(!fournisseur && fac['agence'] == agence) {
              filterd.push(fac)
            }
            if(!agence && fac['fournisseurs'] === fournisseur) {
              filterd.push(fac)
            }
          }
         }
        } else {
          //
        }
      })
    }
    this.dataSource = new MatTableDataSource(filterd)
    this.table.renderRows();
  }

  reset() {
    // reinitialiser les formulaire
    this.searchForm.reset();
    this.dataSource = new MatTableDataSource(this.invoice)
    this.table.renderRows();
  }

  download() {
    const facture = [];
		this.invoice.forEach((f: any) => {
			facture.push([f['agence'],f['dateFacture'],f['numeroFacture'],f['dateReception'],+f['montantHT'],+f['TVA'],+f['montantRist'],
      +f['montantNet'],+f['montantBrut'],+f['SHP'],+f['montantPPA'],f['fournisseurs'],f['bordreauxNumber'],+f['marge'],f['echeance']])
		});
    facture.unshift(['Agence', 'Date Facture', 'N°Facture', 'Date Réception', 'Montant HT','T.V.A','Montant Rist','Montant Net',
        'Montant Brut','Shp','Montant PPA','FOURNISSEURS','BORDREAUX N°','MARGE','ECHEANCE']);
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(facture);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
    XLSX.writeFile(wb, `facturation.xlsx`);
  }

  upload(event: any) {
    this.file = event.target.files[0];
    console.log('file', this.file)
		if (this.file.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
			// this.snackBar.open('Wrong File Type', 'Ok', { duration : 7000 });
		} else {
			const fileReader = new FileReader();
			fileReader.onload = (e) => {
				const worksheet = this.readFile(fileReader);
				const arr = XLSX.utils.sheet_to_json(worksheet, {raw: true });
        const invoices : any[]= [];
        let i = 123;

        arr.forEach((el: any) => {
          console.log('elll', el['Agence'])
          const invoice = {
            id: new Date().getTime() + i++ ,
            agence: el['Agence'],
            dateFacture: el['Date Facture'],
            numeroFacture : el['N°Facture'],
            montantHT : el['Montant HT'],
            dateReception : el['Date Réception'],
            montantRist: el['Montant Rist'],
            TVA: el['T.V.A'],
            montantBrut: el['Montant Brut'],
            SHP: el['Shp'],
            fournisseurs: el['FOURNISSEURS'],
            bordreauxNumber: el['BORDREAUX N°'],
            echeance: el['ECHEANCE'],
            marge:el['MARGE'],
            montantNet: el['Montant Net'],
            montantPPA: el['Montant PPA']
          }
          invoices.push(invoice);
        })
        this.invoice = invoices;
        this.dataSource = new MatTableDataSource(this.invoice)
        localStorage.setItem('config', JSON.stringify(this.invoice));
        this.table.renderRows();
        location.reload();
			};
			fileReader.readAsArrayBuffer(this.file);
		}
  }

  readFile(fileReader: any) {
		this.arrayBuffer = fileReader.result;
		const data = new Uint8Array(this.arrayBuffer);
		const arr = new Array();
		for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }
		const bstr = arr.join('');
    
		const workbook = XLSX.read(bstr, {type: 'binary'});
		const first_sheet_name = workbook.SheetNames[0];
		return workbook.Sheets[first_sheet_name];
	}

}

export interface Facturation {
  agence: string | null;
  dateFacture: string| null;
  numeroFacture: string| null;
  montantHT: string| null
}
