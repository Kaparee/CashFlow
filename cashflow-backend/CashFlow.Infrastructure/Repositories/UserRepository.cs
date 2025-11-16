using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace CashFlow.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly CashFlowDbContext _context;

        public UserRepository(CashFlowDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByIdWithDetailsAsync(int userId)
        {
            return await _context.Users
        .Include(u => u.Accounts)
            .ThenInclude(a => a.Currency)
        .Include(u => u.Categories)
            .ThenInclude(c => c.KeyWords)
        .Include(u => u.Transactions)
        .Include(u => u.RecTransactions)
        .Include(u => u.Notifications)
        .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }
    }
}