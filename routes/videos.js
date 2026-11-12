const r=require('express').Router(),multer=require('multer'),db=require('../db'),{auth}=require('../middleware/auth'),{uploadVideo}=require('../utils/cloudinary');
const up=multer({storage:multer.memoryStorage(),limits:{fileSize:50*1024*1024}});
r.use(auth);
r.post('/',up.single('video'),async(q,s)=>{if(!q.file)return s.status(400).json({error:'Video filadhu'});
try{const url=await uploadVideo(q.file.buffer);const{rows}=await db.query('insert into videos(user_id,url,caption) values($1,$2,$3) returning *',[q.user.id,url,(q.body.caption||'').slice(0,150)]);s.json(rows[0])}catch{s.status(500).json({error:'Ol-fe’uun hin milkoofne'})}});
r.get('/feed',async(q,s)=>{const{rows}=await db.query(`select v.*,u.name,(select count(*)::int from comments c where c.video_id=v.id) comments,
exists(select 1 from likes l where l.video_id=v.id and l.user_id=$1) liked,exists(select 1 from follows f where f.following_id=v.user_id and f.follower_id=$1) followed
from videos v join users u on u.id=v.user_id order by (v.likes*3+v.views)/power(extract(epoch from now()-v.created_at)/3600+2,1.2) desc,v.id desc limit 10 offset $2`,[q.user.id,+q.query.offset||0]);s.json(rows)});
r.post('/:id/view',async(q,s)=>{await db.query('update videos set views=views+1 where id=$1',[q.params.id]);s.json({ok:1})});
r.post('/:id/like',async(q,s)=>{const id=q.params.id,u=q.user.id;
const d=await db.query('delete from likes where video_id=$1 and user_id=$2',[id,u]);
if(d.rowCount){await db.query('update videos set likes=likes-1 where id=$1',[id]);return s.json({liked:false})}
await db.query('insert into likes values($1,$2)',[u,id]);await db.query('update videos set likes=likes+1 where id=$1',[id]);s.json({liked:true})});
r.get('/:id/comments',async(q,s)=>s.json((await db.query('select c.text,u.name from comments c join users u on u.id=c.user_id where c.video_id=$1 order by c.id desc limit 50',[q.params.id])).rows));
r.post('/:id/comments',async(q,s)=>{const t=(q.body.text||'').trim().slice(0,200);if(!t)return s.status(400).json({error:'Comment duwwaa dha'});
await db.query('insert into comments(video_id,user_id,text) values($1,$2,$3)',[q.params.id,q.user.id,t]);s.json({ok:1})});
r.post('/follow/:uid',async(q,s)=>{const f=q.user.id,t=+q.params.uid;if(f===t)return s.status(400).json({error:'Ofii hordofuu hin dandeessu'});
const d=await db.query('delete from follows where follower_id=$1 and following_id=$2',[f,t]);
if(d.rowCount)return s.json({followed:false});await db.query('insert into follows values($1,$2)',[f,t]);s.json({followed:true})});
module.exports=r;
