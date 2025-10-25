import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const templateDir = join(__dirname, 'templates');
        console.log(`📧 Using email templates from: ${templateDir}`);
        
        const mailConfig = {
          host: configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
          port: configService.get<number>('MAIL_PORT', 587),
          user: configService.get<string>('MAIL_USER'),
          from: configService.get<string>('MAIL_FROM', 'noreply@dbtsantiago.cl'),
        };
        
        console.log(`📧 Mail configuration:`, {
          host: mailConfig.host,
          port: mailConfig.port,
          user: mailConfig.user ? '***@' + mailConfig.user.split('@')[1] : 'NOT_SET',
          from: mailConfig.from,
        });

        const mailUser = configService.get<string>('MAIL_USER');
        const mailPassword = configService.get<string>('MAIL_PASSWORD');
        
        console.log(`📧 Credentials check:`, {
          user: mailUser ? '***@' + mailUser.split('@')[1] : 'NOT_SET',
          password: mailPassword ? `***${mailPassword.slice(-3)}` : 'NOT_SET',
          hasUser: !!mailUser,
          hasPassword: !!mailPassword,
        });
        
        // Si no hay credenciales de email, usar configuración mock
        if (!mailUser || !mailPassword) {
          console.log('⚠️ Email credentials not configured, using mock transport');
          return {
            transport: {
              jsonTransport: true,
            },
            defaults: {
              from: configService.get<string>('MAIL_FROM', 'noreply@dbtsantiago.cl'),
            },
            template: {
              dir: templateDir,
              adapter: new HandlebarsAdapter(),
              options: {
                strict: false,
              },
            },
          };
        }

        return {
          transport: {
            host: configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
            port: configService.get<number>('MAIL_PORT', 587),
            secure: false, // false para puerto 587
            auth: {
              user: mailUser,
              pass: mailPassword,
            },
            tls: {
              ciphers: 'SSLv3',
              rejectUnauthorized: false,
            },
            connectionTimeout: 60000,
            greetingTimeout: 30000,
            socketTimeout: 60000,
          },
          defaults: {
            from: configService.get<string>('MAIL_FROM', 'noreply@dbtsantiago.cl'),
          },
          template: {
            dir: templateDir,
            adapter: new HandlebarsAdapter(),
            options: {
              strict: false,
            },
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}