import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import path from "path";

const ALLOWED_TYPES = new Set(["application/pdf","image/jpeg","image/png","image/webp","image/gif"]);
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024;
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || "uploads";

function getStorageClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new UploadError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for storage.");
  return createClient(url, key, { auth: { persistSession: false } });
}
export interface UploadResult { url:string; fileName:string; fileType:string; fileSize:number; }
export class UploadError extends Error {}

export async function uploadFile(file: File): Promise<UploadResult> {
  if (!ALLOWED_TYPES.has(file.type)) throw new UploadError("That file type isn't allowed. Upload a PDF, JPG, PNG, WEBP, or GIF.");
  if (file.size > MAX_FILE_SIZE_BYTES) throw new UploadError("File is too large. Maximum size is 15 MB.");
  const ext=safeExtension(file.name,file.type);
  const key=`${randomUUID()}${ext}`;
  const supabase=getStorageClient();
  const {error}=await supabase.storage.from(BUCKET).upload(key,Buffer.from(await file.arrayBuffer()),{contentType:file.type,upsert:false});
  if(error) throw new UploadError(error.message);
  const {data}=supabase.storage.from(BUCKET).getPublicUrl(key);
  return {url:data.publicUrl,fileName:file.name,fileType:file.type,fileSize:file.size};
}

export async function deleteFile(url:string|null):Promise<void>{
  if(!url)return;
  const supabase=getStorageClient();
  const marker=`/storage/v1/object/public/${BUCKET}/`;
  const i=url.indexOf(marker);
  if(i<0)return;
  const key=decodeURIComponent(url.slice(i+marker.length));
  if(!key)return;
  const {error}=await supabase.storage.from(BUCKET).remove([key]);
  if(error) console.warn("Supabase storage delete failed:",error.message);
}
function safeExtension(fileName:string,mimeType:string):string{
  const known:Record<string,string>={"application/pdf":".pdf","image/jpeg":".jpg","image/png":".png","image/webp":".webp","image/gif":".gif"};
  return known[mimeType]||path.extname(fileName).slice(0,8)||"";
}
