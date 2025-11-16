using CashFlow.Application.DTO;

namespace CashFlow.Application.Interfaces
{
	public interface IUserService
	{
		Task<UserResponse> GetUserByIdAsync(int userId);
	}
}