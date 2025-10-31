using CashFlow.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Security.Principal;

namespace CashFlow.Infrastructure.Data
{
    public class CashFlowDbContext : DbContext
    {
        public CashFlowDbContext(DbContextOptions<CashFlowDbContext> options)
            : base(options)
        {
        }


        public DbSet<User> Users { get; set; }
        public DbSet<Currency> Currencies { get; set; }
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Limit> Limits { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<RecTransaction> Rec_Transactions { get; set; }
        public DbSet<KeyWord> Key_Words { get; set; }
        public DbSet<Notification> Notifications { get; set; }



        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().ToTable("users");
            modelBuilder.Entity<User>().HasIndex(u => u.Email).IsUnique();

            modelBuilder.Entity<Currency>().ToTable("currencies");

            modelBuilder.Entity<Account>().ToTable("accounts");

            modelBuilder.Entity<Category>().ToTable("categories");

            modelBuilder.Entity<Limit>().ToTable("limits");

            modelBuilder.Entity<Transaction>().ToTable("transactions");

            modelBuilder.Entity<RecTransaction>().ToTable("rec_transactions");

            modelBuilder.Entity<KeyWord>().ToTable("key_words");
            modelBuilder.Entity<KeyWord>()
            .HasIndex(k => new { k.UserId, k.Word })
            .IsUnique();

            modelBuilder.Entity<Notification>().ToTable("notifications");

            base.OnModelCreating(modelBuilder);
        }
    }
}
