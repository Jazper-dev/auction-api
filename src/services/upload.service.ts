import { minioClient } from "../utils/minio.util.js";

export const uploadToMinio = async (
  bucketName: string, 
  fileName: string, 
  fileBuffer: Buffer, 
  size: number, 
  mimetype: string
) => {
  const metaData = {
    'Content-Type': mimetype,
  };

  await minioClient.putObject(bucketName, fileName, fileBuffer, size, metaData);

  const host = process.env.MINIO_ENDPOINT || 'localhost';
  const port = process.env.MINIO_PORT || '9000';

  return `http://${host}:${port}/${bucketName}/${fileName}`;
};