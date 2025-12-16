using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL.Query.ExpressionTranslators.Internal;

namespace CashFlow.Infrastructure.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly CashFlowDbContext _context;

        public CategoryRepository(CashFlowDbContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetUserCategoriesWithDetailsAsync(int userId)
        {
            return await _context.Categories
                .Include(c => c.KeyWords)
                .Where(a => a.UserId == userId)
                .ToListAsync();
        }

        public async Task<bool> isCategoryCreated(int userId, string name)
        {
            return await _context.Categories
                .AnyAsync(c => c.UserId == userId && c.Name == name);
        }

        public async Task AddAsync(Category category)
        {
            _context.Categories.Add(category);
            await _context.SaveChangesAsync();
        }
    }
}