import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitationPropertyComponent } from './citation-property.component';

describe('CitationPropertyComponent', () => {
    let component: CitationPropertyComponent;
    let fixture: ComponentFixture<CitationPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CitationPropertyComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(CitationPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
