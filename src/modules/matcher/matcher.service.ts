import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_CANDIDATE_AMOUNT, DEFAULT_SWIPE_QUOTA } from 'src/constants';
import { Subscription } from 'src/entities/subscriptions.entity';
import { SwipeHistory } from 'src/entities/swipeHistories.entity';
import { UserPreferences } from 'src/entities/userPreferences.entity';
import { UserProfile } from 'src/entities/userProfiles.entity';
import { today } from 'src/utils';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { UpdateProfileDto } from './dto/updateProfile.dto';
import { User } from 'src/entities/users.entity';

@Injectable()
export class MatcherService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly profileRepository: Repository<UserProfile>,
    @InjectRepository(UserPreferences)
    private readonly prefsRepository: Repository<UserPreferences>,
    @InjectRepository(SwipeHistory)
    private readonly swipeHistoryRepository: Repository<SwipeHistory>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async updateProfile(userId: string, updateDto: UpdateProfileDto) {
    const { name, birthDate, bio, gender } = updateDto;

    const profile = this.profileRepository.create({
      id: userId,
      name,
      birthDate,
      bio,
      gender,
    });

    return this.profileRepository.save(profile);
  }

  async getCandidatesForUser(
    userId: string,
    skipUserIds: string[] = [],
    limit: number = DEFAULT_CANDIDATE_AMOUNT,
  ) {
    // Filter by preferences
    const prefs = await this.prefsRepository.findOne({
      where: { id: userId },
    });

    const query = this.profileRepository
      .createQueryBuilder('profile')
      .leftJoin(User, 'user')
      .leftJoinAndSelect(
        Subscription,
        'subscription',
        'user.id = subscription.user_id AND subscription.start_date <= NOW() AND subscription.end_date >= NOW()',
      )
      .where('profile.id != :userId', { userId });

    if (prefs.gender)
      query.andWhere('user.gender = :gender', {
        gender: prefs.gender,
      });

    if (prefs.minAge)
      query.andWhere('EXTRACT(YEAR FROM AGE(user.birth_date)) >= :minAge', {
        minAge: prefs.minAge,
      });

    if (prefs.maxAge)
      query.andWhere('EXTRACT(YEAR FROM AGE(user.birth_date)) <= :maxAge', {
        maxAge: prefs.maxAge,
      });

    // Exclude swiped and skipped profiles
    const swipedProfiles = await this.swipeHistoryRepository.find({
      where: {
        userId,
        swipeDate: today(),
      },
    });

    const swipedIds = swipedProfiles.map((profile) => profile.targetUserId);

    const idsToExclude = [...new Set([...swipedIds, ...skipUserIds])];

    if (idsToExclude.length > 0) {
      query.andWhere('user.id NOT IN (:...idsToExclude)', { idsToExclude });
    }

    // Return random profiles
    return query.orderBy('RANDOM()').take(limit).getMany();
  }

  async checkRemainingSwipeQuota(userId: string) {
    // Check unlimited quota by subscription
    const now = new Date();
    const activeSubscription = await this.subscriptionRepository.findOne({
      where: {
        userId,
        startDate: LessThanOrEqual(now),
        endDate: MoreThanOrEqual(now),
      },
    });

    if (activeSubscription?.hasUnlimitedQuota) {
      return Infinity;
    }

    // Check against default quota
    const todaySwipes = await this.swipeHistoryRepository.count({
      where: {
        userId,
        swipeDate: today(),
      },
    });

    const quota = DEFAULT_SWIPE_QUOTA;
    return quota - todaySwipes;
  }

  async recordSwipe(userId: string, targetUserId: string, isLike: boolean) {
    const hasQuota = (await this.checkRemainingSwipeQuota(userId)) > 0;
    if (!hasQuota) throw new ForbiddenException('Not enough daily quota');

    await this.swipeHistoryRepository.save({
      userId,
      targetUserId,
      isLike,
      swipeDate: today(),
    });

    // If both users liked each other, could trigger a match event here
    if (isLike) {
      await this.checkForMatch(userId, targetUserId);
    }
  }

  private async checkForMatch(
    userId: string,
    targetUserId: string,
  ): Promise<void> {
    const mutualLike = await this.swipeHistoryRepository.findOne({
      where: {
        userId: targetUserId,
        targetUserId: userId,
        isLike: true,
      },
    });

    if (mutualLike) {
      // TODO: Could emit an event or create a match record
      console.log(`Match created between ${userId} and ${targetUserId}`);
    }
  }
}
