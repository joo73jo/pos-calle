import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // ✅ ADMIN
  {
    path: 'tabs-admin',
    loadComponent: () =>
      import('./admin/tabs-admin/tabs-admin.page').then((m) => m.TabsAdminPage),
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
      { path: '', redirectTo: 'pos', pathMatch: 'full' },
    ],
  },

  // ✅ REPARTIDOR
  {
    path: 'tabs-repartidor',
    loadComponent: () =>
      import('./repartidor/tabs-repartidor/tabs-repartidor.page').then((m) => m.TabsRepartidorPage),
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
