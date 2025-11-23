using CashFlow.Domain.Models;

namespace CashFlow.Application.Repositories
{
    public interface IAccountRepository
    {
        Task<List<Transaction>> GetAccountTransactionsWithDetailsAsync(int userId, int accountId);
    }
}