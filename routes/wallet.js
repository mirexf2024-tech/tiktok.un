const r=require('express').Router(),db=require('../db'),{auth}=require('../middleware/auth'),{GIFTS,FEE}=require('../config');
r.use(auth);
r.get('/gifts',(q,s)=>s.json(GIFTS));
r.post('/buy',async(q,s)=>{const c=Math.floor(+q.body.coins);if(!(c>=10)||!q.body.ref)return s.status(400).json({error:'Coins 10+ fi ref galchi'});
await db.query('insert into coin_orders(user_id,coins,ref) values($1,$2,$3)',[q.user.id,c,String(q.body.ref).slice(0,40)]);s.json({ok:1})});
r.post('/gift',async(q,s)=>{const g=GIFTS[q.body.gift];if(!g)return s.status(400).json({error:'Gift hin jiru'});
const v=await db.query('select user_id from videos where id=$1',[q.body.videoId]);if(!v.rows[0])return s.status(404).json({error:'Video hin argamne'});
const to=v.rows[0].user_id;if(to===q.user.id)return s.status(400).json({error:'Ofiif gift hin ergitu'});
const c=await db.connect();
try{await c.query('begin');
const p=await c.query('update users set coins=coins-$1 where id=$2 and coins>=$1 returning id',[g.coins,q.user.id]);
if(!p.rowCount){await c.query('rollback');return s.status(400).json({error:'Coins ga’aa miti'})}
await c.query('update users set earned=earned+$1 where id=$2',[Math.floor(g.coins*(1-FEE)),to]);
await c.query('insert into gifts(from_id,to_id,video_id,gift,coins) values($1,$2,$3,$4,$5)',[q.user.id,to,q.body.videoId,q.body.gift,g.coins]);
await c.query('commit');s.json({ok:1})}catch{await c.query('rollback');s.status(500).json({error:'Dogoggora'})}finally{c.release()}});
module.exports=r;
