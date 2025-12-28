using CashFlow.Application.Interfaces;
using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;
using BCrypt.Net;

namespace CashFlow.Application.Services
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _accountRepository;

        public AccountService(IAccountRepository accountRepository)
        {
            _accountRepository = accountRepository;
        }

        public async Task<List<TransactionResponse>> GetAccountTransactions(int userId, int accountId)
        {
            var transactions = await _accountRepository.GetAccountTransactionsWithDetailsAsync(userId, accountId);

            return transactions.Select(transaction => new TransactionResponse
            {
                TransactionId = transaction.TransactionId,
                Amount = transaction.Amount,
                Description = transaction.Description,
                Date = transaction.Date,
                Type = transaction.Type,

                Category = transaction.Category == null ? null : new CategoryResponse
                {
                    CategoryId = transaction.Category.CategoryId,
                    Name = transaction.Category.Name,
                    Color = transaction.Category.Color,
                    Type = transaction.Category.Type,
                    LimitAmount = transaction.Category.LimitAmount,
                }
            }).ToList();
        }

        public async Task CreateNewAccountAsync(int userId, NewAccountRequest request)
        {
            var isAccountCreated = await _accountRepository.isAccountCreated(userId!, request.Name!);

            if (isAccountCreated == true)
            {
                throw new Exception("Given account name is already created in your profile");
            }

            var newAccount = new Account
            {
                UserId = userId!,
                Name = request.Name!,
                Balance = (decimal)request.Balance!,
                CurrencyCode = request.CurrencyCode!,
                PhotoUrl = request.PhotoUrl!,
                IsActive = true,
            };

            await _accountRepository.AddAsync(newAccount);
        }
    }
}