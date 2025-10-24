import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findAllWithTherapist(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['therapist'],
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneWithRelations(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['therapist', 'sessions'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { status: UserStatus.ACTIVE },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findUsersByTherapist(therapistId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { therapistId },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async getUserCount(): Promise<number> {
    return this.userRepository.count();
  }

  async getActiveUserCount(): Promise<number> {
    return this.userRepository.count({
      where: { status: UserStatus.ACTIVE },
    });
  }
}