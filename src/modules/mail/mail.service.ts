import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from '../../entities/user.entity';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendUserWelcomeEmail(user: User, password: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Bienvenido a DBT Santiago - Credenciales de Acceso',
        template: 'user-welcome',
        context: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: password,
          loginUrl: `${frontendUrl}/login`,
          supportEmail: 'soporte@dbtsantiago.cl',
        },
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // No lanzamos el error para que no interfiera con la creación del usuario
    }
  }

  async sendPasswordResetEmail(user: User, resetToken: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:5173');
    
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Restablecer Contraseña - DBT Santiago',
        template: 'password-reset',
        context: {
          firstName: user.firstName,
          lastName: user.lastName,
          resetUrl: `${frontendUrl}/reset-password?token=${resetToken}`,
          supportEmail: 'soporte@dbtsantiago.cl',
        },
      });
    } catch (error) {
      console.error('Error sending password reset email:', error);
    }
  }

  async sendTherapistAssignmentEmail(user: User, therapistName: string, therapistEmail: string): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Asignación de Terapeuta - DBT Santiago',
        template: 'therapist-assignment',
        context: {
          firstName: user.firstName,
          lastName: user.lastName,
          therapistName: therapistName,
          therapistEmail: therapistEmail,
          supportEmail: 'soporte@dbtsantiago.cl',
        },
      });
    } catch (error) {
      console.error('Error sending therapist assignment email:', error);
    }
  }
}