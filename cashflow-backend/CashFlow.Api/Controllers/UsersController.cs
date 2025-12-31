using Microsoft.AspNetCore.Mvc;
using CashFlow.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using CashFlow.Infrastructure.Data;
using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CashFlow.Api.Controllers
{
    [Authorize]
    [Route("api/")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        private int CurrentUserId => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        [Route("register")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterRequest request)
        {
            try
            {
                await _userService.RegisterAsync(request);
                return Created();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("email or nickname is taken"))
                {
                    return Conflict(new { message = ex.Message });
                }
                return StatusCode(500, new { message = "An internal server error occured" });
            }
        }

        [HttpPost]
        [Route("login")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponse>> LoginUser([FromBody] LoginRequest request)
        {
            try
            {
                var token = await _userService.LoginAsync(request);
                return Ok(token);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        [Route("login-info")]
        public async Task<ActionResult<UserResponse>> GetUser()
        {
            try
            {
                var userDto = await _userService.GetUserByIdAsync(CurrentUserId);
                return Ok(userDto);
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains("User was not found"))
                {
                    return NotFound();
                }
                throw;
            }
            
        }

        [HttpGet]
        [Route("verify")]
        [AllowAnonymous]
        public async Task<ActionResult> VerifyEmail([FromQuery] string verificationToken)
        {
            try
            {
                await _userService.VerifyEmailAsync(verificationToken);
                return Ok("Poprawnie zweryfikowano!");
            }
            catch(Exception ex)
            {
                if(ex.Message.Contains("Invalid token"))
                {
                    return NotFound();
                }
                throw;
            }
        }
    }
}
