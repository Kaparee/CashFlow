using CashFlow.Application.Interfaces;
using CashFlow.Application.Repositories;
using CashFlow.Domain.Models;
using CashFlow.Application.DTO.Requests;
using CashFlow.Application.DTO.Responses;
using BCrypt.Net;

namespace CashFlow.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJWTService _jwtService;

        public UserService(IUserRepository userRepository, IJWTService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task RegisterAsync(RegisterRequest request)
        {
            var isEmailTaken = await _userRepository.IsEmailTakenAsync(request.Email!);
            var isNicknameTaken = await _userRepository.IsNicknameTakenAsync(request.Nickname!);

            if (isEmailTaken == true || isNicknameTaken == true)
            {
                throw new Exception($"Given email or nickname is taken!");
            }

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                FirstName = request.FirstName!,
                LastName = request.LastName!,
                Email = request.Email!,
                Nickname = request.Nickname!,
                PasswordHash = passwordHash,
                IsAdmin = false,
                IsActive = true
            };

            await _userRepository.AddAsync(newUser);
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            var user = await _userRepository.Exists(request.EmailOrNickname!);

            if (user is null) { throw new Exception("User does not exist!"); }

            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)) { throw new Exception("Password is invalid!"); }

            var token = _jwtService.GenerateToken(user);

            LoginResponse response = new LoginResponse();
            response.Token = token;

            return response;
        }

        public async Task<UserResponse> GetUserByIdAsync(int userId)
        {
            var user = await _userRepository.GetUserByIdWithDetailsAsync(userId);

            if(user == null)
            {
                throw new Exception("User was not found");
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
            };
        }

        public async Task<List<AccountResponse>> GetUserAccounts(int userId)
        {
            var accounts = await _userRepository.GetUserAccountsWithDetailsAsync(userId);

            if(accounts == null || !accounts.Any())
            {
                throw new Exception("User does not have any accounts");
            }

            return accounts.Select(account => new AccountResponse
            {
                AccountId = account.AccountId!,
                Name = account.Name!,
                Balance = account.Balance!,
                CurrencyCode = account.CurrencyCode!,
            }).ToList();
        }
    }
}