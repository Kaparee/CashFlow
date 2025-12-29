using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;

namespace CashFlow.Application.Interfaces
{
    public interface IAccountService
    {
        Task<List<AccountResponse>> GetUserAccounts(int userId);
        Task CreateNewAccountAsync(int userId, NewAccountRequest request);
    }
}