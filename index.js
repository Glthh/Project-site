// acessar http://localhost:3000/createproduct
const express = require('express')
const router = require('express').Router()
const app = express()
const fetch = require("node-fetch")
__path = process.cwd()

async function puxar(url) {
he = await fetch(url).then(c => c.json())
 return he
}


var translate = (text, lang) => { return new Promise(async (resolve, reject) => { trans(text, { conn: 'gtx', to: lang }).then((res) => resolve(res.text)).catch((err) => reject(err)) });}



//keys  
const keyprem = ['biel']
const key = ['biel']


app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())


//rotas
/*app.get('/', (req, res) => {
  res.json({ message: 'Primeira rota criada com sucesso!' })
})*/

app.get('/', (req, res) => {
    res.sendFile(__path + '/front-end/index.html')
})

app.get('/puxar/cep', async (req, res) => {
cep = req.query.cep
if(!cep)return res.json({
status:false,
motivo:'Coloque o parâmetro: cep'
})
token = req.query.token;
if(!token)return res.json({status:false,msg:'- Cadê o parâmetro token?'})
if(!keyprem.includes(token))return res.json({status:false,msg:'Token inválido, entre em contato com os donos'})
auu = await puxar(`https://viacep.com.br/ws/${cep}/json/`)
res.json({
status: true,
código: 999,
criador: `Annônimo`,
  
resultado: {
cep: `${auu.cep}`,
logradouro: `${auu.logradouro}`,
uf: `${auu.uf}`,
ibge: `${auu.ibge}`,
gia: `${auu.gia}`,
ddd: `${auu.ddd}`,
siafi: `${auu.siafi}`
}
})
})


app.get('/gerar/buzon55', async (req, res) => {
token = req.query.token;
if(!token)return res.json({status:false,msg:'- Cadê o parâmetro token?'})
if(!key.includes(token))return res.json({status:false,msg:'Token inválido, entre em contato com os donos'})
cp1 = `${Math.floor(Math.random() * 999) + 1000}`
cp4 = `${Math.floor(Math.random() * 99) + 10}`
res.json({
status: true,
código: 999,
criador: `Annônimo`,
resultado: {
numero: `+55 11 947${cp4}-${cp1}`,
}
})
})




//arquivo nao encontrado 
app.get('*', function(req, res) {
res.status(404).json({
status:false,
msg: 'Página não encontrada no servidor, entre em contato com o donos'
})
})


app.listen(8000 () => {
console.log('Aplicativo aberto na porta 8000')
})
