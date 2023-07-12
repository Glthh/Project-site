// acessar http://localhost:3000
const express = require('express')
const router = require('express').Router()
const app = express()
const fetch = require("node-fetch")
const axios = require("axios")
const cheerio = require('cheerio')
const fs = require('fs')
const requestIp = require('request-ip')
const { Youtube } = require('ytdownloader.js')
const yts = require('yt-search'); 
var gerarnick = require('./lib/gerarnick.js')
const input = require("input");
const cors = require('cors');
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const { NewMessage } = require("telegram/events");

__path = process.cwd()

async function puxar(url) {
he = await fetch(url).then(c => c.json())
 return he
}


var translate = (text, lang) => { return new Promise(async (resolve, reject) => { trans(text, { conn: 'gtx', to: lang }).then((res) => resolve(res.text)).catch((err) => reject(err)) });}


//scrapers 
//tiktok
function ttk(query) {
return new Promise(async(resolve,reject) => {
axios.get('https://urlebird.com/pt/user/' + query + '/')
.then(html => {
const pp = cheerio.load(html.data);
let resultado = []
pp(".main").each(function(_,item) {
const nome = pp(item).find("h1").text();
const usernome = pp(item).find("h5").text();
const bio = pp(item).find("p").text();
const likes = pp(item).find(".col-auto").text();
const seguindo = pp(item).find(".d-none").text();
const seguidores = pp(item).find(".col-7").text();
const perfil = pp(item).find("img").attr("src");
const dados = {nome,usernome,bio,likes,seguindo,seguidores,perfil};
resultado.push(dados);
})
resolve({resultado});
}).catch(err => {
reject(err);
})
})
};

//Ytb pesquisa
async function ytSearch(query) {
    return new Promise((resolve, reject) => {
        try {
            const cari = yts(query)
            .then((data) => {
                res = data.all
                return res
            })
            resolve(cari)
        } catch (error) {
            reject(error)
        }
        console.log(error)
    })
}
//keys
  
 
  const apiKeysFile = fs.readFileSync('./keys.json');
  const keyprem = JSON.parse(apiKeysFile);
  //const validApiKey = apiKeys.find(key => key.key === req.query.token && key.expiresAt > Date.now());


app.use(
  express.urlencoded({
    extended: true,
  }),
)

app.use(express.json())




// Middleware para obter o endereço IP do cliente
app.use(requestIp.mw());
app.use((req, res, next) => {
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const apiPath = req.path;
  const ApiToken = req.query.token;
  const clientUserAgent = req.get('User-Agent');
const clientModel = req.header('X-Client-Model');
  
  console.log('-----[Log detectado! Info abaixo]-----')
  console.log('IP', clientIP);
  console.log('Caminho da API:', apiPath);
  console.log('Token:', ApiToken),
    console.log('Modelo do celular:', clientModel);
  console.log('Agent:', clientUserAgent);
  console.log("--------------------------------------")

  next();
});

// ConsultasMkBuscas
// FAMILIACNXCONTINENCIAOFC

const Grupos = [
	{ chat: "FAMILIACNXCONTINENCIAOFC", bot: "MkBuscasRobot" },
	{ chat: "puxadas_nbs", bot: "MkBuscasRobot" },
];

//COLOCA SEUS BAGULHO AQ

const apiId = "28799801"; //https://my.telegram.org/auth
const apiHash = "9f3765ba578a2607732885e04566d976"; //https://my.telegram.org/auth
const stringSession = new StringSession("1AQAOMTQ5LjE1NC4xNzUuNTEBu4dixmylIWQWP2/WluzJc5rvuNulb/SWJ8nDqIUqzCOvCobk7RfPjg6CrVyZZQmsXr/Cwt+2qAqNXP7rVqKHgs6J4b8t9F53QJoJCQYt0HP7I50zi9dvZNm8DbMYG/Pd2lIa9Zg0b6JG9BfyY8eNYUPdwsgHOSwT6AAlwYeFrCFE9UalLjupAg8cdk50NpzqOr2TRFpKcq3SQwXkFua/ANJgM/4GKEZlrByF2Rl1ogoA718v/ysIsdukOAH/M6onrkfZgotKfhGYqpnuyB29VJOBRjf0Yoaar0ulJ9k7VV5WOW1kXZkyyepG9f5ELJWk1f06RKQCWrqt4ty476nRbwM=")

