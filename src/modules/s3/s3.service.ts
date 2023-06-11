import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Credentials } from 'aws-sdk';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3Service {
  private credentials: Credentials | CredentialsOptions = {
    accessKeyId: '',
    secretAccessKey: '',
  };

  private bucket: string;
  private s3Client: S3Client;

  constructor(config: ConfigService) {
    this.credentials.accessKeyId = config.get('AWS_S3_ACCESS_KEY');
    this.credentials.secretAccessKey = config.get('AWS_S3_SECRET_KEY');
    this.bucket = config.get('AWS_S3_BUCKET_NAME');

    this.s3Client = new S3Client({
      credentials: this.credentials,
      region: config.get('AWS_S3_REGION'),
    });
  }

  async getUploadUrl(userId: number) {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: `user/${userId}/${uuidv4()}.png`,
      ContentType: 'image/png',
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 60 * 5,
    });

    return {
      message: 'Successfully generated upload url',
      urls: {
        signedUrl,
        fileUrl: signedUrl.split('?')[0],
      },
    };
  }
}
