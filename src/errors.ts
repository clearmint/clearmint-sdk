export abstract class ClearmintError extends Error {
  public readonly code: string
  constructor (message: string, code: string) {
    super(message)
    this.name = 'ClearmintError'
    this.code = code
  }
}

export class InvalidMintParamsError extends ClearmintError {
  constructor (message = 'Invalid mint parameters') {
    super(message, 'INVALID_MINT_PARAMS')
    this.name = 'InvalidMintParamsError'
  }
}

export class InstructionBuildError extends ClearmintError {
  constructor (message = 'Failed to build instructions') {
    super(message, 'INSTRUCTION_BUILD_ERROR')
    this.name = 'InstructionBuildError'
  }
}

export class TransactionSendError extends ClearmintError {
  constructor (message = 'Failed to send transaction') {
    super(message, 'TRANSACTION_SEND_ERROR')
    this.name = 'TransactionSendError'
  }
}

export class RpcConnectionError extends ClearmintError {
  constructor (message = 'RPC connection error') {
    super(message, 'RPC_CONNECTION_ERROR')
    this.name = 'RpcConnectionError'
  }
}
