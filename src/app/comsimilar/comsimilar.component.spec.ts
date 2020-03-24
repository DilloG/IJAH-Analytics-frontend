import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComsimilarComponent } from './comsimilar.component';

describe('ComsimilarComponent', () => {
  let component: ComsimilarComponent;
  let fixture: ComponentFixture<ComsimilarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComsimilarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComsimilarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
