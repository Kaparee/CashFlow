using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;

namespace CashFlow.Application.Interfaces
{
    public interface IAccountService
    {
        Task<List<TransactionResponse>> GetAccountTransactions(int userId, int accountId);
        Task CreateNewAccountAsync(int userId, NewAccountRequest request);
    }
}