<?php

namespace App\Entity;

use App\Repository\LivraisonRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LivraisonRepository::class)]
class Livraison
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $paysDeLivraison = null;

    #[ORM\Column]
    private ?int $modeDeLivraison = null;

    #[ORM\Column]
    private ?float $prix = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPaysDeLivraison(): ?string
    {
        return $this->paysDeLivraison;
    }

    public function setPaysDeLivraison(string $paysDeLivraison): static
    {
        $this->paysDeLivraison = $paysDeLivraison;

        return $this;
    }

    public function getModeDeLivraison(): ?int
    {
        return $this->modeDeLivraison;
    }

    public function setModeDeLivraison(int $modeDeLivraison): static
    {
        $this->modeDeLivraison = $modeDeLivraison;

        return $this;
    }

    public function getPrix(): ?float
    {
        return $this->prix;
    }

    public function setPrix(float $prix): static
    {
        $this->prix = $prix;

        return $this;
    }
}
