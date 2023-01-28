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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  columns = columns;
  invoice: any = [];
  dataSource: any = [];

  displayedColumns: string[] = ['position', 'agence', 'dateFacture', 'numeroFacture', 'dateReception' , 'montantHT', 'TVA','montantRist',
  'montantNet','montantBrut','SHP','montantPPA','fournisseurs','bordreauxNumber','marge','echeance', 'delete'];

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

  openDialog(): void {
    const dialogRef = this.dialog.open(FacrureFormDialogComponent);

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
  }

  delete(index: any) {
    this.invoice.splice(index, 1);
    localStorage.setItem('config', JSON.stringify(this.invoice));
    //this.dataSource = this.invoice;
    this.dataSource = new MatTableDataSource(this.invoice)
    this.table.renderRows();
  }

  getTotal(type: string) {
    return this.invoice.map((t: any) => t[type]).reduce((acc: number, value: number) => +acc + +value, 0);
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

}

export interface Facturation {
  agence: string | null;
  dateFacture: string| null;
  numeroFacture: string| null;
  montantHT: string| null
}
