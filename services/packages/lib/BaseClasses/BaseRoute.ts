import { Router, RequestHandler } from 'express';
import { BaseController } from '../BaseClasses/BaseController';
import { deepMerge } from '../helpers/deepMerge';

type RoutePropsT = { enabled: boolean; path: string; requiredRoles: string[] };
type RoutesConfigI = {
  getMany: RoutePropsT;
  getById: RoutePropsT;
  create: RoutePropsT;
  update: RoutePropsT;
  delete: RoutePropsT;
};

export class BaseRoute {
  public readonly router: Router;
  private controller: BaseController<any, any>;
  private defaultConfig: RoutesConfigI;
  private authSvc: { authRequiredMiddleware: (requiredRoles: string[]) => RequestHandler }
  constructor(controller: BaseController<any, any>, authService: { authRequiredMiddleware: (requiredRoles: string[]) => RequestHandler }) {
    this.router = Router();
    this.controller = controller;
    this.authSvc = authService;
    this.defaultConfig = {
      getMany: { enabled: true, path: '/', requiredRoles: [] },
      getById: { enabled: true, path: '/:id', requiredRoles: [] },
      create: { enabled: true, path: '/', requiredRoles: ['admin'] },
      update: { enabled: true, path: '/:id', requiredRoles: ['admin'] },
      delete: { enabled: true, path: '/:id', requiredRoles: ['admin'] },
    };
  }

  public setRoutes(config: Partial<RoutesConfigI>) {
    const localConfig = deepMerge<RoutesConfigI>(this.defaultConfig, config);
    Object.entries(localConfig).forEach(([key, value]) => {
      const typedKey = key as keyof RoutesConfigI;
      switch (key) {
        case 'getMany':
        case 'getById':
          this.router.get(
            value.path,
            this.authSvc.authRequiredMiddleware(value.requiredRoles),
            this.controller[typedKey],
          );
          break;
        case 'create':
          this.router.post(
            value.path,
            this.authSvc.authRequiredMiddleware(value.requiredRoles),
            this.controller[typedKey],
          );
          break;
        case 'update':
          this.router.put(
            value.path,
            this.authSvc.authRequiredMiddleware(value.requiredRoles),
            this.controller[typedKey],
          );
          break;
        case 'delete':
          this.router.delete(
            value.path,
            this.authSvc.authRequiredMiddleware(value.requiredRoles),
            this.controller[typedKey],
          );
          break;
        default:
          break;
      }
    });
  }
}
