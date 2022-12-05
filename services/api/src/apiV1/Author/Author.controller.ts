import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { authorSvc } from '@src/apiV1/Author/AuthorService';
import { createAuthorBodySchema, updateAuthorBodySchema } from '.';
import { querySchema } from '@src/utils/BaseClasses/QueryType';
import { BadRequest } from '@src/utils/errors';
import { Request, Response } from 'express';

class AuthorController {
  public create = handleErrorAsync(async (req: Request, res: Response) => {
    const body = createAuthorBodySchema.parse(req.body);
    const result = await authorSvc.create(body);
    return res.status(200).json({ data: result});
  });

  public getMany = handleErrorAsync(async (req: Request, res: Response) => {
    const {skip, take } = querySchema.parse(req.params);
    const result = await authorSvc.getMany({ skip, take });
    return res.status(200).json({ data: result});
  });

  public update = handleErrorAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw new BadRequest('Id is required');
    const body = updateAuthorBodySchema.parse(req.body);
    const result = await authorSvc.updateAuthor(+id, body);
    return res.status(200).json({ data: result});
  });

  public getById = handleErrorAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw new BadRequest('Id is required');
    const result = await authorSvc.getById(+id);
    return res.status(200).json({ data: result});
  });

  public delete = handleErrorAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw new BadRequest('Id is required');
    await authorSvc.deleteAuthor(+id);
    return res.status(200).json();
  });
}

export default AuthorController;
