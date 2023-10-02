<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20230824180345 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cart_item ADD commande_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE cart_item ADD CONSTRAINT FK_F0FE2527A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE cart_item ADD CONSTRAINT FK_F0FE252782EA2E54 FOREIGN KEY (commande_id) REFERENCES `order` (id)');
        $this->addSql('CREATE INDEX IDX_F0FE2527A76ED395 ON cart_item (user_id)');
        $this->addSql('CREATE INDEX IDX_F0FE252782EA2E54 ON cart_item (commande_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE cart_item DROP FOREIGN KEY FK_F0FE2527A76ED395');
        $this->addSql('ALTER TABLE cart_item DROP FOREIGN KEY FK_F0FE252782EA2E54');
        $this->addSql('DROP INDEX IDX_F0FE2527A76ED395 ON cart_item');
        $this->addSql('DROP INDEX IDX_F0FE252782EA2E54 ON cart_item');
        $this->addSql('ALTER TABLE cart_item DROP commande_id');
    }
}
