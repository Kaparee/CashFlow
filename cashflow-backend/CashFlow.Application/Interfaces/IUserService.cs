using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;

namespace CashFlow.Application.Interfaces
{
	public interface IUserService
	{
		Task<UserResponse> GetUserByIdAsync(int userId);
        Task<string> RegisterAsync(RegisterRequest request);
    }
}