import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

// Server-side repository backed by Supabase Postgres.
// Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel.
// The service-role key is NEVER exposed to browser code.

let client: SupabaseClient | undefined;

function getDb(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required on the server.");
  client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}

function unwrap<T>(result: { data: T | null; error: any }): T {
  if (result.error) throw new Error(result.error.message);
  if (result.data == null) throw new Error("Supabase returned no data.");
  return result.data;
}
function unwrapWrite<T>(result: { data: T | null; error: any }): T { return unwrap(result); }

export interface Profile {
  id: string; name: string; title: string; summary: string; aboutBody: string;
  researchInterests: string; careerInterests: string; keyStrengths: string;
  profileImageUrl: string | null; email: string | null; phone: string | null;
  location: string | null; linkedin: string | null; github: string | null;
  otherLinkLabel: string | null; otherLinkUrl: string | null; cvDocumentId: string | null;
  updatedAt: string;
}
export interface Education { id:string; degree:string; institution:string; city:string|null; country:string|null; startDate:string; endDate:string; fieldOfStudy:string|null; details:string|null; order:number; createdAt:string; }
export interface Experience { id:string; position:string; organization:string; location:string|null; startDate:string; endDate:string; responsibilities:string; skillsUsed:string; order:number; createdAt:string; }
export interface Skill { id:string; name:string; category:string; order:number; }
export interface Project { id:string; title:string; description:string; role:string|null; methods:string; date:string|null; externalUrl:string|null; documentId:string|null; order:number; createdAt:string; }
export interface Certification { id:string; title:string; issuer:string; date:string|null; verificationUrl:string|null; documentId:string|null; order:number; createdAt:string; }
export interface Doc { id:string; title:string; description:string|null; category:string; fileUrl:string|null; externalUrl:string|null; fileName:string|null; fileType:string|null; fileSize:number|null; isPublic:boolean; uploadedAt:string; }
export interface ContactMessage { id:string; name:string; email:string; subject:string; message:string; isRead:boolean; createdAt:string; }
export interface GalleryItem { id:string; title:string; imageUrl:string; caption:string|null; order:number; isPublic:boolean; createdAt:string; }
export interface NavigationItem { id:string; label:string; href:string; order:number; isVisible:boolean; createdAt:string; }
export interface SiteSettings { id:string; siteTitle:string; metaDescription:string; ogImageUrl:string|null; primaryColorNote:string; }
export interface AdminUser { id:string; email:string; passwordHash:string; name:string; createdAt:string; lastLoginAt:string|null; }

const toProfile=(r:any):Profile=>({id:r.id,name:r.name,title:r.title,summary:r.summary,aboutBody:r.about_body,researchInterests:r.research_interests,careerInterests:r.career_interests,keyStrengths:r.key_strengths,profileImageUrl:r.profile_image_url,email:r.email,phone:r.phone,location:r.location,linkedin:r.linkedin,github:r.github,otherLinkLabel:r.other_link_label,otherLinkUrl:r.other_link_url,cvDocumentId:r.cv_document_id,updatedAt:r.updated_at});
const toEducation=(r:any):Education=>({id:r.id,degree:r.degree,institution:r.institution,city:r.city,country:r.country,startDate:r.start_date,endDate:r.end_date,fieldOfStudy:r.field_of_study,details:r.details,order:r.sort_order,createdAt:r.created_at});
const toExperience=(r:any):Experience=>({id:r.id,position:r.position,organization:r.organization,location:r.location,startDate:r.start_date,endDate:r.end_date,responsibilities:r.responsibilities,skillsUsed:r.skills_used,order:r.sort_order,createdAt:r.created_at});
const toSkill=(r:any):Skill=>({id:r.id,name:r.name,category:r.category,order:r.sort_order});
const toProject=(r:any):Project=>({id:r.id,title:r.title,description:r.description,role:r.role,methods:r.methods,date:r.date,externalUrl:r.external_url,documentId:r.document_id,order:r.sort_order,createdAt:r.created_at});
const toCertification=(r:any):Certification=>({id:r.id,title:r.title,issuer:r.issuer,date:r.date,verificationUrl:r.verification_url,documentId:r.document_id,order:r.sort_order,createdAt:r.created_at});
const toDoc=(r:any):Doc=>({id:r.id,title:r.title,description:r.description,category:r.category,fileUrl:r.file_url,externalUrl:r.external_url,fileName:r.file_name,fileType:r.file_type,fileSize:r.file_size,isPublic:!!r.is_public,uploadedAt:r.uploaded_at});
const toMessage=(r:any):ContactMessage=>({id:r.id,name:r.name,email:r.email,subject:r.subject,message:r.message,isRead:!!r.is_read,createdAt:r.created_at});
const toGallery=(r:any):GalleryItem=>({id:r.id,title:r.title,imageUrl:r.image_url,caption:r.caption,order:r.sort_order,isPublic:!!r.is_public,createdAt:r.created_at});
const toNavigation=(r:any):NavigationItem=>({id:r.id,label:r.label,href:r.href,order:r.sort_order,isVisible:!!r.is_visible,createdAt:r.created_at});
const toSettings=(r:any):SiteSettings=>({id:r.id,siteTitle:r.site_title,metaDescription:r.meta_description,ogImageUrl:r.og_image_url,primaryColorNote:r.primary_color_note});
const toAdmin=(r:any):AdminUser=>({id:r.id,email:r.email,passwordHash:r.password_hash,name:r.name,createdAt:r.created_at,lastLoginAt:r.last_login_at});

