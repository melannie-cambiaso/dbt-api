import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { AdminUser } from '../../entities/admin-user.entity';
import { AdminLoginInput } from './dto/admin-login.dto';
import { AdminAuthResponse } from './dto/admin-auth-response.dto';
import { AdminJwtPayload } from './strategies/admin-jwt.strategy';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectRepository(AdminUser)
    private readonly adminRepository: Repository<AdminUser>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginInput: AdminLoginInput, clientIp?: string): Promise<AdminAuthResponse> {
    const { email, password } = loginInput;

    // Find admin by email
    const admin = await this.adminRepository.findOne({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if admin is active
    if (!admin.active) {
      throw new UnauthorizedException('Account is not active');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check IP restrictions if configured
    if (admin.allowedIps && admin.allowedIps.length > 0 && clientIp) {
      if (!admin.allowedIps.includes(clientIp)) {
        throw new UnauthorizedException('Access from this IP is not allowed');
      }
    }

    // Update last access
    await this.adminRepository.update(admin.id, {
      lastAccess: new Date(),
    });

    // Generate JWT token
    const { accessToken, expiresIn } = this.generateToken(admin);

    return {
      accessToken,
      admin,
      expiresIn,
    };
  }

  async validateAdmin(adminId: string): Promise<AdminUser> {
    const admin = await this.adminRepository.findOne({
      where: { id: adminId, active: true },
    });

    if (!admin) {
      throw new UnauthorizedException('Admin not found or inactive');
    }

    return admin;
  }

  private generateToken(admin: AdminUser): { accessToken: string; expiresIn: string } {
    const payload: AdminJwtPayload = {
      sub: admin.id,
      email: admin.email,
      role: admin.role,
      type: 'admin',
    };

    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN', '24h');

    const accessToken = this.jwtService.sign(payload);

    return { accessToken, expiresIn };
  }
}