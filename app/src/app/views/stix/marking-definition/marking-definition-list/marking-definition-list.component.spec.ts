import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkingDefinitionListComponent } from './marking-definition-list.component';

describe('MarkingDefinitionListComponent', () => {
    let component: MarkingDefinitionListComponent;
    let fixture: ComponentFixture<MarkingDefinitionListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MarkingDefinitionListComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(MarkingDefinitionListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
