using CashFlow.Application.DTO.Responses;
using CashFlow.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

[Route("api/")]
[ApiController]
public class CurrencyController : ControllerBase
{
    private readonly ICurrencyFetcher _currencyFetcher;

    public CurrencyController(ICurrencyFetcher currencyFetcher)
    {
        _currencyFetcher = currencyFetcher;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CurrencyResponse>>> GetCurrencies()
    {
        return null!;
    }

    [HttpPost("NBP")]
    public async Task<IActionResult> TestNbp()
    {
        var rates = await _currencyFetcher.FetchRatesAsync();
        return Ok(rates);
    }
}