export async function getProfile(){ const {data,error}=await getDb().from("profile").select("*").eq("id","singleton").maybeSingle(); if(error)throw new Error(error.message); if(!data){const x=unwrapWrite(await getDb().from("profile").insert({id:"singleton"}).select("*").single());return toProfile(x)} return toProfile(data); }
export async function updateProfile(data:Partial<Omit<Profile,"id"|"updatedAt">>){const cur=await getProfile();const m={...cur,...data};const row=unwrapWrite(await getDb().from("profile").update({name:m.name,title:m.title,summary:m.summary,about_body:m.aboutBody,research_interests:m.researchInterests,career_interests:m.careerInterests,key_strengths:m.keyStrengths,profile_image_url:m.profileImageUrl,email:m.email,phone:m.phone,location:m.location,linkedin:m.linkedin,github:m.github,other_link_label:m.otherLinkLabel,other_link_url:m.otherLinkUrl,cv_document_id:m.cvDocumentId}).eq("id","singleton").select("*").single());return toProfile(row);}

export async function listEducation(){return (unwrap(await getDb().from("education").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false})) as any[]).map(toEducation);}
export async function createEducation(data:Omit<Education,"id"|"createdAt">){const id=randomUUID();return toEducation(unwrapWrite(await getDb().from("education").insert({id,degree:data.degree,institution:data.institution,city:data.city,country:data.country,start_date:data.startDate,end_date:data.endDate,field_of_study:data.fieldOfStudy,details:data.details,sort_order:data.order}).select("*").single()));}
export async function updateEducation(id:string,data:Partial<Omit<Education,"id"|"createdAt">>){const old=await getDb().from("education").select("*").eq("id",id).maybeSingle();if(old.error)throw new Error(old.error.message);if(!old.data)return null;const m={...toEducation(old.data),...data};const row=unwrapWrite(await getDb().from("education").update({degree:m.degree,institution:m.institution,city:m.city,country:m.country,start_date:m.startDate,end_date:m.endDate,field_of_study:m.fieldOfStudy,details:m.details,sort_order:m.order}).eq("id",id).select("*").single());return toEducation(row);}
export async function deleteEducation(id:string){const r=await getDb().from("education").delete().eq("id",id).select("id");if(r.error)throw new Error(r.error.message);return !!r.data?.length;}

export async function listExperience(){return (unwrap(await getDb().from("experience").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false})) as any[]).map(toExperience);}
export async function createExperience(data:Omit<Experience,"id"|"createdAt">){const id=randomUUID();return toExperience(unwrapWrite(await getDb().from("experience").insert({id,position:data.position,organization:data.organization,location:data.location,start_date:data.startDate,end_date:data.endDate,responsibilities:data.responsibilities,skills_used:data.skillsUsed,sort_order:data.order}).select("*").single()));}
export async function updateExperience(id:string,data:Partial<Omit<Experience,"id"|"createdAt">>){const old=await getDb().from("experience").select("*").eq("id",id).maybeSingle();if(old.error)throw new Error(old.error.message);if(!old.data)return null;const m={...toExperience(old.data),...data};return toExperience(unwrapWrite(await getDb().from("experience").update({position:m.position,organization:m.organization,location:m.location,start_date:m.startDate,end_date:m.endDate,responsibilities:m.responsibilities,skills_used:m.skillsUsed,sort_order:m.order}).eq("id",id).select("*").single()));}
export async function deleteExperience(id:string){const r=await getDb().from("experience").delete().eq("id",id).select("id");if(r.error)throw new Error(r.error.message);return !!r.data?.length;}

export async function listSkills(){return (unwrap(await getDb().from("skills").select("*").order("category",{ascending:true}).order("sort_order",{ascending:true})) as any[]).map(toSkill);}
export async function createSkill(data:Omit<Skill,"id">){const id=randomUUID();return toSkill(unwrapWrite(await getDb().from("skills").insert({id,name:data.name,category:data.category,sort_order:data.order}).select("*").single()));}
export async function updateSkill(id:string,data:Partial<Omit<Skill,"id">>){const old=await getDb().from("skills").select("*").eq("id",id).maybeSingle();if(old.error)throw new Error(old.error.message);if(!old.data)return null;const m={...toSkill(old.data),...data};return toSkill(unwrapWrite(await getDb().from("skills").update({name:m.name,category:m.category,sort_order:m.order}).eq("id",id).select("*").single()));}
export async function deleteSkill(id:string){const r=await getDb().from("skills").delete().eq("id",id).select("id");if(r.error)throw new Error(r.error.message);return !!r.data?.length;}

