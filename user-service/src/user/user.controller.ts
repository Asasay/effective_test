import { Controller, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id/reset-issue')
  async resetUserIssue(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<{ message: string }> {
    await this.userService.resetIssue(userId);
    const issuesCount = await this.userService.countIssues();

    return {
      message: `User with ID ${userId} issue flag reset successfully. Users with problems left: ${issuesCount}`,
    };
  }
}
