import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendUserConfirmation(user: any) {
        await this.mailerService.sendMail({
            to: user,
            subject: 'Welcome to MyApp! Confirm your Email',
            template: './template.html',
            context: {
                name: user,
            },
        });
    }
}
