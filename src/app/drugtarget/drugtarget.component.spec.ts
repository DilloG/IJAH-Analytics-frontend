import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugtargetComponent } from './drugtarget.component';

describe('DrugtargetComponent', () => {
  let component: DrugtargetComponent;
  let fixture: ComponentFixture<DrugtargetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrugtargetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugtargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
