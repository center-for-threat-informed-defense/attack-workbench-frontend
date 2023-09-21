import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesPageComponent } from './notes-page.component';

describe('NotesPageComponent', () => {
	let component: NotesPageComponent;
	let fixture: ComponentFixture<NotesPageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [NotesPageComponent]
		})
		.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(NotesPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
