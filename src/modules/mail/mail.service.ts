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
    const mailUser = this.configService.get<string>('MAIL_USER');
    const mailPassword = this.configService.get<string>('MAIL_PASSWORD');
    
    // Si no hay credenciales configuradas, solo logear
    if (!mailUser || !mailPassword) {
      console.log(`📧 Email credentials not configured - would send welcome email to: ${user.email}`);
      console.log(`📧 User credentials: ${user.email} / ${password}`);
      return;
    }
    
    try {
      console.log(`📧 Attempting to send welcome email to: ${user.email}`);
      
      const result = await this.mailerService.sendMail({
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
      
      console.log(`✅ Welcome email sent successfully to: ${user.email}`);
      console.log(`📧 Result:`, result);
      
    } catch (error) {
      console.error('❌ Error sending welcome email:', error.message);
      
      // Si es un error de SSL/TLS, dar información específica
      if (error.message.includes('SSL') || error.message.includes('TLS')) {
        console.error('� SSL/TLS Error - Check your email configuration:');
        console.error('   - For Gmail: Use port 587 with STARTTLS');
        console.error('   - Make sure you have an App Password, not your regular password');
        console.error('   - Check that 2FA is enabled and App Password is generated');
      }
      
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