import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvertissementComponent } from './avertissement-list.component';

describe('AvertissementComponent', () => {
  let component: AvertissementComponent;
  let fixture: ComponentFixture<AvertissementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvertissementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvertissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
