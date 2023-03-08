// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import S3 from 'aws-sdk/clients/s3';

const s3 = new S3({
  apiVersion: '2006-03-01',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
  signatureVersion: 'v4',
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const timestamps = Date.parse(new Date().toISOString());
  const extension = (req.query.fileType as string).split('/')[1];
  const Key = `${timestamps}.${extension}`;

  const s3Params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key,
    Expires: 60,
    ContentType: `text/${extension}`,
  };

  const uploadUrl = s3.getSignedUrl('putObject', s3Params);

  res.status(200).json({ uploadUrl, Key });
}