export async function listProjects(){return (unwrap(await getDb().from("projects").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false})) as any[]).map(toProject);}
export async function createProject(data:Omit<Project,"id"|"createdAt">){const id=randomUUID();return toProject(unwrapWrite(await getDb().from("projects").insert({id,title:data.title,description:data.description,role:data.role,methods:data.methods,date:data.date,external_url:data.externalUrl,document_id:data.documentId,sort_order:data.order}).select("*").single()));}
export async function updateProject(id:string,data:Partial<Omit<Project,"id"|"createdAt">>){const old=await getDb().from("projects").select("*").eq("id",id).maybeSingle();if(old.error)throw new Error(old.error.message);if(!old.data)return null;const m={...toProject(old.data),...data};return toProject(unwrapWrite(await getDb().from("projects").update({title:m.title,description:m.description,role:m.role,methods:m.methods,date:m.date,external_url:m.externalUrl,document_id:m.documentId,sort_order:m.order}).eq("id",id).select("*").single()));}
export async function deleteProject(id:string){const r=await getDb().from("projects").delete().eq("id",id).select("id");if(r.error)throw new Error(r.error.message);return !!r.data?.length;}

export async function listCertifications(){return (unwrap(await getDb().from("certifications").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false})) as any[]).map(toCertification);}
export async function createCertification(data:Omit<Certification,"id"|"createdAt">){const id=randomUUID();return toCertification(unwrapWrite(await getDb().from("certifications").insert({id,title:data.title,issuer:data.issuer,date:data.date,verification_url:data.verificationUrl,document_id:data.documentId,sort_order:data.order}).select("*").single()));}
export async function updateCertification(id:string,data:Partial<Omit<Certification,"id"|"createdAt">>){const old=await getDb().from("certifications").select("*").eq("id",id).maybeSingle();if(old.error)throw new Error(old.error.message);if(!old.data)return null;const m={...toCertification(old.data),...data};return toCertification(unwrapWrite(await getDb().from("certifications").update({title:m.title,issuer:m.issuer,date:m.date,verification_url:m.verificationUrl,document_id:m.documentId,sort_order:m.order}).eq("id",id).select("*").single()));}
export async function deleteCertification(id:string){const r=await getDb().from("certifications").delete().eq("id",id).select("id");if(r.error)throw new Error(r.error.message);return !!r.data?.length;}

export async function listDocuments(opts:{publicOnly?:boolean}={}){let q=getDb().from("documents").select("*").order("uploaded_at",{ascending:false});if(opts.publicOnly)q=q.eq("is_public",true);return (unwrap(await q) as any[]).map(toDoc);}
export async function getDocument(id:string){const r=await getDb().from("documents").select("*").eq("id",id).maybeSingle();if(r.error)throw new Error(r.error.message);return r.data?toDoc(r.data):null;}
export async function createDocument(data:Omit<Doc,"id"|"uploadedAt">){const id=randomUUID();return toDoc(unwrapWrite(await getDb().from("documents").insert({id,title:data.title,description:data.description,category:data.category,file_url:data.fileUrl,external_url:data.externalUrl,file_name:data.fileName,file_type:data.fileType,file_size:data.fileSize,is_public:data.isPublic}).select("*").single()));}
export async function updateDocument(id:string,data:Partial<Omit<Doc,"id"|"uploadedAt">>){const old=await getDocument(id);if(!old)return null;const m={...old,...data};return toDoc(unwrapWrite(await getDb().from("documents").update({title:m.title,description:m.description,category:m.category,file_url:m.fileUrl,external_url:m.externalUrl,file_name:m.fileName,file_type:m.fileType,file_size:m.fileSize,is_public:m.isPublic}).eq("id",id).select("*").single()));}
export async function deleteDocument(id:string){const r=await getDb().from("documents").delete().eq("id",id).select("id");if(r.error)throw new Error(r.error.message);return !!r.data?.length;}

export async function listMessages(){return (unwrap(await getDb().from("contact_messages").select("*").order("created_at",{ascending:false})) as any[]).map(toMessage);}
export async function createMessage(data:Omit<ContactMessage,"id"|"createdAt"|"isRead">){const id=randomUUID();return toMessage(unwrapWrite(await getDb().from("contact_messages").insert({id,name:data.name,email:data.email,subject:data.subject,message:data.message}).select("*").single()));}
export async function markMessageRead(id:string,isRead:boolean){const r=await getDb().from("contact_messages").update({is_read:isRead}).eq("id",id).select("id");if(r.error)throw new Error(r.error.message);return !!r.data?.length;}
export async function deleteMessage(id:string){const r=await getDb().from("contact_messages").delete().eq("id",id).select("id");if(r.error)throw new Error(r.error.message);return !!r.data?.length;}

