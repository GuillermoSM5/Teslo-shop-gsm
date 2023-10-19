import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators/auth.decorator';


@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  

  @Get()
  @Auth()
  executedSeed() {
    return this.seedService.runSeed();
  }

 
}
