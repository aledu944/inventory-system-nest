import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';

import { Provider } from './entities/provider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [ProvidersController],
  providers: [ProvidersService],
  imports: [ 
    TypeOrmModule.forFeature([ Provider ]),
  ]
})
export class ProvidersModule {}
