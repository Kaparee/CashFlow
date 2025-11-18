using FluentValidation;
using CashFlow.Application.DTO.Requests;

namespace CashFlow.Application.Validators
{
    public class RegisterRequestValidator : AbstractValidator<RegisterRequest>
    {
        public RegisterRequestValidator()
        {
            RuleFor(request => request.Password).NotEmpty();
            RuleFor(request => request.Password).MinimumLength(8);
            RuleFor(request => request.Password)
                .Matches("(?=.*\\d)")
                .WithMessage("Has³o musi zawieraæ przynajmniej jedn¹ cyfrê.");
            RuleFor(request => request.Password)
                .Matches("(?=.*[a-z])")
                .WithMessage("Has³o musi zawieraæ przynajmniej jedn¹ ma³¹ literê.");
            RuleFor(request => request.Password)
                .Matches("(?=.*[A-Z])")
                .WithMessage("Has³o musi zawieraæ przynajmniej jedn¹ du¿¹ literê.");
            RuleFor(request => request.Password)
                .Matches("(?=.*[!@#$%^&*-_])")
                .WithMessage("Has³o musi zawieraæ przynajmniej jeden znak specjalny.");

            RuleFor(request => request.Email).NotEmpty().EmailAddress();

            RuleFor(request => request.FirstName).NotEmpty();
            RuleFor(request => request.LastName).NotEmpty();
            RuleFor(request => request.Nickname).NotEmpty();
        }
    }
}