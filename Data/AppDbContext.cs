using Microsoft.EntityFrameworkCore;
using LoadingAPI.Models;

namespace LoadingAPI.Data
{
    // Definerer databasekonteksten for applikasjonen
    public class AppDbContext : DbContext
    {
        // Definerer DbSet for Session som representerer Sessions-tabellen i databasen
        public DbSet<Session> Sessions { get; set; }
        // Definerer DbSet for Vote som representerer Votes-tabellen i databasen
        public DbSet<Vote> Votes { get; set; }

        // Konstruktør som tar DbContextOptions som parameter
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Konfigurerer modellene ved opprettelse av databasen
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Konfigurerer relasjonen mellom Session og Scenario
            modelBuilder.Entity<Session>()
                .OwnsMany(s => s.Scenarios, a =>
                {
                    a.WithOwner().HasForeignKey("SessionId"); // Setter utenlandsk nøkkel
                    a.Property<int>("Id"); // Definerer Id-egenskapen
                    a.HasKey("Id"); // Setter Id som primærnøkkel
                });

            // Legg til unike begrensninger og nødvendige egenskaper
            modelBuilder.Entity<Session>()
                .Property(s => s.Title)
                .IsRequired()
                .HasMaxLength(100);

            modelBuilder.Entity<Session>()
                .Property(s => s.CurrentOption)
                .HasMaxLength(100);

            modelBuilder.Entity<Vote>()
                .Property(v => v.UserId)
                .IsRequired()
                .HasMaxLength(50);

            modelBuilder.Entity<Vote>()
                .Property(v => v.Choice)
                .IsRequired()
                .HasMaxLength(100);
        }
    }
}
