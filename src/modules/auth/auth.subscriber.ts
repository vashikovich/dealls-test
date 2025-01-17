import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/users.entity';
import { ConfigService } from '@nestjs/config';

@EventSubscriber()
export class AuthSubscriber implements EntitySubscriberInterface<User> {
  constructor(private readonly configService: ConfigService) {}

  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>): Promise<void> {
    if (event.entity.password) {
      event.entity.passwordHash = await bcrypt.hash(
        event.entity.password,
        this.configService.get('jwt.bcryptSaltOrRound'),
      );
    }
  }

  async beforeUpdate(event: UpdateEvent<User>): Promise<void> {
    if (event.entity.password) {
      // Ensure that the password is hashed only if it has been modified
      const currentPassword = event.databaseEntity.passwordHash;
      if (event.entity.passwordHash !== currentPassword) {
        event.entity.passwordHash = await bcrypt.hash(
          event.entity.password,
          this.configService.get('jwt.bcryptSaltOrRound'),
        );
      }
    }
  }

  async afterLoad(entity: User): Promise<void> {
    // Ensure anything password related is not retrieved
    entity.passwordHash = null;
    entity.password = null;
  }
}
