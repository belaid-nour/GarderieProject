import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AdminChatComponent  } from './chat.component';
describe('ChatComponent', () => {
  let component: AdminChatComponent ;
  let fixture: ComponentFixture<AdminChatComponent >;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AdminChatComponent ]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AdminChatComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
