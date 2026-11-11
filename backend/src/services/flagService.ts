import { FlagRepository } from '../repositories/flagRepository.ts';
import { assertResourceExists, isNonEmptyString, isPositiveId } from './validation.ts';

export class FlagService {
  constructor(private readonly repository: FlagRepository = new FlagRepository()) {}

  async getFlags() {
    return this.repository.findAll();
  }

  async updateFlagStatus(id: number, status: unknown) {
    if (!isPositiveId(id) || !isNonEmptyString(status)) throw new Error('INVALID_INPUT');
    return assertResourceExists(await this.repository.updateStatus(id, status));
  }
}
