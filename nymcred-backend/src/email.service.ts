import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createTransport, Transporter } from 'nodemailer';
import { APP_NAME, IS_PRODUCTION, APP_SITE} from "./constants";

const appName = APP_NAME;
const appSite = APP_SITE;

@Injectable()
export class EmailService {
    private readonly mail: Transporter;
    private readonly logger = new Logger(EmailService.name);
    
    constructor(private readonly configService: ConfigService) {
        this.mail = createTransport({
            host: configService.get<string>('SMTP_HOST'),
            port: 587,
            secure: false,
            requireTLS: true, //Force TLS
            tls: {  
                rejectUnauthorized: false
            },
            auth: {
                user: configService.get<string>('SMTP_USER'),
                pass: configService.get<string>('SMTP_PASS')
            }
        });
        if (IS_PRODUCTION) {
            this.mail.verify((error, success) => {
                if (error) {
                    this.logger.error('Failed to verify e-mail configuration');
                    this.logger.error(error);
                } else {
                    this.logger.log('E-mail configuration verified');
                }
            });
        }
    }

    async sendConfirmEmailMessage(address: string, link: string, code: string) {
        return this.sendEmail(address, 
            `${appName}: Confirm your e-mail address`,
            `Confirm your e-mail by navigating to the link below or copying the following code into your browser: ${code}\n\n ` + link +
                ' \n\nThe link is active for 24h.' +
                `\n\nIf you did not sign up for ${appName}, please ignore this e-mail as ` + 
                'someone just entered the wrong address.' +
                `\n\nThanks!\n(Note, you cannot reply to this e-mail, visit ${appSite} for more info)`,
            this.getHtmlBody('Confirm your email', link, code))
    }


    async sendMagicLinkLogin(address: string, link: string, code: string) {
        return this.sendEmail(address, 
            `${appName}: Your login link`, 
            `Login by navigating to the link below or copying the following code into your browser: ${code}\n\n ` + link +
            ' \n\nThe link is active for 24h.' +
            '\n\nIf you did not trigger this request, please ignore this e-mail.' +
            `\n\nThanks!\n(Note, you cannot reply to this e-mail, visit ${appSite} for more info)`,
            this.getHtmlBody('Login', link, code))
    }

    private async sendEmail(address: string, subject: string, plainBody: string, htmlBody: string) {
        if (!IS_PRODUCTION) {
            this.logger.log('Sending e-mail to ' + address);
            this.logger.log({
                subject: subject,
                plainText: plainBody
            });
            return Promise.resolve({});
        } else {
            this.logger.log('Sending e-mail with subject ' + subject);
            return this.mail.sendMail({
                from: `"${appName}" <noreply@${appSite}>`,
                to: address,
                subject: subject,
                text: plainBody,
                html: htmlBody
            })
            .catch(err => {
                this.logger.log('Failed to send e-mail to ' + address);
                throw err;
            });
        }
    }


    getHtmlBody(action: string, link: string, code: string): string {
        return '<html><body>' + `<p>${action} by navigating to the link below or copying the following code into your browser: ${code}</p>` + 
        '<a href="' + link + '">' + link + '</a><p>The link is active for 24h.</p>' +
        `<p>If you did not sign up for ${appName}, please ignore this e-mail.</p>` +
        '<p>Thanks!</p>' +
        `<p>(Note, you cannot reply to this e-mail, visit ${appSite} for more info)</p>` +
        '</body></html>';
    }
}