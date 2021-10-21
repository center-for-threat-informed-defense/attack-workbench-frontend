import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSourceListComponent } from './data-source-list.component';

describe('DataSourceListComponent', () => {
    let component: DataSourceListComponent;
    let fixture: ComponentFixture<DataSourceListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DataSourceListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DataSourceListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