//FIM

const telegram = new TelegramClient(stringSession, apiId, apiHash, {
	connectionRetries: 5
});

(async () => {
	await telegram.start({
		phoneNumber: "5518996998971", // SEU NUMERO DE TELEFONE AQUI DA CONTA DO TELEGRAM QUE DESEJA USAR!
		password: async () => await input.text("insira sua senha: "),
		phoneCode: async () =>
			await input.text("Insira o codigo recebido no seu telegram: "),
		onError: (err) => console.log(err)
	});
	console.log("TELEGRAM: Conectado com sucesso!");
	console.log(telegram.session.save());
	await telegram.sendMessage("me", { message: "To Online!" });
})();


// EXEMPLO DE COMO USAR A API

// HTTPS://LOCALHOST:8080/CPF1/O CPF AQUI

// TIPOS DE CONSULTAS DISPONÍVEIS:
// cpf1|cpf2|cpf3|cpf4|tel1|tel2|tel3|cnpj|score|nome|parentes|beneficios|placa1|vizinhos|site|ip|cep|bin|email

//FIM

function ApiKeyAut(req, res, next) {
const token = req.query.token;
const ApiKeyB = keyprem.find(key => key.token === token);
if (!token) {
return res.status(401).json({ message: '⚠️ falta do parâmetro token - coloque o paramentro token.' });
}
if (!ApiKeyB) {
return res.status(401).json({ message: '✖️ token Inválido - Entre em contato com o wa.me//557798099697 para solucionar o problema ou registrar seu token.' });
}
const now = new Date();
const TempoDeIns = new Date(ApiKeyB.TempoDeIns);
if (now > TempoDeIns) {
return res.status(401).json({ message: '⌚ token expirado - Entre em contato com o wa.me//557798099697 para solucionar o problema.' });
}
next();
}

app.get('/', (req, res) => {
    res.sendFile(__path + '/front-end/index.html')
})

app.get('/api/addtoken', async (req, res) => {
tokenadd = req.query.tokenadd
exptemp = req.query.exptemp
senha = req.query.senha
senhaadm = ["admGostosaoOfc"]
if (!tokenadd) { return res.status(401).json({ message: '⚠️ falta do parâmetro tokenadd - coloque o paramentro tokenadd.' });}
if (!exptemp) { return res.status(401).json({ message: '⚠️ falta do parâmetro exptemp - coloque o paramentro exptemp.' });}
if (!senha) { return res.status(401).json({ message: '⚠️ falta do parâmetro senha - coloque o paramentro senha.' });}
if(!senha.includes(senhaadm))return res.json({status:false,msg:'Senha inválida!!! koe parceiro, se não for adm vaza daqui 🧐'})
const now = new Date();
keyprem.push({
token: tokenadd,
TempoDeIns: exptemp,
});
fs.writeFileSync('./keys.json', JSON.stringify(keyprem))
res.json({ tokenadd, exptemp });
});

app.get('/api/deltoken', (req, res) => {
const tokendel = req.query.tokendel;
const senha = req.query.senha;
const senhaadm = ["admGostosaoOfc"];
if (!tokendel) {
return res.status(401).json({ message: '⚠️ Falta do parâmetro tokendel - Informe o parâmetro tokendel.' });
}
if (!senha) {
return res.status(401).json({ message: '⚠️ Falta do parâmetro senha - Informe o parâmetro senha.' });
}
if (!senhaadm.includes(senha)) {
    return res.json({ status: false, msg: 'Senha inválida!!! Apenas administradores podem executar esta ação.' });
}
const keyIndex = keyprem.findIndex(key => key.token === tokendel);
if (keyIndex === -1) {
return res.status(404).json({ message: 'API Key não encontrada.' });
}
keyprem.splice(keyIndex, 1);
fs.writeFileSync('./keys.json', JSON.stringify(keyprem));
res.json({ message: 'API Key removida com sucesso.' });
});

