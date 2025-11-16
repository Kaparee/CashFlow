using Microsoft.AspNetCore.Mvc;
using CashFlow.Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using CashFlow.Infrastructure.Data;
using CashFlow.Application.DTO;
using System.Linq;
using System.Threading.Tasks;

namespace CashFlow.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponse>> GetUser(int id)
        { 
            try
            {
                var userDto = await _userService.GetUserByIdAsync(id);
                return Ok(userDto);
            } catch (Exception ex)
            {
                if (ex.Message.Contains("not found"))
                {
                    return NotFound();
                }
                throw;
            }
        }

        [HttpPost]

    }
}