using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;

namespace CashFlow.Application.Interfaces
{
	public interface IUserService
	{
		Task RegisterAsync(RegisterRequest request);
		Task<LoginResponse> LoginAsync(LoginRequest request);
		Task<UserResponse> GetUserByIdAsync(int userId);
		Task<List<AccountResponse>> GetUserAccounts(int userId);
    }
}