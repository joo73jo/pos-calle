import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguimientoPage } from './seguimiento.page';
import { TabsVendedorPage } from '../tabs-vendedor/tabs-vendedor.page';
describe('SeguimientoPage', () => {
  let component: SeguimientoPage;
  let fixture: ComponentFixture<SeguimientoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
