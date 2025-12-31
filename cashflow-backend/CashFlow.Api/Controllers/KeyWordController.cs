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
    public class KeyWordController : ControllerBase
    {
        private readonly IKeyWordService _keyWordService;
        private readonly ICategoryService _categoryService;

        private int CurrentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        public KeyWordController(IKeyWordService keyWordService, ICategoryService categoryService)
        {
            _keyWordService = keyWordService;
            _categoryService = categoryService;
        }

        [HttpGet]
        [Route("key-words-info")]
        public async Task<ActionResult<IEnumerable<KeyWordResponse>>> GetUserKeyWords()
        {
            var categoryDto = await _categoryService.GetUserCategoriesAsync(CurrentUserId);
            return Ok(categoryDto);
        }

        [HttpPost]
        [Route("create-new-key-word")]
        public async Task<IActionResult> CreateNewKeyWord([FromBody] NewKeyWordRequest request)
        {
            try
            {
                await _keyWordService.CreateNewKeyWordAsync(CurrentUserId, request);
                return Created();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("Given Key Word word is already created") || ex.Message.Contains("You must insert a word for KeyWord"))
                {
                    return Conflict(new { message = ex.Message });
                }
                return StatusCode(500, new { message = "An internal server error occured" });
            }
        }
    }
}