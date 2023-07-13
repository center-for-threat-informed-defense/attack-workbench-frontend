import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtypeDialogComponent } from './subtype-dialog.component';

describe('SubtypeDialogComponent', () => {
	let component: SubtypeDialogComponent;
	let fixture: ComponentFixture<SubtypeDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [SubtypeDialogComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SubtypeDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
