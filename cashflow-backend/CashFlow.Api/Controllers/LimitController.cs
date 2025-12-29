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
    public class LimitController : ControllerBase
    {
        private readonly ILimitService _limitService;

        private int CurrentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        public LimitController(ILimitService limitService)
        {
            _limitService = limitService;
        }

        [HttpGet]
        [Route("limits-info")]
        public async Task<ActionResult<LimitResponse>> GetUserLimits()
        {
            var limitDto = await _limitService.GetLimitsAsync(CurrentUserId);
            return Ok(limitDto);
        }

        [HttpPost]
        [Route("create-new-limit")]
        public async Task<IActionResult> CreateNewLimit([FromBody] NewLimitRequest request)
        {
            try
            {
                await _limitService.CreateNewLimitAsync(CurrentUserId, request);
                return Created();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("End date can not be earlier than the start date") || ex.Message.Contains("Category does not exist or is not your"))
                {
                    return Conflict(new { message = ex.Message });
                }
                return StatusCode(500, new { message = "An internal server error occured" });
            }
        }
    }
}