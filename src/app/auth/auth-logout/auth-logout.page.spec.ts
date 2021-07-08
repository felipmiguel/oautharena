import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AuthLogoutPage } from './auth-logout.page';

describe('AuthLogoutPage', () => {
  let component: AuthLogoutPage;
  let fixture: ComponentFixture<AuthLogoutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthLogoutPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthLogoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
