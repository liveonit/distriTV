import { config } from '@src/config';
import { Content } from '@src/entities/Content';
import { BaseService } from '@src/utils/BaseClasses/BaseService';
import fileUpload, { UploadedFile } from 'express-fileupload';
import { rm } from 'fs';
import path from 'path';

export class ContentSvc extends BaseService<Content> {
  private isSingleFile(file: UploadedFile | UploadedFile[]): file is UploadedFile {
    return typeof file === 'object' && (file as UploadedFile).name !== undefined;
  }

  public async uploadFiles(userId: string, files: fileUpload.FileArray) {
    // Uploaded path
    const uploadedFiles = this.isSingleFile(files.uploadFile)
      ? [files.uploadFile]
      : files.uploadFile;

    const result = await Promise.allSettled(
      uploadedFiles.map(async (uploadedFile) => {
        const uploadPath = path.resolve(config.PATH_TO_UPLOAD_FILES, userId, uploadedFile.name);
        await uploadedFile.mv(uploadPath);
        return uploadPath;
      }),
    );
    return result.map((res) => {
      if (res.status === 'fulfilled')
        return {
          status: 'uploaded',
          filePath: res.value,
        };
      return {
        status: 'failed',
        reason: res.reason,
      };
    });
  }
}

export const contentSvc = new ContentSvc(Content);
