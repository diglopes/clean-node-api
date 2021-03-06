const helmet = require('../middlewares/helmet')
const cors = require('../middlewares/cors')
const jsonParser = require('../middlewares/json-parser')
const contentType = require('../middlewares/content-type')

module.exports = app => {
  app.use(helmet)
  app.use(cors)
  app.use(jsonParser)
  app.use(contentType)
}
