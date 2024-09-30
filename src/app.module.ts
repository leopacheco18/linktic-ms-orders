import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from './orders/order.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // Hacer que el módulo de configuración sea accesible globalmente
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule], // Importa ConfigModule
    useFactory: async (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get<string>('DB_HOST'),
      port: configService.get<number>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_NAME'),
      entities: [__dirname + '/**/*.entity{.ts,.js}'], 
      synchronize: false, 
    }),
    inject: [ConfigService],
  }),
    OrderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
