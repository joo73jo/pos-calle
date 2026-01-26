import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsRepartidorPage } from './tabs-repartidor.page';

describe('TabsRepartidorPage', () => {
  let component: TabsRepartidorPage;
  let fixture: ComponentFixture<TabsRepartidorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsRepartidorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
