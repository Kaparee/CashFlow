using CashFlow.Domain.Models;

namespace CashFlow.Application.Repositories
{
    public interface IAccountRepository
    {
        Task<List<Transaction>> GetAccountTransactionsWithDetailsAsync(int userId, int accountId);
        Task<Account?> GetAccountByIdAsync(int userId, int accountId);
        Task AddAsync(Account account);
        Task<bool> isAccountCreated(int userId, string name);
        Task UpdateAsync(Account account);
    }
}