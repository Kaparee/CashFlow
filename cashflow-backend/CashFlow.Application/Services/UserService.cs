using CashFlow.Application.Interfaces;
using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;

namespace CashFlow.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;

        public UserService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<UserResponse> GetUserByIdAsync(int userId)
        {
            var user = await _userRepository.GetUserByIdWithDetailsAsync(userId);

            if(user == null)
            {
                throw new Exception($"User with ID {userId} not found");
            }

            return new UserResponse
            {
                UserId = user.UserId,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Nickname = user.Nickname,
                Email = user.Email,
                IsActive = user.IsActive,
                IsAdmin = user.IsAdmin,
                IsVerified = user.IsVerified,
                PhotoUrl = user.PhotoUrl,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,

                Accounts = user.Accounts.Select(a => new AccountResponse
                {
                    AccountId = a.AccountId,
                    Name = a.Name,
                    Balance = a.Balance,
                    IsActive = a.IsActive,
                    CurrencyCode = a.CurrencyCode,

                    Currency = new CurrencyResponse
                    {
                        CurrencyCode = a.Currency.CurrencyCode,
                        Name = a.Currency.Name,
                        Symbol = a.Currency.Symbol
                    }
                }).ToList(),
                Categories = user.Categories.Select(c => new CategoryResponse
                {
                    CategoryId = c.CategoryId,
                    Name = c.Name,
                    Color = c.Color,
                    Type = c.Type,
                    LimitAmount = c.LimitAmount,

                    KeyWords = c.KeyWords.Select(k => new KeyWordResponse
                    {
                        WordId = k.WordId,
                        Word = k.Word,
                    }).ToList()
                }).ToList(),

                Transactions = user.Transactions.Select(t => new TransactionResponse
                {
                    TransactionId = t.TransactionId,
                    Amount = t.Amount,
                    Description = t.Description,
                    Date = t.Date,
                    Type = t.Type,
                    AccountId = t.AccountId,
                    CategoryId = t.CategoryId
                }).ToList(),

                RecTransactions = user.RecTransactions.Select(r => new RecTransactionResponse
                {
                    RecTransactionId = r.RecTransactionId,
                    Name = r.Name,
                    Amount = r.Amount,
                    Frequency = r.Frequency,
                    StartDate = r.StartDate,
                    EndDate = r.EndDate,
                    Type = r.Type
                }).ToList(),

                Notifications = user.Notifications.Select(n => new NotificationResponse
                {
                    NotificationId = n.NotificationId,
                    Subject = n.Subject,
                    Body = n.Body,
                    SentAt = n.SentAt,
                    Status = n.Status
                }).ToList(),
            };
        }

        public async Task<string> RegisterAsync(RegisterRequest request)
        {
            var isEmailTaken = await _userRepository.IsEmailTakenAsync(request.Email!);
            var isNicknameTaken = await _userRepository.IsNicknameTakenAsync(request.Nickname!);

            if (isEmailTaken == true || isNicknameTaken == true)
            {
                throw new Exception($"Given email or nickname is taken!");
            }

            var newUser = new User
            {
                FirstName = request.FirstName!,
                LastName = request.LastName!,
                Email = request.Email!,
                Nickname = request.Nickname!,
                PasswordHash = request.Password!,
                IsAdmin = false,
                IsActive = true
            };

            await _userRepository.AddAsync(newUser);
            return "2137" + newUser.Nickname;
        }
    }
}