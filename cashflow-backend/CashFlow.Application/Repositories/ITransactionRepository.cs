using CashFlow.Domain.Models;

namespace CashFlow.Application.Repositories
{
    public interface ITransactionRepository
    {
        Task AddAsync(Transaction transaction);
        Task<List<Transaction>> GetAccountTransactionsWithDetailsAsync(int userId, int accountId);
    }
}