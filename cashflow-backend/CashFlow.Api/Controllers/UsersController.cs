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
        // Używamy .Include() i .ThenInclude() do pobrania wszystkich powiązanych danych
        var users = await _context.Users
            // Wczytaj kolekcje bezpośrednio powiązane z User
            .Include(u => u.Accounts)
                // W ramach Accounts wczytaj walutę każdego konta
                .ThenInclude(a => a.Currency)
            .Include(u => u.Categories)
                // W ramach Categories wczytaj słowa kluczowe (KeyWords)
                .ThenInclude(c => c.KeyWords)
            .Include(u => u.KeyWords) // Słowa kluczowe bezpośrednio przypisane do Użytkownika
            .Include(u => u.Notifications)
            .Include(u => u.RecTransactions) // Cykliczne transakcje
                                             // Możesz dodać dalsze .Include() dla innych kolekcji, np. Limits
            .ToListAsync();

        return users;
    }
}

