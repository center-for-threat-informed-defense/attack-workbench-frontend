import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbComponent } from './breadcrumb.component';

describe('BreadcrumbComponent', () => {
	let component: BreadcrumbComponent;
	let fixture: ComponentFixture<BreadcrumbComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [BreadcrumbComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(BreadcrumbComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
