import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimestampEditComponent } from './timestamp-edit.component';

describe('TimestampEditComponent', () => {
    let component: TimestampEditComponent;
    let fixture: ComponentFixture<TimestampEditComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TimestampEditComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TimestampEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
