<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230826101901 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE continent (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE delivery_mode (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE shipping_cost (id INT AUTO_INCREMENT NOT NULL, continent_id INT DEFAULT NULL, delivery_id INT DEFAULT NULL, cost DOUBLE PRECISION NOT NULL, INDEX IDX_899A02FE921F4C77 (continent_id), INDEX IDX_899A02FE12136921 (delivery_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE shipping_cost ADD CONSTRAINT FK_899A02FE921F4C77 FOREIGN KEY (continent_id) REFERENCES continent (id)');
        $this->addSql('ALTER TABLE shipping_cost ADD CONSTRAINT FK_899A02FE12136921 FOREIGN KEY (delivery_id) REFERENCES delivery_mode (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE shipping_cost DROP FOREIGN KEY FK_899A02FE921F4C77');
        $this->addSql('ALTER TABLE shipping_cost DROP FOREIGN KEY FK_899A02FE12136921');
        $this->addSql('DROP TABLE continent');
        $this->addSql('DROP TABLE delivery_mode');
        $this->addSql('DROP TABLE shipping_cost');
    }
}
