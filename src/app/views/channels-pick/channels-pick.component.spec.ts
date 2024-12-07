import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelsPickComponent } from './channels-pick.component';

describe('ChannelsPickComponent', () => {
  let component: ChannelsPickComponent;
  let fixture: ComponentFixture<ChannelsPickComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelsPickComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelsPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
