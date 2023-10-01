import { Label } from 'validation/entities/Label';
import { BaseService } from 'lib/BaseClasses/BaseService';
import { db } from '@src/db';

export class LabelSvc extends BaseService<Label> {}

export const labelSvc = new LabelSvc(Label, db);
