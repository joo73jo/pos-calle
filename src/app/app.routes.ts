import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () => import('./core/auth/register/register.page').then(m => m.RegisterPage)
  },


  // ✅ ADMIN
  {
    path: 'tabs-admin',
    loadComponent: () =>
      import('./admin/tabs-admin/tabs-admin.page').then((m) => m.TabsAdminPage),
    canActivate: [roleGuard],
    data: { roles: ['admin'] },
    children: [
      {
        path: 'productos',
        loadComponent: () =>
          import('./admin/productos/admin-productos.page').then((m) => m.AdminProductosPage),
      },
      {
        path: 'ventas',
        loadComponent: () =>
          import('./admin/ventas/admin-ventas.page').then((m) => m.AdminVentasPage),
      },
      { path: '', redirectTo: 'productos', pathMatch: 'full' },

    ],
  },

  // ✅ VENDEDOR
  {
    path: 'tabs-vendedor',
    loadComponent: () =>
      import('./vendedor/tabs-vendedor/tabs-vendedor.page').then((m) => m.TabsVendedorPage),
    canActivate: [roleGuard],
    data: { roles: ['vendedor', 'admin'] },
    children: [
      {
        path: 'pos',
        loadComponent: () => import('./vendedor/pos/pos.page').then((m) => m.PosPage),
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./vendedor/inventario/inventario.page').then((m) => m.InventarioPage),
      },
      {
        path: 'cierre-caja',
        loadComponent: () =>
          import('./vendedor/cierre-caja/cierre-caja.page')
            .then((m) => m.CierreCajaPage),
      },
      { path: 'seguimiento', loadComponent: () => import('./vendedor/seguimiento/seguimiento.page').then(m => m.SeguimientoPage) },

      { path: '', redirectTo: 'pos', pathMatch: 'full' },
    ],
  },

  // ✅ REPARTIDOR
  {
    path: 'tabs-repartidor',
    loadComponent: () =>
      import('./repartidor/tabs-repartidor/tabs-repartidor.page').then((m) => m.TabsRepartidorPage),
    canActivate: [roleGuard],
    data: { roles: ['repartidor', 'admin'] },
    children: [
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./repartidor/pedidos/pedidos.page').then((m) => m.PedidosPage),
      },
      { path: '', redirectTo: 'pedidos', pathMatch: 'full' },
    ],
  },

  { path: '**', redirectTo: 'home' },
];
