import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { SendComplaintComponent } from './chat.component';
describe('ChatComponent', () => {
  let component: SendComplaintComponent;
  let fixture: ComponentFixture<SendComplaintComponent>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SendComplaintComponent]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(SendComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
