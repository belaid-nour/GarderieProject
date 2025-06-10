import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeanceFormComponent } from './seance-form.component';

describe('SeanceFormComponent', () => {
  let component: SeanceFormComponent;
  let fixture: ComponentFixture<SeanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeanceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
