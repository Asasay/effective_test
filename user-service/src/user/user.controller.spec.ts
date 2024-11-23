import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: Partial<Record<keyof UserService, jest.Mock>>;

  beforeEach(async () => {
    userService = {
      resetIssue: jest.fn(),
      countIssues: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('resetUserIssue', () => {
    it('should reset the user issue and return a success message', async () => {
      const userId = 1;
      const remainingIssues = 5;

      userService.resetIssue.mockResolvedValue(undefined); // `resetIssue` doesn't return anything.
      userService.countIssues.mockResolvedValue(remainingIssues);

      const result = await userController.resetUserIssue(userId);

      expect(userService.resetIssue).toHaveBeenCalledWith(userId);
      expect(userService.countIssues).toHaveBeenCalled();
      expect(result).toEqual({
        message: `User with ID ${userId} issue flag reset successfully. Users with problems left: ${remainingIssues}`,
      });
    });

    it('should throw an error if resetIssue fails', async () => {
      const userId = 1;
      userService.resetIssue.mockRejectedValue(new Error('Reset failed'));

      await expect(userController.resetUserIssue(userId)).rejects.toThrow(
        'Reset failed',
      );

      expect(userService.resetIssue).toHaveBeenCalledWith(userId);
      expect(userService.countIssues).not.toHaveBeenCalled();
    });
  });
});
