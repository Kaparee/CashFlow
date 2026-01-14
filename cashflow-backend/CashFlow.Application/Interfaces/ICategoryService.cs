using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;

namespace CashFlow.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<List<CategoryResponse>> GetUserCategories(int userId);
        Task CreateNewCategoryAsync(int userId, NewCategoryRequest request);
    }
}