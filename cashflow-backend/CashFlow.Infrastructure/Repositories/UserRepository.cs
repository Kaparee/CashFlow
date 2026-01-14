using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.ExpressionTranslators.Internal;

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
            .FirstOrDefaultAsync(u => u.UserId == userId);
        }

        public async Task<List<Account>> GetUserAccountsWithDetailsAsync(int userId)
        {
            return await _context.Accounts
                .Where(u => u.UserId == userId && u.IsActive == true)
                .ToListAsync();
        }

        public async Task AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> IsEmailTakenAsync(string email)
        {
            return await _context.Users
            .AnyAsync(u => u.Email == email);
        }

        public async Task<bool> IsNicknameTakenAsync(string nickname)
        {
            return await _context.Users
            .AnyAsync(u => u.Nickname == nickname);
        }

        public async Task<User?> GetUserByEmailOrNicknameAsync(string emailOrNickname)
        {
            var identifier = emailOrNickname.ToLower();
            var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                (u.Email != null && u.Email.ToLower() == identifier) ||
                (u.Nickname != null && u.Nickname.ToLower() == identifier)
            );
            return user;
        }
    }
}