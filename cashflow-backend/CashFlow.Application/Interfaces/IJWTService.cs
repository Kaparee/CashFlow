using CashFlow.Domain.Models;

namespace CashFlow.Application.Interfaces
{
    public interface IJWTService
    {
        string GenerateToken(User user);
    }
}
