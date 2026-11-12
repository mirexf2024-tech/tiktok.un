const c=require('cloudinary').v2; // CLOUDINARY_URL ofumaan dubbisa
exports.uploadVideo=b=>new Promise((ok,no)=>c.uploader.upload_stream({resource_type:'video',folder:'tiktok-et'},(e,r)=>e?no(e):ok(r.secure_url)).end(b));
