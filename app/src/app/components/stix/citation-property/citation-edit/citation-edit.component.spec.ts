import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationEditComponent } from './citation-edit.component';

describe('CitationEditComponent', () => {
    let component: CitationEditComponent;
    let fixture: ComponentFixture<CitationEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CitationEditComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CitationEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
