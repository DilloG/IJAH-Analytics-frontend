import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynergiComponent } from './synergi.component';

describe('SynergiComponent', () => {
  let component: SynergiComponent;
  let fixture: ComponentFixture<SynergiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynergiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynergiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
