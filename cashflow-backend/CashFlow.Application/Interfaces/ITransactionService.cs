using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;

namespace CashFlow.Application.Interfaces
{
    public interface ITransactionService
    {
        Task CreateNewTransactionAsync(int userId, NewTransactionRequest request);
        Task<List<TransactionResponse>> GetAccountTransactions(int userId, int accountId);
    }
}