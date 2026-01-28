import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

export const roleGuard: CanActivateFn = async (route) => {
  const router = inject(Router);
  const auth = inject(AuthService);

  const session = (await auth.getSession()).data.session;
  if (!session) return router.parseUrl('/home');

  const profile = await auth.getMyProfile();
  if (!profile || !profile.activo) return router.parseUrl('/home');

  const roles = (route.data?.['roles'] as string[] | undefined) ?? [];
  if (roles.length === 0) return true;

  if (!roles.includes(profile.rol)) {
    return router.parseUrl(
      profile.rol === 'admin' ? '/tabs-admin' :
      profile.rol === 'vendedor' ? '/tabs-vendedor' :
      '/tabs-repartidor'
    );
  }

  return true;
};
