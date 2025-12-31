using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;

namespace CashFlow.Application.Interfaces
{
	public interface IUserService
	{
		Task RegisterAsync(RegisterRequest request);
		Task<LoginResponse> LoginAsync(LoginRequest request);
		Task<UserResponse> GetUserByIdAsync(int userId);
		Task VerifyEmailAsync(string verificationToken);
		Task DeleteUserAsync(int userId);
		Task UpdateUserAsync(int userId, UpdateUserRequest request);
    }
}