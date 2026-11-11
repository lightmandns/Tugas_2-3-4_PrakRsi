import { AuditRepository, type CreateAuditInput } from '../repositories/auditRepository.ts';
import { assertResourceExists, isNonEmptyString, isPositiveId } from './validation.ts';

export class AuditService {
  constructor(private readonly repository: AuditRepository = new AuditRepository()) {}

  async getAuditLogs() {
    return this.repository.findAll();
  }

  async createAuditLog(input: CreateAuditInput) {
    if (
      !isPositiveId(input?.userId) ||
      !isNonEmptyString(input?.action) ||
      !isNonEmptyString(input?.targetTable) ||
      !isPositiveId(input?.targetId) ||
      (input.metadata !== undefined && input.metadata !== null && typeof input.metadata !== 'string')
    ) {
      throw new Error('INVALID_INPUT');
    }
    return assertResourceExists(await this.repository.create(input));
  }
}
