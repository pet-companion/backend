import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Credentials, S3 } from 'aws-sdk';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private credentials: Credentials | CredentialsOptions = {
    accessKeyId: '',
    secretAccessKey: '',
  };

  private bucket: string;
  private s3Client: S3;

  constructor(config: ConfigService) {
    this.credentials.accessKeyId = config.get('AWS_S3_ACCESS_KEY');
    this.credentials.secretAccessKey = config.get('AWS_S3_SECRET_KEY');
    this.bucket = config.get('AWS_S3_BUCKET_NAME');

    this.s3Client = new S3({
      credentials: this.credentials,
    });
  }

  async getUploadUrl(userId: number) {
    const signedUrl = await this.s3Client.getSignedUrlPromise('putObject', {
      Bucket: this.bucket,
      Key: `user/${userId}/${uuidv4()}.png`,
      Expires: 60 * 5,
      ContentType: 'image/png',
    });

    return {
      signedUrl,
      url: signedUrl.split('?')[0],
    };
  }
}
