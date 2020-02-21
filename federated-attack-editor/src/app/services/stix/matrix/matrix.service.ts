import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StixService } from '../stix.service';
import { Matrix } from 'src/app/classes/stix/matrix';

@Injectable({
  providedIn: 'root'
})
export class MatrixService extends StixService {

    private matrices: Matrix[] = [];

    constructor(private http: HttpClient) {
        super();
    }

    public get(stix_id: string, refresh = false): Matrix {
        return this.matrices.filter((matrix) => matrix.stixID == stix_id)[0];
    }
    
    public getAll(refresh = false): Matrix[] {
        this.http.get(this.domainData['enterprise']).subscribe(data => {
            let matrices = data['objects'].filter((o) => o.type === 'x-mitre-matrix');
            for(let matrix of matrices) {
                let m = new Matrix(matrix);
                if(!this.matrices.some(o => o.stixID === m.stixID) ) {
                    this.matrices.push(m);
                }
            }
        });
        return this.matrices;
    }
}
