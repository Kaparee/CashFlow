using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;
using CashFlow.Application.Interfaces;
using CashFlow.Application.Services;
using CashFlow.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CashFlow.Api.Controllers
{
	[Authorize]
	[Route("api/")]
	[ApiController]
	public class CategoryController : ControllerBase
	{
		private readonly ICategoryService _categoryService;

		private int CurrentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

		public CategoryController(ICategoryService categoryService)
		{
			_categoryService = categoryService;
		}

		[HttpGet]
		[Route("categories-info")]
		public async Task<ActionResult<CategoryResponse>> GetUserCategory()
		{
			var categoryDto = await _categoryService.GetUserCategories(CurrentUserId);
			return Ok(categoryDto);
		}

        [HttpPost]
        [Route("create-new-category")]
		public async Task<IActionResult> CreateNewCategory([FromBody] NewCategoryRequest request)
		{
			try
			{
				await _categoryService.CreateNewCategoryAsync(CurrentUserId, request);
				return Created();
            }
			catch (Exception ex)
			{
				if(ex.Message.Contains("Given category name is already created"))
				{
					return Conflict(new { message = ex.Message });
				}
                return StatusCode(500, new { message = "An internal server error occured" });
            }
		}
    }
}