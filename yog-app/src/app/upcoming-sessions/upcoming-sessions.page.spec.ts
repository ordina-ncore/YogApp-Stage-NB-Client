import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { UpcomingSessionsPage } from './upcoming-sessions.page';

describe('UpcomingSessionsPage', () => {
  let component: UpcomingSessionsPage;
  let fixture: ComponentFixture<UpcomingSessionsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpcomingSessionsPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingSessionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
