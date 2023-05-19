import { Label } from '@src/entities/Label';
import { BaseService } from '@lib/BaseClasses/BaseService';

export class LabelSvc extends BaseService<Label> {}

export const labelSvc = new LabelSvc(Label);
