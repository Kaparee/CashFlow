using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.ExpressionTranslators.Internal;

namespace CashFlow.Infrastructure.Repositories
{
    public class AccountRepository : IAccountRepository
    {
        private readonly CashFlowDbContext _context;

        public AccountRepository(CashFlowDbContext context)
        {
            _context = context;
        }

        public async Task<List<Transaction>> GetAccountTransactionsWithDetailsAsync(int userId, int accountId)
        {
            return await _context.Transactions
                .Where(a => a.AccountId == accountId && a.UserId == userId)
                .ToListAsync();
        }
    }
}