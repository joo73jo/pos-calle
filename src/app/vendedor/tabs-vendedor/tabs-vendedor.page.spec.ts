import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabsVendedorPage } from './tabs-vendedor.page';

describe('TabsVendedorPage', () => {
  let component: TabsVendedorPage;
  let fixture: ComponentFixture<TabsVendedorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsVendedorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
