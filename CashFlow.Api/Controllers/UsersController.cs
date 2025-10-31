using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CashFlow.Infrastructure.Data;
using CashFlow.Domain.Models;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly CashFlowDbContext _context;

    public UsersController(CashFlowDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        return await _context.Users.ToListAsync();
    }
}

