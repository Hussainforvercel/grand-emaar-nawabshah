import { NextResponse } from 'next/server';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export const runtime = 'nodejs';

const awsRegion = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3Client =
  awsRegion && accessKeyId && secretAccessKey
    ? new S3Client({
        region: awsRegion,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      })
    : null;

function sanitizeFileName(fileName: string) {
  return fileName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9.-]/g, '');
}

export async function POST(request: Request) {
  try {
    if (!s3Client || !bucketName || !awsRegion) {
      return NextResponse.json(
        { error: 'AWS S3 environment variables are not configured.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'Image file is required.' },
        { status: 400 }
      );
    }

    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed.' },
        { status: 400 }
      );
    }

    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Image size must be less than 5MB.' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const safeFileName = sanitizeFileName(file.name || 'dish-image');
    const fileKey = `menu-images/${Date.now()}-${safeFileName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const imageUrl = `https://${bucketName}.s3.${awsRegion}.amazonaws.com/${fileKey}`;

    return NextResponse.json({
      success: true,
      imageUrl,
      key: fileKey,
    });
  } catch (error: any) {
    console.error('S3 upload error:', error);

    return NextResponse.json(
      {
        error: error?.message || 'Failed to upload image to S3.',
      },
      { status: 500 }
    );
  }
}