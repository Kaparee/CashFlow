using CashFlow.Domain.Models;

namespace CashFlow.Application.Repositories
{
    public interface ITransactionRepository
    {
        Task AddAsync(Transaction transaction);
        Task<List<Transaction>> GetAccountTransactionsWithDetailsAsync(int userId, int accountId);
        Task UpdateAsync(Transaction transaction);
        Task<Transaction?> GetTransactionInfoByIdWithDetailsAsync(int userId, int transactionId);
    }
}