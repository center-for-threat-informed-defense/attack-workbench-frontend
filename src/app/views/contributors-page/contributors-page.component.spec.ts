import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContributorsPageComponent } from './contributors-page.component';

describe('ContributorsPageComponent', () => {
	let component: ContributorsPageComponent;
	let fixture: ComponentFixture<ContributorsPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
		declarations: [ContributorsPageComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(ContributorsPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
