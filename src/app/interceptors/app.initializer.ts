import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';

export function appInitializer(authService: AuthService) {
    return () => new Promise((resolve: any) => {
        // attempt to refresh token on app start up to auto authenticate
        // if (authService.accountValue)
        authService.refreshToken().subscribe().add(resolve);
    });
}

export const AppInitializer = [
    { provide: APP_INITIALIZER, useClass: appInitializer, multi: true, deps: [AuthService] }
];