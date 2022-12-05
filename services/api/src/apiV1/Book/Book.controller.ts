import { handleErrorAsync } from '@src/middlewares/errorCatcher';
import { bookSvc } from '@src/apiV1/Book/BookService';
import { createBookBodySchema, updateBookBodySchema } from '.';
import { querySchema } from '@src/utils/BaseClasses/QueryType';
import { BadRequest } from '@src/utils/errors';
import { Request, Response } from 'express';

class BookController {
  public create = handleErrorAsync(async (req: Request, res: Response) => {
    const body = createBookBodySchema.parse(req.body);
    const result = await bookSvc.create(body);
    return res.status(200).json(result);
  });

  public getMany = handleErrorAsync(async (req: Request, res: Response) => {
    const {skip, take } = querySchema.parse(req.params);
    const result = await bookSvc.getMany({ skip, take });
    return res.status(200).json(result);
  });

  public updateBook = handleErrorAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw new BadRequest('Id is required');
    const body = updateBookBodySchema.parse(req.body);
    const result = await bookSvc.updateBook(+id, body);
    return res.status(200).json(result);
  });

  public getById = handleErrorAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw new BadRequest('Id is required');
    const result = await bookSvc.getById(+id);
    return res.status(200).json(result);
  });

  public delete = handleErrorAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    if (!id) throw new BadRequest('Id is required');
    await bookSvc.deleteBook(+id);
    return res.status(200).json();
  });
}

export default BookController;
