import { Content } from '@src/entities/Content';
import { BaseService } from '@src/utils/BaseClasses/BaseService';

class ContentSvc extends BaseService<Content> {}

export const contentSvc = new ContentSvc(Content);
