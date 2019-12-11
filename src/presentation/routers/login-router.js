const HttpResponse = require('../helpers/htttp-response')

class LoginRouter {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  route (httpRequest) {
    if (
      !httpRequest ||
      !httpRequest.body ||
      !this.authUseCase ||
      !this.authUseCase.auth
    ) {
      return HttpResponse.internalError()
    }
    const { email, password } = httpRequest.body
    if (!email) {
      return HttpResponse.badRequest('email')
    }
    if (!password) {
      return HttpResponse.badRequest('password')
    }
    const accessToken = this.authUseCase.auth(email, password)
    if (!accessToken) {
      return HttpResponse.unauthorizedError()
    }

    return HttpResponse.ok()
  }
}

module.exports = LoginRouter