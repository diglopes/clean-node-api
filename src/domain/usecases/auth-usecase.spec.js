const { MissingParamError, InvalidParamError } = require('../../utils/errors')

class AuthUseCase {
  constructor (loadUserByEmailRepo) {
    this.loadUserByEmailRepo = loadUserByEmailRepo
  }

  async auth (email, password) {
    if (!email) {
      throw new MissingParamError('email')
    }
    if (!password) {
      throw new MissingParamError('password')
    }
    if (!this.loadUserByEmailRepo) {
      throw new MissingParamError('loadUserByEmailRepo')
    }
    if (!this.loadUserByEmailRepo.load) {
      throw new InvalidParamError('loadUserByEmailRepo')
    }

    const user = await this.loadUserByEmailRepo.load(email)
    if (!user) {
      return null
    }
  }
}

const makeSut = () => {
  class LoadUserByEmailRepoSpy {
    async load (email) {
      this.email = email
    }
  }

  const loadUserByEmailRepoSpy = new LoadUserByEmailRepoSpy()
  const sut = new AuthUseCase(loadUserByEmailRepoSpy)
  return {
    sut,
    loadUserByEmailRepoSpy
  }
}

describe('Auth UseCase', () => {
  test('Should throw if no email is provided', () => {
    const { sut } = makeSut()
    const promise = sut.auth()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', () => {
    const { sut } = makeSut()
    const promise = sut.auth('any_email@email.com')
    expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should call LoadUserByEmailRepo withcorrect email', async () => {
    const { sut, loadUserByEmailRepoSpy } = makeSut()
    await sut.auth('any_email@email.com', 'any_password')
    expect(loadUserByEmailRepoSpy.email).toBe('any_email@email.com')
  })

  test('Should throw if no LoadUserByEmailRepo is provided', () => {
    const sut = new AuthUseCase()
    const promise = sut.auth('any_email@email.com', 'any_password')
    expect(promise).rejects.toThrow(
      new MissingParamError('loadUserByEmailRepo')
    )
  })

  test('Should throw if LoadUserByEmailRepo has no load method', () => {
    const sut = new AuthUseCase({})
    const promise = sut.auth('any_email@email.com', 'any_password')
    expect(promise).rejects.toThrow(
      new InvalidParamError('loadUserByEmailRepo')
    )
  })

  test('Should return null if LoadUserByEmailRepo returns null', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(
      'invalid_email@email.com',
      'any_password'
    )
    expect(accessToken).toBeNull()
  })
})
