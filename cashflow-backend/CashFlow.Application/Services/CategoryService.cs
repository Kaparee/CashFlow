using CashFlow.Application.Interfaces;
using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;
using BCrypt.Net;

namespace CashFlow.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<List<CategoryResponse>> GetUserCategories(int userId)
        {
            var categories = await _categoryRepository.GetUserCategoriesWithDetailsAsync(userId);

            return categories.Select(category => new CategoryResponse
            {
                CategoryId = category.CategoryId,
                Name = category.Name,
                Color = category.Color,
                Type = category.Type,
                LimitAmount = category.LimitAmount,

                KeyWords = category.KeyWords.Select(keyword => new KeyWordResponse
                {
                    WordId = keyword.WordId,
                    Word = keyword.Word,
                }).ToList()
            }).ToList();
        }

        public async Task CreateNewCategoryAsync(int userId, NewCategoryRequest request)
        {
            var isCategoryCreated = await _categoryRepository.isCategoryCreated(userId!, request.Name!);

            if (isCategoryCreated == true)
            {
                throw new Exception($"Given category name is already created in your profile");
            }

            var newCategory = new Category
            {
                UserId = userId!,
                Name = request.Name!,
                Color = request.Color!,
                Icon = request.Icon!,
                Type = request.Type!,
                LimitAmount = request.LimitAmount!
            };

            await _categoryRepository.AddAsync(newCategory);
        }
    }
}