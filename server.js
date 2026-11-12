require('dotenv').config();
const express=require('express'),cors=require('cors'),fs=require('fs'),path=require('path'),db=require('./db');
process.on('unhandledRejection',e=>console.error(e));
const app=express();app.use(cors(),express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use('/api/auth',require('./routes/auth'));
app.use('/api/videos',require('./routes/videos'));
app.use('/api/wallet',require('./routes/wallet'));
app.use('/api/creator',require('./routes/creator'));
app.use('/api/admin',require('./routes/admin'));
app.use((e,q,s,n)=>{console.error(e);s.status(500).json({error:'Dogoggora'})});
db.query(fs.readFileSync(path.join(__dirname,'schema.sql'),'utf8'))
 .then(()=>app.listen(process.env.PORT||3000,()=>console.log('Server ready')))
 .catch(e=>{console.error('DB dogoggora',e);process.exit(1)});
