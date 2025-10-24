import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Therapist } from '../../entities/therapist.entity';
import { CreateTherapistInput } from './dto/create-therapist.dto';
import { UpdateTherapistInput } from './dto/update-therapist.dto';

@Injectable()
export class TherapistsService {
  constructor(
    @InjectRepository(Therapist)
    private readonly therapistRepository: Repository<Therapist>,
  ) {}

  async create(createTherapistInput: CreateTherapistInput): Promise<Therapist> {
    const { email } = createTherapistInput;

    // Check if therapist already exists
    const existingTherapist = await this.therapistRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (existingTherapist) {
      throw new ConflictException('Therapist with this email already exists');
    }

    // Create therapist
    const therapist = this.therapistRepository.create({
      ...createTherapistInput,
      email: email.toLowerCase(),
    });

    return this.therapistRepository.save(therapist);
  }

  async findAll(activeOnly: boolean = false): Promise<Therapist[]> {
    const where = activeOnly ? { active: true } : {};
    
    return this.therapistRepository.find({
      where,
      relations: ['patients'],
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Therapist> {
    const therapist = await this.therapistRepository.findOne({
      where: { id },
      relations: ['patients'],
    });

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    return therapist;
  }

  async findByEmail(email: string): Promise<Therapist | null> {
    return this.therapistRepository.findOne({
      where: { email: email.toLowerCase() },
      relations: ['patients'],
    });
  }

  async update(id: string, updateTherapistInput: UpdateTherapistInput): Promise<Therapist> {
    const therapist = await this.findOne(id);

    // Check if email is being changed and if it already exists
    if (updateTherapistInput.email && updateTherapistInput.email !== therapist.email) {
      const existingTherapist = await this.therapistRepository.findOne({
        where: { email: updateTherapistInput.email.toLowerCase() },
      });

      if (existingTherapist) {
        throw new ConflictException('Therapist with this email already exists');
      }
    }

    // Update therapist
    if (updateTherapistInput.email) {
      updateTherapistInput.email = updateTherapistInput.email.toLowerCase();
    }

    await this.therapistRepository.update(id, updateTherapistInput);
    
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const therapist = await this.findOne(id);

    // Check if therapist has active patients
    const patientCount = await this.therapistRepository
      .createQueryBuilder('therapist')
      .leftJoin('therapist.patients', 'patient')
      .where('therapist.id = :id', { id })
      .andWhere('patient.status = :status', { status: 'active' })
      .getCount();

    if (patientCount > 0) {
      throw new ConflictException('Cannot delete therapist with active patients. Deactivate instead.');
    }

    await this.therapistRepository.remove(therapist);
    return true;
  }

  async deactivate(id: string): Promise<Therapist> {
    return this.update(id, { active: false });
  }

  async activate(id: string): Promise<Therapist> {
    return this.update(id, { active: true });
  }

  async getPatientCount(id: string): Promise<number> {
    const therapist = await this.therapistRepository.findOne({
      where: { id },
      relations: ['patients'],
    });

    if (!therapist) {
      throw new NotFoundException('Therapist not found');
    }

    return therapist.patients.filter(patient => patient.status === 'active').length;
  }
}