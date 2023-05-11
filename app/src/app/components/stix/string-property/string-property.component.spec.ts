import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StringPropertyComponent } from './string-property.component';

describe('StringPropertyComponent', () => {
    let component: StringPropertyComponent;
    let fixture: ComponentFixture<StringPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StringPropertyComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(StringPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