app.get('/puxar/tel', ApiKeyAut, async (req, res) => {
telefone = req.query.telefone
if(!telefone)return res.json({
status:false,
motivo:'Coloque o parâmetro: telefone'
})
token = req.query.token;
info = await puxar(`https://akame-apis-5c50b33dd212.herokuapp.com/puxar/tel?token=key-akame&telefone=${telefone}`)
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado:`『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑻𝑬𝑳𝑬𝑭𝑶𝑵𝑰𝑪𝑨 🕵️』\n\n${info.resultado}`
})
})

app.get('/puxar/tel2',  ApiKeyAut, async (req, res) => {
telefone = req.query.telefone
if(!telefone)return res.json({
status:false,
motivo:'Coloque o parâmetro: telefone'
})
token = req.query.token;
info = await puxar(`https://api7.x10.bz/index.php?token=api7-fj9wotewpw&base=telefone&telefone=${telefone}`)

if (info.message === 'telefone nao encontrado no banco de dados') {
res.json({status:false, resultado:'Telefone não encontrado no banco de dados'})
} else {
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado:`『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑻𝑬𝑳𝑬𝑭𝑶𝑵𝑰𝑪𝑨 🕵️』\n\nOPERADORA: ${info.operadora}\n\n👤 INFORMAÇÕES PESSOAIS\n\nNOME: ${info.nome}\nCPF: ${info.cpf}\n\n🏘️ ENDEREÇO\n\nLOGRADOURO: ${info.logradouro}\nNÚMERO: ${info.numero}\nCOMPLEMENTO: ${info.complemento}\nBAIRRO: ${info.bairro}\nCIDADE: ${info.cidade}\nESTADO: ${info.estado}\nCEP: ${info.cep}`
})
}
})

app.get('/puxar/placa', ApiKeyAut, async (req, res) => {
placa = req.query.placa
if(!placa)return res.json({
status:false,
motivo:'Coloque o parâmetro: placa'
})
token = req.query.token;
info = await puxar(`https://akame-apis-5c50b33dd212.herokuapp.com/puxar/placa?token=key-akame&placa=${placa}`)
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado:`『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑷𝑳𝑨𝑪𝑨 🕵️』\n\n${info.resultado}`
})
})

app.get('/puxar/nome', ApiKeyAut, async (req, res) => {
nome = req.query.nome
if(!nome)return res.json({
status:false,
motivo:'Coloque o parâmetro: nome'
})
token = req.query.token;
info = await puxar(`https://akame-apis-5c50b33dd212.herokuapp.com/puxar/nome?token=key-akame&nome=${nome}`)
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado:`『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑵𝑶𝑴𝑬 🕵️』\n\n${info.resultado}`
})
})

app.get('/puxar/score', ApiKeyAut, async (req, res) => {
cpf = req.query.cpf
if(!cpf)return res.json({
status:false,
motivo:'Coloque o parâmetro: cpf'
})
token = req.query.token;
info = await puxar(`https://akame-apis-5c50b33dd212.herokuapp.com/puxar/score?token=key-akame&cpf=${cpf}`)
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado:`『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑺𝑪𝑶𝑹𝑬 🕵️』\n\n${info.resultado}`
})
})

app.get('/puxar/beneficios', ApiKeyAut, async (req, res) => {
cpf = req.query.cpf
if(!cpf)return res.json({
status:false,
motivo:'Coloque o parâmetro: cpf'
})
token = req.query.token;
info = await puxar(`https://akame-apis-5c50b33dd212.herokuapp.com/puxar/beneficios?token=key-akame&cpf=${cpf}`)
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado:`『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑩𝑬𝑵𝑬𝑭𝑰𝑪𝑰𝑶𝑺 🕵️』\n\n${info.resultado}`
})
})

