using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.ExpressionTranslators.Internal;

namespace CashFlow.Infrastructure.Repositories
{
	public class TransactionRepository : ITransactionRepository
	{
		private readonly CashFlowDbContext _context;

		public TransactionRepository(CashFlowDbContext context)
		{
			_context = context;
		}

		public async Task AddAsync(Transaction transaction)
		{
			_context.Transactions.Add(transaction);
			await _context.SaveChangesAsync();
		}

        public async Task<List<Transaction>> GetAccountTransactionsWithDetailsAsync(int userId, int accountId)
        {
            return await _context.Transactions
                .Include(c => c.Category)
                .Where(a => a.AccountId == accountId && a.UserId == userId && a.DeletedAt == null)
                .ToListAsync();
        }

		public async Task UpdateAsync(Transaction transaction)
		{
			_context.Transactions.Update(transaction);
			await _context.SaveChangesAsync();
		}

		public async Task<Transaction?> GetTransactionInfoByIdWithDetailsAsync(int userId, int transactionId)
		{
			return await _context.Transactions
				.Where(t => t.UserId == userId && t.TransactionId == transactionId && t.DeletedAt == null)
				.FirstOrDefaultAsync();
		}
    }
}