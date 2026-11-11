import {
  MenuItemRepository,
  type CreateMenuItemInput,
} from '../repositories/menuItemRepository.ts';
import { assertResourceExists, isNonEmptyString, isPositiveId } from './validation.ts';

export class MenuItemService {
  constructor(private readonly repository: MenuItemRepository = new MenuItemRepository()) {}

  async getMenuItems() {
    return this.repository.findAll();
  }

  async getMenuItem(id: number) {
    if (!isPositiveId(id)) throw new Error('INVALID_INPUT');
    return assertResourceExists(await this.repository.findById(id));
  }

  async createMenuItem(input: CreateMenuItemInput) {
    if (
      !isPositiveId(input?.stallId) ||
      !isNonEmptyString(input?.name) ||
      !Number.isInteger(input?.price) ||
      input.price < 0 ||
      typeof input?.isAvailable !== 'boolean'
    ) {
      throw new Error('INVALID_INPUT');
    }
    return assertResourceExists(await this.repository.create(input));
  }

  async updateMenuItem(id: number, input: Partial<CreateMenuItemInput>) {
    if (!isPositiveId(id) || !input || typeof input !== 'object' || Object.keys(input).length === 0) {
      throw new Error('INVALID_INPUT');
    }
    const allowedFields = ['stallId', 'name', 'price', 'isAvailable'];
    if (Object.keys(input).some((key) => !allowedFields.includes(key))) {
      throw new Error('INVALID_INPUT');
    }
    if (input.stallId !== undefined && !isPositiveId(input.stallId)) {
      throw new Error('INVALID_INPUT');
    }
    if (input.name !== undefined && !isNonEmptyString(input.name)) {
      throw new Error('INVALID_INPUT');
    }
    if (input.price !== undefined && (!Number.isInteger(input.price) || input.price < 0)) {
      throw new Error('INVALID_INPUT');
    }
    if (input.isAvailable !== undefined && typeof input.isAvailable !== 'boolean') {
      throw new Error('INVALID_INPUT');
    }
    return assertResourceExists(await this.repository.update(id, input));
  }

  async deleteMenuItem(id: number) {
    if (!isPositiveId(id)) throw new Error('INVALID_INPUT');
    return assertResourceExists(await this.repository.remove(id));
  }
}