app.get('/puxar/cpf', ApiKeyAut, async (req, res) => {
cpf = req.query.cpf
if(!cpf)return res.json({
status:false,
motivo:'Coloque o parâmetro: cpf'
})
token = req.query.token;
info = await puxar(`https://tokyo-puxadas-df3241176465.herokuapp.com/puxar/cpf2?token=key-akame&cpf=${cpf}`)
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado:`『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑪𝑷𝑭 🕵️』\n\n${info.resultado}`
})
})

app.get('/puxar/cpf2', ApiKeyAut, async (req, res) => {
cpf = req.query.cpf
if(!cpf)return res.json({
status:false,
motivo:'Coloque o parâmetro: cpf'
})
token = req.query.token;
info = await puxar(`https://api7.x10.bz/index.php?token=api7-fj9wotewpw&base=cpf&cpf=${cpf}`)

if (info.cpf === undefined) {
res.json({status:false, resultado:'cpf não encontrado no banco de dados'})
} else {
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado:`『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑪𝑷𝑭 🕵️』\n\n👤 DADOS PESSOAIS\n\nNOME: ${info.nome}\nCPF: ${info.cpf}\nRG: ${info.rg}\nÓRGÃO: ${info.orgão_rg}\nUF: ${info.uf_rg}\nEMISSÃO: ${info.emissão_rg}\nCNS: ${info.cns}\nNASCIMENTO: ${info.nascimento}\nIDADE: ${info.idade}\nSIGNO: ${info.signo}\nCIDADE NATAL: ${info.cidade_nascimento}\nSEXO: ${info.sexo}\n\n👫 DADOS DO PAI E DA MÃE\n\nPAI: ${info.pai}\nMÃE: ${info.mae}\n\n🚸 ENDEREÇO\n\n${info.endereço}\nBAIRRO: ${info.bairro}\nNÚMERO: ${info.número}\nCIDADE: ${info.cidade}\n\n🏘 ️VIZINHOS \n\n${info.vizinho_1}\n${info.vizinho_2}\n${info.vizinho_3}\n${info.vizinho_4}`
})
}
})

app.get('/puxar/cns', ApiKeyAut, async (req, res) => {
cns = req.query.cns
if(!cns)return res.json({
status:false,
motivo:'Coloque o parâmetro: cns'
})
token = req.query.token;
info = await puxar(`https://api7.x10.bz/index.php?token=api7-fj9wotewpw&base=cns&cns=${cns}`)

if (info.cns === undefined) {
res.json({status:false, resultado:'cns não encontrado no banco de dados'})
} else {
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado:`『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑪𝑵𝑺 🕵️』\n\n👤 DADOS PESSOAIS\n\nNOME: ${info.nome}\nCPF: ${info.cpf}\nRG: ${info.rg}\nÓRGÃO: ${info.orgão_rg}\nUF: ${info.uf_rg}\nEMISSÃO: ${info.emissão_rg}\nCNS: ${info.cns}\nNASCIMENTO: ${info.nascimento}\nIDADE: ${info.idade}\nSIGNO: ${info.signo}\nCIDADE NATAL: ${info.cidade_nascimento}\nSEXO: ${info.sexo}\n\n👫 DADOS DO PAI E DA MÃE\n\nPAI: ${info.pai}\nMÃE: ${info.mae}\n\n🚸 ENDEREÇO\n\n${info.endereço}\nBAIRRO: ${info.bairro}\nNÚMERO: ${info.número}\nCIDADE: ${info.cidade}\n\n🏘 ️VIZINHOS \n\n${info.vizinho_1}\n${info.vizinho_2}\n${info.vizinho_3}\n${info.vizinho_4}`
})
}
})

