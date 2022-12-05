import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { authorSvc } from '@src/apiV1/Author/AuthorService';
import { BadRequest } from '@src/utils/errors';
import { Request, Response } from 'express';
import { BaseService } from './BaseService';
import { BaseCustomEntity } from './BaseCustomEntity';
import { z } from 'zod';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

class BaseController<T extends BaseCustomEntity> {
  public readonly service: BaseService<T>;

  public readonly createSchema?: z.ZodObject<any>;
  public readonly updateSchema?: z.ZodObject<any>;
  public readonly responseSchema?: z.ZodObject<any>;
  public readonly querySchema?: z.ZodObject<any>;

  constructor(
    service: BaseService<T>,
    createSchema?: z.ZodObject<any>,
    updateSchema?: z.ZodObject<any>,
    responseSchema?: z.ZodObject<any>,
    querySchema?: z.ZodObject<any>,
  ) {
    this.service = service;
    this.createSchema = createSchema;
    this.updateSchema = updateSchema;
    this.responseSchema = responseSchema;
    this
  }

  public create = handleErrorAsync(async (req: Request, res: Response) => {
    const body = this.createSchema?.parse(req.body) || req.body;
    let result = await this.service.create(body as T);
    if (this.responseSchema) result = this.responseSchema.parse(result) as T;
    return res.status(200).json({ data: result });
  });

  public getMany = handleErrorAsync(async (req: Request, res: Response) => {
    const { skip, take, relations } = this.querySchema?.parse(req.params) || {};
    const result = await this.service.getMany({ skip, take, relations });
    return res.status(200).json({ data: result });
  });

  public update = handleErrorAsync(async (req: Request, res: Response) => {
    let id: string | number = req.params.id?.toString();
    if (!id) throw new BadRequest('Id is required');
    if (!isNaN(+id)) id = +id
    const body = this.createSchema?.parse(req.body) || req.body;
    const { relations } = this.querySchema?.parse(req.params) || {};
    let result = await this.service.update(id, body as T, { relations });
    if (this.responseSchema) result = this.responseSchema.parse(result) as T;
    return res.status(200).json({ data: result });
  });

  public getById = handleErrorAsync(async (req: Request, res: Response) => {
    let id: string | number = req.params.id?.toString();
    if (!id) throw new BadRequest('Id is required');
    if (!isNaN(+id)) id = +id
    const { relations } = this.querySchema?.parse(req.params) || {};
    const result = await this.service.get({where: {id} as  FindOptionsWhere<T>, relations});
    return res.status(200).json({ data: result });
  });

  public delete = handleErrorAsync(async (req: Request, res: Response) => {
    let id: string | number = req.params.id?.toString();
    if (!id) throw new BadRequest('Id is required');
    if (!isNaN(+id)) id = +id
    await authorSvc.deleteAuthor(+id);
    return res.status(200).json();
  });
}

export default BaseController;
