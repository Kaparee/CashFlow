using CashFlow.Domain.Models;

namespace CashFlow.Application.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdWithDetailsAsync(int userId);
        Task<bool> IsEmailTakenAsync(string email);
        Task<bool> IsNicknameTakenAsync(string nickname);
        Task AddAsync(User user);
        Task<User?> GetUserByEmailOrNicknameAsync(string emailOrNickname);
    }
}