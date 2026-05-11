import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAvatarComponent } from './user-avatar.component';

describe('UserAvatarComponent', () => {
  let component: UserAvatarComponent;
  let fixture: ComponentFixture<UserAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAvatarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAvatarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show first and last initials for a display name with middle names', () => {
    component.name = 'Cassandra Lauren Smith';

    expect(component.initials).toBe('CS');
  });

  it('should show first and last initials for a two-word display name', () => {
    component.name = 'Laurent Hacks';

    expect(component.initials).toBe('LH');
  });

  it('should show the first two letters for usernames', () => {
    component.name = 'clsmith';

    expect(component.initials).toBe('CL');
  });

  it('should show the first two letters for usernames that match display initials', () => {
    component.name = 'lhacks';

    expect(component.initials).toBe('LH');
  });

  it('should ignore prefixes and suffixes when building display initials', () => {
    component.name = 'Dr. Cassandra Lauren Smith Jr.';

    expect(component.initials).toBe('CS');
  });

  it('should ignore professional suffixes when building display initials', () => {
    component.name = 'Laurent Hacks, PhD';

    expect(component.initials).toBe('LH');
  });

  it('should build initials from the remaining name when only a prefix is ignored', () => {
    component.name = 'Dr. Cassandra';

    expect(component.initials).toBe('CA');
  });

  it('should assign the same background to the same name', () => {
    component.name = 'Mary Jackson';
    const background = component.background;

    component.name = 'Mary Jackson';

    expect(component.background).toBe(background);
  });
});
