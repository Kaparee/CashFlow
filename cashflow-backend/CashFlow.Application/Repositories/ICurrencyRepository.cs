using CashFlow.Domain.Models;

//TO DO USUNIÊCIA PO DODANIU PRACOWNIKA

namespace CashFlow.Application.Repositories
{
    public interface ICurrencyRepository
    {
        Task<List<Currency>> GetAllCurrenciesWithDetailsAsync();
        Task AddAsync(Currency currency);
        Task UpdateAsync(Currency currency);
        Task SaveChangesAsync();
    }
}