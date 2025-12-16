using CashFlow.Domain.Models;

namespace CashFlow.Application.Repositories
{
    public interface ITransactionRepository
    {
        Task AddAsync(Transaction transaction);
    }
}