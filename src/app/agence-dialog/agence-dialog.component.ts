import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-agence-dialog',
  templateUrl: './agence-dialog.component.html',
  styleUrls: ['./agence-dialog.component.scss']
})
export class AgenceDialogComponent implements OnInit {
  agence = new FormControl('');
  agences: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  add() {
    this.agences.push(this.agence.value)
    this.agence.reset();
  }

  save() {
    return this.agences;
  }

}
