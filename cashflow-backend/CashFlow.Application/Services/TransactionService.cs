using CashFlow.Application.Interfaces;
using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;
using BCrypt.Net;

namespace CashFlow.Application.Services
{
    public class TransactionService : ITransactionService
    {
        private readonly ITransactionRepository _transactionRepository;
        private readonly IAccountRepository _accountRepository;
        private readonly IKeyWordRepository _keyWordRepository;
    

        public TransactionService(ITransactionRepository transactionRepository, IAccountRepository accountRepository, IKeyWordRepository keyWordRepository)
        {
            _transactionRepository = transactionRepository;
            _accountRepository = accountRepository;
            _keyWordRepository = keyWordRepository;
        }

        public async Task CreateNewTransactionAsync(int userId, NewTransactionRequest request)
        {
            if (request.CategoryId == null)
            {
                if(request.Description == null)
                {
                    request.Description = string.Empty;
                }
                request.CategoryId = await _keyWordRepository.GetCategoryIdByDescriptionAsync(userId, request.Description);
            }

            if (request.Amount <= 0 || request.Amount == null)
            {
                throw new Exception("Transaction must be greater than 0");
            }
            if (request.AccountId == null)
            {
                throw new Exception("AccountId is required to create a transaction");
            }
            if (request.CategoryId == null)
            {
                throw new Exception("CategoryId is required to create a transaction");
			}

            var account = await _accountRepository.GetAccountByIdAsync(userId, (int)request.AccountId!);

            if (account == null)
            {
                throw new Exception("Account not found or access denied.");
            }

            if(request.Type!.ToLower() == "expense")
            {
                if(account.Balance < request.Amount)
                {
                    throw new Exception("You can not have less than zero money");
                }
                account.Balance -= (decimal)request.Amount!;
            }
            if(request.Type!.ToLower() == "income")
            {
                account.Balance += (decimal)request.Amount!;
            }

            var newTransaction = new Transaction
            {
                UserId = userId!,
                AccountId = (int)request.AccountId!,
                CategoryId = (int)request.CategoryId!,
                Amount = (decimal)request.Amount!,
                Description = request.Description!,
                Type = request.Type!
            };

			await _transactionRepository.AddAsync(newTransaction);
            await _accountRepository.UpdateAsync(account);
		}

        public async Task<List<TransactionResponse>> GetAccountTransactions(int userId, int accountId)
        {
            var transactions = await _transactionRepository.GetAccountTransactionsWithDetailsAsync(userId, accountId);

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
    }
}