const jwt=require('jsonwebtoken');
exports.auth=(q,s,n)=>{try{q.user=jwt.verify((q.headers.authorization||'').slice(7),process.env.JWT_SECRET);n()}catch{s.status(401).json({error:'Duraan seeni'})}};
exports.admin=(q,s,n)=>q.user.role==='admin'?n():s.status(403).json({error:'Admin qofa'});
