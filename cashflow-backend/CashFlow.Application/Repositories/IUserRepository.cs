using CashFlow.Domain.Models;

namespace CashFlow.Application.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetUserByIdWithDetailsAsync(int userId);
        Task AddAsync(User user);
    }
}