app.get('/puxar/cnpj', ApiKeyAut, async (req, res) => {
cnpj = req.query.cnpj
if(!cnpj)return res.json({
status:false,
motivo:'Coloque o parâmetro: cnpj'
})
token = req.query.token;
await puxar(`https://bryan-api.bryan00066.repl.co/api/search/cnpj?cnpj=${cnpj}&token=bryan23`)
.then(info => {
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado:`『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑪𝑵𝑷𝑱 🕵️』\n\nCNPJ: ${info.resultado.cnpj_query}\nNOME: ${info.resultado.nome}\nFANTASIA: ${info.resultado.fantasia}\nTELEFONE: ${info.resultado.telefone}\nSITUAÇÃO: ${info.resultado.situacao}\nSTATUS: ${info.resultado.status}\nABERTURA: ${info.resultado.abertura}\nTIPO: ${info.resultado.tipo}\nNÚMERO: ${info.resultado.numero}\nCAPITAL SOCIAL: ${info.resultado.capital_social}\nCEP: ${info.resultado.cep}\nEMAIL: ${info.resultado.email}\nPORTE: ${info.resultado.porte}\nBAIRRO: ${info.resultado.bairro}\nLOGRADOURO: ${info.resultado.logradouro}\nUF: ${info.resultado.uf}\nCOMPLEMENTO: ${info.resultado.complemento}`
})
}).catch(e => {
console.log(e)
res.json({status:false, resultado:'cnpj não encontrado no banco de dados'})
})
})

app.get('/puxar/bin', ApiKeyAut, async (req, res) => {
bin = req.query.bin
if(!bin)return res.json({
status:false,
motivo:'Coloque o parâmetro: bin'
})
token = req.query.token;
await puxar(`https://bryan-api.bryan00066.repl.co/api/search/bin?bin=${bin}&token=bryan23`)
.then(info => {
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado:`『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑩𝑰𝑵 🕵️』\n\nBANCO: ${info.resultado.nome}\nTELEFONE: ${info.resultado.telefone}\nCOMPRIMENTO: ${info.resultado.length}\nNUMERO: ${info.resultado.numeric}\nPAIS: ${info.resultado.alpha2}\nDINHEIRO: ${info.resultado.currency}\nLATITUDE: ${info.resultado.latitude}\nLONGITUDE: ${info.resultado.longitude}`
})
}).catch(e => {
console.log(e)
res.json({status:false, resultado:'bin não encontrado no banco de dados'})
})
})


app.get('/puxar/cep', ApiKeyAut, async (req, res) => {
cep = req.query.cep
if(!cep)return res.json({
status:false,
motivo:'Coloque o parâmetro: cep'
})
token = req.query.token;
auu = await puxar(`https://viacep.com.br/ws/${cep}/json/`)
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
  
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


app.get('/puxar/ip', ApiKeyAut, async (req, res) => {
ip = req.query.ip
if(!ip)return res.json({
status:false,
motivo:'Coloque o parâmetro: ip'
})
token = req.query.token;
auu = await puxar(`https://ipinfo.io/${ip}/json`)
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
  
resultado: {
ip: `${auu.ip}`,
cidade: `${auu.city}`,
regiao: `${auu.region}`,
latlong: `${auu.loc}`,
org: `${auu.org}`,
timezone: `${auu.timezone}`
}
})
})

app.get('/puxar/tiktok', async(req, res, next) => {
token = req.query.token;
q = req.query.q
ttk(q).then(resultado => {
res.json({
status: true,
código: 200,
criador: `Annônimo & stutis`,
perfil: resultado
})}).catch(e => {
console.log(e)
res.json({
msg: `Erro no Servidor Interno`
})})})


app.get('/gerar/buzon55', ApiKeyAut, async (req, res) => {
token = req.query.token;
cp1 = `${Math.floor(Math.random() * 999) + 1000}`
cp4 = `${Math.floor(Math.random() * 99) + 10}`
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado: {
numero: `+55 11 947${cp4}-${cp1}`,
}
})
})

app.get('/gerar/cc', ApiKeyAut, async (req, res) => {
token = req.query.token;
ra = await puxar(`https://api7.x10.bz/index.php?token=api7-fj9wotewpw&base=geradorCC&cc=544315&mes=01&ano=2024&cvv=086`)
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado: `${ra.ccs}`,
})
})

app.get('/gerar/nick', ApiKeyAut, async (req, res) => {
token = req.query.token
let nome = req.query.nome || res.json({msg: 'insira o parâmetro: ?nome='})
await gerarnick(nome)
.then(nicks => {
res.send(nicks) 
}).catch(e => {
res.json({erro:'internal server error'})
})
})

