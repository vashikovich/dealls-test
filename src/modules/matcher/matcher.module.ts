import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/subscriptions.entity';
import { SwipeHistory } from 'src/entities/swipeHistories.entity';
import { UserPreferences } from 'src/entities/userPreferences.entity';
import { UserProfile } from 'src/entities/userProfiles.entity';
import { MatcherService } from './matcher.service';
import { MatcherController } from './matcher.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserProfile,
      UserPreferences,
      SwipeHistory,
      Subscription,
    ]),
  ],
  providers: [MatcherService],
  controllers: [MatcherController],
})
export class MatcherModule {}
