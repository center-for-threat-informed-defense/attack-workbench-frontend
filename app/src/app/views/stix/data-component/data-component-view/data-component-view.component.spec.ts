import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataComponentViewComponent } from './data-component-view.component';

describe('DataComponentViewComponent', () => {
    let component: DataComponentViewComponent;
    let fixture: ComponentFixture<DataComponentViewComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DataComponentViewComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DataComponentViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