export async function listGalleryItems(opts:{publicOnly?:boolean}={}){let q=getDb().from("gallery_items").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:false});if(opts.publicOnly)q=q.eq("is_public",true);return (unwrap(await q) as any[]).map(toGallery);}
export async function createGalleryItem(data:Omit<GalleryItem,"id"|"createdAt">){const id=randomUUID();return toGallery(unwrapWrite(await getDb().from("gallery_items").insert({id,title:data.title,image_url:data.imageUrl,caption:data.caption,sort_order:data.order,is_public:data.isPublic}).select("*").single()));}
export async function updateGalleryItem(id:string,data:Partial<Omit<GalleryItem,"id"|"createdAt">>){const old=await getDb().from("gallery_items").select("*").eq("id",id).maybeSingle();if(old.error)throw new Error(old.error.message);if(!old.data)return null;const m={...toGallery(old.data),...data};return toGallery(unwrapWrite(await getDb().from("gallery_items").update({title:m.title,image_url:m.imageUrl,caption:m.caption,sort_order:m.order,is_public:m.isPublic}).eq("id",id).select("*").single()));}
export async function deleteGalleryItem(id:string){const r=await getDb().from("gallery_items").delete().eq("id",id).select("id");if(r.error)throw new Error(r.error.message);return !!r.data?.length;}

export async function listNavigationItems(opts:{visibleOnly?:boolean}={}){let q=getDb().from("navigation_items").select("*").order("sort_order",{ascending:true}).order("created_at",{ascending:true});if(opts.visibleOnly)q=q.eq("is_visible",true);return (unwrap(await q) as any[]).map(toNavigation);}
export async function createNavigationItem(data:Omit<NavigationItem,"id"|"createdAt">){const id=randomUUID();return toNavigation(unwrapWrite(await getDb().from("navigation_items").insert({id,label:data.label,href:data.href,sort_order:data.order,is_visible:data.isVisible}).select("*").single()));}
export async function updateNavigationItem(id:string,data:Partial<Omit<NavigationItem,"id"|"createdAt">>){const old=await getDb().from("navigation_items").select("*").eq("id",id).maybeSingle();if(old.error)throw new Error(old.error.message);if(!old.data)return null;const m={...toNavigation(old.data),...data};return toNavigation(unwrapWrite(await getDb().from("navigation_items").update({label:m.label,href:m.href,sort_order:m.order,is_visible:m.isVisible}).eq("id",id).select("*").single()));}
export async function deleteNavigationItem(id:string){const r=await getDb().from("navigation_items").delete().eq("id",id).select("id");if(r.error)throw new Error(r.error.message);return !!r.data?.length;}

export async function getSettings(){const r=await getDb().from("site_settings").select("*").eq("id","singleton").maybeSingle();if(r.error)throw new Error(r.error.message);if(!r.data){return toSettings(unwrapWrite(await getDb().from("site_settings").insert({id:"singleton"}).select("*").single()));}return toSettings(r.data);}
export async function updateSettings(data:Partial<Omit<SiteSettings,"id">>){const c=await getSettings();const m={...c,...data};return toSettings(unwrapWrite(await getDb().from("site_settings").update({site_title:m.siteTitle,meta_description:m.metaDescription,og_image_url:m.ogImageUrl,primary_color_note:m.primaryColorNote}).eq("id","singleton").select("*").single()));}

export async function countAdmins(){const r=await getDb().from("admin_users").select("id",{count:"exact",head:true});if(r.error)throw new Error(r.error.message);return r.count||0;}
export async function findAdminByEmail(email:string){const r=await getDb().from("admin_users").select("*").eq("email",email.toLowerCase().trim()).maybeSingle();if(r.error)throw new Error(r.error.message);return r.data?toAdmin(r.data):null;}
export async function findAdminById(id:string){const r=await getDb().from("admin_users").select("*").eq("id",id).maybeSingle();if(r.error)throw new Error(r.error.message);return r.data?toAdmin(r.data):null;}
export async function createAdmin(email:string,passwordHash:string,name:string){const id=randomUUID();return toAdmin(unwrapWrite(await getDb().from("admin_users").insert({id,email:email.toLowerCase().trim(),password_hash:passwordHash,name}).select("*").single()));}
export async function touchAdminLogin(id:string){const r=await getDb().from("admin_users").update({last_login_at:new Date().toISOString()}).eq("id",id);if(r.error)throw new Error(r.error.message);}
