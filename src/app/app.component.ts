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
import { config } from 'rxjs';

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

  displayedColumns: string[] = ['position', 'agence', 'dateFacture', 'numeroFacture', 'dateReception' , 'montantHT', 'TVA','montantRist',
  'montantNet','montantBrut','SHP','montantPPA','fournisseurs', 'delete'];

  constructor(public dialog: MatDialog, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
			'delete',
			sanitizer.bypassSecurityTrustResourceUrl('assets/delete.svg'));
  }

  @ViewChild(MatTable) table: MatTable<Facturation>;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.dataSource = new MatTableDataSource(JSON.parse(localStorage.getItem('config') as any))
    if(JSON.parse(localStorage.getItem('config') as any)) {
      this.invoice = JSON.parse(localStorage.getItem('config') as any);
    } else {
      this.invoice = [];
    }
	}

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  openDialog(type: string, element?: any): void {
    const agence = this.invoice.map((m: any) => m['agence']);
    if(type === "add") {
      const dialogRef = this.dialog.open(FacrureFormDialogComponent , { data: { autocomplete: agence , type: 'add' }, autoFocus: false} );
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed', result);
        if (result) {
          this.invoice.push(result)
          //this.dataSource = this.invoice;
          this.dataSource = new MatTableDataSource(this.invoice)
          localStorage.setItem('config', JSON.stringify(this.invoice));
        
          this.table.renderRows();
        }
      });
    }else { // update facture
      const dialogRef = this.dialog.open(FacrureFormDialogComponent, { data: { autocomplete: agence, data: element, type: 'update'}, autoFocus: false });
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

  getTotal(type: string) {
    return this.invoice.map((t: any) => t[type]).reduce((acc: number, value: number) => +acc + +value, 0);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