app.get('/gerar/cpf', ApiKeyAut, async (req, res) => {
token = req.query.token;
cp1 = `${Math.floor(Math.random() * 300) + 600}`
cp2 = `${Math.floor(Math.random() * 300) + 600}`
cp3 = `${Math.floor(Math.random() * 300) + 600}`
cp4 = `${Math.floor(Math.random() * 30) + 60}`
cpf = `${cp1}.${cp2}.${cp3}-${cp4}`
res.json({
status: true,
código: 999,
criador: `Annônimo & stutis`,
resultado: {
cpf: `${cpf}`,
}
})
})

app.get('/buscar/chatgpt', async (req,res) => {
pergunta = req.query.pergunta
if(!pergunta)return res.json({
status:false,
msg:'Cade o parametro pergunta??'
})
token = req.query.token
await puxar(`https://api2.haji-api.ir/gpt/gpt.php?text=${pergunta}`)
.then(e => {
res.json({
status:true,
criador:'Annônimo & stutis',
resultado: e.result.answer
})
}).catch(e => {
console.log(e)
res.json({erro:'Erro no Servidor Interno'})
})
})

app.get('/api/ytmp3', async (req,res) => {
url = req.query.url
if(!url)return res.json({
status:false,
msg:'Cade o parametro url??'
})
token = req.query.token
await new Youtube().ytmp3(url)
.then(e => {
res.json({
status:true,
criador:'Annônimo & stutis',
resultado:e
})
}).catch(e => {
console.log(e)
res.json({erro:'Erro no Servidor Interno'})
})
})



app.get('/api/ytplaymp3', async (req,res) => {
nome = req.query.nome
if(!nome)return res.json({
status:false,
msg:'Cade o parametro nome??'
})
token = req.query.token
await yts(nome)
.then((data) => {
new Youtube().ytmp3(data.all[0].url)
.then((f) => {
res.json({
status:true,
criador:'Annônimo & stutis',
segundos: data.all[0].timestamp,
vizu: data.all[0].views,
resultado:f
})
})
}).catch(e => {
console.log(e)
res.json({erro:'Erro no Servidor Interno'})
})
})

app.get('/api/ytplaymp3v2', async (req,res) => {
nome = req.query.nome
if(!nome)return res.json({
status:false,
msg:'Cade o parametro nome??'
})
token = req.query.token
await yts(nome)
.then((data) => {
let { yta } = require('./lib/y2mate')
 yta(`${data.all[0].url}`, 'mp3')
.then((f) => {
res.json({
status:true,
criador:'Annônimo & stutis',
resultado:f
})
})
}).catch(e => {
console.log(e)
res.json({erro:'Erro no Servidor Interno'})
})
})

app.get('/api/ytmp4', async (req,res) => {
url = req.query.url
if(!url)return res.json({
status:false,
msg:'Cade o parametro url??'
})
token = req.query.token
await new Youtube().ytmp4(url)
.then(e => {
res.json({
status:true,
criador:'Annônimo & stutis',
resultado:e
})
}).catch(e => {
console.log(e)
res.json({erro:'Erro no Servidor Interno'})
})
})

app.get('/api/ytsrc',(req,res) => {
q = req.query.q
if(!q)return res.json({
status:false,
msg:'Cade o parametro q??'
})
token = req.query.token
ytSearch(q)
.then(e => {
res.json({
status:true,
criador:' Annônimo & stutis',
resultado:e
})
}).catch(e => {
res.json({erro:'Erro no Servidor Interno'})
})
})

