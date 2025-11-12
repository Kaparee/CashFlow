using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CashFlow.Infrastructure.Data;
using CashFlow.Domain.Models;

[Route("api/[controller]")]
[ApiController]

public class CurrencyController : ControllerBase
{
    private readonly CashFlowDbContext _context;
    public CurrencyController(CashFlowDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Currency>>> GetCurrencies()
    {
        return await _context.Currencies.ToListAsync();
    }
}
