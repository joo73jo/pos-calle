import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'tabs-admin',
    loadComponent: () => import('./admin/tabs-admin/tabs-admin.page').then( m => m.TabsAdminPage)
  },
  {
    path: 'tabs-vendedor',
    loadComponent: () => import('./vendedor/tabs-vendedor/tabs-vendedor.page').then( m => m.TabsVendedorPage)
  },
  {
    path: 'pos',
    loadComponent: () => import('./vendedor/pos/pos.page').then( m => m.PosPage)
  },
  {
    path: 'inventario',
    loadComponent: () => import('./vendedor/inventario/inventario.page').then( m => m.InventarioPage)
  },
  {
    path: 'tabs-repartidor',
    loadComponent: () => import('./repartidor/tabs-repartidor/tabs-repartidor.page').then( m => m.TabsRepartidorPage)
  },
  {
    path: 'pedidos',
    loadComponent: () => import('./repartidor/pedidos/pedidos.page').then( m => m.PedidosPage)
  },
];