app.get("/:type/:q/", ApiKeyAut, async (req, res) => {
	var db = JSON.parse(fs.readFileSync("db.json"));
    var achou2 = false;
	const type = req.params.type.toLowerCase() || '';
	const query = req.params.q.toLowerCase() || '';

 if (!query) return res.json({
                 status: true,

               "resultado": {
               "str": "[❌] Ensira o tipo de consulta [❌]"
               }
             })
 if (type.search(/cpf1|cpf2|cpf3|cpf4|tel1|tel2|tel3|cnpj|score|nome|parentes|beneficios|placa1|vizinhos|site|ip|cep|bin|email/) === -1) return res.send('Tipo de consulta invalida');
	console.log(`[CONSULTA] : ${type} = ${query}`);
	if (db && db[type] && db[type][query]) return res.send(db[type][query]);

	const Consultar = {
		nego() {
			if (query.length != 11) return res.json({err:'O CPF deve conter 11 digitos!'})

			telegram.sendMessage(Grupos[0].chat, {
				message: `/cpf2 ${query}`
			})
				.catch((e) => res.json({
                 status: true,

               "resultado": {
               "str": "[❌] Não foi possível fazer consulta.[❌]"
               }
             })
				);
		}
	}
	if (Consultar[type]) Consultar[type]();
	else await telegram.sendMessage(Grupos[0].chat, {
		message: `/${type} ${query}`
	})
		.catch((e) =>{
			res.json({
                 status: true,

               "resultado": {
               "str": "[❌] Não foi possível fazer consulta.[❌]"
               }
             })

			console.log("DEBUG NO CÓDIGO:",e)
		});
	async function OnMsg(event) {
		const message = event.message;
		const textPure =
			message && message.text ?
			message.text :
			message && message.message ?
			message.message : '';
		const text =
			message && message.text ?
			message.text.toLowerCase() :
			message && message.message ?
			message.message.toLowerCase() : '';
		const msgMarked = await message.getReplyMessage();
		const msgMarkedText =
			msgMarked && msgMarked.text ?
			msgMarked.text.toLowerCase() :
			msgMarked && msgMarked.message ?
			msgMarked.message.toLowerCase() : '';
		const sender = await message.getSender();
		const senderId = sender && sender.username ? sender.username : '';
		const chat = await message.getChat();
		const chatId = chat && chat.username ? chat.username : '';
		msgggveri = msgMarkedText.replace(/\/|-|\.|\`|\*/g, '').toLowerCase()
				queryverii = query.replace(/\/|-|\.|\`|\*/g, '').toLowerCase()
				txtuuuveri = text.replace(/\/|-|\.|\`|\*/g, '').toLowerCase()
		for (let i of Grupos) {
			try {
				if ((chatId == i.chat && senderId == i.bot) && (msgggveri.includes(queryverii) || txtuuuveri.includes(queryverii) )) {
					achou2 = true;
					await telegram.markAsRead(chat);
					//console.log(`text: ${textPure}, msgMarked: ${msgMarkedText}`)
					if (text.includes("⚠️"))return res.json({
                 status: true,

               "resultado": {
               "str": "[⚠️] NÃO ENCONTRANDO! [⚠️]"
               }
             })
					if (text.includes("Inválido") || text.includes("INVÁLIDO"))
						res.json({
                 status: true,

               "resultado": {
               "str": "[⚠️] INVALIDO! [⚠️]"
               }
             })

				}

				if ((chatId == i.chat && senderId == i.bot) && (msgggveri.includes(queryverii) || txtuuuveri.includes(queryverii) )) {
					achou2 = true;
					await telegram.markAsRead(chat);
					let str = textPure;
					str = str.replace(/\*/gi, "");
					str = str.replace(/\`/gi, "");
					str = str.replace(/\+/gi, "");
					str = str.replace(/\[/gi, "");
					str = str.replace(/\]/gi, "");
					str = str.replace(/\(/gi, "");
					str = str.replace(/\)/gi, "");
					str = str.replace(/\•/gi, "");
					str = str.replace(/\n\n\n/gi, "\n\n");
					str = str.replace(/CONSULTA DE CPF 2 \n\n/gi, "『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑪𝑷𝑭 🕵️』");
					str = str.replace(/🔍 CONSULTA DE CPF1 COMPLETA 🔍/gi, "『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑪𝑷𝑭 🕵️』");
					str = str.replace(/🔍 CONSULTA DE CPF3 COMPLETA 🔍/gi, "『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑪𝑷𝑭 🕵️』");
					str = str.replace(/🔍 CONSULTA DE CPF 4 🔍/gi, "『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑪𝑷𝑭 🕵️』");
                    str = str.replace(/BY: @MkBuscasRobot/gi, "");
					str = str.replace(/\n\nUSUÁRIO: Annônimokkj/gi, '');
					str = str.replace(/USUÁRIO: Annônimokkj\n\n/gi, '');
					str = str.replace(/ USUÁRIO: Annônimokkj/gi, '');
					str = str.replace(/🔍|V1|V2/gi, '');
					str = str.replace(/__/gi, '');
					str = str.replace(/COMPLETA/gi, '');
					str = str.replace(/CONSULTA DE CPF 2/gi, '『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑪𝑷𝑭 🕵️』');
					str = str.replace(/\n\nBY: @MkBuscasRobot/gi, "");
					str = str.replace(/\n\nREF: @refmkbuscas/gi, '');
					str = str.replace(/\nREF: @refmkbuscas/gi, '');
					str = str.replace(/REF: @refmkbuscas/gi, '');
					str = str.replace(/EMPTY/gi, "");
					str = str.replace(/\n\n\n\n/gi, "\n\n");
					str = str.replace(/USUÁRIO: Annônimokkj/gi, '');
					str = str.replace(/ CONSULTA DE PLACA /gi, '『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑷𝑳𝑨𝑪𝑨 🕵️』');
					str = str.replace(/ CONSULTA DE TELEFONE /gi, '『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑻𝑬𝑳𝑬𝑭𝑶𝑵𝑰𝑪𝑨 🕵️』');
					str = str.replace(/ CONSULTA DE NOME /gi, '『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑵𝑶𝑴𝑬 🕵️』');
					str = str.replace(/ CONSULTA DE CNPJ /gi, '『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑪𝑵𝑷𝑱 🕵️』');
					str = str.replace(/ CONSULTA DE SCORE \n\n SCORE V3 SPC MOSAIC /gi, '『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑺𝑪𝑶𝑹𝑬 🕵️』');
					str = str.replace(/COMPLETA/gi, '');
					str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗖𝗣𝗙\n\n/gi, '');
					str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗣𝗟𝗔𝗖𝗔\n\n/gi, '『🔎 𝑪𝑶𝑵𝑺𝑼𝑳𝑻𝑨 𝑷𝑳𝑨𝑪𝑨 🕵️』');
					str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗧𝗘𝗟𝗘𝗙𝗢𝗡𝗘\n\n/gi, '');
					str = str.replace(/𝗖𝗢𝗡𝗦𝗨𝗟𝗧𝗔 𝗗𝗘 𝗡𝗢𝗠𝗘\n\n/gi, '');




					let json = {};
					const linhas = str.split("\n");
					for (const t of linhas) {
						const key = t.split(": ");
						key[0] = key[0]
							.replace(/\//g, " ")
							.toLowerCase()
							.replace(/(?:^|\s)\S/g, function (a) {
								return a.toUpperCase();
							})
							.replace(/ |•|-|•|/g, "");
						json[key[0]] = key[1];
					}
					if (db && db[type]) db[type][query] = str;
					else db[type] = {}, db[type][query] = str;
					fs.writeFileSync("db.json", JSON.stringify(db, null, "\t"));


					res.json({
                 status: true,

               "resultado": {
               str
               }
             })
				}
				return;
			} catch (e) {
				if (achou2) return;
				res.json({
                 status: true,

               "resultado": {
               "str": "internal server error"
               }
             })
				console.log(e);
			}
		}
	}
	telegram.addEventHandler(OnMsg, new NewMessage({}));
	setTimeout(() => {
		if (achou2) return;
		res.json({
                 status: true,

               "resultado": {
               "str": "expired response time"
               }
             })
	}, 220000);
});


app.get('*', function(req, res) {
res.status(404).json({
status:false,
msg: 'Página não encontrada no servidor, entre em contato com o donos'
})
})


app.listen(3000, () => {
console.log('Aplicativo aberto na porta 3000')
})

