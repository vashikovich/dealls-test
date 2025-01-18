import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { User } from 'src/entities/users.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { SwipeDto } from './dto/swipe.dto';
import { MatcherService } from './matcher.service';
import { GetCandidatesDto } from './dto/getCandidates.dto';
import { UpdateProfileDto } from './dto/updateProfile.dto';

@Controller('matcher')
export class MatcherController {
  constructor(private readonly matcherService: MatcherService) {}

  @Put('profile')
  async updateProfile(
    @CurrentUser() currentUser: User,
    @Body() updateDto: UpdateProfileDto,
  ) {
    return this.matcherService.updateProfile(currentUser.id, updateDto);
  }

  @Get('candidates')
  @UseGuards(AuthGuard)
  async getSwipeCandidates(
    @CurrentUser() currentUser: User,
    @Query() getCandidatesDto: GetCandidatesDto,
  ) {
    const { skipUserIds, amount } = getCandidatesDto;
    return this.matcherService.getCandidatesForUser(
      currentUser.id,
      skipUserIds,
      amount,
    );
  }

  @Get('remaining-quota')
  @UseGuards(AuthGuard)
  async checkRemainingQuota(@CurrentUser() currentUser: User) {
    return this.matcherService.checkRemainingSwipeQuota(currentUser.id);
  }

  @Post('swipe')
  @UseGuards(AuthGuard)
  async swipe(@CurrentUser() currentUser: User, @Body() swipeDto: SwipeDto) {
    const { targetUserId, isLike } = swipeDto;
    return this.matcherService.recordSwipe(
      currentUser.id,
      targetUserId,
      isLike,
    );
  }
}
