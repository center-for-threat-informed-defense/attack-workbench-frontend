import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAccountsPageComponent } from './user-accounts-page.component';

describe('UserAccountsPageComponent', () => {
    let component: UserAccountsPageComponent;
    let fixture: ComponentFixture<UserAccountsPageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserAccountsPageComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(UserAccountsPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
