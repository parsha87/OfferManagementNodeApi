import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from '@hapi/joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TYPEORM_CONFIG } from './config/constants';
import databaseConfig from './config/database.config';
import { HtmlSanitizerMiddleware } from './html-sanitizer.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { CustomerModule } from './customer/customer.module';
import { ListofvaluesModule } from './listofvalues/listofvalues.module';




@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>(TYPEORM_CONFIG),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig ],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`, // .env.development
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development')
      }),
    }),
    // MailerModule.forRoot({
    //   transport: {
    //     host: 'smtpout.secureserver.net', // Use your SMTP provider
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //       user: 'donot-reply@bitinfo.in', // your email address
    //       pass: 'B!tstep$@2024', // your email password
    //     },
    //   },
    //   defaults: {
    //     from: '"No Reply"<donot-reply@bitinfo.in>', // default sender
    //   },
    //   template: {
    //     dir: join(__dirname, './template'),
    //     adapter: new HandlebarsAdapter(), // or use PugAdapter, etc.
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
    // AccessControlModule.forRoles(roles),
    AuthModule,
    UserModule,
    InquiryModule,
    CustomerModule,
    ListofvaluesModule,
    // UserModule,
    // //ClaimIntimationModule,
    // ClaimModule,
    // PolicyModule
    // FileUploadModule
  ],
  controllers: [AppController],
  providers: [AppService],
  // exports:[winstonProvider]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HtmlSanitizerMiddleware).forRoutes('*');
  }
}
