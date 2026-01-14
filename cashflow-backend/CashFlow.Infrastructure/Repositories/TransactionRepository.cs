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
	}
}