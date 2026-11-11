import { UserRepository, type CreateUserInput } from '../repositories/userRepository.ts';
import { isNonEmptyString } from './validation.ts';

export class UserService {
  constructor(private readonly repository: UserRepository = new UserRepository()) {}

  async getUsers() {
    return this.repository.findAll();
  }

  async createUser(input: CreateUserInput) {
    if (
      !isNonEmptyString(input?.name) ||
      !isNonEmptyString(input?.email) ||
      !isNonEmptyString(input?.passwordHash) ||
      !['admin', 'owner', 'customer'].includes(input?.role)
    ) {
      throw new Error('INVALID_INPUT');
    }
    return this.repository.create(input);
  }
}
