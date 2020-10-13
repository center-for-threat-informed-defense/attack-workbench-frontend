import { Component, OnInit } from '@angular/core';
import { Matrix } from 'src/app/classes/stix/matrix';
import { MatrixService } from 'src/app/services/stix/matrix/matrix.service';

@Component({
  selector: 'app-matrix-list',
  templateUrl: './matrix-list.component.html',
  styleUrls: ['./matrix-list.component.scss']
})
export class MatrixListComponent implements OnInit {

    public matrices: Matrix[] = [];

    constructor(private matrixService: MatrixService) { }

    ngOnInit() {
        this.matrices = this.matrixService.getAll();
    }
}