import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkTableComponent } from './network-table.component';

describe('NetworkTableComponent', () => {
  let component: NetworkTableComponent;
  let fixture: ComponentFixture<NetworkTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
