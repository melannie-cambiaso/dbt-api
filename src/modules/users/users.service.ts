import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../../entities/user.entity';
import { Therapist } from '../../entities/therapist.entity';
import { CreateUserInput } from './dto/create-user.dto';
import { UpdateUserInput } from './dto/update-user.dto';
import { MailService } from '../mail/mail.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Therapist)
    private readonly therapistRepository: Repository<Therapist>,
    private readonly mailService: MailService,
  ) {}

  async create(createUserInput: CreateUserInput, createdByAdminId: string): Promise<User> {
    const { email, password, ...userData } = createUserInput;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      ...userData,
      email: email.toLowerCase(),
      passwordHash,
      dateOfBirth: new Date(userData.dateOfBirth),
      createdByAdminId,
    });

    const savedUser = await this.userRepository.save(user);

    // Send welcome email with credentials
    await this.mailService.sendUserWelcomeEmail(savedUser, password);

    return savedUser;
  }

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

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);

    // Check if email is being changed and if it already exists
    if (updateUserInput.email && updateUserInput.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserInput.email.toLowerCase() },
      });

      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Hash new password if provided
    if (updateUserInput.password) {
      const saltRounds = 12;
      updateUserInput.password = await bcrypt.hash(updateUserInput.password, saltRounds);
    }

    // Update user
    const updateData: any = { ...updateUserInput };
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }
    if (updateData.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateData.dateOfBirth);
    }
    if (updateData.password) {
      updateData.passwordHash = updateData.password;
      delete updateData.password;
    }

    await this.userRepository.update(id, updateData);
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return true;
  }

  async deactivate(id: string): Promise<User> {
    return this.update(id, { status: UserStatus.INACTIVE });
  }

  async activate(id: string): Promise<User> {
    return this.update(id, { status: UserStatus.ACTIVE });
  }

  async assignTherapist(userId: string, therapistId: string): Promise<User> {
    // Verify therapist exists
    const therapist = await this.therapistRepository.findOne({
      where: { id: therapistId },
    });

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    const updatedUser = await this.update(userId, { therapistId });

    // Send therapist assignment email
    await this.mailService.sendTherapistAssignmentEmail(
      updatedUser,
      `${therapist.firstName} ${therapist.lastName}`,
      therapist.email
    );

    return updatedUser;
  }

  async removeTherapist(userId: string): Promise<User> {
    return this.update(userId, { therapistId: null });
  }
}