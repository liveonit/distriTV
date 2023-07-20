import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { BadRequest } from '@lib/errors';
import { Request, Response } from 'express';
import { BaseService } from './BaseService';
import { BaseCustomEntity } from './BaseCustomEntity';
import { z } from 'zod';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

export class BaseController<T extends BaseCustomEntity, S extends BaseService<T>> {
  public readonly service: S;

  public readonly createSchema?: z.ZodObject<any>;
  public readonly updateSchema?: z.ZodObject<any>;
  public readonly responseSchema?: z.ZodObject<any>;
  public readonly querySchema?: z.ZodObject<any>;

  constructor(
    service: S,
    createSchema?: z.ZodObject<any>,
    updateSchema?: z.ZodObject<any>,
    responseSchema?: z.ZodObject<any>,
    querySchema?: z.ZodObject<any>,
  ) {
    this.service = service;
    this.createSchema = createSchema;
    this.updateSchema = updateSchema;
    this.responseSchema = responseSchema;
    this.querySchema = querySchema;
  }

  public create = handleErrorAsync(async (req: Request, res: Response) => {
    const body = this.createSchema?.parse(req.body) || req.body;
    const { relations } = this.querySchema?.parse(req.query) || {};
    let result = await this.service.create(body as T, { relations });
    if (this.responseSchema) result = this.responseSchema.parse(result) as T;
    return res.status(200).json(result);
  });
  //_.pick(result, Object.keys(this.responseSchema))
  //
  public getMany = handleErrorAsync(async (req: Request, res: Response) => {
    const { skip, take, relations, search } = this.querySchema?.parse(req.query) || {};
    let result = await this.service.getMany({ skip, take, relations, where: search });
    if (this.responseSchema) result = result.map((v) => this.responseSchema!.parse(v) as T);
    return res.status(200).json(result);
  });

  public update = handleErrorAsync(async (req: Request, res: Response) => {
    if (!req.params.id) throw new BadRequest('Id is required');
    let id: string | number = req.params.id.toString();
    if (!isNaN(+id)) id = +id;
    const body = this.updateSchema?.parse(req.body) || req.body;
    const { relations } = this.querySchema?.parse(req.query) || {};
    let result = await this.service.update(id, body as T, { relations });
    console.log({ result });
    if (this.responseSchema) result = this.responseSchema.parse(result) as T;
    return res.status(200).json(result);
  });

  public getById = handleErrorAsync(async (req: Request, res: Response) => {
    if (!req.params.id) throw new BadRequest('Id is required');
    let id: string | number = req.params.id.toString();
    if (!isNaN(+id)) id = +id;
    const { relations } = this.querySchema?.parse(req.query) || {};
    let result = await this.service.get({ where: { id } as FindOptionsWhere<T>, relations });
    if (this.responseSchema) result = this.responseSchema.parse(result) as T;
    return res.status(200).json(result);
  });

  public delete = handleErrorAsync(async (req: Request, res: Response) => {
    if (!req.params.id) throw new BadRequest('Id is required');
    let id: string | number = req.params.id.toString();
    if (!isNaN(+id)) id = +id;
    await this.service.delete(id);
    return res.status(200).json({ id });
  });
}
