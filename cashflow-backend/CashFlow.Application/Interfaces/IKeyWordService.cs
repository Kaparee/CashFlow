using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;


namespace CashFlow.Application.Interfaces
{
    public interface IKeyWordService
    {
        Task CreateNewKeyWordAsync(int userId, NewKeyWordRequest request);
    }
}