let express = require('express')
let path = require('path')
let favicon = require('serve-favicon')
let logger = require('morgan')
let bodyParser = require('body-parser')
let webpack = require('webpack')
let manifestMaker = require('./template/manifest').default
const Client = require('kubernetes-client').Client;
const k8s_client = new Client({ config: require('kubernetes-client').config.getInCluster() });
const ns= 'plastic'

// 引入history模块
import history from 'connect-history-api-fallback'
// 正式环境时，下面两个模块不需要引入
import webpackDevMiddleware from 'webpack-dev-middleware'
//import webpackHotMiddleware from 'webpack-hot-middleware'

import config from '../../build/webpack.prod.conf'

const app = express()

// 引入history模式让浏览器进行前端路由页面跳转
app.use(history())

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

const compiler = webpack(config)
//webpack 中间件
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: { colors: true }
}))

//app.use(webpackHotMiddleware(compiler))

app.use(express.static(path.join(__dirname, 'views')))

app.get('/plastic', async function (req, res) {
  await k8s_client.loadSpec();
  try {
    await k8s_client.apis.v1.namespaces(ns).get()
  }
  catch (UnhandledPromiseRejectionWarning) {
    console.log(`Namespace [${ns}] not exist. Creating.`)
    if (!await createNamespace(ns)){
      res.send("Create Namespace Failed")
    }
  }
  let deploys
  let nodeIP
  let nodePort
  let apiRes=[]
  if (k8s_client.apis.apps.v1) {
    deploys = await k8s_client.apis
      .apps
      .v1
      .namespaces(ns)
      .deployments
      .get()
  } else {
    deploys = await k8s_client.apis
      .extensions
      .v1beta1
      .namespaces(ns)
      .deployments
      .get()
  }
  let nodes = await k8s_client.apis.v1.nodes.get()
  nodeIP = nodes.body.items[0].metadata["annotations"]['projectcalico.org/IPv4Address']
  nodeIP = nodeIP.substr(0, nodeIP.indexOf('/'))
  let deployItems=deploys.body.items
  for (let index=0; index < deployItems.length; index++) {
    let name = deployItems[index].metadata.name
    let service = await k8s_client.apis.v1.namespaces(ns).services(name).get()
    nodePort = service.body.spec['nodePort']
    apiRes.push({
      name: name,
      conn: `system/oracle@${nodeIP}:${nodePort}/xe`,
      badge: `http://badges.local.io/ns/plastic/deploy/${name}`
    })
  }
  res.send(apiRes)
})

const wrap = fn => (req, res, next) => fn(req, res).catch(next)
app.get('/create-plastic/:namespace', wrap(async (req, res) => {
  const create = await k8s_client.apis.v1.namespaces.post({ body: oracleManifest });
}))


async function createNamespace(ns) {
  let namespaceManifest = manifestMaker.createNamespaceManifest(ns)
  const create = await k8s_client.apis.v1.namespaces.post({ body: namespaceManifest });
  if (create.statusCode !== 201 ){
    console.log(`Create Namespace [${ns}] failed.`)
    console.log(namespaceManifest)
    console.log(create)
    return false
  }
  return true
}


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  console.log(err)
  res.send(err.message)
})

// 设置监听端口
const SERVER_PORT = 3000
app.listen(SERVER_PORT, () => {
  console.info(`服务已经启动，监听端口${SERVER_PORT}`)
})

export default app
