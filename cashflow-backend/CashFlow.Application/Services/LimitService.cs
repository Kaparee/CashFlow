using CashFlow.Application.Interfaces;
using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;
using BCrypt.Net;

namespace CashFlow.Application.Services
{
    public class LimitService : ILimitService
    {
        private readonly ILimitRepository _limitRepository;
        private readonly ICategoryRepository _categoryRepository;

        public LimitService(ILimitRepository limitRepository, ICategoryRepository categoryRepository)
        {
            _limitRepository = limitRepository;
            _categoryRepository = categoryRepository;
        }

        public async Task CreateNewLimitAsync(int userId, NewLimitRequest request)
        {
            if(request.EndDate < request.StartDate)
            {
                throw new Exception("End date can not be earlier than the start date");
            }

            var userCategory = await _categoryRepository.GetUserCategoriesWithDetailsAsync(userId);
            if(!userCategory.Any(c => c.CategoryId == request.CategoryId))
            {
                throw new Exception("Category does not exist or is not your");
            }

            var newLimit = new Limit
            {
                CategoryId = (int)request.CategoryId!,
                Name = request.Name!,
                Value = (decimal)request.Value!,
                Description = request.Description!,
                StartDate = (DateTime)request.StartDate!,
                EndDate = (DateTime)request.EndDate!
            };
            await _limitRepository.AddAsync(newLimit);
        }

        public async Task<List<LimitResponse>> GetLimitsAsync(int userId)
        {
            var limits = await _limitRepository.GetUserLimitsAsync(userId);

            return limits.Select(limit => new LimitResponse
            {
                LimitId = limit.LimitId,
                Name = limit.Name,
                Value = limit.Value,
                StartDate = limit.StartDate,
                EndDate = limit.EndDate,

                CategoryName = limit.Category.Name,
                CategoryIcon = limit.Category.Icon

            }).ToList();
        }
    }
}