import {S3Client, GetObjectCommand, DeleteObjectCommand} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl as generateSignedUrl} from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

// Lazy initialization of S3 client
let s3Client = null;

// Validate AWS environment variables
const validateAWSConfig = () => {
  const required = ['AWS_REGION', 'AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_BUCKET_NAME'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing AWS environment variables:', missing);
    console.error('Please check your Vercel environment variables contain all required AWS_* variables');
    console.error('Available env vars:', Object.keys(process.env).filter(key => key.startsWith('AWS')));
    throw new Error(`Missing AWS environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ AWS environment variables loaded successfully');
  console.log(`📍 Region: ${process.env.AWS_REGION}`);
  console.log(`🪣 Bucket: ${process.env.AWS_BUCKET_NAME}`);
  console.log(`🔑 Access Key ID: ${process.env.AWS_ACCESS_KEY_ID?.substring(0, 4)}****`);
};

// Get or create S3 client (lazy initialization)
const getS3Client = () => {
  if (!s3Client) {
    validateAWSConfig();
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    });
  }
  return s3Client;
};


const uploadToS3 = async (fileBuffer, originalFileName, contentType, folder = 'list-icons') =>{
    try {
        console.log(`📤 Starting S3 upload: ${originalFileName} (${contentType})`);
        
        const fileExtension = originalFileName.split('.').pop();
        const uniqueFileName = `${folder}/${crypto.randomBytes(16).toString('hex')}-${Date.now()}.${fileExtension}`;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uniqueFileName,
            Body: fileBuffer,
            ContentType: contentType,
            ContentDisposition: 'inline',
            CacheControl: 'max-age=31536000',
            Metadata: {
              'x-amz-meta-content-type': contentType
            }
      };
      
      console.log(`🎯 Upload target: s3://${process.env.AWS_BUCKET_NAME}/${uniqueFileName}`);
      
      // Upload without ACL since bucket doesn't support ACLs
      const upload = new Upload({
          client: getS3Client(),
          params: params, // No ACL parameter
      });
      
      const result = await upload.done();
      console.log(`✅ S3 upload successful: ${result.Location}`);
      return result.Location;
    } catch (error) {
        console.error('❌ Error uploading file to S3:', error);
        console.error('🔍 Error details:', {
          name: error.name,
          message: error.message,
          code: error.code,
          statusCode: error.$metadata?.httpStatusCode
        });
        throw error;
    }
}


/**
 * Get a signed URL for temporary access to a private S3 object.
 * @param {string} key - The S3 object key (path and filename within the bucket).
 * @param {number} expiresIn - Expiration time in seconds.
 * @returns {Promise<string>} - The signed URL.
 */
const getSignedUrl = async (key, expiresIn = 3600) => {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
      });
      
      return await generateSignedUrl(getS3Client(), command, { expiresIn });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw error;
    }
  };
  
  /**
   * Deletes a file from S3 using its full S3 URL.
   * MODIFIED: Accepts the full S3 URL and extracts the key.
   * @param {string} fileUrl - The full S3 URL of the file to delete.
   * @returns {Promise<object>} - The S3 response object for the delete operation.
   */
  const deleteFromS3 = async (fileUrl) => {
    if (!fileUrl) {
      console.warn('Attempted to delete null or undefined file URL from S3.');
      return; // Or throw an error depending on desired behavior
    }
    try {
      // Extract the S3 key from the URL.
      // Example URL: https://<bucket-name>.s3.<region>.amazonaws.com/<key-path>
      const urlParts = fileUrl.split('.com/'); // Split at ".com/" to get the key part
      if (urlParts.length < 2) {
        console.warn('Invalid S3 URL format for deletion:', fileUrl);
        return;
      }
      const key = urlParts[1]; // The part after ".com/" is the key
  
      const command = new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
      });
      
      const response = await getS3Client().send(command);
      console.log(`File ${key} deleted successfully`);
      return response;
    } catch (error) {
      console.error(`Error deleting file ${key} from S3:`, error);
      throw error;
    }
  };
  
  // Export functions
  export {
    getS3Client,
    uploadToS3,
    getSignedUrl,
    deleteFromS3
  };