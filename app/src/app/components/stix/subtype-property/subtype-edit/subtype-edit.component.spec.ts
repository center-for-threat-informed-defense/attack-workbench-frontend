import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtypeEditComponent } from './subtype-edit.component';

describe('SubtypeEditComponent', () => {
	let component: SubtypeEditComponent;
	let fixture: ComponentFixture<SubtypeEditComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SubtypeEditComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SubtypeEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
